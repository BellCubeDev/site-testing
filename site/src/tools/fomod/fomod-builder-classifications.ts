/* eslint-disable i18n-text/no-en */
import {
    MaterialMenu,
    MaterialTextfield,
} from "../../assets/site/mdl/material.js";
import { bcd_ComponentTracker } from "../../universal.js";
import "./fomod-builder"; // Brings in global things

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap
*/

export class bcd_builder_XMLElement {
    instanceElement: Element | undefined;
    constructor(instanceElement: Element | undefined = undefined) {
        this.instanceElement = instanceElement;
    }
    asModuleXML(document: XMLDocument): Comment | Element {
        /*throw new Error*/ return document.createComment(`This call of asModuleXML() was not overridden by a child class! ${this.constructor.name}`);
    }
    asInfoXML(document: XMLDocument): Comment | Element {
        /*throw new Error*/ return document.createComment(`This call of asInfoXML() was not overridden by a child class! ${this.constructor.name}`);
    }
}

/*
$$\   $$\         $$$$$$\             $$\                          $$$$$$\
$$ |  $$ |        \_$$  _|            $$ |                        $$  __$$\
$$ |  $$ |          $$ |  $$$$$$$\  $$$$$$\    $$$$$$\   $$$$$$\  $$ /  \__| $$$$$$\   $$$$$$$\  $$$$$$\
$$ |  $$ |          $$ |  $$  __$$\ \_$$  _|  $$  __$$\ $$  __$$\ $$$$\      \____$$\ $$  _____|$$  __$$\
$$ |  $$ |          $$ |  $$ |  $$ |  $$ |    $$$$$$$$ |$$ |  \__|$$  _|     $$$$$$$ |$$ /      $$$$$$$$ |
$$ |  $$ |          $$ |  $$ |  $$ |  $$ |$$\ $$   ____|$$ |      $$ |      $$  __$$ |$$ |      $$   ____|
\$$$$$$  |        $$$$$$\ $$ |  $$ |  \$$$$  |\$$$$$$$\ $$ |      $$ |      \$$$$$$$ |\$$$$$$$\ \$$$$$$$\
 \______/ $$$$$$\ \______|\__|  \__|   \____/  \_______|\__|      \__|       \_______| \_______| \_______|
          |____*/

export class bcd_builder_dropdown extends MaterialMenu { }
export class bcd_builder_dropdown_order extends bcd_builder_dropdown { }
export class bcd_builder_dropdown_groupType extends bcd_builder_dropdown { }
export class bcd_builder_dropdown_pluginType extends bcd_builder_dropdown { }

type bcd_builder_dependency_file_state = "Active" | "Inactive" | "Missing";
type bcd_builder_dependency_group_operator = "And" | "Or";


// TODO Image Displays
export class bcd_builder_input_image extends MaterialTextfield {
    static cssClass = "fomod_imageInput";
    boundDisplay: HTMLImageElement;
    boundDisplayAsClass: bcd_builder_input_image_display;

    constructor(element: HTMLInputElement) {
        super(element);

        this.boundDisplay = element.parentElement?.querySelector(
            ".fomod_imageDisplay"
        ) as HTMLImageElement;
        if (!this.boundDisplay) {
            console.log("Error Item:", this);
            throw new TypeError(
                "No bound image display was found for this FOMOD Image Input."
            );
        }

        this.boundDisplayAsClass = new bcd_builder_input_image_display(
            this.boundDisplay
        );
        //@ts-ignore No overload matches this call.
        this.element_.addEventListener("change", this.updateImage.bind(this)); //@ts-ignore No overload matches this call.
        this.element_.addEventListener("input", this.updateImage.bind(this));
    }

    updateImage(newInput: string) {
        this.boundDisplayAsClass.updateImage(this.element_);
    }
}

export class bcd_builder_input_image_display {
    imageDisplayElement: HTMLImageElement;

    boundInput?: HTMLInputElement;
    boundInputAsClass?: bcd_builder_input_image;

    constructor(imageDisplayElement: HTMLImageElement, boundInput?: HTMLInputElement) {
        this.imageDisplayElement = imageDisplayElement;

        if (boundInput) {
            this.boundInput = boundInput;
            this.boundInput.addEventListener("input", this.updateImage.bind(this, this.boundInput));
            this.boundInput.addEventListener("change", this.updateImage.bind(this, this.boundInput));
            this.boundInput.addEventListener("", this.updateImage.bind(this, this.boundInput));

        }
    }

    updateImage(input: HTMLInputElement | string) {
        if (typeof input === "string") {
            this.imageDisplayElement.src = input;
            if (this.boundInput) this.boundInput.value = input;

        } else this.imageDisplayElement.src = input.value;
    }
}

/*$$$$$\                            $$\ $$\   $$\     $$\
$$  __$$\                           $$ |\__|  $$ |    \__|
$$ /  \__| $$$$$$\  $$$$$$$\   $$$$$$$ |$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\
$$ |      $$  __$$\ $$  __$$\ $$  __$$ |$$ |\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |      $$ /  $$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\
$$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\
\$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
 \______/  \______/ \__|  \__| \_______|\__|   \____/ \__| \______/ \__|  \__|\______*/

export class bcd_builder_flag {
    name = "";
    value = "";
    getters:unknown[] = [];
    setters:unknown[] = [];

    constructor(name = "", value = "") {
        this.name = name;
        this.value = value;
    }
}

export class bcd_builder_dependency extends bcd_builder_XMLElement {
    constructor(instanceElement: Element | undefined = undefined) {
        super(instanceElement);
    }
}
export class bcd_builder_dependency_group extends bcd_builder_dependency {
    operator: bcd_builder_dependency_group_operator /*= 'And'*/;
    children: bcd_builder_dependency[] = [];

    constructor(
        instanceElement: Element | undefined = undefined,
        operator: bcd_builder_dependency_group_operator = "And",
        parseChildren = false
    ) {
        super(instanceElement);
        this.operator = operator;
        if (instanceElement) {
            this.operator =
                (instanceElement.getAttribute(
                    "operator"
                ) as bcd_builder_dependency_group_operator) || operator;
        }

        if (!parseChildren || !instanceElement) return;

        for (const elem_child of instanceElement.children) {
            this.children.push(parseDependency(elem_child));
        }
    }

    // <moduleDependencies operator="And">
    asModuleXML(document: XMLDocument, nodeName = "dependencies"): Element {
        if (!this.instanceElement)
            this.instanceElement = document.createElement(nodeName);

        if (this.instanceElement && this.instanceElement.tagName !== nodeName) {
            this.instanceElement.remove();
            this.instanceElement = document.createElement(nodeName);
            for (const child of this.children) {
                if (child.instanceElement)
                    this.instanceElement.appendChild(child.instanceElement);
            }
        }

        this.instanceElement.setAttribute("operator", this.operator);
        for (const child of this.children) {
            this.instanceElement.appendChild(child.asModuleXML(document));
        }
        return this.instanceElement;
    }
}
export class bcd_builder_dependency_flag extends bcd_builder_dependency {
    flag = "";
    value = "";

    // <flagDependency flag="" value="" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("flagDependency");
        thisElement.setAttribute("flag", this.flag);
        thisElement.setAttribute("value", this.value);
        return thisElement;
    }
}
export class bcd_builder_dependency_file extends bcd_builder_dependency {
    file = "";
    state: bcd_builder_dependency_file_state = "Active";

    // <fileDependency file="2" state="Active" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("fileDependency");
        thisElement.setAttribute("file", this.file);
        thisElement.setAttribute("state", this.state);
        return thisElement;
    }
}
export class bcd_builder_dependency_versionCheck extends bcd_builder_dependency {
    version = "";
}
export class bcd_builder_dependency_FOSE extends bcd_builder_dependency_versionCheck {
    // <foseDependency version="" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("foseDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class bcd_builder_dependency_game extends bcd_builder_dependency_versionCheck {
    // <gameDependency version="" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("gameDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class bcd_builder_dependency_modManager extends bcd_builder_dependency_versionCheck {
    // <fommDependency version="1" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("fommDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}

function parseDependency(dependency: Element): bcd_builder_dependency {
    const type = dependency.tagName;
    switch (type) {
        case "dependencies":
            return new bcd_builder_dependency_group(dependency, undefined, true);
        case "fileDependency":
            return new bcd_builder_dependency_file(dependency);
        case "flagDependency":
            return new bcd_builder_dependency_flag(dependency);
        case "foseDependency":
            return new bcd_builder_dependency_FOSE(dependency);
        case "gameDependency":
            return new bcd_builder_dependency_game(dependency);
        case "fommDependency":
            return new bcd_builder_dependency_modManager(dependency);
        default:
            throw new TypeError(`Unknown dependency type: ${type}`);
    }
}

type bcd_builder_PluginType =
    | "Optional"        // Unchecked but checkable
    | "Recommended"     // Checked but uncheckable
    | "CouldBeUseable"  // TODO: Check if this has a use
    | "Required"        // Permanently checked
    | "NotUseable";     // Permanently unchecked
export class bcd_builder_PluginTypeDescriptor extends bcd_builder_XMLElement {
    default: bcd_builder_PluginType = "Optional";

    dependencies: bcd_builder_PluginTypeDescriptor_dependency[] = [];

    instanceElement_basic: Element | undefined = undefined;
    instanceElement_complex: Element | undefined = undefined;
    instanceElement_complex_type: Element | undefined = undefined;
    instanceElement_complex_patterns: Element | undefined = undefined;

    constructor(
        element?: Element,
        defaultType: bcd_builder_PluginType = "Optional",
        dependencies: bcd_builder_PluginTypeDescriptor_dependency[] = []
    ) {
        super(element);
        this.default = defaultType;
        this.dependencies = dependencies;
    }

    asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("typeDescriptor");

        if (this.dependencies.length === 0) {
            this.instanceElement_complex?.remove();
            this.instanceElement_complex = undefined;

            this.instanceElement_basic =
                this.instanceElement_basic ??
                this.instanceElement.appendChild(document.createElement("type"));
            this.instanceElement_basic.setAttribute("default", this.default);

            return this.instanceElement;
        }

        this.instanceElement_complex =
            this.instanceElement_complex ??
            this.instanceElement.appendChild(
                document.createElement("dependencyType")
            );

        this.instanceElement_complex_type =
            this.instanceElement_complex_type ??
            this.instanceElement_complex.appendChild(
                document.createElement("defaultType")
            );
        this.instanceElement_complex_type.setAttribute("name", this.default);

        this.instanceElement_complex_patterns =
            this.instanceElement_complex_patterns ??
            this.instanceElement_complex.appendChild(
                document.createElement("patterns")
            );
        for (const dependency of this.dependencies) {
            this.instanceElement_complex_patterns.appendChild(
                dependency.asModuleXML(document)
            );
        }

        return this.instanceElement;
    }
}

export class bcd_builder_PluginTypeDescriptor_dependency extends bcd_builder_XMLElement {
    type: bcd_builder_PluginType = "Optional";
    instanceElement_type: Element | undefined = undefined;

    dependency: bcd_builder_dependency_group;

    constructor(dependency: bcd_builder_dependency_group, type: bcd_builder_PluginType = "Optional"
    ) {
        super();
        this.dependency = dependency;
        this.type = type;
    }

    asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("pattern");

        this.instanceElement_type = this.instanceElement_type
                                    ?? this.instanceElement.appendChild(document.createElement("type"));
        this.instanceElement_type.setAttribute("name", this.type);

        this.instanceElement.appendChild(this.dependency.asModuleXML(document));

        return this.instanceElement;
    }
}

/*$$$$$\                       $$\               $$\ $$\
\-$$$ **|                      $$ |              $$ |$$ |
   $$ |  $$$$$$$\   $$$$$$$\ $$$$$$\    $$$$$$\  $$ |$$ | $$$$$$$\
   $$ |  $$  __$$\ $$  _____|\_$$  _|   \____$$\ $$ |$$ |$$  _____|
   $$ |  $$ |  $$ |\$$$$$$\    $$ |     $$$$$$$ |$$ |$$ |\$$$$$$\
   $$ |  $$ |  $$ | \____$$\   $$ |$$\ $$  __$$ |$$ |$$ | \____$$\
-$$$$$$\ $$ |  $$ |$$$$$$$  |  \$$$$  |\$$$$$$$ |$$ |$$ |$$$$$$$  |
\_______|\__|  \__|\_______/    \____/  \_______|\__|\__|\______*/

export class bcd_builder_FOMOD_install extends bcd_builder_XMLElement {
    static files: string[][] = [];

    file!: string[];

    updateFile(file: string | string[] | FileSystemFileHandle): void {
        if (typeof file === "string") {
            const filePath: string[] = file.split("/");
            bcd_builder_FOMOD_install.files.push(filePath);
            this.file = filePath;
        } else if (file instanceof Array) {
            bcd_builder_FOMOD_install.files.push(file);
            this.file = file;
        } else {
            window.bcd_builder.directory;
        }
    }

    constructor(
        element: Element,
        file: string | string[] | FileSystemFileHandle = [""]
    ) {
        super(element);
        this.updateFile(file);
    }
}

/*$$$$$\              $$\     $$\
$$  __$$\             $$ |    \__|
$$ /  $$ | $$$$$$\  $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\
$$ |  $$ |$$  __$$\ \_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |$$ /  $$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\
$$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\
 $$$$$$  |$$$$$$$  |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
 \______/ $$  ____/    \____/ \__| \______/ \__|  \__|\_______/
          $$ |
          $$ |
          \_*/

type bcd_builder_groupSortOrder =
    | "Ascending"  // Alphabetical
    | "Descending" // Reverse Alphabetical
    | "Explicit";  // Explicit order

export class bcd_builder_FOMOD_step extends bcd_builder_XMLElement {
    name = "";
    order: bcd_builder_groupSortOrder = "Explicit";
    groups: bcd_builder_FOMOD_group[] = [];
}

type bcd_builder_GroupType =
    | "SelectAll"
    | "SelectAny"
    | "SelectAtMostOne"
    | "SelectAtLeastOne"
    | "SelectExactlyOne";
export class bcd_builder_FOMOD_group extends bcd_builder_XMLElement {
    name = "";
    type: bcd_builder_GroupType = "SelectAny";
    plugins: bcd_builder_option[] = [];
}

export class bcd_builder_option extends bcd_builder_XMLElement {
    name = "";

    name_backend = "";
    name_backend_node: Comment | undefined;

    description: bcd_builder_option_description;

    image: bcd_builder_option_image;

    conditionFlags: bcd_builder_dependency_flag[] = [];
    conditionFlags_container: Element | undefined;

    files: bcd_builder_dependency_file[] = [];
    files_container: Element | undefined;

    typeDescriptor: bcd_builder_PluginTypeDescriptor;

    constructor(
        element?: Element,
        name = "",
        name_backend = "",
        description: bcd_builder_option_description | string = "",
        image: bcd_builder_option_image | string[] | FileSystemFileHandle = [],
        conditionFlags: bcd_builder_dependency_flag[] = [],
        files: bcd_builder_dependency_file[] = [],
        typeDescriptor: bcd_builder_PluginTypeDescriptor = new bcd_builder_PluginTypeDescriptor()
    ) {
        super(element);
        this.name = name; // Stored as an attribute

        this.name_backend = name_backend; // Stored as a comment

        this.description =
            description instanceof bcd_builder_option_description
                ? description
                : new bcd_builder_option_description(undefined, description);
        this.image =
            image instanceof bcd_builder_option_image
                ? image
                : new bcd_builder_option_image(undefined, image);

        this.conditionFlags = conditionFlags;
        this.files = files;

        this.typeDescriptor = typeDescriptor;
    }

    asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("option");

        this.instanceElement.setAttribute("name", this.name);

        this.name_backend_node =
            this.name_backend_node ?? document.createComment(this.name_backend);
        this.instanceElement.appendChild(this.name_backend_node);

        this.instanceElement.appendChild(this.description.asModuleXML(document));
        this.instanceElement.appendChild(this.image.asModuleXML(document));

        for (const conditionFlag of this.conditionFlags) {
            this.instanceElement.appendChild(conditionFlag.asModuleXML(document));
        }

        for (const file of this.files) {
            this.instanceElement.appendChild(file.asModuleXML(document));
        }

        this.instanceElement.appendChild(this.typeDescriptor.asModuleXML(document));

        return this.instanceElement;
    }
}

export class bcd_builder_option_description extends bcd_builder_XMLElement {
    description = "";

    constructor(element?: Element, description = "") {
        super(element);
        this.description = description;
    }

    asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("description");
        this.instanceElement.textContent = this.description;
        return this.instanceElement;
    }
}

export class bcd_builder_option_image extends bcd_builder_XMLElement {
    image: string[] = [];

    constructor(element?: Element, image: string[] | FileSystemFileHandle = []) {
        super(element);

        var temp_img: string[] | FileSystemFileHandle = image;

        if (!(temp_img instanceof Array))
            window.bcd_builder.directory
                ?.resolve(temp_img)
                .then((path) => (this.image = path ?? []));
        else this.image = temp_img;
    }

    asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("image");

        this.instanceElement.setAttribute(
            "path",
            (this.image as string[]).join("\\")
        );

        return this.instanceElement;
    }
}



















































export class bcd_builder_FOMOD extends bcd_builder_XMLElement {
    meta_name;
    meta_image;
    meta_author;
    meta_version;
    meta_id: number;

    meta_url:URL|string = ''; // Is actually set during the constructor, however TS is too static to understand that.

    setURL(url:URL|string, doWarn:boolean=true):void{
        if (url instanceof URL) this.meta_url = url;
        else {
            try {
                this.meta_url = new URL(url);
            } catch (e) {
                this.meta_url = url;

                if(doWarn) null; // TODO: Warn about invalid URL
            }
        }
    }

    getURLAsString():string{
        return this.meta_url instanceof URL ?
                                              this.meta_url.toString()
                                            : this.meta_url;
    }


    installs: bcd_builder_FOMOD_install[];

    conditions: bcd_builder_dependency_group | undefined;
    steps: bcd_builder_FOMOD_step[];

    constructor(
        instanceElement?: Element,
        meta_name: string = "",
        meta_image: string = "",
        meta_author: string = "",
        meta_version: string = "",
        meta_id: number = 0,
        meta_url: string = "",
        installs: bcd_builder_FOMOD_install[] = [],
        steps: bcd_builder_FOMOD_step[] = [],
        conditions?: bcd_builder_dependency_group
    ) {
        super(instanceElement);
        this.meta_name = meta_name;
        this.meta_image = meta_image;
        this.meta_author = meta_author;
        this.meta_version = meta_version;
        this.meta_id = meta_id;
        this.setURL(meta_url);
        this.installs = installs;
        this.conditions = conditions;
        this.steps = steps;
    }

    asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("fomod");

        this.instanceElement.setAttribute("name", this.meta_name);
        this.instanceElement.setAttribute("image", this.meta_image);
        this.instanceElement.setAttribute("author", this.meta_author);
        this.instanceElement.setAttribute("version", this.meta_version);
        this.instanceElement.setAttribute("id", this.meta_id.toString());
        this.instanceElement.setAttribute("url", this.getURLAsString());

        for (const install of this.installs) {
            this.instanceElement.appendChild(install.asModuleXML(document));
        }

        if (this.conditions)
            this.instanceElement.appendChild(this.conditions.asModuleXML(document));

        for (const step of this.steps) {
            this.instanceElement.appendChild(step.asModuleXML(document));
        }

        return this.instanceElement;
    }
}
