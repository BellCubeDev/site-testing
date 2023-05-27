function rsl(hljs) {
    const BUILT_INS = [
        "abs",
        "acos",
        "ambient",
        "area",
        "asin",
        "atan",
        "atmosphere",
        "attribute",
        "calculatenormal",
        "ceil",
        "cellnoise",
        "clamp",
        "comp",
        "concat",
        "cos",
        "degrees",
        "depth",
        "Deriv",
        "diffuse",
        "distance",
        "Du",
        "Dv",
        "environment",
        "exp",
        "faceforward",
        "filterstep",
        "floor",
        "format",
        "fresnel",
        "incident",
        "length",
        "lightsource",
        "log",
        "match",
        "max",
        "min",
        "mod",
        "noise",
        "normalize",
        "ntransform",
        "opposite",
        "option",
        "phong",
        "pnoise",
        "pow",
        "printf",
        "ptlined",
        "radians",
        "random",
        "reflect",
        "refract",
        "renderinfo",
        "round",
        "setcomp",
        "setxcomp",
        "setycomp",
        "setzcomp",
        "shadow",
        "sign",
        "sin",
        "smoothstep",
        "specular",
        "specularbrdf",
        "spline",
        "sqrt",
        "step",
        "tan",
        "texture",
        "textureinfo",
        "trace",
        "transform",
        "vtransform",
        "xcomp",
        "ycomp",
        "zcomp"
    ];
    const TYPES = [
        "matrix",
        "float",
        "color",
        "point",
        "normal",
        "vector"
    ];
    const KEYWORDS = [
        "while",
        "for",
        "if",
        "do",
        "return",
        "else",
        "break",
        "extern",
        "continue"
    ];
    const CLASS_DEFINITION = {
        match: [
            /(surface|displacement|light|volume|imager)/,
            /\s+/,
            hljs.IDENT_RE,
        ],
        scope: {
            1: "keyword",
            3: "title.class",
        }
    };
    return {
        name: 'RenderMan RSL',
        keywords: {
            keyword: KEYWORDS,
            built_in: BUILT_INS,
            type: TYPES
        },
        illegal: '</',
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            hljs.C_NUMBER_MODE,
            {
                className: 'meta',
                begin: '#',
                end: '$'
            },
            CLASS_DEFINITION,
            {
                beginKeywords: 'illuminate illuminance gather',
                end: '\\('
            }
        ]
    };
}
export { rsl as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNsLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvcnNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsR0FBRyxDQUFDLElBQUk7SUFDZixNQUFNLFNBQVMsR0FBRztRQUNoQixLQUFLO1FBQ0wsTUFBTTtRQUNOLFNBQVM7UUFDVCxNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixZQUFZO1FBQ1osV0FBVztRQUNYLGlCQUFpQjtRQUNqQixNQUFNO1FBQ04sV0FBVztRQUNYLE9BQU87UUFDUCxNQUFNO1FBQ04sUUFBUTtRQUNSLEtBQUs7UUFDTCxTQUFTO1FBQ1QsT0FBTztRQUNQLE9BQU87UUFDUCxTQUFTO1FBQ1QsVUFBVTtRQUNWLElBQUk7UUFDSixJQUFJO1FBQ0osYUFBYTtRQUNiLEtBQUs7UUFDTCxhQUFhO1FBQ2IsWUFBWTtRQUNaLE9BQU87UUFDUCxRQUFRO1FBQ1IsU0FBUztRQUNULFVBQVU7UUFDVixRQUFRO1FBQ1IsYUFBYTtRQUNiLEtBQUs7UUFDTCxPQUFPO1FBQ1AsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsT0FBTztRQUNQLFdBQVc7UUFDWCxZQUFZO1FBQ1osVUFBVTtRQUNWLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLEtBQUs7UUFDTCxRQUFRO1FBQ1IsU0FBUztRQUNULFNBQVM7UUFDVCxRQUFRO1FBQ1IsU0FBUztRQUNULFNBQVM7UUFDVCxZQUFZO1FBQ1osT0FBTztRQUNQLFNBQVM7UUFDVCxVQUFVO1FBQ1YsVUFBVTtRQUNWLFVBQVU7UUFDVixRQUFRO1FBQ1IsTUFBTTtRQUNOLEtBQUs7UUFDTCxZQUFZO1FBQ1osVUFBVTtRQUNWLGNBQWM7UUFDZCxRQUFRO1FBQ1IsTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsU0FBUztRQUNULGFBQWE7UUFDYixPQUFPO1FBQ1AsV0FBVztRQUNYLFlBQVk7UUFDWixPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87S0FDUixDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUc7UUFDWixRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7S0FDVCxDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUc7UUFDZixPQUFPO1FBQ1AsS0FBSztRQUNMLElBQUk7UUFDSixJQUFJO1FBQ0osUUFBUTtRQUNSLE1BQU07UUFDTixPQUFPO1FBQ1AsUUFBUTtRQUNSLFVBQVU7S0FDWCxDQUFDO0lBRUYsTUFBTSxnQkFBZ0IsR0FBRztRQUN2QixLQUFLLEVBQUU7WUFDTCw0Q0FBNEM7WUFDNUMsS0FBSztZQUNMLElBQUksQ0FBQyxRQUFRO1NBQ2Q7UUFDRCxLQUFLLEVBQUU7WUFDTCxDQUFDLEVBQUUsU0FBUztZQUNaLENBQUMsRUFBRSxhQUFhO1NBQ2pCO0tBQ0YsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsZUFBZTtRQUNyQixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsU0FBUztZQUNuQixJQUFJLEVBQUUsS0FBSztTQUNaO1FBQ0QsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsbUJBQW1CO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsZ0JBQWdCO1lBQ3JCLElBQUksQ0FBQyxhQUFhO1lBQ2xCO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRzthQUNUO1lBQ0QsZ0JBQWdCO1lBQ2hCO2dCQUNFLGFBQWEsRUFBRSwrQkFBK0I7Z0JBQzlDLEdBQUcsRUFBRSxLQUFLO2FBQ1g7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogUmVuZGVyTWFuIFJTTFxuQXV0aG9yOiBLb25zdGFudGluIEV2ZG9raW1lbmtvIDxxZXdlcnR5QGdtYWlsLmNvbT5cbkNvbnRyaWJ1dG9yczogU2h1ZW4tSHVlaSBHdWFuIDxkcmFrZS5ndWFuQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vcmVuZGVybWFuLnBpeGFyLmNvbS9yZXNvdXJjZXMvUmVuZGVyTWFuXzIwL3NoYWRpbmdMYW5ndWFnZS5odG1sXG5DYXRlZ29yeTogZ3JhcGhpY3NcbiovXG5cbmZ1bmN0aW9uIHJzbChobGpzKSB7XG4gIGNvbnN0IEJVSUxUX0lOUyA9IFtcbiAgICBcImFic1wiLFxuICAgIFwiYWNvc1wiLFxuICAgIFwiYW1iaWVudFwiLFxuICAgIFwiYXJlYVwiLFxuICAgIFwiYXNpblwiLFxuICAgIFwiYXRhblwiLFxuICAgIFwiYXRtb3NwaGVyZVwiLFxuICAgIFwiYXR0cmlidXRlXCIsXG4gICAgXCJjYWxjdWxhdGVub3JtYWxcIixcbiAgICBcImNlaWxcIixcbiAgICBcImNlbGxub2lzZVwiLFxuICAgIFwiY2xhbXBcIixcbiAgICBcImNvbXBcIixcbiAgICBcImNvbmNhdFwiLFxuICAgIFwiY29zXCIsXG4gICAgXCJkZWdyZWVzXCIsXG4gICAgXCJkZXB0aFwiLFxuICAgIFwiRGVyaXZcIixcbiAgICBcImRpZmZ1c2VcIixcbiAgICBcImRpc3RhbmNlXCIsXG4gICAgXCJEdVwiLFxuICAgIFwiRHZcIixcbiAgICBcImVudmlyb25tZW50XCIsXG4gICAgXCJleHBcIixcbiAgICBcImZhY2Vmb3J3YXJkXCIsXG4gICAgXCJmaWx0ZXJzdGVwXCIsXG4gICAgXCJmbG9vclwiLFxuICAgIFwiZm9ybWF0XCIsXG4gICAgXCJmcmVzbmVsXCIsXG4gICAgXCJpbmNpZGVudFwiLFxuICAgIFwibGVuZ3RoXCIsXG4gICAgXCJsaWdodHNvdXJjZVwiLFxuICAgIFwibG9nXCIsXG4gICAgXCJtYXRjaFwiLFxuICAgIFwibWF4XCIsXG4gICAgXCJtaW5cIixcbiAgICBcIm1vZFwiLFxuICAgIFwibm9pc2VcIixcbiAgICBcIm5vcm1hbGl6ZVwiLFxuICAgIFwibnRyYW5zZm9ybVwiLFxuICAgIFwib3Bwb3NpdGVcIixcbiAgICBcIm9wdGlvblwiLFxuICAgIFwicGhvbmdcIixcbiAgICBcInBub2lzZVwiLFxuICAgIFwicG93XCIsXG4gICAgXCJwcmludGZcIixcbiAgICBcInB0bGluZWRcIixcbiAgICBcInJhZGlhbnNcIixcbiAgICBcInJhbmRvbVwiLFxuICAgIFwicmVmbGVjdFwiLFxuICAgIFwicmVmcmFjdFwiLFxuICAgIFwicmVuZGVyaW5mb1wiLFxuICAgIFwicm91bmRcIixcbiAgICBcInNldGNvbXBcIixcbiAgICBcInNldHhjb21wXCIsXG4gICAgXCJzZXR5Y29tcFwiLFxuICAgIFwic2V0emNvbXBcIixcbiAgICBcInNoYWRvd1wiLFxuICAgIFwic2lnblwiLFxuICAgIFwic2luXCIsXG4gICAgXCJzbW9vdGhzdGVwXCIsXG4gICAgXCJzcGVjdWxhclwiLFxuICAgIFwic3BlY3VsYXJicmRmXCIsXG4gICAgXCJzcGxpbmVcIixcbiAgICBcInNxcnRcIixcbiAgICBcInN0ZXBcIixcbiAgICBcInRhblwiLFxuICAgIFwidGV4dHVyZVwiLFxuICAgIFwidGV4dHVyZWluZm9cIixcbiAgICBcInRyYWNlXCIsXG4gICAgXCJ0cmFuc2Zvcm1cIixcbiAgICBcInZ0cmFuc2Zvcm1cIixcbiAgICBcInhjb21wXCIsXG4gICAgXCJ5Y29tcFwiLFxuICAgIFwiemNvbXBcIlxuICBdO1xuXG4gIGNvbnN0IFRZUEVTID0gW1xuICAgIFwibWF0cml4XCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwiY29sb3JcIixcbiAgICBcInBvaW50XCIsXG4gICAgXCJub3JtYWxcIixcbiAgICBcInZlY3RvclwiXG4gIF07XG5cbiAgY29uc3QgS0VZV09SRFMgPSBbXG4gICAgXCJ3aGlsZVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiZG9cIixcbiAgICBcInJldHVyblwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImV4dGVyblwiLFxuICAgIFwiY29udGludWVcIlxuICBdO1xuXG4gIGNvbnN0IENMQVNTX0RFRklOSVRJT04gPSB7XG4gICAgbWF0Y2g6IFtcbiAgICAgIC8oc3VyZmFjZXxkaXNwbGFjZW1lbnR8bGlnaHR8dm9sdW1lfGltYWdlcikvLFxuICAgICAgL1xccysvLFxuICAgICAgaGxqcy5JREVOVF9SRSxcbiAgICBdLFxuICAgIHNjb3BlOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuY2xhc3NcIixcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUmVuZGVyTWFuIFJTTCcsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTLFxuICAgICAgYnVpbHRfaW46IEJVSUxUX0lOUyxcbiAgICAgIHR5cGU6IFRZUEVTXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAnIycsXG4gICAgICAgIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgQ0xBU1NfREVGSU5JVElPTixcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2lsbHVtaW5hdGUgaWxsdW1pbmFuY2UgZ2F0aGVyJyxcbiAgICAgICAgZW5kOiAnXFxcXCgnXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyByc2wgYXMgZGVmYXVsdCB9O1xuIl19