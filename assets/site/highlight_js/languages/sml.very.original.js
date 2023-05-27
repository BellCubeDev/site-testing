function sml(hljs) {
    return {
        name: 'SML (Standard ML)',
        aliases: ['ml'],
        keywords: {
            $pattern: '[a-z_]\\w*!?',
            keyword: 'abstype and andalso as case datatype do else end eqtype '
                + 'exception fn fun functor handle if in include infix infixr '
                + 'let local nonfix of op open orelse raise rec sharing sig '
                + 'signature struct structure then type val with withtype where while',
            built_in: 'array bool char exn int list option order real ref string substring vector unit word',
            literal: 'true false NONE SOME LESS EQUAL GREATER nil'
        },
        illegal: /\/\/|>>/,
        contains: [
            {
                className: 'literal',
                begin: /\[(\|\|)?\]|\(\)/,
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
                begin: '[a-z_]\\w*\'[\\w\']*'
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
            { begin: /[-=]>/
            }
        ]
    };
}
export { sml as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21sLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvc21sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixPQUFPO1FBQ0wsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixPQUFPLEVBQUUsQ0FBRSxJQUFJLENBQUU7UUFDakIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLGNBQWM7WUFDeEIsT0FBTyxFQUVMLDBEQUEwRDtrQkFDeEQsNkRBQTZEO2tCQUM3RCwyREFBMkQ7a0JBQzNELG9FQUFvRTtZQUN4RSxRQUFRLEVBRU4sc0ZBQXNGO1lBQ3hGLE9BQU8sRUFDTCw2Q0FBNkM7U0FDaEQ7UUFDRCxPQUFPLEVBQUUsU0FBUztRQUNsQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxPQUFPLENBQ1YsUUFBUSxFQUNSLFFBQVEsRUFDUixFQUFFLFFBQVEsRUFBRSxDQUFFLE1BQU0sQ0FBRSxFQUFFLENBQ3pCO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSwyQkFBMkI7YUFFbkM7WUFDRDtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLGdCQUFnQjthQUN4QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHNCQUFzQjthQUFFO1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUNsQyxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLENBQUM7YUFDYixDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDdkQ7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFDSCwrQkFBK0I7c0JBQzdCLHFCQUFxQjtzQkFDckIsb0JBQW9CO3NCQUNwQix3REFBd0Q7Z0JBQzVELFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRCxFQUFFLEtBQUssRUFBRSxPQUFPO2FBQ2Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogU01MIChTdGFuZGFyZCBNTClcbkF1dGhvcjogRWR3aW4gRGFsb3J6byA8ZWR3aW5AZGFsb3J6by5vcmc+XG5EZXNjcmlwdGlvbjogU01MIGxhbmd1YWdlIGRlZmluaXRpb24uXG5XZWJzaXRlOiBodHRwczovL3d3dy5zbWxuai5vcmdcbk9yaWdpbjogb2NhbWwuanNcbkNhdGVnb3J5OiBmdW5jdGlvbmFsXG4qL1xuZnVuY3Rpb24gc21sKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnU01MIChTdGFuZGFyZCBNTCknLFxuICAgIGFsaWFzZXM6IFsgJ21sJyBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogJ1thLXpfXVxcXFx3KiE/JyxcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgIC8qIGFjY29yZGluZyB0byBEZWZpbml0aW9uIG9mIFN0YW5kYXJkIE1MIDk3ICAqL1xuICAgICAgICAnYWJzdHlwZSBhbmQgYW5kYWxzbyBhcyBjYXNlIGRhdGF0eXBlIGRvIGVsc2UgZW5kIGVxdHlwZSAnXG4gICAgICAgICsgJ2V4Y2VwdGlvbiBmbiBmdW4gZnVuY3RvciBoYW5kbGUgaWYgaW4gaW5jbHVkZSBpbmZpeCBpbmZpeHIgJ1xuICAgICAgICArICdsZXQgbG9jYWwgbm9uZml4IG9mIG9wIG9wZW4gb3JlbHNlIHJhaXNlIHJlYyBzaGFyaW5nIHNpZyAnXG4gICAgICAgICsgJ3NpZ25hdHVyZSBzdHJ1Y3Qgc3RydWN0dXJlIHRoZW4gdHlwZSB2YWwgd2l0aCB3aXRodHlwZSB3aGVyZSB3aGlsZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgLyogYnVpbHQtaW4gdHlwZXMgYWNjb3JkaW5nIHRvIGJhc2lzIGxpYnJhcnkgKi9cbiAgICAgICAgJ2FycmF5IGJvb2wgY2hhciBleG4gaW50IGxpc3Qgb3B0aW9uIG9yZGVyIHJlYWwgcmVmIHN0cmluZyBzdWJzdHJpbmcgdmVjdG9yIHVuaXQgd29yZCcsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZSBOT05FIFNPTUUgTEVTUyBFUVVBTCBHUkVBVEVSIG5pbCdcbiAgICB9LFxuICAgIGlsbGVnYWw6IC9cXC9cXC98Pj4vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgICAgICBiZWdpbjogL1xcWyhcXHxcXHwpP1xcXXxcXChcXCkvLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLkNPTU1FTlQoXG4gICAgICAgICdcXFxcKFxcXFwqJyxcbiAgICAgICAgJ1xcXFwqXFxcXCknLFxuICAgICAgICB7IGNvbnRhaW5zOiBbICdzZWxmJyBdIH1cbiAgICAgICksXG4gICAgICB7IC8qIHR5cGUgdmFyaWFibGUgKi9cbiAgICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgYmVnaW46ICdcXCdbQS1aYS16X10oPyFcXCcpW1xcXFx3XFwnXSonXG4gICAgICAgIC8qIHRoZSBncmFtbWFyIGlzIGFtYmlndW91cyBvbiBob3cgJ2EnYiBzaG91bGQgYmUgaW50ZXJwcmV0ZWQgYnV0IG5vdCB0aGUgY29tcGlsZXIgKi9cbiAgICAgIH0sXG4gICAgICB7IC8qIHBvbHltb3JwaGljIHZhcmlhbnQgKi9cbiAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgIGJlZ2luOiAnYFtBLVpdW1xcXFx3XFwnXSonXG4gICAgICB9LFxuICAgICAgeyAvKiBtb2R1bGUgb3IgY29uc3RydWN0b3IgKi9cbiAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJbQS1aXVtcXFxcd1xcJ10qJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgeyAvKiBkb24ndCBjb2xvciBpZGVudGlmaWVycywgYnV0IHNhZmVseSBjYXRjaCBhbGwgaWRlbnRpZmllcnMgd2l0aCAnICovXG4gICAgICAgIGJlZ2luOiAnW2Etel9dXFxcXHcqXFwnW1xcXFx3XFwnXSonIH0sXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSksXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgeyBpbGxlZ2FsOiBudWxsIH0pLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjpcbiAgICAgICAgICAnXFxcXGIoMFt4WF1bYS1mQS1GMC05X10rW0xsbl0/fCdcbiAgICAgICAgICArICcwW29PXVswLTdfXStbTGxuXT98J1xuICAgICAgICAgICsgJzBbYkJdWzAxX10rW0xsbl0/fCdcbiAgICAgICAgICArICdbMC05XVswLTlfXSooW0xsbl18KFxcXFwuWzAtOV9dKik/KFtlRV1bLStdP1swLTlfXSspPyk/KScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHsgYmVnaW46IC9bLT1dPi8gLy8gcmVsZXZhbmNlIGJvb3N0ZXJcbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHNtbCBhcyBkZWZhdWx0IH07XG4iXX0=