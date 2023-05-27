function ceylon(hljs) {
    const KEYWORDS = [
        "assembly",
        "module",
        "package",
        "import",
        "alias",
        "class",
        "interface",
        "object",
        "given",
        "value",
        "assign",
        "void",
        "function",
        "new",
        "of",
        "extends",
        "satisfies",
        "abstracts",
        "in",
        "out",
        "return",
        "break",
        "continue",
        "throw",
        "assert",
        "dynamic",
        "if",
        "else",
        "switch",
        "case",
        "for",
        "while",
        "try",
        "catch",
        "finally",
        "then",
        "let",
        "this",
        "outer",
        "super",
        "is",
        "exists",
        "nonempty"
    ];
    const DECLARATION_MODIFIERS = [
        "shared",
        "abstract",
        "formal",
        "default",
        "actual",
        "variable",
        "late",
        "native",
        "deprecated",
        "final",
        "sealed",
        "annotation",
        "suppressWarnings",
        "small"
    ];
    const DOCUMENTATION = [
        "doc",
        "by",
        "license",
        "see",
        "throws",
        "tagged"
    ];
    const SUBST = {
        className: 'subst',
        excludeBegin: true,
        excludeEnd: true,
        begin: /``/,
        end: /``/,
        keywords: KEYWORDS,
        relevance: 10
    };
    const EXPRESSIONS = [
        {
            className: 'string',
            begin: '"""',
            end: '"""',
            relevance: 10
        },
        {
            className: 'string',
            begin: '"',
            end: '"',
            contains: [SUBST]
        },
        {
            className: 'string',
            begin: "'",
            end: "'"
        },
        {
            className: 'number',
            begin: '#[0-9a-fA-F_]+|\\$[01_]+|[0-9_]+(?:\\.[0-9_](?:[eE][+-]?\\d+)?)?[kMGTPmunpf]?',
            relevance: 0
        }
    ];
    SUBST.contains = EXPRESSIONS;
    return {
        name: 'Ceylon',
        keywords: {
            keyword: KEYWORDS.concat(DECLARATION_MODIFIERS),
            meta: DOCUMENTATION
        },
        illegal: '\\$[^01]|#[^0-9a-fA-F]',
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.COMMENT('/\\*', '\\*/', { contains: ['self'] }),
            {
                className: 'meta',
                begin: '@[a-z]\\w*(?::"[^"]*")?'
            }
        ].concat(EXPRESSIONS)
    };
}
export { ceylon as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2V5bG9uLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvY2V5bG9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFFbEIsTUFBTSxRQUFRLEdBQUc7UUFDZixVQUFVO1FBQ1YsUUFBUTtRQUNSLFNBQVM7UUFDVCxRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxXQUFXO1FBQ1gsUUFBUTtRQUNSLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLE1BQU07UUFDTixVQUFVO1FBQ1YsS0FBSztRQUNMLElBQUk7UUFDSixTQUFTO1FBQ1QsV0FBVztRQUNYLFdBQVc7UUFDWCxJQUFJO1FBQ0osS0FBSztRQUNMLFFBQVE7UUFDUixPQUFPO1FBQ1AsVUFBVTtRQUNWLE9BQU87UUFDUCxRQUFRO1FBQ1IsU0FBUztRQUNULElBQUk7UUFDSixNQUFNO1FBQ04sUUFBUTtRQUNSLE1BQU07UUFDTixLQUFLO1FBQ0wsT0FBTztRQUNQLEtBQUs7UUFDTCxPQUFPO1FBQ1AsU0FBUztRQUNULE1BQU07UUFDTixLQUFLO1FBQ0wsTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsSUFBSTtRQUNKLFFBQVE7UUFDUixVQUFVO0tBQ1gsQ0FBQztJQUVGLE1BQU0scUJBQXFCLEdBQUc7UUFDNUIsUUFBUTtRQUNSLFVBQVU7UUFDVixRQUFRO1FBQ1IsU0FBUztRQUNULFFBQVE7UUFDUixVQUFVO1FBQ1YsTUFBTTtRQUNOLFFBQVE7UUFDUixZQUFZO1FBQ1osT0FBTztRQUNQLFFBQVE7UUFDUixZQUFZO1FBQ1osa0JBQWtCO1FBQ2xCLE9BQU87S0FDUixDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQUc7UUFDcEIsS0FBSztRQUNMLElBQUk7UUFDSixTQUFTO1FBQ1QsS0FBSztRQUNMLFFBQVE7UUFDUixRQUFRO0tBQ1QsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHO1FBQ1osU0FBUyxFQUFFLE9BQU87UUFDbEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsSUFBSTtRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFNBQVMsRUFBRSxFQUFFO0tBQ2QsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHO1FBQ2xCO1lBRUUsU0FBUyxFQUFFLFFBQVE7WUFDbkIsS0FBSyxFQUFFLEtBQUs7WUFDWixHQUFHLEVBQUUsS0FBSztZQUNWLFNBQVMsRUFBRSxFQUFFO1NBQ2Q7UUFDRDtZQUVFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLEtBQUssRUFBRSxHQUFHO1lBQ1YsR0FBRyxFQUFFLEdBQUc7WUFDUixRQUFRLEVBQUUsQ0FBRSxLQUFLLENBQUU7U0FDcEI7UUFDRDtZQUVFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLEtBQUssRUFBRSxHQUFHO1lBQ1YsR0FBRyxFQUFFLEdBQUc7U0FDVDtRQUNEO1lBRUUsU0FBUyxFQUFFLFFBQVE7WUFDbkIsS0FBSyxFQUFFLCtFQUErRTtZQUN0RixTQUFTLEVBQUUsQ0FBQztTQUNiO0tBQ0YsQ0FBQztJQUNGLEtBQUssQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO0lBRTdCLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1lBQy9DLElBQUksRUFBRSxhQUFhO1NBQ3BCO1FBQ0QsT0FBTyxFQUFFLHdCQUF3QjtRQUNqQyxRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFFLE1BQU0sQ0FBRSxFQUFFLENBQUM7WUFDdEQ7Z0JBRUUsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSx5QkFBeUI7YUFDakM7U0FDRixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7S0FDdEIsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBDZXlsb25cbkF1dGhvcjogTHVjYXMgV2Vya21laXN0ZXIgPG1haWxAbHVjYXN3ZXJrbWVpc3Rlci5kZT5cbldlYnNpdGU6IGh0dHBzOi8vY2V5bG9uLWxhbmcub3JnXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gY2V5bG9uKGhsanMpIHtcbiAgLy8gMi4zLiBJZGVudGlmaWVycyBhbmQga2V5d29yZHNcbiAgY29uc3QgS0VZV09SRFMgPSBbXG4gICAgXCJhc3NlbWJseVwiLFxuICAgIFwibW9kdWxlXCIsXG4gICAgXCJwYWNrYWdlXCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImFsaWFzXCIsXG4gICAgXCJjbGFzc1wiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcImdpdmVuXCIsXG4gICAgXCJ2YWx1ZVwiLFxuICAgIFwiYXNzaWduXCIsXG4gICAgXCJ2b2lkXCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJvZlwiLFxuICAgIFwiZXh0ZW5kc1wiLFxuICAgIFwic2F0aXNmaWVzXCIsXG4gICAgXCJhYnN0cmFjdHNcIixcbiAgICBcImluXCIsXG4gICAgXCJvdXRcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJ0aHJvd1wiLFxuICAgIFwiYXNzZXJ0XCIsXG4gICAgXCJkeW5hbWljXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwic3dpdGNoXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJmb3JcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJ0cnlcIixcbiAgICBcImNhdGNoXCIsXG4gICAgXCJmaW5hbGx5XCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJsZXRcIixcbiAgICBcInRoaXNcIixcbiAgICBcIm91dGVyXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwiaXNcIixcbiAgICBcImV4aXN0c1wiLFxuICAgIFwibm9uZW1wdHlcIlxuICBdO1xuICAvLyA3LjQuMSBEZWNsYXJhdGlvbiBNb2RpZmllcnNcbiAgY29uc3QgREVDTEFSQVRJT05fTU9ESUZJRVJTID0gW1xuICAgIFwic2hhcmVkXCIsXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiZm9ybWFsXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJhY3R1YWxcIixcbiAgICBcInZhcmlhYmxlXCIsXG4gICAgXCJsYXRlXCIsXG4gICAgXCJuYXRpdmVcIixcbiAgICBcImRlcHJlY2F0ZWRcIixcbiAgICBcImZpbmFsXCIsXG4gICAgXCJzZWFsZWRcIixcbiAgICBcImFubm90YXRpb25cIixcbiAgICBcInN1cHByZXNzV2FybmluZ3NcIixcbiAgICBcInNtYWxsXCJcbiAgXTtcbiAgLy8gNy40LjIgRG9jdW1lbnRhdGlvblxuICBjb25zdCBET0NVTUVOVEFUSU9OID0gW1xuICAgIFwiZG9jXCIsXG4gICAgXCJieVwiLFxuICAgIFwibGljZW5zZVwiLFxuICAgIFwic2VlXCIsXG4gICAgXCJ0aHJvd3NcIixcbiAgICBcInRhZ2dlZFwiXG4gIF07XG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBiZWdpbjogL2BgLyxcbiAgICBlbmQ6IC9gYC8sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcbiAgY29uc3QgRVhQUkVTU0lPTlMgPSBbXG4gICAge1xuICAgICAgLy8gdmVyYmF0aW0gc3RyaW5nXG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcIlwiXCInLFxuICAgICAgZW5kOiAnXCJcIlwiJyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0cmluZyBsaXRlcmFsIG9yIHRlbXBsYXRlXG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcIicsXG4gICAgICBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogWyBTVUJTVCBdXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBjaGFyYWN0ZXIgbGl0ZXJhbFxuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiBcIidcIixcbiAgICAgIGVuZDogXCInXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIG51bWVyaWMgbGl0ZXJhbFxuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiAnI1swLTlhLWZBLUZfXSt8XFxcXCRbMDFfXSt8WzAtOV9dKyg/OlxcXFwuWzAtOV9dKD86W2VFXVsrLV0/XFxcXGQrKT8pP1trTUdUUG11bnBmXT8nLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfVxuICBdO1xuICBTVUJTVC5jb250YWlucyA9IEVYUFJFU1NJT05TO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0NleWxvbicsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTLmNvbmNhdChERUNMQVJBVElPTl9NT0RJRklFUlMpLFxuICAgICAgbWV0YTogRE9DVU1FTlRBVElPTlxuICAgIH0sXG4gICAgaWxsZWdhbDogJ1xcXFwkW14wMV18I1teMC05YS1mQS1GXScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ09NTUVOVCgnL1xcXFwqJywgJ1xcXFwqLycsIHsgY29udGFpbnM6IFsgJ3NlbGYnIF0gfSksXG4gICAgICB7XG4gICAgICAgIC8vIGNvbXBpbGVyIGFubm90YXRpb25cbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAnQFthLXpdXFxcXHcqKD86OlwiW15cIl0qXCIpPydcbiAgICAgIH1cbiAgICBdLmNvbmNhdChFWFBSRVNTSU9OUylcbiAgfTtcbn1cblxuZXhwb3J0IHsgY2V5bG9uIGFzIGRlZmF1bHQgfTtcbiJdfQ==