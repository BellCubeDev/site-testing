function diff(hljs) {
    const regex = hljs.regex;
    return {
        name: 'Diff',
        aliases: ['patch'],
        contains: [
            {
                className: 'meta',
                relevance: 10,
                match: regex.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/, /^\*\*\* +\d+,\d+ +\*\*\*\*$/, /^--- +\d+,\d+ +----$/)
            },
            {
                className: 'comment',
                variants: [
                    {
                        begin: regex.either(/Index: /, /^index/, /={3,}/, /^-{3}/, /^\*{3} /, /^\+{3}/, /^diff --git/),
                        end: /$/
                    },
                    { match: /^\*{15}$/ }
                ]
            },
            {
                className: 'addition',
                begin: /^\+/,
                end: /$/
            },
            {
                className: 'deletion',
                begin: /^-/,
                end: /$/
            },
            {
                className: 'addition',
                begin: /^!/,
                end: /$/
            }
        ]
    };
}
export { diff as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2RpZmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFFLE9BQU8sQ0FBRTtRQUNwQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQ2pCLDhCQUE4QixFQUM5Qiw2QkFBNkIsRUFDN0Isc0JBQXNCLENBQ3ZCO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUNqQixTQUFTLEVBQ1QsUUFBUSxFQUNSLE9BQU8sRUFDUCxPQUFPLEVBQ1AsU0FBUyxFQUNULFFBQVEsRUFDUixhQUFhLENBQ2Q7d0JBQ0QsR0FBRyxFQUFFLEdBQUc7cUJBQ1Q7b0JBQ0QsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO2lCQUN0QjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLEtBQUssRUFBRSxLQUFLO2dCQUNaLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7WUFDRDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLEdBQUc7YUFDVDtZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsR0FBRzthQUNUO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IERpZmZcbkRlc2NyaXB0aW9uOiBVbmlmaWVkIGFuZCBjb250ZXh0IGRpZmZcbkF1dGhvcjogVmFzaWx5IFBvbG92bnlvdiA8dmFzdEB3aGl0ZWFudHMubmV0PlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9kaWZmdXRpbHMvXG5DYXRlZ29yeTogY29tbW9uXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZGlmZihobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnRGlmZicsXG4gICAgYWxpYXNlczogWyAncGF0Y2gnIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIG1hdGNoOiByZWdleC5laXRoZXIoXG4gICAgICAgICAgL15AQCArLVxcZCssXFxkKyArXFwrXFxkKyxcXGQrICtAQC8sXG4gICAgICAgICAgL15cXCpcXCpcXCogK1xcZCssXFxkKyArXFwqXFwqXFwqXFwqJC8sXG4gICAgICAgICAgL14tLS0gK1xcZCssXFxkKyArLS0tLSQvXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiByZWdleC5laXRoZXIoXG4gICAgICAgICAgICAgIC9JbmRleDogLyxcbiAgICAgICAgICAgICAgL15pbmRleC8sXG4gICAgICAgICAgICAgIC89ezMsfS8sXG4gICAgICAgICAgICAgIC9eLXszfS8sXG4gICAgICAgICAgICAgIC9eXFwqezN9IC8sXG4gICAgICAgICAgICAgIC9eXFwrezN9LyxcbiAgICAgICAgICAgICAgL15kaWZmIC0tZ2l0L1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGVuZDogLyQvXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IG1hdGNoOiAvXlxcKnsxNX0kLyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2FkZGl0aW9uJyxcbiAgICAgICAgYmVnaW46IC9eXFwrLyxcbiAgICAgICAgZW5kOiAvJC9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2RlbGV0aW9uJyxcbiAgICAgICAgYmVnaW46IC9eLS8sXG4gICAgICAgIGVuZDogLyQvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhZGRpdGlvbicsXG4gICAgICAgIGJlZ2luOiAvXiEvLFxuICAgICAgICBlbmQ6IC8kL1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZGlmZiBhcyBkZWZhdWx0IH07XG4iXX0=