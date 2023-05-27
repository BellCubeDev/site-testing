function rust(hljs) {
    const regex = hljs.regex;
    const FUNCTION_INVOKE = {
        className: "title.function.invoke",
        relevance: 0,
        begin: regex.concat(/\b/, /(?!let\b)/, hljs.IDENT_RE, regex.lookahead(/\s*\(/))
    };
    const NUMBER_SUFFIX = '([ui](8|16|32|64|128|size)|f(32|64))\?';
    const KEYWORDS = [
        "abstract",
        "as",
        "async",
        "await",
        "become",
        "box",
        "break",
        "const",
        "continue",
        "crate",
        "do",
        "dyn",
        "else",
        "enum",
        "extern",
        "false",
        "final",
        "fn",
        "for",
        "if",
        "impl",
        "in",
        "let",
        "loop",
        "macro",
        "match",
        "mod",
        "move",
        "mut",
        "override",
        "priv",
        "pub",
        "ref",
        "return",
        "self",
        "Self",
        "static",
        "struct",
        "super",
        "trait",
        "true",
        "try",
        "type",
        "typeof",
        "unsafe",
        "unsized",
        "use",
        "virtual",
        "where",
        "while",
        "yield"
    ];
    const LITERALS = [
        "true",
        "false",
        "Some",
        "None",
        "Ok",
        "Err"
    ];
    const BUILTINS = [
        'drop ',
        "Copy",
        "Send",
        "Sized",
        "Sync",
        "Drop",
        "Fn",
        "FnMut",
        "FnOnce",
        "ToOwned",
        "Clone",
        "Debug",
        "PartialEq",
        "PartialOrd",
        "Eq",
        "Ord",
        "AsRef",
        "AsMut",
        "Into",
        "From",
        "Default",
        "Iterator",
        "Extend",
        "IntoIterator",
        "DoubleEndedIterator",
        "ExactSizeIterator",
        "SliceConcatExt",
        "ToString",
        "assert!",
        "assert_eq!",
        "bitflags!",
        "bytes!",
        "cfg!",
        "col!",
        "concat!",
        "concat_idents!",
        "debug_assert!",
        "debug_assert_eq!",
        "env!",
        "panic!",
        "file!",
        "format!",
        "format_args!",
        "include_bytes!",
        "include_str!",
        "line!",
        "local_data_key!",
        "module_path!",
        "option_env!",
        "print!",
        "println!",
        "select!",
        "stringify!",
        "try!",
        "unimplemented!",
        "unreachable!",
        "vec!",
        "write!",
        "writeln!",
        "macro_rules!",
        "assert_ne!",
        "debug_assert_ne!"
    ];
    const TYPES = [
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "isize",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "usize",
        "f32",
        "f64",
        "str",
        "char",
        "bool",
        "Box",
        "Option",
        "Result",
        "String",
        "Vec"
    ];
    return {
        name: 'Rust',
        aliases: ['rs'],
        keywords: {
            $pattern: hljs.IDENT_RE + '!?',
            type: TYPES,
            keyword: KEYWORDS,
            literal: LITERALS,
            built_in: BUILTINS
        },
        illegal: '</',
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.COMMENT('/\\*', '\\*/', { contains: ['self'] }),
            hljs.inherit(hljs.QUOTE_STRING_MODE, {
                begin: /b?"/,
                illegal: null
            }),
            {
                className: 'string',
                variants: [
                    { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
                    { begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ }
                ]
            },
            {
                className: 'symbol',
                begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
            },
            {
                className: 'number',
                variants: [
                    { begin: '\\b0b([01_]+)' + NUMBER_SUFFIX },
                    { begin: '\\b0o([0-7_]+)' + NUMBER_SUFFIX },
                    { begin: '\\b0x([A-Fa-f0-9_]+)' + NUMBER_SUFFIX },
                    { begin: '\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)'
                            + NUMBER_SUFFIX }
                ],
                relevance: 0
            },
            {
                begin: [
                    /fn/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.function"
                }
            },
            {
                className: 'meta',
                begin: '#!?\\[',
                end: '\\]',
                contains: [
                    {
                        className: 'string',
                        begin: /"/,
                        end: /"/
                    }
                ]
            },
            {
                begin: [
                    /let/,
                    /\s+/,
                    /(?:mut\s+)?/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "keyword",
                    4: "variable"
                }
            },
            {
                begin: [
                    /for/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE,
                    /\s+/,
                    /in/
                ],
                className: {
                    1: "keyword",
                    3: "variable",
                    5: "keyword"
                }
            },
            {
                begin: [
                    /type/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.class"
                }
            },
            {
                begin: [
                    /(?:trait|enum|struct|union|impl|for)/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.class"
                }
            },
            {
                begin: hljs.IDENT_RE + '::',
                keywords: {
                    keyword: "Self",
                    built_in: BUILTINS,
                    type: TYPES
                }
            },
            {
                className: "punctuation",
                begin: '->'
            },
            FUNCTION_INVOKE
        ]
    };
}
export { rust as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVzdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3J1c3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sZUFBZSxHQUFHO1FBQ3RCLFNBQVMsRUFBRSx1QkFBdUI7UUFDbEMsU0FBUyxFQUFFLENBQUM7UUFDWixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FDakIsSUFBSSxFQUNKLFdBQVcsRUFDWCxJQUFJLENBQUMsUUFBUSxFQUNiLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUIsQ0FBQztJQUNGLE1BQU0sYUFBYSxHQUFHLHdDQUF3QyxDQUFDO0lBQy9ELE1BQU0sUUFBUSxHQUFHO1FBQ2YsVUFBVTtRQUNWLElBQUk7UUFDSixPQUFPO1FBQ1AsT0FBTztRQUNQLFFBQVE7UUFDUixLQUFLO1FBQ0wsT0FBTztRQUNQLE9BQU87UUFDUCxVQUFVO1FBQ1YsT0FBTztRQUNQLElBQUk7UUFDSixLQUFLO1FBQ0wsTUFBTTtRQUNOLE1BQU07UUFDTixRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxJQUFJO1FBQ0osS0FBSztRQUNMLElBQUk7UUFDSixNQUFNO1FBQ04sSUFBSTtRQUNKLEtBQUs7UUFDTCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxLQUFLO1FBQ0wsTUFBTTtRQUNOLEtBQUs7UUFDTCxVQUFVO1FBQ1YsTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsUUFBUTtRQUNSLE1BQU07UUFDTixNQUFNO1FBQ04sUUFBUTtRQUNSLFFBQVE7UUFDUixPQUFPO1FBQ1AsT0FB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QUNFLEtBQUssRUFBRTtvQkFDTCxNQUFNO29CQUNOLEtBQUs7b0JBQ0wsSUFBSSxDQUFDLG1CQUFtQjtpQkFDekI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULENBQUMsRUFBRSxTQUFTO29CQUNaLENBQUMsRUFBRSxhQUFhO2lCQUNqQjthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFO29CQUNMLHNDQUFzQztvQkFDdEMsS0FBSztvQkFDTCxJQUFJLENBQUMsbUJBQW1CO2lCQUN6QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsQ0FBQyxFQUFFLFNBQVM7b0JBQ1osQ0FBQyxFQUFFLGFBQWE7aUJBQ2pCO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsT0FBTyxFQUFFLE1BQU07b0JBQ2YsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLElBQUksRUFBRSxLQUFLO2lCQUNaO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsYUFBYTtnQkFDeEIsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNELGVBQWU7U0FDaEI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFJ1c3RcbkF1dGhvcjogQW5kcmV5IFZsYXNvdnNraWtoIDxhbmRyZXkudmxhc292c2tpa2hAZ21haWwuY29tPlxuQ29udHJpYnV0b3JzOiBSb21hbiBTaG1hdG92IDxyb21hbnNobWF0b3ZAZ21haWwuY29tPiwgS2FzcGVyIEFuZGVyc2VuIDxrbWFfdW50cnVzdGVkQHByb3Rvbm1haWwuY29tPlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cucnVzdC1sYW5nLm9yZ1xuQ2F0ZWdvcnk6IGNvbW1vbiwgc3lzdGVtXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gcnVzdChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgRlVOQ1RJT05fSU5WT0tFID0ge1xuICAgIGNsYXNzTmFtZTogXCJ0aXRsZS5mdW5jdGlvbi5pbnZva2VcIixcbiAgICByZWxldmFuY2U6IDAsXG4gICAgYmVnaW46IHJlZ2V4LmNvbmNhdChcbiAgICAgIC9cXGIvLFxuICAgICAgLyg/IWxldFxcYikvLFxuICAgICAgaGxqcy5JREVOVF9SRSxcbiAgICAgIHJlZ2V4Lmxvb2thaGVhZCgvXFxzKlxcKC8pKVxuICB9O1xuICBjb25zdCBOVU1CRVJfU1VGRklYID0gJyhbdWldKDh8MTZ8MzJ8NjR8MTI4fHNpemUpfGYoMzJ8NjQpKVxcPyc7XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwiYWJzdHJhY3RcIixcbiAgICBcImFzXCIsXG4gICAgXCJhc3luY1wiLFxuICAgIFwiYXdhaXRcIixcbiAgICBcImJlY29tZVwiLFxuICAgIFwiYm94XCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY29uc3RcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJjcmF0ZVwiLFxuICAgIFwiZG9cIixcbiAgICBcImR5blwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZW51bVwiLFxuICAgIFwiZXh0ZXJuXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZmluYWxcIixcbiAgICBcImZuXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImlmXCIsXG4gICAgXCJpbXBsXCIsXG4gICAgXCJpblwiLFxuICAgIFwibGV0XCIsXG4gICAgXCJsb29wXCIsXG4gICAgXCJtYWNyb1wiLFxuICAgIFwibWF0Y2hcIixcbiAgICBcIm1vZFwiLFxuICAgIFwibW92ZVwiLFxuICAgIFwibXV0XCIsXG4gICAgXCJvdmVycmlkZVwiLFxuICAgIFwicHJpdlwiLFxuICAgIFwicHViXCIsXG4gICAgXCJyZWZcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwic2VsZlwiLFxuICAgIFwiU2VsZlwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzdHJ1Y3RcIixcbiAgICBcInN1cGVyXCIsXG4gICAgXCJ0cmFpdFwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJ0eXBlb2ZcIixcbiAgICBcInVuc2FmZVwiLFxuICAgIFwidW5zaXplZFwiLFxuICAgIFwidXNlXCIsXG4gICAgXCJ2aXJ0dWFsXCIsXG4gICAgXCJ3aGVyZVwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcInlpZWxkXCJcbiAgXTtcbiAgY29uc3QgTElURVJBTFMgPSBbXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiU29tZVwiLFxuICAgIFwiTm9uZVwiLFxuICAgIFwiT2tcIixcbiAgICBcIkVyclwiXG4gIF07XG4gIGNvbnN0IEJVSUxUSU5TID0gW1xuICAgIC8vIGZ1bmN0aW9uc1xuICAgICdkcm9wICcsXG4gICAgLy8gdHJhaXRzXG4gICAgXCJDb3B5XCIsXG4gICAgXCJTZW5kXCIsXG4gICAgXCJTaXplZFwiLFxuICAgIFwiU3luY1wiLFxuICAgIFwiRHJvcFwiLFxuICAgIFwiRm5cIixcbiAgICBcIkZuTXV0XCIsXG4gICAgXCJGbk9uY2VcIixcbiAgICBcIlRvT3duZWRcIixcbiAgICBcIkNsb25lXCIsXG4gICAgXCJEZWJ1Z1wiLFxuICAgIFwiUGFydGlhbEVxXCIsXG4gICAgXCJQYXJ0aWFsT3JkXCIsXG4gICAgXCJFcVwiLFxuICAgIFwiT3JkXCIsXG4gICAgXCJBc1JlZlwiLFxuICAgIFwiQXNNdXRcIixcbiAgICBcIkludG9cIixcbiAgICBcIkZyb21cIixcbiAgICBcIkRlZmF1bHRcIixcbiAgICBcIkl0ZXJhdG9yXCIsXG4gICAgXCJFeHRlbmRcIixcbiAgICBcIkludG9JdGVyYXRvclwiLFxuICAgIFwiRG91YmxlRW5kZWRJdGVyYXRvclwiLFxuICAgIFwiRXhhY3RTaXplSXRlcmF0b3JcIixcbiAgICBcIlNsaWNlQ29uY2F0RXh0XCIsXG4gICAgXCJUb1N0cmluZ1wiLFxuICAgIC8vIG1hY3Jvc1xuICAgIFwiYXNzZXJ0IVwiLFxuICAgIFwiYXNzZXJ0X2VxIVwiLFxuICAgIFwiYml0ZmxhZ3MhXCIsXG4gICAgXCJieXRlcyFcIixcbiAgICBcImNmZyFcIixcbiAgICBcImNvbCFcIixcbiAgICBcImNvbmNhdCFcIixcbiAgICBcImNvbmNhdF9pZGVudHMhXCIsXG4gICAgXCJkZWJ1Z19hc3NlcnQhXCIsXG4gICAgXCJkZWJ1Z19hc3NlcnRfZXEhXCIsXG4gICAgXCJlbnYhXCIsXG4gICAgXCJwYW5pYyFcIixcbiAgICBcImZpbGUhXCIsXG4gICAgXCJmb3JtYXQhXCIsXG4gICAgXCJmb3JtYXRfYXJncyFcIixcbiAgICBcImluY2x1ZGVfYnl0ZXMhXCIsXG4gICAgXCJpbmNsdWRlX3N0ciFcIixcbiAgICBcImxpbmUhXCIsXG4gICAgXCJsb2NhbF9kYXRhX2tleSFcIixcbiAgICBcIm1vZHVsZV9wYXRoIVwiLFxuICAgIFwib3B0aW9uX2VudiFcIixcbiAgICBcInByaW50IVwiLFxuICAgIFwicHJpbnRsbiFcIixcbiAgICBcInNlbGVjdCFcIixcbiAgICBcInN0cmluZ2lmeSFcIixcbiAgICBcInRyeSFcIixcbiAgICBcInVuaW1wbGVtZW50ZWQhXCIsXG4gICAgXCJ1bnJlYWNoYWJsZSFcIixcbiAgICBcInZlYyFcIixcbiAgICBcIndyaXRlIVwiLFxuICAgIFwid3JpdGVsbiFcIixcbiAgICBcIm1hY3JvX3J1bGVzIVwiLFxuICAgIFwiYXNzZXJ0X25lIVwiLFxuICAgIFwiZGVidWdfYXNzZXJ0X25lIVwiXG4gIF07XG4gIGNvbnN0IFRZUEVTID0gW1xuICAgIFwiaThcIixcbiAgICBcImkxNlwiLFxuICAgIFwiaTMyXCIsXG4gICAgXCJpNjRcIixcbiAgICBcImkxMjhcIixcbiAgICBcImlzaXplXCIsXG4gICAgXCJ1OFwiLFxuICAgIFwidTE2XCIsXG4gICAgXCJ1MzJcIixcbiAgICBcInU2NFwiLFxuICAgIFwidTEyOFwiLFxuICAgIFwidXNpemVcIixcbiAgICBcImYzMlwiLFxuICAgIFwiZjY0XCIsXG4gICAgXCJzdHJcIixcbiAgICBcImNoYXJcIixcbiAgICBcImJvb2xcIixcbiAgICBcIkJveFwiLFxuICAgIFwiT3B0aW9uXCIsXG4gICAgXCJSZXN1bHRcIixcbiAgICBcIlN0cmluZ1wiLFxuICAgIFwiVmVjXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUnVzdCcsXG4gICAgYWxpYXNlczogWyAncnMnIF0sXG4gICAga2V5d29yZHM6IHtcbiAgICAgICRwYXR0ZXJuOiBobGpzLklERU5UX1JFICsgJyE/JyxcbiAgICAgIHR5cGU6IFRZUEVTLFxuICAgICAga2V5d29yZDogS0VZV09SRFMsXG4gICAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICAgIGJ1aWx0X2luOiBCVUlMVElOU1xuICAgIH0sXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DT01NRU5UKCcvXFxcXConLCAnXFxcXCovJywgeyBjb250YWluczogWyAnc2VsZicgXSB9KSxcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7XG4gICAgICAgIGJlZ2luOiAvYj9cIi8sXG4gICAgICAgIGlsbGVnYWw6IG51bGxcbiAgICAgIH0pLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHsgYmVnaW46IC9iP3IoIyopXCIoLnxcXG4pKj9cIlxcMSg/ISMpLyB9LFxuICAgICAgICAgIHsgYmVnaW46IC9iPydcXFxcPyh4XFx3ezJ9fHVcXHd7NH18VVxcd3s4fXwuKScvIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgYmVnaW46IC8nW2EtekEtWl9dW2EtekEtWjAtOV9dKi9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ1xcXFxiMGIoWzAxX10rKScgKyBOVU1CRVJfU1VGRklYIH0sXG4gICAgICAgICAgeyBiZWdpbjogJ1xcXFxiMG8oWzAtN19dKyknICsgTlVNQkVSX1NVRkZJWCB9LFxuICAgICAgICAgIHsgYmVnaW46ICdcXFxcYjB4KFtBLUZhLWYwLTlfXSspJyArIE5VTUJFUl9TVUZGSVggfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXFxcXGIoXFxcXGRbXFxcXGRfXSooXFxcXC5bMC05X10rKT8oW2VFXVsrLV0/WzAtOV9dKyk/KSdcbiAgICAgICAgICAgICAgICAgICArIE5VTUJFUl9TVUZGSVggfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBbXG4gICAgICAgICAgL2ZuLyxcbiAgICAgICAgICAvXFxzKy8sXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgIF0sXG4gICAgICAgIGNsYXNzTmFtZToge1xuICAgICAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46ICcjIT9cXFxcWycsXG4gICAgICAgIGVuZDogJ1xcXFxdJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46IC9cIi8sXG4gICAgICAgICAgICBlbmQ6IC9cIi9cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBbXG4gICAgICAgICAgL2xldC8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIC8oPzptdXRcXHMrKT8vLFxuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICBdLFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcImtleXdvcmRcIixcbiAgICAgICAgICA0OiBcInZhcmlhYmxlXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIG11c3QgY29tZSBiZWZvcmUgaW1wbC9mb3IgcnVsZSBsYXRlclxuICAgICAge1xuICAgICAgICBiZWdpbjogW1xuICAgICAgICAgIC9mb3IvLFxuICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIC9pbi9cbiAgICAgICAgXSxcbiAgICAgICAgY2xhc3NOYW1lOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ2YXJpYWJsZVwiLFxuICAgICAgICAgIDU6IFwia2V5d29yZFwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBbXG4gICAgICAgICAgL3R5cGUvLFxuICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgXSxcbiAgICAgICAgY2xhc3NOYW1lOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ0aXRsZS5jbGFzc1wiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBbXG4gICAgICAgICAgLyg/OnRyYWl0fGVudW18c3RydWN0fHVuaW9ufGltcGx8Zm9yKS8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICBdLFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInRpdGxlLmNsYXNzXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnOjonLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgIGtleXdvcmQ6IFwiU2VsZlwiLFxuICAgICAgICAgIGJ1aWx0X2luOiBCVUlMVElOUyxcbiAgICAgICAgICB0eXBlOiBUWVBFU1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6IFwicHVuY3R1YXRpb25cIixcbiAgICAgICAgYmVnaW46ICctPidcbiAgICAgIH0sXG4gICAgICBGVU5DVElPTl9JTlZPS0VcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHJ1c3QgYXMgZGVmYXVsdCB9O1xuIl19