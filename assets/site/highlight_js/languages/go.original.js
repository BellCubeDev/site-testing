function go(hljs) {
    const LITERALS = [
        "true",
        "false",
        "iota",
        "nil"
    ];
    const BUILT_INS = [
        "append",
        "cap",
        "close",
        "complex",
        "copy",
        "imag",
        "len",
        "make",
        "new",
        "panic",
        "print",
        "println",
        "real",
        "recover",
        "delete"
    ];
    const TYPES = [
        "bool",
        "byte",
        "complex64",
        "complex128",
        "error",
        "float32",
        "float64",
        "int8",
        "int16",
        "int32",
        "int64",
        "string",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "int",
        "uint",
        "uintptr",
        "rune"
    ];
    const KWS = [
        "break",
        "case",
        "chan",
        "const",
        "continue",
        "default",
        "defer",
        "else",
        "fallthrough",
        "for",
        "func",
        "go",
        "goto",
        "if",
        "import",
        "interface",
        "map",
        "package",
        "range",
        "return",
        "select",
        "struct",
        "switch",
        "type",
        "var",
    ];
    const KEYWORDS = {
        keyword: KWS,
        type: TYPES,
        literal: LITERALS,
        built_in: BUILT_INS
    };
    return {
        name: 'Go',
        aliases: ['golang'],
        keywords: KEYWORDS,
        illegal: '</',
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'string',
                variants: [
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    {
                        begin: '`',
                        end: '`'
                    }
                ]
            },
            {
                className: 'number',
                variants: [
                    {
                        begin: hljs.C_NUMBER_RE + '[i]',
                        relevance: 1
                    },
                    hljs.C_NUMBER_MODE
                ]
            },
            { begin: /:=/
            },
            {
                className: 'function',
                beginKeywords: 'func',
                end: '\\s*(\\{|$)',
                excludeEnd: true,
                contains: [
                    hljs.TITLE_MODE,
                    {
                        className: 'params',
                        begin: /\(/,
                        end: /\)/,
                        endsParent: true,
                        keywords: KEYWORDS,
                        illegal: /["']/
                    }
                ]
            }
        ]
    };
}
export { go as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ28uanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9nby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLEVBQUUsQ0FBQyxJQUFJO0lBQ2QsTUFBTSxRQUFRLEdBQUc7UUFDZixNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixLQUFLO0tBQ04sQ0FBQztJQUNGLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFFBQVE7UUFDUixLQUFLO1FBQ0wsT0FBTztRQUNQLFNBQVM7UUFDVCxNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxPQUFPO1FBQ1AsU0FBUztRQUNULE1BQU07UUFDTixTQUFTO1FBQ1QsUUFBUTtLQUNULENBQUM7SUFDRixNQUFNLEtBQUssR0FBRztRQUNaLE1BQU07UUFDTixNQUFNO1FBQ04sV0FBVztRQUNYLFlBQVk7UUFDWixPQUFPO1FBQ1AsU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLE9BQU87UUFDUCxRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixLQUFLO1FBQ0wsTUFBTTtRQUNOLFNBQVM7UUFDVCxNQUFNO0tBQ1AsQ0FBQztJQUNGLE1BQU0sR0FBRyxHQUFHO1FBQ1YsT0FBTztRQUNQLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLFVBQVU7UUFDVixTQUFTO1FBQ1QsT0FBTztRQUNQLE1BQU07UUFDTixhQUFhO1FBQ2IsS0FBSztRQUNMLE1BQU07UUFDTixJQUFJO1FBQ0osTUFBTTtRQUNOLElBQUk7UUFDSixRQUFRO1FBQ1IsV0FBVztRQUNYLEtBQUs7UUFDTCxTQUFTO1FBQ1QsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixNQUFNO1FBQ04sS0FBSztLQUNOLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFBRSxHQUFHO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsUUFBUTtRQUNqQixRQUFRLEVBQUUsU0FBUztLQUNwQixDQUFDO0lBQ0YsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLENBQUUsUUFBUSxDQUFFO1FBQ3JCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsb0JBQW9CO1lBQ3pCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGlCQUFpQjtvQkFDdEIsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckI7d0JBQ0UsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsR0FBRyxFQUFFLEdBQUc7cUJBQ1Q7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSzt3QkFDL0IsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxDQUFDLGFBQWE7aUJBQ25CO2FBQ0Y7WUFDRCxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQ1o7WUFDRDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsYUFBYSxFQUFFLE1BQU07Z0JBQ3JCLEdBQUcsRUFBRSxhQUFhO2dCQUNsQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsUUFBUSxFQUFFO29CQUNSLElBQUksQ0FBQyxVQUFVO29CQUNmO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsSUFBSTt3QkFDWCxHQUFHLEVBQUUsSUFBSTt3QkFDVCxVQUFVLEVBQUUsSUFBSTt3QkFDaEIsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLE9BQU8sRUFBRSxNQUFNO3FCQUNoQjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxFQUFFLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IEdvXG5BdXRob3I6IFN0ZXBoYW4gS291bnRzbyBha2EgU3RlcExnIDxzdGVwbGdAZ21haWwuY29tPlxuQ29udHJpYnV0b3JzOiBFdmdlbnkgU3RlcGFuaXNjaGV2IDxpbWJvbGtAZ21haWwuY29tPlxuRGVzY3JpcHRpb246IEdvb2dsZSBnbyBsYW5ndWFnZSAoZ29sYW5nKS4gRm9yIGluZm8gYWJvdXQgbGFuZ3VhZ2VcbldlYnNpdGU6IGh0dHA6Ly9nb2xhbmcub3JnL1xuQ2F0ZWdvcnk6IGNvbW1vbiwgc3lzdGVtXG4qL1xuXG5mdW5jdGlvbiBnbyhobGpzKSB7XG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIixcbiAgICBcImlvdGFcIixcbiAgICBcIm5pbFwiXG4gIF07XG4gIGNvbnN0IEJVSUxUX0lOUyA9IFtcbiAgICBcImFwcGVuZFwiLFxuICAgIFwiY2FwXCIsXG4gICAgXCJjbG9zZVwiLFxuICAgIFwiY29tcGxleFwiLFxuICAgIFwiY29weVwiLFxuICAgIFwiaW1hZ1wiLFxuICAgIFwibGVuXCIsXG4gICAgXCJtYWtlXCIsXG4gICAgXCJuZXdcIixcbiAgICBcInBhbmljXCIsXG4gICAgXCJwcmludFwiLFxuICAgIFwicHJpbnRsblwiLFxuICAgIFwicmVhbFwiLFxuICAgIFwicmVjb3ZlclwiLFxuICAgIFwiZGVsZXRlXCJcbiAgXTtcbiAgY29uc3QgVFlQRVMgPSBbXG4gICAgXCJib29sXCIsXG4gICAgXCJieXRlXCIsXG4gICAgXCJjb21wbGV4NjRcIixcbiAgICBcImNvbXBsZXgxMjhcIixcbiAgICBcImVycm9yXCIsXG4gICAgXCJmbG9hdDMyXCIsXG4gICAgXCJmbG9hdDY0XCIsXG4gICAgXCJpbnQ4XCIsXG4gICAgXCJpbnQxNlwiLFxuICAgIFwiaW50MzJcIixcbiAgICBcImludDY0XCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcInVpbnQ4XCIsXG4gICAgXCJ1aW50MTZcIixcbiAgICBcInVpbnQzMlwiLFxuICAgIFwidWludDY0XCIsXG4gICAgXCJpbnRcIixcbiAgICBcInVpbnRcIixcbiAgICBcInVpbnRwdHJcIixcbiAgICBcInJ1bmVcIlxuICBdO1xuICBjb25zdCBLV1MgPSBbXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2hhblwiLFxuICAgIFwiY29uc3RcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJkZWZlclwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZmFsbHRocm91Z2hcIixcbiAgICBcImZvclwiLFxuICAgIFwiZnVuY1wiLFxuICAgIFwiZ29cIixcbiAgICBcImdvdG9cIixcbiAgICBcImlmXCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwibWFwXCIsXG4gICAgXCJwYWNrYWdlXCIsXG4gICAgXCJyYW5nZVwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJzZWxlY3RcIixcbiAgICBcInN0cnVjdFwiLFxuICAgIFwic3dpdGNoXCIsXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJ2YXJcIixcbiAgXTtcbiAgY29uc3QgS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDogS1dTLFxuICAgIHR5cGU6IFRZUEVTLFxuICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgIGJ1aWx0X2luOiBCVUlMVF9JTlNcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnR28nLFxuICAgIGFsaWFzZXM6IFsgJ2dvbGFuZycgXSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogJ2AnLFxuICAgICAgICAgICAgZW5kOiAnYCdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUgKyAnW2ldJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7IGJlZ2luOiAvOj0vIC8vIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdmdW5jJyxcbiAgICAgICAgZW5kOiAnXFxcXHMqKFxcXFx7fCQpJyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLlRJVExFX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgICAgICBlbmRzUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgICAgICAgICAgaWxsZWdhbDogL1tcIiddL1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZ28gYXMgZGVmYXVsdCB9O1xuIl19