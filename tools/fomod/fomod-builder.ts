import * as bcdFS from '../../filesystem-interface.js';
import * as fomodUI from './fomod-builder-ui.js';
import * as fomodClasses from  './fomod-builder-classifications.js';
import * as bcdUniversal from '../../universal.js';

declare global {interface Window {
    FOMODBuilder: {
        ui: fomodUI.WindowUI
        directory?: bcdFS.writeableFolder;
        storage: builderStorage;
        fomodClass: typeof fomodClasses.Fomod;
        trackedFomod: null | {
            obj: fomodClasses.Fomod,
            infoDoc: XMLDocument,
            moduleDoc: XMLDocument,
        };
    };
}}

export interface builderStorage {
    storageRevision: number,
    /** Values that the user has explicitly set */
    settings: {
        /** Save after each change?
            @default false */
        autoSaveAfterChange: boolean; // false
        /** ALWAYS nuke the document and start anew?
            @default false */
        autoCleanSave: boolean; // false

        /** Keep the Name in Info.xml and the Module Name in Module.xml synced?
           Will prefer the name in Info.xml if they are different
           @default true */
        keepNamesSynced: boolean; // true - disable when loading a FOMOD with desynced names

        /** Include a schema link inside Info.xml?
            @default true */
        includeInfoSchema: boolean; // true
        /** Automatically optimize the FOMOD by moving file installs to the end rather than after each step
            @default true */
        optimizationUsingFlags: boolean; // true

        /** Whether or not we should save the FOMOD Builder settings inside of the XML document rather than the browser
            @default false */
        saveConfigInXML: boolean; // false
        /** Whether or not we should include a comment directing users to the FOMOD Builder
            @default false */
        brandingComment: boolean; // false

        /** What should the default Group Sorting Order be?
            @default 'Explicit' */
        defaultSortingOrder: fomodClasses.SortOrder; // 'Explicit'
        /** What should the default Group Selection type be?
            @default 'SelectAtLeastOne' */
        defaultGroupSelectType: fomodClasses.GroupSelectType; // 'SelectAtLeastOne'

        /** Whether we should format XML documents on save
            @default true */
        formatXML: boolean; // true
    }
    /** Things that the code has determined that the user prefers */
    preferences: {
        stepsBuilder: fomodUI.BCDBuilderType, // 'builder'
    }
}

const storageRevision = 1;
const defaultStorage: builderStorage =  {
    storageRevision,
    settings: {
        autoSaveAfterChange: false,
        autoCleanSave: false,

        keepNamesSynced: true, // be sure to disable when loading a FOMOD with desynced names

        includeInfoSchema: true,
        optimizationUsingFlags: true,

        saveConfigInXML: false,
        brandingComment: false,

        defaultSortingOrder: 'Explicit',
        defaultGroupSelectType: 'SelectAtLeastOne',

        formatXML: true,
    },
    preferences: {
        stepsBuilder: 'builder',
    }
};

// eslint-disable-next-line @typescript-eslint/ban-types
function mergeObjects(obj1: Object, obj2: Object): Object {
    const obj1Keys = Object.keys(obj1) as (keyof typeof obj1)[];
    const obj2Keys = Object.keys(obj2) as (keyof typeof obj2)[];

    const returnObj: Record<string, any> = {};

    for (let i = 0; i < obj1Keys.length; i++) {
        const key = obj1Keys[i]!;

        if (key in obj2) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object')
                    returnObj[key] = mergeObjects(obj1[key], obj2[key]);
            else returnObj[key] = obj2[key] ?? obj1[key];
        } else
            returnObj[key] = obj1[key];

    }

    return returnObj;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const fetchedStorage = JSON.parse(   localStorage.getItem('BellCubeDev_FOMOD_BUILDER_DATA') ?? '{}'   ) as builderStorage | {};

window.FOMODBuilder = {

    ui: {
        openFolder: fomodUI.openFolder,
        save: fomodUI.save,
        cleanSave: fomodUI.cleanSave,
        attemptRepair: () => {},
        setStepEditorType: fomodUI.setStepEditorType,
    },

    // Retrieves the browser storage entry if available, otherwise uses the defaults.
    storage: mergeObjects(defaultStorage, fetchedStorage) as builderStorage,

    fomodClass: fomodClasses.Fomod,

    trackedFomod: null
};

export const save = fomodUI.save;

function saveStorage() {
    bcdUniversal.updateSettings();
    try {
        localStorage.setItem('BellCubeDev_FOMOD_BUILDER_DATA', JSON.stringify(window.FOMODBuilder.storage));
    } catch {
        return false;
    }
    return true;
}

window.FOMODBuilder.storage = bcdUniversal.setProxies(window.FOMODBuilder.storage, {
    set(): boolean {
        return saveStorage();
    }
});
saveStorage();

let noSupportModal: bcdUniversal.BCDModalDialog|null = null;
export function getNoSupportModal(): bcdUniversal.BCDModalDialog|null {
    if (noSupportModal) return noSupportModal;

    const APIs: Record<string, Function> = {
        /* File System Access API */'<a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API" target="_blank" rel="noopener noreferrer">File System Access API</a>': window.showOpenFilePicker,
    };
    const unavailableAPIs: string[] = [];
    for (const [api, testFunct] of Object.entries(APIs)) {
        if (!testFunct) unavailableAPIs.push(api);
    }

    const noSupportModal_elem = document.getElementById('no-support-modal') as HTMLDialogElement|null;
    if (!noSupportModal_elem) {
        noSupportModal = null;
        return null;
    }

    if (unavailableAPIs.length) noSupportModal_elem.setAttribute('open-by-default', '');

    const replaceMeElem = noSupportModal_elem.getElementsByClassName('js-bcd-modal-body')[0]?.getElementsByClassName('replace_me_txt')[0] as HTMLElement|undefined;

    if (replaceMeElem) {

        const lastAPITested = unavailableAPIs.pop();
        replaceMeElem.innerHTML = unavailableAPIs.join(', ');

        if (lastAPITested) {
            if (unavailableAPIs.length > 1) replaceMeElem.innerHTML += `, and ${lastAPITested}`;

            else if (unavailableAPIs.length) replaceMeElem.innerHTML += ` and ${lastAPITested}`;

            else replaceMeElem.innerHTML += lastAPITested;
        }

    }

    noSupportModal = noSupportModal_elem.upgrades?.getExtends(bcdUniversal.BCDModalDialog)?.[0] ?? null;
    return noSupportModal;
}

window.bcd_init_functions.fomodBuilder = function fomodBuilderInit() {
    console.debug('Initializing the FOMOD Builder!');

    getNoSupportModal();

    fomodUI.init();

    bcdUniversal.updateSettings();

    console.debug('FOMOD Builder initialized!');
};
