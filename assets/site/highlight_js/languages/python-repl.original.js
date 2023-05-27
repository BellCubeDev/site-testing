function pythonRepl(hljs) {
    return {
        aliases: ['pycon'],
        contains: [
            {
                className: 'meta.prompt',
                starts: {
                    end: / |$/,
                    starts: {
                        end: '$',
                        subLanguage: 'python'
                    }
                },
                variants: [
                    { begin: /^>>>(?=[ ]|$)/ },
                    { begin: /^\.\.\.(?=[ ]|$)/ }
                ]
            }
        ]
    };
}
export { pythonRepl as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHl0aG9uLXJlcGwuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9weXRob24tcmVwbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxTQUFTLFVBQVUsQ0FBQyxJQUFJO0lBQ3RCLE9BQU87UUFDTCxPQUFPLEVBQUUsQ0FBRSxPQUFPLENBQUU7UUFDcEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLE1BQU0sRUFBRTtvQkFHTixHQUFHLEVBQUUsS0FBSztvQkFDVixNQUFNLEVBQUU7d0JBQ04sR0FBRyxFQUFFLEdBQUc7d0JBQ1IsV0FBVyxFQUFFLFFBQVE7cUJBQ3RCO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUU7b0JBQzFCLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFO2lCQUM5QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxVQUFVLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFB5dGhvbiBSRVBMXG5SZXF1aXJlczogcHl0aG9uLmpzXG5BdXRob3I6IEpvc2ggR29lYmVsIDxoZWxsb0Bqb3NoZ29lYmVsLmNvbT5cbkNhdGVnb3J5OiBjb21tb25cbiovXG5cbmZ1bmN0aW9uIHB5dGhvblJlcGwoaGxqcykge1xuICByZXR1cm4ge1xuICAgIGFsaWFzZXM6IFsgJ3B5Y29uJyBdLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEucHJvbXB0JyxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgLy8gYSBzcGFjZSBzZXBhcmF0ZXMgdGhlIFJFUEwgcHJlZml4IGZyb20gdGhlIGFjdHVhbCBjb2RlXG4gICAgICAgICAgLy8gdGhpcyBpcyBwdXJlbHkgZm9yIGNsZWFuZXIgSFRNTCBvdXRwdXRcbiAgICAgICAgICBlbmQ6IC8gfCQvLFxuICAgICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgICAgICBzdWJMYW5ndWFnZTogJ3B5dGhvbidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogL14+Pj4oPz1bIF18JCkvIH0sXG4gICAgICAgICAgeyBiZWdpbjogL15cXC5cXC5cXC4oPz1bIF18JCkvIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgcHl0aG9uUmVwbCBhcyBkZWZhdWx0IH07XG4iXX0=