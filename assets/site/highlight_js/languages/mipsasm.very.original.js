function mipsasm(hljs) {
    return {
        name: 'MIPS Assembly',
        case_insensitive: true,
        aliases: ['mips'],
        keywords: {
            $pattern: '\\.?' + hljs.IDENT_RE,
            meta: '.2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .ltorg ',
            built_in: '$0 $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 '
                + '$16 $17 $18 $19 $20 $21 $22 $23 $24 $25 $26 $27 $28 $29 $30 $31 '
                + 'zero at v0 v1 a0 a1 a2 a3 a4 a5 a6 a7 '
                + 't0 t1 t2 t3 t4 t5 t6 t7 t8 t9 s0 s1 s2 s3 s4 s5 s6 s7 s8 '
                + 'k0 k1 gp sp fp ra '
                + '$f0 $f1 $f2 $f2 $f4 $f5 $f6 $f7 $f8 $f9 $f10 $f11 $f12 $f13 $f14 $f15 '
                + '$f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 '
                + 'Context Random EntryLo0 EntryLo1 Context PageMask Wired EntryHi '
                + 'HWREna BadVAddr Count Compare SR IntCtl SRSCtl SRSMap Cause EPC PRId '
                + 'EBase Config Config1 Config2 Config3 LLAddr Debug DEPC DESAVE CacheErr '
                + 'ECC ErrorEPC TagLo DataLo TagHi DataHi WatchLo WatchHi PerfCtl PerfCnt '
        },
        contains: [
            {
                className: 'keyword',
                begin: '\\b('
                    + 'addi?u?|andi?|b(al)?|beql?|bgez(al)?l?|bgtzl?|blezl?|bltz(al)?l?|'
                    + 'bnel?|cl[oz]|divu?|ext|ins|j(al)?|jalr(\\.hb)?|jr(\\.hb)?|lbu?|lhu?|'
                    + 'll|lui|lw[lr]?|maddu?|mfhi|mflo|movn|movz|move|msubu?|mthi|mtlo|mul|'
                    + 'multu?|nop|nor|ori?|rotrv?|sb|sc|se[bh]|sh|sllv?|slti?u?|srav?|'
                    + 'srlv?|subu?|sw[lr]?|xori?|wsbh|'
                    + 'abs\\.[sd]|add\\.[sd]|alnv.ps|bc1[ft]l?|'
                    + 'c\\.(s?f|un|u?eq|[ou]lt|[ou]le|ngle?|seq|l[et]|ng[et])\\.[sd]|'
                    + '(ceil|floor|round|trunc)\\.[lw]\\.[sd]|cfc1|cvt\\.d\\.[lsw]|'
                    + 'cvt\\.l\\.[dsw]|cvt\\.ps\\.s|cvt\\.s\\.[dlw]|cvt\\.s\\.p[lu]|cvt\\.w\\.[dls]|'
                    + 'div\\.[ds]|ldx?c1|luxc1|lwx?c1|madd\\.[sd]|mfc1|mov[fntz]?\\.[ds]|'
                    + 'msub\\.[sd]|mth?c1|mul\\.[ds]|neg\\.[ds]|nmadd\\.[ds]|nmsub\\.[ds]|'
                    + 'p[lu][lu]\\.ps|recip\\.fmt|r?sqrt\\.[ds]|sdx?c1|sub\\.[ds]|suxc1|'
                    + 'swx?c1|'
                    + 'break|cache|d?eret|[de]i|ehb|mfc0|mtc0|pause|prefx?|rdhwr|'
                    + 'rdpgpr|sdbbp|ssnop|synci?|syscall|teqi?|tgei?u?|tlb(p|r|w[ir])|'
                    + 'tlti?u?|tnei?|wait|wrpgpr'
                    + ')',
                end: '\\s'
            },
            hljs.COMMENT('[;#](?!\\s*$)', '$'),
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            {
                className: 'string',
                begin: '\'',
                end: '[^\\\\]\'',
                relevance: 0
            },
            {
                className: 'title',
                begin: '\\|',
                end: '\\|',
                illegal: '\\n',
                relevance: 0
            },
            {
                className: 'number',
                variants: [
                    {
                        begin: '0x[0-9a-f]+'
                    },
                    {
                        begin: '\\b-?\\d+'
                    }
                ],
                relevance: 0
            },
            {
                className: 'symbol',
                variants: [
                    {
                        begin: '^\\s*[a-z_\\.\\$][a-z0-9_\\.\\$]+:'
                    },
                    {
                        begin: '^\\s*[0-9]+:'
                    },
                    {
                        begin: '[0-9]+[bf]'
                    }
                ],
                relevance: 0
            }
        ],
        illegal: /\//
    };
}
export { mipsasm as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlwc2FzbS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL21pcHNhc20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUVuQixPQUFPO1FBQ0wsSUFBSSxFQUFFLGVBQWU7UUFDckIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixPQUFPLEVBQUUsQ0FBRSxNQUFNLENBQUU7UUFDbkIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUTtZQUNoQyxJQUFJLEVBRUYsNE9BQTRPO1lBQzlPLFFBQVEsRUFDTix3REFBd0Q7a0JBQ3RELGtFQUFrRTtrQkFDbEUsd0NBQXdDO2tCQUN4QywyREFBMkQ7a0JBQzNELG9CQUFvQjtrQkFDcEIsd0VBQXdFO2tCQUN4RSxrRkFBa0Y7a0JBQ2xGLGtFQUFrRTtrQkFDbEUsdUVBQXVFO2tCQUN2RSx5RUFBeUU7a0JBQ3pFLHlFQUF5RTtTQUM5RTtRQUNELFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixLQUFLLEVBQUUsTUFBTTtzQkFFUCxtRUFBbUU7c0JBQ25FLHNFQUFzRTtzQkFDdEUsc0VBQXNFO3NCQUN0RSxpRUFBaUU7c0JBQ2pFLGlDQUFpQztzQkFFakMsMENBQTBDO3NCQUMxQyxnRUFBZ0U7c0JBQ2hFLDhEQUE4RDtzQkFDOUQsK0VBQStFO3NCQUMvRSxvRUFBb0U7c0JBQ3BFLHFFQUFxRTtzQkFDckUsbUVBQW1FO3NCQUNuRSxTQUFTO3NCQUVULDREQUE0RDtzQkFDNUQsaUVBQWlFO3NCQUNqRSwyQkFBMkI7c0JBQy9CLEdBQUc7Z0JBQ0wsR0FBRyxFQUFFLEtBQUs7YUFDWDtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQztZQUNsQyxJQUFJLENBQUMsb0JBQW9CO1lBQ3pCLElBQUksQ0FBQyxpQkFBaUI7WUFDdEI7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxJQUFJO2dCQUNYLEdBQUcsRUFBRSxXQUFXO2dCQUNoQixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLEtBQUssRUFBRSxLQUFLO2dCQUNaLEdBQUcsRUFBRSxLQUFLO2dCQUNWLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxhQUFhO3FCQUFFO29CQUN4Qjt3QkFDRSxLQUFLLEVBQUUsV0FBVztxQkFBRTtpQkFDdkI7Z0JBQ0QsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLG9DQUFvQztxQkFBRTtvQkFDL0M7d0JBQ0UsS0FBSyxFQUFFLGNBQWM7cUJBQUU7b0JBQ3pCO3dCQUNFLEtBQUssRUFBRSxZQUFZO3FCQUFFO2lCQUN4QjtnQkFDRCxTQUFTLEVBQUUsQ0FBQzthQUNiO1NBQ0Y7UUFFRCxPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogTUlQUyBBc3NlbWJseVxuQXV0aG9yOiBOZWJ1bGVvbiBGdW1pa2EgPG5lYnVsZW9uLmZ1bWlrYUBnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogTUlQUyBBc3NlbWJseSAodXAgdG8gTUlQUzMyUjIpXG5XZWJzaXRlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVBTX2FyY2hpdGVjdHVyZVxuQ2F0ZWdvcnk6IGFzc2VtYmxlclxuKi9cblxuZnVuY3Rpb24gbWlwc2FzbShobGpzKSB7XG4gIC8vIGxvY2FsIGxhYmVsczogJT9bRkJdP1tBVF0/XFxkezEsMn1cXHcrXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ01JUFMgQXNzZW1ibHknLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgYWxpYXNlczogWyAnbWlwcycgXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46ICdcXFxcLj8nICsgaGxqcy5JREVOVF9SRSxcbiAgICAgIG1ldGE6XG4gICAgICAgIC8vIEdOVSBwcmVwcm9jc1xuICAgICAgICAnLjJieXRlIC40Ynl0ZSAuYWxpZ24gLmFzY2lpIC5hc2NpeiAuYmFsaWduIC5ieXRlIC5jb2RlIC5kYXRhIC5lbHNlIC5lbmQgLmVuZGlmIC5lbmRtIC5lbmRyIC5lcXUgLmVyciAuZXhpdG0gLmV4dGVybiAuZ2xvYmFsIC5od29yZCAuaWYgLmlmZGVmIC5pZm5kZWYgLmluY2x1ZGUgLmlycCAubG9uZyAubWFjcm8gLnJlcHQgLnJlcSAuc2VjdGlvbiAuc2V0IC5za2lwIC5zcGFjZSAudGV4dCAud29yZCAubHRvcmcgJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnJDAgJDEgJDIgJDMgJDQgJDUgJDYgJDcgJDggJDkgJDEwICQxMSAkMTIgJDEzICQxNCAkMTUgJyAvLyBpbnRlZ2VyIHJlZ2lzdGVyc1xuICAgICAgICArICckMTYgJDE3ICQxOCAkMTkgJDIwICQyMSAkMjIgJDIzICQyNCAkMjUgJDI2ICQyNyAkMjggJDI5ICQzMCAkMzEgJyAvLyBpbnRlZ2VyIHJlZ2lzdGVyc1xuICAgICAgICArICd6ZXJvIGF0IHYwIHYxIGEwIGExIGEyIGEzIGE0IGE1IGE2IGE3ICcgLy8gaW50ZWdlciByZWdpc3RlciBhbGlhc2VzXG4gICAgICAgICsgJ3QwIHQxIHQyIHQzIHQ0IHQ1IHQ2IHQ3IHQ4IHQ5IHMwIHMxIHMyIHMzIHM0IHM1IHM2IHM3IHM4ICcgLy8gaW50ZWdlciByZWdpc3RlciBhbGlhc2VzXG4gICAgICAgICsgJ2swIGsxIGdwIHNwIGZwIHJhICcgLy8gaW50ZWdlciByZWdpc3RlciBhbGlhc2VzXG4gICAgICAgICsgJyRmMCAkZjEgJGYyICRmMiAkZjQgJGY1ICRmNiAkZjcgJGY4ICRmOSAkZjEwICRmMTEgJGYxMiAkZjEzICRmMTQgJGYxNSAnIC8vIGZsb2F0aW5nLXBvaW50IHJlZ2lzdGVyc1xuICAgICAgICArICckZjE2ICRmMTcgJGYxOCAkZjE5ICRmMjAgJGYyMSAkZjIyICRmMjMgJGYyNCAkZjI1ICRmMjYgJGYyNyAkZjI4ICRmMjkgJGYzMCAkZjMxICcgLy8gZmxvYXRpbmctcG9pbnQgcmVnaXN0ZXJzXG4gICAgICAgICsgJ0NvbnRleHQgUmFuZG9tIEVudHJ5TG8wIEVudHJ5TG8xIENvbnRleHQgUGFnZU1hc2sgV2lyZWQgRW50cnlIaSAnIC8vIENvcHJvY2Vzc29yIDAgcmVnaXN0ZXJzXG4gICAgICAgICsgJ0hXUkVuYSBCYWRWQWRkciBDb3VudCBDb21wYXJlIFNSIEludEN0bCBTUlNDdGwgU1JTTWFwIENhdXNlIEVQQyBQUklkICcgLy8gQ29wcm9jZXNzb3IgMCByZWdpc3RlcnNcbiAgICAgICAgKyAnRUJhc2UgQ29uZmlnIENvbmZpZzEgQ29uZmlnMiBDb25maWczIExMQWRkciBEZWJ1ZyBERVBDIERFU0FWRSBDYWNoZUVyciAnIC8vIENvcHJvY2Vzc29yIDAgcmVnaXN0ZXJzXG4gICAgICAgICsgJ0VDQyBFcnJvckVQQyBUYWdMbyBEYXRhTG8gVGFnSGkgRGF0YUhpIFdhdGNoTG8gV2F0Y2hIaSBQZXJmQ3RsIFBlcmZDbnQgJyAvLyBDb3Byb2Nlc3NvciAwIHJlZ2lzdGVyc1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoJyAvLyBtbmVtb25pY3NcbiAgICAgICAgICAgIC8vIDMyLWJpdCBpbnRlZ2VyIGluc3RydWN0aW9uc1xuICAgICAgICAgICAgKyAnYWRkaT91P3xhbmRpP3xiKGFsKT98YmVxbD98YmdleihhbCk/bD98Ymd0emw/fGJsZXpsP3xibHR6KGFsKT9sP3wnXG4gICAgICAgICAgICArICdibmVsP3xjbFtvel18ZGl2dT98ZXh0fGluc3xqKGFsKT98amFscihcXFxcLmhiKT98anIoXFxcXC5oYik/fGxidT98bGh1P3wnXG4gICAgICAgICAgICArICdsbHxsdWl8bHdbbHJdP3xtYWRkdT98bWZoaXxtZmxvfG1vdm58bW92enxtb3ZlfG1zdWJ1P3xtdGhpfG10bG98bXVsfCdcbiAgICAgICAgICAgICsgJ211bHR1P3xub3B8bm9yfG9yaT98cm90cnY/fHNifHNjfHNlW2JoXXxzaHxzbGx2P3xzbHRpP3U/fHNyYXY/fCdcbiAgICAgICAgICAgICsgJ3NybHY/fHN1YnU/fHN3W2xyXT98eG9yaT98d3NiaHwnXG4gICAgICAgICAgICAvLyBmbG9hdGluZy1wb2ludCBpbnN0cnVjdGlvbnNcbiAgICAgICAgICAgICsgJ2Fic1xcXFwuW3NkXXxhZGRcXFxcLltzZF18YWxudi5wc3xiYzFbZnRdbD98J1xuICAgICAgICAgICAgKyAnY1xcXFwuKHM/Znx1bnx1P2VxfFtvdV1sdHxbb3VdbGV8bmdsZT98c2VxfGxbZXRdfG5nW2V0XSlcXFxcLltzZF18J1xuICAgICAgICAgICAgKyAnKGNlaWx8Zmxvb3J8cm91bmR8dHJ1bmMpXFxcXC5bbHddXFxcXC5bc2RdfGNmYzF8Y3Z0XFxcXC5kXFxcXC5bbHN3XXwnXG4gICAgICAgICAgICArICdjdnRcXFxcLmxcXFxcLltkc3ddfGN2dFxcXFwucHNcXFxcLnN8Y3Z0XFxcXC5zXFxcXC5bZGx3XXxjdnRcXFxcLnNcXFxcLnBbbHVdfGN2dFxcXFwud1xcXFwuW2Rsc118J1xuICAgICAgICAgICAgKyAnZGl2XFxcXC5bZHNdfGxkeD9jMXxsdXhjMXxsd3g/YzF8bWFkZFxcXFwuW3NkXXxtZmMxfG1vdltmbnR6XT9cXFxcLltkc118J1xuICAgICAgICAgICAgKyAnbXN1YlxcXFwuW3NkXXxtdGg/YzF8bXVsXFxcXC5bZHNdfG5lZ1xcXFwuW2RzXXxubWFkZFxcXFwuW2RzXXxubXN1YlxcXFwuW2RzXXwnXG4gICAgICAgICAgICArICdwW2x1XVtsdV1cXFxcLnBzfHJlY2lwXFxcXC5mbXR8cj9zcXJ0XFxcXC5bZHNdfHNkeD9jMXxzdWJcXFxcLltkc118c3V4YzF8J1xuICAgICAgICAgICAgKyAnc3d4P2MxfCdcbiAgICAgICAgICAgIC8vIHN5c3RlbSBjb250cm9sIGluc3RydWN0aW9uc1xuICAgICAgICAgICAgKyAnYnJlYWt8Y2FjaGV8ZD9lcmV0fFtkZV1pfGVoYnxtZmMwfG10YzB8cGF1c2V8cHJlZng/fHJkaHdyfCdcbiAgICAgICAgICAgICsgJ3JkcGdwcnxzZGJicHxzc25vcHxzeW5jaT98c3lzY2FsbHx0ZXFpP3x0Z2VpP3U/fHRsYihwfHJ8d1tpcl0pfCdcbiAgICAgICAgICAgICsgJ3RsdGk/dT98dG5laT98d2FpdHx3cnBncHInXG4gICAgICAgICsgJyknLFxuICAgICAgICBlbmQ6ICdcXFxccydcbiAgICAgIH0sXG4gICAgICAvLyBsaW5lcyBlbmRpbmcgd2l0aCA7IG9yICMgYXJlbid0IHJlYWxseSBjb21tZW50cywgcHJvYmFibHkgYXV0by1kZXRlY3QgZmFpbFxuICAgICAgaGxqcy5DT01NRU5UKCdbOyNdKD8hXFxcXHMqJCknLCAnJCcpLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJyxcbiAgICAgICAgZW5kOiAnW15cXFxcXFxcXF1cXCcnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcfCcsXG4gICAgICAgIGVuZDogJ1xcXFx8JyxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHsgLy8gaGV4XG4gICAgICAgICAgICBiZWdpbjogJzB4WzAtOWEtZl0rJyB9LFxuICAgICAgICAgIHsgLy8gYmFyZSBudW1iZXJcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXGItP1xcXFxkKycgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyAvLyBHTlUgTUlQUyBzeW50YXhcbiAgICAgICAgICAgIGJlZ2luOiAnXlxcXFxzKlthLXpfXFxcXC5cXFxcJF1bYS16MC05X1xcXFwuXFxcXCRdKzonIH0sXG4gICAgICAgICAgeyAvLyBudW1iZXJlZCBsb2NhbCBsYWJlbHNcbiAgICAgICAgICAgIGJlZ2luOiAnXlxcXFxzKlswLTldKzonIH0sXG4gICAgICAgICAgeyAvLyBudW1iZXIgbG9jYWwgbGFiZWwgcmVmZXJlbmNlIChiYWNrd2FyZHMsIGZvcndhcmRzKVxuICAgICAgICAgICAgYmVnaW46ICdbMC05XStbYmZdJyB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF0sXG4gICAgLy8gZm9yd2FyZCBzbGFzaGVzIGFyZSBub3QgYWxsb3dlZFxuICAgIGlsbGVnYWw6IC9cXC8vXG4gIH07XG59XG5cbmV4cG9ydCB7IG1pcHNhc20gYXMgZGVmYXVsdCB9O1xuIl19