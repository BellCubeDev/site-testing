function leaf(hljs) {
    return {
        name: 'Leaf',
        contains: [
            {
                className: 'function',
                begin: '#+' + '[A-Za-z_0-9]*' + '\\(',
                end: / \{/,
                returnBegin: true,
                excludeEnd: true,
                contains: [
                    {
                        className: 'keyword',
                        begin: '#+'
                    },
                    {
                        className: 'title',
                        begin: '[A-Za-z_][A-Za-z_0-9]*'
                    },
                    {
                        className: 'params',
                        begin: '\\(',
                        end: '\\)',
                        endsParent: true,
                        contains: [
                            {
                                className: 'string',
                                begin: '"',
                                end: '"'
                            },
                            {
                                className: 'variable',
                                begin: '[A-Za-z_][A-Za-z_0-9]*'
                            }
                        ]
                    }
                ]
            }
        ]
    };
}
export { leaf as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2xlYWYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLElBQUksR0FBRyxlQUFlLEdBQUcsS0FBSztnQkFDckMsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsU0FBUyxFQUFFLFNBQVM7d0JBQ3BCLEtBQUssRUFBRSxJQUFJO3FCQUNaO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxPQUFPO3dCQUNsQixLQUFLLEVBQUUsd0JBQXdCO3FCQUNoQztvQkFDRDt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLEtBQUs7d0JBQ1osR0FBRyxFQUFFLEtBQUs7d0JBQ1YsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLFFBQVEsRUFBRTs0QkFDUjtnQ0FDRSxTQUFTLEVBQUUsUUFBUTtnQ0FDbkIsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsR0FBRyxFQUFFLEdBQUc7NkJBQ1Q7NEJBQ0Q7Z0NBQ0UsU0FBUyxFQUFFLFVBQVU7Z0NBQ3JCLEtBQUssRUFBRSx3QkFBd0I7NkJBQ2hDO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogTGVhZlxuQXV0aG9yOiBIYWxlIENoYW4gPGhhbGVjaGFuQHFxLmNvbT5cbkRlc2NyaXB0aW9uOiBCYXNlZCBvbiB0aGUgTGVhZiByZWZlcmVuY2UgZnJvbSBodHRwczovL3ZhcG9yLmdpdGh1Yi5pby9kb2N1bWVudGF0aW9uL2d1aWRlL2xlYWYuaHRtbC5cbiovXG5cbmZ1bmN0aW9uIGxlYWYoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdMZWFmJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnIysnICsgJ1tBLVphLXpfMC05XSonICsgJ1xcXFwoJyxcbiAgICAgICAgZW5kOiAvIFxcey8sXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICAgICAgYmVnaW46ICcjKydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnW0EtWmEtel9dW0EtWmEtel8wLTldKidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJyxcbiAgICAgICAgICAgIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1wiJyxcbiAgICAgICAgICAgICAgICBlbmQ6ICdcIidcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1tBLVphLXpfXVtBLVphLXpfMC05XSonXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGxlYWYgYXMgZGVmYXVsdCB9O1xuIl19