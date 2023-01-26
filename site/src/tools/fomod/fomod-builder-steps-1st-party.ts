/** fomod-builder-steps files contains code for the FOMOD Builder steps page.
    This file in particular contains code for the 1st-party FOMOD Builder steps builder.

    Other fomod-builder-steps files provide code for their respective builders.

    @author BellCube Dev
    @namespace - fomod-builder-steps
 */

import type * as fomod from './fomod-builder-classifications.js';
import { registerForEvents, UpdatableObject } from '../../universal.js';

export class Fomod extends UpdatableObject {
    parent: fomod.Fomod;

    main: HTMLDivElement;

    nameInput: HTMLInputElement;

    /** The name of the mod */
    get name(): string { return this.parent.moduleName; } set name(value: string) {
        console.log(`Updating module name to "${value}"`);
        this.parent.moduleName = value;
        this.update();
    }

    imageInput: HTMLInputElement;

    /** The image of the mod */
    get image(): string { return this.parent.metaImage; } set image(value: string) { this.parent.metaImage = value; this.update(); }

    sortOrderMenu: HTMLMenuElement;
    get sortOrder(): fomod.SortOrder { return this.parent.sortingOrder; } set sortOrder(value: fomod.SortOrder) { this.parent.sortingOrder = value; this.update(); }

    addStepBtn: HTMLButtonElement;

    constructor(parent: fomod.Fomod) {
        super();

        this.parent = parent;

        this.main = document.getElementById("steps-builder-container") as HTMLDivElement;

        this.nameInput = this.main.querySelector('.builder-steps-mod-name') as HTMLInputElement;
        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});

        this.imageInput = this.main.querySelector('.builder-steps-mod-image input') as HTMLInputElement;
        registerForEvents(this.imageInput, {change: this.updateFromInput_bound});

        this.sortOrderMenu = this.main.querySelector('.bcd-dropdown-sorting-order') as HTMLMenuElement;
        registerForEvents(this.sortOrderMenu, {dropdownInput: this.updateFromInput_bound});

        this.addStepBtn = this.main.querySelector('.builder-steps-add-step-btn') as HTMLButtonElement;
        registerForEvents(this.addStepBtn, {activate: parent.addStep_bound});
    }

    override updateFromInput_() {
        this.name = this.nameInput.value;
        this.image = this.imageInput.value;
        this.sortOrder = this.sortOrderMenu.upgrades_proto?.dropdown?.selectedOption as fomod.SortOrder || console.error('Invalid sort order selected!');
    }
    readonly updateFromInput_bound = this.updateFromInput.bind(this);

    override update_() {

        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('input'));

        this.imageInput.value = this.image; this.imageInput.dispatchEvent(new Event('input'));

        this.sortOrderMenu.upgrades_proto?.dropdown?.selectByString(this.sortOrder);
    }
    readonly update_bound = this.update.bind(this);
}



// Option Name
export class Option extends UpdatableObject {
    parent: fomod.Option;

    /** The name of the option */
    get moduleName(): string { return this.parent.name; } set moduleName(value: string) { this.parent.name = value; this.update(); }

    input: HTMLInputElement;
    optionArea: HTMLDivElement;

    constructor(parent: fomod.Option, optionArea: HTMLDivElement) {
        super()
        this.parent = parent;
        this.optionArea = optionArea;

        this.input = optionArea.querySelector(':scope > [identifier="nameInput"]')!.getOrCreateChildByTag('input');

        const boundUpdateFromInput = this.updateFromInput.bind(this);
        registerForEvents(this.input, {change: boundUpdateFromInput});
    }

    override updateFromInput_() {
        this.moduleName = this.input.value;
    }

    override update_() {
        this.input.value = this.moduleName; this.input.dispatchEvent(new Event('input'));
    }

}
