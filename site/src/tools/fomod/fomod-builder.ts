import * as bcdFS from '../../filesystem-interface.js';
import * as fomodUI from './fomod-builder-ui.js';
import * as fomodClasses from  './fomod-builder-classifications.js';
import * as bcdUniversal from '../../universal.js';

type bcdBuilderType = 'builder'|'vortex'|'mo2';

declare global {interface Window {
    FOMODBuilder: {
        ui: {
            openFolder: () => void;
            save: () => void;
            cleanSave: () => void;
            attemptRepair: () => void;
            setStepEditorType: (type: bcdBuilderType) => void;
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

        defaultGroupSortingOrder: fomodClasses.groupSortOrder; // 'Explicit'
        defaultGroupSelectType: fomodClasses.groupSelectType; // 'SelectAtLeastOne'
    }
    preferences: {
        stepsBuilder: bcdBuilderType
    }
}

const defaultStorage: builderStorage =  {
    settings: {
        autoSaveAfterChange: false,
        alwaysCleanSave: false,

        includeInfoSchema: true,
        optimizationUsingFlags: true,

        saveConfigInXML: false,
        brandingComment: false,

        defaultGroupSortingOrder: 'Explicit',
        defaultGroupSelectType: 'SelectAtLeastOne',
    },
    preferences: {
        stepsBuilder: 'builder',
    }
};

const fetchedStorage = JSON.parse(   localStorage.getItem('BellCubeDev_FOMOD_BUILDER_DATA') ?? '{}'   ) as builderStorage | {};

window.FOMODBuilder = {

    ui: {
        openFolder: openFolder_entry,
        save: () => {},
        cleanSave: () => {},
        attemptRepair: () => {},
        setStepEditorType(type: bcdBuilderType) {
            const thisElem = document.getElementById(`steps-${type}-container`)!;
            const activeElem = thisElem.parentElement?.querySelector('.active');

            if (thisElem === activeElem) return;

            if (type !== 'builder') {
                if (!window.lazyStylesLoaded) thisElem.classList.add('needs-lazy');
                else thisElem.classList.remove('needs-lazy');
            }

            function transitionPhaseTwo() {
                activeElem?.classList.remove('active_');
                thisElem.classList.add('active_');
                requestAnimationFrame(requestAnimationFrame.bind(window,()=>{
                    thisElem.classList.add('active');
                }));
            }

            if (!activeElem) transitionPhaseTwo();
            else {
                activeElem.classList.remove('active');

                activeElem.addEventListener('transitionend', transitionPhaseTwo, {once: true});
                setTimeout(transitionPhaseTwo, 200);
            }

            window.FOMODBuilder.storage.preferences!.stepsBuilder = type;
        }
    },

    // Retrieves the browser storage entry if available, otherwise uses the defaults.
    storage: 'settings' in fetchedStorage ? fetchedStorage : defaultStorage
};

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

function setProxies<TObj extends Record<string, any>>(obj: TObj, handler: ProxyHandler<TObj>): TObj {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value !== 'object') continue;

        setProxies(value, handler);
        obj[key as keyof TObj] = new Proxy(value ?? {}, handler);

    }
    return obj;
}

setProxies(window.FOMODBuilder.storage, {get: storageProxyHandler_get, set: storageProxyHandler_set});

window.bcd_init_functions.fomodBuilder = function fomodBuilderInit() {

    console.debug('Initializing the FOMOD Builder!');

    bcdUniversal.registerBCDComponent(fomodUI.bcdDropdownSortingOrder);

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

async function openFolder_entry() {
    console.debug('Opening a folder!');
    const picked = await bcdFS.getUserPickedFolder(true);
    console.debug('Picked folder:', picked);
    console.debug('Picked folder name:', picked?.handle.name);
    console.debug('Picked folder perms?', await picked?.handle.queryPermission({mode: 'readwrite'}));
}
