function perl(hljs) {
    const regex = hljs.regex;
    const KEYWORDS = [
        'abs',
        'accept',
        'alarm',
        'and',
        'atan2',
        'bind',
        'binmode',
        'bless',
        'break',
        'caller',
        'chdir',
        'chmod',
        'chomp',
        'chop',
        'chown',
        'chr',
        'chroot',
        'close',
        'closedir',
        'connect',
        'continue',
        'cos',
        'crypt',
        'dbmclose',
        'dbmopen',
        'defined',
        'delete',
        'die',
        'do',
        'dump',
        'each',
        'else',
        'elsif',
        'endgrent',
        'endhostent',
        'endnetent',
        'endprotoent',
        'endpwent',
        'endservent',
        'eof',
        'eval',
        'exec',
        'exists',
        'exit',
        'exp',
        'fcntl',
        'fileno',
        'flock',
        'for',
        'foreach',
        'fork',
        'format',
        'formline',
        'getc',
        'getgrent',
        'getgrgid',
        'getgrnam',
        'gethostbyaddr',
        'gethostbyname',
        'gethostent',
        'getlogin',
        'getnetbyaddr',
        'getnetbyname',
        'getnetent',
        'getpeername',
        'getpgrp',
        'getpriority',
        'getprotobyname',
        'getprotobynumber',
        'getprotoent',
        'getpwent',
        'getpwnam',
        'getpwuid',
        'getservbyname',
        'getservbyport',
        'getservent',
        'getsockname',
        'getsockopt',
        'given',
        'glob',
        'gmtime',
        'goto',
        'grep',
        'gt',
        'hex',
        'if',
        'index',
        'int',
        'ioctl',
        'join',
        'keys',
        'kill',
        'last',
        'lc',
        'lcfirst',
        'length',
        'link',
        'listen',
        'local',
        'localtime',
        'log',
        'lstat',
        'lt',
        'ma',
        'map',
        'mkdir',
        'msgctl',
        'msgget',
        'msgrcv',
        'msgsnd',
        'my',
        'ne',
        'next',
        'no',
        'not',
        'oct',
        'open',
        'opendir',
        'or',
        'ord',
        'our',
        'pack',
        'package',
        'pipe',
        'pop',
        'pos',
        'print',
        'printf',
        'prototype',
        'push',
        'q|0',
        'qq',
        'quotemeta',
        'qw',
        'qx',
        'rand',
        'read',
        'readdir',
        'readline',
        'readlink',
        'readpipe',
        'recv',
        'redo',
        'ref',
        'rename',
        'require',
        'reset',
        'return',
        'reverse',
        'rewinddir',
        'rindex',
        'rmdir',
        'say',
        'scalar',
        'seek',
        'seekdir',
        'select',
        'semctl',
        'semget',
        'semop',
        'send',
        'setgrent',
        'sethostent',
        'setnetent',
        'setpgrp',
        'setpriority',
        'setprotoent',
        'setpwent',
        'setservent',
        'setsockopt',
        'shift',
        'shmctl',
        'shmget',
        'shmread',
        'shmwrite',
        'shutdown',
        'sin',
        'sleep',
        'socket',
        'socketpair',
        'sort',
        'splice',
        'split',
        'sprintf',
        'sqrt',
        'srand',
        'stat',
        'state',
        'study',
        'sub',
        'substr',
        'symlink',
        'syscall',
        'sysopen',
        'sysread',
        'sysseek',
        'system',
        'syswrite',
        'tell',
        'telldir',
        'tie',
        'tied',
        'time',
        'times',
        'tr',
        'truncate',
        'uc',
        'ucfirst',
        'umask',
        'undef',
        'unless',
        'unlink',
        'unpack',
        'unshift',
        'untie',
        'until',
        'use',
        'utime',
        'values',
        'vec',
        'wait',
        'waitpid',
        'wantarray',
        'warn',
        'when',
        'while',
        'write',
        'x|0',
        'xor',
        'y|0'
    ];
    const REGEX_MODIFIERS = /[dualxmsipngr]{0,12}/;
    const PERL_KEYWORDS = {
        $pattern: /[\w.]+/,
        keyword: KEYWORDS.join(" ")
    };
    const SUBST = {
        className: 'subst',
        begin: '[$@]\\{',
        end: '\\}',
        keywords: PERL_KEYWORDS
    };
    const METHOD = {
        begin: /->\{/,
        end: /\}/
    };
    const VAR = { variants: [
            { begin: /\$\d/ },
            { begin: regex.concat(/[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/, `(?![A-Za-z])(?![@$%])`) },
            {
                begin: /[$%@][^\s\w{]/,
                relevance: 0
            }
        ] };
    const STRING_CONTAINS = [
        hljs.BACKSLASH_ESCAPE,
        SUBST,
        VAR
    ];
    const REGEX_DELIMS = [
        /!/,
        /\//,
        /\|/,
        /\?/,
        /'/,
        /"/,
        /#/
    ];
    const PAIRED_DOUBLE_RE = (prefix, open, close = '\\1') => {
        const middle = (close === '\\1')
            ? close
            : regex.concat(close, open);
        return regex.concat(regex.concat("(?:", prefix, ")"), open, /(?:\\.|[^\\\/])*?/, middle, /(?:\\.|[^\\\/])*?/, close, REGEX_MODIFIERS);
    };
    const PAIRED_RE = (prefix, open, close) => {
        return regex.concat(regex.concat("(?:", prefix, ")"), open, /(?:\\.|[^\\\/])*?/, close, REGEX_MODIFIERS);
    };
    const PERL_DEFAULT_CONTAINS = [
        VAR,
        hljs.HASH_COMMENT_MODE,
        hljs.COMMENT(/^=\w/, /=cut/, { endsWithParent: true }),
        METHOD,
        {
            className: 'string',
            contains: STRING_CONTAINS,
            variants: [
                {
                    begin: 'q[qwxr]?\\s*\\(',
                    end: '\\)',
                    relevance: 5
                },
                {
                    begin: 'q[qwxr]?\\s*\\[',
                    end: '\\]',
                    relevance: 5
                },
                {
                    begin: 'q[qwxr]?\\s*\\{',
                    end: '\\}',
                    relevance: 5
                },
                {
                    begin: 'q[qwxr]?\\s*\\|',
                    end: '\\|',
                    relevance: 5
                },
                {
                    begin: 'q[qwxr]?\\s*<',
                    end: '>',
                    relevance: 5
                },
                {
                    begin: 'qw\\s+q',
                    end: 'q',
                    relevance: 5
                },
                {
                    begin: '\'',
                    end: '\'',
                    contains: [hljs.BACKSLASH_ESCAPE]
                },
                {
                    begin: '"',
                    end: '"'
                },
                {
                    begin: '`',
                    end: '`',
                    contains: [hljs.BACKSLASH_ESCAPE]
                },
                {
                    begin: /\{\w+\}/,
                    relevance: 0
                },
                {
                    begin: '-?\\w+\\s*=>',
                    relevance: 0
                }
            ]
        },
        {
            className: 'number',
            begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
            relevance: 0
        },
        {
            begin: '(\\/\\/|' + hljs.RE_STARTERS_RE + '|\\b(split|return|print|reverse|grep)\\b)\\s*',
            keywords: 'split return print reverse grep',
            relevance: 0,
            contains: [
                hljs.HASH_COMMENT_MODE,
                {
                    className: 'regexp',
                    variants: [
                        { begin: PAIRED_DOUBLE_RE("s|tr|y", regex.either(...REGEX_DELIMS, { capture: true })) },
                        { begin: PAIRED_DOUBLE_RE("s|tr|y", "\\(", "\\)") },
                        { begin: PAIRED_DOUBLE_RE("s|tr|y", "\\[", "\\]") },
                        { begin: PAIRED_DOUBLE_RE("s|tr|y", "\\{", "\\}") }
                    ],
                    relevance: 2
                },
                {
                    className: 'regexp',
                    variants: [
                        {
                            begin: /(m|qr)\/\//,
                            relevance: 0
                        },
                        { begin: PAIRED_RE("(?:m|qr)?", /\//, /\//) },
                        { begin: PAIRED_RE("m|qr", regex.either(...REGEX_DELIMS, { capture: true }), /\1/) },
                        { begin: PAIRED_RE("m|qr", /\(/, /\)/) },
                        { begin: PAIRED_RE("m|qr", /\[/, /\]/) },
                        { begin: PAIRED_RE("m|qr", /\{/, /\}/) }
                    ]
                }
            ]
        },
        {
            className: 'function',
            beginKeywords: 'sub',
            end: '(\\s*\\(.*?\\))?[;{]',
            excludeEnd: true,
            relevance: 5,
            contains: [hljs.TITLE_MODE]
        },
        {
            begin: '-\\w\\b',
            relevance: 0
        },
        {
            begin: "^__DATA__$",
            end: "^__END__$",
            subLanguage: 'mojolicious',
            contains: [
                {
                    begin: "^@@.*",
                    end: "$",
                    className: "comment"
                }
            ]
        }
    ];
    SUBST.contains = PERL_DEFAULT_CONTAINS;
    METHOD.contains = PERL_DEFAULT_CONTAINS;
    return {
        name: 'Perl',
        aliases: [
            'pl',
            'pm'
        ],
        keywords: PERL_KEYWORDS,
        contains: PERL_DEFAULT_CONTAINS
    };
}
export { perl as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3BlcmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsS0FBSztRQUNMLFFBQVE7UUFDUixPQUFPO1FBQ1AsS0FBSztRQUNMLE9BQU87UUFDUCxNQUFNO1FBQ04sU0FBUztRQUNULE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLE9BQU87UUFDUCxPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsS0FBSztRQUNMLFFBQVE7UUFDUixPQUFPO1FBQ1AsVUFBVTtRQUNWLFNBQVM7UUFDVCxVQUFVO1FBQ1YsS0FBSztRQUNMLE9BQU87UUFDUCxVQUFVO1FBQ1YsU0FBUztRQUNULFNBQVM7UUFDVCxRQUFRO1FBQ1IsS0FBSztRQUNMLElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsVUFBVTtRQUNWLFlBQVk7UUFDWixXQUFXO1FBQ1gsYUFBYTtRQUNiLFVBQVU7UUFDVixZQUFZO1FBQ1osS0FBSztRQUNMLE1BQU07UUFDTixNQUFNO1FBQ04sUUFBUTtRQUNSLE1BQU07UUFDTixLQUFLO1FBQ0wsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsS0FBSztRQUNMLFNBQVM7UUFDVCxNQUFNO1FBQ04sUUFBUTtRQUNSLFVBQVU7UUFDVixNQUFNO1FBQ04sVUFBVTtRQUNWLFVBQVU7UUFDVixVQUFVO1FBQ1YsZUFBZTtRQUNmLGVBQWU7UUFDZixZQUFZO1FBQ1osVUFBVTtRQUNWLGNB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LFdBQVc7WUFDaEIsV0FBVyxFQUFFLGFBQWE7WUFDMUIsUUFBUSxFQUFFO2dCQUNSO29CQUNFLEtBQUssRUFBRSxPQUFPO29CQUNkLEdBQUcsRUFBRSxHQUFHO29CQUNSLFNBQVMsRUFBRSxTQUFTO2lCQUNyQjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBQ0YsS0FBSyxDQUFDLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQztJQUN2QyxNQUFNLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDO0lBRXhDLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRTtZQUNQLElBQUk7WUFDSixJQUFJO1NBQ0w7UUFDRCxRQUFRLEVBQUUsYUFBYTtRQUN2QixRQUFRLEVBQUUscUJBQXFCO0tBQ2hDLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUGVybFxuQXV0aG9yOiBQZXRlciBMZW9ub3YgPGdvanBlZ0B5YW5kZXgucnU+XG5XZWJzaXRlOiBodHRwczovL3d3dy5wZXJsLm9yZ1xuQ2F0ZWdvcnk6IGNvbW1vblxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIHBlcmwoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IEtFWVdPUkRTID0gW1xuICAgICdhYnMnLFxuICAgICdhY2NlcHQnLFxuICAgICdhbGFybScsXG4gICAgJ2FuZCcsXG4gICAgJ2F0YW4yJyxcbiAgICAnYmluZCcsXG4gICAgJ2Jpbm1vZGUnLFxuICAgICdibGVzcycsXG4gICAgJ2JyZWFrJyxcbiAgICAnY2FsbGVyJyxcbiAgICAnY2hkaXInLFxuICAgICdjaG1vZCcsXG4gICAgJ2Nob21wJyxcbiAgICAnY2hvcCcsXG4gICAgJ2Nob3duJyxcbiAgICAnY2hyJyxcbiAgICAnY2hyb290JyxcbiAgICAnY2xvc2UnLFxuICAgICdjbG9zZWRpcicsXG4gICAgJ2Nvbm5lY3QnLFxuICAgICdjb250aW51ZScsXG4gICAgJ2NvcycsXG4gICAgJ2NyeXB0JyxcbiAgICAnZGJtY2xvc2UnLFxuICAgICdkYm1vcGVuJyxcbiAgICAnZGVmaW5lZCcsXG4gICAgJ2RlbGV0ZScsXG4gICAgJ2RpZScsXG4gICAgJ2RvJyxcbiAgICAnZHVtcCcsXG4gICAgJ2VhY2gnLFxuICAgICdlbHNlJyxcbiAgICAnZWxzaWYnLFxuICAgICdlbmRncmVudCcsXG4gICAgJ2VuZGhvc3RlbnQnLFxuICAgICdlbmRuZXRlbnQnLFxuICAgICdlbmRwcm90b2VudCcsXG4gICAgJ2VuZHB3ZW50JyxcbiAgICAnZW5kc2VydmVudCcsXG4gICAgJ2VvZicsXG4gICAgJ2V2YWwnLFxuICAgICdleGVjJyxcbiAgICAnZXhpc3RzJyxcbiAgICAnZXhpdCcsXG4gICAgJ2V4cCcsXG4gICAgJ2ZjbnRsJyxcbiAgICAnZmlsZW5vJyxcbiAgICAnZmxvY2snLFxuICAgICdmb3InLFxuICAgICdmb3JlYWNoJyxcbiAgICAnZm9yaycsXG4gICAgJ2Zvcm1hdCcsXG4gICAgJ2Zvcm1saW5lJyxcbiAgICAnZ2V0YycsXG4gICAgJ2dldGdyZW50JyxcbiAgICAnZ2V0Z3JnaWQnLFxuICAgICdnZXRncm5hbScsXG4gICAgJ2dldGhvc3RieWFkZHInLFxuICAgICdnZXRob3N0YnluYW1lJyxcbiAgICAnZ2V0aG9zdGVudCcsXG4gICAgJ2dldGxvZ2luJyxcbiAgICAnZ2V0bmV0YnlhZGRyJyxcbiAgICAnZ2V0bmV0YnluYW1lJyxcbiAgICAnZ2V0bmV0ZW50JyxcbiAgICAnZ2V0cGVlcm5hbWUnLFxuICAgICdnZXRwZ3JwJyxcbiAgICAnZ2V0cHJpb3JpdHknLFxuICAgICdnZXRwcm90b2J5bmFtZScsXG4gICAgJ2dldHByb3RvYnludW1iZXInLFxuICAgICdnZXRwcm90b2VudCcsXG4gICAgJ2dldHB3ZW50JyxcbiAgICAnZ2V0cHduYW0nLFxuICAgICdnZXRwd3VpZCcsXG4gICAgJ2dldHNlcnZieW5hbWUnLFxuICAgICdnZXRzZXJ2Ynlwb3J0JyxcbiAgICAnZ2V0c2VydmVudCcsXG4gICAgJ2dldHNvY2tuYW1lJyxcbiAgICAnZ2V0c29ja29wdCcsXG4gICAgJ2dpdmVuJyxcbiAgICAnZ2xvYicsXG4gICAgJ2dtdGltZScsXG4gICAgJ2dvdG8nLFxuICAgICdncmVwJyxcbiAgICAnZ3QnLFxuICAgICdoZXgnLFxuICAgICdpZicsXG4gICAgJ2luZGV4JyxcbiAgICAnaW50JyxcbiAgICAnaW9jdGwnLFxuICAgICdqb2luJyxcbiAgICAna2V5cycsXG4gICAgJ2tpbGwnLFxuICAgICdsYXN0JyxcbiAgICAnbGMnLFxuICAgICdsY2ZpcnN0JyxcbiAgICAnbGVuZ3RoJyxcbiAgICAnbGluaycsXG4gICAgJ2xpc3RlbicsXG4gICAgJ2xvY2FsJyxcbiAgICAnbG9jYWx0aW1lJyxcbiAgICAnbG9nJyxcbiAgICAnbHN0YXQnLFxuICAgICdsdCcsXG4gICAgJ21hJyxcbiAgICAnbWFwJyxcbiAgICAnbWtkaXInLFxuICAgICdtc2djdGwnLFxuICAgICdtc2dnZXQnLFxuICAgICdtc2dyY3YnLFxuICAgICdtc2dzbmQnLFxuICAgICdteScsXG4gICAgJ25lJyxcbiAgICAnbmV4dCcsXG4gICAgJ25vJyxcbiAgICAnbm90JyxcbiAgICAnb2N0JyxcbiAgICAnb3BlbicsXG4gICAgJ29wZW5kaXInLFxuICAgICdvcicsXG4gICAgJ29yZCcsXG4gICAgJ291cicsXG4gICAgJ3BhY2snLFxuICAgICdwYWNrYWdlJyxcbiAgICAncGlwZScsXG4gICAgJ3BvcCcsXG4gICAgJ3BvcycsXG4gICAgJ3ByaW50JyxcbiAgICAncHJpbnRmJyxcbiAgICAncHJvdG90eXBlJyxcbiAgICAncHVzaCcsXG4gICAgJ3F8MCcsXG4gICAgJ3FxJyxcbiAgICAncXVvdGVtZXRhJyxcbiAgICAncXcnLFxuICAgICdxeCcsXG4gICAgJ3JhbmQnLFxuICAgICdyZWFkJyxcbiAgICAncmVhZGRpcicsXG4gICAgJ3JlYWRsaW5lJyxcbiAgICAncmVhZGxpbmsnLFxuICAgICdyZWFkcGlwZScsXG4gICAgJ3JlY3YnLFxuICAgICdyZWRvJyxcbiAgICAncmVmJyxcbiAgICAncmVuYW1lJyxcbiAgICAncmVxdWlyZScsXG4gICAgJ3Jlc2V0JyxcbiAgICAncmV0dXJuJyxcbiAgICAncmV2ZXJzZScsXG4gICAgJ3Jld2luZGRpcicsXG4gICAgJ3JpbmRleCcsXG4gICAgJ3JtZGlyJyxcbiAgICAnc2F5JyxcbiAgICAnc2NhbGFyJyxcbiAgICAnc2VlaycsXG4gICAgJ3NlZWtkaXInLFxuICAgICdzZWxlY3QnLFxuICAgICdzZW1jdGwnLFxuICAgICdzZW1nZXQnLFxuICAgICdzZW1vcCcsXG4gICAgJ3NlbmQnLFxuICAgICdzZXRncmVudCcsXG4gICAgJ3NldGhvc3RlbnQnLFxuICAgICdzZXRuZXRlbnQnLFxuICAgICdzZXRwZ3JwJyxcbiAgICAnc2V0cHJpb3JpdHknLFxuICAgICdzZXRwcm90b2VudCcsXG4gICAgJ3NldHB3ZW50JyxcbiAgICAnc2V0c2VydmVudCcsXG4gICAgJ3NldHNvY2tvcHQnLFxuICAgICdzaGlmdCcsXG4gICAgJ3NobWN0bCcsXG4gICAgJ3NobWdldCcsXG4gICAgJ3NobXJlYWQnLFxuICAgICdzaG13cml0ZScsXG4gICAgJ3NodXRkb3duJyxcbiAgICAnc2luJyxcbiAgICAnc2xlZXAnLFxuICAgICdzb2NrZXQnLFxuICAgICdzb2NrZXRwYWlyJyxcbiAgICAnc29ydCcsXG4gICAgJ3NwbGljZScsXG4gICAgJ3NwbGl0JyxcbiAgICAnc3ByaW50ZicsXG4gICAgJ3NxcnQnLFxuICAgICdzcmFuZCcsXG4gICAgJ3N0YXQnLFxuICAgICdzdGF0ZScsXG4gICAgJ3N0dWR5JyxcbiAgICAnc3ViJyxcbiAgICAnc3Vic3RyJyxcbiAgICAnc3ltbGluaycsXG4gICAgJ3N5c2NhbGwnLFxuICAgICdzeXNvcGVuJyxcbiAgICAnc3lzcmVhZCcsXG4gICAgJ3N5c3NlZWsnLFxuICAgICdzeXN0ZW0nLFxuICAgICdzeXN3cml0ZScsXG4gICAgJ3RlbGwnLFxuICAgICd0ZWxsZGlyJyxcbiAgICAndGllJyxcbiAgICAndGllZCcsXG4gICAgJ3RpbWUnLFxuICAgICd0aW1lcycsXG4gICAgJ3RyJyxcbiAgICAndHJ1bmNhdGUnLFxuICAgICd1YycsXG4gICAgJ3VjZmlyc3QnLFxuICAgICd1bWFzaycsXG4gICAgJ3VuZGVmJyxcbiAgICAndW5sZXNzJyxcbiAgICAndW5saW5rJyxcbiAgICAndW5wYWNrJyxcbiAgICAndW5zaGlmdCcsXG4gICAgJ3VudGllJyxcbiAgICAndW50aWwnLFxuICAgICd1c2UnLFxuICAgICd1dGltZScsXG4gICAgJ3ZhbHVlcycsXG4gICAgJ3ZlYycsXG4gICAgJ3dhaXQnLFxuICAgICd3YWl0cGlkJyxcbiAgICAnd2FudGFycmF5JyxcbiAgICAnd2FybicsXG4gICAgJ3doZW4nLFxuICAgICd3aGlsZScsXG4gICAgJ3dyaXRlJyxcbiAgICAneHwwJyxcbiAgICAneG9yJyxcbiAgICAneXwwJ1xuICBdO1xuXG4gIC8vIGh0dHBzOi8vcGVybGRvYy5wZXJsLm9yZy9wZXJscmUjTW9kaWZpZXJzXG4gIGNvbnN0IFJFR0VYX01PRElGSUVSUyA9IC9bZHVhbHhtc2lwbmdyXXswLDEyfS87IC8vIGFhIGFuZCB4eCBhcmUgdmFsaWQsIG1ha2luZyBtYXggbGVuZ3RoIDEyXG4gIGNvbnN0IFBFUkxfS0VZV09SRFMgPSB7XG4gICAgJHBhdHRlcm46IC9bXFx3Ll0rLyxcbiAgICBrZXl3b3JkOiBLRVlXT1JEUy5qb2luKFwiIFwiKVxuICB9O1xuICBjb25zdCBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46ICdbJEBdXFxcXHsnLFxuICAgIGVuZDogJ1xcXFx9JyxcbiAgICBrZXl3b3JkczogUEVSTF9LRVlXT1JEU1xuICB9O1xuICBjb25zdCBNRVRIT0QgPSB7XG4gICAgYmVnaW46IC8tPlxcey8sXG4gICAgZW5kOiAvXFx9L1xuICAgIC8vIGNvbnRhaW5zIGRlZmluZWQgbGF0ZXJcbiAgfTtcbiAgY29uc3QgVkFSID0geyB2YXJpYW50czogW1xuICAgIHsgYmVnaW46IC9cXCRcXGQvIH0sXG4gICAgeyBiZWdpbjogcmVnZXguY29uY2F0KFxuICAgICAgL1skJUBdKFxcXlxcd1xcYnwjXFx3Kyg6OlxcdyspKnxcXHtcXHcrXFx9fFxcdysoOjpcXHcqKSopLyxcbiAgICAgIC8vIG5lZ2F0aXZlIGxvb2stYWhlYWQgdHJpZXMgdG8gYXZvaWQgbWF0Y2hpbmcgcGF0dGVybnMgdGhhdCBhcmUgbm90XG4gICAgICAvLyBQZXJsIGF0IGFsbCBsaWtlICRpZGVudCQsIEBpZGVudEAsIGV0Yy5cbiAgICAgIGAoPyFbQS1aYS16XSkoPyFbQCQlXSlgXG4gICAgKSB9LFxuICAgIHtcbiAgICAgIGJlZ2luOiAvWyQlQF1bXlxcc1xcd3tdLyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH1cbiAgXSB9O1xuICBjb25zdCBTVFJJTkdfQ09OVEFJTlMgPSBbXG4gICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgIFNVQlNULFxuICAgIFZBUlxuICBdO1xuICBjb25zdCBSRUdFWF9ERUxJTVMgPSBbXG4gICAgLyEvLFxuICAgIC9cXC8vLFxuICAgIC9cXHwvLFxuICAgIC9cXD8vLFxuICAgIC8nLyxcbiAgICAvXCIvLCAvLyB2YWxpZCBidXQgaW5mcmVxdWVudCBhbmQgd2VpcmRcbiAgICAvIy8gLy8gdmFsaWQgYnV0IGluZnJlcXVlbnQgYW5kIHdlaXJkXG4gIF07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHByZWZpeFxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IG9wZW5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBjbG9zZVxuICAgKi9cbiAgY29uc3QgUEFJUkVEX0RPVUJMRV9SRSA9IChwcmVmaXgsIG9wZW4sIGNsb3NlID0gJ1xcXFwxJykgPT4ge1xuICAgIGNvbnN0IG1pZGRsZSA9IChjbG9zZSA9PT0gJ1xcXFwxJylcbiAgICAgID8gY2xvc2VcbiAgICAgIDogcmVnZXguY29uY2F0KGNsb3NlLCBvcGVuKTtcbiAgICByZXR1cm4gcmVnZXguY29uY2F0KFxuICAgICAgcmVnZXguY29uY2F0KFwiKD86XCIsIHByZWZpeCwgXCIpXCIpLFxuICAgICAgb3BlbixcbiAgICAgIC8oPzpcXFxcLnxbXlxcXFxcXC9dKSo/LyxcbiAgICAgIG1pZGRsZSxcbiAgICAgIC8oPzpcXFxcLnxbXlxcXFxcXC9dKSo/LyxcbiAgICAgIGNsb3NlLFxuICAgICAgUkVHRVhfTU9ESUZJRVJTXG4gICAgKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gcHJlZml4XG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gb3BlblxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGNsb3NlXG4gICAqL1xuICBjb25zdCBQQUlSRURfUkUgPSAocHJlZml4LCBvcGVuLCBjbG9zZSkgPT4ge1xuICAgIHJldHVybiByZWdleC5jb25jYXQoXG4gICAgICByZWdleC5jb25jYXQoXCIoPzpcIiwgcHJlZml4LCBcIilcIiksXG4gICAgICBvcGVuLFxuICAgICAgLyg/OlxcXFwufFteXFxcXFxcL10pKj8vLFxuICAgICAgY2xvc2UsXG4gICAgICBSRUdFWF9NT0RJRklFUlNcbiAgICApO1xuICB9O1xuICBjb25zdCBQRVJMX0RFRkFVTFRfQ09OVEFJTlMgPSBbXG4gICAgVkFSLFxuICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgaGxqcy5DT01NRU5UKFxuICAgICAgL149XFx3LyxcbiAgICAgIC89Y3V0LyxcbiAgICAgIHsgZW5kc1dpdGhQYXJlbnQ6IHRydWUgfVxuICAgICksXG4gICAgTUVUSE9ELFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcKCcsXG4gICAgICAgICAgZW5kOiAnXFxcXCknLFxuICAgICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFxbJyxcbiAgICAgICAgICBlbmQ6ICdcXFxcXScsXG4gICAgICAgICAgcmVsZXZhbmNlOiA1XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXHsnLFxuICAgICAgICAgIGVuZDogJ1xcXFx9JyxcbiAgICAgICAgICByZWxldmFuY2U6IDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcfCcsXG4gICAgICAgICAgZW5kOiAnXFxcXHwnLFxuICAgICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKjwnLFxuICAgICAgICAgIGVuZDogJz4nLFxuICAgICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICdxd1xcXFxzK3EnLFxuICAgICAgICAgIGVuZDogJ3EnLFxuICAgICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICdcXCcnLFxuICAgICAgICAgIGVuZDogJ1xcJycsXG4gICAgICAgICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICAgIGVuZDogJ1wiJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46ICdgJyxcbiAgICAgICAgICBlbmQ6ICdgJyxcbiAgICAgICAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmVnaW46IC9cXHtcXHcrXFx9LyxcbiAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiAnLT9cXFxcdytcXFxccyo9PicsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICBiZWdpbjogJyhcXFxcYjBbMC03X10rKXwoXFxcXGIweFswLTlhLWZBLUZfXSspfChcXFxcYlsxLTldWzAtOV9dKihcXFxcLlswLTlfXSspPyl8WzBfXVxcXFxiJyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAgeyAvLyByZWdleHAgY29udGFpbmVyXG4gICAgICBiZWdpbjogJyhcXFxcL1xcXFwvfCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJ3xcXFxcYihzcGxpdHxyZXR1cm58cHJpbnR8cmV2ZXJzZXxncmVwKVxcXFxiKVxcXFxzKicsXG4gICAgICBrZXl3b3JkczogJ3NwbGl0IHJldHVybiBwcmludCByZXZlcnNlIGdyZXAnLFxuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgIC8vIGFsbG93IG1hdGNoaW5nIGNvbW1vbiBkZWxpbWl0ZXJzXG4gICAgICAgICAgICB7IGJlZ2luOiBQQUlSRURfRE9VQkxFX1JFKFwic3x0cnx5XCIsIHJlZ2V4LmVpdGhlciguLi5SRUdFWF9ERUxJTVMsIHsgY2FwdHVyZTogdHJ1ZSB9KSkgfSxcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIHBhaXJlZCBkZWxtaXNcbiAgICAgICAgICAgIHsgYmVnaW46IFBBSVJFRF9ET1VCTEVfUkUoXCJzfHRyfHlcIiwgXCJcXFxcKFwiLCBcIlxcXFwpXCIpIH0sXG4gICAgICAgICAgICB7IGJlZ2luOiBQQUlSRURfRE9VQkxFX1JFKFwic3x0cnx5XCIsIFwiXFxcXFtcIiwgXCJcXFxcXVwiKSB9LFxuICAgICAgICAgICAgeyBiZWdpbjogUEFJUkVEX0RPVUJMRV9SRShcInN8dHJ8eVwiLCBcIlxcXFx7XCIsIFwiXFxcXH1cIikgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVsZXZhbmNlOiAyXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIGNvdWxkIGJlIGEgY29tbWVudCBpbiBtYW55IGxhbmd1YWdlcyBzbyBkbyBub3QgY291bnRcbiAgICAgICAgICAgICAgLy8gYXMgcmVsZXZhbnRcbiAgICAgICAgICAgICAgYmVnaW46IC8obXxxcilcXC9cXC8vLFxuICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBwcmVmaXggaXMgb3B0aW9uYWwgd2l0aCAvcmVnZXgvXG4gICAgICAgICAgICB7IGJlZ2luOiBQQUlSRURfUkUoXCIoPzptfHFyKT9cIiwgL1xcLy8sIC9cXC8vKSB9LFxuICAgICAgICAgICAgLy8gYWxsb3cgbWF0Y2hpbmcgY29tbW9uIGRlbGltaXRlcnNcbiAgICAgICAgICAgIHsgYmVnaW46IFBBSVJFRF9SRShcIm18cXJcIiwgcmVnZXguZWl0aGVyKC4uLlJFR0VYX0RFTElNUywgeyBjYXB0dXJlOiB0cnVlIH0pLCAvXFwxLykgfSxcbiAgICAgICAgICAgIC8vIGFsbG93IGNvbW1vbiBwYWlyZWQgZGVsbWluc1xuICAgICAgICAgICAgeyBiZWdpbjogUEFJUkVEX1JFKFwibXxxclwiLCAvXFwoLywgL1xcKS8pIH0sXG4gICAgICAgICAgICB7IGJlZ2luOiBQQUlSRURfUkUoXCJtfHFyXCIsIC9cXFsvLCAvXFxdLykgfSxcbiAgICAgICAgICAgIHsgYmVnaW46IFBBSVJFRF9SRShcIm18cXJcIiwgL1xcey8sIC9cXH0vKSB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICBiZWdpbktleXdvcmRzOiAnc3ViJyxcbiAgICAgIGVuZDogJyhcXFxccypcXFxcKC4qP1xcXFwpKT9bO3tdJyxcbiAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICByZWxldmFuY2U6IDUsXG4gICAgICBjb250YWluczogWyBobGpzLlRJVExFX01PREUgXVxuICAgIH0sXG4gICAge1xuICAgICAgYmVnaW46ICctXFxcXHdcXFxcYicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZ2luOiBcIl5fX0RBVEFfXyRcIixcbiAgICAgIGVuZDogXCJeX19FTkRfXyRcIixcbiAgICAgIHN1Ykxhbmd1YWdlOiAnbW9qb2xpY2lvdXMnLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGJlZ2luOiBcIl5AQC4qXCIsXG4gICAgICAgICAgZW5kOiBcIiRcIixcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29tbWVudFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF07XG4gIFNVQlNULmNvbnRhaW5zID0gUEVSTF9ERUZBVUxUX0NPTlRBSU5TO1xuICBNRVRIT0QuY29udGFpbnMgPSBQRVJMX0RFRkFVTFRfQ09OVEFJTlM7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUGVybCcsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ3BsJyxcbiAgICAgICdwbSdcbiAgICBdLFxuICAgIGtleXdvcmRzOiBQRVJMX0tFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBQRVJMX0RFRkFVTFRfQ09OVEFJTlNcbiAgfTtcbn1cblxuZXhwb3J0IHsgcGVybCBhcyBkZWZhdWx0IH07XG4iXX0=