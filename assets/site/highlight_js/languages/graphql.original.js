function graphql(hljs) {
    const regex = hljs.regex;
    const GQL_NAME = /[_A-Za-z][_0-9A-Za-z]*/;
    return {
        name: "GraphQL",
        aliases: ["gql"],
        case_insensitive: true,
        disableAutodetect: false,
        keywords: {
            keyword: [
                "query",
                "mutation",
                "subscription",
                "type",
                "input",
                "schema",
                "directive",
                "interface",
                "union",
                "scalar",
                "fragment",
                "enum",
                "on"
            ],
            literal: [
                "true",
                "false",
                "null"
            ]
        },
        contains: [
            hljs.HASH_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            {
                scope: "punctuation",
                match: /[.]{3}/,
                relevance: 0
            },
            {
                scope: "punctuation",
                begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
                relevance: 0
            },
            {
                scope: "variable",
                begin: /\$/,
                end: /\W/,
                excludeEnd: true,
                relevance: 0
            },
            {
                scope: "meta",
                match: /@\w+/,
                excludeEnd: true
            },
            {
                scope: "symbol",
                begin: regex.concat(GQL_NAME, regex.lookahead(/\s*:/)),
                relevance: 0
            }
        ],
        illegal: [
            /[;<']/,
            /BEGIN/
        ]
    };
}
export { graphql as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2dyYXBocWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDO0lBQzFDLE9BQU87UUFDTCxJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxDQUFFLEtBQUssQ0FBRTtRQUNsQixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLE9BQU87Z0JBQ1AsVUFBVTtnQkFDVixjQUFjO2dCQUNkLE1BQU07Z0JBQ04sT0FBTztnQkFDUCxRQUFRO2dCQUNSLFdBQVc7Z0JBQ1gsV0FBVztnQkFDWCxPQUFPO2dCQUNQLFFBQVE7Z0JBQ1IsVUFBVTtnQkFDVixNQUFNO2dCQUNOLElBQUk7YUFDTDtZQUNELE9BQU8sRUFBRTtnQkFDUCxNQUFNO2dCQUNOLE9BQU87Z0JBQ1AsTUFBTTthQUNQO1NBQ0Y7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxpQkFBaUI7WUFDdEIsSUFBSSxDQUFDLFdBQVc7WUFDaEI7Z0JBQ0UsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLEtBQUssRUFBRSxRQUFRO2dCQUNmLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxLQUFLLEVBQUUsYUFBYTtnQkFDcEIsS0FBSyxFQUFFLDJCQUEyQjtnQkFDbEMsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLEtBQUssRUFBRSxVQUFVO2dCQUNqQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRSxNQUFNO2dCQUNiLFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RELFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU87WUFDUCxPQUFPO1NBQ1I7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIExhbmd1YWdlOiBHcmFwaFFMXG4gQXV0aG9yOiBKb2huIEZvc3RlciAoR0ggamY5OTApLCBhbmQgb3RoZXJzXG4gRGVzY3JpcHRpb246IEdyYXBoUUwgaXMgYSBxdWVyeSBsYW5ndWFnZSBmb3IgQVBJc1xuIENhdGVnb3J5OiB3ZWIsIGNvbW1vblxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGdyYXBocWwoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IEdRTF9OQU1FID0gL1tfQS1aYS16XVtfMC05QS1aYS16XSovO1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiR3JhcGhRTFwiLFxuICAgIGFsaWFzZXM6IFsgXCJncWxcIiBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgZGlzYWJsZUF1dG9kZXRlY3Q6IGZhbHNlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiBbXG4gICAgICAgIFwicXVlcnlcIixcbiAgICAgICAgXCJtdXRhdGlvblwiLFxuICAgICAgICBcInN1YnNjcmlwdGlvblwiLFxuICAgICAgICBcInR5cGVcIixcbiAgICAgICAgXCJpbnB1dFwiLFxuICAgICAgICBcInNjaGVtYVwiLFxuICAgICAgICBcImRpcmVjdGl2ZVwiLFxuICAgICAgICBcImludGVyZmFjZVwiLFxuICAgICAgICBcInVuaW9uXCIsXG4gICAgICAgIFwic2NhbGFyXCIsXG4gICAgICAgIFwiZnJhZ21lbnRcIixcbiAgICAgICAgXCJlbnVtXCIsXG4gICAgICAgIFwib25cIlxuICAgICAgXSxcbiAgICAgIGxpdGVyYWw6IFtcbiAgICAgICAgXCJ0cnVlXCIsXG4gICAgICAgIFwiZmFsc2VcIixcbiAgICAgICAgXCJudWxsXCJcbiAgICAgIF1cbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiBcInB1bmN0dWF0aW9uXCIsXG4gICAgICAgIG1hdGNoOiAvWy5dezN9LyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZTogXCJwdW5jdHVhdGlvblwiLFxuICAgICAgICBiZWdpbjogL1tcXCFcXChcXClcXDpcXD1cXFtcXF1cXHtcXHxcXH1dezF9LyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZTogXCJ2YXJpYWJsZVwiLFxuICAgICAgICBiZWdpbjogL1xcJC8sXG4gICAgICAgIGVuZDogL1xcVy8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6IFwibWV0YVwiLFxuICAgICAgICBtYXRjaDogL0BcXHcrLyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6IFwic3ltYm9sXCIsXG4gICAgICAgIGJlZ2luOiByZWdleC5jb25jYXQoR1FMX05BTUUsIHJlZ2V4Lmxvb2thaGVhZCgvXFxzKjovKSksXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogW1xuICAgICAgL1s7PCddLyxcbiAgICAgIC9CRUdJTi9cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGdyYXBocWwgYXMgZGVmYXVsdCB9O1xuIl19