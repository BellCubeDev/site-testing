function csp(hljs) {
    const KEYWORDS = [
        "base-uri",
        "child-src",
        "connect-src",
        "default-src",
        "font-src",
        "form-action",
        "frame-ancestors",
        "frame-src",
        "img-src",
        "manifest-src",
        "media-src",
        "object-src",
        "plugin-types",
        "report-uri",
        "sandbox",
        "script-src",
        "style-src",
        "trusted-types",
        "unsafe-hashes",
        "worker-src"
    ];
    return {
        name: 'CSP',
        case_insensitive: false,
        keywords: {
            $pattern: '[a-zA-Z][a-zA-Z0-9_-]*',
            keyword: KEYWORDS
        },
        contains: [
            {
                className: 'string',
                begin: "'",
                end: "'"
            },
            {
                className: 'attribute',
                begin: '^Content',
                end: ':',
                excludeEnd: true
            }
        ]
    };
}
export { csp as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NwLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvY3NwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLFFBQVEsR0FBRztRQUNmLFVBQVU7UUFDVixXQUFXO1FBQ1gsYUFBYTtRQUNiLGFBQWE7UUFDYixVQUFVO1FBQ1YsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixXQUFXO1FBQ1gsU0FBUztRQUNULGNBQWM7UUFDZCxXQUFXO1FBQ1gsWUFBWTtRQUNaLGNBQWM7UUFDZCxZQUFZO1FBQ1osU0FBUztRQUNULFlBQVk7UUFDWixXQUFXO1FBQ1gsZUFBZTtRQUNmLGVBQWU7UUFDZixZQUFZO0tBQ2IsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsS0FBSztRQUNYLGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxPQUFPLEVBQUUsUUFBUTtTQUNsQjtRQUNELFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRzthQUNUO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLEtBQUssRUFBRSxVQUFVO2dCQUNqQixHQUFHLEVBQUUsR0FBRztnQkFDUixVQUFVLEVBQUUsSUFBSTthQUNqQjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBDU1BcbkRlc2NyaXB0aW9uOiBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBkZWZpbml0aW9uIGhpZ2hsaWdodGluZ1xuQXV0aG9yOiBUYXJhcyA8b3hkZWZAb3hkZWYuaW5mbz5cbldlYnNpdGU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUVFAvQ1NQXG5cbnZpbTogdHM9MiBzdz0yIHN0PTJcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBjc3AoaGxqcykge1xuICBjb25zdCBLRVlXT1JEUyA9IFtcbiAgICBcImJhc2UtdXJpXCIsXG4gICAgXCJjaGlsZC1zcmNcIixcbiAgICBcImNvbm5lY3Qtc3JjXCIsXG4gICAgXCJkZWZhdWx0LXNyY1wiLFxuICAgIFwiZm9udC1zcmNcIixcbiAgICBcImZvcm0tYWN0aW9uXCIsXG4gICAgXCJmcmFtZS1hbmNlc3RvcnNcIixcbiAgICBcImZyYW1lLXNyY1wiLFxuICAgIFwiaW1nLXNyY1wiLFxuICAgIFwibWFuaWZlc3Qtc3JjXCIsXG4gICAgXCJtZWRpYS1zcmNcIixcbiAgICBcIm9iamVjdC1zcmNcIixcbiAgICBcInBsdWdpbi10eXBlc1wiLFxuICAgIFwicmVwb3J0LXVyaVwiLFxuICAgIFwic2FuZGJveFwiLFxuICAgIFwic2NyaXB0LXNyY1wiLFxuICAgIFwic3R5bGUtc3JjXCIsXG4gICAgXCJ0cnVzdGVkLXR5cGVzXCIsXG4gICAgXCJ1bnNhZmUtaGFzaGVzXCIsXG4gICAgXCJ3b3JrZXItc3JjXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQ1NQJyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiBmYWxzZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46ICdbYS16QS1aXVthLXpBLVowLTlfLV0qJyxcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogXCInXCIsXG4gICAgICAgIGVuZDogXCInXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXkNvbnRlbnQnLFxuICAgICAgICBlbmQ6ICc6JyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgY3NwIGFzIGRlZmF1bHQgfTtcbiJdfQ==