function dart(hljs) {
    const SUBST = {
        className: 'subst',
        variants: [{ begin: '\\$[A-Za-z0-9_]+' }]
    };
    const BRACED_SUBST = {
        className: 'subst',
        variants: [
            {
                begin: /\$\{/,
                end: /\}/
            }
        ],
        keywords: 'true false null this is new super'
    };
    const STRING = {
        className: 'string',
        variants: [
            {
                begin: 'r\'\'\'',
                end: '\'\'\''
            },
            {
                begin: 'r"""',
                end: '"""'
            },
            {
                begin: 'r\'',
                end: '\'',
                illegal: '\\n'
            },
            {
                begin: 'r"',
                end: '"',
                illegal: '\\n'
            },
            {
                begin: '\'\'\'',
                end: '\'\'\'',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    SUBST,
                    BRACED_SUBST
                ]
            },
            {
                begin: '"""',
                end: '"""',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    SUBST,
                    BRACED_SUBST
                ]
            },
            {
                begin: '\'',
                end: '\'',
                illegal: '\\n',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    SUBST,
                    BRACED_SUBST
                ]
            },
            {
                begin: '"',
                end: '"',
                illegal: '\\n',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    SUBST,
                    BRACED_SUBST
                ]
            }
        ]
    };
    BRACED_SUBST.contains = [
        hljs.C_NUMBER_MODE,
        STRING
    ];
    const BUILT_IN_TYPES = [
        'Comparable',
        'DateTime',
        'Duration',
        'Function',
        'Iterable',
        'Iterator',
        'List',
        'Map',
        'Match',
        'Object',
        'Pattern',
        'RegExp',
        'Set',
        'Stopwatch',
        'String',
        'StringBuffer',
        'StringSink',
        'Symbol',
        'Type',
        'Uri',
        'bool',
        'double',
        'int',
        'num',
        'Element',
        'ElementList'
    ];
    const NULLABLE_BUILT_IN_TYPES = BUILT_IN_TYPES.map((e) => `${e}?`);
    const BASIC_KEYWORDS = [
        "abstract",
        "as",
        "assert",
        "async",
        "await",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "covariant",
        "default",
        "deferred",
        "do",
        "dynamic",
        "else",
        "enum",
        "export",
        "extends",
        "extension",
        "external",
        "factory",
        "false",
        "final",
        "finally",
        "for",
        "Function",
        "get",
        "hide",
        "if",
        "implements",
        "import",
        "in",
        "inferface",
        "is",
        "late",
        "library",
        "mixin",
        "new",
        "null",
        "on",
        "operator",
        "part",
        "required",
        "rethrow",
        "return",
        "set",
        "show",
        "static",
        "super",
        "switch",
        "sync",
        "this",
        "throw",
        "true",
        "try",
        "typedef",
        "var",
        "void",
        "while",
        "with",
        "yield"
    ];
    const KEYWORDS = {
        keyword: BASIC_KEYWORDS,
        built_in: BUILT_IN_TYPES
            .concat(NULLABLE_BUILT_IN_TYPES)
            .concat([
            'Never',
            'Null',
            'dynamic',
            'print',
            'document',
            'querySelector',
            'querySelectorAll',
            'window'
        ]),
        $pattern: /[A-Za-z][A-Za-z0-9_]*\??/
    };
    return {
        name: 'Dart',
        keywords: KEYWORDS,
        contains: [
            STRING,
            hljs.COMMENT(/\/\*\*(?!\/)/, /\*\//, {
                subLanguage: 'markdown',
                relevance: 0
            }),
            hljs.COMMENT(/\/{3,} ?/, /$/, { contains: [
                    {
                        subLanguage: 'markdown',
                        begin: '.',
                        end: '$',
                        relevance: 0
                    }
                ] }),
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'class',
                beginKeywords: 'class interface',
                end: /\{/,
                excludeEnd: true,
                contains: [
                    { beginKeywords: 'extends implements' },
                    hljs.UNDERSCORE_TITLE_MODE
                ]
            },
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: '@[A-Za-z]+'
            },
            { begin: '=>'
            }
        ]
    };
}
export { dart as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFydC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2RhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRztRQUNaLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFFBQVEsRUFBRSxDQUFFLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLENBQUU7S0FDNUMsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHO1FBQ25CLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLEtBQUssRUFBRSxNQUFNO2dCQUNiLEdBQUcsRUFBRSxJQUFJO2FBQ1Y7U0FDRjtRQUNELFFBQVEsRUFBRSxtQ0FBbUM7S0FDOUMsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLEdBQUcsRUFBRSxRQUFRO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsTUFBTTtnQkFDYixHQUFHLEVBQUUsS0FBSzthQUNYO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLElBQUk7Z0JBQ1QsT0FBTyxFQUFFLEtBQUs7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxJQUFJO2dCQUNYLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE9BQU8sRUFBRSxLQUFLO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsUUFBUTtnQkFDZixHQUFHLEVBQUUsUUFBUTtnQkFDYixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckIsS0FBSztvQkFDTCxZQUFZO2lCQUNiO2FBQ0Y7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QUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLElBQUksQ0FBQyxPQUFPLENBQ1YsY0FBYyxFQUNkLE1BQU0sRUFDTjtnQkFDRSxXQUFXLEVBQUUsVUFBVTtnQkFDdkIsU0FBUyxFQUFFLENBQUM7YUFDYixDQUNGO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FDVixVQUFVLEVBQ1YsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFO29CQUNmO3dCQUNFLFdBQVcsRUFBRSxVQUFVO3dCQUN2QixLQUFLLEVBQUUsR0FBRzt3QkFDVixHQUFHLEVBQUUsR0FBRzt3QkFDUixTQUFTLEVBQUUsQ0FBQztxQkFDYjtpQkFDRixFQUFFLENBQ0o7WUFDRCxJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekI7Z0JBQ0UsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLGFBQWEsRUFBRSxpQkFBaUI7Z0JBQ2hDLEdBQUcsRUFBRSxJQUFJO2dCQUNULFVBQVUsRUFBRSxJQUFJO2dCQUNoQixRQUFRLEVBQUU7b0JBQ1IsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxxQkFBcUI7aUJBQzNCO2FBQ0Y7WUFDRCxJQUFJLENBQUMsYUFBYTtZQUNsQjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLFlBQVk7YUFDcEI7WUFDRCxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogRGFydFxuUmVxdWlyZXM6IG1hcmtkb3duLmpzXG5BdXRob3I6IE1heGltIERpa3VuIDxkaWttYXhAZ21haWwuY29tPlxuRGVzY3JpcHRpb246IERhcnQgYSBtb2Rlcm4sIG9iamVjdC1vcmllbnRlZCBsYW5ndWFnZSBkZXZlbG9wZWQgYnkgR29vZ2xlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly93d3cuZGFydGxhbmcub3JnL1xuV2Vic2l0ZTogaHR0cHM6Ly9kYXJ0LmRldlxuQ2F0ZWdvcnk6IHNjcmlwdGluZ1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGRhcnQoaGxqcykge1xuICBjb25zdCBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgdmFyaWFudHM6IFsgeyBiZWdpbjogJ1xcXFwkW0EtWmEtejAtOV9dKycgfSBdXG4gIH07XG5cbiAgY29uc3QgQlJBQ0VEX1NVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcJFxcey8sXG4gICAgICAgIGVuZDogL1xcfS9cbiAgICAgIH1cbiAgICBdLFxuICAgIGtleXdvcmRzOiAndHJ1ZSBmYWxzZSBudWxsIHRoaXMgaXMgbmV3IHN1cGVyJ1xuICB9O1xuXG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnclxcJ1xcJ1xcJycsXG4gICAgICAgIGVuZDogJ1xcJ1xcJ1xcJydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnclwiXCJcIicsXG4gICAgICAgIGVuZDogJ1wiXCJcIidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnclxcJycsXG4gICAgICAgIGVuZDogJ1xcJycsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnclwiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcJ1xcJ1xcJycsXG4gICAgICAgIGVuZDogJ1xcJ1xcJ1xcJycsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgIFNVQlNULFxuICAgICAgICAgIEJSQUNFRF9TVUJTVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1wiXCJcIicsXG4gICAgICAgIGVuZDogJ1wiXCJcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgIFNVQlNULFxuICAgICAgICAgIEJSQUNFRF9TVUJTVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcJycsXG4gICAgICAgIGVuZDogJ1xcJycsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgIFNVQlNULFxuICAgICAgICAgIEJSQUNFRF9TVUJTVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1wiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICBTVUJTVCxcbiAgICAgICAgICBCUkFDRURfU1VCU1RcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgQlJBQ0VEX1NVQlNULmNvbnRhaW5zID0gW1xuICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICBTVFJJTkdcbiAgXTtcblxuICBjb25zdCBCVUlMVF9JTl9UWVBFUyA9IFtcbiAgICAvLyBkYXJ0OmNvcmVcbiAgICAnQ29tcGFyYWJsZScsXG4gICAgJ0RhdGVUaW1lJyxcbiAgICAnRHVyYXRpb24nLFxuICAgICdGdW5jdGlvbicsXG4gICAgJ0l0ZXJhYmxlJyxcbiAgICAnSXRlcmF0b3InLFxuICAgICdMaXN0JyxcbiAgICAnTWFwJyxcbiAgICAnTWF0Y2gnLFxuICAgICdPYmplY3QnLFxuICAgICdQYXR0ZXJuJyxcbiAgICAnUmVnRXhwJyxcbiAgICAnU2V0JyxcbiAgICAnU3RvcHdhdGNoJyxcbiAgICAnU3RyaW5nJyxcbiAgICAnU3RyaW5nQnVmZmVyJyxcbiAgICAnU3RyaW5nU2luaycsXG4gICAgJ1N5bWJvbCcsXG4gICAgJ1R5cGUnLFxuICAgICdVcmknLFxuICAgICdib29sJyxcbiAgICAnZG91YmxlJyxcbiAgICAnaW50JyxcbiAgICAnbnVtJyxcbiAgICAvLyBkYXJ0Omh0bWxcbiAgICAnRWxlbWVudCcsXG4gICAgJ0VsZW1lbnRMaXN0J1xuICBdO1xuICBjb25zdCBOVUxMQUJMRV9CVUlMVF9JTl9UWVBFUyA9IEJVSUxUX0lOX1RZUEVTLm1hcCgoZSkgPT4gYCR7ZX0/YCk7XG5cbiAgY29uc3QgQkFTSUNfS0VZV09SRFMgPSBbXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiYXNcIixcbiAgICBcImFzc2VydFwiLFxuICAgIFwiYXN5bmNcIixcbiAgICBcImF3YWl0XCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImNvdmFyaWFudFwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZGVmZXJyZWRcIixcbiAgICBcImRvXCIsXG4gICAgXCJkeW5hbWljXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJleHBvcnRcIixcbiAgICBcImV4dGVuZHNcIixcbiAgICBcImV4dGVuc2lvblwiLFxuICAgIFwiZXh0ZXJuYWxcIixcbiAgICBcImZhY3RvcnlcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJGdW5jdGlvblwiLFxuICAgIFwiZ2V0XCIsXG4gICAgXCJoaWRlXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wbGVtZW50c1wiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJpblwiLFxuICAgIFwiaW5mZXJmYWNlXCIsXG4gICAgXCJpc1wiLFxuICAgIFwibGF0ZVwiLFxuICAgIFwibGlicmFyeVwiLFxuICAgIFwibWl4aW5cIixcbiAgICBcIm5ld1wiLFxuICAgIFwibnVsbFwiLFxuICAgIFwib25cIixcbiAgICBcIm9wZXJhdG9yXCIsXG4gICAgXCJwYXJ0XCIsXG4gICAgXCJyZXF1aXJlZFwiLFxuICAgIFwicmV0aHJvd1wiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJzZXRcIixcbiAgICBcInNob3dcIixcbiAgICBcInN0YXRpY1wiLFxuICAgIFwic3VwZXJcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwic3luY1wiLFxuICAgIFwidGhpc1wiLFxuICAgIFwidGhyb3dcIixcbiAgICBcInRydWVcIixcbiAgICBcInRyeVwiLFxuICAgIFwidHlwZWRlZlwiLFxuICAgIFwidmFyXCIsXG4gICAgXCJ2b2lkXCIsXG4gICAgXCJ3aGlsZVwiLFxuICAgIFwid2l0aFwiLFxuICAgIFwieWllbGRcIlxuICBdO1xuXG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6IEJBU0lDX0tFWVdPUkRTLFxuICAgIGJ1aWx0X2luOlxuICAgICAgQlVJTFRfSU5fVFlQRVNcbiAgICAgICAgLmNvbmNhdChOVUxMQUJMRV9CVUlMVF9JTl9UWVBFUylcbiAgICAgICAgLmNvbmNhdChbXG4gICAgICAgICAgLy8gZGFydDpjb3JlXG4gICAgICAgICAgJ05ldmVyJyxcbiAgICAgICAgICAnTnVsbCcsXG4gICAgICAgICAgJ2R5bmFtaWMnLFxuICAgICAgICAgICdwcmludCcsXG4gICAgICAgICAgLy8gZGFydDpodG1sXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAncXVlcnlTZWxlY3RvcicsXG4gICAgICAgICAgJ3F1ZXJ5U2VsZWN0b3JBbGwnLFxuICAgICAgICAgICd3aW5kb3cnXG4gICAgICAgIF0pLFxuICAgICRwYXR0ZXJuOiAvW0EtWmEtel1bQS1aYS16MC05X10qXFw/Py9cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdEYXJ0JyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFNUUklORyxcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgL1xcL1xcKlxcKig/IVxcLykvLFxuICAgICAgICAvXFwqXFwvLyxcbiAgICAgICAge1xuICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnbWFya2Rvd24nLFxuICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICB9XG4gICAgICApLFxuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAvXFwvezMsfSA/LyxcbiAgICAgICAgLyQvLCB7IGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdtYXJrZG93bicsXG4gICAgICAgICAgICBiZWdpbjogJy4nLFxuICAgICAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9XG4gICAgICAgIF0gfVxuICAgICAgKSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGVuZDogL1xcey8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgeyBiZWdpbktleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyB9LFxuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICB9LFxuICAgICAgeyBiZWdpbjogJz0+JyAvLyBObyBtYXJrdXAsIGp1c3QgYSByZWxldmFuY2UgYm9vc3RlclxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZGFydCBhcyBkZWZhdWx0IH07XG4iXX0=