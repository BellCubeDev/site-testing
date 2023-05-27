function scilab(hljs) {
    const COMMON_CONTAINS = [
        hljs.C_NUMBER_MODE,
        {
            className: 'string',
            begin: '\'|\"',
            end: '\'|\"',
            contains: [
                hljs.BACKSLASH_ESCAPE,
                { begin: '\'\'' }
            ]
        }
    ];
    return {
        name: 'Scilab',
        aliases: ['sci'],
        keywords: {
            $pattern: /%?\w+/,
            keyword: 'abort break case clear catch continue do elseif else endfunction end for function '
                + 'global if pause return resume select try then while',
            literal: '%f %F %t %T %pi %eps %inf %nan %e %i %z %s',
            built_in: 'abs and acos asin atan ceil cd chdir clearglobal cosh cos cumprod deff disp error '
                + 'exec execstr exists exp eye gettext floor fprintf fread fsolve imag isdef isempty '
                + 'isinfisnan isvector lasterror length load linspace list listfiles log10 log2 log '
                + 'max min msprintf mclose mopen ones or pathconvert poly printf prod pwd rand real '
                + 'round sinh sin size gsort sprintf sqrt strcat strcmps tring sum system tanh tan '
                + 'type typename warning zeros matrix'
        },
        illegal: '("|#|/\\*|\\s+/\\w+)',
        contains: [
            {
                className: 'function',
                beginKeywords: 'function',
                end: '$',
                contains: [
                    hljs.UNDERSCORE_TITLE_MODE,
                    {
                        className: 'params',
                        begin: '\\(',
                        end: '\\)'
                    }
                ]
            },
            {
                begin: '[a-zA-Z_][a-zA-Z_0-9]*[\\.\']+',
                relevance: 0
            },
            {
                begin: '\\[',
                end: '\\][\\.\']*',
                relevance: 0,
                contains: COMMON_CONTAINS
            },
            hljs.COMMENT('//', '$')
        ].concat(COMMON_CONTAINS)
    };
}
export { scilab as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NpbGFiLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvc2NpbGFiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxlQUFlLEdBQUc7UUFDdEIsSUFBSSxDQUFDLGFBQWE7UUFDbEI7WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixLQUFLLEVBQUUsT0FBTztZQUNkLEdBQUcsRUFBRSxPQUFPO1lBQ1osUUFBUSxFQUFFO2dCQUNSLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3JCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTthQUNsQjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUTtRQUNkLE9BQU8sRUFBRSxDQUFFLEtBQUssQ0FBRTtRQUNsQixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsT0FBTztZQUNqQixPQUFPLEVBQUUsb0ZBQW9GO2tCQUN6RixxREFBcUQ7WUFDekQsT0FBTyxFQUNMLDRDQUE0QztZQUM5QyxRQUFRLEVBQ1Asb0ZBQW9GO2tCQUNsRixvRkFBb0Y7a0JBQ3BGLG1GQUFtRjtrQkFDbkYsbUZBQW1GO2tCQUNuRixrRkFBa0Y7a0JBQ2xGLG9DQUFvQztTQUN4QztRQUNELE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLGFBQWEsRUFBRSxVQUFVO2dCQUN6QixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLHFCQUFxQjtvQkFDMUI7d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLEtBQUssRUFBRSxLQUFLO3dCQUNaLEdBQUcsRUFBRSxLQUFLO3FCQUNYO2lCQUNGO2FBQ0Y7WUFHRDtnQkFDRSxLQUFLLEVBQUUsZ0NBQWdDO2dCQUN2QyxTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLGFBQWE7Z0JBQ2xCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFFBQVEsRUFBRSxlQUFlO2FBQzFCO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1NBQ3hCLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztLQUMxQixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFNjaWxhYlxuQXV0aG9yOiBTeWx2ZXN0cmUgTGVkcnUgPHN5bHZlc3RyZS5sZWRydUBzY2lsYWItZW50ZXJwcmlzZXMuY29tPlxuT3JpZ2luOiBtYXRsYWIuanNcbkRlc2NyaXB0aW9uOiBTY2lsYWIgaXMgYSBwb3J0IGZyb20gTWF0bGFiXG5XZWJzaXRlOiBodHRwczovL3d3dy5zY2lsYWIub3JnXG5DYXRlZ29yeTogc2NpZW50aWZpY1xuKi9cblxuZnVuY3Rpb24gc2NpbGFiKGhsanMpIHtcbiAgY29uc3QgQ09NTU9OX0NPTlRBSU5TID0gW1xuICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcXCd8XFxcIicsXG4gICAgICBlbmQ6ICdcXCd8XFxcIicsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgIHsgYmVnaW46ICdcXCdcXCcnIH1cbiAgICAgIF1cbiAgICB9XG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnU2NpbGFiJyxcbiAgICBhbGlhc2VzOiBbICdzY2knIF0sXG4gICAga2V5d29yZHM6IHtcbiAgICAgICRwYXR0ZXJuOiAvJT9cXHcrLyxcbiAgICAgIGtleXdvcmQ6ICdhYm9ydCBicmVhayBjYXNlIGNsZWFyIGNhdGNoIGNvbnRpbnVlIGRvIGVsc2VpZiBlbHNlIGVuZGZ1bmN0aW9uIGVuZCBmb3IgZnVuY3Rpb24gJ1xuICAgICAgICArICdnbG9iYWwgaWYgcGF1c2UgcmV0dXJuIHJlc3VtZSBzZWxlY3QgdHJ5IHRoZW4gd2hpbGUnLFxuICAgICAgbGl0ZXJhbDpcbiAgICAgICAgJyVmICVGICV0ICVUICVwaSAlZXBzICVpbmYgJW5hbiAlZSAlaSAleiAlcycsXG4gICAgICBidWlsdF9pbjogLy8gU2NpbGFiIGhhcyBtb3JlIHRoYW4gMjAwMCBmdW5jdGlvbnMuIEp1c3QgbGlzdCB0aGUgbW9zdCBjb21tb25zXG4gICAgICAgJ2FicyBhbmQgYWNvcyBhc2luIGF0YW4gY2VpbCBjZCBjaGRpciBjbGVhcmdsb2JhbCBjb3NoIGNvcyBjdW1wcm9kIGRlZmYgZGlzcCBlcnJvciAnXG4gICAgICAgKyAnZXhlYyBleGVjc3RyIGV4aXN0cyBleHAgZXllIGdldHRleHQgZmxvb3IgZnByaW50ZiBmcmVhZCBmc29sdmUgaW1hZyBpc2RlZiBpc2VtcHR5ICdcbiAgICAgICArICdpc2luZmlzbmFuIGlzdmVjdG9yIGxhc3RlcnJvciBsZW5ndGggbG9hZCBsaW5zcGFjZSBsaXN0IGxpc3RmaWxlcyBsb2cxMCBsb2cyIGxvZyAnXG4gICAgICAgKyAnbWF4IG1pbiBtc3ByaW50ZiBtY2xvc2UgbW9wZW4gb25lcyBvciBwYXRoY29udmVydCBwb2x5IHByaW50ZiBwcm9kIHB3ZCByYW5kIHJlYWwgJ1xuICAgICAgICsgJ3JvdW5kIHNpbmggc2luIHNpemUgZ3NvcnQgc3ByaW50ZiBzcXJ0IHN0cmNhdCBzdHJjbXBzIHRyaW5nIHN1bSBzeXN0ZW0gdGFuaCB0YW4gJ1xuICAgICAgICsgJ3R5cGUgdHlwZW5hbWUgd2FybmluZyB6ZXJvcyBtYXRyaXgnXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnKFwifCN8L1xcXFwqfFxcXFxzKy9cXFxcdyspJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJyxcbiAgICAgICAgICAgIGVuZDogJ1xcXFwpJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIHNlZW1zIHRvIGJlIGEgZ3VhcmQgYWdhaW5zdCBbaWRlbnRdJyBvciBbaWRlbnRdLlxuICAgICAgLy8gcGVyaGFwcyB0byBwcmV2ZW50IGF0dHJpYnV0ZXMgZnJvbSBmbGFnZ2luZyBhcyBrZXl3b3Jkcz9cbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdbYS16QS1aX11bYS16QS1aXzAtOV0qW1xcXFwuXFwnXSsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXFsnLFxuICAgICAgICBlbmQ6ICdcXFxcXVtcXFxcLlxcJ10qJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogQ09NTU9OX0NPTlRBSU5TXG4gICAgICB9LFxuICAgICAgaGxqcy5DT01NRU5UKCcvLycsICckJylcbiAgICBdLmNvbmNhdChDT01NT05fQ09OVEFJTlMpXG4gIH07XG59XG5cbmV4cG9ydCB7IHNjaWxhYiBhcyBkZWZhdWx0IH07XG4iXX0=