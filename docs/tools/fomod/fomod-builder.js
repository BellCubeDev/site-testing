const XMLParser = new DOMParser();
const fileReader = new FileReader();

window.onload = init;

var rootDirectory;
var fomodDirectory;

var info_file;
var info_xml;
var info_xml_tags;

var moduleConfig_file;
var moduleConfig_xml;

// Core
elm_buttonFolderPicker = document.getElementById(`fomod_FolderPicker`),

// Info.xml (Metadata)
elm_inputName = HTMLElement.prototype;
elm_inputAuthor = HTMLElement.prototype;
elm_inputID = HTMLElement.prototype;
elm_inputWebsite = HTMLElement.prototype;
elm_toggleUseSemVer = HTMLElement.prototype;
elm_containerVersionFull = HTMLElement.prototype;
    elm_inputVersionFull = HTMLElement.prototype;
elm_containerVersionSemVer = HTMLElement.prototype;
    elm_inputVersionMajor = HTMLElement.prototype;
    elm_inputVersionMinor = HTMLElement.prototype;
    elm_inputVersionPatch = HTMLElement.prototype;

// Config
elm_toggleAutosave = HTMLElement.prototype;
elm_toggleConfigInXML = HTMLElement.prototype;
elm_toggleConfigInCookie = HTMLElement.prototype;
elm_toggleInfoSchema = HTMLElement.prototype;
elm_toggleBranding = HTMLElement.prototype;

// Collapseables
elm_collapseableMetadata = HTMLElement.prototype;
elm_collapseableGeneralAndConfig = HTMLElement.prototype;

// Idea by IllusiveMan
var fileExtPathAssociations = {
    // NOTE: JSON Object that stores file paths based on their extension
    "esp": "",
    "esm": "",
    "esl": "",
    "bsa": "",
    "ba2": "",
    "psc": "source\\scripts",
    "pex": "Scripts",
    "bik": "Video",
    "strings": "Strings",
    "dlstrings": "Strings",
    "ilstrings": "Strings",
    "seq": "seq",
    "txt": "interface\\translations",
    "xml": "DialogueViews"
}

var parseIntErr = new TypeError('Value is not a number.')
/** Equivilent to `parseInt()`, except it throws an error if the value is not exclusively composed of digits.
    @param {string} intString - The string to parse
    @param {number} radix - The radix to use
    @returns {number} The parsed number
*/
function parseIntSuperStrict(intString, radix = 10) {
    if (intString.match(/^\d+$/)) {
        return parseInt(intString, radix)
    } else {
        console.log('Throwing ParseInt error for string ${intString}');
        throw parseIntErr;
    }
}

/** Returns a concatenation of all digits in a string.
    @param {string} intString - The string to parse
    @returns {number} The parsed number
*/
function parseIntRelaxed(intString) {
    var matches = intString.matchAll(/\d/g);
    var str = '';
    for (const match of matches) {str = str + match[0]}
    return parseInt(str)
}

/** uses `parseIntSuperStrict()` or, if relaxed==true, `parseIntRelaxed()` to parse a string into an integer.
    @param {string} intString - The string to parse
    @param {boolean} relaxed - Use `parseIntRelaxed()` instead of `parseIntSuperStrict()`
    @returns {number} The parsed number
*/
function parseIntExtremes(intString, relaxed = false){
    if (relaxed){
        return parseIntRelaxed(intString)
    } else {
        return parseIntSuperStrict(intString)
    }
}

/** Function called when the DOM is ready for manipulation.
    All code should stem from here in some way.
    @returns {nil}
*/
async function init() {
    //console.log("[BCD-FomodBuilder] Hello World!");

    // Core
    elm_buttonFolderPicker = document.getElementById(`fomod_FolderPicker`),

    // Info.xml (Metadata)
    elm_inputName = document.getElementById(`fomod_info_name`),
    elm_inputAuthor = document.getElementById(`fomod_info_author`),
    elm_inputID = document.getElementById(`fomod_info_ID`),
    elm_inputWebsite = document.getElementById(`fomod_info_website`),
    elm_toggleUseSemVer = document.getElementById(`fomod_config_toggleUseSemVer`),
    elm_containerVersionFull = document.getElementById(`fomod_info_version_cont`),
        elm_inputVersionFull = document.getElementById(`fomod_info_version_full`),
    elm_containerVersionSemVer = document.getElementById(`fomod_info_version_semver_cont`),
        elm_inputVersionMajor = document.getElementById(`fomod_info_version_major`),
        elm_inputVersionMinor = document.getElementById(`fomod_info_version_minor`),
        elm_inputVersionPatch = document.getElementById(`fomod_info_version_patch`),

    // Config
    elm_toggleAutosave = document.getElementById(`fomod_config_toggleAutosave`),
    elm_toggleConfigInXML = document.getElementById(`fomod_config_saveConfigXML`),
    elm_toggleConfigInCookie = document.getElementById(`fomod_config_saveConfigCookies`),
    elm_toggleInfoSchema = document.getElementById(`fomod_config_saveInfoSchema`),
    elm_toggleBranding = document.getElementById(`fomod_config_dobranding`),

    // Collapseables
    elm_collapseableMetadata = document.getElementById(`collapseable_Metadata`),
    elm_collapseableGeneralAndConfig = document.getElementById(`collapseable_GeneralAndConfig`),

    //console.log("[BCD-FomodBuilder] "+JSON.stringify(importantElements));

    elm_buttonFolderPicker.addEventListener('click', async () => {
        openFomodDirectory()
    });
    elm_toggleUseSemVer.addEventListener('click', async () => {
        if (checkToggleSwitch(elm_toggleUseSemVer)){
            setVersion(`${inputValue(elm_inputVersionMajor, false)}.${inputValue(elm_inputVersionMinor, false)}.${inputValue(elm_inputVersionPatch, false)}`.replace(/^\.+|\.+$/g, ''), true)
            elm_containerVersionSemVer.setAttribute('hidden', '');
            elm_containerVersionFull.removeAttribute('hidden');
        } else {
            setVersion(inputValue(elm_inputVersionFull, false), true);
            elm_containerVersionSemVer.removeAttribute('hidden');
            elm_containerVersionFull.setAttribute('hidden', '');
        }
    });

    elm_inputVersionFull.addEventListener('change', autoSave);
    elm_inputVersionFull.addEventListener('input', autoSave);
    elm_inputVersionMajor.addEventListener('input', autoSave);
    elm_inputVersionMajor.addEventListener('change', autoSave);
    elm_inputVersionMinor.addEventListener('input', autoSave);
    elm_inputVersionMinor.addEventListener('change', autoSave);
    elm_inputVersionPatch.addEventListener('input', autoSave);
    elm_inputVersionPatch.addEventListener('change', autoSave);
    elm_inputName.addEventListener('input', autoSave);
    elm_inputName.addEventListener('change', autoSave);
    elm_inputAuthor.addEventListener('input', autoSave);
    elm_inputAuthor.addEventListener('change', autoSave);
    elm_inputID.addEventListener('input', autoSave);
    elm_inputID.addEventListener('change', autoSave);
    elm_inputWebsite.addEventListener('input', autoSave);
    elm_inputWebsite.addEventListener('change', autoSave);
};

/** Function to handle the user selecting and opening a directory for the FOMOD Builder to work out of.
    Everything cascades from here.
    @returns {nil}
*/
async function openFomodDirectory(){
    var temp_rootDirectory;
    var temp_fomodDirectory;
    try {
        temp_rootDirectory = await window.showDirectoryPicker();
        while (!temp_rootDirectory || temp_rootDirectory.name.toLowerCase() == 'fomod'){
            window.alert(`Please select the root folder (the one containing 'fomod') or name your folder something other than 'fomod'.`);
            return;
        }

        while (
            !(await tryForPermission(temp_rootDirectory, 'readwrite'))
        ){
            if (!window.confirm(`The editor requires write permissions to the root folder. Please grant write permissions to the root folder or hit cancel.`)){
                return;
            }
        }
        document.getElementById(`fomod_FolderPicker_folderName`).innerHTML = temp_rootDirectory.name;

        console.log(`[BCD-FomodBuilder] Root Folder name: ${temp_rootDirectory.name}`);
        temp_rootDirectory.getDirectoryHandle('fomod', {create: true}).then(async (dir) => {
            temp_fomodDirectory = dir;

            console.log(`[BCD-FomodBuilder] FOMOD Directory name: ${dir.name}`);

            dir.getFileHandle('info.xml', {create: true}).then(async function (fileHandle) {
                console.log(`[BCD-FomodBuilder] fileHandle: ${fileHandle}, name: ${fileHandle.name}`);
                fileHandle.getFile().then(async function (file) {
                    const temp_xmlReader = new FileReader()
                    temp_xmlReader.onload = parseInfoXML;
                    temp_xmlReader.readAsText(file)
                });
            });
            dir.getFileHandle('ModuleConfig.xml', {create: true}).then(async function (fileHandle) {
                console.log(`[BCD-FomodBuilder] fileHandle: ${fileHandle}, name: ${fileHandle.name}`);
                fileHandle.getFile().then(async function (file) {
                    const temp_xmlReader = new FileReader()
                    temp_xmlReader.onload = parseModuleConfigXML;
                    temp_xmlReader.readAsText(file)
                });
            });
        });

        rootDirectory = temp_rootDirectory
        fomodDirectory = temp_fomodDirectory
        elm_collapseableMetadata.setAttribute('open', '');
    
        setTimeout(save, 3000)
    } catch(err) {
        if(err instanceof DOMException && (err.name == 'AbortError')) {
            console.log(`Intercepted error ${err.name}:\n${err.stack}`);
        }else {
            throw err;
        }
    }
}

/** Function to handle parsing `ModuleConfig.xml`
    @param {ProgressEvent} readerEvent - The event object
    @returns {nil}
*/
function parseModuleConfigXML(readerEvent) {}

/** Function to handle parsing `Info.xml`
    @param {ProgressEvent} readerEvent - The event object
    @returns {nil}
*/
function parseInfoXML(readerEvent) {
    console.log(`[BCD-FomodBuilder] readerEvent.target.result: ${readerEvent.target.result}`);
    info_xml = XMLParser.parseFromString(readerEvent.target.result, "text/xml");

    info_xml_tags = info_xml.getElementsByTagName('fomod')[0];

    elm_inputName.value = readXMLTag(info_xml_tags, 'Name');
    elm_inputAuthor.value = readXMLTag(info_xml_tags, 'Author');
    elm_inputID.value = readXMLTag(info_xml_tags, 'Id', true);
    elm_inputWebsite.value = readXMLTag(info_xml_tags, 'Website');

    // Version is a bit more complicated... as always.
    setVersion(readXMLTag(info_xml_tags, 'Version'));

}

/** Set the version fields
    @param {string} version - The version to set
    @param {boolean} relaxed - Use more relaxed parsing (used for going back & forth between SemVer and Full entry methods)
    @returns {nil}
*/
function setVersion(version, relaxed = false){
    elm_inputVersionFull.value = version;
    try{
        var splitVers = version.split('.');
        if (splitVers.length > 0){try{elm_inputVersionMajor.value = parseIntExtremes(splitVers[0], relaxed)} catch(e){handlePerseError(e)}}else{elm_inputVersionMajor.value = ''}
        if (splitVers.length > 1){try{elm_inputVersionMinor.value = parseIntExtremes(splitVers[1], relaxed)} catch(e){handlePerseError(e)}}else{elm_inputVersionMinor.value = ''}
        if (splitVers.length > 2){try{elm_inputVersionPatch.value = parseIntExtremes(splitVers[2], relaxed)} catch(e){handlePerseError(e)}}else{elm_inputVersionPatch.value = ''}
    } catch(e){handlePerseError(e)}
    function handlePerseError(e){
        console.log(`Error parsing version ${version}: ${e}\n${e.stack}`);
        elm_toggleUseSemVer.removeAttribute('checked');
        elm_toggleUseSemVer.parentElement.classList.remove('is-checked');
        elm_containerVersionSemVer.setAttribute('hidden', '');
        elm_containerVersionFull.removeAttribute('hidden');
    }
}

/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*/
/** Gets the value of the specified cookie.
    @param {string} cookieName The name of the cookie to get.
    @param {any} defaultValue Value to return should an error occur. Defaults to `''`
    @returns {string} The value of the cookie.
*/
function getCookie(cookieName, defaultValue){
    try {
        // Get the value of the cookie, if it exists
        return document.cookie.split('; ')
          .find(row => row.startsWith(`${cookieName}=`))
          .split('=')[1];
    } catch(error){
        console.log(`[BCD-FomodBuilder] Error "${error.name}" getting the value of cookie '${cookieName}' - it may not exist.`);
        if (typeof defaultValue !== 'undefined'){return defaultValue;}else{return '';}
    }
}

/** Conveinence function to get the value of a toggle switch.
    @param {HTMLElement} element - The element to get the value of.
    @returns {boolean} - Whether or not the switch was enabled.
*/
function checkToggleSwitch(element){
    return element.parentElement.classList.contains('is-checked')
}

/** Conveinence function to call `save()` if autosaving is enabled. CURRENTLY DISABLED UNTIL SAVING IS PROPERLY IMPLIMENTED.
    @returns {nil}
*/
async function autoSave() {
    //if (checkToggleSwitch(elm_toggleAutosave)) {save()}
}

/** Function to save the FOMOD.
    @returns {nil}
*/
async function save(){
    console.log('Before editing:\n', info_xml.documentElement);
    setTimeout(() => {
    if (checkToggleSwitch(elm_toggleInfoSchema)){
        console.log('Adding Schema to Info.xml (disabled by default)');
        // xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd"
        info_xml_tags.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        info_xml_tags.setAttribute('xsi:noNamespaceSchemaLocation', 'https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd')

    }
    if (checkToggleSwitch(elm_toggleBranding) && !info_xml.documentElement.innerHTML.includes('BellCube\'s FOMOD Builder')){
        console.log('Adding Branding to Info.xml (disabled by default)');
        var comment = info_xml.createComment('\n    Created using BellCube\'s FOMOD Builder\n    https://bellcubedev.github.io/site-testing/tools/fomod/\n    The tool is currently in early testing, so any extra testers would be very welcome.\n')
        /*
            <!--
                Created using BellCube's FOMOD Builder
                https://bellcubedev.github.io/site-testing/tools/fomod/
                The tool is currently in early testing, so any extra testers would be very welcome!
            -->
        */
        info_xml.documentElement.appendChild(comment);
    }

    console.log('Adding FOMOD Version to Info.xml');
    var versTag = getXMLTag(info_xml, 'Version');
    if (checkToggleSwitch(elm_toggleUseSemVer)){
        versTag.innerHTML = inputValue(elm_inputVersionMajor) + '.' + inputValue(elm_inputVersionMinor) + '.' + inputValue(elm_inputVersionPatch);
     }else {
        versTag.innerHTML = inputValue(elm_inputVersionFull);
    }

    console.log('After editing:\n', info_xml.documentElement);
    }, 1000);
}

/** Conveinence function to get the value of an input element. Will first attempt to get a user-submitted value, then will attempt to fetch a default from `builder_default`, before finally resorting to the `placeholder` attribute.
    @param {HTMLElement} element The Input element to get the value of
    @param {boolean} [usePlaceholder=true] Whether to use the `placeholder`. Defaults to True.
    @returns {string|number|boolean} The value of the input element
*/
function inputValue(element, usePlaceholder = true){
    try{
        //console.log(`inputValue(${element.id}): ${element.value}, ${element.getAttribute('builder_default')}, ${element.getAttribute('placeholder')}`);
        if (element.value != ''){
            return element.value;
        }else if(element.hasAttribute('builder_default')){
            return element.getAttribute('builder_default');
        }else if (element.hasAttribute('placeholder') && usePlaceholder){
            return element.getAttribute('placeholder');
        }
    }
    catch{}
    return '';
}



/** Error-resilient function to read the value of the specified XML tag
    @param {Document|HTMLElement} The XML document to read from
    @param {String} tagName The name of the tag to read
    @returns {String} The value of the tag (`innerHTML` or `innerText` based on `doText`), or `''` if the tag doesn't exist
*/
function readXMLTag(xml, tagName){
    try{
        var tag = getXMLTag(xml, tagName)
        console.log(`readXMLTag(${tagName}):`, tag);

        if (typeof tag === 'undefined') {
            console.log(`readXMLTag(${tagName}): tag not found`);
            return ''           }
        console.log(`readXMLTag(${tagName}): returning innerHTML`);
            return tag.innerHTML
    } catch (e) {console.log(`Error "${e.name}" reading the value of tag '${tagName}'\n${e.stack}`)}
    return '';
}

/** Get the specified XML tag
    @param {Document|HTMLElement} xml The HTMLElement or Document to get the child of
    @param {String} tagName The name of the tag to read
    @returns {HTMLElement} The specified tag, creating it and appending it to the end if it doesn't exist
*/
function getXMLTag(xml, tagName){
    
    try{
        var elem = HTMLElement.prototype;
        /* TODO Add case-insensitivity in a reliable way
        if (xml.ownerDocument == null) {elem = xml.documentElement} else {elem = xml}

        var tagNamePos = elem.innerHTML.toLowerCase().indexOf(`<${tagName.toLowerCase()}`) + 1;

        console.log(`xml.getElementsByTagName(elem.innerHTML.substring(${tagNamePos}, ${tagNamePos} + ${tagName.length} {${tagNamePos + tagName.length}}}))[0]`);
        console.log(elem.innerHTML.substring(tagNamePos, tagNamePos + tagName.length));

        var tempTag = xml.getElementsByTagName(elem.innerHTML.substring(tagNamePos, tagNamePos + tagName.length))[0];
        console.log(`getXMLTag(${tagName}):`, tempTag);
        */

        var tempTag = xml.getElementsByTagName(tagName)[0];

        if (typeof tempTag !== 'undefined'){return tempTag;}
    } catch (e) {
        console.log(`Error "${e.name}" getting the tag '${tagName}'\n${e.stack}`)
    }
    console.log(`getXMLTag(${tagName}): tag not found. Creating a new one...`);
    var newTag;
    if (xml.ownerDocument == null){
        newTag = xml.createElement(tagName);
    } else {
        newTag = xml.ownerDocument.createElement(tagName);
    }
    xml.appendChild(newTag);
    return newTag;
}

/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*/
/** Writes file contents to the file system.
    @param {FileSystemFileHandle} fileHandle - The file handle to write to.
    @param {string|BufferSource|Blob} contents - The data to write to the file.
    @param {FileSystemWritableFileStream} writeable
    @returns {nil}
*/
async function writeFile(fileHandle, contents) {

    // Condition for if we're doing an autosave
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

/** Requests the specified permission for the specified file.
    @param {FileSystemHandle} object The file or directory to request permission for
    @param {string} perm The permission to request
*/
async function tryForPermission(object, perm){
    try{
        return await object.requestPermission({'mode': perm}) == 'granted';
    } catch(e) {
        if (e.prototype.name == 'AbortError'){
            return false;
        }
    }
}
