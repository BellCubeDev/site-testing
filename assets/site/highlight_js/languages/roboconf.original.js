function roboconf(hljs) {
    const IDENTIFIER = '[a-zA-Z-_][^\\n{]+\\{';
    const PROPERTY = {
        className: 'attribute',
        begin: /[a-zA-Z-_]+/,
        end: /\s*:/,
        excludeEnd: true,
        starts: {
            end: ';',
            relevance: 0,
            contains: [
                {
                    className: 'variable',
                    begin: /\.[a-zA-Z-_]+/
                },
                {
                    className: 'keyword',
                    begin: /\(optional\)/
                }
            ]
        }
    };
    return {
        name: 'Roboconf',
        aliases: [
            'graph',
            'instances'
        ],
        case_insensitive: true,
        keywords: 'import',
        contains: [
            {
                begin: '^facet ' + IDENTIFIER,
                end: /\}/,
                keywords: 'facet',
                contains: [
                    PROPERTY,
                    hljs.HASH_COMMENT_MODE
                ]
            },
            {
                begin: '^\\s*instance of ' + IDENTIFIER,
                end: /\}/,
                keywords: 'name count channels instance-data instance-state instance of',
                illegal: /\S/,
                contains: [
                    'self',
                    PROPERTY,
                    hljs.HASH_COMMENT_MODE
                ]
            },
            {
                begin: '^' + IDENTIFIER,
                end: /\}/,
                contains: [
                    PROPERTY,
                    hljs.HASH_COMMENT_MODE
                ]
            },
            hljs.HASH_COMMENT_MODE
        ]
    };
}
export { roboconf as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9ib2NvbmYuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9yb2JvY29uZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLFFBQVEsQ0FBQyxJQUFJO0lBQ3BCLE1BQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDO0lBRTNDLE1BQU0sUUFBUSxHQUFHO1FBQ2YsU0FBUyxFQUFFLFdBQVc7UUFDdEIsS0FBSyxFQUFFLGFBQWE7UUFDcEIsR0FBRyxFQUFFLE1BQU07UUFDWCxVQUFVLEVBQUUsSUFBSTtRQUNoQixNQUFNLEVBQUU7WUFDTixHQUFHLEVBQUUsR0FBRztZQUNSLFNBQVMsRUFBRSxDQUFDO1lBQ1osUUFBUSxFQUFFO2dCQUNSO29CQUNFLFNBQVMsRUFBRSxVQUFVO29CQUNyQixLQUFLLEVBQUUsZUFBZTtpQkFDdkI7Z0JBQ0Q7b0JBQ0UsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLEtBQUssRUFBRSxjQUFjO2lCQUN0QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxVQUFVO1FBQ2hCLE9BQU8sRUFBRTtZQUNQLE9BQU87WUFDUCxXQUFXO1NBQ1o7UUFDRCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRTtZQUVSO2dCQUNFLEtBQUssRUFBRSxTQUFTLEdBQUcsVUFBVTtnQkFDN0IsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUixRQUFRO29CQUNSLElBQUksQ0FBQyxpQkFBaUI7aUJBQ3ZCO2FBQ0Y7WUFHRDtnQkFDRSxLQUFLLEVBQUUsbUJBQW1CLEdBQUcsVUFBVTtnQkFDdkMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFLDhEQUE4RDtnQkFDeEUsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLE1BQU07b0JBQ04sUUFBUTtvQkFDUixJQUFJLENBQUMsaUJBQWlCO2lCQUN2QjthQUNGO1lBR0Q7Z0JBQ0UsS0FBSyxFQUFFLEdBQUcsR0FBRyxVQUFVO2dCQUN2QixHQUFHLEVBQUUsSUFBSTtnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsUUFBUTtvQkFDUixJQUFJLENBQUMsaUJBQWlCO2lCQUN2QjthQUNGO1lBR0QsSUFBSSxDQUFDLGlCQUFpQjtTQUN2QjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFFBQVEsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUm9ib2NvbmZcbkF1dGhvcjogVmluY2VudCBadXJjemFrIDx2enVyY3pha0BsaW5hZ29yYS5jb20+XG5EZXNjcmlwdGlvbjogU3ludGF4IGhpZ2hsaWdodGluZyBmb3IgUm9ib2NvbmYncyBEU0xcbldlYnNpdGU6IGh0dHA6Ly9yb2JvY29uZi5uZXRcbkNhdGVnb3J5OiBjb25maWdcbiovXG5cbmZ1bmN0aW9uIHJvYm9jb25mKGhsanMpIHtcbiAgY29uc3QgSURFTlRJRklFUiA9ICdbYS16QS1aLV9dW15cXFxcbntdK1xcXFx7JztcblxuICBjb25zdCBQUk9QRVJUWSA9IHtcbiAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgIGJlZ2luOiAvW2EtekEtWi1fXSsvLFxuICAgIGVuZDogL1xccyo6LyxcbiAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgIHN0YXJ0czoge1xuICAgICAgZW5kOiAnOycsXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBjb250YWluczogW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICAgIGJlZ2luOiAvXFwuW2EtekEtWi1fXSsvXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgICBiZWdpbjogL1xcKG9wdGlvbmFsXFwpL1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1JvYm9jb25mJyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAnZ3JhcGgnLFxuICAgICAgJ2luc3RhbmNlcydcbiAgICBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6ICdpbXBvcnQnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAvLyBGYWNldCBzZWN0aW9uc1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ15mYWNldCAnICsgSURFTlRJRklFUixcbiAgICAgICAgZW5kOiAvXFx9LyxcbiAgICAgICAga2V5d29yZHM6ICdmYWNldCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgUFJPUEVSVFksXG4gICAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICAvLyBJbnN0YW5jZSBzZWN0aW9uc1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ15cXFxccyppbnN0YW5jZSBvZiAnICsgSURFTlRJRklFUixcbiAgICAgICAgZW5kOiAvXFx9LyxcbiAgICAgICAga2V5d29yZHM6ICduYW1lIGNvdW50IGNoYW5uZWxzIGluc3RhbmNlLWRhdGEgaW5zdGFuY2Utc3RhdGUgaW5zdGFuY2Ugb2YnLFxuICAgICAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgUFJPUEVSVFksXG4gICAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICAvLyBDb21wb25lbnQgc2VjdGlvbnNcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdeJyArIElERU5USUZJRVIsXG4gICAgICAgIGVuZDogL1xcfS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgUFJPUEVSVFksXG4gICAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICAvLyBDb21tZW50c1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgcm9ib2NvbmYgYXMgZGVmYXVsdCB9O1xuIl19