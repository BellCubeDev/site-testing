/** fomod-builder-steps files contains code for the FOMOD Builder steps page.
    This file in particular contains code for the 1st-party FOMOD Builder steps builder.

    Other fomod-builder-steps files provide code for their respective builders.

    @author BellCube Dev
    @namespace - fomod-builder-steps
 */

import * as mainClasses from './fomod-builder-classifications.js';
import * as mainUI from './fomod-builder-ui.js';
import { anAnimationFrame, registerUpgrade, BCDDropdown, registerForEvents, unregisterForEvents, UpdatableObject, BCDSummary, animationFrames } from '../../universal.js';
import { updatePluralDisplay } from './fomod-builder-ui.js';
import { componentHandler } from '../../assets/site/mdl/material.js';

import Sortable_ from '../../included_node_modules/sortablejs/modular/sortable.esm.js';
import type Sortable__ from '../../../node_modules/@types/sortablejs/index';

// https://www.npmjs.com/package/sortablejs
const Sortable = Sortable_ as unknown as typeof Sortable__;

export const sortableSettings = {

    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    selectedClass: 'sortable-selected',
    dragClass: 'sortable-drag',
    fallbackClass: 'sortable-fallback',

    handle: '.builder-steps-drag-handle',

    dataIdAttr: 'data-id',

    animation: 250,

    bubbleScroll: true,
    scroll: document.body.querySelector('main')!,
    scrollSensitivity: 128, // in pixels
    scrollSpeed: 64, // in pixels

    delay: 200,
    delayOnTouchOnly: true,

    direction: 'vertical',
    sort: true,

    multiDrag: true,
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

export const sortableSettings_flags = {
    ...sortableSettings,

    group: 'flags',
    draggable: '.builder-steps-option-flag',
} as const satisfies Sortable__.Options;

abstract class CardBase extends UpdatableObject {
    abstract parent?: mainClasses.DependencyFlag|mainClasses.Option|mainClasses.Group|mainClasses.Step|mainClasses.Fomod;
    abstract parentGroup?: Set<NonNullable<CardBase['parent']>>;

    abstract children: Set<mainClasses.FOMODElementProxy>|undefined;
    abstract childrenContainer: HTMLDivElement|undefined;
    abstract childClass: Omit<typeof CardBase, 'new'> & (new(...args: any[]) => CardBase)|undefined;

    main!: HTMLDivElement;
    deleteButton?: HTMLButtonElement;
    dragHandle?: HTMLButtonElement;

    sortable?: InstanceType<typeof Sortable>;

    async updateCard() {
        return await Promise.all([
            this.updateDeleteButton(),
            this.updateSortingHandler(),
        ]);
    }

    override update_() {
        this.updateCard();
    }

    readonly minimumItemsToSort:number = 2;
    readonly minimumChildrenToSort:number = 2;

    async updateDeleteButton(forceState?: boolean) {
        if (!this.deleteButton) return;
        await anAnimationFrame();

        // We set all kinds of attributes in here so that the Details/Summary pair doesn't override them.

        if (this.parentGroup?.size && this.parentGroup.size >= this.minimumItemsToSort) {
            this.deleteButton.style.opacity = '1';
            this.deleteButton.ariaDisabled = 'false';
            this.deleteButton.disabled = false;
            this.deleteButton.setAttribute('data-force-disabled', 'false');
            this.deleteButton.style.pointerEvents = 'auto';
            this.deleteButton.setAttribute('data-force-pointer-events', 'true');
            this.deleteButton.tabIndex = 0;
            this.deleteButton.setAttribute('data-old-tabindex', '0');

        } else {
            this.deleteButton.style.opacity = '0.1';
            this.deleteButton.ariaDisabled = 'true';
            this.deleteButton.disabled = true;
            this.deleteButton.setAttribute('data-force-disabled', 'true');
            this.deleteButton.style.pointerEvents = 'none';
            this.deleteButton.setAttribute('data-force-pointer-events', 'false');
            this.deleteButton.tabIndex = -1;
            this.deleteButton.setAttribute('data-old-tabindex', '-1');

        }
    }

    async updateSortingHandler() {
        if (!this.sortable) return;
        await anAnimationFrame();

        if ((this.children?.size || 0) >= this.minimumChildrenToSort) {
            this.sortable?.option('ignore', undefined);
            this.childrenContainer?.classList.remove('no-sorting');
        } else {
            this.sortable?.option('ignore', '*');
            this.childrenContainer?.classList.add('no-sorting');
        }
    }

    onSort(event: Sortable__.SortableEvent, added = false) {
        if (!this.childClass) return;
        if (event.from !== event.to && !added) return console.debug('Not sorting', this, event);
        if (event.newIndex === undefined || (!added && event.newIndex === event.oldIndex)) return console.debug('No index change', this, event);

        const displayItem = event.item.upgrades?.get(this.childClass);
        if (!displayItem) return console.error('Child Class instance not found!', this, event);

        this.children?.moveIndex(displayItem.parent, event.newIndex);
        this.parent?.update();
    }
    readonly onSort_bound = this.onSort.bind(this);

    onAdd(event: Sortable__.SortableEvent) {
        if (!this.childClass) return;
        if (event.from === event.to || event.to !== this.childrenContainer) return console.debug('Not adding', this, event);

        const displayItem = event.item.upgrades?.get(this.childClass);
        if (!displayItem) return console.error('The FOMOD Builder binding for this item was not found!', this, event);

        if (displayItem.parent.inherited) displayItem.parent.inherited.parent = this.parent;

        this.children?.add(displayItem.parent);
        this.onSort(event, true);

        this.parent?.updateWhole();
    }
    readonly onAdd_bound = this.onAdd.bind(this);

    onRemove(event: Sortable__.SortableEvent) {
        if (!this.childClass) return;
        if (event.from === event.to || event.from !== this.childrenContainer) return console.debug('Not removing', this, event);

        const displayItem = event.item.upgrades?.get(this.childClass);
        if (!displayItem) return console.error('The FOMOD Builder binding for this item was not found!', this, event);

        this.children?.delete(displayItem.parent);

        this.parent?.updateWhole();
    }
    readonly onRemove_bound = this.onRemove.bind(this);

    override async destroy_() {
        const main = this.main;

        const previousElemStyle = (this.main.previousSibling as HTMLElement|null)?.style;
        if (previousElemStyle) previousElemStyle.zIndex = '1';

        const summary = this.main.querySelector(':scope > .js-bcd-summary')?.upgrades?.get(BCDSummary);
        if (summary) await summary.close(false, false, true, 500);

        main.classList.add('animating-out');
        if (getComputedStyle(main).animationName === 'none') return this.main.remove();

        function finalize() {
            if (previousElemStyle) previousElemStyle.zIndex = '';
            main.remove();
        }

        //afterDelay(400, finalize);
        main.addEventListener('animationend', finalize, {once: true});
    }

    animateIn(container: HTMLElement) {
        if (this.main.style.animationName === 'none') return;

        const previousSibling = container.lastElementChild instanceof HTMLElement ? container.lastElementChild : undefined;
        if (!previousSibling) return;

        const main = this.main;

        previousSibling.style.zIndex = '1';
        main.classList.add('animating-in');

        // eslint-disable-next-line func-style -- I only want to init the function within an if statement
        const finalize = function() {
            previousSibling.style.zIndex = '';
            main.classList.remove('animating-in');

            main.removeEventListener('animationend', finalize);
        };

        //afterDelay(400, removeIndex);
        main.addEventListener('animationend', finalize, {once: true});
    }
}

const deleteButtonTemplate = (document.getElementById('builder-main-steps-delete-button') as HTMLTemplateElement).content.firstElementChild as HTMLButtonElement;
const dragHandleTemplate = (document.getElementById('builder-main-steps-drag-handle') as HTMLTemplateElement).content.firstElementChild as HTMLButtonElement;

/** Manages the first-party editor for entire FOMODs */
export class Fomod extends CardBase {
    parent: mainClasses.Fomod;
    parentGroup: undefined;
    get childClass() { return Step; }
    get children() { return this.parent.steps; }
    get childrenContainer() { return this.parent.stepContainers['1st-party']; }

    nameInput: HTMLInputElement;

    /** The name of the mod */
    get name(): string { return this.parent.moduleName; } set name(value: string) { this.parent.moduleName = value; }

    imageInput: HTMLInputElement;

    /** The image of the mod */
    get image(): string { return this.parent.metaImage; } set image(value: string) { this.parent.metaImage = value; }

    sortOrderMenu: HTMLMenuElement;
    get sortOrder(): mainClasses.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: mainClasses.SortOrder) { this.parent.sortingOrder = value; }

    addStepBtn: HTMLButtonElement;

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
        this.parent.stepContainers['1st-party'] = stepsContainer;

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

        this.updateCard();
    }

    override async destroy_() {
        unregisterForEvents(this.nameInput, this.changeEvtObj);
        unregisterForEvents(this.imageInput, this.changeEvtObj);
        unregisterForEvents(this.sortOrderMenu, this.dropdownEvtObj);
        unregisterForEvents(this.addStepBtn, this.addStepEvtObj);
        this.nameInput.value = '';
        this.imageInput.value = '';
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(window.FOMODBuilder.storage.settings.defaultSortingOrder);
    }
}
mainClasses.addUpdateObjects(mainClasses.Fomod, Fomod);

const stepTemplate = (document.getElementById('builder-main-steps-step') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;
/** Manages the first-party editor for FOMOD Steps */
export class Step extends CardBase {
    parent: mainClasses.Step;
    get parentGroup() { return this.parent.inherited?.parent?.steps; }
    get childClass() { return Group; }
    get children() { return this.parent.groups; }
    get childrenContainer() { return this.parent.groupContainers['1st-party']; }

    nameDisplay: HTMLSpanElement;
    groupCountDisplay: HTMLSpanElement;
    optionCountDisplay: HTMLSpanElement;

    get name(): string { return this.parent.name; } set name(value: string) { this.parent.name = value; }
    nameInput: HTMLInputElement;

    get sortOrder(): mainClasses.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: mainClasses.SortOrder) { this.parent.sortingOrder = value; }
    sortOrderMenu: HTMLMenuElement;

    addGroupBtn: HTMLButtonElement;

    constructor (parent: mainClasses.Step) {
        super();
        this.parent = parent;

        this.main = stepTemplate.cloneNode(true) as HTMLDivElement;

        const groupsContainer = this.main.querySelector<HTMLDivElement>('div.builder-steps-group-container')!;
        this.parent.groupContainers['1st-party'] = groupsContainer;


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

        const stepContainer = this.parent.inherited.containers?.['1st-party'] as HTMLDivElement;
        if (!stepContainer) {console.warn('Step container not found!'); return;}

        stepContainer.appendChild(this.main);
        this.animateIn(stepContainer);

        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }

    override update_() {
        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('input'));
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));

        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.groupCountDisplay, this.parent.groups.size);
        updatePluralDisplay(this.optionCountDisplay, [...this.parent.groups].reduce((currentCount, group) => currentCount + group.options.size, 0));

        this.updateCard();
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;

        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        this.nameDisplay.textContent = this.name;
    }
}
mainClasses.addUpdateObjects(mainClasses.Step, Step);


const groupTemplate = (document.getElementById('builder-main-steps-group') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;
/** Manages the first-party editor for FOMOD Groups */
export class Group extends CardBase {
    parent: mainClasses.Group;
    get parentGroup() { return this.parent.inherited?.parent?.groups; }

    get childClass() { return Option; }
    get children() { return this.parent.options; }
    get childrenContainer() { return this.parent.optionContainers['1st-party']; }

    nameDisplay: HTMLSpanElement;
    optionCountDisplay: HTMLSpanElement;

    get name(): string { return this.parent.name; } set name(value: string) { this.parent.name = value; }
    nameInput: HTMLInputElement;

    get sortOrder(): mainClasses.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: mainClasses.SortOrder) { this.parent.sortingOrder = value; }
    sortOrderMenu: HTMLMenuElement;

    get selectionType(): mainClasses.GroupSelectType { return this.parent.type; } set selectionType(value: mainClasses.GroupSelectType) { this.parent.type = value; }
    selectionTypeMenu: HTMLMenuElement;

    addOptionBtn: HTMLButtonElement;

    constructor (parent: mainClasses.Group) {
        super();
        this.parent = parent;

        this.main = groupTemplate.cloneNode(true) as HTMLDivElement;

        const optionsContainer = this.main.querySelector<HTMLDivElement>('div.builder-steps-option-container')!;
        this.parent.optionContainers['1st-party'] = optionsContainer;
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

        const dragHandle = dragHandleTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(dragHandle, this.main.firstElementChild);

        const groupContainer = this.parent.inherited.containers?.['1st-party'] as HTMLDivElement;
        if (!groupContainer) {console.warn('Group container not found!'); return;}

        groupContainer.appendChild(this.main);
        this.animateIn(groupContainer);

        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }

    override update_() {
        this.nameInput.value = this.name; this.nameDisplay.textContent = this.name;

        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));

        this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.selectionType));

        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.optionCountDisplay, this.parent.options.size);

        this.updateCard();
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;

        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        const dropdownObj2 = this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj2) this.selectionType = mainUI.translateDropdown(dropdownObj2.selectedOption) as mainClasses.GroupSelectType;

        this.nameDisplay.textContent = this.name;
    }
}
mainClasses.addUpdateObjects(mainClasses.Group, Group);

const optionTemplate = (document.getElementById('builder-main-steps-option') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;

export class Option extends CardBase {
    parent: mainClasses.Option;
    get parentGroup() { return this.parent.inherited?.parent?.options; }

    get childClass() { return DependencyFlag; }
    get children() { return this.parent.flagsToSet; }
    get childrenContainer() { return this.parent.flagsContainers['1st-party']; }

    nameDisplay: HTMLSpanElement;
    fileCountDisplay: HTMLSpanElement;
    flagCountDisplay: HTMLSpanElement;

    get name(): string { return this.parent.name; } set name(value: string) { this.parent.name = value; }
    nameInput: HTMLInputElement;

    get description(): string { return this.parent.description; } set description(value: string) { this.parent.description = value; }
    descriptionInput: HTMLTextAreaElement;

    get image(): string { return this.parent.image; } set image(value: string) { this.parent.image = value; }
    imageInput: HTMLInputElement;

    editStateConditionsButton: HTMLButtonElement;

    get defaultState(): mainClasses.OptionState { return this.parent.typeDescriptor.defaultState; } set defaultState(value: mainClasses.OptionState) { this.parent.typeDescriptor.defaultState = value; }
    defaultStateDropdown: HTMLMenuElement;

    addFlagBtn: HTMLButtonElement;
    override readonly minimumChildrenToSort = 0;

    private addFlagEvtObj;

    constructor (parent: mainClasses.Option) {
        super();

        this.parent = parent;

        this.addFlagEvtObj = {activate: parent.addFlag_bound.bind(parent, undefined, undefined)};

        this.main = optionTemplate.cloneNode(true) as HTMLDivElement;

        this.nameInput = this.main.querySelector('input.builder-steps-option-name')!;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.descriptionInput = this.main.querySelector('textarea.builder-steps-option-description')!;
        registerForEvents(this.descriptionInput, {change: this.updateFromInput_bound});

        this.imageInput = this.main.querySelector('input.js-relative-image-picker')!;
        registerForEvents(this.imageInput, {change: this.updateFromInput_bound});

        this.editStateConditionsButton = this.main.querySelector('button.builder-steps-condition-edit-btn')!;
        //registerForEvents(this.editTypeButton, {activate: this.editType_bound});

        this.defaultStateDropdown = this.main.querySelector('menu.bcd-dropdown-option-state')!;
        registerForEvents(this.defaultStateDropdown, {dropdownInput: this.updateFromInput_bound});

        this.nameDisplay = this.main.querySelector('span.name')!;
        this.fileCountDisplay = this.main.querySelector('span.builder-steps-option-file-count')!;
        this.flagCountDisplay = this.main.querySelector('span.builder-steps-option-flag-count')!;

        this.deleteButton = deleteButtonTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, {activate: parent.destroy.bind(parent)});

        const flagsContainer = this.main.querySelector('div.builder-steps-option-set-flags-container') as HTMLDivElement;
        this.parent.flagsContainers['1st-party'] = flagsContainer;

        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        } as const satisfies Sortable__.Options;
        this.sortable = new Sortable(flagsContainer, Object.assign(sortableEvents, sortableSettings_flags));

        this.addFlagBtn = this.main.querySelector('.builder-steps-option-set-flags-body button.builder-steps-add-child-btn')!;
        registerForEvents(this.addFlagBtn, this.addFlagEvtObj);

        const dragHandle = dragHandleTemplate.cloneNode(true) as HTMLDivElement;
        this.main.insertBefore(dragHandle, this.main.firstElementChild);

        const optionContainer = this.parent.inherited.containers?.['1st-party'] as HTMLDivElement;
        if (!optionContainer) {console.warn('Option container not found!'); return;}

        this.animateIn(optionContainer);
        optionContainer.appendChild(this.main);

        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }

    override update_() {
        this.nameInput.value = this.name || '';               this.nameInput.dispatchEvent(new Event('change'));
        this.descriptionInput.value = this.description || ''; this.descriptionInput.dispatchEvent(new Event('change'));
        this.imageInput.value = this.image || '';             this.imageInput.dispatchEvent(new Event('change'));

        this.defaultStateDropdown.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.parent.typeDescriptor.defaultState));

        this.nameDisplay.textContent = this.name || '';
        updatePluralDisplay(this.fileCountDisplay, this.parent.files.size);
        updatePluralDisplay(this.flagCountDisplay, this.parent.flagsToSet.size);

        this.updateCard();
    }

    override updateFromInput_() {
        this.name = this.nameInput.value || '';
        this.description = this.descriptionInput.value || '';
        this.image = this.imageInput.value || '';

        const dropdownObj = this.defaultStateDropdown.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.parent.typeDescriptor.defaultState = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.OptionState;

        this.nameDisplay.textContent = this.name;
    }
}
mainClasses.addUpdateObjects(mainClasses.Option, Option);

const dependencyFlagTemplate = (document.getElementById('builder-steps-flag-template') as HTMLTemplateElement).content.firstElementChild as HTMLDivElement;

class DependencyFlag extends CardBase {
    parent: mainClasses.DependencyFlag;
    get parentGroup() { return this.parent.inherited?.parent?.flagsToSet; }

    children: undefined;
    childrenContainer: undefined;
    childClass: undefined;

    get name(): string { return this.parent.flag; } set name(value: string) { this.parent.flag = value; }
    nameInput: HTMLInputElement;

    get value(): string { return this.parent.value; } set value(value: string) { this.parent.value = value; }
    valueInput: HTMLInputElement;

    override readonly minimumItemsToSort = 0;

    constructor (parent: mainClasses.DependencyFlag) {
        super();

        this.parent = parent;

        this.main = dependencyFlagTemplate.cloneNode(true) as HTMLDivElement;

        this.nameInput = this.main.querySelector('.builder-steps-flag-name input')!;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.valueInput = this.main.querySelector('.builder-steps-flag-value input')!;
        registerForEvents(this.valueInput, {change: this.updateFromInput_bound});

        this.deleteButton = deleteButtonTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, {activate: parent.destroy.bind(parent)});

        const dragHandle = dragHandleTemplate.cloneNode(true) as HTMLDivElement;
        this.main.insertBefore(dragHandle, this.main.firstElementChild);

        const flagContainer = this.parent.inherited?.containers?.['1st-party'] as HTMLDivElement;
        if (!flagContainer) {console.warn('Flag container not found!'); return;}


        flagContainer.appendChild(this.main);
        this.animateIn(flagContainer);

        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }

    override update_() {
        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('change'));
        this.valueInput.value = this.value; this.valueInput.dispatchEvent(new Event('change'));

        this.updateCard();
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;
        this.value = this.valueInput.value;
    }
}
mainClasses.addUpdateObjects(mainClasses.DependencyFlag, DependencyFlag);
