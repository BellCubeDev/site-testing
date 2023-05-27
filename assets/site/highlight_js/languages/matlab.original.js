function matlab(hljs) {
    const TRANSPOSE_RE = '(\'|\\.\')+';
    const TRANSPOSE = {
        relevance: 0,
        contains: [{ begin: TRANSPOSE_RE }]
    };
    return {
        name: 'Matlab',
        keywords: {
            keyword: 'arguments break case catch classdef continue else elseif end enumeration events for function '
                + 'global if methods otherwise parfor persistent properties return spmd switch try while',
            built_in: 'sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan '
                + 'atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot '
                + 'cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog '
                + 'realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal '
                + 'cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli '
                + 'besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma '
                + 'gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms '
                + 'nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones '
                + 'eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length '
                + 'ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril '
                + 'triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute '
                + 'shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i|0 inf nan '
                + 'isnan isinf isfinite j|0 why compan gallery hadamard hankel hilb invhilb magic pascal '
                + 'rosser toeplitz vander wilkinson max min nanmax nanmin mean nanmean type table '
                + 'readtable writetable sortrows sort figure plot plot3 scatter scatter3 cellfun '
                + 'legend intersect ismember procrustes hold num2cell '
        },
        illegal: '(//|"|#|/\\*|\\s+/\\w+)',
        contains: [
            {
                className: 'function',
                beginKeywords: 'function',
                end: '$',
                contains: [
                    hljs.UNDERSCORE_TITLE_MODE,
                    {
                        className: 'params',
                        variants: [
                            {
                                begin: '\\(',
                                end: '\\)'
                            },
                            {
                                begin: '\\[',
                                end: '\\]'
                            }
                        ]
                    }
                ]
            },
            {
                className: 'built_in',
                begin: /true|false/,
                relevance: 0,
                starts: TRANSPOSE
            },
            {
                begin: '[a-zA-Z][a-zA-Z_0-9]*' + TRANSPOSE_RE,
                relevance: 0
            },
            {
                className: 'number',
                begin: hljs.C_NUMBER_RE,
                relevance: 0,
                starts: TRANSPOSE
            },
            {
                className: 'string',
                begin: '\'',
                end: '\'',
                contains: [{ begin: '\'\'' }]
            },
            {
                begin: /\]|\}|\)/,
                relevance: 0,
                starts: TRANSPOSE
            },
            {
                className: 'string',
                begin: '"',
                end: '"',
                contains: [{ begin: '""' }],
                starts: TRANSPOSE
            },
            hljs.COMMENT('^\\s*%\\{\\s*$', '^\\s*%\\}\\s*$'),
            hljs.COMMENT('%', '$')
        ]
    };
}
export { matlab as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0bGFiLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvbWF0bGFiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDO0lBQ25DLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUU7S0FDdEMsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFDTCwrRkFBK0Y7a0JBQzdGLHVGQUF1RjtZQUMzRixRQUFRLEVBQ04sbUZBQW1GO2tCQUNqRixzRkFBc0Y7a0JBQ3RGLHVGQUF1RjtrQkFDdkYsZ0ZBQWdGO2tCQUNoRixrRkFBa0Y7a0JBQ2xGLGdGQUFnRjtrQkFDaEYsdUZBQXVGO2tCQUN2RixvRkFBb0Y7a0JBQ3BGLG9GQUFvRjtrQkFDcEYsc0ZBQXNGO2tCQUN0Rix1RkFBdUY7a0JBQ3ZGLHNGQUFzRjtrQkFDdEYsd0ZBQXdGO2tCQUN4RixpRkFBaUY7a0JBQ2pGLGdGQUFnRjtrQkFDaEYscURBQXFEO1NBQzFEO1FBQ0QsT0FBTyxFQUFFLHlCQUF5QjtRQUNsQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsYUFBYSxFQUFFLFVBQVU7Z0JBQ3pCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRTtvQkFDUixJQUFJLENBQUMscUJBQXFCO29CQUMxQjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsUUFBUSxFQUFFOzRCQUNSO2dDQUNFLEtBQUssRUFBRSxLQUFLO2dDQUNaLEdBQUcsRUFBRSxLQUFLOzZCQUNYOzRCQUNEO2dDQUNFLEtBQUssRUFBRSxLQUFLO2dDQUNaLEdBQUcsRUFBRSxLQUFLOzZCQUNYO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QixHQUFHLFlBQVk7Z0JBQzdDLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN2QixTQUFTLEVBQUUsQ0FBQztnQkFDWixNQUFNLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxRQUFRLEVBQUUsQ0FBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBRTthQUNoQztZQUNEO2dCQUNFLEtBQUssRUFBRSxVQUFVO2dCQUNqQixTQUFTLEVBQUUsQ0FBQztnQkFDWixNQUFNLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUUsQ0FBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBRTtnQkFDN0IsTUFBTSxFQUFFLFNBQVM7YUFDbEI7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO1lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUN2QjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogTWF0bGFiXG5BdXRob3I6IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuQ29udHJpYnV0b3JzOiBFdWdlbmUgTml6aGliaXRza3kgPG5pemhpYml0c2t5QHlhLnJ1PiwgRWdvciBSb2dvdiA8ZS5yb2dvdkBwb3N0Z3Jlc3Byby5ydT5cbldlYnNpdGU6IGh0dHBzOi8vd3d3Lm1hdGh3b3Jrcy5jb20vcHJvZHVjdHMvbWF0bGFiLmh0bWxcbkNhdGVnb3J5OiBzY2llbnRpZmljXG4qL1xuXG4vKlxuICBGb3JtYWwgc3ludGF4IGlzIG5vdCBwdWJsaXNoZWQsIGhlbHBmdWwgbGluazpcbiAgaHR0cHM6Ly9naXRodWIuY29tL2tvcm5pbG92YS1sL21hdGxhYi1JbnRlbGxpSi1wbHVnaW4vYmxvYi9tYXN0ZXIvc3JjL21haW4vZ3JhbW1hci9NYXRsYWIuYm5mXG4qL1xuZnVuY3Rpb24gbWF0bGFiKGhsanMpIHtcbiAgY29uc3QgVFJBTlNQT1NFX1JFID0gJyhcXCd8XFxcXC5cXCcpKyc7XG4gIGNvbnN0IFRSQU5TUE9TRSA9IHtcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFsgeyBiZWdpbjogVFJBTlNQT1NFX1JFIH0gXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ01hdGxhYicsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhcmd1bWVudHMgYnJlYWsgY2FzZSBjYXRjaCBjbGFzc2RlZiBjb250aW51ZSBlbHNlIGVsc2VpZiBlbmQgZW51bWVyYXRpb24gZXZlbnRzIGZvciBmdW5jdGlvbiAnXG4gICAgICAgICsgJ2dsb2JhbCBpZiBtZXRob2RzIG90aGVyd2lzZSBwYXJmb3IgcGVyc2lzdGVudCBwcm9wZXJ0aWVzIHJldHVybiBzcG1kIHN3aXRjaCB0cnkgd2hpbGUnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdzaW4gc2luZCBzaW5oIGFzaW4gYXNpbmQgYXNpbmggY29zIGNvc2QgY29zaCBhY29zIGFjb3NkIGFjb3NoIHRhbiB0YW5kIHRhbmggYXRhbiAnXG4gICAgICAgICsgJ2F0YW5kIGF0YW4yIGF0YW5oIHNlYyBzZWNkIHNlY2ggYXNlYyBhc2VjZCBhc2VjaCBjc2MgY3NjZCBjc2NoIGFjc2MgYWNzY2QgYWNzY2ggY290ICdcbiAgICAgICAgKyAnY290ZCBjb3RoIGFjb3QgYWNvdGQgYWNvdGggaHlwb3QgZXhwIGV4cG0xIGxvZyBsb2cxcCBsb2cxMCBsb2cyIHBvdzIgcmVhbHBvdyByZWFsbG9nICdcbiAgICAgICAgKyAncmVhbHNxcnQgc3FydCBudGhyb290IG5leHRwb3cyIGFicyBhbmdsZSBjb21wbGV4IGNvbmogaW1hZyByZWFsIHVud3JhcCBpc3JlYWwgJ1xuICAgICAgICArICdjcGx4cGFpciBmaXggZmxvb3IgY2VpbCByb3VuZCBtb2QgcmVtIHNpZ24gYWlyeSBiZXNzZWxqIGJlc3NlbHkgYmVzc2VsaCBiZXNzZWxpICdcbiAgICAgICAgKyAnYmVzc2VsayBiZXRhIGJldGFpbmMgYmV0YWxuIGVsbGlwaiBlbGxpcGtlIGVyZiBlcmZjIGVyZmN4IGVyZmludiBleHBpbnQgZ2FtbWEgJ1xuICAgICAgICArICdnYW1tYWluYyBnYW1tYWxuIHBzaSBsZWdlbmRyZSBjcm9zcyBkb3QgZmFjdG9yIGlzcHJpbWUgcHJpbWVzIGdjZCBsY20gcmF0IHJhdHMgcGVybXMgJ1xuICAgICAgICArICduY2hvb3NlayBmYWN0b3JpYWwgY2FydDJzcGggY2FydDJwb2wgcG9sMmNhcnQgc3BoMmNhcnQgaHN2MnJnYiByZ2IyaHN2IHplcm9zIG9uZXMgJ1xuICAgICAgICArICdleWUgcmVwbWF0IHJhbmQgcmFuZG4gbGluc3BhY2UgbG9nc3BhY2UgZnJlcXNwYWNlIG1lc2hncmlkIGFjY3VtYXJyYXkgc2l6ZSBsZW5ndGggJ1xuICAgICAgICArICduZGltcyBudW1lbCBkaXNwIGlzZW1wdHkgaXNlcXVhbCBpc2VxdWFsd2l0aGVxdWFsbmFucyBjYXQgcmVzaGFwZSBkaWFnIGJsa2RpYWcgdHJpbCAnXG4gICAgICAgICsgJ3RyaXUgZmxpcGxyIGZsaXB1ZCBmbGlwZGltIHJvdDkwIGZpbmQgc3ViMmluZCBpbmQyc3ViIGJzeGZ1biBuZGdyaWQgcGVybXV0ZSBpcGVybXV0ZSAnXG4gICAgICAgICsgJ3NoaWZ0ZGltIGNpcmNzaGlmdCBzcXVlZXplIGlzc2NhbGFyIGlzdmVjdG9yIGFucyBlcHMgcmVhbG1heCByZWFsbWluIHBpIGl8MCBpbmYgbmFuICdcbiAgICAgICAgKyAnaXNuYW4gaXNpbmYgaXNmaW5pdGUganwwIHdoeSBjb21wYW4gZ2FsbGVyeSBoYWRhbWFyZCBoYW5rZWwgaGlsYiBpbnZoaWxiIG1hZ2ljIHBhc2NhbCAnXG4gICAgICAgICsgJ3Jvc3NlciB0b2VwbGl0eiB2YW5kZXIgd2lsa2luc29uIG1heCBtaW4gbmFubWF4IG5hbm1pbiBtZWFuIG5hbm1lYW4gdHlwZSB0YWJsZSAnXG4gICAgICAgICsgJ3JlYWR0YWJsZSB3cml0ZXRhYmxlIHNvcnRyb3dzIHNvcnQgZmlndXJlIHBsb3QgcGxvdDMgc2NhdHRlciBzY2F0dGVyMyBjZWxsZnVuICdcbiAgICAgICAgKyAnbGVnZW5kIGludGVyc2VjdCBpc21lbWJlciBwcm9jcnVzdGVzIGhvbGQgbnVtMmNlbGwgJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJygvL3xcInwjfC9cXFxcKnxcXFxccysvXFxcXHcrKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLFxuICAgICAgICAgICAgICAgIGVuZDogJ1xcXFwpJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46ICdcXFxcWycsXG4gICAgICAgICAgICAgICAgZW5kOiAnXFxcXF0nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2J1aWx0X2luJyxcbiAgICAgICAgYmVnaW46IC90cnVlfGZhbHNlLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBzdGFydHM6IFRSQU5TUE9TRVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdbYS16QS1aXVthLXpBLVpfMC05XSonICsgVFJBTlNQT1NFX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBobGpzLkNfTlVNQkVSX1JFLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIHN0YXJ0czogVFJBTlNQT1NFXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcJycsXG4gICAgICAgIGVuZDogJ1xcJycsXG4gICAgICAgIGNvbnRhaW5zOiBbIHsgYmVnaW46ICdcXCdcXCcnIH0gXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXF18XFx9fFxcKS8sXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgc3RhcnRzOiBUUkFOU1BPU0VcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbIHsgYmVnaW46ICdcIlwiJyB9IF0sXG4gICAgICAgIHN0YXJ0czogVFJBTlNQT1NFXG4gICAgICB9LFxuICAgICAgaGxqcy5DT01NRU5UKCdeXFxcXHMqJVxcXFx7XFxcXHMqJCcsICdeXFxcXHMqJVxcXFx9XFxcXHMqJCcpLFxuICAgICAgaGxqcy5DT01NRU5UKCclJywgJyQnKVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgbWF0bGFiIGFzIGRlZmF1bHQgfTtcbiJdfQ==