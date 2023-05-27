function vbscriptHtml(hljs) {
    return {
        name: 'VBScript in HTML',
        subLanguage: 'xml',
        contains: [
            {
                begin: '<%',
                end: '%>',
                subLanguage: 'vbscript'
            }
        ]
    };
}
export { vbscriptHtml as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmJzY3JpcHQtaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3Zic2NyaXB0LWh0bWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxZQUFZLENBQUMsSUFBSTtJQUN4QixPQUFPO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxXQUFXLEVBQUUsVUFBVTthQUN4QjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsWUFBWSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBWQlNjcmlwdCBpbiBIVE1MXG5SZXF1aXJlczogeG1sLmpzLCB2YnNjcmlwdC5qc1xuQXV0aG9yOiBJdmFuIFNhZ2FsYWV2IDxtYW5pYWNAc29mdHdhcmVtYW5pYWNzLm9yZz5cbkRlc2NyaXB0aW9uOiBcIkJyaWRnZVwiIGxhbmd1YWdlIGRlZmluaW5nIGZyYWdtZW50cyBvZiBWQlNjcmlwdCBpbiBIVE1MIHdpdGhpbiA8JSAuLiAlPlxuV2Vic2l0ZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVkJTY3JpcHRcbkNhdGVnb3J5OiBzY3JpcHRpbmdcbiovXG5cbmZ1bmN0aW9uIHZic2NyaXB0SHRtbChobGpzKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1ZCU2NyaXB0IGluIEhUTUwnLFxuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogJzwlJyxcbiAgICAgICAgZW5kOiAnJT4nLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3Zic2NyaXB0J1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgdmJzY3JpcHRIdG1sIGFzIGRlZmF1bHQgfTtcbiJdfQ==