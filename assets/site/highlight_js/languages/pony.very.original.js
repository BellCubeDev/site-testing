function pony(hljs) {
    const KEYWORDS = {
        keyword: 'actor addressof and as be break class compile_error compile_intrinsic '
            + 'consume continue delegate digestof do else elseif embed end error '
            + 'for fun if ifdef in interface is isnt lambda let match new not object '
            + 'or primitive recover repeat return struct then trait try type until '
            + 'use var where while with xor',
        meta: 'iso val tag trn box ref',
        literal: 'this false true'
    };
    const TRIPLE_QUOTE_STRING_MODE = {
        className: 'string',
        begin: '"""',
        end: '"""',
        relevance: 10
    };
    const QUOTE_STRING_MODE = {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE]
    };
    const SINGLE_QUOTE_CHAR_MODE = {
        className: 'string',
        begin: '\'',
        end: '\'',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
    };
    const TYPE_NAME = {
        className: 'type',
        begin: '\\b_?[A-Z][\\w]*',
        relevance: 0
    };
    const PRIMED_NAME = {
        begin: hljs.IDENT_RE + '\'',
        relevance: 0
    };
    const NUMBER_MODE = {
        className: 'number',
        begin: '(-?)(\\b0[xX][a-fA-F0-9]+|\\b0[bB][01]+|(\\b\\d+(_\\d+)?(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)',
        relevance: 0
    };
    return {
        name: 'Pony',
        keywords: KEYWORDS,
        contains: [
            TYPE_NAME,
            TRIPLE_QUOTE_STRING_MODE,
            QUOTE_STRING_MODE,
            SINGLE_QUOTE_CHAR_MODE,
            PRIMED_NAME,
            NUMBER_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ]
    };
}
export { pony as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ueS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3BvbnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFDTCx3RUFBd0U7Y0FDdEUsb0VBQW9FO2NBQ3BFLHdFQUF3RTtjQUN4RSxzRUFBc0U7Y0FDdEUsOEJBQThCO1FBQ2xDLElBQUksRUFDRix5QkFBeUI7UUFDM0IsT0FBTyxFQUNMLGlCQUFpQjtLQUNwQixDQUFDO0lBRUYsTUFBTSx3QkFBd0IsR0FBRztRQUMvQixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsS0FBSztRQUNaLEdBQUcsRUFBRSxLQUFLO1FBQ1YsU0FBUyxFQUFFLEVBQUU7S0FDZCxDQUFDO0lBRUYsTUFBTSxpQkFBaUIsR0FBRztRQUN4QixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsR0FBRztRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsUUFBUSxFQUFFLENBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFFO0tBQ3BDLENBQUM7SUFFRixNQUFNLHNCQUFzQixHQUFHO1FBQzdCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxJQUFJO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUU7UUFDbkMsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUc7UUFDaEIsU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLGtCQUFrQjtRQUN6QixTQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRztRQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO1FBQzNCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSw4RkFBOEY7UUFDckcsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBYUYsT0FBTztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsU0FBUztZQUNULHdCQUF3QjtZQUN4QixpQkFBaUI7WUFDakIsc0JBQXNCO1lBQ3RCLFdBQVc7WUFDWCxXQUFXO1lBQ1gsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsb0JBQW9CO1NBQzFCO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBQb255XG5BdXRob3I6IEpvZSBFbGkgTWNJbHZhaW4gPGpvZS5lbGkubWFjQGdtYWlsLmNvbT5cbkRlc2NyaXB0aW9uOiBQb255IGlzIGFuIG9wZW4tc291cmNlLCBvYmplY3Qtb3JpZW50ZWQsIGFjdG9yLW1vZGVsLFxuICAgICAgICAgICAgIGNhcGFiaWxpdGllcy1zZWN1cmUsIGhpZ2ggcGVyZm9ybWFuY2UgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UuXG5XZWJzaXRlOiBodHRwczovL3d3dy5wb255bGFuZy5pb1xuKi9cblxuZnVuY3Rpb24gcG9ueShobGpzKSB7XG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnYWN0b3IgYWRkcmVzc29mIGFuZCBhcyBiZSBicmVhayBjbGFzcyBjb21waWxlX2Vycm9yIGNvbXBpbGVfaW50cmluc2ljICdcbiAgICAgICsgJ2NvbnN1bWUgY29udGludWUgZGVsZWdhdGUgZGlnZXN0b2YgZG8gZWxzZSBlbHNlaWYgZW1iZWQgZW5kIGVycm9yICdcbiAgICAgICsgJ2ZvciBmdW4gaWYgaWZkZWYgaW4gaW50ZXJmYWNlIGlzIGlzbnQgbGFtYmRhIGxldCBtYXRjaCBuZXcgbm90IG9iamVjdCAnXG4gICAgICArICdvciBwcmltaXRpdmUgcmVjb3ZlciByZXBlYXQgcmV0dXJuIHN0cnVjdCB0aGVuIHRyYWl0IHRyeSB0eXBlIHVudGlsICdcbiAgICAgICsgJ3VzZSB2YXIgd2hlcmUgd2hpbGUgd2l0aCB4b3InLFxuICAgIG1ldGE6XG4gICAgICAnaXNvIHZhbCB0YWcgdHJuIGJveCByZWYnLFxuICAgIGxpdGVyYWw6XG4gICAgICAndGhpcyBmYWxzZSB0cnVlJ1xuICB9O1xuXG4gIGNvbnN0IFRSSVBMRV9RVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCJcIlwiJyxcbiAgICBlbmQ6ICdcIlwiXCInLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcblxuICBjb25zdCBRVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLFxuICAgIGVuZDogJ1wiJyxcbiAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXVxuICB9O1xuXG4gIGNvbnN0IFNJTkdMRV9RVU9URV9DSEFSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcJycsXG4gICAgZW5kOiAnXFwnJyxcbiAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBUWVBFX05BTUUgPSB7XG4gICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgYmVnaW46ICdcXFxcYl8/W0EtWl1bXFxcXHddKicsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgUFJJTUVEX05BTUUgPSB7XG4gICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnXFwnJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBOVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiAnKC0/KShcXFxcYjBbeFhdW2EtZkEtRjAtOV0rfFxcXFxiMFtiQl1bMDFdK3woXFxcXGJcXFxcZCsoX1xcXFxkKyk/KFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKFtlRV1bLStdP1xcXFxkKyk/KScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgLyoqXG4gICAqIFRoZSBgRlVOQ1RJT05gIGFuZCBgQ0xBU1NgIG1vZGVzIHdlcmUgaW50ZW50aW9uYWxseSByZW1vdmVkIHRvIHNpbXBsaWZ5XG4gICAqIGhpZ2hsaWdodGluZyBhbmQgZml4IGNhc2VzIGxpa2VcbiAgICogYGBgXG4gICAqIGludGVyZmFjZSBJdGVyYXRvcltBOiBBXVxuICAgKiAgIGZ1biBoYXNfbmV4dCgpOiBCb29sXG4gICAqICAgZnVuIG5leHQoKTogQT9cbiAgICogYGBgXG4gICAqIHdoZXJlIGl0IGlzIHZhbGlkIHRvIGhhdmUgYSBmdW5jdGlvbiBoZWFkIHdpdGhvdXQgYSBib2R5XG4gICAqL1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1BvbnknLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgVFlQRV9OQU1FLFxuICAgICAgVFJJUExFX1FVT1RFX1NUUklOR19NT0RFLFxuICAgICAgUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBTSU5HTEVfUVVPVEVfQ0hBUl9NT0RFLFxuICAgICAgUFJJTUVEX05BTUUsXG4gICAgICBOVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHBvbnkgYXMgZGVmYXVsdCB9O1xuIl19