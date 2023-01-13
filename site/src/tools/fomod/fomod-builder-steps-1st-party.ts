/** fomod-builder-steps files contains code for the FOMOD Builder steps page.
    This file in particular contains code for the 1st-party FOMOD Builder steps builder.

    Other fomod-builder-steps files provide code for their respective builders.

    @author BellCube Dev
    @namespace - fomod-builder-steps
 */

import type { updatableObject } from './fomod-builder.js';
import type * as fomod from './fomod-builder-classifications.js';
import { registerForChange } from '../../universal.js';

export class Fomod implements updatableObject {
    parent: fomod.Fomod;
    suppressUpdates = false;

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

    constructor(parent: fomod.Fomod) {
        this.parent = parent;

        this.main = document.getElementById("steps-builder-container") as HTMLDivElement;

        this.nameInput = this.main.querySelector('.builder-steps-mod-name') as HTMLInputElement;

        this.imageInput = this.main.querySelector('.builder-steps-mod-image input') as HTMLInputElement;

        this.sortOrderMenu = this.main.querySelector('.bcd-dropdown-sorting-order') as HTMLMenuElement;

        const boundUpdateFromInput = this.updateFromInput.bind(this);

        registerForChange(this.nameInput, boundUpdateFromInput);
        registerForChange(this.imageInput, boundUpdateFromInput);
        this.sortOrderMenu.addEventListener('bcd-dropdown-change', boundUpdateFromInput);
    }

    updateFromInput() {
        if (this.suppressUpdates) return;
        this.suppressUpdates = true;

        this.name = this.nameInput.value;
        this.image = this.imageInput.value;
        this.sortOrder = this.sortOrderMenu.upgrades_proto?.dropdown?.selectedOption as fomod.SortOrder || console.error('Invalid sort order selected!');

        this.suppressUpdates = false;
    }

    update() {
        if (this.suppressUpdates) return;
        this.suppressUpdates = true;

        this.nameInput.value = this.name; this.nameInput.dispatchEvent(new Event('input'));

        this.imageInput.value = this.image; this.imageInput.dispatchEvent(new Event('input'));

        this.sortOrderMenu.upgrades_proto?.dropdown?.selectByString(this.sortOrder);

        this.suppressUpdates = false;
    }
}



// Option Name
export class Option implements updatableObject {
    parent: fomod.Option;

    suppressUpdates = false;

    /** The name of the option */
    get moduleName(): string { return this.parent.name; } set moduleName(value: string) { this.parent.name = value; this.update(); }

    input: HTMLInputElement;
    optionArea: HTMLDivElement;

    constructor(parent: fomod.Option, optionArea: HTMLDivElement) {
        this.parent = parent;
        this.optionArea = optionArea;

        this.input = optionArea.querySelector(':scope > [identifier="nameInput"]')!.getOrCreateChildByTag('input');

        const boundUpdateFromInput = this.updateFromInput.bind(this);
        registerForChange(this.input, boundUpdateFromInput);
    }

    updateFromInput() {
        if (this.suppressUpdates) return;
        this.moduleName = this.input.value;
    }

    update() {
        this.suppressUpdates = true;

        this.input.value = this.moduleName; this.input.dispatchEvent(new Event('input'));

        this.suppressUpdates = false;
    }

}
