function haml(hljs) {
    return {
        name: 'HAML',
        case_insensitive: true,
        contains: [
            {
                className: 'meta',
                begin: '^!!!( (5|1\\.1|Strict|Frameset|Basic|Mobile|RDFa|XML\\b.*))?$',
                relevance: 10
            },
            hljs.COMMENT('^\\s*(!=#|=#|-#|/).*$', null, { relevance: 0 }),
            {
                begin: '^\\s*(-|=|!=)(?!#)',
                end: /$/,
                subLanguage: 'ruby',
                excludeBegin: true,
                excludeEnd: true
            },
            {
                className: 'tag',
                begin: '^\\s*%',
                contains: [
                    {
                        className: 'selector-tag',
                        begin: '\\w+'
                    },
                    {
                        className: 'selector-id',
                        begin: '#[\\w-]+'
                    },
                    {
                        className: 'selector-class',
                        begin: '\\.[\\w-]+'
                    },
                    {
                        begin: /\{\s*/,
                        end: /\s*\}/,
                        contains: [
                            {
                                begin: ':\\w+\\s*=>',
                                end: ',\\s+',
                                returnBegin: true,
                                endsWithParent: true,
                                contains: [
                                    {
                                        className: 'attr',
                                        begin: ':\\w+'
                                    },
                                    hljs.APOS_STRING_MODE,
                                    hljs.QUOTE_STRING_MODE,
                                    {
                                        begin: '\\w+',
                                        relevance: 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        begin: '\\(\\s*',
                        end: '\\s*\\)',
                        excludeEnd: true,
                        contains: [
                            {
                                begin: '\\w+\\s*=',
                                end: '\\s+',
                                returnBegin: true,
                                endsWithParent: true,
                                contains: [
                                    {
                                        className: 'attr',
                                        begin: '\\w+',
                                        relevance: 0
                                    },
                                    hljs.APOS_STRING_MODE,
                                    hljs.QUOTE_STRING_MODE,
                                    {
                                        begin: '\\w+',
                                        relevance: 0
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            { begin: '^\\s*[=~]\\s*' },
            {
                begin: /#\{/,
                end: /\}/,
                subLanguage: 'ruby',
                excludeBegin: true,
                excludeEnd: true
            }
        ]
    };
}
export { haml as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2hhbWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsK0RBQStEO2dCQUN0RSxTQUFTLEVBQUUsRUFBRTthQUNkO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FDVix1QkFBdUIsRUFDdkIsSUFBSSxFQUNKLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUNqQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxvQkFBb0I7Z0JBQzNCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7YUFDakI7WUFDRDtnQkFDRSxTQUFTLEVBQUUsS0FBSztnQkFDaEIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxjQUFjO3dCQUN6QixLQUFLLEVBQUUsTUFBTTtxQkFDZDtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsYUFBYTt3QkFDeEIsS0FBSyxFQUFFLFVBQVU7cUJBQ2xCO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxnQkFBZ0I7d0JBQzNCLEtBQUssRUFBRSxZQUFZO3FCQUNwQjtvQkFDRDt3QkFDRSxLQUFLLEVBQUUsT0FBTzt3QkFDZCxHQUFHLEVBQUUsT0FBTzt3QkFDWixRQUFRLEVBQUU7NEJBQ1I7Z0NBQ0UsS0FBSyxFQUFFLGFBQWE7Z0NBQ3BCLEdBQUcsRUFBRSxPQUFPO2dDQUNaLFdBQVcsRUFBRSxJQUFJO2dDQUNqQixjQUFjLEVBQUUsSUFBSTtnQ0FDcEIsUUFBUSxFQUFFO29DQUNSO3dDQUNFLFNBQVMsRUFBRSxNQUFNO3dDQUNqQixLQUFLLEVBQUUsT0FBTztxQ0FDZjtvQ0FDRCxJQUFJLENBQUMsZ0JBQWdCO29DQUNyQixJQUFJLENBQUMsaUJBQWlCO29DQUN0Qjt3Q0FDRSxLQUFLLEVBQUUsTUFBTTt3Q0FDYixTQUFTLEVBQUUsQ0FBQztxQ0FDYjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxLQUFLLEVBQUUsU0FBUzt3QkFDaEIsR0FBRyxFQUFFLFNBQVM7d0JBQ2QsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLFFBQVEsRUFBRTs0QkFDUjtnQ0FDRSxLQUFLLEVBQUUsV0FBVztnQ0FDbEIsR0FBRyxFQUFFLE1BQU07Z0NBQ1gsV0FBVyxFQUFFLElBQUk7Z0NBQ2pCLGNBQWMsRUFBRSxJQUFJO2dDQUNwQixRQUFRLEVBQUU7b0NBQ1I7d0NBQ0UsU0FBUyxFQUFFLE1BQU07d0NBQ2pCLEtBQUssRUFBRSxNQUFNO3dDQUNiLFNBQVMsRUFBRSxDQUFDO3FDQUNiO29DQUNELElBQUksQ0FBQyxnQkFBZ0I7b0NBQ3JCLElBQUksQ0FBQyxpQkFBaUI7b0NBQ3RCO3dDQUNFLEtBQUssRUFBRSxNQUFNO3dDQUNiLFNBQVMsRUFBRSxDQUFDO3FDQUNiO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDMUI7Z0JBQ0UsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLElBQUk7Z0JBQ1QsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFlBQVksRUFBRSxJQUFJO2dCQUNsQixVQUFVLEVBQUUsSUFBSTthQUNqQjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBIQU1MXG5SZXF1aXJlczogcnVieS5qc1xuQXV0aG9yOiBEYW4gQWxsZW4gPGRhbi5qLmFsbGVuQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHA6Ly9oYW1sLmluZm9cbkNhdGVnb3J5OiB0ZW1wbGF0ZVxuKi9cblxuLy8gVE9ETyBzdXBwb3J0IGZpbHRlciB0YWdzIGxpa2UgOmphdmFzY3JpcHQsIHN1cHBvcnQgaW5saW5lIEhUTUxcbmZ1bmN0aW9uIGhhbWwoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdIQU1MJyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ14hISEoICg1fDFcXFxcLjF8U3RyaWN0fEZyYW1lc2V0fEJhc2ljfE1vYmlsZXxSREZhfFhNTFxcXFxiLiopKT8kJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIC8vIEZJWE1FIHRoZXNlIGNvbW1lbnRzIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNwYW4gaW5kZW50ZWQgbGluZXNcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgJ15cXFxccyooIT0jfD0jfC0jfC8pLiokJyxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgeyByZWxldmFuY2U6IDAgfVxuICAgICAgKSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdeXFxcXHMqKC18PXwhPSkoPyEjKScsXG4gICAgICAgIGVuZDogLyQvLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3J1YnknLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIGJlZ2luOiAnXlxcXFxzKiUnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3NlbGVjdG9yLXRhZycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFx3KydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3NlbGVjdG9yLWlkJyxcbiAgICAgICAgICAgIGJlZ2luOiAnI1tcXFxcdy1dKydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3NlbGVjdG9yLWNsYXNzJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXC5bXFxcXHctXSsnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1xce1xccyovLFxuICAgICAgICAgICAgZW5kOiAvXFxzKlxcfS8sXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46ICc6XFxcXHcrXFxcXHMqPT4nLFxuICAgICAgICAgICAgICAgIGVuZDogJyxcXFxccysnLFxuICAgICAgICAgICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F0dHInLFxuICAgICAgICAgICAgICAgICAgICBiZWdpbjogJzpcXFxcdysnXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46ICdcXFxcdysnLFxuICAgICAgICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXChcXFxccyonLFxuICAgICAgICAgICAgZW5kOiAnXFxcXHMqXFxcXCknLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1xcXFx3K1xcXFxzKj0nLFxuICAgICAgICAgICAgICAgIGVuZDogJ1xcXFxzKycsXG4gICAgICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiAnXFxcXHcrJyxcbiAgICAgICAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46ICdcXFxcdysnLFxuICAgICAgICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7IGJlZ2luOiAnXlxcXFxzKls9fl1cXFxccyonIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvI1xcey8sXG4gICAgICAgIGVuZDogL1xcfS8sXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAncnVieScsXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgaGFtbCBhcyBkZWZhdWx0IH07XG4iXX0=