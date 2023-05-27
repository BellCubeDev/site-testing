function moonscript(hljs) {
    const KEYWORDS = {
        keyword: 'if then not for in while do return else elseif break continue switch and or '
            + 'unless when class extends super local import export from using',
        literal: 'true false nil',
        built_in: '_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load '
            + 'loadfile loadstring module next pairs pcall print rawequal rawget rawset require '
            + 'select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug '
            + 'io math os package string table'
    };
    const JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
    const SUBST = {
        className: 'subst',
        begin: /#\{/,
        end: /\}/,
        keywords: KEYWORDS
    };
    const EXPRESSIONS = [
        hljs.inherit(hljs.C_NUMBER_MODE, { starts: {
                end: '(\\s*/)?',
                relevance: 0
            } }),
        {
            className: 'string',
            variants: [
                {
                    begin: /'/,
                    end: /'/,
                    contains: [hljs.BACKSLASH_ESCAPE]
                },
                {
                    begin: /"/,
                    end: /"/,
                    contains: [
                        hljs.BACKSLASH_ESCAPE,
                        SUBST
                    ]
                }
            ]
        },
        {
            className: 'built_in',
            begin: '@__' + hljs.IDENT_RE
        },
        { begin: '@' + hljs.IDENT_RE
        },
        { begin: hljs.IDENT_RE + '\\\\' + hljs.IDENT_RE
        }
    ];
    SUBST.contains = EXPRESSIONS;
    const TITLE = hljs.inherit(hljs.TITLE_MODE, { begin: JS_IDENT_RE });
    const POSSIBLE_PARAMS_RE = '(\\(.*\\)\\s*)?\\B[-=]>';
    const PARAMS = {
        className: 'params',
        begin: '\\([^\\(]',
        returnBegin: true,
        contains: [
            {
                begin: /\(/,
                end: /\)/,
                keywords: KEYWORDS,
                contains: ['self'].concat(EXPRESSIONS)
            }
        ]
    };
    return {
        name: 'MoonScript',
        aliases: ['moon'],
        keywords: KEYWORDS,
        illegal: /\/\*/,
        contains: EXPRESSIONS.concat([
            hljs.COMMENT('--', '$'),
            {
                className: 'function',
                begin: '^\\s*' + JS_IDENT_RE + '\\s*=\\s*' + POSSIBLE_PARAMS_RE,
                end: '[-=]>',
                returnBegin: true,
                contains: [
                    TITLE,
                    PARAMS
                ]
            },
            {
                begin: /[\(,:=]\s*/,
                relevance: 0,
                contains: [
                    {
                        className: 'function',
                        begin: POSSIBLE_PARAMS_RE,
                        end: '[-=]>',
                        returnBegin: true,
                        contains: [PARAMS]
                    }
                ]
            },
            {
                className: 'class',
                beginKeywords: 'class',
                end: '$',
                illegal: /[:="\[\]]/,
                contains: [
                    {
                        beginKeywords: 'extends',
                        endsWithParent: true,
                        illegal: /[:="\[\]]/,
                        contains: [TITLE]
                    },
                    TITLE
                ]
            },
            {
                className: 'name',
                begin: JS_IDENT_RE + ':',
                end: ':',
                returnBegin: true,
                returnEnd: true,
                relevance: 0
            }
        ])
    };
}
export { moonscript as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9vbnNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL21vb25zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxVQUFVLENBQUMsSUFBSTtJQUN0QixNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFFTCw4RUFBOEU7Y0FDNUUsZ0VBQWdFO1FBQ3BFLE9BQU8sRUFDTCxnQkFBZ0I7UUFDbEIsUUFBUSxFQUNOLGtGQUFrRjtjQUNoRixtRkFBbUY7Y0FDbkYsbUZBQW1GO2NBQ25GLGlDQUFpQztLQUN0QyxDQUFDO0lBQ0YsTUFBTSxXQUFXLEdBQUcsMEJBQTBCLENBQUM7SUFDL0MsTUFBTSxLQUFLLEdBQUc7UUFDWixTQUFTLEVBQUUsT0FBTztRQUNsQixLQUFLLEVBQUUsS0FBSztRQUNaLEdBQUcsRUFBRSxJQUFJO1FBQ1QsUUFBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFDN0IsRUFBRSxNQUFNLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLFVBQVU7Z0JBQ2YsU0FBUyxFQUFFLENBQUM7YUFDYixFQUFFLENBQUM7UUFDTjtZQUNFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFFBQVEsRUFBRTtnQkFDUjtvQkFDRSxLQUFLLEVBQUUsR0FBRztvQkFDVixHQUFHLEVBQUUsR0FBRztvQkFDUixRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUU7aUJBQ3BDO2dCQUNEO29CQUNFLEtBQUssRUFBRSxHQUFHO29CQUNWLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRTt3QkFDUixJQUFJLENBQUMsZ0JBQWdCO3dCQUNyQixLQUFLO3FCQUNOO2lCQUNGO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsU0FBUyxFQUFFLFVBQVU7WUFDckIsS0FBSyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUTtTQUM3QjtRQUNELEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUTtTQUMzQjtRQUNELEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRO1NBQzlDO0tBQ0YsQ0FBQztJQUNGLEtBQUssQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO0lBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sa0JBQWtCLEdBQUcseUJBQXlCLENBQUM7SUFDckQsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsV0FBVztRQUNsQixXQUFXLEVBQUUsSUFBSTtRQUdqQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLENBQUUsTUFBTSxDQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUN6QztTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsQ0FBRSxNQUFNLENBQUU7UUFDbkIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7WUFDdkI7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLEtBQUssRUFBRSxPQUFPLEdBQUcsV0FBVyxHQUFHLFdBQVcsR0FBRyxrQkFBa0I7Z0JBQy9ELEdBQUcsRUFBRSxPQUFPO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1IsS0FBSztvQkFDTCxNQUFNO2lCQUNQO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsWUFBWTtnQkFDbkIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxVQUFVO3dCQUNyQixLQUFLLEVBQUUsa0JBQWtCO3dCQUN6QixHQUFHLEVBQUUsT0FBTzt3QkFDWixXQUFXLEVBQUUsSUFBSTt3QkFDakIsUUFBUSxFQUFFLENBQUUsTUFBTSxDQUFFO3FCQUNyQjtpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLGFBQWEsRUFBRSxPQUFPO2dCQUN0QixHQUFHLEVBQUUsR0FBRztnQkFDUixPQUFPLEVBQUUsV0FBVztnQkFDcEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLGFBQWEsRUFBRSxTQUFTO3dCQUN4QixjQUFjLEVBQUUsSUFBSTt3QkFDcEIsT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLFFBQVEsRUFBRSxDQUFFLEtBQUssQ0FBRTtxQkFDcEI7b0JBQ0QsS0FBSztpQkFDTjthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxXQUFXLEdBQUcsR0FBRztnQkFDeEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRixDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsVUFBVSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBNb29uU2NyaXB0XG5BdXRob3I6IEJpbGx5IFF1aXRoIDxjaGluYmlsbHliaWxib0BnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogTW9vblNjcmlwdCBpcyBhIHByb2dyYW1taW5nIGxhbmd1YWdlIHRoYXQgdHJhbnNjb21waWxlcyB0byBMdWEuXG5PcmlnaW46IGNvZmZlZXNjcmlwdC5qc1xuV2Vic2l0ZTogaHR0cDovL21vb25zY3JpcHQub3JnL1xuQ2F0ZWdvcnk6IHNjcmlwdGluZ1xuKi9cblxuZnVuY3Rpb24gbW9vbnNjcmlwdChobGpzKSB7XG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAvLyBNb29uc2NyaXB0IGtleXdvcmRzXG4gICAgICAnaWYgdGhlbiBub3QgZm9yIGluIHdoaWxlIGRvIHJldHVybiBlbHNlIGVsc2VpZiBicmVhayBjb250aW51ZSBzd2l0Y2ggYW5kIG9yICdcbiAgICAgICsgJ3VubGVzcyB3aGVuIGNsYXNzIGV4dGVuZHMgc3VwZXIgbG9jYWwgaW1wb3J0IGV4cG9ydCBmcm9tIHVzaW5nJyxcbiAgICBsaXRlcmFsOlxuICAgICAgJ3RydWUgZmFsc2UgbmlsJyxcbiAgICBidWlsdF9pbjpcbiAgICAgICdfRyBfVkVSU0lPTiBhc3NlcnQgY29sbGVjdGdhcmJhZ2UgZG9maWxlIGVycm9yIGdldGZlbnYgZ2V0bWV0YXRhYmxlIGlwYWlycyBsb2FkICdcbiAgICAgICsgJ2xvYWRmaWxlIGxvYWRzdHJpbmcgbW9kdWxlIG5leHQgcGFpcnMgcGNhbGwgcHJpbnQgcmF3ZXF1YWwgcmF3Z2V0IHJhd3NldCByZXF1aXJlICdcbiAgICAgICsgJ3NlbGVjdCBzZXRmZW52IHNldG1ldGF0YWJsZSB0b251bWJlciB0b3N0cmluZyB0eXBlIHVucGFjayB4cGNhbGwgY29yb3V0aW5lIGRlYnVnICdcbiAgICAgICsgJ2lvIG1hdGggb3MgcGFja2FnZSBzdHJpbmcgdGFibGUnXG4gIH07XG4gIGNvbnN0IEpTX0lERU5UX1JFID0gJ1tBLVphLXokX11bMC05QS1aYS16JF9dKic7XG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogLyNcXHsvLFxuICAgIGVuZDogL1xcfS8sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTXG4gIH07XG4gIGNvbnN0IEVYUFJFU1NJT05TID0gW1xuICAgIGhsanMuaW5oZXJpdChobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7IHN0YXJ0czoge1xuICAgICAgICBlbmQ6ICcoXFxcXHMqLyk/JyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9IH0pLCAvLyBhIG51bWJlciB0cmllcyB0byBlYXQgdGhlIGZvbGxvd2luZyBzbGFzaCB0byBwcmV2ZW50IHRyZWF0aW5nIGl0IGFzIGEgcmVnZXhwXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogLycvLFxuICAgICAgICAgIGVuZDogLycvLFxuICAgICAgICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogL1wiLyxcbiAgICAgICAgICBlbmQ6IC9cIi8sXG4gICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICAgIFNVQlNUXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgICBiZWdpbjogJ0BfXycgKyBobGpzLklERU5UX1JFXG4gICAgfSxcbiAgICB7IGJlZ2luOiAnQCcgKyBobGpzLklERU5UX1JFIC8vIHJlbGV2YW5jZSBib29zdGVyIG9uIHBhciB3aXRoIENvZmZlZVNjcmlwdFxuICAgIH0sXG4gICAgeyBiZWdpbjogaGxqcy5JREVOVF9SRSArICdcXFxcXFxcXCcgKyBobGpzLklERU5UX1JFIC8vIGluc3RcXG1ldGhvZFxuICAgIH1cbiAgXTtcbiAgU1VCU1QuY29udGFpbnMgPSBFWFBSRVNTSU9OUztcblxuICBjb25zdCBUSVRMRSA9IGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHsgYmVnaW46IEpTX0lERU5UX1JFIH0pO1xuICBjb25zdCBQT1NTSUJMRV9QQVJBTVNfUkUgPSAnKFxcXFwoLipcXFxcKVxcXFxzKik/XFxcXEJbLT1dPic7XG4gIGNvbnN0IFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAnXFxcXChbXlxcXFwoXScsXG4gICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgLyogV2UgbmVlZCBhbm90aGVyIGNvbnRhaW5lZCBuYW1lbGVzcyBtb2RlIHRvIG5vdCBoYXZlIGV2ZXJ5IG5lc3RlZFxuICAgIHBhaXIgb2YgcGFyZW5zIHRvIGJlIGNhbGxlZCBcInBhcmFtc1wiICovXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbICdzZWxmJyBdLmNvbmNhdChFWFBSRVNTSU9OUylcbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnTW9vblNjcmlwdCcsXG4gICAgYWxpYXNlczogWyAnbW9vbicgXSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogL1xcL1xcKi8sXG4gICAgY29udGFpbnM6IEVYUFJFU1NJT05TLmNvbmNhdChbXG4gICAgICBobGpzLkNPTU1FTlQoJy0tJywgJyQnKSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLCAvLyBmdW5jdGlvbjogLT4gPT5cbiAgICAgICAgYmVnaW46ICdeXFxcXHMqJyArIEpTX0lERU5UX1JFICsgJ1xcXFxzKj1cXFxccyonICsgUE9TU0lCTEVfUEFSQU1TX1JFLFxuICAgICAgICBlbmQ6ICdbLT1dPicsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFRJVExFLFxuICAgICAgICAgIFBBUkFNU1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1tcXCgsOj1dXFxzKi8sIC8vIGFub255bW91cyBmdW5jdGlvbiBzdGFydFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgYmVnaW46IFBPU1NJQkxFX1BBUkFNU19SRSxcbiAgICAgICAgICAgIGVuZDogJ1stPV0+JyxcbiAgICAgICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IFsgUEFSQU1TIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGlsbGVnYWw6IC9bOj1cIlxcW1xcXV0vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luS2V5d29yZHM6ICdleHRlbmRzJyxcbiAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgaWxsZWdhbDogL1s6PVwiXFxbXFxdXS8sXG4gICAgICAgICAgICBjb250YWluczogWyBUSVRMRSBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUSVRMRVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICduYW1lJywgLy8gdGFibGVcbiAgICAgICAgYmVnaW46IEpTX0lERU5UX1JFICsgJzonLFxuICAgICAgICBlbmQ6ICc6JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXSlcbiAgfTtcbn1cblxuZXhwb3J0IHsgbW9vbnNjcmlwdCBhcyBkZWZhdWx0IH07XG4iXX0=