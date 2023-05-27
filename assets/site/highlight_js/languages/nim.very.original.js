function nim(hljs) {
    const TYPES = [
        "int",
        "int8",
        "int16",
        "int32",
        "int64",
        "uint",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "float",
        "float32",
        "float64",
        "bool",
        "char",
        "string",
        "cstring",
        "pointer",
        "expr",
        "stmt",
        "void",
        "auto",
        "any",
        "range",
        "array",
        "openarray",
        "varargs",
        "seq",
        "set",
        "clong",
        "culong",
        "cchar",
        "cschar",
        "cshort",
        "cint",
        "csize",
        "clonglong",
        "cfloat",
        "cdouble",
        "clongdouble",
        "cuchar",
        "cushort",
        "cuint",
        "culonglong",
        "cstringarray",
        "semistatic"
    ];
    const KEYWORDS = [
        "addr",
        "and",
        "as",
        "asm",
        "bind",
        "block",
        "break",
        "case",
        "cast",
        "const",
        "continue",
        "converter",
        "discard",
        "distinct",
        "div",
        "do",
        "elif",
        "else",
        "end",
        "enum",
        "except",
        "export",
        "finally",
        "for",
        "from",
        "func",
        "generic",
        "guarded",
        "if",
        "import",
        "in",
        "include",
        "interface",
        "is",
        "isnot",
        "iterator",
        "let",
        "macro",
        "method",
        "mixin",
        "mod",
        "nil",
        "not",
        "notin",
        "object",
        "of",
        "or",
        "out",
        "proc",
        "ptr",
        "raise",
        "ref",
        "return",
        "shared",
        "shl",
        "shr",
        "static",
        "template",
        "try",
        "tuple",
        "type",
        "using",
        "var",
        "when",
        "while",
        "with",
        "without",
        "xor",
        "yield"
    ];
    const BUILT_INS = [
        "stdin",
        "stdout",
        "stderr",
        "result"
    ];
    const LITERALS = [
        "true",
        "false"
    ];
    return {
        name: 'Nim',
        keywords: {
            keyword: KEYWORDS,
            literal: LITERALS,
            type: TYPES,
            built_in: BUILT_INS
        },
        contains: [
            {
                className: 'meta',
                begin: /\{\./,
                end: /\.\}/,
                relevance: 10
            },
            {
                className: 'string',
                begin: /[a-zA-Z]\w*"/,
                end: /"/,
                contains: [{ begin: /""/ }]
            },
            {
                className: 'string',
                begin: /([a-zA-Z]\w*)?"""/,
                end: /"""/
            },
            hljs.QUOTE_STRING_MODE,
            {
                className: 'type',
                begin: /\b[A-Z]\w+\b/,
                relevance: 0
            },
            {
                className: 'number',
                relevance: 0,
                variants: [
                    { begin: /\b(0[xX][0-9a-fA-F][_0-9a-fA-F]*)('?[iIuU](8|16|32|64))?/ },
                    { begin: /\b(0o[0-7][_0-7]*)('?[iIuUfF](8|16|32|64))?/ },
                    { begin: /\b(0(b|B)[01][_01]*)('?[iIuUfF](8|16|32|64))?/ },
                    { begin: /\b(\d[_\d]*)('?[iIuUfF](8|16|32|64))?/ }
                ]
            },
            hljs.HASH_COMMENT_MODE
        ]
    };
}
export { nim as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmltLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvbmltLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLEtBQUssR0FBRztRQUNaLEtBQUs7UUFDTCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixPQUFPO1FBQ1AsU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNO1FBQ04sTUFBTTtRQUNOLFFBQVE7UUFDUixTQUFTO1FBQ1QsU0FBUztRQUNULE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsT0FBTztRQUNQLE9BQU87UUFDUCxXQUFXO1FBQ1gsU0FBUztRQUNULEtBQUs7UUFDTCxLQUFLO1FBQ0wsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7UUFDUixNQUFNO1FBQ04sT0FBTztRQUNQLFdBQVc7UUFDWCxRQUFRO1FBQ1IsU0FBUztRQUNULGFBQWE7UUFDYixRQUFRO1FBQ1IsU0FBUztRQUNULE9BQU87UUFDUCxZQUFZO1FBQ1osY0FBYztRQUNkLFlBQVk7S0FDYixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUc7UUFDZixNQUFNO1FBQ04sS0FBSztRQUNMLElBQUk7UUFDSixLQUFLO1FBQ0wsTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsVUFBVTtRQUNWLFdBQVc7UUFDWCxTQUFTO1FBQ1QsVUFBVTtRQUNWLEtBQUs7UUFDTCxJQUFJO1FBQ0osTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsTUFBTTtRQUNOLFFBQVE7UUFDUixRQUFRO1FBQ1IsU0FBUztRQUNULEtBQUs7UUFDTCxNQUFNO1FBQ04sTUFBTTtRQUNOLFNBQVM7UUFDVCxTQUFTO1FBQ1QsSUFBSTtRQUNKLFFBQVE7UUFDUixJQUFJO1FBQ0osU0FBUztRQUNULFdBQVc7UUFDWCxJQUFJO1FBQ0osT0FBTztRQUNQLFVBQVU7UUFDVixLQUFLO1FBQ0wsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsT0FBTztRQUNQLFFBQVE7UUFDUixJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7UUFDTCxNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxLQUFLO1FBQ0wsUUFBUTtRQUNSLFFBQVE7UUFDUixLQUFLO1FBQ0wsS0FBSztRQUNMLFFBQVE7UUFDUixVQUFVO1FBQ1YsS0FBSztRQUNMLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLEtBQUs7UUFDTCxNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixTQUFTO1FBQ1QsS0FBSztRQUNMLE9BQU87S0FDUixDQUFDO0lBQ0YsTUFBTSxTQUFTLEdBQUc7UUFDaEIsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtLQUNULENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLE1BQU07UUFDTixPQUFPO0tBQ1IsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLFNBQVM7U0FDcEI7UUFDRCxRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsR0FBRyxFQUFFLE1BQU07Z0JBQ1gsU0FBUyxFQUFFLEVBQUU7YUFDZDtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsY0FBYztnQkFDckIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUU7YUFDOUI7WUFDRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsR0FBRyxFQUFFLEtBQUs7YUFDWDtZQUNELElBQUksQ0FBQyxpQkFBaUI7WUFDdEI7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxjQUFjO2dCQUNyQixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixFQUFFLEtBQUssRUFBRSwwREFBMEQsRUFBRTtvQkFDckUsRUFBRSxLQUFLLEVBQUUsNkNBQTZDLEVBQUU7b0JBQ3hELEVBQUUsS0FBSyxFQUFFLCtDQUErQyxFQUFFO29CQUMxRCxFQUFFLEtBQUssRUFBRSx1Q0FBdUMsRUFBRTtpQkFDbkQ7YUFDRjtZQUNELElBQUksQ0FBQyxpQkFBaUI7U0FDdkI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IE5pbVxuRGVzY3JpcHRpb246IE5pbSBpcyBhIHN0YXRpY2FsbHkgdHlwZWQgY29tcGlsZWQgc3lzdGVtcyBwcm9ncmFtbWluZyBsYW5ndWFnZS5cbldlYnNpdGU6IGh0dHBzOi8vbmltLWxhbmcub3JnXG5DYXRlZ29yeTogc3lzdGVtXG4qL1xuXG5mdW5jdGlvbiBuaW0oaGxqcykge1xuICBjb25zdCBUWVBFUyA9IFtcbiAgICBcImludFwiLFxuICAgIFwiaW50OFwiLFxuICAgIFwiaW50MTZcIixcbiAgICBcImludDMyXCIsXG4gICAgXCJpbnQ2NFwiLFxuICAgIFwidWludFwiLFxuICAgIFwidWludDhcIixcbiAgICBcInVpbnQxNlwiLFxuICAgIFwidWludDMyXCIsXG4gICAgXCJ1aW50NjRcIixcbiAgICBcImZsb2F0XCIsXG4gICAgXCJmbG9hdDMyXCIsXG4gICAgXCJmbG9hdDY0XCIsXG4gICAgXCJib29sXCIsXG4gICAgXCJjaGFyXCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcImNzdHJpbmdcIixcbiAgICBcInBvaW50ZXJcIixcbiAgICBcImV4cHJcIixcbiAgICBcInN0bXRcIixcbiAgICBcInZvaWRcIixcbiAgICBcImF1dG9cIixcbiAgICBcImFueVwiLFxuICAgIFwicmFuZ2VcIixcbiAgICBcImFycmF5XCIsXG4gICAgXCJvcGVuYXJyYXlcIixcbiAgICBcInZhcmFyZ3NcIixcbiAgICBcInNlcVwiLFxuICAgIFwic2V0XCIsXG4gICAgXCJjbG9uZ1wiLFxuICAgIFwiY3Vsb25nXCIsXG4gICAgXCJjY2hhclwiLFxuICAgIFwiY3NjaGFyXCIsXG4gICAgXCJjc2hvcnRcIixcbiAgICBcImNpbnRcIixcbiAgICBcImNzaXplXCIsXG4gICAgXCJjbG9uZ2xvbmdcIixcbiAgICBcImNmbG9hdFwiLFxuICAgIFwiY2RvdWJsZVwiLFxuICAgIFwiY2xvbmdkb3VibGVcIixcbiAgICBcImN1Y2hhclwiLFxuICAgIFwiY3VzaG9ydFwiLFxuICAgIFwiY3VpbnRcIixcbiAgICBcImN1bG9uZ2xvbmdcIixcbiAgICBcImNzdHJpbmdhcnJheVwiLFxuICAgIFwic2VtaXN0YXRpY1wiXG4gIF07XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwiYWRkclwiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJhc1wiLFxuICAgIFwiYXNtXCIsXG4gICAgXCJiaW5kXCIsXG4gICAgXCJibG9ja1wiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNhc3RcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiY29udmVydGVyXCIsXG4gICAgXCJkaXNjYXJkXCIsXG4gICAgXCJkaXN0aW5jdFwiLFxuICAgIFwiZGl2XCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZWxpZlwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZW5kXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJleGNlcHRcIixcbiAgICBcImV4cG9ydFwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJmdW5jXCIsXG4gICAgXCJnZW5lcmljXCIsXG4gICAgXCJndWFyZGVkXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJpblwiLFxuICAgIFwiaW5jbHVkZVwiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJpc1wiLFxuICAgIFwiaXNub3RcIixcbiAgICBcIml0ZXJhdG9yXCIsXG4gICAgXCJsZXRcIixcbiAgICBcIm1hY3JvXCIsXG4gICAgXCJtZXRob2RcIixcbiAgICBcIm1peGluXCIsXG4gICAgXCJtb2RcIixcbiAgICBcIm5pbFwiLFxuICAgIFwibm90XCIsXG4gICAgXCJub3RpblwiLFxuICAgIFwib2JqZWN0XCIsXG4gICAgXCJvZlwiLFxuICAgIFwib3JcIixcbiAgICBcIm91dFwiLFxuICAgIFwicHJvY1wiLFxuICAgIFwicHRyXCIsXG4gICAgXCJyYWlzZVwiLFxuICAgIFwicmVmXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInNoYXJlZFwiLFxuICAgIFwic2hsXCIsXG4gICAgXCJzaHJcIixcbiAgICBcInN0YXRpY1wiLFxuICAgIFwidGVtcGxhdGVcIixcbiAgICBcInRyeVwiLFxuICAgIFwidHVwbGVcIixcbiAgICBcInR5cGVcIixcbiAgICBcInVzaW5nXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcIndoZW5cIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJ3aXRoXCIsXG4gICAgXCJ3aXRob3V0XCIsXG4gICAgXCJ4b3JcIixcbiAgICBcInlpZWxkXCJcbiAgXTtcbiAgY29uc3QgQlVJTFRfSU5TID0gW1xuICAgIFwic3RkaW5cIixcbiAgICBcInN0ZG91dFwiLFxuICAgIFwic3RkZXJyXCIsXG4gICAgXCJyZXN1bHRcIlxuICBdO1xuICBjb25zdCBMSVRFUkFMUyA9IFtcbiAgICBcInRydWVcIixcbiAgICBcImZhbHNlXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnTmltJyxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogS0VZV09SRFMsXG4gICAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICAgIHR5cGU6IFRZUEVTLFxuICAgICAgYnVpbHRfaW46IEJVSUxUX0lOU1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsIC8vIEFjdHVhbGx5IHByYWdtYVxuICAgICAgICBiZWdpbjogL1xce1xcLi8sXG4gICAgICAgIGVuZDogL1xcLlxcfS8sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAvW2EtekEtWl1cXHcqXCIvLFxuICAgICAgICBlbmQ6IC9cIi8sXG4gICAgICAgIGNvbnRhaW5zOiBbIHsgYmVnaW46IC9cIlwiLyB9IF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAvKFthLXpBLVpdXFx3Kik/XCJcIlwiLyxcbiAgICAgICAgZW5kOiAvXCJcIlwiL1xuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICBiZWdpbjogL1xcYltBLVpdXFx3K1xcYi8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHsgYmVnaW46IC9cXGIoMFt4WF1bMC05YS1mQS1GXVtfMC05YS1mQS1GXSopKCc/W2lJdVVdKDh8MTZ8MzJ8NjQpKT8vIH0sXG4gICAgICAgICAgeyBiZWdpbjogL1xcYigwb1swLTddW18wLTddKikoJz9baUl1VWZGXSg4fDE2fDMyfDY0KSk/LyB9LFxuICAgICAgICAgIHsgYmVnaW46IC9cXGIoMChifEIpWzAxXVtfMDFdKikoJz9baUl1VWZGXSg4fDE2fDMyfDY0KSk/LyB9LFxuICAgICAgICAgIHsgYmVnaW46IC9cXGIoXFxkW19cXGRdKikoJz9baUl1VWZGXSg4fDE2fDMyfDY0KSk/LyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBuaW0gYXMgZGVmYXVsdCB9O1xuIl19