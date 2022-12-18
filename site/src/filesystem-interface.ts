import * as universal from './universal.js';

export interface folderEntry {
    handle: FileSystemHandle;
}

function getFolderFromFolder<TCreate extends true|false>(this: folder, create: TCreate, target: Record<string, Promise<folder>>, prop: string): TCreate extends true ? Promise<folder> : Promise<folder>|null {
    // Make the name case-insensitive
    const name = prop.toLowerCase();

    // Fetch/create folder if it doesn't already exist
    try {
        if (!(name in target)){
            const dir = (async() => new folder(
                await this.handle.getDirectoryHandle(prop, {create})
            ))();

            this.childDirs[name] = dir;
            this.childDirsC[name] = dir;
        }
    } catch (e) {
        if (e instanceof DOMException && e.name === 'NotFoundError') this.childDirs[name] = null;
        throw e;

    }

    // Return the newly-assured folder (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}

function getFileFromFolder<TCreate extends true|false>(this: folder, create: TCreate, target: Record<string, Promise<FileSystemFileHandle>|null>, prop: string):TCreate extends true ? Promise<FileSystemFileHandle> : Promise<FileSystemFileHandle>|null {

    // Make the name case-insensitive
    const name = prop.toLowerCase();

    // Fetch/create file if it doesn't already exist
    try {
        if (!(name in target)) {
            const handle = this.handle.getFileHandle(prop, {create});
            this.childFiles[name] = handle;
            this.childFilesC[name] = handle;
        }

    } catch (e) {
        if (e instanceof DOMException && e.name === 'NotFoundError') this.childFiles[name] = null;
        else throw e;
    }

    // Return the newly-assured file (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}


export class folder {
    readonly handle: FileSystemDirectoryHandle;

    readonly childDirs: Record<string, Promise<folder>|null> = new Proxy({}, {
        get: getFolderFromFolder.bind(this, false),
    });
    readonly childDirsC: Record<string, Promise<folder>> = new Proxy({}, {
        get: getFolderFromFolder.bind(this, true),
    });

    readonly childFiles: Record<string, Promise<FileSystemFileHandle>|null> = new Proxy({}, {
        get: getFileFromFolder.bind(this, false),
    });

    readonly childFilesC: Record<string, Promise<FileSystemFileHandle>> = new Proxy<Record<string, Promise<FileSystemFileHandle>>>({}, {
        get: getFileFromFolder.bind(this, true),
    });

    constructor(handle: FileSystemDirectoryHandle) {
        this.handle = handle;
    }
}

export class writeableFolder extends folder {
    /** A folder that you have VERIFIED is writeable
     * @param handle The handle to the folder
     * @param SUPER_IMPORTANT__IS_THIS_FOLDER_WRITEABLE This is a boolean that you have verified is true. If it is false, you will get an error. If you set it to true, MAKE SURE THAT YOU ARE VERIFYING THAT THE FOLDER IS WRITEABLE. If you don't, you'll get more primitive errors.
    */
    constructor(handle: FileSystemDirectoryHandle, SUPER_IMPORTANT__IS_THIS_FOLDER_WRITEABLE: true) {
        if (SUPER_IMPORTANT__IS_THIS_FOLDER_WRITEABLE !== true) throw new Error("This folder is not writeable!");
        super(handle);
    }
}

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write: boolean): Promise<folder>

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write: true): Promise<writeableFolder>

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write?: boolean): Promise<folder> {
    // Construct a string to represent the permissions we need
    const permStr: 'read'|'readwrite' = `read${write ? 'write' : ''}`;

    // Get the directory
    const thisHandle = await window.showDirectoryPicker({mode: permStr});

    // Fetch current permission state
    let permState = await thisHandle.queryPermission({mode: permStr});

    // Request permission if we don't already have it
    if (permState !== 'granted') permState = await thisHandle.requestPermission({mode: permStr});

    //Return the handle ONLY if we have the required permissions
    if (permState === 'granted') return write ?
                                        new writeableFolder(thisHandle, true) :
                                        new folder(thisHandle);

    else throw new Error(`Permission denied: current state is ${permState}`);
}
