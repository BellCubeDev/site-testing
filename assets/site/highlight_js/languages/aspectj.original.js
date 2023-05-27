function aspectj(hljs) {
    const regex = hljs.regex;
    const KEYWORDS = [
        "false",
        "synchronized",
        "int",
        "abstract",
        "float",
        "private",
        "char",
        "boolean",
        "static",
        "null",
        "if",
        "const",
        "for",
        "true",
        "while",
        "long",
        "throw",
        "strictfp",
        "finally",
        "protected",
        "import",
        "native",
        "final",
        "return",
        "void",
        "enum",
        "else",
        "extends",
        "implements",
        "break",
        "transient",
        "new",
        "catch",
        "instanceof",
        "byte",
        "super",
        "volatile",
        "case",
        "assert",
        "short",
        "package",
        "default",
        "double",
        "public",
        "try",
        "this",
        "switch",
        "continue",
        "throws",
        "privileged",
        "aspectOf",
        "adviceexecution",
        "proceed",
        "cflowbelow",
        "cflow",
        "initialization",
        "preinitialization",
        "staticinitialization",
        "withincode",
        "target",
        "within",
        "execution",
        "getWithinTypeName",
        "handler",
        "thisJoinPoint",
        "thisJoinPointStaticPart",
        "thisEnclosingJoinPointStaticPart",
        "declare",
        "parents",
        "warning",
        "error",
        "soft",
        "precedence",
        "thisAspectInstance"
    ];
    const SHORTKEYS = [
        "get",
        "set",
        "args",
        "call"
    ];
    return {
        name: 'AspectJ',
        keywords: KEYWORDS,
        illegal: /<\/|#/,
        contains: [
            hljs.COMMENT(/\/\*\*/, /\*\//, {
                relevance: 0,
                contains: [
                    {
                        begin: /\w+@/,
                        relevance: 0
                    },
                    {
                        className: 'doctag',
                        begin: /@[A-Za-z]+/
                    }
                ]
            }),
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            {
                className: 'class',
                beginKeywords: 'aspect',
                end: /[{;=]/,
                excludeEnd: true,
                illegal: /[:;"\[\]]/,
                contains: [
                    { beginKeywords: 'extends implements pertypewithin perthis pertarget percflowbelow percflow issingleton' },
                    hljs.UNDERSCORE_TITLE_MODE,
                    {
                        begin: /\([^\)]*/,
                        end: /[)]+/,
                        keywords: KEYWORDS.concat(SHORTKEYS),
                        excludeEnd: false
                    }
                ]
            },
            {
                className: 'class',
                beginKeywords: 'class interface',
                end: /[{;=]/,
                excludeEnd: true,
                relevance: 0,
                keywords: 'class interface',
                illegal: /[:"\[\]]/,
                contains: [
                    { beginKeywords: 'extends implements' },
                    hljs.UNDERSCORE_TITLE_MODE
                ]
            },
            {
                beginKeywords: 'pointcut after before around throwing returning',
                end: /[)]/,
                excludeEnd: false,
                illegal: /["\[\]]/,
                contains: [
                    {
                        begin: regex.concat(hljs.UNDERSCORE_IDENT_RE, /\s*\(/),
                        returnBegin: true,
                        contains: [hljs.UNDERSCORE_TITLE_MODE]
                    }
                ]
            },
            {
                begin: /[:]/,
                returnBegin: true,
                end: /[{;]/,
                relevance: 0,
                excludeEnd: false,
                keywords: KEYWORDS,
                illegal: /["\[\]]/,
                contains: [
                    {
                        begin: regex.concat(hljs.UNDERSCORE_IDENT_RE, /\s*\(/),
                        keywords: KEYWORDS.concat(SHORTKEYS),
                        relevance: 0
                    },
                    hljs.QUOTE_STRING_MODE
                ]
            },
            {
                beginKeywords: 'new throw',
                relevance: 0
            },
            {
                className: 'function',
                begin: /\w+ +\w+(\.\w+)?\s*\([^\)]*\)\s*((throws)[\w\s,]+)?[\{;]/,
                returnBegin: true,
                end: /[{;=]/,
                keywords: KEYWORDS,
                excludeEnd: true,
                contains: [
                    {
                        begin: regex.concat(hljs.UNDERSCORE_IDENT_RE, /\s*\(/),
                        returnBegin: true,
                        relevance: 0,
                        contains: [hljs.UNDERSCORE_TITLE_MODE]
                    },
                    {
                        className: 'params',
                        begin: /\(/,
                        end: /\)/,
                        relevance: 0,
                        keywords: KEYWORDS,
                        contains: [
                            hljs.APOS_STRING_MODE,
                            hljs.QUOTE_STRING_MODE,
                            hljs.C_NUMBER_MODE,
                            hljs.C_BLOCK_COMMENT_MODE
                        ]
                    },
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: /@[A-Za-z]+/
            }
        ]
    };
}
export { aspectj as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNwZWN0ai5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2FzcGVjdGouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsT0FBTztRQUNQLGNBQWM7UUFDZCxLQUFLO1FBQ0wsVUFBVTtRQUNWLE9BQU87UUFDUCxTQUFTO1FBQ1QsTUFBTTtRQUNOLFNBQVM7UUFDVCxRQUFRO1FBQ1IsTUFBTTtRQUNOLElBQUk7UUFDSixPQUFPO1FBQ1AsS0FBSztRQUNMLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxVQUFVO1FBQ1YsU0FBUztRQUNULFdBQVc7UUFDWCxRQUFRO1FBQ1IsUUFBUTtRQUNSLE9BQU87UUFDUCxRQUFRO1FBQ1IsTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sU0FBUztRQUNULFlBQVk7UUFDWixPQUFPO1FBQ1AsV0FBVztRQUNYLEtBQUs7UUFDTCxPQUFPO1FBQ1AsWUFBWTtRQUNaLE1BQU07UUFDTixPQUFPO1FBQ1AsVUFBVTtRQUNWLE1BQU07UUFDTixRQUFRO1FBQ1IsT0FBTztRQUNQLFNBQVM7UUFDVCxTQUFTO1FBQ1QsUUFBUTtRQUNSLFFBQVE7UUFDUixLQUFLO1FBQ0wsTUFBTTtRQUNOLFFBQVE7UUFDUixVQUFVO1FBQ1YsUUFBUTtRQUNSLFlBQVk7UUFDWixVQUFVO1FBQ1YsaUJBQWlCO1FBQ2pCLFNBQVM7UUFDVCxZQUFZO1FBQ1osT0FBTztRQUNQLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLFlBQVk7UUFDWixRQUFR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QjtpQkFDdkI7YUFDRjtZQUNEO2dCQUVFLGFBQWEsRUFBRSxXQUFXO2dCQUMxQixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBRUUsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLEtBQUssRUFBRSwwREFBMEQ7Z0JBQ2pFLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixHQUFHLEVBQUUsT0FBTztnQkFDWixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO3dCQUN0RCxXQUFXLEVBQUUsSUFBSTt3QkFDakIsU0FBUyxFQUFFLENBQUM7d0JBQ1osUUFBUSxFQUFFLENBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFFO3FCQUN6QztvQkFDRDt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLElBQUk7d0JBQ1gsR0FBRyxFQUFFLElBQUk7d0JBQ1QsU0FBUyxFQUFFLENBQUM7d0JBQ1osUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFFBQVEsRUFBRTs0QkFDUixJQUFJLENBQUMsZ0JBQWdCOzRCQUNyQixJQUFJLENBQUMsaUJBQWlCOzRCQUN0QixJQUFJLENBQUMsYUFBYTs0QkFDbEIsSUFBSSxDQUFDLG9CQUFvQjt5QkFDMUI7cUJBQ0Y7b0JBQ0QsSUFBSSxDQUFDLG1CQUFtQjtvQkFDeEIsSUFBSSxDQUFDLG9CQUFvQjtpQkFDMUI7YUFDRjtZQUNELElBQUksQ0FBQyxhQUFhO1lBQ2xCO2dCQUVFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsWUFBWTthQUNwQjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBBc3BlY3RKXG5BdXRob3I6IEhha2FuIE96bGVyIDxvemxlci5oYWthbkBnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwczovL3d3dy5lY2xpcHNlLm9yZy9hc3BlY3RqL1xuRGVzY3JpcHRpb246IFN5bnRheCBIaWdobGlnaHRpbmcgZm9yIHRoZSBBc3BlY3RKIExhbmd1YWdlIHdoaWNoIGlzIGEgZ2VuZXJhbC1wdXJwb3NlIGFzcGVjdC1vcmllbnRlZCBleHRlbnNpb24gdG8gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UuXG5BdWRpdDogMjAyMFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGFzcGVjdGooaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwiZmFsc2VcIixcbiAgICBcInN5bmNocm9uaXplZFwiLFxuICAgIFwiaW50XCIsXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiZmxvYXRcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcImNoYXJcIixcbiAgICBcImJvb2xlYW5cIixcbiAgICBcInN0YXRpY1wiLFxuICAgIFwibnVsbFwiLFxuICAgIFwiaWZcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJmb3JcIixcbiAgICBcInRydWVcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJsb25nXCIsXG4gICAgXCJ0aHJvd1wiLFxuICAgIFwic3RyaWN0ZnBcIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJuYXRpdmVcIixcbiAgICBcImZpbmFsXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInZvaWRcIixcbiAgICBcImVudW1cIixcbiAgICBcImVsc2VcIixcbiAgICBcImV4dGVuZHNcIixcbiAgICBcImltcGxlbWVudHNcIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJ0cmFuc2llbnRcIixcbiAgICBcIm5ld1wiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImluc3RhbmNlb2ZcIixcbiAgICBcImJ5dGVcIixcbiAgICBcInN1cGVyXCIsXG4gICAgXCJ2b2xhdGlsZVwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiYXNzZXJ0XCIsXG4gICAgXCJzaG9ydFwiLFxuICAgIFwicGFja2FnZVwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZG91YmxlXCIsXG4gICAgXCJwdWJsaWNcIixcbiAgICBcInRyeVwiLFxuICAgIFwidGhpc1wiLFxuICAgIFwic3dpdGNoXCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwidGhyb3dzXCIsXG4gICAgXCJwcml2aWxlZ2VkXCIsXG4gICAgXCJhc3BlY3RPZlwiLFxuICAgIFwiYWR2aWNlZXhlY3V0aW9uXCIsXG4gICAgXCJwcm9jZWVkXCIsXG4gICAgXCJjZmxvd2JlbG93XCIsXG4gICAgXCJjZmxvd1wiLFxuICAgIFwiaW5pdGlhbGl6YXRpb25cIixcbiAgICBcInByZWluaXRpYWxpemF0aW9uXCIsXG4gICAgXCJzdGF0aWNpbml0aWFsaXphdGlvblwiLFxuICAgIFwid2l0aGluY29kZVwiLFxuICAgIFwidGFyZ2V0XCIsXG4gICAgXCJ3aXRoaW5cIixcbiAgICBcImV4ZWN1dGlvblwiLFxuICAgIFwiZ2V0V2l0aGluVHlwZU5hbWVcIixcbiAgICBcImhhbmRsZXJcIixcbiAgICBcInRoaXNKb2luUG9pbnRcIixcbiAgICBcInRoaXNKb2luUG9pbnRTdGF0aWNQYXJ0XCIsXG4gICAgXCJ0aGlzRW5jbG9zaW5nSm9pblBvaW50U3RhdGljUGFydFwiLFxuICAgIFwiZGVjbGFyZVwiLFxuICAgIFwicGFyZW50c1wiLFxuICAgIFwid2FybmluZ1wiLFxuICAgIFwiZXJyb3JcIixcbiAgICBcInNvZnRcIixcbiAgICBcInByZWNlZGVuY2VcIixcbiAgICBcInRoaXNBc3BlY3RJbnN0YW5jZVwiXG4gIF07XG4gIGNvbnN0IFNIT1JUS0VZUyA9IFtcbiAgICBcImdldFwiLFxuICAgIFwic2V0XCIsXG4gICAgXCJhcmdzXCIsXG4gICAgXCJjYWxsXCJcbiAgXTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdBc3BlY3RKJyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogLzxcXC98Iy8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgL1xcL1xcKlxcKi8sXG4gICAgICAgIC9cXCpcXC8vLFxuICAgICAgICB7XG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIGVhdCB1cCBAJ3MgaW4gZW1haWxzIHRvIHByZXZlbnQgdGhlbSB0byBiZSByZWNvZ25pemVkIGFzIGRvY3RhZ3NcbiAgICAgICAgICAgICAgYmVnaW46IC9cXHcrQC8sXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZG9jdGFnJyxcbiAgICAgICAgICAgICAgYmVnaW46IC9AW0EtWmEtel0rL1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdhc3BlY3QnLFxuICAgICAgICBlbmQ6IC9bezs9XS8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6IC9bOjtcIlxcW1xcXV0vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHsgYmVnaW5LZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cyBwZXJ0eXBld2l0aGluIHBlcnRoaXMgcGVydGFyZ2V0IHBlcmNmbG93YmVsb3cgcGVyY2Zsb3cgaXNzaW5nbGV0b24nIH0sXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IC9cXChbXlxcKV0qLyxcbiAgICAgICAgICAgIGVuZDogL1spXSsvLFxuICAgICAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLmNvbmNhdChTSE9SVEtFWVMpLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGVuZDogL1t7Oz1dLyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGlsbGVnYWw6IC9bOlwiXFxbXFxdXS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgeyBiZWdpbktleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyB9LFxuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIEFzcGVjdEogQ29uc3RydWN0c1xuICAgICAgICBiZWdpbktleXdvcmRzOiAncG9pbnRjdXQgYWZ0ZXIgYmVmb3JlIGFyb3VuZCB0aHJvd2luZyByZXR1cm5pbmcnLFxuICAgICAgICBlbmQ6IC9bKV0vLFxuICAgICAgICBleGNsdWRlRW5kOiBmYWxzZSxcbiAgICAgICAgaWxsZWdhbDogL1tcIlxcW1xcXV0vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiByZWdleC5jb25jYXQoaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLCAvXFxzKlxcKC8pLFxuICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogWyBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERSBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1s6XS8sXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBlbmQ6IC9beztdLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBleGNsdWRlRW5kOiBmYWxzZSxcbiAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgICAgICBpbGxlZ2FsOiAvW1wiXFxbXFxdXS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdChobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsIC9cXHMqXFwoLyksXG4gICAgICAgICAgICBrZXl3b3JkczogS0VZV09SRFMuY29uY2F0KFNIT1JUS0VZUyksXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gdGhpcyBwcmV2ZW50cyAnbmV3IE5hbWUoLi4uKSwgb3IgdGhyb3cgLi4uJyBmcm9tIGJlaW5nIHJlY29nbml6ZWQgYXMgYSBmdW5jdGlvbiBkZWZpbml0aW9uXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICduZXcgdGhyb3cnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIHRoZSBmdW5jdGlvbiBjbGFzcyBpcyBhIGJpdCBkaWZmZXJlbnQgZm9yIEFzcGVjdEogY29tcGFyZWQgdG8gdGhlIEphdmEgbGFuZ3VhZ2VcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogL1xcdysgK1xcdysoXFwuXFx3Kyk/XFxzKlxcKFteXFwpXSpcXClcXHMqKCh0aHJvd3MpW1xcd1xccyxdKyk/W1xceztdLyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGVuZDogL1t7Oz1dLyxcbiAgICAgICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiByZWdleC5jb25jYXQoaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLCAvXFxzKlxcKC8pLFxuICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBjb250YWluczogWyBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERSBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICAvLyBhbm5vdGF0aW9uIGlzIGFsc28gdXNlZCBpbiB0aGlzIGxhbmd1YWdlXG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogL0BbQS1aYS16XSsvXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBhc3BlY3RqIGFzIGRlZmF1bHQgfTtcbiJdfQ==