function cos(hljs) {
    const STRINGS = {
        className: 'string',
        variants: [
            {
                begin: '"',
                end: '"',
                contains: [
                    {
                        begin: "\"\"",
                        relevance: 0
                    }
                ]
            }
        ]
    };
    const NUMBERS = {
        className: "number",
        begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)",
        relevance: 0
    };
    const COS_KEYWORDS = 'property parameter class classmethod clientmethod extends as break '
        + 'catch close continue do d|0 else elseif for goto halt hang h|0 if job '
        + 'j|0 kill k|0 lock l|0 merge new open quit q|0 read r|0 return set s|0 '
        + 'tcommit throw trollback try tstart use view while write w|0 xecute x|0 '
        + 'zkill znspace zn ztrap zwrite zw zzdump zzwrite print zbreak zinsert '
        + 'zload zprint zremove zsave zzprint mv mvcall mvcrt mvdim mvprint zquit '
        + 'zsync ascii';
    return {
        name: 'Caché Object Script',
        case_insensitive: true,
        aliases: ["cls"],
        keywords: COS_KEYWORDS,
        contains: [
            NUMBERS,
            STRINGS,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: "comment",
                begin: /;/,
                end: "$",
                relevance: 0
            },
            {
                className: "built_in",
                begin: /(?:\$\$?|\.\.)\^?[a-zA-Z]+/
            },
            {
                className: "built_in",
                begin: /\$\$\$[a-zA-Z]+/
            },
            {
                className: "built_in",
                begin: /%[a-z]+(?:\.[a-z]+)*/
            },
            {
                className: "symbol",
                begin: /\^%?[a-zA-Z][\w]*/
            },
            {
                className: "keyword",
                begin: /##class|##super|#define|#dim/
            },
            {
                begin: /&sql\(/,
                end: /\)/,
                excludeBegin: true,
                excludeEnd: true,
                subLanguage: "sql"
            },
            {
                begin: /&(js|jscript|javascript)</,
                end: />/,
                excludeBegin: true,
                excludeEnd: true,
                subLanguage: "javascript"
            },
            {
                begin: /&html<\s*</,
                end: />\s*>/,
                subLanguage: "xml"
            }
        ]
    };
}
export { cos as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29zLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvY29zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLE9BQU8sR0FBRztRQUNkLFNBQVMsRUFBRSxRQUFRO1FBQ25CLFFBQVEsRUFBRTtZQUNSO2dCQUNFLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxLQUFLLEVBQUUsTUFBTTt3QkFDYixTQUFTLEVBQUUsQ0FBQztxQkFDYjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUc7UUFDZCxTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsNkJBQTZCO1FBQ3BDLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUNoQixxRUFBcUU7VUFDbkUsd0VBQXdFO1VBQ3hFLHdFQUF3RTtVQUN4RSx5RUFBeUU7VUFDekUsdUVBQXVFO1VBQ3ZFLHlFQUF5RTtVQUN6RSxhQUFhLENBQUM7SUF1Q2xCLE9BQU87UUFDTCxJQUFJLEVBQUUscUJBQXFCO1FBQzNCLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsT0FBTyxFQUFFLENBQUUsS0FBSyxDQUFFO1FBQ2xCLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLE9BQU87WUFDUCxPQUFPO1lBQ1AsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsb0JBQW9CO1lBQ3pCO2dCQUNFLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRztnQkFDUixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLEtBQUssRUFBRSw0QkFBNEI7YUFDcEM7WUFDRDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLGlCQUFpQjthQUN6QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsc0JBQXNCO2FBQzlCO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxtQkFBbUI7YUFDM0I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsS0FBSyxFQUFFLDhCQUE4QjthQUN0QztZQUdEO2dCQUNFLEtBQUssRUFBRSxRQUFRO2dCQUNmLEdBQUcsRUFBRSxJQUFJO2dCQUNULFlBQVksRUFBRSxJQUFJO2dCQUNsQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsV0FBVyxFQUFFLEtBQUs7YUFDbkI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsMkJBQTJCO2dCQUNsQyxHQUFHLEVBQUUsR0FBRztnQkFDUixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxZQUFZO2FBQzFCO1lBQ0Q7Z0JBRUUsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLEdBQUcsRUFBRSxPQUFPO2dCQUNaLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IENhY2jDqSBPYmplY3QgU2NyaXB0XG5BdXRob3I6IE5pa2l0YSBTYXZjaGVua28gPHppdHJvcy5sYWJAZ21haWwuY29tPlxuQ2F0ZWdvcnk6IGVudGVycHJpc2UsIHNjcmlwdGluZ1xuV2Vic2l0ZTogaHR0cHM6Ly9jZWRvY3MuaW50ZXJzeXN0ZW1zLmNvbS9sYXRlc3QvY3NwL2RvY2Jvb2svRG9jQm9vay5VSS5QYWdlLmNsc1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGNvcyhobGpzKSB7XG4gIGNvbnN0IFNUUklOR1MgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ1wiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHsgLy8gZXNjYXBlZFxuICAgICAgICAgICAgYmVnaW46IFwiXFxcIlxcXCJcIixcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBOVU1CRVJTID0ge1xuICAgIGNsYXNzTmFtZTogXCJudW1iZXJcIixcbiAgICBiZWdpbjogXCJcXFxcYihcXFxcZCsoXFxcXC5cXFxcZCopP3xcXFxcLlxcXFxkKylcIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBDT1NfS0VZV09SRFMgPVxuICAgICdwcm9wZXJ0eSBwYXJhbWV0ZXIgY2xhc3MgY2xhc3NtZXRob2QgY2xpZW50bWV0aG9kIGV4dGVuZHMgYXMgYnJlYWsgJ1xuICAgICsgJ2NhdGNoIGNsb3NlIGNvbnRpbnVlIGRvIGR8MCBlbHNlIGVsc2VpZiBmb3IgZ290byBoYWx0IGhhbmcgaHwwIGlmIGpvYiAnXG4gICAgKyAnanwwIGtpbGwga3wwIGxvY2sgbHwwIG1lcmdlIG5ldyBvcGVuIHF1aXQgcXwwIHJlYWQgcnwwIHJldHVybiBzZXQgc3wwICdcbiAgICArICd0Y29tbWl0IHRocm93IHRyb2xsYmFjayB0cnkgdHN0YXJ0IHVzZSB2aWV3IHdoaWxlIHdyaXRlIHd8MCB4ZWN1dGUgeHwwICdcbiAgICArICd6a2lsbCB6bnNwYWNlIHpuIHp0cmFwIHp3cml0ZSB6dyB6emR1bXAgenp3cml0ZSBwcmludCB6YnJlYWsgemluc2VydCAnXG4gICAgKyAnemxvYWQgenByaW50IHpyZW1vdmUgenNhdmUgenpwcmludCBtdiBtdmNhbGwgbXZjcnQgbXZkaW0gbXZwcmludCB6cXVpdCAnXG4gICAgKyAnenN5bmMgYXNjaWknO1xuXG4gIC8vIHJlZ2lzdGVyZWQgZnVuY3Rpb24gLSBubyBuZWVkIGluIHRoZW0gZHVlIHRvIGFsbCBmdW5jdGlvbnMgYXJlIGhpZ2hsaWdodGVkLFxuICAvLyBidXQgSSdsbCBqdXN0IGxlYXZlIHRoaXMgaGVyZS5cblxuICAvLyBcIiRiaXRcIiwgXCIkYml0Y291bnRcIixcbiAgLy8gXCIkYml0ZmluZFwiLCBcIiRiaXRsb2dpY1wiLCBcIiRjYXNlXCIsIFwiJGNoYXJcIiwgXCIkY2xhc3NtZXRob2RcIiwgXCIkY2xhc3NuYW1lXCIsXG4gIC8vIFwiJGNvbXBpbGVcIiwgXCIkZGF0YVwiLCBcIiRkZWNpbWFsXCIsIFwiJGRvdWJsZVwiLCBcIiRleHRyYWN0XCIsIFwiJGZhY3RvclwiLFxuICAvLyBcIiRmaW5kXCIsIFwiJGZudW1iZXJcIiwgXCIkZ2V0XCIsIFwiJGluY3JlbWVudFwiLCBcIiRpbnVtYmVyXCIsIFwiJGlzb2JqZWN0XCIsXG4gIC8vIFwiJGlzdmFsaWRkb3VibGVcIiwgXCIkaXN2YWxpZG51bVwiLCBcIiRqdXN0aWZ5XCIsIFwiJGxlbmd0aFwiLCBcIiRsaXN0XCIsXG4gIC8vIFwiJGxpc3RidWlsZFwiLCBcIiRsaXN0ZGF0YVwiLCBcIiRsaXN0ZmluZFwiLCBcIiRsaXN0ZnJvbXN0cmluZ1wiLCBcIiRsaXN0Z2V0XCIsXG4gIC8vIFwiJGxpc3RsZW5ndGhcIiwgXCIkbGlzdG5leHRcIiwgXCIkbGlzdHNhbWVcIiwgXCIkbGlzdHRvc3RyaW5nXCIsIFwiJGxpc3R2YWxpZFwiLFxuICAvLyBcIiRsb2NhdGVcIiwgXCIkbWF0Y2hcIiwgXCIkbWV0aG9kXCIsIFwiJG5hbWVcIiwgXCIkbmNvbnZlcnRcIiwgXCIkbmV4dFwiLFxuICAvLyBcIiRub3JtYWxpemVcIiwgXCIkbm93XCIsIFwiJG51bWJlclwiLCBcIiRvcmRlclwiLCBcIiRwYXJhbWV0ZXJcIiwgXCIkcGllY2VcIixcbiAgLy8gXCIkcHJlZmV0Y2hvZmZcIiwgXCIkcHJlZmV0Y2hvblwiLCBcIiRwcm9wZXJ0eVwiLCBcIiRxbGVuZ3RoXCIsIFwiJHFzdWJzY3JpcHRcIixcbiAgLy8gXCIkcXVlcnlcIiwgXCIkcmFuZG9tXCIsIFwiJHJlcGxhY2VcIiwgXCIkcmV2ZXJzZVwiLCBcIiRzY29udmVydFwiLCBcIiRzZWxlY3RcIixcbiAgLy8gXCIkc29ydGJlZ2luXCIsIFwiJHNvcnRlbmRcIiwgXCIkc3RhY2tcIiwgXCIkdGV4dFwiLCBcIiR0cmFuc2xhdGVcIiwgXCIkdmlld1wiLFxuICAvLyBcIiR3YXNjaWlcIiwgXCIkd2NoYXJcIiwgXCIkd2V4dHJhY3RcIiwgXCIkd2ZpbmRcIiwgXCIkd2lzd2lkZVwiLCBcIiR3bGVuZ3RoXCIsXG4gIC8vIFwiJHdyZXZlcnNlXCIsIFwiJHhlY3V0ZVwiLCBcIiR6YWJzXCIsIFwiJHphcmNjb3NcIiwgXCIkemFyY3NpblwiLCBcIiR6YXJjdGFuXCIsXG4gIC8vIFwiJHpjb3NcIiwgXCIkemNvdFwiLCBcIiR6Y3NjXCIsIFwiJHpkYXRlXCIsIFwiJHpkYXRlaFwiLCBcIiR6ZGF0ZXRpbWVcIixcbiAgLy8gXCIkemRhdGV0aW1laFwiLCBcIiR6ZXhwXCIsIFwiJHpoZXhcIiwgXCIkemxuXCIsIFwiJHpsb2dcIiwgXCIkenBvd2VyXCIsIFwiJHpzZWNcIixcbiAgLy8gXCIkenNpblwiLCBcIiR6c3FyXCIsIFwiJHp0YW5cIiwgXCIkenRpbWVcIiwgXCIkenRpbWVoXCIsIFwiJHpib29sZWFuXCIsXG4gIC8vIFwiJHpjb252ZXJ0XCIsIFwiJHpjcmNcIiwgXCIkemN5Y1wiLCBcIiR6ZGFzY2lpXCIsIFwiJHpkY2hhclwiLCBcIiR6ZlwiLFxuICAvLyBcIiR6aXN3aWRlXCIsIFwiJHpsYXNjaWlcIiwgXCIkemxjaGFyXCIsIFwiJHpuYW1lXCIsIFwiJHpwb3NpdGlvblwiLCBcIiR6cWFzY2lpXCIsXG4gIC8vIFwiJHpxY2hhclwiLCBcIiR6c2VhcmNoXCIsIFwiJHpzZWVrXCIsIFwiJHpzdHJpcFwiLCBcIiR6d2FzY2lpXCIsIFwiJHp3Y2hhclwiLFxuICAvLyBcIiR6d2lkdGhcIiwgXCIkendwYWNrXCIsIFwiJHp3YnBhY2tcIiwgXCIkend1bnBhY2tcIiwgXCIkendidW5wYWNrXCIsIFwiJHp6ZW5rYWt1XCIsXG4gIC8vIFwiJGNoYW5nZVwiLCBcIiRtdlwiLCBcIiRtdmF0XCIsIFwiJG12Zm10XCIsIFwiJG12Zm10c1wiLCBcIiRtdmljb252XCIsXG4gIC8vIFwiJG12aWNvbnZzXCIsIFwiJG12aW5tYXRcIiwgXCIkbXZsb3ZlclwiLCBcIiRtdm9jb252XCIsIFwiJG12b2NvbnZzXCIsIFwiJG12cmFpc2VcIixcbiAgLy8gXCIkbXZ0cmFuc1wiLCBcIiRtdnZcIiwgXCIkbXZuYW1lXCIsIFwiJHpiaXRhbmRcIiwgXCIkemJpdGNvdW50XCIsIFwiJHpiaXRmaW5kXCIsXG4gIC8vIFwiJHpiaXRnZXRcIiwgXCIkemJpdGxlblwiLCBcIiR6Yml0bm90XCIsIFwiJHpiaXRvclwiLCBcIiR6Yml0c2V0XCIsIFwiJHpiaXRzdHJcIixcbiAgLy8gXCIkemJpdHhvclwiLCBcIiR6aW5jcmVtZW50XCIsIFwiJHpuZXh0XCIsIFwiJHpvcmRlclwiLCBcIiR6cHJldmlvdXNcIiwgXCIkenNvcnRcIixcbiAgLy8gXCJkZXZpY2VcIiwgXCIkZWNvZGVcIiwgXCIkZXN0YWNrXCIsIFwiJGV0cmFwXCIsIFwiJGhhbHRcIiwgXCIkaG9yb2xvZ1wiLFxuICAvLyBcIiRpb1wiLCBcIiRqb2JcIiwgXCIka2V5XCIsIFwiJG5hbWVzcGFjZVwiLCBcIiRwcmluY2lwYWxcIiwgXCIkcXVpdFwiLCBcIiRyb2xlc1wiLFxuICAvLyBcIiRzdG9yYWdlXCIsIFwiJHN5c3RlbVwiLCBcIiR0ZXN0XCIsIFwiJHRoaXNcIiwgXCIkdGxldmVsXCIsIFwiJHVzZXJuYW1lXCIsXG4gIC8vIFwiJHhcIiwgXCIkeVwiLCBcIiR6YVwiLCBcIiR6YlwiLCBcIiR6Y2hpbGRcIiwgXCIkemVvZlwiLCBcIiR6ZW9zXCIsIFwiJHplcnJvclwiLFxuICAvLyBcIiR6aG9yb2xvZ1wiLCBcIiR6aW9cIiwgXCIkempvYlwiLCBcIiR6bW9kZVwiLCBcIiR6bnNwYWNlXCIsIFwiJHpwYXJlbnRcIiwgXCIkenBpXCIsXG4gIC8vIFwiJHpwb3NcIiwgXCIkenJlZmVyZW5jZVwiLCBcIiR6c3RvcmFnZVwiLCBcIiR6dGltZXN0YW1wXCIsIFwiJHp0aW1lem9uZVwiLFxuICAvLyBcIiR6dHJhcFwiLCBcIiR6dmVyc2lvblwiXG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQ2FjaMOpIE9iamVjdCBTY3JpcHQnLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgYWxpYXNlczogWyBcImNsc1wiIF0sXG4gICAga2V5d29yZHM6IENPU19LRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgTlVNQkVSUyxcbiAgICAgIFNUUklOR1MsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6IFwiY29tbWVudFwiLFxuICAgICAgICBiZWdpbjogLzsvLFxuICAgICAgICBlbmQ6IFwiJFwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IC8vIEZ1bmN0aW9ucyBhbmQgdXNlci1kZWZpbmVkIGZ1bmN0aW9uczogd3JpdGUgJHp0aW1lKDYwKjYwKjMpLCAkJG15RnVuYygxMCksICQkXlZhbCgxKVxuICAgICAgICBjbGFzc05hbWU6IFwiYnVpbHRfaW5cIixcbiAgICAgICAgYmVnaW46IC8oPzpcXCRcXCQ/fFxcLlxcLilcXF4/W2EtekEtWl0rL1xuICAgICAgfSxcbiAgICAgIHsgLy8gTWFjcm8gY29tbWFuZDogcXVpdCAkJCRPS1xuICAgICAgICBjbGFzc05hbWU6IFwiYnVpbHRfaW5cIixcbiAgICAgICAgYmVnaW46IC9cXCRcXCRcXCRbYS16QS1aXSsvXG4gICAgICB9LFxuICAgICAgeyAvLyBTcGVjaWFsIChnbG9iYWwpIHZhcmlhYmxlczogd3JpdGUgJXJlcXVlc3QuQ29udGVudDsgQnVpbHQtaW4gY2xhc3NlczogJUxpYnJhcnkuSW50ZWdlclxuICAgICAgICBjbGFzc05hbWU6IFwiYnVpbHRfaW5cIixcbiAgICAgICAgYmVnaW46IC8lW2Etel0rKD86XFwuW2Etel0rKSovXG4gICAgICB9LFxuICAgICAgeyAvLyBHbG9iYWwgdmFyaWFibGU6IHNldCBeZ2xvYmFsTmFtZSA9IDEyIHdyaXRlIF5nbG9iYWxOYW1lXG4gICAgICAgIGNsYXNzTmFtZTogXCJzeW1ib2xcIixcbiAgICAgICAgYmVnaW46IC9cXF4lP1thLXpBLVpdW1xcd10qL1xuICAgICAgfSxcbiAgICAgIHsgLy8gU29tZSBjb250cm9sIGNvbnN0cnVjdGlvbnM6IGRvICMjY2xhc3MoUGFja2FnZS5DbGFzc05hbWUpLk1ldGhvZCgpLCAjI3N1cGVyKClcbiAgICAgICAgY2xhc3NOYW1lOiBcImtleXdvcmRcIixcbiAgICAgICAgYmVnaW46IC8jI2NsYXNzfCMjc3VwZXJ8I2RlZmluZXwjZGltL1xuICAgICAgfSxcbiAgICAgIC8vIHN1Yi1sYW5ndWFnZXM6IGFyZSBub3QgZnVsbHkgc3VwcG9ydGVkIGJ5IGhsanMgYnkgMTEvMTUvMjAxNVxuICAgICAgLy8gbGVmdCBmb3IgdGhlIGZ1dHVyZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC8mc3FsXFwoLyxcbiAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBzdWJMYW5ndWFnZTogXCJzcWxcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC8mKGpzfGpzY3JpcHR8amF2YXNjcmlwdCk8LyxcbiAgICAgICAgZW5kOiAvPi8sXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgc3ViTGFuZ3VhZ2U6IFwiamF2YXNjcmlwdFwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyB0aGlzIGJyYWtlcyBmaXJzdCBhbmQgbGFzdCB0YWcsIGJ1dCB0aGlzIGlzIHRoZSBvbmx5IHdheSB0byBlbWJlZCBhIHZhbGlkIGh0bWxcbiAgICAgICAgYmVnaW46IC8maHRtbDxcXHMqPC8sXG4gICAgICAgIGVuZDogLz5cXHMqPi8sXG4gICAgICAgIHN1Ykxhbmd1YWdlOiBcInhtbFwiXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBjb3MgYXMgZGVmYXVsdCB9O1xuIl19