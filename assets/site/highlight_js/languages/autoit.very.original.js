function autoit(hljs) {
    const KEYWORDS = 'ByRef Case Const ContinueCase ContinueLoop '
        + 'Dim Do Else ElseIf EndFunc EndIf EndSelect '
        + 'EndSwitch EndWith Enum Exit ExitLoop For Func '
        + 'Global If In Local Next ReDim Return Select Static '
        + 'Step Switch Then To Until Volatile WEnd While With';
    const DIRECTIVES = [
        "EndRegion",
        "forcedef",
        "forceref",
        "ignorefunc",
        "include",
        "include-once",
        "NoTrayIcon",
        "OnAutoItStartRegister",
        "pragma",
        "Region",
        "RequireAdmin",
        "Tidy_Off",
        "Tidy_On",
        "Tidy_Parameters"
    ];
    const LITERAL = 'True False And Null Not Or Default';
    const BUILT_IN = 'Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin Assign ATan AutoItSetOption AutoItWinGetTitle AutoItWinSetTitle Beep Binary BinaryLen BinaryMid BinaryToString BitAND BitNOT BitOR BitRotate BitShift BitXOR BlockInput Break Call CDTray Ceiling Chr ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ConsoleWriteError ControlClick ControlCommand ControlDisable ControlEnable ControlFocus ControlGetFocus ControlGetHandle ControlGetPos ControlGetText ControlHide ControlListView ControlMove ControlSend ControlSetText ControlShow ControlTreeView Cos Dec DirCopy DirCreate DirGetSize DirMove DirRemove DllCall DllCallAddress DllCallbackFree DllCallbackGetPtr DllCallbackRegister DllClose DllOpen DllStructCreate DllStructGetData DllStructGetPtr DllStructGetSize DllStructSetData DriveGetDrive DriveGetFileSystem DriveGetLabel DriveGetSerial DriveGetType DriveMapAdd DriveMapDel DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp FileChangeDir FileClose FileCopy FileCreateNTFSLink FileCreateShortcut FileDelete FileExists FileFindFirstFile FileFindNextFile FileFlush FileGetAttrib FileGetEncoding FileGetLongName FileGetPos FileGetShortcut FileGetShortName FileGetSize FileGetTime FileGetVersion FileInstall FileMove FileOpen FileOpenDialog FileRead FileReadLine FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog FileSelectFolder FileSetAttrib FileSetEnd FileSetPos FileSetTime FileWrite FileWriteLine Floor FtpSetProxy FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton GUICtrlCreateCheckbox GUICtrlCreateCombo GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel GUICtrlCreateList GUICtrlCreateListView GUICtrlCreateListViewItem GUICtrlCreateMenu GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem GUICtrlCreateTreeView GUICtrlCreateTreeViewItem GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle GUICtrlGetState GUICtrlRead GUICtrlRecvMsg GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon GUISetOnEvent GUISetState GUISetStyle GUIStartGroup GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent HWnd InetClose InetGet InetGetInfo InetGetSize InetRead IniDelete IniRead IniReadSection IniReadSectionNames IniRenameSection IniWrite IniWriteSection InputBox Int IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj IsPtr IsString Log MemGetStats Mod MouseClick MouseClickDrag MouseDown MouseGetCursor MouseGetPos MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ObjCreateInterface ObjEvent ObjGet ObjName OnAutoItExitRegister OnAutoItExitUnRegister Ping PixelChecksum PixelGetColor PixelSearch ProcessClose ProcessExists ProcessGetStats ProcessList ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait RunWait Send SendKeepActive SetError SetExtended ShellExecute ShellExecuteWait Shutdown Sin Sleep SoundPlay SoundSetWaveVolume SplashImageOn SplashOff SplashTextOn Sqrt SRandom StatusbarGetText StderrRead StdinWrite StdioClose StdoutRead String StringAddCR StringCompare StringFormat StringFromASCIIArray StringInStr StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit StringIsFloat StringIsInt StringIsLower StringIsSpace StringIsUpper StringIsXDigit StringLeft StringLen StringLower StringMid StringRegExp StringRegExpReplace StringReplace StringReverse StringRight StringSplit StringStripCR StringStripWS StringToASCIIArray StringToBinary StringTrimLeft StringTrimRight StringUpper Tan TCPAccept TCPCloseSocket TCPConnect TCPListen TCPNameToIP TCPRecv TCPSend TCPShutdown, UDPShutdown TCPStartup, UDPStartup TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu TrayGetMsg TrayItemDelete TrayItemGetHandle TrayItemGetState TrayItemGetText TrayItemSetOnEvent TrayItemSetState TrayItemSetText TraySetClick TraySetIcon TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv UDPSend VarGetType WinActivate WinActive WinClose WinExists WinFlash WinGetCaretPos WinGetClassList WinGetClientSize WinGetHandle WinGetPos WinGetProcess WinGetState WinGetText WinGetTitle WinKill WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans WinWait WinWaitActive WinWaitClose WinWaitNotActive';
    const COMMENT = { variants: [
            hljs.COMMENT(';', '$', { relevance: 0 }),
            hljs.COMMENT('#cs', '#ce'),
            hljs.COMMENT('#comments-start', '#comments-end')
        ] };
    const VARIABLE = { begin: '\\$[A-z0-9_]+' };
    const STRING = {
        className: 'string',
        variants: [
            {
                begin: /"/,
                end: /"/,
                contains: [
                    {
                        begin: /""/,
                        relevance: 0
                    }
                ]
            },
            {
                begin: /'/,
                end: /'/,
                contains: [
                    {
                        begin: /''/,
                        relevance: 0
                    }
                ]
            }
        ]
    };
    const NUMBER = { variants: [
            hljs.BINARY_NUMBER_MODE,
            hljs.C_NUMBER_MODE
        ] };
    const PREPROCESSOR = {
        className: 'meta',
        begin: '#',
        end: '$',
        keywords: { keyword: DIRECTIVES },
        contains: [
            {
                begin: /\\\n/,
                relevance: 0
            },
            {
                beginKeywords: 'include',
                keywords: { keyword: 'include' },
                end: '$',
                contains: [
                    STRING,
                    {
                        className: 'string',
                        variants: [
                            {
                                begin: '<',
                                end: '>'
                            },
                            {
                                begin: /"/,
                                end: /"/,
                                contains: [
                                    {
                                        begin: /""/,
                                        relevance: 0
                                    }
                                ]
                            },
                            {
                                begin: /'/,
                                end: /'/,
                                contains: [
                                    {
                                        begin: /''/,
                                        relevance: 0
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            STRING,
            COMMENT
        ]
    };
    const CONSTANT = {
        className: 'symbol',
        begin: '@[A-z0-9_]+'
    };
    const FUNCTION = {
        beginKeywords: 'Func',
        end: '$',
        illegal: '\\$|\\[|%',
        contains: [
            hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { className: "title.function" }),
            {
                className: 'params',
                begin: '\\(',
                end: '\\)',
                contains: [
                    VARIABLE,
                    STRING,
                    NUMBER
                ]
            }
        ]
    };
    return {
        name: 'AutoIt',
        case_insensitive: true,
        illegal: /\/\*/,
        keywords: {
            keyword: KEYWORDS,
            built_in: BUILT_IN,
            literal: LITERAL
        },
        contains: [
            COMMENT,
            VARIABLE,
            STRING,
            NUMBER,
            PREPROCESSOR,
            CONSTANT,
            FUNCTION
        ]
    };
}
export { autoit as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2l0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CZWxsQ3ViZURldi9zaXRlLXRlc3RpbmcvZGVwbG95bWVudC8iLCJzb3VyY2VzIjpbImFzc2V0cy9zaXRlL2hpZ2hsaWdodF9qcy9sYW5ndWFnZXMvYXV0b2l0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbEIsTUFBTSxRQUFRLEdBQUcsNkNBQTZDO1VBQ3RELDZDQUE2QztVQUM3QyxnREFBZ0Q7VUFDaEQscURBQXFEO1VBQ3JELG9EQUFvRCxDQUFDO0lBRTdELE1BQU0sVUFBVSxHQUFHO1FBQ2pCLFdBQVc7UUFDWCxVQUFVO1FBQ1YsVUFBVTtRQUNWLFlBQVk7UUFDWixTQUFTO1FBQ1QsY0FBYztRQUNkLFlBQVk7UUFDWix1QkFBdUI7UUFDdkIsUUFBUTtRQUNSLFFBQVE7UUFDUixjQUFjO1FBQ2QsVUFBVTtRQUNWLFNBQVM7UUFDVCxpQkFBaUI7S0FDbEIsQ0FBQztJQUVGLE1BQU0sT0FBTyxHQUFHLG9DQUFvQyxDQUFDO0lBRXJELE1BQU0sUUFBUSxHQUNOLDY2SkFBNjZKLENBQUM7SUFFdDdKLE1BQU0sT0FBTyxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUM7U0FDakQsRUFBRSxDQUFDO0lBRUosTUFBTSxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLENBQUM7SUFFNUMsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsUUFBUTtRQUNuQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsR0FBRztnQkFDVixHQUFHLEVBQUUsR0FBRztnQkFDUixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsU0FBUyxFQUFFLENBQUM7cUJBQ2I7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxHQUFHO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxLQUFLLEVBQUUsSUFBSTt3QkFDWCxTQUFTLEVBQUUsQ0FBQztxQkFDYjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDekIsSUFBSSxDQUFDLGtCQUFrQjtZQUN2QixJQUFJLENBQUMsYUFBYTtTQUNuQixFQUFFLENBQUM7SUFFSixNQUFNLFlBQVksR0FBRztRQUNuQixTQUFTLEVBQUUsTUFBTTtRQUNqQixLQUFLLEVBQUUsR0FBRztRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtRQUNqQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxLQUFLLEVBQUUsTUFBTTtnQkFDYixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsYUFBYSxFQUFFLFNBQVM7Z0JBQ3hCLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7Z0JBQ2hDLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRTtvQkFDUixNQUFNO29CQUNOO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixRQUFRLEVBQUU7NEJBQ1I7Z0NBQ0UsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsR0FBRyxFQUFFLEdBQUc7NkJBQ1Q7NEJBQ0Q7Z0NBQ0UsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsR0FBRyxFQUFFLEdBQUc7Z0NBQ1IsUUFBUSxFQUFFO29DQUNSO3dDQUNFLEtBQUssRUFBRSxJQUFJO3dDQUNYLFNBQVMsRUFBRSxDQUFDO3FDQUNiO2lDQUNGOzZCQUNGOzRCQUNEO2dDQUNFLEtBQUssRUFBRSxHQUFHO2dDQUNWLEdBQUcsRUFBRSxHQUFHO2dDQUNSLFFBQVEsRUFBRTtvQ0FDUjt3Q0FDRSxLQUFLLEVBQUUsSUFBSTt3Q0FDWCxTQUFTLEVBQUUsQ0FBQztxQ0FDYjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsTUFBTTtZQUNOLE9BQU87U0FDUjtLQUNGLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBRztRQUNmLFNBQVMsRUFBRSxRQUFRO1FBS25CLEtBQUssRUFBRSxhQUFhO0tBQ3JCLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBRztRQUNmLGFBQWEsRUFBRSxNQUFNO1FBQ3JCLEdBQUcsRUFBRSxHQUFHO1FBQ1IsT0FBTyxFQUFFLFdBQVc7UUFDcEIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUN6RTtnQkFDRSxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLFFBQVE7b0JBQ1IsTUFBTTtvQkFDTixNQUFNO2lCQUNQO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFFBQVE7WUFDakIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsT0FBTyxFQUFFLE9BQU87U0FDakI7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPO1lBQ1AsUUFBUTtZQUNSLE1BQU07WUFDTixNQUFNO1lBQ04sWUFBWTtZQUNaLFFBQVE7WUFDUixRQUFRO1NBQ1Q7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTGFuZ3VhZ2U6IEF1dG9JdFxuQXV0aG9yOiBNYW5oIFR1YW4gPGp1bm9va3lvQGdtYWlsLmNvbT5cbkRlc2NyaXB0aW9uOiBBdXRvSXQgbGFuZ3VhZ2UgZGVmaW5pdGlvblxuQ2F0ZWdvcnk6IHNjcmlwdGluZ1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIGF1dG9pdChobGpzKSB7XG4gIGNvbnN0IEtFWVdPUkRTID0gJ0J5UmVmIENhc2UgQ29uc3QgQ29udGludWVDYXNlIENvbnRpbnVlTG9vcCAnXG4gICAgICAgICsgJ0RpbSBEbyBFbHNlIEVsc2VJZiBFbmRGdW5jIEVuZElmIEVuZFNlbGVjdCAnXG4gICAgICAgICsgJ0VuZFN3aXRjaCBFbmRXaXRoIEVudW0gRXhpdCBFeGl0TG9vcCBGb3IgRnVuYyAnXG4gICAgICAgICsgJ0dsb2JhbCBJZiBJbiBMb2NhbCBOZXh0IFJlRGltIFJldHVybiBTZWxlY3QgU3RhdGljICdcbiAgICAgICAgKyAnU3RlcCBTd2l0Y2ggVGhlbiBUbyBVbnRpbCBWb2xhdGlsZSBXRW5kIFdoaWxlIFdpdGgnO1xuXG4gIGNvbnN0IERJUkVDVElWRVMgPSBbXG4gICAgXCJFbmRSZWdpb25cIixcbiAgICBcImZvcmNlZGVmXCIsXG4gICAgXCJmb3JjZXJlZlwiLFxuICAgIFwiaWdub3JlZnVuY1wiLFxuICAgIFwiaW5jbHVkZVwiLFxuICAgIFwiaW5jbHVkZS1vbmNlXCIsXG4gICAgXCJOb1RyYXlJY29uXCIsXG4gICAgXCJPbkF1dG9JdFN0YXJ0UmVnaXN0ZXJcIixcbiAgICBcInByYWdtYVwiLFxuICAgIFwiUmVnaW9uXCIsXG4gICAgXCJSZXF1aXJlQWRtaW5cIixcbiAgICBcIlRpZHlfT2ZmXCIsXG4gICAgXCJUaWR5X09uXCIsXG4gICAgXCJUaWR5X1BhcmFtZXRlcnNcIlxuICBdO1xuXG4gIGNvbnN0IExJVEVSQUwgPSAnVHJ1ZSBGYWxzZSBBbmQgTnVsbCBOb3QgT3IgRGVmYXVsdCc7XG5cbiAgY29uc3QgQlVJTFRfSU4gPVxuICAgICAgICAgICdBYnMgQUNvcyBBZGxpYlJlZ2lzdGVyIEFkbGliVW5SZWdpc3RlciBBc2MgQXNjVyBBU2luIEFzc2lnbiBBVGFuIEF1dG9JdFNldE9wdGlvbiBBdXRvSXRXaW5HZXRUaXRsZSBBdXRvSXRXaW5TZXRUaXRsZSBCZWVwIEJpbmFyeSBCaW5hcnlMZW4gQmluYXJ5TWlkIEJpbmFyeVRvU3RyaW5nIEJpdEFORCBCaXROT1QgQml0T1IgQml0Um90YXRlIEJpdFNoaWZ0IEJpdFhPUiBCbG9ja0lucHV0IEJyZWFrIENhbGwgQ0RUcmF5IENlaWxpbmcgQ2hyIENoclcgQ2xpcEdldCBDbGlwUHV0IENvbnNvbGVSZWFkIENvbnNvbGVXcml0ZSBDb25zb2xlV3JpdGVFcnJvciBDb250cm9sQ2xpY2sgQ29udHJvbENvbW1hbmQgQ29udHJvbERpc2FibGUgQ29udHJvbEVuYWJsZSBDb250cm9sRm9jdXMgQ29udHJvbEdldEZvY3VzIENvbnRyb2xHZXRIYW5kbGUgQ29udHJvbEdldFBvcyBDb250cm9sR2V0VGV4dCBDb250cm9sSGlkZSBDb250cm9sTGlzdFZpZXcgQ29udHJvbE1vdmUgQ29udHJvbFNlbmQgQ29udHJvbFNldFRleHQgQ29udHJvbFNob3cgQ29udHJvbFRyZWVWaWV3IENvcyBEZWMgRGlyQ29weSBEaXJDcmVhdGUgRGlyR2V0U2l6ZSBEaXJNb3ZlIERpclJlbW92ZSBEbGxDYWxsIERsbENhbGxBZGRyZXNzIERsbENhbGxiYWNrRnJlZSBEbGxDYWxsYmFja0dldFB0ciBEbGxDYWxsYmFja1JlZ2lzdGVyIERsbENsb3NlIERsbE9wZW4gRGxsU3RydWN0Q3JlYXRlIERsbFN0cnVjdEdldERhdGEgRGxsU3RydWN0R2V0UHRyIERsbFN0cnVjdEdldFNpemUgRGxsU3RydWN0U2V0RGF0YSBEcml2ZUdldERyaXZlIERyaXZlR2V0RmlsZVN5c3RlbSBEcml2ZUdldExhYmVsIERyaXZlR2V0U2VyaWFsIERyaXZlR2V0VHlwZSBEcml2ZU1hcEFkZCBEcml2ZU1hcERlbCBEcml2ZU1hcEdldCBEcml2ZVNldExhYmVsIERyaXZlU3BhY2VGcmVlIERyaXZlU3BhY2VUb3RhbCBEcml2ZVN0YXR1cyBFbnZHZXQgRW52U2V0IEVudlVwZGF0ZSBFdmFsIEV4ZWN1dGUgRXhwIEZpbGVDaGFuZ2VEaXIgRmlsZUNsb3NlIEZpbGVDb3B5IEZpbGVDcmVhdGVOVEZTTGluayBGaWxlQ3JlYXRlU2hvcnRjdXQgRmlsZURlbGV0ZSBGaWxlRXhpc3RzIEZpbGVGaW5kRmlyc3RGaWxlIEZpbGVGaW5kTmV4dEZpbGUgRmlsZUZsdXNoIEZpbGVHZXRBdHRyaWIgRmlsZUdldEVuY29kaW5nIEZpbGVHZXRMb25nTmFtZSBGaWxlR2V0UG9zIEZpbGVHZXRTaG9ydGN1dCBGaWxlR2V0U2hvcnROYW1lIEZpbGVHZXRTaXplIEZpbGVHZXRUaW1lIEZpbGVHZXRWZXJzaW9uIEZpbGVJbnN0YWxsIEZpbGVNb3ZlIEZpbGVPcGVuIEZpbGVPcGVuRGlhbG9nIEZpbGVSZWFkIEZpbGVSZWFkTGluZSBGaWxlUmVhZFRvQXJyYXkgRmlsZVJlY3ljbGUgRmlsZVJlY3ljbGVFbXB0eSBGaWxlU2F2ZURpYWxvZyBGaWxlU2VsZWN0Rm9sZGVyIEZpbGVTZXRBdHRyaWIgRmlsZVNldEVuZCBGaWxlU2V0UG9zIEZpbGVTZXRUaW1lIEZpbGVXcml0ZSBGaWxlV3JpdGVMaW5lIEZsb29yIEZ0cFNldFByb3h5IEZ1bmNOYW1lIEdVSUNyZWF0ZSBHVUlDdHJsQ3JlYXRlQXZpIEdVSUN0cmxDcmVhdGVCdXR0b24gR1VJQ3RybENyZWF0ZUNoZWNrYm94IEdVSUN0cmxDcmVhdGVDb21ibyBHVUlDdHJsQ3JlYXRlQ29udGV4dE1lbnUgR1VJQ3RybENyZWF0ZURhdGUgR1VJQ3RybENyZWF0ZUR1bW15IEdVSUN0cmxDcmVhdGVFZGl0IEdVSUN0cmxDcmVhdGVHcmFwaGljIEdVSUN0cmxDcmVhdGVHcm91cCBHVUlDdHJsQ3JlYXRlSWNvbiBHVUlDdHJsQ3JlYXRlSW5wdXQgR1VJQ3RybENyZWF0ZUxhYmVsIEdVSUN0cmxDcmVhdGVMaXN0IEdVSUN0cmxDcmVhdGVMaXN0VmlldyBHVUlDdHJsQ3JlYXRlTGlzdFZpZXdJdGVtIEdVSUN0cmxDcmVhdGVNZW51IEdVSUN0cmxDcmVhdGVNZW51SXRlbSBHVUlDdHJsQ3JlYXRlTW9udGhDYWwgR1VJQ3RybENyZWF0ZU9iaiBHVUlDdHJsQ3JlYXRlUGljIEdVSUN0cmxDcmVhdGVQcm9ncmVzcyBHVUlDdHJsQ3JlYXRlUmFkaW8gR1VJQ3RybENyZWF0ZVNsaWRlciBHVUlDdHJsQ3JlYXRlVGFiIEdVSUN0cmxDcmVhdGVUYWJJdGVtIEdVSUN0cmxDcmVhdGVUcmVlVmlldyBHVUlDdHJsQ3JlYXRlVHJlZVZpZXdJdGVtIEdVSUN0cmxDcmVhdGVVcGRvd24gR1VJQ3RybERlbGV0ZSBHVUlDdHJsR2V0SGFuZGxlIEdVSUN0cmxHZXRTdGF0ZSBHVUlDdHJsUmVhZCBHVUlDdHJsUmVjdk1zZyBHVUlDdHJsUmVnaXN0ZXJMaXN0Vmlld1NvcnQgR1VJQ3RybFNlbmRNc2cgR1VJQ3RybFNlbmRUb0R1bW15IEdVSUN0cmxTZXRCa0NvbG9yIEdVSUN0cmxTZXRDb2xvciBHVUlDdHJsU2V0Q3Vyc29yIEdVSUN0cmxTZXREYXRhIEdVSUN0cmxTZXREZWZCa0NvbG9yIEdVSUN0cmxTZXREZWZDb2xvciBHVUlDdHJsU2V0Rm9udCBHVUlDdHJsU2V0R3JhcGhpYyBHVUlDdHJsU2V0SW1hZ2UgR1VJQ3RybFNldExpbWl0IEdVSUN0cmxTZXRPbkV2ZW50IEdVSUN0cmxTZXRQb3MgR1VJQ3RybFNldFJlc2l6aW5nIEdVSUN0cmxTZXRTdGF0ZSBHVUlDdHJsU2V0U3R5bGUgR1VJQ3RybFNldFRpcCBHVUlEZWxldGUgR1VJR2V0Q3Vyc29ySW5mbyBHVUlHZXRNc2cgR1VJR2V0U3R5bGUgR1VJUmVnaXN0ZXJNc2cgR1VJU2V0QWNjZWxlcmF0b3JzIEdVSVNldEJrQ29sb3IgR1VJU2V0Q29vcmQgR1VJU2V0Q3Vyc29yIEdVSVNldEZvbnQgR1VJU2V0SGVscCBHVUlTZXRJY29uIEdVSVNldE9uRXZlbnQgR1VJU2V0U3RhdGUgR1VJU2V0U3R5bGUgR1VJU3RhcnRHcm91cCBHVUlTd2l0Y2ggSGV4IEhvdEtleVNldCBIdHRwU2V0UHJveHkgSHR0cFNldFVzZXJBZ2VudCBIV25kIEluZXRDbG9zZSBJbmV0R2V0IEluZXRHZXRJbmZvIEluZXRHZXRTaXplIEluZXRSZWFkIEluaURlbGV0ZSBJbmlSZWFkIEluaVJlYWRTZWN0aW9uIEluaVJlYWRTZWN0aW9uTmFtZXMgSW5pUmVuYW1lU2VjdGlvbiBJbmlXcml0ZSBJbmlXcml0ZVNlY3Rpb24gSW5wdXRCb3ggSW50IElzQWRtaW4gSXNBcnJheSBJc0JpbmFyeSBJc0Jvb2wgSXNEZWNsYXJlZCBJc0RsbFN0cnVjdCBJc0Zsb2F0IElzRnVuYyBJc0hXbmQgSXNJbnQgSXNLZXl3b3JkIElzTnVtYmVyIElzT2JqIElzUHRyIElzU3RyaW5nIExvZyBNZW1HZXRTdGF0cyBNb2QgTW91c2VDbGljayBNb3VzZUNsaWNrRHJhZyBNb3VzZURvd24gTW91c2VHZXRDdXJzb3IgTW91c2VHZXRQb3MgTW91c2VNb3ZlIE1vdXNlVXAgTW91c2VXaGVlbCBNc2dCb3ggTnVtYmVyIE9iakNyZWF0ZSBPYmpDcmVhdGVJbnRlcmZhY2UgT2JqRXZlbnQgT2JqR2V0IE9iak5hbWUgT25BdXRvSXRFeGl0UmVnaXN0ZXIgT25BdXRvSXRFeGl0VW5SZWdpc3RlciBQaW5nIFBpeGVsQ2hlY2tzdW0gUGl4ZWxHZXRDb2xvciBQaXhlbFNlYXJjaCBQcm9jZXNzQ2xvc2UgUHJvY2Vzc0V4aXN0cyBQcm9jZXNzR2V0U3RhdHMgUHJvY2Vzc0xpc3QgUHJvY2Vzc1NldFByaW9yaXR5IFByb2Nlc3NXYWl0IFByb2Nlc3NXYWl0Q2xvc2UgUHJvZ3Jlc3NPZmYgUHJvZ3Jlc3NPbiBQcm9ncmVzc1NldCBQdHIgUmFuZG9tIFJlZ0RlbGV0ZSBSZWdFbnVtS2V5IFJlZ0VudW1WYWwgUmVnUmVhZCBSZWdXcml0ZSBSb3VuZCBSdW4gUnVuQXMgUnVuQXNXYWl0IFJ1bldhaXQgU2VuZCBTZW5kS2VlcEFjdGl2ZSBTZXRFcnJvciBTZXRFeHRlbmRlZCBTaGVsbEV4ZWN1dGUgU2hlbGxFeGVjdXRlV2FpdCBTaHV0ZG93biBTaW4gU2xlZXAgU291bmRQbGF5IFNvdW5kU2V0V2F2ZVZvbHVtZSBTcGxhc2hJbWFnZU9uIFNwbGFzaE9mZiBTcGxhc2hUZXh0T24gU3FydCBTUmFuZG9tIFN0YXR1c2JhckdldFRleHQgU3RkZXJyUmVhZCBTdGRpbldyaXRlIFN0ZGlvQ2xvc2UgU3Rkb3V0UmVhZCBTdHJpbmcgU3RyaW5nQWRkQ1IgU3RyaW5nQ29tcGFyZSBTdHJpbmdGb3JtYXQgU3RyaW5nRnJvbUFTQ0lJQXJyYXkgU3RyaW5nSW5TdHIgU3RyaW5nSXNBbE51bSBTdHJpbmdJc0FscGhhIFN0cmluZ0lzQVNDSUkgU3RyaW5nSXNEaWdpdCBTdHJpbmdJc0Zsb2F0IFN0cmluZ0lzSW50IFN0cmluZ0lzTG93ZXIgU3RyaW5nSXNTcGFjZSBTdHJpbmdJc1VwcGVyIFN0cmluZ0lzWERpZ2l0IFN0cmluZ0xlZnQgU3RyaW5nTGVuIFN0cmluZ0xvd2VyIFN0cmluZ01pZCBTdHJpbmdSZWdFeHAgU3RyaW5nUmVnRXhwUmVwbGFjZSBTdHJpbmdSZXBsYWNlIFN0cmluZ1JldmVyc2UgU3RyaW5nUmlnaHQgU3RyaW5nU3BsaXQgU3RyaW5nU3RyaXBDUiBTdHJpbmdTdHJpcFdTIFN0cmluZ1RvQVNDSUlBcnJheSBTdHJpbmdUb0JpbmFyeSBTdHJpbmdUcmltTGVmdCBTdHJpbmdUcmltUmlnaHQgU3RyaW5nVXBwZXIgVGFuIFRDUEFjY2VwdCBUQ1BDbG9zZVNvY2tldCBUQ1BDb25uZWN0IFRDUExpc3RlbiBUQ1BOYW1lVG9JUCBUQ1BSZWN2IFRDUFNlbmQgVENQU2h1dGRvd24sIFVEUFNodXRkb3duIFRDUFN0YXJ0dXAsIFVEUFN0YXJ0dXAgVGltZXJEaWZmIFRpbWVySW5pdCBUb29sVGlwIFRyYXlDcmVhdGVJdGVtIFRyYXlDcmVhdGVNZW51IFRyYXlHZXRNc2cgVHJheUl0ZW1EZWxldGUgVHJheUl0ZW1HZXRIYW5kbGUgVHJheUl0ZW1HZXRTdGF0ZSBUcmF5SXRlbUdldFRleHQgVHJheUl0ZW1TZXRPbkV2ZW50IFRyYXlJdGVtU2V0U3RhdGUgVHJheUl0ZW1TZXRUZXh0IFRyYXlTZXRDbGljayBUcmF5U2V0SWNvbiBUcmF5U2V0T25FdmVudCBUcmF5U2V0UGF1c2VJY29uIFRyYXlTZXRTdGF0ZSBUcmF5U2V0VG9vbFRpcCBUcmF5VGlwIFVCb3VuZCBVRFBCaW5kIFVEUENsb3NlU29ja2V0IFVEUE9wZW4gVURQUmVjdiBVRFBTZW5kIFZhckdldFR5cGUgV2luQWN0aXZhdGUgV2luQWN0aXZlIFdpbkNsb3NlIFdpbkV4aXN0cyBXaW5GbGFzaCBXaW5HZXRDYXJldFBvcyBXaW5HZXRDbGFzc0xpc3QgV2luR2V0Q2xpZW50U2l6ZSBXaW5HZXRIYW5kbGUgV2luR2V0UG9zIFdpbkdldFByb2Nlc3MgV2luR2V0U3RhdGUgV2luR2V0VGV4dCBXaW5HZXRUaXRsZSBXaW5LaWxsIFdpbkxpc3QgV2luTWVudVNlbGVjdEl0ZW0gV2luTWluaW1pemVBbGwgV2luTWluaW1pemVBbGxVbmRvIFdpbk1vdmUgV2luU2V0T25Ub3AgV2luU2V0U3RhdGUgV2luU2V0VGl0bGUgV2luU2V0VHJhbnMgV2luV2FpdCBXaW5XYWl0QWN0aXZlIFdpbldhaXRDbG9zZSBXaW5XYWl0Tm90QWN0aXZlJztcblxuICBjb25zdCBDT01NRU5UID0geyB2YXJpYW50czogW1xuICAgIGhsanMuQ09NTUVOVCgnOycsICckJywgeyByZWxldmFuY2U6IDAgfSksXG4gICAgaGxqcy5DT01NRU5UKCcjY3MnLCAnI2NlJyksXG4gICAgaGxqcy5DT01NRU5UKCcjY29tbWVudHMtc3RhcnQnLCAnI2NvbW1lbnRzLWVuZCcpXG4gIF0gfTtcblxuICBjb25zdCBWQVJJQUJMRSA9IHsgYmVnaW46ICdcXFxcJFtBLXowLTlfXSsnIH07XG5cbiAgY29uc3QgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cIi8sXG4gICAgICAgIGVuZDogL1wiLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1wiXCIvLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLycvLFxuICAgICAgICBlbmQ6IC8nLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLycnLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBOVU1CRVIgPSB7IHZhcmlhbnRzOiBbXG4gICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsXG4gICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gIF0gfTtcblxuICBjb25zdCBQUkVQUk9DRVNTT1IgPSB7XG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgYmVnaW46ICcjJyxcbiAgICBlbmQ6ICckJyxcbiAgICBrZXl3b3JkczogeyBrZXl3b3JkOiBESVJFQ1RJVkVTIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXFxcXFxuLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnaW5jbHVkZScsXG4gICAgICAgIGtleXdvcmRzOiB7IGtleXdvcmQ6ICdpbmNsdWRlJyB9LFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBTVFJJTkcsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWdpbjogJzwnLFxuICAgICAgICAgICAgICAgIGVuZDogJz4nXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWdpbjogL1wiLyxcbiAgICAgICAgICAgICAgICBlbmQ6IC9cIi8sXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cIlwiLyxcbiAgICAgICAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46IC8nLyxcbiAgICAgICAgICAgICAgICBlbmQ6IC8nLyxcbiAgICAgICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiZWdpbjogLycnLyxcbiAgICAgICAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgU1RSSU5HLFxuICAgICAgQ09NTUVOVFxuICAgIF1cbiAgfTtcblxuICBjb25zdCBDT05TVEFOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgIC8vIGJlZ2luOiAnQCcsXG4gICAgLy8gZW5kOiAnJCcsXG4gICAgLy8ga2V5d29yZHM6ICdBcHBEYXRhQ29tbW9uRGlyIEFwcERhdGFEaXIgQXV0b0l0RXhlIEF1dG9JdFBJRCBBdXRvSXRWZXJzaW9uIEF1dG9JdFg2NCBDT01fRXZlbnRPYmogQ29tbW9uRmlsZXNEaXIgQ29tcGlsZWQgQ29tcHV0ZXJOYW1lIENvbVNwZWMgQ1BVQXJjaCBDUiBDUkxGIERlc2t0b3BDb21tb25EaXIgRGVza3RvcERlcHRoIERlc2t0b3BEaXIgRGVza3RvcEhlaWdodCBEZXNrdG9wUmVmcmVzaCBEZXNrdG9wV2lkdGggRG9jdW1lbnRzQ29tbW9uRGlyIGVycm9yIGV4aXRDb2RlIGV4aXRNZXRob2QgZXh0ZW5kZWQgRmF2b3JpdGVzQ29tbW9uRGlyIEZhdm9yaXRlc0RpciBHVUlfQ3RybEhhbmRsZSBHVUlfQ3RybElkIEdVSV9EcmFnRmlsZSBHVUlfRHJhZ0lkIEdVSV9Ecm9wSWQgR1VJX1dpbkhhbmRsZSBIb21lRHJpdmUgSG9tZVBhdGggSG9tZVNoYXJlIEhvdEtleVByZXNzZWQgSE9VUiBJUEFkZHJlc3MxIElQQWRkcmVzczIgSVBBZGRyZXNzMyBJUEFkZHJlc3M0IEtCTGF5b3V0IExGIExvY2FsQXBwRGF0YURpciBMb2dvbkROU0RvbWFpbiBMb2dvbkRvbWFpbiBMb2dvblNlcnZlciBNREFZIE1JTiBNT04gTVNFQyBNVUlMYW5nIE15RG9jdW1lbnRzRGlyIE51bVBhcmFtcyBPU0FyY2ggT1NCdWlsZCBPU0xhbmcgT1NTZXJ2aWNlUGFjayBPU1R5cGUgT1NWZXJzaW9uIFByb2dyYW1GaWxlc0RpciBQcm9ncmFtc0NvbW1vbkRpciBQcm9ncmFtc0RpciBTY3JpcHREaXIgU2NyaXB0RnVsbFBhdGggU2NyaXB0TGluZU51bWJlciBTY3JpcHROYW1lIFNFQyBTdGFydE1lbnVDb21tb25EaXIgU3RhcnRNZW51RGlyIFN0YXJ0dXBDb21tb25EaXIgU3RhcnR1cERpciBTV19ESVNBQkxFIFNXX0VOQUJMRSBTV19ISURFIFNXX0xPQ0sgU1dfTUFYSU1JWkUgU1dfTUlOSU1JWkUgU1dfUkVTVE9SRSBTV19TSE9XIFNXX1NIT1dERUZBVUxUIFNXX1NIT1dNQVhJTUlaRUQgU1dfU0hPV01JTklNSVpFRCBTV19TSE9XTUlOTk9BQ1RJVkUgU1dfU0hPV05BIFNXX1NIT1dOT0FDVElWQVRFIFNXX1NIT1dOT1JNQUwgU1dfVU5MT0NLIFN5c3RlbURpciBUQUIgVGVtcERpciBUUkFZX0lEIFRyYXlJY29uRmxhc2hpbmcgVHJheUljb25WaXNpYmxlIFVzZXJOYW1lIFVzZXJQcm9maWxlRGlyIFdEQVkgV2luZG93c0RpciBXb3JraW5nRGlyIFlEQVkgWUVBUicsXG4gICAgLy8gcmVsZXZhbmNlOiA1XG4gICAgYmVnaW46ICdAW0EtejAtOV9dKydcbiAgfTtcblxuICBjb25zdCBGVU5DVElPTiA9IHtcbiAgICBiZWdpbktleXdvcmRzOiAnRnVuYycsXG4gICAgZW5kOiAnJCcsXG4gICAgaWxsZWdhbDogJ1xcXFwkfFxcXFxbfCUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREUsIHsgY2xhc3NOYW1lOiBcInRpdGxlLmZ1bmN0aW9uXCIgfSksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLFxuICAgICAgICBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVkFSSUFCTEUsXG4gICAgICAgICAgU1RSSU5HLFxuICAgICAgICAgIE5VTUJFUlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0F1dG9JdCcsXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAvXFwvXFwqLyxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogS0VZV09SRFMsXG4gICAgICBidWlsdF9pbjogQlVJTFRfSU4sXG4gICAgICBsaXRlcmFsOiBMSVRFUkFMXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgQ09NTUVOVCxcbiAgICAgIFZBUklBQkxFLFxuICAgICAgU1RSSU5HLFxuICAgICAgTlVNQkVSLFxuICAgICAgUFJFUFJPQ0VTU09SLFxuICAgICAgQ09OU1RBTlQsXG4gICAgICBGVU5DVElPTlxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgYXV0b2l0IGFzIGRlZmF1bHQgfTtcbiJdfQ==