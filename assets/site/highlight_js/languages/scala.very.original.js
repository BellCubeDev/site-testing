function scala(hljs) {
    const regex = hljs.regex;
    const ANNOTATION = {
        className: 'meta',
        begin: '@[A-Za-z]+'
    };
    const SUBST = {
        className: 'subst',
        variants: [
            { begin: '\\$[A-Za-z0-9_]+' },
            {
                begin: /\$\{/,
                end: /\}/
            }
        ]
    };
    const STRING = {
        className: 'string',
        variants: [
            {
                begin: '"""',
                end: '"""'
            },
            {
                begin: '"',
                end: '"',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                begin: '[a-z]+"',
                end: '"',
                illegal: '\\n',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    SUBST
                ]
            },
            {
                className: 'string',
                begin: '[a-z]+"""',
                end: '"""',
                contains: [SUBST],
                relevance: 10
            }
        ]
    };
    const TYPE = {
        className: 'type',
        begin: '\\b[A-Z][A-Za-z0-9_]*',
        relevance: 0
    };
    const NAME = {
        className: 'title',
        begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,
        relevance: 0
    };
    const CLASS = {
        className: 'class',
        beginKeywords: 'class object trait type',
        end: /[:={\[\n;]/,
        excludeEnd: true,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                beginKeywords: 'extends with',
                relevance: 10
            },
            {
                begin: /\[/,
                end: /\]/,
                excludeBegin: true,
                excludeEnd: true,
                relevance: 0,
                contains: [TYPE]
            },
            {
                className: 'params',
                begin: /\(/,
                end: /\)/,
                excludeBegin: true,
                excludeEnd: true,
                relevance: 0,
                contains: [TYPE]
            },
            NAME
        ]
    };
    const METHOD = {
        className: 'function',
        beginKeywords: 'def',
        end: regex.lookahead(/[:={\[(\n;]/),
        contains: [NAME]
    };
    const EXTENSION = {
        begin: [
            /^\s*/,
            'extension',
            /\s+(?=[[(])/,
        ],
        beginScope: { 2: "keyword", }
    };
    const END = {
        begin: [
            /^\s*/,
            /end/,
            /\s+/,
            /(extension\b)?/,
        ],
        beginScope: {
            2: "keyword",
            4: "keyword",
        }
    };
    const INLINE_MODES = [
        { match: /\.inline\b/ },
        {
            begin: /\binline(?=\s)/,
            keywords: 'inline'
        }
    ];
    const USING_PARAM_CLAUSE = {
        begin: [
            /\(\s*/,
            /using/,
            /\s+(?!\))/,
        ],
        beginScope: { 2: "keyword", }
    };
    return {
        name: 'Scala',
        keywords: {
            literal: 'true false null',
            keyword: 'type yield lazy override def with val var sealed abstract private trait object if then forSome for while do throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit export enum given transparent'
        },
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            STRING,
            TYPE,
            METHOD,
            CLASS,
            hljs.C_NUMBER_MODE,
            EXTENSION,
            END,
            ...INLINE_MODES,
            USING_PARAM_CLAUSE,
            ANNOTATION
        ]
    };
}
export { scala as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGEuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9zY2FsYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsTUFBTSxVQUFVLEdBQUc7UUFDakIsU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLFlBQVk7S0FDcEIsQ0FBQztJQUdGLE1BQU0sS0FBSyxHQUFHO1FBQ1osU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDN0I7Z0JBQ0UsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsR0FBRyxFQUFFLElBQUk7YUFDVjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7YUFDWDtZQUNEO2dCQUNFLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxDQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRTthQUNwQztZQUNEO2dCQUNFLEtBQUssRUFBRSxTQUFTO2dCQUNoQixHQUFHLEVBQUUsR0FBRztnQkFDUixPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckIsS0FBSztpQkFDTjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxXQUFXO2dC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O0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxLQUFLLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFNjYWxhXG5DYXRlZ29yeTogZnVuY3Rpb25hbFxuQXV0aG9yOiBKYW4gQmVya2VsIDxqYW4uYmVya2VsQGdtYWlsLmNvbT5cbkNvbnRyaWJ1dG9yczogRXJpayBPc2hlaW0gPGRfbUBwbGFzdGljLWlkb2xhdHJ5LmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vd3d3LnNjYWxhLWxhbmcub3JnXG4qL1xuXG5mdW5jdGlvbiBzY2FsYShobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgQU5OT1RBVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gIH07XG5cbiAgLy8gdXNlZCBpbiBzdHJpbmdzIGZvciBlc2NhcGluZy9pbnRlcnBvbGF0aW9uL3N1YnN0aXR1dGlvblxuICBjb25zdCBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46ICdcXFxcJFtBLVphLXowLTlfXSsnIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFwkXFx7LyxcbiAgICAgICAgZW5kOiAvXFx9L1xuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ1wiXCJcIicsXG4gICAgICAgIGVuZDogJ1wiXCJcIidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1thLXpdK1wiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICBTVUJTVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1thLXpdK1wiXCJcIicsXG4gICAgICAgIGVuZDogJ1wiXCJcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbIFNVQlNUIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH1cbiAgICBdXG5cbiAgfTtcblxuICBjb25zdCBUWVBFID0ge1xuICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgIGJlZ2luOiAnXFxcXGJbQS1aXVtBLVphLXowLTlfXSonLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IE5BTUUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgIGJlZ2luOiAvW14wLTlcXG5cXHQgXCInKCksLmB7fVxcW1xcXTo7XVteXFxuXFx0IFwiJygpLC5ge31cXFtcXF06O10rfFteMC05XFxuXFx0IFwiJygpLC5ge31cXFtcXF06Oz1dLyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBDTEFTUyA9IHtcbiAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzIG9iamVjdCB0cmFpdCB0eXBlJyxcbiAgICBlbmQ6IC9bOj17XFxbXFxuO10vLFxuICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdleHRlbmRzIHdpdGgnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcWy8sXG4gICAgICAgIGVuZDogL1xcXS8sXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogWyBUWVBFIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbIFRZUEUgXVxuICAgICAgfSxcbiAgICAgIE5BTUVcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgTUVUSE9EID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbktleXdvcmRzOiAnZGVmJyxcbiAgICBlbmQ6IHJlZ2V4Lmxvb2thaGVhZCgvWzo9e1xcWyhcXG47XS8pLFxuICAgIGNvbnRhaW5zOiBbIE5BTUUgXVxuICB9O1xuXG4gIGNvbnN0IEVYVEVOU0lPTiA9IHtcbiAgICBiZWdpbjogW1xuICAgICAgL15cXHMqLywgLy8gSXMgZmlyc3QgdG9rZW4gb24gdGhlIGxpbmVcbiAgICAgICdleHRlbnNpb24nLFxuICAgICAgL1xccysoPz1bWyhdKS8sIC8vIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBhbmQgYFtgIG9yIGAoYFxuICAgIF0sXG4gICAgYmVnaW5TY29wZTogeyAyOiBcImtleXdvcmRcIiwgfVxuICB9O1xuXG4gIGNvbnN0IEVORCA9IHtcbiAgICBiZWdpbjogW1xuICAgICAgL15cXHMqLywgLy8gSXMgZmlyc3QgdG9rZW4gb24gdGhlIGxpbmVcbiAgICAgIC9lbmQvLFxuICAgICAgL1xccysvLFxuICAgICAgLyhleHRlbnNpb25cXGIpPy8sIC8vIGBleHRlbnNpb25gIGlzIHRoZSBvbmx5IG1hcmtlciB0aGF0IGZvbGxvd3MgYW4gYGVuZGAgdGhhdCBjYW5ub3QgYmUgY2FwdHVyZWQgYnkgYW5vdGhlciBydWxlLlxuICAgIF0sXG4gICAgYmVnaW5TY29wZToge1xuICAgICAgMjogXCJrZXl3b3JkXCIsXG4gICAgICA0OiBcImtleXdvcmRcIixcbiAgICB9XG4gIH07XG5cbiAgLy8gVE9ETzogdXNlIG5lZ2F0aXZlIGxvb2stYmVoaW5kIGluIGZ1dHVyZVxuICAvLyAgICAgICAvKD88IVxcLilcXGJpbmxpbmUoPz1cXHMpL1xuICBjb25zdCBJTkxJTkVfTU9ERVMgPSBbXG4gICAgeyBtYXRjaDogL1xcLmlubGluZVxcYi8gfSxcbiAgICB7XG4gICAgICBiZWdpbjogL1xcYmlubGluZSg/PVxccykvLFxuICAgICAga2V5d29yZHM6ICdpbmxpbmUnXG4gICAgfVxuICBdO1xuXG4gIGNvbnN0IFVTSU5HX1BBUkFNX0NMQVVTRSA9IHtcbiAgICBiZWdpbjogW1xuICAgICAgL1xcKFxccyovLCAvLyBPcGVuaW5nIGAoYCBvZiBhIHBhcmFtZXRlciBvciBhcmd1bWVudCBsaXN0XG4gICAgICAvdXNpbmcvLFxuICAgICAgL1xccysoPyFcXCkpLywgLy8gU3BhY2VzIG5vdCBmb2xsb3dlZCBieSBgKWBcbiAgICBdLFxuICAgIGJlZ2luU2NvcGU6IHsgMjogXCJrZXl3b3JkXCIsIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdTY2FsYScsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGxpdGVyYWw6ICd0cnVlIGZhbHNlIG51bGwnLFxuICAgICAga2V5d29yZDogJ3R5cGUgeWllbGQgbGF6eSBvdmVycmlkZSBkZWYgd2l0aCB2YWwgdmFyIHNlYWxlZCBhYnN0cmFjdCBwcml2YXRlIHRyYWl0IG9iamVjdCBpZiB0aGVuIGZvclNvbWUgZm9yIHdoaWxlIGRvIHRocm93IGZpbmFsbHkgcHJvdGVjdGVkIGV4dGVuZHMgaW1wb3J0IGZpbmFsIHJldHVybiBlbHNlIGJyZWFrIG5ldyBjYXRjaCBzdXBlciBjbGFzcyBjYXNlIHBhY2thZ2UgZGVmYXVsdCB0cnkgdGhpcyBtYXRjaCBjb250aW51ZSB0aHJvd3MgaW1wbGljaXQgZXhwb3J0IGVudW0gZ2l2ZW4gdHJhbnNwYXJlbnQnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIFNUUklORyxcbiAgICAgIFRZUEUsXG4gICAgICBNRVRIT0QsXG4gICAgICBDTEFTUyxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIEVYVEVOU0lPTixcbiAgICAgIEVORCxcbiAgICAgIC4uLklOTElORV9NT0RFUyxcbiAgICAgIFVTSU5HX1BBUkFNX0NMQVVTRSxcbiAgICAgIEFOTk9UQVRJT05cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHNjYWxhIGFzIGRlZmF1bHQgfTtcbiJdfQ==