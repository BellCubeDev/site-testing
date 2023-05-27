import { UpdatableObject, getSetIndex, wait } from '../../universal.js';
import * as ui from './fomod-builder-ui.js';
function JsonStringifyFomod(key, value) {
    if (key === 'inherited')
        return undefined;
    if (key === 'instanceElement')
        return undefined;
    if (key === 'objectsToUpdate')
        return undefined;
    if (key === 'suppressUpdates')
        return undefined;
    if (key === 'updateObjects')
        return undefined;
    if (typeof value === 'function')
        return undefined;
    if (key.startsWith('_'))
        return undefined;
    if (value instanceof Set)
        return Array.from(value);
    if (value instanceof Map)
        return Object.fromEntries(value.entries());
    return value;
}
export const UpdateObjects = new Map();
export function addUpdateObjects(obj, ...updatables) {
    UpdateObjects.get(obj)?.push(...updatables) ||
        UpdateObjects.set(obj, updatables);
}
export class FOMODElementProxy extends UpdatableObject {
    instanceElement;
    objectsToUpdate = [];
    propagateToChildren_wasTrue = false;
    updateObjects(propagateToChildren = false) {
        if (!this)
            return;
        this.propagateToChildren_wasTrue ||= propagateToChildren;
        queueMicrotask(() => this.propagateToChildren_wasTrue = false);
        if (propagateToChildren)
            return this.update();
        for (const object of this.objectsToUpdate) {
            if (object instanceof FOMODElementProxy)
                object.updateObjects(true);
            else
                object.update();
        }
        if (this.propagateToChildren_wasTrue)
            for (const key of this.keysToUpdate) {
                if (!(key in this))
                    return console.error(`Key ${key} not found in ${this.constructor.name}`, this);
                const obj = this[key];
                if (obj instanceof UpdatableObject)
                    obj.update();
                else if (obj instanceof Set || obj instanceof Array) {
                    for (const nestedObject of obj) {
                        if (nestedObject instanceof FOMODElementProxy)
                            nestedObject.updateObjects(true);
                        else if (nestedObject instanceof UpdatableObject)
                            nestedObject.update();
                    }
                }
            }
        ui.autoSave();
    }
    update_() { this.updateObjects(); }
    destroy() {
        super.destroy();
        this.instanceElement?.remove();
    }
    updateWhole() {
        if (!('inherited' in this && this.inherited && typeof this.inherited === 'object'))
            return this.updateObjects(true);
        if ('base' in this.inherited && this.inherited.base && this.inherited.base instanceof FOMODElementProxy)
            this.inherited.base.updateObjects(true);
        else if ('parent' in this.inherited && this.inherited.parent && this.inherited.parent instanceof FOMODElementProxy)
            this.inherited.parent.updateObjects(true);
        this.updateObjects(true);
    }
    destroy_() {
        this.objectsToUpdate.forEach((obj) => obj.destroy());
        if ('steps' in this && this.steps instanceof Set)
            this.steps.forEach((step) => step.destroy());
        if ('groups' in this && this.groups instanceof Set)
            this.groups.forEach((group) => group.destroy());
        if ('options' in this && this.options instanceof Set)
            this.options.forEach((option) => option.destroy());
        this.updateWhole();
    }
    constructor(instanceElement = undefined) {
        super();
        this.suppressUpdates = true;
        this.instanceElement = instanceElement;
        queueMicrotask(() => {
            for (const updatable of UpdateObjects.get(this.constructor) ?? [])
                this.objectsToUpdate.push(new updatable(this));
            this.suppressUpdates = false;
            this.updateObjects();
        });
    }
}
window.flags = {};
export class Flag {
    name;
    getters;
    gettersByValue;
    setters;
    settersByValue;
    cachedValues;
    static cachedNames = new Map();
    static get(name) { return window.flags[name] ?? new Flag(name); }
    checkValidity() { if (this.setters.size === 0 && this.getters.size === 0)
        delete window.flags[this.name]; }
    constructor(name) {
        if (window.flags[name])
            throw new Error(`Flag ${name} already exists!`);
        this.name = name;
        window.flags[name] = this;
        this.getters = new Set();
        this.setters = new Set();
        this.gettersByValue = {};
        this.settersByValue = {};
        this.cachedValues = new Map();
        queueMicrotask(this.checkValidity.bind(this));
    }
    get values() {
        const values = new Set();
        for (const getter of this.getters)
            values.add(getter.value);
        return values;
    }
    updateSetter(setter) {
        if (setter.flag !== this.name) {
            this.setters.delete(setter);
            const oldValue = this.cachedValues.get(setter);
            if (oldValue)
                this.settersByValue[oldValue]?.delete(setter);
            this.cachedValues.delete(setter);
            this.checkValidity();
            return;
        }
        const oldValue = this.cachedValues.get(setter);
        if (oldValue !== setter.value) {
            if (oldValue !== undefined) {
                if (!this.settersByValue[oldValue])
                    this.settersByValue[oldValue] = new Set();
                this.settersByValue[oldValue].delete(setter);
                if (this.settersByValue[oldValue].size === 0)
                    delete this.settersByValue[oldValue];
            }
            if (!this.settersByValue[setter.value])
                this.settersByValue[setter.value] = new Set();
            this.settersByValue[setter.value].add(setter);
        }
        this.cachedValues.set(setter, setter.value);
        this.setters.add(setter);
    }
    updateGetter(getter) {
        if (getter.flag !== this.name) {
            this.getters.delete(getter);
            const oldValue = this.cachedValues.get(getter);
            if (oldValue)
                this.gettersByValue[oldValue]?.delete(getter);
            this.cachedValues.delete(getter);
            this.checkValidity();
            return;
        }
        const oldValue = this.cachedValues.get(getter);
        if (oldValue !== getter.value) {
            if (oldValue !== undefined) {
                if (!this.gettersByValue[oldValue])
                    this.gettersByValue[oldValue] = new Set();
                this.gettersByValue[oldValue].delete(getter);
                if (this.gettersByValue[oldValue].size === 0)
                    delete this.gettersByValue[oldValue];
            }
            if (!this.gettersByValue[getter.value])
                this.gettersByValue[getter.value] = new Set();
            this.gettersByValue[getter.value].add(getter);
        }
        this.cachedValues.set(getter, getter.value);
        this.getters.add(getter);
    }
    removeItem(item) {
        this.setters.delete(item);
        this.getters.delete(item);
        const oldValue = this.cachedValues.get(item);
        if (oldValue) {
            this.settersByValue[oldValue]?.delete(item);
            this.gettersByValue[oldValue]?.delete(item);
        }
        this.cachedValues.delete(item);
        this.checkValidity();
    }
    static removeItem(item) {
        const oldName = Flag.cachedNames.get(item);
        if (oldName !== undefined)
            Flag.get(oldName).removeItem(item);
        Flag.cachedNames.delete(item);
    }
    static updateSetter(setter) {
        const oldName = Flag.cachedNames.get(setter);
        if (oldName !== setter.flag) {
            if (oldName !== undefined)
                Flag.get(oldName).updateSetter(setter);
            Flag.cachedNames.set(setter, setter.flag);
        }
        Flag.get(setter.flag).updateSetter(setter);
    }
    static updateGetter(getter) {
        const oldName = Flag.cachedNames.get(getter);
        if (oldName !== getter.flag) {
            if (oldName !== undefined)
                Flag.get(oldName).updateGetter(getter);
            Flag.cachedNames.set(getter, getter.flag);
        }
        Flag.get(getter.flag).updateGetter(getter);
    }
}
window.flagClass = Flag;
export class DependencyBase extends FOMODElementProxy {
    keysToUpdate = [];
    constructor(instanceElement = undefined) {
        super(instanceElement);
    }
}
export class DependencyBaseVersionCheck extends DependencyBase {
    _version = '';
    set version(value) { this._version = value; this.updateObjects(); }
    get version() { return this._version; }
}
export class DependencyGroup extends DependencyBase {
    _operator = 'And';
    set operator(value) { this._operator = value; this.updateObjects(); }
    get operator() { return this._operator; }
    _children = [];
    set children(value) { this._children = value; this.updateObjects(); }
    get children() { return this._children; }
    constructor(instanceElement = undefined, operator = 'And', parseChildren = false) {
        super(instanceElement);
        this.operator = operator;
        if (instanceElement) {
            this._operator =
                instanceElement.getAttribute('operator') || operator;
        }
        if (parseChildren)
            this.parseDependencies();
    }
    async parseDependencies() {
        if (!this.instanceElement)
            return;
        for (const child of this.instanceElement.children)
            this.children.push(await parseDependency(child));
        queueMicrotask(() => this.update());
    }
    asModuleXML(document, nodeName = 'dependencies') {
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
export class DependencyFlag extends DependencyBase {
    _flag = '';
    set flag(value) { this._flag = value; this.update(); }
    get flag() { return this._flag; }
    _value = '';
    set value(value) { this._value = value; this.update(); }
    get value() { return this._value; }
    type;
    inherited;
    constructor(type, inherited, instanceElement = undefined) {
        super(instanceElement);
        this.type = type;
        this.inherited = inherited;
        if (instanceElement) {
            this.flag = instanceElement.getAttribute('name') ?? '';
            this.value = instanceElement.getAttribute('value') || instanceElement.textContent || '';
        }
    }
    update_() {
        if (!this.inherited)
            return;
        if (this.type === 'flagDependency')
            Flag.updateGetter(this);
        else if (this.inherited.parent)
            Flag.updateSetter(this);
    }
    destroy_() {
        if (!this.inherited)
            return;
        Flag.removeItem(this);
        this.inherited.parent?.flagsToSet.delete(this);
        super.destroy_();
    }
    asModuleXML(document) {
        this.instanceElement ??= document.createElement(this.type);
        this.instanceElement.setAttribute('name', this.flag);
        if (this.type === 'flagDependency')
            this.instanceElement.setAttribute('value', this.value);
        else
            this.instanceElement.textContent = this.value;
        return this.instanceElement;
    }
}
export class DependencyFile extends DependencyBase {
    _file = '';
    set file(value) { this._file = value; this.updateObjects(); }
    get file() { return this._file; }
    _state = 'Active';
    set state(value) { this._state = value; this.updateObjects(); }
    get state() { return this._state; }
    asModuleXML(document) {
        const thisElement = document.createElement('fileDependency');
        thisElement.setAttribute('file', this.file);
        thisElement.setAttribute('state', this.state);
        return thisElement;
    }
}
export class DependencyScriptExtender extends DependencyBaseVersionCheck {
    asModuleXML(document) {
        const thisElement = document.createElement('foseDependency');
        thisElement.setAttribute('version', this.version);
        return thisElement;
    }
}
export class DependencyGameVersion extends DependencyBaseVersionCheck {
    asModuleXML(document) {
        const thisElement = document.createElement('gameDependency');
        thisElement.setAttribute('version', this.version);
        return thisElement;
    }
}
export class DependencyModManager extends DependencyBaseVersionCheck {
    asModuleXML(document) {
        const thisElement = document.createElement('fommDependency');
        thisElement.setAttribute('version', this.version);
        return thisElement;
    }
}
async function parseDependency(dependency, inherited) {
    const type = dependency.tagName;
    switch (type) {
        case 'dependencies':
            return new DependencyGroup(dependency, undefined, true);
        case 'fileDependency':
            return new DependencyFile(dependency);
        case 'flagDependency':
            if (dependency.previousSibling?.nodeType !== Node.COMMENT_NODE || !inherited?.base)
                return new DependencyFlag('flagDependency', inherited, dependency);
            const [, stepNumStr, groupNumStr, optionNumStr] = dependency.previousSibling.textContent?.match(/Option (\d+)-(\d+)-(\d+)/) ?? [];
            return await parseOptionDependency(stepNumStr, groupNumStr, optionNumStr, inherited.base) ?? new DependencyFlag('flagDependency', inherited, dependency);
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
async function parseOptionDependency(stepNumStr, groupNumStr, optionNumStr, base) {
    if (!stepNumStr || !groupNumStr || !optionNumStr)
        return null;
    while (ui.loadingFomod.state)
        await wait(5);
    const step = getSetIndex(base.steps, parseInt(stepNumStr));
    const group = step ? getSetIndex(step.groups, parseInt(groupNumStr)) : null;
    const option = group ? getSetIndex(group.options, parseInt(optionNumStr)) : null;
    return option ?? null;
}
export class OptionStateDescriptor extends FOMODElementProxy {
    keysToUpdate = ['conditions'];
    _defaultState = 'Optional';
    set defaultState(value) { this._defaultState = value; this.updateObjects(); }
    get defaultState() { return this._defaultState; }
    conditions = [];
    constructor(instanceElement, defaultState = 'Optional', conditions = []) {
        super(instanceElement);
        this.defaultState = defaultState;
        this.conditions = conditions;
        const basicElement = instanceElement?.getElementsByTagName('type')[0];
        const complexElement = instanceElement?.getElementsByTagName('dependencyType')[0];
        if (basicElement) {
            this.defaultState = basicElement.getAttribute('name');
        }
        if (complexElement) {
            const defaultTypeElement = complexElement.getElementsByTagName('defaultType')[0];
            if (defaultTypeElement)
                this.defaultState = defaultTypeElement.getAttribute('name') || 'Optional';
            const patternElement = complexElement.getElementsByTagName('patterns')[0];
            for (const dependency of patternElement?.children || [])
                this.conditions.push(new OptionStateConditionStatement(dependency));
        }
    }
    asModuleXML(document) {
        this.instanceElement ??= document.createElement('typeDescriptor');
        let basicElement = this.instanceElement.getElementsByTagName('type')[0];
        let complexElement = this.instanceElement.getElementsByTagName('dependencyType')[0];
        if (this.conditions.length == 0) {
            complexElement?.remove();
            basicElement = this.instanceElement.getOrCreateChildByTag('type');
            this.instanceElement.appendChild(basicElement);
            basicElement.setAttribute('name', this.defaultState);
            return this.instanceElement;
        }
        basicElement?.remove();
        complexElement = this.instanceElement.getOrCreateChildByTag('dependencyType');
        this.instanceElement.appendChild(complexElement);
        const complexTypeElement = complexElement.getOrCreateChildByTag('defaultType');
        complexTypeElement.setAttribute('default', this.defaultState);
        complexElement.appendChild(complexTypeElement);
        const complexPatternElement = complexElement.getOrCreateChildByTag('patterns');
        for (const dependency of this.conditions)
            complexPatternElement.appendChild(dependency.asModuleXML(document));
        complexElement.appendChild(complexPatternElement);
        return this.instanceElement;
    }
}
export class OptionStateConditionStatement extends FOMODElementProxy {
    keysToUpdate = ['dependencies'];
    _type = 'Optional';
    set type(value) { this._type = value; this.updateObjects(); }
    get type() { return this._type; }
    _typeElement = undefined;
    set typeElement(value) { this._typeElement = value; this.updateObjects(); }
    get typeElement() { return this._typeElement; }
    _dependencies;
    set dependencies(value) { this._dependencies = value; this.updateObjects(); }
    get dependencies() { return this._dependencies; }
    constructor(instanceElement, dependency, type = 'Optional') {
        super(instanceElement);
        this.dependencies = dependency ?? new DependencyGroup();
        this.type = type;
    }
    asModuleXML(document) {
        this.instanceElement =
            this.instanceElement ?? document.createElement('pattern');
        this.typeElement = this.typeElement
            ?? this.instanceElement.appendChild(document.createElement('type'));
        this.typeElement.setAttribute('name', this.type);
        this.instanceElement.appendChild(this.dependencies.asModuleXML(document));
        return this.instanceElement;
    }
}
export const installs = new Set();
function parseFiles(elem) {
    const localInstalls = [];
    if (!elem)
        return localInstalls;
    const dependenciesElem = elem.getElementsByTagName('dependencies')[0];
    const filesElem = elem.getElementsByTagName('files')[0] || elem;
    let dependencies = undefined;
    if (dependenciesElem)
        dependencies = new DependencyGroup(dependenciesElem);
    for (const file of filesElem.children) {
        const install = new InstallElement(file, dependencies);
        localInstalls.push(install);
        installs.add(install);
    }
    return localInstalls;
}
export class InstallElement extends FOMODElementProxy {
    keysToUpdate = ['dependencies'];
    _source = [];
    set source(value) { this._source = value; this.updateObjects(); }
    get source() { return this._source; }
    _destination = [];
    set destination(value) { this._destination = value; this.updateObjects(); }
    get destination() { return this._destination; }
    dependencies = null;
    _priority = 0;
    set priority(value) { this._priority = value; this.updateObjects(); }
    get priority() { return this._priority; }
    async updateFile(pathOrFile) {
        if (pathOrFile instanceof FileSystemHandle)
            pathOrFile = await window.FOMODBuilder.directory?.handle.resolve(pathOrFile) ?? '';
        if (pathOrFile instanceof File)
            if (typeof pathOrFile === 'string')
                pathOrFile = pathOrFile.replace(/\\/g, '/').split('/');
        if (!(pathOrFile instanceof Array))
            throw new Error('Could not resolve path - most likely outside of the root directory');
        this.source = pathOrFile;
    }
    constructor(instanceElement, dependencies) {
        super(instanceElement);
        installs.add(this);
        this.dependencies = dependencies ?? null;
        if (!instanceElement)
            return;
        this.source = instanceElement.getAttribute('source')?.split(/[/\\]/) ?? [];
        this.destination = instanceElement.getAttribute('destination')?.split(/[/\\]/) ?? [];
    }
    asModuleXML(document) {
        this.instanceElement ??= document.createElement('install');
        const path = this.source.join('/');
        const isFolder = this.source[this.source.length - 1] === '';
        this.instanceElement.appendChild(document.createElement(isFolder ? 'folder' : 'file')).textContent = isFolder ? path.slice(0, -1) : path;
        return this.instanceElement;
    }
}
export class Step extends FOMODElementProxy {
    keysToUpdate = ['groups', 'conditions'];
    inherited;
    _name = '';
    set name(value) { this._name = value; this.updateObjects(); }
    get name() { return this._name; }
    _sortingOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    set sortingOrder(value) { this._sortingOrder = value; this.updateObjects(); }
    get sortingOrder() { return this._sortingOrder; }
    groups;
    groupContainers = {};
    conditions;
    addGroup(xmlElement) {
        this.groups.add(new Group({
            base: this.inherited.base,
            containers: this.groupContainers,
            parent: this,
        }, xmlElement));
        this.updateWhole();
    }
    addGroup_bound = this.addGroup.bind(this);
    destroy_() {
        if (this.inherited.parent && this.inherited.parent.steps.size == 1)
            return false;
        this.inherited.parent?.steps.delete(this);
        super.destroy_();
        return true;
    }
    constructor(inherited, instanceElement) {
        super(instanceElement);
        this.inherited = inherited;
        this.groups = new Set();
        if (this.instanceElement) {
            this.name = this.instanceElement.getAttribute('name') ?? '';
            const groupsElem = this.instanceElement.getElementsByTagName('optionalFileGroups')[0];
            if (groupsElem) {
                this.sortingOrder = groupsElem.getAttribute('order') || window.FOMODBuilder.storage.settings.defaultSortingOrder;
                for (const group of groupsElem.children ?? [])
                    this.addGroup(group);
            }
        }
        if (this.groups.size == 0)
            this.addGroup();
    }
    asModuleXML(document) {
        this.instanceElement ??= document.createElement('installStep');
        this.instanceElement.setAttribute('name', this.name);
        const visibility = this.conditions?.asModuleXML(document, 'visible');
        if (visibility)
            this.instanceElement.appendChild(visibility);
        else
            this.instanceElement.removeChildByTag('visible');
        const optionalFileGroups = this.instanceElement.getOrCreateChildByTag('optionalFileGroups');
        optionalFileGroups.setAttribute('order', this.sortingOrder);
        for (const group of this.groups)
            optionalFileGroups.appendChild(group.asModuleXML(document));
        this.instanceElement.appendChild(optionalFileGroups);
        return this.instanceElement;
    }
}
export class Group extends FOMODElementProxy {
    keysToUpdate = ['options'];
    inherited;
    _name = '';
    set name(value) { this._name = value; this.updateObjects(); }
    get name() { return this._name; }
    _type = window.FOMODBuilder.storage.settings.defaultGroupSelectType;
    set type(value) { this._type = value; this.updateObjects(); }
    get type() { return this._type; }
    _sortingOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    set sortingOrder(value) { this._sortingOrder = value; this.updateObjects(); }
    get sortingOrder() { return this._sortingOrder; }
    options;
    optionContainers = {};
    addOption(xmlElement) {
        this.options.add(new Option({
            base: this.inherited.base,
            containers: this.optionContainers,
            parent: this,
        }, xmlElement));
        this.updateWhole();
    }
    addOption_bound = this.addOption.bind(this);
    destroy_() {
        this.inherited.parent?.groups.delete(this);
        super.destroy_();
    }
    constructor(inherited, instanceElement) {
        super(instanceElement);
        this.inherited = inherited;
        this.options = new Set();
        if (this.instanceElement) {
            this.name = this.instanceElement.getAttribute('name') ?? '';
            this.type = this.instanceElement.getAttribute('type')
                || window.FOMODBuilder.storage.settings.defaultGroupSelectType;
            const optionsElem = this.instanceElement.getElementsByTagName('plugins')[0];
            if (optionsElem) {
                this.sortingOrder = optionsElem.getAttribute('order') || window.FOMODBuilder.storage.settings.defaultSortingOrder;
                for (const option of optionsElem.children ?? [])
                    this.addOption(option);
            }
        }
        if (this.options.size == 0)
            this.addOption();
    }
    asModuleXML(document) {
        this.instanceElement = this.instanceElement ?? document.createElement('group');
        this.instanceElement.setAttribute('name', this.name);
        this.instanceElement.setAttribute('type', this.type);
        if (this.options.size > 0) {
            const options = this.instanceElement.getOrCreateChildByTag('plugins');
            options.setAttribute('order', this.sortingOrder);
            for (const option of this.options)
                options.appendChild(option.asModuleXML(document));
        }
        else
            this.instanceElement.removeChildByTag('plugins');
        return this.instanceElement;
    }
}
export class Option extends FOMODElementProxy {
    keysToUpdate = ['flagsToSet', 'files', 'typeDescriptor'];
    inherited;
    destroy_() {
        this.inherited.parent?.options.delete(this);
        super.destroy_();
    }
    _name = '';
    set name(value) { this._name = value; this.updateObjects(); }
    get name() { return this._name; }
    _description;
    set description(value) { this._description = value; this.updateObjects(); }
    get description() { return this._description; }
    _image;
    set image(value) { this._image = value; this.updateObjects(); }
    get image() { return this._image; }
    flagsToSet = new Set();
    flagsContainers = {};
    files = new Set();
    filesContainers = {};
    _typeDescriptor;
    set typeDescriptor(value) { this._typeDescriptor = value; this.updateObjects(); }
    get typeDescriptor() { return this._typeDescriptor; }
    constructor(inherited, instanceElement) {
        super(instanceElement);
        this.inherited = inherited;
        const typeDescriptor = this.instanceElement?.getElementsByTagName('typeDescriptor')[0];
        this.typeDescriptor = new OptionStateDescriptor(typeDescriptor);
        if (!this.instanceElement)
            return;
        this.name = this.instanceElement.getAttribute('name') || '';
        this.description = this.instanceElement.getElementsByTagName('description')[0]?.textContent || '';
        this.image = this.instanceElement.getElementsByTagName('image')[0]?.getAttribute('path') || '';
        const inheritedForFlags = {
            base: this.inherited.base,
            parent: this,
            containers: this.flagsContainers,
        };
        for (const flag of this.instanceElement.getElementsByTagName('flag') ?? [])
            this.flagsToSet.add(new DependencyFlag('flag', inheritedForFlags, flag));
        for (const file of this.instanceElement.getElementsByTagName('file') ?? []) { }
    }
    addFlag(xmlElement) {
        this.flagsToSet.add(new DependencyFlag('flag', {
            base: this.inherited.base,
            containers: this.flagsContainers,
            parent: this,
        }, xmlElement));
        this.updateWhole();
    }
    addFlag_bound = this.addFlag.bind(this, undefined);
    asModuleXML(document) {
        this.instanceElement =
            this.instanceElement ?? document.createElement('plugin');
        this.instanceElement.setAttribute('name', this.name);
        const description = this.instanceElement.getOrCreateChildByTag('description');
        description.textContent = this.description;
        this.instanceElement.appendChild(description);
        if (this.image) {
            const image = this.instanceElement.getOrCreateChildByTag('image');
            image.setAttribute('path', this.image);
            this.instanceElement.appendChild(image);
        }
        else
            this.instanceElement.removeChildByTag('image');
        if (this.flagsToSet.size > 0) {
            const flagsToSet = this.instanceElement.getOrCreateChildByTag('conditionFlags');
            for (const flag of this.flagsToSet)
                flagsToSet.appendChild(flag.asModuleXML(document));
            this.instanceElement.appendChild(flagsToSet);
        }
        else
            this.instanceElement.removeChildByTag('conditionFlags');
        if (this.files.size > 0) {
            const files = this.instanceElement.getOrCreateChildByTag('files');
            for (const file of this.files)
                files.appendChild(file.asModuleXML(document));
            this.instanceElement.appendChild(files);
        }
        else if (this.flagsToSet.size == 0) {
            const emptyFilesElem = this.instanceElement.getOrCreateChildByTag('files');
            this.instanceElement.appendChild(emptyFilesElem);
        }
        this.instanceElement.appendChild(this.typeDescriptor.asModuleXML(document));
        return this.instanceElement;
    }
}
export class Fomod extends FOMODElementProxy {
    keysToUpdate = ['installs', 'conditions', 'steps'];
    _metaName = '';
    set metaName(value) {
        this._metaName = value;
        if (window.FOMODBuilder.storage.settings.keepNamesSynced)
            this._moduleName = value;
        this.updateObjects();
    }
    get metaName() {
        return this._metaName || (window.FOMODBuilder.storage.settings.keepNamesSynced ? this._moduleName : '');
    }
    _moduleName = '';
    set moduleName(value) {
        this._moduleName = value;
        if (window.FOMODBuilder.storage.settings.keepNamesSynced)
            this._metaName = value;
        this.updateObjects();
    }
    get moduleName() {
        return this._moduleName || (window.FOMODBuilder.storage.settings.keepNamesSynced ? this._metaName : '');
    }
    _metaImage = '';
    set metaImage(value) { this._metaImage = value; this.updateObjects(); }
    get metaImage() { return this._metaImage; }
    _metaAuthor = '';
    set metaAuthor(value) { this._metaAuthor = value; this.updateObjects(); }
    get metaAuthor() { return this._metaAuthor; }
    _metaVersion = '';
    set metaVersion(value) { this._metaVersion = value; this.updateObjects(); }
    get metaVersion() { return this._metaVersion; }
    _metaId = null;
    set metaId(value) { this._metaId = value; this.updateObjects(); }
    get metaId() { return this._metaId; }
    _infoInstanceElement;
    set infoInstanceElement(value) { this._infoInstanceElement = value; this.updateObjects(); }
    get infoInstanceElement() { return this._infoInstanceElement; }
    _metaUrl = '';
    get metaUrl() { return this._metaUrl; }
    set metaUrl(url) {
        if (url instanceof URL)
            this._metaUrl = url;
        else {
            try {
                this._metaUrl = new URL(url);
            }
            catch (e) {
                this._metaUrl = url;
                this.updateObjects();
            }
        }
    }
    getURLAsString() {
        return this.metaUrl instanceof URL ?
            this.metaUrl.toString()
            : this.metaUrl;
    }
    installs;
    conditions;
    steps;
    sortingOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    stepContainers = {};
    addStep(xmlElement) {
        this.steps.add(new Step({
            base: this,
            containers: this.stepContainers,
            parent: this,
        }, xmlElement));
        this.updateObjects(true);
    }
    addStep_bound = this.addStep.bind(this);
    constructor(instanceElement, infoInstanceElement) {
        super(instanceElement);
        this.infoInstanceElement = infoInstanceElement;
        this.metaName = infoInstanceElement?.getElementsByTagName('Name')[0]?.textContent ?? '';
        this.moduleName = instanceElement?.getElementsByTagName('moduleName')[0]?.textContent ?? '';
        this.metaImage = instanceElement?.getElementsByTagName('moduleImage')[0]?.getAttribute('path') ?? '';
        this.metaAuthor = infoInstanceElement?.getElementsByTagName('Author')[0]?.textContent ?? '';
        this.metaVersion = infoInstanceElement?.getElementsByTagName('Version')[0]?.textContent ?? '';
        this.metaUrl = infoInstanceElement?.getElementsByTagName('Website')[0]?.textContent ?? '';
        const [, id] = infoInstanceElement?.getElementsByTagName('Id')[0]?.textContent?.match(/^\s*(\d+)\s*$/) ?? [];
        if (id)
            this.metaId = parseInt(id);
        else
            this.metaId = null;
        const stepsElem = instanceElement?.getElementsByTagName('installSteps')[0];
        this.sortingOrder = null || stepsElem?.getAttribute('order') || 'Explicit';
        this.steps = new Set();
        for (const step of (stepsElem?.children ?? []))
            this.addStep(step);
        if (this.steps.size == 0)
            this.addStep();
        const conditionalInstallsElem = instanceElement?.getElementsByTagName('conditionalFileInstalls')[0]?.getElementsByTagName('patterns')[0];
        const requiredInstallsElem = instanceElement?.getElementsByTagName('requiredInstallFiles')[0];
        this.installs = new Set([...parseFiles(conditionalInstallsElem), ...parseFiles(requiredInstallsElem)]);
        const moduleDependencies = instanceElement?.getElementsByTagName('moduleDependencies')[0];
        if (moduleDependencies)
            this.conditions = new DependencyGroup(moduleDependencies);
    }
    asModuleXML(document) {
        if (document.documentElement !== this.instanceElement) {
            document.removeChild(document.documentElement);
            this.instanceElement = document.getOrCreateChildByTag('config');
        }
        this.instanceElement.setAttribute('xmlns:xsi', 'https://www.w3.org/2001/XMLSchema-instance');
        this.instanceElement.setAttribute('xsi:noNamespaceSchemaLocation', 'https://qconsulting.ca/fo3/ModConfig5.0.xsd');
        const moduleName = this.instanceElement.getOrCreateChildByTag('moduleName');
        moduleName.textContent = this.metaName;
        this.instanceElement.appendChild(moduleName);
        if (this.metaImage) {
            const metaImage = this.instanceElement.getOrCreateChildByTag('moduleImage');
            metaImage.setAttribute('path', this.metaImage);
            this.instanceElement.appendChild(metaImage);
        }
        else
            this.instanceElement.removeChildByTag('moduleImage');
        if (this.conditions)
            this.instanceElement.appendChild(this.conditions.asModuleXML(document, 'moduleDependencies'));
        else
            this.instanceElement.removeChildByTag('moduleDependencies');
        const requiredInstallFiles = this.instanceElement.getOrCreateChildByTag('requiredInstallFiles');
        const optionalInstallList = [];
        if (requiredInstallFiles.children.length)
            this.instanceElement.appendChild(requiredInstallFiles);
        else
            this.instanceElement.removeChildByTag('requiredInstallFiles');
        if (this.steps.size > 0) {
            const stepsContainer = this.instanceElement.getOrCreateChildByTag('installSteps');
            stepsContainer.setAttribute('order', this.sortingOrder);
            for (const step of this.steps)
                stepsContainer.appendChild(step.asModuleXML(document));
            this.instanceElement.appendChild(stepsContainer);
        }
        else
            this.instanceElement.removeChildByTag('installSteps');
        if (optionalInstallList.length) {
            const conditionalFileInstalls = this.instanceElement.getOrCreateChildByTag('conditionalFileInstalls');
            for (const install of optionalInstallList)
                conditionalFileInstalls.appendChild(install);
            this.instanceElement.appendChild(conditionalFileInstalls);
        }
        else
            this.instanceElement.removeChildByTag('conditionalFileInstalls');
        return this.instanceElement;
    }
    asInfoXML(document) {
        if (document.documentElement !== this.infoInstanceElement) {
            document.removeChild(document.documentElement);
            this.infoInstanceElement = document.getOrCreateChildByTag('fomod');
        }
        this.infoInstanceElement.setAttribute('xmlns:xsi', 'https://www.w3.org/2001/XMLSchema-instance');
        if (window.FOMODBuilder.storage.settings.includeInfoSchema)
            this.infoInstanceElement.setAttribute('xsi:noNamespaceSchemaLocation', 'https://testing.bellcube.dev/assets/site/misc/Info.xsd');
        else if (this.infoInstanceElement.getAttribute('xsi:noNamespaceSchemaLocation') === 'https://testing.bellcube.dev/assets/site/misc/Info.xsd')
            this.infoInstanceElement.removeAttribute('xsi:noNamespaceSchemaLocation');
        const url = this.getURLAsString();
        if (this.metaName)
            this.infoInstanceElement.getOrCreateChildByTag('Name').textContent = this.metaName;
        else
            this.infoInstanceElement.removeChildByTag('Name');
        if (this.metaAuthor)
            this.infoInstanceElement.getOrCreateChildByTag('Author').textContent = this.metaAuthor;
        else
            this.infoInstanceElement.removeChildByTag('Author');
        if (this.metaId !== null)
            this.infoInstanceElement.getOrCreateChildByTag('Id').textContent = this.metaId.toString();
        else
            this.infoInstanceElement.removeChildByTag('Id');
        if (url)
            this.infoInstanceElement.getOrCreateChildByTag('Website').textContent = url;
        else
            this.infoInstanceElement.removeChildByTag('Website');
        if (this.metaVersion)
            this.infoInstanceElement.getOrCreateChildByTag('Version').textContent = this.metaVersion;
        else
            this.infoInstanceElement.removeChildByTag('Version');
        return this.infoInstanceElement;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9tb2QtYnVpbGRlci1jbGFzc2lmaWNhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsidG9vbHMvZm9tb2QvZm9tb2QtYnVpbGRlci1jbGFzc2lmaWNhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFeEUsT0FBTyxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUs1QyxTQUFTLGtCQUFrQixDQUFDLEdBQVcsRUFBRSxLQUFVO0lBRS9DLElBQUksR0FBRyxLQUFLLFdBQVc7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUMxQyxJQUFJLEdBQUcsS0FBSyxpQkFBaUI7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNoRCxJQUFJLEdBQUcsS0FBSyxpQkFBaUI7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNoRCxJQUFJLEdBQUcsS0FBSyxpQkFBaUI7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNoRCxJQUFJLEdBQUcsS0FBSyxlQUFlO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFHOUMsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFHbEQsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBRzFDLElBQUksS0FBSyxZQUFZLEdBQUc7UUFBRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsSUFBSSxLQUFLLFlBQVksR0FBRztRQUFFLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUVyRSxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FB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QVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOztZQUN6RixJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQU0sU0FBUyxDQUFDLENBQUM7UUFFdEYsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFDcEMsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbWFpbiBmcm9tICcuL2ZvbW9kLWJ1aWxkZXIuanMnOyAvLyBCcmluZ3MgaW4gZ2xvYmFsIHRoaW5nc1xuaW1wb3J0IHsgVXBkYXRhYmxlT2JqZWN0LCBnZXRTZXRJbmRleCwgd2FpdCB9IGZyb20gJy4uLy4uL3VuaXZlcnNhbC5qcyc7XG5cbmltcG9ydCAqIGFzIHVpIGZyb20gJy4vZm9tb2QtYnVpbGRlci11aS5qcyc7XG5cbi8qeCBlc2xpbnQtZGlzYWJsZSBpMThuLXRleHQvbm8tZW4gKi8vLyBGT01PRHMgYXJlIFhNTCBmaWxlcyB3aXRoIGEgc2NoZW1hIHdyaXR0ZW4gaW4gRW5nbGlzaCwgc28gZGlzYWxsb3dpbmcgRW5nbGlzaCBtYWtlcyBsaXR0bGUgc2Vuc2UuXG5cbi8qKiBGdW5jdGlvbiB0byBwYXNzIGludG8gSlNPTi5zdHJpbmdpZnkgdG8gaGFuZGxlIEZPTU9EcyAqL1xuZnVuY3Rpb24gSnNvblN0cmluZ2lmeUZvbW9kKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgLy8gQmxhY2tsaXN0ZWQgS2V5cyAoZ2VuZXJhdGVkIGF0IHJ1bnRpbWUgb3Igd291bGQgY2F1c2UgcmVjdXJzaW9uKVxuICAgIGlmIChrZXkgPT09ICdpbmhlcml0ZWQnKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT09ICdpbnN0YW5jZUVsZW1lbnQnKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT09ICdvYmplY3RzVG9VcGRhdGUnKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT09ICdzdXBwcmVzc1VwZGF0ZXMnKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT09ICd1cGRhdGVPYmplY3RzJykgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIC8vIEJsYWNrbGlzdGVkIFZhbHVlIFR5cGVzXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIC8vIEludGVybmFsIGtleXMgKHN0YXJ0IHdpdGggXylcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ18nKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIC8vIE1hcCAmIFNldCBzdXBwb3J0XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZSk7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKHZhbHVlLmVudHJpZXMoKSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qXG4gICAgVGhhbmtzIHRvIFBhdHJpY2sgR2lsbGVzcGllIGZvciB0aGUgZ3JlYXQgQVNDSUkgYXJ0IGdlbmVyYXRvciFcbiAgICBodHRwczovL3BhdG9yamsuY29tL3NvZnR3YXJlL3RhYWcvI3A9ZGlzcGxheSZoPTAmdj0wJmY9QmlnJTIwTW9uZXktbndcbiAgICAuLi5tYWtlcyB0aGlzIGNvZGUgKnNvKiBtdWNoIGVhc2llciB0byBtYWludGFpbi4uLiB5b3Uga25vdywgJ2N1eiBJIGNhbiBmaW5kIG15IGZ1bmN0aW9ucyBpbiBWU0NvZGUncyBNaW5pbWFwXG4qL1xuXG4vKioqXG4gKiAgICAkJCQkJCQkJFxcICQkXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkXFxcbiAqICAgICQkICBfX19fX3wkJCB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICQkIHwgICAgICAkJCB8ICQkJCQkJFxcICAkJCQkJCRcXCQkJCRcXCAgICQkJCQkJFxcICAkJCQkJCQkXFwgICQkJCQkJFxcICAgICQkJCQkJCRcXFxuICogICAgJCQkJCRcXCAgICAkJCB8JCQgIF9fJCRcXCAkJCAgXyQkICBfJCRcXCAkJCAgX18kJFxcICQkICBfXyQkXFwgXFxfJCQgIF98ICAkJCAgX19fX198XG4gKiAgICAkJCAgX198ICAgJCQgfCQkJCQkJCQkIHwkJCAvICQkIC8gJCQgfCQkJCQkJCQkIHwkJCB8ICAkJCB8ICAkJCB8ICAgIFxcJCQkJCQkXFxcbiAqICAgICQkIHwgICAgICAkJCB8JCQgICBfX19ffCQkIHwgJCQgfCAkJCB8JCQgICBfX19ffCQkIHwgICQkIHwgICQkIHwkJFxcICBcXF9fX18kJFxcXG4gKiAgICAkJCQkJCQkJFxcICQkIHxcXCQkJCQkJCRcXCAkJCB8ICQkIHwgJCQgfFxcJCQkJCQkJFxcICQkIHwgICQkIHwgIFxcJCQkJCAgfCQkJCQkJCQgIHxcbiAqICAgIFxcX19fX19fX198XFxfX3wgXFxfX19fX19ffFxcX198IFxcX198IFxcX198IFxcX19fX19fX3xcXF9ffCAgXFxfX3wgICBcXF9fX18vIFxcX19fX19fXy9cbiAqL1xuXG4vKiogQSBtYXAgb2YgRk9NT0RFbGVtZW50UHJveHkgY2xhc3NlcyBhbmQgdGhlIGNsYXNzZXMgdGhleSBzaG91bGQgY3JlYXRlIGFsb25nc2lkZSB0aGVtc2VsdmVzIGZvciB1cGRhdGUgcHVycG9zZXMgKi9cbmV4cG9ydCBjb25zdCBVcGRhdGVPYmplY3RzID0gbmV3IE1hcDxGT01PREVsZW1lbnRQcm94eXxGdW5jdGlvbiwgKHtuZXcocGFyYW06IGFueSk6IFVwZGF0YWJsZU9iamVjdH0gJiBPbWl0PHR5cGVvZiBVcGRhdGFibGVPYmplY3QsICduZXcnPilbXT4oKTtcbmV4cG9ydCBmdW5jdGlvbiBhZGRVcGRhdGVPYmplY3RzPFRDbGFzcyBleHRlbmRzIE9taXQ8dHlwZW9mIEZPTU9ERWxlbWVudFByb3h5LCAnbmV3Jz4gJiB7bmV3KC4uLmFueTphbnkpOmFueX0+KG9iajogVENsYXNzLCAuLi51cGRhdGFibGVzOiAoe25ldyhwYXJhbTogSW5zdGFuY2VUeXBlPFRDbGFzcz4pOiBVcGRhdGFibGVPYmplY3R9ICYgT21pdDx0eXBlb2YgVXBkYXRhYmxlT2JqZWN0LCAnbmV3Jz4pW10pIHtcbiAgICBVcGRhdGVPYmplY3RzLmdldChvYmopPy5wdXNoKC4uLnVwZGF0YWJsZXMpIHx8XG4gICAgVXBkYXRlT2JqZWN0cy5zZXQob2JqLCB1cGRhdGFibGVzKTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZPTU9ERWxlbWVudFByb3h5IGV4dGVuZHMgVXBkYXRhYmxlT2JqZWN0IHtcbiAgICBpbnN0YW5jZUVsZW1lbnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICAvKiogQHR5cGUgcmVhZG9ubHkgKGtleW9mIHRoaXMpW10gKi9cbiAgICBhYnN0cmFjdCBrZXlzVG9VcGRhdGU6IHJlYWRvbmx5IHN0cmluZ1tdO1xuXG4gICAgb2JqZWN0c1RvVXBkYXRlOiBVcGRhdGFibGVPYmplY3RbXSA9IFtdO1xuXG4gICAgcHJvcGFnYXRlVG9DaGlsZHJlbl93YXNUcnVlID0gZmFsc2U7XG4gICAgdXBkYXRlT2JqZWN0cyhwcm9wYWdhdGVUb0NoaWxkcmVuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCF0aGlzKSByZXR1cm47IC8vIGZ1bmN0aW9uIHNvbWV0aW1lcyBnZXRzIGNhbGxlZCBpbiB0aGUgY29uc3RydWN0b3IgLSB1cGRhdGUgd2lsbCBiZSBjYWxsZWQgaW4gYSBtaWNyb3Rhc2sgbGF0ZXIuXG5cbiAgICAgICAgdGhpcy5wcm9wYWdhdGVUb0NoaWxkcmVuX3dhc1RydWUgfHw9IHByb3BhZ2F0ZVRvQ2hpbGRyZW47XG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpPT4gIHRoaXMucHJvcGFnYXRlVG9DaGlsZHJlbl93YXNUcnVlID0gZmFsc2UgICk7XG5cbiAgICAgICAgLy8gSWYgcHJvcGFnYXRlVG9DaGlsZHJlbiBpcyB0cnVlLFxuICAgICAgICAvLyB3ZSBrbm93IHRoYXQgaXQgZGlkbid0IGNvbWUgZnJvbSBhbiBhY3R1YWwgdXBkYXRlLS1zbyBsZXQncyBnbyB0aHJvdWdoIHRoZSB1cGRhdGUgQVBJIHRoaXMgdGltZVxuICAgICAgICAvLyBEb24ndCB3b3JyeSAtIHdoZW4gdGhlIHVwZGF0ZSBnb2VzIHRocm91Z2gsIGl0J2xsIGp1c3QgY2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluLCBidXQgdGhpcyB0aW1lIGl0J2xsIGJlIGZhbHNlXG4gICAgICAgIGlmIChwcm9wYWdhdGVUb0NoaWxkcmVuKSByZXR1cm4gdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiB0aGlzLm9iamVjdHNUb1VwZGF0ZSkge1xuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEZPTU9ERWxlbWVudFByb3h5KSBvYmplY3QudXBkYXRlT2JqZWN0cyh0cnVlKTtcbiAgICAgICAgICAgIGVsc2Ugb2JqZWN0LnVwZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcGFnYXRlVG9DaGlsZHJlbl93YXNUcnVlKSBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmtleXNUb1VwZGF0ZSkge1xuICAgICAgICAgICAgaWYgKCAgIShrZXkgaW4gdGhpcykgICkgcmV0dXJuIGNvbnNvbGUuZXJyb3IoYEtleSAke2tleX0gbm90IGZvdW5kIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWAsIHRoaXMpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gdGhpc1trZXkgYXMga2V5b2YgdGhpc107XG5cbiAgICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBVcGRhdGFibGVPYmplY3QpIG9iai51cGRhdGUoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFNldCB8fCBvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbmVzdGVkT2JqZWN0IG9mIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmVzdGVkT2JqZWN0IGluc3RhbmNlb2YgRk9NT0RFbGVtZW50UHJveHkpIG5lc3RlZE9iamVjdC51cGRhdGVPYmplY3RzKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChuZXN0ZWRPYmplY3QgaW5zdGFuY2VvZiBVcGRhdGFibGVPYmplY3QpIG5lc3RlZE9iamVjdC51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1aS5hdXRvU2F2ZSgpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHVwZGF0ZV8oKSB7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9XG5cbiAgICBvdmVycmlkZSBkZXN0cm95KCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50Py5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVXaG9sZSgpIHtcbiAgICAgICAgaWYgKCAgISgnaW5oZXJpdGVkJyBpbiB0aGlzICYmIHRoaXMuaW5oZXJpdGVkICYmIHR5cGVvZiB0aGlzLmluaGVyaXRlZCA9PT0gJ29iamVjdCcpICApIHJldHVybiB0aGlzLnVwZGF0ZU9iamVjdHModHJ1ZSk7XG5cbiAgICAgICAgaWYgKCdiYXNlJyBpbiB0aGlzLmluaGVyaXRlZCAmJiB0aGlzLmluaGVyaXRlZC5iYXNlICYmIHRoaXMuaW5oZXJpdGVkLmJhc2UgaW5zdGFuY2VvZiBGT01PREVsZW1lbnRQcm94eSkgdGhpcy5pbmhlcml0ZWQuYmFzZS51cGRhdGVPYmplY3RzKHRydWUpO1xuICAgICAgICBlbHNlIGlmICgncGFyZW50JyBpbiB0aGlzLmluaGVyaXRlZCAmJiB0aGlzLmluaGVyaXRlZC5wYXJlbnQgJiYgdGhpcy5pbmhlcml0ZWQucGFyZW50IGluc3RhbmNlb2YgRk9NT0RFbGVtZW50UHJveHkpIHRoaXMuaW5oZXJpdGVkLnBhcmVudC51cGRhdGVPYmplY3RzKHRydWUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlT2JqZWN0cyh0cnVlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZGVzdHJveV8oKTogdm9pZCB7XG4gICAgICAgIHRoaXMub2JqZWN0c1RvVXBkYXRlLmZvckVhY2goICAob2JqKSA9PiBvYmouZGVzdHJveSgpICApO1xuICAgICAgICBpZiAoJ3N0ZXBzJyBpbiB0aGlzICYmIHRoaXMuc3RlcHMgaW5zdGFuY2VvZiBTZXQpIHRoaXMuc3RlcHMuZm9yRWFjaCggIChzdGVwKSA9PiBzdGVwLmRlc3Ryb3koKSAgKTtcbiAgICAgICAgaWYgKCdncm91cHMnIGluIHRoaXMgJiYgdGhpcy5ncm91cHMgaW5zdGFuY2VvZiBTZXQpIHRoaXMuZ3JvdXBzLmZvckVhY2goICAoZ3JvdXApID0+IGdyb3VwLmRlc3Ryb3koKSAgKTtcbiAgICAgICAgaWYgKCdvcHRpb25zJyBpbiB0aGlzICYmIHRoaXMub3B0aW9ucyBpbnN0YW5jZW9mIFNldCkgdGhpcy5vcHRpb25zLmZvckVhY2goICAob3B0aW9uKSA9PiBvcHRpb24uZGVzdHJveSgpICApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlV2hvbGUoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihpbnN0YW5jZUVsZW1lbnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdXBwcmVzc1VwZGF0ZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudCA9IGluc3RhbmNlRWxlbWVudDtcblxuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVwZGF0YWJsZSBvZiBVcGRhdGVPYmplY3RzLmdldCh0aGlzLmNvbnN0cnVjdG9yKSA/PyBbXSkgdGhpcy5vYmplY3RzVG9VcGRhdGUucHVzaChuZXcgdXBkYXRhYmxlKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuc3VwcHJlc3NVcGRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU9iamVjdHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXNNb2R1bGVYTUw/KGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQ7XG4gICAgYXNJbmZvWE1MPyhkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50O1xufVxuXG5pbnRlcmZhY2UgSW5oZXJpdGVkRk9NT0REYXRhPFRUeXBlIGV4dGVuZHMgU3RlcHxHcm91cHxPcHRpb258RGVwZW5kZW5jeUJhc2U+IHtcbiAgICBiYXNlPzogRm9tb2QsXG4gICAgcGFyZW50PzogVFR5cGUgZXh0ZW5kcyBTdGVwID8gRm9tb2RcbiAgICAgICAgOiBUVHlwZSBleHRlbmRzIEdyb3VwID8gU3RlcFxuICAgICAgICA6IFRUeXBlIGV4dGVuZHMgT3B0aW9uID8gR3JvdXBcbiAgICAgICAgLyogVFQgZXh0ZW5kcyBEZXBlbmRlbmN5ICovIDogT3B0aW9uLFxuICAgIGNvbnRhaW5lcnM/OiBSZWNvcmQ8c3RyaW5nLCBIVE1MRGl2RWxlbWVudD4sXG59XG5cbi8qKipcbiAqICAgICQkJCQkJCQkXFwgJCRcXFxuICogICAgJCQgIF9fX19ffCQkIHxcbiAqICAgICQkIHwgICAgICAkJCB8ICQkJCQkJFxcICAgJCQkJCQkXFwgICAkJCQkJCQkXFxcbiAqICAgICQkJCQkXFwgICAgJCQgfCBcXF9fX18kJFxcICQkICBfXyQkXFwgJCQgIF9fX19ffFxuICogICAgJCQgIF9ffCAgICQkIHwgJCQkJCQkJCB8JCQgLyAgJCQgfFxcJCQkJCQkXFxcbiAqICAgICQkIHwgICAgICAkJCB8JCQgIF9fJCQgfCQkIHwgICQkIHwgXFxfX19fJCRcXFxuICogICAgJCQgfCAgICAgICQkIHxcXCQkJCQkJCQgfFxcJCQkJCQkJCB8JCQkJCQkJCAgfFxuICogICAgXFxfX3wgICAgICBcXF9ffCBcXF9fX19fX198IFxcX19fXyQkIHxcXF9fX19fX18vXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgXFwkJCQkJCQgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXF9fX19fXy9cbiAqL1xuXG5kZWNsYXJlIGdsb2JhbCB7IGludGVyZmFjZSBXaW5kb3cgeyAgZmxhZ3M6IFJlY29yZDxzdHJpbmcsIEZsYWc+OyAgZmxhZ0NsYXNzOiB0eXBlb2YgRmxhZzsgIH0gfVxud2luZG93LmZsYWdzID0ge307XG5cbmV4cG9ydCBjbGFzcyBGbGFnIHtcbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICBnZXR0ZXJzOiBTZXQ8RGVwZW5kZW5jeUZsYWc+O1xuICAgIGdldHRlcnNCeVZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBTZXQ8RGVwZW5kZW5jeUZsYWc+PjtcblxuICAgIHNldHRlcnM6IFNldDxEZXBlbmRlbmN5RmxhZz47XG4gICAgc2V0dGVyc0J5VmFsdWU6IFJlY29yZDxzdHJpbmcsIFNldDxEZXBlbmRlbmN5RmxhZz4+O1xuXG4gICAgcHJpdmF0ZSBjYWNoZWRWYWx1ZXM6IE1hcDxEZXBlbmRlbmN5RmxhZywgc3RyaW5nPjtcbiAgICBwcml2YXRlIHN0YXRpYyBjYWNoZWROYW1lczogTWFwPERlcGVuZGVuY3lGbGFnLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gICAgc3RhdGljIGdldChuYW1lOiBzdHJpbmcpOiBGbGFnIHsgcmV0dXJuIHdpbmRvdy5mbGFnc1tuYW1lXSA/PyBuZXcgRmxhZyhuYW1lKTsgfVxuICAgIGNoZWNrVmFsaWRpdHkoKSB7IGlmICh0aGlzLnNldHRlcnMuc2l6ZSA9PT0gMCAmJiB0aGlzLmdldHRlcnMuc2l6ZSA9PT0gMCkgZGVsZXRlIHdpbmRvdy5mbGFnc1t0aGlzLm5hbWVdOyB9XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAod2luZG93LmZsYWdzW25hbWVdKSB0aHJvdyBuZXcgRXJyb3IoYEZsYWcgJHtuYW1lfSBhbHJlYWR5IGV4aXN0cyFgKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgd2luZG93LmZsYWdzW25hbWVdID0gdGhpcztcblxuICAgICAgICB0aGlzLmdldHRlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuc2V0dGVycyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5nZXR0ZXJzQnlWYWx1ZSA9IHt9O1xuICAgICAgICB0aGlzLnNldHRlcnNCeVZhbHVlID0ge307XG4gICAgICAgIHRoaXMuY2FjaGVkVmFsdWVzID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIHF1ZXVlTWljcm90YXNrKHRoaXMuY2hlY2tWYWxpZGl0eS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFNldDxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICAgIGZvciAoY29uc3QgZ2V0dGVyIG9mIHRoaXMuZ2V0dGVycykgdmFsdWVzLmFkZChnZXR0ZXIudmFsdWUpO1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cblxuICAgIHVwZGF0ZVNldHRlcihzZXR0ZXI6IERlcGVuZGVuY3lGbGFnKSB7XG4gICAgICAgIGlmIChzZXR0ZXIuZmxhZyAhPT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRlcnMuZGVsZXRlKHNldHRlcik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5jYWNoZWRWYWx1ZXMuZ2V0KHNldHRlcik7XG4gICAgICAgICAgICBpZiAob2xkVmFsdWUpIHRoaXMuc2V0dGVyc0J5VmFsdWVbb2xkVmFsdWVdPy5kZWxldGUoc2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkVmFsdWVzLmRlbGV0ZShzZXR0ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrVmFsaWRpdHkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLmNhY2hlZFZhbHVlcy5nZXQoc2V0dGVyKTtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSBzZXR0ZXIudmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNldHRlcnNCeVZhbHVlW29sZFZhbHVlXSkgdGhpcy5zZXR0ZXJzQnlWYWx1ZVtvbGRWYWx1ZV0gPSBuZXcgU2V0KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldHRlcnNCeVZhbHVlW29sZFZhbHVlXSEuZGVsZXRlKHNldHRlcik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGVyc0J5VmFsdWVbb2xkVmFsdWVdIS5zaXplID09PSAwKSBkZWxldGUgdGhpcy5zZXR0ZXJzQnlWYWx1ZVtvbGRWYWx1ZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5zZXR0ZXJzQnlWYWx1ZVtzZXR0ZXIudmFsdWVdKSB0aGlzLnNldHRlcnNCeVZhbHVlW3NldHRlci52YWx1ZV0gPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB0aGlzLnNldHRlcnNCeVZhbHVlW3NldHRlci52YWx1ZV0hLmFkZChzZXR0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZWRWYWx1ZXMuc2V0KHNldHRlciwgc2V0dGVyLnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXR0ZXJzLmFkZChzZXR0ZXIpO1xuICAgIH1cblxuICAgIHVwZGF0ZUdldHRlcihnZXR0ZXI6IERlcGVuZGVuY3lGbGFnKSB7XG4gICAgICAgIGlmIChnZXR0ZXIuZmxhZyAhPT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmdldHRlcnMuZGVsZXRlKGdldHRlcik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5jYWNoZWRWYWx1ZXMuZ2V0KGdldHRlcik7XG4gICAgICAgICAgICBpZiAob2xkVmFsdWUpIHRoaXMuZ2V0dGVyc0J5VmFsdWVbb2xkVmFsdWVdPy5kZWxldGUoZ2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkVmFsdWVzLmRlbGV0ZShnZXR0ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrVmFsaWRpdHkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5jYWNoZWRWYWx1ZXMuZ2V0KGdldHRlcik7XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gZ2V0dGVyLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5nZXR0ZXJzQnlWYWx1ZVtvbGRWYWx1ZV0pIHRoaXMuZ2V0dGVyc0J5VmFsdWVbb2xkVmFsdWVdID0gbmV3IFNldCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nZXR0ZXJzQnlWYWx1ZVtvbGRWYWx1ZV0hLmRlbGV0ZShnZXR0ZXIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldHRlcnNCeVZhbHVlW29sZFZhbHVlXSEuc2l6ZSA9PT0gMCkgZGVsZXRlIHRoaXMuZ2V0dGVyc0J5VmFsdWVbb2xkVmFsdWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2V0dGVyc0J5VmFsdWVbZ2V0dGVyLnZhbHVlXSkgdGhpcy5nZXR0ZXJzQnlWYWx1ZVtnZXR0ZXIudmFsdWVdID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5nZXR0ZXJzQnlWYWx1ZVtnZXR0ZXIudmFsdWVdIS5hZGQoZ2V0dGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FjaGVkVmFsdWVzLnNldChnZXR0ZXIsIGdldHRlci52YWx1ZSk7XG4gICAgICAgIHRoaXMuZ2V0dGVycy5hZGQoZ2V0dGVyKTtcbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGl0ZW06IERlcGVuZGVuY3lGbGFnKSB7XG4gICAgICAgIHRoaXMuc2V0dGVycy5kZWxldGUoaXRlbSk7XG4gICAgICAgIHRoaXMuZ2V0dGVycy5kZWxldGUoaXRlbSk7XG5cbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLmNhY2hlZFZhbHVlcy5nZXQoaXRlbSk7XG4gICAgICAgIGlmIChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXR0ZXJzQnlWYWx1ZVtvbGRWYWx1ZV0/LmRlbGV0ZShpdGVtKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVyc0J5VmFsdWVbb2xkVmFsdWVdPy5kZWxldGUoaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhY2hlZFZhbHVlcy5kZWxldGUoaXRlbSk7XG5cbiAgICAgICAgdGhpcy5jaGVja1ZhbGlkaXR5KCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZUl0ZW0oaXRlbTogRGVwZW5kZW5jeUZsYWcpIHtcbiAgICAgICAgY29uc3Qgb2xkTmFtZSA9IEZsYWcuY2FjaGVkTmFtZXMuZ2V0KGl0ZW0pO1xuICAgICAgICBpZiAob2xkTmFtZSAhPT0gdW5kZWZpbmVkKSBGbGFnLmdldChvbGROYW1lKS5yZW1vdmVJdGVtKGl0ZW0pO1xuICAgICAgICBGbGFnLmNhY2hlZE5hbWVzLmRlbGV0ZShpdGVtKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgdXBkYXRlU2V0dGVyKHNldHRlcjogRGVwZW5kZW5jeUZsYWcpIHtcbiAgICAgICAgY29uc3Qgb2xkTmFtZSA9IEZsYWcuY2FjaGVkTmFtZXMuZ2V0KHNldHRlcik7XG4gICAgICAgIGlmIChvbGROYW1lICE9PSBzZXR0ZXIuZmxhZykge1xuICAgICAgICAgICAgaWYgKG9sZE5hbWUgIT09IHVuZGVmaW5lZCkgRmxhZy5nZXQob2xkTmFtZSkudXBkYXRlU2V0dGVyKHNldHRlcik7XG4gICAgICAgICAgICBGbGFnLmNhY2hlZE5hbWVzLnNldChzZXR0ZXIsIHNldHRlci5mbGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEZsYWcuZ2V0KHNldHRlci5mbGFnKS51cGRhdGVTZXR0ZXIoc2V0dGVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgdXBkYXRlR2V0dGVyKGdldHRlcjogRGVwZW5kZW5jeUZsYWcpIHtcbiAgICAgICAgY29uc3Qgb2xkTmFtZSA9IEZsYWcuY2FjaGVkTmFtZXMuZ2V0KGdldHRlcik7XG4gICAgICAgIGlmIChvbGROYW1lICE9PSBnZXR0ZXIuZmxhZykge1xuICAgICAgICAgICAgaWYgKG9sZE5hbWUgIT09IHVuZGVmaW5lZCkgRmxhZy5nZXQob2xkTmFtZSkudXBkYXRlR2V0dGVyKGdldHRlcik7XG4gICAgICAgICAgICBGbGFnLmNhY2hlZE5hbWVzLnNldChnZXR0ZXIsIGdldHRlci5mbGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEZsYWcuZ2V0KGdldHRlci5mbGFnKS51cGRhdGVHZXR0ZXIoZ2V0dGVyKTtcbiAgICB9XG5cbn1cbndpbmRvdy5mbGFnQ2xhc3MgPSBGbGFnO1xuXG5cbi8qKipcbiAqICAgICAkJCQkJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAkJFxcICQkXFwgICAkJFxcICAgICAkJFxcXG4gKiAgICAkJCAgX18kJFxcICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxcX198ICAkJCB8ICAgIFxcX198XG4gKiAgICAkJCAvICBcXF9ffCAkJCQkJCRcXCAgJCQkJCQkJFxcICAgJCQkJCQkJCB8JCRcXCAkJCQkJCRcXCAgICQkXFwgICQkJCQkJFxcICAkJCQkJCQkXFwgICAkJCQkJCQkXFxcbiAqICAgICQkIHwgICAgICAkJCAgX18kJFxcICQkICBfXyQkXFwgJCQgIF9fJCQgfCQkIHxcXF8kJCAgX3wgICQkIHwkJCAgX18kJFxcICQkICBfXyQkXFwgJCQgIF9fX19ffFxuICogICAgJCQgfCAgICAgICQkIC8gICQkIHwkJCB8ICAkJCB8JCQgLyAgJCQgfCQkIHwgICQkIHwgICAgJCQgfCQkIC8gICQkIHwkJCB8ICAkJCB8XFwkJCQkJCRcXFxuICogICAgJCQgfCAgJCRcXCAkJCB8ICAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8JCRcXCAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwgXFxfX19fJCRcXFxuICogICAgXFwkJCQkJCQgIHxcXCQkJCQkJCAgfCQkIHwgICQkIHxcXCQkJCQkJCQgfCQkIHwgIFxcJCQkJCAgfCQkIHxcXCQkJCQkJCAgfCQkIHwgICQkIHwkJCQkJCQkICB8XG4gKiAgICAgXFxfX19fX18vICBcXF9fX19fXy8gXFxfX3wgIFxcX198IFxcX19fX19fX3xcXF9ffCAgIFxcX19fXy8gXFxfX3wgXFxfX19fX18vIFxcX198ICBcXF9ffFxcX19fX19fXy9cbiAqL1xuXG5leHBvcnQgdHlwZSBEZXBlbmRlbmN5ID0gRGVwZW5kZW5jeUJhc2UgfCBPcHRpb247XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEZXBlbmRlbmN5QmFzZSBleHRlbmRzIEZPTU9ERWxlbWVudFByb3h5IHtcbiAgICBrZXlzVG9VcGRhdGUgPSBbXTtcbiAgICBjb25zdHJ1Y3RvcihpbnN0YW5jZUVsZW1lbnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoaW5zdGFuY2VFbGVtZW50KTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50O1xufVxuXG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERlcGVuZGVuY3lCYXNlVmVyc2lvbkNoZWNrIGV4dGVuZHMgRGVwZW5kZW5jeUJhc2Uge1xuICAgIHByaXZhdGUgX3ZlcnNpb24gPSAnJztcbiAgICBzZXQgdmVyc2lvbih2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX3ZlcnNpb24gPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IHZlcnNpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3ZlcnNpb247IH1cbn1cblxuZXhwb3J0IHR5cGUgRGVwZW5kZW5jeUdyb3VwT3BlcmF0b3IgPSAnQW5kJyB8ICdPcic7XG5leHBvcnQgY2xhc3MgRGVwZW5kZW5jeUdyb3VwIGV4dGVuZHMgRGVwZW5kZW5jeUJhc2Uge1xuICAgIHByaXZhdGUgX29wZXJhdG9yOiBEZXBlbmRlbmN5R3JvdXBPcGVyYXRvciA9ICdBbmQnO1xuICAgIHNldCBvcGVyYXRvcih2YWx1ZTogRGVwZW5kZW5jeUdyb3VwT3BlcmF0b3IpIHsgdGhpcy5fb3BlcmF0b3IgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IG9wZXJhdG9yKCk6IERlcGVuZGVuY3lHcm91cE9wZXJhdG9yIHsgcmV0dXJuIHRoaXMuX29wZXJhdG9yOyB9XG5cbiAgICBwcml2YXRlIF9jaGlsZHJlbjogRGVwZW5kZW5jeVtdID0gW107XG4gICAgc2V0IGNoaWxkcmVuKHZhbHVlOiBEZXBlbmRlbmN5W10pIHsgdGhpcy5fY2hpbGRyZW4gPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IGNoaWxkcmVuKCk6IERlcGVuZGVuY3lbXSB7IHJldHVybiB0aGlzLl9jaGlsZHJlbjsgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGluc3RhbmNlRWxlbWVudDogRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbiAgICAgICAgb3BlcmF0b3I6IERlcGVuZGVuY3lHcm91cE9wZXJhdG9yID0gJ0FuZCcsXG4gICAgICAgIHBhcnNlQ2hpbGRyZW4gPSBmYWxzZVxuICAgICkge1xuICAgICAgICBzdXBlcihpbnN0YW5jZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIGlmIChpbnN0YW5jZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdG9yID1cbiAgICAgICAgICAgICAgICAoaW5zdGFuY2VFbGVtZW50LmdldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICAgICAgJ29wZXJhdG9yJ1xuICAgICAgICAgICAgICAgICkgYXMgRGVwZW5kZW5jeUdyb3VwT3BlcmF0b3IpIHx8IG9wZXJhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnNlQ2hpbGRyZW4pIHRoaXMucGFyc2VEZXBlbmRlbmNpZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHBhcnNlRGVwZW5kZW5jaWVzKCl7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZUVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuaW5zdGFuY2VFbGVtZW50LmNoaWxkcmVuKVxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGF3YWl0IHBhcnNlRGVwZW5kZW5jeShjaGlsZCkpO1xuXG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHRoaXMudXBkYXRlKCkpO1xuICAgIH1cblxuICAgIC8vIDxtb2R1bGVEZXBlbmRlbmNpZXMgb3BlcmF0b3I9XCJBbmRcIj5cbiAgICBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQsIG5vZGVOYW1lID0gJ2RlcGVuZGVuY2llcycpOiBFbGVtZW50IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPz89IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlRWxlbWVudCAmJiB0aGlzLmluc3RhbmNlRWxlbWVudC50YWdOYW1lICE9PSBub2RlTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmluc3RhbmNlRWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQuaW5zdGFuY2VFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnb3BlcmF0b3InLCB0aGlzLm9wZXJhdG9yKTtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIERlcGVuZGVuY3lGaWxlU3RhdGUgPSAnQWN0aXZlJyB8ICdJbmFjdGl2ZScgfCAnTWlzc2luZyc7XG5leHBvcnQgdHlwZSBEZXBlbmRlbmN5RmxhZ1RhZ3MgPSAnZmxhZycgfCAnZmxhZ0RlcGVuZGVuY3knO1xuZXhwb3J0IGNsYXNzIERlcGVuZGVuY3lGbGFnIGV4dGVuZHMgRGVwZW5kZW5jeUJhc2Uge1xuICAgIHByaXZhdGUgX2ZsYWcgPSAnJztcbiAgICBzZXQgZmxhZyh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2ZsYWcgPSB2YWx1ZTsgdGhpcy51cGRhdGUoKTsgfSBnZXQgZmxhZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmxhZzsgfVxuXG4gICAgcHJpdmF0ZSBfdmFsdWUgPSAnJztcbiAgICBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykgeyB0aGlzLl92YWx1ZSA9IHZhbHVlOyB0aGlzLnVwZGF0ZSgpOyB9IGdldCB2YWx1ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cblxuICAgIHJlYWRvbmx5IHR5cGU6RGVwZW5kZW5jeUZsYWdUYWdzO1xuICAgIHJlYWRvbmx5IGluaGVyaXRlZD86IEluaGVyaXRlZEZPTU9ERGF0YTxEZXBlbmRlbmN5QmFzZT47XG5cbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBEZXBlbmRlbmN5RmxhZ1RhZ3MsIGluaGVyaXRlZD86IEluaGVyaXRlZEZPTU9ERGF0YTxEZXBlbmRlbmN5QmFzZT4sIGluc3RhbmNlRWxlbWVudDogRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcihpbnN0YW5jZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmluaGVyaXRlZCA9IGluaGVyaXRlZDtcbiAgICAgICAgaWYgKGluc3RhbmNlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5mbGFnID0gaW5zdGFuY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpID8/ICcnO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGluc3RhbmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgfHwgaW5zdGFuY2VFbGVtZW50LnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdXBkYXRlXygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaGVyaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdmbGFnRGVwZW5kZW5jeScpIEZsYWcudXBkYXRlR2V0dGVyKHRoaXMpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLmluaGVyaXRlZC5wYXJlbnQpIEZsYWcudXBkYXRlU2V0dGVyKHRoaXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBkZXN0cm95XygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaGVyaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIEZsYWcucmVtb3ZlSXRlbSh0aGlzKTtcbiAgICAgICAgdGhpcy5pbmhlcml0ZWQucGFyZW50Py5mbGFnc1RvU2V0LmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICBzdXBlci5kZXN0cm95XygpO1xuICAgIH1cblxuICAgIC8vIDxmbGFnRGVwZW5kZW5jeSBmbGFnPVwiXCIgdmFsdWU9XCJcIiAvPlxuICAgIG92ZXJyaWRlIGFzTW9kdWxlWE1MKGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQge1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudCA/Pz0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnR5cGUpO1xuXG4gICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsIHRoaXMuZmxhZyk7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdmbGFnRGVwZW5kZW5jeScpXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy52YWx1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZUVsZW1lbnQ7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIERlcGVuZGVuY3lGaWxlIGV4dGVuZHMgRGVwZW5kZW5jeUJhc2Uge1xuICAgIHByaXZhdGUgX2ZpbGUgPSAnJztcbiAgICBzZXQgZmlsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2ZpbGUgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IGZpbGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbGU7IH1cblxuICAgIHByaXZhdGUgX3N0YXRlOiBEZXBlbmRlbmN5RmlsZVN0YXRlID0gJ0FjdGl2ZSc7XG4gICAgc2V0IHN0YXRlKHZhbHVlOiBEZXBlbmRlbmN5RmlsZVN0YXRlKSB7IHRoaXMuX3N0YXRlID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBzdGF0ZSgpOiBEZXBlbmRlbmN5RmlsZVN0YXRlIHsgcmV0dXJuIHRoaXMuX3N0YXRlOyB9XG5cbiAgICAvLyA8ZmlsZURlcGVuZGVuY3kgZmlsZT1cIjJcIiBzdGF0ZT1cIkFjdGl2ZVwiIC8+XG4gICAgb3ZlcnJpZGUgYXNNb2R1bGVYTUwoZG9jdW1lbnQ6IFhNTERvY3VtZW50KTogRWxlbWVudCB7XG4gICAgICAgIGNvbnN0IHRoaXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmlsZURlcGVuZGVuY3knKTtcbiAgICAgICAgdGhpc0VsZW1lbnQuc2V0QXR0cmlidXRlKCdmaWxlJywgdGhpcy5maWxlKTtcbiAgICAgICAgdGhpc0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdGF0ZScsIHRoaXMuc3RhdGUpO1xuICAgICAgICByZXR1cm4gdGhpc0VsZW1lbnQ7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBEZXBlbmRlbmN5U2NyaXB0RXh0ZW5kZXIgZXh0ZW5kcyBEZXBlbmRlbmN5QmFzZVZlcnNpb25DaGVjayB7XG4gICAgLy8gPGZvc2VEZXBlbmRlbmN5IHZlcnNpb249XCJcIiAvPlxuICAgIG92ZXJyaWRlIGFzTW9kdWxlWE1MKGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQge1xuICAgICAgICBjb25zdCB0aGlzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvc2VEZXBlbmRlbmN5Jyk7XG4gICAgICAgIHRoaXNFbGVtZW50LnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIHRoaXMudmVyc2lvbik7XG4gICAgICAgIHJldHVybiB0aGlzRWxlbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZXBlbmRlbmN5R2FtZVZlcnNpb24gZXh0ZW5kcyBEZXBlbmRlbmN5QmFzZVZlcnNpb25DaGVjayB7XG4gICAgLy8gPGdhbWVEZXBlbmRlbmN5IHZlcnNpb249XCJcIiAvPlxuICAgIG92ZXJyaWRlIGFzTW9kdWxlWE1MKGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQge1xuICAgICAgICBjb25zdCB0aGlzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dhbWVEZXBlbmRlbmN5Jyk7XG4gICAgICAgIHRoaXNFbGVtZW50LnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIHRoaXMudmVyc2lvbik7XG4gICAgICAgIHJldHVybiB0aGlzRWxlbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZXBlbmRlbmN5TW9kTWFuYWdlciBleHRlbmRzIERlcGVuZGVuY3lCYXNlVmVyc2lvbkNoZWNrIHtcbiAgICAvLyA8Zm9tbURlcGVuZGVuY3kgdmVyc2lvbj1cIjFcIiAvPlxuICAgIG92ZXJyaWRlIGFzTW9kdWxlWE1MKGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQge1xuICAgICAgICBjb25zdCB0aGlzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZvbW1EZXBlbmRlbmN5Jyk7XG4gICAgICAgIHRoaXNFbGVtZW50LnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIHRoaXMudmVyc2lvbik7XG4gICAgICAgIHJldHVybiB0aGlzRWxlbWVudDtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlRGVwZW5kZW5jeShkZXBlbmRlbmN5OiBFbGVtZW50LCBpbmhlcml0ZWQ/OiBJbmhlcml0ZWRGT01PRERhdGE8RGVwZW5kZW5jeUJhc2U+KTogUHJvbWlzZTxEZXBlbmRlbmN5PiB7XG4gICAgY29uc3QgdHlwZSA9IGRlcGVuZGVuY3kudGFnTmFtZTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnZGVwZW5kZW5jaWVzJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGVwZW5kZW5jeUdyb3VwKGRlcGVuZGVuY3ksIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgIGNhc2UgJ2ZpbGVEZXBlbmRlbmN5JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGVwZW5kZW5jeUZpbGUoZGVwZW5kZW5jeSk7XG4gICAgICAgIGNhc2UgJ2ZsYWdEZXBlbmRlbmN5JzpcbiAgICAgICAgICAgIGlmIChkZXBlbmRlbmN5LnByZXZpb3VzU2libGluZz8ubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFIHx8ICFpbmhlcml0ZWQ/LmJhc2UpIHJldHVybiBuZXcgRGVwZW5kZW5jeUZsYWcoJ2ZsYWdEZXBlbmRlbmN5JywgaW5oZXJpdGVkLCBkZXBlbmRlbmN5KTtcblxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNhc2UtZGVjbGFyYXRpb25zXG4gICAgICAgICAgICBjb25zdCBbLCBzdGVwTnVtU3RyLCBncm91cE51bVN0ciwgb3B0aW9uTnVtU3RyXSA9IGRlcGVuZGVuY3kucHJldmlvdXNTaWJsaW5nLnRleHRDb250ZW50Py5tYXRjaCgvT3B0aW9uIChcXGQrKS0oXFxkKyktKFxcZCspLykgPz8gW107XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgcGFyc2VPcHRpb25EZXBlbmRlbmN5KHN0ZXBOdW1TdHIsIGdyb3VwTnVtU3RyLCBvcHRpb25OdW1TdHIsIGluaGVyaXRlZC5iYXNlKSA/PyBuZXcgRGVwZW5kZW5jeUZsYWcoJ2ZsYWdEZXBlbmRlbmN5JywgaW5oZXJpdGVkLCBkZXBlbmRlbmN5KTtcbiAgICAgICAgY2FzZSAnZm9zZURlcGVuZGVuY3knOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEZXBlbmRlbmN5U2NyaXB0RXh0ZW5kZXIoZGVwZW5kZW5jeSk7XG4gICAgICAgIGNhc2UgJ2dhbWVEZXBlbmRlbmN5JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGVwZW5kZW5jeUdhbWVWZXJzaW9uKGRlcGVuZGVuY3kpO1xuICAgICAgICBjYXNlICdmb21tRGVwZW5kZW5jeSc6XG4gICAgICAgICAgICByZXR1cm4gbmV3IERlcGVuZGVuY3lNb2RNYW5hZ2VyKGRlcGVuZGVuY3kpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBkZXBlbmRlbmN5IHR5cGU6ICR7dHlwZX1gKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlT3B0aW9uRGVwZW5kZW5jeShzdGVwTnVtU3RyOiBzdHJpbmd8dW5kZWZpbmVkLCBncm91cE51bVN0cjogc3RyaW5nfHVuZGVmaW5lZCwgb3B0aW9uTnVtU3RyOiBzdHJpbmd8dW5kZWZpbmVkLCBiYXNlOiBGb21vZCk6IFByb21pc2U8T3B0aW9uIHwgbnVsbD4ge1xuICAgIGlmICghc3RlcE51bVN0ciB8fCAhZ3JvdXBOdW1TdHIgfHwgIW9wdGlvbk51bVN0cikgcmV0dXJuIG51bGw7XG4gICAgd2hpbGUgKHVpLmxvYWRpbmdGb21vZC5zdGF0ZSkgYXdhaXQgd2FpdCg1KTtcblxuICAgIGNvbnN0IHN0ZXAgPSBnZXRTZXRJbmRleChiYXNlLnN0ZXBzLCBwYXJzZUludChzdGVwTnVtU3RyKSk7XG4gICAgY29uc3QgZ3JvdXAgPSBzdGVwID8gZ2V0U2V0SW5kZXgoc3RlcC5ncm91cHMsIHBhcnNlSW50KGdyb3VwTnVtU3RyKSkgOiBudWxsO1xuICAgIGNvbnN0IG9wdGlvbiA9IGdyb3VwID8gZ2V0U2V0SW5kZXgoZ3JvdXAub3B0aW9ucywgcGFyc2VJbnQob3B0aW9uTnVtU3RyKSkgOiBudWxsO1xuXG4gICAgcmV0dXJuIG9wdGlvbiA/PyBudWxsO1xufVxuXG4vKioqXG4gKiAgICAgJCQkJCQkXFwgICAgICAgICAgICAgICQkXFwgICAgICQkXFwgICAgICAgICAgICAgICAgICAkJCQkJCRcXCAgICAkJFxcICAgICAgICAgICAgICAgICAkJFxcXG4gKiAgICAkJCAgX18kJFxcICAgICAgICAgICAgICQkIHwgICAgJCAgfCAgICAgICAgICAgICAgICAkJCAgX18kJFxcICAgJCQgfCAgICAgICAgICAgICAgICAkJCB8XG4gKiAgICAkJCAvICAkJCB8ICQkJCQkJFxcICAkJCQkJCRcXCAgIFxcXy8gJCQkJCQkJFxcICAgICAgICAkJCAvICBcXF9ffCQkJCQkJFxcICAgICQkJCQkJFxcICAkJCQkJCRcXCAgICAkJCQkJCRcXFxuICogICAgJCQgfCAgJCQgfCQkICBfXyQkXFwgXFxfJCQgIF98ICAgICAgJCQgIF9fJCRcXCAgICAgICBcXCQkJCQkJFxcICBcXF8kJCAgX3wgICBcXF9fX18kJFxcIFxcXyQkICBffCAgJCQgIF9fJCRcXFxuICogICAgJCQgfCAgJCQgfCQkIC8gICQkIHwgICQkIHwgICAgICAgICQkIHwgICQkIHwgICAgICAgXFxfX19fJCRcXCAgICQkIHwgICAgICQkJCQkJCQgfCAgJCQgfCAgICAkJCQkJCQkJCB8XG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCAgJCQgfCQkXFwgICAgICQkIHwgICQkIHwgICAgICAkJFxcICAgJCQgfCAgJCQgfCQkXFwgJCQgIF9fJCQgfCAgJCQgfCQkXFwgJCQgICBfX19ffFxuICogICAgICQkJCQkJCAgfCQkJCQkJCQgIHwgIFxcJCQkJCAgfCAgICAkJCB8ICAkJCB8ICAgICAgXFwkJCQkJCQgIHwgIFxcJCQkJCAgfFxcJCQkJCQkJCB8ICBcXCQkJCQgIHxcXCQkJCQkJCRcXFxuICogICAgIFxcX19fX19fLyAkJCAgX19fXy8gICAgXFxfX19fLyAgICAgXFxfX3wgIFxcX198ICAgICAgIFxcX19fX19fLyAgICBcXF9fX18vICBcXF9fX19fX198ICAgXFxfX19fLyAgXFxfX19fX19ffFxuICogICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAkJCB8XG4gKiAgICAgICAgICAgICAgXFxfX3xcbiAqICAgICQkJCQkJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkXFwgICAgICAgICAgICAgJCRcXFxuICogICAgJCQgIF9fJCRcXCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxfX3wgICAgICAgICAgICAkJCB8XG4gKiAgICAkJCB8ICAkJCB8ICQkJCQkJFxcICAgJCQkJCQkJFxcICAkJCQkJCQkXFwgICQkJCQkJFxcICAkJFxcICAkJCQkJCRcXCAgJCQkJCQkXFwgICAgJCQkJCQkXFwgICAkJCQkJCRcXCAgICQkJCQkJCRcXFxuICogICAgJCQgfCAgJCQgfCQkICBfXyQkXFwgJCQgIF9fX19ffCQkICBfX19fX3wkJCAgX18kJFxcICQkIHwkJCAgX18kJFxcIFxcXyQkICBffCAgJCQgIF9fJCRcXCAkJCAgX18kJFxcICQkICBfX19fX3xcbiAqICAgICQkIHwgICQkIHwkJCQkJCQkJCB8XFwkJCQkJCRcXCAgJCQgLyAgICAgICQkIHwgIFxcX198JCQgfCQkIC8gICQkIHwgICQkIHwgICAgJCQgLyAgJCQgfCQkIHwgIFxcX198XFwkJCQkJCRcXFxuICogICAgJCQgfCAgJCQgfCQkICAgX19fX3wgXFxfX19fJCRcXCAkJCB8ICAgICAgJCQgfCAgICAgICQkIHwkJCB8ICAkJCB8ICAkJCB8JCRcXCAkJCB8ICAkJCB8JCQgfCAgICAgICBcXF9fX18kJFxcXG4gKiAgICAkJCQkJCQkICB8XFwkJCQkJCQkXFwgJCQkJCQkJCAgfFxcJCQkJCQkJFxcICQkIHwgICAgICAkJCB8JCQkJCQkJCAgfCAgXFwkJCQkICB8XFwkJCQkJCQgIHwkJCB8ICAgICAgJCQkJCQkJCAgfFxuICogICAgXFxfX19fX19fLyAgXFxfX19fX19ffFxcX19fX19fXy8gIFxcX19fX19fX3xcXF9ffCAgICAgIFxcX198JCQgIF9fX18vICAgIFxcX19fXy8gIFxcX19fX19fLyBcXF9ffCAgICAgIFxcX19fX19fXy9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcX198XG4gKi9cblxuZXhwb3J0IHR5cGUgT3B0aW9uU3RhdGUgPVxuICAgIHwgJ09wdGlvbmFsJyAgICAgICAgLy8gVW5jaGVja2VkIGJ1dCBjaGVja2FibGVcbiAgICB8ICdSZWNvbW1lbmRlZCcgICAgIC8vIENoZWNrZWQgYnV0IHVuY2hlY2thYmxlXG4gICAgfCAnQ291bGRCZVVzZWFibGUnICAvLyBUT0RPOiBDaGVjayBpZiB0aGlzIGhhcyBhIHVzZSAtIFVQREFURTogTm8gdXNlIGluIFZvcnRleFxuICAgIHwgJ1JlcXVpcmVkJyAgICAgICAgLy8gUGVybWFuZW50bHkgY2hlY2tlZFxuICAgIHwgJ05vdFVzZWFibGUnOyAgICAgLy8gUGVybWFuZW50bHkgdW5jaGVja2VkXG5leHBvcnQgY2xhc3MgT3B0aW9uU3RhdGVEZXNjcmlwdG9yIGV4dGVuZHMgRk9NT0RFbGVtZW50UHJveHkge1xuICAgIGtleXNUb1VwZGF0ZSA9IFsnY29uZGl0aW9ucyddIGFzIGNvbnN0O1xuXG4gICAgcHJpdmF0ZSBfZGVmYXVsdFN0YXRlOiBPcHRpb25TdGF0ZSA9ICdPcHRpb25hbCc7XG4gICAgc2V0IGRlZmF1bHRTdGF0ZSh2YWx1ZTogT3B0aW9uU3RhdGUpIHsgdGhpcy5fZGVmYXVsdFN0YXRlID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBkZWZhdWx0U3RhdGUoKTogT3B0aW9uU3RhdGUgeyByZXR1cm4gdGhpcy5fZGVmYXVsdFN0YXRlOyB9XG5cbiAgICBjb25kaXRpb25zOiBPcHRpb25TdGF0ZUNvbmRpdGlvblN0YXRlbWVudFtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgaW5zdGFuY2VFbGVtZW50PzogRWxlbWVudCxcbiAgICAgICAgZGVmYXVsdFN0YXRlOiBPcHRpb25TdGF0ZSA9ICdPcHRpb25hbCcsXG4gICAgICAgIGNvbmRpdGlvbnM6IE9wdGlvblN0YXRlQ29uZGl0aW9uU3RhdGVtZW50W10gPSBbXVxuICAgICkge1xuICAgICAgICBzdXBlcihpbnN0YW5jZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmRlZmF1bHRTdGF0ZSA9IGRlZmF1bHRTdGF0ZTtcbiAgICAgICAgdGhpcy5jb25kaXRpb25zID0gY29uZGl0aW9ucztcblxuICAgICAgICBjb25zdCBiYXNpY0VsZW1lbnQgPSBpbnN0YW5jZUVsZW1lbnQ/LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0eXBlJylbMF07XG4gICAgICAgIGNvbnN0IGNvbXBsZXhFbGVtZW50ID0gaW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVwZW5kZW5jeVR5cGUnKVswXTtcblxuICAgICAgICBpZiAoYmFzaWNFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRTdGF0ZSA9IGJhc2ljRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSBhcyBPcHRpb25TdGF0ZTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBsZXhFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0VHlwZUVsZW1lbnQgPSBjb21wbGV4RWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVmYXVsdFR5cGUnKVswXTtcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VHlwZUVsZW1lbnQpIHRoaXMuZGVmYXVsdFN0YXRlID0gZGVmYXVsdFR5cGVFbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpIGFzIE9wdGlvblN0YXRlIHx8ICdPcHRpb25hbCc7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhdHRlcm5FbGVtZW50ID0gY29tcGxleEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BhdHRlcm5zJylbMF07XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3kgb2YgcGF0dGVybkVsZW1lbnQ/LmNoaWxkcmVuIHx8IFtdKVxuICAgICAgICAgICAgICAgIHRoaXMuY29uZGl0aW9ucy5wdXNoKG5ldyBPcHRpb25TdGF0ZUNvbmRpdGlvblN0YXRlbWVudChkZXBlbmRlbmN5KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPz89IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3R5cGVEZXNjcmlwdG9yJyk7XG5cbiAgICAgICAgbGV0IGJhc2ljRWxlbWVudCA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0eXBlJylbMF07XG4gICAgICAgIGxldCBjb21wbGV4RWxlbWVudCA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkZXBlbmRlbmN5VHlwZScpWzBdO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuY29uZGl0aW9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29tcGxleEVsZW1lbnQ/LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBiYXNpY0VsZW1lbnQgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ3R5cGUnKTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LmFwcGVuZENoaWxkKGJhc2ljRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGJhc2ljRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCB0aGlzLmRlZmF1bHRTdGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgYmFzaWNFbGVtZW50Py5yZW1vdmUoKTtcblxuICAgICAgICBjb21wbGV4RWxlbWVudCA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnZGVwZW5kZW5jeVR5cGUnKSAgO1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChjb21wbGV4RWxlbWVudCk7XG5cbiAgICAgICAgY29uc3QgY29tcGxleFR5cGVFbGVtZW50ID0gY29tcGxleEVsZW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdkZWZhdWx0VHlwZScpO1xuICAgICAgICBjb21wbGV4VHlwZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkZWZhdWx0JywgdGhpcy5kZWZhdWx0U3RhdGUpO1xuICAgICAgICBjb21wbGV4RWxlbWVudC5hcHBlbmRDaGlsZChjb21wbGV4VHlwZUVsZW1lbnQpO1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZXhQYXR0ZXJuRWxlbWVudCA9IGNvbXBsZXhFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygncGF0dGVybnMnKTtcbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5IG9mIHRoaXMuY29uZGl0aW9ucylcbiAgICAgICAgICAgIGNvbXBsZXhQYXR0ZXJuRWxlbWVudC5hcHBlbmRDaGlsZCggIGRlcGVuZGVuY3kuYXNNb2R1bGVYTUwoZG9jdW1lbnQpICk7XG4gICAgICAgIGNvbXBsZXhFbGVtZW50LmFwcGVuZENoaWxkKGNvbXBsZXhQYXR0ZXJuRWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VFbGVtZW50O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9wdGlvblN0YXRlQ29uZGl0aW9uU3RhdGVtZW50IGV4dGVuZHMgRk9NT0RFbGVtZW50UHJveHkge1xuICAgIGtleXNUb1VwZGF0ZSA9IFsnZGVwZW5kZW5jaWVzJ10gYXMgY29uc3Q7XG5cbiAgICBwcml2YXRlIF90eXBlOiBPcHRpb25TdGF0ZSA9ICdPcHRpb25hbCc7XG4gICAgc2V0IHR5cGUodmFsdWU6IE9wdGlvblN0YXRlKSB7IHRoaXMuX3R5cGUgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IHR5cGUoKTogT3B0aW9uU3RhdGUgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxuXG4gICAgcHJpdmF0ZSBfdHlwZUVsZW1lbnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgc2V0IHR5cGVFbGVtZW50KHZhbHVlOiBFbGVtZW50IHwgdW5kZWZpbmVkKSB7IHRoaXMuX3R5cGVFbGVtZW50ID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCB0eXBlRWxlbWVudCgpOiBFbGVtZW50IHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuX3R5cGVFbGVtZW50OyB9XG5cbiAgICBwcml2YXRlIF9kZXBlbmRlbmNpZXMhOiBEZXBlbmRlbmN5R3JvdXA7XG4gICAgc2V0IGRlcGVuZGVuY2llcyh2YWx1ZTogRGVwZW5kZW5jeUdyb3VwKSB7IHRoaXMuX2RlcGVuZGVuY2llcyA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgZGVwZW5kZW5jaWVzKCk6IERlcGVuZGVuY3lHcm91cCB7IHJldHVybiB0aGlzLl9kZXBlbmRlbmNpZXM7IH1cblxuICAgIGNvbnN0cnVjdG9yKGluc3RhbmNlRWxlbWVudD86IEVsZW1lbnQsIGRlcGVuZGVuY3k/OiBEZXBlbmRlbmN5R3JvdXAsIHR5cGU6IE9wdGlvblN0YXRlID0gJ09wdGlvbmFsJykge1xuICAgICAgICBzdXBlcihpbnN0YW5jZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY3kgPz8gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGFzTW9kdWxlWE1MKGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQge1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudCA9XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudCA/PyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwYXR0ZXJuJyk7XG5cbiAgICAgICAgdGhpcy50eXBlRWxlbWVudCA9IHRoaXMudHlwZUVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8/IHRoaXMuaW5zdGFuY2VFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3R5cGUnKSk7XG4gICAgICAgIHRoaXMudHlwZUVsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy50eXBlKTtcblxuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRlcGVuZGVuY2llcy5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG59XG5cbi8qKipcbiAqICAgICQkJCQkJFxcICAgICAgICAgICAgICAgICAgICAgICAkJFxcICAgICAgICAgICAgICAgJCRcXCAkJFxcXG4gKiAgICBcXF8kJCAgX3wgICAgICAgICAgICAgICAgICAgICAgJCQgfCAgICAgICAgICAgICAgJCQgfCQkIHxcbiAqICAgICAgJCQgfCAgJCQkJCQkJFxcICAgJCQkJCQkJFxcICQkJCQkJFxcICAgICQkJCQkJFxcICAkJCB8JCQgfCAkJCQkJCQkXFxcbiAqICAgICAgJCQgfCAgJCQgIF9fJCRcXCAkJCAgX19fX198XFxfJCQgIF98ICAgXFxfX19fJCRcXCAkJCB8JCQgfCQkICBfX19fX3xcbiAqICAgICAgJCQgfCAgJCQgfCAgJCQgfFxcJCQkJCQkXFwgICAgJCQgfCAgICAgJCQkJCQkJCB8JCQgfCQkIHxcXCQkJCQkJFxcXG4gKiAgICAgICQkIHwgICQkIHwgICQkIHwgXFxfX19fJCRcXCAgICQkIHwkJFxcICQkICBfXyQkIHwkJCB8JCQgfCBcXF9fX18kJFxcXG4gKiAgICAkJCQkJCRcXCAkJCB8ICAkJCB8JCQkJCQkJCAgfCAgXFwkJCQkICB8XFwkJCQkJCQkIHwkJCB8JCQgfCQkJCQkJCQgIHxcbiAqICAgIFxcX19fX19ffFxcX198ICBcXF9ffFxcX19fX19fXy8gICAgXFxfX19fLyAgXFxfX19fX19ffFxcX198XFxfX3xcXF9fX19fX18vXG4gKi9cblxuXG5leHBvcnQgY29uc3QgaW5zdGFsbHMgPSBuZXcgU2V0PEluc3RhbGxFbGVtZW50PigpO1xuXG5mdW5jdGlvbiBwYXJzZUZpbGVzKGVsZW06IEVsZW1lbnR8dW5kZWZpbmVkKTogSW5zdGFsbEVsZW1lbnRbXSB7XG4gICAgY29uc3QgbG9jYWxJbnN0YWxsczogSW5zdGFsbEVsZW1lbnRbXSA9IFtdO1xuICAgIGlmICghZWxlbSkgcmV0dXJuIGxvY2FsSW5zdGFsbHM7XG5cbiAgICBjb25zdCBkZXBlbmRlbmNpZXNFbGVtID0gZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVwZW5kZW5jaWVzJylbMF07XG4gICAgY29uc3QgZmlsZXNFbGVtID0gZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZmlsZXMnKVswXSB8fCBlbGVtO1xuXG4gICAgbGV0IGRlcGVuZGVuY2llczogRGVwZW5kZW5jeUdyb3VwfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZGVwZW5kZW5jaWVzRWxlbSkgZGVwZW5kZW5jaWVzID0gbmV3IERlcGVuZGVuY3lHcm91cChkZXBlbmRlbmNpZXNFbGVtKTtcblxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlc0VsZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc3QgaW5zdGFsbCA9IG5ldyBJbnN0YWxsRWxlbWVudChmaWxlLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICBsb2NhbEluc3RhbGxzLnB1c2goaW5zdGFsbCk7XG4gICAgICAgIGluc3RhbGxzLmFkZChpbnN0YWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9jYWxJbnN0YWxscztcbn1cblxuZXhwb3J0IGNsYXNzIEluc3RhbGxFbGVtZW50IGV4dGVuZHMgRk9NT0RFbGVtZW50UHJveHkge1xuICAgIGtleXNUb1VwZGF0ZSA9IFsnZGVwZW5kZW5jaWVzJ10gYXMgY29uc3Q7XG5cbiAgICBwcml2YXRlIF9zb3VyY2U6IHN0cmluZ1tdID0gW107XG4gICAgc2V0IHNvdXJjZSh2YWx1ZTogc3RyaW5nW10pIHsgdGhpcy5fc291cmNlID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBzb3VyY2UoKTogc3RyaW5nW10geyByZXR1cm4gdGhpcy5fc291cmNlOyB9XG5cbiAgICBwcml2YXRlIF9kZXN0aW5hdGlvbjogc3RyaW5nW10gPSBbXTtcbiAgICBzZXQgZGVzdGluYXRpb24odmFsdWU6IHN0cmluZ1tdKSB7IHRoaXMuX2Rlc3RpbmF0aW9uID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBkZXN0aW5hdGlvbigpOiBzdHJpbmdbXSB7IHJldHVybiB0aGlzLl9kZXN0aW5hdGlvbjsgfVxuXG4gICAgZGVwZW5kZW5jaWVzOiBEZXBlbmRlbmN5R3JvdXB8bnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIF9wcmlvcml0eTogbnVtYmVyID0gMDtcbiAgICBzZXQgcHJpb3JpdHkodmFsdWU6IG51bWJlcikgeyB0aGlzLl9wcmlvcml0eSA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgcHJpb3JpdHkoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3ByaW9yaXR5OyB9XG5cbiAgICBhc3luYyB1cGRhdGVGaWxlKHBhdGhPckZpbGU6IHN0cmluZ3xzdHJpbmdbXSB8IEZpbGVTeXN0ZW1IYW5kbGUpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICBpZiAocGF0aE9yRmlsZSBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1IYW5kbGUpIHBhdGhPckZpbGUgPSBhd2FpdCB3aW5kb3cuRk9NT0RCdWlsZGVyLmRpcmVjdG9yeT8uaGFuZGxlLnJlc29sdmUocGF0aE9yRmlsZSkgPz8gJyc7XG4gICAgICAgIGlmIChwYXRoT3JGaWxlIGluc3RhbmNlb2YgRmlsZSlcbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoT3JGaWxlID09PSAnc3RyaW5nJykgcGF0aE9yRmlsZSA9IHBhdGhPckZpbGUucmVwbGFjZSgvXFxcXC9nLCAnLycpLnNwbGl0KCcvJyk7XG4gICAgICAgIGlmICggIShwYXRoT3JGaWxlIGluc3RhbmNlb2YgQXJyYXkpICkgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcmVzb2x2ZSBwYXRoIC0gbW9zdCBsaWtlbHkgb3V0c2lkZSBvZiB0aGUgcm9vdCBkaXJlY3RvcnknKTtcblxuXG4gICAgICAgIHRoaXMuc291cmNlID0gcGF0aE9yRmlsZTtcbiAgICB9XG5cbiAgICAvKiogQ2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgICAgICA8ZmlsZSBzb3VyY2U9XCIxMjNcIiBwcmlvcml0eT1cIjBcIiBkZXN0aW5hdGlvbj1cIjEyM1wiIGluc3RhbGxJZlVzYWJsZT1cInRydWVcIiBhbHdheXNJbnN0YWxsPVwidHJ1ZVwiIC8+XG4gICAgICAgIDxmb2xkZXIgc291cmNlPVwiMTIzXCIgcHJpb3JpdHk9XCIwXCIgZGVzdGluYXRpb249XCIxMjNcIiBpbnN0YWxsSWZVc2FibGU9XCJ0cnVlXCIgYWx3YXlzSW5zdGFsbD1cInRydWVcIiAvPlxuICAgICovXG4gICAgY29uc3RydWN0b3IoaW5zdGFuY2VFbGVtZW50PzogRWxlbWVudCwgZGVwZW5kZW5jaWVzPzogRGVwZW5kZW5jeUdyb3VwKSB7XG4gICAgICAgIHN1cGVyKGluc3RhbmNlRWxlbWVudCk7XG5cbiAgICAgICAgaW5zdGFsbHMuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzID8/IG51bGw7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZUVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnNvdXJjZSA9IGluc3RhbmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpPy5zcGxpdCgvWy9cXFxcXS8pID8/IFtdO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gaW5zdGFuY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGVzdGluYXRpb24nKT8uc3BsaXQoL1svXFxcXF0vKSA/PyBbXTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPz89IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2luc3RhbGwnKTtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5zb3VyY2Uuam9pbignLycpO1xuICAgICAgICBjb25zdCBpc0ZvbGRlciA9IHRoaXMuc291cmNlW3RoaXMuc291cmNlLmxlbmd0aCAtIDFdID09PSAnJztcblxuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXNGb2xkZXIgPyAnZm9sZGVyJyA6ICdmaWxlJylcbiAgICAgICAgKS50ZXh0Q29udGVudCA9IGlzRm9sZGVyID8gcGF0aC5zbGljZSgwLCAtMSkgOiBwYXRoO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG59XG5cbi8qKipcbiAqICAgICAkJCQkJCRcXCAgICAkJFxcXG4gKiAgICAkJCAgX18kJFxcICAgJCQgfFxuICogICAgJCQgLyAgXFxfX3wkJCQkJCRcXCAgICAkJCQkJCRcXCAgICQkJCQkJFxcICAgJCQkJCQkJFxcXG4gKiAgICBcXCQkJCQkJFxcICBcXF8kJCAgX3wgICQkICBfXyQkXFwgJCQgIF9fJCRcXCAkJCAgX19fX198XG4gKiAgICAgXFxfX19fJCRcXCAgICQkIHwgICAgJCQkJCQkJCQgfCQkIC8gICQkIHxcXCQkJCQkJFxcXG4gKiAgICAkJFxcICAgJCQgfCAgJCQgfCQkXFwgJCQgICBfX19ffCQkIHwgICQkIHwgXFxfX19fJCRcXFxuICogICAgXFwkJCQkJCQgIHwgIFxcJCQkJCAgfFxcJCQkJCQkJFxcICQkJCQkJCQgIHwkJCQkJCQkICB8XG4gKiAgICAgXFxfX19fX18vICAgIFxcX19fXy8gIFxcX19fX19fX3wkJCAgX19fXy8gXFxfX19fX19fL1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxfX3xcbiAqL1xuXG5leHBvcnQgdHlwZSBTb3J0T3JkZXIgPVxuICAgIHwgJ0FzY2VuZGluZycgIC8vIEFscGhhYmV0aWNhbFxuICAgIHwgJ0Rlc2NlbmRpbmcnIC8vIFJldmVyc2UgQWxwaGFiZXRpY2FsXG4gICAgfCAnRXhwbGljaXQnOyAgLy8gRXhwbGljaXQgb3JkZXJcblxuZXhwb3J0IGNsYXNzIFN0ZXAgZXh0ZW5kcyBGT01PREVsZW1lbnRQcm94eSB7XG4gICAga2V5c1RvVXBkYXRlID0gWydncm91cHMnLCAnY29uZGl0aW9ucyddIGFzIGNvbnN0O1xuICAgIGluaGVyaXRlZDogSW5oZXJpdGVkRk9NT0REYXRhPFN0ZXA+O1xuXG4gICAgcHJpdmF0ZSBfbmFtZSA9ICcnO1xuICAgIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fbmFtZSA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbmFtZTsgfVxuXG4gICAgcHJpdmF0ZSBfc29ydGluZ09yZGVyOiBTb3J0T3JkZXIgPSB3aW5kb3cuRk9NT0RCdWlsZGVyLnN0b3JhZ2Uuc2V0dGluZ3MuZGVmYXVsdFNvcnRpbmdPcmRlcjtcbiAgICBzZXQgc29ydGluZ09yZGVyKHZhbHVlOiBTb3J0T3JkZXIpIHsgdGhpcy5fc29ydGluZ09yZGVyID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBzb3J0aW5nT3JkZXIoKTogU29ydE9yZGVyIHsgcmV0dXJuIHRoaXMuX3NvcnRpbmdPcmRlcjsgfVxuXG4gICAgZ3JvdXBzOiBTZXQ8R3JvdXA+O1xuXG4gICAgZ3JvdXBDb250YWluZXJzOiBSZWNvcmQ8c3RyaW5nLCBIVE1MRGl2RWxlbWVudD4gPSB7fTtcblxuICAgIGNvbmRpdGlvbnM6IERlcGVuZGVuY3lHcm91cCB8IHVuZGVmaW5lZDtcblxuICAgIGFkZEdyb3VwKHhtbEVsZW1lbnQ/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIEdyb3VwPlsxXSkge1xuICAgICAgICB0aGlzLmdyb3Vwcy5hZGQobmV3IEdyb3VwKHtcbiAgICAgICAgICAgIGJhc2U6IHRoaXMuaW5oZXJpdGVkLmJhc2UsXG4gICAgICAgICAgICBjb250YWluZXJzOiB0aGlzLmdyb3VwQ29udGFpbmVycyxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgfSwgeG1sRWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlV2hvbGUoKTtcbiAgICB9XG4gICAgcmVhZG9ubHkgYWRkR3JvdXBfYm91bmQgPSB0aGlzLmFkZEdyb3VwLmJpbmQodGhpcyk7XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZGVzdHJveV8oKSB7XG4gICAgICAgIGlmICh0aGlzLmluaGVyaXRlZC5wYXJlbnQgJiYgdGhpcy5pbmhlcml0ZWQucGFyZW50LnN0ZXBzLnNpemUgPT0gMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaW5oZXJpdGVkLnBhcmVudD8uc3RlcHMuZGVsZXRlKHRoaXMpO1xuICAgICAgICBzdXBlci5kZXN0cm95XygpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuXG4gICAgY29uc3RydWN0b3IoaW5oZXJpdGVkOiBJbmhlcml0ZWRGT01PRERhdGE8U3RlcD4sIGluc3RhbmNlRWxlbWVudD86IEVsZW1lbnQgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoaW5zdGFuY2VFbGVtZW50KTtcbiAgICAgICAgdGhpcy5pbmhlcml0ZWQgPSBpbmhlcml0ZWQ7XG4gICAgICAgIHRoaXMuZ3JvdXBzID0gbmV3IFNldCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJykgPz8gJyc7XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3Vwc0VsZW0gPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnb3B0aW9uYWxGaWxlR3JvdXBzJylbMF07XG4gICAgICAgICAgICBpZiAoZ3JvdXBzRWxlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydGluZ09yZGVyID0gZ3JvdXBzRWxlbS5nZXRBdHRyaWJ1dGUoJ29yZGVyJykgYXMgU29ydE9yZGVyIHx8IHdpbmRvdy5GT01PREJ1aWxkZXIuc3RvcmFnZS5zZXR0aW5ncy5kZWZhdWx0U29ydGluZ09yZGVyO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cHNFbGVtLmNoaWxkcmVuID8/IFtdKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEdyb3VwKGdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyb3Vwcy5zaXplID09IDApIHRoaXMuYWRkR3JvdXAoKTtcbiAgICB9XG5cbiAgICAvLyA8aW5zdGFsbFN0ZXAgbmFtZT1cIlRIRSBGSVJTVCBPRiBNQU5ZIFNURVBTXCI+XG4gICAgLy8gPG9wdGlvbmFsRmlsZUdyb3VwcyBvcmRlcj1cIkV4cGxpY2l0XCI+XG5cbiAgICBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPz89IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2luc3RhbGxTdGVwJyk7XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcblxuICAgICAgICBjb25zdCB2aXNpYmlsaXR5ID0gdGhpcy5jb25kaXRpb25zPy5hc01vZHVsZVhNTChkb2N1bWVudCwgJ3Zpc2libGUnKTtcbiAgICAgICAgaWYgKHZpc2liaWxpdHkpIHRoaXMuaW5zdGFuY2VFbGVtZW50LmFwcGVuZENoaWxkKHZpc2liaWxpdHkpO1xuICAgICAgICBlbHNlIHRoaXMuaW5zdGFuY2VFbGVtZW50LnJlbW92ZUNoaWxkQnlUYWcoJ3Zpc2libGUnKTtcblxuICAgICAgICBjb25zdCBvcHRpb25hbEZpbGVHcm91cHMgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ29wdGlvbmFsRmlsZUdyb3VwcycpO1xuICAgICAgICBvcHRpb25hbEZpbGVHcm91cHMuc2V0QXR0cmlidXRlKCdvcmRlcicsIHRoaXMuc29ydGluZ09yZGVyKTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIG9wdGlvbmFsRmlsZUdyb3Vwcy5hcHBlbmRDaGlsZChncm91cC5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChvcHRpb25hbEZpbGVHcm91cHMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG59XG5cbi8qKipcbiAqICAgICAkJCQkJCRcXFxuICogICAgJCQgIF9fJCRcXFxuICogICAgJCQgLyAgXFxfX3wgJCQkJCQkXFwgICAkJCQkJCRcXCAgJCRcXCAgICQkXFwgICQkJCQkJFxcICAgJCQkJCQkJFxcXG4gKiAgICAkJCB8JCQkJFxcICQkICBfXyQkXFwgJCQgIF9fJCRcXCAkJCB8ICAkJCB8JCQgIF9fJCRcXCAkJCAgX19fX198XG4gKiAgICAkJCB8XFxfJCQgfCQkIHwgIFxcX198JCQgLyAgJCQgfCQkIHwgICQkIHwkJCAvICAkJCB8XFwkJCQkJCRcXFxuICogICAgJCQgfCAgJCQgfCQkIHwgICAgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwgXFxfX19fJCRcXFxuICogICAgXFwkJCQkJCQgIHwkJCB8ICAgICAgXFwkJCQkJCQgIHxcXCQkJCQkJCAgfCQkJCQkJCQgIHwkJCQkJCQkICB8XG4gKiAgICAgXFxfX19fX18vIFxcX198ICAgICAgIFxcX19fX19fLyAgXFxfX19fX18vICQkICBfX19fLyBcXF9fX19fX18vXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCQgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXF9ffFxuICovXG5cbmV4cG9ydCB0eXBlIEdyb3VwU2VsZWN0VHlwZSA9XG4gICAgfCAnU2VsZWN0QWxsJyAgICAgICAgICAgLy8gRm9yY2Utc2VsZWN0cyBhbGwgb3B0aW9uc1xuICAgIHwgJ1NlbGVjdEFueScgICAgICAgICAgIC8vIEFsbG93cyB1c2VycyB0byBzZWxlY3QgYW55IG51bWJlciBvZiBvcHRpb25zXG4gICAgfCAnU2VsZWN0QXRNb3N0T25lJyAgICAgLy8gUmVxdWlyZXMgdXNlcnMgdG8gc2VsZWN0IG9uZSBvciBubyBvcHRpb25zXG4gICAgfCAnU2VsZWN0QXRMZWFzdE9uZScgICAgLy8gUmVxdWlyZXMgdXNlcnMgdG8gc2VsZWN0IGF0IGxlYXN0IG9uZSBvcHRpb25cbiAgICB8ICdTZWxlY3RFeGFjdGx5T25lJzsgICAvLyBSZXF1aXJlcyB1c2VycyB0byBzZWxlY3QgZXhhY3RseSBvbmUgb3B0aW9uXG5leHBvcnQgY2xhc3MgR3JvdXAgZXh0ZW5kcyBGT01PREVsZW1lbnRQcm94eSB7XG4gICAga2V5c1RvVXBkYXRlID0gWydvcHRpb25zJ10gYXMgY29uc3Q7XG4gICAgaW5oZXJpdGVkOiBJbmhlcml0ZWRGT01PRERhdGE8R3JvdXA+O1xuXG4gICAgcHJpdmF0ZSBfbmFtZSA9ICcnO1xuICAgIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fbmFtZSA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbmFtZTsgfVxuXG4gICAgcHJpdmF0ZSBfdHlwZTogR3JvdXBTZWxlY3RUeXBlID0gd2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlLnNldHRpbmdzLmRlZmF1bHRHcm91cFNlbGVjdFR5cGU7XG4gICAgc2V0IHR5cGUodmFsdWU6IEdyb3VwU2VsZWN0VHlwZSkgeyB0aGlzLl90eXBlID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCB0eXBlKCk6IEdyb3VwU2VsZWN0VHlwZSB7IHJldHVybiB0aGlzLl90eXBlOyB9XG5cbiAgICBwcml2YXRlIF9zb3J0aW5nT3JkZXI6IFNvcnRPcmRlciA9IHdpbmRvdy5GT01PREJ1aWxkZXIuc3RvcmFnZS5zZXR0aW5ncy5kZWZhdWx0U29ydGluZ09yZGVyO1xuICAgIHNldCBzb3J0aW5nT3JkZXIodmFsdWU6IFNvcnRPcmRlcikgeyB0aGlzLl9zb3J0aW5nT3JkZXIgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IHNvcnRpbmdPcmRlcigpOiBTb3J0T3JkZXIgeyByZXR1cm4gdGhpcy5fc29ydGluZ09yZGVyOyB9XG5cbiAgICBvcHRpb25zOiBTZXQ8T3B0aW9uPjtcblxuICAgIG9wdGlvbkNvbnRhaW5lcnM6IFJlY29yZDxzdHJpbmcsIEhUTUxEaXZFbGVtZW50PiA9IHt9O1xuXG4gICAgYWRkT3B0aW9uKHhtbEVsZW1lbnQ/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIE9wdGlvbj5bMV0pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmFkZChuZXcgT3B0aW9uKHtcbiAgICAgICAgICAgIGJhc2U6IHRoaXMuaW5oZXJpdGVkLmJhc2UsXG4gICAgICAgICAgICBjb250YWluZXJzOiB0aGlzLm9wdGlvbkNvbnRhaW5lcnMsXG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIH0sIHhtbEVsZW1lbnQpKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVdob2xlKCk7XG4gICAgfVxuICAgIHJlYWRvbmx5IGFkZE9wdGlvbl9ib3VuZCA9IHRoaXMuYWRkT3B0aW9uLmJpbmQodGhpcyk7XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZGVzdHJveV8oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5oZXJpdGVkLnBhcmVudD8uZ3JvdXBzLmRlbGV0ZSh0aGlzKTtcbiAgICAgICAgc3VwZXIuZGVzdHJveV8oKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihpbmhlcml0ZWQ6IEluaGVyaXRlZEZPTU9ERGF0YTxHcm91cD4sIGluc3RhbmNlRWxlbWVudD86IEVsZW1lbnQgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoaW5zdGFuY2VFbGVtZW50KTtcbiAgICAgICAgdGhpcy5pbmhlcml0ZWQgPSBpbmhlcml0ZWQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG5ldyBTZXQoKTtcblxuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpID8/ICcnO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdGhpcy5pbnN0YW5jZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgYXMgR3JvdXBTZWxlY3RUeXBlXG4gICAgICAgICAgICAgICAgfHwgd2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlLnNldHRpbmdzLmRlZmF1bHRHcm91cFNlbGVjdFR5cGU7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnNFbGVtID0gdGhpcy5pbnN0YW5jZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BsdWdpbnMnKVswXTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zRWxlbSl7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0aW5nT3JkZXIgPSBvcHRpb25zRWxlbS5nZXRBdHRyaWJ1dGUoJ29yZGVyJykgYXMgU29ydE9yZGVyIHx8IHdpbmRvdy5GT01PREJ1aWxkZXIuc3RvcmFnZS5zZXR0aW5ncy5kZWZhdWx0U29ydGluZ09yZGVyO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2Ygb3B0aW9uc0VsZW0uY2hpbGRyZW4gPz8gW10pXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkT3B0aW9uKG9wdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpemUgPT0gMCkgdGhpcy5hZGRPcHRpb24oKTtcbiAgICB9XG5cbiAgICAvLyA8Z3JvdXAgbmFtZT1cIkJhbmFuYSBUeXBlc1wiIHR5cGU9XCJTZWxlY3RBbnlcIj5cbiAgICAvLyA8cGx1Z2lucyBvcmRlcj1cIkV4cGxpY2l0XCI+XG5cbiAgICBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPSB0aGlzLmluc3RhbmNlRWxlbWVudCA/PyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdncm91cCcpO1xuXG4gICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsIHRoaXMubmFtZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsIHRoaXMudHlwZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaXplID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygncGx1Z2lucycpO1xuICAgICAgICAgICAgb3B0aW9ucy5zZXRBdHRyaWJ1dGUoJ29yZGVyJywgdGhpcy5zb3J0aW5nT3JkZXIpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIG9wdGlvbnMuYXBwZW5kQ2hpbGQob3B0aW9uLmFzTW9kdWxlWE1MKGRvY3VtZW50KSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQucmVtb3ZlQ2hpbGRCeVRhZygncGx1Z2lucycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG59XG5cbi8qKipcbiAqICAgICAkJCQkJCRcXCAgICAgICAgICAgICAgJCRcXCAgICAgJCRcXFxuICogICAgJCQgIF9fJCRcXCAgICAgICAgICAgICAkJCB8ICAgIFxcX198XG4gKiAgICAkJCAvICAkJCB8ICQkJCQkJFxcICAkJCQkJCRcXCAgICQkXFwgICQkJCQkJFxcICAkJCQkJCQkXFwgICAkJCQkJCQkXFxcbiAqICAgICQkIHwgICQkIHwkJCAgX18kJFxcIFxcXyQkICBffCAgJCQgfCQkICBfXyQkXFwgJCQgIF9fJCRcXCAkJCAgX19fX198XG4gKiAgICAkJCB8ICAkJCB8JCQgLyAgJCQgfCAgJCQgfCAgICAkJCB8JCQgLyAgJCQgfCQkIHwgICQkIHxcXCQkJCQkJFxcXG4gKiAgICAkJCB8ICAkJCB8JCQgfCAgJCQgfCAgJCQgfCQkXFwgJCQgfCQkIHwgICQkIHwkJCB8ICAkJCB8IFxcX19fXyQkXFxcbiAqICAgICAkJCQkJCQgIHwkJCQkJCQkICB8ICBcXCQkJCQgIHwkJCB8XFwkJCQkJCQgIHwkJCB8ICAkJCB8JCQkJCQkJCAgfFxuICogICAgIFxcX19fX19fLyAkJCAgX19fXy8gICAgXFxfX19fLyBcXF9ffCBcXF9fX19fXy8gXFxfX3wgIFxcX198XFxfX19fX19fL1xuICogICAgICAgICAgICAgICQkIHxcbiAqICAgICAgICAgICAgICAkJCB8XG4gKiAgICAgICAgICAgICAgXFxfX3xcbiAqL1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uIGV4dGVuZHMgRk9NT0RFbGVtZW50UHJveHkge1xuICAgIGtleXNUb1VwZGF0ZSA9IFsnZmxhZ3NUb1NldCcsICdmaWxlcycsICd0eXBlRGVzY3JpcHRvciddIGFzIGNvbnN0O1xuICAgIGluaGVyaXRlZDogSW5oZXJpdGVkRk9NT0REYXRhPE9wdGlvbj47XG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGRlc3Ryb3lfKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmluaGVyaXRlZC5wYXJlbnQ/Lm9wdGlvbnMuZGVsZXRlKHRoaXMpO1xuICAgICAgICBzdXBlci5kZXN0cm95XygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX25hbWUgPSAnJztcbiAgICBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX25hbWUgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IG5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX25hbWU7IH1cblxuICAgIHByaXZhdGUgX2Rlc2NyaXB0aW9uITogc3RyaW5nO1xuICAgIHNldCBkZXNjcmlwdGlvbih2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2Rlc2NyaXB0aW9uID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247IH1cblxuICAgIHByaXZhdGUgX2ltYWdlITogc3RyaW5nO1xuICAgIHNldCBpbWFnZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2ltYWdlID0gdmFsdWU7IHRoaXMudXBkYXRlT2JqZWN0cygpOyB9IGdldCBpbWFnZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faW1hZ2U7IH1cblxuICAgIGZsYWdzVG9TZXQ6IFNldDxEZXBlbmRlbmN5RmxhZz4gPSBuZXcgU2V0KCk7XG4gICAgZmxhZ3NDb250YWluZXJzOiBSZWNvcmQ8c3RyaW5nLCBIVE1MRGl2RWxlbWVudD4gPSB7fTtcblxuICAgIGZpbGVzOiBTZXQ8RGVwZW5kZW5jeUZpbGU+ID0gbmV3IFNldCgpO1xuICAgIGZpbGVzQ29udGFpbmVyczogUmVjb3JkPHN0cmluZywgSFRNTERpdkVsZW1lbnQ+ID0ge307XG5cbiAgICBwcml2YXRlIF90eXBlRGVzY3JpcHRvciE6IE9wdGlvblN0YXRlRGVzY3JpcHRvcjtcbiAgICBzZXQgdHlwZURlc2NyaXB0b3IodmFsdWU6IE9wdGlvblN0YXRlRGVzY3JpcHRvcikgeyB0aGlzLl90eXBlRGVzY3JpcHRvciA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgdHlwZURlc2NyaXB0b3IoKTogT3B0aW9uU3RhdGVEZXNjcmlwdG9yIHsgcmV0dXJuIHRoaXMuX3R5cGVEZXNjcmlwdG9yOyB9XG5cbiAgICBjb25zdHJ1Y3Rvcihpbmhlcml0ZWQ6IEluaGVyaXRlZEZPTU9ERGF0YTxPcHRpb24+LCBpbnN0YW5jZUVsZW1lbnQ/OiBFbGVtZW50IHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKGluc3RhbmNlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuaW5oZXJpdGVkID0gaW5oZXJpdGVkO1xuXG4gICAgICAgIGNvbnN0IHR5cGVEZXNjcmlwdG9yOiBFbGVtZW50fHVuZGVmaW5lZCA9IHRoaXMuaW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgndHlwZURlc2NyaXB0b3InKVswXTtcbiAgICAgICAgdGhpcy50eXBlRGVzY3JpcHRvciA9IG5ldyBPcHRpb25TdGF0ZURlc2NyaXB0b3IodHlwZURlc2NyaXB0b3IpO1xuXG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZUVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCAnJztcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkZXNjcmlwdGlvbicpWzBdPy50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgdGhpcy5pbWFnZSA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWFnZScpWzBdPy5nZXRBdHRyaWJ1dGUoJ3BhdGgnKSB8fCAnJztcblxuICAgICAgICBjb25zdCBpbmhlcml0ZWRGb3JGbGFncyA9IHtcbiAgICAgICAgICAgIGJhc2U6IHRoaXMuaW5oZXJpdGVkLmJhc2UsXG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICBjb250YWluZXJzOiB0aGlzLmZsYWdzQ29udGFpbmVycyxcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBmbGFnIG9mIHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmbGFnJykgPz8gW10pXG4gICAgICAgICAgICB0aGlzLmZsYWdzVG9TZXQuYWRkKG5ldyBEZXBlbmRlbmN5RmxhZygnZmxhZycsIGluaGVyaXRlZEZvckZsYWdzLCBmbGFnKSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmaWxlJykgPz8gW10pXG4gICAgICAgICAgICB7fS8vIHRoaXMuZmlsZXMuYWRkKG5ldyBGb21vZEZpbGUoZmlsZSkpO1xuICAgIH1cblxuICAgIGFkZEZsYWcoeG1sRWxlbWVudD86IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgT3B0aW9uPlsxXSkge1xuICAgICAgICB0aGlzLmZsYWdzVG9TZXQuYWRkKG5ldyBEZXBlbmRlbmN5RmxhZygnZmxhZycsIHtcbiAgICAgICAgICAgIGJhc2U6IHRoaXMuaW5oZXJpdGVkLmJhc2UsXG4gICAgICAgICAgICBjb250YWluZXJzOiB0aGlzLmZsYWdzQ29udGFpbmVycyxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgfSwgeG1sRWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlV2hvbGUoKTtcbiAgICB9XG4gICAgcmVhZG9ubHkgYWRkRmxhZ19ib3VuZCA9IHRoaXMuYWRkRmxhZy5iaW5kKHRoaXMsIHVuZGVmaW5lZCk7XG5cbiAgICBvdmVycmlkZSBhc01vZHVsZVhNTChkb2N1bWVudDogWE1MRG9jdW1lbnQpOiBFbGVtZW50IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPVxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQgPz8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncGx1Z2luJyk7XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcblxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiAgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ2Rlc2NyaXB0aW9uJyk7XG4gICAgICAgIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuXG4gICAgICAgIGlmICh0aGlzLmltYWdlKSB7XG4gICAgICAgICAgICBjb25zdCBpbWFnZSA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnaW1hZ2UnKTtcblxuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdwYXRoJywgdGhpcy5pbWFnZSk7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChpbWFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLmluc3RhbmNlRWxlbWVudC5yZW1vdmVDaGlsZEJ5VGFnKCdpbWFnZScpO1xuXG4gICAgICAgIGlmICh0aGlzLmZsYWdzVG9TZXQuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGZsYWdzVG9TZXQgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ2NvbmRpdGlvbkZsYWdzJyk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZmxhZyBvZiB0aGlzLmZsYWdzVG9TZXQpIGZsYWdzVG9TZXQuYXBwZW5kQ2hpbGQoZmxhZy5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZmxhZ3NUb1NldCk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQucmVtb3ZlQ2hpbGRCeVRhZygnY29uZGl0aW9uRmxhZ3MnKTtcblxuICAgICAgICBpZiAodGhpcy5maWxlcy5zaXplID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ2ZpbGVzJyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgdGhpcy5maWxlcykgZmlsZXMuYXBwZW5kQ2hpbGQoZmlsZS5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZXMpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5mbGFnc1RvU2V0LnNpemUgPT0gMCkgeyAvLyBDcmVhdGUgYW4gZW1wdHkgYGZpbGVzYCBlbGVtZW50IGlmIHRoZXJlIGFyZSBubyBmbGFncyB0byBzZXQgdG8gY29tcGx5IHdpdGggdGhlIHNwZWNcbiAgICAgICAgICAgIGNvbnN0IGVtcHR5RmlsZXNFbGVtID0gdGhpcy5pbnN0YW5jZUVsZW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdmaWxlcycpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZW1wdHlGaWxlc0VsZW0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgLy8gRG9uJ3QgcmVtb3ZlIHRoZSBgZmlsZXNgIGVsZW1lbnQgZm9yIG5vdy4gT25jZSB0aGUgQnVpbGRlciBjYW4gcGFyc2UgZmlsZXMsIHRoaXMgd2lsbCBiZSB1bmNvbW1lbnRlZFxuICAgICAgICAvLyBlbHNlXG4gICAgICAgIC8vIHRoaXMuaW5zdGFuY2VFbGVtZW50LnJlbW92ZUNoaWxkQnlUYWcoJ2ZpbGVzJyk7XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50eXBlRGVzY3JpcHRvci5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG59XG5cbi8qKipcbiAqICAgICQkJCQkJCQkXFwgICQkJCQkJFxcICAkJFxcICAgICAgJCRcXCAgJCQkJCQkXFwgICQkJCQkJCRcXCAgICAgICAgJCQkJCQkJFxcXG4gKiAgICAkJCAgX19fX198JCQgIF9fJCRcXCAkJCRcXCAgICAkJCQgfCQkICBfXyQkXFwgJCQgIF9fJCRcXCAgICAgICAkJCAgX18kJFxcXG4gKiAgICAkJCB8ICAgICAgJCQgLyAgJCQgfCQkJCRcXCAgJCQkJCB8JCQgLyAgJCQgfCQkIHwgICQkIHwgICAgICAkJCB8ICAkJCB8ICQkJCQkJFxcICAgJCQkJCQkJFxcICAkJCQkJCRcXFxuICogICAgJCQkJCRcXCAgICAkJCB8ICAkJCB8JCRcXCQkXFwkJCAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwgICAgICAkJCQkJCQkXFwgfCBcXF9fX18kJFxcICQkICBfX19fX3wkJCAgX18kJFxcXG4gKiAgICAkJCAgX198ICAgJCQgfCAgJCQgfCQkIFxcJCQkICAkJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwgICAgICAkJCAgX18kJFxcICAkJCQkJCQkIHxcXCQkJCQkJFxcICAkJCQkJCQkJCB8XG4gKiAgICAkJCB8ICAgICAgJCQgfCAgJCQgfCQkIHxcXCQgIC8kJCB8JCQgfCAgJCQgfCQkIHwgICQkIHwgICAgICAkJCB8ICAkJCB8JCQgIF9fJCQgfCBcXF9fX18kJFxcICQkICAgX19fX3xcbiAqICAgICQkIHwgICAgICAgJCQkJCQkICB8JCQgfCBcXF8vICQkIHwgJCQkJCQkICB8JCQkJCQkJCAgfCAgICAgICQkJCQkJCQgIHxcXCQkJCQkJCQgfCQkJCQkJCQgIHxcXCQkJCQkJCRcXFxuICogICAgXFxfX3wgICAgICAgXFxfX19fX18vIFxcX198ICAgICBcXF9ffCBcXF9fX19fXy8gXFxfX19fX19fLyAgICAgICBcXF9fX19fX18vICBcXF9fX19fX198XFxfX19fX19fLyAgXFxfX19fX19ffFxuICovXG5cbmV4cG9ydCBjbGFzcyBGb21vZCBleHRlbmRzIEZPTU9ERWxlbWVudFByb3h5IHtcbiAgICBrZXlzVG9VcGRhdGUgPSBbJ2luc3RhbGxzJywgJ2NvbmRpdGlvbnMnLCAnc3RlcHMnXSBhcyBjb25zdDtcblxuICAgIHByaXZhdGUgX21ldGFOYW1lOiBzdHJpbmcgPSAnJztcbiAgICBzZXQgbWV0YU5hbWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9tZXRhTmFtZSA9IHZhbHVlO1xuICAgICAgICBpZiAod2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlLnNldHRpbmdzLmtlZXBOYW1lc1N5bmNlZCkgdGhpcy5fbW9kdWxlTmFtZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZU9iamVjdHMoKTtcbiAgICB9XG4gICAgZ2V0IG1ldGFOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhTmFtZSB8fCAod2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlLnNldHRpbmdzLmtlZXBOYW1lc1N5bmNlZCA/IHRoaXMuX21vZHVsZU5hbWUgOiAnJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbW9kdWxlTmFtZTogc3RyaW5nID0gJyc7XG4gICAgc2V0IG1vZHVsZU5hbWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9tb2R1bGVOYW1lID0gdmFsdWU7XG4gICAgICAgIGlmICh3aW5kb3cuRk9NT0RCdWlsZGVyLnN0b3JhZ2Uuc2V0dGluZ3Mua2VlcE5hbWVzU3luY2VkKSB0aGlzLl9tZXRhTmFtZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZU9iamVjdHMoKTtcbiAgICB9XG4gICAgZ2V0IG1vZHVsZU5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZHVsZU5hbWUgfHwgKHdpbmRvdy5GT01PREJ1aWxkZXIuc3RvcmFnZS5zZXR0aW5ncy5rZWVwTmFtZXNTeW5jZWQgPyB0aGlzLl9tZXRhTmFtZSA6ICcnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tZXRhSW1hZ2U6IHN0cmluZyA9ICcnO1xuICAgIHNldCBtZXRhSW1hZ2UodmFsdWU6IHN0cmluZykgeyB0aGlzLl9tZXRhSW1hZ2UgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IG1ldGFJbWFnZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbWV0YUltYWdlOyB9XG5cbiAgICBwcml2YXRlIF9tZXRhQXV0aG9yOiBzdHJpbmcgPSAnJztcbiAgICBzZXQgbWV0YUF1dGhvcih2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX21ldGFBdXRob3IgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IG1ldGFBdXRob3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX21ldGFBdXRob3I7IH1cblxuICAgIHByaXZhdGUgX21ldGFWZXJzaW9uOiBzdHJpbmcgPSAnJztcbiAgICAvKiogVGhlIG1ldGFkYXRhIHZlcnNpb24gb2YgdGhpcyBtb2QgKi9cbiAgICBzZXQgbWV0YVZlcnNpb24odmFsdWU6IHN0cmluZykgeyB0aGlzLl9tZXRhVmVyc2lvbiA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgbWV0YVZlcnNpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX21ldGFWZXJzaW9uOyB9XG5cbiAgICBwcml2YXRlIF9tZXRhSWQ6IG51bWJlcnxudWxsID0gbnVsbDtcbiAgICBzZXQgbWV0YUlkKHZhbHVlOiBudW1iZXJ8bnVsbCkgeyB0aGlzLl9tZXRhSWQgPSB2YWx1ZTsgdGhpcy51cGRhdGVPYmplY3RzKCk7IH0gZ2V0IG1ldGFJZCgpOiBudW1iZXJ8bnVsbCB7IHJldHVybiB0aGlzLl9tZXRhSWQ7IH1cblxuICAgIHByaXZhdGUgX2luZm9JbnN0YW5jZUVsZW1lbnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gICAgc2V0IGluZm9JbnN0YW5jZUVsZW1lbnQodmFsdWU6IEVsZW1lbnQgfCB1bmRlZmluZWQpIHsgdGhpcy5faW5mb0luc3RhbmNlRWxlbWVudCA9IHZhbHVlOyB0aGlzLnVwZGF0ZU9iamVjdHMoKTsgfSBnZXQgaW5mb0luc3RhbmNlRWxlbWVudCgpOiBFbGVtZW50IHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuX2luZm9JbnN0YW5jZUVsZW1lbnQ7IH1cblxuICAgIHByaXZhdGUgX21ldGFVcmw6VVJMfHN0cmluZyA9ICcnO1xuICAgIGdldCBtZXRhVXJsKCk6VVJMfHN0cmluZyB7IHJldHVybiB0aGlzLl9tZXRhVXJsOyB9IHNldCBtZXRhVXJsKHVybDpVUkx8c3RyaW5nKSB7XG4gICAgICAgIGlmICh1cmwgaW5zdGFuY2VvZiBVUkwpIHRoaXMuX21ldGFVcmwgPSB1cmw7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tZXRhVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21ldGFVcmwgPSB1cmw7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPYmplY3RzKCk7XG5cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUud2FybihgSW52YWxpZCBVUkw6IFwiJHt1cmx9XCJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFVSTEFzU3RyaW5nKCk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdGhpcy5tZXRhVXJsIGluc3RhbmNlb2YgVVJMID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFVcmwudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMubWV0YVVybDtcbiAgICB9XG5cblxuICAgIGluc3RhbGxzOiBTZXQ8SW5zdGFsbEVsZW1lbnQ+O1xuXG4gICAgY29uZGl0aW9uczogRGVwZW5kZW5jeUdyb3VwIHwgdW5kZWZpbmVkO1xuICAgIHN0ZXBzOiBTZXQ8U3RlcD47XG5cbiAgICBzb3J0aW5nT3JkZXI6IFNvcnRPcmRlciA9IHdpbmRvdy5GT01PREJ1aWxkZXIuc3RvcmFnZS5zZXR0aW5ncy5kZWZhdWx0U29ydGluZ09yZGVyO1xuXG4gICAgc3RlcENvbnRhaW5lcnM6IFJlY29yZDxzdHJpbmcsIEhUTUxEaXZFbGVtZW50PiA9IHt9O1xuXG4gICAgYWRkU3RlcCh4bWxFbGVtZW50PzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBTdGVwPlsxXSkge1xuICAgICAgICB0aGlzLnN0ZXBzLmFkZChuZXcgU3RlcCh7XG4gICAgICAgICAgICBiYXNlOiB0aGlzLFxuICAgICAgICAgICAgY29udGFpbmVyczogdGhpcy5zdGVwQ29udGFpbmVycyxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgfSwgeG1sRWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlT2JqZWN0cyh0cnVlKTtcbiAgICB9XG4gICAgcmVhZG9ubHkgYWRkU3RlcF9ib3VuZCA9IHRoaXMuYWRkU3RlcC5iaW5kKHRoaXMpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGluc3RhbmNlRWxlbWVudD86IEVsZW1lbnQsXG4gICAgICAgIGluZm9JbnN0YW5jZUVsZW1lbnQ/OiBFbGVtZW50LFxuICAgICkge1xuICAgICAgICBzdXBlcihpbnN0YW5jZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQgPSBpbmZvSW5zdGFuY2VFbGVtZW50O1xuXG4gICAgICAgIHRoaXMubWV0YU5hbWUgPSAgICBpbmZvSW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnTmFtZScpICAgICAgICAgICBbMF0/LnRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgICAgICAgPz8gJyc7XG4gICAgICAgIHRoaXMubW9kdWxlTmFtZSA9ICAgICAgaW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbW9kdWxlTmFtZScpICAgICBbMF0/LnRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgICAgICAgPz8gJyc7XG4gICAgICAgIHRoaXMubWV0YUltYWdlID0gICAgICAgaW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbW9kdWxlSW1hZ2UnKSAgICBbMF0/LmdldEF0dHJpYnV0ZSgncGF0aCcpICAgICAgICAgICAgICAgPz8gJyc7XG4gICAgICAgIHRoaXMubWV0YUF1dGhvciA9ICBpbmZvSW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnQXV0aG9yJykgICAgICAgICBbMF0/LnRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgICAgICAgPz8gJyc7XG4gICAgICAgIHRoaXMubWV0YVZlcnNpb24gPSBpbmZvSW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnVmVyc2lvbicpICAgICAgICBbMF0/LnRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgICAgICAgPz8gJyc7XG4gICAgICAgIHRoaXMubWV0YVVybCA9ICAgICBpbmZvSW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnV2Vic2l0ZScpICAgICAgICBbMF0/LnRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgICAgICAgPz8gJyc7XG5cblxuICAgICAgICBjb25zdCBbLGlkXSA9IGluZm9JbnN0YW5jZUVsZW1lbnQ/LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdJZCcpWzBdPy50ZXh0Q29udGVudD8ubWF0Y2goL15cXHMqKFxcZCspXFxzKiQvKSA/PyBbXTtcbiAgICAgICAgaWYgKGlkKSB0aGlzLm1ldGFJZCA9IHBhcnNlSW50KGlkKTtcbiAgICAgICAgZWxzZSB0aGlzLm1ldGFJZCA9IG51bGw7XG5cbiAgICAgICAgY29uc3Qgc3RlcHNFbGVtID0gaW5zdGFuY2VFbGVtZW50Py5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5zdGFsbFN0ZXBzJylbMF07XG4gICAgICAgIHRoaXMuc29ydGluZ09yZGVyID0gICAgICAgICBudWxsIHx8IHN0ZXBzRWxlbT8uZ2V0QXR0cmlidXRlKCdvcmRlcicpIGFzIFNvcnRPcmRlciB8fCAnRXhwbGljaXQnO1xuXG4gICAgICAgIHRoaXMuc3RlcHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3Qgc3RlcCBvZiAoc3RlcHNFbGVtPy5jaGlsZHJlbiA/PyBbXSkpIHRoaXMuYWRkU3RlcChzdGVwKTtcbiAgICAgICAgaWYgKHRoaXMuc3RlcHMuc2l6ZSA9PSAwKSB0aGlzLmFkZFN0ZXAoKTtcblxuICAgICAgICBjb25zdCBjb25kaXRpb25hbEluc3RhbGxzRWxlbSA9IGluc3RhbmNlRWxlbWVudD8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NvbmRpdGlvbmFsRmlsZUluc3RhbGxzJylbMF0/LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwYXR0ZXJucycpWzBdO1xuICAgICAgICBjb25zdCByZXF1aXJlZEluc3RhbGxzRWxlbSA9IGluc3RhbmNlRWxlbWVudD8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3JlcXVpcmVkSW5zdGFsbEZpbGVzJylbMF07XG4gICAgICAgIHRoaXMuaW5zdGFsbHMgPSBuZXcgU2V0KFsuLi5wYXJzZUZpbGVzKGNvbmRpdGlvbmFsSW5zdGFsbHNFbGVtKSwgLi4ucGFyc2VGaWxlcyhyZXF1aXJlZEluc3RhbGxzRWxlbSldKTtcblxuICAgICAgICBjb25zdCBtb2R1bGVEZXBlbmRlbmNpZXMgPSBpbnN0YW5jZUVsZW1lbnQ/LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtb2R1bGVEZXBlbmRlbmNpZXMnKVswXTtcbiAgICAgICAgaWYgKG1vZHVsZURlcGVuZGVuY2llcykgdGhpcy5jb25kaXRpb25zID0gbmV3IERlcGVuZGVuY3lHcm91cChtb2R1bGVEZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGFzTW9kdWxlWE1MKGRvY3VtZW50OiBYTUxEb2N1bWVudCk6IEVsZW1lbnQge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICE9PSB0aGlzLmluc3RhbmNlRWxlbWVudCkge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50ID0gZG9jdW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdjb25maWcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgneG1sbnM6eHNpJywgJ2h0dHBzOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScpO1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3hzaTpub05hbWVzcGFjZVNjaGVtYUxvY2F0aW9uJywgJ2h0dHBzOi8vcWNvbnN1bHRpbmcuY2EvZm8zL01vZENvbmZpZzUuMC54c2QnKTtcblxuICAgICAgICBjb25zdCBtb2R1bGVOYW1lID0gdGhpcy5pbnN0YW5jZUVsZW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdtb2R1bGVOYW1lJyk7XG4gICAgICAgIG1vZHVsZU5hbWUudGV4dENvbnRlbnQgPSB0aGlzLm1ldGFOYW1lO1xuICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChtb2R1bGVOYW1lKTtcblxuICAgICAgICBpZiAodGhpcy5tZXRhSW1hZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFJbWFnZSA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnbW9kdWxlSW1hZ2UnKTtcbiAgICAgICAgICAgIG1ldGFJbWFnZS5zZXRBdHRyaWJ1dGUoJ3BhdGgnLCB0aGlzLm1ldGFJbWFnZSk7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChtZXRhSW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQucmVtb3ZlQ2hpbGRCeVRhZyAgICAgKCdtb2R1bGVJbWFnZScpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmRpdGlvbnMpXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbmRpdGlvbnMuYXNNb2R1bGVYTUwoZG9jdW1lbnQsICdtb2R1bGVEZXBlbmRlbmNpZXMnKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LnJlbW92ZUNoaWxkQnlUYWcoJ21vZHVsZURlcGVuZGVuY2llcycpO1xuXG4gICAgICAgIGNvbnN0IHJlcXVpcmVkSW5zdGFsbEZpbGVzID0gdGhpcy5pbnN0YW5jZUVsZW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdyZXF1aXJlZEluc3RhbGxGaWxlcycpO1xuICAgICAgICBjb25zdCBvcHRpb25hbEluc3RhbGxMaXN0OkVsZW1lbnRbXSA9IFtdO1xuICAgICAgICAvL2ZvciAoY29uc3QgaW5zdGFsbCBvZiB0aGlzLmluc3RhbGxzKSB7XG4gICAgICAgIC8vICAgIGNvbnN0IGluc3RhbGxFbGVtID0gaW5zdGFsbC5hc01vZHVsZVhNTChkb2N1bWVudCk7XG4gICAgICAgIC8vICAgIGlmIChpbnN0YWxsLmRlcGVuZGVuY2llcy5sZW5ndGggPiAwKVxuICAgICAgICAvLyAgICAgICAgb3B0aW9uYWxEZXBlbmRlbmNpZXMucHVzaChpbnN0YWxsRWxlbSk7XG4gICAgICAgIC8vICAgIGVsc2VcbiAgICAgICAgLy8gICAgICAgIHJlcXVpcmVkSW5zdGFsbEZpbGVzLmFwcGVuZENoaWxkKGluc3RhbGxFbGVtKTtcbiAgICAgICAgLy99XG4gICAgICAgIGlmIChyZXF1aXJlZEluc3RhbGxGaWxlcy5jaGlsZHJlbi5sZW5ndGgpIHRoaXMuaW5zdGFuY2VFbGVtZW50LmFwcGVuZENoaWxkKHJlcXVpcmVkSW5zdGFsbEZpbGVzKTtcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQucmVtb3ZlQ2hpbGRCeVRhZygncmVxdWlyZWRJbnN0YWxsRmlsZXMnKTtcblxuICAgICAgICBpZiAodGhpcy5zdGVwcy5zaXplID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RlcHNDb250YWluZXIgPSB0aGlzLmluc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ2luc3RhbGxTdGVwcycpO1xuICAgICAgICAgICAgc3RlcHNDb250YWluZXIuc2V0QXR0cmlidXRlKCdvcmRlcicsIHRoaXMuc29ydGluZ09yZGVyKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBzdGVwIG9mIHRoaXMuc3RlcHMpXG4gICAgICAgICAgICAgICAgc3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RlcC5hc01vZHVsZVhNTChkb2N1bWVudCkpO1xuXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5hcHBlbmRDaGlsZChzdGVwc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZUVsZW1lbnQucmVtb3ZlQ2hpbGRCeVRhZygnaW5zdGFsbFN0ZXBzJyk7XG5cbiAgICAgICAgaWYgKG9wdGlvbmFsSW5zdGFsbExpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb25hbEZpbGVJbnN0YWxscyA9IHRoaXMuaW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnY29uZGl0aW9uYWxGaWxlSW5zdGFsbHMnKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaW5zdGFsbCBvZiBvcHRpb25hbEluc3RhbGxMaXN0KSBjb25kaXRpb25hbEZpbGVJbnN0YWxscy5hcHBlbmRDaGlsZChpbnN0YWxsKTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VFbGVtZW50LmFwcGVuZENoaWxkKGNvbmRpdGlvbmFsRmlsZUluc3RhbGxzKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlRWxlbWVudC5yZW1vdmVDaGlsZEJ5VGFnKCdjb25kaXRpb25hbEZpbGVJbnN0YWxscycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlRWxlbWVudDtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBhc0luZm9YTUwoZG9jdW1lbnQ6IFhNTERvY3VtZW50KTogRWxlbWVudCB7XG4gICAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IHRoaXMuaW5mb0luc3RhbmNlRWxlbWVudCkge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuaW5mb0luc3RhbmNlRWxlbWVudCA9IGRvY3VtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnZm9tb2QnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBzY2hlbWEgaW5mb1xuICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd4bWxuczp4c2knLCAnaHR0cHM6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyk7XG4gICAgICAgIGlmICh3aW5kb3cuRk9NT0RCdWlsZGVyLnN0b3JhZ2Uuc2V0dGluZ3MuaW5jbHVkZUluZm9TY2hlbWEpXG4gICAgICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd4c2k6bm9OYW1lc3BhY2VTY2hlbWFMb2NhdGlvbicsICdodHRwczovL3Rlc3RpbmcuYmVsbGN1YmUuZGV2L2Fzc2V0cy9zaXRlL21pc2MvSW5mby54c2QnKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5pbmZvSW5zdGFuY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgneHNpOm5vTmFtZXNwYWNlU2NoZW1hTG9jYXRpb24nKSA9PT0gJ2h0dHBzOi8vdGVzdGluZy5iZWxsY3ViZS5kZXYvYXNzZXRzL3NpdGUvbWlzYy9JbmZvLnhzZCcpXG4gICAgICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd4c2k6bm9OYW1lc3BhY2VTY2hlbWFMb2NhdGlvbicpO1xuXG4gICAgICAgIC8vIFNldCBhY3R1YWwgZGF0YVxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmdldFVSTEFzU3RyaW5nKCk7XG4gICAgICAgIGlmICh0aGlzLm1ldGFOYW1lKSAgICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdOYW1lJykudGV4dENvbnRlbnQgICAgPSB0aGlzLm1ldGFOYW1lO1xuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmZvSW5zdGFuY2VFbGVtZW50LnJlbW92ZUNoaWxkQnlUYWcgICAgICgnTmFtZScpO1xuXG4gICAgICAgIGlmICh0aGlzLm1ldGFBdXRob3IpICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQuZ2V0T3JDcmVhdGVDaGlsZEJ5VGFnKCdBdXRob3InKS50ZXh0Q29udGVudCAgPSB0aGlzLm1ldGFBdXRob3I7XG4gICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZm9JbnN0YW5jZUVsZW1lbnQucmVtb3ZlQ2hpbGRCeVRhZyAgICAgKCdBdXRob3InKTtcblxuICAgICAgICBpZiAodGhpcy5tZXRhSWQgIT09IG51bGwpICAgdGhpcy5pbmZvSW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnSWQnKS50ZXh0Q29udGVudCAgICAgID0gdGhpcy5tZXRhSWQudG9TdHJpbmcoKTtcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb0luc3RhbmNlRWxlbWVudC5yZW1vdmVDaGlsZEJ5VGFnICAgICAoJ0lkJyk7XG5cbiAgICAgICAgaWYgKHVybCkgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb0luc3RhbmNlRWxlbWVudC5nZXRPckNyZWF0ZUNoaWxkQnlUYWcoJ1dlYnNpdGUnKS50ZXh0Q29udGVudCA9IHVybDtcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb0luc3RhbmNlRWxlbWVudC5yZW1vdmVDaGlsZEJ5VGFnICAgICAoJ1dlYnNpdGUnKTtcblxuICAgICAgICBpZiAodGhpcy5tZXRhVmVyc2lvbikgICAgICAgdGhpcy5pbmZvSW5zdGFuY2VFbGVtZW50LmdldE9yQ3JlYXRlQ2hpbGRCeVRhZygnVmVyc2lvbicpLnRleHRDb250ZW50ID0gdGhpcy5tZXRhVmVyc2lvbjtcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb0luc3RhbmNlRWxlbWVudC5yZW1vdmVDaGlsZEJ5VGFnICAgICAoJ1ZlcnNpb24nKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pbmZvSW5zdGFuY2VFbGVtZW50O1xuICAgIH1cbn1cbiJdfQ==