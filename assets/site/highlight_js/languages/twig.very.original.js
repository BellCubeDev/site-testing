function twig(hljs) {
    const regex = hljs.regex;
    const FUNCTION_NAMES = [
        "absolute_url",
        "asset|0",
        "asset_version",
        "attribute",
        "block",
        "constant",
        "controller|0",
        "country_timezones",
        "csrf_token",
        "cycle",
        "date",
        "dump",
        "expression",
        "form|0",
        "form_end",
        "form_errors",
        "form_help",
        "form_label",
        "form_rest",
        "form_row",
        "form_start",
        "form_widget",
        "html_classes",
        "include",
        "is_granted",
        "logout_path",
        "logout_url",
        "max",
        "min",
        "parent",
        "path|0",
        "random",
        "range",
        "relative_path",
        "render",
        "render_esi",
        "source",
        "template_from_string",
        "url|0"
    ];
    const FILTERS = [
        "abs",
        "abbr_class",
        "abbr_method",
        "batch",
        "capitalize",
        "column",
        "convert_encoding",
        "country_name",
        "currency_name",
        "currency_symbol",
        "data_uri",
        "date",
        "date_modify",
        "default",
        "escape",
        "file_excerpt",
        "file_link",
        "file_relative",
        "filter",
        "first",
        "format",
        "format_args",
        "format_args_as_text",
        "format_currency",
        "format_date",
        "format_datetime",
        "format_file",
        "format_file_from_text",
        "format_number",
        "format_time",
        "html_to_markdown",
        "humanize",
        "inky_to_html",
        "inline_css",
        "join",
        "json_encode",
        "keys",
        "language_name",
        "last",
        "length",
        "locale_name",
        "lower",
        "map",
        "markdown",
        "markdown_to_html",
        "merge",
        "nl2br",
        "number_format",
        "raw",
        "reduce",
        "replace",
        "reverse",
        "round",
        "slice",
        "slug",
        "sort",
        "spaceless",
        "split",
        "striptags",
        "timezone_name",
        "title",
        "trans",
        "transchoice",
        "trim",
        "u|0",
        "upper",
        "url_encode",
        "yaml_dump",
        "yaml_encode"
    ];
    let TAG_NAMES = [
        "apply",
        "autoescape",
        "block",
        "cache",
        "deprecated",
        "do",
        "embed",
        "extends",
        "filter",
        "flush",
        "for",
        "form_theme",
        "from",
        "if",
        "import",
        "include",
        "macro",
        "sandbox",
        "set",
        "stopwatch",
        "trans",
        "trans_default_domain",
        "transchoice",
        "use",
        "verbatim",
        "with"
    ];
    TAG_NAMES = TAG_NAMES.concat(TAG_NAMES.map(t => `end${t}`));
    const STRING = {
        scope: 'string',
        variants: [
            {
                begin: /'/,
                end: /'/
            },
            {
                begin: /"/,
                end: /"/
            },
        ]
    };
    const NUMBER = {
        scope: "number",
        match: /\d+/
    };
    const PARAMS = {
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        contains: [
            STRING,
            NUMBER
        ]
    };
    const FUNCTIONS = {
        beginKeywords: FUNCTION_NAMES.join(" "),
        keywords: { name: FUNCTION_NAMES },
        relevance: 0,
        contains: [PARAMS]
    };
    const FILTER = {
        match: /\|(?=[A-Za-z_]+:?)/,
        beginScope: "punctuation",
        relevance: 0,
        contains: [
            {
                match: /[A-Za-z_]+:?/,
                keywords: FILTERS
            },
        ]
    };
    const tagNamed = (tagnames, { relevance }) => {
        return {
            beginScope: {
                1: 'template-tag',
                3: 'name'
            },
            relevance: relevance || 2,
            endScope: 'template-tag',
            begin: [
                /\{%/,
                /\s*/,
                regex.either(...tagnames)
            ],
            end: /%\}/,
            keywords: "in",
            contains: [
                FILTER,
                FUNCTIONS,
                STRING,
                NUMBER
            ]
        };
    };
    const CUSTOM_TAG_RE = /[a-z_]+/;
    const TAG = tagNamed(TAG_NAMES, { relevance: 2 });
    const CUSTOM_TAG = tagNamed([CUSTOM_TAG_RE], { relevance: 1 });
    return {
        name: 'Twig',
        aliases: ['craftcms'],
        case_insensitive: true,
        subLanguage: 'xml',
        contains: [
            hljs.COMMENT(/\{#/, /#\}/),
            TAG,
            CUSTOM_TAG,
            {
                className: 'template-variable',
                begin: /\{\{/,
                end: /\}\}/,
                contains: [
                    'self',
                    FILTER,
                    FUNCTIONS,
                    STRING,
                    NUMBER
                ]
            }
        ]
    };
}
export { twig as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpZy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3R3aWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sY0FBYyxHQUFHO1FBQ3JCLGNBQWM7UUFDZCxTQUFTO1FBQ1QsZUFBZTtRQUNmLFdBQVc7UUFDWCxPQUFPO1FBQ1AsVUFBVTtRQUNWLGNBQWM7UUFDZCxtQkFBbUI7UUFDbkIsWUFBWTtRQUNaLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLFlBQVk7UUFDWixRQUFRO1FBQ1IsVUFBVTtRQUNWLGFBQWE7UUFDYixXQUFXO1FBQ1gsWUFBWTtRQUNaLFdBQVc7UUFDWCxVQUFVO1FBQ1YsWUFBWTtRQUNaLGFBQWE7UUFDYixjQUFjO1FBQ2QsU0FBUztRQUNULFlBQVk7UUFDWixhQUFhO1FBQ2IsWUFBWTtRQUNaLEtBQUs7UUFDTCxLQUFLO1FBQ0wsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLGVBQWU7UUFDZixRQUFRO1FBQ1IsWUFBWTtRQUNaLFFBQVE7UUFDUixzQkFBc0I7UUFDdEIsT0FBTztLQUNSLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRztRQUNkLEtBQUs7UUFDTCxZQUFZO1FBQ1osYUFBYTtRQUNiLE9BQU87UUFDUCxZQUFZO1FBQ1osUUFBUTtRQUNSLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QsZUFBZTtRQUNmLGlCQUFpQjtRQUNqQixVQUFVO1FBQ1YsTUFBTTtRQUNOLGFBQWE7UUFDYixTQUFTO1FBQ1QsUUFBUTtRQUNSLGNBQWM7UUFDZCxXQUFXO1FBQ1gsZUFBZTtRQUNmLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLGFBQWE7UUFDYixxQkFBcUI7UUFDckIsaUJBQWlCO1FBQ2pCLGFBQWE7UUFDYixpQkFBaUI7UUFDakIsYUFBYTtRQUNiLHVCQUF1QjtRQUN2QixlQUFlO1FBQ2YsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixVQUFVO1FBQ1YsY0FBYztRQUNkLFlBQVk7UUFDWixNQUFNO1FBQ04sYUFBYTtRQUNiLE1BQU07UUFDTixlQUFlO1FBQ2YsTUFBTTtRQUNOLFFBQVE7UUFDUixhQUFhO1FBQ2IsT0FBTztRQUNQLEtBQUs7UUFDTCxVQUFVO1FBQ1Ysa0JBQWtCO1FBQ2xCLE9BQU87UUFDUCxPQUFPO1FBQ1AsZUFBZTtRQUNmLEtBQUs7UUFDTCxRQUFRO1FBQ1IsU0FBUztRQUNULFNBQVM7UUFDVCxPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixNQUFNO1FBQ04sV0FBVztRQUNYLE9BQU87UUFDUCxXQUFXO1FBQ1gsZUFBZTtRQUNmLE9BQU87UUFDUCxPQUFPO1FBQ1AsYUFBYTtRQUNiLE1BQU07UUFDTixLQUFLO1FBQ0wsT0FBTztRQUNQLFlBQVk7UUFDWixXQUFXO1FBQ1gsYUFBYTtLQUNkLENBQUM7SUFFRixJQUFJLFNBQVMsR0FBRztRQUNkLE9BQU87UUFDUCxZQUFZO1FBQ1osT0FBTztRQUNQLE9BQU87UUFDUCxZQUFZO1FBQ1osSUFBSTtRQUNKLE9BQU87UUFDUCxTQUFTO1FBQ1QsUUFBUTtRQUNSLE9BQU87UUFDUCxLQUFLO1FBQ0wsWUFBWTtRQUNaLE1BQU07UUFDTixJQUFJO1FBQ0osUUFBUTtRQUNSLFNBQVM7UUFDVCxPQUFPO1FBQ1AsU0FBUztRQUNULEtBQUs7UUFDTCxXQUFXO1FBQ1gsT0FBTztRQUNQLHNCQUFzQjtRQUN0QixhQUFhO1FBQ2IsS0FBSztRQUNMLFVBQVU7UUFDVixNQUFNO0tBQ1AsQ0FBQztJQUVGLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU1RCxNQUFNLE1BQU0sR0FBRztRQUNiLEtBQUssRUFBRSxRQUFRO1FBQ2YsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7YUFDVDtZQUNEO2dCQUNFLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7U0FDRjtLQUNGLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRztRQUNiLEtBQUssRUFBRSxRQUFRO1FBQ2YsS0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVBQUUsSUFBSTtRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsWUFBWSxFQUFFLElBQUk7UUFDbEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLE1BQU07U0FDUDtLQUNGLENBQUM7SUFHRixNQUFNLFNBQVMsR0FBRztRQUNoQixhQUFhLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDdkMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRTtRQUNsQyxTQUFTLEVBQUUsQ0FBQztRQUNaLFFBQVEsRUFBRSxDQUFFLE1BQU0sQ0FBRTtLQUNyQixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVBQUUsb0JBQW9CO1FBQzNCLFVBQVUsRUFBRSxhQUFhO1FBQ3pCLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLFFBQVEsRUFBRSxPQUFPO2FBQ2xCO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO1FBQzNDLE9BQU87WUFDTCxVQUFVLEVBQUU7Z0JBQ1YsQ0FBQyxFQUFFLGNBQWM7Z0JBQ2pCLENBQUMsRUFBRSxNQUFNO2FBQ1Y7WUFDRCxTQUFTLEVBQUUsU0FBUyxJQUFJLENBQUM7WUFDekIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsS0FBSyxFQUFFO2dCQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQzFCO1lBQ0QsR0FBRyxFQUFFLEtBQUs7WUFDVixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRTtnQkFDUixNQUFNO2dCQUNOLFNBQVM7Z0JBQ1QsTUFBTTtnQkFDTixNQUFNO2FBQ1A7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBRSxhQUFhLENBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRWpFLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFFLFVBQVUsQ0FBRTtRQUN2QixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztZQUMxQixHQUFHO1lBQ0gsVUFBVTtZQUNWO2dCQUNFLFNBQVMsRUFBRSxtQkFBbUI7Z0JBQzlCLEtBQUssRUFBRSxNQUFNO2dCQUNiLEdBQUcsRUFBRSxNQUFNO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixNQUFNO29CQUNOLE1BQU07b0JBQ04sU0FBUztvQkFDVCxNQUFNO29CQUNOLE1BQU07aUJBQ1A7YUFDRjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBUd2lnXG5SZXF1aXJlczogeG1sLmpzXG5BdXRob3I6IEx1a2UgSG9sZGVyIDxsdWtlbWhAZ21haWwuY29tPlxuRGVzY3JpcHRpb246IFR3aWcgaXMgYSB0ZW1wbGF0aW5nIGxhbmd1YWdlIGZvciBQSFBcbldlYnNpdGU6IGh0dHBzOi8vdHdpZy5zeW1mb255LmNvbVxuQ2F0ZWdvcnk6IHRlbXBsYXRlXG4qL1xuXG5mdW5jdGlvbiB0d2lnKGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICBjb25zdCBGVU5DVElPTl9OQU1FUyA9IFtcbiAgICBcImFic29sdXRlX3VybFwiLFxuICAgIFwiYXNzZXR8MFwiLFxuICAgIFwiYXNzZXRfdmVyc2lvblwiLFxuICAgIFwiYXR0cmlidXRlXCIsXG4gICAgXCJibG9ja1wiLFxuICAgIFwiY29uc3RhbnRcIixcbiAgICBcImNvbnRyb2xsZXJ8MFwiLFxuICAgIFwiY291bnRyeV90aW1lem9uZXNcIixcbiAgICBcImNzcmZfdG9rZW5cIixcbiAgICBcImN5Y2xlXCIsXG4gICAgXCJkYXRlXCIsXG4gICAgXCJkdW1wXCIsXG4gICAgXCJleHByZXNzaW9uXCIsXG4gICAgXCJmb3JtfDBcIixcbiAgICBcImZvcm1fZW5kXCIsXG4gICAgXCJmb3JtX2Vycm9yc1wiLFxuICAgIFwiZm9ybV9oZWxwXCIsXG4gICAgXCJmb3JtX2xhYmVsXCIsXG4gICAgXCJmb3JtX3Jlc3RcIixcbiAgICBcImZvcm1fcm93XCIsXG4gICAgXCJmb3JtX3N0YXJ0XCIsXG4gICAgXCJmb3JtX3dpZGdldFwiLFxuICAgIFwiaHRtbF9jbGFzc2VzXCIsXG4gICAgXCJpbmNsdWRlXCIsXG4gICAgXCJpc19ncmFudGVkXCIsXG4gICAgXCJsb2dvdXRfcGF0aFwiLFxuICAgIFwibG9nb3V0X3VybFwiLFxuICAgIFwibWF4XCIsXG4gICAgXCJtaW5cIixcbiAgICBcInBhcmVudFwiLFxuICAgIFwicGF0aHwwXCIsXG4gICAgXCJyYW5kb21cIixcbiAgICBcInJhbmdlXCIsXG4gICAgXCJyZWxhdGl2ZV9wYXRoXCIsXG4gICAgXCJyZW5kZXJcIixcbiAgICBcInJlbmRlcl9lc2lcIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwidGVtcGxhdGVfZnJvbV9zdHJpbmdcIixcbiAgICBcInVybHwwXCJcbiAgXTtcblxuICBjb25zdCBGSUxURVJTID0gW1xuICAgIFwiYWJzXCIsXG4gICAgXCJhYmJyX2NsYXNzXCIsXG4gICAgXCJhYmJyX21ldGhvZFwiLFxuICAgIFwiYmF0Y2hcIixcbiAgICBcImNhcGl0YWxpemVcIixcbiAgICBcImNvbHVtblwiLFxuICAgIFwiY29udmVydF9lbmNvZGluZ1wiLFxuICAgIFwiY291bnRyeV9uYW1lXCIsXG4gICAgXCJjdXJyZW5jeV9uYW1lXCIsXG4gICAgXCJjdXJyZW5jeV9zeW1ib2xcIixcbiAgICBcImRhdGFfdXJpXCIsXG4gICAgXCJkYXRlXCIsXG4gICAgXCJkYXRlX21vZGlmeVwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZXNjYXBlXCIsXG4gICAgXCJmaWxlX2V4Y2VycHRcIixcbiAgICBcImZpbGVfbGlua1wiLFxuICAgIFwiZmlsZV9yZWxhdGl2ZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJmaXJzdFwiLFxuICAgIFwiZm9ybWF0XCIsXG4gICAgXCJmb3JtYXRfYXJnc1wiLFxuICAgIFwiZm9ybWF0X2FyZ3NfYXNfdGV4dFwiLFxuICAgIFwiZm9ybWF0X2N1cnJlbmN5XCIsXG4gICAgXCJmb3JtYXRfZGF0ZVwiLFxuICAgIFwiZm9ybWF0X2RhdGV0aW1lXCIsXG4gICAgXCJmb3JtYXRfZmlsZVwiLFxuICAgIFwiZm9ybWF0X2ZpbGVfZnJvbV90ZXh0XCIsXG4gICAgXCJmb3JtYXRfbnVtYmVyXCIsXG4gICAgXCJmb3JtYXRfdGltZVwiLFxuICAgIFwiaHRtbF90b19tYXJrZG93blwiLFxuICAgIFwiaHVtYW5pemVcIixcbiAgICBcImlua3lfdG9faHRtbFwiLFxuICAgIFwiaW5saW5lX2Nzc1wiLFxuICAgIFwiam9pblwiLFxuICAgIFwianNvbl9lbmNvZGVcIixcbiAgICBcImtleXNcIixcbiAgICBcImxhbmd1YWdlX25hbWVcIixcbiAgICBcImxhc3RcIixcbiAgICBcImxlbmd0aFwiLFxuICAgIFwibG9jYWxlX25hbWVcIixcbiAgICBcImxvd2VyXCIsXG4gICAgXCJtYXBcIixcbiAgICBcIm1hcmtkb3duXCIsXG4gICAgXCJtYXJrZG93bl90b19odG1sXCIsXG4gICAgXCJtZXJnZVwiLFxuICAgIFwibmwyYnJcIixcbiAgICBcIm51bWJlcl9mb3JtYXRcIixcbiAgICBcInJhd1wiLFxuICAgIFwicmVkdWNlXCIsXG4gICAgXCJyZXBsYWNlXCIsXG4gICAgXCJyZXZlcnNlXCIsXG4gICAgXCJyb3VuZFwiLFxuICAgIFwic2xpY2VcIixcbiAgICBcInNsdWdcIixcbiAgICBcInNvcnRcIixcbiAgICBcInNwYWNlbGVzc1wiLFxuICAgIFwic3BsaXRcIixcbiAgICBcInN0cmlwdGFnc1wiLFxuICAgIFwidGltZXpvbmVfbmFtZVwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcInRyYW5zXCIsXG4gICAgXCJ0cmFuc2Nob2ljZVwiLFxuICAgIFwidHJpbVwiLFxuICAgIFwidXwwXCIsXG4gICAgXCJ1cHBlclwiLFxuICAgIFwidXJsX2VuY29kZVwiLFxuICAgIFwieWFtbF9kdW1wXCIsXG4gICAgXCJ5YW1sX2VuY29kZVwiXG4gIF07XG5cbiAgbGV0IFRBR19OQU1FUyA9IFtcbiAgICBcImFwcGx5XCIsXG4gICAgXCJhdXRvZXNjYXBlXCIsXG4gICAgXCJibG9ja1wiLFxuICAgIFwiY2FjaGVcIixcbiAgICBcImRlcHJlY2F0ZWRcIixcbiAgICBcImRvXCIsXG4gICAgXCJlbWJlZFwiLFxuICAgIFwiZXh0ZW5kc1wiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJmbHVzaFwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmb3JtX3RoZW1lXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJpbmNsdWRlXCIsXG4gICAgXCJtYWNyb1wiLFxuICAgIFwic2FuZGJveFwiLFxuICAgIFwic2V0XCIsXG4gICAgXCJzdG9wd2F0Y2hcIixcbiAgICBcInRyYW5zXCIsXG4gICAgXCJ0cmFuc19kZWZhdWx0X2RvbWFpblwiLFxuICAgIFwidHJhbnNjaG9pY2VcIixcbiAgICBcInVzZVwiLFxuICAgIFwidmVyYmF0aW1cIixcbiAgICBcIndpdGhcIlxuICBdO1xuXG4gIFRBR19OQU1FUyA9IFRBR19OQU1FUy5jb25jYXQoVEFHX05BTUVTLm1hcCh0ID0+IGBlbmQke3R9YCkpO1xuXG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBzY29wZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC8nLyxcbiAgICAgICAgZW5kOiAvJy9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXCIvLFxuICAgICAgICBlbmQ6IC9cIi9cbiAgICAgIH0sXG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IE5VTUJFUiA9IHtcbiAgICBzY29wZTogXCJudW1iZXJcIixcbiAgICBtYXRjaDogL1xcZCsvXG4gIH07XG5cbiAgY29uc3QgUEFSQU1TID0ge1xuICAgIGJlZ2luOiAvXFwoLyxcbiAgICBlbmQ6IC9cXCkvLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBTVFJJTkcsXG4gICAgICBOVU1CRVJcbiAgICBdXG4gIH07XG5cblxuICBjb25zdCBGVU5DVElPTlMgPSB7XG4gICAgYmVnaW5LZXl3b3JkczogRlVOQ1RJT05fTkFNRVMuam9pbihcIiBcIiksXG4gICAga2V5d29yZHM6IHsgbmFtZTogRlVOQ1RJT05fTkFNRVMgfSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFsgUEFSQU1TIF1cbiAgfTtcblxuICBjb25zdCBGSUxURVIgPSB7XG4gICAgbWF0Y2g6IC9cXHwoPz1bQS1aYS16X10rOj8pLyxcbiAgICBiZWdpblNjb3BlOiBcInB1bmN0dWF0aW9uXCIsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiAvW0EtWmEtel9dKzo/LyxcbiAgICAgICAga2V5d29yZHM6IEZJTFRFUlNcbiAgICAgIH0sXG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IHRhZ05hbWVkID0gKHRhZ25hbWVzLCB7IHJlbGV2YW5jZSB9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJlZ2luU2NvcGU6IHtcbiAgICAgICAgMTogJ3RlbXBsYXRlLXRhZycsXG4gICAgICAgIDM6ICduYW1lJ1xuICAgICAgfSxcbiAgICAgIHJlbGV2YW5jZTogcmVsZXZhbmNlIHx8IDIsXG4gICAgICBlbmRTY29wZTogJ3RlbXBsYXRlLXRhZycsXG4gICAgICBiZWdpbjogW1xuICAgICAgICAvXFx7JS8sXG4gICAgICAgIC9cXHMqLyxcbiAgICAgICAgcmVnZXguZWl0aGVyKC4uLnRhZ25hbWVzKVxuICAgICAgXSxcbiAgICAgIGVuZDogLyVcXH0vLFxuICAgICAga2V5d29yZHM6IFwiaW5cIixcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIEZJTFRFUixcbiAgICAgICAgRlVOQ1RJT05TLFxuICAgICAgICBTVFJJTkcsXG4gICAgICAgIE5VTUJFUlxuICAgICAgXVxuICAgIH07XG4gIH07XG5cbiAgY29uc3QgQ1VTVE9NX1RBR19SRSA9IC9bYS16X10rLztcbiAgY29uc3QgVEFHID0gdGFnTmFtZWQoVEFHX05BTUVTLCB7IHJlbGV2YW5jZTogMiB9KTtcbiAgY29uc3QgQ1VTVE9NX1RBRyA9IHRhZ05hbWVkKFsgQ1VTVE9NX1RBR19SRSBdLCB7IHJlbGV2YW5jZTogMSB9KTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdUd2lnJyxcbiAgICBhbGlhc2VzOiBbICdjcmFmdGNtcycgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DT01NRU5UKC9cXHsjLywgLyNcXH0vKSxcbiAgICAgIFRBRyxcbiAgICAgIENVU1RPTV9UQUcsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlLXZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46IC9cXHtcXHsvLFxuICAgICAgICBlbmQ6IC9cXH1cXH0vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICBGSUxURVIsXG4gICAgICAgICAgRlVOQ1RJT05TLFxuICAgICAgICAgIFNUUklORyxcbiAgICAgICAgICBOVU1CRVJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgdHdpZyBhcyBkZWZhdWx0IH07XG4iXX0=