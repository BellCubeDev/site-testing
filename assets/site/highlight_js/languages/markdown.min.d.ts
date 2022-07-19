export function markdown(e: any): {
    name: string;
    aliases: string[];
    contains: ({
        className: string;
        contains: never[];
        variants: {
            begin: RegExp;
            end: RegExp;
        }[];
    } | {
        begin: RegExp;
        end: string;
        subLanguage: string;
        relevance: number;
    } | {
        variants: {
            begin: any;
            relevance: number;
        }[];
        returnBegin: boolean;
        contains: ({
            match: RegExp;
            className?: undefined;
            relevance?: undefined;
            begin?: undefined;
            end?: undefined;
            excludeBegin?: undefined;
            returnEnd?: undefined;
            excludeEnd?: undefined;
        } | {
            className: string;
            relevance: number;
            begin: string;
            end: string;
            excludeBegin: boolean;
            returnEnd: boolean;
            match?: undefined;
            excludeEnd?: undefined;
        } | {
            className: string;
            relevance: number;
            begin: string;
            end: string;
            excludeBegin: boolean;
            excludeEnd: boolean;
            match?: undefined;
            returnEnd?: undefined;
        })[];
    } | {
        className: string;
        variants: ({
            begin: string;
            end: string;
            contains: ({
                begin: RegExp;
                end: string;
                subLanguage: string;
                relevance: number;
            } | {
                variants: {
                    begin: any;
                    relevance: number;
                }[];
                returnBegin: boolean;
                contains: ({
                    match: RegExp;
                    className?: undefined;
                    relevance?: undefined;
                    begin?: undefined;
                    end?: undefined;
                    excludeBegin?: undefined;
                    returnEnd?: undefined;
                    excludeEnd?: undefined;
                } | {
                    className: string;
                    relevance: number;
                    begin: string;
                    end: string;
                    excludeBegin: boolean;
                    returnEnd: boolean;
                    match?: undefined;
                    excludeEnd?: undefined;
                } | {
                    className: string;
                    relevance: number;
                    begin: string;
                    end: string;
                    excludeBegin: boolean;
                    excludeEnd: boolean;
                    match?: undefined;
                    returnEnd?: undefined;
                })[];
            })[];
        } | {
            begin: string;
            contains: ({
                begin: string;
                end?: undefined;
                contains?: undefined;
            } | {
                begin: string;
                end: string;
                contains: ({
                    begin: RegExp;
                    end: string;
                    subLanguage: string;
                    relevance: number;
                } | {
                    variants: {
                        begin: any;
                        relevance: number;
                    }[];
                    returnBegin: boolean;
                    contains: ({
                        match: RegExp;
                        className?: undefined;
                        relevance?: undefined;
                        begin?: undefined;
                        end?: undefined;
                        excludeBegin?: undefined;
                        returnEnd?: undefined;
                        excludeEnd?: undefined;
                    } | {
                        className: string;
                        relevance: number;
                        begin: string;
                        end: string;
                        excludeBegin: boolean;
                        returnEnd: boolean;
                        match?: undefined;
                        excludeEnd?: undefined;
                    } | {
                        className: string;
                        relevance: number;
                        begin: string;
                        end: string;
                        excludeBegin: boolean;
                        excludeEnd: boolean;
                        match?: undefined;
                        returnEnd?: undefined;
                    })[];
                })[];
            })[];
            end?: undefined;
        })[];
        begin?: undefined;
        end?: undefined;
        excludeEnd?: undefined;
        contains?: undefined;
        returnBegin?: undefined;
    } | {
        className: string;
        begin: string;
        end: string;
        excludeEnd: boolean;
        variants?: undefined;
        contains?: undefined;
        returnBegin?: undefined;
    } | {
        className: string;
        begin: string;
        contains: ({
            begin: RegExp;
            end: string;
            subLanguage: string;
            relevance: number;
        } | {
            variants: {
                begin: any;
                relevance: number;
            }[];
            returnBegin: boolean;
            contains: ({
                match: RegExp;
                className?: undefined;
                relevance?: undefined;
                begin?: undefined;
                end?: undefined;
                excludeBegin?: undefined;
                returnEnd?: undefined;
                excludeEnd?: undefined;
            } | {
                className: string;
                relevance: number;
                begin: string;
                end: string;
                excludeBegin: boolean;
                returnEnd: boolean;
                match?: undefined;
                excludeEnd?: undefined;
            } | {
                className: string;
                relevance: number;
                begin: string;
                end: string;
                excludeBegin: boolean;
                excludeEnd: boolean;
                match?: undefined;
                returnEnd?: undefined;
            })[];
        })[];
        end: string;
        variants?: undefined;
        excludeEnd?: undefined;
        returnBegin?: undefined;
    } | {
        className: string;
        variants: ({
            begin: string;
            end?: undefined;
            contains?: undefined;
            relevance?: undefined;
        } | {
            begin: string;
            end: string;
            contains?: undefined;
            relevance?: undefined;
        } | {
            begin: string;
            contains: {
                begin: string;
                end: string;
            }[];
            relevance: number;
            end?: undefined;
        })[];
        begin?: undefined;
        end?: undefined;
        excludeEnd?: undefined;
        contains?: undefined;
        returnBegin?: undefined;
    } | {
        begin: string;
        end: string;
        className?: undefined;
        variants?: undefined;
        excludeEnd?: undefined;
        contains?: undefined;
        returnBegin?: undefined;
    } | {
        begin: RegExp;
        returnBegin: boolean;
        contains: ({
            className: string;
            begin: RegExp;
            end: RegExp;
            excludeBegin: boolean;
            excludeEnd: boolean;
        } | {
            className: string;
            begin: RegExp;
            end: RegExp;
            excludeBegin: boolean;
            excludeEnd?: undefined;
        })[];
        className?: undefined;
        variants?: undefined;
        end?: undefined;
        excludeEnd?: undefined;
    })[];
};
//# sourceMappingURL=markdown.min.d.ts.map