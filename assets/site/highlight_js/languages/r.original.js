function r(hljs) {
    const regex = hljs.regex;
    const IDENT_RE = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/;
    const NUMBER_TYPES_RE = regex.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/);
    const OPERATORS_RE = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/;
    const PUNCTUATION_RE = regex.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
    return {
        name: 'R',
        keywords: {
            $pattern: IDENT_RE,
            keyword: 'function if in break next repeat else for while',
            literal: 'NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 '
                + 'NA_character_|10 NA_complex_|10',
            built_in: 'LETTERS letters month.abb month.name pi T F '
                + 'abs acos acosh all any anyNA Arg as.call as.character '
                + 'as.complex as.double as.environment as.integer as.logical '
                + 'as.null.default as.numeric as.raw asin asinh atan atanh attr '
                + 'attributes baseenv browser c call ceiling class Conj cos cosh '
                + 'cospi cummax cummin cumprod cumsum digamma dim dimnames '
                + 'emptyenv exp expression floor forceAndCall gamma gc.time '
                + 'globalenv Im interactive invisible is.array is.atomic is.call '
                + 'is.character is.complex is.double is.environment is.expression '
                + 'is.finite is.function is.infinite is.integer is.language '
                + 'is.list is.logical is.matrix is.na is.name is.nan is.null '
                + 'is.numeric is.object is.pairlist is.raw is.recursive is.single '
                + 'is.symbol lazyLoadDBfetch length lgamma list log max min '
                + 'missing Mod names nargs nzchar oldClass on.exit pos.to.env '
                + 'proc.time prod quote range Re rep retracemem return round '
                + 'seq_along seq_len seq.int sign signif sin sinh sinpi sqrt '
                + 'standardGeneric substitute sum switch tan tanh tanpi tracemem '
                + 'trigamma trunc unclass untracemem UseMethod xtfrm',
        },
        contains: [
            hljs.COMMENT(/#'/, /$/, { contains: [
                    {
                        scope: 'doctag',
                        match: /@examples/,
                        starts: {
                            end: regex.lookahead(regex.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
                            endsParent: true
                        }
                    },
                    {
                        scope: 'doctag',
                        begin: '@param',
                        end: /$/,
                        contains: [
                            {
                                scope: 'variable',
                                variants: [
                                    { match: IDENT_RE },
                                    { match: /`(?:\\.|[^`\\])+`/ }
                                ],
                                endsParent: true
                            }
                        ]
                    },
                    {
                        scope: 'doctag',
                        match: /@[a-zA-Z]+/
                    },
                    {
                        scope: 'keyword',
                        match: /\\[a-zA-Z]+/
                    }
                ] }),
            hljs.HASH_COMMENT_MODE,
            {
                scope: 'string',
                contains: [hljs.BACKSLASH_ESCAPE],
                variants: [
                    hljs.END_SAME_AS_BEGIN({
                        begin: /[rR]"(-*)\(/,
                        end: /\)(-*)"/
                    }),
                    hljs.END_SAME_AS_BEGIN({
                        begin: /[rR]"(-*)\{/,
                        end: /\}(-*)"/
                    }),
                    hljs.END_SAME_AS_BEGIN({
                        begin: /[rR]"(-*)\[/,
                        end: /\](-*)"/
                    }),
                    hljs.END_SAME_AS_BEGIN({
                        begin: /[rR]'(-*)\(/,
                        end: /\)(-*)'/
                    }),
                    hljs.END_SAME_AS_BEGIN({
                        begin: /[rR]'(-*)\{/,
                        end: /\}(-*)'/
                    }),
                    hljs.END_SAME_AS_BEGIN({
                        begin: /[rR]'(-*)\[/,
                        end: /\](-*)'/
                    }),
                    {
                        begin: '"',
                        end: '"',
                        relevance: 0
                    },
                    {
                        begin: "'",
                        end: "'",
                        relevance: 0
                    }
                ],
            },
            {
                relevance: 0,
                variants: [
                    {
                        scope: {
                            1: 'operator',
                            2: 'number'
                        },
                        match: [
                            OPERATORS_RE,
                            NUMBER_TYPES_RE
                        ]
                    },
                    {
                        scope: {
                            1: 'operator',
                            2: 'number'
                        },
                        match: [
                            /%[^%]*%/,
                            NUMBER_TYPES_RE
                        ]
                    },
                    {
                        scope: {
                            1: 'punctuation',
                            2: 'number'
                        },
                        match: [
                            PUNCTUATION_RE,
                            NUMBER_TYPES_RE
                        ]
                    },
                    {
                        scope: { 2: 'number' },
                        match: [
                            /[^a-zA-Z0-9._]|^/,
                            NUMBER_TYPES_RE
                        ]
                    }
                ]
            },
            {
                scope: { 3: 'operator' },
                match: [
                    IDENT_RE,
                    /\s+/,
                    /<-/,
                    /\s+/
                ]
            },
            {
                scope: 'operator',
                relevance: 0,
                variants: [
                    { match: OPERATORS_RE },
                    { match: /%[^%]*%/ }
                ]
            },
            {
                scope: 'punctuation',
                relevance: 0,
                match: PUNCTUATION_RE
            },
            {
                begin: '`',
                end: '`',
                contains: [{ begin: /\\./ }]
            }
        ]
    };
}
export { r as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoici5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsU0FBUyxDQUFDLENBQUMsSUFBSTtJQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFPekIsTUFBTSxRQUFRLEdBQUcsc0RBQXNELENBQUM7SUFDeEUsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FFbEMsK0NBQStDLEVBRS9DLHlDQUF5QyxFQUV6QywrQ0FBK0MsQ0FDaEQsQ0FBQztJQUNGLE1BQU0sWUFBWSxHQUFHLGtFQUFrRSxDQUFDO0lBQ3hGLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQ2pDLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE9BQU8sRUFDUCxJQUFJLEVBQ0osR0FBRyxDQUNKLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLEdBQUc7UUFFVCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsUUFBUTtZQUNsQixPQUFPLEVBQ0wsaURBQWlEO1lBQ25ELE9BQU8sRUFDTCx3REFBd0Q7a0JBQ3RELGlDQUFpQztZQUNyQyxRQUFRLEVBRU4sOENBQThDO2tCQUk1Qyx3REFBd0Q7a0JBQ3hELDREQUE0RDtrQkFDNUQsK0RBQStEO2tCQUMvRCxnRUFBZ0U7a0JBQ2hFLDBEQUEwRDtrQkFDMUQsMkRBQTJEO2tCQUMzRCxnRUFBZ0U7a0JBQ2hFLGlFQUFpRTtrQkFDakUsMkRBQTJEO2tCQUMzRCw0REFBNEQ7a0JBQzVELGlFQUFpRTtrQkFDakUsMkRBQTJEO2tCQUMzRCw2REFBNkQ7a0JBQzdELDREQUE0RDtrQkFDNUQsNERBQTREO2tCQUM1RCxnRUFBZ0U7a0JBQ2hFLG1EQUFtRDtT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cUJBQ0Y7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRTt3QkFDdEIsS0FBSyxFQUFFOzRCQUNMLGtCQUFrQjs0QkFDbEIsZUFBZTt5QkFDaEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUdEO2dCQUVFLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUU7Z0JBQ3hCLEtBQUssRUFBRTtvQkFDTCxRQUFRO29CQUNSLEtBQUs7b0JBQ0wsSUFBSTtvQkFDSixLQUFLO2lCQUNOO2FBQ0Y7WUFFRDtnQkFDRSxLQUFLLEVBQUUsVUFBVTtnQkFDakIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtvQkFDdkIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO2lCQUNyQjthQUNGO1lBRUQ7Z0JBQ0UsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLEtBQUssRUFBRSxjQUFjO2FBQ3RCO1lBRUQ7Z0JBRUUsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUU7YUFDL0I7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUlxuRGVzY3JpcHRpb246IFIgaXMgYSBmcmVlIHNvZnR3YXJlIGVudmlyb25tZW50IGZvciBzdGF0aXN0aWNhbCBjb21wdXRpbmcgYW5kIGdyYXBoaWNzLlxuQXV0aG9yOiBKb2UgQ2hlbmcgPGpvZUByc3R1ZGlvLm9yZz5cbkNvbnRyaWJ1dG9yczogS29ucmFkIFJ1ZG9scGggPGtvbnJhZC5ydWRvbHBoQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vd3d3LnItcHJvamVjdC5vcmdcbkNhdGVnb3J5OiBjb21tb24sc2NpZW50aWZpY1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIHIoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIC8vIElkZW50aWZpZXJzIGluIFIgY2Fubm90IHN0YXJ0IHdpdGggYF9gLCBidXQgdGhleSBjYW4gc3RhcnQgd2l0aCBgLmAgaWYgaXRcbiAgLy8gaXMgbm90IGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IGEgZGlnaXQuXG4gIC8vIFIgYWxzbyBzdXBwb3J0cyBxdW90ZWQgaWRlbnRpZmllcnMsIHdoaWNoIGFyZSBuZWFyLWFyYml0cmFyeSBzZXF1ZW5jZXNcbiAgLy8gZGVsaW1pdGVkIGJ5IGJhY2t0aWNrcyAoYOKApmApLCB3aGljaCBtYXkgY29udGFpbiBlc2NhcGUgc2VxdWVuY2VzLiBUaGVzZSBhcmVcbiAgLy8gaGFuZGxlZCBpbiBhIHNlcGFyYXRlIG1vZGUuIFNlZSBgdGVzdC9tYXJrdXAvci9uYW1lcy50eHRgIGZvciBleGFtcGxlcy5cbiAgLy8gRklYTUU6IFN1cHBvcnQgVW5pY29kZSBpZGVudGlmaWVycy5cbiAgY29uc3QgSURFTlRfUkUgPSAvKD86KD86W2EtekEtWl18XFwuWy5fYS16QS1aXSlbLl9hLXpBLVowLTldKil8XFwuKD8hXFxkKS87XG4gIGNvbnN0IE5VTUJFUl9UWVBFU19SRSA9IHJlZ2V4LmVpdGhlcihcbiAgICAvLyBTcGVjaWFsIGNhc2U6IG9ubHkgaGV4YWRlY2ltYWwgYmluYXJ5IHBvd2VycyBjYW4gY29udGFpbiBmcmFjdGlvbnNcbiAgICAvMFt4WF1bMC05YS1mQS1GXStcXC5bMC05YS1mQS1GXSpbcFBdWystXT9cXGQraT8vLFxuICAgIC8vIEhleGFkZWNpbWFsIG51bWJlcnMgd2l0aG91dCBmcmFjdGlvbiBhbmQgb3B0aW9uYWwgYmluYXJ5IHBvd2VyXG4gICAgLzBbeFhdWzAtOWEtZkEtRl0rKD86W3BQXVsrLV0/XFxkKyk/W0xpXT8vLFxuICAgIC8vIERlY2ltYWwgbnVtYmVyc1xuICAgIC8oPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspKD86W2VFXVsrLV0/XFxkKyk/W0xpXT8vXG4gICk7XG4gIGNvbnN0IE9QRVJBVE9SU19SRSA9IC9bPSE8PjpdPXxcXHxcXHx8JiZ8Ojo6P3w8LXw8PC18LT4+fC0+fFxcfD58Wy0rKlxcLz8hJCZ8Ojw9PkBefl18XFwqXFwqLztcbiAgY29uc3QgUFVOQ1RVQVRJT05fUkUgPSByZWdleC5laXRoZXIoXG4gICAgL1soKV0vLFxuICAgIC9be31dLyxcbiAgICAvXFxbXFxbLyxcbiAgICAvW1tcXF1dLyxcbiAgICAvXFxcXC8sXG4gICAgLywvXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUicsXG5cbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46IElERU5UX1JFLFxuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2Z1bmN0aW9uIGlmIGluIGJyZWFrIG5leHQgcmVwZWF0IGVsc2UgZm9yIHdoaWxlJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdOVUxMIE5BIFRSVUUgRkFMU0UgSW5mIE5hTiBOQV9pbnRlZ2VyX3wxMCBOQV9yZWFsX3wxMCAnXG4gICAgICAgICsgJ05BX2NoYXJhY3Rlcl98MTAgTkFfY29tcGxleF98MTAnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgIC8vIEJ1aWx0aW4gY29uc3RhbnRzXG4gICAgICAgICdMRVRURVJTIGxldHRlcnMgbW9udGguYWJiIG1vbnRoLm5hbWUgcGkgVCBGICdcbiAgICAgICAgLy8gUHJpbWl0aXZlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBUaGVzZSBhcmUgYWxsIHRoZSBmdW5jdGlvbnMgaW4gYGJhc2VgIHRoYXQgYXJlIGltcGxlbWVudGVkIGFzIGFcbiAgICAgICAgLy8gYC5QcmltaXRpdmVgLCBtaW51cyB0aG9zZSBmdW5jdGlvbnMgdGhhdCBhcmUgYWxzbyBrZXl3b3Jkcy5cbiAgICAgICAgKyAnYWJzIGFjb3MgYWNvc2ggYWxsIGFueSBhbnlOQSBBcmcgYXMuY2FsbCBhcy5jaGFyYWN0ZXIgJ1xuICAgICAgICArICdhcy5jb21wbGV4IGFzLmRvdWJsZSBhcy5lbnZpcm9ubWVudCBhcy5pbnRlZ2VyIGFzLmxvZ2ljYWwgJ1xuICAgICAgICArICdhcy5udWxsLmRlZmF1bHQgYXMubnVtZXJpYyBhcy5yYXcgYXNpbiBhc2luaCBhdGFuIGF0YW5oIGF0dHIgJ1xuICAgICAgICArICdhdHRyaWJ1dGVzIGJhc2VlbnYgYnJvd3NlciBjIGNhbGwgY2VpbGluZyBjbGFzcyBDb25qIGNvcyBjb3NoICdcbiAgICAgICAgKyAnY29zcGkgY3VtbWF4IGN1bW1pbiBjdW1wcm9kIGN1bXN1bSBkaWdhbW1hIGRpbSBkaW1uYW1lcyAnXG4gICAgICAgICsgJ2VtcHR5ZW52IGV4cCBleHByZXNzaW9uIGZsb29yIGZvcmNlQW5kQ2FsbCBnYW1tYSBnYy50aW1lICdcbiAgICAgICAgKyAnZ2xvYmFsZW52IEltIGludGVyYWN0aXZlIGludmlzaWJsZSBpcy5hcnJheSBpcy5hdG9taWMgaXMuY2FsbCAnXG4gICAgICAgICsgJ2lzLmNoYXJhY3RlciBpcy5jb21wbGV4IGlzLmRvdWJsZSBpcy5lbnZpcm9ubWVudCBpcy5leHByZXNzaW9uICdcbiAgICAgICAgKyAnaXMuZmluaXRlIGlzLmZ1bmN0aW9uIGlzLmluZmluaXRlIGlzLmludGVnZXIgaXMubGFuZ3VhZ2UgJ1xuICAgICAgICArICdpcy5saXN0IGlzLmxvZ2ljYWwgaXMubWF0cml4IGlzLm5hIGlzLm5hbWUgaXMubmFuIGlzLm51bGwgJ1xuICAgICAgICArICdpcy5udW1lcmljIGlzLm9iamVjdCBpcy5wYWlybGlzdCBpcy5yYXcgaXMucmVjdXJzaXZlIGlzLnNpbmdsZSAnXG4gICAgICAgICsgJ2lzLnN5bWJvbCBsYXp5TG9hZERCZmV0Y2ggbGVuZ3RoIGxnYW1tYSBsaXN0IGxvZyBtYXggbWluICdcbiAgICAgICAgKyAnbWlzc2luZyBNb2QgbmFtZXMgbmFyZ3MgbnpjaGFyIG9sZENsYXNzIG9uLmV4aXQgcG9zLnRvLmVudiAnXG4gICAgICAgICsgJ3Byb2MudGltZSBwcm9kIHF1b3RlIHJhbmdlIFJlIHJlcCByZXRyYWNlbWVtIHJldHVybiByb3VuZCAnXG4gICAgICAgICsgJ3NlcV9hbG9uZyBzZXFfbGVuIHNlcS5pbnQgc2lnbiBzaWduaWYgc2luIHNpbmggc2lucGkgc3FydCAnXG4gICAgICAgICsgJ3N0YW5kYXJkR2VuZXJpYyBzdWJzdGl0dXRlIHN1bSBzd2l0Y2ggdGFuIHRhbmggdGFucGkgdHJhY2VtZW0gJ1xuICAgICAgICArICd0cmlnYW1tYSB0cnVuYyB1bmNsYXNzIHVudHJhY2VtZW0gVXNlTWV0aG9kIHh0ZnJtJyxcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IFtcbiAgICAgIC8vIFJveHlnZW4gY29tbWVudHNcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgLyMnLyxcbiAgICAgICAgLyQvLFxuICAgICAgICB7IGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGBAZXhhbXBsZXNgIHNlcGFyYXRlbHkgdG8gY2F1c2UgYWxsIHN1YnNlcXVlbnQgY29kZVxuICAgICAgICAgICAgLy8gdW50aWwgdGhlIG5leHQgYEBgLXRhZyBvbiBpdHMgb3duIGxpbmUgdG8gYmUga2VwdCBhcy1pcyxcbiAgICAgICAgICAgIC8vIHByZXZlbnRpbmcgaGlnaGxpZ2h0aW5nLiBUaGlzIGNvZGUgaXMgZXhhbXBsZSBSIGNvZGUsIHNvIG5lc3RlZFxuICAgICAgICAgICAgLy8gZG9jdGFncyBzaG91bGRu4oCZdCBiZSB0cmVhdGVkIGFzIHN1Y2guIFNlZVxuICAgICAgICAgICAgLy8gYHRlc3QvbWFya3VwL3Ivcm94eWdlbi50eHRgIGZvciBhbiBleGFtcGxlLlxuICAgICAgICAgICAgc2NvcGU6ICdkb2N0YWcnLFxuICAgICAgICAgICAgbWF0Y2g6IC9AZXhhbXBsZXMvLFxuICAgICAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgICAgIGVuZDogcmVnZXgubG9va2FoZWFkKHJlZ2V4LmVpdGhlcihcbiAgICAgICAgICAgICAgICAvLyBlbmQgaWYgYW5vdGhlciBkb2MgY29tbWVudFxuICAgICAgICAgICAgICAgIC9cXG5eIydcXHMqKD89QFthLXpBLVpdKykvLFxuICAgICAgICAgICAgICAgIC8vIG9yIGEgbGluZSB3aXRoIG5vIGNvbW1lbnRcbiAgICAgICAgICAgICAgICAvXFxuXig/ISMnKS9cbiAgICAgICAgICAgICAgKSksXG4gICAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBgQHBhcmFtYCB0byBoaWdobGlnaHQgdGhlIHBhcmFtZXRlciBuYW1lIGZvbGxvd2luZ1xuICAgICAgICAgICAgLy8gYWZ0ZXIuXG4gICAgICAgICAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgICAgICAgICBiZWdpbjogJ0BwYXJhbScsXG4gICAgICAgICAgICBlbmQ6IC8kLyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzY29wZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgICAgICAgICAgeyBtYXRjaDogSURFTlRfUkUgfSxcbiAgICAgICAgICAgICAgICAgIHsgbWF0Y2g6IC9gKD86XFxcXC58W15gXFxcXF0pK2AvIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6ICdkb2N0YWcnLFxuICAgICAgICAgICAgbWF0Y2g6IC9AW2EtekEtWl0rL1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6ICdrZXl3b3JkJyxcbiAgICAgICAgICAgIG1hdGNoOiAvXFxcXFthLXpBLVpdKy9cbiAgICAgICAgICB9XG4gICAgICAgIF0gfVxuICAgICAgKSxcblxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcblxuICAgICAge1xuICAgICAgICBzY29wZTogJ3N0cmluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICAgICAgYmVnaW46IC9bclJdXCIoLSopXFwoLyxcbiAgICAgICAgICAgIGVuZDogL1xcKSgtKilcIi9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgICAgIGJlZ2luOiAvW3JSXVwiKC0qKVxcey8sXG4gICAgICAgICAgICBlbmQ6IC9cXH0oLSopXCIvXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgICAgICAgICBiZWdpbjogL1tyUl1cIigtKilcXFsvLFxuICAgICAgICAgICAgZW5kOiAvXFxdKC0qKVwiL1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICAgICAgYmVnaW46IC9bclJdJygtKilcXCgvLFxuICAgICAgICAgICAgZW5kOiAvXFwpKC0qKScvXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgICAgICAgICBiZWdpbjogL1tyUl0nKC0qKVxcey8sXG4gICAgICAgICAgICBlbmQ6IC9cXH0oLSopJy9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgICAgIGJlZ2luOiAvW3JSXScoLSopXFxbLyxcbiAgICAgICAgICAgIGVuZDogL1xcXSgtKiknL1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogXCInXCIsXG4gICAgICAgICAgICBlbmQ6IFwiJ1wiLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgfSxcblxuICAgICAgLy8gTWF0Y2hpbmcgbnVtYmVycyBpbW1lZGlhdGVseSBmb2xsb3dpbmcgcHVuY3R1YXRpb24gYW5kIG9wZXJhdG9ycyBpc1xuICAgICAgLy8gdHJpY2t5IHNpbmNlIHdlIG5lZWQgdG8gbG9vayBhdCB0aGUgY2hhcmFjdGVyIGFoZWFkIG9mIGEgbnVtYmVyIHRvXG4gICAgICAvLyBlbnN1cmUgdGhlIG51bWJlciBpcyBub3QgcGFydCBvZiBhbiBpZGVudGlmaWVyLCBhbmQgd2UgY2Fubm90IHVzZVxuICAgICAgLy8gbmVnYXRpdmUgbG9vay1iZWhpbmQgYXNzZXJ0aW9ucy4gU28gaW5zdGVhZCB3ZSBleHBsaWNpdGx5IGhhbmRsZSBhbGxcbiAgICAgIC8vIHBvc3NpYmxlIGNvbWJpbmF0aW9ucyBvZiAob3BlcmF0b3J8cHVuY3R1YXRpb24pLCBudW1iZXIuXG4gICAgICAvLyBUT0RPOiByZXBsYWNlIHdpdGggbmVnYXRpdmUgbG9vay1iZWhpbmQgd2hlbiBhdmFpbGFibGVcbiAgICAgIC8vIHsgYmVnaW46IC8oPzwhW2EtekEtWjAtOS5fXSkwW3hYXVswLTlhLWZBLUZdK1xcLlswLTlhLWZBLUZdKltwUF1bKy1dP1xcZCtpPy8gfSxcbiAgICAgIC8vIHsgYmVnaW46IC8oPzwhW2EtekEtWjAtOS5fXSkwW3hYXVswLTlhLWZBLUZdKyhbcFBdWystXT9cXGQrKT9bTGldPy8gfSxcbiAgICAgIC8vIHsgYmVnaW46IC8oPzwhW2EtekEtWjAtOS5fXSkoXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoW2VFXVsrLV0/XFxkKyk/W0xpXT8vIH1cbiAgICAgIHtcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIDE6ICdvcGVyYXRvcicsXG4gICAgICAgICAgICAgIDI6ICdudW1iZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgT1BFUkFUT1JTX1JFLFxuICAgICAgICAgICAgICBOVU1CRVJfVFlQRVNfUkVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIDE6ICdvcGVyYXRvcicsXG4gICAgICAgICAgICAgIDI6ICdudW1iZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgLyVbXiVdKiUvLFxuICAgICAgICAgICAgICBOVU1CRVJfVFlQRVNfUkVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIDE6ICdwdW5jdHVhdGlvbicsXG4gICAgICAgICAgICAgIDI6ICdudW1iZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgUFVOQ1RVQVRJT05fUkUsXG4gICAgICAgICAgICAgIE5VTUJFUl9UWVBFU19SRVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6IHsgMjogJ251bWJlcicgfSxcbiAgICAgICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgICAgIC9bXmEtekEtWjAtOS5fXXxeLywgLy8gbm90IHBhcnQgb2YgYW4gaWRlbnRpZmllciwgb3Igc3RhcnQgb2YgZG9jdW1lbnRcbiAgICAgICAgICAgICAgTlVNQkVSX1RZUEVTX1JFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICAvLyBPcGVyYXRvcnMvcHVuY3R1YXRpb24gd2hlbiB0aGV5J3JlIG5vdCBkaXJlY3RseSBmb2xsb3dlZCBieSBudW1iZXJzXG4gICAgICB7XG4gICAgICAgIC8vIFJlbGV2YW5jZSBib29zdCBmb3IgdGhlIG1vc3QgY29tbW9uIGFzc2lnbm1lbnQgZm9ybS5cbiAgICAgICAgc2NvcGU6IHsgMzogJ29wZXJhdG9yJyB9LFxuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIElERU5UX1JFLFxuICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICAvPC0vLFxuICAgICAgICAgIC9cXHMrL1xuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAnb3BlcmF0b3InLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBtYXRjaDogT1BFUkFUT1JTX1JFIH0sXG4gICAgICAgICAgeyBtYXRjaDogLyVbXiVdKiUvIH1cbiAgICAgICAgXVxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBzY29wZTogJ3B1bmN0dWF0aW9uJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBtYXRjaDogUFVOQ1RVQVRJT05fUkVcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgLy8gRXNjYXBlZCBpZGVudGlmaWVyXG4gICAgICAgIGJlZ2luOiAnYCcsXG4gICAgICAgIGVuZDogJ2AnLFxuICAgICAgICBjb250YWluczogWyB7IGJlZ2luOiAvXFxcXC4vIH0gXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgciBhcyBkZWZhdWx0IH07XG4iXX0=