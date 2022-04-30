const XMLParser = new DOMParser();
const fileReader = new FileReader();

function print(message) {
    console.log("[BCD-FomodBuilder] "+message);
}

window.onload = init;

var rootDirectory;
var fomodDirectory;
var info_file;
var info_xml;
var info_xml_tags;
var moduleConfig_file;
var moduleConfig_xml;

var importantElements

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
        var temp_rootDirectory;
        var temp_fomodDirectory;
        var temp_info_file;
        var temp_info_xml;
        var temp_moduleConfig_file;
        var temp_moduleConfig_xml;
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

            temp_fomodDirectory = await temp_rootDirectory.getDirectoryHandle('fomod', {create: true});


            //directory = FileSystemDirectoryHandle
            print(`folder name: ${temp_rootDirectory.name}`);

            /*
            for await (const [key, value] of temp_rootDirectory.entries()) {
                print(`resolve(): ${JSON.stringify({key, value})}`);
            }
            *///364

            await temp_fomodDirectory.getFileHandle('Info.xml', {create: true}).then(fileHandle => {
                print(`fileHandle: ${fileHandle}`);
                temp_info_file = fileHandle;
                temp_info_file.getFile().then(file => {
                    print(`file: ${file}`);
                    temp_info_file = file;
                    print(`temp_info_file: ${temp_info_file}`);

                    temp_info_file.text().then(text => {
                        print(`temp_info_file.text(): ${text}`);
                    });

                    const temp_xmlReader = new FileReader()
                    temp_xmlReader.onload = readerEvent => {
                        print(`readerEvent.target.result: ${readerEvent.target.result}`);
                        temp_info_xml = XMLParser.parseFromString(readerEvent.target.result, "text/xml");
                        print(`temp_info_xml: ${temp_info_xml}`);
                        print(`innerText of temp_info_xml:\n====================\n${temp_info_xml.documentElement.innerHTML}\n====================`);

                        info_xml_tags = temp_info_xml.children;

                        print(`info_xml_tags: ${info_xml_tags}`);
                        print(`info_xml_tags[0]: ${info_xml_tags[0]}`);
                        print(`info_xml_tags.length: ${info_xml_tags.length}`);

                        for (let item of info_xml_tags) {
                            print(`info_xml_tags: ${item.innerHTML}`);
                        }

                    }

                    print(`Reading file ${temp_info_file.webkitRelativePath}\\${temp_info_file.name}... fold your horses!`);
                    temp_xmlReader.readAsText(temp_info_file)
                });
            });

            /*
            await temp_fomodDirectory.getFileHandle('ModuleConfig.xml', {create: true}).then(fileHandle => {
                temp_info_file = fileHandle;
            });
            await temp_moduleConfig_file.getFile().then((file) => {
                temp_info_file = file;
            });
            */

            //temp_xmlReader.addEventListener('load', temp_loadEvent);
            //temp_xmlReader.addEventListener('error', temp_loadEvent);
            //temp_xmlReader.addEventListener('abort', temp_loadEvent);

            //temp_moduleConfig_xml = XMLParser.parseFromString(await temp_moduleConfig_file.text(), "text/xml");


        } catch(e) {
            print(e);
        }
}

/**
    Runs a conditional to see if the file should be auto-saved before saving it with `writeFile()`.
*/
async function autoSaveFile(fileHandle, contents) {
    if (importantElements.toggleAutosave.classList.contains('is-checked')) {
        writeFile(fileHandle, contents);
    }
}

/*
 This function was taken from https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 That code is available under http://creativecommons.org/publicdomain/zero/1.0/
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

