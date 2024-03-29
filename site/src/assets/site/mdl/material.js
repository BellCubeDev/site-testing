/*
======================
NOTICE!!!
======================
The event handler for `MaterialTooltip.prototype.handleMouseEnter_` has been modified to adjust tooltip
positioning for the navigation drawer. This code consists of a single IF statement.

In addition, many minor changes - such as moving the code from its initial single-function scope
to the global scope - and modernizing certain aspects of the script, such as converting the old-school class definitions
to modern class definitions using the keyword, have been made.

Furthermore, changes have been made to make the code more modular.

Finally, Export keywords have been added to the module.
*/

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A component handler interface using the revealing module design pattern.
 * More details on this design pattern here:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @author Jason Mayes.
 */
/* ._exported_ componentHandler */

// Pre-defining the componentHandler interface, for closure documentation and
// static verification.



/** @type {!Array<componentHandler.ComponentConfig>} */
var registeredComponents_ = [];

/** @type {!Array<componentHandler.Component>} */
var createdComponents_ = [];

var componentConfigProperty_ = 'mdlComponentConfigInternal_';

export const componentHandler = {

  /**
   * Searches registered components for a class we are interested in using.
   * Optionally replaces a match with passed object if specified.
   *
   * @param {string} name The name of a class we want to use.
   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
   * @return {!Object|boolean}
   * @private
   */
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

  /**
   * Returns an array of the classNames of the upgraded classes on the element.
   *
   * @param {!Element} element The element to fetch data from.
   * @return {!Array<string>}
   * @private
   */
  getUpgradedListOfElement_(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
  },

  /**
   * Returns true if the given element has already been upgraded for the given
   * class.
   *
   * @param {!Element} element The element we want to check.
   * @param {string} jsClass The class to check for.
   * @returns {boolean}
   * @private
   */
  isElementUpgraded_(element, jsClass) {
    var upgradedList = componentHandler.getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  },

  /**
   * Create an event object.
   *
   * @param {string} eventType The type name of the event.
   * @param {boolean} bubbles Whether the event should bubble up the DOM.
   * @param {boolean} cancelable Whether the event can be canceled.
   * @returns {!Event}
   */
  createEvent_(eventType, bubbles, cancelable) {
    if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
      return new CustomEvent(eventType, {
        bubbles,
        cancelable
      });
    } else {
      var ev = document.createEvent('Events');
      ev.initEvent(eventType, bubbles, cancelable);
      return ev;
    }
  },

  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programmatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  upgradeDom(optJsClass, optCssClass) {
    if (typeof optJsClass === 'undefined' &&
        typeof optCssClass === 'undefined') {
      for (var i = 0; i < registeredComponents_.length; i++) {
        componentHandler.upgradeDom(registeredComponents_[i].className,
            registeredComponents_[i].cssClass);
      }
    } else {
      var jsClass = /** @type {string} */ (optJsClass);
      if (typeof optCssClass === 'undefined') {
        var registeredClass = componentHandler.findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll(`.${  optCssClass}`);
      for (var n = 0; n < elements.length; n++) {
        componentHandler.upgradeElement(elements[n], jsClass);
      }
    }
  },

  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  upgradeElement(element, optJsClass) {
    // Verify argument type.
    if (!(typeof element === 'object' && element instanceof Element)) {
      throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    // Allow upgrade to be canceled by canceling emitted event.
    var upgradingEv = componentHandler.createEvent_('mdl-componentupgrading', true, true);
    element.dispatchEvent(upgradingEv);
    if (upgradingEv.defaultPrevented) {
      return;
    }

    var upgradedList = componentHandler.getUpgradedListOfElement_(element);
    var classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      var classList = element.classList;
      for (const component of registeredComponents_) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (classList.contains(component.cssClass) &&
            classesToUpgrade.indexOf(component) === -1 &&
            !componentHandler.isElementUpgraded_(element, component.className)) {
          classesToUpgrade.push(component);
        }
      }
    } else if (!componentHandler.isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(componentHandler.findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute('data-upgraded', upgradedList.join(','));
        var instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error(
          'Unable to find a registered component for the given class.');
      }

      var upgradedEv = componentHandler.createEvent_('mdl-componentupgraded', true, false);
      element.dispatchEvent(upgradedEv);
    }
  },

  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  upgradeElements(elements) {
    if (!Array.isArray(elements)) {
      if (elements instanceof Element) {
        elements = [elements];
      } else {
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

  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config
   */
  register(config) {
    // In order to support both Closure-compiled and uncompiled code accessing
    // this method, we need to allow for both the dot and array syntax for
    // property access. You'll therefore see the `foo.bar || foo['bar']`
    // pattern repeated across this method.
    var widgetMissing = (typeof config.widget === 'undefined' &&
        typeof config['widget'] === 'undefined');
    var widget = true;

    if (!widgetMissing) {
      widget = config.widget || config['widget'];
    }

    var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
      classConstructor: config.constructor || config['constructor'],
      className: config.classAsString || config['classAsString'],
      cssClass: config.cssClass || config['cssClass'],
      widget,
      callbacks: []
    });

    for (const item of registeredComponents_) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error(`The provided cssClass has already been registered: ${  item.cssClass}`);
      }
      if (item.className === newConfig.className) {
        throw new Error('The provided className has already been registered');
      }
    }

    if (typeof config.constructor !== 'undefined' && typeof config.constructor.prototype !== 'undefined' && typeof config.constructor.prototype.componentConfigProperty_ !== 'undefined') {
      throw new Error(
          `MDL component classes must not have ${  componentConfigProperty_
          } defined as a property.`);
    }

    var found = componentHandler.findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  },

  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  registerUpgradedCallback(jsClass, callback) {
    var regClass = componentHandler.findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  },

  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  upgradeAllRegistered() {
    for (var n = 0; n < registeredComponents_.length; n++) {
        componentHandler.upgradeDom(registeredComponents_[n].className);
    }
  },

  /**
   * Check the component for the downgrade method.
   * Execute if found.
   * Remove component from createdComponents list.
   *
   * @param {?componentHandler.Component} component
   */
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

  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  downgradeNodes(nodes) {
    /**
     * Auxiliary function to downgrade a single node.
     * @param  {!Node} node the node to be downgraded
     */
    function downgradeNode (node) {
      createdComponents_.filter(item => item.element_ === node).forEach(componentHandler.deconstructComponentInternal);
    }
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error('Invalid argument provided to downgrade MDL nodes.');
    }
  },
  /**
   * Describes the type of a registered component type managed by
   * componentHandler. Provided for benefit of the Closure compiler.
   *
   * @typedef {{
   *   constructor: Function,
   *   classAsString: string,
   *   cssClass: string,
   *   widget: (string|boolean|undefined)
   * }}
   */
  ComponentConfigPublic: {},  // jshint ignore:line

  /**
   * Describes the type of a registered component type managed by
   * componentHandler. Provided for benefit of the Closure compiler.
   *
   * @typedef {{
   *   constructor: !Function,
   *   className: string,
   *   cssClass: string,
   *   widget: (string|boolean),
   *   callbacks: !Array<function(!HTMLElement)>
   * }}
   */
  ComponentConfig: {},  // jshint ignore:line

  /**
   * Created component (i.e., upgraded element) type as managed by
   * componentHandler. Provided for benefit of the Closure compiler.
   *
   * @typedef {{
   *   element_: !HTMLElement,
   *   className: string,
   *   classAsString: string,
   *   cssClass: string,
   *   widget: string
   * }}
   */
  Component: {}  // jshint ignore:line
};

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
window.componentHandler = componentHandler;


function basicConstructor(element, _this){
    _this.element_ = element;
    _this.init();
}

// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
// MIT license
if (!Date.now) {
    /**
     * Date.now polyfill.
     * @return {number} the current Date
     */
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
    window.requestAnimationFrame = window[`${vp  }RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vp  }CancelAnimationFrame`] || window[`${vp  }CancelRequestAnimationFrame`];
}
if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    /**
     * requestAnimationFrame polyfill.
     * @param  {!Function} callback the callback function.
     */
    window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
}
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Button MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialButton {
    element_;
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handle blur of element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    blurHandler_(event) {
        if (event) {
            this.element_.blur();
        }
    }
    // Public methods.
    /**
       * Disable button.
       *
       * @public
       */
    disable() {
        this.element_.disabled = true;
    }
    /**
       * Enable button.
       *
       * @public
       */
    enable() {
        this.element_.disabled = false;
    }
    /**
       * Initialize element.
       */
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {};
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
    cssClasses_ = {
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_CONTAINER: 'mdl-button__ripple-container',
        RIPPLE: 'mdl-ripple'
    };
}
window['MaterialButton'] = MaterialButton;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialButton,
    classAsString: 'MaterialButton',
    cssClass: 'mdl-js-button',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Checkbox MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialCheckbox {
    constructor(element){
        basicConstructor(element, this);
    }
    /**
    * Store constants in one place so they can be updated easily.
    *
    * @enum {string | number}
    * @private
    */
    static Constant_ = { TINY_TIMEOUT: 0.001 };
    /**
    * Store strings for class names defined by this component that are used in
    * JavaScript. This allows us to simply change it in one place should we
    * decide to modify at a later date.
    *
    * @enum {string}
    * @private
    */
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
    /**
    * Handle change of state.
    *
    * @param {Event} event The event that fired.
    * @private
    */
    onChange_(event) {
        this.updateClasses_();
    }
    /**
    * Handle focus of element.
    *
    * @param {Event} event The event that fired.
    * @private
    */
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    /**
    * Handle lost focus of element.
    *
    * @param {Event} event The event that fired.
    * @private
    */
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    /**
    * Handle mouseup.
    *
    * @param {Event} event The event that fired.
    * @private
    */
    onMouseUp_(event) {
        this.blur_();
    }
    /**
    * Handle class updates.
    *
    * @private
    */
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    /**
    * Add blur.
    *
    * @private
    */
    blur_() {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this.inputElement_.blur();
        }.bind(this), this.Constant_.TINY_TIMEOUT);
    }
    // Public methods.
    /**
    * Check the inputs toggle state and update display.
    *
    * @public
    */
    checkToggleState() {
        if (this.inputElement_.checked) {
            this.element_.classList.add(this.cssClasses_.IS_CHECKED);
            this.inputElement_.checked = true;
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_CHECKED);
            this.inputElement_.checked = false;
        }
    }
    /**
    * Check the inputs disabled state and update display.
    *
    * @public
    */
    checkDisabled() {
        if (this.inputElement_.disabled) {
            this.element_.classList.add(this.cssClasses_.IS_DISABLED);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_DISABLED);
        }
    }
    /**
    * Disable checkbox.
    *
    * @public
    */
    disable() {
        this.inputElement_.disabled = true;
        this.updateClasses_();
    }
    /**
    * Enable checkbox.
    *
    * @public
    */
    enable() {
        this.inputElement_.disabled = false;
        this.updateClasses_();
    }
    /**
    * Check checkbox.
    *
    * @public
    */
    check() {
        this.inputElement_.checked = true;
        this.updateClasses_();
    }
    /**
    * Uncheck checkbox.
    *
    * @public
    */
    uncheck() {
        this.inputElement_.checked = false;
        this.updateClasses_();
    }
    /**
    * Initialize element.
    */
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
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialCheckbox,
    classAsString: 'MaterialCheckbox',
    cssClass: 'mdl-js-checkbox',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for icon toggle MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialIconToggle {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handle change of state.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onChange_(event) {
        this.updateClasses_();
    }
    /**
       * Handle focus of element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle lost focus of element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle mouseup.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onMouseUp_(event) {
        this.blur_();
    }
    /**
       * Handle class updates.
       *
       * @private
       */
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    /**
       * Disable icon toggle.
       *
       * @public
       */
    disable() {
        this.inputElement_.disabled = true;
        this.updateClasses_();
    }
    /**
       * Enable icon toggle.
       *
       * @public
       */
    enable() {
        this.inputElement_.disabled = false;
        this.updateClasses_();
    }
    /**
       * Check icon toggle.
       *
       * @public
       */
    check() {
        this.inputElement_.checked = true;
        this.updateClasses_();
    }
    /**
       * Uncheck icon toggle.
       *
       * @public
       */
    uncheck() {
        this.inputElement_.checked = false;
        this.updateClasses_();
    }
    /**
       * Initialize element.
       */
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = { TINY_TIMEOUT: 0.001 };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
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
    /**
       * Add blur.
       *
       * @private
       */
    blur_ = MaterialCheckbox.prototype.blur_;
    // Public methods.
    /**
       * Check the inputs toggle state and update display.
       *
       * @public
       */
    checkToggleState = MaterialCheckbox.prototype.checkToggleState;
    /**
       * Check the inputs disabled state and update display.
       *
       * @public
       */
    checkDisabled = MaterialCheckbox.prototype.checkDisabled;
}
window['MaterialIconToggle'] = MaterialIconToggle;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialIconToggle,
    classAsString: 'MaterialIconToggle',
    cssClass: 'mdl-js-icon-toggle',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for dropdown MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialMenu {
    element_;
    constructor(element) {
        this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
        this.boundItemClick_ = this.handleItemClick_.bind(this);

        this.boundForKeydown_ = this.handleForKeyboardEvent_.bind(this);
        this.boundForClick_ = this.handleForClick_.bind(this);

        basicConstructor(element, this); this.element_ = element;
    }
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {

            // Create container for the menu.
            var container = document.createElement('div');
            container.classList.add(MaterialMenu.cssClasses_.CONTAINER);
            this.element_.parentElement.insertBefore(container, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            container.appendChild(this.element_);
            this.container_ = container;
            // Create outline for the menu (shadow and background).
            var outline = document.createElement('div');
            outline.classList.add(MaterialMenu.cssClasses_.OUTLINE);
            this.outline_ = outline;
            container.insertBefore(outline, this.element_);
            // Find the "for" element and bind events to it.
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
            // Add ripple classes to each item, if the user has enabled ripples.
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.RIPPLE_EFFECT)) {
                this.element_.classList.add(MaterialMenu.cssClasses_.RIPPLE_IGNORE_EVENTS);
            }

            // Copy alignment classes to the container, so the outline can use them.
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
        // Add a tab index to the menu item.
        item.tabIndex = '-1';

        // Add interact listeners to the menu item.
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

    /**
       * Handles a click on the "for" element, by positioning the menu and then
       * toggling it.
       *
       * @param {Event} evt The event that fired.
       * @private
       */
    handleForClick_(evt) {
        if (this.element_ && this.forElement_) {
            var rect = this.forElement_.getBoundingClientRect();
            var forRect = this.forElement_.parentElement.getBoundingClientRect();
            if (this.element_.classList.contains(MaterialMenu.cssClasses_.UNALIGNED)) {
            } else if (this.element_.classList.contains(MaterialMenu.cssClasses_.BOTTOM_RIGHT)) {
                // Position below the "for" element, aligned to its right.
                this.container_.style.right = `${forRect.right - rect.right}px`;
                this.container_.style.top = `${this.forElement_.offsetTop + this.forElement_.offsetHeight}px`;
            } else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT)) {
                // Position above the "for" element, aligned to its left.
                this.container_.style.left = `${this.forElement_.offsetLeft}px`;
                this.container_.style.bottom = `${forRect.bottom - rect.top}px`;
            } else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
                // Position above the "for" element, aligned to its right.
                this.container_.style.right = `${forRect.right - rect.right}px`;
                this.container_.style.bottom = `${forRect.bottom - rect.top}px`;
            } else {
                // Default: position below the "for" element, aligned to its left.
                this.container_.style.left = `${this.forElement_.offsetLeft}px`;
                this.container_.style.top = `${this.forElement_.offsetTop + this.forElement_.offsetHeight}px`;
            }
        }
        this.toggle(evt);
    }
    /**
       * Handles a keyboard event on the "for" element.
       *
       * @param {Event} evt The event that fired.
       * @private
       */
    handleForKeyboardEvent_(evt) {
        if (this.element_ && this.container_ && this.forElement_) {
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}:not([disabled])`);
            if (items && items.length > 0 && this.container_.classList.contains(MaterialMenu.cssClasses_.IS_VISIBLE)) {
                if (evt.keyCode === MaterialMenu.Keycodes_.UP_ARROW) {
                    evt.preventDefault();
                    items[items.length - 1].focus();
                } else if (evt.keyCode === MaterialMenu.Keycodes_.DOWN_ARROW) {
                    evt.preventDefault();
                    items[0].focus();
                }
            }
        }
    }
    /**
       * Handles a keyboard event on an item.
       *
       * @param {Event} evt The event that fired.
       * @private
       */
    handleItemKeyboardEvent_(evt) {
        if (this.element_ && this.container_) {
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}:not([disabled])`);
            if (items && items.length > 0 && this.container_.classList.contains(MaterialMenu.cssClasses_.IS_VISIBLE)) {
                var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);
                if (evt.keyCode === MaterialMenu.Keycodes_.UP_ARROW) {
                    evt.preventDefault();
                    if (currentIndex > 0) {
                        items[currentIndex - 1].focus();
                    } else {
                        items[items.length - 1].focus();
                    }
                } else if (evt.keyCode === MaterialMenu.Keycodes_.DOWN_ARROW) {
                    evt.preventDefault();
                    if (items.length > currentIndex + 1) {
                        items[currentIndex + 1].focus();
                    } else {
                        items[0].focus();
                    }
                } else if (evt.keyCode === MaterialMenu.Keycodes_.SPACE || evt.keyCode === MaterialMenu.Keycodes_.ENTER) {
                    evt.preventDefault();
                    // Send mousedown and mouseup to trigger ripple.
                    var e = new MouseEvent(window.clickEvt);
                    evt.target.dispatchEvent(e);
                    e = new MouseEvent(window.clickEvt);
                    evt.target.dispatchEvent(e);
                    // Send click.
                    evt.target.click();
                } else if (evt.keyCode === MaterialMenu.Keycodes_.ESCAPE) {
                    evt.preventDefault();
                    this.hide();
                }
            }
        }
    }
    /**
       * Handles a click event on an item.
       *
       * @param {Event} evt The event that fired.
       * @private
       */
    handleItemClick_(evt) {
        if (evt.target.hasAttribute('disabled')) {
            evt.stopPropagation();
        } else {
            // Wait some time before closing menu, so the user can see the ripple.
            this.closing_ = true;
            window.setTimeout(function (evt_) {
                this.hide();
                this.closing_ = false;
            }.bind(this), this.Constant_.CLOSE_TIMEOUT);

            this.onItemSelected(evt.target);
        }
    }

    /**
       * Function called when an item is selected.
       *
       * @param {HTMLLIElement} option The option that was clicked
       */
    onItemSelected(option){return;}

    /**
       * Calculates the initial clip (for opening the menu) or final clip (for closing
       * it), and applies it. This allows us to animate from or to the correct point,
       * that is, the point it's aligned to in the "for" element.
       *
       * @param {number} height Height of the clip rectangle
       * @param {number} width Width of the clip rectangle
       * @private
       */
    applyClip_(height, width) {
        if (this.element_.classList.contains(MaterialMenu.cssClasses_.UNALIGNED)) {
            // Do not clip.
            this.element_.style.clip = '';
        } else if (this.element_.classList.contains(MaterialMenu.cssClasses_.BOTTOM_RIGHT)) {
            // Clip to the top right corner of the menu.
            this.element_.style.clip = `rect(0 ${width}px 0 ${width}px)`;
        } else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT)) {
            // Clip to the bottom left corner of the menu.
            this.element_.style.clip = `rect(${height}px 0 ${height}px 0)`;
        } else if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
            // Clip to the bottom right corner of the menu.
            this.element_.style.clip = `rect(${height}px ${width}px ${height}px ${width}px)`;
        } else {
            // Default: do not clip (same as clipping to the top left corner).
            this.element_.style.clip = '';
        }
    }
    /**
       * Cleanup function to remove animation listeners.
       *
       * @param {Event} evt
       * @private
       */
    removeAnimationEndListener_(evt) {
        evt.target.classList.remove(MaterialMenu.cssClasses_.IS_ANIMATING);
    }
    /**
       * Adds an event listener to clean up after the animation ends.
       *
       * @private
       */
    addAnimationEndListener_() {
        this.element_.addEventListener('transitionend', this.removeAnimationEndListener_);
        this.element_.addEventListener('webkitTransitionEnd', this.removeAnimationEndListener_);
    }
    /**
       * Displays the menu.
       *
       * @public
       */
    show(evt) {
        if (this.element_ && this.container_ && this.outline_) {
            // Measure the inner element.
            var height = this.element_.getBoundingClientRect().height;
            var width = this.element_.getBoundingClientRect().width;
            // Apply the inner element's size to the container and outline.
            this.container_.style.width = `${width}px`;
            this.container_.style.height = `${height}px`;
            this.outline_.style.width = `${width}px`;
            this.outline_.style.height = `${height}px`;
            var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;
            // Calculate transition delays for individual menu items, so that they fade
            // in one at a time.
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}`);
            for (var i_ = 0; i_ < items.length; i_++) {
                var itemDelay = null;
                if (this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_LEFT) || this.element_.classList.contains(MaterialMenu.cssClasses_.TOP_RIGHT)) {
                    itemDelay = `${(height - items[i_].offsetTop - items[i_].offsetHeight) / height * transitionDuration}s`;
                } else {
                    itemDelay = `${items[i_].offsetTop / height * transitionDuration}s`;
                }
                items[i_].style.transitionDelay = itemDelay;
            }
            // Apply the initial clip to the text before we start animating.
            this.applyClip_(height, width);
            // Wait for the next frame, turn on animation, and apply the final clip.
            // Also make it visible. This triggers the transitions.
            window.requestAnimationFrame(function () {
                this.element_.classList.add(MaterialMenu.cssClasses_.IS_ANIMATING);
                this.element_.style.clip = `rect(0 ${width}px ${height}px 0)`;
                this.container_.classList.add(MaterialMenu.cssClasses_.IS_VISIBLE);
            }.bind(this));
            // Clean up after the animation is complete.
            this.addAnimationEndListener_();
            // Add a click listener to the document, to close the menu.
            var callback = function (e) {
                // Check to see if the document is processing the same event that
                // displayed the menu in the first place. If so, do nothing.
                // Also check to see if the menu is in the process of closing itself, and
                // do nothing in that case.
                // Also check if the clicked element is a menu item
                // if so, do nothing.
                if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
                    document.removeEventListener(window.clickEvt, callback);
                    this.hide();
                }
            }.bind(this);
            document.addEventListener(window.clickEvt, callback);
        }
    }
    /**
       * Hides the menu.
       *
       * @public
       */
    hide() {
        if (this.element_ && this.container_ && this.outline_) {
            var items = this.element_.querySelectorAll(`.${MaterialMenu.cssClasses_.ITEM}`);
            // Remove all transition delays; menu items fade out concurrently.
            for (var i__ = 0; i__ < items.length; i__++) {
                items[i__].style.removeProperty('transition-delay');
            }
            // Measure the inner element.
            var rect = this.element_.getBoundingClientRect();
            var height = rect.height;
            var width = rect.width;
            // Turn on animation, and apply the final clip. Also make invisible.
            // This triggers the transitions.
            this.element_.classList.add(MaterialMenu.cssClasses_.IS_ANIMATING);
            this.applyClip_(height, width);
            this.container_.classList.remove(MaterialMenu.cssClasses_.IS_VISIBLE);
            // Clean up after the animation is complete.
            this.addAnimationEndListener_();
        }
    }
    /**
       * Displays or hides the menu, depending on current state.
       *
       * @public
       */
    toggle(evt) {
        if (this.container_.classList.contains(MaterialMenu.cssClasses_.IS_VISIBLE)) {
            this.hide();
        } else {
            this.show(evt);
        }
    }
    /**
        * Store constants in one place so they can be updated easily.
        *
        * @enum {string | number}
        * @private
        */
    Constant_ = {
        // Total duration of the menu animation.
        TRANSITION_DURATION_SECONDS: 0.3,
        // The fraction of the total duration we want to use for menu item animations.
        TRANSITION_DURATION_FRACTION: 0.8,
        // How long the menu stays open after choosing an option (so the user can see
        // the ripple).
        CLOSE_TIMEOUT: 150
    };
    /**
    * Keycodes, for code readability.
    *
    * @enum {number}
    * @private
    */
    static Keycodes_ = {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        UP_ARROW: 38,
        DOWN_ARROW: 40
    };
    /**
    * Store strings for class names defined by this component that are used in
    * JavaScript. This allows us to simply change it in one place should we
    * decide to modify at a later date.
    *
    * @enum {string}
    * @private
    */
    static cssClasses_ = {
        CONTAINER: 'mdl-menu__container',
        OUTLINE: 'mdl-menu__outline',
        ITEM: 'mdl-menu__item',
        ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
        RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE: 'mdl-ripple',
        // Statuses
        IS_UPGRADED: 'is-upgraded',
        IS_VISIBLE: 'is-visible',
        IS_ANIMATING: 'is-animating',
        // Alignment options
        BOTTOM_LEFT: 'mdl-menu--bottom-left',
        // This is the default.
        BOTTOM_RIGHT: 'mdl-menu--bottom-right',
        TOP_LEFT: 'mdl-menu--top-left',
        TOP_RIGHT: 'mdl-menu--top-right',
        UNALIGNED: 'mdl-menu--unaligned'
    };
}
window['MaterialMenu'] = MaterialMenu;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Progress MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialProgress {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Set the current progress of the progressbar.
       *
       * @param {number} p Percentage of the progress (0-100)
       * @public
       */
    setProgress(p) {
        if (this.element_.classList.contains(this.cssClasses_.INDETERMINATE_CLASS)) {
            return;
        }
        this.progressbar_.style.width = `${p}%`;
    }
    /**
       * Set the current progress of the buffer.
       *
       * @param {number} p Percentage of the buffer (0-100)
       * @public
       */
    setBuffer(p) {
        this.bufferbar_.style.width = `${p}%`;
        this.auxbar_.style.width = `${100 - p}%`;
    }
    /**
       * Initialize element.
       */
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {};
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
    cssClasses_ = { INDETERMINATE_CLASS: 'mdl-progress__indeterminate' };
}
window['MaterialProgress'] = MaterialProgress;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialProgress,
    classAsString: 'MaterialProgress',
    cssClass: 'mdl-js-progress',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Radio MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialRadio {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handle change of state.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onChange_(event) {
        // Since other radio buttons don't get change events, we need to look for
        // them to update their classes.
        var radios = document.getElementsByClassName(this.cssClasses_.JS_RADIO);
        for (var i_ = 0; i_ < radios.length; i_++) {
            var button = radios[i_].querySelector(`.${this.cssClasses_.RADIO_BTN}`);
            // Different name == different group, so no point updating those.
            if (button.getAttribute('name') === this.btnElement_.getAttribute('name') && typeof radios[i_]['MaterialRadio'] !== 'undefined') {
                radios[i_]['MaterialRadio'].updateClasses_();
            }
        }
    }
    /**
       * Handle focus.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle lost focus.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle mouseup.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onMouseup_(event) {
        this.blur_();
    }
    /**
       * Update classes.
       *
       * @private
       */
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    /**
       * Add blur.
       *
       * @private
       */
    blur_() {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this.btnElement_.blur();
        }.bind(this), this.Constant_.TINY_TIMEOUT);
    }
    // Public methods.
    /**
       * Check the components disabled state.
       *
       * @public
       */
    checkDisabled() {
        if (this.btnElement_.disabled) {
            this.element_.classList.add(this.cssClasses_.IS_DISABLED);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_DISABLED);
        }
    }
    /**
       * Check the components toggled state.
       *
       * @public
       */
    checkToggleState() {
        if (this.btnElement_.checked) {
            this.element_.classList.add(this.cssClasses_.IS_CHECKED);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_CHECKED);
        }
    }
    /**
       * Disable radio.
       *
       * @public
       */
    disable() {
        this.btnElement_.disabled = true;
        this.updateClasses_();
    }
    /**
       * Enable radio.
       *
       * @public
       */
    enable() {
        this.btnElement_.disabled = false;
        this.updateClasses_();
    }
    /**
       * Check radio.
       *
       * @public
       */
    check() {
        this.btnElement_.checked = true;
        this.onChange_(null);
    }
    /**
       * Uncheck radio.
       *
       * @public
       */
    uncheck() {
        this.btnElement_.checked = false;
        this.onChange_(null);
    }
    /**
       * Initialize element.
       */
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
    /**
        * Store constants in one place so they can be updated easily.
        *
        * @enum {string | number}
        * @private
        */
    Constant_ = { TINY_TIMEOUT: 0.001 };
    /**
        * Store strings for class names defined by this component that are used in
        * JavaScript. This allows us to simply change it in one place should we
        * decide to modify at a later date.
        *
        * @enum {string}
        * @private
        */
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

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialRadio,
    classAsString: 'MaterialRadio',
    cssClass: 'mdl-js-radio',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Slider MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialSlider {
    constructor(element) {
        this.element_ = element;
        // Browser feature detection.
        this.isIE_ = window.navigator.msPointerEnabled;
        // Initialize instance.
        this.init();
    }
    /**
       * Handle input on element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onInput_(event) {
        this.updateValueStyles_();
    }
    /**
       * Handle change on element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onChange_(event) {
        this.updateValueStyles_();
    }
    /**
       * Handle mouseup on element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onMouseUp_(event) {
        event.target.blur();
    }
    /**
       * Handle mousedown on container element.
       * This handler is purpose is to not require the use to click
       * exactly on the 2px slider element, as FireFox seems to be very
       * strict about this.
       *
       * @param {Event} event The event that fired.
       * @private
       * @suppress {missingProperties}
       */
    onContainerMouseDown_(event) {
        // If this click is not on the parent element (but rather some child)
        // ignore. It may still bubble up.
        if (event.target !== this.element_.parentElement) {
            return;
        }
        // Discard the original event and create a new event that
        // is on the slider element.
        event.preventDefault();
        var newEvent = new MouseEvent(window.clickEvt, {
            target: event.target,
            buttons: event.buttons,
            clientX: event.clientX,
            clientY: this.element_.getBoundingClientRect().y
        });
        this.element_.dispatchEvent(newEvent);
    }
    /**
       * Handle updating of values.
       *
       * @private
       */
    updateValueStyles_() {
        // Calculate and apply percentages to div structure behind slider.
        var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
        if (fraction === 0) {
            this.element_.classList.add(this.cssClasses_.IS_LOWEST_VALUE);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_LOWEST_VALUE);
        }
        if (!this.isIE_) {
            this.backgroundLower_.style.flex = fraction;
            this.backgroundLower_.style.webkitFlex = fraction;
            this.backgroundUpper_.style.flex = 1 - fraction;
            this.backgroundUpper_.style.webkitFlex = 1 - fraction;
        }
    }
    // Public methods.
    /**
       * Disable slider.
       *
       * @public
       */
    disable() {
        this.element_.disabled = true;
    }
    /**
       * Enable slider.
       *
       * @public
       */
    enable() {
        this.element_.disabled = false;
    }
    /**
       * Update slider value.
       *
       * @param {number} value The value to which to set the control (optional).
       * @public
       */
    change(value) {
        if (typeof value !== 'undefined') {
            this.element_.value = value;
        }
        this.updateValueStyles_();
    }
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {
            if (this.isIE_) {
                // Since we need to specify a very large height in IE due to
                // implementation limitations, we add a parent here that trims it down to
                // a reasonable size.
                var containerIE = document.createElement('div');
                containerIE.classList.add(this.cssClasses_.IE_CONTAINER);
                this.element_.parentElement.insertBefore(containerIE, this.element_);
                this.element_.parentElement.removeChild(this.element_);
                containerIE.appendChild(this.element_);
            } else {
                // For non-IE browsers, we need a div structure that sits behind the
                // slider and allows us to style the left and right sides of it with
                // different colors.
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {};
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
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
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSlider,
    classAsString: 'MaterialSlider',
    cssClass: 'mdl-js-slider',
    widget: true
});
/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Snackbar MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
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
    /**
       * Display the snackbar.
       *
       * @private
       */
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
    /**
       * Show the snackbar.
       *
       * @param {Object} data The data for the notification.
       * @public
       */
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
        } else {
            this.active = true;
            this.message_ = data['message'];
            if (data['timeout']) {
                this.timeout_ = data['timeout'];
            } else {
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
    /**
       * Check if the queue has items within it.
       * If it does, display the next entry.
       *
       * @private
       */
    checkQueue_() {
        if (this.queuedNotifications_.length > 0) {
            this.showSnackbar(this.queuedNotifications_.shift());
        }
    }
    /**
       * Cleanup the snackbar event listeners and accessibility attributes.
       *
       * @private
       */
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
    /**
       * Set the action handler hidden state.
       *
       * @param {boolean} value
       * @private
       */
    setActionHidden_(value) {
        if (value) {
            this.actionElement_.setAttribute('aria-hidden', 'true');
        } else {
            this.actionElement_.removeAttribute('aria-hidden');
        }
    }
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {
        // The duration of the snackbar show/hide animation, in ms.
        ANIMATION_LENGTH: 250
    };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
    cssClasses_ = {
        SNACKBAR: 'mdl-snackbar',
        MESSAGE: 'mdl-snackbar__text',
        ACTION: 'mdl-snackbar__action',
        ACTIVE: 'mdl-snackbar--active'
    };
}
window['MaterialSnackbar'] = MaterialSnackbar;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSnackbar,
    classAsString: 'MaterialSnackbar',
    cssClass: 'mdl-js-snackbar',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Spinner MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   * @constructor
   */
export class MaterialSpinner {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Auxiliary method to create a spinner layer.
       *
       * @param {number} index Index of the layer to be created.
       * @public
       */
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
    /**
       * Stops the spinner animation.
       * Public method for users who need to stop the spinner for any reason.
       *
       * @public
       */
    stop() {
        this.element_.classList.remove('is-active');
    }
    /**
       * Starts the spinner animation.
       * Public method for users who need to manually start the spinner for any reason
       * (instead of just adding the 'is-active' class to their markup).
       *
       * @public
       */
    start() {
        this.element_.classList.add('is-active');
    }
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {
            for (var i_ = 1; i_ <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i_++) {
                this.createLayer(i_);
            }
            this.element_.classList.add('is-upgraded');
        }
    }
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
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
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSpinner,
    classAsString: 'MaterialSpinner',
    cssClass: 'mdl-js-spinner',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Checkbox MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialSwitch {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handle change of state.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onChange_(event) {
        this.updateClasses_();
    }
    /**
       * Handle focus of element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle lost focus of element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle mouseup.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onMouseUp_(event) {
        this.blur_();
    }
    /**
       * Handle class updates.
       *
       * @private
       */
    updateClasses_() {
        this.checkDisabled();
        this.checkToggleState();
    }
    /**
       * Disable switch.
       *
       * @public
       */
    disable() {
        this.inputElement_.disabled = true;
        this.updateClasses_();
    }
    /**
       * Enable switch.
       *
       * @public
       */
    enable() {
        this.inputElement_.disabled = false;
        this.updateClasses_();
    }
    /**
       * Activate switch.
       *
       * @public
       */
    on() {
        this.inputElement_.checked = true;
        this.updateClasses_();
    }
    /**
       * Deactivate switch.
       *
       * @public
       */
    off() {
        this.inputElement_.checked = false;
        this.updateClasses_();
    }
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {
            this.inputElement_ = this.element_.querySelector(`.${this.cssClasses_.INPUT}`);
            //console.log(`this.element_.querySelector(\`.${this.cssClasses_.INPUT}\`); =`, this.inputElement_);
            //console.log(`this.element_ =`, this.element_);

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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = { TINY_TIMEOUT: 0.001 };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
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
    /**
       * Add blur.
       *
       * @private
       */
    blur_ = MaterialCheckbox.prototype.blur_;
    // Public methods.
    /**
       * Check the components disabled state.
       *
       * @public
       */
    checkDisabled = MaterialCheckbox.prototype.checkDisabled;
    /**
       * Check the components toggled state.
       *
       * @public
       */
    checkToggleState = MaterialCheckbox.prototype.checkToggleState;
}
window['MaterialSwitch'] = MaterialSwitch;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSwitch,
    classAsString: 'MaterialSwitch',
    cssClass: 'mdl-js-switch',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Tabs MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
export class MaterialTabs {
    constructor(element) {
        // Stores the HTML element.
        this.element_ = element;
        // Initialize instance.
        this.init();
    }
    /**
       * Handle clicks to a tabs component
       *
       * @private
       */
    initTabs_() {
        if (this.element_.classList.contains(this.cssClasses_.MDL_JS_RIPPLE_EFFECT)) {
            this.element_.classList.add(this.cssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
        }
        // Select element tabs, document panels
        this.tabs_ = this.element_.querySelectorAll(`.${this.cssClasses_.TAB_CLASS}`);
        this.panels_ = this.element_.querySelectorAll(`.${this.cssClasses_.PANEL_CLASS}`);
        // Create new tabs for each tab element
        for (var i_ = 0; i_ < this.tabs_.length; i_++) {
            new MaterialTab(this.tabs_[i_], this);
        }
        this.element_.classList.add(this.cssClasses_.UPGRADED_CLASS);
    }
    /**
       * Reset tab state, dropping active classes
       *
       * @private
       */
    resetTabState_() {
        for (var k = 0; k < this.tabs_.length; k++) {
            this.tabs_[k].classList.remove(this.cssClasses_.ACTIVE_CLASS);
        }
    }
    /**
       * Reset panel state, dropping active classes
       *
       * @private
       */
    resetPanelState_() {
        for (var j = 0; j < this.panels_.length; j++) {
            this.panels_[j].classList.remove(this.cssClasses_.ACTIVE_CLASS);
        }
    }
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {
            this.initTabs_();
        }
    }
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string}
       * @private
       */
    Constant_ = {};
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
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
/**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {Element} tab The HTML element for the tab.
   * @param {MaterialTabs} ctx The MaterialTabs object that owns the tab.
   */
export class MaterialTab{
    constructor(tab, ctx) {
        if (!tab) return;
        tab.addEventListener(window.clickEvt, function (e) {
            if (tab.getAttribute('href').charAt(0) === '#') {
                e.preventDefault();
                var href = tab.href.split('#')[1];
                var panel = ctx.element_.querySelector(`#${  href}`);
                ctx.resetTabState_();
                ctx.resetPanelState_();
                tab.classList.add(ctx.cssClasses_.ACTIVE_CLASS);
                panel.classList.add(ctx.cssClasses_.ACTIVE_CLASS);
            }
        });

        if (!ctx.element_.classList.contains(ctx.cssClasses_.MDL_JS_RIPPLE_EFFECT)) return;

        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(ctx.cssClasses_.MDL_RIPPLE_CONTAINER);
        rippleContainer.classList.add(ctx.cssClasses_.MDL_JS_RIPPLE_EFFECT);
        var ripple = document.createElement('span');
        ripple.classList.add(ctx.cssClasses_.MDL_RIPPLE);
        rippleContainer.appendChild(ripple);
        tab.appendChild(rippleContainer);
    }
}
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialTabs,
    classAsString: 'MaterialTabs',
    cssClass: 'mdl-js-tabs'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Textfield MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialTextfield {
    /** @param {HTMLInputElement} element */
    constructor(element) {
        this.element_ = element;
        this.maxRows = this.Constant_.NO_MAX_ROWS;
        // Initialize instance.
        this.init();
    }
    /**
       * Handle input being entered.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onKeyDown_(event) {
        var currentRowCount = event.target.value.split('\n').length;
        if (event.keyCode === 13 && currentRowCount >= this.maxRows) {
            event.preventDefault();
        }
    }
    /**
       * Handle focus.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onFocus_(event) {
        this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle lost focus.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onBlur_(event) {
        this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
    }
    /**
       * Handle reset event from out side.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    onReset_(event) {
        this.updateClasses_();
    }
    /**
       * Handle class updates.
       *
       * @private
       */
    updateClasses_() {
        this.checkDisabled();
        this.checkValidity();
        this.checkDirty();
        this.checkFocus();
    }
    // Public methods.
    /**
       * Check the disabled state and update field accordingly.
       *
       * @public
       */
    checkDisabled() {
        if (this.input_.disabled) {
            this.element_.classList.add(this.cssClasses_.IS_DISABLED);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_DISABLED);
        }
    }
    /**
      * Check the focus state and update field accordingly.
      *
      * @public
      */
    checkFocus() {
        if (this.element_.querySelector(':focus')) {
            this.element_.classList.add(this.cssClasses_.IS_FOCUSED);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_FOCUSED);
        }
    }
    /**
       * Check the validity state and update field accordingly.
       *
       * @public
       */
    checkValidity() {
        if (this.input_.validity) {
            if (this.input_.validity.valid) {
                this.element_.classList.remove(this.cssClasses_.IS_INVALID);
            } else {
                this.element_.classList.add(this.cssClasses_.IS_INVALID);
            }
        }
    }
    /**
       * Check the dirty state and update field accordingly.
       *
       * @public
       */
    checkDirty() {
        if (this.input_.value && this.input_.value.length > 0) {
            this.element_.classList.add(this.cssClasses_.IS_DIRTY);
        } else {
            this.element_.classList.remove(this.cssClasses_.IS_DIRTY);
        }
    }
    /**
       * Disable text field.
       *
       * @public
       */
    disable() {
        this.input_.disabled = true;
        this.updateClasses_();
    }
    /**
       * Enable text field.
       *
       * @public
       */
    enable() {
        this.input_.disabled = false;
        this.updateClasses_();
    }
    /**
       * Update text field value.
       *
       * @param {string} value The value to which to set the control (optional).
       * @public
       */
    change(value) {
        this.input_.value = value || '';
        this.updateClasses_();
    }
    /**
       * Initialize element.
       */
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
                    // TODO: This should handle pasting multi line text.
                    // Currently doesn't.
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {
        NO_MAX_ROWS: -1,
        MAX_ROWS_ATTRIBUTE: 'maxrows'
    };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
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
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialTextfield,
    classAsString: 'MaterialTextfield',
    cssClass: 'mdl-js-textfield',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Tooltip MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialTooltip {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handle mouseenter for tooltip.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    handleMouseEnter_(event) {
        var props = event.target.getBoundingClientRect();
        var top = props.top + props.height / 2;
        var left = (props.left + props.width / 2) - 256;
        var marginLeft = -1 * (this.element_.offsetWidth / 2);

        //console.log(`[BCD-Material.Debug] window.innerWidth: ${window.innerWidth}, use desktop layout: ${window.innerWidth >= 1025}`);
        // Modification by BellCube to adjust for the navigation drawer

        if (left + marginLeft < 16) marginLeft += Math.abs(16 - (left + marginLeft));

        var marginTop = -1 * (this.element_.offsetHeight / 2);
        if (this.element_.classList.contains(this.cssClasses_.LEFT) || this.element_.classList.contains(this.cssClasses_.RIGHT)) {
            left = props.width / 2;
            if (top + marginTop < 0) {
                this.element_.style.top = '0';
                this.element_.style.marginTop = '0';
            } else {
                this.element_.style.top = `${top}px`;
                this.element_.style.marginTop = `${marginTop}px`;
            }
        } else {
            if (left + marginLeft < 0) {
                this.element_.style.left = '0';
                this.element_.style.marginLeft = '0';
            } else {
                this.element_.style.left = `${left}px`;
                this.element_.style.marginLeft = `${marginLeft}px`;
            }
        }
        if (this.element_.classList.contains(this.cssClasses_.TOP)) {
            this.element_.style.top = `${props.top - this.element_.offsetHeight - 10}px`;
        } else if (this.element_.classList.contains(this.cssClasses_.RIGHT)) {
            this.element_.style.left = `${props.left + props.width + 10}px`;
        } else if (this.element_.classList.contains(this.cssClasses_.LEFT)) {
            this.element_.style.left = `${props.left - this.element_.offsetWidth - 10}px`;
        } else {
            this.element_.style.top = `${props.top + props.height + 10}px`;
        }

        this.element_.classList.add(this.cssClasses_.IS_ACTIVE);
    }
    /**
       * Hide tooltip on mouseleave or scroll
       *
       * @private
       */
    hideTooltip_() {
        this.element_.classList.remove(this.cssClasses_.IS_ACTIVE);
    }
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {
            var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');
            if (forElId) {
                this.forElement_ = document.getElementById(forElId);
            }
            if (this.forElement_) {
                // It's left here because it prevents accidental text selection on Android
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {};
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
    cssClasses_ = {
        IS_ACTIVE: 'is-active',
        BOTTOM: 'mdl-tooltip--bottom',
        LEFT: 'mdl-tooltip--left',
        RIGHT: 'mdl-tooltip--right',
        TOP: 'mdl-tooltip--top'
    };
}
window['MaterialTooltip'] = MaterialTooltip;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialTooltip,
    classAsString: 'MaterialTooltip',
    cssClass: 'mdl-tooltip'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Layout MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialLayout {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handles scrolling on the content.
       *
       * @private
       */
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
        } else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(MaterialLayout.cssClasses.IS_COMPACT)) {
            this.header_.classList.remove(MaterialLayout.cssClasses.CASTING_SHADOW);
            this.header_.classList.remove(MaterialLayout.cssClasses.IS_COMPACT);
            if (headerVisible) {
                this.header_.classList.add(MaterialLayout.cssClasses.IS_ANIMATING);
            }
        }
    }
    /**
       * Handles a keyboard event on the drawer.
       *
       * @param {KeyboardEvent} evt The event that fired.
       * @private
       */
    keyboardEventHandler_(evt) {
        // Only react when the drawer is open.
        if (evt.keyCode === this.Keycodes_.ESCAPE && this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN)) {
            this.toggleDrawer();
        }
    }
    /**
       * Handles changes in screen size.
       *
       * @private
       */
    screenSizeHandler_() {
        if (this.screenSizeMediaQuery_.matches) {
            this.element_.classList.add(MaterialLayout.cssClasses.IS_SMALL_SCREEN);
        } else {
            this.element_.classList.remove(MaterialLayout.cssClasses.IS_SMALL_SCREEN);
            // Collapse drawer (if any) when moving to a large screen size.
            if (this.drawer_) {
                this.drawer_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
                this.obfuscator_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
            }
        }
    }
    /**
       * Handles events of drawer button.
       *
       * @param {Event} evt The event that fired.
       * @private
       */
    drawerToggleHandler_(evt) {

        if (evt && evt.type === 'keydown') {
            if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
                // prevent scrolling in drawer nav
                evt.preventDefault();
            } else {
                // prevent other keys
                return;
            }
        }

        this.toggleDrawer();
    }
    /**
       * Handles (un)setting the `is-animating` class
       *
       * @private
       */
    headerTransitionEndHandler_() {
        this.header_.classList.remove(MaterialLayout.cssClasses.IS_ANIMATING);
    }
    /**
       * Handles expanding the header on click
       *
       * @private
       */
    headerClickHandler_() {
        if (this.header_.classList.contains(MaterialLayout.cssClasses.IS_COMPACT)) {
            this.header_.classList.remove(MaterialLayout.cssClasses.IS_COMPACT);
            this.header_.classList.add(MaterialLayout.cssClasses.IS_ANIMATING);
        }
    }
    /**
       * Reset tab state, dropping active classes
       *
       * @private
       */
    resetTabState_(tabBar) {
        for (var k = 0; k < tabBar.length; k++) {
            tabBar[k].classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
        }
    }
    /**
       * Reset panel state, dropping active classes
       *
       * @private
       */
    resetPanelState_(panels) {
        for (var j = 0; j < panels.length; j++) {
            panels[j].classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
        }
    }
    /**
      * Toggle drawer state
      *
      * @public
      */
    toggleDrawer() {
        this.drawer_.classList.toggle(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        this.obfuscator_.classList.toggle(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        // Set accessibility properties.
        if (this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN)) this.openDrawer(false);
        else this.closeDrawer(false);
    }

    openDrawer(doNewClass = true) {
        if (doNewClass) {
            if (this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN)) return;
            this.drawer_.classList.add(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
            this.obfuscator_.classList.add(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        }

        const drawerEvent = new CustomEvent('drawerOpen', {bubbles: true});
        this.drawer_.dispatchEvent(drawerEvent);

        var drawerButton = this.element_.querySelector(`.${MaterialLayout.cssClasses.DRAWER_BTN}`);
        drawerButton.setAttribute('aria-expanded', 'true');

        const elemToFocusNextSibling = this.drawer_.querySelector('.mdl-navigation__link');
        if (elemToFocusNextSibling && elemToFocusNextSibling.previousSibling && elemToFocusNextSibling.previousElementSibling.focus){
            elemToFocusNextSibling.previousElementSibling.setAttribute('tabindex', '0');
            elemToFocusNextSibling.previousElementSibling.focus({preventScroll:true});
            requestAnimationFrame(() => {requestAnimationFrame(() => {elemToFocusNextSibling.previousElementSibling.removeAttribute('tabindex');});});
        } else
            console.error("Ruh roh! No focusable elements in the drawer!", elemToFocusNextSibling, elemToFocusNextSibling.previousElementSibling);
    }

    closeDrawer(doNewClass = true) {
        if (doNewClass) {
            if (!this.drawer_.classList.contains(MaterialLayout.cssClasses.IS_DRAWER_OPEN)) return;
            this.drawer_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
            this.obfuscator_.classList.remove(MaterialLayout.cssClasses.IS_DRAWER_OPEN);
        }

        const drawerEvent = new CustomEvent('drawerClose', {bubbles: true});
        this.drawer_.dispatchEvent(drawerEvent);

        var drawerButton = this.element_.querySelector(`.${MaterialLayout.cssClasses.DRAWER_BTN}`);
        drawerButton.setAttribute('aria-expanded', 'false');
        drawerButton.focus({preventScroll:true});

        document.documentElement.classList.remove('drawer-init-open');
        window.startWithDrawer = false;
    }
    /**
       * Initialize element.
       */
    init() {
        if (!this.element_) return;
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
                // when page is loaded from back/forward cache
                // trigger repaint to let layout scroll in safari
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
            } else if (this.header_.classList.contains(MaterialLayout.cssClasses.HEADER_WATERFALL)) {
                mode = this.Mode_.WATERFALL;
                this.header_.addEventListener('transitionend', this.headerTransitionEndHandler_.bind(this));
                this.header_.addEventListener(window.clickEvt, this.headerClickHandler_.bind(this));
            } else if (this.header_.classList.contains(MaterialLayout.cssClasses.HEADER_SCROLL)) {
                mode = this.Mode_.SCROLL;
                container.classList.add(MaterialLayout.cssClasses.HAS_SCROLLING_HEADER);
            }
            if (mode === this.Mode_.STANDARD) {
                this.header_.classList.add(MaterialLayout.cssClasses.CASTING_SHADOW);
                if (this.tabBar_) {
                    this.tabBar_.classList.add(MaterialLayout.cssClasses.CASTING_SHADOW);
                }
            } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
                this.header_.classList.remove(MaterialLayout.cssClasses.CASTING_SHADOW);
                if (this.tabBar_) {
                    this.tabBar_.classList.remove(MaterialLayout.cssClasses.CASTING_SHADOW);
                }
            } else if (mode === this.Mode_.WATERFALL) {
                // Add and remove shadows depending on scroll position.
                // Also add/remove auxiliary class for styling of the compact version of
                // the header.
                this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
                this.contentScrollHandler_();
            }
        }
        // Add drawer toggling button to our layout, if we have an openable drawer.
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
            //console.debug('titleElement', titleElement);
            if (titleElement) {
                titleElement.setAttribute('role', 'button');
                titleElement.setAttribute('tabindex', '-1');
                titleElement.addEventListener(window.clickEvt, this.drawerToggleHandler_.bind(this));
                titleElement.addEventListener('keydown', this.drawerToggleHandler_.bind(this));
            }

            if (this.drawer_.classList.contains(MaterialLayout.cssClasses.ON_LARGE_SCREEN)) {
                //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
                drawerButton.classList.add(MaterialLayout.cssClasses.ON_LARGE_SCREEN);
            } else if (this.drawer_.classList.contains(MaterialLayout.cssClasses.ON_SMALL_SCREEN)) {
                //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
                drawerButton.classList.add(MaterialLayout.cssClasses.ON_SMALL_SCREEN);
            }
            // Add a class if the layout has a drawer, for altering the left padding.
            // Adds the HAS_DRAWER to the elements since this.header_ may or may
            // not be present.
            this.element_.classList.add(MaterialLayout.cssClasses.HAS_DRAWER);
            // If we have a fixed header, add the button to the header rather than
            // the layout.
            if (this.element_.classList.contains(MaterialLayout.cssClasses.FIXED_HEADER)) {
                this.header_.insertBefore(drawerButton, this.header_.firstChild);
            } else {
                this.element_.insertBefore(drawerButton, this.content_);
            }

            this.obfuscator_ = document.querySelector('.mdl-layout__obfuscator') ?? document.createElement('div');
            this.obfuscator_.classList.add('mdl-layout__obfuscator');
            this.element_.appendChild(this.obfuscator_);

            if (!this.obfuscator_) throw new Error('MDL: No obfuscator found!');

            drawerButton.addEventListener(window.clickEvt, this.drawerToggleHandler_.bind(this));
            drawerButton.addEventListener('keydown', this.drawerToggleHandler_.bind(this));

            this.obfuscator_.addEventListener(window.clickEvt, this.drawerToggleHandler_.bind(this));

            document.addEventListener('keydown', this.keyboardEventHandler_.bind(this));

            // Start with drawer open or closed depending on a global (Window) variable
            if (window.startWithDrawer) {
                this.openDrawer(true);
            }
            else this.closeDrawer(false);
            setTimeout(()=>{
                if (window.startWithDrawer) this.closeDrawer(true);
                if (window.startWithDrawer) this.closeDrawer(false);
            }, 100);
        }
        // Keep an eye on screen size, and add/remove auxiliary class for styling
        // of small screens.
        this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
        this.screenSizeHandler_();
        // Initialize tabs, if any.
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
            // Add and remove tab buttons depending on scroll position and total
            // window size.
            var tabUpdateHandler = function () {
                if (this.tabBar_.scrollLeft > 0) {
                    leftButton.classList.add(MaterialLayout.cssClasses.IS_ACTIVE);
                } else {
                    leftButton.classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
                }
                if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
                    rightButton.classList.add(MaterialLayout.cssClasses.IS_ACTIVE);
                } else {
                    rightButton.classList.remove(MaterialLayout.cssClasses.IS_ACTIVE);
                }
            }.bind(this);
            this.tabBar_.addEventListener('scroll', tabUpdateHandler);
            tabUpdateHandler();
            // Update tabs when the window resizes.
            var windowResizeHandler = function () {
                // Use timeouts to make sure it doesn't happen too often.
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
            // Select element tabs, document panels
            var tabs = this.tabBar_.querySelectorAll(`.${MaterialLayout.cssClasses.TAB}`);
            var panels = this.content_.querySelectorAll(`.${MaterialLayout.cssClasses.PANEL}`);
            // Create new tabs for each tab element
            for (var i_ = 0; i_ < tabs.length; i_++) {
                new MaterialLayoutTab(tabs[i_], tabs, panels, this);
            }
        }
        this.element_.classList.add(MaterialLayout.cssClasses.IS_UPGRADED);
    }
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {
        MAX_WIDTH: '(max-width: 1024px)',
        TAB_SCROLL_PIXELS: 100,
        RESIZE_TIMEOUT: 100,
        MENU_ICON: '&#xE5D2;',
        CHEVRON_LEFT: 'chevron_left',
        CHEVRON_RIGHT: 'chevron_right'
    };
    /**
       * Keycodes, for code readability.
       *
       * @enum {number}
       * @private
       */
    Keycodes_ = {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32
    };
    /**
       * Modes.
       *
       * @enum {number}
       * @private
       */
    Mode_ = {
        STANDARD: 0,
        SEAMED: 1,
        WATERFALL: 2,
        SCROLL: 3
    };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
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
/**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {HTMLElement} tab The HTML element for the tab.
   * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
   * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
   * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
   */
export class MaterialLayoutTab{
    constructor(tab, tabs, panels, layout) {
        /**
        * Auxiliary method to programmatically select a tab in the UI.
        */
        function selectTab() {
            var href = tab.href.split('#')[1];
            var panel = layout.content_.querySelector(`#${  href}`);
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
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialLayout,
    classAsString: 'MaterialLayout',
    cssClass: 'mdl-js-layout'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Data Table Card MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
export class MaterialDataTable {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Generates and returns a function that toggles the selection state of a
       * single row (or multiple rows).
       *
       * @param {Element} checkbox Checkbox that toggles the selection state.
       * @param {Element} row Row to toggle when checkbox changes.
       * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
       * @private
       */
    selectRow_(checkbox, row, opt_rows) {
        if (row) {
            return function () {
                if (checkbox.checked) {
                    row.classList.add(this.cssClasses_.IS_SELECTED);
                } else {
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
                } else {
                    for (i_ = 0; i_ < opt_rows.length; i_++) {
                        el = opt_rows[i_].querySelector('td').querySelector('.mdl-checkbox');
                        el['MaterialCheckbox'].uncheck();
                        opt_rows[i_].classList.remove(this.cssClasses_.IS_SELECTED);
                    }
                }
            }.bind(this);
        }
    }
    /**
       * Creates a checkbox for a single or or multiple rows and hooks up the
       * event handling.
       *
       * @param {Element} row Row to toggle when checkbox changes.
       * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
       * @private
       */
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
        } else if (opt_rows) {
            checkbox.addEventListener('change', this.selectRow_(checkbox, null, opt_rows));
        }
        label.appendChild(checkbox);
        componentHandler.upgradeElement(label, 'MaterialCheckbox');
        return label;
    }
    /**
       * Initialize element.
       */
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
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {};
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
    cssClasses_ = {
        DATA_TABLE: 'mdl-data-table',
        SELECTABLE: 'mdl-data-table--selectable',
        SELECT_ELEMENT: 'mdl-data-table__select',
        IS_SELECTED: 'is-selected',
        IS_UPGRADED: 'is-upgraded'
    };
}
window['MaterialDataTable'] = MaterialDataTable;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialDataTable,
    classAsString: 'MaterialDataTable',
    cssClass: 'mdl-js-data-table'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Ripple MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialRipple {
    constructor(element) { basicConstructor(element, this); }
    /**
       * Handle mouse / finger down on element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    downHandler_(event) {
        if (this.rippleElement_){
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
        } else {
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
            // Check if we are handling a keyboard click.
            if (event.clientX === 0 && event.clientY === 0) {
                x = Math.round(bound.width / 2);
                y = Math.round(bound.height / 2);
            } else {
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
    /**
       * Handle mouse / finger up on element.
       *
       * @param {Event} event The event that fired.
       * @private
       */
    upHandler_(event) {
        // Don't fire for the artificial "mouseup" generated by a double-click.
        if (event && event.detail !== 2) {
            // Allow a repaint to occur before removing this class, so the animation
            // shows for tap events, which seem to trigger a mouseup too soon after
            // mousedown.
            window.setTimeout(function () {
                if (this.rippleElement_) this.rippleElement_.classList.remove(this.cssClasses_.IS_VISIBLE);
            }.bind(this), 0);
        }
    }
    recentering;
    /**
       * Initialize element.
       */
    init() {
        if (this.element_) {
            this.recentering = this.element_.classList.contains(this.cssClasses_.RIPPLE_CENTER);
            if (!this.element_.classList.contains(this.cssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
                this.rippleElement_ = this.element_.querySelector(`.${this.cssClasses_.RIPPLE}`);
                this.frameCount_ = 0;
                this.rippleSize_ = 0;
                this.x_ = 0;
                this.y_ = 0;
                // Touch start produces a compat mouse down event, which would cause a
                // second ripples. To avoid that, we use this property to ignore the first
                // mouse down after a touch start.
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
    /** Getter for frameCount_.
        * @return {number} the frame count.
        */
    getFrameCount(){
        return this.frameCount_;
    }
    /**
        * Setter for frameCount_.
        * @param {number} fC the frame count.
        * @typedef {Function}
        */
    setFrameCount(fC){
        this.frameCount_ = fC;
    }
    /**
        * Getter for rippleElement_.
        * @return {Element} the ripple element.
        */
    getRippleElement() {
        return this.rippleElement_;
    }
    /**
        * Sets the ripple X and Y coordinates.
        * @param  {number} newX the new X coordinate
        * @param  {number} newY the new Y coordinate
        */
    setRippleXY(newX, newY) {
        this.x_ = newX;
        this.y_ = newY;
    }
    /**
        * Sets the ripple styles.
        * @param  {boolean} start whether or not this is the start frame.
        */
    setRippleStyles(start) {
        if (this.rippleElement_ !== null) {
            var transformString;
            var scale;
            var size;
            var offset = `translate(${this.x_}px,${this.y_}px)`;
            if (start) {
                scale = this.Constant_.INITIAL_SCALE;
                size = this.Constant_.INITIAL_SIZE;
            } else {
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
            } else {
                this.rippleElement_.classList.add(this.cssClasses_.IS_ANIMATING);
            }
        }
    }
    /**
        * Handles an animation frame.
        */
    animFrameHandler() {
        if (this.frameCount_-- > 0) {
            window.requestAnimationFrame(this.animFrameHandler.bind(this));
        } else {
            this.setRippleStyles(false);
        }
    }
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
    Constant_ = {
        INITIAL_SCALE: 'scale(0.0001, 0.0001)',
        INITIAL_SIZE: '1px',
        INITIAL_OPACITY: '0.4',
        FINAL_OPACITY: '0',
        FINAL_SCALE: ''
    };
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
    cssClasses_ = {
        RIPPLE_CENTER: 'mdl-ripple--center',
        RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
        RIPPLE: 'mdl-ripple',
        IS_ANIMATING: 'is-animating',
        IS_VISIBLE: 'is-visible'
    };
}
window['MaterialRipple'] = MaterialRipple;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialRipple,
    classAsString: 'MaterialRipple',
    cssClass: 'mdl-js-ripple-effect',
    widget: false
});


//* INIT

export function materialInit() {
  'use strict';

  /**
   * Performs a "Cutting the mustard" test. If the browser supports the features
   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
   * components requiring JavaScript.
   */
  if ('classList' in document.createElement('div') &&
      'querySelector' in document &&
      'addEventListener' in window && Array.prototype.forEach) {
    document.documentElement.classList.add('mdl-js');
    componentHandler.upgradeAllRegistered();
  } else {
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.upgradeElement = function() {return;};
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.register = function() {return;};
  }
}
materialInit();
//window.bcd_init_functions.material = materialInit;
