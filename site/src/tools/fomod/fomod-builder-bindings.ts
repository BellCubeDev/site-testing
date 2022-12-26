/** This file contains code to update the information displayed within the FOMOD Builder UI
 */

import type { updatableObject } from './fomod-builder.js';
import type { Fomod } from './fomod-builder-classifications.js';

export class modMetadata implements updatableObject {
    parent: Fomod;

    /** The name of the mod */
    get name(): string { return this.parent.metaName; } set name(value: string) { this.parent.metaName = value; this.update(); }
    nameInput: HTMLInputElement;

    /** The author of the mod */
    get author(): string { return this.parent.metaAuthor; } set author(value: string) { this.parent.metaAuthor = value; this.update(); }
    authorInput: HTMLInputElement;

    /** The version of the mod */
    get version(): string { return this.parent.metaVersion; } set version(value: string) { this.parent.metaVersion = value; this.update(); }
    versionInput: HTMLInputElement;

    /** The ID of the mod */
    get id(): number { return this.parent.metaId; } set id(value: number) { this.parent.metaId = value; this.update(); }
    idInput: HTMLInputElement;

    /** The URL of the mod */
    get url(): string { return this.parent.getURLAsString(); } set url(value: URL|string) { this.parent.metaUrl = value; this.update(); }
    urlInput: HTMLInputElement;

    constructor(parent: Fomod) {
        this.parent = parent;

        this.nameInput = document.getElementById("metadata-mod-name")!.getOrCreateChild('input');
        this.authorInput = document.getElementById("metadata-mod-author")!.getOrCreateChild('input');
        this.versionInput = document.getElementById("metadata-mod-version")!.getOrCreateChild('input');
        this.idInput = document.getElementById("metadata-mod-id")!.getOrCreateChild('input');
        this.urlInput = document.getElementById("metadata-mod-url")!.getOrCreateChild('input');

        const boundUpdateFromInput = this.updateFromInput.bind(this);
        this.nameInput.addEventListener('input', boundUpdateFromInput);
        this.nameInput.addEventListener('change', boundUpdateFromInput);
    }

    updateFromInput() {
        this.name = this.nameInput.value;
        this.author = this.authorInput.value;
        this.version = this.versionInput.value;
        this.url = this.urlInput.value;

        const [,id] = this.idInput.value.match(/^\s*(\d+)\s*$/) ?? [];
        if (id) this.id = parseInt(id);
    }

    update() {
        this.nameInput.value = this.name;
        this.authorInput.value = this.author;
        this.versionInput.value = this.version;
        this.idInput.value = this.id.toString();
        this.urlInput.value = this.url;
    }
}
