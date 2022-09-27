::@echo off
cd "%~dp0\..\site\"
call npx tsc-watch --build --verbose --onCompilationStarted "call robocopy src\ ..\_generated\ts_out\ /s /xf *.js *.ts" --onCompilationComplete "node minify.mjs && title TypeScript Compiler" tsconfig.json
%0 %*
exit /b
