function gams(hljs) {
    const regex = hljs.regex;
    const KEYWORDS = {
        keyword: 'abort acronym acronyms alias all and assign binary card diag display '
            + 'else eq file files for free ge gt if integer le loop lt maximizing '
            + 'minimizing model models ne negative no not option options or ord '
            + 'positive prod put putpage puttl repeat sameas semicont semiint smax '
            + 'smin solve sos1 sos2 sum system table then until using while xor yes',
        literal: 'eps inf na',
        built_in: 'abs arccos arcsin arctan arctan2 Beta betaReg binomial ceil centropy '
            + 'cos cosh cvPower div div0 eDist entropy errorf execSeed exp fact '
            + 'floor frac gamma gammaReg log logBeta logGamma log10 log2 mapVal max '
            + 'min mod ncpCM ncpF ncpVUpow ncpVUsin normal pi poly power '
            + 'randBinomial randLinear randTriangle round rPower sigmoid sign '
            + 'signPower sin sinh slexp sllog10 slrec sqexp sqlog10 sqr sqrec sqrt '
            + 'tan tanh trunc uniform uniformInt vcPower bool_and bool_eqv bool_imp '
            + 'bool_not bool_or bool_xor ifThen rel_eq rel_ge rel_gt rel_le rel_lt '
            + 'rel_ne gday gdow ghour gleap gmillisec gminute gmonth gsecond gyear '
            + 'jdate jnow jstart jtime errorLevel execError gamsRelease gamsVersion '
            + 'handleCollect handleDelete handleStatus handleSubmit heapFree '
            + 'heapLimit heapSize jobHandle jobKill jobStatus jobTerminate '
            + 'licenseLevel licenseStatus maxExecError sleep timeClose timeComp '
            + 'timeElapsed timeExec timeStart'
    };
    const PARAMS = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true
    };
    const SYMBOLS = {
        className: 'symbol',
        variants: [
            { begin: /=[lgenxc]=/ },
            { begin: /\$/ }
        ]
    };
    const QSTR = {
        className: 'comment',
        variants: [
            {
                begin: '\'',
                end: '\''
            },
            {
                begin: '"',
                end: '"'
            }
        ],
        illegal: '\\n',
        contains: [hljs.BACKSLASH_ESCAPE]
    };
    const ASSIGNMENT = {
        begin: '/',
        end: '/',
        keywords: KEYWORDS,
        contains: [
            QSTR,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            hljs.C_NUMBER_MODE
        ]
    };
    const COMMENT_WORD = /[a-z0-9&#*=?@\\><:,()$[\]_.{}!+%^-]+/;
    const DESCTEXT = {
        begin: /[a-z][a-z0-9_]*(\([a-z0-9_, ]*\))?[ \t]+/,
        excludeBegin: true,
        end: '$',
        endsWithParent: true,
        contains: [
            QSTR,
            ASSIGNMENT,
            {
                className: 'comment',
                begin: regex.concat(COMMENT_WORD, regex.anyNumberOfTimes(regex.concat(/[ ]+/, COMMENT_WORD))),
                relevance: 0
            }
        ]
    };
    return {
        name: 'GAMS',
        aliases: ['gms'],
        case_insensitive: true,
        keywords: KEYWORDS,
        contains: [
            hljs.COMMENT(/^\$ontext/, /^\$offtext/),
            {
                className: 'meta',
                begin: '^\\$[a-z0-9]+',
                end: '$',
                returnBegin: true,
                contains: [
                    {
                        className: 'keyword',
                        begin: '^\\$[a-z0-9]+'
                    }
                ]
            },
            hljs.COMMENT('^\\*', '$'),
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            {
                beginKeywords: 'set sets parameter parameters variable variables '
                    + 'scalar scalars equation equations',
                end: ';',
                contains: [
                    hljs.COMMENT('^\\*', '$'),
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    ASSIGNMENT,
                    DESCTEXT
                ]
            },
            {
                beginKeywords: 'table',
                end: ';',
                returnBegin: true,
                contains: [
                    {
                        beginKeywords: 'table',
                        end: '$',
                        contains: [DESCTEXT]
                    },
                    hljs.COMMENT('^\\*', '$'),
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    hljs.C_NUMBER_MODE
                ]
            },
            {
                className: 'function',
                begin: /^[a-z][a-z0-9_,\-+' ()$]+\.{2}/,
                returnBegin: true,
                contains: [
                    {
                        className: 'title',
                        begin: /^[a-z0-9_]+/
                    },
                    PARAMS,
                    SYMBOLS
                ]
            },
            hljs.C_NUMBER_MODE,
            SYMBOLS
        ]
    };
}
export { gams as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Ftcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2dhbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsT0FBTyxFQUNMLHVFQUF1RTtjQUNyRSxxRUFBcUU7Y0FDckUsbUVBQW1FO2NBQ25FLHNFQUFzRTtjQUN0RSxzRUFBc0U7UUFDMUUsT0FBTyxFQUNMLFlBQVk7UUFDZCxRQUFRLEVBQ04sdUVBQXVFO2NBQ3JFLG1FQUFtRTtjQUNuRSx1RUFBdUU7Y0FDdkUsNERBQTREO2NBQzVELGlFQUFpRTtjQUNqRSxzRUFBc0U7Y0FDdEUsdUVBQXVFO2NBQ3ZFLHNFQUFzRTtjQUN0RSxzRUFBc0U7Y0FDdEUsdUVBQXVFO2NBQ3ZFLGdFQUFnRTtjQUNoRSw4REFBOEQ7Y0FDOUQsbUVBQW1FO2NBQ25FLGdDQUFnQztLQUNyQyxDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsSUFBSTtRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsWUFBWSxFQUFFLElBQUk7UUFDbEIsVUFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHO1FBQ2QsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3ZCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUNoQjtLQUNGLENBQUM7SUFDRixNQUFNLElBQUksR0FBRztRQUNYLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLEtBQUssRUFBRSxJQUFJO2dCQUNYLEdBQUcsRUFBRSxJQUFJO2FBQ1Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRzthQUNUO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsS0FBSztRQUNkLFFBQVEsRUFBRSxDQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRTtLQUNwQyxDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQUc7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRTtZQUNSLElBQUk7WUFDSixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsZ0JBQWdCO1lBQ3JCLElBQUksQ0FBQyxhQUFhO1NBQ25CO0tBQ0YsQ0FBQztJQUNGLE1BQU0sWUFBWSxHQUFHLHNDQUFzQyxDQUFDO0lBQzVELE1BQU0sUUFBUSxHQUFHO1FBQ2YsS0FBSyxFQUFFLDBDQUEwQztRQUNqRCxZQUFZLEVBQUUsSUFBSTtRQUNsQixHQUFHLEVBQUUsR0FBRztRQUNSLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFFBQVEsRUFBRTtZQUNSLElBQUk7WUFDSixVQUFVO1lBQ1Y7Z0JBQ0UsU0FBUyxFQUFFLFNBQVM7Z0JBRXBCLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUNqQixZQUFZLEVBRVosS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQzNEO2dCQUNELFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsQ0FBRSxLQUFLLENBQUU7UUFDbEIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUM7WUFDdkM7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxlQUFlO2dCQUN0QixHQUFHLEVBQUUsR0FBRztnQkFDUixXQUFXLEVBQUUsSUFBSTtnQkFDakIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixLQUFLLEVBQUUsZUFBZTtxQkFDdkI7aUJBQ0Y7YUFDRjtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztZQUN6QixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsZ0JBQWdCO1lBRXJCO2dCQUNFLGFBQWEsRUFDWCxtREFBbUQ7c0JBQ2pELG1DQUFtQztnQkFDdkMsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFO29CQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztvQkFDekIsSUFBSSxDQUFDLG1CQUFtQjtvQkFDeEIsSUFBSSxDQUFDLG9CQUFvQjtvQkFDekIsSUFBSSxDQUFDLGlCQUFpQjtvQkFDdEIsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckIsVUFBVTtvQkFDVixRQUFRO2lCQUNUO2FBQ0Y7WUFDRDtnQkFDRSxhQUFhLEVBQUUsT0FBTztnQkFDdEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxhQUFhLEVBQUUsT0FBTzt3QkFDdEIsR0FBRyxFQUFFLEdBQUc7d0JBQ1IsUUFBUSxFQUFFLENBQUUsUUFBUSxDQUFFO3FCQUN2QjtvQkFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxtQkFBbUI7b0JBQ3hCLElBQUksQ0FBQyxvQkFBb0I7b0JBQ3pCLElBQUksQ0FBQyxpQkFBaUI7b0JBQ3RCLElBQUksQ0FBQyxnQkFBZ0I7b0JBQ3JCLElBQUksQ0FBQyxhQUFhO2lCQUVuQjthQUNGO1lBRUQ7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLEtBQUssRUFBRSxnQ0FBZ0M7Z0JBQ3ZDLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLEtBQUssRUFBRSxhQUFhO3FCQUNyQjtvQkFDRCxNQUFNO29CQUNOLE9BQU87aUJBQ1I7YUFDRjtZQUNELElBQUksQ0FBQyxhQUFhO1lBQ2xCLE9BQU87U0FDUjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gTGFuZ3VhZ2U6IEdBTVNcbiBBdXRob3I6IFN0ZWZhbiBCZWNoZXJ0IDxzdGVmYW4uYmVjaGVydEBnbXgubmV0PlxuIENvbnRyaWJ1dG9yczogT2xlZyBFZmltb3YgPGVmaW1vdm92QGdtYWlsLmNvbT4sIE1pa2tvIEtvdWhpYSA8bWlra28ua291aGlhQGlraS5maT5cbiBEZXNjcmlwdGlvbjogVGhlIEdlbmVyYWwgQWxnZWJyYWljIE1vZGVsaW5nIFN5c3RlbSBsYW5ndWFnZVxuIFdlYnNpdGU6IGh0dHBzOi8vd3d3LmdhbXMuY29tXG4gQ2F0ZWdvcnk6IHNjaWVudGlmaWNcbiAqL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZ2FtcyhobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgICdhYm9ydCBhY3JvbnltIGFjcm9ueW1zIGFsaWFzIGFsbCBhbmQgYXNzaWduIGJpbmFyeSBjYXJkIGRpYWcgZGlzcGxheSAnXG4gICAgICArICdlbHNlIGVxIGZpbGUgZmlsZXMgZm9yIGZyZWUgZ2UgZ3QgaWYgaW50ZWdlciBsZSBsb29wIGx0IG1heGltaXppbmcgJ1xuICAgICAgKyAnbWluaW1pemluZyBtb2RlbCBtb2RlbHMgbmUgbmVnYXRpdmUgbm8gbm90IG9wdGlvbiBvcHRpb25zIG9yIG9yZCAnXG4gICAgICArICdwb3NpdGl2ZSBwcm9kIHB1dCBwdXRwYWdlIHB1dHRsIHJlcGVhdCBzYW1lYXMgc2VtaWNvbnQgc2VtaWludCBzbWF4ICdcbiAgICAgICsgJ3NtaW4gc29sdmUgc29zMSBzb3MyIHN1bSBzeXN0ZW0gdGFibGUgdGhlbiB1bnRpbCB1c2luZyB3aGlsZSB4b3IgeWVzJyxcbiAgICBsaXRlcmFsOlxuICAgICAgJ2VwcyBpbmYgbmEnLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ2FicyBhcmNjb3MgYXJjc2luIGFyY3RhbiBhcmN0YW4yIEJldGEgYmV0YVJlZyBiaW5vbWlhbCBjZWlsIGNlbnRyb3B5ICdcbiAgICAgICsgJ2NvcyBjb3NoIGN2UG93ZXIgZGl2IGRpdjAgZURpc3QgZW50cm9weSBlcnJvcmYgZXhlY1NlZWQgZXhwIGZhY3QgJ1xuICAgICAgKyAnZmxvb3IgZnJhYyBnYW1tYSBnYW1tYVJlZyBsb2cgbG9nQmV0YSBsb2dHYW1tYSBsb2cxMCBsb2cyIG1hcFZhbCBtYXggJ1xuICAgICAgKyAnbWluIG1vZCBuY3BDTSBuY3BGIG5jcFZVcG93IG5jcFZVc2luIG5vcm1hbCBwaSBwb2x5IHBvd2VyICdcbiAgICAgICsgJ3JhbmRCaW5vbWlhbCByYW5kTGluZWFyIHJhbmRUcmlhbmdsZSByb3VuZCByUG93ZXIgc2lnbW9pZCBzaWduICdcbiAgICAgICsgJ3NpZ25Qb3dlciBzaW4gc2luaCBzbGV4cCBzbGxvZzEwIHNscmVjIHNxZXhwIHNxbG9nMTAgc3FyIHNxcmVjIHNxcnQgJ1xuICAgICAgKyAndGFuIHRhbmggdHJ1bmMgdW5pZm9ybSB1bmlmb3JtSW50IHZjUG93ZXIgYm9vbF9hbmQgYm9vbF9lcXYgYm9vbF9pbXAgJ1xuICAgICAgKyAnYm9vbF9ub3QgYm9vbF9vciBib29sX3hvciBpZlRoZW4gcmVsX2VxIHJlbF9nZSByZWxfZ3QgcmVsX2xlIHJlbF9sdCAnXG4gICAgICArICdyZWxfbmUgZ2RheSBnZG93IGdob3VyIGdsZWFwIGdtaWxsaXNlYyBnbWludXRlIGdtb250aCBnc2Vjb25kIGd5ZWFyICdcbiAgICAgICsgJ2pkYXRlIGpub3cganN0YXJ0IGp0aW1lIGVycm9yTGV2ZWwgZXhlY0Vycm9yIGdhbXNSZWxlYXNlIGdhbXNWZXJzaW9uICdcbiAgICAgICsgJ2hhbmRsZUNvbGxlY3QgaGFuZGxlRGVsZXRlIGhhbmRsZVN0YXR1cyBoYW5kbGVTdWJtaXQgaGVhcEZyZWUgJ1xuICAgICAgKyAnaGVhcExpbWl0IGhlYXBTaXplIGpvYkhhbmRsZSBqb2JLaWxsIGpvYlN0YXR1cyBqb2JUZXJtaW5hdGUgJ1xuICAgICAgKyAnbGljZW5zZUxldmVsIGxpY2Vuc2VTdGF0dXMgbWF4RXhlY0Vycm9yIHNsZWVwIHRpbWVDbG9zZSB0aW1lQ29tcCAnXG4gICAgICArICd0aW1lRWxhcHNlZCB0aW1lRXhlYyB0aW1lU3RhcnQnXG4gIH07XG4gIGNvbnN0IFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAvXFwoLyxcbiAgICBlbmQ6IC9cXCkvLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICBleGNsdWRlRW5kOiB0cnVlXG4gIH07XG4gIGNvbnN0IFNZTUJPTFMgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogLz1bbGdlbnhjXT0vIH0sXG4gICAgICB7IGJlZ2luOiAvXFwkLyB9XG4gICAgXVxuICB9O1xuICBjb25zdCBRU1RSID0geyAvLyBPbmUtbGluZSBxdW90ZWQgY29tbWVudCBzdHJpbmdcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcJycsXG4gICAgICAgIGVuZDogJ1xcJydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIidcbiAgICAgIH1cbiAgICBdLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgfTtcbiAgY29uc3QgQVNTSUdOTUVOVCA9IHtcbiAgICBiZWdpbjogJy8nLFxuICAgIGVuZDogJy8nLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgUVNUUixcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xuICBjb25zdCBDT01NRU5UX1dPUkQgPSAvW2EtejAtOSYjKj0/QFxcXFw+PDosKCkkW1xcXV8ue30hKyVeLV0rLztcbiAgY29uc3QgREVTQ1RFWFQgPSB7IC8vIFBhcmFtZXRlci9zZXQvdmFyaWFibGUgZGVzY3JpcHRpb24gdGV4dFxuICAgIGJlZ2luOiAvW2Etel1bYS16MC05X10qKFxcKFthLXowLTlfLCBdKlxcKSk/WyBcXHRdKy8sXG4gICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgIGVuZDogJyQnLFxuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBRU1RSLFxuICAgICAgQVNTSUdOTUVOVCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIC8vIG9uZSBjb21tZW50IHdvcmQsIHRoZW4gcG9zc2libHkgbW9yZVxuICAgICAgICBiZWdpbjogcmVnZXguY29uY2F0KFxuICAgICAgICAgIENPTU1FTlRfV09SRCxcbiAgICAgICAgICAvLyBbIF0gYmVjYXVzZSBcXHMgd291bGQgYmUgdG9vIGJyb2FkIChtYXRjaGluZyBuZXdsaW5lcylcbiAgICAgICAgICByZWdleC5hbnlOdW1iZXJPZlRpbWVzKHJlZ2V4LmNvbmNhdCgvWyBdKy8sIENPTU1FTlRfV09SRCkpXG4gICAgICAgICksXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdHQU1TJyxcbiAgICBhbGlhc2VzOiBbICdnbXMnIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ09NTUVOVCgvXlxcJG9udGV4dC8sIC9eXFwkb2ZmdGV4dC8pLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCRbYS16MC05XSsnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgICAgICBiZWdpbjogJ15cXFxcJFthLXowLTldKydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNPTU1FTlQoJ15cXFxcKicsICckJyksXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIC8vIERlY2xhcmF0aW9uc1xuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOlxuICAgICAgICAgICdzZXQgc2V0cyBwYXJhbWV0ZXIgcGFyYW1ldGVycyB2YXJpYWJsZSB2YXJpYWJsZXMgJ1xuICAgICAgICAgICsgJ3NjYWxhciBzY2FsYXJzIGVxdWF0aW9uIGVxdWF0aW9ucycsXG4gICAgICAgIGVuZDogJzsnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ09NTUVOVCgnXlxcXFwqJywgJyQnKSxcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICBBU1NJR05NRU5ULFxuICAgICAgICAgIERFU0NURVhUXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7IC8vIHRhYmxlIGVudmlyb25tZW50XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICd0YWJsZScsXG4gICAgICAgIGVuZDogJzsnLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7IC8vIHRhYmxlIGhlYWRlciByb3dcbiAgICAgICAgICAgIGJlZ2luS2V5d29yZHM6ICd0YWJsZScsXG4gICAgICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbIERFU0NURVhUIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGhsanMuQ09NTUVOVCgnXlxcXFwqJywgJyQnKSxcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgICAgICAgICAvLyBUYWJsZSBkb2VzIG5vdCBjb250YWluIERFU0NURVhUIG9yIEFTU0lHTk1FTlRcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIEZ1bmN0aW9uIGRlZmluaXRpb25zXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW46IC9eW2Etel1bYS16MC05XyxcXC0rJyAoKSRdK1xcLnsyfS8sXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHsgLy8gRnVuY3Rpb24gdGl0bGVcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXlthLXowLTlfXSsvXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQQVJBTVMsXG4gICAgICAgICAgU1lNQk9MU1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgU1lNQk9MU1xuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZ2FtcyBhcyBkZWZhdWx0IH07XG4iXX0=