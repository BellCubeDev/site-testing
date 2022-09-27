import * as classes from './fomod-builder-classifications.js';
import * as files from '../../filesystem-interface.js';

interface IFomodFolder {
    fomodDir: files.folderDirectoryEntry;
    infoFile: files.folderEntry;
    moduleFile: files.folderEntry;
}
export function getFomodFilesFromFolder(folder: files.folder) : IFomodFolder {
    const fomodFolder = folder.childrenInsensitive['fomod']
    if (!('children' in fomodFolder)) throw new TypeError('The folder contains a folder named "fomod" - not a file!');
    return {
        fomodDir: fomodFolder,
        infoFile: fomodFolder.children['info.xml'],
        moduleFile: fomodFolder.children['moduleconfig.xml']
    };
}

export function translateWhole(module: string, info: string) : classes.FOMOD {
    const parser = new DOMParser();


    const moduleDoc = parser.parseFromString(module, 'text/xml');
    const moduleMainElem = moduleDoc.querySelector('config');

    if (!moduleMainElem) throw new TypeError('No <config> element found in supplied ModuleConfig file.');



    const infoDoc = parser.parseFromString(info, 'text/xml');
    const infoMainElem = infoDoc.querySelector('fomod');

    if (!infoMainElem) throw new TypeError('No <fomod> element found in supplied Info file.');



    return new classes.FOMOD(moduleMainElem, infoMainElem);
}