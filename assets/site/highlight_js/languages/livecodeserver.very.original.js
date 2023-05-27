function livecodeserver(hljs) {
    const VARIABLE = {
        className: 'variable',
        variants: [
            { begin: '\\b([gtps][A-Z]{1}[a-zA-Z0-9]*)(\\[.+\\])?(?:\\s*?)' },
            { begin: '\\$_[A-Z]+' }
        ],
        relevance: 0
    };
    const COMMENT_MODES = [
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.HASH_COMMENT_MODE,
        hljs.COMMENT('--', '$'),
        hljs.COMMENT('[^:]//', '$')
    ];
    const TITLE1 = hljs.inherit(hljs.TITLE_MODE, { variants: [
            { begin: '\\b_*rig[A-Z][A-Za-z0-9_\\-]*' },
            { begin: '\\b_[a-z0-9\\-]+' }
        ] });
    const TITLE2 = hljs.inherit(hljs.TITLE_MODE, { begin: '\\b([A-Za-z0-9_\\-]+)\\b' });
    return {
        name: 'LiveCode',
        case_insensitive: false,
        keywords: {
            keyword: '$_COOKIE $_FILES $_GET $_GET_BINARY $_GET_RAW $_POST $_POST_BINARY $_POST_RAW $_SESSION $_SERVER '
                + 'codepoint codepoints segment segments codeunit codeunits sentence sentences trueWord trueWords paragraph '
                + 'after byte bytes english the until http forever descending using line real8 with seventh '
                + 'for stdout finally element word words fourth before black ninth sixth characters chars stderr '
                + 'uInt1 uInt1s uInt2 uInt2s stdin string lines relative rel any fifth items from middle mid '
                + 'at else of catch then third it file milliseconds seconds second secs sec int1 int1s int4 '
                + 'int4s internet int2 int2s normal text item last long detailed effective uInt4 uInt4s repeat '
                + 'end repeat URL in try into switch to words https token binfile each tenth as ticks tick '
                + 'system real4 by dateItems without char character ascending eighth whole dateTime numeric short '
                + 'first ftp integer abbreviated abbr abbrev private case while if '
                + 'div mod wrap and or bitAnd bitNot bitOr bitXor among not in a an within '
                + 'contains ends with begins the keys of keys',
            literal: 'SIX TEN FORMFEED NINE ZERO NONE SPACE FOUR FALSE COLON CRLF PI COMMA ENDOFFILE EOF EIGHT FIVE '
                + 'QUOTE EMPTY ONE TRUE RETURN CR LINEFEED RIGHT BACKSLASH NULL SEVEN TAB THREE TWO '
                + 'six ten formfeed nine zero none space four false colon crlf pi comma endoffile eof eight five '
                + 'quote empty one true return cr linefeed right backslash null seven tab three two '
                + 'RIVERSION RISTATE FILE_READ_MODE FILE_WRITE_MODE FILE_WRITE_MODE DIR_WRITE_MODE FILE_READ_UMASK '
                + 'FILE_WRITE_UMASK DIR_READ_UMASK DIR_WRITE_UMASK',
            built_in: 'put abs acos aliasReference annuity arrayDecode arrayEncode asin atan atan2 average avg avgDev base64Decode '
                + 'base64Encode baseConvert binaryDecode binaryEncode byteOffset byteToNum cachedURL cachedURLs charToNum '
                + 'cipherNames codepointOffset codepointProperty codepointToNum codeunitOffset commandNames compound compress '
                + 'constantNames cos date dateFormat decompress difference directories '
                + 'diskSpace DNSServers exp exp1 exp2 exp10 extents files flushEvents folders format functionNames geometricMean global '
                + 'globals hasMemory harmonicMean hostAddress hostAddressToName hostName hostNameToAddress isNumber ISOToMac itemOffset '
                + 'keys len length libURLErrorData libUrlFormData libURLftpCommand libURLLastHTTPHeaders libURLLastRHHeaders '
                + 'libUrlMultipartFormAddPart libUrlMultipartFormData libURLVersion lineOffset ln ln1 localNames log log2 log10 '
                + 'longFilePath lower macToISO matchChunk matchText matrixMultiply max md5Digest median merge messageAuthenticationCode messageDigest millisec '
                + 'millisecs millisecond milliseconds min monthNames nativeCharToNum normalizeText num number numToByte numToChar '
                + 'numToCodepoint numToNativeChar offset open openfiles openProcesses openProcessIDs openSockets '
                + 'paragraphOffset paramCount param params peerAddress pendingMessages platform popStdDev populationStandardDeviation '
                + 'populationVariance popVariance processID random randomBytes replaceText result revCreateXMLTree revCreateXMLTreeFromFile '
                + 'revCurrentRecord revCurrentRecordIsFirst revCurrentRecordIsLast revDatabaseColumnCount revDatabaseColumnIsNull '
                + 'revDatabaseColumnLengths revDatabaseColumnNames revDatabaseColumnNamed revDatabaseColumnNumbered '
                + 'revDatabaseColumnTypes revDatabaseConnectResult revDatabaseCursors revDatabaseID revDatabaseTableNames '
                + 'revDatabaseType revDataFromQuery revdb_closeCursor revdb_columnbynumber revdb_columncount revdb_columnisnull '
                + 'revdb_columnlengths revdb_columnnames revdb_columntypes revdb_commit revdb_connect revdb_connections '
                + 'revdb_connectionerr revdb_currentrecord revdb_cursorconnection revdb_cursorerr revdb_cursors revdb_dbtype '
                + 'revdb_disconnect revdb_execute revdb_iseof revdb_isbof revdb_movefirst revdb_movelast revdb_movenext '
                + 'revdb_moveprev revdb_query revdb_querylist revdb_recordcount revdb_rollback revdb_tablenames '
                + 'revGetDatabaseDriverPath revNumberOfRecords revOpenDatabase revOpenDatabases revQueryDatabase '
                + 'revQueryDatabaseBlob revQueryResult revQueryIsAtStart revQueryIsAtEnd revUnixFromMacPath revXMLAttribute '
                + 'revXMLAttributes revXMLAttributeValues revXMLChildContents revXMLChildNames revXMLCreateTreeFromFileWithNamespaces '
                + 'revXMLCreateTreeWithNamespaces revXMLDataFromXPathQuery revXMLEvaluateXPath revXMLFirstChild revXMLMatchingNode '
                + 'revXMLNextSibling revXMLNodeContents revXMLNumberOfChildren revXMLParent revXMLPreviousSibling '
                + 'revXMLRootNode revXMLRPC_CreateRequest revXMLRPC_Documents revXMLRPC_Error '
                + 'revXMLRPC_GetHost revXMLRPC_GetMethod revXMLRPC_GetParam revXMLText revXMLRPC_Execute '
                + 'revXMLRPC_GetParamCount revXMLRPC_GetParamNode revXMLRPC_GetParamType revXMLRPC_GetPath revXMLRPC_GetPort '
                + 'revXMLRPC_GetProtocol revXMLRPC_GetRequest revXMLRPC_GetResponse revXMLRPC_GetSocket revXMLTree '
                + 'revXMLTrees revXMLValidateDTD revZipDescribeItem revZipEnumerateItems revZipOpenArchives round sampVariance '
                + 'sec secs seconds sentenceOffset sha1Digest shell shortFilePath sin specialFolderPath sqrt standardDeviation statRound '
                + 'stdDev sum sysError systemVersion tan tempName textDecode textEncode tick ticks time to tokenOffset toLower toUpper '
                + 'transpose truewordOffset trunc uniDecode uniEncode upper URLDecode URLEncode URLStatus uuid value variableNames '
                + 'variance version waitDepth weekdayNames wordOffset xsltApplyStylesheet xsltApplyStylesheetFromFile xsltLoadStylesheet '
                + 'xsltLoadStylesheetFromFile add breakpoint cancel clear local variable file word line folder directory URL close socket process '
                + 'combine constant convert create new alias folder directory decrypt delete variable word line folder '
                + 'directory URL dispatch divide do encrypt filter get include intersect kill libURLDownloadToFile '
                + 'libURLFollowHttpRedirects libURLftpUpload libURLftpUploadFile libURLresetAll libUrlSetAuthCallback libURLSetDriver '
                + 'libURLSetCustomHTTPHeaders libUrlSetExpect100 libURLSetFTPListCommand libURLSetFTPMode libURLSetFTPStopTime '
                + 'libURLSetStatusCallback load extension loadedExtensions multiply socket prepare process post seek rel relative read from process rename '
                + 'replace require resetAll resolve revAddXMLNode revAppendXML revCloseCursor revCloseDatabase revCommitDatabase '
                + 'revCopyFile revCopyFolder revCopyXMLNode revDeleteFolder revDeleteXMLNode revDeleteAllXMLTrees '
                + 'revDeleteXMLTree revExecuteSQL revGoURL revInsertXMLNode revMoveFolder revMoveToFirstRecord revMoveToLastRecord '
                + 'revMoveToNextRecord revMoveToPreviousRecord revMoveToRecord revMoveXMLNode revPutIntoXMLNode revRollBackDatabase '
                + 'revSetDatabaseDriverPath revSetXMLAttribute revXMLRPC_AddParam revXMLRPC_DeleteAllDocuments revXMLAddDTD '
                + 'revXMLRPC_Free revXMLRPC_FreeAll revXMLRPC_DeleteDocument revXMLRPC_DeleteParam revXMLRPC_SetHost '
                + 'revXMLRPC_SetMethod revXMLRPC_SetPort revXMLRPC_SetProtocol revXMLRPC_SetSocket revZipAddItemWithData '
                + 'revZipAddItemWithFile revZipAddUncompressedItemWithData revZipAddUncompressedItemWithFile revZipCancel '
                + 'revZipCloseArchive revZipDeleteItem revZipExtractItemToFile revZipExtractItemToVariable revZipSetProgressCallback '
                + 'revZipRenameItem revZipReplaceItemWithData revZipReplaceItemWithFile revZipOpenArchive send set sort split start stop '
                + 'subtract symmetric union unload vectorDotProduct wait write'
        },
        contains: [
            VARIABLE,
            {
                className: 'keyword',
                begin: '\\bend\\sif\\b'
            },
            {
                className: 'function',
                beginKeywords: 'function',
                end: '$',
                contains: [
                    VARIABLE,
                    TITLE2,
                    hljs.APOS_STRING_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.BINARY_NUMBER_MODE,
                    hljs.C_NUMBER_MODE,
                    TITLE1
                ]
            },
            {
                className: 'function',
                begin: '\\bend\\s+',
                end: '$',
                keywords: 'end',
                contains: [
                    TITLE2,
                    TITLE1
                ],
                relevance: 0
            },
            {
                beginKeywords: 'command on',
                end: '$',
                contains: [
                    VARIABLE,
                    TITLE2,
                    hljs.APOS_STRING_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.BINARY_NUMBER_MODE,
                    hljs.C_NUMBER_MODE,
                    TITLE1
                ]
            },
            {
                className: 'meta',
                variants: [
                    {
                        begin: '<\\?(rev|lc|livecode)',
                        relevance: 10
                    },
                    { begin: '<\\?' },
                    { begin: '\\?>' }
                ]
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.BINARY_NUMBER_MODE,
            hljs.C_NUMBER_MODE,
            TITLE1
        ].concat(COMMENT_MODES),
        illegal: ';$|^\\[|^=|&|\\{'
    };
}
export { livecodeserver as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl2ZWNvZGVzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9saXZlY29kZXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxTQUFTLGNBQWMsQ0FBQyxJQUFJO0lBQzFCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsU0FBUyxFQUFFLFVBQVU7UUFDckIsUUFBUSxFQUFFO1lBQ1IsRUFBRSxLQUFLLEVBQUUscURBQXFELEVBQUU7WUFDaEUsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO1NBQ3hCO1FBQ0QsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDO0lBQ0YsTUFBTSxhQUFhLEdBQUc7UUFDcEIsSUFBSSxDQUFDLG9CQUFvQjtRQUN6QixJQUFJLENBQUMsaUJBQWlCO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7S0FDNUIsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRTtZQUN2RCxFQUFFLEtBQUssRUFBRSwrQkFBK0IsRUFBRTtZQUMxQyxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtTQUM5QixFQUFFLENBQUMsQ0FBQztJQUNMLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxDQUFDLENBQUM7SUFDcEYsT0FBTztRQUNMLElBQUksRUFBRSxVQUFVO1FBQ2hCLGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsUUFBUSxFQUFFO1lBQ1Is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LEVBQUU7b0JBQ2pCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtpQkFDbEI7YUFDRjtZQUNELElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsa0JBQWtCO1lBQ3ZCLElBQUksQ0FBQyxhQUFhO1lBQ2xCLE1BQU07U0FDUCxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDdkIsT0FBTyxFQUFFLGtCQUFrQjtLQUM1QixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxjQUFjLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IExpdmVDb2RlXG5BdXRob3I6IFJhbGYgQml0dGVyIDxyYWJpdEByZXZpZ25pdGVyLmNvbT5cbkRlc2NyaXB0aW9uOiBMYW5ndWFnZSBkZWZpbml0aW9uIGZvciBMaXZlQ29kZSBzZXJ2ZXIgYWNjb3VudGluZyBmb3IgcmV2SWduaXRlciAoYSB3ZWIgYXBwbGljYXRpb24gZnJhbWV3b3JrKSBjaGFyYWN0ZXJpc3RpY3MuXG5WZXJzaW9uOiAxLjFcbkRhdGU6IDIwMTktMDQtMTdcbkNhdGVnb3J5OiBlbnRlcnByaXNlXG4qL1xuXG5mdW5jdGlvbiBsaXZlY29kZXNlcnZlcihobGpzKSB7XG4gIGNvbnN0IFZBUklBQkxFID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ1xcXFxiKFtndHBzXVtBLVpdezF9W2EtekEtWjAtOV0qKShcXFxcWy4rXFxcXF0pPyg/OlxcXFxzKj8pJyB9LFxuICAgICAgeyBiZWdpbjogJ1xcXFwkX1tBLVpdKycgfVxuICAgIF0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IENPTU1FTlRfTU9ERVMgPSBbXG4gICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgIGhsanMuQ09NTUVOVCgnLS0nLCAnJCcpLFxuICAgIGhsanMuQ09NTUVOVCgnW146XS8vJywgJyQnKVxuICBdO1xuICBjb25zdCBUSVRMRTEgPSBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IHZhcmlhbnRzOiBbXG4gICAgeyBiZWdpbjogJ1xcXFxiXypyaWdbQS1aXVtBLVphLXowLTlfXFxcXC1dKicgfSxcbiAgICB7IGJlZ2luOiAnXFxcXGJfW2EtejAtOVxcXFwtXSsnIH1cbiAgXSB9KTtcbiAgY29uc3QgVElUTEUyID0gaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwgeyBiZWdpbjogJ1xcXFxiKFtBLVphLXowLTlfXFxcXC1dKylcXFxcYicgfSk7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0xpdmVDb2RlJyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiBmYWxzZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJyRfQ09PS0lFICRfRklMRVMgJF9HRVQgJF9HRVRfQklOQVJZICRfR0VUX1JBVyAkX1BPU1QgJF9QT1NUX0JJTkFSWSAkX1BPU1RfUkFXICRfU0VTU0lPTiAkX1NFUlZFUiAnXG4gICAgICAgICsgJ2NvZGVwb2ludCBjb2RlcG9pbnRzIHNlZ21lbnQgc2VnbWVudHMgY29kZXVuaXQgY29kZXVuaXRzIHNlbnRlbmNlIHNlbnRlbmNlcyB0cnVlV29yZCB0cnVlV29yZHMgcGFyYWdyYXBoICdcbiAgICAgICAgKyAnYWZ0ZXIgYnl0ZSBieXRlcyBlbmdsaXNoIHRoZSB1bnRpbCBodHRwIGZvcmV2ZXIgZGVzY2VuZGluZyB1c2luZyBsaW5lIHJlYWw4IHdpdGggc2V2ZW50aCAnXG4gICAgICAgICsgJ2ZvciBzdGRvdXQgZmluYWxseSBlbGVtZW50IHdvcmQgd29yZHMgZm91cnRoIGJlZm9yZSBibGFjayBuaW50aCBzaXh0aCBjaGFyYWN0ZXJzIGNoYXJzIHN0ZGVyciAnXG4gICAgICAgICsgJ3VJbnQxIHVJbnQxcyB1SW50MiB1SW50MnMgc3RkaW4gc3RyaW5nIGxpbmVzIHJlbGF0aXZlIHJlbCBhbnkgZmlmdGggaXRlbXMgZnJvbSBtaWRkbGUgbWlkICdcbiAgICAgICAgKyAnYXQgZWxzZSBvZiBjYXRjaCB0aGVuIHRoaXJkIGl0IGZpbGUgbWlsbGlzZWNvbmRzIHNlY29uZHMgc2Vjb25kIHNlY3Mgc2VjIGludDEgaW50MXMgaW50NCAnXG4gICAgICAgICsgJ2ludDRzIGludGVybmV0IGludDIgaW50MnMgbm9ybWFsIHRleHQgaXRlbSBsYXN0IGxvbmcgZGV0YWlsZWQgZWZmZWN0aXZlIHVJbnQ0IHVJbnQ0cyByZXBlYXQgJ1xuICAgICAgICArICdlbmQgcmVwZWF0IFVSTCBpbiB0cnkgaW50byBzd2l0Y2ggdG8gd29yZHMgaHR0cHMgdG9rZW4gYmluZmlsZSBlYWNoIHRlbnRoIGFzIHRpY2tzIHRpY2sgJ1xuICAgICAgICArICdzeXN0ZW0gcmVhbDQgYnkgZGF0ZUl0ZW1zIHdpdGhvdXQgY2hhciBjaGFyYWN0ZXIgYXNjZW5kaW5nIGVpZ2h0aCB3aG9sZSBkYXRlVGltZSBudW1lcmljIHNob3J0ICdcbiAgICAgICAgKyAnZmlyc3QgZnRwIGludGVnZXIgYWJicmV2aWF0ZWQgYWJiciBhYmJyZXYgcHJpdmF0ZSBjYXNlIHdoaWxlIGlmICdcbiAgICAgICAgKyAnZGl2IG1vZCB3cmFwIGFuZCBvciBiaXRBbmQgYml0Tm90IGJpdE9yIGJpdFhvciBhbW9uZyBub3QgaW4gYSBhbiB3aXRoaW4gJ1xuICAgICAgICArICdjb250YWlucyBlbmRzIHdpdGggYmVnaW5zIHRoZSBrZXlzIG9mIGtleXMnLFxuICAgICAgbGl0ZXJhbDpcbiAgICAgICAgJ1NJWCBURU4gRk9STUZFRUQgTklORSBaRVJPIE5PTkUgU1BBQ0UgRk9VUiBGQUxTRSBDT0xPTiBDUkxGIFBJIENPTU1BIEVORE9GRklMRSBFT0YgRUlHSFQgRklWRSAnXG4gICAgICAgICsgJ1FVT1RFIEVNUFRZIE9ORSBUUlVFIFJFVFVSTiBDUiBMSU5FRkVFRCBSSUdIVCBCQUNLU0xBU0ggTlVMTCBTRVZFTiBUQUIgVEhSRUUgVFdPICdcbiAgICAgICAgKyAnc2l4IHRlbiBmb3JtZmVlZCBuaW5lIHplcm8gbm9uZSBzcGFjZSBmb3VyIGZhbHNlIGNvbG9uIGNybGYgcGkgY29tbWEgZW5kb2ZmaWxlIGVvZiBlaWdodCBmaXZlICdcbiAgICAgICAgKyAncXVvdGUgZW1wdHkgb25lIHRydWUgcmV0dXJuIGNyIGxpbmVmZWVkIHJpZ2h0IGJhY2tzbGFzaCBudWxsIHNldmVuIHRhYiB0aHJlZSB0d28gJ1xuICAgICAgICArICdSSVZFUlNJT04gUklTVEFURSBGSUxFX1JFQURfTU9ERSBGSUxFX1dSSVRFX01PREUgRklMRV9XUklURV9NT0RFIERJUl9XUklURV9NT0RFIEZJTEVfUkVBRF9VTUFTSyAnXG4gICAgICAgICsgJ0ZJTEVfV1JJVEVfVU1BU0sgRElSX1JFQURfVU1BU0sgRElSX1dSSVRFX1VNQVNLJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAncHV0IGFicyBhY29zIGFsaWFzUmVmZXJlbmNlIGFubnVpdHkgYXJyYXlEZWNvZGUgYXJyYXlFbmNvZGUgYXNpbiBhdGFuIGF0YW4yIGF2ZXJhZ2UgYXZnIGF2Z0RldiBiYXNlNjREZWNvZGUgJ1xuICAgICAgICArICdiYXNlNjRFbmNvZGUgYmFzZUNvbnZlcnQgYmluYXJ5RGVjb2RlIGJpbmFyeUVuY29kZSBieXRlT2Zmc2V0IGJ5dGVUb051bSBjYWNoZWRVUkwgY2FjaGVkVVJMcyBjaGFyVG9OdW0gJ1xuICAgICAgICArICdjaXBoZXJOYW1lcyBjb2RlcG9pbnRPZmZzZXQgY29kZXBvaW50UHJvcGVydHkgY29kZXBvaW50VG9OdW0gY29kZXVuaXRPZmZzZXQgY29tbWFuZE5hbWVzIGNvbXBvdW5kIGNvbXByZXNzICdcbiAgICAgICAgKyAnY29uc3RhbnROYW1lcyBjb3MgZGF0ZSBkYXRlRm9ybWF0IGRlY29tcHJlc3MgZGlmZmVyZW5jZSBkaXJlY3RvcmllcyAnXG4gICAgICAgICsgJ2Rpc2tTcGFjZSBETlNTZXJ2ZXJzIGV4cCBleHAxIGV4cDIgZXhwMTAgZXh0ZW50cyBmaWxlcyBmbHVzaEV2ZW50cyBmb2xkZXJzIGZvcm1hdCBmdW5jdGlvbk5hbWVzIGdlb21ldHJpY01lYW4gZ2xvYmFsICdcbiAgICAgICAgKyAnZ2xvYmFscyBoYXNNZW1vcnkgaGFybW9uaWNNZWFuIGhvc3RBZGRyZXNzIGhvc3RBZGRyZXNzVG9OYW1lIGhvc3ROYW1lIGhvc3ROYW1lVG9BZGRyZXNzIGlzTnVtYmVyIElTT1RvTWFjIGl0ZW1PZmZzZXQgJ1xuICAgICAgICArICdrZXlzIGxlbiBsZW5ndGggbGliVVJMRXJyb3JEYXRhIGxpYlVybEZvcm1EYXRhIGxpYlVSTGZ0cENvbW1hbmQgbGliVVJMTGFzdEhUVFBIZWFkZXJzIGxpYlVSTExhc3RSSEhlYWRlcnMgJ1xuICAgICAgICArICdsaWJVcmxNdWx0aXBhcnRGb3JtQWRkUGFydCBsaWJVcmxNdWx0aXBhcnRGb3JtRGF0YSBsaWJVUkxWZXJzaW9uIGxpbmVPZmZzZXQgbG4gbG4xIGxvY2FsTmFtZXMgbG9nIGxvZzIgbG9nMTAgJ1xuICAgICAgICArICdsb25nRmlsZVBhdGggbG93ZXIgbWFjVG9JU08gbWF0Y2hDaHVuayBtYXRjaFRleHQgbWF0cml4TXVsdGlwbHkgbWF4IG1kNURpZ2VzdCBtZWRpYW4gbWVyZ2UgbWVzc2FnZUF1dGhlbnRpY2F0aW9uQ29kZSBtZXNzYWdlRGlnZXN0IG1pbGxpc2VjICdcbiAgICAgICAgKyAnbWlsbGlzZWNzIG1pbGxpc2Vjb25kIG1pbGxpc2Vjb25kcyBtaW4gbW9udGhOYW1lcyBuYXRpdmVDaGFyVG9OdW0gbm9ybWFsaXplVGV4dCBudW0gbnVtYmVyIG51bVRvQnl0ZSBudW1Ub0NoYXIgJ1xuICAgICAgICArICdudW1Ub0NvZGVwb2ludCBudW1Ub05hdGl2ZUNoYXIgb2Zmc2V0IG9wZW4gb3BlbmZpbGVzIG9wZW5Qcm9jZXNzZXMgb3BlblByb2Nlc3NJRHMgb3BlblNvY2tldHMgJ1xuICAgICAgICArICdwYXJhZ3JhcGhPZmZzZXQgcGFyYW1Db3VudCBwYXJhbSBwYXJhbXMgcGVlckFkZHJlc3MgcGVuZGluZ01lc3NhZ2VzIHBsYXRmb3JtIHBvcFN0ZERldiBwb3B1bGF0aW9uU3RhbmRhcmREZXZpYXRpb24gJ1xuICAgICAgICArICdwb3B1bGF0aW9uVmFyaWFuY2UgcG9wVmFyaWFuY2UgcHJvY2Vzc0lEIHJhbmRvbSByYW5kb21CeXRlcyByZXBsYWNlVGV4dCByZXN1bHQgcmV2Q3JlYXRlWE1MVHJlZSByZXZDcmVhdGVYTUxUcmVlRnJvbUZpbGUgJ1xuICAgICAgICArICdyZXZDdXJyZW50UmVjb3JkIHJldkN1cnJlbnRSZWNvcmRJc0ZpcnN0IHJldkN1cnJlbnRSZWNvcmRJc0xhc3QgcmV2RGF0YWJhc2VDb2x1bW5Db3VudCByZXZEYXRhYmFzZUNvbHVtbklzTnVsbCAnXG4gICAgICAgICsgJ3JldkRhdGFiYXNlQ29sdW1uTGVuZ3RocyByZXZEYXRhYmFzZUNvbHVtbk5hbWVzIHJldkRhdGFiYXNlQ29sdW1uTmFtZWQgcmV2RGF0YWJhc2VDb2x1bW5OdW1iZXJlZCAnXG4gICAgICAgICsgJ3JldkRhdGFiYXNlQ29sdW1uVHlwZXMgcmV2RGF0YWJhc2VDb25uZWN0UmVzdWx0IHJldkRhdGFiYXNlQ3Vyc29ycyByZXZEYXRhYmFzZUlEIHJldkRhdGFiYXNlVGFibGVOYW1lcyAnXG4gICAgICAgICsgJ3JldkRhdGFiYXNlVHlwZSByZXZEYXRhRnJvbVF1ZXJ5IHJldmRiX2Nsb3NlQ3Vyc29yIHJldmRiX2NvbHVtbmJ5bnVtYmVyIHJldmRiX2NvbHVtbmNvdW50IHJldmRiX2NvbHVtbmlzbnVsbCAnXG4gICAgICAgICsgJ3JldmRiX2NvbHVtbmxlbmd0aHMgcmV2ZGJfY29sdW1ubmFtZXMgcmV2ZGJfY29sdW1udHlwZXMgcmV2ZGJfY29tbWl0IHJldmRiX2Nvbm5lY3QgcmV2ZGJfY29ubmVjdGlvbnMgJ1xuICAgICAgICArICdyZXZkYl9jb25uZWN0aW9uZXJyIHJldmRiX2N1cnJlbnRyZWNvcmQgcmV2ZGJfY3Vyc29yY29ubmVjdGlvbiByZXZkYl9jdXJzb3JlcnIgcmV2ZGJfY3Vyc29ycyByZXZkYl9kYnR5cGUgJ1xuICAgICAgICArICdyZXZkYl9kaXNjb25uZWN0IHJldmRiX2V4ZWN1dGUgcmV2ZGJfaXNlb2YgcmV2ZGJfaXNib2YgcmV2ZGJfbW92ZWZpcnN0IHJldmRiX21vdmVsYXN0IHJldmRiX21vdmVuZXh0ICdcbiAgICAgICAgKyAncmV2ZGJfbW92ZXByZXYgcmV2ZGJfcXVlcnkgcmV2ZGJfcXVlcnlsaXN0IHJldmRiX3JlY29yZGNvdW50IHJldmRiX3JvbGxiYWNrIHJldmRiX3RhYmxlbmFtZXMgJ1xuICAgICAgICArICdyZXZHZXREYXRhYmFzZURyaXZlclBhdGggcmV2TnVtYmVyT2ZSZWNvcmRzIHJldk9wZW5EYXRhYmFzZSByZXZPcGVuRGF0YWJhc2VzIHJldlF1ZXJ5RGF0YWJhc2UgJ1xuICAgICAgICArICdyZXZRdWVyeURhdGFiYXNlQmxvYiByZXZRdWVyeVJlc3VsdCByZXZRdWVyeUlzQXRTdGFydCByZXZRdWVyeUlzQXRFbmQgcmV2VW5peEZyb21NYWNQYXRoIHJldlhNTEF0dHJpYnV0ZSAnXG4gICAgICAgICsgJ3JldlhNTEF0dHJpYnV0ZXMgcmV2WE1MQXR0cmlidXRlVmFsdWVzIHJldlhNTENoaWxkQ29udGVudHMgcmV2WE1MQ2hpbGROYW1lcyByZXZYTUxDcmVhdGVUcmVlRnJvbUZpbGVXaXRoTmFtZXNwYWNlcyAnXG4gICAgICAgICsgJ3JldlhNTENyZWF0ZVRyZWVXaXRoTmFtZXNwYWNlcyByZXZYTUxEYXRhRnJvbVhQYXRoUXVlcnkgcmV2WE1MRXZhbHVhdGVYUGF0aCByZXZYTUxGaXJzdENoaWxkIHJldlhNTE1hdGNoaW5nTm9kZSAnXG4gICAgICAgICsgJ3JldlhNTE5leHRTaWJsaW5nIHJldlhNTE5vZGVDb250ZW50cyByZXZYTUxOdW1iZXJPZkNoaWxkcmVuIHJldlhNTFBhcmVudCByZXZYTUxQcmV2aW91c1NpYmxpbmcgJ1xuICAgICAgICArICdyZXZYTUxSb290Tm9kZSByZXZYTUxSUENfQ3JlYXRlUmVxdWVzdCByZXZYTUxSUENfRG9jdW1lbnRzIHJldlhNTFJQQ19FcnJvciAnXG4gICAgICAgICsgJ3JldlhNTFJQQ19HZXRIb3N0IHJldlhNTFJQQ19HZXRNZXRob2QgcmV2WE1MUlBDX0dldFBhcmFtIHJldlhNTFRleHQgcmV2WE1MUlBDX0V4ZWN1dGUgJ1xuICAgICAgICArICdyZXZYTUxSUENfR2V0UGFyYW1Db3VudCByZXZYTUxSUENfR2V0UGFyYW1Ob2RlIHJldlhNTFJQQ19HZXRQYXJhbVR5cGUgcmV2WE1MUlBDX0dldFBhdGggcmV2WE1MUlBDX0dldFBvcnQgJ1xuICAgICAgICArICdyZXZYTUxSUENfR2V0UHJvdG9jb2wgcmV2WE1MUlBDX0dldFJlcXVlc3QgcmV2WE1MUlBDX0dldFJlc3BvbnNlIHJldlhNTFJQQ19HZXRTb2NrZXQgcmV2WE1MVHJlZSAnXG4gICAgICAgICsgJ3JldlhNTFRyZWVzIHJldlhNTFZhbGlkYXRlRFREIHJldlppcERlc2NyaWJlSXRlbSByZXZaaXBFbnVtZXJhdGVJdGVtcyByZXZaaXBPcGVuQXJjaGl2ZXMgcm91bmQgc2FtcFZhcmlhbmNlICdcbiAgICAgICAgKyAnc2VjIHNlY3Mgc2Vjb25kcyBzZW50ZW5jZU9mZnNldCBzaGExRGlnZXN0IHNoZWxsIHNob3J0RmlsZVBhdGggc2luIHNwZWNpYWxGb2xkZXJQYXRoIHNxcnQgc3RhbmRhcmREZXZpYXRpb24gc3RhdFJvdW5kICdcbiAgICAgICAgKyAnc3RkRGV2IHN1bSBzeXNFcnJvciBzeXN0ZW1WZXJzaW9uIHRhbiB0ZW1wTmFtZSB0ZXh0RGVjb2RlIHRleHRFbmNvZGUgdGljayB0aWNrcyB0aW1lIHRvIHRva2VuT2Zmc2V0IHRvTG93ZXIgdG9VcHBlciAnXG4gICAgICAgICsgJ3RyYW5zcG9zZSB0cnVld29yZE9mZnNldCB0cnVuYyB1bmlEZWNvZGUgdW5pRW5jb2RlIHVwcGVyIFVSTERlY29kZSBVUkxFbmNvZGUgVVJMU3RhdHVzIHV1aWQgdmFsdWUgdmFyaWFibGVOYW1lcyAnXG4gICAgICAgICsgJ3ZhcmlhbmNlIHZlcnNpb24gd2FpdERlcHRoIHdlZWtkYXlOYW1lcyB3b3JkT2Zmc2V0IHhzbHRBcHBseVN0eWxlc2hlZXQgeHNsdEFwcGx5U3R5bGVzaGVldEZyb21GaWxlIHhzbHRMb2FkU3R5bGVzaGVldCAnXG4gICAgICAgICsgJ3hzbHRMb2FkU3R5bGVzaGVldEZyb21GaWxlIGFkZCBicmVha3BvaW50IGNhbmNlbCBjbGVhciBsb2NhbCB2YXJpYWJsZSBmaWxlIHdvcmQgbGluZSBmb2xkZXIgZGlyZWN0b3J5IFVSTCBjbG9zZSBzb2NrZXQgcHJvY2VzcyAnXG4gICAgICAgICsgJ2NvbWJpbmUgY29uc3RhbnQgY29udmVydCBjcmVhdGUgbmV3IGFsaWFzIGZvbGRlciBkaXJlY3RvcnkgZGVjcnlwdCBkZWxldGUgdmFyaWFibGUgd29yZCBsaW5lIGZvbGRlciAnXG4gICAgICAgICsgJ2RpcmVjdG9yeSBVUkwgZGlzcGF0Y2ggZGl2aWRlIGRvIGVuY3J5cHQgZmlsdGVyIGdldCBpbmNsdWRlIGludGVyc2VjdCBraWxsIGxpYlVSTERvd25sb2FkVG9GaWxlICdcbiAgICAgICAgKyAnbGliVVJMRm9sbG93SHR0cFJlZGlyZWN0cyBsaWJVUkxmdHBVcGxvYWQgbGliVVJMZnRwVXBsb2FkRmlsZSBsaWJVUkxyZXNldEFsbCBsaWJVcmxTZXRBdXRoQ2FsbGJhY2sgbGliVVJMU2V0RHJpdmVyICdcbiAgICAgICAgKyAnbGliVVJMU2V0Q3VzdG9tSFRUUEhlYWRlcnMgbGliVXJsU2V0RXhwZWN0MTAwIGxpYlVSTFNldEZUUExpc3RDb21tYW5kIGxpYlVSTFNldEZUUE1vZGUgbGliVVJMU2V0RlRQU3RvcFRpbWUgJ1xuICAgICAgICArICdsaWJVUkxTZXRTdGF0dXNDYWxsYmFjayBsb2FkIGV4dGVuc2lvbiBsb2FkZWRFeHRlbnNpb25zIG11bHRpcGx5IHNvY2tldCBwcmVwYXJlIHByb2Nlc3MgcG9zdCBzZWVrIHJlbCByZWxhdGl2ZSByZWFkIGZyb20gcHJvY2VzcyByZW5hbWUgJ1xuICAgICAgICArICdyZXBsYWNlIHJlcXVpcmUgcmVzZXRBbGwgcmVzb2x2ZSByZXZBZGRYTUxOb2RlIHJldkFwcGVuZFhNTCByZXZDbG9zZUN1cnNvciByZXZDbG9zZURhdGFiYXNlIHJldkNvbW1pdERhdGFiYXNlICdcbiAgICAgICAgKyAncmV2Q29weUZpbGUgcmV2Q29weUZvbGRlciByZXZDb3B5WE1MTm9kZSByZXZEZWxldGVGb2xkZXIgcmV2RGVsZXRlWE1MTm9kZSByZXZEZWxldGVBbGxYTUxUcmVlcyAnXG4gICAgICAgICsgJ3JldkRlbGV0ZVhNTFRyZWUgcmV2RXhlY3V0ZVNRTCByZXZHb1VSTCByZXZJbnNlcnRYTUxOb2RlIHJldk1vdmVGb2xkZXIgcmV2TW92ZVRvRmlyc3RSZWNvcmQgcmV2TW92ZVRvTGFzdFJlY29yZCAnXG4gICAgICAgICsgJ3Jldk1vdmVUb05leHRSZWNvcmQgcmV2TW92ZVRvUHJldmlvdXNSZWNvcmQgcmV2TW92ZVRvUmVjb3JkIHJldk1vdmVYTUxOb2RlIHJldlB1dEludG9YTUxOb2RlIHJldlJvbGxCYWNrRGF0YWJhc2UgJ1xuICAgICAgICArICdyZXZTZXREYXRhYmFzZURyaXZlclBhdGggcmV2U2V0WE1MQXR0cmlidXRlIHJldlhNTFJQQ19BZGRQYXJhbSByZXZYTUxSUENfRGVsZXRlQWxsRG9jdW1lbnRzIHJldlhNTEFkZERURCAnXG4gICAgICAgICsgJ3JldlhNTFJQQ19GcmVlIHJldlhNTFJQQ19GcmVlQWxsIHJldlhNTFJQQ19EZWxldGVEb2N1bWVudCByZXZYTUxSUENfRGVsZXRlUGFyYW0gcmV2WE1MUlBDX1NldEhvc3QgJ1xuICAgICAgICArICdyZXZYTUxSUENfU2V0TWV0aG9kIHJldlhNTFJQQ19TZXRQb3J0IHJldlhNTFJQQ19TZXRQcm90b2NvbCByZXZYTUxSUENfU2V0U29ja2V0IHJldlppcEFkZEl0ZW1XaXRoRGF0YSAnXG4gICAgICAgICsgJ3JldlppcEFkZEl0ZW1XaXRoRmlsZSByZXZaaXBBZGRVbmNvbXByZXNzZWRJdGVtV2l0aERhdGEgcmV2WmlwQWRkVW5jb21wcmVzc2VkSXRlbVdpdGhGaWxlIHJldlppcENhbmNlbCAnXG4gICAgICAgICsgJ3JldlppcENsb3NlQXJjaGl2ZSByZXZaaXBEZWxldGVJdGVtIHJldlppcEV4dHJhY3RJdGVtVG9GaWxlIHJldlppcEV4dHJhY3RJdGVtVG9WYXJpYWJsZSByZXZaaXBTZXRQcm9ncmVzc0NhbGxiYWNrICdcbiAgICAgICAgKyAncmV2WmlwUmVuYW1lSXRlbSByZXZaaXBSZXBsYWNlSXRlbVdpdGhEYXRhIHJldlppcFJlcGxhY2VJdGVtV2l0aEZpbGUgcmV2WmlwT3BlbkFyY2hpdmUgc2VuZCBzZXQgc29ydCBzcGxpdCBzdGFydCBzdG9wICdcbiAgICAgICAgKyAnc3VidHJhY3Qgc3ltbWV0cmljIHVuaW9uIHVubG9hZCB2ZWN0b3JEb3RQcm9kdWN0IHdhaXQgd3JpdGUnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgVkFSSUFCTEUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiZW5kXFxcXHNpZlxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBWQVJJQUJMRSxcbiAgICAgICAgICBUSVRMRTIsXG4gICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsXG4gICAgICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgICAgIFRJVExFMVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJlbmRcXFxccysnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdlbmQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFRJVExFMixcbiAgICAgICAgICBUSVRMRTFcbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnY29tbWFuZCBvbicsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFZBUklBQkxFLFxuICAgICAgICAgIFRJVExFMixcbiAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSxcbiAgICAgICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICAgICAgVElUTEUxXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnPFxcXFw/KHJldnxsY3xsaXZlY29kZSknLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBiZWdpbjogJzxcXFxcPycgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXFxcXD8+JyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBUSVRMRTFcbiAgICBdLmNvbmNhdChDT01NRU5UX01PREVTKSxcbiAgICBpbGxlZ2FsOiAnOyR8XlxcXFxbfF49fCZ8XFxcXHsnXG4gIH07XG59XG5cbmV4cG9ydCB7IGxpdmVjb2Rlc2VydmVyIGFzIGRlZmF1bHQgfTtcbiJdfQ==