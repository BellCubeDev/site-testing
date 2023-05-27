function dust(hljs) {
    const EXPRESSION_KEYWORDS = 'if eq ne lt lte gt gte select default math sep';
    return {
        name: 'Dust',
        aliases: ['dst'],
        case_insensitive: true,
        subLanguage: 'xml',
        contains: [
            {
                className: 'template-tag',
                begin: /\{[#\/]/,
                end: /\}/,
                illegal: /;/,
                contains: [
                    {
                        className: 'name',
                        begin: /[a-zA-Z\.-]+/,
                        starts: {
                            endsWithParent: true,
                            relevance: 0,
                            contains: [hljs.QUOTE_STRING_MODE]
                        }
                    }
                ]
            },
            {
                className: 'template-variable',
                begin: /\{/,
                end: /\}/,
                illegal: /;/,
                keywords: EXPRESSION_KEYWORDS
            }
        ]
    };
}
export { dust as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVzdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2R1c3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLG1CQUFtQixHQUFHLGdEQUFnRCxDQUFDO0lBQzdFLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFFLEtBQUssQ0FBRTtRQUNsQixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixLQUFLLEVBQUUsU0FBUztnQkFDaEIsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxNQUFNO3dCQUNqQixLQUFLLEVBQUUsY0FBYzt3QkFDckIsTUFBTSxFQUFFOzRCQUNOLGNBQWMsRUFBRSxJQUFJOzRCQUNwQixTQUFTLEVBQUUsQ0FBQzs0QkFDWixRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsaUJBQWlCLENBQUU7eUJBQ3JDO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsbUJBQW1CO2dCQUM5QixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxPQUFPLEVBQUUsR0FBRztnQkFDWixRQUFRLEVBQUUsbUJBQW1CO2FBQzlCO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IER1c3RcblJlcXVpcmVzOiB4bWwuanNcbkF1dGhvcjogTWljaGFlbCBBbGxlbiA8bWljaGFlbC5hbGxlbkBiZW5lZml0Zm9jdXMuY29tPlxuRGVzY3JpcHRpb246IE1hdGNoZXIgZm9yIGR1c3QuanMgdGVtcGxhdGVzLlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuZHVzdGpzLmNvbVxuQ2F0ZWdvcnk6IHRlbXBsYXRlXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZHVzdChobGpzKSB7XG4gIGNvbnN0IEVYUFJFU1NJT05fS0VZV09SRFMgPSAnaWYgZXEgbmUgbHQgbHRlIGd0IGd0ZSBzZWxlY3QgZGVmYXVsdCBtYXRoIHNlcCc7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0R1c3QnLFxuICAgIGFsaWFzZXM6IFsgJ2RzdCcgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZS10YWcnLFxuICAgICAgICBiZWdpbjogL1xce1sjXFwvXS8sXG4gICAgICAgIGVuZDogL1xcfS8sXG4gICAgICAgIGlsbGVnYWw6IC87LyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICduYW1lJyxcbiAgICAgICAgICAgIGJlZ2luOiAvW2EtekEtWlxcLi1dKy8sXG4gICAgICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICAgICAgY29udGFpbnM6IFsgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZS12YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAvXFx7LyxcbiAgICAgICAgZW5kOiAvXFx9LyxcbiAgICAgICAgaWxsZWdhbDogLzsvLFxuICAgICAgICBrZXl3b3JkczogRVhQUkVTU0lPTl9LRVlXT1JEU1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZHVzdCBhcyBkZWZhdWx0IH07XG4iXX0=