function ruleslanguage(hljs) {
    return {
        name: 'Oracle Rules Language',
        keywords: {
            keyword: 'BILL_PERIOD BILL_START BILL_STOP RS_EFFECTIVE_START RS_EFFECTIVE_STOP RS_JURIS_CODE RS_OPCO_CODE '
                + 'INTDADDATTRIBUTE|5 INTDADDVMSG|5 INTDBLOCKOP|5 INTDBLOCKOPNA|5 INTDCLOSE|5 INTDCOUNT|5 '
                + 'INTDCOUNTSTATUSCODE|5 INTDCREATEMASK|5 INTDCREATEDAYMASK|5 INTDCREATEFACTORMASK|5 '
                + 'INTDCREATEHANDLE|5 INTDCREATEOVERRIDEDAYMASK|5 INTDCREATEOVERRIDEMASK|5 '
                + 'INTDCREATESTATUSCODEMASK|5 INTDCREATETOUPERIOD|5 INTDDELETE|5 INTDDIPTEST|5 INTDEXPORT|5 '
                + 'INTDGETERRORCODE|5 INTDGETERRORMESSAGE|5 INTDISEQUAL|5 INTDJOIN|5 INTDLOAD|5 INTDLOADACTUALCUT|5 '
                + 'INTDLOADDATES|5 INTDLOADHIST|5 INTDLOADLIST|5 INTDLOADLISTDATES|5 INTDLOADLISTENERGY|5 '
                + 'INTDLOADLISTHIST|5 INTDLOADRELATEDCHANNEL|5 INTDLOADSP|5 INTDLOADSTAGING|5 INTDLOADUOM|5 '
                + 'INTDLOADUOMDATES|5 INTDLOADUOMHIST|5 INTDLOADVERSION|5 INTDOPEN|5 INTDREADFIRST|5 INTDREADNEXT|5 '
                + 'INTDRECCOUNT|5 INTDRELEASE|5 INTDREPLACE|5 INTDROLLAVG|5 INTDROLLPEAK|5 INTDSCALAROP|5 INTDSCALE|5 '
                + 'INTDSETATTRIBUTE|5 INTDSETDSTPARTICIPANT|5 INTDSETSTRING|5 INTDSETVALUE|5 INTDSETVALUESTATUS|5 '
                + 'INTDSHIFTSTARTTIME|5 INTDSMOOTH|5 INTDSORT|5 INTDSPIKETEST|5 INTDSUBSET|5 INTDTOU|5 '
                + 'INTDTOURELEASE|5 INTDTOUVALUE|5 INTDUPDATESTATS|5 INTDVALUE|5 STDEV INTDDELETEEX|5 '
                + 'INTDLOADEXACTUAL|5 INTDLOADEXCUT|5 INTDLOADEXDATES|5 INTDLOADEX|5 INTDLOADEXRELATEDCHANNEL|5 '
                + 'INTDSAVEEX|5 MVLOAD|5 MVLOADACCT|5 MVLOADACCTDATES|5 MVLOADACCTHIST|5 MVLOADDATES|5 MVLOADHIST|5 '
                + 'MVLOADLIST|5 MVLOADLISTDATES|5 MVLOADLISTHIST|5 IF FOR NEXT DONE SELECT END CALL ABORT CLEAR CHANNEL FACTOR LIST NUMBER '
                + 'OVERRIDE SET WEEK DISTRIBUTIONNODE ELSE WHEN THEN OTHERWISE IENUM CSV INCLUDE LEAVE RIDER SAVE DELETE '
                + 'NOVALUE SECTION WARN SAVE_UPDATE DETERMINANT LABEL REPORT REVENUE EACH '
                + 'IN FROM TOTAL CHARGE BLOCK AND OR CSV_FILE RATE_CODE AUXILIARY_DEMAND '
                + 'UIDACCOUNT RS BILL_PERIOD_SELECT HOURS_PER_MONTH INTD_ERROR_STOP SEASON_SCHEDULE_NAME '
                + 'ACCOUNTFACTOR ARRAYUPPERBOUND CALLSTOREDPROC GETADOCONNECTION GETCONNECT GETDATASOURCE '
                + 'GETQUALIFIER GETUSERID HASVALUE LISTCOUNT LISTOP LISTUPDATE LISTVALUE PRORATEFACTOR RSPRORATE '
                + 'SETBINPATH SETDBMONITOR WQ_OPEN BILLINGHOURS DATE DATEFROMFLOAT DATETIMEFROMSTRING '
                + 'DATETIMETOSTRING DATETOFLOAT DAY DAYDIFF DAYNAME DBDATETIME HOUR MINUTE MONTH MONTHDIFF '
                + 'MONTHHOURS MONTHNAME ROUNDDATE SAMEWEEKDAYLASTYEAR SECOND WEEKDAY WEEKDIFF YEAR YEARDAY '
                + 'YEARSTR COMPSUM HISTCOUNT HISTMAX HISTMIN HISTMINNZ HISTVALUE MAXNRANGE MAXRANGE MINRANGE '
                + 'COMPIKVA COMPKVA COMPKVARFROMKQKW COMPLF IDATTR FLAG LF2KW LF2KWH MAXKW POWERFACTOR '
                + 'READING2USAGE AVGSEASON MAXSEASON MONTHLYMERGE SEASONVALUE SUMSEASON ACCTREADDATES '
                + 'ACCTTABLELOAD CONFIGADD CONFIGGET CREATEOBJECT CREATEREPORT EMAILCLIENT EXPBLKMDMUSAGE '
                + 'EXPMDMUSAGE EXPORT_USAGE FACTORINEFFECT GETUSERSPECIFIEDSTOP INEFFECT ISHOLIDAY RUNRATE '
                + 'SAVE_PROFILE SETREPORTTITLE USEREXIT WATFORRUNRATE TO TABLE ACOS ASIN ATAN ATAN2 BITAND CEIL '
                + 'COS COSECANT COSH COTANGENT DIVQUOT DIVREM EXP FABS FLOOR FMOD FREPM FREXPN LOG LOG10 MAX MAXN '
                + 'MIN MINNZ MODF POW ROUND ROUND2VALUE ROUNDINT SECANT SIN SINH SQROOT TAN TANH FLOAT2STRING '
                + 'FLOAT2STRINGNC INSTR LEFT LEN LTRIM MID RIGHT RTRIM STRING STRINGNC TOLOWER TOUPPER TRIM '
                + 'NUMDAYS READ_DATE STAGING',
            built_in: 'IDENTIFIER OPTIONS XML_ELEMENT XML_OP XML_ELEMENT_OF DOMDOCCREATE DOMDOCLOADFILE DOMDOCLOADXML '
                + 'DOMDOCSAVEFILE DOMDOCGETROOT DOMDOCADDPI DOMNODEGETNAME DOMNODEGETTYPE DOMNODEGETVALUE DOMNODEGETCHILDCT '
                + 'DOMNODEGETFIRSTCHILD DOMNODEGETSIBLING DOMNODECREATECHILDELEMENT DOMNODESETATTRIBUTE '
                + 'DOMNODEGETCHILDELEMENTCT DOMNODEGETFIRSTCHILDELEMENT DOMNODEGETSIBLINGELEMENT DOMNODEGETATTRIBUTECT '
                + 'DOMNODEGETATTRIBUTEI DOMNODEGETATTRIBUTEBYNAME DOMNODEGETBYNAME'
        },
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_NUMBER_MODE,
            {
                className: 'literal',
                variants: [
                    {
                        begin: '#\\s+',
                        relevance: 0
                    },
                    { begin: '#[a-zA-Z .]+' }
                ]
            }
        ]
    };
}
export { ruleslanguage as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXNsYW5ndWFnZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJhc3NldHMvc2l0ZS9oaWdobGlnaHRfanMvbGFuZ3VhZ2VzL3J1bGVzbGFuZ3VhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsU0FBUyxhQUFhLENBQUMsSUFBSTtJQUN6QixPQUFPO1FBQ0wsSUFBSSxFQUFFLHVCQUF1QjtRQUM3QixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQ0wsbUdBQW1HO2tCQUNqRyx5RkFBeUY7a0JBQ3pGLG9GQUFvRjtrQkFDcEYsMEVBQTBFO2tCQUMxRSwyRkFBMkY7a0JBQzNGLG1HQUFtRztrQkFDbkcseUZBQXlGO2tCQUN6RiwyRkFBMkY7a0JBQzNGLG1HQUFtRztrQkFDbkcscUdBQXFHO2tCQUNyRyxpR0FBaUc7a0JBQ2pHLHNGQUFzRjtrQkFDdEYscUZBQXFGO2tCQUNyRiwrRkFBK0Y7a0JBQy9GLG1HQUFtRztrQkFDbkcsMEhBQTBIO2tCQUMxSCx3R0FBd0c7a0JBQ3hHLHlFQUF5RTtrQkFDekUsd0VBQXdFO2tCQUN4RSx3RkFBd0Y7a0JBQ3hGLHlGQUF5RjtrQkFDekYsZ0dBQWdHO2tCQUNoRyxxRkFBcUY7a0JBQ3JGLDBGQUEwRjtrQkFDMUYsMEZBQTBGO2tCQUMxRiw0RkFBNEY7a0JBQzVGLHNGQUFzRjtrQkFDdEYscUZBQXFGO2tCQUNyRix5RkFBeUY7a0JBQ3pGLDBGQUEwRjtrQkFDMUYsK0ZBQStGO2tCQUMvRixpR0FBaUc7a0JBQ2pHLDZGQUE2RjtrQkFDN0YsMkZBQTJGO2tCQUMzRiwyQkFBMkI7WUFDL0IsUUFBUSxFQUNOLGlHQUFpRztrQkFDL0YsMkdBQTJHO2tCQUMzRyx1RkFBdUY7a0JBQ3ZGLHNHQUFzRztrQkFDdEcsaUVBQWlFO1NBQ3RFO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsb0JBQW9CO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsYUFBYTtZQUNsQjtnQkFDRSxTQUFTLEVBQUUsU0FBUztnQkFDcEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxPQUFPO3dCQUNkLFNBQVMsRUFBRSxDQUFDO3FCQUNiO29CQUNELEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtpQkFDMUI7YUFDRjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsYUFBYSxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBPcmFjbGUgUnVsZXMgTGFuZ3VhZ2VcbkF1dGhvcjogSmFzb24gSmFjb2Jzb24gPGphc29uLmEuamFjb2Jzb25AZ21haWwuY29tPlxuRGVzY3JpcHRpb246IFRoZSBPcmFjbGUgVXRpbGl0aWVzIFJ1bGVzIExhbmd1YWdlIGlzIHVzZWQgdG8gcHJvZ3JhbSB0aGUgT3JhY2xlIFV0aWxpdGllcyBBcHBsaWNhdGlvbnMgYWNxdWlyZWQgZnJvbSBMT0RFU1RBUiBDb3Jwb3JhdGlvbi4gIFRoZSBwcm9kdWN0cyBpbmNsdWRlIEJpbGxpbmcgQ29tcG9uZW50LCBMUFNTLCBQcmljaW5nIENvbXBvbmVudCBldGMuIHRocm91Z2ggdmVyc2lvbiAxLjYuMS5cbldlYnNpdGU6IGh0dHBzOi8vZG9jcy5vcmFjbGUuY29tL2NkL0UxNzkwNF8wMS9kZXYuMTExMS9lMTAyMjcvcmxyZWYuaHRtXG5DYXRlZ29yeTogZW50ZXJwcmlzZVxuKi9cblxuZnVuY3Rpb24gcnVsZXNsYW5ndWFnZShobGpzKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ09yYWNsZSBSdWxlcyBMYW5ndWFnZScsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdCSUxMX1BFUklPRCBCSUxMX1NUQVJUIEJJTExfU1RPUCBSU19FRkZFQ1RJVkVfU1RBUlQgUlNfRUZGRUNUSVZFX1NUT1AgUlNfSlVSSVNfQ09ERSBSU19PUENPX0NPREUgJ1xuICAgICAgICArICdJTlREQUREQVRUUklCVVRFfDUgSU5UREFERFZNU0d8NSBJTlREQkxPQ0tPUHw1IElOVERCTE9DS09QTkF8NSBJTlREQ0xPU0V8NSBJTlREQ09VTlR8NSAnXG4gICAgICAgICsgJ0lOVERDT1VOVFNUQVRVU0NPREV8NSBJTlREQ1JFQVRFTUFTS3w1IElOVERDUkVBVEVEQVlNQVNLfDUgSU5URENSRUFURUZBQ1RPUk1BU0t8NSAnXG4gICAgICAgICsgJ0lOVERDUkVBVEVIQU5ETEV8NSBJTlREQ1JFQVRFT1ZFUlJJREVEQVlNQVNLfDUgSU5URENSRUFURU9WRVJSSURFTUFTS3w1ICdcbiAgICAgICAgKyAnSU5URENSRUFURVNUQVRVU0NPREVNQVNLfDUgSU5URENSRUFURVRPVVBFUklPRHw1IElOVERERUxFVEV8NSBJTlRERElQVEVTVHw1IElOVERFWFBPUlR8NSAnXG4gICAgICAgICsgJ0lOVERHRVRFUlJPUkNPREV8NSBJTlRER0VURVJST1JNRVNTQUdFfDUgSU5URElTRVFVQUx8NSBJTlRESk9JTnw1IElOVERMT0FEfDUgSU5URExPQURBQ1RVQUxDVVR8NSAnXG4gICAgICAgICsgJ0lOVERMT0FEREFURVN8NSBJTlRETE9BREhJU1R8NSBJTlRETE9BRExJU1R8NSBJTlRETE9BRExJU1REQVRFU3w1IElOVERMT0FETElTVEVORVJHWXw1ICdcbiAgICAgICAgKyAnSU5URExPQURMSVNUSElTVHw1IElOVERMT0FEUkVMQVRFRENIQU5ORUx8NSBJTlRETE9BRFNQfDUgSU5URExPQURTVEFHSU5HfDUgSU5URExPQURVT018NSAnXG4gICAgICAgICsgJ0lOVERMT0FEVU9NREFURVN8NSBJTlRETE9BRFVPTUhJU1R8NSBJTlRETE9BRFZFUlNJT058NSBJTlRET1BFTnw1IElOVERSRUFERklSU1R8NSBJTlREUkVBRE5FWFR8NSAnXG4gICAgICAgICsgJ0lOVERSRUNDT1VOVHw1IElOVERSRUxFQVNFfDUgSU5URFJFUExBQ0V8NSBJTlREUk9MTEFWR3w1IElOVERST0xMUEVBS3w1IElOVERTQ0FMQVJPUHw1IElOVERTQ0FMRXw1ICdcbiAgICAgICAgKyAnSU5URFNFVEFUVFJJQlVURXw1IElOVERTRVREU1RQQVJUSUNJUEFOVHw1IElOVERTRVRTVFJJTkd8NSBJTlREU0VUVkFMVUV8NSBJTlREU0VUVkFMVUVTVEFUVVN8NSAnXG4gICAgICAgICsgJ0lOVERTSElGVFNUQVJUVElNRXw1IElOVERTTU9PVEh8NSBJTlREU09SVHw1IElOVERTUElLRVRFU1R8NSBJTlREU1VCU0VUfDUgSU5URFRPVXw1ICdcbiAgICAgICAgKyAnSU5URFRPVVJFTEVBU0V8NSBJTlREVE9VVkFMVUV8NSBJTlREVVBEQVRFU1RBVFN8NSBJTlREVkFMVUV8NSBTVERFViBJTlREREVMRVRFRVh8NSAnXG4gICAgICAgICsgJ0lOVERMT0FERVhBQ1RVQUx8NSBJTlRETE9BREVYQ1VUfDUgSU5URExPQURFWERBVEVTfDUgSU5URExPQURFWHw1IElOVERMT0FERVhSRUxBVEVEQ0hBTk5FTHw1ICdcbiAgICAgICAgKyAnSU5URFNBVkVFWHw1IE1WTE9BRHw1IE1WTE9BREFDQ1R8NSBNVkxPQURBQ0NUREFURVN8NSBNVkxPQURBQ0NUSElTVHw1IE1WTE9BRERBVEVTfDUgTVZMT0FESElTVHw1ICdcbiAgICAgICAgKyAnTVZMT0FETElTVHw1IE1WTE9BRExJU1REQVRFU3w1IE1WTE9BRExJU1RISVNUfDUgSUYgRk9SIE5FWFQgRE9ORSBTRUxFQ1QgRU5EIENBTEwgQUJPUlQgQ0xFQVIgQ0hBTk5FTCBGQUNUT1IgTElTVCBOVU1CRVIgJ1xuICAgICAgICArICdPVkVSUklERSBTRVQgV0VFSyBESVNUUklCVVRJT05OT0RFIEVMU0UgV0hFTiBUSEVOIE9USEVSV0lTRSBJRU5VTSBDU1YgSU5DTFVERSBMRUFWRSBSSURFUiBTQVZFIERFTEVURSAnXG4gICAgICAgICsgJ05PVkFMVUUgU0VDVElPTiBXQVJOIFNBVkVfVVBEQVRFIERFVEVSTUlOQU5UIExBQkVMIFJFUE9SVCBSRVZFTlVFIEVBQ0ggJ1xuICAgICAgICArICdJTiBGUk9NIFRPVEFMIENIQVJHRSBCTE9DSyBBTkQgT1IgQ1NWX0ZJTEUgUkFURV9DT0RFIEFVWElMSUFSWV9ERU1BTkQgJ1xuICAgICAgICArICdVSURBQ0NPVU5UIFJTIEJJTExfUEVSSU9EX1NFTEVDVCBIT1VSU19QRVJfTU9OVEggSU5URF9FUlJPUl9TVE9QIFNFQVNPTl9TQ0hFRFVMRV9OQU1FICdcbiAgICAgICAgKyAnQUNDT1VOVEZBQ1RPUiBBUlJBWVVQUEVSQk9VTkQgQ0FMTFNUT1JFRFBST0MgR0VUQURPQ09OTkVDVElPTiBHRVRDT05ORUNUIEdFVERBVEFTT1VSQ0UgJ1xuICAgICAgICArICdHRVRRVUFMSUZJRVIgR0VUVVNFUklEIEhBU1ZBTFVFIExJU1RDT1VOVCBMSVNUT1AgTElTVFVQREFURSBMSVNUVkFMVUUgUFJPUkFURUZBQ1RPUiBSU1BST1JBVEUgJ1xuICAgICAgICArICdTRVRCSU5QQVRIIFNFVERCTU9OSVRPUiBXUV9PUEVOIEJJTExJTkdIT1VSUyBEQVRFIERBVEVGUk9NRkxPQVQgREFURVRJTUVGUk9NU1RSSU5HICdcbiAgICAgICAgKyAnREFURVRJTUVUT1NUUklORyBEQVRFVE9GTE9BVCBEQVkgREFZRElGRiBEQVlOQU1FIERCREFURVRJTUUgSE9VUiBNSU5VVEUgTU9OVEggTU9OVEhESUZGICdcbiAgICAgICAgKyAnTU9OVEhIT1VSUyBNT05USE5BTUUgUk9VTkREQVRFIFNBTUVXRUVLREFZTEFTVFlFQVIgU0VDT05EIFdFRUtEQVkgV0VFS0RJRkYgWUVBUiBZRUFSREFZICdcbiAgICAgICAgKyAnWUVBUlNUUiBDT01QU1VNIEhJU1RDT1VOVCBISVNUTUFYIEhJU1RNSU4gSElTVE1JTk5aIEhJU1RWQUxVRSBNQVhOUkFOR0UgTUFYUkFOR0UgTUlOUkFOR0UgJ1xuICAgICAgICArICdDT01QSUtWQSBDT01QS1ZBIENPTVBLVkFSRlJPTUtRS1cgQ09NUExGIElEQVRUUiBGTEFHIExGMktXIExGMktXSCBNQVhLVyBQT1dFUkZBQ1RPUiAnXG4gICAgICAgICsgJ1JFQURJTkcyVVNBR0UgQVZHU0VBU09OIE1BWFNFQVNPTiBNT05USExZTUVSR0UgU0VBU09OVkFMVUUgU1VNU0VBU09OIEFDQ1RSRUFEREFURVMgJ1xuICAgICAgICArICdBQ0NUVEFCTEVMT0FEIENPTkZJR0FERCBDT05GSUdHRVQgQ1JFQVRFT0JKRUNUIENSRUFURVJFUE9SVCBFTUFJTENMSUVOVCBFWFBCTEtNRE1VU0FHRSAnXG4gICAgICAgICsgJ0VYUE1ETVVTQUdFIEVYUE9SVF9VU0FHRSBGQUNUT1JJTkVGRkVDVCBHRVRVU0VSU1BFQ0lGSUVEU1RPUCBJTkVGRkVDVCBJU0hPTElEQVkgUlVOUkFURSAnXG4gICAgICAgICsgJ1NBVkVfUFJPRklMRSBTRVRSRVBPUlRUSVRMRSBVU0VSRVhJVCBXQVRGT1JSVU5SQVRFIFRPIFRBQkxFIEFDT1MgQVNJTiBBVEFOIEFUQU4yIEJJVEFORCBDRUlMICdcbiAgICAgICAgKyAnQ09TIENPU0VDQU5UIENPU0ggQ09UQU5HRU5UIERJVlFVT1QgRElWUkVNIEVYUCBGQUJTIEZMT09SIEZNT0QgRlJFUE0gRlJFWFBOIExPRyBMT0cxMCBNQVggTUFYTiAnXG4gICAgICAgICsgJ01JTiBNSU5OWiBNT0RGIFBPVyBST1VORCBST1VORDJWQUxVRSBST1VORElOVCBTRUNBTlQgU0lOIFNJTkggU1FST09UIFRBTiBUQU5IIEZMT0FUMlNUUklORyAnXG4gICAgICAgICsgJ0ZMT0FUMlNUUklOR05DIElOU1RSIExFRlQgTEVOIExUUklNIE1JRCBSSUdIVCBSVFJJTSBTVFJJTkcgU1RSSU5HTkMgVE9MT1dFUiBUT1VQUEVSIFRSSU0gJ1xuICAgICAgICArICdOVU1EQVlTIFJFQURfREFURSBTVEFHSU5HJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnSURFTlRJRklFUiBPUFRJT05TIFhNTF9FTEVNRU5UIFhNTF9PUCBYTUxfRUxFTUVOVF9PRiBET01ET0NDUkVBVEUgRE9NRE9DTE9BREZJTEUgRE9NRE9DTE9BRFhNTCAnXG4gICAgICAgICsgJ0RPTURPQ1NBVkVGSUxFIERPTURPQ0dFVFJPT1QgRE9NRE9DQUREUEkgRE9NTk9ERUdFVE5BTUUgRE9NTk9ERUdFVFRZUEUgRE9NTk9ERUdFVFZBTFVFIERPTU5PREVHRVRDSElMRENUICdcbiAgICAgICAgKyAnRE9NTk9ERUdFVEZJUlNUQ0hJTEQgRE9NTk9ERUdFVFNJQkxJTkcgRE9NTk9ERUNSRUFURUNISUxERUxFTUVOVCBET01OT0RFU0VUQVRUUklCVVRFICdcbiAgICAgICAgKyAnRE9NTk9ERUdFVENISUxERUxFTUVOVENUIERPTU5PREVHRVRGSVJTVENISUxERUxFTUVOVCBET01OT0RFR0VUU0lCTElOR0VMRU1FTlQgRE9NTk9ERUdFVEFUVFJJQlVURUNUICdcbiAgICAgICAgKyAnRE9NTk9ERUdFVEFUVFJJQlVURUkgRE9NTk9ERUdFVEFUVFJJQlVURUJZTkFNRSBET01OT0RFR0VUQllOQU1FJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IC8vIGxvb2tzIGxpa2UgIy1jb21tZW50XG4gICAgICAgICAgICBiZWdpbjogJyNcXFxccysnLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnI1thLXpBLVogLl0rJyB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHJ1bGVzbGFuZ3VhZ2UgYXMgZGVmYXVsdCB9O1xuIl19