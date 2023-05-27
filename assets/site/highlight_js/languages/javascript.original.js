const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
const KEYWORDS = [
    "as",
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends"
];
const LITERALS = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
];
const TYPES = [
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    "Math",
    "Date",
    "Number",
    "BigInt",
    "String",
    "RegExp",
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    "Reflect",
    "Proxy",
    "Intl",
    "WebAssembly"
];
const ERROR_TYPES = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
];
const BUILT_IN_GLOBALS = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
];
const BUILT_IN_VARIABLES = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "global"
];
const BUILT_INS = [].concat(BUILT_IN_GLOBALS, TYPES, ERROR_TYPES);
function javascript(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
        const tag = "</" + match[0].slice(1);
        const pos = match.input.indexOf(tag, after);
        return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE;
    const FRAGMENT = {
        begin: '<>',
        end: '</>'
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        isTrulyOpeningTag: (match, response) => {
            const afterMatchIndex = match[0].length + match.index;
            const nextChar = match.input[afterMatchIndex];
            if (nextChar === "<" ||
                nextChar === ",") {
                response.ignoreMatch();
                return;
            }
            if (nextChar === ">") {
                if (!hasClosingTag(match, { after: afterMatchIndex })) {
                    response.ignoreMatch();
                }
            }
            let m;
            const afterMatch = match.input.substring(afterMatchIndex);
            if ((m = afterMatch.match(/^\s*=/))) {
                response.ignoreMatch();
                return;
            }
            if ((m = afterMatch.match(/^\s+extends\s+/))) {
                if (m.index === 0) {
                    response.ignoreMatch();
                    return;
                }
            }
        }
    };
    const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_INS,
        "variable.language": BUILT_IN_VARIABLES
    };
    const decimalDigits = '[0-9](_?[0-9])*';
    const frac = `\\.(${decimalDigits})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
        className: 'number',
        variants: [
            { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
                    `[eE][+-]?(${decimalDigits})\\b` },
            { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
            { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
            { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
            { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
            { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
            { begin: "\\b0[0-7]+n?\\b" },
        ],
        relevance: 0
    };
    const SUBST = {
        className: 'subst',
        begin: '\\$\\{',
        end: '\\}',
        keywords: KEYWORDS$1,
        contains: []
    };
    const HTML_TEMPLATE = {
        begin: 'html`',
        end: '',
        starts: {
            end: '`',
            returnEnd: false,
            contains: [
                hljs.BACKSLASH_ESCAPE,
                SUBST
            ],
            subLanguage: 'xml'
        }
    };
    const CSS_TEMPLATE = {
        begin: 'css`',
        end: '',
        starts: {
            end: '`',
            returnEnd: false,
            contains: [
                hljs.BACKSLASH_ESCAPE,
                SUBST
            ],
            subLanguage: 'css'
        }
    };
    const TEMPLATE_STRING = {
        className: 'string',
        begin: '`',
        end: '`',
        contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
        ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(/\/\*\*(?!\/)/, '\\*/', {
        relevance: 0,
        contains: [
            {
                begin: '(?=@[A-Za-z]+)',
                relevance: 0,
                contains: [
                    {
                        className: 'doctag',
                        begin: '@[A-Za-z]+'
                    },
                    {
                        className: 'type',
                        begin: '\\{',
                        end: '\\}',
                        excludeEnd: true,
                        excludeBegin: true,
                        relevance: 0
                    },
                    {
                        className: 'variable',
                        begin: IDENT_RE$1 + '(?=\\s*(-)|$)',
                        endsParent: true,
                        relevance: 0
                    },
                    {
                        begin: /(?=[^\n])\s/,
                        relevance: 0
                    }
                ]
            }
        ]
    });
    const COMMENT = {
        className: "comment",
        variants: [
            JSDOC_COMMENT,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.C_LINE_COMMENT_MODE
        ]
    };
    const SUBST_INTERNALS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        TEMPLATE_STRING,
        { match: /\$\d+/ },
        NUMBER,
    ];
    SUBST.contains = SUBST_INTERNALS
        .concat({
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS$1,
        contains: [
            "self"
        ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
        {
            begin: /\(/,
            end: /\)/,
            keywords: KEYWORDS$1,
            contains: ["self"].concat(SUBST_AND_COMMENTS)
        }
    ]);
    const PARAMS = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS$1,
        contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
        variants: [
            {
                match: [
                    /class/,
                    /\s+/,
                    IDENT_RE$1,
                    /\s+/,
                    /extends/,
                    /\s+/,
                    regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
                ],
                scope: {
                    1: "keyword",
                    3: "title.class",
                    5: "keyword",
                    7: "title.class.inherited"
                }
            },
            {
                match: [
                    /class/,
                    /\s+/,
                    IDENT_RE$1
                ],
                scope: {
                    1: "keyword",
                    3: "title.class"
                }
            },
        ]
    };
    const CLASS_REFERENCE = {
        relevance: 0,
        match: regex.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
        className: "title.class",
        keywords: {
            _: [
                ...TYPES,
                ...ERROR_TYPES
            ]
        }
    };
    const USE_STRICT = {
        label: "use_strict",
        className: 'meta',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
        variants: [
            {
                match: [
                    /function/,
                    /\s+/,
                    IDENT_RE$1,
                    /(?=\s*\()/
                ]
            },
            {
                match: [
                    /function/,
                    /\s*(?=\()/
                ]
            }
        ],
        className: {
            1: "keyword",
            3: "title.function"
        },
        label: "func.def",
        contains: [PARAMS],
        illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
        relevance: 0,
        match: /\b[A-Z][A-Z_0-9]+\b/,
        className: "variable.constant"
    };
    function noneOf(list) {
        return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
        match: regex.concat(/\b/, noneOf([
            ...BUILT_IN_GLOBALS,
            "super",
            "import"
        ]), IDENT_RE$1, regex.lookahead(/\(/)),
        className: "title.function",
        relevance: 0
    };
    const PROPERTY_ACCESS = {
        begin: regex.concat(/\./, regex.lookahead(regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/))),
        end: IDENT_RE$1,
        excludeBegin: true,
        keywords: "prototype",
        className: "property",
        relevance: 0
    };
    const GETTER_OR_SETTER = {
        match: [
            /get|set/,
            /\s+/,
            IDENT_RE$1,
            /(?=\()/
        ],
        className: {
            1: "keyword",
            3: "title.function"
        },
        contains: [
            {
                begin: /\(\)/
            },
            PARAMS
        ]
    };
    const FUNC_LEAD_IN_RE = '(\\(' +
        '[^()]*(\\(' +
        '[^()]*(\\(' +
        '[^()]*' +
        '\\)[^()]*)*' +
        '\\)[^()]*)*' +
        '\\)|' + hljs.UNDERSCORE_IDENT_RE + ')\\s*=>';
    const FUNCTION_VARIABLE = {
        match: [
            /const|var|let/, /\s+/,
            IDENT_RE$1, /\s*/,
            /=\s*/,
            /(async\s*)?/,
            regex.lookahead(FUNC_LEAD_IN_RE)
        ],
        keywords: "async",
        className: {
            1: "keyword",
            3: "title.function"
        },
        contains: [
            PARAMS
        ]
    };
    return {
        name: 'Javascript',
        aliases: ['js', 'jsx', 'mjs', 'cjs'],
        keywords: KEYWORDS$1,
        exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
        illegal: /#(?![$_A-z])/,
        contains: [
            hljs.SHEBANG({
                label: "shebang",
                binary: "node",
                relevance: 5
            }),
            USE_STRICT,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            HTML_TEMPLATE,
            CSS_TEMPLATE,
            TEMPLATE_STRING,
            COMMENT,
            { match: /\$\d+/ },
            NUMBER,
            CLASS_REFERENCE,
            {
                className: 'attr',
                begin: IDENT_RE$1 + regex.lookahead(':'),
                relevance: 0
            },
            FUNCTION_VARIABLE,
            {
                begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
                keywords: 'return throw case',
                relevance: 0,
                contains: [
                    COMMENT,
                    hljs.REGEXP_MODE,
                    {
                        className: 'function',
                        begin: FUNC_LEAD_IN_RE,
                        returnBegin: true,
                        end: '\\s*=>',
                        contains: [
                            {
                                className: 'params',
                                variants: [
                                    {
                                        begin: hljs.UNDERSCORE_IDENT_RE,
                                        relevance: 0
                                    },
                                    {
                                        className: null,
                                        begin: /\(\s*\)/,
                                        skip: true
                                    },
                                    {
                                        begin: /\(/,
                                        end: /\)/,
                                        excludeBegin: true,
                                        excludeEnd: true,
                                        keywords: KEYWORDS$1,
                                        contains: PARAMS_CONTAINS
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        begin: /,/,
                        relevance: 0
                    },
                    {
                        match: /\s+/,
                        relevance: 0
                    },
                    {
                        variants: [
                            { begin: FRAGMENT.begin, end: FRAGMENT.end },
                            { match: XML_SELF_CLOSING },
                            {
                                begin: XML_TAG.begin,
                                'on:begin': XML_TAG.isTrulyOpeningTag,
                                end: XML_TAG.end
                            }
                        ],
                        subLanguage: 'xml',
                        contains: [
                            {
                                begin: XML_TAG.begin,
                                end: XML_TAG.end,
                                skip: true,
                                contains: ['self']
                            }
                        ]
                    }
                ],
            },
            FUNCTION_DEFINITION,
            {
                beginKeywords: "while if switch catch for"
            },
            {
                begin: '\\b(?!function)' + hljs.UNDERSCORE_IDENT_RE +
                    '\\(' +
                    '[^()]*(\\(' +
                    '[^()]*(\\(' +
                    '[^()]*' +
                    '\\)[^()]*)*' +
                    '\\)[^()]*)*' +
                    '\\)\\s*\\{',
                returnBegin: true,
                label: "func.def",
                contains: [
                    PARAMS,
                    hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
                ]
            },
            {
                match: /\.\.\./,
                relevance: 0
            },
            PROPERTY_ACCESS,
            {
                match: '\\$' + IDENT_RE$1,
                relevance: 0
            },
            {
                match: [/\bconstructor(?=\s*\()/],
                className: { 1: "title.function" },
                contains: [PARAMS]
            },
            FUNCTION_CALL,
            UPPER_CASE_CONSTANT,
            CLASS_OR_EXTENDS,
            GETTER_OR_SETTER,
            {
                match: /\$[(.]/
            }
        ]
    };
}
export { javascript as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2phdmFzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxRQUFRLEdBQUcsMEJBQTBCLENBQUM7QUFDNUMsTUFBTSxRQUFRLEdBQUc7SUFDZixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osS0FBSztJQUNMLE9BQU87SUFDUCxTQUFTO0lBQ1QsS0FBSztJQUNMLEtBQUs7SUFDTCxVQUFVO0lBQ1YsSUFBSTtJQUNKLFFBQVE7SUFDUixNQUFNO0lBQ04sTUFBTTtJQUNOLE9BQU87SUFDUCxPQUFPO0lBQ1AsWUFBWTtJQUNaLE1BQU07SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLFNBQVM7SUFDVCxLQUFLO0lBQ0wsUUFBUTtJQUNSLFVBQVU7SUFDVixRQUFRO0lBQ1IsUUFBUTtJQUNSLEtBQUs7SUFDTCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFJUCxVQUFVO0lBQ1YsT0FBTztJQUNQLE9BQU87SUFDUCxRQUFRO0lBQ1IsUUFBUTtJQUNSLE1BQU07SUFDTixRQUFRO0lBQ1IsU0FBUztDQUNWLENBQUM7QUFDRixNQUFNLFFBQVEsR0FBRztJQUNmLE1BQU07SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxLQUFLO0lBQ0wsVUFBVTtDQUNYLENBQUM7QUFHRixNQUFNLEtBQUssR0FBRztJQUVaLFFBQVE7SUFDUixVQUFVO0lBQ1YsU0FBUztJQUNULFFBQVE7SUFFUixNQUFNO0lBQ04sTUFBTTtJQUNOLFFBQVE7SUFDUixRQUFRO0lBRVIsUUFBUTtJQUNSLFFBQVE7SUFFUixPQUFPO0lBQ1AsY0FBYztJQUNkLGNBQWM7SUFDZCxXQUFX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bnN0IElERU5UX1JFID0gJ1tBLVphLXokX11bMC05QS1aYS16JF9dKic7XG5jb25zdCBLRVlXT1JEUyA9IFtcbiAgXCJhc1wiLCAvLyBmb3IgZXhwb3J0c1xuICBcImluXCIsXG4gIFwib2ZcIixcbiAgXCJpZlwiLFxuICBcImZvclwiLFxuICBcIndoaWxlXCIsXG4gIFwiZmluYWxseVwiLFxuICBcInZhclwiLFxuICBcIm5ld1wiLFxuICBcImZ1bmN0aW9uXCIsXG4gIFwiZG9cIixcbiAgXCJyZXR1cm5cIixcbiAgXCJ2b2lkXCIsXG4gIFwiZWxzZVwiLFxuICBcImJyZWFrXCIsXG4gIFwiY2F0Y2hcIixcbiAgXCJpbnN0YW5jZW9mXCIsXG4gIFwid2l0aFwiLFxuICBcInRocm93XCIsXG4gIFwiY2FzZVwiLFxuICBcImRlZmF1bHRcIixcbiAgXCJ0cnlcIixcbiAgXCJzd2l0Y2hcIixcbiAgXCJjb250aW51ZVwiLFxuICBcInR5cGVvZlwiLFxuICBcImRlbGV0ZVwiLFxuICBcImxldFwiLFxuICBcInlpZWxkXCIsXG4gIFwiY29uc3RcIixcbiAgXCJjbGFzc1wiLFxuICAvLyBKUyBoYW5kbGVzIHRoZXNlIHdpdGggYSBzcGVjaWFsIHJ1bGVcbiAgLy8gXCJnZXRcIixcbiAgLy8gXCJzZXRcIixcbiAgXCJkZWJ1Z2dlclwiLFxuICBcImFzeW5jXCIsXG4gIFwiYXdhaXRcIixcbiAgXCJzdGF0aWNcIixcbiAgXCJpbXBvcnRcIixcbiAgXCJmcm9tXCIsXG4gIFwiZXhwb3J0XCIsXG4gIFwiZXh0ZW5kc1wiXG5dO1xuY29uc3QgTElURVJBTFMgPSBbXG4gIFwidHJ1ZVwiLFxuICBcImZhbHNlXCIsXG4gIFwibnVsbFwiLFxuICBcInVuZGVmaW5lZFwiLFxuICBcIk5hTlwiLFxuICBcIkluZmluaXR5XCJcbl07XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzXG5jb25zdCBUWVBFUyA9IFtcbiAgLy8gRnVuZGFtZW50YWwgb2JqZWN0c1xuICBcIk9iamVjdFwiLFxuICBcIkZ1bmN0aW9uXCIsXG4gIFwiQm9vbGVhblwiLFxuICBcIlN5bWJvbFwiLFxuICAvLyBudW1iZXJzIGFuZCBkYXRlc1xuICBcIk1hdGhcIixcbiAgXCJEYXRlXCIsXG4gIFwiTnVtYmVyXCIsXG4gIFwiQmlnSW50XCIsXG4gIC8vIHRleHRcbiAgXCJTdHJpbmdcIixcbiAgXCJSZWdFeHBcIixcbiAgLy8gSW5kZXhlZCBjb2xsZWN0aW9uc1xuICBcIkFycmF5XCIsXG4gIFwiRmxvYXQzMkFycmF5XCIsXG4gIFwiRmxvYXQ2NEFycmF5XCIsXG4gIFwiSW50OEFycmF5XCIsXG4gIFwiVWludDhBcnJheVwiLFxuICBcIlVpbnQ4Q2xhbXBlZEFycmF5XCIsXG4gIFwiSW50MTZBcnJheVwiLFxuICBcIkludDMyQXJyYXlcIixcbiAgXCJVaW50MTZBcnJheVwiLFxuICBcIlVpbnQzMkFycmF5XCIsXG4gIFwiQmlnSW50NjRBcnJheVwiLFxuICBcIkJpZ1VpbnQ2NEFycmF5XCIsXG4gIC8vIEtleWVkIGNvbGxlY3Rpb25zXG4gIFwiU2V0XCIsXG4gIFwiTWFwXCIsXG4gIFwiV2Vha1NldFwiLFxuICBcIldlYWtNYXBcIixcbiAgLy8gU3RydWN0dXJlZCBkYXRhXG4gIFwiQXJyYXlCdWZmZXJcIixcbiAgXCJTaGFyZWRBcnJheUJ1ZmZlclwiLFxuICBcIkF0b21pY3NcIixcbiAgXCJEYXRhVmlld1wiLFxuICBcIkpTT05cIixcbiAgLy8gQ29udHJvbCBhYnN0cmFjdGlvbiBvYmplY3RzXG4gIFwiUHJvbWlzZVwiLFxuICBcIkdlbmVyYXRvclwiLFxuICBcIkdlbmVyYXRvckZ1bmN0aW9uXCIsXG4gIFwiQXN5bmNGdW5jdGlvblwiLFxuICAvLyBSZWZsZWN0aW9uXG4gIFwiUmVmbGVjdFwiLFxuICBcIlByb3h5XCIsXG4gIC8vIEludGVybmF0aW9uYWxpemF0aW9uXG4gIFwiSW50bFwiLFxuICAvLyBXZWJBc3NlbWJseVxuICBcIldlYkFzc2VtYmx5XCJcbl07XG5cbmNvbnN0IEVSUk9SX1RZUEVTID0gW1xuICBcIkVycm9yXCIsXG4gIFwiRXZhbEVycm9yXCIsXG4gIFwiSW50ZXJuYWxFcnJvclwiLFxuICBcIlJhbmdlRXJyb3JcIixcbiAgXCJSZWZlcmVuY2VFcnJvclwiLFxuICBcIlN5bnRheEVycm9yXCIsXG4gIFwiVHlwZUVycm9yXCIsXG4gIFwiVVJJRXJyb3JcIlxuXTtcblxuY29uc3QgQlVJTFRfSU5fR0xPQkFMUyA9IFtcbiAgXCJzZXRJbnRlcnZhbFwiLFxuICBcInNldFRpbWVvdXRcIixcbiAgXCJjbGVhckludGVydmFsXCIsXG4gIFwiY2xlYXJUaW1lb3V0XCIsXG5cbiAgXCJyZXF1aXJlXCIsXG4gIFwiZXhwb3J0c1wiLFxuXG4gIFwiZXZhbFwiLFxuICBcImlzRmluaXRlXCIsXG4gIFwiaXNOYU5cIixcbiAgXCJwYXJzZUZsb2F0XCIsXG4gIFwicGFyc2VJbnRcIixcbiAgXCJkZWNvZGVVUklcIixcbiAgXCJkZWNvZGVVUklDb21wb25lbnRcIixcbiAgXCJlbmNvZGVVUklcIixcbiAgXCJlbmNvZGVVUklDb21wb25lbnRcIixcbiAgXCJlc2NhcGVcIixcbiAgXCJ1bmVzY2FwZVwiXG5dO1xuXG5jb25zdCBCVUlMVF9JTl9WQVJJQUJMRVMgPSBbXG4gIFwiYXJndW1lbnRzXCIsXG4gIFwidGhpc1wiLFxuICBcInN1cGVyXCIsXG4gIFwiY29uc29sZVwiLFxuICBcIndpbmRvd1wiLFxuICBcImRvY3VtZW50XCIsXG4gIFwibG9jYWxTdG9yYWdlXCIsXG4gIFwic2Vzc2lvblN0b3JhZ2VcIixcbiAgXCJtb2R1bGVcIixcbiAgXCJnbG9iYWxcIiAvLyBOb2RlLmpzXG5dO1xuXG5jb25zdCBCVUlMVF9JTlMgPSBbXS5jb25jYXQoXG4gIEJVSUxUX0lOX0dMT0JBTFMsXG4gIFRZUEVTLFxuICBFUlJPUl9UWVBFU1xuKTtcblxuLypcbkxhbmd1YWdlOiBKYXZhU2NyaXB0XG5EZXNjcmlwdGlvbjogSmF2YVNjcmlwdCAoSlMpIGlzIGEgbGlnaHR3ZWlnaHQsIGludGVycHJldGVkLCBvciBqdXN0LWluLXRpbWUgY29tcGlsZWQgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2Ugd2l0aCBmaXJzdC1jbGFzcyBmdW5jdGlvbnMuXG5DYXRlZ29yeTogY29tbW9uLCBzY3JpcHRpbmcsIHdlYlxuV2Vic2l0ZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGphdmFzY3JpcHQoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIC8qKlxuICAgKiBUYWtlcyBhIHN0cmluZyBsaWtlIFwiPEJvb2dlclwiIGFuZCBjaGVja3MgdG8gc2VlXG4gICAqIGlmIHdlIGNhbiBmaW5kIGEgbWF0Y2hpbmcgXCI8L0Jvb2dlclwiIGxhdGVyIGluIHRoZVxuICAgKiBjb250ZW50LlxuICAgKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gICAqIEBwYXJhbSB7e2FmdGVyOm51bWJlcn19IHBhcmFtMVxuICAgKi9cbiAgY29uc3QgaGFzQ2xvc2luZ1RhZyA9IChtYXRjaCwgeyBhZnRlciB9KSA9PiB7XG4gICAgY29uc3QgdGFnID0gXCI8L1wiICsgbWF0Y2hbMF0uc2xpY2UoMSk7XG4gICAgY29uc3QgcG9zID0gbWF0Y2guaW5wdXQuaW5kZXhPZih0YWcsIGFmdGVyKTtcbiAgICByZXR1cm4gcG9zICE9PSAtMTtcbiAgfTtcblxuICBjb25zdCBJREVOVF9SRSQxID0gSURFTlRfUkU7XG4gIGNvbnN0IEZSQUdNRU5UID0ge1xuICAgIGJlZ2luOiAnPD4nLFxuICAgIGVuZDogJzwvPidcbiAgfTtcbiAgLy8gdG8gYXZvaWQgc29tZSBzcGVjaWFsIGNhc2VzIGluc2lkZSBpc1RydWx5T3BlbmluZ1RhZ1xuICBjb25zdCBYTUxfU0VMRl9DTE9TSU5HID0gLzxbQS1aYS16MC05XFxcXC5fOi1dK1xccypcXC8+LztcbiAgY29uc3QgWE1MX1RBRyA9IHtcbiAgICBiZWdpbjogLzxbQS1aYS16MC05XFxcXC5fOi1dKy8sXG4gICAgZW5kOiAvXFwvW0EtWmEtejAtOVxcXFwuXzotXSs+fFxcLz4vLFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2hcbiAgICAgKiBAcGFyYW0ge0NhbGxiYWNrUmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICovXG4gICAgaXNUcnVseU9wZW5pbmdUYWc6IChtYXRjaCwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnN0IGFmdGVyTWF0Y2hJbmRleCA9IG1hdGNoWzBdLmxlbmd0aCArIG1hdGNoLmluZGV4O1xuICAgICAgY29uc3QgbmV4dENoYXIgPSBtYXRjaC5pbnB1dFthZnRlck1hdGNoSW5kZXhdO1xuICAgICAgaWYgKFxuICAgICAgICAvLyBIVE1MIHNob3VsZCBub3QgaW5jbHVkZSBhbm90aGVyIHJhdyBgPGAgaW5zaWRlIGEgdGFnXG4gICAgICAgIC8vIG5lc3RlZCB0eXBlP1xuICAgICAgICAvLyBgPEFycmF5PEFycmF5PG51bWJlcj4+YCwgZXRjLlxuICAgICAgICBuZXh0Q2hhciA9PT0gXCI8XCIgfHxcbiAgICAgICAgLy8gdGhlICwgZ2l2ZXMgYXdheSB0aGF0IHRoaXMgaXMgbm90IEhUTUxcbiAgICAgICAgLy8gYDxULCBBIGV4dGVuZHMga2V5b2YgVCwgVj5gXG4gICAgICAgIG5leHRDaGFyID09PSBcIixcIlxuICAgICAgICApIHtcbiAgICAgICAgcmVzcG9uc2UuaWdub3JlTWF0Y2goKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBgPHNvbWV0aGluZz5gXG4gICAgICAvLyBRdWl0ZSBwb3NzaWJseSBhIHRhZywgbGV0cyBsb29rIGZvciBhIG1hdGNoaW5nIGNsb3NpbmcgdGFnLi4uXG4gICAgICBpZiAobmV4dENoYXIgPT09IFwiPlwiKSB7XG4gICAgICAgIC8vIGlmIHdlIGNhbm5vdCBmaW5kIGEgbWF0Y2hpbmcgY2xvc2luZyB0YWcsIHRoZW4gd2VcbiAgICAgICAgLy8gd2lsbCBpZ25vcmUgaXRcbiAgICAgICAgaWYgKCFoYXNDbG9zaW5nVGFnKG1hdGNoLCB7IGFmdGVyOiBhZnRlck1hdGNoSW5kZXggfSkpIHtcbiAgICAgICAgICByZXNwb25zZS5pZ25vcmVNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGA8YmxhaCAvPmAgKHNlbGYtY2xvc2luZylcbiAgICAgIC8vIGhhbmRsZWQgYnkgc2ltcGxlU2VsZkNsb3NpbmcgcnVsZVxuXG4gICAgICBsZXQgbTtcbiAgICAgIGNvbnN0IGFmdGVyTWF0Y2ggPSBtYXRjaC5pbnB1dC5zdWJzdHJpbmcoYWZ0ZXJNYXRjaEluZGV4KTtcblxuICAgICAgLy8gc29tZSBtb3JlIHRlbXBsYXRlIHR5cGluZyBzdHVmZlxuICAgICAgLy8gIDxUID0gYW55PihrZXk/OiBzdHJpbmcpID0+IE1vZGlmeTxcbiAgICAgIGlmICgobSA9IGFmdGVyTWF0Y2gubWF0Y2goL15cXHMqPS8pKSkge1xuICAgICAgICByZXNwb25zZS5pZ25vcmVNYXRjaCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGA8RnJvbSBleHRlbmRzIHN0cmluZz5gXG4gICAgICAvLyB0ZWNobmljYWxseSB0aGlzIGNvdWxkIGJlIEhUTUwsIGJ1dCBpdCBzbWVsbHMgbGlrZSBhIHR5cGVcbiAgICAgIC8vIE5PVEU6IFRoaXMgaXMgdWdoLCBidXQgYWRkZWQgc3BlY2lmaWNhbGx5IGZvciBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8zMjc2XG4gICAgICBpZiAoKG0gPSBhZnRlck1hdGNoLm1hdGNoKC9eXFxzK2V4dGVuZHNcXHMrLykpKSB7XG4gICAgICAgIGlmIChtLmluZGV4ID09PSAwKSB7XG4gICAgICAgICAgcmVzcG9uc2UuaWdub3JlTWF0Y2goKTtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1yZXR1cm5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IEtFWVdPUkRTJDEgPSB7XG4gICAgJHBhdHRlcm46IElERU5UX1JFLFxuICAgIGtleXdvcmQ6IEtFWVdPUkRTLFxuICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgIGJ1aWx0X2luOiBCVUlMVF9JTlMsXG4gICAgXCJ2YXJpYWJsZS5sYW5ndWFnZVwiOiBCVUlMVF9JTl9WQVJJQUJMRVNcbiAgfTtcblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxpdGVyYWxzLW51bWVyaWMtbGl0ZXJhbHNcbiAgY29uc3QgZGVjaW1hbERpZ2l0cyA9ICdbMC05XShfP1swLTldKSonO1xuICBjb25zdCBmcmFjID0gYFxcXFwuKCR7ZGVjaW1hbERpZ2l0c30pYDtcbiAgLy8gRGVjaW1hbEludGVnZXJMaXRlcmFsLCBpbmNsdWRpbmcgQW5uZXggQiBOb25PY3RhbERlY2ltYWxJbnRlZ2VyTGl0ZXJhbFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFkZGl0aW9uYWwtc3ludGF4LW51bWVyaWMtbGl0ZXJhbHNcbiAgY29uc3QgZGVjaW1hbEludGVnZXIgPSBgMHxbMS05XShfP1swLTldKSp8MFswLTddKls4OV1bMC05XSpgO1xuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgLy8gRGVjaW1hbExpdGVyYWxcbiAgICAgIHsgYmVnaW46IGAoXFxcXGIoJHtkZWNpbWFsSW50ZWdlcn0pKCgke2ZyYWN9KXxcXFxcLik/fCgke2ZyYWN9KSlgICtcbiAgICAgICAgYFtlRV1bKy1dPygke2RlY2ltYWxEaWdpdHN9KVxcXFxiYCB9LFxuICAgICAgeyBiZWdpbjogYFxcXFxiKCR7ZGVjaW1hbEludGVnZXJ9KVxcXFxiKCgke2ZyYWN9KVxcXFxifFxcXFwuKT98KCR7ZnJhY30pXFxcXGJgIH0sXG5cbiAgICAgIC8vIERlY2ltYWxCaWdJbnRlZ2VyTGl0ZXJhbFxuICAgICAgeyBiZWdpbjogYFxcXFxiKDB8WzEtOV0oXz9bMC05XSkqKW5cXFxcYmAgfSxcblxuICAgICAgLy8gTm9uRGVjaW1hbEludGVnZXJMaXRlcmFsXG4gICAgICB7IGJlZ2luOiBcIlxcXFxiMFt4WF1bMC05YS1mQS1GXShfP1swLTlhLWZBLUZdKSpuP1xcXFxiXCIgfSxcbiAgICAgIHsgYmVnaW46IFwiXFxcXGIwW2JCXVswLTFdKF8/WzAtMV0pKm4/XFxcXGJcIiB9LFxuICAgICAgeyBiZWdpbjogXCJcXFxcYjBbb09dWzAtN10oXz9bMC03XSkqbj9cXFxcYlwiIH0sXG5cbiAgICAgIC8vIExlZ2FjeU9jdGFsSW50ZWdlckxpdGVyYWwgKGRvZXMgbm90IGluY2x1ZGUgdW5kZXJzY29yZSBzZXBhcmF0b3JzKVxuICAgICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hZGRpdGlvbmFsLXN5bnRheC1udW1lcmljLWxpdGVyYWxzXG4gICAgICB7IGJlZ2luOiBcIlxcXFxiMFswLTddK24/XFxcXGJcIiB9LFxuICAgIF0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnXFxcXCRcXFxceycsXG4gICAgZW5kOiAnXFxcXH0nLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgIGNvbnRhaW5zOiBbXSAvLyBkZWZpbmVkIGxhdGVyXG4gIH07XG4gIGNvbnN0IEhUTUxfVEVNUExBVEUgPSB7XG4gICAgYmVnaW46ICdodG1sYCcsXG4gICAgZW5kOiAnJyxcbiAgICBzdGFydHM6IHtcbiAgICAgIGVuZDogJ2AnLFxuICAgICAgcmV0dXJuRW5kOiBmYWxzZSxcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgU1VCU1RcbiAgICAgIF0sXG4gICAgICBzdWJMYW5ndWFnZTogJ3htbCdcbiAgICB9XG4gIH07XG4gIGNvbnN0IENTU19URU1QTEFURSA9IHtcbiAgICBiZWdpbjogJ2Nzc2AnLFxuICAgIGVuZDogJycsXG4gICAgc3RhcnRzOiB7XG4gICAgICBlbmQ6ICdgJyxcbiAgICAgIHJldHVybkVuZDogZmFsc2UsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgIFNVQlNUXG4gICAgICBdLFxuICAgICAgc3ViTGFuZ3VhZ2U6ICdjc3MnXG4gICAgfVxuICB9O1xuICBjb25zdCBURU1QTEFURV9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ2AnLFxuICAgIGVuZDogJ2AnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICBTVUJTVFxuICAgIF1cbiAgfTtcbiAgY29uc3QgSlNET0NfQ09NTUVOVCA9IGhsanMuQ09NTUVOVChcbiAgICAvXFwvXFwqXFwqKD8hXFwvKS8sXG4gICAgJ1xcXFwqLycsXG4gICAge1xuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAnKD89QFtBLVphLXpdKyknLFxuICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkb2N0YWcnLFxuICAgICAgICAgICAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdcXFxceycsXG4gICAgICAgICAgICAgIGVuZDogJ1xcXFx9JyxcbiAgICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgICAgYmVnaW46IElERU5UX1JFJDEgKyAnKD89XFxcXHMqKC0pfCQpJyxcbiAgICAgICAgICAgICAgZW5kc1BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gZWF0IHNwYWNlcyAobm90IG5ld2xpbmVzKSBzbyB3ZSBjYW4gZmluZFxuICAgICAgICAgICAgLy8gdHlwZXMgb3IgdmFyaWFibGVzXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJlZ2luOiAvKD89W15cXG5dKVxccy8sXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgKTtcbiAgY29uc3QgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6IFwiY29tbWVudFwiLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICBKU0RPQ19DT01NRU5ULFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERVxuICAgIF1cbiAgfTtcbiAgY29uc3QgU1VCU1RfSU5URVJOQUxTID0gW1xuICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIEhUTUxfVEVNUExBVEUsXG4gICAgQ1NTX1RFTVBMQVRFLFxuICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICAvLyBTa2lwIG51bWJlcnMgd2hlbiB0aGV5IGFyZSBwYXJ0IG9mIGEgdmFyaWFibGUgbmFtZVxuICAgIHsgbWF0Y2g6IC9cXCRcXGQrLyB9LFxuICAgIE5VTUJFUixcbiAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsOlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8zMjg4XG4gICAgLy8gaGxqcy5SRUdFWFBfTU9ERVxuICBdO1xuICBTVUJTVC5jb250YWlucyA9IFNVQlNUX0lOVEVSTkFMU1xuICAgIC5jb25jYXQoe1xuICAgICAgLy8gd2UgbmVlZCB0byBwYWlyIHVwIHt9IGluc2lkZSBvdXIgc3Vic3QgdG8gcHJldmVudFxuICAgICAgLy8gaXQgZnJvbSBlbmRpbmcgdG9vIGVhcmx5IGJ5IG1hdGNoaW5nIGFub3RoZXIgfVxuICAgICAgYmVnaW46IC9cXHsvLFxuICAgICAgZW5kOiAvXFx9LyxcbiAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgXCJzZWxmXCJcbiAgICAgIF0uY29uY2F0KFNVQlNUX0lOVEVSTkFMUylcbiAgICB9KTtcbiAgY29uc3QgU1VCU1RfQU5EX0NPTU1FTlRTID0gW10uY29uY2F0KENPTU1FTlQsIFNVQlNULmNvbnRhaW5zKTtcbiAgY29uc3QgUEFSQU1TX0NPTlRBSU5TID0gU1VCU1RfQU5EX0NPTU1FTlRTLmNvbmNhdChbXG4gICAgLy8gZWF0IHJlY3Vyc2l2ZSBwYXJlbnMgaW4gc3ViIGV4cHJlc3Npb25zXG4gICAge1xuICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgZW5kOiAvXFwpLyxcbiAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgY29udGFpbnM6IFtcInNlbGZcIl0uY29uY2F0KFNVQlNUX0FORF9DT01NRU5UUylcbiAgICB9XG4gIF0pO1xuICBjb25zdCBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogL1xcKC8sXG4gICAgZW5kOiAvXFwpLyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMkMSxcbiAgICBjb250YWluczogUEFSQU1TX0NPTlRBSU5TXG4gIH07XG5cbiAgLy8gRVM2IGNsYXNzZXNcbiAgY29uc3QgQ0xBU1NfT1JfRVhURU5EUyA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAgLy8gY2xhc3MgQ2FyIGV4dGVuZHMgdmVoaWNsZVxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jbGFzcy8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDEsXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIC9leHRlbmRzLyxcbiAgICAgICAgICAvXFxzKy8sXG4gICAgICAgICAgcmVnZXguY29uY2F0KElERU5UX1JFJDEsIFwiKFwiLCByZWdleC5jb25jYXQoL1xcLi8sIElERU5UX1JFJDEpLCBcIikqXCIpXG4gICAgICAgIF0sXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ0aXRsZS5jbGFzc1wiLFxuICAgICAgICAgIDU6IFwia2V5d29yZFwiLFxuICAgICAgICAgIDc6IFwidGl0bGUuY2xhc3MuaW5oZXJpdGVkXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIGNsYXNzIENhclxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jbGFzcy8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDFcbiAgICAgICAgXSxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInRpdGxlLmNsYXNzXCJcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgIF1cbiAgfTtcblxuICBjb25zdCBDTEFTU19SRUZFUkVOQ0UgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIG1hdGNoOlxuICAgIHJlZ2V4LmVpdGhlcihcbiAgICAgIC8vIEhhcmQgY29kZWQgZXhjZXB0aW9uc1xuICAgICAgL1xcYkpTT04vLFxuICAgICAgLy8gRmxvYXQzMkFycmF5LCBPdXRUXG4gICAgICAvXFxiW0EtWl1bYS16XSsoW0EtWl1bYS16XSp8XFxkKSovLFxuICAgICAgLy8gQ1NTRmFjdG9yeSwgQ1NTRmFjdG9yeVRcbiAgICAgIC9cXGJbQS1aXXsyLH0oW0EtWl1bYS16XSt8XFxkKSsoW0EtWl1bYS16XSopKi8sXG4gICAgICAvLyBGUHMsIEZQc1RcbiAgICAgIC9cXGJbQS1aXXsyLH1bYS16XSsoW0EtWl1bYS16XSt8XFxkKSooW0EtWl1bYS16XSopKi8sXG4gICAgICAvLyBQXG4gICAgICAvLyBzaW5nbGUgbGV0dGVycyBhcmUgbm90IGhpZ2hsaWdodGVkXG4gICAgICAvLyBCTEFIXG4gICAgICAvLyB0aGlzIHdpbGwgYmUgZmxhZ2dlZCBhcyBhIFVQUEVSX0NBU0VfQ09OU1RBTlQgaW5zdGVhZFxuICAgICksXG4gICAgY2xhc3NOYW1lOiBcInRpdGxlLmNsYXNzXCIsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIF86IFtcbiAgICAgICAgLy8gc2Ugd2Ugc3RpbGwgZ2V0IHJlbGV2YW5jZSBjcmVkaXQgZm9yIEpTIGxpYnJhcnkgY2xhc3Nlc1xuICAgICAgICAuLi5UWVBFUyxcbiAgICAgICAgLi4uRVJST1JfVFlQRVNcbiAgICAgIF1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgVVNFX1NUUklDVCA9IHtcbiAgICBsYWJlbDogXCJ1c2Vfc3RyaWN0XCIsXG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgcmVsZXZhbmNlOiAxMCxcbiAgICBiZWdpbjogL15cXHMqWydcIl11c2UgKHN0cmljdHxhc20pWydcIl0vXG4gIH07XG5cbiAgY29uc3QgRlVOQ1RJT05fREVGSU5JVElPTiA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9mdW5jdGlvbi8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDEsXG4gICAgICAgICAgLyg/PVxccypcXCgpL1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL2Z1bmN0aW9uLyxcbiAgICAgICAgICAvXFxzKig/PVxcKCkvXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAzOiBcInRpdGxlLmZ1bmN0aW9uXCJcbiAgICB9LFxuICAgIGxhYmVsOiBcImZ1bmMuZGVmXCIsXG4gICAgY29udGFpbnM6IFsgUEFSQU1TIF0sXG4gICAgaWxsZWdhbDogLyUvXG4gIH07XG5cbiAgY29uc3QgVVBQRVJfQ0FTRV9DT05TVEFOVCA9IHtcbiAgICByZWxldmFuY2U6IDAsXG4gICAgbWF0Y2g6IC9cXGJbQS1aXVtBLVpfMC05XStcXGIvLFxuICAgIGNsYXNzTmFtZTogXCJ2YXJpYWJsZS5jb25zdGFudFwiXG4gIH07XG5cbiAgZnVuY3Rpb24gbm9uZU9mKGxpc3QpIHtcbiAgICByZXR1cm4gcmVnZXguY29uY2F0KFwiKD8hXCIsIGxpc3Quam9pbihcInxcIiksIFwiKVwiKTtcbiAgfVxuXG4gIGNvbnN0IEZVTkNUSU9OX0NBTEwgPSB7XG4gICAgbWF0Y2g6IHJlZ2V4LmNvbmNhdChcbiAgICAgIC9cXGIvLFxuICAgICAgbm9uZU9mKFtcbiAgICAgICAgLi4uQlVJTFRfSU5fR0xPQkFMUyxcbiAgICAgICAgXCJzdXBlclwiLFxuICAgICAgICBcImltcG9ydFwiXG4gICAgICBdKSxcbiAgICAgIElERU5UX1JFJDEsIHJlZ2V4Lmxvb2thaGVhZCgvXFwoLykpLFxuICAgIGNsYXNzTmFtZTogXCJ0aXRsZS5mdW5jdGlvblwiLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFBST1BFUlRZX0FDQ0VTUyA9IHtcbiAgICBiZWdpbjogcmVnZXguY29uY2F0KC9cXC4vLCByZWdleC5sb29rYWhlYWQoXG4gICAgICByZWdleC5jb25jYXQoSURFTlRfUkUkMSwgLyg/IVswLTlBLVphLXokXyhdKS8pXG4gICAgKSksXG4gICAgZW5kOiBJREVOVF9SRSQxLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICBrZXl3b3JkczogXCJwcm90b3R5cGVcIixcbiAgICBjbGFzc05hbWU6IFwicHJvcGVydHlcIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBHRVRURVJfT1JfU0VUVEVSID0ge1xuICAgIG1hdGNoOiBbXG4gICAgICAvZ2V0fHNldC8sXG4gICAgICAvXFxzKy8sXG4gICAgICBJREVOVF9SRSQxLFxuICAgICAgLyg/PVxcKCkvXG4gICAgXSxcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgMzogXCJ0aXRsZS5mdW5jdGlvblwiXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgeyAvLyBlYXQgdG8gYXZvaWQgZW1wdHkgcGFyYW1zXG4gICAgICAgIGJlZ2luOiAvXFwoXFwpL1xuICAgICAgfSxcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICBjb25zdCBGVU5DX0xFQURfSU5fUkUgPSAnKFxcXFwoJyArXG4gICAgJ1teKCldKihcXFxcKCcgK1xuICAgICdbXigpXSooXFxcXCgnICtcbiAgICAnW14oKV0qJyArXG4gICAgJ1xcXFwpW14oKV0qKSonICtcbiAgICAnXFxcXClbXigpXSopKicgK1xuICAgICdcXFxcKXwnICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJylcXFxccyo9Pic7XG5cbiAgY29uc3QgRlVOQ1RJT05fVkFSSUFCTEUgPSB7XG4gICAgbWF0Y2g6IFtcbiAgICAgIC9jb25zdHx2YXJ8bGV0LywgL1xccysvLFxuICAgICAgSURFTlRfUkUkMSwgL1xccyovLFxuICAgICAgLz1cXHMqLyxcbiAgICAgIC8oYXN5bmNcXHMqKT8vLCAvLyBhc3luYyBpcyBvcHRpb25hbFxuICAgICAgcmVnZXgubG9va2FoZWFkKEZVTkNfTEVBRF9JTl9SRSlcbiAgICBdLFxuICAgIGtleXdvcmRzOiBcImFzeW5jXCIsXG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdKYXZhc2NyaXB0JyxcbiAgICBhbGlhc2VzOiBbJ2pzJywgJ2pzeCcsICdtanMnLCAnY2pzJ10sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTJDEsXG4gICAgLy8gdGhpcyB3aWxsIGJlIGV4dGVuZGVkIGJ5IFR5cGVTY3JpcHRcbiAgICBleHBvcnRzOiB7IFBBUkFNU19DT05UQUlOUywgQ0xBU1NfUkVGRVJFTkNFIH0sXG4gICAgaWxsZWdhbDogLyMoPyFbJF9BLXpdKS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuU0hFQkFORyh7XG4gICAgICAgIGxhYmVsOiBcInNoZWJhbmdcIixcbiAgICAgICAgYmluYXJ5OiBcIm5vZGVcIixcbiAgICAgICAgcmVsZXZhbmNlOiA1XG4gICAgICB9KSxcbiAgICAgIFVTRV9TVFJJQ1QsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgSFRNTF9URU1QTEFURSxcbiAgICAgIENTU19URU1QTEFURSxcbiAgICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICAgIENPTU1FTlQsXG4gICAgICAvLyBTa2lwIG51bWJlcnMgd2hlbiB0aGV5IGFyZSBwYXJ0IG9mIGEgdmFyaWFibGUgbmFtZVxuICAgICAgeyBtYXRjaDogL1xcJFxcZCsvIH0sXG4gICAgICBOVU1CRVIsXG4gICAgICBDTEFTU19SRUZFUkVOQ0UsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHInLFxuICAgICAgICBiZWdpbjogSURFTlRfUkUkMSArIHJlZ2V4Lmxvb2thaGVhZCgnOicpLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBGVU5DVElPTl9WQVJJQUJMRSxcbiAgICAgIHsgLy8gXCJ2YWx1ZVwiIGNvbnRhaW5lclxuICAgICAgICBiZWdpbjogJygnICsgaGxqcy5SRV9TVEFSVEVSU19SRSArICd8XFxcXGIoY2FzZXxyZXR1cm58dGhyb3cpXFxcXGIpXFxcXHMqJyxcbiAgICAgICAga2V5d29yZHM6ICdyZXR1cm4gdGhyb3cgY2FzZScsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBDT01NRU5ULFxuICAgICAgICAgIGhsanMuUkVHRVhQX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBjb3VudCB0aGUgcGFyZW5zIHRvIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIHRoZVxuICAgICAgICAgICAgLy8gY29ycmVjdCBib3VuZGluZyAoICkgYmVmb3JlIHRoZSA9Pi4gIFRoZXJlIGNvdWxkIGJlIGFueSBudW1iZXIgb2ZcbiAgICAgICAgICAgIC8vIHN1Yi1leHByZXNzaW9ucyBpbnNpZGUgYWxzbyBzdXJyb3VuZGVkIGJ5IHBhcmVucy5cbiAgICAgICAgICAgIGJlZ2luOiBGVU5DX0xFQURfSU5fUkUsXG4gICAgICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuZDogJ1xcXFxzKj0+JyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBiZWdpbjogL1xcKFxccypcXCkvLFxuICAgICAgICAgICAgICAgICAgICBza2lwOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgICAgICAgICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTJDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBQQVJBTVNfQ09OVEFJTlNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgLy8gY291bGQgYmUgYSBjb21tYSBkZWxpbWl0ZWQgbGlzdCBvZiBwYXJhbXMgdG8gYSBmdW5jdGlvbiBjYWxsXG4gICAgICAgICAgICBiZWdpbjogLywvLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXRjaDogL1xccysvLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IC8vIEpTWFxuICAgICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgICAgeyBiZWdpbjogRlJBR01FTlQuYmVnaW4sIGVuZDogRlJBR01FTlQuZW5kIH0sXG4gICAgICAgICAgICAgIHsgbWF0Y2g6IFhNTF9TRUxGX0NMT1NJTkcgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZ2luOiBYTUxfVEFHLmJlZ2luLFxuICAgICAgICAgICAgICAgIC8vIHdlIGNhcmVmdWxseSBjaGVjayB0aGUgb3BlbmluZyB0YWcgdG8gc2VlIGlmIGl0IHRydWx5XG4gICAgICAgICAgICAgICAgLy8gaXMgYSB0YWcgYW5kIG5vdCBhIGZhbHNlIHBvc2l0aXZlXG4gICAgICAgICAgICAgICAgJ29uOmJlZ2luJzogWE1MX1RBRy5pc1RydWx5T3BlbmluZ1RhZyxcbiAgICAgICAgICAgICAgICBlbmQ6IFhNTF9UQUcuZW5kXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdWJMYW5ndWFnZTogJ3htbCcsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46IFhNTF9UQUcuYmVnaW4sXG4gICAgICAgICAgICAgICAgZW5kOiBYTUxfVEFHLmVuZCxcbiAgICAgICAgICAgICAgICBza2lwOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEZVTkNUSU9OX0RFRklOSVRJT04sXG4gICAgICB7XG4gICAgICAgIC8vIHByZXZlbnQgdGhpcyBmcm9tIGdldHRpbmcgc3dhbGxvd2VkIHVwIGJ5IGZ1bmN0aW9uXG4gICAgICAgIC8vIHNpbmNlIHRoZXkgYXBwZWFyIFwiZnVuY3Rpb24gbGlrZVwiXG4gICAgICAgIGJlZ2luS2V5d29yZHM6IFwid2hpbGUgaWYgc3dpdGNoIGNhdGNoIGZvclwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyB3ZSBoYXZlIHRvIGNvdW50IHRoZSBwYXJlbnMgdG8gbWFrZSBzdXJlIHdlIGFjdHVhbGx5IGhhdmUgdGhlIGNvcnJlY3RcbiAgICAgICAgLy8gYm91bmRpbmcgKCApLiAgVGhlcmUgY291bGQgYmUgYW55IG51bWJlciBvZiBzdWItZXhwcmVzc2lvbnMgaW5zaWRlXG4gICAgICAgIC8vIGFsc28gc3Vycm91bmRlZCBieSBwYXJlbnMuXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoPyFmdW5jdGlvbiknICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICtcbiAgICAgICAgICAnXFxcXCgnICsgLy8gZmlyc3QgcGFyZW5zXG4gICAgICAgICAgJ1teKCldKihcXFxcKCcgK1xuICAgICAgICAgICAgJ1teKCldKihcXFxcKCcgK1xuICAgICAgICAgICAgICAnW14oKV0qJyArXG4gICAgICAgICAgICAnXFxcXClbXigpXSopKicgK1xuICAgICAgICAgICdcXFxcKVteKCldKikqJyArXG4gICAgICAgICAgJ1xcXFwpXFxcXHMqXFxcXHsnLCAvLyBlbmQgcGFyZW5zXG4gICAgICAgIHJldHVybkJlZ2luOnRydWUsXG4gICAgICAgIGxhYmVsOiBcImZ1bmMuZGVmXCIsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgUEFSQU1TLFxuICAgICAgICAgIGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHsgYmVnaW46IElERU5UX1JFJDEsIGNsYXNzTmFtZTogXCJ0aXRsZS5mdW5jdGlvblwiIH0pXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBjYXRjaCAuLi4gc28gaXQgd29uJ3QgdHJpZ2dlciB0aGUgcHJvcGVydHkgcnVsZSBiZWxvd1xuICAgICAge1xuICAgICAgICBtYXRjaDogL1xcLlxcLlxcLi8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIFBST1BFUlRZX0FDQ0VTUyxcbiAgICAgIC8vIGhhY2s6IHByZXZlbnRzIGRldGVjdGlvbiBvZiBrZXl3b3JkcyBpbiBzb21lIGNpcmN1bXN0YW5jZXNcbiAgICAgIC8vIC5rZXl3b3JkKClcbiAgICAgIC8vICRrZXl3b3JkID0geFxuICAgICAge1xuICAgICAgICBtYXRjaDogJ1xcXFwkJyArIElERU5UX1JFJDEsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6IFsgL1xcYmNvbnN0cnVjdG9yKD89XFxzKlxcKCkvIF0sXG4gICAgICAgIGNsYXNzTmFtZTogeyAxOiBcInRpdGxlLmZ1bmN0aW9uXCIgfSxcbiAgICAgICAgY29udGFpbnM6IFsgUEFSQU1TIF1cbiAgICAgIH0sXG4gICAgICBGVU5DVElPTl9DQUxMLFxuICAgICAgVVBQRVJfQ0FTRV9DT05TVEFOVCxcbiAgICAgIENMQVNTX09SX0VYVEVORFMsXG4gICAgICBHRVRURVJfT1JfU0VUVEVSLFxuICAgICAge1xuICAgICAgICBtYXRjaDogL1xcJFsoLl0vIC8vIHJlbGV2YW5jZSBib29zdGVyIGZvciBhIHBhdHRlcm4gY29tbW9uIHRvIEpTIGxpYnM6IGAkKHNvbWV0aGluZylgIGFuZCBgJC5zb21ldGhpbmdgXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBqYXZhc2NyaXB0IGFzIGRlZmF1bHQgfTtcbiJdfQ==