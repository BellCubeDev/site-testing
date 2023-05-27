function mojolicious(hljs) {
    return {
        name: 'Mojolicious',
        subLanguage: 'xml',
        contains: [
            {
                className: 'meta',
                begin: '^__(END|DATA)__$'
            },
            {
                begin: "^\\s*%{1,2}={0,2}",
                end: '$',
                subLanguage: 'perl'
            },
            {
                begin: "<%{1,2}={0,2}",
                end: "={0,1}%>",
                subLanguage: 'perl',
                excludeBegin: true,
                excludeEnd: true
            }
        ]
    };
}
export { mojolicious as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qb2xpY2lvdXMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9tb2pvbGljaW91cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLFdBQVcsQ0FBQyxJQUFJO0lBQ3ZCLE9BQU87UUFDTCxJQUFJLEVBQUUsYUFBYTtRQUNuQixXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLGtCQUFrQjthQUMxQjtZQUVEO2dCQUNFLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFdBQVcsRUFBRSxNQUFNO2FBQ3BCO1lBRUQ7Z0JBQ0UsS0FBSyxFQUFFLGVBQWU7Z0JBQ3RCLEdBQUcsRUFBRSxVQUFVO2dCQUNmLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7YUFDakI7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogTW9qb2xpY2lvdXNcblJlcXVpcmVzOiB4bWwuanMsIHBlcmwuanNcbkF1dGhvcjogRG90YW4gRGltZXQgPGRvdGFuQGNvcmt5Lm5ldD5cbkRlc2NyaXB0aW9uOiBNb2pvbGljaW91cyAuZXAgKEVtYmVkZGVkIFBlcmwpIHRlbXBsYXRlc1xuV2Vic2l0ZTogaHR0cHM6Ly9tb2pvbGljaW91cy5vcmdcbkNhdGVnb3J5OiB0ZW1wbGF0ZVxuKi9cbmZ1bmN0aW9uIG1vam9saWNpb3VzKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnTW9qb2xpY2lvdXMnLFxuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgYmVnaW46ICdeX18oRU5EfERBVEEpX18kJ1xuICAgICAgfSxcbiAgICAgIC8vIG1vam9saWNpb3VzIGxpbmVcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IFwiXlxcXFxzKiV7MSwyfT17MCwyfVwiLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgc3ViTGFuZ3VhZ2U6ICdwZXJsJ1xuICAgICAgfSxcbiAgICAgIC8vIG1vam9saWNpb3VzIGJsb2NrXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBcIjwlezEsMn09ezAsMn1cIixcbiAgICAgICAgZW5kOiBcIj17MCwxfSU+XCIsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAncGVybCcsXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgbW9qb2xpY2lvdXMgYXMgZGVmYXVsdCB9O1xuIl19