import*as I from"./fomod-builder-classifications.js";import{registerForEvents as v,UpdatableObject as B}from"../../universal.js";export class ModMetadata extends B{parent;get metaName(){return this.parent.metaName}set metaName(t){this.parent.metaName=t,this.update()}nameInput;get author(){return this.parent.metaAuthor}set author(t){this.parent.metaAuthor=t,this.update()}authorInput;get version(){return this.parent.metaVersion}set version(t){this.parent.metaVersion=t,this.update()}versionInput;get id(){return this.parent.metaId}set id(t){this.parent.metaId=t,this.update()}idInput;get url(){return this.parent.getURLAsString()}set url(t){this.parent.metaUrl=t,this.update()}urlInput;constructor(t){super(),this.parent=t,this.nameInput=document.getElementById("metadata-mod-name").getOrCreateChildByTag("input"),this.authorInput=document.getElementById("metadata-mod-author").getOrCreateChildByTag("input"),this.versionInput=document.getElementById("metadata-mod-version").getOrCreateChildByTag("input"),this.idInput=document.getElementById("metadata-mod-id").getOrCreateChildByTag("input"),this.urlInput=document.getElementById("metadata-mod-url").getOrCreateChildByTag("input"),v(this.nameInput,{change:this.updateFromInput_bound}),v(this.authorInput,{change:this.updateFromInput_bound}),v(this.versionInput,{change:this.updateFromInput_bound}),v(this.idInput,{change:this.updateFromInput_bound}),v(this.urlInput,{change:this.updateFromInput_bound})}updateFromInput_(){this.metaName=this.nameInput.value,this.author=this.authorInput.value,this.version=this.versionInput.value,this.url=this.urlInput.value;const[,t]=this.idInput.value.match(/^\s*(\d+)\s*$/)??[];this.id=t?parseInt(t):null}update_(){this.nameInput.value=this.metaName,this.nameInput.dispatchEvent(new Event("input")),this.authorInput.value=this.author,this.authorInput.dispatchEvent(new Event("input")),this.versionInput.value=this.version,this.versionInput.dispatchEvent(new Event("input")),this.idInput.value=this.id?.toString()??"",this.idInput.dispatchEvent(new Event("input")),this.urlInput.value=this.url,this.urlInput.dispatchEvent(new Event("input"))}}I.addUpdateObjects(I.Fomod,ModMetadata);
//# sourceMappingURL=https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/tools/fomod/fomod-builder-bindings.js.map