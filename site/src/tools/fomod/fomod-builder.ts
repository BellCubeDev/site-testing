import * as bcdFS from '../../filesystem-interface.js';
import * as fomodUI from './fomod-builder-ui.js';
import * as fomodClasses from  './fomod-builder-classifications.js';
import * as bcdUniversal from '../../universal.js';
import * as xml from './fomod-builder-xml-translator.js';


declare global {interface Window {
    domParser: DOMParser;
    FOMODBuilder: {
        ui: fomodUI.windowUI
        directory?: bcdFS.writeableFolder;
        storage: builderStorage;
        fomodClass: typeof fomodClasses.FOMOD;
        testingFomod?: fomodClasses.FOMOD;
        testingInfoDoc: XMLDocument;
        testingModuleDoc: XMLDocument;
        trackedFomod: null | {
            obj: fomodClasses.FOMOD,
            infoDoc: XMLDocument,
            moduleDoc: XMLDocument,
        };
    };
}}

window.domParser = new DOMParser();
const domParser = window.domParser;

export interface builderStorage {
    storageRevision: number,
    /** Values that the user has explicitly set */
    settings: {
        /** Save after each change?
            @default false */
        autoSaveAfterChange: boolean; // false
        /** ALWAYS nuke the document and start anew?
            @default false */
        alwaysCleanSave: boolean; // false

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
        defaultGroupSortingOrder: fomodClasses.sortOrder; // 'Explicit'
        /** What should the default Group Selection type be?
            @default 'SelectAtLeastOne' */
        defaultGroupSelectType: fomodClasses.groupSelectType; // 'SelectAtLeastOne'

        /** Whether we should format XML documents on save
            @default true */
        formatXML: boolean; // true
    }
    /** Things that the code has determined that the user prefers */
    preferences: {
        stepsBuilder: fomodUI.bcdBuilderType, // 'builder'
    }
}

const storageRevision = 1;
const defaultStorage: builderStorage =  {
    storageRevision,
    settings: {
        autoSaveAfterChange: false,
        alwaysCleanSave: false,

        includeInfoSchema: true,
        optimizationUsingFlags: true,

        saveConfigInXML: false,
        brandingComment: false,

        defaultGroupSortingOrder: 'Explicit',
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
        openFolder: fomodUI.openFolder_entry,
        save: fomodUI.save,
        cleanSave: fomodUI.cleanSave,
        attemptRepair: () => {},
        setStepEditorType: fomodUI.setStepEditorType,
        openTypeConditions: () => {},
    },

    // Retrieves the browser storage entry if available, otherwise uses the defaults.
    storage: mergeObjects(defaultStorage, fetchedStorage) as builderStorage,

    fomodClass: fomodClasses.FOMOD,

    testingInfoDoc: domParser.parseFromString('<fomod></fomod>', 'text/xml'),
    testingModuleDoc: domParser.parseFromString('<config></config>', 'text/xml'),

    trackedFomod: null
};
window.FOMODBuilder.testingFomod = new fomodClasses.FOMOD();

export const save = fomodUI.save;

function saveStorage() {
    try {
        localStorage.setItem('BellCubeDev_FOMOD_BUILDER_DATA', JSON.stringify(window.FOMODBuilder.storage));
    } catch {
        return false;
    }
    return true;
}

function storageProxyHandler_get<TObj, TKey extends keyof TObj>(target: TObj, prop: TKey) : TObj[TKey] {
    return target[prop];
}

function storageProxyHandler_set<TObj>(target: TObj, prop: keyof TObj, value: TObj[keyof TObj], _receiver: unknown): boolean {
    target[prop] = value;
    return saveStorage();
}

window.FOMODBuilder.storage = bcdUniversal.setProxies(window.FOMODBuilder.storage, {get: storageProxyHandler_get, set: storageProxyHandler_set});
saveStorage();

window.bcd_init_functions.fomodBuilder = function fomodBuilderInit() {

    console.debug('Initializing the FOMOD Builder!');

    bcdUniversal.registerBCDComponents(fomodUI.bcdDropdownSortingOrder, fomodUI.bcdDropdownOptionState);

    window.FOMODBuilder.ui.setStepEditorType(window.FOMODBuilder.storage.preferences.stepsBuilder);

    const APIs:bcdUniversal.objOf<Function> = {
        /* File System Access API */'<a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API" target="_blank" rel="noopener noreferrer">File System Access API</a>': window.showOpenFilePicker,
    };
    const unavailableAPIs: string[] = [];
    for (const [api, testFunct] of Object.entries(APIs)) {
        if (!testFunct) unavailableAPIs.push(api);
    }

    if (unavailableAPIs && unavailableAPIs.length) {
        const noSupportModal = document.getElementById('no-support-modal');
        noSupportModal?.setAttribute('open-by-default', '');

        const replaceMeElem = noSupportModal?.getElementsByClassName('replace_me_txt')[0] as HTMLElement|undefined;

        if (replaceMeElem) {

            const lastAPITested = unavailableAPIs.pop();
            replaceMeElem.innerHTML = unavailableAPIs.join(', ');

            if (lastAPITested) {
                if (unavailableAPIs.length > 1) replaceMeElem.innerHTML += `, and ${lastAPITested}`;

                else if (unavailableAPIs.length) replaceMeElem.innerHTML += ` and ${lastAPITested}`;

                else replaceMeElem.innerHTML += lastAPITested;
            }

        }

    }
};
