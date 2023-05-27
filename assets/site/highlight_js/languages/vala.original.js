function vala(hljs) {
    return {
        name: 'Vala',
        keywords: {
            keyword: 'char uchar unichar int uint long ulong short ushort int8 int16 int32 int64 uint8 '
                + 'uint16 uint32 uint64 float double bool struct enum string void '
                + 'weak unowned owned '
                + 'async signal static abstract interface override virtual delegate '
                + 'if while do for foreach else switch case break default return try catch '
                + 'public private protected internal '
                + 'using new this get set const stdout stdin stderr var',
            built_in: 'DBus GLib CCode Gee Object Gtk Posix',
            literal: 'false true null'
        },
        contains: [
            {
                className: 'class',
                beginKeywords: 'class interface namespace',
                end: /\{/,
                excludeEnd: true,
                illegal: '[^,:\\n\\s\\.]',
                contains: [hljs.UNDERSCORE_TITLE_MODE]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'string',
                begin: '"""',
                end: '"""',
                relevance: 5
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: '^#',
                end: '$',
            }
        ]
    };
}
export { vala as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsYS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3ZhbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUU7WUFDUixPQUFPLEVBRUwsbUZBQW1GO2tCQUNqRixpRUFBaUU7a0JBRWpFLHFCQUFxQjtrQkFFckIsbUVBQW1FO2tCQUVuRSwwRUFBMEU7a0JBRTFFLG9DQUFvQztrQkFFcEMsc0RBQXNEO1lBQzFELFFBQVEsRUFDTixzQ0FBc0M7WUFDeEMsT0FBTyxFQUNMLGlCQUFpQjtTQUNwQjtRQUNELFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixhQUFhLEVBQUUsMkJBQTJCO2dCQUMxQyxHQUFHLEVBQUUsSUFBSTtnQkFDVCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsT0FBTyxFQUFFLGdCQUFnQjtnQkFDekIsUUFBUSxFQUFFLENBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFFO2FBQ3pDO1lBQ0QsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsb0JBQW9CO1lBQ3pCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsS0FBSztnQkFDWixHQUFHLEVBQUUsS0FBSztnQkFDVixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxhQUFhO1lBQ2xCO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsR0FBRzthQUNUO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFZhbGFcbkF1dGhvcjogQW50b25vIFZhc2lsamV2IDxhbnRvbm8udmFzaWxqZXZAZ21haWwuY29tPlxuRGVzY3JpcHRpb246IFZhbGEgaXMgYSBuZXcgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UgdGhhdCBhaW1zIHRvIGJyaW5nIG1vZGVybiBwcm9ncmFtbWluZyBsYW5ndWFnZSBmZWF0dXJlcyB0byBHTk9NRSBkZXZlbG9wZXJzIHdpdGhvdXQgaW1wb3NpbmcgYW55IGFkZGl0aW9uYWwgcnVudGltZSByZXF1aXJlbWVudHMgYW5kIHdpdGhvdXQgdXNpbmcgYSBkaWZmZXJlbnQgQUJJIGNvbXBhcmVkIHRvIGFwcGxpY2F0aW9ucyBhbmQgbGlicmFyaWVzIHdyaXR0ZW4gaW4gQy5cbldlYnNpdGU6IGh0dHBzOi8vd2lraS5nbm9tZS5vcmcvUHJvamVjdHMvVmFsYVxuKi9cblxuZnVuY3Rpb24gdmFsYShobGpzKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1ZhbGEnLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAvLyBWYWx1ZSB0eXBlc1xuICAgICAgICAnY2hhciB1Y2hhciB1bmljaGFyIGludCB1aW50IGxvbmcgdWxvbmcgc2hvcnQgdXNob3J0IGludDggaW50MTYgaW50MzIgaW50NjQgdWludDggJ1xuICAgICAgICArICd1aW50MTYgdWludDMyIHVpbnQ2NCBmbG9hdCBkb3VibGUgYm9vbCBzdHJ1Y3QgZW51bSBzdHJpbmcgdm9pZCAnXG4gICAgICAgIC8vIFJlZmVyZW5jZSB0eXBlc1xuICAgICAgICArICd3ZWFrIHVub3duZWQgb3duZWQgJ1xuICAgICAgICAvLyBNb2RpZmllcnNcbiAgICAgICAgKyAnYXN5bmMgc2lnbmFsIHN0YXRpYyBhYnN0cmFjdCBpbnRlcmZhY2Ugb3ZlcnJpZGUgdmlydHVhbCBkZWxlZ2F0ZSAnXG4gICAgICAgIC8vIENvbnRyb2wgU3RydWN0dXJlc1xuICAgICAgICArICdpZiB3aGlsZSBkbyBmb3IgZm9yZWFjaCBlbHNlIHN3aXRjaCBjYXNlIGJyZWFrIGRlZmF1bHQgcmV0dXJuIHRyeSBjYXRjaCAnXG4gICAgICAgIC8vIFZpc2liaWxpdHlcbiAgICAgICAgKyAncHVibGljIHByaXZhdGUgcHJvdGVjdGVkIGludGVybmFsICdcbiAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgKyAndXNpbmcgbmV3IHRoaXMgZ2V0IHNldCBjb25zdCBzdGRvdXQgc3RkaW4gc3RkZXJyIHZhcicsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ0RCdXMgR0xpYiBDQ29kZSBHZWUgT2JqZWN0IEd0ayBQb3NpeCcsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAnZmFsc2UgdHJ1ZSBudWxsJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnY2xhc3MgaW50ZXJmYWNlIG5hbWVzcGFjZScsXG4gICAgICAgIGVuZDogL1xcey8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6ICdbXiw6XFxcXG5cXFxcc1xcXFwuXScsXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiXCJcIicsXG4gICAgICAgIGVuZDogJ1wiXCJcIicsXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJ14jJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyB2YWxhIGFzIGRlZmF1bHQgfTtcbiJdfQ==