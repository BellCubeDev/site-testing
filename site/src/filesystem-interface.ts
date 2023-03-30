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

export function getFolderFromFolder<TCreate extends false>(this: BellFolder, create: TCreate, target: Record<string, Promise<BellFolder | null>>, prop: string): Promise<BellFolder | null>
export function getFolderFromFolder<TCreate extends true >(this: BellFolder, create: TCreate, target: Record<string, Promise<BellFolder>>, prop: string): Promise<BellFolder>
export function getFolderFromFolder<TCreate extends true|false>(this: BellFolder, create: TCreate, target: Record<string, Promise<BellFolder>> | Record<string, Promise<BellFolder | null>>, prop: string): Promise<BellFolder> | Promise<BellFolder|null> {
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
                return new BellFolder(
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
        this.childDirsC[name] = dir as Promise<BellFolder>;
    }

    // Return the newly-assured folder (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}

export function getFileFromFolder(this: BellFolder, create: false, target: Record<string, Promise<BellFile | null>>, prop: string) : Promise<BellFile | null>
export function getFileFromFolder(this: BellFolder, create: true, target: Record<string, Promise<BellFile       >>, prop: string) : Promise<BellFile>
export function getFileFromFolder<TCreate extends true|false> (this: BellFolder, create: TCreate, target: Record<string, Promise<BellFile> | Promise<BellFile | null>>, prop: string) : Promise<BellFile> |  Promise<BellFile | null> {
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
            }).then(handle => handle ? new BellFile(handle) : null);

            this.childFiles[name] = handle;
            this.childFilesC[name] = handle as Promise<BellFile>;
        }

    // Return the newly-assured file (or null, but we don't tell TypeScript that or it would freak out)
    return target[name]!;
}


export class BellFolder {
    readonly handle: FileSystemDirectoryHandle;


    /** Wrapper Proxy property that fetches folders as though they were nested promises.

        ---
        This property will **NOT** create folders. If you would like to fetch *or* create a folder, use `childDirsC`
        @throws `InvalidNameError` when the provided name is invalid.
    */
    readonly childDirs = new Proxy({}, {
        get: getFolderFromFolder.bind<this, false, [target: Record<string, Promise<BellFolder | null>>, prop: string], Promise<BellFolder | null>>(this, false),
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
        get: getFileFromFolder.bind<this, false, [target: Record<string, Promise<BellFile | null>>, prop: string], Promise<BellFile | null>>(this, false),
    });

    /** Wrapper Proxy property that fetches files as though they were nested promises.

        ---
        This property **WILL** create files if they do not already exist. If you would like to receive `null` instead of creating a file, use `childFiles`
        @throws `InvalidNameError` when the provided name is invalid.
    */
    readonly childFilesC = new Proxy({}, {
        get: getFileFromFolder.bind(this, true),
    });

    async getFile(name: string): Promise<[...BellFolder[], BellFile]|null>;
    async getFile(name: string, create: true): Promise<[...BellFolder[], BellFile]>
    async getFile(name: string, create?: boolean): Promise<[...BellFolder[], BellFile]|null> {
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

        const pathItems: (BellFolder|BellFile)[] = [];

        // Get the file
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let currentFolder: BellFolder|null = this;
        for (let i = 0; i < parts.length; i++) {
            const debug_targetPath = parts.slice(0, i + 1).join('/');

            try {
                currentFolder = await currentFolder[create ? 'childDirsC' : 'childDirs'][parts[i]!]!;
                //console.log('Entered folder: ', debug_targetPath, currentFolder);
                if (!currentFolder) return null;

                pathItems.push(currentFolder);
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
            const lastItem = await currentFolder[create ? 'childFilesC' : 'childFiles'][fileName];
            if (!lastItem) return null;

            pathItems.push(lastItem);
            return pathItems as [...BellFolder[], BellFile];
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

    async openFilePicker(options?: OpenFilePickerOptions & {save?: boolean}): Promise<BellFile[]> {
        try {
            const files = await (  options?.save ? window.showSaveFilePicker(options) : window.showOpenFilePicker(options)  );
            if (!files) return [];

            if (files instanceof FileSystemFileHandle) return [new BellFile(files)];
            return files.map(file => new BellFile(file));
        } catch (e) {
            console.debug('Error opening file picker:', e);
            return [];
        }
    }


    async resolveChildPath(child: BellFile, returnNull?: false): Promise<string[]>
    async resolveChildPath(child: BellFile, returnNull: true): Promise<string[] | null>
    async resolveChildPath(child: BellFile, returnNull = false): Promise<string[] | null> {
        try {
            if (child.file instanceof File) throw new Error('Cannot resolve child path of a File object');

            const resolved = await this.handle.resolve(child.file);
            if (resolved === null) throw new Error('Could not resolve child path');

            return resolved;
        } catch (e) {
            if (returnNull) return null;
            throw e;
        }
    }

    constructor(handle: FileSystemDirectoryHandle) {
        this.handle = handle;
    }
}

type FileReaderReadKeys = Record<keyof FileReader & `readAs${string}`, unknown> & {
    readAsArrayBuffer: ArrayBuffer;
    readAsBinaryString: string;
    readAsDataURL: string;
    readAsText: string;
};

export class BellFile {
    readonly file: FileSystemFileHandle|File;

    constructor(handle: FileSystemFileHandle|File) {
        this.file = handle;
    }

    static async read<TReturn extends FileReaderReadKeys[TFunct], TFunct extends (keyof FileReader & `readAs${string}`) = 'readAsText'>(file: File, key?: TFunct): Promise<TReturn> {
        key ??= 'readAsText' as TFunct;

        const reader = new FileReader();
        if (  !(key in reader && typeof reader[key] === 'function')  ) throw new Error(`Invalid key "${key}"`);

        reader[key](file);

        return await new Promise<TReturn>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as TReturn);
            reader.onerror = reject;
            reader.onabort = reject;
        });
    }

    async readAsText(): Promise<string> {
        return await BellFile.read(this.file instanceof File ? this.file : await this.file.getFile(), 'readAsText');
    }

    async readAsArrayBuffer(): Promise<ArrayBuffer> {
        return await BellFile.read(this.file instanceof File ? this.file : await this.file.getFile(), 'readAsArrayBuffer');
    }

    async readAsDataURL(): Promise<string> {
        return await BellFile.read(this.file instanceof File ? this.file : await this.file.getFile(), 'readAsDataURL');
    }

    async readAsBinaryString(): Promise<string> {
        return await BellFile.read(this.file instanceof File ? this.file : await this.file.getFile(), 'readAsBinaryString');
    }

    static async write(file: FileSystemFileHandle, ...params:Parameters<FileSystemWritableFileStream['write']>): Promise<void> {
        const writer = await file.createWritable();
        await writer.write(...params);
        await writer.close();
    }

    async write(...params:Parameters<FileSystemWritableFileStream['write']>): Promise<void> {
        if (this.file instanceof File) throw new Error('Cannot write to a File object');
        return await BellFile.write(this.file, ...params);
    }
}
export class writeableFolder extends BellFolder {
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
export async function getUserPickedFolder(write: boolean): Promise<BellFolder|null>

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write: true): Promise<writeableFolder|null>

/** Returns a folder picked by the user
    @throws if the user cancels the dialog or if permission is denied
*/
export async function getUserPickedFolder(write?: boolean): Promise<BellFolder|null> {
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
                                        new BellFolder(thisHandle);

    else {
        console.info(`Permission denied: current state is ${permState}`);
        return null;
    }
}
