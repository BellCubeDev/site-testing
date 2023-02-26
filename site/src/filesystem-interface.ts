export interface folderEntry {
    handle: FileSystemHandle;
}

export class InvalidNameError extends Error {
    constructor(message: string, cause: string) {
        super(`${message} (Offending name: "${cause}")`);
        this.name = 'InvalidNameError';
        this.cause = cause;
    }
}

export function getFolderFromFolder<TCreate extends false>(this: Folder, create: TCreate, target: Record<string, Promise<Folder | null>>, prop: string): Promise<Folder | null>
export function getFolderFromFolder<TCreate extends true >(this: Folder, create: TCreate, target: Record<string, Promise<Folder>>, prop: string): Promise<Folder>
export function getFolderFromFolder<TCreate extends true|false>(this: Folder, create: TCreate, target: Record<string, Promise<Folder>> | Record<string, Promise<Folder | null>>, prop: string): Promise<Folder> | Promise<Folder|null> {
            if (!prop) throw new InvalidNameError('Folder name cannot be empty.', prop);

    // Make the name case-insensitive
    const name = prop.trim().toLowerCase();

    // Fetch/create folder if it doesn't already exist
    if (!(name in target)){

        const dir = (async() => {

            try {

                const handle = this.handle.getDirectoryHandle(prop, {create}).catch(e => {
                    if (!(e instanceof Error)) throw e;

                    if (e instanceof DOMException && e.name === 'NotFoundError') {
                        delete this.childDirsC[name];
                        return null;
                    }
                    else if (e instanceof InvalidNameError || e.message === 'Name is not allowed.' || e.message === 'Cannot get a file with an empty name.')
                        throw new InvalidNameError('Folder name is not allowed.', prop);
                    else
                        throw e;
                });


                if (handle === null) return null;
                return new Folder(
                    await this.handle.getDirectoryHandle(prop, {create})
                );

            } catch (e) {

                if (e instanceof DOMException && e.name === 'NotFoundError') {
                    delete this.childDirsC[name];
                    return null;
                }
                else throw e;
            }
        })();

        this.childDirs[name] = dir;
        this.childDirsC[name] = dir as Promise<Folder>;
    }

    // Return the newly-assured folder (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}

export function getFileFromFolder(this: Folder, create: false, target: Record<string, Promise<FileSystemFileHandle | null>>, prop: string) : Promise<FileSystemFileHandle | null>
export function getFileFromFolder(this: Folder, create: true, target: Record<string, Promise<FileSystemFileHandle       >>, prop: string) : Promise<FileSystemFileHandle>
export function getFileFromFolder<TCreate extends true|false> (this: Folder, create: TCreate, target: Record<string, Promise<FileSystemFileHandle> | Promise<FileSystemFileHandle | null>>, prop: string) : Promise<FileSystemFileHandle> |  Promise<FileSystemFileHandle | null> {
    if (!prop) throw new Error('Cannot get a file with an empty name.', {cause: 'invalid-argument'});

    // Make the name case-insensitive
    const name = prop.trim().toLowerCase();

    // Fetch/create file if it doesn't already exist
        if (!(name in target) || target[name] === null) {
            const handle = this.handle.getFileHandle(prop, {create}).catch(e => {
                if (
                    e instanceof DOMException && e.name === 'NotFoundError') {
                    delete this.childFilesC[name];
                    return null;
                }
                // Name is not allowed
                else if (e instanceof TypeError && e.message === 'Name is not allowed.')
                    throw new InvalidNameError('File name is not allowed.', prop);
                else
                    throw e;
            });

            this.childFiles[name] = handle;
            this.childFilesC[name] = handle as Promise<FileSystemFileHandle>;
        }

    // Return the newly-assured file (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}


export class Folder {
    readonly handle: FileSystemDirectoryHandle;


    /** Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property will **NOT** create folders. If you would like to fetch *or* create a folder, use `childDirsC`
        @throws `InvalidNameError` when the provided name is invalid.
    */
    readonly childDirs = new Proxy({}, {
        get: getFolderFromFolder.bind<this, false, [target: Record<string, Promise<Folder | null>>, prop: string], Promise<Folder | null>>(this, false),
    });

    /** Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property **WILL** create folders if they do not already exist. If you would like to receive `null` instead of creating a folder, use `childDirs`
        @throws `InvalidNameError` when the provided name is invalid.
    */
    readonly childDirsC = new Proxy({}, {
        get: getFolderFromFolder.bind(this, true),
    });

    /** Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property will **NOT** create files. If you would like to fetch *or* create a file, use `childFilesC`
        @throws `InvalidNameError` when the provided name is invalid.
    */
    readonly childFiles = new Proxy({}, {
        get: getFileFromFolder.bind<this, false, [target: Record<string, Promise<FileSystemFileHandle | null>>, prop: string], Promise<FileSystemFileHandle | null>>(this, false),
    });

    /** Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property **WILL** create files if they do not already exist. If you would like to receive `null` instead of creating a file, use `childFiles`
        @throws `InvalidNameError` when the provided name is invalid.
    */
    readonly childFilesC = new Proxy({}, {
        get: getFileFromFolder.bind(this, true),
    });

    async getFile(name: string): Promise<FileSystemFileHandle|null>;
    async getFile(name: string, create: true): Promise<FileSystemFileHandle>
    async getFile(name: string, create?: boolean): Promise<FileSystemFileHandle|null> {
        // Split by forward slashes
        const parts = name.split('/');

        // Split by backslashes
        parts.forEach((part, index, arr) => {
            const parts2 = part.split('\\');
            arr.splice(index, 1, ...parts2);
        });

        const debug_fullPath = [...parts];
        //console.log('Getting file:', debug_fullPath);

        const fileName = parts.pop()!;

        if (!fileName) throw new InvalidNameError('File name is empty.', name);

        // Get the file
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let currentFolder: Folder|null = this;
        for (let i = 0; i < parts.length; i++) {
            const debug_targetPath = parts.slice(0, i + 1).join('/');

            try {

                currentFolder = await currentFolder[create ? 'childDirsC' : 'childDirs'][parts[i]!]!;
                //console.log('Entered folder: ', debug_targetPath, currentFolder);
                if (!currentFolder) return currentFolder;

            } catch (e) {
                if (!(e instanceof Error)) throw e;

                if (e instanceof InvalidNameError || e.message === 'Name is not allowed.' || e.message === 'Cannot get a file with an empty name.') {
                    console.info(`Could not get folder "${debug_targetPath}" for file due to invalid name:`, debug_fullPath, e);
                    throw e;
                } else if (e instanceof DOMException && e.name === 'NotFoundError')
                    console.info(`Could not find folder "${debug_targetPath}" for file:`, debug_fullPath, e);
                else
                    console.error(`Error getting folder "${debug_targetPath}" for file:`, debug_fullPath, e);

                return null;
            }
        }

        try {
            return await currentFolder[create ? 'childFilesC' : 'childFiles'][fileName]!;
        } catch (e) {
            if (!(e instanceof Error)) throw e;

            if (e instanceof InvalidNameError || e.message === 'Name is not allowed.' || e.message === 'Cannot get a file with an empty name.') {
                console.info(`Could not get file "${fileName}" due to invalid name:`, debug_fullPath, e);
                throw e;
            } else if (e instanceof DOMException && e.name === 'NotFoundError')
                console.info(`Could not find file "${debug_fullPath}"`, e);
            else
                console.error(`Error getting file "${debug_fullPath}"`, e);

            return null;
        }
    }

    constructor(handle: FileSystemDirectoryHandle) {
        this.handle = handle;
    }
}

export async function readFileAsDataURI(file_: FileSystemFileHandle | File) {
    const file = file_ instanceof File ? file_ : await file_.getFile();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    return await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
}

export class writeableFolder extends Folder {
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
export async function getUserPickedFolder(write: boolean): Promise<Folder|null>

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write: true): Promise<writeableFolder|null>

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write?: boolean): Promise<Folder|null> {
    // Construct a string to represent the permissions we need
    const permStr: 'read'|'readwrite' = `read${write ? 'write' : ''}`;

    // Get a directory
    let thisHandle: FileSystemDirectoryHandle;
    try {
        thisHandle = await window.showDirectoryPicker({mode: permStr});
    } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) throw e;

        console.info('User cancelled the folder picker');
        return null;
    }

    // Fetch current permission state
    let permState = await thisHandle.queryPermission({mode: permStr});

    // Request permission if we don't already have it
    if (permState !== 'granted') permState = await thisHandle.requestPermission({mode: permStr});

    //Return the handle ONLY if we have the required permissions
    if (permState === 'granted') return write ?
                                        new writeableFolder(thisHandle, true) :
                                        new Folder(thisHandle);

    else {
        console.info(`Permission denied: current state is ${permState}`);
        return null;
    }
}
