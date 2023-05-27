function nginx(hljs) {
    const regex = hljs.regex;
    const VAR = {
        className: 'variable',
        variants: [
            { begin: /\$\d+/ },
            { begin: /\$\{\w+\}/ },
            { begin: regex.concat(/[$@]/, hljs.UNDERSCORE_IDENT_RE) }
        ]
    };
    const LITERALS = [
        "on",
        "off",
        "yes",
        "no",
        "true",
        "false",
        "none",
        "blocked",
        "debug",
        "info",
        "notice",
        "warn",
        "error",
        "crit",
        "select",
        "break",
        "last",
        "permanent",
        "redirect",
        "kqueue",
        "rtsig",
        "epoll",
        "poll",
        "/dev/poll"
    ];
    const DEFAULT = {
        endsWithParent: true,
        keywords: {
            $pattern: /[a-z_]{2,}|\/dev\/poll/,
            literal: LITERALS
        },
        relevance: 0,
        illegal: '=>',
        contains: [
            hljs.HASH_COMMENT_MODE,
            {
                className: 'string',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    VAR
                ],
                variants: [
                    {
                        begin: /"/,
                        end: /"/
                    },
                    {
                        begin: /'/,
                        end: /'/
                    }
                ]
            },
            {
                begin: '([a-z]+):/',
                end: '\\s',
                endsWithParent: true,
                excludeEnd: true,
                contains: [VAR]
            },
            {
                className: 'regexp',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    VAR
                ],
                variants: [
                    {
                        begin: "\\s\\^",
                        end: "\\s|\\{|;",
                        returnEnd: true
                    },
                    {
                        begin: "~\\*?\\s+",
                        end: "\\s|\\{|;",
                        returnEnd: true
                    },
                    { begin: "\\*(\\.[a-z\\-]+)+" },
                    { begin: "([a-z\\-]+\\.)+\\*" }
                ]
            },
            {
                className: 'number',
                begin: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b'
            },
            {
                className: 'number',
                begin: '\\b\\d+[kKmMgGdshdwy]?\\b',
                relevance: 0
            },
            VAR
        ]
    };
    return {
        name: 'Nginx config',
        aliases: ['nginxconf'],
        contains: [
            hljs.HASH_COMMENT_MODE,
            {
                beginKeywords: "upstream location",
                end: /;|\{/,
                contains: DEFAULT.contains,
                keywords: { section: "upstream location" }
            },
            {
                className: 'section',
                begin: regex.concat(hljs.UNDERSCORE_IDENT_RE + regex.lookahead(/\s+\{/)),
                relevance: 0
            },
            {
                begin: regex.lookahead(hljs.UNDERSCORE_IDENT_RE + '\\s'),
                end: ';|\\{',
                contains: [
                    {
                        className: 'attribute',
                        begin: hljs.UNDERSCORE_IDENT_RE,
                        starts: DEFAULT
                    }
                ],
                relevance: 0
            }
        ],
        illegal: '[^\\s\\}\\{]'
    };
}
export { nginx as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdpbnguanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9uZ2lueC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsTUFBTSxHQUFHLEdBQUc7UUFDVixTQUFTLEVBQUUsVUFBVTtRQUNyQixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDbEIsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3RCLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1NBQzFEO0tBQ0YsQ0FBQztJQUNGLE1BQU0sUUFBUSxHQUFHO1FBQ2YsSUFBSTtRQUNKLEtBQUs7UUFDTCxLQUFLO1FBQ0wsSUFBSTtRQUNKLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLFNBQVM7UUFDVCxPQUFPO1FBQ1AsTUFBTTtRQUNOLFFBQVE7UUFDUixNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixRQUFRO1FBQ1IsT0FBTztRQUNQLE1BQU07UUFDTixXQUFXO1FBQ1gsVUFBVTtRQUNWLFFBQVE7UUFDUixPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixXQUFXO0tBQ1osQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHO1FBQ2QsY0FBYyxFQUFFLElBQUk7UUFDcEIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxPQUFPLEVBQUUsUUFBUTtTQUNsQjtRQUNELFNBQVMsRUFBRSxDQUFDO1FBQ1osT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckIsR0FBRztpQkFDSjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsR0FBRyxFQUFFLEdBQUc7cUJBQ1Q7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsR0FBRyxFQUFFLEdBQUc7cUJBQ1Q7aUJBQ0Y7YUFDRjtZQUVEO2dCQUNFLEtBQUssRUFBRSxZQUFZO2dCQUNuQixHQUFHLEVBQUUsS0FBSztnQkFDVixjQUFjLEVBQUUsSUFBSTtnQkFDcEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRSxDQUFFLEdBQUcsQ0FBRTthQUNsQjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckIsR0FBRztpQkFDSjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLFFBQVE7d0JBQ2YsR0FBRyxFQUFFLFdBQVc7d0JBQ2hCLFNBQVMsRUFBRSxJQUFJO3FCQUNoQjtvQkFFRDt3QkFDRSxLQUFLLEVBQUUsV0FBVzt3QkFDbEIsR0FBRyxFQUFFLFdBQVc7d0JBQ2hCLFNBQVMsRUFBRSxJQUFJO3FCQUNoQjtvQkFFRCxFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtvQkFFL0IsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUU7aUJBQ2hDO2FBQ0Y7WUFFRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLDZEQUE2RDthQUNyRTtZQUVEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsMkJBQTJCO2dCQUNsQyxTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0QsR0FBRztTQUNKO0tBQ0YsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsQ0FBRSxXQUFXLENBQUU7UUFDeEIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QjtnQkFDRSxhQUFhLEVBQUUsbUJBQW1CO2dCQUNsQyxHQUFHLEVBQUUsTUFBTTtnQkFDWCxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7Z0JBQzFCLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTthQUMzQztZQUNEO2dCQUNFLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEUsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ3hELEdBQUcsRUFBRSxPQUFPO2dCQUNaLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUUsV0FBVzt3QkFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7d0JBQy9CLE1BQU0sRUFBRSxPQUFPO3FCQUNoQjtpQkFDRjtnQkFDRCxTQUFTLEVBQUUsQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsY0FBYztLQUN4QixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxLQUFLLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IE5naW54IGNvbmZpZ1xuQXV0aG9yOiBQZXRlciBMZW9ub3YgPGdvanBlZ0B5YW5kZXgucnU+XG5Db250cmlidXRvcnM6IEl2YW4gU2FnYWxhZXYgPG1hbmlhY0Bzb2Z0d2FyZW1hbmlhY3Mub3JnPlxuQ2F0ZWdvcnk6IGNvbmZpZywgd2ViXG5XZWJzaXRlOiBodHRwczovL3d3dy5uZ2lueC5jb21cbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBuZ2lueChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgVkFSID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogL1xcJFxcZCsvIH0sXG4gICAgICB7IGJlZ2luOiAvXFwkXFx7XFx3K1xcfS8gfSxcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvWyRAXS8sIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSkgfVxuICAgIF1cbiAgfTtcbiAgY29uc3QgTElURVJBTFMgPSBbXG4gICAgXCJvblwiLFxuICAgIFwib2ZmXCIsXG4gICAgXCJ5ZXNcIixcbiAgICBcIm5vXCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwibm9uZVwiLFxuICAgIFwiYmxvY2tlZFwiLFxuICAgIFwiZGVidWdcIixcbiAgICBcImluZm9cIixcbiAgICBcIm5vdGljZVwiLFxuICAgIFwid2FyblwiLFxuICAgIFwiZXJyb3JcIixcbiAgICBcImNyaXRcIixcbiAgICBcInNlbGVjdFwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImxhc3RcIixcbiAgICBcInBlcm1hbmVudFwiLFxuICAgIFwicmVkaXJlY3RcIixcbiAgICBcImtxdWV1ZVwiLFxuICAgIFwicnRzaWdcIixcbiAgICBcImVwb2xsXCIsXG4gICAgXCJwb2xsXCIsXG4gICAgXCIvZGV2L3BvbGxcIlxuICBdO1xuICBjb25zdCBERUZBVUxUID0ge1xuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogL1thLXpfXXsyLH18XFwvZGV2XFwvcG9sbC8sXG4gICAgICBsaXRlcmFsOiBMSVRFUkFMU1xuICAgIH0sXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGlsbGVnYWw6ICc9PicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgIFZBUlxuICAgICAgICBdLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAvXCIvLFxuICAgICAgICAgICAgZW5kOiAvXCIvXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLycvLFxuICAgICAgICAgICAgZW5kOiAvJy9cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyB0aGlzIHN3YWxsb3dzIGVudGlyZSBVUkxzIHRvIGF2b2lkIGRldGVjdGluZyBudW1iZXJzIHdpdGhpblxuICAgICAge1xuICAgICAgICBiZWdpbjogJyhbYS16XSspOi8nLFxuICAgICAgICBlbmQ6ICdcXFxccycsXG4gICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogWyBWQVIgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgICAgVkFSXG4gICAgICAgIF0sXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IFwiXFxcXHNcXFxcXlwiLFxuICAgICAgICAgICAgZW5kOiBcIlxcXFxzfFxcXFx7fDtcIixcbiAgICAgICAgICAgIHJldHVybkVuZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8gcmVnZXhwIGxvY2F0aW9ucyAofiwgfiopXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IFwiflxcXFwqP1xcXFxzK1wiLFxuICAgICAgICAgICAgZW5kOiBcIlxcXFxzfFxcXFx7fDtcIixcbiAgICAgICAgICAgIHJldHVybkVuZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8gKi5leGFtcGxlLmNvbVxuICAgICAgICAgIHsgYmVnaW46IFwiXFxcXCooXFxcXC5bYS16XFxcXC1dKykrXCIgfSxcbiAgICAgICAgICAvLyBzdWIuZXhhbXBsZS4qXG4gICAgICAgICAgeyBiZWdpbjogXCIoW2EtelxcXFwtXStcXFxcLikrXFxcXCpcIiB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBJUFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiXFxcXGR7MSwzfVxcXFwuXFxcXGR7MSwzfVxcXFwuXFxcXGR7MSwzfVxcXFwuXFxcXGR7MSwzfSg6XFxcXGR7MSw1fSk/XFxcXGInXG4gICAgICB9LFxuICAgICAgLy8gdW5pdHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYlxcXFxkK1trS21NZ0dkc2hkd3ldP1xcXFxiJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgVkFSXG4gICAgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ05naW54IGNvbmZpZycsXG4gICAgYWxpYXNlczogWyAnbmdpbnhjb25mJyBdLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiBcInVwc3RyZWFtIGxvY2F0aW9uXCIsXG4gICAgICAgIGVuZDogLzt8XFx7LyxcbiAgICAgICAgY29udGFpbnM6IERFRkFVTFQuY29udGFpbnMsXG4gICAgICAgIGtleXdvcmRzOiB7IHNlY3Rpb246IFwidXBzdHJlYW0gbG9jYXRpb25cIiB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZWN0aW9uJyxcbiAgICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdChobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyByZWdleC5sb29rYWhlYWQoL1xccytcXHsvKSksXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IHJlZ2V4Lmxvb2thaGVhZChobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnXFxcXHMnKSxcbiAgICAgICAgZW5kOiAnO3xcXFxceycsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgICAgICBzdGFydHM6IERFRkFVTFRcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogJ1teXFxcXHNcXFxcfVxcXFx7XSdcbiAgfTtcbn1cblxuZXhwb3J0IHsgbmdpbnggYXMgZGVmYXVsdCB9O1xuIl19