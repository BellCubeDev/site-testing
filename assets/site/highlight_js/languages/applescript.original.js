function applescript(hljs) {
    const regex = hljs.regex;
    const STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null });
    const PARAMS = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        contains: [
            'self',
            hljs.C_NUMBER_MODE,
            STRING
        ]
    };
    const COMMENT_MODE_1 = hljs.COMMENT(/--/, /$/);
    const COMMENT_MODE_2 = hljs.COMMENT(/\(\*/, /\*\)/, { contains: [
            'self',
            COMMENT_MODE_1
        ] });
    const COMMENTS = [
        COMMENT_MODE_1,
        COMMENT_MODE_2,
        hljs.HASH_COMMENT_MODE
    ];
    const KEYWORD_PATTERNS = [
        /apart from/,
        /aside from/,
        /instead of/,
        /out of/,
        /greater than/,
        /isn't|(doesn't|does not) (equal|come before|come after|contain)/,
        /(greater|less) than( or equal)?/,
        /(starts?|ends|begins?) with/,
        /contained by/,
        /comes (before|after)/,
        /a (ref|reference)/,
        /POSIX (file|path)/,
        /(date|time) string/,
        /quoted form/
    ];
    const BUILT_IN_PATTERNS = [
        /clipboard info/,
        /the clipboard/,
        /info for/,
        /list (disks|folder)/,
        /mount volume/,
        /path to/,
        /(close|open for) access/,
        /(get|set) eof/,
        /current date/,
        /do shell script/,
        /get volume settings/,
        /random number/,
        /set volume/,
        /system attribute/,
        /system info/,
        /time to GMT/,
        /(load|run|store) script/,
        /scripting components/,
        /ASCII (character|number)/,
        /localized string/,
        /choose (application|color|file|file name|folder|from list|remote application|URL)/,
        /display (alert|dialog)/
    ];
    return {
        name: 'AppleScript',
        aliases: ['osascript'],
        keywords: {
            keyword: 'about above after against and around as at back before beginning '
                + 'behind below beneath beside between but by considering '
                + 'contain contains continue copy div does eighth else end equal '
                + 'equals error every exit fifth first for fourth from front '
                + 'get given global if ignoring in into is it its last local me '
                + 'middle mod my ninth not of on onto or over prop property put ref '
                + 'reference repeat returning script second set seventh since '
                + 'sixth some tell tenth that the|0 then third through thru '
                + 'timeout times to transaction try until where while whose with '
                + 'without',
            literal: 'AppleScript false linefeed return pi quote result space tab true',
            built_in: 'alias application boolean class constant date file integer list '
                + 'number real record string text '
                + 'activate beep count delay launch log offset read round '
                + 'run say summarize write '
                + 'character characters contents day frontmost id item length '
                + 'month name|0 paragraph paragraphs rest reverse running time version '
                + 'weekday word words year'
        },
        contains: [
            STRING,
            hljs.C_NUMBER_MODE,
            {
                className: 'built_in',
                begin: regex.concat(/\b/, regex.either(...BUILT_IN_PATTERNS), /\b/)
            },
            {
                className: 'built_in',
                begin: /^\s*return\b/
            },
            {
                className: 'literal',
                begin: /\b(text item delimiters|current application|missing value)\b/
            },
            {
                className: 'keyword',
                begin: regex.concat(/\b/, regex.either(...KEYWORD_PATTERNS), /\b/)
            },
            {
                beginKeywords: 'on',
                illegal: /[${=;\n]/,
                contains: [
                    hljs.UNDERSCORE_TITLE_MODE,
                    PARAMS
                ]
            },
            ...COMMENTS
        ],
        illegal: /\/\/|->|=>|\[\[/
    };
}
export { applescript as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGVzY3JpcHQuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9hcHBsZXNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLFdBQVcsQ0FBQyxJQUFJO0lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDekIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDN0MsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsSUFBSTtRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLElBQUksQ0FBQyxhQUFhO1lBQ2xCLE1BQU07U0FDUDtLQUNGLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUNqQyxNQUFNLEVBQ04sTUFBTSxFQUNOLEVBQUUsUUFBUSxFQUFFO1lBQ1YsTUFBTTtZQUNOLGNBQWM7U0FDZixFQUFFLENBQ0osQ0FBQztJQUNGLE1BQU0sUUFBUSxHQUFHO1FBQ2YsY0FBYztRQUNkLGNBQWM7UUFDZCxJQUFJLENBQUMsaUJBQWlCO0tBQ3ZCLENBQUM7SUFFRixNQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLFlBQVk7UUFDWixZQUFZO1FBQ1osWUFBWTtRQUNaLFFBQVE7UUFDUixjQUFjO1FBQ2QsaUVBQWlFO1FBQ2pFLGlDQUFpQztRQUNqQyw2QkFBNkI7UUFDN0IsY0FBYztRQUNkLHNCQUFzQjtRQUN0QixtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLG9CQUFvQjtRQUNwQixhQUFhO0tBQ2QsQ0FBQztJQUVGLE1BQU0saUJBQWlCLEdBQUc7UUFDeEIsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFDZixVQUFVO1FBQ1YscUJBQXFCO1FBQ3JCLGNBQWM7UUFDZCxTQUFTO1FBQ1QseUJBQXlCO1FBQ3pCLGVBQWU7UUFDZixjQUFjO1FBQ2QsaUJBQWlCO1FBQ2pCLHFCQUFxQjtRQUNyQixlQUFlO1FBQ2YsWUFBWTtRQUNaLGtCQUFrQjtRQUNsQixhQUFhO1FBQ2IsYUFBYTtRQUNiLHlCQUF5QjtRQUN6QixzQkFBc0I7UUFDdEIsMEJBQTBCO1FBQzFCLGtCQUFrQjtRQUNsQixtRkFBbUY7UUFDbkYsd0JBQXdCO0tBQ3pCLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLENBQUUsV0FBVyxDQUFFO1FBQ3hCLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFDTCxtRUFBbUU7a0JBQ2pFLHlEQUF5RDtrQkFDekQsZ0VBQWdFO2tCQUNoRSw0REFBNEQ7a0JBQzVELCtEQUErRDtrQkFDL0QsbUVBQW1FO2tCQUNuRSw2REFBNkQ7a0JBQzdELDJEQUEyRDtrQkFDM0QsZ0VBQWdFO2tCQUNoRSxTQUFTO1lBQ2IsT0FBTyxFQUNMLGtFQUFrRTtZQUNwRSxRQUFRLEVBQ04sa0VBQWtFO2tCQUNoRSxpQ0FBaUM7a0JBQ2pDLHlEQUF5RDtrQkFDekQsMEJBQTBCO2tCQUMxQiw2REFBNkQ7a0JBQzdELHNFQUFzRTtrQkFDdEUseUJBQXlCO1NBQzlCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLElBQUksQ0FBQyxhQUFhO1lBQ2xCO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FDakIsSUFBSSxFQUNKLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxFQUNsQyxJQUFJLENBQ0w7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsY0FBYzthQUN0QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixLQUFLLEVBQ0gsOERBQThEO2FBQ2pFO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUNqQixJQUFJLEVBQ0osS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEVBQ2pDLElBQUksQ0FDTDthQUNGO1lBQ0Q7Z0JBQ0UsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLHFCQUFxQjtvQkFDMUIsTUFBTTtpQkFDUDthQUNGO1lBQ0QsR0FBRyxRQUFRO1NBQ1o7UUFDRCxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQXBwbGVTY3JpcHRcbkF1dGhvcnM6IE5hdGhhbiBHcmlnZyA8bmF0aGFuQG5hdGhhbmFteS5vcmc+LCBEci4gRHJhbmcgPGRyZHJhbmdAZ21haWwuY29tPlxuQ2F0ZWdvcnk6IHNjcmlwdGluZ1xuV2Vic2l0ZTogaHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL2xpYnJhcnkvYXJjaGl2ZS9kb2N1bWVudGF0aW9uL0FwcGxlU2NyaXB0L0NvbmNlcHR1YWwvQXBwbGVTY3JpcHRMYW5nR3VpZGUvaW50cm9kdWN0aW9uL0FTTFJfaW50cm8uaHRtbFxuQXVkaXQ6IDIwMjBcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBhcHBsZXNjcmlwdChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgU1RSSU5HID0gaGxqcy5pbmhlcml0KFxuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHsgaWxsZWdhbDogbnVsbCB9KTtcbiAgY29uc3QgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46IC9cXCgvLFxuICAgIGVuZDogL1xcKS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgICdzZWxmJyxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIFNUUklOR1xuICAgIF1cbiAgfTtcbiAgY29uc3QgQ09NTUVOVF9NT0RFXzEgPSBobGpzLkNPTU1FTlQoLy0tLywgLyQvKTtcbiAgY29uc3QgQ09NTUVOVF9NT0RFXzIgPSBobGpzLkNPTU1FTlQoXG4gICAgL1xcKFxcKi8sXG4gICAgL1xcKlxcKS8sXG4gICAgeyBjb250YWluczogW1xuICAgICAgJ3NlbGYnLCAvLyBhbGxvdyBuZXN0aW5nXG4gICAgICBDT01NRU5UX01PREVfMVxuICAgIF0gfVxuICApO1xuICBjb25zdCBDT01NRU5UUyA9IFtcbiAgICBDT01NRU5UX01PREVfMSxcbiAgICBDT01NRU5UX01PREVfMixcbiAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFXG4gIF07XG5cbiAgY29uc3QgS0VZV09SRF9QQVRURVJOUyA9IFtcbiAgICAvYXBhcnQgZnJvbS8sXG4gICAgL2FzaWRlIGZyb20vLFxuICAgIC9pbnN0ZWFkIG9mLyxcbiAgICAvb3V0IG9mLyxcbiAgICAvZ3JlYXRlciB0aGFuLyxcbiAgICAvaXNuJ3R8KGRvZXNuJ3R8ZG9lcyBub3QpIChlcXVhbHxjb21lIGJlZm9yZXxjb21lIGFmdGVyfGNvbnRhaW4pLyxcbiAgICAvKGdyZWF0ZXJ8bGVzcykgdGhhbiggb3IgZXF1YWwpPy8sXG4gICAgLyhzdGFydHM/fGVuZHN8YmVnaW5zPykgd2l0aC8sXG4gICAgL2NvbnRhaW5lZCBieS8sXG4gICAgL2NvbWVzIChiZWZvcmV8YWZ0ZXIpLyxcbiAgICAvYSAocmVmfHJlZmVyZW5jZSkvLFxuICAgIC9QT1NJWCAoZmlsZXxwYXRoKS8sXG4gICAgLyhkYXRlfHRpbWUpIHN0cmluZy8sXG4gICAgL3F1b3RlZCBmb3JtL1xuICBdO1xuXG4gIGNvbnN0IEJVSUxUX0lOX1BBVFRFUk5TID0gW1xuICAgIC9jbGlwYm9hcmQgaW5mby8sXG4gICAgL3RoZSBjbGlwYm9hcmQvLFxuICAgIC9pbmZvIGZvci8sXG4gICAgL2xpc3QgKGRpc2tzfGZvbGRlcikvLFxuICAgIC9tb3VudCB2b2x1bWUvLFxuICAgIC9wYXRoIHRvLyxcbiAgICAvKGNsb3NlfG9wZW4gZm9yKSBhY2Nlc3MvLFxuICAgIC8oZ2V0fHNldCkgZW9mLyxcbiAgICAvY3VycmVudCBkYXRlLyxcbiAgICAvZG8gc2hlbGwgc2NyaXB0LyxcbiAgICAvZ2V0IHZvbHVtZSBzZXR0aW5ncy8sXG4gICAgL3JhbmRvbSBudW1iZXIvLFxuICAgIC9zZXQgdm9sdW1lLyxcbiAgICAvc3lzdGVtIGF0dHJpYnV0ZS8sXG4gICAgL3N5c3RlbSBpbmZvLyxcbiAgICAvdGltZSB0byBHTVQvLFxuICAgIC8obG9hZHxydW58c3RvcmUpIHNjcmlwdC8sXG4gICAgL3NjcmlwdGluZyBjb21wb25lbnRzLyxcbiAgICAvQVNDSUkgKGNoYXJhY3RlcnxudW1iZXIpLyxcbiAgICAvbG9jYWxpemVkIHN0cmluZy8sXG4gICAgL2Nob29zZSAoYXBwbGljYXRpb258Y29sb3J8ZmlsZXxmaWxlIG5hbWV8Zm9sZGVyfGZyb20gbGlzdHxyZW1vdGUgYXBwbGljYXRpb258VVJMKS8sXG4gICAgL2Rpc3BsYXkgKGFsZXJ0fGRpYWxvZykvXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQXBwbGVTY3JpcHQnLFxuICAgIGFsaWFzZXM6IFsgJ29zYXNjcmlwdCcgXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2Fib3V0IGFib3ZlIGFmdGVyIGFnYWluc3QgYW5kIGFyb3VuZCBhcyBhdCBiYWNrIGJlZm9yZSBiZWdpbm5pbmcgJ1xuICAgICAgICArICdiZWhpbmQgYmVsb3cgYmVuZWF0aCBiZXNpZGUgYmV0d2VlbiBidXQgYnkgY29uc2lkZXJpbmcgJ1xuICAgICAgICArICdjb250YWluIGNvbnRhaW5zIGNvbnRpbnVlIGNvcHkgZGl2IGRvZXMgZWlnaHRoIGVsc2UgZW5kIGVxdWFsICdcbiAgICAgICAgKyAnZXF1YWxzIGVycm9yIGV2ZXJ5IGV4aXQgZmlmdGggZmlyc3QgZm9yIGZvdXJ0aCBmcm9tIGZyb250ICdcbiAgICAgICAgKyAnZ2V0IGdpdmVuIGdsb2JhbCBpZiBpZ25vcmluZyBpbiBpbnRvIGlzIGl0IGl0cyBsYXN0IGxvY2FsIG1lICdcbiAgICAgICAgKyAnbWlkZGxlIG1vZCBteSBuaW50aCBub3Qgb2Ygb24gb250byBvciBvdmVyIHByb3AgcHJvcGVydHkgcHV0IHJlZiAnXG4gICAgICAgICsgJ3JlZmVyZW5jZSByZXBlYXQgcmV0dXJuaW5nIHNjcmlwdCBzZWNvbmQgc2V0IHNldmVudGggc2luY2UgJ1xuICAgICAgICArICdzaXh0aCBzb21lIHRlbGwgdGVudGggdGhhdCB0aGV8MCB0aGVuIHRoaXJkIHRocm91Z2ggdGhydSAnXG4gICAgICAgICsgJ3RpbWVvdXQgdGltZXMgdG8gdHJhbnNhY3Rpb24gdHJ5IHVudGlsIHdoZXJlIHdoaWxlIHdob3NlIHdpdGggJ1xuICAgICAgICArICd3aXRob3V0JyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdBcHBsZVNjcmlwdCBmYWxzZSBsaW5lZmVlZCByZXR1cm4gcGkgcXVvdGUgcmVzdWx0IHNwYWNlIHRhYiB0cnVlJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnYWxpYXMgYXBwbGljYXRpb24gYm9vbGVhbiBjbGFzcyBjb25zdGFudCBkYXRlIGZpbGUgaW50ZWdlciBsaXN0ICdcbiAgICAgICAgKyAnbnVtYmVyIHJlYWwgcmVjb3JkIHN0cmluZyB0ZXh0ICdcbiAgICAgICAgKyAnYWN0aXZhdGUgYmVlcCBjb3VudCBkZWxheSBsYXVuY2ggbG9nIG9mZnNldCByZWFkIHJvdW5kICdcbiAgICAgICAgKyAncnVuIHNheSBzdW1tYXJpemUgd3JpdGUgJ1xuICAgICAgICArICdjaGFyYWN0ZXIgY2hhcmFjdGVycyBjb250ZW50cyBkYXkgZnJvbnRtb3N0IGlkIGl0ZW0gbGVuZ3RoICdcbiAgICAgICAgKyAnbW9udGggbmFtZXwwIHBhcmFncmFwaCBwYXJhZ3JhcGhzIHJlc3QgcmV2ZXJzZSBydW5uaW5nIHRpbWUgdmVyc2lvbiAnXG4gICAgICAgICsgJ3dlZWtkYXkgd29yZCB3b3JkcyB5ZWFyJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFNUUklORyxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVpbHRfaW4nLFxuICAgICAgICBiZWdpbjogcmVnZXguY29uY2F0KFxuICAgICAgICAgIC9cXGIvLFxuICAgICAgICAgIHJlZ2V4LmVpdGhlciguLi5CVUlMVF9JTl9QQVRURVJOUyksXG4gICAgICAgICAgL1xcYi9cbiAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVpbHRfaW4nLFxuICAgICAgICBiZWdpbjogL15cXHMqcmV0dXJuXFxiL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgIC9cXGIodGV4dCBpdGVtIGRlbGltaXRlcnN8Y3VycmVudCBhcHBsaWNhdGlvbnxtaXNzaW5nIHZhbHVlKVxcYi9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjogcmVnZXguY29uY2F0KFxuICAgICAgICAgIC9cXGIvLFxuICAgICAgICAgIHJlZ2V4LmVpdGhlciguLi5LRVlXT1JEX1BBVFRFUk5TKSxcbiAgICAgICAgICAvXFxiL1xuICAgICAgICApXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnb24nLFxuICAgICAgICBpbGxlZ2FsOiAvWyR7PTtcXG5dLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERSxcbiAgICAgICAgICBQQVJBTVNcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC4uLkNPTU1FTlRTXG4gICAgXSxcbiAgICBpbGxlZ2FsOiAvXFwvXFwvfC0+fD0+fFxcW1xcWy9cbiAgfTtcbn1cblxuZXhwb3J0IHsgYXBwbGVzY3JpcHQgYXMgZGVmYXVsdCB9O1xuIl19