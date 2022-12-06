cd $PSScriptRoot\..\site

Write-Host
Write-Host
Write-Host "Removing previously-generated files..." -ForegroundColor cyan
Write-Host
try {
    del ..\_generated\* /F /S /Q
} catch {
    Write-Host  "Deleting previously-generated files failed." -ForegroundColor red
    exit /b 1
}

Write-Host
Write-Host
Write-Host "Copying existing files to ts_out..." -ForegroundColor cyan
Write-Host
try {
    robocopy src\ ..\_generated\ts_out\ /s /purge /xf *.js *.ts
} catch {
    Write-Host  "Copying files to ts_out\ failed." -ForegroundColor red
    exit /b 1
}

function startWatcher {
    $env:minifyDir = "..\_generated\ts_out\"
    $env:doInlineSources = "true"

    try {
        npx tsc-watch --build --verbose --onCompilationStarted "call robocopy src\ ..\_generated\ts_out\ /s /xf *.js *.ts" --onCompilationComplete "node minify.mjs" tsconfig.json
    } catch {}
}

# startWatcher in a while loop
while ($true) {
    startWatcher
    timeout /t 5 /nobreak
}

exit /b 1
