function inform7(hljs) {
    const START_BRACKET = '\\[';
    const END_BRACKET = '\\]';
    return {
        name: 'Inform 7',
        aliases: ['i7'],
        case_insensitive: true,
        keywords: {
            keyword: 'thing room person man woman animal container '
                + 'supporter backdrop door '
                + 'scenery open closed locked inside gender '
                + 'is are say understand '
                + 'kind of rule'
        },
        contains: [
            {
                className: 'string',
                begin: '"',
                end: '"',
                relevance: 0,
                contains: [
                    {
                        className: 'subst',
                        begin: START_BRACKET,
                        end: END_BRACKET
                    }
                ]
            },
            {
                className: 'section',
                begin: /^(Volume|Book|Part|Chapter|Section|Table)\b/,
                end: '$'
            },
            {
                begin: /^(Check|Carry out|Report|Instead of|To|Rule|When|Before|After)\b/,
                end: ':',
                contains: [
                    {
                        begin: '\\(This',
                        end: '\\)'
                    }
                ]
            },
            {
                className: 'comment',
                begin: START_BRACKET,
                end: END_BRACKET,
                contains: ['self']
            }
        ]
    };
}
export { inform7 as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mb3JtNy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2luZm9ybTcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDNUIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzFCLE9BQU87UUFDTCxJQUFJLEVBQUUsVUFBVTtRQUNoQixPQUFPLEVBQUUsQ0FBRSxJQUFJLENBQUU7UUFDakIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixRQUFRLEVBQUU7WUFFUixPQUFPLEVBRUwsK0NBQStDO2tCQUM3QywwQkFBMEI7a0JBRTFCLDJDQUEyQztrQkFFM0Msd0JBQXdCO2tCQUV4QixjQUFjO1NBQUU7UUFDdEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUUsT0FBTzt3QkFDbEIsS0FBSyxFQUFFLGFBQWE7d0JBQ3BCLEdBQUcsRUFBRSxXQUFXO3FCQUNqQjtpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLEtBQUssRUFBRSw2Q0FBNkM7Z0JBQ3BELEdBQUcsRUFBRSxHQUFHO2FBQ1Q7WUFDRDtnQkFHRSxLQUFLLEVBQUUsa0VBQWtFO2dCQUN6RSxHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUU7b0JBQ1I7d0JBRUUsS0FBSyxFQUFFLFNBQVM7d0JBQ2hCLEdBQUcsRUFBRSxLQUFLO3FCQUNYO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLEdBQUcsRUFBRSxXQUFXO2dCQUNoQixRQUFRLEVBQUUsQ0FBRSxNQUFNLENBQUU7YUFDckI7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogSW5mb3JtIDdcbkF1dGhvcjogQnJ1bm8gRGlhcyA8YnJ1bm8uci5kaWFzQGdtYWlsLmNvbT5cbkRlc2NyaXB0aW9uOiBMYW5ndWFnZSBkZWZpbml0aW9uIGZvciBJbmZvcm0gNywgYSBEU0wgZm9yIHdyaXRpbmcgcGFyc2VyIGludGVyYWN0aXZlIGZpY3Rpb24uXG5XZWJzaXRlOiBodHRwOi8vaW5mb3JtNy5jb21cbiovXG5cbmZ1bmN0aW9uIGluZm9ybTcoaGxqcykge1xuICBjb25zdCBTVEFSVF9CUkFDS0VUID0gJ1xcXFxbJztcbiAgY29uc3QgRU5EX0JSQUNLRVQgPSAnXFxcXF0nO1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdJbmZvcm0gNycsXG4gICAgYWxpYXNlczogWyAnaTcnIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgLy8gU29tZSBrZXl3b3JkcyBtb3JlIG9yIGxlc3MgdW5pcXVlIHRvIEk3LCBmb3IgcmVsZXZhbmNlLlxuICAgICAga2V5d29yZDpcbiAgICAgICAgLy8ga2luZDpcbiAgICAgICAgJ3RoaW5nIHJvb20gcGVyc29uIG1hbiB3b21hbiBhbmltYWwgY29udGFpbmVyICdcbiAgICAgICAgKyAnc3VwcG9ydGVyIGJhY2tkcm9wIGRvb3IgJ1xuICAgICAgICAvLyBjaGFyYWN0ZXJpc3RpYzpcbiAgICAgICAgKyAnc2NlbmVyeSBvcGVuIGNsb3NlZCBsb2NrZWQgaW5zaWRlIGdlbmRlciAnXG4gICAgICAgIC8vIHZlcmI6XG4gICAgICAgICsgJ2lzIGFyZSBzYXkgdW5kZXJzdGFuZCAnXG4gICAgICAgIC8vIG1pc2Mga2V5d29yZDpcbiAgICAgICAgKyAna2luZCBvZiBydWxlJyB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgICAgICAgICBiZWdpbjogU1RBUlRfQlJBQ0tFVCxcbiAgICAgICAgICAgIGVuZDogRU5EX0JSQUNLRVRcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NlY3Rpb24nLFxuICAgICAgICBiZWdpbjogL14oVm9sdW1lfEJvb2t8UGFydHxDaGFwdGVyfFNlY3Rpb258VGFibGUpXFxiLyxcbiAgICAgICAgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIFJ1bGUgZGVmaW5pdGlvblxuICAgICAgICAvLyBUaGlzIGlzIGhlcmUgZm9yIHJlbGV2YW5jZS5cbiAgICAgICAgYmVnaW46IC9eKENoZWNrfENhcnJ5IG91dHxSZXBvcnR8SW5zdGVhZCBvZnxUb3xSdWxlfFdoZW58QmVmb3JlfEFmdGVyKVxcYi8sXG4gICAgICAgIGVuZDogJzonLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIFJ1bGUgbmFtZVxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKFRoaXMnLFxuICAgICAgICAgICAgZW5kOiAnXFxcXCknXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46IFNUQVJUX0JSQUNLRVQsXG4gICAgICAgIGVuZDogRU5EX0JSQUNLRVQsXG4gICAgICAgIGNvbnRhaW5zOiBbICdzZWxmJyBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBpbmZvcm03IGFzIGRlZmF1bHQgfTtcbiJdfQ==