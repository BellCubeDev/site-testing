function ldif(hljs) {
    return {
        name: 'LDIF',
        contains: [
            {
                className: 'attribute',
                match: '^dn(?=:)',
                relevance: 10
            },
            {
                className: 'attribute',
                match: '^\\w+(?=:)'
            },
            {
                className: 'literal',
                match: '^-'
            },
            hljs.HASH_COMMENT_MODE
        ]
    };
}
export { ldif as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGRpZi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2xkaWYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsV0FBVztnQkFDdEIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLFNBQVMsRUFBRSxFQUFFO2FBQ2Q7WUFDRDtnQkFDRSxTQUFTLEVBQUUsV0FBVztnQkFDdEIsS0FBSyxFQUFFLFlBQVk7YUFDcEI7WUFDRDtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNELElBQUksQ0FBQyxpQkFBaUI7U0FDdkI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IExESUZcbkNvbnRyaWJ1dG9yczogSmFjb2IgQ2hpbGRyZXNzIDxqYWNvYmNAZ21haWwuY29tPlxuQ2F0ZWdvcnk6IGVudGVycHJpc2UsIGNvbmZpZ1xuV2Vic2l0ZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTERBUF9EYXRhX0ludGVyY2hhbmdlX0Zvcm1hdFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGxkaWYoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdMRElGJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBtYXRjaDogJ15kbig/PTopJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgbWF0Y2g6ICdeXFxcXHcrKD89OiknXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgbWF0Y2g6ICdeLSdcbiAgICAgIH0sXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBsZGlmIGFzIGRlZmF1bHQgfTtcbiJdfQ==