function brainfuck(hljs) {
    const LITERAL = {
        className: 'literal',
        begin: /[+-]+/,
        relevance: 0
    };
    return {
        name: 'Brainfuck',
        aliases: ['bf'],
        contains: [
            hljs.COMMENT(/[^\[\]\.,\+\-<> \r\n]/, /[\[\]\.,\+\-<> \r\n]/, {
                contains: [
                    {
                        match: /[ ]+[^\[\]\.,\+\-<> \r\n]/,
                        relevance: 0
                    }
                ],
                returnEnd: true,
                relevance: 0
            }),
            {
                className: 'title',
                begin: '[\\[\\]]',
                relevance: 0
            },
            {
                className: 'string',
                begin: '[\\.,]',
                relevance: 0
            },
            {
                begin: /(?=\+\+|--)/,
                contains: [LITERAL]
            },
            LITERAL
        ]
    };
}
export { brainfuck as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhaW5mdWNrLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYnJhaW5mdWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsU0FBUyxDQUFDLElBQUk7SUFDckIsTUFBTSxPQUFPLEdBQUc7UUFDZCxTQUFTLEVBQUUsU0FBUztRQUNwQixLQUFLLEVBQUUsT0FBTztRQUNkLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsV0FBVztRQUNqQixPQUFPLEVBQUUsQ0FBRSxJQUFJLENBQUU7UUFDakIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FDVix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCO2dCQUNFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxLQUFLLEVBQUUsMkJBQTJCO3dCQUNsQyxTQUFTLEVBQUUsQ0FBQztxQkFDYjtpQkFDRjtnQkFDRCxTQUFTLEVBQUUsSUFBSTtnQkFDZixTQUFTLEVBQUUsQ0FBQzthQUNiLENBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsT0FBTztnQkFDbEIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUlFLEtBQUssRUFBRSxhQUFhO2dCQUNwQixRQUFRLEVBQUUsQ0FBRSxPQUFPLENBQUU7YUFDdEI7WUFDRCxPQUFPO1NBQ1I7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxTQUFTLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IEJyYWluZnVja1xuQXV0aG9yOiBFdmdlbnkgU3RlcGFuaXNjaGV2IDxpbWJvbGtAZ21haWwuY29tPlxuV2Vic2l0ZTogaHR0cHM6Ly9lc29sYW5ncy5vcmcvd2lraS9CcmFpbmZ1Y2tcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBicmFpbmZ1Y2soaGxqcykge1xuICBjb25zdCBMSVRFUkFMID0ge1xuICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgIGJlZ2luOiAvWystXSsvLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdCcmFpbmZ1Y2snLFxuICAgIGFsaWFzZXM6IFsgJ2JmJyBdLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNPTU1FTlQoXG4gICAgICAgIC9bXlxcW1xcXVxcLixcXCtcXC08PiBcXHJcXG5dLyxcbiAgICAgICAgL1tcXFtcXF1cXC4sXFwrXFwtPD4gXFxyXFxuXS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtYXRjaDogL1sgXStbXlxcW1xcXVxcLixcXCtcXC08PiBcXHJcXG5dLyxcbiAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIH1cbiAgICAgICksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXFtcXFxcXV0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnW1xcXFwuLF0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIHRoaXMgbW9kZSB3b3JrcyBhcyB0aGUgb25seSByZWxldmFuY2UgY291bnRlclxuICAgICAgICAvLyBpdCBsb29rcyBhaGVhZCB0byBmaW5kIHRoZSBzdGFydCBvZiBhIHJ1biBvZiBsaXRlcmFsc1xuICAgICAgICAvLyBzbyBvbmx5IHRoZSBydW5zIGFyZSBjb3VudGVkIGFzIHJlbGV2YW50XG4gICAgICAgIGJlZ2luOiAvKD89XFwrXFwrfC0tKS8sXG4gICAgICAgIGNvbnRhaW5zOiBbIExJVEVSQUwgXVxuICAgICAgfSxcbiAgICAgIExJVEVSQUxcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGJyYWluZnVjayBhcyBkZWZhdWx0IH07XG4iXX0=