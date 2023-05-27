function dockerfile(hljs) {
    const KEYWORDS = [
        "from",
        "maintainer",
        "expose",
        "env",
        "arg",
        "user",
        "onbuild",
        "stopsignal"
    ];
    return {
        name: 'Dockerfile',
        aliases: ['docker'],
        case_insensitive: true,
        keywords: KEYWORDS,
        contains: [
            hljs.HASH_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            {
                beginKeywords: 'run cmd entrypoint volume add copy workdir label healthcheck shell',
                starts: {
                    end: /[^\\]$/,
                    subLanguage: 'bash'
                }
            }
        ],
        illegal: '</'
    };
}
export { dockerfile as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyZmlsZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2RvY2tlcmZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsU0FBUyxVQUFVLENBQUMsSUFBSTtJQUN0QixNQUFNLFFBQVEsR0FBRztRQUNmLE1BQU07UUFDTixZQUFZO1FBQ1osUUFBUTtRQUNSLEtBQUs7UUFDTCxLQUFLO1FBQ0wsTUFBTTtRQUNOLFNBQVM7UUFDVCxZQUFZO0tBQ2IsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsQ0FBRSxRQUFRLENBQUU7UUFDckIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsV0FBVztZQUNoQjtnQkFDRSxhQUFhLEVBQUUsb0VBQW9FO2dCQUNuRixNQUFNLEVBQUU7b0JBQ04sR0FBRyxFQUFFLFFBQVE7b0JBQ2IsV0FBVyxFQUFFLE1BQU07aUJBQ3BCO2FBQ0Y7U0FDRjtRQUNELE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsVUFBVSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBEb2NrZXJmaWxlXG5SZXF1aXJlczogYmFzaC5qc1xuQXV0aG9yOiBBbGV4aXMgSMOpbmF1dCA8YWxleGlzQGhlbmF1dC5uZXQ+XG5EZXNjcmlwdGlvbjogbGFuZ3VhZ2UgZGVmaW5pdGlvbiBmb3IgRG9ja2VyZmlsZSBmaWxlc1xuV2Vic2l0ZTogaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9idWlsZGVyL1xuQ2F0ZWdvcnk6IGNvbmZpZ1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGRvY2tlcmZpbGUoaGxqcykge1xuICBjb25zdCBLRVlXT1JEUyA9IFtcbiAgICBcImZyb21cIixcbiAgICBcIm1haW50YWluZXJcIixcbiAgICBcImV4cG9zZVwiLFxuICAgIFwiZW52XCIsXG4gICAgXCJhcmdcIixcbiAgICBcInVzZXJcIixcbiAgICBcIm9uYnVpbGRcIixcbiAgICBcInN0b3BzaWduYWxcIlxuICBdO1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdEb2NrZXJmaWxlJyxcbiAgICBhbGlhc2VzOiBbICdkb2NrZXInIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ3J1biBjbWQgZW50cnlwb2ludCB2b2x1bWUgYWRkIGNvcHkgd29ya2RpciBsYWJlbCBoZWFsdGhjaGVjayBzaGVsbCcsXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogL1teXFxcXF0kLyxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogJ2Jhc2gnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdLFxuICAgIGlsbGVnYWw6ICc8LydcbiAgfTtcbn1cblxuZXhwb3J0IHsgZG9ja2VyZmlsZSBhcyBkZWZhdWx0IH07XG4iXX0=