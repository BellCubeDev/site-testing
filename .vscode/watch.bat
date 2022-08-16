::@echo off
npx tsc-watch --build --verbose --onCompilationStarted "call robocopy src\ ..\_generated\ts_out\ /s /xf *.js *.ts" --onCompilationComplete "title TypeScript Compiler" tsconfig.json
"%~0"
