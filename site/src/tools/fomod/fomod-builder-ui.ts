import * as mdl from '../../assets/site/mdl/material.js';
import * as fomodClasses from './fomod-builder-classifications.js';
import * as fomod from './fomod-builder.js';
import * as bcdUniversal from '../../universal.js';
import * as bcdFS from '../../filesystem-interface.js';
import formatHTML from '../../included_node_modules/html-format/index.js';

import * as xml from './fomod-builder-xml-translator.js';

export class bcdDropdownSortingOrder extends bcdUniversal.BCDDropdown {
    static readonly asString = 'FOMOD Builder - Sorting Order Dropdown';
    static readonly cssClass = 'bcd-dropdown-sorting-order';

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
    openFolder: () => void;
    save: () => void;
    cleanSave: () => void;
    attemptRepair: () => void;
    setStepEditorType: (type: bcdBuilderType) => void;
    openTypeConditions: (elem: HTMLElement) => void;
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
        });

        thisElem.classList.add('active_');
        requestAnimationFrame(requestAnimationFrame.bind(window,()=>{
            thisElem.classList.add('active');
        }));
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

export async function openFolder_entry() {
    console.debug('Opening a folder!');
    const picked = await bcdFS.getUserPickedFolder(true);
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
}

export async function save() {
    if (!window.FOMODBuilder.trackedFomod) throw new Error('No FOMOD is currently loaded.');

    if (!window.FOMODBuilder.directory) {
        const picked = await bcdFS.getUserPickedFolder(true);
        if (!picked) return;
        window.FOMODBuilder.directory = picked;
    }

    const fomodFolder = (await window.FOMODBuilder.directory.childDirsC['fomod']!);

    const fomodInfo_ = fomodFolder.childFilesC['Info.xml']!;
    const fomodModule_ = fomodFolder.childFilesC['ModuleConfig.xml']!;
    const [fomodInfo, fomodModule] = await Promise.all([fomodInfo_, fomodModule_]);

    const infoDoc = window.FOMODBuilder.trackedFomod!.infoDoc;
    const moduleDoc = window.FOMODBuilder.trackedFomod!.moduleDoc;

    // Tell the browser to save Info.xml
    let infoString = window.FOMODBuilder.trackedFomod!.obj.asInfoXML(infoDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->';
    if (window.FOMODBuilder.storage.settings.formatXML) infoString = formatHTML(infoString, '    ', Number.MAX_SAFE_INTEGER);
    console.log({infoString});
    fomodInfo.createWritable().then(writable => writable.write(infoString).then(()=>writable.close()));

    // Tell the browser to save ModuleConfig.xml
    let moduleString = window.FOMODBuilder.trackedFomod!.obj.asModuleXML(moduleDoc).outerHTML || '<!-- ERROR - Serialized document was empty! -->';
    if (window.FOMODBuilder.storage.settings.formatXML) moduleString = formatHTML(moduleString, '    ', Number.MAX_SAFE_INTEGER);
    console.log({moduleString});
    fomodModule.createWritable().then(writable => writable.write(moduleString).then(()=>writable.close()));
}

export function cleanSave(){
    if (!window.FOMODBuilder.trackedFomod) throw new Error('No FOMOD is currently loaded.');

    window.FOMODBuilder.trackedFomod!.infoDoc = window.domParser.parseFromString('<fomod/>', 'text/xml');
    window.FOMODBuilder.trackedFomod!.moduleDoc = window.domParser.parseFromString('<config/>', 'text/xml');

    save();
}


/*\    /$\                       /$\
$$ |   $$ |                      $$ |
$$ |   $$ | $$$$$$\   $$$$$$\  $$$$$$\    $$$$$$\  $$\   $$\
\$$\  $$  |$$  __$$\ $$  __$$\ \_$$  _|  $$  __$$\ \$$\ $$  |
 \$$\$$  / $$ /  $$ |$$ |  \__|  $$ |    $$$$$$$$ | \$$$$  /
  \$$$  /  $$ |  $$ |$$ |        $$ |$$\ $$   ____| $$  $$<
   \$  /   \$$$$$$  |$$ |        \$$$$  |\$$$$$$$\ $$  /\$$\
    \_/     \______/ \__|         \____/  \_______|\__/  \_*/
