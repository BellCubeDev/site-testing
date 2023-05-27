function thrift(hljs) {
    const TYPES = [
        "bool",
        "byte",
        "i16",
        "i32",
        "i64",
        "double",
        "string",
        "binary"
    ];
    const KEYWORDS = [
        "namespace",
        "const",
        "typedef",
        "struct",
        "enum",
        "service",
        "exception",
        "void",
        "oneway",
        "set",
        "list",
        "map",
        "required",
        "optional"
    ];
    return {
        name: 'Thrift',
        keywords: {
            keyword: KEYWORDS,
            type: TYPES,
            literal: 'true false'
        },
        contains: [
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'class',
                beginKeywords: 'struct enum service exception',
                end: /\{/,
                illegal: /\n/,
                contains: [
                    hljs.inherit(hljs.TITLE_MODE, {
                        starts: {
                            endsWithParent: true,
                            excludeEnd: true
                        }
                    })
                ]
            },
            {
                begin: '\\b(set|list|map)\\s*<',
                keywords: { type: [
                        ...TYPES,
                        "set",
                        "list",
                        "map"
                    ] },
                end: '>',
                contains: ['self']
            }
        ]
    };
}
export { thrift as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyaWZ0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvdGhyaWZ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxLQUFLLEdBQUc7UUFDWixNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtLQUNULENBQUM7SUFDRixNQUFNLFFBQVEsR0FBRztRQUNmLFdBQVc7UUFDWCxPQUFPO1FBQ1AsU0FBUztRQUNULFFBQVE7UUFDUixNQUFNO1FBQ04sU0FBUztRQUNULFdBQVc7UUFDWCxNQUFNO1FBQ04sUUFBUTtRQUNSLEtBQUs7UUFDTCxNQUFNO1FBQ04sS0FBSztRQUNMLFVBQVU7UUFDVixVQUFVO0tBQ1gsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLFlBQVk7U0FDdEI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxXQUFXO1lBQ2hCLElBQUksQ0FBQyxtQkFBbUI7WUFDeEIsSUFBSSxDQUFDLG9CQUFvQjtZQUN6QjtnQkFDRSxTQUFTLEVBQUUsT0FBTztnQkFDbEIsYUFBYSxFQUFFLCtCQUErQjtnQkFDOUMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFFNUIsTUFBTSxFQUFFOzRCQUNOLGNBQWMsRUFBRSxJQUFJOzRCQUNwQixVQUFVLEVBQUUsSUFBSTt5QkFDakI7cUJBQUUsQ0FBQztpQkFDUDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHdCQUF3QjtnQkFDL0IsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFO3dCQUNoQixHQUFHLEtBQUs7d0JBQ1IsS0FBSzt3QkFDTCxNQUFNO3dCQUNOLEtBQUs7cUJBQ04sRUFBRTtnQkFDSCxHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUUsQ0FBRSxNQUFNLENBQUU7YUFDckI7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogVGhyaWZ0XG5BdXRob3I6IE9sZWcgRWZpbW92IDxlZmltb3ZvdkBnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogVGhyaWZ0IG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3JtYXRcbldlYnNpdGU6IGh0dHBzOi8vdGhyaWZ0LmFwYWNoZS5vcmdcbkNhdGVnb3J5OiBwcm90b2NvbHNcbiovXG5cbmZ1bmN0aW9uIHRocmlmdChobGpzKSB7XG4gIGNvbnN0IFRZUEVTID0gW1xuICAgIFwiYm9vbFwiLFxuICAgIFwiYnl0ZVwiLFxuICAgIFwiaTE2XCIsXG4gICAgXCJpMzJcIixcbiAgICBcImk2NFwiLFxuICAgIFwiZG91YmxlXCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcImJpbmFyeVwiXG4gIF07XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgIFwibmFtZXNwYWNlXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwidHlwZWRlZlwiLFxuICAgIFwic3RydWN0XCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJzZXJ2aWNlXCIsXG4gICAgXCJleGNlcHRpb25cIixcbiAgICBcInZvaWRcIixcbiAgICBcIm9uZXdheVwiLFxuICAgIFwic2V0XCIsXG4gICAgXCJsaXN0XCIsXG4gICAgXCJtYXBcIixcbiAgICBcInJlcXVpcmVkXCIsXG4gICAgXCJvcHRpb25hbFwiXG4gIF07XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1RocmlmdCcsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTLFxuICAgICAgdHlwZTogVFlQRVMsXG4gICAgICBsaXRlcmFsOiAndHJ1ZSBmYWxzZSdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ3N0cnVjdCBlbnVtIHNlcnZpY2UgZXhjZXB0aW9uJyxcbiAgICAgICAgZW5kOiAvXFx7LyxcbiAgICAgICAgaWxsZWdhbDogL1xcbi8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwge1xuICAgICAgICAgICAgLy8gaGFjazogZWF0aW5nIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IHRpdGxlXG4gICAgICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICAgIH0gfSlcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcYihzZXR8bGlzdHxtYXApXFxcXHMqPCcsXG4gICAgICAgIGtleXdvcmRzOiB7IHR5cGU6IFtcbiAgICAgICAgICAuLi5UWVBFUyxcbiAgICAgICAgICBcInNldFwiLFxuICAgICAgICAgIFwibGlzdFwiLFxuICAgICAgICAgIFwibWFwXCJcbiAgICAgICAgXSB9LFxuICAgICAgICBlbmQ6ICc+JyxcbiAgICAgICAgY29udGFpbnM6IFsgJ3NlbGYnIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHRocmlmdCBhcyBkZWZhdWx0IH07XG4iXX0=