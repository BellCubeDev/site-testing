export function materialInit(): void;
export const componentHandler: any;
export class MaterialButton {
    constructor(element: any);
    private blurHandler_;
    public disable(): void;
    public enable(): void;
    init(): void;
    rippleElement_: HTMLSpanElement | undefined;
    boundRippleBlurHandler: ((event: Event) => void) | undefined;
    boundButtonBlurHandler: ((event: Event) => void) | undefined;
    private Constant_;
    private CssClasses_;
}
export class MaterialCheckbox {
    private static Constant_;
    private static CssClasses_;
    constructor(element: any);
    private onChange_;
    private onFocus_;
    private onBlur_;
    private onMouseUp_;
    private updateClasses_;
    private blur_;
    public checkToggleState(): void;
    public checkDisabled(): void;
    public disable(): void;
    public enable(): void;
    public check(): void;
    public uncheck(): void;
    init(): void;
    inputElement_: any;
    rippleContainerElement_: HTMLSpanElement | undefined;
    boundRippleMouseUp: ((event: Event) => void) | undefined;
    boundInputOnChange: ((event: Event) => void) | undefined;
    boundInputOnFocus: ((event: Event) => void) | undefined;
    boundInputOnBlur: ((event: Event) => void) | undefined;
    boundElementMouseUp: ((event: Event) => void) | undefined;
}
export class MaterialIconToggle {
    constructor(element: any);
    private onChange_;
    private onFocus_;
    private onBlur_;
    private onMouseUp_;
    private updateClasses_;
    public disable(): void;
    public enable(): void;
    public check(): void;
    public uncheck(): void;
    init(): void;
    inputElement_: any;
    rippleContainerElement_: HTMLSpanElement | undefined;
    boundRippleMouseUp: ((event: Event) => void) | undefined;
    boundInputOnChange: ((event: Event) => void) | undefined;
    boundInputOnFocus: ((event: Event) => void) | undefined;
    boundInputOnBlur: ((event: Event) => void) | undefined;
    boundElementOnMouseUp: ((event: Event) => void) | undefined;
    private Constant_;
    private CssClasses_;
    private blur_;
    public checkToggleState: () => void;
    public checkDisabled: () => void;
}
export class MaterialMenu {
    constructor(element: any);
    init(): void;
    container_: HTMLDivElement | undefined;
    outline_: HTMLDivElement | undefined;
    forElement_: HTMLElement | undefined;
    boundItemKeydown_: ((evt: Event) => void) | undefined;
    boundItemClick_: ((evt: Event) => void) | undefined;
    private handleForClick_;
    private handleForKeyboardEvent_;
    private handleItemKeyboardEvent_;
    private handleItemClick_;
    closing_: boolean | undefined;
    private applyClip_;
    private removeAnimationEndListener_;
    private addAnimationEndListener_;
    public show(evt: any): void;
    public hide(): void;
    public toggle(evt: any): void;
    private Constant_;
    private Keycodes_;
    private CssClasses_;
}
export class MaterialProgress {
    constructor(element: any);
    public setProgress(p: number): void;
    public setBuffer(p: number): void;
    init(): void;
    progressbar_: HTMLDivElement | undefined;
    bufferbar_: HTMLDivElement | undefined;
    auxbar_: HTMLDivElement | undefined;
    private Constant_;
    private CssClasses_;
}
export class MaterialRadio {
    constructor(element: any);
    private onChange_;
    private onFocus_;
    private onBlur_;
    private onMouseup_;
    private updateClasses_;
    private blur_;
    public checkDisabled(): void;
    public checkToggleState(): void;
    public disable(): void;
    public enable(): void;
    public check(): void;
    public uncheck(): void;
    init(): void;
    btnElement_: any;
    boundChangeHandler_: ((event: Event) => void) | undefined;
    boundFocusHandler_: ((event: Event) => void) | undefined;
    boundBlurHandler_: ((event: Event) => void) | undefined;
    boundMouseUpHandler_: ((event: Event) => void) | undefined;
    private Constant_;
    private CssClasses_;
}
export class MaterialSlider {
    constructor(element: any);
    element_: any;
    isIE_: any;
    private onInput_;
    private onChange_;
    private onMouseUp_;
    private onContainerMouseDown_;
    private updateValueStyles_;
    public disable(): void;
    public enable(): void;
    public change(value: number): void;
    init(): void;
    backgroundLower_: HTMLDivElement | undefined;
    backgroundUpper_: HTMLDivElement | undefined;
    boundInputHandler: ((event: Event) => void) | undefined;
    boundChangeHandler: ((event: Event) => void) | undefined;
    boundMouseUpHandler: ((event: Event) => void) | undefined;
    boundContainerMouseDownHandler: ((event: Event) => void) | undefined;
    private Constant_;
    private CssClasses_;
}
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
    private displaySnackbar_;
    public showSnackbar(data: Object): void;
    timeout_: any;
    private checkQueue_;
    private cleanup_;
    private setActionHidden_;
    private Constant_;
    private cssClasses_;
}
export class MaterialSpinner {
    constructor(element: any);
    public createLayer(index: number): void;
    public stop(): void;
    public start(): void;
    init(): void;
    private Constant_;
    private CssClasses_;
}
export class MaterialSwitch {
    constructor(element: any);
    private onChange_;
    private onFocus_;
    private onBlur_;
    private onMouseUp_;
    private updateClasses_;
    public disable(): void;
    public enable(): void;
    public on(): void;
    public off(): void;
    init(): void;
    inputElement_: any;
    boundMouseUpHandler: ((event: Event) => void) | undefined;
    rippleContainerElement_: HTMLSpanElement | undefined;
    boundChangeHandler: ((event: Event) => void) | undefined;
    boundFocusHandler: ((event: Event) => void) | undefined;
    boundBlurHandler: ((event: Event) => void) | undefined;
    private Constant_;
    private CssClasses_;
    private blur_;
    public checkDisabled: () => void;
    public checkToggleState: () => void;
}
export class MaterialTabs {
    constructor(element: any);
    element_: any;
    private initTabs_;
    tabs_: any;
    panels_: any;
    private resetTabState_;
    private resetPanelState_;
    init(): void;
    private Constant_;
    private CssClasses_;
}
export class MaterialTab {
    constructor(tab: any, ctx: any);
}
export class MaterialTextfield {
    constructor(element: HTMLInputElement);
    element_: HTMLInputElement;
    maxRows: number;
    private onKeyDown_;
    private onFocus_;
    private onBlur_;
    private onReset_;
    private updateClasses_;
    public checkDisabled(): void;
    public checkFocus(): void;
    public checkValidity(): void;
    public checkDirty(): void;
    public disable(): void;
    public enable(): void;
    public change(value: string): void;
    init(): void;
    label_: Element | null | undefined;
    input_: Element | null | undefined;
    boundUpdateClassesHandler: (() => void) | undefined;
    boundFocusHandler: ((event: Event) => void) | undefined;
    boundBlurHandler: ((event: Event) => void) | undefined;
    boundResetHandler: ((event: Event) => void) | undefined;
    boundKeyDownHandler: ((event: Event) => void) | undefined;
    private Constant_;
    private CssClasses_;
}
export class MaterialTooltip {
    constructor(element: any);
    private handleMouseEnter_;
    private hideTooltip_;
    init(): void;
    forElement_: HTMLElement | null | undefined;
    boundMouseEnterHandler: ((event: Event) => void) | undefined;
    boundMouseLeaveAndScrollHandler: (() => void) | undefined;
    private Constant_;
    private CssClasses_;
}
export class MaterialLayout {
    constructor(element: any);
    private contentScrollHandler_;
    private keyboardEventHandler_;
    private screenSizeHandler_;
    private drawerToggleHandler_;
    private headerTransitionEndHandler_;
    private headerClickHandler_;
    private resetTabState_;
    private resetPanelState_;
    public toggleDrawer(): void;
    init(): void;
    header_: any;
    drawer_: any;
    content_: any;
    tabBar_: any;
    obfuscator_: HTMLDivElement | undefined;
    screenSizeMediaQuery_: MediaQueryList | undefined;
    private Constant_;
    private Keycodes_;
    private Mode_;
    private CssClasses_;
}
export class MaterialLayoutTab {
    constructor(tab: any, tabs: any, panels: any, layout: any);
}
export class MaterialDataTable {
    constructor(element: any);
    private selectRow_;
    private createCheckbox_;
    init(): void;
    private Constant_;
    private CssClasses_;
}
export class MaterialRipple {
    constructor(element: any);
    private downHandler_;
    boundHeight: any;
    boundWidth: any;
    rippleSize_: number | undefined;
    ignoringMouseDown_: boolean | undefined;
    private upHandler_;
    recentering: any;
    init(): void;
    rippleElement_: any;
    frameCount_: number | undefined;
    x_: number | undefined;
    y_: number | undefined;
    boundDownHandler: ((event: Event) => void) | undefined;
    boundUpHandler: ((event: Event) => void) | undefined;
    getFrameCount(): number;
    setFrameCount(fC: number): void;
    getRippleElement(): Element;
    setRippleXY(newX: number, newY: number): void;
    setRippleStyles(start: boolean): void;
    animFrameHandler(): void;
    private Constant_;
    private CssClasses_;
}
export class mdl {
    static componentHandler: any;
}
//# sourceMappingURL=material.d.ts.map