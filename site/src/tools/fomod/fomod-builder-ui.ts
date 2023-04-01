/* eslint-disable import/first */
import * as mdl from '../../assets/site/mdl/material.js';
import * as bcdUniversal from '../../universal.js';

import * as fomodClasses from './fomod-builder-classifications.js';
import * as fomod from './fomod-builder.js';

import './fomod-builder-bindings.js';
import './fomod-builder-steps-1st-party.js';
import './fomod-builder-steps-vortex.js';
import './fomod-builder-steps-mo2.js';

import * as bcdFS from '../../filesystem-interface.js';
import * as xml from './fomod-builder-xml-translator.js';


import pluralize_ from '../../included_node_modules/plural/index.js';
const pluralize = pluralize_ as (word: string, count: number) => string;

import vkBeautify_ from '../../included_node_modules/vkbeautify/index.js';
import type vkBeautify__ from '../../../node_modules/@types/vkbeautify/index';

const vkBeautify = vkBeautify_ as unknown as typeof vkBeautify__;

export function updatePluralDisplay(element: Element, count: number) {
    // eslint-disable-next-line prefer-template
    element.textContent = count + ' ' + pluralize(element.getAttribute('unitWord') ?? '', count);
}

export enum DropdownToLang {
    Explicit = "Manual",
    Ascending = "Alphabetical",
    Descending = "Reverse Alphabetical",

    SelectAny = "Allow Any Selections",
    SelectAll = "Force-Select Everything",
    SelectExactlyOne = "Require Exactly One Selection",
    SelectAtMostOne = "Require One or No Selections",
    SelectAtLeastOne = "Require At Least One Selection",

    NotUsable = "Not Useable",
    CouldBeUsable = "Could Be Useable",
}

export enum LangToDropdown {
    Manual = "Explicit",
    Alphabetical = "Ascending",
    "Reverse Alphabetical" = "Descending",

    "Allow Any Selections" = "SelectAny",
    "Force-Select Everything" = "SelectAll",
    "Require Exactly One Selection" = "SelectExactlyOne",
    "Require One or No Selections" = "SelectAtMostOne",
    "Require At Least One Selection" = "SelectAtLeastOne",

    "Not Useable" = "NotUsable",
    "Could Be Useable" = "CouldBeUsable",
}


export function translateDropdown(str: string): string {
    if (typeof str !== 'string') return str;
    if (str in DropdownToLang) return DropdownToLang[str as keyof typeof DropdownToLang];
    if (str in LangToDropdown) return LangToDropdown[str as keyof typeof LangToDropdown];
    return str;
}


export class BCDDropdownSortingOrder extends bcdUniversal.BCDDropdown {
    static readonly asString = 'FOMOD Builder - Sorting Order Dropdown';
    static readonly cssClass = 'bcd-dropdown-sorting-order';

    constructor(element: Element) {
        super(element, element.previousElementSibling!, true);
    }

    override options() {
        return {
            'Manual': null,
            'Alphabetical': null,
            'Reverse Alphabetical': null
        };
    }
}

export class BCDDropdownGroupType extends bcdUniversal.BCDDropdown {
    static readonly asString = 'FOMOD Builder - Group Type Dropdown';
    static readonly cssClass = 'bcd-dropdown-group-type';

    constructor(element: Element) {
        super(element, element.previousElementSibling!, true);
    }

    override options() {
        return {
            "Allow Any Selections": null,
            "Force-Select Everything": null,
            "Require Exactly One Selection": null,
            "Require One or No Selections": null,
            "Require At Least One Selection": null,
        };
    }
}

export class BCDDropdownOptionState extends bcdUniversal.BCDDropdown {
    static readonly asString = 'FOMOD Builder - Option State Dropdown';
    static readonly cssClass = 'bcd-dropdown-option-state';

    constructor(element: Element) {
        super(element, element.previousElementSibling!, true);
    }

    override options() {
        return {
            "Optional": null,
            "Recommended": null,
            "Could Be Useable": null,
            "Required": null,
            "Not Useable": null
        };
    }
}



export interface WindowUI {
    openFolder: typeof openFolder;
    save: typeof save;
    cleanSave: typeof cleanSave;
    attemptRepair: () => unknown;
    setStepEditorType: typeof setStepEditorType;
}


export type BCDBuilderType = 'builder'|'vortex'|'mo2';

let firstSetEditor = true;
export function setStepEditorType(type: BCDBuilderType) {

    const workingEditors = ['builder'];
    if (!workingEditors.includes(type)) type = 'builder';


    const thisElem = document.getElementById(`steps-${type}-container`)!;
    const otherSteps = thisElem.parentElement!.querySelectorAll(`.fomod-editor-type:not(#steps-${type}-container)${firstSetEditor ? '' : '.active'}`)!;

    if (!firstSetEditor && thisElem.classList.contains('.active')) return;

    if (type !== 'builder') {
        if (!window.lazyStylesLoaded) thisElem.classList.add('needs-lazy');
        else thisElem.classList.remove('needs-lazy');
    }

    function transitionPhaseTwo() {
        otherSteps.forEach(e => {
            e.classList.remove('active_');
            e.removeEventListener('transitionend', transitionPhaseTwo);
            e.ariaHidden = 'true';
            e.setAttribute('hidden', '');
        });

        thisElem.classList.add('active_');
        thisElem.ariaHidden = 'false';
        thisElem.removeAttribute('hidden');

        bcdUniversal.nestAnimationFrames(2, ()=>{
            thisElem.classList.add('active');
        });
    }

    if (otherSteps.length === 0) transitionPhaseTwo();
    else {
        otherSteps.forEach(e => {
            e.classList.remove('active');
            e.addEventListener('transitionend', transitionPhaseTwo, {once: true});
        });
        setTimeout(transitionPhaseTwo, 200);
    }

    firstSetEditor = false;
    window.FOMODBuilder.storage.preferences!.stepsBuilder = type;
}

export async function showOpenAnotherFolderDialog() {
    const dialog = document.getElementById('opening-other-project-modal')!.upgrades!.getExtends(bcdUniversal.BCDModalDialog)[0]!;
    const result = await dialog.show();
    if (result !== 'confirm') {
        console.debug(`User cancelled opening another folder with response "${result}"`);
        return false;
    } else {
        console.debug(`User confirmed opening another folder with response "${result}"`);
        return true;
    }
}

let tabList: HTMLDivElement|null = null;
export async function openFolder(test = false) {
    if (loadingFomod.state) return;


    if ( (window.FOMODBuilder.directory || window.FOMODBuilder.trackedFomod) && !await showOpenAnotherFolderDialog())
        return;

    if (test) {
        loadingFomod.state = true;

        window.loadTestFOMOD();

        postLoad();

        return;
    }

    if ('showDirectoryPicker' in window) return await openFolder_entry();

    postLoad(false);

    console.warn('No directory picker available for your system!');
    fomod.getNoSupportModal()?.show();
}

export async function postLoad(loaded = true) {
    await bcdUniversal.wait(100);
    loadingFomod.state = false;

    tabList ??= document.getElementById('tablist') as HTMLDivElement;

    if (loaded) {
        tabList.removeAttribute('disabled');
        tabList.classList.remove('tabs-list-container--hidden');
    } else {
        tabList.setAttribute('disabled', '');
        tabList.classList.add('tabs-list-container--hidden');
    }
}

export const loadingFomod = {state: false};

export async function openFolder_entry() {
    if (loadingFomod.state) return;
    loadingFomod.state = true;

    console.debug('Opening a folder!');

    const picked = await bcdFS.getUserPickedFolder(true);
    if (!picked) return loadingFomod.state = false;

    console.debug('Picked folder:', picked);
    console.debug('Picked folder name:', picked?.handle.name);
    console.debug('Picked folder perms?', await picked?.handle.queryPermission({mode: 'readwrite'}));

    window.FOMODBuilder.directory = picked;

    const fomodDir = await picked.childDirsC['fomod']!;
    const moduleStr_ = fomodDir.childFilesC['ModuleConfig.xml']!.then(file => file.readAsText());
    const infoStr_ = fomodDir.childFilesC['Info.xml']!.then(file => file.readAsText());

    const [moduleStr, infoStr] = await Promise.all([moduleStr_, infoStr_]);

    xml.translateWhole(moduleStr, infoStr, true);

    postLoad();
}

/** An alternative to `save` that will set the DOM elements instead. */
export async function setOutputElements() {
    if (saving) return;
    saving = true;

    if (!window.FOMODBuilder.trackedFomod) throw new Error('No FOMOD is currently loaded.');

    const infoDoc = window.FOMODBuilder.trackedFomod!.infoDoc;
    const moduleDoc = window.FOMODBuilder.trackedFomod!.moduleDoc;

    let infoString = window.FOMODBuilder.trackedFomod!.obj.asInfoXML(infoDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->';
    if (window.FOMODBuilder.storage.settings.formatXML) infoString = vkBeautify.xml(infoString);
    else infoString = vkBeautify.xmlmin(infoString, true);

    console.log({infoString});
    document.getElementById('info-xml')!.textContent = infoString;

    let moduleString = window.FOMODBuilder.trackedFomod!.obj.asModuleXML(moduleDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->';
    if (window.FOMODBuilder.storage.settings.formatXML) moduleString = vkBeautify.xml(moduleString);
    else moduleString = vkBeautify.xmlmin(moduleString, true);

    console.log({moduleString});
    document.getElementById('module-xml')!.textContent = moduleString;

    // Once we're done saving, note it as such.
    saving = false;
}

function formatXml(string: string) {
    if (window.FOMODBuilder.storage.settings.formatXML) return vkBeautify.xml(string);
    else return vkBeautify.xmlmin(string, true);
}

let saving = false;
export async function save() {
    if (saving) return;
    saving = true;

    if (!window.FOMODBuilder.trackedFomod) throw new Error('No FOMOD is currently loaded.');

    if (!window.FOMODBuilder.directory) {
        await setOutputElements();
        return saving = false;
    }

    const fomodFolder = (await window.FOMODBuilder.directory.childDirsC['fomod'])!;

    const fomodInfo_ = fomodFolder.childFilesC['Info.xml']!;
    const fomodModule_ = fomodFolder.childFilesC['ModuleConfig.xml']!;
    const [fomodInfo, fomodModule] = await Promise.all([fomodInfo_, fomodModule_]);


    const infoDoc = window.FOMODBuilder.trackedFomod!.infoDoc;
    const infoString = formatXml(window.FOMODBuilder.trackedFomod!.obj.asInfoXML(infoDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->');
    const writeInfoPromise = fomodInfo.write(infoString);
    console.log({infoString});

    const moduleDoc = window.FOMODBuilder.trackedFomod!.moduleDoc;
    const moduleString = formatXml(window.FOMODBuilder.trackedFomod!.obj.asModuleXML(moduleDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->');
    const writeModulePromise = fomodModule.write(moduleString);
    console.log({moduleString});



    // Once we're done saving, note it as such.
    await Promise.all([writeInfoPromise, writeModulePromise]);
    hasUnsavedChanges = false;
    saving = false;
}

export async function cleanSave(){
    if (saving) return;
    if (!window.FOMODBuilder.trackedFomod) throw new Error('No FOMOD is currently loaded.');

    window.FOMODBuilder.trackedFomod!.infoDoc = window.domParser.parseFromString('<fomod/>', 'text/xml');
    window.FOMODBuilder.trackedFomod!.moduleDoc = window.domParser.parseFromString('<config/>', 'text/xml');

    return await save();
}

let saveTimeout:null|number = null;
let hasUnsavedChanges = false;
export function autoSave() {
    if (saving || loadingFomod.state) return;
    if (!window.FOMODBuilder.trackedFomod) return;

    hasUnsavedChanges = true;

    if (!window.FOMODBuilder.storage.settings.autoSaveAfterChange) return;

    if (saveTimeout !== null) clearTimeout(saveTimeout);
    saveTimeout = bcdUniversal.afterDelay(500, () => {
        saveTimeout = null;
        if (window.FOMODBuilder.storage.settings.autoCleanSave) cleanSave();
        else save();
    });
}

window.addEventListener('beforeunload', (event) => {
    if (!hasUnsavedChanges) return;

    event.preventDefault();
    event.returnValue = '';
    return '';
});

export function init() {
    bcdUniversal.registerBCDComponents(BCDDropdownSortingOrder, BCDDropdownOptionState, BCDDropdownGroupType);
    setStepEditorType(window.FOMODBuilder.storage.preferences.stepsBuilder);

    // @ts-ignore
    window.fomodUndoManager = fomodUndoManager;

    window.registerForEvents(document, {
        save: () => save(),
    });

    console.log('FOMOD Builder UI initialized.');
}
