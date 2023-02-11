import * as main from './fomod-builder.js'; // Brings in global things
import { objOf, UpdatableObject } from '../../universal.js';

import * as ui from './fomod-builder-ui.js';

// TODO: Change Step/Group/Option arrays to Sets (makes it easier to remove stuff)


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

/** A map of FOMODElementProxy classes and the classes they should create for update purposes */
export const UpdateObjects =new Map<FOMODElementProxy|Function, ({new(param: any): UpdatableObject} & Omit<typeof UpdatableObject, 'new'>)[]>();
export function addUpdateObjects<TClass extends Omit<typeof FOMODElementProxy, 'new'> & {new(...any:any):any}>(obj: TClass, ...updatables: ({new(param: InstanceType<TClass>): UpdatableObject} & Omit<typeof UpdatableObject, 'new'>)[]) {
    UpdateObjects.get(obj)?.push(...updatables) ||
    UpdateObjects.set(obj, updatables);
}

export abstract class FOMODElementProxy extends UpdatableObject {
    instanceElement: Element | undefined;

    objectsToUpdate: UpdatableObject[] = [];

    updateObjects() {
        this.objectsToUpdate.forEach(  (obj) => obj.update()  );
        if ('steps' in this && this.steps instanceof Set) this.steps.forEach(  (step) => step.update()  );
        if ('groups' in this && this.groups instanceof Set) this.groups.forEach(  (group) => group.update()  );
        if ('options' in this && this.options instanceof Set) this.options.forEach(  (option) => option.update()  );
        ui.autoSave();
    }

    override update_() { this.updateObjects(); }

    protected override destroy_(): void {
        this.objectsToUpdate.forEach(  (obj) => obj.destroy()  );
        if ('steps' in this && this.steps instanceof Array) this.steps.forEach(  (step) => step.destroy()  );
        if ('groups' in this && this.groups instanceof Array) this.groups.forEach(  (group) => group.destroy()  );
        if ('options' in this && this.options instanceof Array) this.options.forEach(  (option) => option.destroy()  );
    }

    constructor(instanceElement: Element | undefined = undefined) {
        super();
        this.suppressUpdates = true;
        this.instanceElement = instanceElement;

        queueMicrotask(() => {
            for (const updatable of UpdateObjects.get(this.constructor) ?? []) this.objectsToUpdate.push(new updatable(this));
            this.suppressUpdates = false;
            this.updateObjects();
        });
    }

    asModuleXML?(document: XMLDocument): Element;
    asInfoXML?(document: XMLDocument): Element;
}

interface InheritedFOMODData {
    base?: Fomod,
    tree?: FomodTree,
    containers?: Record<string, HTMLDivElement>,
    treeKeys: symbol[],
}


export abstract class Dependency extends FOMODElementProxy {
    constructor(instanceElement: Element | undefined = undefined) {
        super(instanceElement);
    }

    abstract override asModuleXML(document: XMLDocument): Element;
}



export abstract class DependencyBaseVersionCheck extends Dependency {
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

    private constructor(name = '', value:string|null = null) {
        this.name ??= name;
        if (typeof value === 'string') this.values.add(value);
        flags[name] = this;
    }

    static get(name: string): Flag {
        return flags[name] ?? new Flag(name);
    }

    static setValue(name: string, value: string): Flag {
        const flag = Flag.get(name);
        flag.values.add(value);
        return flag;
    }

    /** @returns whether or not a value was removed from the `values` Set */
    removeValue(value:string): boolean {
        return this.values.delete(value);
    }
}

export type DependencyFileState = 'Active' | 'Inactive' | 'Missing';
export type DependencyGroupOperator = 'And' | 'Or';
export class DependencyGroup extends Dependency {
    private _operator: DependencyGroupOperator = 'And';
    set operator(value: DependencyGroupOperator) { this._operator = value; this.updateObjects(); } get operator(): DependencyGroupOperator { return this._operator; }

    private _children: Dependency[] = [];
    set children(value: Dependency[]) { this._children = value; this.updateObjects(); } get children(): Dependency[] { return this._children; }

    constructor(
        instanceElement: Element | undefined = undefined,
        operator: DependencyGroupOperator = 'And',
        parseChildren = false
    ) {
        super(instanceElement);
        this.operator = operator;
        if (instanceElement) {
            this._operator =
                (instanceElement.getAttribute(
                    'operator'
                ) as DependencyGroupOperator) || operator;
        }

        if (!parseChildren || !instanceElement) return;

        for (const child of instanceElement.children) {
            this.children.push(parseDependency(child));
        }
    }

    // <moduleDependencies operator="And">
    override asModuleXML(document: XMLDocument, nodeName = 'dependencies'): Element {
        this.instanceElement ??= document.createElement(nodeName);

        if (this.instanceElement && this.instanceElement.tagName !== nodeName) {
            this.instanceElement.remove();
            this.instanceElement = document.createElement(nodeName);
            for (const child of this.children) {
                if (child.instanceElement)
                    this.instanceElement.appendChild(child.instanceElement);
            }
        }

        this.instanceElement.setAttribute('operator', this.operator);
        for (const child of this.children) {
            this.instanceElement.appendChild(child.asModuleXML(document));
        }
        return this.instanceElement;
    }
}

type DependencyFlagTags = 'flag' | 'flagDependency';
export class DependencyFlag extends Dependency {
    private _flag = '';
    set flag(value: string) { this._flag = value; this.updateObjects(); } get flag(): string { return this._flag; }

    private _value = '';
    set value(value: string) { this._value = value; this.updateObjects(); } get value(): string { return this._value; }

    readonly type:DependencyFlagTags;

    constructor(type: DependencyFlagTags, instanceElement: Element | undefined = undefined) {
        super(instanceElement);
        this.type = type;
        if (instanceElement) {
            this.flag = instanceElement.getAttribute('name') ?? '';
            this.value = instanceElement.getAttribute('value') || instanceElement.textContent || '';
        }
    }

    // <flagDependency flag="" value="" />
    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement ??= document.createElement(this.type);

        this.instanceElement.setAttribute('name', this.flag);
        if (this.type === 'flagDependency')
            this.instanceElement.setAttribute('value', this.value);
        else
            this.instanceElement.textContent = this.value;

        return this.instanceElement;
    }
}
export class DependencyFile extends Dependency {
    private _file = '';
    set file(value: string) { this._file = value; this.updateObjects(); } get file(): string { return this._file; }

    private _state: DependencyFileState = 'Active';
    set state(value: DependencyFileState) { this._state = value; this.updateObjects(); } get state(): DependencyFileState { return this._state; }

    // <fileDependency file="2" state="Active" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement('fileDependency');
        thisElement.setAttribute('file', this.file);
        thisElement.setAttribute('state', this.state);
        return thisElement;
    }
}


export class DependencyScriptExtender extends DependencyBaseVersionCheck {
    // <foseDependency version="" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement('foseDependency');
        thisElement.setAttribute('version', this.version);
        return thisElement;
    }
}
export class DependencyGameVersion extends DependencyBaseVersionCheck {
    // <gameDependency version="" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement('gameDependency');
        thisElement.setAttribute('version', this.version);
        return thisElement;
    }
}
export class DependencyModManager extends DependencyBaseVersionCheck {
    // <fommDependency version="1" />
    override asModuleXML(document: XMLDocument): Element {
        const thisElement = document.createElement('fommDependency');
        thisElement.setAttribute('version', this.version);
        return thisElement;
    }
}

function parseDependency(dependency: Element): Dependency {
    const type = dependency.tagName;
    switch (type) {
        case 'dependencies':
            return new DependencyGroup(dependency, undefined, true);
        case 'fileDependency':
            return new DependencyFile(dependency);
        case 'flagDependency':
            return new DependencyFlag('flagDependency', dependency);
        case 'foseDependency':
            return new DependencyScriptExtender(dependency);
        case 'gameDependency':
            return new DependencyGameVersion(dependency);
        case 'fommDependency':
            return new DependencyModManager(dependency);
        default:
            throw new TypeError(`Unknown dependency type: ${type}`);
    }
}

export type OptionType =
    | 'Optional'        // Unchecked but checkable
    | 'Recommended'     // Checked but uncheckable
    | 'CouldBeUseable'  // TODO: Check if this has a use
    | 'Required'        // Permanently checked
    | 'NotUseable';     // Permanently unchecked
export class OptionTypeDescriptor extends FOMODElementProxy {
    private _default: OptionType = 'Optional';
    set default(value: OptionType) { this._default = value; this.updateObjects(); } get default(): OptionType { return this._default; }

    private _dependencies: OptionTypeDescriptorWithDependency[] = [];
    set dependencies(value: OptionTypeDescriptorWithDependency[]) { this._dependencies = value; this.updateObjects(); } get dependencies(): OptionTypeDescriptorWithDependency[] { return this._dependencies; }

    private _basicElement: Element | undefined = undefined;
    set basicElement(value: Element | undefined) { this._basicElement = value; this.updateObjects(); } get basicElement(): Element | undefined { return this._basicElement; }

    private _complexElement: Element | undefined = undefined;
    set complexElement(value: Element | undefined) { this._complexElement = value; this.updateObjects(); } get complexElement(): Element | undefined { return this._complexElement; }

    constructor(
        instanceElement?: Element,
        defaultType: OptionType = 'Optional',
        dependencies: OptionTypeDescriptorWithDependency[] = []
    ) {
        super(instanceElement);
        this.default = defaultType;
        this.dependencies = dependencies;

        this.basicElement = instanceElement?.getElementsByTagName('type')[0];
        this.complexElement = instanceElement?.getElementsByTagName('dependencyType')[0];

        if (this.basicElement) {
            this.default = this.basicElement.getAttribute('name') as OptionType;
        } else if (this.complexElement) {
            const defaultTypeElement = this.complexElement.getElementsByTagName('defaultType')[0];
            if (defaultTypeElement) this.default = defaultTypeElement.getAttribute('default') as OptionType;

            const patternElement = this.complexElement.getElementsByTagName('patterns')[0];
            for (const dependency of patternElement?.children || [])
                this.dependencies.push(new OptionTypeDescriptorWithDependency(dependency));
        }
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement ??= document.createElement('typeDescriptor');

        if (this.dependencies.length == 0) {
            this.complexElement?.remove();

            this.basicElement ??= this.instanceElement.appendChild(document.createElement('type'));
            this.basicElement.setAttribute('name', this.default);

            return this.instanceElement;
        }

        this.basicElement?.remove();
        this.complexElement ??= this.instanceElement.appendChild(  document.createElement('dependencyType'))  ;

        const complexTypeElement = this.complexElement.getOrCreateChildByTag('defaultType');
        complexTypeElement.setAttribute('default', this.default);

        const complexPatternElement = this.complexElement.getOrCreateChildByTag('patterns');
        for (const dependency of this.dependencies)
            complexPatternElement.appendChild(  dependency.asModuleXML(document) );

        return this.instanceElement;
    }
}

export class OptionTypeDescriptorWithDependency extends FOMODElementProxy {
    private _type: OptionType = 'Optional';
    set type(value: OptionType) { this._type = value; this.updateObjects(); } get type(): OptionType { return this._type; }

    private _typeElement: Element | undefined = undefined;
    set typeElement(value: Element | undefined) { this._typeElement = value; this.updateObjects(); } get typeElement(): Element | undefined { return this._typeElement; }

    private _dependency!: DependencyGroup;
    set dependency(value: DependencyGroup) { this._dependency = value; this.updateObjects(); } get dependency(): DependencyGroup { return this._dependency; }

    constructor(instanceElement?: Element, dependency?: DependencyGroup, type: OptionType = 'Optional') {
        super(instanceElement);
        this.dependency = dependency ?? new DependencyGroup();
        this.type = type;
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement('pattern');

        this.typeElement = this.typeElement
                                    ?? this.instanceElement.appendChild(document.createElement('type'));
        this.typeElement.setAttribute('name', this.type);

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



export class Install extends FOMODElementProxy {
    static paths: string[][] = [];

    private _path!: string[];
    set path(value: string[]) { this._path = value; this.updateObjects(); } get path(): string[] { return this._path; }

    async updateFile(pathOrFile: string|string[] | FileSystemHandle): Promise<void> {

        if (typeof pathOrFile === 'string') {
            const filePath: string[] = pathOrFile.split('/');
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

        throw new Error('Could not resolve path - most likely outside of the root directory');
    }

    constructor(
        element: Element,
        file: string | string[] | FileSystemFileHandle = ['']
    ) {
        super(element);
        this.updateFile(file);
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement ??= document.createElement('install');

        const path = this.path.join('/');
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
    | 'Ascending'  // Alphabetical
    | 'Descending' // Reverse Alphabetical
    | 'Explicit';  // Explicit order

export class Step extends FOMODElementProxy {
    inherited: InheritedFOMODData;

    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _sortingOrder: SortOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    set sortingOrder(value: SortOrder) { this._sortingOrder = value; this.updateObjects(); } get sortingOrder(): SortOrder { return this._sortingOrder; }

    private _groups: Group[] = [];
    set groups(value: Group[]) { this._groups = value; this.updateObjects(); } get groups(): Group[] { return this._groups; }

    groupsContainers: Record<string, HTMLDivElement> = {};

    conditions: DependencyGroup | undefined;

    addGroup(xmlElement?: ConstructorParameters<typeof Group>[1], symbol?: symbol) {
        this.groups.push(new Group({
            base: this.inherited.base,
            containers: this.groupsContainers,
            tree: this.inherited.tree,
            treeKeys: [...this.inherited.treeKeys, symbol ?? Symbol()]
        }, xmlElement));
        this.inherited.base?.updateObjects() || this.updateObjects();
    }
    readonly addGroup_bound = this.addGroup.bind(this);


    constructor(inherited: InheritedFOMODData, instanceElement?: Element | undefined) {
        super(instanceElement);
        this.inherited = inherited;

        if (inherited.tree && inherited.treeKeys[0])
            inherited.tree.steps[inherited.treeKeys[0]] = {
                step: this,
                groups: {}
            };



        if (this.instanceElement) {
            this.name = this.instanceElement.getAttribute('name') ?? '';

            const groupsElem = this.instanceElement.getElementsByTagName('optionalFileGroups')[0];
            if (groupsElem) {
                this.sortingOrder = groupsElem.getAttribute('order') as SortOrder || window.FOMODBuilder.storage.settings.defaultSortingOrder;

                for (const group of groupsElem.children ?? [])
                    this.addGroup(group);
            }
        }

        if (this.groups.length == 0) this.addGroup();
    }

    // <installStep name="THE FIRST OF MANY STEPS">
    // <optionalFileGroups order="Explicit">

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement ??= document.createElement('installStep');

        this.instanceElement.setAttribute('name', this.name);

        const visibility = this.conditions?.asModuleXML(document, 'visible');
        if (visibility) this.instanceElement.appendChild(visibility);
        else this.instanceElement.removeChildByTag('visible');

        const optionalFileGroups = this.instanceElement.getOrCreateChildByTag('optionalFileGroups');
        optionalFileGroups.setAttribute('order', this.sortingOrder);


        for (const group of this.groups) optionalFileGroups.appendChild(group.asModuleXML(document));
        this.instanceElement.appendChild(optionalFileGroups);

        return this.instanceElement;
    }
}

export type GroupSelectType =
    | 'SelectAll'           // Force-selects all options
    | 'SelectAny'           // Allows users to select any number of options
    | 'SelectAtMostOne'     // Requires users to select one or no options
    | 'SelectAtLeastOne'    // Requires users to select at least one option
    | 'SelectExactlyOne';   // Requires users to select exactly one option
export class Group extends FOMODElementProxy {
    inherited: InheritedFOMODData;

    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _type: GroupSelectType = window.FOMODBuilder.storage.settings.defaultGroupSelectType;
    set type(value: GroupSelectType) { this._type = value; this.updateObjects(); } get type(): GroupSelectType { return this._type; }

    private _sortingOrder: SortOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    set sortingOrder(value: SortOrder) { this._sortingOrder = value; this.updateObjects(); } get sortingOrder(): SortOrder { return this._sortingOrder; }

    private _options: Option[] = [];
    set options(value: Option[]) { this._options = value; this.updateObjects(); } get options(): Option[] { return this._options; }

    optionsContainers: Record<string, HTMLDivElement> = {};

    addOption(xmlElement?: ConstructorParameters<typeof Option>[1], symbol?: symbol) {
        this.options.push(new Option({
            base: this.inherited.base,
            containers: this.optionsContainers,
            tree: this.inherited.tree,
            treeKeys: [...this.inherited.treeKeys, symbol ?? Symbol()]
        }, xmlElement));
        this.inherited.base?.updateObjects() || this.updateObjects();
    }
    readonly addOption_bound = this.addOption.bind(this);

    constructor(inherited: InheritedFOMODData, instanceElement?: Element | undefined) {
        super(instanceElement);
        this.inherited = inherited;

        if (inherited.tree && inherited.treeKeys[0] && inherited.tree.steps[inherited.treeKeys[0]] && inherited.treeKeys[1])
            inherited.tree.steps[inherited.treeKeys[0]]!.groups[inherited.treeKeys[1]] = {
                group: this,
                options: {}
            };



        if (this.instanceElement) {
            this.name = this.instanceElement.getAttribute('name') ?? '';
            this.type = this.instanceElement.getAttribute('type') as GroupSelectType
                || window.FOMODBuilder.storage.settings.defaultGroupSelectType;

            const optionsElem = this.instanceElement.getElementsByTagName('plugins')[0];
            if (optionsElem){
                this.sortingOrder = optionsElem.getAttribute('order') as SortOrder || window.FOMODBuilder.storage.settings.defaultSortingOrder;

                for (const option of optionsElem.children ?? [])
                    this.addOption(option);
            }
        }

        if (this.options.length == 0) this.addOption();
    }

    // <group name="Banana Types" type="SelectAny">
    // <plugins order="Explicit">

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement = this.instanceElement ?? document.createElement('group');

        this.instanceElement.setAttribute('name', this.name);
        this.instanceElement.setAttribute('type', this.type);

        if (this.options.length > 0) {
        const options = this.instanceElement.getOrCreateChildByTag('plugins');
        options.setAttribute('order', this.sortingOrder);

        for (const option of this.options) options.appendChild(option.asModuleXML(document));
    } else
        this.instanceElement.removeChildByTag('plugins');

        return this.instanceElement;
    }
}

export class Option extends FOMODElementProxy {
    inherited: InheritedFOMODData;

    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _description!: string;
    set description(value: string) { this._description = value; this.updateObjects(); } get description(): string { return this._description; }

    private _image!: string;
    set image(value: string) { this._image = value; this.updateObjects(); } get image(): string { return this._image; }

    private _conditionFlags: DependencyFlag[] = [];
    set conditionFlags(value: DependencyFlag[]) { this._conditionFlags = value; this.updateObjects(); } get conditionFlags(): DependencyFlag[] { return this._conditionFlags; }

    private _files: DependencyFile[] = [];
    set files(value: DependencyFile[]) { this._files = value; this.updateObjects(); } get files(): DependencyFile[] { return this._files; }

    private _typeDescriptor!: OptionTypeDescriptor;
    set typeDescriptor(value: OptionTypeDescriptor) { this._typeDescriptor = value; this.updateObjects(); } get typeDescriptor(): OptionTypeDescriptor { return this._typeDescriptor; }

    constructor(inherited: InheritedFOMODData, instanceElement?: Element | undefined) {
        super(instanceElement);
        this.inherited = inherited;

        if (inherited.tree && inherited.treeKeys[0] && inherited.treeKeys[1] && inherited.treeKeys[2] && inherited.tree.steps[inherited.treeKeys[0]]?.groups[inherited.treeKeys[1]])
            inherited.tree.steps[inherited.treeKeys[0]]!.groups[inherited.treeKeys[1]]!.options[inherited.treeKeys[2]] = this;

        const typeDescriptor: Element|undefined = this.instanceElement?.getElementsByTagName('typeDescriptor')[0];
        this.typeDescriptor = new OptionTypeDescriptor(typeDescriptor);

        if (!this.instanceElement) return;

        this.name = this.instanceElement.getAttribute('name') || '';
        this.description = this.instanceElement.getElementsByTagName('description')[0]?.textContent || '';
        this.image = this.instanceElement.getElementsByTagName('image')[0]?.getAttribute('path') || '';

        for (const flag of this.instanceElement.getElementsByTagName('flag') ?? [])
            this.conditionFlags.push(new DependencyFlag('flag', flag));

        for (const file of this.instanceElement.getElementsByTagName('file') ?? [])
            this.files.push(new DependencyFile(file));
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement('plugin');

        this.instanceElement.setAttribute('name', this.name);

        const description  = this.instanceElement.getOrCreateChildByTag('description');
        description.textContent = this.description;
        this.instanceElement.appendChild(description);

        if (this.image) {
            const image = this.instanceElement.getOrCreateChildByTag('image');

            image.setAttribute('path', this.image);
            this.instanceElement.appendChild(image);
        }
        else this.instanceElement.removeChildByTag('image');

        if (this.conditionFlags.length > 0) {
            const conditionFlags = this.instanceElement.getOrCreateChildByTag('conditionFlags');

            for (const flag of this.conditionFlags) conditionFlags.appendChild(flag.asModuleXML(document));
            this.instanceElement.appendChild(conditionFlags);
        } else
            this.instanceElement.removeChildByTag('conditionFlags');

        if (this.files.length > 0) {
            const files = this.instanceElement.getOrCreateChildByTag('files');

            for (const file of this.files) files.appendChild(file.asModuleXML(document));
            this.instanceElement.appendChild(files);
        } else if (this.conditionFlags.length == 0) {
            const emptyFilesElem = this.instanceElement.getOrCreateChildByTag('files');
            this.instanceElement.appendChild(emptyFilesElem);
        } else
            this.instanceElement.removeChildByTag('files');

        this.instanceElement.appendChild(this.typeDescriptor.asModuleXML(document));

        return this.instanceElement;
    }
}

export class Fomod extends FOMODElementProxy {
    private _metaName: string = '';
    set metaName(value: string) {
        this._metaName = value;
        if (window.FOMODBuilder.storage.settings.keepNamesSynced) this._moduleName = value;
        this.updateObjects();
    }
    get metaName(): string {
        return this._metaName || (window.FOMODBuilder.storage.settings.keepNamesSynced ? this._moduleName : '');
    }

    private _moduleName: string = '';
    set moduleName(value: string) {
        this._moduleName = value;
        if (window.FOMODBuilder.storage.settings.keepNamesSynced) this._metaName = value;
        this.updateObjects();
    }
    get moduleName(): string {
        return this._moduleName || (window.FOMODBuilder.storage.settings.keepNamesSynced ? this._metaName : '');
    }

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

    private _metaUrl:URL|string = '';
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

    sortingOrder: SortOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;

    tree: FomodTree;
    treeKey: [] = [];
    private _parent = null;
    get parent(): null { return this._parent; }

    stepsContainers: Record<string, HTMLDivElement> = {};

    addStep(xmlElement?: ConstructorParameters<typeof Step>[1], symbol?: symbol) {
        this.steps.push(new Step({
            base: this,
            containers: this.stepsContainers,
            tree: this.tree,
            treeKeys: [...this.treeKey, symbol ?? Symbol()]
        }, xmlElement));
        this.updateObjects();
    }
    readonly addStep_bound = this.addStep.bind(this);

    constructor(
        instanceElement?: Element,
        infoInstanceElement?: Element,
    ) {
        super(instanceElement);
        this.tree = {
            fomod: this,
            steps: {}
        };
        this.infoInstanceElement = infoInstanceElement;

        this.metaName =    infoInstanceElement?.getElementsByTagName('Name')           [0]?.textContent                        ?? '';
        this.moduleName =      instanceElement?.getElementsByTagName('moduleName')     [0]?.textContent                        ?? '';
        this.metaImage =       instanceElement?.getElementsByTagName('moduleImage')    [0]?.getAttribute('path')               ?? '';
        this.metaAuthor =  infoInstanceElement?.getElementsByTagName('Author')         [0]?.textContent                        ?? '';
        this.metaVersion = infoInstanceElement?.getElementsByTagName('Version')        [0]?.textContent                        ?? '';
        this.metaUrl =     infoInstanceElement?.getElementsByTagName('Website')        [0]?.textContent                        ?? '';


        const [,id] = infoInstanceElement?.getElementsByTagName('Id')[0]?.textContent?.match(/^\s*(\d+)\s*$/) ?? [];
        if (id) this.metaId = parseInt(id);
        else this.metaId = null;

        const stepsElem = instanceElement?.getElementsByTagName('installSteps')[0];
        this.sortingOrder =         null || stepsElem?.getAttribute('order') as SortOrder || 'Explicit';

        this.steps = [];
        for (const step of (stepsElem?.children ?? [])) this.addStep(step);
        if (this.steps.length == 0) this.addStep();

        const conditionalInstallsElem = instanceElement?.getElementsByTagName('conditionalFileInstalls')[0];
        const requiredInstallsElem = instanceElement?.getElementsByTagName('requiredInstallFiles')[0];

        const conditionalInstalls = [...conditionalInstallsElem?.children ?? []].map(install => new Install(install));
        const requiredInstalls = [...requiredInstallsElem?.children ?? []].map(install => new Install(install));
        this.installs = [...conditionalInstalls, ...requiredInstalls];

        const moduleDependencies = instanceElement?.getElementsByTagName('moduleDependencies')[0];
        if (moduleDependencies) this.conditions = new DependencyGroup(moduleDependencies);
    }

    override asModuleXML(document: XMLDocument): Element {
        if (document.documentElement !== this.instanceElement) {
            document.removeChild(document.documentElement);
            this.instanceElement = document.getOrCreateChildByTag('config');
        }

        this.instanceElement.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        this.instanceElement.setAttribute('xsi:noNamespaceSchemaLocation', 'http://qconsulting.ca/fo3/ModConfig5.0.xsd');

        const moduleName = this.instanceElement.getOrCreateChildByTag('moduleName');
        moduleName.textContent = this.metaName;
        this.instanceElement.appendChild(moduleName);

        if (this.metaImage) {
            const metaImage = this.instanceElement.getOrCreateChildByTag('moduleImage');
            metaImage.setAttribute('path', this.metaImage);
            this.instanceElement.appendChild(metaImage);
        }
        else                this.instanceElement.removeChildByTag     ('moduleImage');

        if (this.conditions)
            this.instanceElement.appendChild(this.conditions.asModuleXML(document, 'moduleDependencies'));
        else
            this.instanceElement.removeChildByTag('moduleDependencies');

        const requiredInstallFiles = this.instanceElement.getOrCreateChildByTag('requiredInstallFiles');
        const optionalInstallList:Element[] = [];
        //for (const install of this.installs) {
        //    const installElem = install.asModuleXML(document);
        //    if (install.dependencies.length > 0)
        //        optionalDependencies.push(installElem);
        //    else
        //        requiredInstallFiles.appendChild(installElem);
        //}
        if (requiredInstallFiles.children.length) this.instanceElement.appendChild(requiredInstallFiles);
        else                                      this.instanceElement.removeChildByTag('requiredInstallFiles');

        if (this.steps.length) {
            const stepsContainer = this.instanceElement.getOrCreateChildByTag('installSteps');
            stepsContainer.setAttribute('order', this.sortingOrder);

            for (const step of this.steps)
                stepsContainer.appendChild(step.asModuleXML(document));

            this.instanceElement.appendChild(stepsContainer);
        } else
            this.instanceElement.removeChildByTag('installSteps');

        if (optionalInstallList.length) {
            const conditionalFileInstalls = this.instanceElement.getOrCreateChildByTag('conditionalFileInstalls');
            for (const install of optionalInstallList) conditionalFileInstalls.appendChild(install);
            this.instanceElement.appendChild(conditionalFileInstalls);
        } else
            this.instanceElement.removeChildByTag('conditionalFileInstalls');

        return this.instanceElement;
    }

    override asInfoXML(document: XMLDocument): Element {
        if (document.documentElement !== this.infoInstanceElement) {
            document.removeChild(document.documentElement);
            this.infoInstanceElement = document.getOrCreateChildByTag('fomod');
        }

        // Set schema info
        this.infoInstanceElement.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        if (window.FOMODBuilder.storage.settings.includeInfoSchema)
            this.infoInstanceElement.setAttribute('xsi:noNamespaceSchemaLocation', 'https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd');
        else if (this.infoInstanceElement.getAttribute('xsi:noNamespaceSchemaLocation') === 'https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd')
            this.infoInstanceElement.removeAttribute('xsi:noNamespaceSchemaLocation');

        // Set actual data
        const url = this.getURLAsString();
        if (this.metaName)          this.infoInstanceElement.getOrCreateChildByTag('Name').textContent    = this.metaName;
        else                        this.infoInstanceElement.removeChildByTag     ('Name');

        if (this.metaAuthor)        this.infoInstanceElement.getOrCreateChildByTag('Author').textContent  = this.metaAuthor;
        else                        this.infoInstanceElement.removeChildByTag     ('Author');

        if (this.metaId !== null)   this.infoInstanceElement.getOrCreateChildByTag('Id').textContent      = this.metaId.toString();
        else                        this.infoInstanceElement.removeChildByTag     ('Id');

        if (url)                    this.infoInstanceElement.getOrCreateChildByTag('Website').textContent = url;
        else                        this.infoInstanceElement.removeChildByTag     ('Website');

        if (this.metaVersion)       this.infoInstanceElement.getOrCreateChildByTag('Version').textContent = this.metaVersion;
        else                        this.infoInstanceElement.removeChildByTag     ('Version');

        return this.infoInstanceElement;
    }
}

interface GroupTree {
    group: Group,
    options: {
        [key: symbol]: Option,
    }
}

interface StepTree {
    step: Step,
    groups: {
        [key: symbol]: GroupTree
    }
}

interface FomodTree {
    fomod: Fomod,
    steps: {
        [key: symbol]: StepTree
    }
}

function traverseTree<TTree extends Option|GroupTree|StepTree|FomodTree, TSymbolArr extends symbol[]>(tree: TTree | undefined, symbols: TSymbolArr): TTree | undefined | Exclude< Exclude< Exclude< TSymbolArr extends [symbol, symbol, symbol] ? Option : ( TSymbolArr extends [symbol, symbol] ? GroupTree | Option : ( TSymbolArr extends [symbol] ? StepTree | GroupTree | Option : StepTree | GroupTree | Option | TTree ) ), TTree extends Option ? Option|StepTree | GroupTree | FomodTree : never >, TTree extends GroupTree ? GroupTree|StepTree|FomodTree : never >, TTree extends StepTree ? StepTree|FomodTree : never > {
    if (!tree || symbols.length == 0) return tree;

    if (tree instanceof Option) {
        console.warn('Option found in tree, but symbols remain');
        return tree;
    }

    const [symbol, ...rest] = symbols;
    if ('steps' in tree) return traverseTree(tree.steps[symbol!], rest) as ReturnType<typeof traverseTree<TTree, TSymbolArr>>;
    if ('groups' in tree) return traverseTree(tree.groups[symbol!], rest) as ReturnType<typeof traverseTree<TTree, TSymbolArr>>;
    if ('options' in tree) return traverseTree(tree.options[symbol!], rest) as ReturnType<typeof traverseTree<TTree, TSymbolArr>>;
    throw new Error('Invalid tree!');
}
