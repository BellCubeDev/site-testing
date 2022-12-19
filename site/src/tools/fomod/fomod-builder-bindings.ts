/** This file contains code to update the information displayed within the FOMOD Builder UI
 */

import type { updatableObject } from './fomod-builder.js';
import type { FOMOD } from './fomod-builder-classifications.js';

export class modName implements updatableObject {
    parent: FOMOD;

    /** The name of the mod */
    get name(): string { return this.parent.metaName; } set name(value: string) { this.parent.metaName = value; this.update(); }

    input: HTMLInputElement;

    constructor(parent: FOMOD) {
        this.parent = parent;

        this.input = document.getElementById("metadata-mod-name")!.getOrCreateChild('input');

        const boundUpdateFromInput = this.updateFromInput.bind(this);
        this.input.addEventListener('input', boundUpdateFromInput);
        this.input.addEventListener('change', boundUpdateFromInput);
    }

    updateFromInput() {
        this.name = this.input.value;
    }

    update() {
        this.input.value = this.name;
    }
}
