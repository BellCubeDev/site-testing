export interface prettyData {
    /** I've no idea why they did this instead of just exporting `pd` as the default, but hey */
    pd: {
        xml: (xml: string) => string;
        xmlmin: (xml: string, preserveComments: boolean) => string;

        json: (json: string) => string;
        jsonmin: (json: string, preserveComments: boolean) => string;

        css: (css: string) => string;
        cssmin: (css: string, preserveComments: boolean) => string;

        sql: (sql: string) => string;
        sqlmin: (sql: string, preserveComments: boolean) => string;

        step: string;
        maxdeep: number;

        shift: string[] & ['\n'];

        /** @private */ ix: number;
    }
}

export declare module 'included_node_modules/pretty-data/pretty-data' {
    export default prettyData;
}
