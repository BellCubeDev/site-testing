var decimalDigits = '[0-9](_*[0-9])*';
var frac = `\\.(${decimalDigits})`;
var hexDigits = '[0-9a-fA-F](_*[0-9a-fA-F])*';
var NUMERIC = {
    className: 'number',
    variants: [
        { begin: `(\\b(${decimalDigits})((${frac})|\\.)?|(${frac}))` +
                `[eE][+-]?(${decimalDigits})[fFdD]?\\b` },
        { begin: `\\b(${decimalDigits})((${frac})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
        { begin: `(${frac})[fFdD]?\\b` },
        { begin: `\\b(${decimalDigits})[fFdD]\\b` },
        { begin: `\\b0[xX]((${hexDigits})\\.?|(${hexDigits})?\\.(${hexDigits}))` +
                `[pP][+-]?(${decimalDigits})[fFdD]?\\b` },
        { begin: '\\b(0|[1-9](_*[0-9])*)[lL]?\\b' },
        { begin: `\\b0[xX](${hexDigits})[lL]?\\b` },
        { begin: '\\b0(_*[0-7])*[lL]?\\b' },
        { begin: '\\b0[bB][01](_*[01])*[lL]?\\b' },
    ],
    relevance: 0
};
function recurRegex(re, substitution, depth) {
    if (depth === -1)
        return "";
    return re.replace(substitution, _ => {
        return recurRegex(re, substitution, depth - 1);
    });
}
function java(hljs) {
    const regex = hljs.regex;
    const JAVA_IDENT_RE = '[\u00C0-\u02B8a-zA-Z_$][\u00C0-\u02B8a-zA-Z_$0-9]*';
    const GENERIC_IDENT_RE = JAVA_IDENT_RE
        + recurRegex('(?:<' + JAVA_IDENT_RE + '~~~(?:\\s*,\\s*' + JAVA_IDENT_RE + '~~~)*>)?', /~~~/g, 2);
    const MAIN_KEYWORDS = [
        'synchronized',
        'abstract',
        'private',
        'var',
        'static',
        'if',
        'const ',
        'for',
        'while',
        'strictfp',
        'finally',
        'protected',
        'import',
        'native',
        'final',
        'void',
        'enum',
        'else',
        'break',
        'transient',
        'catch',
        'instanceof',
        'volatile',
        'case',
        'assert',
        'package',
        'default',
        'public',
        'try',
        'switch',
        'continue',
        'throws',
        'protected',
        'public',
        'private',
        'module',
        'requires',
        'exports',
        'do',
        'sealed',
        'yield',
        'permits'
    ];
    const BUILT_INS = [
        'super',
        'this'
    ];
    const LITERALS = [
        'false',
        'true',
        'null'
    ];
    const TYPES = [
        'char',
        'boolean',
        'long',
        'float',
        'int',
        'byte',
        'short',
        'double'
    ];
    const KEYWORDS = {
        keyword: MAIN_KEYWORDS,
        literal: LITERALS,
        type: TYPES,
        built_in: BUILT_INS
    };
    const ANNOTATION = {
        className: 'meta',
        begin: '@' + JAVA_IDENT_RE,
        contains: [
            {
                begin: /\(/,
                end: /\)/,
                contains: ["self"]
            }
        ]
    };
    const PARAMS = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        keywords: KEYWORDS,
        relevance: 0,
        contains: [hljs.C_BLOCK_COMMENT_MODE],
        endsParent: true
    };
    return {
        name: 'Java',
        aliases: ['jsp'],
        keywords: KEYWORDS,
        illegal: /<\/|#/,
        contains: [
            hljs.COMMENT('/\\*\\*', '\\*/', {
                relevance: 0,
                contains: [
                    {
                        begin: /\w+@/,
                        relevance: 0
                    },
                    {
                        className: 'doctag',
                        begin: '@[A-Za-z]+'
                    }
                ]
            }),
            {
                begin: /import java\.[a-z]+\./,
                keywords: "import",
                relevance: 2
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                begin: /"""/,
                end: /"""/,
                className: "string",
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            {
                match: [
                    /\b(?:class|interface|enum|extends|implements|new)/,
                    /\s+/,
                    JAVA_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.class"
                }
            },
            {
                match: /non-sealed/,
                scope: "keyword"
            },
            {
                begin: [
                    regex.concat(/(?!else)/, JAVA_IDENT_RE),
                    /\s+/,
                    JAVA_IDENT_RE,
                    /\s+/,
                    /=(?!=)/
                ],
                className: {
                    1: "type",
                    3: "variable",
                    5: "operator"
                }
            },
            {
                begin: [
                    /record/,
                    /\s+/,
                    JAVA_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.class"
                },
                contains: [
                    PARAMS,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            {
                beginKeywords: 'new throw return else',
                relevance: 0
            },
            {
                begin: [
                    '(?:' + GENERIC_IDENT_RE + '\\s+)',
                    hljs.UNDERSCORE_IDENT_RE,
                    /\s*(?=\()/
                ],
                className: { 2: "title.function" },
                keywords: KEYWORDS,
                contains: [
                    {
                        className: 'params',
                        begin: /\(/,
                        end: /\)/,
                        keywords: KEYWORDS,
                        relevance: 0,
                        contains: [
                            ANNOTATION,
                            hljs.APOS_STRING_MODE,
                            hljs.QUOTE_STRING_MODE,
                            NUMERIC,
                            hljs.C_BLOCK_COMMENT_MODE
                        ]
                    },
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            NUMERIC,
            ANNOTATION
        ]
    };
}
export { java as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2phdmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBSSxhQUFhLEdBQUcsaUJBQWlCLENBQUM7QUFDdEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxhQUFhLEdBQUcsQ0FBQztBQUNuQyxJQUFJLFNBQVMsR0FBRyw2QkFBNkIsQ0FBQztBQUM5QyxJQUFJLE9BQU8sR0FBRztJQUNaLFNBQVMsRUFBRSxRQUFRO0lBQ25CLFFBQVEsRUFBRTtRQUdSLEVBQUUsS0FBSyxFQUFFLFFBQVEsYUFBYSxNQUFNLElBQUksWUFBWSxJQUFJLElBQUk7Z0JBQzFELGFBQWEsYUFBYSxhQUFhLEVBQUU7UUFFM0MsRUFBRSxLQUFLLEVBQUUsT0FBTyxhQUFhLE1BQU0sSUFBSSw4QkFBOEIsRUFBRTtRQUN2RSxFQUFFLEtBQUssRUFBRSxJQUFJLElBQUksYUFBYSxFQUFFO1FBQ2hDLEVBQUUsS0FBSyxFQUFFLE9BQU8sYUFBYSxZQUFZLEVBQUU7UUFHM0MsRUFBRSxLQUFLLEVBQUUsYUFBYSxTQUFTLFVBQVUsU0FBUyxTQUFTLFNBQVMsSUFBSTtnQkFDdEUsYUFBYSxhQUFhLGFBQWEsRUFBRTtRQUczQyxFQUFFLEtBQUssRUFBRSxnQ0FBZ0MsRUFBRTtRQUczQyxFQUFFLEtBQUssRUFBRSxZQUFZLFNBQVMsV0FBVyxFQUFFO1FBRzNDLEVBQUUsS0FBSyxFQUFFLHdCQUF3QixFQUFFO1FBR25DLEVBQUUsS0FBSyxFQUFFLCtCQUErQixFQUFFO0tBQzNDO0lBQ0QsU0FBUyxFQUFFLENBQUM7Q0FDYixDQUFDO0FBb0JGLFNBQVMsVUFBVSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsS0FBSztJQUN6QyxJQUFJLEtBQUssS0FB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aUJBQ2pCO2dCQUNELFFBQVEsRUFBRTtvQkFDUixNQUFNO29CQUNOLElBQUksQ0FBQyxtQkFBbUI7b0JBQ3hCLElBQUksQ0FBQyxvQkFBb0I7aUJBQzFCO2FBQ0Y7WUFDRDtnQkFHRSxhQUFhLEVBQUUsdUJBQXVCO2dCQUN0QyxTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFO29CQUNMLEtBQUssR0FBRyxnQkFBZ0IsR0FBRyxPQUFPO29CQUNsQyxJQUFJLENBQUMsbUJBQW1CO29CQUN4QixXQUFXO2lCQUNaO2dCQUNELFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFDbEMsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLElBQUk7d0JBQ1gsR0FBRyxFQUFFLElBQUk7d0JBQ1QsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFNBQVMsRUFBRSxDQUFDO3dCQUNaLFFBQVEsRUFBRTs0QkFDUixVQUFVOzRCQUNWLElBQUksQ0FBQyxnQkFBZ0I7NEJBQ3JCLElBQUksQ0FBQyxpQkFBaUI7NEJBQ3RCLE9BQU87NEJBQ1AsSUFBSSxDQUFDLG9CQUFvQjt5QkFDMUI7cUJBQ0Y7b0JBQ0QsSUFBSSxDQUFDLG1CQUFtQjtvQkFDeEIsSUFBSSxDQUFDLG9CQUFvQjtpQkFDMUI7YUFDRjtZQUNELE9BQU87WUFDUCxVQUFVO1NBQ1g7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwczovL2RvY3Mub3JhY2xlLmNvbS9qYXZhc2Uvc3BlY3MvamxzL3NlMTUvaHRtbC9qbHMtMy5odG1sI2pscy0zLjEwXG52YXIgZGVjaW1hbERpZ2l0cyA9ICdbMC05XShfKlswLTldKSonO1xudmFyIGZyYWMgPSBgXFxcXC4oJHtkZWNpbWFsRGlnaXRzfSlgO1xudmFyIGhleERpZ2l0cyA9ICdbMC05YS1mQS1GXShfKlswLTlhLWZBLUZdKSonO1xudmFyIE5VTUVSSUMgPSB7XG4gIGNsYXNzTmFtZTogJ251bWJlcicsXG4gIHZhcmlhbnRzOiBbXG4gICAgLy8gRGVjaW1hbEZsb2F0aW5nUG9pbnRMaXRlcmFsXG4gICAgLy8gaW5jbHVkaW5nIEV4cG9uZW50UGFydFxuICAgIHsgYmVnaW46IGAoXFxcXGIoJHtkZWNpbWFsRGlnaXRzfSkoKCR7ZnJhY30pfFxcXFwuKT98KCR7ZnJhY30pKWAgK1xuICAgICAgYFtlRV1bKy1dPygke2RlY2ltYWxEaWdpdHN9KVtmRmREXT9cXFxcYmAgfSxcbiAgICAvLyBleGNsdWRpbmcgRXhwb25lbnRQYXJ0XG4gICAgeyBiZWdpbjogYFxcXFxiKCR7ZGVjaW1hbERpZ2l0c30pKCgke2ZyYWN9KVtmRmREXT9cXFxcYnxcXFxcLihbZkZkRF1cXFxcYik/KWAgfSxcbiAgICB7IGJlZ2luOiBgKCR7ZnJhY30pW2ZGZERdP1xcXFxiYCB9LFxuICAgIHsgYmVnaW46IGBcXFxcYigke2RlY2ltYWxEaWdpdHN9KVtmRmREXVxcXFxiYCB9LFxuXG4gICAgLy8gSGV4YWRlY2ltYWxGbG9hdGluZ1BvaW50TGl0ZXJhbFxuICAgIHsgYmVnaW46IGBcXFxcYjBbeFhdKCgke2hleERpZ2l0c30pXFxcXC4/fCgke2hleERpZ2l0c30pP1xcXFwuKCR7aGV4RGlnaXRzfSkpYCArXG4gICAgICBgW3BQXVsrLV0/KCR7ZGVjaW1hbERpZ2l0c30pW2ZGZERdP1xcXFxiYCB9LFxuXG4gICAgLy8gRGVjaW1hbEludGVnZXJMaXRlcmFsXG4gICAgeyBiZWdpbjogJ1xcXFxiKDB8WzEtOV0oXypbMC05XSkqKVtsTF0/XFxcXGInIH0sXG5cbiAgICAvLyBIZXhJbnRlZ2VyTGl0ZXJhbFxuICAgIHsgYmVnaW46IGBcXFxcYjBbeFhdKCR7aGV4RGlnaXRzfSlbbExdP1xcXFxiYCB9LFxuXG4gICAgLy8gT2N0YWxJbnRlZ2VyTGl0ZXJhbFxuICAgIHsgYmVnaW46ICdcXFxcYjAoXypbMC03XSkqW2xMXT9cXFxcYicgfSxcblxuICAgIC8vIEJpbmFyeUludGVnZXJMaXRlcmFsXG4gICAgeyBiZWdpbjogJ1xcXFxiMFtiQl1bMDFdKF8qWzAxXSkqW2xMXT9cXFxcYicgfSxcbiAgXSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuXG4vKlxuTGFuZ3VhZ2U6IEphdmFcbkF1dGhvcjogVnNldm9sb2QgU29sb3Z5b3YgPHZzZXZvbG9kLnNvbG92eW92QGdtYWlsLmNvbT5cbkNhdGVnb3J5OiBjb21tb24sIGVudGVycHJpc2VcbldlYnNpdGU6IGh0dHBzOi8vd3d3LmphdmEuY29tL1xuKi9cblxuLyoqXG4gKiBBbGxvd3MgcmVjdXJzaXZlIHJlZ2V4IGV4cHJlc3Npb25zIHRvIGEgZ2l2ZW4gZGVwdGhcbiAqXG4gKiBpZTogcmVjdXJSZWdleChcIihhYmN+fn4pXCIsIC9+fn4vZywgMikgYmVjb21lczpcbiAqIChhYmMoYWJjKGFiYykpKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZVxuICogQHBhcmFtIHtSZWdFeHB9IHN1YnN0aXR1dGlvbiAoc2hvdWxkIGJlIGEgZyBtb2RlIHJlZ2V4KVxuICogQHBhcmFtIHtudW1iZXJ9IGRlcHRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfWBgXG4gKi9cbmZ1bmN0aW9uIHJlY3VyUmVnZXgocmUsIHN1YnN0aXR1dGlvbiwgZGVwdGgpIHtcbiAgaWYgKGRlcHRoID09PSAtMSkgcmV0dXJuIFwiXCI7XG5cbiAgcmV0dXJuIHJlLnJlcGxhY2Uoc3Vic3RpdHV0aW9uLCBfID0+IHtcbiAgICByZXR1cm4gcmVjdXJSZWdleChyZSwgc3Vic3RpdHV0aW9uLCBkZXB0aCAtIDEpO1xuICB9KTtcbn1cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGphdmEoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IEpBVkFfSURFTlRfUkUgPSAnW1xcdTAwQzAtXFx1MDJCOGEtekEtWl8kXVtcXHUwMEMwLVxcdTAyQjhhLXpBLVpfJDAtOV0qJztcbiAgY29uc3QgR0VORVJJQ19JREVOVF9SRSA9IEpBVkFfSURFTlRfUkVcbiAgICArIHJlY3VyUmVnZXgoJyg/OjwnICsgSkFWQV9JREVOVF9SRSArICd+fn4oPzpcXFxccyosXFxcXHMqJyArIEpBVkFfSURFTlRfUkUgKyAnfn5+KSo+KT8nLCAvfn5+L2csIDIpO1xuICBjb25zdCBNQUlOX0tFWVdPUkRTID0gW1xuICAgICdzeW5jaHJvbml6ZWQnLFxuICAgICdhYnN0cmFjdCcsXG4gICAgJ3ByaXZhdGUnLFxuICAgICd2YXInLFxuICAgICdzdGF0aWMnLFxuICAgICdpZicsXG4gICAgJ2NvbnN0ICcsXG4gICAgJ2ZvcicsXG4gICAgJ3doaWxlJyxcbiAgICAnc3RyaWN0ZnAnLFxuICAgICdmaW5hbGx5JyxcbiAgICAncHJvdGVjdGVkJyxcbiAgICAnaW1wb3J0JyxcbiAgICAnbmF0aXZlJyxcbiAgICAnZmluYWwnLFxuICAgICd2b2lkJyxcbiAgICAnZW51bScsXG4gICAgJ2Vsc2UnLFxuICAgICdicmVhaycsXG4gICAgJ3RyYW5zaWVudCcsXG4gICAgJ2NhdGNoJyxcbiAgICAnaW5zdGFuY2VvZicsXG4gICAgJ3ZvbGF0aWxlJyxcbiAgICAnY2FzZScsXG4gICAgJ2Fzc2VydCcsXG4gICAgJ3BhY2thZ2UnLFxuICAgICdkZWZhdWx0JyxcbiAgICAncHVibGljJyxcbiAgICAndHJ5JyxcbiAgICAnc3dpdGNoJyxcbiAgICAnY29udGludWUnLFxuICAgICd0aHJvd3MnLFxuICAgICdwcm90ZWN0ZWQnLFxuICAgICdwdWJsaWMnLFxuICAgICdwcml2YXRlJyxcbiAgICAnbW9kdWxlJyxcbiAgICAncmVxdWlyZXMnLFxuICAgICdleHBvcnRzJyxcbiAgICAnZG8nLFxuICAgICdzZWFsZWQnLFxuICAgICd5aWVsZCcsXG4gICAgJ3Blcm1pdHMnXG4gIF07XG5cbiAgY29uc3QgQlVJTFRfSU5TID0gW1xuICAgICdzdXBlcicsXG4gICAgJ3RoaXMnXG4gIF07XG5cbiAgY29uc3QgTElURVJBTFMgPSBbXG4gICAgJ2ZhbHNlJyxcbiAgICAndHJ1ZScsXG4gICAgJ251bGwnXG4gIF07XG5cbiAgY29uc3QgVFlQRVMgPSBbXG4gICAgJ2NoYXInLFxuICAgICdib29sZWFuJyxcbiAgICAnbG9uZycsXG4gICAgJ2Zsb2F0JyxcbiAgICAnaW50JyxcbiAgICAnYnl0ZScsXG4gICAgJ3Nob3J0JyxcbiAgICAnZG91YmxlJ1xuICBdO1xuXG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6IE1BSU5fS0VZV09SRFMsXG4gICAgbGl0ZXJhbDogTElURVJBTFMsXG4gICAgdHlwZTogVFlQRVMsXG4gICAgYnVpbHRfaW46IEJVSUxUX0lOU1xuICB9O1xuXG4gIGNvbnN0IEFOTk9UQVRJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgYmVnaW46ICdAJyArIEpBVkFfSURFTlRfUkUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICBjb250YWluczogWyBcInNlbGZcIiBdIC8vIGFsbG93IG5lc3RlZCAoKSBpbnNpZGUgb3VyIGFubm90YXRpb25cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAvXFwoLyxcbiAgICBlbmQ6IC9cXCkvLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFsgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSBdLFxuICAgIGVuZHNQYXJlbnQ6IHRydWVcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdKYXZhJyxcbiAgICBhbGlhc2VzOiBbICdqc3AnIF0sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGlsbGVnYWw6IC88XFwvfCMvLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNPTU1FTlQoXG4gICAgICAgICcvXFxcXCpcXFxcKicsXG4gICAgICAgICdcXFxcKi8nLFxuICAgICAgICB7XG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIGVhdCB1cCBAJ3MgaW4gZW1haWxzIHRvIHByZXZlbnQgdGhlbSB0byBiZSByZWNvZ25pemVkIGFzIGRvY3RhZ3NcbiAgICAgICAgICAgICAgYmVnaW46IC9cXHcrQC8sXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZG9jdGFnJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIC8vIHJlbGV2YW5jZSBib29zdFxuICAgICAge1xuICAgICAgICBiZWdpbjogL2ltcG9ydCBqYXZhXFwuW2Etel0rXFwuLyxcbiAgICAgICAga2V5d29yZHM6IFwiaW1wb3J0XCIsXG4gICAgICAgIHJlbGV2YW5jZTogMlxuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXCJcIlwiLyxcbiAgICAgICAgZW5kOiAvXCJcIlwiLyxcbiAgICAgICAgY2xhc3NOYW1lOiBcInN0cmluZ1wiLFxuICAgICAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL1xcYig/OmNsYXNzfGludGVyZmFjZXxlbnVtfGV4dGVuZHN8aW1wbGVtZW50c3xuZXcpLyxcbiAgICAgICAgICAvXFxzKy8sXG4gICAgICAgICAgSkFWQV9JREVOVF9SRVxuICAgICAgICBdLFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInRpdGxlLmNsYXNzXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gRXhjZXB0aW9ucyBmb3IgaHlwaGVuYXRlZCBrZXl3b3Jkc1xuICAgICAgICBtYXRjaDogL25vbi1zZWFsZWQvLFxuICAgICAgICBzY29wZTogXCJrZXl3b3JkXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBbXG4gICAgICAgICAgcmVnZXguY29uY2F0KC8oPyFlbHNlKS8sIEpBVkFfSURFTlRfUkUpLFxuICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICBKQVZBX0lERU5UX1JFLFxuICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICAvPSg/IT0pL1xuICAgICAgICBdLFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAxOiBcInR5cGVcIixcbiAgICAgICAgICAzOiBcInZhcmlhYmxlXCIsXG4gICAgICAgICAgNTogXCJvcGVyYXRvclwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBbXG4gICAgICAgICAgL3JlY29yZC8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIEpBVkFfSURFTlRfUkVcbiAgICAgICAgXSxcbiAgICAgICAgY2xhc3NOYW1lOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ0aXRsZS5jbGFzc1wiXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgUEFSQU1TLFxuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIEV4cHJlc3Npb24ga2V5d29yZHMgcHJldmVudCAna2V5d29yZCBOYW1lKC4uLiknIGZyb20gYmVpbmdcbiAgICAgICAgLy8gcmVjb2duaXplZCBhcyBhIGZ1bmN0aW9uIGRlZmluaXRpb25cbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ25ldyB0aHJvdyByZXR1cm4gZWxzZScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IFtcbiAgICAgICAgICAnKD86JyArIEdFTkVSSUNfSURFTlRfUkUgKyAnXFxcXHMrKScsXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICAgIC9cXHMqKD89XFwoKS9cbiAgICAgICAgXSxcbiAgICAgICAgY2xhc3NOYW1lOiB7IDI6IFwidGl0bGUuZnVuY3Rpb25cIiB9LFxuICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBBTk5PVEFUSU9OLFxuICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIE5VTUVSSUMsXG4gICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBOVU1FUklDLFxuICAgICAgQU5OT1RBVElPTlxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgamF2YSBhcyBkZWZhdWx0IH07XG4iXX0=