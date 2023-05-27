function avrasm(hljs) {
    return {
        name: 'AVR Assembly',
        case_insensitive: true,
        keywords: {
            $pattern: '\\.?' + hljs.IDENT_RE,
            keyword: 'adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs '
                + 'brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr '
                + 'clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor '
                + 'fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul '
                + 'muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs '
                + 'sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub '
                + 'subi swap tst wdr',
            built_in: 'r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 '
                + 'r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl '
                + 'ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h '
                + 'tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c '
                + 'ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg '
                + 'ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk '
                + 'tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al '
                + 'ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr '
                + 'porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 '
                + 'ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf',
            meta: '.byte .cseg .db .def .device .dseg .dw .endmacro .equ .eseg .exit .include .list '
                + '.listmac .macro .nolist .org .set'
        },
        contains: [
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.COMMENT(';', '$', { relevance: 0 }),
            hljs.C_NUMBER_MODE,
            hljs.BINARY_NUMBER_MODE,
            {
                className: 'number',
                begin: '\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)'
            },
            hljs.QUOTE_STRING_MODE,
            {
                className: 'string',
                begin: '\'',
                end: '[^\\\\]\'',
                illegal: '[^\\\\][^\']'
            },
            {
                className: 'symbol',
                begin: '^[A-Za-z0-9_.$]+:'
            },
            {
                className: 'meta',
                begin: '#',
                end: '$'
            },
            {
                className: 'subst',
                begin: '@[0-9]+'
            }
        ]
    };
}
export { avrasm as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZyYXNtLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYXZyYXNtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsT0FBTztRQUNMLElBQUksRUFBRSxjQUFjO1FBQ3BCLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUTtZQUNoQyxPQUFPLEVBRUwsbUZBQW1GO2tCQUNqRixvRkFBb0Y7a0JBQ3BGLG9GQUFvRjtrQkFDcEYsa0ZBQWtGO2tCQUNsRix1RkFBdUY7a0JBQ3ZGLHVGQUF1RjtrQkFDdkYsbUJBQW1CO1lBQ3ZCLFFBQVEsRUFFTixvRkFBb0Y7a0JBQ2xGLG9FQUFvRTtrQkFFcEUsb0ZBQW9GO2tCQUNwRixtRkFBbUY7a0JBQ25GLHFGQUFxRjtrQkFDckYsc0ZBQXNGO2tCQUN0RixvRkFBb0Y7a0JBQ3BGLG9GQUFvRjtrQkFDcEYsc0ZBQXNGO2tCQUN0RixzRUFBc0U7WUFDMUUsSUFBSSxFQUNGLG1GQUFtRjtrQkFDakYsbUNBQW1DO1NBQ3hDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG9CQUFvQjtZQUN6QixJQUFJLENBQUMsT0FBTyxDQUNWLEdBQUcsRUFDSCxHQUFHLEVBQ0gsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQ2pCO1lBQ0QsSUFBSSxDQUFDLGFBQWE7WUFDbEIsSUFBSSxDQUFDLGtCQUFrQjtZQUN2QjtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLCtCQUErQjthQUN2QztZQUNELElBQUksQ0FBQyxpQkFBaUI7WUFDdEI7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLEtBQUssRUFBRSxJQUFJO2dCQUNYLEdBQUcsRUFBRSxXQUFXO2dCQUNoQixPQUFPLEVBQUUsY0FBYzthQUN4QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsbUJBQW1CO2FBQzNCO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7WUFDRDtnQkFDRSxTQUFTLEVBQUUsT0FBTztnQkFDbEIsS0FBSyxFQUFFLFNBQVM7YUFDakI7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQVZSIEFzc2VtYmx5XG5BdXRob3I6IFZsYWRpbWlyIEVybWFrb3YgPHZvb29uMzQxQGdtYWlsLmNvbT5cbkNhdGVnb3J5OiBhc3NlbWJsZXJcbldlYnNpdGU6IGh0dHBzOi8vd3d3Lm1pY3JvY2hpcC5jb20vd2ViZG9jL2F2cmFzc2VtYmxlci9hdnJhc3NlbWJsZXIud2JfaW5zdHJ1Y3Rpb25fbGlzdC5odG1sXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gYXZyYXNtKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQVZSIEFzc2VtYmx5JyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogJ1xcXFwuPycgKyBobGpzLklERU5UX1JFLFxuICAgICAga2V5d29yZDpcbiAgICAgICAgLyogbW5lbW9uaWMgKi9cbiAgICAgICAgJ2FkYyBhZGQgYWRpdyBhbmQgYW5kaSBhc3IgYmNsciBibGQgYnJiYyBicmJzIGJyY2MgYnJjcyBicmVhayBicmVxIGJyZ2UgYnJoYyBicmhzICdcbiAgICAgICAgKyAnYnJpZCBicmllIGJybG8gYnJsdCBicm1pIGJybmUgYnJwbCBicnNoIGJydGMgYnJ0cyBicnZjIGJydnMgYnNldCBic3QgY2FsbCBjYmkgY2JyICdcbiAgICAgICAgKyAnY2xjIGNsaCBjbGkgY2xuIGNsciBjbHMgY2x0IGNsdiBjbHogY29tIGNwIGNwYyBjcGkgY3BzZSBkZWMgZWljYWxsIGVpam1wIGVscG0gZW9yICdcbiAgICAgICAgKyAnZm11bCBmbXVscyBmbXVsc3UgaWNhbGwgaWptcCBpbiBpbmMgam1wIGxkIGxkZCBsZGkgbGRzIGxwbSBsc2wgbHNyIG1vdiBtb3Z3IG11bCAnXG4gICAgICAgICsgJ211bHMgbXVsc3UgbmVnIG5vcCBvciBvcmkgb3V0IHBvcCBwdXNoIHJjYWxsIHJldCByZXRpIHJqbXAgcm9sIHJvciBzYmMgc2JyIHNicmMgc2JycyAnXG4gICAgICAgICsgJ3NlYyBzZWggc2JpIHNiY2kgc2JpYyBzYmlzIHNiaXcgc2VpIHNlbiBzZXIgc2VzIHNldCBzZXYgc2V6IHNsZWVwIHNwbSBzdCBzdGQgc3RzIHN1YiAnXG4gICAgICAgICsgJ3N1Ymkgc3dhcCB0c3Qgd2RyJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAvKiBnZW5lcmFsIHB1cnBvc2UgcmVnaXN0ZXJzICovXG4gICAgICAgICdyMCByMSByMiByMyByNCByNSByNiByNyByOCByOSByMTAgcjExIHIxMiByMTMgcjE0IHIxNSByMTYgcjE3IHIxOCByMTkgcjIwIHIyMSByMjIgJ1xuICAgICAgICArICdyMjMgcjI0IHIyNSByMjYgcjI3IHIyOCByMjkgcjMwIHIzMSB4fDAgeGggeGwgeXwwIHloIHlsIHp8MCB6aCB6bCAnXG4gICAgICAgIC8qIElPIFJlZ2lzdGVycyAoQVRNZWdhMTI4KSAqL1xuICAgICAgICArICd1Y3NyMWMgdWRyMSB1Y3NyMWEgdWNzcjFiIHVicnIxbCB1YnJyMWggdWNzcjBjIHVicnIwaCB0Y2NyM2MgdGNjcjNhIHRjY3IzYiB0Y250M2ggJ1xuICAgICAgICArICd0Y250M2wgb2NyM2FoIG9jcjNhbCBvY3IzYmggb2NyM2JsIG9jcjNjaCBvY3IzY2wgaWNyM2ggaWNyM2wgZXRpbXNrIGV0aWZyIHRjY3IxYyAnXG4gICAgICAgICsgJ29jcjFjaCBvY3IxY2wgdHdjciB0d2RyIHR3YXIgdHdzciB0d2JyIG9zY2NhbCB4bWNyYSB4bWNyYiBlaWNyYSBzcG1jc3Igc3BtY3IgcG9ydGcgJ1xuICAgICAgICArICdkZHJnIHBpbmcgcG9ydGYgZGRyZiBzcmVnIHNwaCBzcGwgeGRpdiByYW1weiBlaWNyYiBlaW1zayBnaW1zayBnaWNyIGVpZnIgZ2lmciB0aW1zayAnXG4gICAgICAgICsgJ3RpZnIgbWN1Y3IgbWN1Y3NyIHRjY3IwIHRjbnQwIG9jcjAgYXNzciB0Y2NyMWEgdGNjcjFiIHRjbnQxaCB0Y250MWwgb2NyMWFoIG9jcjFhbCAnXG4gICAgICAgICsgJ29jcjFiaCBvY3IxYmwgaWNyMWggaWNyMWwgdGNjcjIgdGNudDIgb2NyMiBvY2RyIHdkdGNyIHNmaW9yIGVlYXJoIGVlYXJsIGVlZHIgZWVjciAnXG4gICAgICAgICsgJ3BvcnRhIGRkcmEgcGluYSBwb3J0YiBkZHJiIHBpbmIgcG9ydGMgZGRyYyBwaW5jIHBvcnRkIGRkcmQgcGluZCBzcGRyIHNwc3Igc3BjciB1ZHIwICdcbiAgICAgICAgKyAndWNzcjBhIHVjc3IwYiB1YnJyMGwgYWNzciBhZG11eCBhZGNzciBhZGNoIGFkY2wgcG9ydGUgZGRyZSBwaW5lIHBpbmYnLFxuICAgICAgbWV0YTpcbiAgICAgICAgJy5ieXRlIC5jc2VnIC5kYiAuZGVmIC5kZXZpY2UgLmRzZWcgLmR3IC5lbmRtYWNybyAuZXF1IC5lc2VnIC5leGl0IC5pbmNsdWRlIC5saXN0ICdcbiAgICAgICAgKyAnLmxpc3RtYWMgLm1hY3JvIC5ub2xpc3QgLm9yZyAuc2V0J1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNPTU1FTlQoXG4gICAgICAgICc7JyxcbiAgICAgICAgJyQnLFxuICAgICAgICB7IHJlbGV2YW5jZTogMCB9XG4gICAgICApLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLCAvLyAweC4uLiwgZGVjaW1hbCwgZmxvYXRcbiAgICAgIGhsanMuQklOQVJZX05VTUJFUl9NT0RFLCAvLyAwYi4uLlxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKFxcXFwkW2EtekEtWjAtOV0rfDBvWzAtN10rKScgLy8gJC4uLiwgMG8uLi5cbiAgICAgIH0sXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcJycsXG4gICAgICAgIGVuZDogJ1teXFxcXFxcXFxdXFwnJyxcbiAgICAgICAgaWxsZWdhbDogJ1teXFxcXFxcXFxdW15cXCddJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgYmVnaW46ICdeW0EtWmEtejAtOV8uJF0rOidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJyMnLFxuICAgICAgICBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHsgLy8gc3Vic3RpdHV0aW9uIHdpdGhpbiBhIG1hY3JvXG4gICAgICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICAgICAgYmVnaW46ICdAWzAtOV0rJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgYXZyYXNtIGFzIGRlZmF1bHQgfTtcbiJdfQ==