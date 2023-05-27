function qml(hljs) {
    const regex = hljs.regex;
    const KEYWORDS = {
        keyword: 'in of on if for while finally var new function do return void else break catch '
            + 'instanceof with throw case default try this switch continue typeof delete '
            + 'let yield const export super debugger as async await import',
        literal: 'true false null undefined NaN Infinity',
        built_in: 'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent '
            + 'encodeURI encodeURIComponent escape unescape Object Function Boolean Error '
            + 'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError '
            + 'TypeError URIError Number Math Date String RegExp Array Float32Array '
            + 'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array '
            + 'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require '
            + 'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect '
            + 'Behavior bool color coordinate date double enumeration font geocircle georectangle '
            + 'geoshape int list matrix4x4 parent point quaternion real rect '
            + 'size string url variant vector2d vector3d vector4d '
            + 'Promise'
    };
    const QML_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9\\._]*';
    const PROPERTY = {
        className: 'keyword',
        begin: '\\bproperty\\b',
        starts: {
            className: 'string',
            end: '(:|=|;|,|//|/\\*|$)',
            returnEnd: true
        }
    };
    const SIGNAL = {
        className: 'keyword',
        begin: '\\bsignal\\b',
        starts: {
            className: 'string',
            end: '(\\(|:|=|;|,|//|/\\*|$)',
            returnEnd: true
        }
    };
    const ID_ID = {
        className: 'attribute',
        begin: '\\bid\\s*:',
        starts: {
            className: 'string',
            end: QML_IDENT_RE,
            returnEnd: false
        }
    };
    const QML_ATTRIBUTE = {
        begin: QML_IDENT_RE + '\\s*:',
        returnBegin: true,
        contains: [
            {
                className: 'attribute',
                begin: QML_IDENT_RE,
                end: '\\s*:',
                excludeEnd: true,
                relevance: 0
            }
        ],
        relevance: 0
    };
    const QML_OBJECT = {
        begin: regex.concat(QML_IDENT_RE, /\s*\{/),
        end: /\{/,
        returnBegin: true,
        relevance: 0,
        contains: [hljs.inherit(hljs.TITLE_MODE, { begin: QML_IDENT_RE })]
    };
    return {
        name: 'QML',
        aliases: ['qt'],
        case_insensitive: false,
        keywords: KEYWORDS,
        contains: [
            {
                className: 'meta',
                begin: /^\s*['"]use (strict|asm)['"]/
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            {
                className: 'string',
                begin: '`',
                end: '`',
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    {
                        className: 'subst',
                        begin: '\\$\\{',
                        end: '\\}'
                    }
                ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'number',
                variants: [
                    { begin: '\\b(0[bB][01]+)' },
                    { begin: '\\b(0[oO][0-7]+)' },
                    { begin: hljs.C_NUMBER_RE }
                ],
                relevance: 0
            },
            {
                begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
                keywords: 'return throw case',
                contains: [
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    hljs.REGEXP_MODE,
                    {
                        begin: /</,
                        end: />\s*[);\]]/,
                        relevance: 0,
                        subLanguage: 'xml'
                    }
                ],
                relevance: 0
            },
            SIGNAL,
            PROPERTY,
            {
                className: 'function',
                beginKeywords: 'function',
                end: /\{/,
                excludeEnd: true,
                contains: [
                    hljs.inherit(hljs.TITLE_MODE, { begin: /[A-Za-z$_][0-9A-Za-z$_]*/ }),
                    {
                        className: 'params',
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        contains: [
                            hljs.C_LINE_COMMENT_MODE,
                            hljs.C_BLOCK_COMMENT_MODE
                        ]
                    }
                ],
                illegal: /\[|%/
            },
            {
                begin: '\\.' + hljs.IDENT_RE,
                relevance: 0
            },
            ID_ID,
            QML_ATTRIBUTE,
            QML_OBJECT
        ],
        illegal: /#/
    };
}
export { qml as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicW1sLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvcW1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsT0FBTyxFQUNMLGlGQUFpRjtjQUMvRSw0RUFBNEU7Y0FDNUUsNkRBQTZEO1FBQ2pFLE9BQU8sRUFDTCx3Q0FBd0M7UUFDMUMsUUFBUSxFQUNOLHVFQUF1RTtjQUNyRSw2RUFBNkU7Y0FDN0UsOEVBQThFO2NBQzlFLHVFQUF1RTtjQUN2RSx1RUFBdUU7Y0FDdkUsZ0ZBQWdGO2NBQ2hGLDhFQUE4RTtjQUM5RSxxRkFBcUY7Y0FDckYsZ0VBQWdFO2NBQ2hFLHFEQUFxRDtjQUNyRCxTQUFTO0tBQ2QsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLDJCQUEyQixDQUFDO0lBSWpELE1BQU0sUUFBUSxHQUFHO1FBQ2YsU0FBUyxFQUFFLFNBQVM7UUFDcEIsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixNQUFNLEVBQUU7WUFDTixTQUFTLEVBQUUsUUFBUTtZQUNuQixHQUFHLEVBQUUscUJBQXFCO1lBQzFCLFNBQVMsRUFBRSxJQUFJO1NBQ2hCO0tBQ0YsQ0FBQztJQUlGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFNBQVM7UUFDcEIsS0FBSyxFQUFFLGNBQWM7UUFDckIsTUFBTSxFQUFFO1lBQ04sU0FBUyxFQUFFLFFBQVE7WUFDbkIsR0FBRyxFQUFFLHlCQUF5QjtZQUM5QixTQUFTLEVBQUUsSUFBSTtTQUNoQjtLQUNGLENBQUM7SUFJRixNQUFNLEtBQUssR0FBRztRQUNaLFNBQVMsRUFBRSxXQUFX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SUFBSTt3QkFDWCxHQUFHLEVBQUUsSUFBSTt3QkFDVCxZQUFZLEVBQUUsSUFBSTt3QkFDbEIsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLFFBQVEsRUFBRTs0QkFDUixJQUFJLENBQUMsbUJBQW1COzRCQUN4QixJQUFJLENBQUMsb0JBQW9CO3lCQUMxQjtxQkFDRjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsTUFBTTthQUNoQjtZQUNEO2dCQUVFLEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVE7Z0JBQzVCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRCxLQUFLO1lBQ0wsYUFBYTtZQUNiLFVBQVU7U0FDWDtRQUNELE9BQU8sRUFBRSxHQUFHO0tBQ2IsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBRTUxcblJlcXVpcmVzOiBqYXZhc2NyaXB0LmpzLCB4bWwuanNcbkF1dGhvcjogSm9obiBGb3N0ZXIgPGpmb3N0ZXJAZXNyaS5jb20+XG5EZXNjcmlwdGlvbjogU3ludGF4IGhpZ2hsaWdodGluZyBmb3IgdGhlIFF0IFF1aWNrIFFNTCBzY3JpcHRpbmcgbGFuZ3VhZ2UsIGJhc2VkIG1vc3RseSBvZmZcbiAgICAgICAgICAgICB0aGUgSmF2YVNjcmlwdCBwYXJzZXIuXG5XZWJzaXRlOiBodHRwczovL2RvYy5xdC5pby9xdC01L3FtbGFwcGxpY2F0aW9ucy5odG1sXG5DYXRlZ29yeTogc2NyaXB0aW5nXG4qL1xuXG5mdW5jdGlvbiBxbWwoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnaW4gb2Ygb24gaWYgZm9yIHdoaWxlIGZpbmFsbHkgdmFyIG5ldyBmdW5jdGlvbiBkbyByZXR1cm4gdm9pZCBlbHNlIGJyZWFrIGNhdGNoICdcbiAgICAgICsgJ2luc3RhbmNlb2Ygd2l0aCB0aHJvdyBjYXNlIGRlZmF1bHQgdHJ5IHRoaXMgc3dpdGNoIGNvbnRpbnVlIHR5cGVvZiBkZWxldGUgJ1xuICAgICAgKyAnbGV0IHlpZWxkIGNvbnN0IGV4cG9ydCBzdXBlciBkZWJ1Z2dlciBhcyBhc3luYyBhd2FpdCBpbXBvcnQnLFxuICAgIGxpdGVyYWw6XG4gICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCBOYU4gSW5maW5pdHknLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ2V2YWwgaXNGaW5pdGUgaXNOYU4gcGFyc2VGbG9hdCBwYXJzZUludCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50ICdcbiAgICAgICsgJ2VuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgZXNjYXBlIHVuZXNjYXBlIE9iamVjdCBGdW5jdGlvbiBCb29sZWFuIEVycm9yICdcbiAgICAgICsgJ0V2YWxFcnJvciBJbnRlcm5hbEVycm9yIFJhbmdlRXJyb3IgUmVmZXJlbmNlRXJyb3IgU3RvcEl0ZXJhdGlvbiBTeW50YXhFcnJvciAnXG4gICAgICArICdUeXBlRXJyb3IgVVJJRXJyb3IgTnVtYmVyIE1hdGggRGF0ZSBTdHJpbmcgUmVnRXhwIEFycmF5IEZsb2F0MzJBcnJheSAnXG4gICAgICArICdGbG9hdDY0QXJyYXkgSW50MTZBcnJheSBJbnQzMkFycmF5IEludDhBcnJheSBVaW50MTZBcnJheSBVaW50MzJBcnJheSAnXG4gICAgICArICdVaW50OEFycmF5IFVpbnQ4Q2xhbXBlZEFycmF5IEFycmF5QnVmZmVyIERhdGFWaWV3IEpTT04gSW50bCBhcmd1bWVudHMgcmVxdWlyZSAnXG4gICAgICArICdtb2R1bGUgY29uc29sZSB3aW5kb3cgZG9jdW1lbnQgU3ltYm9sIFNldCBNYXAgV2Vha1NldCBXZWFrTWFwIFByb3h5IFJlZmxlY3QgJ1xuICAgICAgKyAnQmVoYXZpb3IgYm9vbCBjb2xvciBjb29yZGluYXRlIGRhdGUgZG91YmxlIGVudW1lcmF0aW9uIGZvbnQgZ2VvY2lyY2xlIGdlb3JlY3RhbmdsZSAnXG4gICAgICArICdnZW9zaGFwZSBpbnQgbGlzdCBtYXRyaXg0eDQgcGFyZW50IHBvaW50IHF1YXRlcm5pb24gcmVhbCByZWN0ICdcbiAgICAgICsgJ3NpemUgc3RyaW5nIHVybCB2YXJpYW50IHZlY3RvcjJkIHZlY3RvcjNkIHZlY3RvcjRkICdcbiAgICAgICsgJ1Byb21pc2UnXG4gIH07XG5cbiAgY29uc3QgUU1MX0lERU5UX1JFID0gJ1thLXpBLVpfXVthLXpBLVowLTlcXFxcLl9dKic7XG5cbiAgLy8gSXNvbGF0ZSBwcm9wZXJ0eSBzdGF0ZW1lbnRzLiBFbmRzIGF0IGEgOiwgPSwgOywgLCwgYSBjb21tZW50IG9yIGVuZCBvZiBsaW5lLlxuICAvLyBVc2UgcHJvcGVydHkgY2xhc3MuXG4gIGNvbnN0IFBST1BFUlRZID0ge1xuICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgIGJlZ2luOiAnXFxcXGJwcm9wZXJ0eVxcXFxiJyxcbiAgICBzdGFydHM6IHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBlbmQ6ICcoOnw9fDt8LHwvL3wvXFxcXCp8JCknLFxuICAgICAgcmV0dXJuRW5kOiB0cnVlXG4gICAgfVxuICB9O1xuXG4gIC8vIElzb2xhdGUgc2lnbmFsIHN0YXRlbWVudHMuIEVuZHMgYXQgYSApIGEgY29tbWVudCBvciBlbmQgb2YgbGluZS5cbiAgLy8gVXNlIHByb3BlcnR5IGNsYXNzLlxuICBjb25zdCBTSUdOQUwgPSB7XG4gICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgYmVnaW46ICdcXFxcYnNpZ25hbFxcXFxiJyxcbiAgICBzdGFydHM6IHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBlbmQ6ICcoXFxcXCh8Onw9fDt8LHwvL3wvXFxcXCp8JCknLFxuICAgICAgcmV0dXJuRW5kOiB0cnVlXG4gICAgfVxuICB9O1xuXG4gIC8vIGlkOiBpcyBzcGVjaWFsIGluIFFNTC4gV2hlbiB3ZSBzZWUgaWQ6IHdlIHdhbnQgdG8gbWFyayB0aGUgaWQ6IGFzIGF0dHJpYnV0ZSBhbmRcbiAgLy8gZW1waGFzaXplIHRoZSB0b2tlbiBmb2xsb3dpbmcuXG4gIGNvbnN0IElEX0lEID0ge1xuICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgYmVnaW46ICdcXFxcYmlkXFxcXHMqOicsXG4gICAgc3RhcnRzOiB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgZW5kOiBRTUxfSURFTlRfUkUsXG4gICAgICByZXR1cm5FbmQ6IGZhbHNlXG4gICAgfVxuICB9O1xuXG4gIC8vIEZpbmQgUU1MIG9iamVjdCBhdHRyaWJ1dGUuIEFuIGF0dHJpYnV0ZSBpcyBhIFFNTCBpZGVudGlmaWVyIGZvbGxvd2VkIGJ5IDouXG4gIC8vIFVuZm9ydHVuYXRlbHkgaXQncyBoYXJkIHRvIGtub3cgd2hlcmUgaXQgZW5kcywgYXMgaXQgbWF5IGNvbnRhaW4gc2NhbGFycyxcbiAgLy8gb2JqZWN0cywgb2JqZWN0IGRlZmluaXRpb25zLCBvciBqYXZhc2NyaXB0LiBUaGUgdHJ1ZSBlbmQgaXMgZWl0aGVyIHdoZW4gdGhlIHBhcmVudFxuICAvLyBlbmRzIG9yIHRoZSBuZXh0IGF0dHJpYnV0ZSBpcyBkZXRlY3RlZC5cbiAgY29uc3QgUU1MX0FUVFJJQlVURSA9IHtcbiAgICBiZWdpbjogUU1MX0lERU5UX1JFICsgJ1xcXFxzKjonLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiBRTUxfSURFTlRfUkUsXG4gICAgICAgIGVuZDogJ1xcXFxzKjonLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIC8vIEZpbmQgUU1MIG9iamVjdC4gQSBRTUwgb2JqZWN0IGlzIGEgUU1MIGlkZW50aWZpZXIgZm9sbG93ZWQgYnkgeyBhbmQgZW5kcyBhdCB0aGUgbWF0Y2hpbmcgfS5cbiAgLy8gQWxsIHdlIHJlYWxseSBjYXJlIGFib3V0IGlzIGZpbmRpbmcgSURFTlQgZm9sbG93ZWQgYnkgeyBhbmQganVzdCBtYXJrIHVwIHRoZSBJREVOVCBhbmQgaWdub3JlIHRoZSB7LlxuICBjb25zdCBRTUxfT0JKRUNUID0ge1xuICAgIGJlZ2luOiByZWdleC5jb25jYXQoUU1MX0lERU5UX1JFLCAvXFxzKlxcey8pLFxuICAgIGVuZDogL1xcey8sXG4gICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGNvbnRhaW5zOiBbIGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHsgYmVnaW46IFFNTF9JREVOVF9SRSB9KSBdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUU1MJyxcbiAgICBhbGlhc2VzOiBbICdxdCcgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiBmYWxzZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAvXlxccypbJ1wiXXVzZSAoc3RyaWN0fGFzbSlbJ1wiXS9cbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgeyAvLyB0ZW1wbGF0ZSBzdHJpbmdcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdgJyxcbiAgICAgICAgZW5kOiAnYCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCRcXFxceycsXG4gICAgICAgICAgICBlbmQ6ICdcXFxcfSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHsgYmVnaW46ICdcXFxcYigwW2JCXVswMV0rKScgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXFxcXGIoMFtvT11bMC03XSspJyB9LFxuICAgICAgICAgIHsgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IC8vIFwidmFsdWVcIiBjb250YWluZXJcbiAgICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKGNhc2V8cmV0dXJufHRocm93KVxcXFxiKVxcXFxzKicsXG4gICAgICAgIGtleXdvcmRzOiAncmV0dXJuIHRocm93IGNhc2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIGhsanMuUkVHRVhQX01PREUsXG4gICAgICAgICAgeyAvLyBFNFggLyBKU1hcbiAgICAgICAgICAgIGJlZ2luOiAvPC8sXG4gICAgICAgICAgICBlbmQ6IC8+XFxzKlspO1xcXV0vLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBTSUdOQUwsXG4gICAgICBQUk9QRVJUWSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBlbmQ6IC9cXHsvLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHsgYmVnaW46IC9bQS1aYS16JF9dWzAtOUEtWmEteiRfXSovIH0pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogL1xcKC8sXG4gICAgICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWxsZWdhbDogL1xcW3wlL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gaGFjazogcHJldmVudHMgZGV0ZWN0aW9uIG9mIGtleXdvcmRzIGFmdGVyIGRvdHNcbiAgICAgICAgYmVnaW46ICdcXFxcLicgKyBobGpzLklERU5UX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBJRF9JRCxcbiAgICAgIFFNTF9BVFRSSUJVVEUsXG4gICAgICBRTUxfT0JKRUNUXG4gICAgXSxcbiAgICBpbGxlZ2FsOiAvIy9cbiAgfTtcbn1cblxuZXhwb3J0IHsgcW1sIGFzIGRlZmF1bHQgfTtcbiJdfQ==