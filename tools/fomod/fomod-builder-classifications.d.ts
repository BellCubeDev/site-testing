import { MaterialMenu, MaterialTextfield } from "../../assets/site/mdl/material.js";
import "./fomod-builder";
export declare class bcd_builder_XMLElement {
    instanceElement: Element | undefined;
    constructor(instanceElement?: Element | undefined);
    asModuleXML(document: XMLDocument): Comment | Element;
    asInfoXML(document: XMLDocument): Comment | Element;
}
export declare class bcd_builder_dropdown extends MaterialMenu {
}
export declare class bcd_builder_dropdown_order extends bcd_builder_dropdown {
}
export declare class bcd_builder_dropdown_groupType extends bcd_builder_dropdown {
}
export declare class bcd_builder_dropdown_pluginType extends bcd_builder_dropdown {
}
declare type bcd_builder_dependency_file_state = "Active" | "Inactive" | "Missing";
declare type bcd_builder_dependency_group_operator = "And" | "Or";
export declare class bcd_builder_input_image extends MaterialTextfield {
    static cssClass: string;
    boundDisplay: HTMLImageElement;
    boundDisplayAsClass: bcd_builder_input_image_display;
    constructor(element: HTMLInputElement);
    updateImage(newInput: string): void;
}
export declare class bcd_builder_input_image_display {
    imageDisplayElement: HTMLImageElement;
    boundInput?: HTMLInputElement;
    boundInputAsClass?: bcd_builder_input_image;
    constructor(imageDisplayElement: HTMLImageElement, boundInput?: HTMLInputElement);
    updateImage(input: HTMLInputElement | string): void;
}
export declare class bcd_builder_flag {
    name: string;
    value: string;
    getters: never[];
    setters: never[];
    constructor(name?: string, value?: string);
}
export declare class bcd_builder_dependency extends bcd_builder_XMLElement {
    constructor(instanceElement?: Element | undefined);
}
export declare class bcd_builder_dependency_group extends bcd_builder_dependency {
    operator: bcd_builder_dependency_group_operator;
    children: bcd_builder_dependency[];
    constructor(instanceElement?: Element | undefined, operator?: bcd_builder_dependency_group_operator, parseChildren?: boolean);
    asModuleXML(document: XMLDocument, nodeName?: string): Element;
}
export declare class bcd_builder_dependency_flag extends bcd_builder_dependency {
    flag: string;
    value: string;
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_dependency_file extends bcd_builder_dependency {
    file: string;
    state: bcd_builder_dependency_file_state;
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_dependency_versionCheck extends bcd_builder_dependency {
    version: string;
}
export declare class bcd_builder_dependency_FOSE extends bcd_builder_dependency_versionCheck {
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_dependency_game extends bcd_builder_dependency_versionCheck {
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_dependency_modManager extends bcd_builder_dependency_versionCheck {
    asModuleXML(document: XMLDocument): Element;
}
declare type bcd_builder_PluginType = "Optional" | "Recommended" | "CouldBeUseable" | "Required" | "NotUseable";
export declare class bcd_builder_PluginTypeDescriptor extends bcd_builder_XMLElement {
    default: bcd_builder_PluginType;
    dependencies: bcd_builder_PluginTypeDescriptor_dependency[];
    instanceElement_basic: Element | undefined;
    instanceElement_complex: Element | undefined;
    instanceElement_complex_type: Element | undefined;
    instanceElement_complex_patterns: Element | undefined;
    constructor(element?: Element, defaultType?: bcd_builder_PluginType, dependencies?: bcd_builder_PluginTypeDescriptor_dependency[]);
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_PluginTypeDescriptor_dependency extends bcd_builder_XMLElement {
    type: bcd_builder_PluginType;
    dependency: bcd_builder_dependency_group;
    instanceElement_type: Element | undefined;
    constructor(dependency: bcd_builder_dependency_group, type?: bcd_builder_PluginType);
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_FOMOD_install extends bcd_builder_XMLElement {
    static files: string[][];
    file: string[];
    updateFile(file: string | string[] | FileSystemFileHandle): void;
    constructor(element: Element, file?: string | string[] | FileSystemFileHandle);
}
declare type bcd_builder_groupSortOrder = "Ascending" | "Descending" | "Explicit";
export declare class bcd_builder_FOMOD_step extends bcd_builder_XMLElement {
    name: string;
    order: bcd_builder_groupSortOrder;
    groups: bcd_builder_FOMOD_group[];
}
declare type bcd_builder_GroupType = "SelectAll" | "SelectAny" | "SelectAtMostOne" | "SelectAtLeastOne" | "SelectExactlyOne";
export declare class bcd_builder_FOMOD_group extends bcd_builder_XMLElement {
    name: string;
    type: bcd_builder_GroupType;
    plugins: bcd_builder_option[];
}
export declare class bcd_builder_option extends bcd_builder_XMLElement {
    name: string;
    name_backend: string;
    name_backend_node: Comment | undefined;
    description: bcd_builder_option_description;
    image: bcd_builder_option_image;
    conditionFlags: bcd_builder_dependency_flag[];
    conditionFlags_container: Element | undefined;
    files: bcd_builder_dependency_file[];
    files_container: Element | undefined;
    typeDescriptor: bcd_builder_PluginTypeDescriptor;
    constructor(element?: Element, name?: string, name_backend?: string, description?: bcd_builder_option_description | string, image?: bcd_builder_option_image | string[] | FileSystemFileHandle, conditionFlags?: bcd_builder_dependency_flag[], files?: bcd_builder_dependency_file[], typeDescriptor?: bcd_builder_PluginTypeDescriptor);
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_option_description extends bcd_builder_XMLElement {
    description: string;
    constructor(element?: Element, description?: string);
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_option_image extends bcd_builder_XMLElement {
    image: string[];
    constructor(element?: Element, image?: string[] | FileSystemFileHandle);
    asModuleXML(document: XMLDocument): Element;
}
export declare class bcd_builder_FOMOD extends bcd_builder_XMLElement {
    meta_name: string;
    meta_image: string;
    meta_author: string;
    meta_version: string;
    meta_id: number;
    meta_url: string;
    installs: bcd_builder_FOMOD_install[];
    conditions: bcd_builder_dependency_group | undefined;
    steps: bcd_builder_FOMOD_step[];
    constructor(instanceElement?: Element, meta_name?: string, meta_image?: string, meta_author?: string, meta_version?: string, meta_id?: number, meta_url?: string, installs?: bcd_builder_FOMOD_install[], steps?: bcd_builder_FOMOD_step[], conditions?: bcd_builder_dependency_group);
    asModuleXML(document: XMLDocument): Element;
}
export {};
//# sourceMappingURL=fomod-builder-classifications.d.ts.map