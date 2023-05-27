function python(hljs) {
    const regex = hljs.regex;
    const IDENT_RE = /[\p{XID_Start}_]\p{XID_Continue}*/u;
    const RESERVED_WORDS = [
        'and',
        'as',
        'assert',
        'async',
        'await',
        'break',
        'case',
        'class',
        'continue',
        'def',
        'del',
        'elif',
        'else',
        'except',
        'finally',
        'for',
        'from',
        'global',
        'if',
        'import',
        'in',
        'is',
        'lambda',
        'match',
        'nonlocal|10',
        'not',
        'or',
        'pass',
        'raise',
        'return',
        'try',
        'while',
        'with',
        'yield'
    ];
    const BUILT_INS = [
        '__import__',
        'abs',
        'all',
        'any',
        'ascii',
        'bin',
        'bool',
        'breakpoint',
        'bytearray',
        'bytes',
        'callable',
        'chr',
        'classmethod',
        'compile',
        'complex',
        'delattr',
        'dict',
        'dir',
        'divmod',
        'enumerate',
        'eval',
        'exec',
        'filter',
        'float',
        'format',
        'frozenset',
        'getattr',
        'globals',
        'hasattr',
        'hash',
        'help',
        'hex',
        'id',
        'input',
        'int',
        'isinstance',
        'issubclass',
        'iter',
        'len',
        'list',
        'locals',
        'map',
        'max',
        'memoryview',
        'min',
        'next',
        'object',
        'oct',
        'open',
        'ord',
        'pow',
        'print',
        'property',
        'range',
        'repr',
        'reversed',
        'round',
        'set',
        'setattr',
        'slice',
        'sorted',
        'staticmethod',
        'str',
        'sum',
        'super',
        'tuple',
        'type',
        'vars',
        'zip'
    ];
    const LITERALS = [
        '__debug__',
        'Ellipsis',
        'False',
        'None',
        'NotImplemented',
        'True'
    ];
    const TYPES = [
        "Any",
        "Callable",
        "Coroutine",
        "Dict",
        "List",
        "Literal",
        "Generic",
        "Optional",
        "Sequence",
        "Set",
        "Tuple",
        "Type",
        "Union"
    ];
    const KEYWORDS = {
        $pattern: /[A-Za-z]\w+|__\w+__/,
        keyword: RESERVED_WORDS,
        built_in: BUILT_INS,
        literal: LITERALS,
        type: TYPES
    };
    const PROMPT = {
        className: 'meta',
        begin: /^(>>>|\.\.\.) /
    };
    const SUBST = {
        className: 'subst',
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS,
        illegal: /#/
    };
    const LITERAL_BRACKET = {
        begin: /\{\{/,
        relevance: 0
    };
    const STRING = {
        className: 'string',
        contains: [hljs.BACKSLASH_ESCAPE],
        variants: [
            {
                begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
                end: /'''/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    PROMPT
                ],
                relevance: 10
            },
            {
                begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
                end: /"""/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    PROMPT
                ],
                relevance: 10
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])'''/,
                end: /'''/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    PROMPT,
                    LITERAL_BRACKET,
                    SUBST
                ]
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])"""/,
                end: /"""/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    PROMPT,
                    LITERAL_BRACKET,
                    SUBST
                ]
            },
            {
                begin: /([uU]|[rR])'/,
                end: /'/,
                relevance: 10
            },
            {
                begin: /([uU]|[rR])"/,
                end: /"/,
                relevance: 10
            },
            {
                begin: /([bB]|[bB][rR]|[rR][bB])'/,
                end: /'/
            },
            {
                begin: /([bB]|[bB][rR]|[rR][bB])"/,
                end: /"/
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])'/,
                end: /'/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    LITERAL_BRACKET,
                    SUBST
                ]
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])"/,
                end: /"/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    LITERAL_BRACKET,
                    SUBST
                ]
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
        ]
    };
    const digitpart = '[0-9](_?[0-9])*';
    const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
    const lookahead = `\\b|${RESERVED_WORDS.join('|')}`;
    const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
            {
                begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`
            },
            {
                begin: `(${pointfloat})[jJ]?`
            },
            {
                begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`
            },
            {
                begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`
            },
            {
                begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`
            },
            {
                begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`
            },
            {
                begin: `\\b(${digitpart})[jJ](?=${lookahead})`
            }
        ]
    };
    const COMMENT_TYPE = {
        className: "comment",
        begin: regex.lookahead(/# type:/),
        end: /$/,
        keywords: KEYWORDS,
        contains: [
            {
                begin: /# type:/
            },
            {
                begin: /#/,
                end: /\b\B/,
                endsWithParent: true
            }
        ]
    };
    const PARAMS = {
        className: 'params',
        variants: [
            {
                className: "",
                begin: /\(\s*\)/,
                skip: true
            },
            {
                begin: /\(/,
                end: /\)/,
                excludeBegin: true,
                excludeEnd: true,
                keywords: KEYWORDS,
                contains: [
                    'self',
                    PROMPT,
                    NUMBER,
                    STRING,
                    hljs.HASH_COMMENT_MODE
                ]
            }
        ]
    };
    SUBST.contains = [
        STRING,
        NUMBER,
        PROMPT
    ];
    return {
        name: 'Python',
        aliases: [
            'py',
            'gyp',
            'ipython'
        ],
        unicodeRegex: true,
        keywords: KEYWORDS,
        illegal: /(<\/|->|\?)|=>/,
        contains: [
            PROMPT,
            NUMBER,
            {
                begin: /\bself\b/
            },
            {
                beginKeywords: "if",
                relevance: 0
            },
            STRING,
            COMMENT_TYPE,
            hljs.HASH_COMMENT_MODE,
            {
                match: [
                    /\bdef/, /\s+/,
                    IDENT_RE,
                ],
                scope: {
                    1: "keyword",
                    3: "title.function"
                },
                contains: [PARAMS]
            },
            {
                variants: [
                    {
                        match: [
                            /\bclass/, /\s+/,
                            IDENT_RE, /\s*/,
                            /\(\s*/, IDENT_RE, /\s*\)/
                        ],
                    },
                    {
                        match: [
                            /\bclass/, /\s+/,
                            IDENT_RE
                        ],
                    }
                ],
                scope: {
                    1: "keyword",
                    3: "title.class",
                    6: "title.class.inherited",
                }
            },
            {
                className: 'meta',
                begin: /^[\t ]*@/,
                end: /(?=#)|$/,
                contains: [
                    NUMBER,
                    PARAMS,
                    STRING
                ]
            }
        ]
    };
}
export { python as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHl0aG9uLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvcHl0aG9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN6QixNQUFNLFFBQVEsR0FBRyxvQ0FBb0MsQ0FBQztJQUN0RCxNQUFNLGNBQWMsR0FBRztRQUNyQixLQUFLO1FBQ0wsSUFBSTtRQUNKLFFBQVE7UUFDUixPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLFVBQVU7UUFDVixLQUFLO1FBQ0wsS0FBSztRQUNMLE1BQU07UUFDTixNQUFNO1FBQ04sUUFBUTtRQUNSLFNBQVM7UUFDVCxLQUFLO1FBQ0wsTUFBTTtRQUNOLFFBQVE7UUFDUixJQUFJO1FBQ0osUUFBUTtRQUNSLElBQUk7UUFDSixJQUFJO1FBQ0osUUFBUTtRQUNSLE9BQU87UUFDUCxhQUFhO1FBQ2IsS0FBSztRQUNMLElBQUk7UUFDSixNQUFNO1FBQ04sT0FBTztRQUNQLFFBQVE7UUFDUixLQUFLO1FBQ0wsT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO0tBQ1IsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFlBQVk7UUFDWixLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxPQUFPO1FBQ1AsS0FBSztRQUNMLE1BQU07UUFDTixZQUFZO1FBQ1osV0FBVztRQUNYLE9BQU87UUFDUCxVQUFVO1FBQ1YsS0FBSztRQUNMLGFBQWE7UUFDYixTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNO1FBQ04sS0FBSztRQUNMLFFBQVE7UUFDUixXQUFXO1FBQ1gsTUFB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Q04sTUFBTTtvQkFDTixNQUFNO2lCQUNQO2FBQ0Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUHl0aG9uXG5EZXNjcmlwdGlvbjogUHl0aG9uIGlzIGFuIGludGVycHJldGVkLCBvYmplY3Qtb3JpZW50ZWQsIGhpZ2gtbGV2ZWwgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2Ugd2l0aCBkeW5hbWljIHNlbWFudGljcy5cbldlYnNpdGU6IGh0dHBzOi8vd3d3LnB5dGhvbi5vcmdcbkNhdGVnb3J5OiBjb21tb25cbiovXG5cbmZ1bmN0aW9uIHB5dGhvbihobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgSURFTlRfUkUgPSAvW1xccHtYSURfU3RhcnR9X11cXHB7WElEX0NvbnRpbnVlfSovdTtcbiAgY29uc3QgUkVTRVJWRURfV09SRFMgPSBbXG4gICAgJ2FuZCcsXG4gICAgJ2FzJyxcbiAgICAnYXNzZXJ0JyxcbiAgICAnYXN5bmMnLFxuICAgICdhd2FpdCcsXG4gICAgJ2JyZWFrJyxcbiAgICAnY2FzZScsXG4gICAgJ2NsYXNzJyxcbiAgICAnY29udGludWUnLFxuICAgICdkZWYnLFxuICAgICdkZWwnLFxuICAgICdlbGlmJyxcbiAgICAnZWxzZScsXG4gICAgJ2V4Y2VwdCcsXG4gICAgJ2ZpbmFsbHknLFxuICAgICdmb3InLFxuICAgICdmcm9tJyxcbiAgICAnZ2xvYmFsJyxcbiAgICAnaWYnLFxuICAgICdpbXBvcnQnLFxuICAgICdpbicsXG4gICAgJ2lzJyxcbiAgICAnbGFtYmRhJyxcbiAgICAnbWF0Y2gnLFxuICAgICdub25sb2NhbHwxMCcsXG4gICAgJ25vdCcsXG4gICAgJ29yJyxcbiAgICAncGFzcycsXG4gICAgJ3JhaXNlJyxcbiAgICAncmV0dXJuJyxcbiAgICAndHJ5JyxcbiAgICAnd2hpbGUnLFxuICAgICd3aXRoJyxcbiAgICAneWllbGQnXG4gIF07XG5cbiAgY29uc3QgQlVJTFRfSU5TID0gW1xuICAgICdfX2ltcG9ydF9fJyxcbiAgICAnYWJzJyxcbiAgICAnYWxsJyxcbiAgICAnYW55JyxcbiAgICAnYXNjaWknLFxuICAgICdiaW4nLFxuICAgICdib29sJyxcbiAgICAnYnJlYWtwb2ludCcsXG4gICAgJ2J5dGVhcnJheScsXG4gICAgJ2J5dGVzJyxcbiAgICAnY2FsbGFibGUnLFxuICAgICdjaHInLFxuICAgICdjbGFzc21ldGhvZCcsXG4gICAgJ2NvbXBpbGUnLFxuICAgICdjb21wbGV4JyxcbiAgICAnZGVsYXR0cicsXG4gICAgJ2RpY3QnLFxuICAgICdkaXInLFxuICAgICdkaXZtb2QnLFxuICAgICdlbnVtZXJhdGUnLFxuICAgICdldmFsJyxcbiAgICAnZXhlYycsXG4gICAgJ2ZpbHRlcicsXG4gICAgJ2Zsb2F0JyxcbiAgICAnZm9ybWF0JyxcbiAgICAnZnJvemVuc2V0JyxcbiAgICAnZ2V0YXR0cicsXG4gICAgJ2dsb2JhbHMnLFxuICAgICdoYXNhdHRyJyxcbiAgICAnaGFzaCcsXG4gICAgJ2hlbHAnLFxuICAgICdoZXgnLFxuICAgICdpZCcsXG4gICAgJ2lucHV0JyxcbiAgICAnaW50JyxcbiAgICAnaXNpbnN0YW5jZScsXG4gICAgJ2lzc3ViY2xhc3MnLFxuICAgICdpdGVyJyxcbiAgICAnbGVuJyxcbiAgICAnbGlzdCcsXG4gICAgJ2xvY2FscycsXG4gICAgJ21hcCcsXG4gICAgJ21heCcsXG4gICAgJ21lbW9yeXZpZXcnLFxuICAgICdtaW4nLFxuICAgICduZXh0JyxcbiAgICAnb2JqZWN0JyxcbiAgICAnb2N0JyxcbiAgICAnb3BlbicsXG4gICAgJ29yZCcsXG4gICAgJ3BvdycsXG4gICAgJ3ByaW50JyxcbiAgICAncHJvcGVydHknLFxuICAgICdyYW5nZScsXG4gICAgJ3JlcHInLFxuICAgICdyZXZlcnNlZCcsXG4gICAgJ3JvdW5kJyxcbiAgICAnc2V0JyxcbiAgICAnc2V0YXR0cicsXG4gICAgJ3NsaWNlJyxcbiAgICAnc29ydGVkJyxcbiAgICAnc3RhdGljbWV0aG9kJyxcbiAgICAnc3RyJyxcbiAgICAnc3VtJyxcbiAgICAnc3VwZXInLFxuICAgICd0dXBsZScsXG4gICAgJ3R5cGUnLFxuICAgICd2YXJzJyxcbiAgICAnemlwJ1xuICBdO1xuXG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgICdfX2RlYnVnX18nLFxuICAgICdFbGxpcHNpcycsXG4gICAgJ0ZhbHNlJyxcbiAgICAnTm9uZScsXG4gICAgJ05vdEltcGxlbWVudGVkJyxcbiAgICAnVHJ1ZSdcbiAgXTtcblxuICAvLyBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2xpYnJhcnkvdHlwaW5nLmh0bWxcbiAgLy8gVE9ETzogQ291bGQgdGhlc2UgYmUgc3VwcGxlbWVudGVkIGJ5IGEgQ2FtZWxDYXNlIG1hdGNoZXIgaW4gY2VydGFpblxuICAvLyBjb250ZXh0cywgbGVhdmluZyB0aGVzZSByZW1haW5pbmcgb25seSBmb3IgcmVsZXZhbmNlIGhpbnRpbmc/XG4gIGNvbnN0IFRZUEVTID0gW1xuICAgIFwiQW55XCIsXG4gICAgXCJDYWxsYWJsZVwiLFxuICAgIFwiQ29yb3V0aW5lXCIsXG4gICAgXCJEaWN0XCIsXG4gICAgXCJMaXN0XCIsXG4gICAgXCJMaXRlcmFsXCIsXG4gICAgXCJHZW5lcmljXCIsXG4gICAgXCJPcHRpb25hbFwiLFxuICAgIFwiU2VxdWVuY2VcIixcbiAgICBcIlNldFwiLFxuICAgIFwiVHVwbGVcIixcbiAgICBcIlR5cGVcIixcbiAgICBcIlVuaW9uXCJcbiAgXTtcblxuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICAkcGF0dGVybjogL1tBLVphLXpdXFx3K3xfX1xcdytfXy8sXG4gICAga2V5d29yZDogUkVTRVJWRURfV09SRFMsXG4gICAgYnVpbHRfaW46IEJVSUxUX0lOUyxcbiAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICB0eXBlOiBUWVBFU1xuICB9O1xuXG4gIGNvbnN0IFBST01QVCA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBiZWdpbjogL14oPj4+fFxcLlxcLlxcLikgL1xuICB9O1xuXG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogL1xcey8sXG4gICAgZW5kOiAvXFx9LyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogLyMvXG4gIH07XG5cbiAgY29uc3QgTElURVJBTF9CUkFDS0VUID0ge1xuICAgIGJlZ2luOiAvXFx7XFx7LyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXSxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogLyhbdVVdfFtiQl18W3JSXXxbYkJdW3JSXXxbclJdW2JCXSk/JycnLyxcbiAgICAgICAgZW5kOiAvJycnLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgICAgUFJPTVBUXG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvKFt1VV18W2JCXXxbclJdfFtiQl1bclJdfFtyUl1bYkJdKT9cIlwiXCIvLFxuICAgICAgICBlbmQ6IC9cIlwiXCIvLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICBQUk9NUFRcbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC8oW2ZGXVtyUl18W3JSXVtmRl18W2ZGXSknJycvLFxuICAgICAgICBlbmQ6IC8nJycvLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICBQUk9NUFQsXG4gICAgICAgICAgTElURVJBTF9CUkFDS0VULFxuICAgICAgICAgIFNVQlNUXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvKFtmRl1bclJdfFtyUl1bZkZdfFtmRl0pXCJcIlwiLyxcbiAgICAgICAgZW5kOiAvXCJcIlwiLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgICAgUFJPTVBULFxuICAgICAgICAgIExJVEVSQUxfQlJBQ0tFVCxcbiAgICAgICAgICBTVUJTVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLyhbdVVdfFtyUl0pJy8sXG4gICAgICAgIGVuZDogLycvLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLyhbdVVdfFtyUl0pXCIvLFxuICAgICAgICBlbmQ6IC9cIi8sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvKFtiQl18W2JCXVtyUl18W3JSXVtiQl0pJy8sXG4gICAgICAgIGVuZDogLycvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLyhbYkJdfFtiQl1bclJdfFtyUl1bYkJdKVwiLyxcbiAgICAgICAgZW5kOiAvXCIvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLyhbZkZdW3JSXXxbclJdW2ZGXXxbZkZdKScvLFxuICAgICAgICBlbmQ6IC8nLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgICAgTElURVJBTF9CUkFDS0VULFxuICAgICAgICAgIFNVQlNUXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvKFtmRl1bclJdfFtyUl1bZkZdfFtmRl0pXCIvLFxuICAgICAgICBlbmQ6IC9cIi8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgIExJVEVSQUxfQlJBQ0tFVCxcbiAgICAgICAgICBTVUJTVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERVxuICAgIF1cbiAgfTtcblxuICAvLyBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zLjkvcmVmZXJlbmNlL2xleGljYWxfYW5hbHlzaXMuaHRtbCNudW1lcmljLWxpdGVyYWxzXG4gIGNvbnN0IGRpZ2l0cGFydCA9ICdbMC05XShfP1swLTldKSonO1xuICBjb25zdCBwb2ludGZsb2F0ID0gYChcXFxcYigke2RpZ2l0cGFydH0pKT9cXFxcLigke2RpZ2l0cGFydH0pfFxcXFxiKCR7ZGlnaXRwYXJ0fSlcXFxcLmA7XG4gIC8vIFdoaXRlc3BhY2UgYWZ0ZXIgYSBudW1iZXIgKG9yIGFueSBsZXhpY2FsIHRva2VuKSBpcyBuZWVkZWQgb25seSBpZiBpdHMgYWJzZW5jZVxuICAvLyB3b3VsZCBjaGFuZ2UgdGhlIHRva2VuaXphdGlvblxuICAvLyBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zLjkvcmVmZXJlbmNlL2xleGljYWxfYW5hbHlzaXMuaHRtbCN3aGl0ZXNwYWNlLWJldHdlZW4tdG9rZW5zXG4gIC8vIFdlIGRldmlhdGUgc2xpZ2h0bHksIHJlcXVpcmluZyBhIHdvcmQgYm91bmRhcnkgb3IgYSBrZXl3b3JkXG4gIC8vIHRvIGF2b2lkIGFjY2lkZW50YWxseSByZWNvZ25pemluZyAqcHJlZml4ZXMqIChlLmcuLCBgMGAgaW4gYDB4NDFgIG9yIGAwOGAgb3IgYDBfXzFgKVxuICBjb25zdCBsb29rYWhlYWQgPSBgXFxcXGJ8JHtSRVNFUlZFRF9XT1JEUy5qb2luKCd8Jyl9YDtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICAvLyBleHBvbmVudGZsb2F0LCBwb2ludGZsb2F0XG4gICAgICAvLyBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zLjkvcmVmZXJlbmNlL2xleGljYWxfYW5hbHlzaXMuaHRtbCNmbG9hdGluZy1wb2ludC1saXRlcmFsc1xuICAgICAgLy8gb3B0aW9uYWxseSBpbWFnaW5hcnlcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMuOS9yZWZlcmVuY2UvbGV4aWNhbF9hbmFseXNpcy5odG1sI2ltYWdpbmFyeS1saXRlcmFsc1xuICAgICAgLy8gTm90ZTogbm8gbGVhZGluZyBcXGIgYmVjYXVzZSBmbG9hdHMgY2FuIHN0YXJ0IHdpdGggYSBkZWNpbWFsIHBvaW50XG4gICAgICAvLyBhbmQgd2UgZG9uJ3Qgd2FudCB0byBtaXNoYW5kbGUgZS5nLiBgZm4oLjUpYCxcbiAgICAgIC8vIG5vIHRyYWlsaW5nIFxcYiBmb3IgcG9pbnRmbG9hdCBiZWNhdXNlIGl0IGNhbiBlbmQgd2l0aCBhIGRlY2ltYWwgcG9pbnRcbiAgICAgIC8vIGFuZCB3ZSBkb24ndCB3YW50IHRvIG1pc2hhbmRsZSBlLmcuIGAwLi5oZXgoKWA7IHRoaXMgc2hvdWxkIGJlIHNhZmVcbiAgICAgIC8vIGJlY2F1c2UgYm90aCBNVVNUIGNvbnRhaW4gYSBkZWNpbWFsIHBvaW50IGFuZCBzbyBjYW5ub3QgYmUgY29uZnVzZWQgd2l0aFxuICAgICAgLy8gdGhlIGludGVyaW9yIHBhcnQgb2YgYW4gaWRlbnRpZmllclxuICAgICAge1xuICAgICAgICBiZWdpbjogYChcXFxcYigke2RpZ2l0cGFydH0pfCgke3BvaW50ZmxvYXR9KSlbZUVdWystXT8oJHtkaWdpdHBhcnR9KVtqSl0/KD89JHtsb29rYWhlYWR9KWBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBgKCR7cG9pbnRmbG9hdH0pW2pKXT9gXG4gICAgICB9LFxuXG4gICAgICAvLyBkZWNpbnRlZ2VyLCBiaW5pbnRlZ2VyLCBvY3RpbnRlZ2VyLCBoZXhpbnRlZ2VyXG4gICAgICAvLyBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zLjkvcmVmZXJlbmNlL2xleGljYWxfYW5hbHlzaXMuaHRtbCNpbnRlZ2VyLWxpdGVyYWxzXG4gICAgICAvLyBvcHRpb25hbGx5IFwibG9uZ1wiIGluIFB5dGhvbiAyXG4gICAgICAvLyBodHRwczovL2RvY3MucHl0aG9uLm9yZy8yLjcvcmVmZXJlbmNlL2xleGljYWxfYW5hbHlzaXMuaHRtbCNpbnRlZ2VyLWFuZC1sb25nLWludGVnZXItbGl0ZXJhbHNcbiAgICAgIC8vIGRlY2ludGVnZXIgaXMgb3B0aW9uYWxseSBpbWFnaW5hcnlcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMuOS9yZWZlcmVuY2UvbGV4aWNhbF9hbmFseXNpcy5odG1sI2ltYWdpbmFyeS1saXRlcmFsc1xuICAgICAge1xuICAgICAgICBiZWdpbjogYFxcXFxiKFsxLTldKF8/WzAtOV0pKnwwKyhfPzApKilbbExqSl0/KD89JHtsb29rYWhlYWR9KWBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBgXFxcXGIwW2JCXShfP1swMV0pK1tsTF0/KD89JHtsb29rYWhlYWR9KWBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBgXFxcXGIwW29PXShfP1swLTddKStbbExdPyg/PSR7bG9va2FoZWFkfSlgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogYFxcXFxiMFt4WF0oXz9bMC05YS1mQS1GXSkrW2xMXT8oPz0ke2xvb2thaGVhZH0pYFxuICAgICAgfSxcblxuICAgICAgLy8gaW1hZ251bWJlciAoZGlnaXRwYXJ0LWJhc2VkKVxuICAgICAgLy8gaHR0cHM6Ly9kb2NzLnB5dGhvbi5vcmcvMy45L3JlZmVyZW5jZS9sZXhpY2FsX2FuYWx5c2lzLmh0bWwjaW1hZ2luYXJ5LWxpdGVyYWxzXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBgXFxcXGIoJHtkaWdpdHBhcnR9KVtqSl0oPz0ke2xvb2thaGVhZH0pYFxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgY29uc3QgQ09NTUVOVF9UWVBFID0ge1xuICAgIGNsYXNzTmFtZTogXCJjb21tZW50XCIsXG4gICAgYmVnaW46IHJlZ2V4Lmxvb2thaGVhZCgvIyB0eXBlOi8pLFxuICAgIGVuZDogLyQvLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgeyAvLyBwcmV2ZW50IGtleXdvcmRzIGZyb20gY29sb3JpbmcgYHR5cGVgXG4gICAgICAgIGJlZ2luOiAvIyB0eXBlOi9cbiAgICAgIH0sXG4gICAgICAvLyBjb21tZW50IHdpdGhpbiBhIGRhdGF0eXBlIGNvbW1lbnQgaW5jbHVkZXMgbm8ga2V5d29yZHNcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC8jLyxcbiAgICAgICAgZW5kOiAvXFxiXFxCLyxcbiAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICAvLyBFeGNsdWRlIHBhcmFtcyBpbiBmdW5jdGlvbnMgd2l0aG91dCBwYXJhbXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiBcIlwiLFxuICAgICAgICBiZWdpbjogL1xcKFxccypcXCkvLFxuICAgICAgICBza2lwOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICBQUk9NUFQsXG4gICAgICAgICAgTlVNQkVSLFxuICAgICAgICAgIFNUUklORyxcbiAgICAgICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIFNVQlNULmNvbnRhaW5zID0gW1xuICAgIFNUUklORyxcbiAgICBOVU1CRVIsXG4gICAgUFJPTVBUXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUHl0aG9uJyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAncHknLFxuICAgICAgJ2d5cCcsXG4gICAgICAnaXB5dGhvbidcbiAgICBdLFxuICAgIHVuaWNvZGVSZWdleDogdHJ1ZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogLyg8XFwvfC0+fFxcPyl8PT4vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBQUk9NUFQsXG4gICAgICBOVU1CRVIsXG4gICAgICB7XG4gICAgICAgIC8vIHZlcnkgY29tbW9uIGNvbnZlbnRpb25cbiAgICAgICAgYmVnaW46IC9cXGJzZWxmXFxiL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gZWF0IFwiaWZcIiBwcmlvciB0byBzdHJpbmcgc28gdGhhdCBpdCB3b24ndCBhY2NpZGVudGFsbHkgYmVcbiAgICAgICAgLy8gbGFiZWxlZCBhcyBhbiBmLXN0cmluZ1xuICAgICAgICBiZWdpbktleXdvcmRzOiBcImlmXCIsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIFNUUklORyxcbiAgICAgIENPTU1FTlRfVFlQRSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL1xcYmRlZi8sIC9cXHMrLyxcbiAgICAgICAgICBJREVOVF9SRSxcbiAgICAgICAgXSxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInRpdGxlLmZ1bmN0aW9uXCJcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IFsgUEFSQU1TIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgL1xcYmNsYXNzLywgL1xccysvLFxuICAgICAgICAgICAgICBJREVOVF9SRSwgL1xccyovLFxuICAgICAgICAgICAgICAvXFwoXFxzKi8sIElERU5UX1JFLC9cXHMqXFwpL1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgICAgIC9cXGJjbGFzcy8sIC9cXHMrLyxcbiAgICAgICAgICAgICAgSURFTlRfUkVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgICAgIDM6IFwidGl0bGUuY2xhc3NcIixcbiAgICAgICAgICA2OiBcInRpdGxlLmNsYXNzLmluaGVyaXRlZFwiLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46IC9eW1xcdCBdKkAvLFxuICAgICAgICBlbmQ6IC8oPz0jKXwkLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBOVU1CRVIsXG4gICAgICAgICAgUEFSQU1TLFxuICAgICAgICAgIFNUUklOR1xuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBweXRob24gYXMgZGVmYXVsdCB9O1xuIl19