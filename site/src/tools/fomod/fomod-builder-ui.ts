import * as mdl from '../../assets/site/mdl/material.js';
import * as fomodClasses from './fomod-builder-classifications.js';
import * as fomod from './fomod-builder.js';

import * as bcdUniversal from '../../universal.js';

import * as bcdFS from '../../filesystem-interface.js';
import * as xml from './fomod-builder-xml-translator.js';

import pluralize from '../../included_node_modules/plural/index.js';

import type {prettyData as prettyData__} from '../../../untyped-modules';
import prettyData_ from '../../included_node_modules/pretty-data/pretty-data.js';
const prettyData = prettyData_ as unknown as prettyData__;

// reconstruct array of shifts to use 4 spaces instead of 2 //
prettyData.pd.step = '    ';
prettyData.pd.shift = ['\n'];
for(let i = 0; i < prettyData.pd.maxdeep; i++){
    prettyData.pd.shift.push(prettyData.pd.shift[i]+prettyData.pd.step);
}

const xmlBeautify = prettyData.pd.xml.bind(prettyData.pd);
const xmlMinify = prettyData.pd.xmlmin.bind(prettyData.pd);



export class bcdDropdownSortingOrder extends bcdUniversal.BCDDropdown {
    static readonly asString = 'FOMOD Builder - Sorting Order Dropdown';
    static readonly cssClass = 'bcd-dropdown-sorting-order';

    constructor(element: Element) {
        super(element, element.previousElementSibling!, true);
    }

    override options() {
        return {'Explicit':null, 'Ascending':null, 'Descending':null};
    }
}

export class bcdDropdownOptionState extends bcdUniversal.BCDDropdown {
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



export interface windowUI {
    openFolder: typeof openFolder;
    save: typeof save;
    cleanSave: typeof cleanSave;
    attemptRepair: () => unknown;
    setStepEditorType: typeof setStepEditorType;
    openTypeConditions: (elem: HTMLElement) => unknown;
    openConditions: (elem: HTMLElement) => unknown;
}


export type bcdBuilderType = 'builder'|'vortex'|'mo2';

export function setStepEditorType(type: bcdBuilderType) {
    const thisElem = document.getElementById(`steps-${type}-container`)!;
    const otherSteps = thisElem.parentElement!.querySelectorAll(`.builderStep:not(#steps-${type}-container).active`)!;

    if (thisElem.classList.contains('.active')) return;

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
        bcdUniversal.nestAnimationFrames(2, ()=>{
            thisElem.classList.add('active');
            thisElem.ariaHidden = 'false';
            thisElem.removeAttribute('hidden');
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

    window.FOMODBuilder.storage.preferences!.stepsBuilder = type;
}

export async function showOpenAnotherFolderDialog() {
    const dialog = document.getElementById('opening-other-project-modal')!.upgrades_proto!.modalDialog!;
    const result = await dialog.show();
    if (result !== 'confirm') {
        console.debug(`User cancelled opening another folder with response "${result}"`);
        return false;
    } else {
        console.debug(`User confirmed opening another folder with response "${result}"`);
        return true;
    }
}

export async function openFolder() {
    if (loadingFomod) return;

    if (window.FOMODBuilder.directory && !await showOpenAnotherFolderDialog())
        return;

    if ('showDirectoryPicker' in window) return await openFolder_entry();

    console.warn('No directory picker available for your system!');
    fomod.getNoSupportModal()?.show();
}

let loadingFomod = false;
export async function openFolder_entry() {
    if (loadingFomod) return;
    loadingFomod = true;

    console.debug('Opening a folder!');

    const picked = await bcdFS.getUserPickedFolder(true);
    if (!picked) return loadingFomod = false;

    console.debug('Picked folder:', picked);
    console.debug('Picked folder name:', picked?.handle.name);
    console.debug('Picked folder perms?', await picked?.handle.queryPermission({mode: 'readwrite'}));

    window.FOMODBuilder.directory = picked;

    const fomodDir = await picked.childDirsC['fomod']!;

    const moduleStr_ = fomodDir.childFilesC['ModuleConfig.xml']!
                                .then(handle => handle.getFile())
                                .then(file => file.text());

    const infoStr_ = fomodDir.childFilesC['Info.xml']!
                                .then(handle => handle.getFile())
                                .then(file => file.text());

    const [moduleStr, infoStr] = await Promise.all([moduleStr_, infoStr_]);

    xml.translateWhole(moduleStr, infoStr, true);

    await new Promise<void>(r =>bcdUniversal.afterDelay(100, ()=> {
        loadingFomod = false;
        r();
    }));
}

let saving = false;
export async function save() {
    if (saving) return;
    saving = true;

    if (!window.FOMODBuilder.trackedFomod) throw new Error('No FOMOD is currently loaded.');

    if (!window.FOMODBuilder.directory) {
        const picked = await bcdFS.getUserPickedFolder(true);
        if (!picked) return saving = false;
        window.FOMODBuilder.directory = picked;
    }

    const fomodFolder = (await window.FOMODBuilder.directory.childDirsC['fomod'])!;

    const fomodInfo_ = fomodFolder.childFilesC['Info.xml']!;
    const fomodModule_ = fomodFolder.childFilesC['ModuleConfig.xml']!;
    const [fomodInfo, fomodModule] = await Promise.all([fomodInfo_, fomodModule_]);

    const infoDoc = window.FOMODBuilder.trackedFomod!.infoDoc;
    const moduleDoc = window.FOMODBuilder.trackedFomod!.moduleDoc;



    // Tell the browser to save Info.xml
    let infoString = window.FOMODBuilder.trackedFomod!.obj.asInfoXML(infoDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->';
    if (window.FOMODBuilder.storage.settings.formatXML) infoString = xmlBeautify(infoString);
    else infoString = xmlMinify(infoString, true);

    console.log({infoString});

    const writeInfoPromise = fomodInfo.createWritable().then(writable => writable.write(infoString).then(()=>writable.close()));

    // Tell the browser to save ModuleConfig.xml
    let moduleString = window.FOMODBuilder.trackedFomod!.obj.asModuleXML(moduleDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->';
    if (window.FOMODBuilder.storage.settings.formatXML) moduleString = xmlBeautify(moduleString);
    else moduleString = xmlMinify(moduleString, true);

    console.log({moduleString});

    const writeModulePromise = fomodModule.createWritable().then(writable => writable.write(moduleString).then(()=>writable.close()));



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
    if (saving || loadingFomod) return;
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
    console.log(`Has unsaved changes? ${hasUnsavedChanges}`);
    if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
        return '';
    }
});
