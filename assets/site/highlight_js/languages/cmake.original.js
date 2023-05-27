function cmake(hljs) {
    return {
        name: 'CMake',
        aliases: ['cmake.in'],
        case_insensitive: true,
        keywords: { keyword: 'break cmake_host_system_information cmake_minimum_required cmake_parse_arguments '
                + 'cmake_policy configure_file continue elseif else endforeach endfunction endif endmacro '
                + 'endwhile execute_process file find_file find_library find_package find_path '
                + 'find_program foreach function get_cmake_property get_directory_property '
                + 'get_filename_component get_property if include include_guard list macro '
                + 'mark_as_advanced math message option return separate_arguments '
                + 'set_directory_properties set_property set site_name string unset variable_watch while '
                + 'add_compile_definitions add_compile_options add_custom_command add_custom_target '
                + 'add_definitions add_dependencies add_executable add_library add_link_options '
                + 'add_subdirectory add_test aux_source_directory build_command create_test_sourcelist '
                + 'define_property enable_language enable_testing export fltk_wrap_ui '
                + 'get_source_file_property get_target_property get_test_property include_directories '
                + 'include_external_msproject include_regular_expression install link_directories '
                + 'link_libraries load_cache project qt_wrap_cpp qt_wrap_ui remove_definitions '
                + 'set_source_files_properties set_target_properties set_tests_properties source_group '
                + 'target_compile_definitions target_compile_features target_compile_options '
                + 'target_include_directories target_link_directories target_link_libraries '
                + 'target_link_options target_sources try_compile try_run '
                + 'ctest_build ctest_configure ctest_coverage ctest_empty_binary_directory ctest_memcheck '
                + 'ctest_read_custom_files ctest_run_script ctest_sleep ctest_start ctest_submit '
                + 'ctest_test ctest_update ctest_upload '
                + 'build_name exec_program export_library_dependencies install_files install_programs '
                + 'install_targets load_command make_directory output_required_files remove '
                + 'subdir_depends subdirs use_mangled_mesa utility_source variable_requires write_file '
                + 'qt5_use_modules qt5_use_package qt5_wrap_cpp '
                + 'on off true false and or not command policy target test exists is_newer_than '
                + 'is_directory is_symlink is_absolute matches less greater equal less_equal '
                + 'greater_equal strless strgreater strequal strless_equal strgreater_equal version_less '
                + 'version_greater version_equal version_less_equal version_greater_equal in_list defined' },
        contains: [
            {
                className: 'variable',
                begin: /\$\{/,
                end: /\}/
            },
            hljs.COMMENT(/#\[\[/, /]]/),
            hljs.HASH_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE
        ]
    };
}
export { cmake as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21ha2UuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9jbWFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE9BQU87UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxDQUFFLFVBQVUsQ0FBRTtRQUN2QixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFFZixtRkFBbUY7a0JBQ2pGLHlGQUF5RjtrQkFDekYsOEVBQThFO2tCQUM5RSwwRUFBMEU7a0JBQzFFLDBFQUEwRTtrQkFDMUUsaUVBQWlFO2tCQUNqRSx3RkFBd0Y7a0JBRXhGLG1GQUFtRjtrQkFDbkYsK0VBQStFO2tCQUMvRSxzRkFBc0Y7a0JBQ3RGLHFFQUFxRTtrQkFDckUscUZBQXFGO2tCQUNyRixpRkFBaUY7a0JBQ2pGLDhFQUE4RTtrQkFDOUUsc0ZBQXNGO2tCQUN0Riw0RUFBNEU7a0JBQzVFLDJFQUEyRTtrQkFDM0UseURBQXlEO2tCQUV6RCx5RkFBeUY7a0JBQ3pGLGdGQUFnRjtrQkFDaEYsdUNBQXVDO2tCQUV2QyxxRkFBcUY7a0JBQ3JGLDJFQUEyRTtrQkFDM0Usc0ZBQXNGO2tCQUN0RiwrQ0FBK0M7a0JBRS9DLCtFQUErRTtrQkFDL0UsNEVBQTRFO2tCQUM1RSx3RkFBd0Y7a0JBQ3hGLHdGQUF3RixFQUFFO1FBQ2hHLFFBQVEsRUFBRTtZQUNSO2dCQUNFLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixLQUFLLEVBQUUsTUFBTTtnQkFDYixHQUFHLEVBQUUsSUFBSTthQUNWO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUI7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsV0FBVztTQUNqQjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5MYW5ndWFnZTogQ01ha2VcbkRlc2NyaXB0aW9uOiBDTWFrZSBpcyBhbiBvcGVuLXNvdXJjZSBjcm9zcy1wbGF0Zm9ybSBzeXN0ZW0gZm9yIGJ1aWxkIGF1dG9tYXRpb24uXG5BdXRob3I6IElnb3IgS2Fsbml0c2t5IDxpZ29yQGthbG5pdHNreS5vcmc+XG5XZWJzaXRlOiBodHRwczovL2NtYWtlLm9yZ1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGNtYWtlKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQ01ha2UnLFxuICAgIGFsaWFzZXM6IFsgJ2NtYWtlLmluJyBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHsga2V5d29yZDpcbiAgICAgICAgLy8gc2NyaXB0aW5nIGNvbW1hbmRzXG4gICAgICAgICdicmVhayBjbWFrZV9ob3N0X3N5c3RlbV9pbmZvcm1hdGlvbiBjbWFrZV9taW5pbXVtX3JlcXVpcmVkIGNtYWtlX3BhcnNlX2FyZ3VtZW50cyAnXG4gICAgICAgICsgJ2NtYWtlX3BvbGljeSBjb25maWd1cmVfZmlsZSBjb250aW51ZSBlbHNlaWYgZWxzZSBlbmRmb3JlYWNoIGVuZGZ1bmN0aW9uIGVuZGlmIGVuZG1hY3JvICdcbiAgICAgICAgKyAnZW5kd2hpbGUgZXhlY3V0ZV9wcm9jZXNzIGZpbGUgZmluZF9maWxlIGZpbmRfbGlicmFyeSBmaW5kX3BhY2thZ2UgZmluZF9wYXRoICdcbiAgICAgICAgKyAnZmluZF9wcm9ncmFtIGZvcmVhY2ggZnVuY3Rpb24gZ2V0X2NtYWtlX3Byb3BlcnR5IGdldF9kaXJlY3RvcnlfcHJvcGVydHkgJ1xuICAgICAgICArICdnZXRfZmlsZW5hbWVfY29tcG9uZW50IGdldF9wcm9wZXJ0eSBpZiBpbmNsdWRlIGluY2x1ZGVfZ3VhcmQgbGlzdCBtYWNybyAnXG4gICAgICAgICsgJ21hcmtfYXNfYWR2YW5jZWQgbWF0aCBtZXNzYWdlIG9wdGlvbiByZXR1cm4gc2VwYXJhdGVfYXJndW1lbnRzICdcbiAgICAgICAgKyAnc2V0X2RpcmVjdG9yeV9wcm9wZXJ0aWVzIHNldF9wcm9wZXJ0eSBzZXQgc2l0ZV9uYW1lIHN0cmluZyB1bnNldCB2YXJpYWJsZV93YXRjaCB3aGlsZSAnXG4gICAgICAgIC8vIHByb2plY3QgY29tbWFuZHNcbiAgICAgICAgKyAnYWRkX2NvbXBpbGVfZGVmaW5pdGlvbnMgYWRkX2NvbXBpbGVfb3B0aW9ucyBhZGRfY3VzdG9tX2NvbW1hbmQgYWRkX2N1c3RvbV90YXJnZXQgJ1xuICAgICAgICArICdhZGRfZGVmaW5pdGlvbnMgYWRkX2RlcGVuZGVuY2llcyBhZGRfZXhlY3V0YWJsZSBhZGRfbGlicmFyeSBhZGRfbGlua19vcHRpb25zICdcbiAgICAgICAgKyAnYWRkX3N1YmRpcmVjdG9yeSBhZGRfdGVzdCBhdXhfc291cmNlX2RpcmVjdG9yeSBidWlsZF9jb21tYW5kIGNyZWF0ZV90ZXN0X3NvdXJjZWxpc3QgJ1xuICAgICAgICArICdkZWZpbmVfcHJvcGVydHkgZW5hYmxlX2xhbmd1YWdlIGVuYWJsZV90ZXN0aW5nIGV4cG9ydCBmbHRrX3dyYXBfdWkgJ1xuICAgICAgICArICdnZXRfc291cmNlX2ZpbGVfcHJvcGVydHkgZ2V0X3RhcmdldF9wcm9wZXJ0eSBnZXRfdGVzdF9wcm9wZXJ0eSBpbmNsdWRlX2RpcmVjdG9yaWVzICdcbiAgICAgICAgKyAnaW5jbHVkZV9leHRlcm5hbF9tc3Byb2plY3QgaW5jbHVkZV9yZWd1bGFyX2V4cHJlc3Npb24gaW5zdGFsbCBsaW5rX2RpcmVjdG9yaWVzICdcbiAgICAgICAgKyAnbGlua19saWJyYXJpZXMgbG9hZF9jYWNoZSBwcm9qZWN0IHF0X3dyYXBfY3BwIHF0X3dyYXBfdWkgcmVtb3ZlX2RlZmluaXRpb25zICdcbiAgICAgICAgKyAnc2V0X3NvdXJjZV9maWxlc19wcm9wZXJ0aWVzIHNldF90YXJnZXRfcHJvcGVydGllcyBzZXRfdGVzdHNfcHJvcGVydGllcyBzb3VyY2VfZ3JvdXAgJ1xuICAgICAgICArICd0YXJnZXRfY29tcGlsZV9kZWZpbml0aW9ucyB0YXJnZXRfY29tcGlsZV9mZWF0dXJlcyB0YXJnZXRfY29tcGlsZV9vcHRpb25zICdcbiAgICAgICAgKyAndGFyZ2V0X2luY2x1ZGVfZGlyZWN0b3JpZXMgdGFyZ2V0X2xpbmtfZGlyZWN0b3JpZXMgdGFyZ2V0X2xpbmtfbGlicmFyaWVzICdcbiAgICAgICAgKyAndGFyZ2V0X2xpbmtfb3B0aW9ucyB0YXJnZXRfc291cmNlcyB0cnlfY29tcGlsZSB0cnlfcnVuICdcbiAgICAgICAgLy8gQ1Rlc3QgY29tbWFuZHNcbiAgICAgICAgKyAnY3Rlc3RfYnVpbGQgY3Rlc3RfY29uZmlndXJlIGN0ZXN0X2NvdmVyYWdlIGN0ZXN0X2VtcHR5X2JpbmFyeV9kaXJlY3RvcnkgY3Rlc3RfbWVtY2hlY2sgJ1xuICAgICAgICArICdjdGVzdF9yZWFkX2N1c3RvbV9maWxlcyBjdGVzdF9ydW5fc2NyaXB0IGN0ZXN0X3NsZWVwIGN0ZXN0X3N0YXJ0IGN0ZXN0X3N1Ym1pdCAnXG4gICAgICAgICsgJ2N0ZXN0X3Rlc3QgY3Rlc3RfdXBkYXRlIGN0ZXN0X3VwbG9hZCAnXG4gICAgICAgIC8vIGRlcHJlY2F0ZWQgY29tbWFuZHNcbiAgICAgICAgKyAnYnVpbGRfbmFtZSBleGVjX3Byb2dyYW0gZXhwb3J0X2xpYnJhcnlfZGVwZW5kZW5jaWVzIGluc3RhbGxfZmlsZXMgaW5zdGFsbF9wcm9ncmFtcyAnXG4gICAgICAgICsgJ2luc3RhbGxfdGFyZ2V0cyBsb2FkX2NvbW1hbmQgbWFrZV9kaXJlY3Rvcnkgb3V0cHV0X3JlcXVpcmVkX2ZpbGVzIHJlbW92ZSAnXG4gICAgICAgICsgJ3N1YmRpcl9kZXBlbmRzIHN1YmRpcnMgdXNlX21hbmdsZWRfbWVzYSB1dGlsaXR5X3NvdXJjZSB2YXJpYWJsZV9yZXF1aXJlcyB3cml0ZV9maWxlICdcbiAgICAgICAgKyAncXQ1X3VzZV9tb2R1bGVzIHF0NV91c2VfcGFja2FnZSBxdDVfd3JhcF9jcHAgJ1xuICAgICAgICAvLyBjb3JlIGtleXdvcmRzXG4gICAgICAgICsgJ29uIG9mZiB0cnVlIGZhbHNlIGFuZCBvciBub3QgY29tbWFuZCBwb2xpY3kgdGFyZ2V0IHRlc3QgZXhpc3RzIGlzX25ld2VyX3RoYW4gJ1xuICAgICAgICArICdpc19kaXJlY3RvcnkgaXNfc3ltbGluayBpc19hYnNvbHV0ZSBtYXRjaGVzIGxlc3MgZ3JlYXRlciBlcXVhbCBsZXNzX2VxdWFsICdcbiAgICAgICAgKyAnZ3JlYXRlcl9lcXVhbCBzdHJsZXNzIHN0cmdyZWF0ZXIgc3RyZXF1YWwgc3RybGVzc19lcXVhbCBzdHJncmVhdGVyX2VxdWFsIHZlcnNpb25fbGVzcyAnXG4gICAgICAgICsgJ3ZlcnNpb25fZ3JlYXRlciB2ZXJzaW9uX2VxdWFsIHZlcnNpb25fbGVzc19lcXVhbCB2ZXJzaW9uX2dyZWF0ZXJfZXF1YWwgaW5fbGlzdCBkZWZpbmVkJyB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46IC9cXCRcXHsvLFxuICAgICAgICBlbmQ6IC9cXH0vXG4gICAgICB9LFxuICAgICAgaGxqcy5DT01NRU5UKC8jXFxbXFxbLywgL11dLyksXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGNtYWtlIGFzIGRlZmF1bHQgfTtcbiJdfQ==