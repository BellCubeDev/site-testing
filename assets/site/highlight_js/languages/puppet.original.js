function puppet(hljs) {
    const PUPPET_KEYWORDS = {
        keyword: 'and case default else elsif false if in import enherits node or true undef unless main settings $string ',
        literal: 'alias audit before loglevel noop require subscribe tag '
            + 'owner ensure group mode name|0 changes context force incl lens load_path onlyif provider returns root show_diff type_check '
            + 'en_address ip_address realname command environment hour monute month monthday special target weekday '
            + 'creates cwd ogoutput refresh refreshonly tries try_sleep umask backup checksum content ctime force ignore '
            + 'links mtime purge recurse recurselimit replace selinux_ignore_defaults selrange selrole seltype seluser source '
            + 'souirce_permissions sourceselect validate_cmd validate_replacement allowdupe attribute_membership auth_membership forcelocal gid '
            + 'ia_load_module members system host_aliases ip allowed_trunk_vlans description device_url duplex encapsulation etherchannel '
            + 'native_vlan speed principals allow_root auth_class auth_type authenticate_user k_of_n mechanisms rule session_owner shared options '
            + 'device fstype enable hasrestart directory present absent link atboot blockdevice device dump pass remounts poller_tag use '
            + 'message withpath adminfile allow_virtual allowcdrom category configfiles flavor install_options instance package_settings platform '
            + 'responsefile status uninstall_options vendor unless_system_user unless_uid binary control flags hasstatus manifest pattern restart running '
            + 'start stop allowdupe auths expiry gid groups home iterations key_membership keys managehome membership password password_max_age '
            + 'password_min_age profile_membership profiles project purge_ssh_keys role_membership roles salt shell uid baseurl cost descr enabled '
            + 'enablegroups exclude failovermethod gpgcheck gpgkey http_caching include includepkgs keepalive metadata_expire metalink mirrorlist '
            + 'priority protect proxy proxy_password proxy_username repo_gpgcheck s3_enabled skip_if_unavailable sslcacert sslclientcert sslclientkey '
            + 'sslverify mounted',
        built_in: 'architecture augeasversion blockdevices boardmanufacturer boardproductname boardserialnumber cfkey dhcp_servers '
            + 'domain ec2_ ec2_userdata facterversion filesystems ldom fqdn gid hardwareisa hardwaremodel hostname id|0 interfaces '
            + 'ipaddress ipaddress_ ipaddress6 ipaddress6_ iphostnumber is_virtual kernel kernelmajversion kernelrelease kernelversion '
            + 'kernelrelease kernelversion lsbdistcodename lsbdistdescription lsbdistid lsbdistrelease lsbmajdistrelease lsbminordistrelease '
            + 'lsbrelease macaddress macaddress_ macosx_buildversion macosx_productname macosx_productversion macosx_productverson_major '
            + 'macosx_productversion_minor manufacturer memoryfree memorysize netmask metmask_ network_ operatingsystem operatingsystemmajrelease '
            + 'operatingsystemrelease osfamily partitions path physicalprocessorcount processor processorcount productname ps puppetversion '
            + 'rubysitedir rubyversion selinux selinux_config_mode selinux_config_policy selinux_current_mode selinux_current_mode selinux_enforced '
            + 'selinux_policyversion serialnumber sp_ sshdsakey sshecdsakey sshrsakey swapencrypted swapfree swapsize timezone type uniqueid uptime '
            + 'uptime_days uptime_hours uptime_seconds uuid virtual vlans xendomains zfs_version zonenae zones zpool_version'
    };
    const COMMENT = hljs.COMMENT('#', '$');
    const IDENT_RE = '([A-Za-z_]|::)(\\w|::)*';
    const TITLE = hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE });
    const VARIABLE = {
        className: 'variable',
        begin: '\\$' + IDENT_RE
    };
    const STRING = {
        className: 'string',
        contains: [
            hljs.BACKSLASH_ESCAPE,
            VARIABLE
        ],
        variants: [
            {
                begin: /'/,
                end: /'/
            },
            {
                begin: /"/,
                end: /"/
            }
        ]
    };
    return {
        name: 'Puppet',
        aliases: ['pp'],
        contains: [
            COMMENT,
            VARIABLE,
            STRING,
            {
                beginKeywords: 'class',
                end: '\\{|;',
                illegal: /=/,
                contains: [
                    TITLE,
                    COMMENT
                ]
            },
            {
                beginKeywords: 'define',
                end: /\{/,
                contains: [
                    {
                        className: 'section',
                        begin: hljs.IDENT_RE,
                        endsParent: true
                    }
                ]
            },
            {
                begin: hljs.IDENT_RE + '\\s+\\{',
                returnBegin: true,
                end: /\S/,
                contains: [
                    {
                        className: 'keyword',
                        begin: hljs.IDENT_RE,
                        relevance: 0.2
                    },
                    {
                        begin: /\{/,
                        end: /\}/,
                        keywords: PUPPET_KEYWORDS,
                        relevance: 0,
                        contains: [
                            STRING,
                            COMMENT,
                            {
                                begin: '[a-zA-Z_]+\\s*=>',
                                returnBegin: true,
                                end: '=>',
                                contains: [
                                    {
                                        className: 'attr',
                                        begin: hljs.IDENT_RE
                                    }
                                ]
                            },
                            {
                                className: 'number',
                                begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
                                relevance: 0
                            },
                            VARIABLE
                        ]
                    }
                ],
                relevance: 0
            }
        ]
    };
}
export { puppet as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVwcGV0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvcHVwcGV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxlQUFlLEdBQUc7UUFDdEIsT0FBTyxFQUVMLDBHQUEwRztRQUM1RyxPQUFPLEVBRUwseURBQXlEO2NBRXZELDZIQUE2SDtjQUM3SCx1R0FBdUc7Y0FDdkcsNEdBQTRHO2NBQzVHLGlIQUFpSDtjQUNqSCxtSUFBbUk7Y0FDbkksNkhBQTZIO2NBQzdILHFJQUFxSTtjQUNySSw0SEFBNEg7Y0FDNUgscUlBQXFJO2NBQ3JJLDZJQUE2STtjQUM3SSxtSUFBbUk7Y0FDbkksc0lBQXNJO2NBQ3RJLHFJQUFxSTtjQUNySSx5SUFBeUk7Y0FDekksbUJBQW1CO1FBQ3ZCLFFBQVEsRUFFTixrSEFBa0g7Y0FDaEgsc0hBQXNIO2NBQ3RILDBIQUEwSDtjQUMxSCxnSUFBZ0k7Y0FDaEksNEhBQTRIO2NBQzVILHFJQUFxSTtjQUNySSwrSEFBK0g7Y0FDL0gsdUlBQXVJO2NBQ3ZJLHVJQUF1STtjQUN2SSwrR0FBK0c7S0FDcEgsQ0FBQztJQUVGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXZDLE1BQU0sUUFBUSxHQUFHLHlCQUF5QixDQUFDO0lBRTNDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRWpFLE1BQU0sUUFBUSxHQUFHO1FBQ2YsU0FBUyxFQUFFLFVBQVU7UUFDckIsS0FBSyxFQUFFLEtBQUssR0FBRyxRQUFRO0tBQ3hCLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRztRQUNiLFNBQVMsRUFBRSxRQUFRO1FBQ25CLFFBQVEsRUFBRTtZQUNSLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsUUFBUTtTQUNUO1FBQ0QsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7YUFDVDtZQUNEO2dCQUNFLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2FBQ1Q7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsQ0FBRSxJQUFJLENBQUU7UUFDakIsUUFBUSxFQUFFO1lBQ1IsT0FBTztZQUNQLFFBQVE7WUFDUixNQUFNO1lBQ047Z0JBQ0UsYUFBYSxFQUFFLE9BQU87Z0JBQ3RCLEdBQUcsRUFBRSxPQUFPO2dCQUNaLE9BQU8sRUFBRSxHQUFHO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixLQUFLO29CQUNMLE9BQU87aUJBQ1I7YUFDRjtZQUNEO2dCQUNFLGFBQWEsRUFBRSxRQUFRO2dCQUN2QixHQUFHLEVBQUUsSUFBSTtnQkFDVCxRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsU0FBUyxFQUFFLFNBQVM7d0JBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTt3QkFDcEIsVUFBVSxFQUFFLElBQUk7cUJBQ2pCO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTO2dCQUNoQyxXQUFXLEVBQUUsSUFBSTtnQkFDakIsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQ3BCLFNBQVMsRUFBRSxHQUFHO3FCQUNmO29CQUNEO3dCQUNFLEtBQUssRUFBRSxJQUFJO3dCQUNYLEdBQUcsRUFBRSxJQUFJO3dCQUNULFFBQVEsRUFBRSxlQUFlO3dCQUN6QixTQUFTLEVBQUUsQ0FBQzt3QkFDWixRQUFRLEVBQUU7NEJBQ1IsTUFBTTs0QkFDTixPQUFPOzRCQUNQO2dDQUNFLEtBQUssRUFBRSxrQkFBa0I7Z0NBQ3pCLFdBQVcsRUFBRSxJQUFJO2dDQUNqQixHQUFHLEVBQUUsSUFBSTtnQ0FDVCxRQUFRLEVBQUU7b0NBQ1I7d0NBQ0UsU0FBUyxFQUFFLE1BQU07d0NBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtxQ0FDckI7aUNBQ0Y7NkJBQ0Y7NEJBQ0Q7Z0NBQ0UsU0FBUyxFQUFFLFFBQVE7Z0NBQ25CLEtBQUssRUFBRSwyRUFBMkU7Z0NBQ2xGLFNBQVMsRUFBRSxDQUFDOzZCQUNiOzRCQUNELFFBQVE7eUJBQ1Q7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLENBQUM7YUFDYjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBQdXBwZXRcbkF1dGhvcjogSm9zZSBNb2xpbmEgQ29sbWVuZXJvIDxnYXVkeTQxQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vcHVwcGV0LmNvbS9kb2NzXG5DYXRlZ29yeTogY29uZmlnXG4qL1xuXG5mdW5jdGlvbiBwdXBwZXQoaGxqcykge1xuICBjb25zdCBQVVBQRVRfS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAvKiBsYW5ndWFnZSBrZXl3b3JkcyAqL1xuICAgICAgJ2FuZCBjYXNlIGRlZmF1bHQgZWxzZSBlbHNpZiBmYWxzZSBpZiBpbiBpbXBvcnQgZW5oZXJpdHMgbm9kZSBvciB0cnVlIHVuZGVmIHVubGVzcyBtYWluIHNldHRpbmdzICRzdHJpbmcgJyxcbiAgICBsaXRlcmFsOlxuICAgIC8qIG1ldGFwYXJhbWV0ZXJzICovXG4gICAgICAnYWxpYXMgYXVkaXQgYmVmb3JlIGxvZ2xldmVsIG5vb3AgcmVxdWlyZSBzdWJzY3JpYmUgdGFnICdcbiAgICAgIC8qIG5vcm1hbCBhdHRyaWJ1dGVzICovXG4gICAgICArICdvd25lciBlbnN1cmUgZ3JvdXAgbW9kZSBuYW1lfDAgY2hhbmdlcyBjb250ZXh0IGZvcmNlIGluY2wgbGVucyBsb2FkX3BhdGggb25seWlmIHByb3ZpZGVyIHJldHVybnMgcm9vdCBzaG93X2RpZmYgdHlwZV9jaGVjayAnXG4gICAgICArICdlbl9hZGRyZXNzIGlwX2FkZHJlc3MgcmVhbG5hbWUgY29tbWFuZCBlbnZpcm9ubWVudCBob3VyIG1vbnV0ZSBtb250aCBtb250aGRheSBzcGVjaWFsIHRhcmdldCB3ZWVrZGF5ICdcbiAgICAgICsgJ2NyZWF0ZXMgY3dkIG9nb3V0cHV0IHJlZnJlc2ggcmVmcmVzaG9ubHkgdHJpZXMgdHJ5X3NsZWVwIHVtYXNrIGJhY2t1cCBjaGVja3N1bSBjb250ZW50IGN0aW1lIGZvcmNlIGlnbm9yZSAnXG4gICAgICArICdsaW5rcyBtdGltZSBwdXJnZSByZWN1cnNlIHJlY3Vyc2VsaW1pdCByZXBsYWNlIHNlbGludXhfaWdub3JlX2RlZmF1bHRzIHNlbHJhbmdlIHNlbHJvbGUgc2VsdHlwZSBzZWx1c2VyIHNvdXJjZSAnXG4gICAgICArICdzb3VpcmNlX3Blcm1pc3Npb25zIHNvdXJjZXNlbGVjdCB2YWxpZGF0ZV9jbWQgdmFsaWRhdGVfcmVwbGFjZW1lbnQgYWxsb3dkdXBlIGF0dHJpYnV0ZV9tZW1iZXJzaGlwIGF1dGhfbWVtYmVyc2hpcCBmb3JjZWxvY2FsIGdpZCAnXG4gICAgICArICdpYV9sb2FkX21vZHVsZSBtZW1iZXJzIHN5c3RlbSBob3N0X2FsaWFzZXMgaXAgYWxsb3dlZF90cnVua192bGFucyBkZXNjcmlwdGlvbiBkZXZpY2VfdXJsIGR1cGxleCBlbmNhcHN1bGF0aW9uIGV0aGVyY2hhbm5lbCAnXG4gICAgICArICduYXRpdmVfdmxhbiBzcGVlZCBwcmluY2lwYWxzIGFsbG93X3Jvb3QgYXV0aF9jbGFzcyBhdXRoX3R5cGUgYXV0aGVudGljYXRlX3VzZXIga19vZl9uIG1lY2hhbmlzbXMgcnVsZSBzZXNzaW9uX293bmVyIHNoYXJlZCBvcHRpb25zICdcbiAgICAgICsgJ2RldmljZSBmc3R5cGUgZW5hYmxlIGhhc3Jlc3RhcnQgZGlyZWN0b3J5IHByZXNlbnQgYWJzZW50IGxpbmsgYXRib290IGJsb2NrZGV2aWNlIGRldmljZSBkdW1wIHBhc3MgcmVtb3VudHMgcG9sbGVyX3RhZyB1c2UgJ1xuICAgICAgKyAnbWVzc2FnZSB3aXRocGF0aCBhZG1pbmZpbGUgYWxsb3dfdmlydHVhbCBhbGxvd2Nkcm9tIGNhdGVnb3J5IGNvbmZpZ2ZpbGVzIGZsYXZvciBpbnN0YWxsX29wdGlvbnMgaW5zdGFuY2UgcGFja2FnZV9zZXR0aW5ncyBwbGF0Zm9ybSAnXG4gICAgICArICdyZXNwb25zZWZpbGUgc3RhdHVzIHVuaW5zdGFsbF9vcHRpb25zIHZlbmRvciB1bmxlc3Nfc3lzdGVtX3VzZXIgdW5sZXNzX3VpZCBiaW5hcnkgY29udHJvbCBmbGFncyBoYXNzdGF0dXMgbWFuaWZlc3QgcGF0dGVybiByZXN0YXJ0IHJ1bm5pbmcgJ1xuICAgICAgKyAnc3RhcnQgc3RvcCBhbGxvd2R1cGUgYXV0aHMgZXhwaXJ5IGdpZCBncm91cHMgaG9tZSBpdGVyYXRpb25zIGtleV9tZW1iZXJzaGlwIGtleXMgbWFuYWdlaG9tZSBtZW1iZXJzaGlwIHBhc3N3b3JkIHBhc3N3b3JkX21heF9hZ2UgJ1xuICAgICAgKyAncGFzc3dvcmRfbWluX2FnZSBwcm9maWxlX21lbWJlcnNoaXAgcHJvZmlsZXMgcHJvamVjdCBwdXJnZV9zc2hfa2V5cyByb2xlX21lbWJlcnNoaXAgcm9sZXMgc2FsdCBzaGVsbCB1aWQgYmFzZXVybCBjb3N0IGRlc2NyIGVuYWJsZWQgJ1xuICAgICAgKyAnZW5hYmxlZ3JvdXBzIGV4Y2x1ZGUgZmFpbG92ZXJtZXRob2QgZ3BnY2hlY2sgZ3Bna2V5IGh0dHBfY2FjaGluZyBpbmNsdWRlIGluY2x1ZGVwa2dzIGtlZXBhbGl2ZSBtZXRhZGF0YV9leHBpcmUgbWV0YWxpbmsgbWlycm9ybGlzdCAnXG4gICAgICArICdwcmlvcml0eSBwcm90ZWN0IHByb3h5IHByb3h5X3Bhc3N3b3JkIHByb3h5X3VzZXJuYW1lIHJlcG9fZ3BnY2hlY2sgczNfZW5hYmxlZCBza2lwX2lmX3VuYXZhaWxhYmxlIHNzbGNhY2VydCBzc2xjbGllbnRjZXJ0IHNzbGNsaWVudGtleSAnXG4gICAgICArICdzc2x2ZXJpZnkgbW91bnRlZCcsXG4gICAgYnVpbHRfaW46XG4gICAgLyogY29yZSBmYWN0cyAqL1xuICAgICAgJ2FyY2hpdGVjdHVyZSBhdWdlYXN2ZXJzaW9uIGJsb2NrZGV2aWNlcyBib2FyZG1hbnVmYWN0dXJlciBib2FyZHByb2R1Y3RuYW1lIGJvYXJkc2VyaWFsbnVtYmVyIGNma2V5IGRoY3Bfc2VydmVycyAnXG4gICAgICArICdkb21haW4gZWMyXyBlYzJfdXNlcmRhdGEgZmFjdGVydmVyc2lvbiBmaWxlc3lzdGVtcyBsZG9tIGZxZG4gZ2lkIGhhcmR3YXJlaXNhIGhhcmR3YXJlbW9kZWwgaG9zdG5hbWUgaWR8MCBpbnRlcmZhY2VzICdcbiAgICAgICsgJ2lwYWRkcmVzcyBpcGFkZHJlc3NfIGlwYWRkcmVzczYgaXBhZGRyZXNzNl8gaXBob3N0bnVtYmVyIGlzX3ZpcnR1YWwga2VybmVsIGtlcm5lbG1hanZlcnNpb24ga2VybmVscmVsZWFzZSBrZXJuZWx2ZXJzaW9uICdcbiAgICAgICsgJ2tlcm5lbHJlbGVhc2Uga2VybmVsdmVyc2lvbiBsc2JkaXN0Y29kZW5hbWUgbHNiZGlzdGRlc2NyaXB0aW9uIGxzYmRpc3RpZCBsc2JkaXN0cmVsZWFzZSBsc2JtYWpkaXN0cmVsZWFzZSBsc2JtaW5vcmRpc3RyZWxlYXNlICdcbiAgICAgICsgJ2xzYnJlbGVhc2UgbWFjYWRkcmVzcyBtYWNhZGRyZXNzXyBtYWNvc3hfYnVpbGR2ZXJzaW9uIG1hY29zeF9wcm9kdWN0bmFtZSBtYWNvc3hfcHJvZHVjdHZlcnNpb24gbWFjb3N4X3Byb2R1Y3R2ZXJzb25fbWFqb3IgJ1xuICAgICAgKyAnbWFjb3N4X3Byb2R1Y3R2ZXJzaW9uX21pbm9yIG1hbnVmYWN0dXJlciBtZW1vcnlmcmVlIG1lbW9yeXNpemUgbmV0bWFzayBtZXRtYXNrXyBuZXR3b3JrXyBvcGVyYXRpbmdzeXN0ZW0gb3BlcmF0aW5nc3lzdGVtbWFqcmVsZWFzZSAnXG4gICAgICArICdvcGVyYXRpbmdzeXN0ZW1yZWxlYXNlIG9zZmFtaWx5IHBhcnRpdGlvbnMgcGF0aCBwaHlzaWNhbHByb2Nlc3NvcmNvdW50IHByb2Nlc3NvciBwcm9jZXNzb3Jjb3VudCBwcm9kdWN0bmFtZSBwcyBwdXBwZXR2ZXJzaW9uICdcbiAgICAgICsgJ3J1YnlzaXRlZGlyIHJ1Ynl2ZXJzaW9uIHNlbGludXggc2VsaW51eF9jb25maWdfbW9kZSBzZWxpbnV4X2NvbmZpZ19wb2xpY3kgc2VsaW51eF9jdXJyZW50X21vZGUgc2VsaW51eF9jdXJyZW50X21vZGUgc2VsaW51eF9lbmZvcmNlZCAnXG4gICAgICArICdzZWxpbnV4X3BvbGljeXZlcnNpb24gc2VyaWFsbnVtYmVyIHNwXyBzc2hkc2FrZXkgc3NoZWNkc2FrZXkgc3NocnNha2V5IHN3YXBlbmNyeXB0ZWQgc3dhcGZyZWUgc3dhcHNpemUgdGltZXpvbmUgdHlwZSB1bmlxdWVpZCB1cHRpbWUgJ1xuICAgICAgKyAndXB0aW1lX2RheXMgdXB0aW1lX2hvdXJzIHVwdGltZV9zZWNvbmRzIHV1aWQgdmlydHVhbCB2bGFucyB4ZW5kb21haW5zIHpmc192ZXJzaW9uIHpvbmVuYWUgem9uZXMgenBvb2xfdmVyc2lvbidcbiAgfTtcblxuICBjb25zdCBDT01NRU5UID0gaGxqcy5DT01NRU5UKCcjJywgJyQnKTtcblxuICBjb25zdCBJREVOVF9SRSA9ICcoW0EtWmEtel9dfDo6KShcXFxcd3w6OikqJztcblxuICBjb25zdCBUSVRMRSA9IGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHsgYmVnaW46IElERU5UX1JFIH0pO1xuXG4gIGNvbnN0IFZBUklBQkxFID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogJ1xcXFwkJyArIElERU5UX1JFXG4gIH07XG5cbiAgY29uc3QgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgIFZBUklBQkxFXG4gICAgXSxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogLycvLFxuICAgICAgICBlbmQ6IC8nL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cIi8sXG4gICAgICAgIGVuZDogL1wiL1xuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdQdXBwZXQnLFxuICAgIGFsaWFzZXM6IFsgJ3BwJyBdLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBDT01NRU5ULFxuICAgICAgVkFSSUFCTEUsXG4gICAgICBTVFJJTkcsXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdjbGFzcycsXG4gICAgICAgIGVuZDogJ1xcXFx7fDsnLFxuICAgICAgICBpbGxlZ2FsOiAvPS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEUsXG4gICAgICAgICAgQ09NTUVOVFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnZGVmaW5lJyxcbiAgICAgICAgZW5kOiAvXFx7LyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzZWN0aW9uJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLklERU5UX1JFLFxuICAgICAgICAgICAgZW5kc1BhcmVudDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnXFxcXHMrXFxcXHsnLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgZW5kOiAvXFxTLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLklERU5UX1JFLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwLjJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAvXFx7LyxcbiAgICAgICAgICAgIGVuZDogL1xcfS8sXG4gICAgICAgICAgICBrZXl3b3JkczogUFVQUEVUX0tFWVdPUkRTLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgU1RSSU5HLFxuICAgICAgICAgICAgICBDT01NRU5ULFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46ICdbYS16QS1aX10rXFxcXHMqPT4nLFxuICAgICAgICAgICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVuZDogJz0+JyxcbiAgICAgICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhdHRyJyxcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IGhsanMuSURFTlRfUkVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAnKFxcXFxiMFswLTdfXSspfChcXFxcYjB4WzAtOWEtZkEtRl9dKyl8KFxcXFxiWzEtOV1bMC05X10qKFxcXFwuWzAtOV9dKyk/KXxbMF9dXFxcXGInLFxuICAgICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBWQVJJQUJMRVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBwdXBwZXQgYXMgZGVmYXVsdCB9O1xuIl19