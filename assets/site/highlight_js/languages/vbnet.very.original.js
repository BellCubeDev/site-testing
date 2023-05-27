function vbnet(hljs) {
    const regex = hljs.regex;
    const CHARACTER = {
        className: 'string',
        begin: /"(""|[^/n])"C\b/
    };
    const STRING = {
        className: 'string',
        begin: /"/,
        end: /"/,
        illegal: /\n/,
        contains: [
            {
                begin: /""/
            }
        ]
    };
    const MM_DD_YYYY = /\d{1,2}\/\d{1,2}\/\d{4}/;
    const YYYY_MM_DD = /\d{4}-\d{1,2}-\d{1,2}/;
    const TIME_12H = /(\d|1[012])(:\d+){0,2} *(AM|PM)/;
    const TIME_24H = /\d{1,2}(:\d{1,2}){1,2}/;
    const DATE = {
        className: 'literal',
        variants: [
            {
                begin: regex.concat(/# */, regex.either(YYYY_MM_DD, MM_DD_YYYY), / *#/)
            },
            {
                begin: regex.concat(/# */, TIME_24H, / *#/)
            },
            {
                begin: regex.concat(/# */, TIME_12H, / *#/)
            },
            {
                begin: regex.concat(/# */, regex.either(YYYY_MM_DD, MM_DD_YYYY), / +/, regex.either(TIME_12H, TIME_24H), / *#/)
            }
        ]
    };
    const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
            {
                begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/
            },
            {
                begin: /\b\d[\d_]*((U?[SIL])|[%&])?/
            },
            {
                begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/
            },
            {
                begin: /&O[0-7_]+((U?[SIL])|[%&])?/
            },
            {
                begin: /&B[01_]+((U?[SIL])|[%&])?/
            }
        ]
    };
    const LABEL = {
        className: 'label',
        begin: /^\w+:/
    };
    const DOC_COMMENT = hljs.COMMENT(/'''/, /$/, { contains: [
            {
                className: 'doctag',
                begin: /<\/?/,
                end: />/
            }
        ] });
    const COMMENT = hljs.COMMENT(null, /$/, { variants: [
            { begin: /'/ },
            {
                begin: /([\t ]|^)REM(?=\s)/
            }
        ] });
    const DIRECTIVES = {
        className: 'meta',
        begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
        end: /$/,
        keywords: { keyword: 'const disable else elseif enable end externalsource if region then' },
        contains: [COMMENT]
    };
    return {
        name: 'Visual Basic .NET',
        aliases: ['vb'],
        case_insensitive: true,
        classNameAliases: { label: 'symbol' },
        keywords: {
            keyword: 'addhandler alias aggregate ansi as async assembly auto binary by byref byval '
                + 'call case catch class compare const continue custom declare default delegate dim distinct do '
                + 'each equals else elseif end enum erase error event exit explicit finally for friend from function '
                + 'get global goto group handles if implements imports in inherits interface into iterator '
                + 'join key let lib loop me mid module mustinherit mustoverride mybase myclass '
                + 'namespace narrowing new next notinheritable notoverridable '
                + 'of off on operator option optional order overloads overridable overrides '
                + 'paramarray partial preserve private property protected public '
                + 'raiseevent readonly redim removehandler resume return '
                + 'select set shadows shared skip static step stop structure strict sub synclock '
                + 'take text then throw to try unicode until using when where while widening with withevents writeonly yield',
            built_in: 'addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor '
                + 'cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort',
            type: 'boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort',
            literal: 'true false nothing'
        },
        illegal: '//|\\{|\\}|endif|gosub|variant|wend|^\\$ ',
        contains: [
            CHARACTER,
            STRING,
            DATE,
            NUMBER,
            LABEL,
            DOC_COMMENT,
            COMMENT,
            DIRECTIVES
        ]
    };
}
export { vbnet as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmJuZXQuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy92Ym5ldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFLekIsTUFBTSxTQUFTLEdBQUc7UUFDaEIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLGlCQUFpQjtLQUN6QixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsR0FBRztRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUU7WUFDUjtnQkFFRSxLQUFLLEVBQUUsSUFBSTthQUFFO1NBQ2hCO0tBQ0YsQ0FBQztJQUdGLE1BQU0sVUFBVSxHQUFHLHlCQUF5QixDQUFDO0lBQzdDLE1BQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDO0lBQzNDLE1BQU0sUUFBUSxHQUFHLGlDQUFpQyxDQUFDO0lBQ25ELE1BQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDO0lBQzFDLE1BQU0sSUFBSSxHQUFHO1FBQ1gsU0FBUyxFQUFFLFNBQVM7UUFDcEIsUUFBUSxFQUFFO1lBQ1I7Z0JBRUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEtBQUssQ0FBQzthQUFFO1lBQzNFO2dCQUVFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDO2FBQUU7WUFDL0M7Z0JBRUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUM7YUFBRTtZQUMvQztnQkFFRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FDakIsS0FBSyxFQUNMLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUNwQyxJQUFJLEVBQ0osS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQ2hDLEtBQUssQ0FDTjthQUFFO1NBQ047S0FDRixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixTQUFTLEVBQUUsQ0FBQztRQUNaLFFBQVEsRUFBRTtZQUNSO2dCQUVFLEtBQUssRUFBRSwrREFBK0Q7YUFBRTtZQUMxRTtnQkFFRSxLQUFLLEVBQUUsNkJBQTZCO2FBQUU7WUFDeEM7Z0JBRUUsS0FBSyxFQUFFLDhCQUE4QjthQUFFO1lBQ3pDO2dCQUVFLEtBQUssRUFBRSw0QkFBNEI7YUFBRTtZQUN2QztnQkFFRSxLQUFLLEVBQUUsMkJBQTJCO2FBQUU7U0FDdkM7S0FDRixDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUc7UUFDWixTQUFTLEVBQUUsT0FBTztRQUNsQixLQUFLLEVBQUUsT0FBTztLQUNmLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUU7WUFDdkQ7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxNQUFNO2dCQUNiLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7U0FDRixFQUFFLENBQUMsQ0FBQztJQUVMLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRTtZQUNsRCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDZDtnQkFFRSxLQUFLLEVBQUUsb0JBQW9CO2FBQUU7U0FDaEMsRUFBRSxDQUFDLENBQUM7SUFFTCxNQUFNLFVBQVUsR0FBRztRQUNqQixTQUFTLEVBQUUsTUFBTTtRQUVqQixLQUFLLEVBQUUsMEVBQTBFO1FBQ2pGLEdBQUcsRUFBRSxHQUFHO1FBQ1IsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUNmLG9FQUFvRSxFQUFFO1FBQzFFLFFBQVEsRUFBRSxDQUFFLE9BQU8sQ0FBRTtLQUN0QixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxtQkFBbUI7UUFDekIsT0FBTyxFQUFFLENBQUUsSUFBSSxDQUFFO1FBQ2pCLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3JDLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFDTCwrRUFBK0U7a0JBQzdFLCtGQUErRjtrQkFDL0Ysb0dBQW9HO2tCQUNwRywwRkFBMEY7a0JBQzFGLDhFQUE4RTtrQkFDOUUsNkRBQTZEO2tCQUM3RCwyRUFBMkU7a0JBQzNFLGdFQUFnRTtrQkFDaEUsd0RBQXdEO2tCQUN4RCxnRkFBZ0Y7a0JBQ2hGLDJHQUEyRztZQUMvRyxRQUFRLEVBRU4sOElBQThJO2tCQUU1SSw4RkFBOEY7WUFDbEcsSUFBSSxFQUVGLDJHQUEyRztZQUM3RyxPQUFPLEVBQUUsb0JBQW9CO1NBQzlCO1FBQ0QsT0FBTyxFQUNMLDJDQUEyQztRQUM3QyxRQUFRLEVBQUU7WUFDUixTQUFTO1lBQ1QsTUFBTTtZQUNOLElBQUk7WUFDSixNQUFNO1lBQ04sS0FBSztZQUNMLFdBQVc7WUFDWCxPQUFPO1lBQ1AsVUFBVTtTQUNYO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsS0FBSyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBWaXN1YWwgQmFzaWMgLk5FVFxuRGVzY3JpcHRpb246IFZpc3VhbCBCYXNpYyAuTkVUIChWQi5ORVQpIGlzIGEgbXVsdGktcGFyYWRpZ20sIG9iamVjdC1vcmllbnRlZCBwcm9ncmFtbWluZyBsYW5ndWFnZSwgaW1wbGVtZW50ZWQgb24gdGhlIC5ORVQgRnJhbWV3b3JrLlxuQXV0aG9yczogUG9yZW4gQ2hpYW5nIDxyZW4uY2hpYW5nQGdtYWlsLmNvbT4sIEphbiBQaWx6ZXJcbldlYnNpdGU6IGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2RvdG5ldC92aXN1YWwtYmFzaWMvZ2V0dGluZy1zdGFydGVkXG5DYXRlZ29yeTogY29tbW9uXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gdmJuZXQoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIC8qKlxuICAgKiBDaGFyYWN0ZXIgTGl0ZXJhbFxuICAgKiBFaXRoZXIgYSBzaW5nbGUgY2hhcmFjdGVyIChcImFcIkMpIG9yIGFuIGVzY2FwZWQgZG91YmxlIHF1b3RlIChcIlwiXCJcIkMpLlxuICAgKi9cbiAgY29uc3QgQ0hBUkFDVEVSID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46IC9cIihcIlwifFteL25dKVwiQ1xcYi9cbiAgfTtcblxuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogL1wiLyxcbiAgICBlbmQ6IC9cIi8sXG4gICAgaWxsZWdhbDogL1xcbi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgLy8gZG91YmxlIHF1b3RlIGVzY2FwZVxuICAgICAgICBiZWdpbjogL1wiXCIvIH1cbiAgICBdXG4gIH07XG5cbiAgLyoqIERhdGUgTGl0ZXJhbHMgY29uc2lzdCBvZiBhIGRhdGUsIGEgdGltZSwgb3IgYm90aCBzZXBhcmF0ZWQgYnkgd2hpdGVzcGFjZSwgc3Vycm91bmRlZCBieSAjICovXG4gIGNvbnN0IE1NX0REX1lZWVkgPSAvXFxkezEsMn1cXC9cXGR7MSwyfVxcL1xcZHs0fS87XG4gIGNvbnN0IFlZWVlfTU1fREQgPSAvXFxkezR9LVxcZHsxLDJ9LVxcZHsxLDJ9LztcbiAgY29uc3QgVElNRV8xMkggPSAvKFxcZHwxWzAxMl0pKDpcXGQrKXswLDJ9ICooQU18UE0pLztcbiAgY29uc3QgVElNRV8yNEggPSAvXFxkezEsMn0oOlxcZHsxLDJ9KXsxLDJ9LztcbiAgY29uc3QgREFURSA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICAvLyAjWVlZWS1NTS1ERCMgKElTTy1EYXRlKSBvciAjTS9EL1lZWVkjIChVUy1EYXRlKVxuICAgICAgICBiZWdpbjogcmVnZXguY29uY2F0KC8jICovLCByZWdleC5laXRoZXIoWVlZWV9NTV9ERCwgTU1fRERfWVlZWSksIC8gKiMvKSB9LFxuICAgICAge1xuICAgICAgICAvLyAjSDptbVs6c3NdIyAoMjRoIFRpbWUpXG4gICAgICAgIGJlZ2luOiByZWdleC5jb25jYXQoLyMgKi8sIFRJTUVfMjRILCAvICojLykgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gI2hbOm1tWzpzc11dIEEjICgxMmggVGltZSlcbiAgICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdCgvIyAqLywgVElNRV8xMkgsIC8gKiMvKSB9LFxuICAgICAge1xuICAgICAgICAvLyBkYXRlIHBsdXMgdGltZVxuICAgICAgICBiZWdpbjogcmVnZXguY29uY2F0KFxuICAgICAgICAgIC8jICovLFxuICAgICAgICAgIHJlZ2V4LmVpdGhlcihZWVlZX01NX0RELCBNTV9ERF9ZWVlZKSxcbiAgICAgICAgICAvICsvLFxuICAgICAgICAgIHJlZ2V4LmVpdGhlcihUSU1FXzEySCwgVElNRV8yNEgpLFxuICAgICAgICAgIC8gKiMvXG4gICAgICAgICkgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgLy8gRmxvYXRcbiAgICAgICAgYmVnaW46IC9cXGJcXGRbXFxkX10qKChcXC5bXFxkX10rKEVbKy1dP1tcXGRfXSspPyl8KEVbKy1dP1tcXGRfXSspKVtSRkRAISNdPy8gfSxcbiAgICAgIHtcbiAgICAgICAgLy8gSW50ZWdlciAoYmFzZSAxMClcbiAgICAgICAgYmVnaW46IC9cXGJcXGRbXFxkX10qKChVP1tTSUxdKXxbJSZdKT8vIH0sXG4gICAgICB7XG4gICAgICAgIC8vIEludGVnZXIgKGJhc2UgMTYpXG4gICAgICAgIGJlZ2luOiAvJkhbXFxkQS1GX10rKChVP1tTSUxdKXxbJSZdKT8vIH0sXG4gICAgICB7XG4gICAgICAgIC8vIEludGVnZXIgKGJhc2UgOClcbiAgICAgICAgYmVnaW46IC8mT1swLTdfXSsoKFU/W1NJTF0pfFslJl0pPy8gfSxcbiAgICAgIHtcbiAgICAgICAgLy8gSW50ZWdlciAoYmFzZSAyKVxuICAgICAgICBiZWdpbjogLyZCWzAxX10rKChVP1tTSUxdKXxbJSZdKT8vIH1cbiAgICBdXG4gIH07XG5cbiAgY29uc3QgTEFCRUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnbGFiZWwnLFxuICAgIGJlZ2luOiAvXlxcdys6L1xuICB9O1xuXG4gIGNvbnN0IERPQ19DT01NRU5UID0gaGxqcy5DT01NRU5UKC8nJycvLCAvJC8sIHsgY29udGFpbnM6IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdkb2N0YWcnLFxuICAgICAgYmVnaW46IC88XFwvPy8sXG4gICAgICBlbmQ6IC8+L1xuICAgIH1cbiAgXSB9KTtcblxuICBjb25zdCBDT01NRU5UID0gaGxqcy5DT01NRU5UKG51bGwsIC8kLywgeyB2YXJpYW50czogW1xuICAgIHsgYmVnaW46IC8nLyB9LFxuICAgIHtcbiAgICAgIC8vIFRPRE86IFVzZSBtdWx0aS1jbGFzcyBmb3IgbGVhZGluZyBzcGFjZXNcbiAgICAgIGJlZ2luOiAvKFtcXHQgXXxeKVJFTSg/PVxccykvIH1cbiAgXSB9KTtcblxuICBjb25zdCBESVJFQ1RJVkVTID0ge1xuICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgIC8vIFRPRE86IFVzZSBtdWx0aS1jbGFzcyBmb3IgaW5kZW50YXRpb24gb25jZSBhdmFpbGFibGVcbiAgICBiZWdpbjogL1tcXHQgXSojKGNvbnN0fGRpc2FibGV8ZWxzZXxlbHNlaWZ8ZW5hYmxlfGVuZHxleHRlcm5hbHNvdXJjZXxpZnxyZWdpb24pXFxiLyxcbiAgICBlbmQ6IC8kLyxcbiAgICBrZXl3b3JkczogeyBrZXl3b3JkOlxuICAgICAgICAnY29uc3QgZGlzYWJsZSBlbHNlIGVsc2VpZiBlbmFibGUgZW5kIGV4dGVybmFsc291cmNlIGlmIHJlZ2lvbiB0aGVuJyB9LFxuICAgIGNvbnRhaW5zOiBbIENPTU1FTlQgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1Zpc3VhbCBCYXNpYyAuTkVUJyxcbiAgICBhbGlhc2VzOiBbICd2YicgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNsYXNzTmFtZUFsaWFzZXM6IHsgbGFiZWw6ICdzeW1ib2wnIH0sXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhZGRoYW5kbGVyIGFsaWFzIGFnZ3JlZ2F0ZSBhbnNpIGFzIGFzeW5jIGFzc2VtYmx5IGF1dG8gYmluYXJ5IGJ5IGJ5cmVmIGJ5dmFsICcgLyogYS1iICovXG4gICAgICAgICsgJ2NhbGwgY2FzZSBjYXRjaCBjbGFzcyBjb21wYXJlIGNvbnN0IGNvbnRpbnVlIGN1c3RvbSBkZWNsYXJlIGRlZmF1bHQgZGVsZWdhdGUgZGltIGRpc3RpbmN0IGRvICcgLyogYy1kICovXG4gICAgICAgICsgJ2VhY2ggZXF1YWxzIGVsc2UgZWxzZWlmIGVuZCBlbnVtIGVyYXNlIGVycm9yIGV2ZW50IGV4aXQgZXhwbGljaXQgZmluYWxseSBmb3IgZnJpZW5kIGZyb20gZnVuY3Rpb24gJyAvKiBlLWYgKi9cbiAgICAgICAgKyAnZ2V0IGdsb2JhbCBnb3RvIGdyb3VwIGhhbmRsZXMgaWYgaW1wbGVtZW50cyBpbXBvcnRzIGluIGluaGVyaXRzIGludGVyZmFjZSBpbnRvIGl0ZXJhdG9yICcgLyogZy1pICovXG4gICAgICAgICsgJ2pvaW4ga2V5IGxldCBsaWIgbG9vcCBtZSBtaWQgbW9kdWxlIG11c3Rpbmhlcml0IG11c3RvdmVycmlkZSBteWJhc2UgbXljbGFzcyAnIC8qIGotbSAqL1xuICAgICAgICArICduYW1lc3BhY2UgbmFycm93aW5nIG5ldyBuZXh0IG5vdGluaGVyaXRhYmxlIG5vdG92ZXJyaWRhYmxlICcgLyogbiAqL1xuICAgICAgICArICdvZiBvZmYgb24gb3BlcmF0b3Igb3B0aW9uIG9wdGlvbmFsIG9yZGVyIG92ZXJsb2FkcyBvdmVycmlkYWJsZSBvdmVycmlkZXMgJyAvKiBvICovXG4gICAgICAgICsgJ3BhcmFtYXJyYXkgcGFydGlhbCBwcmVzZXJ2ZSBwcml2YXRlIHByb3BlcnR5IHByb3RlY3RlZCBwdWJsaWMgJyAvKiBwICovXG4gICAgICAgICsgJ3JhaXNlZXZlbnQgcmVhZG9ubHkgcmVkaW0gcmVtb3ZlaGFuZGxlciByZXN1bWUgcmV0dXJuICcgLyogciAqL1xuICAgICAgICArICdzZWxlY3Qgc2V0IHNoYWRvd3Mgc2hhcmVkIHNraXAgc3RhdGljIHN0ZXAgc3RvcCBzdHJ1Y3R1cmUgc3RyaWN0IHN1YiBzeW5jbG9jayAnIC8qIHMgKi9cbiAgICAgICAgKyAndGFrZSB0ZXh0IHRoZW4gdGhyb3cgdG8gdHJ5IHVuaWNvZGUgdW50aWwgdXNpbmcgd2hlbiB3aGVyZSB3aGlsZSB3aWRlbmluZyB3aXRoIHdpdGhldmVudHMgd3JpdGVvbmx5IHlpZWxkJyAvKiB0LXkgKi8sXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgLy8gT3BlcmF0b3JzIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2RvdG5ldC92aXN1YWwtYmFzaWMvbGFuZ3VhZ2UtcmVmZXJlbmNlL29wZXJhdG9yc1xuICAgICAgICAnYWRkcmVzc29mIGFuZCBhbmRhbHNvIGF3YWl0IGRpcmVjdGNhc3QgZ2V0dHlwZSBnZXR4bWxuYW1lc3BhY2UgaXMgaXNmYWxzZSBpc25vdCBpc3RydWUgbGlrZSBtb2QgbmFtZW9mIG5ldyBub3Qgb3Igb3JlbHNlIHRyeWNhc3QgdHlwZW9mIHhvciAnXG4gICAgICAgIC8vIFR5cGUgQ29udmVyc2lvbiBGdW5jdGlvbnMgaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZG90bmV0L3Zpc3VhbC1iYXNpYy9sYW5ndWFnZS1yZWZlcmVuY2UvZnVuY3Rpb25zL3R5cGUtY29udmVyc2lvbi1mdW5jdGlvbnNcbiAgICAgICAgKyAnY2Jvb2wgY2J5dGUgY2NoYXIgY2RhdGUgY2RibCBjZGVjIGNpbnQgY2xuZyBjb2JqIGNzYnl0ZSBjc2hvcnQgY3NuZyBjc3RyIGN1aW50IGN1bG5nIGN1c2hvcnQnLFxuICAgICAgdHlwZTpcbiAgICAgICAgLy8gRGF0YSB0eXBlcyBodHRwczovL2RvY3MubWljcm9zb2Z0LmNvbS9kb3RuZXQvdmlzdWFsLWJhc2ljL2xhbmd1YWdlLXJlZmVyZW5jZS9kYXRhLXR5cGVzXG4gICAgICAgICdib29sZWFuIGJ5dGUgY2hhciBkYXRlIGRlY2ltYWwgZG91YmxlIGludGVnZXIgbG9uZyBvYmplY3Qgc2J5dGUgc2hvcnQgc2luZ2xlIHN0cmluZyB1aW50ZWdlciB1bG9uZyB1c2hvcnQnLFxuICAgICAgbGl0ZXJhbDogJ3RydWUgZmFsc2Ugbm90aGluZydcbiAgICB9LFxuICAgIGlsbGVnYWw6XG4gICAgICAnLy98XFxcXHt8XFxcXH18ZW5kaWZ8Z29zdWJ8dmFyaWFudHx3ZW5kfF5cXFxcJCAnIC8qIHJlc2VydmVkIGRlcHJlY2F0ZWQga2V5d29yZHMgKi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIENIQVJBQ1RFUixcbiAgICAgIFNUUklORyxcbiAgICAgIERBVEUsXG4gICAgICBOVU1CRVIsXG4gICAgICBMQUJFTCxcbiAgICAgIERPQ19DT01NRU5ULFxuICAgICAgQ09NTUVOVCxcbiAgICAgIERJUkVDVElWRVNcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHZibmV0IGFzIGRlZmF1bHQgfTtcbiJdfQ==