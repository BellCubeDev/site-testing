function profile(hljs) {
    return {
        name: 'Python profiler',
        contains: [
            hljs.C_NUMBER_MODE,
            {
                begin: '[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}',
                end: ':',
                excludeEnd: true
            },
            {
                begin: '(ncalls|tottime|cumtime)',
                end: '$',
                keywords: 'ncalls tottime|10 cumtime|10 filename',
                relevance: 10
            },
            {
                begin: 'function calls',
                end: '$',
                contains: [hljs.C_NUMBER_MODE],
                relevance: 10
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            {
                className: 'string',
                begin: '\\(',
                end: '\\)$',
                excludeBegin: true,
                excludeEnd: true,
                relevance: 0
            }
        ]
    };
}
export { profile as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3Byb2ZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixPQUFPO1FBQ0wsSUFBSSxFQUFFLGlCQUFpQjtRQUN2QixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsYUFBYTtZQUNsQjtnQkFDRSxLQUFLLEVBQUUsNENBQTRDO2dCQUNuRCxHQUFHLEVBQUUsR0FBRztnQkFDUixVQUFVLEVBQUUsSUFBSTthQUNqQjtZQUNEO2dCQUNFLEtBQUssRUFBRSwwQkFBMEI7Z0JBQ2pDLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRSx1Q0FBdUM7Z0JBQ2pELFNBQVMsRUFBRSxFQUFFO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsZ0JBQWdCO2dCQUN2QixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsYUFBYSxDQUFFO2dCQUNoQyxTQUFTLEVBQUUsRUFBRTthQUNkO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsS0FBSztnQkFDWixHQUFHLEVBQUUsTUFBTTtnQkFDWCxZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUHl0aG9uIHByb2ZpbGVyXG5EZXNjcmlwdGlvbjogUHl0aG9uIHByb2ZpbGVyIHJlc3VsdHNcbkF1dGhvcjogQnJpYW4gQmVjayA8ZXhvZ2VuQGdtYWlsLmNvbT5cbiovXG5cbmZ1bmN0aW9uIHByb2ZpbGUoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdQeXRob24gcHJvZmlsZXInLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnW2EtekEtWl9dW1xcXFxkYS16QS1aX10rXFxcXC5bXFxcXGRhLXpBLVpfXXsxLDN9JyxcbiAgICAgICAgZW5kOiAnOicsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnKG5jYWxsc3x0b3R0aW1lfGN1bXRpbWUpJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnbmNhbGxzIHRvdHRpbWV8MTAgY3VtdGltZXwxMCBmaWxlbmFtZScsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnZnVuY3Rpb24gY2FsbHMnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFsgaGxqcy5DX05VTUJFUl9NT0RFIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcXFwoJyxcbiAgICAgICAgZW5kOiAnXFxcXCkkJyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHByb2ZpbGUgYXMgZGVmYXVsdCB9O1xuIl19