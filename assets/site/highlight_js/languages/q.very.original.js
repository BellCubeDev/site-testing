function q(hljs) {
    const KEYWORDS = {
        $pattern: /(`?)[A-Za-z0-9_]+\b/,
        keyword: 'do while select delete by update from',
        literal: '0b 1b',
        built_in: 'neg not null string reciprocal floor ceiling signum mod xbar xlog and or each scan over prior mmu lsq inv md5 ltime gtime count first var dev med cov cor all any rand sums prds mins maxs fills deltas ratios avgs differ prev next rank reverse iasc idesc asc desc msum mcount mavg mdev xrank mmin mmax xprev rotate distinct group where flip type key til get value attr cut set upsert raze union inter except cross sv vs sublist enlist read0 read1 hopen hclose hdel hsym hcount peach system ltrim rtrim trim lower upper ssr view tables views cols xcols keys xkey xcol xasc xdesc fkeys meta lj aj aj0 ij pj asof uj ww wj wj1 fby xgroup ungroup ej save load rsave rload show csv parse eval min max avg wavg wsum sin cos tan sum',
        type: '`float `double int `timestamp `timespan `datetime `time `boolean `symbol `char `byte `short `long `real `month `date `minute `second `guid'
    };
    return {
        name: 'Q',
        aliases: [
            'k',
            'kdb'
        ],
        keywords: KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE
        ]
    };
}
export { q as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3EuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxDQUFDLENBQUMsSUFBSTtJQUNiLE1BQU0sUUFBUSxHQUFHO1FBQ2YsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixPQUFPLEVBQ0wsdUNBQXVDO1FBQ3pDLE9BQU8sRUFDTCxPQUFPO1FBQ1QsUUFBUSxFQUNOLG90QkFBb3RCO1FBQ3R0QixJQUFJLEVBQ0YsNElBQTRJO0tBQy9JLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLEdBQUc7UUFDVCxPQUFPLEVBQUU7WUFDUCxHQUFHO1lBQ0gsS0FBSztTQUNOO1FBQ0QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxhQUFhO1NBQ25CO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBRXG5EZXNjcmlwdGlvbjogUSBpcyBhIHZlY3Rvci1iYXNlZCBmdW5jdGlvbmFsIHBhcmFkaWdtIHByb2dyYW1taW5nIGxhbmd1YWdlIGJ1aWx0IGludG8gdGhlIGtkYisgZGF0YWJhc2UuXG4gICAgICAgICAgICAgKEsvUS9LZGIrIGZyb20gS3ggU3lzdGVtcylcbkF1dGhvcjogU2VyZ2V5IFZpZHl1ayA8c3ZpZHl1a0BnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwczovL2t4LmNvbS9jb25uZWN0LXdpdGgtdXMvZGV2ZWxvcGVycy9cbiovXG5cbmZ1bmN0aW9uIHEoaGxqcykge1xuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICAkcGF0dGVybjogLyhgPylbQS1aYS16MC05X10rXFxiLyxcbiAgICBrZXl3b3JkOlxuICAgICAgJ2RvIHdoaWxlIHNlbGVjdCBkZWxldGUgYnkgdXBkYXRlIGZyb20nLFxuICAgIGxpdGVyYWw6XG4gICAgICAnMGIgMWInLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ25lZyBub3QgbnVsbCBzdHJpbmcgcmVjaXByb2NhbCBmbG9vciBjZWlsaW5nIHNpZ251bSBtb2QgeGJhciB4bG9nIGFuZCBvciBlYWNoIHNjYW4gb3ZlciBwcmlvciBtbXUgbHNxIGludiBtZDUgbHRpbWUgZ3RpbWUgY291bnQgZmlyc3QgdmFyIGRldiBtZWQgY292IGNvciBhbGwgYW55IHJhbmQgc3VtcyBwcmRzIG1pbnMgbWF4cyBmaWxscyBkZWx0YXMgcmF0aW9zIGF2Z3MgZGlmZmVyIHByZXYgbmV4dCByYW5rIHJldmVyc2UgaWFzYyBpZGVzYyBhc2MgZGVzYyBtc3VtIG1jb3VudCBtYXZnIG1kZXYgeHJhbmsgbW1pbiBtbWF4IHhwcmV2IHJvdGF0ZSBkaXN0aW5jdCBncm91cCB3aGVyZSBmbGlwIHR5cGUga2V5IHRpbCBnZXQgdmFsdWUgYXR0ciBjdXQgc2V0IHVwc2VydCByYXplIHVuaW9uIGludGVyIGV4Y2VwdCBjcm9zcyBzdiB2cyBzdWJsaXN0IGVubGlzdCByZWFkMCByZWFkMSBob3BlbiBoY2xvc2UgaGRlbCBoc3ltIGhjb3VudCBwZWFjaCBzeXN0ZW0gbHRyaW0gcnRyaW0gdHJpbSBsb3dlciB1cHBlciBzc3IgdmlldyB0YWJsZXMgdmlld3MgY29scyB4Y29scyBrZXlzIHhrZXkgeGNvbCB4YXNjIHhkZXNjIGZrZXlzIG1ldGEgbGogYWogYWowIGlqIHBqIGFzb2YgdWogd3cgd2ogd2oxIGZieSB4Z3JvdXAgdW5ncm91cCBlaiBzYXZlIGxvYWQgcnNhdmUgcmxvYWQgc2hvdyBjc3YgcGFyc2UgZXZhbCBtaW4gbWF4IGF2ZyB3YXZnIHdzdW0gc2luIGNvcyB0YW4gc3VtJyxcbiAgICB0eXBlOlxuICAgICAgJ2BmbG9hdCBgZG91YmxlIGludCBgdGltZXN0YW1wIGB0aW1lc3BhbiBgZGF0ZXRpbWUgYHRpbWUgYGJvb2xlYW4gYHN5bWJvbCBgY2hhciBgYnl0ZSBgc2hvcnQgYGxvbmcgYHJlYWwgYG1vbnRoIGBkYXRlIGBtaW51dGUgYHNlY29uZCBgZ3VpZCdcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdRJyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAnaycsXG4gICAgICAna2RiJ1xuICAgIF0sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBxIGFzIGRlZmF1bHQgfTtcbiJdfQ==