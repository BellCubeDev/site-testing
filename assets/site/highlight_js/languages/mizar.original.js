function mizar(hljs) {
    return {
        name: 'Mizar',
        keywords: 'environ vocabularies notations constructors definitions '
            + 'registrations theorems schemes requirements begin end definition '
            + 'registration cluster existence pred func defpred deffunc theorem '
            + 'proof let take assume then thus hence ex for st holds consider '
            + 'reconsider such that and in provided of as from be being by means '
            + 'equals implies iff redefine define now not or attr is mode '
            + 'suppose per cases set thesis contradiction scheme reserve struct '
            + 'correctness compatibility coherence symmetry assymetry '
            + 'reflexivity irreflexivity connectedness uniqueness commutativity '
            + 'idempotence involutiveness projectivity',
        contains: [hljs.COMMENT('::', '$')]
    };
}
export { mizar as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl6YXIuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9taXphci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE9BQU87UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFDTiwwREFBMEQ7Y0FDeEQsbUVBQW1FO2NBQ25FLG1FQUFtRTtjQUNuRSxpRUFBaUU7Y0FDakUsb0VBQW9FO2NBQ3BFLDZEQUE2RDtjQUM3RCxtRUFBbUU7Y0FDbkUseURBQXlEO2NBQ3pELG1FQUFtRTtjQUNuRSx5Q0FBeUM7UUFDN0MsUUFBUSxFQUFFLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUU7S0FDdEMsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsS0FBSyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBNaXphclxuRGVzY3JpcHRpb246IFRoZSBNaXphciBMYW5ndWFnZSBpcyBhIGZvcm1hbCBsYW5ndWFnZSBkZXJpdmVkIGZyb20gdGhlIG1hdGhlbWF0aWNhbCB2ZXJuYWN1bGFyLlxuQXV0aG9yOiBLZWxsZXkgdmFuIEV2ZXJ0IDxrZWxsZXl2YW5ldmVydEBnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwOi8vbWl6YXIub3JnL2xhbmd1YWdlL1xuQ2F0ZWdvcnk6IHNjaWVudGlmaWNcbiovXG5cbmZ1bmN0aW9uIG1pemFyKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnTWl6YXInLFxuICAgIGtleXdvcmRzOlxuICAgICAgJ2Vudmlyb24gdm9jYWJ1bGFyaWVzIG5vdGF0aW9ucyBjb25zdHJ1Y3RvcnMgZGVmaW5pdGlvbnMgJ1xuICAgICAgKyAncmVnaXN0cmF0aW9ucyB0aGVvcmVtcyBzY2hlbWVzIHJlcXVpcmVtZW50cyBiZWdpbiBlbmQgZGVmaW5pdGlvbiAnXG4gICAgICArICdyZWdpc3RyYXRpb24gY2x1c3RlciBleGlzdGVuY2UgcHJlZCBmdW5jIGRlZnByZWQgZGVmZnVuYyB0aGVvcmVtICdcbiAgICAgICsgJ3Byb29mIGxldCB0YWtlIGFzc3VtZSB0aGVuIHRodXMgaGVuY2UgZXggZm9yIHN0IGhvbGRzIGNvbnNpZGVyICdcbiAgICAgICsgJ3JlY29uc2lkZXIgc3VjaCB0aGF0IGFuZCBpbiBwcm92aWRlZCBvZiBhcyBmcm9tIGJlIGJlaW5nIGJ5IG1lYW5zICdcbiAgICAgICsgJ2VxdWFscyBpbXBsaWVzIGlmZiByZWRlZmluZSBkZWZpbmUgbm93IG5vdCBvciBhdHRyIGlzIG1vZGUgJ1xuICAgICAgKyAnc3VwcG9zZSBwZXIgY2FzZXMgc2V0IHRoZXNpcyBjb250cmFkaWN0aW9uIHNjaGVtZSByZXNlcnZlIHN0cnVjdCAnXG4gICAgICArICdjb3JyZWN0bmVzcyBjb21wYXRpYmlsaXR5IGNvaGVyZW5jZSBzeW1tZXRyeSBhc3N5bWV0cnkgJ1xuICAgICAgKyAncmVmbGV4aXZpdHkgaXJyZWZsZXhpdml0eSBjb25uZWN0ZWRuZXNzIHVuaXF1ZW5lc3MgY29tbXV0YXRpdml0eSAnXG4gICAgICArICdpZGVtcG90ZW5jZSBpbnZvbHV0aXZlbmVzcyBwcm9qZWN0aXZpdHknLFxuICAgIGNvbnRhaW5zOiBbIGhsanMuQ09NTUVOVCgnOjonLCAnJCcpIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgbWl6YXIgYXMgZGVmYXVsdCB9O1xuIl19