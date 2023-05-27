function axapta(hljs) {
    const IDENT_RE = hljs.UNDERSCORE_IDENT_RE;
    const BUILT_IN_KEYWORDS = [
        'anytype',
        'boolean',
        'byte',
        'char',
        'container',
        'date',
        'double',
        'enum',
        'guid',
        'int',
        'int64',
        'long',
        'real',
        'short',
        'str',
        'utcdatetime',
        'var'
    ];
    const LITERAL_KEYWORDS = [
        'default',
        'false',
        'null',
        'true'
    ];
    const NORMAL_KEYWORDS = [
        'abstract',
        'as',
        'asc',
        'avg',
        'break',
        'breakpoint',
        'by',
        'byref',
        'case',
        'catch',
        'changecompany',
        'class',
        'client',
        'client',
        'common',
        'const',
        'continue',
        'count',
        'crosscompany',
        'delegate',
        'delete_from',
        'desc',
        'display',
        'div',
        'do',
        'edit',
        'else',
        'eventhandler',
        'exists',
        'extends',
        'final',
        'finally',
        'firstfast',
        'firstonly',
        'firstonly1',
        'firstonly10',
        'firstonly100',
        'firstonly1000',
        'flush',
        'for',
        'forceliterals',
        'forcenestedloop',
        'forceplaceholders',
        'forceselectorder',
        'forupdate',
        'from',
        'generateonly',
        'group',
        'hint',
        'if',
        'implements',
        'in',
        'index',
        'insert_recordset',
        'interface',
        'internal',
        'is',
        'join',
        'like',
        'maxof',
        'minof',
        'mod',
        'namespace',
        'new',
        'next',
        'nofetch',
        'notexists',
        'optimisticlock',
        'order',
        'outer',
        'pessimisticlock',
        'print',
        'private',
        'protected',
        'public',
        'readonly',
        'repeatableread',
        'retry',
        'return',
        'reverse',
        'select',
        'server',
        'setting',
        'static',
        'sum',
        'super',
        'switch',
        'this',
        'throw',
        'try',
        'ttsabort',
        'ttsbegin',
        'ttscommit',
        'unchecked',
        'update_recordset',
        'using',
        'validtimestate',
        'void',
        'where',
        'while'
    ];
    const KEYWORDS = {
        keyword: NORMAL_KEYWORDS,
        built_in: BUILT_IN_KEYWORDS,
        literal: LITERAL_KEYWORDS
    };
    const CLASS_DEFINITION = {
        variants: [
            { match: [
                    /(class|interface)\s+/,
                    IDENT_RE,
                    /\s+(extends|implements)\s+/,
                    IDENT_RE
                ] },
            { match: [
                    /class\s+/,
                    IDENT_RE
                ] }
        ],
        scope: {
            2: "title.class",
            4: "title.class.inherited"
        },
        keywords: KEYWORDS
    };
    return {
        name: 'X++',
        aliases: ['x++'],
        keywords: KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: '#',
                end: '$'
            },
            CLASS_DEFINITION
        ]
    };
}
export { axapta as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhhcHRhLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYXhhcHRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO0lBQzFDLE1BQU0saUJBQWlCLEdBQUc7UUFDeEIsU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNO1FBQ04sTUFBTTtRQUNOLFdBQVc7UUFDWCxNQUFNO1FBQ04sUUFBUTtRQUNSLE1BQU07UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLE9BQU87UUFDUCxLQUFLO1FBQ0wsYUFBYTtRQUNiLEtBQUs7S0FDTixDQUFDO0lBRUYsTUFBTSxnQkFBZ0IsR0FBRztRQUN2QixTQUFTO1FBQ1QsT0FBTztRQUNQLE1BQU07UUFDTixNQUFNO0tBQ1AsQ0FBQztJQUVGLE1BQU0sZUFBZSxHQUFHO1FBQ3RCLFVBQVU7UUFDVixJQUFJO1FBQ0osS0FBSztRQUNMLEtBQUs7UUFDTCxPQUFPO1FBQ1AsWUFBWTtRQUNaLElBQUk7UUFDSixPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxlQUFlO1FBQ2YsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLE9BQU87UUFDUCxVQUFVO1FBQ1YsT0FBTztRQUNQLGNBQWM7UUFDZCxVQUFVO1FBQ1YsYUFBYTtRQUNiLE1BQU07UUFDTixTQUFTO1FBQ1QsS0FBSztRQUNMLElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtRQUNOLGNBQWM7UUFDZCxRQUFRO1FBQ1IsU0FBUztRQUNULE9BQU87UUFDUCxTQUFTO1FBQ1QsV0FBVztRQUNYLFdBQVc7UUFDWCxZQUFZO1FBQ1osYUFBYTtRQUNiLGNBQWM7UUFDZCxlQUFlO1FBQ2YsT0FBTztRQUNQLEtBQUs7UUFDTCxlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLG1CQUFtQjtRQUNuQixrQkFBa0I7UUFDbEIsV0FBVztRQUNYLE1BQU07UUFDTixjQUFjO1FBQ2QsT0FBTztRQUNQLE1BQU07UUFDTixJQUFJO1FBQ0osWUFBWTtRQUNaLElBQUk7UUFDSixPQUFPO1FBQ1Asa0JBQWtCO1FBQ2xCLFdBQVc7UUFDWCxVQUFVO1FBQ1YsSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxLQUFLO1FBQ0wsV0FBVztRQUNYLEtBQUs7UUFDTCxNQUFNO1FBQ04sU0FBUztRQUNULFdBQVc7UUFDWCxnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLE9BQU87UUFDUCxpQkFBaUI7UUFDakIsT0FBTztRQUNQLFNBQVM7UUFDVCxXQUFXO1FBQ1gsUUFBUTtRQUNSLFVBQVU7UUFDVixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFFBQVE7UUFDUixTQUFTO1FBQ1QsUUFBUTtRQUNSLFFBQVE7UUFDUixTQUFTO1FBQ1QsUUFBUTtRQUNSLEtBQUs7UUFDTCxPQUFPO1FBQ1AsUUFBUTtRQUNSLE1BQU07UUFDTixPQUFPO1FBQ1AsS0FBSztRQUNMLFVBQVU7UUFDVixVQUFVO1FBQ1YsV0FBVztRQUNYLFdBQVc7UUFDWCxrQkFBa0I7UUFDbEIsT0FBTztRQUNQLGdCQUFnQjtRQUNoQixNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87S0FDUixDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUc7UUFDZixPQUFPLEVBQUUsZUFBZTtRQUN4QixRQUFRLEVBQUUsaUJBQWlCO1FBQzNCLE9BQU8sRUFBRSxnQkFBZ0I7S0FDMUIsQ0FBQztJQUVGLE1BQU0sZ0JBQWdCLEdBQUc7UUFDdkIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUU7b0JBQ1Asc0JBQXNCO29CQUN0QixRQUFRO29CQUNSLDRCQUE0QjtvQkFDNUIsUUFBUTtpQkFDVCxFQUFFO1lBQ0gsRUFBRSxLQUFLLEVBQUU7b0JBQ1AsVUFBVTtvQkFDVixRQUFRO2lCQUNULEVBQUU7U0FDSjtRQUNELEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxhQUFhO1lBQ2hCLENBQUMsRUFBRSx1QkFBdUI7U0FDM0I7UUFDRCxRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLENBQUUsS0FBSyxDQUFFO1FBQ2xCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUI7WUFDeEIsSUFBSSxDQUFDLG9CQUFvQjtZQUN6QixJQUFJLENBQUMsZ0JBQWdCO1lBQ3JCLElBQUksQ0FBQyxpQkFBaUI7WUFDdEIsSUFBSSxDQUFDLGFBQWE7WUFDbEI7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7WUFDRCxnQkFBZ0I7U0FDakI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IE1pY3Jvc29mdCBYKytcbkRlc2NyaXB0aW9uOiBYKysgaXMgYSBsYW5ndWFnZSB1c2VkIGluIE1pY3Jvc29mdCBEeW5hbWljcyAzNjUsIER5bmFtaWNzIEFYLCBhbmQgQXhhcHRhLlxuQXV0aG9yOiBEbWl0cmkgUm91ZGFrb3YgPGRtaXRyaUByb3VkYWtvdi5ydT5cbldlYnNpdGU6IGh0dHBzOi8vZHluYW1pY3MubWljcm9zb2Z0LmNvbS9lbi11cy9heC1vdmVydmlldy9cbkNhdGVnb3J5OiBlbnRlcnByaXNlXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gYXhhcHRhKGhsanMpIHtcbiAgY29uc3QgSURFTlRfUkUgPSBobGpzLlVOREVSU0NPUkVfSURFTlRfUkU7XG4gIGNvbnN0IEJVSUxUX0lOX0tFWVdPUkRTID0gW1xuICAgICdhbnl0eXBlJyxcbiAgICAnYm9vbGVhbicsXG4gICAgJ2J5dGUnLFxuICAgICdjaGFyJyxcbiAgICAnY29udGFpbmVyJyxcbiAgICAnZGF0ZScsXG4gICAgJ2RvdWJsZScsXG4gICAgJ2VudW0nLFxuICAgICdndWlkJyxcbiAgICAnaW50JyxcbiAgICAnaW50NjQnLFxuICAgICdsb25nJyxcbiAgICAncmVhbCcsXG4gICAgJ3Nob3J0JyxcbiAgICAnc3RyJyxcbiAgICAndXRjZGF0ZXRpbWUnLFxuICAgICd2YXInXG4gIF07XG5cbiAgY29uc3QgTElURVJBTF9LRVlXT1JEUyA9IFtcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2ZhbHNlJyxcbiAgICAnbnVsbCcsXG4gICAgJ3RydWUnXG4gIF07XG5cbiAgY29uc3QgTk9STUFMX0tFWVdPUkRTID0gW1xuICAgICdhYnN0cmFjdCcsXG4gICAgJ2FzJyxcbiAgICAnYXNjJyxcbiAgICAnYXZnJyxcbiAgICAnYnJlYWsnLFxuICAgICdicmVha3BvaW50JyxcbiAgICAnYnknLFxuICAgICdieXJlZicsXG4gICAgJ2Nhc2UnLFxuICAgICdjYXRjaCcsXG4gICAgJ2NoYW5nZWNvbXBhbnknLFxuICAgICdjbGFzcycsXG4gICAgJ2NsaWVudCcsXG4gICAgJ2NsaWVudCcsXG4gICAgJ2NvbW1vbicsXG4gICAgJ2NvbnN0JyxcbiAgICAnY29udGludWUnLFxuICAgICdjb3VudCcsXG4gICAgJ2Nyb3NzY29tcGFueScsXG4gICAgJ2RlbGVnYXRlJyxcbiAgICAnZGVsZXRlX2Zyb20nLFxuICAgICdkZXNjJyxcbiAgICAnZGlzcGxheScsXG4gICAgJ2RpdicsXG4gICAgJ2RvJyxcbiAgICAnZWRpdCcsXG4gICAgJ2Vsc2UnLFxuICAgICdldmVudGhhbmRsZXInLFxuICAgICdleGlzdHMnLFxuICAgICdleHRlbmRzJyxcbiAgICAnZmluYWwnLFxuICAgICdmaW5hbGx5JyxcbiAgICAnZmlyc3RmYXN0JyxcbiAgICAnZmlyc3Rvbmx5JyxcbiAgICAnZmlyc3Rvbmx5MScsXG4gICAgJ2ZpcnN0b25seTEwJyxcbiAgICAnZmlyc3Rvbmx5MTAwJyxcbiAgICAnZmlyc3Rvbmx5MTAwMCcsXG4gICAgJ2ZsdXNoJyxcbiAgICAnZm9yJyxcbiAgICAnZm9yY2VsaXRlcmFscycsXG4gICAgJ2ZvcmNlbmVzdGVkbG9vcCcsXG4gICAgJ2ZvcmNlcGxhY2Vob2xkZXJzJyxcbiAgICAnZm9yY2VzZWxlY3RvcmRlcicsXG4gICAgJ2ZvcnVwZGF0ZScsXG4gICAgJ2Zyb20nLFxuICAgICdnZW5lcmF0ZW9ubHknLFxuICAgICdncm91cCcsXG4gICAgJ2hpbnQnLFxuICAgICdpZicsXG4gICAgJ2ltcGxlbWVudHMnLFxuICAgICdpbicsXG4gICAgJ2luZGV4JyxcbiAgICAnaW5zZXJ0X3JlY29yZHNldCcsXG4gICAgJ2ludGVyZmFjZScsXG4gICAgJ2ludGVybmFsJyxcbiAgICAnaXMnLFxuICAgICdqb2luJyxcbiAgICAnbGlrZScsXG4gICAgJ21heG9mJyxcbiAgICAnbWlub2YnLFxuICAgICdtb2QnLFxuICAgICduYW1lc3BhY2UnLFxuICAgICduZXcnLFxuICAgICduZXh0JyxcbiAgICAnbm9mZXRjaCcsXG4gICAgJ25vdGV4aXN0cycsXG4gICAgJ29wdGltaXN0aWNsb2NrJyxcbiAgICAnb3JkZXInLFxuICAgICdvdXRlcicsXG4gICAgJ3Blc3NpbWlzdGljbG9jaycsXG4gICAgJ3ByaW50JyxcbiAgICAncHJpdmF0ZScsXG4gICAgJ3Byb3RlY3RlZCcsXG4gICAgJ3B1YmxpYycsXG4gICAgJ3JlYWRvbmx5JyxcbiAgICAncmVwZWF0YWJsZXJlYWQnLFxuICAgICdyZXRyeScsXG4gICAgJ3JldHVybicsXG4gICAgJ3JldmVyc2UnLFxuICAgICdzZWxlY3QnLFxuICAgICdzZXJ2ZXInLFxuICAgICdzZXR0aW5nJyxcbiAgICAnc3RhdGljJyxcbiAgICAnc3VtJyxcbiAgICAnc3VwZXInLFxuICAgICdzd2l0Y2gnLFxuICAgICd0aGlzJyxcbiAgICAndGhyb3cnLFxuICAgICd0cnknLFxuICAgICd0dHNhYm9ydCcsXG4gICAgJ3R0c2JlZ2luJyxcbiAgICAndHRzY29tbWl0JyxcbiAgICAndW5jaGVja2VkJyxcbiAgICAndXBkYXRlX3JlY29yZHNldCcsXG4gICAgJ3VzaW5nJyxcbiAgICAndmFsaWR0aW1lc3RhdGUnLFxuICAgICd2b2lkJyxcbiAgICAnd2hlcmUnLFxuICAgICd3aGlsZSdcbiAgXTtcblxuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOiBOT1JNQUxfS0VZV09SRFMsXG4gICAgYnVpbHRfaW46IEJVSUxUX0lOX0tFWVdPUkRTLFxuICAgIGxpdGVyYWw6IExJVEVSQUxfS0VZV09SRFNcbiAgfTtcblxuICBjb25zdCBDTEFTU19ERUZJTklUSU9OID0ge1xuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IG1hdGNoOiBbXG4gICAgICAgIC8oY2xhc3N8aW50ZXJmYWNlKVxccysvLFxuICAgICAgICBJREVOVF9SRSxcbiAgICAgICAgL1xccysoZXh0ZW5kc3xpbXBsZW1lbnRzKVxccysvLFxuICAgICAgICBJREVOVF9SRVxuICAgICAgXSB9LFxuICAgICAgeyBtYXRjaDogW1xuICAgICAgICAvY2xhc3NcXHMrLyxcbiAgICAgICAgSURFTlRfUkVcbiAgICAgIF0gfVxuICAgIF0sXG4gICAgc2NvcGU6IHtcbiAgICAgIDI6IFwidGl0bGUuY2xhc3NcIixcbiAgICAgIDQ6IFwidGl0bGUuY2xhc3MuaW5oZXJpdGVkXCJcbiAgICB9LFxuICAgIGtleXdvcmRzOiBLRVlXT1JEU1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1grKycsXG4gICAgYWxpYXNlczogWyAneCsrJyBdLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJyMnLFxuICAgICAgICBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIENMQVNTX0RFRklOSVRJT05cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGF4YXB0YSBhcyBkZWZhdWx0IH07XG4iXX0=