function oxygene(hljs) {
    const OXYGENE_KEYWORDS = {
        $pattern: /\.?\w+/,
        keyword: 'abstract add and array as asc aspect assembly async begin break block by case class concat const copy constructor continue '
            + 'create default delegate desc distinct div do downto dynamic each else empty end ensure enum equals event except exit extension external false '
            + 'final finalize finalizer finally flags for forward from function future global group has if implementation implements implies in index inherited '
            + 'inline interface into invariants is iterator join locked locking loop matching method mod module namespace nested new nil not notify nullable of '
            + 'old on operator or order out override parallel params partial pinned private procedure property protected public queryable raise read readonly '
            + 'record reintroduce remove repeat require result reverse sealed select self sequence set shl shr skip static step soft take then to true try tuple '
            + 'type union unit unsafe until uses using var virtual raises volatile where while with write xor yield await mapped deprecated stdcall cdecl pascal '
            + 'register safecall overload library platform reference packed strict published autoreleasepool selector strong weak unretained'
    };
    const CURLY_COMMENT = hljs.COMMENT(/\{/, /\}/, { relevance: 0 });
    const PAREN_COMMENT = hljs.COMMENT('\\(\\*', '\\*\\)', { relevance: 10 });
    const STRING = {
        className: 'string',
        begin: '\'',
        end: '\'',
        contains: [{ begin: '\'\'' }]
    };
    const CHAR_STRING = {
        className: 'string',
        begin: '(#\\d+)+'
    };
    const FUNCTION = {
        beginKeywords: 'function constructor destructor procedure method',
        end: '[:;]',
        keywords: 'function constructor|10 destructor|10 procedure|10 method|10',
        contains: [
            hljs.inherit(hljs.TITLE_MODE, { scope: "title.function" }),
            {
                className: 'params',
                begin: '\\(',
                end: '\\)',
                keywords: OXYGENE_KEYWORDS,
                contains: [
                    STRING,
                    CHAR_STRING
                ]
            },
            CURLY_COMMENT,
            PAREN_COMMENT
        ]
    };
    const SEMICOLON = {
        scope: "punctuation",
        match: /;/,
        relevance: 0
    };
    return {
        name: 'Oxygene',
        case_insensitive: true,
        keywords: OXYGENE_KEYWORDS,
        illegal: '("|\\$[G-Zg-z]|\\/\\*|</|=>|->)',
        contains: [
            CURLY_COMMENT,
            PAREN_COMMENT,
            hljs.C_LINE_COMMENT_MODE,
            STRING,
            CHAR_STRING,
            hljs.NUMBER_MODE,
            FUNCTION,
            SEMICOLON
        ]
    };
}
export { oxygene as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3h5Z2VuZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL294eWdlbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLE9BQU8sRUFDTCw2SEFBNkg7Y0FDM0gsZ0pBQWdKO2NBQ2hKLG1KQUFtSjtjQUNuSixtSkFBbUo7Y0FDbkosaUpBQWlKO2NBQ2pKLG9KQUFvSjtjQUNwSixvSkFBb0o7Y0FDcEosK0hBQStIO0tBQ3BJLENBQUM7SUFDRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUNoQyxJQUFJLEVBQ0osSUFBSSxFQUNKLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUNqQixDQUFDO0lBQ0YsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDaEMsUUFBUSxFQUNSLFFBQVEsRUFDUixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsSUFBSTtRQUNULFFBQVEsRUFBRSxDQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFFO0tBQ2hDLENBQUM7SUFDRixNQUFNLFdBQVcsR0FBRztRQUNsQixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsVUFBVTtLQUNsQixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUc7UUFDZixhQUFhLEVBQUUsa0RBQWtEO1FBQ2pFLEdBQUcsRUFBRSxNQUFNO1FBQ1gsUUFBUSxFQUFFLDhEQUE4RDtRQUN4RSxRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFO29CQUNSLE1BQU07b0JBQ04sV0FBVztpQkFDWjthQUNGO1lBQ0QsYUFBYTtZQUNiLGFBQWE7U0FDZDtLQUNGLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRztRQUNoQixLQUFLLEVBQUUsYUFBYTtRQUNwQixLQUFLLEVBQUUsR0FBRztRQUNWLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsU0FBUztRQUNmLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsUUFBUSxFQUFFLGdCQUFnQjtRQUMxQixPQUFPLEVBQUUsaUNBQWlDO1FBQzFDLFFBQVEsRUFBRTtZQUNSLGFBQWE7WUFDYixhQUFhO1lBQ2IsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixNQUFNO1lBQ04sV0FBVztZQUNYLElBQUksQ0FBQyxXQUFXO1lBQ2hCLFFBQVE7WUFDUixTQUFTO1NBQ1Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IE94eWdlbmVcbkF1dGhvcjogQ2FybG8gS29rIDxja0ByZW1vYmplY3RzLmNvbT5cbkRlc2NyaXB0aW9uOiBPeHlnZW5lIGlzIGJ1aWx0IG9uIHRoZSBmb3VuZGF0aW9uIG9mIE9iamVjdCBQYXNjYWwsIHJldmFtcGVkIGFuZCBleHRlbmRlZCB0byBiZSBhIG1vZGVybiBsYW5ndWFnZSBmb3IgdGhlIHR3ZW50eS1maXJzdCBjZW50dXJ5LlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuZWxlbWVudHNjb21waWxlci5jb20vZWxlbWVudHMvZGVmYXVsdC5hc3B4XG4qL1xuXG5mdW5jdGlvbiBveHlnZW5lKGhsanMpIHtcbiAgY29uc3QgT1hZR0VORV9LRVlXT1JEUyA9IHtcbiAgICAkcGF0dGVybjogL1xcLj9cXHcrLyxcbiAgICBrZXl3b3JkOlxuICAgICAgJ2Fic3RyYWN0IGFkZCBhbmQgYXJyYXkgYXMgYXNjIGFzcGVjdCBhc3NlbWJseSBhc3luYyBiZWdpbiBicmVhayBibG9jayBieSBjYXNlIGNsYXNzIGNvbmNhdCBjb25zdCBjb3B5IGNvbnN0cnVjdG9yIGNvbnRpbnVlICdcbiAgICAgICsgJ2NyZWF0ZSBkZWZhdWx0IGRlbGVnYXRlIGRlc2MgZGlzdGluY3QgZGl2IGRvIGRvd250byBkeW5hbWljIGVhY2ggZWxzZSBlbXB0eSBlbmQgZW5zdXJlIGVudW0gZXF1YWxzIGV2ZW50IGV4Y2VwdCBleGl0IGV4dGVuc2lvbiBleHRlcm5hbCBmYWxzZSAnXG4gICAgICArICdmaW5hbCBmaW5hbGl6ZSBmaW5hbGl6ZXIgZmluYWxseSBmbGFncyBmb3IgZm9yd2FyZCBmcm9tIGZ1bmN0aW9uIGZ1dHVyZSBnbG9iYWwgZ3JvdXAgaGFzIGlmIGltcGxlbWVudGF0aW9uIGltcGxlbWVudHMgaW1wbGllcyBpbiBpbmRleCBpbmhlcml0ZWQgJ1xuICAgICAgKyAnaW5saW5lIGludGVyZmFjZSBpbnRvIGludmFyaWFudHMgaXMgaXRlcmF0b3Igam9pbiBsb2NrZWQgbG9ja2luZyBsb29wIG1hdGNoaW5nIG1ldGhvZCBtb2QgbW9kdWxlIG5hbWVzcGFjZSBuZXN0ZWQgbmV3IG5pbCBub3Qgbm90aWZ5IG51bGxhYmxlIG9mICdcbiAgICAgICsgJ29sZCBvbiBvcGVyYXRvciBvciBvcmRlciBvdXQgb3ZlcnJpZGUgcGFyYWxsZWwgcGFyYW1zIHBhcnRpYWwgcGlubmVkIHByaXZhdGUgcHJvY2VkdXJlIHByb3BlcnR5IHByb3RlY3RlZCBwdWJsaWMgcXVlcnlhYmxlIHJhaXNlIHJlYWQgcmVhZG9ubHkgJ1xuICAgICAgKyAncmVjb3JkIHJlaW50cm9kdWNlIHJlbW92ZSByZXBlYXQgcmVxdWlyZSByZXN1bHQgcmV2ZXJzZSBzZWFsZWQgc2VsZWN0IHNlbGYgc2VxdWVuY2Ugc2V0IHNobCBzaHIgc2tpcCBzdGF0aWMgc3RlcCBzb2Z0IHRha2UgdGhlbiB0byB0cnVlIHRyeSB0dXBsZSAnXG4gICAgICArICd0eXBlIHVuaW9uIHVuaXQgdW5zYWZlIHVudGlsIHVzZXMgdXNpbmcgdmFyIHZpcnR1YWwgcmFpc2VzIHZvbGF0aWxlIHdoZXJlIHdoaWxlIHdpdGggd3JpdGUgeG9yIHlpZWxkIGF3YWl0IG1hcHBlZCBkZXByZWNhdGVkIHN0ZGNhbGwgY2RlY2wgcGFzY2FsICdcbiAgICAgICsgJ3JlZ2lzdGVyIHNhZmVjYWxsIG92ZXJsb2FkIGxpYnJhcnkgcGxhdGZvcm0gcmVmZXJlbmNlIHBhY2tlZCBzdHJpY3QgcHVibGlzaGVkIGF1dG9yZWxlYXNlcG9vbCBzZWxlY3RvciBzdHJvbmcgd2VhayB1bnJldGFpbmVkJ1xuICB9O1xuICBjb25zdCBDVVJMWV9DT01NRU5UID0gaGxqcy5DT01NRU5UKFxuICAgIC9cXHsvLFxuICAgIC9cXH0vLFxuICAgIHsgcmVsZXZhbmNlOiAwIH1cbiAgKTtcbiAgY29uc3QgUEFSRU5fQ09NTUVOVCA9IGhsanMuQ09NTUVOVChcbiAgICAnXFxcXChcXFxcKicsXG4gICAgJ1xcXFwqXFxcXCknLFxuICAgIHsgcmVsZXZhbmNlOiAxMCB9XG4gICk7XG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFwnJyxcbiAgICBlbmQ6ICdcXCcnLFxuICAgIGNvbnRhaW5zOiBbIHsgYmVnaW46ICdcXCdcXCcnIH0gXVxuICB9O1xuICBjb25zdCBDSEFSX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnKCNcXFxcZCspKydcbiAgfTtcbiAgY29uc3QgRlVOQ1RJT04gPSB7XG4gICAgYmVnaW5LZXl3b3JkczogJ2Z1bmN0aW9uIGNvbnN0cnVjdG9yIGRlc3RydWN0b3IgcHJvY2VkdXJlIG1ldGhvZCcsXG4gICAgZW5kOiAnWzo7XScsXG4gICAga2V5d29yZHM6ICdmdW5jdGlvbiBjb25zdHJ1Y3RvcnwxMCBkZXN0cnVjdG9yfDEwIHByb2NlZHVyZXwxMCBtZXRob2R8MTAnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IHNjb3BlOiBcInRpdGxlLmZ1bmN0aW9uXCIgfSksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLFxuICAgICAgICBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGtleXdvcmRzOiBPWFlHRU5FX0tFWVdPUkRTLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFNUUklORyxcbiAgICAgICAgICBDSEFSX1NUUklOR1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgQ1VSTFlfQ09NTUVOVCxcbiAgICAgIFBBUkVOX0NPTU1FTlRcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgU0VNSUNPTE9OID0ge1xuICAgIHNjb3BlOiBcInB1bmN0dWF0aW9uXCIsXG4gICAgbWF0Y2g6IC87LyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdPeHlnZW5lJyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiBPWFlHRU5FX0tFWVdPUkRTLFxuICAgIGlsbGVnYWw6ICcoXCJ8XFxcXCRbRy1aZy16XXxcXFxcL1xcXFwqfDwvfD0+fC0+KScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIENVUkxZX0NPTU1FTlQsXG4gICAgICBQQVJFTl9DT01NRU5ULFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgU1RSSU5HLFxuICAgICAgQ0hBUl9TVFJJTkcsXG4gICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgRlVOQ1RJT04sXG4gICAgICBTRU1JQ09MT05cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IG94eWdlbmUgYXMgZGVmYXVsdCB9O1xuIl19