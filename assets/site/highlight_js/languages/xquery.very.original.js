function xquery(_hljs) {
    const KEYWORDS = [
        "module",
        "schema",
        "namespace",
        "boundary-space",
        "preserve",
        "no-preserve",
        "strip",
        "default",
        "collation",
        "base-uri",
        "ordering",
        "context",
        "decimal-format",
        "decimal-separator",
        "copy-namespaces",
        "empty-sequence",
        "except",
        "exponent-separator",
        "external",
        "grouping-separator",
        "inherit",
        "no-inherit",
        "lax",
        "minus-sign",
        "per-mille",
        "percent",
        "schema-attribute",
        "schema-element",
        "strict",
        "unordered",
        "zero-digit",
        "declare",
        "import",
        "option",
        "function",
        "validate",
        "variable",
        "for",
        "at",
        "in",
        "let",
        "where",
        "order",
        "group",
        "by",
        "return",
        "if",
        "then",
        "else",
        "tumbling",
        "sliding",
        "window",
        "start",
        "when",
        "only",
        "end",
        "previous",
        "next",
        "stable",
        "ascending",
        "descending",
        "allowing",
        "empty",
        "greatest",
        "least",
        "some",
        "every",
        "satisfies",
        "switch",
        "case",
        "typeswitch",
        "try",
        "catch",
        "and",
        "or",
        "to",
        "union",
        "intersect",
        "instance",
        "of",
        "treat",
        "as",
        "castable",
        "cast",
        "map",
        "array",
        "delete",
        "insert",
        "into",
        "replace",
        "value",
        "rename",
        "copy",
        "modify",
        "update"
    ];
    const TYPES = [
        "item",
        "document-node",
        "node",
        "attribute",
        "document",
        "element",
        "comment",
        "namespace",
        "namespace-node",
        "processing-instruction",
        "text",
        "construction",
        "xs:anyAtomicType",
        "xs:untypedAtomic",
        "xs:duration",
        "xs:time",
        "xs:decimal",
        "xs:float",
        "xs:double",
        "xs:gYearMonth",
        "xs:gYear",
        "xs:gMonthDay",
        "xs:gMonth",
        "xs:gDay",
        "xs:boolean",
        "xs:base64Binary",
        "xs:hexBinary",
        "xs:anyURI",
        "xs:QName",
        "xs:NOTATION",
        "xs:dateTime",
        "xs:dateTimeStamp",
        "xs:date",
        "xs:string",
        "xs:normalizedString",
        "xs:token",
        "xs:language",
        "xs:NMTOKEN",
        "xs:Name",
        "xs:NCName",
        "xs:ID",
        "xs:IDREF",
        "xs:ENTITY",
        "xs:integer",
        "xs:nonPositiveInteger",
        "xs:negativeInteger",
        "xs:long",
        "xs:int",
        "xs:short",
        "xs:byte",
        "xs:nonNegativeInteger",
        "xs:unisignedLong",
        "xs:unsignedInt",
        "xs:unsignedShort",
        "xs:unsignedByte",
        "xs:positiveInteger",
        "xs:yearMonthDuration",
        "xs:dayTimeDuration"
    ];
    const LITERALS = [
        "eq",
        "ne",
        "lt",
        "le",
        "gt",
        "ge",
        "is",
        "self::",
        "child::",
        "descendant::",
        "descendant-or-self::",
        "attribute::",
        "following::",
        "following-sibling::",
        "parent::",
        "ancestor::",
        "ancestor-or-self::",
        "preceding::",
        "preceding-sibling::",
        "NaN"
    ];
    const BUILT_IN = {
        className: 'built_in',
        variants: [
            {
                begin: /\barray:/,
                end: /(?:append|filter|flatten|fold-(?:left|right)|for-each(?:-pair)?|get|head|insert-before|join|put|remove|reverse|size|sort|subarray|tail)\b/
            },
            {
                begin: /\bmap:/,
                end: /(?:contains|entry|find|for-each|get|keys|merge|put|remove|size)\b/
            },
            {
                begin: /\bmath:/,
                end: /(?:a(?:cos|sin|tan[2]?)|cos|exp(?:10)?|log(?:10)?|pi|pow|sin|sqrt|tan)\b/
            },
            {
                begin: /\bop:/,
                end: /\(/,
                excludeEnd: true
            },
            {
                begin: /\bfn:/,
                end: /\(/,
                excludeEnd: true
            },
            { begin: /[^</$:'"-]\b(?:abs|accumulator-(?:after|before)|adjust-(?:date(?:Time)?|time)-to-timezone|analyze-string|apply|available-(?:environment-variables|system-properties)|avg|base-uri|boolean|ceiling|codepoints?-(?:equal|to-string)|collation-key|collection|compare|concat|contains(?:-token)?|copy-of|count|current(?:-)?(?:date(?:Time)?|time|group(?:ing-key)?|output-uri|merge-(?:group|key))?data|dateTime|days?-from-(?:date(?:Time)?|duration)|deep-equal|default-(?:collation|language)|distinct-values|document(?:-uri)?|doc(?:-available)?|element-(?:available|with-id)|empty|encode-for-uri|ends-with|environment-variable|error|escape-html-uri|exactly-one|exists|false|filter|floor|fold-(?:left|right)|for-each(?:-pair)?|format-(?:date(?:Time)?|time|integer|number)|function-(?:arity|available|lookup|name)|generate-id|has-children|head|hours-from-(?:dateTime|duration|time)|id(?:ref)?|implicit-timezone|in-scope-prefixes|index-of|innermost|insert-before|iri-to-uri|json-(?:doc|to-xml)|key|lang|last|load-xquery-module|local-name(?:-from-QName)?|(?:lower|upper)-case|matches|max|minutes-from-(?:dateTime|duration|time)|min|months?-from-(?:date(?:Time)?|duration)|name(?:space-uri-?(?:for-prefix|from-QName)?)?|nilled|node-name|normalize-(?:space|unicode)|not|number|one-or-more|outermost|parse-(?:ietf-date|json)|path|position|(?:prefix-from-)?QName|random-number-generator|regex-group|remove|replace|resolve-(?:QName|uri)|reverse|root|round(?:-half-to-even)?|seconds-from-(?:dateTime|duration|time)|snapshot|sort|starts-with|static-base-uri|stream-available|string-?(?:join|length|to-codepoints)?|subsequence|substring-?(?:after|before)?|sum|system-property|tail|timezone-from-(?:date(?:Time)?|time)|tokenize|trace|trans(?:form|late)|true|type-available|unordered|unparsed-(?:entity|text)?-?(?:public-id|uri|available|lines)?|uri-collection|xml-to-json|years?-from-(?:date(?:Time)?|duration)|zero-or-one)\b/ },
            {
                begin: /\blocal:/,
                end: /\(/,
                excludeEnd: true
            },
            {
                begin: /\bzip:/,
                end: /(?:zip-file|(?:xml|html|text|binary)-entry| (?:update-)?entries)\b/
            },
            {
                begin: /\b(?:util|db|functx|app|xdmp|xmldb):/,
                end: /\(/,
                excludeEnd: true
            }
        ]
    };
    const TITLE = {
        className: 'title',
        begin: /\bxquery version "[13]\.[01]"\s?(?:encoding ".+")?/,
        end: /;/
    };
    const VAR = {
        className: 'variable',
        begin: /[$][\w\-:]+/
    };
    const NUMBER = {
        className: 'number',
        begin: /(\b0[0-7_]+)|(\b0x[0-9a-fA-F_]+)|(\b[1-9][0-9_]*(\.[0-9_]+)?)|[0_]\b/,
        relevance: 0
    };
    const STRING = {
        className: 'string',
        variants: [
            {
                begin: /"/,
                end: /"/,
                contains: [
                    {
                        begin: /""/,
                        relevance: 0
                    }
                ]
            },
            {
                begin: /'/,
                end: /'/,
                contains: [
                    {
                        begin: /''/,
                        relevance: 0
                    }
                ]
            }
        ]
    };
    const ANNOTATION = {
        className: 'meta',
        begin: /%[\w\-:]+/
    };
    const COMMENT = {
        className: 'comment',
        begin: /\(:/,
        end: /:\)/,
        relevance: 10,
        contains: [
            {
                className: 'doctag',
                begin: /@\w+/
            }
        ]
    };
    const COMPUTED = {
        beginKeywords: 'element attribute comment document processing-instruction',
        end: /\{/,
        excludeEnd: true
    };
    const DIRECT = {
        begin: /<([\w._:-]+)(\s+\S*=('|").*('|"))?>/,
        end: /(\/[\w._:-]+>)/,
        subLanguage: 'xml',
        contains: [
            {
                begin: /\{/,
                end: /\}/,
                subLanguage: 'xquery'
            },
            'self'
        ]
    };
    const CONTAINS = [
        VAR,
        BUILT_IN,
        STRING,
        NUMBER,
        COMMENT,
        ANNOTATION,
        TITLE,
        COMPUTED,
        DIRECT
    ];
    return {
        name: 'XQuery',
        aliases: [
            'xpath',
            'xq'
        ],
        case_insensitive: false,
        illegal: /(proc)|(abstract)|(extends)|(until)|(#)/,
        keywords: {
            $pattern: /[a-zA-Z$][a-zA-Z0-9_:-]*/,
            keyword: KEYWORDS,
            type: TYPES,
            literal: LITERALS
        },
        contains: CONTAINS
    };
}
export { xquery as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHF1ZXJ5LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMveHF1ZXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBLFNBQVMsTUFBTSxDQUFDLEtBQUs7SUFFbkIsTUFBTSxRQUFRLEdBQUc7UUFDZixRQUFRO1FBQ1IsUUFBUTtRQUNSLFdBQVc7UUFDWCxnQkFBZ0I7UUFDaEIsVUFBVTtRQUNWLGFBQWE7UUFDYixPQUFPO1FBQ1AsU0FBUztRQUNULFdBQVc7UUFDWCxVQUFVO1FBQ1YsVUFBVTtRQUNWLFNBQVM7UUFDVCxnQkFBZ0I7UUFDaEIsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQixnQkFBZ0I7UUFDaEIsUUFBUTtRQUNSLG9CQUFvQjtRQUNwQixVQUFVO1FBQ1Ysb0JBQW9CO1FBQ3BCLFNBQVM7UUFDVCxZQUFZO1FBQ1osS0FBSztRQUNMLFlBQVk7UUFDWixXQUFXO1FBQ1gsU0FBUztRQUNULGtCQUFrQjtRQUNsQixnQkFBZ0I7UUFDaEIsUUFBUTtRQUNSLFdBQVc7UUFDWCxZQUFZO1FBQ1osU0FBUztRQUNULFFBQVE7UUFDUixRQUFRO1FBQ1IsVUFBVTtRQUNWLFVBQVU7UUFDVixVQUFVO1FBQ1YsS0FBSztRQUNMLElBQUk7UUFDSixJQUFJO1FBQ0osS0FBSztRQUNMLE9BQU87UUFDUCxPQUFPO1FBQ1AsT0FBTztRQUNQLElBQUk7UUFDSixRQUFRO1FBQ1IsSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO1FBQ04sVUFBVTtRQUNWLFNBQVM7UUFDVCxRQUFRO1FBQ1IsT0FBTztRQUNQLE1BQU07UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLFVBQVU7UUFDVixNQUFNO1FBQ04sUUFBUTtRQUNSLFdBQVc7UUFDWCxZQUFZO1FBQ1osVUFBVTtRQUNWLE9B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QUNGLENBQUM7SUFLRixNQUFNLFFBQVEsR0FBRztRQUNmLGFBQWEsRUFBRSwyREFBMkQ7UUFDMUUsR0FBRyxFQUFFLElBQUk7UUFDVCxVQUFVLEVBQUUsSUFBSTtLQUNqQixDQUFDO0lBR0YsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVBQUUscUNBQXFDO1FBQzVDLEdBQUcsRUFBRSxnQkFBZ0I7UUFDckIsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsV0FBVyxFQUFFLFFBQVE7YUFDdEI7WUFDRCxNQUFNO1NBQ1A7S0FDRixDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUc7UUFDZixHQUFHO1FBQ0gsUUFBUTtRQUNSLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLFVBQVU7UUFDVixLQUFLO1FBQ0wsUUFBUTtRQUNSLE1BQU07S0FDUCxDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFO1lBQ1AsT0FBTztZQUNQLElBQUk7U0FDTDtRQUNELGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsT0FBTyxFQUFFLHlDQUF5QztRQUNsRCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsMEJBQTBCO1lBQ3BDLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLFFBQVE7U0FDbEI7UUFDRCxRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFhRdWVyeVxuQXV0aG9yOiBEaXJrIEtpcnN0ZW4gPGRrQGJhc2V4Lm9yZz5cbkNvbnRyaWJ1dG9yOiBEdW5jYW4gUGF0ZXJzb25cbkRlc2NyaXB0aW9uOiBTdXBwb3J0cyBYUXVlcnkgMy4xIGluY2x1ZGluZyBYUXVlcnkgVXBkYXRlIDMsIHNvIGFsc28gWFBhdGggKGFzIGl0IGlzIGEgc3VwZXJzZXQpXG5SZWZhY3RvcmVkIHRvIHByb2Nlc3MgeG1sIGNvbnN0cnVjdG9yIHN5bnRheCBhbmQgZnVuY3Rpb24tYm9kaWVzLiBBZGRlZCBtaXNzaW5nIGRhdGEtdHlwZXMsIHhwYXRoIG9wZXJhbmRzLCBpbmJ1aWx0IGZ1bmN0aW9ucywgYW5kIHF1ZXJ5IHByb2xvZ3NcbldlYnNpdGU6IGh0dHBzOi8vd3d3LnczLm9yZy9YTUwvUXVlcnkvXG5DYXRlZ29yeTogZnVuY3Rpb25hbFxuQXVkaXQ6IDIwMjBcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiB4cXVlcnkoX2hsanMpIHtcbiAgLy8gc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi94cXVlcnkvI2lkLXRlcm1pbmFsLWRlbGltaXRhdGlvblxuICBjb25zdCBLRVlXT1JEUyA9IFtcbiAgICBcIm1vZHVsZVwiLFxuICAgIFwic2NoZW1hXCIsXG4gICAgXCJuYW1lc3BhY2VcIixcbiAgICBcImJvdW5kYXJ5LXNwYWNlXCIsXG4gICAgXCJwcmVzZXJ2ZVwiLFxuICAgIFwibm8tcHJlc2VydmVcIixcbiAgICBcInN0cmlwXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJjb2xsYXRpb25cIixcbiAgICBcImJhc2UtdXJpXCIsXG4gICAgXCJvcmRlcmluZ1wiLFxuICAgIFwiY29udGV4dFwiLFxuICAgIFwiZGVjaW1hbC1mb3JtYXRcIixcbiAgICBcImRlY2ltYWwtc2VwYXJhdG9yXCIsXG4gICAgXCJjb3B5LW5hbWVzcGFjZXNcIixcbiAgICBcImVtcHR5LXNlcXVlbmNlXCIsXG4gICAgXCJleGNlcHRcIixcbiAgICBcImV4cG9uZW50LXNlcGFyYXRvclwiLFxuICAgIFwiZXh0ZXJuYWxcIixcbiAgICBcImdyb3VwaW5nLXNlcGFyYXRvclwiLFxuICAgIFwiaW5oZXJpdFwiLFxuICAgIFwibm8taW5oZXJpdFwiLFxuICAgIFwibGF4XCIsXG4gICAgXCJtaW51cy1zaWduXCIsXG4gICAgXCJwZXItbWlsbGVcIixcbiAgICBcInBlcmNlbnRcIixcbiAgICBcInNjaGVtYS1hdHRyaWJ1dGVcIixcbiAgICBcInNjaGVtYS1lbGVtZW50XCIsXG4gICAgXCJzdHJpY3RcIixcbiAgICBcInVub3JkZXJlZFwiLFxuICAgIFwiemVyby1kaWdpdFwiLFxuICAgIFwiZGVjbGFyZVwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJvcHRpb25cIixcbiAgICBcImZ1bmN0aW9uXCIsXG4gICAgXCJ2YWxpZGF0ZVwiLFxuICAgIFwidmFyaWFibGVcIixcbiAgICBcImZvclwiLFxuICAgIFwiYXRcIixcbiAgICBcImluXCIsXG4gICAgXCJsZXRcIixcbiAgICBcIndoZXJlXCIsXG4gICAgXCJvcmRlclwiLFxuICAgIFwiZ3JvdXBcIixcbiAgICBcImJ5XCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcImlmXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJ0dW1ibGluZ1wiLFxuICAgIFwic2xpZGluZ1wiLFxuICAgIFwid2luZG93XCIsXG4gICAgXCJzdGFydFwiLFxuICAgIFwid2hlblwiLFxuICAgIFwib25seVwiLFxuICAgIFwiZW5kXCIsXG4gICAgXCJwcmV2aW91c1wiLFxuICAgIFwibmV4dFwiLFxuICAgIFwic3RhYmxlXCIsXG4gICAgXCJhc2NlbmRpbmdcIixcbiAgICBcImRlc2NlbmRpbmdcIixcbiAgICBcImFsbG93aW5nXCIsXG4gICAgXCJlbXB0eVwiLFxuICAgIFwiZ3JlYXRlc3RcIixcbiAgICBcImxlYXN0XCIsXG4gICAgXCJzb21lXCIsXG4gICAgXCJldmVyeVwiLFxuICAgIFwic2F0aXNmaWVzXCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcImNhc2VcIixcbiAgICBcInR5cGVzd2l0Y2hcIixcbiAgICBcInRyeVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImFuZFwiLFxuICAgIFwib3JcIixcbiAgICBcInRvXCIsXG4gICAgXCJ1bmlvblwiLFxuICAgIFwiaW50ZXJzZWN0XCIsXG4gICAgXCJpbnN0YW5jZVwiLFxuICAgIFwib2ZcIixcbiAgICBcInRyZWF0XCIsXG4gICAgXCJhc1wiLFxuICAgIFwiY2FzdGFibGVcIixcbiAgICBcImNhc3RcIixcbiAgICBcIm1hcFwiLFxuICAgIFwiYXJyYXlcIixcbiAgICBcImRlbGV0ZVwiLFxuICAgIFwiaW5zZXJ0XCIsXG4gICAgXCJpbnRvXCIsXG4gICAgXCJyZXBsYWNlXCIsXG4gICAgXCJ2YWx1ZVwiLFxuICAgIFwicmVuYW1lXCIsXG4gICAgXCJjb3B5XCIsXG4gICAgXCJtb2RpZnlcIixcbiAgICBcInVwZGF0ZVwiXG4gIF07XG5cbiAgLy8gTm9kZSBUeXBlcyAoc29ydGVkIGJ5IGluaGVyaXRhbmNlKVxuICAvLyBhdG9taWMgdHlwZXMgKHNvcnRlZCBieSBpbmhlcml0YW5jZSlcbiAgY29uc3QgVFlQRVMgPSBbXG4gICAgXCJpdGVtXCIsXG4gICAgXCJkb2N1bWVudC1ub2RlXCIsXG4gICAgXCJub2RlXCIsXG4gICAgXCJhdHRyaWJ1dGVcIixcbiAgICBcImRvY3VtZW50XCIsXG4gICAgXCJlbGVtZW50XCIsXG4gICAgXCJjb21tZW50XCIsXG4gICAgXCJuYW1lc3BhY2VcIixcbiAgICBcIm5hbWVzcGFjZS1ub2RlXCIsXG4gICAgXCJwcm9jZXNzaW5nLWluc3RydWN0aW9uXCIsXG4gICAgXCJ0ZXh0XCIsXG4gICAgXCJjb25zdHJ1Y3Rpb25cIixcbiAgICBcInhzOmFueUF0b21pY1R5cGVcIixcbiAgICBcInhzOnVudHlwZWRBdG9taWNcIixcbiAgICBcInhzOmR1cmF0aW9uXCIsXG4gICAgXCJ4czp0aW1lXCIsXG4gICAgXCJ4czpkZWNpbWFsXCIsXG4gICAgXCJ4czpmbG9hdFwiLFxuICAgIFwieHM6ZG91YmxlXCIsXG4gICAgXCJ4czpnWWVhck1vbnRoXCIsXG4gICAgXCJ4czpnWWVhclwiLFxuICAgIFwieHM6Z01vbnRoRGF5XCIsXG4gICAgXCJ4czpnTW9udGhcIixcbiAgICBcInhzOmdEYXlcIixcbiAgICBcInhzOmJvb2xlYW5cIixcbiAgICBcInhzOmJhc2U2NEJpbmFyeVwiLFxuICAgIFwieHM6aGV4QmluYXJ5XCIsXG4gICAgXCJ4czphbnlVUklcIixcbiAgICBcInhzOlFOYW1lXCIsXG4gICAgXCJ4czpOT1RBVElPTlwiLFxuICAgIFwieHM6ZGF0ZVRpbWVcIixcbiAgICBcInhzOmRhdGVUaW1lU3RhbXBcIixcbiAgICBcInhzOmRhdGVcIixcbiAgICBcInhzOnN0cmluZ1wiLFxuICAgIFwieHM6bm9ybWFsaXplZFN0cmluZ1wiLFxuICAgIFwieHM6dG9rZW5cIixcbiAgICBcInhzOmxhbmd1YWdlXCIsXG4gICAgXCJ4czpOTVRPS0VOXCIsXG4gICAgXCJ4czpOYW1lXCIsXG4gICAgXCJ4czpOQ05hbWVcIixcbiAgICBcInhzOklEXCIsXG4gICAgXCJ4czpJRFJFRlwiLFxuICAgIFwieHM6RU5USVRZXCIsXG4gICAgXCJ4czppbnRlZ2VyXCIsXG4gICAgXCJ4czpub25Qb3NpdGl2ZUludGVnZXJcIixcbiAgICBcInhzOm5lZ2F0aXZlSW50ZWdlclwiLFxuICAgIFwieHM6bG9uZ1wiLFxuICAgIFwieHM6aW50XCIsXG4gICAgXCJ4czpzaG9ydFwiLFxuICAgIFwieHM6Ynl0ZVwiLFxuICAgIFwieHM6bm9uTmVnYXRpdmVJbnRlZ2VyXCIsXG4gICAgXCJ4czp1bmlzaWduZWRMb25nXCIsXG4gICAgXCJ4czp1bnNpZ25lZEludFwiLFxuICAgIFwieHM6dW5zaWduZWRTaG9ydFwiLFxuICAgIFwieHM6dW5zaWduZWRCeXRlXCIsXG4gICAgXCJ4czpwb3NpdGl2ZUludGVnZXJcIixcbiAgICBcInhzOnllYXJNb250aER1cmF0aW9uXCIsXG4gICAgXCJ4czpkYXlUaW1lRHVyYXRpb25cIlxuICBdO1xuXG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgIFwiZXFcIixcbiAgICBcIm5lXCIsXG4gICAgXCJsdFwiLFxuICAgIFwibGVcIixcbiAgICBcImd0XCIsXG4gICAgXCJnZVwiLFxuICAgIFwiaXNcIixcbiAgICBcInNlbGY6OlwiLFxuICAgIFwiY2hpbGQ6OlwiLFxuICAgIFwiZGVzY2VuZGFudDo6XCIsXG4gICAgXCJkZXNjZW5kYW50LW9yLXNlbGY6OlwiLFxuICAgIFwiYXR0cmlidXRlOjpcIixcbiAgICBcImZvbGxvd2luZzo6XCIsXG4gICAgXCJmb2xsb3dpbmctc2libGluZzo6XCIsXG4gICAgXCJwYXJlbnQ6OlwiLFxuICAgIFwiYW5jZXN0b3I6OlwiLFxuICAgIFwiYW5jZXN0b3Itb3Itc2VsZjo6XCIsXG4gICAgXCJwcmVjZWRpbmc6OlwiLFxuICAgIFwicHJlY2VkaW5nLXNpYmxpbmc6OlwiLFxuICAgIFwiTmFOXCJcbiAgXTtcblxuICAvLyBmdW5jdGlvbnMgKFRPRE86IGZpbmQgcmVnZXggZm9yIG9wOiB3aXRob3V0IGJyZWFraW5nIGJ1aWxkKVxuICBjb25zdCBCVUlMVF9JTiA9IHtcbiAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXGJhcnJheTovLFxuICAgICAgICBlbmQ6IC8oPzphcHBlbmR8ZmlsdGVyfGZsYXR0ZW58Zm9sZC0oPzpsZWZ0fHJpZ2h0KXxmb3ItZWFjaCg/Oi1wYWlyKT98Z2V0fGhlYWR8aW5zZXJ0LWJlZm9yZXxqb2lufHB1dHxyZW1vdmV8cmV2ZXJzZXxzaXplfHNvcnR8c3ViYXJyYXl8dGFpbClcXGIvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcYm1hcDovLFxuICAgICAgICBlbmQ6IC8oPzpjb250YWluc3xlbnRyeXxmaW5kfGZvci1lYWNofGdldHxrZXlzfG1lcmdlfHB1dHxyZW1vdmV8c2l6ZSlcXGIvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcYm1hdGg6LyxcbiAgICAgICAgZW5kOiAvKD86YSg/OmNvc3xzaW58dGFuWzJdPyl8Y29zfGV4cCg/OjEwKT98bG9nKD86MTApP3xwaXxwb3d8c2lufHNxcnR8dGFuKVxcYi9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxib3A6LyxcbiAgICAgICAgZW5kOiAvXFwoLyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXGJmbjovLFxuICAgICAgICBlbmQ6IC9cXCgvLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAgLy8gZG8gbm90IGhpZ2hsaWdodCBpbmJ1aWx0IHN0cmluZ3MgYXMgdmFyaWFibGUgb3IgeG1sIGVsZW1lbnQgbmFtZXNcbiAgICAgIHsgYmVnaW46IC9bXjwvJDonXCItXVxcYig/OmFic3xhY2N1bXVsYXRvci0oPzphZnRlcnxiZWZvcmUpfGFkanVzdC0oPzpkYXRlKD86VGltZSk/fHRpbWUpLXRvLXRpbWV6b25lfGFuYWx5emUtc3RyaW5nfGFwcGx5fGF2YWlsYWJsZS0oPzplbnZpcm9ubWVudC12YXJpYWJsZXN8c3lzdGVtLXByb3BlcnRpZXMpfGF2Z3xiYXNlLXVyaXxib29sZWFufGNlaWxpbmd8Y29kZXBvaW50cz8tKD86ZXF1YWx8dG8tc3RyaW5nKXxjb2xsYXRpb24ta2V5fGNvbGxlY3Rpb258Y29tcGFyZXxjb25jYXR8Y29udGFpbnMoPzotdG9rZW4pP3xjb3B5LW9mfGNvdW50fGN1cnJlbnQoPzotKT8oPzpkYXRlKD86VGltZSk/fHRpbWV8Z3JvdXAoPzppbmcta2V5KT98b3V0cHV0LXVyaXxtZXJnZS0oPzpncm91cHxrZXkpKT9kYXRhfGRhdGVUaW1lfGRheXM/LWZyb20tKD86ZGF0ZSg/OlRpbWUpP3xkdXJhdGlvbil8ZGVlcC1lcXVhbHxkZWZhdWx0LSg/OmNvbGxhdGlvbnxsYW5ndWFnZSl8ZGlzdGluY3QtdmFsdWVzfGRvY3VtZW50KD86LXVyaSk/fGRvYyg/Oi1hdmFpbGFibGUpP3xlbGVtZW50LSg/OmF2YWlsYWJsZXx3aXRoLWlkKXxlbXB0eXxlbmNvZGUtZm9yLXVyaXxlbmRzLXdpdGh8ZW52aXJvbm1lbnQtdmFyaWFibGV8ZXJyb3J8ZXNjYXBlLWh0bWwtdXJpfGV4YWN0bHktb25lfGV4aXN0c3xmYWxzZXxmaWx0ZXJ8Zmxvb3J8Zm9sZC0oPzpsZWZ0fHJpZ2h0KXxmb3ItZWFjaCg/Oi1wYWlyKT98Zm9ybWF0LSg/OmRhdGUoPzpUaW1lKT98dGltZXxpbnRlZ2VyfG51bWJlcil8ZnVuY3Rpb24tKD86YXJpdHl8YXZhaWxhYmxlfGxvb2t1cHxuYW1lKXxnZW5lcmF0ZS1pZHxoYXMtY2hpbGRyZW58aGVhZHxob3Vycy1mcm9tLSg/OmRhdGVUaW1lfGR1cmF0aW9ufHRpbWUpfGlkKD86cmVmKT98aW1wbGljaXQtdGltZXpvbmV8aW4tc2NvcGUtcHJlZml4ZXN8aW5kZXgtb2Z8aW5uZXJtb3N0fGluc2VydC1iZWZvcmV8aXJpLXRvLXVyaXxqc29uLSg/OmRvY3x0by14bWwpfGtleXxsYW5nfGxhc3R8bG9hZC14cXVlcnktbW9kdWxlfGxvY2FsLW5hbWUoPzotZnJvbS1RTmFtZSk/fCg/Omxvd2VyfHVwcGVyKS1jYXNlfG1hdGNoZXN8bWF4fG1pbnV0ZXMtZnJvbS0oPzpkYXRlVGltZXxkdXJhdGlvbnx0aW1lKXxtaW58bW9udGhzPy1mcm9tLSg/OmRhdGUoPzpUaW1lKT98ZHVyYXRpb24pfG5hbWUoPzpzcGFjZS11cmktPyg/OmZvci1wcmVmaXh8ZnJvbS1RTmFtZSk/KT98bmlsbGVkfG5vZGUtbmFtZXxub3JtYWxpemUtKD86c3BhY2V8dW5pY29kZSl8bm90fG51bWJlcnxvbmUtb3ItbW9yZXxvdXRlcm1vc3R8cGFyc2UtKD86aWV0Zi1kYXRlfGpzb24pfHBhdGh8cG9zaXRpb258KD86cHJlZml4LWZyb20tKT9RTmFtZXxyYW5kb20tbnVtYmVyLWdlbmVyYXRvcnxyZWdleC1ncm91cHxyZW1vdmV8cmVwbGFjZXxyZXNvbHZlLSg/OlFOYW1lfHVyaSl8cmV2ZXJzZXxyb290fHJvdW5kKD86LWhhbGYtdG8tZXZlbik/fHNlY29uZHMtZnJvbS0oPzpkYXRlVGltZXxkdXJhdGlvbnx0aW1lKXxzbmFwc2hvdHxzb3J0fHN0YXJ0cy13aXRofHN0YXRpYy1iYXNlLXVyaXxzdHJlYW0tYXZhaWxhYmxlfHN0cmluZy0/KD86am9pbnxsZW5ndGh8dG8tY29kZXBvaW50cyk/fHN1YnNlcXVlbmNlfHN1YnN0cmluZy0/KD86YWZ0ZXJ8YmVmb3JlKT98c3VtfHN5c3RlbS1wcm9wZXJ0eXx0YWlsfHRpbWV6b25lLWZyb20tKD86ZGF0ZSg/OlRpbWUpP3x0aW1lKXx0b2tlbml6ZXx0cmFjZXx0cmFucyg/OmZvcm18bGF0ZSl8dHJ1ZXx0eXBlLWF2YWlsYWJsZXx1bm9yZGVyZWR8dW5wYXJzZWQtKD86ZW50aXR5fHRleHQpPy0/KD86cHVibGljLWlkfHVyaXxhdmFpbGFibGV8bGluZXMpP3x1cmktY29sbGVjdGlvbnx4bWwtdG8tanNvbnx5ZWFycz8tZnJvbS0oPzpkYXRlKD86VGltZSk/fGR1cmF0aW9uKXx6ZXJvLW9yLW9uZSlcXGIvIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxibG9jYWw6LyxcbiAgICAgICAgZW5kOiAvXFwoLyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXGJ6aXA6LyxcbiAgICAgICAgZW5kOiAvKD86emlwLWZpbGV8KD86eG1sfGh0bWx8dGV4dHxiaW5hcnkpLWVudHJ5fCAoPzp1cGRhdGUtKT9lbnRyaWVzKVxcYi9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxiKD86dXRpbHxkYnxmdW5jdHh8YXBwfHhkbXB8eG1sZGIpOi8sXG4gICAgICAgIGVuZDogL1xcKC8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgY29uc3QgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgIGJlZ2luOiAvXFxieHF1ZXJ5IHZlcnNpb24gXCJbMTNdXFwuWzAxXVwiXFxzPyg/OmVuY29kaW5nIFwiLitcIik/LyxcbiAgICBlbmQ6IC87L1xuICB9O1xuXG4gIGNvbnN0IFZBUiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46IC9bJF1bXFx3XFwtOl0rL1xuICB9O1xuXG4gIGNvbnN0IE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiAvKFxcYjBbMC03X10rKXwoXFxiMHhbMC05YS1mQS1GX10rKXwoXFxiWzEtOV1bMC05X10qKFxcLlswLTlfXSspPyl8WzBfXVxcYi8sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cIi8sXG4gICAgICAgIGVuZDogL1wiLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1wiXCIvLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLycvLFxuICAgICAgICBlbmQ6IC8nLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLycnLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBBTk5PVEFUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgIGJlZ2luOiAvJVtcXHdcXC06XSsvXG4gIH07XG5cbiAgY29uc3QgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogL1xcKDovLFxuICAgIGVuZDogLzpcXCkvLFxuICAgIHJlbGV2YW5jZTogMTAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZG9jdGFnJyxcbiAgICAgICAgYmVnaW46IC9AXFx3Ky9cbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgLy8gc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi94cXVlcnkvI2lkLWNvbXB1dGVkQ29uc3RydWN0b3JzXG4gIC8vIG1vY2hhOiBjb21wdXRlZF9pbmJ1aWx0XG4gIC8vIHNlZSBodHRwczovL3d3dy5yZWdleHBhbC5jb20vP2ZhbT05OTc0OVxuICBjb25zdCBDT01QVVRFRCA9IHtcbiAgICBiZWdpbktleXdvcmRzOiAnZWxlbWVudCBhdHRyaWJ1dGUgY29tbWVudCBkb2N1bWVudCBwcm9jZXNzaW5nLWluc3RydWN0aW9uJyxcbiAgICBlbmQ6IC9cXHsvLFxuICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgfTtcblxuICAvLyBtb2NoYTogZGlyZWN0X21ldGhvZFxuICBjb25zdCBESVJFQ1QgPSB7XG4gICAgYmVnaW46IC88KFtcXHcuXzotXSspKFxccytcXFMqPSgnfFwiKS4qKCd8XCIpKT8+LyxcbiAgICBlbmQ6IC8oXFwvW1xcdy5fOi1dKz4pLyxcbiAgICBzdWJMYW5ndWFnZTogJ3htbCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXHsvLFxuICAgICAgICBlbmQ6IC9cXH0vLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3hxdWVyeSdcbiAgICAgIH0sXG4gICAgICAnc2VsZidcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgQ09OVEFJTlMgPSBbXG4gICAgVkFSLFxuICAgIEJVSUxUX0lOLFxuICAgIFNUUklORyxcbiAgICBOVU1CRVIsXG4gICAgQ09NTUVOVCxcbiAgICBBTk5PVEFUSU9OLFxuICAgIFRJVExFLFxuICAgIENPTVBVVEVELFxuICAgIERJUkVDVFxuICBdO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1hRdWVyeScsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ3hwYXRoJyxcbiAgICAgICd4cSdcbiAgICBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IGZhbHNlLFxuICAgIGlsbGVnYWw6IC8ocHJvYyl8KGFic3RyYWN0KXwoZXh0ZW5kcyl8KHVudGlsKXwoIykvLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogL1thLXpBLVokXVthLXpBLVowLTlfOi1dKi8sXG4gICAgICBrZXl3b3JkOiBLRVlXT1JEUyxcbiAgICAgIHR5cGU6IFRZUEVTLFxuICAgICAgbGl0ZXJhbDogTElURVJBTFNcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBDT05UQUlOU1xuICB9O1xufVxuXG5leHBvcnQgeyB4cXVlcnkgYXMgZGVmYXVsdCB9O1xuIl19