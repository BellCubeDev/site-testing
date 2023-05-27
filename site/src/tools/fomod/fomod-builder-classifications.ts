import * as main from './fomod-builder.js'; // Brings in global things
import { UpdatableObject, getSetIndex, wait } from '../../universal.js';

import * as ui from './fomod-builder-ui.js';

/*x eslint-disable i18n-text/no-en */// FOMODs are XML files with a schema written in English, so disallowing English makes little sense.

/** Function to pass into JSON.stringify to handle FOMODs */
function JsonStringifyFomod(key: string, value: any) {
    // Blacklisted Keys (generated at runtime or would cause recursion)
    if (key === 'inherited') return undefined;
    if (key === 'instanceElement') return undefined;
    if (key === 'objectsToUpdate') return undefined;
    if (key === 'suppressUpdates') return undefined;
    if (key === 'updateObjects') return undefined;

    // Blacklisted Value Types
    if (typeof value === 'function') return undefined;

    // Internal keys (start with _)
    if (key.startsWith('_')) return undefined;

    // Map & Set support
    if (value instanceof Set) return Array.from(value);
    if (value instanceof Map) return Object.fromEntries(value.entries());

    return value;
}

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap
*/

/***
 *    $$$$$$$$\ $$\                                               $$\
 *    $$  _____|$$ |                                              $$ |
 *    $$ |      $$ | $$$$$$\  $$$$$$\$$$$\   $$$$$$\  $$$$$$$\  $$$$$$\    $$$$$$$\
 *    $$$$$\    $$ |$$  __$$\ $$  _$$  _$$\ $$  __$$\ $$  __$$\ \_$$  _|  $$  _____|
 *    $$  __|   $$ |$$$$$$$$ |$$ / $$ / $$ |$$$$$$$$ |$$ |  $$ |  $$ |    \$$$$$$\
 *    $$ |      $$ |$$   ____|$$ | $$ | $$ |$$   ____|$$ |  $$ |  $$ |$$\  \____$$\
 *    $$$$$$$$\ $$ |\$$$$$$$\ $$ | $$ | $$ |\$$$$$$$\ $$ |  $$ |  \$$$$  |$$$$$$$  |
 *    \________|\__| \_______|\__| \__| \__| \_______|\__|  \__|   \____/ \_______/
 */

/** A map of FOMODElementProxy classes and the classes they should create alongside themselves for update purposes */
export const UpdateObjects = new Map<FOMODElementProxy|Function, ({new(param: any): UpdatableObject} & Omit<typeof UpdatableObject, 'new'>)[]>();
export function addUpdateObjects<TClass extends Omit<typeof FOMODElementProxy, 'new'> & {new(...any:any):any}>(obj: TClass, ...updatables: ({new(param: InstanceType<TClass>): UpdatableObject} & Omit<typeof UpdatableObject, 'new'>)[]) {
    UpdateObjects.get(obj)?.push(...updatables) ||
    UpdateObjects.set(obj, updatables);
}

export abstract class FOMODElementProxy extends UpdatableObject {
    instanceElement: Element | undefined;

    /** @type readonly (keyof this)[] */
    abstract keysToUpdate: readonly string[];

    objectsToUpdate: UpdatableObject[] = [];

    propagateToChildren_wasTrue = false;
    updateObjects(propagateToChildren = false) {
        if (!this) return; // function sometimes gets called in the constructor - update will be called in a microtask later.

        this.propagateToChildren_wasTrue ||= propagateToChildren;
        queueMicrotask(()=>  this.propagateToChildren_wasTrue = false  );

        // If propagateToChildren is true,
        // we know that it didn't come from an actual update--so let's go through the update API this time
        // Don't worry - when the update goes through, it'll just call this function again, but this time it'll be false
        if (propagateToChildren) return this.update();

        for (const object of this.objectsToUpdate) {
            if (object instanceof FOMODElementProxy) object.updateObjects(true);
            else object.update();
        }

        if (this.propagateToChildren_wasTrue) for (const key of this.keysToUpdate) {
            if (  !(key in this)  ) return console.error(`Key ${key} not found in ${this.constructor.name}`, this);
            const obj = this[key as keyof this];

            if (obj instanceof UpdatableObject) obj.update();
            else if (obj instanceof Set || obj instanceof Array) {
                for (const nestedObject of obj) {
                    if (nestedObject instanceof FOMODElementProxy) nestedObject.updateObjects(true);
                    else if (nestedObject instanceof UpdatableObject) nestedObject.update();
                }
            }
        }

        ui.autoSave();
    }

    override update_() { this.updateObjects(); }

    override destroy() {
        super.destroy();
        this.instanceElement?.remove();
    }

    updateWhole() {
        if (  !('inherited' in this && this.inherited && typeof this.inherited === 'object')  ) return this.updateObjects(true);

        if ('base' in this.inherited && this.inherited.base && this.inherited.base instanceof FOMODElementProxy) this.inherited.base.updateObjects(true);
        else if ('parent' in this.inherited && this.inherited.parent && this.inherited.parent instanceof FOMODElementProxy) this.inherited.parent.updateObjects(true);

        this.updateObjects(true);
    }

    protected override destroy_(): void {
        this.objectsToUpdate.forEach(  (obj) => obj.destroy()  );
        if ('steps' in this && this.steps instanceof Set) this.steps.forEach(  (step) => step.destroy()  );
        if ('groups' in this && this.groups instanceof Set) this.groups.forEach(  (group) => group.destroy()  );
        if ('options' in this && this.options instanceof Set) this.options.forEach(  (option) => option.destroy()  );

        this.updateWhole();
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

interface InheritedFOMODData<TType extends Step|Group|Option|DependencyBase> {
    base?: Fomod,
    parent?: TType extends Step ? Fomod
        : TType extends Group ? Step
        : TType extends Option ? Group
        /* TT extends Dependency */ : Option,
    containers?: Record<string, HTMLDivElement>,
}

/***
 *    $$$$$$$$\ $$\
 *    $$  _____|$$ |
 *    $$ |      $$ | $$$$$$\   $$$$$$\   $$$$$$$\
 *    $$$$$\    $$ | \____$$\ $$  __$$\ $$  _____|
 *    $$  __|   $$ | $$$$$$$ |$$ /  $$ |\$$$$$$\
 *    $$ |      $$ |$$  __$$ |$$ |  $$ | \____$$\
 *    $$ |      $$ |\$$$$$$$ |\$$$$$$$ |$$$$$$$  |
 *    \__|      \__| \_______| \____$$ |\_______/
 *                            $$\   $$ |
 *                            \$$$$$$  |
 *                             \______/
 */

declare global { interface Window {  flags: Record<string, Flag>;  flagClass: typeof Flag;  } }
window.flags = {};

export class Flag {
    name: string;

    getters: Set<DependencyFlag>;
    gettersByValue: Record<string, Set<DependencyFlag>>;

    setters: Set<DependencyFlag>;
    settersByValue: Record<string, Set<DependencyFlag>>;

    private cachedValues: Map<DependencyFlag, string>;
    private static cachedNames: Map<DependencyFlag, string> = new Map();

    static get(name: string): Flag { return window.flags[name] ?? new Flag(name); }
    checkValidity() { if (this.setters.size === 0 && this.getters.size === 0) delete window.flags[this.name]; }

    private constructor(name: string) {
        if (window.flags[name]) throw new Error(`Flag ${name} already exists!`);
        this.name = name;
        window.flags[name] = this;

        this.getters = new Set();
        this.setters = new Set();
        this.gettersByValue = {};
        this.settersByValue = {};
        this.cachedValues = new Map();

        queueMicrotask(this.checkValidity.bind(this));
    }

    get values(): Set<string> {
        const values = new Set<string>();
        for (const getter of this.getters) values.add(getter.value);
        return values;
    }

    updateSetter(setter: DependencyFlag) {
        if (setter.flag !== this.name) {
            this.setters.delete(setter);

            const oldValue = this.cachedValues.get(setter);
            if (oldValue) this.settersByValue[oldValue]?.delete(setter);
            this.cachedValues.delete(setter);

            this.checkValidity();
            return;
        }


        const oldValue = this.cachedValues.get(setter);
        if (oldValue !== setter.value) {
            if (oldValue !== undefined) {
                if (!this.settersByValue[oldValue]) this.settersByValue[oldValue] = new Set();

                this.settersByValue[oldValue]!.delete(setter);
                if (this.settersByValue[oldValue]!.size === 0) delete this.settersByValue[oldValue];
            }

            if (!this.settersByValue[setter.value]) this.settersByValue[setter.value] = new Set();
            this.settersByValue[setter.value]!.add(setter);
        }

        this.cachedValues.set(setter, setter.value);
        this.setters.add(setter);
    }

    updateGetter(getter: DependencyFlag) {
        if (getter.flag !== this.name) {
            this.getters.delete(getter);

            const oldValue = this.cachedValues.get(getter);
            if (oldValue) this.gettersByValue[oldValue]?.delete(getter);
            this.cachedValues.delete(getter);

            this.checkValidity();
            return;
        }

        const oldValue = this.cachedValues.get(getter);
        if (oldValue !== getter.value) {
            if (oldValue !== undefined) {
                if (!this.gettersByValue[oldValue]) this.gettersByValue[oldValue] = new Set();

                this.gettersByValue[oldValue]!.delete(getter);
                if (this.gettersByValue[oldValue]!.size === 0) delete this.gettersByValue[oldValue];
            }

            if (!this.gettersByValue[getter.value]) this.gettersByValue[getter.value] = new Set();
            this.gettersByValue[getter.value]!.add(getter);
        }

        this.cachedValues.set(getter, getter.value);
        this.getters.add(getter);
    }

    removeItem(item: DependencyFlag) {
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

    static removeItem(item: DependencyFlag) {
        const oldName = Flag.cachedNames.get(item);
        if (oldName !== undefined) Flag.get(oldName).removeItem(item);
        Flag.cachedNames.delete(item);
    }

    static updateSetter(setter: DependencyFlag) {
        const oldName = Flag.cachedNames.get(setter);
        if (oldName !== setter.flag) {
            if (oldName !== undefined) Flag.get(oldName).updateSetter(setter);
            Flag.cachedNames.set(setter, setter.flag);
        }

        Flag.get(setter.flag).updateSetter(setter);
    }

    static updateGetter(getter: DependencyFlag) {
        const oldName = Flag.cachedNames.get(getter);
        if (oldName !== getter.flag) {
            if (oldName !== undefined) Flag.get(oldName).updateGetter(getter);
            Flag.cachedNames.set(getter, getter.flag);
        }

        Flag.get(getter.flag).updateGetter(getter);
    }

}
window.flagClass = Flag;


/***
 *     $$$$$$\                            $$\ $$\   $$\     $$\
 *    $$  __$$\                           $$ |\__|  $$ |    \__|
 *    $$ /  \__| $$$$$$\  $$$$$$$\   $$$$$$$ |$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\
 *    $$ |      $$  __$$\ $$  __$$\ $$  __$$ |$$ |\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
 *    $$ |      $$ /  $$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\
 *    $$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\
 *    \$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
 *     \______/  \______/ \__|  \__| \_______|\__|   \____/ \__| \______/ \__|  \__|\_______/
 */

export type Dependency = DependencyBase | Option;

export abstract class DependencyBase extends FOMODElementProxy {
    keysToUpdate = [];
    constructor(instanceElement: Element | undefined = undefined) {
        super(instanceElement);
    }

    abstract override asModuleXML(document: XMLDocument): Element;
}



export abstract class DependencyBaseVersionCheck extends DependencyBase {
    private _version = '';
    set version(value: string) { this._version = value; this.updateObjects(); } get version(): string { return this._version; }
}

export type DependencyGroupOperator = 'And' | 'Or';
export class DependencyGroup extends DependencyBase {
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

        if (parseChildren) this.parseDependencies();
    }

    private async parseDependencies(){
        if (!this.instanceElement) return;

        for (const child of this.instanceElement.children)
            this.children.push(await parseDependency(child));

        queueMicrotask(() => this.update());
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

export type DependencyFileState = 'Active' | 'Inactive' | 'Missing';
export type DependencyFlagTags = 'flag' | 'flagDependency';
export class DependencyFlag extends DependencyBase {
    private _flag = '';
    set flag(value: string) { this._flag = value; this.update(); } get flag(): string { return this._flag; }

    private _value = '';
    set value(value: string) { this._value = value; this.update(); } get value(): string { return this._value; }

    readonly type:DependencyFlagTags;
    readonly inherited?: InheritedFOMODData<DependencyBase>;

    constructor(type: DependencyFlagTags, inherited?: InheritedFOMODData<DependencyBase>, instanceElement: Element | undefined = undefined) {
        super(instanceElement);
        this.type = type;
        this.inherited = inherited;
        if (instanceElement) {
            this.flag = instanceElement.getAttribute('name') ?? '';
            this.value = instanceElement.getAttribute('value') || instanceElement.textContent || '';
        }
    }

    override update_() {
        if (!this.inherited) return;

        if (this.type === 'flagDependency') Flag.updateGetter(this);
        else if (this.inherited.parent) Flag.updateSetter(this);
    }

    protected override destroy_(): void {
        if (!this.inherited) return;

        Flag.removeItem(this);
        this.inherited.parent?.flagsToSet.delete(this);

        super.destroy_();
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
export class DependencyFile extends DependencyBase {
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

async function parseDependency(dependency: Element, inherited?: InheritedFOMODData<DependencyBase>): Promise<Dependency> {
    const type = dependency.tagName;
    switch (type) {
        case 'dependencies':
            return new DependencyGroup(dependency, undefined, true);
        case 'fileDependency':
            return new DependencyFile(dependency);
        case 'flagDependency':
            if (dependency.previousSibling?.nodeType !== Node.COMMENT_NODE || !inherited?.base) return new DependencyFlag('flagDependency', inherited, dependency);

            // eslint-disable-next-line no-case-declarations
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

async function parseOptionDependency(stepNumStr: string|undefined, groupNumStr: string|undefined, optionNumStr: string|undefined, base: Fomod): Promise<Option | null> {
    if (!stepNumStr || !groupNumStr || !optionNumStr) return null;
    while (ui.loadingFomod.state) await wait(5);

    const step = getSetIndex(base.steps, parseInt(stepNumStr));
    const group = step ? getSetIndex(step.groups, parseInt(groupNumStr)) : null;
    const option = group ? getSetIndex(group.options, parseInt(optionNumStr)) : null;

    return option ?? null;
}

/***
 *     $$$$$$\              $$\     $$\                  $$$$$$\    $$\                 $$\
 *    $$  __$$\             $$ |    $  |                $$  __$$\   $$ |                $$ |
 *    $$ /  $$ | $$$$$$\  $$$$$$\   \_/ $$$$$$$\        $$ /  \__|$$$$$$\    $$$$$$\  $$$$$$\    $$$$$$\
 *    $$ |  $$ |$$  __$$\ \_$$  _|      $$  __$$\       \$$$$$$\  \_$$  _|   \____$$\ \_$$  _|  $$  __$$\
 *    $$ |  $$ |$$ /  $$ |  $$ |        $$ |  $$ |       \____$$\   $$ |     $$$$$$$ |  $$ |    $$$$$$$$ |
 *    $$ |  $$ |$$ |  $$ |  $$ |$$\     $$ |  $$ |      $$\   $$ |  $$ |$$\ $$  __$$ |  $$ |$$\ $$   ____|
 *     $$$$$$  |$$$$$$$  |  \$$$$  |    $$ |  $$ |      \$$$$$$  |  \$$$$  |\$$$$$$$ |  \$$$$  |\$$$$$$$\
 *     \______/ $$  ____/    \____/     \__|  \__|       \______/    \____/  \_______|   \____/  \_______|
 *              $$ |
 *              $$ |
 *              \__|
 *    $$$$$$$\                                          $$\             $$\
 *    $$  __$$\                                         \__|            $$ |
 *    $$ |  $$ | $$$$$$\   $$$$$$$\  $$$$$$$\  $$$$$$\  $$\  $$$$$$\  $$$$$$\    $$$$$$\   $$$$$$\   $$$$$$$\
 *    $$ |  $$ |$$  __$$\ $$  _____|$$  _____|$$  __$$\ $$ |$$  __$$\ \_$$  _|  $$  __$$\ $$  __$$\ $$  _____|
 *    $$ |  $$ |$$$$$$$$ |\$$$$$$\  $$ /      $$ |  \__|$$ |$$ /  $$ |  $$ |    $$ /  $$ |$$ |  \__|\$$$$$$\
 *    $$ |  $$ |$$   ____| \____$$\ $$ |      $$ |      $$ |$$ |  $$ |  $$ |$$\ $$ |  $$ |$$ |       \____$$\
 *    $$$$$$$  |\$$$$$$$\ $$$$$$$  |\$$$$$$$\ $$ |      $$ |$$$$$$$  |  \$$$$  |\$$$$$$  |$$ |      $$$$$$$  |
 *    \_______/  \_______|\_______/  \_______|\__|      \__|$$  ____/    \____/  \______/ \__|      \_______/
 *                                                          $$ |
 *                                                          $$ |
 *                                                          \__|
 */

export type OptionState =
    | 'Optional'        // Unchecked but checkable
    | 'Recommended'     // Checked but uncheckable
    | 'CouldBeUseable'  // TODO: Check if this has a use - UPDATE: No use in Vortex
    | 'Required'        // Permanently checked
    | 'NotUseable';     // Permanently unchecked
export class OptionStateDescriptor extends FOMODElementProxy {
    keysToUpdate = ['conditions'] as const;

    private _defaultState: OptionState = 'Optional';
    set defaultState(value: OptionState) { this._defaultState = value; this.updateObjects(); } get defaultState(): OptionState { return this._defaultState; }

    conditions: OptionStateConditionStatement[] = [];

    constructor(
        instanceElement?: Element,
        defaultState: OptionState = 'Optional',
        conditions: OptionStateConditionStatement[] = []
    ) {
        super(instanceElement);
        this.defaultState = defaultState;
        this.conditions = conditions;

        const basicElement = instanceElement?.getElementsByTagName('type')[0];
        const complexElement = instanceElement?.getElementsByTagName('dependencyType')[0];

        if (basicElement) {
            this.defaultState = basicElement.getAttribute('name') as OptionState;

        }

        if (complexElement) {
            const defaultTypeElement = complexElement.getElementsByTagName('defaultType')[0];
            if (defaultTypeElement) this.defaultState = defaultTypeElement.getAttribute('name') as OptionState || 'Optional';

            const patternElement = complexElement.getElementsByTagName('patterns')[0];
            for (const dependency of patternElement?.children || [])
                this.conditions.push(new OptionStateConditionStatement(dependency));
        }
    }

    override asModuleXML(document: XMLDocument): Element {
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

        complexElement = this.instanceElement.getOrCreateChildByTag('dependencyType')  ;
        this.instanceElement.appendChild(complexElement);

        const complexTypeElement = complexElement.getOrCreateChildByTag('defaultType');
        complexTypeElement.setAttribute('default', this.defaultState);
        complexElement.appendChild(complexTypeElement);

        const complexPatternElement = complexElement.getOrCreateChildByTag('patterns');
        for (const dependency of this.conditions)
            complexPatternElement.appendChild(  dependency.asModuleXML(document) );
        complexElement.appendChild(complexPatternElement);

        return this.instanceElement;
    }
}

export class OptionStateConditionStatement extends FOMODElementProxy {
    keysToUpdate = ['dependencies'] as const;

    private _type: OptionState = 'Optional';
    set type(value: OptionState) { this._type = value; this.updateObjects(); } get type(): OptionState { return this._type; }

    private _typeElement: Element | undefined = undefined;
    set typeElement(value: Element | undefined) { this._typeElement = value; this.updateObjects(); } get typeElement(): Element | undefined { return this._typeElement; }

    private _dependencies!: DependencyGroup;
    set dependencies(value: DependencyGroup) { this._dependencies = value; this.updateObjects(); } get dependencies(): DependencyGroup { return this._dependencies; }

    constructor(instanceElement?: Element, dependency?: DependencyGroup, type: OptionState = 'Optional') {
        super(instanceElement);
        this.dependencies = dependency ?? new DependencyGroup();
        this.type = type;
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement =
            this.instanceElement ?? document.createElement('pattern');

        this.typeElement = this.typeElement
                                    ?? this.instanceElement.appendChild(document.createElement('type'));
        this.typeElement.setAttribute('name', this.type);

        this.instanceElement.appendChild(this.dependencies.asModuleXML(document));

        return this.instanceElement;
    }
}

/***
 *    $$$$$$\                       $$\               $$\ $$\
 *    \_$$  _|                      $$ |              $$ |$$ |
 *      $$ |  $$$$$$$\   $$$$$$$\ $$$$$$\    $$$$$$\  $$ |$$ | $$$$$$$\
 *      $$ |  $$  __$$\ $$  _____|\_$$  _|   \____$$\ $$ |$$ |$$  _____|
 *      $$ |  $$ |  $$ |\$$$$$$\    $$ |     $$$$$$$ |$$ |$$ |\$$$$$$\
 *      $$ |  $$ |  $$ | \____$$\   $$ |$$\ $$  __$$ |$$ |$$ | \____$$\
 *    $$$$$$\ $$ |  $$ |$$$$$$$  |  \$$$$  |\$$$$$$$ |$$ |$$ |$$$$$$$  |
 *    \______|\__|  \__|\_______/    \____/  \_______|\__|\__|\_______/
 */


export const installs = new Set<InstallElement>();

function parseFiles(elem: Element|undefined): InstallElement[] {
    const localInstalls: InstallElement[] = [];
    if (!elem) return localInstalls;

    const dependenciesElem = elem.getElementsByTagName('dependencies')[0];
    const filesElem = elem.getElementsByTagName('files')[0] || elem;

    let dependencies: DependencyGroup|undefined = undefined;
    if (dependenciesElem) dependencies = new DependencyGroup(dependenciesElem);

    for (const file of filesElem.children) {
        const install = new InstallElement(file, dependencies);
        localInstalls.push(install);
        installs.add(install);
    }

    return localInstalls;
}

export class InstallElement extends FOMODElementProxy {
    keysToUpdate = ['dependencies'] as const;

    private _source: string[] = [];
    set source(value: string[]) { this._source = value; this.updateObjects(); } get source(): string[] { return this._source; }

    private _destination: string[] = [];
    set destination(value: string[]) { this._destination = value; this.updateObjects(); } get destination(): string[] { return this._destination; }

    dependencies: DependencyGroup|null = null;

    private _priority: number = 0;
    set priority(value: number) { this._priority = value; this.updateObjects(); } get priority(): number { return this._priority; }

    async updateFile(pathOrFile: string|string[] | FileSystemHandle): Promise<void> {

        if (pathOrFile instanceof FileSystemHandle) pathOrFile = await window.FOMODBuilder.directory?.handle.resolve(pathOrFile) ?? '';
        if (pathOrFile instanceof File)
        if (typeof pathOrFile === 'string') pathOrFile = pathOrFile.replace(/\\/g, '/').split('/');
        if ( !(pathOrFile instanceof Array) ) throw new Error('Could not resolve path - most likely outside of the root directory');


        this.source = pathOrFile;
    }

    /** Can be one of the following:
        <file source="123" priority="0" destination="123" installIfUsable="true" alwaysInstall="true" />
        <folder source="123" priority="0" destination="123" installIfUsable="true" alwaysInstall="true" />
    */
    constructor(instanceElement?: Element, dependencies?: DependencyGroup) {
        super(instanceElement);

        installs.add(this);

        this.dependencies = dependencies ?? null;

        if (!instanceElement) return;

        this.source = instanceElement.getAttribute('source')?.split(/[/\\]/) ?? [];
        this.destination = instanceElement.getAttribute('destination')?.split(/[/\\]/) ?? [];
    }

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement ??= document.createElement('install');

        const path = this.source.join('/');
        const isFolder = this.source[this.source.length - 1] === '';

        this.instanceElement.appendChild(
            document.createElement(isFolder ? 'folder' : 'file')
        ).textContent = isFolder ? path.slice(0, -1) : path;

        return this.instanceElement;
    }
}

/***
 *     $$$$$$\    $$\
 *    $$  __$$\   $$ |
 *    $$ /  \__|$$$$$$\    $$$$$$\   $$$$$$\   $$$$$$$\
 *    \$$$$$$\  \_$$  _|  $$  __$$\ $$  __$$\ $$  _____|
 *     \____$$\   $$ |    $$$$$$$$ |$$ /  $$ |\$$$$$$\
 *    $$\   $$ |  $$ |$$\ $$   ____|$$ |  $$ | \____$$\
 *    \$$$$$$  |  \$$$$  |\$$$$$$$\ $$$$$$$  |$$$$$$$  |
 *     \______/    \____/  \_______|$$  ____/ \_______/
 *                                  $$ |
 *                                  $$ |
 *                                  \__|
 */

export type SortOrder =
    | 'Ascending'  // Alphabetical
    | 'Descending' // Reverse Alphabetical
    | 'Explicit';  // Explicit order

export class Step extends FOMODElementProxy {
    keysToUpdate = ['groups', 'conditions'] as const;
    inherited: InheritedFOMODData<Step>;

    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _sortingOrder: SortOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    set sortingOrder(value: SortOrder) { this._sortingOrder = value; this.updateObjects(); } get sortingOrder(): SortOrder { return this._sortingOrder; }

    groups: Set<Group>;

    groupContainers: Record<string, HTMLDivElement> = {};

    conditions: DependencyGroup | undefined;

    addGroup(xmlElement?: ConstructorParameters<typeof Group>[1]) {
        this.groups.add(new Group({
            base: this.inherited.base,
            containers: this.groupContainers,
            parent: this,
        }, xmlElement));

        this.updateWhole();
    }
    readonly addGroup_bound = this.addGroup.bind(this);

    protected override destroy_() {
        if (this.inherited.parent && this.inherited.parent.steps.size == 1) return false;

        this.inherited.parent?.steps.delete(this);
        super.destroy_();

        return true;
    }


    constructor(inherited: InheritedFOMODData<Step>, instanceElement?: Element | undefined) {
        super(instanceElement);
        this.inherited = inherited;
        this.groups = new Set();

        if (this.instanceElement) {
            this.name = this.instanceElement.getAttribute('name') ?? '';

            const groupsElem = this.instanceElement.getElementsByTagName('optionalFileGroups')[0];
            if (groupsElem) {
                this.sortingOrder = groupsElem.getAttribute('order') as SortOrder || window.FOMODBuilder.storage.settings.defaultSortingOrder;

                for (const group of groupsElem.children ?? [])
                    this.addGroup(group);
            }
        }

        if (this.groups.size == 0) this.addGroup();
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

/***
 *     $$$$$$\
 *    $$  __$$\
 *    $$ /  \__| $$$$$$\   $$$$$$\  $$\   $$\  $$$$$$\   $$$$$$$\
 *    $$ |$$$$\ $$  __$$\ $$  __$$\ $$ |  $$ |$$  __$$\ $$  _____|
 *    $$ |\_$$ |$$ |  \__|$$ /  $$ |$$ |  $$ |$$ /  $$ |\$$$$$$\
 *    $$ |  $$ |$$ |      $$ |  $$ |$$ |  $$ |$$ |  $$ | \____$$\
 *    \$$$$$$  |$$ |      \$$$$$$  |\$$$$$$  |$$$$$$$  |$$$$$$$  |
 *     \______/ \__|       \______/  \______/ $$  ____/ \_______/
 *                                            $$ |
 *                                            $$ |
 *                                            \__|
 */

export type GroupSelectType =
    | 'SelectAll'           // Force-selects all options
    | 'SelectAny'           // Allows users to select any number of options
    | 'SelectAtMostOne'     // Requires users to select one or no options
    | 'SelectAtLeastOne'    // Requires users to select at least one option
    | 'SelectExactlyOne';   // Requires users to select exactly one option
export class Group extends FOMODElementProxy {
    keysToUpdate = ['options'] as const;
    inherited: InheritedFOMODData<Group>;

    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _type: GroupSelectType = window.FOMODBuilder.storage.settings.defaultGroupSelectType;
    set type(value: GroupSelectType) { this._type = value; this.updateObjects(); } get type(): GroupSelectType { return this._type; }

    private _sortingOrder: SortOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;
    set sortingOrder(value: SortOrder) { this._sortingOrder = value; this.updateObjects(); } get sortingOrder(): SortOrder { return this._sortingOrder; }

    options: Set<Option>;

    optionContainers: Record<string, HTMLDivElement> = {};

    addOption(xmlElement?: ConstructorParameters<typeof Option>[1]) {
        this.options.add(new Option({
            base: this.inherited.base,
            containers: this.optionContainers,
            parent: this,
        }, xmlElement));

        this.updateWhole();
    }
    readonly addOption_bound = this.addOption.bind(this);

    protected override destroy_(): void {
        this.inherited.parent?.groups.delete(this);
        super.destroy_();
    }

    constructor(inherited: InheritedFOMODData<Group>, instanceElement?: Element | undefined) {
        super(instanceElement);
        this.inherited = inherited;
        this.options = new Set();

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

        if (this.options.size == 0) this.addOption();
    }

    // <group name="Banana Types" type="SelectAny">
    // <plugins order="Explicit">

    override asModuleXML(document: XMLDocument): Element {
        this.instanceElement = this.instanceElement ?? document.createElement('group');

        this.instanceElement.setAttribute('name', this.name);
        this.instanceElement.setAttribute('type', this.type);

        if (this.options.size > 0) {
            const options = this.instanceElement.getOrCreateChildByTag('plugins');
            options.setAttribute('order', this.sortingOrder);

            for (const option of this.options) options.appendChild(option.asModuleXML(document));
        } else
            this.instanceElement.removeChildByTag('plugins');

        return this.instanceElement;
    }
}

/***
 *     $$$$$$\              $$\     $$\
 *    $$  __$$\             $$ |    \__|
 *    $$ /  $$ | $$$$$$\  $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\
 *    $$ |  $$ |$$  __$$\ \_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
 *    $$ |  $$ |$$ /  $$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\
 *    $$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\
 *     $$$$$$  |$$$$$$$  |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
 *     \______/ $$  ____/    \____/ \__| \______/ \__|  \__|\_______/
 *              $$ |
 *              $$ |
 *              \__|
 */

export class Option extends FOMODElementProxy {
    keysToUpdate = ['flagsToSet', 'files', 'typeDescriptor'] as const;
    inherited: InheritedFOMODData<Option>;
    protected override destroy_(): void {
        this.inherited.parent?.options.delete(this);
        super.destroy_();
    }

    private _name = '';
    set name(value: string) { this._name = value; this.updateObjects(); } get name(): string { return this._name; }

    private _description!: string;
    set description(value: string) { this._description = value; this.updateObjects(); } get description(): string { return this._description; }

    private _image!: string;
    set image(value: string) { this._image = value; this.updateObjects(); } get image(): string { return this._image; }

    flagsToSet: Set<DependencyFlag> = new Set();
    flagsContainers: Record<string, HTMLDivElement> = {};

    files: Set<DependencyFile> = new Set();
    filesContainers: Record<string, HTMLDivElement> = {};

    private _typeDescriptor!: OptionStateDescriptor;
    set typeDescriptor(value: OptionStateDescriptor) { this._typeDescriptor = value; this.updateObjects(); } get typeDescriptor(): OptionStateDescriptor { return this._typeDescriptor; }

    constructor(inherited: InheritedFOMODData<Option>, instanceElement?: Element | undefined) {
        super(instanceElement);
        this.inherited = inherited;

        const typeDescriptor: Element|undefined = this.instanceElement?.getElementsByTagName('typeDescriptor')[0];
        this.typeDescriptor = new OptionStateDescriptor(typeDescriptor);

        if (!this.instanceElement) return;

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

        for (const file of this.instanceElement.getElementsByTagName('file') ?? [])
            {}// this.files.add(new FomodFile(file));
    }

    addFlag(xmlElement?: ConstructorParameters<typeof Option>[1]) {
        this.flagsToSet.add(new DependencyFlag('flag', {
            base: this.inherited.base,
            containers: this.flagsContainers,
            parent: this,
        }, xmlElement));

        this.updateWhole();
    }
    readonly addFlag_bound = this.addFlag.bind(this, undefined);

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

        if (this.flagsToSet.size > 0) {
            const flagsToSet = this.instanceElement.getOrCreateChildByTag('conditionFlags');

            for (const flag of this.flagsToSet) flagsToSet.appendChild(flag.asModuleXML(document));
            this.instanceElement.appendChild(flagsToSet);
        } else
            this.instanceElement.removeChildByTag('conditionFlags');

        if (this.files.size > 0) {
            const files = this.instanceElement.getOrCreateChildByTag('files');
            for (const file of this.files) files.appendChild(file.asModuleXML(document));
            this.instanceElement.appendChild(files);

        } else if (this.flagsToSet.size == 0) { // Create an empty `files` element if there are no flags to set to comply with the spec
            const emptyFilesElem = this.instanceElement.getOrCreateChildByTag('files');
            this.instanceElement.appendChild(emptyFilesElem);

        }
        // Don't remove the `files` element for now. Once the Builder can parse files, this will be uncommented
        // else
        // this.instanceElement.removeChildByTag('files');

        this.instanceElement.appendChild(this.typeDescriptor.asModuleXML(document));

        return this.instanceElement;
    }
}

/***
 *    $$$$$$$$\  $$$$$$\  $$\      $$\  $$$$$$\  $$$$$$$\        $$$$$$$\
 *    $$  _____|$$  __$$\ $$$\    $$$ |$$  __$$\ $$  __$$\       $$  __$$\
 *    $$ |      $$ /  $$ |$$$$\  $$$$ |$$ /  $$ |$$ |  $$ |      $$ |  $$ | $$$$$$\   $$$$$$$\  $$$$$$\
 *    $$$$$\    $$ |  $$ |$$\$$\$$ $$ |$$ |  $$ |$$ |  $$ |      $$$$$$$\ | \____$$\ $$  _____|$$  __$$\
 *    $$  __|   $$ |  $$ |$$ \$$$  $$ |$$ |  $$ |$$ |  $$ |      $$  __$$\  $$$$$$$ |\$$$$$$\  $$$$$$$$ |
 *    $$ |      $$ |  $$ |$$ |\$  /$$ |$$ |  $$ |$$ |  $$ |      $$ |  $$ |$$  __$$ | \____$$\ $$   ____|
 *    $$ |       $$$$$$  |$$ | \_/ $$ | $$$$$$  |$$$$$$$  |      $$$$$$$  |\$$$$$$$ |$$$$$$$  |\$$$$$$$\
 *    \__|       \______/ \__|     \__| \______/ \_______/       \_______/  \_______|\_______/  \_______|
 */

export class Fomod extends FOMODElementProxy {
    keysToUpdate = ['installs', 'conditions', 'steps'] as const;

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


    installs: Set<InstallElement>;

    conditions: DependencyGroup | undefined;
    steps: Set<Step>;

    sortingOrder: SortOrder = window.FOMODBuilder.storage.settings.defaultSortingOrder;

    stepContainers: Record<string, HTMLDivElement> = {};

    addStep(xmlElement?: ConstructorParameters<typeof Step>[1]) {
        this.steps.add(new Step({
            base: this,
            containers: this.stepContainers,
            parent: this,
        }, xmlElement));

        this.updateObjects(true);
    }
    readonly addStep_bound = this.addStep.bind(this);

    constructor(
        instanceElement?: Element,
        infoInstanceElement?: Element,
    ) {
        super(instanceElement);
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

        this.steps = new Set();
        for (const step of (stepsElem?.children ?? [])) this.addStep(step);
        if (this.steps.size == 0) this.addStep();

        const conditionalInstallsElem = instanceElement?.getElementsByTagName('conditionalFileInstalls')[0]?.getElementsByTagName('patterns')[0];
        const requiredInstallsElem = instanceElement?.getElementsByTagName('requiredInstallFiles')[0];
        this.installs = new Set([...parseFiles(conditionalInstallsElem), ...parseFiles(requiredInstallsElem)]);

        const moduleDependencies = instanceElement?.getElementsByTagName('moduleDependencies')[0];
        if (moduleDependencies) this.conditions = new DependencyGroup(moduleDependencies);
    }

    override asModuleXML(document: XMLDocument): Element {
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

        if (this.steps.size > 0) {
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
        this.infoInstanceElement.setAttribute('xmlns:xsi', 'https://www.w3.org/2001/XMLSchema-instance');
        if (window.FOMODBuilder.storage.settings.includeInfoSchema)
            this.infoInstanceElement.setAttribute('xsi:noNamespaceSchemaLocation', 'https://testing.bellcube.dev/assets/site/misc/Info.xsd');
        else if (this.infoInstanceElement.getAttribute('xsi:noNamespaceSchemaLocation') === 'https://testing.bellcube.dev/assets/site/misc/Info.xsd')
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
