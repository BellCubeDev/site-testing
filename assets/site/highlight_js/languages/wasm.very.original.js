function wasm(hljs) {
    hljs.regex;
    const BLOCK_COMMENT = hljs.COMMENT(/\(;/, /;\)/);
    BLOCK_COMMENT.contains.push("self");
    const LINE_COMMENT = hljs.COMMENT(/;;/, /$/);
    const KWS = [
        "anyfunc",
        "block",
        "br",
        "br_if",
        "br_table",
        "call",
        "call_indirect",
        "data",
        "drop",
        "elem",
        "else",
        "end",
        "export",
        "func",
        "global.get",
        "global.set",
        "local.get",
        "local.set",
        "local.tee",
        "get_global",
        "get_local",
        "global",
        "if",
        "import",
        "local",
        "loop",
        "memory",
        "memory.grow",
        "memory.size",
        "module",
        "mut",
        "nop",
        "offset",
        "param",
        "result",
        "return",
        "select",
        "set_global",
        "set_local",
        "start",
        "table",
        "tee_local",
        "then",
        "type",
        "unreachable"
    ];
    const FUNCTION_REFERENCE = {
        begin: [
            /(?:func|call|call_indirect)/,
            /\s+/,
            /\$[^\s)]+/
        ],
        className: {
            1: "keyword",
            3: "title.function"
        }
    };
    const ARGUMENT = {
        className: "variable",
        begin: /\$[\w_]+/
    };
    const PARENS = {
        match: /(\((?!;)|\))+/,
        className: "punctuation",
        relevance: 0
    };
    const NUMBER = {
        className: "number",
        relevance: 0,
        match: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/
    };
    const TYPE = {
        match: /(i32|i64|f32|f64)(?!\.)/,
        className: "type"
    };
    const MATH_OPERATIONS = {
        className: "keyword",
        match: /\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/
    };
    const OFFSET_ALIGN = {
        match: [
            /(?:offset|align)/,
            /\s*/,
            /=/
        ],
        className: {
            1: "keyword",
            3: "operator"
        }
    };
    return {
        name: 'WebAssembly',
        keywords: {
            $pattern: /[\w.]+/,
            keyword: KWS
        },
        contains: [
            LINE_COMMENT,
            BLOCK_COMMENT,
            OFFSET_ALIGN,
            ARGUMENT,
            PARENS,
            FUNCTION_REFERENCE,
            hljs.QUOTE_STRING_MODE,
            TYPE,
            MATH_OPERATIONS,
            NUMBER
        ]
    };
}
export { wasm as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FzbS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3dhc20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ1gsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakQsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFN0MsTUFBTSxHQUFHLEdBQUc7UUFDVixTQUFTO1FBQ1QsT0FBTztRQUNQLElBQUk7UUFDSixPQUFPO1FBQ1AsVUFBVTtRQUNWLE1BQU07UUFDTixlQUFlO1FBQ2YsTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxRQUFRO1FBQ1IsTUFBTTtRQUNOLFlBQVk7UUFDWixZQUFZO1FBQ1osV0FBVztRQUNYLFdBQVc7UUFDWCxXQUFXO1FBQ1gsWUFBWTtRQUNaLFdBQVc7UUFDWCxRQUFRO1FBQ1IsSUFBSTtRQUNKLFFBQVE7UUFDUixPQUFPO1FBQ1AsTUFBTTtRQUNOLFFBQVE7UUFDUixhQUFhO1FBQ2IsYUFBYTtRQUNiLFFBQVE7UUFDUixLQUFLO1FBQ0wsS0FBSztRQUNMLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsWUFBWTtRQUNaLFdBQVc7UUFDWCxPQUFPO1FBQ1AsT0FBTztRQUNQLFdBQVc7UUFDWCxNQUFNO1FBQ04sTUFBTTtRQUNOLGFBQWE7S0FDZCxDQUFDO0lBRUYsTUFBTSxrQkFBa0IsR0FBRztRQUN6QixLQUFLLEVBQUU7WUFDTCw2QkFBNkI7WUFDN0IsS0FBSztZQUNMLFdBQVc7U0FDWjtRQUNELFNBQVMsRUFBRTtZQUNULENBQUMsRUFBRSxTQUFTO1lBQ1osQ0FBQyxFQUFFLGdCQUFnQjtTQUNwQjtLQUNGLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBRztRQUNmLFNBQVMsRUFBRSxVQUFVO1FBQ3JCLEtBQUssRUFBRSxVQUFVO0tBQ2xCLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRztRQUNiLEtBQUssRUFBRSxlQUFlO1FBQ3RCLFNBQVMsRUFBRSxhQUFhO1FBQ3hCLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFFBQVE7UUFDbkIsU0FBUyxFQUFFLENBQUM7UUFFWixLQUFLLEVBQUUsaU5BQWlOO0tBQ3pOLENBQUM7SUFFRixNQUFNLElBQUksR0FBRztRQUVYLEtBQUssRUFBRSx5QkFBeUI7UUFDaEMsU0FBUyxFQUFFLE1BQU07S0FDbEIsQ0FBQztJQUVGLE1BQU0sZUFBZSxHQUFHO1FBQ3RCLFNBQVMsRUFBRSxTQUFTO1FBRXBCLEtBQUssRUFBRSxtWkFBbVo7S0FDM1osQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHO1FBQ25CLEtBQUssRUFBRTtZQUNMLGtCQUFrQjtZQUNsQixLQUFLO1lBQ0wsR0FBRztTQUNKO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsQ0FBQyxFQUFFLFNBQVM7WUFDWixDQUFDLEVBQUUsVUFBVTtTQUNkO0tBQ0YsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsYUFBYTtRQUNuQixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsUUFBUTtZQUNsQixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsWUFBWTtZQUNaLGFBQWE7WUFDYixZQUFZO1lBQ1osUUFBUTtZQUNSLE1BQU07WUFDTixrQkFBa0I7WUFDbEIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJO1lBQ0osZUFBZTtZQUNmLE1BQU07U0FDUDtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogV2ViQXNzZW1ibHlcbldlYnNpdGU6IGh0dHBzOi8vd2ViYXNzZW1ibHkub3JnXG5EZXNjcmlwdGlvbjogIFdhc20gaXMgZGVzaWduZWQgYXMgYSBwb3J0YWJsZSBjb21waWxhdGlvbiB0YXJnZXQgZm9yIHByb2dyYW1taW5nIGxhbmd1YWdlcywgZW5hYmxpbmcgZGVwbG95bWVudCBvbiB0aGUgd2ViIGZvciBjbGllbnQgYW5kIHNlcnZlciBhcHBsaWNhdGlvbnMuXG5DYXRlZ29yeTogd2ViLCBjb21tb25cbkF1ZGl0OiAyMDIwXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gd2FzbShobGpzKSB7XG4gIGhsanMucmVnZXg7XG4gIGNvbnN0IEJMT0NLX0NPTU1FTlQgPSBobGpzLkNPTU1FTlQoL1xcKDsvLCAvO1xcKS8pO1xuICBCTE9DS19DT01NRU5ULmNvbnRhaW5zLnB1c2goXCJzZWxmXCIpO1xuICBjb25zdCBMSU5FX0NPTU1FTlQgPSBobGpzLkNPTU1FTlQoLzs7LywgLyQvKTtcblxuICBjb25zdCBLV1MgPSBbXG4gICAgXCJhbnlmdW5jXCIsXG4gICAgXCJibG9ja1wiLFxuICAgIFwiYnJcIixcbiAgICBcImJyX2lmXCIsXG4gICAgXCJicl90YWJsZVwiLFxuICAgIFwiY2FsbFwiLFxuICAgIFwiY2FsbF9pbmRpcmVjdFwiLFxuICAgIFwiZGF0YVwiLFxuICAgIFwiZHJvcFwiLFxuICAgIFwiZWxlbVwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZW5kXCIsXG4gICAgXCJleHBvcnRcIixcbiAgICBcImZ1bmNcIixcbiAgICBcImdsb2JhbC5nZXRcIixcbiAgICBcImdsb2JhbC5zZXRcIixcbiAgICBcImxvY2FsLmdldFwiLFxuICAgIFwibG9jYWwuc2V0XCIsXG4gICAgXCJsb2NhbC50ZWVcIixcbiAgICBcImdldF9nbG9iYWxcIixcbiAgICBcImdldF9sb2NhbFwiLFxuICAgIFwiZ2xvYmFsXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJsb2NhbFwiLFxuICAgIFwibG9vcFwiLFxuICAgIFwibWVtb3J5XCIsXG4gICAgXCJtZW1vcnkuZ3Jvd1wiLFxuICAgIFwibWVtb3J5LnNpemVcIixcbiAgICBcIm1vZHVsZVwiLFxuICAgIFwibXV0XCIsXG4gICAgXCJub3BcIixcbiAgICBcIm9mZnNldFwiLFxuICAgIFwicGFyYW1cIixcbiAgICBcInJlc3VsdFwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJzZWxlY3RcIixcbiAgICBcInNldF9nbG9iYWxcIixcbiAgICBcInNldF9sb2NhbFwiLFxuICAgIFwic3RhcnRcIixcbiAgICBcInRhYmxlXCIsXG4gICAgXCJ0ZWVfbG9jYWxcIixcbiAgICBcInRoZW5cIixcbiAgICBcInR5cGVcIixcbiAgICBcInVucmVhY2hhYmxlXCJcbiAgXTtcblxuICBjb25zdCBGVU5DVElPTl9SRUZFUkVOQ0UgPSB7XG4gICAgYmVnaW46IFtcbiAgICAgIC8oPzpmdW5jfGNhbGx8Y2FsbF9pbmRpcmVjdCkvLFxuICAgICAgL1xccysvLFxuICAgICAgL1xcJFteXFxzKV0rL1xuICAgIF0sXG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgIH1cbiAgfTtcblxuICBjb25zdCBBUkdVTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6IFwidmFyaWFibGVcIixcbiAgICBiZWdpbjogL1xcJFtcXHdfXSsvXG4gIH07XG5cbiAgY29uc3QgUEFSRU5TID0ge1xuICAgIG1hdGNoOiAvKFxcKCg/ITspfFxcKSkrLyxcbiAgICBjbGFzc05hbWU6IFwicHVuY3R1YXRpb25cIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiBcIm51bWJlclwiLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICAvLyBib3Jyb3dlZCBmcm9tIFByaXNtLCBUT0RPOiBzcGxpdCBvdXQgaW50byB2YXJpYW50c1xuICAgIG1hdGNoOiAvWystXT9cXGIoPzpcXGQoPzpfP1xcZCkqKD86XFwuXFxkKD86Xz9cXGQpKik/KD86W2VFXVsrLV0/XFxkKD86Xz9cXGQpKik/fDB4W1xcZGEtZkEtRl0oPzpfP1tcXGRhLWZBLUZdKSooPzpcXC5bXFxkYS1mQS1GXSg/Ol8/W1xcZGEtZkEtRF0pKik/KD86W3BQXVsrLV0/XFxkKD86Xz9cXGQpKik/KVxcYnxcXGJpbmZcXGJ8XFxibmFuKD86OjB4W1xcZGEtZkEtRl0oPzpfP1tcXGRhLWZBLURdKSopP1xcYi9cbiAgfTtcblxuICBjb25zdCBUWVBFID0ge1xuICAgIC8vIGxvb2stYWhlYWQgcHJldmVudHMgdXMgZnJvbSBnb2JibGluZyB1cCBvcGNvZGVzXG4gICAgbWF0Y2g6IC8oaTMyfGk2NHxmMzJ8ZjY0KSg/IVxcLikvLFxuICAgIGNsYXNzTmFtZTogXCJ0eXBlXCJcbiAgfTtcblxuICBjb25zdCBNQVRIX09QRVJBVElPTlMgPSB7XG4gICAgY2xhc3NOYW1lOiBcImtleXdvcmRcIixcbiAgICAvLyBib3Jyb3dlZCBmcm9tIFByaXNtLCBUT0RPOiBzcGxpdCBvdXQgaW50byB2YXJpYW50c1xuICAgIG1hdGNoOiAvXFxiKGYzMnxmNjR8aTMyfGk2NCkoPzpcXC4oPzphYnN8YWRkfGFuZHxjZWlsfGNsenxjb25zdHxjb252ZXJ0X1tzdV1cXC9pKD86MzJ8NjQpfGNvcHlzaWdufGN0enxkZW1vdGVcXC9mNjR8ZGl2KD86X1tzdV0pP3xlcXo/fGV4dGVuZF9bc3VdXFwvaTMyfGZsb29yfGdlKD86X1tzdV0pP3xndCg/Ol9bc3VdKT98bGUoPzpfW3N1XSk/fGxvYWQoPzooPzo4fDE2fDMyKV9bc3VdKT98bHQoPzpfW3N1XSk/fG1heHxtaW58bXVsfG5lYXJlc3R8bmVnP3xvcnxwb3BjbnR8cHJvbW90ZVxcL2YzMnxyZWludGVycHJldFxcL1tmaV0oPzozMnw2NCl8cmVtX1tzdV18cm90W2xyXXxzaGx8c2hyX1tzdV18c3RvcmUoPzo4fDE2fDMyKT98c3FydHxzdWJ8dHJ1bmMoPzpfW3N1XVxcL2YoPzozMnw2NCkpP3x3cmFwXFwvaTY0fHhvcikpXFxiL1xuICB9O1xuXG4gIGNvbnN0IE9GRlNFVF9BTElHTiA9IHtcbiAgICBtYXRjaDogW1xuICAgICAgLyg/Om9mZnNldHxhbGlnbikvLFxuICAgICAgL1xccyovLFxuICAgICAgLz0vXG4gICAgXSxcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgMzogXCJvcGVyYXRvclwiXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1dlYkFzc2VtYmx5JyxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46IC9bXFx3Ll0rLyxcbiAgICAgIGtleXdvcmQ6IEtXU1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIExJTkVfQ09NTUVOVCxcbiAgICAgIEJMT0NLX0NPTU1FTlQsXG4gICAgICBPRkZTRVRfQUxJR04sXG4gICAgICBBUkdVTUVOVCxcbiAgICAgIFBBUkVOUyxcbiAgICAgIEZVTkNUSU9OX1JFRkVSRU5DRSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBUWVBFLFxuICAgICAgTUFUSF9PUEVSQVRJT05TLFxuICAgICAgTlVNQkVSXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyB3YXNtIGFzIGRlZmF1bHQgfTtcbiJdfQ==