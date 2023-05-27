function cpp(hljs) {
    const regex = hljs.regex;
    const C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$', { contains: [{ begin: /\\\n/ }] });
    const DECLTYPE_AUTO_RE = 'decltype\\(auto\\)';
    const NAMESPACE_RE = '[a-zA-Z_]\\w*::';
    const TEMPLATE_ARGUMENT_RE = '<[^<>]+>';
    const FUNCTION_TYPE_RE = '(?!struct)('
        + DECLTYPE_AUTO_RE + '|'
        + regex.optional(NAMESPACE_RE)
        + '[a-zA-Z_]\\w*' + regex.optional(TEMPLATE_ARGUMENT_RE)
        + ')';
    const CPP_PRIMITIVE_TYPES = {
        className: 'type',
        begin: '\\b[a-z\\d_]*_t\\b'
    };
    const CHARACTER_ESCAPES = '\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)';
    const STRINGS = {
        className: 'string',
        variants: [
            {
                begin: '(u8?|U|L)?"',
                end: '"',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                begin: '(u8?|U|L)?\'(' + CHARACTER_ESCAPES + '|.)',
                end: '\'',
                illegal: '.'
            },
            hljs.END_SAME_AS_BEGIN({
                begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                end: /\)([^()\\ ]{0,16})"/
            })
        ]
    };
    const NUMBERS = {
        className: 'number',
        variants: [
            { begin: '\\b(0b[01\']+)' },
            { begin: '(-?)\\b([\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)' },
            { begin: '(-?)(\\b0[xX][a-fA-F0-9\']+|(\\b[\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)([eE][-+]?[\\d\']+)?)' }
        ],
        relevance: 0
    };
    const PREPROCESSOR = {
        className: 'meta',
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: { keyword: 'if else elif endif define undef warning error line '
                + 'pragma _Pragma ifdef ifndef include' },
        contains: [
            {
                begin: /\\\n/,
                relevance: 0
            },
            hljs.inherit(STRINGS, { className: 'string' }),
            {
                className: 'string',
                begin: /<.*?>/
            },
            C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ]
    };
    const TITLE_MODE = {
        className: 'title',
        begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
        relevance: 0
    };
    const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + '\\s*\\(';
    const RESERVED_KEYWORDS = [
        'alignas',
        'alignof',
        'and',
        'and_eq',
        'asm',
        'atomic_cancel',
        'atomic_commit',
        'atomic_noexcept',
        'auto',
        'bitand',
        'bitor',
        'break',
        'case',
        'catch',
        'class',
        'co_await',
        'co_return',
        'co_yield',
        'compl',
        'concept',
        'const_cast|10',
        'consteval',
        'constexpr',
        'constinit',
        'continue',
        'decltype',
        'default',
        'delete',
        'do',
        'dynamic_cast|10',
        'else',
        'enum',
        'explicit',
        'export',
        'extern',
        'false',
        'final',
        'for',
        'friend',
        'goto',
        'if',
        'import',
        'inline',
        'module',
        'mutable',
        'namespace',
        'new',
        'noexcept',
        'not',
        'not_eq',
        'nullptr',
        'operator',
        'or',
        'or_eq',
        'override',
        'private',
        'protected',
        'public',
        'reflexpr',
        'register',
        'reinterpret_cast|10',
        'requires',
        'return',
        'sizeof',
        'static_assert',
        'static_cast|10',
        'struct',
        'switch',
        'synchronized',
        'template',
        'this',
        'thread_local',
        'throw',
        'transaction_safe',
        'transaction_safe_dynamic',
        'true',
        'try',
        'typedef',
        'typeid',
        'typename',
        'union',
        'using',
        'virtual',
        'volatile',
        'while',
        'xor',
        'xor_eq'
    ];
    const RESERVED_TYPES = [
        'bool',
        'char',
        'char16_t',
        'char32_t',
        'char8_t',
        'double',
        'float',
        'int',
        'long',
        'short',
        'void',
        'wchar_t',
        'unsigned',
        'signed',
        'const',
        'static'
    ];
    const TYPE_HINTS = [
        'any',
        'auto_ptr',
        'barrier',
        'binary_semaphore',
        'bitset',
        'complex',
        'condition_variable',
        'condition_variable_any',
        'counting_semaphore',
        'deque',
        'false_type',
        'future',
        'imaginary',
        'initializer_list',
        'istringstream',
        'jthread',
        'latch',
        'lock_guard',
        'multimap',
        'multiset',
        'mutex',
        'optional',
        'ostringstream',
        'packaged_task',
        'pair',
        'promise',
        'priority_queue',
        'queue',
        'recursive_mutex',
        'recursive_timed_mutex',
        'scoped_lock',
        'set',
        'shared_future',
        'shared_lock',
        'shared_mutex',
        'shared_timed_mutex',
        'shared_ptr',
        'stack',
        'string_view',
        'stringstream',
        'timed_mutex',
        'thread',
        'true_type',
        'tuple',
        'unique_lock',
        'unique_ptr',
        'unordered_map',
        'unordered_multimap',
        'unordered_multiset',
        'unordered_set',
        'variant',
        'vector',
        'weak_ptr',
        'wstring',
        'wstring_view'
    ];
    const FUNCTION_HINTS = [
        'abort',
        'abs',
        'acos',
        'apply',
        'as_const',
        'asin',
        'atan',
        'atan2',
        'calloc',
        'ceil',
        'cerr',
        'cin',
        'clog',
        'cos',
        'cosh',
        'cout',
        'declval',
        'endl',
        'exchange',
        'exit',
        'exp',
        'fabs',
        'floor',
        'fmod',
        'forward',
        'fprintf',
        'fputs',
        'free',
        'frexp',
        'fscanf',
        'future',
        'invoke',
        'isalnum',
        'isalpha',
        'iscntrl',
        'isdigit',
        'isgraph',
        'islower',
        'isprint',
        'ispunct',
        'isspace',
        'isupper',
        'isxdigit',
        'labs',
        'launder',
        'ldexp',
        'log',
        'log10',
        'make_pair',
        'make_shared',
        'make_shared_for_overwrite',
        'make_tuple',
        'make_unique',
        'malloc',
        'memchr',
        'memcmp',
        'memcpy',
        'memset',
        'modf',
        'move',
        'pow',
        'printf',
        'putchar',
        'puts',
        'realloc',
        'scanf',
        'sin',
        'sinh',
        'snprintf',
        'sprintf',
        'sqrt',
        'sscanf',
        'std',
        'stderr',
        'stdin',
        'stdout',
        'strcat',
        'strchr',
        'strcmp',
        'strcpy',
        'strcspn',
        'strlen',
        'strncat',
        'strncmp',
        'strncpy',
        'strpbrk',
        'strrchr',
        'strspn',
        'strstr',
        'swap',
        'tan',
        'tanh',
        'terminate',
        'to_underlying',
        'tolower',
        'toupper',
        'vfprintf',
        'visit',
        'vprintf',
        'vsprintf'
    ];
    const LITERALS = [
        'NULL',
        'false',
        'nullopt',
        'nullptr',
        'true'
    ];
    const BUILT_IN = ['_Pragma'];
    const CPP_KEYWORDS = {
        type: RESERVED_TYPES,
        keyword: RESERVED_KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_IN,
        _type_hints: TYPE_HINTS
    };
    const FUNCTION_DISPATCH = {
        className: 'function.dispatch',
        relevance: 0,
        keywords: {
            _hint: FUNCTION_HINTS
        },
        begin: regex.concat(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!switch)/, /(?!while)/, hljs.IDENT_RE, regex.lookahead(/(<[^<>]+>|)\s*\(/))
    };
    const EXPRESSION_CONTAINS = [
        FUNCTION_DISPATCH,
        PREPROCESSOR,
        CPP_PRIMITIVE_TYPES,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        NUMBERS,
        STRINGS
    ];
    const EXPRESSION_CONTEXT = {
        variants: [
            {
                begin: /=/,
                end: /;/
            },
            {
                begin: /\(/,
                end: /\)/
            },
            {
                beginKeywords: 'new throw return else',
                end: /;/
            }
        ],
        keywords: CPP_KEYWORDS,
        contains: EXPRESSION_CONTAINS.concat([
            {
                begin: /\(/,
                end: /\)/,
                keywords: CPP_KEYWORDS,
                contains: EXPRESSION_CONTAINS.concat(['self']),
                relevance: 0
            }
        ]),
        relevance: 0
    };
    const FUNCTION_DECLARATION = {
        className: 'function',
        begin: '(' + FUNCTION_TYPE_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
        returnBegin: true,
        end: /[{;=]/,
        excludeEnd: true,
        keywords: CPP_KEYWORDS,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [
            {
                begin: DECLTYPE_AUTO_RE,
                keywords: CPP_KEYWORDS,
                relevance: 0
            },
            {
                begin: FUNCTION_TITLE,
                returnBegin: true,
                contains: [TITLE_MODE],
                relevance: 0
            },
            {
                begin: /::/,
                relevance: 0
            },
            {
                begin: /:/,
                endsWithParent: true,
                contains: [
                    STRINGS,
                    NUMBERS
                ]
            },
            {
                relevance: 0,
                match: /,/
            },
            {
                className: 'params',
                begin: /\(/,
                end: /\)/,
                keywords: CPP_KEYWORDS,
                relevance: 0,
                contains: [
                    C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    STRINGS,
                    NUMBERS,
                    CPP_PRIMITIVE_TYPES,
                    {
                        begin: /\(/,
                        end: /\)/,
                        keywords: CPP_KEYWORDS,
                        relevance: 0,
                        contains: [
                            'self',
                            C_LINE_COMMENT_MODE,
                            hljs.C_BLOCK_COMMENT_MODE,
                            STRINGS,
                            NUMBERS,
                            CPP_PRIMITIVE_TYPES
                        ]
                    }
                ]
            },
            CPP_PRIMITIVE_TYPES,
            C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            PREPROCESSOR
        ]
    };
    return {
        name: 'C++',
        aliases: [
            'cc',
            'c++',
            'h++',
            'hpp',
            'hh',
            'hxx',
            'cxx'
        ],
        keywords: CPP_KEYWORDS,
        illegal: '</',
        classNameAliases: { 'function.dispatch': 'built_in' },
        contains: [].concat(EXPRESSION_CONTEXT, FUNCTION_DECLARATION, FUNCTION_DISPATCH, EXPRESSION_CONTAINS, [
            PREPROCESSOR,
            {
                begin: '\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)',
                end: '>',
                keywords: CPP_KEYWORDS,
                contains: [
                    'self',
                    CPP_PRIMITIVE_TYPES
                ]
            },
            {
                begin: hljs.IDENT_RE + '::',
                keywords: CPP_KEYWORDS
            },
            {
                match: [
                    /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
                    /\s+/,
                    /\w+/
                ],
                className: {
                    1: 'keyword',
                    3: 'title.class'
                }
            }
        ])
    };
}
export { cpp as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3BwLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvY3BwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBSXpCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUUsRUFBRSxDQUFDLENBQUM7SUFDekYsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQztJQUM5QyxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQztJQUN2QyxNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztJQUN4QyxNQUFNLGdCQUFnQixHQUFHLGFBQWE7VUFDbEMsZ0JBQWdCLEdBQUcsR0FBRztVQUN0QixLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztVQUM1QixlQUFlLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztVQUN4RCxHQUFHLENBQUM7SUFFTixNQUFNLG1CQUFtQixHQUFHO1FBQzFCLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLEtBQUssRUFBRSxvQkFBb0I7S0FDNUIsQ0FBQztJQUlGLE1BQU0saUJBQWlCLEdBQUcsc0RBQXNELENBQUM7SUFDakYsTUFBTSxPQUFPLEdBQUc7UUFDZCxTQUFTLEVBQUUsUUFBUTtRQUNuQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsYUFBYTtnQkFDcEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsUUFBUSxFQUFFLENBQUUsSUFB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RSwyTUFBMk07Z0JBQ2xOLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUU7b0JBQ1IsTUFBTTtvQkFDTixtQkFBbUI7aUJBQ3BCO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO2dCQUMzQixRQUFRLEVBQUUsWUFBWTthQUN2QjtZQUNEO2dCQUNFLEtBQUssRUFBRTtvQkFFTCx1REFBdUQ7b0JBQ3ZELEtBQUs7b0JBQ0wsS0FBSztpQkFDTjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsQ0FBQyxFQUFFLFNBQVM7b0JBQ1osQ0FBQyxFQUFFLGFBQWE7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDO0tBQ0wsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBDKytcbkNhdGVnb3J5OiBjb21tb24sIHN5c3RlbVxuV2Vic2l0ZTogaHR0cHM6Ly9pc29jcHAub3JnXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gY3BwKGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICAvLyBhZGRlZCBmb3IgaGlzdG9yaWMgcmVhc29ucyBiZWNhdXNlIGBobGpzLkNfTElORV9DT01NRU5UX01PREVgIGRvZXNcbiAgLy8gbm90IGluY2x1ZGUgc3VjaCBzdXBwb3J0IG5vciBjYW4gd2UgYmUgc3VyZSBhbGwgdGhlIGdyYW1tYXJzIGRlcGVuZGluZ1xuICAvLyBvbiBpdCB3b3VsZCBkZXNpcmUgdGhpcyBiZWhhdmlvclxuICBjb25zdCBDX0xJTkVfQ09NTUVOVF9NT0RFID0gaGxqcy5DT01NRU5UKCcvLycsICckJywgeyBjb250YWluczogWyB7IGJlZ2luOiAvXFxcXFxcbi8gfSBdIH0pO1xuICBjb25zdCBERUNMVFlQRV9BVVRPX1JFID0gJ2RlY2x0eXBlXFxcXChhdXRvXFxcXCknO1xuICBjb25zdCBOQU1FU1BBQ0VfUkUgPSAnW2EtekEtWl9dXFxcXHcqOjonO1xuICBjb25zdCBURU1QTEFURV9BUkdVTUVOVF9SRSA9ICc8W148Pl0rPic7XG4gIGNvbnN0IEZVTkNUSU9OX1RZUEVfUkUgPSAnKD8hc3RydWN0KSgnXG4gICAgKyBERUNMVFlQRV9BVVRPX1JFICsgJ3wnXG4gICAgKyByZWdleC5vcHRpb25hbChOQU1FU1BBQ0VfUkUpXG4gICAgKyAnW2EtekEtWl9dXFxcXHcqJyArIHJlZ2V4Lm9wdGlvbmFsKFRFTVBMQVRFX0FSR1VNRU5UX1JFKVxuICArICcpJztcblxuICBjb25zdCBDUFBfUFJJTUlUSVZFX1RZUEVTID0ge1xuICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgIGJlZ2luOiAnXFxcXGJbYS16XFxcXGRfXSpfdFxcXFxiJ1xuICB9O1xuXG4gIC8vIGh0dHBzOi8vZW4uY3BwcmVmZXJlbmNlLmNvbS93L2NwcC9sYW5ndWFnZS9lc2NhcGVcbiAgLy8gXFxcXCBcXHggXFx4RkYgXFx1MjgzNyBcXHUwMDMyMzc0NyBcXDM3NFxuICBjb25zdCBDSEFSQUNURVJfRVNDQVBFUyA9ICdcXFxcXFxcXCh4WzAtOUEtRmEtZl17Mn18dVswLTlBLUZhLWZdezQsOH18WzAtN117M318XFxcXFMpJztcbiAgY29uc3QgU1RSSU5HUyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnKHU4P3xVfEwpP1wiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICcodTg/fFV8TCk/XFwnKCcgKyBDSEFSQUNURVJfRVNDQVBFUyArICd8LiknLFxuICAgICAgICBlbmQ6ICdcXCcnLFxuICAgICAgICBpbGxlZ2FsOiAnLidcbiAgICAgIH0sXG4gICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgYmVnaW46IC8oPzp1OD98VXxMKT9SXCIoW14oKVxcXFwgXXswLDE2fSlcXCgvLFxuICAgICAgICBlbmQ6IC9cXCkoW14oKVxcXFwgXXswLDE2fSlcIi9cbiAgICAgIH0pXG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IE5VTUJFUlMgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ1xcXFxiKDBiWzAxXFwnXSspJyB9LFxuICAgICAgeyBiZWdpbjogJygtPylcXFxcYihbXFxcXGRcXCddKyhcXFxcLltcXFxcZFxcJ10qKT98XFxcXC5bXFxcXGRcXCddKykoKGxsfExMfGx8TCkodXxVKT98KHV8VSkobGx8TEx8bHxMKT98ZnxGfGJ8QiknIH0sXG4gICAgICB7IGJlZ2luOiAnKC0/KShcXFxcYjBbeFhdW2EtZkEtRjAtOVxcJ10rfChcXFxcYltcXFxcZFxcJ10rKFxcXFwuW1xcXFxkXFwnXSopP3xcXFxcLltcXFxcZFxcJ10rKShbZUVdWy0rXT9bXFxcXGRcXCddKyk/KScgfVxuICAgIF0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgUFJFUFJPQ0VTU09SID0ge1xuICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgIGJlZ2luOiAvI1xccypbYS16XStcXGIvLFxuICAgIGVuZDogLyQvLFxuICAgIGtleXdvcmRzOiB7IGtleXdvcmQ6XG4gICAgICAgICdpZiBlbHNlIGVsaWYgZW5kaWYgZGVmaW5lIHVuZGVmIHdhcm5pbmcgZXJyb3IgbGluZSAnXG4gICAgICAgICsgJ3ByYWdtYSBfUHJhZ21hIGlmZGVmIGlmbmRlZiBpbmNsdWRlJyB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxcXFxcbi8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuaW5oZXJpdChTVFJJTkdTLCB7IGNsYXNzTmFtZTogJ3N0cmluZycgfSksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAvPC4qPz4vXG4gICAgICB9LFxuICAgICAgQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgVElUTEVfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgYmVnaW46IHJlZ2V4Lm9wdGlvbmFsKE5BTUVTUEFDRV9SRSkgKyBobGpzLklERU5UX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IEZVTkNUSU9OX1RJVExFID0gcmVnZXgub3B0aW9uYWwoTkFNRVNQQUNFX1JFKSArIGhsanMuSURFTlRfUkUgKyAnXFxcXHMqXFxcXCgnO1xuXG4gIC8vIGh0dHBzOi8vZW4uY3BwcmVmZXJlbmNlLmNvbS93L2NwcC9rZXl3b3JkXG4gIGNvbnN0IFJFU0VSVkVEX0tFWVdPUkRTID0gW1xuICAgICdhbGlnbmFzJyxcbiAgICAnYWxpZ25vZicsXG4gICAgJ2FuZCcsXG4gICAgJ2FuZF9lcScsXG4gICAgJ2FzbScsXG4gICAgJ2F0b21pY19jYW5jZWwnLFxuICAgICdhdG9taWNfY29tbWl0JyxcbiAgICAnYXRvbWljX25vZXhjZXB0JyxcbiAgICAnYXV0bycsXG4gICAgJ2JpdGFuZCcsXG4gICAgJ2JpdG9yJyxcbiAgICAnYnJlYWsnLFxuICAgICdjYXNlJyxcbiAgICAnY2F0Y2gnLFxuICAgICdjbGFzcycsXG4gICAgJ2NvX2F3YWl0JyxcbiAgICAnY29fcmV0dXJuJyxcbiAgICAnY29feWllbGQnLFxuICAgICdjb21wbCcsXG4gICAgJ2NvbmNlcHQnLFxuICAgICdjb25zdF9jYXN0fDEwJyxcbiAgICAnY29uc3RldmFsJyxcbiAgICAnY29uc3RleHByJyxcbiAgICAnY29uc3Rpbml0JyxcbiAgICAnY29udGludWUnLFxuICAgICdkZWNsdHlwZScsXG4gICAgJ2RlZmF1bHQnLFxuICAgICdkZWxldGUnLFxuICAgICdkbycsXG4gICAgJ2R5bmFtaWNfY2FzdHwxMCcsXG4gICAgJ2Vsc2UnLFxuICAgICdlbnVtJyxcbiAgICAnZXhwbGljaXQnLFxuICAgICdleHBvcnQnLFxuICAgICdleHRlcm4nLFxuICAgICdmYWxzZScsXG4gICAgJ2ZpbmFsJyxcbiAgICAnZm9yJyxcbiAgICAnZnJpZW5kJyxcbiAgICAnZ290bycsXG4gICAgJ2lmJyxcbiAgICAnaW1wb3J0JyxcbiAgICAnaW5saW5lJyxcbiAgICAnbW9kdWxlJyxcbiAgICAnbXV0YWJsZScsXG4gICAgJ25hbWVzcGFjZScsXG4gICAgJ25ldycsXG4gICAgJ25vZXhjZXB0JyxcbiAgICAnbm90JyxcbiAgICAnbm90X2VxJyxcbiAgICAnbnVsbHB0cicsXG4gICAgJ29wZXJhdG9yJyxcbiAgICAnb3InLFxuICAgICdvcl9lcScsXG4gICAgJ292ZXJyaWRlJyxcbiAgICAncHJpdmF0ZScsXG4gICAgJ3Byb3RlY3RlZCcsXG4gICAgJ3B1YmxpYycsXG4gICAgJ3JlZmxleHByJyxcbiAgICAncmVnaXN0ZXInLFxuICAgICdyZWludGVycHJldF9jYXN0fDEwJyxcbiAgICAncmVxdWlyZXMnLFxuICAgICdyZXR1cm4nLFxuICAgICdzaXplb2YnLFxuICAgICdzdGF0aWNfYXNzZXJ0JyxcbiAgICAnc3RhdGljX2Nhc3R8MTAnLFxuICAgICdzdHJ1Y3QnLFxuICAgICdzd2l0Y2gnLFxuICAgICdzeW5jaHJvbml6ZWQnLFxuICAgICd0ZW1wbGF0ZScsXG4gICAgJ3RoaXMnLFxuICAgICd0aHJlYWRfbG9jYWwnLFxuICAgICd0aHJvdycsXG4gICAgJ3RyYW5zYWN0aW9uX3NhZmUnLFxuICAgICd0cmFuc2FjdGlvbl9zYWZlX2R5bmFtaWMnLFxuICAgICd0cnVlJyxcbiAgICAndHJ5JyxcbiAgICAndHlwZWRlZicsXG4gICAgJ3R5cGVpZCcsXG4gICAgJ3R5cGVuYW1lJyxcbiAgICAndW5pb24nLFxuICAgICd1c2luZycsXG4gICAgJ3ZpcnR1YWwnLFxuICAgICd2b2xhdGlsZScsXG4gICAgJ3doaWxlJyxcbiAgICAneG9yJyxcbiAgICAneG9yX2VxJ1xuICBdO1xuXG4gIC8vIGh0dHBzOi8vZW4uY3BwcmVmZXJlbmNlLmNvbS93L2NwcC9rZXl3b3JkXG4gIGNvbnN0IFJFU0VSVkVEX1RZUEVTID0gW1xuICAgICdib29sJyxcbiAgICAnY2hhcicsXG4gICAgJ2NoYXIxNl90JyxcbiAgICAnY2hhcjMyX3QnLFxuICAgICdjaGFyOF90JyxcbiAgICAnZG91YmxlJyxcbiAgICAnZmxvYXQnLFxuICAgICdpbnQnLFxuICAgICdsb25nJyxcbiAgICAnc2hvcnQnLFxuICAgICd2b2lkJyxcbiAgICAnd2NoYXJfdCcsXG4gICAgJ3Vuc2lnbmVkJyxcbiAgICAnc2lnbmVkJyxcbiAgICAnY29uc3QnLFxuICAgICdzdGF0aWMnXG4gIF07XG5cbiAgY29uc3QgVFlQRV9ISU5UUyA9IFtcbiAgICAnYW55JyxcbiAgICAnYXV0b19wdHInLFxuICAgICdiYXJyaWVyJyxcbiAgICAnYmluYXJ5X3NlbWFwaG9yZScsXG4gICAgJ2JpdHNldCcsXG4gICAgJ2NvbXBsZXgnLFxuICAgICdjb25kaXRpb25fdmFyaWFibGUnLFxuICAgICdjb25kaXRpb25fdmFyaWFibGVfYW55JyxcbiAgICAnY291bnRpbmdfc2VtYXBob3JlJyxcbiAgICAnZGVxdWUnLFxuICAgICdmYWxzZV90eXBlJyxcbiAgICAnZnV0dXJlJyxcbiAgICAnaW1hZ2luYXJ5JyxcbiAgICAnaW5pdGlhbGl6ZXJfbGlzdCcsXG4gICAgJ2lzdHJpbmdzdHJlYW0nLFxuICAgICdqdGhyZWFkJyxcbiAgICAnbGF0Y2gnLFxuICAgICdsb2NrX2d1YXJkJyxcbiAgICAnbXVsdGltYXAnLFxuICAgICdtdWx0aXNldCcsXG4gICAgJ211dGV4JyxcbiAgICAnb3B0aW9uYWwnLFxuICAgICdvc3RyaW5nc3RyZWFtJyxcbiAgICAncGFja2FnZWRfdGFzaycsXG4gICAgJ3BhaXInLFxuICAgICdwcm9taXNlJyxcbiAgICAncHJpb3JpdHlfcXVldWUnLFxuICAgICdxdWV1ZScsXG4gICAgJ3JlY3Vyc2l2ZV9tdXRleCcsXG4gICAgJ3JlY3Vyc2l2ZV90aW1lZF9tdXRleCcsXG4gICAgJ3Njb3BlZF9sb2NrJyxcbiAgICAnc2V0JyxcbiAgICAnc2hhcmVkX2Z1dHVyZScsXG4gICAgJ3NoYXJlZF9sb2NrJyxcbiAgICAnc2hhcmVkX211dGV4JyxcbiAgICAnc2hhcmVkX3RpbWVkX211dGV4JyxcbiAgICAnc2hhcmVkX3B0cicsXG4gICAgJ3N0YWNrJyxcbiAgICAnc3RyaW5nX3ZpZXcnLFxuICAgICdzdHJpbmdzdHJlYW0nLFxuICAgICd0aW1lZF9tdXRleCcsXG4gICAgJ3RocmVhZCcsXG4gICAgJ3RydWVfdHlwZScsXG4gICAgJ3R1cGxlJyxcbiAgICAndW5pcXVlX2xvY2snLFxuICAgICd1bmlxdWVfcHRyJyxcbiAgICAndW5vcmRlcmVkX21hcCcsXG4gICAgJ3Vub3JkZXJlZF9tdWx0aW1hcCcsXG4gICAgJ3Vub3JkZXJlZF9tdWx0aXNldCcsXG4gICAgJ3Vub3JkZXJlZF9zZXQnLFxuICAgICd2YXJpYW50JyxcbiAgICAndmVjdG9yJyxcbiAgICAnd2Vha19wdHInLFxuICAgICd3c3RyaW5nJyxcbiAgICAnd3N0cmluZ192aWV3J1xuICBdO1xuXG4gIGNvbnN0IEZVTkNUSU9OX0hJTlRTID0gW1xuICAgICdhYm9ydCcsXG4gICAgJ2FicycsXG4gICAgJ2Fjb3MnLFxuICAgICdhcHBseScsXG4gICAgJ2FzX2NvbnN0JyxcbiAgICAnYXNpbicsXG4gICAgJ2F0YW4nLFxuICAgICdhdGFuMicsXG4gICAgJ2NhbGxvYycsXG4gICAgJ2NlaWwnLFxuICAgICdjZXJyJyxcbiAgICAnY2luJyxcbiAgICAnY2xvZycsXG4gICAgJ2NvcycsXG4gICAgJ2Nvc2gnLFxuICAgICdjb3V0JyxcbiAgICAnZGVjbHZhbCcsXG4gICAgJ2VuZGwnLFxuICAgICdleGNoYW5nZScsXG4gICAgJ2V4aXQnLFxuICAgICdleHAnLFxuICAgICdmYWJzJyxcbiAgICAnZmxvb3InLFxuICAgICdmbW9kJyxcbiAgICAnZm9yd2FyZCcsXG4gICAgJ2ZwcmludGYnLFxuICAgICdmcHV0cycsXG4gICAgJ2ZyZWUnLFxuICAgICdmcmV4cCcsXG4gICAgJ2ZzY2FuZicsXG4gICAgJ2Z1dHVyZScsXG4gICAgJ2ludm9rZScsXG4gICAgJ2lzYWxudW0nLFxuICAgICdpc2FscGhhJyxcbiAgICAnaXNjbnRybCcsXG4gICAgJ2lzZGlnaXQnLFxuICAgICdpc2dyYXBoJyxcbiAgICAnaXNsb3dlcicsXG4gICAgJ2lzcHJpbnQnLFxuICAgICdpc3B1bmN0JyxcbiAgICAnaXNzcGFjZScsXG4gICAgJ2lzdXBwZXInLFxuICAgICdpc3hkaWdpdCcsXG4gICAgJ2xhYnMnLFxuICAgICdsYXVuZGVyJyxcbiAgICAnbGRleHAnLFxuICAgICdsb2cnLFxuICAgICdsb2cxMCcsXG4gICAgJ21ha2VfcGFpcicsXG4gICAgJ21ha2Vfc2hhcmVkJyxcbiAgICAnbWFrZV9zaGFyZWRfZm9yX292ZXJ3cml0ZScsXG4gICAgJ21ha2VfdHVwbGUnLFxuICAgICdtYWtlX3VuaXF1ZScsXG4gICAgJ21hbGxvYycsXG4gICAgJ21lbWNocicsXG4gICAgJ21lbWNtcCcsXG4gICAgJ21lbWNweScsXG4gICAgJ21lbXNldCcsXG4gICAgJ21vZGYnLFxuICAgICdtb3ZlJyxcbiAgICAncG93JyxcbiAgICAncHJpbnRmJyxcbiAgICAncHV0Y2hhcicsXG4gICAgJ3B1dHMnLFxuICAgICdyZWFsbG9jJyxcbiAgICAnc2NhbmYnLFxuICAgICdzaW4nLFxuICAgICdzaW5oJyxcbiAgICAnc25wcmludGYnLFxuICAgICdzcHJpbnRmJyxcbiAgICAnc3FydCcsXG4gICAgJ3NzY2FuZicsXG4gICAgJ3N0ZCcsXG4gICAgJ3N0ZGVycicsXG4gICAgJ3N0ZGluJyxcbiAgICAnc3Rkb3V0JyxcbiAgICAnc3RyY2F0JyxcbiAgICAnc3RyY2hyJyxcbiAgICAnc3RyY21wJyxcbiAgICAnc3RyY3B5JyxcbiAgICAnc3RyY3NwbicsXG4gICAgJ3N0cmxlbicsXG4gICAgJ3N0cm5jYXQnLFxuICAgICdzdHJuY21wJyxcbiAgICAnc3RybmNweScsXG4gICAgJ3N0cnBicmsnLFxuICAgICdzdHJyY2hyJyxcbiAgICAnc3Ryc3BuJyxcbiAgICAnc3Ryc3RyJyxcbiAgICAnc3dhcCcsXG4gICAgJ3RhbicsXG4gICAgJ3RhbmgnLFxuICAgICd0ZXJtaW5hdGUnLFxuICAgICd0b191bmRlcmx5aW5nJyxcbiAgICAndG9sb3dlcicsXG4gICAgJ3RvdXBwZXInLFxuICAgICd2ZnByaW50ZicsXG4gICAgJ3Zpc2l0JyxcbiAgICAndnByaW50ZicsXG4gICAgJ3ZzcHJpbnRmJ1xuICBdO1xuXG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgICdOVUxMJyxcbiAgICAnZmFsc2UnLFxuICAgICdudWxsb3B0JyxcbiAgICAnbnVsbHB0cicsXG4gICAgJ3RydWUnXG4gIF07XG5cbiAgLy8gaHR0cHM6Ly9lbi5jcHByZWZlcmVuY2UuY29tL3cvY3BwL2tleXdvcmRcbiAgY29uc3QgQlVJTFRfSU4gPSBbICdfUHJhZ21hJyBdO1xuXG4gIGNvbnN0IENQUF9LRVlXT1JEUyA9IHtcbiAgICB0eXBlOiBSRVNFUlZFRF9UWVBFUyxcbiAgICBrZXl3b3JkOiBSRVNFUlZFRF9LRVlXT1JEUyxcbiAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICBidWlsdF9pbjogQlVJTFRfSU4sXG4gICAgX3R5cGVfaGludHM6IFRZUEVfSElOVFNcbiAgfTtcblxuICBjb25zdCBGVU5DVElPTl9ESVNQQVRDSCA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbi5kaXNwYXRjaCcsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAvLyBPbmx5IGZvciByZWxldmFuY2UsIG5vdCBoaWdobGlnaHRpbmcuXG4gICAgICBfaGludDogRlVOQ1RJT05fSElOVFMgfSxcbiAgICBiZWdpbjogcmVnZXguY29uY2F0KFxuICAgICAgL1xcYi8sXG4gICAgICAvKD8hZGVjbHR5cGUpLyxcbiAgICAgIC8oPyFpZikvLFxuICAgICAgLyg/IWZvcikvLFxuICAgICAgLyg/IXN3aXRjaCkvLFxuICAgICAgLyg/IXdoaWxlKS8sXG4gICAgICBobGpzLklERU5UX1JFLFxuICAgICAgcmVnZXgubG9va2FoZWFkKC8oPFtePD5dKz58KVxccypcXCgvKSlcbiAgfTtcblxuICBjb25zdCBFWFBSRVNTSU9OX0NPTlRBSU5TID0gW1xuICAgIEZVTkNUSU9OX0RJU1BBVENILFxuICAgIFBSRVBST0NFU1NPUixcbiAgICBDUFBfUFJJTUlUSVZFX1RZUEVTLFxuICAgIENfTElORV9DT01NRU5UX01PREUsXG4gICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICBOVU1CRVJTLFxuICAgIFNUUklOR1NcbiAgXTtcblxuICBjb25zdCBFWFBSRVNTSU9OX0NPTlRFWFQgPSB7XG4gICAgLy8gVGhpcyBtb2RlIGNvdmVycyBleHByZXNzaW9uIGNvbnRleHQgd2hlcmUgd2UgY2FuJ3QgZXhwZWN0IGEgZnVuY3Rpb25cbiAgICAvLyBkZWZpbml0aW9uIGFuZCBzaG91bGRuJ3QgaGlnaGxpZ2h0IGFueXRoaW5nIHRoYXQgbG9va3MgbGlrZSBvbmU6XG4gICAgLy8gYHJldHVybiBzb21lKClgLCBgZWxzZSBpZigpYCwgYCh4KnN1bSgxLCAyKSlgXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC89LyxcbiAgICAgICAgZW5kOiAvOy9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgZW5kOiAvXFwpL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ25ldyB0aHJvdyByZXR1cm4gZWxzZScsXG4gICAgICAgIGVuZDogLzsvXG4gICAgICB9XG4gICAgXSxcbiAgICBrZXl3b3JkczogQ1BQX0tFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBFWFBSRVNTSU9OX0NPTlRBSU5TLmNvbmNhdChbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICAgICAgY29udGFpbnM6IEVYUFJFU1NJT05fQ09OVEFJTlMuY29uY2F0KFsgJ3NlbGYnIF0pLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdKSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBGVU5DVElPTl9ERUNMQVJBVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgYmVnaW46ICcoJyArIEZVTkNUSU9OX1RZUEVfUkUgKyAnW1xcXFwqJlxcXFxzXSspKycgKyBGVU5DVElPTl9USVRMRSxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICBlbmQ6IC9bezs9XS8sXG4gICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3JkczogQ1BQX0tFWVdPUkRTLFxuICAgIGlsbGVnYWw6IC9bXlxcd1xcc1xcKiY6PD4uXS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHsgLy8gdG8gcHJldmVudCBpdCBmcm9tIGJlaW5nIGNvbmZ1c2VkIGFzIHRoZSBmdW5jdGlvbiB0aXRsZVxuICAgICAgICBiZWdpbjogREVDTFRZUEVfQVVUT19SRSxcbiAgICAgICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogRlVOQ1RJT05fVElUTEUsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogWyBUSVRMRV9NT0RFIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIG5lZWRlZCBiZWNhdXNlIHdlIGRvIG5vdCBoYXZlIGxvb2stYmVoaW5kIG9uIHRoZSBiZWxvdyBydWxlXG4gICAgICAvLyB0byBwcmV2ZW50IGl0IGZyb20gZ3JhYmJpbmcgdGhlIGZpbmFsIDogaW4gYSA6OiBwYWlyXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvOjovLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBpbml0aWFsaXplcnNcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC86LyxcbiAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgU1RSSU5HUyxcbiAgICAgICAgICBOVU1CRVJTXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBhbGxvdyBmb3IgbXVsdGlwbGUgZGVjbGFyYXRpb25zLCBlLmcuOlxuICAgICAgLy8gZXh0ZXJuIHZvaWQgZihpbnQpLCBnKGNoYXIpO1xuICAgICAge1xuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIG1hdGNoOiAvLC9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIENfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBTVFJJTkdTLFxuICAgICAgICAgIE5VTUJFUlMsXG4gICAgICAgICAgQ1BQX1BSSU1JVElWRV9UWVBFUyxcbiAgICAgICAgICAvLyBDb3VudCBtYXRjaGluZyBwYXJlbnRoZXNlcy5cbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICAgICAgQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgU1RSSU5HUyxcbiAgICAgICAgICAgICAgTlVNQkVSUyxcbiAgICAgICAgICAgICAgQ1BQX1BSSU1JVElWRV9UWVBFU1xuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIENQUF9QUklNSVRJVkVfVFlQRVMsXG4gICAgICBDX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIFBSRVBST0NFU1NPUlxuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdDKysnLFxuICAgIGFsaWFzZXM6IFtcbiAgICAgICdjYycsXG4gICAgICAnYysrJyxcbiAgICAgICdoKysnLFxuICAgICAgJ2hwcCcsXG4gICAgICAnaGgnLFxuICAgICAgJ2h4eCcsXG4gICAgICAnY3h4J1xuICAgIF0sXG4gICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNsYXNzTmFtZUFsaWFzZXM6IHsgJ2Z1bmN0aW9uLmRpc3BhdGNoJzogJ2J1aWx0X2luJyB9LFxuICAgIGNvbnRhaW5zOiBbXS5jb25jYXQoXG4gICAgICBFWFBSRVNTSU9OX0NPTlRFWFQsXG4gICAgICBGVU5DVElPTl9ERUNMQVJBVElPTixcbiAgICAgIEZVTkNUSU9OX0RJU1BBVENILFxuICAgICAgRVhQUkVTU0lPTl9DT05UQUlOUyxcbiAgICAgIFtcbiAgICAgICAgUFJFUFJPQ0VTU09SLFxuICAgICAgICB7IC8vIGNvbnRhaW5lcnM6IGllLCBgdmVjdG9yIDxpbnQ+IHJvb21zICg5KTtgXG4gICAgICAgICAgYmVnaW46ICdcXFxcYihkZXF1ZXxsaXN0fHF1ZXVlfHByaW9yaXR5X3F1ZXVlfHBhaXJ8c3RhY2t8dmVjdG9yfG1hcHxzZXR8Yml0c2V0fG11bHRpc2V0fG11bHRpbWFwfHVub3JkZXJlZF9tYXB8dW5vcmRlcmVkX3NldHx1bm9yZGVyZWRfbXVsdGlzZXR8dW5vcmRlcmVkX211bHRpbWFwfGFycmF5fHR1cGxlfG9wdGlvbmFsfHZhcmlhbnR8ZnVuY3Rpb24pXFxcXHMqPCg/ITwpJyxcbiAgICAgICAgICBlbmQ6ICc+JyxcbiAgICAgICAgICBrZXl3b3JkczogQ1BQX0tFWVdPUkRTLFxuICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgICBDUFBfUFJJTUlUSVZFX1RZUEVTXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnOjonLFxuICAgICAgICAgIGtleXdvcmRzOiBDUFBfS0VZV09SRFNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgICAvLyBleHRyYSBjb21wbGV4aXR5IHRvIGRlYWwgd2l0aCBgZW51bSBjbGFzc2AgYW5kIGBlbnVtIHN0cnVjdGBcbiAgICAgICAgICAgIC9cXGIoPzplbnVtKD86XFxzKyg/OmNsYXNzfHN0cnVjdCkpP3xjbGFzc3xzdHJ1Y3R8dW5pb24pLyxcbiAgICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICAgIC9cXHcrL1xuICAgICAgICAgIF0sXG4gICAgICAgICAgY2xhc3NOYW1lOiB7XG4gICAgICAgICAgICAxOiAna2V5d29yZCcsXG4gICAgICAgICAgICAzOiAndGl0bGUuY2xhc3MnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdKVxuICB9O1xufVxuXG5leHBvcnQgeyBjcHAgYXMgZGVmYXVsdCB9O1xuIl19