export { highlight as default };
export type RegexEitherOptions = {
    capture?: boolean;
};
export type CallbackResponse = import('./highlight.js').CallbackResponse;
export type CompilerExt = import('./highlight.js').CompilerExt;
export type Mode = import('./highlight.js').Mode;
export type CompiledMode = import('./highlight.js').CompiledMode;
export type Language = import('./highlight.js').Language;
export type HLJSPlugin = import('./highlight.js').HLJSPlugin;
export type CompiledLanguage = import('./highlight.js').CompiledLanguage;
export type Renderer = {
    addText: (text: string) => void;
    openNode: (node: Node) => void;
    closeNode: (node: Node) => void;
    value: () => string;
};
export type Node = {
    kind?: string;
    sublanguage?: boolean;
};
export type Tree = {
    walk: (r: import("./highlight.js").Renderer) => void;
};
export type DataNode = {
    kind?: string;
    sublanguage?: boolean;
    children: Node[];
};
export type Emitter = import('./highlight.js').Emitter;
export type ModeCallback = import('./highlight.js').ModeCallback;
export type CompiledScope = import('./highlight.js').CompiledScope;
export type HLJSApi = import('./highlight.js').HLJSApi;
export type PluginEvent = import('./highlight.js').PluginEvent;
export type HLJSOptions = import('./highlight.js').HLJSOptions;
export type LanguageFn = import('./highlight.js').LanguageFn;
export type HighlightedHTMLElement = import('./highlight.js').HighlightedHTMLElement;
export type BeforeHighlightContext = import('./highlight.js').BeforeHighlightContext;
export type MatchType = any;
export type KeywordData = any;
export type EnhancedMatch = any;
export type AnnotatedError = any;
export type AutoHighlightResult = import('./highlight.js').AutoHighlightResult;
export type HighlightOptions = import('./highlight.js').HighlightOptions;
export type HighlightResult = import('./highlight.js').HighlightResult;
declare var highlight: any;
//# sourceMappingURL=highlight.d.ts.map