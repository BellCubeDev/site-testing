function mercury(hljs) {
    const KEYWORDS = {
        keyword: 'module use_module import_module include_module end_module initialise '
            + 'mutable initialize finalize finalise interface implementation pred '
            + 'mode func type inst solver any_pred any_func is semidet det nondet '
            + 'multi erroneous failure cc_nondet cc_multi typeclass instance where '
            + 'pragma promise external trace atomic or_else require_complete_switch '
            + 'require_det require_semidet require_multi require_nondet '
            + 'require_cc_multi require_cc_nondet require_erroneous require_failure',
        meta: 'inline no_inline type_spec source_file fact_table obsolete memo '
            + 'loop_check minimal_model terminates does_not_terminate '
            + 'check_termination promise_equivalent_clauses '
            + 'foreign_proc foreign_decl foreign_code foreign_type '
            + 'foreign_import_module foreign_export_enum foreign_export '
            + 'foreign_enum may_call_mercury will_not_call_mercury thread_safe '
            + 'not_thread_safe maybe_thread_safe promise_pure promise_semipure '
            + 'tabled_for_io local untrailed trailed attach_to_io_state '
            + 'can_pass_as_mercury_type stable will_not_throw_exception '
            + 'may_modify_trail will_not_modify_trail may_duplicate '
            + 'may_not_duplicate affects_liveness does_not_affect_liveness '
            + 'doesnt_affect_liveness no_sharing unknown_sharing sharing',
        built_in: 'some all not if then else true fail false try catch catch_any '
            + 'semidet_true semidet_false semidet_fail impure_true impure semipure'
    };
    const COMMENT = hljs.COMMENT('%', '$');
    const NUMCODE = {
        className: 'number',
        begin: "0'.\\|0[box][0-9a-fA-F]*"
    };
    const ATOM = hljs.inherit(hljs.APOS_STRING_MODE, { relevance: 0 });
    const STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, { relevance: 0 });
    const STRING_FMT = {
        className: 'subst',
        begin: '\\\\[abfnrtv]\\|\\\\x[0-9a-fA-F]*\\\\\\|%[-+# *.0-9]*[dioxXucsfeEgGp]',
        relevance: 0
    };
    STRING.contains = STRING.contains.slice();
    STRING.contains.push(STRING_FMT);
    const IMPLICATION = {
        className: 'built_in',
        variants: [
            { begin: '<=>' },
            {
                begin: '<=',
                relevance: 0
            },
            {
                begin: '=>',
                relevance: 0
            },
            { begin: '/\\\\' },
            { begin: '\\\\/' }
        ]
    };
    const HEAD_BODY_CONJUNCTION = {
        className: 'built_in',
        variants: [
            { begin: ':-\\|-->' },
            {
                begin: '=',
                relevance: 0
            }
        ]
    };
    return {
        name: 'Mercury',
        aliases: [
            'm',
            'moo'
        ],
        keywords: KEYWORDS,
        contains: [
            IMPLICATION,
            HEAD_BODY_CONJUNCTION,
            COMMENT,
            hljs.C_BLOCK_COMMENT_MODE,
            NUMCODE,
            hljs.NUMBER_MODE,
            ATOM,
            STRING,
            {
                begin: /:-/
            },
            {
                begin: /\.$/
            }
        ]
    };
}
export { mercury as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyY3VyeS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL21lcmN1cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFDTCx1RUFBdUU7Y0FDckUscUVBQXFFO2NBQ3JFLHFFQUFxRTtjQUNyRSxzRUFBc0U7Y0FDdEUsdUVBQXVFO2NBQ3ZFLDJEQUEyRDtjQUMzRCxzRUFBc0U7UUFDMUUsSUFBSSxFQUVGLGtFQUFrRTtjQUNoRSx5REFBeUQ7Y0FDekQsK0NBQStDO2NBRS9DLHNEQUFzRDtjQUN0RCwyREFBMkQ7Y0FDM0Qsa0VBQWtFO2NBQ2xFLGtFQUFrRTtjQUNsRSwyREFBMkQ7Y0FDM0QsMkRBQTJEO2NBQzNELHVEQUF1RDtjQUN2RCw4REFBOEQ7Y0FDOUQsMkRBQTJEO1FBQy9ELFFBQVEsRUFDTixnRUFBZ0U7Y0FDOUQscUVBQXFFO0tBQzFFLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUV2QyxNQUFNLE9BQU8sR0FBRztRQUNkLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSwwQkFBMEI7S0FDbEMsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0RSxNQUFNLFVBQVUsR0FBRztRQUNqQixTQUFTLEVBQUUsT0FBTztRQUNsQixLQUFLLEVBQUUsdUVBQXVFO1FBQzlFLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUNGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVqQyxNQUFNLFdBQVcsR0FBRztRQUNsQixTQUFTLEVBQUUsVUFBVTtRQUNyQixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDaEI7Z0JBQ0UsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLEtBQUssRUFBRSxJQUFJO2dCQUNYLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRCxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDbEIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO1NBQ25CO0tBQ0YsQ0FBQztJQUVGLE1BQU0scUJBQXFCLEdBQUc7UUFDNUIsU0FBUyxFQUFFLFVBQVU7UUFDckIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3JCO2dCQUNFLEtBQUssRUFBRSxHQUFHO2dCQUNWLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUU7WUFDUCxHQUFHO1lBQ0gsS0FBSztTQUNOO1FBQ0QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsV0FBVztZQUNYLHFCQUFxQjtZQUNyQixPQUFPO1lBQ1AsSUFBSSxDQUFDLG9CQUFvQjtZQUN6QixPQUFPO1lBQ1AsSUFBSSxDQUFDLFdBQVc7WUFDaEIsSUFBSTtZQUNKLE1BQU07WUFDTjtnQkFDRSxLQUFLLEVBQUUsSUFBSTthQUFFO1lBQ2Y7Z0JBQ0UsS0FBSyxFQUFFLEtBQUs7YUFBRTtTQUNqQjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogTWVyY3VyeVxuQXV0aG9yOiBtdWNhaG8gPG1rdWNrb0BnbWFpbC5jb20+XG5EZXNjcmlwdGlvbjogTWVyY3VyeSBpcyBhIGxvZ2ljL2Z1bmN0aW9uYWwgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2Ugd2hpY2ggY29tYmluZXMgdGhlIGNsYXJpdHkgYW5kIGV4cHJlc3NpdmVuZXNzIG9mIGRlY2xhcmF0aXZlIHByb2dyYW1taW5nIHdpdGggYWR2YW5jZWQgc3RhdGljIGFuYWx5c2lzIGFuZCBlcnJvciBkZXRlY3Rpb24gZmVhdHVyZXMuXG5XZWJzaXRlOiBodHRwczovL3d3dy5tZXJjdXJ5bGFuZy5vcmdcbiovXG5cbmZ1bmN0aW9uIG1lcmN1cnkoaGxqcykge1xuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ21vZHVsZSB1c2VfbW9kdWxlIGltcG9ydF9tb2R1bGUgaW5jbHVkZV9tb2R1bGUgZW5kX21vZHVsZSBpbml0aWFsaXNlICdcbiAgICAgICsgJ211dGFibGUgaW5pdGlhbGl6ZSBmaW5hbGl6ZSBmaW5hbGlzZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb24gcHJlZCAnXG4gICAgICArICdtb2RlIGZ1bmMgdHlwZSBpbnN0IHNvbHZlciBhbnlfcHJlZCBhbnlfZnVuYyBpcyBzZW1pZGV0IGRldCBub25kZXQgJ1xuICAgICAgKyAnbXVsdGkgZXJyb25lb3VzIGZhaWx1cmUgY2Nfbm9uZGV0IGNjX211bHRpIHR5cGVjbGFzcyBpbnN0YW5jZSB3aGVyZSAnXG4gICAgICArICdwcmFnbWEgcHJvbWlzZSBleHRlcm5hbCB0cmFjZSBhdG9taWMgb3JfZWxzZSByZXF1aXJlX2NvbXBsZXRlX3N3aXRjaCAnXG4gICAgICArICdyZXF1aXJlX2RldCByZXF1aXJlX3NlbWlkZXQgcmVxdWlyZV9tdWx0aSByZXF1aXJlX25vbmRldCAnXG4gICAgICArICdyZXF1aXJlX2NjX211bHRpIHJlcXVpcmVfY2Nfbm9uZGV0IHJlcXVpcmVfZXJyb25lb3VzIHJlcXVpcmVfZmFpbHVyZScsXG4gICAgbWV0YTpcbiAgICAgIC8vIHByYWdtYVxuICAgICAgJ2lubGluZSBub19pbmxpbmUgdHlwZV9zcGVjIHNvdXJjZV9maWxlIGZhY3RfdGFibGUgb2Jzb2xldGUgbWVtbyAnXG4gICAgICArICdsb29wX2NoZWNrIG1pbmltYWxfbW9kZWwgdGVybWluYXRlcyBkb2VzX25vdF90ZXJtaW5hdGUgJ1xuICAgICAgKyAnY2hlY2tfdGVybWluYXRpb24gcHJvbWlzZV9lcXVpdmFsZW50X2NsYXVzZXMgJ1xuICAgICAgLy8gcHJlcHJvY2Vzc29yXG4gICAgICArICdmb3JlaWduX3Byb2MgZm9yZWlnbl9kZWNsIGZvcmVpZ25fY29kZSBmb3JlaWduX3R5cGUgJ1xuICAgICAgKyAnZm9yZWlnbl9pbXBvcnRfbW9kdWxlIGZvcmVpZ25fZXhwb3J0X2VudW0gZm9yZWlnbl9leHBvcnQgJ1xuICAgICAgKyAnZm9yZWlnbl9lbnVtIG1heV9jYWxsX21lcmN1cnkgd2lsbF9ub3RfY2FsbF9tZXJjdXJ5IHRocmVhZF9zYWZlICdcbiAgICAgICsgJ25vdF90aHJlYWRfc2FmZSBtYXliZV90aHJlYWRfc2FmZSBwcm9taXNlX3B1cmUgcHJvbWlzZV9zZW1pcHVyZSAnXG4gICAgICArICd0YWJsZWRfZm9yX2lvIGxvY2FsIHVudHJhaWxlZCB0cmFpbGVkIGF0dGFjaF90b19pb19zdGF0ZSAnXG4gICAgICArICdjYW5fcGFzc19hc19tZXJjdXJ5X3R5cGUgc3RhYmxlIHdpbGxfbm90X3Rocm93X2V4Y2VwdGlvbiAnXG4gICAgICArICdtYXlfbW9kaWZ5X3RyYWlsIHdpbGxfbm90X21vZGlmeV90cmFpbCBtYXlfZHVwbGljYXRlICdcbiAgICAgICsgJ21heV9ub3RfZHVwbGljYXRlIGFmZmVjdHNfbGl2ZW5lc3MgZG9lc19ub3RfYWZmZWN0X2xpdmVuZXNzICdcbiAgICAgICsgJ2RvZXNudF9hZmZlY3RfbGl2ZW5lc3Mgbm9fc2hhcmluZyB1bmtub3duX3NoYXJpbmcgc2hhcmluZycsXG4gICAgYnVpbHRfaW46XG4gICAgICAnc29tZSBhbGwgbm90IGlmIHRoZW4gZWxzZSB0cnVlIGZhaWwgZmFsc2UgdHJ5IGNhdGNoIGNhdGNoX2FueSAnXG4gICAgICArICdzZW1pZGV0X3RydWUgc2VtaWRldF9mYWxzZSBzZW1pZGV0X2ZhaWwgaW1wdXJlX3RydWUgaW1wdXJlIHNlbWlwdXJlJ1xuICB9O1xuXG4gIGNvbnN0IENPTU1FTlQgPSBobGpzLkNPTU1FTlQoJyUnLCAnJCcpO1xuXG4gIGNvbnN0IE5VTUNPREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogXCIwJy5cXFxcfDBbYm94XVswLTlhLWZBLUZdKlwiXG4gIH07XG5cbiAgY29uc3QgQVRPTSA9IGhsanMuaW5oZXJpdChobGpzLkFQT1NfU1RSSU5HX01PREUsIHsgcmVsZXZhbmNlOiAwIH0pO1xuICBjb25zdCBTVFJJTkcgPSBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgeyByZWxldmFuY2U6IDAgfSk7XG4gIGNvbnN0IFNUUklOR19GTVQgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnXFxcXFxcXFxbYWJmbnJ0dl1cXFxcfFxcXFxcXFxceFswLTlhLWZBLUZdKlxcXFxcXFxcXFxcXHwlWy0rIyAqLjAtOV0qW2Rpb3hYdWNzZmVFZ0dwXScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIFNUUklORy5jb250YWlucyA9IFNUUklORy5jb250YWlucy5zbGljZSgpOyAvLyB3ZSBuZWVkIG91ciBvd24gY29weSBvZiBjb250YWluc1xuICBTVFJJTkcuY29udGFpbnMucHVzaChTVFJJTkdfRk1UKTtcblxuICBjb25zdCBJTVBMSUNBVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46ICc8PT4nIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPD0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPT4nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IGJlZ2luOiAnL1xcXFxcXFxcJyB9LFxuICAgICAgeyBiZWdpbjogJ1xcXFxcXFxcLycgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBIRUFEX0JPRFlfQ09OSlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnYnVpbHRfaW4nLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IGJlZ2luOiAnOi1cXFxcfC0tPicgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc9JyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ01lcmN1cnknLFxuICAgIGFsaWFzZXM6IFtcbiAgICAgICdtJyxcbiAgICAgICdtb28nXG4gICAgXSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIElNUExJQ0FUSU9OLFxuICAgICAgSEVBRF9CT0RZX0NPTkpVTkNUSU9OLFxuICAgICAgQ09NTUVOVCxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBOVU1DT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIEFUT00sXG4gICAgICBTVFJJTkcsXG4gICAgICB7IC8vIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICAgIGJlZ2luOiAvOi0vIH0sXG4gICAgICB7IC8vIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICAgIGJlZ2luOiAvXFwuJC8gfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgbWVyY3VyeSBhcyBkZWZhdWx0IH07XG4iXX0=