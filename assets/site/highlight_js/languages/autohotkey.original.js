function autohotkey(hljs) {
    const BACKTICK_ESCAPE = { begin: '`[\\s\\S]' };
    return {
        name: 'AutoHotkey',
        case_insensitive: true,
        aliases: ['ahk'],
        keywords: {
            keyword: 'Break Continue Critical Exit ExitApp Gosub Goto New OnExit Pause return SetBatchLines SetTimer Suspend Thread Throw Until ahk_id ahk_class ahk_pid ahk_exe ahk_group',
            literal: 'true false NOT AND OR',
            built_in: 'ComSpec Clipboard ClipboardAll ErrorLevel'
        },
        contains: [
            BACKTICK_ESCAPE,
            hljs.inherit(hljs.QUOTE_STRING_MODE, { contains: [BACKTICK_ESCAPE] }),
            hljs.COMMENT(';', '$', { relevance: 0 }),
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'number',
                begin: hljs.NUMBER_RE,
                relevance: 0
            },
            {
                className: 'variable',
                begin: '%[a-zA-Z0-9#_$@]+%'
            },
            {
                className: 'built_in',
                begin: '^\\s*\\w+\\s*(,|%)'
            },
            {
                className: 'title',
                variants: [
                    { begin: '^[^\\n";]+::(?!=)' },
                    {
                        begin: '^[^\\n";]+:(?!=)',
                        relevance: 0
                    }
                ]
            },
            {
                className: 'meta',
                begin: '^\\s*#\\w+',
                end: '$',
                relevance: 0
            },
            {
                className: 'built_in',
                begin: 'A_[a-zA-Z0-9]+'
            },
            {
                begin: ',\\s*,'
            }
        ]
    };
}
export { autohotkey as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2hvdGtleS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2F1dG9ob3RrZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxVQUFVLENBQUMsSUFBSTtJQUN0QixNQUFNLGVBQWUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUUvQyxPQUFPO1FBQ0wsSUFBSSxFQUFFLFlBQVk7UUFDbEIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixPQUFPLEVBQUUsQ0FBRSxLQUFLLENBQUU7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLHNLQUFzSztZQUMvSyxPQUFPLEVBQUUsdUJBQXVCO1lBQ2hDLFFBQVEsRUFBRSwyQ0FBMkM7U0FDdEQ7UUFDRCxRQUFRLEVBQUU7WUFDUixlQUFlO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBRSxlQUFlLENBQUUsRUFBRSxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsb0JBQW9CO1lBQ3pCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3JCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFJRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLG9CQUFvQjthQUM1QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsb0JBQW9CO2FBRTVCO1lBQ0Q7Z0JBSUUsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLFFBQVEsRUFBRTtvQkFDUixFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtvQkFDOUI7d0JBQ0UsS0FBSyxFQUFFLGtCQUFrQjt3QkFHekIsU0FBUyxFQUFFLENBQUM7cUJBQ2I7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsWUFBWTtnQkFDbkIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsZ0JBQWdCO2FBQ3hCO1lBQ0Q7Z0JBRUUsS0FBSyxFQUFFLFFBQVE7YUFBRTtTQUNwQjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFVBQVUsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQXV0b0hvdGtleVxuQXV0aG9yOiBTZW9uZ3dvbiBMZWUgPGRsaW1waWRAZ21haWwuY29tPlxuRGVzY3JpcHRpb246IEF1dG9Ib3RrZXkgbGFuZ3VhZ2UgZGVmaW5pdGlvblxuQ2F0ZWdvcnk6IHNjcmlwdGluZ1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGF1dG9ob3RrZXkoaGxqcykge1xuICBjb25zdCBCQUNLVElDS19FU0NBUEUgPSB7IGJlZ2luOiAnYFtcXFxcc1xcXFxTXScgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdBdXRvSG90a2V5JyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGFsaWFzZXM6IFsgJ2FoaycgXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogJ0JyZWFrIENvbnRpbnVlIENyaXRpY2FsIEV4aXQgRXhpdEFwcCBHb3N1YiBHb3RvIE5ldyBPbkV4aXQgUGF1c2UgcmV0dXJuIFNldEJhdGNoTGluZXMgU2V0VGltZXIgU3VzcGVuZCBUaHJlYWQgVGhyb3cgVW50aWwgYWhrX2lkIGFoa19jbGFzcyBhaGtfcGlkIGFoa19leGUgYWhrX2dyb3VwJyxcbiAgICAgIGxpdGVyYWw6ICd0cnVlIGZhbHNlIE5PVCBBTkQgT1InLFxuICAgICAgYnVpbHRfaW46ICdDb21TcGVjIENsaXBib2FyZCBDbGlwYm9hcmRBbGwgRXJyb3JMZXZlbCdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBCQUNLVElDS19FU0NBUEUsXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgeyBjb250YWluczogWyBCQUNLVElDS19FU0NBUEUgXSB9KSxcbiAgICAgIGhsanMuQ09NTUVOVCgnOycsICckJywgeyByZWxldmFuY2U6IDAgfSksXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogaGxqcy5OVU1CRVJfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gc3Vic3Qgd291bGQgYmUgdGhlIG1vc3QgYWNjdXJhdGUgaG93ZXZlciBmYWlscyB0aGUgcG9pbnQgb2ZcbiAgICAgICAgLy8gaGlnaGxpZ2h0aW5nLiB2YXJpYWJsZSBpcyBjb21wYXJhYmx5IHRoZSBtb3N0IGFjY3VyYXRlIHRoYXQgYWN0dWFsbHlcbiAgICAgICAgLy8gaGFzIHNvbWUgZWZmZWN0XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICclW2EtekEtWjAtOSNfJEBdKyUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFxzKlxcXFx3K1xcXFxzKigsfCUpJ1xuICAgICAgICAvLyBJIGRvbid0IHJlYWxseSBrbm93IGlmIHRoaXMgaXMgdG90YWxseSByZWxldmFudFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gc3ltYm9sIHdvdWxkIGJlIG1vc3QgYWNjdXJhdGUgaG93ZXZlciBpcyBoaWdobGlnaHRlZCBqdXN0IGxpa2VcbiAgICAgICAgLy8gYnVpbHRfaW4gYW5kIHRoYXQgbWFrZXMgdXAgYSBsb3Qgb2YgQXV0b0hvdGtleSBjb2RlIG1lYW5pbmcgdGhhdCBpdFxuICAgICAgICAvLyB3b3VsZCBmYWlsIHRvIGhpZ2hsaWdodCBhbnl0aGluZ1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ15bXlxcXFxuXCI7XSs6Oig/IT0pJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnXlteXFxcXG5cIjtdKzooPyE9KScsXG4gICAgICAgICAgICAvLyB6ZXJvIHJlbGV2YW5jZSBhcyBpdCBjYXRjaGVzIGEgbG90IG9mIHRoaW5nc1xuICAgICAgICAgICAgLy8gZm9sbG93ZWQgYnkgYSBzaW5nbGUgJzonIGluIG1hbnkgbGFuZ3VhZ2VzXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ15cXFxccyojXFxcXHcrJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVpbHRfaW4nLFxuICAgICAgICBiZWdpbjogJ0FfW2EtekEtWjAtOV0rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gY29uc2VjdXRpdmUgY29tbWFzLCBub3QgZm9yIGhpZ2hsaWdodGluZyBidXQganVzdCBmb3IgcmVsZXZhbmNlXG4gICAgICAgIGJlZ2luOiAnLFxcXFxzKiwnIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGF1dG9ob3RrZXkgYXMgZGVmYXVsdCB9O1xuIl19