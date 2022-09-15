import { request } from 'http';
import * as mdl from './assets/site/mdl/material.js';
import * as quotes from './universal_quotes.js';

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap



$$\   $$\   $$\     $$\ $$\ $$\   $$\     $$\
$$ |  $$ |  $$ |    \__|$$ |\__|  $$ |    \__|
$$ |  $$ |$$$$$$\   $$\ $$ |$$\ $$$$$$\   $$\  $$$$$$\   $$$$$$$\
$$ |  $$ |\_$$  _|  $$ |$$ |$$ |\_$$  _|  $$ |$$  __$$\ $$  _____|
$$ |  $$ |  $$ |    $$ |$$ |$$ |  $$ |    $$ |$$$$$$$$ |\$$$$$$\
$$ |  $$ |  $$ |$$\ $$ |$$ |$$ |  $$ |$$\ $$ |$$   ____| \____$$\
\$$$$$$  |  \$$$$  |$$ |$$ |$$ |  \$$$$  |$$ |\$$$$$$$\ $$$$$$$  |
 \______/    \____/ \__|\__|\__|   \____/ \__| \_______|\______*/



// ================================
// ======== TYPE UTILITIES ========
// ================================

export type objOf<T> = {[key:string]: T};


// ==================================
// ======== STRING UTILITIES ========
// ==================================

/** Removes whitespace at the beginning and end of a string and at the end of every included line*/
export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Removes whitespace at the beginning and end of a string and at the end of every included line*/
export function trimWhitespace(str: string): string {
    return  str.trimStart()                // Trim whitespace at the start of the string
                .trimEnd()                  // Trim whitespace at the end of the string
                .replace(/[^\S\n]*$/gm, '') // Trim whitespace at the end of each line
;}


// =================================
// ======== ARRAY UTILITIES ========
// =================================

export function sortArr<TUnknown>(arr: TUnknown[], refArr: TUnknown[]) {
    arr.sort(function(a, b){
        return refArr.indexOf(a) - refArr.indexOf(b);
    });
}

// ==================================
// ======== NUMBER UTILITIES ========
// ==================================

export function randomNumber(min = 0, max = 1, places = 0):number{
    const placesMult = Math.pow(10, places);
    //console.log(`10^${places} = ${placesMult}`);
    return (
        Math.round(
            (
                Math.random() * (max - min) + min
            ) * placesMult
        ) / placesMult
    );
}


// ===============================
// ======== DOM UTILITIES ========
// ===============================

export function focusAnyElement(element:HTMLElement|undefined, preventScrolling: boolean = true):void{
    if (!element || !element.focus) return;

    const hadTabIndex = element.hasAttribute('tabindex');
    if (!hadTabIndex) element.setAttribute('tabindex', '0');

    element.focus({preventScroll: preventScrolling});

    // Wrap inside two requestAnimationFrame calls to ensure the browser could focus the element before removing the tabindex attribute.
    requestAnimationFrame(() => {requestAnimationFrame(() => {
        if (!hadTabIndex) element.removeAttribute('tabindex');
    });});
}



/*$$$$$\                      $$\                 $$$$$$\           $$\   $$\
$$ ___$$\                     \__|                \_$$  _|          \__|  $$ |
$$/   $$ | $$$$$$\   $$$$$$$\ $$\  $$$$$$$\         $$ |  $$$$$$$\  $$\ $$$$$$\
$$$$$$$\ | \____$$\ $$  _____|$$ |$$  _____|        $$ |  $$  __$$\ $$ |\_$$  _|
$$  __$$\  $$$$$$$ |\$$$$$$\  $$ |$$ /              $$ |  $$ |  $$ |$$ |  $$ |
$$ |  $$ |$$  __$$ | \____$$\ $$ |$$ |              $$ |  $$ |  $$ |$$ |  $$ |$$\
$$$$$$$  |\$$$$$$$ |$$$$$$$  |$$ |\$$$$$$$\       $$$$$$\ $$ |  $$ |$$ |  \$$$$  |
 \______/  \_______|\_______/ \__| \_______|      \______|\__|  \__|\__|   \___*/



declare global {interface Window {
    /** A list of Query Parameters from the URI */
    queryParams: objOf<string>;

    /** A list of functions used when loading scripts */
    bcd_init_functions: objOf<Function>;

    /** A special class used to track components across multiple module scripts */
    bcd_ComponentTracker: bcd_ComponentTracker;
}}

enum strs {
    transitionDur = "transition-duration",
    animDur = "animation-duration",
    marginTop = "margin-top",
    classIsOpen = "is-open",
    classAdjacent = "adjacent",
    classDetailsInner = "bcd-details-inner",
    errItem = "Error Item:"
}

window.queryParams = {};

if (window.location.search[0] === '?')
    window.location.search.substring(1).split('&')
                            .map(param => param.split('='))
                            .forEach(param => window.queryParams[param[0].trim()] = param[1].trim());



interface BCDComponent extends Function {
    asString:string;
    cssClass:string;
}

// Used to store components that we'll be registering on DOM initialization
const bcdComponents:BCDComponent[] = [];

console.log("%cHello and welcome to the JavaScript console! This is where wizards do their magic!\nAs for me? I'm the wizard you don't want to anger.", "color: #2d6");



/*$$$$$\                                                                              $$\
$$  __$$\                                                                             $$ |
$$ /  \__| $$$$$$\  $$$$$$\$$$$\   $$$$$$\   $$$$$$\  $$$$$$$\   $$$$$$\  $$$$$$$\  $$$$$$\
$$ |      $$  __$$\ $$  _$$  _$$\ $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\ \_$$  _|
$$ |      $$ /  $$ |$$ / $$ / $$ |$$ /  $$ |$$ /  $$ |$$ |  $$ |$$$$$$$$ |$$ |  $$ |  $$ |
$$ |  $$\ $$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$   ____|$$ |  $$ |  $$ |$$\
\$$$$$$  |\$$$$$$  |$$ | $$ | $$ |$$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$\ $$ |  $$ |  \$$$$  |
 \______/  \______/ \__| \__| \__|$$  ____/  \______/ \__|  \__| \_______|\__|  \__|   \____/
                                  $$ |
                                  $$ |
                                  \__|
$$$$$$$$\                               $$\
\__$$  __|                              $$ |
   $$ |    $$$$$$\   $$$$$$\   $$$$$$$\ $$ |  $$\  $$$$$$\   $$$$$$\
   $$ |   $$  __$$\  \____$$\ $$  _____|$$ | $$  |$$  __$$\ $$  __$$\
   $$ |   $$ |  \__| $$$$$$$ |$$ /      $$$$$$  / $$$$$$$$ |$$ |  \__|
   $$ |   $$ |      $$  __$$ |$$ |      $$  _$$<  $$   ____|$$ |
   $$ |   $$ |      \$$$$$$$ |\$$$$$$$\ $$ | \$$\ \$$$$$$$\ $$ |
   \__|   \__|       \_______| \_______|\__|  \__| \_______|\_*/



export interface componentTrackingItem {
    obj:objOf<unknown>,
    arr:unknown[]
}


export interface trackableConstructor<TConstructor> extends Function {
    asString: string,
    new(...args: never[]): TConstructor,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string|number|symbol]: any
}

/** Wrapped in a class to get around the complexities of exporting. */
export class bcd_ComponentTracker {
    static registered_components:objOf<componentTrackingItem> = {};


    static registerComponent<TConstructor>(component:TConstructor, constructor: trackableConstructor<TConstructor>, element:HTMLElement):void{
        bcd_ComponentTracker.createComponent(constructor);

        if (element.id !== '')
            bcd_ComponentTracker.registered_components[constructor.asString].obj[element.id] = component;
        else
            bcd_ComponentTracker.registered_components[constructor.asString].arr.push(component);
    }

    static createComponent<TConstructor>(constructor:trackableConstructor<TConstructor>){
        if (typeof bcd_ComponentTracker.registered_components[constructor.asString] === 'undefined')
            bcd_ComponentTracker.registered_components[constructor.asString] = {obj: {}, arr: []};
    }


    static findItem<TConstructor>(constructor: trackableConstructor<TConstructor>, element:HTMLElement, findPredicate: (arg0:TConstructor) => boolean): TConstructor|undefined {
        if (element.id)
            return bcd_ComponentTracker.registered_components[constructor.asString].obj[element.id] as TConstructor;
        else
            return (bcd_ComponentTracker.registered_components[constructor.asString].arr as TConstructor[]).find(findPredicate);
    }
}
window.bcd_ComponentTracker = bcd_ComponentTracker;



/*$$$$$\            $$\ $$\                               $$\ $$\       $$\
$$  __$$\           $$ |$$ |                              \__|$$ |      $$ |
$$ /  \__| $$$$$$\  $$ |$$ | $$$$$$\   $$$$$$\   $$$$$$$\ $$\ $$$$$$$\  $$ | $$$$$$\
$$ |      $$  __$$\ $$ |$$ | \____$$\ $$  __$$\ $$  _____|$$ |$$  __$$\ $$ |$$  __$$\
$$ |      $$ /  $$ |$$ |$$ | $$$$$$$ |$$ /  $$ |\$$$$$$\  $$ |$$ |  $$ |$$ |$$$$$$$$ |
$$ |  $$\ $$ |  $$ |$$ |$$ |$$  __$$ |$$ |  $$ | \____$$\ $$ |$$ |  $$ |$$ |$$   ____|
\$$$$$$  |\$$$$$$  |$$ |$$ |\$$$$$$$ |$$$$$$$  |$$$$$$$  |$$ |$$$$$$$  |$$ |\$$$$$$$\
 \______/  \______/ \__|\__| \_______|$$  ____/ \_______/ \__|\_______/ \__| \_______|
                                      $$ |
                                      $$ |
                                      \_*/



class bcd_collapsibleParent {
    // For children to set
    details!:HTMLElement;
    details_inner!:HTMLElement;
    summary!:HTMLElement;
    openIcons90deg!:HTMLCollection;

    // For us to set
    self:HTMLElement;
    adjacent:boolean = false;

    constructor(elm:HTMLElement){
        this.self = elm;
        this.adjacent = elm.classList.contains(strs.classAdjacent);
    }

    isOpen():boolean {//this.debugCheck();
        return this.details.classList.contains(strs.classIsOpen) || this.summary.classList.contains(strs.classIsOpen);
    }

    /** Toggle the collapsible menu. */
    toggle(doSetDuration:boolean = true) {//this.debugCheck();
        /*console.log('[BCD-DETAILS] toggle() called on ',this)*/
        if (this.isOpen()) { this.close(doSetDuration); } else { this.open(doSetDuration); }
    }

    /** Re-evaluate the collapsible's current state. */
    reEval(doSetDuration?:false):void
    reEval(doSetDuration?:true, instant?:true):void
    reEval(doSetDuration:boolean = true, instant?:true):void {
                requestAnimationFrame(() => {
            if (this.isOpen()) { this.open(doSetDuration, instant); } else { this.close(doSetDuration, instant); }
        });
    }

    /** Open the collapsible menu. */
    open(doSetDuration:boolean = true, instant = false) {//this.debugCheck();
        if (!instant) this.evaluateDuration(doSetDuration);

        if (instant) this.instantTransition();
        this.details_inner.style.marginTop = `0px`;

        // Wrap `evaluateDuration` in two requestsAnimationFrames to allow the CSS to properly update
        if (instant) requestAnimationFrame(() => {requestAnimationFrame(() => {this.evaluateDuration(doSetDuration);});});

        this.details.classList.add(strs.classIsOpen);
        this.summary.classList.add(strs.classIsOpen);
    }

    /** Close the collapsible menu. */
    close(doSetDuration:boolean = true, instant = false) {//this.debugCheck();
        if (doSetDuration) this.evaluateDuration(doSetDuration);

        if (instant) this.instantTransition();
        this.details_inner.style.marginTop = `-${this.details_inner.offsetHeight * 1.04}px`;

        // Wrap `evaluateDuration` in two requestsAnimationFrames to allow the CSS to properly update
        if (instant) requestAnimationFrame(()=>{requestAnimationFrame(() => {this.evaluateDuration(true);});});

        this.details.classList.remove(strs.classIsOpen);
        this.summary.classList.remove(strs.classIsOpen);
    }

    instantTransition():void {
        if (this.details_inner) {
            this.details_inner.style.transitionDuration = `0s`;
            this.details_inner.style.animationDuration = `$0s`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.animationDuration = `0s`;
            }
        }
    }

    /* Determines what the transition and animation duration of the collapsible menu is */
    evaluateDuration(doRun:boolean = true) {//this.debugCheck();
        if (doRun && this.details_inner) {
            this.details_inner.style.transitionDuration = `${200 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            this.details_inner.style.animationDuration = `${215 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.animationDuration = `${215 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            }
        }
    }
}

export class BellCubicDetails extends bcd_collapsibleParent {
    static cssClass = "bcd-details";
    static asString = "BellCubicDetails";

    /** @param {HTMLElement} element */
    constructor(element:HTMLElement) {
        super(element);
        this.details = element;

        /*console.log("[BCD-DETAILS] Registering  component: ", this)*/

        //console.log("Registering element:", this.element_);

        // Create a container element to make animation go brrr
        // Slightly over-complicated because, uh, DOM didn't want to cooperate.
        this.details_inner = document.createElement('div');
        this.details_inner.classList.add(strs.classDetailsInner);

        //console.log(this.details_inner);

        // The `children` HTMLCollection is live, so we're fetching each element and throwing it into an array...
        var temp_childrenArr:ChildNode[] = [];
        for (const node of this.details.childNodes){
            temp_childrenArr.push(node);
        }
        // ...and actually moving the elements into the new div here.
        for (const node of temp_childrenArr){
            this.details_inner.appendChild(node);
        }

        this.details.appendChild(this.details_inner);


        //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
        if (this.adjacent) {
            const temp_summary = this.self.previousElementSibling;
            if (!(temp_summary && temp_summary.classList.contains(BellCubicSummary.cssClass))) {console.log(strs.errItem, this); throw new TypeError("[BCD-DETAILS] Error: Adjacent Details element must be preceded by a Summary element.");}
            this.summary = temp_summary as HTMLElement;
        } else {
            const temp_summary = this.self.ownerDocument.querySelector(`.bcd-summary[for="${this.details.id}"`);
            if (!temp_summary) {console.log(strs.errItem, this); throw new TypeError("[BCD-DETAILS] Error: Non-adjacent Details elements must have a Summary element with a `for` attribute matching the Details element's id.");}
            this.summary = temp_summary as HTMLElement;
        }
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');
        //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});

        new ResizeObserver(this.reEvalOnSizeChange.bind(this)).observe(this.details_inner);

        requestAnimationFrame(() => {
            bcd_ComponentTracker.registerComponent(this, BellCubicDetails, this.details);
            this.reEval(true, true);
            this.self.classList.add('initialized');
        });
    }

    reEvalOnSizeChange(event: unknown) {
        this.reEval(true, true);
    }
}
bcdComponents.push(BellCubicDetails);

export class BellCubicSummary extends bcd_collapsibleParent {
    static cssClass = 'bcd-summary';
    static asString = 'BellCubicSummary';

    wasMouseDown = false

    constructor(element:HTMLElement) {
        super(element);
        this.summary = element;

        const boundHandleClick = this.handleClick.bind(this);
        this.summary.addEventListener('mouseup', (...args:unknown[]) => {if (wasMouseDown) boundHandleClick();} );
        this.summary.addEventListener('mousedown', () => wasMouseDown = true, {capture: true});

        document.addEventListener('mousedown', () => wasMouseDown = true, {});

        this.summary.addEventListener('keypress', () => wasMouseDown = false);

        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');

        if (this.adjacent) {
            const temp_details = this.self.nextElementSibling;
            if (!(temp_details && temp_details.classList.contains(BellCubicDetails.cssClass))) {console.log(strs.errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Adjacent Summary element must be proceeded by a Details element.");}
            this.details = temp_details as HTMLElement;
        } else {
            const temp_details = this.self.ownerDocument.getElementById(this.summary.getAttribute('for') ?? '');
            if (!temp_details) {console.log(strs.errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Non-adjacent Details elements must have a summary element with a `for` attribute matching the Details element's id.");}
            this.details = temp_details as HTMLElement;
        }

        this.divertedCompletion();
    }

    divertedCompletion(){requestAnimationFrame(()=>{

        const temp_inner = this.details.querySelector(`.${strs.classDetailsInner}`);
        if (!temp_inner) {this.divertedCompletion(); return;}
            else this.details_inner = temp_inner as HTMLElement;

        bcd_ComponentTracker.registerComponent(this, BellCubicSummary, this.details);
        this.reEval(true, true);
        this.self.classList.add('initialized');
    });}

    correctFocus(keyDown?: boolean) {
        if (!this.isOpen()) focusAnyElement(this.summary as HTMLElement);
        if (this.isOpen() || !keyDown) requestAnimationFrame(() => {requestAnimationFrame(() => {
            this.summary.blur();
        });});
    }

    

    handleClick(event?:MouseEvent){
        // @ts-expect-error: Property 'path' and 'pointerType' DO exist on type 'MouseEvent', but not in Firefox or presumably Safary
        if (!event || !('pointerType' in event) || !event.pointerType || !event.path || event.path?.slice(0, 5).map((el:HTMLElement) => el.tagName === 'A').includes(true)) return;
        this.toggle();
        this.correctFocus();
    }

    handleKey(event:KeyboardEvent){
        if (event.key === ' ' || event.key === 'Enter') requestAnimationFrame(() =>{
            this.toggle();
            this.correctFocus(true);
        });
    }
}
bcdComponents.push(BellCubicSummary);

export class bcd_prettyJSON {
    static cssClass = 'bcd-prettyJSON';
    static asString = 'bcd_prettyJSON';
    element_:HTMLElement;
    constructor(element:HTMLElement) {
        this.element_ = element;

        const raw_json = element.innerText;
        const json = JSON.parse(raw_json);
        //console.log("Registered new Pretty JSON element:", element, json);

        this.element_.innerText = JSON.stringify(json, null, 2);

        this.element_.classList.add('initialized');
    }
}
bcdComponents.push(bcd_prettyJSON);
/*


$$\      $$\                 $$\           $$\       $$\ $$$$$$$\  $$\           $$\
$$$\    $$$ |                $$ |          $$ |     $$  |$$  __$$\ \__|          $$ |
$$$$\  $$$$ | $$$$$$\   $$$$$$$ | $$$$$$\  $$ |    $$  / $$ |  $$ |$$\  $$$$$$\  $$ | $$$$$$\   $$$$$$\
$$\$$\$$ $$ |$$  __$$\ $$  __$$ | \____$$\ $$ |   $$  /  $$ |  $$ |$$ | \____$$\ $$ |$$  __$$\ $$  __$$\
$$ \$$$  $$ |$$ /  $$ |$$ /  $$ | $$$$$$$ |$$ |  $$  /   $$ |  $$ |$$ | $$$$$$$ |$$ |$$ /  $$ |$$ /  $$ |
$$ |\$  /$$ |$$ |  $$ |$$ |  $$ |$$  __$$ |$$ | $$  /    $$ |  $$ |$$ |$$  __$$ |$$ |$$ |  $$ |$$ |  $$ |
$$ | \_/ $$ |\$$$$$$  |\$$$$$$$ |\$$$$$$$ |$$ |$$  /     $$$$$$$  |$$ |\$$$$$$$ |$$ |\$$$$$$  |\$$$$$$$ |
\__|     \__| \______/  \_______| \_______|\__|\__/      \_______/ \__| \_______|\__| \______/  \____$$ |
                                                                                               $$\   $$ |
                                                                                               \$$$$$$  |
                                                                                                \_____*/



export class bcdModalDialog extends EventTarget {
    static cssClass = 'bcd-modal';
    static asString = 'BellCubic Modal';

    static obfuscator: HTMLDivElement;
    static modalsToShow: bcdModalDialog[] = [];
    static shownModal: bcdModalDialog|null = null;

    element_:HTMLDialogElement;
    closeByClickOutside:boolean;

    constructor(element:HTMLDialogElement) {
        super();

        this.element_ = element;

        // Move element to the root (so it shows above everything else)
        document.documentElement.getElementsByTagName('body')[0].prepend(element);

        if (!bcdModalDialog.obfuscator) {
            bcdModalDialog.obfuscator = document.createElement('div');
            bcdModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.OBFUSCATOR, 'bcd-modal-obfuscator');
            document.documentElement.getElementsByTagName('body')[0].appendChild(bcdModalDialog.obfuscator);
        }

        this.closeByClickOutside = !this.element_.hasAttribute('no-click-outside');

        setTimeout(function (this: bcdModalDialog) { // Lets the DOM settle and gives JavaScript a chance to modify the element

            const closeButtons = this.element_.getElementsByClassName('bcd-modal-close');
            for (const button of closeButtons) {
                button.addEventListener('click', this.boundHideFunction);
            }

            if (this.element_.hasAttribute('open-by-default')) this.show();
        }.bind(this), 1000);
    }

    static evalQueue(delay: number = 100):void {

        console.info("========================\nEvaluating modal queue...\n========================");

        const willExit = {
            shownModal: this.shownModal,
            modalsToShow: this.modalsToShow,

            shownModal_bool: !!this.modalsToShow.length,
            modalsToShow_lengthBool: !this.modalsToShow.length
        };
        console.log('Will exit?', !!(this.shownModal || !this.modalsToShow.length), willExit);

        if (this.shownModal || !this.modalsToShow.length) return;

        const modal = bcdModalDialog.modalsToShow.shift(); if (!modal) return this.evalQueue();
        bcdModalDialog.shownModal = modal;

        console.log("Showing modal:", modal);

        setTimeout(modal.show_forReal.bind(modal), delay);
    }

    show(){
        bcdModalDialog.modalsToShow.push(this);
        console.log("[BCD-MODAL] Modals to show (after assignment):", bcdModalDialog.modalsToShow);
        bcdModalDialog.evalQueue();
        console.log("[BCD-MODAL] Modals to show (after eval):", bcdModalDialog.modalsToShow);
    }

    /** Event sent just before the modal is shown
        If this event is canceled or `PreventDefault()` is called, the modal will not be shown.

        The event is first sent for the class and, if not canceled and if `PreventDefault()` was not called, the event is sent for the element.
    */
    static beforeShowEvent = new CustomEvent('beforeShow', {cancelable: true, bubbles: false, composed: false});

    /** Event sent just after the modal is shown

        The event is first sent for the class and, if not canceled and if PreventDefault() was not called, the event is sent for the element.
    */
    static afterShowEvent = new CustomEvent('afterShow', {cancelable: false, bubbles: false, composed: false});

    private show_forReal() {
        console.log("[BCD-MODAL] Showing modal:", this);
        /* 'Before' Event */ if (!this.dispatchEvent(bcdModalDialog.beforeShowEvent) || !this.element_.dispatchEvent(bcdModalDialog.beforeShowEvent)) return;

        bcdModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        bcdModalDialog.obfuscator.addEventListener('click', this.boundHideFunction);

        this.element_.show();
        console.log("[BCD-MODAL] Modal shown:", this);

        /* 'After' Event */  if (this.dispatchEvent(bcdModalDialog.afterShowEvent)) this.element_.dispatchEvent(bcdModalDialog.afterShowEvent);

        console.log("[BCD-MODAL] Modals to show (after show):", bcdModalDialog.modalsToShow);
    }

    /** Event sent just before the modal is hidden
        If this event is canceled or `PreventDefault()` is called, the modal will not be shown.

        The event is first sent for the class and, if not canceled and if `PreventDefault()` was not called, the event is sent for the element.
    */
    static beforeHideEvent = new CustomEvent('beforeHide', {cancelable: true, bubbles: false, composed: false});

    /** Event sent just after the modal is hidden

        The event is first sent for the class and, if not canceled and if PreventDefault() was not called, the event is sent for the element.
    */
    static afterHideEvent = new CustomEvent('afterHide', {cancelable: false, bubbles: false, composed: false});

    // Storing the bound function lets us remove the event listener from the obfuscator after the modal is hidden
    boundHideFunction = this.hide.bind(this);

    hide(evt?: Event){
        console.log("[BCD-MODAL] Hiding modal:", this);
        if (evt) evt.stopImmediatePropagation();
        /* 'Before' Event */ if (!this.dispatchEvent(bcdModalDialog.beforeHideEvent) ||!this.element_.dispatchEvent(bcdModalDialog.beforeHideEvent)) return;

        this.element_.close();

        bcdModalDialog.obfuscator.classList.remove(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        bcdModalDialog.obfuscator.removeEventListener('click', this.boundHideFunction);

        bcdModalDialog.shownModal = null;

        /* 'After' Event */  if (this.dispatchEvent(bcdModalDialog.afterHideEvent)) this.element_.dispatchEvent(bcdModalDialog.afterHideEvent);

        bcdModalDialog.evalQueue();
    }

}
bcdComponents.push(bcdModalDialog);


/*$$$$$\                                      $$\
$$  __$$\                                     $$ |
$$ |  $$ | $$$$$$\   $$$$$$\   $$$$$$\   $$$$$$$ | $$$$$$\  $$\  $$\  $$\ $$$$$$$\
$$ |  $$ |$$  __$$\ $$  __$$\ $$  __$$\ $$  __$$ |$$  __$$\ $$ | $$ | $$ |$$  __$$\
$$ |  $$ |$$ |  \__|$$ /  $$ |$$ /  $$ |$$ /  $$ |$$ /  $$ |$$ | $$ | $$ |$$ |  $$ |
$$ |  $$ |$$ |      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ | $$ | $$ |$$ |  $$ |
$$$$$$$  |$$ |      \$$$$$$  |$$$$$$$  |\$$$$$$$ |\$$$$$$  |\$$$$$\$$$$  |$$ |  $$ |
\_______/ \__|       \______/ $$  ____/  \_______| \______/  \_____\____/ \__|  \__|
                              $$ |
                              $$ |
                              \_*/



export enum menuCorners {
    unaligned = 'mdl-menu--unaligned',
    topLeft = 'mdl-menu--bottom-left',
    topRight = 'mdl-menu--bottom-right',
    bottomLeft = 'mdl-menu--top-left',
    bottomRight = 'mdl-menu--top-right'
}

type optionObj = objOf<Function|null>

export class bcdDropdown extends mdl.MaterialMenu {

    options(): void | optionObj {return;}

    doReorder:boolean;

    options_: optionObj;
    options_keys: string[];

    unselectedOptions: string[] = [];
    selectedOption: string = '';

    element_: HTMLElement;

    selectionElements: undefined | HTMLCollectionOf<HTMLElement>;

    constructor(element: Element, doReorder: boolean = true) {
        super(element);
        this.element_ = element as HTMLElement;
        this.doReorder = doReorder;

        const tempOptions = this.options();
        if (!tempOptions) throw new TypeError('A BellCubic Dropdown cannot be created directly. It must be created through a subclass extending the `options` method past `void`.');
        this.options_ = tempOptions;
        this.options_keys = Object.keys(this.options_);

        this.unselectedOptions = this.doReorder ? this.options_keys.slice(1) : this.options_keys;
        this.selectedOption = this.options_keys[0];

        for (const option of this.options_keys) {
            this.element_.appendChild(this.createOption(option));
        }

        this.selectionElements = this.forElement_?.getElementsByClassName('bcd-dropdown_value') as HTMLCollectionOf<HTMLElement>;

        this.updateOptions();
    }

    updateOptions() {
        const children: HTMLLIElement[] = [...(this.element_ as HTMLElement).getElementsByTagName('li') ];
        //console.log('Updating options:', children);

        if (this.doReorder) {
            const goldenChild = children.find((elm) => (elm as HTMLLIElement).innerText === this.selectedOption);
            if (!goldenChild) throw new Error('Could not find the selected option in the dropdown.');

            this.makeSelected(goldenChild);
        }

        const demonChildren = this.doReorder ? children.filter((elm) => (elm as HTMLLIElement).innerText !== this.selectedOption) : children;
        demonChildren.sort( (a, b) => this.options_keys.indexOf(a.innerText) - this.options_keys.indexOf(b.innerText) );

        for (const child of demonChildren) {
            this.element_.removeChild(child);
            this.makeNotSelected(child);
            this.element_.appendChild(child);
        }
    }

    createOption(option: string, clickCallback?: Function|null, addToList: boolean = false): HTMLLIElement {
        const li = document.createElement('li');
        li.innerText = option;
        li.classList.add('mdl-menu__item');
        this.registerItem(li);

        const temp_clickCallback = clickCallback ?? this.options_[option] ?? null;

        if (addToList) {
            this.element_.appendChild(li);
            this.options_keys.push(option);
            this.options_[option] = temp_clickCallback;
        }

        li.addEventListener('click', temp_clickCallback?.bind(this));

        this.onCreateOption(option);
        return li;
    }

    onItemSelected(option: HTMLLIElement) {
        this.selectedOption = option.innerText;
        this.updateOptions();
    }

    onCreateOption(option: string): void {return;}

    makeSelected(option: HTMLLIElement) {
        if (this.doReorder) option.classList.add('mdl-menu__item--full-bleed-divider');

        for (const elm of this.selectionElements ?? []) {
            elm.innerText = option.innerText;
        }
    }

    makeNotSelected(option: HTMLLIElement) {
        //console.debug('makeNotSelected - starting on:', option);
        option.classList.remove('mdl-menu__item--full-bleed-divider');
        //console.debug('makeNotSelected: - finished on:', option);
    }
}
/*


$$$$$$$\                                      $$\
$$  __$$\                                     $$ |
$$ |  $$ | $$$$$$\   $$$$$$\   $$$$$$\   $$$$$$$ | $$$$$$\  $$\  $$\  $$\ $$$$$$$\
$$ |  $$ |$$  __$$\ $$  __$$\ $$  __$$\ $$  __$$ |$$  __$$\ $$ | $$ | $$ |$$  __$$\
$$ |  $$ |$$ |  \__|$$ /  $$ |$$ /  $$ |$$ /  $$ |$$ /  $$ |$$ | $$ | $$ |$$ |  $$ |
$$ |  $$ |$$ |      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ | $$ | $$ |$$ |  $$ |
$$$$$$$  |$$ |      \$$$$$$  |$$$$$$$  |\$$$$$$$ |\$$$$$$  |\$$$$$\$$$$  |$$ |  $$ |
\_______/ \__|       \______/ $$  ____/  \_______| \______/  \_____\____/ \__|  \__|
                              $$ |
                              $$ |
                              \__|

$$\    $$\                     $$\                       $$\
$$ |   $$ |                    \__|                      $$ |
$$ |   $$ | $$$$$$\   $$$$$$\  $$\  $$$$$$\  $$$$$$$\  $$$$$$\    $$$$$$$\
\$$\  $$  | \____$$\ $$  __$$\ $$ | \____$$\ $$  __$$\ \_$$  _|  $$  _____|
 \$$\$$  /  $$$$$$$ |$$ |  \__|$$ | $$$$$$$ |$$ |  $$ |  $$ |    \$$$$$$\
  \$$$  /  $$  __$$ |$$ |      $$ |$$  __$$ |$$ |  $$ |  $$ |$$\  \____$$\
   \$  /   \$$$$$$$ |$$ |      $$ |\$$$$$$$ |$$ |  $$ |  \$$$$  |$$$$$$$  |
    \_/     \_______|\__|      \__| \_______|\__|  \__|   \____/ \______*/



export class bcdDropdown_AwesomeButton extends bcdDropdown {
    static asString = 'BCD - Debugger\'s All-Powerful Button';
    static cssClass = 'bcd-debuggers-all-powerful-button';

    constructor(element: Element) {
        super(element, false);
    }

    options(): objOf<Function|null> {
        return {
            'View Debug Page': () => {document.getElementById('debug-link')?.click();}
        };
    }
}
bcdComponents.push(bcdDropdown_AwesomeButton);
/*



$$$$$$$$\           $$\                        $$$$$$\    $$\                $$$$$$\   $$$$$$\
\__$$  __|          $$ |                      $$  __$$\   $$ |              $$  __$$\ $$  __$$\
   $$ |    $$$$$$\  $$$$$$$\   $$$$$$$\       $$ /  \__|$$$$$$\   $$\   $$\ $$ /  \__|$$ /  \__|
   $$ |    \____$$\ $$  __$$\ $$  _____|      \$$$$$$\  \_$$  _|  $$ |  $$ |$$$$\     $$$$\
   $$ |    $$$$$$$ |$$ |  $$ |\$$$$$$\         \____$$\   $$ |    $$ |  $$ |$$  _|    $$  _|
   $$ |   $$  __$$ |$$ |  $$ | \____$$\       $$\   $$ |  $$ |$$\ $$ |  $$ |$$ |      $$ |
   $$ |   \$$$$$$$ |$$$$$$$  |$$$$$$$  |      \$$$$$$  |  \$$$$  |\$$$$$$  |$$ |      $$ |
   \__|    \_______|\_______/ \_______/        \______/    \____/  \______/ \__|      \__|



*/
export class bcdTabButton extends mdl.MaterialButton {
    static asString = 'BCD - Tab List Button';
    static cssClass = 'tab-list-button';

    element_: HTMLButtonElement;
    boundTab:HTMLDivElement;
    name:string = '';

    constructor(element: HTMLButtonElement) {
        if (element.tagName !== 'BUTTON') throw new TypeError('A BellCubic Tab Button must be created directly from a <button> element.');

        const name = element.getAttribute('name');
        if (!name) throw new TypeError('A BellCubic Tab Button must have a name attribute.');

        const boundTab = document.querySelector(`div.tab-content[name="${name}"]`) as HTMLDivElement;
        if (!boundTab) throw new TypeError(`Could not find a tab with the name "${name}".`);
        if (!boundTab.parentElement) throw new TypeError(`Tab with name "${name}" has no parent element!`);

        element.innerText = name;
        element.setAttribute('type', 'button');

        super(element); // Now we can use `this`!
        this.element_ = element;

        this.boundTab = boundTab;
        this.name = name;

        if (this.findTabNumber() === 0) this.makeSelected(0);

        this.element_.addEventListener('click', this.onClick.bind(this));
        this.element_.addEventListener('keypress', this.onKeyPress.bind(this));
    }

    /** @returns the index of this tab (0-based) or -1 if not found */
    findTabNumber(button_?: Element): number {
        const button = button_ ?? this.element_;
        return [...(button.parentElement?.children ?? [])].indexOf(button);
    }

    makeSelected(tabNumber_?: number) {
        const tabNumber = tabNumber_ ?? this.findTabNumber();
        if (tabNumber === -1) throw new Error('Could not find the tab number.');

        const siblingsAndSelf = [...(this.element_.parentElement?.children ?? [])];
        if (siblingsAndSelf[tabNumber].classList.contains('active')) return;

        for (const sibling of siblingsAndSelf) {
            if (sibling === this.element_) {
                sibling.classList.add('active');
                sibling.setAttribute('aria-selected', 'true');
            }
            else {
                sibling.classList.remove('active');
                sibling.setAttribute('aria-selected', 'false');
            }
        }

        if (!this.boundTab.parentElement) return; // I would worry about race conditions, but JavaScript executes synchronous code one function at a time

        const tab_siblingsAndTab = [...this.boundTab.parentElement.children];
        for (const tab of tab_siblingsAndTab) {
            if (tab === this.boundTab) {
                tab.classList.add('active');
                tab.setAttribute('aria-hidden', 'false');

                // TypeScript doesn't get that we wouldn't be iterating if parentElement were undefined, so a non-null assertion is necessary
                this.boundTab.parentElement.style.marginLeft = `-${tabNumber}00vw`;
            }
            else {
                tab.classList.remove('active');
                tab.setAttribute('aria-hidden', 'true');
            }
        }
    }

    onClick(event?: MouseEvent): void {
        this.makeSelected();
        this.element_.blur();
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            this.onClick();
        }
    }
}
bcdComponents.push(bcdTabButton);



/*$$$$$\                                                                              $$\
$$  __$$\                                                                             $$ |
$$ /  \__| $$$$$$\  $$$$$$\$$$$\   $$$$$$\   $$$$$$\  $$$$$$$\   $$$$$$\  $$$$$$$\  $$$$$$\
$$ |      $$  __$$\ $$  _$$  _$$\ $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\ \_$$  _|
$$ |      $$ /  $$ |$$ / $$ / $$ |$$ /  $$ |$$ /  $$ |$$ |  $$ |$$$$$$$$ |$$ |  $$ |  $$ |
$$ |  $$\ $$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$   ____|$$ |  $$ |  $$ |$$\
\$$$$$$  |\$$$$$$  |$$ | $$ | $$ |$$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$\ $$ |  $$ |  \$$$$  |
 \______/  \______/ \__| \__| \__|$$  ____/  \______/ \__|  \__| \_______|\__|  \__|   \____/
                                  $$ |
                                  $$ |
                                  \__|

$$$$$$$\                      $$\             $$\                           $$\     $$\
$$  __$$\                     \__|            $$ |                          $$ |    \__|
$$ |  $$ | $$$$$$\   $$$$$$\  $$\  $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$\  $$$$$$\   $$\  $$$$$$\  $$$$$$$\
$$$$$$$  |$$  __$$\ $$  __$$\ $$ |$$  _____|\_$$  _|  $$  __$$\  \____$$\ \_$$  _|  $$ |$$  __$$\ $$  __$$\
$$  __$$< $$$$$$$$ |$$ /  $$ |$$ |\$$$$$$\    $$ |    $$ |  \__| $$$$$$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |
$$ |  $$ |$$   ____|$$ |  $$ |$$ | \____$$\   $$ |$$\ $$ |      $$  __$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ |
$$ |  $$ |\$$$$$$$\ \$$$$$$$ |$$ |$$$$$$$  |  \$$$$  |$$ |      \$$$$$$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |
\__|  \__| \_______| \____$$ |\__|\_______/    \____/ \__|       \_______|   \____/ \__| \______/ \__|  \__|
                    $$\   $$ |
                    \$$$$$$  |
                     \_____*/



export function registerBCDComponent(component:BCDComponent):void {
    try{
        mdl.componentHandler.register({
            constructor: component,
            classAsString: component.asString,
            cssClass: component.cssClass,
            widget: false
        });
        mdl.componentHandler.upgradeElements(document.getElementsByClassName(component.cssClass));
    }catch(e:unknown){
        console.error("[BCD-Components] Error registering component", component.asString, "with class", component.cssClass, ":\n", e);
    }
}


function registerComponents():void{
    console.debug("[BCD-Components] Registering components...");

    // Tell mdl about our shiny new components

    for (const component of bcdComponents) {
        registerBCDComponent(component);
    }
    console.debug("[BCD-Components] Registered components:", bcdComponents);
}
/*



$$$$$$$\   $$$$$$\  $$\      $$\         $$$$$$$\                            $$\
$$  __$$\ $$  __$$\ $$$\    $$$ |        $$  __$$\                           $$ |
$$ |  $$ |$$ /  $$ |$$$$\  $$$$ |        $$ |  $$ | $$$$$$\   $$$$$$\   $$$$$$$ |$$\   $$\
$$ |  $$ |$$ |  $$ |$$\$$\$$ $$ |$$$$$$\ $$$$$$$  |$$  __$$\  \____$$\ $$  __$$ |$$ |  $$ |
$$ |  $$ |$$ |  $$ |$$ \$$$  $$ |\______|$$  __$$< $$$$$$$$ | $$$$$$$ |$$ /  $$ |$$ |  $$ |
$$ |  $$ |$$ |  $$ |$$ |\$  /$$ |        $$ |  $$ |$$   ____|$$  __$$ |$$ |  $$ |$$ |  $$ |
$$$$$$$  | $$$$$$  |$$ | \_/ $$ |        $$ |  $$ |\$$$$$$$\ \$$$$$$$ |\$$$$$$$ |\$$$$$$$ |
\_______/  \______/ \__|     \__|        \__|  \__| \_______| \_______| \_______| \____$$ |
                                                                                 $$\   $$ |
                                                                                 \$$$$$$  |
                                                                                  \______/
$$$$$$\           $$\   $$\     $$\           $$\ $$\                       $$\     $$\
\_$$  _|          \__|  $$ |    \__|          $$ |\__|                      $$ |    \__|
  $$ |  $$$$$$$\  $$\ $$$$$$\   $$\  $$$$$$\  $$ |$$\ $$$$$$$$\  $$$$$$\  $$$$$$\   $$\  $$$$$$\  $$$$$$$\
  $$ |  $$  __$$\ $$ |\_$$  _|  $$ | \____$$\ $$ |$$ |\____$$  | \____$$\ \_$$  _|  $$ |$$  __$$\ $$  __$$\
  $$ |  $$ |  $$ |$$ |  $$ |    $$ | $$$$$$$ |$$ |$$ |  $$$$ _/  $$$$$$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |
  $$ |  $$ |  $$ |$$ |  $$ |$$\ $$ |$$  __$$ |$$ |$$ | $$  _/   $$  __$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ |
$$$$$$\ $$ |  $$ |$$ |  \$$$$  |$$ |\$$$$$$$ |$$ |$$ |$$$$$$$$\ \$$$$$$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |
\______|\__|  \__|\__|   \____/ \__| \_______|\__|\__|\________| \_______|   \____/ \__| \______/ \__|  \__|



*/
export function bcd_universalJS_init():void {

    // Register all the things!
    registerComponents();

    // =============================================================
    // Random text time!
    // =============================================================

    const randomTextField = document.getElementById("randomized-text-field");
    if (!randomTextField) return;

    const toSetText = quotes.possibilities_conditionalized[randomNumber(0, quotes.possibilities_conditionalized.length - 1)];
    /*console.log(`[BCD-RANDOM-TEXT] Text to set: ${JSON.stringify(toSetText)}`);*/

    // Check condition
    if (quotes.checkCondition(toSetText[0])) {
        randomTextField.innerHTML = toSetText[1];
        /*console.log(`[BCD-RANDOM-TEXT] Condition passed. Using conditionalized text.`);*/
    } else {
        randomTextField.innerHTML = quotes.possibilities_Generic[randomNumber(0, quotes.possibilities_Generic.length - 1)];
        /*console.log(`[BCD-RANDOM-TEXT] Condition failed. Using generic text.`);*/
    }
}
window.bcd_init_functions.universal = bcd_universalJS_init;
