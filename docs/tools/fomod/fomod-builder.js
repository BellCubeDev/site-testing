/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can fund my functions in VSCode's Minimap
*/
const XMLParser = new DOMParser();

window.onload = init;

var rootDirectory;
var fomodDirectory;

var info_file;
var info_xml;
var info_xml_tags;

var moduleConfig_file;
var moduleConfig_xml;
var moduleConfigError = null;

// Core

var elm_buttonFolderPicker;
var elm_buttonSave;

// Info.xml (Metadata)
var elm_inputName;
var elm_inputAuthor;
var elm_inputID;
var elm_inputWebsite;
var elm_toggleUseSemVer;
var elm_containerVersionFull;
    var elm_inputVersionFull;
var elm_containerVersionSemVer;
    var elm_inputVersionMajor;
    var elm_inputVersionMinor;
    var elm_inputVersionPatch;

// Config
var elm_toggleAutosave;
var elm_toggleConfigInXML;
var elm_toggleConfigInCookie;
var elm_toggleInfoSchema;
var elm_toggleBranding;

// Collapsables
var elm_collapsableMetadata;
var elm_collapsableGeneralAndConfig;

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






var parseIntErr = new TypeError('Value is not a number.');
/** Equivalent to `parseInt()`, except it throws an error if the value is not exclusively composed of digits.
    @param {string} intString - The string to parse
    @param {number} radix - The radix to use
    @returns {number} The parsed number
*/
function parseIntSuperStrict(intString, radix = 10) {
    if (intString.match(/^\d+$/)) {
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
function parseIntRelaxed(intString) {
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
function parseIntExtremes(intString, relaxed = false){
    if (relaxed){
        return parseIntRelaxed(intString);
    } else {
        return parseIntSuperStrict(intString);
    }
}


/** Function called when the DOM is ready for manipulation.
    All code should stem from here in some way.
    @returns {nil} nothing
*/
async function init() {
    // Sets the various element variables found above
    setElementVars();

    elm_buttonFolderPicker.addEventListener('click', openFomodDirectory);

    elm_buttonSave.addEventListener('click', async () => {
        save();
    });
    elm_toggleUseSemVer.addEventListener('click', toggleSemVerInput);

    registerAutoSaveEvents();
}


/** Function to handle the user selecting and opening a directory for the FOMOD Builder to work out of.
    Everything cascades from here.
    @returns {nil} nothing
*/
async function openFomodDirectory(){
    var temp_rootDirectory;
    var temp_fomodDirectory;
    var temp_moduleConfig_file;
    var temp_info_file;

    try {
        temp_rootDirectory = await window.showDirectoryPicker();
        verifySelectedDirectory(temp_rootDirectory);
    } catch(err) {
        if(err instanceof DOMException && (err.name == 'AbortError' || err.name == 'NotAllowedError')) {
            //console.log(`Intercepted error ${err.name}:\n`,err.stack);
            return;
        }
        throw err;
    }

    document.getElementById(`fomod_FolderPicker_folderName`).innerHTML = encodeXML(temp_rootDirectory.name);
    temp_fomodDirectory = await temp_rootDirectory.getDirectoryHandle('fomod', {create: true});

    temp_info_file = await temp_fomodDirectory.getFileHandle('ModuleConfig.xml', {create: true});
    temp_moduleConfig_file = await temp_fomodDirectory.getFileHandle('Info.xml', {create: true});

    // Much simpler than what I had before, let me tell you!
    parseInfoXML(await readFile(temp_info_file));
    parseModuleConfigXML(await readFile(temp_moduleConfig_file));

    // Finalize setting the variables
    rootDirectory = temp_rootDirectory;
    fomodDirectory = temp_fomodDirectory;
    info_file = temp_info_file;
    moduleConfig_file = temp_moduleConfig_file;

    // Open the Metadata section
    // eslint-disable-next-line no-undef
    bcd_registeredComponents.bcdDetails[elm_collapsableMetadata.id].open();
}

/** Verify the specified directory
    @param {FileSystemDirectoryHandle} dir
    @throws {DOMException} 'AbortError' If the user fails to give permissions for the directory
    @throws {DOMException} 'NotAllowedError' if the directory name is any case of 'fomod'
    @returns {nil}
*/
async function verifySelectedDirectory(dir) {
    if (dir.name.toLowerCase() == 'fomod'){
        window.alert(
            document.getElementById(`fomod_localization_folderPicker_noFomod`).innerText
        );
        throw new DOMException('The user\'s provided directory was named \'fomod\'', 'NotAllowedError');
    }

    while (!(await tryForPermission(dir, 'readwrite'))){
        if (!window.confirm(
            document.getElementById(`fomod_localization_folderPicker_needsWriteAccess`).innerText
        )){
            throw new DOMException('User denied directory write access', 'AbortError');
        }
    }
}

/** Reads the specified file
    @param {FileSystemFileHandle} file - The file to read
    @returns {Promise<string>} - The contents of the file
*/
function readFile(file){
    // Nice job, Copilot!
    return new Promise((resolve, reject) => {
        const temp_fileReader = new FileReader();
        temp_fileReader.onload = (readerEvent) => {
            resolve(readerEvent.target.result);
        };
        temp_fileReader.onerror = (err) => {
            reject(err);
        };
        temp_fileReader.readAsText(file);
    });
}

var builderJSON = {
//    conditions: { // config > moduleDependencies
//        type: '',
//        dependencies: [
//            {
//                type: 'file', // config > moduleDependency > ?
//                path: '', // config > moduleDependency > fileDependency.file
//                value: '' // config > moduleDependency > ?.[state, value, version]
//            },{
//                type: 'flag', // config > moduleDependency > ?
//                name: '', // config > moduleDependency > flagDependency.flag]
//                value: '' // config > moduleDependency > ?.[state, value, version]
//            },{
//                type: 'modManagerVers', // config > moduleDependency > ?
//                value: '' // config > moduleDependency > ?.[state, value, version]
//            },{
//                type: 'scriptExtenderVers', // config > moduleDependency > ?
//                value: '' // config > moduleDependency > ?.[state, value, version]
//            },{
//                type: 'gameVers', // config > moduleDependency > ?
//                value: '' // config > moduleDependency > ?.[state, value, version]
//            },{
//                type: '', // config > moduleDependency > dependencies
//                dependencies: [/* Nested Dependencies! */]
//            }
//        ]
//    },
//    name: "", // config > moduleName
//    image: "", // config > moduleImage
//    steps: { // config > installSteps
//        order: "", // config > installSteps.order
//        steps: [
//            {
//                name: "", // config > installSteps > installStep.name
//                order: "", // config > installSteps > installStep > optionalFileGroups.order
//                groups: [
//                    {
//                        name: "", // config > installSteps > installStep > optionalFileGroups > group.name
//                        type: "", // config > installSteps > installStep > optionalFileGroups > group.type
//                        plugins: [
//                            {
//                                name: "", // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin.name
//                                description: "", // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > description
//                                flags: {/* key-value pairs */}, // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > conditionFlags
//                                files: [ // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > files
//                                    {
//                                        file: true, // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > files > [file, folder]
//                                        source: "", // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > files > [file, folder].source
//                                        destination: "", // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > files > [file, folder].destination
//                                        priority: 0 // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > files > [file, folder].priority
//                                    }
//                                ],
//                                selectionType: {
//                                    type: "", // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > typeDescriptor > [type.name, dependencyType > defaultType.name]
//                                    conditions: [ // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > typeDescriptor > dependencyType > patterns
//                                        {
//                                            type: "",  // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > typeDescriptor > dependencyType > patterns > defaultType.name
//                                            conditions: [/* See 'conditions' at the top */] // config > installSteps > installStep > optionalFileGroups > group > plugins > plugin > typeDescriptor > dependencyType > patterns > pattern > dependencies
//                                        }
//                                    ]
//                                }
//                            }
//                        ]
//                    }
//                ]
//            }
//        ]
//    },
//    installs: [ // config > [requiredInstallFiles, conditionalFileInstalls]
//        {
//            identifier: "", // Helpful name stored in comments
//            /* Example:
//                <pattern><!-- name="123" -->
//            */
//            conditions: [/* See 'conditions' at the top */], // config > conditionalFileInstalls > patterns > pattern
//            files: [ // config > [requiredInstallFiles, conditionalFileInstalls > patterns > files]
//                {
//                    file: true, // [file, folder]
//                    source: "", // [file, folder].source
//                    destination: "", // file, folder].destination
//                    priority: 0 // [file, folder].priority
//                }
//            ]
//        }
//    ],
//    defaultFlags: {/* key-value pairs */} // Custom Wizardry
};

/* "Default Flags" XML
<!-- Hidden step to set condition flag defaults for the rest of the FOMOD to tamper with. -->
<InstallStep name="Default Flags Step"><Visible><Dependencies operator="And"><Flag name="false">true</Flag></Dependencies></Visible><OptionalFileGroups><Group name="_" type="SelectAll"><Plugins><Plugin name="_"><Description>_</Description>
    <ConditionFlags>
        <!-- Dynamically fill this spot the same as any other -->
    </ConditionFlags>
<TypeDescriptor><Type name="Required"/></TypeDescriptor></Plugin></Plugins></Group></OptionalFileGroups></InstallStep>
*/

// Translating Dependency types from Builder JSON to XML
const DependencyTypes = {
    "file": "fileDependency",
    "flag": "flagDependency",
    "modManagerVers": "fommDependency",
    "scriptExtenderVers": "foseDependency",
    "gameVers": "gameDependency"
};

/** Function to handle parsing `ModuleConfig.xml`
    @param {String} xmlString - The event object
    @returns {nil} nothing
*/
function parseModuleConfigXML(xmlString) {
    var temp_moduleConfig_xml = XMLParser.parseFromString(xmlString);
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

    // Get the module name
    builderJSON.moduleName = readXMLTag(temp_moduleConfig_xml, "moduleName");
     XMLParser.parseFromString(temp_moduleConfig_xml.getElementsByTagName("moduleName")[0].innerHTML, 'text/xml').toString();
    // Get the module image
    builderJSON.moduleImage = XMLParser.parseFromString(temp_moduleConfig_xml.getElementsByTagName("moduleImage")[0].innerHTML, 'text/xml').toString();

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
    @returns {nil}
*/
function parseInfoXML(xmlString) {
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
function setVersion(version, relaxed = false){
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
        closeSemVer();
    }
}

/**
@param {Array<String>} versArr Array of version strings to use
@param {number} pos Array index to pull from
@param {HTMLElement} element FOrm element to set the Value of
@param {Boolean} relaxed Whether to use relaxed parsing
*/
function parseVersComponent(versArr, pos, element, relaxed){
    if (!(versArr.length > pos)) {
        elm_inputVersionPatch.value = '';
        return;
    }

    try{
        elm_inputVersionPatch.value = parseIntExtremes(versArr[pos], relaxed);
    } catch {
        closeSemVer();
    }
}

function openSemVer(){
    // Turn the MDL checkbox off
    elm_toggleUseSemVer.removeAttribute('checked');
    elm_toggleUseSemVer.parentElement.classList.remove(builder_consts.isOpen);

    // Show the SemVer input fields
    elm_containerVersionSemVer.setAttribute('hidden', '');
    elm_containerVersionFull.removeAttribute('hidden');
}

function closeSemVer(){
    // Turn the MDL checkbox on
    elm_toggleUseSemVer.setAttribute('checked', '');
    elm_toggleUseSemVer.parentElement.classList.add(builder_consts.isOpen);

    // Hide the SemVer input fields
    elm_containerVersionSemVer.setAttribute('hidden', '');
    elm_containerVersionFull.removeAttribute('hidden');
}

function toggleSemVerInput() {
    if (checkToggleSwitch(elm_toggleUseSemVer)){
        setVersion(inputValue(elm_inputVersionFull, false), true);
        elm_containerVersionSemVer.removeAttribute('hidden');
        elm_containerVersionFull.setAttribute('hidden', '');
    } else {
        setVersion(`${inputValue(elm_inputVersionMajor, false)}.${inputValue(elm_inputVersionMinor, false)}.${inputValue(elm_inputVersionPatch, false)}`.replace(/^\.+|\.+$/g, ''), true);
        elm_containerVersionSemVer.setAttribute('hidden', '');
        elm_containerVersionFull.removeAttribute('hidden');
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
    setTimeout(/* 1000ms */ () => {
    if (checkToggleSwitch(elm_toggleInfoSchema)){
        console.log('Adding Schema to Info.xml (disabled by default)');
        // xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd"
        info_xml_tags.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        info_xml_tags.setAttribute('xsi:noNamespaceSchemaLocation', 'https://bellcubedev.github.io/site-testing/assets/site/misc/Info.xsd');
    }
    if (checkToggleSwitch(elm_toggleBranding) && !info_xml.documentElement.innerHTML.includes('BellCube\'s FOMOD Builder')){
        console.log('Adding Branding to Info.xml (disabled by default)');
        var comment = info_xml.createComment('\n    Created using BellCube\'s FOMOD Builder\n    https://bellcubedev.github.io/site-testing/tools/fomod/\n    The tool is currently in early testing, so any extra testers would be very welcome.\n');
        /*
            <!--
                Created using BellCube's FOMOD Builder
                https://bellcubedev.github.io/site-testing/tools/fomod/
                The tool is currently in early testing, so any extra testers would be very welcome!
            -->
        */
        info_xml.documentElement.innerHTML = comment.toString() + info_xml.documentElement.innerHTML;
    }

    console.log('Adding FOMOD Version to Info.xml');
    var versTag = getXMLTag(info_xml, 'Version');
    if (checkToggleSwitch(elm_toggleUseSemVer)) {
        versTag.innerHTML = encodeXML(inputValue(elm_inputVersionFull));
    } else {
        versTag.innerHTML = `${inputValue(parseIntRelaxed(elm_inputVersionMajor))}.${inputValue(parseIntRelaxed(elm_inputVersionMinor))}.${inputValue(parseIntRelaxed(elm_inputVersionPatch))}`;
    }

    writeFile(info_file, XMLParser.serializeToString(info_xml));

    console.log('After editing:\n', info_xml.documentElement);
    }, 1000);
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

/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 That code is available under CC-0: http://creativecommons.org/publicdomain/zero/1.0/
*/
/** Writes file contents to the file system.
    @param {FileSystemFileHandle} fileHandle - The file handle to write to.
    @param {string|BufferSource|Blob} contents - The data to write to the file.
    @returns {nil} nothing
*/
async function writeFile(fileHandle, contents) {

    // Condition for if we're doing an autosave
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}


/*$$$$$\   $$$$$$\  $$\      $$\       $$\   $$\   $$\     $$\ $$\
$$  __$$\ $$  __$$\ $$$\    $$$ |      $$ |  $$ |  $$ |    \__|$$ |
$$ |  $$ |$$ /  $$ |$$$$\  $$$$ |      $$ |  $$ |$$$$$$\   $$\ $$ | $$$$$$$\
$$ |  $$ |$$ |  $$ |$$\$$\$$ $$ |      $$ |  $$ |\_$$  _|  $$ |$$ |$$  _____|
$$ |  $$ |$$ |  $$ |$$ \$$$  $$ |      $$ |  $$ |  $$ |    $$ |$$ |\$$$$$$\
$$ |  $$ |$$ |  $$ |$$ |\$  /$$ |      $$ |  $$ |  $$ |$$\ $$ |$$ | \____$$\
$$$$$$$  | $$$$$$  |$$ | \_/ $$ |      \$$$$$$  |  \$$$$  |$$ |$$ |$$$$$$$  |
\_______/  \______/ \__|     \__|       \______/    \____/ \__|\__|\______*/

/** Convenience function to get the value of an input element. Will first attempt to get a user-submitted value, then will attempt to fetch a default from `builder_default`, before finally resorting to the `placeholder` attribute.
    @param {HTMLElement} element The Input element to get the value of
    @param {boolean} [usePlaceholder=true] Whether to use the `placeholder`. Defaults to True.
    @returns {string|number|boolean} The value of the input element
*/
function inputValue(element, usePlaceholder = true){
    try{
        //console.log(`inputValue(${element.id}): ${element.value}, ${element.getAttribute('builder_default')}, ${element.getAttribute('placeholder')}`);
        if (element.value != ''){return element.value;}

        if(element.hasAttribute('builder_default')){return element.getAttribute('builder_default');}

        if (element.hasAttribute('placeholder') && usePlaceholder){return element.getAttribute('placeholder');}
    
    } finally {} return '';
}

/** Convenience function to get the value of a toggle switch.
    @param {HTMLElement} element - The element to get the value of.
    @returns {boolean} - Whether or not the switch was enabled.
*/
function checkToggleSwitch(element){
    return element.parentElement.classList.contains(builder_consts.isOpen);
}

function setElementVars(){
    // Core
    elm_buttonFolderPicker = document.getElementById(`fomod_FolderPicker`);
    elm_buttonSave = document.getElementById(`fomod_saveButton`);

    // Info.xml (Metadata)
    elm_inputName = document.getElementById(`fomod_info_name`);
    elm_inputAuthor = document.getElementById(`fomod_info_author`);
    elm_inputID = document.getElementById(`fomod_info_ID`);
    elm_inputWebsite = document.getElementById(`fomod_info_website`);
    elm_toggleUseSemVer = document.getElementById(`fomod_config_toggleUseSemVer`);
    elm_containerVersionFull = document.getElementById(`fomod_info_version_cont`);
        elm_inputVersionFull = document.getElementById(`fomod_info_version_full`);
    elm_containerVersionSemVer = document.getElementById(`fomod_info_version_semver_cont`);
        elm_inputVersionMajor = document.getElementById(`fomod_info_version_major`);
        elm_inputVersionMinor = document.getElementById(`fomod_info_version_minor`);
        elm_inputVersionPatch = document.getElementById(`fomod_info_version_patch`);

    // Config
    elm_toggleAutosave = document.getElementById(`fomod_config_toggleAutosave`);
    elm_toggleConfigInXML = document.getElementById(`fomod_config_saveConfigXML`);
    elm_toggleConfigInCookie = document.getElementById(`fomod_config_saveConfigCookies`);
    elm_toggleInfoSchema = document.getElementById(`fomod_config_saveInfoSchema`);
    elm_toggleBranding = document.getElementById(`fomod_config_doBranding`);

    // collapsables
    elm_collapsableMetadata = document.getElementById(`details_builder_meta`);
    elm_collapsableGeneralAndConfig = document.getElementById(`details_builder_genConfig`);
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
function encodeXML (str) {
    return str.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
}

/** Decodes the specified string in XML formatting
    @param {string} str The string to decode
*/
function decodeXML (str) {
    return str.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&apos;/g, '\'');
}

/** Error-resilient function to read the value of the specified XML tag
    @param {Document|HTMLElement} The XML document to read from
    @param {String} tagName The name of the tag to read
    @param {Boolean} create  If the tag doesn't exist, should we create it?
    @returns {String} The value of the tag (`innerHTML` or `innerText` based on `doText`), or `''` if the tag doesn't exist
*/
function readXMLTag(xml, tagName, create = true){
    try{
        var tag = getXMLTag(xml, tagName, create);

        if (typeof tag === 'undefined') {return '';}

        return decodeXML(tag.innerHTML);
    } catch (e) {console.log(`Error "${e.name}" reading the value of tag '${tagName}'\n${e.stack}`);}
    return '';
}

/** Get the specified XML tag
    @param {Document|HTMLElement} xml The HTMLElement or Document to get the child of
    @param {String} tagName The name of the tag to read
    @param {Boolean} create If the tag doesn't exist, should we create it?
    @returns {HTMLElement} The specified tag, creating it and appending it to the end if it doesn't exist
*/
function getXMLTag(xml, tagName, create = true){

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
    } catch (e) {
        console.log(`Error "${e.name}" getting the tag '${tagName}'\n${e.stack}`);
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

