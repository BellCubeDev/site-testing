function shell(hljs) {
    return {
        name: 'Shell Session',
        aliases: [
            'console',
            'shellsession'
        ],
        contains: [
            {
                className: 'meta.prompt',
                begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
                starts: {
                    end: /[^\\](?=\s*$)/,
                    subLanguage: 'bash'
                }
            }
        ]
    };
}
export { shell as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlbGwuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9zaGVsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE9BQU87UUFDTCxJQUFJLEVBQUUsZUFBZTtRQUNyQixPQUFPLEVBQUU7WUFDUCxTQUFTO1lBQ1QsY0FBYztTQUNmO1FBQ0QsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsU0FBUyxFQUFFLGFBQWE7Z0JBSXhCLEtBQUssRUFBRSxvQ0FBb0M7Z0JBQzNDLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUUsZUFBZTtvQkFDcEIsV0FBVyxFQUFFLE1BQU07aUJBQ3BCO2FBQ0Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogU2hlbGwgU2Vzc2lvblxuUmVxdWlyZXM6IGJhc2guanNcbkF1dGhvcjogVFNVWVVTQVRPIEtpdHN1bmUgPG1ha2UuanVzdC5vbkBnbWFpbC5jb20+XG5DYXRlZ29yeTogY29tbW9uXG5BdWRpdDogMjAyMFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIHNoZWxsKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnU2hlbGwgU2Vzc2lvbicsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ2NvbnNvbGUnLFxuICAgICAgJ3NoZWxsc2Vzc2lvbidcbiAgICBdLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEucHJvbXB0JyxcbiAgICAgICAgLy8gV2UgY2Fubm90IGFkZCBcXHMgKHNwYWNlcykgaW4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBvdGhlcndpc2UgaXQgd2lsbCBiZSB0b28gYnJvYWQgYW5kIHByb2R1Y2UgdW5leHBlY3RlZCByZXN1bHQuXG4gICAgICAgIC8vIEZvciBpbnN0YW5jZSwgaW4gdGhlIGZvbGxvd2luZyBleGFtcGxlLCBpdCB3b3VsZCBtYXRjaCBcImVjaG8gL3BhdGgvdG8vaG9tZSA+XCIgYXMgYSBwcm9tcHQ6XG4gICAgICAgIC8vIGVjaG8gL3BhdGgvdG8vaG9tZSA+IHQuZXhlXG4gICAgICAgIGJlZ2luOiAvXlxcc3swLDN9Wy9+XFx3XFxkW1xcXSgpQC1dKls+JSQjXVsgXT8vLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC9bXlxcXFxdKD89XFxzKiQpLyxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogJ2Jhc2gnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHNoZWxsIGFzIGRlZmF1bHQgfTtcbiJdfQ==