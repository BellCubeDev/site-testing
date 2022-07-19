declare global {
    interface Window {
        bcd_builder: {
            directory: FileSystemDirectoryHandle | undefined;
        };
    }
}
export declare function bcd_fomodBuilder_init(): Promise<void>;
export declare class bcdObj extends Object {
    constructor(obj: object);
    renameKey(oldKeyName: string, newKeyName: string): void;
}
//# sourceMappingURL=fomod-builder.d.ts.map