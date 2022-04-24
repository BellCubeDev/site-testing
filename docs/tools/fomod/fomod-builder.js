function print(message) {
    console.log("[BCD-FomodBuilder] "+message);
}

window.onload = init;

var rootDirectory;
var fomodDirectory;
var info_xml;
var moduleConfig_xml;

function init() {
    //print("Hello World!");

    folderPickerBttn = document.getElementById(`fomod_FolderPicker`);

    listenForDirectoryButton()
};

async function listenForDirectoryButton(){
    folderPickerBttn.addEventListener('click', async () => {
        openFomodDirectory()
    });
}

async function openFomodDirectory(){
    var temp_rootDirectory
        var temp_fomodDirectory;
        var temp_info_xml;
        var temp_moduleConfig_xml;
        try {

            temp_rootDirectory = await window.showDirectoryPicker();
            while (!temp_rootDirectory || temp_rootDirectory.name.toLowerCase() == 'fomod'){
                window.alert(`Please select the root folder (the one containing 'fomod') or name your folder something other than 'fomod'.`);
                return
            }

            while (
                !(await tryForPermission(temp_rootDirectory, 'readwrite'))
            ){
                if (!window.confirm(`The editor requires write permissions to the root folder. Please grant write permissions to the root folder or hit cancel.`)){
                    return
                }
            }
            document.getElementById(`fomod_FolderPicker_folderName`).innerHTML = temp_rootDirectory.name;
            
            temp_fomodDirectory = await temp_rootDirectory.getDirectoryHandle('fomod', {create: true});
            

            //directory = FileSystemDirectoryHandle
            print(`folder name: ${temp_rootDirectory.name}`);

            for await (const [key, value] of temp_rootDirectory.entries()) {
                print(`resolve(): ${JSON.stringify({key, value})}`);
            }

            temp_info_xml = await temp_fomodDirectory.getFileHandle('Info.xml', {create: true});
            temp_moduleConfig_xml = await temp_fomodDirectory.getFileHandle('ModuleConfig.xml', {create: true});
        } catch(e) {
            print(e);
        }
}

async function tryForPermission(object, perm){
    try{
        return await object.requestPermission({'mode': perm}) == 'granted'
    } catch(e) {
        if (e.prototype.name == 'AbortError'){
            return false
        }
    }
}


