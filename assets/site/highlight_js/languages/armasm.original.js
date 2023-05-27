function armasm(hljs) {
    const COMMENT = { variants: [
            hljs.COMMENT('^[ \\t]*(?=#)', '$', {
                relevance: 0,
                excludeBegin: true
            }),
            hljs.COMMENT('[;@]', '$', { relevance: 0 }),
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ] };
    return {
        name: 'ARM Assembly',
        case_insensitive: true,
        aliases: ['arm'],
        keywords: {
            $pattern: '\\.?' + hljs.IDENT_RE,
            meta: '.2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .arm .thumb .code16 .code32 .force_thumb .thumb_func .ltorg '
                + 'ALIAS ALIGN ARM AREA ASSERT ATTR CN CODE CODE16 CODE32 COMMON CP DATA DCB DCD DCDU DCDO DCFD DCFDU DCI DCQ DCQU DCW DCWU DN ELIF ELSE END ENDFUNC ENDIF ENDP ENTRY EQU EXPORT EXPORTAS EXTERN FIELD FILL FUNCTION GBLA GBLL GBLS GET GLOBAL IF IMPORT INCBIN INCLUDE INFO KEEP LCLA LCLL LCLS LTORG MACRO MAP MEND MEXIT NOFP OPT PRESERVE8 PROC QN READONLY RELOC REQUIRE REQUIRE8 RLIST FN ROUT SETA SETL SETS SN SPACE SUBT THUMB THUMBX TTL WHILE WEND ',
            built_in: 'r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 '
                + 'pc lr sp ip sl sb fp '
                + 'a1 a2 a3 a4 v1 v2 v3 v4 v5 v6 v7 v8 f0 f1 f2 f3 f4 f5 f6 f7 '
                + 'p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 p14 p15 '
                + 'c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 '
                + 'q0 q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 '
                + 'cpsr_c cpsr_x cpsr_s cpsr_f cpsr_cx cpsr_cxs cpsr_xs cpsr_xsf cpsr_sf cpsr_cxsf '
                + 'spsr_c spsr_x spsr_s spsr_f spsr_cx spsr_cxs spsr_xs spsr_xsf spsr_sf spsr_cxsf '
                + 's0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12 s13 s14 s15 '
                + 's16 s17 s18 s19 s20 s21 s22 s23 s24 s25 s26 s27 s28 s29 s30 s31 '
                + 'd0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 '
                + 'd16 d17 d18 d19 d20 d21 d22 d23 d24 d25 d26 d27 d28 d29 d30 d31 '
                + '{PC} {VAR} {TRUE} {FALSE} {OPT} {CONFIG} {ENDIAN} {CODESIZE} {CPU} {FPU} {ARCHITECTURE} {PCSTOREOFFSET} {ARMASM_VERSION} {INTER} {ROPI} {RWPI} {SWST} {NOSWST} . @'
        },
        contains: [
            {
                className: 'keyword',
                begin: '\\b('
                    + 'adc|'
                    + '(qd?|sh?|u[qh]?)?add(8|16)?|usada?8|(q|sh?|u[qh]?)?(as|sa)x|'
                    + 'and|adrl?|sbc|rs[bc]|asr|b[lx]?|blx|bxj|cbn?z|tb[bh]|bic|'
                    + 'bfc|bfi|[su]bfx|bkpt|cdp2?|clz|clrex|cmp|cmn|cpsi[ed]|cps|'
                    + 'setend|dbg|dmb|dsb|eor|isb|it[te]{0,3}|lsl|lsr|ror|rrx|'
                    + 'ldm(([id][ab])|f[ds])?|ldr((s|ex)?[bhd])?|movt?|mvn|mra|mar|'
                    + 'mul|[us]mull|smul[bwt][bt]|smu[as]d|smmul|smmla|'
                    + 'mla|umlaal|smlal?([wbt][bt]|d)|mls|smlsl?[ds]|smc|svc|sev|'
                    + 'mia([bt]{2}|ph)?|mrr?c2?|mcrr2?|mrs|msr|orr|orn|pkh(tb|bt)|rbit|'
                    + 'rev(16|sh)?|sel|[su]sat(16)?|nop|pop|push|rfe([id][ab])?|'
                    + 'stm([id][ab])?|str(ex)?[bhd]?|(qd?)?sub|(sh?|q|u[qh]?)?sub(8|16)|'
                    + '[su]xt(a?h|a?b(16)?)|srs([id][ab])?|swpb?|swi|smi|tst|teq|'
                    + 'wfe|wfi|yield'
                    + ')'
                    + '(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|hs|lo)?'
                    + '[sptrx]?'
                    + '(?=\\s)'
            },
            COMMENT,
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
                        begin: '[#$=]?0x[0-9a-f]+'
                    },
                    {
                        begin: '[#$=]?0b[01]+'
                    },
                    {
                        begin: '[#$=]\\d+'
                    },
                    {
                        begin: '\\b\\d+'
                    }
                ],
                relevance: 0
            },
            {
                className: 'symbol',
                variants: [
                    {
                        begin: '^[ \\t]*[a-z_\\.\\$][a-z0-9_\\.\\$]+:'
                    },
                    {
                        begin: '^[a-z_\\.\\$][a-z0-9_\\.\\$]+'
                    },
                    {
                        begin: '[=#]\\w+'
                    }
                ],
                relevance: 0
            }
        ]
    };
}
export { armasm as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJtYXNtLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYXJtYXNtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFHbEIsTUFBTSxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO2dCQUNqQyxTQUFTLEVBQUUsQ0FBQztnQkFDWixZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxtQkFBbUI7WUFDeEIsSUFBSSxDQUFDLG9CQUFvQjtTQUMxQixFQUFFLENBQUM7SUFFSixPQUFPO1FBQ0wsSUFBSSxFQUFFLGNBQWM7UUFDcEIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixPQUFPLEVBQUUsQ0FBRSxLQUFLLENBQUU7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUTtZQUNoQyxJQUFJLEVBRUYsaVNBQWlTO2tCQUUvUiw2YkFBNmI7WUFDamMsUUFBUSxFQUNOLHdEQUF3RDtrQkFDdEQsdUJBQXVCO2tCQUN2Qiw4REFBOEQ7a0JBQzlELHdEQUF3RDtrQkFDeEQsd0RBQXdEO2tCQUN4RCx3REFBd0Q7a0JBR3hELGtGQUFrRjtrQkFDbEYsa0ZBQWtGO2tCQUdsRix3REFBd0Q7a0JBQ3hELGtFQUFrRTtrQkFDbEUsd0RBQXdEO2tCQUN4RCxrRUFBa0U7a0JBRWxFLG9LQUFvSztTQUN6SztRQUNELFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixLQUFLLEVBQUUsTUFBTTtzQkFDUCxNQUFNO3NCQUNOLDhEQUE4RDtzQkFDOUQsMkRBQTJEO3NCQUMzRCw0REFBNEQ7c0JBQzVELHlEQUF5RDtzQkFDekQsOERBQThEO3NCQUM5RCxrREFBa0Q7c0JBQ2xELDREQUE0RDtzQkFDNUQsa0VBQWtFO3NCQUNsRSwyREFBMkQ7c0JBQzNELG1FQUFtRTtzQkFDbkUsNERBQTREO3NCQUM1RCxlQUFlO3NCQUNuQixHQUFHO3NCQUNILHVEQUF1RDtzQkFDdkQsVUFBVTtzQkFDVixTQUFTO2FBQ1o7WUFDRCxPQUFPO1lBQ1AsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLFdBQVc7Z0JBQ2hCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsT0FBTztnQkFDbEIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLG1CQUFtQjtxQkFBRTtvQkFDOUI7d0JBQ0UsS0FBSyxFQUFFLGVBQWU7cUJBQUU7b0JBQzFCO3dCQUNFLEtBQUssRUFBRSxXQUFXO3FCQUFFO29CQUN0Qjt3QkFDRSxLQUFLLEVBQUUsU0FBUztxQkFBRTtpQkFDckI7Z0JBQ0QsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLHVDQUF1QztxQkFBRTtvQkFDbEQ7d0JBQ0UsS0FBSyxFQUFFLCtCQUErQjtxQkFBRTtvQkFDMUM7d0JBQ0UsS0FBSyxFQUFFLFVBQVU7cUJBQUU7aUJBQ3RCO2dCQUNELFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQVJNIEFzc2VtYmx5XG5BdXRob3I6IERhbiBQYW56YXJlbGxhIDxhbHNvZWxwQGdtYWlsLmNvbT5cbkRlc2NyaXB0aW9uOiBBUk0gQXNzZW1ibHkgaW5jbHVkaW5nIFRodW1iIGFuZCBUaHVtYjIgaW5zdHJ1Y3Rpb25zXG5DYXRlZ29yeTogYXNzZW1ibGVyXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gYXJtYXNtKGhsanMpIHtcbiAgLy8gbG9jYWwgbGFiZWxzOiAlP1tGQl0/W0FUXT9cXGR7MSwyfVxcdytcblxuICBjb25zdCBDT01NRU5UID0geyB2YXJpYW50czogW1xuICAgIGhsanMuQ09NTUVOVCgnXlsgXFxcXHRdKig/PSMpJywgJyQnLCB7XG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBleGNsdWRlQmVnaW46IHRydWVcbiAgICB9KSxcbiAgICBobGpzLkNPTU1FTlQoJ1s7QF0nLCAnJCcsIHsgcmVsZXZhbmNlOiAwIH0pLFxuICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gIF0gfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdBUk0gQXNzZW1ibHknLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgYWxpYXNlczogWyAnYXJtJyBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogJ1xcXFwuPycgKyBobGpzLklERU5UX1JFLFxuICAgICAgbWV0YTpcbiAgICAgICAgLy8gR05VIHByZXByb2NzXG4gICAgICAgICcuMmJ5dGUgLjRieXRlIC5hbGlnbiAuYXNjaWkgLmFzY2l6IC5iYWxpZ24gLmJ5dGUgLmNvZGUgLmRhdGEgLmVsc2UgLmVuZCAuZW5kaWYgLmVuZG0gLmVuZHIgLmVxdSAuZXJyIC5leGl0bSAuZXh0ZXJuIC5nbG9iYWwgLmh3b3JkIC5pZiAuaWZkZWYgLmlmbmRlZiAuaW5jbHVkZSAuaXJwIC5sb25nIC5tYWNybyAucmVwdCAucmVxIC5zZWN0aW9uIC5zZXQgLnNraXAgLnNwYWNlIC50ZXh0IC53b3JkIC5hcm0gLnRodW1iIC5jb2RlMTYgLmNvZGUzMiAuZm9yY2VfdGh1bWIgLnRodW1iX2Z1bmMgLmx0b3JnICdcbiAgICAgICAgLy8gQVJNIGRpcmVjdGl2ZXNcbiAgICAgICAgKyAnQUxJQVMgQUxJR04gQVJNIEFSRUEgQVNTRVJUIEFUVFIgQ04gQ09ERSBDT0RFMTYgQ09ERTMyIENPTU1PTiBDUCBEQVRBIERDQiBEQ0QgRENEVSBEQ0RPIERDRkQgRENGRFUgRENJIERDUSBEQ1FVIERDVyBEQ1dVIEROIEVMSUYgRUxTRSBFTkQgRU5ERlVOQyBFTkRJRiBFTkRQIEVOVFJZIEVRVSBFWFBPUlQgRVhQT1JUQVMgRVhURVJOIEZJRUxEIEZJTEwgRlVOQ1RJT04gR0JMQSBHQkxMIEdCTFMgR0VUIEdMT0JBTCBJRiBJTVBPUlQgSU5DQklOIElOQ0xVREUgSU5GTyBLRUVQIExDTEEgTENMTCBMQ0xTIExUT1JHIE1BQ1JPIE1BUCBNRU5EIE1FWElUIE5PRlAgT1BUIFBSRVNFUlZFOCBQUk9DIFFOIFJFQURPTkxZIFJFTE9DIFJFUVVJUkUgUkVRVUlSRTggUkxJU1QgRk4gUk9VVCBTRVRBIFNFVEwgU0VUUyBTTiBTUEFDRSBTVUJUIFRIVU1CIFRIVU1CWCBUVEwgV0hJTEUgV0VORCAnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdyMCByMSByMiByMyByNCByNSByNiByNyByOCByOSByMTAgcjExIHIxMiByMTMgcjE0IHIxNSAnIC8vIHN0YW5kYXJkIHJlZ2lzdGVyc1xuICAgICAgICArICdwYyBsciBzcCBpcCBzbCBzYiBmcCAnIC8vIHR5cGljYWwgcmVncyBwbHVzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgKyAnYTEgYTIgYTMgYTQgdjEgdjIgdjMgdjQgdjUgdjYgdjcgdjggZjAgZjEgZjIgZjMgZjQgZjUgZjYgZjcgJyAvLyBtb3JlIHJlZ3MgYW5kIGZwXG4gICAgICAgICsgJ3AwIHAxIHAyIHAzIHA0IHA1IHA2IHA3IHA4IHA5IHAxMCBwMTEgcDEyIHAxMyBwMTQgcDE1ICcgLy8gY29wcm9jZXNzb3IgcmVnc1xuICAgICAgICArICdjMCBjMSBjMiBjMyBjNCBjNSBjNiBjNyBjOCBjOSBjMTAgYzExIGMxMiBjMTMgYzE0IGMxNSAnIC8vIG1vcmUgY29wcm9jXG4gICAgICAgICsgJ3EwIHExIHEyIHEzIHE0IHE1IHE2IHE3IHE4IHE5IHExMCBxMTEgcTEyIHExMyBxMTQgcTE1ICcgLy8gYWR2YW5jZWQgU0lNRCBORU9OIHJlZ3NcblxuICAgICAgICAvLyBwcm9ncmFtIHN0YXR1cyByZWdpc3RlcnNcbiAgICAgICAgKyAnY3Bzcl9jIGNwc3JfeCBjcHNyX3MgY3Bzcl9mIGNwc3JfY3ggY3Bzcl9jeHMgY3Bzcl94cyBjcHNyX3hzZiBjcHNyX3NmIGNwc3JfY3hzZiAnXG4gICAgICAgICsgJ3Nwc3JfYyBzcHNyX3ggc3Bzcl9zIHNwc3JfZiBzcHNyX2N4IHNwc3JfY3hzIHNwc3JfeHMgc3Bzcl94c2Ygc3Bzcl9zZiBzcHNyX2N4c2YgJ1xuXG4gICAgICAgIC8vIE5FT04gYW5kIFZGUCByZWdpc3RlcnNcbiAgICAgICAgKyAnczAgczEgczIgczMgczQgczUgczYgczcgczggczkgczEwIHMxMSBzMTIgczEzIHMxNCBzMTUgJ1xuICAgICAgICArICdzMTYgczE3IHMxOCBzMTkgczIwIHMyMSBzMjIgczIzIHMyNCBzMjUgczI2IHMyNyBzMjggczI5IHMzMCBzMzEgJ1xuICAgICAgICArICdkMCBkMSBkMiBkMyBkNCBkNSBkNiBkNyBkOCBkOSBkMTAgZDExIGQxMiBkMTMgZDE0IGQxNSAnXG4gICAgICAgICsgJ2QxNiBkMTcgZDE4IGQxOSBkMjAgZDIxIGQyMiBkMjMgZDI0IGQyNSBkMjYgZDI3IGQyOCBkMjkgZDMwIGQzMSAnXG5cbiAgICAgICAgKyAne1BDfSB7VkFSfSB7VFJVRX0ge0ZBTFNFfSB7T1BUfSB7Q09ORklHfSB7RU5ESUFOfSB7Q09ERVNJWkV9IHtDUFV9IHtGUFV9IHtBUkNISVRFQ1RVUkV9IHtQQ1NUT1JFT0ZGU0VUfSB7QVJNQVNNX1ZFUlNJT059IHtJTlRFUn0ge1JPUEl9IHtSV1BJfSB7U1dTVH0ge05PU1dTVH0gLiBAJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoJyAvLyBtbmVtb25pY3NcbiAgICAgICAgICAgICsgJ2FkY3wnXG4gICAgICAgICAgICArICcocWQ/fHNoP3x1W3FoXT8pP2FkZCg4fDE2KT98dXNhZGE/OHwocXxzaD98dVtxaF0/KT8oYXN8c2EpeHwnXG4gICAgICAgICAgICArICdhbmR8YWRybD98c2JjfHJzW2JjXXxhc3J8YltseF0/fGJseHxieGp8Y2JuP3p8dGJbYmhdfGJpY3wnXG4gICAgICAgICAgICArICdiZmN8YmZpfFtzdV1iZnh8YmtwdHxjZHAyP3xjbHp8Y2xyZXh8Y21wfGNtbnxjcHNpW2VkXXxjcHN8J1xuICAgICAgICAgICAgKyAnc2V0ZW5kfGRiZ3xkbWJ8ZHNifGVvcnxpc2J8aXRbdGVdezAsM318bHNsfGxzcnxyb3J8cnJ4fCdcbiAgICAgICAgICAgICsgJ2xkbSgoW2lkXVthYl0pfGZbZHNdKT98bGRyKChzfGV4KT9bYmhkXSk/fG1vdnQ/fG12bnxtcmF8bWFyfCdcbiAgICAgICAgICAgICsgJ211bHxbdXNdbXVsbHxzbXVsW2J3dF1bYnRdfHNtdVthc11kfHNtbXVsfHNtbWxhfCdcbiAgICAgICAgICAgICsgJ21sYXx1bWxhYWx8c21sYWw/KFt3YnRdW2J0XXxkKXxtbHN8c21sc2w/W2RzXXxzbWN8c3ZjfHNldnwnXG4gICAgICAgICAgICArICdtaWEoW2J0XXsyfXxwaCk/fG1ycj9jMj98bWNycjI/fG1yc3xtc3J8b3JyfG9ybnxwa2godGJ8YnQpfHJiaXR8J1xuICAgICAgICAgICAgKyAncmV2KDE2fHNoKT98c2VsfFtzdV1zYXQoMTYpP3xub3B8cG9wfHB1c2h8cmZlKFtpZF1bYWJdKT98J1xuICAgICAgICAgICAgKyAnc3RtKFtpZF1bYWJdKT98c3RyKGV4KT9bYmhkXT98KHFkPyk/c3VifChzaD98cXx1W3FoXT8pP3N1Yig4fDE2KXwnXG4gICAgICAgICAgICArICdbc3VdeHQoYT9ofGE/YigxNik/KXxzcnMoW2lkXVthYl0pP3xzd3BiP3xzd2l8c21pfHRzdHx0ZXF8J1xuICAgICAgICAgICAgKyAnd2ZlfHdmaXx5aWVsZCdcbiAgICAgICAgKyAnKSdcbiAgICAgICAgKyAnKGVxfG5lfGNzfGNjfG1pfHBsfHZzfHZjfGhpfGxzfGdlfGx0fGd0fGxlfGFsfGhzfGxvKT8nIC8vIGNvbmRpdGlvbiBjb2Rlc1xuICAgICAgICArICdbc3B0cnhdPycgLy8gbGVnYWwgcG9zdGZpeGVzXG4gICAgICAgICsgJyg/PVxcXFxzKScgLy8gZm9sbG93ZWQgYnkgc3BhY2VcbiAgICAgIH0sXG4gICAgICBDT01NRU5ULFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXCcnLFxuICAgICAgICBlbmQ6ICdbXlxcXFxcXFxcXVxcJycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFx8JyxcbiAgICAgICAgZW5kOiAnXFxcXHwnLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyAvLyBoZXhcbiAgICAgICAgICAgIGJlZ2luOiAnWyMkPV0/MHhbMC05YS1mXSsnIH0sXG4gICAgICAgICAgeyAvLyBiaW5cbiAgICAgICAgICAgIGJlZ2luOiAnWyMkPV0/MGJbMDFdKycgfSxcbiAgICAgICAgICB7IC8vIGxpdGVyYWxcbiAgICAgICAgICAgIGJlZ2luOiAnWyMkPV1cXFxcZCsnIH0sXG4gICAgICAgICAgeyAvLyBiYXJlIG51bWJlclxuICAgICAgICAgICAgYmVnaW46ICdcXFxcYlxcXFxkKycgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyAvLyBHTlUgQVJNIHN5bnRheFxuICAgICAgICAgICAgYmVnaW46ICdeWyBcXFxcdF0qW2Etel9cXFxcLlxcXFwkXVthLXowLTlfXFxcXC5cXFxcJF0rOicgfSxcbiAgICAgICAgICB7IC8vIEFSTSBzeW50YXhcbiAgICAgICAgICAgIGJlZ2luOiAnXlthLXpfXFxcXC5cXFxcJF1bYS16MC05X1xcXFwuXFxcXCRdKycgfSxcbiAgICAgICAgICB7IC8vIGxhYmVsIHJlZmVyZW5jZVxuICAgICAgICAgICAgYmVnaW46ICdbPSNdXFxcXHcrJyB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgYXJtYXNtIGFzIGRlZmF1bHQgfTtcbiJdfQ==