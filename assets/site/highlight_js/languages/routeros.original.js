function routeros(hljs) {
    const STATEMENTS = 'foreach do while for if from to step else on-error and or not in';
    const GLOBAL_COMMANDS = 'global local beep delay put len typeof pick log time set find environment terminal error execute parse resolve toarray tobool toid toip toip6 tonum tostr totime';
    const COMMON_COMMANDS = 'add remove enable disable set get print export edit find run debug error info warning';
    const LITERALS = 'true false yes no nothing nil null';
    const OBJECTS = 'traffic-flow traffic-generator firewall scheduler aaa accounting address-list address align area bandwidth-server bfd bgp bridge client clock community config connection console customer default dhcp-client dhcp-server discovery dns e-mail ethernet filter firmware gps graphing group hardware health hotspot identity igmp-proxy incoming instance interface ip ipsec ipv6 irq l2tp-server lcd ldp logging mac-server mac-winbox mangle manual mirror mme mpls nat nd neighbor network note ntp ospf ospf-v3 ovpn-server page peer pim ping policy pool port ppp pppoe-client pptp-server prefix profile proposal proxy queue radius resource rip ripng route routing screen script security-profiles server service service-port settings shares smb sms sniffer snmp snooper socks sstp-server system tool tracking type upgrade upnp user-manager users user vlan secret vrrp watchdog web-access wireless pptp pppoe lan wan layer7-protocol lease simple raw';
    const VAR = {
        className: 'variable',
        variants: [
            { begin: /\$[\w\d#@][\w\d_]*/ },
            { begin: /\$\{(.*?)\}/ }
        ]
    };
    const QUOTE_STRING = {
        className: 'string',
        begin: /"/,
        end: /"/,
        contains: [
            hljs.BACKSLASH_ESCAPE,
            VAR,
            {
                className: 'variable',
                begin: /\$\(/,
                end: /\)/,
                contains: [hljs.BACKSLASH_ESCAPE]
            }
        ]
    };
    const APOS_STRING = {
        className: 'string',
        begin: /'/,
        end: /'/
    };
    return {
        name: 'MikroTik RouterOS script',
        aliases: ['mikrotik'],
        case_insensitive: true,
        keywords: {
            $pattern: /:?[\w-]+/,
            literal: LITERALS,
            keyword: STATEMENTS + ' :' + STATEMENTS.split(' ').join(' :') + ' :' + GLOBAL_COMMANDS.split(' ').join(' :')
        },
        contains: [
            {
                variants: [
                    {
                        begin: /\/\*/,
                        end: /\*\//
                    },
                    {
                        begin: /\/\//,
                        end: /$/
                    },
                    {
                        begin: /<\//,
                        end: />/
                    }
                ],
                illegal: /./
            },
            hljs.COMMENT('^#', '$'),
            QUOTE_STRING,
            APOS_STRING,
            VAR,
            {
                begin: /[\w-]+=([^\s{}[\]()>]+)/,
                relevance: 0,
                returnBegin: true,
                contains: [
                    {
                        className: 'attribute',
                        begin: /[^=]+/
                    },
                    {
                        begin: /=/,
                        endsWithParent: true,
                        relevance: 0,
                        contains: [
                            QUOTE_STRING,
                            APOS_STRING,
                            VAR,
                            {
                                className: 'literal',
                                begin: '\\b(' + LITERALS.split(' ').join('|') + ')\\b'
                            },
                            {
                                begin: /("[^"]*"|[^\s{}[\]]+)/
                            }
                        ]
                    }
                ]
            },
            {
                className: 'number',
                begin: /\*[0-9a-fA-F]+/
            },
            {
                begin: '\\b(' + COMMON_COMMANDS.split(' ').join('|') + ')([\\s[(\\]|])',
                returnBegin: true,
                contains: [
                    {
                        className: 'built_in',
                        begin: /\w+/
                    }
                ]
            },
            {
                className: 'built_in',
                variants: [
                    { begin: '(\\.\\./|/|\\s)((' + OBJECTS.split(' ').join('|') + ');?\\s)+' },
                    {
                        begin: /\.\./,
                        relevance: 0
                    }
                ]
            }
        ]
    };
}
export { routeros as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyb3MuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9yb3V0ZXJvcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFhQSxTQUFTLFFBQVEsQ0FBQyxJQUFJO0lBQ3BCLE1BQU0sVUFBVSxHQUFHLGtFQUFrRSxDQUFDO0lBR3RGLE1BQU0sZUFBZSxHQUFHLGtLQUFrSyxDQUFDO0lBRzNMLE1BQU0sZUFBZSxHQUFHLHVGQUF1RixDQUFDO0lBRWhILE1BQU0sUUFBUSxHQUFHLG9DQUFvQyxDQUFDO0lBRXRELE1BQU0sT0FBTyxHQUFHLDA2QkFBMDZCLENBQUM7SUFFMzdCLE1BQU0sR0FBRyxHQUFHO1FBQ1YsU0FBUyxFQUFFLFVBQVU7UUFDckIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUU7WUFDL0IsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFO1NBQ3pCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHO1FBQ25CLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxHQUFHO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixRQUFRLEVBQUU7WUFDUixJQUFJLENBQUMsZ0JBQWdCO1lBQ3JCLEdBQUc7WUFDSDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFLENBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFFO2FBQ3BDO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxXQUFXLEdBQUc7UUFDbEIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLEdBQUc7UUFDVixHQUFHLEVBQUUsR0FBRztLQUNULENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLDBCQUEwQjtRQUNoQyxPQUFPLEVBQUUsQ0FBRSxVQUFVLENBQUU7UUFDdkIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsVUFBVTtZQUNwQixPQUFPLEVBQUUsUUFBUTtZQUNqQixPQUFPLEVBQUUsVUFBVSxHQUFHLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzdHO1FBQ0QsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxNQUFNO3dCQUNiLEdBQUcsRUFBRSxNQUFNO3FCQUNaO29CQUNEO3dCQUNFLEtBQUssRUFBRSxNQUFNO3dCQUNiLEdBQUcsRUFBRSxHQUFHO3FCQUNUO29CQUNEO3dCQUNFLEtBQUssRUFBRSxLQUFLO3dCQUNaLEdBQUcsRUFBRSxHQUFHO3FCQUNUO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxHQUFHO2FBQ2I7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7WUFDdkIsWUFBWTtZQUNaLFdBQVc7WUFDWCxHQUFHO1lBRUg7Z0JBRUUsS0FBSyxFQUFFLHlCQUF5QjtnQkFDaEMsU0FBUyxFQUFFLENBQUM7Z0JBQ1osV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUUsV0FBVzt3QkFDdEIsS0FBSyxFQUFFLE9BQU87cUJBQ2Y7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsY0FBYyxFQUFFLElBQUk7d0JBQ3BCLFNBQVMsRUFBRSxDQUFDO3dCQUNaLFFBQVEsRUFBRTs0QkFDUixZQUFZOzRCQUNaLFdBQVc7NEJBQ1gsR0FBRzs0QkFDSDtnQ0FDRSxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsS0FBSyxFQUFFLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNOzZCQUN2RDs0QkFDRDtnQ0FFRSxLQUFLLEVBQUUsdUJBQXVCOzZCQUFFO3lCQWlCbkM7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNEO2dCQUVFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsZ0JBQWdCO2FBQ3hCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxnQkFBZ0I7Z0JBQ3ZFLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsU0FBUyxFQUFFLFVBQVU7d0JBQ3JCLEtBQUssRUFBRSxLQUFLO3FCQUNiO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxTQUFTLEVBQUUsVUFBVTtnQkFDckIsUUFBUSxFQUFFO29CQUNSLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRTtvQkFDMUU7d0JBQ0UsS0FBSyxFQUFFLE1BQU07d0JBQ2IsU0FBUyxFQUFFLENBQUM7cUJBQ2I7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsUUFBUSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBNaWtyb1RpayBSb3V0ZXJPUyBzY3JpcHRcbkF1dGhvcjogSXZhbiBEZW1lbnRldiA8aXZhbl9kaXZAbWFpbC5ydT5cbkRlc2NyaXB0aW9uOiBTY3JpcHRpbmcgaG9zdCBwcm92aWRlcyBhIHdheSB0byBhdXRvbWF0ZSBzb21lIHJvdXRlciBtYWludGVuYW5jZSB0YXNrcyBieSBtZWFucyBvZiBleGVjdXRpbmcgdXNlci1kZWZpbmVkIHNjcmlwdHMgYm91bmRlZCB0byBzb21lIGV2ZW50IG9jY3VycmVuY2VcbldlYnNpdGU6IGh0dHBzOi8vd2lraS5taWtyb3Rpay5jb20vd2lraS9NYW51YWw6U2NyaXB0aW5nXG4qL1xuXG4vLyBDb2xvcnMgZnJvbSBSb3V0ZXJPUyB0ZXJtaW5hbDpcbi8vICAgZ3JlZW4gICAgICAgIC0gIzBFOUEwMFxuLy8gICB0ZWFsICAgICAgICAgLSAjMEM5QTlBXG4vLyAgIHB1cnBsZSAgICAgICAtICM5OTA2OUFcbi8vICAgbGlnaHQtYnJvd24gIC0gIzlBOTkwMFxuXG5mdW5jdGlvbiByb3V0ZXJvcyhobGpzKSB7XG4gIGNvbnN0IFNUQVRFTUVOVFMgPSAnZm9yZWFjaCBkbyB3aGlsZSBmb3IgaWYgZnJvbSB0byBzdGVwIGVsc2Ugb24tZXJyb3IgYW5kIG9yIG5vdCBpbic7XG5cbiAgLy8gR2xvYmFsIGNvbW1hbmRzOiBFdmVyeSBnbG9iYWwgY29tbWFuZCBzaG91bGQgc3RhcnQgd2l0aCBcIjpcIiB0b2tlbiwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgdHJlYXRlZCBhcyB2YXJpYWJsZS5cbiAgY29uc3QgR0xPQkFMX0NPTU1BTkRTID0gJ2dsb2JhbCBsb2NhbCBiZWVwIGRlbGF5IHB1dCBsZW4gdHlwZW9mIHBpY2sgbG9nIHRpbWUgc2V0IGZpbmQgZW52aXJvbm1lbnQgdGVybWluYWwgZXJyb3IgZXhlY3V0ZSBwYXJzZSByZXNvbHZlIHRvYXJyYXkgdG9ib29sIHRvaWQgdG9pcCB0b2lwNiB0b251bSB0b3N0ciB0b3RpbWUnO1xuXG4gIC8vIENvbW1vbiBjb21tYW5kczogRm9sbG93aW5nIGNvbW1hbmRzIGF2YWlsYWJsZSBmcm9tIG1vc3Qgc3ViLW1lbnVzOlxuICBjb25zdCBDT01NT05fQ09NTUFORFMgPSAnYWRkIHJlbW92ZSBlbmFibGUgZGlzYWJsZSBzZXQgZ2V0IHByaW50IGV4cG9ydCBlZGl0IGZpbmQgcnVuIGRlYnVnIGVycm9yIGluZm8gd2FybmluZyc7XG5cbiAgY29uc3QgTElURVJBTFMgPSAndHJ1ZSBmYWxzZSB5ZXMgbm8gbm90aGluZyBuaWwgbnVsbCc7XG5cbiAgY29uc3QgT0JKRUNUUyA9ICd0cmFmZmljLWZsb3cgdHJhZmZpYy1nZW5lcmF0b3IgZmlyZXdhbGwgc2NoZWR1bGVyIGFhYSBhY2NvdW50aW5nIGFkZHJlc3MtbGlzdCBhZGRyZXNzIGFsaWduIGFyZWEgYmFuZHdpZHRoLXNlcnZlciBiZmQgYmdwIGJyaWRnZSBjbGllbnQgY2xvY2sgY29tbXVuaXR5IGNvbmZpZyBjb25uZWN0aW9uIGNvbnNvbGUgY3VzdG9tZXIgZGVmYXVsdCBkaGNwLWNsaWVudCBkaGNwLXNlcnZlciBkaXNjb3ZlcnkgZG5zIGUtbWFpbCBldGhlcm5ldCBmaWx0ZXIgZmlybXdhcmUgZ3BzIGdyYXBoaW5nIGdyb3VwIGhhcmR3YXJlIGhlYWx0aCBob3RzcG90IGlkZW50aXR5IGlnbXAtcHJveHkgaW5jb21pbmcgaW5zdGFuY2UgaW50ZXJmYWNlIGlwIGlwc2VjIGlwdjYgaXJxIGwydHAtc2VydmVyIGxjZCBsZHAgbG9nZ2luZyBtYWMtc2VydmVyIG1hYy13aW5ib3ggbWFuZ2xlIG1hbnVhbCBtaXJyb3IgbW1lIG1wbHMgbmF0IG5kIG5laWdoYm9yIG5ldHdvcmsgbm90ZSBudHAgb3NwZiBvc3BmLXYzIG92cG4tc2VydmVyIHBhZ2UgcGVlciBwaW0gcGluZyBwb2xpY3kgcG9vbCBwb3J0IHBwcCBwcHBvZS1jbGllbnQgcHB0cC1zZXJ2ZXIgcHJlZml4IHByb2ZpbGUgcHJvcG9zYWwgcHJveHkgcXVldWUgcmFkaXVzIHJlc291cmNlIHJpcCByaXBuZyByb3V0ZSByb3V0aW5nIHNjcmVlbiBzY3JpcHQgc2VjdXJpdHktcHJvZmlsZXMgc2VydmVyIHNlcnZpY2Ugc2VydmljZS1wb3J0IHNldHRpbmdzIHNoYXJlcyBzbWIgc21zIHNuaWZmZXIgc25tcCBzbm9vcGVyIHNvY2tzIHNzdHAtc2VydmVyIHN5c3RlbSB0b29sIHRyYWNraW5nIHR5cGUgdXBncmFkZSB1cG5wIHVzZXItbWFuYWdlciB1c2VycyB1c2VyIHZsYW4gc2VjcmV0IHZycnAgd2F0Y2hkb2cgd2ViLWFjY2VzcyB3aXJlbGVzcyBwcHRwIHBwcG9lIGxhbiB3YW4gbGF5ZXI3LXByb3RvY29sIGxlYXNlIHNpbXBsZSByYXcnO1xuXG4gIGNvbnN0IFZBUiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IC9cXCRbXFx3XFxkI0BdW1xcd1xcZF9dKi8gfSxcbiAgICAgIHsgYmVnaW46IC9cXCRcXHsoLio/KVxcfS8gfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBRVU9URV9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogL1wiLyxcbiAgICBlbmQ6IC9cIi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgIFZBUixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogL1xcJFxcKC8sXG4gICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IEFQT1NfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46IC8nLyxcbiAgICBlbmQ6IC8nL1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ01pa3JvVGlrIFJvdXRlck9TIHNjcmlwdCcsXG4gICAgYWxpYXNlczogWyAnbWlrcm90aWsnIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46IC86P1tcXHctXSsvLFxuICAgICAgbGl0ZXJhbDogTElURVJBTFMsXG4gICAgICBrZXl3b3JkOiBTVEFURU1FTlRTICsgJyA6JyArIFNUQVRFTUVOVFMuc3BsaXQoJyAnKS5qb2luKCcgOicpICsgJyA6JyArIEdMT0JBTF9DT01NQU5EUy5zcGxpdCgnICcpLmpvaW4oJyA6JylcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7IC8vIGlsbGVnYWwgc3ludGF4XG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyAvLyAtLSBjb21tZW50XG4gICAgICAgICAgICBiZWdpbjogL1xcL1xcKi8sXG4gICAgICAgICAgICBlbmQ6IC9cXCpcXC8vXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IC8vIFN0YW4gY29tbWVudFxuICAgICAgICAgICAgYmVnaW46IC9cXC9cXC8vLFxuICAgICAgICAgICAgZW5kOiAvJC9cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgLy8gSFRNTCB0YWdzXG4gICAgICAgICAgICBiZWdpbjogLzxcXC8vLFxuICAgICAgICAgICAgZW5kOiAvPi9cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGlsbGVnYWw6IC8uL1xuICAgICAgfSxcbiAgICAgIGhsanMuQ09NTUVOVCgnXiMnLCAnJCcpLFxuICAgICAgUVVPVEVfU1RSSU5HLFxuICAgICAgQVBPU19TVFJJTkcsXG4gICAgICBWQVIsXG4gICAgICAvLyBhdHRyaWJ1dGU9dmFsdWVcbiAgICAgIHtcbiAgICAgICAgLy8gPiBpcyB0byBhdm9pZCBtYXRjaGVzIHdpdGggPT4gaW4gb3RoZXIgZ3JhbW1hcnNcbiAgICAgICAgYmVnaW46IC9bXFx3LV0rPShbXlxcc3t9W1xcXSgpPl0rKS8sXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgICAgIGJlZ2luOiAvW149XSsvXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLz0vLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBRVU9URV9TVFJJTkcsXG4gICAgICAgICAgICAgIEFQT1NfU1RSSU5HLFxuICAgICAgICAgICAgICBWQVIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1xcXFxiKCcgKyBMSVRFUkFMUy5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcpXFxcXGInXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBEbyBub3QgZm9ybWF0IHVuY2xhc3NpZmllZCB2YWx1ZXMuIE5lZWRlZCB0byBleGNsdWRlIGhpZ2hsaWdodGluZyBvZiB2YWx1ZXMgYXMgYnVpbHRfaW4uXG4gICAgICAgICAgICAgICAgYmVnaW46IC8oXCJbXlwiXSpcInxbXlxcc3t9W1xcXV0rKS8gfVxuICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gSVB2NCBhZGRyZXNzZXMgYW5kIHN1Ym5ldHNcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgICAgICB7YmVnaW46IElQQUREUl93QklUTUFTSysnKCwnK0lQQUREUl93QklUTUFTSysnKSonfSwgLy8xOTIuMTY4LjAuMC8yNCwxLjIuMy4wLzI0XG4gICAgICAgICAgICAgICAgICB7YmVnaW46IElQQUREUisnLScrSVBBRERSfSwgICAgICAgLy8gMTkyLjE2OC4wLjEtMTkyLjE2OC4wLjNcbiAgICAgICAgICAgICAgICAgIHtiZWdpbjogSVBBRERSKycoLCcrSVBBRERSKycpKid9LCAvLyAxOTIuMTY4LjAuMSwxOTIuMTY4LjAuMzQsMTkyLjE2OC4yNC4xLDE5Mi4xNjguMC4xXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gTUFDIGFkZHJlc3NlcyBhbmQgREhDUCBDbGllbnQgSURzXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogL1xcYigxOik/KFswLTlBLUZhLWZdezEsMn1bOi1dKXs1fShbMC05QS1GYS1mXSl7MSwyfVxcYi8sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICovXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBIRVggdmFsdWVzXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAvXFwqWzAtOWEtZkEtRl0rL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcYignICsgQ09NTU9OX0NPTU1BTkRTLnNwbGl0KCcgJykuam9pbignfCcpICsgJykoW1xcXFxzWyhcXFxcXXxdKScsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2J1aWx0X2luJywgLy8gJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFx3Ky9cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2J1aWx0X2luJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiAnKFxcXFwuXFxcXC4vfC98XFxcXHMpKCgnICsgT0JKRUNUUy5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcpOz9cXFxccykrJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAvXFwuXFwuLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgcm91dGVyb3MgYXMgZGVmYXVsdCB9O1xuIl19