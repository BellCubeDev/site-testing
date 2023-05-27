function delphi(hljs) {
    const KEYWORDS = [
        "exports",
        "register",
        "file",
        "shl",
        "array",
        "record",
        "property",
        "for",
        "mod",
        "while",
        "set",
        "ally",
        "label",
        "uses",
        "raise",
        "not",
        "stored",
        "class",
        "safecall",
        "var",
        "interface",
        "or",
        "private",
        "static",
        "exit",
        "index",
        "inherited",
        "to",
        "else",
        "stdcall",
        "override",
        "shr",
        "asm",
        "far",
        "resourcestring",
        "finalization",
        "packed",
        "virtual",
        "out",
        "and",
        "protected",
        "library",
        "do",
        "xorwrite",
        "goto",
        "near",
        "function",
        "end",
        "div",
        "overload",
        "object",
        "unit",
        "begin",
        "string",
        "on",
        "inline",
        "repeat",
        "until",
        "destructor",
        "write",
        "message",
        "program",
        "with",
        "read",
        "initialization",
        "except",
        "default",
        "nil",
        "if",
        "case",
        "cdecl",
        "in",
        "downto",
        "threadvar",
        "of",
        "try",
        "pascal",
        "const",
        "external",
        "constructor",
        "type",
        "public",
        "then",
        "implementation",
        "finally",
        "published",
        "procedure",
        "absolute",
        "reintroduce",
        "operator",
        "as",
        "is",
        "abstract",
        "alias",
        "assembler",
        "bitpacked",
        "break",
        "continue",
        "cppdecl",
        "cvar",
        "enumerator",
        "experimental",
        "platform",
        "deprecated",
        "unimplemented",
        "dynamic",
        "export",
        "far16",
        "forward",
        "generic",
        "helper",
        "implements",
        "interrupt",
        "iochecks",
        "local",
        "name",
        "nodefault",
        "noreturn",
        "nostackframe",
        "oldfpccall",
        "otherwise",
        "saveregisters",
        "softfloat",
        "specialize",
        "strict",
        "unaligned",
        "varargs"
    ];
    const COMMENT_MODES = [
        hljs.C_LINE_COMMENT_MODE,
        hljs.COMMENT(/\{/, /\}/, { relevance: 0 }),
        hljs.COMMENT(/\(\*/, /\*\)/, { relevance: 10 })
    ];
    const DIRECTIVE = {
        className: 'meta',
        variants: [
            {
                begin: /\{\$/,
                end: /\}/
            },
            {
                begin: /\(\*\$/,
                end: /\*\)/
            }
        ]
    };
    const STRING = {
        className: 'string',
        begin: /'/,
        end: /'/,
        contains: [{ begin: /''/ }]
    };
    const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
            {
                begin: '\\$[0-9A-Fa-f]+'
            },
            {
                begin: '&[0-7]+'
            },
            {
                begin: '%[01]+'
            }
        ]
    };
    const CHAR_STRING = {
        className: 'string',
        begin: /(#\d+)+/
    };
    const CLASS = {
        begin: hljs.IDENT_RE + '\\s*=\\s*class\\s*\\(',
        returnBegin: true,
        contains: [hljs.TITLE_MODE]
    };
    const FUNCTION = {
        className: 'function',
        beginKeywords: 'function constructor destructor procedure',
        end: /[:;]/,
        keywords: 'function constructor|10 destructor|10 procedure|10',
        contains: [
            hljs.TITLE_MODE,
            {
                className: 'params',
                begin: /\(/,
                end: /\)/,
                keywords: KEYWORDS,
                contains: [
                    STRING,
                    CHAR_STRING,
                    DIRECTIVE
                ].concat(COMMENT_MODES)
            },
            DIRECTIVE
        ].concat(COMMENT_MODES)
    };
    return {
        name: 'Delphi',
        aliases: [
            'dpr',
            'dfm',
            'pas',
            'pascal'
        ],
        case_insensitive: true,
        keywords: KEYWORDS,
        illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
        contains: [
            STRING,
            CHAR_STRING,
            hljs.NUMBER_MODE,
            NUMBER,
            CLASS,
            FUNCTION,
            DIRECTIVE
        ].concat(COMMENT_MODES)
    };
}
export { delphi as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVscGhpLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvZGVscGhpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxRQUFRLEdBQUc7UUFDZixTQUFTO1FBQ1QsVUFBVTtRQUNWLE1BQU07UUFDTixLQUFLO1FBQ0wsT0FBTztRQUNQLFFBQVE7UUFDUixVQUFVO1FBQ1YsS0FBSztRQUNMLEtBQUs7UUFDTCxPQUFPO1FBQ1AsS0FBSztRQUNMLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxLQUFLO1FBQ0wsUUFBUTtRQUNSLE9BQU87UUFDUCxVQUFVO1FBQ1YsS0FBSztRQUNMLFdBQVc7UUFDWCxJQUFJO1FBQ0osU0FBUztRQUNULFFBQVE7UUFDUixNQUFNO1FBQ04sT0FBTztRQUNQLFdBQVc7UUFDWCxJQUFJO1FBQ0osTUFBTTtRQUNOLFNBQVM7UUFDVCxVQUFVO1FBQ1YsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsZ0JBQWdCO1FBQ2hCLGNBQWM7UUFDZCxRQUFRO1FBQ1IsU0FBUztRQUNULEtBQUs7UUFDTCxLQUFLO1FBQ0wsV0FBVztRQUNYLFNBQVM7UUFDVCxJQUFJO1FBQ0osVUFBVTtRQUNWLE1BQU07UUFDTixNQUFNO1FBQ04sVUFBVTtRQUNWLEtBQUs7UUFDTCxLQUFLO1FBQ0wsVUFBVTtRQUNWLFFBQVE7UUFDUixNQUFNO1FBQ04sT0FBTztRQUNQLFFBQVE7UUFDUixJQUFJO1FBQ0osUUFBUTtRQUNSLFFBQVE7UUFDUixPQUFPO1FBQ1AsWUFBWTtRQUNaLE9BQU87UUFDUCxTQUFTO1FBQ1QsU0FBUztRQUNULE1BQU07UUFDTixNQUFNO1FBQ04sZ0JBQWdC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RUFBRTtvQkFDUixNQUFNO29CQUNOLFdBQVc7b0JBQ1gsU0FBUztpQkFDVixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7YUFDeEI7WUFDRCxTQUFTO1NBQ1YsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO0tBQ3hCLENBQUM7SUFDRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUU7WUFDUCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxRQUFRO1NBQ1Q7UUFDRCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLE9BQU8sRUFBRSwwQkFBMEI7UUFDbkMsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLFdBQVc7WUFDWCxJQUFJLENBQUMsV0FBVztZQUNoQixNQUFNO1lBQ04sS0FBSztZQUNMLFFBQVE7WUFDUixTQUFTO1NBQ1YsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO0tBQ3hCLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogRGVscGhpXG5XZWJzaXRlOiBodHRwczovL3d3dy5lbWJhcmNhZGVyby5jb20vcHJvZHVjdHMvZGVscGhpXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZGVscGhpKGhsanMpIHtcbiAgY29uc3QgS0VZV09SRFMgPSBbXG4gICAgXCJleHBvcnRzXCIsXG4gICAgXCJyZWdpc3RlclwiLFxuICAgIFwiZmlsZVwiLFxuICAgIFwic2hsXCIsXG4gICAgXCJhcnJheVwiLFxuICAgIFwicmVjb3JkXCIsXG4gICAgXCJwcm9wZXJ0eVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJtb2RcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJzZXRcIixcbiAgICBcImFsbHlcIixcbiAgICBcImxhYmVsXCIsXG4gICAgXCJ1c2VzXCIsXG4gICAgXCJyYWlzZVwiLFxuICAgIFwibm90XCIsXG4gICAgXCJzdG9yZWRcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJzYWZlY2FsbFwiLFxuICAgIFwidmFyXCIsXG4gICAgXCJpbnRlcmZhY2VcIixcbiAgICBcIm9yXCIsXG4gICAgXCJwcml2YXRlXCIsXG4gICAgXCJzdGF0aWNcIixcbiAgICBcImV4aXRcIixcbiAgICBcImluZGV4XCIsXG4gICAgXCJpbmhlcml0ZWRcIixcbiAgICBcInRvXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJzdGRjYWxsXCIsXG4gICAgXCJvdmVycmlkZVwiLFxuICAgIFwic2hyXCIsXG4gICAgXCJhc21cIixcbiAgICBcImZhclwiLFxuICAgIFwicmVzb3VyY2VzdHJpbmdcIixcbiAgICBcImZpbmFsaXphdGlvblwiLFxuICAgIFwicGFja2VkXCIsXG4gICAgXCJ2aXJ0dWFsXCIsXG4gICAgXCJvdXRcIixcbiAgICBcImFuZFwiLFxuICAgIFwicHJvdGVjdGVkXCIsXG4gICAgXCJsaWJyYXJ5XCIsXG4gICAgXCJkb1wiLFxuICAgIFwieG9yd3JpdGVcIixcbiAgICBcImdvdG9cIixcbiAgICBcIm5lYXJcIixcbiAgICBcImZ1bmN0aW9uXCIsXG4gICAgXCJlbmRcIixcbiAgICBcImRpdlwiLFxuICAgIFwib3ZlcmxvYWRcIixcbiAgICBcIm9iamVjdFwiLFxuICAgIFwidW5pdFwiLFxuICAgIFwiYmVnaW5cIixcbiAgICBcInN0cmluZ1wiLFxuICAgIFwib25cIixcbiAgICBcImlubGluZVwiLFxuICAgIFwicmVwZWF0XCIsXG4gICAgXCJ1bnRpbFwiLFxuICAgIFwiZGVzdHJ1Y3RvclwiLFxuICAgIFwid3JpdGVcIixcbiAgICBcIm1lc3NhZ2VcIixcbiAgICBcInByb2dyYW1cIixcbiAgICBcIndpdGhcIixcbiAgICBcInJlYWRcIixcbiAgICBcImluaXRpYWxpemF0aW9uXCIsXG4gICAgXCJleGNlcHRcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcIm5pbFwiLFxuICAgIFwiaWZcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNkZWNsXCIsXG4gICAgXCJpblwiLFxuICAgIFwiZG93bnRvXCIsXG4gICAgXCJ0aHJlYWR2YXJcIixcbiAgICBcIm9mXCIsXG4gICAgXCJ0cnlcIixcbiAgICBcInBhc2NhbFwiLFxuICAgIFwiY29uc3RcIixcbiAgICBcImV4dGVybmFsXCIsXG4gICAgXCJjb25zdHJ1Y3RvclwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJpbXBsZW1lbnRhdGlvblwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwicHVibGlzaGVkXCIsXG4gICAgXCJwcm9jZWR1cmVcIixcbiAgICBcImFic29sdXRlXCIsXG4gICAgXCJyZWludHJvZHVjZVwiLFxuICAgIFwib3BlcmF0b3JcIixcbiAgICBcImFzXCIsXG4gICAgXCJpc1wiLFxuICAgIFwiYWJzdHJhY3RcIixcbiAgICBcImFsaWFzXCIsXG4gICAgXCJhc3NlbWJsZXJcIixcbiAgICBcImJpdHBhY2tlZFwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJjcHBkZWNsXCIsXG4gICAgXCJjdmFyXCIsXG4gICAgXCJlbnVtZXJhdG9yXCIsXG4gICAgXCJleHBlcmltZW50YWxcIixcbiAgICBcInBsYXRmb3JtXCIsXG4gICAgXCJkZXByZWNhdGVkXCIsXG4gICAgXCJ1bmltcGxlbWVudGVkXCIsXG4gICAgXCJkeW5hbWljXCIsXG4gICAgXCJleHBvcnRcIixcbiAgICBcImZhcjE2XCIsXG4gICAgXCJmb3J3YXJkXCIsXG4gICAgXCJnZW5lcmljXCIsXG4gICAgXCJoZWxwZXJcIixcbiAgICBcImltcGxlbWVudHNcIixcbiAgICBcImludGVycnVwdFwiLFxuICAgIFwiaW9jaGVja3NcIixcbiAgICBcImxvY2FsXCIsXG4gICAgXCJuYW1lXCIsXG4gICAgXCJub2RlZmF1bHRcIixcbiAgICBcIm5vcmV0dXJuXCIsXG4gICAgXCJub3N0YWNrZnJhbWVcIixcbiAgICBcIm9sZGZwY2NhbGxcIixcbiAgICBcIm90aGVyd2lzZVwiLFxuICAgIFwic2F2ZXJlZ2lzdGVyc1wiLFxuICAgIFwic29mdGZsb2F0XCIsXG4gICAgXCJzcGVjaWFsaXplXCIsXG4gICAgXCJzdHJpY3RcIixcbiAgICBcInVuYWxpZ25lZFwiLFxuICAgIFwidmFyYXJnc1wiXG4gIF07XG4gIGNvbnN0IENPTU1FTlRfTU9ERVMgPSBbXG4gICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgIGhsanMuQ09NTUVOVCgvXFx7LywgL1xcfS8sIHsgcmVsZXZhbmNlOiAwIH0pLFxuICAgIGhsanMuQ09NTUVOVCgvXFwoXFwqLywgL1xcKlxcKS8sIHsgcmVsZXZhbmNlOiAxMCB9KVxuICBdO1xuICBjb25zdCBESVJFQ1RJVkUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXHtcXCQvLFxuICAgICAgICBlbmQ6IC9cXH0vXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcKFxcKlxcJC8sXG4gICAgICAgIGVuZDogL1xcKlxcKS9cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvJy8sXG4gICAgZW5kOiAvJy8sXG4gICAgY29udGFpbnM6IFsgeyBiZWdpbjogLycnLyB9IF1cbiAgfTtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIC8vIFNvdXJjZTogaHR0cHM6Ly93d3cuZnJlZXBhc2NhbC5vcmcvZG9jcy1odG1sL3JlZi9yZWZzZTYuaHRtbFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7XG4gICAgICAgIC8vIEhleGFkZWNpbWFsIG5vdGF0aW9uLCBlLmcuLCAkN0YuXG4gICAgICAgIGJlZ2luOiAnXFxcXCRbMC05QS1GYS1mXSsnIH0sXG4gICAgICB7XG4gICAgICAgIC8vIE9jdGFsIG5vdGF0aW9uLCBlLmcuLCAmNDIuXG4gICAgICAgIGJlZ2luOiAnJlswLTddKycgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gQmluYXJ5IG5vdGF0aW9uLCBlLmcuLCAlMTAxMC5cbiAgICAgICAgYmVnaW46ICclWzAxXSsnIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IENIQVJfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46IC8oI1xcZCspKy9cbiAgfTtcbiAgY29uc3QgQ0xBU1MgPSB7XG4gICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnXFxcXHMqPVxcXFxzKmNsYXNzXFxcXHMqXFxcXCgnLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbIGhsanMuVElUTEVfTU9ERSBdXG4gIH07XG4gIGNvbnN0IEZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24gY29uc3RydWN0b3IgZGVzdHJ1Y3RvciBwcm9jZWR1cmUnLFxuICAgIGVuZDogL1s6O10vLFxuICAgIGtleXdvcmRzOiAnZnVuY3Rpb24gY29uc3RydWN0b3J8MTAgZGVzdHJ1Y3RvcnwxMCBwcm9jZWR1cmV8MTAnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLlRJVExFX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFNUUklORyxcbiAgICAgICAgICBDSEFSX1NUUklORyxcbiAgICAgICAgICBESVJFQ1RJVkVcbiAgICAgICAgXS5jb25jYXQoQ09NTUVOVF9NT0RFUylcbiAgICAgIH0sXG4gICAgICBESVJFQ1RJVkVcbiAgICBdLmNvbmNhdChDT01NRU5UX01PREVTKVxuICB9O1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdEZWxwaGknLFxuICAgIGFsaWFzZXM6IFtcbiAgICAgICdkcHInLFxuICAgICAgJ2RmbScsXG4gICAgICAncGFzJyxcbiAgICAgICdwYXNjYWwnXG4gICAgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAvXCJ8XFwkW0ctWmctel18XFwvXFwqfDxcXC98XFx8LyxcbiAgICBjb250YWluczogW1xuICAgICAgU1RSSU5HLFxuICAgICAgQ0hBUl9TVFJJTkcsXG4gICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgTlVNQkVSLFxuICAgICAgQ0xBU1MsXG4gICAgICBGVU5DVElPTixcbiAgICAgIERJUkVDVElWRVxuICAgIF0uY29uY2F0KENPTU1FTlRfTU9ERVMpXG4gIH07XG59XG5cbmV4cG9ydCB7IGRlbHBoaSBhcyBkZWZhdWx0IH07XG4iXX0=