function smali(hljs) {
    const smali_instr_low_prio = [
        'add',
        'and',
        'cmp',
        'cmpg',
        'cmpl',
        'const',
        'div',
        'double',
        'float',
        'goto',
        'if',
        'int',
        'long',
        'move',
        'mul',
        'neg',
        'new',
        'nop',
        'not',
        'or',
        'rem',
        'return',
        'shl',
        'shr',
        'sput',
        'sub',
        'throw',
        'ushr',
        'xor'
    ];
    const smali_instr_high_prio = [
        'aget',
        'aput',
        'array',
        'check',
        'execute',
        'fill',
        'filled',
        'goto/16',
        'goto/32',
        'iget',
        'instance',
        'invoke',
        'iput',
        'monitor',
        'packed',
        'sget',
        'sparse'
    ];
    const smali_keywords = [
        'transient',
        'constructor',
        'abstract',
        'final',
        'synthetic',
        'public',
        'private',
        'protected',
        'static',
        'bridge',
        'system'
    ];
    return {
        name: 'Smali',
        contains: [
            {
                className: 'string',
                begin: '"',
                end: '"',
                relevance: 0
            },
            hljs.COMMENT('#', '$', { relevance: 0 }),
            {
                className: 'keyword',
                variants: [
                    { begin: '\\s*\\.end\\s[a-zA-Z0-9]*' },
                    {
                        begin: '^[ ]*\\.[a-zA-Z]*',
                        relevance: 0
                    },
                    {
                        begin: '\\s:[a-zA-Z_0-9]*',
                        relevance: 0
                    },
                    { begin: '\\s(' + smali_keywords.join('|') + ')' }
                ]
            },
            {
                className: 'built_in',
                variants: [
                    { begin: '\\s(' + smali_instr_low_prio.join('|') + ')\\s' },
                    {
                        begin: '\\s(' + smali_instr_low_prio.join('|') + ')((-|/)[a-zA-Z0-9]+)+\\s',
                        relevance: 10
                    },
                    {
                        begin: '\\s(' + smali_instr_high_prio.join('|') + ')((-|/)[a-zA-Z0-9]+)*\\s',
                        relevance: 10
                    }
                ]
            },
            {
                className: 'class',
                begin: 'L[^\(;:\n]*;',
                relevance: 0
            },
            { begin: '[vp][0-9]+' }
        ]
    };
}
export { smali as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hbGkuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9zbWFsaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sb0JBQW9CLEdBQUc7UUFDM0IsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsS0FBSztRQUNMLFFBQVE7UUFDUixPQUFPO1FBQ1AsTUFBTTtRQUNOLElBQUk7UUFDSixLQUFLO1FBQ0wsTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLElBQUk7UUFDSixLQUFLO1FBQ0wsUUFBUTtRQUNSLEtBQUs7UUFDTCxLQUFLO1FBQ0wsTUFBTTtRQUNOLEtBQUs7UUFDTCxPQUFPO1FBQ1AsTUFBTTtRQUNOLEtBQUs7S0FDTixDQUFDO0lBQ0YsTUFBTSxxQkFBcUIsR0FBRztRQUM1QixNQUFNO1FBQ04sTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsU0FBUztRQUNULE1BQU07UUFDTixRQUFRO1FBQ1IsU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNO1FBQ04sVUFBVTtRQUNWLFFBQVE7UUFDUixNQUFNO1FBQ04sU0FBUztRQUNULFFBQVE7UUFDUixNQUFNO1FBQ04sUUFBUTtLQUNULENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRztRQUNyQixXQUFXO1FBQ1gsYUFBYTtRQUNiLFVBQVU7UUFDVixPQUFPO1FBQ1AsV0FBVztRQUNYLFFBQVE7UUFDUixTQUFTO1FBQ1QsV0FBVztRQUNYLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtLQUNULENBQUM7SUFDRixPQUFPO1FBQ0wsSUFBSSxFQUFFLE9BQU87UUFDYixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxPQUFPLENBQ1YsR0FBRyxFQUNILEdBQUcsRUFDSCxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FDakI7WUFDRDtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLDJCQUEyQixFQUFFO29CQUN0Qzt3QkFDRSxLQUFLLEVBQUUsbUJBQW1CO3dCQUMxQixTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRDt3QkFDRSxLQUFLLEVBQUUsbUJBQW1CO3dCQUMxQixTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxFQUFFLEtBQUssRUFBRSxNQUFNLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUU7aUJBQ25EO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxFQUFFO29CQUMzRDt3QkFDRSxLQUFLLEVBQUUsTUFBTSxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRywwQkFBMEI7d0JBQzNFLFNBQVMsRUFBRSxFQUFFO3FCQUNkO29CQUNEO3dCQUNFLEtBQUssRUFBRSxNQUFNLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLDBCQUEwQjt3QkFDNUUsU0FBUyxFQUFFLEVBQUU7cUJBQ2Q7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixLQUFLLEVBQUUsY0FBYztnQkFDckIsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtTQUN4QjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogU21hbGlcbkF1dGhvcjogRGVubmlzIFRpdHplIDxkZW5uaXMudGl0emVAZ21haWwuY29tPlxuRGVzY3JpcHRpb246IEJhc2ljIFNtYWxpIGhpZ2hsaWdodGluZ1xuV2Vic2l0ZTogaHR0cHM6Ly9naXRodWIuY29tL0plc3VzRnJla2Uvc21hbGlcbiovXG5cbmZ1bmN0aW9uIHNtYWxpKGhsanMpIHtcbiAgY29uc3Qgc21hbGlfaW5zdHJfbG93X3ByaW8gPSBbXG4gICAgJ2FkZCcsXG4gICAgJ2FuZCcsXG4gICAgJ2NtcCcsXG4gICAgJ2NtcGcnLFxuICAgICdjbXBsJyxcbiAgICAnY29uc3QnLFxuICAgICdkaXYnLFxuICAgICdkb3VibGUnLFxuICAgICdmbG9hdCcsXG4gICAgJ2dvdG8nLFxuICAgICdpZicsXG4gICAgJ2ludCcsXG4gICAgJ2xvbmcnLFxuICAgICdtb3ZlJyxcbiAgICAnbXVsJyxcbiAgICAnbmVnJyxcbiAgICAnbmV3JyxcbiAgICAnbm9wJyxcbiAgICAnbm90JyxcbiAgICAnb3InLFxuICAgICdyZW0nLFxuICAgICdyZXR1cm4nLFxuICAgICdzaGwnLFxuICAgICdzaHInLFxuICAgICdzcHV0JyxcbiAgICAnc3ViJyxcbiAgICAndGhyb3cnLFxuICAgICd1c2hyJyxcbiAgICAneG9yJ1xuICBdO1xuICBjb25zdCBzbWFsaV9pbnN0cl9oaWdoX3ByaW8gPSBbXG4gICAgJ2FnZXQnLFxuICAgICdhcHV0JyxcbiAgICAnYXJyYXknLFxuICAgICdjaGVjaycsXG4gICAgJ2V4ZWN1dGUnLFxuICAgICdmaWxsJyxcbiAgICAnZmlsbGVkJyxcbiAgICAnZ290by8xNicsXG4gICAgJ2dvdG8vMzInLFxuICAgICdpZ2V0JyxcbiAgICAnaW5zdGFuY2UnLFxuICAgICdpbnZva2UnLFxuICAgICdpcHV0JyxcbiAgICAnbW9uaXRvcicsXG4gICAgJ3BhY2tlZCcsXG4gICAgJ3NnZXQnLFxuICAgICdzcGFyc2UnXG4gIF07XG4gIGNvbnN0IHNtYWxpX2tleXdvcmRzID0gW1xuICAgICd0cmFuc2llbnQnLFxuICAgICdjb25zdHJ1Y3RvcicsXG4gICAgJ2Fic3RyYWN0JyxcbiAgICAnZmluYWwnLFxuICAgICdzeW50aGV0aWMnLFxuICAgICdwdWJsaWMnLFxuICAgICdwcml2YXRlJyxcbiAgICAncHJvdGVjdGVkJyxcbiAgICAnc3RhdGljJyxcbiAgICAnYnJpZGdlJyxcbiAgICAnc3lzdGVtJ1xuICBdO1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdTbWFsaScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIicsXG4gICAgICAgIGVuZDogJ1wiJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAnIycsXG4gICAgICAgICckJyxcbiAgICAgICAgeyByZWxldmFuY2U6IDAgfVxuICAgICAgKSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ1xcXFxzKlxcXFwuZW5kXFxcXHNbYS16QS1aMC05XSonIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdeWyBdKlxcXFwuW2EtekEtWl0qJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdcXFxcczpbYS16QS1aXzAtOV0qJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBiZWdpbjogJ1xcXFxzKCcgKyBzbWFsaV9rZXl3b3Jkcy5qb2luKCd8JykgKyAnKScgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ1xcXFxzKCcgKyBzbWFsaV9pbnN0cl9sb3dfcHJpby5qb2luKCd8JykgKyAnKVxcXFxzJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXHMoJyArIHNtYWxpX2luc3RyX2xvd19wcmlvLmpvaW4oJ3wnKSArICcpKCgtfC8pW2EtekEtWjAtOV0rKStcXFxccycsXG4gICAgICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogJ1xcXFxzKCcgKyBzbWFsaV9pbnN0cl9oaWdoX3ByaW8uam9pbignfCcpICsgJykoKC18LylbYS16QS1aMC05XSspKlxcXFxzJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW46ICdMW15cXCg7Olxcbl0qOycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHsgYmVnaW46ICdbdnBdWzAtOV0rJyB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBzbWFsaSBhcyBkZWZhdWx0IH07XG4iXX0=