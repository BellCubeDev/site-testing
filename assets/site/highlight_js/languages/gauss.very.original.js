function gauss(hljs) {
    const KEYWORDS = {
        keyword: 'bool break call callexe checkinterrupt clear clearg closeall cls comlog compile '
            + 'continue create debug declare delete disable dlibrary dllcall do dos ed edit else '
            + 'elseif enable end endfor endif endp endo errorlog errorlogat expr external fn '
            + 'for format goto gosub graph if keyword let lib library line load loadarray loadexe '
            + 'loadf loadk loadm loadp loads loadx local locate loopnextindex lprint lpwidth lshow '
            + 'matrix msym ndpclex new open output outwidth plot plotsym pop prcsn print '
            + 'printdos proc push retp return rndcon rndmod rndmult rndseed run save saveall screen '
            + 'scroll setarray show sparse stop string struct system trace trap threadfor '
            + 'threadendfor threadbegin threadjoin threadstat threadend until use while winprint '
            + 'ne ge le gt lt and xor or not eq eqv',
        built_in: 'abs acf aconcat aeye amax amean AmericanBinomCall AmericanBinomCall_Greeks AmericanBinomCall_ImpVol '
            + 'AmericanBinomPut AmericanBinomPut_Greeks AmericanBinomPut_ImpVol AmericanBSCall AmericanBSCall_Greeks '
            + 'AmericanBSCall_ImpVol AmericanBSPut AmericanBSPut_Greeks AmericanBSPut_ImpVol amin amult annotationGetDefaults '
            + 'annotationSetBkd annotationSetFont annotationSetLineColor annotationSetLineStyle annotationSetLineThickness '
            + 'annualTradingDays arccos arcsin areshape arrayalloc arrayindex arrayinit arraytomat asciiload asclabel astd '
            + 'astds asum atan atan2 atranspose axmargin balance band bandchol bandcholsol bandltsol bandrv bandsolpd bar '
            + 'base10 begwind besselj bessely beta box boxcox cdfBeta cdfBetaInv cdfBinomial cdfBinomialInv cdfBvn cdfBvn2 '
            + 'cdfBvn2e cdfCauchy cdfCauchyInv cdfChic cdfChii cdfChinc cdfChincInv cdfExp cdfExpInv cdfFc cdfFnc cdfFncInv '
            + 'cdfGam cdfGenPareto cdfHyperGeo cdfLaplace cdfLaplaceInv cdfLogistic cdfLogisticInv cdfmControlCreate cdfMvn '
            + 'cdfMvn2e cdfMvnce cdfMvne cdfMvt2e cdfMvtce cdfMvte cdfN cdfN2 cdfNc cdfNegBinomial cdfNegBinomialInv cdfNi '
            + 'cdfPoisson cdfPoissonInv cdfRayleigh cdfRayleighInv cdfTc cdfTci cdfTnc cdfTvn cdfWeibull cdfWeibullInv cdir '
            + 'ceil ChangeDir chdir chiBarSquare chol choldn cholsol cholup chrs close code cols colsf combinate combinated '
            + 'complex con cond conj cons ConScore contour conv convertsatostr convertstrtosa corrm corrms corrvc corrx corrxs '
            + 'cos cosh counts countwts crossprd crout croutp csrcol csrlin csvReadM csvReadSA cumprodc cumsumc curve cvtos '
            + 'datacreate datacreatecomplex datalist dataload dataloop dataopen datasave date datestr datestring datestrymd '
            + 'dayinyr dayofweek dbAddDatabase dbClose dbCommit dbCreateQuery dbExecQuery dbGetConnectOptions dbGetDatabaseName '
            + 'dbGetDriverName dbGetDrivers dbGetHostName dbGetLastErrorNum dbGetLastErrorText dbGetNumericalPrecPolicy '
            + 'dbGetPassword dbGetPort dbGetTableHeaders dbGetTables dbGetUserName dbHasFeature dbIsDriverAvailable dbIsOpen '
            + 'dbIsOpenError dbOpen dbQueryBindValue dbQueryClear dbQueryCols dbQueryExecPrepared dbQueryFetchAllM dbQueryFetchAllSA '
            + 'dbQueryFetchOneM dbQueryFetchOneSA dbQueryFinish dbQueryGetBoundValue dbQueryGetBoundValues dbQueryGetField '
            + 'dbQueryGetLastErrorNum dbQueryGetLastErrorText dbQueryGetLastInsertID dbQueryGetLastQuery dbQueryGetPosition '
            + 'dbQueryIsActive dbQueryIsForwardOnly dbQueryIsNull dbQueryIsSelect dbQueryIsValid dbQueryPrepare dbQueryRows '
            + 'dbQuerySeek dbQuerySeekFirst dbQuerySeekLast dbQuerySeekNext dbQuerySeekPrevious dbQuerySetForwardOnly '
            + 'dbRemoveDatabase dbRollback dbSetConnectOptions dbSetDatabaseName dbSetHostName dbSetNumericalPrecPolicy '
            + 'dbSetPort dbSetUserName dbTransaction DeleteFile delif delrows denseToSp denseToSpRE denToZero design det detl '
            + 'dfft dffti diag diagrv digamma doswin DOSWinCloseall DOSWinOpen dotfeq dotfeqmt dotfge dotfgemt dotfgt dotfgtmt '
            + 'dotfle dotflemt dotflt dotfltmt dotfne dotfnemt draw drop dsCreate dstat dstatmt dstatmtControlCreate dtdate dtday '
            + 'dttime dttodtv dttostr dttoutc dtvnormal dtvtodt dtvtoutc dummy dummybr dummydn eig eigh eighv eigv elapsedTradingDays '
            + 'endwind envget eof eqSolve eqSolvemt eqSolvemtControlCreate eqSolvemtOutCreate eqSolveset erf erfc erfccplx erfcplx error '
            + 'etdays ethsec etstr EuropeanBinomCall EuropeanBinomCall_Greeks EuropeanBinomCall_ImpVol EuropeanBinomPut '
            + 'EuropeanBinomPut_Greeks EuropeanBinomPut_ImpVol EuropeanBSCall EuropeanBSCall_Greeks EuropeanBSCall_ImpVol '
            + 'EuropeanBSPut EuropeanBSPut_Greeks EuropeanBSPut_ImpVol exctsmpl exec execbg exp extern eye fcheckerr fclearerr feq '
            + 'feqmt fflush fft ffti fftm fftmi fftn fge fgemt fgets fgetsa fgetsat fgetst fgt fgtmt fileinfo filesa fle flemt '
            + 'floor flt fltmt fmod fne fnemt fonts fopen formatcv formatnv fputs fputst fseek fstrerror ftell ftocv ftos ftostrC '
            + 'gamma gammacplx gammaii gausset gdaAppend gdaCreate gdaDStat gdaDStatMat gdaGetIndex gdaGetName gdaGetNames gdaGetOrders '
            + 'gdaGetType gdaGetTypes gdaGetVarInfo gdaIsCplx gdaLoad gdaPack gdaRead gdaReadByIndex gdaReadSome gdaReadSparse '
            + 'gdaReadStruct gdaReportVarInfo gdaSave gdaUpdate gdaUpdateAndPack gdaVars gdaWrite gdaWrite32 gdaWriteSome getarray '
            + 'getdims getf getGAUSShome getmatrix getmatrix4D getname getnamef getNextTradingDay getNextWeekDay getnr getorders '
            + 'getpath getPreviousTradingDay getPreviousWeekDay getRow getscalar3D getscalar4D getTrRow getwind glm gradcplx gradMT '
            + 'gradMTm gradMTT gradMTTm gradp graphprt graphset hasimag header headermt hess hessMT hessMTg hessMTgw hessMTm '
            + 'hessMTmw hessMTT hessMTTg hessMTTgw hessMTTm hessMTw hessp hist histf histp hsec imag indcv indexcat indices indices2 '
            + 'indicesf indicesfn indnv indsav integrate1d integrateControlCreate intgrat2 intgrat3 inthp1 inthp2 inthp3 inthp4 '
            + 'inthpControlCreate intquad1 intquad2 intquad3 intrleav intrleavsa intrsect intsimp inv invpd invswp iscplx iscplxf '
            + 'isden isinfnanmiss ismiss key keyav keyw lag lag1 lagn lapEighb lapEighi lapEighvb lapEighvi lapgEig lapgEigh lapgEighv '
            + 'lapgEigv lapgSchur lapgSvdcst lapgSvds lapgSvdst lapSvdcusv lapSvds lapSvdusv ldlp ldlsol linSolve listwise ln lncdfbvn '
            + 'lncdfbvn2 lncdfmvn lncdfn lncdfn2 lncdfnc lnfact lngammacplx lnpdfmvn lnpdfmvt lnpdfn lnpdft loadd loadstruct loadwind '
            + 'loess loessmt loessmtControlCreate log loglog logx logy lower lowmat lowmat1 ltrisol lu lusol machEpsilon make makevars '
            + 'makewind margin matalloc matinit mattoarray maxbytes maxc maxindc maxv maxvec mbesselei mbesselei0 mbesselei1 mbesseli '
            + 'mbesseli0 mbesseli1 meanc median mergeby mergevar minc minindc minv miss missex missrv moment momentd movingave '
            + 'movingaveExpwgt movingaveWgt nextindex nextn nextnevn nextwind ntos null null1 numCombinations ols olsmt olsmtControlCreate '
            + 'olsqr olsqr2 olsqrmt ones optn optnevn orth outtyp pacf packedToSp packr parse pause pdfCauchy pdfChi pdfExp pdfGenPareto '
            + 'pdfHyperGeo pdfLaplace pdfLogistic pdfn pdfPoisson pdfRayleigh pdfWeibull pi pinv pinvmt plotAddArrow plotAddBar plotAddBox '
            + 'plotAddHist plotAddHistF plotAddHistP plotAddPolar plotAddScatter plotAddShape plotAddTextbox plotAddTS plotAddXY plotArea '
            + 'plotBar plotBox plotClearLayout plotContour plotCustomLayout plotGetDefaults plotHist plotHistF plotHistP plotLayout '
            + 'plotLogLog plotLogX plotLogY plotOpenWindow plotPolar plotSave plotScatter plotSetAxesPen plotSetBar plotSetBarFill '
            + 'plotSetBarStacked plotSetBkdColor plotSetFill plotSetGrid plotSetLegend plotSetLineColor plotSetLineStyle plotSetLineSymbol '
            + 'plotSetLineThickness plotSetNewWindow plotSetTitle plotSetWhichYAxis plotSetXAxisShow plotSetXLabel plotSetXRange '
            + 'plotSetXTicInterval plotSetXTicLabel plotSetYAxisShow plotSetYLabel plotSetYRange plotSetZAxisShow plotSetZLabel '
            + 'plotSurface plotTS plotXY polar polychar polyeval polygamma polyint polymake polymat polymroot polymult polyroot '
            + 'pqgwin previousindex princomp printfm printfmt prodc psi putarray putf putvals pvCreate pvGetIndex pvGetParNames '
            + 'pvGetParVector pvLength pvList pvPack pvPacki pvPackm pvPackmi pvPacks pvPacksi pvPacksm pvPacksmi pvPutParVector '
            + 'pvTest pvUnpack QNewton QNewtonmt QNewtonmtControlCreate QNewtonmtOutCreate QNewtonSet QProg QProgmt QProgmtInCreate '
            + 'qqr qqre qqrep qr qre qrep qrsol qrtsol qtyr qtyre qtyrep quantile quantiled qyr qyre qyrep qz rank rankindx readr '
            + 'real reclassify reclassifyCuts recode recserar recsercp recserrc rerun rescale reshape rets rev rfft rffti rfftip rfftn '
            + 'rfftnp rfftp rndBernoulli rndBeta rndBinomial rndCauchy rndChiSquare rndCon rndCreateState rndExp rndGamma rndGeo rndGumbel '
            + 'rndHyperGeo rndi rndKMbeta rndKMgam rndKMi rndKMn rndKMnb rndKMp rndKMu rndKMvm rndLaplace rndLCbeta rndLCgam rndLCi rndLCn '
            + 'rndLCnb rndLCp rndLCu rndLCvm rndLogNorm rndMTu rndMVn rndMVt rndn rndnb rndNegBinomial rndp rndPoisson rndRayleigh '
            + 'rndStateSkip rndu rndvm rndWeibull rndWishart rotater round rows rowsf rref sampleData satostrC saved saveStruct savewind '
            + 'scale scale3d scalerr scalinfnanmiss scalmiss schtoc schur searchsourcepath seekr select selif seqa seqm setdif setdifsa '
            + 'setvars setvwrmode setwind shell shiftr sin singleindex sinh sleep solpd sortc sortcc sortd sorthc sorthcc sortind '
            + 'sortindc sortmc sortr sortrc spBiconjGradSol spChol spConjGradSol spCreate spDenseSubmat spDiagRvMat spEigv spEye spLDL '
            + 'spline spLU spNumNZE spOnes spreadSheetReadM spreadSheetReadSA spreadSheetWrite spScale spSubmat spToDense spTrTDense '
            + 'spTScalar spZeros sqpSolve sqpSolveMT sqpSolveMTControlCreate sqpSolveMTlagrangeCreate sqpSolveMToutCreate sqpSolveSet '
            + 'sqrt statements stdc stdsc stocv stof strcombine strindx strlen strput strrindx strsect strsplit strsplitPad strtodt '
            + 'strtof strtofcplx strtriml strtrimr strtrunc strtruncl strtruncpad strtruncr submat subscat substute subvec sumc sumr '
            + 'surface svd svd1 svd2 svdcusv svds svdusv sysstate tab tan tanh tempname '
            + 'time timedt timestr timeutc title tkf2eps tkf2ps tocart todaydt toeplitz token topolar trapchk '
            + 'trigamma trimr trunc type typecv typef union unionsa uniqindx uniqindxsa unique uniquesa upmat upmat1 upper utctodt '
            + 'utctodtv utrisol vals varCovMS varCovXS varget vargetl varmall varmares varput varputl vartypef vcm vcms vcx vcxs '
            + 'vec vech vecr vector vget view viewxyz vlist vnamecv volume vput vread vtypecv wait waitc walkindex where window '
            + 'writer xlabel xlsGetSheetCount xlsGetSheetSize xlsGetSheetTypes xlsMakeRange xlsReadM xlsReadSA xlsWrite xlsWriteM '
            + 'xlsWriteSA xpnd xtics xy xyz ylabel ytics zeros zeta zlabel ztics cdfEmpirical dot h5create h5open h5read h5readAttribute '
            + 'h5write h5writeAttribute ldl plotAddErrorBar plotAddSurface plotCDFEmpirical plotSetColormap plotSetContourLabels '
            + 'plotSetLegendFont plotSetTextInterpreter plotSetXTicCount plotSetYTicCount plotSetZLevels powerm strjoin sylvester '
            + 'strtrim',
        literal: 'DB_AFTER_LAST_ROW DB_ALL_TABLES DB_BATCH_OPERATIONS DB_BEFORE_FIRST_ROW DB_BLOB DB_EVENT_NOTIFICATIONS '
            + 'DB_FINISH_QUERY DB_HIGH_PRECISION DB_LAST_INSERT_ID DB_LOW_PRECISION_DOUBLE DB_LOW_PRECISION_INT32 '
            + 'DB_LOW_PRECISION_INT64 DB_LOW_PRECISION_NUMBERS DB_MULTIPLE_RESULT_SETS DB_NAMED_PLACEHOLDERS '
            + 'DB_POSITIONAL_PLACEHOLDERS DB_PREPARED_QUERIES DB_QUERY_SIZE DB_SIMPLE_LOCKING DB_SYSTEM_TABLES DB_TABLES '
            + 'DB_TRANSACTIONS DB_UNICODE DB_VIEWS __STDIN __STDOUT __STDERR __FILE_DIR'
    };
    const AT_COMMENT_MODE = hljs.COMMENT('@', '@');
    const PREPROCESSOR = {
        className: 'meta',
        begin: '#',
        end: '$',
        keywords: { keyword: 'define definecs|10 undef ifdef ifndef iflight ifdllcall ifmac ifos2win ifunix else endif lineson linesoff srcfile srcline' },
        contains: [
            {
                begin: /\\\n/,
                relevance: 0
            },
            {
                beginKeywords: 'include',
                end: '$',
                keywords: { keyword: 'include' },
                contains: [
                    {
                        className: 'string',
                        begin: '"',
                        end: '"',
                        illegal: '\\n'
                    }
                ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            AT_COMMENT_MODE
        ]
    };
    const STRUCT_TYPE = {
        begin: /\bstruct\s+/,
        end: /\s/,
        keywords: "struct",
        contains: [
            {
                className: "type",
                begin: hljs.UNDERSCORE_IDENT_RE,
                relevance: 0
            }
        ]
    };
    const PARSE_PARAMS = [
        {
            className: 'params',
            begin: /\(/,
            end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            endsWithParent: true,
            relevance: 0,
            contains: [
                {
                    className: 'literal',
                    begin: /\.\.\./
                },
                hljs.C_NUMBER_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                AT_COMMENT_MODE,
                STRUCT_TYPE
            ]
        }
    ];
    const FUNCTION_DEF = {
        className: "title",
        begin: hljs.UNDERSCORE_IDENT_RE,
        relevance: 0
    };
    const DEFINITION = function (beginKeywords, end, inherits) {
        const mode = hljs.inherit({
            className: "function",
            beginKeywords: beginKeywords,
            end: end,
            excludeEnd: true,
            contains: [].concat(PARSE_PARAMS)
        }, inherits || {});
        mode.contains.push(FUNCTION_DEF);
        mode.contains.push(hljs.C_NUMBER_MODE);
        mode.contains.push(hljs.C_BLOCK_COMMENT_MODE);
        mode.contains.push(AT_COMMENT_MODE);
        return mode;
    };
    const BUILT_IN_REF = {
        className: 'built_in',
        begin: '\\b(' + KEYWORDS.built_in.split(' ').join('|') + ')\\b'
    };
    const STRING_REF = {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
    };
    const FUNCTION_REF = {
        begin: hljs.UNDERSCORE_IDENT_RE + '\\s*\\(',
        returnBegin: true,
        keywords: KEYWORDS,
        relevance: 0,
        contains: [
            { beginKeywords: KEYWORDS.keyword },
            BUILT_IN_REF,
            {
                className: 'built_in',
                begin: hljs.UNDERSCORE_IDENT_RE,
                relevance: 0
            }
        ]
    };
    const FUNCTION_REF_PARAMS = {
        begin: /\(/,
        end: /\)/,
        relevance: 0,
        keywords: {
            built_in: KEYWORDS.built_in,
            literal: KEYWORDS.literal
        },
        contains: [
            hljs.C_NUMBER_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            AT_COMMENT_MODE,
            BUILT_IN_REF,
            FUNCTION_REF,
            STRING_REF,
            'self'
        ]
    };
    FUNCTION_REF.contains.push(FUNCTION_REF_PARAMS);
    return {
        name: 'GAUSS',
        aliases: ['gss'],
        case_insensitive: true,
        keywords: KEYWORDS,
        illegal: /(\{[%#]|[%#]\}| <- )/,
        contains: [
            hljs.C_NUMBER_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            AT_COMMENT_MODE,
            STRING_REF,
            PREPROCESSOR,
            {
                className: 'keyword',
                begin: /\bexternal (matrix|string|array|sparse matrix|struct|proc|keyword|fn)/
            },
            DEFINITION('proc keyword', ';'),
            DEFINITION('fn', '='),
            {
                beginKeywords: 'for threadfor',
                end: /;/,
                relevance: 0,
                contains: [
                    hljs.C_BLOCK_COMMENT_MODE,
                    AT_COMMENT_MODE,
                    FUNCTION_REF_PARAMS
                ]
            },
            {
                variants: [
                    { begin: hljs.UNDERSCORE_IDENT_RE + '\\.' + hljs.UNDERSCORE_IDENT_RE },
                    { begin: hljs.UNDERSCORE_IDENT_RE + '\\s*=' }
                ],
                relevance: 0
            },
            FUNCTION_REF,
            STRUCT_TYPE
        ]
    };
}
export { gauss as default };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1c3MuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0JlbGxDdWJlRGV2L3NpdGUtdGVzdGluZy9kZXBsb3ltZW50LyIsInNvdXJjZXMiOlsiYXNzZXRzL3NpdGUvaGlnaGxpZ2h0X2pzL2xhbmd1YWdlcy9nYXVzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxTQUFTLEtBQUssQ0FBQyxJQUFJO0lBQ2pCLE1BQU0sUUFBUSxHQUFHO1FBQ2YsT0FBTyxFQUFFLGtGQUFrRjtjQUMvRSxvRkFBb0Y7Y0FDcEYsZ0ZBQWdGO2NBQ2hGLHFGQUFxRjtjQUNyRixzRkFBc0Y7Y0FDdEYsNEVBQTRFO2NBQzVFLHVGQUF1RjtjQUN2Riw2RUFBNkU7Y0FDN0Usb0ZBQW9GO2NBQ3BGLHNDQUFzQztRQUNsRCxRQUFRLEVBQUUsc0dBQXNHO2NBQ3BHLHdHQUF3RztjQUN4RyxpSEFBaUg7Y0FDakgsOEdBQThHO2NBQzlHLDhHQUE4RztjQUM5Ryw2R0FBNkc7Y0FDN0csOEdBQThHO2NBQzlHLCtHQUErRztjQUMvRywrR0FBK0c7Y0FDL0csOEdBQThHO2NBQzlHLCtHQUErRztjQUMvRywrR0FBK0c7Y0FDL0csa0hBQWtIO2NBQ2xILCtHQUErRztjQUMvRywrR0FBK0c7Y0FDL0csbUhBQW1IO2NBQ25ILDJHQUEyRztjQUMzRyxnSEFBZ0g7Y0FDaEgsd0hBQXdIO2NBQ3hILDhHQUE4RztjQUM5RywrR0FBK0c7Y0FDL0csK0dBQStHO2NBQy9HLHlHQUF5RztjQUN6RywyR0FBMkc7Y0FDM0csaUhBQWlIO2NBQ2pILGtIQUFrSDtjQUNsSCxxSEFBcUg7Y0FDckgseUhBQXlIO2NBQ3pILDRIQUE0SDtjQUM1SCwyR0FBMkc7Y0FDM0csNkdBQTZHO2NBQzdHLHNIQUFzSDtjQUN0SCxrSEFBa0g7Y0FDbEgscUhBQXFIO2NBQ3JILDJIQUEySDtjQUMzSCxrSEFBa0g7Y0FDbEgsc0hBQXNIO2NBQ3RILG9IQUFvSDtjQUNwSCx1SEFBdUg7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QUFFLHVFQUF1RTthQUMvRTtZQUNELFVBQVUsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDO1lBQy9CLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1lBQ3JCO2dCQUNFLGFBQWEsRUFBRSxlQUFlO2dCQUM5QixHQUFHLEVBQUUsR0FBRztnQkFFUixTQUFTLEVBQUUsQ0FBQztnQkFDWixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLG9CQUFvQjtvQkFDekIsZUFBZTtvQkFDZixtQkFBbUI7aUJBQ3BCO2FBQ0Y7WUFDRDtnQkFFRSxRQUFRLEVBQUU7b0JBQ1IsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7b0JBQ3RFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLEVBQUU7aUJBQzlDO2dCQUNELFNBQVMsRUFBRSxDQUFDO2FBQ2I7WUFDRCxZQUFZO1lBQ1osV0FBVztTQUNaO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsS0FBSyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkxhbmd1YWdlOiBHQVVTU1xuQXV0aG9yOiBNYXR0IEV2YW5zIDxtYXR0QGFwdGVjaC5jb20+XG5EZXNjcmlwdGlvbjogR0FVU1MgTWF0aGVtYXRpY2FsIGFuZCBTdGF0aXN0aWNhbCBsYW5ndWFnZVxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuYXB0ZWNoLmNvbVxuQ2F0ZWdvcnk6IHNjaWVudGlmaWNcbiovXG5mdW5jdGlvbiBnYXVzcyhobGpzKSB7XG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6ICdib29sIGJyZWFrIGNhbGwgY2FsbGV4ZSBjaGVja2ludGVycnVwdCBjbGVhciBjbGVhcmcgY2xvc2VhbGwgY2xzIGNvbWxvZyBjb21waWxlICdcbiAgICAgICAgICAgICAgKyAnY29udGludWUgY3JlYXRlIGRlYnVnIGRlY2xhcmUgZGVsZXRlIGRpc2FibGUgZGxpYnJhcnkgZGxsY2FsbCBkbyBkb3MgZWQgZWRpdCBlbHNlICdcbiAgICAgICAgICAgICAgKyAnZWxzZWlmIGVuYWJsZSBlbmQgZW5kZm9yIGVuZGlmIGVuZHAgZW5kbyBlcnJvcmxvZyBlcnJvcmxvZ2F0IGV4cHIgZXh0ZXJuYWwgZm4gJ1xuICAgICAgICAgICAgICArICdmb3IgZm9ybWF0IGdvdG8gZ29zdWIgZ3JhcGggaWYga2V5d29yZCBsZXQgbGliIGxpYnJhcnkgbGluZSBsb2FkIGxvYWRhcnJheSBsb2FkZXhlICdcbiAgICAgICAgICAgICAgKyAnbG9hZGYgbG9hZGsgbG9hZG0gbG9hZHAgbG9hZHMgbG9hZHggbG9jYWwgbG9jYXRlIGxvb3BuZXh0aW5kZXggbHByaW50IGxwd2lkdGggbHNob3cgJ1xuICAgICAgICAgICAgICArICdtYXRyaXggbXN5bSBuZHBjbGV4IG5ldyBvcGVuIG91dHB1dCBvdXR3aWR0aCBwbG90IHBsb3RzeW0gcG9wIHByY3NuIHByaW50ICdcbiAgICAgICAgICAgICAgKyAncHJpbnRkb3MgcHJvYyBwdXNoIHJldHAgcmV0dXJuIHJuZGNvbiBybmRtb2Qgcm5kbXVsdCBybmRzZWVkIHJ1biBzYXZlIHNhdmVhbGwgc2NyZWVuICdcbiAgICAgICAgICAgICAgKyAnc2Nyb2xsIHNldGFycmF5IHNob3cgc3BhcnNlIHN0b3Agc3RyaW5nIHN0cnVjdCBzeXN0ZW0gdHJhY2UgdHJhcCB0aHJlYWRmb3IgJ1xuICAgICAgICAgICAgICArICd0aHJlYWRlbmRmb3IgdGhyZWFkYmVnaW4gdGhyZWFkam9pbiB0aHJlYWRzdGF0IHRocmVhZGVuZCB1bnRpbCB1c2Ugd2hpbGUgd2lucHJpbnQgJ1xuICAgICAgICAgICAgICArICduZSBnZSBsZSBndCBsdCBhbmQgeG9yIG9yIG5vdCBlcSBlcXYnLFxuICAgIGJ1aWx0X2luOiAnYWJzIGFjZiBhY29uY2F0IGFleWUgYW1heCBhbWVhbiBBbWVyaWNhbkJpbm9tQ2FsbCBBbWVyaWNhbkJpbm9tQ2FsbF9HcmVla3MgQW1lcmljYW5CaW5vbUNhbGxfSW1wVm9sICdcbiAgICAgICAgICAgICAgKyAnQW1lcmljYW5CaW5vbVB1dCBBbWVyaWNhbkJpbm9tUHV0X0dyZWVrcyBBbWVyaWNhbkJpbm9tUHV0X0ltcFZvbCBBbWVyaWNhbkJTQ2FsbCBBbWVyaWNhbkJTQ2FsbF9HcmVla3MgJ1xuICAgICAgICAgICAgICArICdBbWVyaWNhbkJTQ2FsbF9JbXBWb2wgQW1lcmljYW5CU1B1dCBBbWVyaWNhbkJTUHV0X0dyZWVrcyBBbWVyaWNhbkJTUHV0X0ltcFZvbCBhbWluIGFtdWx0IGFubm90YXRpb25HZXREZWZhdWx0cyAnXG4gICAgICAgICAgICAgICsgJ2Fubm90YXRpb25TZXRCa2QgYW5ub3RhdGlvblNldEZvbnQgYW5ub3RhdGlvblNldExpbmVDb2xvciBhbm5vdGF0aW9uU2V0TGluZVN0eWxlIGFubm90YXRpb25TZXRMaW5lVGhpY2tuZXNzICdcbiAgICAgICAgICAgICAgKyAnYW5udWFsVHJhZGluZ0RheXMgYXJjY29zIGFyY3NpbiBhcmVzaGFwZSBhcnJheWFsbG9jIGFycmF5aW5kZXggYXJyYXlpbml0IGFycmF5dG9tYXQgYXNjaWlsb2FkIGFzY2xhYmVsIGFzdGQgJ1xuICAgICAgICAgICAgICArICdhc3RkcyBhc3VtIGF0YW4gYXRhbjIgYXRyYW5zcG9zZSBheG1hcmdpbiBiYWxhbmNlIGJhbmQgYmFuZGNob2wgYmFuZGNob2xzb2wgYmFuZGx0c29sIGJhbmRydiBiYW5kc29scGQgYmFyICdcbiAgICAgICAgICAgICAgKyAnYmFzZTEwIGJlZ3dpbmQgYmVzc2VsaiBiZXNzZWx5IGJldGEgYm94IGJveGNveCBjZGZCZXRhIGNkZkJldGFJbnYgY2RmQmlub21pYWwgY2RmQmlub21pYWxJbnYgY2RmQnZuIGNkZkJ2bjIgJ1xuICAgICAgICAgICAgICArICdjZGZCdm4yZSBjZGZDYXVjaHkgY2RmQ2F1Y2h5SW52IGNkZkNoaWMgY2RmQ2hpaSBjZGZDaGluYyBjZGZDaGluY0ludiBjZGZFeHAgY2RmRXhwSW52IGNkZkZjIGNkZkZuYyBjZGZGbmNJbnYgJ1xuICAgICAgICAgICAgICArICdjZGZHYW0gY2RmR2VuUGFyZXRvIGNkZkh5cGVyR2VvIGNkZkxhcGxhY2UgY2RmTGFwbGFjZUludiBjZGZMb2dpc3RpYyBjZGZMb2dpc3RpY0ludiBjZGZtQ29udHJvbENyZWF0ZSBjZGZNdm4gJ1xuICAgICAgICAgICAgICArICdjZGZNdm4yZSBjZGZNdm5jZSBjZGZNdm5lIGNkZk12dDJlIGNkZk12dGNlIGNkZk12dGUgY2RmTiBjZGZOMiBjZGZOYyBjZGZOZWdCaW5vbWlhbCBjZGZOZWdCaW5vbWlhbEludiBjZGZOaSAnXG4gICAgICAgICAgICAgICsgJ2NkZlBvaXNzb24gY2RmUG9pc3NvbkludiBjZGZSYXlsZWlnaCBjZGZSYXlsZWlnaEludiBjZGZUYyBjZGZUY2kgY2RmVG5jIGNkZlR2biBjZGZXZWlidWxsIGNkZldlaWJ1bGxJbnYgY2RpciAnXG4gICAgICAgICAgICAgICsgJ2NlaWwgQ2hhbmdlRGlyIGNoZGlyIGNoaUJhclNxdWFyZSBjaG9sIGNob2xkbiBjaG9sc29sIGNob2x1cCBjaHJzIGNsb3NlIGNvZGUgY29scyBjb2xzZiBjb21iaW5hdGUgY29tYmluYXRlZCAnXG4gICAgICAgICAgICAgICsgJ2NvbXBsZXggY29uIGNvbmQgY29uaiBjb25zIENvblNjb3JlIGNvbnRvdXIgY29udiBjb252ZXJ0c2F0b3N0ciBjb252ZXJ0c3RydG9zYSBjb3JybSBjb3JybXMgY29ycnZjIGNvcnJ4IGNvcnJ4cyAnXG4gICAgICAgICAgICAgICsgJ2NvcyBjb3NoIGNvdW50cyBjb3VudHd0cyBjcm9zc3ByZCBjcm91dCBjcm91dHAgY3NyY29sIGNzcmxpbiBjc3ZSZWFkTSBjc3ZSZWFkU0EgY3VtcHJvZGMgY3Vtc3VtYyBjdXJ2ZSBjdnRvcyAnXG4gICAgICAgICAgICAgICsgJ2RhdGFjcmVhdGUgZGF0YWNyZWF0ZWNvbXBsZXggZGF0YWxpc3QgZGF0YWxvYWQgZGF0YWxvb3AgZGF0YW9wZW4gZGF0YXNhdmUgZGF0ZSBkYXRlc3RyIGRhdGVzdHJpbmcgZGF0ZXN0cnltZCAnXG4gICAgICAgICAgICAgICsgJ2RheWlueXIgZGF5b2Z3ZWVrIGRiQWRkRGF0YWJhc2UgZGJDbG9zZSBkYkNvbW1pdCBkYkNyZWF0ZVF1ZXJ5IGRiRXhlY1F1ZXJ5IGRiR2V0Q29ubmVjdE9wdGlvbnMgZGJHZXREYXRhYmFzZU5hbWUgJ1xuICAgICAgICAgICAgICArICdkYkdldERyaXZlck5hbWUgZGJHZXREcml2ZXJzIGRiR2V0SG9zdE5hbWUgZGJHZXRMYXN0RXJyb3JOdW0gZGJHZXRMYXN0RXJyb3JUZXh0IGRiR2V0TnVtZXJpY2FsUHJlY1BvbGljeSAnXG4gICAgICAgICAgICAgICsgJ2RiR2V0UGFzc3dvcmQgZGJHZXRQb3J0IGRiR2V0VGFibGVIZWFkZXJzIGRiR2V0VGFibGVzIGRiR2V0VXNlck5hbWUgZGJIYXNGZWF0dXJlIGRiSXNEcml2ZXJBdmFpbGFibGUgZGJJc09wZW4gJ1xuICAgICAgICAgICAgICArICdkYklzT3BlbkVycm9yIGRiT3BlbiBkYlF1ZXJ5QmluZFZhbHVlIGRiUXVlcnlDbGVhciBkYlF1ZXJ5Q29scyBkYlF1ZXJ5RXhlY1ByZXBhcmVkIGRiUXVlcnlGZXRjaEFsbE0gZGJRdWVyeUZldGNoQWxsU0EgJ1xuICAgICAgICAgICAgICArICdkYlF1ZXJ5RmV0Y2hPbmVNIGRiUXVlcnlGZXRjaE9uZVNBIGRiUXVlcnlGaW5pc2ggZGJRdWVyeUdldEJvdW5kVmFsdWUgZGJRdWVyeUdldEJvdW5kVmFsdWVzIGRiUXVlcnlHZXRGaWVsZCAnXG4gICAgICAgICAgICAgICsgJ2RiUXVlcnlHZXRMYXN0RXJyb3JOdW0gZGJRdWVyeUdldExhc3RFcnJvclRleHQgZGJRdWVyeUdldExhc3RJbnNlcnRJRCBkYlF1ZXJ5R2V0TGFzdFF1ZXJ5IGRiUXVlcnlHZXRQb3NpdGlvbiAnXG4gICAgICAgICAgICAgICsgJ2RiUXVlcnlJc0FjdGl2ZSBkYlF1ZXJ5SXNGb3J3YXJkT25seSBkYlF1ZXJ5SXNOdWxsIGRiUXVlcnlJc1NlbGVjdCBkYlF1ZXJ5SXNWYWxpZCBkYlF1ZXJ5UHJlcGFyZSBkYlF1ZXJ5Um93cyAnXG4gICAgICAgICAgICAgICsgJ2RiUXVlcnlTZWVrIGRiUXVlcnlTZWVrRmlyc3QgZGJRdWVyeVNlZWtMYXN0IGRiUXVlcnlTZWVrTmV4dCBkYlF1ZXJ5U2Vla1ByZXZpb3VzIGRiUXVlcnlTZXRGb3J3YXJkT25seSAnXG4gICAgICAgICAgICAgICsgJ2RiUmVtb3ZlRGF0YWJhc2UgZGJSb2xsYmFjayBkYlNldENvbm5lY3RPcHRpb25zIGRiU2V0RGF0YWJhc2VOYW1lIGRiU2V0SG9zdE5hbWUgZGJTZXROdW1lcmljYWxQcmVjUG9saWN5ICdcbiAgICAgICAgICAgICAgKyAnZGJTZXRQb3J0IGRiU2V0VXNlck5hbWUgZGJUcmFuc2FjdGlvbiBEZWxldGVGaWxlIGRlbGlmIGRlbHJvd3MgZGVuc2VUb1NwIGRlbnNlVG9TcFJFIGRlblRvWmVybyBkZXNpZ24gZGV0IGRldGwgJ1xuICAgICAgICAgICAgICArICdkZmZ0IGRmZnRpIGRpYWcgZGlhZ3J2IGRpZ2FtbWEgZG9zd2luIERPU1dpbkNsb3NlYWxsIERPU1dpbk9wZW4gZG90ZmVxIGRvdGZlcW10IGRvdGZnZSBkb3RmZ2VtdCBkb3RmZ3QgZG90Zmd0bXQgJ1xuICAgICAgICAgICAgICArICdkb3RmbGUgZG90ZmxlbXQgZG90Zmx0IGRvdGZsdG10IGRvdGZuZSBkb3RmbmVtdCBkcmF3IGRyb3AgZHNDcmVhdGUgZHN0YXQgZHN0YXRtdCBkc3RhdG10Q29udHJvbENyZWF0ZSBkdGRhdGUgZHRkYXkgJ1xuICAgICAgICAgICAgICArICdkdHRpbWUgZHR0b2R0diBkdHRvc3RyIGR0dG91dGMgZHR2bm9ybWFsIGR0dnRvZHQgZHR2dG91dGMgZHVtbXkgZHVtbXliciBkdW1teWRuIGVpZyBlaWdoIGVpZ2h2IGVpZ3YgZWxhcHNlZFRyYWRpbmdEYXlzICdcbiAgICAgICAgICAgICAgKyAnZW5kd2luZCBlbnZnZXQgZW9mIGVxU29sdmUgZXFTb2x2ZW10IGVxU29sdmVtdENvbnRyb2xDcmVhdGUgZXFTb2x2ZW10T3V0Q3JlYXRlIGVxU29sdmVzZXQgZXJmIGVyZmMgZXJmY2NwbHggZXJmY3BseCBlcnJvciAnXG4gICAgICAgICAgICAgICsgJ2V0ZGF5cyBldGhzZWMgZXRzdHIgRXVyb3BlYW5CaW5vbUNhbGwgRXVyb3BlYW5CaW5vbUNhbGxfR3JlZWtzIEV1cm9wZWFuQmlub21DYWxsX0ltcFZvbCBFdXJvcGVhbkJpbm9tUHV0ICdcbiAgICAgICAgICAgICAgKyAnRXVyb3BlYW5CaW5vbVB1dF9HcmVla3MgRXVyb3BlYW5CaW5vbVB1dF9JbXBWb2wgRXVyb3BlYW5CU0NhbGwgRXVyb3BlYW5CU0NhbGxfR3JlZWtzIEV1cm9wZWFuQlNDYWxsX0ltcFZvbCAnXG4gICAgICAgICAgICAgICsgJ0V1cm9wZWFuQlNQdXQgRXVyb3BlYW5CU1B1dF9HcmVla3MgRXVyb3BlYW5CU1B1dF9JbXBWb2wgZXhjdHNtcGwgZXhlYyBleGVjYmcgZXhwIGV4dGVybiBleWUgZmNoZWNrZXJyIGZjbGVhcmVyciBmZXEgJ1xuICAgICAgICAgICAgICArICdmZXFtdCBmZmx1c2ggZmZ0IGZmdGkgZmZ0bSBmZnRtaSBmZnRuIGZnZSBmZ2VtdCBmZ2V0cyBmZ2V0c2EgZmdldHNhdCBmZ2V0c3QgZmd0IGZndG10IGZpbGVpbmZvIGZpbGVzYSBmbGUgZmxlbXQgJ1xuICAgICAgICAgICAgICArICdmbG9vciBmbHQgZmx0bXQgZm1vZCBmbmUgZm5lbXQgZm9udHMgZm9wZW4gZm9ybWF0Y3YgZm9ybWF0bnYgZnB1dHMgZnB1dHN0IGZzZWVrIGZzdHJlcnJvciBmdGVsbCBmdG9jdiBmdG9zIGZ0b3N0ckMgJ1xuICAgICAgICAgICAgICArICdnYW1tYSBnYW1tYWNwbHggZ2FtbWFpaSBnYXVzc2V0IGdkYUFwcGVuZCBnZGFDcmVhdGUgZ2RhRFN0YXQgZ2RhRFN0YXRNYXQgZ2RhR2V0SW5kZXggZ2RhR2V0TmFtZSBnZGFHZXROYW1lcyBnZGFHZXRPcmRlcnMgJ1xuICAgICAgICAgICAgICArICdnZGFHZXRUeXBlIGdkYUdldFR5cGVzIGdkYUdldFZhckluZm8gZ2RhSXNDcGx4IGdkYUxvYWQgZ2RhUGFjayBnZGFSZWFkIGdkYVJlYWRCeUluZGV4IGdkYVJlYWRTb21lIGdkYVJlYWRTcGFyc2UgJ1xuICAgICAgICAgICAgICArICdnZGFSZWFkU3RydWN0IGdkYVJlcG9ydFZhckluZm8gZ2RhU2F2ZSBnZGFVcGRhdGUgZ2RhVXBkYXRlQW5kUGFjayBnZGFWYXJzIGdkYVdyaXRlIGdkYVdyaXRlMzIgZ2RhV3JpdGVTb21lIGdldGFycmF5ICdcbiAgICAgICAgICAgICAgKyAnZ2V0ZGltcyBnZXRmIGdldEdBVVNTaG9tZSBnZXRtYXRyaXggZ2V0bWF0cml4NEQgZ2V0bmFtZSBnZXRuYW1lZiBnZXROZXh0VHJhZGluZ0RheSBnZXROZXh0V2Vla0RheSBnZXRuciBnZXRvcmRlcnMgJ1xuICAgICAgICAgICAgICArICdnZXRwYXRoIGdldFByZXZpb3VzVHJhZGluZ0RheSBnZXRQcmV2aW91c1dlZWtEYXkgZ2V0Um93IGdldHNjYWxhcjNEIGdldHNjYWxhcjREIGdldFRyUm93IGdldHdpbmQgZ2xtIGdyYWRjcGx4IGdyYWRNVCAnXG4gICAgICAgICAgICAgICsgJ2dyYWRNVG0gZ3JhZE1UVCBncmFkTVRUbSBncmFkcCBncmFwaHBydCBncmFwaHNldCBoYXNpbWFnIGhlYWRlciBoZWFkZXJtdCBoZXNzIGhlc3NNVCBoZXNzTVRnIGhlc3NNVGd3IGhlc3NNVG0gJ1xuICAgICAgICAgICAgICArICdoZXNzTVRtdyBoZXNzTVRUIGhlc3NNVFRnIGhlc3NNVFRndyBoZXNzTVRUbSBoZXNzTVR3IGhlc3NwIGhpc3QgaGlzdGYgaGlzdHAgaHNlYyBpbWFnIGluZGN2IGluZGV4Y2F0IGluZGljZXMgaW5kaWNlczIgJ1xuICAgICAgICAgICAgICArICdpbmRpY2VzZiBpbmRpY2VzZm4gaW5kbnYgaW5kc2F2IGludGVncmF0ZTFkIGludGVncmF0ZUNvbnRyb2xDcmVhdGUgaW50Z3JhdDIgaW50Z3JhdDMgaW50aHAxIGludGhwMiBpbnRocDMgaW50aHA0ICdcbiAgICAgICAgICAgICAgKyAnaW50aHBDb250cm9sQ3JlYXRlIGludHF1YWQxIGludHF1YWQyIGludHF1YWQzIGludHJsZWF2IGludHJsZWF2c2EgaW50cnNlY3QgaW50c2ltcCBpbnYgaW52cGQgaW52c3dwIGlzY3BseCBpc2NwbHhmICdcbiAgICAgICAgICAgICAgKyAnaXNkZW4gaXNpbmZuYW5taXNzIGlzbWlzcyBrZXkga2V5YXYga2V5dyBsYWcgbGFnMSBsYWduIGxhcEVpZ2hiIGxhcEVpZ2hpIGxhcEVpZ2h2YiBsYXBFaWdodmkgbGFwZ0VpZyBsYXBnRWlnaCBsYXBnRWlnaHYgJ1xuICAgICAgICAgICAgICArICdsYXBnRWlndiBsYXBnU2NodXIgbGFwZ1N2ZGNzdCBsYXBnU3ZkcyBsYXBnU3Zkc3QgbGFwU3ZkY3VzdiBsYXBTdmRzIGxhcFN2ZHVzdiBsZGxwIGxkbHNvbCBsaW5Tb2x2ZSBsaXN0d2lzZSBsbiBsbmNkZmJ2biAnXG4gICAgICAgICAgICAgICsgJ2xuY2RmYnZuMiBsbmNkZm12biBsbmNkZm4gbG5jZGZuMiBsbmNkZm5jIGxuZmFjdCBsbmdhbW1hY3BseCBsbnBkZm12biBsbnBkZm12dCBsbnBkZm4gbG5wZGZ0IGxvYWRkIGxvYWRzdHJ1Y3QgbG9hZHdpbmQgJ1xuICAgICAgICAgICAgICArICdsb2VzcyBsb2Vzc210IGxvZXNzbXRDb250cm9sQ3JlYXRlIGxvZyBsb2dsb2cgbG9neCBsb2d5IGxvd2VyIGxvd21hdCBsb3dtYXQxIGx0cmlzb2wgbHUgbHVzb2wgbWFjaEVwc2lsb24gbWFrZSBtYWtldmFycyAnXG4gICAgICAgICAgICAgICsgJ21ha2V3aW5kIG1hcmdpbiBtYXRhbGxvYyBtYXRpbml0IG1hdHRvYXJyYXkgbWF4Ynl0ZXMgbWF4YyBtYXhpbmRjIG1heHYgbWF4dmVjIG1iZXNzZWxlaSBtYmVzc2VsZWkwIG1iZXNzZWxlaTEgbWJlc3NlbGkgJ1xuICAgICAgICAgICAgICArICdtYmVzc2VsaTAgbWJlc3NlbGkxIG1lYW5jIG1lZGlhbiBtZXJnZWJ5IG1lcmdldmFyIG1pbmMgbWluaW5kYyBtaW52IG1pc3MgbWlzc2V4IG1pc3NydiBtb21lbnQgbW9tZW50ZCBtb3ZpbmdhdmUgJ1xuICAgICAgICAgICAgICArICdtb3ZpbmdhdmVFeHB3Z3QgbW92aW5nYXZlV2d0IG5leHRpbmRleCBuZXh0biBuZXh0bmV2biBuZXh0d2luZCBudG9zIG51bGwgbnVsbDEgbnVtQ29tYmluYXRpb25zIG9scyBvbHNtdCBvbHNtdENvbnRyb2xDcmVhdGUgJ1xuICAgICAgICAgICAgICArICdvbHNxciBvbHNxcjIgb2xzcXJtdCBvbmVzIG9wdG4gb3B0bmV2biBvcnRoIG91dHR5cCBwYWNmIHBhY2tlZFRvU3AgcGFja3IgcGFyc2UgcGF1c2UgcGRmQ2F1Y2h5IHBkZkNoaSBwZGZFeHAgcGRmR2VuUGFyZXRvICdcbiAgICAgICAgICAgICAgKyAncGRmSHlwZXJHZW8gcGRmTGFwbGFjZSBwZGZMb2dpc3RpYyBwZGZuIHBkZlBvaXNzb24gcGRmUmF5bGVpZ2ggcGRmV2VpYnVsbCBwaSBwaW52IHBpbnZtdCBwbG90QWRkQXJyb3cgcGxvdEFkZEJhciBwbG90QWRkQm94ICdcbiAgICAgICAgICAgICAgKyAncGxvdEFkZEhpc3QgcGxvdEFkZEhpc3RGIHBsb3RBZGRIaXN0UCBwbG90QWRkUG9sYXIgcGxvdEFkZFNjYXR0ZXIgcGxvdEFkZFNoYXBlIHBsb3RBZGRUZXh0Ym94IHBsb3RBZGRUUyBwbG90QWRkWFkgcGxvdEFyZWEgJ1xuICAgICAgICAgICAgICArICdwbG90QmFyIHBsb3RCb3ggcGxvdENsZWFyTGF5b3V0IHBsb3RDb250b3VyIHBsb3RDdXN0b21MYXlvdXQgcGxvdEdldERlZmF1bHRzIHBsb3RIaXN0IHBsb3RIaXN0RiBwbG90SGlzdFAgcGxvdExheW91dCAnXG4gICAgICAgICAgICAgICsgJ3Bsb3RMb2dMb2cgcGxvdExvZ1ggcGxvdExvZ1kgcGxvdE9wZW5XaW5kb3cgcGxvdFBvbGFyIHBsb3RTYXZlIHBsb3RTY2F0dGVyIHBsb3RTZXRBeGVzUGVuIHBsb3RTZXRCYXIgcGxvdFNldEJhckZpbGwgJ1xuICAgICAgICAgICAgICArICdwbG90U2V0QmFyU3RhY2tlZCBwbG90U2V0QmtkQ29sb3IgcGxvdFNldEZpbGwgcGxvdFNldEdyaWQgcGxvdFNldExlZ2VuZCBwbG90U2V0TGluZUNvbG9yIHBsb3RTZXRMaW5lU3R5bGUgcGxvdFNldExpbmVTeW1ib2wgJ1xuICAgICAgICAgICAgICArICdwbG90U2V0TGluZVRoaWNrbmVzcyBwbG90U2V0TmV3V2luZG93IHBsb3RTZXRUaXRsZSBwbG90U2V0V2hpY2hZQXhpcyBwbG90U2V0WEF4aXNTaG93IHBsb3RTZXRYTGFiZWwgcGxvdFNldFhSYW5nZSAnXG4gICAgICAgICAgICAgICsgJ3Bsb3RTZXRYVGljSW50ZXJ2YWwgcGxvdFNldFhUaWNMYWJlbCBwbG90U2V0WUF4aXNTaG93IHBsb3RTZXRZTGFiZWwgcGxvdFNldFlSYW5nZSBwbG90U2V0WkF4aXNTaG93IHBsb3RTZXRaTGFiZWwgJ1xuICAgICAgICAgICAgICArICdwbG90U3VyZmFjZSBwbG90VFMgcGxvdFhZIHBvbGFyIHBvbHljaGFyIHBvbHlldmFsIHBvbHlnYW1tYSBwb2x5aW50IHBvbHltYWtlIHBvbHltYXQgcG9seW1yb290IHBvbHltdWx0IHBvbHlyb290ICdcbiAgICAgICAgICAgICAgKyAncHFnd2luIHByZXZpb3VzaW5kZXggcHJpbmNvbXAgcHJpbnRmbSBwcmludGZtdCBwcm9kYyBwc2kgcHV0YXJyYXkgcHV0ZiBwdXR2YWxzIHB2Q3JlYXRlIHB2R2V0SW5kZXggcHZHZXRQYXJOYW1lcyAnXG4gICAgICAgICAgICAgICsgJ3B2R2V0UGFyVmVjdG9yIHB2TGVuZ3RoIHB2TGlzdCBwdlBhY2sgcHZQYWNraSBwdlBhY2ttIHB2UGFja21pIHB2UGFja3MgcHZQYWNrc2kgcHZQYWNrc20gcHZQYWNrc21pIHB2UHV0UGFyVmVjdG9yICdcbiAgICAgICAgICAgICAgKyAncHZUZXN0IHB2VW5wYWNrIFFOZXd0b24gUU5ld3Rvbm10IFFOZXd0b25tdENvbnRyb2xDcmVhdGUgUU5ld3Rvbm10T3V0Q3JlYXRlIFFOZXd0b25TZXQgUVByb2cgUVByb2dtdCBRUHJvZ210SW5DcmVhdGUgJ1xuICAgICAgICAgICAgICArICdxcXIgcXFyZSBxcXJlcCBxciBxcmUgcXJlcCBxcnNvbCBxcnRzb2wgcXR5ciBxdHlyZSBxdHlyZXAgcXVhbnRpbGUgcXVhbnRpbGVkIHF5ciBxeXJlIHF5cmVwIHF6IHJhbmsgcmFua2luZHggcmVhZHIgJ1xuICAgICAgICAgICAgICArICdyZWFsIHJlY2xhc3NpZnkgcmVjbGFzc2lmeUN1dHMgcmVjb2RlIHJlY3NlcmFyIHJlY3NlcmNwIHJlY3NlcnJjIHJlcnVuIHJlc2NhbGUgcmVzaGFwZSByZXRzIHJldiByZmZ0IHJmZnRpIHJmZnRpcCByZmZ0biAnXG4gICAgICAgICAgICAgICsgJ3JmZnRucCByZmZ0cCBybmRCZXJub3VsbGkgcm5kQmV0YSBybmRCaW5vbWlhbCBybmRDYXVjaHkgcm5kQ2hpU3F1YXJlIHJuZENvbiBybmRDcmVhdGVTdGF0ZSBybmRFeHAgcm5kR2FtbWEgcm5kR2VvIHJuZEd1bWJlbCAnXG4gICAgICAgICAgICAgICsgJ3JuZEh5cGVyR2VvIHJuZGkgcm5kS01iZXRhIHJuZEtNZ2FtIHJuZEtNaSBybmRLTW4gcm5kS01uYiBybmRLTXAgcm5kS011IHJuZEtNdm0gcm5kTGFwbGFjZSBybmRMQ2JldGEgcm5kTENnYW0gcm5kTENpIHJuZExDbiAnXG4gICAgICAgICAgICAgICsgJ3JuZExDbmIgcm5kTENwIHJuZExDdSBybmRMQ3ZtIHJuZExvZ05vcm0gcm5kTVR1IHJuZE1WbiBybmRNVnQgcm5kbiBybmRuYiBybmROZWdCaW5vbWlhbCBybmRwIHJuZFBvaXNzb24gcm5kUmF5bGVpZ2ggJ1xuICAgICAgICAgICAgICArICdybmRTdGF0ZVNraXAgcm5kdSBybmR2bSBybmRXZWlidWxsIHJuZFdpc2hhcnQgcm90YXRlciByb3VuZCByb3dzIHJvd3NmIHJyZWYgc2FtcGxlRGF0YSBzYXRvc3RyQyBzYXZlZCBzYXZlU3RydWN0IHNhdmV3aW5kICdcbiAgICAgICAgICAgICAgKyAnc2NhbGUgc2NhbGUzZCBzY2FsZXJyIHNjYWxpbmZuYW5taXNzIHNjYWxtaXNzIHNjaHRvYyBzY2h1ciBzZWFyY2hzb3VyY2VwYXRoIHNlZWtyIHNlbGVjdCBzZWxpZiBzZXFhIHNlcW0gc2V0ZGlmIHNldGRpZnNhICdcbiAgICAgICAgICAgICAgKyAnc2V0dmFycyBzZXR2d3Jtb2RlIHNldHdpbmQgc2hlbGwgc2hpZnRyIHNpbiBzaW5nbGVpbmRleCBzaW5oIHNsZWVwIHNvbHBkIHNvcnRjIHNvcnRjYyBzb3J0ZCBzb3J0aGMgc29ydGhjYyBzb3J0aW5kICdcbiAgICAgICAgICAgICAgKyAnc29ydGluZGMgc29ydG1jIHNvcnRyIHNvcnRyYyBzcEJpY29uakdyYWRTb2wgc3BDaG9sIHNwQ29uakdyYWRTb2wgc3BDcmVhdGUgc3BEZW5zZVN1Ym1hdCBzcERpYWdSdk1hdCBzcEVpZ3Ygc3BFeWUgc3BMREwgJ1xuICAgICAgICAgICAgICArICdzcGxpbmUgc3BMVSBzcE51bU5aRSBzcE9uZXMgc3ByZWFkU2hlZXRSZWFkTSBzcHJlYWRTaGVldFJlYWRTQSBzcHJlYWRTaGVldFdyaXRlIHNwU2NhbGUgc3BTdWJtYXQgc3BUb0RlbnNlIHNwVHJURGVuc2UgJ1xuICAgICAgICAgICAgICArICdzcFRTY2FsYXIgc3BaZXJvcyBzcXBTb2x2ZSBzcXBTb2x2ZU1UIHNxcFNvbHZlTVRDb250cm9sQ3JlYXRlIHNxcFNvbHZlTVRsYWdyYW5nZUNyZWF0ZSBzcXBTb2x2ZU1Ub3V0Q3JlYXRlIHNxcFNvbHZlU2V0ICdcbiAgICAgICAgICAgICAgKyAnc3FydCBzdGF0ZW1lbnRzIHN0ZGMgc3Rkc2Mgc3RvY3Ygc3RvZiBzdHJjb21iaW5lIHN0cmluZHggc3RybGVuIHN0cnB1dCBzdHJyaW5keCBzdHJzZWN0IHN0cnNwbGl0IHN0cnNwbGl0UGFkIHN0cnRvZHQgJ1xuICAgICAgICAgICAgICArICdzdHJ0b2Ygc3RydG9mY3BseCBzdHJ0cmltbCBzdHJ0cmltciBzdHJ0cnVuYyBzdHJ0cnVuY2wgc3RydHJ1bmNwYWQgc3RydHJ1bmNyIHN1Ym1hdCBzdWJzY2F0IHN1YnN0dXRlIHN1YnZlYyBzdW1jIHN1bXIgJ1xuICAgICAgICAgICAgICArICdzdXJmYWNlIHN2ZCBzdmQxIHN2ZDIgc3ZkY3VzdiBzdmRzIHN2ZHVzdiBzeXNzdGF0ZSB0YWIgdGFuIHRhbmggdGVtcG5hbWUgJ1xuICAgICAgICAgICAgICArICd0aW1lIHRpbWVkdCB0aW1lc3RyIHRpbWV1dGMgdGl0bGUgdGtmMmVwcyB0a2YycHMgdG9jYXJ0IHRvZGF5ZHQgdG9lcGxpdHogdG9rZW4gdG9wb2xhciB0cmFwY2hrICdcbiAgICAgICAgICAgICAgKyAndHJpZ2FtbWEgdHJpbXIgdHJ1bmMgdHlwZSB0eXBlY3YgdHlwZWYgdW5pb24gdW5pb25zYSB1bmlxaW5keCB1bmlxaW5keHNhIHVuaXF1ZSB1bmlxdWVzYSB1cG1hdCB1cG1hdDEgdXBwZXIgdXRjdG9kdCAnXG4gICAgICAgICAgICAgICsgJ3V0Y3RvZHR2IHV0cmlzb2wgdmFscyB2YXJDb3ZNUyB2YXJDb3ZYUyB2YXJnZXQgdmFyZ2V0bCB2YXJtYWxsIHZhcm1hcmVzIHZhcnB1dCB2YXJwdXRsIHZhcnR5cGVmIHZjbSB2Y21zIHZjeCB2Y3hzICdcbiAgICAgICAgICAgICAgKyAndmVjIHZlY2ggdmVjciB2ZWN0b3IgdmdldCB2aWV3IHZpZXd4eXogdmxpc3Qgdm5hbWVjdiB2b2x1bWUgdnB1dCB2cmVhZCB2dHlwZWN2IHdhaXQgd2FpdGMgd2Fsa2luZGV4IHdoZXJlIHdpbmRvdyAnXG4gICAgICAgICAgICAgICsgJ3dyaXRlciB4bGFiZWwgeGxzR2V0U2hlZXRDb3VudCB4bHNHZXRTaGVldFNpemUgeGxzR2V0U2hlZXRUeXBlcyB4bHNNYWtlUmFuZ2UgeGxzUmVhZE0geGxzUmVhZFNBIHhsc1dyaXRlIHhsc1dyaXRlTSAnXG4gICAgICAgICAgICAgICsgJ3hsc1dyaXRlU0EgeHBuZCB4dGljcyB4eSB4eXogeWxhYmVsIHl0aWNzIHplcm9zIHpldGEgemxhYmVsIHp0aWNzIGNkZkVtcGlyaWNhbCBkb3QgaDVjcmVhdGUgaDVvcGVuIGg1cmVhZCBoNXJlYWRBdHRyaWJ1dGUgJ1xuICAgICAgICAgICAgICArICdoNXdyaXRlIGg1d3JpdGVBdHRyaWJ1dGUgbGRsIHBsb3RBZGRFcnJvckJhciBwbG90QWRkU3VyZmFjZSBwbG90Q0RGRW1waXJpY2FsIHBsb3RTZXRDb2xvcm1hcCBwbG90U2V0Q29udG91ckxhYmVscyAnXG4gICAgICAgICAgICAgICsgJ3Bsb3RTZXRMZWdlbmRGb250IHBsb3RTZXRUZXh0SW50ZXJwcmV0ZXIgcGxvdFNldFhUaWNDb3VudCBwbG90U2V0WVRpY0NvdW50IHBsb3RTZXRaTGV2ZWxzIHBvd2VybSBzdHJqb2luIHN5bHZlc3RlciAnXG4gICAgICAgICAgICAgICsgJ3N0cnRyaW0nLFxuICAgIGxpdGVyYWw6ICdEQl9BRlRFUl9MQVNUX1JPVyBEQl9BTExfVEFCTEVTIERCX0JBVENIX09QRVJBVElPTlMgREJfQkVGT1JFX0ZJUlNUX1JPVyBEQl9CTE9CIERCX0VWRU5UX05PVElGSUNBVElPTlMgJ1xuICAgICAgICAgICAgICsgJ0RCX0ZJTklTSF9RVUVSWSBEQl9ISUdIX1BSRUNJU0lPTiBEQl9MQVNUX0lOU0VSVF9JRCBEQl9MT1dfUFJFQ0lTSU9OX0RPVUJMRSBEQl9MT1dfUFJFQ0lTSU9OX0lOVDMyICdcbiAgICAgICAgICAgICArICdEQl9MT1dfUFJFQ0lTSU9OX0lOVDY0IERCX0xPV19QUkVDSVNJT05fTlVNQkVSUyBEQl9NVUxUSVBMRV9SRVNVTFRfU0VUUyBEQl9OQU1FRF9QTEFDRUhPTERFUlMgJ1xuICAgICAgICAgICAgICsgJ0RCX1BPU0lUSU9OQUxfUExBQ0VIT0xERVJTIERCX1BSRVBBUkVEX1FVRVJJRVMgREJfUVVFUllfU0laRSBEQl9TSU1QTEVfTE9DS0lORyBEQl9TWVNURU1fVEFCTEVTIERCX1RBQkxFUyAnXG4gICAgICAgICAgICAgKyAnREJfVFJBTlNBQ1RJT05TIERCX1VOSUNPREUgREJfVklFV1MgX19TVERJTiBfX1NURE9VVCBfX1NUREVSUiBfX0ZJTEVfRElSJ1xuICB9O1xuXG4gIGNvbnN0IEFUX0NPTU1FTlRfTU9ERSA9IGhsanMuQ09NTUVOVCgnQCcsICdAJyk7XG5cbiAgY29uc3QgUFJFUFJPQ0VTU09SID1cbiAge1xuICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgIGJlZ2luOiAnIycsXG4gICAgZW5kOiAnJCcsXG4gICAga2V5d29yZHM6IHsga2V5d29yZDogJ2RlZmluZSBkZWZpbmVjc3wxMCB1bmRlZiBpZmRlZiBpZm5kZWYgaWZsaWdodCBpZmRsbGNhbGwgaWZtYWMgaWZvczJ3aW4gaWZ1bml4IGVsc2UgZW5kaWYgbGluZXNvbiBsaW5lc29mZiBzcmNmaWxlIHNyY2xpbmUnIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXFxcXFxuLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnaW5jbHVkZScsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogeyBrZXl3b3JkOiAnaW5jbHVkZScgfSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICdcIicsXG4gICAgICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIEFUX0NPTU1FTlRfTU9ERVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBTVFJVQ1RfVFlQRSA9XG4gIHtcbiAgICBiZWdpbjogL1xcYnN0cnVjdFxccysvLFxuICAgIGVuZDogL1xccy8sXG4gICAga2V5d29yZHM6IFwic3RydWN0XCIsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiBcInR5cGVcIixcbiAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIC8vIG9ubHkgZm9yIGRlZmluaXRpb25zXG4gIGNvbnN0IFBBUlNFX1BBUkFNUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgZW5kOiAvXFwpLyxcbiAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIHsgLy8gZG90c1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgICAgICAgIGJlZ2luOiAvXFwuXFwuXFwuL1xuICAgICAgICB9LFxuICAgICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgIEFUX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgU1RSVUNUX1RZUEVcbiAgICAgIF1cbiAgICB9XG4gIF07XG5cbiAgY29uc3QgRlVOQ1RJT05fREVGID1cbiAge1xuICAgIGNsYXNzTmFtZTogXCJ0aXRsZVwiLFxuICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgY29uc3QgREVGSU5JVElPTiA9IGZ1bmN0aW9uKGJlZ2luS2V5d29yZHMsIGVuZCwgaW5oZXJpdHMpIHtcbiAgICBjb25zdCBtb2RlID0gaGxqcy5pbmhlcml0KFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgYmVnaW5LZXl3b3JkczogYmVnaW5LZXl3b3JkcyxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXS5jb25jYXQoUEFSU0VfUEFSQU1TKVxuICAgICAgfSxcbiAgICAgIGluaGVyaXRzIHx8IHt9XG4gICAgKTtcbiAgICBtb2RlLmNvbnRhaW5zLnB1c2goRlVOQ1RJT05fREVGKTtcbiAgICBtb2RlLmNvbnRhaW5zLnB1c2goaGxqcy5DX05VTUJFUl9NT0RFKTtcbiAgICBtb2RlLmNvbnRhaW5zLnB1c2goaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSk7XG4gICAgbW9kZS5jb250YWlucy5wdXNoKEFUX0NPTU1FTlRfTU9ERSk7XG4gICAgcmV0dXJuIG1vZGU7XG4gIH07XG5cbiAgY29uc3QgQlVJTFRfSU5fUkVGID1cbiAgeyAvLyB0aGVzZSBhcmUgZXhwbGljaXRseSBuYW1lZCBpbnRlcm5hbCBmdW5jdGlvbiBjYWxsc1xuICAgIGNsYXNzTmFtZTogJ2J1aWx0X2luJyxcbiAgICBiZWdpbjogJ1xcXFxiKCcgKyBLRVlXT1JEUy5idWlsdF9pbi5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcpXFxcXGInXG4gIH07XG5cbiAgY29uc3QgU1RSSU5HX1JFRiA9XG4gIHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLFxuICAgIGVuZDogJ1wiJyxcbiAgICBjb250YWluczogWyBobGpzLkJBQ0tTTEFTSF9FU0NBUEUgXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBGVU5DVElPTl9SRUYgPVxuICB7XG4gICAgLy8gY2xhc3NOYW1lOiBcImZuX3JlZlwiLFxuICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnXFxcXHMqXFxcXCgnLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHsgYmVnaW5LZXl3b3JkczogS0VZV09SRFMua2V5d29yZCB9LFxuICAgICAgQlVJTFRfSU5fUkVGLFxuICAgICAgeyAvLyBhbWJpZ3VvdXNseSBuYW1lZCBmdW5jdGlvbiBjYWxscyBnZXQgYSByZWxldmFuY2Ugb2YgMFxuICAgICAgICBjbGFzc05hbWU6ICdidWlsdF9pbicsXG4gICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBGVU5DVElPTl9SRUZfUEFSQU1TID1cbiAge1xuICAgIC8vIGNsYXNzTmFtZTogXCJmbl9yZWZfcGFyYW1zXCIsXG4gICAgYmVnaW46IC9cXCgvLFxuICAgIGVuZDogL1xcKS8sXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBidWlsdF9pbjogS0VZV09SRFMuYnVpbHRfaW4sXG4gICAgICBsaXRlcmFsOiBLRVlXT1JEUy5saXRlcmFsXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIEFUX0NPTU1FTlRfTU9ERSxcbiAgICAgIEJVSUxUX0lOX1JFRixcbiAgICAgIEZVTkNUSU9OX1JFRixcbiAgICAgIFNUUklOR19SRUYsXG4gICAgICAnc2VsZidcbiAgICBdXG4gIH07XG5cbiAgRlVOQ1RJT05fUkVGLmNvbnRhaW5zLnB1c2goRlVOQ1RJT05fUkVGX1BBUkFNUyk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnR0FVU1MnLFxuICAgIGFsaWFzZXM6IFsgJ2dzcycgXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLCAvLyBsYW5ndWFnZSBpcyBjYXNlLWluc2Vuc2l0aXZlXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGlsbGVnYWw6IC8oXFx7WyUjXXxbJSNdXFx9fCA8LSApLyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIEFUX0NPTU1FTlRfTU9ERSxcbiAgICAgIFNUUklOR19SRUYsXG4gICAgICBQUkVQUk9DRVNTT1IsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjogL1xcYmV4dGVybmFsIChtYXRyaXh8c3RyaW5nfGFycmF5fHNwYXJzZSBtYXRyaXh8c3RydWN0fHByb2N8a2V5d29yZHxmbikvXG4gICAgICB9LFxuICAgICAgREVGSU5JVElPTigncHJvYyBrZXl3b3JkJywgJzsnKSxcbiAgICAgIERFRklOSVRJT04oJ2ZuJywgJz0nKSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2ZvciB0aHJlYWRmb3InLFxuICAgICAgICBlbmQ6IC87LyxcbiAgICAgICAgLy8gZW5kOiAvXFwoLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgQVRfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIEZVTkNUSU9OX1JFRl9QQVJBTVNcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHsgLy8gY3VzdG9tIG1ldGhvZCBndWFyZFxuICAgICAgICAvLyBleGNsdWRlcyBtZXRob2QgbmFtZXMgZnJvbSBrZXl3b3JkIHByb2Nlc3NpbmdcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnXFxcXC4nICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFIH0sXG4gICAgICAgICAgeyBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJ1xcXFxzKj0nIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgRlVOQ1RJT05fUkVGLFxuICAgICAgU1RSVUNUX1RZUEVcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGdhdXNzIGFzIGRlZmF1bHQgfTtcbiJdfQ==