import{UpdatableObject as B,getSetIndex as he,wait as ye}from"../../universal.js";import*as Ee from"./fomod-builder-ui.js";export const UpdateObjects=new Map;export function addUpdateObjects(e,...t){UpdateObjects.get(e)?.push(...t)||UpdateObjects.set(e,t)}export class FOMODElementProxy extends B{instanceElement;objectsToUpdate=[];propagateToChildren_wasTrue=!1;updateObjects(e=!1){if(this){if(this.propagateToChildren_wasTrue||=e,queueMicrotask(()=>this.propagateToChildren_wasTrue=!1),e)return this.update();for(const e of this.objectsToUpdate)e instanceof FOMODElementProxy?e.updateObjects(!0):e.update();if(this.propagateToChildren_wasTrue)for(const e of this.keysToUpdate){if(!(e in this))return console.error(`Key ${e} not found in ${this.constructor.name}`,this);const t=this[e];if(t instanceof B)t.update();else if(t instanceof Set||t instanceof Array)for(const e of t)e instanceof FOMODElementProxy?e.updateObjects(!0):e instanceof B&&e.update()}Ee.autoSave()}}update_(){this.updateObjects()}destroy(){super.destroy(),this.instanceElement?.remove()}updateWhole(){if(!("inherited"in this)||!this.inherited||"object"!=typeof this.inherited)return this.updateObjects(!0);"base"in this.inherited&&this.inherited.base&&this.inherited.base instanceof FOMODElementProxy?this.inherited.base.updateObjects(!0):"parent"in this.inherited&&this.inherited.parent&&this.inherited.parent instanceof FOMODElementProxy&&this.inherited.parent.updateObjects(!0),this.updateObjects(!0)}destroy_(){this.objectsToUpdate.forEach(e=>e.destroy()),"steps"in this&&this.steps instanceof Set&&this.steps.forEach(e=>e.destroy()),"groups"in this&&this.groups instanceof Set&&this.groups.forEach(e=>e.destroy()),"options"in this&&this.options instanceof Set&&this.options.forEach(e=>e.destroy()),this.updateWhole()}constructor(e){super(),this.suppressUpdates=!0,this.instanceElement=e,queueMicrotask(()=>{for(const e of UpdateObjects.get(this.constructor)??[])this.objectsToUpdate.push(new e(this));this.suppressUpdates=!1,this.updateObjects()})}}window.flags={};export class Flag{name;getters;gettersByValue;setters;settersByValue;cachedValues;static cachedNames=new Map;static get(e){return window.flags[e]??new Flag(e)}checkValidity(){0===this.setters.size&&0===this.getters.size&&delete window.flags[this.name]}constructor(e){if(window.flags[e])throw new Error(`Flag ${e} already exists!`);this.name=e,window.flags[e]=this,this.getters=new Set,this.setters=new Set,this.gettersByValue={},this.settersByValue={},this.cachedValues=new Map,queueMicrotask(this.checkValidity.bind(this))}get values(){const e=new Set;for(const t of this.getters)e.add(t.value);return e}updateSetter(e){if(e.flag!==this.name){this.setters.delete(e);const t=this.cachedValues.get(e);return t&&this.settersByValue[t]?.delete(e),this.cachedValues.delete(e),void this.checkValidity()}const t=this.cachedValues.get(e);t!==e.value&&(void 0!==t&&(this.settersByValue[t]||(this.settersByValue[t]=new Set),this.settersByValue[t].delete(e),0===this.settersByValue[t].size&&delete this.settersByValue[t]),this.settersByValue[e.value]||(this.settersByValue[e.value]=new Set),this.settersByValue[e.value].add(e)),this.cachedValues.set(e,e.value),this.setters.add(e)}updateGetter(e){if(e.flag!==this.name){this.getters.delete(e);const t=this.cachedValues.get(e);return t&&this.gettersByValue[t]?.delete(e),this.cachedValues.delete(e),void this.checkValidity()}const t=this.cachedValues.get(e);t!==e.value&&(void 0!==t&&(this.gettersByValue[t]||(this.gettersByValue[t]=new Set),this.gettersByValue[t].delete(e),0===this.gettersByValue[t].size&&delete this.gettersByValue[t]),this.gettersByValue[e.value]||(this.gettersByValue[e.value]=new Set),this.gettersByValue[e.value].add(e)),this.cachedValues.set(e,e.value),this.getters.add(e)}removeItem(e){this.setters.delete(e),this.getters.delete(e);const t=this.cachedValues.get(e);t&&(this.settersByValue[t]?.delete(e),this.gettersByValue[t]?.delete(e)),this.cachedValues.delete(e),this.checkValidity()}static removeItem(e){const t=Flag.cachedNames.get(e);void 0!==t&&Flag.get(t).removeItem(e),Flag.cachedNames.delete(e)}static updateSetter(e){const t=Flag.cachedNames.get(e);t!==e.flag&&(void 0!==t&&Flag.get(t).updateSetter(e),Flag.cachedNames.set(e,e.flag)),Flag.get(e.flag).updateSetter(e)}static updateGetter(e){const t=Flag.cachedNames.get(e);t!==e.flag&&(void 0!==t&&Flag.get(t).updateGetter(e),Flag.cachedNames.set(e,e.flag)),Flag.get(e.flag).updateGetter(e)}}window.flagClass=Flag;export class DependencyBase extends FOMODElementProxy{keysToUpdate=[];constructor(e){super(e)}}export class DependencyBaseVersionCheck extends DependencyBase{_version="";set version(e){this._version=e,this.updateObjects()}get version(){return this._version}}export class DependencyGroup extends DependencyBase{_operator="And";set operator(e){this._operator=e,this.updateObjects()}get operator(){return this._operator}_children=[];set children(e){this._children=e,this.updateObjects()}get children(){return this._children}constructor(e,t="And",s=!1){super(e),this.operator=t,e&&(this._operator=e.getAttribute("operator")||t),s&&this.parseDependencies()}async parseDependencies(){if(this.instanceElement){for(const e of this.instanceElement.children)this.children.push(await Oe(e));queueMicrotask(()=>this.update())}}asModuleXML(e,t="dependencies"){if(this.instanceElement??=e.createElement(t),this.instanceElement&&this.instanceElement.tagName!==t){this.instanceElement.remove(),this.instanceElement=e.createElement(t);for(const e of this.children)e.instanceElement&&this.instanceElement.appendChild(e.instanceElement)}this.instanceElement.setAttribute("operator",this.operator);for(const s of this.children)this.instanceElement.appendChild(s.asModuleXML(e));return this.instanceElement}}export class DependencyFlag extends DependencyBase{_flag="";set flag(e){this._flag=e,this.update()}get flag(){return this._flag}_value="";set value(e){this._value=e,this.update()}get value(){return this._value}type;inherited;constructor(e,t,s){super(s),this.type=e,this.inherited=t,s&&(this.flag=s.getAttribute("name")??"",this.value=s.getAttribute("value")||s.textContent||"")}update_(){this.inherited&&("flagDependency"===this.type?Flag.updateGetter(this):this.inherited.parent&&Flag.updateSetter(this))}destroy_(){this.inherited&&(Flag.removeItem(this),this.inherited.parent?.flagsToSet.delete(this),super.destroy_())}asModuleXML(e){return this.instanceElement??=e.createElement(this.type),this.instanceElement.setAttribute("name",this.flag),"flagDependency"===this.type?this.instanceElement.setAttribute("value",this.value):this.instanceElement.textContent=this.value,this.instanceElement}}export class DependencyFile extends DependencyBase{_file="";set file(e){this._file=e,this.updateObjects()}get file(){return this._file}_state="Active";set state(e){this._state=e,this.updateObjects()}get state(){return this._state}asModuleXML(e){const t=e.createElement("fileDependency");return t.setAttribute("file",this.file),t.setAttribute("state",this.state),t}}export class DependencyScriptExtender extends DependencyBaseVersionCheck{asModuleXML(e){const t=e.createElement("foseDependency");return t.setAttribute("version",this.version),t}}export class DependencyGameVersion extends DependencyBaseVersionCheck{asModuleXML(e){const t=e.createElement("gameDependency");return t.setAttribute("version",this.version),t}}export class DependencyModManager extends DependencyBaseVersionCheck{asModuleXML(e){const t=e.createElement("fommDependency");return t.setAttribute("version",this.version),t}}async function Oe(e,t){const s=e.tagName;switch(s){case"dependencies":return new DependencyGroup(e,void 0,!0);case"fileDependency":return new DependencyFile(e);case"flagDependency":if(e.previousSibling?.nodeType!==Node.COMMENT_NODE||!t?.base)return new DependencyFlag("flagDependency",t,e);const[,n,i,a]=e.previousSibling.textContent?.match(/Option (\d+)-(\d+)-(\d+)/)??[];return await async function(e,t,s,n){if(!e||!t||!s)return null;for(;Ee.loadingFomod.state;)await ye(5);const i=he(n.steps,parseInt(e)),a=i?he(i.groups,parseInt(t)):null;return(a?he(a.options,parseInt(s)):null)??null}(n,i,a,t.base)??new DependencyFlag("flagDependency",t,e);case"foseDependency":return new DependencyScriptExtender(e);case"gameDependency":return new DependencyGameVersion(e);case"fommDependency":return new DependencyModManager(e);default:throw new TypeError(`Unknown dependency type: ${s}`)}}export class OptionStateDescriptor extends FOMODElementProxy{keysToUpdate=["conditions"];_defaultState="Optional";set defaultState(e){this._defaultState=e,this.updateObjects()}get defaultState(){return this._defaultState}conditions=[];constructor(e,t="Optional",s=[]){super(e),this.defaultState=t,this.conditions=s;const n=e?.getElementsByTagName("type")[0],i=e?.getElementsByTagName("dependencyType")[0];if(n&&(this.defaultState=n.getAttribute("name")),i){const e=i.getElementsByTagName("defaultType")[0];e&&(this.defaultState=e.getAttribute("name")||"Optional");const t=i.getElementsByTagName("patterns")[0];for(const s of t?.children||[])this.conditions.push(new OptionStateConditionStatement(s))}}asModuleXML(e){this.instanceElement??=e.createElement("typeDescriptor");let t=this.instanceElement.getElementsByTagName("type")[0],s=this.instanceElement.getElementsByTagName("dependencyType")[0];if(0==this.conditions.length)return s?.remove(),t=this.instanceElement.getOrCreateChildByTag("type"),this.instanceElement.appendChild(t),t.setAttribute("name",this.defaultState),this.instanceElement;t?.remove(),s=this.instanceElement.getOrCreateChildByTag("dependencyType"),this.instanceElement.appendChild(s);const n=s.getOrCreateChildByTag("defaultType");n.setAttribute("default",this.defaultState),s.appendChild(n);const i=s.getOrCreateChildByTag("patterns");for(const a of this.conditions)i.appendChild(a.asModuleXML(e));return s.appendChild(i),this.instanceElement}}export class OptionStateConditionStatement extends FOMODElementProxy{keysToUpdate=["dependencies"];_type="Optional";set type(e){this._type=e,this.updateObjects()}get type(){return this._type}_typeElement=void 0;set typeElement(e){this._typeElement=e,this.updateObjects()}get typeElement(){return this._typeElement}_dependencies;set dependencies(e){this._dependencies=e,this.updateObjects()}get dependencies(){return this._dependencies}constructor(e,t,s="Optional"){super(e),this.dependencies=t??new DependencyGroup,this.type=s}asModuleXML(e){return this.instanceElement=this.instanceElement??e.createElement("pattern"),this.typeElement=this.typeElement??this.instanceElement.appendChild(e.createElement("type")),this.typeElement.setAttribute("name",this.type),this.instanceElement.appendChild(this.dependencies.asModuleXML(e)),this.instanceElement}}export const installs=new Set;function Ce(e){const t=[];if(!e)return t;const s=e.getElementsByTagName("dependencies")[0],n=e.getElementsByTagName("files")[0]||e;let i;s&&(i=new DependencyGroup(s));for(const a of n.children){const e=new InstallElement(a,i);t.push(e),installs.add(e)}return t}export class InstallElement extends FOMODElementProxy{keysToUpdate=["dependencies"];_source=[];set source(e){this._source=e,this.updateObjects()}get source(){return this._source}_destination=[];set destination(e){this._destination=e,this.updateObjects()}get destination(){return this._destination}dependencies=null;_priority=0;set priority(e){this._priority=e,this.updateObjects()}get priority(){return this._priority}async updateFile(e){if(e instanceof FileSystemHandle&&(e=await(window.FOMODBuilder.directory?.handle.resolve(e))??""),e instanceof File&&"string"==typeof e&&(e=e.replace(/\\/g,"/").split("/")),!(e instanceof Array))throw new Error("Could not resolve path - most likely outside of the root directory");this.source=e}constructor(e,t){super(e),installs.add(this),this.dependencies=t??null,e&&(this.source=e.getAttribute("source")?.split(/[/\\]/)??[],this.destination=e.getAttribute("destination")?.split(/[/\\]/)??[])}asModuleXML(e){this.instanceElement??=e.createElement("install");const t=this.source.join("/"),s=""===this.source[this.source.length-1];return this.instanceElement.appendChild(e.createElement(s?"folder":"file")).textContent=s?t.slice(0,-1):t,this.instanceElement}}export class Step extends FOMODElementProxy{keysToUpdate=["groups","conditions"];inherited;_name="";set name(e){this._name=e,this.updateObjects()}get name(){return this._name}_sortingOrder=window.FOMODBuilder.storage.settings.defaultSortingOrder;set sortingOrder(e){this._sortingOrder=e,this.updateObjects()}get sortingOrder(){return this._sortingOrder}groups;groupContainers={};conditions;addGroup(e){this.groups.add(new Group({base:this.inherited.base,containers:this.groupContainers,parent:this},e)),this.updateWhole()}addGroup_bound=this.addGroup.bind(this);destroy_(){return!(this.inherited.parent&&1==this.inherited.parent.steps.size||(this.inherited.parent?.steps.delete(this),super.destroy_(),0))}constructor(e,t){if(super(t),this.inherited=e,this.groups=new Set,this.instanceElement){this.name=this.instanceElement.getAttribute("name")??"";const e=this.instanceElement.getElementsByTagName("optionalFileGroups")[0];if(e){this.sortingOrder=e.getAttribute("order")||window.FOMODBuilder.storage.settings.defaultSortingOrder;for(const t of e.children??[])this.addGroup(t)}}0==this.groups.size&&this.addGroup()}asModuleXML(e){this.instanceElement??=e.createElement("installStep"),this.instanceElement.setAttribute("name",this.name);const t=this.conditions?.asModuleXML(e,"visible");t?this.instanceElement.appendChild(t):this.instanceElement.removeChildByTag("visible");const s=this.instanceElement.getOrCreateChildByTag("optionalFileGroups");s.setAttribute("order",this.sortingOrder);for(const n of this.groups)s.appendChild(n.asModuleXML(e));return this.instanceElement.appendChild(s),this.instanceElement}}export class Group extends FOMODElementProxy{keysToUpdate=["options"];inherited;_name="";set name(e){this._name=e,this.updateObjects()}get name(){return this._name}_type=window.FOMODBuilder.storage.settings.defaultGroupSelectType;set type(e){this._type=e,this.updateObjects()}get type(){return this._type}_sortingOrder=window.FOMODBuilder.storage.settings.defaultSortingOrder;set sortingOrder(e){this._sortingOrder=e,this.updateObjects()}get sortingOrder(){return this._sortingOrder}options;optionContainers={};addOption(e){this.options.add(new Option({base:this.inherited.base,containers:this.optionContainers,parent:this},e)),this.updateWhole()}addOption_bound=this.addOption.bind(this);destroy_(){this.inherited.parent?.groups.delete(this),super.destroy_()}constructor(e,t){if(super(t),this.inherited=e,this.options=new Set,this.instanceElement){this.name=this.instanceElement.getAttribute("name")??"",this.type=this.instanceElement.getAttribute("type")||window.FOMODBuilder.storage.settings.defaultGroupSelectType;const e=this.instanceElement.getElementsByTagName("plugins")[0];if(e){this.sortingOrder=e.getAttribute("order")||window.FOMODBuilder.storage.settings.defaultSortingOrder;for(const t of e.children??[])this.addOption(t)}}0==this.options.size&&this.addOption()}asModuleXML(e){if(this.instanceElement=this.instanceElement??e.createElement("group"),this.instanceElement.setAttribute("name",this.name),this.instanceElement.setAttribute("type",this.type),this.options.size>0){const t=this.instanceElement.getOrCreateChildByTag("plugins");t.setAttribute("order",this.sortingOrder);for(const s of this.options)t.appendChild(s.asModuleXML(e))}else this.instanceElement.removeChildByTag("plugins");return this.instanceElement}}export class Option extends FOMODElementProxy{keysToUpdate=["flagsToSet","files","typeDescriptor"];inherited;destroy_(){this.inherited.parent?.options.delete(this),super.destroy_()}_name="";set name(e){this._name=e,this.updateObjects()}get name(){return this._name}_description;set description(e){this._description=e,this.updateObjects()}get description(){return this._description}_image;set image(e){this._image=e,this.updateObjects()}get image(){return this._image}flagsToSet=new Set;flagsContainers={};files=new Set;filesContainers={};_typeDescriptor;set typeDescriptor(e){this._typeDescriptor=e,this.updateObjects()}get typeDescriptor(){return this._typeDescriptor}constructor(e,t){super(t),this.inherited=e;const s=this.instanceElement?.getElementsByTagName("typeDescriptor")[0];if(this.typeDescriptor=new OptionStateDescriptor(s),!this.instanceElement)return;this.name=this.instanceElement.getAttribute("name")||"",this.description=this.instanceElement.getElementsByTagName("description")[0]?.textContent||"",this.image=this.instanceElement.getElementsByTagName("image")[0]?.getAttribute("path")||"";const n={base:this.inherited.base,parent:this,containers:this.flagsContainers};for(const i of this.instanceElement.getElementsByTagName("flag")??[])this.flagsToSet.add(new DependencyFlag("flag",n,i));for(const i of this.instanceElement.getElementsByTagName("file")??[]);}addFlag(e){this.flagsToSet.add(new DependencyFlag("flag",{base:this.inherited.base,containers:this.flagsContainers,parent:this},e)),this.updateWhole()}addFlag_bound=this.addFlag.bind(this,void 0);asModuleXML(e){this.instanceElement=this.instanceElement??e.createElement("plugin"),this.instanceElement.setAttribute("name",this.name);const t=this.instanceElement.getOrCreateChildByTag("description");if(t.textContent=this.description,this.instanceElement.appendChild(t),this.image){const e=this.instanceElement.getOrCreateChildByTag("image");e.setAttribute("path",this.image),this.instanceElement.appendChild(e)}else this.instanceElement.removeChildByTag("image");if(this.flagsToSet.size>0){const t=this.instanceElement.getOrCreateChildByTag("conditionFlags");for(const s of this.flagsToSet)t.appendChild(s.asModuleXML(e));this.instanceElement.appendChild(t)}else this.instanceElement.removeChildByTag("conditionFlags");if(this.files.size>0){const t=this.instanceElement.getOrCreateChildByTag("files");for(const s of this.files)t.appendChild(s.asModuleXML(e));this.instanceElement.appendChild(t)}else if(0==this.flagsToSet.size){const e=this.instanceElement.getOrCreateChildByTag("files");this.instanceElement.appendChild(e)}return this.instanceElement.appendChild(this.typeDescriptor.asModuleXML(e)),this.instanceElement}}export class Fomod extends FOMODElementProxy{keysToUpdate=["installs","conditions","steps"];_metaName="";set metaName(e){this._metaName=e,window.FOMODBuilder.storage.settings.keepNamesSynced&&(this._moduleName=e),this.updateObjects()}get metaName(){return this._metaName||(window.FOMODBuilder.storage.settings.keepNamesSynced?this._moduleName:"")}_moduleName="";set moduleName(e){this._moduleName=e,window.FOMODBuilder.storage.settings.keepNamesSynced&&(this._metaName=e),this.updateObjects()}get moduleName(){return this._moduleName||(window.FOMODBuilder.storage.settings.keepNamesSynced?this._metaName:"")}_metaImage="";set metaImage(e){this._metaImage=e,this.updateObjects()}get metaImage(){return this._metaImage}_metaAuthor="";set metaAuthor(e){this._metaAuthor=e,this.updateObjects()}get metaAuthor(){return this._metaAuthor}_metaVersion="";set metaVersion(e){this._metaVersion=e,this.updateObjects()}get metaVersion(){return this._metaVersion}_metaId=null;set metaId(e){this._metaId=e,this.updateObjects()}get metaId(){return this._metaId}_infoInstanceElement;set infoInstanceElement(e){this._infoInstanceElement=e,this.updateObjects()}get infoInstanceElement(){return this._infoInstanceElement}_metaUrl="";get metaUrl(){return this._metaUrl}set metaUrl(e){if(e instanceof URL)this._metaUrl=e;else try{this._metaUrl=new URL(e)}catch(t){this._metaUrl=e,this.updateObjects()}}getURLAsString(){return this.metaUrl instanceof URL?this.metaUrl.toString():this.metaUrl}installs;conditions;steps;sortingOrder=window.FOMODBuilder.storage.settings.defaultSortingOrder;stepContainers={};addStep(e){this.steps.add(new Step({base:this,containers:this.stepContainers,parent:this},e)),this.updateObjects(!0)}addStep_bound=this.addStep.bind(this);constructor(e,t){super(e),this.infoInstanceElement=t,this.metaName=t?.getElementsByTagName("Name")[0]?.textContent??"",this.moduleName=e?.getElementsByTagName("moduleName")[0]?.textContent??"",this.metaImage=e?.getElementsByTagName("moduleImage")[0]?.getAttribute("path")??"",this.metaAuthor=t?.getElementsByTagName("Author")[0]?.textContent??"",this.metaVersion=t?.getElementsByTagName("Version")[0]?.textContent??"",this.metaUrl=t?.getElementsByTagName("Website")[0]?.textContent??"";const[,s]=t?.getElementsByTagName("Id")[0]?.textContent?.match(/^\s*(\d+)\s*$/)??[];this.metaId=s?parseInt(s):null;const n=e?.getElementsByTagName("installSteps")[0];this.sortingOrder=n?.getAttribute("order")||"Explicit",this.steps=new Set;for(const o of n?.children??[])this.addStep(o);0==this.steps.size&&this.addStep();const i=e?.getElementsByTagName("conditionalFileInstalls")[0]?.getElementsByTagName("patterns")[0],a=e?.getElementsByTagName("requiredInstallFiles")[0];this.installs=new Set([...Ce(i),...Ce(a)]);const r=e?.getElementsByTagName("moduleDependencies")[0];r&&(this.conditions=new DependencyGroup(r))}asModuleXML(e){e.documentElement!==this.instanceElement&&(e.removeChild(e.documentElement),this.instanceElement=e.getOrCreateChildByTag("config")),this.instanceElement.setAttribute("xmlns:xsi","https://www.w3.org/2001/XMLSchema-instance"),this.instanceElement.setAttribute("xsi:noNamespaceSchemaLocation","https://qconsulting.ca/fo3/ModConfig5.0.xsd");const t=this.instanceElement.getOrCreateChildByTag("moduleName");if(t.textContent=this.metaName,this.instanceElement.appendChild(t),this.metaImage){const e=this.instanceElement.getOrCreateChildByTag("moduleImage");e.setAttribute("path",this.metaImage),this.instanceElement.appendChild(e)}else this.instanceElement.removeChildByTag("moduleImage");this.conditions?this.instanceElement.appendChild(this.conditions.asModuleXML(e,"moduleDependencies")):this.instanceElement.removeChildByTag("moduleDependencies");const s=this.instanceElement.getOrCreateChildByTag("requiredInstallFiles"),n=[];if(s.children.length?this.instanceElement.appendChild(s):this.instanceElement.removeChildByTag("requiredInstallFiles"),this.steps.size>0){const t=this.instanceElement.getOrCreateChildByTag("installSteps");t.setAttribute("order",this.sortingOrder);for(const s of this.steps)t.appendChild(s.asModuleXML(e));this.instanceElement.appendChild(t)}else this.instanceElement.removeChildByTag("installSteps");if(n.length){const e=this.instanceElement.getOrCreateChildByTag("conditionalFileInstalls");for(const t of n)e.appendChild(t);this.instanceElement.appendChild(e)}else this.instanceElement.removeChildByTag("conditionalFileInstalls");return this.instanceElement}asInfoXML(e){e.documentElement!==this.infoInstanceElement&&(e.removeChild(e.documentElement),this.infoInstanceElement=e.getOrCreateChildByTag("fomod")),this.infoInstanceElement.setAttribute("xmlns:xsi","https://www.w3.org/2001/XMLSchema-instance"),window.FOMODBuilder.storage.settings.includeInfoSchema?this.infoInstanceElement.setAttribute("xsi:noNamespaceSchemaLocation","https://testing.bellcube.dev/assets/site/misc/Info.xsd"):"https://testing.bellcube.dev/assets/site/misc/Info.xsd"===this.infoInstanceElement.getAttribute("xsi:noNamespaceSchemaLocation")&&this.infoInstanceElement.removeAttribute("xsi:noNamespaceSchemaLocation");const t=this.getURLAsString();return this.metaName?this.infoInstanceElement.getOrCreateChildByTag("Name").textContent=this.metaName:this.infoInstanceElement.removeChildByTag("Name"),this.metaAuthor?this.infoInstanceElement.getOrCreateChildByTag("Author").textContent=this.metaAuthor:this.infoInstanceElement.removeChildByTag("Author"),null!==this.metaId?this.infoInstanceElement.getOrCreateChildByTag("Id").textContent=this.metaId.toString():this.infoInstanceElement.removeChildByTag("Id"),t?this.infoInstanceElement.getOrCreateChildByTag("Website").textContent=t:this.infoInstanceElement.removeChildByTag("Website"),this.metaVersion?this.infoInstanceElement.getOrCreateChildByTag("Version").textContent=this.metaVersion:this.infoInstanceElement.removeChildByTag("Version"),this.infoInstanceElement}}
//# sourceMappingURL=https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/tools/fomod/fomod-builder-classifications.js.map