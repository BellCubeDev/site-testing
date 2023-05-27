function haskell(hljs) {
    const COMMENT = { variants: [
            hljs.COMMENT('--', '$'),
            hljs.COMMENT(/\{-/, /-\}/, { contains: ['self'] })
        ] };
    const PRAGMA = {
        className: 'meta',
        begin: /\{-#/,
        end: /#-\}/
    };
    const PREPROCESSOR = {
        className: 'meta',
        begin: '^#',
        end: '$'
    };
    const CONSTRUCTOR = {
        className: 'type',
        begin: '\\b[A-Z][\\w\']*',
        relevance: 0
    };
    const LIST = {
        begin: '\\(',
        end: '\\)',
        illegal: '"',
        contains: [
            PRAGMA,
            PREPROCESSOR,
            {
                className: 'type',
                begin: '\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'
            },
            hljs.inherit(hljs.TITLE_MODE, { begin: '[_a-z][\\w\']*' }),
            COMMENT
        ]
    };
    const RECORD = {
        begin: /\{/,
        end: /\}/,
        contains: LIST.contains
    };
    const decimalDigits = '([0-9]_*)+';
    const hexDigits = '([0-9a-fA-F]_*)+';
    const binaryDigits = '([01]_*)+';
    const octalDigits = '([0-7]_*)+';
    const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
            { match: `\\b(${decimalDigits})(\\.(${decimalDigits}))?` + `([eE][+-]?(${decimalDigits}))?\\b` },
            { match: `\\b0[xX]_*(${hexDigits})(\\.(${hexDigits}))?` + `([pP][+-]?(${decimalDigits}))?\\b` },
            { match: `\\b0[oO](${octalDigits})\\b` },
            { match: `\\b0[bB](${binaryDigits})\\b` }
        ]
    };
    return {
        name: 'Haskell',
        aliases: ['hs'],
        keywords: 'let in if then else case of where do module import hiding '
            + 'qualified type data newtype deriving class instance as default '
            + 'infix infixl infixr foreign export ccall stdcall cplusplus '
            + 'jvm dotnet safe unsafe family forall mdo proc rec',
        contains: [
            {
                beginKeywords: 'module',
                end: 'where',
                keywords: 'module where',
                contains: [
                    LIST,
                    COMMENT
                ],
                illegal: '\\W\\.|;'
            },
            {
                begin: '\\bimport\\b',
                end: '$',
                keywords: 'import qualified as hiding',
                contains: [
                    LIST,
                    COMMENT
                ],
                illegal: '\\W\\.|;'
            },
            {
                className: 'class',
                begin: '^(\\s*)?(class|instance)\\b',
                end: 'where',
                keywords: 'class family instance where',
                contains: [
                    CONSTRUCTOR,
                    LIST,
                    COMMENT
                ]
            },
            {
                className: 'class',
                begin: '\\b(data|(new)?type)\\b',
                end: '$',
                keywords: 'data family type newtype deriving',
                contains: [
                    PRAGMA,
                    CONSTRUCTOR,
                    LIST,
                    RECORD,
                    COMMENT
                ]
            },
            {
                beginKeywords: 'default',
                end: '$',
                contains: [
                    CONSTRUCTOR,
                    LIST,
                    COMMENT
                ]
            },
            {
                beginKeywords: 'infix infixl infixr',
                end: '$',
                contains: [
                    hljs.C_NUMBER_MODE,
                    COMMENT
                ]
            },
            {
                begin: '\\bforeign\\b',
                end: '$',
                keywords: 'foreign import export ccall stdcall cplusplus jvm '
                    + 'dotnet safe unsafe',
                contains: [
                    CONSTRUCTOR,
                    hljs.QUOTE_STRING_MODE,
                    COMMENT
                ]
            },
            {
                className: 'meta',
                begin: '#!\\/usr\\/bin\\/env\ runhaskell',
                end: '$'
            },
            PRAGMA,
            PREPROCESSOR,
            hljs.QUOTE_STRING_MODE,
            NUMBER,
            CONSTRUCTOR,
            hljs.inherit(hljs.TITLE_MODE, { begin: '^[_a-z][\\w\']*' }),
            COMMENT,
            {
                begin: '->|<-'
            }
        ]
    };
}
export { haskell as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFza2VsbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2hhc2tlbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FDVixLQUFLLEVBQ0wsS0FBSyxFQUNMLEVBQUUsUUFBUSxFQUFFLENBQUUsTUFBTSxDQUFFLEVBQUUsQ0FDekI7U0FDRixFQUFFLENBQUM7SUFFSixNQUFNLE1BQU0sR0FBRztRQUNiLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLEtBQUssRUFBRSxNQUFNO1FBQ2IsR0FBRyxFQUFFLE1BQU07S0FDWixDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUc7UUFDbkIsU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsR0FBRztLQUNULENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRztRQUNsQixTQUFTLEVBQUUsTUFBTTtRQUNqQixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHO1FBQ1gsS0FBSyxFQUFFLEtBQUs7UUFDWixHQUFHLEVBQUUsS0FBSztRQUNWLE9BQU8sRUFBRSxHQUFHO1FBQ1osUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLFlBQVk7WUFDWjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLHdDQUF3QzthQUNoRDtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUs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RUFBRSxHQUFHO2FBQ1Q7WUFFRCxNQUFNO1lBQ04sWUFBWTtZQUtaLElBQUksQ0FBQyxpQkFBaUI7WUFDdEIsTUFBTTtZQUNOLFdBQVc7WUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztZQUMzRCxPQUFPO1lBQ1A7Z0JBQ0UsS0FBSyxFQUFFLE9BQU87YUFBRTtTQUNuQjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogSGFza2VsbFxuQXV0aG9yOiBKZXJlbXkgSHVsbCA8c291cmRydW1zQGdtYWlsLmNvbT5cbkNvbnRyaWJ1dG9yczogWmVuYSBUcmVlcCA8emVuYS50cmVlcEBnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwczovL3d3dy5oYXNrZWxsLm9yZ1xuQ2F0ZWdvcnk6IGZ1bmN0aW9uYWxcbiovXG5cbmZ1bmN0aW9uIGhhc2tlbGwoaGxqcykge1xuICBjb25zdCBDT01NRU5UID0geyB2YXJpYW50czogW1xuICAgIGhsanMuQ09NTUVOVCgnLS0nLCAnJCcpLFxuICAgIGhsanMuQ09NTUVOVChcbiAgICAgIC9cXHstLyxcbiAgICAgIC8tXFx9LyxcbiAgICAgIHsgY29udGFpbnM6IFsgJ3NlbGYnIF0gfVxuICAgIClcbiAgXSB9O1xuXG4gIGNvbnN0IFBSQUdNQSA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBiZWdpbjogL1xcey0jLyxcbiAgICBlbmQ6IC8jLVxcfS9cbiAgfTtcblxuICBjb25zdCBQUkVQUk9DRVNTT1IgPSB7XG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgYmVnaW46ICdeIycsXG4gICAgZW5kOiAnJCdcbiAgfTtcblxuICBjb25zdCBDT05TVFJVQ1RPUiA9IHtcbiAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICBiZWdpbjogJ1xcXFxiW0EtWl1bXFxcXHdcXCddKicsIC8vIFRPRE86IG90aGVyIGNvbnN0cnVjdG9ycyAoYnVpbGQtaW4sIGluZml4KS5cbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBMSVNUID0ge1xuICAgIGJlZ2luOiAnXFxcXCgnLFxuICAgIGVuZDogJ1xcXFwpJyxcbiAgICBpbGxlZ2FsOiAnXCInLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBQUkFHTUEsXG4gICAgICBQUkVQUk9DRVNTT1IsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiW0EtWl1bXFxcXHddKihcXFxcKChcXFxcLlxcXFwufCx8XFxcXHcrKVxcXFwpKT8nXG4gICAgICB9LFxuICAgICAgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwgeyBiZWdpbjogJ1tfYS16XVtcXFxcd1xcJ10qJyB9KSxcbiAgICAgIENPTU1FTlRcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgUkVDT1JEID0ge1xuICAgIGJlZ2luOiAvXFx7LyxcbiAgICBlbmQ6IC9cXH0vLFxuICAgIGNvbnRhaW5zOiBMSVNULmNvbnRhaW5zXG4gIH07XG5cbiAgLyogU2VlOlxuXG4gICAgIC0gaHR0cHM6Ly93d3cuaGFza2VsbC5vcmcvb25saW5lcmVwb3J0L2xleGVtZXMuaHRtbFxuICAgICAtIGh0dHBzOi8vZG93bmxvYWRzLmhhc2tlbGwub3JnL2doYy85LjAuMS9kb2NzL2h0bWwvdXNlcnNfZ3VpZGUvZXh0cy9iaW5hcnlfbGl0ZXJhbHMuaHRtbFxuICAgICAtIGh0dHBzOi8vZG93bmxvYWRzLmhhc2tlbGwub3JnL2doYy85LjAuMS9kb2NzL2h0bWwvdXNlcnNfZ3VpZGUvZXh0cy9udW1lcmljX3VuZGVyc2NvcmVzLmh0bWxcbiAgICAgLSBodHRwczovL2Rvd25sb2Fkcy5oYXNrZWxsLm9yZy9naGMvOS4wLjEvZG9jcy9odG1sL3VzZXJzX2d1aWRlL2V4dHMvaGV4X2Zsb2F0X2xpdGVyYWxzLmh0bWxcblxuICAqL1xuICBjb25zdCBkZWNpbWFsRGlnaXRzID0gJyhbMC05XV8qKSsnO1xuICBjb25zdCBoZXhEaWdpdHMgPSAnKFswLTlhLWZBLUZdXyopKyc7XG4gIGNvbnN0IGJpbmFyeURpZ2l0cyA9ICcoWzAxXV8qKSsnO1xuICBjb25zdCBvY3RhbERpZ2l0cyA9ICcoWzAtN11fKikrJztcblxuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIC8vIGRlY2ltYWwgZmxvYXRpbmctcG9pbnQtbGl0ZXJhbCAoc3Vic3VtZXMgZGVjaW1hbC1saXRlcmFsKVxuICAgICAgeyBtYXRjaDogYFxcXFxiKCR7ZGVjaW1hbERpZ2l0c30pKFxcXFwuKCR7ZGVjaW1hbERpZ2l0c30pKT9gICsgYChbZUVdWystXT8oJHtkZWNpbWFsRGlnaXRzfSkpP1xcXFxiYCB9LFxuICAgICAgLy8gaGV4YWRlY2ltYWwgZmxvYXRpbmctcG9pbnQtbGl0ZXJhbCAoc3Vic3VtZXMgaGV4YWRlY2ltYWwtbGl0ZXJhbClcbiAgICAgIHsgbWF0Y2g6IGBcXFxcYjBbeFhdXyooJHtoZXhEaWdpdHN9KShcXFxcLigke2hleERpZ2l0c30pKT9gICsgYChbcFBdWystXT8oJHtkZWNpbWFsRGlnaXRzfSkpP1xcXFxiYCB9LFxuICAgICAgLy8gb2N0YWwtbGl0ZXJhbFxuICAgICAgeyBtYXRjaDogYFxcXFxiMFtvT10oJHtvY3RhbERpZ2l0c30pXFxcXGJgIH0sXG4gICAgICAvLyBiaW5hcnktbGl0ZXJhbFxuICAgICAgeyBtYXRjaDogYFxcXFxiMFtiQl0oJHtiaW5hcnlEaWdpdHN9KVxcXFxiYCB9XG4gICAgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0hhc2tlbGwnLFxuICAgIGFsaWFzZXM6IFsgJ2hzJyBdLFxuICAgIGtleXdvcmRzOlxuICAgICAgJ2xldCBpbiBpZiB0aGVuIGVsc2UgY2FzZSBvZiB3aGVyZSBkbyBtb2R1bGUgaW1wb3J0IGhpZGluZyAnXG4gICAgICArICdxdWFsaWZpZWQgdHlwZSBkYXRhIG5ld3R5cGUgZGVyaXZpbmcgY2xhc3MgaW5zdGFuY2UgYXMgZGVmYXVsdCAnXG4gICAgICArICdpbmZpeCBpbmZpeGwgaW5maXhyIGZvcmVpZ24gZXhwb3J0IGNjYWxsIHN0ZGNhbGwgY3BsdXNwbHVzICdcbiAgICAgICsgJ2p2bSBkb3RuZXQgc2FmZSB1bnNhZmUgZmFtaWx5IGZvcmFsbCBtZG8gcHJvYyByZWMnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAvLyBUb3AtbGV2ZWwgY29uc3RydWN0aW9ucy5cbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ21vZHVsZScsXG4gICAgICAgIGVuZDogJ3doZXJlJyxcbiAgICAgICAga2V5d29yZHM6ICdtb2R1bGUgd2hlcmUnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIExJU1QsXG4gICAgICAgICAgQ09NTUVOVFxuICAgICAgICBdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFdcXFxcLnw7J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcYmltcG9ydFxcXFxiJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnaW1wb3J0IHF1YWxpZmllZCBhcyBoaWRpbmcnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIExJU1QsXG4gICAgICAgICAgQ09NTUVOVFxuICAgICAgICBdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFdcXFxcLnw7J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJ14oXFxcXHMqKT8oY2xhc3N8aW5zdGFuY2UpXFxcXGInLFxuICAgICAgICBlbmQ6ICd3aGVyZScsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MgZmFtaWx5IGluc3RhbmNlIHdoZXJlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBDT05TVFJVQ1RPUixcbiAgICAgICAgICBMSVNULFxuICAgICAgICAgIENPTU1FTlRcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGRhdGF8KG5ldyk/dHlwZSlcXFxcYicsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ2RhdGEgZmFtaWx5IHR5cGUgbmV3dHlwZSBkZXJpdmluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgUFJBR01BLFxuICAgICAgICAgIENPTlNUUlVDVE9SLFxuICAgICAgICAgIExJU1QsXG4gICAgICAgICAgUkVDT1JELFxuICAgICAgICAgIENPTU1FTlRcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2RlZmF1bHQnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBDT05TVFJVQ1RPUixcbiAgICAgICAgICBMSVNULFxuICAgICAgICAgIENPTU1FTlRcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2luZml4IGluZml4bCBpbmZpeHInLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICAgICAgQ09NTUVOVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxiZm9yZWlnblxcXFxiJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnZm9yZWlnbiBpbXBvcnQgZXhwb3J0IGNjYWxsIHN0ZGNhbGwgY3BsdXNwbHVzIGp2bSAnXG4gICAgICAgICAgICAgICAgICArICdkb3RuZXQgc2FmZSB1bnNhZmUnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIENPTlNUUlVDVE9SLFxuICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgQ09NTUVOVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46ICcjIVxcXFwvdXNyXFxcXC9iaW5cXFxcL2VudlxcIHJ1bmhhc2tlbGwnLFxuICAgICAgICBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIC8vIFwiV2hpdGVzcGFjZXNcIi5cbiAgICAgIFBSQUdNQSxcbiAgICAgIFBSRVBST0NFU1NPUixcblxuICAgICAgLy8gTGl0ZXJhbHMgYW5kIG5hbWVzLlxuXG4gICAgICAvLyBUT0RPOiBjaGFyYWN0ZXJzLlxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIE5VTUJFUixcbiAgICAgIENPTlNUUlVDVE9SLFxuICAgICAgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwgeyBiZWdpbjogJ15bX2Etel1bXFxcXHdcXCddKicgfSksXG4gICAgICBDT01NRU5ULFxuICAgICAgeyAvLyBObyBtYXJrdXAsIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICAgIGJlZ2luOiAnLT58PC0nIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGhhc2tlbGwgYXMgZGVmYXVsdCB9O1xuIl19