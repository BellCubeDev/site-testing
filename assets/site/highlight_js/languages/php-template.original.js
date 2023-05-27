function phpTemplate(hljs) {
    return {
        name: "PHP template",
        subLanguage: 'xml',
        contains: [
            {
                begin: /<\?(php|=)?/,
                end: /\?>/,
                subLanguage: 'php',
                contains: [
                    {
                        begin: '/\\*',
                        end: '\\*/',
                        skip: true
                    },
                    {
                        begin: 'b"',
                        end: '"',
                        skip: true
                    },
                    {
                        begin: 'b\'',
                        end: '\'',
                        skip: true
                    },
                    hljs.inherit(hljs.APOS_STRING_MODE, {
                        illegal: null,
                        className: null,
                        contains: null,
                        skip: true
                    }),
                    hljs.inherit(hljs.QUOTE_STRING_MODE, {
                        illegal: null,
                        className: null,
                        contains: null,
                        skip: true
                    })
                ]
            }
        ]
    };
}
export { phpTemplate as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhwLXRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvcGhwLXRlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsV0FBVyxDQUFDLElBQUk7SUFDdkIsT0FBTztRQUNMLElBQUksRUFBRSxjQUFjO1FBQ3BCLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLEtBQUssRUFBRSxhQUFhO2dCQUNwQixHQUFHLEVBQUUsS0FBSztnQkFDVixXQUFXLEVBQUUsS0FBSztnQkFDbEIsUUFBUSxFQUFFO29CQUdSO3dCQUNFLEtBQUssRUFBRSxNQUFNO3dCQUNiLEdBQUcsRUFBRSxNQUFNO3dCQUNYLElBQUksRUFBRSxJQUFJO3FCQUNYO29CQUNEO3dCQUNFLEtBQUssRUFBRSxJQUFJO3dCQUNYLEdBQUcsRUFBRSxHQUFHO3dCQUNSLElBQUksRUFBRSxJQUFJO3FCQUNYO29CQUNEO3dCQUNFLEtBQUssRUFBRSxLQUFLO3dCQUNaLEdBQUcsRUFBRSxJQUFJO3dCQUNULElBQUksRUFBRSxJQUFJO3FCQUNYO29CQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO3dCQUNsQyxPQUFPLEVBQUUsSUFBSTt3QkFDYixTQUFTLEVBQUUsSUFBSTt3QkFDZixRQUFRLEVBQUUsSUFBSTt3QkFDZCxJQUFJLEVBQUUsSUFBSTtxQkFDWCxDQUFDO29CQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO3dCQUNuQyxPQUFPLEVBQUUsSUFBSTt3QkFDYixTQUFTLEVBQUUsSUFBSTt3QkFDZixRQUFRLEVBQUUsSUFBSTt3QkFDZCxJQUFJLEVBQUUsSUFBSTtxQkFDWCxDQUFDO2lCQUNIO2FBQ0Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUEhQIFRlbXBsYXRlXG5SZXF1aXJlczogeG1sLmpzLCBwaHAuanNcbkF1dGhvcjogSm9zaCBHb2ViZWwgPGhlbGxvQGpvc2hnb2ViZWwuY29tPlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cucGhwLm5ldFxuQ2F0ZWdvcnk6IGNvbW1vblxuKi9cblxuZnVuY3Rpb24gcGhwVGVtcGxhdGUoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiUEhQIHRlbXBsYXRlXCIsXG4gICAgc3ViTGFuZ3VhZ2U6ICd4bWwnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvPFxcPyhwaHB8PSk/LyxcbiAgICAgICAgZW5kOiAvXFw/Pi8sXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAncGhwJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRoZSBwaHAgY2xvc2luZyB0YWcgPz4gdG8gY2xvc2UgdGhlIFBIUCBibG9jayB3aGVuXG4gICAgICAgICAgLy8gaW5zaWRlIGFueSBvZiB0aGUgZm9sbG93aW5nIGJsb2NrczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogJy9cXFxcKicsXG4gICAgICAgICAgICBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICAgICAgc2tpcDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdiXCInLFxuICAgICAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICAgICAgc2tpcDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdiXFwnJyxcbiAgICAgICAgICAgIGVuZDogJ1xcJycsXG4gICAgICAgICAgICBza2lwOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7XG4gICAgICAgICAgICBpbGxlZ2FsOiBudWxsLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgICAgICAgY29udGFpbnM6IG51bGwsXG4gICAgICAgICAgICBza2lwOiB0cnVlXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtcbiAgICAgICAgICAgIGlsbGVnYWw6IG51bGwsXG4gICAgICAgICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICAgICAgICBjb250YWluczogbnVsbCxcbiAgICAgICAgICAgIHNraXA6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBwaHBUZW1wbGF0ZSBhcyBkZWZhdWx0IH07XG4iXX0=