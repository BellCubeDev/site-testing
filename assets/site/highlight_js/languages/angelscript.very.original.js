function angelscript(hljs) {
    const builtInTypeMode = {
        className: 'built_in',
        begin: '\\b(void|bool|int8|int16|int32|int64|int|uint8|uint16|uint32|uint64|uint|string|ref|array|double|float|auto|dictionary)'
    };
    const objectHandleMode = {
        className: 'symbol',
        begin: '[a-zA-Z0-9_]+@'
    };
    const genericMode = {
        className: 'keyword',
        begin: '<',
        end: '>',
        contains: [
            builtInTypeMode,
            objectHandleMode
        ]
    };
    builtInTypeMode.contains = [genericMode];
    objectHandleMode.contains = [genericMode];
    const KEYWORDS = [
        "for",
        "in|0",
        "break",
        "continue",
        "while",
        "do|0",
        "return",
        "if",
        "else",
        "case",
        "switch",
        "namespace",
        "is",
        "cast",
        "or",
        "and",
        "xor",
        "not",
        "get|0",
        "in",
        "inout|10",
        "out",
        "override",
        "set|0",
        "private",
        "public",
        "const",
        "default|0",
        "final",
        "shared",
        "external",
        "mixin|10",
        "enum",
        "typedef",
        "funcdef",
        "this",
        "super",
        "import",
        "from",
        "interface",
        "abstract|0",
        "try",
        "catch",
        "protected",
        "explicit",
        "property"
    ];
    return {
        name: 'AngelScript',
        aliases: ['asc'],
        keywords: KEYWORDS,
        illegal: '(^using\\s+[A-Za-z0-9_\\.]+;$|\\bfunction\\s*[^\\(])',
        contains: [
            {
                className: 'string',
                begin: '\'',
                end: '\'',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE],
                relevance: 0
            },
            {
                className: 'string',
                begin: '"""',
                end: '"""'
            },
            {
                className: 'string',
                begin: '"',
                end: '"',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE],
                relevance: 0
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'string',
                begin: '^\\s*\\[',
                end: '\\]'
            },
            {
                beginKeywords: 'interface namespace',
                end: /\{/,
                illegal: '[;.\\-]',
                contains: [
                    {
                        className: 'symbol',
                        begin: '[a-zA-Z0-9_]+'
                    }
                ]
            },
            {
                beginKeywords: 'class',
                end: /\{/,
                illegal: '[;.\\-]',
                contains: [
                    {
                        className: 'symbol',
                        begin: '[a-zA-Z0-9_]+',
                        contains: [
                            {
                                begin: '[:,]\\s*',
                                contains: [
                                    {
                                        className: 'symbol',
                                        begin: '[a-zA-Z0-9_]+'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            builtInTypeMode,
            objectHandleMode,
            {
                className: 'literal',
                begin: '\\b(null|true|false)'
            },
            {
                className: 'number',
                relevance: 0,
                begin: '(-?)(\\b0[xXbBoOdD][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?f?|\\.\\d+f?)([eE][-+]?\\d+f?)?)'
            }
        ]
    };
}
export { angelscript as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5nZWxzY3JpcHQuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9hbmdlbHNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLFdBQVcsQ0FBQyxJQUFJO0lBQ3ZCLE1BQU0sZUFBZSxHQUFHO1FBQ3RCLFNBQVMsRUFBRSxVQUFVO1FBQ3JCLEtBQUssRUFBRSx5SEFBeUg7S0FDakksQ0FBQztJQUVGLE1BQU0sZ0JBQWdCLEdBQUc7UUFDdkIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLGdCQUFnQjtLQUN4QixDQUFDO0lBRUYsTUFBTSxXQUFXLEdBQUc7UUFDbEIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsS0FBSyxFQUFFLEdBQUc7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRTtZQUNSLGVBQWU7WUFDZixnQkFBZ0I7U0FDakI7S0FDRixDQUFDO0lBRUYsZUFBZSxDQUFDLFFBQVEsR0FBRyxDQUFFLFdBQVcsQ0FBRSxDQUFDO0lBQzNDLGdCQUFnQixDQUFDLFFBQVEsR0FBRyxDQUFFLFdBQVcsQ0FBRSxDQUFDO0lBRTVDLE1BQU0sUUFBUSxHQUFHO1FBQ2YsS0FBSztRQUNMLE1BQU07UUFDTixPQUFPO1FBQ1AsVUFBVTtRQUNWLE9BQU87UUFDUCxNQUFNO1FBQ04sUUFBUTtRQUNSLElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtRQUNOLFFBQVE7UUFDUixXQUFXO1FBQ1gsSUFBSTtRQUNKLE1BQU07UUFDTixJQUFJO1FBQ0osS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsT0FBTztRQUNQLElBQUk7UUFDSixVQUFVO1FBQ1YsS0FBSztRQUNMLFVBQVU7UUFDVixPQUFPO1FBQ1AsU0FBUztRQUNULFFBQVE7UUFDUixPQUFPO1FBQ1AsV0FBVztRQUNYLE9BQU87UUFDUCxRQUFRO1FBQ1IsVUFBVTtRQUNWLFVBQVU7UUFDVixNQUFNO1FBQ04sU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNO1FBQ04sT0FBTztRQUNQLFFBQVE7UUFDUixNQUFNO1FBQ04sV0FBVztRQUNYLFlBQVk7UUFDWixLQUFLO1FBQ0wsT0FBTztRQUNQLFdBQVc7UUFDWCxVQUFVO1FBQ1YsVUFBVTtLQUNYLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLENBQUUsS0FBSyxDQUFFO1FBRWxCLFFBQVEsRUFBRSxRQUFRO1FBR2xCLE9BQU8sRUFBRSxzREFBc0Q7UUFFL0QsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxJQUFJO2dCQUNYLEdBQUcsRUFBRSxJQUFJO2dCQUNULE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxDQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRTtnQkFDbkMsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUdEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsS0FBSztnQkFDWixHQUFHLEVBQUUsS0FBSzthQUNYO1lBRUQ7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxDQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRTtnQkFDbkMsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUVELElBQUksQ0FBQyxtQkFBbUI7WUFDeEIsSUFBSSxDQUFDLG9CQUFvQjtZQUV6QjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLEdBQUcsRUFBRSxLQUFLO2FBQ1g7WUFFRDtnQkFDRSxhQUFhLEVBQUUscUJBQXFCO2dCQUNwQyxHQUFHLEVBQUUsSUFBSTtnQkFDVCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsZUFBZTtxQkFDdkI7aUJBQ0Y7YUFDRjtZQUVEO2dCQUNFLGFBQWEsRUFBRSxPQUFPO2dCQUN0QixHQUFHLEVBQUUsSUFBSTtnQkFDVCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsZUFBZTt3QkFDdEIsUUFBUSxFQUFFOzRCQUNSO2dDQUNFLEtBQUssRUFBRSxVQUFVO2dDQUNqQixRQUFRLEVBQUU7b0NBQ1I7d0NBQ0UsU0FBUyxFQUFFLFFBQVE7d0NBQ25CLEtBQUssRUFBRSxlQUFlO3FDQUN2QjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1lBRUQsZUFBZTtZQUNmLGdCQUFnQjtZQUVoQjtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsS0FBSyxFQUFFLHNCQUFzQjthQUM5QjtZQUVEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixTQUFTLEVBQUUsQ0FBQztnQkFDWixLQUFLLEVBQUUsb0ZBQW9GO2FBQzVGO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxXQUFXLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IEFuZ2VsU2NyaXB0XG5BdXRob3I6IE1lbGlzc2EgR2VlbHMgPG1lbGlzc2FAbmltYmxlLnRvb2xzPlxuQ2F0ZWdvcnk6IHNjcmlwdGluZ1xuV2Vic2l0ZTogaHR0cHM6Ly93d3cuYW5nZWxjb2RlLmNvbS9hbmdlbHNjcmlwdC9cbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBhbmdlbHNjcmlwdChobGpzKSB7XG4gIGNvbnN0IGJ1aWx0SW5UeXBlTW9kZSA9IHtcbiAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgYmVnaW46ICdcXFxcYih2b2lkfGJvb2x8aW50OHxpbnQxNnxpbnQzMnxpbnQ2NHxpbnR8dWludDh8dWludDE2fHVpbnQzMnx1aW50NjR8dWludHxzdHJpbmd8cmVmfGFycmF5fGRvdWJsZXxmbG9hdHxhdXRvfGRpY3Rpb25hcnkpJ1xuICB9O1xuXG4gIGNvbnN0IG9iamVjdEhhbmRsZU1vZGUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICBiZWdpbjogJ1thLXpBLVowLTlfXStAJ1xuICB9O1xuXG4gIGNvbnN0IGdlbmVyaWNNb2RlID0ge1xuICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgIGJlZ2luOiAnPCcsXG4gICAgZW5kOiAnPicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGJ1aWx0SW5UeXBlTW9kZSxcbiAgICAgIG9iamVjdEhhbmRsZU1vZGVcbiAgICBdXG4gIH07XG5cbiAgYnVpbHRJblR5cGVNb2RlLmNvbnRhaW5zID0gWyBnZW5lcmljTW9kZSBdO1xuICBvYmplY3RIYW5kbGVNb2RlLmNvbnRhaW5zID0gWyBnZW5lcmljTW9kZSBdO1xuXG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwiZm9yXCIsXG4gICAgXCJpbnwwXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJkb3wwXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcImlmXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcIm5hbWVzcGFjZVwiLFxuICAgIFwiaXNcIixcbiAgICBcImNhc3RcIixcbiAgICBcIm9yXCIsXG4gICAgXCJhbmRcIixcbiAgICBcInhvclwiLFxuICAgIFwibm90XCIsXG4gICAgXCJnZXR8MFwiLFxuICAgIFwiaW5cIixcbiAgICBcImlub3V0fDEwXCIsXG4gICAgXCJvdXRcIixcbiAgICBcIm92ZXJyaWRlXCIsXG4gICAgXCJzZXR8MFwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiZGVmYXVsdHwwXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwic2hhcmVkXCIsXG4gICAgXCJleHRlcm5hbFwiLFxuICAgIFwibWl4aW58MTBcIixcbiAgICBcImVudW1cIixcbiAgICBcInR5cGVkZWZcIixcbiAgICBcImZ1bmNkZWZcIixcbiAgICBcInRoaXNcIixcbiAgICBcInN1cGVyXCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImZyb21cIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwiYWJzdHJhY3R8MFwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwicHJvdGVjdGVkXCIsXG4gICAgXCJleHBsaWNpdFwiLFxuICAgIFwicHJvcGVydHlcIlxuICBdO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0FuZ2VsU2NyaXB0JyxcbiAgICBhbGlhc2VzOiBbICdhc2MnIF0sXG5cbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG5cbiAgICAvLyBhdm9pZCBjbG9zZSBkZXRlY3Rpb24gd2l0aCBDIyBhbmQgSlNcbiAgICBpbGxlZ2FsOiAnKF51c2luZ1xcXFxzK1tBLVphLXowLTlfXFxcXC5dKzskfFxcXFxiZnVuY3Rpb25cXFxccypbXlxcXFwoXSknLFxuXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHsgLy8gJ3N0cmluZ3MnXG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJyxcbiAgICAgICAgZW5kOiAnXFwnJyxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICAgICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcblxuICAgICAgLy8gXCJcIlwiaGVyZWRvYyBzdHJpbmdzXCJcIlwiXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCJcIlwiJyxcbiAgICAgICAgZW5kOiAnXCJcIlwiJ1xuICAgICAgfSxcblxuICAgICAgeyAvLyBcInN0cmluZ3NcIlxuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsIC8vIHNpbmdsZS1saW5lIGNvbW1lbnRzXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLCAvLyBjb21tZW50IGJsb2Nrc1xuXG4gICAgICB7IC8vIG1ldGFkYXRhXG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXlxcXFxzKlxcXFxbJyxcbiAgICAgICAgZW5kOiAnXFxcXF0nXG4gICAgICB9LFxuXG4gICAgICB7IC8vIGludGVyZmFjZSBvciBuYW1lc3BhY2UgZGVjbGFyYXRpb25cbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2ludGVyZmFjZSBuYW1lc3BhY2UnLFxuICAgICAgICBlbmQ6IC9cXHsvLFxuICAgICAgICBpbGxlZ2FsOiAnWzsuXFxcXC1dJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7IC8vIGludGVyZmFjZSBvciBuYW1lc3BhY2UgbmFtZVxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgICAgIGJlZ2luOiAnW2EtekEtWjAtOV9dKydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG5cbiAgICAgIHsgLy8gY2xhc3MgZGVjbGFyYXRpb25cbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzJyxcbiAgICAgICAgZW5kOiAvXFx7LyxcbiAgICAgICAgaWxsZWdhbDogJ1s7LlxcXFwtXScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgeyAvLyBjbGFzcyBuYW1lXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgICAgICAgICAgYmVnaW46ICdbYS16QS1aMC05X10rJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1s6LF1cXFxccyonLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiAnW2EtekEtWjAtOV9dKydcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG5cbiAgICAgIGJ1aWx0SW5UeXBlTW9kZSwgLy8gYnVpbHQtaW4gdHlwZXNcbiAgICAgIG9iamVjdEhhbmRsZU1vZGUsIC8vIG9iamVjdCBoYW5kbGVzXG5cbiAgICAgIHsgLy8gbGl0ZXJhbHNcbiAgICAgICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIobnVsbHx0cnVlfGZhbHNlKSdcbiAgICAgIH0sXG5cbiAgICAgIHsgLy8gbnVtYmVyc1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGJlZ2luOiAnKC0/KShcXFxcYjBbeFhiQm9PZERdW2EtZkEtRjAtOV0rfChcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKik/Zj98XFxcXC5cXFxcZCtmPykoW2VFXVstK10/XFxcXGQrZj8pPyknXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBhbmdlbHNjcmlwdCBhcyBkZWZhdWx0IH07XG4iXX0=