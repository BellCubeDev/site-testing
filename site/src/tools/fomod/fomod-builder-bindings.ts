/** This file contains code to update the information displayed within the mainClasses.Fomod Builder UI
 */

import * as mainClasses from './fomod-builder-classifications.js';
import { registerForEvents, UpdatableObject } from '../../universal.js';

export class ModMetadata extends UpdatableObject {
    parent: mainClasses.Fomod;

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

    constructor(parent: mainClasses.Fomod) {
        super();
        this.parent = parent;

        this.nameInput = document.getElementById("metadata-mod-name")!.getOrCreateChildByTag('input');
        this.authorInput = document.getElementById("metadata-mod-author")!.getOrCreateChildByTag('input');
        this.versionInput = document.getElementById("metadata-mod-version")!.getOrCreateChildByTag('input');
        this.idInput = document.getElementById("metadata-mod-id")!.getOrCreateChildByTag('input');
        this.urlInput = document.getElementById("metadata-mod-url")!.getOrCreateChildByTag('input');

        registerForEvents(this.nameInput, {change: this.updateFromInput_bound});
        registerForEvents(this.authorInput, {change: this.updateFromInput_bound});
        registerForEvents(this.versionInput, {change: this.updateFromInput_bound});
        registerForEvents(this.idInput, {change: this.updateFromInput_bound});
        registerForEvents(this.urlInput, {change: this.updateFromInput_bound});
    }

    override updateFromInput_() {
        this.metaName = this.nameInput.value;
        this.author = this.authorInput.value;
        this.version = this.versionInput.value;
        this.url = this.urlInput.value;

        const [,id] = this.idInput.value.match(/^\s*(\d+)\s*$/) ?? [];
        if (id) this.id = parseInt(id);
        else this.id = null;
    }

    override update_() {
        this.nameInput.value = this.metaName;               this.nameInput.dispatchEvent(new Event('input'));
        this.authorInput.value = this.author;           this.authorInput.dispatchEvent(new Event('input'));
        this.versionInput.value = this.version;         this.versionInput.dispatchEvent(new Event('input'));
        this.idInput.value = this.id?.toString() ?? ''; this.idInput.dispatchEvent(new Event('input'));
        this.urlInput.value = this.url;                 this.urlInput.dispatchEvent(new Event('input'));
    }
}
mainClasses.addUpdateObjects(mainClasses.Fomod, ModMetadata);
