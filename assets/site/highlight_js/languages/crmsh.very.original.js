function crmsh(hljs) {
    const RESOURCES = 'primitive rsc_template';
    const COMMANDS = 'group clone ms master location colocation order fencing_topology '
        + 'rsc_ticket acl_target acl_group user role '
        + 'tag xml';
    const PROPERTY_SETS = 'property rsc_defaults op_defaults';
    const KEYWORDS = 'params meta operations op rule attributes utilization';
    const OPERATORS = 'read write deny defined not_defined in_range date spec in '
        + 'ref reference attribute type xpath version and or lt gt tag '
        + 'lte gte eq ne \\';
    const TYPES = 'number string';
    const LITERALS = 'Master Started Slave Stopped start promote demote stop monitor true false';
    return {
        name: 'crmsh',
        aliases: [
            'crm',
            'pcmk'
        ],
        case_insensitive: true,
        keywords: {
            keyword: KEYWORDS + ' ' + OPERATORS + ' ' + TYPES,
            literal: LITERALS
        },
        contains: [
            hljs.HASH_COMMENT_MODE,
            {
                beginKeywords: 'node',
                starts: {
                    end: '\\s*([\\w_-]+:)?',
                    starts: {
                        className: 'title',
                        end: '\\s*[\\$\\w_][\\w_-]*'
                    }
                }
            },
            {
                beginKeywords: RESOURCES,
                starts: {
                    className: 'title',
                    end: '\\s*[\\$\\w_][\\w_-]*',
                    starts: { end: '\\s*@?[\\w_][\\w_\\.:-]*' }
                }
            },
            {
                begin: '\\b(' + COMMANDS.split(' ').join('|') + ')\\s+',
                keywords: COMMANDS,
                starts: {
                    className: 'title',
                    end: '[\\$\\w_][\\w_-]*'
                }
            },
            {
                beginKeywords: PROPERTY_SETS,
                starts: {
                    className: 'title',
                    end: '\\s*([\\w_-]+:)?'
                }
            },
            hljs.QUOTE_STRING_MODE,
            {
                className: 'meta',
                begin: '(ocf|systemd|service|lsb):[\\w_:-]+',
                relevance: 0
            },
            {
                className: 'number',
                begin: '\\b\\d+(\\.\\d+)?(ms|s|h|m)?',
                relevance: 0
            },
            {
                className: 'literal',
                begin: '[-]?(infinity|inf)',
                relevance: 0
            },
            {
                className: 'attr',
                begin: /([A-Za-z$_#][\w_-]+)=/,
                relevance: 0
            },
            {
                className: 'tag',
                begin: '</?',
                end: '/?>',
                relevance: 0
            }
        ]
    };
}
export { crmsh as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jtc2guanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9jcm1zaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sU0FBUyxHQUFHLHdCQUF3QixDQUFDO0lBQzNDLE1BQU0sUUFBUSxHQUFHLG1FQUFtRTtVQUM5RSw0Q0FBNEM7VUFDNUMsU0FBUyxDQUFDO0lBQ2hCLE1BQU0sYUFBYSxHQUFHLG1DQUFtQyxDQUFDO0lBQzFELE1BQU0sUUFBUSxHQUFHLHVEQUF1RCxDQUFDO0lBQ3pFLE1BQU0sU0FBUyxHQUFHLDREQUE0RDtVQUN4RSw4REFBOEQ7VUFDOUQsa0JBQWtCLENBQUM7SUFDekIsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDO0lBQzlCLE1BQU0sUUFBUSxHQUFHLDJFQUEyRSxDQUFDO0lBRTdGLE9BQU87UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRTtZQUNQLEtBQUs7WUFDTCxNQUFNO1NBQ1A7UUFDRCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxRQUFRLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSztZQUNqRCxPQUFPLEVBQUUsUUFBUTtTQUNsQjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxpQkFBaUI7WUFDdEI7Z0JBQ0UsYUFBYSxFQUFFLE1BQU07Z0JBQ3JCLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUUsa0JBQWtCO29CQUN2QixNQUFNLEVBQUU7d0JBQ04sU0FBUyxFQUFFLE9BQU87d0JBQ2xCLEdBQUcsRUFBRSx1QkFBdUI7cUJBQzdCO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxhQUFhLEVBQUUsU0FBUztnQkFDeEIsTUFBTSxFQUFFO29CQUNOLFNBQVMsRUFBRSxPQUFPO29CQUNsQixHQUFHLEVBQUUsdUJBQXVCO29CQUM1QixNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsMEJBQTBCLEVBQUU7aUJBQzVDO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU87Z0JBQ3ZELFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUU7b0JBQ04sU0FBUyxFQUFFLE9BQU87b0JBQ2xCLEdBQUcsRUFBRSxtQkFBbUI7aUJBQ3pCO2FBQ0Y7WUFDRDtnQkFDRSxhQUFhLEVBQUUsYUFBYTtnQkFDNUIsTUFBTSxFQUFFO29CQUNOLFNBQVMsRUFBRSxPQUFPO29CQUNsQixHQUFHLEVBQUUsa0JBQWtCO2lCQUN4QjthQUNGO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QjtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLHFDQUFxQztnQkFDNUMsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsOEJBQThCO2dCQUNyQyxTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLEtBQUssRUFBRSxvQkFBb0I7Z0JBQzNCLFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLHVCQUF1QjtnQkFDOUIsU0FBUyxFQUFFLENBQUM7YUFDYjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixLQUFLLEVBQUUsS0FBSztnQkFDWixHQUFHLEVBQUUsS0FBSztnQkFDVixTQUFTLEVBQUUsQ0FBQzthQUNiO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxLQUFLLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IGNybXNoXG5BdXRob3I6IEtyaXN0b2ZmZXIgR3Jvbmx1bmQgPGtncm9ubHVuZEBzdXNlLmNvbT5cbldlYnNpdGU6IGh0dHA6Ly9jcm1zaC5naXRodWIuaW9cbkRlc2NyaXB0aW9uOiBTeW50YXggSGlnaGxpZ2h0aW5nIGZvciB0aGUgY3Jtc2ggRFNMXG5DYXRlZ29yeTogY29uZmlnXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gY3Jtc2goaGxqcykge1xuICBjb25zdCBSRVNPVVJDRVMgPSAncHJpbWl0aXZlIHJzY190ZW1wbGF0ZSc7XG4gIGNvbnN0IENPTU1BTkRTID0gJ2dyb3VwIGNsb25lIG1zIG1hc3RlciBsb2NhdGlvbiBjb2xvY2F0aW9uIG9yZGVyIGZlbmNpbmdfdG9wb2xvZ3kgJ1xuICAgICAgKyAncnNjX3RpY2tldCBhY2xfdGFyZ2V0IGFjbF9ncm91cCB1c2VyIHJvbGUgJ1xuICAgICAgKyAndGFnIHhtbCc7XG4gIGNvbnN0IFBST1BFUlRZX1NFVFMgPSAncHJvcGVydHkgcnNjX2RlZmF1bHRzIG9wX2RlZmF1bHRzJztcbiAgY29uc3QgS0VZV09SRFMgPSAncGFyYW1zIG1ldGEgb3BlcmF0aW9ucyBvcCBydWxlIGF0dHJpYnV0ZXMgdXRpbGl6YXRpb24nO1xuICBjb25zdCBPUEVSQVRPUlMgPSAncmVhZCB3cml0ZSBkZW55IGRlZmluZWQgbm90X2RlZmluZWQgaW5fcmFuZ2UgZGF0ZSBzcGVjIGluICdcbiAgICAgICsgJ3JlZiByZWZlcmVuY2UgYXR0cmlidXRlIHR5cGUgeHBhdGggdmVyc2lvbiBhbmQgb3IgbHQgZ3QgdGFnICdcbiAgICAgICsgJ2x0ZSBndGUgZXEgbmUgXFxcXCc7XG4gIGNvbnN0IFRZUEVTID0gJ251bWJlciBzdHJpbmcnO1xuICBjb25zdCBMSVRFUkFMUyA9ICdNYXN0ZXIgU3RhcnRlZCBTbGF2ZSBTdG9wcGVkIHN0YXJ0IHByb21vdGUgZGVtb3RlIHN0b3AgbW9uaXRvciB0cnVlIGZhbHNlJztcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjcm1zaCcsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ2NybScsXG4gICAgICAncGNtaydcbiAgICBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTICsgJyAnICsgT1BFUkFUT1JTICsgJyAnICsgVFlQRVMsXG4gICAgICBsaXRlcmFsOiBMSVRFUkFMU1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdub2RlJyxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnXFxcXHMqKFtcXFxcd18tXSs6KT8nLFxuICAgICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgZW5kOiAnXFxcXHMqW1xcXFwkXFxcXHdfXVtcXFxcd18tXSonXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiBSRVNPVVJDRVMsXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBlbmQ6ICdcXFxccypbXFxcXCRcXFxcd19dW1xcXFx3Xy1dKicsXG4gICAgICAgICAgc3RhcnRzOiB7IGVuZDogJ1xcXFxzKkA/W1xcXFx3X11bXFxcXHdfXFxcXC46LV0qJyB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXGIoJyArIENPTU1BTkRTLnNwbGl0KCcgJykuam9pbignfCcpICsgJylcXFxccysnLFxuICAgICAgICBrZXl3b3JkczogQ09NTUFORFMsXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBlbmQ6ICdbXFxcXCRcXFxcd19dW1xcXFx3Xy1dKidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogUFJPUEVSVFlfU0VUUyxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGVuZDogJ1xcXFxzKihbXFxcXHdfLV0rOik/J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAnKG9jZnxzeXN0ZW1kfHNlcnZpY2V8bHNiKTpbXFxcXHdfOi1dKycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKyk/KG1zfHN8aHxtKT8nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgICAgICBiZWdpbjogJ1stXT8oaW5maW5pdHl8aW5mKScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgICAgIGJlZ2luOiAvKFtBLVphLXokXyNdW1xcd18tXSspPS8sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgYmVnaW46ICc8Lz8nLFxuICAgICAgICBlbmQ6ICcvPz4nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGNybXNoIGFzIGRlZmF1bHQgfTtcbiJdfQ==