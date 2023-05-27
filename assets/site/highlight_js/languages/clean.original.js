function clean(hljs) {
    const KEYWORDS = [
        "if",
        "let",
        "in",
        "with",
        "where",
        "case",
        "of",
        "class",
        "instance",
        "otherwise",
        "implementation",
        "definition",
        "system",
        "module",
        "from",
        "import",
        "qualified",
        "as",
        "special",
        "code",
        "inline",
        "foreign",
        "export",
        "ccall",
        "stdcall",
        "generic",
        "derive",
        "infix",
        "infixl",
        "infixr"
    ];
    return {
        name: 'Clean',
        aliases: [
            'icl',
            'dcl'
        ],
        keywords: {
            keyword: KEYWORDS,
            built_in: 'Int Real Char Bool',
            literal: 'True False'
        },
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE,
            {
                begin: '->|<-[|:]?|#!?|>>=|\\{\\||\\|\\}|:==|=:|<>'
            }
        ]
    };
}
export { clean as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9jbGVhbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsSUFBSTtRQUNKLEtBQUs7UUFDTCxJQUFJO1FBQ0osTUFBTTtRQUNOLE9BQU87UUFDUCxNQUFNO1FBQ04sSUFBSTtRQUNKLE9BQU87UUFDUCxVQUFVO1FBQ1YsV0FBVztRQUNYLGdCQUFnQjtRQUNoQixZQUFZO1FBQ1osUUFBUTtRQUNSLFFBQVE7UUFDUixNQUFNO1FBQ04sUUFBUTtRQUNSLFdBQVc7UUFDWCxJQUFJO1FBQ0osU0FBUztRQUNULE1BQU07UUFDTixRQUFRO1FBQ1IsU0FBUztRQUNULFFBQVE7UUFDUixPQUFPO1FBQ1AsU0FBUztRQUNULFNBQVM7UUFDVCxRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO0tBQ1QsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRTtZQUNQLEtBQUs7WUFDTCxLQUFLO1NBQ047UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQ04sb0JBQW9CO1lBQ3RCLE9BQU8sRUFDTCxZQUFZO1NBQ2Y7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxhQUFhO1lBQ2xCO2dCQUNFLEtBQUssRUFBRSw0Q0FBNEM7YUFBRTtTQUN4RDtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQ2xlYW5cbkF1dGhvcjogQ2FtaWwgU3RhcHMgPGluZm9AY2FtaWxzdGFwcy5ubD5cbkNhdGVnb3J5OiBmdW5jdGlvbmFsXG5XZWJzaXRlOiBodHRwOi8vY2xlYW4uY3MucnUubmxcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBjbGVhbihobGpzKSB7XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwiaWZcIixcbiAgICBcImxldFwiLFxuICAgIFwiaW5cIixcbiAgICBcIndpdGhcIixcbiAgICBcIndoZXJlXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJvZlwiLFxuICAgIFwiY2xhc3NcIixcbiAgICBcImluc3RhbmNlXCIsXG4gICAgXCJvdGhlcndpc2VcIixcbiAgICBcImltcGxlbWVudGF0aW9uXCIsXG4gICAgXCJkZWZpbml0aW9uXCIsXG4gICAgXCJzeXN0ZW1cIixcbiAgICBcIm1vZHVsZVwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJxdWFsaWZpZWRcIixcbiAgICBcImFzXCIsXG4gICAgXCJzcGVjaWFsXCIsXG4gICAgXCJjb2RlXCIsXG4gICAgXCJpbmxpbmVcIixcbiAgICBcImZvcmVpZ25cIixcbiAgICBcImV4cG9ydFwiLFxuICAgIFwiY2NhbGxcIixcbiAgICBcInN0ZGNhbGxcIixcbiAgICBcImdlbmVyaWNcIixcbiAgICBcImRlcml2ZVwiLFxuICAgIFwiaW5maXhcIixcbiAgICBcImluZml4bFwiLFxuICAgIFwiaW5maXhyXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQ2xlYW4nLFxuICAgIGFsaWFzZXM6IFtcbiAgICAgICdpY2wnLFxuICAgICAgJ2RjbCdcbiAgICBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiBLRVlXT1JEUyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnSW50IFJlYWwgQ2hhciBCb29sJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdUcnVlIEZhbHNlJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgeyAvLyByZWxldmFuY2UgYm9vc3RlclxuICAgICAgICBiZWdpbjogJy0+fDwtW3w6XT98IyE/fD4+PXxcXFxce1xcXFx8fFxcXFx8XFxcXH18Oj09fD06fDw+JyB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBjbGVhbiBhcyBkZWZhdWx0IH07XG4iXX0=