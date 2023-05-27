function lasso(hljs) {
    const LASSO_IDENT_RE = '[a-zA-Z_][\\w.]*';
    const LASSO_ANGLE_RE = '<\\?(lasso(script)?|=)';
    const LASSO_CLOSE_RE = '\\]|\\?>';
    const LASSO_KEYWORDS = {
        $pattern: LASSO_IDENT_RE + '|&[lg]t;',
        literal: 'true false none minimal full all void and or not '
            + 'bw nbw ew new cn ncn lt lte gt gte eq neq rx nrx ft',
        built_in: 'array date decimal duration integer map pair string tag xml null '
            + 'boolean bytes keyword list locale queue set stack staticarray '
            + 'local var variable global data self inherited currentcapture givenblock',
        keyword: 'cache database_names database_schemanames database_tablenames '
            + 'define_tag define_type email_batch encode_set html_comment handle '
            + 'handle_error header if inline iterate ljax_target link '
            + 'link_currentaction link_currentgroup link_currentrecord link_detail '
            + 'link_firstgroup link_firstrecord link_lastgroup link_lastrecord '
            + 'link_nextgroup link_nextrecord link_prevgroup link_prevrecord log '
            + 'loop namespace_using output_none portal private protect records '
            + 'referer referrer repeating resultset rows search_args '
            + 'search_arguments select sort_args sort_arguments thread_atomic '
            + 'value_list while abort case else fail_if fail_ifnot fail if_empty '
            + 'if_false if_null if_true loop_abort loop_continue loop_count params '
            + 'params_up return return_value run_children soap_definetag '
            + 'soap_lastrequest soap_lastresponse tag_name ascending average by '
            + 'define descending do equals frozen group handle_failure import in '
            + 'into join let match max min on order parent protected provide public '
            + 'require returnhome skip split_thread sum take thread to trait type '
            + 'where with yield yieldhome'
    };
    const HTML_COMMENT = hljs.COMMENT('<!--', '-->', { relevance: 0 });
    const LASSO_NOPROCESS = {
        className: 'meta',
        begin: '\\[noprocess\\]',
        starts: {
            end: '\\[/noprocess\\]',
            returnEnd: true,
            contains: [HTML_COMMENT]
        }
    };
    const LASSO_START = {
        className: 'meta',
        begin: '\\[/noprocess|' + LASSO_ANGLE_RE
    };
    const LASSO_DATAMEMBER = {
        className: 'symbol',
        begin: '\'' + LASSO_IDENT_RE + '\''
    };
    const LASSO_CODE = [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.inherit(hljs.C_NUMBER_MODE, { begin: hljs.C_NUMBER_RE + '|(-?infinity|NaN)\\b' }),
        hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null }),
        hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null }),
        {
            className: 'string',
            begin: '`',
            end: '`'
        },
        {
            variants: [
                { begin: '[#$]' + LASSO_IDENT_RE },
                {
                    begin: '#',
                    end: '\\d+',
                    illegal: '\\W'
                }
            ]
        },
        {
            className: 'type',
            begin: '::\\s*',
            end: LASSO_IDENT_RE,
            illegal: '\\W'
        },
        {
            className: 'params',
            variants: [
                {
                    begin: '-(?!infinity)' + LASSO_IDENT_RE,
                    relevance: 0
                },
                { begin: '(\\.\\.\\.)' }
            ]
        },
        {
            begin: /(->|\.)\s*/,
            relevance: 0,
            contains: [LASSO_DATAMEMBER]
        },
        {
            className: 'class',
            beginKeywords: 'define',
            returnEnd: true,
            end: '\\(|=>',
            contains: [hljs.inherit(hljs.TITLE_MODE, { begin: LASSO_IDENT_RE + '(=(?!>))?|[-+*/%](?!>)' })]
        }
    ];
    return {
        name: 'Lasso',
        aliases: [
            'ls',
            'lassoscript'
        ],
        case_insensitive: true,
        keywords: LASSO_KEYWORDS,
        contains: [
            {
                className: 'meta',
                begin: LASSO_CLOSE_RE,
                relevance: 0,
                starts: {
                    end: '\\[|' + LASSO_ANGLE_RE,
                    returnEnd: true,
                    relevance: 0,
                    contains: [HTML_COMMENT]
                }
            },
            LASSO_NOPROCESS,
            LASSO_START,
            {
                className: 'meta',
                begin: '\\[no_square_brackets',
                starts: {
                    end: '\\[/no_square_brackets\\]',
                    keywords: LASSO_KEYWORDS,
                    contains: [
                        {
                            className: 'meta',
                            begin: LASSO_CLOSE_RE,
                            relevance: 0,
                            starts: {
                                end: '\\[noprocess\\]|' + LASSO_ANGLE_RE,
                                returnEnd: true,
                                contains: [HTML_COMMENT]
                            }
                        },
                        LASSO_NOPROCESS,
                        LASSO_START
                    ].concat(LASSO_CODE)
                }
            },
            {
                className: 'meta',
                begin: '\\[',
                relevance: 0
            },
            {
                className: 'meta',
                begin: '^#!',
                end: 'lasso9$',
                relevance: 10
            }
        ].concat(LASSO_CODE)
    };
}
export { lasso as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFzc28uanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9sYXNzby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDO0lBQzFDLE1BQU0sY0FBYyxHQUFHLHdCQUF3QixDQUFDO0lBQ2hELE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxNQUFNLGNBQWMsR0FBRztRQUNyQixRQUFRLEVBQUUsY0FBYyxHQUFHLFVBQVU7UUFDckMsT0FBTyxFQUNMLG1EQUFtRDtjQUNqRCxxREFBcUQ7UUFDekQsUUFBUSxFQUNOLG1FQUFtRTtjQUNqRSxnRUFBZ0U7Y0FDaEUseUVBQXlFO1FBQzdFLE9BQU8sRUFDTCxnRUFBZ0U7Y0FDOUQsb0VBQW9FO2NBQ3BFLHlEQUF5RDtjQUN6RCxzRUFBc0U7Y0FDdEUsa0VBQWtFO2NBQ2xFLG9FQUFvRTtjQUNwRSxrRUFBa0U7Y0FDbEUsd0RBQXdEO2NBQ3hELGlFQUFpRTtjQUNqRSxvRUFBb0U7Y0FDcEUsc0VBQXNFO2NBQ3RFLDREQUE0RDtjQUM1RCxtRUFBbUU7Y0FDbkUsb0VBQW9FO2NBQ3BFLHVFQUF1RTtjQUN2RSxxRUFBcUU7Y0FDckUsNEJBQTRCO0tBQ2pDLENBQUM7SUFDRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUMvQixNQUFNLEVBQ04sS0FBSyxFQUNMLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUNqQixDQUFDO0lBQ0YsTUFBTSxlQUFlLEdBQUc7UUFDdEIsU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixNQUFNLEVBQUU7WUFDTixHQUFHLEVBQUUsa0JBQWtCO1lB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QkFDUjs0QkFDRSxTQUFTLEVBQUUsTUFBTTs0QkFDakIsS0FBSyxFQUFFLGNBQWM7NEJBQ3JCLFNBQVMsRUFBRSxDQUFDOzRCQUNaLE1BQU0sRUFBRTtnQ0FDTixHQUFHLEVBQUUsa0JBQWtCLEdBQUcsY0FBYztnQ0FDeEMsU0FBUyxFQUFFLElBQUk7Z0NBQ2YsUUFBUSxFQUFFLENBQUUsWUFBWSxDQUFFOzZCQUMzQjt5QkFDRjt3QkFDRCxlQUFlO3dCQUNmLFdBQVc7cUJBQ1osQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2lCQUNyQjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxLQUFLO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsU0FBUyxFQUFFLEVBQUU7YUFDZDtTQUNGLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztLQUNyQixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxLQUFLLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IExhc3NvXG5BdXRob3I6IEVyaWMgS25pYmJlIDxlcmljQGxhc3Nvc29mdC5jb20+XG5EZXNjcmlwdGlvbjogTGFzc28gaXMgYSBsYW5ndWFnZSBhbmQgc2VydmVyIHBsYXRmb3JtIGZvciBkYXRhYmFzZS1kcml2ZW4gd2ViIGFwcGxpY2F0aW9ucy4gVGhpcyBkZWZpbml0aW9uIGhhbmRsZXMgTGFzc28gOSBzeW50YXggYW5kIExhc3NvU2NyaXB0IGZvciBMYXNzbyA4LjYgYW5kIGVhcmxpZXIuXG5XZWJzaXRlOiBodHRwOi8vd3d3Lmxhc3Nvc29mdC5jb20vV2hhdC1Jcy1MYXNzb1xuKi9cblxuZnVuY3Rpb24gbGFzc28oaGxqcykge1xuICBjb25zdCBMQVNTT19JREVOVF9SRSA9ICdbYS16QS1aX11bXFxcXHcuXSonO1xuICBjb25zdCBMQVNTT19BTkdMRV9SRSA9ICc8XFxcXD8obGFzc28oc2NyaXB0KT98PSknO1xuICBjb25zdCBMQVNTT19DTE9TRV9SRSA9ICdcXFxcXXxcXFxcPz4nO1xuICBjb25zdCBMQVNTT19LRVlXT1JEUyA9IHtcbiAgICAkcGF0dGVybjogTEFTU09fSURFTlRfUkUgKyAnfCZbbGdddDsnLFxuICAgIGxpdGVyYWw6XG4gICAgICAndHJ1ZSBmYWxzZSBub25lIG1pbmltYWwgZnVsbCBhbGwgdm9pZCBhbmQgb3Igbm90ICdcbiAgICAgICsgJ2J3IG5idyBldyBuZXcgY24gbmNuIGx0IGx0ZSBndCBndGUgZXEgbmVxIHJ4IG5yeCBmdCcsXG4gICAgYnVpbHRfaW46XG4gICAgICAnYXJyYXkgZGF0ZSBkZWNpbWFsIGR1cmF0aW9uIGludGVnZXIgbWFwIHBhaXIgc3RyaW5nIHRhZyB4bWwgbnVsbCAnXG4gICAgICArICdib29sZWFuIGJ5dGVzIGtleXdvcmQgbGlzdCBsb2NhbGUgcXVldWUgc2V0IHN0YWNrIHN0YXRpY2FycmF5ICdcbiAgICAgICsgJ2xvY2FsIHZhciB2YXJpYWJsZSBnbG9iYWwgZGF0YSBzZWxmIGluaGVyaXRlZCBjdXJyZW50Y2FwdHVyZSBnaXZlbmJsb2NrJyxcbiAgICBrZXl3b3JkOlxuICAgICAgJ2NhY2hlIGRhdGFiYXNlX25hbWVzIGRhdGFiYXNlX3NjaGVtYW5hbWVzIGRhdGFiYXNlX3RhYmxlbmFtZXMgJ1xuICAgICAgKyAnZGVmaW5lX3RhZyBkZWZpbmVfdHlwZSBlbWFpbF9iYXRjaCBlbmNvZGVfc2V0IGh0bWxfY29tbWVudCBoYW5kbGUgJ1xuICAgICAgKyAnaGFuZGxlX2Vycm9yIGhlYWRlciBpZiBpbmxpbmUgaXRlcmF0ZSBsamF4X3RhcmdldCBsaW5rICdcbiAgICAgICsgJ2xpbmtfY3VycmVudGFjdGlvbiBsaW5rX2N1cnJlbnRncm91cCBsaW5rX2N1cnJlbnRyZWNvcmQgbGlua19kZXRhaWwgJ1xuICAgICAgKyAnbGlua19maXJzdGdyb3VwIGxpbmtfZmlyc3RyZWNvcmQgbGlua19sYXN0Z3JvdXAgbGlua19sYXN0cmVjb3JkICdcbiAgICAgICsgJ2xpbmtfbmV4dGdyb3VwIGxpbmtfbmV4dHJlY29yZCBsaW5rX3ByZXZncm91cCBsaW5rX3ByZXZyZWNvcmQgbG9nICdcbiAgICAgICsgJ2xvb3AgbmFtZXNwYWNlX3VzaW5nIG91dHB1dF9ub25lIHBvcnRhbCBwcml2YXRlIHByb3RlY3QgcmVjb3JkcyAnXG4gICAgICArICdyZWZlcmVyIHJlZmVycmVyIHJlcGVhdGluZyByZXN1bHRzZXQgcm93cyBzZWFyY2hfYXJncyAnXG4gICAgICArICdzZWFyY2hfYXJndW1lbnRzIHNlbGVjdCBzb3J0X2FyZ3Mgc29ydF9hcmd1bWVudHMgdGhyZWFkX2F0b21pYyAnXG4gICAgICArICd2YWx1ZV9saXN0IHdoaWxlIGFib3J0IGNhc2UgZWxzZSBmYWlsX2lmIGZhaWxfaWZub3QgZmFpbCBpZl9lbXB0eSAnXG4gICAgICArICdpZl9mYWxzZSBpZl9udWxsIGlmX3RydWUgbG9vcF9hYm9ydCBsb29wX2NvbnRpbnVlIGxvb3BfY291bnQgcGFyYW1zICdcbiAgICAgICsgJ3BhcmFtc191cCByZXR1cm4gcmV0dXJuX3ZhbHVlIHJ1bl9jaGlsZHJlbiBzb2FwX2RlZmluZXRhZyAnXG4gICAgICArICdzb2FwX2xhc3RyZXF1ZXN0IHNvYXBfbGFzdHJlc3BvbnNlIHRhZ19uYW1lIGFzY2VuZGluZyBhdmVyYWdlIGJ5ICdcbiAgICAgICsgJ2RlZmluZSBkZXNjZW5kaW5nIGRvIGVxdWFscyBmcm96ZW4gZ3JvdXAgaGFuZGxlX2ZhaWx1cmUgaW1wb3J0IGluICdcbiAgICAgICsgJ2ludG8gam9pbiBsZXQgbWF0Y2ggbWF4IG1pbiBvbiBvcmRlciBwYXJlbnQgcHJvdGVjdGVkIHByb3ZpZGUgcHVibGljICdcbiAgICAgICsgJ3JlcXVpcmUgcmV0dXJuaG9tZSBza2lwIHNwbGl0X3RocmVhZCBzdW0gdGFrZSB0aHJlYWQgdG8gdHJhaXQgdHlwZSAnXG4gICAgICArICd3aGVyZSB3aXRoIHlpZWxkIHlpZWxkaG9tZSdcbiAgfTtcbiAgY29uc3QgSFRNTF9DT01NRU5UID0gaGxqcy5DT01NRU5UKFxuICAgICc8IS0tJyxcbiAgICAnLS0+JyxcbiAgICB7IHJlbGV2YW5jZTogMCB9XG4gICk7XG4gIGNvbnN0IExBU1NPX05PUFJPQ0VTUyA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBiZWdpbjogJ1xcXFxbbm9wcm9jZXNzXFxcXF0nLFxuICAgIHN0YXJ0czoge1xuICAgICAgZW5kOiAnXFxcXFsvbm9wcm9jZXNzXFxcXF0nLFxuICAgICAgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgY29udGFpbnM6IFsgSFRNTF9DT01NRU5UIF1cbiAgICB9XG4gIH07XG4gIGNvbnN0IExBU1NPX1NUQVJUID0ge1xuICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgIGJlZ2luOiAnXFxcXFsvbm9wcm9jZXNzfCcgKyBMQVNTT19BTkdMRV9SRVxuICB9O1xuICBjb25zdCBMQVNTT19EQVRBTUVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgYmVnaW46ICdcXCcnICsgTEFTU09fSURFTlRfUkUgKyAnXFwnJ1xuICB9O1xuICBjb25zdCBMQVNTT19DT0RFID0gW1xuICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgIGhsanMuaW5oZXJpdChobGpzLkNfTlVNQkVSX01PREUsIHsgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUgKyAnfCgtP2luZmluaXR5fE5hTilcXFxcYicgfSksXG4gICAgaGxqcy5pbmhlcml0KGhsanMuQVBPU19TVFJJTkdfTU9ERSwgeyBpbGxlZ2FsOiBudWxsIH0pLFxuICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7IGlsbGVnYWw6IG51bGwgfSksXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnYCcsXG4gICAgICBlbmQ6ICdgJ1xuICAgIH0sXG4gICAgeyAvLyB2YXJpYWJsZXNcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHsgYmVnaW46ICdbIyRdJyArIExBU1NPX0lERU5UX1JFIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogJyMnLFxuICAgICAgICAgIGVuZDogJ1xcXFxkKycsXG4gICAgICAgICAgaWxsZWdhbDogJ1xcXFxXJ1xuICAgICAgICB9XG4gICAgICBdIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICBiZWdpbjogJzo6XFxcXHMqJyxcbiAgICAgIGVuZDogTEFTU09fSURFTlRfUkUsXG4gICAgICBpbGxlZ2FsOiAnXFxcXFcnXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAnLSg/IWluZmluaXR5KScgKyBMQVNTT19JREVOVF9SRSxcbiAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgfSxcbiAgICAgICAgeyBiZWdpbjogJyhcXFxcLlxcXFwuXFxcXC4pJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBiZWdpbjogLygtPnxcXC4pXFxzKi8sXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBjb250YWluczogWyBMQVNTT19EQVRBTUVNQkVSIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgIGJlZ2luS2V5d29yZHM6ICdkZWZpbmUnLFxuICAgICAgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgZW5kOiAnXFxcXCh8PT4nLFxuICAgICAgY29udGFpbnM6IFsgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwgeyBiZWdpbjogTEFTU09fSURFTlRfUkUgKyAnKD0oPyE+KSk/fFstKyovJV0oPyE+KScgfSkgXVxuICAgIH1cbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnTGFzc28nLFxuICAgIGFsaWFzZXM6IFtcbiAgICAgICdscycsXG4gICAgICAnbGFzc29zY3JpcHQnXG4gICAgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiBMQVNTT19LRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46IExBU1NPX0NMT1NFX1JFLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIHN0YXJ0czogeyAvLyBtYXJrdXBcbiAgICAgICAgICBlbmQ6ICdcXFxcW3wnICsgTEFTU09fQU5HTEVfUkUsXG4gICAgICAgICAgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICBjb250YWluczogWyBIVE1MX0NPTU1FTlQgXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgTEFTU09fTk9QUk9DRVNTLFxuICAgICAgTEFTU09fU1RBUlQsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ1xcXFxbbm9fc3F1YXJlX2JyYWNrZXRzJyxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnXFxcXFsvbm9fc3F1YXJlX2JyYWNrZXRzXFxcXF0nLCAvLyBub3QgaW1wbGVtZW50ZWQgaW4gdGhlIGxhbmd1YWdlXG4gICAgICAgICAga2V5d29yZHM6IExBU1NPX0tFWVdPUkRTLFxuICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICAgICAgICBiZWdpbjogTEFTU09fQ0xPU0VfUkUsXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgICAgICAgZW5kOiAnXFxcXFtub3Byb2Nlc3NcXFxcXXwnICsgTEFTU09fQU5HTEVfUkUsXG4gICAgICAgICAgICAgICAgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbIEhUTUxfQ09NTUVOVCBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBMQVNTT19OT1BST0NFU1MsXG4gICAgICAgICAgICBMQVNTT19TVEFSVFxuICAgICAgICAgIF0uY29uY2F0KExBU1NPX0NPREUpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ1xcXFxbJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46ICdeIyEnLFxuICAgICAgICBlbmQ6ICdsYXNzbzkkJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfVxuICAgIF0uY29uY2F0KExBU1NPX0NPREUpXG4gIH07XG59XG5cbmV4cG9ydCB7IGxhc3NvIGFzIGRlZmF1bHQgfTtcbiJdfQ==