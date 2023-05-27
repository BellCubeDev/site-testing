function accesslog(hljs) {
    const regex = hljs.regex;
    const HTTP_VERBS = [
        "GET",
        "POST",
        "HEAD",
        "PUT",
        "DELETE",
        "CONNECT",
        "OPTIONS",
        "PATCH",
        "TRACE"
    ];
    return {
        name: 'Apache Access Log',
        contains: [
            {
                className: 'number',
                begin: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?\b/,
                relevance: 5
            },
            {
                className: 'number',
                begin: /\b\d+\b/,
                relevance: 0
            },
            {
                className: 'string',
                begin: regex.concat(/"/, regex.either(...HTTP_VERBS)),
                end: /"/,
                keywords: HTTP_VERBS,
                illegal: /\n/,
                relevance: 5,
                contains: [
                    {
                        begin: /HTTP\/[12]\.\d'/,
                        relevance: 5
                    }
                ]
            },
            {
                className: 'string',
                begin: /\[\d[^\]\n]{8,}\]/,
                illegal: /\n/,
                relevance: 1
            },
            {
                className: 'string',
                begin: /\[/,
                end: /\]/,
                illegal: /\n/,
                relevance: 0
            },
            {
                className: 'string',
                begin: /"Mozilla\/\d\.\d \(/,
                end: /"/,
                illegal: /\n/,
                relevance: 3
            },
            {
                className: 'string',
                begin: /"/,
                end: /"/,
                illegal: /\n/,
                relevance: 0
            }
        ]
    };
}
export { accesslog as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzbG9nLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYWNjZXNzbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLFNBQVMsU0FBUyxDQUFDLElBQUk7SUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUV6QixNQUFNLFVBQVUsR0FBRztRQUNqQixLQUFLO1FBQ0wsTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsUUFBUTtRQUNSLFNBQVM7UUFDVCxTQUFTO1FBQ1QsT0FBTztRQUNQLE9BQU87S0FDUixDQUFDO0lBQ0YsT0FBTztRQUNMLElBQUksRUFBRSxtQkFBbUI7UUFDekIsUUFBUSxFQUFFO1lBRVI7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxrREFBa0Q7Z0JBQ3pELFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFFRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFFRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDckQsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxLQUFLLEVBQUUsaUJBQWlCO3dCQUN4QixTQUFTLEVBQUUsQ0FBQztxQkFDYjtpQkFDRjthQUNGO1lBRUQ7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBSW5CLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUVEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUscUJBQXFCO2dCQUM1QixHQUFHLEVBQUUsR0FBRztnQkFDUixPQUFPLEVBQUUsSUFBSTtnQkFDYixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBRUQ7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFNBQVMsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gTGFuZ3VhZ2U6IEFwYWNoZSBBY2Nlc3MgTG9nXG4gQXV0aG9yOiBPbGVnIEVmaW1vdiA8ZWZpbW92b3ZAZ21haWwuY29tPlxuIERlc2NyaXB0aW9uOiBBcGFjaGUvTmdpbnggQWNjZXNzIExvZ3NcbiBXZWJzaXRlOiBodHRwczovL2h0dHBkLmFwYWNoZS5vcmcvZG9jcy8yLjQvbG9ncy5odG1sI2FjY2Vzc2xvZ1xuIENhdGVnb3J5OiB3ZWIsIGxvZ3NcbiBBdWRpdDogMjAyMFxuICovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBhY2Nlc3Nsb2coaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUVFAvTWV0aG9kc1xuICBjb25zdCBIVFRQX1ZFUkJTID0gW1xuICAgIFwiR0VUXCIsXG4gICAgXCJQT1NUXCIsXG4gICAgXCJIRUFEXCIsXG4gICAgXCJQVVRcIixcbiAgICBcIkRFTEVURVwiLFxuICAgIFwiQ09OTkVDVFwiLFxuICAgIFwiT1BUSU9OU1wiLFxuICAgIFwiUEFUQ0hcIixcbiAgICBcIlRSQUNFXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQXBhY2hlIEFjY2VzcyBMb2cnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAvLyBJUFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogL15cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfSg6XFxkezEsNX0pP1xcYi8sXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfSxcbiAgICAgIC8vIE90aGVyIG51bWJlcnNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IC9cXGJcXGQrXFxiLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gUmVxdWVzdHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdCgvXCIvLCByZWdleC5laXRoZXIoLi4uSFRUUF9WRVJCUykpLFxuICAgICAgICBlbmQ6IC9cIi8sXG4gICAgICAgIGtleXdvcmRzOiBIVFRQX1ZFUkJTLFxuICAgICAgICBpbGxlZ2FsOiAvXFxuLyxcbiAgICAgICAgcmVsZXZhbmNlOiA1LFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAvSFRUUFxcL1sxMl1cXC5cXGQnLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIERhdGVzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIC8vIGRhdGVzIG11c3QgaGF2ZSBhIGNlcnRhaW4gbGVuZ3RoLCB0aGlzIHByZXZlbnRzIG1hdGNoaW5nXG4gICAgICAgIC8vIHNpbXBsZSBhcnJheSBhY2Nlc3NlcyBhWzEyM10gYW5kIFtdIGFuZCBvdGhlciBjb21tb24gcGF0dGVybnNcbiAgICAgICAgLy8gZm91bmQgaW4gb3RoZXIgbGFuZ3VhZ2VzXG4gICAgICAgIGJlZ2luOiAvXFxbXFxkW15cXF1cXG5dezgsfVxcXS8sXG4gICAgICAgIGlsbGVnYWw6IC9cXG4vLFxuICAgICAgICByZWxldmFuY2U6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAvXFxbLyxcbiAgICAgICAgZW5kOiAvXFxdLyxcbiAgICAgICAgaWxsZWdhbDogL1xcbi8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIFVzZXIgYWdlbnQgLyByZWxldmFuY2UgYm9vc3RcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IC9cIk1vemlsbGFcXC9cXGRcXC5cXGQgXFwoLyxcbiAgICAgICAgZW5kOiAvXCIvLFxuICAgICAgICBpbGxlZ2FsOiAvXFxuLyxcbiAgICAgICAgcmVsZXZhbmNlOiAzXG4gICAgICB9LFxuICAgICAgLy8gU3RyaW5nc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogL1wiLyxcbiAgICAgICAgZW5kOiAvXCIvLFxuICAgICAgICBpbGxlZ2FsOiAvXFxuLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBhY2Nlc3Nsb2cgYXMgZGVmYXVsdCB9O1xuIl19