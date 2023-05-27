function llvm(hljs) {
    const regex = hljs.regex;
    const IDENT_RE = /([-a-zA-Z$._][\w$.-]*)/;
    const TYPE = {
        className: 'type',
        begin: /\bi\d+(?=\s|\b)/
    };
    const OPERATOR = {
        className: 'operator',
        relevance: 0,
        begin: /=/
    };
    const PUNCTUATION = {
        className: 'punctuation',
        relevance: 0,
        begin: /,/
    };
    const NUMBER = {
        className: 'number',
        variants: [
            { begin: /[su]?0[xX][KMLHR]?[a-fA-F0-9]+/ },
            { begin: /[-+]?\d+(?:[.]\d+)?(?:[eE][-+]?\d+(?:[.]\d+)?)?/ }
        ],
        relevance: 0
    };
    const LABEL = {
        className: 'symbol',
        variants: [{ begin: /^\s*[a-z]+:/ },
        ],
        relevance: 0
    };
    const VARIABLE = {
        className: 'variable',
        variants: [
            { begin: regex.concat(/%/, IDENT_RE) },
            { begin: /%\d+/ },
            { begin: /#\d+/ },
        ]
    };
    const FUNCTION = {
        className: 'title',
        variants: [
            { begin: regex.concat(/@/, IDENT_RE) },
            { begin: /@\d+/ },
            { begin: regex.concat(/!/, IDENT_RE) },
            { begin: regex.concat(/!\d+/, IDENT_RE) },
            { begin: /!\d+/ }
        ]
    };
    return {
        name: 'LLVM IR',
        keywords: 'begin end true false declare define global '
            + 'constant private linker_private internal '
            + 'available_externally linkonce linkonce_odr weak '
            + 'weak_odr appending dllimport dllexport common '
            + 'default hidden protected extern_weak external '
            + 'thread_local zeroinitializer undef null to tail '
            + 'target triple datalayout volatile nuw nsw nnan '
            + 'ninf nsz arcp fast exact inbounds align '
            + 'addrspace section alias module asm sideeffect '
            + 'gc dbg linker_private_weak attributes blockaddress '
            + 'initialexec localdynamic localexec prefix unnamed_addr '
            + 'ccc fastcc coldcc x86_stdcallcc x86_fastcallcc '
            + 'arm_apcscc arm_aapcscc arm_aapcs_vfpcc ptx_device '
            + 'ptx_kernel intel_ocl_bicc msp430_intrcc spir_func '
            + 'spir_kernel x86_64_sysvcc x86_64_win64cc x86_thiscallcc '
            + 'cc c signext zeroext inreg sret nounwind '
            + 'noreturn noalias nocapture byval nest readnone '
            + 'readonly inlinehint noinline alwaysinline optsize ssp '
            + 'sspreq noredzone noimplicitfloat naked builtin cold '
            + 'nobuiltin noduplicate nonlazybind optnone returns_twice '
            + 'sanitize_address sanitize_memory sanitize_thread sspstrong '
            + 'uwtable returned type opaque eq ne slt sgt '
            + 'sle sge ult ugt ule uge oeq one olt ogt '
            + 'ole oge ord uno ueq une x acq_rel acquire '
            + 'alignstack atomic catch cleanup filter inteldialect '
            + 'max min monotonic nand personality release seq_cst '
            + 'singlethread umax umin unordered xchg add fadd '
            + 'sub fsub mul fmul udiv sdiv fdiv urem srem '
            + 'frem shl lshr ashr and or xor icmp fcmp '
            + 'phi call trunc zext sext fptrunc fpext uitofp '
            + 'sitofp fptoui fptosi inttoptr ptrtoint bitcast '
            + 'addrspacecast select va_arg ret br switch invoke '
            + 'unwind unreachable indirectbr landingpad resume '
            + 'malloc alloca free load store getelementptr '
            + 'extractelement insertelement shufflevector getresult '
            + 'extractvalue insertvalue atomicrmw cmpxchg fence '
            + 'argmemonly double',
        contains: [
            TYPE,
            hljs.COMMENT(/;\s*$/, null, { relevance: 0 }),
            hljs.COMMENT(/;/, /$/),
            {
                className: 'string',
                begin: /"/,
                end: /"/,
                contains: [
                    {
                        className: 'char.escape',
                        match: /\\\d\d/
                    }
                ]
            },
            FUNCTION,
            PUNCTUATION,
            OPERATOR,
            VARIABLE,
            LABEL,
            NUMBER
        ]
    };
}
export { llvm as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGx2bS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2xsdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDO0lBQzFDLE1BQU0sSUFBSSxHQUFHO1FBQ1gsU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLGlCQUFpQjtLQUN6QixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUc7UUFDZixTQUFTLEVBQUUsVUFBVTtRQUNyQixTQUFTLEVBQUUsQ0FBQztRQUNaLEtBQUssRUFBRSxHQUFHO0tBQ1gsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLFNBQVMsRUFBRSxhQUFhO1FBQ3hCLFNBQVMsRUFBRSxDQUFDO1FBQ1osS0FBSyxFQUFFLEdBQUc7S0FDWCxDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxnQ0FBZ0MsRUFBRTtZQUMzQyxFQUFFLEtBQUssRUFBRSxpREFBaUQsRUFBRTtTQUM3RDtRQUNELFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHO1FBQ1osU0FBUyxFQUFFLFFBQVE7UUFDbkIsUUFBUSxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFO1NBQ25DO1FBQ0QsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUc7UUFDZixTQUFTLEVBQUUsVUFBVTtRQUNyQixRQUFRLEVBQUU7WUFDUixFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRTtZQUN0QyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDakIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1NBQ2xCO0tBQ0YsQ0FBQztJQUNGLE1BQU0sUUFBUSxHQUFHO1FBQ2YsU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDdEMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ2pCLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1lBR3pDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtTQUNsQjtLQUNGLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFNBQVM7UUFFZixRQUFRLEVBQ04sNkNBQTZDO2NBQzNDLDJDQUEyQztjQUMzQyxrREFBa0Q7Y0FDbEQsZ0RBQWdEO2NBQ2hELGdEQUFnRDtjQUNoRCxrREFBa0Q7Y0FDbEQsaURBQWlEO2NBQ2pELDBDQUEwQztjQUMxQyxnREFBZ0Q7Y0FDaEQscURBQXFEO2NBQ3JELHlEQUF5RDtjQUN6RCxpREFBaUQ7Y0FDakQsb0RBQW9EO2NBQ3BELG9EQUFvRDtjQUNwRCwwREFBMEQ7Y0FDMUQsMkNBQTJDO2NBQzNDLGlEQUFpRDtjQUNqRCx3REFBd0Q7Y0FDeEQsc0RBQXNEO2NBQ3RELDBEQUEwRDtjQUMxRCw2REFBNkQ7Y0FDN0QsNkNBQTZDO2NBQzdDLDBDQUEwQztjQUMxQyw0Q0FBNEM7Y0FDNUMsc0RBQXNEO2NBQ3RELHFEQUFxRDtjQUNyRCxpREFBaUQ7Y0FDakQsNkNBQTZDO2NBQzdDLDBDQUEwQztjQUMxQyxnREFBZ0Q7Y0FDaEQsaURBQWlEO2NBQ2pELG1EQUFtRDtjQUNuRCxrREFBa0Q7Y0FDbEQsOENBQThDO2NBQzlDLHVEQUF1RDtjQUN2RCxtREFBbUQ7Y0FDbkQsbUJBQW1CO1FBQ3ZCLFFBQVEsRUFBRTtZQUNSLElBQUk7WUFJSixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3RCO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsU0FBUyxFQUFFLGFBQWE7d0JBQ3hCLEtBQUssRUFBRSxRQUFRO3FCQUNoQjtpQkFDRjthQUNGO1lBQ0QsUUFBUTtZQUNSLFdBQVc7WUFDWCxRQUFRO1lBQ1IsUUFBUTtZQUNSLEtBQUs7WUFDTCxNQUFNO1NBQ1A7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IExMVk0gSVJcbkF1dGhvcjogTWljaGFlbCBSb2RsZXIgPGNvbnRhY3RAZjBya2kuYXQ+XG5EZXNjcmlwdGlvbjogbGFuZ3VhZ2UgdXNlZCBhcyBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb24gaW4gdGhlIExMVk0gY29tcGlsZXIgZnJhbWV3b3JrXG5XZWJzaXRlOiBodHRwczovL2xsdm0ub3JnL2RvY3MvTGFuZ1JlZi5odG1sXG5DYXRlZ29yeTogYXNzZW1ibGVyXG5BdWRpdDogMjAyMFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGxsdm0oaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IElERU5UX1JFID0gLyhbLWEtekEtWiQuX11bXFx3JC4tXSopLztcbiAgY29uc3QgVFlQRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICBiZWdpbjogL1xcYmlcXGQrKD89XFxzfFxcYikvXG4gIH07XG4gIGNvbnN0IE9QRVJBVE9SID0ge1xuICAgIGNsYXNzTmFtZTogJ29wZXJhdG9yJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgYmVnaW46IC89L1xuICB9O1xuICBjb25zdCBQVU5DVFVBVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdwdW5jdHVhdGlvbicsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGJlZ2luOiAvLC9cbiAgfTtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IC9bc3VdPzBbeFhdW0tNTEhSXT9bYS1mQS1GMC05XSsvIH0sXG4gICAgICB7IGJlZ2luOiAvWy0rXT9cXGQrKD86Wy5dXFxkKyk/KD86W2VFXVstK10/XFxkKyg/OlsuXVxcZCspPyk/LyB9XG4gICAgXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgTEFCRUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICB2YXJpYW50czogWyB7IGJlZ2luOiAvXlxccypbYS16XSs6LyB9LCAvLyBsYWJlbHNcbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICBjb25zdCBWQVJJQUJMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvJS8sIElERU5UX1JFKSB9LFxuICAgICAgeyBiZWdpbjogLyVcXGQrLyB9LFxuICAgICAgeyBiZWdpbjogLyNcXGQrLyB9LFxuICAgIF1cbiAgfTtcbiAgY29uc3QgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IGJlZ2luOiByZWdleC5jb25jYXQoL0AvLCBJREVOVF9SRSkgfSxcbiAgICAgIHsgYmVnaW46IC9AXFxkKy8gfSxcbiAgICAgIHsgYmVnaW46IHJlZ2V4LmNvbmNhdCgvIS8sIElERU5UX1JFKSB9LFxuICAgICAgeyBiZWdpbjogcmVnZXguY29uY2F0KC8hXFxkKy8sIElERU5UX1JFKSB9LFxuICAgICAgLy8gaHR0cHM6Ly9sbHZtLm9yZy9kb2NzL0xhbmdSZWYuaHRtbCNuYW1lZG1ldGFkYXRhc3RydWN0dXJlXG4gICAgICAvLyBvYnZpb3VzbHkgYSBzaW5nbGUgZGlnaXQgY2FuIGFsc28gYmUgdXNlZCBpbiB0aGlzIGZhc2hpb25cbiAgICAgIHsgYmVnaW46IC8hXFxkKy8gfVxuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdMTFZNIElSJyxcbiAgICAvLyBUT0RPOiBzcGxpdCBpbnRvIGRpZmZlcmVudCBjYXRlZ29yaWVzIG9mIGtleXdvcmRzXG4gICAga2V5d29yZHM6XG4gICAgICAnYmVnaW4gZW5kIHRydWUgZmFsc2UgZGVjbGFyZSBkZWZpbmUgZ2xvYmFsICdcbiAgICAgICsgJ2NvbnN0YW50IHByaXZhdGUgbGlua2VyX3ByaXZhdGUgaW50ZXJuYWwgJ1xuICAgICAgKyAnYXZhaWxhYmxlX2V4dGVybmFsbHkgbGlua29uY2UgbGlua29uY2Vfb2RyIHdlYWsgJ1xuICAgICAgKyAnd2Vha19vZHIgYXBwZW5kaW5nIGRsbGltcG9ydCBkbGxleHBvcnQgY29tbW9uICdcbiAgICAgICsgJ2RlZmF1bHQgaGlkZGVuIHByb3RlY3RlZCBleHRlcm5fd2VhayBleHRlcm5hbCAnXG4gICAgICArICd0aHJlYWRfbG9jYWwgemVyb2luaXRpYWxpemVyIHVuZGVmIG51bGwgdG8gdGFpbCAnXG4gICAgICArICd0YXJnZXQgdHJpcGxlIGRhdGFsYXlvdXQgdm9sYXRpbGUgbnV3IG5zdyBubmFuICdcbiAgICAgICsgJ25pbmYgbnN6IGFyY3AgZmFzdCBleGFjdCBpbmJvdW5kcyBhbGlnbiAnXG4gICAgICArICdhZGRyc3BhY2Ugc2VjdGlvbiBhbGlhcyBtb2R1bGUgYXNtIHNpZGVlZmZlY3QgJ1xuICAgICAgKyAnZ2MgZGJnIGxpbmtlcl9wcml2YXRlX3dlYWsgYXR0cmlidXRlcyBibG9ja2FkZHJlc3MgJ1xuICAgICAgKyAnaW5pdGlhbGV4ZWMgbG9jYWxkeW5hbWljIGxvY2FsZXhlYyBwcmVmaXggdW5uYW1lZF9hZGRyICdcbiAgICAgICsgJ2NjYyBmYXN0Y2MgY29sZGNjIHg4Nl9zdGRjYWxsY2MgeDg2X2Zhc3RjYWxsY2MgJ1xuICAgICAgKyAnYXJtX2FwY3NjYyBhcm1fYWFwY3NjYyBhcm1fYWFwY3NfdmZwY2MgcHR4X2RldmljZSAnXG4gICAgICArICdwdHhfa2VybmVsIGludGVsX29jbF9iaWNjIG1zcDQzMF9pbnRyY2Mgc3Bpcl9mdW5jICdcbiAgICAgICsgJ3NwaXJfa2VybmVsIHg4Nl82NF9zeXN2Y2MgeDg2XzY0X3dpbjY0Y2MgeDg2X3RoaXNjYWxsY2MgJ1xuICAgICAgKyAnY2MgYyBzaWduZXh0IHplcm9leHQgaW5yZWcgc3JldCBub3Vud2luZCAnXG4gICAgICArICdub3JldHVybiBub2FsaWFzIG5vY2FwdHVyZSBieXZhbCBuZXN0IHJlYWRub25lICdcbiAgICAgICsgJ3JlYWRvbmx5IGlubGluZWhpbnQgbm9pbmxpbmUgYWx3YXlzaW5saW5lIG9wdHNpemUgc3NwICdcbiAgICAgICsgJ3NzcHJlcSBub3JlZHpvbmUgbm9pbXBsaWNpdGZsb2F0IG5ha2VkIGJ1aWx0aW4gY29sZCAnXG4gICAgICArICdub2J1aWx0aW4gbm9kdXBsaWNhdGUgbm9ubGF6eWJpbmQgb3B0bm9uZSByZXR1cm5zX3R3aWNlICdcbiAgICAgICsgJ3Nhbml0aXplX2FkZHJlc3Mgc2FuaXRpemVfbWVtb3J5IHNhbml0aXplX3RocmVhZCBzc3BzdHJvbmcgJ1xuICAgICAgKyAndXd0YWJsZSByZXR1cm5lZCB0eXBlIG9wYXF1ZSBlcSBuZSBzbHQgc2d0ICdcbiAgICAgICsgJ3NsZSBzZ2UgdWx0IHVndCB1bGUgdWdlIG9lcSBvbmUgb2x0IG9ndCAnXG4gICAgICArICdvbGUgb2dlIG9yZCB1bm8gdWVxIHVuZSB4IGFjcV9yZWwgYWNxdWlyZSAnXG4gICAgICArICdhbGlnbnN0YWNrIGF0b21pYyBjYXRjaCBjbGVhbnVwIGZpbHRlciBpbnRlbGRpYWxlY3QgJ1xuICAgICAgKyAnbWF4IG1pbiBtb25vdG9uaWMgbmFuZCBwZXJzb25hbGl0eSByZWxlYXNlIHNlcV9jc3QgJ1xuICAgICAgKyAnc2luZ2xldGhyZWFkIHVtYXggdW1pbiB1bm9yZGVyZWQgeGNoZyBhZGQgZmFkZCAnXG4gICAgICArICdzdWIgZnN1YiBtdWwgZm11bCB1ZGl2IHNkaXYgZmRpdiB1cmVtIHNyZW0gJ1xuICAgICAgKyAnZnJlbSBzaGwgbHNociBhc2hyIGFuZCBvciB4b3IgaWNtcCBmY21wICdcbiAgICAgICsgJ3BoaSBjYWxsIHRydW5jIHpleHQgc2V4dCBmcHRydW5jIGZwZXh0IHVpdG9mcCAnXG4gICAgICArICdzaXRvZnAgZnB0b3VpIGZwdG9zaSBpbnR0b3B0ciBwdHJ0b2ludCBiaXRjYXN0ICdcbiAgICAgICsgJ2FkZHJzcGFjZWNhc3Qgc2VsZWN0IHZhX2FyZyByZXQgYnIgc3dpdGNoIGludm9rZSAnXG4gICAgICArICd1bndpbmQgdW5yZWFjaGFibGUgaW5kaXJlY3RiciBsYW5kaW5ncGFkIHJlc3VtZSAnXG4gICAgICArICdtYWxsb2MgYWxsb2NhIGZyZWUgbG9hZCBzdG9yZSBnZXRlbGVtZW50cHRyICdcbiAgICAgICsgJ2V4dHJhY3RlbGVtZW50IGluc2VydGVsZW1lbnQgc2h1ZmZsZXZlY3RvciBnZXRyZXN1bHQgJ1xuICAgICAgKyAnZXh0cmFjdHZhbHVlIGluc2VydHZhbHVlIGF0b21pY3JtdyBjbXB4Y2hnIGZlbmNlICdcbiAgICAgICsgJ2FyZ21lbW9ubHkgZG91YmxlJyxcbiAgICBjb250YWluczogW1xuICAgICAgVFlQRSxcbiAgICAgIC8vIHRoaXMgbWF0Y2hlcyBcImVtcHR5IGNvbW1lbnRzXCIuLi5cbiAgICAgIC8vIC4uLmJlY2F1c2UgaXQncyBmYXIgbW9yZSBsaWtlbHkgdGhpcyBpcyBhIHN0YXRlbWVudCB0ZXJtaW5hdG9yIGluXG4gICAgICAvLyBhbm90aGVyIGxhbmd1YWdlIHRoYW4gYW4gYWN0dWFsIGNvbW1lbnRcbiAgICAgIGhsanMuQ09NTUVOVCgvO1xccyokLywgbnVsbCwgeyByZWxldmFuY2U6IDAgfSksXG4gICAgICBobGpzLkNPTU1FTlQoLzsvLCAvJC8pLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogL1wiLyxcbiAgICAgICAgZW5kOiAvXCIvLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NoYXIuZXNjYXBlJyxcbiAgICAgICAgICAgIG1hdGNoOiAvXFxcXFxcZFxcZC9cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBGVU5DVElPTixcbiAgICAgIFBVTkNUVUFUSU9OLFxuICAgICAgT1BFUkFUT1IsXG4gICAgICBWQVJJQUJMRSxcbiAgICAgIExBQkVMLFxuICAgICAgTlVNQkVSXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBsbHZtIGFzIGRlZmF1bHQgfTtcbiJdfQ==