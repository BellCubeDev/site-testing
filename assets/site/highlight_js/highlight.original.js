var deepFreezeEs6 = { exports: {} };
function deepFreeze(obj) {
    if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function () {
            throw new Error('map is read-only');
        };
    }
    else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function () {
            throw new Error('set is read-only');
        };
    }
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(function (name) {
        var prop = obj[name];
        if (typeof prop == 'object' && !Object.isFrozen(prop)) {
            deepFreeze(prop);
        }
    });
    return obj;
}
deepFreezeEs6.exports = deepFreeze;
deepFreezeEs6.exports.default = deepFreeze;
class Response {
    constructor(mode) {
        if (mode.data === undefined)
            mode.data = {};
        this.data = mode.data;
        this.isMatchIgnored = false;
    }
    ignoreMatch() {
        this.isMatchIgnored = true;
    }
}
function escapeHTML(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
function inherit$1(original, ...objects) {
    const result = Object.create(null);
    for (const key in original) {
        result[key] = original[key];
    }
    objects.forEach(function (obj) {
        for (const key in obj) {
            result[key] = obj[key];
        }
    });
    return (result);
}
const SPAN_CLOSE = '</span>';
const emitsWrappingTags = (node) => {
    return !!node.scope || (node.sublanguage && node.language);
};
const scopeToCSSClass = (name, { prefix }) => {
    if (name.includes(".")) {
        const pieces = name.split(".");
        return [
            `${prefix}${pieces.shift()}`,
            ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
        ].join(" ");
    }
    return `${prefix}${name}`;
};
class HTMLRenderer {
    constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
    }
    addText(text) {
        this.buffer += escapeHTML(text);
    }
    openNode(node) {
        if (!emitsWrappingTags(node))
            return;
        let className = "";
        if (node.sublanguage) {
            className = `language-${node.language}`;
        }
        else {
            className = scopeToCSSClass(node.scope, { prefix: this.classPrefix });
        }
        this.span(className);
    }
    closeNode(node) {
        if (!emitsWrappingTags(node))
            return;
        this.buffer += SPAN_CLOSE;
    }
    value() {
        return this.buffer;
    }
    span(className) {
        this.buffer += `<span class="${className}">`;
    }
}
const newNode = (opts = {}) => {
    const result = { children: [] };
    Object.assign(result, opts);
    return result;
};
class TokenTree {
    constructor() {
        this.rootNode = newNode();
        this.stack = [this.rootNode];
    }
    get top() {
        return this.stack[this.stack.length - 1];
    }
    get root() { return this.rootNode; }
    add(node) {
        this.top.children.push(node);
    }
    openNode(scope) {
        const node = newNode({ scope });
        this.add(node);
        this.stack.push(node);
    }
    closeNode() {
        if (this.stack.length > 1) {
            return this.stack.pop();
        }
        return undefined;
    }
    closeAllNodes() {
        while (this.closeNode())
            ;
    }
    toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
    }
    walk(builder) {
        return this.constructor._walk(builder, this.rootNode);
    }
    static _walk(builder, node) {
        if (typeof node === "string") {
            builder.addText(node);
        }
        else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
        }
        return builder;
    }
    static _collapse(node) {
        if (typeof node === "string")
            return;
        if (!node.children)
            return;
        if (node.children.every(el => typeof el === "string")) {
            node.children = [node.children.join("")];
        }
        else {
            node.children.forEach((child) => {
                TokenTree._collapse(child);
            });
        }
    }
}
class TokenTreeEmitter extends TokenTree {
    constructor(options) {
        super();
        this.options = options;
    }
    addKeyword(text, scope) {
        if (text === "") {
            return;
        }
        this.openNode(scope);
        this.addText(text);
        this.closeNode();
    }
    addText(text) {
        if (text === "") {
            return;
        }
        this.add(text);
    }
    addSublanguage(emitter, name) {
        const node = emitter.root;
        node.sublanguage = true;
        node.language = name;
        this.add(node);
    }
    toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
    }
    finalize() {
        return true;
    }
}
function source(re) {
    if (!re)
        return null;
    if (typeof re === "string")
        return re;
    return re.source;
}
function lookahead(re) {
    return concat('(?=', re, ')');
}
function anyNumberOfTimes(re) {
    return concat('(?:', re, ')*');
}
function optional(re) {
    return concat('(?:', re, ')?');
}
function concat(...args) {
    const joined = args.map((x) => source(x)).join("");
    return joined;
}
function stripOptionsFromArgs(args) {
    const opts = args[args.length - 1];
    if (typeof opts === 'object' && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
    }
    else {
        return {};
    }
}
function either(...args) {
    const opts = stripOptionsFromArgs(args);
    const joined = '('
        + (opts.capture ? "" : "?:")
        + args.map((x) => source(x)).join("|") + ")";
    return joined;
}
function countMatchGroups(re) {
    return (new RegExp(re.toString() + '|')).exec('').length - 1;
}
function startsWith(re, lexeme) {
    const match = re && re.exec(lexeme);
    return match && match.index === 0;
}
const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function _rewriteBackreferences(regexps, { joinWith }) {
    let numCaptures = 0;
    return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = '';
        while (re.length > 0) {
            const match = BACKREF_RE.exec(re);
            if (!match) {
                out += re;
                break;
            }
            out += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === '\\' && match[1]) {
                out += '\\' + String(Number(match[1]) + offset);
            }
            else {
                out += match[0];
                if (match[0] === '(') {
                    numCaptures++;
                }
            }
        }
        return out;
    }).map(re => `(${re})`).join(joinWith);
}
const MATCH_NOTHING_RE = /\b\B/;
const IDENT_RE = '[a-zA-Z]\\w*';
const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)';
const BINARY_NUMBER_RE = '\\b(0b[01]+)';
const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';
const SHEBANG = (opts = {}) => {
    const beginShebang = /^#![ ]*\//;
    if (opts.binary) {
        opts.begin = concat(beginShebang, /.*\b/, opts.binary, /\b.*/);
    }
    return inherit$1({
        scope: 'meta',
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        "on:begin": (m, resp) => {
            if (m.index !== 0)
                resp.ignoreMatch();
        }
    }, opts);
};
const BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
};
const APOS_STRING_MODE = {
    scope: 'string',
    begin: '\'',
    end: '\'',
    illegal: '\\n',
    contains: [BACKSLASH_ESCAPE]
};
const QUOTE_STRING_MODE = {
    scope: 'string',
    begin: '"',
    end: '"',
    illegal: '\\n',
    contains: [BACKSLASH_ESCAPE]
};
const PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
const COMMENT = function (begin, end, modeOptions = {}) {
    const mode = inherit$1({
        scope: 'comment',
        begin,
        end,
        contains: []
    }, modeOptions);
    mode.contains.push({
        scope: 'doctag',
        begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
    });
    const ENGLISH_WORD = either("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
    mode.contains.push({
        begin: concat(/[ ]+/, '(', ENGLISH_WORD, /[.]?[:]?([.][ ]|[ ])/, '){3}')
    });
    return mode;
};
const C_LINE_COMMENT_MODE = COMMENT('//', '$');
const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
const HASH_COMMENT_MODE = COMMENT('#', '$');
const NUMBER_MODE = {
    scope: 'number',
    begin: NUMBER_RE,
    relevance: 0
};
const C_NUMBER_MODE = {
    scope: 'number',
    begin: C_NUMBER_RE,
    relevance: 0
};
const BINARY_NUMBER_MODE = {
    scope: 'number',
    begin: BINARY_NUMBER_RE,
    relevance: 0
};
const REGEXP_MODE = {
    begin: /(?=\/[^/\n]*\/)/,
    contains: [{
            scope: 'regexp',
            begin: /\//,
            end: /\/[gimuy]*/,
            illegal: /\n/,
            contains: [
                BACKSLASH_ESCAPE,
                {
                    begin: /\[/,
                    end: /\]/,
                    relevance: 0,
                    contains: [BACKSLASH_ESCAPE]
                }
            ]
        }]
};
const TITLE_MODE = {
    scope: 'title',
    begin: IDENT_RE,
    relevance: 0
};
const UNDERSCORE_TITLE_MODE = {
    scope: 'title',
    begin: UNDERSCORE_IDENT_RE,
    relevance: 0
};
const METHOD_GUARD = {
    begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
    relevance: 0
};
const END_SAME_AS_BEGIN = function (mode) {
    return Object.assign(mode, {
        'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
        'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1])
            resp.ignoreMatch(); }
    });
};
var MODES = Object.freeze({
    __proto__: null,
    MATCH_NOTHING_RE: MATCH_NOTHING_RE,
    IDENT_RE: IDENT_RE,
    UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
    NUMBER_RE: NUMBER_RE,
    C_NUMBER_RE: C_NUMBER_RE,
    BINARY_NUMBER_RE: BINARY_NUMBER_RE,
    RE_STARTERS_RE: RE_STARTERS_RE,
    SHEBANG: SHEBANG,
    BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
    APOS_STRING_MODE: APOS_STRING_MODE,
    QUOTE_STRING_MODE: QUOTE_STRING_MODE,
    PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
    COMMENT: COMMENT,
    C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
    C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
    HASH_COMMENT_MODE: HASH_COMMENT_MODE,
    NUMBER_MODE: NUMBER_MODE,
    C_NUMBER_MODE: C_NUMBER_MODE,
    BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
    REGEXP_MODE: REGEXP_MODE,
    TITLE_MODE: TITLE_MODE,
    UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE,
    METHOD_GUARD: METHOD_GUARD,
    END_SAME_AS_BEGIN: END_SAME_AS_BEGIN
});
function skipIfHasPrecedingDot(match, response) {
    const before = match.input[match.index - 1];
    if (before === ".") {
        response.ignoreMatch();
    }
}
function scopeClassName(mode, _parent) {
    if (mode.className !== undefined) {
        mode.scope = mode.className;
        delete mode.className;
    }
}
function beginKeywords(mode, parent) {
    if (!parent)
        return;
    if (!mode.beginKeywords)
        return;
    mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
    mode.__beforeBegin = skipIfHasPrecedingDot;
    mode.keywords = mode.keywords || mode.beginKeywords;
    delete mode.beginKeywords;
    if (mode.relevance === undefined)
        mode.relevance = 0;
}
function compileIllegal(mode, _parent) {
    if (!Array.isArray(mode.illegal))
        return;
    mode.illegal = either(...mode.illegal);
}
function compileMatch(mode, _parent) {
    if (!mode.match)
        return;
    if (mode.begin || mode.end)
        throw new Error("begin & end are not supported with match");
    mode.begin = mode.match;
    delete mode.match;
}
function compileRelevance(mode, _parent) {
    if (mode.relevance === undefined)
        mode.relevance = 1;
}
const beforeMatchExt = (mode, parent) => {
    if (!mode.beforeMatch)
        return;
    if (mode.starts)
        throw new Error("beforeMatch cannot be used with starts");
    const originalMode = Object.assign({}, mode);
    Object.keys(mode).forEach((key) => { delete mode[key]; });
    mode.keywords = originalMode.keywords;
    mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
    mode.starts = {
        relevance: 0,
        contains: [
            Object.assign(originalMode, { endsParent: true })
        ]
    };
    mode.relevance = 0;
    delete originalMode.beforeMatch;
};
const COMMON_KEYWORDS = [
    'of',
    'and',
    'for',
    'in',
    'not',
    'or',
    'if',
    'then',
    'parent',
    'list',
    'value'
];
const DEFAULT_KEYWORD_SCOPE = "keyword";
function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
    const compiledKeywords = Object.create(null);
    if (typeof rawKeywords === 'string') {
        compileList(scopeName, rawKeywords.split(" "));
    }
    else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
    }
    else {
        Object.keys(rawKeywords).forEach(function (scopeName) {
            Object.assign(compiledKeywords, compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName));
        });
    }
    return compiledKeywords;
    function compileList(scopeName, keywordList) {
        if (caseInsensitive) {
            keywordList = keywordList.map(x => x.toLowerCase());
        }
        keywordList.forEach(function (keyword) {
            const pair = keyword.split('|');
            compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
        });
    }
}
function scoreForKeyword(keyword, providedScore) {
    if (providedScore) {
        return Number(providedScore);
    }
    return commonKeyword(keyword) ? 0 : 1;
}
function commonKeyword(keyword) {
    return COMMON_KEYWORDS.includes(keyword.toLowerCase());
}
const seenDeprecations = {};
const error = (message) => {
    console.error(message);
};
const warn = (message, ...args) => {
    console.log(`WARN: ${message}`, ...args);
};
const deprecated = (version, message) => {
    if (seenDeprecations[`${version}/${message}`])
        return;
    console.log(`Deprecated as of ${version}. ${message}`);
    seenDeprecations[`${version}/${message}`] = true;
};
const MultiClassError = new Error();
function remapScopeNames(mode, regexes, { key }) {
    let offset = 0;
    const scopeNames = mode[key];
    const emit = {};
    const positions = {};
    for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
    }
    mode[key] = positions;
    mode[key]._emit = emit;
    mode[key]._multi = true;
}
function beginMultiClass(mode) {
    if (!Array.isArray(mode.begin))
        return;
    if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
    }
    if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
    }
    remapScopeNames(mode, mode.begin, { key: "beginScope" });
    mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
}
function endMultiClass(mode) {
    if (!Array.isArray(mode.end))
        return;
    if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
    }
    if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
    }
    remapScopeNames(mode, mode.end, { key: "endScope" });
    mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
}
function scopeSugar(mode) {
    if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
    }
}
function MultiClass(mode) {
    scopeSugar(mode);
    if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
    }
    if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
    }
    beginMultiClass(mode);
    endMultiClass(mode);
}
function compileLanguage(language) {
    function langRe(value, global) {
        return new RegExp(source(value), 'm'
            + (language.case_insensitive ? 'i' : '')
            + (language.unicodeRegex ? 'u' : '')
            + (global ? 'g' : ''));
    }
    class MultiRegex {
        constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
        }
        addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
        }
        compile() {
            if (this.regexes.length === 0) {
                this.exec = () => null;
            }
            const terminators = this.regexes.map(el => el[1]);
            this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
            this.lastIndex = 0;
        }
        exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s);
            if (!match) {
                return null;
            }
            const i = match.findIndex((el, i) => i > 0 && el !== undefined);
            const matchData = this.matchIndexes[i];
            match.splice(0, i);
            return Object.assign(match, matchData);
        }
    }
    class ResumableMultiRegex {
        constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
        }
        getMatcher(index) {
            if (this.multiRegexes[index])
                return this.multiRegexes[index];
            const matcher = new MultiRegex();
            this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index] = matcher;
            return matcher;
        }
        resumingScanAtSamePosition() {
            return this.regexIndex !== 0;
        }
        considerAll() {
            this.regexIndex = 0;
        }
        addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin")
                this.count++;
        }
        exec(s) {
            const m = this.getMatcher(this.regexIndex);
            m.lastIndex = this.lastIndex;
            let result = m.exec(s);
            if (this.resumingScanAtSamePosition()) {
                if (result && result.index === this.lastIndex)
                    ;
                else {
                    const m2 = this.getMatcher(0);
                    m2.lastIndex = this.lastIndex + 1;
                    result = m2.exec(s);
                }
            }
            if (result) {
                this.regexIndex += result.position + 1;
                if (this.regexIndex === this.count) {
                    this.considerAll();
                }
            }
            return result;
        }
    }
    function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();
        mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));
        if (mode.terminatorEnd) {
            mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
        }
        return mm;
    }
    function compileMode(mode, parent) {
        const cmode = (mode);
        if (mode.isCompiled)
            return cmode;
        [
            scopeClassName,
            compileMatch,
            MultiClass,
            beforeMatchExt
        ].forEach(ext => ext(mode, parent));
        language.compilerExtensions.forEach(ext => ext(mode, parent));
        mode.__beforeBegin = null;
        [
            beginKeywords,
            compileIllegal,
            compileRelevance
        ].forEach(ext => ext(mode, parent));
        mode.isCompiled = true;
        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
            mode.keywords = Object.assign({}, mode.keywords);
            keywordPattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;
        if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }
        cmode.keywordPatternRe = langRe(keywordPattern, true);
        if (parent) {
            if (!mode.begin)
                mode.begin = /\B|\b/;
            cmode.beginRe = langRe(cmode.begin);
            if (!mode.end && !mode.endsWithParent)
                mode.end = /\B|\b/;
            if (mode.end)
                cmode.endRe = langRe(cmode.end);
            cmode.terminatorEnd = source(cmode.end) || '';
            if (mode.endsWithParent && parent.terminatorEnd) {
                cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
            }
        }
        if (mode.illegal)
            cmode.illegalRe = langRe((mode.illegal));
        if (!mode.contains)
            mode.contains = [];
        mode.contains = [].concat(...mode.contains.map(function (c) {
            return expandOrCloneMode(c === 'self' ? mode : c);
        }));
        mode.contains.forEach(function (c) { compileMode((c), cmode); });
        if (mode.starts) {
            compileMode(mode.starts, parent);
        }
        cmode.matcher = buildModeRegex(cmode);
        return cmode;
    }
    if (!language.compilerExtensions)
        language.compilerExtensions = [];
    if (language.contains && language.contains.includes('self')) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    }
    language.classNameAliases = inherit$1(language.classNameAliases || {});
    return compileMode((language));
}
function dependencyOnParent(mode) {
    if (!mode)
        return false;
    return mode.endsWithParent || dependencyOnParent(mode.starts);
}
function expandOrCloneMode(mode) {
    if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function (variant) {
            return inherit$1(mode, { variants: null }, variant);
        });
    }
    if (mode.cachedVariants) {
        return mode.cachedVariants;
    }
    if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
    }
    if (Object.isFrozen(mode)) {
        return inherit$1(mode);
    }
    return mode;
}
var version = "11.6.0";
class HTMLInjectionError extends Error {
    constructor(reason, html) {
        super(reason);
        this.name = "HTMLInjectionError";
        this.html = html;
    }
}
const escape = escapeHTML;
const inherit = inherit$1;
const NO_MATCH = Symbol("nomatch");
const MAX_KEYWORD_HITS = 7;
const HLJS = function (hljs) {
    const languages = Object.create(null);
    const aliases = Object.create(null);
    const plugins = [];
    let SAFE_MODE = true;
    const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
    const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };
    let options = {
        ignoreUnescapedHTML: false,
        throwUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: 'hljs-',
        cssSelector: 'pre code',
        languages: null,
        __emitter: TokenTreeEmitter
    };
    function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
    }
    function blockLanguage(block) {
        let classes = block.className + ' ';
        classes += block.parentNode ? block.parentNode.className : '';
        const match = options.languageDetectRe.exec(classes);
        if (match) {
            const language = getLanguage(match[1]);
            if (!language) {
                warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
                warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : 'no-highlight';
        }
        return classes
            .split(/\s+/)
            .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
    }
    function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
            code = codeOrLanguageName;
            ignoreIllegals = optionsOrCode.ignoreIllegals;
            languageName = optionsOrCode.language;
        }
        else {
            deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
            deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
            languageName = codeOrLanguageName;
            code = optionsOrCode;
        }
        if (ignoreIllegals === undefined) {
            ignoreIllegals = true;
        }
        const context = {
            code,
            language: languageName
        };
        fire("before:highlight", context);
        const result = context.result
            ? context.result
            : _highlight(context.language, context.code, ignoreIllegals);
        result.code = context.code;
        fire("after:highlight", result);
        return result;
    }
    function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = Object.create(null);
        function keywordData(mode, matchText) {
            return mode.keywords[matchText];
        }
        function processKeywords() {
            if (!top.keywords) {
                emitter.addText(modeBuffer);
                return;
            }
            let lastIndex = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(modeBuffer);
            let buf = "";
            while (match) {
                buf += modeBuffer.substring(lastIndex, match.index);
                const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
                const data = keywordData(top, word);
                if (data) {
                    const [kind, keywordRelevance] = data;
                    emitter.addText(buf);
                    buf = "";
                    keywordHits[word] = (keywordHits[word] || 0) + 1;
                    if (keywordHits[word] <= MAX_KEYWORD_HITS)
                        relevance += keywordRelevance;
                    if (kind.startsWith("_")) {
                        buf += match[0];
                    }
                    else {
                        const cssClass = language.classNameAliases[kind] || kind;
                        emitter.addKeyword(match[0], cssClass);
                    }
                }
                else {
                    buf += match[0];
                }
                lastIndex = top.keywordPatternRe.lastIndex;
                match = top.keywordPatternRe.exec(modeBuffer);
            }
            buf += modeBuffer.substring(lastIndex);
            emitter.addText(buf);
        }
        function processSubLanguage() {
            if (modeBuffer === "")
                return;
            let result = null;
            if (typeof top.subLanguage === 'string') {
                if (!languages[top.subLanguage]) {
                    emitter.addText(modeBuffer);
                    return;
                }
                result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
                continuations[top.subLanguage] = (result._top);
            }
            else {
                result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
                relevance += result.relevance;
            }
            emitter.addSublanguage(result._emitter, result.language);
        }
        function processBuffer() {
            if (top.subLanguage != null) {
                processSubLanguage();
            }
            else {
                processKeywords();
            }
            modeBuffer = '';
        }
        function emitMultiClass(scope, match) {
            let i = 1;
            const max = match.length - 1;
            while (i <= max) {
                if (!scope._emit[i]) {
                    i++;
                    continue;
                }
                const klass = language.classNameAliases[scope[i]] || scope[i];
                const text = match[i];
                if (klass) {
                    emitter.addKeyword(text, klass);
                }
                else {
                    modeBuffer = text;
                    processKeywords();
                    modeBuffer = "";
                }
                i++;
            }
        }
        function startNewMode(mode, match) {
            if (mode.scope && typeof mode.scope === "string") {
                emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
            }
            if (mode.beginScope) {
                if (mode.beginScope._wrap) {
                    emitter.addKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
                    modeBuffer = "";
                }
                else if (mode.beginScope._multi) {
                    emitMultiClass(mode.beginScope, match);
                    modeBuffer = "";
                }
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
        }
        function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
                if (mode["on:end"]) {
                    const resp = new Response(mode);
                    mode["on:end"](match, resp);
                    if (resp.isMatchIgnored)
                        matched = false;
                }
                if (matched) {
                    while (mode.endsParent && mode.parent) {
                        mode = mode.parent;
                    }
                    return mode;
                }
            }
            if (mode.endsWithParent) {
                return endOfMode(mode.parent, match, matchPlusRemainder);
            }
        }
        function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
                modeBuffer += lexeme[0];
                return 1;
            }
            else {
                resumeScanAtSamePosition = true;
                return 0;
            }
        }
        function doBeginMatch(match) {
            const lexeme = match[0];
            const newMode = match.rule;
            const resp = new Response(newMode);
            const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
            for (const cb of beforeCallbacks) {
                if (!cb)
                    continue;
                cb(match, resp);
                if (resp.isMatchIgnored)
                    return doIgnore(lexeme);
            }
            if (newMode.skip) {
                modeBuffer += lexeme;
            }
            else {
                if (newMode.excludeBegin) {
                    modeBuffer += lexeme;
                }
                processBuffer();
                if (!newMode.returnBegin && !newMode.excludeBegin) {
                    modeBuffer = lexeme;
                }
            }
            startNewMode(newMode, match);
            return newMode.returnBegin ? 0 : lexeme.length;
        }
        function doEndMatch(match) {
            const lexeme = match[0];
            const matchPlusRemainder = codeToHighlight.substring(match.index);
            const endMode = endOfMode(top, match, matchPlusRemainder);
            if (!endMode) {
                return NO_MATCH;
            }
            const origin = top;
            if (top.endScope && top.endScope._wrap) {
                processBuffer();
                emitter.addKeyword(lexeme, top.endScope._wrap);
            }
            else if (top.endScope && top.endScope._multi) {
                processBuffer();
                emitMultiClass(top.endScope, match);
            }
            else if (origin.skip) {
                modeBuffer += lexeme;
            }
            else {
                if (!(origin.returnEnd || origin.excludeEnd)) {
                    modeBuffer += lexeme;
                }
                processBuffer();
                if (origin.excludeEnd) {
                    modeBuffer = lexeme;
                }
            }
            do {
                if (top.scope) {
                    emitter.closeNode();
                }
                if (!top.skip && !top.subLanguage) {
                    relevance += top.relevance;
                }
                top = top.parent;
            } while (top !== endMode.parent);
            if (endMode.starts) {
                startNewMode(endMode.starts, match);
            }
            return origin.returnEnd ? 0 : lexeme.length;
        }
        function processContinuations() {
            const list = [];
            for (let current = top; current !== language; current = current.parent) {
                if (current.scope) {
                    list.unshift(current.scope);
                }
            }
            list.forEach(item => emitter.openNode(item));
        }
        let lastMatch = {};
        function processLexeme(textBeforeMatch, match) {
            const lexeme = match && match[0];
            modeBuffer += textBeforeMatch;
            if (lexeme == null) {
                processBuffer();
                return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
                modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
                if (!SAFE_MODE) {
                    const err = new Error(`0 width match regex (${languageName})`);
                    err.languageName = languageName;
                    err.badRule = lastMatch.rule;
                    throw err;
                }
                return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
                return doBeginMatch(match);
            }
            else if (match.type === "illegal" && !ignoreIllegals) {
                const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
                err.mode = top;
                throw err;
            }
            else if (match.type === "end") {
                const processed = doEndMatch(match);
                if (processed !== NO_MATCH) {
                    return processed;
                }
            }
            if (match.type === "illegal" && lexeme === "") {
                return 1;
            }
            if (iterations > 100000 && iterations > match.index * 3) {
                const err = new Error('potential infinite loop, way more iterations than matches');
                throw err;
            }
            modeBuffer += lexeme;
            return lexeme.length;
        }
        const language = getLanguage(languageName);
        if (!language) {
            error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
        }
        const md = compileLanguage(language);
        let result = '';
        let top = continuation || md;
        const continuations = {};
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = '';
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;
        try {
            top.matcher.considerAll();
            for (;;) {
                iterations++;
                if (resumeScanAtSamePosition) {
                    resumeScanAtSamePosition = false;
                }
                else {
                    top.matcher.considerAll();
                }
                top.matcher.lastIndex = index;
                const match = top.matcher.exec(codeToHighlight);
                if (!match)
                    break;
                const beforeMatch = codeToHighlight.substring(index, match.index);
                const processedCount = processLexeme(beforeMatch, match);
                index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substring(index));
            emitter.closeAllNodes();
            emitter.finalize();
            result = emitter.toHTML();
            return {
                language: languageName,
                value: result,
                relevance: relevance,
                illegal: false,
                _emitter: emitter,
                _top: top
            };
        }
        catch (err) {
            if (err.message && err.message.includes('Illegal')) {
                return {
                    language: languageName,
                    value: escape(codeToHighlight),
                    illegal: true,
                    relevance: 0,
                    _illegalBy: {
                        message: err.message,
                        index: index,
                        context: codeToHighlight.slice(index - 100, index + 100),
                        mode: err.mode,
                        resultSoFar: result
                    },
                    _emitter: emitter
                };
            }
            else if (SAFE_MODE) {
                return {
                    language: languageName,
                    value: escape(codeToHighlight),
                    illegal: false,
                    relevance: 0,
                    errorRaised: err,
                    _emitter: emitter,
                    _top: top
                };
            }
            else {
                throw err;
            }
        }
    }
    function justTextHighlightResult(code) {
        const result = {
            value: escape(code),
            illegal: false,
            relevance: 0,
            _top: PLAINTEXT_LANGUAGE,
            _emitter: new options.__emitter(options)
        };
        result._emitter.addText(code);
        return result;
    }
    function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);
        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name => _highlight(name, code, false));
        results.unshift(plaintext);
        const sorted = results.sort((a, b) => {
            if (a.relevance !== b.relevance)
                return b.relevance - a.relevance;
            if (a.language && b.language) {
                if (getLanguage(a.language).supersetOf === b.language) {
                    return 1;
                }
                else if (getLanguage(b.language).supersetOf === a.language) {
                    return -1;
                }
            }
            return 0;
        });
        const [best, secondBest] = sorted;
        const result = best;
        result.secondBest = secondBest;
        return result;
    }
    function updateClassName(element, currentLang, resultLang) {
        const language = (currentLang && aliases[currentLang]) || resultLang;
        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
    }
    function highlightElement(element) {
        let node = null;
        const language = blockLanguage(element);
        if (shouldNotHighlight(language))
            return;
        fire("before:highlightElement", { el: element, language: language });
        if (element.children.length > 0) {
            if (!options.ignoreUnescapedHTML) {
                console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
                console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
                console.warn("The element with unescaped HTML:");
                console.warn(element);
            }
            if (options.throwUnescapedHTML) {
                const err = new HTMLInjectionError("One of your code blocks includes unescaped HTML.", element.innerHTML);
                throw err;
            }
        }
        node = element;
        const text = node.textContent;
        const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);
        element.innerHTML = result.value;
        updateClassName(element, language, result.language);
        element.result = {
            language: result.language,
            re: result.relevance,
            relevance: result.relevance
        };
        if (result.secondBest) {
            element.secondBest = {
                language: result.secondBest.language,
                relevance: result.secondBest.relevance
            };
        }
        fire("after:highlightElement", { el: element, result, text });
    }
    function configure(userOptions) {
        options = inherit(options, userOptions);
    }
    const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let wantsHighlight = false;
    function highlightAll() {
        if (document.readyState === "loading") {
            wantsHighlight = true;
            return;
        }
        const blocks = document.querySelectorAll(options.cssSelector);
        blocks.forEach(highlightElement);
    }
    function boot() {
        if (wantsHighlight)
            highlightAll();
    }
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('DOMContentLoaded', boot, false);
    }
    function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
            lang = languageDefinition(hljs);
        }
        catch (error$1) {
            error("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
                throw error$1;
            }
            else {
                error(error$1);
            }
            lang = PLAINTEXT_LANGUAGE;
        }
        if (!lang.name)
            lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);
        if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
        }
    }
    function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
            if (aliases[alias] === languageName) {
                delete aliases[alias];
            }
        }
    }
    function listLanguages() {
        return Object.keys(languages);
    }
    function getLanguage(name) {
        name = (name || '').toLowerCase();
        return languages[name] || languages[aliases[name]];
    }
    function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === 'string') {
            aliasList = [aliasList];
        }
        aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
    }
    function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
    }
    function upgradePluginAPI(plugin) {
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
            plugin["before:highlightElement"] = (data) => {
                plugin["before:highlightBlock"](Object.assign({ block: data.el }, data));
            };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
            plugin["after:highlightElement"] = (data) => {
                plugin["after:highlightBlock"](Object.assign({ block: data.el }, data));
            };
        }
    }
    function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
    }
    function fire(event, args) {
        const cb = event;
        plugins.forEach(function (plugin) {
            if (plugin[cb]) {
                plugin[cb](args);
            }
        });
    }
    function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");
        return highlightElement(el);
    }
    Object.assign(hljs, {
        highlight,
        highlightAuto,
        highlightAll,
        highlightElement,
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin
    });
    hljs.debugMode = function () { SAFE_MODE = false; };
    hljs.safeMode = function () { SAFE_MODE = true; };
    hljs.versionString = version;
    hljs.regex = {
        concat: concat,
        lookahead: lookahead,
        either: either,
        optional: optional,
        anyNumberOfTimes: anyNumberOfTimes
    };
    for (const key in MODES) {
        if (typeof MODES[key] === "object") {
            deepFreezeEs6.exports(MODES[key]);
        }
    }
    Object.assign(hljs, MODES);
    return hljs;
};
var highlight = HLJS({});
export { highlight as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9oaWdobGlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsSUFBSSxhQUFhLEdBQUcsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUM7QUFFbEMsU0FBUyxVQUFVLENBQUMsR0FBRztJQUNuQixJQUFJLEdBQUcsWUFBWSxHQUFHLEVBQUU7UUFDcEIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQztLQUNMO1NBQU0sSUFBSSxHQUFHLFlBQVksR0FBRyxFQUFFO1FBQzNCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUM7S0FDTDtJQUdELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbkIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7UUFDbEQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR3JCLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuRCxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEI7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFDO0FBQ2Ys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QUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUVsQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25DO0tBQ0Y7SUFHRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUUzQixPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUdGLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUV6QixPQUFPLEVBQUUsU0FBUyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gIEhpZ2hsaWdodC5qcyB2MTEuNi4wIChnaXQ6IGJlZDc5MGYzZjMpXG4gIChjKSAyMDA2LTIwMjIgdW5kZWZpbmVkIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAgTGljZW5zZTogQlNELTMtQ2xhdXNlXG4gKi9cbnZhciBkZWVwRnJlZXplRXM2ID0ge2V4cG9ydHM6IHt9fTtcblxuZnVuY3Rpb24gZGVlcEZyZWV6ZShvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG9iai5jbGVhciA9IG9iai5kZWxldGUgPSBvYmouc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXAgaXMgcmVhZC1vbmx5Jyk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgb2JqLmFkZCA9IG9iai5jbGVhciA9IG9iai5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldCBpcyByZWFkLW9ubHknKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGcmVlemUgc2VsZlxuICAgIE9iamVjdC5mcmVlemUob2JqKTtcblxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgcHJvcCA9IG9ialtuYW1lXTtcblxuICAgICAgICAvLyBGcmVlemUgcHJvcCBpZiBpdCBpcyBhbiBvYmplY3RcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09ICdvYmplY3QnICYmICFPYmplY3QuaXNGcm96ZW4ocHJvcCkpIHtcbiAgICAgICAgICAgIGRlZXBGcmVlemUocHJvcCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG59XG5cbmRlZXBGcmVlemVFczYuZXhwb3J0cyA9IGRlZXBGcmVlemU7XG5kZWVwRnJlZXplRXM2LmV4cG9ydHMuZGVmYXVsdCA9IGRlZXBGcmVlemU7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5DYWxsYmFja1Jlc3BvbnNlfSBDYWxsYmFja1Jlc3BvbnNlICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRNb2RlfSBDb21waWxlZE1vZGUgKi9cbi8qKiBAaW1wbGVtZW50cyBDYWxsYmFja1Jlc3BvbnNlICovXG5cbmNsYXNzIFJlc3BvbnNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihtb2RlKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICAgIGlmIChtb2RlLmRhdGEgPT09IHVuZGVmaW5lZCkgbW9kZS5kYXRhID0ge307XG5cbiAgICB0aGlzLmRhdGEgPSBtb2RlLmRhdGE7XG4gICAgdGhpcy5pc01hdGNoSWdub3JlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWdub3JlTWF0Y2goKSB7XG4gICAgdGhpcy5pc01hdGNoSWdub3JlZCA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGVzY2FwZUhUTUwodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAucmVwbGFjZSgvJy9nLCAnJiN4Mjc7Jyk7XG59XG5cbi8qKlxuICogcGVyZm9ybXMgYSBzaGFsbG93IG1lcmdlIG9mIG11bHRpcGxlIG9iamVjdHMgaW50byBvbmVcbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtUfSBvcmlnaW5hbFxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLGFueT5bXX0gb2JqZWN0c1xuICogQHJldHVybnMge1R9IGEgc2luZ2xlIG5ldyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gaW5oZXJpdCQxKG9yaWdpbmFsLCAuLi5vYmplY3RzKSB7XG4gIC8qKiBAdHlwZSBSZWNvcmQ8c3RyaW5nLGFueT4gKi9cbiAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBmb3IgKGNvbnN0IGtleSBpbiBvcmlnaW5hbCkge1xuICAgIHJlc3VsdFtrZXldID0gb3JpZ2luYWxba2V5XTtcbiAgfVxuICBvYmplY3RzLmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAvKiogQHR5cGUge1R9ICovIChyZXN1bHQpO1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFJlbmRlcmVyXG4gKiBAcHJvcGVydHkgeyh0ZXh0OiBzdHJpbmcpID0+IHZvaWR9IGFkZFRleHRcbiAqIEBwcm9wZXJ0eSB7KG5vZGU6IE5vZGUpID0+IHZvaWR9IG9wZW5Ob2RlXG4gKiBAcHJvcGVydHkgeyhub2RlOiBOb2RlKSA9PiB2b2lkfSBjbG9zZU5vZGVcbiAqIEBwcm9wZXJ0eSB7KCkgPT4gc3RyaW5nfSB2YWx1ZVxuICovXG5cbi8qKiBAdHlwZWRlZiB7e3Njb3BlPzogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZywgc3VibGFuZ3VhZ2U/OiBib29sZWFufX0gTm9kZSAqL1xuLyoqIEB0eXBlZGVmIHt7d2FsazogKHI6IFJlbmRlcmVyKSA9PiB2b2lkfX0gVHJlZSAqL1xuLyoqICovXG5cbmNvbnN0IFNQQU5fQ0xPU0UgPSAnPC9zcGFuPic7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIG5vZGUgbmVlZHMgdG8gYmUgd3JhcHBlZCBpbiA8c3Bhbj5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbmNvbnN0IGVtaXRzV3JhcHBpbmdUYWdzID0gKG5vZGUpID0+IHtcbiAgLy8gcmFyZWx5IHdlIGNhbiBoYXZlIGEgc3VibGFuZ3VhZ2Ugd2hlcmUgbGFuZ3VhZ2UgaXMgdW5kZWZpbmVkXG4gIC8vIFRPRE86IHRyYWNrIGRvd24gd2h5XG4gIHJldHVybiAhIW5vZGUuc2NvcGUgfHwgKG5vZGUuc3VibGFuZ3VhZ2UgJiYgbm9kZS5sYW5ndWFnZSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHt7cHJlZml4OnN0cmluZ319IG9wdGlvbnNcbiAqL1xuY29uc3Qgc2NvcGVUb0NTU0NsYXNzID0gKG5hbWUsIHsgcHJlZml4IH0pID0+IHtcbiAgaWYgKG5hbWUuaW5jbHVkZXMoXCIuXCIpKSB7XG4gICAgY29uc3QgcGllY2VzID0gbmFtZS5zcGxpdChcIi5cIik7XG4gICAgcmV0dXJuIFtcbiAgICAgIGAke3ByZWZpeH0ke3BpZWNlcy5zaGlmdCgpfWAsXG4gICAgICAuLi4ocGllY2VzLm1hcCgoeCwgaSkgPT4gYCR7eH0ke1wiX1wiLnJlcGVhdChpICsgMSl9YCkpXG4gICAgXS5qb2luKFwiIFwiKTtcbiAgfVxuICByZXR1cm4gYCR7cHJlZml4fSR7bmFtZX1gO1xufTtcblxuLyoqIEB0eXBlIHtSZW5kZXJlcn0gKi9cbmNsYXNzIEhUTUxSZW5kZXJlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEhUTUxSZW5kZXJlclxuICAgKlxuICAgKiBAcGFyYW0ge1RyZWV9IHBhcnNlVHJlZSAtIHRoZSBwYXJzZSB0cmVlIChtdXN0IHN1cHBvcnQgYHdhbGtgIEFQSSlcbiAgICogQHBhcmFtIHt7Y2xhc3NQcmVmaXg6IHN0cmluZ319IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcnNlVHJlZSwgb3B0aW9ucykge1xuICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcbiAgICB0aGlzLmNsYXNzUHJlZml4ID0gb3B0aW9ucy5jbGFzc1ByZWZpeDtcbiAgICBwYXJzZVRyZWUud2Fsayh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRleHRzIHRvIHRoZSBvdXRwdXQgc3RyZWFtXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0ICovXG4gIGFkZFRleHQodGV4dCkge1xuICAgIHRoaXMuYnVmZmVyICs9IGVzY2FwZUhUTUwodGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5vZGUgb3BlbiB0byB0aGUgb3V0cHV0IHN0cmVhbSAoaWYgbmVlZGVkKVxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbiAgb3Blbk5vZGUobm9kZSkge1xuICAgIGlmICghZW1pdHNXcmFwcGluZ1RhZ3Mobm9kZSkpIHJldHVybjtcblxuICAgIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICAgIGlmIChub2RlLnN1Ymxhbmd1YWdlKSB7XG4gICAgICBjbGFzc05hbWUgPSBgbGFuZ3VhZ2UtJHtub2RlLmxhbmd1YWdlfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsYXNzTmFtZSA9IHNjb3BlVG9DU1NDbGFzcyhub2RlLnNjb3BlLCB7IHByZWZpeDogdGhpcy5jbGFzc1ByZWZpeCB9KTtcbiAgICB9XG4gICAgdGhpcy5zcGFuKGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5vZGUgY2xvc2UgdG8gdGhlIG91dHB1dCBzdHJlYW0gKGlmIG5lZWRlZClcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIGNsb3NlTm9kZShub2RlKSB7XG4gICAgaWYgKCFlbWl0c1dyYXBwaW5nVGFncyhub2RlKSkgcmV0dXJuO1xuXG4gICAgdGhpcy5idWZmZXIgKz0gU1BBTl9DTE9TRTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCBidWZmZXJcbiAgKi9cbiAgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyO1xuICB9XG5cbiAgLy8gaGVscGVyc1xuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBzcGFuIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAqL1xuICBzcGFuKGNsYXNzTmFtZSkge1xuICAgIHRoaXMuYnVmZmVyICs9IGA8c3BhbiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPmA7XG4gIH1cbn1cblxuLyoqIEB0eXBlZGVmIHt7c2NvcGU/OiBzdHJpbmcsIGxhbmd1YWdlPzogc3RyaW5nLCBzdWJsYW5ndWFnZT86IGJvb2xlYW4sIGNoaWxkcmVuOiBOb2RlW119IHwgc3RyaW5nfSBOb2RlICovXG4vKiogQHR5cGVkZWYge3tzY29wZT86IHN0cmluZywgbGFuZ3VhZ2U/OiBzdHJpbmcsIHN1Ymxhbmd1YWdlPzogYm9vbGVhbiwgY2hpbGRyZW46IE5vZGVbXX0gfSBEYXRhTm9kZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkVtaXR0ZXJ9IEVtaXR0ZXIgKi9cbi8qKiAgKi9cblxuLyoqIEByZXR1cm5zIHtEYXRhTm9kZX0gKi9cbmNvbnN0IG5ld05vZGUgPSAob3B0cyA9IHt9KSA9PiB7XG4gIC8qKiBAdHlwZSBEYXRhTm9kZSAqL1xuICBjb25zdCByZXN1bHQgPSB7IGNoaWxkcmVuOiBbXSB9O1xuICBPYmplY3QuYXNzaWduKHJlc3VsdCwgb3B0cyk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jbGFzcyBUb2tlblRyZWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKiogQHR5cGUgRGF0YU5vZGUgKi9cbiAgICB0aGlzLnJvb3ROb2RlID0gbmV3Tm9kZSgpO1xuICAgIHRoaXMuc3RhY2sgPSBbdGhpcy5yb290Tm9kZV07XG4gIH1cblxuICBnZXQgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuICBnZXQgcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdE5vZGU7IH1cblxuICAvKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIGFkZChub2RlKSB7XG4gICAgdGhpcy50b3AuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgfVxuXG4gIC8qKiBAcGFyYW0ge3N0cmluZ30gc2NvcGUgKi9cbiAgb3Blbk5vZGUoc2NvcGUpIHtcbiAgICAvKiogQHR5cGUgTm9kZSAqL1xuICAgIGNvbnN0IG5vZGUgPSBuZXdOb2RlKHsgc2NvcGUgfSk7XG4gICAgdGhpcy5hZGQobm9kZSk7XG4gICAgdGhpcy5zdGFjay5wdXNoKG5vZGUpO1xuICB9XG5cbiAgY2xvc2VOb2RlKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNsb3NlQWxsTm9kZXMoKSB7XG4gICAgd2hpbGUgKHRoaXMuY2xvc2VOb2RlKCkpO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3ROb2RlLCBudWxsLCA0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7IGltcG9ydChcIi4vaHRtbF9yZW5kZXJlclwiKS5SZW5kZXJlciB9IFJlbmRlcmVyXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IGJ1aWxkZXJcbiAgICovXG4gIHdhbGsoYnVpbGRlcikge1xuICAgIC8vIHRoaXMgZG9lcyBub3RcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fd2FsayhidWlsZGVyLCB0aGlzLnJvb3ROb2RlKTtcbiAgICAvLyB0aGlzIHdvcmtzXG4gICAgLy8gcmV0dXJuIFRva2VuVHJlZS5fd2FsayhidWlsZGVyLCB0aGlzLnJvb3ROb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSBidWlsZGVyXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKi9cbiAgc3RhdGljIF93YWxrKGJ1aWxkZXIsIG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGJ1aWxkZXIuYWRkVGV4dChub2RlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIGJ1aWxkZXIub3Blbk5vZGUobm9kZSk7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLl93YWxrKGJ1aWxkZXIsIGNoaWxkKSk7XG4gICAgICBidWlsZGVyLmNsb3NlTm9kZShub2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1aWxkZXI7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqL1xuICBzdGF0aWMgX2NvbGxhcHNlKG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHJldHVybjtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHJldHVybjtcblxuICAgIGlmIChub2RlLmNoaWxkcmVuLmV2ZXJ5KGVsID0+IHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgIC8vIG5vZGUudGV4dCA9IG5vZGUuY2hpbGRyZW4uam9pbihcIlwiKTtcbiAgICAgIC8vIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IFtub2RlLmNoaWxkcmVuLmpvaW4oXCJcIildO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIFRva2VuVHJlZS5fY29sbGFwc2UoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICBDdXJyZW50bHkgdGhpcyBpcyBhbGwgcHJpdmF0ZSBBUEksIGJ1dCB0aGlzIGlzIHRoZSBtaW5pbWFsIEFQSSBuZWNlc3NhcnlcbiAgdGhhdCBhbiBFbWl0dGVyIG11c3QgaW1wbGVtZW50IHRvIGZ1bGx5IHN1cHBvcnQgdGhlIHBhcnNlci5cblxuICBNaW5pbWFsIGludGVyZmFjZTpcblxuICAtIGFkZEtleXdvcmQodGV4dCwgc2NvcGUpXG4gIC0gYWRkVGV4dCh0ZXh0KVxuICAtIGFkZFN1Ymxhbmd1YWdlKGVtaXR0ZXIsIHN1Ykxhbmd1YWdlTmFtZSlcbiAgLSBmaW5hbGl6ZSgpXG4gIC0gb3Blbk5vZGUoc2NvcGUpXG4gIC0gY2xvc2VOb2RlKClcbiAgLSBjbG9zZUFsbE5vZGVzKClcbiAgLSB0b0hUTUwoKVxuXG4qL1xuXG4vKipcbiAqIEBpbXBsZW1lbnRzIHtFbWl0dGVyfVxuICovXG5jbGFzcyBUb2tlblRyZWVFbWl0dGVyIGV4dGVuZHMgVG9rZW5UcmVlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVcbiAgICovXG4gIGFkZEtleXdvcmQodGV4dCwgc2NvcGUpIHtcbiAgICBpZiAodGV4dCA9PT0gXCJcIikgeyByZXR1cm47IH1cblxuICAgIHRoaXMub3Blbk5vZGUoc2NvcGUpO1xuICAgIHRoaXMuYWRkVGV4dCh0ZXh0KTtcbiAgICB0aGlzLmNsb3NlTm9kZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqL1xuICBhZGRUZXh0KHRleHQpIHtcbiAgICBpZiAodGV4dCA9PT0gXCJcIikgeyByZXR1cm47IH1cblxuICAgIHRoaXMuYWRkKHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RW1pdHRlciAmIHtyb290OiBEYXRhTm9kZX19IGVtaXR0ZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICovXG4gIGFkZFN1Ymxhbmd1YWdlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgICAvKiogQHR5cGUgRGF0YU5vZGUgKi9cbiAgICBjb25zdCBub2RlID0gZW1pdHRlci5yb290O1xuICAgIG5vZGUuc3VibGFuZ3VhZ2UgPSB0cnVlO1xuICAgIG5vZGUubGFuZ3VhZ2UgPSBuYW1lO1xuICAgIHRoaXMuYWRkKG5vZGUpO1xuICB9XG5cbiAgdG9IVE1MKCkge1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IEhUTUxSZW5kZXJlcih0aGlzLCB0aGlzLm9wdGlvbnMpO1xuICAgIHJldHVybiByZW5kZXJlci52YWx1ZSgpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtSZWdFeHB9XG4gKiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHNvdXJjZShyZSkge1xuICBpZiAoIXJlKSByZXR1cm4gbnVsbDtcbiAgaWYgKHR5cGVvZiByZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHJlO1xuXG4gIHJldHVybiByZS5zb3VyY2U7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmcgfSByZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbG9va2FoZWFkKHJlKSB7XG4gIHJldHVybiBjb25jYXQoJyg/PScsIHJlLCAnKScpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGFueU51bWJlck9mVGltZXMocmUpIHtcbiAgcmV0dXJuIGNvbmNhdCgnKD86JywgcmUsICcpKicpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG9wdGlvbmFsKHJlKSB7XG4gIHJldHVybiBjb25jYXQoJyg/OicsIHJlLCAnKT8nKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gey4uLihSZWdFeHAgfCBzdHJpbmcpIH0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY29uY2F0KC4uLmFyZ3MpIHtcbiAgY29uc3Qgam9pbmVkID0gYXJncy5tYXAoKHgpID0+IHNvdXJjZSh4KSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIGpvaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyBBcnJheTxzdHJpbmcgfCBSZWdFeHAgfCBPYmplY3Q+IH0gYXJnc1xuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncykge1xuICBjb25zdCBvcHRzID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgJiYgb3B0cy5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgYXJncy5zcGxpY2UoYXJncy5sZW5ndGggLSAxLCAxKTtcbiAgICByZXR1cm4gb3B0cztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLyoqIEB0eXBlZGVmIHsge2NhcHR1cmU/OiBib29sZWFufSB9IFJlZ2V4RWl0aGVyT3B0aW9ucyAqL1xuXG4vKipcbiAqIEFueSBvZiB0aGUgcGFzc2VkIGV4cHJlc3NzaW9ucyBtYXkgbWF0Y2hcbiAqXG4gKiBDcmVhdGVzIGEgaHVnZSB0aGlzIHwgdGhpcyB8IHRoYXQgfCB0aGF0IG1hdGNoXG4gKiBAcGFyYW0geyhSZWdFeHAgfCBzdHJpbmcpW10gfCBbLi4uKFJlZ0V4cCB8IHN0cmluZylbXSwgUmVnZXhFaXRoZXJPcHRpb25zXX0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZWl0aGVyKC4uLmFyZ3MpIHtcbiAgLyoqIEB0eXBlIHsgb2JqZWN0ICYge2NhcHR1cmU/OiBib29sZWFufSB9ICAqL1xuICBjb25zdCBvcHRzID0gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncyk7XG4gIGNvbnN0IGpvaW5lZCA9ICcoJ1xuICAgICsgKG9wdHMuY2FwdHVyZSA/IFwiXCIgOiBcIj86XCIpXG4gICAgKyBhcmdzLm1hcCgoeCkgPT4gc291cmNlKHgpKS5qb2luKFwifFwiKSArIFwiKVwiO1xuICByZXR1cm4gam9pbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nfSByZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gY291bnRNYXRjaEdyb3VwcyhyZSkge1xuICByZXR1cm4gKG5ldyBSZWdFeHAocmUudG9TdHJpbmcoKSArICd8JykpLmV4ZWMoJycpLmxlbmd0aCAtIDE7XG59XG5cbi8qKlxuICogRG9lcyBsZXhlbWUgc3RhcnQgd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaCBhdCB0aGUgYmVnaW5uaW5nXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSB7c3RyaW5nfSBsZXhlbWVcbiAqL1xuZnVuY3Rpb24gc3RhcnRzV2l0aChyZSwgbGV4ZW1lKSB7XG4gIGNvbnN0IG1hdGNoID0gcmUgJiYgcmUuZXhlYyhsZXhlbWUpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2guaW5kZXggPT09IDA7XG59XG5cbi8vIEJBQ0tSRUZfUkUgbWF0Y2hlcyBhbiBvcGVuIHBhcmVudGhlc2lzIG9yIGJhY2tyZWZlcmVuY2UuIFRvIGF2b2lkXG4vLyBhbiBpbmNvcnJlY3QgcGFyc2UsIGl0IGFkZGl0aW9uYWxseSBtYXRjaGVzIHRoZSBmb2xsb3dpbmc6XG4vLyAtIFsuLi5dIGVsZW1lbnRzLCB3aGVyZSB0aGUgbWVhbmluZyBvZiBwYXJlbnRoZXNlcyBhbmQgZXNjYXBlcyBjaGFuZ2Vcbi8vIC0gb3RoZXIgZXNjYXBlIHNlcXVlbmNlcywgc28gd2UgZG8gbm90IG1pc3BhcnNlIGVzY2FwZSBzZXF1ZW5jZXMgYXNcbi8vICAgaW50ZXJlc3RpbmcgZWxlbWVudHNcbi8vIC0gbm9uLW1hdGNoaW5nIG9yIGxvb2thaGVhZCBwYXJlbnRoZXNlcywgd2hpY2ggZG8gbm90IGNhcHR1cmUuIFRoZXNlXG4vLyAgIGZvbGxvdyB0aGUgJygnIHdpdGggYSAnPycuXG5jb25zdCBCQUNLUkVGX1JFID0gL1xcWyg/OlteXFxcXFxcXV18XFxcXC4pKlxcXXxcXChcXD8/fFxcXFwoWzEtOV1bMC05XSopfFxcXFwuLztcblxuLy8gKipJTlRFUk5BTCoqIE5vdCBpbnRlbmRlZCBmb3Igb3V0c2lkZSB1c2FnZVxuLy8gam9pbiBsb2dpY2FsbHkgY29tcHV0ZXMgcmVnZXhwcy5qb2luKHNlcGFyYXRvciksIGJ1dCBmaXhlcyB0aGVcbi8vIGJhY2tyZWZlcmVuY2VzIHNvIHRoZXkgY29udGludWUgdG8gbWF0Y2guXG4vLyBpdCBhbHNvIHBsYWNlcyBlYWNoIGluZGl2aWR1YWwgcmVndWxhciBleHByZXNzaW9uIGludG8gaXQncyBvd25cbi8vIG1hdGNoIGdyb3VwLCBrZWVwaW5nIHRyYWNrIG9mIHRoZSBzZXF1ZW5jaW5nIG9mIHRob3NlIG1hdGNoIGdyb3Vwc1xuLy8gaXMgY3VycmVudGx5IGFuIGV4ZXJjaXNlIGZvciB0aGUgY2FsbGVyLiA6LSlcbi8qKlxuICogQHBhcmFtIHsoc3RyaW5nIHwgUmVnRXhwKVtdfSByZWdleHBzXG4gKiBAcGFyYW0ge3tqb2luV2l0aDogc3RyaW5nfX0gb3B0c1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyhyZWdleHBzLCB7IGpvaW5XaXRoIH0pIHtcbiAgbGV0IG51bUNhcHR1cmVzID0gMDtcblxuICByZXR1cm4gcmVnZXhwcy5tYXAoKHJlZ2V4KSA9PiB7XG4gICAgbnVtQ2FwdHVyZXMgKz0gMTtcbiAgICBjb25zdCBvZmZzZXQgPSBudW1DYXB0dXJlcztcbiAgICBsZXQgcmUgPSBzb3VyY2UocmVnZXgpO1xuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlIChyZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IEJBQ0tSRUZfUkUuZXhlYyhyZSk7XG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIG91dCArPSByZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBvdXQgKz0gcmUuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgIHJlID0gcmUuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChtYXRjaFswXVswXSA9PT0gJ1xcXFwnICYmIG1hdGNoWzFdKSB7XG4gICAgICAgIC8vIEFkanVzdCB0aGUgYmFja3JlZmVyZW5jZS5cbiAgICAgICAgb3V0ICs9ICdcXFxcJyArIFN0cmluZyhOdW1iZXIobWF0Y2hbMV0pICsgb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSBtYXRjaFswXTtcbiAgICAgICAgaWYgKG1hdGNoWzBdID09PSAnKCcpIHtcbiAgICAgICAgICBudW1DYXB0dXJlcysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH0pLm1hcChyZSA9PiBgKCR7cmV9KWApLmpvaW4oam9pbldpdGgpO1xufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTW9kZX0gTW9kZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLk1vZGVDYWxsYmFja30gTW9kZUNhbGxiYWNrICovXG5cbi8vIENvbW1vbiByZWdleHBzXG5jb25zdCBNQVRDSF9OT1RISU5HX1JFID0gL1xcYlxcQi87XG5jb25zdCBJREVOVF9SRSA9ICdbYS16QS1aXVxcXFx3Kic7XG5jb25zdCBVTkRFUlNDT1JFX0lERU5UX1JFID0gJ1thLXpBLVpfXVxcXFx3Kic7XG5jb25zdCBOVU1CRVJfUkUgPSAnXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCspPyc7XG5jb25zdCBDX05VTUJFUl9SRSA9ICcoLT8pKFxcXFxiMFt4WF1bYS1mQS1GMC05XSt8KFxcXFxiXFxcXGQrKFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKFtlRV1bLStdP1xcXFxkKyk/KSc7IC8vIDB4Li4uLCAwLi4uLCBkZWNpbWFsLCBmbG9hdFxuY29uc3QgQklOQVJZX05VTUJFUl9SRSA9ICdcXFxcYigwYlswMV0rKSc7IC8vIDBiLi4uXG5jb25zdCBSRV9TVEFSVEVSU19SRSA9ICchfCE9fCE9PXwlfCU9fCZ8JiZ8Jj18XFxcXCp8XFxcXCo9fFxcXFwrfFxcXFwrPXwsfC18LT18Lz18L3w6fDt8PDx8PDw9fDw9fDx8PT09fD09fD18Pj4+PXw+Pj18Pj18Pj4+fD4+fD58XFxcXD98XFxcXFt8XFxcXHt8XFxcXCh8XFxcXF58XFxcXF49fFxcXFx8fFxcXFx8PXxcXFxcfFxcXFx8fH4nO1xuXG4vKipcbiogQHBhcmFtIHsgUGFydGlhbDxNb2RlPiAmIHtiaW5hcnk/OiBzdHJpbmcgfCBSZWdFeHB9IH0gb3B0c1xuKi9cbmNvbnN0IFNIRUJBTkcgPSAob3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IGJlZ2luU2hlYmFuZyA9IC9eIyFbIF0qXFwvLztcbiAgaWYgKG9wdHMuYmluYXJ5KSB7XG4gICAgb3B0cy5iZWdpbiA9IGNvbmNhdChcbiAgICAgIGJlZ2luU2hlYmFuZyxcbiAgICAgIC8uKlxcYi8sXG4gICAgICBvcHRzLmJpbmFyeSxcbiAgICAgIC9cXGIuKi8pO1xuICB9XG4gIHJldHVybiBpbmhlcml0JDEoe1xuICAgIHNjb3BlOiAnbWV0YScsXG4gICAgYmVnaW46IGJlZ2luU2hlYmFuZyxcbiAgICBlbmQ6IC8kLyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgXCJvbjpiZWdpblwiOiAobSwgcmVzcCkgPT4ge1xuICAgICAgaWYgKG0uaW5kZXggIT09IDApIHJlc3AuaWdub3JlTWF0Y2goKTtcbiAgICB9XG4gIH0sIG9wdHMpO1xufTtcblxuLy8gQ29tbW9uIG1vZGVzXG5jb25zdCBCQUNLU0xBU0hfRVNDQVBFID0ge1xuICBiZWdpbjogJ1xcXFxcXFxcW1xcXFxzXFxcXFNdJywgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQVBPU19TVFJJTkdfTU9ERSA9IHtcbiAgc2NvcGU6ICdzdHJpbmcnLFxuICBiZWdpbjogJ1xcJycsXG4gIGVuZDogJ1xcJycsXG4gIGlsbGVnYWw6ICdcXFxcbicsXG4gIGNvbnRhaW5zOiBbQkFDS1NMQVNIX0VTQ0FQRV1cbn07XG5jb25zdCBRVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgc2NvcGU6ICdzdHJpbmcnLFxuICBiZWdpbjogJ1wiJyxcbiAgZW5kOiAnXCInLFxuICBpbGxlZ2FsOiAnXFxcXG4nLFxuICBjb250YWluczogW0JBQ0tTTEFTSF9FU0NBUEVdXG59O1xuY29uc3QgUEhSQVNBTF9XT1JEU19NT0RFID0ge1xuICBiZWdpbjogL1xcYihhfGFufHRoZXxhcmV8SSdtfGlzbid0fGRvbid0fGRvZXNuJ3R8d29uJ3R8YnV0fGp1c3R8c2hvdWxkfHByZXR0eXxzaW1wbHl8ZW5vdWdofGdvbm5hfGdvaW5nfHd0Znxzb3xzdWNofHdpbGx8eW91fHlvdXJ8dGhleXxsaWtlfG1vcmUpXFxiL1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIGNvbW1lbnQgbW9kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUmVnRXhwfSBiZWdpblxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWdFeHB9IGVuZFxuICogQHBhcmFtIHtNb2RlIHwge319IFttb2RlT3B0aW9uc11cbiAqIEByZXR1cm5zIHtQYXJ0aWFsPE1vZGU+fVxuICovXG5jb25zdCBDT01NRU5UID0gZnVuY3Rpb24oYmVnaW4sIGVuZCwgbW9kZU9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBtb2RlID0gaW5oZXJpdCQxKFxuICAgIHtcbiAgICAgIHNjb3BlOiAnY29tbWVudCcsXG4gICAgICBiZWdpbixcbiAgICAgIGVuZCxcbiAgICAgIGNvbnRhaW5zOiBbXVxuICAgIH0sXG4gICAgbW9kZU9wdGlvbnNcbiAgKTtcbiAgbW9kZS5jb250YWlucy5wdXNoKHtcbiAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgLy8gaGFjayB0byBhdm9pZCB0aGUgc3BhY2UgZnJvbSBiZWluZyBpbmNsdWRlZC4gdGhlIHNwYWNlIGlzIG5lY2Vzc2FyeSB0b1xuICAgIC8vIG1hdGNoIGhlcmUgdG8gcHJldmVudCB0aGUgcGxhaW4gdGV4dCBydWxlIGJlbG93IGZyb20gZ29iYmxpbmcgdXAgZG9jdGFnc1xuICAgIGJlZ2luOiAnWyBdKig/PShUT0RPfEZJWE1FfE5PVEV8QlVHfE9QVElNSVpFfEhBQ0t8WFhYKTopJyxcbiAgICBlbmQ6IC8oVE9ET3xGSVhNRXxOT1RFfEJVR3xPUFRJTUlaRXxIQUNLfFhYWCk6LyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH0pO1xuICBjb25zdCBFTkdMSVNIX1dPUkQgPSBlaXRoZXIoXG4gICAgLy8gbGlzdCBvZiBjb21tb24gMSBhbmQgMiBsZXR0ZXIgd29yZHMgaW4gRW5nbGlzaFxuICAgIFwiSVwiLFxuICAgIFwiYVwiLFxuICAgIFwiaXNcIixcbiAgICBcInNvXCIsXG4gICAgXCJ1c1wiLFxuICAgIFwidG9cIixcbiAgICBcImF0XCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW5cIixcbiAgICBcIml0XCIsXG4gICAgXCJvblwiLFxuICAgIC8vIG5vdGU6IHRoaXMgaXMgbm90IGFuIGV4aGF1c3RpdmUgbGlzdCBvZiBjb250cmFjdGlvbnMsIGp1c3QgcG9wdWxhciBvbmVzXG4gICAgL1tBLVphLXpdK1snXShkfHZlfHJlfGxsfHR8c3xuKS8sIC8vIGNvbnRyYWN0aW9ucyAtIGNhbid0IHdlJ2QgdGhleSdyZSBsZXQncywgZXRjXG4gICAgL1tBLVphLXpdK1stXVthLXpdKy8sIC8vIGBuby13YXlgLCBldGMuXG4gICAgL1tBLVphLXpdW2Etel17Mix9LyAvLyBhbGxvdyBjYXBpdGFsaXplZCB3b3JkcyBhdCBiZWdpbm5pbmcgb2Ygc2VudGVuY2VzXG4gICk7XG4gIC8vIGxvb2tpbmcgbGlrZSBwbGFpbiB0ZXh0LCBtb3JlIGxpa2VseSB0byBiZSBhIGNvbW1lbnRcbiAgbW9kZS5jb250YWlucy5wdXNoKFxuICAgIHtcbiAgICAgIC8vIFRPRE86IGhvdyB0byBpbmNsdWRlIFwiLCAoLCApIHdpdGhvdXQgYnJlYWtpbmcgZ3JhbW1hcnMgdGhhdCB1c2UgdGhlc2UgZm9yXG4gICAgICAvLyBjb21tZW50IGRlbGltaXRlcnM/XG4gICAgICAvLyBiZWdpbjogL1sgXSsoWygpXCJdPyhbQS1aYS16Jy1dezMsfXxpc3xhfEl8c298dXN8W3RUXVtvT118YXR8aWZ8aW58aXR8b24pWy5dP1soKVwiOl0/KFsuXVsgXXxbIF18XFwpKSl7M30vXG4gICAgICAvLyAtLS1cblxuICAgICAgLy8gdGhpcyB0cmllcyB0byBmaW5kIHNlcXVlbmNlcyBvZiAzIGVuZ2xpc2ggd29yZHMgaW4gYSByb3cgKHdpdGhvdXQgYW55XG4gICAgICAvLyBcInByb2dyYW1taW5nXCIgdHlwZSBzeW50YXgpIHRoaXMgZ2l2ZXMgdXMgYSBzdHJvbmcgc2lnbmFsIHRoYXQgd2UndmVcbiAgICAgIC8vIFRSVUxZIGZvdW5kIGEgY29tbWVudCAtIHZzIHBlcmhhcHMgc2Nhbm5pbmcgd2l0aCB0aGUgd3JvbmcgbGFuZ3VhZ2UuXG4gICAgICAvLyBJdCdzIHBvc3NpYmxlIHRvIGZpbmQgc29tZXRoaW5nIHRoYXQgTE9PS1MgbGlrZSB0aGUgc3RhcnQgb2YgdGhlXG4gICAgICAvLyBjb21tZW50IC0gYnV0IHRoZW4gaWYgdGhlcmUgaXMgbm8gcmVhZGFibGUgdGV4dCAtIGdvb2QgY2hhbmNlIGl0IGlzIGFcbiAgICAgIC8vIGZhbHNlIG1hdGNoIGFuZCBub3QgYSBjb21tZW50LlxuICAgICAgLy9cbiAgICAgIC8vIGZvciBhIHZpc3VhbCBleGFtcGxlIHBsZWFzZSBzZWU6XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8yODI3XG5cbiAgICAgIGJlZ2luOiBjb25jYXQoXG4gICAgICAgIC9bIF0rLywgLy8gbmVjZXNzYXJ5IHRvIHByZXZlbnQgdXMgZ29iYmxpbmcgdXAgZG9jdGFncyBsaWtlIC8qIEBhdXRob3IgQm9iIE1jZ2lsbCAqL1xuICAgICAgICAnKCcsXG4gICAgICAgIEVOR0xJU0hfV09SRCxcbiAgICAgICAgL1suXT9bOl0/KFsuXVsgXXxbIF0pLyxcbiAgICAgICAgJyl7M30nKSAvLyBsb29rIGZvciAzIHdvcmRzIGluIGEgcm93XG4gICAgfVxuICApO1xuICByZXR1cm4gbW9kZTtcbn07XG5jb25zdCBDX0xJTkVfQ09NTUVOVF9NT0RFID0gQ09NTUVOVCgnLy8nLCAnJCcpO1xuY29uc3QgQ19CTE9DS19DT01NRU5UX01PREUgPSBDT01NRU5UKCcvXFxcXConLCAnXFxcXCovJyk7XG5jb25zdCBIQVNIX0NPTU1FTlRfTU9ERSA9IENPTU1FTlQoJyMnLCAnJCcpO1xuY29uc3QgTlVNQkVSX01PREUgPSB7XG4gIHNjb3BlOiAnbnVtYmVyJyxcbiAgYmVnaW46IE5VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQ19OVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogQ19OVU1CRVJfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcbmNvbnN0IEJJTkFSWV9OVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogQklOQVJZX05VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgUkVHRVhQX01PREUgPSB7XG4gIC8vIHRoaXMgb3V0ZXIgcnVsZSBtYWtlcyBzdXJlIHdlIGFjdHVhbGx5IGhhdmUgYSBXSE9MRSByZWdleCBhbmQgbm90IHNpbXBseVxuICAvLyBhbiBleHByZXNzaW9uIHN1Y2ggYXM6XG4gIC8vXG4gIC8vICAgICAzIC8gc29tZXRoaW5nXG4gIC8vXG4gIC8vICh3aGljaCB3aWxsIHRoZW4gYmxvdyB1cCB3aGVuIHJlZ2V4J3MgYGlsbGVnYWxgIHNlZXMgdGhlIG5ld2xpbmUpXG4gIGJlZ2luOiAvKD89XFwvW14vXFxuXSpcXC8pLyxcbiAgY29udGFpbnM6IFt7XG4gICAgc2NvcGU6ICdyZWdleHAnLFxuICAgIGJlZ2luOiAvXFwvLyxcbiAgICBlbmQ6IC9cXC9bZ2ltdXldKi8sXG4gICAgaWxsZWdhbDogL1xcbi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxbLyxcbiAgICAgICAgZW5kOiAvXFxdLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW0JBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9XG4gICAgXVxuICB9XVxufTtcbmNvbnN0IFRJVExFX01PREUgPSB7XG4gIHNjb3BlOiAndGl0bGUnLFxuICBiZWdpbjogSURFTlRfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcbmNvbnN0IFVOREVSU0NPUkVfVElUTEVfTU9ERSA9IHtcbiAgc2NvcGU6ICd0aXRsZScsXG4gIGJlZ2luOiBVTkRFUlNDT1JFX0lERU5UX1JFLFxuICByZWxldmFuY2U6IDBcbn07XG5jb25zdCBNRVRIT0RfR1VBUkQgPSB7XG4gIC8vIGV4Y2x1ZGVzIG1ldGhvZCBuYW1lcyBmcm9tIGtleXdvcmQgcHJvY2Vzc2luZ1xuICBiZWdpbjogJ1xcXFwuXFxcXHMqJyArIFVOREVSU0NPUkVfSURFTlRfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcblxuLyoqXG4gKiBBZGRzIGVuZCBzYW1lIGFzIGJlZ2luIG1lY2hhbmljcyB0byBhIG1vZGVcbiAqXG4gKiBZb3VyIG1vZGUgbXVzdCBpbmNsdWRlIGF0IGxlYXN0IGEgc2luZ2xlICgpIG1hdGNoIGdyb3VwIGFzIHRoYXQgZmlyc3QgbWF0Y2hcbiAqIGdyb3VwIGlzIHdoYXQgaXMgdXNlZCBmb3IgY29tcGFyaXNvblxuICogQHBhcmFtIHtQYXJ0aWFsPE1vZGU+fSBtb2RlXG4gKi9cbmNvbnN0IEVORF9TQU1FX0FTX0JFR0lOID0gZnVuY3Rpb24obW9kZSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihtb2RlLFxuICAgIHtcbiAgICAgIC8qKiBAdHlwZSB7TW9kZUNhbGxiYWNrfSAqL1xuICAgICAgJ29uOmJlZ2luJzogKG0sIHJlc3ApID0+IHsgcmVzcC5kYXRhLl9iZWdpbk1hdGNoID0gbVsxXTsgfSxcbiAgICAgIC8qKiBAdHlwZSB7TW9kZUNhbGxiYWNrfSAqL1xuICAgICAgJ29uOmVuZCc6IChtLCByZXNwKSA9PiB7IGlmIChyZXNwLmRhdGEuX2JlZ2luTWF0Y2ggIT09IG1bMV0pIHJlc3AuaWdub3JlTWF0Y2goKTsgfVxuICAgIH0pO1xufTtcblxudmFyIE1PREVTID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBNQVRDSF9OT1RISU5HX1JFOiBNQVRDSF9OT1RISU5HX1JFLFxuICAgIElERU5UX1JFOiBJREVOVF9SRSxcbiAgICBVTkRFUlNDT1JFX0lERU5UX1JFOiBVTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgIE5VTUJFUl9SRTogTlVNQkVSX1JFLFxuICAgIENfTlVNQkVSX1JFOiBDX05VTUJFUl9SRSxcbiAgICBCSU5BUllfTlVNQkVSX1JFOiBCSU5BUllfTlVNQkVSX1JFLFxuICAgIFJFX1NUQVJURVJTX1JFOiBSRV9TVEFSVEVSU19SRSxcbiAgICBTSEVCQU5HOiBTSEVCQU5HLFxuICAgIEJBQ0tTTEFTSF9FU0NBUEU6IEJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgQVBPU19TVFJJTkdfTU9ERTogQVBPU19TVFJJTkdfTU9ERSxcbiAgICBRVU9URV9TVFJJTkdfTU9ERTogUVVPVEVfU1RSSU5HX01PREUsXG4gICAgUEhSQVNBTF9XT1JEU19NT0RFOiBQSFJBU0FMX1dPUkRTX01PREUsXG4gICAgQ09NTUVOVDogQ09NTUVOVCxcbiAgICBDX0xJTkVfQ09NTUVOVF9NT0RFOiBDX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgIENfQkxPQ0tfQ09NTUVOVF9NT0RFOiBDX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICBIQVNIX0NPTU1FTlRfTU9ERTogSEFTSF9DT01NRU5UX01PREUsXG4gICAgTlVNQkVSX01PREU6IE5VTUJFUl9NT0RFLFxuICAgIENfTlVNQkVSX01PREU6IENfTlVNQkVSX01PREUsXG4gICAgQklOQVJZX05VTUJFUl9NT0RFOiBCSU5BUllfTlVNQkVSX01PREUsXG4gICAgUkVHRVhQX01PREU6IFJFR0VYUF9NT0RFLFxuICAgIFRJVExFX01PREU6IFRJVExFX01PREUsXG4gICAgVU5ERVJTQ09SRV9USVRMRV9NT0RFOiBVTkRFUlNDT1JFX1RJVExFX01PREUsXG4gICAgTUVUSE9EX0dVQVJEOiBNRVRIT0RfR1VBUkQsXG4gICAgRU5EX1NBTUVfQVNfQkVHSU46IEVORF9TQU1FX0FTX0JFR0lOXG59KTtcblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5DYWxsYmFja1Jlc3BvbnNlfSBDYWxsYmFja1Jlc3BvbnNlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlckV4dH0gQ29tcGlsZXJFeHRcbiovXG5cbi8vIEdyYW1tYXIgZXh0ZW5zaW9ucyAvIHBsdWdpbnNcbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjgzM1xuXG4vLyBHcmFtbWFyIGV4dGVuc2lvbnMgYWxsb3cgXCJzeW50YWN0aWMgc3VnYXJcIiB0byBiZSBhZGRlZCB0byB0aGUgZ3JhbW1hciBtb2Rlc1xuLy8gd2l0aG91dCByZXF1aXJpbmcgYW55IHVuZGVybHlpbmcgY2hhbmdlcyB0byB0aGUgY29tcGlsZXIgaW50ZXJuYWxzLlxuXG4vLyBgY29tcGlsZU1hdGNoYCBiZWluZyB0aGUgcGVyZmVjdCBzbWFsbCBleGFtcGxlIG9mIG5vdyBhbGxvd2luZyBhIGdyYW1tYXJcbi8vIGF1dGhvciB0byB3cml0ZSBgbWF0Y2hgIHdoZW4gdGhleSBkZXNpcmUgdG8gbWF0Y2ggYSBzaW5nbGUgZXhwcmVzc2lvbiByYXRoZXJcbi8vIHRoYW4gYmVpbmcgZm9yY2VkIHRvIHVzZSBgYmVnaW5gLiAgVGhlIGV4dGVuc2lvbiB0aGVuIGp1c3QgbW92ZXMgYG1hdGNoYCBpbnRvXG4vLyBgYmVnaW5gIHdoZW4gaXQgcnVucy4gIEllLCBubyBmZWF0dXJlcyBoYXZlIGJlZW4gYWRkZWQsIGJ1dCB3ZSd2ZSBqdXN0IG1hZGVcbi8vIHRoZSBleHBlcmllbmNlIG9mIHdyaXRpbmcgKGFuZCByZWFkaW5nIGdyYW1tYXJzKSBhIGxpdHRsZSBiaXQgbmljZXIuXG5cbi8vIC0tLS0tLVxuXG4vLyBUT0RPOiBXZSBuZWVkIG5lZ2F0aXZlIGxvb2stYmVoaW5kIHN1cHBvcnQgdG8gZG8gdGhpcyBwcm9wZXJseVxuLyoqXG4gKiBTa2lwIGEgbWF0Y2ggaWYgaXQgaGFzIGEgcHJlY2VkaW5nIGRvdFxuICpcbiAqIFRoaXMgaXMgdXNlZCBmb3IgYGJlZ2luS2V5d29yZHNgIHRvIHByZXZlbnQgbWF0Y2hpbmcgZXhwcmVzc2lvbnMgc3VjaCBhc1xuICogYGJvYi5rZXl3b3JkLmRvKClgLiBUaGUgbW9kZSBjb21waWxlciBhdXRvbWF0aWNhbGx5IHdpcmVzIHRoaXMgdXAgYXMgYVxuICogc3BlY2lhbCBfaW50ZXJuYWxfICdvbjpiZWdpbicgY2FsbGJhY2sgZm9yIG1vZGVzIHdpdGggYGJlZ2luS2V5d29yZHNgXG4gKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gKiBAcGFyYW0ge0NhbGxiYWNrUmVzcG9uc2V9IHJlc3BvbnNlXG4gKi9cbmZ1bmN0aW9uIHNraXBJZkhhc1ByZWNlZGluZ0RvdChtYXRjaCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgYmVmb3JlID0gbWF0Y2guaW5wdXRbbWF0Y2guaW5kZXggLSAxXTtcbiAgaWYgKGJlZm9yZSA9PT0gXCIuXCIpIHtcbiAgICByZXNwb25zZS5pZ25vcmVNYXRjaCgpO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHtDb21waWxlckV4dH1cbiAqL1xuZnVuY3Rpb24gc2NvcGVDbGFzc05hbWUobW9kZSwgX3BhcmVudCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gIGlmIChtb2RlLmNsYXNzTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kZS5zY29wZSA9IG1vZGUuY2xhc3NOYW1lO1xuICAgIGRlbGV0ZSBtb2RlLmNsYXNzTmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIGBiZWdpbktleXdvcmRzYCBzeW50YWN0aWMgc3VnYXJcbiAqIEB0eXBlIHtDb21waWxlckV4dH1cbiAqL1xuZnVuY3Rpb24gYmVnaW5LZXl3b3Jkcyhtb2RlLCBwYXJlbnQpIHtcbiAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgaWYgKCFtb2RlLmJlZ2luS2V5d29yZHMpIHJldHVybjtcblxuICAvLyBmb3IgbGFuZ3VhZ2VzIHdpdGgga2V5d29yZHMgdGhhdCBpbmNsdWRlIG5vbi13b3JkIGNoYXJhY3RlcnMgY2hlY2tpbmcgZm9yXG4gIC8vIGEgd29yZCBib3VuZGFyeSBpcyBub3Qgc3VmZmljaWVudCwgc28gaW5zdGVhZCB3ZSBjaGVjayBmb3IgYSB3b3JkIGJvdW5kYXJ5XG4gIC8vIG9yIHdoaXRlc3BhY2UgLSB0aGlzIGRvZXMgbm8gaGFybSBpbiBhbnkgY2FzZSBzaW5jZSBvdXIga2V5d29yZCBlbmdpbmVcbiAgLy8gZG9lc24ndCBhbGxvdyBzcGFjZXMgaW4ga2V5d29yZHMgYW55d2F5cyBhbmQgd2Ugc3RpbGwgY2hlY2sgZm9yIHRoZSBib3VuZGFyeVxuICAvLyBmaXJzdFxuICBtb2RlLmJlZ2luID0gJ1xcXFxiKCcgKyBtb2RlLmJlZ2luS2V5d29yZHMuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKSg/IVxcXFwuKSg/PVxcXFxifFxcXFxzKSc7XG4gIG1vZGUuX19iZWZvcmVCZWdpbiA9IHNraXBJZkhhc1ByZWNlZGluZ0RvdDtcbiAgbW9kZS5rZXl3b3JkcyA9IG1vZGUua2V5d29yZHMgfHwgbW9kZS5iZWdpbktleXdvcmRzO1xuICBkZWxldGUgbW9kZS5iZWdpbktleXdvcmRzO1xuXG4gIC8vIHByZXZlbnRzIGRvdWJsZSByZWxldmFuY2UsIHRoZSBrZXl3b3JkcyB0aGVtc2VsdmVzIHByb3ZpZGVcbiAgLy8gcmVsZXZhbmNlLCB0aGUgbW9kZSBkb2Vzbid0IG5lZWQgdG8gZG91YmxlIGl0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgaWYgKG1vZGUucmVsZXZhbmNlID09PSB1bmRlZmluZWQpIG1vZGUucmVsZXZhbmNlID0gMDtcbn1cblxuLyoqXG4gKiBBbGxvdyBgaWxsZWdhbGAgdG8gY29udGFpbiBhbiBhcnJheSBvZiBpbGxlZ2FsIHZhbHVlc1xuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlSWxsZWdhbChtb2RlLCBfcGFyZW50KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShtb2RlLmlsbGVnYWwpKSByZXR1cm47XG5cbiAgbW9kZS5pbGxlZ2FsID0gZWl0aGVyKC4uLm1vZGUuaWxsZWdhbCk7XG59XG5cbi8qKlxuICogYG1hdGNoYCB0byBtYXRjaCBhIHNpbmdsZSBleHByZXNzaW9uIGZvciByZWFkYWJpbGl0eVxuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlTWF0Y2gobW9kZSwgX3BhcmVudCkge1xuICBpZiAoIW1vZGUubWF0Y2gpIHJldHVybjtcbiAgaWYgKG1vZGUuYmVnaW4gfHwgbW9kZS5lbmQpIHRocm93IG5ldyBFcnJvcihcImJlZ2luICYgZW5kIGFyZSBub3Qgc3VwcG9ydGVkIHdpdGggbWF0Y2hcIik7XG5cbiAgbW9kZS5iZWdpbiA9IG1vZGUubWF0Y2g7XG4gIGRlbGV0ZSBtb2RlLm1hdGNoO1xufVxuXG4vKipcbiAqIHByb3ZpZGVzIHRoZSBkZWZhdWx0IDEgcmVsZXZhbmNlIHRvIGFsbCBtb2Rlc1xuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlUmVsZXZhbmNlKG1vZGUsIF9wYXJlbnQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICBpZiAobW9kZS5yZWxldmFuY2UgPT09IHVuZGVmaW5lZCkgbW9kZS5yZWxldmFuY2UgPSAxO1xufVxuXG4vLyBhbGxvdyBiZWZvcmVNYXRjaCB0byBhY3QgYXMgYSBcInF1YWxpZmllclwiIGZvciB0aGUgbWF0Y2hcbi8vIHRoZSBmdWxsIG1hdGNoIGJlZ2luIG11c3QgYmUgW2JlZm9yZU1hdGNoXVtiZWdpbl1cbmNvbnN0IGJlZm9yZU1hdGNoRXh0ID0gKG1vZGUsIHBhcmVudCkgPT4ge1xuICBpZiAoIW1vZGUuYmVmb3JlTWF0Y2gpIHJldHVybjtcbiAgLy8gc3RhcnRzIGNvbmZsaWN0cyB3aXRoIGVuZHNQYXJlbnQgd2hpY2ggd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIGNoaWxkXG4gIC8vIHJ1bGUgaXMgbm90IG1hdGNoZWQgbXVsdGlwbGUgdGltZXNcbiAgaWYgKG1vZGUuc3RhcnRzKSB0aHJvdyBuZXcgRXJyb3IoXCJiZWZvcmVNYXRjaCBjYW5ub3QgYmUgdXNlZCB3aXRoIHN0YXJ0c1wiKTtcblxuICBjb25zdCBvcmlnaW5hbE1vZGUgPSBPYmplY3QuYXNzaWduKHt9LCBtb2RlKTtcbiAgT2JqZWN0LmtleXMobW9kZSkuZm9yRWFjaCgoa2V5KSA9PiB7IGRlbGV0ZSBtb2RlW2tleV07IH0pO1xuXG4gIG1vZGUua2V5d29yZHMgPSBvcmlnaW5hbE1vZGUua2V5d29yZHM7XG4gIG1vZGUuYmVnaW4gPSBjb25jYXQob3JpZ2luYWxNb2RlLmJlZm9yZU1hdGNoLCBsb29rYWhlYWQob3JpZ2luYWxNb2RlLmJlZ2luKSk7XG4gIG1vZGUuc3RhcnRzID0ge1xuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAgT2JqZWN0LmFzc2lnbihvcmlnaW5hbE1vZGUsIHsgZW5kc1BhcmVudDogdHJ1ZSB9KVxuICAgIF1cbiAgfTtcbiAgbW9kZS5yZWxldmFuY2UgPSAwO1xuXG4gIGRlbGV0ZSBvcmlnaW5hbE1vZGUuYmVmb3JlTWF0Y2g7XG59O1xuXG4vLyBrZXl3b3JkcyB0aGF0IHNob3VsZCBoYXZlIG5vIGRlZmF1bHQgcmVsZXZhbmNlIHZhbHVlXG5jb25zdCBDT01NT05fS0VZV09SRFMgPSBbXG4gICdvZicsXG4gICdhbmQnLFxuICAnZm9yJyxcbiAgJ2luJyxcbiAgJ25vdCcsXG4gICdvcicsXG4gICdpZicsXG4gICd0aGVuJyxcbiAgJ3BhcmVudCcsIC8vIGNvbW1vbiB2YXJpYWJsZSBuYW1lXG4gICdsaXN0JywgLy8gY29tbW9uIHZhcmlhYmxlIG5hbWVcbiAgJ3ZhbHVlJyAvLyBjb21tb24gdmFyaWFibGUgbmFtZVxuXTtcblxuY29uc3QgREVGQVVMVF9LRVlXT1JEX1NDT1BFID0gXCJrZXl3b3JkXCI7XG5cbi8qKlxuICogR2l2ZW4gcmF3IGtleXdvcmRzIGZyb20gYSBsYW5ndWFnZSBkZWZpbml0aW9uLCBjb21waWxlIHRoZW0uXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLHN0cmluZ3xzdHJpbmdbXT4gfCBBcnJheTxzdHJpbmc+fSByYXdLZXl3b3Jkc1xuICogQHBhcmFtIHtib29sZWFufSBjYXNlSW5zZW5zaXRpdmVcbiAqL1xuZnVuY3Rpb24gY29tcGlsZUtleXdvcmRzKHJhd0tleXdvcmRzLCBjYXNlSW5zZW5zaXRpdmUsIHNjb3BlTmFtZSA9IERFRkFVTFRfS0VZV09SRF9TQ09QRSkge1xuICAvKiogQHR5cGUgS2V5d29yZERpY3QgKi9cbiAgY29uc3QgY29tcGlsZWRLZXl3b3JkcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy8gaW5wdXQgY2FuIGJlIGEgc3RyaW5nIG9mIGtleXdvcmRzLCBhbiBhcnJheSBvZiBrZXl3b3Jkcywgb3IgYSBvYmplY3Qgd2l0aFxuICAvLyBuYW1lZCBrZXlzIHJlcHJlc2VudGluZyBzY29wZU5hbWUgKHdoaWNoIGNhbiB0aGVuIHBvaW50IHRvIGEgc3RyaW5nIG9yIGFycmF5KVxuICBpZiAodHlwZW9mIHJhd0tleXdvcmRzID09PSAnc3RyaW5nJykge1xuICAgIGNvbXBpbGVMaXN0KHNjb3BlTmFtZSwgcmF3S2V5d29yZHMuc3BsaXQoXCIgXCIpKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJhd0tleXdvcmRzKSkge1xuICAgIGNvbXBpbGVMaXN0KHNjb3BlTmFtZSwgcmF3S2V5d29yZHMpO1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5rZXlzKHJhd0tleXdvcmRzKS5mb3JFYWNoKGZ1bmN0aW9uKHNjb3BlTmFtZSkge1xuICAgICAgLy8gY29sbGFwc2UgYWxsIG91ciBvYmplY3RzIGJhY2sgaW50byB0aGUgcGFyZW50IG9iamVjdFxuICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgY29tcGlsZWRLZXl3b3JkcyxcbiAgICAgICAgY29tcGlsZUtleXdvcmRzKHJhd0tleXdvcmRzW3Njb3BlTmFtZV0sIGNhc2VJbnNlbnNpdGl2ZSwgc2NvcGVOYW1lKVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY29tcGlsZWRLZXl3b3JkcztcblxuICAvLyAtLS1cblxuICAvKipcbiAgICogQ29tcGlsZXMgYW4gaW5kaXZpZHVhbCBsaXN0IG9mIGtleXdvcmRzXG4gICAqXG4gICAqIEV4OiBcImZvciBpZiB3aGVuIHdoaWxlfDVcIlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVOYW1lXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0ga2V5d29yZExpc3RcbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBpbGVMaXN0KHNjb3BlTmFtZSwga2V5d29yZExpc3QpIHtcbiAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgICBrZXl3b3JkTGlzdCA9IGtleXdvcmRMaXN0Lm1hcCh4ID0+IHgudG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuICAgIGtleXdvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgY29uc3QgcGFpciA9IGtleXdvcmQuc3BsaXQoJ3wnKTtcbiAgICAgIGNvbXBpbGVkS2V5d29yZHNbcGFpclswXV0gPSBbc2NvcGVOYW1lLCBzY29yZUZvcktleXdvcmQocGFpclswXSwgcGFpclsxXSldO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcHJvcGVyIHNjb3JlIGZvciBhIGdpdmVuIGtleXdvcmRcbiAqXG4gKiBBbHNvIHRha2VzIGludG8gYWNjb3VudCBjb21tZW50IGtleXdvcmRzLCB3aGljaCB3aWxsIGJlIHNjb3JlZCAwIFVOTEVTU1xuICogYW5vdGhlciBzY29yZSBoYXMgYmVlbiBtYW51YWxseSBhc3NpZ25lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gKiBAcGFyYW0ge3N0cmluZ30gW3Byb3ZpZGVkU2NvcmVdXG4gKi9cbmZ1bmN0aW9uIHNjb3JlRm9yS2V5d29yZChrZXl3b3JkLCBwcm92aWRlZFNjb3JlKSB7XG4gIC8vIG1hbnVhbCBzY29yZXMgYWx3YXlzIHdpbiBvdmVyIGNvbW1vbiBrZXl3b3Jkc1xuICAvLyBzbyB5b3UgY2FuIGZvcmNlIGEgc2NvcmUgb2YgMSBpZiB5b3UgcmVhbGx5IGluc2lzdFxuICBpZiAocHJvdmlkZWRTY29yZSkge1xuICAgIHJldHVybiBOdW1iZXIocHJvdmlkZWRTY29yZSk7XG4gIH1cblxuICByZXR1cm4gY29tbW9uS2V5d29yZChrZXl3b3JkKSA/IDAgOiAxO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgaWYgYSBnaXZlbiBrZXl3b3JkIGlzIGNvbW1vbiBvciBub3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCAqL1xuZnVuY3Rpb24gY29tbW9uS2V5d29yZChrZXl3b3JkKSB7XG4gIHJldHVybiBDT01NT05fS0VZV09SRFMuaW5jbHVkZXMoa2V5d29yZC50b0xvd2VyQ2FzZSgpKTtcbn1cblxuLypcblxuRm9yIHRoZSByZWFzb25pbmcgYmVoaW5kIHRoaXMgcGxlYXNlIHNlZTpcbmh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzI4ODAjaXNzdWVjb21tZW50LTc0NzI3NTQxOVxuXG4qL1xuXG4vKipcbiAqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBib29sZWFuPn1cbiAqL1xuY29uc3Qgc2VlbkRlcHJlY2F0aW9ucyA9IHt9O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gKi9cbmNvbnN0IGVycm9yID0gKG1lc3NhZ2UpID0+IHtcbiAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7YW55fSBhcmdzXG4gKi9cbmNvbnN0IHdhcm4gPSAobWVzc2FnZSwgLi4uYXJncykgPT4ge1xuICBjb25zb2xlLmxvZyhgV0FSTjogJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqL1xuY29uc3QgZGVwcmVjYXRlZCA9ICh2ZXJzaW9uLCBtZXNzYWdlKSA9PiB7XG4gIGlmIChzZWVuRGVwcmVjYXRpb25zW2Ake3ZlcnNpb259LyR7bWVzc2FnZX1gXSkgcmV0dXJuO1xuXG4gIGNvbnNvbGUubG9nKGBEZXByZWNhdGVkIGFzIG9mICR7dmVyc2lvbn0uICR7bWVzc2FnZX1gKTtcbiAgc2VlbkRlcHJlY2F0aW9uc1tgJHt2ZXJzaW9ufS8ke21lc3NhZ2V9YF0gPSB0cnVlO1xufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdGhyb3ctbGl0ZXJhbCAqL1xuXG4vKipcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNvbXBpbGVkTW9kZX0gQ29tcGlsZWRNb2RlXG4qL1xuXG5jb25zdCBNdWx0aUNsYXNzRXJyb3IgPSBuZXcgRXJyb3IoKTtcblxuLyoqXG4gKiBSZW51bWJlcnMgbGFiZWxlZCBzY29wZSBuYW1lcyB0byBhY2NvdW50IGZvciBhZGRpdGlvbmFsIGlubmVyIG1hdGNoXG4gKiBncm91cHMgdGhhdCBvdGhlcndpc2Ugd291bGQgYnJlYWsgZXZlcnl0aGluZy5cbiAqXG4gKiBMZXRzIHNheSB3ZSAzIG1hdGNoIHNjb3BlczpcbiAqXG4gKiAgIHsgMSA9PiAuLi4sIDIgPT4gLi4uLCAzID0+IC4uLiB9XG4gKlxuICogU28gd2hhdCB3ZSBuZWVkIGlzIGEgY2xlYW4gbWF0Y2ggbGlrZSB0aGlzOlxuICpcbiAqICAgKGEpKGIpKGMpID0+IFsgXCJhXCIsIFwiYlwiLCBcImNcIiBdXG4gKlxuICogQnV0IHRoaXMgZmFsbHMgYXBhcnQgd2l0aCBpbm5lciBtYXRjaCBncm91cHM6XG4gKlxuICogKGEpKCgoYikpKShjKSA9PiBbXCJhXCIsIFwiYlwiLCBcImJcIiwgXCJiXCIsIFwiY1wiIF1cbiAqXG4gKiBPdXIgc2NvcGVzIGFyZSBub3cgXCJvdXQgb2YgYWxpZ25tZW50XCIgYW5kIHdlJ3JlIHJlcGVhdGluZyBgYmAgMyB0aW1lcy5cbiAqIFdoYXQgbmVlZHMgdG8gaGFwcGVuIGlzIHRoZSBudW1iZXJzIGFyZSByZW1hcHBlZDpcbiAqXG4gKiAgIHsgMSA9PiAuLi4sIDIgPT4gLi4uLCA1ID0+IC4uLiB9XG4gKlxuICogV2UgYWxzbyBuZWVkIHRvIGtub3cgdGhhdCB0aGUgT05MWSBncm91cHMgdGhhdCBzaG91bGQgYmUgb3V0cHV0XG4gKiBhcmUgMSwgMiwgYW5kIDUuICBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhpcyBiZWhhdmlvci5cbiAqXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICogQHBhcmFtIHtBcnJheTxSZWdFeHAgfCBzdHJpbmc+fSByZWdleGVzXG4gKiBAcGFyYW0ge3trZXk6IFwiYmVnaW5TY29wZVwifFwiZW5kU2NvcGVcIn19IG9wdHNcbiAqL1xuZnVuY3Rpb24gcmVtYXBTY29wZU5hbWVzKG1vZGUsIHJlZ2V4ZXMsIHsga2V5IH0pIHtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGNvbnN0IHNjb3BlTmFtZXMgPSBtb2RlW2tleV07XG4gIC8qKiBAdHlwZSBSZWNvcmQ8bnVtYmVyLGJvb2xlYW4+ICovXG4gIGNvbnN0IGVtaXQgPSB7fTtcbiAgLyoqIEB0eXBlIFJlY29yZDxudW1iZXIsc3RyaW5nPiAqL1xuICBjb25zdCBwb3NpdGlvbnMgPSB7fTtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8PSByZWdleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgcG9zaXRpb25zW2kgKyBvZmZzZXRdID0gc2NvcGVOYW1lc1tpXTtcbiAgICBlbWl0W2kgKyBvZmZzZXRdID0gdHJ1ZTtcbiAgICBvZmZzZXQgKz0gY291bnRNYXRjaEdyb3VwcyhyZWdleGVzW2kgLSAxXSk7XG4gIH1cbiAgLy8gd2UgdXNlIF9lbWl0IHRvIGtlZXAgdHJhY2sgb2Ygd2hpY2ggbWF0Y2ggZ3JvdXBzIGFyZSBcInRvcC1sZXZlbFwiIHRvIGF2b2lkIGRvdWJsZVxuICAvLyBvdXRwdXQgZnJvbSBpbnNpZGUgbWF0Y2ggZ3JvdXBzXG4gIG1vZGVba2V5XSA9IHBvc2l0aW9ucztcbiAgbW9kZVtrZXldLl9lbWl0ID0gZW1pdDtcbiAgbW9kZVtrZXldLl9tdWx0aSA9IHRydWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAqL1xuZnVuY3Rpb24gYmVnaW5NdWx0aUNsYXNzKG1vZGUpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGUuYmVnaW4pKSByZXR1cm47XG5cbiAgaWYgKG1vZGUuc2tpcCB8fCBtb2RlLmV4Y2x1ZGVCZWdpbiB8fCBtb2RlLnJldHVybkJlZ2luKSB7XG4gICAgZXJyb3IoXCJza2lwLCBleGNsdWRlQmVnaW4sIHJldHVybkJlZ2luIG5vdCBjb21wYXRpYmxlIHdpdGggYmVnaW5TY29wZToge31cIik7XG4gICAgdGhyb3cgTXVsdGlDbGFzc0Vycm9yO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2RlLmJlZ2luU2NvcGUgIT09IFwib2JqZWN0XCIgfHwgbW9kZS5iZWdpblNjb3BlID09PSBudWxsKSB7XG4gICAgZXJyb3IoXCJiZWdpblNjb3BlIG11c3QgYmUgb2JqZWN0XCIpO1xuICAgIHRocm93IE11bHRpQ2xhc3NFcnJvcjtcbiAgfVxuXG4gIHJlbWFwU2NvcGVOYW1lcyhtb2RlLCBtb2RlLmJlZ2luLCB7IGtleTogXCJiZWdpblNjb3BlXCIgfSk7XG4gIG1vZGUuYmVnaW4gPSBfcmV3cml0ZUJhY2tyZWZlcmVuY2VzKG1vZGUuYmVnaW4sIHsgam9pbldpdGg6IFwiXCIgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAqL1xuZnVuY3Rpb24gZW5kTXVsdGlDbGFzcyhtb2RlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShtb2RlLmVuZCkpIHJldHVybjtcblxuICBpZiAobW9kZS5za2lwIHx8IG1vZGUuZXhjbHVkZUVuZCB8fCBtb2RlLnJldHVybkVuZCkge1xuICAgIGVycm9yKFwic2tpcCwgZXhjbHVkZUVuZCwgcmV0dXJuRW5kIG5vdCBjb21wYXRpYmxlIHdpdGggZW5kU2NvcGU6IHt9XCIpO1xuICAgIHRocm93IE11bHRpQ2xhc3NFcnJvcjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbW9kZS5lbmRTY29wZSAhPT0gXCJvYmplY3RcIiB8fCBtb2RlLmVuZFNjb3BlID09PSBudWxsKSB7XG4gICAgZXJyb3IoXCJlbmRTY29wZSBtdXN0IGJlIG9iamVjdFwiKTtcbiAgICB0aHJvdyBNdWx0aUNsYXNzRXJyb3I7XG4gIH1cblxuICByZW1hcFNjb3BlTmFtZXMobW9kZSwgbW9kZS5lbmQsIHsga2V5OiBcImVuZFNjb3BlXCIgfSk7XG4gIG1vZGUuZW5kID0gX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyhtb2RlLmVuZCwgeyBqb2luV2l0aDogXCJcIiB9KTtcbn1cblxuLyoqXG4gKiB0aGlzIGV4aXN0cyBvbmx5IHRvIGFsbG93IGBzY29wZToge31gIHRvIGJlIHVzZWQgYmVzaWRlIGBtYXRjaDpgXG4gKiBPdGhlcndpc2UgYGJlZ2luU2NvcGVgIHdvdWxkIG5lY2Vzc2FyeSBhbmQgdGhhdCB3b3VsZCBsb29rIHdlaXJkXG5cbiAge1xuICAgIG1hdGNoOiBbIC9kZWYvLCAvXFx3Ky8gXVxuICAgIHNjb3BlOiB7IDE6IFwia2V5d29yZFwiICwgMjogXCJ0aXRsZVwiIH1cbiAgfVxuXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICovXG5mdW5jdGlvbiBzY29wZVN1Z2FyKG1vZGUpIHtcbiAgaWYgKG1vZGUuc2NvcGUgJiYgdHlwZW9mIG1vZGUuc2NvcGUgPT09IFwib2JqZWN0XCIgJiYgbW9kZS5zY29wZSAhPT0gbnVsbCkge1xuICAgIG1vZGUuYmVnaW5TY29wZSA9IG1vZGUuc2NvcGU7XG4gICAgZGVsZXRlIG1vZGUuc2NvcGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICovXG5mdW5jdGlvbiBNdWx0aUNsYXNzKG1vZGUpIHtcbiAgc2NvcGVTdWdhcihtb2RlKTtcblxuICBpZiAodHlwZW9mIG1vZGUuYmVnaW5TY29wZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIG1vZGUuYmVnaW5TY29wZSA9IHsgX3dyYXA6IG1vZGUuYmVnaW5TY29wZSB9O1xuICB9XG4gIGlmICh0eXBlb2YgbW9kZS5lbmRTY29wZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIG1vZGUuZW5kU2NvcGUgPSB7IF93cmFwOiBtb2RlLmVuZFNjb3BlIH07XG4gIH1cblxuICBiZWdpbk11bHRpQ2xhc3MobW9kZSk7XG4gIGVuZE11bHRpQ2xhc3MobW9kZSk7XG59XG5cbi8qKlxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTW9kZX0gTW9kZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRNb2RlfSBDb21waWxlZE1vZGVcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkxhbmd1YWdlfSBMYW5ndWFnZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSExKU1BsdWdpbn0gSExKU1BsdWdpblxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRMYW5ndWFnZX0gQ29tcGlsZWRMYW5ndWFnZVxuKi9cblxuLy8gY29tcGlsYXRpb25cblxuLyoqXG4gKiBDb21waWxlcyBhIGxhbmd1YWdlIGRlZmluaXRpb24gcmVzdWx0XG4gKlxuICogR2l2ZW4gdGhlIHJhdyByZXN1bHQgb2YgYSBsYW5ndWFnZSBkZWZpbml0aW9uIChMYW5ndWFnZSksIGNvbXBpbGVzIHRoaXMgc29cbiAqIHRoYXQgaXQgaXMgcmVhZHkgZm9yIGhpZ2hsaWdodGluZyBjb2RlLlxuICogQHBhcmFtIHtMYW5ndWFnZX0gbGFuZ3VhZ2VcbiAqIEByZXR1cm5zIHtDb21waWxlZExhbmd1YWdlfVxuICovXG5mdW5jdGlvbiBjb21waWxlTGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcbiAgLyoqXG4gICAqIEJ1aWxkcyBhIHJlZ2V4IHdpdGggdGhlIGNhc2Ugc2Vuc2l0aXZpdHkgb2YgdGhlIGN1cnJlbnQgbGFuZ3VhZ2VcbiAgICpcbiAgICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmd9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2dsb2JhbF1cbiAgICovXG4gIGZ1bmN0aW9uIGxhbmdSZSh2YWx1ZSwgZ2xvYmFsKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXG4gICAgICBzb3VyY2UodmFsdWUpLFxuICAgICAgJ20nXG4gICAgICArIChsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlID8gJ2knIDogJycpXG4gICAgICArIChsYW5ndWFnZS51bmljb2RlUmVnZXggPyAndScgOiAnJylcbiAgICAgICsgKGdsb2JhbCA/ICdnJyA6ICcnKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICBTdG9yZXMgbXVsdGlwbGUgcmVndWxhciBleHByZXNzaW9ucyBhbmQgYWxsb3dzIHlvdSB0byBxdWlja2x5IHNlYXJjaCBmb3JcbiAgICB0aGVtIGFsbCBpbiBhIHN0cmluZyBzaW11bHRhbmVvdXNseSAtIHJldHVybmluZyB0aGUgZmlyc3QgbWF0Y2guICBJdCBkb2VzXG4gICAgdGhpcyBieSBjcmVhdGluZyBhIGh1Z2UgKGF8YnxjKSByZWdleCAtIGVhY2ggaW5kaXZpZHVhbCBpdGVtIHdyYXBwZWQgd2l0aCAoKVxuICAgIGFuZCBqb2luZWQgYnkgYHxgIC0gdXNpbmcgbWF0Y2ggZ3JvdXBzIHRvIHRyYWNrIHBvc2l0aW9uLiAgV2hlbiBhIG1hdGNoIGlzXG4gICAgZm91bmQgY2hlY2tpbmcgd2hpY2ggcG9zaXRpb24gaW4gdGhlIGFycmF5IGhhcyBjb250ZW50IGFsbG93cyB1cyB0byBmaWd1cmVcbiAgICBvdXQgd2hpY2ggb2YgdGhlIG9yaWdpbmFsIHJlZ2V4ZXMgLyBtYXRjaCBncm91cHMgdHJpZ2dlcmVkIHRoZSBtYXRjaC5cblxuICAgIFRoZSBtYXRjaCBvYmplY3QgaXRzZWxmICh0aGUgcmVzdWx0IG9mIGBSZWdleC5leGVjYCkgaXMgcmV0dXJuZWQgYnV0IGFsc29cbiAgICBlbmhhbmNlZCBieSBtZXJnaW5nIGluIGFueSBtZXRhLWRhdGEgdGhhdCB3YXMgcmVnaXN0ZXJlZCB3aXRoIHRoZSByZWdleC5cbiAgICBUaGlzIGlzIGhvdyB3ZSBrZWVwIHRyYWNrIG9mIHdoaWNoIG1vZGUgbWF0Y2hlZCwgYW5kIHdoYXQgdHlwZSBvZiBydWxlXG4gICAgKGBpbGxlZ2FsYCwgYGJlZ2luYCwgZW5kLCBldGMpLlxuICAqL1xuICBjbGFzcyBNdWx0aVJlZ2V4IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMubWF0Y2hJbmRleGVzID0ge307XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLnJlZ2V4ZXMgPSBbXTtcbiAgICAgIHRoaXMubWF0Y2hBdCA9IDE7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gMDtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYWRkUnVsZShyZSwgb3B0cykge1xuICAgICAgb3B0cy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24rKztcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMubWF0Y2hJbmRleGVzW3RoaXMubWF0Y2hBdF0gPSBvcHRzO1xuICAgICAgdGhpcy5yZWdleGVzLnB1c2goW29wdHMsIHJlXSk7XG4gICAgICB0aGlzLm1hdGNoQXQgKz0gY291bnRNYXRjaEdyb3VwcyhyZSkgKyAxO1xuICAgIH1cblxuICAgIGNvbXBpbGUoKSB7XG4gICAgICBpZiAodGhpcy5yZWdleGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBhdm9pZHMgdGhlIG5lZWQgdG8gY2hlY2sgbGVuZ3RoIGV2ZXJ5IHRpbWUgZXhlYyBpcyBjYWxsZWRcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLmV4ZWMgPSAoKSA9PiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgdGVybWluYXRvcnMgPSB0aGlzLnJlZ2V4ZXMubWFwKGVsID0+IGVsWzFdKTtcbiAgICAgIHRoaXMubWF0Y2hlclJlID0gbGFuZ1JlKF9yZXdyaXRlQmFja3JlZmVyZW5jZXModGVybWluYXRvcnMsIHsgam9pbldpdGg6ICd8JyB9KSwgdHJ1ZSk7XG4gICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBzICovXG4gICAgZXhlYyhzKSB7XG4gICAgICB0aGlzLm1hdGNoZXJSZS5sYXN0SW5kZXggPSB0aGlzLmxhc3RJbmRleDtcbiAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5tYXRjaGVyUmUuZXhlYyhzKTtcbiAgICAgIGlmICghbWF0Y2gpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICAgICAgY29uc3QgaSA9IG1hdGNoLmZpbmRJbmRleCgoZWwsIGkpID0+IGkgPiAwICYmIGVsICE9PSB1bmRlZmluZWQpO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgbWF0Y2hEYXRhID0gdGhpcy5tYXRjaEluZGV4ZXNbaV07XG4gICAgICAvLyB0cmltIG9mZiBhbnkgZWFybGllciBub24tcmVsZXZhbnQgbWF0Y2ggZ3JvdXBzIChpZSwgdGhlIG90aGVyIHJlZ2V4XG4gICAgICAvLyBtYXRjaCBncm91cHMgdGhhdCBtYWtlIHVwIHRoZSBtdWx0aS1tYXRjaGVyKVxuICAgICAgbWF0Y2guc3BsaWNlKDAsIGkpO1xuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihtYXRjaCwgbWF0Y2hEYXRhKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgIENyZWF0ZWQgdG8gc29sdmUgdGhlIGtleSBkZWZpY2llbnRseSB3aXRoIE11bHRpUmVnZXggLSB0aGVyZSBpcyBubyB3YXkgdG9cbiAgICB0ZXN0IGZvciBtdWx0aXBsZSBtYXRjaGVzIGF0IGEgc2luZ2xlIGxvY2F0aW9uLiAgV2h5IHdvdWxkIHdlIG5lZWQgdG8gZG9cbiAgICB0aGF0PyAgSW4gdGhlIGZ1dHVyZSBhIG1vcmUgZHluYW1pYyBlbmdpbmUgd2lsbCBhbGxvdyBjZXJ0YWluIG1hdGNoZXMgdG8gYmVcbiAgICBpZ25vcmVkLiAgQW4gZXhhbXBsZTogaWYgd2UgbWF0Y2hlZCBzYXkgdGhlIDNyZCByZWdleCBpbiBhIGxhcmdlIGdyb3VwIGJ1dFxuICAgIGRlY2lkZWQgdG8gaWdub3JlIGl0IC0gd2UnZCBuZWVkIHRvIHN0YXJ0ZWQgdGVzdGluZyBhZ2FpbiBhdCB0aGUgNHRoXG4gICAgcmVnZXguLi4gYnV0IE11bHRpUmVnZXggaXRzZWxmIGdpdmVzIHVzIG5vIHJlYWwgd2F5IHRvIGRvIHRoYXQuXG5cbiAgICBTbyB3aGF0IHRoaXMgY2xhc3MgY3JlYXRlcyBNdWx0aVJlZ2V4cyBvbiB0aGUgZmx5IGZvciB3aGF0ZXZlciBzZWFyY2hcbiAgICBwb3NpdGlvbiB0aGV5IGFyZSBuZWVkZWQuXG5cbiAgICBOT1RFOiBUaGVzZSBhZGRpdGlvbmFsIE11bHRpUmVnZXggb2JqZWN0cyBhcmUgY3JlYXRlZCBkeW5hbWljYWxseS4gIEZvciBtb3N0XG4gICAgZ3JhbW1hcnMgbW9zdCBvZiB0aGUgdGltZSB3ZSB3aWxsIG5ldmVyIGFjdHVhbGx5IG5lZWQgYW55dGhpbmcgbW9yZSB0aGFuIHRoZVxuICAgIGZpcnN0IE11bHRpUmVnZXggLSBzbyB0aGlzIHNob3VsZG4ndCBoYXZlIHRvbyBtdWNoIG92ZXJoZWFkLlxuXG4gICAgU2F5IHRoaXMgaXMgb3VyIHNlYXJjaCBncm91cCwgYW5kIHdlIG1hdGNoIHJlZ2V4MywgYnV0IHdpc2ggdG8gaWdub3JlIGl0LlxuXG4gICAgICByZWdleDEgfCByZWdleDIgfCByZWdleDMgfCByZWdleDQgfCByZWdleDUgICAgJyBpZSwgc3RhcnRBdCA9IDBcblxuICAgIFdoYXQgd2UgbmVlZCBpcyBhIG5ldyBNdWx0aVJlZ2V4IHRoYXQgb25seSBpbmNsdWRlcyB0aGUgcmVtYWluaW5nXG4gICAgcG9zc2liaWxpdGllczpcblxuICAgICAgcmVnZXg0IHwgcmVnZXg1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgaWUsIHN0YXJ0QXQgPSAzXG5cbiAgICBUaGlzIGNsYXNzIHdyYXBzIGFsbCB0aGF0IGNvbXBsZXhpdHkgdXAgaW4gYSBzaW1wbGUgQVBJLi4uIGBzdGFydEF0YCBkZWNpZGVzXG4gICAgd2hlcmUgaW4gdGhlIGFycmF5IG9mIGV4cHJlc3Npb25zIHRvIHN0YXJ0IGRvaW5nIHRoZSBtYXRjaGluZy4gSXRcbiAgICBhdXRvLWluY3JlbWVudHMsIHNvIGlmIGEgbWF0Y2ggaXMgZm91bmQgYXQgcG9zaXRpb24gMiwgdGhlbiBzdGFydEF0IHdpbGwgYmVcbiAgICBzZXQgdG8gMy4gIElmIHRoZSBlbmQgaXMgcmVhY2hlZCBzdGFydEF0IHdpbGwgcmV0dXJuIHRvIDAuXG5cbiAgICBNT1NUIG9mIHRoZSB0aW1lIHRoZSBwYXJzZXIgd2lsbCBiZSBzZXR0aW5nIHN0YXJ0QXQgbWFudWFsbHkgdG8gMC5cbiAgKi9cbiAgY2xhc3MgUmVzdW1hYmxlTXVsdGlSZWdleCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLnJ1bGVzID0gW107XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLm11bHRpUmVnZXhlcyA9IFtdO1xuICAgICAgdGhpcy5jb3VudCA9IDA7XG5cbiAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcbiAgICAgIHRoaXMucmVnZXhJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGdldE1hdGNoZXIoaW5kZXgpIHtcbiAgICAgIGlmICh0aGlzLm11bHRpUmVnZXhlc1tpbmRleF0pIHJldHVybiB0aGlzLm11bHRpUmVnZXhlc1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG1hdGNoZXIgPSBuZXcgTXVsdGlSZWdleCgpO1xuICAgICAgdGhpcy5ydWxlcy5zbGljZShpbmRleCkuZm9yRWFjaCgoW3JlLCBvcHRzXSkgPT4gbWF0Y2hlci5hZGRSdWxlKHJlLCBvcHRzKSk7XG4gICAgICBtYXRjaGVyLmNvbXBpbGUoKTtcbiAgICAgIHRoaXMubXVsdGlSZWdleGVzW2luZGV4XSA9IG1hdGNoZXI7XG4gICAgICByZXR1cm4gbWF0Y2hlcjtcbiAgICB9XG5cbiAgICByZXN1bWluZ1NjYW5BdFNhbWVQb3NpdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZ2V4SW5kZXggIT09IDA7XG4gICAgfVxuXG4gICAgY29uc2lkZXJBbGwoKSB7XG4gICAgICB0aGlzLnJlZ2V4SW5kZXggPSAwO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhZGRSdWxlKHJlLCBvcHRzKSB7XG4gICAgICB0aGlzLnJ1bGVzLnB1c2goW3JlLCBvcHRzXSk7XG4gICAgICBpZiAob3B0cy50eXBlID09PSBcImJlZ2luXCIpIHRoaXMuY291bnQrKztcbiAgICB9XG5cbiAgICAvKiogQHBhcmFtIHtzdHJpbmd9IHMgKi9cbiAgICBleGVjKHMpIHtcbiAgICAgIGNvbnN0IG0gPSB0aGlzLmdldE1hdGNoZXIodGhpcy5yZWdleEluZGV4KTtcbiAgICAgIG0ubGFzdEluZGV4ID0gdGhpcy5sYXN0SW5kZXg7XG4gICAgICBsZXQgcmVzdWx0ID0gbS5leGVjKHMpO1xuXG4gICAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGJlY2F1c2Ugd2UgaGF2ZSBubyBlYXN5IHdheSB0byBzYXkgXCJyZXN1bWUgc2Nhbm5pbmcgYXQgdGhlXG4gICAgICAvLyBleGlzdGluZyBwb3NpdGlvbiBidXQgYWxzbyBza2lwIHRoZSBjdXJyZW50IHJ1bGUgT05MWVwiLiBXaGF0IGhhcHBlbnMgaXNcbiAgICAgIC8vIGFsbCBwcmlvciBydWxlcyBhcmUgYWxzbyBza2lwcGVkIHdoaWNoIGNhbiByZXN1bHQgaW4gbWF0Y2hpbmcgdGhlIHdyb25nXG4gICAgICAvLyB0aGluZy4gRXhhbXBsZSBvZiBtYXRjaGluZyBcImJvb2dlclwiOlxuXG4gICAgICAvLyBvdXIgbWF0Y2hlciBpcyBbc3RyaW5nLCBcImJvb2dlclwiLCBudW1iZXJdXG4gICAgICAvL1xuICAgICAgLy8gLi4uLmJvb2dlci4uLi5cblxuICAgICAgLy8gaWYgXCJib29nZXJcIiBpcyBpZ25vcmVkIHRoZW4gd2UnZCByZWFsbHkgbmVlZCBhIHJlZ2V4IHRvIHNjYW4gZnJvbSB0aGVcbiAgICAgIC8vIFNBTUUgcG9zaXRpb24gZm9yIG9ubHk6IFtzdHJpbmcsIG51bWJlcl0gYnV0IGlnbm9yaW5nIFwiYm9vZ2VyXCIgKGlmIGl0XG4gICAgICAvLyB3YXMgdGhlIGZpcnN0IG1hdGNoKSwgYSBzaW1wbGUgcmVzdW1lIHdvdWxkIHNjYW4gYWhlYWQgd2hvIGtub3dzIGhvd1xuICAgICAgLy8gZmFyIGxvb2tpbmcgb25seSBmb3IgXCJudW1iZXJcIiwgaWdub3JpbmcgcG90ZW50aWFsIHN0cmluZyBtYXRjaGVzIChvclxuICAgICAgLy8gZnV0dXJlIFwiYm9vZ2VyXCIgbWF0Y2hlcyB0aGF0IG1pZ2h0IGJlIHZhbGlkLilcblxuICAgICAgLy8gU28gd2hhdCB3ZSBkbzogV2UgZXhlY3V0ZSB0d28gbWF0Y2hlcnMsIG9uZSByZXN1bWluZyBhdCB0aGUgc2FtZVxuICAgICAgLy8gcG9zaXRpb24sIGJ1dCB0aGUgc2Vjb25kIGZ1bGwgbWF0Y2hlciBzdGFydGluZyBhdCB0aGUgcG9zaXRpb24gYWZ0ZXI6XG5cbiAgICAgIC8vICAgICAvLS0tIHJlc3VtZSBmaXJzdCByZWdleCBtYXRjaCBoZXJlIChmb3IgW251bWJlcl0pXG4gICAgICAvLyAgICAgfC8tLS0tIGZ1bGwgbWF0Y2ggaGVyZSBmb3IgW3N0cmluZywgXCJib29nZXJcIiwgbnVtYmVyXVxuICAgICAgLy8gICAgIHZ2XG4gICAgICAvLyAuLi4uYm9vZ2VyLi4uLlxuXG4gICAgICAvLyBXaGljaCBldmVyIHJlc3VsdHMgaW4gYSBtYXRjaCBmaXJzdCBpcyB0aGVuIHVzZWQuIFNvIHRoaXMgMy00IHN0ZXBcbiAgICAgIC8vIHByb2Nlc3MgZXNzZW50aWFsbHkgYWxsb3dzIHVzIHRvIHNheSBcIm1hdGNoIGF0IHRoaXMgcG9zaXRpb24sIGV4Y2x1ZGluZ1xuICAgICAgLy8gYSBwcmlvciBydWxlIHRoYXQgd2FzIGlnbm9yZWRcIi5cbiAgICAgIC8vXG4gICAgICAvLyAxLiBNYXRjaCBcImJvb2dlclwiIGZpcnN0LCBpZ25vcmUuIEFsc28gcHJvdmVzIHRoYXQgW3N0cmluZ10gZG9lcyBub24gbWF0Y2guXG4gICAgICAvLyAyLiBSZXN1bWUgbWF0Y2hpbmcgZm9yIFtudW1iZXJdXG4gICAgICAvLyAzLiBNYXRjaCBhdCBpbmRleCArIDEgZm9yIFtzdHJpbmcsIFwiYm9vZ2VyXCIsIG51bWJlcl1cbiAgICAgIC8vIDQuIElmICMyIGFuZCAjMyByZXN1bHQgaW4gbWF0Y2hlcywgd2hpY2ggY2FtZSBmaXJzdD9cbiAgICAgIGlmICh0aGlzLnJlc3VtaW5nU2NhbkF0U2FtZVBvc2l0aW9uKCkpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuaW5kZXggPT09IHRoaXMubGFzdEluZGV4KSA7IGVsc2UgeyAvLyB1c2UgdGhlIHNlY29uZCBtYXRjaGVyIHJlc3VsdFxuICAgICAgICAgIGNvbnN0IG0yID0gdGhpcy5nZXRNYXRjaGVyKDApO1xuICAgICAgICAgIG0yLmxhc3RJbmRleCA9IHRoaXMubGFzdEluZGV4ICsgMTtcbiAgICAgICAgICByZXN1bHQgPSBtMi5leGVjKHMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy5yZWdleEluZGV4ICs9IHJlc3VsdC5wb3NpdGlvbiArIDE7XG4gICAgICAgIGlmICh0aGlzLnJlZ2V4SW5kZXggPT09IHRoaXMuY291bnQpIHtcbiAgICAgICAgICAvLyB3cmFwLWFyb3VuZCB0byBjb25zaWRlcmluZyBhbGwgbWF0Y2hlcyBhZ2FpblxuICAgICAgICAgIHRoaXMuY29uc2lkZXJBbGwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIG1vZGUsIGJ1aWxkcyBhIGh1Z2UgUmVzdW1hYmxlTXVsdGlSZWdleCB0aGF0IGNhbiBiZSB1c2VkIHRvIHdhbGtcbiAgICogdGhlIGNvbnRlbnQgYW5kIGZpbmQgbWF0Y2hlcy5cbiAgICpcbiAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAgICogQHJldHVybnMge1Jlc3VtYWJsZU11bHRpUmVnZXh9XG4gICAqL1xuICBmdW5jdGlvbiBidWlsZE1vZGVSZWdleChtb2RlKSB7XG4gICAgY29uc3QgbW0gPSBuZXcgUmVzdW1hYmxlTXVsdGlSZWdleCgpO1xuXG4gICAgbW9kZS5jb250YWlucy5mb3JFYWNoKHRlcm0gPT4gbW0uYWRkUnVsZSh0ZXJtLmJlZ2luLCB7IHJ1bGU6IHRlcm0sIHR5cGU6IFwiYmVnaW5cIiB9KSk7XG5cbiAgICBpZiAobW9kZS50ZXJtaW5hdG9yRW5kKSB7XG4gICAgICBtbS5hZGRSdWxlKG1vZGUudGVybWluYXRvckVuZCwgeyB0eXBlOiBcImVuZFwiIH0pO1xuICAgIH1cbiAgICBpZiAobW9kZS5pbGxlZ2FsKSB7XG4gICAgICBtbS5hZGRSdWxlKG1vZGUuaWxsZWdhbCwgeyB0eXBlOiBcImlsbGVnYWxcIiB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW07XG4gIH1cblxuICAvKiogc2tpcCB2cyBhYm9ydCB2cyBpZ25vcmVcbiAgICpcbiAgICogQHNraXAgICAtIFRoZSBtb2RlIGlzIHN0aWxsIGVudGVyZWQgYW5kIGV4aXRlZCBub3JtYWxseSAoYW5kIGNvbnRhaW5zIHJ1bGVzIGFwcGx5KSxcbiAgICogICAgICAgICAgIGJ1dCBhbGwgY29udGVudCBpcyBoZWxkIGFuZCBhZGRlZCB0byB0aGUgcGFyZW50IGJ1ZmZlciByYXRoZXIgdGhhbiBiZWluZ1xuICAgKiAgICAgICAgICAgb3V0cHV0IHdoZW4gdGhlIG1vZGUgZW5kcy4gIE1vc3RseSB1c2VkIHdpdGggYHN1Ymxhbmd1YWdlYCB0byBidWlsZCB1cFxuICAgKiAgICAgICAgICAgYSBzaW5nbGUgbGFyZ2UgYnVmZmVyIHRoYW4gY2FuIGJlIHBhcnNlZCBieSBzdWJsYW5ndWFnZS5cbiAgICpcbiAgICogICAgICAgICAgICAgLSBUaGUgbW9kZSBiZWdpbiBhbmRzIGVuZHMgbm9ybWFsbHkuXG4gICAqICAgICAgICAgICAgIC0gQ29udGVudCBtYXRjaGVkIGlzIGFkZGVkIHRvIHRoZSBwYXJlbnQgbW9kZSBidWZmZXIuXG4gICAqICAgICAgICAgICAgIC0gVGhlIHBhcnNlciBjdXJzb3IgaXMgbW92ZWQgZm9yd2FyZCBub3JtYWxseS5cbiAgICpcbiAgICogQGFib3J0ICAtIEEgaGFjayBwbGFjZWhvbGRlciB1bnRpbCB3ZSBoYXZlIGlnbm9yZS4gIEFib3J0cyB0aGUgbW9kZSAoYXMgaWYgaXRcbiAgICogICAgICAgICAgIG5ldmVyIG1hdGNoZWQpIGJ1dCBET0VTIE5PVCBjb250aW51ZSB0byBtYXRjaCBzdWJzZXF1ZW50IGBjb250YWluc2BcbiAgICogICAgICAgICAgIG1vZGVzLiAgQWJvcnQgaXMgYmFkL3N1Ym9wdGltYWwgYmVjYXVzZSBpdCBjYW4gcmVzdWx0IGluIG1vZGVzXG4gICAqICAgICAgICAgICBmYXJ0aGVyIGRvd24gbm90IGdldHRpbmcgYXBwbGllZCBiZWNhdXNlIGFuIGVhcmxpZXIgcnVsZSBlYXRzIHRoZVxuICAgKiAgICAgICAgICAgY29udGVudCBidXQgdGhlbiBhYm9ydHMuXG4gICAqXG4gICAqICAgICAgICAgICAgIC0gVGhlIG1vZGUgZG9lcyBub3QgYmVnaW4uXG4gICAqICAgICAgICAgICAgIC0gQ29udGVudCBtYXRjaGVkIGJ5IGBiZWdpbmAgaXMgYWRkZWQgdG8gdGhlIG1vZGUgYnVmZmVyLlxuICAgKiAgICAgICAgICAgICAtIFRoZSBwYXJzZXIgY3Vyc29yIGlzIG1vdmVkIGZvcndhcmQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBpZ25vcmUgLSBJZ25vcmVzIHRoZSBtb2RlIChhcyBpZiBpdCBuZXZlciBtYXRjaGVkKSBhbmQgY29udGludWVzIHRvIG1hdGNoIGFueVxuICAgKiAgICAgICAgICAgc3Vic2VxdWVudCBgY29udGFpbnNgIG1vZGVzLiAgSWdub3JlIGlzbid0IHRlY2huaWNhbGx5IHBvc3NpYmxlIHdpdGhcbiAgICogICAgICAgICAgIHRoZSBjdXJyZW50IHBhcnNlciBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogICAgICAgICAgICAgLSBUaGUgbW9kZSBkb2VzIG5vdCBiZWdpbi5cbiAgICogICAgICAgICAgICAgLSBDb250ZW50IG1hdGNoZWQgYnkgYGJlZ2luYCBpcyBpZ25vcmVkLlxuICAgKiAgICAgICAgICAgICAtIFRoZSBwYXJzZXIgY3Vyc29yIGlzIG5vdCBtb3ZlZCBmb3J3YXJkLlxuICAgKi9cblxuICAvKipcbiAgICogQ29tcGlsZXMgYW4gaW5kaXZpZHVhbCBtb2RlXG4gICAqXG4gICAqIFRoaXMgY2FuIHJhaXNlIGFuIGVycm9yIGlmIHRoZSBtb2RlIGNvbnRhaW5zIGNlcnRhaW4gZGV0ZWN0YWJsZSBrbm93biBsb2dpY1xuICAgKiBpc3N1ZXMuXG4gICAqIEBwYXJhbSB7TW9kZX0gbW9kZVxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZSB8IG51bGx9IFtwYXJlbnRdXG4gICAqIEByZXR1cm5zIHtDb21waWxlZE1vZGUgfCBuZXZlcn1cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBpbGVNb2RlKG1vZGUsIHBhcmVudCkge1xuICAgIGNvbnN0IGNtb2RlID0gLyoqIEB0eXBlIENvbXBpbGVkTW9kZSAqLyAobW9kZSk7XG4gICAgaWYgKG1vZGUuaXNDb21waWxlZCkgcmV0dXJuIGNtb2RlO1xuXG4gICAgW1xuICAgICAgc2NvcGVDbGFzc05hbWUsXG4gICAgICAvLyBkbyB0aGlzIGVhcmx5IHNvIGNvbXBpbGVyIGV4dGVuc2lvbnMgZ2VuZXJhbGx5IGRvbid0IGhhdmUgdG8gd29ycnkgYWJvdXRcbiAgICAgIC8vIHRoZSBkaXN0aW5jdGlvbiBiZXR3ZWVuIG1hdGNoL2JlZ2luXG4gICAgICBjb21waWxlTWF0Y2gsXG4gICAgICBNdWx0aUNsYXNzLFxuICAgICAgYmVmb3JlTWF0Y2hFeHRcbiAgICBdLmZvckVhY2goZXh0ID0+IGV4dChtb2RlLCBwYXJlbnQpKTtcblxuICAgIGxhbmd1YWdlLmNvbXBpbGVyRXh0ZW5zaW9ucy5mb3JFYWNoKGV4dCA9PiBleHQobW9kZSwgcGFyZW50KSk7XG5cbiAgICAvLyBfX2JlZm9yZUJlZ2luIGlzIGNvbnNpZGVyZWQgcHJpdmF0ZSBBUEksIGludGVybmFsIHVzZSBvbmx5XG4gICAgbW9kZS5fX2JlZm9yZUJlZ2luID0gbnVsbDtcblxuICAgIFtcbiAgICAgIGJlZ2luS2V5d29yZHMsXG4gICAgICAvLyBkbyB0aGlzIGxhdGVyIHNvIGNvbXBpbGVyIGV4dGVuc2lvbnMgdGhhdCBjb21lIGVhcmxpZXIgaGF2ZSBhY2Nlc3MgdG8gdGhlXG4gICAgICAvLyByYXcgYXJyYXkgaWYgdGhleSB3YW50ZWQgdG8gcGVyaGFwcyBtYW5pcHVsYXRlIGl0LCBldGMuXG4gICAgICBjb21waWxlSWxsZWdhbCxcbiAgICAgIC8vIGRlZmF1bHQgdG8gMSByZWxldmFuY2UgaWYgbm90IHNwZWNpZmllZFxuICAgICAgY29tcGlsZVJlbGV2YW5jZVxuICAgIF0uZm9yRWFjaChleHQgPT4gZXh0KG1vZGUsIHBhcmVudCkpO1xuXG4gICAgbW9kZS5pc0NvbXBpbGVkID0gdHJ1ZTtcblxuICAgIGxldCBrZXl3b3JkUGF0dGVybiA9IG51bGw7XG4gICAgaWYgKHR5cGVvZiBtb2RlLmtleXdvcmRzID09PSBcIm9iamVjdFwiICYmIG1vZGUua2V5d29yZHMuJHBhdHRlcm4pIHtcbiAgICAgIC8vIHdlIG5lZWQgYSBjb3B5IGJlY2F1c2Uga2V5d29yZHMgbWlnaHQgYmUgY29tcGlsZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgIC8vIHNvIHdlIGNhbid0IGdvIGRlbGV0aW5nICRwYXR0ZXJuIGZyb20gdGhlIG9yaWdpbmFsIG9uIHRoZSBmaXJzdFxuICAgICAgLy8gcGFzc1xuICAgICAgbW9kZS5rZXl3b3JkcyA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGUua2V5d29yZHMpO1xuICAgICAga2V5d29yZFBhdHRlcm4gPSBtb2RlLmtleXdvcmRzLiRwYXR0ZXJuO1xuICAgICAgZGVsZXRlIG1vZGUua2V5d29yZHMuJHBhdHRlcm47XG4gICAgfVxuICAgIGtleXdvcmRQYXR0ZXJuID0ga2V5d29yZFBhdHRlcm4gfHwgL1xcdysvO1xuXG4gICAgaWYgKG1vZGUua2V5d29yZHMpIHtcbiAgICAgIG1vZGUua2V5d29yZHMgPSBjb21waWxlS2V5d29yZHMobW9kZS5rZXl3b3JkcywgbGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSk7XG4gICAgfVxuXG4gICAgY21vZGUua2V5d29yZFBhdHRlcm5SZSA9IGxhbmdSZShrZXl3b3JkUGF0dGVybiwgdHJ1ZSk7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBpZiAoIW1vZGUuYmVnaW4pIG1vZGUuYmVnaW4gPSAvXFxCfFxcYi87XG4gICAgICBjbW9kZS5iZWdpblJlID0gbGFuZ1JlKGNtb2RlLmJlZ2luKTtcbiAgICAgIGlmICghbW9kZS5lbmQgJiYgIW1vZGUuZW5kc1dpdGhQYXJlbnQpIG1vZGUuZW5kID0gL1xcQnxcXGIvO1xuICAgICAgaWYgKG1vZGUuZW5kKSBjbW9kZS5lbmRSZSA9IGxhbmdSZShjbW9kZS5lbmQpO1xuICAgICAgY21vZGUudGVybWluYXRvckVuZCA9IHNvdXJjZShjbW9kZS5lbmQpIHx8ICcnO1xuICAgICAgaWYgKG1vZGUuZW5kc1dpdGhQYXJlbnQgJiYgcGFyZW50LnRlcm1pbmF0b3JFbmQpIHtcbiAgICAgICAgY21vZGUudGVybWluYXRvckVuZCArPSAobW9kZS5lbmQgPyAnfCcgOiAnJykgKyBwYXJlbnQudGVybWluYXRvckVuZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1vZGUuaWxsZWdhbCkgY21vZGUuaWxsZWdhbFJlID0gbGFuZ1JlKC8qKiBAdHlwZSB7UmVnRXhwIHwgc3RyaW5nfSAqLyAobW9kZS5pbGxlZ2FsKSk7XG4gICAgaWYgKCFtb2RlLmNvbnRhaW5zKSBtb2RlLmNvbnRhaW5zID0gW107XG5cbiAgICBtb2RlLmNvbnRhaW5zID0gW10uY29uY2F0KC4uLm1vZGUuY29udGFpbnMubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgIHJldHVybiBleHBhbmRPckNsb25lTW9kZShjID09PSAnc2VsZicgPyBtb2RlIDogYyk7XG4gICAgfSkpO1xuICAgIG1vZGUuY29udGFpbnMuZm9yRWFjaChmdW5jdGlvbihjKSB7IGNvbXBpbGVNb2RlKC8qKiBAdHlwZSBNb2RlICovIChjKSwgY21vZGUpOyB9KTtcblxuICAgIGlmIChtb2RlLnN0YXJ0cykge1xuICAgICAgY29tcGlsZU1vZGUobW9kZS5zdGFydHMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgY21vZGUubWF0Y2hlciA9IGJ1aWxkTW9kZVJlZ2V4KGNtb2RlKTtcbiAgICByZXR1cm4gY21vZGU7XG4gIH1cblxuICBpZiAoIWxhbmd1YWdlLmNvbXBpbGVyRXh0ZW5zaW9ucykgbGFuZ3VhZ2UuY29tcGlsZXJFeHRlbnNpb25zID0gW107XG5cbiAgLy8gc2VsZiBpcyBub3QgdmFsaWQgYXQgdGhlIHRvcC1sZXZlbFxuICBpZiAobGFuZ3VhZ2UuY29udGFpbnMgJiYgbGFuZ3VhZ2UuY29udGFpbnMuaW5jbHVkZXMoJ3NlbGYnKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkVSUjogY29udGFpbnMgYHNlbGZgIGlzIG5vdCBzdXBwb3J0ZWQgYXQgdGhlIHRvcC1sZXZlbCBvZiBhIGxhbmd1YWdlLiAgU2VlIGRvY3VtZW50YXRpb24uXCIpO1xuICB9XG5cbiAgLy8gd2UgbmVlZCBhIG51bGwgb2JqZWN0LCB3aGljaCBpbmhlcml0IHdpbGwgZ3VhcmFudGVlXG4gIGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXMgPSBpbmhlcml0JDEobGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlcyB8fCB7fSk7XG5cbiAgcmV0dXJuIGNvbXBpbGVNb2RlKC8qKiBAdHlwZSBNb2RlICovIChsYW5ndWFnZSkpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgaWYgYSBtb2RlIGhhcyBhIGRlcGVuZGVuY3kgb24gaXQncyBwYXJlbnQgb3Igbm90XG4gKlxuICogSWYgYSBtb2RlIGRvZXMgaGF2ZSBhIHBhcmVudCBkZXBlbmRlbmN5IHRoZW4gb2Z0ZW4gd2UgbmVlZCB0byBjbG9uZSBpdCBpZlxuICogaXQncyB1c2VkIGluIG11bHRpcGxlIHBsYWNlcyBzbyB0aGF0IGVhY2ggY29weSBwb2ludHMgdG8gdGhlIGNvcnJlY3QgcGFyZW50LFxuICogd2hlcmUtYXMgbW9kZXMgd2l0aG91dCBhIHBhcmVudCBjYW4gb2Z0ZW4gc2FmZWx5IGJlIHJlLXVzZWQgYXQgdGhlIGJvdHRvbSBvZlxuICogYSBtb2RlIGNoYWluLlxuICpcbiAqIEBwYXJhbSB7TW9kZSB8IG51bGx9IG1vZGVcbiAqIEByZXR1cm5zIHtib29sZWFufSAtIGlzIHRoZXJlIGEgZGVwZW5kZW5jeSBvbiB0aGUgcGFyZW50P1xuICogKi9cbmZ1bmN0aW9uIGRlcGVuZGVuY3lPblBhcmVudChtb2RlKSB7XG4gIGlmICghbW9kZSkgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBtb2RlLmVuZHNXaXRoUGFyZW50IHx8IGRlcGVuZGVuY3lPblBhcmVudChtb2RlLnN0YXJ0cyk7XG59XG5cbi8qKlxuICogRXhwYW5kcyBhIG1vZGUgb3IgY2xvbmVzIGl0IGlmIG5lY2Vzc2FyeVxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBtb2RlcyB3aXRoIHBhcmVudGFsIGRlcGVuZGVuY2VpcyAoc2VlIG5vdGVzIG9uXG4gKiBgZGVwZW5kZW5jeU9uUGFyZW50YCkgYW5kIGZvciBub2RlcyB0aGF0IGhhdmUgYHZhcmlhbnRzYCAtIHdoaWNoIG11c3QgdGhlbiBiZVxuICogZXhwbG9kZWQgaW50byB0aGVpciBvd24gaW5kaXZpZHVhbCBtb2RlcyBhdCBjb21waWxlIHRpbWUuXG4gKlxuICogQHBhcmFtIHtNb2RlfSBtb2RlXG4gKiBAcmV0dXJucyB7TW9kZSB8IE1vZGVbXX1cbiAqICovXG5mdW5jdGlvbiBleHBhbmRPckNsb25lTW9kZShtb2RlKSB7XG4gIGlmIChtb2RlLnZhcmlhbnRzICYmICFtb2RlLmNhY2hlZFZhcmlhbnRzKSB7XG4gICAgbW9kZS5jYWNoZWRWYXJpYW50cyA9IG1vZGUudmFyaWFudHMubWFwKGZ1bmN0aW9uKHZhcmlhbnQpIHtcbiAgICAgIHJldHVybiBpbmhlcml0JDEobW9kZSwgeyB2YXJpYW50czogbnVsbCB9LCB2YXJpYW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEVYUEFORFxuICAvLyBpZiB3ZSBoYXZlIHZhcmlhbnRzIHRoZW4gZXNzZW50aWFsbHkgXCJyZXBsYWNlXCIgdGhlIG1vZGUgd2l0aCB0aGUgdmFyaWFudHNcbiAgLy8gdGhpcyBoYXBwZW5zIGluIGNvbXBpbGVNb2RlLCB3aGVyZSB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBmcm9tXG4gIGlmIChtb2RlLmNhY2hlZFZhcmlhbnRzKSB7XG4gICAgcmV0dXJuIG1vZGUuY2FjaGVkVmFyaWFudHM7XG4gIH1cblxuICAvLyBDTE9ORVxuICAvLyBpZiB3ZSBoYXZlIGRlcGVuZGVuY2llcyBvbiBwYXJlbnRzIHRoZW4gd2UgbmVlZCBhIHVuaXF1ZVxuICAvLyBpbnN0YW5jZSBvZiBvdXJzZWx2ZXMsIHNvIHdlIGNhbiBiZSByZXVzZWQgd2l0aCBtYW55XG4gIC8vIGRpZmZlcmVudCBwYXJlbnRzIHdpdGhvdXQgaXNzdWVcbiAgaWYgKGRlcGVuZGVuY3lPblBhcmVudChtb2RlKSkge1xuICAgIHJldHVybiBpbmhlcml0JDEobW9kZSwgeyBzdGFydHM6IG1vZGUuc3RhcnRzID8gaW5oZXJpdCQxKG1vZGUuc3RhcnRzKSA6IG51bGwgfSk7XG4gIH1cblxuICBpZiAoT2JqZWN0LmlzRnJvemVuKG1vZGUpKSB7XG4gICAgcmV0dXJuIGluaGVyaXQkMShtb2RlKTtcbiAgfVxuXG4gIC8vIG5vIHNwZWNpYWwgZGVwZW5kZW5jeSBpc3N1ZXMsIGp1c3QgcmV0dXJuIG91cnNlbHZlc1xuICByZXR1cm4gbW9kZTtcbn1cblxudmFyIHZlcnNpb24gPSBcIjExLjYuMFwiO1xuXG5jbGFzcyBIVE1MSW5qZWN0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHJlYXNvbiwgaHRtbCkge1xuICAgIHN1cGVyKHJlYXNvbik7XG4gICAgdGhpcy5uYW1lID0gXCJIVE1MSW5qZWN0aW9uRXJyb3JcIjtcbiAgICB0aGlzLmh0bWwgPSBodG1sO1xuICB9XG59XG5cbi8qXG5TeW50YXggaGlnaGxpZ2h0aW5nIHdpdGggbGFuZ3VhZ2UgYXV0b2RldGVjdGlvbi5cbmh0dHBzOi8vaGlnaGxpZ2h0anMub3JnL1xuKi9cblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Nb2RlfSBNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRTY29wZX0gQ29tcGlsZWRTY29wZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2V9IExhbmd1YWdlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTQXBpfSBITEpTQXBpXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTUGx1Z2lufSBITEpTUGx1Z2luXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5QbHVnaW5FdmVudH0gUGx1Z2luRXZlbnRcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhMSlNPcHRpb25zfSBITEpTT3B0aW9uc1xuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2VGbn0gTGFuZ3VhZ2VGblxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSGlnaGxpZ2h0ZWRIVE1MRWxlbWVudH0gSGlnaGxpZ2h0ZWRIVE1MRWxlbWVudFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQmVmb3JlSGlnaGxpZ2h0Q29udGV4dH0gQmVmb3JlSGlnaGxpZ2h0Q29udGV4dFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5NYXRjaFR5cGV9IE1hdGNoVHlwZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5LZXl3b3JkRGF0YX0gS2V5d29yZERhdGFcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcy9wcml2YXRlJykuRW5oYW5jZWRNYXRjaH0gRW5oYW5jZWRNYXRjaFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5Bbm5vdGF0ZWRFcnJvcn0gQW5ub3RhdGVkRXJyb3JcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkF1dG9IaWdobGlnaHRSZXN1bHR9IEF1dG9IaWdobGlnaHRSZXN1bHRcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhpZ2hsaWdodE9wdGlvbnN9IEhpZ2hsaWdodE9wdGlvbnNcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhpZ2hsaWdodFJlc3VsdH0gSGlnaGxpZ2h0UmVzdWx0XG4qL1xuXG5cbmNvbnN0IGVzY2FwZSA9IGVzY2FwZUhUTUw7XG5jb25zdCBpbmhlcml0ID0gaW5oZXJpdCQxO1xuY29uc3QgTk9fTUFUQ0ggPSBTeW1ib2woXCJub21hdGNoXCIpO1xuY29uc3QgTUFYX0tFWVdPUkRfSElUUyA9IDc7XG5cbi8qKlxuICogQHBhcmFtIHthbnl9IGhsanMgLSBvYmplY3QgdGhhdCBpcyBleHRlbmRlZCAobGVnYWN5KVxuICogQHJldHVybnMge0hMSlNBcGl9XG4gKi9cbmNvbnN0IEhMSlMgPSBmdW5jdGlvbihobGpzKSB7XG4gIC8vIEdsb2JhbCBpbnRlcm5hbCB2YXJpYWJsZXMgdXNlZCB3aXRoaW4gdGhlIGhpZ2hsaWdodC5qcyBsaWJyYXJ5LlxuICAvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIExhbmd1YWdlPn0gKi9cbiAgY29uc3QgbGFuZ3VhZ2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuICBjb25zdCBhbGlhc2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLyoqIEB0eXBlIHtITEpTUGx1Z2luW119ICovXG4gIGNvbnN0IHBsdWdpbnMgPSBbXTtcblxuICAvLyBzYWZlL3Byb2R1Y3Rpb24gbW9kZSAtIHN3YWxsb3dzIG1vcmUgZXJyb3JzLCB0cmllcyB0byBrZWVwIHJ1bm5pbmdcbiAgLy8gZXZlbiBpZiBhIHNpbmdsZSBzeW50YXggb3IgcGFyc2UgaGl0cyBhIGZhdGFsIGVycm9yXG4gIGxldCBTQUZFX01PREUgPSB0cnVlO1xuICBjb25zdCBMQU5HVUFHRV9OT1RfRk9VTkQgPSBcIkNvdWxkIG5vdCBmaW5kIHRoZSBsYW5ndWFnZSAne30nLCBkaWQgeW91IGZvcmdldCB0byBsb2FkL2luY2x1ZGUgYSBsYW5ndWFnZSBtb2R1bGU/XCI7XG4gIC8qKiBAdHlwZSB7TGFuZ3VhZ2V9ICovXG4gIGNvbnN0IFBMQUlOVEVYVF9MQU5HVUFHRSA9IHsgZGlzYWJsZUF1dG9kZXRlY3Q6IHRydWUsIG5hbWU6ICdQbGFpbiB0ZXh0JywgY29udGFpbnM6IFtdIH07XG5cbiAgLy8gR2xvYmFsIG9wdGlvbnMgdXNlZCB3aGVuIHdpdGhpbiBleHRlcm5hbCBBUElzLiBUaGlzIGlzIG1vZGlmaWVkIHdoZW5cbiAgLy8gY2FsbGluZyB0aGUgYGhsanMuY29uZmlndXJlYCBmdW5jdGlvbi5cbiAgLyoqIEB0eXBlIEhMSlNPcHRpb25zICovXG4gIGxldCBvcHRpb25zID0ge1xuICAgIGlnbm9yZVVuZXNjYXBlZEhUTUw6IGZhbHNlLFxuICAgIHRocm93VW5lc2NhcGVkSFRNTDogZmFsc2UsXG4gICAgbm9IaWdobGlnaHRSZTogL14obm8tP2hpZ2hsaWdodCkkL2ksXG4gICAgbGFuZ3VhZ2VEZXRlY3RSZTogL1xcYmxhbmcoPzp1YWdlKT8tKFtcXHctXSspXFxiL2ksXG4gICAgY2xhc3NQcmVmaXg6ICdobGpzLScsXG4gICAgY3NzU2VsZWN0b3I6ICdwcmUgY29kZScsXG4gICAgbGFuZ3VhZ2VzOiBudWxsLFxuICAgIC8vIGJldGEgY29uZmlndXJhdGlvbiBvcHRpb25zLCBzdWJqZWN0IHRvIGNoYW5nZSwgd2VsY29tZSB0byBkaXNjdXNzXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMTA4NlxuICAgIF9fZW1pdHRlcjogVG9rZW5UcmVlRW1pdHRlclxuICB9O1xuXG4gIC8qIFV0aWxpdHkgZnVuY3Rpb25zICovXG5cbiAgLyoqXG4gICAqIFRlc3RzIGEgbGFuZ3VhZ2UgbmFtZSB0byBzZWUgaWYgaGlnaGxpZ2h0aW5nIHNob3VsZCBiZSBza2lwcGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZU5hbWVcbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZE5vdEhpZ2hsaWdodChsYW5ndWFnZU5hbWUpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5ub0hpZ2hsaWdodFJlLnRlc3QobGFuZ3VhZ2VOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hpZ2hsaWdodGVkSFRNTEVsZW1lbnR9IGJsb2NrIC0gdGhlIEhUTUwgZWxlbWVudCB0byBkZXRlcm1pbmUgbGFuZ3VhZ2UgZm9yXG4gICAqL1xuICBmdW5jdGlvbiBibG9ja0xhbmd1YWdlKGJsb2NrKSB7XG4gICAgbGV0IGNsYXNzZXMgPSBibG9jay5jbGFzc05hbWUgKyAnICc7XG5cbiAgICBjbGFzc2VzICs9IGJsb2NrLnBhcmVudE5vZGUgPyBibG9jay5wYXJlbnROb2RlLmNsYXNzTmFtZSA6ICcnO1xuXG4gICAgLy8gbGFuZ3VhZ2UtKiB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgbm9uLXByZWZpeGVkIGNsYXNzIG5hbWVzLlxuICAgIGNvbnN0IG1hdGNoID0gb3B0aW9ucy5sYW5ndWFnZURldGVjdFJlLmV4ZWMoY2xhc3Nlcyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCBsYW5ndWFnZSA9IGdldExhbmd1YWdlKG1hdGNoWzFdKTtcbiAgICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgICAgd2FybihMQU5HVUFHRV9OT1RfRk9VTkQucmVwbGFjZShcInt9XCIsIG1hdGNoWzFdKSk7XG4gICAgICAgIHdhcm4oXCJGYWxsaW5nIGJhY2sgdG8gbm8taGlnaGxpZ2h0IG1vZGUgZm9yIHRoaXMgYmxvY2suXCIsIGJsb2NrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsYW5ndWFnZSA/IG1hdGNoWzFdIDogJ25vLWhpZ2hsaWdodCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzZXNcbiAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAuZmluZCgoX2NsYXNzKSA9PiBzaG91bGROb3RIaWdobGlnaHQoX2NsYXNzKSB8fCBnZXRMYW5ndWFnZShfY2xhc3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JlIGhpZ2hsaWdodGluZyBmdW5jdGlvbi5cbiAgICpcbiAgICogT0xEIEFQSVxuICAgKiBoaWdobGlnaHQobGFuZywgY29kZSwgaWdub3JlSWxsZWdhbHMsIGNvbnRpbnVhdGlvbilcbiAgICpcbiAgICogTkVXIEFQSVxuICAgKiBoaWdobGlnaHQoY29kZSwge2xhbmcsIGlnbm9yZUlsbGVnYWxzfSlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGVPckxhbmd1YWdlTmFtZSAtIHRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIGhpZ2hsaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZyB8IEhpZ2hsaWdodE9wdGlvbnN9IG9wdGlvbnNPckNvZGUgLSB0aGUgY29kZSB0byBoaWdobGlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSBbaWdub3JlSWxsZWdhbHNdIC0gd2hldGhlciB0byBpZ25vcmUgaWxsZWdhbCBtYXRjaGVzLCBkZWZhdWx0IGlzIHRvIGJhaWxcbiAgICpcbiAgICogQHJldHVybnMge0hpZ2hsaWdodFJlc3VsdH0gUmVzdWx0IC0gYW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsYW5ndWFnZSAtIHRoZSBsYW5ndWFnZSBuYW1lXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWxldmFuY2UgLSB0aGUgcmVsZXZhbmNlIHNjb3JlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSBoaWdobGlnaHRlZCBIVE1MIGNvZGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGUgLSB0aGUgb3JpZ2luYWwgcmF3IGNvZGVcbiAgICogQHByb3BlcnR5IHtDb21waWxlZE1vZGV9IHRvcCAtIHRvcCBvZiB0aGUgY3VycmVudCBtb2RlIHN0YWNrXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaWxsZWdhbCAtIGluZGljYXRlcyB3aGV0aGVyIGFueSBpbGxlZ2FsIG1hdGNoZXMgd2VyZSBmb3VuZFxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHQoY29kZU9yTGFuZ3VhZ2VOYW1lLCBvcHRpb25zT3JDb2RlLCBpZ25vcmVJbGxlZ2Fscykge1xuICAgIGxldCBjb2RlID0gXCJcIjtcbiAgICBsZXQgbGFuZ3VhZ2VOYW1lID0gXCJcIjtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPckNvZGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGNvZGUgPSBjb2RlT3JMYW5ndWFnZU5hbWU7XG4gICAgICBpZ25vcmVJbGxlZ2FscyA9IG9wdGlvbnNPckNvZGUuaWdub3JlSWxsZWdhbHM7XG4gICAgICBsYW5ndWFnZU5hbWUgPSBvcHRpb25zT3JDb2RlLmxhbmd1YWdlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbGQgQVBJXG4gICAgICBkZXByZWNhdGVkKFwiMTAuNy4wXCIsIFwiaGlnaGxpZ2h0KGxhbmcsIGNvZGUsIC4uLmFyZ3MpIGhhcyBiZWVuIGRlcHJlY2F0ZWQuXCIpO1xuICAgICAgZGVwcmVjYXRlZChcIjEwLjcuMFwiLCBcIlBsZWFzZSB1c2UgaGlnaGxpZ2h0KGNvZGUsIG9wdGlvbnMpIGluc3RlYWQuXFxuaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjI3N1wiKTtcbiAgICAgIGxhbmd1YWdlTmFtZSA9IGNvZGVPckxhbmd1YWdlTmFtZTtcbiAgICAgIGNvZGUgPSBvcHRpb25zT3JDb2RlO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzMxNDlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgaWYgKGlnbm9yZUlsbGVnYWxzID09PSB1bmRlZmluZWQpIHsgaWdub3JlSWxsZWdhbHMgPSB0cnVlOyB9XG5cbiAgICAvKiogQHR5cGUge0JlZm9yZUhpZ2hsaWdodENvbnRleHR9ICovXG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2VOYW1lXG4gICAgfTtcbiAgICAvLyB0aGUgcGx1Z2luIGNhbiBjaGFuZ2UgdGhlIGRlc2lyZWQgbGFuZ3VhZ2Ugb3IgdGhlIGNvZGUgdG8gYmUgaGlnaGxpZ2h0ZWRcbiAgICAvLyBqdXN0IGJlIGNoYW5naW5nIHRoZSBvYmplY3QgaXQgd2FzIHBhc3NlZFxuICAgIGZpcmUoXCJiZWZvcmU6aGlnaGxpZ2h0XCIsIGNvbnRleHQpO1xuXG4gICAgLy8gYSBiZWZvcmUgcGx1Z2luIGNhbiB1c3VycCB0aGUgcmVzdWx0IGNvbXBsZXRlbHkgYnkgcHJvdmlkaW5nIGl0J3Mgb3duXG4gICAgLy8gaW4gd2hpY2ggY2FzZSB3ZSBkb24ndCBldmVuIG5lZWQgdG8gY2FsbCBoaWdobGlnaHRcbiAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LnJlc3VsdFxuICAgICAgPyBjb250ZXh0LnJlc3VsdFxuICAgICAgOiBfaGlnaGxpZ2h0KGNvbnRleHQubGFuZ3VhZ2UsIGNvbnRleHQuY29kZSwgaWdub3JlSWxsZWdhbHMpO1xuXG4gICAgcmVzdWx0LmNvZGUgPSBjb250ZXh0LmNvZGU7XG4gICAgLy8gdGhlIHBsdWdpbiBjYW4gY2hhbmdlIGFueXRoaW5nIGluIHJlc3VsdCB0byBzdWl0ZSBpdFxuICAgIGZpcmUoXCJhZnRlcjpoaWdobGlnaHRcIiwgcmVzdWx0KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogcHJpdmF0ZSBoaWdobGlnaHQgdGhhdCdzIHVzZWQgaW50ZXJuYWxseSBhbmQgZG9lcyBub3QgZmlyZSBjYWxsYmFja3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZSAtIHRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIGhpZ2hsaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZVRvSGlnaGxpZ2h0IC0gdGhlIGNvZGUgdG8gaGlnaGxpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbj99IFtpZ25vcmVJbGxlZ2Fsc10gLSB3aGV0aGVyIHRvIGlnbm9yZSBpbGxlZ2FsIG1hdGNoZXMsIGRlZmF1bHQgaXMgdG8gYmFpbFxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZT99IFtjb250aW51YXRpb25dIC0gY3VycmVudCBjb250aW51YXRpb24gbW9kZSwgaWYgYW55XG4gICAqIEByZXR1cm5zIHtIaWdobGlnaHRSZXN1bHR9IC0gcmVzdWx0IG9mIHRoZSBoaWdobGlnaHQgb3BlcmF0aW9uXG4gICovXG4gIGZ1bmN0aW9uIF9oaWdobGlnaHQobGFuZ3VhZ2VOYW1lLCBjb2RlVG9IaWdobGlnaHQsIGlnbm9yZUlsbGVnYWxzLCBjb250aW51YXRpb24pIHtcbiAgICBjb25zdCBrZXl3b3JkSGl0cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4ga2V5d29yZCBkYXRhIGlmIGEgbWF0Y2ggaXMgYSBrZXl3b3JkXG4gICAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGUgLSBjdXJyZW50IG1vZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hUZXh0IC0gdGhlIHRleHR1YWwgbWF0Y2hcbiAgICAgKiBAcmV0dXJucyB7S2V5d29yZERhdGEgfCBmYWxzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBrZXl3b3JkRGF0YShtb2RlLCBtYXRjaFRleHQpIHtcbiAgICAgIHJldHVybiBtb2RlLmtleXdvcmRzW21hdGNoVGV4dF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0tleXdvcmRzKCkge1xuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpIHtcbiAgICAgICAgZW1pdHRlci5hZGRUZXh0KG1vZGVCdWZmZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBsYXN0SW5kZXggPSAwO1xuICAgICAgdG9wLmtleXdvcmRQYXR0ZXJuUmUubGFzdEluZGV4ID0gMDtcbiAgICAgIGxldCBtYXRjaCA9IHRvcC5rZXl3b3JkUGF0dGVyblJlLmV4ZWMobW9kZUJ1ZmZlcik7XG4gICAgICBsZXQgYnVmID0gXCJcIjtcblxuICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIGJ1ZiArPSBtb2RlQnVmZmVyLnN1YnN0cmluZyhsYXN0SW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgY29uc3Qgd29yZCA9IGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyBtYXRjaFswXS50b0xvd2VyQ2FzZSgpIDogbWF0Y2hbMF07XG4gICAgICAgIGNvbnN0IGRhdGEgPSBrZXl3b3JkRGF0YSh0b3AsIHdvcmQpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnN0IFtraW5kLCBrZXl3b3JkUmVsZXZhbmNlXSA9IGRhdGE7XG4gICAgICAgICAgZW1pdHRlci5hZGRUZXh0KGJ1Zik7XG4gICAgICAgICAgYnVmID0gXCJcIjtcblxuICAgICAgICAgIGtleXdvcmRIaXRzW3dvcmRdID0gKGtleXdvcmRIaXRzW3dvcmRdIHx8IDApICsgMTtcbiAgICAgICAgICBpZiAoa2V5d29yZEhpdHNbd29yZF0gPD0gTUFYX0tFWVdPUkRfSElUUykgcmVsZXZhbmNlICs9IGtleXdvcmRSZWxldmFuY2U7XG4gICAgICAgICAgaWYgKGtpbmQuc3RhcnRzV2l0aChcIl9cIikpIHtcbiAgICAgICAgICAgIC8vIF8gaW1wbGllZCBmb3IgcmVsZXZhbmNlIG9ubHksIGRvIG5vdCBoaWdobGlnaHRcbiAgICAgICAgICAgIC8vIGJ5IGFwcGx5aW5nIGEgY2xhc3MgbmFtZVxuICAgICAgICAgICAgYnVmICs9IG1hdGNoWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjc3NDbGFzcyA9IGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXNba2luZF0gfHwga2luZDtcbiAgICAgICAgICAgIGVtaXR0ZXIuYWRkS2V5d29yZChtYXRjaFswXSwgY3NzQ2xhc3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWYgKz0gbWF0Y2hbMF07XG4gICAgICAgIH1cbiAgICAgICAgbGFzdEluZGV4ID0gdG9wLmtleXdvcmRQYXR0ZXJuUmUubGFzdEluZGV4O1xuICAgICAgICBtYXRjaCA9IHRvcC5rZXl3b3JkUGF0dGVyblJlLmV4ZWMobW9kZUJ1ZmZlcik7XG4gICAgICB9XG4gICAgICBidWYgKz0gbW9kZUJ1ZmZlci5zdWJzdHJpbmcobGFzdEluZGV4KTtcbiAgICAgIGVtaXR0ZXIuYWRkVGV4dChidWYpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NTdWJMYW5ndWFnZSgpIHtcbiAgICAgIGlmIChtb2RlQnVmZmVyID09PSBcIlwiKSByZXR1cm47XG4gICAgICAvKiogQHR5cGUgSGlnaGxpZ2h0UmVzdWx0ICovXG4gICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiB0b3Auc3ViTGFuZ3VhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW3RvcC5zdWJMYW5ndWFnZV0pIHtcbiAgICAgICAgICBlbWl0dGVyLmFkZFRleHQobW9kZUJ1ZmZlcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IF9oaWdobGlnaHQodG9wLnN1Ykxhbmd1YWdlLCBtb2RlQnVmZmVyLCB0cnVlLCBjb250aW51YXRpb25zW3RvcC5zdWJMYW5ndWFnZV0pO1xuICAgICAgICBjb250aW51YXRpb25zW3RvcC5zdWJMYW5ndWFnZV0gPSAvKiogQHR5cGUge0NvbXBpbGVkTW9kZX0gKi8gKHJlc3VsdC5fdG9wKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGhpZ2hsaWdodEF1dG8obW9kZUJ1ZmZlciwgdG9wLnN1Ykxhbmd1YWdlLmxlbmd0aCA/IHRvcC5zdWJMYW5ndWFnZSA6IG51bGwpO1xuICAgICAgfVxuXG4gICAgICAvLyBDb3VudGluZyBlbWJlZGRlZCBsYW5ndWFnZSBzY29yZSB0b3dhcmRzIHRoZSBob3N0IGxhbmd1YWdlIG1heSBiZSBkaXNhYmxlZFxuICAgICAgLy8gd2l0aCB6ZXJvaW5nIHRoZSBjb250YWluaW5nIG1vZGUgcmVsZXZhbmNlLiBVc2UgY2FzZSBpbiBwb2ludCBpcyBNYXJrZG93biB0aGF0XG4gICAgICAvLyBhbGxvd3MgWE1MIGV2ZXJ5d2hlcmUgYW5kIG1ha2VzIGV2ZXJ5IFhNTCBzbmlwcGV0IHRvIGhhdmUgYSBtdWNoIGxhcmdlciBNYXJrZG93blxuICAgICAgLy8gc2NvcmUuXG4gICAgICBpZiAodG9wLnJlbGV2YW5jZSA+IDApIHtcbiAgICAgICAgcmVsZXZhbmNlICs9IHJlc3VsdC5yZWxldmFuY2U7XG4gICAgICB9XG4gICAgICBlbWl0dGVyLmFkZFN1Ymxhbmd1YWdlKHJlc3VsdC5fZW1pdHRlciwgcmVzdWx0Lmxhbmd1YWdlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQnVmZmVyKCkge1xuICAgICAgaWYgKHRvcC5zdWJMYW5ndWFnZSAhPSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3NTdWJMYW5ndWFnZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvY2Vzc0tleXdvcmRzKCk7XG4gICAgICB9XG4gICAgICBtb2RlQnVmZmVyID0gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtDb21waWxlZFNjb3BlfSBzY29wZVxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2hcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbWl0TXVsdGlDbGFzcyhzY29wZSwgbWF0Y2gpIHtcbiAgICAgIGxldCBpID0gMTtcbiAgICAgIGNvbnN0IG1heCA9IG1hdGNoLmxlbmd0aCAtIDE7XG4gICAgICB3aGlsZSAoaSA8PSBtYXgpIHtcbiAgICAgICAgaWYgKCFzY29wZS5fZW1pdFtpXSkgeyBpKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIGNvbnN0IGtsYXNzID0gbGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlc1tzY29wZVtpXV0gfHwgc2NvcGVbaV07XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaFtpXTtcbiAgICAgICAgaWYgKGtsYXNzKSB7XG4gICAgICAgICAgZW1pdHRlci5hZGRLZXl3b3JkKHRleHQsIGtsYXNzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb2RlQnVmZmVyID0gdGV4dDtcbiAgICAgICAgICBwcm9jZXNzS2V5d29yZHMoKTtcbiAgICAgICAgICBtb2RlQnVmZmVyID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGUgLSBuZXcgbW9kZSB0byBzdGFydFxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2hcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdGFydE5ld01vZGUobW9kZSwgbWF0Y2gpIHtcbiAgICAgIGlmIChtb2RlLnNjb3BlICYmIHR5cGVvZiBtb2RlLnNjb3BlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGVtaXR0ZXIub3Blbk5vZGUobGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlc1ttb2RlLnNjb3BlXSB8fCBtb2RlLnNjb3BlKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmJlZ2luU2NvcGUpIHtcbiAgICAgICAgLy8gYmVnaW5TY29wZSBqdXN0IHdyYXBzIHRoZSBiZWdpbiBtYXRjaCBpdHNlbGYgaW4gYSBzY29wZVxuICAgICAgICBpZiAobW9kZS5iZWdpblNjb3BlLl93cmFwKSB7XG4gICAgICAgICAgZW1pdHRlci5hZGRLZXl3b3JkKG1vZGVCdWZmZXIsIGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXNbbW9kZS5iZWdpblNjb3BlLl93cmFwXSB8fCBtb2RlLmJlZ2luU2NvcGUuX3dyYXApO1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBcIlwiO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGUuYmVnaW5TY29wZS5fbXVsdGkpIHtcbiAgICAgICAgICAvLyBhdCB0aGlzIHBvaW50IG1vZGVCdWZmZXIgc2hvdWxkIGp1c3QgYmUgdGhlIG1hdGNoXG4gICAgICAgICAgZW1pdE11bHRpQ2xhc3MobW9kZS5iZWdpblNjb3BlLCBtYXRjaCk7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdG9wID0gT2JqZWN0LmNyZWF0ZShtb2RlLCB7IHBhcmVudDogeyB2YWx1ZTogdG9wIH0gfSk7XG4gICAgICByZXR1cm4gdG9wO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlIH0gbW9kZSAtIHRoZSBtb2RlIHRvIHBvdGVudGlhbGx5IGVuZFxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2ggLSB0aGUgbGF0ZXN0IG1hdGNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1hdGNoUGx1c1JlbWFpbmRlciAtIG1hdGNoIHBsdXMgcmVtYWluZGVyIG9mIGNvbnRlbnRcbiAgICAgKiBAcmV0dXJucyB7Q29tcGlsZWRNb2RlIHwgdm9pZH0gLSB0aGUgbmV4dCBtb2RlLCBvciBpZiB2b2lkIGNvbnRpbnVlIG9uIGluIGN1cnJlbnQgbW9kZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVuZE9mTW9kZShtb2RlLCBtYXRjaCwgbWF0Y2hQbHVzUmVtYWluZGVyKSB7XG4gICAgICBsZXQgbWF0Y2hlZCA9IHN0YXJ0c1dpdGgobW9kZS5lbmRSZSwgbWF0Y2hQbHVzUmVtYWluZGVyKTtcblxuICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgaWYgKG1vZGVbXCJvbjplbmRcIl0pIHtcbiAgICAgICAgICBjb25zdCByZXNwID0gbmV3IFJlc3BvbnNlKG1vZGUpO1xuICAgICAgICAgIG1vZGVbXCJvbjplbmRcIl0obWF0Y2gsIHJlc3ApO1xuICAgICAgICAgIGlmIChyZXNwLmlzTWF0Y2hJZ25vcmVkKSBtYXRjaGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgIHdoaWxlIChtb2RlLmVuZHNQYXJlbnQgJiYgbW9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgIG1vZGUgPSBtb2RlLnBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGV2ZW4gaWYgb246ZW5kIGZpcmVzIGFuIGBpZ25vcmVgIGl0J3Mgc3RpbGwgcG9zc2libGVcbiAgICAgIC8vIHRoYXQgd2UgbWlnaHQgdHJpZ2dlciB0aGUgZW5kIG5vZGUgYmVjYXVzZSBvZiBhIHBhcmVudCBtb2RlXG4gICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCkge1xuICAgICAgICByZXR1cm4gZW5kT2ZNb2RlKG1vZGUucGFyZW50LCBtYXRjaCwgbWF0Y2hQbHVzUmVtYWluZGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgbWF0Y2hpbmcgYnV0IHRoZW4gaWdub3JpbmcgYSBzZXF1ZW5jZSBvZiB0ZXh0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGV4ZW1lIC0gc3RyaW5nIGNvbnRhaW5pbmcgZnVsbCBtYXRjaCB0ZXh0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9JZ25vcmUobGV4ZW1lKSB7XG4gICAgICBpZiAodG9wLm1hdGNoZXIucmVnZXhJbmRleCA9PT0gMCkge1xuICAgICAgICAvLyBubyBtb3JlIHJlZ2V4ZXMgdG8gcG90ZW50aWFsbHkgbWF0Y2ggaGVyZSwgc28gd2UgbW92ZSB0aGUgY3Vyc29yIGZvcndhcmQgb25lXG4gICAgICAgIC8vIHNwYWNlXG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lWzBdO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gbW92ZSB0aGUgY3Vyc29yLCB3ZSBzdGlsbCBoYXZlIGFkZGl0aW9uYWwgcmVnZXhlcyB0byB0cnkgYW5kXG4gICAgICAgIC8vIG1hdGNoIGF0IHRoaXMgdmVyeSBzcG90XG4gICAgICAgIHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IHRydWU7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgc3RhcnQgb2YgYSBuZXcgcG90ZW50aWFsIG1vZGUgbWF0Y2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RW5oYW5jZWRNYXRjaH0gbWF0Y2ggLSB0aGUgY3VycmVudCBtYXRjaFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGhvdyBmYXIgdG8gYWR2YW5jZSB0aGUgcGFyc2UgY3Vyc29yXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9CZWdpbk1hdGNoKG1hdGNoKSB7XG4gICAgICBjb25zdCBsZXhlbWUgPSBtYXRjaFswXTtcbiAgICAgIGNvbnN0IG5ld01vZGUgPSBtYXRjaC5ydWxlO1xuXG4gICAgICBjb25zdCByZXNwID0gbmV3IFJlc3BvbnNlKG5ld01vZGUpO1xuICAgICAgLy8gZmlyc3QgaW50ZXJuYWwgYmVmb3JlIGNhbGxiYWNrcywgdGhlbiB0aGUgcHVibGljIG9uZXNcbiAgICAgIGNvbnN0IGJlZm9yZUNhbGxiYWNrcyA9IFtuZXdNb2RlLl9fYmVmb3JlQmVnaW4sIG5ld01vZGVbXCJvbjpiZWdpblwiXV07XG4gICAgICBmb3IgKGNvbnN0IGNiIG9mIGJlZm9yZUNhbGxiYWNrcykge1xuICAgICAgICBpZiAoIWNiKSBjb250aW51ZTtcbiAgICAgICAgY2IobWF0Y2gsIHJlc3ApO1xuICAgICAgICBpZiAocmVzcC5pc01hdGNoSWdub3JlZCkgcmV0dXJuIGRvSWdub3JlKGxleGVtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdNb2RlLnNraXApIHtcbiAgICAgICAgbW9kZUJ1ZmZlciArPSBsZXhlbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV3TW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGlmICghbmV3TW9kZS5yZXR1cm5CZWdpbiAmJiAhbmV3TW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgICBtb2RlQnVmZmVyID0gbGV4ZW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFydE5ld01vZGUobmV3TW9kZSwgbWF0Y2gpO1xuICAgICAgcmV0dXJuIG5ld01vZGUucmV0dXJuQmVnaW4gPyAwIDogbGV4ZW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIHBvdGVudGlhbCBlbmQgb2YgbW9kZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaCAtIHRoZSBjdXJyZW50IG1hdGNoXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9FbmRNYXRjaChtYXRjaCkge1xuICAgICAgY29uc3QgbGV4ZW1lID0gbWF0Y2hbMF07XG4gICAgICBjb25zdCBtYXRjaFBsdXNSZW1haW5kZXIgPSBjb2RlVG9IaWdobGlnaHQuc3Vic3RyaW5nKG1hdGNoLmluZGV4KTtcblxuICAgICAgY29uc3QgZW5kTW9kZSA9IGVuZE9mTW9kZSh0b3AsIG1hdGNoLCBtYXRjaFBsdXNSZW1haW5kZXIpO1xuICAgICAgaWYgKCFlbmRNb2RlKSB7IHJldHVybiBOT19NQVRDSDsgfVxuXG4gICAgICBjb25zdCBvcmlnaW4gPSB0b3A7XG4gICAgICBpZiAodG9wLmVuZFNjb3BlICYmIHRvcC5lbmRTY29wZS5fd3JhcCkge1xuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGVtaXR0ZXIuYWRkS2V5d29yZChsZXhlbWUsIHRvcC5lbmRTY29wZS5fd3JhcCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcC5lbmRTY29wZSAmJiB0b3AuZW5kU2NvcGUuX211bHRpKSB7XG4gICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgZW1pdE11bHRpQ2xhc3ModG9wLmVuZFNjb3BlLCBtYXRjaCk7XG4gICAgICB9IGVsc2UgaWYgKG9yaWdpbi5za2lwKSB7XG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEob3JpZ2luLnJldHVybkVuZCB8fCBvcmlnaW4uZXhjbHVkZUVuZCkpIHtcbiAgICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGlmIChvcmlnaW4uZXhjbHVkZUVuZCkge1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBsZXhlbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRvcC5zY29wZSkge1xuICAgICAgICAgIGVtaXR0ZXIuY2xvc2VOb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b3Auc2tpcCAmJiAhdG9wLnN1Ykxhbmd1YWdlKSB7XG4gICAgICAgICAgcmVsZXZhbmNlICs9IHRvcC5yZWxldmFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgIH0gd2hpbGUgKHRvcCAhPT0gZW5kTW9kZS5wYXJlbnQpO1xuICAgICAgaWYgKGVuZE1vZGUuc3RhcnRzKSB7XG4gICAgICAgIHN0YXJ0TmV3TW9kZShlbmRNb2RlLnN0YXJ0cywgbWF0Y2gpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdpbi5yZXR1cm5FbmQgPyAwIDogbGV4ZW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQ29udGludWF0aW9ucygpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICAgIGZvciAobGV0IGN1cnJlbnQgPSB0b3A7IGN1cnJlbnQgIT09IGxhbmd1YWdlOyBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQuc2NvcGUpIHtcbiAgICAgICAgICBsaXN0LnVuc2hpZnQoY3VycmVudC5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QuZm9yRWFjaChpdGVtID0+IGVtaXR0ZXIub3Blbk5vZGUoaXRlbSkpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7e3R5cGU/OiBNYXRjaFR5cGUsIGluZGV4PzogbnVtYmVyLCBydWxlPzogTW9kZX19fSAqL1xuICAgIGxldCBsYXN0TWF0Y2ggPSB7fTtcblxuICAgIC8qKlxuICAgICAqICBQcm9jZXNzIGFuIGluZGl2aWR1YWwgbWF0Y2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0QmVmb3JlTWF0Y2ggLSB0ZXh0IHByZWNlZGluZyB0aGUgbWF0Y2ggKHNpbmNlIHRoZSBsYXN0IG1hdGNoKVxuICAgICAqIEBwYXJhbSB7RW5oYW5jZWRNYXRjaH0gW21hdGNoXSAtIHRoZSBtYXRjaCBpdHNlbGZcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwcm9jZXNzTGV4ZW1lKHRleHRCZWZvcmVNYXRjaCwgbWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxleGVtZSA9IG1hdGNoICYmIG1hdGNoWzBdO1xuXG4gICAgICAvLyBhZGQgbm9uLW1hdGNoZWQgdGV4dCB0byB0aGUgY3VycmVudCBtb2RlIGJ1ZmZlclxuICAgICAgbW9kZUJ1ZmZlciArPSB0ZXh0QmVmb3JlTWF0Y2g7XG5cbiAgICAgIGlmIChsZXhlbWUgPT0gbnVsbCkge1xuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICAvLyB3ZSd2ZSBmb3VuZCBhIDAgd2lkdGggbWF0Y2ggYW5kIHdlJ3JlIHN0dWNrLCBzbyB3ZSBuZWVkIHRvIGFkdmFuY2VcbiAgICAgIC8vIHRoaXMgaGFwcGVucyB3aGVuIHdlIGhhdmUgYmFkbHkgYmVoYXZlZCBydWxlcyB0aGF0IGhhdmUgb3B0aW9uYWwgbWF0Y2hlcnMgdG8gdGhlIGRlZ3JlZSB0aGF0XG4gICAgICAvLyBzb21ldGltZXMgdGhleSBjYW4gZW5kIHVwIG1hdGNoaW5nIG5vdGhpbmcgYXQgYWxsXG4gICAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzIxNDBcbiAgICAgIGlmIChsYXN0TWF0Y2gudHlwZSA9PT0gXCJiZWdpblwiICYmIG1hdGNoLnR5cGUgPT09IFwiZW5kXCIgJiYgbGFzdE1hdGNoLmluZGV4ID09PSBtYXRjaC5pbmRleCAmJiBsZXhlbWUgPT09IFwiXCIpIHtcbiAgICAgICAgLy8gc3BpdCB0aGUgXCJza2lwcGVkXCIgY2hhcmFjdGVyIHRoYXQgb3VyIHJlZ2V4IGNob2tlZCBvbiBiYWNrIGludG8gdGhlIG91dHB1dCBzZXF1ZW5jZVxuICAgICAgICBtb2RlQnVmZmVyICs9IGNvZGVUb0hpZ2hsaWdodC5zbGljZShtYXRjaC5pbmRleCwgbWF0Y2guaW5kZXggKyAxKTtcbiAgICAgICAgaWYgKCFTQUZFX01PREUpIHtcbiAgICAgICAgICAvKiogQHR5cGUge0Fubm90YXRlZEVycm9yfSAqL1xuICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihgMCB3aWR0aCBtYXRjaCByZWdleCAoJHtsYW5ndWFnZU5hbWV9KWApO1xuICAgICAgICAgIGVyci5sYW5ndWFnZU5hbWUgPSBsYW5ndWFnZU5hbWU7XG4gICAgICAgICAgZXJyLmJhZFJ1bGUgPSBsYXN0TWF0Y2gucnVsZTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBsYXN0TWF0Y2ggPSBtYXRjaDtcblxuICAgICAgaWYgKG1hdGNoLnR5cGUgPT09IFwiYmVnaW5cIikge1xuICAgICAgICByZXR1cm4gZG9CZWdpbk1hdGNoKG1hdGNoKTtcbiAgICAgIH0gZWxzZSBpZiAobWF0Y2gudHlwZSA9PT0gXCJpbGxlZ2FsXCIgJiYgIWlnbm9yZUlsbGVnYWxzKSB7XG4gICAgICAgIC8vIGlsbGVnYWwgbWF0Y2gsIHdlIGRvIG5vdCBjb250aW51ZSBwcm9jZXNzaW5nXG4gICAgICAgIC8qKiBAdHlwZSB7QW5ub3RhdGVkRXJyb3J9ICovXG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignSWxsZWdhbCBsZXhlbWUgXCInICsgbGV4ZW1lICsgJ1wiIGZvciBtb2RlIFwiJyArICh0b3Auc2NvcGUgfHwgJzx1bm5hbWVkPicpICsgJ1wiJyk7XG4gICAgICAgIGVyci5tb2RlID0gdG9wO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9IGVsc2UgaWYgKG1hdGNoLnR5cGUgPT09IFwiZW5kXCIpIHtcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkID0gZG9FbmRNYXRjaChtYXRjaCk7XG4gICAgICAgIGlmIChwcm9jZXNzZWQgIT09IE5PX01BVENIKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBlZGdlIGNhc2UgZm9yIHdoZW4gaWxsZWdhbCBtYXRjaGVzICQgKGVuZCBvZiBsaW5lKSB3aGljaCBpcyB0ZWNobmljYWxseVxuICAgICAgLy8gYSAwIHdpZHRoIG1hdGNoIGJ1dCBub3QgYSBiZWdpbi9lbmQgbWF0Y2ggc28gaXQncyBub3QgY2F1Z2h0IGJ5IHRoZVxuICAgICAgLy8gZmlyc3QgaGFuZGxlciAod2hlbiBpZ25vcmVJbGxlZ2FscyBpcyB0cnVlKVxuICAgICAgaWYgKG1hdGNoLnR5cGUgPT09IFwiaWxsZWdhbFwiICYmIGxleGVtZSA9PT0gXCJcIikge1xuICAgICAgICAvLyBhZHZhbmNlIHNvIHdlIGFyZW4ndCBzdHVjayBpbiBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuXG4gICAgICAvLyBpbmZpbml0ZSBsb29wcyBhcmUgQkFELCB0aGlzIGlzIGEgbGFzdCBkaXRjaCBjYXRjaCBhbGwuIGlmIHdlIGhhdmUgYVxuICAgICAgLy8gZGVjZW50IG51bWJlciBvZiBpdGVyYXRpb25zIHlldCBvdXIgaW5kZXggKGN1cnNvciBwb3NpdGlvbiBpbiBvdXJcbiAgICAgIC8vIHBhcnNpbmcpIHN0aWxsIDN4IGJlaGluZCBvdXIgaW5kZXggdGhlbiBzb21ldGhpbmcgaXMgdmVyeSB3cm9uZ1xuICAgICAgLy8gc28gd2UgYmFpbFxuICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwMDAgJiYgaXRlcmF0aW9ucyA+IG1hdGNoLmluZGV4ICogMykge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ3BvdGVudGlhbCBpbmZpbml0ZSBsb29wLCB3YXkgbW9yZSBpdGVyYXRpb25zIHRoYW4gbWF0Y2hlcycpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICBXaHkgbWlnaHQgYmUgZmluZCBvdXJzZWx2ZXMgaGVyZT8gIEFuIHBvdGVudGlhbCBlbmQgbWF0Y2ggdGhhdCB3YXNcbiAgICAgIHRyaWdnZXJlZCBidXQgY291bGQgbm90IGJlIGNvbXBsZXRlZC4gIElFLCBgZG9FbmRNYXRjaGAgcmV0dXJuZWQgTk9fTUFUQ0guXG4gICAgICAodGhpcyBjb3VsZCBiZSBiZWNhdXNlIGEgY2FsbGJhY2sgcmVxdWVzdHMgdGhlIG1hdGNoIGJlIGlnbm9yZWQsIGV0YylcblxuICAgICAgVGhpcyBjYXVzZXMgbm8gcmVhbCBoYXJtIG90aGVyIHRoYW4gc3RvcHBpbmcgYSBmZXcgdGltZXMgdG9vIG1hbnkuXG4gICAgICAqL1xuXG4gICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgIHJldHVybiBsZXhlbWUubGVuZ3RoO1xuICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZ2V0TGFuZ3VhZ2UobGFuZ3VhZ2VOYW1lKTtcbiAgICBpZiAoIWxhbmd1YWdlKSB7XG4gICAgICBlcnJvcihMQU5HVUFHRV9OT1RfRk9VTkQucmVwbGFjZShcInt9XCIsIGxhbmd1YWdlTmFtZSkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlOiBcIicgKyBsYW5ndWFnZU5hbWUgKyAnXCInKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZCA9IGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIC8qKiBAdHlwZSB7Q29tcGlsZWRNb2RlfSAqL1xuICAgIGxldCB0b3AgPSBjb250aW51YXRpb24gfHwgbWQ7XG4gICAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsQ29tcGlsZWRNb2RlPiAqL1xuICAgIGNvbnN0IGNvbnRpbnVhdGlvbnMgPSB7fTsgLy8ga2VlcCBjb250aW51YXRpb25zIGZvciBzdWItbGFuZ3VhZ2VzXG4gICAgY29uc3QgZW1pdHRlciA9IG5ldyBvcHRpb25zLl9fZW1pdHRlcihvcHRpb25zKTtcbiAgICBwcm9jZXNzQ29udGludWF0aW9ucygpO1xuICAgIGxldCBtb2RlQnVmZmVyID0gJyc7XG4gICAgbGV0IHJlbGV2YW5jZSA9IDA7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgbGV0IHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IGZhbHNlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRvcC5tYXRjaGVyLmNvbnNpZGVyQWxsKCk7XG5cbiAgICAgIGZvciAoOzspIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICBpZiAocmVzdW1lU2NhbkF0U2FtZVBvc2l0aW9uKSB7XG4gICAgICAgICAgLy8gb25seSByZWdleGVzIG5vdCBtYXRjaGVkIHByZXZpb3VzbHkgd2lsbCBub3cgYmVcbiAgICAgICAgICAvLyBjb25zaWRlcmVkIGZvciBhIHBvdGVudGlhbCBtYXRjaFxuICAgICAgICAgIHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvcC5tYXRjaGVyLmNvbnNpZGVyQWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgdG9wLm1hdGNoZXIubGFzdEluZGV4ID0gaW5kZXg7XG5cbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0b3AubWF0Y2hlci5leGVjKGNvZGVUb0hpZ2hsaWdodCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwibWF0Y2hcIiwgbWF0Y2hbMF0sIG1hdGNoLnJ1bGUgJiYgbWF0Y2gucnVsZS5iZWdpbilcblxuICAgICAgICBpZiAoIW1hdGNoKSBicmVhaztcblxuICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IGNvZGVUb0hpZ2hsaWdodC5zdWJzdHJpbmcoaW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkQ291bnQgPSBwcm9jZXNzTGV4ZW1lKGJlZm9yZU1hdGNoLCBtYXRjaCk7XG4gICAgICAgIGluZGV4ID0gbWF0Y2guaW5kZXggKyBwcm9jZXNzZWRDb3VudDtcbiAgICAgIH1cbiAgICAgIHByb2Nlc3NMZXhlbWUoY29kZVRvSGlnaGxpZ2h0LnN1YnN0cmluZyhpbmRleCkpO1xuICAgICAgZW1pdHRlci5jbG9zZUFsbE5vZGVzKCk7XG4gICAgICBlbWl0dGVyLmZpbmFsaXplKCk7XG4gICAgICByZXN1bHQgPSBlbWl0dGVyLnRvSFRNTCgpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2VOYW1lLFxuICAgICAgICB2YWx1ZTogcmVzdWx0LFxuICAgICAgICByZWxldmFuY2U6IHJlbGV2YW5jZSxcbiAgICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICAgIF9lbWl0dGVyOiBlbWl0dGVyLFxuICAgICAgICBfdG9wOiB0b3BcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLm1lc3NhZ2UgJiYgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ0lsbGVnYWwnKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWUsXG4gICAgICAgICAgdmFsdWU6IGVzY2FwZShjb2RlVG9IaWdobGlnaHQpLFxuICAgICAgICAgIGlsbGVnYWw6IHRydWUsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIF9pbGxlZ2FsQnk6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgY29udGV4dDogY29kZVRvSGlnaGxpZ2h0LnNsaWNlKGluZGV4IC0gMTAwLCBpbmRleCArIDEwMCksXG4gICAgICAgICAgICBtb2RlOiBlcnIubW9kZSxcbiAgICAgICAgICAgIHJlc3VsdFNvRmFyOiByZXN1bHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIF9lbWl0dGVyOiBlbWl0dGVyXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKFNBRkVfTU9ERSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWUsXG4gICAgICAgICAgdmFsdWU6IGVzY2FwZShjb2RlVG9IaWdobGlnaHQpLFxuICAgICAgICAgIGlsbGVnYWw6IGZhbHNlLFxuICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICBlcnJvclJhaXNlZDogZXJyLFxuICAgICAgICAgIF9lbWl0dGVyOiBlbWl0dGVyLFxuICAgICAgICAgIF90b3A6IHRvcFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgdmFsaWQgaGlnaGxpZ2h0IHJlc3VsdCwgd2l0aG91dCBhY3R1YWxseSBkb2luZyBhbnkgYWN0dWFsIHdvcmssXG4gICAqIGF1dG8gaGlnaGxpZ2h0IHN0YXJ0cyB3aXRoIHRoaXMgYW5kIGl0J3MgcG9zc2libGUgZm9yIHNtYWxsIHNuaXBwZXRzIHRoYXRcbiAgICogYXV0by1kZXRlY3Rpb24gbWF5IG5vdCBmaW5kIGEgYmV0dGVyIG1hdGNoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlXG4gICAqIEByZXR1cm5zIHtIaWdobGlnaHRSZXN1bHR9XG4gICAqL1xuICBmdW5jdGlvbiBqdXN0VGV4dEhpZ2hsaWdodFJlc3VsdChjb2RlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgdmFsdWU6IGVzY2FwZShjb2RlKSxcbiAgICAgIGlsbGVnYWw6IGZhbHNlLFxuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgX3RvcDogUExBSU5URVhUX0xBTkdVQUdFLFxuICAgICAgX2VtaXR0ZXI6IG5ldyBvcHRpb25zLl9fZW1pdHRlcihvcHRpb25zKVxuICAgIH07XG4gICAgcmVzdWx0Ll9lbWl0dGVyLmFkZFRleHQoY29kZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICBIaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBkZXRlY3Rpb24uIEFjY2VwdHMgYSBzdHJpbmcgd2l0aCB0aGUgY29kZSB0b1xuICBoaWdobGlnaHQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXG4gIC0gbGFuZ3VhZ2UgKGRldGVjdGVkIGxhbmd1YWdlKVxuICAtIHJlbGV2YW5jZSAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG4gIC0gc2Vjb25kQmVzdCAob2JqZWN0IHdpdGggdGhlIHNhbWUgc3RydWN0dXJlIGZvciBzZWNvbmQtYmVzdCBoZXVyaXN0aWNhbGx5XG4gICAgZGV0ZWN0ZWQgbGFuZ3VhZ2UsIG1heSBiZSBhYnNlbnQpXG5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29kZVxuICAgIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gW2xhbmd1YWdlU3Vic2V0XVxuICAgIEByZXR1cm5zIHtBdXRvSGlnaGxpZ2h0UmVzdWx0fVxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRBdXRvKGNvZGUsIGxhbmd1YWdlU3Vic2V0KSB7XG4gICAgbGFuZ3VhZ2VTdWJzZXQgPSBsYW5ndWFnZVN1YnNldCB8fCBvcHRpb25zLmxhbmd1YWdlcyB8fCBPYmplY3Qua2V5cyhsYW5ndWFnZXMpO1xuICAgIGNvbnN0IHBsYWludGV4dCA9IGp1c3RUZXh0SGlnaGxpZ2h0UmVzdWx0KGNvZGUpO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IGxhbmd1YWdlU3Vic2V0LmZpbHRlcihnZXRMYW5ndWFnZSkuZmlsdGVyKGF1dG9EZXRlY3Rpb24pLm1hcChuYW1lID0+XG4gICAgICBfaGlnaGxpZ2h0KG5hbWUsIGNvZGUsIGZhbHNlKVxuICAgICk7XG4gICAgcmVzdWx0cy51bnNoaWZ0KHBsYWludGV4dCk7IC8vIHBsYWludGV4dCBpcyBhbHdheXMgYW4gb3B0aW9uXG5cbiAgICBjb25zdCBzb3J0ZWQgPSByZXN1bHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIC8vIHNvcnQgYmFzZSBvbiByZWxldmFuY2VcbiAgICAgIGlmIChhLnJlbGV2YW5jZSAhPT0gYi5yZWxldmFuY2UpIHJldHVybiBiLnJlbGV2YW5jZSAtIGEucmVsZXZhbmNlO1xuXG4gICAgICAvLyBhbHdheXMgYXdhcmQgdGhlIHRpZSB0byB0aGUgYmFzZSBsYW5ndWFnZVxuICAgICAgLy8gaWUgaWYgQysrIGFuZCBBcmR1aW5vIGFyZSB0aWVkLCBpdCdzIG1vcmUgbGlrZWx5IHRvIGJlIEMrK1xuICAgICAgaWYgKGEubGFuZ3VhZ2UgJiYgYi5sYW5ndWFnZSkge1xuICAgICAgICBpZiAoZ2V0TGFuZ3VhZ2UoYS5sYW5ndWFnZSkuc3VwZXJzZXRPZiA9PT0gYi5sYW5ndWFnZSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKGdldExhbmd1YWdlKGIubGFuZ3VhZ2UpLnN1cGVyc2V0T2YgPT09IGEubGFuZ3VhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gb3RoZXJ3aXNlIHNheSB0aGV5IGFyZSBlcXVhbCwgd2hpY2ggaGFzIHRoZSBlZmZlY3Qgb2Ygc29ydGluZyBvblxuICAgICAgLy8gcmVsZXZhbmNlIHdoaWxlIHByZXNlcnZpbmcgdGhlIG9yaWdpbmFsIG9yZGVyaW5nIC0gd2hpY2ggaXMgaG93IHRpZXNcbiAgICAgIC8vIGhhdmUgaGlzdG9yaWNhbGx5IGJlZW4gc2V0dGxlZCwgaWUgdGhlIGxhbmd1YWdlIHRoYXQgY29tZXMgZmlyc3QgYWx3YXlzXG4gICAgICAvLyB3aW5zIGluIHRoZSBjYXNlIG9mIGEgdGllXG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIGNvbnN0IFtiZXN0LCBzZWNvbmRCZXN0XSA9IHNvcnRlZDtcblxuICAgIC8qKiBAdHlwZSB7QXV0b0hpZ2hsaWdodFJlc3VsdH0gKi9cbiAgICBjb25zdCByZXN1bHQgPSBiZXN0O1xuICAgIHJlc3VsdC5zZWNvbmRCZXN0ID0gc2Vjb25kQmVzdDtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIG5ldyBjbGFzcyBuYW1lIGZvciBibG9jayBnaXZlbiB0aGUgbGFuZ3VhZ2UgbmFtZVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbY3VycmVudExhbmddXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbcmVzdWx0TGFuZ11cbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZUNsYXNzTmFtZShlbGVtZW50LCBjdXJyZW50TGFuZywgcmVzdWx0TGFuZykge1xuICAgIGNvbnN0IGxhbmd1YWdlID0gKGN1cnJlbnRMYW5nICYmIGFsaWFzZXNbY3VycmVudExhbmddKSB8fCByZXN1bHRMYW5nO1xuXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGxqc1wiKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYGxhbmd1YWdlLSR7bGFuZ3VhZ2V9YCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBoaWdobGlnaHRpbmcgdG8gYSBET00gbm9kZSBjb250YWluaW5nIGNvZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7SGlnaGxpZ2h0ZWRIVE1MRWxlbWVudH0gZWxlbWVudCAtIHRoZSBIVE1MIGVsZW1lbnQgdG8gaGlnaGxpZ2h0XG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEVsZW1lbnQoZWxlbWVudCkge1xuICAgIC8qKiBAdHlwZSBIVE1MRWxlbWVudCAqL1xuICAgIGxldCBub2RlID0gbnVsbDtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGJsb2NrTGFuZ3VhZ2UoZWxlbWVudCk7XG5cbiAgICBpZiAoc2hvdWxkTm90SGlnaGxpZ2h0KGxhbmd1YWdlKSkgcmV0dXJuO1xuXG4gICAgZmlyZShcImJlZm9yZTpoaWdobGlnaHRFbGVtZW50XCIsXG4gICAgICB7IGVsOiBlbGVtZW50LCBsYW5ndWFnZTogbGFuZ3VhZ2UgfSk7XG5cbiAgICAvLyB3ZSBzaG91bGQgYmUgYWxsIHRleHQsIG5vIGNoaWxkIG5vZGVzICh1bmVzY2FwZWQgSFRNTCkgLSB0aGlzIGlzIHBvc3NpYmx5XG4gICAgLy8gYW4gSFRNTCBpbmplY3Rpb24gYXR0YWNrIC0gaXQncyBsaWtlbHkgdG9vIGxhdGUgaWYgdGhpcyBpcyBhbHJlYWR5IGluXG4gICAgLy8gcHJvZHVjdGlvbiAodGhlIGNvZGUgaGFzIGxpa2VseSBhbHJlYWR5IGRvbmUgaXRzIGRhbWFnZSBieSB0aGUgdGltZVxuICAgIC8vIHdlJ3JlIHNlZWluZyBpdCkuLi4gYnV0IHdlIHllbGwgbG91ZGx5IGFib3V0IHRoaXMgc28gdGhhdCBob3BlZnVsbHkgaXQnc1xuICAgIC8vIG1vcmUgbGlrZWx5IHRvIGJlIGNhdWdodCBpbiBkZXZlbG9wbWVudCBiZWZvcmUgbWFraW5nIGl0IHRvIHByb2R1Y3Rpb25cbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIW9wdGlvbnMuaWdub3JlVW5lc2NhcGVkSFRNTCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJPbmUgb2YgeW91ciBjb2RlIGJsb2NrcyBpbmNsdWRlcyB1bmVzY2FwZWQgSFRNTC4gVGhpcyBpcyBhIHBvdGVudGlhbGx5IHNlcmlvdXMgc2VjdXJpdHkgcmlzay5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcImh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvd2lraS9zZWN1cml0eVwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVGhlIGVsZW1lbnQgd2l0aCB1bmVzY2FwZWQgSFRNTDpcIik7XG4gICAgICAgIGNvbnNvbGUud2FybihlbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnRocm93VW5lc2NhcGVkSFRNTCkge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgSFRNTEluamVjdGlvbkVycm9yKFxuICAgICAgICAgIFwiT25lIG9mIHlvdXIgY29kZSBibG9ja3MgaW5jbHVkZXMgdW5lc2NhcGVkIEhUTUwuXCIsXG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUxcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUgPSBlbGVtZW50O1xuICAgIGNvbnN0IHRleHQgPSBub2RlLnRleHRDb250ZW50O1xuICAgIGNvbnN0IHJlc3VsdCA9IGxhbmd1YWdlID8gaGlnaGxpZ2h0KHRleHQsIHsgbGFuZ3VhZ2UsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pIDogaGlnaGxpZ2h0QXV0byh0ZXh0KTtcblxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgIHVwZGF0ZUNsYXNzTmFtZShlbGVtZW50LCBsYW5ndWFnZSwgcmVzdWx0Lmxhbmd1YWdlKTtcbiAgICBlbGVtZW50LnJlc3VsdCA9IHtcbiAgICAgIGxhbmd1YWdlOiByZXN1bHQubGFuZ3VhZ2UsXG4gICAgICAvLyBUT0RPOiByZW1vdmUgd2l0aCB2ZXJzaW9uIDExLjBcbiAgICAgIHJlOiByZXN1bHQucmVsZXZhbmNlLFxuICAgICAgcmVsZXZhbmNlOiByZXN1bHQucmVsZXZhbmNlXG4gICAgfTtcbiAgICBpZiAocmVzdWx0LnNlY29uZEJlc3QpIHtcbiAgICAgIGVsZW1lbnQuc2Vjb25kQmVzdCA9IHtcbiAgICAgICAgbGFuZ3VhZ2U6IHJlc3VsdC5zZWNvbmRCZXN0Lmxhbmd1YWdlLFxuICAgICAgICByZWxldmFuY2U6IHJlc3VsdC5zZWNvbmRCZXN0LnJlbGV2YW5jZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmaXJlKFwiYWZ0ZXI6aGlnaGxpZ2h0RWxlbWVudFwiLCB7IGVsOiBlbGVtZW50LCByZXN1bHQsIHRleHQgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBoaWdobGlnaHQuanMgZ2xvYmFsIG9wdGlvbnMgd2l0aCB0aGUgcGFzc2VkIG9wdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtQYXJ0aWFsPEhMSlNPcHRpb25zPn0gdXNlck9wdGlvbnNcbiAgICovXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZSh1c2VyT3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBpbmhlcml0KG9wdGlvbnMsIHVzZXJPcHRpb25zKTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbW92ZSB2MTIsIGRlcHJlY2F0ZWRcbiAgY29uc3QgaW5pdEhpZ2hsaWdodGluZyA9ICgpID0+IHtcbiAgICBoaWdobGlnaHRBbGwoKTtcbiAgICBkZXByZWNhdGVkKFwiMTAuNi4wXCIsIFwiaW5pdEhpZ2hsaWdodGluZygpIGRlcHJlY2F0ZWQuICBVc2UgaGlnaGxpZ2h0QWxsKCkgbm93LlwiKTtcbiAgfTtcblxuICAvLyBUT0RPOiByZW1vdmUgdjEyLCBkZXByZWNhdGVkXG4gIGZ1bmN0aW9uIGluaXRIaWdobGlnaHRpbmdPbkxvYWQoKSB7XG4gICAgaGlnaGxpZ2h0QWxsKCk7XG4gICAgZGVwcmVjYXRlZChcIjEwLjYuMFwiLCBcImluaXRIaWdobGlnaHRpbmdPbkxvYWQoKSBkZXByZWNhdGVkLiAgVXNlIGhpZ2hsaWdodEFsbCgpIG5vdy5cIik7XG4gIH1cblxuICBsZXQgd2FudHNIaWdobGlnaHQgPSBmYWxzZTtcblxuICAvKipcbiAgICogYXV0by1oaWdobGlnaHRzIGFsbCBwcmU+Y29kZSBlbGVtZW50cyBvbiB0aGUgcGFnZVxuICAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QWxsKCkge1xuICAgIC8vIGlmIHdlIGFyZSBjYWxsZWQgdG9vIGVhcmx5IGluIHRoZSBsb2FkaW5nIHByb2Nlc3NcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIHtcbiAgICAgIHdhbnRzSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBibG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuY3NzU2VsZWN0b3IpO1xuICAgIGJsb2Nrcy5mb3JFYWNoKGhpZ2hsaWdodEVsZW1lbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYm9vdCgpIHtcbiAgICAvLyBpZiBhIGhpZ2hsaWdodCB3YXMgcmVxdWVzdGVkIGJlZm9yZSBET00gd2FzIGxvYWRlZCwgZG8gbm93XG4gICAgaWYgKHdhbnRzSGlnaGxpZ2h0KSBoaWdobGlnaHRBbGwoKTtcbiAgfVxuXG4gIC8vIG1ha2Ugc3VyZSB3ZSBhcmUgaW4gdGhlIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBib290LCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsYW5ndWFnZSBncmFtbWFyIG1vZHVsZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VOYW1lXG4gICAqIEBwYXJhbSB7TGFuZ3VhZ2VGbn0gbGFuZ3VhZ2VEZWZpbml0aW9uXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3Rlckxhbmd1YWdlKGxhbmd1YWdlTmFtZSwgbGFuZ3VhZ2VEZWZpbml0aW9uKSB7XG4gICAgbGV0IGxhbmcgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBsYW5nID0gbGFuZ3VhZ2VEZWZpbml0aW9uKGhsanMpO1xuICAgIH0gY2F0Y2ggKGVycm9yJDEpIHtcbiAgICAgIGVycm9yKFwiTGFuZ3VhZ2UgZGVmaW5pdGlvbiBmb3IgJ3t9JyBjb3VsZCBub3QgYmUgcmVnaXN0ZXJlZC5cIi5yZXBsYWNlKFwie31cIiwgbGFuZ3VhZ2VOYW1lKSk7XG4gICAgICAvLyBoYXJkIG9yIHNvZnQgZXJyb3JcbiAgICAgIGlmICghU0FGRV9NT0RFKSB7IHRocm93IGVycm9yJDE7IH0gZWxzZSB7IGVycm9yKGVycm9yJDEpOyB9XG4gICAgICAvLyBsYW5ndWFnZXMgdGhhdCBoYXZlIHNlcmlvdXMgZXJyb3JzIGFyZSByZXBsYWNlZCB3aXRoIGVzc2VudGlhbGx5IGFcbiAgICAgIC8vIFwicGxhaW50ZXh0XCIgc3RhbmQtaW4gc28gdGhhdCB0aGUgY29kZSBibG9ja3Mgd2lsbCBzdGlsbCBnZXQgbm9ybWFsXG4gICAgICAvLyBjc3MgY2xhc3NlcyBhcHBsaWVkIHRvIHRoZW0gLSBhbmQgb25lIGJhZCBsYW5ndWFnZSB3b24ndCBicmVhayB0aGVcbiAgICAgIC8vIGVudGlyZSBoaWdobGlnaHRlclxuICAgICAgbGFuZyA9IFBMQUlOVEVYVF9MQU5HVUFHRTtcbiAgICB9XG4gICAgLy8gZ2l2ZSBpdCBhIHRlbXBvcmFyeSBuYW1lIGlmIGl0IGRvZXNuJ3QgaGF2ZSBvbmUgaW4gdGhlIG1ldGEtZGF0YVxuICAgIGlmICghbGFuZy5uYW1lKSBsYW5nLm5hbWUgPSBsYW5ndWFnZU5hbWU7XG4gICAgbGFuZ3VhZ2VzW2xhbmd1YWdlTmFtZV0gPSBsYW5nO1xuICAgIGxhbmcucmF3RGVmaW5pdGlvbiA9IGxhbmd1YWdlRGVmaW5pdGlvbi5iaW5kKG51bGwsIGhsanMpO1xuXG4gICAgaWYgKGxhbmcuYWxpYXNlcykge1xuICAgICAgcmVnaXN0ZXJBbGlhc2VzKGxhbmcuYWxpYXNlcywgeyBsYW5ndWFnZU5hbWUgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxhbmd1YWdlIGdyYW1tYXIgbW9kdWxlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZU5hbWVcbiAgICovXG4gIGZ1bmN0aW9uIHVucmVnaXN0ZXJMYW5ndWFnZShsYW5ndWFnZU5hbWUpIHtcbiAgICBkZWxldGUgbGFuZ3VhZ2VzW2xhbmd1YWdlTmFtZV07XG4gICAgZm9yIChjb25zdCBhbGlhcyBvZiBPYmplY3Qua2V5cyhhbGlhc2VzKSkge1xuICAgICAgaWYgKGFsaWFzZXNbYWxpYXNdID09PSBsYW5ndWFnZU5hbWUpIHtcbiAgICAgICAgZGVsZXRlIGFsaWFzZXNbYWxpYXNdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119IExpc3Qgb2YgbGFuZ3VhZ2UgaW50ZXJuYWwgbmFtZXNcbiAgICovXG4gIGZ1bmN0aW9uIGxpc3RMYW5ndWFnZXMoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGxhbmd1YWdlcyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSBsYW5ndWFnZSB0byByZXRyaWV2ZVxuICAgKiBAcmV0dXJucyB7TGFuZ3VhZ2UgfCB1bmRlZmluZWR9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRMYW5ndWFnZShuYW1lKSB7XG4gICAgbmFtZSA9IChuYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBsYW5ndWFnZXNbbmFtZV0gfHwgbGFuZ3VhZ2VzW2FsaWFzZXNbbmFtZV1dO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBhbGlhc0xpc3QgLSBzaW5nbGUgYWxpYXMgb3IgbGlzdCBvZiBhbGlhc2VzXG4gICAqIEBwYXJhbSB7e2xhbmd1YWdlTmFtZTogc3RyaW5nfX0gb3B0c1xuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJBbGlhc2VzKGFsaWFzTGlzdCwgeyBsYW5ndWFnZU5hbWUgfSkge1xuICAgIGlmICh0eXBlb2YgYWxpYXNMaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgYWxpYXNMaXN0ID0gW2FsaWFzTGlzdF07XG4gICAgfVxuICAgIGFsaWFzTGlzdC5mb3JFYWNoKGFsaWFzID0+IHsgYWxpYXNlc1thbGlhcy50b0xvd2VyQ2FzZSgpXSA9IGxhbmd1YWdlTmFtZTsgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBhIGdpdmVuIGxhbmd1YWdlIGhhcyBhdXRvLWRldGVjdGlvbiBlbmFibGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgbGFuZ3VhZ2VcbiAgICovXG4gIGZ1bmN0aW9uIGF1dG9EZXRlY3Rpb24obmFtZSkge1xuICAgIGNvbnN0IGxhbmcgPSBnZXRMYW5ndWFnZShuYW1lKTtcbiAgICByZXR1cm4gbGFuZyAmJiAhbGFuZy5kaXNhYmxlQXV0b2RldGVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGdyYWRlcyB0aGUgb2xkIGhpZ2hsaWdodEJsb2NrIHBsdWdpbnMgdG8gdGhlIG5ld1xuICAgKiBoaWdobGlnaHRFbGVtZW50IEFQSVxuICAgKiBAcGFyYW0ge0hMSlNQbHVnaW59IHBsdWdpblxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZVBsdWdpbkFQSShwbHVnaW4pIHtcbiAgICAvLyBUT0RPOiByZW1vdmUgd2l0aCB2MTJcbiAgICBpZiAocGx1Z2luW1wiYmVmb3JlOmhpZ2hsaWdodEJsb2NrXCJdICYmICFwbHVnaW5bXCJiZWZvcmU6aGlnaGxpZ2h0RWxlbWVudFwiXSkge1xuICAgICAgcGx1Z2luW1wiYmVmb3JlOmhpZ2hsaWdodEVsZW1lbnRcIl0gPSAoZGF0YSkgPT4ge1xuICAgICAgICBwbHVnaW5bXCJiZWZvcmU6aGlnaGxpZ2h0QmxvY2tcIl0oXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7IGJsb2NrOiBkYXRhLmVsIH0sIGRhdGEpXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocGx1Z2luW1wiYWZ0ZXI6aGlnaGxpZ2h0QmxvY2tcIl0gJiYgIXBsdWdpbltcImFmdGVyOmhpZ2hsaWdodEVsZW1lbnRcIl0pIHtcbiAgICAgIHBsdWdpbltcImFmdGVyOmhpZ2hsaWdodEVsZW1lbnRcIl0gPSAoZGF0YSkgPT4ge1xuICAgICAgICBwbHVnaW5bXCJhZnRlcjpoaWdobGlnaHRCbG9ja1wiXShcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHsgYmxvY2s6IGRhdGEuZWwgfSwgZGF0YSlcbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SExKU1BsdWdpbn0gcGx1Z2luXG4gICAqL1xuICBmdW5jdGlvbiBhZGRQbHVnaW4ocGx1Z2luKSB7XG4gICAgdXBncmFkZVBsdWdpbkFQSShwbHVnaW4pO1xuICAgIHBsdWdpbnMucHVzaChwbHVnaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7UGx1Z2luRXZlbnR9IGV2ZW50XG4gICAqIEBwYXJhbSB7YW55fSBhcmdzXG4gICAqL1xuICBmdW5jdGlvbiBmaXJlKGV2ZW50LCBhcmdzKSB7XG4gICAgY29uc3QgY2IgPSBldmVudDtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICBpZiAocGx1Z2luW2NiXSkge1xuICAgICAgICBwbHVnaW5bY2JdKGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERFUFJFQ0FURURcbiAgICogQHBhcmFtIHtIaWdobGlnaHRlZEhUTUxFbGVtZW50fSBlbFxuICAgKi9cbiAgZnVuY3Rpb24gZGVwcmVjYXRlSGlnaGxpZ2h0QmxvY2soZWwpIHtcbiAgICBkZXByZWNhdGVkKFwiMTAuNy4wXCIsIFwiaGlnaGxpZ2h0QmxvY2sgd2lsbCBiZSByZW1vdmVkIGVudGlyZWx5IGluIHYxMi4wXCIpO1xuICAgIGRlcHJlY2F0ZWQoXCIxMC43LjBcIiwgXCJQbGVhc2UgdXNlIGhpZ2hsaWdodEVsZW1lbnQgbm93LlwiKTtcblxuICAgIHJldHVybiBoaWdobGlnaHRFbGVtZW50KGVsKTtcbiAgfVxuXG4gIC8qIEludGVyZmFjZSBkZWZpbml0aW9uICovXG4gIE9iamVjdC5hc3NpZ24oaGxqcywge1xuICAgIGhpZ2hsaWdodCxcbiAgICBoaWdobGlnaHRBdXRvLFxuICAgIGhpZ2hsaWdodEFsbCxcbiAgICBoaWdobGlnaHRFbGVtZW50LFxuICAgIC8vIFRPRE86IFJlbW92ZSB3aXRoIHYxMiBBUElcbiAgICBoaWdobGlnaHRCbG9jazogZGVwcmVjYXRlSGlnaGxpZ2h0QmxvY2ssXG4gICAgY29uZmlndXJlLFxuICAgIGluaXRIaWdobGlnaHRpbmcsXG4gICAgaW5pdEhpZ2hsaWdodGluZ09uTG9hZCxcbiAgICByZWdpc3Rlckxhbmd1YWdlLFxuICAgIHVucmVnaXN0ZXJMYW5ndWFnZSxcbiAgICBsaXN0TGFuZ3VhZ2VzLFxuICAgIGdldExhbmd1YWdlLFxuICAgIHJlZ2lzdGVyQWxpYXNlcyxcbiAgICBhdXRvRGV0ZWN0aW9uLFxuICAgIGluaGVyaXQsXG4gICAgYWRkUGx1Z2luXG4gIH0pO1xuXG4gIGhsanMuZGVidWdNb2RlID0gZnVuY3Rpb24oKSB7IFNBRkVfTU9ERSA9IGZhbHNlOyB9O1xuICBobGpzLnNhZmVNb2RlID0gZnVuY3Rpb24oKSB7IFNBRkVfTU9ERSA9IHRydWU7IH07XG4gIGhsanMudmVyc2lvblN0cmluZyA9IHZlcnNpb247XG5cbiAgaGxqcy5yZWdleCA9IHtcbiAgICBjb25jYXQ6IGNvbmNhdCxcbiAgICBsb29rYWhlYWQ6IGxvb2thaGVhZCxcbiAgICBlaXRoZXI6IGVpdGhlcixcbiAgICBvcHRpb25hbDogb3B0aW9uYWwsXG4gICAgYW55TnVtYmVyT2ZUaW1lczogYW55TnVtYmVyT2ZUaW1lc1xuICB9O1xuXG4gIGZvciAoY29uc3Qga2V5IGluIE1PREVTKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICh0eXBlb2YgTU9ERVNba2V5XSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZGVlcEZyZWV6ZUVzNi5leHBvcnRzKE1PREVTW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1lcmdlIGFsbCB0aGUgbW9kZXMvcmVnZXhlcyBpbnRvIG91ciBtYWluIG9iamVjdFxuICBPYmplY3QuYXNzaWduKGhsanMsIE1PREVTKTtcblxuICByZXR1cm4gaGxqcztcbn07XG5cbi8vIGV4cG9ydCBhbiBcImluc3RhbmNlXCIgb2YgdGhlIGhpZ2hsaWdodGVyXG52YXIgaGlnaGxpZ2h0ID0gSExKUyh7fSk7XG5cbmV4cG9ydCB7IGhpZ2hsaWdodCBhcyBkZWZhdWx0IH07XG4iXX0=