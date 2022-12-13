import { trimWhitespace, capitalizeFirstLetter } from '../../../universal.js';
import hljs from  '../../../assets/site/highlight_js/es/highlight.js';

// HLJS Language Definition
import '../../../assets/site/highlight_js/languages/markdown.min.js';

/*
    Thanks to Patrick Gillespie for the great ASCII art generator!
    https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Big%20Money-nw
    ...makes this code *so* much easier to maintain... you know, 'cuz I can find my functions in VSCode's Minimap
*/
var elem_papy_docs_libName:HTMLInputElement;
var elem_papy_docs_libLink:HTMLInputElement;
var elem_papy_docs_registerPattern:HTMLInputElement;
var elem_papy_docs_mdOutput:HTMLElement;
var elem_papy_docs_filePicker:HTMLElement;
var elem_papy_docs_folderPicker:HTMLElement;

export function ___bcdLoad_autoPapyDocsInit() { //@ts-ignore Cannot find name 'autoPapyDocs'.
    const temp_elements = [
        document.getElementById('papy_docs_lib-Name'),
        document.getElementById('papy_docs_lib-Link'),
        document.getElementById('papy_docs_register-pattern'),
        document.getElementById('papy_docs_md-output'),
        document.getElementById('papy_docs_file-picker'),
        document.getElementById('papy_docs_folder-picker')
    ];
    if (temp_elements.some(e => e === null)) {
        console.log(temp_elements);
        throw new TypeError(`Looks like we're Missing elements!`);
    }

    elem_papy_docs_libName = temp_elements[0] as HTMLInputElement;

    elem_papy_docs_libLink = temp_elements[1] as HTMLInputElement;

    elem_papy_docs_registerPattern = temp_elements[2] as HTMLInputElement;

    elem_papy_docs_mdOutput = temp_elements[3]!;

    elem_papy_docs_filePicker = temp_elements[4]!;
    elem_papy_docs_filePicker.addEventListener(window.clickEvt, generateDocs_file);

    elem_papy_docs_folderPicker = temp_elements[5]!;
    elem_papy_docs_folderPicker.addEventListener(window.clickEvt, generateDocs_folder);

} //@ts-ignore: Property 'bcd_init_functions' does not exist on type 'Window & typeof globalThis'.
window.bcd_init_functions.papyDocs = ___bcdLoad_autoPapyDocsInit;

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


const regex_Scriptname =
/^Scriptname ([\w\d]+)(?:\s+extends ([\w\d]+))?(?:\s+(hidden))?(\s+(?:conditional))?(?:\s+(native))?(?:[\n\s]+\{([^}]+)\})?/is;

const regex_Events =
/\n*((?:^\s*;.*\n)+)(?:\s|;\/(?:\s|\S)*?\/;|\\)*Event(?:\s|;\/(?:\s|\S)*?\/;|\\)+([\w\d]+)(?:\s|;\/(?:\s|\S)*?\/;|\\)*\((?:\s|;\/(?:\s|\S)*?\/;|\\)*((?:[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)*=(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:[\w\d]+|".*?(?<!\\)"))?(?:(?:\s|;\/(?:\s|\S)*?\/;|\\))*,(?:\s|;\/(?:\s|\S)*?\/;|\\)+)*[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:=(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:[\w\d]+|".*?(?<!\\)"))?))?(?:\s|;\/(?:\s|\S)*?\/;|\\)*\)([\s\S]+?)^(?:\s|;\/(?:\s|\S)*?\/;|\\)*EndEvent/gim;

const regex_EventParams =
/(?:\s|;\/.*?\/;|\\)*([\w\d]+)(\[])?(?:\s|;\/.*?\/;|\\)+([\w\d]+)(?:\s|;\/.*?\/;|\\)*(?:=(?:\s|;\/.*?\/;|\\)*(".+(?<!\\)"|[\w\d]+))?/gsi;

const regex_Functions =
/\n*((?:^\s*;.*\n)+)?(?:([\w\d]+)(\[.*?\])?(?:\s|;\/(?:\s|\S)*?\/;|\\)+)?Function(?:\s|;\/(?:\s|\S)*?\/;|\\)+([\w\d]+)(?:\s|;\/(?:\s|\S)*?\/;|\\)*\((?:\s|;\/(?:\s|\S)*?\/;|\\)*((?:[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)*=(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:[\w\d]+(?:\.\d+)?|".*?(?<!\\)"))?(?:(?:\s|;\/(?:\s|\S)*?\/;|\\))*,(?:\s|;\/(?:\s|\S)*?\/;|\\)+)*[\w\d]+(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+[\w\d]+(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:=(?:\s|;\/(?:\s|\S)*?\/;|\\)*(?:[\w\d]+(?:\.\d+)?|".*?(?<!\\)"))?))?(?:\s|;\/(?:\s|\S)*?\/;|\\)*\)(?:\s|;\/(?:\s|\S)*?\/;|\\)+(?:(global)(?:\s|;\/(?:\s|\S)*?\/;|\\)+)?(?:(native)(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+(global))?(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+\{(.*?)\})?|(?:(?:(?:\s|;\/(?:\s|\S)*?\/;|\\)+\{(.*?)\})?([\s\S]+?)^(?:\s|;\/(?:\s|\S)*?\/;|\\)*EndFunction))/gmi;

/*
    papy_docs_libName
    papy_docs_libLink
*/

/** Sets the output area's text with syntax highlighting*/
function setMarkdownOutput(str:string){
    //console.log(str);
    elem_papy_docs_mdOutput.innerHTML = hljs.highlight(str, {language: 'md'}).value;
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



async function generateDocs_file(){
    var file;
    try{
        file = (await window.showOpenFilePicker())[0];
    }catch(e){
        //console.log(e);
        if (e instanceof Error && e.name === 'AbortError') {
            // No file selected. Aborting
            return;
        }else{
            throw e;
        }
    }

    if (!tryForPermission(file, 'read')) return;

    //console.log(file);
    //console.log(await file.getFile());

    setMarkdownOutput(parseScript(await readFile(await file.getFile())));
}

async function generateDocs_folder(){
    var folder;
    try{
        folder = await window.showDirectoryPicker();
        await attainDirPerms(folder);
    }catch(e){
        //console.log(e);
        // @ts-ignore Object is of type 'unknown'.
        if (e.name === 'AbortError') {
            // No file selected. Aborting
            return;
        }else{
            throw e;
        }
    }
    //console.log(folder, folder.entries());
    //var entries = folder.entries();
    //console.log(await entries.next());
    await forEachFile(folder, iterationFunction, -1);

    /** @param {string} name @param {FileSystemHandle} file */
    async function iterationFunction(name:string, file:FileSystemHandle, directory:FileSystemDirectoryHandle){
        //console.log(name, file);
        if (file.kind === 'file' && name.endsWith('.psc')) {
            var tempOut = parseScript(await readFile(await (file as FileSystemFileHandle).getFile()));
            writeFile(await directory.getFileHandle(`${name}.md`, {create: true}), tempOut);
            setMarkdownOutput(tempOut);
        }
    }
}

/** Executes a callback for each file in the specified directory, recursing as requested.
    @param {FileSystemDirectoryHandle} dir The directory to iterate over
    @param {async function(string, FileSystemFileHandle, FileSystemDirectoryHandle)} callback The function to execute for each file
    @param {number} [recursion = 0] The number of levels to recurse into subdirectories. Negative numbers will recurse indefinitely.
    @param {function} finalCallback The function to execute when the iteration is complete
*/
async function forEachFile(dir:FileSystemDirectoryHandle, callback:Function, recursion = 0): Promise<unknown> {
    var promises = [];
    for await (const [name, file] of dir.entries()) {
        if (file.kind === 'file') {
            promises.push(callback(name, file, dir));
        } else if (file.kind === 'directory' && recursion != 0) {
            promises.push(forEachFile(file, callback, recursion - 1));
        }
    }
    return await Promise.all(promises);
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
async function tryForPermission(object:FileSystemFileHandle, perm:string){
    return await object.queryPermission({mode: perm as FileSystemPermissionMode }) === 'granted' || await object.requestPermission({mode: perm as FileSystemPermissionMode }) === 'granted';
    //return false;
}






/** Reads the specified file and returns its contents*/
function readFile(file:File):Promise<string>{
    // Nice job, Copilot!
    return new Promise((resolve, reject) => {
        const temp_fileReader = new FileReader();
        temp_fileReader.onload = (readerEvent) => {
            if (readerEvent.target && typeof readerEvent.target.result === 'string') resolve(readerEvent.target.result.replace(/\r\n?/g, '\n'));
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
/** Writes file contents to the file system.*/
async function writeFile(fileHandle:FileSystemFileHandle, contents:string|BufferSource|Blob):Promise<void> {
    //console.log(fileHandle);
    fileHandle.createWritable().then(async (writable:FileSystemWritableFileStream) =>{
        await writable.write(contents);
        writable.close();
    });
}





/** Attain permissions for the specified directory
    @param {FileSystemDirectoryHandle} dir
    @throws {DOMException} 'AbortError' If the user fails to give permissions for the directory
    @returns {nil} nothing
*/
async function attainDirPerms(dir:FileSystemDirectoryHandle) {
    while (!(await tryForPermission(dir as FileSystemHandle as FileSystemFileHandle, 'readwrite'))){
        if (!window.confirm("You must give write permissions for this directory to use this application.\n\nClick OK to give permissions.")){
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


// Various interfaces for intuitively defining various components of Papyrus for parsing.
interface papyrus_Type {
    type: string,
    is_array: boolean
}

interface papyrus_Parameter extends papyrus_Type {
    name: string;
    default: string;
}

interface papyrus_Function {
    name: string,
    returns: papyrus_Type,
    description: string,
    parameters: papyrus_Parameter[],
    global: boolean,
    native: boolean,
    body: string
}

interface papyrus_Event extends papyrus_Function {
    global: false,
    native: false,
    returns: {type: 'None', is_array: false}
}

interface papyrus_Script {
    name: string,
    included_documentation?: string,
    parent: string,
    conditional: boolean,
    hidden: boolean,
    native: boolean
}



/** Parses the passed-in script into Markdown documentation */
function parseScript(scriptStr:string):string {
    var scriptname = parseScriptName(scriptStr);
    var functions = sortArrayOfObjectAlphaByKey(
        parseFunctions(scriptStr), 'name'
        ) as papyrus_Function[];
    var functionTable = '';

    var events = sortArrayOfObjectAlphaByKey(parseEvents(scriptStr), 'name');
    var eventTable = '';
    /* Example:
    |   Event   |                    Description                    | [Registration](https://modding.wiki/en/skyrim/developers/papyrus/concepts/functions#registration) |                Parameters                |
    |    :--    |                        :-:                        |                                                :-:                                                |                   :--                    |
    | OnLostLOS | Sent when an actor cannot see the target anymore. |                                                Yes                                                | Actor akViewer, ObjectReference akTarget |
    */
    for (var event of events) {
        // eslint-disable-next-line prefer-template
        var eventTableRow = `| [${event.name}](${inputValue(elem_papy_docs_libLink).replace(/\/?$/, '/')}${scriptname.name}/${event.name}) | ${event.description.replace(/\n/g, '<br />')}${
            scriptStr.toLowerCase().includes(
                inputValue(elem_papy_docs_registerPattern).replace(/%e%/ig,
                    event.name.replace(/^on/i, '').replace(/(?:event)?(?:unregister(?:ed)?)?$/i, '').replace(/start|stop/i, '')
                ).toLowerCase()
            ) ? ' | Registered | ' : ' | Unregistered | '}` +
            event.parameters.map((param:papyrus_Parameter) => `\`${param.type}\` *${param.name}*`).join(', <br />').replace(/, <br \/>$/, '') +
        ' |\n';
        eventTable += eventTableRow;
    }

    /* Example:
        | Return Type | Function | Description | Parameters | [Global](/en/skyrim/developers/papyrus/concepts/functions#global_flag)? | [Native](/skyrim/developers/papyrus/concepts/functions#native-flag)?
        | --: | :-: | :-: | :-: | :-: | :-: |
        | Int | GetFormID | Returns the form of of the form you run this on |     | No | Yes |
    */
    for (var func of functions) {
        // eslint-disable-next-line prefer-template
        var funcTableRow = `| ${func.returns.type}${func.returns.is_array ? '[]' : ''} | ${func.name} | ${func.description.replace(/\n/g, '<br />')} | ` +

        func.parameters.map(param => `\`${param.type}\` *${param.name}*`).join(', <br />').replace(/, <br \/>$/, '') +

        `| ${func.global ? 'Global' : 'Member'} | ${func.native ? 'Native' : 'Scripted'} |\n`;
        functionTable += funcTableRow;
    }

    return trimWhitespace(`# ${scriptname.name}

| :-: | :-- |
| Engine-Bound Type | <!-- **USER-INPUTTED** --> | <!-- e.g. \`_NPC\` (Actor) -->
| [Parent](/skyrim/developers/papyrus/concepts/scripts#parents) | ${scriptname.parent} |
| [Library](/skyrim/developers/papyrus/concepts/libraries) | [${inputValue(elem_papy_docs_libName)}](${inputValue(elem_papy_docs_libLink)}) |

${scriptname?.included_documentation?.replace(/^/gsm, '> ').replace(/^> $/g, '')}

<!-- **Add extra description HERE** -->${functionTable.length > 0 ? `



## [Native Functions](/skyrim/developers/papyrus/concepts/functions#native-flag)
| Return Type | Function | Description | Parameters | [Global](/en/skyrim/developers/papyrus/concepts/functions#global_flag)? | [Native](/skyrim/developers/papyrus/concepts/functions#native-flag)?
| --: | :-: | :-: | :-: | :-: | :-: |` : ''}
${functionTable}${eventTable.length > 0 ? `



## [Events](https://modding.wiki/en/skyrim/developers/papyrus/concepts/events)
| Event | Description | [Registration](https://modding.wiki/en/skyrim/developers/papyrus/concepts/functions#registration) | Parameters |
| :-- | :-: | :-: | :-- |` : ''}
${eventTable}



# Returning [Native Functions](https://modding.wiki/en/skyrim/developers/papyrus/concepts/functions#native-flag)

[Native Functions](https://modding.wiki/en/skyrim/developers/papyrus/concepts/functions#native-flag) from any script or library that return an instance of this script

<!-- **MUST BE CREATED MANUALLY** -->
| Function | Description | [Array](/skyrim/developers/papyrus/concepts/arrays) | Script  | Library |
|    :-:   |     :-:     |                         :-:                         |   :-:   |   :-:   |



# [Children](/skyrim/developers/papyrus/concepts/scripts#children)

Scripts extending this script

<!-- **MUST BE CREATED MANUALLY** -->
| Script Name | Has Engine-Bound Type? | <!-- Scripts with engine-bound types should come first -->
|     :-:     |          :-:           |
`, true);
}


/** Parses the "Scriptname" portion of a script */
function parseScriptName(scriptStr:string): papyrus_Script {
    var parsed = regex_Scriptname.exec(scriptStr);
    if (!parsed) return {
        name: '',
        parent: '',
        included_documentation: '',
        conditional: false,
        hidden: false,
        native: false
    };
    return {
        name: parsed[1] ?? '',

        included_documentation: typeof parsed[6] === 'undefined' ? '' : parsed[6],

        parent: typeof parsed[2] === 'undefined' ? '[Top-Level](/skyrim/developers/papyrus/top-level-index)' : parsed[2],

        hidden: typeof parsed[3] !== 'undefined',
        conditional: typeof parsed[4] !== 'undefined',
        native: typeof parsed[5] !== 'undefined'
    };
}



/** Parses the Events in the script */
function parseEvents(scriptStr:string):papyrus_Event[] {
    //console.log('Parsing events...');
    //console.log(regex_Events);
    //console.log(scriptStr);
    var events:papyrus_Event[] = [];
    var parsed = scriptStr.matchAll(regex_Events);
    //console.log('Events Parsed:', parsed);
    for (var _event of parsed){
        //console.log(`Current Event:`, _event);
        // Parse Event Parameters

        events.push({
            name: _event[2] ?? '',
            description: trimWhitespace(_event[1] ?? '').replace(/^\s*;\s*/gm, ''),
            parameters: parseParameters(_event[3] ?? ''),
            body: typeof _event[4] === 'undefined' ? '' : trimWhitespace(_event[4]),
            global: false,
            native: false,
            returns: {type: 'None', is_array: false}
        });
    }
    //console.log('parseEvents(): ', events);
    return events;
}

function parseParameters(paramStr:string):papyrus_Parameter[] {
    if (typeof paramStr !== 'string') return [];

    const result_arr : papyrus_Parameter[] = [];
    const params = paramStr.matchAll(regex_EventParams);

    for (var _param of params){
        result_arr.push({
            type: capitalizeFirstLetter(_param[1] ?? ''),
            is_array: _param[2] !== undefined,
            name: _param[3] ?? '',
            default: typeof _param[4] === 'undefined' ? '' : _param[3] ?? ''
        });
    }

    return result_arr;
}

/** Parses the Events in the script
    @param {string} scriptStr - The script to parse
    @returns {Array<>} - An array of event objects
*/

function parseFunctions(scriptStr:string):papyrus_Function[] {
    const functions:papyrus_Function[] = [];
    const parsed = scriptStr.matchAll(regex_Functions);
    for (const _function of parsed){
        functions.push({
            returns: {type: typeof _function[2] === 'undefined' ? '' : capitalizeFirstLetter(_function[2]), is_array: typeof _function[3] !== 'undefined'},
            name: _function[4] ?? '',
            description: // Concatenate the various possible description matches
                (typeof _function[1] === 'undefined' ? '' : trimWhitespace(_function[1]).replace(/^\s*;\s*/gm, '')) +
                    (typeof _function[1] === 'undefined' || typeof _function[8] === 'undefined' ? '' : '\n\n') +
                (typeof _function[8] === 'undefined' ? '' : trimWhitespace(_function[8]).replace(/^\s*;\s*/gm, '')) +
                    (typeof _function[8] === 'undefined' || typeof _function[9] === 'undefined' ? '' : '\n\n') +
                (typeof _function[9] === 'undefined' ? '' : trimWhitespace(_function[9]).replace(/^\s*;\s*/gm, '')),

            parameters: parseParameters(_function[5] ?? ''),
            global: typeof _function[6] !== 'undefined' || typeof _function[8] !== 'undefined',
            native: typeof _function[7] !== 'undefined',
            body: _function[11] === 'string' ? trimWhitespace(_function[9] ?? '') : ''
        });
    }
    return functions;
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
    @returns {string} The value of the input element
*/
function inputValue(element:HTMLInputElement, usePlaceholder:boolean = true):string{
    //console.log(element);
    if (typeof element === 'undefined') return '';
    try{
        if (typeof element.value !== 'undefined' && element.value != '') return element.value;

        if (element.hasAttribute('placeholder') && usePlaceholder) return element.getAttribute('placeholder') ?? '';

    } finally {} return '';
}


function sortArrayOfObjectAlphaByKey<TArr extends unknown[]>(obj:TArr, key:keyof TArr[number]): TArr {
    return obj.sort((a:TArr[number], b:TArr[number]) => {
        var textA = JSON.stringify(a[key]).toUpperCase();
        var textB = JSON.stringify(b[key]).toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}