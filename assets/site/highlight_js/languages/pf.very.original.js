function pf(hljs) {
    const MACRO = {
        className: 'variable',
        begin: /\$[\w\d#@][\w\d_]*/,
        relevance: 0
    };
    const TABLE = {
        className: 'variable',
        begin: /<(?!\/)/,
        end: />/
    };
    return {
        name: 'Packet Filter config',
        aliases: ['pf.conf'],
        keywords: {
            $pattern: /[a-z0-9_<>-]+/,
            built_in: 'block match pass load anchor|5 antispoof|10 set table',
            keyword: 'in out log quick on rdomain inet inet6 proto from port os to route '
                + 'allow-opts divert-packet divert-reply divert-to flags group icmp-type '
                + 'icmp6-type label once probability recieved-on rtable prio queue '
                + 'tos tag tagged user keep fragment for os drop '
                + 'af-to|10 binat-to|10 nat-to|10 rdr-to|10 bitmask least-stats random round-robin '
                + 'source-hash static-port '
                + 'dup-to reply-to route-to '
                + 'parent bandwidth default min max qlimit '
                + 'block-policy debug fingerprints hostid limit loginterface optimization '
                + 'reassemble ruleset-optimization basic none profile skip state-defaults '
                + 'state-policy timeout '
                + 'const counters persist '
                + 'no modulate synproxy state|5 floating if-bound no-sync pflow|10 sloppy '
                + 'source-track global rule max-src-nodes max-src-states max-src-conn '
                + 'max-src-conn-rate overload flush '
                + 'scrub|5 max-mss min-ttl no-df|10 random-id',
            literal: 'all any no-route self urpf-failed egress|5 unknown'
        },
        contains: [
            hljs.HASH_COMMENT_MODE,
            hljs.NUMBER_MODE,
            hljs.QUOTE_STRING_MODE,
            MACRO,
            TABLE
        ]
    };
}
export { pf as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGYuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9wZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLEVBQUUsQ0FBQyxJQUFJO0lBQ2QsTUFBTSxLQUFLLEdBQUc7UUFDWixTQUFTLEVBQUUsVUFBVTtRQUNyQixLQUFLLEVBQUUsb0JBQW9CO1FBQzNCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHO1FBQ1osU0FBUyxFQUFFLFVBQVU7UUFDckIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsR0FBRyxFQUFFLEdBQUc7S0FDVCxDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsT0FBTyxFQUFFLENBQUUsU0FBUyxDQUFFO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFHTix1REFBdUQ7WUFDekQsT0FBTyxFQUNMLHFFQUFxRTtrQkFDbkUsd0VBQXdFO2tCQUN4RSxrRUFBa0U7a0JBQ2xFLGdEQUFnRDtrQkFDaEQsa0ZBQWtGO2tCQUNsRiwwQkFBMEI7a0JBQzFCLDJCQUEyQjtrQkFDM0IsMENBQTBDO2tCQUMxQyx5RUFBeUU7a0JBQ3pFLHlFQUF5RTtrQkFDekUsdUJBQXVCO2tCQUN2Qix5QkFBeUI7a0JBQ3pCLHlFQUF5RTtrQkFDekUscUVBQXFFO2tCQUNyRSxtQ0FBbUM7a0JBQ25DLDRDQUE0QztZQUNoRCxPQUFPLEVBQ0wsb0RBQW9EO1NBQ3ZEO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsV0FBVztZQUNoQixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLEtBQUs7WUFDTCxLQUFLO1NBQ047S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxFQUFFLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFBhY2tldCBGaWx0ZXIgY29uZmlnXG5EZXNjcmlwdGlvbjogcGYuY29uZiDigJQgcGFja2V0IGZpbHRlciBjb25maWd1cmF0aW9uIGZpbGUgKE9wZW5CU0QpXG5BdXRob3I6IFBldGVyIFBpd293YXJza2kgPG9sZGxhcHRvcDY1NEBhb2wuY29tPlxuV2Vic2l0ZTogaHR0cDovL21hbi5vcGVuYnNkLm9yZy9wZi5jb25mXG5DYXRlZ29yeTogY29uZmlnXG4qL1xuXG5mdW5jdGlvbiBwZihobGpzKSB7XG4gIGNvbnN0IE1BQ1JPID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogL1xcJFtcXHdcXGQjQF1bXFx3XFxkX10qLyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgVEFCTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAvPCg/IVxcLykvLFxuICAgIGVuZDogLz4vXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUGFja2V0IEZpbHRlciBjb25maWcnLFxuICAgIGFsaWFzZXM6IFsgJ3BmLmNvbmYnIF0sXG4gICAga2V5d29yZHM6IHtcbiAgICAgICRwYXR0ZXJuOiAvW2EtejAtOV88Pi1dKy8sXG4gICAgICBidWlsdF9pbjogLyogYmxvY2sgbWF0Y2ggcGFzcyBhcmUgXCJhY3Rpb25zXCIgaW4gcGYuY29uZig1KSwgdGhlIHJlc3QgYXJlXG4gICAgICAgICAgICAgICAgICogbGV4aWNhbGx5IHNpbWlsYXIgdG9wLWxldmVsIGNvbW1hbmRzLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAnYmxvY2sgbWF0Y2ggcGFzcyBsb2FkIGFuY2hvcnw1IGFudGlzcG9vZnwxMCBzZXQgdGFibGUnLFxuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2luIG91dCBsb2cgcXVpY2sgb24gcmRvbWFpbiBpbmV0IGluZXQ2IHByb3RvIGZyb20gcG9ydCBvcyB0byByb3V0ZSAnXG4gICAgICAgICsgJ2FsbG93LW9wdHMgZGl2ZXJ0LXBhY2tldCBkaXZlcnQtcmVwbHkgZGl2ZXJ0LXRvIGZsYWdzIGdyb3VwIGljbXAtdHlwZSAnXG4gICAgICAgICsgJ2ljbXA2LXR5cGUgbGFiZWwgb25jZSBwcm9iYWJpbGl0eSByZWNpZXZlZC1vbiBydGFibGUgcHJpbyBxdWV1ZSAnXG4gICAgICAgICsgJ3RvcyB0YWcgdGFnZ2VkIHVzZXIga2VlcCBmcmFnbWVudCBmb3Igb3MgZHJvcCAnXG4gICAgICAgICsgJ2FmLXRvfDEwIGJpbmF0LXRvfDEwIG5hdC10b3wxMCByZHItdG98MTAgYml0bWFzayBsZWFzdC1zdGF0cyByYW5kb20gcm91bmQtcm9iaW4gJ1xuICAgICAgICArICdzb3VyY2UtaGFzaCBzdGF0aWMtcG9ydCAnXG4gICAgICAgICsgJ2R1cC10byByZXBseS10byByb3V0ZS10byAnXG4gICAgICAgICsgJ3BhcmVudCBiYW5kd2lkdGggZGVmYXVsdCBtaW4gbWF4IHFsaW1pdCAnXG4gICAgICAgICsgJ2Jsb2NrLXBvbGljeSBkZWJ1ZyBmaW5nZXJwcmludHMgaG9zdGlkIGxpbWl0IGxvZ2ludGVyZmFjZSBvcHRpbWl6YXRpb24gJ1xuICAgICAgICArICdyZWFzc2VtYmxlIHJ1bGVzZXQtb3B0aW1pemF0aW9uIGJhc2ljIG5vbmUgcHJvZmlsZSBza2lwIHN0YXRlLWRlZmF1bHRzICdcbiAgICAgICAgKyAnc3RhdGUtcG9saWN5IHRpbWVvdXQgJ1xuICAgICAgICArICdjb25zdCBjb3VudGVycyBwZXJzaXN0ICdcbiAgICAgICAgKyAnbm8gbW9kdWxhdGUgc3lucHJveHkgc3RhdGV8NSBmbG9hdGluZyBpZi1ib3VuZCBuby1zeW5jIHBmbG93fDEwIHNsb3BweSAnXG4gICAgICAgICsgJ3NvdXJjZS10cmFjayBnbG9iYWwgcnVsZSBtYXgtc3JjLW5vZGVzIG1heC1zcmMtc3RhdGVzIG1heC1zcmMtY29ubiAnXG4gICAgICAgICsgJ21heC1zcmMtY29ubi1yYXRlIG92ZXJsb2FkIGZsdXNoICdcbiAgICAgICAgKyAnc2NydWJ8NSBtYXgtbXNzIG1pbi10dGwgbm8tZGZ8MTAgcmFuZG9tLWlkJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdhbGwgYW55IG5vLXJvdXRlIHNlbGYgdXJwZi1mYWlsZWQgZWdyZXNzfDUgdW5rbm93bidcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBNQUNSTyxcbiAgICAgIFRBQkxFXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBwZiBhcyBkZWZhdWx0IH07XG4iXX0=