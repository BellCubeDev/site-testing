import * as mdl from '../../assets/site/mdl/material.js';
import * as fomodClasses from './fomod-builder-classifications.js';
import * as fomod from './fomod-builder.js';
import * as bcdUniversal from '../../universal.js';




export class bcdDropdownSortingOrder extends bcdUniversal.bcdDropdown {
    static asString = 'FOMOD Builder - Sorting Order Dropdown';
    static cssClass = 'bcd-dropdown-sorting-order';

    override options() {
        return {'Explicit':null, 'Ascending':null, 'Descending':null};
    }
}

export class bcdDropdownOptionState extends bcdUniversal.bcdDropdown {
    static asString = 'FOMOD Builder - Option State Dropdown';
    static cssClass = 'bcd-dropdown-option-state';

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


/*\    /$\                       /$\
$$ |   $$ |                      $$ |
$$ |   $$ | $$$$$$\   $$$$$$\  $$$$$$\    $$$$$$\  $$\   $$\
\$$\  $$  |$$  __$$\ $$  __$$\ \_$$  _|  $$  __$$\ \$$\ $$  |
 \$$\$$  / $$ /  $$ |$$ |  \__|  $$ |    $$$$$$$$ | \$$$$  /
  \$$$  /  $$ |  $$ |$$ |        $$ |$$\ $$   ____| $$  $$<
   \$  /   \$$$$$$  |$$ |        \$$$$  |\$$$$$$$\ $$  /\$$\
    \_/     \______/ \__|         \____/  \_______|\__/  \_*/
