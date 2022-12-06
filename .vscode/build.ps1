cd $PSScriptRoot\..\site

# Batch script assumes NPM and RubyGems are installed

Write-Host
Write-Host
Write-Host "Compiling TypeScript files..." -ForegroundColor cyan
Write-Host

$env:minifyDir = "..\_generated\ts_out\"

try {
    npx tsc --build --verbose tsconfig.json
} catch {
    Write-Host "TypeScript compilation failed (for reasons other than compile errors!)." -ForegroundColor red
    exit 1
}

Write-Host
Write-Host
Write-Host "Minifying JavaScript files..." -ForegroundColor cyan
Write-Host

try {
    node "$PSScriptRoot\..\site\minify.mjs"
} catch {
    Write-Host "Minification failed." -ForegroundColor red
    exit 1
}


Write-Host
Write-Host
Write-Host "Building site..."
Write-Host
bundle exec jekyll build --config _config.yml                --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --unpublished --safe --trace
