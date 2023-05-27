function apache(hljs) {
    const NUMBER_REF = {
        className: 'number',
        begin: /[$%]\d+/
    };
    const NUMBER = {
        className: 'number',
        begin: /\b\d+/
    };
    const IP_ADDRESS = {
        className: "number",
        begin: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?/
    };
    const PORT_NUMBER = {
        className: "number",
        begin: /:\d{1,5}/
    };
    return {
        name: 'Apache config',
        aliases: ['apacheconf'],
        case_insensitive: true,
        contains: [
            hljs.HASH_COMMENT_MODE,
            {
                className: 'section',
                begin: /<\/?/,
                end: />/,
                contains: [
                    IP_ADDRESS,
                    PORT_NUMBER,
                    hljs.inherit(hljs.QUOTE_STRING_MODE, { relevance: 0 })
                ]
            },
            {
                className: 'attribute',
                begin: /\w+/,
                relevance: 0,
                keywords: { _: [
                        "order",
                        "deny",
                        "allow",
                        "setenv",
                        "rewriterule",
                        "rewriteengine",
                        "rewritecond",
                        "documentroot",
                        "sethandler",
                        "errordocument",
                        "loadmodule",
                        "options",
                        "header",
                        "listen",
                        "serverroot",
                        "servername"
                    ] },
                starts: {
                    end: /$/,
                    relevance: 0,
                    keywords: { literal: 'on off all deny allow' },
                    contains: [
                        {
                            className: 'meta',
                            begin: /\s\[/,
                            end: /\]$/
                        },
                        {
                            className: 'variable',
                            begin: /[\$%]\{/,
                            end: /\}/,
                            contains: [
                                'self',
                                NUMBER_REF
                            ]
                        },
                        IP_ADDRESS,
                        NUMBER,
                        hljs.QUOTE_STRING_MODE
                    ]
                }
            }
        ],
        illegal: /\S/
    };
}
export { apache as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBhY2hlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYXBhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxVQUFVLEdBQUc7UUFDakIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLE9BQU87S0FDZixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQUc7UUFDakIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLCtDQUErQztLQUN2RCxDQUFDO0lBQ0YsTUFBTSxXQUFXLEdBQUc7UUFDbEIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLFVBQVU7S0FDbEIsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsZUFBZTtRQUNyQixPQUFPLEVBQUUsQ0FBRSxZQUFZLENBQUU7UUFDekIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCO2dCQUNFLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixLQUFLLEVBQUUsTUFBTTtnQkFDYixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUU7b0JBQ1IsVUFBVTtvQkFDVixXQUFXO29CQUdYLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUN2RDthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLEtBQUssRUFBRSxLQUFLO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2dCQUdaLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDYixPQUFPO3dCQUNQLE1BQU07d0JBQ04sT0FBTzt3QkFDUCxRQUFRO3dCQUNSLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixhQUFhO3dCQUNiLGNBQWM7d0JBQ2QsWUFBWTt3QkFDWixlQUFlO3dCQUNmLFlBQVk7d0JBQ1osU0FBUzt3QkFDVCxRQUFRO3dCQUNSLFFBQVE7d0JBQ1IsWUFBWTt3QkFDWixZQUFZO3FCQUNiLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFO29CQUNOLEdBQUcsRUFBRSxHQUFHO29CQUNSLFNBQVMsRUFBRSxDQUFDO29CQUNaLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRTtvQkFDOUMsUUFBUSxFQUFFO3dCQUNSOzRCQUNFLFNBQVMsRUFBRSxNQUFNOzRCQUNqQixLQUFLLEVBQUUsTUFBTTs0QkFDYixHQUFHLEVBQUUsS0FBSzt5QkFDWDt3QkFDRDs0QkFDRSxTQUFTLEVBQUUsVUFBVTs0QkFDckIsS0FBSyxFQUFFLFNBQVM7NEJBQ2hCLEdBQUcsRUFBRSxJQUFJOzRCQUNULFFBQVEsRUFBRTtnQ0FDUixNQUFNO2dDQUNOLFVBQVU7NkJBQ1g7eUJBQ0Y7d0JBQ0QsVUFBVTt3QkFDVixNQUFNO3dCQUNOLElBQUksQ0FBQyxpQkFBaUI7cUJBQ3ZCO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBBcGFjaGUgY29uZmlnXG5BdXRob3I6IFJ1c2xhbiBLZWJhIDxydWtlYmFAZ21haWwuY29tPlxuQ29udHJpYnV0b3JzOiBJdmFuIFNhZ2FsYWV2IDxtYW5pYWNAc29mdHdhcmVtYW5pYWNzLm9yZz5cbldlYnNpdGU6IGh0dHBzOi8vaHR0cGQuYXBhY2hlLm9yZ1xuRGVzY3JpcHRpb246IGxhbmd1YWdlIGRlZmluaXRpb24gZm9yIEFwYWNoZSBjb25maWd1cmF0aW9uIGZpbGVzIChodHRwZC5jb25mICYgLmh0YWNjZXNzKVxuQ2F0ZWdvcnk6IGNvbmZpZywgd2ViXG5BdWRpdDogMjAyMFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGFwYWNoZShobGpzKSB7XG4gIGNvbnN0IE5VTUJFUl9SRUYgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogL1skJV1cXGQrL1xuICB9O1xuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogL1xcYlxcZCsvXG4gIH07XG4gIGNvbnN0IElQX0FERFJFU1MgPSB7XG4gICAgY2xhc3NOYW1lOiBcIm51bWJlclwiLFxuICAgIGJlZ2luOiAvXFxkezEsM31cXC5cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM30oOlxcZHsxLDV9KT8vXG4gIH07XG4gIGNvbnN0IFBPUlRfTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogXCJudW1iZXJcIixcbiAgICBiZWdpbjogLzpcXGR7MSw1fS9cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQXBhY2hlIGNvbmZpZycsXG4gICAgYWxpYXNlczogWyAnYXBhY2hlY29uZicgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZWN0aW9uJyxcbiAgICAgICAgYmVnaW46IC88XFwvPy8sXG4gICAgICAgIGVuZDogLz4vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIElQX0FERFJFU1MsXG4gICAgICAgICAgUE9SVF9OVU1CRVIsXG4gICAgICAgICAgLy8gbG93IHJlbGV2YW5jZSBwcmV2ZW50cyB1cyBmcm9tIGNsYW1pbmcgWE1ML0hUTUwgd2hlcmUgdGhpcyBydWxlIHdvdWxkXG4gICAgICAgICAgLy8gbWF0Y2ggc3RyaW5ncyBpbnNpZGUgb2YgWE1MIHRhZ3NcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgeyByZWxldmFuY2U6IDAgfSlcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46IC9cXHcrLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAvLyBrZXl3b3JkcyBhcmVu4oCZdCBuZWVkZWQgZm9yIGhpZ2hsaWdodGluZyBwZXIgc2UsIHRoZXkgb25seSBib29zdCByZWxldmFuY2VcbiAgICAgICAgLy8gZm9yIGEgdmVyeSBnZW5lcmFsbHkgZGVmaW5lZCBtb2RlIChzdGFydHMgd2l0aCBhIHdvcmQsIGVuZHMgd2l0aCBsaW5lLWVuZFxuICAgICAgICBrZXl3b3JkczogeyBfOiBbXG4gICAgICAgICAgXCJvcmRlclwiLFxuICAgICAgICAgIFwiZGVueVwiLFxuICAgICAgICAgIFwiYWxsb3dcIixcbiAgICAgICAgICBcInNldGVudlwiLFxuICAgICAgICAgIFwicmV3cml0ZXJ1bGVcIixcbiAgICAgICAgICBcInJld3JpdGVlbmdpbmVcIixcbiAgICAgICAgICBcInJld3JpdGVjb25kXCIsXG4gICAgICAgICAgXCJkb2N1bWVudHJvb3RcIixcbiAgICAgICAgICBcInNldGhhbmRsZXJcIixcbiAgICAgICAgICBcImVycm9yZG9jdW1lbnRcIixcbiAgICAgICAgICBcImxvYWRtb2R1bGVcIixcbiAgICAgICAgICBcIm9wdGlvbnNcIixcbiAgICAgICAgICBcImhlYWRlclwiLFxuICAgICAgICAgIFwibGlzdGVuXCIsXG4gICAgICAgICAgXCJzZXJ2ZXJyb290XCIsXG4gICAgICAgICAgXCJzZXJ2ZXJuYW1lXCJcbiAgICAgICAgXSB9LFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC8kLyxcbiAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAga2V5d29yZHM6IHsgbGl0ZXJhbDogJ29uIG9mZiBhbGwgZGVueSBhbGxvdycgfSxcbiAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgICAgICAgYmVnaW46IC9cXHNcXFsvLFxuICAgICAgICAgICAgICBlbmQ6IC9cXF0kL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICAgICAgICBiZWdpbjogL1tcXCQlXVxcey8sXG4gICAgICAgICAgICAgIGVuZDogL1xcfS8sXG4gICAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgICAgICAgIE5VTUJFUl9SRUZcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIElQX0FERFJFU1MsXG4gICAgICAgICAgICBOVU1CRVIsXG4gICAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAvXFxTL1xuICB9O1xufVxuXG5leHBvcnQgeyBhcGFjaGUgYXMgZGVmYXVsdCB9O1xuIl19