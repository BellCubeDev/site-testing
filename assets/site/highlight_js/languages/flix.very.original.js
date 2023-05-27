function flix(hljs) {
    const CHAR = {
        className: 'string',
        begin: /'(.|\\[xXuU][a-zA-Z0-9]+)'/
    };
    const STRING = {
        className: 'string',
        variants: [
            {
                begin: '"',
                end: '"'
            }
        ]
    };
    const NAME = {
        className: 'title',
        relevance: 0,
        begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/
    };
    const METHOD = {
        className: 'function',
        beginKeywords: 'def',
        end: /[:={\[(\n;]/,
        excludeEnd: true,
        contains: [NAME]
    };
    return {
        name: 'Flix',
        keywords: {
            keyword: [
                "case",
                "class",
                "def",
                "else",
                "enum",
                "if",
                "impl",
                "import",
                "in",
                "lat",
                "rel",
                "index",
                "let",
                "match",
                "namespace",
                "switch",
                "type",
                "yield",
                "with"
            ],
            literal: [
                "true",
                "false"
            ]
        },
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            CHAR,
            STRING,
            METHOD,
            hljs.C_NUMBER_MODE
        ]
    };
}
export { flix as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxpeC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2ZsaXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLElBQUksR0FBRztRQUNYLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSw0QkFBNEI7S0FDcEMsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7YUFDVDtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHO1FBQ1gsU0FBUyxFQUFFLE9BQU87UUFDbEIsU0FBUyxFQUFFLENBQUM7UUFDWixLQUFLLEVBQUUsZ0ZBQWdGO0tBQ3hGLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRztRQUNiLFNBQVMsRUFBRSxVQUFVO1FBQ3JCLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLEdBQUcsRUFBRSxhQUFhO1FBQ2xCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRSxDQUFFLElBQUksQ0FBRTtLQUNuQixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLE1BQU07Z0JBQ04sT0FBTztnQkFDUCxLQUFLO2dCQUNMLE1BQU07Z0JBQ04sTUFBTTtnQkFDTixJQUFJO2dCQUNKLE1BQU07Z0JBQ04sUUFBUTtnQkFDUixJQUFJO2dCQUNKLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxPQUFPO2dCQUNQLEtBQUs7Z0JBQ0wsT0FBTztnQkFDUCxXQUFXO2dCQUNYLFFBQVE7Z0JBQ1IsTUFBTTtnQkFDTixPQUFPO2dCQUNQLE1BQU07YUFDUDtZQUNELE9BQU8sRUFBRTtnQkFDUCxNQUFNO2dCQUNOLE9BQU87YUFDUjtTQUNGO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsb0JBQW9CO1lBQ3pCLElBQUk7WUFDSixNQUFNO1lBQ04sTUFBTTtZQUNOLElBQUksQ0FBQyxhQUFhO1NBQ25CO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiBMYW5ndWFnZTogRmxpeFxuIENhdGVnb3J5OiBmdW5jdGlvbmFsXG4gQXV0aG9yOiBNYWdudXMgTWFkc2VuIDxtbWFkc2VuQHV3YXRlcmxvby5jYT5cbiBXZWJzaXRlOiBodHRwczovL2ZsaXguZGV2L1xuICovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBmbGl4KGhsanMpIHtcbiAgY29uc3QgQ0hBUiA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvJygufFxcXFxbeFh1VV1bYS16QS1aMC05XSspJy9cbiAgfTtcblxuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ1wiJyxcbiAgICAgICAgZW5kOiAnXCInXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IE5BTUUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBiZWdpbjogL1teMC05XFxuXFx0IFwiJygpLC5ge31cXFtcXF06O11bXlxcblxcdCBcIicoKSwuYHt9XFxbXFxdOjtdK3xbXjAtOVxcblxcdCBcIicoKSwuYHt9XFxbXFxdOjs9XS9cbiAgfTtcblxuICBjb25zdCBNRVRIT0QgPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luS2V5d29yZHM6ICdkZWYnLFxuICAgIGVuZDogL1s6PXtcXFsoXFxuO10vLFxuICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgY29udGFpbnM6IFsgTkFNRSBdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnRmxpeCcsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IFtcbiAgICAgICAgXCJjYXNlXCIsXG4gICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgXCJkZWZcIixcbiAgICAgICAgXCJlbHNlXCIsXG4gICAgICAgIFwiZW51bVwiLFxuICAgICAgICBcImlmXCIsXG4gICAgICAgIFwiaW1wbFwiLFxuICAgICAgICBcImltcG9ydFwiLFxuICAgICAgICBcImluXCIsXG4gICAgICAgIFwibGF0XCIsXG4gICAgICAgIFwicmVsXCIsXG4gICAgICAgIFwiaW5kZXhcIixcbiAgICAgICAgXCJsZXRcIixcbiAgICAgICAgXCJtYXRjaFwiLFxuICAgICAgICBcIm5hbWVzcGFjZVwiLFxuICAgICAgICBcInN3aXRjaFwiLFxuICAgICAgICBcInR5cGVcIixcbiAgICAgICAgXCJ5aWVsZFwiLFxuICAgICAgICBcIndpdGhcIlxuICAgICAgXSxcbiAgICAgIGxpdGVyYWw6IFtcbiAgICAgICAgXCJ0cnVlXCIsXG4gICAgICAgIFwiZmFsc2VcIlxuICAgICAgXVxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBDSEFSLFxuICAgICAgU1RSSU5HLFxuICAgICAgTUVUSE9ELFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBmbGl4IGFzIGRlZmF1bHQgfTtcbiJdfQ==