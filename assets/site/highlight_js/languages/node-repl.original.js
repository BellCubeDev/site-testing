function nodeRepl(hljs) {
    return {
        name: 'Node REPL',
        contains: [
            {
                className: 'meta.prompt',
                starts: {
                    end: / |$/,
                    starts: {
                        end: '$',
                        subLanguage: 'javascript'
                    }
                },
                variants: [
                    { begin: /^>(?=[ ]|$)/ },
                    { begin: /^\.\.\.(?=[ ]|$)/ }
                ]
            }
        ]
    };
}
export { nodeRepl as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1yZXBsLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvbm9kZS1yZXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsUUFBUSxDQUFDLElBQUk7SUFDcEIsT0FBTztRQUNMLElBQUksRUFBRSxXQUFXO1FBQ2pCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixNQUFNLEVBQUU7b0JBR04sR0FBRyxFQUFFLEtBQUs7b0JBQ1YsTUFBTSxFQUFFO3dCQUNOLEdBQUcsRUFBRSxHQUFHO3dCQUNSLFdBQVcsRUFBRSxZQUFZO3FCQUMxQjtpQkFDRjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFO29CQUN4QixFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtpQkFDOUI7YUFDRjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsUUFBUSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBOb2RlIFJFUExcblJlcXVpcmVzOiBqYXZhc2NyaXB0LmpzXG5BdXRob3I6IE1hcmF0IE5hZ2F5ZXYgPG5hZ2Fldm10QHlhbmRleC5ydT5cbkNhdGVnb3J5OiBzY3JpcHRpbmdcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBub2RlUmVwbChobGpzKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ05vZGUgUkVQTCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YS5wcm9tcHQnLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAvLyBhIHNwYWNlIHNlcGFyYXRlcyB0aGUgUkVQTCBwcmVmaXggZnJvbSB0aGUgYWN0dWFsIGNvZGVcbiAgICAgICAgICAvLyB0aGlzIGlzIHB1cmVseSBmb3IgY2xlYW5lciBIVE1MIG91dHB1dFxuICAgICAgICAgIGVuZDogLyB8JC8sXG4gICAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnamF2YXNjcmlwdCdcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogL14+KD89WyBdfCQpLyB9LFxuICAgICAgICAgIHsgYmVnaW46IC9eXFwuXFwuXFwuKD89WyBdfCQpLyB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IG5vZGVSZXBsIGFzIGRlZmF1bHQgfTtcbiJdfQ==