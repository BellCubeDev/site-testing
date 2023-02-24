/** fomod-builder-steps files contains code for the FOMOD Builder steps page.
    This file in particular contains code for the 1st-party FOMOD Builder steps builder.

    Other fomod-builder-steps files provide code for their respective builders.

    @author BellCube Dev
    @namespace - fomod-builder-steps
 */

import * as mainClasses from './fomod-builder-classifications.js';
import * as mainUI from './fomod-builder-ui.js';
import { registerUpgrade, BCDDropdown, registerForEvents, unregisterForEvents, UpdatableObject, BCDSummary } from '../../universal.js';
import { updatePluralDisplay } from './fomod-builder-ui.js';
import { componentHandler } from '../../assets/site/mdl/material.js';

import Sortable_ from '../../included_node_modules/sortablejs/modular/sortable.esm.js';
import type Sortable__ from '../../../node_modules/@types/sortablejs/index';

// https://www.npmjs.com/package/sortablejs
const Sortable = Sortable_ as unknown as typeof Sortable__;

export const sortableSettings = {
    animation: 250,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    fallbackClass: 'sortable-fallback',
    bubbleScroll: true,
    dataIdAttr: 'data-id',
    delay: 200,
    delayOnTouchOnly: true,
    direction: 'vertical',

    //emptyInsertThreshold: 5,
    //swapThreshold: 1.05,

    handle: '.builder-steps-drag-handle',
    sort: true,
} as const satisfies Sortable__.Options;

export const sortableSettings_steps = {
    ...sortableSettings,

    group: 'steps',
    draggable: '.builder-steps-step',
} as const satisfies Sortable__.Options;

export const sortableSettings_groups = {
    ...sortableSettings,

    group: 'groups',
    draggable: '.builder-steps-group',
} as const satisfies Sortable__.Options;

export const sortableSettings_options = {
    ...sortableSettings,

    group: 'options',
    draggable: '.builder-steps-option',
} as const satisfies Sortable__.Options;

const deleteButtonTemplate = (document.getElementById('builder-main-steps-delete-button') as HTMLTemplateElement).content.firstElementChild as HTMLButtonElement;
const dragHandleTemplate = (document.getElementById('builder-main-steps-drag-handle') as HTMLTemplateElement).content.firstElementChild as HTMLButtonElement;

async function prefabCardDestroy(card:Step|Group|Option) {
    const main = card.main;

        const previousElemStyle = (card.main.previousSibling as HTMLElement|null)?.style;
        if (previousElemStyle) previousElemStyle.zIndex = '1';

        const summary = card.main.querySelector(':scope > .js-bcd-summary')?.upgrades?.get(BCDSummary);
        if (summary) await summary.close(false, false, true, 500);

        main.classList.add('animating-out');
        if (getComputedStyle(main).animationName === 'none') return card.main.remove();

        function finalize() {
            if (previousElemStyle) previousElemStyle.zIndex = '';
            console.log(summary);
            main.remove();
        }

        //afterDelay(400, finalize);
        main.addEventListener('animationend', finalize, {once: true});
}

async function prefabCardUpdate(card:Step|Group|Option) {
    const setWithSelf =
        card instanceof Step ? card.parent.inherited.parent?.steps
        : card instanceof Group ? card.parent.inherited.parent?.groups
        : /*card instanceof Option ?*/ card.parent.inherited.parent?.options;

    requestAnimationFrame(() => {
        if (setWithSelf?.size === 1) {
            card.deleteButton.style.opacity = '0.1';
            card.deleteButton.style.pointerEvents = 'none';
            card.deleteButton.disabled = true;
            card.deleteButton.setAttribute('aria-disabled', 'true');

        } else if (card.deleteButton.disabled) {
            card.deleteButton.style.opacity = '1';
            card.deleteButton.style.pointerEvents = 'auto';
            card.deleteButton.disabled = false;
            card.deleteButton.removeAttribute('aria-disabled');
        }
    });
}

async function prefabSortableUpdate(bindingWithSortable: Fomod|Step|Group) {
    let setWithChildren: Set<mainClasses.FOMODElementProxy>;
    let childrenDiv: HTMLDivElement|undefined;

    if (bindingWithSortable instanceof Fomod)  {
        setWithChildren = bindingWithSortable.parent.steps;
        childrenDiv = bindingWithSortable.parent.stepsContainers['1st-party'];
    } else if (bindingWithSortable instanceof Step)  {
        setWithChildren = bindingWithSortable.parent.groups;
        childrenDiv = bindingWithSortable.parent.groupsContainers['1st-party'];
    } else /*if (bindingWithSortable instanceof Group) */ {
        setWithChildren = bindingWithSortable.parent.options;
        childrenDiv = bindingWithSortable.parent.optionsContainers['1st-party'];
    }

    requestAnimationFrame(() => {
        if (setWithChildren.size === 1) {
            bindingWithSortable.sortable.option('ignore', '*');
            childrenDiv?.classList.add('no-sorting');
        } else {
            bindingWithSortable.sortable.option('ignore', undefined);
            childrenDiv?.classList.remove('no-sorting');
        }
    });
}


/** Manages the first-party editor for entire FOMODs */
export class Fomod extends UpdatableObject {
    parent: mainClasses.Fomod;

    main: HTMLDivElement;

    nameInput: HTMLInputElement;

    /** The name of the mod */
    get name(): string { return this.parent.moduleName; } set name(value: string) { this.parent.moduleName = value; }

    imageInput: HTMLInputElement;

    /** The image of the mod */
    get image(): string { return this.parent.metaImage; } set image(value: string) { this.parent.metaImage = value; }

    sortOrderMenu: HTMLMenuElement;
    get sortOrder(): mainClasses.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: mainClasses.SortOrder) { this.parent.sortingOrder = value; }

    addStepBtn: HTMLButtonElement;

    sortable: InstanceType<typeof Sortable>;

    // I can't be bothered to explicitly set types on this
    private changeEvtObj;
    private dropdownEvtObj;
    private addStepEvtObj;

    constructor(parent: mainClasses.Fomod) {
        super();

        this.parent = parent;

        this.changeEvtObj = {change: this.updateFromInput_bound};
        this.dropdownEvtObj = {dropdownInput: this.updateFromInput_bound};
        this.addStepEvtObj = {activate: parent.addStep_bound.bind(parent, undefined, undefined)};


        this.main = document.getElementById("steps-builder-container") as HTMLDivElement;
        const stepsContainer = this.main.querySelector<HTMLDivElement>('div.builder-steps-steps-container')!;
        this.parent.stepsContainers['1st-party'] = stepsContainer;

        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        } as const satisfies Sortable__.Options;
        this.sortable = new Sortable(stepsContainer, Object.assign(sortableEvents, sortableSettings_steps));

        this.nameInput = this.main.querySelector('input.builder-steps-mod-name')!;
        registerForEvents(this.nameInput, this.changeEvtObj);

        this.imageInput = this.main.querySelector('.builder-steps-mod-image input')!;
        registerForEvents(this.imageInput, this.changeEvtObj);

        this.sortOrderMenu = this.main.querySelector('menu.bcd-dropdown-sorting-order')!;
        registerForEvents(this.sortOrderMenu, this.dropdownEvtObj);

        this.addStepBtn = this.main.querySelector('button.builder-steps-add-child-btn')!;

        registerForEvents(this.addStepBtn, this.addStepEvtObj);
        registerUpgrade(this.main, this, null, false, true);
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;
        this.image = this.imageInput.value;
        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;
    }

    override update_() {

        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('input'));

        this.imageInput.value = this.image; this.imageInput.dispatchEvent(new Event('input'));

        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));

        prefabSortableUpdate(this);
    }

    override destroy_(): void {
        this.suppressUpdates = true;
        this.nameInput.value = '';
        this.imageInput.value = '';
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(window.FOMODBuilder.storage.settings.defaultSortingOrder);
        unregisterForEvents(this.nameInput, this.changeEvtObj);
        unregisterForEvents(this.imageInput, this.changeEvtObj);
        unregisterForEvents(this.sortOrderMenu, this.dropdownEvtObj);
        unregisterForEvents(this.addStepBtn, this.addStepEvtObj);
    }

    onSort(event: Sortable__.SortableEvent, added = false) {
        if (event.from !== event.to && !added) return console.debug('Not sorting', this, event);
        if (event.newIndex === undefined || (!added && event.newIndex === event.oldIndex)) return console.debug('No index change', this, event);

        const displayStep = event.item.upgrades?.get(Step);
        if (!displayStep) return console.error('Step not found!', this, event);

        this.parent.steps.moveIndex(displayStep.parent, event.newIndex);
        this.parent.update();
    }
    readonly onSort_bound = this.onSort.bind(this);

    onAdd(event: Sortable__.SortableEvent) {
        if (event.from === event.to || event.to !== this.parent.stepsContainers['1st-party']) return console.debug('Not adding', this, event);
        const displayStep = event.item.upgrades?.get(Step);
        if (!displayStep) return console.error('Step not found!', this, event);

        displayStep.parent.inherited.parent = this.parent;

        this.parent.steps.add(displayStep.parent);
        this.onSort(event, true);

        this.parent.updateWhole();
    }
    readonly onAdd_bound = this.onAdd.bind(this);

    onRemove(event: Sortable__.SortableEvent) {
        if (event.from === event.to || event.from !== this.parent.stepsContainers['1st-party']) return console.debug('Not removing', this, event);
        const displayStep = event.item.upgrades?.get(Step);
        if (!displayStep) return console.error('Step not found!', this, event);

        this.parent.steps.delete(displayStep.parent);

        this.parent.updateWhole();
    }
    readonly onRemove_bound = this.onRemove.bind(this);
}
mainClasses.addUpdateObjects(mainClasses.Fomod, Fomod);

const stepTemplate = (document.getElementById('builder-main-steps-step') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;
/** Manages the first-party editor for FOMOD Steps */
export class Step extends UpdatableObject {
    parent: mainClasses.Step;

    main: HTMLDivElement;
    nameDisplay: HTMLSpanElement;
    groupCountDisplay: HTMLSpanElement;
    optionCountDisplay: HTMLSpanElement;

    get name(): string { return this.parent.name; } set name(value: string) { this.parent.name = value; }
    nameInput: HTMLInputElement;

    get sortOrder(): mainClasses.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: mainClasses.SortOrder) { this.parent.sortingOrder = value; }
    sortOrderMenu: HTMLMenuElement;

    addGroupBtn: HTMLButtonElement;
    deleteButton: HTMLButtonElement;

    sortable: InstanceType<typeof Sortable>;

    constructor (parent: mainClasses.Step) {
        super();
        this.parent = parent;

        this.main = stepTemplate.cloneNode(true) as HTMLDivElement;

        const groupsContainer = this.main.querySelector<HTMLDivElement>('div.builder-steps-group-container')!;
        this.parent.groupsContainers['1st-party'] = groupsContainer;


        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        } as const satisfies Sortable__.Options;
        this.sortable = new Sortable(groupsContainer, Object.assign(sortableEvents, sortableSettings_groups));

        this.nameInput = this.main.querySelector('input.bcd-builder-input')!;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.sortOrderMenu = this.main.querySelector('menu.bcd-dropdown-sorting-order')!;
        registerForEvents(this.sortOrderMenu, {dropdownInput: this.updateFromInput_bound});

        this.addGroupBtn = this.main.querySelector('button.builder-steps-add-child-btn')!;
        registerForEvents(this.addGroupBtn, {activate: parent.addGroup_bound.bind(parent, undefined, undefined)});

        this.nameDisplay = this.main.querySelector('.builder-steps-step-title span.name')!;
        this.groupCountDisplay = this.main.querySelector('span.builder-steps-step-group-count')!;
        this.optionCountDisplay = this.main.querySelector('span.builder-steps-step-option-count')!;

        this.deleteButton = deleteButtonTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);

        const dragHandle = dragHandleTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(dragHandle, this.main.firstElementChild);

        registerForEvents(this.deleteButton, {activate: parent.destroy.bind(parent)});
        registerUpgrade(this.main, this, null, false, true);

        const stepContainer = this.parent.inherited.containers?.['1st-party'] as HTMLDivElement;
        if (!stepContainer) {console.warn('Step container not found!'); return;}

        if (this.main.style.animationName !== 'none'){
            const previousSibling = stepContainer.lastElementChild instanceof HTMLElement ? stepContainer.lastElementChild : undefined;

            if (previousSibling) {
                const main = this.main;

                previousSibling.style.zIndex = '1';
                main.classList.add('animating-in');

                // eslint-disable-next-line func-style -- I only want to init the function within an if statement
                const removeIndex = function() {
                    previousSibling.style.zIndex = '';
                    main.classList.remove('animating-in');

                    main.removeEventListener('animationend', removeIndex);
                };

                //afterDelay(400, removeIndex);
                main.addEventListener('animationend', removeIndex, {once: true});
            }
        }

        stepContainer.appendChild(this.main);

        queueMicrotask(()=>  componentHandler.upgradeElements(this.main)  );
    }

    override update_() {
        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('input'));
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));

        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.groupCountDisplay, this.parent.groups.size);
        updatePluralDisplay(this.optionCountDisplay, [...this.parent.groups].reduce((currentCount, group) => currentCount + group.options.size, 0));

        prefabCardUpdate(this);
        prefabSortableUpdate(this);
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;

        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        this.nameDisplay.textContent = this.name;
    }

    override destroy_() { prefabCardDestroy(this); }

    onSort(event: Sortable__.SortableEvent) {
        if (event.newIndex === undefined || (event.from === event.to && event.newIndex === event.oldIndex)) return console.warn('Invalid sort event!', this, event);
        const displayGroup = event.item.upgrades?.get(Group);
        if (!displayGroup) return console.error('Group not found!', this, event);

        this.parent.groups.moveIndex(displayGroup.parent, event.newIndex);
        this.parent.update();
    }
    readonly onSort_bound = this.onSort.bind(this);

    onAdd(event: Sortable__.SortableEvent) {
        if (event.from === event.to || event.to !== this.parent.groupsContainers['1st-party']) return console.warn('Invalid add event!', this, event);
        const displayGroup = event.item.upgrades?.get(Group);
        if (!displayGroup) return console.error('Group not found!', this, event);

        displayGroup.parent.inherited.parent = this.parent;

        this.parent.groups.add(displayGroup.parent);
        this.onSort(event);
        this.parent.updateWhole();
    }
    readonly onAdd_bound = this.onAdd.bind(this);

    onRemove(event: Sortable__.SortableEvent) {
        if (event.from === event.to || event.from !== this.parent.groupsContainers['1st-party']) return console.warn('Invalid remove event!', this, event);
        const displayGroup = event.item.upgrades?.get(Group);
        if (!displayGroup) return console.error('Group not found!', this, event);

        this.parent.groups.delete(displayGroup.parent);
        this.parent.updateWhole();
    }
    readonly onRemove_bound = this.onRemove.bind(this);
}
mainClasses.addUpdateObjects(mainClasses.Step, Step);


const groupTemplate = (document.getElementById('builder-main-steps-group') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;
/** Manages the first-party editor for FOMOD Groups */
export class Group extends UpdatableObject {
    parent: mainClasses.Group;

    main: HTMLDivElement;
    nameDisplay: HTMLSpanElement;
    optionCountDisplay: HTMLSpanElement;

    get name(): string { return this.parent.name; } set name(value: string) { this.parent.name = value; }
    nameInput: HTMLInputElement;

    get sortOrder(): mainClasses.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: mainClasses.SortOrder) { this.parent.sortingOrder = value; }
    sortOrderMenu: HTMLMenuElement;

    get selectionType(): mainClasses.GroupSelectType { return this.parent.type; } set selectionType(value: mainClasses.GroupSelectType) { this.parent.type = value; }
    selectionTypeMenu: HTMLMenuElement;

    addOptionBtn: HTMLButtonElement;
    deleteButton: HTMLButtonElement;

    sortable: InstanceType<typeof Sortable>;

    constructor (parent: mainClasses.Group) {
        super();
        this.parent = parent;

        this.main = groupTemplate.cloneNode(true) as HTMLDivElement;

        const optionsContainer = this.main.querySelector<HTMLDivElement>('div.builder-steps-option-container')!;
        this.parent.optionsContainers['1st-party'] = optionsContainer;
        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        } as const satisfies Sortable__.Options;
        this.sortable = new Sortable(optionsContainer, Object.assign(sortableEvents, sortableSettings_options));

        this.nameInput = this.main.querySelector('input.builder-steps-group-name')!;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.sortOrderMenu = this.main.querySelector('menu.bcd-dropdown-sorting-order')!;
        registerForEvents(this.sortOrderMenu, {dropdownInput: this.updateFromInput_bound});

        this.selectionTypeMenu = this.main.querySelector('menu.bcd-dropdown-group-type')!;
        registerForEvents(this.selectionTypeMenu, {dropdownInput: this.updateFromInput_bound});

        this.addOptionBtn = this.main.querySelector('button.builder-steps-add-child-btn')!;
        registerForEvents(this.addOptionBtn, {activate: parent.addOption_bound.bind(parent, undefined, undefined)});

        this.nameDisplay = this.main.querySelector('span.name')!;
        this.optionCountDisplay = this.main.querySelector('span.builder-steps-group-option-count')!;

        this.deleteButton = deleteButtonTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);

        registerForEvents(this.deleteButton, {activate: parent.destroy.bind(parent)});
        registerUpgrade(this.main, this, null, false, true);

        const dragHandle = dragHandleTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(dragHandle, this.main.firstElementChild);

        const groupContainer = this.parent.inherited.containers?.['1st-party'] as HTMLDivElement;
        if (!groupContainer) {console.warn('Group container not found!'); return;}

        if (this.main.style.animationName !== 'none'){
            const previousSibling = groupContainer.lastElementChild instanceof HTMLElement ? groupContainer.lastElementChild : undefined;

            if (previousSibling) {
                const main = this.main;

                previousSibling.style.zIndex = '1';
                main.classList.add('animating-in');

                // eslint-disable-next-line func-style, sonarjs/no-identical-functions -- I only want to init the function within an if statement
                const removeIndex = function() {
                    previousSibling.style.zIndex = '';
                    main.classList.remove('animating-in');

                    main.removeEventListener('animationend', removeIndex);
                };

                //afterDelay(400, removeIndex);
                main.addEventListener('animationend', removeIndex, {once: true});
            }
        }

        groupContainer.appendChild(this.main);

        queueMicrotask(()=>  componentHandler.upgradeElements(this.main)  );
    }

    override update_() {
        this.nameInput.value = this.name; this.nameDisplay.textContent = this.name;

        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));

        this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.selectionType));

        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.optionCountDisplay, this.parent.options.size);

        prefabCardUpdate(this);
        prefabSortableUpdate(this);
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;

        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        const dropdownObj2 = this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj2) this.selectionType = mainUI.translateDropdown(dropdownObj2.selectedOption) as mainClasses.GroupSelectType;

        this.nameDisplay.textContent = this.name;
    }

    override destroy_() { prefabCardDestroy(this); }

    onSort(event: Sortable__.SortableEvent) {
        if (event.newIndex === undefined || (event.from === event.to && event.newIndex === event.oldIndex)) return console.error('Invalid sort event!', this, event);
        const displayOption = event.item.upgrades?.get(Option);
        if (!displayOption) return console.error('Option not found!', this, event);

        this.parent.options.moveIndex(displayOption.parent, event.newIndex);
        this.parent.update();
    }
    readonly onSort_bound = this.onSort.bind(this);

    onAdd(event: Sortable__.SortableEvent) {
        if (event.from === event.to || event.to !== this.parent.optionsContainers['1st-party']) return console.error('Invalid add event!', this, event);
        const displayOption = event.item.upgrades?.get(Option);
        if (!displayOption) return console.error('Option not found!', this, event);

        displayOption.parent.inherited.parent = this.parent;

        this.parent.options.add(displayOption.parent);
        this.onSort(event);
        this.parent.updateWhole();
    }
    readonly onAdd_bound = this.onAdd.bind(this);

    onRemove(event: Sortable__.SortableEvent) {
        if (event.from === event.to || event.from !== this.parent.optionsContainers['1st-party']) return console.error('Invalid remove event!', this, event);
        const displayOption = event.item.upgrades?.get(Option);
        if (!displayOption) return console.error('Option not found!', this, event);

        this.parent.options.delete(displayOption.parent);
        this.parent.updateWhole();
    }
    readonly onRemove_bound = this.onRemove.bind(this);
}
mainClasses.addUpdateObjects(mainClasses.Group, Group);

const optionTemplate = (document.getElementById('builder-main-steps-option') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;

export class Option extends UpdatableObject {
    parent: mainClasses.Option;

    main: HTMLDivElement;
    nameDisplay: HTMLSpanElement;
    fileCountDisplay: HTMLSpanElement;
    flagCountDisplay: HTMLSpanElement;

    get name(): string { return this.parent.name; } set name(value: string) { this.parent.name = value; }
    nameInput: HTMLInputElement;

    get description(): string { return this.parent.description; } set description(value: string) { this.parent.description = value; }
    descriptionInput: HTMLTextAreaElement;

    get image(): string { return this.parent.image; } set image(value: string) { this.parent.image = value; }
    imageInput: HTMLInputElement;

    editTypeButton: HTMLButtonElement;
    defaultTypeDropdown: HTMLMenuElement;

    deleteButton: HTMLButtonElement;

    constructor (parent: mainClasses.Option) {
        super();
        this.parent = parent;

        this.main = optionTemplate.cloneNode(true) as HTMLDivElement;

        this.nameInput = this.main.querySelector('input.builder-steps-option-name')!;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.descriptionInput = this.main.querySelector('textarea.builder-steps-option-description')!;
        registerForEvents(this.descriptionInput, {change: this.updateFromInput_bound});

        this.imageInput = this.main.querySelector('input.js-relative-image-picker')!;
        registerForEvents(this.imageInput, {change: this.updateFromInput_bound});

        this.editTypeButton = this.main.querySelector('button.builder-steps-condition-edit-btn')!;
        //registerForEvents(this.editTypeButton, {activate: this.editType_bound});

        this.defaultTypeDropdown = this.main.querySelector('menu.bcd-dropdown-option-state')!;
        registerForEvents(this.defaultTypeDropdown, {dropdownInput: this.updateFromInput_bound});

        this.nameDisplay = this.main.querySelector('span.name')!;
        this.fileCountDisplay = this.main.querySelector('span.builder-steps-option-file-count')!;
        this.flagCountDisplay = this.main.querySelector('span.builder-steps-option-flag-count')!;

        this.deleteButton = deleteButtonTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, {activate: parent.destroy.bind(parent)});

        const dragHandle = dragHandleTemplate.cloneNode(true) as HTMLDivElement;
        this.main.insertBefore(dragHandle, this.main.firstElementChild);

        const optionContainer = this.parent.inherited.containers?.['1st-party'] as HTMLDivElement;
        if (!optionContainer) {console.warn('Option container not found!'); return;}

        if (this.main.style.animationName !== 'none'){
            const previousSibling = optionContainer.lastElementChild instanceof HTMLElement ? optionContainer.lastElementChild : undefined;

            if (previousSibling) {
                const main = this.main;

                previousSibling.style.zIndex = '1';
                main.classList.add('animating-in');

                // eslint-disable-next-line func-style, sonarjs/no-identical-functions -- I only want to init the function within an if statement
                const removeIndex = function() {
                    previousSibling.style.zIndex = '';
                    main.classList.remove('animating-in');

                    main.removeEventListener('animationend', removeIndex);
                };

                //afterDelay(400, removeIndex);
                main.addEventListener('animationend', removeIndex, {once: true});
            }
        }

        optionContainer.appendChild(this.main);

        queueMicrotask(()=>  componentHandler.upgradeElements(this.main)  );
    }

    override update_() {
        this.nameInput.value = this.name || '';               this.nameInput.dispatchEvent(new Event('change'));
        this.descriptionInput.value = this.description || ''; this.descriptionInput.dispatchEvent(new Event('change'));
        this.imageInput.value = this.image || '';             this.imageInput.dispatchEvent(new Event('change'));

        this.nameDisplay.textContent = this.name || '';
        updatePluralDisplay(this.fileCountDisplay, this.parent.files.length);
        updatePluralDisplay(this.flagCountDisplay, this.parent.conditionFlags.length);

        prefabCardUpdate(this);
    }

    override updateFromInput_() {
        this.name = this.nameInput.value || '';
        this.description = this.descriptionInput.value || '';
        this.image = this.imageInput.value || '';

        const dropdownObj = this.defaultTypeDropdown.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.parent.typeDescriptor.defaultType = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.OptionType;

        this.nameDisplay.textContent = this.name;
    }

    override destroy_() { prefabCardDestroy(this); }
}
mainClasses.addUpdateObjects(mainClasses.Option, Option);
