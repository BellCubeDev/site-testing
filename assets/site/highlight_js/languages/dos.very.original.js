function dos(hljs) {
    const COMMENT = hljs.COMMENT(/^\s*@?rem\b/, /$/, { relevance: 10 });
    const LABEL = {
        className: 'symbol',
        begin: '^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)',
        relevance: 0
    };
    const KEYWORDS = [
        "if",
        "else",
        "goto",
        "for",
        "in",
        "do",
        "call",
        "exit",
        "not",
        "exist",
        "errorlevel",
        "defined",
        "equ",
        "neq",
        "lss",
        "leq",
        "gtr",
        "geq"
    ];
    const BUILT_INS = [
        "prn",
        "nul",
        "lpt3",
        "lpt2",
        "lpt1",
        "con",
        "com4",
        "com3",
        "com2",
        "com1",
        "aux",
        "shift",
        "cd",
        "dir",
        "echo",
        "setlocal",
        "endlocal",
        "set",
        "pause",
        "copy",
        "append",
        "assoc",
        "at",
        "attrib",
        "break",
        "cacls",
        "cd",
        "chcp",
        "chdir",
        "chkdsk",
        "chkntfs",
        "cls",
        "cmd",
        "color",
        "comp",
        "compact",
        "convert",
        "date",
        "dir",
        "diskcomp",
        "diskcopy",
        "doskey",
        "erase",
        "fs",
        "find",
        "findstr",
        "format",
        "ftype",
        "graftabl",
        "help",
        "keyb",
        "label",
        "md",
        "mkdir",
        "mode",
        "more",
        "move",
        "path",
        "pause",
        "print",
        "popd",
        "pushd",
        "promt",
        "rd",
        "recover",
        "rem",
        "rename",
        "replace",
        "restore",
        "rmdir",
        "shift",
        "sort",
        "start",
        "subst",
        "time",
        "title",
        "tree",
        "type",
        "ver",
        "verify",
        "vol",
        "ping",
        "net",
        "ipconfig",
        "taskkill",
        "xcopy",
        "ren",
        "del"
    ];
    return {
        name: 'Batch file (DOS)',
        aliases: [
            'bat',
            'cmd'
        ],
        case_insensitive: true,
        illegal: /\/\*/,
        keywords: {
            keyword: KEYWORDS,
            built_in: BUILT_INS
        },
        contains: [
            {
                className: 'variable',
                begin: /%%[^ ]|%[^ ]+?%|![^ ]+?!/
            },
            {
                className: 'function',
                begin: LABEL.begin,
                end: 'goto:eof',
                contains: [
                    hljs.inherit(hljs.TITLE_MODE, { begin: '([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*' }),
                    COMMENT
                ]
            },
            {
                className: 'number',
                begin: '\\b\\d+',
                relevance: 0
            },
            COMMENT
        ]
    };
}
export { dos as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9zLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvZG9zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUMxQixhQUFhLEVBQUUsR0FBRyxFQUNsQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHO1FBQ1osU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLGtEQUFrRDtRQUN6RCxTQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxZQUFZO1FBQ1osU0FBUztRQUNULEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztLQUNOLENBQUM7SUFDRixNQUFNLFNBQVMsR0FBRztRQUNoQixLQUFLO1FBQ0wsS0FBSztRQUNMLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxJQUFJO1FBQ0osS0FBSztRQUNMLE1BQU07UUFDTixVQUFVO1FBQ1YsVUFBVTtRQUNWLEtBQUs7UUFDTCxPQUFPO1FBQ1AsTUFBTTtRQUNOLFFBQVE7UUFDUixPQUFPO1FBQ1AsSUFBSTtRQUNKLFFBQVE7UUFDUixPQUFPO1FBQ1AsT0FBTztRQUNQLElBQUk7UUFDSixNQUFNO1FBQ04sT0FBTztRQUNQLFFBQVE7UUFDUixTQUFTO1FBQ1QsS0FBSztRQUNMLEtBQUs7UUFDTCxPQUFPO1FBQ1AsTUFBTTtRQUNOLFNBQVM7UUFDVCxTQUFTO1FBQ1QsTUFBTTtRQUNOLEtBQUs7UUFDTCxVQUFVO1FBQ1YsVUFBVTtRQUNWLFFBQVE7UUFDUixPQUFPO1FBQ1AsSUFBSTtRQUNKLE1BQU07UUFDTixTQUFTO1FBQ1QsUUFBUTtRQUNSLE9BQU87UUFDUCxVQUFVO1FBQ1YsTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsSUFBSTtRQUNKLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxJQUFJO1FBQ0osU0FBUztRQUNULEtBQUs7UUFDTCxRQUFRO1FBQ1IsU0FBUztRQUNULFNBQVM7UUFDVCxPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsUUFBUTtRQUNSLEtBQUs7UUFFTCxNQUFNO1FBQ04sS0FBSztRQUNMLFVBQVU7UUFDVixVQUFVO1FBQ1YsT0FBTztRQUNQLEtBQUs7UUFDTCxLQUFLO0tBQ04sQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRTtZQUNQLEtBQUs7WUFDTCxLQUFLO1NBQ047UUFDRCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFFBQVE7WUFDakIsUUFBUSxFQUFFLFNBQVM7U0FDcEI7UUFDRCxRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLDBCQUEwQjthQUNsQztZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7Z0JBQ2xCLEdBQUcsRUFBRSxVQUFVO2dCQUNmLFFBQVEsRUFBRTtvQkFDUixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsbURBQW1ELEVBQUUsQ0FBQztvQkFDN0YsT0FBTztpQkFDUjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxTQUFTO2dCQUNoQixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0QsT0FBTztTQUNSO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBCYXRjaCBmaWxlIChET1MpXG5BdXRob3I6IEFsZXhhbmRlciBNYWthcm92IDxzYW1Acm1jcmVhdGl2ZS5ydT5cbkNvbnRyaWJ1dG9yczogQW50b24gS29jaGtvdiA8YW50b24ua29jaGtvdkBnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXRjaF9maWxlXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZG9zKGhsanMpIHtcbiAgY29uc3QgQ09NTUVOVCA9IGhsanMuQ09NTUVOVChcbiAgICAvXlxccypAP3JlbVxcYi8sIC8kLyxcbiAgICB7IHJlbGV2YW5jZTogMTAgfVxuICApO1xuICBjb25zdCBMQUJFTCA9IHtcbiAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgIGJlZ2luOiAnXlxcXFxzKltBLVphLXouXz9dW0EtWmEtejAtOV8kI0B+Lj9dKig6fFxcXFxzK2xhYmVsKScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwiaWZcIixcbiAgICBcImVsc2VcIixcbiAgICBcImdvdG9cIixcbiAgICBcImZvclwiLFxuICAgIFwiaW5cIixcbiAgICBcImRvXCIsXG4gICAgXCJjYWxsXCIsXG4gICAgXCJleGl0XCIsXG4gICAgXCJub3RcIixcbiAgICBcImV4aXN0XCIsXG4gICAgXCJlcnJvcmxldmVsXCIsXG4gICAgXCJkZWZpbmVkXCIsXG4gICAgXCJlcXVcIixcbiAgICBcIm5lcVwiLFxuICAgIFwibHNzXCIsXG4gICAgXCJsZXFcIixcbiAgICBcImd0clwiLFxuICAgIFwiZ2VxXCJcbiAgXTtcbiAgY29uc3QgQlVJTFRfSU5TID0gW1xuICAgIFwicHJuXCIsXG4gICAgXCJudWxcIixcbiAgICBcImxwdDNcIixcbiAgICBcImxwdDJcIixcbiAgICBcImxwdDFcIixcbiAgICBcImNvblwiLFxuICAgIFwiY29tNFwiLFxuICAgIFwiY29tM1wiLFxuICAgIFwiY29tMlwiLFxuICAgIFwiY29tMVwiLFxuICAgIFwiYXV4XCIsXG4gICAgXCJzaGlmdFwiLFxuICAgIFwiY2RcIixcbiAgICBcImRpclwiLFxuICAgIFwiZWNob1wiLFxuICAgIFwic2V0bG9jYWxcIixcbiAgICBcImVuZGxvY2FsXCIsXG4gICAgXCJzZXRcIixcbiAgICBcInBhdXNlXCIsXG4gICAgXCJjb3B5XCIsXG4gICAgXCJhcHBlbmRcIixcbiAgICBcImFzc29jXCIsXG4gICAgXCJhdFwiLFxuICAgIFwiYXR0cmliXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2FjbHNcIixcbiAgICBcImNkXCIsXG4gICAgXCJjaGNwXCIsXG4gICAgXCJjaGRpclwiLFxuICAgIFwiY2hrZHNrXCIsXG4gICAgXCJjaGtudGZzXCIsXG4gICAgXCJjbHNcIixcbiAgICBcImNtZFwiLFxuICAgIFwiY29sb3JcIixcbiAgICBcImNvbXBcIixcbiAgICBcImNvbXBhY3RcIixcbiAgICBcImNvbnZlcnRcIixcbiAgICBcImRhdGVcIixcbiAgICBcImRpclwiLFxuICAgIFwiZGlza2NvbXBcIixcbiAgICBcImRpc2tjb3B5XCIsXG4gICAgXCJkb3NrZXlcIixcbiAgICBcImVyYXNlXCIsXG4gICAgXCJmc1wiLFxuICAgIFwiZmluZFwiLFxuICAgIFwiZmluZHN0clwiLFxuICAgIFwiZm9ybWF0XCIsXG4gICAgXCJmdHlwZVwiLFxuICAgIFwiZ3JhZnRhYmxcIixcbiAgICBcImhlbHBcIixcbiAgICBcImtleWJcIixcbiAgICBcImxhYmVsXCIsXG4gICAgXCJtZFwiLFxuICAgIFwibWtkaXJcIixcbiAgICBcIm1vZGVcIixcbiAgICBcIm1vcmVcIixcbiAgICBcIm1vdmVcIixcbiAgICBcInBhdGhcIixcbiAgICBcInBhdXNlXCIsXG4gICAgXCJwcmludFwiLFxuICAgIFwicG9wZFwiLFxuICAgIFwicHVzaGRcIixcbiAgICBcInByb210XCIsXG4gICAgXCJyZFwiLFxuICAgIFwicmVjb3ZlclwiLFxuICAgIFwicmVtXCIsXG4gICAgXCJyZW5hbWVcIixcbiAgICBcInJlcGxhY2VcIixcbiAgICBcInJlc3RvcmVcIixcbiAgICBcInJtZGlyXCIsXG4gICAgXCJzaGlmdFwiLFxuICAgIFwic29ydFwiLFxuICAgIFwic3RhcnRcIixcbiAgICBcInN1YnN0XCIsXG4gICAgXCJ0aW1lXCIsXG4gICAgXCJ0aXRsZVwiLFxuICAgIFwidHJlZVwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwidmVyXCIsXG4gICAgXCJ2ZXJpZnlcIixcbiAgICBcInZvbFwiLFxuICAgIC8vIHdpbnV0aWxzXG4gICAgXCJwaW5nXCIsXG4gICAgXCJuZXRcIixcbiAgICBcImlwY29uZmlnXCIsXG4gICAgXCJ0YXNra2lsbFwiLFxuICAgIFwieGNvcHlcIixcbiAgICBcInJlblwiLFxuICAgIFwiZGVsXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQmF0Y2ggZmlsZSAoRE9TKScsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ2JhdCcsXG4gICAgICAnY21kJ1xuICAgIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAvXFwvXFwqLyxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogS0VZV09SRFMsXG4gICAgICBidWlsdF9pbjogQlVJTFRfSU5TXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAvJSVbXiBdfCVbXiBdKz8lfCFbXiBdKz8hL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogTEFCRUwuYmVnaW4sXG4gICAgICAgIGVuZDogJ2dvdG86ZW9mJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IGJlZ2luOiAnKFtfYS16QS1aXVxcXFx3KlxcXFwuKSooW19hLXpBLVpdXFxcXHcqOik/W19hLXpBLVpdXFxcXHcqJyB9KSxcbiAgICAgICAgICBDT01NRU5UXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJcXFxcZCsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBDT01NRU5UXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBkb3MgYXMgZGVmYXVsdCB9O1xuIl19