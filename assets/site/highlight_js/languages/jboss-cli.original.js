function jbossCli(hljs) {
    const PARAM = {
        begin: /[\w-]+ *=/,
        returnBegin: true,
        relevance: 0,
        contains: [
            {
                className: 'attr',
                begin: /[\w-]+/
            }
        ]
    };
    const PARAMSBLOCK = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        contains: [PARAM],
        relevance: 0
    };
    const OPERATION = {
        className: 'function',
        begin: /:[\w\-.]+/,
        relevance: 0
    };
    const PATH = {
        className: 'string',
        begin: /\B([\/.])[\w\-.\/=]+/
    };
    const COMMAND_PARAMS = {
        className: 'params',
        begin: /--[\w\-=\/]+/
    };
    return {
        name: 'JBoss CLI',
        aliases: ['wildfly-cli'],
        keywords: {
            $pattern: '[a-z\-]+',
            keyword: 'alias batch cd clear command connect connection-factory connection-info data-source deploy '
                + 'deployment-info deployment-overlay echo echo-dmr help history if jdbc-driver-info jms-queue|20 jms-topic|20 ls '
                + 'patch pwd quit read-attribute read-operation reload rollout-plan run-batch set shutdown try unalias '
                + 'undeploy unset version xa-data-source',
            literal: 'true false'
        },
        contains: [
            hljs.HASH_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            COMMAND_PARAMS,
            OPERATION,
            PATH,
            PARAMSBLOCK
        ]
    };
}
export { jbossCli as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamJvc3MtY2xpLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvamJvc3MtY2xpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsUUFBUSxDQUFDLElBQUk7SUFDcEIsTUFBTSxLQUFLLEdBQUc7UUFDWixLQUFLLEVBQUUsV0FBVztRQUNsQixXQUFXLEVBQUUsSUFBSTtRQUNqQixTQUFTLEVBQUUsQ0FBQztRQUNaLFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsUUFBUTthQUNoQjtTQUNGO0tBQ0YsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxJQUFJO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxRQUFRLEVBQUUsQ0FBRSxLQUFLLENBQUU7UUFDbkIsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBQ0YsTUFBTSxTQUFTLEdBQUc7UUFDaEIsU0FBUyxFQUFFLFVBQVU7UUFDckIsS0FBSyxFQUFFLFdBQVc7UUFDbEIsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBQ0YsTUFBTSxJQUFJLEdBQUc7UUFDWCxTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsc0JBQXNCO0tBQzlCLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRztRQUNyQixTQUFTLEVBQUUsUUFBUTtRQUNuQixLQUFLLEVBQUUsY0FBYztLQUN0QixDQUFDO0lBQ0YsT0FBTztRQUNMLElBQUksRUFBRSxXQUFXO1FBQ2pCLE9BQU8sRUFBRSxDQUFFLGFBQWEsQ0FBRTtRQUMxQixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsVUFBVTtZQUNwQixPQUFPLEVBQUUsNkZBQTZGO2tCQUNwRyxpSEFBaUg7a0JBQ2pILHNHQUFzRztrQkFDdEcsdUNBQXVDO1lBQ3pDLE9BQU8sRUFBRSxZQUFZO1NBQ3RCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLGNBQWM7WUFDZCxTQUFTO1lBQ1QsSUFBSTtZQUNKLFdBQVc7U0FDWjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLFFBQVEsSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gTGFuZ3VhZ2U6IEpCb3NzIENMSVxuIEF1dGhvcjogUmFwaGHDq2wgUGFycsOrZSA8cnBhcnJlZUBlZGM0aXQuY29tPlxuIERlc2NyaXB0aW9uOiBsYW5ndWFnZSBkZWZpbml0aW9uIGpib3NzIGNsaVxuIFdlYnNpdGU6IGh0dHBzOi8vZG9jcy5qYm9zcy5vcmcvYXV0aG9yL2Rpc3BsYXkvV0ZMWS9Db21tYW5kK0xpbmUrSW50ZXJmYWNlXG4gQ2F0ZWdvcnk6IGNvbmZpZ1xuICovXG5cbmZ1bmN0aW9uIGpib3NzQ2xpKGhsanMpIHtcbiAgY29uc3QgUEFSQU0gPSB7XG4gICAgYmVnaW46IC9bXFx3LV0rICo9LyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgICAgIGJlZ2luOiAvW1xcdy1dKy9cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IFBBUkFNU0JMT0NLID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46IC9cXCgvLFxuICAgIGVuZDogL1xcKS8sXG4gICAgY29udGFpbnM6IFsgUEFSQU0gXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgT1BFUkFUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbjogLzpbXFx3XFwtLl0rLyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgUEFUSCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvXFxCKFtcXC8uXSlbXFx3XFwtLlxcLz1dKy9cbiAgfTtcbiAgY29uc3QgQ09NTUFORF9QQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogLy0tW1xcd1xcLT1cXC9dKy9cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnSkJvc3MgQ0xJJyxcbiAgICBhbGlhc2VzOiBbICd3aWxkZmx5LWNsaScgXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46ICdbYS16XFwtXSsnLFxuICAgICAga2V5d29yZDogJ2FsaWFzIGJhdGNoIGNkIGNsZWFyIGNvbW1hbmQgY29ubmVjdCBjb25uZWN0aW9uLWZhY3RvcnkgY29ubmVjdGlvbi1pbmZvIGRhdGEtc291cmNlIGRlcGxveSAnXG4gICAgICArICdkZXBsb3ltZW50LWluZm8gZGVwbG95bWVudC1vdmVybGF5IGVjaG8gZWNoby1kbXIgaGVscCBoaXN0b3J5IGlmIGpkYmMtZHJpdmVyLWluZm8gam1zLXF1ZXVlfDIwIGptcy10b3BpY3wyMCBscyAnXG4gICAgICArICdwYXRjaCBwd2QgcXVpdCByZWFkLWF0dHJpYnV0ZSByZWFkLW9wZXJhdGlvbiByZWxvYWQgcm9sbG91dC1wbGFuIHJ1bi1iYXRjaCBzZXQgc2h1dGRvd24gdHJ5IHVuYWxpYXMgJ1xuICAgICAgKyAndW5kZXBsb3kgdW5zZXQgdmVyc2lvbiB4YS1kYXRhLXNvdXJjZScsIC8vIG1vZHVsZVxuICAgICAgbGl0ZXJhbDogJ3RydWUgZmFsc2UnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBDT01NQU5EX1BBUkFNUyxcbiAgICAgIE9QRVJBVElPTixcbiAgICAgIFBBVEgsXG4gICAgICBQQVJBTVNCTE9DS1xuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgamJvc3NDbGkgYXMgZGVmYXVsdCB9O1xuIl19