import * as fomodUI from './fomod-builder-ui.js';
import * as fomodClasses from  './fomod-builder-classifications.js';
import * as bcdUniversal from '../../universal.js';

declare global {interface Window {
    FOMODBuilder: {
        UI?: {
            openFolder: () => void;
            save: () => void;
            cleanSave: () => void;
            attemptRepair: () => void;
        }
        directory?: FileSystemDirectoryHandle;
    };
}}
window.FOMODBuilder = {};

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

    if (unavailableAPIs) {
        const noSupportModal = document.getElementById('no-support-modal');
        noSupportModal?.setAttribute('open-by-default', '');

        const replaceMeElem = noSupportModal?.getElementsByClassName('replace_me_txt')[0] as HTMLElement|undefined;

        if (replaceMeElem) {

            const lastAPITested = unavailableAPIs.pop();
            replaceMeElem.innerHTML = unavailableAPIs.join(', ');

            if (lastAPITested && unavailableAPIs.length > 1) replaceMeElem.innerHTML += `, and ${lastAPITested}`;

            else if (lastAPITested && unavailableAPIs.length) replaceMeElem.innerHTML += ` and ${lastAPITested}`;

            else replaceMeElem.innerHTML += lastAPITested;

        }

    }
};

if (window.FOMODBuilder.UI) window.FOMODBuilder.UI.openFolder = function openFolder() {
    return;
};
