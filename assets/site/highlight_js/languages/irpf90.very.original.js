function irpf90(hljs) {
    const regex = hljs.regex;
    const PARAMS = {
        className: 'params',
        begin: '\\(',
        end: '\\)'
    };
    const OPTIONAL_NUMBER_SUFFIX = /(_[a-z_\d]+)?/;
    const OPTIONAL_NUMBER_EXP = /([de][+-]?\d+)?/;
    const NUMBER = {
        className: 'number',
        variants: [
            { begin: regex.concat(/\b\d+/, /\.(\d*)/, OPTIONAL_NUMBER_EXP, OPTIONAL_NUMBER_SUFFIX) },
            { begin: regex.concat(/\b\d+/, OPTIONAL_NUMBER_EXP, OPTIONAL_NUMBER_SUFFIX) },
            { begin: regex.concat(/\.\d+/, OPTIONAL_NUMBER_EXP, OPTIONAL_NUMBER_SUFFIX) }
        ],
        relevance: 0
    };
    const F_KEYWORDS = {
        literal: '.False. .True.',
        keyword: 'kind do while private call intrinsic where elsewhere '
            + 'type endtype endmodule endselect endinterface end enddo endif if forall endforall only contains default return stop then '
            + 'public subroutine|10 function program .and. .or. .not. .le. .eq. .ge. .gt. .lt. '
            + 'goto save else use module select case '
            + 'access blank direct exist file fmt form formatted iostat name named nextrec number opened rec recl sequential status unformatted unit '
            + 'continue format pause cycle exit '
            + 'c_null_char c_alert c_backspace c_form_feed flush wait decimal round iomsg '
            + 'synchronous nopass non_overridable pass protected volatile abstract extends import '
            + 'non_intrinsic value deferred generic final enumerator class associate bind enum '
            + 'c_int c_short c_long c_long_long c_signed_char c_size_t c_int8_t c_int16_t c_int32_t c_int64_t c_int_least8_t c_int_least16_t '
            + 'c_int_least32_t c_int_least64_t c_int_fast8_t c_int_fast16_t c_int_fast32_t c_int_fast64_t c_intmax_t C_intptr_t c_float c_double '
            + 'c_long_double c_float_complex c_double_complex c_long_double_complex c_bool c_char c_null_ptr c_null_funptr '
            + 'c_new_line c_carriage_return c_horizontal_tab c_vertical_tab iso_c_binding c_loc c_funloc c_associated  c_f_pointer '
            + 'c_ptr c_funptr iso_fortran_env character_storage_size error_unit file_storage_size input_unit iostat_end iostat_eor '
            + 'numeric_storage_size output_unit c_f_procpointer ieee_arithmetic ieee_support_underflow_control '
            + 'ieee_get_underflow_mode ieee_set_underflow_mode newunit contiguous recursive '
            + 'pad position action delim readwrite eor advance nml interface procedure namelist include sequence elemental pure '
            + 'integer real character complex logical dimension allocatable|10 parameter '
            + 'external implicit|10 none double precision assign intent optional pointer '
            + 'target in out common equivalence data '
            + 'begin_provider &begin_provider end_provider begin_shell end_shell begin_template end_template subst assert touch '
            + 'soft_touch provide no_dep free irp_if irp_else irp_endif irp_write irp_read',
        built_in: 'alog alog10 amax0 amax1 amin0 amin1 amod cabs ccos cexp clog csin csqrt dabs dacos dasin datan datan2 dcos dcosh ddim dexp dint '
            + 'dlog dlog10 dmax1 dmin1 dmod dnint dsign dsin dsinh dsqrt dtan dtanh float iabs idim idint idnint ifix isign max0 max1 min0 min1 sngl '
            + 'algama cdabs cdcos cdexp cdlog cdsin cdsqrt cqabs cqcos cqexp cqlog cqsin cqsqrt dcmplx dconjg derf derfc dfloat dgamma dimag dlgama '
            + 'iqint qabs qacos qasin qatan qatan2 qcmplx qconjg qcos qcosh qdim qerf qerfc qexp qgamma qimag qlgama qlog qlog10 qmax1 qmin1 qmod '
            + 'qnint qsign qsin qsinh qsqrt qtan qtanh abs acos aimag aint anint asin atan atan2 char cmplx conjg cos cosh exp ichar index int log '
            + 'log10 max min nint sign sin sinh sqrt tan tanh print write dim lge lgt lle llt mod nullify allocate deallocate '
            + 'adjustl adjustr all allocated any associated bit_size btest ceiling count cshift date_and_time digits dot_product '
            + 'eoshift epsilon exponent floor fraction huge iand ibclr ibits ibset ieor ior ishft ishftc lbound len_trim matmul '
            + 'maxexponent maxloc maxval merge minexponent minloc minval modulo mvbits nearest pack present product '
            + 'radix random_number random_seed range repeat reshape rrspacing scale scan selected_int_kind selected_real_kind '
            + 'set_exponent shape size spacing spread sum system_clock tiny transpose trim ubound unpack verify achar iachar transfer '
            + 'dble entry dprod cpu_time command_argument_count get_command get_command_argument get_environment_variable is_iostat_end '
            + 'ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode '
            + 'is_iostat_eor move_alloc new_line selected_char_kind same_type_as extends_type_of '
            + 'acosh asinh atanh bessel_j0 bessel_j1 bessel_jn bessel_y0 bessel_y1 bessel_yn erf erfc erfc_scaled gamma log_gamma hypot norm2 '
            + 'atomic_define atomic_ref execute_command_line leadz trailz storage_size merge_bits '
            + 'bge bgt ble blt dshiftl dshiftr findloc iall iany iparity image_index lcobound ucobound maskl maskr '
            + 'num_images parity popcnt poppar shifta shiftl shiftr this_image '
            + 'IRP_ALIGN irp_here'
    };
    return {
        name: 'IRPF90',
        case_insensitive: true,
        keywords: F_KEYWORDS,
        illegal: /\/\*/,
        contains: [
            hljs.inherit(hljs.APOS_STRING_MODE, {
                className: 'string',
                relevance: 0
            }),
            hljs.inherit(hljs.QUOTE_STRING_MODE, {
                className: 'string',
                relevance: 0
            }),
            {
                className: 'function',
                beginKeywords: 'subroutine function program',
                illegal: '[${=\\n]',
                contains: [
                    hljs.UNDERSCORE_TITLE_MODE,
                    PARAMS
                ]
            },
            hljs.COMMENT('!', '$', { relevance: 0 }),
            hljs.COMMENT('begin_doc', 'end_doc', { relevance: 10 }),
            NUMBER
        ]
    };
}
export { irpf90 as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXJwZjkwLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvaXJwZjkwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN6QixNQUFNLE1BQU0sR0FBRztRQUNiLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxLQUFLO1FBQ1osR0FBRyxFQUFFLEtBQUs7S0FDWCxDQUFDO0lBR0YsTUFBTSxzQkFBc0IsR0FBRyxlQUFlLENBQUM7SUFDL0MsTUFBTSxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztJQUM5QyxNQUFNLE1BQU0sR0FBRztRQUNiLFNBQVMsRUFBRSxRQUFRO1FBQ25CLFFBQVEsRUFBRTtZQUNSLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFO1lBQ3hGLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDLEVBQUU7WUFDN0UsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUMsRUFBRTtTQUM5RTtRQUNELFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsT0FBTyxFQUFFLHVEQUF1RDtjQUM1RCwySEFBMkg7Y0FDM0gsa0ZBQWtGO2NBQ2xGLHdDQUF3QztjQUN4Qyx3SUFBd0k7Y0FDeEksbUNBQW1DO2NBQ25DLDZFQUE2RTtjQUM3RSxxRkFBcUY7Y0FDckYsa0ZBQWtGO2NBQ2xGLGdJQUFnSTtjQUNoSSxvSUFBb0k7Y0FDcEksOEdBQThHO2NBQzlHLHNIQUFzSDtjQUN0SCxzSEFBc0g7Y0FDdEgsa0dBQWtHO2NBQ2xHLCtFQUErRTtjQUMvRSxtSEFBbUg7Y0FDbkgsNEVBQTRFO2NBQzVFLDRFQUE0RTtjQUM1RSx3Q0FBd0M7Y0FFeEMsbUhBQW1IO2NBQ25ILDZFQUE2RTtRQUNqRixRQUFRLEVBQUUsa0lBQWtJO2NBQ3hJLHdJQUF3STtjQUN4SSx1SUFBdUk7Y0FDdkkscUlBQXFJO2NBQ3JJLHNJQUFzSTtjQUN0SSxpSEFBaUg7Y0FDakgsb0hBQW9IO2NBQ3BILG1IQUFtSDtjQUNuSCx1R0FBdUc7Y0FDdkcsaUhBQWlIO2NBQ2pILHlIQUF5SDtjQUN6SCwySEFBMkg7Y0FDM0gsaUdBQWlHO2NBQ2pHLG9GQUFvRjtjQUNwRixpSUFBaUk7Y0FDakkscUZBQXFGO2NBQ3JGLHNHQUFzRztjQUN0RyxrRUFBa0U7Y0FFbEUsb0JBQW9CO0tBQ3pCLENBQUM7SUFDRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2xDLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixTQUFTLEVBQUUsQ0FBQzthQUNiLENBQUM7WUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDbkMsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFNBQVMsRUFBRSxDQUFDO2FBQ2IsQ0FBQztZQUNGO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixhQUFhLEVBQUUsNkJBQTZCO2dCQUM1QyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsUUFBUSxFQUFFO29CQUNSLElBQUksQ0FBQyxxQkFBcUI7b0JBQzFCLE1BQU07aUJBQ1A7YUFDRjtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkQsTUFBTTtTQUNQO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBJUlBGOTBcbkF1dGhvcjogQW50aG9ueSBTY2VtYW1hIDxzY2VtYW1hQGlyc2FtYy51cHMtdGxzZS5mcj5cbkRlc2NyaXB0aW9uOiBJUlBGOTAgaXMgYW4gb3Blbi1zb3VyY2UgRm9ydHJhbiBjb2RlIGdlbmVyYXRvclxuV2Vic2l0ZTogaHR0cDovL2lycGY5MC51cHMtdGxzZS5mclxuQ2F0ZWdvcnk6IHNjaWVudGlmaWNcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBpcnBmOTAoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAnXFxcXCgnLFxuICAgIGVuZDogJ1xcXFwpJ1xuICB9O1xuXG4gIC8vIHJlZ2V4IGluIGJvdGggZm9ydHJhbiBhbmQgaXJwZjkwIHNob3VsZCBtYXRjaFxuICBjb25zdCBPUFRJT05BTF9OVU1CRVJfU1VGRklYID0gLyhfW2Etel9cXGRdKyk/LztcbiAgY29uc3QgT1BUSU9OQUxfTlVNQkVSX0VYUCA9IC8oW2RlXVsrLV0/XFxkKyk/LztcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvXFxiXFxkKy8sIC9cXC4oXFxkKikvLCBPUFRJT05BTF9OVU1CRVJfRVhQLCBPUFRJT05BTF9OVU1CRVJfU1VGRklYKSB9LFxuICAgICAgeyBiZWdpbjogcmVnZXguY29uY2F0KC9cXGJcXGQrLywgT1BUSU9OQUxfTlVNQkVSX0VYUCwgT1BUSU9OQUxfTlVNQkVSX1NVRkZJWCkgfSxcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvXFwuXFxkKy8sIE9QVElPTkFMX05VTUJFUl9FWFAsIE9QVElPTkFMX05VTUJFUl9TVUZGSVgpIH1cbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IEZfS0VZV09SRFMgPSB7XG4gICAgbGl0ZXJhbDogJy5GYWxzZS4gLlRydWUuJyxcbiAgICBrZXl3b3JkOiAna2luZCBkbyB3aGlsZSBwcml2YXRlIGNhbGwgaW50cmluc2ljIHdoZXJlIGVsc2V3aGVyZSAnXG4gICAgICArICd0eXBlIGVuZHR5cGUgZW5kbW9kdWxlIGVuZHNlbGVjdCBlbmRpbnRlcmZhY2UgZW5kIGVuZGRvIGVuZGlmIGlmIGZvcmFsbCBlbmRmb3JhbGwgb25seSBjb250YWlucyBkZWZhdWx0IHJldHVybiBzdG9wIHRoZW4gJ1xuICAgICAgKyAncHVibGljIHN1YnJvdXRpbmV8MTAgZnVuY3Rpb24gcHJvZ3JhbSAuYW5kLiAub3IuIC5ub3QuIC5sZS4gLmVxLiAuZ2UuIC5ndC4gLmx0LiAnXG4gICAgICArICdnb3RvIHNhdmUgZWxzZSB1c2UgbW9kdWxlIHNlbGVjdCBjYXNlICdcbiAgICAgICsgJ2FjY2VzcyBibGFuayBkaXJlY3QgZXhpc3QgZmlsZSBmbXQgZm9ybSBmb3JtYXR0ZWQgaW9zdGF0IG5hbWUgbmFtZWQgbmV4dHJlYyBudW1iZXIgb3BlbmVkIHJlYyByZWNsIHNlcXVlbnRpYWwgc3RhdHVzIHVuZm9ybWF0dGVkIHVuaXQgJ1xuICAgICAgKyAnY29udGludWUgZm9ybWF0IHBhdXNlIGN5Y2xlIGV4aXQgJ1xuICAgICAgKyAnY19udWxsX2NoYXIgY19hbGVydCBjX2JhY2tzcGFjZSBjX2Zvcm1fZmVlZCBmbHVzaCB3YWl0IGRlY2ltYWwgcm91bmQgaW9tc2cgJ1xuICAgICAgKyAnc3luY2hyb25vdXMgbm9wYXNzIG5vbl9vdmVycmlkYWJsZSBwYXNzIHByb3RlY3RlZCB2b2xhdGlsZSBhYnN0cmFjdCBleHRlbmRzIGltcG9ydCAnXG4gICAgICArICdub25faW50cmluc2ljIHZhbHVlIGRlZmVycmVkIGdlbmVyaWMgZmluYWwgZW51bWVyYXRvciBjbGFzcyBhc3NvY2lhdGUgYmluZCBlbnVtICdcbiAgICAgICsgJ2NfaW50IGNfc2hvcnQgY19sb25nIGNfbG9uZ19sb25nIGNfc2lnbmVkX2NoYXIgY19zaXplX3QgY19pbnQ4X3QgY19pbnQxNl90IGNfaW50MzJfdCBjX2ludDY0X3QgY19pbnRfbGVhc3Q4X3QgY19pbnRfbGVhc3QxNl90ICdcbiAgICAgICsgJ2NfaW50X2xlYXN0MzJfdCBjX2ludF9sZWFzdDY0X3QgY19pbnRfZmFzdDhfdCBjX2ludF9mYXN0MTZfdCBjX2ludF9mYXN0MzJfdCBjX2ludF9mYXN0NjRfdCBjX2ludG1heF90IENfaW50cHRyX3QgY19mbG9hdCBjX2RvdWJsZSAnXG4gICAgICArICdjX2xvbmdfZG91YmxlIGNfZmxvYXRfY29tcGxleCBjX2RvdWJsZV9jb21wbGV4IGNfbG9uZ19kb3VibGVfY29tcGxleCBjX2Jvb2wgY19jaGFyIGNfbnVsbF9wdHIgY19udWxsX2Z1bnB0ciAnXG4gICAgICArICdjX25ld19saW5lIGNfY2FycmlhZ2VfcmV0dXJuIGNfaG9yaXpvbnRhbF90YWIgY192ZXJ0aWNhbF90YWIgaXNvX2NfYmluZGluZyBjX2xvYyBjX2Z1bmxvYyBjX2Fzc29jaWF0ZWQgIGNfZl9wb2ludGVyICdcbiAgICAgICsgJ2NfcHRyIGNfZnVucHRyIGlzb19mb3J0cmFuX2VudiBjaGFyYWN0ZXJfc3RvcmFnZV9zaXplIGVycm9yX3VuaXQgZmlsZV9zdG9yYWdlX3NpemUgaW5wdXRfdW5pdCBpb3N0YXRfZW5kIGlvc3RhdF9lb3IgJ1xuICAgICAgKyAnbnVtZXJpY19zdG9yYWdlX3NpemUgb3V0cHV0X3VuaXQgY19mX3Byb2Nwb2ludGVyIGllZWVfYXJpdGhtZXRpYyBpZWVlX3N1cHBvcnRfdW5kZXJmbG93X2NvbnRyb2wgJ1xuICAgICAgKyAnaWVlZV9nZXRfdW5kZXJmbG93X21vZGUgaWVlZV9zZXRfdW5kZXJmbG93X21vZGUgbmV3dW5pdCBjb250aWd1b3VzIHJlY3Vyc2l2ZSAnXG4gICAgICArICdwYWQgcG9zaXRpb24gYWN0aW9uIGRlbGltIHJlYWR3cml0ZSBlb3IgYWR2YW5jZSBubWwgaW50ZXJmYWNlIHByb2NlZHVyZSBuYW1lbGlzdCBpbmNsdWRlIHNlcXVlbmNlIGVsZW1lbnRhbCBwdXJlICdcbiAgICAgICsgJ2ludGVnZXIgcmVhbCBjaGFyYWN0ZXIgY29tcGxleCBsb2dpY2FsIGRpbWVuc2lvbiBhbGxvY2F0YWJsZXwxMCBwYXJhbWV0ZXIgJ1xuICAgICAgKyAnZXh0ZXJuYWwgaW1wbGljaXR8MTAgbm9uZSBkb3VibGUgcHJlY2lzaW9uIGFzc2lnbiBpbnRlbnQgb3B0aW9uYWwgcG9pbnRlciAnXG4gICAgICArICd0YXJnZXQgaW4gb3V0IGNvbW1vbiBlcXVpdmFsZW5jZSBkYXRhICdcbiAgICAgIC8vIElSUEY5MCBzcGVjaWFsIGtleXdvcmRzXG4gICAgICArICdiZWdpbl9wcm92aWRlciAmYmVnaW5fcHJvdmlkZXIgZW5kX3Byb3ZpZGVyIGJlZ2luX3NoZWxsIGVuZF9zaGVsbCBiZWdpbl90ZW1wbGF0ZSBlbmRfdGVtcGxhdGUgc3Vic3QgYXNzZXJ0IHRvdWNoICdcbiAgICAgICsgJ3NvZnRfdG91Y2ggcHJvdmlkZSBub19kZXAgZnJlZSBpcnBfaWYgaXJwX2Vsc2UgaXJwX2VuZGlmIGlycF93cml0ZSBpcnBfcmVhZCcsXG4gICAgYnVpbHRfaW46ICdhbG9nIGFsb2cxMCBhbWF4MCBhbWF4MSBhbWluMCBhbWluMSBhbW9kIGNhYnMgY2NvcyBjZXhwIGNsb2cgY3NpbiBjc3FydCBkYWJzIGRhY29zIGRhc2luIGRhdGFuIGRhdGFuMiBkY29zIGRjb3NoIGRkaW0gZGV4cCBkaW50ICdcbiAgICAgICsgJ2Rsb2cgZGxvZzEwIGRtYXgxIGRtaW4xIGRtb2QgZG5pbnQgZHNpZ24gZHNpbiBkc2luaCBkc3FydCBkdGFuIGR0YW5oIGZsb2F0IGlhYnMgaWRpbSBpZGludCBpZG5pbnQgaWZpeCBpc2lnbiBtYXgwIG1heDEgbWluMCBtaW4xIHNuZ2wgJ1xuICAgICAgKyAnYWxnYW1hIGNkYWJzIGNkY29zIGNkZXhwIGNkbG9nIGNkc2luIGNkc3FydCBjcWFicyBjcWNvcyBjcWV4cCBjcWxvZyBjcXNpbiBjcXNxcnQgZGNtcGx4IGRjb25qZyBkZXJmIGRlcmZjIGRmbG9hdCBkZ2FtbWEgZGltYWcgZGxnYW1hICdcbiAgICAgICsgJ2lxaW50IHFhYnMgcWFjb3MgcWFzaW4gcWF0YW4gcWF0YW4yIHFjbXBseCBxY29uamcgcWNvcyBxY29zaCBxZGltIHFlcmYgcWVyZmMgcWV4cCBxZ2FtbWEgcWltYWcgcWxnYW1hIHFsb2cgcWxvZzEwIHFtYXgxIHFtaW4xIHFtb2QgJ1xuICAgICAgKyAncW5pbnQgcXNpZ24gcXNpbiBxc2luaCBxc3FydCBxdGFuIHF0YW5oIGFicyBhY29zIGFpbWFnIGFpbnQgYW5pbnQgYXNpbiBhdGFuIGF0YW4yIGNoYXIgY21wbHggY29uamcgY29zIGNvc2ggZXhwIGljaGFyIGluZGV4IGludCBsb2cgJ1xuICAgICAgKyAnbG9nMTAgbWF4IG1pbiBuaW50IHNpZ24gc2luIHNpbmggc3FydCB0YW4gdGFuaCBwcmludCB3cml0ZSBkaW0gbGdlIGxndCBsbGUgbGx0IG1vZCBudWxsaWZ5IGFsbG9jYXRlIGRlYWxsb2NhdGUgJ1xuICAgICAgKyAnYWRqdXN0bCBhZGp1c3RyIGFsbCBhbGxvY2F0ZWQgYW55IGFzc29jaWF0ZWQgYml0X3NpemUgYnRlc3QgY2VpbGluZyBjb3VudCBjc2hpZnQgZGF0ZV9hbmRfdGltZSBkaWdpdHMgZG90X3Byb2R1Y3QgJ1xuICAgICAgKyAnZW9zaGlmdCBlcHNpbG9uIGV4cG9uZW50IGZsb29yIGZyYWN0aW9uIGh1Z2UgaWFuZCBpYmNsciBpYml0cyBpYnNldCBpZW9yIGlvciBpc2hmdCBpc2hmdGMgbGJvdW5kIGxlbl90cmltIG1hdG11bCAnXG4gICAgICArICdtYXhleHBvbmVudCBtYXhsb2MgbWF4dmFsIG1lcmdlIG1pbmV4cG9uZW50IG1pbmxvYyBtaW52YWwgbW9kdWxvIG12Yml0cyBuZWFyZXN0IHBhY2sgcHJlc2VudCBwcm9kdWN0ICdcbiAgICAgICsgJ3JhZGl4IHJhbmRvbV9udW1iZXIgcmFuZG9tX3NlZWQgcmFuZ2UgcmVwZWF0IHJlc2hhcGUgcnJzcGFjaW5nIHNjYWxlIHNjYW4gc2VsZWN0ZWRfaW50X2tpbmQgc2VsZWN0ZWRfcmVhbF9raW5kICdcbiAgICAgICsgJ3NldF9leHBvbmVudCBzaGFwZSBzaXplIHNwYWNpbmcgc3ByZWFkIHN1bSBzeXN0ZW1fY2xvY2sgdGlueSB0cmFuc3Bvc2UgdHJpbSB1Ym91bmQgdW5wYWNrIHZlcmlmeSBhY2hhciBpYWNoYXIgdHJhbnNmZXIgJ1xuICAgICAgKyAnZGJsZSBlbnRyeSBkcHJvZCBjcHVfdGltZSBjb21tYW5kX2FyZ3VtZW50X2NvdW50IGdldF9jb21tYW5kIGdldF9jb21tYW5kX2FyZ3VtZW50IGdldF9lbnZpcm9ubWVudF92YXJpYWJsZSBpc19pb3N0YXRfZW5kICdcbiAgICAgICsgJ2llZWVfYXJpdGhtZXRpYyBpZWVlX3N1cHBvcnRfdW5kZXJmbG93X2NvbnRyb2wgaWVlZV9nZXRfdW5kZXJmbG93X21vZGUgaWVlZV9zZXRfdW5kZXJmbG93X21vZGUgJ1xuICAgICAgKyAnaXNfaW9zdGF0X2VvciBtb3ZlX2FsbG9jIG5ld19saW5lIHNlbGVjdGVkX2NoYXJfa2luZCBzYW1lX3R5cGVfYXMgZXh0ZW5kc190eXBlX29mICdcbiAgICAgICsgJ2Fjb3NoIGFzaW5oIGF0YW5oIGJlc3NlbF9qMCBiZXNzZWxfajEgYmVzc2VsX2puIGJlc3NlbF95MCBiZXNzZWxfeTEgYmVzc2VsX3luIGVyZiBlcmZjIGVyZmNfc2NhbGVkIGdhbW1hIGxvZ19nYW1tYSBoeXBvdCBub3JtMiAnXG4gICAgICArICdhdG9taWNfZGVmaW5lIGF0b21pY19yZWYgZXhlY3V0ZV9jb21tYW5kX2xpbmUgbGVhZHogdHJhaWx6IHN0b3JhZ2Vfc2l6ZSBtZXJnZV9iaXRzICdcbiAgICAgICsgJ2JnZSBiZ3QgYmxlIGJsdCBkc2hpZnRsIGRzaGlmdHIgZmluZGxvYyBpYWxsIGlhbnkgaXBhcml0eSBpbWFnZV9pbmRleCBsY29ib3VuZCB1Y29ib3VuZCBtYXNrbCBtYXNrciAnXG4gICAgICArICdudW1faW1hZ2VzIHBhcml0eSBwb3BjbnQgcG9wcGFyIHNoaWZ0YSBzaGlmdGwgc2hpZnRyIHRoaXNfaW1hZ2UgJ1xuICAgICAgLy8gSVJQRjkwIHNwZWNpYWwgYnVpbHRfaW5zXG4gICAgICArICdJUlBfQUxJR04gaXJwX2hlcmUnXG4gIH07XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0lSUEY5MCcsXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczogRl9LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAvXFwvXFwqLyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5pbmhlcml0KGhsanMuQVBPU19TVFJJTkdfTU9ERSwge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0pLFxuICAgICAgaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnc3Vicm91dGluZSBmdW5jdGlvbiBwcm9ncmFtJyxcbiAgICAgICAgaWxsZWdhbDogJ1skez1cXFxcbl0nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFLFxuICAgICAgICAgIFBBUkFNU1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DT01NRU5UKCchJywgJyQnLCB7IHJlbGV2YW5jZTogMCB9KSxcbiAgICAgIGhsanMuQ09NTUVOVCgnYmVnaW5fZG9jJywgJ2VuZF9kb2MnLCB7IHJlbGV2YW5jZTogMTAgfSksXG4gICAgICBOVU1CRVJcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGlycGY5MCBhcyBkZWZhdWx0IH07XG4iXX0=