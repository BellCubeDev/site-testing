import * as fomodUI from './fomod-builder-ui.js';
import * as fomodClasses from  './fomod-builder-classifications.js';
import * as bcdUniversal from '../../universal.js';

declare global {interface Window {
    FOMODBuilder: {
        UI: {
            openFolder: () => void;
            save: () => void;
            cleanSave: () => void;
            attemptRepair: () => void;
        }
        directory?: FileSystemDirectoryHandle;
        storage: builderStorage;
    };
}}

interface builderStorage {
    settings: {
        autoSaveAfterChange: boolean; // false
        alwaysCleanSave: boolean; // false

        includeInfoSchema: boolean; // true
        optimizationUsingFlags: boolean; // true

        saveConfigInXML: boolean; // false
        brandingComment: boolean; // false

        defaultGroupSortingOrder?: fomodClasses.groupSortOrder; // 'Explicit'
        defaultGroupSelectType?: fomodClasses.groupSelectType; // 'SelectAtLeastOne'
    }
}

const storageItem = localStorage.getItem(`BellCubeDev_FOMOD_BUILDER_DATA`);

window.FOMODBuilder = {

    UI: {
        openFolder: () => {},
        save: () => {},
        cleanSave: () => {},
        attemptRepair: () => {}
    },

    // Retrieves the browser storage entry if available, otherwise uses the defaults.
    storage: storageItem ? JSON.parse(storageItem) : {
        settings: {
            autoSaveAfterChange: false,
            alwaysCleanSave: false,
            includeInfoSchema: true,
            optimizationUsingFlags: true,
            saveConfigInXML: false,
            brandingComment: false,
            defaultGroupSortingOrder: 'Explicit',
            defaultGroupSelectType: 'SelectAtLeastOne',
        }
    },
};

function saveStorage() {
    try {
        localStorage.setItem(`BellCubeDev_FOMOD_BUILDER_DATA`, JSON.stringify(window.FOMODBuilder.storage));
    } catch (e) {

    }
}

window.bcd_init_functions.fomodBuilder = function fomodBuilderInit() {
    console.debug('Initializing the FOMOD Builder!');
    bcdUniversal.registerBCDComponent(fomodUI.bcdDropdownSortingOrder);

    const APIs:bcdUniversal.objOf<Function> = {
        /* File System Access API */'<a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API" target="_blank" rel="noopener">File System Access API</a>': window.showOpenFilePicker,
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

if (window.FOMODBuilder.UI) window.FOMODBuilder.UI.openFolder = function openFolder() {
    return;
};
