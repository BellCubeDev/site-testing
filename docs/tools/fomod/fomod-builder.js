const XMLParser = new DOMParser();
const fileReader = new FileReader();

window.onload = init;

/** 
    @var {FileSystemDirectoryHandle} rootDirectory - The root directory of the FOMOD
    @var {FileSystemDirectoryHandle} rootDirectory - The directory containing the FOMOD's XML files

*/

var rootDirectory;
var fomodDirectory;

var info_file;
var info_xml;
var info_xml_tags;

var moduleConfig_file;
var moduleConfig_xml;

var importantElements = {//*

    // Core
    "buttonFolderPicker": HTMLElement.prototype,

    // Info.xml (Metadata)
    "inputName": HTMLElement.prototype,
    "inputAuthor": HTMLElement.prototype,
    "inputID": HTMLElement.prototype,
    "inputWebsite": HTMLElement.prototype,
    "containerVersionFull": HTMLElement.prototype,
    "inputVersionFull": HTMLElement.prototype,
        "toggleUseSemVer": HTMLElement.prototype,
    "containerVersionSemVer": HTMLElement.prototype,
        "inputVersionMajor": HTMLElement.prototype,
        "inputVersionMinor": HTMLElement.prototype,
        "inputVersionPatch": HTMLElement.prototype,

    // Config
    "toggleAutosave": HTMLElement.prototype,
    "toggleConfigInXML": HTMLElement.prototype,
    "toggleConfigInCookie": HTMLElement.prototype,
    "toggleInfoSchema": HTMLElement.prototype,
    "toggleBranding": HTMLElement.prototype,

/**/};

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
        parseIntErr.throw()
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

    importantElements = {
        // Core
        "buttonFolderPicker": document.getElementById(`fomod_FolderPicker`),

        // Info.xml (Metadata)
        "inputName": document.getElementById(`fomod_info_name`),
        "inputAuthor": document.getElementById(`fomod_info_author`),
        "inputID": document.getElementById(`fomod_info_ID`),
        "inputWebsite": document.getElementById(`fomod_info_website`),
        "toggleUseSemVer": document.getElementById(`fomod_config_toggleUseSemVer`),
        "containerVersionFull": document.getElementById(`fomod_info_version_cont`),
            "inputVersionFull": document.getElementById(`fomod_info_version_full`),
        "containerVersionSemVer": document.getElementById(`fomod_info_version_semver_cont`),
            "inputVersionMajor": document.getElementById(`fomod_info_version_major`),
            "inputVersionMinor": document.getElementById(`fomod_info_version_minor`),
            "inputVersionPatch": document.getElementById(`fomod_info_version_patch`),

        // Config
        "toggleAutosave": document.getElementById(`fomod_config_toggleAutosave`),
        "toggleConfigInXML": document.getElementById(`fomod_config_saveConfigXML`),
        "toggleConfigInCookie": document.getElementById(`fomod_config_saveConfigCookies`),
        "toggleInfoSchema": document.getElementById(`fomod_config_saveInfoSchema`),
        "toggleBranding": document.getElementById(`fomod_config_dobranding`),
    };

    //console.log("[BCD-FomodBuilder] "+JSON.stringify(importantElements));

    importantElements.buttonFolderPicker.addEventListener('click', async () => {
        openFomodDirectory()
    });
    importantElements.toggleUseSemVer.addEventListener('click', async () => {
        if (checkToggleSwitch(importantElements.toggleUseSemVer)){
            setVersion(`${inputValue(importantElements.inputVersionMajor)}.${inputValue(importantElements.inputVersionMinor)}.${inputValue(importantElements.inputVersionPatch)}`, true)
            importantElements.containerVersionSemVer.setAttribute('hidden', '');
            importantElements.containerVersionFull.removeAttribute('hidden');
        } else {
            setVersion(inputValue(importantElements.inputVersionFull), true)
            importantElements.containerVersionSemVer.removeAttribute('hidden');
            importantElements.containerVersionFull.setAttribute('hidden', '');
        }
    });

    importantElements.inputVersionFull.addEventListener('change', autoSave);
    importantElements.inputVersionFull.addEventListener('input', autoSave);
    importantElements.inputVersionMajor.addEventListener('input', autoSave);
    importantElements.inputVersionMajor.addEventListener('change', autoSave);
    importantElements.inputVersionMinor.addEventListener('input', autoSave);
    importantElements.inputVersionMinor.addEventListener('change', autoSave);
    importantElements.inputVersionPatch.addEventListener('input', autoSave);
    importantElements.inputVersionPatch.addEventListener('change', autoSave);
    importantElements.inputName.addEventListener('input', autoSave);
    importantElements.inputName.addEventListener('change', autoSave);
    importantElements.inputAuthor.addEventListener('input', autoSave);
    importantElements.inputAuthor.addEventListener('change', autoSave);
    importantElements.inputID.addEventListener('input', autoSave);
    importantElements.inputID.addEventListener('change', autoSave);
    importantElements.inputWebsite.addEventListener('input', autoSave);
    importantElements.inputWebsite.addEventListener('change', autoSave);
};

/** Function to handle the user selecting and opening a directory for the FOMOD Builder to work out of.
    Everything cascades from here.
    @returns {nil}
*/
async function openFomodDirectory(){
    var temp_rootDirectory;
    var temp_fomodDirectory;

    var temp_info_file;
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

        temp_rootDirectory.getDirectoryHandle('fomod', {create: true}).then(async (fomodDirectory) => {
            temp_fomodDirectory = fomodDirectory;

            console.log(`[BCD-FomodBuilder] Root Folder name: ${temp_rootDirectory.name}`);
            console.log(`[BCD-FomodBuilder] FOMOD Directory name: ${temp_fomodDirectory.name}`);

            await temp_fomodDirectory.getFileHandle('info.xml', {create: true}).then(async function (fileHandle) {
                console.log(`[BCD-FomodBuilder] fileHandle: ${fileHandle}, name: ${fileHandle.name}`);
                temp_info_file = fileHandle;
                temp_info_file.getFile().then(async function (file) {
                    temp_info_file = file;

                    const temp_xmlReader = new FileReader()
                    temp_xmlReader.onload = parseInfoXML;
                    temp_xmlReader.readAsText(temp_info_file)
                });
            });
        });
    } catch(e) {
        console.log("[BCD-FomodBuilder] "+e);
    }

    setTimeout(save, 3000)
}

/** Function to handle parsing `Info.xml`
    @param {ProgressEvent} readerEvent - The event object
    @returns {nil}
*/
async function parseInfoXML(readerEvent) {
    console.log(`[BCD-FomodBuilder] readerEvent.target.result: ${readerEvent.target.result}`);
    info_xml = XMLParser.parseFromString(readerEvent.target.result, "text/xml");

    info_xml_tags = info_xml.getElementsByTagName('fomod')[0];
    console.log(info_xml_tags);

    importantElements.inputName.value = readXMLTag(info_xml_tags, 'Name');
    importantElements.inputAuthor.value = readXMLTag(info_xml_tags, 'Author');
    importantElements.inputID.value = readXMLTag(info_xml_tags, 'Id', true);
    importantElements.inputWebsite.value = readXMLTag(info_xml_tags, 'Website'); //FIXME - Website always creates a new tag
    // Version is a bit more complicated... as always.
    setVersion(readXMLTag(info_xml_tags, 'Version'));

}

/** Set the version fields
    @param {string} version - The version to set
    @param {boolean} relaxed - Use more relaxed parsing (used for going back & forth between SemVer and Full entry methods)
    @returns {nil}
*/
function setVersion(version, relaxed = false){
    importantElements.inputVersionFull.value = version;
    try{
        var splitVers = version.split('.');
        try{importantElements.inputVersionMajor.value = parseIntExtremes(splitVers[0], relaxed)} catch(e){handlePerseError(e)}
        try{importantElements.inputVersionMinor.value = parseIntExtremes(splitVers[1], relaxed)} catch(e){handlePerseError(e)}
        try{importantElements.inputVersionPatch.value = parseIntExtremes(splitVers[2], relaxed)} catch(e){handlePerseError(e)}
    } catch(e){handlePerseError(e)}
    function handlePerseError(e){
        console.log(`Error parsing version ${version}: ${e}\n${e.stack}`);
        importantElements.toggleUseSemVer.removeAttribute('checked');
        importantElements.toggleUseSemVer.parentElement.classList.remove('is-checked');
        importantElements.containerVersionSemVer.setAttribute('hidden', '');
        importantElements.containerVersionFull.removeAttribute('hidden');
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
    //if (checkToggleSwitch(importantElements.toggleAutosave)) {save()}
}

/** Function to save the FOMOD.
    @returns {nil}
*/
async function save(){
    console.log('Before editing:\n', info_xml.documentElement);
    setTimeout(() => {
    if (checkToggleSwitch(importantElements.toggleInfoSchema)){
        console.log('Adding Schema to Info.xml (disabled by default)');
        // xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd"
        info_xml_tags.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        info_xml_tags.setAttribute('xsi:noNamespaceSchemaLocation', 'https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd')

    }
    if (checkToggleSwitch(importantElements.toggleBranding) && !info_xml.documentElement.innerHTML.includes('BellCube\'s FOMOD Builder')){
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
    if (checkToggleSwitch(importantElements.toggleUseSemVer)){
        versTag.innerHTML = inputValue(importantElements.inputVersionMajor) + '.' + inputValue(importantElements.inputVersionMinor) + '.' + inputValue(importantElements.inputVersionPatch);
     }else {
        versTag.innerHTML = inputValue(importantElements.inputVersionFull);
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
        var elem;
        if (xml.ownerDocument == null) {elem = xml.documentElement} else {elem = xml}
        var tagNamePos = elem.innerHTML.toLowerCase().indexOf(tagName.toLowerCase());
        //console.log( `xml.getElementsByTagName(elem.innerHTML.substring(${tagNamePos}, ${tagNamePos} + ${tagName.length} {${tagNamePos + tagName.length}}}))[0]`);
        //console.log(elem.innerHTML.substring(tagNamePos, tagNamePos + tagName.length));
        var tempTag = xml.getElementsByTagName(elem.innerHTML.substring(tagNamePos, tagNamePos + tagName.length))[0];
        //console.log(`getXMLTag(${tagName}):`, tempTag);
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
    return newTag
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
