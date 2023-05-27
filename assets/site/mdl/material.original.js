var registeredComponents_ = [];
var createdComponents_ = [];
var componentConfigProperty_ = 'mdlComponentConfigInternal_';
export const componentHandler = {
    findRegisteredClass_(name, optReplace) {
        for (var i = 0; i < registeredComponents_.length; i++) {
            if (registeredComponents_[i].className === name) {
                if (typeof optReplace !== 'undefined') {
                    registeredComponents_[i] = optReplace;
                }
                return registeredComponents_[i];
            }
        }
        return false;
    },
    getUpgradedListOfElement_(element) {
        var dataUpgraded = element.getAttribute('data-upgraded');
        return dataUpgraded === null ? [''] : dataUpgraded.split(',');
    },
    isElementUpgraded_(element, jsClass) {
        var upgradedList = componentHandler.getUpgradedListOfElement_(element);
        return upgradedList.indexOf(jsClass) !== -1;
    },
    createEvent_(eventType, bubbles, cancelable) {
        if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
            return new CustomEvent(eventType, {
                bubbles,
                cancelable
            });
        }
        else {
            var ev = document.createEvent('Events');
            ev.initEvent(eventType, bubbles, cancelable);
            return ev;
        }
    },
    upgradeDom(optJsClass, optCssClass) {
        if (typeof optJsClass === 'undefined' &&
            typeof optCssClass === 'undefined') {
            for (var i = 0; i < registeredComponents_.length; i++) {
                componentHandler.upgradeDom(registeredComponents_[i].className, registeredComponents_[i].cssClass);
            }
        }
        else {
            var jsClass = (optJsClass);
            if (typeof optCssClass === 'undefined') {
                var registeredClass = componentHandler.findRegisteredClass_(jsClass);
                if (registeredClass) {
                    optCssClass = registeredClass.cssClass;
                }
            }
            var elements = document.querySelectorAll(`.${optCssClass}`);
            for (var n = 0; n < elements.length; n++) {
                componentHandler.upgradeElement(elements[n], jsClass);
            }
        }
    },
    upgradeElement(element, optJsClass) {
        if (!(typeof element === 'object' && element instanceof Element)) {
            throw new Error('Invalid argument provided to upgrade MDL element.');
        }
        var upgradingEv = componentHandler.createEvent_('mdl-componentupgrading', true, true);
        element.dispatchEvent(upgradingEv);
        if (upgradingEv.defaultPrevented) {
            return;
        }
        var upgradedList = componentHandler.getUpgradedListOfElement_(element);
        var classesToUpgrade = [];
        if (!optJsClass) {
            var classList = element.classList;
            for (const component of registeredComponents_) {
                if (classList.contains(component.cssClass) &&
                    classesToUpgrade.indexOf(component) === -1 &&
                    !componentHandler.isElementUpgraded_(element, component.className)) {
                    classesToUpgrade.push(component);
                }
            }
        }
        else if (!componentHandler.isElementUpgraded_(element, optJsClass)) {
            classesToUpgrade.push(componentHandler.findRegisteredClass_(optJsClass));
        }
        for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
            registeredClass = classesToUpgrade[i];
            if (registeredClass) {
                upgradedList.push(registeredClass.className);
                element.setAttribute('data-upgraded', upgradedList.join(','));
                var instance = new registeredClass.classConstructor(element);
                instance[componentConfigProperty_] = registeredClass;
                createdComponents_.push(instance);
                for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
                    registeredClass.callbacks[j](element);
                }
                if (registeredClass.widget) {
                    element[registeredClass.className] = instance;
                }
            }
            else {
                throw new Error('Unable to find a registered component for the given class.');
            }
            var upgradedEv = componentHandler.createEvent_('mdl-componentupgraded', true, false);
            element.dispatchEvent(upgradedEv);
        }
    },
    upgradeElements(elements) {
        if (!Array.isArray(elements)) {
            if (elements instanceof Element) {
                elements = [elements];
            }
            else {
                elements = Array.prototype.slice.call(elements);
            }
        }
        for (var i = 0, n = elements.length, element; i < n; i++) {
            element = elements[i];
            if (element instanceof HTMLElement) {
                componentHandler.upgradeElement(element);
                if (element.children.length > 0) {
                    componentHandler.upgradeElements(element.children);
                }
            }
        }
    },
    register(config) {
        var widgetMissing = (typeof config.widget === 'undefined' &&
            typeof config['widget'] === 'undefined');
        var widget = true;
        if (!widgetMissing) {
            widget = config.widget || config['widget'];
        }
        var newConfig = ({
            classConstructor: config.constructor || config['constructor'],
            className: config.classAsString || config['classAsString'],
            cssClass: config.cssClass || config['cssClass'],
            widget,
            callbacks: []
        });
        for (const item of registeredComponents_) {
            if (item.cssClass === newConfig.cssClass) {
                throw new Error(`The provided cssClass has already been registered: ${item.cssClass}`);
            }
            if (item.className === newConfig.className) {
                throw new Error('The provided className has already been registered');
            }
        }
        if (typeof config.constructor !== 'undefined' && typeof config.constructor.prototype !== 'undefined' && typeof config.constructor.prototype.componentConfigProperty_ !== 'undefined') {
            throw new Error(`MDL component classes must not have ${componentConfigProperty_} defined as a property.`);
        }
        var found = componentHandler.findRegisteredClass_(config.classAsString, newConfig);
        if (!found) {
            registeredComponents_.push(newConfig);
        }
    },
    registerUpgradedCallback(jsClass, callback) {
        var regClass = componentHandler.findRegisteredClass_(jsClass);
        if (regClass) {
            regClass.callbacks.push(callback);
        }
    },
    upgradeAllRegistered() {
        for (var n = 0; n < registeredComponents_.length; n++) {
            componentHandler.upgradeDom(registeredComponents_[n].className);
        }
    },
    deconstructComponent(component) {
        if (component) {
            var componentIndex = createdComponents_.indexOf(component);
            createdComponents_.splice(componentIndex, 1);
            var upgrades = component.element_.getAttribute('data-upgraded').split(',');
            var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
            upgrades.splice(componentPlace, 1);
            component.element_.setAttribute('data-upgraded', upgrades.join(','));
            var ev = componentHandler.createEvent_('mdl-componentdowngraded', true, false);
            component.element_.dispatchEvent(ev);
        }
    },
    downgradeNodes(nodes) {
        function downgradeNode(node) {
            createdComponents_.filter(item => item.element_ === node).forEach(componentHandler.deconstructComponentInternal);
        }
        if (nodes instanceof Array || nodes instanceof NodeList) {
            for (var n = 0; n < nodes.length; n++) {
                downgradeNode(nodes[n]);
            }
        }
        else if (nodes instanceof Node) {
            downgradeNode(nodes);
        }
        else {
            throw new Error('Invalid argument provided to downgrade MDL nodes.');
        }
    },
    ComponentConfigPublic: {},
    ComponentConfig: {},
    Component: {}
};
window.componentHandler = componentHandler;
function basicConstructor(element, _this) {
    _this.element_ = element;
    _this.init();
}
if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
}
var vendors = [
    'webkit',
    'moz'
];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[`${vp}RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vp}CancelAnimationFrame`] || window[`${vp}CancelRequestAnimationFrame`];
}
if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
}
export class MaterialButton {
    element_;
    constructor(element) { basicConstructor(element, this); }
    blurHandler_(event) {
        if (event) {
            this.element_.blur();
        }
    }
    disable() {
        this.element_.disabled = true;
    }
    enable() {
        this.element_.disabled = false;
    }
    init() {
        if (this.element_) {
            this.boundRippleBlurHandler = this.blurHandler_.bind(this);
            if (this.element_.classList.contains(this.cssClasses_.RIPPLE_EFFECT)) {
                var rippleContainer = document.createElement('span');
                rippleContainer.classList.add(this.cssClasses_.RIPPLE_CONTAINER);
                this.rippleElement_ = document.createElement('span');
                this.rippleElement_.classList.add(this.cssClasses_.RIPPLE);
                this.rippleElement_.addEventListener(window.clickEvt, this.boundRippleBlurHandler);
                rippleContainer.appendChild(this.rippleElement_);
                this.element_.appendChild(rippleContainer);
            }
            this.element_.addEventListener(window.clickEvt, this.boundButtonBlurHandler);
            this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
        }
    }
    Constant_ = {};
    cssClasses_ = {
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_CONTAINER: 'mdl-button__ripple-container',
        RIPPLE: 'mdl-ripple'
    };
}
window['MaterialButton'] = MaterialButton;
componentHandler.register({
    constructor: MaterialButton,
    classAsString: 'MaterialButton',
    cssClass: 'mdl-js-button',
    widget: true
});
export class MaterialCheckbox {
    constructor(element) {
        basicConstructor(element, this);
    }
    static Constant_ = { TINY_TIMEOUT: 0.001 };
    static cssClasses_ = {
        INPUT: 'mdl-checkbox__input',
        BOX_OUTLINE: 'mdl-checkbox__box-outline',
        FOCUS_HELPER: 'mdl-checkbox__focus-helper',
        TICK_OUTLINE: 'mdl-checkbox__tick-outline',
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
        RIPPLE_CENTER: 'mdl-ripple--center',
        RIPPLE: 'mdl-ripple',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded'
    };
    onChange_(event) {
        this.updateClasses_();
    }
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    onMouseUp_(event) {
        this.blur_();
    }
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    blur_() {
        window.setTimeout(function () {
            this.inputElement_.blur();
        }.bind(this), this.Constant_.TINY_TIMEOUT);
    }
    checkToggleState() {
        if (this.inputElement_.checked) {
            this.element_.classList.add(this.cssClasses_.IS_CHECKED);
            this.inputElement_.checked = true;
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_CHECKED);
            this.inputElement_.checked = false;
        }
    }
    checkDisabled() {
        if (this.inputElement_.disabled) {
            this.element_.classList.add(this.cssClasses_.IS_DISABLED);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_DISABLED);
        }
    }
    disable() {
        this.inputElement_.disabled = true;
        this.updateClasses_();
    }
    enable() {
        this.inputElement_.disabled = false;
        this.updateClasses_();
    }
    check() {
        this.inputElement_.checked = true;
        this.updateClasses_();
    }
    uncheck() {
        this.inputElement_.checked = false;
        this.updateClasses_();
    }
    init() {
        if (this.element_) {
            this.inputElement_ = this.element_.querySelector(`.${this.cssClasses_.INPUT}`);
            var boxOutline = document.createElement('span');
            boxOutline.classList.add(this.cssClasses_.BOX_OUTLINE);
            var tickContainer = document.createElement('span');
            tickContainer.classList.add(this.cssClasses_.FOCUS_HELPER);
            var tickOutline = document.createElement('span');
            tickOutline.classList.add(this.cssClasses_.TICK_OUTLINE);
            boxOutline.appendChild(tickOutline);
            this.element_.appendChild(tickContainer);
            this.element_.appendChild(boxOutline);
            if (this.element_.classList.contains(this.cssClasses_.RIPPLE_EFFECT)) {
                this.element_.classList.add(this.cssClasses_.RIPPLE_IGNORE_EVENTS);
                this.rippleContainerElement_ = document.createElement('span');
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_CONTAINER);
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_EFFECT);
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_CENTER);
                this.boundRippleMouseUp = this.onMouseUp_.bind(this);
                this.rippleContainerElement_.addEventListener(window.clickEvt, this.boundRippleMouseUp);
                var ripple = document.createElement('span');
                ripple.classList.add(this.cssClasses_.RIPPLE);
                this.rippleContainerElement_.appendChild(ripple);
                this.element_.appendChild(this.rippleContainerElement_);
            }
            this.boundInputOnChange = this.onChange_.bind(this);
            this.boundInputOnFocus = this.onFocus_.bind(this);
            this.boundInputOnBlur = this.onBlur_.bind(this);
            this.boundElementMouseUp = this.onMouseUp_.bind(this);
            this.inputElement_.addEventListener('change', this.boundInputOnChange);
            this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
            this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
            this.element_.addEventListener(window.clickEvt, this.boundElementMouseUp);
            this.updateClasses_();
            this.element_.classList.add(this.cssClasses_.IS_UPGRADED);
        }
    }
}
window['MaterialCheckbox'] = MaterialCheckbox;
componentHandler.register({
    constructor: MaterialCheckbox,
    classAsString: 'MaterialCheckbox',
    cssClass: 'mdl-js-checkbox',
    widget: true
});
export class MaterialIconToggle {
    constructor(element) { basicConstructor(element, this); }
    onChange_(event) {
        this.updateClasses_();
    }
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    onMouseUp_(event) {
        this.blur_();
    }
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    disable() {
        this.inputElement_.disabled = true;
        this.updateClasses_();
    }
    enable() {
        this.inputElement_.disabled = false;
        this.updateClasses_();
    }
    check() {
        this.inputElement_.checked = true;
        this.updateClasses_();
    }
    uncheck() {
        this.inputElement_.checked = false;
        this.updateClasses_();
    }
    init() {
        if (this.element_) {
            this.inputElement_ = this.element_.querySelector(`.${this.cssClasses_.INPUT}`);
            if (this.element_.classList.contains(this.cssClasses_.JS_RIPPLE_EFFECT)) {
                this.element_.classList.add(this.cssClasses_.RIPPLE_IGNORE_EVENTS);
                this.rippleContainerElement_ = document.createElement('span');
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_CONTAINER);
                this.rippleContainerElement_.classList.add(this.cssClasses_.JS_RIPPLE_EFFECT);
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_CENTER);
                this.boundRippleMouseUp = this.onMouseUp_.bind(this);
                this.rippleContainerElement_.addEventListener(window.clickEvt, this.boundRippleMouseUp);
                var ripple = document.createElement('span');
                ripple.classList.add(this.cssClasses_.RIPPLE);
                this.rippleContainerElement_.appendChild(ripple);
                this.element_.appendChild(this.rippleContainerElement_);
            }
            this.boundInputOnChange = this.onChange_.bind(this);
            this.boundInputOnFocus = this.onFocus_.bind(this);
            this.boundInputOnBlur = this.onBlur_.bind(this);
            this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
            this.inputElement_.addEventListener('change', this.boundInputOnChange);
            this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
            this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
            this.element_.addEventListener(window.clickEvt, this.boundElementOnMouseUp);
            this.updateClasses_();
            this.element_.classList.add('is-upgraded');
        }
    }
    Constant_ = { TINY_TIMEOUT: 0.001 };
    cssClasses_ = {
        INPUT: 'mdl-icon-toggle__input',
        JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
        RIPPLE_CENTER: 'mdl-ripple--center',
        RIPPLE: 'mdl-ripple',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked'
    };
    blur_ = MaterialCheckbox.prototype.blur_;
    checkToggleState = MaterialCheckbox.prototype.checkToggleState;
    checkDisabled = MaterialCheckbox.prototype.checkDisabled;
}
window['MaterialIconToggle'] = MaterialIconToggle;
componentHandler.register({
    constructor: MaterialIconToggle,
    classAsString: 'MaterialIconToggle',
    cssClass: 'mdl-js-icon-toggle',
    widget: true
});
export class MaterialMenu {
    element_;
    constructor(element) {
        this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
        this.boundItemClick_ = this.handleItemClick_.bind(this);
        this.boundForKeydown_ = this.handleForKeyboardEvent_.bind(this);
        this.boundForClick_ = this.handleForClick_.bind(this);
        basicConstructor(element, this);
        this.element_ = element;
    }
    init() {
        if (this.element_) {
            var container = document.createElement('div');
            container.classList.add(MaterialMenu.cssClasses_.CONTAINER);
            this.element_.parentElement.insertBefore(container, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            container.appendChild(this.element_);
            this.container_ = container;
            var outline = document.createElement('div');
            outline.classList.add(MaterialMenu.cssClasses_.OUTLINE);
            this.outline_ = outline;
            container.insertBefore(outline, this.element_);
            var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');
            var forEl = undefined;
            if (forElId) {
                forEl = document.getElementById(forElId);
                if (forEl) {
                    forEl.addEventListener(window.clickEvt, this.boundForKeydown_);
                    forEl.addEventListener('keydown', this.boundForClick_);
                }
            }
            this.forElement_ = forEl;
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}`);
            for (const item of items) {
                this.registerItem(item);
            }
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.RIPPLE_EFFECT)) {
                this.element_.classList.add(MaterialMenu.cssClasses_.RIPPLE_IGNORE_EVENTS);
            }
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.BOTTOM_LEFT)) {
                this.outline_.classList.add(MaterialMenu.cssClasses_.BOTTOM_LEFT);
            }
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.BOTTOM_RIGHT)) {
                this.outline_.classList.add(MaterialMenu.cssClasses_.BOTTOM_RIGHT);
            }
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT)) {
                this.outline_.classList.add(MaterialMenu.cssClasses_.TOP_LEFT);
            }
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
                this.outline_.classList.add(MaterialMenu.cssClasses_.TOP_RIGHT);
            }
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.UNALIGNED)) {
                this.outline_.classList.add(MaterialMenu.cssClasses_.UNALIGNED);
            }
            container.classList.add(MaterialMenu.cssClasses_.IS_UPGRADED);
        }
    }
    registerItem(item) {
        item.tabIndex = '-1';
        item.addEventListener(window.clickEvt, this.boundItemClick_);
        item.addEventListener('keydown', this.boundItemKeydown_);
        if (this.element_.classList.contains(MaterialMenu.cssClasses_.RIPPLE_EFFECT)) {
            const rippleContainer = document.createElement('span');
            rippleContainer.classList.add(MaterialMenu.cssClasses_.ITEM_RIPPLE_CONTAINER);
            const ripple = document.createElement('span');
            ripple.classList.add(MaterialMenu.cssClasses_.RIPPLE);
            rippleContainer.appendChild(ripple);
            item.appendChild(rippleContainer);
            item.classList.add(MaterialMenu.cssClasses_.RIPPLE_EFFECT);
        }
    }
    handleForClick_(evt) {
        if (this.element_ && this.forElement_) {
            var rect = this.forElement_.getBoundingClientRect();
            var forRect = this.forElement_.parentElement.getBoundingClientRect();
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.UNALIGNED)) {
            }
            else if (this.element_.classList.contains(MaterialMenu.cssClasses_.BOTTOM_RIGHT)) {
                this.container_.style.right = `${forRect.right - rect.right}px`;
                this.container_.style.top = `${this.forElement_.offsetTop + this.forElement_.offsetHeight}px`;
            }
            else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT)) {
                this.container_.style.left = `${this.forElement_.offsetLeft}px`;
                this.container_.style.bottom = `${forRect.bottom - rect.top}px`;
            }
            else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
                this.container_.style.right = `${forRect.right - rect.right}px`;
                this.container_.style.bottom = `${forRect.bottom - rect.top}px`;
            }
            else {
                this.container_.style.left = `${this.forElement_.offsetLeft}px`;
                this.container_.style.top = `${this.forElement_.offsetTop + this.forElement_.offsetHeight}px`;
            }
        }
        this.toggle(evt);
    }
    handleForKeyboardEvent_(evt) {
        if (this.element_ && this.container_ && this.forElement_) {
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}:not([disabled])`);
            if (items && items.length > 0 && this.container_.classList.contains(MaterialMenu.cssClasses_.IS_VISIBLE)) {
                if (evt.keyCode === MaterialMenu.Keycodes_.UP_ARROW) {
                    evt.preventDefault();
                    items[items.length - 1].focus();
                }
                else if (evt.keyCode === MaterialMenu.Keycodes_.DOWN_ARROW) {
                    evt.preventDefault();
                    items[0].focus();
                }
            }
        }
    }
    handleItemKeyboardEvent_(evt) {
        if (this.element_ && this.container_) {
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}:not([disabled])`);
            if (items && items.length > 0 && this.container_.classList.contains(MaterialMenu.cssClasses_.IS_VISIBLE)) {
                var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);
                if (evt.keyCode === MaterialMenu.Keycodes_.UP_ARROW) {
                    evt.preventDefault();
                    if (currentIndex > 0) {
                        items[currentIndex - 1].focus();
                    }
                    else {
                        items[items.length - 1].focus();
                    }
                }
                else if (evt.keyCode === MaterialMenu.Keycodes_.DOWN_ARROW) {
                    evt.preventDefault();
                    if (items.length > currentIndex + 1) {
                        items[currentIndex + 1].focus();
                    }
                    else {
                        items[0].focus();
                    }
                }
                else if (evt.keyCode === MaterialMenu.Keycodes_.SPACE || evt.keyCode === MaterialMenu.Keycodes_.ENTER) {
                    evt.preventDefault();
                    var e = new MouseEvent(window.clickEvt);
                    evt.target.dispatchEvent(e);
                    e = new MouseEvent(window.clickEvt);
                    evt.target.dispatchEvent(e);
                    evt.target.click();
                }
                else if (evt.keyCode === MaterialMenu.Keycodes_.ESCAPE) {
                    evt.preventDefault();
                    this.hide();
                }
            }
        }
    }
    handleItemClick_(evt) {
        if (evt.target.hasAttribute('disabled')) {
            evt.stopPropagation();
        }
        else {
            this.closing_ = true;
            window.setTimeout(function (evt_) {
                this.hide();
                this.closing_ = false;
            }.bind(this), this.Constant_.CLOSE_TIMEOUT);
            this.onItemSelected(evt.target);
        }
    }
    onItemSelected(option) { return; }
    applyClip_(height, width) {
        if (this.element_.classList.contains(MaterialMenu.cssClasses_.UNALIGNED)) {
            this.element_.style.clip = '';
        }
        else if (this.element_.classList.contains(MaterialMenu.cssClasses_.BOTTOM_RIGHT)) {
            this.element_.style.clip = `rect(0 ${width}px 0 ${width}px)`;
        }
        else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT)) {
            this.element_.style.clip = `rect(${height}px 0 ${height}px 0)`;
        }
        else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
            this.element_.style.clip = `rect(${height}px ${width}px ${height}px ${width}px)`;
        }
        else {
            this.element_.style.clip = '';
        }
    }
    removeAnimationEndListener_(evt) {
        evt.target.classList.remove(MaterialMenu.cssClasses_.IS_ANIMATING);
    }
    addAnimationEndListener_() {
        this.element_.addEventListener('transitionend', this.removeAnimationEndListener_);
        this.element_.addEventListener('webkitTransitionEnd', this.removeAnimationEndListener_);
    }
    show(evt) {
        if (this.element_ && this.container_ && this.outline_) {
            var height = this.element_.getBoundingClientRect().height;
            var width = this.element_.getBoundingClientRect().width;
            this.container_.style.width = `${width}px`;
            this.container_.style.height = `${height}px`;
            this.outline_.style.width = `${width}px`;
            this.outline_.style.height = `${height}px`;
            var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}`);
            for (var i_ = 0; i_ < items.length; i_++) {
                var itemDelay = null;
                if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT) || this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
                    itemDelay = `${(height - items[i_].offsetTop - items[i_].offsetHeight) / height * transitionDuration}s`;
                }
                else {
                    itemDelay = `${items[i_].offsetTop / height * transitionDuration}s`;
                }
                items[i_].style.transitionDelay = itemDelay;
            }
            this.applyClip_(height, width);
            window.requestAnimationFrame(function () {
                this.element_.classList.add(MaterialMenu.cssClasses_.IS_ANIMATING);
                this.element_.style.clip = `rect(0 ${width}px ${height}px 0)`;
                this.container_.classList.add(MaterialMenu.cssClasses_.IS_VISIBLE);
            }.bind(this));
            this.addAnimationEndListener_();
            var callback = function (e) {
                if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
                    document.removeEventListener(window.clickEvt, callback);
                    this.hide();
                }
            }.bind(this);
            document.addEventListener(window.clickEvt, callback);
        }
    }
    hide() {
        if (this.element_ && this.container_ && this.outline_) {
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}`);
            for (var i__ = 0; i__ < items.length; i__++) {
                items[i__].style.removeProperty('transition-delay');
            }
            var rect = this.element_.getBoundingClientRect();
            var height = rect.height;
            var width = rect.width;
            this.element_.classList.add(MaterialMenu.cssClasses_.IS_ANIMATING);
            this.applyClip_(height, width);
            this.container_.classList.remove(MaterialMenu.cssClasses_.IS_VISIBLE);
            this.addAnimationEndListener_();
        }
    }
    toggle(evt) {
        if (this.container_.classList.contains(MaterialMenu.cssClasses_.IS_VISIBLE)) {
            this.hide();
        }
        else {
            this.show(evt);
        }
    }
    Constant_ = {
        TRANSITION_DURATION_SECONDS: 0.3,
        TRANSITION_DURATION_FRACTION: 0.8,
        CLOSE_TIMEOUT: 150
    };
    static Keycodes_ = {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        UP_ARROW: 38,
        DOWN_ARROW: 40
    };
    static cssClasses_ = {
        CONTAINER: 'mdl-menu__container',
        OUTLINE: 'mdl-menu__outline',
        ITEM: 'mdl-menu__item',
        ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE: 'mdl-ripple',
        IS_UPGRADED: 'is-upgraded',
        IS_VISIBLE: 'is-visible',
        IS_ANIMATING: 'is-animating',
        BOTTOM_LEFT: 'mdl-menu--bottom-left',
        BOTTOM_RIGHT: 'mdl-menu--bottom-right',
        TOP_LEFT: 'mdl-menu--top-left',
        TOP_RIGHT: 'mdl-menu--top-right',
        UNALIGNED: 'mdl-menu--unaligned'
    };
}
window['MaterialMenu'] = MaterialMenu;
componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true
});
export class MaterialProgress {
    constructor(element) { basicConstructor(element, this); }
    setProgress(p) {
        if (this.element_.classList.contains(this.cssClasses_.INDETERMINATE_CLASS)) {
            return;
        }
        this.progressbar_.style.width = `${p}%`;
    }
    setBuffer(p) {
        this.bufferbar_.style.width = `${p}%`;
        this.auxbar_.style.width = `${100 - p}%`;
    }
    init() {
        if (this.element_) {
            var el = document.createElement('div');
            el.className = 'progressbar bar bar1';
            this.element_.appendChild(el);
            this.progressbar_ = el;
            el = document.createElement('div');
            el.className = 'bufferbar bar bar2';
            this.element_.appendChild(el);
            this.bufferbar_ = el;
            el = document.createElement('div');
            el.className = 'auxbar bar bar3';
            this.element_.appendChild(el);
            this.auxbar_ = el;
            this.progressbar_.style.width = '0%';
            this.bufferbar_.style.width = '100%';
            this.auxbar_.style.width = '0%';
            this.element_.classList.add('is-upgraded');
        }
    }
    Constant_ = {};
    cssClasses_ = { INDETERMINATE_CLASS: 'mdl-progress__indeterminate' };
}
window['MaterialProgress'] = MaterialProgress;
componentHandler.register({
    constructor: MaterialProgress,
    classAsString: 'MaterialProgress',
    cssClass: 'mdl-js-progress',
    widget: true
});
export class MaterialRadio {
    constructor(element) { basicConstructor(element, this); }
    onChange_(event) {
        var radios = document.getElementsByClassName(this.cssClasses_.JS_RADIO);
        for (var i_ = 0; i_ < radios.length; i_++) {
            var button = radios[i_].querySelector(`.${this.cssClasses_.RADIO_BTN}`);
            if (button.getAttribute('name') === this.btnElement_.getAttribute('name') && typeof radios[i_]['MaterialRadio'] !== 'undefined') {
                radios[i_]['MaterialRadio'].updateClasses_();
            }
        }
    }
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    onMouseup_(event) {
        this.blur_();
    }
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    blur_() {
        window.setTimeout(function () {
            this.btnElement_.blur();
        }.bind(this), this.Constant_.TINY_TIMEOUT);
    }
    checkDisabled() {
        if (this.btnElement_.disabled) {
            this.element_.classList.add(this.cssClasses_.IS_DISABLED);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_DISABLED);
        }
    }
    checkToggleState() {
        if (this.btnElement_.checked) {
            this.element_.classList.add(this.cssClasses_.IS_CHECKED);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_CHECKED);
        }
    }
    disable() {
        this.btnElement_.disabled = true;
        this.updateClasses_();
    }
    enable() {
        this.btnElement_.disabled = false;
        this.updateClasses_();
    }
    check() {
        this.btnElement_.checked = true;
        this.onChange_(null);
    }
    uncheck() {
        this.btnElement_.checked = false;
        this.onChange_(null);
    }
    init() {
        if (this.element_) {
            this.btnElement_ = this.element_.querySelector(`.${this.cssClasses_.RADIO_BTN}`);
            this.boundChangeHandler_ = this.onChange_.bind(this);
            this.boundFocusHandler_ = this.onChange_.bind(this);
            this.boundBlurHandler_ = this.onBlur_.bind(this);
            this.boundMouseUpHandler_ = this.onMouseup_.bind(this);
            var outerCircle = document.createElement('span');
            outerCircle.classList.add(this.cssClasses_.RADIO_OUTER_CIRCLE);
            var innerCircle = document.createElement('span');
            innerCircle.classList.add(this.cssClasses_.RADIO_INNER_CIRCLE);
            this.element_.appendChild(outerCircle);
            this.element_.appendChild(innerCircle);
            var rippleContainer;
            if (this.element_.classList.contains(this.cssClasses_.RIPPLE_EFFECT)) {
                this.element_.classList.add(this.cssClasses_.RIPPLE_IGNORE_EVENTS);
                rippleContainer = document.createElement('span');
                rippleContainer.classList.add(this.cssClasses_.RIPPLE_CONTAINER);
                rippleContainer.classList.add(this.cssClasses_.RIPPLE_EFFECT);
                rippleContainer.classList.add(this.cssClasses_.RIPPLE_CENTER);
                rippleContainer.addEventListener(window.clickEvt, this.boundMouseUpHandler_);
                var ripple = document.createElement('span');
                ripple.classList.add(this.cssClasses_.RIPPLE);
                rippleContainer.appendChild(ripple);
                this.element_.appendChild(rippleContainer);
            }
            this.btnElement_.addEventListener('change', this.boundChangeHandler_);
            this.btnElement_.addEventListener('focus', this.boundFocusHandler_);
            this.btnElement_.addEventListener('blur', this.boundBlurHandler_);
            this.element_.addEventListener(window.clickEvt, this.boundMouseUpHandler_);
            this.updateClasses_();
            this.element_.classList.add(this.cssClasses_.IS_UPGRADED);
        }
    }
    Constant_ = { TINY_TIMEOUT: 0.001 };
    cssClasses_ = {
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded',
        JS_RADIO: 'mdl-js-radio',
        RADIO_BTN: 'mdl-radio__button',
        RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
        RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
        RIPPLE_CENTER: 'mdl-ripple--center',
        RIPPLE: 'mdl-ripple'
    };
}
window['MaterialRadio'] = MaterialRadio;
componentHandler.register({
    constructor: MaterialRadio,
    classAsString: 'MaterialRadio',
    cssClass: 'mdl-js-radio',
    widget: true
});
export class MaterialSlider {
    constructor(element) {
        this.element_ = element;
        this.isIE_ = window.navigator.msPointerEnabled;
        this.init();
    }
    onInput_(event) {
        this.updateValueStyles_();
    }
    onChange_(event) {
        this.updateValueStyles_();
    }
    onMouseUp_(event) {
        event.target.blur();
    }
    onContainerMouseDown_(event) {
        if (event.target !== this.element_.parentElement) {
            return;
        }
        event.preventDefault();
        var newEvent = new MouseEvent(window.clickEvt, {
            target: event.target,
            buttons: event.buttons,
            clientX: event.clientX,
            clientY: this.element_.getBoundingClientRect().y
        });
        this.element_.dispatchEvent(newEvent);
    }
    updateValueStyles_() {
        var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
        if (fraction === 0) {
            this.element_.classList.add(this.cssClasses_.IS_LOWEST_VALUE);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_LOWEST_VALUE);
        }
        if (!this.isIE_) {
            this.backgroundLower_.style.flex = fraction;
            this.backgroundLower_.style.webkitFlex = fraction;
            this.backgroundUpper_.style.flex = 1 - fraction;
            this.backgroundUpper_.style.webkitFlex = 1 - fraction;
        }
    }
    disable() {
        this.element_.disabled = true;
    }
    enable() {
        this.element_.disabled = false;
    }
    change(value) {
        if (typeof value !== 'undefined') {
            this.element_.value = value;
        }
        this.updateValueStyles_();
    }
    init() {
        if (this.element_) {
            if (this.isIE_) {
                var containerIE = document.createElement('div');
                containerIE.classList.add(this.cssClasses_.IE_CONTAINER);
                this.element_.parentElement.insertBefore(containerIE, this.element_);
                this.element_.parentElement.removeChild(this.element_);
                containerIE.appendChild(this.element_);
            }
            else {
                var container = document.createElement('div');
                container.classList.add(this.cssClasses_.SLIDER_CONTAINER);
                this.element_.parentElement.insertBefore(container, this.element_);
                this.element_.parentElement.removeChild(this.element_);
                container.appendChild(this.element_);
                var backgroundFlex = document.createElement('div');
                backgroundFlex.classList.add(this.cssClasses_.BACKGROUND_FLEX);
                container.appendChild(backgroundFlex);
                this.backgroundLower_ = document.createElement('div');
                this.backgroundLower_.classList.add(this.cssClasses_.BACKGROUND_LOWER);
                backgroundFlex.appendChild(this.backgroundLower_);
                this.backgroundUpper_ = document.createElement('div');
                this.backgroundUpper_.classList.add(this.cssClasses_.BACKGROUND_UPPER);
                backgroundFlex.appendChild(this.backgroundUpper_);
            }
            this.boundInputHandler = this.onInput_.bind(this);
            this.boundChangeHandler = this.onChange_.bind(this);
            this.boundMouseUpHandler = this.onMouseUp_.bind(this);
            this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
            this.element_.addEventListener('input', this.boundInputHandler);
            this.element_.addEventListener('change', this.boundChangeHandler);
            this.element_.addEventListener(window.clickEvt, this.boundMouseUpHandler);
            this.element_.parentElement.addEventListener(window.clickEvt, this.boundContainerMouseDownHandler);
            this.updateValueStyles_();
            this.element_.classList.add(this.cssClasses_.IS_UPGRADED);
        }
    }
    Constant_ = {};
    cssClasses_ = {
        IE_CONTAINER: 'mdl-slider__ie-container',
        SLIDER_CONTAINER: 'mdl-slider__container',
        BACKGROUND_FLEX: 'mdl-slider__background-flex',
        BACKGROUND_LOWER: 'mdl-slider__background-lower',
        BACKGROUND_UPPER: 'mdl-slider__background-upper',
        IS_LOWEST_VALUE: 'is-lowest-value',
        IS_UPGRADED: 'is-upgraded'
    };
}
window['MaterialSlider'] = MaterialSlider;
componentHandler.register({
    constructor: MaterialSlider,
    classAsString: 'MaterialSlider',
    cssClass: 'mdl-js-slider',
    widget: true
});
export class MaterialSnackbar {
    constructor(element) {
        this.element_ = element;
        this.textElement_ = this.element_.querySelector(`.${this.cssClasses_.MESSAGE}`);
        this.actionElement_ = this.element_.querySelector(`.${this.cssClasses_.ACTION}`);
        if (!this.textElement_) {
            throw new Error('There must be a message element for a snackbar.');
        }
        if (!this.actionElement_) {
            throw new Error('There must be an action element for a snackbar.');
        }
        this.active = false;
        this.actionHandler_ = undefined;
        this.message_ = undefined;
        this.actionText_ = undefined;
        this.queuedNotifications_ = [];
        this.setActionHidden_(true);
    }
    displaySnackbar_() {
        this.element_.setAttribute('aria-hidden', 'true');
        if (this.actionHandler_) {
            this.actionElement_.textContent = this.actionText_;
            this.actionElement_.addEventListener(window.clickEvt, this.actionHandler_);
            this.setActionHidden_(false);
        }
        this.textElement_.textContent = this.message_;
        this.element_.classList.add(this.cssClasses_.ACTIVE);
        this.element_.setAttribute('aria-hidden', 'false');
        setTimeout(this.cleanup_.bind(this), this.timeout_);
    }
    showSnackbar(data) {
        if (data === undefined) {
            throw new Error('Please provide a data object with at least a message to display.');
        }
        if (data['message'] === undefined) {
            throw new Error('Please provide a message to be displayed.');
        }
        if (data['actionHandler'] && !data['actionText']) {
            throw new Error('Please provide action text with the handler.');
        }
        if (this.active) {
            this.queuedNotifications_.push(data);
        }
        else {
            this.active = true;
            this.message_ = data['message'];
            if (data['timeout']) {
                this.timeout_ = data['timeout'];
            }
            else {
                this.timeout_ = 2750;
            }
            if (data['actionHandler']) {
                this.actionHandler_ = data['actionHandler'];
            }
            if (data['actionText']) {
                this.actionText_ = data['actionText'];
            }
            this.displaySnackbar_();
        }
    }
    checkQueue_() {
        if (this.queuedNotifications_.length > 0) {
            this.showSnackbar(this.queuedNotifications_.shift());
        }
    }
    cleanup_() {
        this.element_.classList.remove(this.cssClasses_.ACTIVE);
        setTimeout(function () {
            this.element_.setAttribute('aria-hidden', 'true');
            this.textElement_.textContent = '';
            if (!this.actionElement_.getAttribute('aria-hidden')) {
                this.setActionHidden_(true);
                this.actionElement_.textContent = '';
                this.actionElement_.removeEventListener(window.clickEvt, this.actionHandler_);
            }
            this.actionHandler_ = undefined;
            this.message_ = undefined;
            this.actionText_ = undefined;
            this.active = false;
            this.checkQueue_();
        }.bind(this), this.Constant_.ANIMATION_LENGTH);
    }
    setActionHidden_(value) {
        if (value) {
            this.actionElement_.setAttribute('aria-hidden', 'true');
        }
        else {
            this.actionElement_.removeAttribute('aria-hidden');
        }
    }
    Constant_ = {
        ANIMATION_LENGTH: 250
    };
    cssClasses_ = {
        SNACKBAR: 'mdl-snackbar',
        MESSAGE: 'mdl-snackbar__text',
        ACTION: 'mdl-snackbar__action',
        ACTIVE: 'mdl-snackbar--active'
    };
}
window['MaterialSnackbar'] = MaterialSnackbar;
componentHandler.register({
    constructor: MaterialSnackbar,
    classAsString: 'MaterialSnackbar',
    cssClass: 'mdl-js-snackbar',
    widget: true
});
export class MaterialSpinner {
    constructor(element) { basicConstructor(element, this); }
    createLayer(index) {
        var layer = document.createElement('div');
        layer.classList.add(this.cssClasses_.MDL_SPINNER_LAYER);
        layer.classList.add(`${this.cssClasses_.MDL_SPINNER_LAYER}-${index}`);
        var leftClipper = document.createElement('div');
        leftClipper.classList.add(this.cssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
        leftClipper.classList.add(this.cssClasses_.MDL_SPINNER_LEFT);
        var gapPatch = document.createElement('div');
        gapPatch.classList.add(this.cssClasses_.MDL_SPINNER_GAP_PATCH);
        var rightClipper = document.createElement('div');
        rightClipper.classList.add(this.cssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
        rightClipper.classList.add(this.cssClasses_.MDL_SPINNER_RIGHT);
        var circleOwners = [
            leftClipper,
            gapPatch,
            rightClipper
        ];
        for (var i_ = 0; i_ < circleOwners.length; i_++) {
            var circle = document.createElement('div');
            circle.classList.add(this.cssClasses_.MDL_SPINNER_CIRCLE);
            circleOwners[i_].appendChild(circle);
        }
        layer.appendChild(leftClipper);
        layer.appendChild(gapPatch);
        layer.appendChild(rightClipper);
        this.element_.appendChild(layer);
    }
    stop() {
        this.element_.classList.remove('is-active');
    }
    start() {
        this.element_.classList.add('is-active');
    }
    init() {
        if (this.element_) {
            for (var i_ = 1; i_ <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i_++) {
                this.createLayer(i_);
            }
            this.element_.classList.add('is-upgraded');
        }
    }
    Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 };
    cssClasses_ = {
        MDL_SPINNER_LAYER: 'mdl-spinner__layer',
        MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
        MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
        MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
        MDL_SPINNER_LEFT: 'mdl-spinner__left',
        MDL_SPINNER_RIGHT: 'mdl-spinner__right'
    };
}
window['MaterialSpinner'] = MaterialSpinner;
componentHandler.register({
    constructor: MaterialSpinner,
    classAsString: 'MaterialSpinner',
    cssClass: 'mdl-js-spinner',
    widget: true
});
export class MaterialSwitch {
    constructor(element) { basicConstructor(element, this); }
    onChange_(event) {
        this.updateClasses_();
    }
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    onMouseUp_(event) {
        this.blur_();
    }
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    disable() {
        this.inputElement_.disabled = true;
        this.updateClasses_();
    }
    enable() {
        this.inputElement_.disabled = false;
        this.updateClasses_();
    }
    on() {
        this.inputElement_.checked = true;
        this.updateClasses_();
    }
    off() {
        this.inputElement_.checked = false;
        this.updateClasses_();
    }
    init() {
        if (this.element_) {
            this.inputElement_ = this.element_.querySelector(`.${this.cssClasses_.INPUT}`);
            var track = document.createElement('div');
            track.classList.add(this.cssClasses_.TRACK);
            var thumb = document.createElement('div');
            thumb.classList.add(this.cssClasses_.THUMB);
            var focusHelper = document.createElement('span');
            focusHelper.classList.add(this.cssClasses_.FOCUS_HELPER);
            thumb.appendChild(focusHelper);
            this.element_.appendChild(track);
            this.element_.appendChild(thumb);
            this.boundMouseUpHandler = this.onMouseUp_.bind(this);
            if (this.element_.classList.contains(this.cssClasses_.RIPPLE_EFFECT)) {
                this.element_.classList.add(this.cssClasses_.RIPPLE_IGNORE_EVENTS);
                this.rippleContainerElement_ = document.createElement('span');
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_CONTAINER);
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_EFFECT);
                this.rippleContainerElement_.classList.add(this.cssClasses_.RIPPLE_CENTER);
                this.rippleContainerElement_.addEventListener(window.clickEvt, this.boundMouseUpHandler);
                var ripple = document.createElement('span');
                ripple.classList.add(this.cssClasses_.RIPPLE);
                this.rippleContainerElement_.appendChild(ripple);
                this.element_.appendChild(this.rippleContainerElement_);
            }
            this.boundChangeHandler = this.onChange_.bind(this);
            this.boundFocusHandler = this.onFocus_.bind(this);
            this.boundBlurHandler = this.onBlur_.bind(this);
            this.inputElement_.addEventListener('change', this.boundChangeHandler);
            this.inputElement_.addEventListener('focus', this.boundFocusHandler);
            this.inputElement_.addEventListener('blur', this.boundBlurHandler);
            this.element_.addEventListener(window.clickEvt, this.boundMouseUpHandler);
            this.updateClasses_();
            this.element_.classList.add('is-upgraded');
        }
    }
    Constant_ = { TINY_TIMEOUT: 0.001 };
    cssClasses_ = {
        INPUT: 'mdl-switch__input',
        TRACK: 'mdl-switch__track',
        THUMB: 'mdl-switch__thumb',
        FOCUS_HELPER: 'mdl-switch__focus-helper',
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
        RIPPLE_CENTER: 'mdl-ripple--center',
        RIPPLE: 'mdl-ripple',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked'
    };
    blur_ = MaterialCheckbox.prototype.blur_;
    checkDisabled = MaterialCheckbox.prototype.checkDisabled;
    checkToggleState = MaterialCheckbox.prototype.checkToggleState;
}
window['MaterialSwitch'] = MaterialSwitch;
componentHandler.register({
    constructor: MaterialSwitch,
    classAsString: 'MaterialSwitch',
    cssClass: 'mdl-js-switch',
    widget: true
});
export class MaterialTabs {
    constructor(element) {
        this.element_ = element;
        this.init();
    }
    initTabs_() {
        if (this.element_.classList.contains(this.cssClasses_.MDL_JS_RIPPLE_EFFECT)) {
            this.element_.classList.add(this.cssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
        }
        this.tabs_ = this.element_.querySelectorAll(`.${this.cssClasses_.TAB_CLASS}`);
        this.panels_ = this.element_.querySelectorAll(`.${this.cssClasses_.PANEL_CLASS}`);
        for (var i_ = 0; i_ < this.tabs_.length; i_++) {
            new MaterialTab(this.tabs_[i_], this);
        }
        this.element_.classList.add(this.cssClasses_.UPGRADED_CLASS);
    }
    resetTabState_() {
        for (var k = 0; k < this.tabs_.length; k++) {
            this.tabs_[k].classList.remove(this.cssClasses_.ACTIVE_CLASS);
        }
    }
    resetPanelState_() {
        for (var j = 0; j < this.panels_.length; j++) {
            this.panels_[j].classList.remove(this.cssClasses_.ACTIVE_CLASS);
        }
    }
    init() {
        if (this.element_) {
            this.initTabs_();
        }
    }
    Constant_ = {};
    cssClasses_ = {
        TAB_CLASS: 'mdl-tabs__tab',
        PANEL_CLASS: 'mdl-tabs__panel',
        ACTIVE_CLASS: 'is-active',
        UPGRADED_CLASS: 'is-upgraded',
        MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
        MDL_RIPPLE: 'mdl-ripple',
        MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
    };
}
window['MaterialTabs'] = MaterialTabs;
export class MaterialTab {
    constructor(tab, ctx) {
        if (!tab)
            return;
        tab.addEventListener(window.clickEvt, function (e) {
            if (tab.getAttribute('href').charAt(0) === '#') {
                e.preventDefault();
                var href = tab.href.split('#')[1];
                var panel = ctx.element_.querySelector(`#${href}`);
                ctx.resetTabState_();
                ctx.resetPanelState_();
                tab.classList.add(ctx.cssClasses_.ACTIVE_CLASS);
                panel.classList.add(ctx.cssClasses_.ACTIVE_CLASS);
            }
        });
        if (!ctx.element_.classList.contains(ctx.cssClasses_.MDL_JS_RIPPLE_EFFECT))
            return;
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(ctx.cssClasses_.MDL_RIPPLE_CONTAINER);
        rippleContainer.classList.add(ctx.cssClasses_.MDL_JS_RIPPLE_EFFECT);
        var ripple = document.createElement('span');
        ripple.classList.add(ctx.cssClasses_.MDL_RIPPLE);
        rippleContainer.appendChild(ripple);
        tab.appendChild(rippleContainer);
    }
}
componentHandler.register({
    constructor: MaterialTabs,
    classAsString: 'MaterialTabs',
    cssClass: 'mdl-js-tabs'
});
export class MaterialTextfield {
    constructor(element) {
        this.element_ = element;
        this.maxRows = this.Constant_.NO_MAX_ROWS;
        this.init();
    }
    onKeyDown_(event) {
        var currentRowCount = event.target.value.split('\n').length;
        if (event.keyCode === 13 && currentRowCount >= this.maxRows) {
            event.preventDefault();
        }
    }
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    onReset_(event) {
        this.updateClasses_();
    }
    updateClasses_() {
        this.checkDisabled();
        this.checkValidity();
        this.checkDirty();
        this.checkFocus();
    }
    checkDisabled() {
        if (this.input_.disabled) {
            this.element_.classList.add(this.cssClasses_.IS_DISABLED);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_DISABLED);
        }
    }
    checkFocus() {
        if (this.element_.querySelector(':focus')) {
            this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
        }
    }
    checkValidity() {
        if (this.input_.validity) {
            if (this.input_.validity.valid) {
                this.element_.classList.remove(this.cssClasses_.IS_INVALID);
            }
            else {
                this.element_.classList.add(this.cssClasses_.IS_INVALID);
            }
        }
    }
    checkDirty() {
        if (this.input_.value && this.input_.value.length > 0) {
            this.element_.classList.add(this.cssClasses_.IS_DIRTY);
        }
        else {
            this.element_.classList.remove(this.cssClasses_.IS_DIRTY);
        }
    }
    disable() {
        this.input_.disabled = true;
        this.updateClasses_();
    }
    enable() {
        this.input_.disabled = false;
        this.updateClasses_();
    }
    change(value) {
        this.input_.value = value || '';
        this.updateClasses_();
    }
    init() {
        if (this.element_) {
            this.label_ = this.element_.querySelector(`.${this.cssClasses_.LABEL}`);
            this.input_ = this.element_.querySelector(`.${this.cssClasses_.INPUT}`);
            if (this.input_) {
                if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
                    this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
                    if (isNaN(this.maxRows)) {
                        this.maxRows = this.Constant_.NO_MAX_ROWS;
                    }
                }
                if (this.input_.hasAttribute('placeholder')) {
                    this.element_.classList.add(this.cssClasses_.HAS_PLACEHOLDER);
                }
                this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
                this.boundFocusHandler = this.onFocus_.bind(this);
                this.boundBlurHandler = this.onBlur_.bind(this);
                this.boundResetHandler = this.onReset_.bind(this);
                this.input_.addEventListener('input', this.boundUpdateClassesHandler);
                this.input_.addEventListener('focus', this.boundFocusHandler);
                this.input_.addEventListener('blur', this.boundBlurHandler);
                this.input_.addEventListener('reset', this.boundResetHandler);
                if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
                    this.boundKeyDownHandler = this.onKeyDown_.bind(this);
                    this.input_.addEventListener('keydown', this.boundKeyDownHandler);
                }
                var invalid = this.element_.classList.contains(this.cssClasses_.IS_INVALID);
                this.updateClasses_();
                this.element_.classList.add(this.cssClasses_.IS_UPGRADED);
                if (invalid) {
                    this.element_.classList.add(this.cssClasses_.IS_INVALID);
                }
                if (this.input_.hasAttribute('autofocus')) {
                    this.element_.focus();
                    this.checkFocus();
                }
            }
        }
    }
    Constant_ = {
        NO_MAX_ROWS: -1,
        MAX_ROWS_ATTRIBUTE: 'maxrows'
    };
    cssClasses_ = {
        LABEL: 'mdl-textfield__label',
        INPUT: 'mdl-textfield__input',
        IS_DIRTY: 'is-dirty',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_INVALID: 'is-invalid',
        IS_UPGRADED: 'is-upgraded',
        HAS_PLACEHOLDER: 'has-placeholder'
    };
}
window['MaterialTextfield'] = MaterialTextfield;
componentHandler.register({
    constructor: MaterialTextfield,
    classAsString: 'MaterialTextfield',
    cssClass: 'mdl-js-textfield',
    widget: true
});
export class MaterialTooltip {
    constructor(element) { basicConstructor(element, this); }
    handleMouseEnter_(event) {
        var props = event.target.getBoundingClientRect();
        var top = props.top + props.height / 2;
        var left = (props.left + props.width / 2) - 256;
        var marginLeft = -1 * (this.element_.offsetWidth / 2);
        if (left + marginLeft < 16)
            marginLeft += Math.abs(16 - (left + marginLeft));
        var marginTop = -1 * (this.element_.offsetHeight / 2);
        if (this.element_.classList.contains(this.cssClasses_.LEFT) || this.element_.classList.contains(this.cssClasses_.RIGHT)) {
            left = props.width / 2;
            if (top + marginTop < 0) {
                this.element_.style.top = '0';
                this.element_.style.marginTop = '0';
            }
            else {
                this.element_.style.top = `${top}px`;
                this.element_.style.marginTop = `${marginTop}px`;
            }
        }
        else {
            if (left + marginLeft < 0) {
                this.element_.style.left = '0';
                this.element_.style.marginLeft = '0';
            }
            else {
                this.element_.style.left = `${left}px`;
                this.element_.style.marginLeft = `${marginLeft}px`;
            }
        }
        if (this.element_.classList.contains(this.cssClasses_.TOP)) {
            this.element_.style.top = `${props.top - this.element_.offsetHeight - 10}px`;
        }
        else if (this.element_.classList.contains(this.cssClasses_.RIGHT)) {
            this.element_.style.left = `${props.left + props.width + 10}px`;
        }
        else if (this.element_.classList.contains(this.cssClasses_.LEFT)) {
            this.element_.style.left = `${props.left - this.element_.offsetWidth - 10}px`;
        }
        else {
            this.element_.style.top = `${props.top + props.height + 10}px`;
        }
        this.element_.classList.add(this.cssClasses_.IS_ACTIVE);
    }
    hideTooltip_() {
        this.element_.classList.remove(this.cssClasses_.IS_ACTIVE);
    }
    init() {
        if (this.element_) {
            var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');
            if (forElId) {
                this.forElement_ = document.getElementById(forElId);
            }
            if (this.forElement_) {
                if (!this.forElement_.hasAttribute('tabindex')) {
                    this.forElement_.setAttribute('tabindex', '0');
                }
                this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
                this.boundMouseLeaveAndScrollHandler = this.hideTooltip_.bind(this);
                this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
                this.forElement_.addEventListener('touchend', this.boundMouseEnterHandler, false);
                this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveAndScrollHandler, false);
                window.addEventListener('scroll', this.boundMouseLeaveAndScrollHandler, true);
                window.addEventListener('touchstart', this.boundMouseLeaveAndScrollHandler, { passive: true });
            }
        }
    }
    Constant_ = {};
    cssClasses_ = {
        IS_ACTIVE: 'is-active',
        BOTTOM: 'mdl-tooltip--bottom',
        LEFT: 'mdl-tooltip--left',
        RIGHT: 'mdl-tooltip--right',
        TOP: 'mdl-tooltip--top'
    };
}
window['MaterialTooltip'] = MaterialTooltip;
componentHandler.register({
    constructor: MaterialTooltip,
    classAsString: 'MaterialTooltip',
    cssClass: 'mdl-tooltip'
});
export class MaterialLayout {
    constructor(element) { basicConstructor(element, this); }
    contentScrollHandler_() {
        if (this.header_.classList.contains(MaterialLayout.cssClasses.IS_ANIMATING)) {
            return;
        }
        var headerVisible = !this.element_.classList.contains(MaterialLayout.cssClasses.IS_SMALL_SCREEN) || this.element_.classList.contains(MaterialLayout.cssClasses.FIXED_HEADER);
        if (this.content_.scrollTop > 0 && !this.header_.classList.contains(MaterialLayout.cssClasses.IS_COMPACT)) {
            this.header_.classList.add(MaterialLayout.cssClasses.CASTING_SHADOW);
            this.header_.classList.add(MaterialLayout.cssClasses.IS_COMPACT);
            if (headerVisible) {
                this.header_.classList.add(MaterialLayout.cssClasses.IS_ANIMATING);
            }
        }
        else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(MaterialLayout.cssClasses.IS_COMPACT)) {
            this.header_.classList.remove(MaterialLayout.cssClasses.CASTING_SHADOW);
            this.header_.classList.remove(MaterialLayout.cssClasses.IS_COMPACT);
            if (headerVisible) {
                this.header_.classList.add(MaterialLayout.cssClasses.IS_ANIMATING);
            }
        }
    }
    keyboardEventHandler_(evt) {
        if (evt.keyCode === this.Keycodes_.ESCAPE && this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN)) {
            this.toggleDrawer();
        }
    }
    screenSizeHandler_() {
        if (this.screenSizeMediaQuery_.matches) {
            this.element_.classList.add(MaterialLayout.cssClasses.IS_SMALL_SCREEN);
        }
        else {
            this.element_.classList.remove(MaterialLayout.cssClasses.IS_SMALL_SCREEN);
            if (this.drawer_) {
                this.drawer_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
                this.obfuscator_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
            }
        }
    }
    drawerToggleHandler_(evt) {
        if (evt && evt.type === 'keydown') {
            if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
                evt.preventDefault();
            }
            else {
                return;
            }
        }
        this.toggleDrawer();
    }
    headerTransitionEndHandler_() {
        this.header_.classList.remove(MaterialLayout.cssClasses.IS_ANIMATING);
    }
    headerClickHandler_() {
        if (this.header_.classList.contains(MaterialLayout.cssClasses.IS_COMPACT)) {
            this.header_.classList.remove(MaterialLayout.cssClasses.IS_COMPACT);
            this.header_.classList.add(MaterialLayout.cssClasses.IS_ANIMATING);
        }
    }
    resetTabState_(tabBar) {
        for (var k = 0; k < tabBar.length; k++) {
            tabBar[k].classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
        }
    }
    resetPanelState_(panels) {
        for (var j = 0; j < panels.length; j++) {
            panels[j].classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
        }
    }
    toggleDrawer() {
        this.drawer_.classList.toggle(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        this.obfuscator_.classList.toggle(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        if (this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN))
            this.openDrawer(false);
        else
            this.closeDrawer(false);
    }
    openDrawer(doNewClass = true) {
        if (doNewClass) {
            if (this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN))
                return;
            this.drawer_.classList.add(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
            this.obfuscator_.classList.add(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        }
        const drawerEvent = new CustomEvent('drawerOpen', { bubbles: true });
        this.drawer_.dispatchEvent(drawerEvent);
        var drawerButton = this.element_.querySelector(`.${MaterialLayout.cssClasses.DRAWER_BTN}`);
        drawerButton.setAttribute('aria-expanded', 'true');
        const elemToFocusNextSibling = this.drawer_.querySelector('.mdl-navigation__link');
        if (elemToFocusNextSibling && elemToFocusNextSibling.previousSibling && elemToFocusNextSibling.previousElementSibling.focus) {
            elemToFocusNextSibling.previousElementSibling.setAttribute('tabindex', '0');
            elemToFocusNextSibling.previousElementSibling.focus({ preventScroll: true });
            requestAnimationFrame(() => { requestAnimationFrame(() => { elemToFocusNextSibling.previousElementSibling.removeAttribute('tabindex'); }); });
        }
        else
            console.error("Ruh roh! No focusable elements in the drawer!", elemToFocusNextSibling, elemToFocusNextSibling.previousElementSibling);
    }
    closeDrawer(doNewClass = true) {
        if (doNewClass) {
            if (!this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN))
                return;
            this.drawer_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
            this.obfuscator_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        }
        const drawerEvent = new CustomEvent('drawerClose', { bubbles: true });
        this.drawer_.dispatchEvent(drawerEvent);
        var drawerButton = this.element_.querySelector(`.${MaterialLayout.cssClasses.DRAWER_BTN}`);
        drawerButton.setAttribute('aria-expanded', 'false');
        drawerButton.focus({ preventScroll: true });
        document.documentElement.classList.remove('drawer-init-open');
        window.startWithDrawer = false;
    }
    init() {
        if (!this.element_)
            return;
        window.layout = this;
        var container = document.createElement('div');
        container.classList.add(MaterialLayout.cssClasses.CONTAINER);
        var focusedElement = this.element_.querySelector(':focus');
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        if (focusedElement) {
            focusedElement.focus();
        }
        var directChildren = this.element_.childNodes;
        var numChildren = directChildren.length;
        for (var c = 0; c < numChildren; c++) {
            var child = directChildren[c];
            if (child.classList && child.classList.contains(MaterialLayout.cssClasses.HEADER)) {
                this.header_ = child;
            }
            if (child.classList && child.classList.contains(MaterialLayout.cssClasses.DRAWER)) {
                this.drawer_ = child;
            }
            if (child.classList && child.classList.contains(MaterialLayout.cssClasses.CONTENT)) {
                this.content_ = child;
            }
        }
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                this.element_.style.overflowY = 'hidden';
                requestAnimationFrame(function () {
                    this.element_.style.overflowY = '';
                }.bind(this));
            }
        }.bind(this), false);
        if (this.header_) {
            this.tabBar_ = this.header_.querySelector(`.${MaterialLayout.cssClasses.TAB_BAR}`);
        }
        var mode = this.Mode_.STANDARD;
        if (this.header_) {
            if (this.header_.classList.contains(MaterialLayout.cssClasses.HEADER_SEAMED)) {
                mode = this.Mode_.SEAMED;
            }
            else if (this.header_.classList.contains(MaterialLayout.cssClasses.HEADER_WATERFALL)) {
                mode = this.Mode_.WATERFALL;
                this.header_.addEventListener('transitionend', this.headerTransitionEndHandler_.bind(this));
                this.header_.addEventListener(window.clickEvt, this.headerClickHandler_.bind(this));
            }
            else if (this.header_.classList.contains(MaterialLayout.cssClasses.HEADER_SCROLL)) {
                mode = this.Mode_.SCROLL;
                container.classList.add(MaterialLayout.cssClasses.HAS_SCROLLING_HEADER);
            }
            if (mode === this.Mode_.STANDARD) {
                this.header_.classList.add(MaterialLayout.cssClasses.CASTING_SHADOW);
                if (this.tabBar_) {
                    this.tabBar_.classList.add(MaterialLayout.cssClasses.CASTING_SHADOW);
                }
            }
            else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
                this.header_.classList.remove(MaterialLayout.cssClasses.CASTING_SHADOW);
                if (this.tabBar_) {
                    this.tabBar_.classList.remove(MaterialLayout.cssClasses.CASTING_SHADOW);
                }
            }
            else if (mode === this.Mode_.WATERFALL) {
                this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
                this.contentScrollHandler_();
            }
        }
        if (this.drawer_) {
            var drawerButton = this.element_.querySelector(`.${MaterialLayout.cssClasses.DRAWER_BTN}`);
            if (!drawerButton) {
                drawerButton = document.createElement('div');
                drawerButton.setAttribute('aria-expanded', 'false');
                drawerButton.setAttribute('role', 'button');
                drawerButton.setAttribute('tabindex', '0');
                drawerButton.classList.add(MaterialLayout.cssClasses.DRAWER_BTN);
                var drawerButtonIcon = document.createElement('i');
                drawerButtonIcon.classList.add(MaterialLayout.cssClasses.ICON);
                drawerButtonIcon.innerHTML = this.Constant_.MENU_ICON;
                drawerButton.appendChild(drawerButtonIcon);
            }
            const titleElement = this.element_.querySelector('.mdl-layout-title');
            if (titleElement) {
                titleElement.setAttribute('role', 'button');
                titleElement.setAttribute('tabindex', '-1');
                titleElement.addEventListener(window.clickEvt, this.drawerToggleHandler_.bind(this));
                titleElement.addEventListener('keydown', this.drawerToggleHandler_.bind(this));
            }
            if (this.drawer_.classList.contains(MaterialLayout.cssClasses.ON_LARGE_SCREEN)) {
                drawerButton.classList.add(MaterialLayout.cssClasses.ON_LARGE_SCREEN);
            }
            else if (this.drawer_.classList.contains(MaterialLayout.cssClasses.ON_SMALL_SCREEN)) {
                drawerButton.classList.add(MaterialLayout.cssClasses.ON_SMALL_SCREEN);
            }
            this.element_.classList.add(MaterialLayout.cssClasses.HAS_DRAWER);
            if (this.element_.classList.contains(MaterialLayout.cssClasses.FIXED_HEADER)) {
                this.header_.insertBefore(drawerButton, this.header_.firstChild);
            }
            else {
                this.element_.insertBefore(drawerButton, this.content_);
            }
            this.obfuscator_ = document.querySelector('.mdl-layout__obfuscator') ?? document.createElement('div');
            this.obfuscator_.classList.add('mdl-layout__obfuscator');
            this.element_.appendChild(this.obfuscator_);
            if (!this.obfuscator_)
                throw new Error('MDL: No obfuscator found!');
            drawerButton.addEventListener(window.clickEvt, this.drawerToggleHandler_.bind(this));
            drawerButton.addEventListener('keydown', this.drawerToggleHandler_.bind(this));
            this.obfuscator_.addEventListener(window.clickEvt, this.drawerToggleHandler_.bind(this));
            document.addEventListener('keydown', this.keyboardEventHandler_.bind(this));
            if (window.startWithDrawer) {
                this.openDrawer(true);
            }
            else
                this.closeDrawer(false);
            setTimeout(() => {
                if (window.startWithDrawer)
                    this.closeDrawer(true);
                if (window.startWithDrawer)
                    this.closeDrawer(false);
            }, 100);
        }
        this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
        this.screenSizeHandler_();
        if (this.header_ && this.tabBar_) {
            this.element_.classList.add(MaterialLayout.cssClasses.HAS_TABS);
            var tabContainer = document.createElement('div');
            tabContainer.classList.add(MaterialLayout.cssClasses.TAB_CONTAINER);
            this.header_.insertBefore(tabContainer, this.tabBar_);
            this.header_.removeChild(this.tabBar_);
            var leftButton = document.createElement('div');
            leftButton.classList.add(MaterialLayout.cssClasses.TAB_BAR_BUTTON);
            leftButton.classList.add(MaterialLayout.cssClasses.TAB_BAR_LEFT_BUTTON);
            var leftButtonIcon = document.createElement('i');
            leftButtonIcon.classList.add(MaterialLayout.cssClasses.ICON);
            leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
            leftButton.appendChild(leftButtonIcon);
            leftButton.addEventListener(window.clickEvt, function () {
                this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
            }.bind(this));
            var rightButton = document.createElement('div');
            rightButton.classList.add(MaterialLayout.cssClasses.TAB_BAR_BUTTON);
            rightButton.classList.add(MaterialLayout.cssClasses.TAB_BAR_RIGHT_BUTTON);
            var rightButtonIcon = document.createElement('i');
            rightButtonIcon.classList.add(MaterialLayout.cssClasses.ICON);
            rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
            rightButton.appendChild(rightButtonIcon);
            rightButton.addEventListener(window.clickEvt, function () {
                this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
            }.bind(this));
            tabContainer.appendChild(leftButton);
            tabContainer.appendChild(this.tabBar_);
            tabContainer.appendChild(rightButton);
            var tabUpdateHandler = function () {
                if (this.tabBar_.scrollLeft > 0) {
                    leftButton.classList.add(MaterialLayout.cssClasses.IS_ACTIVE);
                }
                else {
                    leftButton.classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
                }
                if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
                    rightButton.classList.add(MaterialLayout.cssClasses.IS_ACTIVE);
                }
                else {
                    rightButton.classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
                }
            }.bind(this);
            this.tabBar_.addEventListener('scroll', tabUpdateHandler);
            tabUpdateHandler();
            var windowResizeHandler = function () {
                if (this.resizeTimeoutId_) {
                    clearTimeout(this.resizeTimeoutId_);
                }
                this.resizeTimeoutId_ = setTimeout(function () {
                    tabUpdateHandler();
                    this.resizeTimeoutId_ = null;
                }.bind(this), this.Constant_.RESIZE_TIMEOUT);
            }.bind(this);
            window.addEventListener('resize', windowResizeHandler);
            if (this.tabBar_.classList.contains(MaterialLayout.cssClasses.JS_RIPPLE_EFFECT)) {
                this.tabBar_.classList.add(MaterialLayout.cssClasses.RIPPLE_IGNORE_EVENTS);
            }
            var tabs = this.tabBar_.querySelectorAll(`.${MaterialLayout.cssClasses.TAB}`);
            var panels = this.content_.querySelectorAll(`.${MaterialLayout.cssClasses.PANEL}`);
            for (var i_ = 0; i_ < tabs.length; i_++) {
                new MaterialLayoutTab(tabs[i_], tabs, panels, this);
            }
        }
        this.element_.classList.add(MaterialLayout.cssClasses.IS_UPGRADED);
    }
    Constant_ = {
        MAX_WIDTH: '(max-width: 1024px)',
        TAB_SCROLL_PIXELS: 100,
        RESIZE_TIMEOUT: 100,
        MENU_ICON: '&#xE5D2;',
        CHEVRON_LEFT: 'chevron_left',
        CHEVRON_RIGHT: 'chevron_right'
    };
    Keycodes_ = {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32
    };
    Mode_ = {
        STANDARD: 0,
        SEAMED: 1,
        WATERFALL: 2,
        SCROLL: 3
    };
    static cssClasses = {
        CONTAINER: 'mdl-layout__container',
        HEADER: 'mdl-layout__header',
        DRAWER: 'mdl-layout__drawer',
        CONTENT: 'mdl-layout__content',
        DRAWER_BTN: 'mdl-layout__drawer-button',
        ICON: 'material-icons',
        JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
        RIPPLE: 'mdl-ripple',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        HEADER_SEAMED: 'mdl-layout__header--seamed',
        HEADER_WATERFALL: 'mdl-layout__header--waterfall',
        HEADER_SCROLL: 'mdl-layout__header--scroll',
        FIXED_HEADER: 'mdl-layout--fixed-header',
        OBFUSCATOR: 'mdl-layout__obfuscator',
        TAB_BAR: 'mdl-layout__tab-bar',
        TAB_CONTAINER: 'mdl-layout__tab-bar-container',
        TAB: 'mdl-layout__tab',
        TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
        TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
        TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
        TAB_MANUAL_SWITCH: 'mdl-layout__tab-manual-switch',
        PANEL: 'mdl-layout__tab-panel',
        HAS_DRAWER: 'has-drawer',
        HAS_TABS: 'has-tabs',
        HAS_SCROLLING_HEADER: 'has-scrolling-header',
        CASTING_SHADOW: 'is-casting-shadow',
        IS_COMPACT: 'is-compact',
        IS_SMALL_SCREEN: 'is-small-screen',
        IS_DRAWER_OPEN: 'is-visible',
        IS_ACTIVE: 'is-active',
        IS_UPGRADED: 'is-upgraded',
        IS_ANIMATING: 'is-animating',
        ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
        ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'
    };
}
window['MaterialLayout'] = MaterialLayout;
export class MaterialLayoutTab {
    constructor(tab, tabs, panels, layout) {
        function selectTab() {
            var href = tab.href.split('#')[1];
            var panel = layout.content_.querySelector(`#${href}`);
            layout.resetTabState_(tabs);
            layout.resetPanelState_(panels);
            tab.classList.add(layout.cssClasses_.IS_ACTIVE);
            panel.classList.add(layout.cssClasses_.IS_ACTIVE);
        }
        if (layout.tabBar_.classList.contains(layout.cssClasses_.JS_RIPPLE_EFFECT)) {
            var rippleContainer = document.createElement('span');
            rippleContainer.classList.add(layout.cssClasses_.RIPPLE_CONTAINER);
            rippleContainer.classList.add(layout.cssClasses_.JS_RIPPLE_EFFECT);
            var ripple = document.createElement('span');
            ripple.classList.add(layout.cssClasses_.RIPPLE);
            rippleContainer.appendChild(ripple);
            tab.appendChild(rippleContainer);
        }
        if (!layout.tabBar_.classList.contains(layout.cssClasses_.TAB_MANUAL_SWITCH)) {
            tab.addEventListener(window.clickEvt, function (e) {
                if (tab.getAttribute('href').charAt(0) === '#') {
                    e.preventDefault();
                    selectTab();
                }
            });
        }
        tab.show
            = selectTab;
    }
}
window['MaterialLayoutTab'] = MaterialLayoutTab;
componentHandler.register({
    constructor: MaterialLayout,
    classAsString: 'MaterialLayout',
    cssClass: 'mdl-js-layout'
});
export class MaterialDataTable {
    constructor(element) { basicConstructor(element, this); }
    selectRow_(checkbox, row, opt_rows) {
        if (row) {
            return function () {
                if (checkbox.checked) {
                    row.classList.add(this.cssClasses_.IS_SELECTED);
                }
                else {
                    row.classList.remove(this.cssClasses_.IS_SELECTED);
                }
            }.bind(this);
        }
        if (opt_rows) {
            return function () {
                var i_;
                var el;
                if (checkbox.checked) {
                    for (i_ = 0; i_ < opt_rows.length; i_++) {
                        el = opt_rows[i_].querySelector('td').querySelector('.mdl-checkbox');
                        el['MaterialCheckbox'].check();
                        opt_rows[i_].classList.add(this.cssClasses_.IS_SELECTED);
                    }
                }
                else {
                    for (i_ = 0; i_ < opt_rows.length; i_++) {
                        el = opt_rows[i_].querySelector('td').querySelector('.mdl-checkbox');
                        el['MaterialCheckbox'].uncheck();
                        opt_rows[i_].classList.remove(this.cssClasses_.IS_SELECTED);
                    }
                }
            }.bind(this);
        }
    }
    createCheckbox_(row, opt_rows) {
        var label = document.createElement('label');
        var labelClasses = [
            'mdl-checkbox',
            'mdl-js-checkbox',
            'mdl-js-ripple-effect',
            this.cssClasses_.SELECT_ELEMENT
        ];
        label.className = labelClasses.join(' ');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('mdl-checkbox__input');
        if (row) {
            checkbox.checked = row.classList.contains(this.cssClasses_.IS_SELECTED);
            checkbox.addEventListener('change', this.selectRow_(checkbox, row));
        }
        else if (opt_rows) {
            checkbox.addEventListener('change', this.selectRow_(checkbox, null, opt_rows));
        }
        label.appendChild(checkbox);
        componentHandler.upgradeElement(label, 'MaterialCheckbox');
        return label;
    }
    init() {
        if (this.element_) {
            var firstHeader = this.element_.querySelector('th');
            var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
            var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
            var rows = bodyRows.concat(footRows);
            if (this.element_.classList.contains(this.cssClasses_.SELECTABLE)) {
                var th = document.createElement('th');
                var headerCheckbox = this.createCheckbox_(null, rows);
                th.appendChild(headerCheckbox);
                firstHeader.parentElement.insertBefore(th, firstHeader);
                for (var i_ = 0; i_ < rows.length; i_++) {
                    var firstCell = rows[i_].querySelector('td');
                    if (firstCell) {
                        var td = document.createElement('td');
                        if (rows[i_].parentNode.nodeName.toUpperCase() === 'TBODY') {
                            var rowCheckbox = this.createCheckbox_(rows[i_]);
                            td.appendChild(rowCheckbox);
                        }
                        rows[i_].insertBefore(td, firstCell);
                    }
                }
                this.element_.classList.add(this.cssClasses_.IS_UPGRADED);
            }
        }
    }
    Constant_ = {};
    cssClasses_ = {
        DATA_TABLE: 'mdl-data-table',
        SELECTABLE: 'mdl-data-table--selectable',
        SELECT_ELEMENT: 'mdl-data-table__select',
        IS_SELECTED: 'is-selected',
        IS_UPGRADED: 'is-upgraded'
    };
}
window['MaterialDataTable'] = MaterialDataTable;
componentHandler.register({
    constructor: MaterialDataTable,
    classAsString: 'MaterialDataTable',
    cssClass: 'mdl-js-data-table'
});
export class MaterialRipple {
    constructor(element) { basicConstructor(element, this); }
    downHandler_(event) {
        if (this.rippleElement_) {
            if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
                var rect = this.element_.getBoundingClientRect();
                this.boundHeight = rect.height;
                this.boundWidth = rect.width;
                this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
                this.rippleElement_.style.width = `${this.rippleSize_}px`;
                this.rippleElement_.style.height = `${this.rippleSize_}px`;
            }
            this.rippleElement_.classList.add(this.cssClasses_.IS_VISIBLE);
        }
        if (event.type === window.clickEvt && this.ignoringMouseDown_) {
            this.ignoringMouseDown_ = false;
        }
        else {
            if (event.type === 'touchstart') {
                this.ignoringMouseDown_ = true;
            }
            var frameCount = this.getFrameCount();
            if (frameCount > 0) {
                return;
            }
            this.setFrameCount(1);
            var bound = event.currentTarget.getBoundingClientRect();
            var x;
            var y;
            if (event.clientX === 0 && event.clientY === 0) {
                x = Math.round(bound.width / 2);
                y = Math.round(bound.height / 2);
            }
            else {
                var clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
                var clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
                x = Math.round(clientX - bound.left);
                y = Math.round(clientY - bound.top);
            }
            this.setRippleXY(x, y);
            this.setRippleStyles(true);
            window.requestAnimationFrame(this.animFrameHandler.bind(this));
        }
    }
    upHandler_(event) {
        if (event && event.detail !== 2) {
            window.setTimeout(function () {
                if (this.rippleElement_)
                    this.rippleElement_.classList.remove(this.cssClasses_.IS_VISIBLE);
            }.bind(this), 0);
        }
    }
    recentering;
    init() {
        if (this.element_) {
            this.recentering = this.element_.classList.contains(this.cssClasses_.RIPPLE_CENTER);
            if (!this.element_.classList.contains(this.cssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
                this.rippleElement_ = this.element_.querySelector(`.${this.cssClasses_.RIPPLE}`);
                this.frameCount_ = 0;
                this.rippleSize_ = 0;
                this.x_ = 0;
                this.y_ = 0;
                this.ignoringMouseDown_ = false;
                this.boundDownHandler = this.downHandler_.bind(this);
                this.element_.addEventListener(window.clickEvt, this.boundDownHandler);
                this.element_.addEventListener('touchstart', this.boundDownHandler, { passive: true });
                this.boundUpHandler = this.upHandler_.bind(this);
                this.element_.addEventListener(window.clickEvt, this.boundUpHandler);
                this.element_.addEventListener('mouseleave', this.boundUpHandler);
                this.element_.addEventListener('touchend', this.boundUpHandler);
                this.element_.addEventListener('blur', this.boundUpHandler);
            }
        }
    }
    getFrameCount() {
        return this.frameCount_;
    }
    setFrameCount(fC) {
        this.frameCount_ = fC;
    }
    getRippleElement() {
        return this.rippleElement_;
    }
    setRippleXY(newX, newY) {
        this.x_ = newX;
        this.y_ = newY;
    }
    setRippleStyles(start) {
        if (this.rippleElement_ !== null) {
            var transformString;
            var scale;
            var size;
            var offset = `translate(${this.x_}px,${this.y_}px)`;
            if (start) {
                scale = this.Constant_.INITIAL_SCALE;
                size = this.Constant_.INITIAL_SIZE;
            }
            else {
                scale = this.Constant_.FINAL_SCALE;
                size = `${this.rippleSize_}px`;
                if (this.recentering) {
                    offset = `translate(${this.boundWidth / 2}px,${this.boundHeight / 2}px)`;
                }
            }
            transformString = `translate(-50%, -50%) ${offset} ${scale}`;
            this.rippleElement_.style.webkitTransform = transformString;
            this.rippleElement_.style.msTransform = transformString;
            this.rippleElement_.style.transform = transformString;
            if (start) {
                this.rippleElement_.classList.remove(this.cssClasses_.IS_ANIMATING);
            }
            else {
                this.rippleElement_.classList.add(this.cssClasses_.IS_ANIMATING);
            }
        }
    }
    animFrameHandler() {
        if (this.frameCount_-- > 0) {
            window.requestAnimationFrame(this.animFrameHandler.bind(this));
        }
        else {
            this.setRippleStyles(false);
        }
    }
    Constant_ = {
        INITIAL_SCALE: 'scale(0.0001, 0.0001)',
        INITIAL_SIZE: '1px',
        INITIAL_OPACITY: '0.4',
        FINAL_OPACITY: '0',
        FINAL_SCALE: ''
    };
    cssClasses_ = {
        RIPPLE_CENTER: 'mdl-ripple--center',
        RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE: 'mdl-ripple',
        IS_ANIMATING: 'is-animating',
        IS_VISIBLE: 'is-visible'
    };
}
window['MaterialRipple'] = MaterialRipple;
componentHandler.register({
    constructor: MaterialRipple,
    classAsString: 'MaterialRipple',
    cssClass: 'mdl-js-ripple-effect',
    widget: false
});
export function materialInit() {
    'use strict';
    if ('classList' in document.createElement('div') &&
        'querySelector' in document &&
        'addEventListener' in window && Array.prototype.forEach) {
        document.documentElement.classList.add('mdl-js');
        componentHandler.upgradeAllRegistered();
    }
    else {
        componentHandler.upgradeElement = function () { return; };
        componentHandler.register = function () { return; };
    }
}
materialInit();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvbWRsL21hdGVyaWFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWdEQSxJQUFJLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztBQUcvQixJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUU1QixJQUFJLHdCQUF3QixHQUFHLDZCQUE2QixDQUFDO0FBRTdELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBVzlCLG9CQUFvQixDQUFDLElBQUksRUFBRSxVQUFVO1FBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckQsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUMvQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVcsRUFBRTtvQkFDckMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO2lCQUN2QztnQkFDRCxPQUFPLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFTRCx5QkFBeUIsQ0FBQyxPQUFPO1FBQy9CLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFekQsT0FBTyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFXRCxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsT0FBTztRQUNqQyxJQUFJLFlB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QUFRLEVBQUUsc0JBQXNCO0lBQ2hDLE1BQU0sRUFBRSxLQUFLO0NBQ2hCLENBQUMsQ0FBQztBQUtILE1BQU0sVUFBVSxZQUFZO0lBQzFCLFlBQVksQ0FBQztJQU9iLElBQUksV0FBVyxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDLGVBQWUsSUFBSSxRQUFRO1FBQzNCLGtCQUFrQixJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtRQUMzRCxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztLQUN6QztTQUFNO1FBSUwsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLGNBQVksT0FBTyxDQUFBLENBQUMsQ0FBQztRQUl2RCxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsY0FBWSxPQUFPLENBQUEsQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQztBQUNELFlBQVksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbj09PT09PT09PT09PT09PT09PT09PT1cbk5PVElDRSEhIVxuPT09PT09PT09PT09PT09PT09PT09PVxuVGhlIGV2ZW50IGhhbmRsZXIgZm9yIGBNYXRlcmlhbFRvb2x0aXAucHJvdG90eXBlLmhhbmRsZU1vdXNlRW50ZXJfYCBoYXMgYmVlbiBtb2RpZmllZCB0byBhZGp1c3QgdG9vbHRpcFxucG9zaXRpb25pbmcgZm9yIHRoZSBuYXZpZ2F0aW9uIGRyYXdlci4gVGhpcyBjb2RlIGNvbnNpc3RzIG9mIGEgc2luZ2xlIElGIHN0YXRlbWVudC5cblxuSW4gYWRkaXRpb24sIG1hbnkgbWlub3IgY2hhbmdlcyAtIHN1Y2ggYXMgbW92aW5nIHRoZSBjb2RlIGZyb20gaXRzIGluaXRpYWwgc2luZ2xlLWZ1bmN0aW9uIHNjb3BlXG50byB0aGUgZ2xvYmFsIHNjb3BlIC0gYW5kIG1vZGVybml6aW5nIGNlcnRhaW4gYXNwZWN0cyBvZiB0aGUgc2NyaXB0LCBzdWNoIGFzIGNvbnZlcnRpbmcgdGhlIG9sZC1zY2hvb2wgY2xhc3MgZGVmaW5pdGlvbnNcbnRvIG1vZGVybiBjbGFzcyBkZWZpbml0aW9ucyB1c2luZyB0aGUga2V5d29yZCwgaGF2ZSBiZWVuIG1hZGUuXG5cbkZ1cnRoZXJtb3JlLCBjaGFuZ2VzIGhhdmUgYmVlbiBtYWRlIHRvIG1ha2UgdGhlIGNvZGUgbW9yZSBtb2R1bGFyLlxuXG5GaW5hbGx5LCBFeHBvcnQga2V5d29yZHMgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBtb2R1bGUuXG4qL1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBBIGNvbXBvbmVudCBoYW5kbGVyIGludGVyZmFjZSB1c2luZyB0aGUgcmV2ZWFsaW5nIG1vZHVsZSBkZXNpZ24gcGF0dGVybi5cbiAqIE1vcmUgZGV0YWlscyBvbiB0aGlzIGRlc2lnbiBwYXR0ZXJuIGhlcmU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gKlxuICogQGF1dGhvciBKYXNvbiBNYXllcy5cbiAqL1xuLyogLl9leHBvcnRlZF8gY29tcG9uZW50SGFuZGxlciAqL1xuXG4vLyBQcmUtZGVmaW5pbmcgdGhlIGNvbXBvbmVudEhhbmRsZXIgaW50ZXJmYWNlLCBmb3IgY2xvc3VyZSBkb2N1bWVudGF0aW9uIGFuZFxuLy8gc3RhdGljIHZlcmlmaWNhdGlvbi5cblxuXG5cbi8qKiBAdHlwZSB7IUFycmF5PGNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnPn0gKi9cbnZhciByZWdpc3RlcmVkQ29tcG9uZW50c18gPSBbXTtcblxuLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ+fSAqL1xudmFyIGNyZWF0ZWRDb21wb25lbnRzXyA9IFtdO1xuXG52YXIgY29tcG9uZW50Q29uZmlnUHJvcGVydHlfID0gJ21kbENvbXBvbmVudENvbmZpZ0ludGVybmFsXyc7XG5cbmV4cG9ydCBjb25zdCBjb21wb25lbnRIYW5kbGVyID0ge1xuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm9yIGEgY2xhc3Mgd2UgYXJlIGludGVyZXN0ZWQgaW4gdXNpbmcuXG4gICAqIE9wdGlvbmFsbHkgcmVwbGFjZXMgYSBtYXRjaCB3aXRoIHBhc3NlZCBvYmplY3QgaWYgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBhIGNsYXNzIHdlIHdhbnQgdG8gdXNlLlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnPX0gb3B0UmVwbGFjZSBPcHRpb25hbCBvYmplY3QgdG8gcmVwbGFjZSBtYXRjaCB3aXRoLlxuICAgKiBAcmV0dXJuIHshT2JqZWN0fGJvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmaW5kUmVnaXN0ZXJlZENsYXNzXyhuYW1lLCBvcHRSZXBsYWNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY2xhc3NOYW1lID09PSBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0UmVwbGFjZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0gPSBvcHRSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkQ29tcG9uZW50c19baV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgY2xhc3NOYW1lcyBvZiB0aGUgdXBncmFkZWQgY2xhc3NlcyBvbiB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBmZXRjaCBkYXRhIGZyb20uXG4gICAqIEByZXR1cm4geyFBcnJheTxzdHJpbmc+fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KSB7XG4gICAgdmFyIGRhdGFVcGdyYWRlZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJyk7XG4gICAgLy8gVXNlIGBbJyddYCBhcyBkZWZhdWx0IHZhbHVlIHRvIGNvbmZvcm0gdGhlIGAsbmFtZSxuYW1lLi4uYCBzdHlsZS5cbiAgICByZXR1cm4gZGF0YVVwZ3JhZGVkID09PSBudWxsID8gWycnXSA6IGRhdGFVcGdyYWRlZC5zcGxpdCgnLCcpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiB1cGdyYWRlZCBmb3IgdGhlIGdpdmVuXG4gICAqIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdhbnQgdG8gY2hlY2suXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyB0byBjaGVjayBmb3IuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIGpzQ2xhc3MpIHtcbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gY29tcG9uZW50SGFuZGxlci5nZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfKGVsZW1lbnQpO1xuICAgIHJldHVybiB1cGdyYWRlZExpc3QuaW5kZXhPZihqc0NsYXNzKSAhPT0gLTE7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBldmVudCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgVGhlIHR5cGUgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYnViYmxlcyBXaGV0aGVyIHRoZSBldmVudCBzaG91bGQgYnViYmxlIHVwIHRoZSBET00uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2FuY2VsYWJsZSBXaGV0aGVyIHRoZSBldmVudCBjYW4gYmUgY2FuY2VsZWQuXG4gICAqIEByZXR1cm5zIHshRXZlbnR9XG4gICAqL1xuICBjcmVhdGVFdmVudF8oZXZlbnRUeXBlLCBidWJibGVzLCBjYW5jZWxhYmxlKSB7XG4gICAgaWYgKCdDdXN0b21FdmVudCcgaW4gd2luZG93ICYmIHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBuZXcgQ3VzdG9tRXZlbnQoZXZlbnRUeXBlLCB7XG4gICAgICAgIGJ1YmJsZXMsXG4gICAgICAgIGNhbmNlbGFibGVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnRzJyk7XG4gICAgICBldi5pbml0RXZlbnQoZXZlbnRUeXBlLCBidWJibGVzLCBjYW5jZWxhYmxlKTtcbiAgICAgIHJldHVybiBldjtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIGV4aXN0aW5nIERPTSBmb3IgZWxlbWVudHMgb2Ygb3VyIGNvbXBvbmVudCB0eXBlIGFuZCB1cGdyYWRlcyB0aGVtXG4gICAqIGlmIHRoZXkgaGF2ZSBub3QgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgdGhlIHByb2dyYW1tYXRpYyBuYW1lIG9mIHRoZSBlbGVtZW50IGNsYXNzIHdlXG4gICAqIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdENzc0NsYXNzIHRoZSBuYW1lIG9mIHRoZSBDU1MgY2xhc3MgZWxlbWVudHMgb2YgdGhpc1xuICAgKiB0eXBlIHdpbGwgaGF2ZS5cbiAgICovXG4gIHVwZ3JhZGVEb20ob3B0SnNDbGFzcywgb3B0Q3NzQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIG9wdEpzQ2xhc3MgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHR5cGVvZiBvcHRDc3NDbGFzcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZURvbShyZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY2xhc3NOYW1lLFxuICAgICAgICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfW2ldLmNzc0NsYXNzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGpzQ2xhc3MgPSAvKiogQHR5cGUge3N0cmluZ30gKi8gKG9wdEpzQ2xhc3MpO1xuICAgICAgaWYgKHR5cGVvZiBvcHRDc3NDbGFzcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIHJlZ2lzdGVyZWRDbGFzcyA9IGNvbXBvbmVudEhhbmRsZXIuZmluZFJlZ2lzdGVyZWRDbGFzc18oanNDbGFzcyk7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkQ2xhc3MpIHtcbiAgICAgICAgICBvcHRDc3NDbGFzcyA9IHJlZ2lzdGVyZWRDbGFzcy5jc3NDbGFzcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHsgIG9wdENzc0NsYXNzfWApO1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBlbGVtZW50cy5sZW5ndGg7IG4rKykge1xuICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50KGVsZW1lbnRzW25dLCBqc0NsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgZWxlbWVudCByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyBPcHRpb25hbCBuYW1lIG9mIHRoZSBjbGFzcyB3ZSB3YW50IHRvIHVwZ3JhZGVcbiAgICogdGhlIGVsZW1lbnQgdG8uXG4gICAqL1xuICB1cGdyYWRlRWxlbWVudChlbGVtZW50LCBvcHRKc0NsYXNzKSB7XG4gICAgLy8gVmVyaWZ5IGFyZ3VtZW50IHR5cGUuXG4gICAgaWYgKCEodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IHByb3ZpZGVkIHRvIHVwZ3JhZGUgTURMIGVsZW1lbnQuJyk7XG4gICAgfVxuICAgIC8vIEFsbG93IHVwZ3JhZGUgdG8gYmUgY2FuY2VsZWQgYnkgY2FuY2VsaW5nIGVtaXR0ZWQgZXZlbnQuXG4gICAgdmFyIHVwZ3JhZGluZ0V2ID0gY29tcG9uZW50SGFuZGxlci5jcmVhdGVFdmVudF8oJ21kbC1jb21wb25lbnR1cGdyYWRpbmcnLCB0cnVlLCB0cnVlKTtcbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQodXBncmFkaW5nRXYpO1xuICAgIGlmICh1cGdyYWRpbmdFdi5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHVwZ3JhZGVkTGlzdCA9IGNvbXBvbmVudEhhbmRsZXIuZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICB2YXIgY2xhc3Nlc1RvVXBncmFkZSA9IFtdO1xuICAgIC8vIElmIGpzQ2xhc3MgaXMgbm90IHByb3ZpZGVkIHNjYW4gdGhlIHJlZ2lzdGVyZWQgY29tcG9uZW50cyB0byBmaW5kIHRoZVxuICAgIC8vIG9uZXMgbWF0Y2hpbmcgdGhlIGVsZW1lbnQncyBDU1MgY2xhc3NMaXN0LlxuICAgIGlmICghb3B0SnNDbGFzcykge1xuICAgICAgdmFyIGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgcmVnaXN0ZXJlZENvbXBvbmVudHNfKSB7XG4gICAgICAgIC8vIE1hdGNoIENTUyAmIE5vdCB0byBiZSB1cGdyYWRlZCAmIE5vdCB1cGdyYWRlZC5cbiAgICAgICAgaWYgKGNsYXNzTGlzdC5jb250YWlucyhjb21wb25lbnQuY3NzQ2xhc3MpICYmXG4gICAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLmluZGV4T2YoY29tcG9uZW50KSA9PT0gLTEgJiZcbiAgICAgICAgICAgICFjb21wb25lbnRIYW5kbGVyLmlzRWxlbWVudFVwZ3JhZGVkXyhlbGVtZW50LCBjb21wb25lbnQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgIGNsYXNzZXNUb1VwZ3JhZGUucHVzaChjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghY29tcG9uZW50SGFuZGxlci5pc0VsZW1lbnRVcGdyYWRlZF8oZWxlbWVudCwgb3B0SnNDbGFzcykpIHtcbiAgICAgIGNsYXNzZXNUb1VwZ3JhZGUucHVzaChjb21wb25lbnRIYW5kbGVyLmZpbmRSZWdpc3RlcmVkQ2xhc3NfKG9wdEpzQ2xhc3MpKTtcbiAgICB9XG5cbiAgICAvLyBVcGdyYWRlIHRoZSBlbGVtZW50IGZvciBlYWNoIGNsYXNzZXMuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjbGFzc2VzVG9VcGdyYWRlLmxlbmd0aCwgcmVnaXN0ZXJlZENsYXNzOyBpIDwgbjsgaSsrKSB7XG4gICAgICByZWdpc3RlcmVkQ2xhc3MgPSBjbGFzc2VzVG9VcGdyYWRlW2ldO1xuICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAvLyBNYXJrIGVsZW1lbnQgYXMgdXBncmFkZWQuXG4gICAgICAgIHVwZ3JhZGVkTGlzdC5wdXNoKHJlZ2lzdGVyZWRDbGFzcy5jbGFzc05hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcsIHVwZ3JhZGVkTGlzdC5qb2luKCcsJykpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgcmVnaXN0ZXJlZENsYXNzLmNsYXNzQ29uc3RydWN0b3IoZWxlbWVudCk7XG4gICAgICAgIGluc3RhbmNlW2NvbXBvbmVudENvbmZpZ1Byb3BlcnR5X10gPSByZWdpc3RlcmVkQ2xhc3M7XG4gICAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5wdXNoKGluc3RhbmNlKTtcbiAgICAgICAgLy8gQ2FsbCBhbnkgY2FsbGJhY2tzIHRoZSB1c2VyIGhhcyByZWdpc3RlcmVkIHdpdGggdGhpcyBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIG0gPSByZWdpc3RlcmVkQ2xhc3MuY2FsbGJhY2tzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgICAgICAgIHJlZ2lzdGVyZWRDbGFzcy5jYWxsYmFja3Nbal0oZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVnaXN0ZXJlZENsYXNzLndpZGdldCkge1xuICAgICAgICAgIC8vIEFzc2lnbiBwZXIgZWxlbWVudCBpbnN0YW5jZSBmb3IgY29udHJvbCBvdmVyIEFQSVxuICAgICAgICAgIGVsZW1lbnRbcmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZV0gPSBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IGZvciB0aGUgZ2l2ZW4gY2xhc3MuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciB1cGdyYWRlZEV2ID0gY29tcG9uZW50SGFuZGxlci5jcmVhdGVFdmVudF8oJ21kbC1jb21wb25lbnR1cGdyYWRlZCcsIHRydWUsIGZhbHNlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudCh1cGdyYWRlZEV2KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgbGlzdCBvZiBlbGVtZW50cyByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudHwhQXJyYXk8IUVsZW1lbnQ+fCFOb2RlTGlzdHwhSFRNTENvbGxlY3Rpb259IGVsZW1lbnRzXG4gICAqIFRoZSBlbGVtZW50cyB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqL1xuICB1cGdyYWRlRWxlbWVudHMoZWxlbWVudHMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgICBpZiAoZWxlbWVudHMgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWxlbWVudHMpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGVsZW1lbnRzLmxlbmd0aCwgZWxlbWVudDsgaSA8IG47IGkrKykge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cyhlbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2xhc3MgZm9yIGZ1dHVyZSB1c2UgYW5kIGF0dGVtcHRzIHRvIHVwZ3JhZGUgZXhpc3RpbmcgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljfSBjb25maWdcbiAgICovXG4gIHJlZ2lzdGVyKGNvbmZpZykge1xuICAgIC8vIEluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBDbG9zdXJlLWNvbXBpbGVkIGFuZCB1bmNvbXBpbGVkIGNvZGUgYWNjZXNzaW5nXG4gICAgLy8gdGhpcyBtZXRob2QsIHdlIG5lZWQgdG8gYWxsb3cgZm9yIGJvdGggdGhlIGRvdCBhbmQgYXJyYXkgc3ludGF4IGZvclxuICAgIC8vIHByb3BlcnR5IGFjY2Vzcy4gWW91J2xsIHRoZXJlZm9yZSBzZWUgdGhlIGBmb28uYmFyIHx8IGZvb1snYmFyJ11gXG4gICAgLy8gcGF0dGVybiByZXBlYXRlZCBhY3Jvc3MgdGhpcyBtZXRob2QuXG4gICAgdmFyIHdpZGdldE1pc3NpbmcgPSAodHlwZW9mIGNvbmZpZy53aWRnZXQgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHR5cGVvZiBjb25maWdbJ3dpZGdldCddID09PSAndW5kZWZpbmVkJyk7XG4gICAgdmFyIHdpZGdldCA9IHRydWU7XG5cbiAgICBpZiAoIXdpZGdldE1pc3NpbmcpIHtcbiAgICAgIHdpZGdldCA9IGNvbmZpZy53aWRnZXQgfHwgY29uZmlnWyd3aWRnZXQnXTtcbiAgICB9XG5cbiAgICB2YXIgbmV3Q29uZmlnID0gLyoqIEB0eXBlIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ30gKi8gKHtcbiAgICAgIGNsYXNzQ29uc3RydWN0b3I6IGNvbmZpZy5jb25zdHJ1Y3RvciB8fCBjb25maWdbJ2NvbnN0cnVjdG9yJ10sXG4gICAgICBjbGFzc05hbWU6IGNvbmZpZy5jbGFzc0FzU3RyaW5nIHx8IGNvbmZpZ1snY2xhc3NBc1N0cmluZyddLFxuICAgICAgY3NzQ2xhc3M6IGNvbmZpZy5jc3NDbGFzcyB8fCBjb25maWdbJ2Nzc0NsYXNzJ10sXG4gICAgICB3aWRnZXQsXG4gICAgICBjYWxsYmFja3M6IFtdXG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmVnaXN0ZXJlZENvbXBvbmVudHNfKSB7XG4gICAgICBpZiAoaXRlbS5jc3NDbGFzcyA9PT0gbmV3Q29uZmlnLmNzc0NsYXNzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHByb3ZpZGVkIGNzc0NsYXNzIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZDogJHsgIGl0ZW0uY3NzQ2xhc3N9YCk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5jbGFzc05hbWUgPT09IG5ld0NvbmZpZy5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgY2xhc3NOYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29uZmlnLmNvbnN0cnVjdG9yICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uZmlnLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbmZpZy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29tcG9uZW50Q29uZmlnUHJvcGVydHlfICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBNREwgY29tcG9uZW50IGNsYXNzZXMgbXVzdCBub3QgaGF2ZSAkeyAgY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXG4gICAgICAgICAgfSBkZWZpbmVkIGFzIGEgcHJvcGVydHkuYCk7XG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gY29tcG9uZW50SGFuZGxlci5maW5kUmVnaXN0ZXJlZENsYXNzXyhjb25maWcuY2xhc3NBc1N0cmluZywgbmV3Q29uZmlnKTtcblxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzXy5wdXNoKG5ld0NvbmZpZyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdXNlciB0byBiZSBhbGVydGVkIHRvIGFueSB1cGdyYWRlcyB0aGF0IGFyZSBwZXJmb3JtZWQgZm9yIGEgZ2l2ZW5cbiAgICogY29tcG9uZW50IHR5cGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpzQ2xhc3MgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIE1ETCBjb21wb25lbnQgd2Ugd2lzaFxuICAgKiB0byBob29rIGludG8gZm9yIGFueSB1cGdyYWRlcyBwZXJmb3JtZWQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oIUhUTUxFbGVtZW50KX0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIGNhbGwgdXBvbiBhblxuICAgKiB1cGdyYWRlLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBleHBlY3QgMSBwYXJhbWV0ZXIgLSB0aGUgSFRNTEVsZW1lbnQgd2hpY2hcbiAgICogZ290IHVwZ3JhZGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrKGpzQ2xhc3MsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlZ0NsYXNzID0gY29tcG9uZW50SGFuZGxlci5maW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICBpZiAocmVnQ2xhc3MpIHtcbiAgICAgIHJlZ0NsYXNzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGFsbCByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm91bmQgaW4gdGhlIGN1cnJlbnQgRE9NLiBUaGlzIGlzXG4gICAqIGF1dG9tYXRpY2FsbHkgY2FsbGVkIG9uIHdpbmRvdyBsb2FkLlxuICAgKi9cbiAgdXBncmFkZUFsbFJlZ2lzdGVyZWQoKSB7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlRG9tKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tuXS5jbGFzc05hbWUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbXBvbmVudCBmb3IgdGhlIGRvd25ncmFkZSBtZXRob2QuXG4gICAqIEV4ZWN1dGUgaWYgZm91bmQuXG4gICAqIFJlbW92ZSBjb21wb25lbnQgZnJvbSBjcmVhdGVkQ29tcG9uZW50cyBsaXN0LlxuICAgKlxuICAgKiBAcGFyYW0gez9jb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudH0gY29tcG9uZW50XG4gICAqL1xuICBkZWNvbnN0cnVjdENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICB2YXIgY29tcG9uZW50SW5kZXggPSBjcmVhdGVkQ29tcG9uZW50c18uaW5kZXhPZihjb21wb25lbnQpO1xuICAgICAgY3JlYXRlZENvbXBvbmVudHNfLnNwbGljZShjb21wb25lbnRJbmRleCwgMSk7XG5cbiAgICAgIHZhciB1cGdyYWRlcyA9IGNvbXBvbmVudC5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKS5zcGxpdCgnLCcpO1xuICAgICAgdmFyIGNvbXBvbmVudFBsYWNlID0gdXBncmFkZXMuaW5kZXhPZihjb21wb25lbnRbY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXS5jbGFzc0FzU3RyaW5nKTtcbiAgICAgIHVwZ3JhZGVzLnNwbGljZShjb21wb25lbnRQbGFjZSwgMSk7XG4gICAgICBjb21wb25lbnQuZWxlbWVudF8uc2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJywgdXBncmFkZXMuam9pbignLCcpKTtcblxuICAgICAgdmFyIGV2ID0gY29tcG9uZW50SGFuZGxlci5jcmVhdGVFdmVudF8oJ21kbC1jb21wb25lbnRkb3duZ3JhZGVkJywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgY29tcG9uZW50LmVsZW1lbnRfLmRpc3BhdGNoRXZlbnQoZXYpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRG93bmdyYWRlIGVpdGhlciBhIGdpdmVuIG5vZGUsIGFuIGFycmF5IG9mIG5vZGVzLCBvciBhIE5vZGVMaXN0LlxuICAgKlxuICAgKiBAcGFyYW0geyFOb2RlfCFBcnJheTwhTm9kZT58IU5vZGVMaXN0fSBub2Rlc1xuICAgKi9cbiAgZG93bmdyYWRlTm9kZXMobm9kZXMpIHtcbiAgICAvKipcbiAgICAgKiBBdXhpbGlhcnkgZnVuY3Rpb24gdG8gZG93bmdyYWRlIGEgc2luZ2xlIG5vZGUuXG4gICAgICogQHBhcmFtICB7IU5vZGV9IG5vZGUgdGhlIG5vZGUgdG8gYmUgZG93bmdyYWRlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvd25ncmFkZU5vZGUgKG5vZGUpIHtcbiAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5maWx0ZXIoaXRlbSA9PiBpdGVtLmVsZW1lbnRfID09PSBub2RlKS5mb3JFYWNoKGNvbXBvbmVudEhhbmRsZXIuZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbCk7XG4gICAgfVxuICAgIGlmIChub2RlcyBpbnN0YW5jZW9mIEFycmF5IHx8IG5vZGVzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbm9kZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgZG93bmdyYWRlTm9kZShub2Rlc1tuXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIGRvd25ncmFkZU5vZGUobm9kZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gZG93bmdyYWRlIE1ETCBub2Rlcy4nKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIHR5cGUgb2YgYSByZWdpc3RlcmVkIGNvbXBvbmVudCB0eXBlIG1hbmFnZWQgYnlcbiAgICogY29tcG9uZW50SGFuZGxlci4gUHJvdmlkZWQgZm9yIGJlbmVmaXQgb2YgdGhlIENsb3N1cmUgY29tcGlsZXIuXG4gICAqXG4gICAqIEB0eXBlZGVmIHt7XG4gICAqICAgY29uc3RydWN0b3I6IEZ1bmN0aW9uLFxuICAgKiAgIGNsYXNzQXNTdHJpbmc6IHN0cmluZyxcbiAgICogICBjc3NDbGFzczogc3RyaW5nLFxuICAgKiAgIHdpZGdldDogKHN0cmluZ3xib29sZWFufHVuZGVmaW5lZClcbiAgICogfX1cbiAgICovXG4gIENvbXBvbmVudENvbmZpZ1B1YmxpYzoge30sICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSB0eXBlIG9mIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgdHlwZSBtYW5hZ2VkIGJ5XG4gICAqIGNvbXBvbmVudEhhbmRsZXIuIFByb3ZpZGVkIGZvciBiZW5lZml0IG9mIHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuICAgKlxuICAgKiBAdHlwZWRlZiB7e1xuICAgKiAgIGNvbnN0cnVjdG9yOiAhRnVuY3Rpb24sXG4gICAqICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAgICogICB3aWRnZXQ6IChzdHJpbmd8Ym9vbGVhbiksXG4gICAqICAgY2FsbGJhY2tzOiAhQXJyYXk8ZnVuY3Rpb24oIUhUTUxFbGVtZW50KT5cbiAgICogfX1cbiAgICovXG4gIENvbXBvbmVudENvbmZpZzoge30sICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAvKipcbiAgICogQ3JlYXRlZCBjb21wb25lbnQgKGkuZS4sIHVwZ3JhZGVkIGVsZW1lbnQpIHR5cGUgYXMgbWFuYWdlZCBieVxuICAgKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAgICpcbiAgICogQHR5cGVkZWYge3tcbiAgICogICBlbGVtZW50XzogIUhUTUxFbGVtZW50LFxuICAgKiAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgKiAgIGNsYXNzQXNTdHJpbmc6IHN0cmluZyxcbiAgICogICBjc3NDbGFzczogc3RyaW5nLFxuICAgKiAgIHdpZGdldDogc3RyaW5nXG4gICAqIH19XG4gICAqL1xuICBDb21wb25lbnQ6IHt9ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbn07XG5cbi8vIEV4cG9ydCBhbGwgc3ltYm9scywgZm9yIHRoZSBiZW5lZml0IG9mIENsb3N1cmUgY29tcGlsZXIuXG4vLyBObyBlZmZlY3Qgb24gdW5jb21waWxlZCBjb2RlLlxud2luZG93LmNvbXBvbmVudEhhbmRsZXIgPSBjb21wb25lbnRIYW5kbGVyO1xuXG5cbmZ1bmN0aW9uIGJhc2ljQ29uc3RydWN0b3IoZWxlbWVudCwgX3RoaXMpe1xuICAgIF90aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcbiAgICBfdGhpcy5pbml0KCk7XG59XG5cbi8vIFNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2Rhcml1cy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUvYmxvYi9tYXN0ZXIvcmVxdWVzdEFuaW1hdGlvbkZyYW1lLmpzXG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEgd2hpY2ggZGVyaXZlZCBmcm9tXG4vLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci5cbi8vIEZpeGVzIGZyb20gUGF1bCBJcmlzaCwgVGlubyBaaWpkZWwsIEFuZHJldyBNYW8sIEtsZW1lbiBTbGF2acSNLCBEYXJpdXMgQmFjb25cbi8vIE1JVCBsaWNlbnNlXG5pZiAoIURhdGUubm93KSB7XG4gICAgLyoqXG4gICAgICogRGF0ZS5ub3cgcG9seWZpbGwuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgY3VycmVudCBEYXRlXG4gICAgICovXG4gICAgRGF0ZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9O1xufVxudmFyIHZlbmRvcnMgPSBbXG4gICAgJ3dlYmtpdCcsXG4gICAgJ21veidcbl07XG5mb3IgKHZhciBpID0gMDsgaSA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK2kpIHtcbiAgICB2YXIgdnAgPSB2ZW5kb3JzW2ldO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbYCR7dnAgIH1SZXF1ZXN0QW5pbWF0aW9uRnJhbWVgXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbYCR7dnAgIH1DYW5jZWxBbmltYXRpb25GcmFtZWBdIHx8IHdpbmRvd1tgJHt2cCAgfUNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZWBdO1xufVxuaWYgKC9pUChhZHxob25lfG9kKS4qT1MgNi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgLyoqXG4gICAgICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsLlxuICAgICAqIEBwYXJhbSAgeyFGdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIHZhciBuZXh0VGltZSA9IE1hdGgubWF4KGxhc3RUaW1lICsgMTYsIG5vdyk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGxhc3RUaW1lID0gbmV4dFRpbWUpO1xuICAgICAgICB9LCBuZXh0VGltZSAtIG5vdyk7XG4gICAgfTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBjbGVhclRpbWVvdXQ7XG59XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgQnV0dG9uIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbEJ1dHRvbiB7XG4gICAgZWxlbWVudF87XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkgeyBiYXNpY0NvbnN0cnVjdG9yKGVsZW1lbnQsIHRoaXMpOyB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgYmx1ciBvZiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGJsdXJIYW5kbGVyXyhldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYmx1cigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFB1YmxpYyBtZXRob2RzLlxuICAgIC8qKlxuICAgICAgICogRGlzYWJsZSBidXR0b24uXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRW5hYmxlIGJ1dHRvbi5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBlbmFibGUoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgdGhpcy5ib3VuZFJpcHBsZUJsdXJIYW5kbGVyID0gdGhpcy5ibHVySGFuZGxlcl8uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZFJpcHBsZUJsdXJIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIHJpcHBsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJpcHBsZUVsZW1lbnRfKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHJpcHBsZUNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRCdXR0b25CbHVySGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLmJvdW5kQnV0dG9uQmx1ckhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHt9O1xuICAgIC8qKlxuICAgICAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAgICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAgICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY3NzQ2xhc3Nlc18gPSB7XG4gICAgICAgIFJJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgICAgIFJJUFBMRV9DT05UQUlORVI6ICdtZGwtYnV0dG9uX19yaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgUklQUExFOiAnbWRsLXJpcHBsZSdcbiAgICB9O1xufVxud2luZG93WydNYXRlcmlhbEJ1dHRvbiddID0gTWF0ZXJpYWxCdXR0b247XG4vLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbi8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG5jb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxCdXR0b24sXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsQnV0dG9uJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1idXR0b24nLFxuICAgIHdpZGdldDogdHJ1ZVxufSk7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgQ2hlY2tib3ggTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbENoZWNrYm94IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KXtcbiAgICAgICAgYmFzaWNDb25zdHJ1Y3RvcihlbGVtZW50LCB0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgICpcbiAgICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgc3RhdGljIENvbnN0YW50XyA9IHsgVElOWV9USU1FT1VUOiAwLjAwMSB9O1xuICAgIC8qKlxuICAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgICpcbiAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgc3RhdGljIGNzc0NsYXNzZXNfID0ge1xuICAgICAgICBJTlBVVDogJ21kbC1jaGVja2JveF9faW5wdXQnLFxuICAgICAgICBCT1hfT1VUTElORTogJ21kbC1jaGVja2JveF9fYm94LW91dGxpbmUnLFxuICAgICAgICBGT0NVU19IRUxQRVI6ICdtZGwtY2hlY2tib3hfX2ZvY3VzLWhlbHBlcicsXG4gICAgICAgIFRJQ0tfT1VUTElORTogJ21kbC1jaGVja2JveF9fdGljay1vdXRsaW5lJyxcbiAgICAgICAgUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICAgICAgUklQUExFX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cycsXG4gICAgICAgIFJJUFBMRV9DT05UQUlORVI6ICdtZGwtY2hlY2tib3hfX3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICBSSVBQTEVfQ0VOVEVSOiAnbWRsLXJpcHBsZS0tY2VudGVyJyxcbiAgICAgICAgUklQUExFOiAnbWRsLXJpcHBsZScsXG4gICAgICAgIElTX0ZPQ1VTRUQ6ICdpcy1mb2N1c2VkJyxcbiAgICAgICAgSVNfRElTQUJMRUQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgICAgIElTX0NIRUNLRUQ6ICdpcy1jaGVja2VkJyxcbiAgICAgICAgSVNfVVBHUkFERUQ6ICdpcy11cGdyYWRlZCdcbiAgICB9O1xuICAgIC8qKlxuICAgICogSGFuZGxlIGNoYW5nZSBvZiBzdGF0ZS5cbiAgICAqXG4gICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBvbkNoYW5nZV8oZXZlbnQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEhhbmRsZSBmb2N1cyBvZiBlbGVtZW50LlxuICAgICpcbiAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIG9uRm9jdXNfKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEhhbmRsZSBsb3N0IGZvY3VzIG9mIGVsZW1lbnQuXG4gICAgKlxuICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgb25CbHVyXyhldmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBIYW5kbGUgbW91c2V1cC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBvbk1vdXNlVXBfKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuYmx1cl8oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBIYW5kbGUgY2xhc3MgdXBkYXRlcy5cbiAgICAqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgdXBkYXRlQ2xhc3Nlc18oKSB7XG4gICAgICAgIHRoaXMuY2hlY2tEaXNhYmxlZCgpO1xuICAgICAgICB0aGlzLmNoZWNrVG9nZ2xlU3RhdGUoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBBZGQgYmx1ci5cbiAgICAqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgYmx1cl8oKSB7XG4gICAgICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgd2h5IHRoZXJlJ3MgYSBmb2N1cyBldmVudCBiZWluZyBmaXJlZCBhZnRlciBvdXIgYmx1cixcbiAgICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBoYWNrLlxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uYmx1cigpO1xuICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuQ29uc3RhbnRfLlRJTllfVElNRU9VVCk7XG4gICAgfVxuICAgIC8vIFB1YmxpYyBtZXRob2RzLlxuICAgIC8qKlxuICAgICogQ2hlY2sgdGhlIGlucHV0cyB0b2dnbGUgc3RhdGUgYW5kIHVwZGF0ZSBkaXNwbGF5LlxuICAgICpcbiAgICAqIEBwdWJsaWNcbiAgICAqL1xuICAgIGNoZWNrVG9nZ2xlU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfQ0hFQ0tFRCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19DSEVDS0VEKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgKiBDaGVjayB0aGUgaW5wdXRzIGRpc2FibGVkIHN0YXRlIGFuZCB1cGRhdGUgZGlzcGxheS5cbiAgICAqXG4gICAgKiBAcHVibGljXG4gICAgKi9cbiAgICBjaGVja0Rpc2FibGVkKCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19ESVNBQkxFRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19ESVNBQkxFRCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgKiBEaXNhYmxlIGNoZWNrYm94LlxuICAgICpcbiAgICAqIEBwdWJsaWNcbiAgICAqL1xuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBFbmFibGUgY2hlY2tib3guXG4gICAgKlxuICAgICogQHB1YmxpY1xuICAgICovXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIENoZWNrIGNoZWNrYm94LlxuICAgICpcbiAgICAqIEBwdWJsaWNcbiAgICAqL1xuICAgIGNoZWNrKCkge1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBVbmNoZWNrIGNoZWNrYm94LlxuICAgICpcbiAgICAqIEBwdWJsaWNcbiAgICAqL1xuICAgIHVuY2hlY2soKSB7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLmNzc0NsYXNzZXNfLklOUFVUfWApO1xuICAgICAgICAgICAgdmFyIGJveE91dGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBib3hPdXRsaW5lLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5CT1hfT1VUTElORSk7XG4gICAgICAgICAgICB2YXIgdGlja0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHRpY2tDb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLkZPQ1VTX0hFTFBFUik7XG4gICAgICAgICAgICB2YXIgdGlja091dGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICB0aWNrT3V0bGluZS5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uVElDS19PVVRMSU5FKTtcbiAgICAgICAgICAgIGJveE91dGxpbmUuYXBwZW5kQ2hpbGQodGlja091dGxpbmUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZCh0aWNrQ29udGFpbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoYm94T3V0bGluZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9DT05UQUlORVIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9DRU5URVIpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRSaXBwbGVNb3VzZVVwID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZFJpcHBsZU1vdXNlVXApO1xuICAgICAgICAgICAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5SSVBQTEUpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uYXBwZW5kQ2hpbGQocmlwcGxlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ib3VuZElucHV0T25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZElucHV0T25Gb2N1cyA9IHRoaXMub25Gb2N1c18uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRJbnB1dE9uQmx1ciA9IHRoaXMub25CbHVyXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZEVsZW1lbnRNb3VzZVVwID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZElucHV0T25DaGFuZ2UpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5ib3VuZElucHV0T25Gb2N1cyk7XG4gICAgICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRJbnB1dE9uQmx1cik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LmNsaWNrRXZ0LCB0aGlzLmJvdW5kRWxlbWVudE1vdXNlVXApO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfVVBHUkFERUQpO1xuICAgICAgICB9XG4gICAgfVxufVxud2luZG93WydNYXRlcmlhbENoZWNrYm94J10gPSBNYXRlcmlhbENoZWNrYm94O1xuLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4vLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsQ2hlY2tib3gsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsQ2hlY2tib3gnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLWNoZWNrYm94JyxcbiAgICB3aWRnZXQ6IHRydWVcbn0pO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIGljb24gdG9nZ2xlIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxJY29uVG9nZ2xlIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7IGJhc2ljQ29uc3RydWN0b3IoZWxlbWVudCwgdGhpcyk7IH1cbiAgICAvKipcbiAgICAgICAqIEhhbmRsZSBjaGFuZ2Ugb2Ygc3RhdGUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25DaGFuZ2VfKGV2ZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgZm9jdXMgb2YgZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBvbkZvY3VzXyhldmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgbG9zdCBmb2N1cyBvZiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIG9uQmx1cl8oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIG1vdXNldXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25Nb3VzZVVwXyhldmVudCkge1xuICAgICAgICB0aGlzLmJsdXJfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGNsYXNzIHVwZGF0ZXMuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIHVwZGF0ZUNsYXNzZXNfKCkge1xuICAgICAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICAgICAgdGhpcy5jaGVja1RvZ2dsZVN0YXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRGlzYWJsZSBpY29uIHRvZ2dsZS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBkaXNhYmxlKCkge1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRW5hYmxlIGljb24gdG9nZ2xlLlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGVuYWJsZSgpIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBDaGVjayBpY29uIHRvZ2dsZS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjaGVjaygpIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogVW5jaGVjayBpY29uIHRvZ2dsZS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICB1bmNoZWNrKCkge1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFbGVtZW50XyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jc3NDbGFzc2VzXy5JTlBVVH1gKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0lHTk9SRV9FVkVOVFMpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSlNfUklQUExFX0VGRkVDVCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0NFTlRFUik7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZFJpcHBsZU1vdXNlVXAgPSB0aGlzLm9uTW91c2VVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LmNsaWNrRXZ0LCB0aGlzLmJvdW5kUmlwcGxlTW91c2VVcCk7XG4gICAgICAgICAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5hcHBlbmRDaGlsZChyaXBwbGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQodGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJvdW5kSW5wdXRPbkNoYW5nZSA9IHRoaXMub25DaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kSW5wdXRPbkZvY3VzID0gdGhpcy5vbkZvY3VzXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZElucHV0T25CbHVyID0gdGhpcy5vbkJsdXJfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kRWxlbWVudE9uTW91c2VVcCA9IHRoaXMub25Nb3VzZVVwXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuYm91bmRJbnB1dE9uQ2hhbmdlKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuYm91bmRJbnB1dE9uRm9jdXMpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJvdW5kSW5wdXRPbkJsdXIpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZEVsZW1lbnRPbk1vdXNlVXApO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKCdpcy11cGdyYWRlZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHsgVElOWV9USU1FT1VUOiAwLjAwMSB9O1xuICAgIC8qKlxuICAgICAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAgICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAgICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY3NzQ2xhc3Nlc18gPSB7XG4gICAgICAgIElOUFVUOiAnbWRsLWljb24tdG9nZ2xlX19pbnB1dCcsXG4gICAgICAgIEpTX1JJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgICAgIFJJUFBMRV9JR05PUkVfRVZFTlRTOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QtLWlnbm9yZS1ldmVudHMnLFxuICAgICAgICBSSVBQTEVfQ09OVEFJTkVSOiAnbWRsLWljb24tdG9nZ2xlX19yaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgUklQUExFX0NFTlRFUjogJ21kbC1yaXBwbGUtLWNlbnRlcicsXG4gICAgICAgIFJJUFBMRTogJ21kbC1yaXBwbGUnLFxuICAgICAgICBJU19GT0NVU0VEOiAnaXMtZm9jdXNlZCcsXG4gICAgICAgIElTX0RJU0FCTEVEOiAnaXMtZGlzYWJsZWQnLFxuICAgICAgICBJU19DSEVDS0VEOiAnaXMtY2hlY2tlZCdcbiAgICB9O1xuICAgIC8qKlxuICAgICAgICogQWRkIGJsdXIuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGJsdXJfID0gTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuYmx1cl87XG4gICAgLy8gUHVibGljIG1ldGhvZHMuXG4gICAgLyoqXG4gICAgICAgKiBDaGVjayB0aGUgaW5wdXRzIHRvZ2dsZSBzdGF0ZSBhbmQgdXBkYXRlIGRpc3BsYXkuXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgY2hlY2tUb2dnbGVTdGF0ZSA9IE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLmNoZWNrVG9nZ2xlU3RhdGU7XG4gICAgLyoqXG4gICAgICAgKiBDaGVjayB0aGUgaW5wdXRzIGRpc2FibGVkIHN0YXRlIGFuZCB1cGRhdGUgZGlzcGxheS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjaGVja0Rpc2FibGVkID0gTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuY2hlY2tEaXNhYmxlZDtcbn1cbndpbmRvd1snTWF0ZXJpYWxJY29uVG9nZ2xlJ10gPSBNYXRlcmlhbEljb25Ub2dnbGU7XG4vLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbi8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG5jb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxJY29uVG9nZ2xlLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbEljb25Ub2dnbGUnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLWljb24tdG9nZ2xlJyxcbiAgICB3aWRnZXQ6IHRydWVcbn0pO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIGRyb3Bkb3duIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxNZW51IHtcbiAgICBlbGVtZW50XztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYm91bmRJdGVtS2V5ZG93bl8gPSB0aGlzLmhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50Xy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJvdW5kSXRlbUNsaWNrXyA9IHRoaXMuaGFuZGxlSXRlbUNsaWNrXy5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYm91bmRGb3JLZXlkb3duXyA9IHRoaXMuaGFuZGxlRm9yS2V5Ym9hcmRFdmVudF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5ib3VuZEZvckNsaWNrXyA9IHRoaXMuaGFuZGxlRm9yQ2xpY2tfLmJpbmQodGhpcyk7XG5cbiAgICAgICAgYmFzaWNDb25zdHJ1Y3RvcihlbGVtZW50LCB0aGlzKTsgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGNvbnRhaW5lciBmb3IgdGhlIG1lbnUuXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uQ09OVEFJTkVSKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY29udGFpbmVyLCB0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyXyA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBvdXRsaW5lIGZvciB0aGUgbWVudSAoc2hhZG93IGFuZCBiYWNrZ3JvdW5kKS5cbiAgICAgICAgICAgIHZhciBvdXRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBvdXRsaW5lLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLk9VVExJTkUpO1xuICAgICAgICAgICAgdGhpcy5vdXRsaW5lXyA9IG91dGxpbmU7XG4gICAgICAgICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKG91dGxpbmUsIHRoaXMuZWxlbWVudF8pO1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgXCJmb3JcIiBlbGVtZW50IGFuZCBiaW5kIGV2ZW50cyB0byBpdC5cbiAgICAgICAgICAgIHZhciBmb3JFbElkID0gdGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2ZvcicpIHx8IHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLW1kbC1mb3InKTtcbiAgICAgICAgICAgIHZhciBmb3JFbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChmb3JFbElkKSB7XG4gICAgICAgICAgICAgICAgZm9yRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmb3JFbElkKTtcbiAgICAgICAgICAgICAgICBpZiAoZm9yRWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yRWwuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRGb3JLZXlkb3duXyk7XG4gICAgICAgICAgICAgICAgICAgIGZvckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmJvdW5kRm9yQ2xpY2tfKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfID0gZm9yRWw7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke01hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5JVEVNfWApO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3Rlckl0ZW0oaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBZGQgcmlwcGxlIGNsYXNzZXMgdG8gZWFjaCBpdGVtLCBpZiB0aGUgdXNlciBoYXMgZW5hYmxlZCByaXBwbGVzLlxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uUklQUExFX0lHTk9SRV9FVkVOVFMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb3B5IGFsaWdubWVudCBjbGFzc2VzIHRvIHRoZSBjb250YWluZXIsIHNvIHRoZSBvdXRsaW5lIGNhbiB1c2UgdGhlbS5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uQk9UVE9NX0xFRlQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5CT1RUT01fTEVGVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLlRPUF9MRUZUKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uVE9QX0xFRlQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5UT1BfUklHSFQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5UT1BfUklHSFQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5VTkFMSUdORUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5VTkFMSUdORUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVySXRlbShpdGVtKSB7XG4gICAgICAgIC8vIEFkZCBhIHRhYiBpbmRleCB0byB0aGUgbWVudSBpdGVtLlxuICAgICAgICBpdGVtLnRhYkluZGV4ID0gJy0xJztcblxuICAgICAgICAvLyBBZGQgaW50ZXJhY3QgbGlzdGVuZXJzIHRvIHRoZSBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRJdGVtQ2xpY2tfKTtcbiAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZEl0ZW1LZXlkb3duXyk7XG5cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICAgICAgY29uc3QgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklURU1fUklQUExFX0NPTlRBSU5FUik7XG5cbiAgICAgICAgICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5SSVBQTEUpO1xuXG4gICAgICAgICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQocmlwcGxlKTtcbiAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQocmlwcGxlQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBhIGNsaWNrIG9uIHRoZSBcImZvclwiIGVsZW1lbnQsIGJ5IHBvc2l0aW9uaW5nIHRoZSBtZW51IGFuZCB0aGVuXG4gICAgICAgKiB0b2dnbGluZyBpdC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgaGFuZGxlRm9yQ2xpY2tfKGV2dCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmZvckVsZW1lbnRfKSB7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IHRoaXMuZm9yRWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgZm9yUmVjdCA9IHRoaXMuZm9yRWxlbWVudF8ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uQk9UVE9NX1JJR0hUKSkge1xuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIGJlbG93IHRoZSBcImZvclwiIGVsZW1lbnQsIGFsaWduZWQgdG8gaXRzIHJpZ2h0LlxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5yaWdodCA9IGAke2ZvclJlY3QucmlnaHQgLSByZWN0LnJpZ2h0fXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUudG9wID0gYCR7dGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRUb3AgKyB0aGlzLmZvckVsZW1lbnRfLm9mZnNldEhlaWdodH1weGA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5UT1BfTEVGVCkpIHtcbiAgICAgICAgICAgICAgICAvLyBQb3NpdGlvbiBhYm92ZSB0aGUgXCJmb3JcIiBlbGVtZW50LCBhbGlnbmVkIHRvIGl0cyBsZWZ0LlxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRMZWZ0fXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUuYm90dG9tID0gYCR7Zm9yUmVjdC5ib3R0b20gLSByZWN0LnRvcH1weGA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5UT1BfUklHSFQpKSB7XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gYWJvdmUgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgcmlnaHQuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnJpZ2h0ID0gYCR7Zm9yUmVjdC5yaWdodCAtIHJlY3QucmlnaHR9cHhgO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5ib3R0b20gPSBgJHtmb3JSZWN0LmJvdHRvbSAtIHJlY3QudG9wfXB4YDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdDogcG9zaXRpb24gYmVsb3cgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgbGVmdC5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUubGVmdCA9IGAke3RoaXMuZm9yRWxlbWVudF8ub2Zmc2V0TGVmdH1weGA7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnRvcCA9IGAke3RoaXMuZm9yRWxlbWVudF8ub2Zmc2V0VG9wICsgdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRIZWlnaHR9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9nZ2xlKGV2dCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBhIGtleWJvYXJkIGV2ZW50IG9uIHRoZSBcImZvclwiIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGhhbmRsZUZvcktleWJvYXJkRXZlbnRfKGV2dCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmNvbnRhaW5lcl8gJiYgdGhpcy5mb3JFbGVtZW50Xykge1xuICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKGAuJHtNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uSVRFTX06bm90KFtkaXNhYmxlZF0pYCk7XG4gICAgICAgICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5JU19WSVNJQkxFKSkge1xuICAgICAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gTWF0ZXJpYWxNZW51LktleWNvZGVzXy5VUF9BUlJPVykge1xuICAgICAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSBNYXRlcmlhbE1lbnUuS2V5Y29kZXNfLkRPV05fQVJST1cpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBhIGtleWJvYXJkIGV2ZW50IG9uIGFuIGl0ZW0uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50XyhldnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke01hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5JVEVNfTpub3QoW2Rpc2FibGVkXSlgKTtcbiAgICAgICAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwICYmIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKS5pbmRleE9mKGV2dC50YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gTWF0ZXJpYWxNZW51LktleWNvZGVzXy5VUF9BUlJPVykge1xuICAgICAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gTWF0ZXJpYWxNZW51LktleWNvZGVzXy5ET1dOX0FSUk9XKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gY3VycmVudEluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbY3VycmVudEluZGV4ICsgMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSBNYXRlcmlhbE1lbnUuS2V5Y29kZXNfLlNQQUNFIHx8IGV2dC5rZXlDb2RlID09PSBNYXRlcmlhbE1lbnUuS2V5Y29kZXNfLkVOVEVSKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZW5kIG1vdXNlZG93biBhbmQgbW91c2V1cCB0byB0cmlnZ2VyIHJpcHBsZS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgTW91c2VFdmVudCh3aW5kb3cuY2xpY2tFdnQpO1xuICAgICAgICAgICAgICAgICAgICBldnQudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBuZXcgTW91c2VFdmVudCh3aW5kb3cuY2xpY2tFdnQpO1xuICAgICAgICAgICAgICAgICAgICBldnQudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlbmQgY2xpY2suXG4gICAgICAgICAgICAgICAgICAgIGV2dC50YXJnZXQuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSBNYXRlcmlhbE1lbnUuS2V5Y29kZXNfLkVTQ0FQRSkge1xuICAgICAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBhIGNsaWNrIGV2ZW50IG9uIGFuIGl0ZW0uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGhhbmRsZUl0ZW1DbGlja18oZXZ0KSB7XG4gICAgICAgIGlmIChldnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2FpdCBzb21lIHRpbWUgYmVmb3JlIGNsb3NpbmcgbWVudSwgc28gdGhlIHVzZXIgY2FuIHNlZSB0aGUgcmlwcGxlLlxuICAgICAgICAgICAgdGhpcy5jbG9zaW5nXyA9IHRydWU7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoZXZ0Xykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2luZ18gPSBmYWxzZTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5Db25zdGFudF8uQ0xPU0VfVElNRU9VVCk7XG5cbiAgICAgICAgICAgIHRoaXMub25JdGVtU2VsZWN0ZWQoZXZ0LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgICAqIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIGFuIGl0ZW0gaXMgc2VsZWN0ZWQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MTElFbGVtZW50fSBvcHRpb24gVGhlIG9wdGlvbiB0aGF0IHdhcyBjbGlja2VkXG4gICAgICAgKi9cbiAgICBvbkl0ZW1TZWxlY3RlZChvcHRpb24pe3JldHVybjt9XG5cbiAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZXMgdGhlIGluaXRpYWwgY2xpcCAoZm9yIG9wZW5pbmcgdGhlIG1lbnUpIG9yIGZpbmFsIGNsaXAgKGZvciBjbG9zaW5nXG4gICAgICAgKiBpdCksIGFuZCBhcHBsaWVzIGl0LiBUaGlzIGFsbG93cyB1cyB0byBhbmltYXRlIGZyb20gb3IgdG8gdGhlIGNvcnJlY3QgcG9pbnQsXG4gICAgICAgKiB0aGF0IGlzLCB0aGUgcG9pbnQgaXQncyBhbGlnbmVkIHRvIGluIHRoZSBcImZvclwiIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBIZWlnaHQgb2YgdGhlIGNsaXAgcmVjdGFuZ2xlXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggV2lkdGggb2YgdGhlIGNsaXAgcmVjdGFuZ2xlXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgYXBwbHlDbGlwXyhoZWlnaHQsIHdpZHRoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgICAgICAgLy8gRG8gbm90IGNsaXAuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uQk9UVE9NX1JJR0hUKSkge1xuICAgICAgICAgICAgLy8gQ2xpcCB0byB0aGUgdG9wIHJpZ2h0IGNvcm5lciBvZiB0aGUgbWVudS5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9IGByZWN0KDAgJHt3aWR0aH1weCAwICR7d2lkdGh9cHgpYDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uVE9QX0xFRlQpKSB7XG4gICAgICAgICAgICAvLyBDbGlwIHRvIHRoZSBib3R0b20gbGVmdCBjb3JuZXIgb2YgdGhlIG1lbnUuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSBgcmVjdCgke2hlaWdodH1weCAwICR7aGVpZ2h0fXB4IDApYDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgICAgICAgLy8gQ2xpcCB0byB0aGUgYm90dG9tIHJpZ2h0IGNvcm5lciBvZiB0aGUgbWVudS5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9IGByZWN0KCR7aGVpZ2h0fXB4ICR7d2lkdGh9cHggJHtoZWlnaHR9cHggJHt3aWR0aH1weClgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRGVmYXVsdDogZG8gbm90IGNsaXAgKHNhbWUgYXMgY2xpcHBpbmcgdG8gdGhlIHRvcCBsZWZ0IGNvcm5lcikuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIENsZWFudXAgZnVuY3Rpb24gdG8gcmVtb3ZlIGFuaW1hdGlvbiBsaXN0ZW5lcnMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgcmVtb3ZlQW5pbWF0aW9uRW5kTGlzdGVuZXJfKGV2dCkge1xuICAgICAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byBjbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGVuZHMuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGFkZEFuaW1hdGlvbkVuZExpc3RlbmVyXygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy5yZW1vdmVBbmltYXRpb25FbmRMaXN0ZW5lcl8pO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCB0aGlzLnJlbW92ZUFuaW1hdGlvbkVuZExpc3RlbmVyXyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRGlzcGxheXMgdGhlIG1lbnUuXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgc2hvdyhldnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfICYmIHRoaXMub3V0bGluZV8pIHtcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICAgICAgLy8gQXBwbHkgdGhlIGlubmVyIGVsZW1lbnQncyBzaXplIHRvIHRoZSBjb250YWluZXIgYW5kIG91dGxpbmUuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgICAgIHRoaXMub3V0bGluZV8uc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICAgICB0aGlzLm91dGxpbmVfLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gdGhpcy5Db25zdGFudF8uVFJBTlNJVElPTl9EVVJBVElPTl9TRUNPTkRTICogdGhpcy5Db25zdGFudF8uVFJBTlNJVElPTl9EVVJBVElPTl9GUkFDVElPTjtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmFuc2l0aW9uIGRlbGF5cyBmb3IgaW5kaXZpZHVhbCBtZW51IGl0ZW1zLCBzbyB0aGF0IHRoZXkgZmFkZVxuICAgICAgICAgICAgLy8gaW4gb25lIGF0IGEgdGltZS5cbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbChgLiR7TWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklURU19YCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpXyA9IDA7IGlfIDwgaXRlbXMubGVuZ3RoOyBpXysrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1EZWxheSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5UT1BfTEVGVCkgfHwgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURlbGF5ID0gYCR7KGhlaWdodCAtIGl0ZW1zW2lfXS5vZmZzZXRUb3AgLSBpdGVtc1tpX10ub2Zmc2V0SGVpZ2h0KSAvIGhlaWdodCAqIHRyYW5zaXRpb25EdXJhdGlvbn1zYDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRGVsYXkgPSBgJHtpdGVtc1tpX10ub2Zmc2V0VG9wIC8gaGVpZ2h0ICogdHJhbnNpdGlvbkR1cmF0aW9ufXNgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtc1tpX10uc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gaXRlbURlbGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQXBwbHkgdGhlIGluaXRpYWwgY2xpcCB0byB0aGUgdGV4dCBiZWZvcmUgd2Ugc3RhcnQgYW5pbWF0aW5nLlxuICAgICAgICAgICAgdGhpcy5hcHBseUNsaXBfKGhlaWdodCwgd2lkdGgpO1xuICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIG5leHQgZnJhbWUsIHR1cm4gb24gYW5pbWF0aW9uLCBhbmQgYXBwbHkgdGhlIGZpbmFsIGNsaXAuXG4gICAgICAgICAgICAvLyBBbHNvIG1ha2UgaXQgdmlzaWJsZS4gVGhpcyB0cmlnZ2VycyB0aGUgdHJhbnNpdGlvbnMuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gYHJlY3QoMCAke3dpZHRofXB4ICR7aGVpZ2h0fXB4IDApYDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgICAgICAgIHRoaXMuYWRkQW5pbWF0aW9uRW5kTGlzdGVuZXJfKCk7XG4gICAgICAgICAgICAvLyBBZGQgYSBjbGljayBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQsIHRvIGNsb3NlIHRoZSBtZW51LlxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRvY3VtZW50IGlzIHByb2Nlc3NpbmcgdGhlIHNhbWUgZXZlbnQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGRpc3BsYXllZCB0aGUgbWVudSBpbiB0aGUgZmlyc3QgcGxhY2UuIElmIHNvLCBkbyBub3RoaW5nLlxuICAgICAgICAgICAgICAgIC8vIEFsc28gY2hlY2sgdG8gc2VlIGlmIHRoZSBtZW51IGlzIGluIHRoZSBwcm9jZXNzIG9mIGNsb3NpbmcgaXRzZWxmLCBhbmRcbiAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nIGluIHRoYXQgY2FzZS5cbiAgICAgICAgICAgICAgICAvLyBBbHNvIGNoZWNrIGlmIHRoZSBjbGlja2VkIGVsZW1lbnQgaXMgYSBtZW51IGl0ZW1cbiAgICAgICAgICAgICAgICAvLyBpZiBzbywgZG8gbm90aGluZy5cbiAgICAgICAgICAgICAgICBpZiAoZSAhPT0gZXZ0ICYmICF0aGlzLmNsb3NpbmdfICYmIGUudGFyZ2V0LnBhcmVudE5vZGUgIT09IHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEhpZGVzIHRoZSBtZW51LlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGhpZGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuY29udGFpbmVyXyAmJiB0aGlzLm91dGxpbmVfKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke01hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5JVEVNfWApO1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCB0cmFuc2l0aW9uIGRlbGF5czsgbWVudSBpdGVtcyBmYWRlIG91dCBjb25jdXJyZW50bHkuXG4gICAgICAgICAgICBmb3IgKHZhciBpX18gPSAwOyBpX18gPCBpdGVtcy5sZW5ndGg7IGlfXysrKSB7XG4gICAgICAgICAgICAgICAgaXRlbXNbaV9fXS5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbi1kZWxheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICAgICAgICAgIHZhciByZWN0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHJlY3Qud2lkdGg7XG4gICAgICAgICAgICAvLyBUdXJuIG9uIGFuaW1hdGlvbiwgYW5kIGFwcGx5IHRoZSBmaW5hbCBjbGlwLiBBbHNvIG1ha2UgaW52aXNpYmxlLlxuICAgICAgICAgICAgLy8gVGhpcyB0cmlnZ2VycyB0aGUgdHJhbnNpdGlvbnMuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxNZW51LmNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICAgICAgICB0aGlzLmFwcGx5Q2xpcF8oaGVpZ2h0LCB3aWR0aCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LnJlbW92ZShNYXRlcmlhbE1lbnUuY3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgICAgICAgdGhpcy5hZGRBbmltYXRpb25FbmRMaXN0ZW5lcl8oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIERpc3BsYXlzIG9yIGhpZGVzIHRoZSBtZW51LCBkZXBlbmRpbmcgb24gY3VycmVudCBzdGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICB0b2dnbGUoZXZ0KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTWVudS5jc3NDbGFzc2VzXy5JU19WSVNJQkxFKSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3coZXZ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgICAgICAqXG4gICAgICAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHtcbiAgICAgICAgLy8gVG90YWwgZHVyYXRpb24gb2YgdGhlIG1lbnUgYW5pbWF0aW9uLlxuICAgICAgICBUUkFOU0lUSU9OX0RVUkFUSU9OX1NFQ09ORFM6IDAuMyxcbiAgICAgICAgLy8gVGhlIGZyYWN0aW9uIG9mIHRoZSB0b3RhbCBkdXJhdGlvbiB3ZSB3YW50IHRvIHVzZSBmb3IgbWVudSBpdGVtIGFuaW1hdGlvbnMuXG4gICAgICAgIFRSQU5TSVRJT05fRFVSQVRJT05fRlJBQ1RJT046IDAuOCxcbiAgICAgICAgLy8gSG93IGxvbmcgdGhlIG1lbnUgc3RheXMgb3BlbiBhZnRlciBjaG9vc2luZyBhbiBvcHRpb24gKHNvIHRoZSB1c2VyIGNhbiBzZWVcbiAgICAgICAgLy8gdGhlIHJpcHBsZSkuXG4gICAgICAgIENMT1NFX1RJTUVPVVQ6IDE1MFxuICAgIH07XG4gICAgLyoqXG4gICAgKiBLZXljb2RlcywgZm9yIGNvZGUgcmVhZGFiaWxpdHkuXG4gICAgKlxuICAgICogQGVudW0ge251bWJlcn1cbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBzdGF0aWMgS2V5Y29kZXNfID0ge1xuICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgIEVTQ0FQRTogMjcsXG4gICAgICAgIFNQQUNFOiAzMixcbiAgICAgICAgVVBfQVJST1c6IDM4LFxuICAgICAgICBET1dOX0FSUk9XOiA0MFxuICAgIH07XG4gICAgLyoqXG4gICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAgKlxuICAgICogQGVudW0ge3N0cmluZ31cbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBzdGF0aWMgY3NzQ2xhc3Nlc18gPSB7XG4gICAgICAgIENPTlRBSU5FUjogJ21kbC1tZW51X19jb250YWluZXInLFxuICAgICAgICBPVVRMSU5FOiAnbWRsLW1lbnVfX291dGxpbmUnLFxuICAgICAgICBJVEVNOiAnbWRsLW1lbnVfX2l0ZW0nLFxuICAgICAgICBJVEVNX1JJUFBMRV9DT05UQUlORVI6ICdtZGwtbWVudV9faXRlbS1yaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICAgICAgUklQUExFX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cycsXG4gICAgICAgIFJJUFBMRTogJ21kbC1yaXBwbGUnLFxuICAgICAgICAvLyBTdGF0dXNlc1xuICAgICAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJyxcbiAgICAgICAgSVNfVklTSUJMRTogJ2lzLXZpc2libGUnLFxuICAgICAgICBJU19BTklNQVRJTkc6ICdpcy1hbmltYXRpbmcnLFxuICAgICAgICAvLyBBbGlnbm1lbnQgb3B0aW9uc1xuICAgICAgICBCT1RUT01fTEVGVDogJ21kbC1tZW51LS1ib3R0b20tbGVmdCcsXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQuXG4gICAgICAgIEJPVFRPTV9SSUdIVDogJ21kbC1tZW51LS1ib3R0b20tcmlnaHQnLFxuICAgICAgICBUT1BfTEVGVDogJ21kbC1tZW51LS10b3AtbGVmdCcsXG4gICAgICAgIFRPUF9SSUdIVDogJ21kbC1tZW51LS10b3AtcmlnaHQnLFxuICAgICAgICBVTkFMSUdORUQ6ICdtZGwtbWVudS0tdW5hbGlnbmVkJ1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsTWVudSddID0gTWF0ZXJpYWxNZW51O1xuLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4vLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsTWVudSxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxNZW51JyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1tZW51JyxcbiAgICB3aWRnZXQ6IHRydWVcbn0pO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFByb2dyZXNzIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxQcm9ncmVzcyB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkgeyBiYXNpY0NvbnN0cnVjdG9yKGVsZW1lbnQsIHRoaXMpOyB9XG4gICAgLyoqXG4gICAgICAgKiBTZXQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb2YgdGhlIHByb2dyZXNzYmFyLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwIFBlcmNlbnRhZ2Ugb2YgdGhlIHByb2dyZXNzICgwLTEwMClcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIHNldFByb2dyZXNzKHApIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY3NzQ2xhc3Nlc18uSU5ERVRFUk1JTkFURV9DTEFTUykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2dyZXNzYmFyXy5zdHlsZS53aWR0aCA9IGAke3B9JWA7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU2V0IHRoZSBjdXJyZW50IHByb2dyZXNzIG9mIHRoZSBidWZmZXIuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHAgUGVyY2VudGFnZSBvZiB0aGUgYnVmZmVyICgwLTEwMClcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIHNldEJ1ZmZlcihwKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyYmFyXy5zdHlsZS53aWR0aCA9IGAke3B9JWA7XG4gICAgICAgIHRoaXMuYXV4YmFyXy5zdHlsZS53aWR0aCA9IGAkezEwMCAtIHB9JWA7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gJ3Byb2dyZXNzYmFyIGJhciBiYXIxJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc2Jhcl8gPSBlbDtcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSAnYnVmZmVyYmFyIGJhciBiYXIyJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJiYXJfID0gZWw7XG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gJ2F1eGJhciBiYXIgYmFyMyc7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgICAgIHRoaXMuYXV4YmFyXyA9IGVsO1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc2Jhcl8uc3R5bGUud2lkdGggPSAnMCUnO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJiYXJfLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICAgICAgdGhpcy5hdXhiYXJfLnN0eWxlLndpZHRoID0gJzAlJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCgnaXMtdXBncmFkZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBDb25zdGFudF8gPSB7fTtcbiAgICAvKipcbiAgICAgICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgICAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAgICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGNzc0NsYXNzZXNfID0geyBJTkRFVEVSTUlOQVRFX0NMQVNTOiAnbWRsLXByb2dyZXNzX19pbmRldGVybWluYXRlJyB9O1xufVxud2luZG93WydNYXRlcmlhbFByb2dyZXNzJ10gPSBNYXRlcmlhbFByb2dyZXNzO1xuLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4vLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsUHJvZ3Jlc3MsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsUHJvZ3Jlc3MnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLXByb2dyZXNzJyxcbiAgICB3aWRnZXQ6IHRydWVcbn0pO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFJhZGlvIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxSYWRpbyB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkgeyBiYXNpY0NvbnN0cnVjdG9yKGVsZW1lbnQsIHRoaXMpOyB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgY2hhbmdlIG9mIHN0YXRlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIG9uQ2hhbmdlXyhldmVudCkge1xuICAgICAgICAvLyBTaW5jZSBvdGhlciByYWRpbyBidXR0b25zIGRvbid0IGdldCBjaGFuZ2UgZXZlbnRzLCB3ZSBuZWVkIHRvIGxvb2sgZm9yXG4gICAgICAgIC8vIHRoZW0gdG8gdXBkYXRlIHRoZWlyIGNsYXNzZXMuXG4gICAgICAgIHZhciByYWRpb3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuY3NzQ2xhc3Nlc18uSlNfUkFESU8pO1xuICAgICAgICBmb3IgKHZhciBpXyA9IDA7IGlfIDwgcmFkaW9zLmxlbmd0aDsgaV8rKykge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IHJhZGlvc1tpX10ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jc3NDbGFzc2VzXy5SQURJT19CVE59YCk7XG4gICAgICAgICAgICAvLyBEaWZmZXJlbnQgbmFtZSA9PSBkaWZmZXJlbnQgZ3JvdXAsIHNvIG5vIHBvaW50IHVwZGF0aW5nIHRob3NlLlxuICAgICAgICAgICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ25hbWUnKSA9PT0gdGhpcy5idG5FbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ25hbWUnKSAmJiB0eXBlb2YgcmFkaW9zW2lfXVsnTWF0ZXJpYWxSYWRpbyddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJhZGlvc1tpX11bJ01hdGVyaWFsUmFkaW8nXS51cGRhdGVDbGFzc2VzXygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGZvY3VzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIG9uRm9jdXNfKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEhhbmRsZSBsb3N0IGZvY3VzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIG9uQmx1cl8oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIG1vdXNldXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25Nb3VzZXVwXyhldmVudCkge1xuICAgICAgICB0aGlzLmJsdXJfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogVXBkYXRlIGNsYXNzZXMuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIHVwZGF0ZUNsYXNzZXNfKCkge1xuICAgICAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICAgICAgdGhpcy5jaGVja1RvZ2dsZVN0YXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogQWRkIGJsdXIuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGJsdXJfKCkge1xuICAgICAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoeSB0aGVyZSdzIGEgZm9jdXMgZXZlbnQgYmVpbmcgZmlyZWQgYWZ0ZXIgb3VyIGJsdXIsXG4gICAgICAgIC8vIHNvIHRoYXQgd2UgY2FuIGF2b2lkIHRoaXMgaGFjay5cbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5idG5FbGVtZW50Xy5ibHVyKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5Db25zdGFudF8uVElOWV9USU1FT1VUKTtcbiAgICB9XG4gICAgLy8gUHVibGljIG1ldGhvZHMuXG4gICAgLyoqXG4gICAgICAgKiBDaGVjayB0aGUgY29tcG9uZW50cyBkaXNhYmxlZCBzdGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjaGVja0Rpc2FibGVkKCkge1xuICAgICAgICBpZiAodGhpcy5idG5FbGVtZW50Xy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRElTQUJMRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRElTQUJMRUQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogQ2hlY2sgdGhlIGNvbXBvbmVudHMgdG9nZ2xlZCBzdGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjaGVja1RvZ2dsZVN0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5idG5FbGVtZW50Xy5jaGVja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19DSEVDS0VEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNzc0NsYXNzZXNfLklTX0NIRUNLRUQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRGlzYWJsZSByYWRpby5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBkaXNhYmxlKCkge1xuICAgICAgICB0aGlzLmJ0bkVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEVuYWJsZSByYWRpby5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBlbmFibGUoKSB7XG4gICAgICAgIHRoaXMuYnRuRWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIENoZWNrIHJhZGlvLlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGNoZWNrKCkge1xuICAgICAgICB0aGlzLmJ0bkVsZW1lbnRfLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlXyhudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBVbmNoZWNrIHJhZGlvLlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIHVuY2hlY2soKSB7XG4gICAgICAgIHRoaXMuYnRuRWxlbWVudF8uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlXyhudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgdGhpcy5idG5FbGVtZW50XyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jc3NDbGFzc2VzXy5SQURJT19CVE59YCk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kQ2hhbmdlSGFuZGxlcl8gPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZEZvY3VzSGFuZGxlcl8gPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZEJsdXJIYW5kbGVyXyA9IHRoaXMub25CbHVyXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyXyA9IHRoaXMub25Nb3VzZXVwXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG91dGVyQ2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgb3V0ZXJDaXJjbGUuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJBRElPX09VVEVSX0NJUkNMRSk7XG4gICAgICAgICAgICB2YXIgaW5uZXJDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBpbm5lckNpcmNsZS5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUkFESU9fSU5ORVJfQ0lSQ0xFKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSk7XG4gICAgICAgICAgICB2YXIgcmlwcGxlQ29udGFpbmVyO1xuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5SSVBQTEVfSUdOT1JFX0VWRU5UUyk7XG4gICAgICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9DRU5URVIpO1xuICAgICAgICAgICAgICAgIHJpcHBsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyXyk7XG4gICAgICAgICAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpcHBsZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZChyaXBwbGVDb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idG5FbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmJvdW5kQ2hhbmdlSGFuZGxlcl8pO1xuICAgICAgICAgICAgdGhpcy5idG5FbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuYm91bmRGb2N1c0hhbmRsZXJfKTtcbiAgICAgICAgICAgIHRoaXMuYnRuRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRCbHVySGFuZGxlcl8pO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyXyk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAgKlxuICAgICAgICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICBDb25zdGFudF8gPSB7IFRJTllfVElNRU9VVDogMC4wMDEgfTtcbiAgICAvKipcbiAgICAgICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICAgICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAgICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICAgICAgKlxuICAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICBjc3NDbGFzc2VzXyA9IHtcbiAgICAgICAgSVNfRk9DVVNFRDogJ2lzLWZvY3VzZWQnLFxuICAgICAgICBJU19ESVNBQkxFRDogJ2lzLWRpc2FibGVkJyxcbiAgICAgICAgSVNfQ0hFQ0tFRDogJ2lzLWNoZWNrZWQnLFxuICAgICAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJyxcbiAgICAgICAgSlNfUkFESU86ICdtZGwtanMtcmFkaW8nLFxuICAgICAgICBSQURJT19CVE46ICdtZGwtcmFkaW9fX2J1dHRvbicsXG4gICAgICAgIFJBRElPX09VVEVSX0NJUkNMRTogJ21kbC1yYWRpb19fb3V0ZXItY2lyY2xlJyxcbiAgICAgICAgUkFESU9fSU5ORVJfQ0lSQ0xFOiAnbWRsLXJhZGlvX19pbm5lci1jaXJjbGUnLFxuICAgICAgICBSSVBQTEVfRUZGRUNUOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgICAgICBSSVBQTEVfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcbiAgICAgICAgUklQUExFX0NPTlRBSU5FUjogJ21kbC1yYWRpb19fcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgIFJJUFBMRV9DRU5URVI6ICdtZGwtcmlwcGxlLS1jZW50ZXInLFxuICAgICAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJ1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsUmFkaW8nXSA9IE1hdGVyaWFsUmFkaW87XG5cbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFJhZGlvLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFJhZGlvJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1yYWRpbycsXG4gICAgd2lkZ2V0OiB0cnVlXG59KTtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBTbGlkZXIgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFNsaWRlciB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcbiAgICAgICAgLy8gQnJvd3NlciBmZWF0dXJlIGRldGVjdGlvbi5cbiAgICAgICAgdGhpcy5pc0lFXyA9IHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZDtcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGlucHV0IG9uIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25JbnB1dF8oZXZlbnQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgY2hhbmdlIG9uIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25DaGFuZ2VfKGV2ZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVTdHlsZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIG1vdXNldXAgb24gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBvbk1vdXNlVXBfKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5ibHVyKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIG1vdXNlZG93biBvbiBjb250YWluZXIgZWxlbWVudC5cbiAgICAgICAqIFRoaXMgaGFuZGxlciBpcyBwdXJwb3NlIGlzIHRvIG5vdCByZXF1aXJlIHRoZSB1c2UgdG8gY2xpY2tcbiAgICAgICAqIGV4YWN0bHkgb24gdGhlIDJweCBzbGlkZXIgZWxlbWVudCwgYXMgRmlyZUZveCBzZWVtcyB0byBiZSB2ZXJ5XG4gICAgICAgKiBzdHJpY3QgYWJvdXQgdGhpcy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAc3VwcHJlc3Mge21pc3NpbmdQcm9wZXJ0aWVzfVxuICAgICAgICovXG4gICAgb25Db250YWluZXJNb3VzZURvd25fKGV2ZW50KSB7XG4gICAgICAgIC8vIElmIHRoaXMgY2xpY2sgaXMgbm90IG9uIHRoZSBwYXJlbnQgZWxlbWVudCAoYnV0IHJhdGhlciBzb21lIGNoaWxkKVxuICAgICAgICAvLyBpZ25vcmUuIEl0IG1heSBzdGlsbCBidWJibGUgdXAuXG4gICAgICAgIGlmIChldmVudC50YXJnZXQgIT09IHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIERpc2NhcmQgdGhlIG9yaWdpbmFsIGV2ZW50IGFuZCBjcmVhdGUgYSBuZXcgZXZlbnQgdGhhdFxuICAgICAgICAvLyBpcyBvbiB0aGUgc2xpZGVyIGVsZW1lbnQuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBuZXdFdmVudCA9IG5ldyBNb3VzZUV2ZW50KHdpbmRvdy5jbGlja0V2dCwge1xuICAgICAgICAgICAgdGFyZ2V0OiBldmVudC50YXJnZXQsXG4gICAgICAgICAgICBidXR0b25zOiBldmVudC5idXR0b25zLFxuICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFk6IHRoaXMuZWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5kaXNwYXRjaEV2ZW50KG5ld0V2ZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgdXBkYXRpbmcgb2YgdmFsdWVzLlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICB1cGRhdGVWYWx1ZVN0eWxlc18oKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSBhbmQgYXBwbHkgcGVyY2VudGFnZXMgdG8gZGl2IHN0cnVjdHVyZSBiZWhpbmQgc2xpZGVyLlxuICAgICAgICB2YXIgZnJhY3Rpb24gPSAodGhpcy5lbGVtZW50Xy52YWx1ZSAtIHRoaXMuZWxlbWVudF8ubWluKSAvICh0aGlzLmVsZW1lbnRfLm1heCAtIHRoaXMuZWxlbWVudF8ubWluKTtcbiAgICAgICAgaWYgKGZyYWN0aW9uID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19MT1dFU1RfVkFMVUUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfTE9XRVNUX1ZBTFVFKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNJRV8pIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZExvd2VyXy5zdHlsZS5mbGV4ID0gZnJhY3Rpb247XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRMb3dlcl8uc3R5bGUud2Via2l0RmxleCA9IGZyYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kVXBwZXJfLnN0eWxlLmZsZXggPSAxIC0gZnJhY3Rpb247XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRVcHBlcl8uc3R5bGUud2Via2l0RmxleCA9IDEgLSBmcmFjdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBQdWJsaWMgbWV0aG9kcy5cbiAgICAvKipcbiAgICAgICAqIERpc2FibGUgc2xpZGVyLlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEVuYWJsZSBzbGlkZXIuXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogVXBkYXRlIHNsaWRlciB2YWx1ZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdoaWNoIHRvIHNldCB0aGUgY29udHJvbCAob3B0aW9uYWwpLlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgY2hhbmdlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNJRV8pIHtcbiAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBuZWVkIHRvIHNwZWNpZnkgYSB2ZXJ5IGxhcmdlIGhlaWdodCBpbiBJRSBkdWUgdG9cbiAgICAgICAgICAgICAgICAvLyBpbXBsZW1lbnRhdGlvbiBsaW1pdGF0aW9ucywgd2UgYWRkIGEgcGFyZW50IGhlcmUgdGhhdCB0cmltcyBpdCBkb3duIHRvXG4gICAgICAgICAgICAgICAgLy8gYSByZWFzb25hYmxlIHNpemUuXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lcklFID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVySUUuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLklFX0NPTlRBSU5FUik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjb250YWluZXJJRSwgdGhpcy5lbGVtZW50Xyk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcklFLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGb3Igbm9uLUlFIGJyb3dzZXJzLCB3ZSBuZWVkIGEgZGl2IHN0cnVjdHVyZSB0aGF0IHNpdHMgYmVoaW5kIHRoZVxuICAgICAgICAgICAgICAgIC8vIHNsaWRlciBhbmQgYWxsb3dzIHVzIHRvIHN0eWxlIHRoZSBsZWZ0IGFuZCByaWdodCBzaWRlcyBvZiBpdCB3aXRoXG4gICAgICAgICAgICAgICAgLy8gZGlmZmVyZW50IGNvbG9ycy5cbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5TTElERVJfQ09OVEFJTkVSKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lciwgdGhpcy5lbGVtZW50Xyk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgICAgICAgICB2YXIgYmFja2dyb3VuZEZsZXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kRmxleC5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uQkFDS0dST1VORF9GTEVYKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmFja2dyb3VuZEZsZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZExvd2VyXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZExvd2VyXy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uQkFDS0dST1VORF9MT1dFUik7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZEZsZXguYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kTG93ZXJfKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRVcHBlcl8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRVcHBlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLkJBQ0tHUk9VTkRfVVBQRVIpO1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRGbGV4LmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZFVwcGVyXyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJvdW5kSW5wdXRIYW5kbGVyID0gdGhpcy5vbklucHV0Xy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIgPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmJvdW5kQ29udGFpbmVyTW91c2VEb3duSGFuZGxlciA9IHRoaXMub25Db250YWluZXJNb3VzZURvd25fLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5ib3VuZElucHV0SGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuYm91bmRDaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRNb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRDb250YWluZXJNb3VzZURvd25IYW5kbGVyKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWVTdHlsZXNfKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgQ29uc3RhbnRfID0ge307XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICAgICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgICAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBjc3NDbGFzc2VzXyA9IHtcbiAgICAgICAgSUVfQ09OVEFJTkVSOiAnbWRsLXNsaWRlcl9faWUtY29udGFpbmVyJyxcbiAgICAgICAgU0xJREVSX0NPTlRBSU5FUjogJ21kbC1zbGlkZXJfX2NvbnRhaW5lcicsXG4gICAgICAgIEJBQ0tHUk9VTkRfRkxFWDogJ21kbC1zbGlkZXJfX2JhY2tncm91bmQtZmxleCcsXG4gICAgICAgIEJBQ0tHUk9VTkRfTE9XRVI6ICdtZGwtc2xpZGVyX19iYWNrZ3JvdW5kLWxvd2VyJyxcbiAgICAgICAgQkFDS0dST1VORF9VUFBFUjogJ21kbC1zbGlkZXJfX2JhY2tncm91bmQtdXBwZXInLFxuICAgICAgICBJU19MT1dFU1RfVkFMVUU6ICdpcy1sb3dlc3QtdmFsdWUnLFxuICAgICAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJ1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsU2xpZGVyJ10gPSBNYXRlcmlhbFNsaWRlcjtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFNsaWRlcixcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxTbGlkZXInLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLXNsaWRlcicsXG4gICAgd2lkZ2V0OiB0cnVlXG59KTtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFNuYWNrYmFyIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTbmFja2JhciB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy50ZXh0RWxlbWVudF8gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuY3NzQ2xhc3Nlc18uTUVTU0FHRX1gKTtcbiAgICAgICAgdGhpcy5hY3Rpb25FbGVtZW50XyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jc3NDbGFzc2VzXy5BQ1RJT059YCk7XG4gICAgICAgIGlmICghdGhpcy50ZXh0RWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgbXVzdCBiZSBhIG1lc3NhZ2UgZWxlbWVudCBmb3IgYSBzbmFja2Jhci4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuYWN0aW9uRWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgbXVzdCBiZSBhbiBhY3Rpb24gZWxlbWVudCBmb3IgYSBzbmFja2Jhci4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFjdGlvbkhhbmRsZXJfID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm1lc3NhZ2VfID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmFjdGlvblRleHRfID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnF1ZXVlZE5vdGlmaWNhdGlvbnNfID0gW107XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uSGlkZGVuXyh0cnVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBEaXNwbGF5IHRoZSBzbmFja2Jhci5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgZGlzcGxheVNuYWNrYmFyXygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uSGFuZGxlcl8pIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uRWxlbWVudF8udGV4dENvbnRlbnQgPSB0aGlzLmFjdGlvblRleHRfO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25FbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5hY3Rpb25IYW5kbGVyXyk7XG4gICAgICAgICAgICB0aGlzLnNldEFjdGlvbkhpZGRlbl8oZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEVsZW1lbnRfLnRleHRDb250ZW50ID0gdGhpcy5tZXNzYWdlXztcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uQUNUSVZFKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5jbGVhbnVwXy5iaW5kKHRoaXMpLCB0aGlzLnRpbWVvdXRfKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBTaG93IHRoZSBzbmFja2Jhci5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgZGF0YSBmb3IgdGhlIG5vdGlmaWNhdGlvbi5cbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIHNob3dTbmFja2JhcihkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBkYXRhIG9iamVjdCB3aXRoIGF0IGxlYXN0IGEgbWVzc2FnZSB0byBkaXNwbGF5LicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhWydtZXNzYWdlJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhWydhY3Rpb25IYW5kbGVyJ10gJiYgIWRhdGFbJ2FjdGlvblRleHQnXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhY3Rpb24gdGV4dCB3aXRoIHRoZSBoYW5kbGVyLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5xdWV1ZWROb3RpZmljYXRpb25zXy5wdXNoKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlXyA9IGRhdGFbJ21lc3NhZ2UnXTtcbiAgICAgICAgICAgIGlmIChkYXRhWyd0aW1lb3V0J10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRfID0gZGF0YVsndGltZW91dCddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRfID0gMjc1MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhWydhY3Rpb25IYW5kbGVyJ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbkhhbmRsZXJfID0gZGF0YVsnYWN0aW9uSGFuZGxlciddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGFbJ2FjdGlvblRleHQnXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uVGV4dF8gPSBkYXRhWydhY3Rpb25UZXh0J107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlTbmFja2Jhcl8oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIENoZWNrIGlmIHRoZSBxdWV1ZSBoYXMgaXRlbXMgd2l0aGluIGl0LlxuICAgICAgICogSWYgaXQgZG9lcywgZGlzcGxheSB0aGUgbmV4dCBlbnRyeS5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY2hlY2tRdWV1ZV8oKSB7XG4gICAgICAgIGlmICh0aGlzLnF1ZXVlZE5vdGlmaWNhdGlvbnNfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1NuYWNrYmFyKHRoaXMucXVldWVkTm90aWZpY2F0aW9uc18uc2hpZnQoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBDbGVhbnVwIHRoZSBzbmFja2JhciBldmVudCBsaXN0ZW5lcnMgYW5kIGFjY2Vzc2liaWxpdHkgYXR0cmlidXRlcy5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY2xlYW51cF8oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNzc0NsYXNzZXNfLkFDVElWRSk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRoaXMudGV4dEVsZW1lbnRfLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYWN0aW9uRWxlbWVudF8uZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb25IaWRkZW5fKHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uRWxlbWVudF8udGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbkVsZW1lbnRfLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LmNsaWNrRXZ0LCB0aGlzLmFjdGlvbkhhbmRsZXJfKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWN0aW9uSGFuZGxlcl8gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VfID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25UZXh0XyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNoZWNrUXVldWVfKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5Db25zdGFudF8uQU5JTUFUSU9OX0xFTkdUSCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU2V0IHRoZSBhY3Rpb24gaGFuZGxlciBoaWRkZW4gc3RhdGUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSB2YWx1ZVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIHNldEFjdGlvbkhpZGRlbl8odmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGlvbkVsZW1lbnRfLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25FbGVtZW50Xy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgQ29uc3RhbnRfID0ge1xuICAgICAgICAvLyBUaGUgZHVyYXRpb24gb2YgdGhlIHNuYWNrYmFyIHNob3cvaGlkZSBhbmltYXRpb24sIGluIG1zLlxuICAgICAgICBBTklNQVRJT05fTEVOR1RIOiAyNTBcbiAgICB9O1xuICAgIC8qKlxuICAgICAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAgICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAgICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY3NzQ2xhc3Nlc18gPSB7XG4gICAgICAgIFNOQUNLQkFSOiAnbWRsLXNuYWNrYmFyJyxcbiAgICAgICAgTUVTU0FHRTogJ21kbC1zbmFja2Jhcl9fdGV4dCcsXG4gICAgICAgIEFDVElPTjogJ21kbC1zbmFja2Jhcl9fYWN0aW9uJyxcbiAgICAgICAgQUNUSVZFOiAnbWRsLXNuYWNrYmFyLS1hY3RpdmUnXG4gICAgfTtcbn1cbndpbmRvd1snTWF0ZXJpYWxTbmFja2JhciddID0gTWF0ZXJpYWxTbmFja2Jhcjtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFNuYWNrYmFyLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFNuYWNrYmFyJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1zbmFja2JhcicsXG4gICAgd2lkZ2V0OiB0cnVlXG59KTtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBTcGlubmVyIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTcGlubmVyIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7IGJhc2ljQ29uc3RydWN0b3IoZWxlbWVudCwgdGhpcyk7IH1cbiAgICAvKipcbiAgICAgICAqIEF1eGlsaWFyeSBtZXRob2QgdG8gY3JlYXRlIGEgc3Bpbm5lciBsYXllci5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggb2YgdGhlIGxheWVyIHRvIGJlIGNyZWF0ZWQuXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjcmVhdGVMYXllcihpbmRleCkge1xuICAgICAgICB2YXIgbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGF5ZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLk1ETF9TUElOTkVSX0xBWUVSKTtcbiAgICAgICAgbGF5ZXIuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNzc0NsYXNzZXNfLk1ETF9TUElOTkVSX0xBWUVSfS0ke2luZGV4fWApO1xuICAgICAgICB2YXIgbGVmdENsaXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGVmdENsaXBwZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLk1ETF9TUElOTkVSX0NJUkNMRV9DTElQUEVSKTtcbiAgICAgICAgbGVmdENsaXBwZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLk1ETF9TUElOTkVSX0xFRlQpO1xuICAgICAgICB2YXIgZ2FwUGF0Y2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZ2FwUGF0Y2guY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLk1ETF9TUElOTkVSX0dBUF9QQVRDSCk7XG4gICAgICAgIHZhciByaWdodENsaXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcmlnaHRDbGlwcGVyLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5NRExfU1BJTk5FUl9DSVJDTEVfQ0xJUFBFUik7XG4gICAgICAgIHJpZ2h0Q2xpcHBlci5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uTURMX1NQSU5ORVJfUklHSFQpO1xuICAgICAgICB2YXIgY2lyY2xlT3duZXJzID0gW1xuICAgICAgICAgICAgbGVmdENsaXBwZXIsXG4gICAgICAgICAgICBnYXBQYXRjaCxcbiAgICAgICAgICAgIHJpZ2h0Q2xpcHBlclxuICAgICAgICBdO1xuICAgICAgICBmb3IgKHZhciBpXyA9IDA7IGlfIDwgY2lyY2xlT3duZXJzLmxlbmd0aDsgaV8rKykge1xuICAgICAgICAgICAgdmFyIGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5NRExfU1BJTk5FUl9DSVJDTEUpO1xuICAgICAgICAgICAgY2lyY2xlT3duZXJzW2lfXS5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICB9XG4gICAgICAgIGxheWVyLmFwcGVuZENoaWxkKGxlZnRDbGlwcGVyKTtcbiAgICAgICAgbGF5ZXIuYXBwZW5kQ2hpbGQoZ2FwUGF0Y2gpO1xuICAgICAgICBsYXllci5hcHBlbmRDaGlsZChyaWdodENsaXBwZXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKGxheWVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBTdG9wcyB0aGUgc3Bpbm5lciBhbmltYXRpb24uXG4gICAgICAgKiBQdWJsaWMgbWV0aG9kIGZvciB1c2VycyB3aG8gbmVlZCB0byBzdG9wIHRoZSBzcGlubmVyIGZvciBhbnkgcmVhc29uLlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RhcnRzIHRoZSBzcGlubmVyIGFuaW1hdGlvbi5cbiAgICAgICAqIFB1YmxpYyBtZXRob2QgZm9yIHVzZXJzIHdobyBuZWVkIHRvIG1hbnVhbGx5IHN0YXJ0IHRoZSBzcGlubmVyIGZvciBhbnkgcmVhc29uXG4gICAgICAgKiAoaW5zdGVhZCBvZiBqdXN0IGFkZGluZyB0aGUgJ2lzLWFjdGl2ZScgY2xhc3MgdG8gdGhlaXIgbWFya3VwKS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgZm9yICh2YXIgaV8gPSAxOyBpXyA8PSB0aGlzLkNvbnN0YW50Xy5NRExfU1BJTk5FUl9MQVlFUl9DT1VOVDsgaV8rKykge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTGF5ZXIoaV8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKCdpcy11cGdyYWRlZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHsgTURMX1NQSU5ORVJfTEFZRVJfQ09VTlQ6IDQgfTtcbiAgICAvKipcbiAgICAgICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgICAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAgICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGNzc0NsYXNzZXNfID0ge1xuICAgICAgICBNRExfU1BJTk5FUl9MQVlFUjogJ21kbC1zcGlubmVyX19sYXllcicsXG4gICAgICAgIE1ETF9TUElOTkVSX0NJUkNMRV9DTElQUEVSOiAnbWRsLXNwaW5uZXJfX2NpcmNsZS1jbGlwcGVyJyxcbiAgICAgICAgTURMX1NQSU5ORVJfQ0lSQ0xFOiAnbWRsLXNwaW5uZXJfX2NpcmNsZScsXG4gICAgICAgIE1ETF9TUElOTkVSX0dBUF9QQVRDSDogJ21kbC1zcGlubmVyX19nYXAtcGF0Y2gnLFxuICAgICAgICBNRExfU1BJTk5FUl9MRUZUOiAnbWRsLXNwaW5uZXJfX2xlZnQnLFxuICAgICAgICBNRExfU1BJTk5FUl9SSUdIVDogJ21kbC1zcGlubmVyX19yaWdodCdcbiAgICB9O1xufVxud2luZG93WydNYXRlcmlhbFNwaW5uZXInXSA9IE1hdGVyaWFsU3Bpbm5lcjtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFNwaW5uZXIsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsU3Bpbm5lcicsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtc3Bpbm5lcicsXG4gICAgd2lkZ2V0OiB0cnVlXG59KTtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBDaGVja2JveCBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuZXhwb3J0IGNsYXNzIE1hdGVyaWFsU3dpdGNoIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7IGJhc2ljQ29uc3RydWN0b3IoZWxlbWVudCwgdGhpcyk7IH1cbiAgICAvKipcbiAgICAgICAqIEhhbmRsZSBjaGFuZ2Ugb2Ygc3RhdGUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25DaGFuZ2VfKGV2ZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgZm9jdXMgb2YgZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBvbkZvY3VzXyhldmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgbG9zdCBmb2N1cyBvZiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIG9uQmx1cl8oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIG1vdXNldXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25Nb3VzZVVwXyhldmVudCkge1xuICAgICAgICB0aGlzLmJsdXJfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGNsYXNzIHVwZGF0ZXMuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIHVwZGF0ZUNsYXNzZXNfKCkge1xuICAgICAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICAgICAgdGhpcy5jaGVja1RvZ2dsZVN0YXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRGlzYWJsZSBzd2l0Y2guXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEVuYWJsZSBzd2l0Y2guXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEFjdGl2YXRlIHN3aXRjaC5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBvbigpIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRGVhY3RpdmF0ZSBzd2l0Y2guXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgb2ZmKCkge1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFbGVtZW50XyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jc3NDbGFzc2VzXy5JTlBVVH1gKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcihcXGAuJHt0aGlzLmNzc0NsYXNzZXNfLklOUFVUfVxcYCk7ID1gLCB0aGlzLmlucHV0RWxlbWVudF8pO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgdGhpcy5lbGVtZW50XyA9YCwgdGhpcy5lbGVtZW50Xyk7XG5cbiAgICAgICAgICAgIHZhciB0cmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdHJhY2suY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLlRSQUNLKTtcblxuICAgICAgICAgICAgdmFyIHRodW1iID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aHVtYi5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uVEhVTUIpO1xuXG4gICAgICAgICAgICB2YXIgZm9jdXNIZWxwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBmb2N1c0hlbHBlci5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uRk9DVVNfSEVMUEVSKTtcbiAgICAgICAgICAgIHRodW1iLmFwcGVuZENoaWxkKGZvY3VzSGVscGVyKTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZCh0cmFjayk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHRodW1iKTtcblxuICAgICAgICAgICAgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0lHTk9SRV9FVkVOVFMpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFX0NFTlRFUik7XG4gICAgICAgICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uUklQUExFKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmFwcGVuZENoaWxkKHJpcHBsZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZCh0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIgPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ib3VuZEZvY3VzSGFuZGxlciA9IHRoaXMub25Gb2N1c18uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRCbHVySGFuZGxlciA9IHRoaXMub25CbHVyXy5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5ib3VuZEZvY3VzSGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRCbHVySGFuZGxlcik7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRNb3VzZVVwSGFuZGxlcik7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKCdpcy11cGdyYWRlZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHsgVElOWV9USU1FT1VUOiAwLjAwMSB9O1xuICAgIC8qKlxuICAgICAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAgICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAgICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY3NzQ2xhc3Nlc18gPSB7XG4gICAgICAgIElOUFVUOiAnbWRsLXN3aXRjaF9faW5wdXQnLFxuICAgICAgICBUUkFDSzogJ21kbC1zd2l0Y2hfX3RyYWNrJyxcbiAgICAgICAgVEhVTUI6ICdtZGwtc3dpdGNoX190aHVtYicsXG4gICAgICAgIEZPQ1VTX0hFTFBFUjogJ21kbC1zd2l0Y2hfX2ZvY3VzLWhlbHBlcicsXG4gICAgICAgIFJJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgICAgIFJJUFBMRV9JR05PUkVfRVZFTlRTOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QtLWlnbm9yZS1ldmVudHMnLFxuICAgICAgICBSSVBQTEVfQ09OVEFJTkVSOiAnbWRsLXN3aXRjaF9fcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgIFJJUFBMRV9DRU5URVI6ICdtZGwtcmlwcGxlLS1jZW50ZXInLFxuICAgICAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICAgICAgSVNfRk9DVVNFRDogJ2lzLWZvY3VzZWQnLFxuICAgICAgICBJU19ESVNBQkxFRDogJ2lzLWRpc2FibGVkJyxcbiAgICAgICAgSVNfQ0hFQ0tFRDogJ2lzLWNoZWNrZWQnXG4gICAgfTtcbiAgICAvKipcbiAgICAgICAqIEFkZCBibHVyLlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBibHVyXyA9IE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLmJsdXJfO1xuICAgIC8vIFB1YmxpYyBtZXRob2RzLlxuICAgIC8qKlxuICAgICAgICogQ2hlY2sgdGhlIGNvbXBvbmVudHMgZGlzYWJsZWQgc3RhdGUuXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgY2hlY2tEaXNhYmxlZCA9IE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQ7XG4gICAgLyoqXG4gICAgICAgKiBDaGVjayB0aGUgY29tcG9uZW50cyB0b2dnbGVkIHN0YXRlLlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGNoZWNrVG9nZ2xlU3RhdGUgPSBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5jaGVja1RvZ2dsZVN0YXRlO1xufVxud2luZG93WydNYXRlcmlhbFN3aXRjaCddID0gTWF0ZXJpYWxTd2l0Y2g7XG4vLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbi8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG5jb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxTd2l0Y2gsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsU3dpdGNoJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1zd2l0Y2gnLFxuICAgIHdpZGdldDogdHJ1ZVxufSk7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgVGFicyBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxUYWJzIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgICAgIC8vIFN0b3JlcyB0aGUgSFRNTCBlbGVtZW50LlxuICAgICAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGNsaWNrcyB0byBhIHRhYnMgY29tcG9uZW50XG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGluaXRUYWJzXygpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY3NzQ2xhc3Nlc18uTURMX0pTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5NRExfSlNfUklQUExFX0VGRkVDVF9JR05PUkVfRVZFTlRTKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZWxlY3QgZWxlbWVudCB0YWJzLCBkb2N1bWVudCBwYW5lbHNcbiAgICAgICAgdGhpcy50YWJzXyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbChgLiR7dGhpcy5jc3NDbGFzc2VzXy5UQUJfQ0xBU1N9YCk7XG4gICAgICAgIHRoaXMucGFuZWxzXyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbChgLiR7dGhpcy5jc3NDbGFzc2VzXy5QQU5FTF9DTEFTU31gKTtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0YWJzIGZvciBlYWNoIHRhYiBlbGVtZW50XG4gICAgICAgIGZvciAodmFyIGlfID0gMDsgaV8gPCB0aGlzLnRhYnNfLmxlbmd0aDsgaV8rKykge1xuICAgICAgICAgICAgbmV3IE1hdGVyaWFsVGFiKHRoaXMudGFic19baV9dLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5VUEdSQURFRF9DTEFTUyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogUmVzZXQgdGFiIHN0YXRlLCBkcm9wcGluZyBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICByZXNldFRhYlN0YXRlXygpIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLnRhYnNfLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICB0aGlzLnRhYnNfW2tdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogUmVzZXQgcGFuZWwgc3RhdGUsIGRyb3BwaW5nIGFjdGl2ZSBjbGFzc2VzXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIHJlc2V0UGFuZWxTdGF0ZV8oKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5wYW5lbHNfLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc19bal0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNzc0NsYXNzZXNfLkFDVElWRV9DTEFTUyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgdGhpcy5pbml0VGFic18oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBDb25zdGFudF8gPSB7fTtcbiAgICAvKipcbiAgICAgICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgICAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAgICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGNzc0NsYXNzZXNfID0ge1xuICAgICAgICBUQUJfQ0xBU1M6ICdtZGwtdGFic19fdGFiJyxcbiAgICAgICAgUEFORUxfQ0xBU1M6ICdtZGwtdGFic19fcGFuZWwnLFxuICAgICAgICBBQ1RJVkVfQ0xBU1M6ICdpcy1hY3RpdmUnLFxuICAgICAgICBVUEdSQURFRF9DTEFTUzogJ2lzLXVwZ3JhZGVkJyxcbiAgICAgICAgTURMX0pTX1JJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgICAgIE1ETF9SSVBQTEVfQ09OVEFJTkVSOiAnbWRsLXRhYnNfX3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICBNRExfUklQUExFOiAnbWRsLXJpcHBsZScsXG4gICAgICAgIE1ETF9KU19SSVBQTEVfRUZGRUNUX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cydcbiAgICB9O1xufVxud2luZG93WydNYXRlcmlhbFRhYnMnXSA9IE1hdGVyaWFsVGFicztcbi8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYW4gaW5kaXZpZHVhbCB0YWIuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRhYiBUaGUgSFRNTCBlbGVtZW50IGZvciB0aGUgdGFiLlxuICAgKiBAcGFyYW0ge01hdGVyaWFsVGFic30gY3R4IFRoZSBNYXRlcmlhbFRhYnMgb2JqZWN0IHRoYXQgb3ducyB0aGUgdGFiLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFRhYntcbiAgICBjb25zdHJ1Y3Rvcih0YWIsIGN0eCkge1xuICAgICAgICBpZiAoIXRhYikgcmV0dXJuO1xuICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAodGFiLmdldEF0dHJpYnV0ZSgnaHJlZicpLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciBocmVmID0gdGFiLmhyZWYuc3BsaXQoJyMnKVsxXTtcbiAgICAgICAgICAgICAgICB2YXIgcGFuZWwgPSBjdHguZWxlbWVudF8ucXVlcnlTZWxlY3RvcihgIyR7ICBocmVmfWApO1xuICAgICAgICAgICAgICAgIGN0eC5yZXNldFRhYlN0YXRlXygpO1xuICAgICAgICAgICAgICAgIGN0eC5yZXNldFBhbmVsU3RhdGVfKCk7XG4gICAgICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5hZGQoY3R4LmNzc0NsYXNzZXNfLkFDVElWRV9DTEFTUyk7XG4gICAgICAgICAgICAgICAgcGFuZWwuY2xhc3NMaXN0LmFkZChjdHguY3NzQ2xhc3Nlc18uQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFjdHguZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKGN0eC5jc3NDbGFzc2VzXy5NRExfSlNfUklQUExFX0VGRkVDVCkpIHJldHVybjtcblxuICAgICAgICB2YXIgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChjdHguY3NzQ2xhc3Nlc18uTURMX1JJUFBMRV9DT05UQUlORVIpO1xuICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChjdHguY3NzQ2xhc3Nlc18uTURMX0pTX1JJUFBMRV9FRkZFQ1QpO1xuICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZChjdHguY3NzQ2xhc3Nlc18uTURMX1JJUFBMRSk7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyaXBwbGUpO1xuICAgICAgICB0YWIuYXBwZW5kQ2hpbGQocmlwcGxlQ29udGFpbmVyKTtcbiAgICB9XG59XG4vLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbi8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG5jb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxUYWJzLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFRhYnMnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLXRhYnMnXG59KTtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBUZXh0ZmllbGQgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFRleHRmaWVsZCB7XG4gICAgLyoqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gZWxlbWVudCAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMubWF4Um93cyA9IHRoaXMuQ29uc3RhbnRfLk5PX01BWF9ST1dTO1xuICAgICAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgaW5wdXQgYmVpbmcgZW50ZXJlZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBvbktleURvd25fKGV2ZW50KSB7XG4gICAgICAgIHZhciBjdXJyZW50Um93Q291bnQgPSBldmVudC50YXJnZXQudmFsdWUuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzICYmIGN1cnJlbnRSb3dDb3VudCA+PSB0aGlzLm1heFJvd3MpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgZm9jdXMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25Gb2N1c18oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGxvc3QgZm9jdXMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgb25CbHVyXyhldmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgcmVzZXQgZXZlbnQgZnJvbSBvdXQgc2lkZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBvblJlc2V0XyhldmVudCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIGNsYXNzIHVwZGF0ZXMuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIHVwZGF0ZUNsYXNzZXNfKCkge1xuICAgICAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICAgICAgdGhpcy5jaGVja1ZhbGlkaXR5KCk7XG4gICAgICAgIHRoaXMuY2hlY2tEaXJ0eSgpO1xuICAgICAgICB0aGlzLmNoZWNrRm9jdXMoKTtcbiAgICB9XG4gICAgLy8gUHVibGljIG1ldGhvZHMuXG4gICAgLyoqXG4gICAgICAgKiBDaGVjayB0aGUgZGlzYWJsZWQgc3RhdGUgYW5kIHVwZGF0ZSBmaWVsZCBhY2NvcmRpbmdseS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjaGVja0Rpc2FibGVkKCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dF8uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICogQ2hlY2sgdGhlIGZvY3VzIHN0YXRlIGFuZCB1cGRhdGUgZmllbGQgYWNjb3JkaW5nbHkuXG4gICAgICAqXG4gICAgICAqIEBwdWJsaWNcbiAgICAgICovXG4gICAgY2hlY2tGb2N1cygpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcignOmZvY3VzJykpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBDaGVjayB0aGUgdmFsaWRpdHkgc3RhdGUgYW5kIHVwZGF0ZSBmaWVsZCBhY2NvcmRpbmdseS5cbiAgICAgICAqXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICBjaGVja1ZhbGlkaXR5KCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dF8udmFsaWRpdHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0Xy52YWxpZGl0eS52YWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNzc0NsYXNzZXNfLklTX0lOVkFMSUQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19JTlZBTElEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIENoZWNrIHRoZSBkaXJ0eSBzdGF0ZSBhbmQgdXBkYXRlIGZpZWxkIGFjY29yZGluZ2x5LlxuICAgICAgICpcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGNoZWNrRGlydHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0Xy52YWx1ZSAmJiB0aGlzLmlucHV0Xy52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19ESVJUWSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19ESVJUWSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBEaXNhYmxlIHRleHQgZmllbGQuXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5pbnB1dF8uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogRW5hYmxlIHRleHQgZmllbGQuXG4gICAgICAgKlxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLmlucHV0Xy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogVXBkYXRlIHRleHQgZmllbGQgdmFsdWUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byB3aGljaCB0byBzZXQgdGhlIGNvbnRyb2wgKG9wdGlvbmFsKS5cbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgIGNoYW5nZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmlucHV0Xy52YWx1ZSA9IHZhbHVlIHx8ICcnO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWxfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLmNzc0NsYXNzZXNfLkxBQkVMfWApO1xuICAgICAgICAgICAgdGhpcy5pbnB1dF8gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuY3NzQ2xhc3Nlc18uSU5QVVR9YCk7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dF8pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dF8uaGFzQXR0cmlidXRlKHRoaXMuQ29uc3RhbnRfLk1BWF9ST1dTX0FUVFJJQlVURSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXhSb3dzID0gcGFyc2VJbnQodGhpcy5pbnB1dF8uZ2V0QXR0cmlidXRlKHRoaXMuQ29uc3RhbnRfLk1BWF9ST1dTX0FUVFJJQlVURSksIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHRoaXMubWF4Um93cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF4Um93cyA9IHRoaXMuQ29uc3RhbnRfLk5PX01BWF9ST1dTO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0Xy5oYXNBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSEFTX1BMQUNFSE9MREVSKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZFVwZGF0ZUNsYXNzZXNIYW5kbGVyID0gdGhpcy51cGRhdGVDbGFzc2VzXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRGb2N1c0hhbmRsZXIgPSB0aGlzLm9uRm9jdXNfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZEJsdXJIYW5kbGVyID0gdGhpcy5vbkJsdXJfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZFJlc2V0SGFuZGxlciA9IHRoaXMub25SZXNldF8uYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuYm91bmRVcGRhdGVDbGFzc2VzSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dF8uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmJvdW5kRm9jdXNIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5ib3VuZEJsdXJIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIHRoaXMuYm91bmRSZXNldEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heFJvd3MgIT09IHRoaXMuQ29uc3RhbnRfLk5PX01BWF9ST1dTKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFRoaXMgc2hvdWxkIGhhbmRsZSBwYXN0aW5nIG11bHRpIGxpbmUgdGV4dC5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5IGRvZXNuJ3QuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm91bmRLZXlEb3duSGFuZGxlciA9IHRoaXMub25LZXlEb3duXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZEtleURvd25IYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGludmFsaWQgPSB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLklTX0lOVkFMSUQpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgICAgICAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfSU5WQUxJRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0Xy5oYXNBdHRyaWJ1dGUoJ2F1dG9mb2N1cycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHtcbiAgICAgICAgTk9fTUFYX1JPV1M6IC0xLFxuICAgICAgICBNQVhfUk9XU19BVFRSSUJVVEU6ICdtYXhyb3dzJ1xuICAgIH07XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICAgICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgICAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBjc3NDbGFzc2VzXyA9IHtcbiAgICAgICAgTEFCRUw6ICdtZGwtdGV4dGZpZWxkX19sYWJlbCcsXG4gICAgICAgIElOUFVUOiAnbWRsLXRleHRmaWVsZF9faW5wdXQnLFxuICAgICAgICBJU19ESVJUWTogJ2lzLWRpcnR5JyxcbiAgICAgICAgSVNfRk9DVVNFRDogJ2lzLWZvY3VzZWQnLFxuICAgICAgICBJU19ESVNBQkxFRDogJ2lzLWRpc2FibGVkJyxcbiAgICAgICAgSVNfSU5WQUxJRDogJ2lzLWludmFsaWQnLFxuICAgICAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJyxcbiAgICAgICAgSEFTX1BMQUNFSE9MREVSOiAnaGFzLXBsYWNlaG9sZGVyJ1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsVGV4dGZpZWxkJ10gPSBNYXRlcmlhbFRleHRmaWVsZDtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFRleHRmaWVsZCxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxUZXh0ZmllbGQnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLXRleHRmaWVsZCcsXG4gICAgd2lkZ2V0OiB0cnVlXG59KTtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBUb29sdGlwIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxUb29sdGlwIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7IGJhc2ljQ29uc3RydWN0b3IoZWxlbWVudCwgdGhpcyk7IH1cbiAgICAvKipcbiAgICAgICAqIEhhbmRsZSBtb3VzZWVudGVyIGZvciB0b29sdGlwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGhhbmRsZU1vdXNlRW50ZXJfKGV2ZW50KSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHRvcCA9IHByb3BzLnRvcCArIHByb3BzLmhlaWdodCAvIDI7XG4gICAgICAgIHZhciBsZWZ0ID0gKHByb3BzLmxlZnQgKyBwcm9wcy53aWR0aCAvIDIpIC0gMjU2O1xuICAgICAgICB2YXIgbWFyZ2luTGVmdCA9IC0xICogKHRoaXMuZWxlbWVudF8ub2Zmc2V0V2lkdGggLyAyKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGBbQkNELU1hdGVyaWFsLkRlYnVnXSB3aW5kb3cuaW5uZXJXaWR0aDogJHt3aW5kb3cuaW5uZXJXaWR0aH0sIHVzZSBkZXNrdG9wIGxheW91dDogJHt3aW5kb3cuaW5uZXJXaWR0aCA+PSAxMDI1fWApO1xuICAgICAgICAvLyBNb2RpZmljYXRpb24gYnkgQmVsbEN1YmUgdG8gYWRqdXN0IGZvciB0aGUgbmF2aWdhdGlvbiBkcmF3ZXJcblxuICAgICAgICBpZiAobGVmdCArIG1hcmdpbkxlZnQgPCAxNikgbWFyZ2luTGVmdCArPSBNYXRoLmFicygxNiAtIChsZWZ0ICsgbWFyZ2luTGVmdCkpO1xuXG4gICAgICAgIHZhciBtYXJnaW5Ub3AgPSAtMSAqICh0aGlzLmVsZW1lbnRfLm9mZnNldEhlaWdodCAvIDIpO1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jc3NDbGFzc2VzXy5MRUZUKSB8fCB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLlJJR0hUKSkge1xuICAgICAgICAgICAgbGVmdCA9IHByb3BzLndpZHRoIC8gMjtcbiAgICAgICAgICAgIGlmICh0b3AgKyBtYXJnaW5Ub3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSAnMCc7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLm1hcmdpblRvcCA9IGAke21hcmdpblRvcH1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobGVmdCArIG1hcmdpbkxlZnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUubWFyZ2luTGVmdCA9ICcwJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7bWFyZ2luTGVmdH1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY3NzQ2xhc3Nlc18uVE9QKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSBgJHtwcm9wcy50b3AgLSB0aGlzLmVsZW1lbnRfLm9mZnNldEhlaWdodCAtIDEwfXB4YDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLlJJR0hUKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5sZWZ0ID0gYCR7cHJvcHMubGVmdCArIHByb3BzLndpZHRoICsgMTB9cHhgO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY3NzQ2xhc3Nlc18uTEVGVCkpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUubGVmdCA9IGAke3Byb3BzLmxlZnQgLSB0aGlzLmVsZW1lbnRfLm9mZnNldFdpZHRoIC0gMTB9cHhgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSBgJHtwcm9wcy50b3AgKyBwcm9wcy5oZWlnaHQgKyAxMH1weGA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEhpZGUgdG9vbHRpcCBvbiBtb3VzZWxlYXZlIG9yIHNjcm9sbFxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBoaWRlVG9vbHRpcF8oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgIHZhciBmb3JFbElkID0gdGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2ZvcicpIHx8IHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLW1kbC1mb3InKTtcbiAgICAgICAgICAgIGlmIChmb3JFbElkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50XyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZvckVsSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZm9yRWxlbWVudF8pIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGxlZnQgaGVyZSBiZWNhdXNlIGl0IHByZXZlbnRzIGFjY2lkZW50YWwgdGV4dCBzZWxlY3Rpb24gb24gQW5kcm9pZFxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5mb3JFbGVtZW50Xy5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZE1vdXNlRW50ZXJIYW5kbGVyID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRNb3VzZUxlYXZlQW5kU2Nyb2xsSGFuZGxlciA9IHRoaXMuaGlkZVRvb2x0aXBfLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5ib3VuZE1vdXNlRW50ZXJIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuYm91bmRNb3VzZUVudGVySGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuYm91bmRNb3VzZUxlYXZlQW5kU2Nyb2xsSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJvdW5kTW91c2VMZWF2ZUFuZFNjcm9sbEhhbmRsZXIsIHRydWUpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5ib3VuZE1vdXNlTGVhdmVBbmRTY3JvbGxIYW5kbGVyLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgQ29uc3RhbnRfID0ge307XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICAgICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgICAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBjc3NDbGFzc2VzXyA9IHtcbiAgICAgICAgSVNfQUNUSVZFOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgQk9UVE9NOiAnbWRsLXRvb2x0aXAtLWJvdHRvbScsXG4gICAgICAgIExFRlQ6ICdtZGwtdG9vbHRpcC0tbGVmdCcsXG4gICAgICAgIFJJR0hUOiAnbWRsLXRvb2x0aXAtLXJpZ2h0JyxcbiAgICAgICAgVE9QOiAnbWRsLXRvb2x0aXAtLXRvcCdcbiAgICB9O1xufVxud2luZG93WydNYXRlcmlhbFRvb2x0aXAnXSA9IE1hdGVyaWFsVG9vbHRpcDtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFRvb2x0aXAsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsVG9vbHRpcCcsXG4gICAgY3NzQ2xhc3M6ICdtZGwtdG9vbHRpcCdcbn0pO1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIExheW91dCBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuZXhwb3J0IGNsYXNzIE1hdGVyaWFsTGF5b3V0IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7IGJhc2ljQ29uc3RydWN0b3IoZWxlbWVudCwgdGhpcyk7IH1cbiAgICAvKipcbiAgICAgICAqIEhhbmRsZXMgc2Nyb2xsaW5nIG9uIHRoZSBjb250ZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBjb250ZW50U2Nyb2xsSGFuZGxlcl8oKSB7XG4gICAgICAgIGlmICh0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfQU5JTUFUSU5HKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoZWFkZXJWaXNpYmxlID0gIXRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfU01BTExfU0NSRUVOKSB8fCB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkZJWEVEX0hFQURFUik7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRfLnNjcm9sbFRvcCA+IDAgJiYgIXRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19DT01QQUNUKSkge1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5DQVNUSU5HX1NIQURPVyk7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0NPTVBBQ1QpO1xuICAgICAgICAgICAgaWYgKGhlYWRlclZpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0FOSU1BVElORyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250ZW50Xy5zY3JvbGxUb3AgPD0gMCAmJiB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfQ09NUEFDVCkpIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5yZW1vdmUoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19DT01QQUNUKTtcbiAgICAgICAgICAgIGlmIChoZWFkZXJWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19BTklNQVRJTkcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBhIGtleWJvYXJkIGV2ZW50IG9uIHRoZSBkcmF3ZXIuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAga2V5Ym9hcmRFdmVudEhhbmRsZXJfKGV2dCkge1xuICAgICAgICAvLyBPbmx5IHJlYWN0IHdoZW4gdGhlIGRyYXdlciBpcyBvcGVuLlxuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkVTQ0FQRSAmJiB0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfRFJBV0VSX09QRU4pKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZURyYXdlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBjaGFuZ2VzIGluIHNjcmVlbiBzaXplLlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBzY3JlZW5TaXplSGFuZGxlcl8oKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcmVlblNpemVNZWRpYVF1ZXJ5Xy5tYXRjaGVzKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19TTUFMTF9TQ1JFRU4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfU01BTExfU0NSRUVOKTtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIGRyYXdlciAoaWYgYW55KSB3aGVuIG1vdmluZyB0byBhIGxhcmdlIHNjcmVlbiBzaXplLlxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhd2VyXykge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfRFJBV0VSX09QRU4pO1xuICAgICAgICAgICAgICAgIHRoaXMub2JmdXNjYXRvcl8uY2xhc3NMaXN0LnJlbW92ZShNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0RSQVdFUl9PUEVOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIEhhbmRsZXMgZXZlbnRzIG9mIGRyYXdlciBidXR0b24uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGRyYXdlclRvZ2dsZUhhbmRsZXJfKGV2dCkge1xuXG4gICAgICAgIGlmIChldnQgJiYgZXZ0LnR5cGUgPT09ICdrZXlkb3duJykge1xuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5TUEFDRSB8fCBldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRU5URVIpIHtcbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IHNjcm9sbGluZyBpbiBkcmF3ZXIgbmF2XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgb3RoZXIga2V5c1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlRHJhd2VyKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyAodW4pc2V0dGluZyB0aGUgYGlzLWFuaW1hdGluZ2AgY2xhc3NcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgaGVhZGVyVHJhbnNpdGlvbkVuZEhhbmRsZXJfKCkge1xuICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZShNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0FOSU1BVElORyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlcyBleHBhbmRpbmcgdGhlIGhlYWRlciBvbiBjbGlja1xuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBoZWFkZXJDbGlja0hhbmRsZXJfKCkge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0NPTVBBQ1QpKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZShNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0NPTVBBQ1QpO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19BTklNQVRJTkcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogUmVzZXQgdGFiIHN0YXRlLCBkcm9wcGluZyBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICByZXNldFRhYlN0YXRlXyh0YWJCYXIpIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0YWJCYXIubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIHRhYkJhcltrXS5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfQUNUSVZFKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIFJlc2V0IHBhbmVsIHN0YXRlLCBkcm9wcGluZyBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICByZXNldFBhbmVsU3RhdGVfKHBhbmVscykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhbmVscy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcGFuZWxzW2pdLmNsYXNzTGlzdC5yZW1vdmUoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19BQ1RJVkUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgKiBUb2dnbGUgZHJhd2VyIHN0YXRlXG4gICAgICAqXG4gICAgICAqIEBwdWJsaWNcbiAgICAgICovXG4gICAgdG9nZ2xlRHJhd2VyKCkge1xuICAgICAgICB0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LnRvZ2dsZShNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0RSQVdFUl9PUEVOKTtcbiAgICAgICAgdGhpcy5vYmZ1c2NhdG9yXy5jbGFzc0xpc3QudG9nZ2xlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfRFJBV0VSX09QRU4pO1xuICAgICAgICAvLyBTZXQgYWNjZXNzaWJpbGl0eSBwcm9wZXJ0aWVzLlxuICAgICAgICBpZiAodGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0RSQVdFUl9PUEVOKSkgdGhpcy5vcGVuRHJhd2VyKGZhbHNlKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlRHJhd2VyKGZhbHNlKTtcbiAgICB9XG5cbiAgICBvcGVuRHJhd2VyKGRvTmV3Q2xhc3MgPSB0cnVlKSB7XG4gICAgICAgIGlmIChkb05ld0NsYXNzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0RSQVdFUl9PUEVOKSkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19EUkFXRVJfT1BFTik7XG4gICAgICAgICAgICB0aGlzLm9iZnVzY2F0b3JfLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19EUkFXRVJfT1BFTik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkcmF3ZXJFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnZHJhd2VyT3BlbicsIHtidWJibGVzOiB0cnVlfSk7XG4gICAgICAgIHRoaXMuZHJhd2VyXy5kaXNwYXRjaEV2ZW50KGRyYXdlckV2ZW50KTtcblxuICAgICAgICB2YXIgZHJhd2VyQnV0dG9uID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKGAuJHtNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkRSQVdFUl9CVE59YCk7XG4gICAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgIGNvbnN0IGVsZW1Ub0ZvY3VzTmV4dFNpYmxpbmcgPSB0aGlzLmRyYXdlcl8ucXVlcnlTZWxlY3RvcignLm1kbC1uYXZpZ2F0aW9uX19saW5rJyk7XG4gICAgICAgIGlmIChlbGVtVG9Gb2N1c05leHRTaWJsaW5nICYmIGVsZW1Ub0ZvY3VzTmV4dFNpYmxpbmcucHJldmlvdXNTaWJsaW5nICYmIGVsZW1Ub0ZvY3VzTmV4dFNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZy5mb2N1cyl7XG4gICAgICAgICAgICBlbGVtVG9Gb2N1c05leHRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICAgICAgICBlbGVtVG9Gb2N1c05leHRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZm9jdXMoe3ByZXZlbnRTY3JvbGw6dHJ1ZX0pO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge2VsZW1Ub0ZvY3VzTmV4dFNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZy5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7fSk7fSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJ1aCByb2ghIE5vIGZvY3VzYWJsZSBlbGVtZW50cyBpbiB0aGUgZHJhd2VyIVwiLCBlbGVtVG9Gb2N1c05leHRTaWJsaW5nLCBlbGVtVG9Gb2N1c05leHRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xuICAgIH1cblxuICAgIGNsb3NlRHJhd2VyKGRvTmV3Q2xhc3MgPSB0cnVlKSB7XG4gICAgICAgIGlmIChkb05ld0NsYXNzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhd2VyXy5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19EUkFXRVJfT1BFTikpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfRFJBV0VSX09QRU4pO1xuICAgICAgICAgICAgdGhpcy5vYmZ1c2NhdG9yXy5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfRFJBV0VSX09QRU4pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJhd2VyRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2RyYXdlckNsb3NlJywge2J1YmJsZXM6IHRydWV9KTtcbiAgICAgICAgdGhpcy5kcmF3ZXJfLmRpc3BhdGNoRXZlbnQoZHJhd2VyRXZlbnQpO1xuXG4gICAgICAgIHZhciBkcmF3ZXJCdXR0b24gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoYC4ke01hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuRFJBV0VSX0JUTn1gKTtcbiAgICAgICAgZHJhd2VyQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICBkcmF3ZXJCdXR0b24uZm9jdXMoe3ByZXZlbnRTY3JvbGw6dHJ1ZX0pO1xuXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmF3ZXItaW5pdC1vcGVuJyk7XG4gICAgICAgIHdpbmRvdy5zdGFydFdpdGhEcmF3ZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudF8pIHJldHVybjtcbiAgICAgICAgd2luZG93LmxheW91dCA9IHRoaXM7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5DT05UQUlORVIpO1xuICAgICAgICB2YXIgZm9jdXNlZEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lciwgdGhpcy5lbGVtZW50Xyk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgICBpZiAoZm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRpcmVjdENoaWxkcmVuID0gdGhpcy5lbGVtZW50Xy5jaGlsZE5vZGVzO1xuICAgICAgICB2YXIgbnVtQ2hpbGRyZW4gPSBkaXJlY3RDaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgbnVtQ2hpbGRyZW47IGMrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gZGlyZWN0Q2hpbGRyZW5bY107XG4gICAgICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkhFQURFUikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlcl8gPSBjaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGlsZC5jbGFzc0xpc3QgJiYgY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuRFJBV0VSKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd2VyXyA9IGNoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoaWxkLmNsYXNzTGlzdCAmJiBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5DT05URU5UKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudF8gPSBjaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGUucGVyc2lzdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBwYWdlIGlzIGxvYWRlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZVxuICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgcmVwYWludCB0byBsZXQgbGF5b3V0IHNjcm9sbCBpbiBzYWZhcmlcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUub3ZlcmZsb3dZID0gJyc7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGlmICh0aGlzLmhlYWRlcl8pIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyXyA9IHRoaXMuaGVhZGVyXy5xdWVyeVNlbGVjdG9yKGAuJHtNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLlRBQl9CQVJ9YCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vZGUgPSB0aGlzLk1vZGVfLlNUQU5EQVJEO1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJfKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkhFQURFUl9TRUFNRUQpKSB7XG4gICAgICAgICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uU0VBTUVEO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSEVBREVSX1dBVEVSRkFMTCkpIHtcbiAgICAgICAgICAgICAgICBtb2RlID0gdGhpcy5Nb2RlXy5XQVRFUkZBTEw7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJfLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLmhlYWRlclRyYW5zaXRpb25FbmRIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlcl8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuaGVhZGVyQ2xpY2tIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyhNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkhFQURFUl9TQ1JPTEwpKSB7XG4gICAgICAgICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uU0NST0xMO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSEFTX1NDUk9MTElOR19IRUFERVIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vZGUgPT09IHRoaXMuTW9kZV8uU1RBTkRBUkQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWJCYXJfKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiQmFyXy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gdGhpcy5Nb2RlXy5TRUFNRUQgfHwgbW9kZSA9PT0gdGhpcy5Nb2RlXy5TQ1JPTEwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZShNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWJCYXJfKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiQmFyXy5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gdGhpcy5Nb2RlXy5XQVRFUkZBTEwpIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW5kIHJlbW92ZSBzaGFkb3dzIGRlcGVuZGluZyBvbiBzY3JvbGwgcG9zaXRpb24uXG4gICAgICAgICAgICAgICAgLy8gQWxzbyBhZGQvcmVtb3ZlIGF1eGlsaWFyeSBjbGFzcyBmb3Igc3R5bGluZyBvZiB0aGUgY29tcGFjdCB2ZXJzaW9uIG9mXG4gICAgICAgICAgICAgICAgLy8gdGhlIGhlYWRlci5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuY29udGVudFNjcm9sbEhhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFNjcm9sbEhhbmRsZXJfKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGRyYXdlciB0b2dnbGluZyBidXR0b24gdG8gb3VyIGxheW91dCwgaWYgd2UgaGF2ZSBhbiBvcGVuYWJsZSBkcmF3ZXIuXG4gICAgICAgIGlmICh0aGlzLmRyYXdlcl8pIHtcbiAgICAgICAgICAgIHZhciBkcmF3ZXJCdXR0b24gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoYC4ke01hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuRFJBV0VSX0JUTn1gKTtcbiAgICAgICAgICAgIGlmICghZHJhd2VyQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICAgICAgICAgIGRyYXdlckJ1dHRvbi5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuRFJBV0VSX0JUTik7XG4gICAgICAgICAgICAgICAgdmFyIGRyYXdlckJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uSWNvbi5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSUNPTik7XG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uSWNvbi5pbm5lckhUTUwgPSB0aGlzLkNvbnN0YW50Xy5NRU5VX0lDT047XG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uLmFwcGVuZENoaWxkKGRyYXdlckJ1dHRvbkljb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0aXRsZUVsZW1lbnQgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0LXRpdGxlJyk7XG4gICAgICAgICAgICAvL2NvbnNvbGUuZGVidWcoJ3RpdGxlRWxlbWVudCcsIHRpdGxlRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAodGl0bGVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGl0bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcbiAgICAgICAgICAgICAgICB0aXRsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgICAgIHRpdGxlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgdGhpcy5kcmF3ZXJUb2dnbGVIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aXRsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuT05fTEFSR0VfU0NSRUVOKSkge1xuICAgICAgICAgICAgICAgIC8vSWYgZHJhd2VyIGhhcyBPTl9MQVJHRV9TQ1JFRU4gY2xhc3MgdGhlbiBhZGQgaXQgdG8gdGhlIGRyYXdlciB0b2dnbGUgYnV0dG9uIGFzIHdlbGwuXG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5PTl9MQVJHRV9TQ1JFRU4pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuT05fU01BTExfU0NSRUVOKSkge1xuICAgICAgICAgICAgICAgIC8vSWYgZHJhd2VyIGhhcyBPTl9TTUFMTF9TQ1JFRU4gY2xhc3MgdGhlbiBhZGQgaXQgdG8gdGhlIGRyYXdlciB0b2dnbGUgYnV0dG9uIGFzIHdlbGwuXG4gICAgICAgICAgICAgICAgZHJhd2VyQnV0dG9uLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5PTl9TTUFMTF9TQ1JFRU4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIGEgY2xhc3MgaWYgdGhlIGxheW91dCBoYXMgYSBkcmF3ZXIsIGZvciBhbHRlcmluZyB0aGUgbGVmdCBwYWRkaW5nLlxuICAgICAgICAgICAgLy8gQWRkcyB0aGUgSEFTX0RSQVdFUiB0byB0aGUgZWxlbWVudHMgc2luY2UgdGhpcy5oZWFkZXJfIG1heSBvciBtYXlcbiAgICAgICAgICAgIC8vIG5vdCBiZSBwcmVzZW50LlxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSEFTX0RSQVdFUik7XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgZml4ZWQgaGVhZGVyLCBhZGQgdGhlIGJ1dHRvbiB0byB0aGUgaGVhZGVyIHJhdGhlciB0aGFuXG4gICAgICAgICAgICAvLyB0aGUgbGF5b3V0LlxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuRklYRURfSEVBREVSKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyXy5pbnNlcnRCZWZvcmUoZHJhd2VyQnV0dG9uLCB0aGlzLmhlYWRlcl8uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uaW5zZXJ0QmVmb3JlKGRyYXdlckJ1dHRvbiwgdGhpcy5jb250ZW50Xyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub2JmdXNjYXRvcl8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fb2JmdXNjYXRvcicpID8/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5vYmZ1c2NhdG9yXy5jbGFzc0xpc3QuYWRkKCdtZGwtbGF5b3V0X19vYmZ1c2NhdG9yJyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHRoaXMub2JmdXNjYXRvcl8pO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMub2JmdXNjYXRvcl8pIHRocm93IG5ldyBFcnJvcignTURMOiBObyBvYmZ1c2NhdG9yIGZvdW5kIScpO1xuXG4gICAgICAgICAgICBkcmF3ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBkcmF3ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMub2JmdXNjYXRvcl8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleWJvYXJkRXZlbnRIYW5kbGVyXy5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgLy8gU3RhcnQgd2l0aCBkcmF3ZXIgb3BlbiBvciBjbG9zZWQgZGVwZW5kaW5nIG9uIGEgZ2xvYmFsIChXaW5kb3cpIHZhcmlhYmxlXG4gICAgICAgICAgICBpZiAod2luZG93LnN0YXJ0V2l0aERyYXdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkRyYXdlcih0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgdGhpcy5jbG9zZURyYXdlcihmYWxzZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5zdGFydFdpdGhEcmF3ZXIpIHRoaXMuY2xvc2VEcmF3ZXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5zdGFydFdpdGhEcmF3ZXIpIHRoaXMuY2xvc2VEcmF3ZXIoZmFsc2UpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBLZWVwIGFuIGV5ZSBvbiBzY3JlZW4gc2l6ZSwgYW5kIGFkZC9yZW1vdmUgYXV4aWxpYXJ5IGNsYXNzIGZvciBzdHlsaW5nXG4gICAgICAgIC8vIG9mIHNtYWxsIHNjcmVlbnMuXG4gICAgICAgIHRoaXMuc2NyZWVuU2l6ZU1lZGlhUXVlcnlfID0gd2luZG93Lm1hdGNoTWVkaWEodGhpcy5Db25zdGFudF8uTUFYX1dJRFRIKTtcbiAgICAgICAgdGhpcy5zY3JlZW5TaXplTWVkaWFRdWVyeV8uYWRkTGlzdGVuZXIodGhpcy5zY3JlZW5TaXplSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NyZWVuU2l6ZUhhbmRsZXJfKCk7XG4gICAgICAgIC8vIEluaXRpYWxpemUgdGFicywgaWYgYW55LlxuICAgICAgICBpZiAodGhpcy5oZWFkZXJfICYmIHRoaXMudGFiQmFyXykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSEFTX1RBQlMpO1xuICAgICAgICAgICAgdmFyIHRhYkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGFiQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5UQUJfQ09OVEFJTkVSKTtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyXy5pbnNlcnRCZWZvcmUodGFiQ29udGFpbmVyLCB0aGlzLnRhYkJhcl8pO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJfLnJlbW92ZUNoaWxkKHRoaXMudGFiQmFyXyk7XG4gICAgICAgICAgICB2YXIgbGVmdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuVEFCX0JBUl9CVVRUT04pO1xuICAgICAgICAgICAgbGVmdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuVEFCX0JBUl9MRUZUX0JVVFRPTik7XG4gICAgICAgICAgICB2YXIgbGVmdEJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgICAgICBsZWZ0QnV0dG9uSWNvbi5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSUNPTik7XG4gICAgICAgICAgICBsZWZ0QnV0dG9uSWNvbi50ZXh0Q29udGVudCA9IHRoaXMuQ29uc3RhbnRfLkNIRVZST05fTEVGVDtcbiAgICAgICAgICAgIGxlZnRCdXR0b24uYXBwZW5kQ2hpbGQobGVmdEJ1dHRvbkljb24pO1xuICAgICAgICAgICAgbGVmdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHdpbmRvdy5jbGlja0V2dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFiQmFyXy5zY3JvbGxMZWZ0IC09IHRoaXMuQ29uc3RhbnRfLlRBQl9TQ1JPTExfUElYRUxTO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHZhciByaWdodEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRCdXR0b24uY2xhc3NMaXN0LmFkZChNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLlRBQl9CQVJfQlVUVE9OKTtcbiAgICAgICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5UQUJfQkFSX1JJR0hUX0JVVFRPTik7XG4gICAgICAgICAgICB2YXIgcmlnaHRCdXR0b25JY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICAgICAgICAgICAgcmlnaHRCdXR0b25JY29uLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JQ09OKTtcbiAgICAgICAgICAgIHJpZ2h0QnV0dG9uSWNvbi50ZXh0Q29udGVudCA9IHRoaXMuQ29uc3RhbnRfLkNIRVZST05fUklHSFQ7XG4gICAgICAgICAgICByaWdodEJ1dHRvbi5hcHBlbmRDaGlsZChyaWdodEJ1dHRvbkljb24pO1xuICAgICAgICAgICAgcmlnaHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYkJhcl8uc2Nyb2xsTGVmdCArPSB0aGlzLkNvbnN0YW50Xy5UQUJfU0NST0xMX1BJWEVMUztcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0YWJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdEJ1dHRvbik7XG4gICAgICAgICAgICB0YWJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50YWJCYXJfKTtcbiAgICAgICAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodEJ1dHRvbik7XG4gICAgICAgICAgICAvLyBBZGQgYW5kIHJlbW92ZSB0YWIgYnV0dG9ucyBkZXBlbmRpbmcgb24gc2Nyb2xsIHBvc2l0aW9uIGFuZCB0b3RhbFxuICAgICAgICAgICAgLy8gd2luZG93IHNpemUuXG4gICAgICAgICAgICB2YXIgdGFiVXBkYXRlSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWJCYXJfLnNjcm9sbExlZnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRCdXR0b24uY2xhc3NMaXN0LmFkZChNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLklTX0FDVElWRSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfQUNUSVZFKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFiQmFyXy5zY3JvbGxMZWZ0IDwgdGhpcy50YWJCYXJfLnNjcm9sbFdpZHRoIC0gdGhpcy50YWJCYXJfLm9mZnNldFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19BQ1RJVkUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoTWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5JU19BQ1RJVkUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyXy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0YWJVcGRhdGVIYW5kbGVyKTtcbiAgICAgICAgICAgIHRhYlVwZGF0ZUhhbmRsZXIoKTtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0YWJzIHdoZW4gdGhlIHdpbmRvdyByZXNpemVzLlxuICAgICAgICAgICAgdmFyIHdpbmRvd1Jlc2l6ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlIHRpbWVvdXRzIHRvIG1ha2Ugc3VyZSBpdCBkb2Vzbid0IGhhcHBlbiB0b28gb2Z0ZW4uXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVzaXplVGltZW91dElkXykge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lb3V0SWRfKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0SWRfID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYlVwZGF0ZUhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0SWRfID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuQ29uc3RhbnRfLlJFU0laRV9USU1FT1VUKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB3aW5kb3dSZXNpemVIYW5kbGVyKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8uY2xhc3NMaXN0LmNvbnRhaW5zKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSlNfUklQUExFX0VGRkVDVCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYkJhcl8uY2xhc3NMaXN0LmFkZChNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNlbGVjdCBlbGVtZW50IHRhYnMsIGRvY3VtZW50IHBhbmVsc1xuICAgICAgICAgICAgdmFyIHRhYnMgPSB0aGlzLnRhYkJhcl8ucXVlcnlTZWxlY3RvckFsbChgLiR7TWF0ZXJpYWxMYXlvdXQuY3NzQ2xhc3Nlcy5UQUJ9YCk7XG4gICAgICAgICAgICB2YXIgcGFuZWxzID0gdGhpcy5jb250ZW50Xy5xdWVyeVNlbGVjdG9yQWxsKGAuJHtNYXRlcmlhbExheW91dC5jc3NDbGFzc2VzLlBBTkVMfWApO1xuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyB0YWJzIGZvciBlYWNoIHRhYiBlbGVtZW50XG4gICAgICAgICAgICBmb3IgKHZhciBpXyA9IDA7IGlfIDwgdGFicy5sZW5ndGg7IGlfKyspIHtcbiAgICAgICAgICAgICAgICBuZXcgTWF0ZXJpYWxMYXlvdXRUYWIodGFic1tpX10sIHRhYnMsIHBhbmVscywgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKE1hdGVyaWFsTGF5b3V0LmNzc0NsYXNzZXMuSVNfVVBHUkFERUQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBDb25zdGFudF8gPSB7XG4gICAgICAgIE1BWF9XSURUSDogJyhtYXgtd2lkdGg6IDEwMjRweCknLFxuICAgICAgICBUQUJfU0NST0xMX1BJWEVMUzogMTAwLFxuICAgICAgICBSRVNJWkVfVElNRU9VVDogMTAwLFxuICAgICAgICBNRU5VX0lDT046ICcmI3hFNUQyOycsXG4gICAgICAgIENIRVZST05fTEVGVDogJ2NoZXZyb25fbGVmdCcsXG4gICAgICAgIENIRVZST05fUklHSFQ6ICdjaGV2cm9uX3JpZ2h0J1xuICAgIH07XG4gICAgLyoqXG4gICAgICAgKiBLZXljb2RlcywgZm9yIGNvZGUgcmVhZGFiaWxpdHkuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBLZXljb2Rlc18gPSB7XG4gICAgICAgIEVOVEVSOiAxMyxcbiAgICAgICAgRVNDQVBFOiAyNyxcbiAgICAgICAgU1BBQ0U6IDMyXG4gICAgfTtcbiAgICAvKipcbiAgICAgICAqIE1vZGVzLlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgTW9kZV8gPSB7XG4gICAgICAgIFNUQU5EQVJEOiAwLFxuICAgICAgICBTRUFNRUQ6IDEsXG4gICAgICAgIFdBVEVSRkFMTDogMixcbiAgICAgICAgU0NST0xMOiAzXG4gICAgfTtcbiAgICAvKipcbiAgICAgICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgICAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAgICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nfVxuICAgICAgICovXG4gICAgc3RhdGljIGNzc0NsYXNzZXMgPSB7XG4gICAgICAgIENPTlRBSU5FUjogJ21kbC1sYXlvdXRfX2NvbnRhaW5lcicsXG4gICAgICAgIEhFQURFUjogJ21kbC1sYXlvdXRfX2hlYWRlcicsXG4gICAgICAgIERSQVdFUjogJ21kbC1sYXlvdXRfX2RyYXdlcicsXG4gICAgICAgIENPTlRFTlQ6ICdtZGwtbGF5b3V0X19jb250ZW50JyxcbiAgICAgICAgRFJBV0VSX0JUTjogJ21kbC1sYXlvdXRfX2RyYXdlci1idXR0b24nLFxuICAgICAgICBJQ09OOiAnbWF0ZXJpYWwtaWNvbnMnLFxuICAgICAgICBKU19SSVBQTEVfRUZGRUNUOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgICAgICBSSVBQTEVfQ09OVEFJTkVSOiAnbWRsLWxheW91dF9fdGFiLXJpcHBsZS1jb250YWluZXInLFxuICAgICAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICAgICAgUklQUExFX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cycsXG4gICAgICAgIEhFQURFUl9TRUFNRUQ6ICdtZGwtbGF5b3V0X19oZWFkZXItLXNlYW1lZCcsXG4gICAgICAgIEhFQURFUl9XQVRFUkZBTEw6ICdtZGwtbGF5b3V0X19oZWFkZXItLXdhdGVyZmFsbCcsXG4gICAgICAgIEhFQURFUl9TQ1JPTEw6ICdtZGwtbGF5b3V0X19oZWFkZXItLXNjcm9sbCcsXG4gICAgICAgIEZJWEVEX0hFQURFUjogJ21kbC1sYXlvdXQtLWZpeGVkLWhlYWRlcicsXG4gICAgICAgIE9CRlVTQ0FUT1I6ICdtZGwtbGF5b3V0X19vYmZ1c2NhdG9yJyxcbiAgICAgICAgVEFCX0JBUjogJ21kbC1sYXlvdXRfX3RhYi1iYXInLFxuICAgICAgICBUQUJfQ09OVEFJTkVSOiAnbWRsLWxheW91dF9fdGFiLWJhci1jb250YWluZXInLFxuICAgICAgICBUQUI6ICdtZGwtbGF5b3V0X190YWInLFxuICAgICAgICBUQUJfQkFSX0JVVFRPTjogJ21kbC1sYXlvdXRfX3RhYi1iYXItYnV0dG9uJyxcbiAgICAgICAgVEFCX0JBUl9MRUZUX0JVVFRPTjogJ21kbC1sYXlvdXRfX3RhYi1iYXItbGVmdC1idXR0b24nLFxuICAgICAgICBUQUJfQkFSX1JJR0hUX0JVVFRPTjogJ21kbC1sYXlvdXRfX3RhYi1iYXItcmlnaHQtYnV0dG9uJyxcbiAgICAgICAgVEFCX01BTlVBTF9TV0lUQ0g6ICdtZGwtbGF5b3V0X190YWItbWFudWFsLXN3aXRjaCcsXG4gICAgICAgIFBBTkVMOiAnbWRsLWxheW91dF9fdGFiLXBhbmVsJyxcbiAgICAgICAgSEFTX0RSQVdFUjogJ2hhcy1kcmF3ZXInLFxuICAgICAgICBIQVNfVEFCUzogJ2hhcy10YWJzJyxcbiAgICAgICAgSEFTX1NDUk9MTElOR19IRUFERVI6ICdoYXMtc2Nyb2xsaW5nLWhlYWRlcicsXG4gICAgICAgIENBU1RJTkdfU0hBRE9XOiAnaXMtY2FzdGluZy1zaGFkb3cnLFxuICAgICAgICBJU19DT01QQUNUOiAnaXMtY29tcGFjdCcsXG4gICAgICAgIElTX1NNQUxMX1NDUkVFTjogJ2lzLXNtYWxsLXNjcmVlbicsXG4gICAgICAgIElTX0RSQVdFUl9PUEVOOiAnaXMtdmlzaWJsZScsXG4gICAgICAgIElTX0FDVElWRTogJ2lzLWFjdGl2ZScsXG4gICAgICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnLFxuICAgICAgICBJU19BTklNQVRJTkc6ICdpcy1hbmltYXRpbmcnLFxuICAgICAgICBPTl9MQVJHRV9TQ1JFRU46ICdtZGwtbGF5b3V0LS1sYXJnZS1zY3JlZW4tb25seScsXG4gICAgICAgIE9OX1NNQUxMX1NDUkVFTjogJ21kbC1sYXlvdXQtLXNtYWxsLXNjcmVlbi1vbmx5J1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsTGF5b3V0J10gPSBNYXRlcmlhbExheW91dDtcbi8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYW4gaW5kaXZpZHVhbCB0YWIuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YWIgVGhlIEhUTUwgZWxlbWVudCBmb3IgdGhlIHRhYi5cbiAgICogQHBhcmFtIHshQXJyYXk8SFRNTEVsZW1lbnQ+fSB0YWJzIEFycmF5IHdpdGggSFRNTCBlbGVtZW50cyBmb3IgYWxsIHRhYnMuXG4gICAqIEBwYXJhbSB7IUFycmF5PEhUTUxFbGVtZW50Pn0gcGFuZWxzIEFycmF5IHdpdGggSFRNTCBlbGVtZW50cyBmb3IgYWxsIHBhbmVscy5cbiAgICogQHBhcmFtIHtNYXRlcmlhbExheW91dH0gbGF5b3V0IFRoZSBNYXRlcmlhbExheW91dCBvYmplY3QgdGhhdCBvd25zIHRoZSB0YWIuXG4gICAqL1xuZXhwb3J0IGNsYXNzIE1hdGVyaWFsTGF5b3V0VGFie1xuICAgIGNvbnN0cnVjdG9yKHRhYiwgdGFicywgcGFuZWxzLCBsYXlvdXQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICogQXV4aWxpYXJ5IG1ldGhvZCB0byBwcm9ncmFtbWF0aWNhbGx5IHNlbGVjdCBhIHRhYiBpbiB0aGUgVUkuXG4gICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdFRhYigpIHtcbiAgICAgICAgICAgIHZhciBocmVmID0gdGFiLmhyZWYuc3BsaXQoJyMnKVsxXTtcbiAgICAgICAgICAgIHZhciBwYW5lbCA9IGxheW91dC5jb250ZW50Xy5xdWVyeVNlbGVjdG9yKGAjJHsgIGhyZWZ9YCk7XG4gICAgICAgICAgICBsYXlvdXQucmVzZXRUYWJTdGF0ZV8odGFicyk7XG4gICAgICAgICAgICBsYXlvdXQucmVzZXRQYW5lbFN0YXRlXyhwYW5lbHMpO1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5hZGQobGF5b3V0LmNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICAgICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKGxheW91dC5jc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYXlvdXQudGFiQmFyXy5jbGFzc0xpc3QuY29udGFpbnMobGF5b3V0LmNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgICAgICB2YXIgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQobGF5b3V0LmNzc0NsYXNzZXNfLlJJUFBMRV9DT05UQUlORVIpO1xuICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQobGF5b3V0LmNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpO1xuICAgICAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKGxheW91dC5jc3NDbGFzc2VzXy5SSVBQTEUpO1xuICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpcHBsZSk7XG4gICAgICAgICAgICB0YWIuYXBwZW5kQ2hpbGQocmlwcGxlQ29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWxheW91dC50YWJCYXJfLmNsYXNzTGlzdC5jb250YWlucyhsYXlvdXQuY3NzQ2xhc3Nlc18uVEFCX01BTlVBTF9TV0lUQ0gpKSB7XG4gICAgICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhYi5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdFRhYigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRhYi5zaG93XG4gICAgICAgID0gc2VsZWN0VGFiO1xuICAgIH1cbn1cbndpbmRvd1snTWF0ZXJpYWxMYXlvdXRUYWInXSA9IE1hdGVyaWFsTGF5b3V0VGFiO1xuLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4vLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsTGF5b3V0LFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbExheW91dCcsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtbGF5b3V0J1xufSk7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgRGF0YSBUYWJsZSBDYXJkIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbERhdGFUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkgeyBiYXNpY0NvbnN0cnVjdG9yKGVsZW1lbnQsIHRoaXMpOyB9XG4gICAgLyoqXG4gICAgICAgKiBHZW5lcmF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRvZ2dsZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiBhXG4gICAgICAgKiBzaW5nbGUgcm93IChvciBtdWx0aXBsZSByb3dzKS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGNoZWNrYm94IENoZWNrYm94IHRoYXQgdG9nZ2xlcyB0aGUgc2VsZWN0aW9uIHN0YXRlLlxuICAgICAgICogQHBhcmFtIHtFbGVtZW50fSByb3cgUm93IHRvIHRvZ2dsZSB3aGVuIGNoZWNrYm94IGNoYW5nZXMuXG4gICAgICAgKiBAcGFyYW0geyhBcnJheTxPYmplY3Q+fE5vZGVMaXN0KT19IG9wdF9yb3dzIFJvd3MgdG8gdG9nZ2xlIHdoZW4gY2hlY2tib3ggY2hhbmdlcy5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBzZWxlY3RSb3dfKGNoZWNrYm94LCByb3csIG9wdF9yb3dzKSB7XG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19TRUxFQ1RFRCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19TRUxFQ1RFRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRfcm93cykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaV87XG4gICAgICAgICAgICAgICAgdmFyIGVsO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaV8gPSAwOyBpXyA8IG9wdF9yb3dzLmxlbmd0aDsgaV8rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwgPSBvcHRfcm93c1tpX10ucXVlcnlTZWxlY3RvcigndGQnKS5xdWVyeVNlbGVjdG9yKCcubWRsLWNoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbFsnTWF0ZXJpYWxDaGVja2JveCddLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRfcm93c1tpX10uY2xhc3NMaXN0LmFkZCh0aGlzLmNzc0NsYXNzZXNfLklTX1NFTEVDVEVEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaV8gPSAwOyBpXyA8IG9wdF9yb3dzLmxlbmd0aDsgaV8rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwgPSBvcHRfcm93c1tpX10ucXVlcnlTZWxlY3RvcigndGQnKS5xdWVyeVNlbGVjdG9yKCcubWRsLWNoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbFsnTWF0ZXJpYWxDaGVja2JveCddLnVuY2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdF9yb3dzW2lfXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfU0VMRUNURUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIGNoZWNrYm94IGZvciBhIHNpbmdsZSBvciBvciBtdWx0aXBsZSByb3dzIGFuZCBob29rcyB1cCB0aGVcbiAgICAgICAqIGV2ZW50IGhhbmRsaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcm93IFJvdyB0byB0b2dnbGUgd2hlbiBjaGVja2JveCBjaGFuZ2VzLlxuICAgICAgICogQHBhcmFtIHsoQXJyYXk8T2JqZWN0PnxOb2RlTGlzdCk9fSBvcHRfcm93cyBSb3dzIHRvIHRvZ2dsZSB3aGVuIGNoZWNrYm94IGNoYW5nZXMuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY3JlYXRlQ2hlY2tib3hfKHJvdywgb3B0X3Jvd3MpIHtcbiAgICAgICAgdmFyIGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3NlcyA9IFtcbiAgICAgICAgICAgICdtZGwtY2hlY2tib3gnLFxuICAgICAgICAgICAgJ21kbC1qcy1jaGVja2JveCcsXG4gICAgICAgICAgICAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgICAgICAgICAgdGhpcy5jc3NDbGFzc2VzXy5TRUxFQ1RfRUxFTUVOVFxuICAgICAgICBdO1xuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBsYWJlbENsYXNzZXMuam9pbignICcpO1xuICAgICAgICB2YXIgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94JztcbiAgICAgICAgY2hlY2tib3guY2xhc3NMaXN0LmFkZCgnbWRsLWNoZWNrYm94X19pbnB1dCcpO1xuICAgICAgICBpZiAocm93KSB7XG4gICAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gcm93LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLklTX1NFTEVDVEVEKTtcbiAgICAgICAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuc2VsZWN0Um93XyhjaGVja2JveCwgcm93KSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0X3Jvd3MpIHtcbiAgICAgICAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuc2VsZWN0Um93XyhjaGVja2JveCwgbnVsbCwgb3B0X3Jvd3MpKTtcbiAgICAgICAgfVxuICAgICAgICBsYWJlbC5hcHBlbmRDaGlsZChjaGVja2JveCk7XG4gICAgICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnQobGFiZWwsICdNYXRlcmlhbENoZWNrYm94Jyk7XG4gICAgICAgIHJldHVybiBsYWJlbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgICAgdmFyIGZpcnN0SGVhZGVyID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCd0aCcpO1xuICAgICAgICAgICAgdmFyIGJvZHlSb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCd0Ym9keSB0cicpKTtcbiAgICAgICAgICAgIHZhciBmb290Um93cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgndGZvb3QgdHInKSk7XG4gICAgICAgICAgICB2YXIgcm93cyA9IGJvZHlSb3dzLmNvbmNhdChmb290Um93cyk7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jc3NDbGFzc2VzXy5TRUxFQ1RBQkxFKSkge1xuICAgICAgICAgICAgICAgIHZhciB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlckNoZWNrYm94ID0gdGhpcy5jcmVhdGVDaGVja2JveF8obnVsbCwgcm93cyk7XG4gICAgICAgICAgICAgICAgdGguYXBwZW5kQ2hpbGQoaGVhZGVyQ2hlY2tib3gpO1xuICAgICAgICAgICAgICAgIGZpcnN0SGVhZGVyLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoLCBmaXJzdEhlYWRlcik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaV8gPSAwOyBpXyA8IHJvd3MubGVuZ3RoOyBpXysrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdENlbGwgPSByb3dzW2lfXS5xdWVyeVNlbGVjdG9yKCd0ZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlyc3RDZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3NbaV9dLnBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RCT0RZJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dDaGVja2JveCA9IHRoaXMuY3JlYXRlQ2hlY2tib3hfKHJvd3NbaV9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZChyb3dDaGVja2JveCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzW2lfXS5pbnNlcnRCZWZvcmUodGQsIGZpcnN0Q2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfVVBHUkFERUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICAgICAqXG4gICAgICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIENvbnN0YW50XyA9IHt9O1xuICAgIC8qKlxuICAgICAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAgICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICAgICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgICAgICpcbiAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgY3NzQ2xhc3Nlc18gPSB7XG4gICAgICAgIERBVEFfVEFCTEU6ICdtZGwtZGF0YS10YWJsZScsXG4gICAgICAgIFNFTEVDVEFCTEU6ICdtZGwtZGF0YS10YWJsZS0tc2VsZWN0YWJsZScsXG4gICAgICAgIFNFTEVDVF9FTEVNRU5UOiAnbWRsLWRhdGEtdGFibGVfX3NlbGVjdCcsXG4gICAgICAgIElTX1NFTEVDVEVEOiAnaXMtc2VsZWN0ZWQnLFxuICAgICAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJ1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsRGF0YVRhYmxlJ10gPSBNYXRlcmlhbERhdGFUYWJsZTtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbERhdGFUYWJsZSxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxEYXRhVGFibGUnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLWRhdGEtdGFibGUnXG59KTtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBSaXBwbGUgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFJpcHBsZSB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkgeyBiYXNpY0NvbnN0cnVjdG9yKGVsZW1lbnQsIHRoaXMpOyB9XG4gICAgLyoqXG4gICAgICAgKiBIYW5kbGUgbW91c2UgLyBmaW5nZXIgZG93biBvbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgIGRvd25IYW5kbGVyXyhldmVudCkge1xuICAgICAgICBpZiAodGhpcy5yaXBwbGVFbGVtZW50Xyl7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmlwcGxlRWxlbWVudF8uc3R5bGUud2lkdGggJiYgIXRoaXMucmlwcGxlRWxlbWVudF8uc3R5bGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRIZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLmJvdW5kV2lkdGggPSByZWN0LndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlU2l6ZV8gPSBNYXRoLnNxcnQocmVjdC53aWR0aCAqIHJlY3Qud2lkdGggKyByZWN0LmhlaWdodCAqIHJlY3QuaGVpZ2h0KSAqIDIgKyAyO1xuICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8uc3R5bGUud2lkdGggPSBgJHt0aGlzLnJpcHBsZVNpemVffXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLnN0eWxlLmhlaWdodCA9IGAke3RoaXMucmlwcGxlU2l6ZV99cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuY3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IHdpbmRvdy5jbGlja0V2dCAmJiB0aGlzLmlnbm9yaW5nTW91c2VEb3duXykge1xuICAgICAgICAgICAgdGhpcy5pZ25vcmluZ01vdXNlRG93bl8gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlnbm9yaW5nTW91c2VEb3duXyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZnJhbWVDb3VudCA9IHRoaXMuZ2V0RnJhbWVDb3VudCgpO1xuICAgICAgICAgICAgaWYgKGZyYW1lQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRGcmFtZUNvdW50KDEpO1xuICAgICAgICAgICAgdmFyIGJvdW5kID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciB4O1xuICAgICAgICAgICAgdmFyIHk7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBhcmUgaGFuZGxpbmcgYSBrZXlib2FyZCBjbGljay5cbiAgICAgICAgICAgIGlmIChldmVudC5jbGllbnRYID09PSAwICYmIGV2ZW50LmNsaWVudFkgPT09IDApIHtcbiAgICAgICAgICAgICAgICB4ID0gTWF0aC5yb3VuZChib3VuZC53aWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgIHkgPSBNYXRoLnJvdW5kKGJvdW5kLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50WCA9IGV2ZW50LmNsaWVudFggIT09IHVuZGVmaW5lZCA/IGV2ZW50LmNsaWVudFggOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgdmFyIGNsaWVudFkgPSBldmVudC5jbGllbnRZICE9PSB1bmRlZmluZWQgPyBldmVudC5jbGllbnRZIDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICAgICAgICAgIHggPSBNYXRoLnJvdW5kKGNsaWVudFggLSBib3VuZC5sZWZ0KTtcbiAgICAgICAgICAgICAgICB5ID0gTWF0aC5yb3VuZChjbGllbnRZIC0gYm91bmQudG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0UmlwcGxlWFkoeCwgeSk7XG4gICAgICAgICAgICB0aGlzLnNldFJpcHBsZVN0eWxlcyh0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltRnJhbWVIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICogSGFuZGxlIG1vdXNlIC8gZmluZ2VyIHVwIG9uIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgdXBIYW5kbGVyXyhldmVudCkge1xuICAgICAgICAvLyBEb24ndCBmaXJlIGZvciB0aGUgYXJ0aWZpY2lhbCBcIm1vdXNldXBcIiBnZW5lcmF0ZWQgYnkgYSBkb3VibGUtY2xpY2suXG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC5kZXRhaWwgIT09IDIpIHtcbiAgICAgICAgICAgIC8vIEFsbG93IGEgcmVwYWludCB0byBvY2N1ciBiZWZvcmUgcmVtb3ZpbmcgdGhpcyBjbGFzcywgc28gdGhlIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gc2hvd3MgZm9yIHRhcCBldmVudHMsIHdoaWNoIHNlZW0gdG8gdHJpZ2dlciBhIG1vdXNldXAgdG9vIHNvb24gYWZ0ZXJcbiAgICAgICAgICAgIC8vIG1vdXNlZG93bi5cbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yaXBwbGVFbGVtZW50XykgdGhpcy5yaXBwbGVFbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlY2VudGVyaW5nO1xuICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICAgIHRoaXMucmVjZW50ZXJpbmcgPSB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9DRU5URVIpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1RfSUdOT1JFX0VWRU5UUykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLmNzc0NsYXNzZXNfLlJJUFBMRX1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZyYW1lQ291bnRfID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZVNpemVfID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnhfID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnlfID0gMDtcbiAgICAgICAgICAgICAgICAvLyBUb3VjaCBzdGFydCBwcm9kdWNlcyBhIGNvbXBhdCBtb3VzZSBkb3duIGV2ZW50LCB3aGljaCB3b3VsZCBjYXVzZSBhXG4gICAgICAgICAgICAgICAgLy8gc2Vjb25kIHJpcHBsZXMuIFRvIGF2b2lkIHRoYXQsIHdlIHVzZSB0aGlzIHByb3BlcnR5IHRvIGlnbm9yZSB0aGUgZmlyc3RcbiAgICAgICAgICAgICAgICAvLyBtb3VzZSBkb3duIGFmdGVyIGEgdG91Y2ggc3RhcnQuXG4gICAgICAgICAgICAgICAgdGhpcy5pZ25vcmluZ01vdXNlRG93bl8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmJvdW5kRG93bkhhbmRsZXIgPSB0aGlzLmRvd25IYW5kbGVyXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmREb3duSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5ib3VuZERvd25IYW5kbGVyLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3VuZFVwSGFuZGxlciA9IHRoaXMudXBIYW5kbGVyXy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3cuY2xpY2tFdnQsIHRoaXMuYm91bmRVcEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuYm91bmRVcEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLmJvdW5kVXBIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJvdW5kVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogR2V0dGVyIGZvciBmcmFtZUNvdW50Xy5cbiAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBmcmFtZSBjb3VudC5cbiAgICAgICAgKi9cbiAgICBnZXRGcmFtZUNvdW50KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmZyYW1lQ291bnRfO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAgKiBTZXR0ZXIgZm9yIGZyYW1lQ291bnRfLlxuICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmQyB0aGUgZnJhbWUgY291bnQuXG4gICAgICAgICogQHR5cGVkZWYge0Z1bmN0aW9ufVxuICAgICAgICAqL1xuICAgIHNldEZyYW1lQ291bnQoZkMpe1xuICAgICAgICB0aGlzLmZyYW1lQ291bnRfID0gZkM7XG4gICAgfVxuICAgIC8qKlxuICAgICAgICAqIEdldHRlciBmb3IgcmlwcGxlRWxlbWVudF8uXG4gICAgICAgICogQHJldHVybiB7RWxlbWVudH0gdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgICAgICAqL1xuICAgIGdldFJpcHBsZUVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpcHBsZUVsZW1lbnRfO1xuICAgIH1cbiAgICAvKipcbiAgICAgICAgKiBTZXRzIHRoZSByaXBwbGUgWCBhbmQgWSBjb29yZGluYXRlcy5cbiAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IG5ld1ggdGhlIG5ldyBYIGNvb3JkaW5hdGVcbiAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IG5ld1kgdGhlIG5ldyBZIGNvb3JkaW5hdGVcbiAgICAgICAgKi9cbiAgICBzZXRSaXBwbGVYWShuZXdYLCBuZXdZKSB7XG4gICAgICAgIHRoaXMueF8gPSBuZXdYO1xuICAgICAgICB0aGlzLnlfID0gbmV3WTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAgICogU2V0cyB0aGUgcmlwcGxlIHN0eWxlcy5cbiAgICAgICAgKiBAcGFyYW0gIHtib29sZWFufSBzdGFydCB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIHRoZSBzdGFydCBmcmFtZS5cbiAgICAgICAgKi9cbiAgICBzZXRSaXBwbGVTdHlsZXMoc3RhcnQpIHtcbiAgICAgICAgaWYgKHRoaXMucmlwcGxlRWxlbWVudF8gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1TdHJpbmc7XG4gICAgICAgICAgICB2YXIgc2NhbGU7XG4gICAgICAgICAgICB2YXIgc2l6ZTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBgdHJhbnNsYXRlKCR7dGhpcy54X31weCwke3RoaXMueV99cHgpYDtcbiAgICAgICAgICAgIGlmIChzdGFydCkge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gdGhpcy5Db25zdGFudF8uSU5JVElBTF9TQ0FMRTtcbiAgICAgICAgICAgICAgICBzaXplID0gdGhpcy5Db25zdGFudF8uSU5JVElBTF9TSVpFO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IHRoaXMuQ29uc3RhbnRfLkZJTkFMX1NDQUxFO1xuICAgICAgICAgICAgICAgIHNpemUgPSBgJHt0aGlzLnJpcHBsZVNpemVffXB4YDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWNlbnRlcmluZykge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBgdHJhbnNsYXRlKCR7dGhpcy5ib3VuZFdpZHRoIC8gMn1weCwke3RoaXMuYm91bmRIZWlnaHQgLyAyfXB4KWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nID0gYHRyYW5zbGF0ZSgtNTAlLCAtNTAlKSAke29mZnNldH0gJHtzY2FsZX1gO1xuICAgICAgICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XG4gICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLnN0eWxlLm1zVHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XG4gICAgICAgICAgICBpZiAoc3RhcnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAgICAqIEhhbmRsZXMgYW4gYW5pbWF0aW9uIGZyYW1lLlxuICAgICAgICAqL1xuICAgIGFuaW1GcmFtZUhhbmRsZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyYW1lQ291bnRfLS0gPiAwKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbUZyYW1lSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UmlwcGxlU3R5bGVzKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBDb25zdGFudF8gPSB7XG4gICAgICAgIElOSVRJQUxfU0NBTEU6ICdzY2FsZSgwLjAwMDEsIDAuMDAwMSknLFxuICAgICAgICBJTklUSUFMX1NJWkU6ICcxcHgnLFxuICAgICAgICBJTklUSUFMX09QQUNJVFk6ICcwLjQnLFxuICAgICAgICBGSU5BTF9PUEFDSVRZOiAnMCcsXG4gICAgICAgIEZJTkFMX1NDQUxFOiAnJ1xuICAgIH07XG4gICAgLyoqXG4gICAgICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICAgICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgICAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAgICAgKlxuICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICBjc3NDbGFzc2VzXyA9IHtcbiAgICAgICAgUklQUExFX0NFTlRFUjogJ21kbC1yaXBwbGUtLWNlbnRlcicsXG4gICAgICAgIFJJUFBMRV9FRkZFQ1RfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcbiAgICAgICAgUklQUExFOiAnbWRsLXJpcHBsZScsXG4gICAgICAgIElTX0FOSU1BVElORzogJ2lzLWFuaW1hdGluZycsXG4gICAgICAgIElTX1ZJU0lCTEU6ICdpcy12aXNpYmxlJ1xuICAgIH07XG59XG53aW5kb3dbJ01hdGVyaWFsUmlwcGxlJ10gPSBNYXRlcmlhbFJpcHBsZTtcbi8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbmNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFJpcHBsZSxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxSaXBwbGUnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgIHdpZGdldDogZmFsc2Vcbn0pO1xuXG5cbi8vKiBJTklUXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRlcmlhbEluaXQoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogUGVyZm9ybXMgYSBcIkN1dHRpbmcgdGhlIG11c3RhcmRcIiB0ZXN0LiBJZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgZmVhdHVyZXNcbiAgICogdGVzdGVkLCBhZGRzIGEgbWRsLWpzIGNsYXNzIHRvIHRoZSA8aHRtbD4gZWxlbWVudC4gSXQgdGhlbiB1cGdyYWRlcyBhbGwgTURMXG4gICAqIGNvbXBvbmVudHMgcmVxdWlyaW5nIEphdmFTY3JpcHQuXG4gICAqL1xuICBpZiAoJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgJiZcbiAgICAgICdxdWVyeVNlbGVjdG9yJyBpbiBkb2N1bWVudCAmJlxuICAgICAgJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyAmJiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGwtanMnKTtcbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkKCk7XG4gIH0gZWxzZSB7XG4gICAgLyoqXG4gICAgICogRHVtbXkgZnVuY3Rpb24gdG8gYXZvaWQgSlMgZXJyb3JzLlxuICAgICAqL1xuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnQgPSBmdW5jdGlvbigpIHtyZXR1cm47fTtcbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvbiB0byBhdm9pZCBKUyBlcnJvcnMuXG4gICAgICovXG4gICAgY29tcG9uZW50SGFuZGxlci5yZWdpc3RlciA9IGZ1bmN0aW9uKCkge3JldHVybjt9O1xuICB9XG59XG5tYXRlcmlhbEluaXQoKTtcbi8vd2luZG93LmJjZF9pbml0X2Z1bmN0aW9ucy5tYXRlcmlhbCA9IG1hdGVyaWFsSW5pdDtcbiJdfQ==