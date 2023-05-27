import * as mainClasses from './fomod-builder-classifications.js';
import * as mainUI from './fomod-builder-ui.js';
import { anAnimationFrame, registerUpgrade, BCDDropdown, registerForEvents, unregisterForEvents, UpdatableObject, BCDSummary } from '../../universal.js';
import { updatePluralDisplay } from './fomod-builder-ui.js';
import { componentHandler } from '../../assets/site/mdl/material.js';
import Sortable_ from '../../included_node_modules/sortablejs/modular/sortable.esm.js';
const Sortable = Sortable_;
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
    scroll: document.body.querySelector('main'),
    scrollSensitivity: 128,
    scrollSpeed: 64,
    delay: 200,
    delayOnTouchOnly: true,
    direction: 'vertical',
    sort: true,
    multiDrag: true,
};
export const sortableSettings_steps = {
    ...sortableSettings,
    group: 'steps',
    draggable: '.builder-steps-step',
};
export const sortableSettings_groups = {
    ...sortableSettings,
    group: 'groups',
    draggable: '.builder-steps-group',
};
export const sortableSettings_options = {
    ...sortableSettings,
    group: 'options',
    draggable: '.builder-steps-option',
};
export const sortableSettings_flags = {
    ...sortableSettings,
    group: 'flags',
    draggable: '.builder-steps-option-flag',
};
class CardBase extends UpdatableObject {
    main;
    deleteButton;
    dragHandle;
    sortable;
    async updateCard() {
        return await Promise.all([
            this.updateDeleteButton(),
            this.updateSortingHandler(),
        ]);
    }
    update_() {
        this.updateCard();
    }
    minimumItemsToSort = 2;
    minimumChildrenToSort = 2;
    async updateDeleteButton(forceState) {
        if (!this.deleteButton)
            return;
        await anAnimationFrame();
        if (this.parentGroup?.size && this.parentGroup.size >= this.minimumItemsToSort) {
            this.deleteButton.style.opacity = '1';
            this.deleteButton.ariaDisabled = 'false';
            this.deleteButton.disabled = false;
            this.deleteButton.setAttribute('data-force-disabled', 'false');
            this.deleteButton.style.pointerEvents = 'auto';
            this.deleteButton.setAttribute('data-force-pointer-events', 'true');
            this.deleteButton.tabIndex = 0;
            this.deleteButton.setAttribute('data-old-tabindex', '0');
        }
        else {
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
        if (!this.sortable)
            return;
        await anAnimationFrame();
        if ((this.children?.size || 0) >= this.minimumChildrenToSort) {
            this.sortable?.option('ignore', undefined);
            this.childrenContainer?.classList.remove('no-sorting');
        }
        else {
            this.sortable?.option('ignore', '*');
            this.childrenContainer?.classList.add('no-sorting');
        }
    }
    onSort(event, added = false) {
        if (!this.childClass)
            return;
        if (event.from !== event.to && !added)
            return console.debug('Not sorting', this, event);
        if (event.newIndex === undefined || (!added && event.newIndex === event.oldIndex))
            return console.debug('No index change', this, event);
        const displayItem = event.item.upgrades?.get(this.childClass);
        if (!displayItem)
            return console.error('Child Class instance not found!', this, event);
        this.children?.moveIndex(displayItem.parent, event.newIndex);
        this.parent?.update();
    }
    onSort_bound = this.onSort.bind(this);
    onAdd(event) {
        if (!this.childClass)
            return;
        if (event.from === event.to || event.to !== this.childrenContainer)
            return console.debug('Not adding', this, event);
        const displayItem = event.item.upgrades?.get(this.childClass);
        if (!displayItem)
            return console.error('The FOMOD Builder binding for this item was not found!', this, event);
        if (displayItem.parent.inherited)
            displayItem.parent.inherited.parent = this.parent;
        this.children?.add(displayItem.parent);
        this.onSort(event, true);
        this.parent?.updateWhole();
    }
    onAdd_bound = this.onAdd.bind(this);
    onRemove(event) {
        if (!this.childClass)
            return;
        if (event.from === event.to || event.from !== this.childrenContainer)
            return console.debug('Not removing', this, event);
        const displayItem = event.item.upgrades?.get(this.childClass);
        if (!displayItem)
            return console.error('The FOMOD Builder binding for this item was not found!', this, event);
        this.children?.delete(displayItem.parent);
        this.parent?.updateWhole();
    }
    onRemove_bound = this.onRemove.bind(this);
    async destroy_() {
        const main = this.main;
        const previousElemStyle = this.main.previousSibling?.style;
        if (previousElemStyle)
            previousElemStyle.zIndex = '1';
        const summary = this.main.querySelector(':scope > .js-bcd-summary')?.upgrades?.get(BCDSummary);
        if (summary)
            await summary.close(false, false, true, 500);
        main.classList.add('animating-out');
        if (getComputedStyle(main).animationName === 'none')
            return this.main.remove();
        function finalize() {
            if (previousElemStyle)
                previousElemStyle.zIndex = '';
            main.remove();
        }
        main.addEventListener('animationend', finalize, { once: true });
    }
    animateIn(container) {
        if (this.main.style.animationName === 'none')
            return;
        const previousSibling = container.lastElementChild instanceof HTMLElement ? container.lastElementChild : undefined;
        if (!previousSibling)
            return;
        const main = this.main;
        previousSibling.style.zIndex = '1';
        main.classList.add('animating-in');
        const finalize = function () {
            previousSibling.style.zIndex = '';
            main.classList.remove('animating-in');
            main.removeEventListener('animationend', finalize);
        };
        main.addEventListener('animationend', finalize, { once: true });
    }
}
const deleteButtonTemplate = document.getElementById('builder-main-steps-delete-button').content.firstElementChild;
const dragHandleTemplate = document.getElementById('builder-main-steps-drag-handle').content.firstElementChild;
export class Fomod extends CardBase {
    parent;
    parentGroup;
    get childClass() { return Step; }
    get children() { return this.parent.steps; }
    get childrenContainer() { return this.parent.stepContainers['1st-party']; }
    nameInput;
    get name() { return this.parent.moduleName; }
    set name(value) { this.parent.moduleName = value; }
    imageInput;
    get image() { return this.parent.metaImage; }
    set image(value) { this.parent.metaImage = value; }
    sortOrderMenu;
    get sortOrder() { return this.parent.sortingOrder; }
    set sortOrder(value) { this.parent.sortingOrder = value; }
    addStepBtn;
    changeEvtObj;
    dropdownEvtObj;
    addStepEvtObj;
    constructor(parent) {
        super();
        this.parent = parent;
        this.changeEvtObj = { change: this.updateFromInput_bound };
        this.dropdownEvtObj = { dropdownInput: this.updateFromInput_bound };
        this.addStepEvtObj = { activate: parent.addStep_bound.bind(parent, undefined, undefined) };
        this.main = document.getElementById("steps-builder-container");
        const stepsContainer = this.main.querySelector('div.builder-steps-steps-container');
        this.parent.stepContainers['1st-party'] = stepsContainer;
        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        };
        this.sortable = new Sortable(stepsContainer, Object.assign(sortableEvents, sortableSettings_steps));
        this.nameInput = this.main.querySelector('input.builder-steps-mod-name');
        registerForEvents(this.nameInput, this.changeEvtObj);
        this.imageInput = this.main.querySelector('.builder-steps-mod-image input');
        registerForEvents(this.imageInput, this.changeEvtObj);
        this.sortOrderMenu = this.main.querySelector('menu.bcd-dropdown-sorting-order');
        registerForEvents(this.sortOrderMenu, this.dropdownEvtObj);
        this.addStepBtn = this.main.querySelector('button.builder-steps-add-child-btn');
        registerForEvents(this.addStepBtn, this.addStepEvtObj);
        registerUpgrade(this.main, this, null, false, true);
    }
    updateFromInput_() {
        this.name = this.nameInput.value;
        this.image = this.imageInput.value;
        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj)
            this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption);
    }
    update_() {
        this.nameInput.value = this.name;
        this.nameInput.dispatchEvent(new Event('input'));
        this.imageInput.value = this.image;
        this.imageInput.dispatchEvent(new Event('input'));
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));
        this.updateCard();
    }
    async destroy_() {
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
const stepTemplate = document.getElementById('builder-main-steps-step').content.firstElementChild;
export class Step extends CardBase {
    parent;
    get parentGroup() { return this.parent.inherited?.parent?.steps; }
    get childClass() { return Group; }
    get children() { return this.parent.groups; }
    get childrenContainer() { return this.parent.groupContainers['1st-party']; }
    nameDisplay;
    groupCountDisplay;
    optionCountDisplay;
    get name() { return this.parent.name; }
    set name(value) { this.parent.name = value; }
    nameInput;
    get sortOrder() { return this.parent.sortingOrder; }
    set sortOrder(value) { this.parent.sortingOrder = value; }
    sortOrderMenu;
    addGroupBtn;
    constructor(parent) {
        super();
        this.parent = parent;
        this.main = stepTemplate.cloneNode(true);
        const groupsContainer = this.main.querySelector('div.builder-steps-group-container');
        this.parent.groupContainers['1st-party'] = groupsContainer;
        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        };
        this.sortable = new Sortable(groupsContainer, Object.assign(sortableEvents, sortableSettings_groups));
        this.nameInput = this.main.querySelector('input.bcd-builder-input');
        registerForEvents(this.nameInput, { change: this.updateFromInput_bound });
        this.sortOrderMenu = this.main.querySelector('menu.bcd-dropdown-sorting-order');
        registerForEvents(this.sortOrderMenu, { dropdownInput: this.updateFromInput_bound });
        this.addGroupBtn = this.main.querySelector('button.builder-steps-add-child-btn');
        registerForEvents(this.addGroupBtn, { activate: parent.addGroup_bound.bind(parent, undefined, undefined) });
        this.nameDisplay = this.main.querySelector('.builder-steps-step-title span.name');
        this.groupCountDisplay = this.main.querySelector('span.builder-steps-step-group-count');
        this.optionCountDisplay = this.main.querySelector('span.builder-steps-step-option-count');
        this.deleteButton = deleteButtonTemplate.cloneNode(true);
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        const dragHandle = dragHandleTemplate.cloneNode(true);
        this.main.insertBefore(dragHandle, this.main.firstElementChild);
        registerForEvents(this.deleteButton, { activate: parent.destroy.bind(parent) });
        const stepContainer = this.parent.inherited.containers?.['1st-party'];
        if (!stepContainer) {
            console.warn('Step container not found!');
            return;
        }
        stepContainer.appendChild(this.main);
        this.animateIn(stepContainer);
        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }
    update_() {
        this.nameInput.value = this.name;
        this.nameInput.dispatchEvent(new Event('input'));
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));
        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.groupCountDisplay, this.parent.groups.size);
        updatePluralDisplay(this.optionCountDisplay, [...this.parent.groups].reduce((currentCount, group) => currentCount + group.options.size, 0));
        this.updateCard();
    }
    updateFromInput_() {
        this.name = this.nameInput.value;
        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj)
            this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption);
        this.nameDisplay.textContent = this.name;
    }
}
mainClasses.addUpdateObjects(mainClasses.Step, Step);
const groupTemplate = document.getElementById('builder-main-steps-group').content.firstElementChild;
export class Group extends CardBase {
    parent;
    get parentGroup() { return this.parent.inherited?.parent?.groups; }
    get childClass() { return Option; }
    get children() { return this.parent.options; }
    get childrenContainer() { return this.parent.optionContainers['1st-party']; }
    nameDisplay;
    optionCountDisplay;
    get name() { return this.parent.name; }
    set name(value) { this.parent.name = value; }
    nameInput;
    get sortOrder() { return this.parent.sortingOrder; }
    set sortOrder(value) { this.parent.sortingOrder = value; }
    sortOrderMenu;
    get selectionType() { return this.parent.type; }
    set selectionType(value) { this.parent.type = value; }
    selectionTypeMenu;
    addOptionBtn;
    constructor(parent) {
        super();
        this.parent = parent;
        this.main = groupTemplate.cloneNode(true);
        const optionsContainer = this.main.querySelector('div.builder-steps-option-container');
        this.parent.optionContainers['1st-party'] = optionsContainer;
        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        };
        this.sortable = new Sortable(optionsContainer, Object.assign(sortableEvents, sortableSettings_options));
        this.nameInput = this.main.querySelector('input.builder-steps-group-name');
        registerForEvents(this.nameInput, { change: this.updateFromInput_bound });
        this.sortOrderMenu = this.main.querySelector('menu.bcd-dropdown-sorting-order');
        registerForEvents(this.sortOrderMenu, { dropdownInput: this.updateFromInput_bound });
        this.selectionTypeMenu = this.main.querySelector('menu.bcd-dropdown-group-type');
        registerForEvents(this.selectionTypeMenu, { dropdownInput: this.updateFromInput_bound });
        this.addOptionBtn = this.main.querySelector('button.builder-steps-add-child-btn');
        registerForEvents(this.addOptionBtn, { activate: parent.addOption_bound.bind(parent, undefined, undefined) });
        this.nameDisplay = this.main.querySelector('span.name');
        this.optionCountDisplay = this.main.querySelector('span.builder-steps-group-option-count');
        this.deleteButton = deleteButtonTemplate.cloneNode(true);
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, { activate: parent.destroy.bind(parent) });
        const dragHandle = dragHandleTemplate.cloneNode(true);
        this.main.insertBefore(dragHandle, this.main.firstElementChild);
        const groupContainer = this.parent.inherited.containers?.['1st-party'];
        if (!groupContainer) {
            console.warn('Group container not found!');
            return;
        }
        groupContainer.appendChild(this.main);
        this.animateIn(groupContainer);
        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }
    update_() {
        this.nameInput.value = this.name;
        this.nameDisplay.textContent = this.name;
        this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.sortOrder));
        this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.selectionType));
        this.nameDisplay.textContent = this.name;
        updatePluralDisplay(this.optionCountDisplay, this.parent.options.size);
        this.updateCard();
    }
    updateFromInput_() {
        this.name = this.nameInput.value;
        const dropdownObj = this.sortOrderMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj)
            this.sortOrder = mainUI.translateDropdown(dropdownObj.selectedOption);
        const dropdownObj2 = this.selectionTypeMenu.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj2)
            this.selectionType = mainUI.translateDropdown(dropdownObj2.selectedOption);
        this.nameDisplay.textContent = this.name;
    }
}
mainClasses.addUpdateObjects(mainClasses.Group, Group);
const optionTemplate = document.getElementById('builder-main-steps-option').content.firstElementChild;
export class Option extends CardBase {
    parent;
    get parentGroup() { return this.parent.inherited?.parent?.options; }
    get childClass() { return DependencyFlag; }
    get children() { return this.parent.flagsToSet; }
    get childrenContainer() { return this.parent.flagsContainers['1st-party']; }
    nameDisplay;
    fileCountDisplay;
    flagCountDisplay;
    get name() { return this.parent.name; }
    set name(value) { this.parent.name = value; }
    nameInput;
    get description() { return this.parent.description; }
    set description(value) { this.parent.description = value; }
    descriptionInput;
    get image() { return this.parent.image; }
    set image(value) { this.parent.image = value; }
    imageInput;
    editStateConditionsButton;
    get defaultState() { return this.parent.typeDescriptor.defaultState; }
    set defaultState(value) { this.parent.typeDescriptor.defaultState = value; }
    defaultStateDropdown;
    addFlagBtn;
    minimumChildrenToSort = 0;
    addFlagEvtObj;
    constructor(parent) {
        super();
        this.parent = parent;
        this.addFlagEvtObj = { activate: parent.addFlag_bound.bind(parent, undefined, undefined) };
        this.main = optionTemplate.cloneNode(true);
        this.nameInput = this.main.querySelector('input.builder-steps-option-name');
        registerForEvents(this.nameInput, { change: this.updateFromInput_bound });
        this.descriptionInput = this.main.querySelector('textarea.builder-steps-option-description');
        registerForEvents(this.descriptionInput, { change: this.updateFromInput_bound });
        this.imageInput = this.main.querySelector('input.js-relative-image-picker');
        registerForEvents(this.imageInput, { change: this.updateFromInput_bound });
        this.editStateConditionsButton = this.main.querySelector('button.builder-steps-condition-edit-btn');
        this.defaultStateDropdown = this.main.querySelector('menu.bcd-dropdown-option-state');
        registerForEvents(this.defaultStateDropdown, { dropdownInput: this.updateFromInput_bound });
        this.nameDisplay = this.main.querySelector('span.name');
        this.fileCountDisplay = this.main.querySelector('span.builder-steps-option-file-count');
        this.flagCountDisplay = this.main.querySelector('span.builder-steps-option-flag-count');
        this.deleteButton = deleteButtonTemplate.cloneNode(true);
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, { activate: parent.destroy.bind(parent) });
        const flagsContainer = this.main.querySelector('div.builder-steps-option-set-flags-container');
        this.parent.flagsContainers['1st-party'] = flagsContainer;
        const sortableEvents = {
            onSort: this.onSort_bound,
            onAdd: this.onAdd_bound,
            onRemove: this.onRemove_bound,
        };
        this.sortable = new Sortable(flagsContainer, Object.assign(sortableEvents, sortableSettings_flags));
        this.addFlagBtn = this.main.querySelector('.builder-steps-option-set-flags-body button.builder-steps-add-child-btn');
        registerForEvents(this.addFlagBtn, this.addFlagEvtObj);
        const dragHandle = dragHandleTemplate.cloneNode(true);
        this.main.insertBefore(dragHandle, this.main.firstElementChild);
        const optionContainer = this.parent.inherited.containers?.['1st-party'];
        if (!optionContainer) {
            console.warn('Option container not found!');
            return;
        }
        this.animateIn(optionContainer);
        optionContainer.appendChild(this.main);
        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }
    update_() {
        this.nameInput.value = this.name || '';
        this.nameInput.dispatchEvent(new Event('change'));
        this.descriptionInput.value = this.description || '';
        this.descriptionInput.dispatchEvent(new Event('change'));
        this.imageInput.value = this.image || '';
        this.imageInput.dispatchEvent(new Event('change'));
        this.defaultStateDropdown.upgrades?.getExtends(BCDDropdown)?.[0]?.selectByString(mainUI.translateDropdown(this.parent.typeDescriptor.defaultState));
        this.nameDisplay.textContent = this.name || '';
        updatePluralDisplay(this.fileCountDisplay, this.parent.files.size);
        updatePluralDisplay(this.flagCountDisplay, this.parent.flagsToSet.size);
        this.updateCard();
    }
    updateFromInput_() {
        this.name = this.nameInput.value || '';
        this.description = this.descriptionInput.value || '';
        this.image = this.imageInput.value || '';
        const dropdownObj = this.defaultStateDropdown.upgrades?.getExtends(BCDDropdown)?.[0];
        if (dropdownObj)
            this.parent.typeDescriptor.defaultState = mainUI.translateDropdown(dropdownObj.selectedOption);
        this.nameDisplay.textContent = this.name;
    }
}
mainClasses.addUpdateObjects(mainClasses.Option, Option);
const dependencyFlagTemplate = document.getElementById('builder-steps-flag-template').content.firstElementChild;
class DependencyFlag extends CardBase {
    parent;
    get parentGroup() { return this.parent.inherited?.parent?.flagsToSet; }
    children;
    childrenContainer;
    childClass;
    get name() { return this.parent.flag; }
    set name(value) { this.parent.flag = value; }
    nameInput;
    get value() { return this.parent.value; }
    set value(value) { this.parent.value = value; }
    valueInput;
    minimumItemsToSort = 0;
    constructor(parent) {
        super();
        this.parent = parent;
        this.main = dependencyFlagTemplate.cloneNode(true);
        this.nameInput = this.main.querySelector('.builder-steps-flag-name input');
        registerForEvents(this.nameInput, { change: this.updateFromInput_bound });
        this.valueInput = this.main.querySelector('.builder-steps-flag-value input');
        registerForEvents(this.valueInput, { change: this.updateFromInput_bound });
        this.deleteButton = deleteButtonTemplate.cloneNode(true);
        this.main.insertBefore(this.deleteButton, this.main.firstElementChild);
        registerForEvents(this.deleteButton, { activate: parent.destroy.bind(parent) });
        const dragHandle = dragHandleTemplate.cloneNode(true);
        this.main.insertBefore(dragHandle, this.main.firstElementChild);
        const flagContainer = this.parent.inherited?.containers?.['1st-party'];
        if (!flagContainer) {
            console.warn('Flag container not found!');
            return;
        }
        flagContainer.appendChild(this.main);
        this.animateIn(flagContainer);
        registerUpgrade(this.main, this, null, false, true);
        componentHandler.upgradeElements(this.main);
    }
    update_() {
        this.nameInput.value = this.name;
        this.nameInput.dispatchEvent(new Event('change'));
        this.valueInput.value = this.value;
        this.valueInput.dispatchEvent(new Event('change'));
        this.updateCard();
    }
    updateFromInput_() {
        this.name = this.nameInput.value;
        this.value = this.valueInput.value;
    }
}
mainClasses.addUpdateObjects(mainClasses.DependencyFlag, DependencyFlag);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9tb2QtYnVpbGRlci1zdGVwcy0xc3QtcGFydHkuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsidG9vbHMvZm9tb2QvZm9tb2QtYnVpbGRlci1zdGVwcy0xc3QtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsT0FBTyxLQUFLLFdBQVcsTUFBTSxvQ0FBb0MsQ0FBQztBQUNsRSxPQUFPLEtBQUssTUFBTSxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7QUFDMUssT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFckUsT0FBTyxTQUFTLE1BQU0sZ0VBQWdFLENBQUM7QUFJdkYsTUFBTSxRQUFRLEdBQUcsU0FBeUMsQ0FBQztBQUUzRCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRztJQUU1QixVQUFVLEVBQUUsZ0JBQWdCO0lBQzVCLFdBQVcsRUFBRSxpQkFBaUI7SUFDOUIsYUFBYSxFQUFFLG1CQUFtQjtJQUNsQyxTQUFTLEVBQUUsZUFBZTtJQUMxQixhQUFhLEVBQUUsbUJBQW1CO0lBRWxDLE1BQU0sRUFBRSw0QkFBNEI7SUFFcEMsVUFBVSxFQUFFLFNBQVM7SUFFckIsU0FBUyxFQUFFLEdBQUc7SUFFZCxZQUFZLEVBQUUsSUFBSTtJQUNsQixNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFFO0lBQzVDLGlCQUFpQixFQUFFLEdBQUc7SUFDdEIsV0FBVyxFQUFFLEVBQUU7SUFFZixL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IGZvbW9kLWJ1aWxkZXItc3RlcHMgZmlsZXMgY29udGFpbnMgY29kZSBmb3IgdGhlIEZPTU9EIEJ1aWxkZXIgc3RlcHMgcGFnZS5cbiAgICBUaGlzIGZpbGUgaW4gcGFydGljdWxhciBjb250YWlucyBjb2RlIGZvciB0aGUgMXN0LXBhcnR5IEZPTU9EIEJ1aWxkZXIgc3RlcHMgYnVpbGRlci5cblxuICAgIE90aGVyIGZvbW9kLWJ1aWxkZXItc3RlcHMgZmlsZXMgcHJvdmlkZSBjb2RlIGZvciB0aGVpciByZXNwZWN0aXZlIGJ1aWxkZXJzLlxuXG4gICAgQGF1dGhvciBCZWxsQ3ViZSBEZXZcbiAgICBAbmFtZXNwYWNlIC0gZm9tb2QtYnVpbGRlci1zdGVwc1xuICovXG5cbmltcG9ydCAqIGFzIG1haW5DbGFzc2VzIGZyb20gJy4vZm9tb2QtYnVpbGRlci1jbGFzc2lmaWNhdGlvbnMuanMnO1xuaW1wb3J0ICogYXMgbWFpblVJIGZyb20gJy4vZm9tb2QtYnVpbGRlci11aS5qcyc7XG5pbXBvcnQgeyBhbkFuaW1hdGlvbkZyYW1lLCByZWdpc3RlclVwZ3JhZGUsIEJDRERyb3Bkb3duLCByZWdpc3RlckZvckV2ZW50cywgdW5yZWdpc3RlckZvckV2ZW50cywgVXBkYXRhYmxlT2JqZWN0LCBCQ0RTdW1tYXJ5LCBhbmltYXRpb25GcmFtZXMgfSBmcm9tICcuLi8uLi91bml2ZXJzYWwuanMnO1xuaW1wb3J0IHsgdXBkYXRlUGx1cmFsRGlzcGxheSB9IGZyb20gJy4vZm9tb2QtYnVpbGRlci11aS5qcyc7XG5pbXBvcnQgeyBjb21wb25lbnRIYW5kbGVyIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3NpdGUvbWRsL21hdGVyaWFsLmpzJztcblxuaW1wb3J0IFNvcnRhYmxlXyBmcm9tICcuLi8uLi9pbmNsdWRlZF9ub2RlX21vZHVsZXMvc29ydGFibGVqcy9tb2R1bGFyL3NvcnRhYmxlLmVzbS5qcyc7XG5pbXBvcnQgdHlwZSBTb3J0YWJsZV9fIGZyb20gJy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvc29ydGFibGVqcy9pbmRleCc7XG5cbi8vIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3NvcnRhYmxlanNcbmNvbnN0IFNvcnRhYmxlID0gU29ydGFibGVfIGFzIHVua25vd24gYXMgdHlwZW9mIFNvcnRhYmxlX187XG5cbmV4cG9ydCBjb25zdCBzb3J0YWJsZVNldHRpbmdzID0ge1xuXG4gICAgZ2hvc3RDbGFzczogJ3NvcnRhYmxlLWdob3N0JyxcbiAgICBjaG9zZW5DbGFzczogJ3NvcnRhYmxlLWNob3NlbicsXG4gICAgc2VsZWN0ZWRDbGFzczogJ3NvcnRhYmxlLXNlbGVjdGVkJyxcbiAgICBkcmFnQ2xhc3M6ICdzb3J0YWJsZS1kcmFnJyxcbiAgICBmYWxsYmFja0NsYXNzOiAnc29ydGFibGUtZmFsbGJhY2snLFxuXG4gICAgaGFuZGxlOiAnLmJ1aWxkZXItc3RlcHMtZHJhZy1oYW5kbGUnLFxuXG4gICAgZGF0YUlkQXR0cjogJ2RhdGEtaWQnLFxuXG4gICAgYW5pbWF0aW9uOiAyNTAsXG5cbiAgICBidWJibGVTY3JvbGw6IHRydWUsXG4gICAgc2Nyb2xsOiBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSEsXG4gICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDEyOCwgLy8gaW4gcGl4ZWxzXG4gICAgc2Nyb2xsU3BlZWQ6IDY0LCAvLyBpbiBwaXhlbHNcblxuICAgIGRlbGF5OiAyMDAsXG4gICAgZGVsYXlPblRvdWNoT25seTogdHJ1ZSxcblxuICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcbiAgICBzb3J0OiB0cnVlLFxuXG4gICAgbXVsdGlEcmFnOiB0cnVlLFxufSBhcyBjb25zdCBzYXRpc2ZpZXMgU29ydGFibGVfXy5PcHRpb25zO1xuXG5leHBvcnQgY29uc3Qgc29ydGFibGVTZXR0aW5nc19zdGVwcyA9IHtcbiAgICAuLi5zb3J0YWJsZVNldHRpbmdzLFxuXG4gICAgZ3JvdXA6ICdzdGVwcycsXG4gICAgZHJhZ2dhYmxlOiAnLmJ1aWxkZXItc3RlcHMtc3RlcCcsXG59IGFzIGNvbnN0IHNhdGlzZmllcyBTb3J0YWJsZV9fLk9wdGlvbnM7XG5cbmV4cG9ydCBjb25zdCBzb3J0YWJsZVNldHRpbmdzX2dyb3VwcyA9IHtcbiAgICAuLi5zb3J0YWJsZVNldHRpbmdzLFxuXG4gICAgZ3JvdXA6ICdncm91cHMnLFxuICAgIGRyYWdnYWJsZTogJy5idWlsZGVyLXN0ZXBzLWdyb3VwJyxcbn0gYXMgY29uc3Qgc2F0aXNmaWVzIFNvcnRhYmxlX18uT3B0aW9ucztcblxuZXhwb3J0IGNvbnN0IHNvcnRhYmxlU2V0dGluZ3Nfb3B0aW9ucyA9IHtcbiAgICAuLi5zb3J0YWJsZVNldHRpbmdzLFxuXG4gICAgZ3JvdXA6ICdvcHRpb25zJyxcbiAgICBkcmFnZ2FibGU6ICcuYnVpbGRlci1zdGVwcy1vcHRpb24nLFxufSBhcyBjb25zdCBzYXRpc2ZpZXMgU29ydGFibGVfXy5PcHRpb25zO1xuXG5leHBvcnQgY29uc3Qgc29ydGFibGVTZXR0aW5nc19mbGFncyA9IHtcbiAgICAuLi5zb3J0YWJsZVNldHRpbmdzLFxuXG4gICAgZ3JvdXA6ICdmbGFncycsXG4gICAgZHJhZ2dhYmxlOiAnLmJ1aWxkZXItc3RlcHMtb3B0aW9uLWZsYWcnLFxufSBhcyBjb25zdCBzYXRpc2ZpZXMgU29ydGFibGVfXy5PcHRpb25zO1xuXG5hYnN0cmFjdCBjbGFzcyBDYXJkQmFzZSBleHRlbmRzIFVwZGF0YWJsZU9iamVjdCB7XG4gICAgYWJzdHJhY3QgcGFyZW50PzogbWFpbkNsYXNzZXMuRGVwZW5kZW5jeUZsYWd8bWFpbkNsYXNzZXMuT3B0aW9ufG1haW5DbGFzc2VzLkdyb3VwfG1haW5DbGFzc2VzLlN0ZXB8bWFpbkNsYXNzZXMuRm9tb2Q7XG4gICAgYWJzdHJhY3QgcGFyZW50R3JvdXA/OiBTZXQ8Tm9uTnVsbGFibGU8Q2FyZEJhc2VbJ3BhcmVudCddPj47XG5cbiAgICBhYnN0cmFjdCBjaGlsZHJlbjogU2V0PG1haW5DbGFzc2VzLkZPTU9ERWxlbWVudFByb3h5Pnx1bmRlZmluZWQ7XG4gICAgYWJzdHJhY3QgY2hpbGRyZW5Db250YWluZXI6IEhUTUxEaXZFbGVtZW50fHVuZGVmaW5lZDtcbiAgICBhYnN0cmFjdCBjaGlsZENsYXNzOiBPbWl0PHR5cGVvZiBDYXJkQmFzZSwgJ25ldyc+ICYgKG5ldyguLi5hcmdzOiBhbnlbXSkgPT4gQ2FyZEJhc2UpfHVuZGVmaW5lZDtcblxuICAgIG1haW4hOiBIVE1MRGl2RWxlbWVudDtcbiAgICBkZWxldGVCdXR0b24/OiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBkcmFnSGFuZGxlPzogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgICBzb3J0YWJsZT86IEluc3RhbmNlVHlwZTx0eXBlb2YgU29ydGFibGU+O1xuXG4gICAgYXN5bmMgdXBkYXRlQ2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGVsZXRlQnV0dG9uKCksXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNvcnRpbmdIYW5kbGVyKCksXG4gICAgICAgIF0pO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FyZCgpO1xuICAgIH1cblxuICAgIHJlYWRvbmx5IG1pbmltdW1JdGVtc1RvU29ydDpudW1iZXIgPSAyO1xuICAgIHJlYWRvbmx5IG1pbmltdW1DaGlsZHJlblRvU29ydDpudW1iZXIgPSAyO1xuXG4gICAgYXN5bmMgdXBkYXRlRGVsZXRlQnV0dG9uKGZvcmNlU3RhdGU/OiBib29sZWFuKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWxldGVCdXR0b24pIHJldHVybjtcbiAgICAgICAgYXdhaXQgYW5BbmltYXRpb25GcmFtZSgpO1xuXG4gICAgICAgIC8vIFdlIHNldCBhbGwga2luZHMgb2YgYXR0cmlidXRlcyBpbiBoZXJlIHNvIHRoYXQgdGhlIERldGFpbHMvU3VtbWFyeSBwYWlyIGRvZXNuJ3Qgb3ZlcnJpZGUgdGhlbS5cblxuICAgICAgICBpZiAodGhpcy5wYXJlbnRHcm91cD8uc2l6ZSAmJiB0aGlzLnBhcmVudEdyb3VwLnNpemUgPj0gdGhpcy5taW5pbXVtSXRlbXNUb1NvcnQpIHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5hcmlhRGlzYWJsZWQgPSAnZmFsc2UnO1xuICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JjZS1kaXNhYmxlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JjZS1wb2ludGVyLWV2ZW50cycsICd0cnVlJyk7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi50YWJJbmRleCA9IDA7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtb2xkLXRhYmluZGV4JywgJzAnKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uc3R5bGUub3BhY2l0eSA9ICcwLjEnO1xuICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uYXJpYURpc2FibGVkID0gJ3RydWUnO1xuICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kZWxldGVCdXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWZvcmNlLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yY2UtcG9pbnRlci1ldmVudHMnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtb2xkLXRhYmluZGV4JywgJy0xJyk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVNvcnRpbmdIYW5kbGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuc29ydGFibGUpIHJldHVybjtcbiAgICAgICAgYXdhaXQgYW5BbmltYXRpb25GcmFtZSgpO1xuXG4gICAgICAgIGlmICgodGhpcy5jaGlsZHJlbj8uc2l6ZSB8fCAwKSA+PSB0aGlzLm1pbmltdW1DaGlsZHJlblRvU29ydCkge1xuICAgICAgICAgICAgdGhpcy5zb3J0YWJsZT8ub3B0aW9uKCdpZ25vcmUnLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNvbnRhaW5lcj8uY2xhc3NMaXN0LnJlbW92ZSgnbm8tc29ydGluZycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zb3J0YWJsZT8ub3B0aW9uKCdpZ25vcmUnLCAnKicpO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNvbnRhaW5lcj8uY2xhc3NMaXN0LmFkZCgnbm8tc29ydGluZycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Tb3J0KGV2ZW50OiBTb3J0YWJsZV9fLlNvcnRhYmxlRXZlbnQsIGFkZGVkID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkQ2xhc3MpIHJldHVybjtcbiAgICAgICAgaWYgKGV2ZW50LmZyb20gIT09IGV2ZW50LnRvICYmICFhZGRlZCkgcmV0dXJuIGNvbnNvbGUuZGVidWcoJ05vdCBzb3J0aW5nJywgdGhpcywgZXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQubmV3SW5kZXggPT09IHVuZGVmaW5lZCB8fCAoIWFkZGVkICYmIGV2ZW50Lm5ld0luZGV4ID09PSBldmVudC5vbGRJbmRleCkpIHJldHVybiBjb25zb2xlLmRlYnVnKCdObyBpbmRleCBjaGFuZ2UnLCB0aGlzLCBldmVudCk7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheUl0ZW0gPSBldmVudC5pdGVtLnVwZ3JhZGVzPy5nZXQodGhpcy5jaGlsZENsYXNzKTtcbiAgICAgICAgaWYgKCFkaXNwbGF5SXRlbSkgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0NoaWxkIENsYXNzIGluc3RhbmNlIG5vdCBmb3VuZCEnLCB0aGlzLCBldmVudCk7XG5cbiAgICAgICAgdGhpcy5jaGlsZHJlbj8ubW92ZUluZGV4KGRpc3BsYXlJdGVtLnBhcmVudCwgZXZlbnQubmV3SW5kZXgpO1xuICAgICAgICB0aGlzLnBhcmVudD8udXBkYXRlKCk7XG4gICAgfVxuICAgIHJlYWRvbmx5IG9uU29ydF9ib3VuZCA9IHRoaXMub25Tb3J0LmJpbmQodGhpcyk7XG5cbiAgICBvbkFkZChldmVudDogU29ydGFibGVfXy5Tb3J0YWJsZUV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5jaGlsZENsYXNzKSByZXR1cm47XG4gICAgICAgIGlmIChldmVudC5mcm9tID09PSBldmVudC50byB8fCBldmVudC50byAhPT0gdGhpcy5jaGlsZHJlbkNvbnRhaW5lcikgcmV0dXJuIGNvbnNvbGUuZGVidWcoJ05vdCBhZGRpbmcnLCB0aGlzLCBldmVudCk7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheUl0ZW0gPSBldmVudC5pdGVtLnVwZ3JhZGVzPy5nZXQodGhpcy5jaGlsZENsYXNzKTtcbiAgICAgICAgaWYgKCFkaXNwbGF5SXRlbSkgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ1RoZSBGT01PRCBCdWlsZGVyIGJpbmRpbmcgZm9yIHRoaXMgaXRlbSB3YXMgbm90IGZvdW5kIScsIHRoaXMsIGV2ZW50KTtcblxuICAgICAgICBpZiAoZGlzcGxheUl0ZW0ucGFyZW50LmluaGVyaXRlZCkgZGlzcGxheUl0ZW0ucGFyZW50LmluaGVyaXRlZC5wYXJlbnQgPSB0aGlzLnBhcmVudDtcblxuICAgICAgICB0aGlzLmNoaWxkcmVuPy5hZGQoZGlzcGxheUl0ZW0ucGFyZW50KTtcbiAgICAgICAgdGhpcy5vblNvcnQoZXZlbnQsIHRydWUpO1xuXG4gICAgICAgIHRoaXMucGFyZW50Py51cGRhdGVXaG9sZSgpO1xuICAgIH1cbiAgICByZWFkb25seSBvbkFkZF9ib3VuZCA9IHRoaXMub25BZGQuYmluZCh0aGlzKTtcblxuICAgIG9uUmVtb3ZlKGV2ZW50OiBTb3J0YWJsZV9fLlNvcnRhYmxlRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkQ2xhc3MpIHJldHVybjtcbiAgICAgICAgaWYgKGV2ZW50LmZyb20gPT09IGV2ZW50LnRvIHx8IGV2ZW50LmZyb20gIT09IHRoaXMuY2hpbGRyZW5Db250YWluZXIpIHJldHVybiBjb25zb2xlLmRlYnVnKCdOb3QgcmVtb3ZpbmcnLCB0aGlzLCBldmVudCk7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheUl0ZW0gPSBldmVudC5pdGVtLnVwZ3JhZGVzPy5nZXQodGhpcy5jaGlsZENsYXNzKTtcbiAgICAgICAgaWYgKCFkaXNwbGF5SXRlbSkgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ1RoZSBGT01PRCBCdWlsZGVyIGJpbmRpbmcgZm9yIHRoaXMgaXRlbSB3YXMgbm90IGZvdW5kIScsIHRoaXMsIGV2ZW50KTtcblxuICAgICAgICB0aGlzLmNoaWxkcmVuPy5kZWxldGUoZGlzcGxheUl0ZW0ucGFyZW50KTtcblxuICAgICAgICB0aGlzLnBhcmVudD8udXBkYXRlV2hvbGUoKTtcbiAgICB9XG4gICAgcmVhZG9ubHkgb25SZW1vdmVfYm91bmQgPSB0aGlzLm9uUmVtb3ZlLmJpbmQodGhpcyk7XG5cbiAgICBvdmVycmlkZSBhc3luYyBkZXN0cm95XygpIHtcbiAgICAgICAgY29uc3QgbWFpbiA9IHRoaXMubWFpbjtcblxuICAgICAgICBjb25zdCBwcmV2aW91c0VsZW1TdHlsZSA9ICh0aGlzLm1haW4ucHJldmlvdXNTaWJsaW5nIGFzIEhUTUxFbGVtZW50fG51bGwpPy5zdHlsZTtcbiAgICAgICAgaWYgKHByZXZpb3VzRWxlbVN0eWxlKSBwcmV2aW91c0VsZW1TdHlsZS56SW5kZXggPSAnMSc7XG5cbiAgICAgICAgY29uc3Qgc3VtbWFyeSA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAuanMtYmNkLXN1bW1hcnknKT8udXBncmFkZXM/LmdldChCQ0RTdW1tYXJ5KTtcbiAgICAgICAgaWYgKHN1bW1hcnkpIGF3YWl0IHN1bW1hcnkuY2xvc2UoZmFsc2UsIGZhbHNlLCB0cnVlLCA1MDApO1xuXG4gICAgICAgIG1haW4uY2xhc3NMaXN0LmFkZCgnYW5pbWF0aW5nLW91dCcpO1xuICAgICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShtYWluKS5hbmltYXRpb25OYW1lID09PSAnbm9uZScpIHJldHVybiB0aGlzLm1haW4ucmVtb3ZlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gZmluYWxpemUoKSB7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNFbGVtU3R5bGUpIHByZXZpb3VzRWxlbVN0eWxlLnpJbmRleCA9ICcnO1xuICAgICAgICAgICAgbWFpbi5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vYWZ0ZXJEZWxheSg0MDAsIGZpbmFsaXplKTtcbiAgICAgICAgbWFpbi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBmaW5hbGl6ZSwge29uY2U6IHRydWV9KTtcbiAgICB9XG5cbiAgICBhbmltYXRlSW4oY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAodGhpcy5tYWluLnN0eWxlLmFuaW1hdGlvbk5hbWUgPT09ICdub25lJykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHByZXZpb3VzU2libGluZyA9IGNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBjb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKCFwcmV2aW91c1NpYmxpbmcpIHJldHVybjtcblxuICAgICAgICBjb25zdCBtYWluID0gdGhpcy5tYWluO1xuXG4gICAgICAgIHByZXZpb3VzU2libGluZy5zdHlsZS56SW5kZXggPSAnMSc7XG4gICAgICAgIG1haW4uY2xhc3NMaXN0LmFkZCgnYW5pbWF0aW5nLWluJyk7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtc3R5bGUgLS0gSSBvbmx5IHdhbnQgdG8gaW5pdCB0aGUgZnVuY3Rpb24gd2l0aGluIGFuIGlmIHN0YXRlbWVudFxuICAgICAgICBjb25zdCBmaW5hbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcHJldmlvdXNTaWJsaW5nLnN0eWxlLnpJbmRleCA9ICcnO1xuICAgICAgICAgICAgbWFpbi5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRpbmctaW4nKTtcblxuICAgICAgICAgICAgbWFpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBmaW5hbGl6ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9hZnRlckRlbGF5KDQwMCwgcmVtb3ZlSW5kZXgpO1xuICAgICAgICBtYWluLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZpbmFsaXplLCB7b25jZTogdHJ1ZX0pO1xuICAgIH1cbn1cblxuY29uc3QgZGVsZXRlQnV0dG9uVGVtcGxhdGUgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1aWxkZXItbWFpbi1zdGVwcy1kZWxldGUtYnV0dG9uJykgYXMgSFRNTFRlbXBsYXRlRWxlbWVudCkuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbmNvbnN0IGRyYWdIYW5kbGVUZW1wbGF0ZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRlci1tYWluLXN0ZXBzLWRyYWctaGFuZGxlJykgYXMgSFRNTFRlbXBsYXRlRWxlbWVudCkuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxuLyoqIE1hbmFnZXMgdGhlIGZpcnN0LXBhcnR5IGVkaXRvciBmb3IgZW50aXJlIEZPTU9EcyAqL1xuZXhwb3J0IGNsYXNzIEZvbW9kIGV4dGVuZHMgQ2FyZEJhc2Uge1xuICAgIHBhcmVudDogbWFpbkNsYXNzZXMuRm9tb2Q7XG4gICAgcGFyZW50R3JvdXA6IHVuZGVmaW5lZDtcbiAgICBnZXQgY2hpbGRDbGFzcygpIHsgcmV0dXJuIFN0ZXA7IH1cbiAgICBnZXQgY2hpbGRyZW4oKSB7IHJldHVybiB0aGlzLnBhcmVudC5zdGVwczsgfVxuICAgIGdldCBjaGlsZHJlbkNvbnRhaW5lcigpIHsgcmV0dXJuIHRoaXMucGFyZW50LnN0ZXBDb250YWluZXJzWycxc3QtcGFydHknXTsgfVxuXG4gICAgbmFtZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgLyoqIFRoZSBuYW1lIG9mIHRoZSBtb2QgKi9cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXJlbnQubW9kdWxlTmFtZTsgfSBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMucGFyZW50Lm1vZHVsZU5hbWUgPSB2YWx1ZTsgfVxuXG4gICAgaW1hZ2VJbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAgIC8qKiBUaGUgaW1hZ2Ugb2YgdGhlIG1vZCAqL1xuICAgIGdldCBpbWFnZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXJlbnQubWV0YUltYWdlOyB9IHNldCBpbWFnZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMucGFyZW50Lm1ldGFJbWFnZSA9IHZhbHVlOyB9XG5cbiAgICBzb3J0T3JkZXJNZW51OiBIVE1MTWVudUVsZW1lbnQ7XG4gICAgZ2V0IHNvcnRPcmRlcigpOiBtYWluQ2xhc3Nlcy5Tb3J0T3JkZXIgeyByZXR1cm4gdGhpcy5wYXJlbnQuc29ydGluZ09yZGVyOyB9IHNldCBzb3J0T3JkZXIodmFsdWU6IG1haW5DbGFzc2VzLlNvcnRPcmRlcikgeyB0aGlzLnBhcmVudC5zb3J0aW5nT3JkZXIgPSB2YWx1ZTsgfVxuXG4gICAgYWRkU3RlcEJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgICAvLyBJIGNhbid0IGJlIGJvdGhlcmVkIHRvIGV4cGxpY2l0bHkgc2V0IHR5cGVzIG9uIHRoaXNcbiAgICBwcml2YXRlIGNoYW5nZUV2dE9iajtcbiAgICBwcml2YXRlIGRyb3Bkb3duRXZ0T2JqO1xuICAgIHByaXZhdGUgYWRkU3RlcEV2dE9iajtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogbWFpbkNsYXNzZXMuRm9tb2QpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgICAgICB0aGlzLmNoYW5nZUV2dE9iaiA9IHtjaGFuZ2U6IHRoaXMudXBkYXRlRnJvbUlucHV0X2JvdW5kfTtcbiAgICAgICAgdGhpcy5kcm9wZG93bkV2dE9iaiA9IHtkcm9wZG93bklucHV0OiB0aGlzLnVwZGF0ZUZyb21JbnB1dF9ib3VuZH07XG4gICAgICAgIHRoaXMuYWRkU3RlcEV2dE9iaiA9IHthY3RpdmF0ZTogcGFyZW50LmFkZFN0ZXBfYm91bmQuYmluZChwYXJlbnQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKX07XG5cblxuICAgICAgICB0aGlzLm1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0ZXBzLWJ1aWxkZXItY29udGFpbmVyXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICBjb25zdCBzdGVwc0NvbnRhaW5lciA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignZGl2LmJ1aWxkZXItc3RlcHMtc3RlcHMtY29udGFpbmVyJykhO1xuICAgICAgICB0aGlzLnBhcmVudC5zdGVwQ29udGFpbmVyc1snMXN0LXBhcnR5J10gPSBzdGVwc0NvbnRhaW5lcjtcblxuICAgICAgICBjb25zdCBzb3J0YWJsZUV2ZW50cyA9IHtcbiAgICAgICAgICAgIG9uU29ydDogdGhpcy5vblNvcnRfYm91bmQsXG4gICAgICAgICAgICBvbkFkZDogdGhpcy5vbkFkZF9ib3VuZCxcbiAgICAgICAgICAgIG9uUmVtb3ZlOiB0aGlzLm9uUmVtb3ZlX2JvdW5kLFxuICAgICAgICB9IGFzIGNvbnN0IHNhdGlzZmllcyBTb3J0YWJsZV9fLk9wdGlvbnM7XG4gICAgICAgIHRoaXMuc29ydGFibGUgPSBuZXcgU29ydGFibGUoc3RlcHNDb250YWluZXIsIE9iamVjdC5hc3NpZ24oc29ydGFibGVFdmVudHMsIHNvcnRhYmxlU2V0dGluZ3Nfc3RlcHMpKTtcblxuICAgICAgICB0aGlzLm5hbWVJbnB1dCA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdpbnB1dC5idWlsZGVyLXN0ZXBzLW1vZC1uYW1lJykhO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLm5hbWVJbnB1dCwgdGhpcy5jaGFuZ2VFdnRPYmopO1xuXG4gICAgICAgIHRoaXMuaW1hZ2VJbnB1dCA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCcuYnVpbGRlci1zdGVwcy1tb2QtaW1hZ2UgaW5wdXQnKSE7XG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuaW1hZ2VJbnB1dCwgdGhpcy5jaGFuZ2VFdnRPYmopO1xuXG4gICAgICAgIHRoaXMuc29ydE9yZGVyTWVudSA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdtZW51LmJjZC1kcm9wZG93bi1zb3J0aW5nLW9yZGVyJykhO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLnNvcnRPcmRlck1lbnUsIHRoaXMuZHJvcGRvd25FdnRPYmopO1xuXG4gICAgICAgIHRoaXMuYWRkU3RlcEJ0biA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdidXR0b24uYnVpbGRlci1zdGVwcy1hZGQtY2hpbGQtYnRuJykhO1xuXG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuYWRkU3RlcEJ0biwgdGhpcy5hZGRTdGVwRXZ0T2JqKTtcbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKHRoaXMubWFpbiwgdGhpcywgbnVsbCwgZmFsc2UsIHRydWUpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZUZyb21JbnB1dF8oKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMubmFtZUlucHV0LnZhbHVlO1xuICAgICAgICB0aGlzLmltYWdlID0gdGhpcy5pbWFnZUlucHV0LnZhbHVlO1xuICAgICAgICBjb25zdCBkcm9wZG93bk9iaiA9IHRoaXMuc29ydE9yZGVyTWVudS51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXTtcbiAgICAgICAgaWYgKGRyb3Bkb3duT2JqKSB0aGlzLnNvcnRPcmRlciA9IG1haW5VSS50cmFuc2xhdGVEcm9wZG93bihkcm9wZG93bk9iai5zZWxlY3RlZE9wdGlvbikgYXMgbWFpbkNsYXNzZXMuU29ydE9yZGVyO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZV8oKSB7XG5cbiAgICAgICAgdGhpcy5uYW1lSW5wdXQudmFsdWUgPSB0aGlzLm5hbWU7IHRoaXMubmFtZUlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcpKTtcblxuICAgICAgICB0aGlzLmltYWdlSW5wdXQudmFsdWUgPSB0aGlzLmltYWdlOyB0aGlzLmltYWdlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JykpO1xuXG4gICAgICAgIHRoaXMuc29ydE9yZGVyTWVudS51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXT8uc2VsZWN0QnlTdHJpbmcobWFpblVJLnRyYW5zbGF0ZURyb3Bkb3duKHRoaXMuc29ydE9yZGVyKSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVDYXJkKCk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgYXN5bmMgZGVzdHJveV8oKSB7XG4gICAgICAgIHVucmVnaXN0ZXJGb3JFdmVudHModGhpcy5uYW1lSW5wdXQsIHRoaXMuY2hhbmdlRXZ0T2JqKTtcbiAgICAgICAgdW5yZWdpc3RlckZvckV2ZW50cyh0aGlzLmltYWdlSW5wdXQsIHRoaXMuY2hhbmdlRXZ0T2JqKTtcbiAgICAgICAgdW5yZWdpc3RlckZvckV2ZW50cyh0aGlzLnNvcnRPcmRlck1lbnUsIHRoaXMuZHJvcGRvd25FdnRPYmopO1xuICAgICAgICB1bnJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuYWRkU3RlcEJ0biwgdGhpcy5hZGRTdGVwRXZ0T2JqKTtcbiAgICAgICAgdGhpcy5uYW1lSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5pbWFnZUlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIHRoaXMuc29ydE9yZGVyTWVudS51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXT8uc2VsZWN0QnlTdHJpbmcod2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlLnNldHRpbmdzLmRlZmF1bHRTb3J0aW5nT3JkZXIpO1xuICAgIH1cbn1cbm1haW5DbGFzc2VzLmFkZFVwZGF0ZU9iamVjdHMobWFpbkNsYXNzZXMuRm9tb2QsIEZvbW9kKTtcblxuY29uc3Qgc3RlcFRlbXBsYXRlID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGVyLW1haW4tc3RlcHMtc3RlcCcpIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQpLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQ7XG4vKiogTWFuYWdlcyB0aGUgZmlyc3QtcGFydHkgZWRpdG9yIGZvciBGT01PRCBTdGVwcyAqL1xuZXhwb3J0IGNsYXNzIFN0ZXAgZXh0ZW5kcyBDYXJkQmFzZSB7XG4gICAgcGFyZW50OiBtYWluQ2xhc3Nlcy5TdGVwO1xuICAgIGdldCBwYXJlbnRHcm91cCgpIHsgcmV0dXJuIHRoaXMucGFyZW50LmluaGVyaXRlZD8ucGFyZW50Py5zdGVwczsgfVxuICAgIGdldCBjaGlsZENsYXNzKCkgeyByZXR1cm4gR3JvdXA7IH1cbiAgICBnZXQgY2hpbGRyZW4oKSB7IHJldHVybiB0aGlzLnBhcmVudC5ncm91cHM7IH1cbiAgICBnZXQgY2hpbGRyZW5Db250YWluZXIoKSB7IHJldHVybiB0aGlzLnBhcmVudC5ncm91cENvbnRhaW5lcnNbJzFzdC1wYXJ0eSddOyB9XG5cbiAgICBuYW1lRGlzcGxheTogSFRNTFNwYW5FbGVtZW50O1xuICAgIGdyb3VwQ291bnREaXNwbGF5OiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgb3B0aW9uQ291bnREaXNwbGF5OiBIVE1MU3BhbkVsZW1lbnQ7XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXJlbnQubmFtZTsgfSBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMucGFyZW50Lm5hbWUgPSB2YWx1ZTsgfVxuICAgIG5hbWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAgIGdldCBzb3J0T3JkZXIoKTogbWFpbkNsYXNzZXMuU29ydE9yZGVyIHsgcmV0dXJuIHRoaXMucGFyZW50LnNvcnRpbmdPcmRlcjsgfSBzZXQgc29ydE9yZGVyKHZhbHVlOiBtYWluQ2xhc3Nlcy5Tb3J0T3JkZXIpIHsgdGhpcy5wYXJlbnQuc29ydGluZ09yZGVyID0gdmFsdWU7IH1cbiAgICBzb3J0T3JkZXJNZW51OiBIVE1MTWVudUVsZW1lbnQ7XG5cbiAgICBhZGRHcm91cEJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvciAocGFyZW50OiBtYWluQ2xhc3Nlcy5TdGVwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgICAgIHRoaXMubWFpbiA9IHN0ZXBUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgZ3JvdXBzQ29udGFpbmVyID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdkaXYuYnVpbGRlci1zdGVwcy1ncm91cC1jb250YWluZXInKSE7XG4gICAgICAgIHRoaXMucGFyZW50Lmdyb3VwQ29udGFpbmVyc1snMXN0LXBhcnR5J10gPSBncm91cHNDb250YWluZXI7XG5cblxuICAgICAgICBjb25zdCBzb3J0YWJsZUV2ZW50cyA9IHtcbiAgICAgICAgICAgIG9uU29ydDogdGhpcy5vblNvcnRfYm91bmQsXG4gICAgICAgICAgICBvbkFkZDogdGhpcy5vbkFkZF9ib3VuZCxcbiAgICAgICAgICAgIG9uUmVtb3ZlOiB0aGlzLm9uUmVtb3ZlX2JvdW5kLFxuICAgICAgICB9IGFzIGNvbnN0IHNhdGlzZmllcyBTb3J0YWJsZV9fLk9wdGlvbnM7XG4gICAgICAgIHRoaXMuc29ydGFibGUgPSBuZXcgU29ydGFibGUoZ3JvdXBzQ29udGFpbmVyLCBPYmplY3QuYXNzaWduKHNvcnRhYmxlRXZlbnRzLCBzb3J0YWJsZVNldHRpbmdzX2dyb3VwcykpO1xuXG4gICAgICAgIHRoaXMubmFtZUlucHV0ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0LmJjZC1idWlsZGVyLWlucHV0JykhO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLm5hbWVJbnB1dCwge2NoYW5nZTogdGhpcy51cGRhdGVGcm9tSW5wdXRfYm91bmR9KTtcblxuICAgICAgICB0aGlzLnNvcnRPcmRlck1lbnUgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3RvcignbWVudS5iY2QtZHJvcGRvd24tc29ydGluZy1vcmRlcicpITtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5zb3J0T3JkZXJNZW51LCB7ZHJvcGRvd25JbnB1dDogdGhpcy51cGRhdGVGcm9tSW5wdXRfYm91bmR9KTtcblxuICAgICAgICB0aGlzLmFkZEdyb3VwQnRuID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbi5idWlsZGVyLXN0ZXBzLWFkZC1jaGlsZC1idG4nKSE7XG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuYWRkR3JvdXBCdG4sIHthY3RpdmF0ZTogcGFyZW50LmFkZEdyb3VwX2JvdW5kLmJpbmQocGFyZW50LCB1bmRlZmluZWQsIHVuZGVmaW5lZCl9KTtcblxuICAgICAgICB0aGlzLm5hbWVEaXNwbGF5ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJy5idWlsZGVyLXN0ZXBzLXN0ZXAtdGl0bGUgc3Bhbi5uYW1lJykhO1xuICAgICAgICB0aGlzLmdyb3VwQ291bnREaXNwbGF5ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uYnVpbGRlci1zdGVwcy1zdGVwLWdyb3VwLWNvdW50JykhO1xuICAgICAgICB0aGlzLm9wdGlvbkNvdW50RGlzcGxheSA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdzcGFuLmJ1aWxkZXItc3RlcHMtc3RlcC1vcHRpb24tY291bnQnKSE7XG5cbiAgICAgICAgdGhpcy5kZWxldGVCdXR0b24gPSBkZWxldGVCdXR0b25UZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIHRoaXMubWFpbi5pbnNlcnRCZWZvcmUodGhpcy5kZWxldGVCdXR0b24sIHRoaXMubWFpbi5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgICAgY29uc3QgZHJhZ0hhbmRsZSA9IGRyYWdIYW5kbGVUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIHRoaXMubWFpbi5pbnNlcnRCZWZvcmUoZHJhZ0hhbmRsZSwgdGhpcy5tYWluLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLmRlbGV0ZUJ1dHRvbiwge2FjdGl2YXRlOiBwYXJlbnQuZGVzdHJveS5iaW5kKHBhcmVudCl9KTtcblxuICAgICAgICBjb25zdCBzdGVwQ29udGFpbmVyID0gdGhpcy5wYXJlbnQuaW5oZXJpdGVkLmNvbnRhaW5lcnM/LlsnMXN0LXBhcnR5J10gYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIGlmICghc3RlcENvbnRhaW5lcikge2NvbnNvbGUud2FybignU3RlcCBjb250YWluZXIgbm90IGZvdW5kIScpOyByZXR1cm47fVxuXG4gICAgICAgIHN0ZXBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5tYWluKTtcbiAgICAgICAgdGhpcy5hbmltYXRlSW4oc3RlcENvbnRhaW5lcik7XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKHRoaXMubWFpbiwgdGhpcywgbnVsbCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cyh0aGlzLm1haW4pO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMubmFtZUlucHV0LnZhbHVlID0gdGhpcy5uYW1lOyB0aGlzLm5hbWVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XG4gICAgICAgIHRoaXMuc29ydE9yZGVyTWVudS51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXT8uc2VsZWN0QnlTdHJpbmcobWFpblVJLnRyYW5zbGF0ZURyb3Bkb3duKHRoaXMuc29ydE9yZGVyKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lRGlzcGxheS50ZXh0Q29udGVudCA9IHRoaXMubmFtZTtcbiAgICAgICAgdXBkYXRlUGx1cmFsRGlzcGxheSh0aGlzLmdyb3VwQ291bnREaXNwbGF5LCB0aGlzLnBhcmVudC5ncm91cHMuc2l6ZSk7XG4gICAgICAgIHVwZGF0ZVBsdXJhbERpc3BsYXkodGhpcy5vcHRpb25Db3VudERpc3BsYXksIFsuLi50aGlzLnBhcmVudC5ncm91cHNdLnJlZHVjZSgoY3VycmVudENvdW50LCBncm91cCkgPT4gY3VycmVudENvdW50ICsgZ3JvdXAub3B0aW9ucy5zaXplLCAwKSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVDYXJkKCk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdXBkYXRlRnJvbUlucHV0XygpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5uYW1lSW5wdXQudmFsdWU7XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25PYmogPSB0aGlzLnNvcnRPcmRlck1lbnUudXBncmFkZXM/LmdldEV4dGVuZHMoQkNERHJvcGRvd24pPy5bMF07XG4gICAgICAgIGlmIChkcm9wZG93bk9iaikgdGhpcy5zb3J0T3JkZXIgPSBtYWluVUkudHJhbnNsYXRlRHJvcGRvd24oZHJvcGRvd25PYmouc2VsZWN0ZWRPcHRpb24pIGFzIG1haW5DbGFzc2VzLlNvcnRPcmRlcjtcblxuICAgICAgICB0aGlzLm5hbWVEaXNwbGF5LnRleHRDb250ZW50ID0gdGhpcy5uYW1lO1xuICAgIH1cbn1cbm1haW5DbGFzc2VzLmFkZFVwZGF0ZU9iamVjdHMobWFpbkNsYXNzZXMuU3RlcCwgU3RlcCk7XG5cblxuY29uc3QgZ3JvdXBUZW1wbGF0ZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRlci1tYWluLXN0ZXBzLWdyb3VwJykgYXMgSFRNTFRlbXBsYXRlRWxlbWVudCkuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRGl2RWxlbWVudDtcbi8qKiBNYW5hZ2VzIHRoZSBmaXJzdC1wYXJ0eSBlZGl0b3IgZm9yIEZPTU9EIEdyb3VwcyAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwIGV4dGVuZHMgQ2FyZEJhc2Uge1xuICAgIHBhcmVudDogbWFpbkNsYXNzZXMuR3JvdXA7XG4gICAgZ2V0IHBhcmVudEdyb3VwKCkgeyByZXR1cm4gdGhpcy5wYXJlbnQuaW5oZXJpdGVkPy5wYXJlbnQ/Lmdyb3VwczsgfVxuXG4gICAgZ2V0IGNoaWxkQ2xhc3MoKSB7IHJldHVybiBPcHRpb247IH1cbiAgICBnZXQgY2hpbGRyZW4oKSB7IHJldHVybiB0aGlzLnBhcmVudC5vcHRpb25zOyB9XG4gICAgZ2V0IGNoaWxkcmVuQ29udGFpbmVyKCkgeyByZXR1cm4gdGhpcy5wYXJlbnQub3B0aW9uQ29udGFpbmVyc1snMXN0LXBhcnR5J107IH1cblxuICAgIG5hbWVEaXNwbGF5OiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgb3B0aW9uQ291bnREaXNwbGF5OiBIVE1MU3BhbkVsZW1lbnQ7XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXJlbnQubmFtZTsgfSBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMucGFyZW50Lm5hbWUgPSB2YWx1ZTsgfVxuICAgIG5hbWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAgIGdldCBzb3J0T3JkZXIoKTogbWFpbkNsYXNzZXMuU29ydE9yZGVyIHsgcmV0dXJuIHRoaXMucGFyZW50LnNvcnRpbmdPcmRlcjsgfSBzZXQgc29ydE9yZGVyKHZhbHVlOiBtYWluQ2xhc3Nlcy5Tb3J0T3JkZXIpIHsgdGhpcy5wYXJlbnQuc29ydGluZ09yZGVyID0gdmFsdWU7IH1cbiAgICBzb3J0T3JkZXJNZW51OiBIVE1MTWVudUVsZW1lbnQ7XG5cbiAgICBnZXQgc2VsZWN0aW9uVHlwZSgpOiBtYWluQ2xhc3Nlcy5Hcm91cFNlbGVjdFR5cGUgeyByZXR1cm4gdGhpcy5wYXJlbnQudHlwZTsgfSBzZXQgc2VsZWN0aW9uVHlwZSh2YWx1ZTogbWFpbkNsYXNzZXMuR3JvdXBTZWxlY3RUeXBlKSB7IHRoaXMucGFyZW50LnR5cGUgPSB2YWx1ZTsgfVxuICAgIHNlbGVjdGlvblR5cGVNZW51OiBIVE1MTWVudUVsZW1lbnQ7XG5cbiAgICBhZGRPcHRpb25CdG46IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IgKHBhcmVudDogbWFpbkNsYXNzZXMuR3JvdXApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICAgICAgdGhpcy5tYWluID0gZ3JvdXBUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9uc0NvbnRhaW5lciA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignZGl2LmJ1aWxkZXItc3RlcHMtb3B0aW9uLWNvbnRhaW5lcicpITtcbiAgICAgICAgdGhpcy5wYXJlbnQub3B0aW9uQ29udGFpbmVyc1snMXN0LXBhcnR5J10gPSBvcHRpb25zQ29udGFpbmVyO1xuICAgICAgICBjb25zdCBzb3J0YWJsZUV2ZW50cyA9IHtcbiAgICAgICAgICAgIG9uU29ydDogdGhpcy5vblNvcnRfYm91bmQsXG4gICAgICAgICAgICBvbkFkZDogdGhpcy5vbkFkZF9ib3VuZCxcbiAgICAgICAgICAgIG9uUmVtb3ZlOiB0aGlzLm9uUmVtb3ZlX2JvdW5kLFxuICAgICAgICB9IGFzIGNvbnN0IHNhdGlzZmllcyBTb3J0YWJsZV9fLk9wdGlvbnM7XG4gICAgICAgIHRoaXMuc29ydGFibGUgPSBuZXcgU29ydGFibGUob3B0aW9uc0NvbnRhaW5lciwgT2JqZWN0LmFzc2lnbihzb3J0YWJsZUV2ZW50cywgc29ydGFibGVTZXR0aW5nc19vcHRpb25zKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lSW5wdXQgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3RvcignaW5wdXQuYnVpbGRlci1zdGVwcy1ncm91cC1uYW1lJykhO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLm5hbWVJbnB1dCwge2NoYW5nZTogdGhpcy51cGRhdGVGcm9tSW5wdXRfYm91bmR9KTtcblxuICAgICAgICB0aGlzLnNvcnRPcmRlck1lbnUgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3RvcignbWVudS5iY2QtZHJvcGRvd24tc29ydGluZy1vcmRlcicpITtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5zb3J0T3JkZXJNZW51LCB7ZHJvcGRvd25JbnB1dDogdGhpcy51cGRhdGVGcm9tSW5wdXRfYm91bmR9KTtcblxuICAgICAgICB0aGlzLnNlbGVjdGlvblR5cGVNZW51ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ21lbnUuYmNkLWRyb3Bkb3duLWdyb3VwLXR5cGUnKSE7XG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuc2VsZWN0aW9uVHlwZU1lbnUsIHtkcm9wZG93bklucHV0OiB0aGlzLnVwZGF0ZUZyb21JbnB1dF9ib3VuZH0pO1xuXG4gICAgICAgIHRoaXMuYWRkT3B0aW9uQnRuID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbi5idWlsZGVyLXN0ZXBzLWFkZC1jaGlsZC1idG4nKSE7XG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuYWRkT3B0aW9uQnRuLCB7YWN0aXZhdGU6IHBhcmVudC5hZGRPcHRpb25fYm91bmQuYmluZChwYXJlbnQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKX0pO1xuXG4gICAgICAgIHRoaXMubmFtZURpc3BsYXkgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3Rvcignc3Bhbi5uYW1lJykhO1xuICAgICAgICB0aGlzLm9wdGlvbkNvdW50RGlzcGxheSA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdzcGFuLmJ1aWxkZXItc3RlcHMtZ3JvdXAtb3B0aW9uLWNvdW50JykhO1xuXG4gICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gZGVsZXRlQnV0dG9uVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICB0aGlzLm1haW4uaW5zZXJ0QmVmb3JlKHRoaXMuZGVsZXRlQnV0dG9uLCB0aGlzLm1haW4uZmlyc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuZGVsZXRlQnV0dG9uLCB7YWN0aXZhdGU6IHBhcmVudC5kZXN0cm95LmJpbmQocGFyZW50KX0pO1xuXG4gICAgICAgIGNvbnN0IGRyYWdIYW5kbGUgPSBkcmFnSGFuZGxlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICB0aGlzLm1haW4uaW5zZXJ0QmVmb3JlKGRyYWdIYW5kbGUsIHRoaXMubWFpbi5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgICAgY29uc3QgZ3JvdXBDb250YWluZXIgPSB0aGlzLnBhcmVudC5pbmhlcml0ZWQuY29udGFpbmVycz8uWycxc3QtcGFydHknXSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgaWYgKCFncm91cENvbnRhaW5lcikge2NvbnNvbGUud2FybignR3JvdXAgY29udGFpbmVyIG5vdCBmb3VuZCEnKTsgcmV0dXJuO31cblxuICAgICAgICBncm91cENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm1haW4pO1xuICAgICAgICB0aGlzLmFuaW1hdGVJbihncm91cENvbnRhaW5lcik7XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKHRoaXMubWFpbiwgdGhpcywgbnVsbCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cyh0aGlzLm1haW4pO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMubmFtZUlucHV0LnZhbHVlID0gdGhpcy5uYW1lOyB0aGlzLm5hbWVEaXNwbGF5LnRleHRDb250ZW50ID0gdGhpcy5uYW1lO1xuXG4gICAgICAgIHRoaXMuc29ydE9yZGVyTWVudS51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXT8uc2VsZWN0QnlTdHJpbmcobWFpblVJLnRyYW5zbGF0ZURyb3Bkb3duKHRoaXMuc29ydE9yZGVyKSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25UeXBlTWVudS51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXT8uc2VsZWN0QnlTdHJpbmcobWFpblVJLnRyYW5zbGF0ZURyb3Bkb3duKHRoaXMuc2VsZWN0aW9uVHlwZSkpO1xuXG4gICAgICAgIHRoaXMubmFtZURpc3BsYXkudGV4dENvbnRlbnQgPSB0aGlzLm5hbWU7XG4gICAgICAgIHVwZGF0ZVBsdXJhbERpc3BsYXkodGhpcy5vcHRpb25Db3VudERpc3BsYXksIHRoaXMucGFyZW50Lm9wdGlvbnMuc2l6ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVDYXJkKCk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdXBkYXRlRnJvbUlucHV0XygpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5uYW1lSW5wdXQudmFsdWU7XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25PYmogPSB0aGlzLnNvcnRPcmRlck1lbnUudXBncmFkZXM/LmdldEV4dGVuZHMoQkNERHJvcGRvd24pPy5bMF07XG4gICAgICAgIGlmIChkcm9wZG93bk9iaikgdGhpcy5zb3J0T3JkZXIgPSBtYWluVUkudHJhbnNsYXRlRHJvcGRvd24oZHJvcGRvd25PYmouc2VsZWN0ZWRPcHRpb24pIGFzIG1haW5DbGFzc2VzLlNvcnRPcmRlcjtcblxuICAgICAgICBjb25zdCBkcm9wZG93bk9iajIgPSB0aGlzLnNlbGVjdGlvblR5cGVNZW51LnVwZ3JhZGVzPy5nZXRFeHRlbmRzKEJDRERyb3Bkb3duKT8uWzBdO1xuICAgICAgICBpZiAoZHJvcGRvd25PYmoyKSB0aGlzLnNlbGVjdGlvblR5cGUgPSBtYWluVUkudHJhbnNsYXRlRHJvcGRvd24oZHJvcGRvd25PYmoyLnNlbGVjdGVkT3B0aW9uKSBhcyBtYWluQ2xhc3Nlcy5Hcm91cFNlbGVjdFR5cGU7XG5cbiAgICAgICAgdGhpcy5uYW1lRGlzcGxheS50ZXh0Q29udGVudCA9IHRoaXMubmFtZTtcbiAgICB9XG59XG5tYWluQ2xhc3Nlcy5hZGRVcGRhdGVPYmplY3RzKG1haW5DbGFzc2VzLkdyb3VwLCBHcm91cCk7XG5cbmNvbnN0IG9wdGlvblRlbXBsYXRlID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGVyLW1haW4tc3RlcHMtb3B0aW9uJykgYXMgSFRNTFRlbXBsYXRlRWxlbWVudCkuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRGl2RWxlbWVudDtcblxuZXhwb3J0IGNsYXNzIE9wdGlvbiBleHRlbmRzIENhcmRCYXNlIHtcbiAgICBwYXJlbnQ6IG1haW5DbGFzc2VzLk9wdGlvbjtcbiAgICBnZXQgcGFyZW50R3JvdXAoKSB7IHJldHVybiB0aGlzLnBhcmVudC5pbmhlcml0ZWQ/LnBhcmVudD8ub3B0aW9uczsgfVxuXG4gICAgZ2V0IGNoaWxkQ2xhc3MoKSB7IHJldHVybiBEZXBlbmRlbmN5RmxhZzsgfVxuICAgIGdldCBjaGlsZHJlbigpIHsgcmV0dXJuIHRoaXMucGFyZW50LmZsYWdzVG9TZXQ7IH1cbiAgICBnZXQgY2hpbGRyZW5Db250YWluZXIoKSB7IHJldHVybiB0aGlzLnBhcmVudC5mbGFnc0NvbnRhaW5lcnNbJzFzdC1wYXJ0eSddOyB9XG5cbiAgICBuYW1lRGlzcGxheTogSFRNTFNwYW5FbGVtZW50O1xuICAgIGZpbGVDb3VudERpc3BsYXk6IEhUTUxTcGFuRWxlbWVudDtcbiAgICBmbGFnQ291bnREaXNwbGF5OiBIVE1MU3BhbkVsZW1lbnQ7XG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXJlbnQubmFtZTsgfSBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMucGFyZW50Lm5hbWUgPSB2YWx1ZTsgfVxuICAgIG5hbWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAgIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXJlbnQuZGVzY3JpcHRpb247IH0gc2V0IGRlc2NyaXB0aW9uKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5wYXJlbnQuZGVzY3JpcHRpb24gPSB2YWx1ZTsgfVxuICAgIGRlc2NyaXB0aW9uSW5wdXQ6IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG5cbiAgICBnZXQgaW1hZ2UoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucGFyZW50LmltYWdlOyB9IHNldCBpbWFnZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMucGFyZW50LmltYWdlID0gdmFsdWU7IH1cbiAgICBpbWFnZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgZWRpdFN0YXRlQ29uZGl0aW9uc0J1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgICBnZXQgZGVmYXVsdFN0YXRlKCk6IG1haW5DbGFzc2VzLk9wdGlvblN0YXRlIHsgcmV0dXJuIHRoaXMucGFyZW50LnR5cGVEZXNjcmlwdG9yLmRlZmF1bHRTdGF0ZTsgfSBzZXQgZGVmYXVsdFN0YXRlKHZhbHVlOiBtYWluQ2xhc3Nlcy5PcHRpb25TdGF0ZSkgeyB0aGlzLnBhcmVudC50eXBlRGVzY3JpcHRvci5kZWZhdWx0U3RhdGUgPSB2YWx1ZTsgfVxuICAgIGRlZmF1bHRTdGF0ZURyb3Bkb3duOiBIVE1MTWVudUVsZW1lbnQ7XG5cbiAgICBhZGRGbGFnQnRuOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBvdmVycmlkZSByZWFkb25seSBtaW5pbXVtQ2hpbGRyZW5Ub1NvcnQgPSAwO1xuXG4gICAgcHJpdmF0ZSBhZGRGbGFnRXZ0T2JqO1xuXG4gICAgY29uc3RydWN0b3IgKHBhcmVudDogbWFpbkNsYXNzZXMuT3B0aW9uKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICAgICAgdGhpcy5hZGRGbGFnRXZ0T2JqID0ge2FjdGl2YXRlOiBwYXJlbnQuYWRkRmxhZ19ib3VuZC5iaW5kKHBhcmVudCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpfTtcblxuICAgICAgICB0aGlzLm1haW4gPSBvcHRpb25UZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5uYW1lSW5wdXQgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3RvcignaW5wdXQuYnVpbGRlci1zdGVwcy1vcHRpb24tbmFtZScpITtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5uYW1lSW5wdXQsIHtjaGFuZ2U6IHRoaXMudXBkYXRlRnJvbUlucHV0X2JvdW5kfSk7XG5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLmJ1aWxkZXItc3RlcHMtb3B0aW9uLWRlc2NyaXB0aW9uJykhO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLmRlc2NyaXB0aW9uSW5wdXQsIHtjaGFuZ2U6IHRoaXMudXBkYXRlRnJvbUlucHV0X2JvdW5kfSk7XG5cbiAgICAgICAgdGhpcy5pbWFnZUlucHV0ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0LmpzLXJlbGF0aXZlLWltYWdlLXBpY2tlcicpITtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5pbWFnZUlucHV0LCB7Y2hhbmdlOiB0aGlzLnVwZGF0ZUZyb21JbnB1dF9ib3VuZH0pO1xuXG4gICAgICAgIHRoaXMuZWRpdFN0YXRlQ29uZGl0aW9uc0J1dHRvbiA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdidXR0b24uYnVpbGRlci1zdGVwcy1jb25kaXRpb24tZWRpdC1idG4nKSE7XG4gICAgICAgIC8vcmVnaXN0ZXJGb3JFdmVudHModGhpcy5lZGl0VHlwZUJ1dHRvbiwge2FjdGl2YXRlOiB0aGlzLmVkaXRUeXBlX2JvdW5kfSk7XG5cbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhdGVEcm9wZG93biA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdtZW51LmJjZC1kcm9wZG93bi1vcHRpb24tc3RhdGUnKSE7XG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuZGVmYXVsdFN0YXRlRHJvcGRvd24sIHtkcm9wZG93bklucHV0OiB0aGlzLnVwZGF0ZUZyb21JbnB1dF9ib3VuZH0pO1xuXG4gICAgICAgIHRoaXMubmFtZURpc3BsYXkgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3Rvcignc3Bhbi5uYW1lJykhO1xuICAgICAgICB0aGlzLmZpbGVDb3VudERpc3BsYXkgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3Rvcignc3Bhbi5idWlsZGVyLXN0ZXBzLW9wdGlvbi1maWxlLWNvdW50JykhO1xuICAgICAgICB0aGlzLmZsYWdDb3VudERpc3BsYXkgPSB0aGlzLm1haW4ucXVlcnlTZWxlY3Rvcignc3Bhbi5idWlsZGVyLXN0ZXBzLW9wdGlvbi1mbGFnLWNvdW50JykhO1xuXG4gICAgICAgIHRoaXMuZGVsZXRlQnV0dG9uID0gZGVsZXRlQnV0dG9uVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICB0aGlzLm1haW4uaW5zZXJ0QmVmb3JlKHRoaXMuZGVsZXRlQnV0dG9uLCB0aGlzLm1haW4uZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLmRlbGV0ZUJ1dHRvbiwge2FjdGl2YXRlOiBwYXJlbnQuZGVzdHJveS5iaW5kKHBhcmVudCl9KTtcblxuICAgICAgICBjb25zdCBmbGFnc0NvbnRhaW5lciA9IHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yKCdkaXYuYnVpbGRlci1zdGVwcy1vcHRpb24tc2V0LWZsYWdzLWNvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICB0aGlzLnBhcmVudC5mbGFnc0NvbnRhaW5lcnNbJzFzdC1wYXJ0eSddID0gZmxhZ3NDb250YWluZXI7XG5cbiAgICAgICAgY29uc3Qgc29ydGFibGVFdmVudHMgPSB7XG4gICAgICAgICAgICBvblNvcnQ6IHRoaXMub25Tb3J0X2JvdW5kLFxuICAgICAgICAgICAgb25BZGQ6IHRoaXMub25BZGRfYm91bmQsXG4gICAgICAgICAgICBvblJlbW92ZTogdGhpcy5vblJlbW92ZV9ib3VuZCxcbiAgICAgICAgfSBhcyBjb25zdCBzYXRpc2ZpZXMgU29ydGFibGVfXy5PcHRpb25zO1xuICAgICAgICB0aGlzLnNvcnRhYmxlID0gbmV3IFNvcnRhYmxlKGZsYWdzQ29udGFpbmVyLCBPYmplY3QuYXNzaWduKHNvcnRhYmxlRXZlbnRzLCBzb3J0YWJsZVNldHRpbmdzX2ZsYWdzKSk7XG5cbiAgICAgICAgdGhpcy5hZGRGbGFnQnRuID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJy5idWlsZGVyLXN0ZXBzLW9wdGlvbi1zZXQtZmxhZ3MtYm9keSBidXR0b24uYnVpbGRlci1zdGVwcy1hZGQtY2hpbGQtYnRuJykhO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLmFkZEZsYWdCdG4sIHRoaXMuYWRkRmxhZ0V2dE9iaik7XG5cbiAgICAgICAgY29uc3QgZHJhZ0hhbmRsZSA9IGRyYWdIYW5kbGVUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIHRoaXMubWFpbi5pbnNlcnRCZWZvcmUoZHJhZ0hhbmRsZSwgdGhpcy5tYWluLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICBjb25zdCBvcHRpb25Db250YWluZXIgPSB0aGlzLnBhcmVudC5pbmhlcml0ZWQuY29udGFpbmVycz8uWycxc3QtcGFydHknXSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgaWYgKCFvcHRpb25Db250YWluZXIpIHtjb25zb2xlLndhcm4oJ09wdGlvbiBjb250YWluZXIgbm90IGZvdW5kIScpOyByZXR1cm47fVxuXG4gICAgICAgIHRoaXMuYW5pbWF0ZUluKG9wdGlvbkNvbnRhaW5lcik7XG4gICAgICAgIG9wdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm1haW4pO1xuXG4gICAgICAgIHJlZ2lzdGVyVXBncmFkZSh0aGlzLm1haW4sIHRoaXMsIG51bGwsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudHModGhpcy5tYWluKTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSB1cGRhdGVfKCkge1xuICAgICAgICB0aGlzLm5hbWVJbnB1dC52YWx1ZSA9IHRoaXMubmFtZSB8fCAnJzsgICAgICAgICAgICAgICB0aGlzLm5hbWVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSB0aGlzLmRlc2NyaXB0aW9uIHx8ICcnOyB0aGlzLmRlc2NyaXB0aW9uSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScpKTtcbiAgICAgICAgdGhpcy5pbWFnZUlucHV0LnZhbHVlID0gdGhpcy5pbWFnZSB8fCAnJzsgICAgICAgICAgICAgdGhpcy5pbWFnZUlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG5cbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhdGVEcm9wZG93bi51cGdyYWRlcz8uZ2V0RXh0ZW5kcyhCQ0REcm9wZG93bik/LlswXT8uc2VsZWN0QnlTdHJpbmcobWFpblVJLnRyYW5zbGF0ZURyb3Bkb3duKHRoaXMucGFyZW50LnR5cGVEZXNjcmlwdG9yLmRlZmF1bHRTdGF0ZSkpO1xuXG4gICAgICAgIHRoaXMubmFtZURpc3BsYXkudGV4dENvbnRlbnQgPSB0aGlzLm5hbWUgfHwgJyc7XG4gICAgICAgIHVwZGF0ZVBsdXJhbERpc3BsYXkodGhpcy5maWxlQ291bnREaXNwbGF5LCB0aGlzLnBhcmVudC5maWxlcy5zaXplKTtcbiAgICAgICAgdXBkYXRlUGx1cmFsRGlzcGxheSh0aGlzLmZsYWdDb3VudERpc3BsYXksIHRoaXMucGFyZW50LmZsYWdzVG9TZXQuc2l6ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVDYXJkKCk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdXBkYXRlRnJvbUlucHV0XygpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5uYW1lSW5wdXQudmFsdWUgfHwgJyc7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uSW5wdXQudmFsdWUgfHwgJyc7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSB0aGlzLmltYWdlSW5wdXQudmFsdWUgfHwgJyc7XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25PYmogPSB0aGlzLmRlZmF1bHRTdGF0ZURyb3Bkb3duLnVwZ3JhZGVzPy5nZXRFeHRlbmRzKEJDRERyb3Bkb3duKT8uWzBdO1xuICAgICAgICBpZiAoZHJvcGRvd25PYmopIHRoaXMucGFyZW50LnR5cGVEZXNjcmlwdG9yLmRlZmF1bHRTdGF0ZSA9IG1haW5VSS50cmFuc2xhdGVEcm9wZG93bihkcm9wZG93bk9iai5zZWxlY3RlZE9wdGlvbikgYXMgbWFpbkNsYXNzZXMuT3B0aW9uU3RhdGU7XG5cbiAgICAgICAgdGhpcy5uYW1lRGlzcGxheS50ZXh0Q29udGVudCA9IHRoaXMubmFtZTtcbiAgICB9XG59XG5tYWluQ2xhc3Nlcy5hZGRVcGRhdGVPYmplY3RzKG1haW5DbGFzc2VzLk9wdGlvbiwgT3B0aW9uKTtcblxuY29uc3QgZGVwZW5kZW5jeUZsYWdUZW1wbGF0ZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRlci1zdGVwcy1mbGFnLXRlbXBsYXRlJykgYXMgSFRNTFRlbXBsYXRlRWxlbWVudCkuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRGl2RWxlbWVudDtcblxuY2xhc3MgRGVwZW5kZW5jeUZsYWcgZXh0ZW5kcyBDYXJkQmFzZSB7XG4gICAgcGFyZW50OiBtYWluQ2xhc3Nlcy5EZXBlbmRlbmN5RmxhZztcbiAgICBnZXQgcGFyZW50R3JvdXAoKSB7IHJldHVybiB0aGlzLnBhcmVudC5pbmhlcml0ZWQ/LnBhcmVudD8uZmxhZ3NUb1NldDsgfVxuXG4gICAgY2hpbGRyZW46IHVuZGVmaW5lZDtcbiAgICBjaGlsZHJlbkNvbnRhaW5lcjogdW5kZWZpbmVkO1xuICAgIGNoaWxkQ2xhc3M6IHVuZGVmaW5lZDtcblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhcmVudC5mbGFnOyB9IHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5wYXJlbnQuZmxhZyA9IHZhbHVlOyB9XG4gICAgbmFtZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhcmVudC52YWx1ZTsgfSBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykgeyB0aGlzLnBhcmVudC52YWx1ZSA9IHZhbHVlOyB9XG4gICAgdmFsdWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAgIG92ZXJyaWRlIHJlYWRvbmx5IG1pbmltdW1JdGVtc1RvU29ydCA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvciAocGFyZW50OiBtYWluQ2xhc3Nlcy5EZXBlbmRlbmN5RmxhZykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgICAgIHRoaXMubWFpbiA9IGRlcGVuZGVuY3lGbGFnVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMubmFtZUlucHV0ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJy5idWlsZGVyLXN0ZXBzLWZsYWctbmFtZSBpbnB1dCcpITtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5uYW1lSW5wdXQsIHtjaGFuZ2U6IHRoaXMudXBkYXRlRnJvbUlucHV0X2JvdW5kfSk7XG5cbiAgICAgICAgdGhpcy52YWx1ZUlucHV0ID0gdGhpcy5tYWluLnF1ZXJ5U2VsZWN0b3IoJy5idWlsZGVyLXN0ZXBzLWZsYWctdmFsdWUgaW5wdXQnKSE7XG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMudmFsdWVJbnB1dCwge2NoYW5nZTogdGhpcy51cGRhdGVGcm9tSW5wdXRfYm91bmR9KTtcblxuICAgICAgICB0aGlzLmRlbGV0ZUJ1dHRvbiA9IGRlbGV0ZUJ1dHRvblRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgdGhpcy5tYWluLmluc2VydEJlZm9yZSh0aGlzLmRlbGV0ZUJ1dHRvbiwgdGhpcy5tYWluLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5kZWxldGVCdXR0b24sIHthY3RpdmF0ZTogcGFyZW50LmRlc3Ryb3kuYmluZChwYXJlbnQpfSk7XG5cbiAgICAgICAgY29uc3QgZHJhZ0hhbmRsZSA9IGRyYWdIYW5kbGVUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIHRoaXMubWFpbi5pbnNlcnRCZWZvcmUoZHJhZ0hhbmRsZSwgdGhpcy5tYWluLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICBjb25zdCBmbGFnQ29udGFpbmVyID0gdGhpcy5wYXJlbnQuaW5oZXJpdGVkPy5jb250YWluZXJzPy5bJzFzdC1wYXJ0eSddIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICBpZiAoIWZsYWdDb250YWluZXIpIHtjb25zb2xlLndhcm4oJ0ZsYWcgY29udGFpbmVyIG5vdCBmb3VuZCEnKTsgcmV0dXJuO31cblxuXG4gICAgICAgIGZsYWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5tYWluKTtcbiAgICAgICAgdGhpcy5hbmltYXRlSW4oZmxhZ0NvbnRhaW5lcik7XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKHRoaXMubWFpbiwgdGhpcywgbnVsbCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cyh0aGlzLm1haW4pO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMubmFtZUlucHV0LnZhbHVlID0gdGhpcy5uYW1lOyB0aGlzLm5hbWVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICAgICAgICB0aGlzLnZhbHVlSW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlOyB0aGlzLnZhbHVlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScpKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUNhcmQoKTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSB1cGRhdGVGcm9tSW5wdXRfKCkge1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLm5hbWVJbnB1dC52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVJbnB1dC52YWx1ZTtcbiAgICB9XG59XG5tYWluQ2xhc3Nlcy5hZGRVcGRhdGVPYmplY3RzKG1haW5DbGFzc2VzLkRlcGVuZGVuY3lGbGFnLCBEZXBlbmRlbmN5RmxhZyk7XG4iXX0=