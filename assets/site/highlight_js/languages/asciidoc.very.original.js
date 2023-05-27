function asciidoc(hljs) {
    const regex = hljs.regex;
    const HORIZONTAL_RULE = {
        begin: '^\'{3,}[ \\t]*$',
        relevance: 10
    };
    const ESCAPED_FORMATTING = [
        { begin: /\\[*_`]/ },
        { begin: /\\\\\*{2}[^\n]*?\*{2}/ },
        { begin: /\\\\_{2}[^\n]*_{2}/ },
        { begin: /\\\\`{2}[^\n]*`{2}/ },
        { begin: /[:;}][*_`](?![*_`])/ }
    ];
    const STRONG = [
        {
            className: 'strong',
            begin: /\*{2}([^\n]+?)\*{2}/
        },
        {
            className: 'strong',
            begin: regex.concat(/\*\*/, /((\*(?!\*)|\\[^\n]|[^*\n\\])+\n)+/, /(\*(?!\*)|\\[^\n]|[^*\n\\])*/, /\*\*/),
            relevance: 0
        },
        {
            className: 'strong',
            begin: /\B\*(\S|\S[^\n]*?\S)\*(?!\w)/
        },
        {
            className: 'strong',
            begin: /\*[^\s]([^\n]+\n)+([^\n]+)\*/
        }
    ];
    const EMPHASIS = [
        {
            className: 'emphasis',
            begin: /_{2}([^\n]+?)_{2}/
        },
        {
            className: 'emphasis',
            begin: regex.concat(/__/, /((_(?!_)|\\[^\n]|[^_\n\\])+\n)+/, /(_(?!_)|\\[^\n]|[^_\n\\])*/, /__/),
            relevance: 0
        },
        {
            className: 'emphasis',
            begin: /\b_(\S|\S[^\n]*?\S)_(?!\w)/
        },
        {
            className: 'emphasis',
            begin: /_[^\s]([^\n]+\n)+([^\n]+)_/
        },
        {
            className: 'emphasis',
            begin: '\\B\'(?![\'\\s])',
            end: '(\\n{2}|\')',
            contains: [
                {
                    begin: '\\\\\'\\w',
                    relevance: 0
                }
            ],
            relevance: 0
        }
    ];
    const ADMONITION = {
        className: 'symbol',
        begin: '^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+',
        relevance: 10
    };
    const BULLET_LIST = {
        className: 'bullet',
        begin: '^(\\*+|-+|\\.+|[^\\n]+?::)\\s+'
    };
    return {
        name: 'AsciiDoc',
        aliases: ['adoc'],
        contains: [
            hljs.COMMENT('^/{4,}\\n', '\\n/{4,}$', { relevance: 10 }),
            hljs.COMMENT('^//', '$', { relevance: 0 }),
            {
                className: 'title',
                begin: '^\\.\\w.*$'
            },
            {
                begin: '^[=\\*]{4,}\\n',
                end: '\\n^[=\\*]{4,}$',
                relevance: 10
            },
            {
                className: 'section',
                relevance: 10,
                variants: [
                    { begin: '^(={1,6})[ \t].+?([ \t]\\1)?$' },
                    { begin: '^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$' }
                ]
            },
            {
                className: 'meta',
                begin: '^:.+?:',
                end: '\\s',
                excludeEnd: true,
                relevance: 10
            },
            {
                className: 'meta',
                begin: '^\\[.+?\\]$',
                relevance: 0
            },
            {
                className: 'quote',
                begin: '^_{4,}\\n',
                end: '\\n_{4,}$',
                relevance: 10
            },
            {
                className: 'code',
                begin: '^[\\-\\.]{4,}\\n',
                end: '\\n[\\-\\.]{4,}$',
                relevance: 10
            },
            {
                begin: '^\\+{4,}\\n',
                end: '\\n\\+{4,}$',
                contains: [
                    {
                        begin: '<',
                        end: '>',
                        subLanguage: 'xml',
                        relevance: 0
                    }
                ],
                relevance: 10
            },
            BULLET_LIST,
            ADMONITION,
            ...ESCAPED_FORMATTING,
            ...STRONG,
            ...EMPHASIS,
            {
                className: 'string',
                variants: [
                    { begin: "``.+?''" },
                    { begin: "`.+?'" }
                ]
            },
            {
                className: 'code',
                begin: /`{2}/,
                end: /(\n{2}|`{2})/
            },
            {
                className: 'code',
                begin: '(`.+?`|\\+.+?\\+)',
                relevance: 0
            },
            {
                className: 'code',
                begin: '^[ \\t]',
                end: '$',
                relevance: 0
            },
            HORIZONTAL_RULE,
            {
                begin: '(link:)?(http|https|ftp|file|irc|image:?):\\S+?\\[[^[]*?\\]',
                returnBegin: true,
                contains: [
                    {
                        begin: '(link|image:?):',
                        relevance: 0
                    },
                    {
                        className: 'link',
                        begin: '\\w',
                        end: '[^\\[]+',
                        relevance: 0
                    },
                    {
                        className: 'string',
                        begin: '\\[',
                        end: '\\]',
                        excludeBegin: true,
                        excludeEnd: true,
                        relevance: 0
                    }
                ],
                relevance: 10
            }
        ]
    };
}
export { asciidoc as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNjaWlkb2MuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9hc2NpaWRvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQSxTQUFTLFFBQVEsQ0FBQyxJQUFJO0lBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsTUFBTSxlQUFlLEdBQUc7UUFDdEIsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixTQUFTLEVBQUUsRUFBRTtLQUNkLENBQUM7SUFDRixNQUFNLGtCQUFrQixHQUFHO1FBRXpCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUlwQixFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtRQUNsQyxFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtRQUMvQixFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtRQUcvQixFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtLQUNqQyxDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUc7UUFFYjtZQUNFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLEtBQUssRUFBRSxxQkFBcUI7U0FDN0I7UUFFRDtZQUNFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUNqQixNQUFNLEVBQ04sbUNBQW1DLEVBQ25DLDhCQUE4QixFQUM5QixNQUFNLENBQ1A7WUFDRCxTQUFTLEVBQUUsQ0FBQztTQUNiO1FBRUQ7WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUVuQixLQUFLLEVBQUUsOEJBQThCO1NBQ3RDO1FBRUQ7WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUVuQixLQUFLLEVBQUUsOEJBQThCO1NBQ3RDO0tBQ0YsQ0FBQztJQUNGLE1BQU0sUUFBUSxHQUFHO1FBRWY7WUFDRSxTQUFTLEVBQUUsVUFBVTtZQUNyQixLQUFLLEVBQUUsbUJBQW1CO1NBQzNCO1FBRUQ7WUFDRSxTQUFTLEVBQUUsVUFBVTtZQUNyQixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FDakIsSUFBSSxFQUNKLGlDQUFpQyxFQUNqQyw0QkFBNEIsRUFDNUIsSUFBSSxDQUNMO1lBQ0QsU0FBUyxFQUFFLENBQUM7U0FDYjtRQUVEO1lBQ0UsU0FBUyxFQUFFLFVBQVU7WUFFckIsS0FBSyxFQUFFLDRCQUE0QjtTQUNwQztRQUVEO1lBQ0UsU0FBUyxFQUFFLFVBQVU7WUFFckIsS0FBSyxFQUFFLDRCQUE0QjtTQUNwQztRQUVEO1lBQ0UsU0FBUyxFQUFFLFVBQVU7WUFFckIsS0FBSyxFQUFFLGtCQUFrQjtZQUN6QixHQUFHLEVBQUUsYUFBYTtZQUVsQixRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLFNBQVMsRUFBRSxDQUFDO2lCQUNiO2FBQ0Y7WUFDRCxTQUFTLEVBQUUsQ0FBQztTQUNiO0tBQ0YsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSw0Q0FBNEM7UUFDbkQsU0FBUyxFQUFFLEVBQUU7S0FDZCxDQUFDO0lBQ0YsTUFBTSxXQUFXLEdBQUc7UUFDbEIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLGdDQUFnQztLQUN4QyxDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxVQUFVO1FBQ2hCLE9BQU8sRUFBRSxDQUFFLE1BQU0sQ0FBRTtRQUNuQixRQUFRLEVBQUU7WUFFUixJQUFJLENBQUMsT0FBTyxDQUNWLFdBQVcsRUFDWCxXQUFXLEVBSVgsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQ2xCO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FDVixLQUFLLEVBQ0wsR0FBRyxFQUNILEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUNqQjtZQUVEO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixLQUFLLEVBQUUsWUFBWTthQUNwQjtZQUVEO2dCQUNFLEtBQUssRUFBRSxnQkFBZ0I7Z0JBQ3ZCLEdBQUcsRUFBRSxpQkFBaUI7Z0JBQ3RCLFNBQVMsRUFBRSxFQUFFO2FBQ2Q7WUFFRDtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLCtCQUErQixFQUFFO29CQUMxQyxFQUFFLEtBQUssRUFBRSxzQ0FBc0MsRUFBRTtpQkFDbEQ7YUFDRjtZQUVEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsUUFBUTtnQkFDZixHQUFHLEVBQUUsS0FBSztnQkFDVixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsU0FBUyxFQUFFLEVBQUU7YUFDZDtZQUVEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsYUFBYTtnQkFDcEIsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUVEO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixLQUFLLEVBQUUsV0FBVztnQkFDbEIsR0FBRyxFQUFFLFdBQVc7Z0JBQ2hCLFNBQVMsRUFBRSxFQUFFO2FBQ2Q7WUFFRDtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsR0FBRyxFQUFFLGtCQUFrQjtnQkFDdkIsU0FBUyxFQUFFLEVBQUU7YUFDZDtZQUVEO2dCQUNFLEtBQUssRUFBRSxhQUFhO2dCQUNwQixHQUFHLEVBQUUsYUFBYTtnQkFDbEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxHQUFHO3dCQUNWLEdBQUcsRUFBRSxHQUFHO3dCQUNSLFdBQVcsRUFBRSxLQUFLO3dCQUNsQixTQUFTLEVBQUUsQ0FBQztxQkFDYjtpQkFDRjtnQkFDRCxTQUFTLEVBQUUsRUFBRTthQUNkO1lBRUQsV0FBVztZQUNYLFVBQVU7WUFDVixHQUFHLGtCQUFrQjtZQUNyQixHQUFHLE1BQU07WUFDVCxHQUFHLFFBQVE7WUFHWDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtvQkFDcEIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2lCQUNuQjthQUNGO1lBRUQ7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxNQUFNO2dCQUNiLEdBQUcsRUFBRSxjQUFjO2FBQ3BCO1lBRUQ7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFFRDtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRCxlQUFlO1lBRWY7Z0JBQ0UsS0FBSyxFQUFFLDZEQUE2RDtnQkFDcEUsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxLQUFLLEVBQUUsaUJBQWlCO3dCQUN4QixTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsTUFBTTt3QkFDakIsS0FBSyxFQUFFLEtBQUs7d0JBQ1osR0FBRyxFQUFFLFNBQVM7d0JBQ2QsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLEtBQUssRUFBRSxLQUFLO3dCQUNaLEdBQUcsRUFBRSxLQUFLO3dCQUNWLFlBQVksRUFBRSxJQUFJO3dCQUNsQixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsU0FBUyxFQUFFLENBQUM7cUJBQ2I7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLEVBQUU7YUFDZDtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsUUFBUSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBBc2NpaURvY1xuUmVxdWlyZXM6IHhtbC5qc1xuQXV0aG9yOiBEYW4gQWxsZW4gPGRhbi5qLmFsbGVuQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHA6Ly9hc2NpaWRvYy5vcmdcbkRlc2NyaXB0aW9uOiBBIHNlbWFudGljLCB0ZXh0LWJhc2VkIGRvY3VtZW50IGZvcm1hdCB0aGF0IGNhbiBiZSBleHBvcnRlZCB0byBIVE1MLCBEb2NCb29rIGFuZCBvdGhlciBiYWNrZW5kcy5cbkNhdGVnb3J5OiBtYXJrdXBcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBhc2NpaWRvYyhobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgSE9SSVpPTlRBTF9SVUxFID0ge1xuICAgIGJlZ2luOiAnXlxcJ3szLH1bIFxcXFx0XSokJyxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIGNvbnN0IEVTQ0FQRURfRk9STUFUVElORyA9IFtcbiAgICAvLyBlc2NhcGVkIGNvbnN0cmFpbmVkIGZvcm1hdHRpbmcgbWFya3MgKGkuZS4sIFxcKiBcXF8gb3IgXFxgKVxuICAgIHsgYmVnaW46IC9cXFxcWypfYF0vIH0sXG4gICAgLy8gZXNjYXBlZCB1bmNvbnN0cmFpbmVkIGZvcm1hdHRpbmcgbWFya3MgKGkuZS4sIFxcXFwqKiBcXFxcX18gb3IgXFxcXGBgKVxuICAgIC8vIG11c3QgaWdub3JlIHVudGlsIHRoZSBuZXh0IGZvcm1hdHRpbmcgbWFya3NcbiAgICAvLyB0aGlzIHJ1bGUgbWlnaHQgbm90IGJlIDEwMCUgY29tcGxpYW50IHdpdGggQXNjaWlkb2N0b3IgMi4wIGJ1dCB3ZSBhcmUgZW50ZXJpbmcgdW5kZWZpbmVkIGJlaGF2aW9yIHRlcnJpdG9yeS4uLlxuICAgIHsgYmVnaW46IC9cXFxcXFxcXFxcKnsyfVteXFxuXSo/XFwqezJ9LyB9LFxuICAgIHsgYmVnaW46IC9cXFxcXFxcXF97Mn1bXlxcbl0qX3syfS8gfSxcbiAgICB7IGJlZ2luOiAvXFxcXFxcXFxgezJ9W15cXG5dKmB7Mn0vIH0sXG4gICAgLy8gZ3VhcmQ6IGNvbnN0cmFpbmVkIGZvcm1hdHRpbmcgbWFyayBtYXkgbm90IGJlIHByZWNlZGVkIGJ5IFwiOlwiLCBcIjtcIiBvclxuICAgIC8vIFwifVwiLiBtYXRjaCB0aGVzZSBzbyB0aGUgY29uc3RyYWluZWQgcnVsZSBkb2Vzbid0IHNlZSB0aGVtXG4gICAgeyBiZWdpbjogL1s6O31dWypfYF0oPyFbKl9gXSkvIH1cbiAgXTtcbiAgY29uc3QgU1RST05HID0gW1xuICAgIC8vIGlubGluZSB1bmNvbnN0cmFpbmVkIHN0cm9uZyAoc2luZ2xlIGxpbmUpXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3Ryb25nJyxcbiAgICAgIGJlZ2luOiAvXFwqezJ9KFteXFxuXSs/KVxcKnsyfS9cbiAgICB9LFxuICAgIC8vIGlubGluZSB1bmNvbnN0cmFpbmVkIHN0cm9uZyAobXVsdGktbGluZSlcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJvbmcnLFxuICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdChcbiAgICAgICAgL1xcKlxcKi8sXG4gICAgICAgIC8oKFxcKig/IVxcKil8XFxcXFteXFxuXXxbXipcXG5cXFxcXSkrXFxuKSsvLFxuICAgICAgICAvKFxcKig/IVxcKil8XFxcXFteXFxuXXxbXipcXG5cXFxcXSkqLyxcbiAgICAgICAgL1xcKlxcKi9cbiAgICAgICksXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIC8vIGlubGluZSBjb25zdHJhaW5lZCBzdHJvbmcgKHNpbmdsZSBsaW5lKVxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cm9uZycsXG4gICAgICAvLyBtdXN0IG5vdCBwcmVjZWRlIG9yIGZvbGxvdyBhIHdvcmQgY2hhcmFjdGVyXG4gICAgICBiZWdpbjogL1xcQlxcKihcXFN8XFxTW15cXG5dKj9cXFMpXFwqKD8hXFx3KS9cbiAgICB9LFxuICAgIC8vIGlubGluZSBjb25zdHJhaW5lZCBzdHJvbmcgKG11bHRpLWxpbmUpXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3Ryb25nJyxcbiAgICAgIC8vIG11c3Qgbm90IHByZWNlZGUgb3IgZm9sbG93IGEgd29yZCBjaGFyYWN0ZXJcbiAgICAgIGJlZ2luOiAvXFwqW15cXHNdKFteXFxuXStcXG4pKyhbXlxcbl0rKVxcKi9cbiAgICB9XG4gIF07XG4gIGNvbnN0IEVNUEhBU0lTID0gW1xuICAgIC8vIGlubGluZSB1bmNvbnN0cmFpbmVkIGVtcGhhc2lzIChzaW5nbGUgbGluZSlcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgICBiZWdpbjogL197Mn0oW15cXG5dKz8pX3syfS9cbiAgICB9LFxuICAgIC8vIGlubGluZSB1bmNvbnN0cmFpbmVkIGVtcGhhc2lzIChtdWx0aS1saW5lKVxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2VtcGhhc2lzJyxcbiAgICAgIGJlZ2luOiByZWdleC5jb25jYXQoXG4gICAgICAgIC9fXy8sXG4gICAgICAgIC8oKF8oPyFfKXxcXFxcW15cXG5dfFteX1xcblxcXFxdKStcXG4pKy8sXG4gICAgICAgIC8oXyg/IV8pfFxcXFxbXlxcbl18W15fXFxuXFxcXF0pKi8sXG4gICAgICAgIC9fXy9cbiAgICAgICksXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIC8vIGlubGluZSBjb25zdHJhaW5lZCBlbXBoYXNpcyAoc2luZ2xlIGxpbmUpXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnZW1waGFzaXMnLFxuICAgICAgLy8gbXVzdCBub3QgcHJlY2VkZSBvciBmb2xsb3cgYSB3b3JkIGNoYXJhY3RlclxuICAgICAgYmVnaW46IC9cXGJfKFxcU3xcXFNbXlxcbl0qP1xcUylfKD8hXFx3KS9cbiAgICB9LFxuICAgIC8vIGlubGluZSBjb25zdHJhaW5lZCBlbXBoYXNpcyAobXVsdGktbGluZSlcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgICAvLyBtdXN0IG5vdCBwcmVjZWRlIG9yIGZvbGxvdyBhIHdvcmQgY2hhcmFjdGVyXG4gICAgICBiZWdpbjogL19bXlxcc10oW15cXG5dK1xcbikrKFteXFxuXSspXy9cbiAgICB9LFxuICAgIC8vIGlubGluZSBjb25zdHJhaW5lZCBlbXBoYXNpcyB1c2luZyBzaW5nbGUgcXVvdGUgKGxlZ2FjeSlcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgICAvLyBtdXN0IG5vdCBmb2xsb3cgYSB3b3JkIGNoYXJhY3RlciBvciBiZSBmb2xsb3dlZCBieSBhIHNpbmdsZSBxdW90ZSBvciBzcGFjZVxuICAgICAgYmVnaW46ICdcXFxcQlxcJyg/IVtcXCdcXFxcc10pJyxcbiAgICAgIGVuZDogJyhcXFxcbnsyfXxcXCcpJyxcbiAgICAgIC8vIGFsbG93IGVzY2FwZWQgc2luZ2xlIHF1b3RlIGZvbGxvd2VkIGJ5IHdvcmQgY2hhclxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAnXFxcXFxcXFxcXCdcXFxcdycsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF07XG4gIGNvbnN0IEFETU9OSVRJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICBiZWdpbjogJ14oTk9URXxUSVB8SU1QT1JUQU5UfFdBUk5JTkd8Q0FVVElPTik6XFxcXHMrJyxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIGNvbnN0IEJVTExFVF9MSVNUID0ge1xuICAgIGNsYXNzTmFtZTogJ2J1bGxldCcsXG4gICAgYmVnaW46ICdeKFxcXFwqK3wtK3xcXFxcLit8W15cXFxcbl0rPzo6KVxcXFxzKydcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdBc2NpaURvYycsXG4gICAgYWxpYXNlczogWyAnYWRvYycgXSxcbiAgICBjb250YWluczogW1xuICAgICAgLy8gYmxvY2sgY29tbWVudFxuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAnXi97NCx9XFxcXG4nLFxuICAgICAgICAnXFxcXG4vezQsfSQnLFxuICAgICAgICAvLyBjYW4gYWxzbyBiZSBkb25lIGFzLi4uXG4gICAgICAgIC8vICdeL3s0LH0kJyxcbiAgICAgICAgLy8gJ14vezQsfSQnLFxuICAgICAgICB7IHJlbGV2YW5jZTogMTAgfVxuICAgICAgKSxcbiAgICAgIC8vIGxpbmUgY29tbWVudFxuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAnXi8vJyxcbiAgICAgICAgJyQnLFxuICAgICAgICB7IHJlbGV2YW5jZTogMCB9XG4gICAgICApLFxuICAgICAgLy8gdGl0bGVcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogJ15cXFxcLlxcXFx3LiokJ1xuICAgICAgfSxcbiAgICAgIC8vIGV4YW1wbGUsIGFkbW9uaXRpb24gJiBzaWRlYmFyIGJsb2Nrc1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ15bPVxcXFwqXXs0LH1cXFxcbicsXG4gICAgICAgIGVuZDogJ1xcXFxuXls9XFxcXCpdezQsfSQnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgLy8gaGVhZGluZ3NcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2VjdGlvbicsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ14oPXsxLDZ9KVsgXFx0XS4rPyhbIFxcdF1cXFxcMSk/JCcgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXlteXFxcXFtcXFxcXVxcXFxuXSs/XFxcXG5bPVxcXFwtflxcXFxeXFxcXCtdezIsfSQnIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIGRvY3VtZW50IGF0dHJpYnV0ZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAnXjouKz86JyxcbiAgICAgICAgZW5kOiAnXFxcXHMnLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgLy8gYmxvY2sgYXR0cmlidXRlc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXFsuKz9cXFxcXSQnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBxdW90ZWJsb2Nrc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdxdW90ZScsXG4gICAgICAgIGJlZ2luOiAnXl97NCx9XFxcXG4nLFxuICAgICAgICBlbmQ6ICdcXFxcbl97NCx9JCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICAvLyBsaXN0aW5nIGFuZCBsaXRlcmFsIGJsb2Nrc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICAgICAgYmVnaW46ICdeW1xcXFwtXFxcXC5dezQsfVxcXFxuJyxcbiAgICAgICAgZW5kOiAnXFxcXG5bXFxcXC1cXFxcLl17NCx9JCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICAvLyBwYXNzdGhyb3VnaCBibG9ja3NcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdeXFxcXCt7NCx9XFxcXG4nLFxuICAgICAgICBlbmQ6ICdcXFxcblxcXFwrezQsfSQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnPCcsXG4gICAgICAgICAgICBlbmQ6ICc+JyxcbiAgICAgICAgICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcblxuICAgICAgQlVMTEVUX0xJU1QsXG4gICAgICBBRE1PTklUSU9OLFxuICAgICAgLi4uRVNDQVBFRF9GT1JNQVRUSU5HLFxuICAgICAgLi4uU1RST05HLFxuICAgICAgLi4uRU1QSEFTSVMsXG5cbiAgICAgIC8vIGlubGluZSBzbWFydCBxdW90ZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiBcImBgLis/JydcIiB9LFxuICAgICAgICAgIHsgYmVnaW46IFwiYC4rPydcIiB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBpbmxpbmUgdW5jb25zdHJhaW5lZCBlbXBoYXNpc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICAgICAgYmVnaW46IC9gezJ9LyxcbiAgICAgICAgZW5kOiAvKFxcbnsyfXxgezJ9KS9cbiAgICAgIH0sXG4gICAgICAvLyBpbmxpbmUgY29kZSBzbmlwcGV0cyAoVE9ETyBzaG91bGQgZ2V0IHNhbWUgdHJlYXRtZW50IGFzIHN0cm9uZyBhbmQgZW1waGFzaXMpXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvZGUnLFxuICAgICAgICBiZWdpbjogJyhgLis/YHxcXFxcKy4rP1xcXFwrKScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIGluZGVudGVkIGxpdGVyYWwgYmxvY2tcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29kZScsXG4gICAgICAgIGJlZ2luOiAnXlsgXFxcXHRdJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIEhPUklaT05UQUxfUlVMRSxcbiAgICAgIC8vIGltYWdlcyBhbmQgbGlua3NcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICcobGluazopPyhodHRwfGh0dHBzfGZ0cHxmaWxlfGlyY3xpbWFnZTo/KTpcXFxcUys/XFxcXFtbXltdKj9cXFxcXScsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnKGxpbmt8aW1hZ2U6Pyk6JyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGluaycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFx3JyxcbiAgICAgICAgICAgIGVuZDogJ1teXFxcXFtdKycsXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFxbJyxcbiAgICAgICAgICAgIGVuZDogJ1xcXFxdJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGFzY2lpZG9jIGFzIGRlZmF1bHQgfTtcbiJdfQ==