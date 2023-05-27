function dts(hljs) {
    const STRINGS = {
        className: 'string',
        variants: [
            hljs.inherit(hljs.QUOTE_STRING_MODE, { begin: '((u8?|U)|L)?"' }),
            {
                begin: '(u8?|U)?R"',
                end: '"',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                begin: '\'\\\\?.',
                end: '\'',
                illegal: '.'
            }
        ]
    };
    const NUMBERS = {
        className: 'number',
        variants: [
            { begin: '\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)' },
            { begin: hljs.C_NUMBER_RE }
        ],
        relevance: 0
    };
    const PREPROCESSOR = {
        className: 'meta',
        begin: '#',
        end: '$',
        keywords: { keyword: 'if else elif endif define undef ifdef ifndef' },
        contains: [
            {
                begin: /\\\n/,
                relevance: 0
            },
            {
                beginKeywords: 'include',
                end: '$',
                keywords: { keyword: 'include' },
                contains: [
                    hljs.inherit(STRINGS, { className: 'string' }),
                    {
                        className: 'string',
                        begin: '<',
                        end: '>',
                        illegal: '\\n'
                    }
                ]
            },
            STRINGS,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ]
    };
    const REFERENCE = {
        className: 'variable',
        begin: /&[a-z\d_]*\b/
    };
    const KEYWORD = {
        className: 'keyword',
        begin: '/[a-z][a-z\\d-]*/'
    };
    const LABEL = {
        className: 'symbol',
        begin: '^\\s*[a-zA-Z_][a-zA-Z\\d_]*:'
    };
    const CELL_PROPERTY = {
        className: 'params',
        relevance: 0,
        begin: '<',
        end: '>',
        contains: [
            NUMBERS,
            REFERENCE
        ]
    };
    const NODE = {
        className: 'title.class',
        begin: /[a-zA-Z_][a-zA-Z\d_@-]*(?=\s\{)/,
        relevance: 0.2
    };
    const ROOT_NODE = {
        className: 'title.class',
        begin: /^\/(?=\s*\{)/,
        relevance: 10
    };
    const ATTR_NO_VALUE = {
        match: /[a-z][a-z-,]+(?=;)/,
        relevance: 0,
        scope: "attr"
    };
    const ATTR = {
        relevance: 0,
        match: [
            /[a-z][a-z-,]+/,
            /\s*/,
            /=/
        ],
        scope: {
            1: "attr",
            3: "operator"
        }
    };
    const PUNC = {
        scope: "punctuation",
        relevance: 0,
        match: /\};|[;{}]/
    };
    return {
        name: 'Device Tree',
        contains: [
            ROOT_NODE,
            REFERENCE,
            KEYWORD,
            LABEL,
            NODE,
            ATTR,
            ATTR_NO_VALUE,
            CELL_PROPERTY,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            NUMBERS,
            STRINGS,
            PREPROCESSOR,
            PUNC,
            {
                begin: hljs.IDENT_RE + '::',
                keywords: ""
            }
        ]
    };
}
export { dts as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHRzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvZHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLE9BQU8sR0FBRztRQUNkLFNBQVMsRUFBRSxRQUFRO1FBQ25CLFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxDQUFDO1lBQ2hFO2dCQUNFLEtBQUssRUFBRSxZQUFZO2dCQUNuQixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUU7YUFDcEM7WUFDRDtnQkFDRSxLQUFLLEVBQUUsVUFBVTtnQkFDakIsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsT0FBTyxFQUFFLEdBQUc7YUFDYjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sT0FBTyxHQUFHO1FBQ2QsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsZ0RBQWdELEVBQUU7WUFDM0QsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRTtTQUM1QjtRQUNELFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHO1FBQ25CLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLEtBQUssRUFBRSxHQUFHO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsOENBQThDLEVBQUU7UUFDckUsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLGFBQWEsRUFBRSxTQUFTO2dCQUN4QixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO2dCQUNoQyxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLENBQUM7b0JBQzlDO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsR0FBRzt3QkFDVixHQUFHLEVBQUUsR0FBRzt3QkFDUixPQUFPLEVBQUUsS0FBSztxQkFDZjtpQkFDRjthQUNGO1lBQ0QsT0FBTztZQUNQLElBQUksQ0FBQyxtQkFBbUI7WUFDeEIsSUFBSSxDQUFDLG9CQUFvQjtTQUMxQjtLQUNGLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRztRQUNoQixTQUFTLEVBQUUsVUFBVTtRQUNyQixLQUFLLEVBQUUsY0FBYztLQUN0QixDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUc7UUFDZCxTQUFTLEVBQUUsU0FBUztRQUNwQixLQUFLLEVBQUUsbUJBQW1CO0tBQzNCLENBQUM7SUFFRixNQUFNLEtBQUssR0FBRztRQUNaLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSw4QkFBOEI7S0FDdEMsQ0FBQztJQUVGLE1BQU0sYUFBYSxHQUFHO1FBQ3BCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLFNBQVMsRUFBRSxDQUFDO1FBQ1osS0FBSyxFQUFFLEdBQUc7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRTtZQUNSLE9BQU87WUFDUCxTQUFTO1NBQ1Y7S0FDRixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUc7UUFDWCxTQUFTLEVBQUUsYUFBYTtRQUN4QixLQUFLLEVBQUUsaUNBQWlDO1FBQ3hDLFNBQVMsRUFBRSxHQUFHO0tBQ2YsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFNBQVMsRUFBRSxhQUFhO1FBQ3hCLEtBQUssRUFBRSxjQUFjO1FBQ3JCLFNBQVMsRUFBRSxFQUFFO0tBQ2QsQ0FBQztJQUlGLE1BQU0sYUFBYSxHQUFHO1FBQ3BCLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsU0FBUyxFQUFFLENBQUM7UUFDWixLQUFLLEVBQUUsTUFBTTtLQUNkLENBQUM7SUFDRixNQUFNLElBQUksR0FBRztRQUNYLFNBQVMsRUFBRSxDQUFDO1FBQ1osS0FBSyxFQUFFO1lBQ0wsZUFBZTtZQUNmLEtBQUs7WUFDTCxHQUFHO1NBQ0o7UUFDRCxLQUFLLEVBQUU7WUFDTCxDQUFDLEVBQUUsTUFBTTtZQUNULENBQUMsRUFBRSxVQUFVO1NBQ2Q7S0FDRixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUc7UUFDWCxLQUFLLEVBQUUsYUFBYTtRQUNwQixTQUFTLEVBQUUsQ0FBQztRQUVaLEtBQUssRUFBRSxXQUFXO0tBQ25CLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLGFBQWE7UUFDbkIsUUFBUSxFQUFFO1lBQ1IsU0FBUztZQUNULFNBQVM7WUFDVCxPQUFPO1lBQ1AsS0FBSztZQUNMLElBQUk7WUFDSixJQUFJO1lBQ0osYUFBYTtZQUNiLGFBQWE7WUFDYixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsT0FBTztZQUNQLE9BQU87WUFDUCxZQUFZO1lBQ1osSUFBSTtZQUNKO2dCQUNFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUk7Z0JBQzNCLFFBQVEsRUFBRSxFQUFFO2FBQ2I7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogRGV2aWNlIFRyZWVcbkRlc2NyaXB0aW9uOiAqLmR0cyBmaWxlcyB1c2VkIGluIHRoZSBMaW51eCBrZXJuZWxcbkF1dGhvcjogTWFydGluIEJyYXVuIDxtYXJ0aW4uYnJhdW5AZXR0dXMuY29tPiwgTW9yaXR6IEZpc2NoZXIgPG1vcml0ei5maXNjaGVyQGV0dHVzLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vZWxpbnV4Lm9yZy9EZXZpY2VfVHJlZV9SZWZlcmVuY2VcbkNhdGVnb3J5OiBjb25maWdcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBkdHMoaGxqcykge1xuICBjb25zdCBTVFJJTkdTID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7IGJlZ2luOiAnKCh1OD98VSl8TCk/XCInIH0pLFxuICAgICAge1xuICAgICAgICBiZWdpbjogJyh1OD98VSk/UlwiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXCdcXFxcXFxcXD8uJyxcbiAgICAgICAgZW5kOiAnXFwnJyxcbiAgICAgICAgaWxsZWdhbDogJy4nXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IE5VTUJFUlMgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ1xcXFxiKFxcXFxkKyhcXFxcLlxcXFxkKik/fFxcXFwuXFxcXGQrKSh1fFV8bHxMfHVsfFVMfGZ8RiknIH0sXG4gICAgICB7IGJlZ2luOiBobGpzLkNfTlVNQkVSX1JFIH1cbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFBSRVBST0NFU1NPUiA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBiZWdpbjogJyMnLFxuICAgIGVuZDogJyQnLFxuICAgIGtleXdvcmRzOiB7IGtleXdvcmQ6ICdpZiBlbHNlIGVsaWYgZW5kaWYgZGVmaW5lIHVuZGVmIGlmZGVmIGlmbmRlZicgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcXFxcXG4vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdpbmNsdWRlJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiB7IGtleXdvcmQ6ICdpbmNsdWRlJyB9LFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuaW5oZXJpdChTVFJJTkdTLCB7IGNsYXNzTmFtZTogJ3N0cmluZycgfSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGJlZ2luOiAnPCcsXG4gICAgICAgICAgICBlbmQ6ICc+JyxcbiAgICAgICAgICAgIGlsbGVnYWw6ICdcXFxcbidcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBTVFJJTkdTLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBSRUZFUkVOQ0UgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAvJlthLXpcXGRfXSpcXGIvXG4gIH07XG5cbiAgY29uc3QgS0VZV09SRCA9IHtcbiAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICBiZWdpbjogJy9bYS16XVthLXpcXFxcZC1dKi8nXG4gIH07XG5cbiAgY29uc3QgTEFCRUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICBiZWdpbjogJ15cXFxccypbYS16QS1aX11bYS16QS1aXFxcXGRfXSo6J1xuICB9O1xuXG4gIGNvbnN0IENFTExfUFJPUEVSVFkgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgYmVnaW46ICc8JyxcbiAgICBlbmQ6ICc+JyxcbiAgICBjb250YWluczogW1xuICAgICAgTlVNQkVSUyxcbiAgICAgIFJFRkVSRU5DRVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBOT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlLmNsYXNzJyxcbiAgICBiZWdpbjogL1thLXpBLVpfXVthLXpBLVpcXGRfQC1dKig/PVxcc1xceykvLFxuICAgIHJlbGV2YW5jZTogMC4yXG4gIH07XG5cbiAgY29uc3QgUk9PVF9OT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlLmNsYXNzJyxcbiAgICBiZWdpbjogL15cXC8oPz1cXHMqXFx7KS8sXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuXG4gIC8vIFRPRE86IGBhdHRyaWJ1dGVgIG1pZ2h0IGJlIHRoZSByaWdodCBzY29wZSBoZXJlLCB1bnN1cmVcbiAgLy8gSSdtIG5vdCBzdXJlIGlmIGFsbCB0aGVzZSBrZXkgbmFtZXMgaGF2ZSBzZW1hbnRpYyBtZWFuaW5nIG9yIG5vdFxuICBjb25zdCBBVFRSX05PX1ZBTFVFID0ge1xuICAgIG1hdGNoOiAvW2Etel1bYS16LSxdKyg/PTspLyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgc2NvcGU6IFwiYXR0clwiXG4gIH07XG4gIGNvbnN0IEFUVFIgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIG1hdGNoOiBbXG4gICAgICAvW2Etel1bYS16LSxdKy8sXG4gICAgICAvXFxzKi8sXG4gICAgICAvPS9cbiAgICBdLFxuICAgIHNjb3BlOiB7XG4gICAgICAxOiBcImF0dHJcIixcbiAgICAgIDM6IFwib3BlcmF0b3JcIlxuICAgIH1cbiAgfTtcblxuICBjb25zdCBQVU5DID0ge1xuICAgIHNjb3BlOiBcInB1bmN0dWF0aW9uXCIsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIC8vIGB9O2AgY29tYmluZWQgaXMganVzdCB0byBhdm9pZCB0b25zIG9mIHVzZWxlc3MgcHVuY3R1YXRpb24gbm9kZXNcbiAgICBtYXRjaDogL1xcfTt8Wzt7fV0vXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnRGV2aWNlIFRyZWUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBST09UX05PREUsXG4gICAgICBSRUZFUkVOQ0UsXG4gICAgICBLRVlXT1JELFxuICAgICAgTEFCRUwsXG4gICAgICBOT0RFLFxuICAgICAgQVRUUixcbiAgICAgIEFUVFJfTk9fVkFMVUUsXG4gICAgICBDRUxMX1BST1BFUlRZLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIE5VTUJFUlMsXG4gICAgICBTVFJJTkdTLFxuICAgICAgUFJFUFJPQ0VTU09SLFxuICAgICAgUFVOQyxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnOjonLFxuICAgICAgICBrZXl3b3JkczogXCJcIlxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZHRzIGFzIGRlZmF1bHQgfTtcbiJdfQ==