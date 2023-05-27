function ocaml(hljs) {
    return {
        name: 'OCaml',
        aliases: ['ml'],
        keywords: {
            $pattern: '[a-z_]\\w*!?',
            keyword: 'and as assert asr begin class constraint do done downto else end '
                + 'exception external for fun function functor if in include '
                + 'inherit! inherit initializer land lazy let lor lsl lsr lxor match method!|10 method '
                + 'mod module mutable new object of open! open or private rec sig struct '
                + 'then to try type val! val virtual when while with '
                + 'parser value',
            built_in: 'array bool bytes char exn|5 float int int32 int64 list lazy_t|5 nativeint|5 string unit '
                + 'in_channel out_channel ref',
            literal: 'true false'
        },
        illegal: /\/\/|>>/,
        contains: [
            {
                className: 'literal',
                begin: '\\[(\\|\\|)?\\]|\\(\\)',
                relevance: 0
            },
            hljs.COMMENT('\\(\\*', '\\*\\)', { contains: ['self'] }),
            {
                className: 'symbol',
                begin: '\'[A-Za-z_](?!\')[\\w\']*'
            },
            {
                className: 'type',
                begin: '`[A-Z][\\w\']*'
            },
            {
                className: 'type',
                begin: '\\b[A-Z][\\w\']*',
                relevance: 0
            },
            {
                begin: '[a-z_]\\w*\'[\\w\']*',
                relevance: 0
            },
            hljs.inherit(hljs.APOS_STRING_MODE, {
                className: 'string',
                relevance: 0
            }),
            hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null }),
            {
                className: 'number',
                begin: '\\b(0[xX][a-fA-F0-9_]+[Lln]?|'
                    + '0[oO][0-7_]+[Lln]?|'
                    + '0[bB][01_]+[Lln]?|'
                    + '[0-9][0-9_]*([Lln]|(\\.[0-9_]*)?([eE][-+]?[0-9_]+)?)?)',
                relevance: 0
            },
            { begin: /->/
            }
        ]
    };
}
export { ocaml as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2NhbWwuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9vY2FtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBRWpCLE9BQU87UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxDQUFFLElBQUksQ0FBRTtRQUNqQixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsY0FBYztZQUN4QixPQUFPLEVBQ0wsbUVBQW1FO2tCQUNqRSw0REFBNEQ7a0JBQzVELHNGQUFzRjtrQkFDdEYsd0VBQXdFO2tCQUN4RSxvREFBb0Q7a0JBRXBELGNBQWM7WUFDbEIsUUFBUSxFQUVOLDBGQUEwRjtrQkFFeEYsNEJBQTRCO1lBQ2hDLE9BQU8sRUFDTCxZQUFZO1NBQ2Y7UUFDRCxPQUFPLEVBQUUsU0FBUztRQUNsQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsS0FBSyxFQUFFLHdCQUF3QjtnQkFDL0IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxPQUFPLENBQ1YsUUFBUSxFQUNSLFFBQVEsRUFDUixFQUFFLFFBQVEsRUFBRSxDQUFFLE1BQU0sQ0FBRSxFQUFFLENBQ3pCO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSwyQkFBMkI7YUFFbkM7WUFDRDtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLGdCQUFnQjthQUN4QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHNCQUFzQjtnQkFDN0IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUNsQyxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLENBQUM7YUFDYixDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDdkQ7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFDSCwrQkFBK0I7c0JBQzdCLHFCQUFxQjtzQkFDckIsb0JBQW9CO3NCQUNwQix3REFBd0Q7Z0JBQzVELFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRCxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogT0NhbWxcbkF1dGhvcjogTWVoZGkgRG9nZ3V5IDxtZWhkaUBkb2dndXkub3JnPlxuQ29udHJpYnV0b3JzOiBOaWNvbGFzIEJyYXVkLVNhbnRvbmkgPG5pY29sYXMuYnJhdWQtc2FudG9uaUBlbnMtY2FjaGFuLmZyPiwgTWlja2FlbCBEZWxhaGF5ZSA8bWlja2FlbC5kZWxhaGF5ZUBnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogT0NhbWwgbGFuZ3VhZ2UgZGVmaW5pdGlvbi5cbldlYnNpdGU6IGh0dHBzOi8vb2NhbWwub3JnXG5DYXRlZ29yeTogZnVuY3Rpb25hbFxuKi9cblxuZnVuY3Rpb24gb2NhbWwoaGxqcykge1xuICAvKiBtaXNzaW5nIHN1cHBvcnQgZm9yIGhlcmVkb2MtbGlrZSBzdHJpbmcgKE9DYW1sIDQuMC4yKykgKi9cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnT0NhbWwnLFxuICAgIGFsaWFzZXM6IFsgJ21sJyBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogJ1thLXpfXVxcXFx3KiE/JyxcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhbmQgYXMgYXNzZXJ0IGFzciBiZWdpbiBjbGFzcyBjb25zdHJhaW50IGRvIGRvbmUgZG93bnRvIGVsc2UgZW5kICdcbiAgICAgICAgKyAnZXhjZXB0aW9uIGV4dGVybmFsIGZvciBmdW4gZnVuY3Rpb24gZnVuY3RvciBpZiBpbiBpbmNsdWRlICdcbiAgICAgICAgKyAnaW5oZXJpdCEgaW5oZXJpdCBpbml0aWFsaXplciBsYW5kIGxhenkgbGV0IGxvciBsc2wgbHNyIGx4b3IgbWF0Y2ggbWV0aG9kIXwxMCBtZXRob2QgJ1xuICAgICAgICArICdtb2QgbW9kdWxlIG11dGFibGUgbmV3IG9iamVjdCBvZiBvcGVuISBvcGVuIG9yIHByaXZhdGUgcmVjIHNpZyBzdHJ1Y3QgJ1xuICAgICAgICArICd0aGVuIHRvIHRyeSB0eXBlIHZhbCEgdmFsIHZpcnR1YWwgd2hlbiB3aGlsZSB3aXRoICdcbiAgICAgICAgLyogY2FtbHA0ICovXG4gICAgICAgICsgJ3BhcnNlciB2YWx1ZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgLyogYnVpbHQtaW4gdHlwZXMgKi9cbiAgICAgICAgJ2FycmF5IGJvb2wgYnl0ZXMgY2hhciBleG58NSBmbG9hdCBpbnQgaW50MzIgaW50NjQgbGlzdCBsYXp5X3R8NSBuYXRpdmVpbnR8NSBzdHJpbmcgdW5pdCAnXG4gICAgICAgIC8qIChzb21lKSB0eXBlcyBpbiBQZXJ2YXNpdmVzICovXG4gICAgICAgICsgJ2luX2NoYW5uZWwgb3V0X2NoYW5uZWwgcmVmJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICd0cnVlIGZhbHNlJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogL1xcL1xcL3w+Pi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXFsoXFxcXHxcXFxcfCk/XFxcXF18XFxcXChcXFxcKScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgJ1xcXFwoXFxcXConLFxuICAgICAgICAnXFxcXCpcXFxcKScsXG4gICAgICAgIHsgY29udGFpbnM6IFsgJ3NlbGYnIF0gfVxuICAgICAgKSxcbiAgICAgIHsgLyogdHlwZSB2YXJpYWJsZSAqL1xuICAgICAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgICAgICBiZWdpbjogJ1xcJ1tBLVphLXpfXSg/IVxcJylbXFxcXHdcXCddKidcbiAgICAgICAgLyogdGhlIGdyYW1tYXIgaXMgYW1iaWd1b3VzIG9uIGhvdyAnYSdiIHNob3VsZCBiZSBpbnRlcnByZXRlZCBidXQgbm90IHRoZSBjb21waWxlciAqL1xuICAgICAgfSxcbiAgICAgIHsgLyogcG9seW1vcnBoaWMgdmFyaWFudCAqL1xuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgYmVnaW46ICdgW0EtWl1bXFxcXHdcXCddKidcbiAgICAgIH0sXG4gICAgICB7IC8qIG1vZHVsZSBvciBjb25zdHJ1Y3RvciAqL1xuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYltBLVpdW1xcXFx3XFwnXSonLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IC8qIGRvbid0IGNvbG9yIGlkZW50aWZpZXJzLCBidXQgc2FmZWx5IGNhdGNoIGFsbCBpZGVudGlmaWVycyB3aXRoICcgKi9cbiAgICAgICAgYmVnaW46ICdbYS16X11cXFxcdypcXCdbXFxcXHdcXCddKicsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLkFQT1NfU1RSSU5HX01PREUsIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9KSxcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7IGlsbGVnYWw6IG51bGwgfSksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYigwW3hYXVthLWZBLUYwLTlfXStbTGxuXT98J1xuICAgICAgICAgICsgJzBbb09dWzAtN19dK1tMbG5dP3wnXG4gICAgICAgICAgKyAnMFtiQl1bMDFfXStbTGxuXT98J1xuICAgICAgICAgICsgJ1swLTldWzAtOV9dKihbTGxuXXwoXFxcXC5bMC05X10qKT8oW2VFXVstK10/WzAtOV9dKyk/KT8pJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgeyBiZWdpbjogLy0+LyAvLyByZWxldmFuY2UgYm9vc3RlclxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgb2NhbWwgYXMgZGVmYXVsdCB9O1xuIl19