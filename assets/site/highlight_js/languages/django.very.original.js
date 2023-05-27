function django(hljs) {
    const FILTER = {
        begin: /\|[A-Za-z]+:?/,
        keywords: { name: 'truncatewords removetags linebreaksbr yesno get_digit timesince random striptags '
                + 'filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands '
                + 'title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode '
                + 'timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort '
                + 'dictsortreversed default_if_none pluralize lower join center default '
                + 'truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first '
                + 'escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize '
                + 'localtime utc timezone' },
        contains: [
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE
        ]
    };
    return {
        name: 'Django',
        aliases: ['jinja'],
        case_insensitive: true,
        subLanguage: 'xml',
        contains: [
            hljs.COMMENT(/\{%\s*comment\s*%\}/, /\{%\s*endcomment\s*%\}/),
            hljs.COMMENT(/\{#/, /#\}/),
            {
                className: 'template-tag',
                begin: /\{%/,
                end: /%\}/,
                contains: [
                    {
                        className: 'name',
                        begin: /\w+/,
                        keywords: { name: 'comment endcomment load templatetag ifchanged endifchanged if endif firstof for '
                                + 'endfor ifnotequal endifnotequal widthratio extends include spaceless '
                                + 'endspaceless regroup ifequal endifequal ssi now with cycle url filter '
                                + 'endfilter debug block endblock else autoescape endautoescape csrf_token empty elif '
                                + 'endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix '
                                + 'plural get_current_language language get_available_languages '
                                + 'get_current_language_bidi get_language_info get_language_info_list localize '
                                + 'endlocalize localtime endlocaltime timezone endtimezone get_current_timezone '
                                + 'verbatim' },
                        starts: {
                            endsWithParent: true,
                            keywords: 'in by as',
                            contains: [FILTER],
                            relevance: 0
                        }
                    }
                ]
            },
            {
                className: 'template-variable',
                begin: /\{\{/,
                end: /\}\}/,
                contains: [FILTER]
            }
        ]
    };
}
export { django as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGphbmdvLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvZGphbmdvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVBQUUsZUFBZTtRQUN0QixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQ1osbUZBQW1GO2tCQUNqRixtRkFBbUY7a0JBQ25GLHVGQUF1RjtrQkFDdkYsK0VBQStFO2tCQUMvRSx1RUFBdUU7a0JBQ3ZFLHVGQUF1RjtrQkFDdkYsc0ZBQXNGO2tCQUN0Rix3QkFBd0IsRUFBRTtRQUNoQyxRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0I7U0FDdEI7S0FDRixDQUFDO0lBRUYsT0FBTztRQUNMLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLENBQUUsT0FBTyxDQUFFO1FBQ3BCLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsV0FBVyxFQUFFLEtBQUs7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSx3QkFBd0IsQ0FBQztZQUM3RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7WUFDMUI7Z0JBQ0UsU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLEtBQUssRUFBRSxLQUFLO2dCQUNaLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUUsTUFBTTt3QkFDakIsS0FBSyxFQUFFLEtBQUs7d0JBQ1osUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUNaLGtGQUFrRjtrQ0FDaEYsdUVBQXVFO2tDQUN2RSx3RUFBd0U7a0NBQ3hFLHFGQUFxRjtrQ0FDckYsbUZBQW1GO2tDQUNuRiwrREFBK0Q7a0NBQy9ELDhFQUE4RTtrQ0FDOUUsK0VBQStFO2tDQUMvRSxVQUFVLEVBQUU7d0JBQ2xCLE1BQU0sRUFBRTs0QkFDTixjQUFjLEVBQUUsSUFBSTs0QkFDcEIsUUFBUSxFQUFFLFVBQVU7NEJBQ3BCLFFBQVEsRUFBRSxDQUFFLE1BQU0sQ0FBRTs0QkFDcEIsU0FBUyxFQUFFLENBQUM7eUJBQ2I7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxtQkFBbUI7Z0JBQzlCLEtBQUssRUFBRSxNQUFNO2dCQUNiLEdBQUcsRUFBRSxNQUFNO2dCQUNYLFFBQVEsRUFBRSxDQUFFLE1BQU0sQ0FBRTthQUNyQjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBEamFuZ29cbkRlc2NyaXB0aW9uOiBEamFuZ28gaXMgYSBoaWdoLWxldmVsIFB5dGhvbiBXZWIgZnJhbWV3b3JrIHRoYXQgZW5jb3VyYWdlcyByYXBpZCBkZXZlbG9wbWVudCBhbmQgY2xlYW4sIHByYWdtYXRpYyBkZXNpZ24uXG5SZXF1aXJlczogeG1sLmpzXG5BdXRob3I6IEl2YW4gU2FnYWxhZXYgPG1hbmlhY0Bzb2Z0d2FyZW1hbmlhY3Mub3JnPlxuQ29udHJpYnV0b3JzOiBJbHlhIEJhcnlzaGV2IDxiYXJ5c2hldkBnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwczovL3d3dy5kamFuZ29wcm9qZWN0LmNvbVxuQ2F0ZWdvcnk6IHRlbXBsYXRlXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZGphbmdvKGhsanMpIHtcbiAgY29uc3QgRklMVEVSID0ge1xuICAgIGJlZ2luOiAvXFx8W0EtWmEtel0rOj8vLFxuICAgIGtleXdvcmRzOiB7IG5hbWU6XG4gICAgICAgICd0cnVuY2F0ZXdvcmRzIHJlbW92ZXRhZ3MgbGluZWJyZWFrc2JyIHllc25vIGdldF9kaWdpdCB0aW1lc2luY2UgcmFuZG9tIHN0cmlwdGFncyAnXG4gICAgICAgICsgJ2ZpbGVzaXplZm9ybWF0IGVzY2FwZSBsaW5lYnJlYWtzIGxlbmd0aF9pcyBsanVzdCByanVzdCBjdXQgdXJsaXplIGZpeF9hbXBlcnNhbmRzICdcbiAgICAgICAgKyAndGl0bGUgZmxvYXRmb3JtYXQgY2FwZmlyc3QgcHByaW50IGRpdmlzaWJsZWJ5IGFkZCBtYWtlX2xpc3QgdW5vcmRlcmVkX2xpc3QgdXJsZW5jb2RlICdcbiAgICAgICAgKyAndGltZXVudGlsIHVybGl6ZXRydW5jIHdvcmRjb3VudCBzdHJpbmdmb3JtYXQgbGluZW51bWJlcnMgc2xpY2UgZGF0ZSBkaWN0c29ydCAnXG4gICAgICAgICsgJ2RpY3Rzb3J0cmV2ZXJzZWQgZGVmYXVsdF9pZl9ub25lIHBsdXJhbGl6ZSBsb3dlciBqb2luIGNlbnRlciBkZWZhdWx0ICdcbiAgICAgICAgKyAndHJ1bmNhdGV3b3Jkc19odG1sIHVwcGVyIGxlbmd0aCBwaG9uZTJudW1lcmljIHdvcmR3cmFwIHRpbWUgYWRkc2xhc2hlcyBzbHVnaWZ5IGZpcnN0ICdcbiAgICAgICAgKyAnZXNjYXBlanMgZm9yY2VfZXNjYXBlIGlyaWVuY29kZSBsYXN0IHNhZmUgc2FmZXNlcSB0cnVuY2F0ZWNoYXJzIGxvY2FsaXplIHVubG9jYWxpemUgJ1xuICAgICAgICArICdsb2NhbHRpbWUgdXRjIHRpbWV6b25lJyB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFXG4gICAgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0RqYW5nbycsXG4gICAgYWxpYXNlczogWyAnamluamEnIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBzdWJMYW5ndWFnZTogJ3htbCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ09NTUVOVCgvXFx7JVxccypjb21tZW50XFxzKiVcXH0vLCAvXFx7JVxccyplbmRjb21tZW50XFxzKiVcXH0vKSxcbiAgICAgIGhsanMuQ09NTUVOVCgvXFx7Iy8sIC8jXFx9LyksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlLXRhZycsXG4gICAgICAgIGJlZ2luOiAvXFx7JS8sXG4gICAgICAgIGVuZDogLyVcXH0vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25hbWUnLFxuICAgICAgICAgICAgYmVnaW46IC9cXHcrLyxcbiAgICAgICAgICAgIGtleXdvcmRzOiB7IG5hbWU6XG4gICAgICAgICAgICAgICAgJ2NvbW1lbnQgZW5kY29tbWVudCBsb2FkIHRlbXBsYXRldGFnIGlmY2hhbmdlZCBlbmRpZmNoYW5nZWQgaWYgZW5kaWYgZmlyc3RvZiBmb3IgJ1xuICAgICAgICAgICAgICAgICsgJ2VuZGZvciBpZm5vdGVxdWFsIGVuZGlmbm90ZXF1YWwgd2lkdGhyYXRpbyBleHRlbmRzIGluY2x1ZGUgc3BhY2VsZXNzICdcbiAgICAgICAgICAgICAgICArICdlbmRzcGFjZWxlc3MgcmVncm91cCBpZmVxdWFsIGVuZGlmZXF1YWwgc3NpIG5vdyB3aXRoIGN5Y2xlIHVybCBmaWx0ZXIgJ1xuICAgICAgICAgICAgICAgICsgJ2VuZGZpbHRlciBkZWJ1ZyBibG9jayBlbmRibG9jayBlbHNlIGF1dG9lc2NhcGUgZW5kYXV0b2VzY2FwZSBjc3JmX3Rva2VuIGVtcHR5IGVsaWYgJ1xuICAgICAgICAgICAgICAgICsgJ2VuZHdpdGggc3RhdGljIHRyYW5zIGJsb2NrdHJhbnMgZW5kYmxvY2t0cmFucyBnZXRfc3RhdGljX3ByZWZpeCBnZXRfbWVkaWFfcHJlZml4ICdcbiAgICAgICAgICAgICAgICArICdwbHVyYWwgZ2V0X2N1cnJlbnRfbGFuZ3VhZ2UgbGFuZ3VhZ2UgZ2V0X2F2YWlsYWJsZV9sYW5ndWFnZXMgJ1xuICAgICAgICAgICAgICAgICsgJ2dldF9jdXJyZW50X2xhbmd1YWdlX2JpZGkgZ2V0X2xhbmd1YWdlX2luZm8gZ2V0X2xhbmd1YWdlX2luZm9fbGlzdCBsb2NhbGl6ZSAnXG4gICAgICAgICAgICAgICAgKyAnZW5kbG9jYWxpemUgbG9jYWx0aW1lIGVuZGxvY2FsdGltZSB0aW1lem9uZSBlbmR0aW1lem9uZSBnZXRfY3VycmVudF90aW1lem9uZSAnXG4gICAgICAgICAgICAgICAgKyAndmVyYmF0aW0nIH0sXG4gICAgICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgIGtleXdvcmRzOiAnaW4gYnkgYXMnLFxuICAgICAgICAgICAgICBjb250YWluczogWyBGSUxURVIgXSxcbiAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZS12YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAvXFx7XFx7LyxcbiAgICAgICAgZW5kOiAvXFx9XFx9LyxcbiAgICAgICAgY29udGFpbnM6IFsgRklMVEVSIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGRqYW5nbyBhcyBkZWZhdWx0IH07XG4iXX0=