function http(hljs) {
    const regex = hljs.regex;
    const VERSION = 'HTTP/(2|1\\.[01])';
    const HEADER_NAME = /[A-Za-z][A-Za-z0-9-]*/;
    const HEADER = {
        className: 'attribute',
        begin: regex.concat('^', HEADER_NAME, '(?=\\:\\s)'),
        starts: { contains: [
                {
                    className: "punctuation",
                    begin: /: /,
                    relevance: 0,
                    starts: {
                        end: '$',
                        relevance: 0
                    }
                }
            ] }
    };
    const HEADERS_AND_BODY = [
        HEADER,
        {
            begin: '\\n\\n',
            starts: {
                subLanguage: [],
                endsWithParent: true
            }
        }
    ];
    return {
        name: 'HTTP',
        aliases: ['https'],
        illegal: /\S/,
        contains: [
            {
                begin: '^(?=' + VERSION + " \\d{3})",
                end: /$/,
                contains: [
                    {
                        className: "meta",
                        begin: VERSION
                    },
                    {
                        className: 'number',
                        begin: '\\b\\d{3}\\b'
                    }
                ],
                starts: {
                    end: /\b\B/,
                    illegal: /\S/,
                    contains: HEADERS_AND_BODY
                }
            },
            {
                begin: '(?=^[A-Z]+ (.*?) ' + VERSION + '$)',
                end: /$/,
                contains: [
                    {
                        className: 'string',
                        begin: ' ',
                        end: ' ',
                        excludeBegin: true,
                        excludeEnd: true
                    },
                    {
                        className: "meta",
                        begin: VERSION
                    },
                    {
                        className: 'keyword',
                        begin: '[A-Z]+'
                    }
                ],
                starts: {
                    end: /\b\B/,
                    illegal: /\S/,
                    contains: HEADERS_AND_BODY
                }
            },
            hljs.inherit(HEADER, { relevance: 0 })
        ]
    };
}
export { http as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2h0dHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDO0lBQ3BDLE1BQU0sV0FBVyxHQUFHLHVCQUF1QixDQUFDO0lBQzVDLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFdBQVc7UUFDdEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUM7UUFDbkQsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFO2dCQUNsQjtvQkFDRSxTQUFTLEVBQUUsYUFBYTtvQkFDeEIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsU0FBUyxFQUFFLENBQUM7b0JBQ1osTUFBTSxFQUFFO3dCQUNOLEdBQUcsRUFBRSxHQUFHO3dCQUNSLFNBQVMsRUFBRSxDQUFDO3FCQUNiO2lCQUNGO2FBQ0YsRUFBRTtLQUNKLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLE1BQU07UUFDTjtZQUNFLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFO2dCQUNOLFdBQVcsRUFBRSxFQUFFO2dCQUNmLGNBQWMsRUFBRSxJQUFJO2FBQ3JCO1NBQ0Y7S0FDRixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLENBQUUsT0FBTyxDQUFFO1FBQ3BCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFO1lBRVI7Z0JBQ0UsS0FBSyxFQUFFLE1BQU0sR0FBRyxPQUFPLEdBQUcsVUFBVTtnQkFDcEMsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxNQUFNO3dCQUNqQixLQUFLLEVBQUUsT0FBTztxQkFDZjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsS0FBSyxFQUFFLGNBQWM7cUJBQ3RCO2lCQUNGO2dCQUNELE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUUsTUFBTTtvQkFDWCxPQUFPLEVBQUUsSUFBSTtvQkFDYixRQUFRLEVBQUUsZ0JBQWdCO2lCQUMzQjthQUNGO1lBRUQ7Z0JBQ0UsS0FBSyxFQUFFLG1CQUFtQixHQUFHLE9BQU8sR0FBRyxJQUFJO2dCQUMzQyxHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLEtBQUssRUFBRSxHQUFHO3dCQUNWLEdBQUcsRUFBRSxHQUFHO3dCQUNSLFlBQVksRUFBRSxJQUFJO3dCQUNsQixVQUFVLEVBQUUsSUFBSTtxQkFDakI7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLE1BQU07d0JBQ2pCLEtBQUssRUFBRSxPQUFPO3FCQUNmO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixLQUFLLEVBQUUsUUFBUTtxQkFDaEI7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLEdBQUcsRUFBRSxNQUFNO29CQUNYLE9BQU8sRUFBRSxJQUFJO29CQUNiLFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzNCO2FBQ0Y7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUN2QztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogSFRUUFxuRGVzY3JpcHRpb246IEhUVFAgcmVxdWVzdCBhbmQgcmVzcG9uc2UgaGVhZGVycyB3aXRoIGF1dG9tYXRpYyBib2R5IGhpZ2hsaWdodGluZ1xuQXV0aG9yOiBJdmFuIFNhZ2FsYWV2IDxtYW5pYWNAc29mdHdhcmVtYW5pYWNzLm9yZz5cbkNhdGVnb3J5OiBwcm90b2NvbHMsIHdlYlxuV2Vic2l0ZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9PdmVydmlld1xuKi9cblxuZnVuY3Rpb24gaHR0cChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgVkVSU0lPTiA9ICdIVFRQLygyfDFcXFxcLlswMV0pJztcbiAgY29uc3QgSEVBREVSX05BTUUgPSAvW0EtWmEtel1bQS1aYS16MC05LV0qLztcbiAgY29uc3QgSEVBREVSID0ge1xuICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgYmVnaW46IHJlZ2V4LmNvbmNhdCgnXicsIEhFQURFUl9OQU1FLCAnKD89XFxcXDpcXFxccyknKSxcbiAgICBzdGFydHM6IHsgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiBcInB1bmN0dWF0aW9uXCIsXG4gICAgICAgIGJlZ2luOiAvOiAvLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJyQnLFxuICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSB9XG4gIH07XG4gIGNvbnN0IEhFQURFUlNfQU5EX0JPRFkgPSBbXG4gICAgSEVBREVSLFxuICAgIHtcbiAgICAgIGJlZ2luOiAnXFxcXG5cXFxcbicsXG4gICAgICBzdGFydHM6IHtcbiAgICAgICAgc3ViTGFuZ3VhZ2U6IFtdLFxuICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgXTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdIVFRQJyxcbiAgICBhbGlhc2VzOiBbICdodHRwcycgXSxcbiAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICBjb250YWluczogW1xuICAgICAgLy8gcmVzcG9uc2VcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdeKD89JyArIFZFUlNJT04gKyBcIiBcXFxcZHszfSlcIixcbiAgICAgICAgZW5kOiAvJC8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcIm1ldGFcIixcbiAgICAgICAgICAgIGJlZ2luOiBWRVJTSU9OXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcYlxcXFxkezN9XFxcXGInXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC9cXGJcXEIvLFxuICAgICAgICAgIGlsbGVnYWw6IC9cXFMvLFxuICAgICAgICAgIGNvbnRhaW5zOiBIRUFERVJTX0FORF9CT0RZXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyByZXF1ZXN0XG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnKD89XltBLVpdKyAoLio/KSAnICsgVkVSU0lPTiArICckKScsXG4gICAgICAgIGVuZDogLyQvLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJyAnLFxuICAgICAgICAgICAgZW5kOiAnICcsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICBleGNsdWRlRW5kOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwibWV0YVwiLFxuICAgICAgICAgICAgYmVnaW46IFZFUlNJT05cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICAgICAgYmVnaW46ICdbQS1aXSsnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC9cXGJcXEIvLFxuICAgICAgICAgIGlsbGVnYWw6IC9cXFMvLFxuICAgICAgICAgIGNvbnRhaW5zOiBIRUFERVJTX0FORF9CT0RZXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyB0byBhbGxvdyBoZWFkZXJzIHRvIHdvcmsgZXZlbiB3aXRob3V0IGEgcHJlYW1ibGVcbiAgICAgIGhsanMuaW5oZXJpdChIRUFERVIsIHsgcmVsZXZhbmNlOiAwIH0pXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBodHRwIGFzIGRlZmF1bHQgfTtcbiJdfQ==