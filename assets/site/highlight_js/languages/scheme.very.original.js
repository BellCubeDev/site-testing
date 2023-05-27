function scheme(hljs) {
    const SCHEME_IDENT_RE = '[^\\(\\)\\[\\]\\{\\}",\'`;#|\\\\\\s]+';
    const SCHEME_SIMPLE_NUMBER_RE = '(-|\\+)?\\d+([./]\\d+)?';
    const SCHEME_COMPLEX_NUMBER_RE = SCHEME_SIMPLE_NUMBER_RE + '[+\\-]' + SCHEME_SIMPLE_NUMBER_RE + 'i';
    const KEYWORDS = {
        $pattern: SCHEME_IDENT_RE,
        built_in: 'case-lambda call/cc class define-class exit-handler field import '
            + 'inherit init-field interface let*-values let-values let/ec mixin '
            + 'opt-lambda override protect provide public rename require '
            + 'require-for-syntax syntax syntax-case syntax-error unit/sig unless '
            + 'when with-syntax and begin call-with-current-continuation '
            + 'call-with-input-file call-with-output-file case cond define '
            + 'define-syntax delay do dynamic-wind else for-each if lambda let let* '
            + 'let-syntax letrec letrec-syntax map or syntax-rules \' * + , ,@ - ... / '
            + '; < <= = => > >= ` abs acos angle append apply asin assoc assq assv atan '
            + 'boolean? caar cadr call-with-input-file call-with-output-file '
            + 'call-with-values car cdddar cddddr cdr ceiling char->integer '
            + 'char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=? char-ci>? '
            + 'char-downcase char-lower-case? char-numeric? char-ready? char-upcase '
            + 'char-upper-case? char-whitespace? char<=? char<? char=? char>=? char>? '
            + 'char? close-input-port close-output-port complex? cons cos '
            + 'current-input-port current-output-port denominator display eof-object? '
            + 'eq? equal? eqv? eval even? exact->inexact exact? exp expt floor '
            + 'force gcd imag-part inexact->exact inexact? input-port? integer->char '
            + 'integer? interaction-environment lcm length list list->string '
            + 'list->vector list-ref list-tail list? load log magnitude make-polar '
            + 'make-rectangular make-string make-vector max member memq memv min '
            + 'modulo negative? newline not null-environment null? number->string '
            + 'number? numerator odd? open-input-file open-output-file output-port? '
            + 'pair? peek-char port? positive? procedure? quasiquote quote quotient '
            + 'rational? rationalize read read-char real-part real? remainder reverse '
            + 'round scheme-report-environment set! set-car! set-cdr! sin sqrt string '
            + 'string->list string->number string->symbol string-append string-ci<=? '
            + 'string-ci<? string-ci=? string-ci>=? string-ci>? string-copy '
            + 'string-fill! string-length string-ref string-set! string<=? string<? '
            + 'string=? string>=? string>? string? substring symbol->string symbol? '
            + 'tan transcript-off transcript-on truncate values vector '
            + 'vector->list vector-fill! vector-length vector-ref vector-set! '
            + 'with-input-from-file with-output-to-file write write-char zero?'
    };
    const LITERAL = {
        className: 'literal',
        begin: '(#t|#f|#\\\\' + SCHEME_IDENT_RE + '|#\\\\.)'
    };
    const NUMBER = {
        className: 'number',
        variants: [
            {
                begin: SCHEME_SIMPLE_NUMBER_RE,
                relevance: 0
            },
            {
                begin: SCHEME_COMPLEX_NUMBER_RE,
                relevance: 0
            },
            { begin: '#b[0-1]+(/[0-1]+)?' },
            { begin: '#o[0-7]+(/[0-7]+)?' },
            { begin: '#x[0-9a-f]+(/[0-9a-f]+)?' }
        ]
    };
    const STRING = hljs.QUOTE_STRING_MODE;
    const COMMENT_MODES = [
        hljs.COMMENT(';', '$', { relevance: 0 }),
        hljs.COMMENT('#\\|', '\\|#')
    ];
    const IDENT = {
        begin: SCHEME_IDENT_RE,
        relevance: 0
    };
    const QUOTED_IDENT = {
        className: 'symbol',
        begin: '\'' + SCHEME_IDENT_RE
    };
    const BODY = {
        endsWithParent: true,
        relevance: 0
    };
    const QUOTED_LIST = {
        variants: [
            { begin: /'/ },
            { begin: '`' }
        ],
        contains: [
            {
                begin: '\\(',
                end: '\\)',
                contains: [
                    'self',
                    LITERAL,
                    STRING,
                    NUMBER,
                    IDENT,
                    QUOTED_IDENT
                ]
            }
        ]
    };
    const NAME = {
        className: 'name',
        relevance: 0,
        begin: SCHEME_IDENT_RE,
        keywords: KEYWORDS
    };
    const LAMBDA = {
        begin: /lambda/,
        endsWithParent: true,
        returnBegin: true,
        contains: [
            NAME,
            {
                endsParent: true,
                variants: [
                    {
                        begin: /\(/,
                        end: /\)/
                    },
                    {
                        begin: /\[/,
                        end: /\]/
                    }
                ],
                contains: [IDENT]
            }
        ]
    };
    const LIST = {
        variants: [
            {
                begin: '\\(',
                end: '\\)'
            },
            {
                begin: '\\[',
                end: '\\]'
            }
        ],
        contains: [
            LAMBDA,
            NAME,
            BODY
        ]
    };
    BODY.contains = [
        LITERAL,
        NUMBER,
        STRING,
        IDENT,
        QUOTED_IDENT,
        QUOTED_LIST,
        LIST
    ].concat(COMMENT_MODES);
    return {
        name: 'Scheme',
        aliases: ['scm'],
        illegal: /\S/,
        contains: [
            hljs.SHEBANG(),
            NUMBER,
            STRING,
            QUOTED_IDENT,
            QUOTED_LIST,
            LIST
        ].concat(COMMENT_MODES)
    };
}
export { scheme as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1lLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvc2NoZW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxlQUFlLEdBQUcsdUNBQXVDLENBQUM7SUFDaEUsTUFBTSx1QkFBdUIsR0FBRyx5QkFBeUIsQ0FBQztJQUMxRCxNQUFNLHdCQUF3QixHQUFHLHVCQUF1QixHQUFHLFFBQVEsR0FBRyx1QkFBdUIsR0FBRyxHQUFHLENBQUM7SUFDcEcsTUFBTSxRQUFRLEdBQUc7UUFDZixRQUFRLEVBQUUsZUFBZTtRQUN6QixRQUFRLEVBQ04sbUVBQW1FO2NBQ2pFLG1FQUFtRTtjQUNuRSw0REFBNEQ7Y0FDNUQscUVBQXFFO2NBQ3JFLDREQUE0RDtjQUM1RCw4REFBOEQ7Y0FDOUQsdUVBQXVFO2NBQ3ZFLDBFQUEwRTtjQUMxRSwyRUFBMkU7Y0FDM0UsZ0VBQWdFO2NBQ2hFLCtEQUErRDtjQUMvRCx1RUFBdUU7Y0FDdkUsdUVBQXVFO2NBQ3ZFLHlFQUF5RTtjQUN6RSw2REFBNkQ7Y0FDN0QseUVBQXlFO2NBQ3pFLGtFQUFrRTtjQUNsRSx3RUFBd0U7Y0FDeEUsZ0VBQWdFO2NBQ2hFLHNFQUFzRTtjQUN0RSxvRUFBb0U7Y0FDcEUscUVBQXFFO2NBQ3JFLHVFQUF1RTtjQUN2RSx1RUFBdUU7Y0FDdkUseUVBQXlFO2NBQ3pFLHlFQUF5RTtjQUN6RSx3RUFBd0U7Y0FDeEUsK0RBQStEO2NBQy9ELHVFQUF1RTtjQUN2RSx1RUFBdUU7Y0FDdkUsMERBQTBEO2NBQzFELGlFQUFpRTtjQUNqRSxpRUFBaUU7S0FDdEUsQ0FBQztJQUVGLE1BQU0sT0FBTyxHQUFHO1FBQ2QsU0FBUyxFQUFFLFNBQVM7UUFDcEIsS0FBSyxFQUFFLGNBQWMsR0FBRyxlQUFlLEdBQUcsVUFBVTtLQUNyRCxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsdUJBQXVCO2dCQUM5QixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHdCQUF3QjtnQkFDL0IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1lBQy9CLEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1lBQy9CLEVBQUUsS0FBSyxFQUFFLDBCQUEwQixFQUFFO1NBQ3RDO0tBQ0YsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUV0QyxNQUFNLGFBQWEsR0FBRztRQUNwQixJQUFJLENBQUMsT0FBTyxDQUNWLEdBQUcsRUFDSCxHQUFHLEVBQ0gsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQ2pCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQzdCLENBQUM7SUFFRixNQUFNLEtBQUssR0FBRztRQUNaLEtBQUssRUFBRSxlQUFlO1FBQ3RCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHO1FBQ25CLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxJQUFJLEdBQUcsZUFBZTtLQUM5QixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUc7UUFDWCxjQUFjLEVBQUUsSUFBSTtRQUNwQixTQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRztRQUNsQixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDZCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7U0FDZjtRQUNELFFBQVEsRUFBRTtZQUNSO2dCQUNFLEtBQUssRUFBRSxLQUFLO2dCQUNaLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixNQUFNO29CQUNOLE9BQU87b0JBQ1AsTUFBTTtvQkFDTixNQUFNO29CQUNOLEtBQUs7b0JBQ0wsWUFBWTtpQkFDYjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUc7UUFDWCxTQUFTLEVBQUUsTUFBTTtRQUNqQixTQUFTLEVBQUUsQ0FBQztRQUNaLEtBQUssRUFBRSxlQUFlO1FBQ3RCLFFBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRztRQUNiLEtBQUssRUFBRSxRQUFRO1FBQ2YsY0FBYyxFQUFFLElBQUk7UUFDcEIsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFO1lBQ1IsSUFBSTtZQUNKO2dCQUNFLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsR0FBRyxFQUFFLElBQUk7cUJBQ1Y7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsR0FBRyxFQUFFLElBQUk7cUJBQ1Y7aUJBQ0Y7Z0JBQ0QsUUFBUSxFQUFFLENBQUUsS0FBSyxDQUFFO2FBQ3BCO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUc7UUFDWCxRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsS0FBSztnQkFDWixHQUFHLEVBQUUsS0FBSzthQUNYO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7YUFDWDtTQUNGO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLElBQUk7WUFDSixJQUFJO1NBQ0w7S0FDRixDQUFDO0lBRUYsSUFBSSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxZQUFZO1FBQ1osV0FBVztRQUNYLElBQUk7S0FDTCxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUV4QixPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDaEIsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsTUFBTTtZQUNOLE1BQU07WUFDTixZQUFZO1lBQ1osV0FBVztZQUNYLElBQUk7U0FDTCxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7S0FDeEIsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBTY2hlbWVcbkRlc2NyaXB0aW9uOiBTY2hlbWUgaXMgYSBwcm9ncmFtbWluZyBsYW5ndWFnZSBpbiB0aGUgTGlzcCBmYW1pbHkuXG4gICAgICAgICAgICAgKGtleXdvcmRzIGJhc2VkIG9uIGh0dHA6Ly9jb21tdW5pdHkuc2NoZW1ld2lraS5vcmcvP3NjaGVtZS1rZXl3b3JkcylcbkF1dGhvcjogSlAgVmVya2FtcCA8bWVAanZlcmthbXAuY29tPlxuQ29udHJpYnV0b3JzOiBJdmFuIFNhZ2FsYWV2IDxtYW5pYWNAc29mdHdhcmVtYW5pYWNzLm9yZz5cbk9yaWdpbjogY2xvanVyZS5qc1xuV2Vic2l0ZTogaHR0cDovL2NvbW11bml0eS5zY2hlbWV3aWtpLm9yZy8/d2hhdC1pcy1zY2hlbWVcbkNhdGVnb3J5OiBsaXNwXG4qL1xuXG5mdW5jdGlvbiBzY2hlbWUoaGxqcykge1xuICBjb25zdCBTQ0hFTUVfSURFTlRfUkUgPSAnW15cXFxcKFxcXFwpXFxcXFtcXFxcXVxcXFx7XFxcXH1cIixcXCdgOyN8XFxcXFxcXFxcXFxcc10rJztcbiAgY29uc3QgU0NIRU1FX1NJTVBMRV9OVU1CRVJfUkUgPSAnKC18XFxcXCspP1xcXFxkKyhbLi9dXFxcXGQrKT8nO1xuICBjb25zdCBTQ0hFTUVfQ09NUExFWF9OVU1CRVJfUkUgPSBTQ0hFTUVfU0lNUExFX05VTUJFUl9SRSArICdbK1xcXFwtXScgKyBTQ0hFTUVfU0lNUExFX05VTUJFUl9SRSArICdpJztcbiAgY29uc3QgS0VZV09SRFMgPSB7XG4gICAgJHBhdHRlcm46IFNDSEVNRV9JREVOVF9SRSxcbiAgICBidWlsdF9pbjpcbiAgICAgICdjYXNlLWxhbWJkYSBjYWxsL2NjIGNsYXNzIGRlZmluZS1jbGFzcyBleGl0LWhhbmRsZXIgZmllbGQgaW1wb3J0ICdcbiAgICAgICsgJ2luaGVyaXQgaW5pdC1maWVsZCBpbnRlcmZhY2UgbGV0Ki12YWx1ZXMgbGV0LXZhbHVlcyBsZXQvZWMgbWl4aW4gJ1xuICAgICAgKyAnb3B0LWxhbWJkYSBvdmVycmlkZSBwcm90ZWN0IHByb3ZpZGUgcHVibGljIHJlbmFtZSByZXF1aXJlICdcbiAgICAgICsgJ3JlcXVpcmUtZm9yLXN5bnRheCBzeW50YXggc3ludGF4LWNhc2Ugc3ludGF4LWVycm9yIHVuaXQvc2lnIHVubGVzcyAnXG4gICAgICArICd3aGVuIHdpdGgtc3ludGF4IGFuZCBiZWdpbiBjYWxsLXdpdGgtY3VycmVudC1jb250aW51YXRpb24gJ1xuICAgICAgKyAnY2FsbC13aXRoLWlucHV0LWZpbGUgY2FsbC13aXRoLW91dHB1dC1maWxlIGNhc2UgY29uZCBkZWZpbmUgJ1xuICAgICAgKyAnZGVmaW5lLXN5bnRheCBkZWxheSBkbyBkeW5hbWljLXdpbmQgZWxzZSBmb3ItZWFjaCBpZiBsYW1iZGEgbGV0IGxldCogJ1xuICAgICAgKyAnbGV0LXN5bnRheCBsZXRyZWMgbGV0cmVjLXN5bnRheCBtYXAgb3Igc3ludGF4LXJ1bGVzIFxcJyAqICsgLCAsQCAtIC4uLiAvICdcbiAgICAgICsgJzsgPCA8PSA9ID0+ID4gPj0gYCBhYnMgYWNvcyBhbmdsZSBhcHBlbmQgYXBwbHkgYXNpbiBhc3NvYyBhc3NxIGFzc3YgYXRhbiAnXG4gICAgICArICdib29sZWFuPyBjYWFyIGNhZHIgY2FsbC13aXRoLWlucHV0LWZpbGUgY2FsbC13aXRoLW91dHB1dC1maWxlICdcbiAgICAgICsgJ2NhbGwtd2l0aC12YWx1ZXMgY2FyIGNkZGRhciBjZGRkZHIgY2RyIGNlaWxpbmcgY2hhci0+aW50ZWdlciAnXG4gICAgICArICdjaGFyLWFscGhhYmV0aWM/IGNoYXItY2k8PT8gY2hhci1jaTw/IGNoYXItY2k9PyBjaGFyLWNpPj0/IGNoYXItY2k+PyAnXG4gICAgICArICdjaGFyLWRvd25jYXNlIGNoYXItbG93ZXItY2FzZT8gY2hhci1udW1lcmljPyBjaGFyLXJlYWR5PyBjaGFyLXVwY2FzZSAnXG4gICAgICArICdjaGFyLXVwcGVyLWNhc2U/IGNoYXItd2hpdGVzcGFjZT8gY2hhcjw9PyBjaGFyPD8gY2hhcj0/IGNoYXI+PT8gY2hhcj4/ICdcbiAgICAgICsgJ2NoYXI/IGNsb3NlLWlucHV0LXBvcnQgY2xvc2Utb3V0cHV0LXBvcnQgY29tcGxleD8gY29ucyBjb3MgJ1xuICAgICAgKyAnY3VycmVudC1pbnB1dC1wb3J0IGN1cnJlbnQtb3V0cHV0LXBvcnQgZGVub21pbmF0b3IgZGlzcGxheSBlb2Ytb2JqZWN0PyAnXG4gICAgICArICdlcT8gZXF1YWw/IGVxdj8gZXZhbCBldmVuPyBleGFjdC0+aW5leGFjdCBleGFjdD8gZXhwIGV4cHQgZmxvb3IgJ1xuICAgICAgKyAnZm9yY2UgZ2NkIGltYWctcGFydCBpbmV4YWN0LT5leGFjdCBpbmV4YWN0PyBpbnB1dC1wb3J0PyBpbnRlZ2VyLT5jaGFyICdcbiAgICAgICsgJ2ludGVnZXI/IGludGVyYWN0aW9uLWVudmlyb25tZW50IGxjbSBsZW5ndGggbGlzdCBsaXN0LT5zdHJpbmcgJ1xuICAgICAgKyAnbGlzdC0+dmVjdG9yIGxpc3QtcmVmIGxpc3QtdGFpbCBsaXN0PyBsb2FkIGxvZyBtYWduaXR1ZGUgbWFrZS1wb2xhciAnXG4gICAgICArICdtYWtlLXJlY3Rhbmd1bGFyIG1ha2Utc3RyaW5nIG1ha2UtdmVjdG9yIG1heCBtZW1iZXIgbWVtcSBtZW12IG1pbiAnXG4gICAgICArICdtb2R1bG8gbmVnYXRpdmU/IG5ld2xpbmUgbm90IG51bGwtZW52aXJvbm1lbnQgbnVsbD8gbnVtYmVyLT5zdHJpbmcgJ1xuICAgICAgKyAnbnVtYmVyPyBudW1lcmF0b3Igb2RkPyBvcGVuLWlucHV0LWZpbGUgb3Blbi1vdXRwdXQtZmlsZSBvdXRwdXQtcG9ydD8gJ1xuICAgICAgKyAncGFpcj8gcGVlay1jaGFyIHBvcnQ/IHBvc2l0aXZlPyBwcm9jZWR1cmU/IHF1YXNpcXVvdGUgcXVvdGUgcXVvdGllbnQgJ1xuICAgICAgKyAncmF0aW9uYWw/IHJhdGlvbmFsaXplIHJlYWQgcmVhZC1jaGFyIHJlYWwtcGFydCByZWFsPyByZW1haW5kZXIgcmV2ZXJzZSAnXG4gICAgICArICdyb3VuZCBzY2hlbWUtcmVwb3J0LWVudmlyb25tZW50IHNldCEgc2V0LWNhciEgc2V0LWNkciEgc2luIHNxcnQgc3RyaW5nICdcbiAgICAgICsgJ3N0cmluZy0+bGlzdCBzdHJpbmctPm51bWJlciBzdHJpbmctPnN5bWJvbCBzdHJpbmctYXBwZW5kIHN0cmluZy1jaTw9PyAnXG4gICAgICArICdzdHJpbmctY2k8PyBzdHJpbmctY2k9PyBzdHJpbmctY2k+PT8gc3RyaW5nLWNpPj8gc3RyaW5nLWNvcHkgJ1xuICAgICAgKyAnc3RyaW5nLWZpbGwhIHN0cmluZy1sZW5ndGggc3RyaW5nLXJlZiBzdHJpbmctc2V0ISBzdHJpbmc8PT8gc3RyaW5nPD8gJ1xuICAgICAgKyAnc3RyaW5nPT8gc3RyaW5nPj0/IHN0cmluZz4/IHN0cmluZz8gc3Vic3RyaW5nIHN5bWJvbC0+c3RyaW5nIHN5bWJvbD8gJ1xuICAgICAgKyAndGFuIHRyYW5zY3JpcHQtb2ZmIHRyYW5zY3JpcHQtb24gdHJ1bmNhdGUgdmFsdWVzIHZlY3RvciAnXG4gICAgICArICd2ZWN0b3ItPmxpc3QgdmVjdG9yLWZpbGwhIHZlY3Rvci1sZW5ndGggdmVjdG9yLXJlZiB2ZWN0b3Itc2V0ISAnXG4gICAgICArICd3aXRoLWlucHV0LWZyb20tZmlsZSB3aXRoLW91dHB1dC10by1maWxlIHdyaXRlIHdyaXRlLWNoYXIgemVybz8nXG4gIH07XG5cbiAgY29uc3QgTElURVJBTCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICBiZWdpbjogJygjdHwjZnwjXFxcXFxcXFwnICsgU0NIRU1FX0lERU5UX1JFICsgJ3wjXFxcXFxcXFwuKSdcbiAgfTtcblxuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogU0NIRU1FX1NJTVBMRV9OVU1CRVJfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IFNDSEVNRV9DT01QTEVYX05VTUJFUl9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgeyBiZWdpbjogJyNiWzAtMV0rKC9bMC0xXSspPycgfSxcbiAgICAgIHsgYmVnaW46ICcjb1swLTddKygvWzAtN10rKT8nIH0sXG4gICAgICB7IGJlZ2luOiAnI3hbMC05YS1mXSsoL1swLTlhLWZdKyk/JyB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IFNUUklORyA9IGhsanMuUVVPVEVfU1RSSU5HX01PREU7XG5cbiAgY29uc3QgQ09NTUVOVF9NT0RFUyA9IFtcbiAgICBobGpzLkNPTU1FTlQoXG4gICAgICAnOycsXG4gICAgICAnJCcsXG4gICAgICB7IHJlbGV2YW5jZTogMCB9XG4gICAgKSxcbiAgICBobGpzLkNPTU1FTlQoJyNcXFxcfCcsICdcXFxcfCMnKVxuICBdO1xuXG4gIGNvbnN0IElERU5UID0ge1xuICAgIGJlZ2luOiBTQ0hFTUVfSURFTlRfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgUVVPVEVEX0lERU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgYmVnaW46ICdcXCcnICsgU0NIRU1FX0lERU5UX1JFXG4gIH07XG5cbiAgY29uc3QgQk9EWSA9IHtcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBRVU9URURfTElTVCA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogLycvIH0sXG4gICAgICB7IGJlZ2luOiAnYCcgfVxuICAgIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcKCcsXG4gICAgICAgIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgTElURVJBTCxcbiAgICAgICAgICBTVFJJTkcsXG4gICAgICAgICAgTlVNQkVSLFxuICAgICAgICAgIElERU5ULFxuICAgICAgICAgIFFVT1RFRF9JREVOVFxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IE5BTUUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbmFtZScsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGJlZ2luOiBTQ0hFTUVfSURFTlRfUkUsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTXG4gIH07XG5cbiAgY29uc3QgTEFNQkRBID0ge1xuICAgIGJlZ2luOiAvbGFtYmRhLyxcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAgTkFNRSxcbiAgICAgIHtcbiAgICAgICAgZW5kc1BhcmVudDogdHJ1ZSxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgICAgICBlbmQ6IC9cXCkvXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1xcWy8sXG4gICAgICAgICAgICBlbmQ6IC9cXF0vXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBjb250YWluczogWyBJREVOVCBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IExJU1QgPSB7XG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcKCcsXG4gICAgICAgIGVuZDogJ1xcXFwpJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcWycsXG4gICAgICAgIGVuZDogJ1xcXFxdJ1xuICAgICAgfVxuICAgIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIExBTUJEQSxcbiAgICAgIE5BTUUsXG4gICAgICBCT0RZXG4gICAgXVxuICB9O1xuXG4gIEJPRFkuY29udGFpbnMgPSBbXG4gICAgTElURVJBTCxcbiAgICBOVU1CRVIsXG4gICAgU1RSSU5HLFxuICAgIElERU5ULFxuICAgIFFVT1RFRF9JREVOVCxcbiAgICBRVU9URURfTElTVCxcbiAgICBMSVNUXG4gIF0uY29uY2F0KENPTU1FTlRfTU9ERVMpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1NjaGVtZScsXG4gICAgYWxpYXNlczogWydzY20nXSxcbiAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5TSEVCQU5HKCksXG4gICAgICBOVU1CRVIsXG4gICAgICBTVFJJTkcsXG4gICAgICBRVU9URURfSURFTlQsXG4gICAgICBRVU9URURfTElTVCxcbiAgICAgIExJU1RcbiAgICBdLmNvbmNhdChDT01NRU5UX01PREVTKVxuICB9O1xufVxuXG5leHBvcnQgeyBzY2hlbWUgYXMgZGVmYXVsdCB9O1xuIl19