@echo off

title TypeScript Compiler

ECHO.
ECHO.
ECHO [36mRemoving previously-generated files...[0m
ECHO.
del ..\_generated\* /F /S /Q
if not errorlevel 0 (
    ECHO  [101mDeleting previously-generated files failed.[0m
    exit /b 1
)

ECHO.
ECHO.
ECHO [36mCopying existing files to ts_out...[0m
ECHO.
call robocopy src\ ..\_generated\ts_out\ /s /purge /xf *.js *.ts
if not errorlevel 0 (
    ECHO  [101mCopying files to ts_out\ failed.[0m
    exit /b 1
)

set "minifyDir=..\_generated\ts_out\"
set "doInlineSources=true"

:watch

title TypeScript Compiler
cd %~dp0\..\site\
call npx tsc-watch --build --verbose --onCompilationStarted "title TypeScript Compiler && call robocopy src\ ..\_generated\ts_out\ /s /xf *.js *.ts" --onCompilationComplete "title TypeScript Compiler && node minify.mjs && title TypeScript Compiler" tsconfig.json

goto :watch
exit /b 1
