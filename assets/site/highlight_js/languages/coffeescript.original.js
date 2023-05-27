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
const BUILT_INS = [].concat(BUILT_IN_GLOBALS, TYPES, ERROR_TYPES);
function coffeescript(hljs) {
    const COFFEE_BUILT_INS = [
        'npm',
        'print'
    ];
    const COFFEE_LITERALS = [
        'yes',
        'no',
        'on',
        'off'
    ];
    const COFFEE_KEYWORDS = [
        'then',
        'unless',
        'until',
        'loop',
        'by',
        'when',
        'and',
        'or',
        'is',
        'isnt',
        'not'
    ];
    const NOT_VALID_KEYWORDS = [
        "var",
        "const",
        "let",
        "function",
        "static"
    ];
    const excluding = (list) => (kw) => !list.includes(kw);
    const KEYWORDS$1 = {
        keyword: KEYWORDS.concat(COFFEE_KEYWORDS).filter(excluding(NOT_VALID_KEYWORDS)),
        literal: LITERALS.concat(COFFEE_LITERALS),
        built_in: BUILT_INS.concat(COFFEE_BUILT_INS)
    };
    const JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
    const SUBST = {
        className: 'subst',
        begin: /#\{/,
        end: /\}/,
        keywords: KEYWORDS$1
    };
    const EXPRESSIONS = [
        hljs.BINARY_NUMBER_MODE,
        hljs.inherit(hljs.C_NUMBER_MODE, { starts: {
                end: '(\\s*/)?',
                relevance: 0
            } }),
        {
            className: 'string',
            variants: [
                {
                    begin: /'''/,
                    end: /'''/,
                    contains: [hljs.BACKSLASH_ESCAPE]
                },
                {
                    begin: /'/,
                    end: /'/,
                    contains: [hljs.BACKSLASH_ESCAPE]
                },
                {
                    begin: /"""/,
                    end: /"""/,
                    contains: [
                        hljs.BACKSLASH_ESCAPE,
                        SUBST
                    ]
                },
                {
                    begin: /"/,
                    end: /"/,
                    contains: [
                        hljs.BACKSLASH_ESCAPE,
                        SUBST
                    ]
                }
            ]
        },
        {
            className: 'regexp',
            variants: [
                {
                    begin: '///',
                    end: '///',
                    contains: [
                        SUBST,
                        hljs.HASH_COMMENT_MODE
                    ]
                },
                {
                    begin: '//[gim]{0,3}(?=\\W)',
                    relevance: 0
                },
                {
                    begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/
                }
            ]
        },
        { begin: '@' + JS_IDENT_RE
        },
        {
            subLanguage: 'javascript',
            excludeBegin: true,
            excludeEnd: true,
            variants: [
                {
                    begin: '```',
                    end: '```'
                },
                {
                    begin: '`',
                    end: '`'
                }
            ]
        }
    ];
    SUBST.contains = EXPRESSIONS;
    const TITLE = hljs.inherit(hljs.TITLE_MODE, { begin: JS_IDENT_RE });
    const POSSIBLE_PARAMS_RE = '(\\(.*\\)\\s*)?\\B[-=]>';
    const PARAMS = {
        className: 'params',
        begin: '\\([^\\(]',
        returnBegin: true,
        contains: [
            {
                begin: /\(/,
                end: /\)/,
                keywords: KEYWORDS$1,
                contains: ['self'].concat(EXPRESSIONS)
            }
        ]
    };
    const CLASS_DEFINITION = {
        variants: [
            { match: [
                    /class\s+/,
                    JS_IDENT_RE,
                    /\s+extends\s+/,
                    JS_IDENT_RE
                ] },
            { match: [
                    /class\s+/,
                    JS_IDENT_RE
                ] }
        ],
        scope: {
            2: "title.class",
            4: "title.class.inherited"
        },
        keywords: KEYWORDS$1
    };
    return {
        name: 'CoffeeScript',
        aliases: [
            'coffee',
            'cson',
            'iced'
        ],
        keywords: KEYWORDS$1,
        illegal: /\/\*/,
        contains: [
            ...EXPRESSIONS,
            hljs.COMMENT('###', '###'),
            hljs.HASH_COMMENT_MODE,
            {
                className: 'function',
                begin: '^\\s*' + JS_IDENT_RE + '\\s*=\\s*' + POSSIBLE_PARAMS_RE,
                end: '[-=]>',
                returnBegin: true,
                contains: [
                    TITLE,
                    PARAMS
                ]
            },
            {
                begin: /[:\(,=]\s*/,
                relevance: 0,
                contains: [
                    {
                        className: 'function',
                        begin: POSSIBLE_PARAMS_RE,
                        end: '[-=]>',
                        returnBegin: true,
                        contains: [PARAMS]
                    }
                ]
            },
            CLASS_DEFINITION,
            {
                begin: JS_IDENT_RE + ':',
                end: ':',
                returnBegin: true,
                returnEnd: true,
                relevance: 0
            }
        ]
    };
}
export { coffeescript as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29mZmVlc2NyaXB0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvY29mZmVlc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sUUFBUSxHQUFHO0lBQ2YsSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLEtBQUs7SUFDTCxPQUFPO0lBQ1AsU0FBUztJQUNULEtBQUs7SUFDTCxLQUFLO0lBQ0wsVUFBVTtJQUNWLElBQUk7SUFDSixRQUFRO0lBQ1IsTUFBTTtJQUNOLE1BQU07SUFDTixPQUFPO0lBQ1AsT0FBTztJQUNQLFlBQVk7SUFDWixNQUFNO0lBQ04sT0FBTztJQUNQLE1BQU07SUFDTixTQUFTO0lBQ1QsS0FBSztJQUNMLFFBQVE7SUFDUixVQUFVO0lBQ1YsUUFBUTtJQUNSLFFBQVE7SUFDUixLQUFLO0lBQ0wsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBSVAsVUFBVTtJQUNWLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0lBQ04sUUFBUTtJQUNSLFNBQVM7Q0FDVixDQUFDO0FBQ0YsTUFBTSxRQUFRLEdBQUc7SUFDZixNQUFNO0lBQ04sT0FBTztJQUNQLE1BQU07SUFDTixXQUFXO0lBQ1gsS0FBSztJQUNMLFVBQVU7Q0FDWCxDQUFDO0FBR0YsTUFBTSxLQUFLLEdBQUc7SUFFWixRQUFRO0lBQ1IsVUFBVTtJQUNWLFNBQVM7SUFDVCxRQUFRO0lBRVIsTUFBTTtJQUNOLE1BQU07SUFDTixRQUFRO0lBQ1IsUUFBUTtJQUVSLFFBQVE7SUFDUixRQUFRO0lBRVIsT0FBTztJQUNQLGNBQWM7SUFDZCxjQUFjO0lBQ2QsV0FBVztJQUNYLFlBQVk7SUFDWixtQkFBbUI7SUFDbkIs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QkFBa0I7Z0JBQy9ELEdBQUcsRUFBRSxPQUFPO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1IsS0FBSztvQkFDTCxNQUFNO2lCQUNQO2FBQ0Y7WUFDRDtnQkFFRSxLQUFLLEVBQUUsWUFBWTtnQkFDbkIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxVQUFVO3dCQUNyQixLQUFLLEVBQUUsa0JBQWtCO3dCQUN6QixHQUFHLEVBQUUsT0FBTzt3QkFDWixXQUFXLEVBQUUsSUFBSTt3QkFDakIsUUFBUSxFQUFFLENBQUUsTUFBTSxDQUFFO3FCQUNyQjtpQkFDRjthQUNGO1lBQ0QsZ0JBQWdCO1lBQ2hCO2dCQUNFLEtBQUssRUFBRSxXQUFXLEdBQUcsR0FBRztnQkFDeEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFlBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEtFWVdPUkRTID0gW1xuICBcImFzXCIsIC8vIGZvciBleHBvcnRzXG4gIFwiaW5cIixcbiAgXCJvZlwiLFxuICBcImlmXCIsXG4gIFwiZm9yXCIsXG4gIFwid2hpbGVcIixcbiAgXCJmaW5hbGx5XCIsXG4gIFwidmFyXCIsXG4gIFwibmV3XCIsXG4gIFwiZnVuY3Rpb25cIixcbiAgXCJkb1wiLFxuICBcInJldHVyblwiLFxuICBcInZvaWRcIixcbiAgXCJlbHNlXCIsXG4gIFwiYnJlYWtcIixcbiAgXCJjYXRjaFwiLFxuICBcImluc3RhbmNlb2ZcIixcbiAgXCJ3aXRoXCIsXG4gIFwidGhyb3dcIixcbiAgXCJjYXNlXCIsXG4gIFwiZGVmYXVsdFwiLFxuICBcInRyeVwiLFxuICBcInN3aXRjaFwiLFxuICBcImNvbnRpbnVlXCIsXG4gIFwidHlwZW9mXCIsXG4gIFwiZGVsZXRlXCIsXG4gIFwibGV0XCIsXG4gIFwieWllbGRcIixcbiAgXCJjb25zdFwiLFxuICBcImNsYXNzXCIsXG4gIC8vIEpTIGhhbmRsZXMgdGhlc2Ugd2l0aCBhIHNwZWNpYWwgcnVsZVxuICAvLyBcImdldFwiLFxuICAvLyBcInNldFwiLFxuICBcImRlYnVnZ2VyXCIsXG4gIFwiYXN5bmNcIixcbiAgXCJhd2FpdFwiLFxuICBcInN0YXRpY1wiLFxuICBcImltcG9ydFwiLFxuICBcImZyb21cIixcbiAgXCJleHBvcnRcIixcbiAgXCJleHRlbmRzXCJcbl07XG5jb25zdCBMSVRFUkFMUyA9IFtcbiAgXCJ0cnVlXCIsXG4gIFwiZmFsc2VcIixcbiAgXCJudWxsXCIsXG4gIFwidW5kZWZpbmVkXCIsXG4gIFwiTmFOXCIsXG4gIFwiSW5maW5pdHlcIlxuXTtcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHNcbmNvbnN0IFRZUEVTID0gW1xuICAvLyBGdW5kYW1lbnRhbCBvYmplY3RzXG4gIFwiT2JqZWN0XCIsXG4gIFwiRnVuY3Rpb25cIixcbiAgXCJCb29sZWFuXCIsXG4gIFwiU3ltYm9sXCIsXG4gIC8vIG51bWJlcnMgYW5kIGRhdGVzXG4gIFwiTWF0aFwiLFxuICBcIkRhdGVcIixcbiAgXCJOdW1iZXJcIixcbiAgXCJCaWdJbnRcIixcbiAgLy8gdGV4dFxuICBcIlN0cmluZ1wiLFxuICBcIlJlZ0V4cFwiLFxuICAvLyBJbmRleGVkIGNvbGxlY3Rpb25zXG4gIFwiQXJyYXlcIixcbiAgXCJGbG9hdDMyQXJyYXlcIixcbiAgXCJGbG9hdDY0QXJyYXlcIixcbiAgXCJJbnQ4QXJyYXlcIixcbiAgXCJVaW50OEFycmF5XCIsXG4gIFwiVWludDhDbGFtcGVkQXJyYXlcIixcbiAgXCJJbnQxNkFycmF5XCIsXG4gIFwiSW50MzJBcnJheVwiLFxuICBcIlVpbnQxNkFycmF5XCIsXG4gIFwiVWludDMyQXJyYXlcIixcbiAgXCJCaWdJbnQ2NEFycmF5XCIsXG4gIFwiQmlnVWludDY0QXJyYXlcIixcbiAgLy8gS2V5ZWQgY29sbGVjdGlvbnNcbiAgXCJTZXRcIixcbiAgXCJNYXBcIixcbiAgXCJXZWFrU2V0XCIsXG4gIFwiV2Vha01hcFwiLFxuICAvLyBTdHJ1Y3R1cmVkIGRhdGFcbiAgXCJBcnJheUJ1ZmZlclwiLFxuICBcIlNoYXJlZEFycmF5QnVmZmVyXCIsXG4gIFwiQXRvbWljc1wiLFxuICBcIkRhdGFWaWV3XCIsXG4gIFwiSlNPTlwiLFxuICAvLyBDb250cm9sIGFic3RyYWN0aW9uIG9iamVjdHNcbiAgXCJQcm9taXNlXCIsXG4gIFwiR2VuZXJhdG9yXCIsXG4gIFwiR2VuZXJhdG9yRnVuY3Rpb25cIixcbiAgXCJBc3luY0Z1bmN0aW9uXCIsXG4gIC8vIFJlZmxlY3Rpb25cbiAgXCJSZWZsZWN0XCIsXG4gIFwiUHJveHlcIixcbiAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cbiAgXCJJbnRsXCIsXG4gIC8vIFdlYkFzc2VtYmx5XG4gIFwiV2ViQXNzZW1ibHlcIlxuXTtcblxuY29uc3QgRVJST1JfVFlQRVMgPSBbXG4gIFwiRXJyb3JcIixcbiAgXCJFdmFsRXJyb3JcIixcbiAgXCJJbnRlcm5hbEVycm9yXCIsXG4gIFwiUmFuZ2VFcnJvclwiLFxuICBcIlJlZmVyZW5jZUVycm9yXCIsXG4gIFwiU3ludGF4RXJyb3JcIixcbiAgXCJUeXBlRXJyb3JcIixcbiAgXCJVUklFcnJvclwiXG5dO1xuXG5jb25zdCBCVUlMVF9JTl9HTE9CQUxTID0gW1xuICBcInNldEludGVydmFsXCIsXG4gIFwic2V0VGltZW91dFwiLFxuICBcImNsZWFySW50ZXJ2YWxcIixcbiAgXCJjbGVhclRpbWVvdXRcIixcblxuICBcInJlcXVpcmVcIixcbiAgXCJleHBvcnRzXCIsXG5cbiAgXCJldmFsXCIsXG4gIFwiaXNGaW5pdGVcIixcbiAgXCJpc05hTlwiLFxuICBcInBhcnNlRmxvYXRcIixcbiAgXCJwYXJzZUludFwiLFxuICBcImRlY29kZVVSSVwiLFxuICBcImRlY29kZVVSSUNvbXBvbmVudFwiLFxuICBcImVuY29kZVVSSVwiLFxuICBcImVuY29kZVVSSUNvbXBvbmVudFwiLFxuICBcImVzY2FwZVwiLFxuICBcInVuZXNjYXBlXCJcbl07XG5cbmNvbnN0IEJVSUxUX0lOUyA9IFtdLmNvbmNhdChcbiAgQlVJTFRfSU5fR0xPQkFMUyxcbiAgVFlQRVMsXG4gIEVSUk9SX1RZUEVTXG4pO1xuXG4vKlxuTGFuZ3VhZ2U6IENvZmZlZVNjcmlwdFxuQXV0aG9yOiBEbXl0cmlpIE5hZ2lybmlhayA8ZG5hZ2lyQGdtYWlsLmNvbT5cbkNvbnRyaWJ1dG9yczogT2xlZyBFZmltb3YgPGVmaW1vdm92QGdtYWlsLmNvbT4sIEPDqWRyaWMgTsOpaMOpbWllIDxjZWRyaWMubmVoZW1pZUBnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogQ29mZmVlU2NyaXB0IGlzIGEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UgdGhhdCB0cmFuc2NvbXBpbGVzIHRvIEphdmFTY3JpcHQuIEZvciBpbmZvIGFib3V0IGxhbmd1YWdlIHNlZSBodHRwOi8vY29mZmVlc2NyaXB0Lm9yZy9cbkNhdGVnb3J5OiBzY3JpcHRpbmdcbldlYnNpdGU6IGh0dHBzOi8vY29mZmVlc2NyaXB0Lm9yZ1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGNvZmZlZXNjcmlwdChobGpzKSB7XG4gIGNvbnN0IENPRkZFRV9CVUlMVF9JTlMgPSBbXG4gICAgJ25wbScsXG4gICAgJ3ByaW50J1xuICBdO1xuICBjb25zdCBDT0ZGRUVfTElURVJBTFMgPSBbXG4gICAgJ3llcycsXG4gICAgJ25vJyxcbiAgICAnb24nLFxuICAgICdvZmYnXG4gIF07XG4gIGNvbnN0IENPRkZFRV9LRVlXT1JEUyA9IFtcbiAgICAndGhlbicsXG4gICAgJ3VubGVzcycsXG4gICAgJ3VudGlsJyxcbiAgICAnbG9vcCcsXG4gICAgJ2J5JyxcbiAgICAnd2hlbicsXG4gICAgJ2FuZCcsXG4gICAgJ29yJyxcbiAgICAnaXMnLFxuICAgICdpc250JyxcbiAgICAnbm90J1xuICBdO1xuICBjb25zdCBOT1RfVkFMSURfS0VZV09SRFMgPSBbXG4gICAgXCJ2YXJcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJsZXRcIixcbiAgICBcImZ1bmN0aW9uXCIsXG4gICAgXCJzdGF0aWNcIlxuICBdO1xuICBjb25zdCBleGNsdWRpbmcgPSAobGlzdCkgPT5cbiAgICAoa3cpID0+ICFsaXN0LmluY2x1ZGVzKGt3KTtcbiAgY29uc3QgS0VZV09SRFMkMSA9IHtcbiAgICBrZXl3b3JkOiBLRVlXT1JEUy5jb25jYXQoQ09GRkVFX0tFWVdPUkRTKS5maWx0ZXIoZXhjbHVkaW5nKE5PVF9WQUxJRF9LRVlXT1JEUykpLFxuICAgIGxpdGVyYWw6IExJVEVSQUxTLmNvbmNhdChDT0ZGRUVfTElURVJBTFMpLFxuICAgIGJ1aWx0X2luOiBCVUlMVF9JTlMuY29uY2F0KENPRkZFRV9CVUlMVF9JTlMpXG4gIH07XG4gIGNvbnN0IEpTX0lERU5UX1JFID0gJ1tBLVphLXokX11bMC05QS1aYS16JF9dKic7XG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogLyNcXHsvLFxuICAgIGVuZDogL1xcfS8sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTJDFcbiAgfTtcbiAgY29uc3QgRVhQUkVTU0lPTlMgPSBbXG4gICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsXG4gICAgaGxqcy5pbmhlcml0KGhsanMuQ19OVU1CRVJfTU9ERSwgeyBzdGFydHM6IHtcbiAgICAgIGVuZDogJyhcXFxccyovKT8nLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSB9KSwgLy8gYSBudW1iZXIgdHJpZXMgdG8gZWF0IHRoZSBmb2xsb3dpbmcgc2xhc2ggdG8gcHJldmVudCB0cmVhdGluZyBpdCBhcyBhIHJlZ2V4cFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICB2YXJpYW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46IC8nJycvLFxuICAgICAgICAgIGVuZDogLycnJy8sXG4gICAgICAgICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAvJy8sXG4gICAgICAgICAgZW5kOiAvJy8sXG4gICAgICAgICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAvXCJcIlwiLyxcbiAgICAgICAgICBlbmQ6IC9cIlwiXCIvLFxuICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgICAgICBTVUJTVFxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAvXCIvLFxuICAgICAgICAgIGVuZDogL1wiLyxcbiAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgICAgU1VCU1RcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICB2YXJpYW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICcvLy8nLFxuICAgICAgICAgIGVuZDogJy8vLycsXG4gICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgIFNVQlNULFxuICAgICAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAnLy9bZ2ltXXswLDN9KD89XFxcXFcpJyxcbiAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIC8vIHJlZ2V4IGNhbid0IHN0YXJ0IHdpdGggc3BhY2UgdG8gcGFyc2UgeCAvIDIgLyAzIGFzIHR3byBkaXZpc2lvbnNcbiAgICAgICAgICAvLyByZWdleCBjYW4ndCBzdGFydCB3aXRoICosIGFuZCBpdCBzdXBwb3J0cyBhbiBcImlsbGVnYWxcIiBpbiB0aGUgbWFpbiBtb2RlXG4gICAgICAgICAgYmVnaW46IC9cXC8oPyFbICpdKS4qPyg/IVtcXFxcXSkuXFwvW2dpbV17MCwzfSg/PVxcVykvIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHsgYmVnaW46ICdAJyArIEpTX0lERU5UX1JFIC8vIHJlbGV2YW5jZSBib29zdGVyXG4gICAgfSxcbiAgICB7XG4gICAgICBzdWJMYW5ndWFnZTogJ2phdmFzY3JpcHQnLFxuICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogJ2BgYCcsXG4gICAgICAgICAgZW5kOiAnYGBgJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICdgJyxcbiAgICAgICAgICBlbmQ6ICdgJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdO1xuICBTVUJTVC5jb250YWlucyA9IEVYUFJFU1NJT05TO1xuXG4gIGNvbnN0IFRJVExFID0gaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwgeyBiZWdpbjogSlNfSURFTlRfUkUgfSk7XG4gIGNvbnN0IFBPU1NJQkxFX1BBUkFNU19SRSA9ICcoXFxcXCguKlxcXFwpXFxcXHMqKT9cXFxcQlstPV0+JztcbiAgY29uc3QgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46ICdcXFxcKFteXFxcXChdJyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAvKiBXZSBuZWVkIGFub3RoZXIgY29udGFpbmVkIG5hbWVsZXNzIG1vZGUgdG8gbm90IGhhdmUgZXZlcnkgbmVzdGVkXG4gICAgcGFpciBvZiBwYXJlbnMgdG8gYmUgY2FsbGVkIFwicGFyYW1zXCIgKi9cbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgICBjb250YWluczogWyAnc2VsZicgXS5jb25jYXQoRVhQUkVTU0lPTlMpXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IENMQVNTX0RFRklOSVRJT04gPSB7XG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgbWF0Y2g6IFtcbiAgICAgICAgL2NsYXNzXFxzKy8sXG4gICAgICAgIEpTX0lERU5UX1JFLFxuICAgICAgICAvXFxzK2V4dGVuZHNcXHMrLyxcbiAgICAgICAgSlNfSURFTlRfUkVcbiAgICAgIF0gfSxcbiAgICAgIHsgbWF0Y2g6IFtcbiAgICAgICAgL2NsYXNzXFxzKy8sXG4gICAgICAgIEpTX0lERU5UX1JFXG4gICAgICBdIH1cbiAgICBdLFxuICAgIHNjb3BlOiB7XG4gICAgICAyOiBcInRpdGxlLmNsYXNzXCIsXG4gICAgICA0OiBcInRpdGxlLmNsYXNzLmluaGVyaXRlZFwiXG4gICAgfSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMkMVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0NvZmZlZVNjcmlwdCcsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ2NvZmZlZScsXG4gICAgICAnY3NvbicsXG4gICAgICAnaWNlZCdcbiAgICBdLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgIGlsbGVnYWw6IC9cXC9cXCovLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAuLi5FWFBSRVNTSU9OUyxcbiAgICAgIGhsanMuQ09NTUVOVCgnIyMjJywgJyMjIycpLFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogJ15cXFxccyonICsgSlNfSURFTlRfUkUgKyAnXFxcXHMqPVxcXFxzKicgKyBQT1NTSUJMRV9QQVJBTVNfUkUsXG4gICAgICAgIGVuZDogJ1stPV0+JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEUsXG4gICAgICAgICAgUEFSQU1TXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIGFub255bW91cyBmdW5jdGlvbiBzdGFydFxuICAgICAgICBiZWdpbjogL1s6XFwoLD1dXFxzKi8sXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBiZWdpbjogUE9TU0lCTEVfUEFSQU1TX1JFLFxuICAgICAgICAgICAgZW5kOiAnWy09XT4nLFxuICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogWyBQQVJBTVMgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIENMQVNTX0RFRklOSVRJT04sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBKU19JREVOVF9SRSArICc6JyxcbiAgICAgICAgZW5kOiAnOicsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgY29mZmVlc2NyaXB0IGFzIGRlZmF1bHQgfTtcbiJdfQ==