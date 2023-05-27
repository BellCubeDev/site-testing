function erlangRepl(hljs) {
    const regex = hljs.regex;
    return {
        name: 'Erlang REPL',
        keywords: {
            built_in: 'spawn spawn_link self',
            keyword: 'after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if '
                + 'let not of or orelse|10 query receive rem try when xor'
        },
        contains: [
            {
                className: 'meta.prompt',
                begin: '^[0-9]+> ',
                relevance: 10
            },
            hljs.COMMENT('%', '$'),
            {
                className: 'number',
                begin: '\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)',
                relevance: 0
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            { begin: regex.concat(/\?(::)?/, /([A-Z]\w*)/, /((::)[A-Z]\w*)*/) },
            { begin: '->' },
            { begin: 'ok' },
            { begin: '!' },
            {
                begin: '(\\b[a-z\'][a-zA-Z0-9_\']*:[a-z\'][a-zA-Z0-9_\']*)|(\\b[a-z\'][a-zA-Z0-9_\']*)',
                relevance: 0
            },
            {
                begin: '[A-Z][a-zA-Z0-9_\']*',
                relevance: 0
            }
        ]
    };
}
export { erlangRepl as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJsYW5nLXJlcGwuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9lcmxhbmctcmVwbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLFVBQVUsQ0FBQyxJQUFJO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsT0FBTztRQUNMLElBQUksRUFBRSxhQUFhO1FBQ25CLFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFDTix1QkFBdUI7WUFDekIsT0FBTyxFQUNMLHVGQUF1RjtrQkFDckYsd0RBQXdEO1NBQzdEO1FBQ0QsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLEtBQUssRUFBRSxXQUFXO2dCQUNsQixTQUFTLEVBQUUsRUFBRTthQUNkO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3RCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsK0ZBQStGO2dCQUN0RyxTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQ25CLFNBQVMsRUFDVCxZQUFZLEVBQ1osaUJBQWlCLENBQ2xCLEVBQUU7WUFDSCxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDZixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDZixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDZDtnQkFDRSxLQUFLLEVBQUUsZ0ZBQWdGO2dCQUN2RixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHNCQUFzQjtnQkFDN0IsU0FBUyxFQUFFLENBQUM7YUFDYjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsVUFBVSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBFcmxhbmcgUkVQTFxuQXV0aG9yOiBTZXJnZXkgSWduYXRvdiA8c2VyZ2V5QGlnbmF0b3Yuc3BiLnN1PlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuZXJsYW5nLm9yZ1xuQ2F0ZWdvcnk6IGZ1bmN0aW9uYWxcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBlcmxhbmdSZXBsKGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdFcmxhbmcgUkVQTCcsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnc3Bhd24gc3Bhd25fbGluayBzZWxmJyxcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhZnRlciBhbmQgYW5kYWxzb3wxMCBiYW5kIGJlZ2luIGJub3QgYm9yIGJzbCBic3IgYnhvciBjYXNlIGNhdGNoIGNvbmQgZGl2IGVuZCBmdW4gaWYgJ1xuICAgICAgICArICdsZXQgbm90IG9mIG9yIG9yZWxzZXwxMCBxdWVyeSByZWNlaXZlIHJlbSB0cnkgd2hlbiB4b3InXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhLnByb21wdCcsXG4gICAgICAgIGJlZ2luOiAnXlswLTldKz4gJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIGhsanMuQ09NTUVOVCgnJScsICckJyksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoXFxcXGQrKF9cXFxcZCspKiNbYS1mQS1GMC05XSsoX1thLWZBLUYwLTldKykqfFxcXFxkKyhfXFxcXGQrKSooXFxcXC5cXFxcZCsoX1xcXFxkKykqKT8oW2VFXVstK10/XFxcXGQrKT8pJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdChcbiAgICAgICAgL1xcPyg6Oik/LyxcbiAgICAgICAgLyhbQS1aXVxcdyopLywgLy8gYXQgbGVhc3Qgb25lIGlkZW50aWZpZXJcbiAgICAgICAgLygoOjopW0EtWl1cXHcqKSovIC8vIHBlcmhhcHMgbW9yZVxuICAgICAgKSB9LFxuICAgICAgeyBiZWdpbjogJy0+JyB9LFxuICAgICAgeyBiZWdpbjogJ29rJyB9LFxuICAgICAgeyBiZWdpbjogJyEnIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnKFxcXFxiW2EtelxcJ11bYS16QS1aMC05X1xcJ10qOlthLXpcXCddW2EtekEtWjAtOV9cXCddKil8KFxcXFxiW2EtelxcJ11bYS16QS1aMC05X1xcJ10qKScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdbQS1aXVthLXpBLVowLTlfXFwnXSonLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGVybGFuZ1JlcGwgYXMgZGVmYXVsdCB9O1xuIl19