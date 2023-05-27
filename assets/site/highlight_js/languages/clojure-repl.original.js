function clojureRepl(hljs) {
    return {
        name: 'Clojure REPL',
        contains: [
            {
                className: 'meta.prompt',
                begin: /^([\w.-]+|\s*#_)?=>/,
                starts: {
                    end: /$/,
                    subLanguage: 'clojure'
                }
            }
        ]
    };
}
export { clojureRepl as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvanVyZS1yZXBsLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvY2xvanVyZS1yZXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLFNBQVMsV0FBVyxDQUFDLElBQUk7SUFDdkIsT0FBTztRQUNMLElBQUksRUFBRSxjQUFjO1FBQ3BCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixLQUFLLEVBQUUscUJBQXFCO2dCQUM1QixNQUFNLEVBQUU7b0JBQ04sR0FBRyxFQUFFLEdBQUc7b0JBQ1IsV0FBVyxFQUFFLFNBQVM7aUJBQ3ZCO2FBQ0Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQ2xvanVyZSBSRVBMXG5EZXNjcmlwdGlvbjogQ2xvanVyZSBSRVBMIHNlc3Npb25zXG5BdXRob3I6IEl2YW4gU2FnYWxhZXYgPG1hbmlhY0Bzb2Z0d2FyZW1hbmlhY3Mub3JnPlxuUmVxdWlyZXM6IGNsb2p1cmUuanNcbldlYnNpdGU6IGh0dHBzOi8vY2xvanVyZS5vcmdcbkNhdGVnb3J5OiBsaXNwXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gY2xvanVyZVJlcGwoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdDbG9qdXJlIFJFUEwnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEucHJvbXB0JyxcbiAgICAgICAgYmVnaW46IC9eKFtcXHcuLV0rfFxccyojXyk/PT4vLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC8kLyxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogJ2Nsb2p1cmUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGNsb2p1cmVSZXBsIGFzIGRlZmF1bHQgfTtcbiJdfQ==