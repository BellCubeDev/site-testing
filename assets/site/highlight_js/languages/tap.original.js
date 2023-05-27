function tap(hljs) {
    return {
        name: 'Test Anything Protocol',
        case_insensitive: true,
        contains: [
            hljs.HASH_COMMENT_MODE,
            {
                className: 'meta',
                variants: [
                    { begin: '^TAP version (\\d+)$' },
                    { begin: '^1\\.\\.(\\d+)$' }
                ]
            },
            {
                begin: /---$/,
                end: '\\.\\.\\.$',
                subLanguage: 'yaml',
                relevance: 0
            },
            {
                className: 'number',
                begin: ' (\\d+) '
            },
            {
                className: 'symbol',
                variants: [
                    { begin: '^ok' },
                    { begin: '^not ok' }
                ]
            }
        ]
    };
}
export { tap as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvdGFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixPQUFPO1FBQ0wsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxpQkFBaUI7WUFFdEI7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUixFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRTtvQkFDakMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7aUJBQzdCO2FBQ0Y7WUFFRDtnQkFDRSxLQUFLLEVBQUUsTUFBTTtnQkFDYixHQUFHLEVBQUUsWUFBWTtnQkFDakIsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFFRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLFVBQVU7YUFDbEI7WUFFRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtvQkFDaEIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO2lCQUNyQjthQUNGO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFRlc3QgQW55dGhpbmcgUHJvdG9jb2xcbkRlc2NyaXB0aW9uOiBUQVAsIHRoZSBUZXN0IEFueXRoaW5nIFByb3RvY29sLCBpcyBhIHNpbXBsZSB0ZXh0LWJhc2VkIGludGVyZmFjZSBiZXR3ZWVuIHRlc3RpbmcgbW9kdWxlcyBpbiBhIHRlc3QgaGFybmVzcy5cblJlcXVpcmVzOiB5YW1sLmpzXG5BdXRob3I6IFNlcmdleSBCcm9ubmlrb3YgPHNlcmdleWJAYnJvbmV2aWNob2sucnU+XG5XZWJzaXRlOiBodHRwczovL3Rlc3Rhbnl0aGluZy5vcmdcbiovXG5cbmZ1bmN0aW9uIHRhcChobGpzKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1Rlc3QgQW55dGhpbmcgUHJvdG9jb2wnLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICAvLyB2ZXJzaW9uIG9mIGZvcm1hdCBhbmQgdG90YWwgYW1vdW50IG9mIHRlc3RjYXNlc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiAnXlRBUCB2ZXJzaW9uIChcXFxcZCspJCcgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXjFcXFxcLlxcXFwuKFxcXFxkKykkJyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBZQU1MIGJsb2NrXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvLS0tJC8sXG4gICAgICAgIGVuZDogJ1xcXFwuXFxcXC5cXFxcLiQnLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3lhbWwnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyB0ZXN0Y2FzZSBudW1iZXJcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICcgKFxcXFxkKykgJ1xuICAgICAgfSxcbiAgICAgIC8vIHRlc3RjYXNlIHN0YXR1cyBhbmQgZGVzY3JpcHRpb25cbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiAnXm9rJyB9LFxuICAgICAgICAgIHsgYmVnaW46ICdebm90IG9rJyB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHRhcCBhcyBkZWZhdWx0IH07XG4iXX0=