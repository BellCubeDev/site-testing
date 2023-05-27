import * as mdl from './assets/site/mdl/material.js';
import * as quotes from './universal_quotes.js';
function loadFS() {
    return import('./filesystem-interface.js');
}
window.domParser = new DOMParser();
export function afterDelay(timeout, callback, ...args) {
    return window.setTimeout(callback, timeout, ...(args || []));
}
export function wait(timeout) {
    return new Promise(resolve => afterDelay(timeout, resolve));
}
export class UpdatableObject {
    update() {
        if (this.suppressUpdates)
            return;
        this.suppressUpdates = true;
        this.update_();
        this.suppressUpdates = false;
    }
    update_bound = this.update.bind(this);
    update_() { return; }
    updateFromInput() {
        if (this.suppressUpdates)
            return;
        this.suppressUpdates = true;
        this.updateFromInput_();
        this.suppressUpdates = false;
    }
    updateFromInput_bound = this.updateFromInput.bind(this);
    updateFromInput_() { return; }
    destroy() {
        this.suppressUpdates = true;
        queueMicrotask(() => this.suppressUpdates = true);
        this.destroy_();
    }
    destroy_bound = this.destroy.bind(this);
    destroy_() { return; }
    suppressUpdates = false;
}
export function nestAnimationFrames(num, callback) {
    if (num <= 0)
        return callback();
    requestAnimationFrame(() => nestAnimationFrames(num - 1, callback));
}
export async function animationFrames(num) {
    return new Promise(resolve => nestAnimationFrames(num, resolve));
}
export function anAnimationFrame() {
    return animationFrames(1);
}
export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function trimWhitespace(str, trailingNewline = false) {
    return str.trimStart()
        .trimEnd()
        .replace(/[^\S\n]*$/gm, '')
        + (trailingNewline ? '\n' : '');
}
const keyTypes = {
    'Enter': [[[], 'activate']],
    ' ': [[[], 'activate']],
    'Escape': [[[], 'exit']],
    'Esc': [[[], 'exit']],
    'z': [
        [['ctrl'], 'undo'], [['meta'], 'undo'],
        [['ctrl', 'shift'], 'redo'], [['meta', 'shift'], 'redo']
    ],
    'y': [[['ctrl'], 'redo']],
    's': [[['ctrl'], 'save']],
};
export function registerForEvents(element, events, options) {
    registerForEvents_(element, events, options, false);
}
export function unregisterForEvents(element, events, options) {
    registerForEvents_(element, events, options, true);
}
export const registerForEvents_wrappedFunctions = new Map();
export const registerForEvents_handledKeys = new Map();
function registerForEvents_(element, events, options, unregister = false) {
    let handling = false;
    const setListener = unregister ? element.removeEventListener.bind(element) : element.addEventListener.bind(element);
    function wrapCallback(callback) {
        let f = registerForEvents_wrappedFunctions.get(callback);
        if (!f) {
            f = function (...args) {
                if (handling)
                    return;
                handling = true;
                queueMicrotask(() => handling = false);
                return callback.call(this, ...args);
            };
            registerForEvents_wrappedFunctions.set(callback, f);
        }
        return f;
    }
    events = Object.fromEntries(Object.entries(events).map(([key, value]) => [key, wrapCallback(value)]));
    let handleKey = registerForEvents_handledKeys.get(events);
    if (!handleKey) {
        handleKey = function (ev) {
            if (!(ev instanceof KeyboardEvent))
                return;
            const functionName = keyTypes[ev.key]?.find(([modifiers, _]) => modifiers.every(mod => ev[`${mod}Key`]))?.[1] || 'anyKey';
            const requestedCallback = events[functionName];
            if (requestedCallback && functionName !== 'anyKey') {
                ev.preventDefault();
                ev.stopPropagation();
            }
            const callback = requestedCallback || events['anyKey'];
            callback?.call(element, ev);
        };
        registerForEvents_handledKeys.set(events, handleKey);
    }
    setListener('keydown', handleKey, options);
    for (const evt in events)
        switch (evt) {
            case 'activate':
                setListener(window.clickEvt, events[evt], options);
                break;
            case 'change':
                setListener('change', events[evt], options);
                setListener('input', events[evt], options);
                break;
            case 'dropdownInput':
                setListener('bcd-dropdown-change', events[evt], options);
                break;
            case 'exit': break;
            case 'undo': break;
            case 'redo': break;
            case 'anyKey': break;
        }
}
window.registerForEvents = registerForEvents;
export function setProxies(obj, handler, runOnEach) {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (handler.set) {
        const oldSetter = handler.set;
        const wrappedSetter = (target, prop, value, receiver) => {
            if (prop in target && target[prop] === value)
                return true;
            if (value && typeof value === 'object')
                value = setProxies(value, handler, runOnEach);
            return oldSetter.call(handler, target, prop, value, receiver) ?? true;
        };
        handler.set = wrappedSetter;
    }
    for (const [key, value] of Object.entries(obj)) {
        runOnEach?.(value);
        if (!value || typeof value !== 'object')
            continue;
        obj[key] = new Proxy(setProxies(value, handler, runOnEach), handler);
    }
    return new Proxy(obj, handler);
}
export function randomNumber(min = 0, max = 1, places = 0) {
    const placesMult = Math.pow(10, places);
    return (Math.round((Math.random() * (max - min) + min) * placesMult) / placesMult);
}
window.domParser = new DOMParser();
export function focusAnyElement(element, preventScrolling = true) {
    if (!element || !element.focus)
        return;
    const hadTabIndex = element.hasAttribute('tabindex');
    if (!hadTabIndex)
        element.setAttribute('tabindex', '-8311');
    element.focus({ preventScroll: preventScrolling });
    nestAnimationFrames(2, () => {
        if (!hadTabIndex)
            element.removeAttribute('tabindex');
    });
}
export function copyCode(elem) {
    if (!elem)
        throw new Error("No element provided to copyCode with!");
    const codeElem = elem.parentElement?.querySelector('code');
    if (!codeElem)
        throw new Error("No code element found to copy from!");
    navigator.clipboard.writeText(trimWhitespace(codeElem.textContent ?? '', true));
    const selection = window.getSelection();
    const tempRange = new Range();
    tempRange.selectNode(codeElem);
    selection.removeAllRanges();
    selection.addRange(tempRange);
}
window.copyCode = copyCode;
export function getInputValue(input) {
    return input.value || input.getAttribute('bcdPlaceholder') || input.placeholder || '';
}
function ___getOrCreateChild(tagName) {
    let child = this.getElementsByTagName(tagName)[0];
    if (!child) {
        const doc = this instanceof Document ? this : this.ownerDocument;
        child = doc.createElement(tagName, { is: tagName });
        this.appendChild(child);
    }
    return child;
}
Element.prototype.getOrCreateChildByTag = ___getOrCreateChild;
Document.prototype.getOrCreateChildByTag = ___getOrCreateChild;
function ___removeChildByTag(tagName, count = 1) {
    const children = [...this.getElementsByTagName(tagName)];
    let removedCount = 0;
    for (let i = 0; removedCount <= count && i < children.length; i++) {
        const child = children[i];
        if (!child || child.tagName !== tagName)
            continue;
        child.remove();
        removedCount++;
    }
}
Element.prototype.removeChildByTag = ___removeChildByTag;
Document.prototype.removeChildByTag = ___removeChildByTag;
function ___moveItem(item, newAdjacentItem, relativePosition = 'below') {
    if (!this.has(item) || !this.has(newAdjacentItem))
        return false;
    const arr = [...this];
    const itemIndex = arr.indexOf(item);
    const adjacentIndex = arr.indexOf(newAdjacentItem);
    if (itemIndex === -1 || adjacentIndex === -1)
        return false;
    arr.splice(itemIndex, 1);
    arr.splice(adjacentIndex + (relativePosition === 'below' ? 1 : 0), 0, item);
    this.clear();
    arr.forEach(i => this.add(i));
    return true;
}
Set.prototype.moveItem = ___moveItem;
function ___moveIndex(item, newIndex) {
    if (!this.has(item))
        return false;
    const arr = [...this];
    const itemIndex = arr.indexOf(item);
    if (itemIndex === -1)
        return false;
    if (newIndex < 0)
        newIndex = arr.length + newIndex;
    arr.splice(itemIndex, 1);
    arr.splice(newIndex, 0, item);
    this.clear();
    arr.forEach(i => this.add(i));
    return true;
}
Set.prototype.moveIndex = ___moveIndex;
export function getSetIndex(set, index) {
    let i = 0;
    for (const item of set) {
        if (i === index)
            return item;
        i++;
    }
}
function ___getExtends(type) {
    const returnVal = [];
    for (const [, value] of this)
        if (value instanceof type)
            returnVal.push(value);
    return returnVal;
}
export function registerUpgrade(subject, upgrade, target, propagateToTargetChildren = false, propagateToSubjectToChildren = false) {
    forEachChildAndOrParent(subject, propagateToSubjectToChildren, child => {
        if (!child.upgrades) {
            const map = new Map();
            map.getExtends = ___getExtends;
            child.upgrades = map;
        }
        child.upgrades.set(upgrade.constructor, upgrade);
    });
    if (target)
        forEachChildAndOrParent(target, propagateToTargetChildren, child => {
            if (!child.targetingComponents) {
                const map = new Map();
                map.getExtends = ___getExtends;
                child.targetingComponents = map;
            }
            child.targetingComponents.set(upgrade.constructor, upgrade);
        });
}
function forEachChildAndOrParent(start, doChildren, callback) {
    if (doChildren)
        forEachChild(start, callback);
    callback(start);
}
function forEachChild(start, callback) {
    for (let i = 0; i < start.children.length; i++) {
        forEachChild(start.children[i], callback);
        callback(start.children[i]);
    }
}
var strs;
(function (strs) {
    strs["transitionDur"] = "transition-duration";
    strs["animDur"] = "animation-duration";
    strs["marginTop"] = "margin-top";
    strs["classIsOpen"] = "is-open";
    strs["classAdjacent"] = "adjacent";
    strs["classDetailsInner"] = "js-bcd-details-inner";
    strs["errItem"] = "Error Item:";
})(strs || (strs = {}));
window.queryParams = {};
if (window.location.search[0] === '?')
    window.location.search.substring(1).split('&')
        .map(param => param.split('='))
        .forEach(param => window.queryParams[param[0].trim()] = param[1]?.trim() ?? '');
const componentsToRegister = [];
export function registerBCDComponent(component) {
    try {
        mdl.componentHandler.register({
            constructor: component,
            classAsString: component.asString,
            cssClass: component.cssClass,
            widget: false
        });
        mdl.componentHandler.upgradeElements(document.getElementsByClassName(component.cssClass));
    }
    catch (e) {
        console.error("[BCD-Components] Error registering component", component.asString, "with class", component.cssClass, ":\n", e);
        return e;
    }
    return false;
}
export function registerBCDComponents(...components) {
    const componentArr = components.length ? components : componentsToRegister;
    for (let i = 0; i < componentArr.length; i++) {
        registerBCDComponent(componentArr[i]);
    }
}
export class BCD_CollapsibleParent {
    details;
    details_inner;
    summary;
    openIcons90deg;
    self;
    adjacent = false;
    constructor(elm) {
        this.self = elm;
        this.adjacent = elm.classList.contains(strs.classAdjacent);
    }
    isOpen() {
        return this.details.classList.contains(strs.classIsOpen) || this.summary.classList.contains(strs.classIsOpen);
    }
    toggle(doSetDuration = true) {
        if (this.isOpen()) {
            this.close(doSetDuration);
        }
        else {
            this.open(doSetDuration);
        }
    }
    reEval(doSetDuration = true, instant) {
        requestAnimationFrame(() => {
            if (this.isOpen())
                this.open(doSetDuration, instant);
            else
                this.close(doSetDuration, instant);
        });
    }
    stateChangePromise(desiredState) {
        if ((desiredState !== undefined && this.isOpen() === desiredState)
            || getComputedStyle(this.details_inner).transitionDuration === '0s') {
            return new Promise((resolve) => requestAnimationFrame(() => { this.onTransitionEnd(); resolve(); }));
        }
        const transitionEndFunct = this.onTransitionEnd.bind(this);
        return new Promise((resolve) => {
            function listener(event) {
                if (event.propertyName !== 'margin-top')
                    return;
                removeListener();
                afterDelay(10, () => { transitionEndFunct(event); resolve(); });
            }
            this.details_inner.addEventListener('transitionend', listener);
            const details_inner = this.details_inner;
            function removeListener() { details_inner.removeEventListener('transitionend', listener); }
        });
    }
    open(doSetDuration = true, instant = false) {
        const returnVal = this.stateChangePromise(true);
        if (!instant)
            this.evaluateDuration(doSetDuration);
        this.details_inner.ariaHidden = 'false';
        this.details_inner.style.visibility = 'visible';
        BCD_CollapsibleParent.setDisabled(this.details_inner, false, false);
        this.details.classList.add(strs.classIsOpen);
        this.summary.classList.add(strs.classIsOpen);
        nestAnimationFrames(3, () => {
            this.details_inner.style.marginTop = this.details.getAttribute('data-margin-top') || '0';
            if (instant)
                nestAnimationFrames(2, () => this.evaluateDuration.bind(this, doSetDuration, true));
        });
        if (instant)
            return this.instantTransition();
        return returnVal;
    }
    hasClosedFinal = false;
    close(doSetDuration = true, instant = false, final = false, duration) {
        if (this.hasClosedFinal)
            return;
        if (final) {
            this.summary.upgrades.getExtends(BCD_CollapsibleParent)[0].hasClosedFinal = true;
            this.details.upgrades.getExtends(BCD_CollapsibleParent)[0].hasClosedFinal = true;
        }
        if (duration === undefined)
            this.evaluateDuration(doSetDuration, false);
        else
            this.details_inner.style.transitionDuration = `${duration}ms`;
        const returnVal = this.stateChangePromise(false);
        this.details_inner.style.marginTop = `-${this.details_inner.offsetHeight + 32}px`;
        this.details.classList.remove(strs.classIsOpen);
        this.summary.classList.remove(strs.classIsOpen);
        BCD_CollapsibleParent.setDisabled(this.details_inner, true);
        if (instant) {
            nestAnimationFrames(2, () => this.evaluateDuration(doSetDuration, false));
            return this.instantTransition();
        }
        if (final)
            this.summary.style.pointerEvents = 'none';
        return returnVal;
    }
    onTransitionEnd(event) {
        if (event && event.propertyName !== 'margin-top')
            return;
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
    instantTransition() {
        if (this.details_inner) {
            this.details_inner.style.transitionDuration = `0s`;
            this.details_inner.style.animationDuration = `0s`;
            for (const icon of this.openIcons90deg) {
                icon.style.animationDuration = `0s`;
            }
        }
        this.onTransitionEnd();
        return new Promise((r) => r());
    }
    static setDisabled(elm, disabled, allowPointerEvents = true) {
        for (const child of elm.children)
            this.setDisabled(child, disabled);
        const wasDisabled = elm.getAttribute('data-was-disabled');
        const oldTabIndex = elm.getAttribute('data-old-tabindex');
        const forcePointerEvents = elm.getAttribute('data-force-pointer-events');
        if (forcePointerEvents !== null)
            allowPointerEvents = (forcePointerEvents === 'true');
        const forceDisabled = elm.getAttribute('data-force-disabled');
        if (forceDisabled !== null)
            disabled = (forceDisabled === 'true');
        if (disabled) {
            if (wasDisabled === null)
                elm.setAttribute('data-was-disabled', elm.hasAttribute('disabled') ? 'true' : 'false');
            elm.setAttribute('disabled', '');
            elm.ariaDisabled = 'true';
            if (oldTabIndex === null)
                elm.setAttribute('data-old-tabindex', elm.getAttribute('tabindex') || '');
            elm.tabIndex = -1;
        }
        else {
            elm.removeAttribute('data-was-disabled');
            if (wasDisabled === 'true')
                elm.setAttribute('disabled', '');
            else
                elm.removeAttribute('disabled');
            elm.ariaDisabled = wasDisabled === 'true' ? 'true' : 'false';
            if (oldTabIndex !== null || elm.hasAttribute('data-old-tabindex')) {
                oldTabIndex ? elm.setAttribute('tabindex', oldTabIndex) : elm.removeAttribute('tabindex');
                elm.removeAttribute('data-old-tabindex');
            }
        }
        elm.style.pointerEvents = allowPointerEvents ? '' : 'none';
    }
    evaluateDuration(doRun = true, opening = true) {
        if (doRun && this.details_inner) {
            const contentHeight = this.details_inner.offsetHeight;
            this.details_inner.style.transitionDuration = `${(opening ? 250 : 300) + ((opening ? 0.3 : 0.35) * (contentHeight + 32))}ms`;
            for (const icon of this.openIcons90deg) {
                icon.style.transitionDuration = `${250 + (0.15 * (contentHeight + 32))}ms`;
            }
        }
    }
}
export class BCDDetails extends BCD_CollapsibleParent {
    static cssClass = "js-bcd-details";
    static asString = "BellCubicDetails";
    constructor(element) {
        super(element);
        this.details = element;
        this.details_inner = document.createElement('div');
        this.details_inner.classList.add(strs.classDetailsInner);
        const temp_childrenArr = [];
        for (const node of this.details.childNodes) {
            temp_childrenArr.push(node);
        }
        for (const node of temp_childrenArr) {
            this.details_inner.appendChild(node);
        }
        this.details.appendChild(this.details_inner);
        if (this.adjacent) {
            const temp_summary = this.self.previousElementSibling;
            if (!temp_summary || !temp_summary.classList.contains(BCDSummary.cssClass)) {
                console.log(strs.errItem, this);
                throw new TypeError("[BCD-DETAILS] Error: Adjacent Details element must be preceded by a Summary element.");
            }
            this.summary = temp_summary;
        }
        else {
            const temp_summary = this.self.ownerDocument.querySelector(`.js-bcd-summary[for="${this.details.id}"`);
            if (!temp_summary) {
                console.log(strs.errItem, this);
                throw new TypeError("[BCD-DETAILS] Error: Non-adjacent Details elements must have a Summary element with a `for` attribute matching the Details element's id.");
            }
            this.summary = temp_summary;
        }
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');
        const boundReEval = this.reEvalIfClosed.bind(this);
        const observer = new ResizeObserver(boundReEval);
        observer.observe(this.details_inner);
        this.reEval(true, true);
        this.self.classList.add('initialized');
        registerUpgrade(this.self, this, this.summary, true);
    }
    reEvalIfClosed() {
        if (!this.isOpen())
            this.reEval(true, true);
    }
}
componentsToRegister.push(BCDDetails);
export class BCDSummary extends BCD_CollapsibleParent {
    static cssClass = 'js-bcd-summary';
    static asString = 'BellCubicSummary';
    constructor(element) {
        super(element);
        this.summary = element;
        registerForEvents(this.summary, { activate: this.activate.bind(this) });
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');
        if (this.adjacent) {
            const temp_details = this.self.nextElementSibling;
            if (!(temp_details && temp_details.classList.contains(BCDDetails.cssClass))) {
                console.log(strs.errItem, this);
                throw new TypeError("[BCD-SUMMARY] Error: Adjacent Summary element must be proceeded by a Details element.");
            }
            this.details = temp_details;
        }
        else {
            const temp_details = this.self.ownerDocument.getElementById(this.summary.getAttribute('for') ?? '');
            if (!temp_details) {
                console.log(strs.errItem, this);
                throw new TypeError("[BCD-SUMMARY] Error: Non-adjacent Details elements must have a summary element with a `for` attribute matching the Details element's id.");
            }
            this.details = temp_details;
        }
        this.divertedCompletion();
        registerUpgrade(this.self, this, this.details, false, true);
    }
    divertedCompletion() {
        queueMicrotask(() => {
            const temp_inner = this.details.querySelector(`.${strs.classDetailsInner}`);
            if (!temp_inner) {
                this.divertedCompletion();
                return;
            }
            this.details_inner = temp_inner;
            this.reEval(true, true);
            this.self.classList.add('initialized');
        });
    }
    correctFocus(keyDown) {
        if (keyDown)
            focusAnyElement(this.summary);
        else
            return nestAnimationFrames(2, () => {
                this.summary.blur();
            });
    }
    activate(event) {
        if (!event)
            return;
        if ((('pointerType' in event) && !event.pointerType)
            || ('path' in event && event.path && event.path instanceof Array && event.path?.slice(0, 5).some((el) => el.tagName === 'A')))
            return;
        this.toggle();
        this.correctFocus(event instanceof KeyboardEvent);
    }
}
componentsToRegister.push(BCDSummary);
export class PrettyJSON {
    static cssClass = 'js-bcd-prettyJSON';
    static asString = 'bcd_prettyJSON';
    element_;
    constructor(element) {
        registerUpgrade(element, this, null, false, true);
        this.element_ = element;
        const json = JSON.parse(element.textContent ?? '');
        this.element_.textContent = JSON.stringify(json, null, 2);
        this.element_.classList.add('initialized');
    }
}
componentsToRegister.push(PrettyJSON);
export class BCDModalDialog extends EventTarget {
    static cssClass = 'js-bcd-modal';
    static asString = 'BellCubic Modal';
    static obfuscator;
    static modalsToShow = [];
    static shownModal = null;
    element_;
    closeByClickOutside;
    constructor(element) {
        super();
        registerUpgrade(element, this, null, false, true);
        this.element_ = element;
        this.element_.ariaModal = 'true';
        this.element_.setAttribute('role', 'dialog');
        this.element_.ariaHidden = 'true';
        this.element_.hidden = true;
        const body = document.body ?? document.documentElement.getElementsByTagName('body')[0];
        body.prepend(element);
        if (!BCDModalDialog.obfuscator) {
            BCDModalDialog.obfuscator = document.createElement('div');
            BCDModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.OBFUSCATOR, 'js-bcd-modal-obfuscator');
            body.appendChild(BCDModalDialog.obfuscator);
        }
        this.closeByClickOutside = !this.element_.hasAttribute('no-click-outside');
        afterDelay(1000, function () {
            const closeButtons = this.element_.getElementsByClassName('js-bcd-modal-close');
            for (const button of closeButtons) {
                registerForEvents(button, { activate: this.boundHideFunction });
            }
            if (this.element_.hasAttribute('open-by-default'))
                this.show();
        }.bind(this));
    }
    static evalQueue(delay = 100) {
        if (this.shownModal || !this.modalsToShow.length)
            return;
        const modal = BCDModalDialog.modalsToShow.shift();
        if (!modal)
            return this.evalQueue();
        BCDModalDialog.shownModal = modal;
        afterDelay(delay, modal.show_forReal.bind(modal));
    }
    show() {
        BCDModalDialog.modalsToShow.push(this);
        BCDModalDialog.evalQueue();
        return new Promise((resolve) => {
            this.addEventListener('afterHide', (evt) => {
                if ('detail' in evt && typeof evt.detail === 'string')
                    resolve(evt.detail);
                else
                    resolve(null);
            }, { once: true });
        });
    }
    static beforeShowEvent = new CustomEvent('beforeShow', { cancelable: true, bubbles: false, composed: false });
    static afterShowEvent = new CustomEvent('afterShow', { cancelable: false, bubbles: false, composed: false });
    show_forReal() {
        if (!this.dispatchEvent(BCDModalDialog.beforeShowEvent) || !this.element_.dispatchEvent(BCDModalDialog.beforeShowEvent))
            return;
        BCDModalDialog.obfuscator.classList.add(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        registerForEvents(BCDModalDialog.obfuscator, { activate: this.boundHideFunction });
        this.element_.ariaHidden = 'false';
        this.element_.hidden = false;
        if ('show' in this.element_)
            this.element_.show();
        else
            this.element_.setAttribute('open', '');
        if (this.dispatchEvent(BCDModalDialog.afterShowEvent))
            this.element_.dispatchEvent(BCDModalDialog.afterShowEvent);
    }
    static getBeforeHideEvent(msg = null) { return new CustomEvent('beforeHide', { cancelable: true, bubbles: false, composed: false, detail: msg }); }
    static getAfterHideEvent(msg = null) { return new CustomEvent('afterHide', { cancelable: false, bubbles: false, composed: false, detail: msg }); }
    boundHideFunction = this.hide.bind(this);
    hide(evt) {
        let msg = null;
        if (evt && evt.currentTarget instanceof Element)
            msg = evt.currentTarget.getAttribute('data-modal-message');
        if (evt)
            evt.stopImmediatePropagation();
        if (!this.dispatchEvent(BCDModalDialog.getBeforeHideEvent(msg)) || !this.element_.dispatchEvent(BCDModalDialog.getBeforeHideEvent(msg)))
            return;
        this.element_.ariaHidden = 'true';
        if ('close' in this.element_)
            this.element_.close();
        else
            this.element_.removeAttribute('open');
        this.element_.hidden = true;
        BCDModalDialog.obfuscator.classList.remove(mdl.MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        BCDModalDialog.obfuscator.removeEventListener(window.clickEvt, this.boundHideFunction);
        BCDModalDialog.shownModal = null;
        if (this.dispatchEvent(BCDModalDialog.getAfterHideEvent(msg)))
            this.element_.dispatchEvent(BCDModalDialog.getAfterHideEvent(msg));
        BCDModalDialog.evalQueue();
    }
}
componentsToRegister.push(BCDModalDialog);
export var menuCorners;
(function (menuCorners) {
    menuCorners["unaligned"] = "mdl-menu--unaligned";
    menuCorners["topLeft"] = "mdl-menu--bottom-left";
    menuCorners["topRight"] = "mdl-menu--bottom-right";
    menuCorners["bottomLeft"] = "mdl-menu--top-left";
    menuCorners["bottomRight"] = "mdl-menu--top-right";
})(menuCorners || (menuCorners = {}));
export class BCDDropdown extends mdl.MaterialMenu {
    doReorder;
    options_;
    options_keys;
    selectedOption = '';
    element_;
    selectionTextElements;
    constructor(element, buttonElement, doReorder = true) {
        super(element);
        this.element_ = element;
        this.doReorder = doReorder;
        if (doReorder)
            this.Constant_.CLOSE_TIMEOUT = 0;
        if (this.forElement_) {
            this.forElement_?.removeEventListener(window.clickEvt, this.boundForClick_);
            this.forElement_?.removeEventListener('keydown', this.boundForKeydown_);
        }
        if (buttonElement && buttonElement !== this.forElement_) {
            this.forElement_ = buttonElement;
        }
        if (this.forElement_) {
            this.forElement_.ariaHasPopup = 'true';
            this.forElement_.addEventListener(window.clickEvt, this.boundForClick_);
            this.forElement_.addEventListener('keydown', this.boundForKeydown_);
        }
        const tempOptions = this.options();
        this.options_ = tempOptions;
        this.options_keys = Object.keys(this.options_);
        this.selectedOption = this.options_keys[0] ?? '';
        for (const option of this.options_keys) {
            this.element_.appendChild(this.createOption(option));
        }
        this.selectionTextElements = this.forElement_?.getElementsByClassName('bcd-dropdown_value');
        this.hide();
        this.updateOptions();
        this.element_.addEventListener('focusout', this.focusOutHandler.bind(this));
        registerUpgrade(element, this, this.forElement_, true, true);
    }
    focusOutHandler(evt) {
        if (evt.relatedTarget?.parentElement !== this.element_)
            this.hide();
    }
    selectByString(option) {
        if (this.options_keys.includes(option))
            this.selectedOption = option;
        else
            console.warn("[BCD-DROPDOWN] Attempted to select an option that does not exist:", option);
        this.updateOptions();
    }
    updateOptions() {
        const children = [...this.element_.getElementsByTagName('li')];
        if (this.doReorder) {
            const goldenChild = children.find((elm) => elm.textContent === this.selectedOption);
            if (!goldenChild) {
                console.log("[BCD-DROPDOWN] Erroring instance:", this);
                throw new Error('Could not find the selected option in the dropdown.');
            }
            this.makeSelected(goldenChild);
        }
        const demonChildren = this.doReorder ? children.filter((elm) => elm.textContent !== this.selectedOption) : children;
        demonChildren.sort((a, b) => this.options_keys.indexOf(a.textContent ?? '') - this.options_keys.indexOf(b.textContent ?? ''));
        for (const child of demonChildren) {
            this.element_.removeChild(child);
            this.makeNotSelected(child);
            this.element_.appendChild(child);
        }
    }
    createOption(option, clickCallback, addToList = false) {
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
        if (temp_clickCallback)
            registerForEvents(li, { activate: temp_clickCallback.bind(this) });
        this.onCreateOption?.(option);
        return li;
    }
    onItemSelected(option) {
        this.selectedOption = option.textContent ?? '';
        this.element_.dispatchEvent(new CustomEvent('bcd-dropdown-change', { detail: { dropdown: this, option: this.selectedOption } }));
        this.updateOptions();
    }
    makeSelected(option) {
        if (this.doReorder)
            option.classList.add('mdl-menu__item--full-bleed-divider');
        option.blur();
        for (const elm of this.selectionTextElements ?? []) {
            elm.textContent = option.textContent;
        }
    }
    makeNotSelected(option) {
        option.classList.remove('mdl-menu__item--full-bleed-divider');
    }
    _optionElements;
    get optionElements() { return this._optionElements ??= this.element_.getElementsByTagName('li'); }
    hasShownOrHiddenThisFrame = false;
    show(evt) {
        if (this.hasShownOrHiddenThisFrame)
            return;
        this.hasShownOrHiddenThisFrame = true;
        requestAnimationFrame(() => this.hasShownOrHiddenThisFrame = false);
        if (this.element_.ariaHidden === 'false')
            return;
        if (evt instanceof KeyboardEvent || evt instanceof PointerEvent && evt.pointerId === -1 || 'mozInputSource' in evt && evt.mozInputSource !== 1)
            this.optionElements[0]?.focus();
        this.element_.ariaHidden = 'false';
        this.element_.removeAttribute('disabled');
        if (this.forElement_)
            this.forElement_.ariaExpanded = 'true';
        for (const item of this.optionElements)
            item.tabIndex = 0;
        this.forElement_?.targetingComponents?.get(BCDTooltip)?.hide();
        super.show(evt);
    }
    hide() {
        if (this.hasShownOrHiddenThisFrame)
            return;
        this.hasShownOrHiddenThisFrame = true;
        requestAnimationFrame(() => this.hasShownOrHiddenThisFrame = false);
        if (this.element_.ariaHidden === 'true')
            return;
        this.optionElements[0]?.blur();
        this.element_.ariaHidden = 'true';
        this.element_.setAttribute('disabled', '');
        if (this.forElement_)
            this.forElement_.ariaExpanded = 'false';
        for (const item of this.optionElements)
            item.tabIndex = -1;
        super.hide();
    }
}
export class bcdDropdown_AwesomeButton extends BCDDropdown {
    static asString = 'BCD - Debugger\'s All-Powerful Button';
    static cssClass = 'js-bcd-debuggers-all-powerful-button';
    constructor(element) {
        super(element, undefined, false);
    }
    options() {
        return {
            'View Debug Page': () => { document.getElementById('debug-link')?.click(); },
            'Toggle Page Monochrome': () => {
                let [, start, percentage, end] = document.body.style.filter.match(/(.*)grayscale\((.*?)\)(.*)/) ?? [];
                start ??= '';
                percentage ??= '';
                end ??= '';
                document.body.style.filter = `${start}grayscale(${percentage === '100%' ? '0%' : '100%'})${end}`;
            },
        };
    }
}
componentsToRegister.push(bcdDropdown_AwesomeButton);
export class BCDTabButton extends mdl.MaterialButton {
    static asString = 'BCD - Tab List Button';
    static cssClass = 'js-tab-list-button';
    static anchorToSet = '';
    element_;
    boundTab;
    name = '';
    setAnchor = false;
    constructor(element) {
        if (element.tagName !== 'BUTTON')
            throw new TypeError('A BellCubic Tab Button must be created directly from a <button> element.');
        const name = element.getAttribute('name');
        if (!name)
            throw new TypeError('A BellCubic Tab Button must have a name attribute.');
        const boundTab = document.querySelector(`div.tab-content[name="${name}"]`);
        if (!boundTab)
            throw new TypeError(`Could not find a tab with the name "${name}".`);
        if (!boundTab.parentElement)
            throw new TypeError(`Tab with name "${name}" has no parent element!`);
        element.textContent = name;
        element.setAttribute('type', 'button');
        super(element);
        registerUpgrade(element, this, boundTab, false, true);
        this.element_ = element;
        this.boundTab = boundTab;
        this.name = name;
        const entry = window.performance.getEntriesByType("navigation")?.[0];
        this.setAnchor = element.parentElement?.hasAttribute('do-tab-anchor') ?? false;
        registerForEvents(this.element_, { activate: this.activate.bind(this) });
        if (entry && 'type' in entry && entry.type === 'reload')
            this.makeSelected(0);
        else if (this.setAnchor && window.location.hash.toLowerCase() === `#tab-${name}`.toLowerCase())
            queueMicrotask(this.makeSelected.bind(this));
        else
            this.makeSelected(0);
    }
    findTabNumber(button_) {
        const button = button_ ?? this.element_;
        return [...(button.parentElement?.children ?? [])].indexOf(button);
    }
    makeSelected(tabNumber_) {
        const tabNumber = tabNumber_ ?? this.findTabNumber();
        if (tabNumber === -1)
            throw new Error('Could not find the tab number.');
        const siblingsAndSelf = [...(this.element_.parentElement?.children ?? [])];
        if (!siblingsAndSelf[tabNumber] || siblingsAndSelf[tabNumber].classList.contains('active'))
            return;
        for (const sibling of siblingsAndSelf) {
            if (sibling === this.element_) {
                sibling.classList.add('active');
                sibling.setAttribute('aria-pressed', 'true');
                sibling.setAttribute('aria-selected', 'true');
            }
            else {
                sibling.classList.remove('active');
                sibling.setAttribute('aria-pressed', 'false');
                sibling.setAttribute('aria-selected', 'false');
            }
        }
        if (!this.boundTab.parentElement)
            return;
        const tab_siblingsAndTab = [...this.boundTab.parentElement.children];
        for (const tab of tab_siblingsAndTab) {
            if (tab === this.boundTab) {
                tab.classList.add('active');
                tab.classList.remove('tab-content--hidden');
                if ('inert' in tab)
                    tab.inert = false;
                tab.setAttribute('aria-hidden', 'false');
                tab.removeAttribute('disabled');
                tab.removeAttribute('tabindex');
                this.boundTab.parentElement.style.marginLeft = `-${tabNumber}00vw`;
            }
            else {
                tab.classList.remove('active');
                function addHidden() {
                    if (tab.classList.contains('active'))
                        return;
                    tab.classList.add('tab-content--hidden');
                    if ('inert' in tab)
                        tab.inert = true;
                }
                tab.parentElement.addEventListener('transitionend', addHidden, { once: true });
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
            BCDTabButton.anchorToSet = tabNumber == 0 ? '' : `#tab-${this.name}`.toLowerCase();
            BCDTabButton.setAnchorIn3AnimFrames();
        }
    }
    static setAnchorIn3AnimFrames() {
        nestAnimationFrames(3, () => {
            if (BCDTabButton.anchorToSet === '')
                window.history.replaceState(null, '', window.location.pathname);
            else
                window.location.hash = BCDTabButton.anchorToSet;
        });
    }
    activate() {
        this.makeSelected();
        this.element_.blur();
    }
}
componentsToRegister.push(BCDTabButton);
export class BCDTooltip {
    static asString = 'BCD - Tooltip';
    static cssClass = 'js-bcd-tooltip';
    relation;
    position = 'top';
    element;
    boundElement;
    gapBridgeElement;
    openDelayMS;
    constructor(element) {
        this.element = element;
        element.setAttribute('role', 'tooltip');
        element.setAttribute('aria-role', 'tooltip');
        this.gapBridgeElement = document.createElement('div');
        this.gapBridgeElement.classList.add('js-bcd-tooltip_gap-bridge');
        this.element.appendChild(this.gapBridgeElement);
        this.openDelayMS = parseInt(element.getAttribute('open-delay-ms') ?? '400');
        const tempRelation = element.getAttribute('tooltip-relation') ?? 'proceeding';
        let tempElement;
        switch (tempRelation) {
            case 'preceding':
                tempElement = element.nextElementSibling;
                break;
            case 'proceeding':
                tempElement = element.previousElementSibling;
                break;
            case 'child':
                tempElement = element.parentElement;
                break;
            case 'selector': {
                const selector = element.getAttribute('tooltip-selector') ?? '';
                tempElement = element.parentElement?.querySelector(selector)
                    ?? document.querySelector(selector);
                break;
            }
            default: throw new Error('Invalid tooltip-relation attribute!');
        }
        this.relation = tempRelation;
        if (!tempElement || !(tempElement instanceof HTMLElement))
            throw new Error('TOOLTIP - Could not find a valid HTML Element to bind to!');
        this.boundElement = tempElement;
        registerUpgrade(element, this, this.boundElement, true, true);
        const tempPos = element.getAttribute('tooltip-position');
        switch (tempPos) {
            case 'top':
            case 'bottom':
            case 'left':
            case 'right':
                this.position = tempPos;
                break;
            default: throw new Error('Invalid tooltip-position attribute!');
        }
        const boundEnter = this.handleHoverEnter.bind(this);
        const boundLeave = this.handleHoverLeave.bind(this);
        const boundTouch = this.handleTouch.bind(this);
        window.addEventListener('contextmenu', boundLeave);
        this.element.addEventListener('contextmenu', (e) => e.stopPropagation());
        this.boundElement.addEventListener('mouseenter', boundEnter);
        this.element.addEventListener('mouseenter', boundEnter);
        this.boundElement.addEventListener('mouseleave', boundLeave);
        this.element.addEventListener('mouseleave', boundLeave);
        this.boundElement.addEventListener('touchstart', boundTouch, { passive: true });
        this.element.addEventListener('touchstart', boundTouch, { passive: true });
        this.boundElement.addEventListener('touchmove', boundTouch, { passive: true });
        this.element.addEventListener('touchmove', boundTouch, { passive: true });
        this.boundElement.addEventListener('touchend', boundTouch, { passive: true });
        this.element.addEventListener('touchend', boundTouch, { passive: true });
        this.boundElement.addEventListener('touchcancel', boundTouch, { passive: true });
        this.element.addEventListener('touchcancel', boundTouch, { passive: true });
    }
    handleTouch(event) {
        if (event.targetTouches.length > 0)
            this.handleHoverEnter(undefined, true);
        else
            this.handleHoverLeave();
    }
    handleHoverEnter(event, bypassWait) {
        const targetElement = event instanceof MouseEvent ? document.elementFromPoint(event?.x ?? 0, event?.y ?? 0) : event?.target;
        if (targetElement instanceof Element) {
            for (const [, instance] of targetElement.upgrades ?? [])
                if (instance instanceof BCDDropdown)
                    return;
            for (const [, instance] of targetElement.targetingComponents ?? [])
                if (instance instanceof BCDDropdown && instance.container_.classList.contains('is-visible'))
                    return;
        }
        this.showPart1();
        afterDelay(bypassWait ? 0 : 600, function () {
            if (!this.element.classList.contains('active_'))
                return;
            this.showPart2();
        }.bind(this));
    }
    showPart1() {
        this.element.classList.add('active_');
        registerForEvents(window, { exit: this.hide_bound });
    }
    showPart2() {
        this.element.classList.add('active');
        this.element.addEventListener('transitionend', this.setPosition.bind(this), { once: true });
        this.setPosition();
    }
    show() {
        this.showPart1();
        this.showPart2();
    }
    handleHoverLeave(event) { this.hide(); }
    hide() {
        this.element.classList.remove('active_');
        afterDelay(10, () => {
            if (!this.element.classList.contains('active_'))
                this.element.classList.remove('active');
        });
    }
    hide_bound = this.hide.bind(this);
    setPosition() {
        this.element.style.transform = 'none !important';
        this.element.style.transition = 'none !important';
        const tipStyle = window.getComputedStyle(this.element);
        tipStyle.transition;
        tipStyle.transform;
        const elemRect = this.boundElement.getBoundingClientRect();
        const tipRect = { width: this.element.offsetWidth, height: this.element.offsetHeight };
        let top = elemRect.top + (elemRect.height / 2);
        const marginTop = tipRect.height / -2;
        let left = elemRect.left + (elemRect.width / 2);
        const marginLeft = tipRect.width / -2;
        switch (this.position) {
            case 'top':
            case 'bottom':
                this.gapBridgeElement.style.height = '17px';
                this.gapBridgeElement.style.width = `${Math.max(tipRect.width, elemRect.width)}px`;
                this.gapBridgeElement.style.left = `${Math.min(elemRect.left, left + marginLeft) - left - marginLeft}px`;
                if (left + marginLeft < 8)
                    left += 8 - left - marginLeft;
                this.element.style.left = `${left}px`;
                this.element.style.marginLeft = `${marginLeft}px`;
                break;
            case 'left':
            case 'right':
                top += 8 - top - marginTop;
                this.gapBridgeElement.style.height = `${Math.max(tipRect.height, elemRect.height)}px`;
                this.gapBridgeElement.style.width = '17px';
                this.gapBridgeElement.style.top = `${Math.min(elemRect.top, top + marginTop) - top - marginTop}px`;
                if (top + marginTop < 8)
                    top += 8 - top - marginTop;
                this.element.style.top = `${top}px`;
                this.element.style.marginTop = `${marginTop}px`;
                break;
        }
        switch (this.position) {
            case 'top':
                this.element.style.top = `${elemRect.top - tipRect.height - 16}px`;
                this.gapBridgeElement.style.top = `${16 + tipRect.height}px`;
                break;
            case 'bottom':
                this.element.style.top = `${elemRect.top + elemRect.height + 16}px`;
                this.gapBridgeElement.style.top = `-16px`;
                break;
            case 'left':
                this.element.style.left = `${elemRect.left - tipRect.width - 16}px`;
                this.gapBridgeElement.style.left = `${16 + tipRect.width}px`;
                break;
            case 'right':
                this.element.style.left = `${elemRect.left + elemRect.width + 16}px`;
                this.gapBridgeElement.style.left = `-16px`;
        }
        this.element.style.transform = '';
        this.element.style.transition = '';
    }
}
componentsToRegister.push(BCDTooltip);
export class bcdDynamicTextArea_base {
    element;
    constructor(element) {
        registerUpgrade(element, this, null, false, true);
        this.element = element;
        this.adjust();
        const boundAdjust = this.adjust.bind(this);
        registerForEvents(this.element, { change: boundAdjust });
        const resizeObserver = new ResizeObserver(boundAdjust);
        resizeObserver.observe(this.element);
        requestAnimationFrame(boundAdjust);
    }
}
export class bcdDynamicTextAreaHeight extends bcdDynamicTextArea_base {
    static asString = 'BCD - Dynamic TextArea - Height';
    static cssClass = 'js-dynamic-textarea-height';
    constructor(element) {
        super(element);
    }
    adjust() {
        this.element.style.height = '';
        getComputedStyle(this.element).height;
        const paddingPX = parseInt(this.element.getAttribute('paddingPX') ?? '0');
        if (isNaN(paddingPX)) {
            console.warn('The paddingPX attribute of the dynamic text area is not a number:', this);
        }
        this.element.style.height = `${this.element.scrollHeight + paddingPX}px`;
    }
}
componentsToRegister.push(bcdDynamicTextAreaHeight);
export class bcdDynamicTextAreaWidth extends bcdDynamicTextArea_base {
    static asString = 'BCD - Dynamic TextArea - Width';
    static cssClass = 'js-dynamic-textarea-width';
    constructor(element) {
        super(element);
        new ResizeObserver(this.adjust.bind(this)).observe(this.element);
    }
    adjust() {
        this.element.style.width = '';
        getComputedStyle(this.element).width;
        const paddingPX = parseInt(this.element.getAttribute('paddingPX') ?? '0');
        if (isNaN(paddingPX)) {
            console.warn('The paddingPX attribute of the dynamic text area is not a number:', this);
        }
        this.element.style.width = `min(${this.element.scrollWidth + paddingPX}px, 100cqmin)`;
    }
}
componentsToRegister.push(bcdDynamicTextAreaWidth);
class RelativeFilePicker {
    static asString = 'BCD - Relative File Picker';
    static cssClass = 'js-relative-file-picker';
    element;
    button;
    relativeTo;
    get directory() {
        if (!this.relativeTo)
            return undefined;
        if ('handle' in this.relativeTo)
            return this.relativeTo;
        if ('directory' in this.relativeTo)
            return this.relativeTo.directory;
        return SettingsGrid.getSetting(this.relativeTo, 'directory');
    }
    constructor(element, relativeTo) {
        this.element = element;
        this.relativeTo = relativeTo;
        if (!relativeTo) {
            const relativeToAttr = element.getAttribute('relative-to');
            if (!relativeToAttr)
                throw new Error('The relative file picker must have a relative-to attribute or have a folder specified at creation.');
            this.relativeTo = relativeToAttr.split('.');
        }
        registerUpgrade(element, this, null, false, true);
        registerForEvents(this.element, { change: this.boundOnChange });
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.classList.add('mdl-button', 'mdl-js-button', 'mdl-button--fab', 'mdl-js-ripple-effect', 'js-relative-file-picker--button');
        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.textContent = 'edit_document';
        this.button.appendChild(icon);
        this.element.after(this.button);
        registerForEvents(this.button, { activate: this.boundOnButtonClick });
    }
    onChange() {
    }
    boundOnChange = this.onChange.bind(this);
    async onButtonClick() {
        const fs = await import('./filesystem-interface.js');
        const relativeTo = this.relativeTo instanceof fs.BellFolder ? this.relativeTo : this.directory;
        if (!relativeTo)
            return console.warn('The relative file picker has no relative-to folder specified', this);
        let fileHandle;
        try {
            [fileHandle] = await relativeTo.openFilePicker();
        }
        catch (e) {
            if (e && e instanceof DOMException && e.name === 'AbortError')
                return;
            console.warn('The file picker threw some sort of error', e);
            return;
        }
        if (!fileHandle)
            return console.warn('The file picker returned no file', this);
        const nameArr = await this.directory?.resolveChildPath(fileHandle, true);
        if (!nameArr)
            return console.debug('The file picker returned a file that is not in the specified directory', fileHandle, this.directory);
        this.element.value = nameArr.join('/');
        this.element.dispatchEvent(new Event('change'));
    }
    boundOnButtonClick = this.onButtonClick.bind(this);
}
componentsToRegister.push(RelativeFilePicker);
class RelativeImagePicker extends RelativeFilePicker {
    static asString = 'BCD - Relative Image Picker';
    static cssClass = 'js-relative-image-picker';
    imageElem;
    noImageElem;
    relation;
    static noImageDoc;
    constructor(element, relativeTo) {
        super(element, relativeTo);
        this.relation = element.getAttribute('relation') ?? 'previous';
        switch (this.relation) {
            case 'previous':
                this.imageElem = element.parentElement.previousElementSibling;
                break;
            case 'next':
                this.imageElem = element.parentElement.nextElementSibling;
                break;
            case 'parent':
                this.imageElem = element.parentElement;
                break;
            case 'selector': {
                const selector = element.getAttribute('selector');
                if (!selector)
                    throw new Error('The relative image picker must have a selector attribute if the relation is set to selector.');
                this.imageElem = element.parentElement.querySelector(selector)
                    || document.querySelector(selector);
                break;
            }
            default:
                throw new Error('The relative image picker must have a relation attribute that is either previous, next, parent, or selector.');
        }
        this.createNoImageElem();
        registerUpgrade(element, this, this.imageElem, true, true);
    }
    async createNoImageElem() {
        RelativeImagePicker.noImageDoc ??= fetch('https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/image/default/48px.svg').then(r => r.text());
        let svg = undefined;
        if (RelativeImagePicker.noImageDoc instanceof Promise) {
            const str = await RelativeImagePicker.noImageDoc;
            RelativeImagePicker.noImageDoc = new DOMParser().parseFromString(str, 'text/html');
            svg = RelativeImagePicker.noImageDoc.querySelector('svg');
            if (!svg.hasAttribute('viewBox'))
                svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width') || '0'} ${svg.getAttribute('height') || '0'}`);
            svg.removeAttribute('width');
            svg.removeAttribute('height');
        }
        svg ??= RelativeImagePicker.noImageDoc.querySelector('svg');
        if (!svg)
            throw new Error('Could not find the SVG element in the SVG document.');
        this.noImageElem = svg.cloneNode(true);
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
    lastValue = '';
    async onChange() {
        if (this.lastValue === this.element.value)
            return;
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
            this.imageElem.src = await fileHandle.at(-1).readAsDataURL();
            this.showImage();
        }
        catch {
            this.hideImage();
        }
    }
}
componentsToRegister.push(RelativeImagePicker);
class DOMSvg {
    static asString = 'BCD - DOM SVG';
    static cssClass = 'js-dom-svg';
    svgSrc;
    element;
    constructor(element) {
        const src = element.getAttribute('src');
        if (!src)
            throw new Error('The DOM SVG must have a src attribute.');
        this.svgSrc = src;
        this.element = element;
        this.initSvg();
    }
    async initSvg() {
        try {
            const svgRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(this.svgSrc)}`, {
                cache: 'force-cache',
            });
            if (!svgRes.ok) {
                this.element.classList.add('js-dom-svg--error', 'js-dom-svg--loaded');
                return this.element.innerHTML = `<p>Could not load the image!</p><br><code>${svgRes.status}: ${svgRes.statusText || (svgRes.status == 408 ? 'Fetching the graphic took too long!' : '')}</code>`;
            }
            const svgTxt = await svgRes.text();
            const svgDoc = window.domParser.parseFromString(svgTxt, 'image/svg+xml');
            const svg = svgDoc.querySelector('svg');
            if (!svg)
                throw new Error('Could not find the SVG element in the SVG document.');
            this.element.appendChild(svg);
            this.element.classList.add('js-dom-svg--loaded');
        }
        catch (e) {
            if (!(e instanceof Error))
                throw e;
            console.warn('Could not load the SVG image.', e);
            this.element.classList.add('js-dom-svg--error', 'js-dom-svg--loaded');
            return this.element.innerHTML = `<p>Could not load the image!</p><br>JavaScript Error: <code>${e.message}</code>`;
        }
    }
}
componentsToRegister.push(DOMSvg);
const settingsToUpdate = [];
export function updateSettings() {
    for (let i = 0; i < settingsToUpdate.length; i++)
        settingsToUpdate[i]();
}
export class SettingsGrid {
    static asString = 'BCD - Settings Grid';
    static cssClass = 'js-settings-grid';
    element;
    settingTemplate;
    settingsPath;
    settings;
    constructor(element) {
        this.element = element;
        registerUpgrade(element, this, null, false, true);
        this.settings = JSON.parse(element.textContent ?? '');
        element.textContent = '';
        const settingsElemID = element.getAttribute("data-templateID");
        if (!settingsElemID)
            throw new Error("Settings Grid is missing the data-templateID attribute!");
        const settingTemplate = document.getElementById(settingsElemID);
        if (!settingTemplate || !(settingTemplate instanceof HTMLTemplateElement))
            throw new Error(`Settings Grid cannot find a TEMPLATE element with the ID "${settingsElemID}"!`);
        this.settingTemplate = settingTemplate.content;
        this.settingsPath = element.getAttribute("data-settingsPath")?.split('.') ?? [];
        for (const [key, settings] of Object.entries(this.settings))
            this.createSetting(key, settings);
        this.element.hidden = false;
    }
    createSetting(key, settings) {
        const children = this.settingTemplate.children;
        if (!children[0])
            throw new Error("Settings Grid template is missing a root element!");
        for (const child of children) {
            const clone = child.cloneNode(true);
            this.element.appendChild(clone);
            this.upgradeElement(clone, key, settings);
            if (clone.parentElement && settings.tooltip)
                this.createTooltip(clone, settings.tooltip);
        }
    }
    createTooltip(element, tooltip) {
        const elem = document.createElement('div');
        elem.classList.add('js-bcd-tooltip');
        elem.setAttribute('tooltip-relation', 'proceeding');
        elem.setAttribute('tooltip-position', typeof tooltip === 'object' ? tooltip.position : 'bottom');
        elem.appendChild(document.createElement('p')).innerHTML = typeof tooltip === 'object' ? tooltip.text : tooltip;
        element.insertAdjacentElement('afterend', elem);
        mdl.componentHandler.upgradeElement(elem);
    }
    upgradeElement(element, key, settings) {
        if (!(element && 'getAttribute' in element))
            return;
        const filterType = element.getAttribute('data-setting-filter');
        if (filterType && filterType !== settings.type)
            return element.remove();
        for (const child of element.children)
            this.upgradeElement(child, key, settings);
        const displayType = element.getAttribute('data-setting-display');
        if (!displayType)
            return;
        switch (displayType) {
            case ('id'):
                element.id = `setting--${key}`;
                break;
            case ('label'):
                element.innerHTML = settings.name;
                break;
            case ('checkbox'):
                if (element instanceof HTMLInputElement)
                    element.checked = !!this.getSetting(key, true);
                else
                    throw new Error("Settings Grid template has a checkbox that is not an INPUT element!");
                registerForEvents(element, { change: (() => this.setSetting(key, element.checked)).bind(this) });
                settingsToUpdate.push(() => {
                    if (element.checked !== !!this.getSetting(key))
                        element.click();
                });
                break;
            case ('dropdown'):
                element.classList.add(BCDSettingsDropdown.cssClass);
                element.setAttribute('data-options', JSON.stringify(settings.options));
                element.setAttribute('data-settings-path', JSON.stringify(this.settingsPath));
                element.setAttribute('data-setting', key);
                break;
            default:
                console.warn(`A Settings Grid element has an unknown display type: ${displayType}`, element);
        }
        mdl.componentHandler.upgradeElement(element);
    }
    getSetting(key, suppressError = false) { return SettingsGrid.getSetting(this.settingsPath, key, suppressError); }
    static getSetting(settingsPath, key, suppressError = false) {
        try {
            let currentDir = window;
            for (const dir of settingsPath)
                currentDir = currentDir?.[dir];
            if (currentDir === undefined)
                throw new Error(`Settings Grid cannot find the settings path "${settingsPath.join('.')}"!`);
            return currentDir[key];
        }
        catch (e) {
            if (!suppressError)
                console.error(e);
            return undefined;
        }
    }
    setSetting(key, value, suppressError = false) { SettingsGrid.setSetting(this.settingsPath, key, value, suppressError); }
    static setSetting(settingsPath, key, value, suppressError = false) {
        try {
            let currentDir = window;
            for (const dir of settingsPath)
                currentDir = currentDir?.[dir];
            if (currentDir === undefined)
                throw new Error(`Settings Grid cannot find the settings path "${settingsPath.join('.')}"!`);
            return currentDir[key] = value;
        }
        catch (e) {
            if (!suppressError)
                console.error(e);
            return undefined;
        }
    }
}
componentsToRegister.push(SettingsGrid);
let tempKeyMap = {};
export class BCDSettingsDropdown extends BCDDropdown {
    static asString = 'BCD Settings Dropdown';
    static cssClass = 'js-bcd-settings-dropdown';
    settingsPath = JSON.parse(this.element_.getAttribute('data-settings-path') ?? '[]');
    settingKey = this.element_.getAttribute('data-setting') ?? '';
    keyMap;
    constructor(element) {
        super(element, element.previousElementSibling);
        this.keyMap = tempKeyMap;
        settingsToUpdate.push(() => {
            this.selectByString(SettingsGrid.getSetting(this.settingsPath, this.settingKey) ?? '');
        });
    }
    selectByString(option) {
        super.selectByString(this.keyMap[option] ?? option);
    }
    options() {
        const options = {};
        Object.entries(JSON.parse(this.element_.getAttribute('data-options') ?? '[]')).forEach(([literalName, prettyName]) => {
            options[prettyName.toString()] = () => {
                SettingsGrid.setSetting(this.settingsPath, this.settingKey, literalName);
            };
            this.keyMap ??= {};
            this.keyMap[literalName] = prettyName;
        });
        tempKeyMap = this.keyMap;
        return options;
    }
}
componentsToRegister.push(BCDSettingsDropdown);
window.BCDSettingsDropdown = BCDSettingsDropdown;
export function bcd_universalJS_init() {
    afterDelay(10, () => registerBCDComponents());
    for (const link of [...document.links]) {
        if (window.layout.drawer_?.contains(link))
            link.rel += " noopener";
        else
            link.rel += " noopener noreferrer";
    }
    const randomTextField = document.getElementById("randomized-text-field");
    if (!randomTextField)
        throw new Error("No random text field found!");
    const quote = quotes.getRandomQuote();
    randomTextField.innerHTML = typeof quote === "string" ? quote : quote[1];
    afterDelay(100, () => {
        const lazyStyles = JSON.parse(`[${document.getElementById('lazy-styles')?.textContent ?? ''}]`);
        for (const style of lazyStyles) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = style;
            document.head.appendChild(link);
        }
        document.documentElement.classList.remove('lazy-styles-not-loaded');
        window.lazyStylesLoaded = true;
    });
    afterDelay(150, () => {
        const elementsWithClickEvt = document.querySelectorAll('[onclick]');
        for (const element of elementsWithClickEvt) {
            const funct = element.onclick;
            if (!funct)
                continue;
            registerForEvents(element, { activate: funct });
            element.onclick = null;
            element.removeAttribute('onclick');
        }
        const buttons = document.querySelectorAll('button');
        function blurElem() { this.blur(); }
        for (const button of buttons) {
            button.addEventListener('mouseup', blurElem);
            button.addEventListener('touchend', blurElem);
        }
    });
    afterDelay(200, () => {
        const headers = document.querySelectorAll(':is(nav, main) :is(h1, h2, h3, h4, h5, h6)');
        for (const header of headers) {
            if (header.id)
                continue;
            header.id = header.textContent?.trim().replace(/['"+=?!@#$%^*]+/gi, '').replace(/&+/gi, 'and').replace(/[^a-z0-9]+/gi, '-').toLowerCase() ?? '';
        }
        const navHeaders = document.querySelectorAll('nav :is(h1, h2, h3, h4, h5, h6)');
        for (const header of navHeaders) {
            if (header.id)
                header.id = `nav-${header.id}`;
        }
        if (window.location.hash.startsWith('#')) {
            if (window.location.hash === '#')
                window.scrollTo(0, 0);
            else {
                const elem = document.getElementById(window.location.hash.substring(1));
                if (elem)
                    elem.scrollIntoView({ behavior: 'smooth' });
                else
                    console.info(`No element with ID "${window.location.hash.substring(1)}" found!`);
            }
        }
    });
    const drawer = document.querySelector('.mdl-layout__drawer');
    drawer.addEventListener('drawerOpen', drawerOpenHandler);
    drawer.addEventListener('drawerClose', drawerCloseHandler);
    if (drawer.classList.contains('is-visible'))
        drawerOpenHandler.call(drawer);
    else
        drawerCloseHandler.call(drawer);
}
window.bcd_init_functions.universal = bcd_universalJS_init;
function drawerOpenHandler() {
    this.removeAttribute('aria-hidden');
    BCD_CollapsibleParent.setDisabled(this, false);
}
function drawerCloseHandler() {
    this.setAttribute('aria-hidden', 'true');
    BCD_CollapsibleParent.setDisabled(this, true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdmVyc2FsLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbInVuaXZlcnNhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssR0FBRyxNQUFNLCtCQUErQixDQUFDO0FBQ3JELE9BQU8sS0FBSyxNQUFNLE1BQU0sdUJBQXVCLENBQUM7QUFHaEQsU0FBUyxNQUFNO0lBQ1gsT0FBTyxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBOEVELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUtuQyxNQUFNLFVBQVUsVUFBVSxDQUFnRCxPQUFlLEVBQUUsUUFBMEIsRUFBRSxHQUFHLElBQTJCO0lBRWpKLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBR0QsTUFBTSxVQUFVLElBQUksQ0FBQyxPQUFlO0lBQ2hDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVELE1BQU0sT0FBZ0IsZUFBZTtJQUNqQyxNQUFNO1FBQ0YsSUFBSSxJQUFJLENBQUMsZUFBZTtZQUFFLE9BQU87UUFDakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUNRLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxPQUFPLEtBQUks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SSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDekY7U0FDSjtJQUVMLENBQUMsQ0FBQyxDQUFDO0lBTUgsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBbUIsQ0FBQztJQUUvRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDekQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBRTNELElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBQUUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUN2RSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFekMsQ0FBQztBQUNELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7QUFHM0QsU0FBUyxpQkFBaUI7SUFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNwQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxTQUFTLGtCQUFrQjtJQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtZGwgZnJvbSAnLi9hc3NldHMvc2l0ZS9tZGwvbWF0ZXJpYWwuanMnO1xuaW1wb3J0ICogYXMgcXVvdGVzIGZyb20gJy4vdW5pdmVyc2FsX3F1b3Rlcy5qcyc7XG5pbXBvcnQgdHlwZSAqIGFzIGZzIGZyb20gJy4vZmlsZXN5c3RlbS1pbnRlcmZhY2UuanMnO1xuXG5mdW5jdGlvbiBsb2FkRlMoKSB7XG4gICAgcmV0dXJuIGltcG9ydCgnLi9maWxlc3lzdGVtLWludGVyZmFjZS5qcycpO1xufVxuXG4vKlxuICAgIFRoYW5rcyB0byBQYXRyaWNrIEdpbGxlc3BpZSBmb3IgdGhlIGdyZWF0IEFTQ0lJIGFydCBnZW5lcmF0b3IhXG4gICAgaHR0cHM6Ly9wYXRvcmprLmNvbS9zb2Z0d2FyZS90YWFnLyNwPWRpc3BsYXkmaD0wJnY9MCZmPUJpZyUyME1vbmV5LW53XG4gICAgLi4ubWFrZXMgdGhpcyBjb2RlICpzbyogbXVjaCBlYXNpZXIgdG8gbWFpbnRhaW4uLi4geW91IGtub3csICdjdXogSSBjYW4gZmluZCBteSBmdW5jdGlvbnMgaW4gVlNDb2RlJ3MgTWluaW1hcFxuXG5cblxuXG4kJFxcICAgJCRcXCAgICQkXFwgICAgICQkXFwgJCRcXCAkJFxcICAgJCRcXCAgICAgJCRcXFxuJCQgfCAgJCQgfCAgJCQgfCAgICBcXF9ffCQkIHxcXF9ffCAgJCQgfCAgICBcXF9ffFxuJCQgfCAgJCQgfCQkJCQkJFxcICAgJCRcXCAkJCB8JCRcXCAkJCQkJCRcXCAgICQkXFwgICQkJCQkJFxcICAgJCQkJCQkJFxcXG4kJCB8ICAkJCB8XFxfJCQgIF98ICAkJCB8JCQgfCQkIHxcXF8kJCAgX3wgICQkIHwkJCAgX18kJFxcICQkICBfX19fX3xcbiQkIHwgICQkIHwgICQkIHwgICAgJCQgfCQkIHwkJCB8ICAkJCB8ICAgICQkIHwkJCQkJCQkJCB8XFwkJCQkJCRcXFxuJCQgfCAgJCQgfCAgJCQgfCQkXFwgJCQgfCQkIHwkJCB8ICAkJCB8JCRcXCAkJCB8JCQgICBfX19ffCBcXF9fX18kJFxcXG5cXCQkJCQkJCAgfCAgXFwkJCQkICB8JCQgfCQkIHwkJCB8ICBcXCQkJCQgIHwkJCB8XFwkJCQkJCQkXFwgJCQkJCQkJCAgfFxuIFxcX19fX19fLyAgICBcXF9fX18vIFxcX198XFxfX3xcXF9ffCAgIFxcX19fXy8gXFxfX3wgXFxfX19fX19ffFxcX19fX19fKi9cblxuaW50ZXJmYWNlIERvY0FuZEVsZW1lbnRJbmplY3Rpb25zIHtcbiAgICAvKiogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgdGFnIG5hbWUgb3IgY3JlYXRlcyBvbmUgaWYgaXQgZG9lcyBub3QgZXhpc3QgKi9cbiAgICBnZXRPckNyZWF0ZUNoaWxkQnlUYWc8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGFnTmFtZTogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcbiAgICBnZXRPckNyZWF0ZUNoaWxkQnlUYWcodGFnTmFtZTogc3RyaW5nKTpFbGVtZW50O1xuXG4gICAgcmVtb3ZlQ2hpbGRCeVRhZzxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0YWdOYW1lOiBLLCBjb3VudD86IG51bWJlcik6IHZvaWQ7XG4gICAgcmVtb3ZlQ2hpbGRCeVRhZyh0YWdOYW1lOiBzdHJpbmcsIGNvdW50PzogbnVtYmVyKTogdm9pZDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBFbGVtZW50IGV4dGVuZHMgRG9jQW5kRWxlbWVudEluamVjdGlvbnMge1xuICAgICAgICB1cGdyYWRlcz86IENvbXBvbmVudE1hcDtcbiAgICAgICAgdGFyZ2V0aW5nQ29tcG9uZW50cz86IENvbXBvbmVudE1hcDtcbiAgICB9XG4gICAgaW50ZXJmYWNlIERvY3VtZW50IGV4dGVuZHMgRG9jQW5kRWxlbWVudEluamVjdGlvbnMge31cblxuICAgIGludGVyZmFjZSBIVE1MRWxlbWVudCBleHRlbmRzIERvY0FuZEVsZW1lbnRJbmplY3Rpb25zIHtcbiAgICAgICAgb25jbGljazogRXZlbnRUeXBlczxIVE1MRWxlbWVudD5bJ2FjdGl2YXRlJ118bnVsbDtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgU2V0PFQ+IHtcbiAgICAgICAgLyoqIENoYW5nZXMgdGhlIHBvc2l0aW9uIG9mIGFuIGl0ZW0gaW4gdGhlIHNldCByZWxhdGl2ZSB0byBhbm90aGVyIGl0ZW1cbiAgICAgICAgICogQHJldHVybnMgV2hldGhlciBvciBub3QgdGhlIGl0ZW0gY291bGQgYmUgbW92ZWRcbiAgICAgICAgKi9cbiAgICAgICAgbW92ZUl0ZW06IHR5cGVvZiBfX19tb3ZlSXRlbTtcblxuICAgICAgICAvKiogQ2hhbmdlcyB0aGUgcG9zaXRpb24gb2YgYW4gaXRlbSBpbiB0aGUgc2V0IHVzaW5nIGEgcHJvdmlkZWQgaW5kZXhcbiAgICAgICAgICogQHJldHVybnMgV2hldGhlciBvciBub3QgdGhlIGl0ZW0gY291bGQgYmUgbW92ZWRcbiAgICAgICAgKi9cbiAgICAgICAgbW92ZUluZGV4OiB0eXBlb2YgX19fbW92ZUluZGV4O1xuICAgIH1cblxuICAgIGludGVyZmFjZSBXaW5kb3cge1xuICAgICAgICBkb21QYXJzZXI6IERPTVBhcnNlcjtcblxuICAgICAgICAvKiogVmFyaWFibGVzIHNldCBieSB0aGUgcGFnZSAqL1xuICAgICAgICAvL2JjZFBhZ2VWYXJzOiBQYXJ0aWFsPHt9PlxuXG4gICAgICAgIC8qKiBCcm93c2VyLVN1cHBvcnRlZCBDbGljayBFdmVudCAqL1xuICAgICAgICBjbGlja0V2dDogJ2NsaWNrJ3wnbW91c2Vkb3duJ1xuXG4gICAgICAgIC8qKiBUaGUgTURMIGxheW91dCBlbGVtZW50ICovXG4gICAgICAgIGxheW91dDogbWRsLk1hdGVyaWFsTGF5b3V0XG5cbiAgICAgICAgLyoqIEEgbGlzdCBvZiBRdWVyeSBQYXJhbWV0ZXJzIGZyb20gdGhlIFVSSSAqL1xuICAgICAgICBxdWVyeVBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAgICAgICAvKiogQSBsaXN0IG9mIGZ1bmN0aW9ucyB1c2VkIHdoZW4gbG9hZGluZyBzY3JpcHRzICovXG4gICAgICAgIGJjZF9pbml0X2Z1bmN0aW9uczogUmVjb3JkPHN0cmluZywgRnVuY3Rpb24+O1xuXG4gICAgICAgIGNvcHlDb2RlKGVsZW06IEhUTUxFbGVtZW50KTogdm9pZDtcblxuICAgICAgICBsYXp5U3R5bGVzTG9hZGVkOiB0cnVlfHVuZGVmaW5lZDtcblxuICAgICAgICBCQ0RTZXR0aW5nc0Ryb3Bkb3duOiB0eXBlb2YgQkNEU2V0dGluZ3NEcm9wZG93bjtcblxuICAgICAgICByZWdpc3RlckZvckV2ZW50czogdHlwZW9mIHJlZ2lzdGVyRm9yRXZlbnRzO1xuICAgIH1cbn1cbndpbmRvdy5kb21QYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cblxuXG4vKiogUmVhcnJhbmdlZCBhbmQgYmV0dGVyLXR5cGVkIHBhcmFtZXRlcnMgZm9yIGBzZXRUaW1lb3V0YCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyRGVsYXk8VENhbGxiYWNrIGV4dGVuZHMgKC4uLmFyZ3M6IGFueSkgPT4gYW55ID0gYW55Pih0aW1lb3V0OiBudW1iZXIsIGNhbGxiYWNrOiBUQ2FsbGJhY2t8c3RyaW5nLCAuLi5hcmdzOiBQYXJhbWV0ZXJzPFRDYWxsYmFjaz4pOiBSZXR1cm5UeXBlPFdpbmRvd1snc2V0VGltZW91dCddPiB7XG4gICAgLy8gQHRzLWlnbm9yZTogdGhlIGBQYXJhbWV0ZXJzYCB1dGlsaXR5IHR5cGUgcmV0dXJucyBhIHR1cGxlLCB3aGljaCBpbmhlcmVudGx5IGhhcyBhbiBpdGVyYXRvciBmdW5jdGlvbi0tcmVnYXJkbGVzcyBvZiB3aGF0IFR5cGVTY3JpcHQgdGhpbmtzXG4gICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0LCAuLi4oYXJncyB8fCBbXSkpO1xufVxuXG4vKiogUHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZSBzcGVjaWZpZWQgdGltZW91dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhaXQodGltZW91dDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gYWZ0ZXJEZWxheSh0aW1lb3V0LCByZXNvbHZlKSk7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVcGRhdGFibGVPYmplY3Qge1xuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VwcHJlc3NVcGRhdGVzKSByZXR1cm47XG4gICAgICAgIHRoaXMuc3VwcHJlc3NVcGRhdGVzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgICAgIHRoaXMuc3VwcHJlc3NVcGRhdGVzID0gZmFsc2U7XG4gICAgfVxuICAgIHJlYWRvbmx5IHVwZGF0ZV9ib3VuZCA9IHRoaXMudXBkYXRlLmJpbmQodGhpcyk7XG4gICAgcHJvdGVjdGVkIHVwZGF0ZV8oKSB7cmV0dXJuO31cblxuICAgIHVwZGF0ZUZyb21JbnB1dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VwcHJlc3NVcGRhdGVzKSByZXR1cm47XG4gICAgICAgIHRoaXMuc3VwcHJlc3NVcGRhdGVzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVGcm9tSW5wdXRfKCk7XG4gICAgICAgIHRoaXMuc3VwcHJlc3NVcGRhdGVzID0gZmFsc2U7XG4gICAgfVxuICAgICAgICByZWFkb25seSB1cGRhdGVGcm9tSW5wdXRfYm91bmQgPSB0aGlzLnVwZGF0ZUZyb21JbnB1dC5iaW5kKHRoaXMpO1xuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUZyb21JbnB1dF8oKSB7cmV0dXJuO31cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3VwcHJlc3NVcGRhdGVzID0gdHJ1ZTtcbiAgICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4gdGhpcy5zdXBwcmVzc1VwZGF0ZXMgPSB0cnVlKTtcbiAgICAgICAgdGhpcy5kZXN0cm95XygpO1xuICAgIH1cbiAgICByZWFkb25seSBkZXN0cm95X2JvdW5kID0gdGhpcy5kZXN0cm95LmJpbmQodGhpcyk7XG5cbiAgICBwcm90ZWN0ZWQgZGVzdHJveV8oKSB7cmV0dXJuO31cblxuICAgIHN1cHByZXNzVXBkYXRlcyA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmVzdEFuaW1hdGlvbkZyYW1lcyhudW06IG51bWJlciwgY2FsbGJhY2s6ICgpID0+IHVua25vd24pIHtcbiAgICBpZiAobnVtIDw9IDApIHJldHVybiBjYWxsYmFjaygpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBuZXN0QW5pbWF0aW9uRnJhbWVzKG51bSAtIDEsIGNhbGxiYWNrKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhbmltYXRpb25GcmFtZXMobnVtOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBuZXN0QW5pbWF0aW9uRnJhbWVzKG51bSwgcmVzb2x2ZSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFuQW5pbWF0aW9uRnJhbWUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGFuaW1hdGlvbkZyYW1lcygxKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT0gU1RSSU5HIFVUSUxJVElFUyA9PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKiogUmVtb3ZlcyB3aGl0ZXNwYWNlIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZyBhbmQgYXQgdGhlIGVuZCBvZiBldmVyeSBpbmNsdWRlZCBsaW5lKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5cbi8qKiBSZW1vdmVzIHdoaXRlc3BhY2UgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nIGFuZCBhdCB0aGUgZW5kIG9mIGV2ZXJ5IGluY2x1ZGVkIGxpbmUqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyaW1XaGl0ZXNwYWNlKHN0cjogc3RyaW5nLCB0cmFpbGluZ05ld2xpbmUgPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuICBzdHIudHJpbVN0YXJ0KCkgICAgICAgICAgICAgICAgICAgICAvLyBUcmltIHdoaXRlc3BhY2UgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzdHJpbmdcbiAgICAgICAgICAgICAgICAudHJpbUVuZCgpICAgICAgICAgICAgICAgICAgICAgIC8vIFRyaW0gd2hpdGVzcGFjZSBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmdcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvW15cXFNcXG5dKiQvZ20sICcnKSAgICAgLy8gVHJpbSB3aGl0ZXNwYWNlIGF0IHRoZSBlbmQgb2YgZWFjaCBsaW5lXG4gICAgICAgICAgICAgICAgKyAodHJhaWxpbmdOZXdsaW5lID8gJ1xcbicgOiAnJykgLy8gQWRkIGEgdHJhaWxpbmcgbmV3bGluZSBpZiByZXF1ZXN0ZWRcbjt9XG5cbi8qKipcbiAqICAgICQkJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXFxuICogICAgJCQgIF9fX19ffCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICQkIHwgICAgICAkJFxcICAgICQkXFwgICQkJCQkJFxcICAkJCQkJCQkXFwgICQkJCQkJFxcXG4gKiAgICAkJCQkJFxcICAgIFxcJCRcXCAgJCQgIHwkJCAgX18kJFxcICQkICBfXyQkXFwgXFxfJCQgIF98XG4gKiAgICAkJCAgX198ICAgIFxcJCRcXCQkICAvICQkJCQkJCQkIHwkJCB8ICAkJCB8ICAkJCB8XG4gKiAgICAkJCB8ICAgICAgICBcXCQkJCAgLyAgJCQgICBfX19ffCQkIHwgICQkIHwgICQkIHwkJFxcXG4gKiAgICAkJCQkJCQkJFxcICAgIFxcJCAgLyAgIFxcJCQkJCQkJFxcICQkIHwgICQkIHwgIFxcJCQkJCAgfFxuICogICAgXFxfX19fX19fX3wgICAgXFxfLyAgICAgXFxfX19fX19ffFxcX198ICBcXF9ffCAgIFxcX19fXy9cbiAqXG4gKlxuICpcbiAqICAgICQkXFwgICAkJFxcICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXCAkJFxcICQkXFxcbiAqICAgICQkIHwgICQkIHwgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHwkJCB8XFxfX3xcbiAqICAgICQkIHwgICQkIHwgJCQkJCQkXFwgICQkJCQkJCRcXCAgICQkJCQkJCQgfCQkIHwkJFxcICQkJCQkJCRcXCAgICQkJCQkJFxcXG4gKiAgICAkJCQkJCQkJCB8IFxcX19fXyQkXFwgJCQgIF9fJCRcXCAkJCAgX18kJCB8JCQgfCQkIHwkJCAgX18kJFxcICQkICBfXyQkXFxcbiAqICAgICQkICBfXyQkIHwgJCQkJCQkJCB8JCQgfCAgJCQgfCQkIC8gICQkIHwkJCB8JCQgfCQkIHwgICQkIHwkJCAvICAkJCB8XG4gKiAgICAkJCB8ICAkJCB8JCQgIF9fJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8JCQgfCQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfFxuICogICAgJCQgfCAgJCQgfFxcJCQkJCQkJCB8JCQgfCAgJCQgfFxcJCQkJCQkJCB8JCQgfCQkIHwkJCB8ICAkJCB8XFwkJCQkJCQkIHxcbiAqICAgIFxcX198ICBcXF9ffCBcXF9fX19fX198XFxfX3wgIFxcX198IFxcX19fX19fX3xcXF9ffFxcX198XFxfX3wgIFxcX198IFxcX19fXyQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJCQkJCQkICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX19fX19fL1xuICovXG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgICAgLyoqIEJyb3dzZXItU3VwcG9ydGVkIENsaWNrIEV2ZW50ICovXG4gICAgICAgIGNsaWNrRXZ0OiAnY2xpY2snfCdtb3VzZWRvd24nXG5cbiAgICAgICAgLyoqIEFkZCB0aGUgcHJvdmlkZWQgZXZlbnQgbGlzdGVuZXIgb2JqZWN0IHRvIHRoZSBlbGVtZW50ICovXG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzOiB0eXBlb2YgcmVnaXN0ZXJGb3JFdmVudHM7XG4gICAgICAgIC8qKiBSZW1vdmUgdGhlIHByb3ZpZGVkIGV2ZW50IGxpc3RlbmVyIG9iamVjdCBmcm9tIHRoZSBlbGVtZW50ICovXG4gICAgICAgIHVucmVnaXN0ZXJGb3JFdmVudHM6IHR5cGVvZiB1bnJlZ2lzdGVyRm9yRXZlbnRzO1xuICAgIH1cbn1cblxuLyoqIEFuIGl0ZW0gdGhhdCBjYW4gcmVjZWl2ZSBhbiBldmVudCAqL1xudHlwZSBFdmVudEVsZW1lbnQgPSBIVE1MRWxlbWVudHx0eXBlb2Ygd2luZG93fHR5cGVvZiBkb2N1bWVudDtcblxuLyoqIENvbnN0cnVjdHMgYW4gZXZlbnQgY2FsbGJhY2sgZnJvbSB0aGUgZXZlbnQgYW5kIGVsZW1lbnQgdHlwZXMgKi9cbnR5cGUgRXZlbnRDYWxsYmFjazxURXZlbnRUeXBlIGV4dGVuZHMgRXZlbnQsIFRFbGVtZW50IGV4dGVuZHMgRXZlbnRFbGVtZW50ID0gRXZlbnRFbGVtZW50PiA9ICh0aGlzOiBURWxlbWVudCwgZXY6IFRFdmVudFR5cGUpID0+IHVua25vd247XG5cbi8qKiBUaGUgdmFyaW91cyB0eXBlcyBvZiByZWdpc3RlcmFibGUgZXZlbnRzIGFuZCB0aGVpciBjYWxsYmFjayB0eXBlcyAqL1xuaW50ZXJmYWNlIEV2ZW50VHlwZXM8VEVsZW1lbnQgZXh0ZW5kcyBFdmVudEVsZW1lbnQgPSBFdmVudEVsZW1lbnQ+IHtcbiAgICBhY3RpdmF0ZT86IEV2ZW50Q2FsbGJhY2s8VEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCA/IChNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnQpIDogKEV2ZW50fEtleWJvYXJkRXZlbnQpLCBURWxlbWVudD5cblxuICAgIGNoYW5nZT86IEV2ZW50Q2FsbGJhY2s8RXZlbnQsIFRFbGVtZW50PlxuXG4gICAgZHJvcGRvd25JbnB1dD86IEV2ZW50Q2FsbGJhY2s8RXZlbnQsIFRFbGVtZW50PlxuXG4gICAgZXhpdD86IEV2ZW50Q2FsbGJhY2s8S2V5Ym9hcmRFdmVudCwgVEVsZW1lbnQ+XG5cbiAgICB1bmRvPzogRXZlbnRDYWxsYmFjazxLZXlib2FyZEV2ZW50LCBURWxlbWVudD5cbiAgICByZWRvPzogRXZlbnRDYWxsYmFjazxLZXlib2FyZEV2ZW50LCBURWxlbWVudD5cblxuICAgIHNhdmU/OiBFdmVudENhbGxiYWNrPEtleWJvYXJkRXZlbnQsIFRFbGVtZW50PlxuXG4gICAgYW55S2V5PzogRXZlbnRDYWxsYmFjazxLZXlib2FyZEV2ZW50LCBURWxlbWVudD5cbiAgICBrZXk/OiBFdmVudENhbGxiYWNrPEtleWJvYXJkRXZlbnQsIFRFbGVtZW50PlxufVxuXG4vKiogVmFyaW91cyBrZXlzIHRoYXQgY2FuIGJlIGhlbGQgdG8gbW9kaWZ5IHRoZSB1c2Ugb2YgYW5vdGhlciBrZXkgKi9cbnR5cGUgbW9kaWZpZXJLZXlzID0gJ2N0cmwnIHwgJ3NoaWZ0JyB8ICdhbHQnIHwgJ21ldGEnO1xuXG4vKiogQSBsaXN0IG9mIGtleXMgYW5kIHRoZWlyIGFzc29jaWF0ZWQgYWN0aW9ucyAqL1xuY29uc3Qga2V5VHlwZXM6IFJlY29yZDxzdHJpbmcsIFttb2RpZmllcktleXNbXSwga2V5b2YgRXZlbnRUeXBlc11bXT4gPSB7XG4gICAgJ0VudGVyJzogW1tbXSwgJ2FjdGl2YXRlJ11dLFxuICAgICcgJzogW1tbXSwgJ2FjdGl2YXRlJ11dLFxuICAgICdFc2NhcGUnOiBbW1tdLCAnZXhpdCddXSxcbiAgICAnRXNjJzogW1tbXSwgJ2V4aXQnXV0sXG4gICAgJ3onOiBbXG4gICAgICAgIFtbJ2N0cmwnXSwgJ3VuZG8nXSwgW1snbWV0YSddLCAndW5kbyddLFxuICAgICAgICBbWydjdHJsJywgJ3NoaWZ0J10sICdyZWRvJ10sIFtbJ21ldGEnLCAnc2hpZnQnXSwgJ3JlZG8nXVxuICAgIF0sXG4gICAgJ3knOiBbW1snY3RybCddLCAncmVkbyddXSxcbiAgICAncyc6IFtbWydjdHJsJ10sICdzYXZlJ11dLFxufTtcblxuLyoqIEFkZCB0aGUgcHJvdmlkZWQgZXZlbnQgbGlzdGVuZXIgb2JqZWN0IHRvIHRoZSBlbGVtZW50LlxuICogV0FSTklORzogSWYgeW91IHdpc2ggdG8gdW5yZWdpc3RlciB0aGVzZSBldmVudHMgbGF0ZXIsIHlvdSBXSUxMIG5lZWQgdG8gdXNlIHRoZSBzYW1lIG9wdGlvbnMgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJGb3JFdmVudHM8VEVsZW1lbnQgZXh0ZW5kcyBFdmVudEVsZW1lbnQ+KGVsZW1lbnQ6IFRFbGVtZW50LCBldmVudHM6IEV2ZW50VHlwZXM8VEVsZW1lbnQ+LCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuICAgIHJlZ2lzdGVyRm9yRXZlbnRzXyhlbGVtZW50LCBldmVudHMsIG9wdGlvbnMsIGZhbHNlKTtcbn1cblxuLyoqIFJlbW92ZSB0aGUgcHJvdmlkZWQgZXZlbnQgbGlzdGVuZXIgb2JqZWN0IGZyb20gdGhlIGVsZW1lbnRcbiAqIFdBUk5JTkc6IFRvIHVucmVnaXN0ZXIgdGhlc2UgZXZlbnRzLCB5b3UgV0lMTCBuZWVkIHRvIHVzZSB0aGUgc2FtZSBvcHRpb25zIG9iamVjdCBhcyB3aGVuIHlvdSByZWdpc3RlcmVkIGl0LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyRm9yRXZlbnRzPFRFbGVtZW50IGV4dGVuZHMgRXZlbnRFbGVtZW50PihlbGVtZW50OiBURWxlbWVudCwgZXZlbnRzOiBFdmVudFR5cGVzPFRFbGVtZW50Piwgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkIHtcbiAgICByZWdpc3RlckZvckV2ZW50c18oZWxlbWVudCwgZXZlbnRzLCBvcHRpb25zLCB0cnVlKTtcbn1cblxuLyoqIEEgbWFwcGluZyBvZiBldmVudCBjYWxsYmFja3MgdG8gdGhlaXIgd3JhcHBlZCB2ZXJzaW9ucyAoc3RvcmVkIHNvIHRoZSBldmVudCBjYW4gYmUgbGF0ZXIgcmVtb3ZlZCkgKi9cbmV4cG9ydCBjb25zdCByZWdpc3RlckZvckV2ZW50c193cmFwcGVkRnVuY3Rpb25zID0gbmV3IE1hcDxGdW5jdGlvbiwgRnVuY3Rpb24+KCk7XG5cbi8qKiBBIG1hcHBpbmcgb2YgZXZlbnQgb2JqZWN0cyB0byB0aGVpciBrZXlib2FyZCBldmVudCBoYW5kbGVycyAoc3RvcmVkIHNvIHRoZSBldmVudCBjYW4gYmUgbGF0ZXIgcmVtb3ZlZCkgKi9cbmV4cG9ydCBjb25zdCByZWdpc3RlckZvckV2ZW50c19oYW5kbGVkS2V5cyA9IG5ldyBNYXA8RXZlbnRUeXBlczxhbnk+LCAodGhpczogYW55LCBldjogRXZlbnQpPT52b2lkPigpO1xuXG5mdW5jdGlvbiByZWdpc3RlckZvckV2ZW50c188VEVsZW1lbnQgZXh0ZW5kcyBFdmVudEVsZW1lbnQ+KGVsZW1lbnQ6IFRFbGVtZW50LCBldmVudHM6IEV2ZW50VHlwZXM8VEVsZW1lbnQ+LCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucywgdW5yZWdpc3RlciA9IGZhbHNlKTogdm9pZCB7XG4gICAgbGV0IGhhbmRsaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBzZXRMaXN0ZW5lciA9IHVucmVnaXN0ZXIgPyBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIuYmluZChlbGVtZW50KSA6IGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lci5iaW5kKGVsZW1lbnQpO1xuXG4gICAgZnVuY3Rpb24gd3JhcENhbGxiYWNrPFRDYWxsYmFjayBleHRlbmRzICh0aGlzOiBURWxlbWVudCwgLi4uYXJnczogYW55W10pID0+IGFueT4oY2FsbGJhY2s6IFRDYWxsYmFjayk6ICgodGhpczogVGhpc1BhcmFtZXRlclR5cGU8VENhbGxiYWNrPiwgLi4uYXJnczogUGFyYW1ldGVyczxUQ2FsbGJhY2s+KT0+UmV0dXJuVHlwZTxUQ2FsbGJhY2s+fHZvaWQpIHtcbiAgICAgICAgbGV0IGYgPSByZWdpc3RlckZvckV2ZW50c193cmFwcGVkRnVuY3Rpb25zLmdldChjYWxsYmFjayk7XG5cbiAgICAgICAgaWYgKCFmKSB7XG4gICAgICAgICAgICBmID0gZnVuY3Rpb24odGhpczogVGhpc1BhcmFtZXRlclR5cGU8VENhbGxiYWNrPiwgLi4uYXJnczogUGFyYW1ldGVyczxUQ2FsbGJhY2s+KSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsaW5nKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaGFuZGxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IGhhbmRsaW5nID0gZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIC4uLmFyZ3MpIGFzIFJldHVyblR5cGU8VENhbGxiYWNrPjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzX3dyYXBwZWRGdW5jdGlvbnMuc2V0KGNhbGxiYWNrLCBmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEB0cy1pZ25vcmU6IFRoZSB0eXBlIGlzIGNvcnJlY3QsIGJ1dCBUeXBlU2NyaXB0IGRvZXNuJ3Qga25vdyB0aGF0XG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIC8vIFdyYXAgYWxsIHRoZSBjYWxsYmFja3MhXG4gICAgZXZlbnRzID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGV2ZW50cykubWFwKChba2V5LCB2YWx1ZV0pID0+IFtrZXksIHdyYXBDYWxsYmFjayh2YWx1ZSldKSk7XG5cbiAgICBsZXQgaGFuZGxlS2V5ID0gcmVnaXN0ZXJGb3JFdmVudHNfaGFuZGxlZEtleXMuZ2V0KGV2ZW50cyk7XG4gICAgaWYgKCFoYW5kbGVLZXkpIHtcbiAgICAgICAgaGFuZGxlS2V5ID0gZnVuY3Rpb24odGhpczogVEVsZW1lbnQsIGV2OiBFdmVudCkge1xuICAgICAgICAgICAgaWYgKCAhKGV2IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkgKSByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIEZpbmQgYW5kIGNhbGwgdGhlIGFwcHJvcHJpYXRlIGNhbGxiYWNrXG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBrZXlUeXBlc1tldi5rZXldPy5maW5kKChbbW9kaWZpZXJzLCBfXSkgPT4gbW9kaWZpZXJzLmV2ZXJ5KG1vZCA9PiBldltgJHttb2R9S2V5YF0pKT8uWzFdIHx8ICdhbnlLZXknO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdGVkQ2FsbGJhY2sgPSBldmVudHNbZnVuY3Rpb25OYW1lXTtcblxuICAgICAgICAgICAgaWYgKHJlcXVlc3RlZENhbGxiYWNrICYmIGZ1bmN0aW9uTmFtZSAhPT0gJ2FueUtleScpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHJlcXVlc3RlZENhbGxiYWNrIHx8IGV2ZW50c1snYW55S2V5J107XG4gICAgICAgICAgICBjYWxsYmFjaz8uY2FsbChlbGVtZW50LCBldik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHNfaGFuZGxlZEtleXMuc2V0KGV2ZW50cywgaGFuZGxlS2V5KTtcbiAgICB9XG5cbiAgICBzZXRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleSwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKGNvbnN0IGV2dCBpbiBldmVudHMpIHN3aXRjaCAoZXZ0KSB7XG4gICAgICAgIGNhc2UgJ2FjdGl2YXRlJzogLy8gQHRzLWlnbm9yZSAtIG15IGxvZ2ljIGlzIHBlcmZlY3RseSB2YWxpZCwgYnV0IFR5cGVTY3JpcHQgZG9lc24ndCBrbm93IHRoYXQg8J+kt+KAjeKZgu+4j1xuICAgICAgICAgICAgc2V0TGlzdGVuZXIod2luZG93LmNsaWNrRXZ0LCBldmVudHNbZXZ0XSEsIG9wdGlvbnMpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnY2hhbmdlJzpcbiAgICAgICAgICAgIHNldExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudHNbZXZ0XSEsIG9wdGlvbnMpO1xuICAgICAgICAgICAgc2V0TGlzdGVuZXIoJ2lucHV0JywgZXZlbnRzW2V2dF0hLCBvcHRpb25zKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Ryb3Bkb3duSW5wdXQnOlxuICAgICAgICAgICAgc2V0TGlzdGVuZXIoJ2JjZC1kcm9wZG93bi1jaGFuZ2UnLCBldmVudHNbZXZ0XSEsIG9wdGlvbnMpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZXhpdCc6IGJyZWFrO1xuICAgICAgICBjYXNlICd1bmRvJzogYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZG8nOiBicmVhaztcbiAgICAgICAgY2FzZSAnYW55S2V5JzogYnJlYWs7XG4gICAgfVxufVxud2luZG93LnJlZ2lzdGVyRm9yRXZlbnRzID0gcmVnaXN0ZXJGb3JFdmVudHM7XG5cbi8qKipcbiAqICAgICQkJCQkJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJCQkJCRcXCAgICAkJFxcICAgICAgICAgICAgICAgICQkJCQkJFxcICAgJCQkJCQkXFxcbiAqICAgICQkICBfXyQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkICBfXyQkXFwgICAkJCB8ICAgICAgICAgICAgICAkJCAgX18kJFxcICQkICBfXyQkXFxcbiAqICAgICQkIHwgICQkIHwgJCQkJCQkXFwgICAkJCQkJCRcXCAgJCRcXCAgICQkXFwgJCRcXCAgICQkXFwgICAgICAgJCQgLyAgXFxfX3wkJCQkJCRcXCAgICQkXFwgICAkJFxcICQkIC8gIFxcX198JCQgLyAgXFxfX3xcbiAqICAgICQkJCQkJCQgIHwkJCAgX18kJFxcICQkICBfXyQkXFwgXFwkJFxcICQkICB8JCQgfCAgJCQgfCAgICAgIFxcJCQkJCQkXFwgIFxcXyQkICBffCAgJCQgfCAgJCQgfCQkJCRcXCAgICAgJCQkJFxcXG4gKiAgICAkJCAgX19fXy8gJCQgfCAgXFxfX3wkJCAvICAkJCB8IFxcJCQkJCAgLyAkJCB8ICAkJCB8ICAgICAgIFxcX19fXyQkXFwgICAkJCB8ICAgICQkIHwgICQkIHwkJCAgX3wgICAgJCQgIF98XG4gKiAgICAkJCB8ICAgICAgJCQgfCAgICAgICQkIHwgICQkIHwgJCQgICQkPCAgJCQgfCAgJCQgfCAgICAgICQkXFwgICAkJCB8ICAkJCB8JCRcXCAkJCB8ICAkJCB8JCQgfCAgICAgICQkIHxcbiAqICAgICQkIHwgICAgICAkJCB8ICAgICAgXFwkJCQkJCQgIHwkJCAgL1xcJCRcXCBcXCQkJCQkJCQgfCAgICAgIFxcJCQkJCQkICB8ICBcXCQkJCQgIHxcXCQkJCQkJCAgfCQkIHwgICAgICAkJCB8XG4gKiAgICBcXF9ffCAgICAgIFxcX198ICAgICAgIFxcX19fX19fLyBcXF9fLyAgXFxfX3wgXFxfX19fJCQgfCAgICAgICBcXF9fX19fXy8gICAgXFxfX19fLyAgXFxfX19fX18vIFxcX198ICAgICAgXFxfX3xcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJCQkJCQkICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX19fX19fL1xuICovXG5cbi8vIFdhdGNoIG91dCAtIEdlbmVyaWNzIGFyZSBzY2FycnkhXG5cbnR5cGUgQW55RnVuY3Rpb24gPSAoLi4uYXJnczogYW55KSA9PiBhbnk7XG50eXBlIEFueUNvbnN0cnVjdG9yID0gKG5ldyAoLi4uYXJnczogYW55KSA9PiBhbnkpIHwgKGFic3RyYWN0IG5ldyAoLi4uYXJnczogYW55KSA9PiBhbnkpO1xudHlwZSBBbnlDb25zdHJ1Y3RvcldpdGhDYWxsU2lnbmF0dXJlID0gQW55Q29uc3RydWN0b3IgJiBBbnlGdW5jdGlvbjtcblxuaW50ZXJmYWNlIEltcHJvdmVkUHJveHlIYW5kbGVyX0NvbnN0cnVjdG9yPFRPYmogZXh0ZW5kcyBBbnlDb25zdHJ1Y3Rvcj4gZXh0ZW5kcyBJbXByb3ZlZFByb3h5SGFuZGxlcl9PYmplY3Q8VE9iaj4ge1xuICAgIC8qKlxuICAgICAqIEEgdHJhcCBmb3IgdGhlIGBuZXdgIG9wZXJhdG9yLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIG9yaWdpbmFsIG9iamVjdCB3aGljaCBpcyBiZWluZyBwcm94aWVkLlxuICAgICAqIEBwYXJhbSBhcmdBcnJheSBUaGUgYXJndW1lbnRzIGZvciB0aGUgY2FsbC5cbiAgICAgKiBAcGFyYW0gbmV3VGFyZ2V0IFRoZSBjb25zdHJ1Y3RvciB0aGF0IHdhcyBvcmlnaW5hbGx5IGNhbGxlZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Q/KHRhcmdldDogVE9iaiwgYXJnQXJyYXk6IGFueVtdLCBuZXdUYXJnZXQ6IChDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VE9iaj4pKTogb2JqZWN0O1xufVxuaW50ZXJmYWNlIEltcHJvdmVkUHJveHlIYW5kbGVyX0Z1bmN0aW9uPFRPYmogZXh0ZW5kcyBBbnlGdW5jdGlvbj4gZXh0ZW5kcyBJbXByb3ZlZFByb3h5SGFuZGxlcl9PYmplY3Q8VE9iaj4ge1xuICAgIC8qKlxuICAgICAqIEEgdHJhcCBtZXRob2QgZm9yIGEgZnVuY3Rpb24gY2FsbC5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBvcmlnaW5hbCBjYWxsYWJsZSBvYmplY3Qgd2hpY2ggaXMgYmVpbmcgcHJveGllZC5cbiAgICAgKiBAcGFyYW0gdGhpc0FyZyBUaGUgYHRoaXNgIGFyZ3VtZW50IGZvciB0aGUgY2FsbC5cbiAgICAgKiBAcGFyYW0gYXJnQXJyYXkgVGhlIGFyZ3VtZW50cyBmb3IgdGhlIGNhbGwuXG4gICAgICovXG4gICAgYXBwbHk/KHRhcmdldDogVE9iaiwgdGhpc0FyZzogVGhpc1BhcmFtZXRlclR5cGU8VE9iaj4sIGFyZ0FycmF5OiBQYXJhbWV0ZXJzPFRPYmo+KTogYW55O1xufVxuXG50eXBlIEltcHJvdmVkUHJveHlIYW5kbGVyX0NvbnN0cnVjdG9yV2l0aENhbGxTaWduYXR1cmU8VE9iaiBleHRlbmRzIEFueUNvbnN0cnVjdG9yV2l0aENhbGxTaWduYXR1cmU+ID0gSW1wcm92ZWRQcm94eUhhbmRsZXJfQ29uc3RydWN0b3I8VE9iaj4gJiBJbXByb3ZlZFByb3h5SGFuZGxlcl9GdW5jdGlvbjxUT2JqPjtcblxuLy8gQHRzLWlnbm9yZTogVHlwZVNjcmlwdCBkb2Vzbid0IGxpa2UgbWUgb3ZlcndyaXRpbmcgdGhlIGJhZCBkZWZhdWx0IHR5cGVzLlxuaW50ZXJmYWNlIEltcHJvdmVkUHJveHlIYW5kbGVyX09iamVjdDxUT2JqIGV4dGVuZHMgb2JqZWN0PiBleHRlbmRzIFByb3h5SGFuZGxlcjxUT2JqPiB7XG4gICAgLyoqIERPIE5PVCBVU0UgLSBUSElTIE9CSkVDVCBDQU5OT1QgQkUgQ09OU1RSVUNURUQgKi9cbiAgICBhcHBseT86IGFueTtcblxuICAgIC8qKiBETyBOT1QgVVNFIC0gVEhJUyBPQkpFQ1QgQ0FOTk9UIEJFIENPTlNUUlVDVEVEICovXG4gICAgY29uc3RydWN0PzogYW55O1xuXG4gICAgLyoqXG4gICAgICogQSB0cmFwIGZvciBgT2JqZWN0LmRlZmluZVByb3BlcnR5KClgLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIG9yaWdpbmFsIG9iamVjdCB3aGljaCBpcyBiZWluZyBwcm94aWVkLlxuICAgICAqIEByZXR1cm5zIEEgYEJvb2xlYW5gIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdGhlIHByb3BlcnR5IGhhcyBiZWVuIGRlZmluZWQuXG4gICAgICovXG4gICAgZGVmaW5lUHJvcGVydHk/KHRhcmdldDogVE9iaiwgcHJvcGVydHk6IGtleW9mIFRPYmosIGF0dHJpYnV0ZXM6IFByb3BlcnR5RGVzY3JpcHRvcik6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBIHRyYXAgZm9yIHRoZSBgZGVsZXRlYCBvcGVyYXRvci5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBvcmlnaW5hbCBvYmplY3Qgd2hpY2ggaXMgYmVpbmcgcHJveGllZC5cbiAgICAgKiBAcGFyYW0gcHJvcGVydHkgVGhlIG5hbWUgb3IgYFN5bWJvbGAgb2YgdGhlIHByb3BlcnR5IHRvIGRlbGV0ZS5cbiAgICAgKiBAcmV0dXJucyBBIGBCb29sZWFuYCBpbmRpY2F0aW5nIHdoZXRoZXIgb3Igbm90IHRoZSBwcm9wZXJ0eSB3YXMgZGVsZXRlZC5cbiAgICAgKi9cbiAgICBkZWxldGVQcm9wZXJ0eT8odGFyZ2V0OiBUT2JqLCBwcm9wZXJ0eToga2V5b2YgVE9iaik6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBIHRyYXAgZm9yIGdldHRpbmcgYSBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBvcmlnaW5hbCBvYmplY3Qgd2hpY2ggaXMgYmVpbmcgcHJveGllZC5cbiAgICAgKiBAcGFyYW0gcHJvcGVydHlUaGUgbmFtZSBvciBgU3ltYm9sYCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICAgICAqIEBwYXJhbSByZWNlaXZlciBUaGUgcHJveHkgb3IgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgcHJveHkuXG4gICAgICovXG4gICAgZ2V0PzxUUHJvcGVydHkgZXh0ZW5kcyBrZXlvZiBUT2JqPih0YXJnZXQ6IFRPYmosIHByb3BlcnR5OiBUUHJvcGVydHksIHJlY2VpdmVyOiBhbnkpOiBUT2JqW1RQcm9wZXJ0eV07XG5cbiAgICAvKipcbiAgICAgKiBBIHRyYXAgZm9yIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKClgLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIG9yaWdpbmFsIG9iamVjdCB3aGljaCBpcyBiZWluZyBwcm94aWVkLlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0eVRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3aG9zZSBkZXNjcmlwdGlvbiBzaG91bGQgYmUgcmV0cmlldmVkLlxuICAgICAqL1xuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcj88VFByb3BlcnR5IGV4dGVuZHMga2V5b2YgVE9iaj4odGFyZ2V0OiBUT2JqLCBwcm9wZXJ0eTogVFByb3BlcnR5KTogUHJvcGVydHlEZXNjcmlwdG9yIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQSB0cmFwIGZvciB0aGUgYFtbR2V0UHJvdG90eXBlT2ZdXWAgaW50ZXJuYWwgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIG9yaWdpbmFsIG9iamVjdCB3aGljaCBpcyBiZWluZyBwcm94aWVkLlxuICAgICAqL1xuICAgIGdldFByb3RvdHlwZU9mPyh0YXJnZXQ6IFRPYmopOiBvYmplY3QgfCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQSB0cmFwIGZvciB0aGUgYGluYCBvcGVyYXRvci5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBvcmlnaW5hbCBvYmplY3Qgd2hpY2ggaXMgYmVpbmcgcHJveGllZC5cbiAgICAgKiBAcGFyYW0gcHJvcGVydHlUaGUgbmFtZSBvciBgU3ltYm9sYCBvZiB0aGUgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZS5cbiAgICAgKi9cbiAgICBoYXM/KHRhcmdldDogVE9iaiwgcHJvcGVydHk6IHN0cmluZ3xudW1iZXJ8c3ltYm9sKTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEEgdHJhcCBmb3IgYE9iamVjdC5pc0V4dGVuc2libGUoKWAuXG4gICAgICogQHBhcmFtIHRhcmdldCBUaGUgb3JpZ2luYWwgb2JqZWN0IHdoaWNoIGlzIGJlaW5nIHByb3hpZWQuXG4gICAgICovXG4gICAgaXNFeHRlbnNpYmxlPyh0YXJnZXQ6IFRPYmopOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQSB0cmFwIGZvciBgUmVmbGVjdC5vd25LZXlzKClgLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIG9yaWdpbmFsIG9iamVjdCB3aGljaCBpcyBiZWluZyBwcm94aWVkLlxuICAgICAqL1xuICAgIG93bktleXM/KHRhcmdldDogVE9iaik6IEFycmF5TGlrZTxrZXlvZiBUT2JqPjtcblxuICAgIC8qKlxuICAgICAqIEEgdHJhcCBmb3IgYE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucygpYC5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBvcmlnaW5hbCBvYmplY3Qgd2hpY2ggaXMgYmVpbmcgcHJveGllZC5cbiAgICAgKi9cbiAgICBwcmV2ZW50RXh0ZW5zaW9ucz8odGFyZ2V0OiBUT2JqKTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEEgdHJhcCBmb3Igc2V0dGluZyBhIHByb3BlcnR5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIG9yaWdpbmFsIG9iamVjdCB3aGljaCBpcyBiZWluZyBwcm94aWVkLlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0eVRoZSBuYW1lIG9yIGBTeW1ib2xgIG9mIHRoZSBwcm9wZXJ0eSB0byBzZXQuXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIFRoZSBvYmplY3QgdG8gd2hpY2ggdGhlIGFzc2lnbm1lbnQgd2FzIG9yaWdpbmFsbHkgZGlyZWN0ZWQuXG4gICAgICogQHJldHVybnMgQSBgQm9vbGVhbmAgaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgcHJvcGVydHkgd2FzIHNldC5cbiAgICAgKi9cbiAgICBzZXQ/PFRQcm9wZXJ0eSBleHRlbmRzIGtleW9mIFRPYmo+KHRhcmdldDogVE9iaiwgcHJvcGVydHk6IFRQcm9wZXJ0eSwgbmV3VmFsdWU6IFRPYmpbVFByb3BlcnR5XSwgcmVjZWl2ZXI6IGFueSk6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBIHRyYXAgZm9yIGBPYmplY3Quc2V0UHJvdG90eXBlT2YoKWAuXG4gICAgICogQHBhcmFtIHRhcmdldCBUaGUgb3JpZ2luYWwgb2JqZWN0IHdoaWNoIGlzIGJlaW5nIHByb3hpZWQuXG4gICAgICogQHBhcmFtIG5ld1Byb3RvdHlwZSBUaGUgb2JqZWN0J3MgbmV3IHByb3RvdHlwZSBvciBgbnVsbGAuXG4gICAgICovXG4gICAgc2V0UHJvdG90eXBlT2Y/KHRhcmdldDogVE9iaiwgbmV3UHJvdG90eXBlOiBvYmplY3QgfCBudWxsKTogYm9vbGVhbjtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIHR5cGUgSW1wcm92ZWRQcm94eUhhbmRsZXI8VE9iaiBleHRlbmRzIG9iamVjdD4gPVxuICAgICAgVE9iaiBleHRlbmRzIEFueUNvbnN0cnVjdG9yV2l0aENhbGxTaWduYXR1cmUgPyBJbXByb3ZlZFByb3h5SGFuZGxlcl9Db25zdHJ1Y3RvcldpdGhDYWxsU2lnbmF0dXJlPFRPYmo+XG4gICAgOiBUT2JqIGV4dGVuZHMgQW55Q29uc3RydWN0b3IgICAgICAgICAgICAgICAgICA/IEltcHJvdmVkUHJveHlIYW5kbGVyX0NvbnN0cnVjdG9yPFRPYmo+XG4gICAgOiBUT2JqIGV4dGVuZHMgQW55RnVuY3Rpb24gICAgICAgICAgICAgICAgICAgICA/IEltcHJvdmVkUHJveHlIYW5kbGVyX0Z1bmN0aW9uPFRPYmo+XG4gICAgOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEltcHJvdmVkUHJveHlIYW5kbGVyX09iamVjdDxUT2JqPlxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm94aWVzPFRPYmogZXh0ZW5kcyBvYmplY3Q+KG9iajogVE9iaiwgaGFuZGxlcjogSW1wcm92ZWRQcm94eUhhbmRsZXI8VE9iaj4sIHJ1bk9uRWFjaD86IChvYmo6IFRPYmopID0+IHVua25vd24pOiBUT2JqIHtcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgcmV0dXJuIG9iajtcblxuXG5cbiAgICBpZiAoaGFuZGxlci5zZXQpIHtcbiAgICAgICAgY29uc3Qgb2xkU2V0dGVyID0gaGFuZGxlci5zZXQ7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRTZXR0ZXI6IEltcHJvdmVkUHJveHlIYW5kbGVyPFRPYmo+WydzZXQnXSA9ICh0YXJnZXQsIHByb3AsIHZhbHVlLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gdGFyZ2V0ICYmIHRhcmdldFtwcm9wXSA9PT0gdmFsdWUpIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgdmFsdWUgPSBzZXRQcm94aWVzKHZhbHVlLCBoYW5kbGVyLCBydW5PbkVhY2gpIGFzIGFueTtcblxuICAgICAgICAgICAgcmV0dXJuIG9sZFNldHRlci5jYWxsKGhhbmRsZXIsIHRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSA/PyB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGhhbmRsZXIuc2V0ID0gd3JhcHBlZFNldHRlcjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgICAgIHJ1bk9uRWFjaD8uKHZhbHVlKTtcblxuICAgICAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIGNvbnRpbnVlO1xuICAgICAgICBvYmpba2V5IGFzIGtleW9mIFRPYmpdID0gbmV3IFByb3h5KHNldFByb3hpZXModmFsdWUsIGhhbmRsZXIsIHJ1bk9uRWFjaCksIGhhbmRsZXIpIGFzIGFueTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb3h5KG9iaiwgaGFuZGxlcikgYXMgVE9iajtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT0gTlVNQkVSIFVUSUxJVElFUyA9PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKiogUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdXNpdmUpIGFuZCBtYXggKGluY2x1c2l2ZSkgd2l0aCBwcmVjaXNpb24gdXAgdG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAgICBAcGFyYW0gbWluIFRoZSBtaW5pbXVtIHZhbHVlIHRoYXQgdGhpcyBmdW5jdGlvbiBzaG91bGQgcmV0dXJuXG4gICAgQHBhcmFtIG1heCBUaGUgbWF4aW11bSB2YWx1ZSB0aGF0IHRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVyblxuICAgIEBwYXJhbSBwbGFjZXMgVGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyB0aGUgcmV0dXJuZWQgbnVtYmVyIHNob3VsZCBpbmNsdWRlXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbU51bWJlcihtaW4gPSAwLCBtYXggPSAxLCBwbGFjZXMgPSAwKTpudW1iZXJ7XG4gICAgY29uc3QgcGxhY2VzTXVsdCA9IE1hdGgucG93KDEwLCBwbGFjZXMpO1xuICAgIHJldHVybiAoXG4gICAgICAgIE1hdGgucm91bmQoXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluXG4gICAgICAgICAgICApICogcGxhY2VzTXVsdFxuICAgICAgICApIC8gcGxhY2VzTXVsdFxuICAgICk7XG59XG5cblxuLyoqKlxuICogICAgJCQkJCQkJFxcICAgJCQkJCQkXFwgICQkXFwgICAgICAkJFxcICAgICAgICQkXFwgICAkJFxcICAgJCRcXCAgICAgJCRcXCAkJFxcICQkXFwgICAkJFxcICAgICAkJFxcXG4gKiAgICAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQkXFwgICAgJCQkIHwgICAgICAkJCB8ICAkJCB8ICAkJCB8ICAgIFxcX198JCQgfFxcX198ICAkJCB8ICAgIFxcX198XG4gKiAgICAkJCB8ICAkJCB8JCQgLyAgJCQgfCQkJCRcXCAgJCQkJCB8ICAgICAgJCQgfCAgJCQgfCQkJCQkJFxcICAgJCRcXCAkJCB8JCRcXCAkJCQkJCRcXCAgICQkXFwgICQkJCQkJFxcICAgJCQkJCQkJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCQkXFwkJFxcJCQgJCQgfCAgICAgICQkIHwgICQkIHxcXF8kJCAgX3wgICQkIHwkJCB8JCQgfFxcXyQkICBffCAgJCQgfCQkICBfXyQkXFwgJCQgIF9fX19ffFxuICogICAgJCQgfCAgJCQgfCQkIHwgICQkIHwkJCBcXCQkJCAgJCQgfCAgICAgICQkIHwgICQkIHwgICQkIHwgICAgJCQgfCQkIHwkJCB8ICAkJCB8ICAgICQkIHwkJCQkJCQkJCB8XFwkJCQkJCRcXFxuICogICAgJCQgfCAgJCQgfCQkIHwgICQkIHwkJCB8XFwkICAvJCQgfCAgICAgICQkIHwgICQkIHwgICQkIHwkJFxcICQkIHwkJCB8JCQgfCAgJCQgfCQkXFwgJCQgfCQkICAgX19fX3wgXFxfX19fJCRcXFxuICogICAgJCQkJCQkJCAgfCAkJCQkJCQgIHwkJCB8IFxcXy8gJCQgfCAgICAgIFxcJCQkJCQkICB8ICBcXCQkJCQgIHwkJCB8JCQgfCQkIHwgIFxcJCQkJCAgfCQkIHxcXCQkJCQkJCRcXCAkJCQkJCQkICB8XG4gKiAgICBcXF9fX19fX18vICBcXF9fX19fXy8gXFxfX3wgICAgIFxcX198ICAgICAgIFxcX19fX19fLyAgICBcXF9fX18vIFxcX198XFxfX3xcXF9ffCAgIFxcX19fXy8gXFxfX3wgXFxfX19fX19ffFxcX19fX19fXy9cbiAqXG4gKlxuICpcbiAqL1xuXG5pbnRlcmZhY2UgRG9jQW5kRWxlbWVudEluamVjdGlvbnMge1xuICAgIC8qKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCB0YWcgbmFtZSBvciBjcmVhdGVzIG9uZSBpZiBpdCBkb2VzIG5vdCBleGlzdCAqL1xuICAgIGdldE9yQ3JlYXRlQ2hpbGRCeVRhZzxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0YWdOYW1lOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xuICAgIGdldE9yQ3JlYXRlQ2hpbGRCeVRhZyh0YWdOYW1lOiBzdHJpbmcpOkVsZW1lbnQ7XG5cbiAgICByZW1vdmVDaGlsZEJ5VGFnPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRhZ05hbWU6IEssIGNvdW50PzogbnVtYmVyKTogdm9pZDtcbiAgICByZW1vdmVDaGlsZEJ5VGFnKHRhZ05hbWU6IHN0cmluZywgY291bnQ/OiBudW1iZXIpOiB2b2lkO1xufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEVsZW1lbnQgZXh0ZW5kcyBEb2NBbmRFbGVtZW50SW5qZWN0aW9ucyB7XG4gICAgICAgIHVwZ3JhZGVzPzogQ29tcG9uZW50TWFwO1xuICAgICAgICB0YXJnZXRpbmdDb21wb25lbnRzPzogQ29tcG9uZW50TWFwO1xuICAgIH1cbiAgICBpbnRlcmZhY2UgRG9jdW1lbnQgZXh0ZW5kcyBEb2NBbmRFbGVtZW50SW5qZWN0aW9ucyB7fVxuXG4gICAgaW50ZXJmYWNlIEhUTUxFbGVtZW50IGV4dGVuZHMgRG9jQW5kRWxlbWVudEluamVjdGlvbnMge1xuICAgICAgICBvbmNsaWNrOiBFdmVudFR5cGVzPEhUTUxFbGVtZW50PlsnYWN0aXZhdGUnXXxudWxsO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBXaW5kb3cge1xuICAgICAgICBkb21QYXJzZXI6IERPTVBhcnNlcjtcblxuICAgICAgICAvKiogQSBsaXN0IG9mIGZ1bmN0aW9ucyB1c2VkIHdoZW4gbG9hZGluZyBzY3JpcHRzICovXG4gICAgICAgIGJjZF9pbml0X2Z1bmN0aW9uczogUmVjb3JkPHN0cmluZywgRnVuY3Rpb24+O1xuXG4gICAgICAgIGNvcHlDb2RlKGVsZW06IEhUTUxFbGVtZW50KTogdm9pZDtcblxuICAgICAgICBCQ0RTZXR0aW5nc0Ryb3Bkb3duOiB0eXBlb2YgQkNEU2V0dGluZ3NEcm9wZG93bjtcbiAgICB9XG59XG53aW5kb3cuZG9tUGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXG4vKiogRm9yY2VzIGFuIEhUTUxFbGVtZW50IHRvIGJlIGZvY3VzYWJsZSBieSB0aGUgdXNlciBhbmQgdGhlbiBmb2N1c2VzIGl0XG4gICAgQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZm9jdXNcbiAgICBAcGFyYW0gcHJldmVudFNjcm9sbGluZyBXaGV0aGVyIG9yIG5vdCB0byBwcmV2ZW50IHRoZSBwYWdlIGZyb20gc2Nyb2xsaW5nIHRvIHRoZSBlbGVtZW50LiBEZWZhdWx0cyB0byB0cnVlLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmb2N1c0FueUVsZW1lbnQoZWxlbWVudDpIVE1MRWxlbWVudHx1bmRlZmluZWQsIHByZXZlbnRTY3JvbGxpbmc6IGJvb2xlYW4gPSB0cnVlKTp2b2lke1xuICAgIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5mb2N1cykgcmV0dXJuO1xuXG4gICAgY29uc3QgaGFkVGFiSW5kZXggPSBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICBpZiAoIWhhZFRhYkluZGV4KSBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTgzMTEnKTtcblxuICAgIGVsZW1lbnQuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHByZXZlbnRTY3JvbGxpbmd9KTtcblxuICAgIC8vIFdyYXAgaW5zaWRlIHR3byByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgY2FsbHMgdG8gZW5zdXJlIHRoZSBicm93c2VyIGNvdWxkIGZvY3VzIHRoZSBlbGVtZW50IGJlZm9yZSByZW1vdmluZyB0aGUgdGFiaW5kZXggYXR0cmlidXRlLlxuICAgIG5lc3RBbmltYXRpb25GcmFtZXMoMiwgKCkgPT4ge1xuICAgICAgICBpZiAoIWhhZFRhYkluZGV4KSBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29weUNvZGUoZWxlbTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoIWVsZW0pIHRocm93IG5ldyBFcnJvcihcIk5vIGVsZW1lbnQgcHJvdmlkZWQgdG8gY29weUNvZGUgd2l0aCFcIik7XG5cbiAgICAvL2NvbnNvbGUuZGVidWcoXCJjb3B5Q29kZVwiLCBlbGVtKTtcblxuICAgIC8vIEdldCBjb2RlXG4gICAgY29uc3QgY29kZUVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ2NvZGUnKTtcbiAgICBpZiAoIWNvZGVFbGVtKSB0aHJvdyBuZXcgRXJyb3IoXCJObyBjb2RlIGVsZW1lbnQgZm91bmQgdG8gY29weSBmcm9tIVwiKTtcblxuICAgIC8vIFdyaXRlIGNvZGUgdG8gY2xpcGJvYXJkIChhZnRlciB0cmltbWluZyB0aGUgd2hpdGVzcGFjZSlcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0cmltV2hpdGVzcGFjZShjb2RlRWxlbS50ZXh0Q29udGVudCA/PyAnJywgdHJ1ZSkpO1xuXG4gICAgLy8gU2VsZWN0IHRleHQgKFVYIHN0dW50KVxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKSE7XG4gICAgY29uc3QgdGVtcFJhbmdlID0gbmV3IFJhbmdlKCk7XG4gICAgdGVtcFJhbmdlLnNlbGVjdE5vZGUoY29kZUVsZW0pO1xuICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTsgc2VsZWN0aW9uLmFkZFJhbmdlKHRlbXBSYW5nZSk7XG59XG53aW5kb3cuY29weUNvZGUgPSBjb3B5Q29kZTtcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5wdXRWYWx1ZShpbnB1dDogSFRNTElucHV0RWxlbWVudCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGlucHV0LnZhbHVlIHx8IGlucHV0LmdldEF0dHJpYnV0ZSgnYmNkUGxhY2Vob2xkZXInKSB8fCBpbnB1dC5wbGFjZWhvbGRlciB8fCAnJztcbn1cblxuXG5mdW5jdGlvbiBfX19nZXRPckNyZWF0ZUNoaWxkKHRoaXM6RG9jdW1lbnR8RWxlbWVudCwgdGFnTmFtZTogc3RyaW5nKSB7XG4gICAgbGV0IGNoaWxkID0gdGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKVswXTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcyBpbnN0YW5jZW9mIERvY3VtZW50ID8gdGhpcyA6IHRoaXMub3duZXJEb2N1bWVudDtcbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKGBDcmVhdGluZyAke3RhZ05hbWV9IGVsZW1lbnQgZm9yYCwgdGhpcyk7XG4gICAgICAgIGNoaWxkID0gZG9jLmNyZWF0ZUVsZW1lbnQodGFnTmFtZSwge2lzOiB0YWdOYW1lfSk7XG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZDtcbn1cbkVsZW1lbnQucHJvdG90eXBlLmdldE9yQ3JlYXRlQ2hpbGRCeVRhZyA9IF9fX2dldE9yQ3JlYXRlQ2hpbGQ7XG5Eb2N1bWVudC5wcm90b3R5cGUuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnID0gX19fZ2V0T3JDcmVhdGVDaGlsZDtcblxuZnVuY3Rpb24gX19fcmVtb3ZlQ2hpbGRCeVRhZyh0aGlzOkRvY3VtZW50fEVsZW1lbnQsIHRhZ05hbWU6IHN0cmluZywgY291bnQ6IG51bWJlciA9IDEpIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsuLi50aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpXTtcbiAgICBsZXQgcmVtb3ZlZENvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgcmVtb3ZlZENvdW50IDw9IGNvdW50ICYmIGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBpZiAoIWNoaWxkIHx8IGNoaWxkLnRhZ05hbWUgIT09IHRhZ05hbWUpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNoaWxkLnJlbW92ZSgpO1xuICAgICAgICByZW1vdmVkQ291bnQrKztcbiAgICB9XG59XG5cbkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUNoaWxkQnlUYWcgPSBfX19yZW1vdmVDaGlsZEJ5VGFnO1xuRG9jdW1lbnQucHJvdG90eXBlLnJlbW92ZUNoaWxkQnlUYWcgPSBfX19yZW1vdmVDaGlsZEJ5VGFnO1xuXG4vKioqXG4gKiAgICAgJCQkJCQkXFwgICAgICAgICAgICAgICQkXFwgICAgICAgICAgICQkXFwgICAkJFxcICAgJCRcXCAgICAgJCRcXCAkJFxcICQkXFwgICAkJFxcICAgICAkJFxcXG4gKiAgICAkJCAgX18kJFxcICAgICAgICAgICAgICQkIHwgICAgICAgICAgJCQgfCAgJCQgfCAgJCQgfCAgICBcXF9ffCQkIHxcXF9ffCAgJCQgfCAgICBcXF9ffFxuICogICAgJCQgLyAgXFxfX3wgJCQkJCQkXFwgICQkJCQkJFxcICAgICAgICAgJCQgfCAgJCQgfCQkJCQkJFxcICAgJCRcXCAkJCB8JCRcXCAkJCQkJCRcXCAgICQkXFwgICQkJCQkJFxcICAgJCQkJCQkJFxcXG4gKiAgICBcXCQkJCQkJFxcICAkJCAgX18kJFxcIFxcXyQkICBffCAgICAgICAgJCQgfCAgJCQgfFxcXyQkICBffCAgJCQgfCQkIHwkJCB8XFxfJCQgIF98ICAkJCB8JCQgIF9fJCRcXCAkJCAgX19fX198XG4gKiAgICAgXFxfX19fJCRcXCAkJCQkJCQkJCB8ICAkJCB8ICAgICAgICAgICQkIHwgICQkIHwgICQkIHwgICAgJCQgfCQkIHwkJCB8ICAkJCB8ICAgICQkIHwkJCQkJCQkJCB8XFwkJCQkJCRcXFxuICogICAgJCRcXCAgICQkIHwkJCAgIF9fX198ICAkJCB8JCRcXCAgICAgICAkJCB8ICAkJCB8ICAkJCB8JCRcXCAkJCB8JCQgfCQkIHwgICQkIHwkJFxcICQkIHwkJCAgIF9fX198IFxcX19fXyQkXFxcbiAqICAgIFxcJCQkJCQkICB8XFwkJCQkJCQkXFwgICBcXCQkJCQgIHwgICAgICBcXCQkJCQkJCAgfCAgXFwkJCQkICB8JCQgfCQkIHwkJCB8ICBcXCQkJCQgIHwkJCB8XFwkJCQkJCQkXFwgJCQkJCQkJCAgfFxuICogICAgIFxcX19fX19fLyAgXFxfX19fX19ffCAgIFxcX19fXy8gICAgICAgIFxcX19fX19fLyAgICBcXF9fX18vIFxcX198XFxfX3xcXF9ffCAgIFxcX19fXy8gXFxfX3wgXFxfX19fX19ffFxcX19fX19fXy9cbiAqXG4gKlxuICpcbiAqL1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIFNldDxUPiB7XG4gICAgICAgIC8qKiBDaGFuZ2VzIHRoZSBwb3NpdGlvbiBvZiBhbiBpdGVtIGluIHRoZSBzZXQgcmVsYXRpdmUgdG8gYW5vdGhlciBpdGVtXG4gICAgICAgICAqIEByZXR1cm5zIFdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGNvdWxkIGJlIG1vdmVkXG4gICAgICAgICovXG4gICAgICAgIG1vdmVJdGVtOiB0eXBlb2YgX19fbW92ZUl0ZW07XG5cbiAgICAgICAgLyoqIENoYW5nZXMgdGhlIHBvc2l0aW9uIG9mIGFuIGl0ZW0gaW4gdGhlIHNldCB1c2luZyBhIHByb3ZpZGVkIGluZGV4XG4gICAgICAgICAqIEByZXR1cm5zIFdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGNvdWxkIGJlIG1vdmVkXG4gICAgICAgICovXG4gICAgICAgIG1vdmVJbmRleDogdHlwZW9mIF9fX21vdmVJbmRleDtcbiAgICB9XG59XG5cbi8qKiBDaGFuZ2VzIHRoZSBwb3NpdGlvbiBvZiBhbiBpdGVtIGluIHRoZSBzZXRcbiAqIEByZXR1cm5zIFdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGNvdWxkIGJlIG1vdmVkXG4qL1xuZnVuY3Rpb24gX19fbW92ZUl0ZW08VD4odGhpczogU2V0PFQ+LCBpdGVtOlQsIG5ld0FkamFjZW50SXRlbTpULCByZWxhdGl2ZVBvc2l0aW9uOidhYm92ZSd8J2JlbG93JyA9ICdiZWxvdycpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaGFzKGl0ZW0pIHx8ICF0aGlzLmhhcyhuZXdBZGphY2VudEl0ZW0pKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhcnIgPSBbLi4udGhpc107XG4gICAgY29uc3QgaXRlbUluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgY29uc3QgYWRqYWNlbnRJbmRleCA9IGFyci5pbmRleE9mKG5ld0FkamFjZW50SXRlbSk7XG5cbiAgICBpZiAoaXRlbUluZGV4ID09PSAtMSB8fCBhZGphY2VudEluZGV4ID09PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgYXJyLnNwbGljZShpdGVtSW5kZXgsIDEpO1xuICAgIGFyci5zcGxpY2UoYWRqYWNlbnRJbmRleCArIChyZWxhdGl2ZVBvc2l0aW9uID09PSAnYmVsb3cnID8gMSA6IDApLCAwLCBpdGVtKTtcblxuICAgIHRoaXMuY2xlYXIoKTtcbiAgICBhcnIuZm9yRWFjaChpID0+IHRoaXMuYWRkKGkpKTtcblxuICAgIHJldHVybiB0cnVlO1xufVxuU2V0LnByb3RvdHlwZS5tb3ZlSXRlbSA9IF9fX21vdmVJdGVtO1xuXG4vKiogQ2hhbmdlcyB0aGUgcG9zaXRpb24gb2YgYW4gaXRlbSBpbiB0aGUgc2V0IHVzaW5nIGEgcHJvdmlkZWQgaW5kZXhcbiAqIEByZXR1cm5zIFdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGNvdWxkIGJlIG1vdmVkXG4gKiBAcGFyYW0gbmV3SW5kZXggVGhlIG5ldyBpbmRleCBvZiB0aGUgaXRlbS4gSWYgdGhlIGluZGV4IGlzIG5lZ2F0aXZlLCBpdCB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gb2Zmc2V0IGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4qL1xuZnVuY3Rpb24gX19fbW92ZUluZGV4PFQ+KHRoaXM6IFNldDxUPiwgaXRlbTpULCBuZXdJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmhhcyhpdGVtKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgYXJyID0gWy4uLnRoaXNdO1xuXG4gICAgY29uc3QgaXRlbUluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgaWYgKGl0ZW1JbmRleCA9PT0gLTEpIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChuZXdJbmRleCA8IDApIG5ld0luZGV4ID0gYXJyLmxlbmd0aCArIG5ld0luZGV4O1xuXG4gICAgYXJyLnNwbGljZShpdGVtSW5kZXgsIDEpO1xuICAgIGFyci5zcGxpY2UobmV3SW5kZXgsIDAsIGl0ZW0pO1xuXG4gICAgdGhpcy5jbGVhcigpO1xuICAgIGFyci5mb3JFYWNoKGkgPT4gdGhpcy5hZGQoaSkpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59XG5TZXQucHJvdG90eXBlLm1vdmVJbmRleCA9IF9fX21vdmVJbmRleDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldEluZGV4PFRTdGVwVHlwZT4oc2V0OiBTZXQ8VFN0ZXBUeXBlPiwgaW5kZXg6IG51bWJlcik6IFRTdGVwVHlwZXx1bmRlZmluZWQge1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2V0KSB7XG4gICAgICAgIGlmIChpID09PSBpbmRleCkgcmV0dXJuIGl0ZW07XG4gICAgICAgIGkrKztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF9fX2dldEV4dGVuZHM8SyBleHRlbmRzIGFic3RyYWN0IG5ldyAoLi4uYXJnczogYW55W10pID0+IHVua25vd24+KHRoaXM6IENvbXBvbmVudE1hcCwgdHlwZTogSykge1xuICAgIGNvbnN0IHJldHVyblZhbDpJbnN0YW5jZVR5cGU8Sz5bXSA9IFtdO1xuICAgIGZvciAoY29uc3QgWyx2YWx1ZV0gb2YgdGhpcykgaWYgKHZhbHVlIGluc3RhbmNlb2YgdHlwZSkgcmV0dXJuVmFsLnB1c2godmFsdWUgYXMgSW5zdGFuY2VUeXBlPEs+KTtcbiAgICByZXR1cm4gcmV0dXJuVmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJVcGdyYWRlKHN1YmplY3Q6IEVsZW1lbnQsIHVwZ3JhZGU6IEluc3RhbmNlVHlwZTxDb21wb25lbnQ+LCB0YXJnZXQ/OiBFbGVtZW50fG51bGwsIHByb3BhZ2F0ZVRvVGFyZ2V0Q2hpbGRyZW4gPSBmYWxzZSwgcHJvcGFnYXRlVG9TdWJqZWN0VG9DaGlsZHJlbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgLy9jb25zb2xlLmxvZyhcInJlZ2lzdGVyVXBncmFkZVwiLCB7c3ViamVjdCwgdXBncmFkZSwgdGFyZ2V0LCBwcm9wYWdhdGVUb1RhcmdldENoaWxkcmVuLCBwcm9wYWdhdGVTdWJqZWN0VG9DaGlsZHJlbjogcHJvcGFnYXRlVG9TdWJqZWN0VG9DaGlsZHJlbn0pO1xuICAgIC8vIFNldCB0aGUgdXBncmFkZSBvbiB0aGUgc3ViamVjdFxuICAgIGZvckVhY2hDaGlsZEFuZE9yUGFyZW50KHN1YmplY3QsIHByb3BhZ2F0ZVRvU3ViamVjdFRvQ2hpbGRyZW4sIGNoaWxkID0+IHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlZ2lzdGVyVXBncmFkZTogc3ViamVjdFwiLCBjaGlsZCk7XG4gICAgICAgIGlmICghY2hpbGQudXBncmFkZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKSBhcyBDb21wb25lbnRNYXA7XG4gICAgICAgICAgICBtYXAuZ2V0RXh0ZW5kcyA9IF9fX2dldEV4dGVuZHM7XG4gICAgICAgICAgICBjaGlsZC51cGdyYWRlcyA9IG1hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkLnVwZ3JhZGVzLnNldCh1cGdyYWRlLmNvbnN0cnVjdG9yLCB1cGdyYWRlKTtcbiAgICB9KTtcblxuICAgIC8vIFJlcGVhdCBmb3IgdGFyZ2V0XG4gICAgaWYgKHRhcmdldCkgZm9yRWFjaENoaWxkQW5kT3JQYXJlbnQodGFyZ2V0LCBwcm9wYWdhdGVUb1RhcmdldENoaWxkcmVuLCBjaGlsZCA9PiB7XG4gICAgICAgIGlmICghY2hpbGQudGFyZ2V0aW5nQ29tcG9uZW50cykge1xuICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCgpIGFzIENvbXBvbmVudE1hcDtcbiAgICAgICAgICAgIG1hcC5nZXRFeHRlbmRzID0gX19fZ2V0RXh0ZW5kcztcbiAgICAgICAgICAgIGNoaWxkLnRhcmdldGluZ0NvbXBvbmVudHMgPSBtYXA7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZC50YXJnZXRpbmdDb21wb25lbnRzLnNldCh1cGdyYWRlLmNvbnN0cnVjdG9yLCB1cGdyYWRlKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaENoaWxkQW5kT3JQYXJlbnQoc3RhcnQ6IEVsZW1lbnQsIGRvQ2hpbGRyZW46IGJvb2xlYW4sIGNhbGxiYWNrOiAoY2hpbGQ6IEVsZW1lbnQpID0+IHVua25vd24pOiB2b2lkIHtcbiAgICBpZiAoZG9DaGlsZHJlbikgZm9yRWFjaENoaWxkKHN0YXJ0LCBjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soc3RhcnQpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGQoc3RhcnQ6IEVsZW1lbnQsIGNhbGxiYWNrOiAoY2hpbGQ6IEVsZW1lbnQpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvckVhY2hDaGlsZChzdGFydC5jaGlsZHJlbltpXSEsIGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2soc3RhcnQuY2hpbGRyZW5baV0hKTtcbiAgICB9XG59XG5cbi8qKiBRdWljay1hbmQtZGlydHkgZW51bSBvZiBzdHJpbmdzIHVzZWQgb2Z0ZW4gdGhyb3VnaG91dCB0aGUgY29kZSAqL1xuZW51bSBzdHJzIHtcbiAgICB0cmFuc2l0aW9uRHVyID0gXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXG4gICAgYW5pbUR1ciA9IFwiYW5pbWF0aW9uLWR1cmF0aW9uXCIsXG4gICAgbWFyZ2luVG9wID0gXCJtYXJnaW4tdG9wXCIsXG4gICAgY2xhc3NJc09wZW4gPSBcImlzLW9wZW5cIixcbiAgICBjbGFzc0FkamFjZW50ID0gXCJhZGphY2VudFwiLFxuICAgIGNsYXNzRGV0YWlsc0lubmVyID0gXCJqcy1iY2QtZGV0YWlscy1pbm5lclwiLFxuICAgIGVyckl0ZW0gPSBcIkVycm9yIEl0ZW06XCJcbn1cblxud2luZG93LnF1ZXJ5UGFyYW1zID0ge307XG5cbmlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoWzBdID09PSAnPycpXG4gICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSkuc3BsaXQoJyYnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW0uc3BsaXQoJz0nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChwYXJhbSA9PiB3aW5kb3cucXVlcnlQYXJhbXNbcGFyYW1bMF0hLnRyaW0oKV0gPSBwYXJhbVsxXT8udHJpbSgpID8/ICcnKTtcblxuXG4vKioqXG4gKiAgICAgJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcXG4gKiAgICAkJCAgX18kJFxcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJCB8XG4gKiAgICAkJCAvICBcXF9ffCAkJCQkJCRcXCAgJCQkJCQkXFwkJCQkXFwgICAkJCQkJCRcXCAgICQkJCQkJFxcICAkJCQkJCQkXFwgICAkJCQkJCRcXCAgJCQkJCQkJFxcICAkJCQkJCRcXFxuICogICAgJCQgfCAgICAgICQkICBfXyQkXFwgJCQgIF8kJCAgXyQkXFwgJCQgIF9fJCRcXCAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQgIF9fJCRcXCAkJCAgX18kJFxcIFxcXyQkICBffFxuICogICAgJCQgfCAgICAgICQkIC8gICQkIHwkJCAvICQkIC8gJCQgfCQkIC8gICQkIHwkJCAvICAkJCB8JCQgfCAgJCQgfCQkJCQkJCQkIHwkJCB8ICAkJCB8ICAkJCB8XG4gKiAgICAkJCB8ICAkJFxcICQkIHwgICQkIHwkJCB8ICQkIHwgJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfCQkICAgX19fX3wkJCB8ICAkJCB8ICAkJCB8JCRcXFxuICogICAgXFwkJCQkJCQgIHxcXCQkJCQkJCAgfCQkIHwgJCQgfCAkJCB8JCQkJCQkJCAgfFxcJCQkJCQkICB8JCQgfCAgJCQgfFxcJCQkJCQkJFxcICQkIHwgICQkIHwgIFxcJCQkJCAgfFxuICogICAgIFxcX19fX19fLyAgXFxfX19fX18vIFxcX198IFxcX198IFxcX198JCQgIF9fX18vICBcXF9fX19fXy8gXFxfX3wgIFxcX198IFxcX19fX19fX3xcXF9ffCAgXFxfX3wgICBcXF9fX18vXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXF9ffFxuICogICAgJCQkJCQkJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcXG4gKiAgICBcXF9fJCQgIF9ffCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICQkIHwgICAgJCQkJCQkXFwgICAkJCQkJCRcXCAgICQkJCQkJCRcXCAkJCB8ICAkJFxcICAkJCQkJCRcXCAgICQkJCQkJFxcXG4gKiAgICAgICAkJCB8ICAgJCQgIF9fJCRcXCAgXFxfX19fJCRcXCAkJCAgX19fX198JCQgfCAkJCAgfCQkICBfXyQkXFwgJCQgIF9fJCRcXFxuICogICAgICAgJCQgfCAgICQkIHwgIFxcX198ICQkJCQkJCQgfCQkIC8gICAgICAkJCQkJCQgIC8gJCQkJCQkJCQgfCQkIHwgIFxcX198XG4gKiAgICAgICAkJCB8ICAgJCQgfCAgICAgICQkICBfXyQkIHwkJCB8ICAgICAgJCQgIF8kJDwgICQkICAgX19fX3wkJCB8XG4gKiAgICAgICAkJCB8ICAgJCQgfCAgICAgIFxcJCQkJCQkJCB8XFwkJCQkJCQkXFwgJCQgfCBcXCQkXFwgXFwkJCQkJCQkXFwgJCQgfFxuICogICAgICAgXFxfX3wgICBcXF9ffCAgICAgICBcXF9fX19fX198IFxcX19fX19fX3xcXF9ffCAgXFxfX3wgXFxfX19fX19ffFxcX198XG4gKlxuICpcbiAqXG4gKi9cblxuLyoqIEFueSBjb21wb25lbnQgdGhhdCBjYW4gYmUgYXV0b21hdGljYWxseSBjcmVhdGVkIGJ5IE1hdGVyaWFsIERlc2lnbiBMaXRlICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudCB7XG4gICAgbmV3KGVsZW1lbnQ6IGFueSwgLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbi8qKiBBbnkgY29tcG9uZW50IHRoYXQgZGVmaW5lcyB0aGUgcmVhZG9ubHkgYGNzc0NsYXNzYCBhbmQgYGFzU3RyaW5nYCBwcm9wZXJ0aWVzICovXG5leHBvcnQgaW50ZXJmYWNlIEJDRENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgcmVhZG9ubHkgYXNTdHJpbmc6IHN0cmluZztcbiAgICByZWFkb25seSBjc3NDbGFzczogc3RyaW5nO1xufVxuXG4vLyBDcmVhdGUgYSBtYXAgdGhhdCBndWFyYW50ZWUgYW4gaW5zdGFuY2Ugb2YgdGhlIGtleVxuZXhwb3J0IHR5cGUgQ29tcG9uZW50TWFwID0gTWFwPENvbXBvbmVudCwgSW5zdGFuY2VUeXBlPENvbXBvbmVudD4+ICYge1xuICAgIGdldDxLIGV4dGVuZHMgQ29tcG9uZW50PihrZXk6IEspOiBJbnN0YW5jZVR5cGU8Sz58dW5kZWZpbmVkO1xuICAgIHNldDxLIGV4dGVuZHMgQ29tcG9uZW50PihrZXk6IEssIHZhbHVlOiBJbnN0YW5jZVR5cGU8Sz4pOiBDb21wb25lbnRNYXA7XG5cbiAgICAvKiogRmV0Y2hlcyBhbGwgY2xhc3NlcyB0aGF0IGV4dGVuZCB0aGUgc3BlY2lmaWVkIGNsYXNzICovXG4gICAgZ2V0RXh0ZW5kczxLIGV4dGVuZHMgYWJzdHJhY3QgbmV3KC4uLmFyZ3M6YW55W10pPT51bmtub3duPihrZXk6IEspOiBJbnN0YW5jZVR5cGU8Sz5bXTtcbn1cblxuLyoqIFZhcmlhYmxlIHRvIHN0b3JlIGNvbXBvbmVudHMgdGhhdCB3ZSdsbCBiZSByZWdpc3RlcmluZyBvbiBET00gaW5pdGlhbGl6YXRpb24gKi9cbmNvbnN0IGNvbXBvbmVudHNUb1JlZ2lzdGVyOkJDRENvbXBvbmVudFtdID0gW107XG5cbi8qKiBSZWdpc3RlcnMgYSBzaW5nbGUgTURMIGNvbXBvbmVudCB0aGF0IGhhcyB0aGUgc3RhdGljIHJlYWRvbmx5IHByb3BlcnRpZXMgYGNzc0NsYXNzYCBhbmQgYGFzU3RyaW5nYCBkZWZpbmVkXG4gICAgQHBhcmFtIGNvbXBvbmVudCBUaGUgQkNEQ29tcG9uZW50IHRvIHJlZ2lzdGVyXG4gICAgQHRocm93cyBub3RoaW5nIC0gdGhpcyBmdW5jdGlvbiBncmFjZWZ1bGx5IGhhbmRsZXMgZXJyb3JzIGluIHRoZSBmb3JtIG9mIGBjb25zb2xlLmVycm9yYCBjYWxscyBpbnN0ZWFkIG9mIHRocm93aW5nIGFjdHVhbCBlcnJvcnNcbiAgICBAcmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhbiBlcnJvciBvY2N1cnJlZCB3aXRoIHRoZSBlcnJvciBhcyB0aGUgcmV0dXJuIHZhbHVlXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQkNEQ29tcG9uZW50KGNvbXBvbmVudDpCQ0RDb21wb25lbnQpOmJvb2xlYW58RXJyb3Ige1xuICAgIHRyeXtcblxuICAgICAgICBtZGwuY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcjogY29tcG9uZW50LFxuICAgICAgICAgICAgY2xhc3NBc1N0cmluZzogY29tcG9uZW50LmFzU3RyaW5nLFxuICAgICAgICAgICAgY3NzQ2xhc3M6IGNvbXBvbmVudC5jc3NDbGFzcyxcbiAgICAgICAgICAgIHdpZGdldDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIG1kbC5jb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cyhkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbXBvbmVudC5jc3NDbGFzcykpO1xuXG4gICAgfWNhdGNoKGU6dW5rbm93bil7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQkNELUNvbXBvbmVudHNdIEVycm9yIHJlZ2lzdGVyaW5nIGNvbXBvbmVudFwiLCBjb21wb25lbnQuYXNTdHJpbmcsIFwid2l0aCBjbGFzc1wiLCBjb21wb25lbnQuY3NzQ2xhc3MsIFwiOlxcblwiLCBlKTtcbiAgICAgICAgcmV0dXJuIGUgYXMgRXJyb3I7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cblxuLyoqIFRlbGwgTURMIGFib3V0IG91ciBzaGlueSBuZXcgY29tcG9uZW50c1xuICAgIEBwYXJhbSBjb21wb25lbnRzIFRoZSBjb21wb25lbnRzIHRvIHJlZ2lzdGVyLiBEZWZhdWx0cyB0byB0aGUgZ2xvYmFsIGJjZENvbXBvbmVudHMgYXJyYXkgaWYgbm90IHNwZWNpZmllZC5cbiovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJCQ0RDb21wb25lbnRzKC4uLmNvbXBvbmVudHM6QkNEQ29tcG9uZW50W10pOnZvaWR7XG5cbiAgICBjb25zdCBjb21wb25lbnRBcnIgPSBjb21wb25lbnRzLmxlbmd0aCA/IGNvbXBvbmVudHMgOiBjb21wb25lbnRzVG9SZWdpc3RlcjtcblxuICAgIC8vIFRlbGwgbWRsIGFib3V0IG91ciBzaGlueSBuZXcgY29tcG9uZW50c1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcG9uZW50QXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlZ2lzdGVyQkNEQ29tcG9uZW50KGNvbXBvbmVudEFycltpXSEpO1xuICAgIH1cblxuICAgIC8vY29uc29sZS5kZWJ1ZyhcIltCQ0QtQ29tcG9uZW50c10gUmVnaXN0ZXJlZCB0aGUgZm9sbG93aW5nIGNvbXBvbmVudHM6XCIsIGNvbXBvbmVudEFyci5tYXAoYyA9PiBgXFxuICAgICR7Yy5hc1N0cmluZ31gKS5qb2luKCcnKSk7XG59XG5cblxuXG4vKioqXG4gKiAgICAgJCQkJCQkXFwgICAgICAgICAgICAkJFxcICQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXCAkJFxcICAgICAgICQkXFxcbiAqICAgICQkICBfXyQkXFwgICAgICAgICAgICQkIHwkJCB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxfX3wkJCB8ICAgICAgJCQgfFxuICogICAgJCQgLyAgXFxfX3wgJCQkJCQkXFwgICQkIHwkJCB8ICQkJCQkJFxcICAgJCQkJCQkXFwgICAkJCQkJCQkXFwgJCRcXCAkJCQkJCQkXFwgICQkIHwgJCQkJCQkXFxcbiAqICAgICQkIHwgICAgICAkJCAgX18kJFxcICQkIHwkJCB8IFxcX19fXyQkXFwgJCQgIF9fJCRcXCAkJCAgX19fX198JCQgfCQkICBfXyQkXFwgJCQgfCQkICBfXyQkXFxcbiAqICAgICQkIHwgICAgICAkJCAvICAkJCB8JCQgfCQkIHwgJCQkJCQkJCB8JCQgLyAgJCQgfFxcJCQkJCQkXFwgICQkIHwkJCB8ICAkJCB8JCQgfCQkJCQkJCQkIHxcbiAqICAgICQkIHwgICQkXFwgJCQgfCAgJCQgfCQkIHwkJCB8JCQgIF9fJCQgfCQkIHwgICQkIHwgXFxfX19fJCRcXCAkJCB8JCQgfCAgJCQgfCQkIHwkJCAgIF9fX198XG4gKiAgICBcXCQkJCQkJCAgfFxcJCQkJCQkICB8JCQgfCQkIHxcXCQkJCQkJCQgfCQkJCQkJCQgIHwkJCQkJCQkICB8JCQgfCQkJCQkJCQgIHwkJCB8XFwkJCQkJCQkXFxcbiAqICAgICBcXF9fX19fXy8gIFxcX19fX19fLyBcXF9ffFxcX198IFxcX19fX19fX3wkJCAgX19fXy8gXFxfX19fX19fLyBcXF9ffFxcX19fX19fXy8gXFxfX3wgXFxfX19fX19ffFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJCB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxfX3xcbiAqL1xuXG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJDRF9Db2xsYXBzaWJsZVBhcmVudCB7XG4gICAgLy8gRm9yIGNoaWxkcmVuIHRvIHNldFxuICAgIGRldGFpbHMhOkhUTUxFbGVtZW50O1xuICAgIGRldGFpbHNfaW5uZXIhOkhUTUxFbGVtZW50O1xuICAgIHN1bW1hcnkhOkhUTUxFbGVtZW50O1xuICAgIG9wZW5JY29uczkwZGVnITpIVE1MQ29sbGVjdGlvbjtcblxuICAgIC8vIEZvciB1cyB0byBzZXRcbiAgICBzZWxmOkhUTUxFbGVtZW50O1xuICAgIGFkamFjZW50OmJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGVsbTpIVE1MRWxlbWVudCl7XG4gICAgICAgIHRoaXMuc2VsZiA9IGVsbTtcbiAgICAgICAgdGhpcy5hZGphY2VudCA9IGVsbS5jbGFzc0xpc3QuY29udGFpbnMoc3Rycy5jbGFzc0FkamFjZW50KTtcbiAgICB9XG5cbiAgICBpc09wZW4oKTpib29sZWFuIHsvL3RoaXMuZGVidWdDaGVjaygpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZXRhaWxzLmNsYXNzTGlzdC5jb250YWlucyhzdHJzLmNsYXNzSXNPcGVuKSB8fCB0aGlzLnN1bW1hcnkuY2xhc3NMaXN0LmNvbnRhaW5zKHN0cnMuY2xhc3NJc09wZW4pO1xuICAgIH1cblxuICAgIC8qKiBUb2dnbGUgdGhlIGNvbGxhcHNpYmxlIG1lbnUuICovXG4gICAgdG9nZ2xlKGRvU2V0RHVyYXRpb246Ym9vbGVhbiA9IHRydWUpIHsvL3RoaXMuZGVidWdDaGVjaygpO1xuICAgICAgICBpZiAodGhpcy5pc09wZW4oKSkgeyB0aGlzLmNsb3NlKGRvU2V0RHVyYXRpb24pOyB9IGVsc2UgeyB0aGlzLm9wZW4oZG9TZXREdXJhdGlvbik7IH1cbiAgICB9XG5cbiAgICAvKiogUmUtZXZhbHVhdGUgdGhlIGNvbGxhcHNpYmxlJ3MgY3VycmVudCBzdGF0ZS4gKi9cbiAgICByZUV2YWwoZG9TZXREdXJhdGlvbj86ZmFsc2UpOnZvaWRcbiAgICByZUV2YWwoZG9TZXREdXJhdGlvbj86dHJ1ZSwgaW5zdGFudD86dHJ1ZSk6dm9pZFxuICAgIHJlRXZhbChkb1NldER1cmF0aW9uOmJvb2xlYW4gPSB0cnVlLCBpbnN0YW50Pzp0cnVlKTp2b2lkIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPcGVuKCkpIHRoaXMub3Blbihkb1NldER1cmF0aW9uLCBpbnN0YW50KTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuY2xvc2UoZG9TZXREdXJhdGlvbiwgaW5zdGFudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGVDaGFuZ2VQcm9taXNlKGRlc2lyZWRTdGF0ZT86Ym9vbGVhbik6UHJvbWlzZTx2b2lkPntcblxuICAgICAgICBpZiAoKGRlc2lyZWRTdGF0ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaXNPcGVuKCkgPT09IGRlc2lyZWRTdGF0ZSlcbiAgICAgICAgICAgIHx8IGdldENvbXB1dGVkU3R5bGUodGhpcy5kZXRhaWxzX2lubmVyKS50cmFuc2l0aW9uRHVyYXRpb24gPT09ICcwcycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+eyAgIHRoaXMub25UcmFuc2l0aW9uRW5kKCk7IHJlc29sdmUoKTsgIH0pICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmFuc2l0aW9uRW5kRnVuY3QgPSB0aGlzLm9uVHJhbnNpdGlvbkVuZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdGVuZXIoZXZlbnQ6IFRyYW5zaXRpb25FdmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5wcm9wZXJ0eU5hbWUgIT09ICdtYXJnaW4tdG9wJykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgYWZ0ZXJEZWxheSgxMCwgKCk9PiAge3RyYW5zaXRpb25FbmRGdW5jdChldmVudCk7IHJlc29sdmUoKTt9ICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRldGFpbHNfaW5uZXIuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgLy8gSW1wbGVtZW50ZWQgYXMgYSBzZXBhcmF0ZSBmdW5jdGlvbiBiZWNhdXNlIGl0IFwiYXZvaWRzXCIgYSBjeWNsaWMgcmVmZXJlbmNlLlxuICAgICAgICAgICAgY29uc3QgZGV0YWlsc19pbm5lciA9IHRoaXMuZGV0YWlsc19pbm5lcjtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCl7IGRldGFpbHNfaW5uZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTsgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogT3BlbiB0aGUgY29sbGFwc2libGUgbWVudSBjb250ZW50ICovXG4gICAgb3Blbihkb1NldER1cmF0aW9uID0gdHJ1ZSwgaW5zdGFudCA9IGZhbHNlKSB7Ly90aGlzLmRlYnVnQ2hlY2soKTtcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsID0gdGhpcy5zdGF0ZUNoYW5nZVByb21pc2UodHJ1ZSk7XG5cbiAgICAgICAgaWYgKCFpbnN0YW50KSB0aGlzLmV2YWx1YXRlRHVyYXRpb24oZG9TZXREdXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5kZXRhaWxzX2lubmVyLmFyaWFIaWRkZW4gPSAnZmFsc2UnO1xuICAgICAgICB0aGlzLmRldGFpbHNfaW5uZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgQkNEX0NvbGxhcHNpYmxlUGFyZW50LnNldERpc2FibGVkKHRoaXMuZGV0YWlsc19pbm5lciwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmRldGFpbHMuY2xhc3NMaXN0LmFkZChzdHJzLmNsYXNzSXNPcGVuKTtcbiAgICAgICAgdGhpcy5zdW1tYXJ5LmNsYXNzTGlzdC5hZGQoc3Rycy5jbGFzc0lzT3Blbik7XG5cbiAgICAgICAgbmVzdEFuaW1hdGlvbkZyYW1lcygzLCAoKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc19pbm5lci5zdHlsZS5tYXJnaW5Ub3AgPSB0aGlzLmRldGFpbHMuZ2V0QXR0cmlidXRlKCdkYXRhLW1hcmdpbi10b3AnKSB8fCAnMCc7XG5cbiAgICAgICAgICAgIGlmIChpbnN0YW50KSBuZXN0QW5pbWF0aW9uRnJhbWVzKDIsICgpPT5cbiAgICAgICAgICAgICAgICB0aGlzLmV2YWx1YXRlRHVyYXRpb24uYmluZCh0aGlzLCBkb1NldER1cmF0aW9uLCB0cnVlKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaW5zdGFudCkgcmV0dXJuIHRoaXMuaW5zdGFudFRyYW5zaXRpb24oKTtcblxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsO1xuICAgIH1cblxuICAgIGhhc0Nsb3NlZEZpbmFsID0gZmFsc2U7XG4gICAgLyoqIENsb3NlIHRoZSBjb2xsYXBzaWJsZSBjb250ZW50ICovXG4gICAgY2xvc2UoZG9TZXREdXJhdGlvbjpib29sZWFuID0gdHJ1ZSwgaW5zdGFudCA9IGZhbHNlLCBmaW5hbCA9IGZhbHNlLCBkdXJhdGlvbj86IG51bWJlcikge1xuICAgICAgICAvL2NvbnNvbGUubG9nKGBDbG9zaW5nIGNvbGxhcHNpYmxlIC0gZG9TZXREdXJhdGlvbjogJHtkb1NldER1cmF0aW9ufSwgaW5zdGFudDogJHtpbnN0YW50fSwgZmluYWw6ICR7ZmluYWx9LCBkdXJhdGlvbjogJHtkdXJhdGlvbn1gKTtcblxuICAgICAgICBpZiAodGhpcy5oYXNDbG9zZWRGaW5hbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChmaW5hbCl7XG4gICAgICAgICAgICB0aGlzLnN1bW1hcnkudXBncmFkZXMhLmdldEV4dGVuZHMoQkNEX0NvbGxhcHNpYmxlUGFyZW50KVswXSEuaGFzQ2xvc2VkRmluYWwgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWxzLnVwZ3JhZGVzIS5nZXRFeHRlbmRzKEJDRF9Db2xsYXBzaWJsZVBhcmVudClbMF0hLmhhc0Nsb3NlZEZpbmFsID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB0aGlzLmV2YWx1YXRlRHVyYXRpb24oZG9TZXREdXJhdGlvbiwgZmFsc2UpO1xuICAgICAgICBlbHNlIHRoaXMuZGV0YWlsc19pbm5lci5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG5cbiAgICAgICAgY29uc3QgcmV0dXJuVmFsID0gdGhpcy5zdGF0ZUNoYW5nZVByb21pc2UoZmFsc2UpO1xuXG4gICAgICAgIC8vIFJlZ2lzdGVycyBmb3IgdGhlIGV2ZW50IHR3aWNlIGJlY2F1c2UgdGhlIGV2ZW50IGFwcGVhcnMgdG8gZmlyZSB0d2ljZSwgYXQgbGVhc3QgaW4gQ2hyb21pdW0gYnJvd3NlcnMuXG4gICAgICAgIHRoaXMuZGV0YWlsc19pbm5lci5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7dGhpcy5kZXRhaWxzX2lubmVyLm9mZnNldEhlaWdodCArIDMyfXB4YDtcblxuICAgICAgICB0aGlzLmRldGFpbHMuY2xhc3NMaXN0LnJlbW92ZShzdHJzLmNsYXNzSXNPcGVuKTtcbiAgICAgICAgdGhpcy5zdW1tYXJ5LmNsYXNzTGlzdC5yZW1vdmUoc3Rycy5jbGFzc0lzT3Blbik7XG4gICAgICAgIEJDRF9Db2xsYXBzaWJsZVBhcmVudC5zZXREaXNhYmxlZCh0aGlzLmRldGFpbHNfaW5uZXIsIHRydWUpO1xuXG4gICAgICAgIGlmIChpbnN0YW50KSB7XG4gICAgICAgICAgICBuZXN0QW5pbWF0aW9uRnJhbWVzKDIsICgpID0+IHRoaXMuZXZhbHVhdGVEdXJhdGlvbihkb1NldER1cmF0aW9uLCBmYWxzZSkgKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbnRUcmFuc2l0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmluYWwpIHRoaXMuc3VtbWFyeS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWw7XG4gICAgfVxuXG4gICAgb25UcmFuc2l0aW9uRW5kKGV2ZW50PzpUcmFuc2l0aW9uRXZlbnQpOnZvaWQge1xuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQucHJvcGVydHlOYW1lICE9PSAnbWFyZ2luLXRvcCcpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgICAgICAgQkNEX0NvbGxhcHNpYmxlUGFyZW50LnNldERpc2FibGVkKHRoaXMuZGV0YWlsc19pbm5lciwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc19pbm5lci5hcmlhSGlkZGVuID0gJ3RydWUnO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWxzX2lubmVyLnN0eWxlLnZpc2liaWxpdHkgPSAnbm9uZSc7XG4gICAgICAgICAgICBCQ0RfQ29sbGFwc2libGVQYXJlbnQuc2V0RGlzYWJsZWQodGhpcy5kZXRhaWxzX2lubmVyLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5zdGFudFRyYW5zaXRpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICh0aGlzLmRldGFpbHNfaW5uZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc19pbm5lci5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgMHNgO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWxzX2lubmVyLnN0eWxlLmFuaW1hdGlvbkR1cmF0aW9uID0gYDBzYDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaWNvbiBvZiB0aGlzLm9wZW5JY29uczkwZGVnKSB7XG4gICAgICAgICAgICAgICAgKGljb24gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmFuaW1hdGlvbkR1cmF0aW9uID0gYDBzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkVuZCgpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHIpID0+IHIoKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldERpc2FibGVkKGVsbTpIVE1MRWxlbWVudCwgZGlzYWJsZWQ6Ym9vbGVhbiwgYWxsb3dQb2ludGVyRXZlbnRzID0gdHJ1ZSk6dm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZWxtLmNoaWxkcmVuKVxuICAgICAgICAgICAgdGhpcy5zZXREaXNhYmxlZChjaGlsZCBhcyBIVE1MRWxlbWVudCwgZGlzYWJsZWQpO1xuXG4gICAgICAgIGNvbnN0IHdhc0Rpc2FibGVkID0gZWxtLmdldEF0dHJpYnV0ZSgnZGF0YS13YXMtZGlzYWJsZWQnKSBhcyAndHJ1ZSd8J2ZhbHNlJ3xudWxsO1xuICAgICAgICBjb25zdCBvbGRUYWJJbmRleCA9IGVsbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtb2xkLXRhYmluZGV4Jyk7XG5cbiAgICAgICAgY29uc3QgZm9yY2VQb2ludGVyRXZlbnRzID0gZWxtLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3JjZS1wb2ludGVyLWV2ZW50cycpIGFzICd0cnVlJ3wnZmFsc2UnfG51bGw7XG4gICAgICAgIGlmIChmb3JjZVBvaW50ZXJFdmVudHMgIT09IG51bGwpIGFsbG93UG9pbnRlckV2ZW50cyA9IChmb3JjZVBvaW50ZXJFdmVudHMgPT09ICd0cnVlJyk7XG5cbiAgICAgICAgY29uc3QgZm9yY2VEaXNhYmxlZCA9IGVsbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yY2UtZGlzYWJsZWQnKSBhcyAndHJ1ZSd8J2ZhbHNlJ3xudWxsO1xuICAgICAgICBpZiAoZm9yY2VEaXNhYmxlZCAhPT0gbnVsbCkgZGlzYWJsZWQgPSAoZm9yY2VEaXNhYmxlZCA9PT0gJ3RydWUnKTtcblxuICAgICAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGlmICh3YXNEaXNhYmxlZCA9PT0gbnVsbCkgZWxtLnNldEF0dHJpYnV0ZSgnZGF0YS13YXMtZGlzYWJsZWQnLCBlbG0uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgICAgICAgICBlbG0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgICAgICAgIGVsbS5hcmlhRGlzYWJsZWQgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgIGlmIChvbGRUYWJJbmRleCA9PT0gbnVsbCkgZWxtLnNldEF0dHJpYnV0ZSgnZGF0YS1vbGQtdGFiaW5kZXgnLCBlbG0uZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpIHx8ICcnKTtcbiAgICAgICAgICAgIGVsbS50YWJJbmRleCA9IC0xO1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXQgZGlzYWJsZWQnLCBlbG0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCwgZWxtKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS13YXMtZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgaWYgKHdhc0Rpc2FibGVkID09PSAndHJ1ZScpIGVsbS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgICAgICAgICAgZWxzZSBlbG0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICBlbG0uYXJpYURpc2FibGVkID0gd2FzRGlzYWJsZWQgPT09ICd0cnVlJyA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICAgICAgICAgIGlmIChvbGRUYWJJbmRleCAhPT0gbnVsbCB8fCBlbG0uaGFzQXR0cmlidXRlKCdkYXRhLW9sZC10YWJpbmRleCcpKSB7XG4gICAgICAgICAgICAgICAgb2xkVGFiSW5kZXggPyBlbG0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIG9sZFRhYkluZGV4KSA6IGVsbS5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICAgICAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1vbGQtdGFiaW5kZXgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gYWxsb3dQb2ludGVyRXZlbnRzID8gJycgOiAnbm9uZSc7XG5cbiAgICB9XG5cbiAgICAvKiBEZXRlcm1pbmVzIHdoYXQgdGhlIHRyYW5zaXRpb24gYW5kIGFuaW1hdGlvbiBkdXJhdGlvbiBvZiB0aGUgY29sbGFwc2libGUgbWVudSBpcyAqL1xuICAgIGV2YWx1YXRlRHVyYXRpb24oZG9SdW46Ym9vbGVhbiA9IHRydWUsIG9wZW5pbmc6Ym9vbGVhbj10cnVlKSB7Ly90aGlzLmRlYnVnQ2hlY2soKTtcbiAgICAgICAgaWYgKGRvUnVuICYmIHRoaXMuZGV0YWlsc19pbm5lcikge1xuICAgICAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuZGV0YWlsc19pbm5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmRldGFpbHNfaW5uZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7KG9wZW5pbmcgPyAyNTAgOiAzMDApICsgKChvcGVuaW5nID8gMC4zIDogMC4zNSkgKiAoY29udGVudEhlaWdodCArIDMyKSl9bXNgO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpY29uIG9mIHRoaXMub3Blbkljb25zOTBkZWcpIHtcbiAgICAgICAgICAgICAgICAoaWNvbiBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7IDI1MCArICgwLjE1ICogKGNvbnRlbnRIZWlnaHQgKyAzMikpIH1tc2A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCQ0REZXRhaWxzIGV4dGVuZHMgQkNEX0NvbGxhcHNpYmxlUGFyZW50IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgY3NzQ2xhc3MgPSBcImpzLWJjZC1kZXRhaWxzXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IGFzU3RyaW5nID0gXCJCZWxsQ3ViaWNEZXRhaWxzXCI7XG5cbiAgICAvKiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6SFRNTEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZGV0YWlscyA9IGVsZW1lbnQ7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgY29udGFpbmVyIGVsZW1lbnQgdG8gbWFrZSBhbmltYXRpb24gZ28gYnJyclxuICAgICAgICAvLyBTbGlnaHRseSBvdmVyLWNvbXBsaWNhdGVkIGJlY2F1c2UsIHVoLCBET00gZGlkbid0IHdhbnQgdG8gY29vcGVyYXRlLlxuICAgICAgICB0aGlzLmRldGFpbHNfaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5kZXRhaWxzX2lubmVyLmNsYXNzTGlzdC5hZGQoc3Rycy5jbGFzc0RldGFpbHNJbm5lcik7XG5cbiAgICAgICAgLy8gVGhlIGBjaGlsZHJlbmAgSFRNTENvbGxlY3Rpb24gaXMgbGl2ZSwgc28gd2UncmUgZmV0Y2hpbmcgZWFjaCBlbGVtZW50IGFuZCB0aHJvd2luZyBpdCBpbnRvIGFuIGFycmF5Li4uXG4gICAgICAgIGNvbnN0IHRlbXBfY2hpbGRyZW5BcnI6Q2hpbGROb2RlW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGV0YWlscy5jaGlsZE5vZGVzKXtcbiAgICAgICAgICAgIHRlbXBfY2hpbGRyZW5BcnIucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAuLi5hbmQgYWN0dWFsbHkgbW92aW5nIHRoZSBlbGVtZW50cyBpbnRvIHRoZSBuZXcgZGl2IGhlcmUuXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0ZW1wX2NoaWxkcmVuQXJyKXtcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc19pbm5lci5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGV0YWlscy5hcHBlbmRDaGlsZCh0aGlzLmRldGFpbHNfaW5uZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLmFkamFjZW50KSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wX3N1bW1hcnkgPSB0aGlzLnNlbGYucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmICghdGVtcF9zdW1tYXJ5IHx8ICF0ZW1wX3N1bW1hcnkuY2xhc3NMaXN0LmNvbnRhaW5zKEJDRFN1bW1hcnkuY3NzQ2xhc3MpKSAvKiBUaHJvdyBhbiBlcnJvciovIHtjb25zb2xlLmxvZyhzdHJzLmVyckl0ZW0sIHRoaXMpOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiW0JDRC1ERVRBSUxTXSBFcnJvcjogQWRqYWNlbnQgRGV0YWlscyBlbGVtZW50IG11c3QgYmUgcHJlY2VkZWQgYnkgYSBTdW1tYXJ5IGVsZW1lbnQuXCIpO31cbiAgICAgICAgICAgIHRoaXMuc3VtbWFyeSA9IHRlbXBfc3VtbWFyeSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRlbXBfc3VtbWFyeSA9IHRoaXMuc2VsZi5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5qcy1iY2Qtc3VtbWFyeVtmb3I9XCIke3RoaXMuZGV0YWlscy5pZH1cImApO1xuICAgICAgICAgICAgaWYgKCF0ZW1wX3N1bW1hcnkpIC8qIFRocm93IGFuIGVycm9yKi8ge2NvbnNvbGUubG9nKHN0cnMuZXJySXRlbSwgdGhpcyk7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJbQkNELURFVEFJTFNdIEVycm9yOiBOb24tYWRqYWNlbnQgRGV0YWlscyBlbGVtZW50cyBtdXN0IGhhdmUgYSBTdW1tYXJ5IGVsZW1lbnQgd2l0aCBhIGBmb3JgIGF0dHJpYnV0ZSBtYXRjaGluZyB0aGUgRGV0YWlscyBlbGVtZW50J3MgaWQuXCIpO31cbiAgICAgICAgICAgIHRoaXMuc3VtbWFyeSA9IHRlbXBfc3VtbWFyeSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3Blbkljb25zOTBkZWcgPSB0aGlzLnN1bW1hcnkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3Blbi1pY29uLTkwQ0MnKTtcblxuICAgICAgICBjb25zdCBib3VuZFJlRXZhbCA9IHRoaXMucmVFdmFsSWZDbG9zZWQuYmluZCh0aGlzKTtcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihib3VuZFJlRXZhbCk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcy5kZXRhaWxzX2lubmVyKTtcblxuICAgICAgICB0aGlzLnJlRXZhbCh0cnVlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZWxmLmNsYXNzTGlzdC5hZGQoJ2luaXRpYWxpemVkJyk7XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKHRoaXMuc2VsZiwgdGhpcywgdGhpcy5zdW1tYXJ5LCB0cnVlKTtcbiAgICB9XG5cbiAgICByZUV2YWxJZkNsb3NlZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbigpKSB0aGlzLnJlRXZhbCh0cnVlLCB0cnVlKTtcbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKEJDRERldGFpbHMpO1xuXG5leHBvcnQgY2xhc3MgQkNEU3VtbWFyeSBleHRlbmRzIEJDRF9Db2xsYXBzaWJsZVBhcmVudCB7XG4gICAgc3RhdGljIHJlYWRvbmx5IGNzc0NsYXNzID0gJ2pzLWJjZC1zdW1tYXJ5JztcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXNTdHJpbmcgPSAnQmVsbEN1YmljU3VtbWFyeSc7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkhUTUxFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnN1bW1hcnkgPSBlbGVtZW50O1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLnN1bW1hcnksIHthY3RpdmF0ZTogdGhpcy5hY3RpdmF0ZS5iaW5kKHRoaXMpfSk7XG4gICAgICAgIHRoaXMub3Blbkljb25zOTBkZWcgPSB0aGlzLnN1bW1hcnkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3Blbi1pY29uLTkwQ0MnKTtcblxuICAgICAgICBpZiAodGhpcy5hZGphY2VudCkge1xuICAgICAgICAgICAgY29uc3QgdGVtcF9kZXRhaWxzID0gdGhpcy5zZWxmLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmICghKHRlbXBfZGV0YWlscyAmJiB0ZW1wX2RldGFpbHMuY2xhc3NMaXN0LmNvbnRhaW5zKEJDRERldGFpbHMuY3NzQ2xhc3MpKSkgLyogVGhyb3cgYW4gZXJyb3IqLyB7Y29uc29sZS5sb2coc3Rycy5lcnJJdGVtLCB0aGlzKTsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIltCQ0QtU1VNTUFSWV0gRXJyb3I6IEFkamFjZW50IFN1bW1hcnkgZWxlbWVudCBtdXN0IGJlIHByb2NlZWRlZCBieSBhIERldGFpbHMgZWxlbWVudC5cIik7fVxuICAgICAgICAgICAgdGhpcy5kZXRhaWxzID0gdGVtcF9kZXRhaWxzIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdGVtcF9kZXRhaWxzID0gdGhpcy5zZWxmLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zdW1tYXJ5LmdldEF0dHJpYnV0ZSgnZm9yJykgPz8gJycpO1xuICAgICAgICAgICAgaWYgKCF0ZW1wX2RldGFpbHMpIC8qIFRocm93IGFuIGVycm9yKi8ge2NvbnNvbGUubG9nKHN0cnMuZXJySXRlbSwgdGhpcyk7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJbQkNELVNVTU1BUlldIEVycm9yOiBOb24tYWRqYWNlbnQgRGV0YWlscyBlbGVtZW50cyBtdXN0IGhhdmUgYSBzdW1tYXJ5IGVsZW1lbnQgd2l0aCBhIGBmb3JgIGF0dHJpYnV0ZSBtYXRjaGluZyB0aGUgRGV0YWlscyBlbGVtZW50J3MgaWQuXCIpO31cbiAgICAgICAgICAgIHRoaXMuZGV0YWlscyA9IHRlbXBfZGV0YWlscyBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGl2ZXJ0ZWRDb21wbGV0aW9uKCk7XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKHRoaXMuc2VsZiwgdGhpcywgdGhpcy5kZXRhaWxzLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZGl2ZXJ0ZWRDb21wbGV0aW9uKCl7cXVldWVNaWNyb3Rhc2soKCk9PntcblxuICAgICAgICBjb25zdCB0ZW1wX2lubmVyID0gdGhpcy5kZXRhaWxzLnF1ZXJ5U2VsZWN0b3IoYC4ke3N0cnMuY2xhc3NEZXRhaWxzSW5uZXJ9YCk7XG4gICAgICAgIGlmICghdGVtcF9pbm5lcikge3RoaXMuZGl2ZXJ0ZWRDb21wbGV0aW9uKCk7IHJldHVybjt9XG5cbiAgICAgICAgdGhpcy5kZXRhaWxzX2lubmVyID0gdGVtcF9pbm5lciBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0aGlzLnJlRXZhbCh0cnVlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZWxmLmNsYXNzTGlzdC5hZGQoJ2luaXRpYWxpemVkJyk7XG4gICAgfSk7fVxuXG4gICAgY29ycmVjdEZvY3VzKGtleURvd24/OiBib29sZWFuKSB7XG4gICAgICAgIGlmIChrZXlEb3duKSBmb2N1c0FueUVsZW1lbnQodGhpcy5zdW1tYXJ5IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgZWxzZSByZXR1cm4gbmVzdEFuaW1hdGlvbkZyYW1lcygyLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1bW1hcnkuYmx1cigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhY3RpdmF0ZShldmVudD86TW91c2VFdmVudHxLZXlib2FyZEV2ZW50KXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgIGlmICghZXZlbnQpIHJldHVybjtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHBvaW50ZXIgdHlwZSBpcyB2YWxpZFxuICAgICAgICAgICAgKCgncG9pbnRlclR5cGUnIGluIGV2ZW50KSAmJiAhZXZlbnQucG9pbnRlclR5cGUpXG5cbiAgICAgICAgICAgIC8vIFJlamVjdCB0aGUgZXZlbnQgaWYgdGhlcmUncyBhbiA8YT4gZWxlbWVudCB3aXRoaW4gdGhlIGZpcnN0IDUgZWxlbWVudHMgb2YgdGhlIHBhdGhcbiAgICAgICAgICAgIHx8ICgncGF0aCcgaW4gZXZlbnQgJiYgZXZlbnQucGF0aCAmJiBldmVudC5wYXRoIGluc3RhbmNlb2YgQXJyYXkgJiYgZXZlbnQucGF0aD8uc2xpY2UoMCwgNSkuc29tZSgoZWw6SFRNTEVsZW1lbnQpID0+IGVsLnRhZ05hbWUgPT09ICdBJykpXG4gICAgICAgICkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuY29ycmVjdEZvY3VzKGV2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCk7XG4gICAgfVxufVxuY29tcG9uZW50c1RvUmVnaXN0ZXIucHVzaChCQ0RTdW1tYXJ5KTtcblxuLyoqKlxuICogICAgJCQkJCQkJFxcICAgICAgICAgICAgICAgICAgICAgICAgJCRcXCAgICAgICAkJFxcICAgICAgICAgICAgICAgICAgJCQkJCRcXCAgJCQkJCQkXFwgICAkJCQkJCRcXCAgJCRcXCAgICQkXFxcbiAqICAgICQkICBfXyQkXFwgICAgICAgICAgICAgICAgICAgICAgICQkIHwgICAgICAkJCB8ICAgICAgICAgICAgICAgICBcXF9fJCQgfCQkICBfXyQkXFwgJCQgIF9fJCRcXCAkJCRcXCAgJCQgfFxuICogICAgJCQgfCAgJCQgfCAkJCQkJCRcXCAgICQkJCQkJFxcICAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCRcXCAgICQkXFwgICAgICAgJCQgfCQkIC8gIFxcX198JCQgLyAgJCQgfCQkJCRcXCAkJCB8XG4gKiAgICAkJCQkJCQkICB8JCQgIF9fJCRcXCAkJCAgX18kJFxcIFxcXyQkICBffCAgXFxfJCQgIF98ICAkJCB8ICAkJCB8ICAgICAgJCQgfFxcJCQkJCQkXFwgICQkIHwgICQkIHwkJCAkJFxcJCQgfFxuICogICAgJCQgIF9fX18vICQkIHwgIFxcX198JCQkJCQkJCQgfCAgJCQgfCAgICAgICQkIHwgICAgJCQgfCAgJCQgfCQkXFwgICAkJCB8IFxcX19fXyQkXFwgJCQgfCAgJCQgfCQkIFxcJCQkJCB8XG4gKiAgICAkJCB8ICAgICAgJCQgfCAgICAgICQkICAgX19fX3wgICQkIHwkJFxcICAgJCQgfCQkXFwgJCQgfCAgJCQgfCQkIHwgICQkIHwkJFxcICAgJCQgfCQkIHwgICQkIHwkJCB8XFwkJCQgfFxuICogICAgJCQgfCAgICAgICQkIHwgICAgICBcXCQkJCQkJCRcXCAgIFxcJCQkJCAgfCAgXFwkJCQkICB8XFwkJCQkJCQkIHxcXCQkJCQkJCAgfFxcJCQkJCQkICB8ICQkJCQkJCAgfCQkIHwgXFwkJCB8XG4gKiAgICBcXF9ffCAgICAgIFxcX198ICAgICAgIFxcX19fX19fX3wgICBcXF9fX18vICAgIFxcX19fXy8gIFxcX19fXyQkIHwgXFxfX19fX18vICBcXF9fX19fXy8gIFxcX19fX19fLyBcXF9ffCAgXFxfX3xcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXCAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFwkJCQkJCQgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX19fX19fL1xuICovXG5cbi8qKiBTaW1wbGUgTURMIENsYXNzIHRvIGhhbmRsZSBtYWtpbmcgSlNPTiBwcmV0dHkgYWdhaW5cbiAgICBUYWtlcyB0aGUgdGV4dENvbnRlbnQgb2YgdGhlIGVsZW1lbnQgYW5kIHBhcnNlcyBpdCBhcyBKU09OLCB0aGVuIHJlLXNlcmlhbGl6ZXMgaXQgd2l0aCAyIHNwYWNlcyBwZXIgaW5kZW50LlxuKi9cbmV4cG9ydCBjbGFzcyBQcmV0dHlKU09OIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgY3NzQ2xhc3MgPSAnanMtYmNkLXByZXR0eUpTT04nO1xuICAgIHN0YXRpYyByZWFkb25seSBhc1N0cmluZyA9ICdiY2RfcHJldHR5SlNPTic7XG4gICAgZWxlbWVudF86SFRNTEVsZW1lbnQ7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDpIVE1MRWxlbWVudCkge1xuICAgICAgICByZWdpc3RlclVwZ3JhZGUoZWxlbWVudCwgdGhpcywgbnVsbCwgZmFsc2UsIHRydWUpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShlbGVtZW50LnRleHRDb250ZW50ID8/ICcnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy50ZXh0Q29udGVudCA9IEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCgnaW5pdGlhbGl6ZWQnKTtcbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKFByZXR0eUpTT04pO1xuLypcblxuXG4vKioqXG4gKiAgICAkJFxcICAgICAgJCRcXCAgICAgICAgICAgICAgICAgJCRcXCAgICAgICAgICAgJCRcXCAgICAgICAkJCQkJCQkXFwgICQkXFwgICAgICAgICAgICQkXFxcbiAqICAgICQkJFxcICAgICQkJCB8ICAgICAgICAgICAgICAgICQkIHwgICAgICAgICAgJCQgfCAgICAgICQkICBfXyQkXFwgXFxfX3wgICAgICAgICAgJCQgfFxuICogICAgJCQkJFxcICAkJCQkIHwgJCQkJCQkXFwgICAkJCQkJCQkIHwgJCQkJCQkXFwgICQkIHwgICAgICAkJCB8ICAkJCB8JCRcXCAgJCQkJCQkXFwgICQkIHwgJCQkJCQkXFwgICAkJCQkJCRcXFxuICogICAgJCRcXCQkXFwkJCAkJCB8JCQgIF9fJCRcXCAkJCAgX18kJCB8IFxcX19fXyQkXFwgJCQgfCAgICAgICQkIHwgICQkIHwkJCB8IFxcX19fXyQkXFwgJCQgfCQkICBfXyQkXFwgJCQgIF9fJCRcXFxuICogICAgJCQgXFwkJCQgICQkIHwkJCAvICAkJCB8JCQgLyAgJCQgfCAkJCQkJCQkIHwkJCB8ICAgICAgJCQgfCAgJCQgfCQkIHwgJCQkJCQkJCB8JCQgfCQkIC8gICQkIHwkJCAvICAkJCB8XG4gKiAgICAkJCB8XFwkICAvJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8JCQgIF9fJCQgfCQkIHwgICAgICAkJCB8ICAkJCB8JCQgfCQkICBfXyQkIHwkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHxcbiAqICAgICQkIHwgXFxfLyAkJCB8XFwkJCQkJCQgIHxcXCQkJCQkJCQgfFxcJCQkJCQkJCB8JCQgfCAgICAgICQkJCQkJCQgIHwkJCB8XFwkJCQkJCQkIHwkJCB8XFwkJCQkJCQgIHxcXCQkJCQkJCQgfFxuICogICAgXFxfX3wgICAgIFxcX198IFxcX19fX19fLyAgXFxfX19fX19ffCBcXF9fX19fX198XFxfX3wgICAgICBcXF9fX19fX18vIFxcX198IFxcX19fX19fX3xcXF9ffCBcXF9fX19fXy8gIFxcX19fXyQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJCQkJCQkICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX19fX19fL1xuICovXG5cblxuZXhwb3J0IGNsYXNzIEJDRE1vZGFsRGlhbG9nIGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuICAgIHN0YXRpYyByZWFkb25seSBjc3NDbGFzcyA9ICdqcy1iY2QtbW9kYWwnO1xuICAgIHN0YXRpYyByZWFkb25seSBhc1N0cmluZyA9ICdCZWxsQ3ViaWMgTW9kYWwnO1xuXG4gICAgc3RhdGljIG9iZnVzY2F0b3I6IEhUTUxEaXZFbGVtZW50O1xuICAgIHN0YXRpYyBtb2RhbHNUb1Nob3c6IEJDRE1vZGFsRGlhbG9nW10gPSBbXTtcbiAgICBzdGF0aWMgc2hvd25Nb2RhbDogQkNETW9kYWxEaWFsb2d8bnVsbCA9IG51bGw7XG5cbiAgICBlbGVtZW50XzpIVE1MRGlhbG9nRWxlbWVudHxIVE1MRWxlbWVudDtcbiAgICBjbG9zZUJ5Q2xpY2tPdXRzaWRlOmJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkhUTUxEaWFsb2dFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHJlZ2lzdGVyVXBncmFkZShlbGVtZW50LCB0aGlzLCBudWxsLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hcmlhTW9kYWwgPSAndHJ1ZSc7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFyaWFIaWRkZW4gPSAndHJ1ZSc7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uaGlkZGVuID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keSA/PyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcblxuICAgICAgICAvLyBNb3ZlIGVsZW1lbnQgdG8gdGhlIHRvcCBvZiB0aGUgYm9keSAoanVzdCBvbmUgbW9yZSB0aGluZyB0byBtYWtlIHN1cmUgaXQgc2hvd3MgYWJvdmUgZXZlcnl0aGluZyBlbHNlKVxuICAgICAgICBib2R5LnByZXBlbmQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCFCQ0RNb2RhbERpYWxvZy5vYmZ1c2NhdG9yKSB7XG4gICAgICAgICAgICBCQ0RNb2RhbERpYWxvZy5vYmZ1c2NhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBCQ0RNb2RhbERpYWxvZy5vYmZ1c2NhdG9yLmNsYXNzTGlzdC5hZGQobWRsLk1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuT0JGVVNDQVRPUiwgJ2pzLWJjZC1tb2RhbC1vYmZ1c2NhdG9yJyk7XG4gICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKEJDRE1vZGFsRGlhbG9nLm9iZnVzY2F0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbG9zZUJ5Q2xpY2tPdXRzaWRlID0gIXRoaXMuZWxlbWVudF8uaGFzQXR0cmlidXRlKCduby1jbGljay1vdXRzaWRlJyk7XG5cbiAgICAgICAgYWZ0ZXJEZWxheSgxMDAwLCBmdW5jdGlvbiAodGhpczogQkNETW9kYWxEaWFsb2cpIHsgLy8gTGV0cyB0aGUgRE9NIHNldHRsZSBhbmQgZ2l2ZXMgSmF2YVNjcmlwdCBhIGNoYW5jZSB0byBtb2RpZnkgdGhlIGVsZW1lbnRcblxuICAgICAgICAgICAgY29uc3QgY2xvc2VCdXR0b25zID0gdGhpcy5lbGVtZW50Xy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1iY2QtbW9kYWwtY2xvc2UnKSBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PjtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYnV0dG9uIG9mIGNsb3NlQnV0dG9ucykge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKGJ1dHRvbiwge2FjdGl2YXRlOiB0aGlzLmJvdW5kSGlkZUZ1bmN0aW9ufSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmhhc0F0dHJpYnV0ZSgnb3Blbi1ieS1kZWZhdWx0JykpIHRoaXMuc2hvdygpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHN0YXRpYyBldmFsUXVldWUoZGVsYXk6IG51bWJlciA9IDEwMCk6dm9pZCB7XG5cbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKFwiPT09PT09PT09PT09PT09PT09PT09PT09XFxuRXZhbHVhdGluZyBtb2RhbCBxdWV1ZS4uLlxcbj09PT09PT09PT09PT09PT09PT09PT09PVwiKTtcblxuICAgICAgICAvL2NvbnN0IHdpbGxFeGl0ID0ge1xuICAgICAgICAvLyAgICBzaG93bk1vZGFsOiB0aGlzLnNob3duTW9kYWwsXG4gICAgICAgIC8vICAgIG1vZGFsc1RvU2hvdzogdGhpcy5tb2RhbHNUb1Nob3csXG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIHNob3duTW9kYWxfYm9vbDogISF0aGlzLm1vZGFsc1RvU2hvdy5sZW5ndGgsXG4gICAgICAgIC8vICAgIG1vZGFsc1RvU2hvd19sZW5ndGhCb29sOiAhdGhpcy5tb2RhbHNUb1Nob3cubGVuZ3RoXG4gICAgICAgIC8vfTtcbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKCdXaWxsIGV4aXQ/JywgISEodGhpcy5zaG93bk1vZGFsIHx8ICF0aGlzLm1vZGFsc1RvU2hvdy5sZW5ndGgpLCB3aWxsRXhpdCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd25Nb2RhbCB8fCAhdGhpcy5tb2RhbHNUb1Nob3cubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbW9kYWwgPSBCQ0RNb2RhbERpYWxvZy5tb2RhbHNUb1Nob3cuc2hpZnQoKTsgaWYgKCFtb2RhbCkgcmV0dXJuIHRoaXMuZXZhbFF1ZXVlKCk7XG4gICAgICAgIEJDRE1vZGFsRGlhbG9nLnNob3duTW9kYWwgPSBtb2RhbDtcblxuICAgICAgICAvL2NvbnNvbGUuZGVidWcoXCJTaG93aW5nIG1vZGFsOlwiLCBtb2RhbCk7XG5cbiAgICAgICAgYWZ0ZXJEZWxheShkZWxheSwgbW9kYWwuc2hvd19mb3JSZWFsLmJpbmQobW9kYWwpKTtcbiAgICB9XG5cbiAgICBzaG93KCl7XG4gICAgICAgIEJDRE1vZGFsRGlhbG9nLm1vZGFsc1RvU2hvdy5wdXNoKHRoaXMpO1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcoXCJbQkNELU1PREFMXSBNb2RhbHMgdG8gc2hvdyAoYWZ0ZXIgYXNzaWdubWVudCk6XCIsIGJjZE1vZGFsRGlhbG9nLm1vZGFsc1RvU2hvdyk7XG4gICAgICAgIEJDRE1vZGFsRGlhbG9nLmV2YWxRdWV1ZSgpO1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcoXCJbQkNELU1PREFMXSBNb2RhbHMgdG8gc2hvdyAoYWZ0ZXIgZXZhbCk6XCIsIGJjZE1vZGFsRGlhbG9nLm1vZGFsc1RvU2hvdyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZ3xudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdhZnRlckhpZGUnLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCdkZXRhaWwnIGluIGV2dCAmJiB0eXBlb2YgZXZ0LmRldGFpbCA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZXZ0LmRldGFpbCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfSwge29uY2U6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIEV2ZW50IHNlbnQganVzdCBiZWZvcmUgdGhlIG1vZGFsIGlzIHNob3duXG4gICAgICAgIElmIHRoaXMgZXZlbnQgaXMgY2FuY2VsZWQgb3IgYFByZXZlbnREZWZhdWx0KClgIGlzIGNhbGxlZCwgdGhlIG1vZGFsIHdpbGwgbm90IGJlIHNob3duLlxuXG4gICAgICAgIFRoZSBldmVudCBpcyBmaXJzdCBzZW50IGZvciB0aGUgY2xhc3MgYW5kLCBpZiBub3QgY2FuY2VsZWQgYW5kIGlmIGBQcmV2ZW50RGVmYXVsdCgpYCB3YXMgbm90IGNhbGxlZCwgdGhlIGV2ZW50IGlzIHNlbnQgZm9yIHRoZSBlbGVtZW50LlxuICAgICovXG4gICAgc3RhdGljIHJlYWRvbmx5IGJlZm9yZVNob3dFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnYmVmb3JlU2hvdycsIHtjYW5jZWxhYmxlOiB0cnVlLCBidWJibGVzOiBmYWxzZSwgY29tcG9zZWQ6IGZhbHNlfSk7XG5cbiAgICAvKiogRXZlbnQgc2VudCBqdXN0IGFmdGVyIHRoZSBtb2RhbCBpcyBzaG93blxuXG4gICAgICAgIFRoZSBldmVudCBpcyBmaXJzdCBzZW50IGZvciB0aGUgY2xhc3MgYW5kLCBpZiBub3QgY2FuY2VsZWQgYW5kIGlmIFByZXZlbnREZWZhdWx0KCkgd2FzIG5vdCBjYWxsZWQsIHRoZSBldmVudCBpcyBzZW50IGZvciB0aGUgZWxlbWVudC5cbiAgICAqL1xuICAgIHN0YXRpYyByZWFkb25seSBhZnRlclNob3dFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnYWZ0ZXJTaG93Jywge2NhbmNlbGFibGU6IGZhbHNlLCBidWJibGVzOiBmYWxzZSwgY29tcG9zZWQ6IGZhbHNlfSk7XG5cbiAgICBwcml2YXRlIHNob3dfZm9yUmVhbCgpIHtcbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKFwiW0JDRC1NT0RBTF0gU2hvd2luZyBtb2RhbDpcIiwgdGhpcyk7XG4gICAgICAgIC8qICdCZWZvcmUnIEV2ZW50ICovIGlmICghdGhpcy5kaXNwYXRjaEV2ZW50KEJDRE1vZGFsRGlhbG9nLmJlZm9yZVNob3dFdmVudCkgfHwgIXRoaXMuZWxlbWVudF8uZGlzcGF0Y2hFdmVudChCQ0RNb2RhbERpYWxvZy5iZWZvcmVTaG93RXZlbnQpKSByZXR1cm47XG5cbiAgICAgICAgQkNETW9kYWxEaWFsb2cub2JmdXNjYXRvci5jbGFzc0xpc3QuYWRkKG1kbC5NYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0RSQVdFUl9PUEVOKTtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHMoQkNETW9kYWxEaWFsb2cub2JmdXNjYXRvciwge2FjdGl2YXRlOiB0aGlzLmJvdW5kSGlkZUZ1bmN0aW9ufSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hcmlhSGlkZGVuID0gJ2ZhbHNlJztcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5oaWRkZW4gPSBmYWxzZTtcblxuICAgICAgICBpZiAoJ3Nob3cnIGluIHRoaXMuZWxlbWVudF8pIHRoaXMuZWxlbWVudF8uc2hvdygpO1xuICAgICAgICBlbHNlIHRoaXMuZWxlbWVudF8uc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcoXCJbQkNELU1PREFMXSBNb2RhbCBzaG93bjpcIiwgdGhpcyk7XG5cbiAgICAgICAgLyogJ0FmdGVyJyBFdmVudCAqLyAgaWYgKHRoaXMuZGlzcGF0Y2hFdmVudChCQ0RNb2RhbERpYWxvZy5hZnRlclNob3dFdmVudCkpIHRoaXMuZWxlbWVudF8uZGlzcGF0Y2hFdmVudChCQ0RNb2RhbERpYWxvZy5hZnRlclNob3dFdmVudCk7XG5cbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKFwiW0JDRC1NT0RBTF0gTW9kYWxzIHRvIHNob3cgKGFmdGVyIHNob3cpOlwiLCBiY2RNb2RhbERpYWxvZy5tb2RhbHNUb1Nob3cpO1xuICAgIH1cblxuICAgIC8qKiBFdmVudCBzZW50IGp1c3QgYmVmb3JlIHRoZSBtb2RhbCBpcyBoaWRkZW5cbiAgICAgICAgSWYgdGhpcyBldmVudCBpcyBjYW5jZWxlZCBvciBgUHJldmVudERlZmF1bHQoKWAgaXMgY2FsbGVkLCB0aGUgbW9kYWwgd2lsbCBub3QgYmUgc2hvd24uXG5cbiAgICAgICAgVGhlIGV2ZW50IGlzIGZpcnN0IHNlbnQgZm9yIHRoZSBjbGFzcyBhbmQsIGlmIG5vdCBjYW5jZWxlZCBhbmQgaWYgYFByZXZlbnREZWZhdWx0KClgIHdhcyBub3QgY2FsbGVkLCB0aGUgZXZlbnQgaXMgc2VudCBmb3IgdGhlIGVsZW1lbnQuXG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0QmVmb3JlSGlkZUV2ZW50KG1zZzogc3RyaW5nfG51bGwgPSBudWxsKSB7cmV0dXJuIG5ldyBDdXN0b21FdmVudCgnYmVmb3JlSGlkZScsIHtjYW5jZWxhYmxlOiB0cnVlLCBidWJibGVzOiBmYWxzZSwgY29tcG9zZWQ6IGZhbHNlLCBkZXRhaWw6IG1zZ30pO31cblxuICAgIC8qKiBFdmVudCBzZW50IGp1c3QgYWZ0ZXIgdGhlIG1vZGFsIGlzIGhpZGRlblxuXG4gICAgICAgIFRoZSBldmVudCBpcyBmaXJzdCBzZW50IGZvciB0aGUgY2xhc3MgYW5kLCBpZiBub3QgY2FuY2VsZWQgYW5kIGlmIFByZXZlbnREZWZhdWx0KCkgd2FzIG5vdCBjYWxsZWQsIHRoZSBldmVudCBpcyBzZW50IGZvciB0aGUgZWxlbWVudC5cbiAgICAqL1xuICAgIHN0YXRpYyBnZXRBZnRlckhpZGVFdmVudChtc2c6IHN0cmluZ3xudWxsID0gbnVsbCkge3JldHVybiBuZXcgQ3VzdG9tRXZlbnQoJ2FmdGVySGlkZScsIHtjYW5jZWxhYmxlOiBmYWxzZSwgYnViYmxlczogZmFsc2UsIGNvbXBvc2VkOiBmYWxzZSwgZGV0YWlsOiBtc2d9KTt9XG5cbiAgICAvLyBTdG9yaW5nIHRoZSBib3VuZCBmdW5jdGlvbiBsZXRzIHVzIHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgZnJvbSB0aGUgb2JmdXNjYXRvciBhZnRlciB0aGUgbW9kYWwgaXMgaGlkZGVuXG4gICAgYm91bmRIaWRlRnVuY3Rpb24gPSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcblxuICAgIGhpZGUoZXZ0PzogRXZlbnQpe1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcoXCJbQkNELU1PREFMXSBIaWRpbmcgbW9kYWw6XCIsIHRoaXMpO1xuXG4gICAgICAgIGxldCBtc2cgPSBudWxsO1xuICAgICAgICBpZiAoZXZ0ICYmIGV2dC5jdXJyZW50VGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudClcbiAgICAgICAgICAgIG1zZyA9IGV2dC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1tZXNzYWdlJyk7XG5cbiAgICAgICAgaWYgKGV2dCkgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAvKiAnQmVmb3JlJyBFdmVudCAqLyBpZiAoIXRoaXMuZGlzcGF0Y2hFdmVudChCQ0RNb2RhbERpYWxvZy5nZXRCZWZvcmVIaWRlRXZlbnQobXNnKSkgfHwhdGhpcy5lbGVtZW50Xy5kaXNwYXRjaEV2ZW50KEJDRE1vZGFsRGlhbG9nLmdldEJlZm9yZUhpZGVFdmVudChtc2cpKSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudF8uYXJpYUhpZGRlbiA9ICd0cnVlJztcblxuICAgICAgICBpZiAoJ2Nsb3NlJyBpbiB0aGlzLmVsZW1lbnRfKSB0aGlzLmVsZW1lbnRfLmNsb3NlKCk7XG4gICAgICAgIGVsc2UgdGhpcy5lbGVtZW50Xy5yZW1vdmVBdHRyaWJ1dGUoJ29wZW4nKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRfLmhpZGRlbiA9IHRydWU7XG5cbiAgICAgICAgQkNETW9kYWxEaWFsb2cub2JmdXNjYXRvci5jbGFzc0xpc3QucmVtb3ZlKG1kbC5NYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0RSQVdFUl9PUEVOKTtcbiAgICAgICAgQkNETW9kYWxEaWFsb2cub2JmdXNjYXRvci5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZEhpZGVGdW5jdGlvbik7XG5cbiAgICAgICAgQkNETW9kYWxEaWFsb2cuc2hvd25Nb2RhbCA9IG51bGw7XG5cblxuICAgICAgICAvKiAnQWZ0ZXInIEV2ZW50ICovICBpZiAodGhpcy5kaXNwYXRjaEV2ZW50KEJDRE1vZGFsRGlhbG9nLmdldEFmdGVySGlkZUV2ZW50KG1zZykpKSB0aGlzLmVsZW1lbnRfLmRpc3BhdGNoRXZlbnQoQkNETW9kYWxEaWFsb2cuZ2V0QWZ0ZXJIaWRlRXZlbnQobXNnKSk7XG5cbiAgICAgICAgQkNETW9kYWxEaWFsb2cuZXZhbFF1ZXVlKCk7XG4gICAgfVxuXG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKEJDRE1vZGFsRGlhbG9nKTtcblxuXG4vKioqXG4gKiAgICAkJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkXFxcbiAqICAgICQkICBfXyQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgJCQgfCAgJCQgfCAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCQkJCQkXFwgICAkJCQkJCQkIHwgJCQkJCQkXFwgICQkXFwgICQkXFwgICQkXFwgJCQkJCQkJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgIF9fJCRcXCAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQgIF9fJCQgfCQkICBfXyQkXFwgJCQgfCAkJCB8ICQkIHwkJCAgX18kJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgXFxfX3wkJCAvICAkJCB8JCQgLyAgJCQgfCQkIC8gICQkIHwkJCAvICAkJCB8JCQgfCAkJCB8ICQkIHwkJCB8ICAkJCB8XG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgICAgICQkIHwgICQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwkJCB8ICQkIHwgJCQgfCQkIHwgICQkIHxcbiAqICAgICQkJCQkJCQgIHwkJCB8ICAgICAgXFwkJCQkJCQgIHwkJCQkJCQkICB8XFwkJCQkJCQkIHxcXCQkJCQkJCAgfFxcJCQkJCRcXCQkJCQgIHwkJCB8ICAkJCB8XG4gKiAgICBcXF9fX19fX18vIFxcX198ICAgICAgIFxcX19fX19fLyAkJCAgX19fXy8gIFxcX19fX19fX3wgXFxfX19fX18vICBcXF9fX19fXFxfX19fLyBcXF9ffCAgXFxfX3xcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX198XG4gKi9cblxuLyoqIENsYXNzZXMgdGhhdCBkZXRlcm1pbmUgd2hlcmUgdGhlIG1lbnUgaXMgYWxpZ25lZCByZWxhdGl2ZSB0byB0aGUgYnV0dG9uICovXG5leHBvcnQgZW51bSBtZW51Q29ybmVycyB7XG4gICAgdW5hbGlnbmVkID0gJ21kbC1tZW51LS11bmFsaWduZWQnLFxuICAgIHRvcExlZnQgPSAnbWRsLW1lbnUtLWJvdHRvbS1sZWZ0JyxcbiAgICB0b3BSaWdodCA9ICdtZGwtbWVudS0tYm90dG9tLXJpZ2h0JyxcbiAgICBib3R0b21MZWZ0ID0gJ21kbC1tZW51LS10b3AtbGVmdCcsXG4gICAgYm90dG9tUmlnaHQgPSAnbWRsLW1lbnUtLXRvcC1yaWdodCdcbn1cblxudHlwZSBvcHRpb25PYmogPSBSZWNvcmQ8c3RyaW5nLCBGdW5jdGlvbnxudWxsPlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQkNERHJvcGRvd24gZXh0ZW5kcyBtZGwuTWF0ZXJpYWxNZW51IHtcblxuICAgIGFic3RyYWN0IG9wdGlvbnMoKTogb3B0aW9uT2JqO1xuXG4gICAgZG9SZW9yZGVyOmJvb2xlYW47XG5cbiAgICBvcHRpb25zXzogb3B0aW9uT2JqO1xuICAgIG9wdGlvbnNfa2V5czogc3RyaW5nW107XG5cbiAgICBzZWxlY3RlZE9wdGlvbjogc3RyaW5nID0gJyc7XG5cbiAgICBvdmVycmlkZSBlbGVtZW50XzogSFRNTEVsZW1lbnQ7XG5cbiAgICBzZWxlY3Rpb25UZXh0RWxlbWVudHM6IHVuZGVmaW5lZCB8IEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudCwgYnV0dG9uRWxlbWVudD86IEVsZW1lbnR8bnVsbCwgZG9SZW9yZGVyOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0aGlzLmRvUmVvcmRlciA9IGRvUmVvcmRlcjtcbiAgICAgICAgaWYgKGRvUmVvcmRlcikgdGhpcy5Db25zdGFudF8uQ0xPU0VfVElNRU9VVCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9yRWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8/LnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LmNsaWNrRXZ0LCB0aGlzLmJvdW5kRm9yQ2xpY2tfKTtcbiAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8/LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmJvdW5kRm9yS2V5ZG93bl8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ1dHRvbkVsZW1lbnQgJiYgYnV0dG9uRWxlbWVudCAhPT0gdGhpcy5mb3JFbGVtZW50Xykge1xuICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50XyA9IGJ1dHRvbkVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5mb3JFbGVtZW50Xykge1xuICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5hcmlhSGFzUG9wdXAgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgIC8vIE1ETCBoYXMgY3VzdG9tIGhhbmRsaW5nIGZvciBrZXlib2FyZCB2cyBtb3VzZSBldmVudHMsIHNvIEknbGwgcmVnaXN0ZXIgdGhlbSByYXdcbiAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRGb3JDbGlja18pO1xuICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZEZvcktleWRvd25fKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJbQkNELURST1BET1dOXSBJbml0aWFsaXppbmcgZHJvcGRvd246XCIsIHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBPcHRpb25zID0gdGhpcy5vcHRpb25zKCk7XG4gICAgICAgIHRoaXMub3B0aW9uc18gPSB0ZW1wT3B0aW9ucztcbiAgICAgICAgdGhpcy5vcHRpb25zX2tleXMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnNfKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9uID0gdGhpcy5vcHRpb25zX2tleXNbMF0gPz8gJyc7XG5cbiAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgdGhpcy5vcHRpb25zX2tleXMpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGlvblRleHRFbGVtZW50cyA9IHRoaXMuZm9yRWxlbWVudF8/LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JjZC1kcm9wZG93bl92YWx1ZScpIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+O1xuXG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZU9wdGlvbnMoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgdGhpcy5mb2N1c091dEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKGVsZW1lbnQsIHRoaXMsIHRoaXMuZm9yRWxlbWVudF8sIHRydWUsIHRydWUpO1xuICAgIH1cblxuICAgIGZvY3VzT3V0SGFuZGxlcihldnQ6IEZvY3VzRXZlbnQpe1xuICAgICAgICBpZiAoKGV2dC5yZWxhdGVkVGFyZ2V0IGFzIEVsZW1lbnR8bnVsbCk/LnBhcmVudEVsZW1lbnQgIT09IHRoaXMuZWxlbWVudF8pIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIHNlbGVjdEJ5U3RyaW5nKG9wdGlvbjogc3RyaW5nKXtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc19rZXlzLmluY2x1ZGVzKG9wdGlvbikpIHRoaXMuc2VsZWN0ZWRPcHRpb24gPSBvcHRpb247XG4gICAgICAgIGVsc2UgY29uc29sZS53YXJuKFwiW0JDRC1EUk9QRE9XTl0gQXR0ZW1wdGVkIHRvIHNlbGVjdCBhbiBvcHRpb24gdGhhdCBkb2VzIG5vdCBleGlzdDpcIiwgb3B0aW9uKTtcbiAgICAgICAgdGhpcy51cGRhdGVPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW46IEhUTUxMSUVsZW1lbnRbXSA9IFsuLi50aGlzLmVsZW1lbnRfLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpIF07XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJbQkNELURST1BET1dOXSBVcGRhdGluZyBvcHRpb25zOlwiLCB0aGlzLCBjaGlsZHJlbiwgY2hpbGRyZW4ubWFwKChlbG0pID0+IGVsbS50ZXh0Q29udGVudCksIHRoaXMuc2VsZWN0ZWRPcHRpb24pO1xuXG4gICAgICAgIGlmICh0aGlzLmRvUmVvcmRlcikge1xuICAgICAgICAgICAgY29uc3QgZ29sZGVuQ2hpbGQgPSBjaGlsZHJlbi5maW5kKChlbG0pID0+IChlbG0gYXMgSFRNTExJRWxlbWVudCkudGV4dENvbnRlbnQgPT09IHRoaXMuc2VsZWN0ZWRPcHRpb24pO1xuICAgICAgICAgICAgaWYgKCFnb2xkZW5DaGlsZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JDRC1EUk9QRE9XTl0gRXJyb3JpbmcgaW5zdGFuY2U6XCIsIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCB0aGUgc2VsZWN0ZWQgb3B0aW9uIGluIHRoZSBkcm9wZG93bi4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYWtlU2VsZWN0ZWQoZ29sZGVuQ2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVtb25DaGlsZHJlbiA9IHRoaXMuZG9SZW9yZGVyID8gY2hpbGRyZW4uZmlsdGVyKChlbG0pID0+IChlbG0gYXMgSFRNTExJRWxlbWVudCkudGV4dENvbnRlbnQgIT09IHRoaXMuc2VsZWN0ZWRPcHRpb24pIDogY2hpbGRyZW47XG4gICAgICAgIGRlbW9uQ2hpbGRyZW4uc29ydCggKGEsIGIpID0+IHRoaXMub3B0aW9uc19rZXlzLmluZGV4T2YoYS50ZXh0Q29udGVudCA/PyAnJykgLSB0aGlzLm9wdGlvbnNfa2V5cy5pbmRleE9mKGIudGV4dENvbnRlbnQgPz8gJycpICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBkZW1vbkNoaWxkcmVuKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgIHRoaXMubWFrZU5vdFNlbGVjdGVkKGNoaWxkKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlT3B0aW9uKG9wdGlvbjogc3RyaW5nLCBjbGlja0NhbGxiYWNrPzogRnVuY3Rpb258bnVsbCwgYWRkVG9MaXN0OiBib29sZWFuID0gZmFsc2UpOiBIVE1MTElFbGVtZW50IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaS50ZXh0Q29udGVudCA9IG9wdGlvbjtcbiAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdvcHRpb24tdmFsdWUnLCBvcHRpb24pO1xuICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKCdtZGwtbWVudV9faXRlbScpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJJdGVtKGxpKTtcblxuICAgICAgICBjb25zdCB0ZW1wX2NsaWNrQ2FsbGJhY2sgPSBjbGlja0NhbGxiYWNrID8/IHRoaXMub3B0aW9uc19bb3B0aW9uXSA/PyBudWxsO1xuXG4gICAgICAgIGlmIChhZGRUb0xpc3QpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQobGkpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zX2tleXMucHVzaChvcHRpb24pO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zX1tvcHRpb25dID0gdGVtcF9jbGlja0NhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlbXBfY2xpY2tDYWxsYmFjaykgcmVnaXN0ZXJGb3JFdmVudHMobGksIHthY3RpdmF0ZTogdGVtcF9jbGlja0NhbGxiYWNrLmJpbmQodGhpcyl9KTtcblxuICAgICAgICB0aGlzLm9uQ3JlYXRlT3B0aW9uPy4ob3B0aW9uKTtcbiAgICAgICAgcmV0dXJuIGxpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIG9uSXRlbVNlbGVjdGVkKG9wdGlvbjogSFRNTExJRWxlbWVudCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9uID0gb3B0aW9uLnRleHRDb250ZW50ID8/ICcnO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdiY2QtZHJvcGRvd24tY2hhbmdlJywgeyBkZXRhaWw6IHtkcm9wZG93bjogdGhpcywgb3B0aW9uOiB0aGlzLnNlbGVjdGVkT3B0aW9ufSB9KSk7XG4gICAgICAgIHRoaXMudXBkYXRlT3B0aW9ucygpO1xuICAgIH1cblxuICAgIG9uQ3JlYXRlT3B0aW9uPyhvcHRpb246IHN0cmluZyk6IHZvaWRcblxuICAgIG1ha2VTZWxlY3RlZChvcHRpb246IEhUTUxMSUVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9SZW9yZGVyKSBvcHRpb24uY2xhc3NMaXN0LmFkZCgnbWRsLW1lbnVfX2l0ZW0tLWZ1bGwtYmxlZWQtZGl2aWRlcicpO1xuICAgICAgICBvcHRpb24uYmx1cigpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZWxtIG9mIHRoaXMuc2VsZWN0aW9uVGV4dEVsZW1lbnRzID8/IFtdKSB7XG4gICAgICAgICAgICBlbG0udGV4dENvbnRlbnQgPSBvcHRpb24udGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlTm90U2VsZWN0ZWQob3B0aW9uOiBIVE1MTElFbGVtZW50KSB7XG4gICAgICAgIG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdtZGwtbWVudV9faXRlbS0tZnVsbC1ibGVlZC1kaXZpZGVyJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfb3B0aW9uRWxlbWVudHM6IHVuZGVmaW5lZCB8IEhUTUxDb2xsZWN0aW9uT2Y8SFRNTExJRWxlbWVudD47XG4gICAgZ2V0IG9wdGlvbkVsZW1lbnRzKCk6IEhUTUxDb2xsZWN0aW9uT2Y8SFRNTExJRWxlbWVudD4geyByZXR1cm4gdGhpcy5fb3B0aW9uRWxlbWVudHMgPz89IHRoaXMuZWxlbWVudF8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJykgYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MTElFbGVtZW50PjsgfVxuXG4gICAgaGFzU2hvd25PckhpZGRlblRoaXNGcmFtZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgb3ZlcnJpZGUgc2hvdyhldnQ6IGFueSl7XG4gICAgICAgIGlmICh0aGlzLmhhc1Nob3duT3JIaWRkZW5UaGlzRnJhbWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5oYXNTaG93bk9ySGlkZGVuVGhpc0ZyYW1lID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuaGFzU2hvd25PckhpZGRlblRoaXNGcmFtZSA9IGZhbHNlKTtcblxuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5hcmlhSGlkZGVuID09PSAnZmFsc2UnKSByZXR1cm47XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIltCQ0QtRFJPUERPV05dIFNob3dpbmcgZHJvcGRvd246XCIsIHRoaXMsIGV2dCk7XG5cbiAgICAgICAgaWYgKGV2dCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgfHwgZXZ0IGluc3RhbmNlb2YgUG9pbnRlckV2ZW50ICYmIGV2dC5wb2ludGVySWQgPT09IC0xIHx8ICdtb3pJbnB1dFNvdXJjZScgaW4gZXZ0ICYmIGV2dC5tb3pJbnB1dFNvdXJjZSAhPT0gMSlcbiAgICAgICAgICAgIHRoaXMub3B0aW9uRWxlbWVudHNbMF0/LmZvY3VzKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hcmlhSGlkZGVuID0gJ2ZhbHNlJztcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIGlmICh0aGlzLmZvckVsZW1lbnRfKSB0aGlzLmZvckVsZW1lbnRfLmFyaWFFeHBhbmRlZCA9ICd0cnVlJztcblxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5vcHRpb25FbGVtZW50cykgaXRlbS50YWJJbmRleCA9IDA7XG5cbiAgICAgICAgdGhpcy5mb3JFbGVtZW50Xz8udGFyZ2V0aW5nQ29tcG9uZW50cz8uZ2V0KEJDRFRvb2x0aXApPy5oaWRlKCk7XG5cbiAgICAgICAgc3VwZXIuc2hvdyhldnQpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGhpZGUoKXtcbiAgICAgICAgaWYgKHRoaXMuaGFzU2hvd25PckhpZGRlblRoaXNGcmFtZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLmhhc1Nob3duT3JIaWRkZW5UaGlzRnJhbWUgPSB0cnVlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5oYXNTaG93bk9ySGlkZGVuVGhpc0ZyYW1lID0gZmFsc2UpO1xuXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmFyaWFIaWRkZW4gPT09ICd0cnVlJykgcmV0dXJuO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJbQkNELURST1BET1dOXSBIaWRpbmcgZHJvcGRvd246XCIsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMub3B0aW9uRWxlbWVudHNbMF0/LmJsdXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRfLmFyaWFIaWRkZW4gPSAndHJ1ZSc7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgICAgaWYgKHRoaXMuZm9yRWxlbWVudF8pIHRoaXMuZm9yRWxlbWVudF8uYXJpYUV4cGFuZGVkID0gJ2ZhbHNlJztcblxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5vcHRpb25FbGVtZW50cykgaXRlbS50YWJJbmRleCA9IC0xO1xuXG4gICAgICAgIHN1cGVyLmhpZGUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBiY2REcm9wZG93bl9Bd2Vzb21lQnV0dG9uIGV4dGVuZHMgQkNERHJvcGRvd24ge1xuICAgIHN0YXRpYyByZWFkb25seSBhc1N0cmluZyA9ICdCQ0QgLSBEZWJ1Z2dlclxcJ3MgQWxsLVBvd2VyZnVsIEJ1dHRvbic7XG4gICAgc3RhdGljIHJlYWRvbmx5IGNzc0NsYXNzID0gJ2pzLWJjZC1kZWJ1Z2dlcnMtYWxsLXBvd2VyZnVsLWJ1dHRvbic7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIG9wdGlvbnMoKTogUmVjb3JkPHN0cmluZywgRnVuY3Rpb258bnVsbD4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ1ZpZXcgRGVidWcgUGFnZSc6ICgpID0+IHtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVidWctbGluaycpPy5jbGljaygpO30sXG4gICAgICAgICAgICAnVG9nZ2xlIFBhZ2UgTW9ub2Nocm9tZSc6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgWywgc3RhcnQsIHBlcmNlbnRhZ2UsIGVuZF0gPSBkb2N1bWVudC5ib2R5LnN0eWxlLmZpbHRlci5tYXRjaCgvKC4qKWdyYXlzY2FsZVxcKCguKj8pXFwpKC4qKS8pID8/IFtdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID8/PSAnJzsgcGVyY2VudGFnZSA/Pz0gJyc7IGVuZCA/Pz0gJyc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5maWx0ZXIgPSBgJHtzdGFydH1ncmF5c2NhbGUoJHtwZXJjZW50YWdlID09PSAnMTAwJScgPyAnMCUnIDogJzEwMCUnfSkke2VuZH1gO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKGJjZERyb3Bkb3duX0F3ZXNvbWVCdXR0b24pO1xuXG5cblxuLyoqKlxuICogICAgJCQkJCQkJCRcXCAgICAgICAgICAgJCRcXCAgICAgICAkJFxcICAgICAgICAgICAgICAgICAgICAgICAkJFxcXG4gKiAgICBcXF9fJCQgIF9ffCAgICAgICAgICAkJCB8ICAgICAgJCQgfCAgICAgICAgICAgICAgICAgICAgICAkJCB8XG4gKiAgICAgICAkJCB8ICAgICQkJCQkJFxcICAkJCQkJCQkXFwgICQkJCQkJCRcXCAgICQkJCQkJFxcICAgJCQkJCQkJCB8XG4gKiAgICAgICAkJCB8ICAgIFxcX19fXyQkXFwgJCQgIF9fJCRcXCAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQgIF9fJCQgfFxuICogICAgICAgJCQgfCAgICAkJCQkJCQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfCQkJCQkJCQkIHwkJCAvICAkJCB8XG4gKiAgICAgICAkJCB8ICAgJCQgIF9fJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8JCQgICBfX19ffCQkIHwgICQkIHxcbiAqICAgICAgICQkIHwgICBcXCQkJCQkJCQgfCQkJCQkJCQgIHwkJCQkJCQkICB8XFwkJCQkJCQkXFwgXFwkJCQkJCQkIHxcbiAqICAgICAgIFxcX198ICAgIFxcX19fX19fX3xcXF9fX19fX18vIFxcX19fX19fXy8gIFxcX19fX19fX3wgXFxfX19fX19ffFxuICpcbiAqXG4gKlxuICogICAgJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcXG4gKiAgICAkJCB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgJCQgfCAgICAgICAkJCQkJCRcXCAgJCRcXCAgICQkXFwgICQkJCQkJFxcICAkJFxcICAgJCRcXCAkJCQkJCRcXFxuICogICAgJCQgfCAgICAgICBcXF9fX18kJFxcICQkIHwgICQkIHwkJCAgX18kJFxcICQkIHwgICQkIHxcXF8kJCAgX3xcbiAqICAgICQkIHwgICAgICAgJCQkJCQkJCB8JCQgfCAgJCQgfCQkIC8gICQkIHwkJCB8ICAkJCB8ICAkJCB8XG4gKiAgICAkJCB8ICAgICAgJCQgIF9fJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfCAgJCQgfCQkXFxcbiAqICAgICQkJCQkJCQkXFwgXFwkJCQkJCQkIHxcXCQkJCQkJCQgfFxcJCQkJCQkICB8XFwkJCQkJCQgIHwgIFxcJCQkJCAgfFxuICogICAgXFxfX19fX19fX3wgXFxfX19fX19ffCBcXF9fX18kJCB8IFxcX19fX19fLyAgXFxfX19fX18vICAgIFxcX19fXy9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgJCRcXCAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgXFwkJCQkJCQgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIFxcX19fX19fL1xuICovXG5cbmV4cG9ydCBjbGFzcyBCQ0RUYWJCdXR0b24gZXh0ZW5kcyBtZGwuTWF0ZXJpYWxCdXR0b24ge1xuICAgIHN0YXRpYyByZWFkb25seSBhc1N0cmluZyA9ICdCQ0QgLSBUYWIgTGlzdCBCdXR0b24nO1xuICAgIHN0YXRpYyByZWFkb25seSBjc3NDbGFzcyA9ICdqcy10YWItbGlzdC1idXR0b24nO1xuXG4gICAgc3RhdGljIGFuY2hvclRvU2V0ID0gJyc7XG5cbiAgICBvdmVycmlkZSBlbGVtZW50XzogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgYm91bmRUYWI6SFRNTERpdkVsZW1lbnQ7XG4gICAgbmFtZTpzdHJpbmcgPSAnJztcbiAgICBzZXRBbmNob3I6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgIT09ICdCVVRUT04nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIEJlbGxDdWJpYyBUYWIgQnV0dG9uIG11c3QgYmUgY3JlYXRlZCBkaXJlY3RseSBmcm9tIGEgPGJ1dHRvbj4gZWxlbWVudC4nKTtcblxuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICAgICAgaWYgKCFuYW1lKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIEJlbGxDdWJpYyBUYWIgQnV0dG9uIG11c3QgaGF2ZSBhIG5hbWUgYXR0cmlidXRlLicpO1xuXG4gICAgICAgIGNvbnN0IGJvdW5kVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2LnRhYi1jb250ZW50W25hbWU9XCIke25hbWV9XCJdYCkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIGlmICghYm91bmRUYWIpIHRocm93IG5ldyBUeXBlRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgdGFiIHdpdGggdGhlIG5hbWUgXCIke25hbWV9XCIuYCk7XG4gICAgICAgIGlmICghYm91bmRUYWIucGFyZW50RWxlbWVudCkgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGFiIHdpdGggbmFtZSBcIiR7bmFtZX1cIiBoYXMgbm8gcGFyZW50IGVsZW1lbnQhYCk7XG5cbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuXG4gICAgICAgIHN1cGVyKGVsZW1lbnQpOyAvLyBOb3cgd2UgY2FuIHVzZSBgdGhpc2AhXG4gICAgICAgIHJlZ2lzdGVyVXBncmFkZShlbGVtZW50LCB0aGlzLCBib3VuZFRhYiwgZmFsc2UsIHRydWUpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgICAgICB0aGlzLmJvdW5kVGFiID0gYm91bmRUYWI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhZ2Ugd2FzIHJlbG9hZGVkXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gd2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUoXCJuYXZpZ2F0aW9uXCIpPy5bMF07XG4gICAgICAgIHRoaXMuc2V0QW5jaG9yID0gZWxlbWVudC5wYXJlbnRFbGVtZW50Py5oYXNBdHRyaWJ1dGUoJ2RvLXRhYi1hbmNob3InKSA/PyBmYWxzZTtcblxuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLmVsZW1lbnRfLCB7YWN0aXZhdGU6IHRoaXMuYWN0aXZhdGUuYmluZCh0aGlzKX0pO1xuXG4gICAgICAgIGlmIChlbnRyeSAmJiAndHlwZScgaW4gZW50cnkgJiYgZW50cnkudHlwZSA9PT0gJ3JlbG9hZCcpXG4gICAgICAgICAgICB0aGlzLm1ha2VTZWxlY3RlZCgwKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZXRBbmNob3IgJiYgd2luZG93LmxvY2F0aW9uLmhhc2gudG9Mb3dlckNhc2UoKSA9PT0gYCN0YWItJHtuYW1lfWAudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgIHF1ZXVlTWljcm90YXNrKHRoaXMubWFrZVNlbGVjdGVkLmJpbmQodGhpcykpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLm1ha2VTZWxlY3RlZCgwKTtcbiAgICB9XG5cbiAgICAvKiogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoaXMgdGFiICgwLWJhc2VkKSBvciAtMSBpZiBub3QgZm91bmQgKi9cbiAgICBmaW5kVGFiTnVtYmVyKGJ1dHRvbl8/OiBFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uXyA/PyB0aGlzLmVsZW1lbnRfO1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcoJ2ZpbmRUYWJOdW1iZXI6IC0gYnV0dG9uOicsIGJ1dHRvbiwgJ2FycmF5OicsIFsuLi4oYnV0dG9uLnBhcmVudEVsZW1lbnQ/LmNoaWxkcmVuID8/IFtdKV0sICdpbmRleDonLCBbLi4uKGJ1dHRvbi5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSldLmluZGV4T2YoYnV0dG9uKSk7XG4gICAgICAgIHJldHVybiBbLi4uKGJ1dHRvbi5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSldLmluZGV4T2YoYnV0dG9uKTtcbiAgICB9XG5cbiAgICBtYWtlU2VsZWN0ZWQodGFiTnVtYmVyXz86IG51bWJlcikge1xuICAgICAgICBjb25zdCB0YWJOdW1iZXIgPSB0YWJOdW1iZXJfID8/IHRoaXMuZmluZFRhYk51bWJlcigpO1xuICAgICAgICBpZiAodGFiTnVtYmVyID09PSAtMSkgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCB0aGUgdGFiIG51bWJlci4nKTtcbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKCdtYWtlU2VsZWN0ZWQ6IHRhYk51bWJlcjonLCB0YWJOdW1iZXIpO1xuXG4gICAgICAgIGNvbnN0IHNpYmxpbmdzQW5kU2VsZiA9IFsuLi4odGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSldO1xuICAgICAgICBpZiAoIXNpYmxpbmdzQW5kU2VsZlt0YWJOdW1iZXJdIHx8IHNpYmxpbmdzQW5kU2VsZlt0YWJOdW1iZXJdIS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBzaWJsaW5nIG9mIHNpYmxpbmdzQW5kU2VsZikge1xuICAgICAgICAgICAgaWYgKHNpYmxpbmcgPT09IHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgICAgICBzaWJsaW5nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgc2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuYm91bmRUYWIucGFyZW50RWxlbWVudCkgcmV0dXJuOyAvLyBJIHdvdWxkIHdvcnJ5IGFib3V0IHJhY2UgY29uZGl0aW9ucywgYnV0IGJyb3dzZXJzIHJ1biB3ZWJzaXRlcyBpbiBhbiBFdmVudCBMb29wLlxuXG4gICAgICAgIGNvbnN0IHRhYl9zaWJsaW5nc0FuZFRhYiA9IFsuLi50aGlzLmJvdW5kVGFiLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5dO1xuICAgICAgICBmb3IgKGNvbnN0IHRhYiBvZiB0YWJfc2libGluZ3NBbmRUYWIpIHtcblxuICAgICAgICAgICAgaWYgKHRhYiA9PT0gdGhpcy5ib3VuZFRhYikge1xuICAgICAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0YWIuY2xhc3NMaXN0LnJlbW92ZSgndGFiLWNvbnRlbnQtLWhpZGRlbicpO1xuICAgICAgICAgICAgICAgIGlmICgnaW5lcnQnIGluICh0YWIgYXMgSFRNTEVsZW1lbnQpKSAodGFiIGFzIEhUTUxFbGVtZW50KS5pbmVydCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgICAgIHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRUYWIucGFyZW50RWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gYC0ke3RhYk51bWJlcn0wMHZ3YDtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFkZEhpZGRlbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKCd0YWItY29udGVudC0taGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgnaW5lcnQnIGluICh0YWIgYXMgSFRNTEVsZW1lbnQpKSAodGFiIGFzIEhUTUxFbGVtZW50KS5pbmVydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhYi5wYXJlbnRFbGVtZW50IS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgYWRkSGlkZGVuLCB7b25jZTogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgIGFmdGVyRGVsYXkoMjUwLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRhYi5wYXJlbnRFbGVtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgYWRkSGlkZGVuKTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSGlkZGVuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAgICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZXRBbmNob3IpIHtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgVVJMIGhhc2ggLSBpZiB0aGUgdGFiIGlzIG5vdCB0aGUgZmlyc3QgdGFiLCB0aGVuIGFkZCB0aGUgdGFiIG5hbWUgdG8gdGhlIGhhc2guIE90aGVyd2lzZSwgcmVtb3ZlIHRoZSBoYXNoLlxuICAgICAgICAgICAgQkNEVGFiQnV0dG9uLmFuY2hvclRvU2V0ID0gdGFiTnVtYmVyID09IDAgPyAnJyA6IGAjdGFiLSR7dGhpcy5uYW1lfWAudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIEJDRFRhYkJ1dHRvbi5zZXRBbmNob3JJbjNBbmltRnJhbWVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogU2V0cyBgd2luZG93LmxvY2F0aW9uLmhhc2hgIHRvIHRoZSB2YWx1ZSBvZiBgYmNkVGFiQnV0dG9uLmFuY2hvclRvU2V0YCBpbiB0aHJlZSBhbmltYXRpb24gZnJhbWVzLiAqL1xuICAgIHN0YXRpYyBzZXRBbmNob3JJbjNBbmltRnJhbWVzKCkge1xuICAgICAgICBuZXN0QW5pbWF0aW9uRnJhbWVzKDMsICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChCQ0RUYWJCdXR0b24uYW5jaG9yVG9TZXQgPT09ICcnKSB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Ugd2luZG93LmxvY2F0aW9uLmhhc2ggPSBCQ0RUYWJCdXR0b24uYW5jaG9yVG9TZXQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1ha2VTZWxlY3RlZCgpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmJsdXIoKTtcbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKEJDRFRhYkJ1dHRvbik7XG5cblxuXG5cbi8qKipcbiAqICAgICQkJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCRcXCAgICAgJCRcXFxuICogICAgXFxfXyQkICBfX3wgICAgICAgICAgICAgICAgICAgICQkIHwgICQkIHwgICAgXFxfX3xcbiAqICAgICAgICQkIHwgICAgJCQkJCQkXFwgICAkJCQkJCRcXCAgJCQgfCQkJCQkJFxcICAgJCRcXCAgJCQkJCQkXFwgICAkJCQkJCQkXFxcbiAqICAgICAgICQkIHwgICAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQgfFxcXyQkICBffCAgJCQgfCQkICBfXyQkXFwgJCQgIF9fX19ffFxuICogICAgICAgJCQgfCAgICQkIC8gICQkIHwkJCAvICAkJCB8JCQgfCAgJCQgfCAgICAkJCB8JCQgLyAgJCQgfFxcJCQkJCQkXFxcbiAqICAgICAgICQkIHwgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwkJFxcICQkIHwkJCB8ICAkJCB8IFxcX19fXyQkXFxcbiAqICAgICAgICQkIHwgICBcXCQkJCQkJCAgfFxcJCQkJCQkICB8JCQgfCAgXFwkJCQkICB8JCQgfCQkJCQkJCQgIHwkJCQkJCQkICB8XG4gKiAgICAgICBcXF9ffCAgICBcXF9fX19fXy8gIFxcX19fX19fLyBcXF9ffCAgIFxcX19fXy8gXFxfX3wkJCAgX19fXy8gXFxfX19fX19fL1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxfX3xcbiAqL1xuXG5cbmV4cG9ydCBjbGFzcyBCQ0RUb29sdGlwIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXNTdHJpbmcgPSAnQkNEIC0gVG9vbHRpcCc7XG4gICAgc3RhdGljIHJlYWRvbmx5IGNzc0NsYXNzID0gJ2pzLWJjZC10b29sdGlwJztcblxuICAgIHJlbGF0aW9uOiAncHJlY2VkaW5nJyB8ICdwcm9jZWVkaW5nJyB8ICdjaGlsZCcgfCAnc2VsZWN0b3InO1xuICAgIHBvc2l0aW9uOiAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JyA9ICd0b3AnO1xuXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgYm91bmRFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICBnYXBCcmlkZ2VFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIG9wZW5EZWxheU1TOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7IGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXJvbGUnLCAndG9vbHRpcCcpO1xuXG4gICAgICAgIHRoaXMuZ2FwQnJpZGdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmdhcEJyaWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnanMtYmNkLXRvb2x0aXBfZ2FwLWJyaWRnZScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5nYXBCcmlkZ2VFbGVtZW50KTtcblxuICAgICAgICB0aGlzLm9wZW5EZWxheU1TID0gIHBhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdvcGVuLWRlbGF5LW1zJykgPz8gJzQwMCcpO1xuXG5cbiAgICAgICAgY29uc3QgdGVtcFJlbGF0aW9uID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3Rvb2x0aXAtcmVsYXRpb24nKSA/PyAncHJvY2VlZGluZyc7XG5cbiAgICAgICAgbGV0IHRlbXBFbGVtZW50O1xuXG4gICAgICAgIHN3aXRjaCAodGVtcFJlbGF0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdwcmVjZWRpbmcnOiB0ZW1wRWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Byb2NlZWRpbmcnOiB0ZW1wRWxlbWVudCA9IGVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZzsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjaGlsZCc6IHRlbXBFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50OyBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnc2VsZWN0b3InOiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndG9vbHRpcC1zZWxlY3RvcicpID8/ICcnO1xuICAgICAgICAgICAgICAgIHRlbXBFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/PyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGJyZWFrOyB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0b29sdGlwLXJlbGF0aW9uIGF0dHJpYnV0ZSEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVsYXRpb24gPSB0ZW1wUmVsYXRpb247XG5cbiAgICAgICAgaWYgKCF0ZW1wRWxlbWVudCB8fCAhKHRlbXBFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpICkgdGhyb3cgbmV3IEVycm9yKCdUT09MVElQIC0gQ291bGQgbm90IGZpbmQgYSB2YWxpZCBIVE1MIEVsZW1lbnQgdG8gYmluZCB0byEnKTtcbiAgICAgICAgdGhpcy5ib3VuZEVsZW1lbnQgPSB0ZW1wRWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKGVsZW1lbnQsIHRoaXMsIHRoaXMuYm91bmRFbGVtZW50LCB0cnVlLCB0cnVlKTtcblxuICAgICAgICBjb25zdCB0ZW1wUG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3Rvb2x0aXAtcG9zaXRpb24nKTtcblxuICAgICAgICBzd2l0Y2ggKHRlbXBQb3MpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6ICBjYXNlICdib3R0b20nOiAgY2FzZSAnbGVmdCc6ICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRlbXBQb3M7IGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdG9vbHRpcC1wb3NpdGlvbiBhdHRyaWJ1dGUhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBib3VuZEVudGVyID0gdGhpcy5oYW5kbGVIb3ZlckVudGVyLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbnN0IGJvdW5kTGVhdmUgPSB0aGlzLmhhbmRsZUhvdmVyTGVhdmUuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgYm91bmRUb3VjaCA9IHRoaXMuaGFuZGxlVG91Y2guYmluZCh0aGlzKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBib3VuZExlYXZlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuXG4gICAgICAgIHRoaXMuYm91bmRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAgYm91bmRFbnRlcik7ICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAgYm91bmRFbnRlcik7XG4gICAgICAgIHRoaXMuYm91bmRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAgYm91bmRMZWF2ZSk7ICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAgYm91bmRMZWF2ZSk7XG5cbiAgICAgICAgdGhpcy5ib3VuZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICBib3VuZFRvdWNoLCB7cGFzc2l2ZTogdHJ1ZX0pOyB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICBib3VuZFRvdWNoLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgICB0aGlzLmJvdW5kRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCAgIGJvdW5kVG91Y2gsIHtwYXNzaXZlOiB0cnVlfSk7IHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCAgIGJvdW5kVG91Y2gsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICAgIHRoaXMuYm91bmRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgICAgYm91bmRUb3VjaCwge3Bhc3NpdmU6IHRydWV9KTsgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgICAgYm91bmRUb3VjaCwge3Bhc3NpdmU6IHRydWV9KTtcbiAgICAgICAgdGhpcy5ib3VuZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBib3VuZFRvdWNoLCB7cGFzc2l2ZTogdHJ1ZX0pOyB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBib3VuZFRvdWNoLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGhhbmRsZVRvdWNoKGV2ZW50OiBUb3VjaEV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDApIHRoaXMuaGFuZGxlSG92ZXJFbnRlcih1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICBlbHNlIHRoaXMuaGFuZGxlSG92ZXJMZWF2ZSgpO1xuICAgIH1cblxuICAgIGhhbmRsZUhvdmVyRW50ZXIoZXZlbnQ/OiBNb3VzZUV2ZW50fEZvY3VzRXZlbnQsIGJ5cGFzc1dhaXQ/OiB0cnVlKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgPyBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50Py54ID8/IDAsIGV2ZW50Py55ID8/IDApIDogZXZlbnQ/LnRhcmdldDtcblxuICAgICAgICBpZiAodGFyZ2V0RWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgWyxpbnN0YW5jZV0gb2YgdGFyZ2V0RWxlbWVudC51cGdyYWRlcyA/PyBbXSlcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBCQ0REcm9wZG93bikgcmV0dXJuO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFssaW5zdGFuY2VdIG9mIHRhcmdldEVsZW1lbnQudGFyZ2V0aW5nQ29tcG9uZW50cyA/PyBbXSlcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBCQ0REcm9wZG93biAmJiBpbnN0YW5jZS5jb250YWluZXJfLmNsYXNzTGlzdC5jb250YWlucygnaXMtdmlzaWJsZScpKSByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dQYXJ0MSgpO1xuXG4gICAgICAgIGFmdGVyRGVsYXkoYnlwYXNzV2FpdCA/IDAgOiA2MDAsIGZ1bmN0aW9uKHRoaXM6IEJDRFRvb2x0aXApIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlXycpKSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnNob3dQYXJ0MigpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgfVxuXG4gICAgc2hvd1BhcnQxKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlXycpO1xuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh3aW5kb3csIHtleGl0OiB0aGlzLmhpZGVfYm91bmR9KTtcbiAgICB9XG5cbiAgICBzaG93UGFydDIoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLnNldFBvc2l0aW9uLmJpbmQodGhpcyksIHtvbmNlOiB0cnVlfSk7XG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnNob3dQYXJ0MSgpO1xuICAgICAgICB0aGlzLnNob3dQYXJ0MigpO1xuICAgIH1cblxuICAgIGhhbmRsZUhvdmVyTGVhdmUoZXZlbnQ/OiBNb3VzZUV2ZW50fEZvY3VzRXZlbnQpIHsgdGhpcy5oaWRlKCk7IH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmVfJyk7XG5cbiAgICAgICAgYWZ0ZXJEZWxheSgxMCwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmVfJykpXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhZG9ubHkgaGlkZV9ib3VuZCA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpO1xuXG4gICAgc2V0UG9zaXRpb24oKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coYFNldHRpbmcgcG9zaXRpb24gb2YgdG9vbHRpcCB0byB0aGUgJHt0aGlzLnBvc2l0aW9ufSBvZiBgLCB0aGlzLmJvdW5kRWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICdub25lICFpbXBvcnRhbnQnO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdub25lICFpbXBvcnRhbnQnO1xuXG4gICAgICAgIC8vIEZvcmNlIHJlY2FsYyBvZiBzdHlsZXNcbiAgICAgICAgY29uc3QgdGlwU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB0aXBTdHlsZS50cmFuc2l0aW9uO1xuICAgICAgICB0aXBTdHlsZS50cmFuc2Zvcm07XG5cbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKCdSZWNhbGN1bGF0ZWQgc3R5bGVzOicsIHt0cmFuc2Zvcm06IHRpcFN0eWxlLnRyYW5zZm9ybSwgdHJhbnNpdGlvbjogdGlwU3R5bGUudHJhbnNpdGlvbiwgd2lkdGg6IHRpcFN0eWxlLndpZHRoLCBoZWlnaHQ6IHRpcFN0eWxlLmhlaWdodCwgb2Zmc2V0TGVmdDogdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsIG9mZnNldFRvcDogdGhpcy5lbGVtZW50Lm9mZnNldFRvcCwgb2Zmc2V0V2lkdGg6IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0OiB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0fSk7XG5cbiAgICAgICAgY29uc3QgZWxlbVJlY3QgPSB0aGlzLmJvdW5kRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgdGlwUmVjdCA9IHt3aWR0aDogdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoLCBoZWlnaHQ6IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHR9O1xuXG4gICAgICAgIC8vY29uc29sZS5kZWJ1ZygnRWxlbWVudCByZWN0OicsIGVsZW1SZWN0KTtcbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKCdFbGVtZW50IHJlY3RzOicsIHRoaXMuYm91bmRFbGVtZW50LmdldENsaWVudFJlY3RzKCkpO1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcoJ1Rvb2x0aXAgcmVjdDonLCB0aXBSZWN0KTtcbiAgICAgICAgLy9jb25zb2xlLmRlYnVnKCdUb29sdGlwIHJlY3RzOicsIHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpKTtcblxuICAgICAgICAvKiogVGhlIHRvcCBwb3NpdGlvbiAtIHNldCB0byB0aGUgbWlkZGxlIG9mIHRoZSBCb3VuZCBFbGVtZW50ICovXG4gICAgICAgIGxldCB0b3AgPSBlbGVtUmVjdC50b3AgICsgKGVsZW1SZWN0LmhlaWdodCAvIDIpO1xuICAgICAgICAvKiogVGhlIHRvcCBtYXJnaW4gLSB0aGUgbmVnYXRpdmUgaGVpZ2h0IG9mIHRoZSB0b29sdGlwICovXG4gICAgICAgIGNvbnN0IG1hcmdpblRvcCA9IHRpcFJlY3QuaGVpZ2h0IC8gLTI7XG5cbiAgICAgICAgLyoqIFRoZSBsZWZ0IHBvc2l0aW9uIC0gc2V0IHRvIHRoZSBtaWRkbGUgb2YgdGhlIEJvdW5kIEVsZW1lbnQgKi9cbiAgICAgICAgbGV0IGxlZnQgPSAgZWxlbVJlY3QubGVmdCArIChlbGVtUmVjdC53aWR0aCAgLyAyKTtcbiAgICAgICAgLyoqIFRoZSBsZWZ0IG1hcmdpbiAtIHRoZSBuZWdhdGl2ZSB3aWR0aCBvZiB0aGUgdG9vbHRpcCAqL1xuICAgICAgICBjb25zdCBtYXJnaW5MZWZ0ID0gICB0aXBSZWN0LndpZHRoIC8gLTI7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhgTGVmdCBQb3NpdGlvbjogJHtsZWZ0ICsgbWFyZ2luTGVmdH0sIHB1c2hpbmc/ICR7bGVmdCArIG1hcmdpbkxlZnQgPCA4fTsgUmlnaHQgUG9zaXRpb246ICR7bGVmdCArIG1hcmdpbkxlZnQgKyB0aXBSZWN0LndpZHRofSwgcHVzaGluZz8gJHtsZWZ0ICsgbWFyZ2luTGVmdCArIHRpcFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDh9YCk7XG5cbiAgICAgICAgLy8gUGFkZGluZyBvZiAxNnB4IG9uIHRoZSBsZWZ0IGFuZCByaWdodCBvZiB0aGUgZG9jdW1lbnRcblxuICAgICAgICBzd2l0Y2ggKHRoaXMucG9zaXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICBjYXNlICdib3R0b20nOlxuXG5cblxuICAgICAgICAgICAgICAgIHRoaXMuZ2FwQnJpZGdlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMTdweCc7XG4gICAgICAgICAgICAgICAgdGhpcy5nYXBCcmlkZ2VFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7TWF0aC5tYXgodGlwUmVjdC53aWR0aCwgZWxlbVJlY3Qud2lkdGgpfXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLmdhcEJyaWRnZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke01hdGgubWluKGVsZW1SZWN0LmxlZnQsIGxlZnQgKyBtYXJnaW5MZWZ0KSAtIGxlZnQgLSBtYXJnaW5MZWZ0fXB4YDtcblxuICAgICAgICAgICAgICAgIGlmIChsZWZ0ICsgbWFyZ2luTGVmdCA8IDgpIGxlZnQgKz0gOCAtIGxlZnQgLSBtYXJnaW5MZWZ0O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdCA9IGAke21hcmdpbkxlZnR9cHhgO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG5cbiAgICAgICAgICAgICAgICB0b3AgKz0gOCAtIHRvcCAtIG1hcmdpblRvcDtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2FwQnJpZGdlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtNYXRoLm1heCh0aXBSZWN0LmhlaWdodCwgZWxlbVJlY3QuaGVpZ2h0KX1weGA7XG4gICAgICAgICAgICAgICAgdGhpcy5nYXBCcmlkZ2VFbGVtZW50LnN0eWxlLndpZHRoID0gJzE3cHgnO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FwQnJpZGdlRWxlbWVudC5zdHlsZS50b3AgPSBgJHtNYXRoLm1pbihlbGVtUmVjdC50b3AsIHRvcCArIG1hcmdpblRvcCkgLSB0b3AgLSBtYXJnaW5Ub3B9cHhgO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRvcCArIG1hcmdpblRvcCA8IDgpIHRvcCArPSA4IC0gdG9wIC0gbWFyZ2luVG9wO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IGAke21hcmdpblRvcH1weGA7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhgRmluYWwgTGVmdCBQb3NpdGlvbjogJHtsZWZ0ICsgbWFyZ2luTGVmdCAtICh0aXBSZWN0LndpZHRoIC8gMil9YCk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnBvc2l0aW9uKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6ICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wICA9IGAke2VsZW1SZWN0LnRvcCAgLSB0aXBSZWN0LmhlaWdodCAtIDE2fXB4YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhcEJyaWRnZUVsZW1lbnQuc3R5bGUudG9wICA9IGAkezE2ICArIHRpcFJlY3QuaGVpZ2h0fXB4YDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdib3R0b20nOiB0aGlzLmVsZW1lbnQuc3R5bGUudG9wICA9IGAke2VsZW1SZWN0LnRvcCAgKyBlbGVtUmVjdC5oZWlnaHQgKyAxNn1weGA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYXBCcmlkZ2VFbGVtZW50LnN0eWxlLnRvcCAgPSBgLTE2cHhgO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbGVmdCc6ICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtlbGVtUmVjdC5sZWZ0IC0gdGlwUmVjdC53aWR0aCAtIDE2fXB4YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhcEJyaWRnZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAkezE2ICsgdGlwUmVjdC53aWR0aH1weGA7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdyaWdodCc6ICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2VsZW1SZWN0LmxlZnQgKyBlbGVtUmVjdC53aWR0aCArIDE2fXB4YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhcEJyaWRnZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAtMTZweGA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnJztcbiAgICB9XG5cbn1cbmNvbXBvbmVudHNUb1JlZ2lzdGVyLnB1c2goQkNEVG9vbHRpcCk7XG5cblxuXG4vKioqXG4gKiAgICAkJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXFxuICogICAgJCQgIF9fJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX198XG4gKiAgICAkJCB8ICAkJCB8JCRcXCAgICQkXFwgJCQkJCQkJFxcICAgJCQkJCQkXFwgICQkJCQkJFxcJCQkJFxcICAkJFxcICAkJCQkJCQkXFxcbiAqICAgICQkIHwgICQkIHwkJCB8ICAkJCB8JCQgIF9fJCRcXCAgXFxfX19fJCRcXCAkJCAgXyQkICBfJCRcXCAkJCB8JCQgIF9fX19ffFxuICogICAgJCQgfCAgJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8ICQkJCQkJCQgfCQkIC8gJCQgLyAkJCB8JCQgfCQkIC9cbiAqICAgICQkIHwgICQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfCQkICBfXyQkIHwkJCB8ICQkIHwgJCQgfCQkIHwkJCB8XG4gKiAgICAkJCQkJCQkICB8XFwkJCQkJCQkIHwkJCB8ICAkJCB8XFwkJCQkJCQkIHwkJCB8ICQkIHwgJCQgfCQkIHxcXCQkJCQkJCRcXFxuICogICAgXFxfX19fX19fLyAgXFxfX19fJCQgfFxcX198ICBcXF9ffCBcXF9fX19fX198XFxfX3wgXFxfX3wgXFxfX3xcXF9ffCBcXF9fX19fX198XG4gKiAgICAgICAgICAgICAgJCRcXCAgICQkIHxcbiAqICAgICAgICAgICAgICBcXCQkJCQkJCAgfFxuICogICAgICAgICAgICAgICBcXF9fX19fXy9cbiAqICAgICQkJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAgICQkXFwgICAgICAgICAgICAkJCQkJCRcXFxuICogICAgXFxfXyQkICBfX3wgICAgICAgICAgICAgICAgICAgICAgJCQgfCAgICAgICAgICAkJCAgX18kJFxcXG4gKiAgICAgICAkJCB8ICAgICQkJCQkJFxcICAkJFxcICAgJCRcXCAkJCQkJCRcXCAgICAgICAgICQkIC8gICQkIHwgJCQkJCQkXFwgICAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCQkJCQkJFxcXG4gKiAgICAgICAkJCB8ICAgJCQgIF9fJCRcXCBcXCQkXFwgJCQgIHxcXF8kJCAgX3wgICAgICAgICQkJCQkJCQkIHwkJCAgX18kJFxcICQkICBfXyQkXFwgIFxcX19fXyQkXFwgJCQgIF9fX19ffFxuICogICAgICAgJCQgfCAgICQkJCQkJCQkIHwgXFwkJCQkICAvICAgJCQgfCAgICAgICAgICAkJCAgX18kJCB8JCQgfCAgXFxfX3wkJCQkJCQkJCB8ICQkJCQkJCQgfFxcJCQkJCQkXFxcbiAqICAgICAgICQkIHwgICAkJCAgIF9fX198ICQkICAkJDwgICAgJCQgfCQkXFwgICAgICAgJCQgfCAgJCQgfCQkIHwgICAgICAkJCAgIF9fX198JCQgIF9fJCQgfCBcXF9fX18kJFxcXG4gKiAgICAgICAkJCB8ICAgXFwkJCQkJCQkXFwgJCQgIC9cXCQkXFwgICBcXCQkJCQgIHwgICAgICAkJCB8ICAkJCB8JCQgfCAgICAgIFxcJCQkJCQkJFxcIFxcJCQkJCQkJCB8JCQkJCQkJCAgfFxuICogICAgICAgXFxfX3wgICAgXFxfX19fX19ffFxcX18vICBcXF9ffCAgIFxcX19fXy8gICAgICAgXFxfX3wgIFxcX198XFxfX3wgICAgICAgXFxfX19fX19ffCBcXF9fX19fX198XFxfX19fX19fL1xuICpcbiAqXG4gKlxuICovXG5cblxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgYmNkRHluYW1pY1RleHRBcmVhX2Jhc2Uge1xuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKGVsZW1lbnQsIHRoaXMsIG51bGwsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgICAgICB0aGlzLmFkanVzdCgpO1xuXG4gICAgICAgIGNvbnN0IGJvdW5kQWRqdXN0ID0gdGhpcy5hZGp1c3QuYmluZCh0aGlzKTtcbiAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHModGhpcy5lbGVtZW50LCB7Y2hhbmdlOiBib3VuZEFkanVzdH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGJvdW5kQWRqdXN0KTtcbiAgICAgICAgcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIC8vIEhvcGVmdWxseSByZXNvbHZlIGFuIGVkZ2UtY2FzZSBjYXVzaW5nIHRoZSB0ZXh0IGFyZWEgdG8gbm90IGluaXRpYWxseSBzaXplIGl0c2VsZiBwcm9wZXJseVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYm91bmRBZGp1c3QpO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGFkanVzdCgpOiBhbnk7XG5cbn1cblxuZXhwb3J0IGNsYXNzIGJjZER5bmFtaWNUZXh0QXJlYUhlaWdodCBleHRlbmRzIGJjZER5bmFtaWNUZXh0QXJlYV9iYXNlIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXNTdHJpbmcgPSAnQkNEIC0gRHluYW1pYyBUZXh0QXJlYSAtIEhlaWdodCc7XG4gICAgc3RhdGljIHJlYWRvbmx5IGNzc0NsYXNzID0gJ2pzLWR5bmFtaWMtdGV4dGFyZWEtaGVpZ2h0JztcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGFkanVzdCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuaGVpZ2h0OyAvLyBGb3JjZSB0aGUgYnJvd3NlciB0byByZWNhbGN1bGF0ZSB0aGUgc2Nyb2xsIGhlaWdodFxuXG4gICAgICAgIGNvbnN0IHBhZGRpbmdQWCA9IHBhcnNlSW50KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3BhZGRpbmdQWCcpID8/ICcwJyk7XG4gICAgICAgIGlmIChpc05hTihwYWRkaW5nUFgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSBwYWRkaW5nUFggYXR0cmlidXRlIG9mIHRoZSBkeW5hbWljIHRleHQgYXJlYSBpcyBub3QgYSBudW1iZXI6JywgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5lbGVtZW50LnNjcm9sbEhlaWdodCArIHBhZGRpbmdQWH1weGA7XG4gICAgfVxuXG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKGJjZER5bmFtaWNUZXh0QXJlYUhlaWdodCk7XG5cbmV4cG9ydCBjbGFzcyBiY2REeW5hbWljVGV4dEFyZWFXaWR0aCBleHRlbmRzIGJjZER5bmFtaWNUZXh0QXJlYV9iYXNlIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXNTdHJpbmcgPSAnQkNEIC0gRHluYW1pYyBUZXh0QXJlYSAtIFdpZHRoJztcbiAgICBzdGF0aWMgcmVhZG9ubHkgY3NzQ2xhc3MgPSAnanMtZHluYW1pYy10ZXh0YXJlYS13aWR0aCc7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICAgICAgbmV3IFJlc2l6ZU9ic2VydmVyKHRoaXMuYWRqdXN0LmJpbmQodGhpcykpLm9ic2VydmUodGhpcy5lbGVtZW50KTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBhZGp1c3QoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9ICcnO1xuICAgICAgICBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkud2lkdGg7IC8vIEZvcmNlIHRoZSBicm93c2VyIHRvIHJlY2FsY3VsYXRlIHRoZSBzY3JvbGwgaGVpZ2h0XG5cbiAgICAgICAgY29uc3QgcGFkZGluZ1BYID0gcGFyc2VJbnQodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgncGFkZGluZ1BYJykgPz8gJzAnKTtcbiAgICAgICAgaWYgKGlzTmFOKHBhZGRpbmdQWCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIHBhZGRpbmdQWCBhdHRyaWJ1dGUgb2YgdGhlIGR5bmFtaWMgdGV4dCBhcmVhIGlzIG5vdCBhIG51bWJlcjonLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGBtaW4oJHt0aGlzLmVsZW1lbnQuc2Nyb2xsV2lkdGggKyBwYWRkaW5nUFh9cHgsIDEwMGNxbWluKWA7XG4gICAgfVxuXG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKGJjZER5bmFtaWNUZXh0QXJlYVdpZHRoKTtcblxuXG5cbi8qKipcbiAqICAgICQkJCQkJCRcXCAgICAgICAgICAgICQkXFwgICAgICAgICAgICAgJCRcXCAgICAgJCRcXFxuICogICAgJCQgIF9fJCRcXCAgICAgICAgICAgJCQgfCAgICAgICAgICAgICQkIHwgICAgXFxfX3xcbiAqICAgICQkIHwgICQkIHwgJCQkJCQkXFwgICQkIHwgJCQkJCQkXFwgICQkJCQkJFxcICAgJCRcXCAkJFxcICAgICQkXFwgICQkJCQkJFxcXG4gKiAgICAkJCQkJCQkICB8JCQgIF9fJCRcXCAkJCB8IFxcX19fXyQkXFwgXFxfJCQgIF98ICAkJCB8XFwkJFxcICAkJCAgfCQkICBfXyQkXFxcbiAqICAgICQkICBfXyQkPCAkJCQkJCQkJCB8JCQgfCAkJCQkJCQkIHwgICQkIHwgICAgJCQgfCBcXCQkXFwkJCAgLyAkJCQkJCQkJCB8XG4gKiAgICAkJCB8ICAkJCB8JCQgICBfX19ffCQkIHwkJCAgX18kJCB8ICAkJCB8JCRcXCAkJCB8ICBcXCQkJCAgLyAgJCQgICBfX19ffFxuICogICAgJCQgfCAgJCQgfFxcJCQkJCQkJFxcICQkIHxcXCQkJCQkJCQgfCAgXFwkJCQkICB8JCQgfCAgIFxcJCAgLyAgIFxcJCQkJCQkJFxcXG4gKiAgICBcXF9ffCAgXFxfX3wgXFxfX19fX19ffFxcX198IFxcX19fX19fX3wgICBcXF9fX18vIFxcX198ICAgIFxcXy8gICAgIFxcX19fX19fX3xcbiAqXG4gKlxuICpcbiAqICAgICQkJCQkJCQkXFwgJCRcXCAkJFxcICAgICAgICAgICAgICAgICAkJCQkJCQkXFwgICQkXFwgICAgICAgICAgICQkXFxcbiAqICAgICQkICBfX19fX3xcXF9ffCQkIHwgICAgICAgICAgICAgICAgJCQgIF9fJCRcXCBcXF9ffCAgICAgICAgICAkJCB8XG4gKiAgICAkJCB8ICAgICAgJCRcXCAkJCB8ICQkJCQkJFxcICAgICAgICAkJCB8ICAkJCB8JCRcXCAgJCQkJCQkJFxcICQkIHwgICQkXFwgICQkJCQkJFxcICAgJCQkJCQkXFxcbiAqICAgICQkJCQkXFwgICAgJCQgfCQkIHwkJCAgX18kJFxcICAgICAgICQkJCQkJCQgIHwkJCB8JCQgIF9fX19ffCQkIHwgJCQgIHwkJCAgX18kJFxcICQkICBfXyQkXFxcbiAqICAgICQkICBfX3wgICAkJCB8JCQgfCQkJCQkJCQkIHwgICAgICAkJCAgX19fXy8gJCQgfCQkIC8gICAgICAkJCQkJCQgIC8gJCQkJCQkJCQgfCQkIHwgIFxcX198XG4gKiAgICAkJCB8ICAgICAgJCQgfCQkIHwkJCAgIF9fX198ICAgICAgJCQgfCAgICAgICQkIHwkJCB8ICAgICAgJCQgIF8kJDwgICQkICAgX19fX3wkJCB8XG4gKiAgICAkJCB8ICAgICAgJCQgfCQkIHxcXCQkJCQkJCRcXCAgICAgICAkJCB8ICAgICAgJCQgfFxcJCQkJCQkJFxcICQkIHwgXFwkJFxcIFxcJCQkJCQkJFxcICQkIHxcbiAqICAgIFxcX198ICAgICAgXFxfX3xcXF9ffCBcXF9fX19fX198ICAgICAgXFxfX3wgICAgICBcXF9ffCBcXF9fX19fX198XFxfX3wgIFxcX198IFxcX19fX19fX3xcXF9ffFxuICpcbiAqXG4gKlxuICovXG5cbmNsYXNzIFJlbGF0aXZlRmlsZVBpY2tlciB7XG4gICAgc3RhdGljIGFzU3RyaW5nID0gJ0JDRCAtIFJlbGF0aXZlIEZpbGUgUGlja2VyJztcbiAgICBzdGF0aWMgY3NzQ2xhc3MgPSAnanMtcmVsYXRpdmUtZmlsZS1waWNrZXInO1xuXG4gICAgZWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcbiAgICBidXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gICAgcmVsYXRpdmVUbz86IGZzLkJlbGxGb2xkZXJ8e2RpcmVjdG9yeTogZnMuQmVsbEZvbGRlcn18c3RyaW5nW107XG4gICAgZ2V0IGRpcmVjdG9yeSgpOiBmcy5CZWxsRm9sZGVyfHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghdGhpcy5yZWxhdGl2ZVRvKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoJ2hhbmRsZScgaW4gdGhpcy5yZWxhdGl2ZVRvKSByZXR1cm4gdGhpcy5yZWxhdGl2ZVRvO1xuICAgICAgICBpZiAoJ2RpcmVjdG9yeScgaW4gdGhpcy5yZWxhdGl2ZVRvKSByZXR1cm4gdGhpcy5yZWxhdGl2ZVRvLmRpcmVjdG9yeTtcbiAgICAgICAgcmV0dXJuIFNldHRpbmdzR3JpZC5nZXRTZXR0aW5nKHRoaXMucmVsYXRpdmVUbywgJ2RpcmVjdG9yeScpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQsIHJlbGF0aXZlVG8/OiBmcy5CZWxsRm9sZGVyfHtkaXJlY3Rvcnk6IGZzLkJlbGxGb2xkZXJ9KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMucmVsYXRpdmVUbyA9IHJlbGF0aXZlVG87XG5cbiAgICAgICAgaWYgKCFyZWxhdGl2ZVRvKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVRvQXR0ciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyZWxhdGl2ZS10bycpO1xuICAgICAgICAgICAgaWYgKCFyZWxhdGl2ZVRvQXR0cikgdGhyb3cgbmV3IEVycm9yKCdUaGUgcmVsYXRpdmUgZmlsZSBwaWNrZXIgbXVzdCBoYXZlIGEgcmVsYXRpdmUtdG8gYXR0cmlidXRlIG9yIGhhdmUgYSBmb2xkZXIgc3BlY2lmaWVkIGF0IGNyZWF0aW9uLicpO1xuXG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlVG8gPSByZWxhdGl2ZVRvQXR0ci5zcGxpdCgnLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKGVsZW1lbnQsIHRoaXMsIG51bGwsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICByZWdpc3RlckZvckV2ZW50cyh0aGlzLmVsZW1lbnQsIHtjaGFuZ2U6IHRoaXMuYm91bmRPbkNoYW5nZX0pO1xuXG5cbiAgICAgICAgLyogQ3JlYXRlIHRoZSBmb2xsb3dpbmcgYnV0dG9uOlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1mYWIgbWRsLWpzLXJpcHBsZS1lZmZlY3QganMtcmVsYXRpdmUtZmlsZS1waWNrZXItLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmVkaXRfZG9jdW1lbnQ8L2k+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAvKiBNREwgICovICdtZGwtYnV0dG9uJywgJ21kbC1qcy1idXR0b24nLCAnbWRsLWJ1dHRvbi0tZmFiJywgJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICAgICAgICAgIC8qIE1pbmUgKi8gJ2pzLXJlbGF0aXZlLWZpbGUtcGlja2VyLS1idXR0b24nXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCdtYXRlcmlhbC1pY29ucycpO1xuICAgICAgICBpY29uLnRleHRDb250ZW50ID0gJ2VkaXRfZG9jdW1lbnQnO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWZ0ZXIodGhpcy5idXR0b24pO1xuXG4gICAgICAgIHJlZ2lzdGVyRm9yRXZlbnRzKHRoaXMuYnV0dG9uLCB7YWN0aXZhdGU6IHRoaXMuYm91bmRPbkJ1dHRvbkNsaWNrfSk7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UoKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ29uQ2hhbmdlJywgdGhpcy5lbGVtZW50LnZhbHVlLCB0aGlzKTtcbiAgICB9XG4gICAgcmVhZG9ubHkgYm91bmRPbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcblxuICAgIGFzeW5jIG9uQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGNvbnN0IGZzID0gYXdhaXQgaW1wb3J0KCcuL2ZpbGVzeXN0ZW0taW50ZXJmYWNlLmpzJyk7XG5cbiAgICAgICAgY29uc3QgcmVsYXRpdmVUbyA9IHRoaXMucmVsYXRpdmVUbyBpbnN0YW5jZW9mIGZzLkJlbGxGb2xkZXIgPyB0aGlzLnJlbGF0aXZlVG8gOiB0aGlzLmRpcmVjdG9yeTtcbiAgICAgICAgaWYgKCFyZWxhdGl2ZVRvKSByZXR1cm4gY29uc29sZS53YXJuKCdUaGUgcmVsYXRpdmUgZmlsZSBwaWNrZXIgaGFzIG5vIHJlbGF0aXZlLXRvIGZvbGRlciBzcGVjaWZpZWQnLCB0aGlzKTtcblxuICAgICAgICBsZXQgZmlsZUhhbmRsZTogZnMuQmVsbEZpbGV8dW5kZWZpbmVkO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgW2ZpbGVIYW5kbGVdID0gYXdhaXQgcmVsYXRpdmVUby5vcGVuRmlsZVBpY2tlcigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZSAmJiBlIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uICYmIGUubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSByZXR1cm47IC8vIFRoZSB1c2VyIGNhbmNlbGVkIHRoZSBmaWxlIHBpY2tlciAod2hpY2ggaXMgZmluZSlcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIGZpbGUgcGlja2VyIHRocmV3IHNvbWUgc29ydCBvZiBlcnJvcicsIGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZmlsZUhhbmRsZSkgcmV0dXJuIGNvbnNvbGUud2FybignVGhlIGZpbGUgcGlja2VyIHJldHVybmVkIG5vIGZpbGUnLCB0aGlzKTtcblxuICAgICAgICBjb25zdCBuYW1lQXJyID0gYXdhaXQgdGhpcy5kaXJlY3Rvcnk/LnJlc29sdmVDaGlsZFBhdGgoZmlsZUhhbmRsZSwgdHJ1ZSk7XG4gICAgICAgIGlmICghbmFtZUFycikgcmV0dXJuIGNvbnNvbGUuZGVidWcoJ1RoZSBmaWxlIHBpY2tlciByZXR1cm5lZCBhIGZpbGUgdGhhdCBpcyBub3QgaW4gdGhlIHNwZWNpZmllZCBkaXJlY3RvcnknLCBmaWxlSGFuZGxlLCB0aGlzLmRpcmVjdG9yeSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gbmFtZUFyci5qb2luKCcvJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICAgIH1cbiAgICByZWFkb25seSBib3VuZE9uQnV0dG9uQ2xpY2sgPSB0aGlzLm9uQnV0dG9uQ2xpY2suYmluZCh0aGlzKTtcbn1cbmNvbXBvbmVudHNUb1JlZ2lzdGVyLnB1c2goUmVsYXRpdmVGaWxlUGlja2VyKTtcblxuXG4vKioqXG4gKiAgICAkJCQkJCQkXFwgICAgICAgICAgICAkJFxcICAgICAgICAgICAgICQkXFwgICAgICQkXFxcbiAqICAgICQkICBfXyQkXFwgICAgICAgICAgICQkIHwgICAgICAgICAgICAkJCB8ICAgIFxcX198XG4gKiAgICAkJCB8ICAkJCB8ICQkJCQkJFxcICAkJCB8ICQkJCQkJFxcICAkJCQkJCRcXCAgICQkXFwgJCRcXCAgICAkJFxcICAkJCQkJCRcXFxuICogICAgJCQkJCQkJCAgfCQkICBfXyQkXFwgJCQgfCBcXF9fX18kJFxcIFxcXyQkICBffCAgJCQgfFxcJCRcXCAgJCQgIHwkJCAgX18kJFxcXG4gKiAgICAkJCAgX18kJDwgJCQkJCQkJCQgfCQkIHwgJCQkJCQkJCB8ICAkJCB8ICAgICQkIHwgXFwkJFxcJCQgIC8gJCQkJCQkJCQgfFxuICogICAgJCQgfCAgJCQgfCQkICAgX19fX3wkJCB8JCQgIF9fJCQgfCAgJCQgfCQkXFwgJCQgfCAgXFwkJCQgIC8gICQkICAgX19fX3xcbiAqICAgICQkIHwgICQkIHxcXCQkJCQkJCRcXCAkJCB8XFwkJCQkJCQkIHwgIFxcJCQkJCAgfCQkIHwgICBcXCQgIC8gICBcXCQkJCQkJCRcXFxuICogICAgXFxfX3wgIFxcX198IFxcX19fX19fX3xcXF9ffCBcXF9fX19fX198ICAgXFxfX19fLyBcXF9ffCAgICBcXF8vICAgICBcXF9fX19fX198XG4gKlxuICpcbiAqXG4gKiAgICAkJCQkJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkJCQkJCRcXCAgJCRcXCAgICAgICAgICAgJCRcXFxuICogICAgXFxfJCQgIF98ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJCAgX18kJFxcIFxcX198ICAgICAgICAgICQkIHxcbiAqICAgICAgJCQgfCAgJCQkJCQkXFwkJCQkXFwgICAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCQkJCQkXFwgICAgICAgICQkIHwgICQkIHwkJFxcICAkJCQkJCQkXFwgJCQgfCAgJCRcXCAgJCQkJCQkXFwgICAkJCQkJCRcXFxuICogICAgICAkJCB8ICAkJCAgXyQkICBfJCRcXCAgXFxfX19fJCRcXCAkJCAgX18kJFxcICQkICBfXyQkXFwgICAgICAgJCQkJCQkJCAgfCQkIHwkJCAgX19fX198JCQgfCAkJCAgfCQkICBfXyQkXFwgJCQgIF9fJCRcXFxuICogICAgICAkJCB8ICAkJCAvICQkIC8gJCQgfCAkJCQkJCQkIHwkJCAvICAkJCB8JCQkJCQkJCQgfCAgICAgICQkICBfX19fLyAkJCB8JCQgLyAgICAgICQkJCQkJCAgLyAkJCQkJCQkJCB8JCQgfCAgXFxfX3xcbiAqICAgICAgJCQgfCAgJCQgfCAkJCB8ICQkIHwkJCAgX18kJCB8JCQgfCAgJCQgfCQkICAgX19fX3wgICAgICAkJCB8ICAgICAgJCQgfCQkIHwgICAgICAkJCAgXyQkPCAgJCQgICBfX19ffCQkIHxcbiAqICAgICQkJCQkJFxcICQkIHwgJCQgfCAkJCB8XFwkJCQkJCQkIHxcXCQkJCQkJCQgfFxcJCQkJCQkJFxcICAgICAgICQkIHwgICAgICAkJCB8XFwkJCQkJCQkXFwgJCQgfCBcXCQkXFwgXFwkJCQkJCQkXFwgJCQgfFxuICogICAgXFxfX19fX198XFxfX3wgXFxfX3wgXFxfX3wgXFxfX19fX19ffCBcXF9fX18kJCB8IFxcX19fX19fX3wgICAgICBcXF9ffCAgICAgIFxcX198IFxcX19fX19fX3xcXF9ffCAgXFxfX3wgXFxfX19fX19ffFxcX198XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkXFwgICAkJCB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJCQkJCQkICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXF9fX19fXy9cbiAqL1xuXG5cbmNsYXNzIFJlbGF0aXZlSW1hZ2VQaWNrZXIgZXh0ZW5kcyBSZWxhdGl2ZUZpbGVQaWNrZXIge1xuICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBhc1N0cmluZyA9ICdCQ0QgLSBSZWxhdGl2ZSBJbWFnZSBQaWNrZXInO1xuICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBjc3NDbGFzcyA9ICdqcy1yZWxhdGl2ZS1pbWFnZS1waWNrZXInO1xuXG4gICAgaW1hZ2VFbGVtPzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBub0ltYWdlRWxlbT86IFNWR1NWR0VsZW1lbnQ7XG4gICAgcmVsYXRpb246ICdwcmV2aW91cyd8J25leHQnfCdwYXJlbnQnfCdzZWxlY3Rvcic7XG5cbiAgICBzdGF0aWMgbm9JbWFnZURvYz86IERvY3VtZW50IHwgUHJvbWlzZTxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTElucHV0RWxlbWVudCwgcmVsYXRpdmVUbz86IGZzLkJlbGxGb2xkZXJ8e2RpcmVjdG9yeTogZnMuQmVsbEZvbGRlcn0pIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcmVsYXRpdmVUbyk7XG5cbiAgICAgICAgdGhpcy5yZWxhdGlvbiA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyZWxhdGlvbicpIGFzICdwcmV2aW91cyd8J25leHQnfCdwYXJlbnQnfCdzZWxlY3RvcicgPz8gJ3ByZXZpb3VzJztcblxuICAgICAgICBzd2l0Y2ggKHRoaXMucmVsYXRpb24pIHtcblxuICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtID0gZWxlbWVudC5wYXJlbnRFbGVtZW50IS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtID0gZWxlbWVudC5wYXJlbnRFbGVtZW50IS5uZXh0RWxlbWVudFNpYmxpbmcgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAncGFyZW50JzpcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlRWxlbSA9IGVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdzZWxlY3Rvcic6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzZWxlY3RvcicpO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZWN0b3IpIHRocm93IG5ldyBFcnJvcignVGhlIHJlbGF0aXZlIGltYWdlIHBpY2tlciBtdXN0IGhhdmUgYSBzZWxlY3RvciBhdHRyaWJ1dGUgaWYgdGhlIHJlbGF0aW9uIGlzIHNldCB0byBzZWxlY3Rvci4nKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VFbGVtID0gZWxlbWVudC5wYXJlbnRFbGVtZW50IS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSBhcyBIVE1MSW1hZ2VFbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcmVsYXRpdmUgaW1hZ2UgcGlja2VyIG11c3QgaGF2ZSBhIHJlbGF0aW9uIGF0dHJpYnV0ZSB0aGF0IGlzIGVpdGhlciBwcmV2aW91cywgbmV4dCwgcGFyZW50LCBvciBzZWxlY3Rvci4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlTm9JbWFnZUVsZW0oKTtcblxuICAgICAgICByZWdpc3RlclVwZ3JhZGUoZWxlbWVudCwgdGhpcywgdGhpcy5pbWFnZUVsZW0sIHRydWUsIHRydWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZU5vSW1hZ2VFbGVtKCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIHJlcXVlc3QgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdFxuICAgICAgICBSZWxhdGl2ZUltYWdlUGlja2VyLm5vSW1hZ2VEb2MgPz89IGZldGNoKCdodHRwczovL2ZvbnRzLmdzdGF0aWMuY29tL3MvaS9zaG9ydC10ZXJtL3JlbGVhc2UvbWF0ZXJpYWxzeW1ib2xzcm91bmRlZC9pbWFnZS9kZWZhdWx0LzQ4cHguc3ZnJykudGhlbihyID0+IHIudGV4dCgpKTtcblxuICAgICAgICBsZXQgc3ZnOiB1bmRlZmluZWR8U1ZHU1ZHRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIHJlcXVlc3QgdG8gZmluaXNoIGlmIGl0IGhhcyBub3QgYWxyZWFkeVxuICAgICAgICBpZiAoUmVsYXRpdmVJbWFnZVBpY2tlci5ub0ltYWdlRG9jIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gYXdhaXQgUmVsYXRpdmVJbWFnZVBpY2tlci5ub0ltYWdlRG9jO1xuICAgICAgICAgICAgUmVsYXRpdmVJbWFnZVBpY2tlci5ub0ltYWdlRG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhzdHIsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgICAgIHN2ZyA9IFJlbGF0aXZlSW1hZ2VQaWNrZXIubm9JbWFnZURvYy5xdWVyeVNlbGVjdG9yKCdzdmcnKSBhcyBTVkdTVkdFbGVtZW50O1xuXG4gICAgICAgICAgICBpZiAoIXN2Zy5oYXNBdHRyaWJ1dGUoJ3ZpZXdCb3gnKSkgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmcuZ2V0QXR0cmlidXRlKCd3aWR0aCcpIHx8ICcwJ30gJHtzdmcuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSB8fCAnMCd9YCk7XG4gICAgICAgICAgICBzdmcucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpOyBzdmcucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyA/Pz0gUmVsYXRpdmVJbWFnZVBpY2tlci5ub0ltYWdlRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpIGFzIFNWR1NWR0VsZW1lbnQ7XG4gICAgICAgIGlmICghc3ZnKSB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHRoZSBTVkcgZWxlbWVudCBpbiB0aGUgU1ZHIGRvY3VtZW50LicpO1xuXG4gICAgICAgIHRoaXMubm9JbWFnZUVsZW0gPSBzdmcuY2xvbmVOb2RlKHRydWUpIGFzIFNWR1NWR0VsZW1lbnQ7XG4gICAgICAgIHRoaXMubm9JbWFnZUVsZW0uY2xhc3NMaXN0LmFkZCgnanMtcmVsYXRpdmUtaW1hZ2UtcGlja2VyLS1uby1pbWFnZScpO1xuXG4gICAgICAgIHRoaXMuaW1hZ2VFbGVtPy5iZWZvcmUodGhpcy5ub0ltYWdlRWxlbSk7XG5cbiAgICAgICAgdGhpcy5pbWFnZUVsZW0/LnNyYyA/IHRoaXMuc2hvd0ltYWdlKCkgOiB0aGlzLmhpZGVJbWFnZSgpO1xuICAgIH1cblxuICAgIGhpZGVJbWFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VFbGVtKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5pbWFnZUVsZW0uYXJpYURpc2FibGVkID0gJ3RydWUnO1xuICAgICAgICAgICAgdGhpcy5pbWFnZUVsZW0uYXJpYUhpZGRlbiA9ICd0cnVlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ub0ltYWdlRWxlbSkge1xuICAgICAgICAgICAgdGhpcy5ub0ltYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHRoaXMubm9JbWFnZUVsZW0uYXJpYURpc2FibGVkID0gJ2ZhbHNlJztcbiAgICAgICAgICAgIHRoaXMubm9JbWFnZUVsZW0uYXJpYUhpZGRlbiA9ICdmYWxzZSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlRWxlbSkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZUVsZW0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB0aGlzLmltYWdlRWxlbS5hcmlhRGlzYWJsZWQgPSAnZmFsc2UnO1xuICAgICAgICAgICAgdGhpcy5pbWFnZUVsZW0uYXJpYUhpZGRlbiA9ICdmYWxzZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9JbWFnZUVsZW0pIHtcbiAgICAgICAgICAgIHRoaXMubm9JbWFnZUVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMubm9JbWFnZUVsZW0uYXJpYURpc2FibGVkID0gJ3RydWUnO1xuICAgICAgICAgICAgdGhpcy5ub0ltYWdlRWxlbS5hcmlhSGlkZGVuID0gJ3RydWUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGFzdFZhbHVlOiBzdHJpbmcgPSAnJztcbiAgICBvdmVycmlkZSBhc3luYyBvbkNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdFZhbHVlID09PSB0aGlzLmVsZW1lbnQudmFsdWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSB0aGlzLmVsZW1lbnQudmFsdWU7XG5cbiAgICAgICAgc3VwZXIub25DaGFuZ2UoKTtcblxuICAgICAgICBjb25zdCBkaXIgPSB0aGlzLmRpcmVjdG9yeTtcblxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VFbGVtKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuaW5mbygnVGhlIHJlbGF0aXZlIGltYWdlIHBpY2tlciBkb2VzIG5vdCBoYXZlIGFuIGltYWdlIGVsZW1lbnQgdG8gdXBkYXRlLicsIHRoaXMpO1xuXG4gICAgICAgIGlmICghZGlyKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVJbWFnZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuaW5mbygnVGhlIHJlbGF0aXZlIGltYWdlIHBpY2tlciBkb2VzIG5vdCBoYXZlIGEgZGlyZWN0b3J5IHRvIHVwZGF0ZSB0aGUgaW1hZ2UgZnJvbS4nLCB0aGlzLCBkaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVIYW5kbGVfID0gZGlyLmdldEZpbGUodGhpcy5lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IFtmaWxlSGFuZGxlLCBmc10gPSBhd2FpdCBQcm9taXNlLmFsbChbZmlsZUhhbmRsZV8sIGxvYWRGUygpXSk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUhhbmRsZSB8fCBmaWxlSGFuZGxlIGluc3RhbmNlb2YgZnMuSW52YWxpZE5hbWVFcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUltYWdlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuaW5mbygnVGhlIHJlbGF0aXZlIGltYWdlIHBpY2tlciBkb2VzIG5vdCBoYXZlIGEgZmlsZSBoYW5kbGUgdG8gdXBkYXRlIHRoZSBpbWFnZSB3aXRoLicsIHRoaXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmltYWdlRWxlbS5zcmMgPSBhd2FpdCAoZmlsZUhhbmRsZS5hdCgtMSkhIGFzIGZzLkJlbGxGaWxlKS5yZWFkQXNEYXRhVVJMKCk7XG4gICAgICAgICAgICB0aGlzLnNob3dJbWFnZSgpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUltYWdlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKFJlbGF0aXZlSW1hZ2VQaWNrZXIpO1xuXG4vKioqXG4gKiAgICAkJCQkJCQkXFwgICAkJCQkJCRcXCAgJCRcXCAgICAgICQkXFwgICQkJCQkJFxcXG4gKiAgICAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQkXFwgICAgJCQkIHwkJCAgX18kJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgLyAgJCQgfCQkJCRcXCAgJCQkJCB8JCQgLyAgXFxfX3wkJFxcICAgICQkXFwgICQkJCQkJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCQkXFwkJFxcJCQgJCQgfFxcJCQkJCQkXFwgIFxcJCRcXCAgJCQgIHwkJCAgX18kJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCQkIFxcJCQkICAkJCB8IFxcX19fXyQkXFwgIFxcJCRcXCQkICAvICQkIC8gICQkIHxcbiAqICAgICQkIHwgICQkIHwkJCB8ICAkJCB8JCQgfFxcJCAgLyQkIHwkJFxcICAgJCQgfCAgXFwkJCQgIC8gICQkIHwgICQkIHxcbiAqICAgICQkJCQkJCQgIHwgJCQkJCQkICB8JCQgfCBcXF8vICQkIHxcXCQkJCQkJCAgfCAgIFxcJCAgLyAgIFxcJCQkJCQkJCB8XG4gKiAgICBcXF9fX19fX18vICBcXF9fX19fXy8gXFxfX3wgICAgIFxcX198IFxcX19fX19fLyAgICAgXFxfLyAgICAgXFxfX19fJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXCAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJCQkJCQkICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxfX19fX18vXG4gKi9cblxuXG4vKiogVW5zYWZlbHkgbG9hZHMgYW4gZXh0ZXJuYWwgU1ZHIGZpbGUgYW5kIGluc2VydHMgaXQgaW50byB0aGUgRE9NLiAqL1xuY2xhc3MgRE9NU3ZnIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXNTdHJpbmcgPSAnQkNEIC0gRE9NIFNWRyc7XG4gICAgc3RhdGljIHJlYWRvbmx5IGNzc0NsYXNzID0gJ2pzLWRvbS1zdmcnO1xuXG4gICAgc3ZnU3JjOiBzdHJpbmc7XG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICAgIGlmICghc3JjKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBET00gU1ZHIG11c3QgaGF2ZSBhIHNyYyBhdHRyaWJ1dGUuJyk7XG5cbiAgICAgICAgdGhpcy5zdmdTcmMgPSBzcmM7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuaW5pdFN2ZygpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXRTdmcoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdmdSZXMgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkuYWxsb3JpZ2lucy53aW4vcmF3P3VybD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLnN2Z1NyYyl9YCwge1xuICAgICAgICAgICAgICAgIGNhY2hlOiAnZm9yY2UtY2FjaGUnLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghc3ZnUmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2pzLWRvbS1zdmctLWVycm9yJywgJ2pzLWRvbS1zdmctLWxvYWRlZCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gYDxwPkNvdWxkIG5vdCBsb2FkIHRoZSBpbWFnZSE8L3A+PGJyPjxjb2RlPiR7c3ZnUmVzLnN0YXR1c306ICR7c3ZnUmVzLnN0YXR1c1RleHQgfHwgKHN2Z1Jlcy5zdGF0dXMgPT0gNDA4ID8gJ0ZldGNoaW5nIHRoZSBncmFwaGljIHRvb2sgdG9vIGxvbmchJyA6ICcnKX08L2NvZGU+YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc3ZnVHh0ID0gYXdhaXQgc3ZnUmVzLnRleHQoKTtcblxuICAgICAgICAgICAgY29uc3Qgc3ZnRG9jID0gd2luZG93LmRvbVBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnVHh0LCAnaW1hZ2Uvc3ZnK3htbCcpO1xuXG4gICAgICAgICAgICBjb25zdCBzdmcgPSBzdmdEb2MucXVlcnlTZWxlY3Rvcignc3ZnJykgYXMgU1ZHU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghc3ZnKSB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHRoZSBTVkcgZWxlbWVudCBpbiB0aGUgU1ZHIGRvY3VtZW50LicpO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdqcy1kb20tc3ZnLS1sb2FkZWQnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKCAhIChlIGluc3RhbmNlb2YgRXJyb3IpICkgdGhyb3cgZTtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ291bGQgbm90IGxvYWQgdGhlIFNWRyBpbWFnZS4nLCBlKTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2pzLWRvbS1zdmctLWVycm9yJywgJ2pzLWRvbS1zdmctLWxvYWRlZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBgPHA+Q291bGQgbm90IGxvYWQgdGhlIGltYWdlITwvcD48YnI+SmF2YVNjcmlwdCBFcnJvcjogPGNvZGU+JHtlLm1lc3NhZ2V9PC9jb2RlPmA7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKERPTVN2Zyk7XG5cblxuXG4vKiQkJCQkXFwgICAgICAgICAgICAgICQkXFwgICAgICAgJCRcXCAgICAgJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQkJCQkXFwgICAgICAgICAgICAkJFxcICAgICAgICQkXFxcbiQkICBfXyQkXFwgICAgICAgICAgICAgJCQgfCAgICAgICQkIHwgICAgXFxfX3wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJCAgX18kJFxcICAgICAgICAgICBcXF9ffCAgICAgICQkIHxcbiQkIC8gIFxcX198ICQkJCQkJFxcICAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCRcXCAkJCQkJCQkXFwgICAkJCQkJCRcXCAgICQkJCQkJCRcXCAgICAgICAkJCAvICBcXF9ffCAkJCQkJCRcXCAgJCRcXCAgJCQkJCQkJCB8XG5cXCQkJCQkJFxcICAkJCAgX18kJFxcIFxcXyQkICBffCAgXFxfJCQgIF98ICAkJCB8JCQgIF9fJCRcXCAkJCAgX18kJFxcICQkICBfX19fX3wgICAgICAkJCB8JCQkJFxcICQkICBfXyQkXFwgJCQgfCQkICBfXyQkIHxcbiBcXF9fX18kJFxcICQkJCQkJCQkIHwgICQkIHwgICAgICAkJCB8ICAgICQkIHwkJCB8ICAkJCB8JCQgLyAgJCQgfFxcJCQkJCQkXFwgICAgICAgICQkIHxcXF8kJCB8JCQgfCAgXFxfX3wkJCB8JCQgLyAgJCQgfFxuJCRcXCAgICQkIHwkJCAgIF9fX198ICAkJCB8JCRcXCAgICQkIHwkJFxcICQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfCBcXF9fX18kJFxcICAgICAgICQkIHwgICQkIHwkJCB8ICAgICAgJCQgfCQkIHwgICQkIHxcblxcJCQkJCQkICB8XFwkJCQkJCQkXFwgICBcXCQkJCQgIHwgIFxcJCQkJCAgfCQkIHwkJCB8ICAkJCB8XFwkJCQkJCQkIHwkJCQkJCQkICB8ICAgICAgXFwkJCQkJCQgIHwkJCB8ICAgICAgJCQgfFxcJCQkJCQkJCB8XG4gXFxfX19fX18vICBcXF9fX19fX198ICAgXFxfX19fLyAgICBcXF9fX18vIFxcX198XFxfX3wgIFxcX198IFxcX19fXyQkIHxcXF9fX19fX18vICAgICAgICBcXF9fX19fXy8gXFxfX3wgICAgICBcXF9ffCBcXF9fX19fX198XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCQgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFwkJCQkJCQgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXF9fX19fKi9cblxuaW50ZXJmYWNlIHNldHRpbmdzR3JpZE9iaiB7XG4gICAgdHlwZTogJ2Jvb2wnfCdzdHJpbmcnXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHRvb2x0aXA/OiBzdHJpbmcgfCB7XG4gICAgICAgIHRleHQ6IHN0cmluZyxcbiAgICAgICAgcG9zaXRpb246ICd0b3AnfCdib3R0b20nfCdsZWZ0J3wncmlnaHQnXG4gICAgfTtcbiAgICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbn1cblxuY29uc3Qgc2V0dGluZ3NUb1VwZGF0ZTogKCgpID0+IHVua25vd24pW10gPSBbXTtcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTZXR0aW5ncygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRpbmdzVG9VcGRhdGUubGVuZ3RoOyBpKyspXG4gICAgICAgIHNldHRpbmdzVG9VcGRhdGVbaV0hKCk7XG59XG5cbnR5cGUgc2V0dGluZ3NHcmlkID0gUmVjb3JkPHN0cmluZywgc2V0dGluZ3NHcmlkT2JqPlxuZXhwb3J0IGNsYXNzIFNldHRpbmdzR3JpZCB7XG4gICAgc3RhdGljIHJlYWRvbmx5IGFzU3RyaW5nID0gJ0JDRCAtIFNldHRpbmdzIEdyaWQnO1xuICAgIHN0YXRpYyByZWFkb25seSBjc3NDbGFzcyA9ICdqcy1zZXR0aW5ncy1ncmlkJztcblxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIHNldHRpbmdUZW1wbGF0ZTogRG9jdW1lbnRGcmFnbWVudDtcbiAgICBzZXR0aW5nc1BhdGg6IHN0cmluZ1tdO1xuICAgIHNldHRpbmdzOiBzZXR0aW5nc0dyaWQ7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJVcGdyYWRlKGVsZW1lbnQsIHRoaXMsIG51bGwsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICB0aGlzLnNldHRpbmdzID0gSlNPTi5wYXJzZShlbGVtZW50LnRleHRDb250ZW50ID8/ICcnKSBhcyBzZXR0aW5nc0dyaWQ7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnJztcblxuICAgICAgICBjb25zdCBzZXR0aW5nc0VsZW1JRCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10ZW1wbGF0ZUlEXCIpO1xuICAgICAgICBpZiAoIXNldHRpbmdzRWxlbUlEKSB0aHJvdyBuZXcgRXJyb3IoXCJTZXR0aW5ncyBHcmlkIGlzIG1pc3NpbmcgdGhlIGRhdGEtdGVtcGxhdGVJRCBhdHRyaWJ1dGUhXCIpO1xuXG4gICAgICAgIGNvbnN0IHNldHRpbmdUZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzRWxlbUlEKTtcbiAgICAgICAgaWYgKCFzZXR0aW5nVGVtcGxhdGUgfHwgIShzZXR0aW5nVGVtcGxhdGUgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KSkgdGhyb3cgbmV3IEVycm9yKGBTZXR0aW5ncyBHcmlkIGNhbm5vdCBmaW5kIGEgVEVNUExBVEUgZWxlbWVudCB3aXRoIHRoZSBJRCBcIiR7c2V0dGluZ3NFbGVtSUR9XCIhYCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nVGVtcGxhdGUgPSBzZXR0aW5nVGVtcGxhdGUuY29udGVudDtcblxuICAgICAgICB0aGlzLnNldHRpbmdzUGF0aCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zZXR0aW5nc1BhdGhcIik/LnNwbGl0KCcuJykgPz8gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBzZXR0aW5nc10gb2YgT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncykpXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNldHRpbmcoa2V5LCBzZXR0aW5ncyk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmhpZGRlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNyZWF0ZVNldHRpbmcoa2V5OiBzdHJpbmcsIHNldHRpbmdzOiBzZXR0aW5nc0dyaWRPYmopIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLnNldHRpbmdUZW1wbGF0ZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFjaGlsZHJlblswXSkgdGhyb3cgbmV3IEVycm9yKFwiU2V0dGluZ3MgR3JpZCB0ZW1wbGF0ZSBpcyBtaXNzaW5nIGEgcm9vdCBlbGVtZW50IVwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjaGlsZHJlbik7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBjaGlsZC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICB0aGlzLnVwZ3JhZGVFbGVtZW50KGNsb25lLCBrZXksIHNldHRpbmdzKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIG5vZGUgd2Fzbid0IHJlbW92ZWQsIGdpdmUgJ2VyIGEgdG9vbHRpcFxuICAgICAgICAgICAgaWYgKGNsb25lLnBhcmVudEVsZW1lbnQgJiYgc2V0dGluZ3MudG9vbHRpcCkgdGhpcy5jcmVhdGVUb29sdGlwKGNsb25lLCBzZXR0aW5ncy50b29sdGlwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVRvb2x0aXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHRvb2x0aXA6IE5vbk51bGxhYmxlPHNldHRpbmdzR3JpZE9ialsndG9vbHRpcCddPikge1xuICAgICAgICAvLzxkaXYgY2xhc3M9XCJqcy1iY2QtdG9vbHRpcFwiIHRvb2x0aXAtcmVsYXRpb249XCJwcm9jZWVkaW5nXCIgdG9vbHRpcC1wb3NpdGlvbj1cImJvdHRvbVwiPjxwPlxuICAgICAgICAvLyAgICBUT09MVElQIElOTkVSIEhUTUxcbiAgICAgICAgLy88L3A+PC9kaXY+XG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdqcy1iY2QtdG9vbHRpcCcpO1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndG9vbHRpcC1yZWxhdGlvbicsICdwcm9jZWVkaW5nJyk7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0b29sdGlwLXBvc2l0aW9uJywgdHlwZW9mIHRvb2x0aXAgPT09ICdvYmplY3QnID8gdG9vbHRpcC5wb3NpdGlvbiA6ICdib3R0b20nKTtcbiAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykpLmlubmVySFRNTCA9IHR5cGVvZiB0b29sdGlwID09PSAnb2JqZWN0JyA/IHRvb2x0aXAudGV4dCA6IHRvb2x0aXA7XG5cbiAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgZWxlbSk7XG4gICAgICAgIG1kbC5jb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50KGVsZW0pO1xuICAgIH1cblxuICAgIHVwZ3JhZGVFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGtleTogc3RyaW5nLCBzZXR0aW5nczogc2V0dGluZ3NHcmlkT2JqKSB7XG4gICAgICAgIGlmICghKGVsZW1lbnQgJiYgJ2dldEF0dHJpYnV0ZScgaW4gZWxlbWVudCkpIHJldHVybiA7Ly9jb25zb2xlLmVycm9yKFwiQSBTZXR0aW5ncyBHcmlkIGVsZW1lbnQgd2FzIG5vdCBhY3R1YWxseSBhbiBlbGVtZW50IVwiLCBlbGVtZW50KTtcblxuICAgICAgICBjb25zdCBmaWx0ZXJUeXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZy1maWx0ZXInKTsgICAgICAgICAgICAgLy8gZXMgbGludC1kaXNhYmxlLW5leHQtbGluZSBzb25hcmpzL25vLW5lc3RlZC10ZW1wbGF0ZS1saXRlcmFsc1xuICAgICAgICAvL2NvbnNvbGUubG9nKGBVcGdyYWRpbmcgY2hpbGQgd2l0aCB0eXBlICR7ZmlsdGVyVHlwZSA/IGAke2ZpbHRlclR5cGV9OmA6Jyd9JHtkaXNwbGF5VHlwZX1gLCBlbGVtZW50LCBzZXR0aW5ncyk7XG5cbiAgICAgICAgaWYgKGZpbHRlclR5cGUgJiYgZmlsdGVyVHlwZSAhPT0gc2V0dGluZ3MudHlwZSkgcmV0dXJuIGVsZW1lbnQucmVtb3ZlKCk7Ly9jb25zb2xlLndhcm4oXCJSZW1vdmluZyBlbGVtZW50IGZyb20gdHJlZTpcIiwgKGVsZW1lbnQucmVtb3ZlKCksIGVsZW1lbnQpKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGVsZW1lbnQuY2hpbGRyZW4pIHRoaXMudXBncmFkZUVsZW1lbnQoY2hpbGQsIGtleSwgc2V0dGluZ3MpO1xuXG4gICAgICAgIGNvbnN0IGRpc3BsYXlUeXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZy1kaXNwbGF5Jyk7XG4gICAgICAgIGlmICghZGlzcGxheVR5cGUpIHJldHVybiA7Ly9jb25zb2xlLndhcm4oJ0EgU2V0dGluZ3MgR3JpZCBlbGVtZW50IGlzIG1pc3NpbmcgdGhlIGBkYXRhLXNldHRpbmctZGlzcGxheWAgYXR0cmlidXRlIScsIGVsZW1lbnQpO1xuXG4gICAgICAgIHN3aXRjaChkaXNwbGF5VHlwZSkge1xuICAgICAgICAgICAgY2FzZSgnaWQnKTpcbiAgICAgICAgICAgICAgICBlbGVtZW50LmlkID0gYHNldHRpbmctLSR7a2V5fWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UoJ2xhYmVsJyk6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBzZXR0aW5ncy5uYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlKCdjaGVja2JveCcpOlxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgZWxlbWVudC5jaGVja2VkID0gISF0aGlzLmdldFNldHRpbmcoa2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcihcIlNldHRpbmdzIEdyaWQgdGVtcGxhdGUgaGFzIGEgY2hlY2tib3ggdGhhdCBpcyBub3QgYW4gSU5QVVQgZWxlbWVudCFcIik7XG5cbiAgICAgICAgICAgICAgICByZWdpc3RlckZvckV2ZW50cyhlbGVtZW50LCB7Y2hhbmdlOiAoKCkgPT4gdGhpcy5zZXRTZXR0aW5nKGtleSwgZWxlbWVudC5jaGVja2VkKSkuYmluZCh0aGlzKX0pO1xuICAgICAgICAgICAgICAgIHNldHRpbmdzVG9VcGRhdGUucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNoZWNrZWQgIT09ICEhdGhpcy5nZXRTZXR0aW5nKGtleSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UoJ2Ryb3Bkb3duJyk6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKEJDRFNldHRpbmdzRHJvcGRvd24uY3NzQ2xhc3MpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW9wdGlvbnMnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5vcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZ3MtcGF0aCcsICBKU09OLnN0cmluZ2lmeSh0aGlzLnNldHRpbmdzUGF0aCkpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXNldHRpbmcnLCAga2V5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEEgU2V0dGluZ3MgR3JpZCBlbGVtZW50IGhhcyBhbiB1bmtub3duIGRpc3BsYXkgdHlwZTogJHtkaXNwbGF5VHlwZX1gLCBlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coYFVwZ3JhZGVkIGVsZW1lbnQgd2l0aCB0eXBlICR7ZGlzcGxheVR5cGV9LiBQYXNzaW5nIG9mZiB0byBNREwgY29tcG9uZW50IGhhbmRsZXIuLi5gKTtcbiAgICAgICAgbWRsLmNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coYEZ1bGx5IHVwZ3JhZGVkIGVsZW1lbnQgd2l0aCB0eXBlICR7ZGlzcGxheVR5cGV9IWApO1xuICAgIH1cblxuICAgIGdldFNldHRpbmc8VFJldHVyblZhbHVlID0gc3RyaW5nfGJvb2xlYW58bnVtYmVyfG51bGw+KGtleTogc3RyaW5nfG51bWJlciwgc3VwcHJlc3NFcnJvciA9IGZhbHNlKTogVFJldHVyblZhbHVlfHVuZGVmaW5lZCB7IHJldHVybiBTZXR0aW5nc0dyaWQuZ2V0U2V0dGluZzxUUmV0dXJuVmFsdWU+KHRoaXMuc2V0dGluZ3NQYXRoLCBrZXksIHN1cHByZXNzRXJyb3IpOyB9XG5cbiAgICBzdGF0aWMgZ2V0U2V0dGluZzxUUmV0dXJuVmFsdWUgPSBzdHJpbmd8Ym9vbGVhbnxudW1iZXJ8bnVsbD4oc2V0dGluZ3NQYXRoOiBzdHJpbmdbXSwga2V5OiBzdHJpbmd8bnVtYmVyLCBzdXBwcmVzc0Vycm9yID0gZmFsc2UpOiBUUmV0dXJuVmFsdWV8dW5kZWZpbmVkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50RGlyID0gd2luZG93O1xuICAgICAgICAgICAgZm9yIChjb25zdCBkaXIgb2Ygc2V0dGluZ3NQYXRoKSAvL0B0cy1pZ25vcmU6IFRoZSBwYXRoIGlzIGR5bmFtaWNhbGx5IHB1bGxlZCBmcm9tIHRoZSBIVE1MIGRvY3VtZW50LCBzbyBpdCdzIG5vdCBwb3NzaWJsZSB0byBrbm93IHdoYXQgaXQgd2lsbCBiZSBhdCBjb21waWxlIHRpbWVcbiAgICAgICAgICAgICAgICBjdXJyZW50RGlyID0gY3VycmVudERpcj8uW2Rpcl07XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50RGlyID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihgU2V0dGluZ3MgR3JpZCBjYW5ub3QgZmluZCB0aGUgc2V0dGluZ3MgcGF0aCBcIiR7c2V0dGluZ3NQYXRoLmpvaW4oJy4nKX1cIiFgKTtcblxuICAgICAgICAgICAgLy9AdHMtaWdub3JlOiAgVGhlIHBhdGggaXMgZHluYW1pY2FsbHkgcHVsbGVkIGZyb20gdGhlIEhUTUwgZG9jdW1lbnQsIHNvIGl0J3Mgbm90IHBvc3NpYmxlIHRvIGtub3cgd2hhdCBpdCB3aWxsIGJlIGF0IGNvbXBpbGUgdGltZVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnREaXJba2V5XTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKCFzdXBwcmVzc0Vycm9yKSBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNldHRpbmcoa2V5OiBzdHJpbmd8bnVtYmVyLCB2YWx1ZTpzdHJpbmd8Ym9vbGVhbnxudW1iZXJ8bnVsbHx1bmRlZmluZWQsIHN1cHByZXNzRXJyb3IgPSBmYWxzZSk6IHZvaWQgeyBTZXR0aW5nc0dyaWQuc2V0U2V0dGluZyh0aGlzLnNldHRpbmdzUGF0aCwga2V5LCB2YWx1ZSwgc3VwcHJlc3NFcnJvcik7IH1cblxuICAgIHN0YXRpYyBzZXRTZXR0aW5nKHNldHRpbmdzUGF0aDogc3RyaW5nW10sIGtleTogc3RyaW5nfG51bWJlciwgdmFsdWU6c3RyaW5nfGJvb2xlYW58bnVtYmVyfG51bGx8dW5kZWZpbmVkLCBzdXBwcmVzc0Vycm9yID0gZmFsc2UpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50RGlyID0gd2luZG93O1xuICAgICAgICAgICAgZm9yIChjb25zdCBkaXIgb2Ygc2V0dGluZ3NQYXRoKSAvL0B0cy1pZ25vcmU6IFRoZSBwYXRoIGlzIGR5bmFtaWNhbGx5IHB1bGxlZCBmcm9tIHRoZSBIVE1MIGRvY3VtZW50LCBzbyBpdCdzIG5vdCBwb3NzaWJsZSB0byBrbm93IHdoYXQgaXQgd2lsbCBiZSBhdCBjb21waWxlIHRpbWVcbiAgICAgICAgICAgICAgICBjdXJyZW50RGlyID0gY3VycmVudERpcj8uW2Rpcl07XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50RGlyID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihgU2V0dGluZ3MgR3JpZCBjYW5ub3QgZmluZCB0aGUgc2V0dGluZ3MgcGF0aCBcIiR7c2V0dGluZ3NQYXRoLmpvaW4oJy4nKX1cIiFgKTtcblxuICAgICAgICAgICAgLy9AdHMtaWdub3JlOiBUaGUgcGF0aCBpcyBkeW5hbWljYWxseSBwdWxsZWQgZnJvbSB0aGUgSFRNTCBkb2N1bWVudCwgc28gaXQncyBub3QgcG9zc2libGUgdG8ga25vdyB3aGF0IGl0IHdpbGwgYmUgYXQgY29tcGlsZSB0aW1lXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudERpcltrZXldID0gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICghc3VwcHJlc3NFcnJvcikgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKFNldHRpbmdzR3JpZCk7XG5cbi8qKiBWYXJpYWJsZSB0byB3b3JrIGFyb3VuZCB0aGUgY29tcGxleGl0aWVzIG9mIENvbnN0cnVjdG9ycyBhbmQgd2hhdG5vdCAqL1xubGV0IHRlbXBLZXlNYXAgPSB7fTtcbmV4cG9ydCBjbGFzcyBCQ0RTZXR0aW5nc0Ryb3Bkb3duIGV4dGVuZHMgQkNERHJvcGRvd24ge1xuICAgIHN0YXRpYyByZWFkb25seSBhc1N0cmluZyA9ICdCQ0QgU2V0dGluZ3MgRHJvcGRvd24nO1xuICAgIHN0YXRpYyByZWFkb25seSBjc3NDbGFzcyA9ICdqcy1iY2Qtc2V0dGluZ3MtZHJvcGRvd24nO1xuXG4gICAgc2V0dGluZ3NQYXRoOnN0cmluZ1tdID0gSlNPTi5wYXJzZSh0aGlzLmVsZW1lbnRfLmdldEF0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy1wYXRoJykgPz8gJ1tdJyk7XG4gICAgc2V0dGluZ0tleSA9IHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLXNldHRpbmcnKSA/PyAnJztcbiAgICBrZXlNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdDb25zdHJ1Y3RpbmcgQkNEU2V0dGluZ3NEcm9wZG93bicsIGVsZW1lbnQpO1xuICAgICAgICBzdXBlcihlbGVtZW50LCBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xuICAgICAgICB0aGlzLmtleU1hcCA9IHRlbXBLZXlNYXA7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tCQ0QtRFJPUERPV05dIEtleSBtYXAgaXMgbm93JywgdGhpcy5rZXlNYXApO1xuICAgICAgICAvL3RoaXMuc2VsZWN0QnlTdHJpbmcoU2V0dGluZ3NHcmlkLmdldFNldHRpbmcodGhpcy5zZXR0aW5nc1BhdGgsIHRoaXMuc2V0dGluZ0tleSkgPz8gJycpO1xuICAgICAgICBzZXR0aW5nc1RvVXBkYXRlLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RCeVN0cmluZyhTZXR0aW5nc0dyaWQuZ2V0U2V0dGluZyh0aGlzLnNldHRpbmdzUGF0aCwgdGhpcy5zZXR0aW5nS2V5KSA/PyAnJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHNlbGVjdEJ5U3RyaW5nKG9wdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tCQ0QtRFJPUERPV05dIFNlbGVjdGluZyBieSBzdHJpbmcnLCBvcHRpb24sICdha2EnLCB0aGlzLmtleU1hcD8uW29wdGlvbl0sIHtrZXlNYXA6IHRoaXMua2V5TWFwfSk7XG4gICAgICAgIHN1cGVyLnNlbGVjdEJ5U3RyaW5nKHRoaXMua2V5TWFwW29wdGlvbl0gPz8gb3B0aW9uKTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBvcHRpb25zKCk6IG9wdGlvbk9iaiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IG9wdGlvbk9iaiA9IHt9O1xuICAgICAgICBPYmplY3QuZW50cmllczxzdHJpbmc+KEpTT04ucGFyc2UodGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3B0aW9ucycpID8/ICdbXScpKS5mb3JFYWNoKChbbGl0ZXJhbE5hbWUsIHByZXR0eU5hbWVdKSA9PiB7XG4gICAgICAgICAgICBvcHRpb25zW3ByZXR0eU5hbWUudG9TdHJpbmcoKV0gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2V0dGluZ3NHcmlkLnNldFNldHRpbmcodGhpcy5zZXR0aW5nc1BhdGgsIHRoaXMuc2V0dGluZ0tleSwgbGl0ZXJhbE5hbWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnW0JDRC1EUk9QRE9XTl0gQWRkaW5nIG9wdGlvbicsIGxpdGVyYWxOYW1lLCAnYWthJywgcHJldHR5TmFtZSk7XG4gICAgICAgICAgIHRoaXMua2V5TWFwID8/PSB7fTtcbiAgICAgICAgICAgIHRoaXMua2V5TWFwW2xpdGVyYWxOYW1lXSA9IHByZXR0eU5hbWU7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdbQkNELURST1BET1dOXSBLZXkgbWFwIGlzIG5vdycsIHRoaXMua2V5TWFwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRlbXBLZXlNYXAgPSB0aGlzLmtleU1hcDtcblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG59XG5jb21wb25lbnRzVG9SZWdpc3Rlci5wdXNoKEJDRFNldHRpbmdzRHJvcGRvd24pO1xud2luZG93LkJDRFNldHRpbmdzRHJvcGRvd24gPSBCQ0RTZXR0aW5nc0Ryb3Bkb3duO1xuXG5cbi8qXG5cblxuXG4kJCQkJCQkXFwgICAkJCQkJCRcXCAgJCRcXCAgICAgICQkXFwgICAgICAgICAkJCQkJCQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCRcXFxuJCQgIF9fJCRcXCAkJCAgX18kJFxcICQkJFxcICAgICQkJCB8ICAgICAgICAkJCAgX18kJFxcICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuJCQgfCAgJCQgfCQkIC8gICQkIHwkJCQkXFwgICQkJCQgfCAgICAgICAgJCQgfCAgJCQgfCAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCQkJCQkJCB8JCRcXCAgICQkXFxcbiQkIHwgICQkIHwkJCB8ICAkJCB8JCRcXCQkXFwkJCAkJCB8JCQkJCQkXFwgJCQkJCQkJCAgfCQkICBfXyQkXFwgIFxcX19fXyQkXFwgJCQgIF9fJCQgfCQkIHwgICQkIHxcbiQkIHwgICQkIHwkJCB8ICAkJCB8JCQgXFwkJCQgICQkIHxcXF9fX19fX3wkJCAgX18kJDwgJCQkJCQkJCQgfCAkJCQkJCQkIHwkJCAvICAkJCB8JCQgfCAgJCQgfFxuJCQgfCAgJCQgfCQkIHwgICQkIHwkJCB8XFwkICAvJCQgfCAgICAgICAgJCQgfCAgJCQgfCQkICAgX19fX3wkJCAgX18kJCB8JCQgfCAgJCQgfCQkIHwgICQkIHxcbiQkJCQkJCQgIHwgJCQkJCQkICB8JCQgfCBcXF8vICQkIHwgICAgICAgICQkIHwgICQkIHxcXCQkJCQkJCRcXCBcXCQkJCQkJCQgfFxcJCQkJCQkJCB8XFwkJCQkJCQkIHxcblxcX19fX19fXy8gIFxcX19fX19fLyBcXF9ffCAgICAgXFxfX3wgICAgICAgIFxcX198ICBcXF9ffCBcXF9fX19fX198IFxcX19fX19fX3wgXFxfX19fX19ffCBcXF9fX18kJCB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCQgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFwkJCQkJCQgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXF9fX19fXy9cbiQkJCQkJFxcICAgICAgICAgICAkJFxcICAgJCRcXCAgICAgJCRcXCAgICAgICAgICAgJCRcXCAkJFxcICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgICAkJFxcXG5cXF8kJCAgX3wgICAgICAgICAgXFxfX3wgICQkIHwgICAgXFxfX3wgICAgICAgICAgJCQgfFxcX198ICAgICAgICAgICAgICAgICAgICAgICQkIHwgICAgXFxfX3xcbiAgJCQgfCAgJCQkJCQkJFxcICAkJFxcICQkJCQkJFxcICAgJCRcXCAgJCQkJCQkXFwgICQkIHwkJFxcICQkJCQkJCQkXFwgICQkJCQkJFxcICAkJCQkJCRcXCAgICQkXFwgICQkJCQkJFxcICAkJCQkJCQkXFxcbiAgJCQgfCAgJCQgIF9fJCRcXCAkJCB8XFxfJCQgIF98ICAkJCB8IFxcX19fXyQkXFwgJCQgfCQkIHxcXF9fX18kJCAgfCBcXF9fX18kJFxcIFxcXyQkICBffCAgJCQgfCQkICBfXyQkXFwgJCQgIF9fJCRcXFxuICAkJCB8ICAkJCB8ICAkJCB8JCQgfCAgJCQgfCAgICAkJCB8ICQkJCQkJCQgfCQkIHwkJCB8ICAkJCQkIF8vICAkJCQkJCQkIHwgICQkIHwgICAgJCQgfCQkIC8gICQkIHwkJCB8ICAkJCB8XG4gICQkIHwgICQkIHwgICQkIHwkJCB8ICAkJCB8JCRcXCAkJCB8JCQgIF9fJCQgfCQkIHwkJCB8ICQkICBfLyAgICQkICBfXyQkIHwgICQkIHwkJFxcICQkIHwkJCB8ICAkJCB8JCQgfCAgJCQgfFxuJCQkJCQkXFwgJCQgfCAgJCQgfCQkIHwgIFxcJCQkJCAgfCQkIHxcXCQkJCQkJCQgfCQkIHwkJCB8JCQkJCQkJCRcXCBcXCQkJCQkJCQgfCAgXFwkJCQkICB8JCQgfFxcJCQkJCQkICB8JCQgfCAgJCQgfFxuXFxfX19fX198XFxfX3wgIFxcX198XFxfX3wgICBcXF9fX18vIFxcX198IFxcX19fX19fX3xcXF9ffFxcX198XFxfX19fX19fX3wgXFxfX19fX19ffCAgIFxcX19fXy8gXFxfX3wgXFxfX19fX18vIFxcX198ICBcXF9ffFxuXG5cblxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGJjZF91bml2ZXJzYWxKU19pbml0KCk6dm9pZCB7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUmVnaXN0ZXIgYWxsIHRoZSB0aGluZ3MhXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGFmdGVyRGVsYXkoMTAsICgpPT4gIHJlZ2lzdGVyQkNEQ29tcG9uZW50cygpICk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gTW9kaWZ5IGxpbmtzIG5vdCBpbiB0aGUgbWFpbiBuYXYgdG8gbm90IHNlbmQgYSByZWZlcnJlclxuICAgIC8vIChhbGxvd3MgZm9yIGZhbmN5IGRyYXdlciBzdHVmZilcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZm9yIChjb25zdCBsaW5rIG9mIFsuLi5kb2N1bWVudC5saW5rc10pe1xuICAgICAgICBpZiAod2luZG93LmxheW91dC5kcmF3ZXJfPy5jb250YWlucyhsaW5rKSkgbGluay5yZWwgKz0gXCIgbm9vcGVuZXJcIjtcbiAgICAgICAgZWxzZSBsaW5rLnJlbCArPSBcIiBub29wZW5lciBub3JlZmVycmVyXCI7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFJhbmRvbSB0ZXh0IHRpbWUhXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgY29uc3QgcmFuZG9tVGV4dEZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5kb21pemVkLXRleHQtZmllbGRcIik7XG4gICAgaWYgKCFyYW5kb21UZXh0RmllbGQpIHRocm93IG5ldyBFcnJvcihcIk5vIHJhbmRvbSB0ZXh0IGZpZWxkIGZvdW5kIVwiKTtcblxuICAgIGNvbnN0IHF1b3RlID0gcXVvdGVzLmdldFJhbmRvbVF1b3RlKCk7XG4gICAgcmFuZG9tVGV4dEZpZWxkLmlubmVySFRNTCA9IHR5cGVvZiBxdW90ZSA9PT0gXCJzdHJpbmdcIiA/IHF1b3RlIDogcXVvdGVbMV0hO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEltcG9ydCBMYXp5LUxvYWRlZCBTdHlsZXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgYWZ0ZXJEZWxheSgxMDAsICgpID0+IHtcbiAgICAgICAgY29uc3QgbGF6eVN0eWxlcyA9IEpTT04ucGFyc2UoYFske2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXp5LXN0eWxlcycpPy50ZXh0Q29udGVudCA/PyAnJ31dYCkgYXMgc3RyaW5nW107XG5cbiAgICAgICAgZm9yIChjb25zdCBzdHlsZSBvZiBsYXp5U3R5bGVzKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG4gICAgICAgICAgICBsaW5rLmhyZWYgPSBzdHlsZTtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbGF6eS1zdHlsZXMtbm90LWxvYWRlZCcpO1xuICAgICAgICB3aW5kb3cubGF6eVN0eWxlc0xvYWRlZCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU2V0IG1haW4gY29udGVudCBkaXYgdG8gcmVzcGVjdCB0aGUgZm9vdGVyIGZvciBtb2JpbGVcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvLyBOT1RFOiBUaGlzIGNvZGUgaGFzIGJlZW4gY29tcGlsZWQsIG1pbmlmaWVkLCBhbmQgcmVsb2NhdGVkIHRvIHRoZSBwYWdlIEhUTUwgaXRzZWxmXG5cbiAgICAvL2NvbnN0IGZvb3RlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb290ZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAvL1xuICAgIC8vaWYgKCFmb290ZXIpIHRocm93IG5ldyBFcnJvcignTm8gbWFpbiBvciBmb290ZXIgZGl2IGZvdW5kIScpO1xuICAgIC8vZnVuY3Rpb24gcmVzaXplTWFpbigpIHtcbiAgICAvLyAgICBjb25zdCBmb290ZXJIZWlnaHQgPSAoZm9vdGVyIS5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudCk/Lm9mZnNldEhlaWdodCA/PyAwO1xuICAgIC8vICAgIGZvb3RlciEuc3R5bGUuaGVpZ2h0ID0gYCR7Zm9vdGVySGVpZ2h0fXB4YDtcbiAgICAvL31cbiAgICAvL2NvbnN0IGNvbnRSZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihyZXNpemVNYWluKTtcbiAgICAvL3Jlc2l6ZU1haW4oKTtcbiAgICAvL2NvbnRSZXNpemVPYnNlcnZlci5vYnNlcnZlKGZvb3Rlci5maXJzdEVsZW1lbnRDaGlsZCA/PyBmb290ZXIpO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFJlZ2lzdGVyIGZvciBtb3JlIGluY2x1c2l2ZSBpbnZlbnRzIGFzIGEgcmVwbGFjZW1lbnQgZm9yIHRoZSBgb25jbGlja2AgYXR0cmlidXRlXG4gICAgLy8gRm9yIGJ1dHRvbnMsIHJlZ2lzdGVyIHNvbWUgZXZlbnRzIHRvIGFzc2lzdCBpbiB2aXN1YWwgc3R5bGluZ1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGFmdGVyRGVsYXkoMTUwLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzV2l0aENsaWNrRXZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW29uY2xpY2tdJykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50c1dpdGhDbGlja0V2dCkge1xuICAgICAgICAgICAgY29uc3QgZnVuY3QgPSBlbGVtZW50Lm9uY2xpY2sgYXMgRXZlbnRUeXBlczxIVE1MRWxlbWVudD5bJ2FjdGl2YXRlJ107XG4gICAgICAgICAgICBpZiAoIWZ1bmN0KSBjb250aW51ZTtcblxuICAgICAgICAgICAgcmVnaXN0ZXJGb3JFdmVudHMoZWxlbWVudCwge2FjdGl2YXRlOiBmdW5jdH0pO1xuXG4gICAgICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBudWxsO1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ29uY2xpY2snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKTtcbiAgICAgICAgZnVuY3Rpb24gYmx1ckVsZW0odGhpczogSFRNTEVsZW1lbnQpIHsgdGhpcy5ibHVyKCk7IH1cbiAgICAgICAgZm9yIChjb25zdCBidXR0b24gb2YgYnV0dG9ucykge1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBibHVyRWxlbSk7XG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBibHVyRWxlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBBZGQgSURzIHRvIGFsbCBoZWFkZXJzIC0gT05MWSBGT1IgVVNFIElOIFNBTUUtUEFHRSBMSU5LU1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBhZnRlckRlbGF5KDIwMCwgKCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnOmlzKG5hdiwgbWFpbikgOmlzKGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYpJyk7XG4gICAgICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIGlmIChoZWFkZXIuaWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaGVhZGVyLmlkID0gaGVhZGVyLnRleHRDb250ZW50Py50cmltKCkucmVwbGFjZSgvWydcIis9PyFAIyQlXipdKy9naSwgJycpLnJlcGxhY2UoLyYrL2dpLCAnYW5kJykucmVwbGFjZSgvW15hLXowLTldKy9naSwgJy0nKS50b0xvd2VyQ2FzZSgpID8/ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmF2SGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ25hdiA6aXMoaDEsIGgyLCBoMywgaDQsIGg1LCBoNiknKTtcbiAgICAgICAgZm9yIChjb25zdCBoZWFkZXIgb2YgbmF2SGVhZGVycykgeyBpZiAoaGVhZGVyLmlkKSBoZWFkZXIuaWQgPSBgbmF2LSR7aGVhZGVyLmlkfWA7IH1cblxuICAgICAgICAvLyBTY3JvbGwgdG8gdGhlIGhhc2ggaWYgaXQgZXhpc3RzXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKCcjJykpICB7XG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcjJykgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbSkgZWxlbS5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcbiAgICAgICAgICAgICAgICBlbHNlIGNvbnNvbGUuaW5mbyhgTm8gZWxlbWVudCB3aXRoIElEIFwiJHt3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSl9XCIgZm91bmQhYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFJlZ2lzdGVyIGZvciB0aGUgZHJhd2VyIG9wZW4vY2xvc2UgZXZlbnRzXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgY29uc3QgZHJhd2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX2RyYXdlcicpIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYXdlck9wZW4nLCBkcmF3ZXJPcGVuSGFuZGxlcik7XG4gICAgZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYXdlckNsb3NlJywgZHJhd2VyQ2xvc2VIYW5kbGVyKTtcblxuICAgIGlmIChkcmF3ZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy12aXNpYmxlJykpIGRyYXdlck9wZW5IYW5kbGVyLmNhbGwoZHJhd2VyKTtcbiAgICBlbHNlIGRyYXdlckNsb3NlSGFuZGxlci5jYWxsKGRyYXdlcik7XG5cbn1cbndpbmRvdy5iY2RfaW5pdF9mdW5jdGlvbnMudW5pdmVyc2FsID0gYmNkX3VuaXZlcnNhbEpTX2luaXQ7XG5cblxuZnVuY3Rpb24gZHJhd2VyT3BlbkhhbmRsZXIodGhpczogSFRNTERpdkVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICBCQ0RfQ29sbGFwc2libGVQYXJlbnQuc2V0RGlzYWJsZWQodGhpcywgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBkcmF3ZXJDbG9zZUhhbmRsZXIodGhpczogSFRNTERpdkVsZW1lbnQpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIEJDRF9Db2xsYXBzaWJsZVBhcmVudC5zZXREaXNhYmxlZCh0aGlzLCB0cnVlKTtcbn1cbiJdfQ==