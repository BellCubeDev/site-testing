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

function getFolderFromFolder<TCreate extends true|false>(this: folder, create: TCreate, target: Record<string, Promise<folder>>, prop: string): TCreate extends true ? Promise<folder>|InvalidNameError : Promise<folder>|null|InvalidNameError {
    if (!prop) throw new InvalidNameError('Folder name cannot be empty.', prop);

    // Make the name case-insensitive
    const name = prop.toLowerCase();

    // Fetch/create folder if it doesn't already exist
    try {
        if (!(name in target)){

            const dir = (async() => {
                const handle = this.handle.getDirectoryHandle(prop, {create}).catch(e => {
                    if (e instanceof DOMException && e.name === 'NotFoundError') {
                        this.childFiles[name] = null;
                        delete this.childDirsC[name];
                        return null;
                    }
                    // Name is not allowed
                    else if (e instanceof TypeError && e.message === 'Name is not allowed.') {
                        throw new InvalidNameError('Folder name is not allowed.', prop);
                    }
                    else
                        throw e;
                });

                if (handle === null) return null;
                return new folder(
                    await this.handle.getDirectoryHandle(prop, {create})
                );
            })();

            this.childDirs[name] = dir;
            this.childDirsC[name] = dir as Promise<folder>;
        }
    } catch (e) {
        if (e instanceof DOMException && e.name === 'NotFoundError') this.childDirs[name] = null;
        throw e;

    }

    // Return the newly-assured folder (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}

function getFileFromFolder<TCreate extends true|false>(this: folder, create: TCreate, target: Record<string, Promise<FileSystemFileHandle>|null|InvalidNameError>, prop: string):TCreate extends true ? Promise<FileSystemFileHandle>|InvalidNameError : Promise<FileSystemFileHandle>|null|InvalidNameError {
    if (!prop) throw new Error('Cannot get a file with an empty name.', {cause: 'invalid-argument'});

    // Make the name case-insensitive
    const name = prop.toLowerCase();

    // Fetch/create file if it doesn't already exist
    try {
        if (!(name in target) || target[name] === null) {
            const handle = this.handle.getFileHandle(prop, {create}).catch(e => {
                if (
                    e instanceof DOMException && e.name === 'NotFoundError') {
                    this.childFiles[name] = null;
                    delete this.childFilesC[name];
                    return null;
                }
                // Name is not allowed
                else if (e instanceof TypeError && e.message === 'Name is not allowed.') {
                    const err = new InvalidNameError('File name is not allowed.', prop);
                    this.childFiles[name] = err;
                    this.childFilesC[name] = err;
                    return err;
                }
                else
                    throw e;
            });

            this.childFiles[name] = handle;
            this.childFilesC[name] = handle as Promise<FileSystemFileHandle>;
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


    private readonly childDirsObj: Record<string, Promise<folder|null|InvalidNameError>|null|InvalidNameError> = {};
    /** Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property will **NOT** create folders. If you would like to fetch *or* create a folder, use `childDirsC`
    */
    readonly childDirs: Record<string, Promise<folder|null|InvalidNameError>|null|InvalidNameError> = new Proxy(this.childDirsObj, {
        get: getFolderFromFolder.bind(this, false),
    });
    /** **WARNING: Ensure that you have verified that the provided name is valid!**

        Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property will **NOT** create folders. If you would like to fetch *or* create a folder, use `childDirsVC`
    */
    readonly childDirsV: Record<string, Promise<folder|null>> = new Proxy(this.childDirsObj as Record<string, Promise<folder|null>>, {
        get: getFolderFromFolder.bind(this, false),
    });


    private readonly childDirsCObj: Record<string, Promise<folder|InvalidNameError>|InvalidNameError> = {};
    /** Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property **WILL** create folders if they do not already exist. If you would like to receive `null` instead of creating a folder, use `childDirs`
    */
    readonly childDirsC: Record<string, Promise<folder>|InvalidNameError|InvalidNameError> = new Proxy({}, {
        get: getFolderFromFolder.bind(this, true),
    });
    /** **WARNING: Ensure that you have verified that the provided name is valid!**

        Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property **WILL** create folders if they do not already exist. If you would like to receive `null` instead of creating a folder, use `childDirsV`
    */
    readonly childDirsCV: Record<string, Promise<folder>> = new Proxy(this.childDirsCObj as Record<string, Promise<folder>>, {
        get: getFolderFromFolder.bind(this, true),
    });


    private readonly childFilesObj: Record<string, Promise<FileSystemFileHandle|null|InvalidNameError>|null|InvalidNameError> = {};
    /** Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property will **NOT** create files. If you would like to fetch *or* create a file, use `childFilesC`
    */
    readonly childFiles: Record<string, Promise<FileSystemFileHandle|null|InvalidNameError>|InvalidNameError|null> = new Proxy(this.childFilesObj, {
        get: getFileFromFolder.bind(this, false),
    });
    /** **WARNING: Ensure that you have verified that the provided name is valid!**

        Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property will **NOT** create files. If you would like to fetch *or* create a file, use `childFilesVC`
    */
    readonly childFilesV = new Proxy(this.childFilesObj, {
        get: getFileFromFolder.bind(this, false),
    }) as Record<string, Promise<FileSystemFileHandle|null>>;

    private readonly childFilesCObj: Record<string, Promise<FileSystemFileHandle|InvalidNameError>|InvalidNameError> = {};
    /** Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property **WILL** create files if they do not already exist. If you would like to receive `null` instead of creating a file, use `childFiles`
    */
    readonly childFilesC: Record<string, Promise<FileSystemFileHandle|InvalidNameError>|InvalidNameError> = new Proxy<Record<string, Promise<FileSystemFileHandle>>>({}, {
        get: getFileFromFolder.bind(this, true),
    });
    /** **WARNING: Ensure that you have verified that the provided name is valid!**

        Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property **WILL** create files if they do not already exist. If you would like to receive `null` instead of creating a file, use `childFilesV`
    */
    readonly childFilesCV = new Proxy(this.childFilesCObj as Record<string, Promise<FileSystemFileHandle>>, {
        get: getFileFromFolder.bind(this, true),
    }) as Record<string, Promise<FileSystemFileHandle>>;

    async getFile(name: string): Promise<FileSystemFileHandle|null|InvalidNameError>;
    async getFile(name: string, create: true): Promise<FileSystemFileHandle|InvalidNameError>
    async getFile(name: string, create?: boolean): Promise<FileSystemFileHandle|null|InvalidNameError> {
        // Split by forward slashes
        const parts = name.split('/');

        // Split by backslashes
        parts.forEach((part, index, arr) => {
            const parts2 = part.split('\\');
            arr.splice(index, 1, ...parts2);
        });

        const debug_fullPath = [...parts];
        console.log('Getting file:', debug_fullPath);

        const fileName = parts.pop()!;

        // Get the file
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let currentFolder: folder|InvalidNameError|null = this;
        for (let i = 0; i < parts.length; i++) {
            const debug_targetPath = parts.slice(0, i + 1).join('/');

            try {

                currentFolder = await currentFolder[create ? 'childDirsC' : 'childDirs'][parts[i]!]!;
                console.log('Entered folder: ', debug_targetPath, currentFolder);
                if (!currentFolder || currentFolder instanceof InvalidNameError) return currentFolder;

            } catch (e) {
                if (e instanceof DOMException && e.name === 'NotFoundError')
                    console.info(`Could not get folder "${debug_targetPath}" for file:`, debug_fullPath, e);
                else if (e instanceof TypeError && e.message === 'Name is not allowed.')
                    console.info(`Could not get folder "${debug_targetPath}" for file due to invalid name:`, debug_fullPath, e);
                else
                    console.error(`Error getting folder "${debug_targetPath}" for file:`, debug_fullPath, e);

                return null;
            }
        }

        try {
            return await currentFolder[create ? 'childFilesC' : 'childFiles'][fileName]!;
        } catch (e) {
            if (e instanceof DOMException && e.name === 'NotFoundError')
                console.info(`Could not get file "${debug_fullPath}"`, e);
            else if (e instanceof TypeError && e.message === 'Name is not allowed.')
                console.info(`Could not get file "${debug_fullPath}" for file due to invalid name:`, debug_fullPath, e);
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
