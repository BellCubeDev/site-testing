export function materialInit(): void;
export const componentHandler: {

   /**
    * Searches registered components for a class we are interested in using.
    * Optionally replaces a match with passed object if specified.
    *
    * @param name - The name of a class we want to use.
    * @param replace - Optional object to replace match with.
    */
   private findRegisteredClass_(name: string, replace?: IComponentConfig): Record<string, unknown>|boolean;

   /**
    * Returns an array of the classNames of the upgraded classes on the element.
    *
    * @param element - The element to fetch data from.
    */
   private getUpgradedListOfElement_(element: Element): string[],

   /**
    * Returns true if the given element has already been upgraded for the given
    * class.
    *
    * @param element - The element we want to check.
    * @param jsClass - The class to check for.
    */
   private isElementUpgraded_(element: Element, jsClass: string): boolean,

   /**
    * Create an event object.
    *
    * @param eventType - The type name of the event.
    * @param bubbles - Whether the event should bubble up the DOM.
    * @param cancelable - Whether the event can be canceled.
    */
   private createEvent_(eventType: string, bubbles: boolean, cancelable: boolean): Event,

   /**
    * Searches existing DOM for elements of our component type and upgrades them
    * if they have not already been upgraded.
    *
    * @param jsClass - the programmatic name of the element class we need to create a new instance of.
    * @param cssClass - the name of the CSS class elements of this type will have.
    */
   upgradeDom(jsClass?: string, cssClass?: string),

   /**
    * Upgrades a specific element rather than all in the DOM.
    *
    * @param element - The element we wish to upgrade.
    * @param jsClass - Optional name of the class we want to upgrade the element to.
    */
   upgradeElement(element: Element, jsClass?: string),

   /**
    * Upgrades a specific list of elements rather than all in the DOM.
    *
    * @param elements - The elements we wish to upgrade.
    */
   upgradeElements(elements: Element|Element[]|NodeList|HTMLCollection),

   /** Registers a class for future use and attempts to upgrade existing DOM. */
   register(config: IComponentConfigPublic),

   /**
    * Allows user to be alerted to any upgrades that are performed for a given component type
    *
    * @param jsClass - The class name of the MDL component we wish to hook into for any upgrades performed.
    * @param callback - The function to call upon an upgrade. This function should expect 1 parameter - the HTMLElement which got upgraded.
    */
   registerUpgradedCallback(jsClass: string, callback: (element: HTMLElement) => unknown),

   /**
    * Upgrades all registered components found in the current DOM. This is automatically called on window load.
    */
   upgradeAllRegistered(),

   /**
    * Check the component for the downgrade method.
    * Execute if found.
    * Remove component from createdComponents list.
    */
   deconstructComponent(component?: IComponent),

   /** Downgrade either a given node, an array of nodes, or a NodeList. */
   downgradeNodes(nodes: Node|Node[]|NodeList),
};


/** Describes the type of a registered component type managed by componentHandler. */
interface IComponentConfigPublic {
   constructor: Function,
   classAsString: string,
   cssClass: string,
   widget: string|boolean|undefined
}

/** Describes the type of a registered component type managed by componentHandler. */
interface IComponentConfig {
   constructor: Function,
   className: string,
   cssClass: string,
   widget: string|boolean,
   callbacks: ((element: HTMLElement)=>unknown)[]
}

/** Created component (i.e., upgraded element) type as managed by componentHandler. */
interface IComponent {
   element_: HTMLElement,
   className: string,
   classAsString: string,
   cssClass: string,
   widget: string
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
    constructor(element: any);
    element_: any;
    /**
       * Handle blur of element.
       *
       * @param {Event} event The event that fired.
       */
    blurHandler_;
    /**
       * Disable button.
       *
       * @public
       */
    public disable(): void;
    /**
       * Enable button.
       *
       * @public
       */
    public enable(): void;
    /**
       * Initialize element.
       */
    init(): void;
    boundRippleBlurHandler: any;
    rippleElement_: HTMLSpanElement;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Checkbox MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialCheckbox {
    /**
    * Store constants in one place so they can be updated easily.
    *
    * @enum {string | number}
    */
    static Constant_;
    /**
    * Store strings for class names defined by this component that are used in
    * JavaScript. This allows us to simply change it in one place should we
    * decide to modify at a later date.
    *
    * @enum {string}
    */
    static cssClasses_;
    constructor(element: any);
    /**
    * Handle change of state.
    *
    * @param {Event} event The event that fired.
    */
    onChange_;
    /**
    * Handle focus of element.
    *
    * @param {Event} event The event that fired.
    */
    onFocus_;
    /**
    * Handle lost focus of element.
    *
    * @param {Event} event The event that fired.
    */
    onBlur_;
    /**
    * Handle mouseup.
    *
    * @param {Event} event The event that fired.
    */
    onMouseUp_;
    /**
    * Handle class updates.
    *
    */
    updateClasses_;
    /**
    * Add blur.
    *
    */
    blur_;
    /**
    * Check the inputs toggle state and update display.
    *
    * @public
    */
    public checkToggleState(): void;
    /**
    * Check the inputs disabled state and update display.
    *
    * @public
    */
    public checkDisabled(): void;
    /**
    * Disable checkbox.
    *
    * @public
    */
    public disable(): void;
    /**
    * Enable checkbox.
    *
    * @public
    */
    public enable(): void;
    /**
    * Check checkbox.
    *
    * @public
    */
    public check(): void;
    /**
    * Uncheck checkbox.
    *
    * @public
    */
    public uncheck(): void;
    /**
    * Initialize element.
    */
    init(): void;
    inputElement_: any;
    rippleContainerElement_: HTMLSpanElement;
    boundRippleMouseUp: any;
    boundInputOnChange: any;
    boundInputOnFocus: any;
    boundInputOnBlur: any;
    boundElementMouseUp: any;
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
   * Class constructor for icon toggle MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialIconToggle {
    constructor(element: any);
    /**
       * Handle change of state.
       *
       * @param {Event} event The event that fired.
       */
    onChange_;
    /**
       * Handle focus of element.
       *
       * @param {Event} event The event that fired.
       */
    onFocus_;
    /**
       * Handle lost focus of element.
       *
       * @param {Event} event The event that fired.
       */
    onBlur_;
    /**
       * Handle mouseup.
       *
       * @param {Event} event The event that fired.
       */
    onMouseUp_;
    /**
       * Handle class updates.
       *
       */
    updateClasses_;
    /**
       * Disable icon toggle.
       *
       * @public
       */
    public disable(): void;
    /**
       * Enable icon toggle.
       *
       * @public
       */
    public enable(): void;
    /**
       * Check icon toggle.
       *
       * @public
       */
    public check(): void;
    /**
       * Uncheck icon toggle.
       *
       * @public
       */
    public uncheck(): void;
    /**
       * Initialize element.
       */
    init(): void;
    inputElement_: any;
    rippleContainerElement_: HTMLSpanElement;
    boundRippleMouseUp: any;
    boundInputOnChange: any;
    boundInputOnFocus: any;
    boundInputOnBlur: any;
    boundElementOnMouseUp: any;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
    /**
       * Add blur.
       *
       */
    blur_;
    /**
       * Check the inputs toggle state and update display.
       *
       * @public
       */
    public checkToggleState: () => void;
    /**
       * Check the inputs disabled state and update display.
       *
       * @public
       */
    public checkDisabled: () => void;
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
   * Class constructor for dropdown MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialMenu {
    /**
    * Keycodes, for code readability.
    *
    * @enum {number}
    */
    static Keycodes_;
    /**
    * Store strings for class names defined by this component that are used in
    * JavaScript. This allows us to simply change it in one place should we
    * decide to modify at a later date.
    *
    * @enum {string}
    */
    static cssClasses_;
    constructor(element: any);
    element_: any;
    /**
       * Initialize element.
       */
    init(): void;
    container_: HTMLDivElement;
    outline_: HTMLDivElement;
    forElement_?: HTMLElement;


    boundItemClick_: OmitThisParameter<this['handleItemClick_']>;
    boundItemKeydown_: OmitThisParameter<this['handleItemKeyboardEvent_']>;
    boundForClick_: OmitThisParameter<this['handleForClick_']>;
    boundForKeydown_: OmitThisParameter<this['handleForKeyboardEvent_']>;


    registerItem(item: any): void;
    /**
       * Handles a click on the "for" element, by positioning the menu and then
       * toggling it.
       *
       * @param {Event} evt The event that fired.
       */
    handleForClick_;
    /**
       * Handles a keyboard event on the "for" element.
       *
       * @param {Event} evt The event that fired.
       */
    handleForKeyboardEvent_;
    /**
       * Handles a keyboard event on an item.
       *
       * @param {Event} evt The event that fired.
       */
    handleItemKeyboardEvent_;
    /**
       * Handles a click event on an item.
       *
       * @param {Event} evt The event that fired.
       */
    handleItemClick_;
    closing_: boolean;
    /**
       * Function called when an item is selected.
       *
       * @param {HTMLLIElement} option The option that was clicked
       */
    onItemSelected(option: HTMLLIElement): void;
    /**
       * Calculates the initial clip (for opening the menu) or final clip (for closing
       * it), and applies it. This allows us to animate from or to the correct point,
       * that is, the point it's aligned to in the "for" element.
       *
       * @param {number} height Height of the clip rectangle
       * @param {number} width Width of the clip rectangle
       */
    applyClip_;
    /**
       * Cleanup function to remove animation listeners.
       *
       * @param {Event} evt
       */
    removeAnimationEndListener_;
    /**
       * Adds an event listener to clean up after the animation ends.
       *
       */
    addAnimationEndListener_;
    /**
       * Displays the menu.
       *
       * @public
       */
    public show(evt: any): void;
    /**
       * Hides the menu.
       *
       * @public
       */
    public hide(): void;
    /**
       * Displays or hides the menu, depending on current state.
       *
       * @public
       */
    public toggle(evt: any): void;
    /**
        * Store constants in one place so they can be updated easily.
        *
        * @enum {string | number}
        */
    Constant_;
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
   * Class constructor for Progress MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialProgress {
    constructor(element: any);
    /**
       * Set the current progress of the progressbar.
       *
       * @param {number} p Percentage of the progress (0-100)
       * @public
       */
    public setProgress(p: number): void;
    /**
       * Set the current progress of the buffer.
       *
       * @param {number} p Percentage of the buffer (0-100)
       * @public
       */
    public setBuffer(p: number): void;
    /**
       * Initialize element.
       */
    init(): void;
    progressbar_: HTMLDivElement;
    bufferbar_: HTMLDivElement;
    auxbar_: HTMLDivElement;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Radio MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialRadio {
    constructor(element: any);
    /**
       * Handle change of state.
       *
       * @param {Event} event The event that fired.
       */
    onChange_;
    /**
       * Handle focus.
       *
       * @param {Event} event The event that fired.
       */
    onFocus_;
    /**
       * Handle lost focus.
       *
       * @param {Event} event The event that fired.
       */
    onBlur_;
    /**
       * Handle mouseup.
       *
       * @param {Event} event The event that fired.
       */
    onMouseup_;
    /**
       * Update classes.
       *
       */
    updateClasses_;
    /**
       * Add blur.
       *
       */
    blur_;
    /**
       * Check the components disabled state.
       *
       * @public
       */
    public checkDisabled(): void;
    /**
       * Check the components toggled state.
       *
       * @public
       */
    public checkToggleState(): void;
    /**
       * Disable radio.
       *
       * @public
       */
    public disable(): void;
    /**
       * Enable radio.
       *
       * @public
       */
    public enable(): void;
    /**
       * Check radio.
       *
       * @public
       */
    public check(): void;
    /**
       * Uncheck radio.
       *
       * @public
       */
    public uncheck(): void;
    /**
       * Initialize element.
       */
    init(): void;
    btnElement_: any;
    boundChangeHandler_: any;
    boundFocusHandler_: any;
    boundBlurHandler_: any;
    boundMouseUpHandler_: any;
    /**
        * Store constants in one place so they can be updated easily.
        *
        * @enum {string | number}
        */
    Constant_;
    /**
        * Store strings for class names defined by this component that are used in
        * JavaScript. This allows us to simply change it in one place should we
        * decide to modify at a later date.
        *
        * @enum {string}
        */
    cssClasses_;
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
   * Class constructor for Slider MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialSlider {
    constructor(element: any);
    element_: any;
    isIE_: any;
    /**
       * Handle input on element.
       *
       * @param {Event} event The event that fired.
       */
    onInput_;
    /**
       * Handle change on element.
       *
       * @param {Event} event The event that fired.
       */
    onChange_;
    /**
       * Handle mouseup on element.
       *
       * @param {Event} event The event that fired.
       */
    onMouseUp_;
    /**
       * Handle mousedown on container element.
       * This handler is purpose is to not require the use to click
       * exactly on the 2px slider element, as FireFox seems to be very
       * strict about this.
       *
       * @param {Event} event The event that fired.
       * @suppress {missingProperties}
       */
    onContainerMouseDown_;
    /**
       * Handle updating of values.
       *
       */
    updateValueStyles_;
    /**
       * Disable slider.
       *
       * @public
       */
    public disable(): void;
    /**
       * Enable slider.
       *
       * @public
       */
    public enable(): void;
    /**
       * Update slider value.
       *
       * @param {number} value The value to which to set the control (optional).
       * @public
       */
    public change(value: number): void;
    /**
       * Initialize element.
       */
    init(): void;
    backgroundLower_: HTMLDivElement;
    backgroundUpper_: HTMLDivElement;
    boundInputHandler: any;
    boundChangeHandler: any;
    boundMouseUpHandler: any;
    boundContainerMouseDownHandler: any;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
}
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
    constructor(element: any);
    element_: any;
    textElement_: any;
    actionElement_: any;
    active: boolean;
    actionHandler_: any;
    message_: any;
    actionText_: any;
    queuedNotifications_: any[];
    /**
       * Display the snackbar.
       *
       */
    displaySnackbar_;
    /**
       * Show the snackbar.
       *
       * @param {Object} data The data for the notification.
       * @public
       */
    public showSnackbar(data: any): void;
    timeout_: any;
    /**
       * Check if the queue has items within it.
       * If it does, display the next entry.
       *
       */
    checkQueue_;
    /**
       * Cleanup the snackbar event listeners and accessibility attributes.
       *
       */
    cleanup_;
    /**
       * Set the action handler hidden state.
       *
       * @param {boolean} value
       */
    setActionHidden_;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Spinner MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   * @constructor
   */
export class MaterialSpinner {
    constructor(element: any);
    /**
       * Auxiliary method to create a spinner layer.
       *
       * @param {number} index Index of the layer to be created.
       * @public
       */
    public createLayer(index: number): void;
    /**
       * Stops the spinner animation.
       * Public method for users who need to stop the spinner for any reason.
       *
       * @public
       */
    public stop(): void;
    /**
       * Starts the spinner animation.
       * Public method for users who need to manually start the spinner for any reason
       * (instead of just adding the 'is-active' class to their markup).
       *
       * @public
       */
    public start(): void;
    /**
       * Initialize element.
       */
    init(): void;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Checkbox MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialSwitch {
    constructor(element: any);
    /**
       * Handle change of state.
       *
       * @param {Event} event The event that fired.
       */
    onChange_;
    /**
       * Handle focus of element.
       *
       * @param {Event} event The event that fired.
       */
    onFocus_;
    /**
       * Handle lost focus of element.
       *
       * @param {Event} event The event that fired.
       */
    onBlur_;
    /**
       * Handle mouseup.
       *
       * @param {Event} event The event that fired.
       */
    onMouseUp_;
    /**
       * Handle class updates.
       *
       */
    updateClasses_;
    /**
       * Disable switch.
       *
       * @public
       */
    public disable(): void;
    /**
       * Enable switch.
       *
       * @public
       */
    public enable(): void;
    /**
       * Activate switch.
       *
       * @public
       */
    public on(): void;
    /**
       * Deactivate switch.
       *
       * @public
       */
    public off(): void;
    /**
       * Initialize element.
       */
    init(): void;
    inputElement_: any;
    boundMouseUpHandler: any;
    rippleContainerElement_: HTMLSpanElement;
    boundChangeHandler: any;
    boundFocusHandler: any;
    boundBlurHandler: any;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
    /**
       * Add blur.
       *
       */
    blur_;
    /**
       * Check the components disabled state.
       *
       * @public
       */
    public checkDisabled: () => void;
    /**
       * Check the components toggled state.
       *
       * @public
       */
    public checkToggleState: () => void;
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
   * Class constructor for Tabs MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
export class MaterialTabs {
    constructor(element: any);
    element_: any;
    /**
       * Handle clicks to a tabs component
       *
       */
    initTabs_;
    tabs_: any;
    panels_: any;
    /**
       * Reset tab state, dropping active classes
       *
       */
    resetTabState_;
    /**
       * Reset panel state, dropping active classes
       *
       */
    resetPanelState_;
    /**
       * Initialize element.
       */
    init(): void;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
}
/**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {Element} tab The HTML element for the tab.
   * @param {MaterialTabs} ctx The MaterialTabs object that owns the tab.
   */
export class MaterialTab {
    constructor(tab: any, ctx: any);
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
   * Class constructor for Textfield MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialTextfield {
    /** @param {HTMLInputElement} element */
    constructor(element: HTMLInputElement);
    element_: HTMLInputElement;
    maxRows: number;
    /**
       * Handle input being entered.
       *
       * @param {Event} event The event that fired.
       */
    onKeyDown_;
    /**
       * Handle focus.
       *
       * @param {Event} event The event that fired.
       */
    onFocus_;
    /**
       * Handle lost focus.
       *
       * @param {Event} event The event that fired.
       */
    onBlur_;
    /**
       * Handle reset event from out side.
       *
       * @param {Event} event The event that fired.
       */
    onReset_;
    /**
       * Handle class updates.
       *
       */
    updateClasses_;
    /**
       * Check the disabled state and update field accordingly.
       *
       * @public
       */
    public checkDisabled(): void;
    /**
      * Check the focus state and update field accordingly.
      *
      * @public
      */
    public checkFocus(): void;
    /**
       * Check the validity state and update field accordingly.
       *
       * @public
       */
    public checkValidity(): void;
    /**
       * Check the dirty state and update field accordingly.
       *
       * @public
       */
    public checkDirty(): void;
    /**
       * Disable text field.
       *
       * @public
       */
    public disable(): void;
    /**
       * Enable text field.
       *
       * @public
       */
    public enable(): void;
    /**
       * Update text field value.
       *
       * @param {string} value The value to which to set the control (optional).
       * @public
       */
    public change(value: string): void;
    /**
       * Initialize element.
       */
    init(): void;
    label_: Element;
    input_: Element;
    boundUpdateClassesHandler: any;
    boundFocusHandler: any;
    boundBlurHandler: any;
    boundResetHandler: any;
    boundKeyDownHandler: any;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Tooltip MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialTooltip {
    constructor(element: any);
    /**
       * Handle mouseenter for tooltip.
       *
       * @param {Event} event The event that fired.
       */
    handleMouseEnter_;
    /**
       * Hide tooltip on mouseleave or scroll
       *
       */
    hideTooltip_;
    /**
       * Initialize element.
       */
    init(): void;
    forElement_: HTMLElement;
    boundMouseEnterHandler: any;
    boundMouseLeaveAndScrollHandler: any;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Layout MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialLayout {
   element_: HTMLElement;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    static cssClasses: {
        CONTAINER: string;
        HEADER: string;
        DRAWER: string;
        CONTENT: string;
        DRAWER_BTN: string;
        ICON: string;
        JS_RIPPLE_EFFECT: string;
        RIPPLE_CONTAINER: string;
        RIPPLE: string;
        RIPPLE_IGNORE_EVENTS: string;
        HEADER_SEAMED: string;
        HEADER_WATERFALL: string;
        HEADER_SCROLL: string;
        FIXED_HEADER: string;
        OBFUSCATOR: string;
        TAB_BAR: string;
        TAB_CONTAINER: string;
        TAB: string;
        TAB_BAR_BUTTON: string;
        TAB_BAR_LEFT_BUTTON: string;
        TAB_BAR_RIGHT_BUTTON: string;
        TAB_MANUAL_SWITCH: string;
        PANEL: string;
        HAS_DRAWER: string;
        HAS_TABS: string;
        HAS_SCROLLING_HEADER: string;
        CASTING_SHADOW: string;
        IS_COMPACT: string;
        IS_SMALL_SCREEN: string;
        IS_DRAWER_OPEN: string;
        IS_ACTIVE: string;
        IS_UPGRADED: string;
        IS_ANIMATING: string;
        ON_LARGE_SCREEN: string;
        ON_SMALL_SCREEN: string;
    };
    constructor(element: any);
    /**
       * Handles scrolling on the content.
       *
       */
    contentScrollHandler_;
    /**
       * Handles a keyboard event on the drawer.
       *
       * @param {KeyboardEvent} evt The event that fired.
       */
    keyboardEventHandler_;
    /**
       * Handles changes in screen size.
       *
       */
    screenSizeHandler_;
    /**
       * Handles events of drawer button.
       *
       * @param {Event} evt The event that fired.
       */
    drawerToggleHandler_;
    /**
       * Handles (un)setting the `is-animating` class
       *
       */
    headerTransitionEndHandler_;
    /**
       * Handles expanding the header on click
       *
       */
    headerClickHandler_;
    /**
       * Reset tab state, dropping active classes
       *
       */
    resetTabState_;
    /**
       * Reset panel state, dropping active classes
       *
       */
    resetPanelState_;
    /**
      * Toggle drawer state
      *
      * @public
      */
    public toggleDrawer(): void;
    openDrawer(doNewClass?: boolean): void;
    closeDrawer(doNewClass?: boolean): void;
    /**
       * Initialize element.
       */
    init(): void;
    header_: HTMLDivElement|undefined;
    drawer_: HTMLDivElement|undefined;
    content_: HTMLDivElement|undefined;
    tabBar_: HTMLDivElement|undefined;
    obfuscator_: HTMLDivElement;
    screenSizeMediaQuery_: MediaQueryList;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Keycodes, for code readability.
       *
       * @enum {number}
       */
    Keycodes_;
    /**
       * Modes.
       *
       * @enum {number}
       */
    Mode_;
}
/**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {HTMLElement} tab The HTML element for the tab.
   * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
   * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
   * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
   */
export class MaterialLayoutTab {
    constructor(tab: any, tabs: any, panels: any, layout: any);
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
   * Class constructor for Data Table Card MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
export class MaterialDataTable {
    constructor(element: any);
    /**
       * Generates and returns a function that toggles the selection state of a
       * single row (or multiple rows).
       *
       * @param {Element} checkbox Checkbox that toggles the selection state.
       * @param {Element} row Row to toggle when checkbox changes.
       * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
       */
    selectRow_;
    /**
       * Creates a checkbox for a single or or multiple rows and hooks up the
       * event handling.
       *
       * @param {Element} row Row to toggle when checkbox changes.
       * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
       */
    createCheckbox_;
    /**
       * Initialize element.
       */
    init(): void;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
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
   * Class constructor for Ripple MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
export class MaterialRipple {
    constructor(element: any);
    /**
       * Handle mouse / finger down on element.
       *
       * @param {Event} event The event that fired.
       */
    downHandler_;
    boundHeight: any;
    boundWidth: any;
    rippleSize_: number;
    ignoringMouseDown_: boolean;
    /**
       * Handle mouse / finger up on element.
       *
       * @param {Event} event The event that fired.
       */
    upHandler_;
    recentering: any;
    /**
       * Initialize element.
       */
    init(): void;
    rippleElement_: any;
    frameCount_: number;
    x_: number;
    y_: number;
    boundDownHandler: any;
    boundUpHandler: any;
    /** Getter for frameCount_.
        * @return {number} the frame count.
        */
    getFrameCount(): number;
    /**
        * Setter for frameCount_.
        * @param {number} fC the frame count.
        * @typedef {Function}
        */
    setFrameCount(fC: number): void;
    /**
        * Getter for rippleElement_.
        * @return {Element} the ripple element.
        */
    getRippleElement(): Element;
    /**
        * Sets the ripple X and Y coordinates.
        * @param  {number} newX the new X coordinate
        * @param  {number} newY the new Y coordinate
        */
    setRippleXY(newX: number, newY: number): void;
    /**
        * Sets the ripple styles.
        * @param  {boolean} start whether or not this is the start frame.
        */
    setRippleStyles(start: boolean): void;
    /**
        * Handles an animation frame.
        */
    animFrameHandler(): void;
    /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       */
    Constant_;
    /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       */
    cssClasses_;
}
