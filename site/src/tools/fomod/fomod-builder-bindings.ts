/** This file contains code to update the information displayed within the FOMOD Builder UI
 */

import type { updatableObject } from './fomod-builder.js';
import type { Fomod } from './fomod-builder-classifications.js';
import { registerForChange } from '../../universal.js';

export class modMetadata implements updatableObject {
    parent: Fomod;

    /** The name of the mod */
    get metaName(): string { return this.parent.metaName; } set metaName(value: string) { this.parent.metaName = value; this.update(); }
    nameInput: HTMLInputElement;

    /** The author of the mod */
    get author(): string { return this.parent.metaAuthor; } set author(value: string) { this.parent.metaAuthor = value; this.update(); }
    authorInput: HTMLInputElement;

    /** The version of the mod */
    get version(): string { return this.parent.metaVersion; } set version(value: string) { this.parent.metaVersion = value; this.update(); }
    versionInput: HTMLInputElement;

    /** The ID of the mod */
    get id(): number|null { return this.parent.metaId; } set id(value: number|null) { this.parent.metaId = value; this.update(); }
    idInput: HTMLInputElement;

    /** The URL of the mod */
    get url(): string { return this.parent.getURLAsString(); } set url(value: URL|string) { this.parent.metaUrl = value; this.update(); }
    urlInput: HTMLInputElement;

    constructor(parent: Fomod) {
        this.parent = parent;

        this.nameInput = document.getElementById("metadata-mod-name")!.getOrCreateChildByTag('input');
        this.authorInput = document.getElementById("metadata-mod-author")!.getOrCreateChildByTag('input');
        this.versionInput = document.getElementById("metadata-mod-version")!.getOrCreateChildByTag('input');
        this.idInput = document.getElementById("metadata-mod-id")!.getOrCreateChildByTag('input');
        this.urlInput = document.getElementById("metadata-mod-url")!.getOrCreateChildByTag('input');

        const boundUpdateFromInput = this.updateFromInput.bind(this);

        registerForChange(this.nameInput, boundUpdateFromInput);
        registerForChange(this.authorInput, boundUpdateFromInput);
        registerForChange(this.versionInput, boundUpdateFromInput);
        registerForChange(this.idInput, boundUpdateFromInput);
        registerForChange(this.urlInput, boundUpdateFromInput);
    }

    suppressUpdates = false;
    updateFromInput() {
        if (this.suppressUpdates) return;
        this.suppressUpdates = true;

        this.metaName = this.nameInput.value;
        this.author = this.authorInput.value;
        this.version = this.versionInput.value;
        this.url = this.urlInput.value;

        const [,id] = this.idInput.value.match(/^\s*(\d+)\s*$/) ?? [];
        if (id) this.id = parseInt(id);
        else this.id = null;

        this.suppressUpdates = false;
    }

    update() {
        if (this.suppressUpdates) return;
        this.suppressUpdates = true;

        this.nameInput.value = this.metaName;               this.nameInput.dispatchEvent(new Event('input'));
        this.authorInput.value = this.author;           this.authorInput.dispatchEvent(new Event('input'));
        this.versionInput.value = this.version;         this.versionInput.dispatchEvent(new Event('input'));
        this.idInput.value = this.id?.toString() ?? ''; this.idInput.dispatchEvent(new Event('input'));
        this.urlInput.value = this.url;                 this.urlInput.dispatchEvent(new Event('input'));

        this.suppressUpdates = false;
    }
}
