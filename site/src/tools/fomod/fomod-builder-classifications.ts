import * as main from "./fomod-builder.js"; // Brings in global things
import { objOf } from '../../universal.js';

import * as bindingsGeneric from './fomod-builder-bindings.js';
import * as bindings1stParty from './fomod-builder-steps-1st-party.js';
import * as bindingsVortex from './fomod-builder-steps-vortex.js';
import * as bindingsMO2 from './fomod-builder-steps-mo2.js';


/*x eslint-disable i18n-text/no-en */// FOMODs are XML files with a schema written in English, so disallowing English makes little sense.

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap
*/

 /*$$$$\  $$\                   $$\                                     $$\
$$  __$$\ $$ |                  $$ |                                    $$ |
$$ /  $$ |$$$$$$$\   $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$\   $$$$$$$\ $$$$$$\    $$$$$$$\
$$$$$$$$ |$$  __$$\ $$  _____|\_$$  _|  $$  __$$\  \____$$\ $$  _____|\_$$  _|  $$  _____|
$$  __$$ |$$ |  $$ |\$$$$$$\    $$ |    $$ |  \__| $$$$$$$ |$$ /        $$ |    \$$$$$$\
$$ |  $$ |$$ |  $$ | \____$$\   $$ |$$\ $$ |      $$  __$$ |$$ |        $$ |$$\  \____$$\
$$ |  $$ |$$$$$$$  |$$$$$$$  |  \$$$$  |$$ |      \$$$$$$$ |\$$$$$$$\   \$$$$  |$$$$$$$  |
\__|  \__|\_______/ \_______/    \____/ \__|       \_______| \_______|   \____/ \______*/

export abstract class XMLElement implements main.updatableObject {
    suppressUpdates = false;
    instanceElement: Element | undefined;

    objectsToUpdate: main.updatableObject[] = [];

    updateObjects() {
        this.objectsToUpdate.forEach(  (obj) => obj.update()  );
        if (!this.suppressUpdates && window.FOMODBuilder.storage.settings.autoSaveAfterChange)  main.save();
    }

    update() { this.updateObjects(); }

    constructor(instanceElement: Element | undefined = undefined) {
        this.instanceElement = instanceElement;
    }

    asModuleXML?(document: XMLDocument): Element;
    asInfoXML?(document: XMLDocument): Element;
}



export abstract class dependency extends XMLElement {
    constructor(instanceElement: Element | undefined = undefined) {
        super(instanceElement);
    }

    abstract override asModuleXML(document: XMLDocument): Element;
}



export abstract class DependencyBaseVersionCheck extends dependency {
    private _version = '';
    set version(value: string) { this._version = value; this.updateObjects(); } get version(): string { return this._version; }
}



/*$$$$$\                            $$\ $$\   $$\     $$\
$$  __$$\                           $$ |\__|  $$ |    \__|
$$ /  \__| $$$$$$\  $$$$$$$\   $$$$$$$ |$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\
$$ |      $$  __$$\ $$  __$$\ $$  __$$ |$$ |\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |      $$ /  $$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\
$$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\
\$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
 \______/  \______/ \__|  \__| \_______|\__|   \____/ \__| \______/ \__|  \__|\______*/

export const flags:objOf<Flag> = {};

export class Flag {
    name = '';
    values = new Set<string>();
    getters:unknown[] = [];
    setters:unknown[] = [];

    constructor(name = '', value = '') {
        this.name = name;
        this.values.add(value);

        flags[name] = this;
    }

    /** @returns whether or not a vale was removed from the `values` Set */
    removeValue(value:string): boolean {
        return this.values.delete(value);
    }
}

export function setNewFlagValue(name: string, value: string): Flag {
    if (!flags[name]) flags[name] = new Flag(name, value);
    return flags[name]!;
}

export type DependencyFileState = "Active" | "Inactive" | "Missing";
export type DependencyGroupOperator = "And" | "Or";
export class DependencyGroup extends dependency {
    private _operator: DependencyGroupOperator = 'And';
    set operator(value: DependencyGroupOperator) { this._operator = value; this.updateObjects(); } get operator(): DependencyGroupOperator { return this._operator; }

    private _children: dependency[] = [];
    set children(value: dependency[]) { this._children = value; this.updateObjects(); } get children(): dependency[] { return this._children; }

    constructor(
        instanceElement: Element | undefined = undefined,
        operator: DependencyGroupOperator = "And",
        parseChildren = false
    ) {
        super(instanceElement);
        this.operator = operator;
        if (instanceElement) {
            this._operator =
                (instanceElement.getAttribute(
                    "operator"
                ) as DependencyGroupOperator) || operator;
        }

        if (!parseChildren || !instanceElement) return;

        for (const child of instanceElement.children) {
            this.children.push(parseDependency(child));
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
export class DependencyFlag extends dependency {
    private _flag = '';
    set flag(value: string) { this._flag = value; this.updateObjects(); } get flag(): string { return this._flag; }

    private _value = '';
    set value(value: string) { this._value = value; this.updateObjects(); } get value(): string { return this._value; }

    // <flagDependency flag='' value='' />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("flagDependency");
        thisElement.setAttribute("flag", this.flag);
        thisElement.setAttribute("value", this.value);
        return thisElement;
    }
}
export class DependencyFile extends dependency {
    private _file = '';
    set file(value: string) { this._file = value; this.updateObjects(); } get file(): string { return this._file; }

    private _state: DependencyFileState = "Active";
    set state(value: DependencyFileState) { this._state = value; this.updateObjects(); } get state(): DependencyFileState { return this._state; }

    // <fileDependency file="2" state="Active" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("fileDependency");
        thisElement.setAttribute("file", this.file);
        thisElement.setAttribute("state", this.state);
        return thisElement;
    }
}


export class DependencyScriptExtender extends DependencyBaseVersionCheck {
    // <foseDependency version='' />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("foseDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class DependencyGameVersion extends DependencyBaseVersionCheck {
    // <gameDependency version='' />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement("gameDependency");
        thisElement.setAttribute("version", this.version);
        return thisElement;
    }
}
export class DependencyModManager extends DependencyBaseVersionCheck {
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
            return new DependencyGroup(dependency, undefined, true);
        case "fileDependency":
            return new DependencyFile(dependency);
        case "flagDependency":
            return new DependencyFlag(dependency);
        case "foseDependency":
            return new DependencyScriptExtender(dependency);
        case "gameDependency":
            return new DependencyGameVersion(dependency);
        case "fommDependency":
            return new DependencyModManager(dependency);
        default:
            throw new TypeError(`Unknown dependency type: ${type}`);
    }
}

export type OptionType =
    | "Optional"        // Unchecked but checkable
    | "Recommended"     // Checked but uncheckable
    | "CouldBeUseable"  // TODO: Check if this has a use
    | "Required"        // Permanently checked
    | "NotUseable";     // Permanently unchecked
export class OptionTypeDescriptor extends XMLElement {
    private _default: OptionType = "Optional";
    set default(value: OptionType) { this._default = value; this.updateObjects(); } get default(): OptionType { return this._default; }

    private _dependencies: OptionTypeDescriptorWithDependency[] = [];
    set dependencies(value: OptionTypeDescriptorWithDependency[]) { this._dependencies = value; this.updateObjects(); } get dependencies(): OptionTypeDescriptorWithDependency[] { return this._dependencies; }


    private _basicElement: Element | undefined = undefined;
    set basicElement(value: Element | undefined) { this._basicElement = value; this.updateObjects(); } get basicElement(): Element | undefined { return this._basicElement; }

    private _complexElement: Element | undefined = undefined;
    set complexElement(value: Element | undefined) { this._complexElement = value; this.updateObjects(); } get complexElement(): Element | undefined { return this._complexElement; }

    private _complexTypeElement: Element | undefined = undefined;
    set complexTypeElement(value: Element | undefined) { this._complexTypeElement = value; this.updateObjects(); } get complexTypeElement(): Element | undefined { return this._complexTypeElement; }

    private _complexPatternElement: Element | undefined = undefined;
    set complexPatternElement(value: Element | undefined) { this._complexPatternElement = value; this.updateObjects(); } get complexPatternElement(): Element | undefined { return this._complexPatternElement; }


    constructor(
        element?: Element,
        defaultType: OptionType = "Optional",
        dependencies: OptionTypeDescriptorWithDependency[] = []
    ) {
        super(element);
        this.default = defaultType;
        this.dependencies = dependencies;
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("typeDescriptor");

        if (this.dependencies.length === 0) {
            this.complexElement?.remove();
            this.complexElement = undefined;

            this.basicElement =
                this.basicElement ??
                this.instanceElement.appendChild(document.createElement("type"));
            this.basicElement.setAttribute("default", this.default);

            return this.instanceElement;
        }

        this.complexElement =
            this.complexElement ??
            this.instanceElement.appendChild(
                document.createElement("dependencyType")
            );

        this.complexTypeElement =
            this.complexTypeElement ??
            this.complexElement.appendChild(
                document.createElement("defaultType")
            );
        this.complexTypeElement.setAttribute("name", this.default);

        this.complexPatternElement =
            this.complexPatternElement ??
            this.complexElement.appendChild(
                document.createElement("patterns")
            );
        for (const dependency of this.dependencies) {
            this.complexPatternElement.appendChild(
                dependency.asModuleXML(document)
            );
        }

        return this.instanceElement;
    }
}

export class OptionTypeDescriptorWithDependency extends XMLElement {
    private _type: OptionType = "Optional";
    set type(value: OptionType) { this._type = value; this.updateObjects(); } get type(): OptionType { return this._type; }

    private _typeElement: Element | undefined = undefined;
    set typeElement(value: Element | undefined) { this._typeElement = value; this.updateObjects(); } get typeElement(): Element | undefined { return this._typeElement; }

    private _dependency!: DependencyGroup;
    set dependency(value: DependencyGroup) { this._dependency = value; this.updateObjects(); } get dependency(): DependencyGroup { return this._dependency; }

    constructor(dependency: DependencyGroup, type: OptionType = "Optional") {
        super();
        this.dependency = dependency;
        this.type = type;
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("pattern");

        this.typeElement = this.typeElement
                                    ?? this.instanceElement.appendChild(document.createElement("type"));
        this.typeElement.setAttribute("name", this.type);

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



export class Install extends XMLElement {
    static paths: string[][] = [];

    private _path!: string[];
    set path(value: string[]) { this._path = value; this.updateObjects(); } get path(): string[] { return this._path; }

    async updateFile(pathOrFile: string|string[] | FileSystemHandle): Promise<void> {

        if (typeof pathOrFile === "string") {
            const filePath: string[] = pathOrFile.split("/");
            Install.paths.push(filePath);
            this.path = filePath;
        }

        else if (pathOrFile instanceof FileSystemHandle) {
            pathOrFile = await window.FOMODBuilder.directory?.handle.resolve(pathOrFile) ?? '';
        }

        if (pathOrFile instanceof Array) {
            Install.paths.push(pathOrFile);
            this.path = pathOrFile;
            return;
        }

        throw new Error("Could not resolve path - most likely outside of the root directory");
    }

    constructor(
        element: Element,
        file: string | string[] | FileSystemFileHandle = ['']
    ) {
        super(element);
        this.updateFile(file);
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("install");

        const path = this.path.join("/");
        const isFolder = this.path[this.path.length - 1] === '';

        this.instanceElement.appendChild(
            document.createElement(isFolder ? 'folder' : 'file')
        ).textContent = isFolder ? path.slice(0, -1) : path;

        return this.instanceElement;
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

export type SortOrder =
    | "Ascending"  // Alphabetical
    | "Descending" // Reverse Alphabetical
    | "Explicit";  // Explicit order

export abstract class Step extends XMLElement {
    name = '';
    order: SortOrder = "Explicit";
    groups: Group[] = [];

    // <installStep name="THE FIRST OF MANY STEPS">
    // <optionalFileGroups order="Explicit">

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("installStep");

        this.instanceElement.setAttribute("name", this.name);

        const optionalFileGroups = this.instanceElement.appendChild(
            document.createElement("optionalFileGroups")
        );
        optionalFileGroups.setAttribute("order", this.order);

        for (const group of this.groups) optionalFileGroups.appendChild(group.asModuleXML(document));

        return this.instanceElement;
    }
}

export type groupSelectType =
    | "SelectAll"           // Force-selects all options
    | "SelectAny"           // Allows users to select any number of options
    | "SelectAtMostOne"     // Requires users to select one or no options
    | "SelectAtLeastOne"    // Requires users to select at least one option
    | "SelectExactlyOne";   // Requires users to select exactly one option
export class Group extends XMLElement {
    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _type: groupSelectType = "SelectAny";
    set type(value: groupSelectType) { this._type = value; this.updateObjects(); } get type(): groupSelectType { return this._type; }

    private _sortOrder: SortOrder = "Explicit";
    set sortOrder(value: SortOrder) { this._sortOrder = value; this.updateObjects(); } get sortOrder(): SortOrder { return this._sortOrder; }

    private _options: Option[] = [];
    set options(value: Option[]) { this._options = value; this.updateObjects(); } get options(): Option[] { return this._options; }


    // <group name="Banana Types" type="SelectAny">
    // <plugins order="Explicit">

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement = this.instanceElement ?? document.createElement("group");

        this.instanceElement.setAttribute("name", this.name);
        this.instanceElement.setAttribute("type", this.type);

        const options = this.instanceElement.appendChild(document.getOrCreateChild("plugins"));
        options.setAttribute("order", this.sortOrder);

        for (const option of this.options) options.appendChild(option.asModuleXML(document));

        return this.instanceElement;
    }
}

export class Option extends XMLElement {
    // Actual Option Name
    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    // Description
    private _description!: OptionDescription;
    set description(value: OptionDescription) { this._description = value; this.updateObjects(); } get description(): OptionDescription { return this._description; }


    // Image
    private _image!: OptionImage;
    set image(value: OptionImage) { this._image = value; this.updateObjects(); } get image(): OptionImage { return this._image; }

    // Flags
    private _conditionFlags: DependencyFlag[] = [];
    set conditionFlags(value: DependencyFlag[]) { this._conditionFlags = value; this.updateObjects(); } get conditionFlags(): DependencyFlag[] { return this._conditionFlags; }

    private _conditionFlagsContainer: Element | undefined;
    set conditionFlagsContainer(value: Element | undefined) { this._conditionFlagsContainer = value; this.updateObjects(); } get conditionFlagsContainer(): Element | undefined { return this._conditionFlagsContainer; }


    // Files
    private _files: DependencyFile[] = [];
    set files(value: DependencyFile[]) { this._files = value; this.updateObjects(); } get files(): DependencyFile[] { return this._files; }

    private _filesContainer: Element | undefined;
    set filesContainer(value: Element | undefined) { this._filesContainer = value; this.updateObjects(); } get filesContainer(): Element | undefined { return this._filesContainer; }


    // Type Descriptor
    private _typeDescriptor!: OptionTypeDescriptor;
    set typeDescriptor(value: OptionTypeDescriptor) { this._typeDescriptor = value; this.updateObjects(); } get typeDescriptor(): OptionTypeDescriptor { return this._typeDescriptor; }

    constructor(
        element?: Element,
        name = '',
        description: OptionDescription | string = '',
        image: OptionImage | string[] | FileSystemFileHandle = [],
        conditionFlags: DependencyFlag[] = [],
        files: DependencyFile[] = [],
        typeDescriptor: OptionTypeDescriptor = new OptionTypeDescriptor()
    ) {
        super(element);
        this.name = name; // Stored as an attribute

        this.description =
            description instanceof OptionDescription
                ? description
                : new OptionDescription(undefined, description);   this.description.objectsToUpdate.push(this);


        this.image = image instanceof OptionImage
                    ? image
                    : new OptionImage(undefined, image);           this.image.objectsToUpdate.push(this);



        this.conditionFlags = conditionFlags;                       this.conditionFlags.forEach(flag => flag.objectsToUpdate.push(this));
        this.files = files;                                         this.files.forEach(file => file.objectsToUpdate.push(this));

        this.typeDescriptor = typeDescriptor;                       this.typeDescriptor.objectsToUpdate.push(this);
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement("option");

        this.instanceElement.setAttribute("name", this.name);

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

export class OptionDescription extends XMLElement {
    private _description = '';
    set description(value: string) { this._description = value; this.updateObjects(); } get description(): string { return this._description; }

    constructor(element?: Element, description = '') {
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

export class OptionImage extends XMLElement {
    private _image: string[] = [];
    set image(value: string[]) { this._image = value; this.updateObjects(); } get image(): string[] { return this._image; }

    constructor(element?: Element, image: string[] | FileSystemFileHandle = []) {
        super(element);

        var tempImg: string[] | FileSystemFileHandle = image;

        if (!(tempImg instanceof Array))
            window.FOMODBuilder.directory
                ?.handle.resolve(tempImg)
                .then((path) => (this.image = path ?? []));
        else this.image = tempImg;
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




export class Fomod extends XMLElement {
    private _metaName: string = '';
    set metaName(value: string) { this._metaName = value; this.updateObjects(); } get metaName(): string { return this._metaName || this._moduleName; }

    private _moduleName: string = '';
    set moduleName(value: string) { this._moduleName = value; this.updateObjects(); } get moduleName(): string { return this._moduleName || this._metaName; }

    private _metaImage: string = '';
    set metaImage(value: string) { this._metaImage = value; this.updateObjects(); } get metaImage(): string { return this._metaImage; }

    private _metaAuthor: string = '';
    set metaAuthor(value: string) { this._metaAuthor = value; this.updateObjects(); } get metaAuthor(): string { return this._metaAuthor; }

    private _metaVersion: string = '';
    /** The metadata version of this mod */
    set metaVersion(value: string) { this._metaVersion = value; this.updateObjects(); } get metaVersion(): string { return this._metaVersion; }

    private _metaId: number|null = null;
    set metaId(value: number|null) { this._metaId = value; this.updateObjects(); } get metaId(): number|null { return this._metaId; }

    private _infoInstanceElement: Element | undefined;
    set infoInstanceElement(value: Element | undefined) { this._infoInstanceElement = value; this.updateObjects(); } get infoInstanceElement(): Element | undefined { return this._infoInstanceElement; }

    _metaUrl:URL|string = '';
    get metaUrl():URL|string { return this._metaUrl; } set metaUrl(url:URL|string) {
        if (url instanceof URL) this._metaUrl = url;
        else {
            try {
                this._metaUrl = new URL(url);
            } catch (e) {
                this._metaUrl = url;
                this.updateObjects();

                //console.warn(`Invalid URL: "${url}"`);
            }
        }
    }

    getURLAsString():string{
        return this.metaUrl instanceof URL ?
                                              this.metaUrl.toString()
                                            : this.metaUrl;
    }


    installs: Install[];

    conditions: DependencyGroup | undefined;
    steps: Step[];
    sortingOrder: SortOrder = 'Explicit';

    constructor(
        instanceElement?: Element,
        infoInstanceElement?: Element,
        metaName: string = '',
        moduleName: string = '',
        metaImage: string = '',
        metaAuthor: string = '',
        metaVersion: string = '',
        metaId: number|null|'' = '',
        metaUrl: string = '',
        installs: Install[] = [],
        steps: Step[] = [],
        conditions?: DependencyGroup
    ) {
        super(instanceElement);
        this.suppressUpdates = true;
        this.infoInstanceElement = infoInstanceElement;

        this.metaName =         metaName || infoInstanceElement?.getElementsByTagName("Name")           [0]?.textContent            || '';
        this.moduleName =     moduleName ||     instanceElement?.getElementsByTagName("moduleName")     [0]?.textContent            || '';
        this.metaImage =       metaImage || infoInstanceElement?.getElementsByTagName("Name")           [0]?.getAttribute("path")   || '';
        this.metaAuthor =     metaAuthor || infoInstanceElement?.getElementsByTagName("Author")         [0]?.textContent            || '';
        this.metaVersion =   metaVersion || infoInstanceElement?.getElementsByTagName("Version")        [0]?.textContent            || '';
        this.metaUrl =           metaUrl || infoInstanceElement?.getElementsByTagName("Website")        [0]?.textContent            || '';

        if (metaId !== '') this.metaId = metaId;
        else {
            const [,id] = infoInstanceElement?.getElementsByTagName("Id")[0]?.textContent?.match(/^\s*(\d+)\s*$/) ?? [];
            if (id) this.metaId = parseInt(id);
            else this.metaId = null;
        }

        this.installs = installs;
        this.conditions = conditions;
        this.steps = steps;


        this.objectsToUpdate.push(
            new bindingsGeneric.modMetadata(this),
            new bindings1stParty.Fomod(this),
        );

        requestAnimationFrame(() => {
            this.updateObjects();
            this.suppressUpdates = false;
        });

    }

    override asModuleXML(document: XMLDocument): Element {
        if (document.documentElement !== this.instanceElement) {
            document.removeChild(document.documentElement);
            this.instanceElement = document.getOrCreateChild("config");
        }
        this.instanceElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        this.instanceElement.setAttribute("xsi:noNamespaceSchemaLocation", "http://qconsulting.ca/fo3/ModConfig5.0.xsd");

        this.instanceElement.getOrCreateChild("moduleName").textContent = this.metaName;
        this.instanceElement.getOrCreateChild("moduleImage").setAttribute('path', this.metaImage);

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

    override asInfoXML(document: XMLDocument): Element {
        if (document.documentElement !== this.infoInstanceElement) {
            document.removeChild(document.documentElement);
            this.infoInstanceElement = document.getOrCreateChild("fomod");
        }

        // Set schema info
        this.infoInstanceElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        if (window.FOMODBuilder.storage.settings.includeInfoSchema)
            this.infoInstanceElement.setAttribute("xsi:noNamespaceSchemaLocation", "https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd");
        else if (this.infoInstanceElement.getAttribute("xsi:noNamespaceSchemaLocation") === "https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd")
            this.infoInstanceElement.removeAttribute("xsi:noNamespaceSchemaLocation");

        // Set actual data
        const url = this.getURLAsString();
        if (this.metaName)          this.infoInstanceElement.getOrCreateChild("Name").textContent    = this.metaName;
        if (this.metaAuthor)        this.infoInstanceElement.getOrCreateChild("Author").textContent  = this.metaAuthor;
        if (this.metaId !== null)   this.infoInstanceElement.getOrCreateChild("Id").textContent      = this.metaId.toString();
        if (url)                    this.infoInstanceElement.getOrCreateChild("Website").textContent = url;
        if (this.metaVersion)       this.infoInstanceElement.getOrCreateChild("Version").textContent = this.metaVersion;

        return this.infoInstanceElement;
    }
}
