import * as mdl from './assets/site/mdl/material.js';
import * as quotes from './universal_quotes.js';
import type * as fs from './filesystem-interface.js';

function loadFS() {
    return import('./filesystem-interface.js');
}

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
export function afterDelay<TCallback extends (...args: any) => any = any>(timeout: number, callback: TCallback|string, ...args: Parameters<TCallback>): ReturnType<Window['setTimeout']> {
    // @ts-ignore: the `Parameters` utility type returns a tuple, which inherently has an iterator function--regardless of what TypeScript thinks
    return window.setTimeout(callback, timeout, ...(args || []));
}

export async function wait(timeout: number): Promise<void> {
    return new Promise(resolve => afterDelay(timeout, resolve));
}

export abstract class UpdatableObject {
    update() {
        if (this.suppressUpdates) return;
        this.suppressUpdates = true;
        this.update_();
        this.suppressUpdates = false;
    }
    readonly update_bound = this.update.bind(this);
    protected update_() {return;}

    updateFromInput() {
        if (this.suppressUpdates) return;
        this.suppressUpdates = true;
        this.updateFromInput_();
        this.suppressUpdates = false;
    }
        readonly updateFromInput_bound = this.updateFromInput.bind(this);

    protected updateFromInput_() {return;}

    destroy() {
        this.suppressUpdates = true;
        queueMicrotask(() => this.suppressUpdates = true);
        this.destroy_();
    }
    readonly destroy_bound = this.destroy.bind(this);

    protected destroy_() {return;}

    suppressUpdates = false;
}

export function nestAnimationFrames(num: number, callback: () => unknown) {
    if (num <= 0) return callback();
    requestAnimationFrame(() => nestAnimationFrames(num - 1, callback));
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

type EventElement = HTMLElement|typeof window|typeof document;

interface EventTypes<TElement extends EventElement = EventElement> {
    activate?: (this: TElement, ev: TElement extends HTMLElement ? (MouseEvent|KeyboardEvent) : (Event|KeyboardEvent)) => unknown;

    change?: (this: TElement, ev: Event) => unknown;

    dropdownInput?: (this: TElement, ev: Event) => unknown;

    exit?: (this: TElement, ev: KeyboardEvent) => unknown;

    anyKey?: (this: TElement, ev: KeyboardEvent) => unknown;
    key?: (this: TElement, ev: KeyboardEvent) => unknown;
}

const keyTypes: Record<string, keyof EventTypes> = {
    'Enter': 'activate',
    ' ': 'activate',
    'Escape': 'exit',
    'Esc': 'exit',
};

export function unregisterForEvents<TElement extends EventElement>(element: TElement, events: EventTypes<TElement>, options?: boolean|AddEventListenerOptions): void {
    registerForEvents_(element, events, options, true);
}

export function registerForEvents<TElement extends EventElement>(element: TElement, events: EventTypes<TElement>, options?: boolean|AddEventListenerOptions): void {
    registerForEvents_(element, events, options, false);
}

export const registerForEvents_wrappedFunctions = new Map<Function, Function>();
export const registerForEvents_handledKeys = new Map<EventTypes<any>, (this: any, ev: Event)=>void>();

function registerForEvents_<TElement extends EventElement>(element: TElement, events: EventTypes<TElement>, options?: boolean|AddEventListenerOptions, unregister = false): void {
    let handling = false;

    const setListener = unregister ? element.removeEventListener.bind(element) : element.addEventListener.bind(element);

    function wrapCallback<TCallback extends (this: TElement, ...args: any[]) => any>(callback: TCallback): ((this: ThisParameterType<TCallback>, ...args: Parameters<TCallback>)=>ReturnType<TCallback>|void) {
        let f = registerForEvents_wrappedFunctions.get(callback);

        if (!f) {
            f = function(this: ThisParameterType<TCallback>, ...args: Parameters<TCallback>) {
                if (handling) return;
                handling = true;
                queueMicrotask(() => handling = false);
                return callback.call(this, ...args) as ReturnType<TCallback>;
            };

            registerForEvents_wrappedFunctions.set(callback, f);
        }

        // @ts-ignore: The type is correct, but TypeScript doesn't know that
        return f;
    }

    // Wrap all the callbacks!
    events = Object.fromEntries(Object.entries(events).map(([key, value]) => [key, wrapCallback(value)]));

    let handleKey = registerForEvents_handledKeys.get(events);
    if (!handleKey) {
        handleKey = function(this: TElement, ev: Event) {
            if ( !(ev instanceof KeyboardEvent) ) return;
            const functionName = keyTypes[ev.key] || 'anyKey';
            events[functionName]?.call(element, ev);
        };

        registerForEvents_handledKeys.set(events, handleKey);
    }

    setListener('keydown', handleKey, options);

    for (const evt in events) switch (evt) {
        case 'activate': // @ts-ignore - my logic is perfectly valid, but TypeScript doesn't know that 🤷‍♂️
            setListener(window.clickEvt, events[evt]!, options);
            break;

        case 'change':
            setListener('change', events[evt]!, options);
            setListener('input', events[evt]!, options);
            break;

        case 'exit':
            break;

        case 'anyKey':
            break;

        case 'dropdownInput':
            setListener('bcd-dropdown-change', events[evt]!, options);
    }
}
window.registerForEvents = registerForEvents;

export function setProxies<TObj>(obj: TObj, handler: TObj extends Record<string, any> ? ProxyHandler<TObj> : ProxyHandler<any>): TObj {
    if (!obj || typeof obj !== 'object') return obj;

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value !== 'object') continue;

        setProxies(value, handler);
        obj[key as keyof TObj] = new Proxy(value ?? {}, handler);
    }

    obj = new Proxy(obj, handler);
    return obj;
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
    nestAnimationFrames(2, () => {
        if (!hadTabIndex) element.removeAttribute('tabindex');
    });
}


export function copyCode(elem: HTMLElement): void {
    if (!elem) throw new Error("No element provided to copyCode with!");

    //console.debug("copyCode", elem);

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


function ___getOrCreateChild(this:Document|Element, tagName: string) {
    let child = this.getElementsByTagName(tagName)[0];

    if (!child) {
        const doc = this instanceof Document ? this : this.ownerDocument;
        //console.debug(`Creating ${tagName} element for`, this);
        child = doc.createElement(tagName, {is: tagName});
        this.appendChild(child);
    }

    return child;
}
Element.prototype.getOrCreateChildByTag = ___getOrCreateChild;
Document.prototype.getOrCreateChildByTag = ___getOrCreateChild;

function ___removeChildByTag(this:Document|Element, tagName: string, count: number = 1) {
    const children = [...this.getElementsByTagName(tagName)];
    let removedCount = 0;
    for (let i = 0; removedCount <= count && i < children.length; i++) {
        const child = children[i];
        if (!child || child.tagName !== tagName) continue;

        child.remove();
        removedCount++;
    }
}

Element.prototype.removeChildByTag = ___removeChildByTag;
Document.prototype.removeChildByTag = ___removeChildByTag;

/** Changes the position of an item in the set
 * @returns Whether or not the item could be moved
*/
function ___moveItem<T>(this: Set<T>, item:T, newAdjacentItem:T, relativePosition:'above'|'below' = 'below'): boolean {
    if (!this.has(item) || !this.has(newAdjacentItem)) return false;

    const arr = [...this];
    const itemIndex = arr.indexOf(item);
    const adjacentIndex = arr.indexOf(newAdjacentItem);

    if (itemIndex === -1 || adjacentIndex === -1) return false;

    arr.splice(itemIndex, 1);
    arr.splice(adjacentIndex + (relativePosition === 'below' ? 1 : 0), 0, item);

    this.clear();
    arr.forEach(i => this.add(i));

    return true;
}
Set.prototype.moveItem = ___moveItem;

/** Changes the position of an item in the set using a provided index
 * @returns Whether or not the item could be moved
 * @param newIndex The new index of the item. If the index is negative, it will be treated as an offset from the end of the array.
*/
function ___moveIndex<T>(this: Set<T>, item:T, newIndex: number): boolean {
    if (!this.has(item)) return false;

    const arr = [...this];

    const itemIndex = arr.indexOf(item);
    if (itemIndex === -1) return false;

    if (newIndex < 0) newIndex = arr.length + newIndex;

    arr.splice(itemIndex, 1);
    arr.splice(newIndex, 0, item);

    this.clear();
    arr.forEach(i => this.add(i));

    return true;
}
Set.prototype.moveIndex = ___moveIndex;


/*$$$$$\                      $$\                 $$$$$$\           $$\   $$\
$$ ___$$\                     \__|                \_$$  _|          \__|  $$ |
$$/   $$ | $$$$$$\   $$$$$$$\ $$\  $$$$$$$\         $$ |  $$$$$$$\  $$\ $$$$$$\
$$$$$$$\ | \____$$\ $$  _____|$$ |$$  _____|        $$ |  $$  __$$\ $$ |\_$$  _|
$$  __$$\  $$$$$$$ |\$$$$$$\  $$ |$$ /              $$ |  $$ |  $$ |$$ |  $$ |
$$ |  $$ |$$  __$$ | \____$$\ $$ |$$ |              $$ |  $$ |  $$ |$$ |  $$ |$$\
$$$$$$$  |\$$$$$$$ |$$$$$$$  |$$ |\$$$$$$$\       $$$$$$\ $$ |  $$ |$$ |  \$$$$  |
 \______/  \_______|\_______/ \__| \_______|      \______|\__|  \__|\__|   \___*/

interface DocAndElementInjections {
    /** Returns the first element with the specified tag name or creates one if it does not exist */
    getOrCreateChildByTag<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
    getOrCreateChildByTag(tagName: string):Element;

    removeChildByTag<K extends keyof HTMLElementTagNameMap>(tagName: K, count?: number): void;
    removeChildByTag(tagName: string, count?: number): void;
}

declare global {
    interface Element extends DocAndElementInjections {
        upgrades?: ComponentMap;
        targetingComponents?: ComponentMap;
    }
    interface Document extends DocAndElementInjections {}

    interface HTMLElement extends DocAndElementInjections {
        onclick: EventTypes<HTMLElement>['activate']|null;
    }

    interface Set<T> {
        /** Changes the position of an item in the set relative to another item
         * @returns Whether or not the item could be moved
        */
        moveItem: typeof ___moveItem;

        /** Changes the position of an item in the set using a provided index
         * @returns Whether or not the item could be moved
        */
        moveIndex: typeof ___moveIndex;
    }

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

        BCDSettingsDropdown: typeof BCDSettingsDropdown;

        registerForEvents: typeof registerForEvents;
    }
}

function ___getExtends<K extends abstract new (...args: any[]) => unknown>(this: ComponentMap, type: K) {
    const returnVal:InstanceType<K>[] = [];
    for (const [,value] of this) if (value instanceof type) returnVal.push(value as InstanceType<K>);
    return returnVal;
}

export function registerUpgrade(subject: Element, upgrade: InstanceType<Component>, target?: Element|null, propagateToTargetChildren = false, propagateToSubjectToChildren = false): void {
    //console.log("registerUpgrade", {subject, upgrade, target, propagateToTargetChildren, propagateSubjectToChildren: propagateToSubjectToChildren});
    // Set the upgrade on the subject
    forEachChildAndOrParent(subject, propagateToSubjectToChildren, child => {
        //console.log("registerUpgrade: subject", child);
        if (!child.upgrades) {
            const map = new Map() as ComponentMap;
            map.getExtends = ___getExtends;
            child.upgrades = map;
        }

        child.upgrades.set(upgrade.constructor, upgrade);
    });

    // Repeat for target
    if (target) forEachChildAndOrParent(target, propagateToTargetChildren, child => {
        if (!child.targetingComponents) {
            const map = new Map() as ComponentMap;
            map.getExtends = ___getExtends;
            child.targetingComponents = map;
        }

        child.targetingComponents.set(upgrade.constructor, upgrade);
    });
}

function forEachChildAndOrParent(start: Element, doChildren: boolean, callback: (child: Element) => unknown): void {
    if (doChildren) forEachChild(start, callback);
    callback(start);
}

function forEachChild(start: Element, callback: (child: Element) => void): void {
    for (let i = 0; i < start.children.length; i++) {
        forEachChild(start.children[i]!, callback);
        callback(start.children[i]!);
    }
}

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


export interface Component extends Function {
    new(element: any, ...args: any[]): any;
}

/** Interface defining the readonly properties cssClass and asString to make identifying MDL Classes set up for my custom, painless registration functions a breeze */
export interface BCDComponentI extends Component {
    readonly asString: string;
    readonly cssClass: string;
}

// Create a map that guarantee an instance of the key
export type ComponentMap = Map<Component, InstanceType<Component>> & {
    get<K extends Component>(key: K): InstanceType<K>|undefined;
    set<K extends Component>(key: K, value: InstanceType<K>): ComponentMap;

    /** Fetches all classes that extend the specified class */
    getExtends<K extends abstract new(...args:any[])=>unknown>(key: K): InstanceType<K>[];
}


/** Variable to store components that we'll be registering on DOM initialization */
const bcdComponents:BCDComponentI[] = [];



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



export abstract class BCD_CollapsibleParent {
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
            }
        );
    }

    stateChangePromise(desiredState?:boolean):Promise<void>{

        if ((desiredState !== undefined && this.isOpen() === desiredState)
            || getComputedStyle(this.details_inner).transitionDuration === '0s') {
                return new Promise((resolve) => requestAnimationFrame(()=>{   this.onTransitionEnd(); resolve();  }) );
        }

        const transitionEndFunct = this.onTransitionEnd.bind(this);

        return new Promise<void>((resolve) => {
            function listener(event: TransitionEvent) {
                if (event.propertyName !== 'margin-top') return;
                removeListener();
                afterDelay(10, ()=>  {transitionEndFunct(event); resolve();}  );
            }

            this.details_inner.addEventListener('transitionend', listener);

            // Implemented as a separate function because it "avoids" a cyclic reference.
            const details_inner = this.details_inner;
            function removeListener(){ details_inner.removeEventListener('transitionend', listener); }
        });
    }

    /** Open the collapsible menu content */
    open(doSetDuration = true, instant = false) {//this.debugCheck();
        const returnVal = this.stateChangePromise(true);

        if (!instant) this.evaluateDuration(doSetDuration);

        this.details_inner.ariaHidden = 'false';
        this.details_inner.style.visibility = 'visible';
        BCD_CollapsibleParent.setDisabled(this.details_inner, true);

        this.details.classList.add(strs.classIsOpen);
        this.summary.classList.add(strs.classIsOpen);

        nestAnimationFrames(3, () => {

            this.details_inner.style.marginTop = this.details.getAttribute('data-margin-top') || '0';

            if (instant) nestAnimationFrames(2, ()=>
                this.evaluateDuration.bind(this, doSetDuration, true)
            );

        });

        if (instant) return this.instantTransition();

        return returnVal;
    }

    hasClosedFinal = false;
    /** Close the collapsible content */
    close(doSetDuration:boolean = true, instant = false, final = false, duration?: number) {
        //console.log(`Closing collapsible - doSetDuration: ${doSetDuration}, instant: ${instant}, final: ${final}, duration: ${duration}`);

        if (this.hasClosedFinal) return;

        if (final){
            this.summary.upgrades!.getExtends(BCD_CollapsibleParent)[0]!.hasClosedFinal = true;
            this.details.upgrades!.getExtends(BCD_CollapsibleParent)[0]!.hasClosedFinal = true;
        }

        if (duration === undefined) this.evaluateDuration(doSetDuration, false);
        else this.details_inner.style.transitionDuration = `${duration}ms`;

        const returnVal = this.stateChangePromise(false);

        // Registers for the event twice because the event appears to fire twice, at least in Chromium browsers.
        this.details_inner.style.marginTop = `-${this.details_inner.offsetHeight + 32}px`;

        this.details.classList.remove(strs.classIsOpen);
        this.summary.classList.remove(strs.classIsOpen);
        BCD_CollapsibleParent.setDisabled(this.details_inner, true);

        if (instant) {
            nestAnimationFrames(2, () => this.evaluateDuration(doSetDuration, false) );
            return this.instantTransition();
        }

        if (final) this.summary.style.pointerEvents = 'none';

        return returnVal;
    }

    onTransitionEnd(event?:TransitionEvent):void {
        if (event && event.propertyName !== 'margin-top') return;

        if (this.isOpen()) {
            BCD_CollapsibleParent.setDisabled(this.details_inner, false);
            return;
        }

        requestAnimationFrame(() => {
            this.details_inner.ariaHidden = 'true';
            this.details_inner.style.visibility = 'none';
            BCD_CollapsibleParent.setDisabled(this.details_inner, true);
        });
    }

    instantTransition(): Promise<void> {
        if (this.details_inner) {
            this.details_inner.style.transitionDuration = `0s`;
            this.details_inner.style.animationDuration = `0s`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.animationDuration = `0s`;
            }
        }
        this.onTransitionEnd();
        return new Promise((r) => r());
    }

    static setDisabled(elm:Element, disabled:boolean):void {
        for (const child of elm.children)
            this.setDisabled(child, disabled);

        const wasDisabled = elm.getAttribute('data-was-disabled') as 'true'|'false'|null;
        const oldTabIndex = elm.getAttribute('data-old-tabindex');

        if (disabled) {
            if (wasDisabled === null) elm.setAttribute('data-was-disabled', elm.hasAttribute('disabled') ? 'true' : 'false');
            elm.setAttribute('disabled', '');

            if (elm instanceof HTMLElement) {
                if (oldTabIndex === null) elm.setAttribute('data-old-tabindex', elm.getAttribute('tabindex') || '');
                elm.tabIndex = -1;
            }

            //console.log('set disabled', elm instanceof HTMLElement, elm);

        } else if (wasDisabled === 'false' || wasDisabled === null) {
            elm.removeAttribute('data-was-disabled');
            elm.removeAttribute('disabled');
            elm.setAttribute('tabindex', oldTabIndex || '');

        } else /* wasDisabled === 'true' */ {
            elm.removeAttribute('data-was-disabled');
            elm.setAttribute('tabindex', oldTabIndex || '');
        }
    }

    /* Determines what the transition and animation duration of the collapsible menu is */
    evaluateDuration(doRun:boolean = true, opening:boolean=true) {//this.debugCheck();
        if (doRun && this.details_inner) {
            const contentHeight = this.details_inner.offsetHeight;
            this.details_inner.style.transitionDuration = `${(opening ? 250 : 300) + ((opening ? 0.3 : 0.35) * (contentHeight + 32))}ms`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.transitionDuration = `${ 250 + (0.15 * (contentHeight + 32)) }ms`;
            }
        }
    }
}

export class BCDDetails extends BCD_CollapsibleParent {
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
            if (!temp_summary || !temp_summary.classList.contains(BCDSummary.cssClass)) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-DETAILS] Error: Adjacent Details element must be preceded by a Summary element.");}
            this.summary = temp_summary as HTMLElement;
        } else {
            const temp_summary = this.self.ownerDocument.querySelector(`.js-bcd-summary[for="${this.details.id}"`);
            if (!temp_summary) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-DETAILS] Error: Non-adjacent Details elements must have a Summary element with a `for` attribute matching the Details element's id.");}
            this.summary = temp_summary as HTMLElement;
        }
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');
        new ResizeObserver(this.reEvalOnSizeChange.bind(this)).observe(this.details_inner);

        bcd_ComponentTracker.registerComponent(this, BCDDetails, this.details);
        this.reEval(true, true);
        this.self.classList.add('initialized');

        registerUpgrade(this.self, this, this.summary, true);
    }

    reEvalOnSizeChange(entries: ResizeObserverEntry[], observer: ResizeObserver) {
        if (!this.isOpen()) this.reEval(true, true);
    }
}
bcdComponents.push(BCDDetails);

export class BCDSummary extends BCD_CollapsibleParent {
    static readonly cssClass = 'js-bcd-summary';
    static readonly asString = 'BellCubicSummary';

    constructor(element:HTMLElement) {
        super(element);
        this.summary = element;
        registerForEvents(this.summary, {activate: this.activate.bind(this)});
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');

        if (this.adjacent) {
            const temp_details = this.self.nextElementSibling;
            if (!(temp_details && temp_details.classList.contains(BCDDetails.cssClass))) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Adjacent Summary element must be proceeded by a Details element.");}
            this.details = temp_details as HTMLElement;
        } else {
            const temp_details = this.self.ownerDocument.getElementById(this.summary.getAttribute('for') ?? '');
            if (!temp_details) /* Throw an error*/ {console.log(strs.errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Non-adjacent Details elements must have a summary element with a `for` attribute matching the Details element's id.");}
            this.details = temp_details as HTMLElement;
        }

        this.divertedCompletion();

        registerUpgrade(this.self, this, this.details, false, true);
    }

    divertedCompletion(){queueMicrotask(()=>{

        const temp_inner = this.details.querySelector(`.${strs.classDetailsInner}`);
        if (!temp_inner) {this.divertedCompletion(); return;}
            else this.details_inner = temp_inner as HTMLElement;

        bcd_ComponentTracker.registerComponent(this, BCDSummary, this.details);
        this.reEval(true, true);
        this.self.classList.add('initialized');
    });}

    correctFocus(keyDown?: boolean) {
        if (keyDown) focusAnyElement(this.summary as HTMLElement);
        else return nestAnimationFrames(2, () => {
            this.summary.blur();
        });
    }

    activate(event?:MouseEvent|KeyboardEvent){
        //console.log(event);
        if (!event) return;

        if (
            // Make sure the pointer type is valid
            (('pointerType' in event) && !event.pointerType)

            // Reject the event if there's an <a> element within the first 5 elements of the path
            || ('path' in event && event.path && event.path instanceof Array && event.path?.slice(0, 5).some((el:HTMLElement) => el.tagName === 'A'))
        ) return;

        this.toggle();
        this.correctFocus(event instanceof KeyboardEvent);
    }
}
bcdComponents.push(BCDSummary);

/** Simple MDL Class to handle making JSON pretty again
    Takes the textContent of the element and parses it as JSON, then re-serializes it with 2 spaces per indent.
*/
export class bcd_prettyJSON {
    static readonly cssClass = 'js-bcd-prettyJSON';
    static readonly asString = 'bcd_prettyJSON';
    element_:HTMLElement;
    constructor(element:HTMLElement) {
        registerUpgrade(element, this, null, false, true);
        this.element_ = element;

        const json = JSON.parse(element.textContent ?? '');
        this.element_.textContent = JSON.stringify(json, null, 2);

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



export class BCDModalDialog extends EventTarget {
    static readonly cssClass = 'js-bcd-modal';
    static readonly asString = 'BellCubic Modal';

    static obfuscator: HTMLDivElement;
    static modalsToShow: BCDModalDialog[] = [];
    static shownModal: BCDModalDialog|null = null;

    element_:HTMLDialogElement|HTMLElement;
    closeByClickOutside:boolean;

    constructor(element:HTMLDialogElement) {
        super();
        registerUpgrade(element, this, null, false, true);

        this.element_ = element;

        this.element_.ariaModal = 'true';
        this.element_.setAttribute('role', 'dialog');
        this.element_.ariaHidden = 'true';
        this.element_.hidden = true;

        const body = document.body ?? document.documentElement.getElementsByTagName('body')[0];

        // Move element to the top of the body (just one more thing to make sure it shows above everything else)
        body.prepend(element);

        if (!BCDModalDialog.obfuscator) {
            BCDModalDialog.obfuscator = document.createElement('div');
            BCDModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.OBFUSCATOR, 'js-bcd-modal-obfuscator');
            body.appendChild(BCDModalDialog.obfuscator);
        }

        this.closeByClickOutside = !this.element_.hasAttribute('no-click-outside');

        afterDelay(1000, function (this: BCDModalDialog) { // Lets the DOM settle and gives JavaScript a chance to modify the element

            const closeButtons = this.element_.getElementsByClassName('js-bcd-modal-close') as HTMLCollectionOf<HTMLElement>;
            for (const button of closeButtons) {
                registerForEvents(button, {activate: this.boundHideFunction});
            }

            if (this.element_.hasAttribute('open-by-default')) this.show();
        }.bind(this));
    }

    static evalQueue(delay: number = 100):void {

        //console.debug("========================\nEvaluating modal queue...\n========================");

        //const willExit = {
        //    shownModal: this.shownModal,
        //    modalsToShow: this.modalsToShow,
        //
        //    shownModal_bool: !!this.modalsToShow.length,
        //    modalsToShow_lengthBool: !this.modalsToShow.length
        //};
        //console.debug('Will exit?', !!(this.shownModal || !this.modalsToShow.length), willExit);

        if (this.shownModal || !this.modalsToShow.length) return;

        const modal = BCDModalDialog.modalsToShow.shift(); if (!modal) return this.evalQueue();
        BCDModalDialog.shownModal = modal;

        //console.debug("Showing modal:", modal);

        afterDelay(delay, modal.show_forReal.bind(modal));
    }

    show(){
        BCDModalDialog.modalsToShow.push(this);
        //console.debug("[BCD-MODAL] Modals to show (after assignment):", bcdModalDialog.modalsToShow);
        BCDModalDialog.evalQueue();
        //console.debug("[BCD-MODAL] Modals to show (after eval):", bcdModalDialog.modalsToShow);

        return new Promise<string|null>((resolve) => {
            this.addEventListener('afterHide', (evt) => {
                if ('detail' in evt && typeof evt.detail === 'string')
                    resolve(evt.detail);
                else
                    resolve(null);
            }, {once: true});
        });
    }

    /** Event sent just before the modal is shown
        If this event is canceled or `PreventDefault()` is called, the modal will not be shown.

        The event is first sent for the class and, if not canceled and if `PreventDefault()` was not called, the event is sent for the element.
    */
    static readonly beforeShowEvent = new CustomEvent('beforeShow', {cancelable: true, bubbles: false, composed: false});

    /** Event sent just after the modal is shown

        The event is first sent for the class and, if not canceled and if PreventDefault() was not called, the event is sent for the element.
    */
    static readonly afterShowEvent = new CustomEvent('afterShow', {cancelable: false, bubbles: false, composed: false});

    private show_forReal() {
        //console.debug("[BCD-MODAL] Showing modal:", this);
        /* 'Before' Event */ if (!this.dispatchEvent(BCDModalDialog.beforeShowEvent) || !this.element_.dispatchEvent(BCDModalDialog.beforeShowEvent)) return;

        BCDModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        registerForEvents(BCDModalDialog.obfuscator, {activate: this.boundHideFunction});

        this.element_.ariaHidden = 'false';
        this.element_.hidden = false;

        if ('show' in this.element_) this.element_.show();
        else this.element_.setAttribute('open', '');
        //console.debug("[BCD-MODAL] Modal shown:", this);

        /* 'After' Event */  if (this.dispatchEvent(BCDModalDialog.afterShowEvent)) this.element_.dispatchEvent(BCDModalDialog.afterShowEvent);

        //console.debug("[BCD-MODAL] Modals to show (after show):", bcdModalDialog.modalsToShow);
    }

    /** Event sent just before the modal is hidden
        If this event is canceled or `PreventDefault()` is called, the modal will not be shown.

        The event is first sent for the class and, if not canceled and if `PreventDefault()` was not called, the event is sent for the element.
    */
    static getBeforeHideEvent(msg: string|null = null) {return new CustomEvent('beforeHide', {cancelable: true, bubbles: false, composed: false, detail: msg});}

    /** Event sent just after the modal is hidden

        The event is first sent for the class and, if not canceled and if PreventDefault() was not called, the event is sent for the element.
    */
    static getAfterHideEvent(msg: string|null = null) {return new CustomEvent('afterHide', {cancelable: false, bubbles: false, composed: false, detail: msg});}

    // Storing the bound function lets us remove the event listener from the obfuscator after the modal is hidden
    boundHideFunction = this.hide.bind(this);

    hide(evt?: Event){
        //console.debug("[BCD-MODAL] Hiding modal:", this);

        let msg = null;
        if (evt && evt.currentTarget instanceof Element)
            msg = evt.currentTarget.getAttribute('data-modal-message');

        if (evt) evt.stopImmediatePropagation();
        /* 'Before' Event */ if (!this.dispatchEvent(BCDModalDialog.getBeforeHideEvent(msg)) ||!this.element_.dispatchEvent(BCDModalDialog.getBeforeHideEvent(msg))) return;

        this.element_.ariaHidden = 'true';

        if ('close' in this.element_) this.element_.close();
        else this.element_.removeAttribute('open');

        this.element_.hidden = true;

        BCDModalDialog.obfuscator.classList.remove(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        BCDModalDialog.obfuscator.removeEventListener(window.clickEvt, this.boundHideFunction);

        BCDModalDialog.shownModal = null;


        /* 'After' Event */  if (this.dispatchEvent(BCDModalDialog.getAfterHideEvent(msg))) this.element_.dispatchEvent(BCDModalDialog.getAfterHideEvent(msg));

        BCDModalDialog.evalQueue();
    }

}
bcdComponents.push(BCDModalDialog);


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

export abstract class BCDDropdown extends mdl.MaterialMenu {

    abstract options(): optionObj;

    doReorder:boolean;

    options_: optionObj;
    options_keys: string[];

    selectedOption: string = '';

    override element_: HTMLElement;

    selectionTextElements: undefined | HTMLCollectionOf<HTMLElement>;

    constructor(element: Element, buttonElement?: Element|null, doReorder: boolean = true) {
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
            this.forElement_.ariaHasPopup = 'true';

            // MDL has custom handling for keyboard vs mouse events, so I'll register them raw
            this.forElement_.addEventListener(window.clickEvt, this.boundForClick_);
            this.forElement_.addEventListener('keydown', this.boundForKeydown_);
        }

        //console.log("[BCD-DROPDOWN] Initializing dropdown:", this);

        const tempOptions = this.options();
        this.options_ = tempOptions;
        this.options_keys = Object.keys(this.options_);

        this.selectedOption = this.options_keys[0] ?? '';

        for (const option of this.options_keys) {
            this.element_.appendChild(this.createOption(option));
        }

        this.selectionTextElements = this.forElement_?.getElementsByClassName('bcd-dropdown_value') as HTMLCollectionOf<HTMLElement>;

        this.hide();
        this.updateOptions();

        this.element_.addEventListener('focusout', this.focusOutHandler.bind(this));

        registerUpgrade(element, this, this.forElement_, true, true);
    }

    focusOutHandler(evt: FocusEvent){
        if ((evt.relatedTarget as Element|null)?.parentElement !== this.element_) this.hide();
    }

    selectByString(option: string){
        if (this.options_keys.includes(option)) this.selectedOption = option;
        else console.warn("[BCD-DROPDOWN] Attempted to select an option that does not exist:", option);
        this.updateOptions();
    }

    updateOptions() {
        const children: HTMLLIElement[] = [...this.element_.getElementsByTagName('li') ];
        //console.log("[BCD-DROPDOWN] Updating options:", this, children, children.map((elm) => elm.textContent), this.selectedOption);

        if (this.doReorder) {
            const goldenChild = children.find((elm) => (elm as HTMLLIElement).textContent === this.selectedOption);
            if (!goldenChild) {
                console.log("[BCD-DROPDOWN] Erroring instance:", this);

                throw new Error('Could not find the selected option in the dropdown.');
            }

            this.makeSelected(goldenChild);
        }

        const demonChildren = this.doReorder ? children.filter((elm) => (elm as HTMLLIElement).textContent !== this.selectedOption) : children;
        demonChildren.sort( (a, b) => this.options_keys.indexOf(a.textContent ?? '') - this.options_keys.indexOf(b.textContent ?? '') );

        for (const child of demonChildren) {
            this.element_.removeChild(child);
            this.makeNotSelected(child);
            this.element_.appendChild(child);
        }
    }

    createOption(option: string, clickCallback?: Function|null, addToList: boolean = false): HTMLLIElement {
        const li = document.createElement('li');
        li.textContent = option;
        li.setAttribute('option-value', option);
        li.classList.add('mdl-menu__item');

        this.registerItem(li);

        const temp_clickCallback = clickCallback ?? this.options_[option] ?? null;

        if (addToList) {
            this.element_.appendChild(li);
            this.options_keys.push(option);
            this.options_[option] = temp_clickCallback;
        }

        if (temp_clickCallback) registerForEvents(li, {activate: temp_clickCallback.bind(this)});

        this.onCreateOption?.(option);
        return li;
    }

    override onItemSelected(option: HTMLLIElement) {
        this.selectedOption = option.textContent ?? '';
        this.element_.dispatchEvent(new CustomEvent('bcd-dropdown-change', { detail: {dropdown: this, option: this.selectedOption} }));
        this.updateOptions();
    }

    onCreateOption?(option: string): void

    makeSelected(option: HTMLLIElement) {
        if (this.doReorder) option.classList.add('mdl-menu__item--full-bleed-divider');
        option.blur();

        for (const elm of this.selectionTextElements ?? []) {
            elm.textContent = option.textContent;
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

        //console.log("[BCD-DROPDOWN] Showing dropdown:", this, evt);

        if (evt instanceof KeyboardEvent || evt instanceof PointerEvent && evt.pointerId === -1 || 'mozInputSource' in evt && evt.mozInputSource !== 1)
            this.optionElements[0]?.focus();

        this.element_.ariaHidden = 'false';
        this.element_.removeAttribute('disabled');
        if (this.forElement_) this.forElement_.ariaExpanded = 'true';

        for (const item of this.optionElements) item.tabIndex = 0;

        this.forElement_?.targetingComponents?.get(BCDTooltip)?.hide();

        super.show(evt);
    }

    override hide(){
        if (this.hasShownOrHiddenThisFrame) return;
        this.hasShownOrHiddenThisFrame = true;
        requestAnimationFrame(() => this.hasShownOrHiddenThisFrame = false);

        if (this.element_.ariaHidden === 'true') return;

        //console.log("[BCD-DROPDOWN] Hiding dropdown:", this);

        this.optionElements[0]?.blur();

        this.element_.ariaHidden = 'true';
        this.element_.setAttribute('disabled', '');
        if (this.forElement_) this.forElement_.ariaExpanded = 'false';

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



export class bcdDropdown_AwesomeButton extends BCDDropdown {
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

export class BCDTabButton extends mdl.MaterialButton {
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

        element.textContent = name;
        element.setAttribute('type', 'button');

        super(element); // Now we can use `this`!
        registerUpgrade(element, this, boundTab, false, true);
        this.element_ = element;

        this.boundTab = boundTab;
        this.name = name;

        // Check if the page was reloaded
        const entry = window.performance.getEntriesByType("navigation")?.[0];
        this.setAnchor = element.parentElement?.hasAttribute('do-tab-anchor') ?? false;

        registerForEvents(this.element_, {activate: this.activate.bind(this)});

        if (entry && 'type' in entry && entry.type === 'reload')
            this.makeSelected(0);
        else if (this.setAnchor && window.location.hash.toLowerCase() === `#tab-${name}`.toLowerCase())
            queueMicrotask(this.makeSelected.bind(this));
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
                sibling.setAttribute('aria-pressed', 'true');
            }
            else {
                sibling.classList.remove('active');
                sibling.setAttribute('aria-pressed', 'false');
            }
        }

        if (!this.boundTab.parentElement) return; // I would worry about race conditions, but browsers run websites in an Event Loop.

        const tab_siblingsAndTab = [...this.boundTab.parentElement.children];
        for (const tab of tab_siblingsAndTab) {

            if (tab === this.boundTab) {
                tab.classList.add('active');
                tab.classList.remove('tab-content--hidden');
                if ('inert' in (tab as HTMLElement)) (tab as HTMLElement).inert = false;

                tab.setAttribute('aria-hidden', 'false');

                tab.removeAttribute('disabled');
                tab.removeAttribute('tabindex');

                this.boundTab.parentElement.style.marginLeft = `-${tabNumber}00vw`;

            } else {

                tab.classList.remove('active');

                function addHidden() {
                    if (tab.classList.contains('active')) return;
                    tab.classList.add('tab-content--hidden');
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
            BCDTabButton.anchorToSet = tabNumber == 0 ? '' : `#tab-${this.name}`.toLowerCase();
            BCDTabButton.setAnchorIn3AnimFrames();
        }
    }

    /** Sets `window.location.hash` to the value of `bcdTabButton.anchorToSet` in three animation frames. */
    static setAnchorIn3AnimFrames() {
        nestAnimationFrames(3,  () => {
                    if (BCDTabButton.anchorToSet === '') window.history.replaceState(null, '', window.location.pathname);
                    else window.location.hash = BCDTabButton.anchorToSet;
        });
    }

    activate(): void {
        this.makeSelected();
        this.element_.blur();
    }
}
bcdComponents.push(BCDTabButton);




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


export class BCDTooltip {
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
        element.setAttribute('role', 'tooltip'); element.setAttribute('aria-role', 'tooltip');

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

        if (!tempElement || !(tempElement instanceof HTMLElement) ) throw new Error('TOOLTIP - Could not find a valid HTML Element to bind to!');
        this.boundElement = tempElement;
        registerUpgrade(element, this, this.boundElement, true, true);

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
        else this.handleHoverLeave();
    }

    handleHoverEnter(event?: MouseEvent|FocusEvent, bypassWait?: true) {
        const targetElement = event instanceof MouseEvent ? document.elementFromPoint(event?.x ?? 0, event?.y ?? 0) : event?.target;

        if (targetElement instanceof Element) {
            for (const [,instance] of targetElement.upgrades ?? [])
                if (instance instanceof BCDDropdown) return;

            for (const [,instance] of targetElement.targetingComponents ?? [])
                if (instance instanceof BCDDropdown && instance.container_.classList.contains('is-visible')) return;
        }

        this.showPart1();

        afterDelay(bypassWait ? 0 : 600, function(this: BCDTooltip) {
            if (!this.element.classList.contains('active_')) return;
            this.showPart2();
        }.bind(this));

    }

    showPart1() {
        this.element.classList.add('active_');
        registerForEvents(window, {exit: this.hide_bound});
    }

    showPart2() {
        this.element.classList.add('active');
        this.element.addEventListener('transitionend', this.setPosition.bind(this), {once: true});
        this.setPosition();
    }

    show() {
        this.showPart1();
        this.showPart2();
    }

    handleHoverLeave(event?: MouseEvent|FocusEvent) { this.hide(); }

    hide() {
        this.element.classList.remove('active_');

        afterDelay(10, () => {
            if (!this.element.classList.contains('active_'))
                this.element.classList.remove('active');
        });
    }
    readonly hide_bound = this.hide.bind(this);

    setPosition() {
        //console.log(`Setting position of tooltip to the ${this.position} of `, this.boundElement);

        this.element.style.transform = 'none !important';
        this.element.style.transition = 'none !important';

        // Force recalc of styles
        const tipStyle = window.getComputedStyle(this.element);
        tipStyle.transition;
        tipStyle.transform;

        //console.debug('Recalculated styles:', {transform: tipStyle.transform, transition: tipStyle.transition, width: tipStyle.width, height: tipStyle.height, offsetLeft: this.element.offsetLeft, offsetTop: this.element.offsetTop, offsetWidth: this.element.offsetWidth, offsetHeight: this.element.offsetHeight});

        const elemRect = this.boundElement.getBoundingClientRect();
        const tipRect = {width: this.element.offsetWidth, height: this.element.offsetHeight};

        //console.debug('Element rect:', elemRect);
        //console.debug('Element rects:', this.boundElement.getClientRects());
        //console.debug('Tooltip rect:', tipRect);
        //console.debug('Tooltip rects:', this.element.getClientRects());

        /** The top position - set to the middle of the Bound Element */
        let top = elemRect.top  + (elemRect.height / 2);
        /** The top margin - the negative height of the tooltip */
        const marginTop = tipRect.height / -2;

        /** The left position - set to the middle of the Bound Element */
        let left =  elemRect.left + (elemRect.width  / 2);
        /** The left margin - the negative width of the tooltip */
        const marginLeft =   tipRect.width / -2;

        //console.log(`Left Position: ${left + marginLeft}, pushing? ${left + marginLeft < 8}; Right Position: ${left + marginLeft + tipRect.width}, pushing? ${left + marginLeft + tipRect.width > window.innerWidth - 8}`);

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

        //console.log(`Final Left Position: ${left + marginLeft - (tipRect.width / 2)}`);

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
bcdComponents.push(BCDTooltip);



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
        registerUpgrade(element, this, null, false, true);
        this.element = element;

        this.adjust();

        const boundAdjust = this.adjust.bind(this);
        registerForEvents(this.element, {change: boundAdjust});

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

class RelativeFilePicker {
    static asString = 'BCD - Relative File Picker';
    static cssClass = 'js-relative-file-picker';

    element: HTMLInputElement;
    button: HTMLButtonElement;

    relativeTo?: fs.Folder|{directory: fs.Folder}|string[];
    get directory(): fs.Folder|undefined {
        if (!this.relativeTo) return undefined;
        if ('handle' in this.relativeTo) return this.relativeTo;
        if ('directory' in this.relativeTo) return this.relativeTo.directory;
        return SettingsGrid.getSetting(this.relativeTo, 'directory');
    }

    constructor(element: HTMLInputElement, relativeTo?: fs.Folder|{directory: fs.Folder}) {
        this.element = element;
        this.relativeTo = relativeTo;

        if (!relativeTo) {
            const relativeToAttr = element.getAttribute('relative-to');
            if (!relativeToAttr) throw new Error('The relative file picker must have a relative-to attribute or have a folder specified at creation.');

            this.relativeTo = relativeToAttr.split('.');
        }

        registerUpgrade(element, this, null, false, true);

        registerForEvents(this.element, {change: this.boundOnChange});


        /* Create the following button:
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect js-relative-file-picker--button"
                <i class="material-icons">edit_document</i>
            </button>
        */

        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.classList.add(
            /* MDL  */ 'mdl-button', 'mdl-js-button', 'mdl-button--fab', 'mdl-js-ripple-effect',
            /* Mine */ 'js-relative-file-picker--button'
        );

        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.textContent = 'edit_document';

        this.button.appendChild(icon);
        this.element.after(this.button);

        registerForEvents(this.button, {activate: this.boundOnButtonClick});
    }

    onChange() {
        console.log('onChange', this.element.value, this);
    }
    readonly boundOnChange = this.onChange.bind(this);

    async onButtonClick() {
        console.log('onButtonClick', this.element.value, this);

        let fileHandle: FileSystemFileHandle;
        try {
            [fileHandle] = await window.showOpenFilePicker({multiple: false});
        } catch (e) {
            if (e && e instanceof DOMException && e.name === 'AbortError') return; // The user canceled the file picker (which is fine)
            console.warn('The file picker threw some sort of error', e);
            return;
        }

        const nameArr = await this.directory?.handle.resolve(fileHandle);
        if (!nameArr) return console.debug('The file picker returned a file that is not in the specified directory', fileHandle, this.directory);

        this.element.value = nameArr.join('/');
        this.element.dispatchEvent(new Event('change'));
    }
    readonly boundOnButtonClick = this.onButtonClick.bind(this);
}
bcdComponents.push(RelativeFilePicker);

class RelativeImagePicker extends RelativeFilePicker {
    static override readonly asString = 'BCD - Relative Image Picker';
    static override readonly cssClass = 'js-relative-image-picker';

    imageElem?: HTMLImageElement;
    noImageElem?: SVGSVGElement;
    relation: 'previous'|'next'|'parent'|'selector';

    static noImageDoc?: Document | Promise<string>;

    constructor(element: HTMLInputElement, relativeTo?: fs.Folder|{directory: fs.Folder}) {
        super(element, relativeTo);

        this.relation = element.getAttribute('relation') as 'previous'|'next'|'parent'|'selector' ?? 'previous';

        switch (this.relation) {

            case 'previous':
                this.imageElem = element.parentElement!.previousElementSibling as HTMLImageElement;
                break;

            case 'next':
                this.imageElem = element.parentElement!.nextElementSibling as HTMLImageElement;
                break;

            case 'parent':
                this.imageElem = element.parentElement as HTMLImageElement;
                break;

            case 'selector': {
                const selector = element.getAttribute('selector');
                if (!selector) throw new Error('The relative image picker must have a selector attribute if the relation is set to selector.');

                this.imageElem = element.parentElement!.querySelector(selector) as HTMLImageElement
                                            || document.querySelector(selector) as HTMLImageElement;
                break;
            }

            default:
                throw new Error('The relative image picker must have a relation attribute that is either previous, next, parent, or selector.');
        }

        this.createNoImageElem();

        registerUpgrade(element, this, this.imageElem, true, true);
    }

    async createNoImageElem() {
        // Create the request if it does not already exist
        RelativeImagePicker.noImageDoc ??= fetch('https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/image/default/48px.svg').then(r => r.text());

        let svg: undefined|SVGSVGElement = undefined;
        // Wait for the request to finish if it has not already
        if (RelativeImagePicker.noImageDoc instanceof Promise) {
            const str = await RelativeImagePicker.noImageDoc;
            RelativeImagePicker.noImageDoc = new DOMParser().parseFromString(str, 'text/html');
            svg = RelativeImagePicker.noImageDoc.querySelector('svg') as SVGSVGElement;

            // change width and height to viewBox
            svg.removeAttribute('width'); svg.removeAttribute('height');
            svg.setAttribute('viewBox', '0 0 48 48');
        }

        svg ??= RelativeImagePicker.noImageDoc.querySelector('svg') as SVGSVGElement;
        if (!svg) throw new Error('Could not find the SVG element in the SVG document.');

        this.noImageElem = svg.cloneNode(true) as SVGSVGElement;
        this.noImageElem.classList.add('js-relative-image-picker--no-image');

        this.imageElem?.before(this.noImageElem);

        this.imageElem?.src ? this.showImage() : this.hideImage();
    }

    hideImage() {
        if (this.imageElem) {
            this.imageElem.style.display = 'none';
            this.imageElem.ariaDisabled = 'true';
            this.imageElem.ariaHidden = 'true';
        }
        if (this.noImageElem) {
            this.noImageElem.style.display = 'block';
            this.noImageElem.ariaDisabled = 'false';
            this.noImageElem.ariaHidden = 'false';
        }
    }

    showImage() {
        if (this.imageElem) {
            this.imageElem.style.display = 'block';
            this.imageElem.ariaDisabled = 'false';
            this.imageElem.ariaHidden = 'false';
        }
        if (this.noImageElem) {
            this.noImageElem.style.display = 'none';
            this.noImageElem.ariaDisabled = 'true';
            this.noImageElem.ariaHidden = 'true';
        }
    }

    lastValue: string = '';
    override async onChange() {
        if (this.lastValue === this.element.value) return;
        this.lastValue = this.element.value;

        super.onChange();

        const dir = this.directory;

        if (!this.imageElem)
            return console.info('The relative image picker does not have an image element to update.', this);

        if (!dir) {
            this.hideImage();
            return console.info('The relative image picker does not have a directory to update the image from.', this, dir);
        }

        try {
            const fileHandle_ = dir.getFile(this.element.value);
            const [fileHandle, fs] = await Promise.all([fileHandle_, loadFS()]);

            if (!fileHandle || fileHandle instanceof fs.InvalidNameError) {
                this.hideImage();
                return console.info('The relative image picker does not have a file handle to update the image with.', this);
            }

            this.imageElem.src = await fs.readFileAsDataURI(fileHandle);
            this.showImage();
        } catch {
            this.hideImage();
        }
    }
}
bcdComponents.push(RelativeImagePicker);


/*$$$$$\              $$\       $$\     $$\                                      $$$$$$\            $$\       $$\
$$  __$$\             $$ |      $$ |    \__|                                    $$  __$$\           \__|      $$ |
$$ /  \__| $$$$$$\  $$$$$$\   $$$$$$\   $$\ $$$$$$$\   $$$$$$\   $$$$$$$\       $$ /  \__| $$$$$$\  $$\  $$$$$$$ |
\$$$$$$\  $$  __$$\ \_$$  _|  \_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|      $$ |$$$$\ $$  __$$\ $$ |$$  __$$ |
 \____$$\ $$$$$$$$ |  $$ |      $$ |    $$ |$$ |  $$ |$$ /  $$ |\$$$$$$\        $$ |\_$$ |$$ |  \__|$$ |$$ /  $$ |
$$\   $$ |$$   ____|  $$ |$$\   $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\       $$ |  $$ |$$ |      $$ |$$ |  $$ |
\$$$$$$  |\$$$$$$$\   \$$$$  |  \$$$$  |$$ |$$ |  $$ |\$$$$$$$ |$$$$$$$  |      \$$$$$$  |$$ |      $$ |\$$$$$$$ |
 \______/  \_______|   \____/    \____/ \__|\__|  \__| \____$$ |\_______/        \______/ \__|      \__| \_______|
                                                      $$\   $$ |
                                                      \$$$$$$  |
                                                       \_____*/


interface settingsGridObj {
    type: 'bool'|'string'
    name: string,
    tooltip?: string | {
        text: string,
        position: 'top'|'bottom'|'left'|'right'
    };
    options?: Record<string, string>,
}

const settingsToUpdate: (() => unknown)[] = [];
export function updateSettings() {
    for (let i = 0; i < settingsToUpdate.length; i++)
        settingsToUpdate[i]!();
}

type settingsGrid = Record<string, settingsGridObj>
export class SettingsGrid {
    static readonly asString = 'BCD - Settings Grid';
    static readonly cssClass = 'js-settings-grid';

    element: HTMLElement;
    settingTemplate: DocumentFragment;
    settingsPath: string[];
    settings: settingsGrid;
    constructor(element: HTMLElement) {
        this.element = element;
        registerUpgrade(element, this, null, false, true);

        this.settings = JSON.parse(element.textContent ?? '') as settingsGrid;
        element.textContent = '';

        const settingsElemID = element.getAttribute("data-templateID");
        if (!settingsElemID) throw new Error("Settings Grid is missing the data-templateID attribute!");

        const settingTemplate = document.getElementById(settingsElemID);
        if (!settingTemplate || !(settingTemplate instanceof HTMLTemplateElement)) throw new Error(`Settings Grid cannot find a TEMPLATE element with the ID "${settingsElemID}"!`);

        this.settingTemplate = settingTemplate.content;

        this.settingsPath = element.getAttribute("data-settingsPath")?.split('.') ?? [];

        for (const [key, settings] of Object.entries(this.settings))
            this.createSetting(key, settings);

        this.element.hidden = false;
    }

    createSetting(key: string, settings: settingsGridObj) {
        const children = this.settingTemplate.children;
        if (!children[0]) throw new Error("Settings Grid template is missing a root element!");
        //console.log(children);

        for (const child of children) {
            const clone = child.cloneNode(true) as HTMLElement;

            this.element.appendChild(clone);
            this.upgradeElement(clone, key, settings);

            // If the node wasn't removed, give 'er a tooltip
            if (clone.parentElement && settings.tooltip) this.createTooltip(clone, settings.tooltip);
        }
    }

    createTooltip(element: HTMLElement, tooltip: NonNullable<settingsGridObj['tooltip']>) {
        //<div class="js-bcd-tooltip" tooltip-relation="proceeding" tooltip-position="bottom"><p>
        //    TOOLTIP INNER HTML
        //</p></div>
        const elem = document.createElement('div');
        elem.classList.add('js-bcd-tooltip');
        elem.setAttribute('tooltip-relation', 'proceeding');
        elem.setAttribute('tooltip-position', typeof tooltip === 'object' ? tooltip.position : 'bottom');
        elem.appendChild(document.createElement('p')).innerHTML = typeof tooltip === 'object' ? tooltip.text : tooltip;

        element.insertAdjacentElement('afterend', elem);
        mdl.componentHandler.upgradeElement(elem);
    }

    upgradeElement(element: Element, key: string, settings: settingsGridObj) {
        if (!(element && 'getAttribute' in element)) return ;//console.error("A Settings Grid element was not actually an element!", element);

        const filterType = element.getAttribute('data-setting-filter');             // es lint-disable-next-line sonarjs/no-nested-template-literals
        //console.log(`Upgrading child with type ${filterType ? `${filterType}:`:''}${displayType}`, element, settings);

        if (filterType && filterType !== settings.type) return element.remove();//console.warn("Removing element from tree:", (element.remove(), element));

        for (const child of element.children) this.upgradeElement(child, key, settings);

        const displayType = element.getAttribute('data-setting-display');
        if (!displayType) return ;//console.warn('A Settings Grid element is missing the `data-setting-display` attribute!', element);

        switch(displayType) {
            case('id'):
                element.id = `setting--${key}`;
                break;

            case('label'):
                element.innerHTML = settings.name;
                break;

            case('checkbox'):
                if (element instanceof HTMLInputElement) element.checked = !!this.getSetting(key, true);
                else throw new Error("Settings Grid template has a checkbox that is not an INPUT element!");

                registerForEvents(element, {change: (() => this.setSetting(key, element.checked)).bind(this)});
                settingsToUpdate.push(() => {
                    if (element.checked !== !!this.getSetting(key))
                        element.click();
                });
                break;

            case('dropdown'):
                element.classList.add(BCDSettingsDropdown.cssClass);
                element.setAttribute('data-options', JSON.stringify(settings.options));
                element.setAttribute('data-settings-path',  JSON.stringify(this.settingsPath));
                element.setAttribute('data-setting',  key);
                break;

            default:
                console.warn(`A Settings Grid element has an unknown display type: ${displayType}`, element);
        }

        //console.log(`Upgraded element with type ${displayType}. Passing off to MDL component handler...`);
        mdl.componentHandler.upgradeElement(element);
        //console.log(`Fully upgraded element with type ${displayType}!`);
    }

    getSetting<TReturnValue = string|boolean|number|null>(key: string|number, suppressError = false): TReturnValue|undefined { return SettingsGrid.getSetting<TReturnValue>(this.settingsPath, key, suppressError); }

    static getSetting<TReturnValue = string|boolean|number|null>(settingsPath: string[], key: string|number, suppressError = false): TReturnValue|undefined {
        try {
            let currentDir = window;
            for (const dir of settingsPath) //@ts-ignore: The path is dynamically pulled from the HTML document, so it's not possible to know what it will be at compile time
                currentDir = currentDir?.[dir];

            if (currentDir === undefined) throw new Error(`Settings Grid cannot find the settings path "${settingsPath.join('.')}"!`);

            //@ts-ignore:  The path is dynamically pulled from the HTML document, so it's not possible to know what it will be at compile time
            return currentDir[key];
        } catch (e) {
            if (!suppressError) console.error(e);
            return undefined;
        }
    }

    setSetting(key: string|number, value:string|boolean|number|null|undefined, suppressError = false): void { SettingsGrid.setSetting(this.settingsPath, key, value, suppressError); }

    static setSetting(settingsPath: string[], key: string|number, value:string|boolean|number|null|undefined, suppressError = false): void {
        try {
            let currentDir = window;
            for (const dir of settingsPath) //@ts-ignore: The path is dynamically pulled from the HTML document, so it's not possible to know what it will be at compile time
                currentDir = currentDir?.[dir];

            if (currentDir === undefined) throw new Error(`Settings Grid cannot find the settings path "${settingsPath.join('.')}"!`);

            //@ts-ignore: The path is dynamically pulled from the HTML document, so it's not possible to know what it will be at compile time
            return currentDir[key] = value;
        } catch (e) {
            if (!suppressError) console.error(e);
            return undefined;
        }
    }
}
bcdComponents.push(SettingsGrid);

/** Variable to work around the complexities of Constructors and whatnot */
let tempKeyMap = {};
export class BCDSettingsDropdown extends BCDDropdown {
    static readonly asString = 'BCD Settings Dropdown';
    static readonly cssClass = 'js-bcd-settings-dropdown';

    settingsPath:string[] = JSON.parse(this.element_.getAttribute('data-settings-path') ?? '[]');
    settingKey = this.element_.getAttribute('data-setting') ?? '';
    keyMap: Record<string, string>;

    constructor(element: HTMLElement) {
        //console.log('Constructing BCDSettingsDropdown', element);
        super(element, element.previousElementSibling);
        this.keyMap = tempKeyMap;
        //console.log('[BCD-DROPDOWN] Key map is now', this.keyMap);
        //this.selectByString(SettingsGrid.getSetting(this.settingsPath, this.settingKey) ?? '');
        settingsToUpdate.push(() => {
            this.selectByString(SettingsGrid.getSetting(this.settingsPath, this.settingKey) ?? '');
        });
    }

    override selectByString(option: string): void {
        //console.log('[BCD-DROPDOWN] Selecting by string', option, 'aka', this.keyMap?.[option], {keyMap: this.keyMap});
        super.selectByString(this.keyMap[option] ?? option);
    }

    override options(): optionObj {
        const options: optionObj = {};
        Object.entries<string>(JSON.parse(this.element_.getAttribute('data-options') ?? '[]')).forEach(([literalName, prettyName]) => {
            options[prettyName.toString()] = () => {
                SettingsGrid.setSetting(this.settingsPath, this.settingKey, literalName);
            };

            //console.log('[BCD-DROPDOWN] Adding option', literalName, 'aka', prettyName);
           this.keyMap ??= {};
            this.keyMap[literalName] = prettyName;
            //console.log('[BCD-DROPDOWN] Key map is now', this.keyMap);
        });
        tempKeyMap = this.keyMap;

        return options;
    }
}
bcdComponents.push(BCDSettingsDropdown);
window.BCDSettingsDropdown = BCDSettingsDropdown;



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
export function registerBCDComponent(component:BCDComponentI):boolean|Error {
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
export function registerBCDComponents(...components:BCDComponentI[]):void{

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
    if (!randomTextField) throw new Error("No random text field found!");

    const quote = quotes.getRandomQuote();
    randomTextField.innerHTML = typeof quote === "string" ? quote : quote[1]!;

    // =============================================================
    // Import Lazy-Loaded Styles
    // =============================================================
    afterDelay(100, () => {
        const lazyStyles = JSON.parse(`[${document.getElementById('lazy-styles')?.textContent ?? ''}]`) as string[];

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

    // NOTE: This code has been compiled, minified, and relocated to the page HTML itself

    //const footer = document.getElementById('footer') as HTMLDivElement;
    //
    //if (!footer) throw new Error('No main or footer div found!');
    //function resizeMain() {
    //    const footerHeight = (footer!.firstElementChild as HTMLElement)?.offsetHeight ?? 0;
    //    footer!.style.height = `${footerHeight}px`;
    //}
    //const contResizeObserver = new ResizeObserver(resizeMain);
    //resizeMain();
    //contResizeObserver.observe(footer.firstElementChild ?? footer);

    // =============================================================
    // Register for more inclusive invents as a replacement for the `onclick` attribute
    // =============================================================

    afterDelay(150, () => {
        const elements = document.querySelectorAll('[onclick]') as NodeListOf<HTMLElement>;
        for (const element of elements) {
            const funct = element.onclick as EventTypes<HTMLElement>['activate'];
            if (!funct) continue;

            registerForEvents(element, {activate: funct});

            element.onclick = null;
            element.removeAttribute('onclick');
        }
    });

}
window.bcd_init_functions.universal = bcd_universalJS_init;
