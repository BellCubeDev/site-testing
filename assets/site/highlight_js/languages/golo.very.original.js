function golo(hljs) {
    const KEYWORDS = [
        "println",
        "readln",
        "print",
        "import",
        "module",
        "function",
        "local",
        "return",
        "let",
        "var",
        "while",
        "for",
        "foreach",
        "times",
        "in",
        "case",
        "when",
        "match",
        "with",
        "break",
        "continue",
        "augment",
        "augmentation",
        "each",
        "find",
        "filter",
        "reduce",
        "if",
        "then",
        "else",
        "otherwise",
        "try",
        "catch",
        "finally",
        "raise",
        "throw",
        "orIfNull",
        "DynamicObject|10",
        "DynamicVariable",
        "struct",
        "Observable",
        "map",
        "set",
        "vector",
        "list",
        "array"
    ];
    return {
        name: 'Golo',
        keywords: {
            keyword: KEYWORDS,
            literal: [
                "true",
                "false",
                "null"
            ]
        },
        contains: [
            hljs.HASH_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: '@[A-Za-z]+'
            }
        ]
    };
}
export { golo as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sby5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2dvbG8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLFFBQVEsR0FBRztRQUNmLFNBQVM7UUFDVCxRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsVUFBVTtRQUNWLE9BQU87UUFDUCxRQUFRO1FBQ1IsS0FBSztRQUNMLEtBQUs7UUFDTCxPQUFPO1FBQ1AsS0FBSztRQUNMLFNBQVM7UUFDVCxPQUFPO1FBQ1AsSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsVUFBVTtRQUNWLFNBQVM7UUFDVCxjQUFjO1FBQ2QsTUFBTTtRQUNOLE1BQU07UUFDTixRQUFRO1FBQ1IsUUFBUTtRQUNSLElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtRQUNOLFdBQVc7UUFDWCxLQUFLO1FBQ0wsT0FBTztRQUNQLFNBQVM7UUFDVCxPQUFPO1FBQ1AsT0FBTztRQUNQLFVBQVU7UUFDVixrQkFBa0I7UUFDbEIsaUJBQWlCO1FBQ2pCLFFBQVE7UUFDUixZQUFZO1FBQ1osS0FBSztRQUNMLEtBQUs7UUFDTCxRQUFRO1FBQ1IsTUFBTTtRQUNOLE9BQU87S0FDUixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFO2dCQUNQLE1BQU07Z0JBQ04sT0FBTztnQkFDUCxNQUFNO2FBQ1A7U0FDRjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxpQkFBaUI7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsYUFBYTtZQUNsQjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLFlBQVk7YUFDcEI7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogR29sb1xuQXV0aG9yOiBQaGlsaXBwZSBDaGFycmllcmUgPHBoLmNoYXJyaWVyZUBnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogYSBsaWdodHdlaWdodCBkeW5hbWljIGxhbmd1YWdlIGZvciB0aGUgSlZNXG5XZWJzaXRlOiBodHRwOi8vZ29sby1sYW5nLm9yZy9cbiovXG5cbmZ1bmN0aW9uIGdvbG8oaGxqcykge1xuICBjb25zdCBLRVlXT1JEUyA9IFtcbiAgICBcInByaW50bG5cIixcbiAgICBcInJlYWRsblwiLFxuICAgIFwicHJpbnRcIixcbiAgICBcImltcG9ydFwiLFxuICAgIFwibW9kdWxlXCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwibG9jYWxcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwibGV0XCIsXG4gICAgXCJ2YXJcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZvcmVhY2hcIixcbiAgICBcInRpbWVzXCIsXG4gICAgXCJpblwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwid2hlblwiLFxuICAgIFwibWF0Y2hcIixcbiAgICBcIndpdGhcIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiYXVnbWVudFwiLFxuICAgIFwiYXVnbWVudGF0aW9uXCIsXG4gICAgXCJlYWNoXCIsXG4gICAgXCJmaW5kXCIsXG4gICAgXCJmaWx0ZXJcIixcbiAgICBcInJlZHVjZVwiLFxuICAgIFwiaWZcIixcbiAgICBcInRoZW5cIixcbiAgICBcImVsc2VcIixcbiAgICBcIm90aGVyd2lzZVwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwicmFpc2VcIixcbiAgICBcInRocm93XCIsXG4gICAgXCJvcklmTnVsbFwiLFxuICAgIFwiRHluYW1pY09iamVjdHwxMFwiLFxuICAgIFwiRHluYW1pY1ZhcmlhYmxlXCIsXG4gICAgXCJzdHJ1Y3RcIixcbiAgICBcIk9ic2VydmFibGVcIixcbiAgICBcIm1hcFwiLFxuICAgIFwic2V0XCIsXG4gICAgXCJ2ZWN0b3JcIixcbiAgICBcImxpc3RcIixcbiAgICBcImFycmF5XCJcbiAgXTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdHb2xvJyxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogS0VZV09SRFMsXG4gICAgICBsaXRlcmFsOiBbXG4gICAgICAgIFwidHJ1ZVwiLFxuICAgICAgICBcImZhbHNlXCIsXG4gICAgICAgIFwibnVsbFwiXG4gICAgICBdXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBnb2xvIGFzIGRlZmF1bHQgfTtcbiJdfQ==