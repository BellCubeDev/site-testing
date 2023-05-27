function source(re) {
    if (!re)
        return null;
    if (typeof re === "string")
        return re;
    return re.source;
}
function lookahead(re) {
    return concat('(?=', re, ')');
}
function concat(...args) {
    const joined = args.map((x) => source(x)).join("");
    return joined;
}
function stripOptionsFromArgs(args) {
    const opts = args[args.length - 1];
    if (typeof opts === 'object' && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
    }
    else {
        return {};
    }
}
function either(...args) {
    const opts = stripOptionsFromArgs(args);
    const joined = '('
        + (opts.capture ? "" : "?:")
        + args.map((x) => source(x)).join("|") + ")";
    return joined;
}
const keywordWrapper = keyword => concat(/\b/, keyword, /\w$/.test(keyword) ? /\b/ : /\B/);
const dotKeywords = [
    'Protocol',
    'Type'
].map(keywordWrapper);
const optionalDotKeywords = [
    'init',
    'self'
].map(keywordWrapper);
const keywordTypes = [
    'Any',
    'Self'
];
const keywords = [
    'actor',
    'any',
    'associatedtype',
    'async',
    'await',
    /as\?/,
    /as!/,
    'as',
    'break',
    'case',
    'catch',
    'class',
    'continue',
    'convenience',
    'default',
    'defer',
    'deinit',
    'didSet',
    'distributed',
    'do',
    'dynamic',
    'else',
    'enum',
    'extension',
    'fallthrough',
    /fileprivate\(set\)/,
    'fileprivate',
    'final',
    'for',
    'func',
    'get',
    'guard',
    'if',
    'import',
    'indirect',
    'infix',
    /init\?/,
    /init!/,
    'inout',
    /internal\(set\)/,
    'internal',
    'in',
    'is',
    'isolated',
    'nonisolated',
    'lazy',
    'let',
    'mutating',
    'nonmutating',
    /open\(set\)/,
    'open',
    'operator',
    'optional',
    'override',
    'postfix',
    'precedencegroup',
    'prefix',
    /private\(set\)/,
    'private',
    'protocol',
    /public\(set\)/,
    'public',
    'repeat',
    'required',
    'rethrows',
    'return',
    'set',
    'some',
    'static',
    'struct',
    'subscript',
    'super',
    'switch',
    'throws',
    'throw',
    /try\?/,
    /try!/,
    'try',
    'typealias',
    /unowned\(safe\)/,
    /unowned\(unsafe\)/,
    'unowned',
    'var',
    'weak',
    'where',
    'while',
    'willSet'
];
const literals = [
    'false',
    'nil',
    'true'
];
const precedencegroupKeywords = [
    'assignment',
    'associativity',
    'higherThan',
    'left',
    'lowerThan',
    'none',
    'right'
];
const numberSignKeywords = [
    '#colorLiteral',
    '#column',
    '#dsohandle',
    '#else',
    '#elseif',
    '#endif',
    '#error',
    '#file',
    '#fileID',
    '#fileLiteral',
    '#filePath',
    '#function',
    '#if',
    '#imageLiteral',
    '#keyPath',
    '#line',
    '#selector',
    '#sourceLocation',
    '#warn_unqualified_access',
    '#warning'
];
const builtIns = [
    'abs',
    'all',
    'any',
    'assert',
    'assertionFailure',
    'debugPrint',
    'dump',
    'fatalError',
    'getVaList',
    'isKnownUniquelyReferenced',
    'max',
    'min',
    'numericCast',
    'pointwiseMax',
    'pointwiseMin',
    'precondition',
    'preconditionFailure',
    'print',
    'readLine',
    'repeatElement',
    'sequence',
    'stride',
    'swap',
    'swift_unboxFromSwiftValueWithType',
    'transcode',
    'type',
    'unsafeBitCast',
    'unsafeDowncast',
    'withExtendedLifetime',
    'withUnsafeMutablePointer',
    'withUnsafePointer',
    'withVaList',
    'withoutActuallyEscaping',
    'zip'
];
const operatorHead = either(/[/=\-+!*%<>&|^~?]/, /[\u00A1-\u00A7]/, /[\u00A9\u00AB]/, /[\u00AC\u00AE]/, /[\u00B0\u00B1]/, /[\u00B6\u00BB\u00BF\u00D7\u00F7]/, /[\u2016-\u2017]/, /[\u2020-\u2027]/, /[\u2030-\u203E]/, /[\u2041-\u2053]/, /[\u2055-\u205E]/, /[\u2190-\u23FF]/, /[\u2500-\u2775]/, /[\u2794-\u2BFF]/, /[\u2E00-\u2E7F]/, /[\u3001-\u3003]/, /[\u3008-\u3020]/, /[\u3030]/);
const operatorCharacter = either(operatorHead, /[\u0300-\u036F]/, /[\u1DC0-\u1DFF]/, /[\u20D0-\u20FF]/, /[\uFE00-\uFE0F]/, /[\uFE20-\uFE2F]/);
const operator = concat(operatorHead, operatorCharacter, '*');
const identifierHead = either(/[a-zA-Z_]/, /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/, /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/, /[\u1E00-\u1FFF]/, /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/, /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/, /[\u2C00-\u2DFF\u2E80-\u2FFF]/, /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/, /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/, /[\uFE47-\uFEFE\uFF00-\uFFFD]/);
const identifierCharacter = either(identifierHead, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/);
const identifier = concat(identifierHead, identifierCharacter, '*');
const typeIdentifier = concat(/[A-Z]/, identifierCharacter, '*');
const keywordAttributes = [
    'autoclosure',
    concat(/convention\(/, either('swift', 'block', 'c'), /\)/),
    'discardableResult',
    'dynamicCallable',
    'dynamicMemberLookup',
    'escaping',
    'frozen',
    'GKInspectable',
    'IBAction',
    'IBDesignable',
    'IBInspectable',
    'IBOutlet',
    'IBSegueAction',
    'inlinable',
    'main',
    'nonobjc',
    'NSApplicationMain',
    'NSCopying',
    'NSManaged',
    concat(/objc\(/, identifier, /\)/),
    'objc',
    'objcMembers',
    'propertyWrapper',
    'requires_stored_property_inits',
    'resultBuilder',
    'testable',
    'UIApplicationMain',
    'unknown',
    'usableFromInline'
];
const availabilityKeywords = [
    'iOS',
    'iOSApplicationExtension',
    'macOS',
    'macOSApplicationExtension',
    'macCatalyst',
    'macCatalystApplicationExtension',
    'watchOS',
    'watchOSApplicationExtension',
    'tvOS',
    'tvOSApplicationExtension',
    'swift'
];
function swift(hljs) {
    const WHITESPACE = {
        match: /\s+/,
        relevance: 0
    };
    const BLOCK_COMMENT = hljs.COMMENT('/\\*', '\\*/', { contains: ['self'] });
    const COMMENTS = [
        hljs.C_LINE_COMMENT_MODE,
        BLOCK_COMMENT
    ];
    const DOT_KEYWORD = {
        match: [
            /\./,
            either(...dotKeywords, ...optionalDotKeywords)
        ],
        className: { 2: "keyword" }
    };
    const KEYWORD_GUARD = {
        match: concat(/\./, either(...keywords)),
        relevance: 0
    };
    const PLAIN_KEYWORDS = keywords
        .filter(kw => typeof kw === 'string')
        .concat(["_|0"]);
    const REGEX_KEYWORDS = keywords
        .filter(kw => typeof kw !== 'string')
        .concat(keywordTypes)
        .map(keywordWrapper);
    const KEYWORD = { variants: [
            {
                className: 'keyword',
                match: either(...REGEX_KEYWORDS, ...optionalDotKeywords)
            }
        ] };
    const KEYWORDS = {
        $pattern: either(/\b\w+/, /#\w+/),
        keyword: PLAIN_KEYWORDS
            .concat(numberSignKeywords),
        literal: literals
    };
    const KEYWORD_MODES = [
        DOT_KEYWORD,
        KEYWORD_GUARD,
        KEYWORD
    ];
    const BUILT_IN_GUARD = {
        match: concat(/\./, either(...builtIns)),
        relevance: 0
    };
    const BUILT_IN = {
        className: 'built_in',
        match: concat(/\b/, either(...builtIns), /(?=\()/)
    };
    const BUILT_INS = [
        BUILT_IN_GUARD,
        BUILT_IN
    ];
    const OPERATOR_GUARD = {
        match: /->/,
        relevance: 0
    };
    const OPERATOR = {
        className: 'operator',
        relevance: 0,
        variants: [
            { match: operator },
            {
                match: `\\.(\\.|${operatorCharacter})+`
            }
        ]
    };
    const OPERATORS = [
        OPERATOR_GUARD,
        OPERATOR
    ];
    const decimalDigits = '([0-9]_*)+';
    const hexDigits = '([0-9a-fA-F]_*)+';
    const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
            { match: `\\b(${decimalDigits})(\\.(${decimalDigits}))?` + `([eE][+-]?(${decimalDigits}))?\\b` },
            { match: `\\b0x(${hexDigits})(\\.(${hexDigits}))?` + `([pP][+-]?(${decimalDigits}))?\\b` },
            { match: /\b0o([0-7]_*)+\b/ },
            { match: /\b0b([01]_*)+\b/ }
        ]
    };
    const ESCAPED_CHARACTER = (rawDelimiter = "") => ({
        className: 'subst',
        variants: [
            { match: concat(/\\/, rawDelimiter, /[0\\tnr"']/) },
            { match: concat(/\\/, rawDelimiter, /u\{[0-9a-fA-F]{1,8}\}/) }
        ]
    });
    const ESCAPED_NEWLINE = (rawDelimiter = "") => ({
        className: 'subst',
        match: concat(/\\/, rawDelimiter, /[\t ]*(?:[\r\n]|\r\n)/)
    });
    const INTERPOLATION = (rawDelimiter = "") => ({
        className: 'subst',
        label: "interpol",
        begin: concat(/\\/, rawDelimiter, /\(/),
        end: /\)/
    });
    const MULTILINE_STRING = (rawDelimiter = "") => ({
        begin: concat(rawDelimiter, /"""/),
        end: concat(/"""/, rawDelimiter),
        contains: [
            ESCAPED_CHARACTER(rawDelimiter),
            ESCAPED_NEWLINE(rawDelimiter),
            INTERPOLATION(rawDelimiter)
        ]
    });
    const SINGLE_LINE_STRING = (rawDelimiter = "") => ({
        begin: concat(rawDelimiter, /"/),
        end: concat(/"/, rawDelimiter),
        contains: [
            ESCAPED_CHARACTER(rawDelimiter),
            INTERPOLATION(rawDelimiter)
        ]
    });
    const STRING = {
        className: 'string',
        variants: [
            MULTILINE_STRING(),
            MULTILINE_STRING("#"),
            MULTILINE_STRING("##"),
            MULTILINE_STRING("###"),
            SINGLE_LINE_STRING(),
            SINGLE_LINE_STRING("#"),
            SINGLE_LINE_STRING("##"),
            SINGLE_LINE_STRING("###")
        ]
    };
    const QUOTED_IDENTIFIER = { match: concat(/`/, identifier, /`/) };
    const IMPLICIT_PARAMETER = {
        className: 'variable',
        match: /\$\d+/
    };
    const PROPERTY_WRAPPER_PROJECTION = {
        className: 'variable',
        match: `\\$${identifierCharacter}+`
    };
    const IDENTIFIERS = [
        QUOTED_IDENTIFIER,
        IMPLICIT_PARAMETER,
        PROPERTY_WRAPPER_PROJECTION
    ];
    const AVAILABLE_ATTRIBUTE = {
        match: /(@|#(un)?)available/,
        className: "keyword",
        starts: { contains: [
                {
                    begin: /\(/,
                    end: /\)/,
                    keywords: availabilityKeywords,
                    contains: [
                        ...OPERATORS,
                        NUMBER,
                        STRING
                    ]
                }
            ] }
    };
    const KEYWORD_ATTRIBUTE = {
        className: 'keyword',
        match: concat(/@/, either(...keywordAttributes))
    };
    const USER_DEFINED_ATTRIBUTE = {
        className: 'meta',
        match: concat(/@/, identifier)
    };
    const ATTRIBUTES = [
        AVAILABLE_ATTRIBUTE,
        KEYWORD_ATTRIBUTE,
        USER_DEFINED_ATTRIBUTE
    ];
    const TYPE = {
        match: lookahead(/\b[A-Z]/),
        relevance: 0,
        contains: [
            {
                className: 'type',
                match: concat(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, identifierCharacter, '+')
            },
            {
                className: 'type',
                match: typeIdentifier,
                relevance: 0
            },
            {
                match: /[?!]+/,
                relevance: 0
            },
            {
                match: /\.\.\./,
                relevance: 0
            },
            {
                match: concat(/\s+&\s+/, lookahead(typeIdentifier)),
                relevance: 0
            }
        ]
    };
    const GENERIC_ARGUMENTS = {
        begin: /</,
        end: />/,
        keywords: KEYWORDS,
        contains: [
            ...COMMENTS,
            ...KEYWORD_MODES,
            ...ATTRIBUTES,
            OPERATOR_GUARD,
            TYPE
        ]
    };
    TYPE.contains.push(GENERIC_ARGUMENTS);
    const TUPLE_ELEMENT_NAME = {
        match: concat(identifier, /\s*:/),
        keywords: "_|0",
        relevance: 0
    };
    const TUPLE = {
        begin: /\(/,
        end: /\)/,
        relevance: 0,
        keywords: KEYWORDS,
        contains: [
            'self',
            TUPLE_ELEMENT_NAME,
            ...COMMENTS,
            ...KEYWORD_MODES,
            ...BUILT_INS,
            ...OPERATORS,
            NUMBER,
            STRING,
            ...IDENTIFIERS,
            ...ATTRIBUTES,
            TYPE
        ]
    };
    const GENERIC_PARAMETERS = {
        begin: /</,
        end: />/,
        contains: [
            ...COMMENTS,
            TYPE
        ]
    };
    const FUNCTION_PARAMETER_NAME = {
        begin: either(lookahead(concat(identifier, /\s*:/)), lookahead(concat(identifier, /\s+/, identifier, /\s*:/))),
        end: /:/,
        relevance: 0,
        contains: [
            {
                className: 'keyword',
                match: /\b_\b/
            },
            {
                className: 'params',
                match: identifier
            }
        ]
    };
    const FUNCTION_PARAMETERS = {
        begin: /\(/,
        end: /\)/,
        keywords: KEYWORDS,
        contains: [
            FUNCTION_PARAMETER_NAME,
            ...COMMENTS,
            ...KEYWORD_MODES,
            ...OPERATORS,
            NUMBER,
            STRING,
            ...ATTRIBUTES,
            TYPE,
            TUPLE
        ],
        endsParent: true,
        illegal: /["']/
    };
    const FUNCTION = {
        match: [
            /func/,
            /\s+/,
            either(QUOTED_IDENTIFIER.match, identifier, operator)
        ],
        className: {
            1: "keyword",
            3: "title.function"
        },
        contains: [
            GENERIC_PARAMETERS,
            FUNCTION_PARAMETERS,
            WHITESPACE
        ],
        illegal: [
            /\[/,
            /%/
        ]
    };
    const INIT_SUBSCRIPT = {
        match: [
            /\b(?:subscript|init[?!]?)/,
            /\s*(?=[<(])/,
        ],
        className: { 1: "keyword" },
        contains: [
            GENERIC_PARAMETERS,
            FUNCTION_PARAMETERS,
            WHITESPACE
        ],
        illegal: /\[|%/
    };
    const OPERATOR_DECLARATION = {
        match: [
            /operator/,
            /\s+/,
            operator
        ],
        className: {
            1: "keyword",
            3: "title"
        }
    };
    const PRECEDENCEGROUP = {
        begin: [
            /precedencegroup/,
            /\s+/,
            typeIdentifier
        ],
        className: {
            1: "keyword",
            3: "title"
        },
        contains: [TYPE],
        keywords: [
            ...precedencegroupKeywords,
            ...literals
        ],
        end: /}/
    };
    for (const variant of STRING.variants) {
        const interpolation = variant.contains.find(mode => mode.label === "interpol");
        interpolation.keywords = KEYWORDS;
        const submodes = [
            ...KEYWORD_MODES,
            ...BUILT_INS,
            ...OPERATORS,
            NUMBER,
            STRING,
            ...IDENTIFIERS
        ];
        interpolation.contains = [
            ...submodes,
            {
                begin: /\(/,
                end: /\)/,
                contains: [
                    'self',
                    ...submodes
                ]
            }
        ];
    }
    return {
        name: 'Swift',
        keywords: KEYWORDS,
        contains: [
            ...COMMENTS,
            FUNCTION,
            INIT_SUBSCRIPT,
            {
                beginKeywords: 'struct protocol class extension enum actor',
                end: '\\{',
                excludeEnd: true,
                keywords: KEYWORDS,
                contains: [
                    hljs.inherit(hljs.TITLE_MODE, {
                        className: "title.class",
                        begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/
                    }),
                    ...KEYWORD_MODES
                ]
            },
            OPERATOR_DECLARATION,
            PRECEDENCEGROUP,
            {
                beginKeywords: 'import',
                end: /$/,
                contains: [...COMMENTS],
                relevance: 0
            },
            ...KEYWORD_MODES,
            ...BUILT_INS,
            ...OPERATORS,
            NUMBER,
            STRING,
            ...IDENTIFIERS,
            ...ATTRIBUTES,
            TYPE,
            TUPLE
        ]
    };
}
export { swift as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpZnQuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9zd2lmdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLE1BQU0sQ0FBQyxFQUFFO0lBQ2hCLElBQUksQ0FBQyxFQUFFO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDckIsSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFFdEMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ25CLENBQUM7QUFNRCxTQUFTLFNBQVMsQ0FBQyxFQUFFO0lBQ25CLE9BQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQU1ELFNBQVMsTUFBTSxDQUFDLEdBQUcsSUFBSTtJQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQU1ELFNBQVMsb0JBQW9CLENBQUMsSUFBSTtJQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVuQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sRUFBRTtRQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTTtRQUNMLE9B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QUFDO29CQUNGLEdBQUcsYUFBYTtpQkFDakI7YUFDRjtZQUNELG9CQUFvQjtZQUNwQixlQUFlO1lBQ2Y7Z0JBQ0UsYUFBYSxFQUFFLFFBQVE7Z0JBQ3ZCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRSxDQUFFLEdBQUcsUUFBUSxDQUFFO2dCQUN6QixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0QsR0FBRyxhQUFhO1lBQ2hCLEdBQUcsU0FBUztZQUNaLEdBQUcsU0FBUztZQUNaLE1BQU07WUFDTixNQUFNO1lBQ04sR0FBRyxXQUFXO1lBQ2QsR0FBRyxVQUFVO1lBQ2IsSUFBSTtZQUNKLEtBQUs7U0FDTjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJucyB7UmVnRXhwfVxuICogKi9cblxuLyoqXG4gKiBAcGFyYW0ge1JlZ0V4cCB8IHN0cmluZyB9IHJlXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBzb3VyY2UocmUpIHtcbiAgaWYgKCFyZSkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgcmUgPT09IFwic3RyaW5nXCIpIHJldHVybiByZTtcblxuICByZXR1cm4gcmUuc291cmNlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGxvb2thaGVhZChyZSkge1xuICByZXR1cm4gY29uY2F0KCcoPz0nLCByZSwgJyknKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gey4uLihSZWdFeHAgfCBzdHJpbmcpIH0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY29uY2F0KC4uLmFyZ3MpIHtcbiAgY29uc3Qgam9pbmVkID0gYXJncy5tYXAoKHgpID0+IHNvdXJjZSh4KSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIGpvaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyBBcnJheTxzdHJpbmcgfCBSZWdFeHAgfCBPYmplY3Q+IH0gYXJnc1xuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncykge1xuICBjb25zdCBvcHRzID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgJiYgb3B0cy5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgYXJncy5zcGxpY2UoYXJncy5sZW5ndGggLSAxLCAxKTtcbiAgICByZXR1cm4gb3B0cztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLyoqIEB0eXBlZGVmIHsge2NhcHR1cmU/OiBib29sZWFufSB9IFJlZ2V4RWl0aGVyT3B0aW9ucyAqL1xuXG4vKipcbiAqIEFueSBvZiB0aGUgcGFzc2VkIGV4cHJlc3NzaW9ucyBtYXkgbWF0Y2hcbiAqXG4gKiBDcmVhdGVzIGEgaHVnZSB0aGlzIHwgdGhpcyB8IHRoYXQgfCB0aGF0IG1hdGNoXG4gKiBAcGFyYW0geyhSZWdFeHAgfCBzdHJpbmcpW10gfCBbLi4uKFJlZ0V4cCB8IHN0cmluZylbXSwgUmVnZXhFaXRoZXJPcHRpb25zXX0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZWl0aGVyKC4uLmFyZ3MpIHtcbiAgLyoqIEB0eXBlIHsgb2JqZWN0ICYge2NhcHR1cmU/OiBib29sZWFufSB9ICAqL1xuICBjb25zdCBvcHRzID0gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncyk7XG4gIGNvbnN0IGpvaW5lZCA9ICcoJ1xuICAgICsgKG9wdHMuY2FwdHVyZSA/IFwiXCIgOiBcIj86XCIpXG4gICAgKyBhcmdzLm1hcCgoeCkgPT4gc291cmNlKHgpKS5qb2luKFwifFwiKSArIFwiKVwiO1xuICByZXR1cm4gam9pbmVkO1xufVxuXG5jb25zdCBrZXl3b3JkV3JhcHBlciA9IGtleXdvcmQgPT4gY29uY2F0KFxuICAvXFxiLyxcbiAga2V5d29yZCxcbiAgL1xcdyQvLnRlc3Qoa2V5d29yZCkgPyAvXFxiLyA6IC9cXEIvXG4pO1xuXG4vLyBLZXl3b3JkcyB0aGF0IHJlcXVpcmUgYSBsZWFkaW5nIGRvdC5cbmNvbnN0IGRvdEtleXdvcmRzID0gW1xuICAnUHJvdG9jb2wnLCAvLyBjb250ZXh0dWFsXG4gICdUeXBlJyAvLyBjb250ZXh0dWFsXG5dLm1hcChrZXl3b3JkV3JhcHBlcik7XG5cbi8vIEtleXdvcmRzIHRoYXQgbWF5IGhhdmUgYSBsZWFkaW5nIGRvdC5cbmNvbnN0IG9wdGlvbmFsRG90S2V5d29yZHMgPSBbXG4gICdpbml0JyxcbiAgJ3NlbGYnXG5dLm1hcChrZXl3b3JkV3JhcHBlcik7XG5cbi8vIHNob3VsZCByZWdpc3RlciBhcyBrZXl3b3JkLCBub3QgdHlwZVxuY29uc3Qga2V5d29yZFR5cGVzID0gW1xuICAnQW55JyxcbiAgJ1NlbGYnXG5dO1xuXG4vLyBSZWd1bGFyIGtleXdvcmRzIGFuZCBsaXRlcmFscy5cbmNvbnN0IGtleXdvcmRzID0gW1xuICAvLyBzdHJpbmdzIGJlbG93IHdpbGwgYmUgZmVkIGludG8gdGhlIHJlZ3VsYXIgYGtleXdvcmRzYCBlbmdpbmUgd2hpbGUgcmVnZXhcbiAgLy8gd2lsbCByZXN1bHQgaW4gYWRkaXRpb25hbCBtb2RlcyBiZWluZyBjcmVhdGVkIHRvIHNjYW4gZm9yIHRob3NlIGtleXdvcmRzIHRvXG4gIC8vIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG90aGVyIHJ1bGVzXG4gICdhY3RvcicsXG4gICdhbnknLCAvLyBjb250ZXh0dWFsXG4gICdhc3NvY2lhdGVkdHlwZScsXG4gICdhc3luYycsXG4gICdhd2FpdCcsXG4gIC9hc1xcPy8sIC8vIG9wZXJhdG9yXG4gIC9hcyEvLCAvLyBvcGVyYXRvclxuICAnYXMnLCAvLyBvcGVyYXRvclxuICAnYnJlYWsnLFxuICAnY2FzZScsXG4gICdjYXRjaCcsXG4gICdjbGFzcycsXG4gICdjb250aW51ZScsXG4gICdjb252ZW5pZW5jZScsIC8vIGNvbnRleHR1YWxcbiAgJ2RlZmF1bHQnLFxuICAnZGVmZXInLFxuICAnZGVpbml0JyxcbiAgJ2RpZFNldCcsIC8vIGNvbnRleHR1YWxcbiAgJ2Rpc3RyaWJ1dGVkJyxcbiAgJ2RvJyxcbiAgJ2R5bmFtaWMnLCAvLyBjb250ZXh0dWFsXG4gICdlbHNlJyxcbiAgJ2VudW0nLFxuICAnZXh0ZW5zaW9uJyxcbiAgJ2ZhbGx0aHJvdWdoJyxcbiAgL2ZpbGVwcml2YXRlXFwoc2V0XFwpLyxcbiAgJ2ZpbGVwcml2YXRlJyxcbiAgJ2ZpbmFsJywgLy8gY29udGV4dHVhbFxuICAnZm9yJyxcbiAgJ2Z1bmMnLFxuICAnZ2V0JywgLy8gY29udGV4dHVhbFxuICAnZ3VhcmQnLFxuICAnaWYnLFxuICAnaW1wb3J0JyxcbiAgJ2luZGlyZWN0JywgLy8gY29udGV4dHVhbFxuICAnaW5maXgnLCAvLyBjb250ZXh0dWFsXG4gIC9pbml0XFw/LyxcbiAgL2luaXQhLyxcbiAgJ2lub3V0JyxcbiAgL2ludGVybmFsXFwoc2V0XFwpLyxcbiAgJ2ludGVybmFsJyxcbiAgJ2luJyxcbiAgJ2lzJywgLy8gb3BlcmF0b3JcbiAgJ2lzb2xhdGVkJywgLy8gY29udGV4dHVhbFxuICAnbm9uaXNvbGF0ZWQnLCAvLyBjb250ZXh0dWFsXG4gICdsYXp5JywgLy8gY29udGV4dHVhbFxuICAnbGV0JyxcbiAgJ211dGF0aW5nJywgLy8gY29udGV4dHVhbFxuICAnbm9ubXV0YXRpbmcnLCAvLyBjb250ZXh0dWFsXG4gIC9vcGVuXFwoc2V0XFwpLywgLy8gY29udGV4dHVhbFxuICAnb3BlbicsIC8vIGNvbnRleHR1YWxcbiAgJ29wZXJhdG9yJyxcbiAgJ29wdGlvbmFsJywgLy8gY29udGV4dHVhbFxuICAnb3ZlcnJpZGUnLCAvLyBjb250ZXh0dWFsXG4gICdwb3N0Zml4JywgLy8gY29udGV4dHVhbFxuICAncHJlY2VkZW5jZWdyb3VwJyxcbiAgJ3ByZWZpeCcsIC8vIGNvbnRleHR1YWxcbiAgL3ByaXZhdGVcXChzZXRcXCkvLFxuICAncHJpdmF0ZScsXG4gICdwcm90b2NvbCcsXG4gIC9wdWJsaWNcXChzZXRcXCkvLFxuICAncHVibGljJyxcbiAgJ3JlcGVhdCcsXG4gICdyZXF1aXJlZCcsIC8vIGNvbnRleHR1YWxcbiAgJ3JldGhyb3dzJyxcbiAgJ3JldHVybicsXG4gICdzZXQnLCAvLyBjb250ZXh0dWFsXG4gICdzb21lJywgLy8gY29udGV4dHVhbFxuICAnc3RhdGljJyxcbiAgJ3N0cnVjdCcsXG4gICdzdWJzY3JpcHQnLFxuICAnc3VwZXInLFxuICAnc3dpdGNoJyxcbiAgJ3Rocm93cycsXG4gICd0aHJvdycsXG4gIC90cnlcXD8vLCAvLyBvcGVyYXRvclxuICAvdHJ5IS8sIC8vIG9wZXJhdG9yXG4gICd0cnknLCAvLyBvcGVyYXRvclxuICAndHlwZWFsaWFzJyxcbiAgL3Vub3duZWRcXChzYWZlXFwpLywgLy8gY29udGV4dHVhbFxuICAvdW5vd25lZFxcKHVuc2FmZVxcKS8sIC8vIGNvbnRleHR1YWxcbiAgJ3Vub3duZWQnLCAvLyBjb250ZXh0dWFsXG4gICd2YXInLFxuICAnd2VhaycsIC8vIGNvbnRleHR1YWxcbiAgJ3doZXJlJyxcbiAgJ3doaWxlJyxcbiAgJ3dpbGxTZXQnIC8vIGNvbnRleHR1YWxcbl07XG5cbi8vIE5PVEU6IENvbnRleHR1YWwga2V5d29yZHMgYXJlIHJlc2VydmVkIG9ubHkgaW4gc3BlY2lmaWMgY29udGV4dHMuXG4vLyBJZGVhbGx5LCB0aGVzZSBzaG91bGQgYmUgbWF0Y2hlZCB1c2luZyBtb2RlcyB0byBhdm9pZCBmYWxzZSBwb3NpdGl2ZXMuXG5cbi8vIExpdGVyYWxzLlxuY29uc3QgbGl0ZXJhbHMgPSBbXG4gICdmYWxzZScsXG4gICduaWwnLFxuICAndHJ1ZSdcbl07XG5cbi8vIEtleXdvcmRzIHVzZWQgaW4gcHJlY2VkZW5jZSBncm91cHMuXG5jb25zdCBwcmVjZWRlbmNlZ3JvdXBLZXl3b3JkcyA9IFtcbiAgJ2Fzc2lnbm1lbnQnLFxuICAnYXNzb2NpYXRpdml0eScsXG4gICdoaWdoZXJUaGFuJyxcbiAgJ2xlZnQnLFxuICAnbG93ZXJUaGFuJyxcbiAgJ25vbmUnLFxuICAncmlnaHQnXG5dO1xuXG4vLyBLZXl3b3JkcyB0aGF0IHN0YXJ0IHdpdGggYSBudW1iZXIgc2lnbiAoIykuXG4vLyAjKHVuKWF2YWlsYWJsZSBpcyBoYW5kbGVkIHNlcGFyYXRlbHkuXG5jb25zdCBudW1iZXJTaWduS2V5d29yZHMgPSBbXG4gICcjY29sb3JMaXRlcmFsJyxcbiAgJyNjb2x1bW4nLFxuICAnI2Rzb2hhbmRsZScsXG4gICcjZWxzZScsXG4gICcjZWxzZWlmJyxcbiAgJyNlbmRpZicsXG4gICcjZXJyb3InLFxuICAnI2ZpbGUnLFxuICAnI2ZpbGVJRCcsXG4gICcjZmlsZUxpdGVyYWwnLFxuICAnI2ZpbGVQYXRoJyxcbiAgJyNmdW5jdGlvbicsXG4gICcjaWYnLFxuICAnI2ltYWdlTGl0ZXJhbCcsXG4gICcja2V5UGF0aCcsXG4gICcjbGluZScsXG4gICcjc2VsZWN0b3InLFxuICAnI3NvdXJjZUxvY2F0aW9uJyxcbiAgJyN3YXJuX3VucXVhbGlmaWVkX2FjY2VzcycsXG4gICcjd2FybmluZydcbl07XG5cbi8vIEdsb2JhbCBmdW5jdGlvbnMgaW4gdGhlIFN0YW5kYXJkIExpYnJhcnkuXG5jb25zdCBidWlsdElucyA9IFtcbiAgJ2FicycsXG4gICdhbGwnLFxuICAnYW55JyxcbiAgJ2Fzc2VydCcsXG4gICdhc3NlcnRpb25GYWlsdXJlJyxcbiAgJ2RlYnVnUHJpbnQnLFxuICAnZHVtcCcsXG4gICdmYXRhbEVycm9yJyxcbiAgJ2dldFZhTGlzdCcsXG4gICdpc0tub3duVW5pcXVlbHlSZWZlcmVuY2VkJyxcbiAgJ21heCcsXG4gICdtaW4nLFxuICAnbnVtZXJpY0Nhc3QnLFxuICAncG9pbnR3aXNlTWF4JyxcbiAgJ3BvaW50d2lzZU1pbicsXG4gICdwcmVjb25kaXRpb24nLFxuICAncHJlY29uZGl0aW9uRmFpbHVyZScsXG4gICdwcmludCcsXG4gICdyZWFkTGluZScsXG4gICdyZXBlYXRFbGVtZW50JyxcbiAgJ3NlcXVlbmNlJyxcbiAgJ3N0cmlkZScsXG4gICdzd2FwJyxcbiAgJ3N3aWZ0X3VuYm94RnJvbVN3aWZ0VmFsdWVXaXRoVHlwZScsXG4gICd0cmFuc2NvZGUnLFxuICAndHlwZScsXG4gICd1bnNhZmVCaXRDYXN0JyxcbiAgJ3Vuc2FmZURvd25jYXN0JyxcbiAgJ3dpdGhFeHRlbmRlZExpZmV0aW1lJyxcbiAgJ3dpdGhVbnNhZmVNdXRhYmxlUG9pbnRlcicsXG4gICd3aXRoVW5zYWZlUG9pbnRlcicsXG4gICd3aXRoVmFMaXN0JyxcbiAgJ3dpdGhvdXRBY3R1YWxseUVzY2FwaW5nJyxcbiAgJ3ppcCdcbl07XG5cbi8vIFZhbGlkIGZpcnN0IGNoYXJhY3RlcnMgZm9yIG9wZXJhdG9ycy5cbmNvbnN0IG9wZXJhdG9ySGVhZCA9IGVpdGhlcihcbiAgL1svPVxcLSshKiU8PiZ8Xn4/XS8sXG4gIC9bXFx1MDBBMS1cXHUwMEE3XS8sXG4gIC9bXFx1MDBBOVxcdTAwQUJdLyxcbiAgL1tcXHUwMEFDXFx1MDBBRV0vLFxuICAvW1xcdTAwQjBcXHUwMEIxXS8sXG4gIC9bXFx1MDBCNlxcdTAwQkJcXHUwMEJGXFx1MDBEN1xcdTAwRjddLyxcbiAgL1tcXHUyMDE2LVxcdTIwMTddLyxcbiAgL1tcXHUyMDIwLVxcdTIwMjddLyxcbiAgL1tcXHUyMDMwLVxcdTIwM0VdLyxcbiAgL1tcXHUyMDQxLVxcdTIwNTNdLyxcbiAgL1tcXHUyMDU1LVxcdTIwNUVdLyxcbiAgL1tcXHUyMTkwLVxcdTIzRkZdLyxcbiAgL1tcXHUyNTAwLVxcdTI3NzVdLyxcbiAgL1tcXHUyNzk0LVxcdTJCRkZdLyxcbiAgL1tcXHUyRTAwLVxcdTJFN0ZdLyxcbiAgL1tcXHUzMDAxLVxcdTMwMDNdLyxcbiAgL1tcXHUzMDA4LVxcdTMwMjBdLyxcbiAgL1tcXHUzMDMwXS9cbik7XG5cbi8vIFZhbGlkIGNoYXJhY3RlcnMgZm9yIG9wZXJhdG9ycy5cbmNvbnN0IG9wZXJhdG9yQ2hhcmFjdGVyID0gZWl0aGVyKFxuICBvcGVyYXRvckhlYWQsXG4gIC9bXFx1MDMwMC1cXHUwMzZGXS8sXG4gIC9bXFx1MURDMC1cXHUxREZGXS8sXG4gIC9bXFx1MjBEMC1cXHUyMEZGXS8sXG4gIC9bXFx1RkUwMC1cXHVGRTBGXS8sXG4gIC9bXFx1RkUyMC1cXHVGRTJGXS9cbiAgLy8gVE9ETzogVGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzIGFyZSBhbHNvIGFsbG93ZWQsIGJ1dCB0aGUgcmVnZXggaXNuJ3Qgc3VwcG9ydGVkIHlldC5cbiAgLy8gL1tcXHV7RTAxMDB9LVxcdXtFMDFFRn1dL3Vcbik7XG5cbi8vIFZhbGlkIG9wZXJhdG9yLlxuY29uc3Qgb3BlcmF0b3IgPSBjb25jYXQob3BlcmF0b3JIZWFkLCBvcGVyYXRvckNoYXJhY3RlciwgJyonKTtcblxuLy8gVmFsaWQgZmlyc3QgY2hhcmFjdGVycyBmb3IgaWRlbnRpZmllcnMuXG5jb25zdCBpZGVudGlmaWVySGVhZCA9IGVpdGhlcihcbiAgL1thLXpBLVpfXS8sXG4gIC9bXFx1MDBBOFxcdTAwQUFcXHUwMEFEXFx1MDBBRlxcdTAwQjItXFx1MDBCNVxcdTAwQjctXFx1MDBCQV0vLFxuICAvW1xcdTAwQkMtXFx1MDBCRVxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDBGRl0vLFxuICAvW1xcdTAxMDAtXFx1MDJGRlxcdTAzNzAtXFx1MTY3RlxcdTE2ODEtXFx1MTgwRFxcdTE4MEYtXFx1MURCRl0vLFxuICAvW1xcdTFFMDAtXFx1MUZGRl0vLFxuICAvW1xcdTIwMEItXFx1MjAwRFxcdTIwMkEtXFx1MjAyRVxcdTIwM0YtXFx1MjA0MFxcdTIwNTRcXHUyMDYwLVxcdTIwNkZdLyxcbiAgL1tcXHUyMDcwLVxcdTIwQ0ZcXHUyMTAwLVxcdTIxOEZcXHUyNDYwLVxcdTI0RkZcXHUyNzc2LVxcdTI3OTNdLyxcbiAgL1tcXHUyQzAwLVxcdTJERkZcXHUyRTgwLVxcdTJGRkZdLyxcbiAgL1tcXHUzMDA0LVxcdTMwMDdcXHUzMDIxLVxcdTMwMkZcXHUzMDMxLVxcdTMwM0ZcXHUzMDQwLVxcdUQ3RkZdLyxcbiAgL1tcXHVGOTAwLVxcdUZEM0RcXHVGRDQwLVxcdUZEQ0ZcXHVGREYwLVxcdUZFMUZcXHVGRTMwLVxcdUZFNDRdLyxcbiAgL1tcXHVGRTQ3LVxcdUZFRkVcXHVGRjAwLVxcdUZGRkRdLyAvLyBTaG91bGQgYmUgL1tcXHVGRTQ3LVxcdUZGRkRdLywgYnV0IHdlIGhhdmUgdG8gZXhjbHVkZSBGRUZGLlxuICAvLyBUaGUgZm9sbG93aW5nIGNoYXJhY3RlcnMgYXJlIGFsc28gYWxsb3dlZCwgYnV0IHRoZSByZWdleGVzIGFyZW4ndCBzdXBwb3J0ZWQgeWV0LlxuICAvLyAvW1xcdXsxMDAwMH0tXFx1ezFGRkZEfVxcdXsyMDAwMC1cXHV7MkZGRkR9XFx1ezMwMDAwfS1cXHV7M0ZGRkR9XFx1ezQwMDAwfS1cXHV7NEZGRkR9XS91LFxuICAvLyAvW1xcdXs1MDAwMH0tXFx1ezVGRkZEfVxcdXs2MDAwMC1cXHV7NkZGRkR9XFx1ezcwMDAwfS1cXHV7N0ZGRkR9XFx1ezgwMDAwfS1cXHV7OEZGRkR9XS91LFxuICAvLyAvW1xcdXs5MDAwMH0tXFx1ezlGRkZEfVxcdXtBMDAwMC1cXHV7QUZGRkR9XFx1e0IwMDAwfS1cXHV7QkZGRkR9XFx1e0MwMDAwfS1cXHV7Q0ZGRkR9XS91LFxuICAvLyAvW1xcdXtEMDAwMH0tXFx1e0RGRkZEfVxcdXtFMDAwMC1cXHV7RUZGRkR9XS91XG4pO1xuXG4vLyBWYWxpZCBjaGFyYWN0ZXJzIGZvciBpZGVudGlmaWVycy5cbmNvbnN0IGlkZW50aWZpZXJDaGFyYWN0ZXIgPSBlaXRoZXIoXG4gIGlkZW50aWZpZXJIZWFkLFxuICAvXFxkLyxcbiAgL1tcXHUwMzAwLVxcdTAzNkZcXHUxREMwLVxcdTFERkZcXHUyMEQwLVxcdTIwRkZcXHVGRTIwLVxcdUZFMkZdL1xuKTtcblxuLy8gVmFsaWQgaWRlbnRpZmllci5cbmNvbnN0IGlkZW50aWZpZXIgPSBjb25jYXQoaWRlbnRpZmllckhlYWQsIGlkZW50aWZpZXJDaGFyYWN0ZXIsICcqJyk7XG5cbi8vIFZhbGlkIHR5cGUgaWRlbnRpZmllci5cbmNvbnN0IHR5cGVJZGVudGlmaWVyID0gY29uY2F0KC9bQS1aXS8sIGlkZW50aWZpZXJDaGFyYWN0ZXIsICcqJyk7XG5cbi8vIEJ1aWx0LWluIGF0dHJpYnV0ZXMsIHdoaWNoIGFyZSBoaWdobGlnaHRlZCBhcyBrZXl3b3Jkcy5cbi8vIEBhdmFpbGFibGUgaXMgaGFuZGxlZCBzZXBhcmF0ZWx5LlxuY29uc3Qga2V5d29yZEF0dHJpYnV0ZXMgPSBbXG4gICdhdXRvY2xvc3VyZScsXG4gIGNvbmNhdCgvY29udmVudGlvblxcKC8sIGVpdGhlcignc3dpZnQnLCAnYmxvY2snLCAnYycpLCAvXFwpLyksXG4gICdkaXNjYXJkYWJsZVJlc3VsdCcsXG4gICdkeW5hbWljQ2FsbGFibGUnLFxuICAnZHluYW1pY01lbWJlckxvb2t1cCcsXG4gICdlc2NhcGluZycsXG4gICdmcm96ZW4nLFxuICAnR0tJbnNwZWN0YWJsZScsXG4gICdJQkFjdGlvbicsXG4gICdJQkRlc2lnbmFibGUnLFxuICAnSUJJbnNwZWN0YWJsZScsXG4gICdJQk91dGxldCcsXG4gICdJQlNlZ3VlQWN0aW9uJyxcbiAgJ2lubGluYWJsZScsXG4gICdtYWluJyxcbiAgJ25vbm9iamMnLFxuICAnTlNBcHBsaWNhdGlvbk1haW4nLFxuICAnTlNDb3B5aW5nJyxcbiAgJ05TTWFuYWdlZCcsXG4gIGNvbmNhdCgvb2JqY1xcKC8sIGlkZW50aWZpZXIsIC9cXCkvKSxcbiAgJ29iamMnLFxuICAnb2JqY01lbWJlcnMnLFxuICAncHJvcGVydHlXcmFwcGVyJyxcbiAgJ3JlcXVpcmVzX3N0b3JlZF9wcm9wZXJ0eV9pbml0cycsXG4gICdyZXN1bHRCdWlsZGVyJyxcbiAgJ3Rlc3RhYmxlJyxcbiAgJ1VJQXBwbGljYXRpb25NYWluJyxcbiAgJ3Vua25vd24nLFxuICAndXNhYmxlRnJvbUlubGluZSdcbl07XG5cbi8vIENvbnRleHR1YWwga2V5d29yZHMgdXNlZCBpbiBAYXZhaWxhYmxlIGFuZCAjKHVuKWF2YWlsYWJsZS5cbmNvbnN0IGF2YWlsYWJpbGl0eUtleXdvcmRzID0gW1xuICAnaU9TJyxcbiAgJ2lPU0FwcGxpY2F0aW9uRXh0ZW5zaW9uJyxcbiAgJ21hY09TJyxcbiAgJ21hY09TQXBwbGljYXRpb25FeHRlbnNpb24nLFxuICAnbWFjQ2F0YWx5c3QnLFxuICAnbWFjQ2F0YWx5c3RBcHBsaWNhdGlvbkV4dGVuc2lvbicsXG4gICd3YXRjaE9TJyxcbiAgJ3dhdGNoT1NBcHBsaWNhdGlvbkV4dGVuc2lvbicsXG4gICd0dk9TJyxcbiAgJ3R2T1NBcHBsaWNhdGlvbkV4dGVuc2lvbicsXG4gICdzd2lmdCdcbl07XG5cbi8qXG5MYW5ndWFnZTogU3dpZnRcbkRlc2NyaXB0aW9uOiBTd2lmdCBpcyBhIGdlbmVyYWwtcHVycG9zZSBwcm9ncmFtbWluZyBsYW5ndWFnZSBidWlsdCB1c2luZyBhIG1vZGVybiBhcHByb2FjaCB0byBzYWZldHksIHBlcmZvcm1hbmNlLCBhbmQgc29mdHdhcmUgZGVzaWduIHBhdHRlcm5zLlxuQXV0aG9yOiBTdGV2ZW4gVmFuIEltcGUgPHN0ZXZlbi52YW5pbXBlQGljbG91ZC5jb20+XG5Db250cmlidXRvcnM6IENocmlzIEVpZGhvZiA8Y2hyaXNAZWlkaG9mLm5sPiwgTmF0ZSBDb29rIDxuYXRlY29va0BnbWFpbC5jb20+LCBBbGV4YW5kZXIgTGljaHRlciA8bWFubmlMQGdteC5uZXQ+LCBSaWNoYXJkIEdpYnNvbiA8Z2lic29uMDQyQGdpdGh1Yj5cbldlYnNpdGU6IGh0dHBzOi8vc3dpZnQub3JnXG5DYXRlZ29yeTogY29tbW9uLCBzeXN0ZW1cbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBzd2lmdChobGpzKSB7XG4gIGNvbnN0IFdISVRFU1BBQ0UgPSB7XG4gICAgbWF0Y2g6IC9cXHMrLyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgLy8gaHR0cHM6Ly9kb2NzLnN3aWZ0Lm9yZy9zd2lmdC1ib29rL1JlZmVyZW5jZU1hbnVhbC9MZXhpY2FsU3RydWN0dXJlLmh0bWwjSUQ0MTFcbiAgY29uc3QgQkxPQ0tfQ09NTUVOVCA9IGhsanMuQ09NTUVOVChcbiAgICAnL1xcXFwqJyxcbiAgICAnXFxcXCovJyxcbiAgICB7IGNvbnRhaW5zOiBbICdzZWxmJyBdIH1cbiAgKTtcbiAgY29uc3QgQ09NTUVOVFMgPSBbXG4gICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgIEJMT0NLX0NPTU1FTlRcbiAgXTtcblxuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL0xleGljYWxTdHJ1Y3R1cmUuaHRtbCNJRDQxM1xuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL3p6U3VtbWFyeU9mVGhlR3JhbW1hci5odG1sXG4gIGNvbnN0IERPVF9LRVlXT1JEID0ge1xuICAgIG1hdGNoOiBbXG4gICAgICAvXFwuLyxcbiAgICAgIGVpdGhlciguLi5kb3RLZXl3b3JkcywgLi4ub3B0aW9uYWxEb3RLZXl3b3JkcylcbiAgICBdLFxuICAgIGNsYXNzTmFtZTogeyAyOiBcImtleXdvcmRcIiB9XG4gIH07XG4gIGNvbnN0IEtFWVdPUkRfR1VBUkQgPSB7XG4gICAgLy8gQ29uc3VtZSAua2V5d29yZCB0byBwcmV2ZW50IGhpZ2hsaWdodGluZyBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGFzIGtleXdvcmRzLlxuICAgIG1hdGNoOiBjb25jYXQoL1xcLi8sIGVpdGhlciguLi5rZXl3b3JkcykpLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICBjb25zdCBQTEFJTl9LRVlXT1JEUyA9IGtleXdvcmRzXG4gICAgLmZpbHRlcihrdyA9PiB0eXBlb2Yga3cgPT09ICdzdHJpbmcnKVxuICAgIC5jb25jYXQoWyBcIl98MFwiIF0pOyAvLyBzZWVtcyBjb21tb24sIHNvIDAgcmVsZXZhbmNlXG4gIGNvbnN0IFJFR0VYX0tFWVdPUkRTID0ga2V5d29yZHNcbiAgICAuZmlsdGVyKGt3ID0+IHR5cGVvZiBrdyAhPT0gJ3N0cmluZycpIC8vIGZpbmQgcmVnZXhcbiAgICAuY29uY2F0KGtleXdvcmRUeXBlcylcbiAgICAubWFwKGtleXdvcmRXcmFwcGVyKTtcbiAgY29uc3QgS0VZV09SRCA9IHsgdmFyaWFudHM6IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgIG1hdGNoOiBlaXRoZXIoLi4uUkVHRVhfS0VZV09SRFMsIC4uLm9wdGlvbmFsRG90S2V5d29yZHMpXG4gICAgfVxuICBdIH07XG4gIC8vIGZpbmQgYWxsIHRoZSByZWd1bGFyIGtleXdvcmRzXG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgICRwYXR0ZXJuOiBlaXRoZXIoXG4gICAgICAvXFxiXFx3Ky8sIC8vIHJlZ3VsYXIga2V5d29yZHNcbiAgICAgIC8jXFx3Ky8gLy8gbnVtYmVyIGtleXdvcmRzXG4gICAgKSxcbiAgICBrZXl3b3JkOiBQTEFJTl9LRVlXT1JEU1xuICAgICAgLmNvbmNhdChudW1iZXJTaWduS2V5d29yZHMpLFxuICAgIGxpdGVyYWw6IGxpdGVyYWxzXG4gIH07XG4gIGNvbnN0IEtFWVdPUkRfTU9ERVMgPSBbXG4gICAgRE9UX0tFWVdPUkQsXG4gICAgS0VZV09SRF9HVUFSRCxcbiAgICBLRVlXT1JEXG4gIF07XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FwcGxlL3N3aWZ0L3RyZWUvbWFpbi9zdGRsaWIvcHVibGljL2NvcmVcbiAgY29uc3QgQlVJTFRfSU5fR1VBUkQgPSB7XG4gICAgLy8gQ29uc3VtZSAuYnVpbHRfaW4gdG8gcHJldmVudCBoaWdobGlnaHRpbmcgcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAgICBtYXRjaDogY29uY2F0KC9cXC4vLCBlaXRoZXIoLi4uYnVpbHRJbnMpKSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgQlVJTFRfSU4gPSB7XG4gICAgY2xhc3NOYW1lOiAnYnVpbHRfaW4nLFxuICAgIG1hdGNoOiBjb25jYXQoL1xcYi8sIGVpdGhlciguLi5idWlsdElucyksIC8oPz1cXCgpLylcbiAgfTtcbiAgY29uc3QgQlVJTFRfSU5TID0gW1xuICAgIEJVSUxUX0lOX0dVQVJELFxuICAgIEJVSUxUX0lOXG4gIF07XG5cbiAgLy8gaHR0cHM6Ly9kb2NzLnN3aWZ0Lm9yZy9zd2lmdC1ib29rL1JlZmVyZW5jZU1hbnVhbC9MZXhpY2FsU3RydWN0dXJlLmh0bWwjSUQ0MThcbiAgY29uc3QgT1BFUkFUT1JfR1VBUkQgPSB7XG4gICAgLy8gUHJldmVudCAtPiBmcm9tIGJlaW5nIGhpZ2hsaWdodGluZyBhcyBhbiBvcGVyYXRvci5cbiAgICBtYXRjaDogLy0+LyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgT1BFUkFUT1IgPSB7XG4gICAgY2xhc3NOYW1lOiAnb3BlcmF0b3InLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBtYXRjaDogb3BlcmF0b3IgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gZG90LW9wZXJhdG9yOiBvbmx5IG9wZXJhdG9ycyB0aGF0IHN0YXJ0IHdpdGggYSBkb3QgYXJlIGFsbG93ZWQgdG8gdXNlIGRvdHMgYXNcbiAgICAgICAgLy8gY2hhcmFjdGVycyAoLi4uLCAuLi48LCAuKiwgZXRjKS4gU28gdGhlcmUgcnVsZSBoZXJlIGlzOiBhIGRvdCBmb2xsb3dlZCBieSBvbmUgb3IgbW9yZVxuICAgICAgICAvLyBjaGFyYWN0ZXJzIHRoYXQgbWF5IGFsc28gaW5jbHVkZSBkb3RzLlxuICAgICAgICBtYXRjaDogYFxcXFwuKFxcXFwufCR7b3BlcmF0b3JDaGFyYWN0ZXJ9KStgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IE9QRVJBVE9SUyA9IFtcbiAgICBPUEVSQVRPUl9HVUFSRCxcbiAgICBPUEVSQVRPUlxuICBdO1xuXG4gIC8vIGh0dHBzOi8vZG9jcy5zd2lmdC5vcmcvc3dpZnQtYm9vay9SZWZlcmVuY2VNYW51YWwvTGV4aWNhbFN0cnVjdHVyZS5odG1sI2dyYW1tYXJfbnVtZXJpYy1saXRlcmFsXG4gIC8vIFRPRE86IFVwZGF0ZSBmb3IgbGVhZGluZyBgLWAgYWZ0ZXIgbG9va2JlaGluZCBpcyBzdXBwb3J0ZWQgZXZlcnl3aGVyZVxuICBjb25zdCBkZWNpbWFsRGlnaXRzID0gJyhbMC05XV8qKSsnO1xuICBjb25zdCBoZXhEaWdpdHMgPSAnKFswLTlhLWZBLUZdXyopKyc7XG4gIGNvbnN0IE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICB2YXJpYW50czogW1xuICAgICAgLy8gZGVjaW1hbCBmbG9hdGluZy1wb2ludC1saXRlcmFsIChzdWJzdW1lcyBkZWNpbWFsLWxpdGVyYWwpXG4gICAgICB7IG1hdGNoOiBgXFxcXGIoJHtkZWNpbWFsRGlnaXRzfSkoXFxcXC4oJHtkZWNpbWFsRGlnaXRzfSkpP2AgKyBgKFtlRV1bKy1dPygke2RlY2ltYWxEaWdpdHN9KSk/XFxcXGJgIH0sXG4gICAgICAvLyBoZXhhZGVjaW1hbCBmbG9hdGluZy1wb2ludC1saXRlcmFsIChzdWJzdW1lcyBoZXhhZGVjaW1hbC1saXRlcmFsKVxuICAgICAgeyBtYXRjaDogYFxcXFxiMHgoJHtoZXhEaWdpdHN9KShcXFxcLigke2hleERpZ2l0c30pKT9gICsgYChbcFBdWystXT8oJHtkZWNpbWFsRGlnaXRzfSkpP1xcXFxiYCB9LFxuICAgICAgLy8gb2N0YWwtbGl0ZXJhbFxuICAgICAgeyBtYXRjaDogL1xcYjBvKFswLTddXyopK1xcYi8gfSxcbiAgICAgIC8vIGJpbmFyeS1saXRlcmFsXG4gICAgICB7IG1hdGNoOiAvXFxiMGIoWzAxXV8qKStcXGIvIH1cbiAgICBdXG4gIH07XG5cbiAgLy8gaHR0cHM6Ly9kb2NzLnN3aWZ0Lm9yZy9zd2lmdC1ib29rL1JlZmVyZW5jZU1hbnVhbC9MZXhpY2FsU3RydWN0dXJlLmh0bWwjZ3JhbW1hcl9zdHJpbmctbGl0ZXJhbFxuICBjb25zdCBFU0NBUEVEX0NIQVJBQ1RFUiA9IChyYXdEZWxpbWl0ZXIgPSBcIlwiKSA9PiAoe1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBtYXRjaDogY29uY2F0KC9cXFxcLywgcmF3RGVsaW1pdGVyLCAvWzBcXFxcdG5yXCInXS8pIH0sXG4gICAgICB7IG1hdGNoOiBjb25jYXQoL1xcXFwvLCByYXdEZWxpbWl0ZXIsIC91XFx7WzAtOWEtZkEtRl17MSw4fVxcfS8pIH1cbiAgICBdXG4gIH0pO1xuICBjb25zdCBFU0NBUEVEX05FV0xJTkUgPSAocmF3RGVsaW1pdGVyID0gXCJcIikgPT4gKHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgbWF0Y2g6IGNvbmNhdCgvXFxcXC8sIHJhd0RlbGltaXRlciwgL1tcXHQgXSooPzpbXFxyXFxuXXxcXHJcXG4pLylcbiAgfSk7XG4gIGNvbnN0IElOVEVSUE9MQVRJT04gPSAocmF3RGVsaW1pdGVyID0gXCJcIikgPT4gKHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgbGFiZWw6IFwiaW50ZXJwb2xcIixcbiAgICBiZWdpbjogY29uY2F0KC9cXFxcLywgcmF3RGVsaW1pdGVyLCAvXFwoLyksXG4gICAgZW5kOiAvXFwpL1xuICB9KTtcbiAgY29uc3QgTVVMVElMSU5FX1NUUklORyA9IChyYXdEZWxpbWl0ZXIgPSBcIlwiKSA9PiAoe1xuICAgIGJlZ2luOiBjb25jYXQocmF3RGVsaW1pdGVyLCAvXCJcIlwiLyksXG4gICAgZW5kOiBjb25jYXQoL1wiXCJcIi8sIHJhd0RlbGltaXRlciksXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEVTQ0FQRURfQ0hBUkFDVEVSKHJhd0RlbGltaXRlciksXG4gICAgICBFU0NBUEVEX05FV0xJTkUocmF3RGVsaW1pdGVyKSxcbiAgICAgIElOVEVSUE9MQVRJT04ocmF3RGVsaW1pdGVyKVxuICAgIF1cbiAgfSk7XG4gIGNvbnN0IFNJTkdMRV9MSU5FX1NUUklORyA9IChyYXdEZWxpbWl0ZXIgPSBcIlwiKSA9PiAoe1xuICAgIGJlZ2luOiBjb25jYXQocmF3RGVsaW1pdGVyLCAvXCIvKSxcbiAgICBlbmQ6IGNvbmNhdCgvXCIvLCByYXdEZWxpbWl0ZXIpLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBFU0NBUEVEX0NIQVJBQ1RFUihyYXdEZWxpbWl0ZXIpLFxuICAgICAgSU5URVJQT0xBVElPTihyYXdEZWxpbWl0ZXIpXG4gICAgXVxuICB9KTtcbiAgY29uc3QgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIE1VTFRJTElORV9TVFJJTkcoKSxcbiAgICAgIE1VTFRJTElORV9TVFJJTkcoXCIjXCIpLFxuICAgICAgTVVMVElMSU5FX1NUUklORyhcIiMjXCIpLFxuICAgICAgTVVMVElMSU5FX1NUUklORyhcIiMjI1wiKSxcbiAgICAgIFNJTkdMRV9MSU5FX1NUUklORygpLFxuICAgICAgU0lOR0xFX0xJTkVfU1RSSU5HKFwiI1wiKSxcbiAgICAgIFNJTkdMRV9MSU5FX1NUUklORyhcIiMjXCIpLFxuICAgICAgU0lOR0xFX0xJTkVfU1RSSU5HKFwiIyMjXCIpXG4gICAgXVxuICB9O1xuXG4gIC8vIGh0dHBzOi8vZG9jcy5zd2lmdC5vcmcvc3dpZnQtYm9vay9SZWZlcmVuY2VNYW51YWwvTGV4aWNhbFN0cnVjdHVyZS5odG1sI0lENDEyXG4gIGNvbnN0IFFVT1RFRF9JREVOVElGSUVSID0geyBtYXRjaDogY29uY2F0KC9gLywgaWRlbnRpZmllciwgL2AvKSB9O1xuICBjb25zdCBJTVBMSUNJVF9QQVJBTUVURVIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIG1hdGNoOiAvXFwkXFxkKy9cbiAgfTtcbiAgY29uc3QgUFJPUEVSVFlfV1JBUFBFUl9QUk9KRUNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBtYXRjaDogYFxcXFwkJHtpZGVudGlmaWVyQ2hhcmFjdGVyfStgXG4gIH07XG4gIGNvbnN0IElERU5USUZJRVJTID0gW1xuICAgIFFVT1RFRF9JREVOVElGSUVSLFxuICAgIElNUExJQ0lUX1BBUkFNRVRFUixcbiAgICBQUk9QRVJUWV9XUkFQUEVSX1BST0pFQ1RJT05cbiAgXTtcblxuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL0F0dHJpYnV0ZXMuaHRtbFxuICBjb25zdCBBVkFJTEFCTEVfQVRUUklCVVRFID0ge1xuICAgIG1hdGNoOiAvKEB8Iyh1bik/KWF2YWlsYWJsZS8sXG4gICAgY2xhc3NOYW1lOiBcImtleXdvcmRcIixcbiAgICBzdGFydHM6IHsgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICBrZXl3b3JkczogYXZhaWxhYmlsaXR5S2V5d29yZHMsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgLi4uT1BFUkFUT1JTLFxuICAgICAgICAgIE5VTUJFUixcbiAgICAgICAgICBTVFJJTkdcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0gfVxuICB9O1xuICBjb25zdCBLRVlXT1JEX0FUVFJJQlVURSA9IHtcbiAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICBtYXRjaDogY29uY2F0KC9ALywgZWl0aGVyKC4uLmtleXdvcmRBdHRyaWJ1dGVzKSlcbiAgfTtcbiAgY29uc3QgVVNFUl9ERUZJTkVEX0FUVFJJQlVURSA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBtYXRjaDogY29uY2F0KC9ALywgaWRlbnRpZmllcilcbiAgfTtcbiAgY29uc3QgQVRUUklCVVRFUyA9IFtcbiAgICBBVkFJTEFCTEVfQVRUUklCVVRFLFxuICAgIEtFWVdPUkRfQVRUUklCVVRFLFxuICAgIFVTRVJfREVGSU5FRF9BVFRSSUJVVEVcbiAgXTtcblxuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL1R5cGVzLmh0bWxcbiAgY29uc3QgVFlQRSA9IHtcbiAgICBtYXRjaDogbG9va2FoZWFkKC9cXGJbQS1aXS8pLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAgeyAvLyBDb21tb24gQXBwbGUgZnJhbWV3b3JrcywgZm9yIHJlbGV2YW5jZSBib29zdFxuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgbWF0Y2g6IGNvbmNhdCgvKEFWfENBfENGfENHfENJfENMfENNfENOfENUfE1LfE1QfE1US3xNVEx8TlN8U0NOfFNLfFVJfFdLfFhDKS8sIGlkZW50aWZpZXJDaGFyYWN0ZXIsICcrJylcbiAgICAgIH0sXG4gICAgICB7IC8vIFR5cGUgaWRlbnRpZmllclxuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgbWF0Y2g6IHR5cGVJZGVudGlmaWVyLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IC8vIE9wdGlvbmFsIHR5cGVcbiAgICAgICAgbWF0Y2g6IC9bPyFdKy8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHsgLy8gVmFyaWFkaWMgcGFyYW1ldGVyXG4gICAgICAgIG1hdGNoOiAvXFwuXFwuXFwuLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgeyAvLyBQcm90b2NvbCBjb21wb3NpdGlvblxuICAgICAgICBtYXRjaDogY29uY2F0KC9cXHMrJlxccysvLCBsb29rYWhlYWQodHlwZUlkZW50aWZpZXIpKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xuICBjb25zdCBHRU5FUklDX0FSR1VNRU5UUyA9IHtcbiAgICBiZWdpbjogLzwvLFxuICAgIGVuZDogLz4vLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgLi4uQ09NTUVOVFMsXG4gICAgICAuLi5LRVlXT1JEX01PREVTLFxuICAgICAgLi4uQVRUUklCVVRFUyxcbiAgICAgIE9QRVJBVE9SX0dVQVJELFxuICAgICAgVFlQRVxuICAgIF1cbiAgfTtcbiAgVFlQRS5jb250YWlucy5wdXNoKEdFTkVSSUNfQVJHVU1FTlRTKTtcblxuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL0V4cHJlc3Npb25zLmh0bWwjSUQ1NTJcbiAgLy8gUHJldmVudHMgZWxlbWVudCBuYW1lcyBmcm9tIGJlaW5nIGhpZ2hsaWdodGVkIGFzIGtleXdvcmRzLlxuICBjb25zdCBUVVBMRV9FTEVNRU5UX05BTUUgPSB7XG4gICAgbWF0Y2g6IGNvbmNhdChpZGVudGlmaWVyLCAvXFxzKjovKSxcbiAgICBrZXl3b3JkczogXCJffDBcIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgLy8gTWF0Y2hlcyB0dXBsZXMgYXMgd2VsbCBhcyB0aGUgcGFyYW1ldGVyIGxpc3Qgb2YgYSBmdW5jdGlvbiB0eXBlLlxuICBjb25zdCBUVVBMRSA9IHtcbiAgICBiZWdpbjogL1xcKC8sXG4gICAgZW5kOiAvXFwpLyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAnc2VsZicsXG4gICAgICBUVVBMRV9FTEVNRU5UX05BTUUsXG4gICAgICAuLi5DT01NRU5UUyxcbiAgICAgIC4uLktFWVdPUkRfTU9ERVMsXG4gICAgICAuLi5CVUlMVF9JTlMsXG4gICAgICAuLi5PUEVSQVRPUlMsXG4gICAgICBOVU1CRVIsXG4gICAgICBTVFJJTkcsXG4gICAgICAuLi5JREVOVElGSUVSUyxcbiAgICAgIC4uLkFUVFJJQlVURVMsXG4gICAgICBUWVBFXG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IEdFTkVSSUNfUEFSQU1FVEVSUyA9IHtcbiAgICBiZWdpbjogLzwvLFxuICAgIGVuZDogLz4vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAuLi5DT01NRU5UUyxcbiAgICAgIFRZUEVcbiAgICBdXG4gIH07XG4gIGNvbnN0IEZVTkNUSU9OX1BBUkFNRVRFUl9OQU1FID0ge1xuICAgIGJlZ2luOiBlaXRoZXIoXG4gICAgICBsb29rYWhlYWQoY29uY2F0KGlkZW50aWZpZXIsIC9cXHMqOi8pKSxcbiAgICAgIGxvb2thaGVhZChjb25jYXQoaWRlbnRpZmllciwgL1xccysvLCBpZGVudGlmaWVyLCAvXFxzKjovKSlcbiAgICApLFxuICAgIGVuZDogLzovLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgbWF0Y2g6IC9cXGJfXFxiL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgbWF0Y2g6IGlkZW50aWZpZXJcbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IEZVTkNUSU9OX1BBUkFNRVRFUlMgPSB7XG4gICAgYmVnaW46IC9cXCgvLFxuICAgIGVuZDogL1xcKS8sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBGVU5DVElPTl9QQVJBTUVURVJfTkFNRSxcbiAgICAgIC4uLkNPTU1FTlRTLFxuICAgICAgLi4uS0VZV09SRF9NT0RFUyxcbiAgICAgIC4uLk9QRVJBVE9SUyxcbiAgICAgIE5VTUJFUixcbiAgICAgIFNUUklORyxcbiAgICAgIC4uLkFUVFJJQlVURVMsXG4gICAgICBUWVBFLFxuICAgICAgVFVQTEVcbiAgICBdLFxuICAgIGVuZHNQYXJlbnQ6IHRydWUsXG4gICAgaWxsZWdhbDogL1tcIiddL1xuICB9O1xuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL0RlY2xhcmF0aW9ucy5odG1sI0lEMzYyXG4gIGNvbnN0IEZVTkNUSU9OID0ge1xuICAgIG1hdGNoOiBbXG4gICAgICAvZnVuYy8sXG4gICAgICAvXFxzKy8sXG4gICAgICBlaXRoZXIoUVVPVEVEX0lERU5USUZJRVIubWF0Y2gsIGlkZW50aWZpZXIsIG9wZXJhdG9yKVxuICAgIF0sXG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEdFTkVSSUNfUEFSQU1FVEVSUyxcbiAgICAgIEZVTkNUSU9OX1BBUkFNRVRFUlMsXG4gICAgICBXSElURVNQQUNFXG4gICAgXSxcbiAgICBpbGxlZ2FsOiBbXG4gICAgICAvXFxbLyxcbiAgICAgIC8lL1xuICAgIF1cbiAgfTtcblxuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL0RlY2xhcmF0aW9ucy5odG1sI0lEMzc1XG4gIC8vIGh0dHBzOi8vZG9jcy5zd2lmdC5vcmcvc3dpZnQtYm9vay9SZWZlcmVuY2VNYW51YWwvRGVjbGFyYXRpb25zLmh0bWwjSUQzNzlcbiAgY29uc3QgSU5JVF9TVUJTQ1JJUFQgPSB7XG4gICAgbWF0Y2g6IFtcbiAgICAgIC9cXGIoPzpzdWJzY3JpcHR8aW5pdFs/IV0/KS8sXG4gICAgICAvXFxzKig/PVs8KF0pLyxcbiAgICBdLFxuICAgIGNsYXNzTmFtZTogeyAxOiBcImtleXdvcmRcIiB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBHRU5FUklDX1BBUkFNRVRFUlMsXG4gICAgICBGVU5DVElPTl9QQVJBTUVURVJTLFxuICAgICAgV0hJVEVTUEFDRVxuICAgIF0sXG4gICAgaWxsZWdhbDogL1xcW3wlL1xuICB9O1xuICAvLyBodHRwczovL2RvY3Muc3dpZnQub3JnL3N3aWZ0LWJvb2svUmVmZXJlbmNlTWFudWFsL0RlY2xhcmF0aW9ucy5odG1sI0lEMzgwXG4gIGNvbnN0IE9QRVJBVE9SX0RFQ0xBUkFUSU9OID0ge1xuICAgIG1hdGNoOiBbXG4gICAgICAvb3BlcmF0b3IvLFxuICAgICAgL1xccysvLFxuICAgICAgb3BlcmF0b3JcbiAgICBdLFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAzOiBcInRpdGxlXCJcbiAgICB9XG4gIH07XG5cbiAgLy8gaHR0cHM6Ly9kb2NzLnN3aWZ0Lm9yZy9zd2lmdC1ib29rL1JlZmVyZW5jZU1hbnVhbC9EZWNsYXJhdGlvbnMuaHRtbCNJRDU1MFxuICBjb25zdCBQUkVDRURFTkNFR1JPVVAgPSB7XG4gICAgYmVnaW46IFtcbiAgICAgIC9wcmVjZWRlbmNlZ3JvdXAvLFxuICAgICAgL1xccysvLFxuICAgICAgdHlwZUlkZW50aWZpZXJcbiAgICBdLFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAzOiBcInRpdGxlXCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbIFRZUEUgXSxcbiAgICBrZXl3b3JkczogW1xuICAgICAgLi4ucHJlY2VkZW5jZWdyb3VwS2V5d29yZHMsXG4gICAgICAuLi5saXRlcmFsc1xuICAgIF0sXG4gICAgZW5kOiAvfS9cbiAgfTtcblxuICAvLyBBZGQgc3VwcG9ydGVkIHN1Ym1vZGVzIHRvIHN0cmluZyBpbnRlcnBvbGF0aW9uLlxuICBmb3IgKGNvbnN0IHZhcmlhbnQgb2YgU1RSSU5HLnZhcmlhbnRzKSB7XG4gICAgY29uc3QgaW50ZXJwb2xhdGlvbiA9IHZhcmlhbnQuY29udGFpbnMuZmluZChtb2RlID0+IG1vZGUubGFiZWwgPT09IFwiaW50ZXJwb2xcIik7XG4gICAgLy8gVE9ETzogSW50ZXJwb2xhdGlvbiBjYW4gY29udGFpbiBhbnkgZXhwcmVzc2lvbiwgc28gdGhlcmUncyByb29tIGZvciBpbXByb3ZlbWVudCBoZXJlLlxuICAgIGludGVycG9sYXRpb24ua2V5d29yZHMgPSBLRVlXT1JEUztcbiAgICBjb25zdCBzdWJtb2RlcyA9IFtcbiAgICAgIC4uLktFWVdPUkRfTU9ERVMsXG4gICAgICAuLi5CVUlMVF9JTlMsXG4gICAgICAuLi5PUEVSQVRPUlMsXG4gICAgICBOVU1CRVIsXG4gICAgICBTVFJJTkcsXG4gICAgICAuLi5JREVOVElGSUVSU1xuICAgIF07XG4gICAgaW50ZXJwb2xhdGlvbi5jb250YWlucyA9IFtcbiAgICAgIC4uLnN1Ym1vZGVzLFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgIC4uLnN1Ym1vZGVzXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnU3dpZnQnLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgLi4uQ09NTUVOVFMsXG4gICAgICBGVU5DVElPTixcbiAgICAgIElOSVRfU1VCU0NSSVBULFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnc3RydWN0IHByb3RvY29sIGNsYXNzIGV4dGVuc2lvbiBlbnVtIGFjdG9yJyxcbiAgICAgICAgZW5kOiAnXFxcXHsnLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRpdGxlLmNsYXNzXCIsXG4gICAgICAgICAgICBiZWdpbjogL1tBLVphLXokX11bXFx1MDBDMC1cXHUwMkI4MC05QS1aYS16JF9dKi9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICAuLi5LRVlXT1JEX01PREVTXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBPUEVSQVRPUl9ERUNMQVJBVElPTixcbiAgICAgIFBSRUNFREVOQ0VHUk9VUCxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2ltcG9ydCcsXG4gICAgICAgIGVuZDogLyQvLFxuICAgICAgICBjb250YWluczogWyAuLi5DT01NRU5UUyBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAuLi5LRVlXT1JEX01PREVTLFxuICAgICAgLi4uQlVJTFRfSU5TLFxuICAgICAgLi4uT1BFUkFUT1JTLFxuICAgICAgTlVNQkVSLFxuICAgICAgU1RSSU5HLFxuICAgICAgLi4uSURFTlRJRklFUlMsXG4gICAgICAuLi5BVFRSSUJVVEVTLFxuICAgICAgVFlQRSxcbiAgICAgIFRVUExFXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBzd2lmdCBhcyBkZWZhdWx0IH07XG4iXX0=