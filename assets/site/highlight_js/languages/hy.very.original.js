function hy(hljs) {
    const SYMBOLSTART = 'a-zA-Z_\\-!.?+*=<>&#\'';
    const SYMBOL_RE = '[' + SYMBOLSTART + '][' + SYMBOLSTART + '0-9/;:]*';
    const keywords = {
        $pattern: SYMBOL_RE,
        built_in: '!= % %= & &= * ** **= *= *map '
            + '+ += , --build-class-- --import-- -= . / // //= '
            + '/= < << <<= <= = > >= >> >>= '
            + '@ @= ^ ^= abs accumulate all and any ap-compose '
            + 'ap-dotimes ap-each ap-each-while ap-filter ap-first ap-if ap-last ap-map ap-map-when ap-pipe '
            + 'ap-reduce ap-reject apply as-> ascii assert assoc bin break butlast '
            + 'callable calling-module-name car case cdr chain chr coll? combinations compile '
            + 'compress cond cons cons? continue count curry cut cycle dec '
            + 'def default-method defclass defmacro defmacro-alias defmacro/g! defmain defmethod defmulti defn '
            + 'defn-alias defnc defnr defreader defseq del delattr delete-route dict-comp dir '
            + 'disassemble dispatch-reader-macro distinct divmod do doto drop drop-last drop-while empty? '
            + 'end-sequence eval eval-and-compile eval-when-compile even? every? except exec filter first '
            + 'flatten float? fn fnc fnr for for* format fraction genexpr '
            + 'gensym get getattr global globals group-by hasattr hash hex id '
            + 'identity if if* if-not if-python2 import in inc input instance? '
            + 'integer integer-char? integer? interleave interpose is is-coll is-cons is-empty is-even '
            + 'is-every is-float is-instance is-integer is-integer-char is-iterable is-iterator is-keyword is-neg is-none '
            + 'is-not is-numeric is-odd is-pos is-string is-symbol is-zero isinstance islice issubclass '
            + 'iter iterable? iterate iterator? keyword keyword? lambda last len let '
            + 'lif lif-not list* list-comp locals loop macro-error macroexpand macroexpand-1 macroexpand-all '
            + 'map max merge-with method-decorator min multi-decorator multicombinations name neg? next '
            + 'none? nonlocal not not-in not? nth numeric? oct odd? open '
            + 'or ord partition permutations pos? post-route postwalk pow prewalk print '
            + 'product profile/calls profile/cpu put-route quasiquote quote raise range read read-str '
            + 'recursive-replace reduce remove repeat repeatedly repr require rest round route '
            + 'route-with-methods rwm second seq set-comp setattr setv some sorted string '
            + 'string? sum switch symbol? take take-nth take-while tee try unless '
            + 'unquote unquote-splicing vars walk when while with with* with-decorator with-gensyms '
            + 'xi xor yield yield-from zero? zip zip-longest | |= ~'
    };
    const SIMPLE_NUMBER_RE = '[-+]?\\d+(\\.\\d+)?';
    const SYMBOL = {
        begin: SYMBOL_RE,
        relevance: 0
    };
    const NUMBER = {
        className: 'number',
        begin: SIMPLE_NUMBER_RE,
        relevance: 0
    };
    const STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null });
    const COMMENT = hljs.COMMENT(';', '$', { relevance: 0 });
    const LITERAL = {
        className: 'literal',
        begin: /\b([Tt]rue|[Ff]alse|nil|None)\b/
    };
    const COLLECTION = {
        begin: '[\\[\\{]',
        end: '[\\]\\}]',
        relevance: 0
    };
    const HINT = {
        className: 'comment',
        begin: '\\^' + SYMBOL_RE
    };
    const HINT_COL = hljs.COMMENT('\\^\\{', '\\}');
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
        className: 'name',
        relevance: 0,
        keywords: keywords,
        begin: SYMBOL_RE,
        starts: BODY
    };
    const DEFAULT_CONTAINS = [
        LIST,
        STRING,
        HINT,
        HINT_COL,
        COMMENT,
        KEY,
        COLLECTION,
        NUMBER,
        LITERAL,
        SYMBOL
    ];
    LIST.contains = [
        hljs.COMMENT('comment', ''),
        NAME,
        BODY
    ];
    BODY.contains = DEFAULT_CONTAINS;
    COLLECTION.contains = DEFAULT_CONTAINS;
    return {
        name: 'Hy',
        aliases: ['hylang'],
        illegal: /\S/,
        contains: [
            hljs.SHEBANG(),
            LIST,
            STRING,
            HINT,
            HINT_COL,
            COMMENT,
            KEY,
            COLLECTION,
            NUMBER,
            LITERAL
        ]
    };
}
export { hy as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHkuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9oeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLEVBQUUsQ0FBQyxJQUFJO0lBQ2QsTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUM7SUFDN0MsTUFBTSxTQUFTLEdBQUcsR0FBRyxHQUFHLFdBQVcsR0FBRyxJQUFJLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUN0RSxNQUFNLFFBQVEsR0FBRztRQUNmLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFFBQVEsRUFFTixnQ0FBZ0M7Y0FDOUIsa0RBQWtEO2NBQ2xELCtCQUErQjtjQUMvQixrREFBa0Q7Y0FDbEQsK0ZBQStGO2NBQy9GLHNFQUFzRTtjQUN0RSxpRkFBaUY7Y0FDakYsOERBQThEO2NBQzlELGtHQUFrRztjQUNsRyxpRkFBaUY7Y0FDakYsNkZBQTZGO2NBQzdGLDZGQUE2RjtjQUM3Riw2REFBNkQ7Y0FDN0QsaUVBQWlFO2NBQ2pFLGtFQUFrRTtjQUNsRSwwRkFBMEY7Y0FDMUYsNkdBQTZHO2NBQzdHLDJGQUEyRjtjQUMzRix3RUFBd0U7Y0FDeEUsZ0dBQWdHO2NBQ2hHLDJGQUEyRjtjQUMzRiw0REFBNEQ7Y0FDNUQsMkVBQTJFO2NBQzNFLHlGQUF5RjtjQUN6RixrRkFBa0Y7Y0FDbEYsNkVBQTZFO2NBQzdFLHFFQUFxRTtjQUNyRSx1RkFBdUY7Y0FDdkYsc0RBQXNEO0tBQzNELENBQUM7SUFFRixNQUFNLGdCQUFnQixHQUFHLHFCQUFxQixDQUFDO0lBRS9DLE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsZ0JBQWdCO1FBQ3ZCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDMUIsR0FBRyxFQUNILEdBQUcsRUFDSCxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FDakIsQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHO1FBQ2QsU0FBUyxFQUFFLFNBQVM7UUFDcEIsS0FBSyxFQUFFLGlDQUFpQztLQUN6QyxDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQUc7UUFDakIsS0FBSyxFQUFFLFVBQVU7UUFDakIsR0FBRyxFQUFFLFVBQVU7UUFDZixTQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7SUFDRixNQUFNLElBQUksR0FBRztRQUNYLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLEtBQUssRUFBRSxLQUFLLEdBQUcsU0FBUztLQUN6QixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsTUFBTSxHQUFHLEdBQUc7UUFDVixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsVUFBVSxHQUFHLFNBQVM7S0FDOUIsQ0FBQztJQUNGLE1BQU0sSUFBSSxHQUFHO1FBQ1gsS0FBSyxFQUFFLEtBQUs7UUFDWixHQUFHLEVBQUUsS0FBSztLQUNYLENBQUM7SUFDRixNQUFNLElBQUksR0FBRztRQUNYLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUNGLE1BQU0sSUFBSSxHQUFHO1FBQ1gsU0FBUyxFQUFFLE1BQU07UUFDakIsU0FBUyxFQUFFLENBQUM7UUFDWixRQUFRLEVBQUUsUUFBUTtRQUNsQixLQUFLLEVBQUUsU0FBUztRQUNoQixNQUFNLEVBQUUsSUFBSTtLQUNiLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLElBQUk7UUFDSixNQUFNO1FBQ04sSUFBSTtRQUNKLFFBQVE7UUFDUixPQUFPO1FBQ1AsR0FBRztRQUNILFVBQVU7UUFDVixNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07S0FDUCxDQUFDO0lBRUYsSUFBSSxDQUFDLFFBQVEsR0FBRztRQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztRQUMzQixJQUFJO1FBQ0osSUFBSTtLQUNMLENBQUM7SUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO0lBQ2pDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7SUFFdkMsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLENBQUUsUUFBUSxDQUFFO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUk7WUFDSixNQUFNO1lBQ04sSUFBSTtZQUNKLFFBQVE7WUFDUixPQUFPO1lBQ1AsR0FBRztZQUNILFVBQVU7WUFDVixNQUFNO1lBQ04sT0FBTztTQUNSO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsRUFBRSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBIeVxuRGVzY3JpcHRpb246IEh5IGlzIGEgd29uZGVyZnVsIGRpYWxlY3Qgb2YgTGlzcCB0aGF04oCZcyBlbWJlZGRlZCBpbiBQeXRob24uXG5BdXRob3I6IFNlcmdleSBTb2JrbyA8cy5zb2Jrb0Bwcm9maXR3YXJlLnJ1PlxuV2Vic2l0ZTogaHR0cDovL2RvY3MuaHlsYW5nLm9yZy9lbi9zdGFibGUvXG5DYXRlZ29yeTogbGlzcFxuKi9cblxuZnVuY3Rpb24gaHkoaGxqcykge1xuICBjb25zdCBTWU1CT0xTVEFSVCA9ICdhLXpBLVpfXFxcXC0hLj8rKj08PiYjXFwnJztcbiAgY29uc3QgU1lNQk9MX1JFID0gJ1snICsgU1lNQk9MU1RBUlQgKyAnXVsnICsgU1lNQk9MU1RBUlQgKyAnMC05Lzs6XSonO1xuICBjb25zdCBrZXl3b3JkcyA9IHtcbiAgICAkcGF0dGVybjogU1lNQk9MX1JFLFxuICAgIGJ1aWx0X2luOlxuICAgICAgLy8ga2V5d29yZHNcbiAgICAgICchPSAlICU9ICYgJj0gKiAqKiAqKj0gKj0gKm1hcCAnXG4gICAgICArICcrICs9ICwgLS1idWlsZC1jbGFzcy0tIC0taW1wb3J0LS0gLT0gLiAvIC8vIC8vPSAnXG4gICAgICArICcvPSA8IDw8IDw8PSA8PSA9ID4gPj0gPj4gPj49ICdcbiAgICAgICsgJ0AgQD0gXiBePSBhYnMgYWNjdW11bGF0ZSBhbGwgYW5kIGFueSBhcC1jb21wb3NlICdcbiAgICAgICsgJ2FwLWRvdGltZXMgYXAtZWFjaCBhcC1lYWNoLXdoaWxlIGFwLWZpbHRlciBhcC1maXJzdCBhcC1pZiBhcC1sYXN0IGFwLW1hcCBhcC1tYXAtd2hlbiBhcC1waXBlICdcbiAgICAgICsgJ2FwLXJlZHVjZSBhcC1yZWplY3QgYXBwbHkgYXMtPiBhc2NpaSBhc3NlcnQgYXNzb2MgYmluIGJyZWFrIGJ1dGxhc3QgJ1xuICAgICAgKyAnY2FsbGFibGUgY2FsbGluZy1tb2R1bGUtbmFtZSBjYXIgY2FzZSBjZHIgY2hhaW4gY2hyIGNvbGw/IGNvbWJpbmF0aW9ucyBjb21waWxlICdcbiAgICAgICsgJ2NvbXByZXNzIGNvbmQgY29ucyBjb25zPyBjb250aW51ZSBjb3VudCBjdXJyeSBjdXQgY3ljbGUgZGVjICdcbiAgICAgICsgJ2RlZiBkZWZhdWx0LW1ldGhvZCBkZWZjbGFzcyBkZWZtYWNybyBkZWZtYWNyby1hbGlhcyBkZWZtYWNyby9nISBkZWZtYWluIGRlZm1ldGhvZCBkZWZtdWx0aSBkZWZuICdcbiAgICAgICsgJ2RlZm4tYWxpYXMgZGVmbmMgZGVmbnIgZGVmcmVhZGVyIGRlZnNlcSBkZWwgZGVsYXR0ciBkZWxldGUtcm91dGUgZGljdC1jb21wIGRpciAnXG4gICAgICArICdkaXNhc3NlbWJsZSBkaXNwYXRjaC1yZWFkZXItbWFjcm8gZGlzdGluY3QgZGl2bW9kIGRvIGRvdG8gZHJvcCBkcm9wLWxhc3QgZHJvcC13aGlsZSBlbXB0eT8gJ1xuICAgICAgKyAnZW5kLXNlcXVlbmNlIGV2YWwgZXZhbC1hbmQtY29tcGlsZSBldmFsLXdoZW4tY29tcGlsZSBldmVuPyBldmVyeT8gZXhjZXB0IGV4ZWMgZmlsdGVyIGZpcnN0ICdcbiAgICAgICsgJ2ZsYXR0ZW4gZmxvYXQ/IGZuIGZuYyBmbnIgZm9yIGZvciogZm9ybWF0IGZyYWN0aW9uIGdlbmV4cHIgJ1xuICAgICAgKyAnZ2Vuc3ltIGdldCBnZXRhdHRyIGdsb2JhbCBnbG9iYWxzIGdyb3VwLWJ5IGhhc2F0dHIgaGFzaCBoZXggaWQgJ1xuICAgICAgKyAnaWRlbnRpdHkgaWYgaWYqIGlmLW5vdCBpZi1weXRob24yIGltcG9ydCBpbiBpbmMgaW5wdXQgaW5zdGFuY2U/ICdcbiAgICAgICsgJ2ludGVnZXIgaW50ZWdlci1jaGFyPyBpbnRlZ2VyPyBpbnRlcmxlYXZlIGludGVycG9zZSBpcyBpcy1jb2xsIGlzLWNvbnMgaXMtZW1wdHkgaXMtZXZlbiAnXG4gICAgICArICdpcy1ldmVyeSBpcy1mbG9hdCBpcy1pbnN0YW5jZSBpcy1pbnRlZ2VyIGlzLWludGVnZXItY2hhciBpcy1pdGVyYWJsZSBpcy1pdGVyYXRvciBpcy1rZXl3b3JkIGlzLW5lZyBpcy1ub25lICdcbiAgICAgICsgJ2lzLW5vdCBpcy1udW1lcmljIGlzLW9kZCBpcy1wb3MgaXMtc3RyaW5nIGlzLXN5bWJvbCBpcy16ZXJvIGlzaW5zdGFuY2UgaXNsaWNlIGlzc3ViY2xhc3MgJ1xuICAgICAgKyAnaXRlciBpdGVyYWJsZT8gaXRlcmF0ZSBpdGVyYXRvcj8ga2V5d29yZCBrZXl3b3JkPyBsYW1iZGEgbGFzdCBsZW4gbGV0ICdcbiAgICAgICsgJ2xpZiBsaWYtbm90IGxpc3QqIGxpc3QtY29tcCBsb2NhbHMgbG9vcCBtYWNyby1lcnJvciBtYWNyb2V4cGFuZCBtYWNyb2V4cGFuZC0xIG1hY3JvZXhwYW5kLWFsbCAnXG4gICAgICArICdtYXAgbWF4IG1lcmdlLXdpdGggbWV0aG9kLWRlY29yYXRvciBtaW4gbXVsdGktZGVjb3JhdG9yIG11bHRpY29tYmluYXRpb25zIG5hbWUgbmVnPyBuZXh0ICdcbiAgICAgICsgJ25vbmU/IG5vbmxvY2FsIG5vdCBub3QtaW4gbm90PyBudGggbnVtZXJpYz8gb2N0IG9kZD8gb3BlbiAnXG4gICAgICArICdvciBvcmQgcGFydGl0aW9uIHBlcm11dGF0aW9ucyBwb3M/IHBvc3Qtcm91dGUgcG9zdHdhbGsgcG93IHByZXdhbGsgcHJpbnQgJ1xuICAgICAgKyAncHJvZHVjdCBwcm9maWxlL2NhbGxzIHByb2ZpbGUvY3B1IHB1dC1yb3V0ZSBxdWFzaXF1b3RlIHF1b3RlIHJhaXNlIHJhbmdlIHJlYWQgcmVhZC1zdHIgJ1xuICAgICAgKyAncmVjdXJzaXZlLXJlcGxhY2UgcmVkdWNlIHJlbW92ZSByZXBlYXQgcmVwZWF0ZWRseSByZXByIHJlcXVpcmUgcmVzdCByb3VuZCByb3V0ZSAnXG4gICAgICArICdyb3V0ZS13aXRoLW1ldGhvZHMgcndtIHNlY29uZCBzZXEgc2V0LWNvbXAgc2V0YXR0ciBzZXR2IHNvbWUgc29ydGVkIHN0cmluZyAnXG4gICAgICArICdzdHJpbmc/IHN1bSBzd2l0Y2ggc3ltYm9sPyB0YWtlIHRha2UtbnRoIHRha2Utd2hpbGUgdGVlIHRyeSB1bmxlc3MgJ1xuICAgICAgKyAndW5xdW90ZSB1bnF1b3RlLXNwbGljaW5nIHZhcnMgd2FsayB3aGVuIHdoaWxlIHdpdGggd2l0aCogd2l0aC1kZWNvcmF0b3Igd2l0aC1nZW5zeW1zICdcbiAgICAgICsgJ3hpIHhvciB5aWVsZCB5aWVsZC1mcm9tIHplcm8/IHppcCB6aXAtbG9uZ2VzdCB8IHw9IH4nXG4gIH07XG5cbiAgY29uc3QgU0lNUExFX05VTUJFUl9SRSA9ICdbLStdP1xcXFxkKyhcXFxcLlxcXFxkKyk/JztcblxuICBjb25zdCBTWU1CT0wgPSB7XG4gICAgYmVnaW46IFNZTUJPTF9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IFNJTVBMRV9OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IFNUUklORyA9IGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7IGlsbGVnYWw6IG51bGwgfSk7XG4gIGNvbnN0IENPTU1FTlQgPSBobGpzLkNPTU1FTlQoXG4gICAgJzsnLFxuICAgICckJyxcbiAgICB7IHJlbGV2YW5jZTogMCB9XG4gICk7XG4gIGNvbnN0IExJVEVSQUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgYmVnaW46IC9cXGIoW1R0XXJ1ZXxbRmZdYWxzZXxuaWx8Tm9uZSlcXGIvXG4gIH07XG4gIGNvbnN0IENPTExFQ1RJT04gPSB7XG4gICAgYmVnaW46ICdbXFxcXFtcXFxce10nLFxuICAgIGVuZDogJ1tcXFxcXVxcXFx9XScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IEhJTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICdcXFxcXicgKyBTWU1CT0xfUkVcbiAgfTtcbiAgY29uc3QgSElOVF9DT0wgPSBobGpzLkNPTU1FTlQoJ1xcXFxeXFxcXHsnLCAnXFxcXH0nKTtcbiAgY29uc3QgS0VZID0ge1xuICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgYmVnaW46ICdbOl17MSwyfScgKyBTWU1CT0xfUkVcbiAgfTtcbiAgY29uc3QgTElTVCA9IHtcbiAgICBiZWdpbjogJ1xcXFwoJyxcbiAgICBlbmQ6ICdcXFxcKSdcbiAgfTtcbiAgY29uc3QgQk9EWSA9IHtcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgTkFNRSA9IHtcbiAgICBjbGFzc05hbWU6ICduYW1lJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAga2V5d29yZHM6IGtleXdvcmRzLFxuICAgIGJlZ2luOiBTWU1CT0xfUkUsXG4gICAgc3RhcnRzOiBCT0RZXG4gIH07XG4gIGNvbnN0IERFRkFVTFRfQ09OVEFJTlMgPSBbXG4gICAgTElTVCxcbiAgICBTVFJJTkcsXG4gICAgSElOVCxcbiAgICBISU5UX0NPTCxcbiAgICBDT01NRU5ULFxuICAgIEtFWSxcbiAgICBDT0xMRUNUSU9OLFxuICAgIE5VTUJFUixcbiAgICBMSVRFUkFMLFxuICAgIFNZTUJPTFxuICBdO1xuXG4gIExJU1QuY29udGFpbnMgPSBbXG4gICAgaGxqcy5DT01NRU5UKCdjb21tZW50JywgJycpLFxuICAgIE5BTUUsXG4gICAgQk9EWVxuICBdO1xuICBCT0RZLmNvbnRhaW5zID0gREVGQVVMVF9DT05UQUlOUztcbiAgQ09MTEVDVElPTi5jb250YWlucyA9IERFRkFVTFRfQ09OVEFJTlM7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnSHknLFxuICAgIGFsaWFzZXM6IFsgJ2h5bGFuZycgXSxcbiAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5TSEVCQU5HKCksXG4gICAgICBMSVNULFxuICAgICAgU1RSSU5HLFxuICAgICAgSElOVCxcbiAgICAgIEhJTlRfQ09MLFxuICAgICAgQ09NTUVOVCxcbiAgICAgIEtFWSxcbiAgICAgIENPTExFQ1RJT04sXG4gICAgICBOVU1CRVIsXG4gICAgICBMSVRFUkFMXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBoeSBhcyBkZWZhdWx0IH07XG4iXX0=