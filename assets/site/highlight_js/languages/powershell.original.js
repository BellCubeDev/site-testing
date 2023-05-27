function powershell(hljs) {
    const TYPES = [
        "string",
        "char",
        "byte",
        "int",
        "long",
        "bool",
        "decimal",
        "single",
        "double",
        "DateTime",
        "xml",
        "array",
        "hashtable",
        "void"
    ];
    const VALID_VERBS = 'Add|Clear|Close|Copy|Enter|Exit|Find|Format|Get|Hide|Join|Lock|'
        + 'Move|New|Open|Optimize|Pop|Push|Redo|Remove|Rename|Reset|Resize|'
        + 'Search|Select|Set|Show|Skip|Split|Step|Switch|Undo|Unlock|'
        + 'Watch|Backup|Checkpoint|Compare|Compress|Convert|ConvertFrom|'
        + 'ConvertTo|Dismount|Edit|Expand|Export|Group|Import|Initialize|'
        + 'Limit|Merge|Mount|Out|Publish|Restore|Save|Sync|Unpublish|Update|'
        + 'Approve|Assert|Build|Complete|Confirm|Deny|Deploy|Disable|Enable|Install|Invoke|'
        + 'Register|Request|Restart|Resume|Start|Stop|Submit|Suspend|Uninstall|'
        + 'Unregister|Wait|Debug|Measure|Ping|Repair|Resolve|Test|Trace|Connect|'
        + 'Disconnect|Read|Receive|Send|Write|Block|Grant|Protect|Revoke|Unblock|'
        + 'Unprotect|Use|ForEach|Sort|Tee|Where';
    const COMPARISON_OPERATORS = '-and|-as|-band|-bnot|-bor|-bxor|-casesensitive|-ccontains|-ceq|-cge|-cgt|'
        + '-cle|-clike|-clt|-cmatch|-cne|-cnotcontains|-cnotlike|-cnotmatch|-contains|'
        + '-creplace|-csplit|-eq|-exact|-f|-file|-ge|-gt|-icontains|-ieq|-ige|-igt|'
        + '-ile|-ilike|-ilt|-imatch|-in|-ine|-inotcontains|-inotlike|-inotmatch|'
        + '-ireplace|-is|-isnot|-isplit|-join|-le|-like|-lt|-match|-ne|-not|'
        + '-notcontains|-notin|-notlike|-notmatch|-or|-regex|-replace|-shl|-shr|'
        + '-split|-wildcard|-xor';
    const KEYWORDS = {
        $pattern: /-?[A-z\.\-]+\b/,
        keyword: 'if else foreach return do while until elseif begin for trap data dynamicparam '
            + 'end break throw param continue finally in switch exit filter try process catch '
            + 'hidden static parameter',
        built_in: 'ac asnp cat cd CFS chdir clc clear clhy cli clp cls clv cnsn compare copy cp '
            + 'cpi cpp curl cvpa dbp del diff dir dnsn ebp echo|0 epal epcsv epsn erase etsn exsn fc fhx '
            + 'fl ft fw gal gbp gc gcb gci gcm gcs gdr gerr ghy gi gin gjb gl gm gmo gp gps gpv group '
            + 'gsn gsnp gsv gtz gu gv gwmi h history icm iex ihy ii ipal ipcsv ipmo ipsn irm ise iwmi '
            + 'iwr kill lp ls man md measure mi mount move mp mv nal ndr ni nmo npssc nsn nv ogv oh '
            + 'popd ps pushd pwd r rbp rcjb rcsn rd rdr ren ri rjb rm rmdir rmo rni rnp rp rsn rsnp '
            + 'rujb rv rvpa rwmi sajb sal saps sasv sbp sc scb select set shcm si sl sleep sls sort sp '
            + 'spjb spps spsv start stz sujb sv swmi tee trcm type wget where wjb write'
    };
    const TITLE_NAME_RE = /\w[\w\d]*((-)[\w\d]+)*/;
    const BACKTICK_ESCAPE = {
        begin: '`[\\s\\S]',
        relevance: 0
    };
    const VAR = {
        className: 'variable',
        variants: [
            { begin: /\$\B/ },
            {
                className: 'keyword',
                begin: /\$this/
            },
            { begin: /\$[\w\d][\w\d_:]*/ }
        ]
    };
    const LITERAL = {
        className: 'literal',
        begin: /\$(null|true|false)\b/
    };
    const QUOTE_STRING = {
        className: "string",
        variants: [
            {
                begin: /"/,
                end: /"/
            },
            {
                begin: /@"/,
                end: /^"@/
            }
        ],
        contains: [
            BACKTICK_ESCAPE,
            VAR,
            {
                className: 'variable',
                begin: /\$[A-z]/,
                end: /[^A-z]/
            }
        ]
    };
    const APOS_STRING = {
        className: 'string',
        variants: [
            {
                begin: /'/,
                end: /'/
            },
            {
                begin: /@'/,
                end: /^'@/
            }
        ]
    };
    const PS_HELPTAGS = {
        className: "doctag",
        variants: [
            { begin: /\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/ },
            { begin: /\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/ }
        ]
    };
    const PS_COMMENT = hljs.inherit(hljs.COMMENT(null, null), {
        variants: [
            {
                begin: /#/,
                end: /$/
            },
            {
                begin: /<#/,
                end: /#>/
            }
        ],
        contains: [PS_HELPTAGS]
    });
    const CMDLETS = {
        className: 'built_in',
        variants: [{ begin: '('.concat(VALID_VERBS, ')+(-)[\\w\\d]+') }]
    };
    const PS_CLASS = {
        className: 'class',
        beginKeywords: 'class enum',
        end: /\s*[{]/,
        excludeEnd: true,
        relevance: 0,
        contains: [hljs.TITLE_MODE]
    };
    const PS_FUNCTION = {
        className: 'function',
        begin: /function\s+/,
        end: /\s*\{|$/,
        excludeEnd: true,
        returnBegin: true,
        relevance: 0,
        contains: [
            {
                begin: "function",
                relevance: 0,
                className: "keyword"
            },
            {
                className: "title",
                begin: TITLE_NAME_RE,
                relevance: 0
            },
            {
                begin: /\(/,
                end: /\)/,
                className: "params",
                relevance: 0,
                contains: [VAR]
            }
        ]
    };
    const PS_USING = {
        begin: /using\s/,
        end: /$/,
        returnBegin: true,
        contains: [
            QUOTE_STRING,
            APOS_STRING,
            {
                className: 'keyword',
                begin: /(using|assembly|command|module|namespace|type)/
            }
        ]
    };
    const PS_ARGUMENTS = { variants: [
            {
                className: 'operator',
                begin: '('.concat(COMPARISON_OPERATORS, ')\\b')
            },
            {
                className: 'literal',
                begin: /(-){1,2}[\w\d-]+/,
                relevance: 0
            }
        ] };
    const HASH_SIGNS = {
        className: 'selector-tag',
        begin: /@\B/,
        relevance: 0
    };
    const PS_METHODS = {
        className: 'function',
        begin: /\[.*\]\s*[\w]+[ ]??\(/,
        end: /$/,
        returnBegin: true,
        relevance: 0,
        contains: [
            {
                className: 'keyword',
                begin: '('.concat(KEYWORDS.keyword.toString().replace(/\s/g, '|'), ')\\b'),
                endsParent: true,
                relevance: 0
            },
            hljs.inherit(hljs.TITLE_MODE, { endsParent: true })
        ]
    };
    const GENTLEMANS_SET = [
        PS_METHODS,
        PS_COMMENT,
        BACKTICK_ESCAPE,
        hljs.NUMBER_MODE,
        QUOTE_STRING,
        APOS_STRING,
        CMDLETS,
        VAR,
        LITERAL,
        HASH_SIGNS
    ];
    const PS_TYPE = {
        begin: /\[/,
        end: /\]/,
        excludeBegin: true,
        excludeEnd: true,
        relevance: 0,
        contains: [].concat('self', GENTLEMANS_SET, {
            begin: "(" + TYPES.join("|") + ")",
            className: "built_in",
            relevance: 0
        }, {
            className: 'type',
            begin: /[\.\w\d]+/,
            relevance: 0
        })
    };
    PS_METHODS.contains.unshift(PS_TYPE);
    return {
        name: 'PowerShell',
        aliases: [
            "pwsh",
            "ps",
            "ps1"
        ],
        case_insensitive: true,
        keywords: KEYWORDS,
        contains: GENTLEMANS_SET.concat(PS_CLASS, PS_FUNCTION, PS_USING, PS_ARGUMENTS, PS_TYPE)
    };
}
export { powershell as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93ZXJzaGVsbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3Bvd2Vyc2hlbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxVQUFVLENBQUMsSUFBSTtJQUN0QixNQUFNLEtBQUssR0FBRztRQUNaLFFBQVE7UUFDUixNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxNQUFNO1FBQ04sTUFBTTtRQUNOLFNBQVM7UUFDVCxRQUFRO1FBQ1IsUUFBUTtRQUNSLFVBQVU7UUFDVixLQUFLO1FBQ0wsT0FBTztRQUNQLFdBQVc7UUFDWCxNQUFNO0tBQ1AsQ0FBQztJQUdGLE1BQU0sV0FBVyxHQUNmLGlFQUFpRTtVQUMvRCxrRUFBa0U7VUFDbEUsNERBQTREO1VBQzVELCtEQUErRDtVQUMvRCxnRUFBZ0U7VUFDaEUsbUVBQW1FO1VBQ25FLGtGQUFrRjtVQUNsRixzRUFBc0U7VUFDdEUsdUVBQXVFO1VBQ3ZFLHdFQUF3RTtVQUN4RSxzQ0FBc0MsQ0FBQztJQUUzQyxNQUFNLG9CQUFvQixHQUN4QiwyRUFBMkU7VUFDekUsNkVBQTZFO1VBQzdFLDBFQUEwRTtVQUMxRSx1RUFBdUU7VUFDdkUsbUVBQW1FO1VBQ25FLHVFQUF1RTtVQUN2RSx1QkFBdUIsQ0FBQztJQUU1QixNQUFNLFFBQVEsR0FBRztRQUNmLFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUIsT0FBTyxFQUNMLGdGQUFnRjtjQUM5RSxpRkFBaUY7Y0FDakYseUJBQXlCO1FBRTdCLFFBQVEsRUFDTiwrRUFBK0U7Y0FDN0UsNEZBQTRGO2NBQzVGLHlGQUF5RjtjQUN6Rix5RkFBeUY7Y0FDekYsdUZBQXVGO2NBQ3ZGLHVGQUF1RjtjQUN2RiwwRkFBMEY7Y0FDMUYsMEVBQTBFO0tBRS9FLENBQUM7SUFF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QUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQzdCLFFBQVEsRUFDUixXQUFXLEVBQ1gsUUFBUSxFQUNSLFlBQVksRUFDWixPQUFPLENBQ1I7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxVQUFVLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IFBvd2VyU2hlbGxcbkRlc2NyaXB0aW9uOiBQb3dlclNoZWxsIGlzIGEgdGFzay1iYXNlZCBjb21tYW5kLWxpbmUgc2hlbGwgYW5kIHNjcmlwdGluZyBsYW5ndWFnZSBidWlsdCBvbiAuTkVULlxuQXV0aG9yOiBEYXZpZCBNb2h1bmRybyA8ZGF2aWRAbW9odW5kcm8uY29tPlxuQ29udHJpYnV0b3JzOiBOaWNob2xhcyBCbHVtaGFyZHQgPG5ibHVtaGFyZHRAbmJsdW1oYXJkdC5jb20+LCBWaWN0b3IgWmhvdSA8T2lDTXVka2lwc0B1c2Vycy5ub3JlcGx5LmdpdGh1Yi5jb20+LCBOaWNvbGFzIExlIEdhbGwgPGNvbnRhY3RAbmxlZ2FsbC5mcj5cbldlYnNpdGU6IGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3Bvd2Vyc2hlbGwvXG4qL1xuXG5mdW5jdGlvbiBwb3dlcnNoZWxsKGhsanMpIHtcbiAgY29uc3QgVFlQRVMgPSBbXG4gICAgXCJzdHJpbmdcIixcbiAgICBcImNoYXJcIixcbiAgICBcImJ5dGVcIixcbiAgICBcImludFwiLFxuICAgIFwibG9uZ1wiLFxuICAgIFwiYm9vbFwiLFxuICAgIFwiZGVjaW1hbFwiLFxuICAgIFwic2luZ2xlXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcIkRhdGVUaW1lXCIsXG4gICAgXCJ4bWxcIixcbiAgICBcImFycmF5XCIsXG4gICAgXCJoYXNodGFibGVcIixcbiAgICBcInZvaWRcIlxuICBdO1xuXG4gIC8vIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3Bvd2Vyc2hlbGwvc2NyaXB0aW5nL2RldmVsb3Blci9jbWRsZXQvYXBwcm92ZWQtdmVyYnMtZm9yLXdpbmRvd3MtcG93ZXJzaGVsbC1jb21tYW5kc1xuICBjb25zdCBWQUxJRF9WRVJCUyA9XG4gICAgJ0FkZHxDbGVhcnxDbG9zZXxDb3B5fEVudGVyfEV4aXR8RmluZHxGb3JtYXR8R2V0fEhpZGV8Sm9pbnxMb2NrfCdcbiAgICArICdNb3ZlfE5ld3xPcGVufE9wdGltaXplfFBvcHxQdXNofFJlZG98UmVtb3ZlfFJlbmFtZXxSZXNldHxSZXNpemV8J1xuICAgICsgJ1NlYXJjaHxTZWxlY3R8U2V0fFNob3d8U2tpcHxTcGxpdHxTdGVwfFN3aXRjaHxVbmRvfFVubG9ja3wnXG4gICAgKyAnV2F0Y2h8QmFja3VwfENoZWNrcG9pbnR8Q29tcGFyZXxDb21wcmVzc3xDb252ZXJ0fENvbnZlcnRGcm9tfCdcbiAgICArICdDb252ZXJ0VG98RGlzbW91bnR8RWRpdHxFeHBhbmR8RXhwb3J0fEdyb3VwfEltcG9ydHxJbml0aWFsaXplfCdcbiAgICArICdMaW1pdHxNZXJnZXxNb3VudHxPdXR8UHVibGlzaHxSZXN0b3JlfFNhdmV8U3luY3xVbnB1Ymxpc2h8VXBkYXRlfCdcbiAgICArICdBcHByb3ZlfEFzc2VydHxCdWlsZHxDb21wbGV0ZXxDb25maXJtfERlbnl8RGVwbG95fERpc2FibGV8RW5hYmxlfEluc3RhbGx8SW52b2tlfCdcbiAgICArICdSZWdpc3RlcnxSZXF1ZXN0fFJlc3RhcnR8UmVzdW1lfFN0YXJ0fFN0b3B8U3VibWl0fFN1c3BlbmR8VW5pbnN0YWxsfCdcbiAgICArICdVbnJlZ2lzdGVyfFdhaXR8RGVidWd8TWVhc3VyZXxQaW5nfFJlcGFpcnxSZXNvbHZlfFRlc3R8VHJhY2V8Q29ubmVjdHwnXG4gICAgKyAnRGlzY29ubmVjdHxSZWFkfFJlY2VpdmV8U2VuZHxXcml0ZXxCbG9ja3xHcmFudHxQcm90ZWN0fFJldm9rZXxVbmJsb2NrfCdcbiAgICArICdVbnByb3RlY3R8VXNlfEZvckVhY2h8U29ydHxUZWV8V2hlcmUnO1xuXG4gIGNvbnN0IENPTVBBUklTT05fT1BFUkFUT1JTID1cbiAgICAnLWFuZHwtYXN8LWJhbmR8LWJub3R8LWJvcnwtYnhvcnwtY2FzZXNlbnNpdGl2ZXwtY2NvbnRhaW5zfC1jZXF8LWNnZXwtY2d0fCdcbiAgICArICctY2xlfC1jbGlrZXwtY2x0fC1jbWF0Y2h8LWNuZXwtY25vdGNvbnRhaW5zfC1jbm90bGlrZXwtY25vdG1hdGNofC1jb250YWluc3wnXG4gICAgKyAnLWNyZXBsYWNlfC1jc3BsaXR8LWVxfC1leGFjdHwtZnwtZmlsZXwtZ2V8LWd0fC1pY29udGFpbnN8LWllcXwtaWdlfC1pZ3R8J1xuICAgICsgJy1pbGV8LWlsaWtlfC1pbHR8LWltYXRjaHwtaW58LWluZXwtaW5vdGNvbnRhaW5zfC1pbm90bGlrZXwtaW5vdG1hdGNofCdcbiAgICArICctaXJlcGxhY2V8LWlzfC1pc25vdHwtaXNwbGl0fC1qb2lufC1sZXwtbGlrZXwtbHR8LW1hdGNofC1uZXwtbm90fCdcbiAgICArICctbm90Y29udGFpbnN8LW5vdGlufC1ub3RsaWtlfC1ub3RtYXRjaHwtb3J8LXJlZ2V4fC1yZXBsYWNlfC1zaGx8LXNocnwnXG4gICAgKyAnLXNwbGl0fC13aWxkY2FyZHwteG9yJztcblxuICBjb25zdCBLRVlXT1JEUyA9IHtcbiAgICAkcGF0dGVybjogLy0/W0EtelxcLlxcLV0rXFxiLyxcbiAgICBrZXl3b3JkOlxuICAgICAgJ2lmIGVsc2UgZm9yZWFjaCByZXR1cm4gZG8gd2hpbGUgdW50aWwgZWxzZWlmIGJlZ2luIGZvciB0cmFwIGRhdGEgZHluYW1pY3BhcmFtICdcbiAgICAgICsgJ2VuZCBicmVhayB0aHJvdyBwYXJhbSBjb250aW51ZSBmaW5hbGx5IGluIHN3aXRjaCBleGl0IGZpbHRlciB0cnkgcHJvY2VzcyBjYXRjaCAnXG4gICAgICArICdoaWRkZW4gc3RhdGljIHBhcmFtZXRlcicsXG4gICAgLy8gXCJlY2hvXCIgcmVsZXZhbmNlIGhhcyBiZWVuIHNldCB0byAwIHRvIGF2b2lkIGF1dG8tZGV0ZWN0IGNvbmZsaWN0cyB3aXRoIHNoZWxsIHRyYW5zY3JpcHRzXG4gICAgYnVpbHRfaW46XG4gICAgICAnYWMgYXNucCBjYXQgY2QgQ0ZTIGNoZGlyIGNsYyBjbGVhciBjbGh5IGNsaSBjbHAgY2xzIGNsdiBjbnNuIGNvbXBhcmUgY29weSBjcCAnXG4gICAgICArICdjcGkgY3BwIGN1cmwgY3ZwYSBkYnAgZGVsIGRpZmYgZGlyIGRuc24gZWJwIGVjaG98MCBlcGFsIGVwY3N2IGVwc24gZXJhc2UgZXRzbiBleHNuIGZjIGZoeCAnXG4gICAgICArICdmbCBmdCBmdyBnYWwgZ2JwIGdjIGdjYiBnY2kgZ2NtIGdjcyBnZHIgZ2VyciBnaHkgZ2kgZ2luIGdqYiBnbCBnbSBnbW8gZ3AgZ3BzIGdwdiBncm91cCAnXG4gICAgICArICdnc24gZ3NucCBnc3YgZ3R6IGd1IGd2IGd3bWkgaCBoaXN0b3J5IGljbSBpZXggaWh5IGlpIGlwYWwgaXBjc3YgaXBtbyBpcHNuIGlybSBpc2UgaXdtaSAnXG4gICAgICArICdpd3Iga2lsbCBscCBscyBtYW4gbWQgbWVhc3VyZSBtaSBtb3VudCBtb3ZlIG1wIG12IG5hbCBuZHIgbmkgbm1vIG5wc3NjIG5zbiBudiBvZ3Ygb2ggJ1xuICAgICAgKyAncG9wZCBwcyBwdXNoZCBwd2QgciByYnAgcmNqYiByY3NuIHJkIHJkciByZW4gcmkgcmpiIHJtIHJtZGlyIHJtbyBybmkgcm5wIHJwIHJzbiByc25wICdcbiAgICAgICsgJ3J1amIgcnYgcnZwYSByd21pIHNhamIgc2FsIHNhcHMgc2FzdiBzYnAgc2Mgc2NiIHNlbGVjdCBzZXQgc2hjbSBzaSBzbCBzbGVlcCBzbHMgc29ydCBzcCAnXG4gICAgICArICdzcGpiIHNwcHMgc3BzdiBzdGFydCBzdHogc3VqYiBzdiBzd21pIHRlZSB0cmNtIHR5cGUgd2dldCB3aGVyZSB3amIgd3JpdGUnXG4gICAgLy8gVE9ETzogJ3ZhbGlkYXRlW0EtWl0rJyBjYW4ndCB3b3JrIGluIGtleXdvcmRzXG4gIH07XG5cbiAgY29uc3QgVElUTEVfTkFNRV9SRSA9IC9cXHdbXFx3XFxkXSooKC0pW1xcd1xcZF0rKSovO1xuXG4gIGNvbnN0IEJBQ0tUSUNLX0VTQ0FQRSA9IHtcbiAgICBiZWdpbjogJ2BbXFxcXHNcXFxcU10nLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFZBUiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IC9cXCRcXEIvIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjogL1xcJHRoaXMvXG4gICAgICB9LFxuICAgICAgeyBiZWdpbjogL1xcJFtcXHdcXGRdW1xcd1xcZF86XSovIH1cbiAgICBdXG4gIH07XG5cbiAgY29uc3QgTElURVJBTCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICBiZWdpbjogL1xcJChudWxsfHRydWV8ZmFsc2UpXFxiL1xuICB9O1xuXG4gIGNvbnN0IFFVT1RFX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6IFwic3RyaW5nXCIsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cIi8sXG4gICAgICAgIGVuZDogL1wiL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9AXCIvLFxuICAgICAgICBlbmQ6IC9eXCJAL1xuICAgICAgfVxuICAgIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEJBQ0tUSUNLX0VTQ0FQRSxcbiAgICAgIFZBUixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogL1xcJFtBLXpdLyxcbiAgICAgICAgZW5kOiAvW15BLXpdL1xuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBBUE9TX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvJy8sXG4gICAgICAgIGVuZDogLycvXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL0AnLyxcbiAgICAgICAgZW5kOiAvXidAL1xuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBQU19IRUxQVEFHUyA9IHtcbiAgICBjbGFzc05hbWU6IFwiZG9jdGFnXCIsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIC8qIG5vIHBhcmFtYXRlciBoZWxwIHRhZ3MgKi9cbiAgICAgIHsgYmVnaW46IC9cXC4oc3lub3BzaXN8ZGVzY3JpcHRpb258ZXhhbXBsZXxpbnB1dHN8b3V0cHV0c3xub3Rlc3xsaW5rfGNvbXBvbmVudHxyb2xlfGZ1bmN0aW9uYWxpdHkpLyB9LFxuICAgICAgLyogb25lIHBhcmFtZXRlciBoZWxwIHRhZ3MgKi9cbiAgICAgIHsgYmVnaW46IC9cXC4ocGFyYW1ldGVyfGZvcndhcmRoZWxwdGFyZ2V0bmFtZXxmb3J3YXJkaGVscGNhdGVnb3J5fHJlbW90ZWhlbHBydW5zcGFjZXxleHRlcm5hbGhlbHApXFxzK1xcUysvIH1cbiAgICBdXG4gIH07XG5cbiAgY29uc3QgUFNfQ09NTUVOVCA9IGhsanMuaW5oZXJpdChcbiAgICBobGpzLkNPTU1FTlQobnVsbCwgbnVsbCksXG4gICAge1xuICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgLyogc2luZ2xlLWxpbmUgY29tbWVudCAqL1xuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46IC8jLyxcbiAgICAgICAgICBlbmQ6IC8kL1xuICAgICAgICB9LFxuICAgICAgICAvKiBtdWx0aS1saW5lIGNvbW1lbnQgKi9cbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAvPCMvLFxuICAgICAgICAgIGVuZDogLyM+L1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgY29udGFpbnM6IFsgUFNfSEVMUFRBR1MgXVxuICAgIH1cbiAgKTtcblxuICBjb25zdCBDTURMRVRTID0ge1xuICAgIGNsYXNzTmFtZTogJ2J1aWx0X2luJyxcbiAgICB2YXJpYW50czogWyB7IGJlZ2luOiAnKCcuY29uY2F0KFZBTElEX1ZFUkJTLCAnKSsoLSlbXFxcXHdcXFxcZF0rJykgfSBdXG4gIH07XG5cbiAgY29uc3QgUFNfQ0xBU1MgPSB7XG4gICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgIGJlZ2luS2V5d29yZHM6ICdjbGFzcyBlbnVtJyxcbiAgICBlbmQ6IC9cXHMqW3tdLyxcbiAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogWyBobGpzLlRJVExFX01PREUgXVxuICB9O1xuXG4gIGNvbnN0IFBTX0ZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbjogL2Z1bmN0aW9uXFxzKy8sXG4gICAgZW5kOiAvXFxzKlxce3wkLyxcbiAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogXCJmdW5jdGlvblwiLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNsYXNzTmFtZTogXCJrZXl3b3JkXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogXCJ0aXRsZVwiLFxuICAgICAgICBiZWdpbjogVElUTEVfTkFNRV9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgIGNsYXNzTmFtZTogXCJwYXJhbXNcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogWyBWQVIgXVxuICAgICAgfVxuICAgICAgLy8gQ01ETEVUU1xuICAgIF1cbiAgfTtcblxuICAvLyBVc2luZyBzdGF0bWVudCwgcGx1cyB0eXBlLCBwbHVzIGFzc2VtYmx5IG5hbWUuXG4gIGNvbnN0IFBTX1VTSU5HID0ge1xuICAgIGJlZ2luOiAvdXNpbmdcXHMvLFxuICAgIGVuZDogLyQvLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBRVU9URV9TVFJJTkcsXG4gICAgICBBUE9TX1NUUklORyxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIGJlZ2luOiAvKHVzaW5nfGFzc2VtYmx5fGNvbW1hbmR8bW9kdWxlfG5hbWVzcGFjZXx0eXBlKS9cbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgLy8gQ29tcGVyaXNvbiBvcGVyYXRvcnMgJiBmdW5jdGlvbiBuYW1lZCBwYXJhbWV0ZXJzLlxuICBjb25zdCBQU19BUkdVTUVOVFMgPSB7IHZhcmlhbnRzOiBbXG4gICAgLy8gUFMgbGl0ZXJhbHMgYXJlIHByZXR0eSB2ZXJib3NlIHNvIGl0J3MgYSBnb29kIGlkZWEgdG8gYWNjZW50IHRoZW0gYSBiaXQuXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnb3BlcmF0b3InLFxuICAgICAgYmVnaW46ICcoJy5jb25jYXQoQ09NUEFSSVNPTl9PUEVSQVRPUlMsICcpXFxcXGInKVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgICBiZWdpbjogLygtKXsxLDJ9W1xcd1xcZC1dKy8sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF0gfTtcblxuICBjb25zdCBIQVNIX1NJR05TID0ge1xuICAgIGNsYXNzTmFtZTogJ3NlbGVjdG9yLXRhZycsXG4gICAgYmVnaW46IC9AXFxCLyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICAvLyBJdCdzIGEgdmVyeSBnZW5lcmFsIHJ1bGUgc28gSSdsbCBuYXJyb3cgaXQgYSBiaXQgd2l0aCBzb21lIHN0cmljdCBib3VuZGFyaWVzXG4gIC8vIHRvIGF2b2lkIGFueSBwb3NzaWJsZSBmYWxzZS1wb3NpdGl2ZSBjb2xsaXNpb25zIVxuICBjb25zdCBQU19NRVRIT0RTID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbjogL1xcWy4qXFxdXFxzKltcXHddK1sgXT8/XFwoLyxcbiAgICBlbmQ6IC8kLyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIGJlZ2luOiAnKCcuY29uY2F0KFxuICAgICAgICAgIEtFWVdPUkRTLmtleXdvcmQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMvZywgJ3wnXG4gICAgICAgICAgKSwgJylcXFxcYicpLFxuICAgICAgICBlbmRzUGFyZW50OiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IGVuZHNQYXJlbnQ6IHRydWUgfSlcbiAgICBdXG4gIH07XG5cbiAgY29uc3QgR0VOVExFTUFOU19TRVQgPSBbXG4gICAgLy8gU1RBVElDX01FTUJFUixcbiAgICBQU19NRVRIT0RTLFxuICAgIFBTX0NPTU1FTlQsXG4gICAgQkFDS1RJQ0tfRVNDQVBFLFxuICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgUVVPVEVfU1RSSU5HLFxuICAgIEFQT1NfU1RSSU5HLFxuICAgIC8vIFBTX05FV19PQkpFQ1RfVFlQRSxcbiAgICBDTURMRVRTLFxuICAgIFZBUixcbiAgICBMSVRFUkFMLFxuICAgIEhBU0hfU0lHTlNcbiAgXTtcblxuICBjb25zdCBQU19UWVBFID0ge1xuICAgIGJlZ2luOiAvXFxbLyxcbiAgICBlbmQ6IC9cXF0vLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW10uY29uY2F0KFxuICAgICAgJ3NlbGYnLFxuICAgICAgR0VOVExFTUFOU19TRVQsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBcIihcIiArIFRZUEVTLmpvaW4oXCJ8XCIpICsgXCIpXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJidWlsdF9pblwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICBiZWdpbjogL1tcXC5cXHdcXGRdKy8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIClcbiAgfTtcblxuICBQU19NRVRIT0RTLmNvbnRhaW5zLnVuc2hpZnQoUFNfVFlQRSk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUG93ZXJTaGVsbCcsXG4gICAgYWxpYXNlczogW1xuICAgICAgXCJwd3NoXCIsXG4gICAgICBcInBzXCIsXG4gICAgICBcInBzMVwiXG4gICAgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogR0VOVExFTUFOU19TRVQuY29uY2F0KFxuICAgICAgUFNfQ0xBU1MsXG4gICAgICBQU19GVU5DVElPTixcbiAgICAgIFBTX1VTSU5HLFxuICAgICAgUFNfQVJHVU1FTlRTLFxuICAgICAgUFNfVFlQRVxuICAgIClcbiAgfTtcbn1cblxuZXhwb3J0IHsgcG93ZXJzaGVsbCBhcyBkZWZhdWx0IH07XG4iXX0=