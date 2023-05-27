function zephir(hljs) {
    const STRING = {
        className: 'string',
        contains: [hljs.BACKSLASH_ESCAPE],
        variants: [
            hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null }),
            hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null })
        ]
    };
    const TITLE_MODE = hljs.UNDERSCORE_TITLE_MODE;
    const NUMBER = { variants: [
            hljs.BINARY_NUMBER_MODE,
            hljs.C_NUMBER_MODE
        ] };
    const KEYWORDS = 'namespace class interface use extends '
        + 'function return '
        + 'abstract final public protected private static deprecated '
        + 'throw try catch Exception '
        + 'echo empty isset instanceof unset '
        + 'let var new const self '
        + 'require '
        + 'if else elseif switch case default '
        + 'do while loop for continue break '
        + 'likely unlikely '
        + '__LINE__ __FILE__ __DIR__ __FUNCTION__ __CLASS__ __TRAIT__ __METHOD__ __NAMESPACE__ '
        + 'array boolean float double integer object resource string '
        + 'char long unsigned bool int uint ulong uchar '
        + 'true false null undefined';
    return {
        name: 'Zephir',
        aliases: ['zep'],
        keywords: KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.COMMENT(/\/\*/, /\*\//, { contains: [
                    {
                        className: 'doctag',
                        begin: /@[A-Za-z]+/
                    }
                ] }),
            {
                className: 'string',
                begin: /<<<['"]?\w+['"]?$/,
                end: /^\w+;/,
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            },
            {
                className: 'function',
                beginKeywords: 'function fn',
                end: /[;{]/,
                excludeEnd: true,
                illegal: /\$|\[|%/,
                contains: [
                    TITLE_MODE,
                    {
                        className: 'params',
                        begin: /\(/,
                        end: /\)/,
                        keywords: KEYWORDS,
                        contains: [
                            'self',
                            hljs.C_BLOCK_COMMENT_MODE,
                            STRING,
                            NUMBER
                        ]
                    }
                ]
            },
            {
                className: 'class',
                beginKeywords: 'class interface',
                end: /\{/,
                excludeEnd: true,
                illegal: /[:($"]/,
                contains: [
                    { beginKeywords: 'extends implements' },
                    TITLE_MODE
                ]
            },
            {
                beginKeywords: 'namespace',
                end: /;/,
                illegal: /[.']/,
                contains: [TITLE_MODE]
            },
            {
                beginKeywords: 'use',
                end: /;/,
                contains: [TITLE_MODE]
            },
            { begin: /=>/
            },
            STRING,
            NUMBER
        ]
    };
}
export { zephir as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemVwaGlyLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvemVwaGlyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUU7UUFDbkMsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDeEQ7S0FDRixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQzlDLE1BQU0sTUFBTSxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxrQkFBa0I7WUFDdkIsSUFBSSxDQUFDLGFBQWE7U0FDbkIsRUFBRSxDQUFDO0lBQ0osTUFBTSxRQUFRLEdBRVosd0NBQXdDO1VBQ3RDLGtCQUFrQjtVQUNsQiw0REFBNEQ7VUFFNUQsNEJBQTRCO1VBSTVCLG9DQUFvQztVQUVwQyx5QkFBeUI7VUFFekIsVUFBVTtVQUNWLHFDQUFxQztVQUNyQyxtQ0FBbUM7VUFDbkMsa0JBQWtCO1VBR2xCLHNGQUFzRjtVQUV0Riw0REFBNEQ7VUFDNUQsK0NBQStDO1VBRS9DLDJCQUEyQixDQUFDO0lBRWhDLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUTtRQUNkLE9BQU8sRUFBRSxDQUFFLEtBQUssQ0FBRTtRQUNsQixRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixFQUFFLFFBQVEsRUFBRTtvQkFDVjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLFlBQVk7cUJBQ3BCO2lCQUNGLEVBQUUsQ0FDSjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixHQUFHLEVBQUUsT0FBTztnQkFDWixRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUU7YUFDcEM7WUFDRDtnQkFFRSxLQUFLLEVBQUUsa0RBQWtEO2FBQUU7WUFDN0Q7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLGFBQWEsRUFBRSxhQUFhO2dCQUM1QixHQUFHLEVBQUUsTUFBTTtnQkFDWCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLFFBQVEsRUFBRTtvQkFDUixVQUFVO29CQUNWO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsSUFBSTt3QkFDWCxHQUFHLEVBQUUsSUFBSTt3QkFDVCxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsUUFBUSxFQUFFOzRCQUNSLE1BQU07NEJBQ04sSUFBSSxDQUFDLG9CQUFvQjs0QkFDekIsTUFBTTs0QkFDTixNQUFNO3lCQUNQO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsT0FBTztnQkFDbEIsYUFBYSxFQUFFLGlCQUFpQjtnQkFDaEMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1IsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUU7b0JBQ3ZDLFVBQVU7aUJBQ1g7YUFDRjtZQUNEO2dCQUNFLGFBQWEsRUFBRSxXQUFXO2dCQUMxQixHQUFHLEVBQUUsR0FBRztnQkFDUixPQUFPLEVBQUUsTUFBTTtnQkFDZixRQUFRLEVBQUUsQ0FBRSxVQUFVLENBQUU7YUFDekI7WUFDRDtnQkFDRSxhQUFhLEVBQUUsS0FBSztnQkFDcEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFLENBQUUsVUFBVSxDQUFFO2FBQ3pCO1lBQ0QsRUFBRSxLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0QsTUFBTTtZQUNOLE1BQU07U0FDUDtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gTGFuZ3VhZ2U6IFplcGhpclxuIERlc2NyaXB0aW9uOiBaZXBoaXIsIGFuIG9wZW4gc291cmNlLCBoaWdoLWxldmVsIGxhbmd1YWdlIGRlc2lnbmVkIHRvIGVhc2UgdGhlIGNyZWF0aW9uIGFuZCBtYWludGFpbmFiaWxpdHkgb2YgZXh0ZW5zaW9ucyBmb3IgUEhQIHdpdGggYSBmb2N1cyBvbiB0eXBlIGFuZCBtZW1vcnkgc2FmZXR5LlxuIEF1dGhvcjogT2xlZyBFZmltb3YgPGVmaW1vdm92QGdtYWlsLmNvbT5cbiBXZWJzaXRlOiBodHRwczovL3plcGhpci1sYW5nLmNvbS9lblxuIEF1ZGl0OiAyMDIwXG4gKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIHplcGhpcihobGpzKSB7XG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7IGlsbGVnYWw6IG51bGwgfSksXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgeyBpbGxlZ2FsOiBudWxsIH0pXG4gICAgXVxuICB9O1xuICBjb25zdCBUSVRMRV9NT0RFID0gaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREU7XG4gIGNvbnN0IE5VTUJFUiA9IHsgdmFyaWFudHM6IFtcbiAgICBobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSxcbiAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgXSB9O1xuICBjb25zdCBLRVlXT1JEUyA9XG4gICAgLy8gY2xhc3NlcyBhbmQgb2JqZWN0c1xuICAgICduYW1lc3BhY2UgY2xhc3MgaW50ZXJmYWNlIHVzZSBleHRlbmRzICdcbiAgICArICdmdW5jdGlvbiByZXR1cm4gJ1xuICAgICsgJ2Fic3RyYWN0IGZpbmFsIHB1YmxpYyBwcm90ZWN0ZWQgcHJpdmF0ZSBzdGF0aWMgZGVwcmVjYXRlZCAnXG4gICAgLy8gZXJyb3IgaGFuZGxpbmdcbiAgICArICd0aHJvdyB0cnkgY2F0Y2ggRXhjZXB0aW9uICdcbiAgICAvLyBrZXl3b3JkLWlzaCB0aGluZ3MgdGhlaXIgd2Vic2l0ZSBkb2VzIE5PVCBzZWVtIHRvIGhpZ2hsaWdodCAoaW4gdGhlaXIgb3duIHNuaXBwZXRzKVxuICAgIC8vICd0eXBlb2YgZmV0Y2ggaW4gJyArXG4gICAgLy8gb3BlcmF0b3JzL2hlbHBlcnNcbiAgICArICdlY2hvIGVtcHR5IGlzc2V0IGluc3RhbmNlb2YgdW5zZXQgJ1xuICAgIC8vIGFzc2lnbm1lbnQvdmFyaWFibGVzXG4gICAgKyAnbGV0IHZhciBuZXcgY29uc3Qgc2VsZiAnXG4gICAgLy8gY29udHJvbFxuICAgICsgJ3JlcXVpcmUgJ1xuICAgICsgJ2lmIGVsc2UgZWxzZWlmIHN3aXRjaCBjYXNlIGRlZmF1bHQgJ1xuICAgICsgJ2RvIHdoaWxlIGxvb3AgZm9yIGNvbnRpbnVlIGJyZWFrICdcbiAgICArICdsaWtlbHkgdW5saWtlbHkgJ1xuICAgIC8vIG1hZ2ljIGNvbnN0YW50c1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waGFsY29uL3plcGhpci9ibG9iL21hc3Rlci9MaWJyYXJ5L0V4cHJlc3Npb24vQ29uc3RhbnRzLnBocFxuICAgICsgJ19fTElORV9fIF9fRklMRV9fIF9fRElSX18gX19GVU5DVElPTl9fIF9fQ0xBU1NfXyBfX1RSQUlUX18gX19NRVRIT0RfXyBfX05BTUVTUEFDRV9fICdcbiAgICAvLyB0eXBlcyAtIGh0dHBzOi8vZG9jcy56ZXBoaXItbGFuZy5jb20vMC4xMi9lbi90eXBlc1xuICAgICsgJ2FycmF5IGJvb2xlYW4gZmxvYXQgZG91YmxlIGludGVnZXIgb2JqZWN0IHJlc291cmNlIHN0cmluZyAnXG4gICAgKyAnY2hhciBsb25nIHVuc2lnbmVkIGJvb2wgaW50IHVpbnQgdWxvbmcgdWNoYXIgJ1xuICAgIC8vIGJ1aWx0LWluc1xuICAgICsgJ3RydWUgZmFsc2UgbnVsbCB1bmRlZmluZWQnO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1plcGhpcicsXG4gICAgYWxpYXNlczogWyAnemVwJyBdLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAvXFwvXFwqLyxcbiAgICAgICAgL1xcKlxcLy8sXG4gICAgICAgIHsgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdkb2N0YWcnLFxuICAgICAgICAgICAgYmVnaW46IC9AW0EtWmEtel0rL1xuICAgICAgICAgIH1cbiAgICAgICAgXSB9XG4gICAgICApLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogLzw8PFsnXCJdP1xcdytbJ1wiXT8kLyxcbiAgICAgICAgZW5kOiAvXlxcdys7LyxcbiAgICAgICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIHN3YWxsb3cgY29tcG9zZWQgaWRlbnRpZmllcnMgdG8gYXZvaWQgcGFyc2luZyB0aGVtIGFzIGtleXdvcmRzXG4gICAgICAgIGJlZ2luOiAvKDo6fC0+KStbYS16QS1aX1xceDdmLVxceGZmXVthLXpBLVowLTlfXFx4N2YtXFx4ZmZdKi8gfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24gZm4nLFxuICAgICAgICBlbmQ6IC9bO3tdLyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgaWxsZWdhbDogL1xcJHxcXFt8JS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEVfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICAgICAgZW5kOiAvXFwpLyxcbiAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgU1RSSU5HLFxuICAgICAgICAgICAgICBOVU1CRVJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGVuZDogL1xcey8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6IC9bOigkXCJdLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7IGJlZ2luS2V5d29yZHM6ICdleHRlbmRzIGltcGxlbWVudHMnIH0sXG4gICAgICAgICAgVElUTEVfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnbmFtZXNwYWNlJyxcbiAgICAgICAgZW5kOiAvOy8sXG4gICAgICAgIGlsbGVnYWw6IC9bLiddLyxcbiAgICAgICAgY29udGFpbnM6IFsgVElUTEVfTU9ERSBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAndXNlJyxcbiAgICAgICAgZW5kOiAvOy8sXG4gICAgICAgIGNvbnRhaW5zOiBbIFRJVExFX01PREUgXVxuICAgICAgfSxcbiAgICAgIHsgYmVnaW46IC89Pi8gLy8gTm8gbWFya3VwLCBqdXN0IGEgcmVsZXZhbmNlIGJvb3N0ZXJcbiAgICAgIH0sXG4gICAgICBTVFJJTkcsXG4gICAgICBOVU1CRVJcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHplcGhpciBhcyBkZWZhdWx0IH07XG4iXX0=