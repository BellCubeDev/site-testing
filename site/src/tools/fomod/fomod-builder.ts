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

    if (
        !window.showOpenFilePicker
    ) document.getElementById('no-support-modal')?.setAttribute('open-by-default', '');
};

if (window.FOMODBuilder.UI) window.FOMODBuilder.UI.openFolder = function openFolder() {
    return;
};
