function monkey(hljs) {
    const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
            { begin: '[$][a-fA-F0-9]+' },
            hljs.NUMBER_MODE
        ]
    };
    const FUNC_DEFINITION = {
        variants: [
            { match: [
                    /(function|method)/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE,
                ] },
        ],
        scope: {
            1: "keyword",
            3: "title.function"
        }
    };
    const CLASS_DEFINITION = {
        variants: [
            { match: [
                    /(class|interface|extends|implements)/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE,
                ] },
        ],
        scope: {
            1: "keyword",
            3: "title.class"
        }
    };
    const BUILT_INS = [
        "DebugLog",
        "DebugStop",
        "Error",
        "Print",
        "ACos",
        "ACosr",
        "ASin",
        "ASinr",
        "ATan",
        "ATan2",
        "ATan2r",
        "ATanr",
        "Abs",
        "Abs",
        "Ceil",
        "Clamp",
        "Clamp",
        "Cos",
        "Cosr",
        "Exp",
        "Floor",
        "Log",
        "Max",
        "Max",
        "Min",
        "Min",
        "Pow",
        "Sgn",
        "Sgn",
        "Sin",
        "Sinr",
        "Sqrt",
        "Tan",
        "Tanr",
        "Seed",
        "PI",
        "HALFPI",
        "TWOPI"
    ];
    const LITERALS = [
        "true",
        "false",
        "null"
    ];
    const KEYWORDS = [
        "public",
        "private",
        "property",
        "continue",
        "exit",
        "extern",
        "new",
        "try",
        "catch",
        "eachin",
        "not",
        "abstract",
        "final",
        "select",
        "case",
        "default",
        "const",
        "local",
        "global",
        "field",
        "end",
        "if",
        "then",
        "else",
        "elseif",
        "endif",
        "while",
        "wend",
        "repeat",
        "until",
        "forever",
        "for",
        "to",
        "step",
        "next",
        "return",
        "module",
        "inline",
        "throw",
        "import",
        "and",
        "or",
        "shl",
        "shr",
        "mod"
    ];
    return {
        name: 'Monkey',
        case_insensitive: true,
        keywords: {
            keyword: KEYWORDS,
            built_in: BUILT_INS,
            literal: LITERALS
        },
        illegal: /\/\*/,
        contains: [
            hljs.COMMENT('#rem', '#end'),
            hljs.COMMENT("'", '$', { relevance: 0 }),
            FUNC_DEFINITION,
            CLASS_DEFINITION,
            {
                className: 'variable.language',
                begin: /\b(self|super)\b/
            },
            {
                className: 'meta',
                begin: /\s*#/,
                end: '$',
                keywords: { keyword: 'if else elseif endif end then' }
            },
            {
                match: [
                    /^\s*/,
                    /strict\b/
                ],
                scope: { 2: "meta" }
            },
            {
                beginKeywords: 'alias',
                end: '=',
                contains: [hljs.UNDERSCORE_TITLE_MODE]
            },
            hljs.QUOTE_STRING_MODE,
            NUMBER
        ]
    };
}
export { monkey as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ua2V5LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvbW9ua2V5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixTQUFTLEVBQUUsQ0FBQztRQUNaLFFBQVEsRUFBRTtZQUNSLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXO1NBQ2pCO0tBQ0YsQ0FBQztJQUNGLE1BQU0sZUFBZSxHQUFHO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLEVBQUUsS0FBSyxFQUFFO29CQUNQLG1CQUFtQjtvQkFDbkIsS0FBSztvQkFDTCxJQUFJLENBQUMsbUJBQW1CO2lCQUN6QixFQUFFO1NBQ0o7UUFDRCxLQUFLLEVBQUU7WUFDTCxDQUFDLEVBQUUsU0FBUztZQUNaLENBQUMsRUFBRSxnQkFBZ0I7U0FDcEI7S0FDRixDQUFDO0lBQ0YsTUFBTSxnQkFBZ0IsR0FBRztRQUN2QixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRTtvQkFDUCxzQ0FBc0M7b0JBQ3RDLEtBQUs7b0JBQ0wsSUFBSSxDQUFDLG1CQUFtQjtpQkFDekIsRUFBRTtTQUNKO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsQ0FBQyxFQUFFLFNBQVM7WUFDWixDQUFDLEVBQUUsYUFBYTtTQUNqQjtLQUNGLENBQUM7SUFDRixNQUFNLFNBQVMsR0FBRztRQUNoQixVQUFVO1FBQ1YsV0FBVztRQUNYLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsUUFBUTtRQUNSLE9BQU87UUFDUCxLQUFLO1FBQ0wsS0FBSztRQUNMLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztRQUNQLEtBQUs7UUFDTCxNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxNQUFNO1FBQ04sTUFBTTtRQUNOLElBQUk7UUFDSixRQUFRO1FBQ1IsT0FBTztLQUNSLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtLQUNQLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLFFBQVE7UUFDUixTQUFTO1FBQ1QsVUFBVTtRQUNWLFVBQVU7UUFDVixNQUFNO1FBQ04sUUFBUTtRQUNSLEtBQUs7UUFDTCxLQUFLO1FBQ0wsT0FBTztRQUNQLFFBQVE7UUFDUixLQUFLO1FBQ0wsVUFBVTtRQUNWLE9BQU87UUFDUCxRQUFRO1FBQ1IsTUFBTTtRQUNOLFNBQVM7UUFDVCxPQUFPO1FBQ1AsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsS0FBSztRQUNMLElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtRQUNOLFFBQVE7UUFDUixPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixRQUFRO1FBQ1IsT0FBTztRQUNQLFNBQVM7UUFDVCxLQUFLO1FBQ0wsSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO1FBQ04sUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVE7UUFFUixLQUFLO1FBQ0wsSUFBSTtRQUNKLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztLQUNOLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFFBQVEsRUFBRSxTQUFTO1lBQ25CLE9BQU8sRUFBRSxRQUFRO1NBQ2xCO1FBQ0QsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FDVixHQUFHLEVBQ0gsR0FBRyxFQUNILEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUNqQjtZQUNELGVBQWU7WUFDZixnQkFBZ0I7WUFDaEI7Z0JBQ0UsU0FBUyxFQUFFLG1CQUFtQjtnQkFDOUIsS0FBSyxFQUFFLGtCQUFrQjthQUMxQjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsTUFBTTtnQkFDYixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUU7YUFDdkQ7WUFDRDtnQkFDRSxLQUFLLEVBQUU7b0JBQ0wsTUFBTTtvQkFDTixVQUFVO2lCQUNYO2dCQUNELEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7YUFDckI7WUFDRDtnQkFDRSxhQUFhLEVBQUUsT0FBTztnQkFDdEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFLENBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFFO2FBQ3pDO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixNQUFNO1NBQ1A7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IE1vbmtleVxuRGVzY3JpcHRpb246IE1vbmtleTIgaXMgYW4gZWFzeSB0byB1c2UsIGNyb3NzIHBsYXRmb3JtLCBnYW1lcyBvcmllbnRlZCBwcm9ncmFtbWluZyBsYW5ndWFnZSBmcm9tIEJsaXR6IFJlc2VhcmNoLlxuQXV0aG9yOiBBcnRodXIgQmlrbXVsbGluIDxkZXZvbG9udGVyQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vYmxpdHpyZXNlYXJjaC5pdGNoLmlvL21vbmtleTJcbiovXG5cbmZ1bmN0aW9uIG1vbmtleShobGpzKSB7XG4gIGNvbnN0IE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ1skXVthLWZBLUYwLTldKycgfSxcbiAgICAgIGhsanMuTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG4gIGNvbnN0IEZVTkNfREVGSU5JVElPTiA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBtYXRjaDogW1xuICAgICAgICAvKGZ1bmN0aW9ufG1ldGhvZCkvLFxuICAgICAgICAvXFxzKy8sXG4gICAgICAgIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICAgIF0gfSxcbiAgICBdLFxuICAgIHNjb3BlOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgIH1cbiAgfTtcbiAgY29uc3QgQ0xBU1NfREVGSU5JVElPTiA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBtYXRjaDogW1xuICAgICAgICAvKGNsYXNzfGludGVyZmFjZXxleHRlbmRzfGltcGxlbWVudHMpLyxcbiAgICAgICAgL1xccysvLFxuICAgICAgICBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICBdIH0sXG4gICAgXSxcbiAgICBzY29wZToge1xuICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAzOiBcInRpdGxlLmNsYXNzXCJcbiAgICB9XG4gIH07XG4gIGNvbnN0IEJVSUxUX0lOUyA9IFtcbiAgICBcIkRlYnVnTG9nXCIsXG4gICAgXCJEZWJ1Z1N0b3BcIixcbiAgICBcIkVycm9yXCIsXG4gICAgXCJQcmludFwiLFxuICAgIFwiQUNvc1wiLFxuICAgIFwiQUNvc3JcIixcbiAgICBcIkFTaW5cIixcbiAgICBcIkFTaW5yXCIsXG4gICAgXCJBVGFuXCIsXG4gICAgXCJBVGFuMlwiLFxuICAgIFwiQVRhbjJyXCIsXG4gICAgXCJBVGFuclwiLFxuICAgIFwiQWJzXCIsXG4gICAgXCJBYnNcIixcbiAgICBcIkNlaWxcIixcbiAgICBcIkNsYW1wXCIsXG4gICAgXCJDbGFtcFwiLFxuICAgIFwiQ29zXCIsXG4gICAgXCJDb3NyXCIsXG4gICAgXCJFeHBcIixcbiAgICBcIkZsb29yXCIsXG4gICAgXCJMb2dcIixcbiAgICBcIk1heFwiLFxuICAgIFwiTWF4XCIsXG4gICAgXCJNaW5cIixcbiAgICBcIk1pblwiLFxuICAgIFwiUG93XCIsXG4gICAgXCJTZ25cIixcbiAgICBcIlNnblwiLFxuICAgIFwiU2luXCIsXG4gICAgXCJTaW5yXCIsXG4gICAgXCJTcXJ0XCIsXG4gICAgXCJUYW5cIixcbiAgICBcIlRhbnJcIixcbiAgICBcIlNlZWRcIixcbiAgICBcIlBJXCIsXG4gICAgXCJIQUxGUElcIixcbiAgICBcIlRXT1BJXCJcbiAgXTtcbiAgY29uc3QgTElURVJBTFMgPSBbXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwibnVsbFwiXG4gIF07XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwicHVibGljXCIsXG4gICAgXCJwcml2YXRlXCIsXG4gICAgXCJwcm9wZXJ0eVwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImV4aXRcIixcbiAgICBcImV4dGVyblwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJ0cnlcIixcbiAgICBcImNhdGNoXCIsXG4gICAgXCJlYWNoaW5cIixcbiAgICBcIm5vdFwiLFxuICAgIFwiYWJzdHJhY3RcIixcbiAgICBcImZpbmFsXCIsXG4gICAgXCJzZWxlY3RcIixcbiAgICBcImNhc2VcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJsb2NhbFwiLFxuICAgIFwiZ2xvYmFsXCIsXG4gICAgXCJmaWVsZFwiLFxuICAgIFwiZW5kXCIsXG4gICAgXCJpZlwiLFxuICAgIFwidGhlblwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZWxzZWlmXCIsXG4gICAgXCJlbmRpZlwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcIndlbmRcIixcbiAgICBcInJlcGVhdFwiLFxuICAgIFwidW50aWxcIixcbiAgICBcImZvcmV2ZXJcIixcbiAgICBcImZvclwiLFxuICAgIFwidG9cIixcbiAgICBcInN0ZXBcIixcbiAgICBcIm5leHRcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwibW9kdWxlXCIsXG4gICAgXCJpbmxpbmVcIixcbiAgICBcInRocm93XCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICAvLyBub3QgcG9zaXRpdmUsIGJ1dCB0aGVzZSBhcmUgbm90IGxpdGVyYWxzXG4gICAgXCJhbmRcIixcbiAgICBcIm9yXCIsXG4gICAgXCJzaGxcIixcbiAgICBcInNoclwiLFxuICAgIFwibW9kXCJcbiAgXTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdNb25rZXknLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTLFxuICAgICAgYnVpbHRfaW46IEJVSUxUX0lOUyxcbiAgICAgIGxpdGVyYWw6IExJVEVSQUxTXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAvXFwvXFwqLyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DT01NRU5UKCcjcmVtJywgJyNlbmQnKSxcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgXCInXCIsXG4gICAgICAgICckJyxcbiAgICAgICAgeyByZWxldmFuY2U6IDAgfVxuICAgICAgKSxcbiAgICAgIEZVTkNfREVGSU5JVElPTixcbiAgICAgIENMQVNTX0RFRklOSVRJT04sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlLmxhbmd1YWdlJyxcbiAgICAgICAgYmVnaW46IC9cXGIoc2VsZnxzdXBlcilcXGIvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46IC9cXHMqIy8sXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogeyBrZXl3b3JkOiAnaWYgZWxzZSBlbHNlaWYgZW5kaWYgZW5kIHRoZW4nIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL15cXHMqLyxcbiAgICAgICAgICAvc3RyaWN0XFxiL1xuICAgICAgICBdLFxuICAgICAgICBzY29wZTogeyAyOiBcIm1ldGFcIiB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnYWxpYXMnLFxuICAgICAgICBlbmQ6ICc9JyxcbiAgICAgICAgY29udGFpbnM6IFsgaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREUgXVxuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBOVU1CRVJcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IG1vbmtleSBhcyBkZWZhdWx0IH07XG4iXX0=