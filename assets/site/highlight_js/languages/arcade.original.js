function arcade(hljs) {
    const IDENT_RE = '[A-Za-z_][0-9A-Za-z_]*';
    const KEYWORDS = {
        keyword: [
            "if",
            "for",
            "while",
            "var",
            "new",
            "function",
            "do",
            "return",
            "void",
            "else",
            "break"
        ],
        literal: [
            "BackSlash",
            "DoubleQuote",
            "false",
            "ForwardSlash",
            "Infinity",
            "NaN",
            "NewLine",
            "null",
            "PI",
            "SingleQuote",
            "Tab",
            "TextFormatting",
            "true",
            "undefined"
        ],
        built_in: [
            "Abs",
            "Acos",
            "All",
            "Angle",
            "Any",
            "Area",
            "AreaGeodetic",
            "Array",
            "Asin",
            "Atan",
            "Atan2",
            "Attachments",
            "Average",
            "Back",
            "Bearing",
            "Boolean",
            "Buffer",
            "BufferGeodetic",
            "Ceil",
            "Centroid",
            "Clip",
            "Concatenate",
            "Console",
            "Constrain",
            "Contains",
            "ConvertDirection",
            "Cos",
            "Count",
            "Crosses",
            "Cut",
            "Date",
            "DateAdd",
            "DateDiff",
            "Day",
            "Decode",
            "DefaultValue",
            "Densify",
            "DensifyGeodetic",
            "Dictionary",
            "Difference",
            "Disjoint",
            "Distance",
            "DistanceGeodetic",
            "Distinct",
            "Domain",
            "DomainCode",
            "DomainName",
            "EnvelopeIntersects",
            "Equals",
            "Erase",
            "Exp",
            "Expects",
            "Extent",
            "Feature",
            "FeatureSet",
            "FeatureSetByAssociation",
            "FeatureSetById",
            "FeatureSetByName",
            "FeatureSetByPortalItem",
            "FeatureSetByRelationshipName",
            "Filter",
            "Find",
            "First",
            "Floor",
            "FromCharCode",
            "FromCodePoint",
            "FromJSON",
            "GdbVersion",
            "Generalize",
            "Geometry",
            "GetFeatureSet",
            "GetUser",
            "GroupBy",
            "Guid",
            "Hash",
            "HasKey",
            "Hour",
            "IIf",
            "Includes",
            "IndexOf",
            "Insert",
            "Intersection",
            "Intersects",
            "IsEmpty",
            "IsNan",
            "ISOMonth",
            "ISOWeek",
            "ISOWeekday",
            "ISOYear",
            "IsSelfIntersecting",
            "IsSimple",
            "Left|0",
            "Length",
            "Length3D",
            "LengthGeodetic",
            "Log",
            "Lower",
            "Map",
            "Max",
            "Mean",
            "Mid",
            "Millisecond",
            "Min",
            "Minute",
            "Month",
            "MultiPartToSinglePart",
            "Multipoint",
            "NextSequenceValue",
            "None",
            "Now",
            "Number",
            "Offset|0",
            "OrderBy",
            "Overlaps",
            "Point",
            "Polygon",
            "Polyline",
            "Pop",
            "Portal",
            "Pow",
            "Proper",
            "Push",
            "Random",
            "Reduce",
            "Relate",
            "Replace",
            "Resize",
            "Reverse",
            "Right|0",
            "RingIsClockwise",
            "Rotate",
            "Round",
            "Schema",
            "Second",
            "SetGeometry",
            "Simplify",
            "Sin",
            "Slice",
            "Sort",
            "Splice",
            "Split",
            "Sqrt",
            "Stdev",
            "SubtypeCode",
            "SubtypeName",
            "Subtypes",
            "Sum",
            "SymmetricDifference",
            "Tan",
            "Text",
            "Timestamp",
            "ToCharCode",
            "ToCodePoint",
            "Today",
            "ToHex",
            "ToLocal",
            "Top|0",
            "Touches",
            "ToUTC",
            "TrackAccelerationAt",
            "TrackAccelerationWindow",
            "TrackCurrentAcceleration",
            "TrackCurrentDistance",
            "TrackCurrentSpeed",
            "TrackCurrentTime",
            "TrackDistanceAt",
            "TrackDistanceWindow",
            "TrackDuration",
            "TrackFieldWindow",
            "TrackGeometryWindow",
            "TrackIndex",
            "TrackSpeedAt",
            "TrackSpeedWindow",
            "TrackStartTime",
            "TrackWindow",
            "Trim",
            "TypeOf",
            "Union",
            "Upper",
            "UrlEncode",
            "Variance",
            "Week",
            "Weekday",
            "When",
            "Within",
            "Year"
        ]
    };
    const SYMBOL = {
        className: 'symbol',
        begin: '\\$[datastore|feature|layer|map|measure|sourcefeature|sourcelayer|targetfeature|targetlayer|value|view]+'
    };
    const NUMBER = {
        className: 'number',
        variants: [
            { begin: '\\b(0[bB][01]+)' },
            { begin: '\\b(0[oO][0-7]+)' },
            { begin: hljs.C_NUMBER_RE }
        ],
        relevance: 0
    };
    const SUBST = {
        className: 'subst',
        begin: '\\$\\{',
        end: '\\}',
        keywords: KEYWORDS,
        contains: []
    };
    const TEMPLATE_STRING = {
        className: 'string',
        begin: '`',
        end: '`',
        contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
        ]
    };
    SUBST.contains = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        TEMPLATE_STRING,
        NUMBER,
        hljs.REGEXP_MODE
    ];
    const PARAMS_CONTAINS = SUBST.contains.concat([
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
    ]);
    return {
        name: 'ArcGIS Arcade',
        case_insensitive: true,
        keywords: KEYWORDS,
        contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            TEMPLATE_STRING,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            SYMBOL,
            NUMBER,
            {
                begin: /[{,]\s*/,
                relevance: 0,
                contains: [
                    {
                        begin: IDENT_RE + '\\s*:',
                        returnBegin: true,
                        relevance: 0,
                        contains: [
                            {
                                className: 'attr',
                                begin: IDENT_RE,
                                relevance: 0
                            }
                        ]
                    }
                ]
            },
            {
                begin: '(' + hljs.RE_STARTERS_RE + '|\\b(return)\\b)\\s*',
                keywords: 'return',
                contains: [
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    hljs.REGEXP_MODE,
                    {
                        className: 'function',
                        begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>',
                        returnBegin: true,
                        end: '\\s*=>',
                        contains: [
                            {
                                className: 'params',
                                variants: [
                                    { begin: IDENT_RE },
                                    { begin: /\(\s*\)/ },
                                    {
                                        begin: /\(/,
                                        end: /\)/,
                                        excludeBegin: true,
                                        excludeEnd: true,
                                        keywords: KEYWORDS,
                                        contains: PARAMS_CONTAINS
                                    }
                                ]
                            }
                        ]
                    }
                ],
                relevance: 0
            },
            {
                beginKeywords: 'function',
                end: /\{/,
                excludeEnd: true,
                contains: [
                    hljs.inherit(hljs.TITLE_MODE, {
                        className: "title.function",
                        begin: IDENT_RE
                    }),
                    {
                        className: 'params',
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        contains: PARAMS_CONTAINS
                    }
                ],
                illegal: /\[|%/
            },
            { begin: /\$[(.]/ }
        ],
        illegal: /#(?!!)/
    };
}
export { arcade as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjYWRlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYXJjYWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxRQUFRLEdBQUcsd0JBQXdCLENBQUM7SUFDMUMsTUFBTSxRQUFRLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCxJQUFJO1lBQ0osS0FBSztZQUNMLE9BQU87WUFDUCxLQUFLO1lBQ0wsS0FBSztZQUNMLFVBQVU7WUFDVixJQUFJO1lBQ0osUUFBUTtZQUNSLE1BQU07WUFDTixNQUFNO1lBQ04sT0FBTztTQUNSO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsV0FBVztZQUNYLGFBQWE7WUFDYixPQUFPO1lBQ1AsY0FBYztZQUNkLFVBQVU7WUFDVixLQUFLO1lBQ0wsU0FBUztZQUNULE1BQU07WUFDTixJQUFJO1lBQ0osYUFBYTtZQUNiLEtBQUs7WUFDTCxnQkFBZ0I7WUFDaEIsTUFBTTtZQUNOLFdBQVc7U0FDWjtRQUNELFFBQVEsRUFBRTtZQUNSLEtBQUs7WUFDTCxNQUFNO1lBQ04sS0FBSztZQUNMLE9BQU87WUFDUCxLQUFLO1lBQ0wsTUFBTTtZQUNOLGNBQWM7WUFDZCxPQUFPO1lBQ1AsTUFBTTtZQUNOLE1BQU07WUFDTixPQUFPO1lBQ1AsYUFBYTtZQUNiLFNBQVM7WUFDVCxNQUFNO1lBQ04sU0FBUztZQUNULFNBQVM7WUFDVCxRQUFRO1lBQ1IsZ0JBQWdCO1lBQ2hCLE1BQU07WUFDTixVQUFVO1lBQ1YsTUFBTTtZQUNOLGFBQWE7WUFDYixTQUFTO1lBQ1QsV0FBVztZQUNYLFVBQVU7WUFDVixrQkFBa0I7WUFDbEIsS0FBSztZQUNMLE9BQU87WUFDUCxTQUFTO1lBQ1QsS0FBSztZQUNMLE1B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Q0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDNUIsU0FBUyxFQUFFLGdCQUFnQjt3QkFDM0IsS0FBSyxFQUFFLFFBQVE7cUJBQ2hCLENBQUM7b0JBQ0Y7d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLEtBQUssRUFBRSxJQUFJO3dCQUNYLEdBQUcsRUFBRSxJQUFJO3dCQUNULFlBQVksRUFBRSxJQUFJO3dCQUNsQixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsUUFBUSxFQUFFLGVBQWU7cUJBQzFCO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxNQUFNO2FBQ2hCO1lBQ0QsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1NBQ3BCO1FBQ0QsT0FBTyxFQUFFLFFBQVE7S0FDbEIsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiBMYW5ndWFnZTogQXJjR0lTIEFyY2FkZVxuIENhdGVnb3J5OiBzY3JpcHRpbmdcbiBBdXRob3I6IEpvaG4gRm9zdGVyIDxqZm9zdGVyQGVzcmkuY29tPlxuIFdlYnNpdGU6IGh0dHBzOi8vZGV2ZWxvcGVycy5hcmNnaXMuY29tL2FyY2FkZS9cbiBEZXNjcmlwdGlvbjogQXJjR0lTIEFyY2FkZSBpcyBhbiBleHByZXNzaW9uIGxhbmd1YWdlIHVzZWQgaW4gbWFueSBFc3JpIEFyY0dJUyBwcm9kdWN0cyBzdWNoIGFzIFBybywgT25saW5lLCBTZXJ2ZXIsIFJ1bnRpbWUsIEphdmFTY3JpcHQsIGFuZCBQeXRob25cbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBhcmNhZGUoaGxqcykge1xuICBjb25zdCBJREVOVF9SRSA9ICdbQS1aYS16X11bMC05QS1aYS16X10qJztcbiAgY29uc3QgS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDogW1xuICAgICAgXCJpZlwiLFxuICAgICAgXCJmb3JcIixcbiAgICAgIFwid2hpbGVcIixcbiAgICAgIFwidmFyXCIsXG4gICAgICBcIm5ld1wiLFxuICAgICAgXCJmdW5jdGlvblwiLFxuICAgICAgXCJkb1wiLFxuICAgICAgXCJyZXR1cm5cIixcbiAgICAgIFwidm9pZFwiLFxuICAgICAgXCJlbHNlXCIsXG4gICAgICBcImJyZWFrXCJcbiAgICBdLFxuICAgIGxpdGVyYWw6IFtcbiAgICAgIFwiQmFja1NsYXNoXCIsXG4gICAgICBcIkRvdWJsZVF1b3RlXCIsXG4gICAgICBcImZhbHNlXCIsXG4gICAgICBcIkZvcndhcmRTbGFzaFwiLFxuICAgICAgXCJJbmZpbml0eVwiLFxuICAgICAgXCJOYU5cIixcbiAgICAgIFwiTmV3TGluZVwiLFxuICAgICAgXCJudWxsXCIsXG4gICAgICBcIlBJXCIsXG4gICAgICBcIlNpbmdsZVF1b3RlXCIsXG4gICAgICBcIlRhYlwiLFxuICAgICAgXCJUZXh0Rm9ybWF0dGluZ1wiLFxuICAgICAgXCJ0cnVlXCIsXG4gICAgICBcInVuZGVmaW5lZFwiXG4gICAgXSxcbiAgICBidWlsdF9pbjogW1xuICAgICAgXCJBYnNcIixcbiAgICAgIFwiQWNvc1wiLFxuICAgICAgXCJBbGxcIixcbiAgICAgIFwiQW5nbGVcIixcbiAgICAgIFwiQW55XCIsXG4gICAgICBcIkFyZWFcIixcbiAgICAgIFwiQXJlYUdlb2RldGljXCIsXG4gICAgICBcIkFycmF5XCIsXG4gICAgICBcIkFzaW5cIixcbiAgICAgIFwiQXRhblwiLFxuICAgICAgXCJBdGFuMlwiLFxuICAgICAgXCJBdHRhY2htZW50c1wiLFxuICAgICAgXCJBdmVyYWdlXCIsXG4gICAgICBcIkJhY2tcIixcbiAgICAgIFwiQmVhcmluZ1wiLFxuICAgICAgXCJCb29sZWFuXCIsXG4gICAgICBcIkJ1ZmZlclwiLFxuICAgICAgXCJCdWZmZXJHZW9kZXRpY1wiLFxuICAgICAgXCJDZWlsXCIsXG4gICAgICBcIkNlbnRyb2lkXCIsXG4gICAgICBcIkNsaXBcIixcbiAgICAgIFwiQ29uY2F0ZW5hdGVcIixcbiAgICAgIFwiQ29uc29sZVwiLFxuICAgICAgXCJDb25zdHJhaW5cIixcbiAgICAgIFwiQ29udGFpbnNcIixcbiAgICAgIFwiQ29udmVydERpcmVjdGlvblwiLFxuICAgICAgXCJDb3NcIixcbiAgICAgIFwiQ291bnRcIixcbiAgICAgIFwiQ3Jvc3Nlc1wiLFxuICAgICAgXCJDdXRcIixcbiAgICAgIFwiRGF0ZVwiLFxuICAgICAgXCJEYXRlQWRkXCIsXG4gICAgICBcIkRhdGVEaWZmXCIsXG4gICAgICBcIkRheVwiLFxuICAgICAgXCJEZWNvZGVcIixcbiAgICAgIFwiRGVmYXVsdFZhbHVlXCIsXG4gICAgICBcIkRlbnNpZnlcIixcbiAgICAgIFwiRGVuc2lmeUdlb2RldGljXCIsXG4gICAgICBcIkRpY3Rpb25hcnlcIixcbiAgICAgIFwiRGlmZmVyZW5jZVwiLFxuICAgICAgXCJEaXNqb2ludFwiLFxuICAgICAgXCJEaXN0YW5jZVwiLFxuICAgICAgXCJEaXN0YW5jZUdlb2RldGljXCIsXG4gICAgICBcIkRpc3RpbmN0XCIsXG4gICAgICBcIkRvbWFpblwiLFxuICAgICAgXCJEb21haW5Db2RlXCIsXG4gICAgICBcIkRvbWFpbk5hbWVcIixcbiAgICAgIFwiRW52ZWxvcGVJbnRlcnNlY3RzXCIsXG4gICAgICBcIkVxdWFsc1wiLFxuICAgICAgXCJFcmFzZVwiLFxuICAgICAgXCJFeHBcIixcbiAgICAgIFwiRXhwZWN0c1wiLFxuICAgICAgXCJFeHRlbnRcIixcbiAgICAgIFwiRmVhdHVyZVwiLFxuICAgICAgXCJGZWF0dXJlU2V0XCIsXG4gICAgICBcIkZlYXR1cmVTZXRCeUFzc29jaWF0aW9uXCIsXG4gICAgICBcIkZlYXR1cmVTZXRCeUlkXCIsXG4gICAgICBcIkZlYXR1cmVTZXRCeU5hbWVcIixcbiAgICAgIFwiRmVhdHVyZVNldEJ5UG9ydGFsSXRlbVwiLFxuICAgICAgXCJGZWF0dXJlU2V0QnlSZWxhdGlvbnNoaXBOYW1lXCIsXG4gICAgICBcIkZpbHRlclwiLFxuICAgICAgXCJGaW5kXCIsXG4gICAgICBcIkZpcnN0XCIsXG4gICAgICBcIkZsb29yXCIsXG4gICAgICBcIkZyb21DaGFyQ29kZVwiLFxuICAgICAgXCJGcm9tQ29kZVBvaW50XCIsXG4gICAgICBcIkZyb21KU09OXCIsXG4gICAgICBcIkdkYlZlcnNpb25cIixcbiAgICAgIFwiR2VuZXJhbGl6ZVwiLFxuICAgICAgXCJHZW9tZXRyeVwiLFxuICAgICAgXCJHZXRGZWF0dXJlU2V0XCIsXG4gICAgICBcIkdldFVzZXJcIixcbiAgICAgIFwiR3JvdXBCeVwiLFxuICAgICAgXCJHdWlkXCIsXG4gICAgICBcIkhhc2hcIixcbiAgICAgIFwiSGFzS2V5XCIsXG4gICAgICBcIkhvdXJcIixcbiAgICAgIFwiSUlmXCIsXG4gICAgICBcIkluY2x1ZGVzXCIsXG4gICAgICBcIkluZGV4T2ZcIixcbiAgICAgIFwiSW5zZXJ0XCIsXG4gICAgICBcIkludGVyc2VjdGlvblwiLFxuICAgICAgXCJJbnRlcnNlY3RzXCIsXG4gICAgICBcIklzRW1wdHlcIixcbiAgICAgIFwiSXNOYW5cIixcbiAgICAgIFwiSVNPTW9udGhcIixcbiAgICAgIFwiSVNPV2Vla1wiLFxuICAgICAgXCJJU09XZWVrZGF5XCIsXG4gICAgICBcIklTT1llYXJcIixcbiAgICAgIFwiSXNTZWxmSW50ZXJzZWN0aW5nXCIsXG4gICAgICBcIklzU2ltcGxlXCIsXG4gICAgICBcIkxlZnR8MFwiLFxuICAgICAgXCJMZW5ndGhcIixcbiAgICAgIFwiTGVuZ3RoM0RcIixcbiAgICAgIFwiTGVuZ3RoR2VvZGV0aWNcIixcbiAgICAgIFwiTG9nXCIsXG4gICAgICBcIkxvd2VyXCIsXG4gICAgICBcIk1hcFwiLFxuICAgICAgXCJNYXhcIixcbiAgICAgIFwiTWVhblwiLFxuICAgICAgXCJNaWRcIixcbiAgICAgIFwiTWlsbGlzZWNvbmRcIixcbiAgICAgIFwiTWluXCIsXG4gICAgICBcIk1pbnV0ZVwiLFxuICAgICAgXCJNb250aFwiLFxuICAgICAgXCJNdWx0aVBhcnRUb1NpbmdsZVBhcnRcIixcbiAgICAgIFwiTXVsdGlwb2ludFwiLFxuICAgICAgXCJOZXh0U2VxdWVuY2VWYWx1ZVwiLFxuICAgICAgXCJOb25lXCIsXG4gICAgICBcIk5vd1wiLFxuICAgICAgXCJOdW1iZXJcIixcbiAgICAgIFwiT2Zmc2V0fDBcIixcbiAgICAgIFwiT3JkZXJCeVwiLFxuICAgICAgXCJPdmVybGFwc1wiLFxuICAgICAgXCJQb2ludFwiLFxuICAgICAgXCJQb2x5Z29uXCIsXG4gICAgICBcIlBvbHlsaW5lXCIsXG4gICAgICBcIlBvcFwiLFxuICAgICAgXCJQb3J0YWxcIixcbiAgICAgIFwiUG93XCIsXG4gICAgICBcIlByb3BlclwiLFxuICAgICAgXCJQdXNoXCIsXG4gICAgICBcIlJhbmRvbVwiLFxuICAgICAgXCJSZWR1Y2VcIixcbiAgICAgIFwiUmVsYXRlXCIsXG4gICAgICBcIlJlcGxhY2VcIixcbiAgICAgIFwiUmVzaXplXCIsXG4gICAgICBcIlJldmVyc2VcIixcbiAgICAgIFwiUmlnaHR8MFwiLFxuICAgICAgXCJSaW5nSXNDbG9ja3dpc2VcIixcbiAgICAgIFwiUm90YXRlXCIsXG4gICAgICBcIlJvdW5kXCIsXG4gICAgICBcIlNjaGVtYVwiLFxuICAgICAgXCJTZWNvbmRcIixcbiAgICAgIFwiU2V0R2VvbWV0cnlcIixcbiAgICAgIFwiU2ltcGxpZnlcIixcbiAgICAgIFwiU2luXCIsXG4gICAgICBcIlNsaWNlXCIsXG4gICAgICBcIlNvcnRcIixcbiAgICAgIFwiU3BsaWNlXCIsXG4gICAgICBcIlNwbGl0XCIsXG4gICAgICBcIlNxcnRcIixcbiAgICAgIFwiU3RkZXZcIixcbiAgICAgIFwiU3VidHlwZUNvZGVcIixcbiAgICAgIFwiU3VidHlwZU5hbWVcIixcbiAgICAgIFwiU3VidHlwZXNcIixcbiAgICAgIFwiU3VtXCIsXG4gICAgICBcIlN5bW1ldHJpY0RpZmZlcmVuY2VcIixcbiAgICAgIFwiVGFuXCIsXG4gICAgICBcIlRleHRcIixcbiAgICAgIFwiVGltZXN0YW1wXCIsXG4gICAgICBcIlRvQ2hhckNvZGVcIixcbiAgICAgIFwiVG9Db2RlUG9pbnRcIixcbiAgICAgIFwiVG9kYXlcIixcbiAgICAgIFwiVG9IZXhcIixcbiAgICAgIFwiVG9Mb2NhbFwiLFxuICAgICAgXCJUb3B8MFwiLFxuICAgICAgXCJUb3VjaGVzXCIsXG4gICAgICBcIlRvVVRDXCIsXG4gICAgICBcIlRyYWNrQWNjZWxlcmF0aW9uQXRcIixcbiAgICAgIFwiVHJhY2tBY2NlbGVyYXRpb25XaW5kb3dcIixcbiAgICAgIFwiVHJhY2tDdXJyZW50QWNjZWxlcmF0aW9uXCIsXG4gICAgICBcIlRyYWNrQ3VycmVudERpc3RhbmNlXCIsXG4gICAgICBcIlRyYWNrQ3VycmVudFNwZWVkXCIsXG4gICAgICBcIlRyYWNrQ3VycmVudFRpbWVcIixcbiAgICAgIFwiVHJhY2tEaXN0YW5jZUF0XCIsXG4gICAgICBcIlRyYWNrRGlzdGFuY2VXaW5kb3dcIixcbiAgICAgIFwiVHJhY2tEdXJhdGlvblwiLFxuICAgICAgXCJUcmFja0ZpZWxkV2luZG93XCIsXG4gICAgICBcIlRyYWNrR2VvbWV0cnlXaW5kb3dcIixcbiAgICAgIFwiVHJhY2tJbmRleFwiLFxuICAgICAgXCJUcmFja1NwZWVkQXRcIixcbiAgICAgIFwiVHJhY2tTcGVlZFdpbmRvd1wiLFxuICAgICAgXCJUcmFja1N0YXJ0VGltZVwiLFxuICAgICAgXCJUcmFja1dpbmRvd1wiLFxuICAgICAgXCJUcmltXCIsXG4gICAgICBcIlR5cGVPZlwiLFxuICAgICAgXCJVbmlvblwiLFxuICAgICAgXCJVcHBlclwiLFxuICAgICAgXCJVcmxFbmNvZGVcIixcbiAgICAgIFwiVmFyaWFuY2VcIixcbiAgICAgIFwiV2Vla1wiLFxuICAgICAgXCJXZWVrZGF5XCIsXG4gICAgICBcIldoZW5cIixcbiAgICAgIFwiV2l0aGluXCIsXG4gICAgICBcIlllYXJcIlxuICAgIF1cbiAgfTtcbiAgY29uc3QgU1lNQk9MID0ge1xuICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgYmVnaW46ICdcXFxcJFtkYXRhc3RvcmV8ZmVhdHVyZXxsYXllcnxtYXB8bWVhc3VyZXxzb3VyY2VmZWF0dXJlfHNvdXJjZWxheWVyfHRhcmdldGZlYXR1cmV8dGFyZ2V0bGF5ZXJ8dmFsdWV8dmlld10rJ1xuICB9O1xuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ1xcXFxiKDBbYkJdWzAxXSspJyB9LFxuICAgICAgeyBiZWdpbjogJ1xcXFxiKDBbb09dWzAtN10rKScgfSxcbiAgICAgIHsgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUgfVxuICAgIF0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogJ1xcXFwkXFxcXHsnLFxuICAgIGVuZDogJ1xcXFx9JyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtdIC8vIGRlZmluZWQgbGF0ZXJcbiAgfTtcbiAgY29uc3QgVEVNUExBVEVfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdgJyxcbiAgICBlbmQ6ICdgJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgU1VCU1RcbiAgICBdXG4gIH07XG4gIFNVQlNULmNvbnRhaW5zID0gW1xuICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICBOVU1CRVIsXG4gICAgaGxqcy5SRUdFWFBfTU9ERVxuICBdO1xuICBjb25zdCBQQVJBTVNfQ09OVEFJTlMgPSBTVUJTVC5jb250YWlucy5jb25jYXQoW1xuICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFXG4gIF0pO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0FyY0dJUyBBcmNhZGUnLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgVEVNUExBVEVfU1RSSU5HLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIFNZTUJPTCxcbiAgICAgIE5VTUJFUixcbiAgICAgIHsgLy8gb2JqZWN0IGF0dHIgY29udGFpbmVyXG4gICAgICAgIGJlZ2luOiAvW3ssXVxccyovLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IElERU5UX1JFICsgJ1xcXFxzKjonLFxuICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgICAgICAgICAgICAgYmVnaW46IElERU5UX1JFLFxuICAgICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgeyAvLyBcInZhbHVlXCIgY29udGFpbmVyXG4gICAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJ3xcXFxcYihyZXR1cm4pXFxcXGIpXFxcXHMqJyxcbiAgICAgICAga2V5d29yZHM6ICdyZXR1cm4nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIGhsanMuUkVHRVhQX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgYmVnaW46ICcoXFxcXCguKj9cXFxcKXwnICsgSURFTlRfUkUgKyAnKVxcXFxzKj0+JyxcbiAgICAgICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgZW5kOiAnXFxcXHMqPT4nLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgICAgICAgIHsgYmVnaW46IElERU5UX1JFIH0sXG4gICAgICAgICAgICAgICAgICB7IGJlZ2luOiAvXFwoXFxzKlxcKS8gfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbnM6IFBBUkFNU19DT05UQUlOU1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBlbmQ6IC9cXHsvLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0aXRsZS5mdW5jdGlvblwiLFxuICAgICAgICAgICAgYmVnaW46IElERU5UX1JFXG4gICAgICAgICAgfSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFwoLyxcbiAgICAgICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IFBBUkFNU19DT05UQUlOU1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWxsZWdhbDogL1xcW3wlL1xuICAgICAgfSxcbiAgICAgIHsgYmVnaW46IC9cXCRbKC5dLyB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAvIyg/ISEpL1xuICB9O1xufVxuXG5leHBvcnQgeyBhcmNhZGUgYXMgZGVmYXVsdCB9O1xuIl19