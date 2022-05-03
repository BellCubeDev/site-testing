const XMLParser = new DOMParser();
const fileReader = new FileReader();

function print(message) {
    console.log("[BCD-FomodBuilder] "+message);
}

window.onload = init;

// Some variables are defined here with values because it helps VS Code understand what's going on

var rootDirectory = FileSystemDirectoryHandle.prototype;
var fomodDirectory = FileSystemDirectoryHandle.prototype;

var info_file = FileSystemFileHandle.prototype;
var info_xml = XMLDocument.prototype;
var info_xml_tags = HTMLElement.prototype;

var moduleConfig_file = FileSystemFileHandle.prototype;
var moduleConfig_xml = XMLDocument.prototype;

var importantElements = {
    // Core
    "buttonFolderPicker": HTMLElement.prototype,


    // Version Number
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
};

var currentConfig
const defaultConfig = {
    autoSave:false,
    autoConditionFlag:false,
    configInInfo:false,
}
try {
    currentConfig = JSON.parse(getCookie('fomod_builder_config', defaultConfig));
} catch {
    currentConfig = defaultConfig;
}

// NOTE: Use file type to determine path
// Idea by IllusiveMan
var fileExtPathAssociations = {
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

async function init() {
    //print("Hello World!");

    importantElements = {
        // Core
        "buttonFolderPicker": document.getElementById(`fomod_FolderPicker`),


        // Version Number
        "containerVersionFull": document.getElementById(`fomod_info_version`),
        "inputVersionFull": document.getElementById(`fomod_info_version_input_full`),

        "toggleUseSemVer": document.getElementById(`fomod_config_toggleUseSemVer`).parentElement,

        "containerVersionSemVer": document.getElementById(`fomod_info_version_semver`),
        "inputVersionMajor": document.getElementById(`fomod_info_version_input_major`),
        "inputVersionMinor": document.getElementById(`fomod_info_version_input_minor`),
        "inputVersionPatch": document.getElementById(`fomod_info_version_input_patch`),


        // Config
        "toggleAutosave": document.getElementById(`fomod_config_toggleAutosave`).parentElement,
        "toggleConfigInXML": document.getElementById(`fomod_config_saveConfigXML`).parentElement,
        "toggleConfigInCookie": document.getElementById(`fomod_config_saveConfigCookies`).parentElement,
        "toggleInfoSchema": document.getElementById(`fomod_config_saveInfoSchema`).parentElement,
        "toggleBranding": document.getElementById(`fomod_config_dobranding`).parentElement,
    };

    //print(JSON.stringify(importantElements));

    importantElements.buttonFolderPicker.addEventListener('click', async () => {
        openFomodDirectory()
    });
    importantElements.toggleUseSemVer.addEventListener('click', async () => {
        if (importantElements.toggleUseSemVer.classList.contains('is-checked')){
            importantElements.containerVersionSemVer.setAttribute('hidden', '');
            importantElements.containerVersionFull.removeAttribute('hidden');
        } else {
            importantElements.containerVersionSemVer.removeAttribute('hidden');
            importantElements.containerVersionFull.setAttribute('hidden', '');
        }
    });



};

async function openFomodDirectory(){
    var temp_rootDirectory = FileSystemDirectoryHandle.prototype;
    var temp_fomodDirectory = FileSystemDirectoryHandle.prototype;
    
    var temp_info_file = FileSystemFileHandle.prototype;
    var temp_info_xml = XMLDocument.prototype;
    var temp_info_xml_tags = HTMLElement.prototype;
    
    var temp_moduleConfig_file = FileSystemFileHandle.prototype;
    var temp_moduleConfig_xml = XMLDocument.prototype;
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

            print(`Root Folder name: ${temp_rootDirectory.name}`);
            print(`FOMOD Directory name: ${temp_fomodDirectory.name}`);

            /*
            var temp_fomodDirectoryJSON = {};
            for await (const [key, value] of temp_fomodDirectory.entries()) {
                temp_fomodDirectoryJSON[key] = value;
                temp_fomodDirectoryJSON[key]['file'] = await value.getFile();
            }
            console.log(temp_fomodDirectoryJSON);

            var filetext = await temp_fomodDirectoryJSON['info.xml'].file.text(); 
            print(`text of Info.xml:\n====================\n${filetext}\n====================`);
            */

            // FIXME Make this work
            await temp_fomodDirectory.getFileHandle('info.xml', {create: true}).then(async function (fileHandle) {
                print(`fileHandle: ${fileHandle}, name: ${fileHandle.name}`);
                temp_info_file = fileHandle;
                temp_info_file.getFile().then(async function (file) {
                    temp_info_file = file;

                    const temp_xmlReader = new FileReader()
                    temp_xmlReader.onload = readerEvent => {
                        print(`readerEvent.target.result: ${readerEvent.target.result}`);
                        temp_info_xml = XMLParser.parseFromString(readerEvent.target.result, "text/xml");
                        temp_info_xml_tags = temp_info_xml.getElementsByTagName('fomod')[0];
                        console.log(temp_info_xml_tags);

                        info_file = temp_info_file;
                        info_xml = temp_info_xml;
                        info_xml_tags = temp_info_xml_tags;
                    }
                    temp_xmlReader.readAsText(temp_info_file)
                });
            });
        });
    } catch(e) {
        print(e);
    }

    setTimeout(save, 3000)
}

/**
    Runs a conditional to see if the file should be auto-saved before saving it with `writeFile()`.
*/

/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*//**
  * Gets the value of the specified cookie.
  * @param cookieName The name of the cookie to get.
  * @param defaultValue Value to return should an error occur. Defaults to `''`
*/
function getCookie(cookieName, defaultValue){
    try {
        // Get the value of the cookie, if it exists
        return document.cookie.split('; ')
          .find(row => row.startsWith(`${cookieName}=`))
          .split('=')[1];
    } catch{
        print(`Error getting the value of cookie '${cookieName}' - it may not exist.`);
        if (typeof defaultValue !== 'undefined'){return defaultValue;}else{return '';}
    }
}

/**
    * Conveinence function to get the value of a toggle switch.
*/
function checkToggleSwitch(element){
    return element.classList.contains('is-checked')
}

/**
    * Conveinence function to call `save()` if autosaving is enabled.
*/
async function autoSave() {
    if (checkToggleSwitch(importantElements.toggleAutosave)) {
        save()
    }
}

async function save(){
    console.log('Before editing:\n', info_xml.documentElement);
    setTimeout(() => {
    if (checkToggleSwitch(importantElements.toggleConfigInXML)){
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
        info_xml.documentElement.append(comment);
    }
    console.log('After editing:\n', info_xml.documentElement);
    }, 1000);
}

/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*//**
  Writes file contents to the file system.
*/
async function writeFile(fileHandle, contents) {

    // Condition for if we're doing an autosave
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

async function tryForPermission(object, perm){
    try{
        return await object.requestPermission({'mode': perm}) == 'granted';
    } catch(e) {
        if (e.prototype.name == 'AbortError'){
            return false;
        }
    }
}

async function updateFieldValue(fieldName, tagName){
    var field = document.getElementById(fieldName);
}

