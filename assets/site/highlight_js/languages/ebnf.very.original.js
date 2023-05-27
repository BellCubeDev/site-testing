function ebnf(hljs) {
    const commentMode = hljs.COMMENT(/\(\*/, /\*\)/);
    const nonTerminalMode = {
        className: "attribute",
        begin: /^[ ]*[a-zA-Z]+([\s_-]+[a-zA-Z]+)*/
    };
    const specialSequenceMode = {
        className: "meta",
        begin: /\?.*\?/
    };
    const ruleBodyMode = {
        begin: /=/,
        end: /[.;]/,
        contains: [
            commentMode,
            specialSequenceMode,
            {
                className: 'string',
                variants: [
                    hljs.APOS_STRING_MODE,
                    hljs.QUOTE_STRING_MODE,
                    {
                        begin: '`',
                        end: '`'
                    }
                ]
            }
        ]
    };
    return {
        name: 'Extended Backus-Naur Form',
        illegal: /\S/,
        contains: [
            commentMode,
            nonTerminalMode,
            ruleBodyMode
        ]
    };
}
export { ebnf as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWJuZi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2VibmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVqRCxNQUFNLGVBQWUsR0FBRztRQUN0QixTQUFTLEVBQUUsV0FBVztRQUN0QixLQUFLLEVBQUUsbUNBQW1DO0tBQzNDLENBQUM7SUFFRixNQUFNLG1CQUFtQixHQUFHO1FBQzFCLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRztRQUNuQixLQUFLLEVBQUUsR0FBRztRQUNWLEdBQUcsRUFBRSxNQUFNO1FBQ1gsUUFBUSxFQUFFO1lBQ1IsV0FBVztZQUNYLG1CQUFtQjtZQUNuQjtnQkFFRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsUUFBUSxFQUFFO29CQUNSLElBQUksQ0FBQyxnQkFBZ0I7b0JBQ3JCLElBQUksQ0FBQyxpQkFBaUI7b0JBQ3RCO3dCQUNFLEtBQUssRUFBRSxHQUFHO3dCQUNWLEdBQUcsRUFBRSxHQUFHO3FCQUNUO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLDJCQUEyQjtRQUNqQyxPQUFPLEVBQUUsSUFBSTtRQUNiLFFBQVEsRUFBRTtZQUNSLFdBQVc7WUFDWCxlQUFlO1lBQ2YsWUFBWTtTQUNiO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBFeHRlbmRlZCBCYWNrdXMtTmF1ciBGb3JtXG5BdXRob3I6IEFsZXggTWNLaWJiZW4gPGFsZXhAbnVsbHNjb3BlLm5ldD5cbldlYnNpdGU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0V4dGVuZGVkX0JhY2t1c+KAk05hdXJfZm9ybVxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGVibmYoaGxqcykge1xuICBjb25zdCBjb21tZW50TW9kZSA9IGhsanMuQ09NTUVOVCgvXFwoXFwqLywgL1xcKlxcKS8pO1xuXG4gIGNvbnN0IG5vblRlcm1pbmFsTW9kZSA9IHtcbiAgICBjbGFzc05hbWU6IFwiYXR0cmlidXRlXCIsXG4gICAgYmVnaW46IC9eWyBdKlthLXpBLVpdKyhbXFxzXy1dK1thLXpBLVpdKykqL1xuICB9O1xuXG4gIGNvbnN0IHNwZWNpYWxTZXF1ZW5jZU1vZGUgPSB7XG4gICAgY2xhc3NOYW1lOiBcIm1ldGFcIixcbiAgICBiZWdpbjogL1xcPy4qXFw/L1xuICB9O1xuXG4gIGNvbnN0IHJ1bGVCb2R5TW9kZSA9IHtcbiAgICBiZWdpbjogLz0vLFxuICAgIGVuZDogL1suO10vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBjb21tZW50TW9kZSxcbiAgICAgIHNwZWNpYWxTZXF1ZW5jZU1vZGUsXG4gICAgICB7XG4gICAgICAgIC8vIHRlcm1pbmFsc1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnYCcsXG4gICAgICAgICAgICBlbmQ6ICdgJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdFeHRlbmRlZCBCYWNrdXMtTmF1ciBGb3JtJyxcbiAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICBjb250YWluczogW1xuICAgICAgY29tbWVudE1vZGUsXG4gICAgICBub25UZXJtaW5hbE1vZGUsXG4gICAgICBydWxlQm9keU1vZGVcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGVibmYgYXMgZGVmYXVsdCB9O1xuIl19