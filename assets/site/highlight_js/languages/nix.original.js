function nix(hljs) {
    const KEYWORDS = {
        keyword: [
            "rec",
            "with",
            "let",
            "in",
            "inherit",
            "assert",
            "if",
            "else",
            "then"
        ],
        literal: [
            "true",
            "false",
            "or",
            "and",
            "null"
        ],
        built_in: [
            "import",
            "abort",
            "baseNameOf",
            "dirOf",
            "isNull",
            "builtins",
            "map",
            "removeAttrs",
            "throw",
            "toString",
            "derivation"
        ]
    };
    const ANTIQUOTE = {
        className: 'subst',
        begin: /\$\{/,
        end: /\}/,
        keywords: KEYWORDS
    };
    const ESCAPED_DOLLAR = {
        className: 'char.escape',
        begin: /''\$/,
    };
    const ATTRS = {
        begin: /[a-zA-Z0-9-_]+(\s*=)/,
        returnBegin: true,
        relevance: 0,
        contains: [
            {
                className: 'attr',
                begin: /\S+/,
                relevance: 0.2
            }
        ]
    };
    const STRING = {
        className: 'string',
        contains: [ESCAPED_DOLLAR, ANTIQUOTE],
        variants: [
            {
                begin: "''",
                end: "''"
            },
            {
                begin: '"',
                end: '"'
            }
        ]
    };
    const EXPRESSIONS = [
        hljs.NUMBER_MODE,
        hljs.HASH_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        STRING,
        ATTRS
    ];
    ANTIQUOTE.contains = EXPRESSIONS;
    return {
        name: 'Nix',
        aliases: ["nixos"],
        keywords: KEYWORDS,
        contains: EXPRESSIONS
    };
}
export { nix as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibml4LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvbml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFBRTtZQUNQLEtBQUs7WUFDTCxNQUFNO1lBQ04sS0FBSztZQUNMLElBQUk7WUFDSixTQUFTO1lBQ1QsUUFBUTtZQUNSLElBQUk7WUFDSixNQUFNO1lBQ04sTUFBTTtTQUNQO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsTUFBTTtZQUNOLE9BQU87WUFDUCxJQUFJO1lBQ0osS0FBSztZQUNMLE1BQU07U0FDUDtRQUNELFFBQVEsRUFBRTtZQUNSLFFBQVE7WUFDUixPQUFPO1lBQ1AsWUFBWTtZQUNaLE9BQU87WUFDUCxRQUFRO1lBQ1IsVUFBVTtZQUNWLEtBQUs7WUFDTCxhQUFhO1lBQ2IsT0FBTztZQUNQLFVBQVU7WUFDVixZQUFZO1NBQ2I7S0FDRixDQUFDO0lBQ0YsTUFBTSxTQUFTLEdBQUc7UUFDaEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsS0FBSyxFQUFFLE1BQU07UUFDYixHQUFHLEVBQUUsSUFBSTtRQUNULFFBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRztRQUNyQixTQUFTLEVBQUUsYUFBYTtRQUN4QixLQUFLLEVBQUUsTUFBTTtLQUNkLENBQUM7SUFDRixNQUFNLEtBQUssR0FBRztRQUNaLEtBQUssRUFBRSxzQkFBc0I7UUFDN0IsV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLENBQUM7UUFDWixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osU0FBUyxFQUFFLEdBQUc7YUFDZjtTQUNGO0tBQ0YsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFLENBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBRTtRQUN2QyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTthQUNWO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7YUFDVDtTQUNGO0tBQ0YsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLElBQUksQ0FBQyxXQUFXO1FBQ2hCLElBQUksQ0FBQyxpQkFBaUI7UUFDdEIsSUFBSSxDQUFDLG9CQUFvQjtRQUN6QixNQUFNO1FBQ04sS0FBSztLQUNOLENBQUM7SUFDRixTQUFTLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztJQUNqQyxPQUFPO1FBQ0wsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsQ0FBRSxPQUFPLENBQUU7UUFDcEIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFLFdBQVc7S0FDdEIsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBOaXhcbkF1dGhvcjogRG9tZW4gS2/FvmFyIDxkb21lbkBkZXYuc2k+XG5EZXNjcmlwdGlvbjogTml4IGZ1bmN0aW9uYWwgbGFuZ3VhZ2VcbldlYnNpdGU6IGh0dHA6Ly9uaXhvcy5vcmcvbml4XG4qL1xuXG5mdW5jdGlvbiBuaXgoaGxqcykge1xuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOiBbXG4gICAgICBcInJlY1wiLFxuICAgICAgXCJ3aXRoXCIsXG4gICAgICBcImxldFwiLFxuICAgICAgXCJpblwiLFxuICAgICAgXCJpbmhlcml0XCIsXG4gICAgICBcImFzc2VydFwiLFxuICAgICAgXCJpZlwiLFxuICAgICAgXCJlbHNlXCIsXG4gICAgICBcInRoZW5cIlxuICAgIF0sXG4gICAgbGl0ZXJhbDogW1xuICAgICAgXCJ0cnVlXCIsXG4gICAgICBcImZhbHNlXCIsXG4gICAgICBcIm9yXCIsXG4gICAgICBcImFuZFwiLFxuICAgICAgXCJudWxsXCJcbiAgICBdLFxuICAgIGJ1aWx0X2luOiBbXG4gICAgICBcImltcG9ydFwiLFxuICAgICAgXCJhYm9ydFwiLFxuICAgICAgXCJiYXNlTmFtZU9mXCIsXG4gICAgICBcImRpck9mXCIsXG4gICAgICBcImlzTnVsbFwiLFxuICAgICAgXCJidWlsdGluc1wiLFxuICAgICAgXCJtYXBcIixcbiAgICAgIFwicmVtb3ZlQXR0cnNcIixcbiAgICAgIFwidGhyb3dcIixcbiAgICAgIFwidG9TdHJpbmdcIixcbiAgICAgIFwiZGVyaXZhdGlvblwiXG4gICAgXVxuICB9O1xuICBjb25zdCBBTlRJUVVPVEUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAvXFwkXFx7LyxcbiAgICBlbmQ6IC9cXH0vLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEU1xuICB9O1xuICBjb25zdCBFU0NBUEVEX0RPTExBUiA9IHtcbiAgICBjbGFzc05hbWU6ICdjaGFyLmVzY2FwZScsXG4gICAgYmVnaW46IC8nJ1xcJC8sXG4gIH07XG4gIGNvbnN0IEFUVFJTID0ge1xuICAgIGJlZ2luOiAvW2EtekEtWjAtOS1fXSsoXFxzKj0pLyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgICAgIGJlZ2luOiAvXFxTKy8sXG4gICAgICAgIHJlbGV2YW5jZTogMC4yXG4gICAgICB9XG4gICAgXVxuICB9O1xuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBjb250YWluczogWyBFU0NBUEVEX0RPTExBUiwgQU5USVFVT1RFIF0sXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IFwiJydcIixcbiAgICAgICAgZW5kOiBcIicnXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIidcbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IEVYUFJFU1NJT05TID0gW1xuICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgIFNUUklORyxcbiAgICBBVFRSU1xuICBdO1xuICBBTlRJUVVPVEUuY29udGFpbnMgPSBFWFBSRVNTSU9OUztcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnTml4JyxcbiAgICBhbGlhc2VzOiBbIFwibml4b3NcIiBdLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogRVhQUkVTU0lPTlNcbiAgfTtcbn1cblxuZXhwb3J0IHsgbml4IGFzIGRlZmF1bHQgfTtcbiJdfQ==