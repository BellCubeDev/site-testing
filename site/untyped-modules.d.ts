/** Definitions for modules that are not typed or have incorrect/insufficient types
 *
 * @author BellCubeDev
 */

/** I've defined my own type definitions here both because the existing definitions do not fit my needs and because I've technically slightly modified the package via the minifier */
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

/** I've defined my own type definitions here both because the existing definitions do not fit my needs and because I've technically slightly modified the package via the minifier */
export declare module 'included_node_modules/pretty-data/pretty-data' {
    export default prettyData;
}
