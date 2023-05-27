function fortran(hljs) {
    const regex = hljs.regex;
    const PARAMS = {
        className: 'params',
        begin: '\\(',
        end: '\\)'
    };
    const COMMENT = { variants: [
            hljs.COMMENT('!', '$', { relevance: 0 }),
            hljs.COMMENT('^C[ ]', '$', { relevance: 0 }),
            hljs.COMMENT('^C$', '$', { relevance: 0 })
        ] };
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
    const FUNCTION_DEF = {
        className: 'function',
        beginKeywords: 'subroutine function program',
        illegal: '[${=\\n]',
        contains: [
            hljs.UNDERSCORE_TITLE_MODE,
            PARAMS
        ]
    };
    const STRING = {
        className: 'string',
        relevance: 0,
        variants: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
        ]
    };
    const KEYWORDS = [
        "kind",
        "do",
        "concurrent",
        "local",
        "shared",
        "while",
        "private",
        "call",
        "intrinsic",
        "where",
        "elsewhere",
        "type",
        "endtype",
        "endmodule",
        "endselect",
        "endinterface",
        "end",
        "enddo",
        "endif",
        "if",
        "forall",
        "endforall",
        "only",
        "contains",
        "default",
        "return",
        "stop",
        "then",
        "block",
        "endblock",
        "endassociate",
        "public",
        "subroutine|10",
        "function",
        "program",
        ".and.",
        ".or.",
        ".not.",
        ".le.",
        ".eq.",
        ".ge.",
        ".gt.",
        ".lt.",
        "goto",
        "save",
        "else",
        "use",
        "module",
        "select",
        "case",
        "access",
        "blank",
        "direct",
        "exist",
        "file",
        "fmt",
        "form",
        "formatted",
        "iostat",
        "name",
        "named",
        "nextrec",
        "number",
        "opened",
        "rec",
        "recl",
        "sequential",
        "status",
        "unformatted",
        "unit",
        "continue",
        "format",
        "pause",
        "cycle",
        "exit",
        "c_null_char",
        "c_alert",
        "c_backspace",
        "c_form_feed",
        "flush",
        "wait",
        "decimal",
        "round",
        "iomsg",
        "synchronous",
        "nopass",
        "non_overridable",
        "pass",
        "protected",
        "volatile",
        "abstract",
        "extends",
        "import",
        "non_intrinsic",
        "value",
        "deferred",
        "generic",
        "final",
        "enumerator",
        "class",
        "associate",
        "bind",
        "enum",
        "c_int",
        "c_short",
        "c_long",
        "c_long_long",
        "c_signed_char",
        "c_size_t",
        "c_int8_t",
        "c_int16_t",
        "c_int32_t",
        "c_int64_t",
        "c_int_least8_t",
        "c_int_least16_t",
        "c_int_least32_t",
        "c_int_least64_t",
        "c_int_fast8_t",
        "c_int_fast16_t",
        "c_int_fast32_t",
        "c_int_fast64_t",
        "c_intmax_t",
        "C_intptr_t",
        "c_float",
        "c_double",
        "c_long_double",
        "c_float_complex",
        "c_double_complex",
        "c_long_double_complex",
        "c_bool",
        "c_char",
        "c_null_ptr",
        "c_null_funptr",
        "c_new_line",
        "c_carriage_return",
        "c_horizontal_tab",
        "c_vertical_tab",
        "iso_c_binding",
        "c_loc",
        "c_funloc",
        "c_associated",
        "c_f_pointer",
        "c_ptr",
        "c_funptr",
        "iso_fortran_env",
        "character_storage_size",
        "error_unit",
        "file_storage_size",
        "input_unit",
        "iostat_end",
        "iostat_eor",
        "numeric_storage_size",
        "output_unit",
        "c_f_procpointer",
        "ieee_arithmetic",
        "ieee_support_underflow_control",
        "ieee_get_underflow_mode",
        "ieee_set_underflow_mode",
        "newunit",
        "contiguous",
        "recursive",
        "pad",
        "position",
        "action",
        "delim",
        "readwrite",
        "eor",
        "advance",
        "nml",
        "interface",
        "procedure",
        "namelist",
        "include",
        "sequence",
        "elemental",
        "pure",
        "impure",
        "integer",
        "real",
        "character",
        "complex",
        "logical",
        "codimension",
        "dimension",
        "allocatable|10",
        "parameter",
        "external",
        "implicit|10",
        "none",
        "double",
        "precision",
        "assign",
        "intent",
        "optional",
        "pointer",
        "target",
        "in",
        "out",
        "common",
        "equivalence",
        "data"
    ];
    const LITERALS = [
        ".False.",
        ".True."
    ];
    const BUILT_INS = [
        "alog",
        "alog10",
        "amax0",
        "amax1",
        "amin0",
        "amin1",
        "amod",
        "cabs",
        "ccos",
        "cexp",
        "clog",
        "csin",
        "csqrt",
        "dabs",
        "dacos",
        "dasin",
        "datan",
        "datan2",
        "dcos",
        "dcosh",
        "ddim",
        "dexp",
        "dint",
        "dlog",
        "dlog10",
        "dmax1",
        "dmin1",
        "dmod",
        "dnint",
        "dsign",
        "dsin",
        "dsinh",
        "dsqrt",
        "dtan",
        "dtanh",
        "float",
        "iabs",
        "idim",
        "idint",
        "idnint",
        "ifix",
        "isign",
        "max0",
        "max1",
        "min0",
        "min1",
        "sngl",
        "algama",
        "cdabs",
        "cdcos",
        "cdexp",
        "cdlog",
        "cdsin",
        "cdsqrt",
        "cqabs",
        "cqcos",
        "cqexp",
        "cqlog",
        "cqsin",
        "cqsqrt",
        "dcmplx",
        "dconjg",
        "derf",
        "derfc",
        "dfloat",
        "dgamma",
        "dimag",
        "dlgama",
        "iqint",
        "qabs",
        "qacos",
        "qasin",
        "qatan",
        "qatan2",
        "qcmplx",
        "qconjg",
        "qcos",
        "qcosh",
        "qdim",
        "qerf",
        "qerfc",
        "qexp",
        "qgamma",
        "qimag",
        "qlgama",
        "qlog",
        "qlog10",
        "qmax1",
        "qmin1",
        "qmod",
        "qnint",
        "qsign",
        "qsin",
        "qsinh",
        "qsqrt",
        "qtan",
        "qtanh",
        "abs",
        "acos",
        "aimag",
        "aint",
        "anint",
        "asin",
        "atan",
        "atan2",
        "char",
        "cmplx",
        "conjg",
        "cos",
        "cosh",
        "exp",
        "ichar",
        "index",
        "int",
        "log",
        "log10",
        "max",
        "min",
        "nint",
        "sign",
        "sin",
        "sinh",
        "sqrt",
        "tan",
        "tanh",
        "print",
        "write",
        "dim",
        "lge",
        "lgt",
        "lle",
        "llt",
        "mod",
        "nullify",
        "allocate",
        "deallocate",
        "adjustl",
        "adjustr",
        "all",
        "allocated",
        "any",
        "associated",
        "bit_size",
        "btest",
        "ceiling",
        "count",
        "cshift",
        "date_and_time",
        "digits",
        "dot_product",
        "eoshift",
        "epsilon",
        "exponent",
        "floor",
        "fraction",
        "huge",
        "iand",
        "ibclr",
        "ibits",
        "ibset",
        "ieor",
        "ior",
        "ishft",
        "ishftc",
        "lbound",
        "len_trim",
        "matmul",
        "maxexponent",
        "maxloc",
        "maxval",
        "merge",
        "minexponent",
        "minloc",
        "minval",
        "modulo",
        "mvbits",
        "nearest",
        "pack",
        "present",
        "product",
        "radix",
        "random_number",
        "random_seed",
        "range",
        "repeat",
        "reshape",
        "rrspacing",
        "scale",
        "scan",
        "selected_int_kind",
        "selected_real_kind",
        "set_exponent",
        "shape",
        "size",
        "spacing",
        "spread",
        "sum",
        "system_clock",
        "tiny",
        "transpose",
        "trim",
        "ubound",
        "unpack",
        "verify",
        "achar",
        "iachar",
        "transfer",
        "dble",
        "entry",
        "dprod",
        "cpu_time",
        "command_argument_count",
        "get_command",
        "get_command_argument",
        "get_environment_variable",
        "is_iostat_end",
        "ieee_arithmetic",
        "ieee_support_underflow_control",
        "ieee_get_underflow_mode",
        "ieee_set_underflow_mode",
        "is_iostat_eor",
        "move_alloc",
        "new_line",
        "selected_char_kind",
        "same_type_as",
        "extends_type_of",
        "acosh",
        "asinh",
        "atanh",
        "bessel_j0",
        "bessel_j1",
        "bessel_jn",
        "bessel_y0",
        "bessel_y1",
        "bessel_yn",
        "erf",
        "erfc",
        "erfc_scaled",
        "gamma",
        "log_gamma",
        "hypot",
        "norm2",
        "atomic_define",
        "atomic_ref",
        "execute_command_line",
        "leadz",
        "trailz",
        "storage_size",
        "merge_bits",
        "bge",
        "bgt",
        "ble",
        "blt",
        "dshiftl",
        "dshiftr",
        "findloc",
        "iall",
        "iany",
        "iparity",
        "image_index",
        "lcobound",
        "ucobound",
        "maskl",
        "maskr",
        "num_images",
        "parity",
        "popcnt",
        "poppar",
        "shifta",
        "shiftl",
        "shiftr",
        "this_image",
        "sync",
        "change",
        "team",
        "co_broadcast",
        "co_max",
        "co_min",
        "co_sum",
        "co_reduce"
    ];
    return {
        name: 'Fortran',
        case_insensitive: true,
        aliases: [
            'f90',
            'f95'
        ],
        keywords: {
            keyword: KEYWORDS,
            literal: LITERALS,
            built_in: BUILT_INS
        },
        illegal: /\/\*/,
        contains: [
            STRING,
            FUNCTION_DEF,
            {
                begin: /^C\s*=(?!=)/,
                relevance: 0
            },
            COMMENT,
            NUMBER
        ]
    };
}
export { fortran as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydHJhbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2ZvcnRyYW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLEtBQUs7UUFDWixHQUFHLEVBQUUsS0FBSztLQUNYLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFFeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUMzQyxFQUFFLENBQUM7SUFHSixNQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQztJQUMvQyxNQUFNLG1CQUFtQixHQUFHLGlCQUFpQixDQUFDO0lBQzlDLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDLEVBQUU7WUFDeEYsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVB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TixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxRQUFRO1FBQ1IsTUFBTTtRQUNOLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sUUFBUTtRQUNSLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsUUFBUTtRQUNSLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixNQUFNO1FBQ04sT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLE1BQU07UUFDTixRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLEtBQUs7UUFD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QU07UUFDTixjQUFjO1FBQ2QsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsV0FBVztLQUNaLENBQUM7SUFDRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFNBQVM7UUFDZixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLE9BQU8sRUFBRTtZQUNQLEtBQUs7WUFDTCxLQUFLO1NBQ047UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsUUFBUTtZQUNqQixPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsU0FBUztTQUNwQjtRQUNELE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxFQUFFO1lBQ1IsTUFBTTtZQUNOLFlBQVk7WUFHWjtnQkFDRSxLQUFLLEVBQUUsYUFBYTtnQkFDcEIsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNELE9BQU87WUFDUCxNQUFNO1NBQ1A7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IEZvcnRyYW5cbkF1dGhvcjogQW50aG9ueSBTY2VtYW1hIDxzY2VtYW1hQGlyc2FtYy51cHMtdGxzZS5mcj5cbldlYnNpdGU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0ZvcnRyYW5cbkNhdGVnb3J5OiBzY2llbnRpZmljXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZm9ydHJhbihobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46ICdcXFxcKCcsXG4gICAgZW5kOiAnXFxcXCknXG4gIH07XG5cbiAgY29uc3QgQ09NTUVOVCA9IHsgdmFyaWFudHM6IFtcbiAgICBobGpzLkNPTU1FTlQoJyEnLCAnJCcsIHsgcmVsZXZhbmNlOiAwIH0pLFxuICAgIC8vIGFsbG93IEZPUlRSQU4gNzcgc3R5bGUgY29tbWVudHNcbiAgICBobGpzLkNPTU1FTlQoJ15DWyBdJywgJyQnLCB7IHJlbGV2YW5jZTogMCB9KSxcbiAgICBobGpzLkNPTU1FTlQoJ15DJCcsICckJywgeyByZWxldmFuY2U6IDAgfSlcbiAgXSB9O1xuXG4gIC8vIHJlZ2V4IGluIGJvdGggZm9ydHJhbiBhbmQgaXJwZjkwIHNob3VsZCBtYXRjaFxuICBjb25zdCBPUFRJT05BTF9OVU1CRVJfU1VGRklYID0gLyhfW2Etel9cXGRdKyk/LztcbiAgY29uc3QgT1BUSU9OQUxfTlVNQkVSX0VYUCA9IC8oW2RlXVsrLV0/XFxkKyk/LztcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvXFxiXFxkKy8sIC9cXC4oXFxkKikvLCBPUFRJT05BTF9OVU1CRVJfRVhQLCBPUFRJT05BTF9OVU1CRVJfU1VGRklYKSB9LFxuICAgICAgeyBiZWdpbjogcmVnZXguY29uY2F0KC9cXGJcXGQrLywgT1BUSU9OQUxfTlVNQkVSX0VYUCwgT1BUSU9OQUxfTlVNQkVSX1NVRkZJWCkgfSxcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvXFwuXFxkKy8sIE9QVElPTkFMX05VTUJFUl9FWFAsIE9QVElPTkFMX05VTUJFUl9TVUZGSVgpIH1cbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IEZVTkNUSU9OX0RFRiA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgYmVnaW5LZXl3b3JkczogJ3N1YnJvdXRpbmUgZnVuY3Rpb24gcHJvZ3JhbScsXG4gICAgaWxsZWdhbDogJ1skez1cXFxcbl0nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERSxcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICBjb25zdCBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgS0VZV09SRFMgPSBbXG4gICAgXCJraW5kXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiY29uY3VycmVudFwiLFxuICAgIFwibG9jYWxcIixcbiAgICBcInNoYXJlZFwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcImNhbGxcIixcbiAgICBcImludHJpbnNpY1wiLFxuICAgIFwid2hlcmVcIixcbiAgICBcImVsc2V3aGVyZVwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwiZW5kdHlwZVwiLFxuICAgIFwiZW5kbW9kdWxlXCIsXG4gICAgXCJlbmRzZWxlY3RcIixcbiAgICBcImVuZGludGVyZmFjZVwiLFxuICAgIFwiZW5kXCIsXG4gICAgXCJlbmRkb1wiLFxuICAgIFwiZW5kaWZcIixcbiAgICBcImlmXCIsXG4gICAgXCJmb3JhbGxcIixcbiAgICBcImVuZGZvcmFsbFwiLFxuICAgIFwib25seVwiLFxuICAgIFwiY29udGFpbnNcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwic3RvcFwiLFxuICAgIFwidGhlblwiLFxuICAgIFwiYmxvY2tcIixcbiAgICBcImVuZGJsb2NrXCIsXG4gICAgXCJlbmRhc3NvY2lhdGVcIixcbiAgICBcInB1YmxpY1wiLFxuICAgIFwic3Vicm91dGluZXwxMFwiLFxuICAgIFwiZnVuY3Rpb25cIixcbiAgICBcInByb2dyYW1cIixcbiAgICBcIi5hbmQuXCIsXG4gICAgXCIub3IuXCIsXG4gICAgXCIubm90LlwiLFxuICAgIFwiLmxlLlwiLFxuICAgIFwiLmVxLlwiLFxuICAgIFwiLmdlLlwiLFxuICAgIFwiLmd0LlwiLFxuICAgIFwiLmx0LlwiLFxuICAgIFwiZ290b1wiLFxuICAgIFwic2F2ZVwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwidXNlXCIsXG4gICAgXCJtb2R1bGVcIixcbiAgICBcInNlbGVjdFwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiYWNjZXNzXCIsXG4gICAgXCJibGFua1wiLFxuICAgIFwiZGlyZWN0XCIsXG4gICAgXCJleGlzdFwiLFxuICAgIFwiZmlsZVwiLFxuICAgIFwiZm10XCIsXG4gICAgXCJmb3JtXCIsXG4gICAgXCJmb3JtYXR0ZWRcIixcbiAgICBcImlvc3RhdFwiLFxuICAgIFwibmFtZVwiLFxuICAgIFwibmFtZWRcIixcbiAgICBcIm5leHRyZWNcIixcbiAgICBcIm51bWJlclwiLFxuICAgIFwib3BlbmVkXCIsXG4gICAgXCJyZWNcIixcbiAgICBcInJlY2xcIixcbiAgICBcInNlcXVlbnRpYWxcIixcbiAgICBcInN0YXR1c1wiLFxuICAgIFwidW5mb3JtYXR0ZWRcIixcbiAgICBcInVuaXRcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJmb3JtYXRcIixcbiAgICBcInBhdXNlXCIsXG4gICAgXCJjeWNsZVwiLFxuICAgIFwiZXhpdFwiLFxuICAgIFwiY19udWxsX2NoYXJcIixcbiAgICBcImNfYWxlcnRcIixcbiAgICBcImNfYmFja3NwYWNlXCIsXG4gICAgXCJjX2Zvcm1fZmVlZFwiLFxuICAgIFwiZmx1c2hcIixcbiAgICBcIndhaXRcIixcbiAgICBcImRlY2ltYWxcIixcbiAgICBcInJvdW5kXCIsXG4gICAgXCJpb21zZ1wiLFxuICAgIFwic3luY2hyb25vdXNcIixcbiAgICBcIm5vcGFzc1wiLFxuICAgIFwibm9uX292ZXJyaWRhYmxlXCIsXG4gICAgXCJwYXNzXCIsXG4gICAgXCJwcm90ZWN0ZWRcIixcbiAgICBcInZvbGF0aWxlXCIsXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiZXh0ZW5kc1wiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJub25faW50cmluc2ljXCIsXG4gICAgXCJ2YWx1ZVwiLFxuICAgIFwiZGVmZXJyZWRcIixcbiAgICBcImdlbmVyaWNcIixcbiAgICBcImZpbmFsXCIsXG4gICAgXCJlbnVtZXJhdG9yXCIsXG4gICAgXCJjbGFzc1wiLFxuICAgIFwiYXNzb2NpYXRlXCIsXG4gICAgXCJiaW5kXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJjX2ludFwiLFxuICAgIFwiY19zaG9ydFwiLFxuICAgIFwiY19sb25nXCIsXG4gICAgXCJjX2xvbmdfbG9uZ1wiLFxuICAgIFwiY19zaWduZWRfY2hhclwiLFxuICAgIFwiY19zaXplX3RcIixcbiAgICBcImNfaW50OF90XCIsXG4gICAgXCJjX2ludDE2X3RcIixcbiAgICBcImNfaW50MzJfdFwiLFxuICAgIFwiY19pbnQ2NF90XCIsXG4gICAgXCJjX2ludF9sZWFzdDhfdFwiLFxuICAgIFwiY19pbnRfbGVhc3QxNl90XCIsXG4gICAgXCJjX2ludF9sZWFzdDMyX3RcIixcbiAgICBcImNfaW50X2xlYXN0NjRfdFwiLFxuICAgIFwiY19pbnRfZmFzdDhfdFwiLFxuICAgIFwiY19pbnRfZmFzdDE2X3RcIixcbiAgICBcImNfaW50X2Zhc3QzMl90XCIsXG4gICAgXCJjX2ludF9mYXN0NjRfdFwiLFxuICAgIFwiY19pbnRtYXhfdFwiLFxuICAgIFwiQ19pbnRwdHJfdFwiLFxuICAgIFwiY19mbG9hdFwiLFxuICAgIFwiY19kb3VibGVcIixcbiAgICBcImNfbG9uZ19kb3VibGVcIixcbiAgICBcImNfZmxvYXRfY29tcGxleFwiLFxuICAgIFwiY19kb3VibGVfY29tcGxleFwiLFxuICAgIFwiY19sb25nX2RvdWJsZV9jb21wbGV4XCIsXG4gICAgXCJjX2Jvb2xcIixcbiAgICBcImNfY2hhclwiLFxuICAgIFwiY19udWxsX3B0clwiLFxuICAgIFwiY19udWxsX2Z1bnB0clwiLFxuICAgIFwiY19uZXdfbGluZVwiLFxuICAgIFwiY19jYXJyaWFnZV9yZXR1cm5cIixcbiAgICBcImNfaG9yaXpvbnRhbF90YWJcIixcbiAgICBcImNfdmVydGljYWxfdGFiXCIsXG4gICAgXCJpc29fY19iaW5kaW5nXCIsXG4gICAgXCJjX2xvY1wiLFxuICAgIFwiY19mdW5sb2NcIixcbiAgICBcImNfYXNzb2NpYXRlZFwiLFxuICAgIFwiY19mX3BvaW50ZXJcIixcbiAgICBcImNfcHRyXCIsXG4gICAgXCJjX2Z1bnB0clwiLFxuICAgIFwiaXNvX2ZvcnRyYW5fZW52XCIsXG4gICAgXCJjaGFyYWN0ZXJfc3RvcmFnZV9zaXplXCIsXG4gICAgXCJlcnJvcl91bml0XCIsXG4gICAgXCJmaWxlX3N0b3JhZ2Vfc2l6ZVwiLFxuICAgIFwiaW5wdXRfdW5pdFwiLFxuICAgIFwiaW9zdGF0X2VuZFwiLFxuICAgIFwiaW9zdGF0X2VvclwiLFxuICAgIFwibnVtZXJpY19zdG9yYWdlX3NpemVcIixcbiAgICBcIm91dHB1dF91bml0XCIsXG4gICAgXCJjX2ZfcHJvY3BvaW50ZXJcIixcbiAgICBcImllZWVfYXJpdGhtZXRpY1wiLFxuICAgIFwiaWVlZV9zdXBwb3J0X3VuZGVyZmxvd19jb250cm9sXCIsXG4gICAgXCJpZWVlX2dldF91bmRlcmZsb3dfbW9kZVwiLFxuICAgIFwiaWVlZV9zZXRfdW5kZXJmbG93X21vZGVcIixcbiAgICBcIm5ld3VuaXRcIixcbiAgICBcImNvbnRpZ3VvdXNcIixcbiAgICBcInJlY3Vyc2l2ZVwiLFxuICAgIFwicGFkXCIsXG4gICAgXCJwb3NpdGlvblwiLFxuICAgIFwiYWN0aW9uXCIsXG4gICAgXCJkZWxpbVwiLFxuICAgIFwicmVhZHdyaXRlXCIsXG4gICAgXCJlb3JcIixcbiAgICBcImFkdmFuY2VcIixcbiAgICBcIm5tbFwiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJwcm9jZWR1cmVcIixcbiAgICBcIm5hbWVsaXN0XCIsXG4gICAgXCJpbmNsdWRlXCIsXG4gICAgXCJzZXF1ZW5jZVwiLFxuICAgIFwiZWxlbWVudGFsXCIsXG4gICAgXCJwdXJlXCIsXG4gICAgXCJpbXB1cmVcIixcbiAgICBcImludGVnZXJcIixcbiAgICBcInJlYWxcIixcbiAgICBcImNoYXJhY3RlclwiLFxuICAgIFwiY29tcGxleFwiLFxuICAgIFwibG9naWNhbFwiLFxuICAgIFwiY29kaW1lbnNpb25cIixcbiAgICBcImRpbWVuc2lvblwiLFxuICAgIFwiYWxsb2NhdGFibGV8MTBcIixcbiAgICBcInBhcmFtZXRlclwiLFxuICAgIFwiZXh0ZXJuYWxcIixcbiAgICBcImltcGxpY2l0fDEwXCIsXG4gICAgXCJub25lXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcInByZWNpc2lvblwiLFxuICAgIFwiYXNzaWduXCIsXG4gICAgXCJpbnRlbnRcIixcbiAgICBcIm9wdGlvbmFsXCIsXG4gICAgXCJwb2ludGVyXCIsXG4gICAgXCJ0YXJnZXRcIixcbiAgICBcImluXCIsXG4gICAgXCJvdXRcIixcbiAgICBcImNvbW1vblwiLFxuICAgIFwiZXF1aXZhbGVuY2VcIixcbiAgICBcImRhdGFcIlxuICBdO1xuICBjb25zdCBMSVRFUkFMUyA9IFtcbiAgICBcIi5GYWxzZS5cIixcbiAgICBcIi5UcnVlLlwiXG4gIF07XG4gIGNvbnN0IEJVSUxUX0lOUyA9IFtcbiAgICBcImFsb2dcIixcbiAgICBcImFsb2cxMFwiLFxuICAgIFwiYW1heDBcIixcbiAgICBcImFtYXgxXCIsXG4gICAgXCJhbWluMFwiLFxuICAgIFwiYW1pbjFcIixcbiAgICBcImFtb2RcIixcbiAgICBcImNhYnNcIixcbiAgICBcImNjb3NcIixcbiAgICBcImNleHBcIixcbiAgICBcImNsb2dcIixcbiAgICBcImNzaW5cIixcbiAgICBcImNzcXJ0XCIsXG4gICAgXCJkYWJzXCIsXG4gICAgXCJkYWNvc1wiLFxuICAgIFwiZGFzaW5cIixcbiAgICBcImRhdGFuXCIsXG4gICAgXCJkYXRhbjJcIixcbiAgICBcImRjb3NcIixcbiAgICBcImRjb3NoXCIsXG4gICAgXCJkZGltXCIsXG4gICAgXCJkZXhwXCIsXG4gICAgXCJkaW50XCIsXG4gICAgXCJkbG9nXCIsXG4gICAgXCJkbG9nMTBcIixcbiAgICBcImRtYXgxXCIsXG4gICAgXCJkbWluMVwiLFxuICAgIFwiZG1vZFwiLFxuICAgIFwiZG5pbnRcIixcbiAgICBcImRzaWduXCIsXG4gICAgXCJkc2luXCIsXG4gICAgXCJkc2luaFwiLFxuICAgIFwiZHNxcnRcIixcbiAgICBcImR0YW5cIixcbiAgICBcImR0YW5oXCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwiaWFic1wiLFxuICAgIFwiaWRpbVwiLFxuICAgIFwiaWRpbnRcIixcbiAgICBcImlkbmludFwiLFxuICAgIFwiaWZpeFwiLFxuICAgIFwiaXNpZ25cIixcbiAgICBcIm1heDBcIixcbiAgICBcIm1heDFcIixcbiAgICBcIm1pbjBcIixcbiAgICBcIm1pbjFcIixcbiAgICBcInNuZ2xcIixcbiAgICBcImFsZ2FtYVwiLFxuICAgIFwiY2RhYnNcIixcbiAgICBcImNkY29zXCIsXG4gICAgXCJjZGV4cFwiLFxuICAgIFwiY2Rsb2dcIixcbiAgICBcImNkc2luXCIsXG4gICAgXCJjZHNxcnRcIixcbiAgICBcImNxYWJzXCIsXG4gICAgXCJjcWNvc1wiLFxuICAgIFwiY3FleHBcIixcbiAgICBcImNxbG9nXCIsXG4gICAgXCJjcXNpblwiLFxuICAgIFwiY3FzcXJ0XCIsXG4gICAgXCJkY21wbHhcIixcbiAgICBcImRjb25qZ1wiLFxuICAgIFwiZGVyZlwiLFxuICAgIFwiZGVyZmNcIixcbiAgICBcImRmbG9hdFwiLFxuICAgIFwiZGdhbW1hXCIsXG4gICAgXCJkaW1hZ1wiLFxuICAgIFwiZGxnYW1hXCIsXG4gICAgXCJpcWludFwiLFxuICAgIFwicWFic1wiLFxuICAgIFwicWFjb3NcIixcbiAgICBcInFhc2luXCIsXG4gICAgXCJxYXRhblwiLFxuICAgIFwicWF0YW4yXCIsXG4gICAgXCJxY21wbHhcIixcbiAgICBcInFjb25qZ1wiLFxuICAgIFwicWNvc1wiLFxuICAgIFwicWNvc2hcIixcbiAgICBcInFkaW1cIixcbiAgICBcInFlcmZcIixcbiAgICBcInFlcmZjXCIsXG4gICAgXCJxZXhwXCIsXG4gICAgXCJxZ2FtbWFcIixcbiAgICBcInFpbWFnXCIsXG4gICAgXCJxbGdhbWFcIixcbiAgICBcInFsb2dcIixcbiAgICBcInFsb2cxMFwiLFxuICAgIFwicW1heDFcIixcbiAgICBcInFtaW4xXCIsXG4gICAgXCJxbW9kXCIsXG4gICAgXCJxbmludFwiLFxuICAgIFwicXNpZ25cIixcbiAgICBcInFzaW5cIixcbiAgICBcInFzaW5oXCIsXG4gICAgXCJxc3FydFwiLFxuICAgIFwicXRhblwiLFxuICAgIFwicXRhbmhcIixcbiAgICBcImFic1wiLFxuICAgIFwiYWNvc1wiLFxuICAgIFwiYWltYWdcIixcbiAgICBcImFpbnRcIixcbiAgICBcImFuaW50XCIsXG4gICAgXCJhc2luXCIsXG4gICAgXCJhdGFuXCIsXG4gICAgXCJhdGFuMlwiLFxuICAgIFwiY2hhclwiLFxuICAgIFwiY21wbHhcIixcbiAgICBcImNvbmpnXCIsXG4gICAgXCJjb3NcIixcbiAgICBcImNvc2hcIixcbiAgICBcImV4cFwiLFxuICAgIFwiaWNoYXJcIixcbiAgICBcImluZGV4XCIsXG4gICAgXCJpbnRcIixcbiAgICBcImxvZ1wiLFxuICAgIFwibG9nMTBcIixcbiAgICBcIm1heFwiLFxuICAgIFwibWluXCIsXG4gICAgXCJuaW50XCIsXG4gICAgXCJzaWduXCIsXG4gICAgXCJzaW5cIixcbiAgICBcInNpbmhcIixcbiAgICBcInNxcnRcIixcbiAgICBcInRhblwiLFxuICAgIFwidGFuaFwiLFxuICAgIFwicHJpbnRcIixcbiAgICBcIndyaXRlXCIsXG4gICAgXCJkaW1cIixcbiAgICBcImxnZVwiLFxuICAgIFwibGd0XCIsXG4gICAgXCJsbGVcIixcbiAgICBcImxsdFwiLFxuICAgIFwibW9kXCIsXG4gICAgXCJudWxsaWZ5XCIsXG4gICAgXCJhbGxvY2F0ZVwiLFxuICAgIFwiZGVhbGxvY2F0ZVwiLFxuICAgIFwiYWRqdXN0bFwiLFxuICAgIFwiYWRqdXN0clwiLFxuICAgIFwiYWxsXCIsXG4gICAgXCJhbGxvY2F0ZWRcIixcbiAgICBcImFueVwiLFxuICAgIFwiYXNzb2NpYXRlZFwiLFxuICAgIFwiYml0X3NpemVcIixcbiAgICBcImJ0ZXN0XCIsXG4gICAgXCJjZWlsaW5nXCIsXG4gICAgXCJjb3VudFwiLFxuICAgIFwiY3NoaWZ0XCIsXG4gICAgXCJkYXRlX2FuZF90aW1lXCIsXG4gICAgXCJkaWdpdHNcIixcbiAgICBcImRvdF9wcm9kdWN0XCIsXG4gICAgXCJlb3NoaWZ0XCIsXG4gICAgXCJlcHNpbG9uXCIsXG4gICAgXCJleHBvbmVudFwiLFxuICAgIFwiZmxvb3JcIixcbiAgICBcImZyYWN0aW9uXCIsXG4gICAgXCJodWdlXCIsXG4gICAgXCJpYW5kXCIsXG4gICAgXCJpYmNsclwiLFxuICAgIFwiaWJpdHNcIixcbiAgICBcImlic2V0XCIsXG4gICAgXCJpZW9yXCIsXG4gICAgXCJpb3JcIixcbiAgICBcImlzaGZ0XCIsXG4gICAgXCJpc2hmdGNcIixcbiAgICBcImxib3VuZFwiLFxuICAgIFwibGVuX3RyaW1cIixcbiAgICBcIm1hdG11bFwiLFxuICAgIFwibWF4ZXhwb25lbnRcIixcbiAgICBcIm1heGxvY1wiLFxuICAgIFwibWF4dmFsXCIsXG4gICAgXCJtZXJnZVwiLFxuICAgIFwibWluZXhwb25lbnRcIixcbiAgICBcIm1pbmxvY1wiLFxuICAgIFwibWludmFsXCIsXG4gICAgXCJtb2R1bG9cIixcbiAgICBcIm12Yml0c1wiLFxuICAgIFwibmVhcmVzdFwiLFxuICAgIFwicGFja1wiLFxuICAgIFwicHJlc2VudFwiLFxuICAgIFwicHJvZHVjdFwiLFxuICAgIFwicmFkaXhcIixcbiAgICBcInJhbmRvbV9udW1iZXJcIixcbiAgICBcInJhbmRvbV9zZWVkXCIsXG4gICAgXCJyYW5nZVwiLFxuICAgIFwicmVwZWF0XCIsXG4gICAgXCJyZXNoYXBlXCIsXG4gICAgXCJycnNwYWNpbmdcIixcbiAgICBcInNjYWxlXCIsXG4gICAgXCJzY2FuXCIsXG4gICAgXCJzZWxlY3RlZF9pbnRfa2luZFwiLFxuICAgIFwic2VsZWN0ZWRfcmVhbF9raW5kXCIsXG4gICAgXCJzZXRfZXhwb25lbnRcIixcbiAgICBcInNoYXBlXCIsXG4gICAgXCJzaXplXCIsXG4gICAgXCJzcGFjaW5nXCIsXG4gICAgXCJzcHJlYWRcIixcbiAgICBcInN1bVwiLFxuICAgIFwic3lzdGVtX2Nsb2NrXCIsXG4gICAgXCJ0aW55XCIsXG4gICAgXCJ0cmFuc3Bvc2VcIixcbiAgICBcInRyaW1cIixcbiAgICBcInVib3VuZFwiLFxuICAgIFwidW5wYWNrXCIsXG4gICAgXCJ2ZXJpZnlcIixcbiAgICBcImFjaGFyXCIsXG4gICAgXCJpYWNoYXJcIixcbiAgICBcInRyYW5zZmVyXCIsXG4gICAgXCJkYmxlXCIsXG4gICAgXCJlbnRyeVwiLFxuICAgIFwiZHByb2RcIixcbiAgICBcImNwdV90aW1lXCIsXG4gICAgXCJjb21tYW5kX2FyZ3VtZW50X2NvdW50XCIsXG4gICAgXCJnZXRfY29tbWFuZFwiLFxuICAgIFwiZ2V0X2NvbW1hbmRfYXJndW1lbnRcIixcbiAgICBcImdldF9lbnZpcm9ubWVudF92YXJpYWJsZVwiLFxuICAgIFwiaXNfaW9zdGF0X2VuZFwiLFxuICAgIFwiaWVlZV9hcml0aG1ldGljXCIsXG4gICAgXCJpZWVlX3N1cHBvcnRfdW5kZXJmbG93X2NvbnRyb2xcIixcbiAgICBcImllZWVfZ2V0X3VuZGVyZmxvd19tb2RlXCIsXG4gICAgXCJpZWVlX3NldF91bmRlcmZsb3dfbW9kZVwiLFxuICAgIFwiaXNfaW9zdGF0X2VvclwiLFxuICAgIFwibW92ZV9hbGxvY1wiLFxuICAgIFwibmV3X2xpbmVcIixcbiAgICBcInNlbGVjdGVkX2NoYXJfa2luZFwiLFxuICAgIFwic2FtZV90eXBlX2FzXCIsXG4gICAgXCJleHRlbmRzX3R5cGVfb2ZcIixcbiAgICBcImFjb3NoXCIsXG4gICAgXCJhc2luaFwiLFxuICAgIFwiYXRhbmhcIixcbiAgICBcImJlc3NlbF9qMFwiLFxuICAgIFwiYmVzc2VsX2oxXCIsXG4gICAgXCJiZXNzZWxfam5cIixcbiAgICBcImJlc3NlbF95MFwiLFxuICAgIFwiYmVzc2VsX3kxXCIsXG4gICAgXCJiZXNzZWxfeW5cIixcbiAgICBcImVyZlwiLFxuICAgIFwiZXJmY1wiLFxuICAgIFwiZXJmY19zY2FsZWRcIixcbiAgICBcImdhbW1hXCIsXG4gICAgXCJsb2dfZ2FtbWFcIixcbiAgICBcImh5cG90XCIsXG4gICAgXCJub3JtMlwiLFxuICAgIFwiYXRvbWljX2RlZmluZVwiLFxuICAgIFwiYXRvbWljX3JlZlwiLFxuICAgIFwiZXhlY3V0ZV9jb21tYW5kX2xpbmVcIixcbiAgICBcImxlYWR6XCIsXG4gICAgXCJ0cmFpbHpcIixcbiAgICBcInN0b3JhZ2Vfc2l6ZVwiLFxuICAgIFwibWVyZ2VfYml0c1wiLFxuICAgIFwiYmdlXCIsXG4gICAgXCJiZ3RcIixcbiAgICBcImJsZVwiLFxuICAgIFwiYmx0XCIsXG4gICAgXCJkc2hpZnRsXCIsXG4gICAgXCJkc2hpZnRyXCIsXG4gICAgXCJmaW5kbG9jXCIsXG4gICAgXCJpYWxsXCIsXG4gICAgXCJpYW55XCIsXG4gICAgXCJpcGFyaXR5XCIsXG4gICAgXCJpbWFnZV9pbmRleFwiLFxuICAgIFwibGNvYm91bmRcIixcbiAgICBcInVjb2JvdW5kXCIsXG4gICAgXCJtYXNrbFwiLFxuICAgIFwibWFza3JcIixcbiAgICBcIm51bV9pbWFnZXNcIixcbiAgICBcInBhcml0eVwiLFxuICAgIFwicG9wY250XCIsXG4gICAgXCJwb3BwYXJcIixcbiAgICBcInNoaWZ0YVwiLFxuICAgIFwic2hpZnRsXCIsXG4gICAgXCJzaGlmdHJcIixcbiAgICBcInRoaXNfaW1hZ2VcIixcbiAgICBcInN5bmNcIixcbiAgICBcImNoYW5nZVwiLFxuICAgIFwidGVhbVwiLFxuICAgIFwiY29fYnJvYWRjYXN0XCIsXG4gICAgXCJjb19tYXhcIixcbiAgICBcImNvX21pblwiLFxuICAgIFwiY29fc3VtXCIsXG4gICAgXCJjb19yZWR1Y2VcIlxuICBdO1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdGb3J0cmFuJyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGFsaWFzZXM6IFtcbiAgICAgICdmOTAnLFxuICAgICAgJ2Y5NSdcbiAgICBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiBLRVlXT1JEUyxcbiAgICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgICAgYnVpbHRfaW46IEJVSUxUX0lOU1xuICAgIH0sXG4gICAgaWxsZWdhbDogL1xcL1xcKi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFNUUklORyxcbiAgICAgIEZVTkNUSU9OX0RFRixcbiAgICAgIC8vIGFsbG93IGBDID0gdmFsdWVgIGZvciBhc3NpZ25tZW50cyBzbyB0aGV5IGFyZW4ndCBtaXNkZXRlY3RlZFxuICAgICAgLy8gYXMgRm9ydHJhbiA3NyBzdHlsZSBjb21tZW50c1xuICAgICAge1xuICAgICAgICBiZWdpbjogL15DXFxzKj0oPyE9KS8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIENPTU1FTlQsXG4gICAgICBOVU1CRVJcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGZvcnRyYW4gYXMgZGVmYXVsdCB9O1xuIl19