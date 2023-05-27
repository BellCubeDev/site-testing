function haxe(hljs) {
    const HAXE_BASIC_TYPES = 'Int Float String Bool Dynamic Void Array ';
    return {
        name: 'Haxe',
        aliases: ['hx'],
        keywords: {
            keyword: 'break case cast catch continue default do dynamic else enum extern '
                + 'for function here if import in inline never new override package private get set '
                + 'public return static super switch this throw trace try typedef untyped using var while '
                + HAXE_BASIC_TYPES,
            built_in: 'trace this',
            literal: 'true false null _'
        },
        contains: [
            {
                className: 'string',
                begin: '\'',
                end: '\'',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    {
                        className: 'subst',
                        begin: '\\$\\{',
                        end: '\\}'
                    },
                    {
                        className: 'subst',
                        begin: '\\$',
                        end: /\W\}/
                    }
                ]
            },
            hljs.QUOTE_STRING_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: '@:',
                end: '$'
            },
            {
                className: 'meta',
                begin: '#',
                end: '$',
                keywords: { keyword: 'if else elseif end error' }
            },
            {
                className: 'type',
                begin: ':[ \t]*',
                end: '[^A-Za-z0-9_ \t\\->]',
                excludeBegin: true,
                excludeEnd: true,
                relevance: 0
            },
            {
                className: 'type',
                begin: ':[ \t]*',
                end: '\\W',
                excludeBegin: true,
                excludeEnd: true
            },
            {
                className: 'type',
                begin: 'new *',
                end: '\\W',
                excludeBegin: true,
                excludeEnd: true
            },
            {
                className: 'class',
                beginKeywords: 'enum',
                end: '\\{',
                contains: [hljs.TITLE_MODE]
            },
            {
                className: 'class',
                beginKeywords: 'abstract',
                end: '[\\{$]',
                contains: [
                    {
                        className: 'type',
                        begin: '\\(',
                        end: '\\)',
                        excludeBegin: true,
                        excludeEnd: true
                    },
                    {
                        className: 'type',
                        begin: 'from +',
                        end: '\\W',
                        excludeBegin: true,
                        excludeEnd: true
                    },
                    {
                        className: 'type',
                        begin: 'to +',
                        end: '\\W',
                        excludeBegin: true,
                        excludeEnd: true
                    },
                    hljs.TITLE_MODE
                ],
                keywords: { keyword: 'abstract from to' }
            },
            {
                className: 'class',
                begin: '\\b(class|interface) +',
                end: '[\\{$]',
                excludeEnd: true,
                keywords: 'class interface',
                contains: [
                    {
                        className: 'keyword',
                        begin: '\\b(extends|implements) +',
                        keywords: 'extends implements',
                        contains: [
                            {
                                className: 'type',
                                begin: hljs.IDENT_RE,
                                relevance: 0
                            }
                        ]
                    },
                    hljs.TITLE_MODE
                ]
            },
            {
                className: 'function',
                beginKeywords: 'function',
                end: '\\(',
                excludeEnd: true,
                illegal: '\\S',
                contains: [hljs.TITLE_MODE]
            }
        ],
        illegal: /<\//
    };
}
export { haxe as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF4ZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2hheGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUVoQixNQUFNLGdCQUFnQixHQUFHLDJDQUEyQyxDQUFDO0lBRXJFLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFFLElBQUksQ0FBRTtRQUNqQixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUscUVBQXFFO2tCQUNuRSxtRkFBbUY7a0JBQ25GLHlGQUF5RjtrQkFDekYsZ0JBQWdCO1lBQzNCLFFBQVEsRUFDTixZQUFZO1lBQ2QsT0FBTyxFQUNMLG1CQUFtQjtTQUN0QjtRQUNELFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckI7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLEtBQUssRUFBRSxRQUFRO3dCQUNmLEdBQUcsRUFBRSxLQUFLO3FCQUNYO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxPQUFPO3dCQUNsQixLQUFLLEVBQUUsS0FBSzt3QkFDWixHQUFHLEVBQUUsTUFBTTtxQkFDWjtpQkFDRjthQUNGO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsSUFBSSxDQUFDLGFBQWE7WUFDbEI7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxJQUFJO2dCQUNYLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7WUFD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biBvcGVuIHNvdXJjZSB0b29sa2l0IGJhc2VkIG9uIGEgbW9kZXJuLCBoaWdoIGxldmVsLCBzdHJpY3RseSB0eXBlZCBwcm9ncmFtbWluZyBsYW5ndWFnZS5cbkF1dGhvcjogQ2hyaXN0b3BoZXIgS2FzdGVyIDxpa2Fzb2tpQGdtYWlsLmNvbT4gKEJhc2VkIG9uIHRoZSBhY3Rpb25zY3JpcHQuanMgbGFuZ3VhZ2UgZmlsZSBieSBBbGV4YW5kZXIgTXlhZHplbClcbkNvbnRyaWJ1dG9yczogS2VudG9uIEhhbWFsdWlrIDxrZW50b25oQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vaGF4ZS5vcmdcbiovXG5cbmZ1bmN0aW9uIGhheGUoaGxqcykge1xuXG4gIGNvbnN0IEhBWEVfQkFTSUNfVFlQRVMgPSAnSW50IEZsb2F0IFN0cmluZyBCb29sIER5bmFtaWMgVm9pZCBBcnJheSAnO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0hheGUnLFxuICAgIGFsaWFzZXM6IFsgJ2h4JyBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiAnYnJlYWsgY2FzZSBjYXN0IGNhdGNoIGNvbnRpbnVlIGRlZmF1bHQgZG8gZHluYW1pYyBlbHNlIGVudW0gZXh0ZXJuICdcbiAgICAgICAgICAgICAgICsgJ2ZvciBmdW5jdGlvbiBoZXJlIGlmIGltcG9ydCBpbiBpbmxpbmUgbmV2ZXIgbmV3IG92ZXJyaWRlIHBhY2thZ2UgcHJpdmF0ZSBnZXQgc2V0ICdcbiAgICAgICAgICAgICAgICsgJ3B1YmxpYyByZXR1cm4gc3RhdGljIHN1cGVyIHN3aXRjaCB0aGlzIHRocm93IHRyYWNlIHRyeSB0eXBlZGVmIHVudHlwZWQgdXNpbmcgdmFyIHdoaWxlICdcbiAgICAgICAgICAgICAgICsgSEFYRV9CQVNJQ19UWVBFUyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAndHJhY2UgdGhpcycsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZSBudWxsIF8nXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLCAvLyBpbnRlcnBvbGF0ZS1hYmxlIHN0cmluZ3NcbiAgICAgICAgYmVnaW46ICdcXCcnLFxuICAgICAgICBlbmQ6ICdcXCcnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdWJzdCcsIC8vIGludGVycG9sYXRpb25cbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCRcXFxceycsXG4gICAgICAgICAgICBlbmQ6ICdcXFxcfSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N1YnN0JywgLy8gaW50ZXJwb2xhdGlvblxuICAgICAgICAgICAgYmVnaW46ICdcXFxcJCcsXG4gICAgICAgICAgICBlbmQ6IC9cXFdcXH0vXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLCAvLyBjb21waWxlciBtZXRhXG4gICAgICAgIGJlZ2luOiAnQDonLFxuICAgICAgICBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsIC8vIGNvbXBpbGVyIGNvbmRpdGlvbmFsc1xuICAgICAgICBiZWdpbjogJyMnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6IHsga2V5d29yZDogJ2lmIGVsc2UgZWxzZWlmIGVuZCBlcnJvcicgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsIC8vIGZ1bmN0aW9uIHR5cGVzXG4gICAgICAgIGJlZ2luOiAnOlsgXFx0XSonLFxuICAgICAgICBlbmQ6ICdbXkEtWmEtejAtOV8gXFx0XFxcXC0+XScsXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJywgLy8gdHlwZXNcbiAgICAgICAgYmVnaW46ICc6WyBcXHRdKicsXG4gICAgICAgIGVuZDogJ1xcXFxXJyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJywgLy8gaW5zdGFudGlhdGlvblxuICAgICAgICBiZWdpbjogJ25ldyAqJyxcbiAgICAgICAgZW5kOiAnXFxcXFcnLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJywgLy8gZW51bXNcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2VudW0nLFxuICAgICAgICBlbmQ6ICdcXFxceycsXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuVElUTEVfTU9ERSBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsIC8vIGFic3RyYWN0c1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnYWJzdHJhY3QnLFxuICAgICAgICBlbmQ6ICdbXFxcXHskXScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJyxcbiAgICAgICAgICAgIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICAgICAgYmVnaW46ICdmcm9tICsnLFxuICAgICAgICAgICAgZW5kOiAnXFxcXFcnLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgICAgICBiZWdpbjogJ3RvICsnLFxuICAgICAgICAgICAgZW5kOiAnXFxcXFcnLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGxqcy5USVRMRV9NT0RFXG4gICAgICAgIF0sXG4gICAgICAgIGtleXdvcmRzOiB7IGtleXdvcmQ6ICdhYnN0cmFjdCBmcm9tIHRvJyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsIC8vIGNsYXNzZXNcbiAgICAgICAgYmVnaW46ICdcXFxcYihjbGFzc3xpbnRlcmZhY2UpICsnLFxuICAgICAgICBlbmQ6ICdbXFxcXHskXScsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MgaW50ZXJmYWNlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXGIoZXh0ZW5kc3xpbXBsZW1lbnRzKSArJyxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogaGxqcy5JREVOVF9SRSxcbiAgICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGxqcy5USVRMRV9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgZW5kOiAnXFxcXCgnLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFMnLFxuICAgICAgICBjb250YWluczogWyBobGpzLlRJVExFX01PREUgXVxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogLzxcXC8vXG4gIH07XG59XG5cbmV4cG9ydCB7IGhheGUgYXMgZGVmYXVsdCB9O1xuIl19