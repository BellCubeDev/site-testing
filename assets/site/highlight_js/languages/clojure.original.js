function clojure(hljs) {
    const SYMBOLSTART = 'a-zA-Z_\\-!.?+*=<>&\'';
    const SYMBOL_RE = '[#]?[' + SYMBOLSTART + '][' + SYMBOLSTART + '0-9/;:$#]*';
    const globals = 'def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord';
    const keywords = {
        $pattern: SYMBOL_RE,
        built_in: globals + ' '
            + 'cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem '
            + 'quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? '
            + 'set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? '
            + 'class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? '
            + 'string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . '
            + 'inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last '
            + 'drop-while while intern condp case reduced cycle split-at split-with repeat replicate '
            + 'iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext '
            + 'nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends '
            + 'add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler '
            + 'set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter '
            + 'monitor-exit macroexpand macroexpand-1 for dosync and or '
            + 'when when-not when-let comp juxt partial sequence memoize constantly complement identity assert '
            + 'peek pop doto proxy first rest cons cast coll last butlast '
            + 'sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import '
            + 'refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! '
            + 'assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger '
            + 'bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline '
            + 'flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking '
            + 'assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! '
            + 'reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! '
            + 'new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty '
            + 'hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list '
            + 'disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer '
            + 'chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate '
            + 'unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta '
            + 'lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize'
    };
    const SYMBOL = {
        begin: SYMBOL_RE,
        relevance: 0
    };
    const NUMBER = {
        scope: 'number',
        relevance: 0,
        variants: [
            { match: /[-+]?0[xX][0-9a-fA-F]+N?/ },
            { match: /[-+]?0[0-7]+N?/ },
            { match: /[-+]?[1-9][0-9]?[rR][0-9a-zA-Z]+N?/ },
            { match: /[-+]?[0-9]+\/[0-9]+N?/ },
            { match: /[-+]?[0-9]+((\.[0-9]*([eE][+-]?[0-9]+)?M?)|([eE][+-]?[0-9]+M?|M))/ },
            { match: /[-+]?([1-9][0-9]*|0)N?/ },
        ]
    };
    const CHARACTER = {
        scope: 'character',
        variants: [
            { match: /\\o[0-3]?[0-7]{1,2}/ },
            { match: /\\u[0-9a-fA-F]{4}/ },
            { match: /\\(newline|space|tab|formfeed|backspace|return)/ },
            {
                match: /\\\S/,
                relevance: 0
            }
        ]
    };
    const REGEX = {
        scope: 'regex',
        begin: /#"/,
        end: /"/,
        contains: [hljs.BACKSLASH_ESCAPE]
    };
    const STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null });
    const COMMA = {
        scope: 'punctuation',
        match: /,/,
        relevance: 0
    };
    const COMMENT = hljs.COMMENT(';', '$', { relevance: 0 });
    const LITERAL = {
        className: 'literal',
        begin: /\b(true|false|nil)\b/
    };
    const COLLECTION = {
        begin: "\\[|(#::?" + SYMBOL_RE + ")?\\{",
        end: '[\\]\\}]',
        relevance: 0
    };
    const KEY = {
        className: 'symbol',
        begin: '[:]{1,2}' + SYMBOL_RE
    };
    const LIST = {
        begin: '\\(',
        end: '\\)'
    };
    const BODY = {
        endsWithParent: true,
        relevance: 0
    };
    const NAME = {
        keywords: keywords,
        className: 'name',
        begin: SYMBOL_RE,
        relevance: 0,
        starts: BODY
    };
    const DEFAULT_CONTAINS = [
        COMMA,
        LIST,
        CHARACTER,
        REGEX,
        STRING,
        COMMENT,
        KEY,
        COLLECTION,
        NUMBER,
        LITERAL,
        SYMBOL
    ];
    const GLOBAL = {
        beginKeywords: globals,
        keywords: {
            $pattern: SYMBOL_RE,
            keyword: globals
        },
        end: '(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',
        contains: [
            {
                className: 'title',
                begin: SYMBOL_RE,
                relevance: 0,
                excludeEnd: true,
                endsParent: true
            }
        ].concat(DEFAULT_CONTAINS)
    };
    LIST.contains = [
        GLOBAL,
        NAME,
        BODY
    ];
    BODY.contains = DEFAULT_CONTAINS;
    COLLECTION.contains = DEFAULT_CONTAINS;
    return {
        name: 'Clojure',
        aliases: [
            'clj',
            'edn'
        ],
        illegal: /\S/,
        contains: [
            COMMA,
            LIST,
            CHARACTER,
            REGEX,
            STRING,
            COMMENT,
            KEY,
            COLLECTION,
            NUMBER,
            LITERAL
        ]
    };
}
export { clojure as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvanVyZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2Nsb2p1cmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxPQUFPLENBQUMsSUFBSTtJQUNuQixNQUFNLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQztJQUM1QyxNQUFNLFNBQVMsR0FBRyxPQUFPLEdBQUcsV0FBVyxHQUFHLElBQUksR0FBRyxXQUFXLEdBQUcsWUFBWSxDQUFDO0lBQzVFLE1BQU0sT0FBTyxHQUFHLDRGQUE0RixDQUFDO0lBQzdHLE1BQU0sUUFBUSxHQUFHO1FBQ2YsUUFBUSxFQUFFLFNBQVM7UUFDbkIsUUFBUSxFQUVOLE9BQU8sR0FBRyxHQUFHO2NBQ1gsc0ZBQXNGO2NBQ3RGLGtGQUFrRjtjQUNsRix1RkFBdUY7Y0FDdkYsdUZBQXVGO2NBQ3ZGLHVGQUF1RjtjQUN2RixzRkFBc0Y7Y0FDdEYsd0ZBQXdGO2NBQ3hGLDBGQUEwRjtjQUMxRixrR0FBa0c7Y0FDbEcsZ0dBQWdHO2NBQ2hHLDZGQUE2RjtjQUM3RiwyREFBMkQ7Y0FDM0Qsa0dBQWtHO2NBQ2xHLDZEQUE2RDtjQUM3RCx1RkFBdUY7Y0FDdkYsbUdBQW1HO2NBQ25HLGlHQUFpRztjQUNqRyxzR0FBc0c7Y0FDdEcscUdBQXFHO2NBQ3JHLDZHQUE2RztjQUM3RyxvSEFBb0g7Y0FDcEgsd0dBQXdHO2NBQ3hHLHVIQUF1SDtjQUN2SCwwSEFBMEg7Y0FDMUgsbUlBQW1JO2NBQ25JLDZIQUE2SDtjQUM3SCxnRkFBZ0Y7S0FDckYsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVB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VUFBVSxFQUFFLElBQUk7Z0JBRWhCLFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1NBQ0YsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7S0FDM0IsQ0FBQztJQUVGLElBQUksQ0FBQyxRQUFRLEdBQUc7UUFDZCxNQUFNO1FBQ04sSUFBSTtRQUNKLElBQUk7S0FDTCxDQUFDO0lBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztJQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO0lBRXZDLE9BQU87UUFDTCxJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRTtZQUNQLEtBQUs7WUFDTCxLQUFLO1NBQ047UUFDRCxPQUFPLEVBQUUsSUFBSTtRQUNiLFFBQVEsRUFBRTtZQUNSLEtBQUs7WUFDTCxJQUFJO1lBQ0osU0FBUztZQUNULEtBQUs7WUFDTCxNQUFNO1lBQ04sT0FBTztZQUNQLEdBQUc7WUFDSCxVQUFVO1lBQ1YsTUFBTTtZQUNOLE9BQU87U0FDUjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQ2xvanVyZVxuRGVzY3JpcHRpb246IENsb2p1cmUgc3ludGF4IChiYXNlZCBvbiBsaXNwLmpzKVxuQXV0aG9yOiBtZm9ybm9zXG5XZWJzaXRlOiBodHRwczovL2Nsb2p1cmUub3JnXG5DYXRlZ29yeTogbGlzcFxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGNsb2p1cmUoaGxqcykge1xuICBjb25zdCBTWU1CT0xTVEFSVCA9ICdhLXpBLVpfXFxcXC0hLj8rKj08PiZcXCcnO1xuICBjb25zdCBTWU1CT0xfUkUgPSAnWyNdP1snICsgU1lNQk9MU1RBUlQgKyAnXVsnICsgU1lNQk9MU1RBUlQgKyAnMC05Lzs6JCNdKic7XG4gIGNvbnN0IGdsb2JhbHMgPSAnZGVmIGRlZm9uY2UgZGVmcHJvdG9jb2wgZGVmc3RydWN0IGRlZm11bHRpIGRlZm1ldGhvZCBkZWZuLSBkZWZuIGRlZm1hY3JvIGRlZnR5cGUgZGVmcmVjb3JkJztcbiAgY29uc3Qga2V5d29yZHMgPSB7XG4gICAgJHBhdHRlcm46IFNZTUJPTF9SRSxcbiAgICBidWlsdF9pbjpcbiAgICAgIC8vIENsb2p1cmUga2V5d29yZHNcbiAgICAgIGdsb2JhbHMgKyAnICdcbiAgICAgICsgJ2NvbmQgYXBwbHkgaWYtbm90IGlmLWxldCBpZiBub3Qgbm90PSA9fDAgPHwwID58MCA8PXwwID49fDAgPT18MCArfDAgL3wwICp8MCAtfDAgcmVtICdcbiAgICAgICsgJ3F1b3QgbmVnPyBwb3M/IGRlbGF5PyBzeW1ib2w/IGtleXdvcmQ/IHRydWU/IGZhbHNlPyBpbnRlZ2VyPyBlbXB0eT8gY29sbD8gbGlzdD8gJ1xuICAgICAgKyAnc2V0PyBpZm4/IGZuPyBhc3NvY2lhdGl2ZT8gc2VxdWVudGlhbD8gc29ydGVkPyBjb3VudGVkPyByZXZlcnNpYmxlPyBudW1iZXI/IGRlY2ltYWw/ICdcbiAgICAgICsgJ2NsYXNzPyBkaXN0aW5jdD8gaXNhPyBmbG9hdD8gcmF0aW9uYWw/IHJlZHVjZWQ/IHJhdGlvPyBvZGQ/IGV2ZW4/IGNoYXI/IHNlcT8gdmVjdG9yPyAnXG4gICAgICArICdzdHJpbmc/IG1hcD8gbmlsPyBjb250YWlucz8gemVybz8gaW5zdGFuY2U/IG5vdC1ldmVyeT8gbm90LWFueT8gbGlic3BlYz8gLT4gLT4+IC4uIC4gJ1xuICAgICAgKyAnaW5jIGNvbXBhcmUgZG8gZG90aW1lcyBtYXBjYXQgdGFrZSByZW1vdmUgdGFrZS13aGlsZSBkcm9wIGxldGZuIGRyb3AtbGFzdCB0YWtlLWxhc3QgJ1xuICAgICAgKyAnZHJvcC13aGlsZSB3aGlsZSBpbnRlcm4gY29uZHAgY2FzZSByZWR1Y2VkIGN5Y2xlIHNwbGl0LWF0IHNwbGl0LXdpdGggcmVwZWF0IHJlcGxpY2F0ZSAnXG4gICAgICArICdpdGVyYXRlIHJhbmdlIG1lcmdlIHppcG1hcCBkZWNsYXJlIGxpbmUtc2VxIHNvcnQgY29tcGFyYXRvciBzb3J0LWJ5IGRvcnVuIGRvYWxsIG50aG5leHQgJ1xuICAgICAgKyAnbnRocmVzdCBwYXJ0aXRpb24gZXZhbCBkb3NlcSBhd2FpdCBhd2FpdC1mb3IgbGV0IGFnZW50IGF0b20gc2VuZCBzZW5kLW9mZiByZWxlYXNlLXBlbmRpbmctc2VuZHMgJ1xuICAgICAgKyAnYWRkLXdhdGNoIG1hcHYgZmlsdGVydiByZW1vdmUtd2F0Y2ggYWdlbnQtZXJyb3IgcmVzdGFydC1hZ2VudCBzZXQtZXJyb3ItaGFuZGxlciBlcnJvci1oYW5kbGVyICdcbiAgICAgICsgJ3NldC1lcnJvci1tb2RlISBlcnJvci1tb2RlIHNodXRkb3duLWFnZW50cyBxdW90ZSB2YXIgZm4gbG9vcCByZWN1ciB0aHJvdyB0cnkgbW9uaXRvci1lbnRlciAnXG4gICAgICArICdtb25pdG9yLWV4aXQgbWFjcm9leHBhbmQgbWFjcm9leHBhbmQtMSBmb3IgZG9zeW5jIGFuZCBvciAnXG4gICAgICArICd3aGVuIHdoZW4tbm90IHdoZW4tbGV0IGNvbXAganV4dCBwYXJ0aWFsIHNlcXVlbmNlIG1lbW9pemUgY29uc3RhbnRseSBjb21wbGVtZW50IGlkZW50aXR5IGFzc2VydCAnXG4gICAgICArICdwZWVrIHBvcCBkb3RvIHByb3h5IGZpcnN0IHJlc3QgY29ucyBjYXN0IGNvbGwgbGFzdCBidXRsYXN0ICdcbiAgICAgICsgJ3NpZ3MgcmVpZnkgc2Vjb25kIGZmaXJzdCBmbmV4dCBuZmlyc3Qgbm5leHQgbWV0YSB3aXRoLW1ldGEgbnMgaW4tbnMgY3JlYXRlLW5zIGltcG9ydCAnXG4gICAgICArICdyZWZlciBrZXlzIHNlbGVjdC1rZXlzIHZhbHMga2V5IHZhbCByc2VxIG5hbWUgbmFtZXNwYWNlIHByb21pc2UgaW50byB0cmFuc2llbnQgcGVyc2lzdGVudCEgY29uaiEgJ1xuICAgICAgKyAnYXNzb2MhIGRpc3NvYyEgcG9wISBkaXNqISB1c2UgY2xhc3MgdHlwZSBudW0gZmxvYXQgZG91YmxlIHNob3J0IGJ5dGUgYm9vbGVhbiBiaWdpbnQgYmlnaW50ZWdlciAnXG4gICAgICArICdiaWdkZWMgcHJpbnQtbWV0aG9kIHByaW50LWR1cCB0aHJvdy1pZiBwcmludGYgZm9ybWF0IGxvYWQgY29tcGlsZSBnZXQtaW4gdXBkYXRlLWluIHByIHByLW9uIG5ld2xpbmUgJ1xuICAgICAgKyAnZmx1c2ggcmVhZCBzbHVycCByZWFkLWxpbmUgc3VidmVjIHdpdGgtb3BlbiBtZW1mbiB0aW1lIHJlLWZpbmQgcmUtZ3JvdXBzIHJhbmQtaW50IHJhbmQgbW9kIGxvY2tpbmcgJ1xuICAgICAgKyAnYXNzZXJ0LXZhbGlkLWZkZWNsIGFsaWFzIHJlc29sdmUgcmVmIGRlcmVmIHJlZnNldCBzd2FwISByZXNldCEgc2V0LXZhbGlkYXRvciEgY29tcGFyZS1hbmQtc2V0ISBhbHRlci1tZXRhISAnXG4gICAgICArICdyZXNldC1tZXRhISBjb21tdXRlIGdldC12YWxpZGF0b3IgYWx0ZXIgcmVmLXNldCByZWYtaGlzdG9yeS1jb3VudCByZWYtbWluLWhpc3RvcnkgcmVmLW1heC1oaXN0b3J5IGVuc3VyZSBzeW5jIGlvISAnXG4gICAgICArICduZXcgbmV4dCBjb25qIHNldCEgdG8tYXJyYXkgZnV0dXJlIGZ1dHVyZS1jYWxsIGludG8tYXJyYXkgYXNldCBnZW4tY2xhc3MgcmVkdWNlIG1hcCBmaWx0ZXIgZmluZCBlbXB0eSAnXG4gICAgICArICdoYXNoLW1hcCBoYXNoLXNldCBzb3J0ZWQtbWFwIHNvcnRlZC1tYXAtYnkgc29ydGVkLXNldCBzb3J0ZWQtc2V0LWJ5IHZlYyB2ZWN0b3Igc2VxIGZsYXR0ZW4gcmV2ZXJzZSBhc3NvYyBkaXNzb2MgbGlzdCAnXG4gICAgICArICdkaXNqIGdldCB1bmlvbiBkaWZmZXJlbmNlIGludGVyc2VjdGlvbiBleHRlbmQgZXh0ZW5kLXR5cGUgZXh0ZW5kLXByb3RvY29sIGludCBudGggZGVsYXkgY291bnQgY29uY2F0IGNodW5rIGNodW5rLWJ1ZmZlciAnXG4gICAgICArICdjaHVuay1hcHBlbmQgY2h1bmstZmlyc3QgY2h1bmstcmVzdCBtYXggbWluIGRlYyB1bmNoZWNrZWQtaW5jLWludCB1bmNoZWNrZWQtaW5jIHVuY2hlY2tlZC1kZWMtaW5jIHVuY2hlY2tlZC1kZWMgdW5jaGVja2VkLW5lZ2F0ZSAnXG4gICAgICArICd1bmNoZWNrZWQtYWRkLWludCB1bmNoZWNrZWQtYWRkIHVuY2hlY2tlZC1zdWJ0cmFjdC1pbnQgdW5jaGVja2VkLXN1YnRyYWN0IGNodW5rLW5leHQgY2h1bmstY29ucyBjaHVua2VkLXNlcT8gcHJuIHZhcnktbWV0YSAnXG4gICAgICArICdsYXp5LXNlcSBzcHJlYWQgbGlzdCogc3RyIGZpbmQta2V5d29yZCBrZXl3b3JkIHN5bWJvbCBnZW5zeW0gZm9yY2UgcmF0aW9uYWxpemUnXG4gIH07XG5cbiAgY29uc3QgU1lNQk9MID0ge1xuICAgIGJlZ2luOiBTWU1CT0xfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IE5VTUJFUiA9IHtcbiAgICBzY29wZTogJ251bWJlcicsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IG1hdGNoOiAvWy0rXT8wW3hYXVswLTlhLWZBLUZdK04/LyB9LCAvLyBoZXhhZGVjaW1hbCAgICAgICAgICAgICAgICAgLy8gMHgyYVxuICAgICAgeyBtYXRjaDogL1stK10/MFswLTddK04/LyB9LCAvLyBvY3RhbCAgICAgICAgICAgICAgICAgICAgICAgLy8gMDUyXG4gICAgICB7IG1hdGNoOiAvWy0rXT9bMS05XVswLTldP1tyUl1bMC05YS16QS1aXStOPy8gfSwgLy8gdmFyaWFibGUgcmFkaXggZnJvbSAyIHRvIDM2IC8vIDJyMTAxMDEwLCA4cjUyLCAzNnIxNlxuICAgICAgeyBtYXRjaDogL1stK10/WzAtOV0rXFwvWzAtOV0rTj8vIH0sIC8vIHJhdGlvICAgICAgICAgICAgICAgICAgICAgICAvLyAxLzJcbiAgICAgIHsgbWF0Y2g6IC9bLStdP1swLTldKygoXFwuWzAtOV0qKFtlRV1bKy1dP1swLTldKyk/TT8pfChbZUVdWystXT9bMC05XStNP3xNKSkvIH0sIC8vIGZsb2F0ICAgICAgICAvLyAwLjQyIDQuMkUtMU0gNDJFMSA0Mk1cbiAgICAgIHsgbWF0Y2g6IC9bLStdPyhbMS05XVswLTldKnwwKU4/LyB9LCAvLyBpbnQgKGRvbid0IG1hdGNoIGxlYWRpbmcgMCkgLy8gNDIgNDJOXG4gICAgXVxuICB9O1xuICBjb25zdCBDSEFSQUNURVIgPSB7XG4gICAgc2NvcGU6ICdjaGFyYWN0ZXInLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IG1hdGNoOiAvXFxcXG9bMC0zXT9bMC03XXsxLDJ9LyB9LCAvLyBVbmljb2RlIE9jdGFsIDAgLSAzNzdcbiAgICAgIHsgbWF0Y2g6IC9cXFxcdVswLTlhLWZBLUZdezR9LyB9LCAvLyBVbmljb2RlIEhleCAwMDAwIC0gRkZGRlxuICAgICAgeyBtYXRjaDogL1xcXFwobmV3bGluZXxzcGFjZXx0YWJ8Zm9ybWZlZWR8YmFja3NwYWNlfHJldHVybikvIH0sIC8vIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAge1xuICAgICAgICBtYXRjaDogL1xcXFxcXFMvLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0gLy8gYW55IG5vbi13aGl0ZXNwYWNlIGNoYXJcbiAgICBdXG4gIH07XG4gIGNvbnN0IFJFR0VYID0ge1xuICAgIHNjb3BlOiAncmVnZXgnLFxuICAgIGJlZ2luOiAvI1wiLyxcbiAgICBlbmQ6IC9cIi8sXG4gICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgfTtcbiAgY29uc3QgU1RSSU5HID0gaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHsgaWxsZWdhbDogbnVsbCB9KTtcbiAgY29uc3QgQ09NTUEgPSB7XG4gICAgc2NvcGU6ICdwdW5jdHVhdGlvbicsXG4gICAgbWF0Y2g6IC8sLyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgQ09NTUVOVCA9IGhsanMuQ09NTUVOVChcbiAgICAnOycsXG4gICAgJyQnLFxuICAgIHsgcmVsZXZhbmNlOiAwIH1cbiAgKTtcbiAgY29uc3QgTElURVJBTCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICBiZWdpbjogL1xcYih0cnVlfGZhbHNlfG5pbClcXGIvXG4gIH07XG4gIGNvbnN0IENPTExFQ1RJT04gPSB7XG4gICAgYmVnaW46IFwiXFxcXFt8KCM6Oj9cIiArIFNZTUJPTF9SRSArIFwiKT9cXFxce1wiLFxuICAgIGVuZDogJ1tcXFxcXVxcXFx9XScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IEtFWSA9IHtcbiAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgIGJlZ2luOiAnWzpdezEsMn0nICsgU1lNQk9MX1JFXG4gIH07XG4gIGNvbnN0IExJU1QgPSB7XG4gICAgYmVnaW46ICdcXFxcKCcsXG4gICAgZW5kOiAnXFxcXCknXG4gIH07XG4gIGNvbnN0IEJPRFkgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IE5BTUUgPSB7XG4gICAga2V5d29yZHM6IGtleXdvcmRzLFxuICAgIGNsYXNzTmFtZTogJ25hbWUnLFxuICAgIGJlZ2luOiBTWU1CT0xfUkUsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIHN0YXJ0czogQk9EWVxuICB9O1xuICBjb25zdCBERUZBVUxUX0NPTlRBSU5TID0gW1xuICAgIENPTU1BLFxuICAgIExJU1QsXG4gICAgQ0hBUkFDVEVSLFxuICAgIFJFR0VYLFxuICAgIFNUUklORyxcbiAgICBDT01NRU5ULFxuICAgIEtFWSxcbiAgICBDT0xMRUNUSU9OLFxuICAgIE5VTUJFUixcbiAgICBMSVRFUkFMLFxuICAgIFNZTUJPTFxuICBdO1xuXG4gIGNvbnN0IEdMT0JBTCA9IHtcbiAgICBiZWdpbktleXdvcmRzOiBnbG9iYWxzLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogU1lNQk9MX1JFLFxuICAgICAga2V5d29yZDogZ2xvYmFsc1xuICAgIH0sXG4gICAgZW5kOiAnKFxcXFxbfCN8XFxcXGR8XCJ8OnxcXFxce3xcXFxcKXxcXFxcKHwkKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogU1lNQk9MX1JFLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIC8vIHdlIGNhbiBvbmx5IGhhdmUgYSBzaW5nbGUgdGl0bGVcbiAgICAgICAgZW5kc1BhcmVudDogdHJ1ZVxuICAgICAgfVxuICAgIF0uY29uY2F0KERFRkFVTFRfQ09OVEFJTlMpXG4gIH07XG5cbiAgTElTVC5jb250YWlucyA9IFtcbiAgICBHTE9CQUwsXG4gICAgTkFNRSxcbiAgICBCT0RZXG4gIF07XG4gIEJPRFkuY29udGFpbnMgPSBERUZBVUxUX0NPTlRBSU5TO1xuICBDT0xMRUNUSU9OLmNvbnRhaW5zID0gREVGQVVMVF9DT05UQUlOUztcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdDbG9qdXJlJyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAnY2xqJyxcbiAgICAgICdlZG4nXG4gICAgXSxcbiAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICBjb250YWluczogW1xuICAgICAgQ09NTUEsXG4gICAgICBMSVNULFxuICAgICAgQ0hBUkFDVEVSLFxuICAgICAgUkVHRVgsXG4gICAgICBTVFJJTkcsXG4gICAgICBDT01NRU5ULFxuICAgICAgS0VZLFxuICAgICAgQ09MTEVDVElPTixcbiAgICAgIE5VTUJFUixcbiAgICAgIExJVEVSQUxcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGNsb2p1cmUgYXMgZGVmYXVsdCB9O1xuIl19