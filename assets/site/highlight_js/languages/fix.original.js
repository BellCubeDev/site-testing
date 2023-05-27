function fix(hljs) {
    return {
        name: 'FIX',
        contains: [
            {
                begin: /[^\u2401\u0001]+/,
                end: /[\u2401\u0001]/,
                excludeEnd: true,
                returnBegin: true,
                returnEnd: false,
                contains: [
                    {
                        begin: /([^\u2401\u0001=]+)/,
                        end: /=([^\u2401\u0001=]+)/,
                        returnEnd: true,
                        returnBegin: false,
                        className: 'attr'
                    },
                    {
                        begin: /=/,
                        end: /([\u2401\u0001])/,
                        excludeEnd: true,
                        excludeBegin: true,
                        className: 'string'
                    }
                ]
            }
        ],
        case_insensitive: true
    };
}
export { fix as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvZml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixPQUFPO1FBQ0wsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixHQUFHLEVBQUUsZ0JBQWdCO2dCQUNyQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLHFCQUFxQjt3QkFDNUIsR0FBRyxFQUFFLHNCQUFzQjt3QkFDM0IsU0FBUyxFQUFFLElBQUk7d0JBQ2YsV0FBVyxFQUFFLEtBQUs7d0JBQ2xCLFNBQVMsRUFBRSxNQUFNO3FCQUNsQjtvQkFDRDt3QkFDRSxLQUFLLEVBQUUsR0FBRzt3QkFDVixHQUFHLEVBQUUsa0JBQWtCO3dCQUN2QixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsWUFBWSxFQUFFLElBQUk7d0JBQ2xCLFNBQVMsRUFBRSxRQUFRO3FCQUNwQjtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxnQkFBZ0IsRUFBRSxJQUFJO0tBQ3ZCLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogRklYXG5BdXRob3I6IEJyZW50IEJyYWRidXJ5IDxicmVudEBicmVudGl1bS5jb20+XG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZml4KGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnRklYJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL1teXFx1MjQwMVxcdTAwMDFdKy8sXG4gICAgICAgIGVuZDogL1tcXHUyNDAxXFx1MDAwMV0vLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgcmV0dXJuRW5kOiBmYWxzZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLyhbXlxcdTI0MDFcXHUwMDAxPV0rKS8sXG4gICAgICAgICAgICBlbmQ6IC89KFteXFx1MjQwMVxcdTAwMDE9XSspLyxcbiAgICAgICAgICAgIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgICAgIHJldHVybkJlZ2luOiBmYWxzZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F0dHInXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLz0vLFxuICAgICAgICAgICAgZW5kOiAvKFtcXHUyNDAxXFx1MDAwMV0pLyxcbiAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlXG4gIH07XG59XG5cbmV4cG9ydCB7IGZpeCBhcyBkZWZhdWx0IH07XG4iXX0=