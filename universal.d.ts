export declare class bcdStr extends String {
    constructor(str_: string);
    capitalizeFirstLetter(): bcdStr;
    trimWhitespace(): bcdStr;
}
declare global {
    interface Window {
        dataLayer: [];
        bcd_init_functions: {
            [key: string]: Function;
        };
    }
}
interface componentTrackingItem {
    obj: {
        [index: string]: unknown;
    };
    arr: unknown[];
}
interface registered_components {
    [index: string]: componentTrackingItem;
}
interface trackableConstructor<TConstructor> extends Function {
    asString: string;
    new (...args: never[]): TConstructor;
    [key: string | number | symbol]: any;
}
export declare class bcd_ComponentTracker {
    static registered_components: registered_components;
    static registerComponent<TConstructor>(component: TConstructor, constructor: trackableConstructor<TConstructor>, element: HTMLElement): void;
    static createComponent<TConstructor>(constructor: trackableConstructor<TConstructor>): void;
    static findItem<TConstructor>(constructor: trackableConstructor<TConstructor>, element: HTMLElement, findPredicate: (arg0: TConstructor) => boolean): TConstructor | undefined;
}
export declare function randomNumber(min?: number, max?: number, places?: number): number;
declare class bcd_collapsableParent {
    details: HTMLElement;
    details_inner: HTMLElement;
    summary: HTMLElement;
    openIcons90deg: HTMLCollection;
    self: HTMLElement;
    adjacent: boolean;
    constructor(elm: HTMLElement);
    isOpen(): boolean;
    toggle(doSetDuration?: boolean): void;
    reEval(doSetDuration?: boolean): void;
    open(doSetDuration?: boolean): void;
    close(doSetDuration?: boolean): void;
    evaluateDuration(doRun?: boolean): void;
}
export declare class BellCubicDetails extends bcd_collapsableParent {
    static cssClass: string;
    static asString: string;
    constructor(element: HTMLElement);
}
export declare class BellCubicSummary extends bcd_collapsableParent {
    static cssClass: string;
    static asString: string;
    constructor(element: HTMLElement);
    divertedCompletion(): void;
    handleClick(event: PointerEvent): void;
}
export declare function bcd_universalJS_init(): void;
export {};
//# sourceMappingURL=universal.d.ts.map