import * as main from "./fomod-builder.js"; // Brings in global things
/* eslint-disable i18n-text/no-en */// FOMODs are XML files with a schema written in English, so disallowing English makes little sense.

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap
*/

export class XMLElement {
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


/*$$$$$\                            $$\ $$\   $$\     $$\
$$  __$$\                           $$ |\__|  $$ |    \__|
$$ /  \__| $$$$$$\  $$$$$$$\   $$$$$$$ |$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\
$$ |      $$  __$$\ $$  __$$\ $$  __$$ |$$ |\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |      $$ /  $$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\
$$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\
\$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
 \______/  \______/ \__|  \__| \_______|\__|   \____/ \__| \______/ \__|  \__|\______*/

export class flag {
    name = "";
    value = "";
    getters:unknown[] = [];
    setters:unknown[] = [];

    constructor(name = "", value = "") {
        this.name = name;
        this.value = value;
    }
}

export class dependency extends XMLElement {
    constructor(instanceElement: Element | undefined = undefined) {
        super(instanceElement);
    }
}

export type dependency_file_state = "Active" | "Inactive" | "Missing";
export type dependency_group_operator = "And" | "Or";
export class dependency_group extends dependency {
    operator: dependency_group_operator /*= 'And'*/;
    children: dependency[] = [];

    constructor(
        instanceElement: Element | undefined = undefined,
        operator: dependency_group_operator = "And",
        parseChildren = false
    ) {
        super(instanceElement);
        this.operator = operator;
        if (instanceElement) {
            this.operator =
                (instanceElement.getAttribute(
                    "operator"
                ) as dependency_group_operator) || operator;
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
export class dependency_flag extends dependency {
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
export class dependency_file extends dependency {
    file = "";
    state: dependency_file_state = "Active";

    // <fileDependency file="2" state="Active" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("fileDependency");
        thisElement.setAttribute("file", this.file);
        thisElement.setAttribute("state", this.state);
        return thisElement;
    }
}
export class dependency_versionCheck extends dependency {
    version = "";
}
export class dependency_FOSE extends dependency_versionCheck {
    // <foseDependency version="" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("foseDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class dependency_game extends dependency_versionCheck {
    // <gameDependency version="" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("gameDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class dependency_modManager extends dependency_versionCheck {
    // <fommDependency version="1" />
    asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("fommDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}

function parseDependency(dependency: Element): dependency {
    const type = dependency.tagName;
    switch (type) {
        case "dependencies":
            return new dependency_group(dependency, undefined, true);
        case "fileDependency":
            return new dependency_file(dependency);
        case "flagDependency":
            return new dependency_flag(dependency);
        case "foseDependency":
            return new dependency_FOSE(dependency);
        case "gameDependency":
            return new dependency_game(dependency);
        case "fommDependency":
            return new dependency_modManager(dependency);
        default:
            throw new TypeError(`Unknown dependency type: ${type}`);
    }
}

export type PluginType =
    | "Optional"        // Unchecked but checkable
    | "Recommended"     // Checked but uncheckable
    | "CouldBeUseable"  // TODO: Check if this has a use
    | "Required"        // Permanently checked
    | "NotUseable";     // Permanently unchecked
export class PluginTypeDescriptor extends XMLElement {
    default: PluginType = "Optional";

    dependencies: PluginTypeDescriptor_dependency[] = [];

    instanceElement_basic: Element | undefined = undefined;
    instanceElement_complex: Element | undefined = undefined;
    instanceElement_complex_type: Element | undefined = undefined;
    instanceElement_complex_patterns: Element | undefined = undefined;

    constructor(
        element?: Element,
        defaultType: PluginType = "Optional",
        dependencies: PluginTypeDescriptor_dependency[] = []
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

export class PluginTypeDescriptor_dependency extends XMLElement {
    type: PluginType = "Optional";
    instanceElement_type: Element | undefined = undefined;

    dependency: dependency_group;

    constructor(dependency: dependency_group, type: PluginType = "Optional"
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

export class FOMOD_install extends XMLElement {
    static files: string[][] = [];

    file!: string[];

    updateFile(file: string | string[] | FileSystemFileHandle): void {
        if (typeof file === "string") {
            const filePath: string[] = file.split("/");
            FOMOD_install.files.push(filePath);
            this.file = filePath;
        } else if (file instanceof Array) {
            FOMOD_install.files.push(file);
            this.file = file;
        } else {
            window.FOMODBuilder.directory;
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

export type groupSortOrder =
    | "Ascending"  // Alphabetical
    | "Descending" // Reverse Alphabetical
    | "Explicit";  // Explicit order

export class FOMOD_step extends XMLElement {
    name = "";
    order: groupSortOrder = "Explicit";
    groups: FOMOD_group[] = [];
}

export type groupSelectType =
    | "SelectAll"
    | "SelectAny"
    | "SelectAtMostOne"
    | "SelectAtLeastOne"
    | "SelectExactlyOne";
export class FOMOD_group extends XMLElement {
    name = "";
    type: groupSelectType = "SelectAny";
    plugins: option[] = [];
}

export class option extends XMLElement {
    name = "";

    name_backend = "";
    name_backend_node: Comment | undefined;

    description: option_description;

    image: option_image;

    conditionFlags: dependency_flag[] = [];
    conditionFlags_container: Element | undefined;

    files: dependency_file[] = [];
    files_container: Element | undefined;

    typeDescriptor: PluginTypeDescriptor;

    constructor(
        element?: Element,
        name = "",
        name_backend = "",
        description: option_description | string = "",
        image: option_image | string[] | FileSystemFileHandle = [],
        conditionFlags: dependency_flag[] = [],
        files: dependency_file[] = [],
        typeDescriptor: PluginTypeDescriptor = new PluginTypeDescriptor()
    ) {
        super(element);
        this.name = name; // Stored as an attribute

        this.name_backend = name_backend; // Stored as a comment

        this.description =
            description instanceof option_description
                ? description
                : new option_description(undefined, description);
        this.image =
            image instanceof option_image
                ? image
                : new option_image(undefined, image);

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

export class option_description extends XMLElement {
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

export class option_image extends XMLElement {
    image: string[] = [];

    constructor(element?: Element, image: string[] | FileSystemFileHandle = []) {
        super(element);

        var temp_img: string[] | FileSystemFileHandle = image;

        if (!(temp_img instanceof Array))
            window.FOMODBuilder.directory
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



















































export class FOMOD extends XMLElement {
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


    installs: FOMOD_install[];

    conditions: dependency_group | undefined;
    steps: FOMOD_step[];

    constructor(
        instanceElement?: Element,
        meta_name: string = "",
        meta_image: string = "",
        meta_author: string = "",
        meta_version: string = "",
        meta_id: number = 0,
        meta_url: string = "",
        installs: FOMOD_install[] = [],
        steps: FOMOD_step[] = [],
        conditions?: dependency_group
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
