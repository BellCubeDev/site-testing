/** fomod-builder-steps files contains code for the FOMOD Builder steps page.
    This file in particular contains code for the 1st-party FOMOD Builder steps builder.

    Other fomod-builder-steps files provide code for their respective builders.

    @author BellCube Dev
    @namespace - fomod-builder-steps
 */

import * as mainClasses from './fomod-builder-classifications.js';
import * as mainUI from './fomod-builder-ui.js';
import { afterDelay, BCDDropdown, registerForEvents, unregisterForEvents, UpdatableObject, BCDSummary } from '../../universal.js';
import { updatePluralDisplay } from './fomod-builder-ui.js';
import { componentHandler } from '../../assets/site/mdl/material.js';

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
        this.parent.stepsContainers['1st-party'] = this.main.querySelector('div.builder-steps-steps-container')!;

        this.nameInput = this.main.querySelector('.builder-steps-mod-name') as HTMLInputElement;
        registerForEvents(this.nameInput, this.changeEvtObj);

        this.imageInput = this.main.querySelector('.builder-steps-mod-image input') as HTMLInputElement;
        registerForEvents(this.imageInput, this.changeEvtObj);

        this.sortOrderMenu = this.main.querySelector('.bcd-dropdown-sorting-order') as HTMLMenuElement;
        registerForEvents(this.sortOrderMenu, this.dropdownEvtObj);

        this.addStepBtn = this.main.querySelector('.builder-steps-add-child-btn') as HTMLButtonElement;

        registerForEvents(this.addStepBtn, this.addStepEvtObj);
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
}
mainClasses.addUpdateObjects(mainClasses.Fomod, Fomod);

const deleteButtonTemplate = (document.getElementById('builder-main-steps-delete-button') as HTMLTemplateElement).content.firstElementChild as HTMLButtonElement;

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

    constructor (parent: mainClasses.Step) {
        super();
        this.parent = parent;

        this.main = stepTemplate.cloneNode(true) as HTMLDivElement;
        this.parent.groupsContainers['1st-party'] = this.main.querySelector('div.builder-steps-group-container')!;

        this.nameInput = this.main.querySelector('input.bcd-builder-input')!;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.sortOrderMenu = this.main.querySelector('.bcd-dropdown-sorting-order') as HTMLMenuElement;
        registerForEvents(this.sortOrderMenu, {dropdownInput: this.updateFromInput_bound});

        this.addGroupBtn = this.main.querySelector('.builder-steps-add-child-btn') as HTMLButtonElement;
        registerForEvents(this.addGroupBtn, {activate: parent.addGroup_bound.bind(parent, undefined, undefined)});

        this.nameDisplay = this.main.querySelector('.builder-steps-step-title span.name')!;
        this.groupCountDisplay = this.main.querySelector('span.builder-steps-step-group-count')!;
        this.optionCountDisplay = this.main.querySelector('span.builder-steps-step-option-count')!;

        this.deleteButton = deleteButtonTemplate.cloneNode(true) as HTMLButtonElement;
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, {activate: parent.destroy.bind(parent)});

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

        componentHandler.upgradeElements(this.main);
    }

    override update_() {
        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('input'));
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));

        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.groupCountDisplay, this.parent.groups.size);
        updatePluralDisplay(this.optionCountDisplay, [...this.parent.groups].reduce((currentCount, group) => currentCount + group.options.size, 0));

        prefabCardUpdate(this);
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;

        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        this.nameDisplay.textContent = this.name;
    }

    override destroy_() { prefabCardDestroy(this); }
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

    constructor (parent: mainClasses.Group) {
        super();
        this.parent = parent;

        this.main = groupTemplate.cloneNode(true) as HTMLDivElement;
        this.parent.optionsContainers['1st-party'] = this.main.querySelector('div.builder-steps-option-container')!;

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

        componentHandler.upgradeElements(this.main);
    }

    override update_() {
        this.nameInput.value = this.name; this.nameDisplay.textContent = this.name;

        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        const dropdownObj2 = this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj2) this.selectionType = mainUI.translateDropdown(dropdownObj2.selectedOption) as mainClasses.GroupSelectType;

        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.optionCountDisplay, this.parent.options.size);

        prefabCardUpdate(this);
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;

        const dropdownObj =this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj) this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption) as mainClasses.SortOrder;

        const dropdownObj2 = this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj2) this.selectionType = mainUI.translateDropdown(dropdownObj2.selectedOption) as mainClasses.GroupSelectType;

        this.nameDisplay.textContent = this.name;
    }

    override destroy_() { prefabCardDestroy(this); }
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

        componentHandler.upgradeElements(this.main);
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
