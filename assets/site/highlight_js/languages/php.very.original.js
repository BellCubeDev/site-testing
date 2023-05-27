function php(hljs) {
    const regex = hljs.regex;
    const NOT_PERL_ETC = /(?![A-Za-z0-9])(?![$])/;
    const IDENT_RE = regex.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, NOT_PERL_ETC);
    const PASCAL_CASE_CLASS_NAME_RE = regex.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, NOT_PERL_ETC);
    const VARIABLE = {
        scope: 'variable',
        match: '\\$+' + IDENT_RE,
    };
    const PREPROCESSOR = {
        scope: 'meta',
        variants: [
            { begin: /<\?php/, relevance: 10 },
            { begin: /<\?=/ },
            { begin: /<\?/, relevance: 0.1 },
            { begin: /\?>/ }
        ]
    };
    const SUBST = {
        scope: 'subst',
        variants: [
            { begin: /\$\w+/ },
            {
                begin: /\{\$/,
                end: /\}/
            }
        ]
    };
    const SINGLE_QUOTED = hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null, });
    const DOUBLE_QUOTED = hljs.inherit(hljs.QUOTE_STRING_MODE, {
        illegal: null,
        contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST),
    });
    const HEREDOC = hljs.END_SAME_AS_BEGIN({
        begin: /<<<[ \t]*(\w+)\n/,
        end: /[ \t]*(\w+)\b/,
        contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST),
    });
    const WHITESPACE = '[ \t\n]';
    const STRING = {
        scope: 'string',
        variants: [
            DOUBLE_QUOTED,
            SINGLE_QUOTED,
            HEREDOC
        ]
    };
    const NUMBER = {
        scope: 'number',
        variants: [
            { begin: `\\b0[bB][01]+(?:_[01]+)*\\b` },
            { begin: `\\b0[oO][0-7]+(?:_[0-7]+)*\\b` },
            { begin: `\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b` },
            { begin: `(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?` }
        ],
        relevance: 0
    };
    const LITERALS = [
        "false",
        "null",
        "true"
    ];
    const KWS = [
        "__CLASS__",
        "__DIR__",
        "__FILE__",
        "__FUNCTION__",
        "__COMPILER_HALT_OFFSET__",
        "__LINE__",
        "__METHOD__",
        "__NAMESPACE__",
        "__TRAIT__",
        "die",
        "echo",
        "exit",
        "include",
        "include_once",
        "print",
        "require",
        "require_once",
        "array",
        "abstract",
        "and",
        "as",
        "binary",
        "bool",
        "boolean",
        "break",
        "callable",
        "case",
        "catch",
        "class",
        "clone",
        "const",
        "continue",
        "declare",
        "default",
        "do",
        "double",
        "else",
        "elseif",
        "empty",
        "enddeclare",
        "endfor",
        "endforeach",
        "endif",
        "endswitch",
        "endwhile",
        "enum",
        "eval",
        "extends",
        "final",
        "finally",
        "float",
        "for",
        "foreach",
        "from",
        "global",
        "goto",
        "if",
        "implements",
        "instanceof",
        "insteadof",
        "int",
        "integer",
        "interface",
        "isset",
        "iterable",
        "list",
        "match|0",
        "mixed",
        "new",
        "never",
        "object",
        "or",
        "private",
        "protected",
        "public",
        "readonly",
        "real",
        "return",
        "string",
        "switch",
        "throw",
        "trait",
        "try",
        "unset",
        "use",
        "var",
        "void",
        "while",
        "xor",
        "yield"
    ];
    const BUILT_INS = [
        "Error|0",
        "AppendIterator",
        "ArgumentCountError",
        "ArithmeticError",
        "ArrayIterator",
        "ArrayObject",
        "AssertionError",
        "BadFunctionCallException",
        "BadMethodCallException",
        "CachingIterator",
        "CallbackFilterIterator",
        "CompileError",
        "Countable",
        "DirectoryIterator",
        "DivisionByZeroError",
        "DomainException",
        "EmptyIterator",
        "ErrorException",
        "Exception",
        "FilesystemIterator",
        "FilterIterator",
        "GlobIterator",
        "InfiniteIterator",
        "InvalidArgumentException",
        "IteratorIterator",
        "LengthException",
        "LimitIterator",
        "LogicException",
        "MultipleIterator",
        "NoRewindIterator",
        "OutOfBoundsException",
        "OutOfRangeException",
        "OuterIterator",
        "OverflowException",
        "ParentIterator",
        "ParseError",
        "RangeException",
        "RecursiveArrayIterator",
        "RecursiveCachingIterator",
        "RecursiveCallbackFilterIterator",
        "RecursiveDirectoryIterator",
        "RecursiveFilterIterator",
        "RecursiveIterator",
        "RecursiveIteratorIterator",
        "RecursiveRegexIterator",
        "RecursiveTreeIterator",
        "RegexIterator",
        "RuntimeException",
        "SeekableIterator",
        "SplDoublyLinkedList",
        "SplFileInfo",
        "SplFileObject",
        "SplFixedArray",
        "SplHeap",
        "SplMaxHeap",
        "SplMinHeap",
        "SplObjectStorage",
        "SplObserver",
        "SplPriorityQueue",
        "SplQueue",
        "SplStack",
        "SplSubject",
        "SplTempFileObject",
        "TypeError",
        "UnderflowException",
        "UnexpectedValueException",
        "UnhandledMatchError",
        "ArrayAccess",
        "BackedEnum",
        "Closure",
        "Fiber",
        "Generator",
        "Iterator",
        "IteratorAggregate",
        "Serializable",
        "Stringable",
        "Throwable",
        "Traversable",
        "UnitEnum",
        "WeakReference",
        "WeakMap",
        "Directory",
        "__PHP_Incomplete_Class",
        "parent",
        "php_user_filter",
        "self",
        "static",
        "stdClass"
    ];
    const dualCase = (items) => {
        const result = [];
        items.forEach(item => {
            result.push(item);
            if (item.toLowerCase() === item) {
                result.push(item.toUpperCase());
            }
            else {
                result.push(item.toLowerCase());
            }
        });
        return result;
    };
    const KEYWORDS = {
        keyword: KWS,
        literal: dualCase(LITERALS),
        built_in: BUILT_INS,
    };
    const normalizeKeywords = (items) => {
        return items.map(item => {
            return item.replace(/\|\d+$/, "");
        });
    };
    const CONSTRUCTOR_CALL = { variants: [
            {
                match: [
                    /new/,
                    regex.concat(WHITESPACE, "+"),
                    regex.concat("(?!", normalizeKeywords(BUILT_INS).join("\\b|"), "\\b)"),
                    PASCAL_CASE_CLASS_NAME_RE,
                ],
                scope: {
                    1: "keyword",
                    4: "title.class",
                },
            }
        ] };
    const CONSTANT_REFERENCE = regex.concat(IDENT_RE, "\\b(?!\\()");
    const LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON = { variants: [
            {
                match: [
                    regex.concat(/::/, regex.lookahead(/(?!class\b)/)),
                    CONSTANT_REFERENCE,
                ],
                scope: { 2: "variable.constant", },
            },
            {
                match: [
                    /::/,
                    /class/,
                ],
                scope: { 2: "variable.language", },
            },
            {
                match: [
                    PASCAL_CASE_CLASS_NAME_RE,
                    regex.concat(/::/, regex.lookahead(/(?!class\b)/)),
                    CONSTANT_REFERENCE,
                ],
                scope: {
                    1: "title.class",
                    3: "variable.constant",
                },
            },
            {
                match: [
                    PASCAL_CASE_CLASS_NAME_RE,
                    regex.concat("::", regex.lookahead(/(?!class\b)/)),
                ],
                scope: { 1: "title.class", },
            },
            {
                match: [
                    PASCAL_CASE_CLASS_NAME_RE,
                    /::/,
                    /class/,
                ],
                scope: {
                    1: "title.class",
                    3: "variable.language",
                },
            }
        ] };
    const NAMED_ARGUMENT = {
        scope: 'attr',
        match: regex.concat(IDENT_RE, regex.lookahead(':'), regex.lookahead(/(?!::)/)),
    };
    const PARAMS_MODE = {
        relevance: 0,
        begin: /\(/,
        end: /\)/,
        keywords: KEYWORDS,
        contains: [
            NAMED_ARGUMENT,
            VARIABLE,
            LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
            hljs.C_BLOCK_COMMENT_MODE,
            STRING,
            NUMBER,
            CONSTRUCTOR_CALL,
        ],
    };
    const FUNCTION_INVOKE = {
        relevance: 0,
        match: [
            /\b/,
            regex.concat("(?!fn\\b|function\\b|", normalizeKeywords(KWS).join("\\b|"), "|", normalizeKeywords(BUILT_INS).join("\\b|"), "\\b)"),
            IDENT_RE,
            regex.concat(WHITESPACE, "*"),
            regex.lookahead(/(?=\()/)
        ],
        scope: { 3: "title.function.invoke", },
        contains: [PARAMS_MODE]
    };
    PARAMS_MODE.contains.push(FUNCTION_INVOKE);
    const ATTRIBUTE_CONTAINS = [
        NAMED_ARGUMENT,
        LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
        hljs.C_BLOCK_COMMENT_MODE,
        STRING,
        NUMBER,
        CONSTRUCTOR_CALL,
    ];
    const ATTRIBUTES = {
        begin: regex.concat(/#\[\s*/, PASCAL_CASE_CLASS_NAME_RE),
        beginScope: "meta",
        end: /]/,
        endScope: "meta",
        keywords: {
            literal: LITERALS,
            keyword: [
                'new',
                'array',
            ]
        },
        contains: [
            {
                begin: /\[/,
                end: /]/,
                keywords: {
                    literal: LITERALS,
                    keyword: [
                        'new',
                        'array',
                    ]
                },
                contains: [
                    'self',
                    ...ATTRIBUTE_CONTAINS,
                ]
            },
            ...ATTRIBUTE_CONTAINS,
            {
                scope: 'meta',
                match: PASCAL_CASE_CLASS_NAME_RE
            }
        ]
    };
    return {
        case_insensitive: false,
        keywords: KEYWORDS,
        contains: [
            ATTRIBUTES,
            hljs.HASH_COMMENT_MODE,
            hljs.COMMENT('//', '$'),
            hljs.COMMENT('/\\*', '\\*/', { contains: [
                    {
                        scope: 'doctag',
                        match: '@[A-Za-z]+'
                    }
                ] }),
            {
                match: /__halt_compiler\(\);/,
                keywords: '__halt_compiler',
                starts: {
                    scope: "comment",
                    end: hljs.MATCH_NOTHING_RE,
                    contains: [
                        {
                            match: /\?>/,
                            scope: "meta",
                            endsParent: true
                        }
                    ]
                }
            },
            PREPROCESSOR,
            {
                scope: 'variable.language',
                match: /\$this\b/
            },
            VARIABLE,
            FUNCTION_INVOKE,
            LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
            {
                match: [
                    /const/,
                    /\s/,
                    IDENT_RE,
                ],
                scope: {
                    1: "keyword",
                    3: "variable.constant",
                },
            },
            CONSTRUCTOR_CALL,
            {
                scope: 'function',
                relevance: 0,
                beginKeywords: 'fn function',
                end: /[;{]/,
                excludeEnd: true,
                illegal: '[$%\\[]',
                contains: [
                    { beginKeywords: 'use', },
                    hljs.UNDERSCORE_TITLE_MODE,
                    {
                        begin: '=>',
                        endsParent: true
                    },
                    {
                        scope: 'params',
                        begin: '\\(',
                        end: '\\)',
                        excludeBegin: true,
                        excludeEnd: true,
                        keywords: KEYWORDS,
                        contains: [
                            'self',
                            VARIABLE,
                            LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
                            hljs.C_BLOCK_COMMENT_MODE,
                            STRING,
                            NUMBER
                        ]
                    },
                ]
            },
            {
                scope: 'class',
                variants: [
                    {
                        beginKeywords: "enum",
                        illegal: /[($"]/
                    },
                    {
                        beginKeywords: "class interface trait",
                        illegal: /[:($"]/
                    }
                ],
                relevance: 0,
                end: /\{/,
                excludeEnd: true,
                contains: [
                    { beginKeywords: 'extends implements' },
                    hljs.UNDERSCORE_TITLE_MODE
                ]
            },
            {
                beginKeywords: 'namespace',
                relevance: 0,
                end: ';',
                illegal: /[.']/,
                contains: [hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
            },
            {
                beginKeywords: 'use',
                relevance: 0,
                end: ';',
                contains: [
                    {
                        match: /\b(as|const|function)\b/,
                        scope: "keyword"
                    },
                    hljs.UNDERSCORE_TITLE_MODE
                ]
            },
            STRING,
            NUMBER,
        ]
    };
}
export { php as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhwLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvcGhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBR3pCLE1BQU0sWUFBWSxHQUFHLHdCQUF3QixDQUFDO0lBQzlDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQzNCLDBDQUEwQyxFQUMxQyxZQUFZLENBQUMsQ0FBQztJQUVoQixNQUFNLHlCQUF5QixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQzVDLHdFQUF3RSxFQUN4RSxZQUFZLENBQUMsQ0FBQztJQUNoQixNQUFNLFFBQVEsR0FBRztRQUNmLEtBQUssRUFBRSxVQUFVO1FBQ2pCLEtBQUssRUFBRSxNQUFNLEdBQUcsUUFBUTtLQUN6QixDQUFDO0lBQ0YsTUFBTSxZQUFZLEdBQUc7UUFDbkIsS0FBSyxFQUFFLE1BQU07UUFDYixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtZQUNsQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFFakIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDaEMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1NBQ2pCO0tBQ0YsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHO1FBQ1osS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDbEI7Z0JBQ0UsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsR0FBRyxFQUFFLElBQUk7YUFDVjtTQUNGO0tBQ0Ys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QVM7cUJBQ2pCO29CQUVELElBQUksQ0FBQyxxQkFBcUI7aUJBQzNCO2FBQ0Y7WUFDRCxNQUFNO1lBQ04sTUFBTTtTQUNQO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBQSFBcbkF1dGhvcjogVmljdG9yIEthcmFtemluIDxWaWN0b3IuS2FyYW16aW5AZW50ZXJyYS1pbmMuY29tPlxuQ29udHJpYnV0b3JzOiBFdmdlbnkgU3RlcGFuaXNjaGV2IDxpbWJvbGtAZ21haWwuY29tPiwgSXZhbiBTYWdhbGFldiA8bWFuaWFjQHNvZnR3YXJlbWFuaWFjcy5vcmc+XG5XZWJzaXRlOiBodHRwczovL3d3dy5waHAubmV0XG5DYXRlZ29yeTogY29tbW9uXG4qL1xuXG4vKipcbiAqIEBwYXJhbSB7SExKU0FwaX0gaGxqc1xuICogQHJldHVybnMge0xhbmd1YWdlRGV0YWlsfVxuICogKi9cbmZ1bmN0aW9uIHBocChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgLy8gbmVnYXRpdmUgbG9vay1haGVhZCB0cmllcyB0byBhdm9pZCBtYXRjaGluZyBwYXR0ZXJucyB0aGF0IGFyZSBub3RcbiAgLy8gUGVybCBhdCBhbGwgbGlrZSAkaWRlbnQkLCBAaWRlbnRALCBldGMuXG4gIGNvbnN0IE5PVF9QRVJMX0VUQyA9IC8oPyFbQS1aYS16MC05XSkoPyFbJF0pLztcbiAgY29uc3QgSURFTlRfUkUgPSByZWdleC5jb25jYXQoXG4gICAgL1thLXpBLVpfXFx4N2YtXFx4ZmZdW2EtekEtWjAtOV9cXHg3Zi1cXHhmZl0qLyxcbiAgICBOT1RfUEVSTF9FVEMpO1xuICAvLyBXaWxsIG5vdCBkZXRlY3QgY2FtZWxDYXNlIGNsYXNzZXNcbiAgY29uc3QgUEFTQ0FMX0NBU0VfQ0xBU1NfTkFNRV9SRSA9IHJlZ2V4LmNvbmNhdChcbiAgICAvKFxcXFw/W0EtWl1bYS16MC05X1xceDdmLVxceGZmXSt8XFxcXD9bQS1aXSsoPz1bQS1aXVthLXowLTlfXFx4N2YtXFx4ZmZdKSl7MSx9LyxcbiAgICBOT1RfUEVSTF9FVEMpO1xuICBjb25zdCBWQVJJQUJMRSA9IHtcbiAgICBzY29wZTogJ3ZhcmlhYmxlJyxcbiAgICBtYXRjaDogJ1xcXFwkKycgKyBJREVOVF9SRSxcbiAgfTtcbiAgY29uc3QgUFJFUFJPQ0VTU09SID0ge1xuICAgIHNjb3BlOiAnbWV0YScsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IC88XFw/cGhwLywgcmVsZXZhbmNlOiAxMCB9LCAvLyBib29zdCBmb3Igb2J2aW91cyBQSFBcbiAgICAgIHsgYmVnaW46IC88XFw/PS8gfSxcbiAgICAgIC8vIGxlc3MgcmVsZXZhbnQgcGVyIFBTUi0xIHdoaWNoIHNheXMgbm90IHRvIHVzZSBzaG9ydC10YWdzXG4gICAgICB7IGJlZ2luOiAvPFxcPy8sIHJlbGV2YW5jZTogMC4xIH0sXG4gICAgICB7IGJlZ2luOiAvXFw/Pi8gfSAvLyBlbmQgcGhwIHRhZ1xuICAgIF1cbiAgfTtcbiAgY29uc3QgU1VCU1QgPSB7XG4gICAgc2NvcGU6ICdzdWJzdCcsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IC9cXCRcXHcrLyB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xce1xcJC8sXG4gICAgICAgIGVuZDogL1xcfS9cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IFNJTkdMRV9RVU9URUQgPSBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7IGlsbGVnYWw6IG51bGwsIH0pO1xuICBjb25zdCBET1VCTEVfUVVPVEVEID0gaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtcbiAgICBpbGxlZ2FsOiBudWxsLFxuICAgIGNvbnRhaW5zOiBobGpzLlFVT1RFX1NUUklOR19NT0RFLmNvbnRhaW5zLmNvbmNhdChTVUJTVCksXG4gIH0pO1xuICBjb25zdCBIRVJFRE9DID0gaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgYmVnaW46IC88PDxbIFxcdF0qKFxcdyspXFxuLyxcbiAgICBlbmQ6IC9bIFxcdF0qKFxcdyspXFxiLyxcbiAgICBjb250YWluczogaGxqcy5RVU9URV9TVFJJTkdfTU9ERS5jb250YWlucy5jb25jYXQoU1VCU1QpLFxuICB9KTtcbiAgLy8gbGlzdCBvZiB2YWxpZCB3aGl0ZXNwYWNlcyBiZWNhdXNlIG5vbi1icmVha2luZyBzcGFjZSBtaWdodCBiZSBwYXJ0IG9mIGEgSURFTlRfUkVcbiAgY29uc3QgV0hJVEVTUEFDRSA9ICdbIFxcdFxcbl0nO1xuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgc2NvcGU6ICdzdHJpbmcnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICBET1VCTEVfUVVPVEVELFxuICAgICAgU0lOR0xFX1FVT1RFRCxcbiAgICAgIEhFUkVET0NcbiAgICBdXG4gIH07XG4gIGNvbnN0IE5VTUJFUiA9IHtcbiAgICBzY29wZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IGBcXFxcYjBbYkJdWzAxXSsoPzpfWzAxXSspKlxcXFxiYCB9LCAvLyBCaW5hcnkgdy8gdW5kZXJzY29yZSBzdXBwb3J0XG4gICAgICB7IGJlZ2luOiBgXFxcXGIwW29PXVswLTddKyg/Ol9bMC03XSspKlxcXFxiYCB9LCAvLyBPY3RhbHMgdy8gdW5kZXJzY29yZSBzdXBwb3J0XG4gICAgICB7IGJlZ2luOiBgXFxcXGIwW3hYXVtcXFxcZGEtZkEtRl0rKD86X1tcXFxcZGEtZkEtRl0rKSpcXFxcYmAgfSwgLy8gSGV4IHcvIHVuZGVyc2NvcmUgc3VwcG9ydFxuICAgICAgLy8gRGVjaW1hbHMgdy8gdW5kZXJzY29yZSBzdXBwb3J0LCB3aXRoIG9wdGlvbmFsIGZyYWdtZW50cyBhbmQgc2NpZW50aWZpYyBleHBvbmVudCAoZSkgc3VmZml4LlxuICAgICAgeyBiZWdpbjogYCg/OlxcXFxiXFxcXGQrKD86X1xcXFxkKykqKFxcXFwuKD86XFxcXGQrKD86X1xcXFxkKykqKSk/fFxcXFxCXFxcXC5cXFxcZCspKD86W2VFXVsrLV0/XFxcXGQrKT9gIH1cbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICBjb25zdCBMSVRFUkFMUyA9IFtcbiAgICBcImZhbHNlXCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJ0cnVlXCJcbiAgXTtcbiAgY29uc3QgS1dTID0gW1xuICAgIC8vIE1hZ2ljIGNvbnN0YW50czpcbiAgICAvLyA8aHR0cHM6Ly93d3cucGhwLm5ldC9tYW51YWwvZW4vbGFuZ3VhZ2UuY29uc3RhbnRzLnByZWRlZmluZWQucGhwPlxuICAgIFwiX19DTEFTU19fXCIsXG4gICAgXCJfX0RJUl9fXCIsXG4gICAgXCJfX0ZJTEVfX1wiLFxuICAgIFwiX19GVU5DVElPTl9fXCIsXG4gICAgXCJfX0NPTVBJTEVSX0hBTFRfT0ZGU0VUX19cIixcbiAgICBcIl9fTElORV9fXCIsXG4gICAgXCJfX01FVEhPRF9fXCIsXG4gICAgXCJfX05BTUVTUEFDRV9fXCIsXG4gICAgXCJfX1RSQUlUX19cIixcbiAgICAvLyBGdW5jdGlvbiB0aGF0IGxvb2sgbGlrZSBsYW5ndWFnZSBjb25zdHJ1Y3Qgb3IgbGFuZ3VhZ2UgY29uc3RydWN0IHRoYXQgbG9vayBsaWtlIGZ1bmN0aW9uOlxuICAgIC8vIExpc3Qgb2Yga2V5d29yZHMgdGhhdCBtYXkgbm90IHJlcXVpcmUgcGFyZW50aGVzaXNcbiAgICBcImRpZVwiLFxuICAgIFwiZWNob1wiLFxuICAgIFwiZXhpdFwiLFxuICAgIFwiaW5jbHVkZVwiLFxuICAgIFwiaW5jbHVkZV9vbmNlXCIsXG4gICAgXCJwcmludFwiLFxuICAgIFwicmVxdWlyZVwiLFxuICAgIFwicmVxdWlyZV9vbmNlXCIsXG4gICAgLy8gVGhlc2UgYXJlIG5vdCBsYW5ndWFnZSBjb25zdHJ1Y3QgKGZ1bmN0aW9uKSBidXQgb3BlcmF0ZSBvbiB0aGUgY3VycmVudGx5LWV4ZWN1dGluZyBmdW5jdGlvbiBhbmQgY2FuIGFjY2VzcyB0aGUgY3VycmVudCBzeW1ib2wgdGFibGVcbiAgICAvLyAnY29tcGFjdCBleHRyYWN0IGZ1bmNfZ2V0X2FyZyBmdW5jX2dldF9hcmdzIGZ1bmNfbnVtX2FyZ3MgZ2V0X2NhbGxlZF9jbGFzcyBnZXRfcGFyZW50X2NsYXNzICcgK1xuICAgIC8vIE90aGVyIGtleXdvcmRzOlxuICAgIC8vIDxodHRwczovL3d3dy5waHAubmV0L21hbnVhbC9lbi9yZXNlcnZlZC5waHA+XG4gICAgLy8gPGh0dHBzOi8vd3d3LnBocC5uZXQvbWFudWFsL2VuL2xhbmd1YWdlLnR5cGVzLnR5cGUtanVnZ2xpbmcucGhwPlxuICAgIFwiYXJyYXlcIixcbiAgICBcImFic3RyYWN0XCIsXG4gICAgXCJhbmRcIixcbiAgICBcImFzXCIsXG4gICAgXCJiaW5hcnlcIixcbiAgICBcImJvb2xcIixcbiAgICBcImJvb2xlYW5cIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJjYWxsYWJsZVwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJjbG9uZVwiLFxuICAgIFwiY29uc3RcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJkZWNsYXJlXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZG91YmxlXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbHNlaWZcIixcbiAgICBcImVtcHR5XCIsXG4gICAgXCJlbmRkZWNsYXJlXCIsXG4gICAgXCJlbmRmb3JcIixcbiAgICBcImVuZGZvcmVhY2hcIixcbiAgICBcImVuZGlmXCIsXG4gICAgXCJlbmRzd2l0Y2hcIixcbiAgICBcImVuZHdoaWxlXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJldmFsXCIsXG4gICAgXCJleHRlbmRzXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZmxvYXRcIixcbiAgICBcImZvclwiLFxuICAgIFwiZm9yZWFjaFwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwiZ2xvYmFsXCIsXG4gICAgXCJnb3RvXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wbGVtZW50c1wiLFxuICAgIFwiaW5zdGFuY2VvZlwiLFxuICAgIFwiaW5zdGVhZG9mXCIsXG4gICAgXCJpbnRcIixcbiAgICBcImludGVnZXJcIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwiaXNzZXRcIixcbiAgICBcIml0ZXJhYmxlXCIsXG4gICAgXCJsaXN0XCIsXG4gICAgXCJtYXRjaHwwXCIsXG4gICAgXCJtaXhlZFwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJuZXZlclwiLFxuICAgIFwib2JqZWN0XCIsXG4gICAgXCJvclwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwicHJvdGVjdGVkXCIsXG4gICAgXCJwdWJsaWNcIixcbiAgICBcInJlYWRvbmx5XCIsXG4gICAgXCJyZWFsXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInN0cmluZ1wiLFxuICAgIFwic3dpdGNoXCIsXG4gICAgXCJ0aHJvd1wiLFxuICAgIFwidHJhaXRcIixcbiAgICBcInRyeVwiLFxuICAgIFwidW5zZXRcIixcbiAgICBcInVzZVwiLFxuICAgIFwidmFyXCIsXG4gICAgXCJ2b2lkXCIsXG4gICAgXCJ3aGlsZVwiLFxuICAgIFwieG9yXCIsXG4gICAgXCJ5aWVsZFwiXG4gIF07XG5cbiAgY29uc3QgQlVJTFRfSU5TID0gW1xuICAgIC8vIFN0YW5kYXJkIFBIUCBsaWJyYXJ5OlxuICAgIC8vIDxodHRwczovL3d3dy5waHAubmV0L21hbnVhbC9lbi9ib29rLnNwbC5waHA+XG4gICAgXCJFcnJvcnwwXCIsXG4gICAgXCJBcHBlbmRJdGVyYXRvclwiLFxuICAgIFwiQXJndW1lbnRDb3VudEVycm9yXCIsXG4gICAgXCJBcml0aG1ldGljRXJyb3JcIixcbiAgICBcIkFycmF5SXRlcmF0b3JcIixcbiAgICBcIkFycmF5T2JqZWN0XCIsXG4gICAgXCJBc3NlcnRpb25FcnJvclwiLFxuICAgIFwiQmFkRnVuY3Rpb25DYWxsRXhjZXB0aW9uXCIsXG4gICAgXCJCYWRNZXRob2RDYWxsRXhjZXB0aW9uXCIsXG4gICAgXCJDYWNoaW5nSXRlcmF0b3JcIixcbiAgICBcIkNhbGxiYWNrRmlsdGVySXRlcmF0b3JcIixcbiAgICBcIkNvbXBpbGVFcnJvclwiLFxuICAgIFwiQ291bnRhYmxlXCIsXG4gICAgXCJEaXJlY3RvcnlJdGVyYXRvclwiLFxuICAgIFwiRGl2aXNpb25CeVplcm9FcnJvclwiLFxuICAgIFwiRG9tYWluRXhjZXB0aW9uXCIsXG4gICAgXCJFbXB0eUl0ZXJhdG9yXCIsXG4gICAgXCJFcnJvckV4Y2VwdGlvblwiLFxuICAgIFwiRXhjZXB0aW9uXCIsXG4gICAgXCJGaWxlc3lzdGVtSXRlcmF0b3JcIixcbiAgICBcIkZpbHRlckl0ZXJhdG9yXCIsXG4gICAgXCJHbG9iSXRlcmF0b3JcIixcbiAgICBcIkluZmluaXRlSXRlcmF0b3JcIixcbiAgICBcIkludmFsaWRBcmd1bWVudEV4Y2VwdGlvblwiLFxuICAgIFwiSXRlcmF0b3JJdGVyYXRvclwiLFxuICAgIFwiTGVuZ3RoRXhjZXB0aW9uXCIsXG4gICAgXCJMaW1pdEl0ZXJhdG9yXCIsXG4gICAgXCJMb2dpY0V4Y2VwdGlvblwiLFxuICAgIFwiTXVsdGlwbGVJdGVyYXRvclwiLFxuICAgIFwiTm9SZXdpbmRJdGVyYXRvclwiLFxuICAgIFwiT3V0T2ZCb3VuZHNFeGNlcHRpb25cIixcbiAgICBcIk91dE9mUmFuZ2VFeGNlcHRpb25cIixcbiAgICBcIk91dGVySXRlcmF0b3JcIixcbiAgICBcIk92ZXJmbG93RXhjZXB0aW9uXCIsXG4gICAgXCJQYXJlbnRJdGVyYXRvclwiLFxuICAgIFwiUGFyc2VFcnJvclwiLFxuICAgIFwiUmFuZ2VFeGNlcHRpb25cIixcbiAgICBcIlJlY3Vyc2l2ZUFycmF5SXRlcmF0b3JcIixcbiAgICBcIlJlY3Vyc2l2ZUNhY2hpbmdJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlQ2FsbGJhY2tGaWx0ZXJJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3JcIixcbiAgICBcIlJlY3Vyc2l2ZUZpbHRlckl0ZXJhdG9yXCIsXG4gICAgXCJSZWN1cnNpdmVJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlUmVnZXhJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlVHJlZUl0ZXJhdG9yXCIsXG4gICAgXCJSZWdleEl0ZXJhdG9yXCIsXG4gICAgXCJSdW50aW1lRXhjZXB0aW9uXCIsXG4gICAgXCJTZWVrYWJsZUl0ZXJhdG9yXCIsXG4gICAgXCJTcGxEb3VibHlMaW5rZWRMaXN0XCIsXG4gICAgXCJTcGxGaWxlSW5mb1wiLFxuICAgIFwiU3BsRmlsZU9iamVjdFwiLFxuICAgIFwiU3BsRml4ZWRBcnJheVwiLFxuICAgIFwiU3BsSGVhcFwiLFxuICAgIFwiU3BsTWF4SGVhcFwiLFxuICAgIFwiU3BsTWluSGVhcFwiLFxuICAgIFwiU3BsT2JqZWN0U3RvcmFnZVwiLFxuICAgIFwiU3BsT2JzZXJ2ZXJcIixcbiAgICBcIlNwbFByaW9yaXR5UXVldWVcIixcbiAgICBcIlNwbFF1ZXVlXCIsXG4gICAgXCJTcGxTdGFja1wiLFxuICAgIFwiU3BsU3ViamVjdFwiLFxuICAgIFwiU3BsVGVtcEZpbGVPYmplY3RcIixcbiAgICBcIlR5cGVFcnJvclwiLFxuICAgIFwiVW5kZXJmbG93RXhjZXB0aW9uXCIsXG4gICAgXCJVbmV4cGVjdGVkVmFsdWVFeGNlcHRpb25cIixcbiAgICBcIlVuaGFuZGxlZE1hdGNoRXJyb3JcIixcbiAgICAvLyBSZXNlcnZlZCBpbnRlcmZhY2VzOlxuICAgIC8vIDxodHRwczovL3d3dy5waHAubmV0L21hbnVhbC9lbi9yZXNlcnZlZC5pbnRlcmZhY2VzLnBocD5cbiAgICBcIkFycmF5QWNjZXNzXCIsXG4gICAgXCJCYWNrZWRFbnVtXCIsXG4gICAgXCJDbG9zdXJlXCIsXG4gICAgXCJGaWJlclwiLFxuICAgIFwiR2VuZXJhdG9yXCIsXG4gICAgXCJJdGVyYXRvclwiLFxuICAgIFwiSXRlcmF0b3JBZ2dyZWdhdGVcIixcbiAgICBcIlNlcmlhbGl6YWJsZVwiLFxuICAgIFwiU3RyaW5nYWJsZVwiLFxuICAgIFwiVGhyb3dhYmxlXCIsXG4gICAgXCJUcmF2ZXJzYWJsZVwiLFxuICAgIFwiVW5pdEVudW1cIixcbiAgICBcIldlYWtSZWZlcmVuY2VcIixcbiAgICBcIldlYWtNYXBcIixcbiAgICAvLyBSZXNlcnZlZCBjbGFzc2VzOlxuICAgIC8vIDxodHRwczovL3d3dy5waHAubmV0L21hbnVhbC9lbi9yZXNlcnZlZC5jbGFzc2VzLnBocD5cbiAgICBcIkRpcmVjdG9yeVwiLFxuICAgIFwiX19QSFBfSW5jb21wbGV0ZV9DbGFzc1wiLFxuICAgIFwicGFyZW50XCIsXG4gICAgXCJwaHBfdXNlcl9maWx0ZXJcIixcbiAgICBcInNlbGZcIixcbiAgICBcInN0YXRpY1wiLFxuICAgIFwic3RkQ2xhc3NcIlxuICBdO1xuXG4gIC8qKiBEdWFsLWNhc2Uga2V5d29yZHNcbiAgICpcbiAgICogW1widGhlblwiLFwiRklMRVwiXSA9PlxuICAgKiAgICAgW1widGhlblwiLCBcIlRIRU5cIiwgXCJGSUxFXCIsIFwiZmlsZVwiXVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBpdGVtcyAqL1xuICBjb25zdCBkdWFsQ2FzZSA9IChpdGVtcykgPT4ge1xuICAgIC8qKiBAdHlwZSBzdHJpbmdbXSAqL1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIGlmIChpdGVtLnRvTG93ZXJDYXNlKCkgPT09IGl0ZW0pIHtcbiAgICAgICAgcmVzdWx0LnB1c2goaXRlbS50b1VwcGVyQ2FzZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0udG9Mb3dlckNhc2UoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOiBLV1MsXG4gICAgbGl0ZXJhbDogZHVhbENhc2UoTElURVJBTFMpLFxuICAgIGJ1aWx0X2luOiBCVUlMVF9JTlMsXG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGl0ZW1zICovXG4gIGNvbnN0IG5vcm1hbGl6ZUtleXdvcmRzID0gKGl0ZW1zKSA9PiB7XG4gICAgcmV0dXJuIGl0ZW1zLm1hcChpdGVtID0+IHtcbiAgICAgIHJldHVybiBpdGVtLnJlcGxhY2UoL1xcfFxcZCskLywgXCJcIik7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgQ09OU1RSVUNUT1JfQ0FMTCA9IHsgdmFyaWFudHM6IFtcbiAgICB7XG4gICAgICBtYXRjaDogW1xuICAgICAgICAvbmV3LyxcbiAgICAgICAgcmVnZXguY29uY2F0KFdISVRFU1BBQ0UsIFwiK1wiKSxcbiAgICAgICAgLy8gdG8gcHJldmVudCBidWlsdCBpbnMgZnJvbSBiZWluZyBjb25mdXNlZCBhcyB0aGUgY2xhc3MgY29uc3RydWN0b3IgY2FsbFxuICAgICAgICByZWdleC5jb25jYXQoXCIoPyFcIiwgbm9ybWFsaXplS2V5d29yZHMoQlVJTFRfSU5TKS5qb2luKFwiXFxcXGJ8XCIpLCBcIlxcXFxiKVwiKSxcbiAgICAgICAgUEFTQ0FMX0NBU0VfQ0xBU1NfTkFNRV9SRSxcbiAgICAgIF0sXG4gICAgICBzY29wZToge1xuICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgNDogXCJ0aXRsZS5jbGFzc1wiLFxuICAgICAgfSxcbiAgICB9XG4gIF0gfTtcblxuICBjb25zdCBDT05TVEFOVF9SRUZFUkVOQ0UgPSByZWdleC5jb25jYXQoSURFTlRfUkUsIFwiXFxcXGIoPyFcXFxcKClcIik7XG5cbiAgY29uc3QgTEVGVF9BTkRfUklHSFRfU0lERV9PRl9ET1VCTEVfQ09MT04gPSB7IHZhcmlhbnRzOiBbXG4gICAge1xuICAgICAgbWF0Y2g6IFtcbiAgICAgICAgcmVnZXguY29uY2F0KFxuICAgICAgICAgIC86Oi8sXG4gICAgICAgICAgcmVnZXgubG9va2FoZWFkKC8oPyFjbGFzc1xcYikvKVxuICAgICAgICApLFxuICAgICAgICBDT05TVEFOVF9SRUZFUkVOQ0UsXG4gICAgICBdLFxuICAgICAgc2NvcGU6IHsgMjogXCJ2YXJpYWJsZS5jb25zdGFudFwiLCB9LFxuICAgIH0sXG4gICAge1xuICAgICAgbWF0Y2g6IFtcbiAgICAgICAgLzo6LyxcbiAgICAgICAgL2NsYXNzLyxcbiAgICAgIF0sXG4gICAgICBzY29wZTogeyAyOiBcInZhcmlhYmxlLmxhbmd1YWdlXCIsIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBtYXRjaDogW1xuICAgICAgICBQQVNDQUxfQ0FTRV9DTEFTU19OQU1FX1JFLFxuICAgICAgICByZWdleC5jb25jYXQoXG4gICAgICAgICAgLzo6LyxcbiAgICAgICAgICByZWdleC5sb29rYWhlYWQoLyg/IWNsYXNzXFxiKS8pXG4gICAgICAgICksXG4gICAgICAgIENPTlNUQU5UX1JFRkVSRU5DRSxcbiAgICAgIF0sXG4gICAgICBzY29wZToge1xuICAgICAgICAxOiBcInRpdGxlLmNsYXNzXCIsXG4gICAgICAgIDM6IFwidmFyaWFibGUuY29uc3RhbnRcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBtYXRjaDogW1xuICAgICAgICBQQVNDQUxfQ0FTRV9DTEFTU19OQU1FX1JFLFxuICAgICAgICByZWdleC5jb25jYXQoXG4gICAgICAgICAgXCI6OlwiLFxuICAgICAgICAgIHJlZ2V4Lmxvb2thaGVhZCgvKD8hY2xhc3NcXGIpLylcbiAgICAgICAgKSxcbiAgICAgIF0sXG4gICAgICBzY29wZTogeyAxOiBcInRpdGxlLmNsYXNzXCIsIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBtYXRjaDogW1xuICAgICAgICBQQVNDQUxfQ0FTRV9DTEFTU19OQU1FX1JFLFxuICAgICAgICAvOjovLFxuICAgICAgICAvY2xhc3MvLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIDE6IFwidGl0bGUuY2xhc3NcIixcbiAgICAgICAgMzogXCJ2YXJpYWJsZS5sYW5ndWFnZVwiLFxuICAgICAgfSxcbiAgICB9XG4gIF0gfTtcblxuICBjb25zdCBOQU1FRF9BUkdVTUVOVCA9IHtcbiAgICBzY29wZTogJ2F0dHInLFxuICAgIG1hdGNoOiByZWdleC5jb25jYXQoSURFTlRfUkUsIHJlZ2V4Lmxvb2thaGVhZCgnOicpLCByZWdleC5sb29rYWhlYWQoLyg/ITo6KS8pKSxcbiAgfTtcbiAgY29uc3QgUEFSQU1TX01PREUgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGJlZ2luOiAvXFwoLyxcbiAgICBlbmQ6IC9cXCkvLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgTkFNRURfQVJHVU1FTlQsXG4gICAgICBWQVJJQUJMRSxcbiAgICAgIExFRlRfQU5EX1JJR0hUX1NJREVfT0ZfRE9VQkxFX0NPTE9OLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIFNUUklORyxcbiAgICAgIE5VTUJFUixcbiAgICAgIENPTlNUUlVDVE9SX0NBTEwsXG4gICAgXSxcbiAgfTtcbiAgY29uc3QgRlVOQ1RJT05fSU5WT0tFID0ge1xuICAgIHJlbGV2YW5jZTogMCxcbiAgICBtYXRjaDogW1xuICAgICAgL1xcYi8sXG4gICAgICAvLyB0byBwcmV2ZW50IGtleXdvcmRzIGZyb20gYmVpbmcgY29uZnVzZWQgYXMgdGhlIGZ1bmN0aW9uIHRpdGxlXG4gICAgICByZWdleC5jb25jYXQoXCIoPyFmblxcXFxifGZ1bmN0aW9uXFxcXGJ8XCIsIG5vcm1hbGl6ZUtleXdvcmRzKEtXUykuam9pbihcIlxcXFxifFwiKSwgXCJ8XCIsIG5vcm1hbGl6ZUtleXdvcmRzKEJVSUxUX0lOUykuam9pbihcIlxcXFxifFwiKSwgXCJcXFxcYilcIiksXG4gICAgICBJREVOVF9SRSxcbiAgICAgIHJlZ2V4LmNvbmNhdChXSElURVNQQUNFLCBcIipcIiksXG4gICAgICByZWdleC5sb29rYWhlYWQoLyg/PVxcKCkvKVxuICAgIF0sXG4gICAgc2NvcGU6IHsgMzogXCJ0aXRsZS5mdW5jdGlvbi5pbnZva2VcIiwgfSxcbiAgICBjb250YWluczogWyBQQVJBTVNfTU9ERSBdXG4gIH07XG4gIFBBUkFNU19NT0RFLmNvbnRhaW5zLnB1c2goRlVOQ1RJT05fSU5WT0tFKTtcblxuICBjb25zdCBBVFRSSUJVVEVfQ09OVEFJTlMgPSBbXG4gICAgTkFNRURfQVJHVU1FTlQsXG4gICAgTEVGVF9BTkRfUklHSFRfU0lERV9PRl9ET1VCTEVfQ09MT04sXG4gICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICBTVFJJTkcsXG4gICAgTlVNQkVSLFxuICAgIENPTlNUUlVDVE9SX0NBTEwsXG4gIF07XG5cbiAgY29uc3QgQVRUUklCVVRFUyA9IHtcbiAgICBiZWdpbjogcmVnZXguY29uY2F0KC8jXFxbXFxzKi8sIFBBU0NBTF9DQVNFX0NMQVNTX05BTUVfUkUpLFxuICAgIGJlZ2luU2NvcGU6IFwibWV0YVwiLFxuICAgIGVuZDogL10vLFxuICAgIGVuZFNjb3BlOiBcIm1ldGFcIixcbiAgICBrZXl3b3Jkczoge1xuICAgICAgbGl0ZXJhbDogTElURVJBTFMsXG4gICAgICBrZXl3b3JkOiBbXG4gICAgICAgICduZXcnLFxuICAgICAgICAnYXJyYXknLFxuICAgICAgXVxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXFsvLFxuICAgICAgICBlbmQ6IC9dLyxcbiAgICAgICAga2V5d29yZHM6IHtcbiAgICAgICAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICAgICAgICBrZXl3b3JkOiBbXG4gICAgICAgICAgICAnbmV3JyxcbiAgICAgICAgICAgICdhcnJheScsXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICAuLi5BVFRSSUJVVEVfQ09OVEFJTlMsXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAuLi5BVFRSSUJVVEVfQ09OVEFJTlMsXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAnbWV0YScsXG4gICAgICAgIG1hdGNoOiBQQVNDQUxfQ0FTRV9DTEFTU19OQU1FX1JFXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogZmFsc2UsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBBVFRSSUJVVEVTLFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ09NTUVOVCgnLy8nLCAnJCcpLFxuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAnL1xcXFwqJyxcbiAgICAgICAgJ1xcXFwqLycsXG4gICAgICAgIHsgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgICAgICAgICBtYXRjaDogJ0BbQS1aYS16XSsnXG4gICAgICAgICAgfVxuICAgICAgICBdIH1cbiAgICAgICksXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiAvX19oYWx0X2NvbXBpbGVyXFwoXFwpOy8sXG4gICAgICAgIGtleXdvcmRzOiAnX19oYWx0X2NvbXBpbGVyJyxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgc2NvcGU6IFwiY29tbWVudFwiLFxuICAgICAgICAgIGVuZDogaGxqcy5NQVRDSF9OT1RISU5HX1JFLFxuICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1hdGNoOiAvXFw/Pi8sXG4gICAgICAgICAgICAgIHNjb3BlOiBcIm1ldGFcIixcbiAgICAgICAgICAgICAgZW5kc1BhcmVudDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFBSRVBST0NFU1NPUixcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6ICd2YXJpYWJsZS5sYW5ndWFnZScsXG4gICAgICAgIG1hdGNoOiAvXFwkdGhpc1xcYi9cbiAgICAgIH0sXG4gICAgICBWQVJJQUJMRSxcbiAgICAgIEZVTkNUSU9OX0lOVk9LRSxcbiAgICAgIExFRlRfQU5EX1JJR0hUX1NJREVfT0ZfRE9VQkxFX0NPTE9OLFxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jb25zdC8sXG4gICAgICAgICAgL1xccy8sXG4gICAgICAgICAgSURFTlRfUkUsXG4gICAgICAgIF0sXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ2YXJpYWJsZS5jb25zdGFudFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIENPTlNUUlVDVE9SX0NBTEwsXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAnZnVuY3Rpb24nLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdmbiBmdW5jdGlvbicsXG4gICAgICAgIGVuZDogL1s7e10vLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAnWyQlXFxcXFtdJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7IGJlZ2luS2V5d29yZHM6ICd1c2UnLCB9LFxuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnPT4nLCAvLyBObyBtYXJrdXAsIGp1c3QgYSByZWxldmFuY2UgYm9vc3RlclxuICAgICAgICAgICAgZW5kc1BhcmVudDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsXG4gICAgICAgICAgICBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgICAgICBWQVJJQUJMRSxcbiAgICAgICAgICAgICAgTEVGVF9BTkRfUklHSFRfU0lERV9PRl9ET1VCTEVfQ09MT04sXG4gICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgIFNUUklORyxcbiAgICAgICAgICAgICAgTlVNQkVSXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6ICdjbGFzcycsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5LZXl3b3JkczogXCJlbnVtXCIsXG4gICAgICAgICAgICBpbGxlZ2FsOiAvWygkXCJdL1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5LZXl3b3JkczogXCJjbGFzcyBpbnRlcmZhY2UgdHJhaXRcIixcbiAgICAgICAgICAgIGlsbGVnYWw6IC9bOigkXCJdL1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBlbmQ6IC9cXHsvLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHsgYmVnaW5LZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cycgfSxcbiAgICAgICAgICBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gYm90aCB1c2UgYW5kIG5hbWVzcGFjZSBzdGlsbCB1c2UgXCJvbGQgc3R5bGVcIiBydWxlcyAodnMgbXVsdGktbWF0Y2gpXG4gICAgICAvLyBiZWNhdXNlIHRoZSBuYW1lc3BhY2UgbmFtZSBjYW4gaW5jbHVkZSBgXFxgIGFuZCB3ZSBzdGlsbCB3YW50IGVhY2hcbiAgICAgIC8vIGVsZW1lbnQgdG8gYmUgdHJlYXRlZCBhcyBpdHMgb3duICppbmRpdmlkdWFsKiB0aXRsZVxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnbmFtZXNwYWNlJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBlbmQ6ICc7JyxcbiAgICAgICAgaWxsZWdhbDogL1suJ10vLFxuICAgICAgICBjb250YWluczogWyBobGpzLmluaGVyaXQoaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREUsIHsgc2NvcGU6IFwidGl0bGUuY2xhc3NcIiB9KSBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAndXNlJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBlbmQ6ICc7JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAvLyBUT0RPOiB0aXRsZS5mdW5jdGlvbiB2cyB0aXRsZS5jbGFzc1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hdGNoOiAvXFxiKGFzfGNvbnN0fGZ1bmN0aW9uKVxcYi8sXG4gICAgICAgICAgICBzY29wZTogXCJrZXl3b3JkXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIFRPRE86IGNvdWxkIGJlIHRpdGxlLmNsYXNzIG9yIHRpdGxlLmZ1bmN0aW9uXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIFNUUklORyxcbiAgICAgIE5VTUJFUixcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHBocCBhcyBkZWZhdWx0IH07XG4iXX0=