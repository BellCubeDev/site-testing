function subunit(hljs) {
    const DETAILS = {
        className: 'string',
        begin: '\\[\n(multipart)?',
        end: '\\]\n'
    };
    const TIME = {
        className: 'string',
        begin: '\\d{4}-\\d{2}-\\d{2}(\\s+)\\d{2}:\\d{2}:\\d{2}\.\\d+Z'
    };
    const PROGRESSVALUE = {
        className: 'string',
        begin: '(\\+|-)\\d+'
    };
    const KEYWORDS = {
        className: 'keyword',
        relevance: 10,
        variants: [
            { begin: '^(test|testing|success|successful|failure|error|skip|xfail|uxsuccess)(:?)\\s+(test)?' },
            { begin: '^progress(:?)(\\s+)?(pop|push)?' },
            { begin: '^tags:' },
            { begin: '^time:' }
        ]
    };
    return {
        name: 'SubUnit',
        case_insensitive: true,
        contains: [
            DETAILS,
            TIME,
            PROGRESSVALUE,
            KEYWORDS
        ]
    };
}
export { subunit as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VidW5pdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3N1YnVuaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLE9BQU8sR0FBRztRQUNkLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxtQkFBbUI7UUFDMUIsR0FBRyxFQUFFLE9BQU87S0FDYixDQUFDO0lBQ0YsTUFBTSxJQUFJLEdBQUc7UUFDWCxTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsdURBQXVEO0tBQy9ELENBQUM7SUFDRixNQUFNLGFBQWEsR0FBRztRQUNwQixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsYUFBYTtLQUNyQixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUc7UUFDZixTQUFTLEVBQUUsU0FBUztRQUNwQixTQUFTLEVBQUUsRUFBRTtRQUNiLFFBQVEsRUFBRTtZQUNSLEVBQUUsS0FBSyxFQUFFLHNGQUFzRixFQUFFO1lBQ2pHLEVBQUUsS0FBSyxFQUFFLGlDQUFpQyxFQUFFO1lBQzVDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUNuQixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7U0FDcEI7S0FDRixDQUFDO0lBQ0YsT0FBTztRQUNMLElBQUksRUFBRSxTQUFTO1FBQ2YsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixRQUFRLEVBQUU7WUFDUixPQUFPO1lBQ1AsSUFBSTtZQUNKLGFBQWE7WUFDYixRQUFRO1NBQ1Q7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFN1YlVuaXRcbkF1dGhvcjogU2VyZ2V5IEJyb25uaWtvdiA8c2VyZ2V5YkBicm9uZXZpY2hvay5ydT5cbldlYnNpdGU6IGh0dHBzOi8vcHlwaS5vcmcvcHJvamVjdC9weXRob24tc3VidW5pdC9cbiovXG5cbmZ1bmN0aW9uIHN1YnVuaXQoaGxqcykge1xuICBjb25zdCBERVRBSUxTID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXFxcW1xcbihtdWx0aXBhcnQpPycsXG4gICAgZW5kOiAnXFxcXF1cXG4nXG4gIH07XG4gIGNvbnN0IFRJTUUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcXFxkezR9LVxcXFxkezJ9LVxcXFxkezJ9KFxcXFxzKylcXFxcZHsyfTpcXFxcZHsyfTpcXFxcZHsyfVxcLlxcXFxkK1onXG4gIH07XG4gIGNvbnN0IFBST0dSRVNTVkFMVUUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJyhcXFxcK3wtKVxcXFxkKydcbiAgfTtcbiAgY29uc3QgS0VZV09SRFMgPSB7XG4gICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgcmVsZXZhbmNlOiAxMCxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ14odGVzdHx0ZXN0aW5nfHN1Y2Nlc3N8c3VjY2Vzc2Z1bHxmYWlsdXJlfGVycm9yfHNraXB8eGZhaWx8dXhzdWNjZXNzKSg6PylcXFxccysodGVzdCk/JyB9LFxuICAgICAgeyBiZWdpbjogJ15wcm9ncmVzcyg6PykoXFxcXHMrKT8ocG9wfHB1c2gpPycgfSxcbiAgICAgIHsgYmVnaW46ICdedGFnczonIH0sXG4gICAgICB7IGJlZ2luOiAnXnRpbWU6JyB9XG4gICAgXVxuICB9O1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdTdWJVbml0JyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBERVRBSUxTLFxuICAgICAgVElNRSxcbiAgICAgIFBST0dSRVNTVkFMVUUsXG4gICAgICBLRVlXT1JEU1xuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgc3VidW5pdCBhcyBkZWZhdWx0IH07XG4iXX0=