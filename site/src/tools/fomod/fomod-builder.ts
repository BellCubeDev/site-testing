import {bcdStr, bcd_ComponentTracker, BellCubicSummary} from '../../universal.js';
import {componentHandler} from '../../assets/site/mdl/material.js';
import * as builderClasses from './fomod-builder-classifications.js';

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    Really does make code *so* much easier to maintain. After all, I can actually find my functions in VSCode's Minimap
*/

declare global {interface Window {
    bcd_builder: {
        directory: FileSystemDirectoryHandle|undefined
    }
}}


/*$$$$$\  $$\           $$\                 $$\       $$\    $$\
$$  __$$\ $$ |          $$ |                $$ |      $$ |   $$ |
$$ /  \__|$$ | $$$$$$\  $$$$$$$\   $$$$$$\  $$ |      $$ |   $$ | $$$$$$\   $$$$$$\   $$$$$$$\
$$ |$$$$\ $$ |$$  __$$\ $$  __$$\  \____$$\ $$ |      \$$\  $$  | \____$$\ $$  __$$\ $$  _____|
$$ |\_$$ |$$ |$$ /  $$ |$$ |  $$ | $$$$$$$ |$$ |       \$$\$$  /  $$$$$$$ |$$ |  \__|\$$$$$$\
$$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |$$  __$$ |$$ |        \$$$  /  $$  __$$ |$$ |       \____$$\
\$$$$$$  |$$ |\$$$$$$  |$$$$$$$  |\$$$$$$$ |$$ |         \$  /   \$$$$$$$ |$$ |      $$$$$$$  |
 \______/ \__| \______/ \_______/  \_______|\__|          \_/     \_______|\__|      \______*/


const XMLParser = new DOMParser();
const XMLSerializationMaster = new XMLSerializer();

var rootDirectory:FileSystemDirectoryHandle;
var fomodDirectory:FileSystemDirectoryHandle;

var info_file:FileSystemFileHandle;
var info_xml:XMLDocument;
var info_xml_tags:Element;

var moduleConfig_file:FileSystemFileHandle;
var moduleConfig_xml:XMLDocument;
var moduleConfigError = null;

// Core

var elm_buttonFolderPicker:HTMLButtonElement;
var elm_buttonSave:HTMLButtonElement;

// Info.xml (Metadata)
var elm_displayFolderName:HTMLParagraphElement;
var elm_inputName:HTMLInputElement;
var elm_inputAuthor:HTMLInputElement;
var elm_inputID:HTMLInputElement;
var elm_inputWebsite:HTMLInputElement;
var elm_toggleUseCustomVers:HTMLInputElement;
    var elm_containerVersionFull:HTMLDivElement;
        var elm_inputVersionFull:HTMLInputElement;
    var elm_containerVersionSemVer:HTMLDivElement;
        var elm_inputVersionMajor:HTMLInputElement;
        var elm_inputVersionMinor:HTMLInputElement;
        var elm_inputVersionPatch:HTMLInputElement;

// Config
var elm_toggleAutosave:HTMLInputElement;
var elm_toggleConfigInXML:HTMLInputElement;
var elm_toggleConfigInCookie:HTMLInputElement;
var elm_toggleInfoSchema:HTMLInputElement;
var elm_toggleBranding:HTMLInputElement;

// Collapsables
var elm_collapsableMetadata:HTMLDivElement;
var elm_collapsableGeneralAndConfig:HTMLDivElement;

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
};

const builder_consts = {
    isOpen: 'is-checked'
};


var parseIntErr = new TypeError('Value is not a number.');


/*$$$$$\                                      $$$$$$\           $$\   $$\
$$  __$$\                                     \_$$  _|          \__|  $$ |
$$ |  $$ | $$$$$$\   $$$$$$\   $$$$$$\          $$ |  $$$$$$$\  $$\ $$$$$$\
$$$$$$$  | \____$$\ $$  __$$\ $$  __$$\         $$ |  $$  __$$\ $$ |\_$$  _|
$$  ____/  $$$$$$$ |$$ /  $$ |$$$$$$$$ |        $$ |  $$ |  $$ |$$ |  $$ |
$$ |      $$  __$$ |$$ |  $$ |$$   ____|        $$ |  $$ |  $$ |$$ |  $$ |$$\
$$ |      \$$$$$$$ |\$$$$$$$ |\$$$$$$$\       $$$$$$\ $$ |  $$ |$$ |  \$$$$  |
\__|       \_______| \____$$ | \_______|      \______|\__|  \__|\__|   \____/
                    $$\   $$ |
                    \$$$$$$  |
                     \_____*/





/** Function called when the DOM is ready for manipulation.
    All code should stem from here in some way.
*/
export async function bcd_fomodBuilder_init() {
    // Sets the various element variables found above
    setElementVars();

    elm_buttonFolderPicker.addEventListener('click', openFomodDirectory);

    elm_buttonSave.addEventListener('click', async () => {
        save();
    });
    elm_toggleUseCustomVers.addEventListener('input', reEvalCustomVersionSwitch_Delayed);

    registerAutoSaveEvents();
}
// @ts-ignore: Property 'bcd_init_functions' does not exist on type 'Window & typeof globalThis'.
window.bcd_init_functions.fomodBuilder = bcd_fomodBuilder_init;


function setElementVars():void{
    // Core
    elm_buttonFolderPicker = document.getElementById(`fomod_FolderPicker`) as HTMLButtonElement;
    elm_buttonSave = document.getElementById(`fomod_saveButton`) as HTMLButtonElement;

    // Info.xml (Metadata)
    elm_displayFolderName = document.getElementById(`fomod_FolderPicker_folderName`) as HTMLParagraphElement;
    elm_inputName = document.getElementById(`fomod_info_name`) as HTMLInputElement;
    elm_inputAuthor = document.getElementById(`fomod_info_author`) as HTMLInputElement;
    elm_inputID = document.getElementById(`fomod_info_ID`) as HTMLInputElement;
    elm_inputWebsite = document.getElementById(`fomod_info_website`) as HTMLInputElement;
    elm_toggleUseCustomVers = document.getElementById(`fomod_config_toggleUseCustomVers`) as HTMLInputElement;
    elm_containerVersionFull = document.getElementById(`fomod_info_version_cont`) as HTMLDivElement;
        elm_inputVersionFull = document.getElementById(`fomod_info_version_full`) as HTMLInputElement;
    elm_containerVersionSemVer = document.getElementById(`fomod_info_version_semver_cont`) as HTMLDivElement;
        elm_inputVersionMajor = document.getElementById(`fomod_info_version_major`) as HTMLInputElement;
        elm_inputVersionMinor = document.getElementById(`fomod_info_version_minor`) as HTMLInputElement;
        elm_inputVersionPatch = document.getElementById(`fomod_info_version_patch`) as HTMLInputElement;

    // Config
    elm_toggleAutosave = document.getElementById(`fomod_config_toggleAutosave`) as HTMLInputElement;
    elm_toggleConfigInXML = document.getElementById(`fomod_config_saveConfigXML`) as HTMLInputElement;
    elm_toggleConfigInCookie = document.getElementById(`fomod_config_saveConfigCookies`) as HTMLInputElement;
    elm_toggleInfoSchema = document.getElementById(`fomod_config_saveInfoSchema`) as HTMLInputElement;
    elm_toggleBranding = document.getElementById(`fomod_config_doBranding`) as HTMLInputElement;

    // collapsables
    elm_collapsableMetadata = document.getElementById(`details_builder_meta`) as HTMLDivElement;
    elm_collapsableGeneralAndConfig = document.getElementById(`details_builder_genConfig`) as HTMLDivElement;
}






/*$$$$$\                                                    $$\       $$\   $$\   $$\     $$\ $$\
$$  __$$\                                                   $$ |      $$ |  $$ |  $$ |    \__|$$ |
$$ /  \__| $$$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\   $$$$$$\  $$ |      $$ |  $$ |$$$$$$\   $$\ $$ |
$$ |$$$$\ $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\  \____$$\ $$ |      $$ |  $$ |\_$$  _|  $$ |$$ |
$$ |\_$$ |$$$$$$$$ |$$ |  $$ |$$$$$$$$ |$$ |  \__| $$$$$$$ |$$ |      $$ |  $$ |  $$ |    $$ |$$ |
$$ |  $$ |$$   ____|$$ |  $$ |$$   ____|$$ |      $$  __$$ |$$ |      $$ |  $$ |  $$ |$$\ $$ |$$ |
\$$$$$$  |\$$$$$$$\ $$ |  $$ |\$$$$$$$\ $$ |      \$$$$$$$ |$$ |      \$$$$$$  |  \$$$$  |$$ |$$ |
 \______/  \_______|\__|  \__| \_______|\__|       \_______|\__|       \______/    \____/ \__|\_*/





/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*/
/** Gets the value of the specified cookie.
    @param {string} cookieName The name of the cookie to get.
    @param {any} defaultValue Value to return should an error occur. Defaults to `''`
    @returns {string} The value of the cookie.
*/
function getCookie(cookieName:string, defaultValue:string):string{
    try {
        // Get the value of the cookie, if it exists
        return document.cookie.split('; ')
          .find(row => row.startsWith(`${cookieName}=`))
          ?.split('=')[1] ?? defaultValue;
    } catch(error:unknown){
        console.debug(`[BCD-FomodBuilder] Error "${(error as Error).name}" getting the value of cookie '${cookieName}' - it may not exist.`);
        return defaultValue;
    }
}



/** Convenience function to call setTimeout, but with delay FIRST and the callback SECOND---i.e. the more LOGICAL way to do it. */
function delayFirst_SetTimeout(delay:number, callback:Function):void {
    setTimeout(callback, delay);
}



/** Equivalent to `parseInt()`, except it throws an error if the value is not exclusively composed of digits.
    @param {string} intString - The string to parse
    @param {number} radix - A value between 2 and 36 that specifies the base of the number in string. If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
    @returns {number} The parsed number
*/
function parseIntSuperStrict(intString:string, radix = 10):number {
    if (intString.replace(/\s+/g, '').match(/^\d+$/)) {
        return parseInt(intString, radix);
    } else {
        console.log('Throwing ParseInt error for string ${intString}');
        throw parseIntErr;
    }
}






/** Returns a concatenation of all digits in a string.
    @param {string} intString - The string to parse
    @returns {number} The parsed number
*/
function parseIntRelaxed(intString:string) {
    var matches = intString.matchAll(/\d/g);
    var str = '';
    for (const match of matches) {str = str + match[0];}
    return parseInt(str);
}




/** uses `parseIntSuperStrict()` or, if relaxed==true, `parseIntRelaxed()` to parse a string into an integer.
    @param {string} intString - The string to parse
    @param {boolean} relaxed - Use `parseIntRelaxed()` instead of `parseIntSuperStrict()`
    @returns {number} The parsed number
*/
function parseIntExtremes(intString:string, relaxed = false){
    if (relaxed){
        return parseIntRelaxed(intString);
    } else {
        return parseIntSuperStrict(intString);
    }
}




/*$$$$$\                                      $$$$$$$\  $$\
$$  __$$\                                     $$  __$$\ \__|
$$ /  $$ | $$$$$$\   $$$$$$\  $$$$$$$\        $$ |  $$ |$$\  $$$$$$\
$$ |  $$ |$$  __$$\ $$  __$$\ $$  __$$\       $$ |  $$ |$$ |$$  __$$\
$$ |  $$ |$$ /  $$ |$$$$$$$$ |$$ |  $$ |      $$ |  $$ |$$ |$$ |  \__|
$$ |  $$ |$$ |  $$ |$$   ____|$$ |  $$ |      $$ |  $$ |$$ |$$ |
 $$$$$$  |$$$$$$$  |\$$$$$$$\ $$ |  $$ |      $$$$$$$  |$$ |$$ |
 \______/ $$  ____/  \_______|\__|  \__|      \_______/ \__|\__|
          $$ |
          $$ |
          \_*/







/** Verify the specified directory
    @param {FileSystemDirectoryHandle} dir
    @throws {DOMException} 'NotAllowedError' if the directory name is any case of 'fomod'
    @returns {nil} nothing
*/
async function verifySelectedDirectory(dir:FileSystemDirectoryHandle):Promise<void> {
    if (dir.name.toLowerCase() != 'fomod') return;

    window.alert(`I'm sorry, but your root folder may not be named %{dir.name}.\n\n`+
    `Please rename your root folder to something other than '${dir.name}' and try again or,`+
    `if you selected the '${dir.name}' folder of an existing FOMOD, pick that FOMOD's root folder instead.`);

    throw new DOMException('The user\'s provided directory was named \'fomod\'', 'NotAllowedError');
}





/** Function to handle the user selecting and opening a directory for the FOMOD Builder to work out of.
    Everything cascades from here.
    @returns {nil} nothing
*/
async function openFomodDirectory(){

    var temp_rootDirectory;
    // Pick the directory
    try {
        temp_rootDirectory = await window.showDirectoryPicker();
        verifySelectedDirectory(temp_rootDirectory);
        attainDirPerms(temp_rootDirectory);
    } catch(err) {
        if(err instanceof DOMException && (err.name == 'AbortError' || err.name == 'NotAllowedError')) {
            //console.log(`Intercepted error ${err.name}:\n`,err.stack);
            return;
        }
        throw err;
    }

    elm_displayFolderName.innerHTML = encodeXML(temp_rootDirectory.name);

    var temp_fomodDirectory = await temp_rootDirectory.getDirectoryHandle('fomod', {create: true});


    // Get Info.xml and ModuleConfig.xml

    // Parse Info.xml
    var temp_info_file = await temp_fomodDirectory.getFileHandle('Info.xml', {create: true});
    temp_info_file.getFile().then((file) => { //@ts-ignore: Argument of type '(xmlString: string) => void' is not assignable to parameter of type '(value: unknown) => void | PromiseLike<void>'.
        readFile(file).then(parseInfoXML);
    });

    // Parse ModuleConfig.xml
    var temp_moduleConfig_file = await temp_fomodDirectory.getFileHandle('ModuleConfig.xml', {create: true});
    temp_moduleConfig_file.getFile().then((file) => { // @ts-ignore: Argument of type '(xmlString: string) => void' is not assignable to parameter of type '(value: unknown) => void | PromiseLike<void>'.
        readFile(file).then(parseModuleConfigXML);
    });

    // Finalize setting the variables
    rootDirectory = temp_rootDirectory;
    fomodDirectory = temp_fomodDirectory;

    //info_file = temp_info_file;                     <--   These variable setters
    //moduleConfig_file = temp_moduleConfig_file;     <--   are called in the respective parsers

    // Open the Metadata section
    bcd_ComponentTracker.findItem(BellCubicSummary, elm_collapsableMetadata, item => item.self === elm_collapsableMetadata)?.open();
}


/*$$$$\            $$$$$$\                  $$$$$$$$\ $$\ $$\
\_$$  _|          $$  __$$\                 $$  _____|\__|$$ |
  $$ |  $$$$$$$\  $$ /  \__| $$$$$$\        $$ |      $$\ $$ | $$$$$$\
  $$ |  $$  __$$\ $$$$\     $$  __$$\       $$$$$\    $$ |$$ |$$  __$$\
  $$ |  $$ |  $$ |$$  _|    $$ /  $$ |      $$  __|   $$ |$$ |$$$$$$$$ |
  $$ |  $$ |  $$ |$$ |      $$ |  $$ |      $$ |      $$ |$$ |$$   ____|
$$$$$$\ $$ |  $$ |$$ |      \$$$$$$  |      $$ |      $$ |$$ |\$$$$$$$\
\______|\__|  \__|\__|       \______/       \__|      \__|\__| \_____*/





/** Function to handle parsing `Info.xml`
    @param {String} xmlString - The event object
    @returns {nil} nothing
*/
function parseInfoXML(xmlString:string) {
    info_xml = XMLParser.parseFromString(xmlString, "text/xml");
    info_xml_tags = getXMLTag(info_xml, 'fomod');

    elm_inputName.value = readXMLTag(info_xml_tags, 'Name');
    elm_inputAuthor.value = readXMLTag(info_xml_tags, 'Author');
    elm_inputID.value = readXMLTag(info_xml_tags, 'Id');
    elm_inputWebsite.value = readXMLTag(info_xml_tags, 'Website');

    // Version is a bit more complicated... as always.
    setVersion(readXMLTag(info_xml_tags, 'Version'));

}







/** Set the version fields
    @param {string} version - The version to set
    @param {boolean} relaxed - Use more relaxed parsing (used for going back & forth between SemVer and Full entry methods)
    @returns {nil} nothing
*/
function setVersion(version:string, relaxed = false):void{
    console.log(`setVersion('${version}', ${relaxed})`);
    elm_inputVersionFull.value = version;
    try{
        // Get the version parts. If there's a non-numeric character in there, throw an error.
        // See the below handleParseError function for that.
        var splitVers = version.split('.');
        parseVersComponent(splitVers, 0, elm_inputVersionMajor, relaxed);
        parseVersComponent(splitVers, 1, elm_inputVersionMinor, relaxed);
        parseVersComponent(splitVers, 2, elm_inputVersionPatch, relaxed);

        // If we made it this far, use SemVer!
        openSemVer();
    } catch {
        // If we didn't, use the Full Version.
        closeSemVer();
    }
}






/**
@param {Array<String>} versArr Array of version strings to use
@param {number} pos Array index to pull from
@param {HTMLElement} element Form element to set the Value of
@param {Boolean} relaxed Whether to use relaxed parsing
*/
function parseVersComponent(versArr:string[], pos:number, element:HTMLInputElement, relaxed = false):void{
    if (!(versArr.length > pos)) {
        element.value = '';
        return;
    }
    try{
        element.value = parseIntExtremes(versArr[pos], relaxed) as unknown as string;
        openSemVer();
    } catch {
        closeSemVer();
    }
}









function openSemVer(){
    // Turn the MDL checkbox off
    elm_toggleUseCustomVers.removeAttribute('checked');                                                                             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    elm_toggleUseCustomVers.parentElement!.classList.remove(builder_consts.isOpen);

    // Show the SemVer input fields
    elm_containerVersionSemVer.removeAttribute('hidden');
    elm_containerVersionFull.setAttribute('hidden', '');
}






function closeSemVer(){
    // Turn the MDL checkbox on
    elm_toggleUseCustomVers.setAttribute('checked', '');                                                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    elm_toggleUseCustomVers.parentElement!.classList.add(builder_consts.isOpen);

    // Hide the SemVer input fields
    elm_containerVersionSemVer.setAttribute('hidden', '');
    elm_containerVersionFull.removeAttribute('hidden');
}






async function reEvalCustomVersionSwitch_Delayed() {
    if (await checkToggleSwitch_Delayed(50, elm_toggleUseCustomVers)){
        setVersion(inputValue(elm_inputVersionFull, false), true);
        closeSemVer();
    } else {
        setVersion(`${inputValue(elm_inputVersionMajor, false)}.${inputValue(elm_inputVersionMinor, false)}.${inputValue(elm_inputVersionPatch, false)}`.replace(/^\.+|\.+$/g, ''), true);
        openSemVer();
    }
}



/*\      $$\                 $$\           $$\            $$$$$$\                       $$$$$$\  $$\
$$$\    $$$ |                $$ |          $$ |          $$  __$$\                     $$  __$$\ \__|
$$$$\  $$$$ | $$$$$$\   $$$$$$$ |$$\   $$\ $$ | $$$$$$\  $$ /  \__| $$$$$$\  $$$$$$$\  $$ /  \__|$$\  $$$$$$\
$$\$$\$$ $$ |$$  __$$\ $$  __$$ |$$ |  $$ |$$ |$$  __$$\ $$ |      $$  __$$\ $$  __$$\ $$$$\     $$ |$$  __$$\
$$ \$$$  $$ |$$ /  $$ |$$ /  $$ |$$ |  $$ |$$ |$$$$$$$$ |$$ |      $$ /  $$ |$$ |  $$ |$$  _|    $$ |$$ /  $$ |
$$ |\$  /$$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |$$   ____|$$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ |
$$ | \_/ $$ |\$$$$$$  |\$$$$$$$ |\$$$$$$  |$$ |\$$$$$$$\ \$$$$$$  |\$$$$$$  |$$ |  $$ |$$ |      $$ |\$$$$$$$ |
\__|     \__| \______/  \_______| \______/ \__| \_______| \______/  \______/ \__|  \__|\__|      \__| \____$$ |
                                                                                                     $$\   $$ |
                                                                                                     \$$$$$$  |
                                                                                                      \_____*/





/* "Default Flags" XML
<!-- Hidden step to set condition flag defaults for the rest of the FOMOD to tamper with. -->
<InstallStep name="Default Flags Step"><Visible><Dependencies operator="And"><Flag name="false">true</Flag></Dependencies></Visible><OptionalFileGroups><Group name="_" type="SelectAll"><Plugins><Plugin name="_"><Description>_</Description>
    <ConditionFlags>
        <!-- Dynamically fill this spot the same as any other -->
    </ConditionFlags>
<TypeDescriptor><Type name="Required"/></TypeDescriptor></Plugin></Plugins></Group></OptionalFileGroups></InstallStep>
*/

/** Function to handle parsing `ModuleConfig.xml`
    @param {String} xmlString - The event object
    @returns {nil} nothing
*/
function parseModuleConfigXML(xmlString:string) {
    var temp_moduleConfig_xml = XMLParser.parseFromString(xmlString, 'text/xml');
    var parseErrorElement = temp_moduleConfig_xml.getElementsByTagName("parsererror")[0];
    if (typeof parseErrorElement !== "undefined") {
        moduleConfigError = parseErrorElement.outerHTML; // So we can interpret this elsewhere
        throw new SyntaxError('Invalid XML');
    }
    /* TODO: Validate against schema and throw error if invalid
    if (isValid) {
        moduleConfigError = validatorErrorMessage;
        throw new SyntaxError('Invalid ModuleConfig XML');
    }
    */

    var temp_moduleConfig_xml_root = getXMLTag(temp_moduleConfig_xml, 'config');

    // Get the module name
    //builderJSON_Instance[0].moduleName = readXMLTag(temp_moduleConfig_xml_root, "moduleName");

     // TODO Handle conflicts between Info.xml and ModuleConfig.xml (e.g. with names)

    // Get the module image
    //builderJSON_Instance[0].moduleImage = getXMLTag(temp_moduleConfig_xml_root, "moduleImage")?.getAttribute("path");

    // Get Module Conditions
    //builderJSON_Instance[0].conditions = parseDependency(getXMLTag(temp_moduleConfig_xml_root, "moduleDependencies", false));

    // Get base-level installs
    //builderJSON_Instance[0].installs.push(parseModuleFiles(getXMLTag(temp_moduleConfig_xml_root, "requiredInstallFiles", false)));

    /*for (const element of getXMLTag(getXMLTag(temp_moduleConfig_xml_root, "conditionalFileInstalls", false), "pattern", false)?.children ?? []) {
        const elem = getXMLTag(element, 'files', false)
        builderJSON_Instance[0].installs.push(parseModuleFiles(getXMLTag(element, 'files', false)));
    }*/
}




/*$$$$$\                       $$\
$$  __$$\                      \__|
$$ /  \__| $$$$$$\  $$\    $$\ $$\ $$$$$$$\   $$$$$$\
\$$$$$$\   \____$$\ \$$\  $$  |$$ |$$  __$$\ $$  __$$\
 \____$$\  $$$$$$$ | \$$\$$  / $$ |$$ |  $$ |$$ /  $$ |
$$\   $$ |$$  __$$ |  \$$$  /  $$ |$$ |  $$ |$$ |  $$ |
\$$$$$$  |\$$$$$$$ |   \$  /   $$ |$$ |  $$ |\$$$$$$$ |
 \______/  \_______|    \_/    \__|\__|  \__| \____$$ |
                                             $$\   $$ |
                                             \$$$$$$  |
                                              \_____*/






/** Convenience function to call `save()` if autosaving is enabled. CURRENTLY DISABLED UNTIL SAVING IS PROPERLY IMPLEMENTED.
    @returns {nil} nothing
*/
async function autoSave() {
    //if (checkToggleSwitch(elm_toggleAutosave)) {save()}
}





/** Function to save the FOMOD.
    @returns {nil} nothing
*/
async function save(){
    console.log('Before editing:\n', info_xml.documentElement);
    delayFirst_SetTimeout(1000, () => {
    if (checkToggleSwitch(elm_toggleInfoSchema)){
        console.log('Adding Schema to Info.xml (disabled by default)');
        // xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd"
        info_xml_tags.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        info_xml_tags.setAttribute('xsi:noNamespaceSchemaLocation', 'https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd');
    }
    info_xml.documentElement.innerHTML = info_xml.documentElement.innerHTML.replace(/<!--.*?BellCube's FOMOD Builder.*?-->\n*/sg, '');
    if (checkToggleSwitch(elm_toggleBranding)){
        console.log('Adding Branding to Info.xml (disabled by default)');
        var comment = info_xml.createComment('\n    Created using BellCube\'s FOMOD Builder\n    https://bellcubedev.github.io/site-testing/tools/fomod/\n    The tool is currently in early testing, so any extra testers would be very welcome.\n');
        /*
            <!--
                Created using BellCube's FOMOD Builder
                https://bellcubedev.github.io/site-testing/tools/fomod/
                The tool is currently in early testing, so any extra testers would be very welcome!
            -->
        */
        info_xml.documentElement.prepend('\n', comment);
        //info_xml.documentElement.innerHTML = `\n${XMLSerializationMaster.serializeToString(comment)}${info_xml.documentElement.innerHTML.replace(/<!--.*?BellCube's FOMOD Builder.*?-->\n*/sg, '')}`;
    }

    console.log('Adding FOMOD Version to Info.xml');
    var versTag = getXMLTag(info_xml, 'Version', true);
    if (checkToggleSwitch(elm_toggleUseCustomVers)) {
        versTag.innerHTML = encodeXML(inputValue(elm_inputVersionFull));
    } else {
        versTag.innerHTML = `${parseIntRelaxed(inputValue(elm_inputVersionMajor))}.${parseIntRelaxed(inputValue(elm_inputVersionMinor))}.${parseIntRelaxed(inputValue(elm_inputVersionPatch))}`;
    }

    console.log(info_file, XMLSerializationMaster.serializeToString(info_xml));
    writeFile(info_file, XMLSerializationMaster.serializeToString(info_xml));

    console.log('After editing:\n', info_xml.documentElement);
    });
}







function registerAutoSaveEvents(){
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
}



/*$$$$$$\ $$\ $$\                  $$$$$$\                        $$\
$$  _____|\__|$$ |                $$  __$$\                       $$ |
$$ |      $$\ $$ | $$$$$$\        $$ /  \__|$$\   $$\  $$$$$$$\ $$$$$$\    $$$$$$\  $$$$$$\$$$$\
$$$$$\    $$ |$$ |$$  __$$\       \$$$$$$\  $$ |  $$ |$$  _____|\_$$  _|  $$  __$$\ $$  _$$  _$$\
$$  __|   $$ |$$ |$$$$$$$$ |       \____$$\ $$ |  $$ |\$$$$$$\    $$ |    $$$$$$$$ |$$ / $$ / $$ |
$$ |      $$ |$$ |$$   ____|      $$\   $$ |$$ |  $$ | \____$$\   $$ |$$\ $$   ____|$$ | $$ | $$ |
$$ |      $$ |$$ |\$$$$$$$\       \$$$$$$  |\$$$$$$$ |$$$$$$$  |  \$$$$  |\$$$$$$$\ $$ | $$ | $$ |
\__|      \__|\__| \_______|       \______/  \____$$ |\_______/    \____/  \_______|\__| \__| \__|
                                            $$\   $$ |
                                            \$$$$$$  |
                                             \_____*/




/** Requests the specified permission for the specified FileSystemHandle. */
async function tryForPermission(handle:FileSystemHandle, perm:FileSystemPermissionMode ){
    try{
        return await handle.requestPermission({'mode': perm}) == 'granted';                                                                                                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e:any) {
        if (e.prototype.name == 'AbortError'){
            return false;
        }
    }
}







/** Reads the specified file
    @param {FileSystemFileHandle} file - The file to read
    @returns {Promise<string>} - The contents of the file
*/
async function readFile(file:File|FileSystemFileHandle){
    const file_ = file instanceof FileSystemFileHandle ? await file.getFile() : file;
    // Nice job, Copilot!
    return new Promise<string>((resolve, reject) => {
        const temp_fileReader = new FileReader();
        temp_fileReader.onload = (readerEvent) => {
            //console.log('readFile Result:\n', readerEvent.target.result)
            if (!readerEvent.target?.result) {const err = new Error('FileReader.onload returned null!'); reject(err); throw err;}
            resolve(readerEvent.target.result.toString());
        };
        temp_fileReader.onerror = (err) => {
            reject(err);
        };
        temp_fileReader.readAsText(file_);
    });
}







/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*/
/** Writes file contents to the file system. */
async function writeFile(fileHandle:FileSystemFileHandle, contents:string|BufferSource|Blob) {
    fileHandle.createWritable().then((writable) =>{
        writable.write(contents);
        writable.close();
    });
}








/** Verify the specified directory
    @throws DOMException 'AbortError' If the user fails to give permissions for the directory
*/
async function attainDirPerms(dir:FileSystemDirectoryHandle) {
    while (!(await tryForPermission(dir, 'readwrite'))){
        if (!window.confirm("You must give write permissions for this directory to use this application.\n\nClick OK to give permissions.")){
            throw new DOMException('User denied directory write access', 'AbortError');
        }
    }
}









/*$$$$$\   $$$$$$\  $$\      $$\       $$\   $$\   $$\     $$\ $$\
$$  __$$\ $$  __$$\ $$$\    $$$ |      $$ |  $$ |  $$ |    \__|$$ |
$$ |  $$ |$$ /  $$ |$$$$\  $$$$ |      $$ |  $$ |$$$$$$\   $$\ $$ | $$$$$$$\
$$ |  $$ |$$ |  $$ |$$\$$\$$ $$ |      $$ |  $$ |\_$$  _|  $$ |$$ |$$  _____|
$$ |  $$ |$$ |  $$ |$$ \$$$  $$ |      $$ |  $$ |  $$ |    $$ |$$ |\$$$$$$\
$$ |  $$ |$$ |  $$ |$$ |\$  /$$ |      $$ |  $$ |  $$ |$$\ $$ |$$ | \____$$\
$$$$$$$  | $$$$$$  |$$ | \_/ $$ |      \$$$$$$  |  \$$$$  |$$ |$$ |$$$$$$$  |
\_______/  \______/ \__|     \__|       \______/    \____/ \__|\__|\______*/

/** Convenience function to get the value of an input element.
    Will first attempt to get a user-submitted value, then will attempt to fetch a default from `builder_default`, before finally resorting to the `placeholder` attribute.
*/
function inputValue(element:HTMLInputElement, usePlaceholder = true):string{
    try{
        if (element.value != '') return element.value;

        if(element.hasAttribute('builder_default')) return element.getAttribute('builder_default') as string;

        if (element.hasAttribute('placeholder') && usePlaceholder) return element.getAttribute('placeholder') as string;

    } finally {} return '';
}


/** Convenience function to get the value of an element's specified attribute or return a default value that you specify.
*/
function getAttrDefault(element:Element, attr:string, default_ = ''):string {
    return element.getAttribute(attr) ?? default_;
}


/** Convenience function to get the value of a toggle switch.
    @param {HTMLElement} element - The element to get the value of.
    @returns {boolean} - Whether or not the switch was enabled.
*/
function checkToggleSwitch(element:HTMLInputElement):boolean{
    //console.log(`checkToggleSwitch(${element.id}): ${element.parentElement.classList.contains(builder_consts.isOpen)}`);
    return element.parentElement?.classList.contains(builder_consts.isOpen) as boolean;
}

function checkToggleSwitch_Delayed(delay:number, element:HTMLInputElement):Promise<boolean>{
    return new Promise((resolve) => {
        delayFirst_SetTimeout(delay, () => {
            resolve(checkToggleSwitch(element));
        });
    });
}


/** Reorders the children of the specified element.
    @param {HTMLElement} parent - The element to reorder the children of. The children must have the `pos` attribute, or will otherwise be sent to the bottom.
    @returns {Array<HTMLElement>} - The children of the parent element, in the order requested by the elements' `pos` attributes.
*/
function gerReorderChildrenArr(parent:Element){
    var children = parent.children;
    var children_arr:(Element|null)[] = [];

    // Fill the array up with empty elements, up to the length of Children
    children_arr.fill(null, 0, children.length);

    // Give the elements their desired positions
    for (const elem of children){
        if (elem.hasAttribute('pos')){
            children_arr[(elem.getAttribute('pos') || 0) as number] = elem;
        } else {
            children_arr.push(elem);
        }
    }

    // And now to chop out the nulls
    children_arr = children_arr.filter(element => {
        return element == null? false : true;
    });

    return children_arr;
}

/** Sets the parent of elements in the array in the order of the array
    @param {HTMLElement} parent - The parent element to set the children of.
    @param {Array<HTMLElement>} elements - The children to set.
*/
function applyReorderByArray(parent:Element, elements:Element[]){
    for (const element of elements){
        parent.appendChild(element);
    }
}





/*\   /$\ $$\      $$\ $$\             $$\   $$\   $$\     $$\ $$\
$$ |  $$ |$$$\    $$$ |$$ |            $$ |  $$ |  $$ |    \__|$$ |
\$$\ $$  |$$$$\  $$$$ |$$ |            $$ |  $$ |$$$$$$\   $$\ $$ | $$$$$$$\
 \$$$$  / $$\$$\$$ $$ |$$ |            $$ |  $$ |\_$$  _|  $$ |$$ |$$  _____|
 $$  $$<  $$ \$$$  $$ |$$ |            $$ |  $$ |  $$ |    $$ |$$ |\$$$$$$\
$$  /\$$\ $$ |\$  /$$ |$$ |            $$ |  $$ |  $$ |$$\ $$ |$$ | \____$$\
$$ /  $$ |$$ | \_/ $$ |$$$$$$$$\       \$$$$$$  |  \$$$$  |$$ |$$ |$$$$$$$  |
\_/   \_/ \__|     \__|\________|       \______/    \____/ \__|\__|\______*/



/** Encodes the specified string in XML formatting
    @param {string} str The string to encode
*/
function encodeXML (str:string) {
    return str.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
}

/** Decodes the specified string in XML formatting
    @param {string} str The string to decode
*/
function decodeXML (str:string) {
    return str.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&apos;/g, '\'');
}

/** Error-resilient function to read the value of the specified XML tag
*/
function readXMLTag(xml:Document|Element|undefined, tagName:string, create = true):string{
    if (!xml) return '';
    try{
        var tag = getXMLTag(xml, tagName, create);

        if (!tag) return '';

        return decodeXML(tag.innerHTML);
    } catch (e:unknown) {console.log(`Error "${(e as Error).name}" reading the value of tag '${tagName}'\n${(e as Error).stack}`);}
    return '';
}

function getXMLTag(xml:Document|Element, tagName:string, create?:true):Element;
function getXMLTag(xml:Document|Element, tagName:string, create:boolean):Element|undefined;
function getXMLTag(xml:Document|Element, tagName:string, create:false|true|boolean = true):Element|undefined{
    try{
        /* TODO Add case-insensitivity in a reliable way
        var elem = HTMLElement.prototype;
        if (xml.ownerDocument == null) {elem = xml.documentElement} else {elem = xml}

        var tagNamePos = elem.innerHTML.toLowerCase().indexOf(`<${tagName.toLowerCase()}`) + 1;

        console.log(`xml.getElementsByTagName(elem.innerHTML.substring(${tagNamePos}, ${tagNamePos} + ${tagName.length} {${tagNamePos + tagName.length}}}))[0]`);
        console.log(elem.innerHTML.substring(tagNamePos, tagNamePos + tagName.length));

        var tempTag = xml.getElementsByTagName(elem.innerHTML.substring(tagNamePos, tagNamePos + tagName.length))[0];
        console.log(`getXMLTag(${tagName}):`, tempTag);
        */

        var tempTag = xml.getElementsByTagName(tagName)[0];

        if (typeof tempTag !== 'undefined'){return tempTag;}
    } catch (e:unknown) {
        console.log(`Error "${(e as Error).name}" getting the tag '${tagName}'\n${(e as Error).stack}`);
    }

    if (!create){return undefined;}

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

// Function from https://stackoverflow.com/questions/6027830/25388984
function getComments(context:Element):Comment[] {
    var foundComments:Comment[] = [];
    var elementPath = [context];
    while (elementPath.length > 0) {
        var el = elementPath.pop();

        for (const child of el?.childNodes ?? []) {
            if (child.nodeType === Node.COMMENT_NODE) {
                foundComments.push(child as Comment);
            } else {
                elementPath.push(child as Element);
            }
        }

    }

    return foundComments;
}

// NOTE: Check out https://developer.mozilla.org/en-US/docs/Web/API/Document/createNodeIterator



   /*$$$\  $$$$$$\   $$$$$$\  $$\   $$\       $$\   $$\   $$\     $$\ $$\
   \__$$ |$$  __$$\ $$  __$$\ $$$\  $$ |      $$ |  $$ |  $$ |    \__|$$ |
      $$ |$$ /  \__|$$ /  $$ |$$$$\ $$ |      $$ |  $$ |$$$$$$\   $$\ $$ | $$$$$$$\
      $$ |\$$$$$$\  $$ |  $$ |$$ $$\$$ |      $$ |  $$ |\_$$  _|  $$ |$$ |$$  _____|
$$\   $$ | \____$$\ $$ |  $$ |$$ \$$$$ |      $$ |  $$ |  $$ |    $$ |$$ |\$$$$$$\
$$ |  $$ |$$\   $$ |$$ |  $$ |$$ |\$$$ |      $$ |  $$ |  $$ |$$\ $$ |$$ | \____$$\
\$$$$$$  |\$$$$$$  | $$$$$$  |$$ | \$$ |      \$$$$$$  |  \$$$$  |$$ |$$ |$$$$$$$  |
 \______/  \______/  \______/ \__|  \__|       \______/    \____/ \__|\__|\______*/

export class bcdObj extends Object {
    constructor(obj:object) {
        super(obj);
    }
    renameKey(oldKeyName:string, newKeyName:string):void{ //@ts-ignore: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'bcdObj'.
        this[newKeyName] = this[oldKeyName];

        // Delete the key, if it exists (the function doesn't care)
        //@ts-ignore: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'bcdObj'.
        delete this[oldKeyName];
    }
}
