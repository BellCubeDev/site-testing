/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can fund my functions in VSCode's Minimap
*/

/*$$$$$\
$$  __$$\
$$ |  $$ | $$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\  $$$$$$\   $$$$$$$\
$$$$$$$  |$$  __$$\ $$  __$$\ $$  __$$\ \$$\ $$  |$$  __$$\ $$  _____|
$$  __$$< $$$$$$$$ |$$ /  $$ |$$$$$$$$ | \$$$$  / $$$$$$$$ |\$$$$$$\
$$ |  $$ |$$   ____|$$ |  $$ |$$   ____| $$  $$<  $$   ____| \____$$\
$$ |  $$ |\$$$$$$$\ \$$$$$$$ |\$$$$$$$\ $$  /\$$\ \$$$$$$$\ $$$$$$$  |
\__|  \__| \_______| \____$$ | \_______|\__/  \__| \_______|\_______/
                    $$\   $$ |
                    \$$$$$$  |
                     \_____*/


var regex_Scriptname =
/^^Scriptname ([\w\d]+)(?:\s+extends ([\w\d]+))?(?:\s+(hidden))?(\s+(?:conditional))?(?:\s+(native))?(?:\n\{(.*?)\})?/is
;

var regex_Events =
/((?:^\s*;.*\n)+)(?:\s|;\/(?:\s|\S)*?\/;|\\)*Event(?:\s|;\/(?:\s|\S)*?\/;|\\)+([\w\d]+)(?:\s|;\/(?:\s|\S)*?\/;|\\)*\((?:\s|;\/(?:\s|\S)*?\/;|\\)*((?:[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)=(?:\s|;\/(?:\s|\S)*?\/;|\\)(?:[\w\d]+|".+(?<!\\)"))?(?:(?:\s|;\/(?:\s|\S)*?\/;|\\))*,(?:\s|;\/(?:\s|\S)*?\/;|\\)+)*[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:=(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:[\w\d]+|".+(?<!\\))?")?))?(?:\s|;\/(?:\s|\S)*?\/;|\\)*\)([\s\S]+?)^(?:\s|;\/(?:\s|\S)*?\/;|\\)*EndEvent/gmi
;

var regex_EventParams =
/(?:\s|;\/.*?\/;|\\)*([\w\d]+)(?:\s|;\/.*?\/;|\\)+([\w\d]+)(?:\s|;\/.*?\/;|\\)*(?:=(?:\s|;\/.*?\/;|\\)*(".+(?<!\\)"|[\w\d]+))?/gsi
;

var regex_Functions =
/((?:^\s*;.*\n)+)(?:[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)+)?Function(?:\s|;\/(?:\s|\S)*?\/;|\\)+([\w\d]+)(?:\s|;\/(?:\s|\S)*?\/;|\\)*\((?:\s|;\/(?:\s|\S)*?\/;|\\)*((?:[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)=(?:\s|;\/(?:\s|\S)*?\/;|\\)(?:[\w\d]+|".+(?<!\\)"))?,(?:\s|;\/(?:\s|\S)*?\/;|\\)+)*[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)=(?:\s|;\/(?:\s|\S)*?\/;|\\))?(?:[\w\d]+|".+(?<!\\)"))?(?:\s|;\/(?:\s|\S)*?\/;|\\)*\)(?:\s|;\/(?:\s|\S)*?\/;|\\)+(native|(?:([\s\S]+?)^(?:\s|;\/(?:\s|\S)*?\/;|\\)*EndFunction))/gmi
;

/*
    papy_docs_libName
    papy_docs_libLink
*/

var elem_papy_docs_libName;
var elem_papy_docs_libLink;
var elem_papy_docs_mdOutput;
function builder_init(){
    elem_papy_docs_libName = document.getElementById('papy_docs_lib-Name');
    elem_papy_docs_libLink = document.getElementById('papy_docs_lib-Link');
    elem_papy_docs_mdOutput = document.getElementById('papy_docs_md-output');
}

function setMarkdownOutput(str){
    // eslint-disable-next-line no-undef
    elem_papy_docs_mdOutput.innerHTML = hljs.highlight(str.replace(/^\s+/s, '').replace(/\s+$/, ''), {language: 'md'}).value;
}

/*

Regex Components:

    whitespace, long comments, escaped line endings (single character, non-capturing group):
        (?:\s|;\/(?:\s|\S)*?\/;|\\)

    Variable/Script/Etc. Name
        [\w\d]+

    Value (non-capturing group):
        (?:[\w\d]+|".+(?<!\\)")

*/



// eslint-disable-next-line no-unused-vars
async function generateDocs_file(){
    var file;
    try{
        file = (await window.showOpenFilePicker())[0];
    }catch(e){
        console.log(e);
        if (e.name === 'AbortError') {
            // No file selected. Aborting
            return;
        }else{
            throw e;
        }
    }

    if (!tryForPermission(file, 'read')) return;

    console.log(file);

    var realFile = await file.prototype.getFile();
    console.log(realFile);

    console.log(parseScript(readFile(realFile)));
}

// eslint-disable-next-line no-unused-vars
async function generateDocs_folder(){
    var folder;
    try{
        folder = await window.showDirectoryPicker();
        await attainDirPerms(folder);
    }catch(e){
        console.log(e);
        if (e.name === 'AbortError') {
            // No file selected. Aborting
            return;
        }else{
            throw e;
        }
    }
    console.log(folder);
    for (var [name, file] of folder.entries()) {
        console.log(name, file);
        if (file.kind === 'file') {
            writeFile(folder.getFileHandle(`${file.name}.md`, {create: true}), parseScript(readFile(file.file)));
        }
    }
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
        return await object.queryPermission({'mode': perm}) === 'granted' || await object.requestPermission({'mode': perm}) === 'granted';
    } catch(e) {
        if (e.name != 'AbortError') throw e;
    }
    return false;
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
    fileHandle.createWritable().then((writable) =>{
        writable.write(contents);
        writable.close();
    });
}





/** Verify the specified directory
    @param {FileSystemDirectoryHandle} dir
    @throws {DOMException} 'AbortError' If the user fails to give permissions for the directory
    @returns {nil} nothing
*/
async function attainDirPerms(dir) {
    while (!(await tryForPermission(dir, 'readwrite'))){
        if (!window.confirm(
            document.getElementById(`fomod_localization_folderPicker_needsWriteAccess`).innerText
        )){
            throw new DOMException('User denied directory write access', 'AbortError');
        }
    }
}






/*$$$$$\                      $$\             $$\     $$$$$$$\
$$  __$$\                     \__|            $$ |    $$  __$$\
$$ /  \__| $$$$$$$\  $$$$$$\  $$\  $$$$$$\  $$$$$$\   $$ |  $$ | $$$$$$\   $$$$$$\   $$$$$$$\  $$$$$$\
\$$$$$$\  $$  _____|$$  __$$\ $$ |$$  __$$\ \_$$  _|  $$$$$$$  | \____$$\ $$  __$$\ $$  _____|$$  __$$\
 \____$$\ $$ /      $$ |  \__|$$ |$$ /  $$ |  $$ |    $$  ____/  $$$$$$$ |$$ |  \__|\$$$$$$\  $$$$$$$$ |
$$\   $$ |$$ |      $$ |      $$ |$$ |  $$ |  $$ |$$\ $$ |      $$  __$$ |$$ |       \____$$\ $$   ____|
\$$$$$$  |\$$$$$$$\ $$ |      $$ |$$$$$$$  |  \$$$$  |$$ |      \$$$$$$$ |$$ |      $$$$$$$  |\$$$$$$$\
 \______/  \_______|\__|      \__|$$  ____/    \____/ \__|       \_______|\__|      \_______/  \_______|
                                  $$ |
                                  $$ |
                                  \_*/




/** Parses the specified script into Markdown documentation
    @param {string} scriptStr - The script to parse
    @returns {string} - The Markdown-formatted documentation
*/
function parseScript(scriptStr) {
    var scriptname = parseScriptName(scriptStr);
    return `# ${scriptname.name}
| :-: | :-- |
| Engine-Bound Type | ============================== |
| [Parent](/skyrim/developers/papyrus/concepts/scripts#parents) | ${scriptname.parent} |
| [Library](/skyrim/developers/papyrus/concepts/libraries) | [Vanilla](/skyrim/developers/papyrus/vanilla) |




`;
}


/** Parses the "Scriptname" portion of the script
    @param {string} scriptStr - The script to parse
    @returns {
        {
            name: string,
            included_documentation: string,
            parent: string,
            conditional: boolean,
            hidden: boolean,
            native: boolean
        }} - Properties for use in the Markdown documentation
*/
function parseScriptName(scriptStr) {
    var parsed = regex_Scriptname.exec(scriptStr);

    return {
        name: parsed[1],

        included_documentation: typeof parsed[6] === 'undefined' ? '' : parsed[6],

        parent: typeof parsed[2] === 'undefined' ? '[Top-Level](/skyrim/developers/papyrus/top-level-index)' : parsed[2],

        hidden: typeof parsed[3] !== 'undefined',
        conditional: typeof parsed[4] !== 'undefined',
        native: typeof parsed[5] !== 'undefined'
    };
}

/** Parses the Events in the script
    @param {string} scriptStr - The script to parse
    @returns {Array<{
        name: string,
        description: string,
        parameters: Array<{
            type: string,
            name: string,
            default: string
        }>,
        body: string
    }>} - An array of event objects
*/
function parseEvents(scriptStr) {
    var events = [];
    var parsed = scriptStr.matchAll(regex_Events);
    for (var _event of parsed){

        // Parse Event Parameters
        if (typeof _event[3] !== 'undefined'){
            var params_formatted = [];
            var params = _event[3].matchAll(regex_EventParams);
            for (var _param of params){
                params_formatted.push({
                    type: _param[1],
                    name: _param[2],
                    default: typeof _param[3] === 'undefined' ? '' : _param[3]
                });
            }
        }

        events.push({
            name: _event[2],
            description: _event[1].replace(/^\s/, '').replace(/\s$/, '').replace(/\s$/m, '').replace(/^\s*;\s*/m, ''),
            parameters: params_formatted,
            body: typeof _event[4] === 'undefined' ? '' : _event[4].replace(/^\s/, '').replace(/\s$/, '').replace(/\s$/m, '')
        });
    }
    return events;
}




/*$$$$$\   $$$$$$\  $$\      $$\       $$\   $$\   $$\     $$\ $$\
$$  __$$\ $$  __$$\ $$$\    $$$ |      $$ |  $$ |  $$ |    \__|$$ |
$$ |  $$ |$$ /  $$ |$$$$\  $$$$ |      $$ |  $$ |$$$$$$\   $$\ $$ | $$$$$$$\
$$ |  $$ |$$ |  $$ |$$\$$\$$ $$ |      $$ |  $$ |\_$$  _|  $$ |$$ |$$  _____|
$$ |  $$ |$$ |  $$ |$$ \$$$  $$ |      $$ |  $$ |  $$ |    $$ |$$ |\$$$$$$\
$$ |  $$ |$$ |  $$ |$$ |\$  /$$ |      $$ |  $$ |  $$ |$$\ $$ |$$ | \____$$\
$$$$$$$  | $$$$$$  |$$ | \_/ $$ |      \$$$$$$  |  \$$$$  |$$ |$$ |$$$$$$$  |
\_______/  \______/ \__|     \__|       \______/    \____/ \__|\__|\______*/




function inputValue(element, usePlaceholder = true){
    try{
        if (element.value != ''){return element.value;}

        if(element.hasAttribute('builder_default')){return element.getAttribute('builder_default');}

        if (element.hasAttribute('placeholder') && usePlaceholder){return element.getAttribute('placeholder');}

    } finally {} return '';
}



