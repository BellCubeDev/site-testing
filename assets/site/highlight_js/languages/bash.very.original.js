function bash(hljs) {
    const regex = hljs.regex;
    const VAR = {};
    const BRACED_VAR = {
        begin: /\$\{/,
        end: /\}/,
        contains: [
            "self",
            {
                begin: /:-/,
                contains: [VAR]
            }
        ]
    };
    Object.assign(VAR, {
        className: 'variable',
        variants: [
            { begin: regex.concat(/\$[\w\d#@][\w\d_]*/, `(?![\\w\\d])(?![$])`) },
            BRACED_VAR
        ]
    });
    const SUBST = {
        className: 'subst',
        begin: /\$\(/,
        end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
    };
    const HERE_DOC = {
        begin: /<<-?\s*(?=\w+)/,
        starts: { contains: [
                hljs.END_SAME_AS_BEGIN({
                    begin: /(\w+)/,
                    end: /(\w+)/,
                    className: 'string'
                })
            ] }
    };
    const QUOTE_STRING = {
        className: 'string',
        begin: /"/,
        end: /"/,
        contains: [
            hljs.BACKSLASH_ESCAPE,
            VAR,
            SUBST
        ]
    };
    SUBST.contains.push(QUOTE_STRING);
    const ESCAPED_QUOTE = {
        className: '',
        begin: /\\"/
    };
    const APOS_STRING = {
        className: 'string',
        begin: /'/,
        end: /'/
    };
    const ARITHMETIC = {
        begin: /\$?\(\(/,
        end: /\)\)/,
        contains: [
            {
                begin: /\d+#[0-9a-f]+/,
                className: "number"
            },
            hljs.NUMBER_MODE,
            VAR
        ]
    };
    const SH_LIKE_SHELLS = [
        "fish",
        "bash",
        "zsh",
        "sh",
        "csh",
        "ksh",
        "tcsh",
        "dash",
        "scsh",
    ];
    const KNOWN_SHEBANG = hljs.SHEBANG({
        binary: `(${SH_LIKE_SHELLS.join("|")})`,
        relevance: 10
    });
    const FUNCTION = {
        className: 'function',
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
        relevance: 0
    };
    const KEYWORDS = [
        "if",
        "then",
        "else",
        "elif",
        "fi",
        "for",
        "while",
        "in",
        "do",
        "done",
        "case",
        "esac",
        "function"
    ];
    const LITERALS = [
        "true",
        "false"
    ];
    const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
    const SHELL_BUILT_INS = [
        "break",
        "cd",
        "continue",
        "eval",
        "exec",
        "exit",
        "export",
        "getopts",
        "hash",
        "pwd",
        "readonly",
        "return",
        "shift",
        "test",
        "times",
        "trap",
        "umask",
        "unset"
    ];
    const BASH_BUILT_INS = [
        "alias",
        "bind",
        "builtin",
        "caller",
        "command",
        "declare",
        "echo",
        "enable",
        "help",
        "let",
        "local",
        "logout",
        "mapfile",
        "printf",
        "read",
        "readarray",
        "source",
        "type",
        "typeset",
        "ulimit",
        "unalias"
    ];
    const ZSH_BUILT_INS = [
        "autoload",
        "bg",
        "bindkey",
        "bye",
        "cap",
        "chdir",
        "clone",
        "comparguments",
        "compcall",
        "compctl",
        "compdescribe",
        "compfiles",
        "compgroups",
        "compquote",
        "comptags",
        "comptry",
        "compvalues",
        "dirs",
        "disable",
        "disown",
        "echotc",
        "echoti",
        "emulate",
        "fc",
        "fg",
        "float",
        "functions",
        "getcap",
        "getln",
        "history",
        "integer",
        "jobs",
        "kill",
        "limit",
        "log",
        "noglob",
        "popd",
        "print",
        "pushd",
        "pushln",
        "rehash",
        "sched",
        "setcap",
        "setopt",
        "stat",
        "suspend",
        "ttyctl",
        "unfunction",
        "unhash",
        "unlimit",
        "unsetopt",
        "vared",
        "wait",
        "whence",
        "where",
        "which",
        "zcompile",
        "zformat",
        "zftp",
        "zle",
        "zmodload",
        "zparseopts",
        "zprof",
        "zpty",
        "zregexparse",
        "zsocket",
        "zstyle",
        "ztcp"
    ];
    const GNU_CORE_UTILS = [
        "chcon",
        "chgrp",
        "chown",
        "chmod",
        "cp",
        "dd",
        "df",
        "dir",
        "dircolors",
        "ln",
        "ls",
        "mkdir",
        "mkfifo",
        "mknod",
        "mktemp",
        "mv",
        "realpath",
        "rm",
        "rmdir",
        "shred",
        "sync",
        "touch",
        "truncate",
        "vdir",
        "b2sum",
        "base32",
        "base64",
        "cat",
        "cksum",
        "comm",
        "csplit",
        "cut",
        "expand",
        "fmt",
        "fold",
        "head",
        "join",
        "md5sum",
        "nl",
        "numfmt",
        "od",
        "paste",
        "ptx",
        "pr",
        "sha1sum",
        "sha224sum",
        "sha256sum",
        "sha384sum",
        "sha512sum",
        "shuf",
        "sort",
        "split",
        "sum",
        "tac",
        "tail",
        "tr",
        "tsort",
        "unexpand",
        "uniq",
        "wc",
        "arch",
        "basename",
        "chroot",
        "date",
        "dirname",
        "du",
        "echo",
        "env",
        "expr",
        "factor",
        "groups",
        "hostid",
        "id",
        "link",
        "logname",
        "nice",
        "nohup",
        "nproc",
        "pathchk",
        "pinky",
        "printenv",
        "printf",
        "pwd",
        "readlink",
        "runcon",
        "seq",
        "sleep",
        "stat",
        "stdbuf",
        "stty",
        "tee",
        "test",
        "timeout",
        "tty",
        "uname",
        "unlink",
        "uptime",
        "users",
        "who",
        "whoami",
        "yes"
    ];
    return {
        name: 'Bash',
        aliases: ['sh'],
        keywords: {
            $pattern: /\b[a-z][a-z0-9._-]+\b/,
            keyword: KEYWORDS,
            literal: LITERALS,
            built_in: [
                ...SHELL_BUILT_INS,
                ...BASH_BUILT_INS,
                "set",
                "shopt",
                ...ZSH_BUILT_INS,
                ...GNU_CORE_UTILS
            ]
        },
        contains: [
            KNOWN_SHEBANG,
            hljs.SHEBANG(),
            FUNCTION,
            ARITHMETIC,
            hljs.HASH_COMMENT_MODE,
            HERE_DOC,
            PATH_MODE,
            QUOTE_STRING,
            ESCAPED_QUOTE,
            APOS_STRING,
            VAR
        ]
    };
}
export { bash as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL2Jhc2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNmLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLEtBQUssRUFBRSxNQUFNO1FBQ2IsR0FBRyxFQUFFLElBQUk7UUFDVCxRQUFRLEVBQUU7WUFDUixNQUFNO1lBQ047Z0JBQ0UsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFLENBQUUsR0FBRyxDQUFFO2FBQ2xCO1NBQ0Y7S0FDRixDQUFDO0lBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDakIsU0FBUyxFQUFFLFVBQVU7UUFDckIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFHeEMscUJBQXFCLENBQUMsRUFBRTtZQUMxQixVQUFVO1NBQ1g7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLEtBQUssR0FBRztRQUNaLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEtBQUssRUFBRSxNQUFNO1FBQ2IsR0FBRyxFQUFFLElBQUk7UUFDVCxRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUU7S0FDcEMsQ0FBQztJQUNGLE1BQU0sUUFBUSxHQUFHO1FBQ2YsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDckIsS0FBSyxFQUFFLE9BQU87b0JBQ2QsR0FBRyxF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QUNqQixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFFBQVEsRUFBRTtnQkFDUixHQUFHLGVBQWU7Z0JBQ2xCLEdBQUcsY0FBYztnQkFFakIsS0FBSztnQkFDTCxPQUFPO2dCQUNQLEdBQUcsYUFBYTtnQkFDaEIsR0FBRyxjQUFjO2FBQ2xCO1NBQ0Y7UUFDRCxRQUFRLEVBQUU7WUFDUixhQUFhO1lBQ2IsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLFFBQVE7WUFDUixVQUFVO1lBQ1YsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixRQUFRO1lBQ1IsU0FBUztZQUNULFlBQVk7WUFDWixhQUFhO1lBQ2IsV0FBVztZQUNYLEdBQUc7U0FDSjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQmFzaFxuQXV0aG9yOiB2YWggPHZhaHRlbmJlcmdAZ21haWwuY29tPlxuQ29udHJpYnV0cm9yczogQmVuamFtaW4gUGFubmVsbCA8Y29udGFjdEBzaWVycmFzb2Z0d29ya3MuY29tPlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9iYXNoL1xuQ2F0ZWdvcnk6IGNvbW1vblxuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGJhc2goaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IFZBUiA9IHt9O1xuICBjb25zdCBCUkFDRURfVkFSID0ge1xuICAgIGJlZ2luOiAvXFwkXFx7LyxcbiAgICBlbmQ6IC9cXH0vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBcInNlbGZcIixcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC86LS8sXG4gICAgICAgIGNvbnRhaW5zOiBbIFZBUiBdXG4gICAgICB9IC8vIGRlZmF1bHQgdmFsdWVzXG4gICAgXVxuICB9O1xuICBPYmplY3QuYXNzaWduKFZBUiwge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogcmVnZXguY29uY2F0KC9cXCRbXFx3XFxkI0BdW1xcd1xcZF9dKi8sXG4gICAgICAgIC8vIG5lZ2F0aXZlIGxvb2stYWhlYWQgdHJpZXMgdG8gYXZvaWQgbWF0Y2hpbmcgcGF0dGVybnMgdGhhdCBhcmUgbm90XG4gICAgICAgIC8vIFBlcmwgYXQgYWxsIGxpa2UgJGlkZW50JCwgQGlkZW50QCwgZXRjLlxuICAgICAgICBgKD8hW1xcXFx3XFxcXGRdKSg/IVskXSlgKSB9LFxuICAgICAgQlJBQ0VEX1ZBUlxuICAgIF1cbiAgfSk7XG5cbiAgY29uc3QgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAvXFwkXFwoLyxcbiAgICBlbmQ6IC9cXCkvLFxuICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdXG4gIH07XG4gIGNvbnN0IEhFUkVfRE9DID0ge1xuICAgIGJlZ2luOiAvPDwtP1xccyooPz1cXHcrKS8sXG4gICAgc3RhcnRzOiB7IGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgYmVnaW46IC8oXFx3KykvLFxuICAgICAgICBlbmQ6IC8oXFx3KykvLFxuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnXG4gICAgICB9KVxuICAgIF0gfVxuICB9O1xuICBjb25zdCBRVU9URV9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogL1wiLyxcbiAgICBlbmQ6IC9cIi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgIFZBUixcbiAgICAgIFNVQlNUXG4gICAgXVxuICB9O1xuICBTVUJTVC5jb250YWlucy5wdXNoKFFVT1RFX1NUUklORyk7XG4gIGNvbnN0IEVTQ0FQRURfUVVPVEUgPSB7XG4gICAgY2xhc3NOYW1lOiAnJyxcbiAgICBiZWdpbjogL1xcXFxcIi9cblxuICB9O1xuICBjb25zdCBBUE9TX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvJy8sXG4gICAgZW5kOiAvJy9cbiAgfTtcbiAgY29uc3QgQVJJVEhNRVRJQyA9IHtcbiAgICBiZWdpbjogL1xcJD9cXChcXCgvLFxuICAgIGVuZDogL1xcKVxcKS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXGQrI1swLTlhLWZdKy8sXG4gICAgICAgIGNsYXNzTmFtZTogXCJudW1iZXJcIlxuICAgICAgfSxcbiAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICBWQVJcbiAgICBdXG4gIH07XG4gIGNvbnN0IFNIX0xJS0VfU0hFTExTID0gW1xuICAgIFwiZmlzaFwiLFxuICAgIFwiYmFzaFwiLFxuICAgIFwienNoXCIsXG4gICAgXCJzaFwiLFxuICAgIFwiY3NoXCIsXG4gICAgXCJrc2hcIixcbiAgICBcInRjc2hcIixcbiAgICBcImRhc2hcIixcbiAgICBcInNjc2hcIixcbiAgXTtcbiAgY29uc3QgS05PV05fU0hFQkFORyA9IGhsanMuU0hFQkFORyh7XG4gICAgYmluYXJ5OiBgKCR7U0hfTElLRV9TSEVMTFMuam9pbihcInxcIil9KWAsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9KTtcbiAgY29uc3QgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luOiAvXFx3W1xcd1xcZF9dKlxccypcXChcXHMqXFwpXFxzKlxcey8sXG4gICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgY29udGFpbnM6IFsgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwgeyBiZWdpbjogL1xcd1tcXHdcXGRfXSovIH0pIF0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgS0VZV09SRFMgPSBbXG4gICAgXCJpZlwiLFxuICAgIFwidGhlblwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZWxpZlwiLFxuICAgIFwiZmlcIixcbiAgICBcImZvclwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcImluXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZG9uZVwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiZXNhY1wiLFxuICAgIFwiZnVuY3Rpb25cIlxuICBdO1xuXG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIlxuICBdO1xuXG4gIC8vIHRvIGNvbnN1bWUgcGF0aHMgdG8gcHJldmVudCBrZXl3b3JkIG1hdGNoZXMgaW5zaWRlIHRoZW1cbiAgY29uc3QgUEFUSF9NT0RFID0geyBtYXRjaDogLyhcXC9bYS16Ll8tXSspKy8gfTtcblxuICAvLyBodHRwOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvYmFzaC9tYW51YWwvaHRtbF9ub2RlL1NoZWxsLUJ1aWx0aW4tQ29tbWFuZHMuaHRtbFxuICBjb25zdCBTSEVMTF9CVUlMVF9JTlMgPSBbXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2RcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJldmFsXCIsXG4gICAgXCJleGVjXCIsXG4gICAgXCJleGl0XCIsXG4gICAgXCJleHBvcnRcIixcbiAgICBcImdldG9wdHNcIixcbiAgICBcImhhc2hcIixcbiAgICBcInB3ZFwiLFxuICAgIFwicmVhZG9ubHlcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwic2hpZnRcIixcbiAgICBcInRlc3RcIixcbiAgICBcInRpbWVzXCIsXG4gICAgXCJ0cmFwXCIsXG4gICAgXCJ1bWFza1wiLFxuICAgIFwidW5zZXRcIlxuICBdO1xuXG4gIGNvbnN0IEJBU0hfQlVJTFRfSU5TID0gW1xuICAgIFwiYWxpYXNcIixcbiAgICBcImJpbmRcIixcbiAgICBcImJ1aWx0aW5cIixcbiAgICBcImNhbGxlclwiLFxuICAgIFwiY29tbWFuZFwiLFxuICAgIFwiZGVjbGFyZVwiLFxuICAgIFwiZWNob1wiLFxuICAgIFwiZW5hYmxlXCIsXG4gICAgXCJoZWxwXCIsXG4gICAgXCJsZXRcIixcbiAgICBcImxvY2FsXCIsXG4gICAgXCJsb2dvdXRcIixcbiAgICBcIm1hcGZpbGVcIixcbiAgICBcInByaW50ZlwiLFxuICAgIFwicmVhZFwiLFxuICAgIFwicmVhZGFycmF5XCIsXG4gICAgXCJzb3VyY2VcIixcbiAgICBcInR5cGVcIixcbiAgICBcInR5cGVzZXRcIixcbiAgICBcInVsaW1pdFwiLFxuICAgIFwidW5hbGlhc1wiXG4gIF07XG5cbiAgY29uc3QgWlNIX0JVSUxUX0lOUyA9IFtcbiAgICBcImF1dG9sb2FkXCIsXG4gICAgXCJiZ1wiLFxuICAgIFwiYmluZGtleVwiLFxuICAgIFwiYnllXCIsXG4gICAgXCJjYXBcIixcbiAgICBcImNoZGlyXCIsXG4gICAgXCJjbG9uZVwiLFxuICAgIFwiY29tcGFyZ3VtZW50c1wiLFxuICAgIFwiY29tcGNhbGxcIixcbiAgICBcImNvbXBjdGxcIixcbiAgICBcImNvbXBkZXNjcmliZVwiLFxuICAgIFwiY29tcGZpbGVzXCIsXG4gICAgXCJjb21wZ3JvdXBzXCIsXG4gICAgXCJjb21wcXVvdGVcIixcbiAgICBcImNvbXB0YWdzXCIsXG4gICAgXCJjb21wdHJ5XCIsXG4gICAgXCJjb21wdmFsdWVzXCIsXG4gICAgXCJkaXJzXCIsXG4gICAgXCJkaXNhYmxlXCIsXG4gICAgXCJkaXNvd25cIixcbiAgICBcImVjaG90Y1wiLFxuICAgIFwiZWNob3RpXCIsXG4gICAgXCJlbXVsYXRlXCIsXG4gICAgXCJmY1wiLFxuICAgIFwiZmdcIixcbiAgICBcImZsb2F0XCIsXG4gICAgXCJmdW5jdGlvbnNcIixcbiAgICBcImdldGNhcFwiLFxuICAgIFwiZ2V0bG5cIixcbiAgICBcImhpc3RvcnlcIixcbiAgICBcImludGVnZXJcIixcbiAgICBcImpvYnNcIixcbiAgICBcImtpbGxcIixcbiAgICBcImxpbWl0XCIsXG4gICAgXCJsb2dcIixcbiAgICBcIm5vZ2xvYlwiLFxuICAgIFwicG9wZFwiLFxuICAgIFwicHJpbnRcIixcbiAgICBcInB1c2hkXCIsXG4gICAgXCJwdXNobG5cIixcbiAgICBcInJlaGFzaFwiLFxuICAgIFwic2NoZWRcIixcbiAgICBcInNldGNhcFwiLFxuICAgIFwic2V0b3B0XCIsXG4gICAgXCJzdGF0XCIsXG4gICAgXCJzdXNwZW5kXCIsXG4gICAgXCJ0dHljdGxcIixcbiAgICBcInVuZnVuY3Rpb25cIixcbiAgICBcInVuaGFzaFwiLFxuICAgIFwidW5saW1pdFwiLFxuICAgIFwidW5zZXRvcHRcIixcbiAgICBcInZhcmVkXCIsXG4gICAgXCJ3YWl0XCIsXG4gICAgXCJ3aGVuY2VcIixcbiAgICBcIndoZXJlXCIsXG4gICAgXCJ3aGljaFwiLFxuICAgIFwiemNvbXBpbGVcIixcbiAgICBcInpmb3JtYXRcIixcbiAgICBcInpmdHBcIixcbiAgICBcInpsZVwiLFxuICAgIFwiem1vZGxvYWRcIixcbiAgICBcInpwYXJzZW9wdHNcIixcbiAgICBcInpwcm9mXCIsXG4gICAgXCJ6cHR5XCIsXG4gICAgXCJ6cmVnZXhwYXJzZVwiLFxuICAgIFwienNvY2tldFwiLFxuICAgIFwienN0eWxlXCIsXG4gICAgXCJ6dGNwXCJcbiAgXTtcblxuICBjb25zdCBHTlVfQ09SRV9VVElMUyA9IFtcbiAgICBcImNoY29uXCIsXG4gICAgXCJjaGdycFwiLFxuICAgIFwiY2hvd25cIixcbiAgICBcImNobW9kXCIsXG4gICAgXCJjcFwiLFxuICAgIFwiZGRcIixcbiAgICBcImRmXCIsXG4gICAgXCJkaXJcIixcbiAgICBcImRpcmNvbG9yc1wiLFxuICAgIFwibG5cIixcbiAgICBcImxzXCIsXG4gICAgXCJta2RpclwiLFxuICAgIFwibWtmaWZvXCIsXG4gICAgXCJta25vZFwiLFxuICAgIFwibWt0ZW1wXCIsXG4gICAgXCJtdlwiLFxuICAgIFwicmVhbHBhdGhcIixcbiAgICBcInJtXCIsXG4gICAgXCJybWRpclwiLFxuICAgIFwic2hyZWRcIixcbiAgICBcInN5bmNcIixcbiAgICBcInRvdWNoXCIsXG4gICAgXCJ0cnVuY2F0ZVwiLFxuICAgIFwidmRpclwiLFxuICAgIFwiYjJzdW1cIixcbiAgICBcImJhc2UzMlwiLFxuICAgIFwiYmFzZTY0XCIsXG4gICAgXCJjYXRcIixcbiAgICBcImNrc3VtXCIsXG4gICAgXCJjb21tXCIsXG4gICAgXCJjc3BsaXRcIixcbiAgICBcImN1dFwiLFxuICAgIFwiZXhwYW5kXCIsXG4gICAgXCJmbXRcIixcbiAgICBcImZvbGRcIixcbiAgICBcImhlYWRcIixcbiAgICBcImpvaW5cIixcbiAgICBcIm1kNXN1bVwiLFxuICAgIFwibmxcIixcbiAgICBcIm51bWZtdFwiLFxuICAgIFwib2RcIixcbiAgICBcInBhc3RlXCIsXG4gICAgXCJwdHhcIixcbiAgICBcInByXCIsXG4gICAgXCJzaGExc3VtXCIsXG4gICAgXCJzaGEyMjRzdW1cIixcbiAgICBcInNoYTI1NnN1bVwiLFxuICAgIFwic2hhMzg0c3VtXCIsXG4gICAgXCJzaGE1MTJzdW1cIixcbiAgICBcInNodWZcIixcbiAgICBcInNvcnRcIixcbiAgICBcInNwbGl0XCIsXG4gICAgXCJzdW1cIixcbiAgICBcInRhY1wiLFxuICAgIFwidGFpbFwiLFxuICAgIFwidHJcIixcbiAgICBcInRzb3J0XCIsXG4gICAgXCJ1bmV4cGFuZFwiLFxuICAgIFwidW5pcVwiLFxuICAgIFwid2NcIixcbiAgICBcImFyY2hcIixcbiAgICBcImJhc2VuYW1lXCIsXG4gICAgXCJjaHJvb3RcIixcbiAgICBcImRhdGVcIixcbiAgICBcImRpcm5hbWVcIixcbiAgICBcImR1XCIsXG4gICAgXCJlY2hvXCIsXG4gICAgXCJlbnZcIixcbiAgICBcImV4cHJcIixcbiAgICBcImZhY3RvclwiLFxuICAgIC8vIFwiZmFsc2VcIiwgLy8ga2V5d29yZCBsaXRlcmFsIGFscmVhZHlcbiAgICBcImdyb3Vwc1wiLFxuICAgIFwiaG9zdGlkXCIsXG4gICAgXCJpZFwiLFxuICAgIFwibGlua1wiLFxuICAgIFwibG9nbmFtZVwiLFxuICAgIFwibmljZVwiLFxuICAgIFwibm9odXBcIixcbiAgICBcIm5wcm9jXCIsXG4gICAgXCJwYXRoY2hrXCIsXG4gICAgXCJwaW5reVwiLFxuICAgIFwicHJpbnRlbnZcIixcbiAgICBcInByaW50ZlwiLFxuICAgIFwicHdkXCIsXG4gICAgXCJyZWFkbGlua1wiLFxuICAgIFwicnVuY29uXCIsXG4gICAgXCJzZXFcIixcbiAgICBcInNsZWVwXCIsXG4gICAgXCJzdGF0XCIsXG4gICAgXCJzdGRidWZcIixcbiAgICBcInN0dHlcIixcbiAgICBcInRlZVwiLFxuICAgIFwidGVzdFwiLFxuICAgIFwidGltZW91dFwiLFxuICAgIC8vIFwidHJ1ZVwiLCAvLyBrZXl3b3JkIGxpdGVyYWwgYWxyZWFkeVxuICAgIFwidHR5XCIsXG4gICAgXCJ1bmFtZVwiLFxuICAgIFwidW5saW5rXCIsXG4gICAgXCJ1cHRpbWVcIixcbiAgICBcInVzZXJzXCIsXG4gICAgXCJ3aG9cIixcbiAgICBcIndob2FtaVwiLFxuICAgIFwieWVzXCJcbiAgXTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdCYXNoJyxcbiAgICBhbGlhc2VzOiBbICdzaCcgXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46IC9cXGJbYS16XVthLXowLTkuXy1dK1xcYi8sXG4gICAgICBrZXl3b3JkOiBLRVlXT1JEUyxcbiAgICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgICAgYnVpbHRfaW46IFtcbiAgICAgICAgLi4uU0hFTExfQlVJTFRfSU5TLFxuICAgICAgICAuLi5CQVNIX0JVSUxUX0lOUyxcbiAgICAgICAgLy8gU2hlbGwgbW9kaWZpZXJzXG4gICAgICAgIFwic2V0XCIsXG4gICAgICAgIFwic2hvcHRcIixcbiAgICAgICAgLi4uWlNIX0JVSUxUX0lOUyxcbiAgICAgICAgLi4uR05VX0NPUkVfVVRJTFNcbiAgICAgIF1cbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBLTk9XTl9TSEVCQU5HLCAvLyB0byBjYXRjaCBrbm93biBzaGVsbHMgYW5kIGJvb3N0IHJlbGV2YW5jeVxuICAgICAgaGxqcy5TSEVCQU5HKCksIC8vIHRvIGNhdGNoIHVua25vd24gc2hlbGxzIGJ1dCBzdGlsbCBoaWdobGlnaHQgdGhlIHNoZWJhbmdcbiAgICAgIEZVTkNUSU9OLFxuICAgICAgQVJJVEhNRVRJQyxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBIRVJFX0RPQyxcbiAgICAgIFBBVEhfTU9ERSxcbiAgICAgIFFVT1RFX1NUUklORyxcbiAgICAgIEVTQ0FQRURfUVVPVEUsXG4gICAgICBBUE9TX1NUUklORyxcbiAgICAgIFZBUlxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgYmFzaCBhcyBkZWZhdWx0IH07XG4iXX0=