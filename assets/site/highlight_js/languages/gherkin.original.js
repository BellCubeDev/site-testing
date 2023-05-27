function gherkin(hljs) {
    return {
        name: 'Gherkin',
        aliases: ['feature'],
        keywords: 'Feature Background Ability Business\ Need Scenario Scenarios Scenario\ Outline Scenario\ Template Examples Given And Then But When',
        contains: [
            {
                className: 'symbol',
                begin: '\\*',
                relevance: 0
            },
            {
                className: 'meta',
                begin: '@[^@\\s]+'
            },
            {
                begin: '\\|',
                end: '\\|\\w*$',
                contains: [
                    {
                        className: 'string',
                        begin: '[^|]+'
                    }
                ]
            },
            {
                className: 'variable',
                begin: '<',
                end: '>'
            },
            hljs.HASH_COMMENT_MODE,
            {
                className: 'string',
                begin: '"""',
                end: '"""'
            },
            hljs.QUOTE_STRING_MODE
        ]
    };
}
export { gherkin as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2hlcmtpbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2doZXJraW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixPQUFPO1FBQ0wsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsQ0FBRSxTQUFTLENBQUU7UUFDdEIsUUFBUSxFQUFFLG9JQUFvSTtRQUM5SSxRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsV0FBVzthQUNuQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxLQUFLO2dCQUNaLEdBQUcsRUFBRSxVQUFVO2dCQUNmLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLE9BQU87cUJBQ2Y7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRzthQUNUO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7YUFDWDtZQUNELElBQUksQ0FBQyxpQkFBaUI7U0FDdkI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIExhbmd1YWdlOiBHaGVya2luXG4gQXV0aG9yOiBTYW0gUGlrZXNsZXkgKEBwaWtlc2xleSkgPHNhbS5waWtlc2xleUB0aGVvZGkub3JnPlxuIERlc2NyaXB0aW9uOiBHaGVya2luIGlzIHRoZSBmb3JtYXQgZm9yIGN1Y3VtYmVyIHNwZWNpZmljYXRpb25zLiBJdCBpcyBhIGRvbWFpbiBzcGVjaWZpYyBsYW5ndWFnZSB3aGljaCBoZWxwcyB5b3UgdG8gZGVzY3JpYmUgYnVzaW5lc3MgYmVoYXZpb3Igd2l0aG91dCB0aGUgbmVlZCB0byBnbyBpbnRvIGRldGFpbCBvZiBpbXBsZW1lbnRhdGlvbi5cbiBXZWJzaXRlOiBodHRwczovL2N1Y3VtYmVyLmlvL2RvY3MvZ2hlcmtpbi9cbiAqL1xuXG5mdW5jdGlvbiBnaGVya2luKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnR2hlcmtpbicsXG4gICAgYWxpYXNlczogWyAnZmVhdHVyZScgXSxcbiAgICBrZXl3b3JkczogJ0ZlYXR1cmUgQmFja2dyb3VuZCBBYmlsaXR5IEJ1c2luZXNzXFwgTmVlZCBTY2VuYXJpbyBTY2VuYXJpb3MgU2NlbmFyaW9cXCBPdXRsaW5lIFNjZW5hcmlvXFwgVGVtcGxhdGUgRXhhbXBsZXMgR2l2ZW4gQW5kIFRoZW4gQnV0IFdoZW4nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXConLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ0BbXkBcXFxcc10rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcfCcsXG4gICAgICAgIGVuZDogJ1xcXFx8XFxcXHcqJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGJlZ2luOiAnW158XSsnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnPCcsXG4gICAgICAgIGVuZDogJz4nXG4gICAgICB9LFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIlwiXCInLFxuICAgICAgICBlbmQ6ICdcIlwiXCInXG4gICAgICB9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZ2hlcmtpbiBhcyBkZWZhdWx0IH07XG4iXX0=