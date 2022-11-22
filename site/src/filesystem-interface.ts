import * as universal from './universal.js';

export interface folderEntry {
    handle: FileSystemHandle;
}
export interface folderDirectoryEntry extends folderEntry {
    handle: FileSystemDirectoryHandle;
    children: universal.objOf<folderEntry>;
}

export type folderAnyEntry = folderEntry | folderDirectoryEntry;
export type objOfEntries = universal.objOf<folderAnyEntry>;

export async function getTreeOfHandle(handle: FileSystemDirectoryHandle): Promise<folderDirectoryEntry> {
    const entries = handle.entries();

    const tree:folderDirectoryEntry = {
        handle,
        children: {}
    };

    for await (const entry of entries) {
        const [name, handle] = entry;
        tree.children[name] = {handle};
        if (handle.kind === 'directory') tree.children[name] = await getTreeOfHandle(handle);
    }

    return tree;
}

export class folder {
    readonly handle: FileSystemDirectoryHandle;

    private children_: objOfEntries = {};
    get children() {
        if (!this.children_) this.updateChildren();
        return this.children_;
    }

    private childrenInsensitive_: objOfEntries = {};
    get childrenInsensitive() {
        if (!this.childrenInsensitive_) this.childrenInsensitive_ = Object.fromEntries(Object.entries(this.children).map(([key, value]) => [key.toLowerCase(), value]));
        return this.childrenInsensitive_;
    }

    constructor(handle: FileSystemDirectoryHandle) {
        this.handle = handle;
    }

    private tree_: folderDirectoryEntry|undefined;
    get tree() {return this.tree_;}

    async updateChildren() {
        this.tree_ = await getTreeOfHandle(this.handle);
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
