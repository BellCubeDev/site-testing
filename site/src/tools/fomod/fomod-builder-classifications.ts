import * as main from "./fomod-builder.js"; // Brings in global things
import { objOf } from '../../universal';
/* eslint-disable i18n-text/no-en */// FOMODs are XML files with a schema written in English, so disallowing English makes little sense.

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap
*/

export class XMLElement {
    instanceElement: Element | undefined;

    objectsToUpdate: updatableObject[] = [];
    updateObjects() {
        this.objectsToUpdate.forEach(  (obj) => obj.update()  );
    }
    update() { this.updateObjects(); }


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

export class updatableObject {
    constructor() {
        this.update();
    }
    update() {
        /*throw new Error*/ return;
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

export const flags:objOf<flag> = {};

export class flag {
    name = "";
    values = new Set<string>();
    getters:unknown[] = [];
    setters:unknown[] = [];

    constructor(name = "", value = "") {
        this.name = name;
        this.values.add(value);

        flags[name] = this;
    }

    /** @returns whether or not a vale was removed from the `values` Set */
    removeValue(value:string): boolean {
        return this.values.delete(value);
    }
}

export function setNewFlagValue(name: string, value: string): flag {
    if (!flags[name]) flags[name] = new flag(name, value);
    return flags[name]!;
}

export class dependency extends XMLElement {
    constructor(instanceElement: Element | undefined = undefined) {
        super(instanceElement);
    }
}

export type dependency_file_state = "Active" | "Inactive" | "Missing";
export type dependency_group_operator = "And" | "Or";
export class dependency_group extends dependency {
    private _operator: dependency_group_operator = 'And';
    set operator(value: dependency_group_operator) { this.updateObjects(); this._operator = value; } get operator(): dependency_group_operator { return this._operator; }

    private _children: dependency[] = [];
    set children(value: dependency[]) { this.updateObjects(); this._children = value; } get children(): dependency[] { return this._children; }

    constructor(
        instanceElement: Element | undefined = undefined,
        operator: dependency_group_operator = "And",
        parseChildren = false
    ) {
        super(instanceElement);
        this.operator = operator;
        if (instanceElement) {
            this._operator =
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
    override asModuleXML(document: XMLDocument, nodeName = "dependencies"): Element {
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
    private _flag = "";
    set flag(value: string) { this.updateObjects(); this._flag = value; } get flag(): string { return this._flag; }

    private _value = "";
    set value(value: string) { this.updateObjects(); this._value = value; } get value(): string { return this._value; }

    // <flagDependency flag="" value="" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("flagDependency");
        thisElement.setAttribute("flag", this.flag);
        thisElement.setAttribute("value", this.value);
        return thisElement;
    }
}
export class dependency_file extends dependency {
    private _file = "";
    set file(value: string) { this.updateObjects(); this._file = value; } get file(): string { return this._file; }

    private _state: dependency_file_state = "Active";
    set state(value: dependency_file_state) { this.updateObjects(); this._state = value; } get state(): dependency_file_state { return this._state; }

    // <fileDependency file="2" state="Active" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("fileDependency");
        thisElement.setAttribute("file", this.file);
        thisElement.setAttribute("state", this.state);
        return thisElement;
    }
}
export class dependency_versionCheck extends dependency {
    private _version = "";
    set version(value: string) { this.updateObjects(); this._version = value; } get version(): string { return this._version; }
}
export class dependency_FOSE extends dependency_versionCheck {
    // <foseDependency version="" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("foseDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class dependency_game extends dependency_versionCheck {
    // <gameDependency version="" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("gameDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class dependency_modManager extends dependency_versionCheck {
    // <fommDependency version="1" />
    override asModuleXML(document: XMLDocument): Element {
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
    private _default: PluginType = "Optional";
    set default(value: PluginType) { this.updateObjects(); this._default = value; } get default(): PluginType { return this._default; }

    private _dependencies: PluginTypeDescriptor_dependency[] = [];
    set dependencies(value: PluginTypeDescriptor_dependency[]) { this.updateObjects(); this._dependencies = value; } get dependencies(): PluginTypeDescriptor_dependency[] { return this._dependencies; }


    private _instanceElement_basic: Element | undefined = undefined;
    set instanceElement_basic(value: Element | undefined) { this.updateObjects(); this._instanceElement_basic = value; } get instanceElement_basic(): Element | undefined { return this._instanceElement_basic; }

    private _instanceElement_complex: Element | undefined = undefined;
    set instanceElement_complex(value: Element | undefined) { this.updateObjects(); this._instanceElement_complex = value; } get instanceElement_complex(): Element | undefined { return this._instanceElement_complex; }

    private _instanceElement_complex_type: Element | undefined = undefined;
    set instanceElement_complex_type(value: Element | undefined) { this.updateObjects(); this._instanceElement_complex_type = value; } get instanceElement_complex_type(): Element | undefined { return this._instanceElement_complex_type; }

    private _instanceElement_complex_patterns: Element | undefined = undefined;
    set instanceElement_complex_patterns(value: Element | undefined) { this.updateObjects(); this._instanceElement_complex_patterns = value; } get instanceElement_complex_patterns(): Element | undefined { return this._instanceElement_complex_patterns; }


    constructor(
        element?: Element,
        defaultType: PluginType = "Optional",
        dependencies: PluginTypeDescriptor_dependency[] = []
    ) {
        super(element);
        this.default = defaultType;
        this.dependencies = dependencies;
    }

    override asModuleXML(document: XMLDocument): Element {
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
    private _type: PluginType = "Optional";
    set type(value: PluginType) { this.updateObjects(); this._type = value; } get type(): PluginType { return this._type; }

    private _instanceElement_type: Element | undefined = undefined;
    set instanceElement_type(value: Element | undefined) { this.updateObjects(); this._instanceElement_type = value; } get instanceElement_type(): Element | undefined { return this._instanceElement_type; }

    private _dependency!: dependency_group;
    set dependency(value: dependency_group) { this.updateObjects(); this._dependency = value; } get dependency(): dependency_group { return this._dependency; }

    constructor(dependency: dependency_group, type: PluginType = "Optional") {
        super();
        this.dependency = dependency;
        this.type = type;
    }

    override asModuleXML(document: XMLDocument): Element {
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

    private _file!: string[];
    set file(value: string[]) { this.updateObjects(); this._file = value; } get file(): string[] { return this._file; }

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

export class step extends XMLElement {
    name = "";
    order: groupSortOrder = "Explicit";
    groups: group[] = [];
}

export type groupSelectType =
    | "SelectAll"
    | "SelectAny"
    | "SelectAtMostOne"
    | "SelectAtLeastOne"
    | "SelectExactlyOne";
export class group extends XMLElement {
    private _name = "";
    set name(value: string) { this.updateObjects(); this._name = value; } get name(): string { return this._name; }

    private _type: groupSelectType = "SelectAny";
    set type(value: groupSelectType) { this.updateObjects(); this._type = value; } get type(): groupSelectType { return this._type; }

    private _plugins: option[] = [];
    set plugins(value: option[]) { this.updateObjects(); this._plugins = value; } get plugins(): option[] { return this._plugins; }
}

export class option extends XMLElement {
    // Actual Option Name
    private _name = "";
    set name(value: string) { this.updateObjects(); this._name = value; } get name(): string { return this._name; }

    // Backend Name
    private _name_backend = "";
    set name_backend(value: string) { this.updateObjects(); this._name_backend = value; } get name_backend(): string { return this._name_backend; }

    private _name_backend_node: Comment | undefined;
    set name_backend_node(value: Comment | undefined) { this.updateObjects(); this._name_backend_node = value; } get name_backend_node(): Comment | undefined { return this._name_backend_node; }


    // Description
    private _description!: option_description;
    set description(value: option_description) { this.updateObjects(); this._description = value; } get description(): option_description { return this._description; }


    // Image
    private _image!: option_image;
    set image(value: option_image) { this.updateObjects(); this._image = value; } get image(): option_image { return this._image; }

    // Flags
    private _conditionFlags: dependency_flag[] = [];
    set conditionFlags(value: dependency_flag[]) { this.updateObjects(); this._conditionFlags = value; } get conditionFlags(): dependency_flag[] { return this._conditionFlags; }

    private _conditionFlags_container: Element | undefined;
    set conditionFlags_container(value: Element | undefined) { this.updateObjects(); this._conditionFlags_container = value; } get conditionFlags_container(): Element | undefined { return this._conditionFlags_container; }


    // Files
    private _files: dependency_file[] = [];
    set files(value: dependency_file[]) { this.updateObjects(); this._files = value; } get files(): dependency_file[] { return this._files; }

    private _files_container: Element | undefined;
    set files_container(value: Element | undefined) { this.updateObjects(); this._files_container = value; } get files_container(): Element | undefined { return this._files_container; }


    // Type Descriptor
    private _typeDescriptor!: PluginTypeDescriptor;
    set typeDescriptor(value: PluginTypeDescriptor) { this.updateObjects(); this._typeDescriptor = value; } get typeDescriptor(): PluginTypeDescriptor { return this._typeDescriptor; }

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
                : new option_description(undefined, description);   this.description.objectsToUpdate.push(this);


        this.image = image instanceof option_image
                    ? image
                    : new option_image(undefined, image);           this.image.objectsToUpdate.push(this);



        this.conditionFlags = conditionFlags;                       this.conditionFlags.forEach(flag => flag.objectsToUpdate.push(this));
        this.files = files;                                         this.files.forEach(file => file.objectsToUpdate.push(this));

        this.typeDescriptor = typeDescriptor;                       this.typeDescriptor.objectsToUpdate.push(this);
    }

    override asModuleXML(document: XMLDocument): Element {
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
    private _description = "";
    set description(value: string) { this.updateObjects(); this._description = value; } get description(): string { return this._description; }

    constructor(element?: Element, description = "") {
        super(element);
        this.description = description;
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("description");
        this.instanceElement.textContent = this.description;
        return this.instanceElement;
    }
}

export class option_image extends XMLElement {
    private _image: string[] = [];
    set image(value: string[]) { this.updateObjects(); this._image = value; } get image(): string[] { return this._image; }

    constructor(element?: Element, image: string[] | FileSystemFileHandle = []) {
        super(element);

        var temp_img: string[] | FileSystemFileHandle = image;

        if (!(temp_img instanceof Array))
            window.FOMODBuilder.directory
                ?.resolve(temp_img)
                .then((path) => (this.image = path ?? []));
        else this.image = temp_img;
    }

    override asModuleXML(document: XMLDocument): Element {
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
    infoInstanceElement: Element | undefined;

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
    steps: step[];

    constructor(
        instanceElement?: Element,
        infoInstanceElement?: Element,
        meta_name: string = "",
        meta_image: string = "",
        meta_author: string = "",
        meta_version: string = "",
        meta_id: number = 0,
        meta_url: string = "",
        installs: FOMOD_install[] = [],
        steps: step[] = [],
        conditions?: dependency_group
    ) {
        super(instanceElement);
        this.infoInstanceElement = infoInstanceElement;
        this.meta_name = meta_name ?? instanceElement?.getAttribute("moduleName") ?? infoInstanceElement?.getElementsByTagName("Name")[0]?.textContent;
        this.meta_image = meta_image ?? instanceElement;
        this.meta_author = meta_author ?? instanceElement ?? infoInstanceElement?.getElementsByTagName("Author")[0]?.textContent;
        this.meta_version = meta_version ?? instanceElement ?? infoInstanceElement?.getElementsByTagName("Version")[0]?.textContent;
        this.meta_id = meta_id ?? instanceElement ?? infoInstanceElement?.getElementsByTagName("Id")[0]?.textContent;
        this.setURL(meta_url);
        this.installs = installs;
        this.conditions = conditions;
        this.steps = steps;
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("fomod");

        this.instanceElement.setAttribute("moduleName", this.meta_name);
        this.instanceElement.setAttribute("image", this.meta_image);
        //this.instanceElement.setAttribute("author", this.meta_author);
        //this.instanceElement.setAttribute("version", this.meta_version);
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
