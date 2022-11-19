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


/** Rearranged and better-typed parameters for `setTimeout` */
export function afterDelay<TCallback extends (...args: any) => any = any>(timeout: number, callback: TCallback|string, ...args: Parameters<TCallback>):void {
    // @ts-ignore: the `Parameters` utility type returns a tuple, which inherently has an iterator function--regardless of what TypeScript thinks
    window.setTimeout(callback, timeout, ...(args || []));
}

// ================================
// ======== TYPE UTILITIES ========
// ================================

/** Convenience type to quickly create an indexed Object with the specified type */
export type objOf<T> = {[key:string]: T};


// ==================================
// ======== STRING UTILITIES ========
// ==================================

/** Removes whitespace at the beginning and end of a string and at the end of every included line*/
export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Removes whitespace at the beginning and end of a string and at the end of every included line*/
export function trimWhitespace(str: string, trailingNewline = false): string {
    return  str.trimStart()                     // Trim whitespace at the start of the string
                .trimEnd()                      // Trim whitespace at the end of the string
                .replace(/[^\S\n]*$/gm, '')     // Trim whitespace at the end of each line
                + (trailingNewline ? '\n' : '') // Add a trailing newline if requested
;}

// ================================
// ======= EVENT  UTILITIES =======
// ================================

export function preventPropagation(event: Event): void {
    event.stopPropagation();
}

// =================================
// ======== ARRAY UTILITIES ========
// =================================

/** Sorts the items in one array to match those in another. Items not included in the reference array are placed at the end of the result.
    @param arr Array of items to sort
    @param refArr Array to pull the order from
*/
export function sortArr<TUnknown>(arr: TUnknown[], refArr: TUnknown[]) {
    arr.sort(function(a, b){
        return refArr.indexOf(a) - refArr.indexOf(b);
    });
}

// ==================================
// ======== NUMBER UTILITIES ========
// ==================================

/** Returns a random integer between min (inclusive) and max (inclusive) with precision up to the specified number of decimal places
    @param min The minimum value that this function should return
    @param max The maximum value that this function should return
    @param places The number of decimal places the returned number should include
*/
export function randomNumber(min = 0, max = 1, places = 0):number{
    const placesMult = Math.pow(10, places);
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

/** Forces an HTMLElement to be focusable by the user and then focuses it
    @param element The element to focus
    @param preventScrolling Whether or not to prevent the page from scrolling to the element. Defaults to true.
*/
export function focusAnyElement(element:HTMLElement|undefined, preventScrolling: boolean = true):void{
    if (!element || !element.focus) return;

    const hadTabIndex = element.hasAttribute('tabindex');
    if (!hadTabIndex) element.setAttribute('tabindex', '-8311');

    element.focus({preventScroll: preventScrolling});

    // Wrap inside two requestAnimationFrame calls to ensure the browser could focus the element before removing the tabindex attribute.
    requestAnimationFrame(() => {requestAnimationFrame(() => {
        if (!hadTabIndex) element.removeAttribute('tabindex');
    });});
}

export function copyCode(elem: HTMLElement): void {
    if (!elem) throw new Error("No element provided to copyCode with!");

    console.debug("copyCode", elem);

    // Get code
    const codeElem = elem.parentElement?.querySelector('code');
    if (!codeElem) throw new Error("No code element found to copy from!");

    // Write code to clipboard (after trimming the whitespace)
    navigator.clipboard.writeText(trimWhitespace(codeElem.textContent ?? '', true));

    // Select text (UX stunt)
    const selection = window.getSelection()!;
    const tempRange = new Range();
    tempRange.selectNode(codeElem);
    selection.removeAllRanges(); selection.addRange(tempRange);
}
window.copyCode = copyCode;

export function getInputValue(input: HTMLInputElement): string {
    return input.value || input.getAttribute('bcdPlaceholder') || input.placeholder || '';
}




/*$$$$$\                      $$\                 $$$$$$\           $$\   $$\
$$ ___$$\                     \__|                \_$$  _|          \__|  $$ |
$$/   $$ | $$$$$$\   $$$$$$$\ $$\  $$$$$$$\         $$ |  $$$$$$$\  $$\ $$$$$$\
$$$$$$$\ | \____$$\ $$  _____|$$ |$$  _____|        $$ |  $$  __$$\ $$ |\_$$  _|
$$  __$$\  $$$$$$$ |\$$$$$$\  $$ |$$ /              $$ |  $$ |  $$ |$$ |  $$ |
$$ |  $$ |$$  __$$ | \____$$\ $$ |$$ |              $$ |  $$ |  $$ |$$ |  $$ |$$\
$$$$$$$  |\$$$$$$$ |$$$$$$$  |$$ |\$$$$$$$\       $$$$$$\ $$ |  $$ |$$ |  \$$$$  |
 \______/  \_______|\_______/ \__| \_______|      \______|\__|  \__|\__|   \___*/

interface getOrCreateChild {
    /** Returns the first element with the specified tag name or creates one if it does not exist */
    getOrCreateChild<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
    getOrCreateChild(tagName: string):Element;
}

declare global {
    interface Element extends getOrCreateChild {}
    interface Document extends getOrCreateChild {}

    interface Window {
        /** Variables set by the page */
        //bcdPageVars: Partial<{}>

        /** Browser-Supported Click Event */
        clickEvt: 'click'|'mousedown'

        /** The MDL layout element */
        layout: mdl.MaterialLayout

        /** A list of Query Parameters from the URI */
        queryParams: objOf<string>;

        /** A list of functions used when loading scripts */
        bcd_init_functions: objOf<Function>;

        /** A special class used to track components across multiple module scripts */
        bcd_ComponentTracker: bcd_ComponentTracker;

        copyCode(elem: HTMLElement): void;

        lazyStylesLoaded: true|undefined;
    }
}

function ___getOrCreateChild(this:Document|Element, tagName: string) {
    let child = this.getElementsByTagName(tagName)[0];

    if (!child) {
        child = document.createElement(tagName);
        this.appendChild(child);
    }

    return child;
}
Element.prototype.getOrCreateChild = ___getOrCreateChild;
Document.prototype.getOrCreateChild = ___getOrCreateChild;

/** Quick-and-dirty enum of strings used often throughout the code */
enum strs {
    transitionDur = "transition-duration",
    animDur = "animation-duration",
    marginTop = "margin-top",
    classIsOpen = "is-open",
    classAdjacent = "adjacent",
    classDetailsInner = "js-bcd-details-inner",
    errItem = "Error Item:"
}

window.queryParams = {};

if (window.location.search[0] === '?')
    window.location.search.substring(1).split('&')
                            .map(param => param.split('='))
                            .forEach(param => window.queryParams[param[0]!.trim()] = param[1]?.trim() ?? '');



/** Interface defining the readonly properties cssClass and asString to make identifying MDL Classes set up for my custom, painless registration functions a breeze */
interface BCDComponent extends Function {
    readonly asString:string;
    readonly cssClass:string;
}

/** Variable to store components that we'll be registering on DOM initialization */
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



/** A single item listed in the Component Tracker */
export interface componentTrackingItem<TConstructor> {
    obj:objOf<TConstructor>,
    arr:TConstructor[]
}


export interface trackableConstructor<TClass> extends Function {
    asString: string;
    new(...args:any[]):TClass;
}

/** Wrapped in a class to get around the complexities of exporting. */
export class bcd_ComponentTracker {
    static registered_components:objOf<componentTrackingItem<unknown>> = {};


    static registerComponent<TClass>(component:TClass, constructor: trackableConstructor<TClass>, element:HTMLElement):void{
        bcd_ComponentTracker.createTrackedComponent(constructor);

        if (element.id !== '')
            bcd_ComponentTracker.registered_components[constructor.asString]!.obj[element.id] = component;
        else
            bcd_ComponentTracker.registered_components[constructor.asString]!.arr.push(component);
    }

    static createTrackedComponent(constructor:trackableConstructor<any>){
        if (typeof bcd_ComponentTracker.registered_components[constructor.asString] === 'undefined')
            bcd_ComponentTracker.registered_components[constructor.asString] = {obj: {}, arr: []};
    }

    static getTrackedConstructor<TConstructor>(constructor:trackableConstructor<TConstructor>):componentTrackingItem<TConstructor>{
        bcd_ComponentTracker.createTrackedComponent(constructor);
        return bcd_ComponentTracker.registered_components[constructor.asString] as componentTrackingItem<TConstructor>;
    }


    static findItem<TConstructor>(constructor: trackableConstructor<TConstructor>, element:HTMLElement, findPredicate?: (arg0:TConstructor) => boolean): TConstructor|undefined {
        if (element.id)
            return bcd_ComponentTracker.registered_components[constructor.asString]!.obj[element.id] as TConstructor;
        else if (findPredicate)
            return bcd_ComponentTracker.getTrackedConstructor(constructor).arr.find(findPredicate);
        else
            return undefined;
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



abstract class bcd_collapsibleParent {
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
        if (this.isOpen()) { this.close(doSetDuration); } else { this.open(doSetDuration); }
    }

    /** Re-evaluate the collapsible's current state. */
    reEval(doSetDuration?:false):void
    reEval(doSetDuration?:true, instant?:true):void
    reEval(doSetDuration:boolean = true, instant?:true):void {
            requestAnimationFrame(() => {
                if (this.isOpen()) this.open(doSetDuration, instant);
                else this.close(doSetDuration, instant);

                this.onTransitionEnd();
            }
        );
    }

    /** Open the collapsible menu. */
    open(doSetDuration:boolean = true, instant = false) {//this.debugCheck();

        if (instant) this.instantTransition();
        else if (doSetDuration) this.evaluateDuration(doSetDuration);

        this.details_inner.setAttribute('disabled', 'true');
        this.details_inner.ariaHidden = 'false';
        this.details_inner.style.visibility = 'none';


        this.details.classList.add(strs.classIsOpen);
        this.summary.classList.add(strs.classIsOpen);

        requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=> {

            this.details_inner.style.marginTop = this.details.getAttribute('data-margin-top') || '0';

            if (instant) requestAnimationFrame(()=>requestAnimationFrame(()=>
                this.evaluateDuration.bind(this, doSetDuration, true)
            ));

        }))));
    }

    /** Close the collapsible menu. */
    close(doSetDuration:boolean = true, instant = false) {//this.debugCheck();

        if (instant) this.instantTransition();
        else if (doSetDuration) this.evaluateDuration(doSetDuration, false);

        this.details_inner.style.marginTop = `-${this.details_inner.offsetHeight + 32}px`;

        this.details.classList.remove(strs.classIsOpen);
        this.summary.classList.remove(strs.classIsOpen);

        if (instant) requestAnimationFrame(()=>requestAnimationFrame(() => {
            this.evaluateDuration(doSetDuration, false);
        }));
    }

    onTransitionEnd(event?:TransitionEvent):void {
        if (event && event.propertyName !== 'margin-top') return;

        if (this.isOpen()) {
            this.details_inner.setAttribute('disabled', 'false');
            return;
        }

        requestAnimationFrame(() => {
            this.details_inner.setAttribute('disabled', 'true');
            this.details_inner.ariaHidden = 'true';
            this.details_inner.style.visibility = 'none';
        });
    }

    instantTransition():void {
        if (this.details_inner) {
            this.details_inner.style.transitionDuration = `0s`;
            this.details_inner.style.animationDuration = `0s`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.animationDuration = `0s`;
            }
        }
        this.onTransitionEnd();
    }

    /* Determines what the transition and animation duration of the collapsible menu is */
    evaluateDuration(doRun:boolean = true, opening:boolean=true) {//this.debugCheck();
        if (doRun && this.details_inner) {
            const contentHeight = this.details_inner.offsetHeight;
            this.details_inner.style.transitionDuration = `${(opening ? 250 : 500) + ((opening ? 0.2 : 0.5) * (contentHeight + 32))}ms`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.transitionDuration = `${ 250 + (0.15 * (contentHeight + 32)) }ms`;
            }
        }
    }
}

export class BellCubicDetails extends bcd_collapsibleParent {
    static readonly cssClass = "js-bcd-details";
    static readonly asString = "BellCubicDetails";

    /** @param {HTMLElement} element */
    constructor(element:HTMLElement) {
        super(element);
        this.details = element;

        // Create a container element to make animation go brrr
        // Slightly over-complicated because, uh, DOM didn't want to cooperate.
        this.details_inner = document.createElement('div');
        this.details_inner.classList.add(strs.classDetailsInner);

        // The `children` HTMLCollection is live, so we're fetching each element and throwing it into an array...
        const temp_childrenArr:ChildNode[] = [];
        for (const node of this.details.childNodes){
            temp_childrenArr.push(node);
        }
        // ...and actually moving the elements into the new div here.
        for (const node of temp_childrenArr){
            this.details_inner.appendChild(node);
        }

        this.details.appendChild(this.details_inner);

        if (this.adjacent) {
            const temp_summary = this.self.previousElementSibling;
            if (!temp_summary || !temp_summary.classList.contains(BellCubicSummary.cssClass)) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-DETAILS] Error: Adjacent Details element must be preceded by a Summary element.");}
            this.summary = temp_summary as HTMLElement;
        } else {
            const temp_summary = this.self.ownerDocument.querySelector(`.js-bcd-summary[for="${this.details.id}"`);
            if (!temp_summary) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-DETAILS] Error: Non-adjacent Details elements must have a Summary element with a `for` attribute matching the Details element's id.");}
            this.summary = temp_summary as HTMLElement;
        }
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');
        new ResizeObserver(this.reEvalOnSizeChange.bind(this)).observe(this.details_inner);

        this.details_inner.addEventListener('transitionend', this.onTransitionEnd.bind(this));

        bcd_ComponentTracker.registerComponent(this, BellCubicDetails, this.details);
        this.reEval(true, true);
        this.self.classList.add('initialized');
    }

    reEvalOnSizeChange(event: unknown) {
        this.reEval(true, true);
    }
}
bcdComponents.push(BellCubicDetails);

export class BellCubicSummary extends bcd_collapsibleParent {
    static readonly cssClass = 'js-bcd-summary';
    static readonly asString = 'BellCubicSummary';

    constructor(element:HTMLElement) {
        super(element);
        this.summary = element;
        this.summary.addEventListener(window.clickEvt, this.handleClick.bind(this));
        this.summary.addEventListener('keypress', this.handleKey.bind(this));
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');

        if (this.adjacent) {
            const temp_details = this.self.nextElementSibling;
            if (!(temp_details && temp_details.classList.contains(BellCubicDetails.cssClass))) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Adjacent Summary element must be proceeded by a Details element.");}
            this.details = temp_details as HTMLElement;
        } else {
            const temp_details = this.self.ownerDocument.getElementById(this.summary.getAttribute('for') ?? '');
            if (!temp_details) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Non-adjacent Details elements must have a summary element with a `for` attribute matching the Details element's id.");}
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
        console.log(event);

        // @ts-expect-error: Property 'path' and 'pointerType' DO exist on type 'MouseEvent', but not in Firefox or presumably Safari
        if (!event || (('pointerType' in event) && !event.pointerType) || (event.path && event.path?.slice(0, 5).map((el:HTMLElement) => el.tagName === 'A').includes(true))) return;

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

/** Simple MDL Class to handle making JSON pretty again
    Takes the innerText of the element and parses it as JSON, then re-serializes it with 2 spaces per indent.
*/
export class bcd_prettyJSON {
    static readonly cssClass = 'js-bcd-prettyJSON';
    static readonly asString = 'bcd_prettyJSON';
    element_:HTMLElement;
    constructor(element:HTMLElement) {
        this.element_ = element;

        const raw_json = element.innerText;
        const json = JSON.parse(raw_json);

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
    static readonly cssClass = 'js-bcd-modal';
    static readonly asString = 'BellCubic Modal';

    static obfuscator: HTMLDivElement;
    static modalsToShow: bcdModalDialog[] = [];
    static shownModal: bcdModalDialog|null = null;

    element_:HTMLDialogElement;
    closeByClickOutside:boolean;

    constructor(element:HTMLDialogElement) {
        super();

        this.element_ = element;

        const body = document.documentElement.getElementsByTagName('body')[0] ?? document.body;

        // Move element to the root (so it shows above everything else)
        body.prepend(element);

        if (!bcdModalDialog.obfuscator) {
            bcdModalDialog.obfuscator = document.createElement('div');
            bcdModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.OBFUSCATOR, 'js-bcd-modal-obfuscator');
            body.appendChild(bcdModalDialog.obfuscator);
        }

        this.closeByClickOutside = !this.element_.hasAttribute('no-click-outside');

        afterDelay(1000, function (this: bcdModalDialog) { // Lets the DOM settle and gives JavaScript a chance to modify the element

            const closeButtons = this.element_.getElementsByClassName('js-bcd-modal-close');
            for (const button of closeButtons) {
                button.addEventListener(window.clickEvt, this.boundHideFunction);
            }

            if (this.element_.hasAttribute('open-by-default')) this.show();
        }.bind(this));
    }

    static evalQueue(delay: number = 100):void {

        console.debug("========================\nEvaluating modal queue...\n========================");

        const willExit = {
            shownModal: this.shownModal,
            modalsToShow: this.modalsToShow,

            shownModal_bool: !!this.modalsToShow.length,
            modalsToShow_lengthBool: !this.modalsToShow.length
        };
        console.debug('Will exit?', !!(this.shownModal || !this.modalsToShow.length), willExit);

        if (this.shownModal || !this.modalsToShow.length) return;

        const modal = bcdModalDialog.modalsToShow.shift(); if (!modal) return this.evalQueue();
        bcdModalDialog.shownModal = modal;

        console.debug("Showing modal:", modal);

        afterDelay(delay, modal.show_forReal.bind(modal));
    }

    show(){
        bcdModalDialog.modalsToShow.push(this);
        console.debug("[BCD-MODAL] Modals to show (after assignment):", bcdModalDialog.modalsToShow);
        bcdModalDialog.evalQueue();
        console.debug("[BCD-MODAL] Modals to show (after eval):", bcdModalDialog.modalsToShow);
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
        console.debug("[BCD-MODAL] Showing modal:", this);
        /* 'Before' Event */ if (!this.dispatchEvent(bcdModalDialog.beforeShowEvent) || !this.element_.dispatchEvent(bcdModalDialog.beforeShowEvent)) return;

        bcdModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        bcdModalDialog.obfuscator.addEventListener(window.clickEvt, this.boundHideFunction);

        this.element_.show();
        console.debug("[BCD-MODAL] Modal shown:", this);

        /* 'After' Event */  if (this.dispatchEvent(bcdModalDialog.afterShowEvent)) this.element_.dispatchEvent(bcdModalDialog.afterShowEvent);

        console.debug("[BCD-MODAL] Modals to show (after show):", bcdModalDialog.modalsToShow);
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
        console.debug("[BCD-MODAL] Hiding modal:", this);
        if (evt) evt.stopImmediatePropagation();
        /* 'Before' Event */ if (!this.dispatchEvent(bcdModalDialog.beforeHideEvent) ||!this.element_.dispatchEvent(bcdModalDialog.beforeHideEvent)) return;

        this.element_.close();

        bcdModalDialog.obfuscator.classList.remove(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        bcdModalDialog.obfuscator.removeEventListener(window.clickEvt, this.boundHideFunction);

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

export abstract class bcdDropdown extends mdl.MaterialMenu {

    abstract options(): optionObj;

    doReorder:boolean;

    options_: optionObj;
    options_keys: string[];

    unselectedOptions: string[] = [];
    selectedOption: string = '';

    override element_: HTMLElement;

    selectionTextElements: undefined | HTMLCollectionOf<HTMLElement>;

    constructor(element: Element, buttonElement?: Element, doReorder: boolean = true) {
        super(element);

        this.element_ = element as HTMLElement;

        this.doReorder = doReorder;
        if (doReorder) this.Constant_.CLOSE_TIMEOUT = 0;

        if (this.forElement_) {
            this.forElement_?.removeEventListener(window.clickEvt, this.boundForClick_);
            this.forElement_?.removeEventListener('keydown', this.boundForKeydown_);
        }

        if (buttonElement && buttonElement !== this.forElement_) {
            this.forElement_ = buttonElement as HTMLElement;
        }


        if (this.forElement_) {
            this.forElement_.setAttribute('aria-haspopup', 'true');

            this.forElement_.addEventListener(window.clickEvt, this.boundForClick_);
            this.forElement_.addEventListener('keydown', this.boundForKeydown_);
        }

        console.log("[BCD-DROPDOWN] Initializing dropdown:", this);

        const tempOptions = this.options();
        this.options_ = tempOptions;
        this.options_keys = Object.keys(this.options_);

        this.unselectedOptions = this.doReorder ? this.options_keys.slice(1) : this.options_keys;
        this.selectedOption = this.options_keys[0] ?? '';

        for (const option of this.options_keys) {
            this.element_.appendChild(this.createOption(option));
        }

        this.selectionTextElements = this.forElement_?.getElementsByClassName('bcd-dropdown_value') as HTMLCollectionOf<HTMLElement>;

        this.updateOptions();

        this.element_.addEventListener('focusout', this.focusOutHandler.bind(this));
    }

    focusOutHandler(evt: FocusEvent){
        if ((evt.relatedTarget as Element).parentElement !== this.element_) this.hide();
    }

    updateOptions() {
        const children: HTMLLIElement[] = [...(this.element_ as HTMLElement).getElementsByTagName('li') ];

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

        li.addEventListener(window.clickEvt, temp_clickCallback?.bind(this));

        this.onCreateOption?.(option);
        return li;
    }

    override onItemSelected(option: HTMLLIElement) {
        this.selectedOption = option.innerText;
        this.updateOptions();
    }

    onCreateOption?(option: string): void

    makeSelected(option: HTMLLIElement) {
        if (this.doReorder) option.classList.add('mdl-menu__item--full-bleed-divider');
        option.blur();

        for (const elm of this.selectionTextElements ?? []) {
            elm.innerText = option.innerText;
        }
    }

    makeNotSelected(option: HTMLLIElement) {
        option.classList.remove('mdl-menu__item--full-bleed-divider');
    }

    private _optionElements: undefined | HTMLCollectionOf<HTMLLIElement>;
    get optionElements(): HTMLCollectionOf<HTMLLIElement> { return this._optionElements ??= this.element_.getElementsByTagName('li') as HTMLCollectionOf<HTMLLIElement>; }

    hasShownOrHiddenThisFrame: boolean = false;

    override show(evt: any){
        if (this.hasShownOrHiddenThisFrame) return;
        this.hasShownOrHiddenThisFrame = true;
        requestAnimationFrame(() => this.hasShownOrHiddenThisFrame = false);

        if (this.element_.ariaHidden === 'false') return;

        console.log("[BCD-DROPDOWN] Showing dropdown:", this, evt);

        if (evt instanceof KeyboardEvent || evt instanceof PointerEvent && evt.pointerId === -1 || 'mozInputSource' in evt && evt.mozInputSource !== 1)
            this.optionElements[0]?.focus();

        this.element_.ariaHidden = 'false';
        this.element_.removeAttribute('disabled');

        for (const item of this.optionElements) item.tabIndex = 0;

        super.show(evt);
    }

    override hide(){
        if (this.hasShownOrHiddenThisFrame) return;
        this.hasShownOrHiddenThisFrame = true;
        requestAnimationFrame(() => this.hasShownOrHiddenThisFrame = false);

        if (this.element_.ariaHidden === 'true') return;

        console.log("[BCD-DROPDOWN] Hiding dropdown:", this);

        this.optionElements[0]?.blur();

        this.element_.ariaHidden = 'true';
        this.element_.setAttribute('disabled', '');

        for (const item of this.optionElements) item.tabIndex = -1;

        super.hide();
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
    static readonly asString = 'BCD - Debugger\'s All-Powerful Button';
    static readonly cssClass = 'js-bcd-debuggers-all-powerful-button';

    constructor(element: Element) {
        super(element, undefined, false);
    }

    override options(): objOf<Function|null> {
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
    static readonly asString = 'BCD - Tab List Button';
    static readonly cssClass = 'js-tab-list-button';

    static anchorToSet = '';

    override element_: HTMLButtonElement;
    boundTab:HTMLDivElement;
    name:string = '';
    setAnchor: boolean = false;

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

        this.setAnchor = element.parentElement?.hasAttribute('do-tab-anchor') ?? false;

        this.element_.addEventListener(window.clickEvt, this.onClick.bind(this));
        this.element_.addEventListener('keypress', this.onKeyPress.bind(this));

        //console.debug('Created tab button:', this);
        //console.debug('Is this tag pre-selected by the anchor?', window.location.hash.toLowerCase() === `#tab-${name}`.toLowerCase());
        if (this.setAnchor && window.location.hash.toLowerCase() === `#tab-${name}`.toLowerCase())
            requestAnimationFrame( (() => {this.makeSelected();}).bind(this) );
        else
            this.makeSelected(0);
    }

    /** @returns the index of this tab (0-based) or -1 if not found */
    findTabNumber(button_?: Element): number {
        const button = button_ ?? this.element_;
        //console.debug('findTabNumber: - button:', button, 'array:', [...(button.parentElement?.children ?? [])], 'index:', [...(button.parentElement?.children ?? [])].indexOf(button));
        return [...(button.parentElement?.children ?? [])].indexOf(button);
    }

    makeSelected(tabNumber_?: number) {
        const tabNumber = tabNumber_ ?? this.findTabNumber();
        if (tabNumber === -1) throw new Error('Could not find the tab number.');
        //console.debug('makeSelected: tabNumber:', tabNumber);

        const siblingsAndSelf = [...(this.element_.parentElement?.children ?? [])];
        if (!siblingsAndSelf[tabNumber] || siblingsAndSelf[tabNumber]!.classList.contains('active')) return;

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

        if (!this.boundTab.parentElement) return; // I would worry about race conditions, but browsers run websites in an Event Loop.

        const tab_siblingsAndTab = [...this.boundTab.parentElement.children];
        for (const tab of tab_siblingsAndTab) {

            if (tab === this.boundTab) {
                tab.classList.add('active');
                tab.classList.remove('tab-content__hidden');
                if ('inert' in (tab as HTMLElement)) (tab as HTMLElement).inert = false;

                tab.setAttribute('aria-hidden', 'false');

                tab.removeAttribute('disabled');
                tab.removeAttribute('tabindex');

                this.boundTab.parentElement.style.marginLeft = `-${tabNumber}00vw`;

            } else {

                tab.classList.remove('active');

                function addHidden() {
                    if (tab.classList.contains('active')) return;
                    tab.classList.add('tab-content__hidden');
                    if ('inert' in (tab as HTMLElement)) (tab as HTMLElement).inert = true;
                }
                tab.parentElement!.addEventListener('transitionend', addHidden, {once: true});
                afterDelay(250, () => {
                    tab.parentElement?.removeEventListener('transitionend', addHidden);
                    addHidden();
                });

                tab.setAttribute('aria-hidden', 'true');

                tab.setAttribute('disabled', '');
                tab.setAttribute('tabindex', '-1');
            }

        }

        if (this.setAnchor) {
            // Update the URL hash - if the tab is not the first tab, then add the tab name to the hash. Otherwise, remove the hash.
            bcdTabButton.anchorToSet = tabNumber == 0 ? '' : `#tab-${this.name}`.toLowerCase();
            bcdTabButton.setAnchorIn3AnimFrames();
        }
    }

    /** Sets `window.location.hash` to the value of `bcdTabButton.anchorToSet` in three animation frames. */
    static setAnchorIn3AnimFrames() {
        requestAnimationFrame( () => { requestAnimationFrame( () => { requestAnimationFrame( () => {
                    if (bcdTabButton.anchorToSet === '') window.history.replaceState(null, '', window.location.pathname);
                    else window.location.hash = bcdTabButton.anchorToSet;
        });                          });                            });
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




/*$$$$$$*\                    $$\   $$\     $$\
\__$$  __|                    $$ |  $$ |    \__|
   $$ |    $$$$$$\   $$$$$$\  $$ |$$$$$$\   $$\  $$$$$$\   $$$$$$$\
   $$ |   $$  __$$\ $$  __$$\ $$ |\_$$  _|  $$ |$$  __$$\ $$  _____|
   $$ |   $$ /  $$ |$$ /  $$ |$$ |  $$ |    $$ |$$ /  $$ |\$$$$$$\
   $$ |   $$ |  $$ |$$ |  $$ |$$ |  $$ |$$\ $$ |$$ |  $$ | \____$$\
   $$ |   \$$$$$$  |\$$$$$$  |$$ |  \$$$$  |$$ |$$$$$$$  |$$$$$$$  |
   \__|    \______/  \______/ \__|   \____/ \__|$$  ____/ \_______/
                                                $$ |
                                                $$ |
                                                \_*/


export class bcdTooltip {
    static readonly asString = 'BCD - Tooltip';
    static readonly cssClass = 'js-bcd-tooltip';

    relation: 'preceding' | 'proceeding' | 'child' | 'selector';
    position: 'top' | 'bottom' | 'left' | 'right' = 'top';

    element: HTMLElement;
    boundElement: HTMLElement;
    gapBridgeElement: HTMLElement;

    openDelayMS: number;

    constructor(element: HTMLElement) {
        this.element = element;

        this.gapBridgeElement = document.createElement('div');
        this.gapBridgeElement.classList.add('js-bcd-tooltip_gap-bridge');
        this.element.appendChild(this.gapBridgeElement);

        this.openDelayMS =  parseInt(element.getAttribute('open-delay-ms') ?? '400');


        const tempRelation = element.getAttribute('tooltip-relation') ?? 'proceeding';

        let tempElement;

        switch (tempRelation) {
            case 'preceding': tempElement = element.nextElementSibling; break;
            case 'proceeding': tempElement = element.previousElementSibling; break;
            case 'child': tempElement = element.parentElement; break;

            case 'selector': {
                const selector = element.getAttribute('tooltip-selector') ?? '';
                tempElement = element.parentElement?.querySelector(selector)
                                         ?? document.querySelector(selector);
            break; }

            default: throw new Error('Invalid tooltip-relation attribute!');
        }

        this.relation = tempRelation;

        if (!tempElement || !(tempElement instanceof HTMLElement) ) throw new Error('Could not find a valid HTML Element to bind to!');
        this.boundElement = tempElement;

        const tempPos = element.getAttribute('tooltip-position');

        switch (tempPos) {
            case 'top':  case 'bottom':  case 'left':  case 'right':
                this.position = tempPos; break;

            default: throw new Error('Invalid tooltip-position attribute!');
        }

        const boundEnter = this.handleHoverEnter.bind(this);
        const boundLeave = this.handleHoverLeave.bind(this);
        const boundTouch = this.handleTouch.bind(this);

        window.addEventListener('contextmenu', boundLeave);
        this.element.addEventListener('contextmenu', preventPropagation);

        this.boundElement.addEventListener('mouseenter',  boundEnter);                  this.element.addEventListener('mouseenter',  boundEnter);
        this.boundElement.addEventListener('mouseleave',  boundLeave);                  this.element.addEventListener('mouseleave',  boundLeave);

        this.boundElement.addEventListener('touchstart',  boundTouch, {passive: true}); this.element.addEventListener('touchstart',  boundTouch, {passive: true});
        this.boundElement.addEventListener('touchmove',   boundTouch, {passive: true}); this.element.addEventListener('touchmove',   boundTouch, {passive: true});
        this.boundElement.addEventListener('touchend',    boundTouch, {passive: true}); this.element.addEventListener('touchend',    boundTouch, {passive: true});
        this.boundElement.addEventListener('touchcancel', boundTouch, {passive: true}); this.element.addEventListener('touchcancel', boundTouch, {passive: true});
    }

    handleTouch(event: TouchEvent) {
        if (event.targetTouches.length > 0) this.handleHoverEnter(undefined, true);
        else this.handleHoverLeave(undefined, true);
    }

    handleHoverEnter(event?: MouseEvent|FocusEvent, bypassWait? : true) {
        this.element.classList.add('active_');

        afterDelay(600, ()=> {
            if (!this.element.classList.contains('active_')) return;
            this.element.classList.add('active');
            this.element.addEventListener('transitionend', this.setPosition.bind(this), {once: true});
            this.setPosition();
        });

    }

    handleHoverLeave(event?: MouseEvent|FocusEvent, bypassWait? : true) {
        this.element.classList.remove('active_');
        afterDelay(10, () => {
            if (!this.element.classList.contains('active_')) this.element.classList.remove('active');
        });
    }

    setPosition() {
        console.log(`Setting position of tooltip to the ${this.position} of `, this.boundElement);

        this.element.style.transform = 'none !important';
        this.element.style.transition = 'none !important';

        // Force recalc of styles
        const tipStyle = window.getComputedStyle(this.element);

        const tipPaddingRight =  parseInt(tipStyle.paddingRight);
        const tipPaddingLeft =   parseInt(tipStyle.paddingLeft);
        const tipPaddingTop =    parseInt(tipStyle.paddingTop);
        const tipPaddingBottom = parseInt(tipStyle.paddingBottom);

        console.debug('Recalculated styles:', {transform: tipStyle.transform, transition: tipStyle.transition, width: tipStyle.width, height: tipStyle.height, offsetLeft: this.element.offsetLeft, offsetTop: this.element.offsetTop, offsetWidth: this.element.offsetWidth, offsetHeight: this.element.offsetHeight});

        const elemRect = this.boundElement.getBoundingClientRect();
        const tipRect = {width: this.element.offsetWidth, height: this.element.offsetHeight};

        console.debug('Element rect:', elemRect);
        console.debug('Element rects:', this.boundElement.getClientRects());
        console.debug('Tooltip rect:', tipRect);
        console.debug('Tooltip rects:', this.element.getClientRects());

        /** The top position - set to the middle of the Bound Element */
        let top = elemRect.top  + (elemRect.height / 2);
        /** The top margin - the negative height of the tooltip */
        const marginTop = tipRect.height / -2;

        /** The left position - set to the middle of the Bound Element */
        let left =  elemRect.left + (elemRect.width  / 2);
        /** The left margin - the negative width of the tooltip */
        const marginLeft =   tipRect.width / -2;

        console.log(`Left Position: ${left + marginLeft}, pushing? ${left + marginLeft < 8}; Right Position: ${left + marginLeft + tipRect.width}, pushing? ${left + marginLeft + tipRect.width > window.innerWidth - 8}`);

        // Padding of 16px on the left and right of the document

        switch (this.position) {
            case 'top':
            case 'bottom':



                this.gapBridgeElement.style.height = '17px';
                this.gapBridgeElement.style.width = `${Math.max(tipRect.width, elemRect.width)}px`;
                this.gapBridgeElement.style.left = `${Math.min(elemRect.left, left + marginLeft) - left - marginLeft}px`;

                if (left + marginLeft < 8) left += 8 - left - marginLeft;

                this.element.style.left = `${left}px`;
                this.element.style.marginLeft = `${marginLeft}px`;

            break;

            case 'left':
            case 'right':

                top += 8 - top - marginTop;

                this.gapBridgeElement.style.height = `${Math.max(tipRect.height, elemRect.height)}px`;
                this.gapBridgeElement.style.width = '17px';
                this.gapBridgeElement.style.top = `${Math.min(elemRect.top, top + marginTop) - top - marginTop}px`;

                if (top + marginTop < 8) top += 8 - top - marginTop;

                this.element.style.top = `${top}px`;
                this.element.style.marginTop = `${marginTop}px`;

            break;
        }

        console.log(`Final Left Position: ${left + marginLeft - (tipRect.width / 2)}`);

        switch (this.position) {

            case 'top':     this.element.style.top  = `${elemRect.top  - tipRect.height - 16}px`;
                            this.gapBridgeElement.style.top  = `${16  + tipRect.height}px`;
            break;

            case 'bottom': this.element.style.top  = `${elemRect.top  + elemRect.height + 16}px`;
                            this.gapBridgeElement.style.top  = `-16px`;

            break;

            case 'left':   this.element.style.left = `${elemRect.left - tipRect.width - 16}px`;
                            this.gapBridgeElement.style.left = `${16 + tipRect.width}px`;

            break;

            case 'right':  this.element.style.left = `${elemRect.left + elemRect.width + 16}px`;
                            this.gapBridgeElement.style.left = `-16px`;

        }

        this.element.style.transform = '';
        this.element.style.transition = '';
    }

}
bcdComponents.push(bcdTooltip);



/*



$$\      $$\ $$\                                $$$$$$\  $$\
$$$\    $$$ |\__|                              $$  __$$\ $$ |
$$$$\  $$$$ |$$\  $$$$$$$\  $$$$$$$\           $$ /  \__|$$ | $$$$$$\   $$$$$$$\  $$$$$$$\  $$$$$$\   $$$$$$$\
$$\$$\$$ $$ |$$ |$$  _____|$$  _____|          $$ |      $$ | \____$$\ $$  _____|$$  _____|$$  __$$\ $$  _____|
$$ \$$$  $$ |$$ |\$$$$$$\  $$ /                $$ |      $$ | $$$$$$$ |\$$$$$$\  \$$$$$$\  $$$$$$$$ |\$$$$$$\
$$ |\$  /$$ |$$ | \____$$\ $$ |                $$ |  $$\ $$ |$$  __$$ | \____$$\  \____$$\ $$   ____| \____$$\
$$ | \_/ $$ |$$ |$$$$$$$  |\$$$$$$$\ $$\       \$$$$$$  |$$ |\$$$$$$$ |$$$$$$$  |$$$$$$$  |\$$$$$$$\ $$$$$$$  |
\__|     \__|\__|\_______/  \_______|\__|       \______/ \__| \_______|\_______/ \_______/  \_______|\______*/



export abstract class bcdDynamicTextArea_base {
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;

        this.adjust();

        const boundAdjust = this.adjust.bind(this);
        this.element.addEventListener('input', boundAdjust);
        this.element.addEventListener('change', boundAdjust);

        const resizeObserver = new ResizeObserver(boundAdjust);
        resizeObserver.observe(this.element);

        // Hopefully resolve an edge-case causing the text area to not initially size itself properly
        requestAnimationFrame(boundAdjust);
    }

    abstract adjust(): any;

}

export class bcdDynamicTextAreaHeight extends bcdDynamicTextArea_base {
    static readonly asString = 'BCD - Dynamic TextArea - Height';
    static readonly cssClass = 'js-dynamic-textarea-height';

    constructor(element: HTMLElement) {
        super(element);
    }

    override adjust() {
        this.element.style.height = '';
        getComputedStyle(this.element).height; // Force the browser to recalculate the scroll height

        const paddingPX = parseInt(this.element.getAttribute('paddingPX') ?? '0');
        if (isNaN(paddingPX)) {
            console.warn('The paddingPX attribute of the dynamic text area is not a number:', this);
        }

        this.element.style.height = `${this.element.scrollHeight + paddingPX}px`;
    }

}
bcdComponents.push(bcdDynamicTextAreaHeight);

export class bcdDynamicTextAreaWidth extends bcdDynamicTextArea_base {
    static readonly asString = 'BCD - Dynamic TextArea - Width';
    static readonly cssClass = 'js-dynamic-textarea-width';

    constructor(element: HTMLElement) {
        super(element);
        new ResizeObserver(this.adjust.bind(this)).observe(this.element);
    }

    override adjust() {
        this.element.style.width = '';
        getComputedStyle(this.element).width; // Force the browser to recalculate the scroll height

        const paddingPX = parseInt(this.element.getAttribute('paddingPX') ?? '0');
        if (isNaN(paddingPX)) {
            console.warn('The paddingPX attribute of the dynamic text area is not a number:', this);
        }

        this.element.style.width = `min(${this.element.scrollWidth + paddingPX}px, 100cqmin)`;
    }

}
bcdComponents.push(bcdDynamicTextAreaWidth);




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



/** Registers a single MDL component that has the static readonly properties `cssClass` and `asString` defined
    @param component The BCDComponent to register
    @throws nothing - this function gracefully handles errors in the form of `console.error` calls instead of throwing actual errors
    @returns whether or not an error occurred with the error as the return value
*/
export function registerBCDComponent(component:BCDComponent):boolean|Error {
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
        return e as Error;

    }

    return false;
}


/** Tell MDL about our shiny new components
    @param components The components to register. Defaults to the global bcdComponents array if not specified.
*/
export function registerBCDComponents(...components:BCDComponent[]):void{

    const componentArr = components.length ? components : bcdComponents;

    // Tell mdl about our shiny new components
    for (let i = 0; i < componentArr.length; i++) {
        registerBCDComponent(componentArr[i]!);
    }

    //console.debug("[BCD-Components] Registered the following components:", componentArr.map(c => `\n    ${c.asString}`).join(''));
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
let main: HTMLDivElement|undefined;
let footer: HTMLDivElement|undefined;


export function bcd_universalJS_init():void {

    // =============================================================
    // Register all the things!
    // =============================================================
    registerBCDComponents();

    // =============================================================
    // Modify links not in the main nav to not send a referrer
    // (allows for fancy drawer stuff)
    // =============================================================
    for (const link of [...document.links]){
        if (window.layout.drawer_?.contains(link)) link.rel += " noopener";
        else link.rel += " noopener noreferrer";
    }

    // =============================================================
    // Random text time!
    // =============================================================

    const randomTextField = document.getElementById("randomized-text-field");
    if (!randomTextField) return;

    const toSetText = quotes.possibilities_conditionalized[randomNumber(0, quotes.possibilities_conditionalized.length - 1)];


    // Check condition
    if (quotes.checkCondition(toSetText![0])) randomTextField.innerHTML = toSetText![1];
    else randomTextField.innerHTML = quotes.possibilities_Generic[randomNumber(0, quotes.possibilities_Generic.length - 1)]!;

    // =============================================================
    // Import Lazy-Loaded Styles
    // =============================================================
    afterDelay(100, () => {
        const lazyStyles = JSON.parse(`[${document.getElementById('lazy-styles')?.innerText ?? ''}]`) as string[];

        for (const style of lazyStyles) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = style;
            document.head.appendChild(link);
        }

        document.documentElement.classList.remove('lazy-styles-not-loaded');
        window.lazyStylesLoaded = true;
    });

    // =============================================================
    // Set main content div to respect the footer for mobile
    // =============================================================

    main = document.getElementById('cont') as HTMLDivElement;
    footer = document.getElementById('footer') as HTMLDivElement;

    //function resizeMain() {
    //    const footerHeight = footer!.offsetHeight ?? 0;
    //    const headerHeight = window.layout.header_?.offsetHeight ?? 0;

    //    const mainComputedStyle = window.getComputedStyle(main!);
    //    const mainContentPaddingHeight = parseFloat(mainComputedStyle.paddingTop) + parseFloat(mainComputedStyle.paddingBottom);

    //    main!.style.minHeight = `calc(100vh - ${Math.max(footerHeight, 24) + headerHeight + mainContentPaddingHeight + 1}px)`;
    //}

    //resizeMain();

    //const contResizeObserver = new ResizeObserver(resizeMain);

    //contResizeObserver.observe(footer);
    //if (window.layout.header_) contResizeObserver.observe(window.layout.header_);
}
window.bcd_init_functions.universal = bcd_universalJS_init;
