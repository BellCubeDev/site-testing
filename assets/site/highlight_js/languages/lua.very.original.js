function lua(hljs) {
    const OPENING_LONG_BRACKET = '\\[=*\\[';
    const CLOSING_LONG_BRACKET = '\\]=*\\]';
    const LONG_BRACKETS = {
        begin: OPENING_LONG_BRACKET,
        end: CLOSING_LONG_BRACKET,
        contains: ['self']
    };
    const COMMENTS = [
        hljs.COMMENT('--(?!' + OPENING_LONG_BRACKET + ')', '$'),
        hljs.COMMENT('--' + OPENING_LONG_BRACKET, CLOSING_LONG_BRACKET, {
            contains: [LONG_BRACKETS],
            relevance: 10
        })
    ];
    return {
        name: 'Lua',
        keywords: {
            $pattern: hljs.UNDERSCORE_IDENT_RE,
            literal: "true false nil",
            keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
            built_in: '_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len '
                + '__gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert '
                + 'collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring '
                + 'module next pairs pcall print rawequal rawget rawset require select setfenv '
                + 'setmetatable tonumber tostring type unpack xpcall arg self '
                + 'coroutine resume yield status wrap create running debug getupvalue '
                + 'debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv '
                + 'io lines write close flush open output type read stderr stdin input stdout popen tmpfile '
                + 'math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan '
                + 'os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall '
                + 'string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower '
                + 'table setn insert getn foreachi maxn foreach concat sort remove'
        },
        contains: COMMENTS.concat([
            {
                className: 'function',
                beginKeywords: 'function',
                end: '\\)',
                contains: [
                    hljs.inherit(hljs.TITLE_MODE, { begin: '([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*' }),
                    {
                        className: 'params',
                        begin: '\\(',
                        endsWithParent: true,
                        contains: COMMENTS
                    }
                ].concat(COMMENTS)
            },
            hljs.C_NUMBER_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            {
                className: 'string',
                begin: OPENING_LONG_BRACKET,
                end: CLOSING_LONG_BRACKET,
                contains: [LONG_BRACKETS],
                relevance: 5
            }
        ])
    };
}
export { lua as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHVhLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvbHVhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztJQUN4QyxNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztJQUN4QyxNQUFNLGFBQWEsR0FBRztRQUNwQixLQUFLLEVBQUUsb0JBQW9CO1FBQzNCLEdBQUcsRUFBRSxvQkFBb0I7UUFDekIsUUFBUSxFQUFFLENBQUUsTUFBTSxDQUFFO0tBQ3JCLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLG9CQUFvQixHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FDVixJQUFJLEdBQUcsb0JBQW9CLEVBQzNCLG9CQUFvQixFQUNwQjtZQUNFLFFBQVEsRUFBRSxDQUFFLGFBQWEsQ0FBRTtZQUMzQixTQUFTLEVBQUUsRUFBRTtTQUNkLENBQ0Y7S0FDRixDQUFDO0lBQ0YsT0FBTztRQUNMLElBQUksRUFBRSxLQUFLO1FBQ1gsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUI7WUFDbEMsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixPQUFPLEVBQUUseUZBQXlGO1lBQ2xHLFFBQVEsRUFFTixpRkFBaUY7a0JBQy9FLGdGQUFnRjtrQkFFaEYsbUZBQW1GO2tCQUNuRiw4RUFBOEU7a0JBQzlFLDZEQUE2RDtrQkFFN0QscUVBQXFFO2tCQUNyRSw2SEFBNkg7a0JBQzdILDJGQUEyRjtrQkFDM0YsaUtBQWlLO2tCQUNqSyxrSkFBa0o7a0JBQ2xKLDRGQUE0RjtrQkFDNUYsaUVBQWlFO1NBQ3RFO1FBQ0QsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDeEI7Z0JBQ0UsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLGFBQWEsRUFBRSxVQUFVO2dCQUN6QixHQUFHLEVBQUUsS0FBSztnQkFDVixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLG1EQUFtRCxFQUFFLENBQUM7b0JBQzdGO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsS0FBSzt3QkFDWixjQUFjLEVBQUUsSUFBSTt3QkFDcEIsUUFBUSxFQUFFLFFBQVE7cUJBQ25CO2lCQUNGLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUNuQjtZQUNELElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsR0FBRyxFQUFFLG9CQUFvQjtnQkFDekIsUUFBUSxFQUFFLENBQUUsYUFBYSxDQUFFO2dCQUMzQixTQUFTLEVBQUUsQ0FBQzthQUNiO1NBQ0YsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogTHVhXG5EZXNjcmlwdGlvbjogTHVhIGlzIGEgcG93ZXJmdWwsIGVmZmljaWVudCwgbGlnaHR3ZWlnaHQsIGVtYmVkZGFibGUgc2NyaXB0aW5nIGxhbmd1YWdlLlxuQXV0aG9yOiBBbmRyZXcgRmVkb3JvdiA8ZG1tZHJzQG1haWwucnU+XG5DYXRlZ29yeTogY29tbW9uLCBzY3JpcHRpbmdcbldlYnNpdGU6IGh0dHBzOi8vd3d3Lmx1YS5vcmdcbiovXG5cbmZ1bmN0aW9uIGx1YShobGpzKSB7XG4gIGNvbnN0IE9QRU5JTkdfTE9OR19CUkFDS0VUID0gJ1xcXFxbPSpcXFxcWyc7XG4gIGNvbnN0IENMT1NJTkdfTE9OR19CUkFDS0VUID0gJ1xcXFxdPSpcXFxcXSc7XG4gIGNvbnN0IExPTkdfQlJBQ0tFVFMgPSB7XG4gICAgYmVnaW46IE9QRU5JTkdfTE9OR19CUkFDS0VULFxuICAgIGVuZDogQ0xPU0lOR19MT05HX0JSQUNLRVQsXG4gICAgY29udGFpbnM6IFsgJ3NlbGYnIF1cbiAgfTtcbiAgY29uc3QgQ09NTUVOVFMgPSBbXG4gICAgaGxqcy5DT01NRU5UKCctLSg/IScgKyBPUEVOSU5HX0xPTkdfQlJBQ0tFVCArICcpJywgJyQnKSxcbiAgICBobGpzLkNPTU1FTlQoXG4gICAgICAnLS0nICsgT1BFTklOR19MT05HX0JSQUNLRVQsXG4gICAgICBDTE9TSU5HX0xPTkdfQlJBQ0tFVCxcbiAgICAgIHtcbiAgICAgICAgY29udGFpbnM6IFsgTE9OR19CUkFDS0VUUyBdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9XG4gICAgKVxuICBdO1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdMdWEnLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgbGl0ZXJhbDogXCJ0cnVlIGZhbHNlIG5pbFwiLFxuICAgICAga2V5d29yZDogXCJhbmQgYnJlYWsgZG8gZWxzZSBlbHNlaWYgZW5kIGZvciBnb3RvIGlmIGluIGxvY2FsIG5vdCBvciByZXBlYXQgcmV0dXJuIHRoZW4gdW50aWwgd2hpbGVcIixcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAvLyBNZXRhdGFncyBhbmQgZ2xvYmFsczpcbiAgICAgICAgJ19HIF9FTlYgX1ZFUlNJT04gX19pbmRleCBfX25ld2luZGV4IF9fbW9kZSBfX2NhbGwgX19tZXRhdGFibGUgX190b3N0cmluZyBfX2xlbiAnXG4gICAgICAgICsgJ19fZ2MgX19hZGQgX19zdWIgX19tdWwgX19kaXYgX19tb2QgX19wb3cgX19jb25jYXQgX191bm0gX19lcSBfX2x0IF9fbGUgYXNzZXJ0ICdcbiAgICAgICAgLy8gU3RhbmRhcmQgbWV0aG9kcyBhbmQgcHJvcGVydGllczpcbiAgICAgICAgKyAnY29sbGVjdGdhcmJhZ2UgZG9maWxlIGVycm9yIGdldGZlbnYgZ2V0bWV0YXRhYmxlIGlwYWlycyBsb2FkIGxvYWRmaWxlIGxvYWRzdHJpbmcgJ1xuICAgICAgICArICdtb2R1bGUgbmV4dCBwYWlycyBwY2FsbCBwcmludCByYXdlcXVhbCByYXdnZXQgcmF3c2V0IHJlcXVpcmUgc2VsZWN0IHNldGZlbnYgJ1xuICAgICAgICArICdzZXRtZXRhdGFibGUgdG9udW1iZXIgdG9zdHJpbmcgdHlwZSB1bnBhY2sgeHBjYWxsIGFyZyBzZWxmICdcbiAgICAgICAgLy8gTGlicmFyeSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIChvbmUgbGluZSBwZXIgbGlicmFyeSk6XG4gICAgICAgICsgJ2Nvcm91dGluZSByZXN1bWUgeWllbGQgc3RhdHVzIHdyYXAgY3JlYXRlIHJ1bm5pbmcgZGVidWcgZ2V0dXB2YWx1ZSAnXG4gICAgICAgICsgJ2RlYnVnIHNldGhvb2sgZ2V0bWV0YXRhYmxlIGdldGhvb2sgc2V0bWV0YXRhYmxlIHNldGxvY2FsIHRyYWNlYmFjayBzZXRmZW52IGdldGluZm8gc2V0dXB2YWx1ZSBnZXRsb2NhbCBnZXRyZWdpc3RyeSBnZXRmZW52ICdcbiAgICAgICAgKyAnaW8gbGluZXMgd3JpdGUgY2xvc2UgZmx1c2ggb3BlbiBvdXRwdXQgdHlwZSByZWFkIHN0ZGVyciBzdGRpbiBpbnB1dCBzdGRvdXQgcG9wZW4gdG1wZmlsZSAnXG4gICAgICAgICsgJ21hdGggbG9nIG1heCBhY29zIGh1Z2UgbGRleHAgcGkgY29zIHRhbmggcG93IGRlZyB0YW4gY29zaCBzaW5oIHJhbmRvbSByYW5kb21zZWVkIGZyZXhwIGNlaWwgZmxvb3IgcmFkIGFicyBzcXJ0IG1vZGYgYXNpbiBtaW4gbW9kIGZtb2QgbG9nMTAgYXRhbjIgZXhwIHNpbiBhdGFuICdcbiAgICAgICAgKyAnb3MgZXhpdCBzZXRsb2NhbGUgZGF0ZSBnZXRlbnYgZGlmZnRpbWUgcmVtb3ZlIHRpbWUgY2xvY2sgdG1wbmFtZSByZW5hbWUgZXhlY3V0ZSBwYWNrYWdlIHByZWxvYWQgbG9hZGxpYiBsb2FkZWQgbG9hZGVycyBjcGF0aCBjb25maWcgcGF0aCBzZWVhbGwgJ1xuICAgICAgICArICdzdHJpbmcgc3ViIHVwcGVyIGxlbiBnZmluZCByZXAgZmluZCBtYXRjaCBjaGFyIGR1bXAgZ21hdGNoIHJldmVyc2UgYnl0ZSBmb3JtYXQgZ3N1YiBsb3dlciAnXG4gICAgICAgICsgJ3RhYmxlIHNldG4gaW5zZXJ0IGdldG4gZm9yZWFjaGkgbWF4biBmb3JlYWNoIGNvbmNhdCBzb3J0IHJlbW92ZSdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBDT01NRU5UUy5jb25jYXQoW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IGJlZ2luOiAnKFtfYS16QS1aXVxcXFx3KlxcXFwuKSooW19hLXpBLVpdXFxcXHcqOik/W19hLXpBLVpdXFxcXHcqJyB9KSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsXG4gICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBDT01NRU5UU1xuICAgICAgICAgIH1cbiAgICAgICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IE9QRU5JTkdfTE9OR19CUkFDS0VULFxuICAgICAgICBlbmQ6IENMT1NJTkdfTE9OR19CUkFDS0VULFxuICAgICAgICBjb250YWluczogWyBMT05HX0JSQUNLRVRTIF0sXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfVxuICAgIF0pXG4gIH07XG59XG5cbmV4cG9ydCB7IGx1YSBhcyBkZWZhdWx0IH07XG4iXX0=