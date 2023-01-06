cd $PSScriptRoot\..\site

Write-Host
Write-Host
Write-Host "Installing Node package dependencies..." -ForegroundColor cyan
Write-Host
try {
    npm install
} catch {
    Write-Host "NPM's package install task failed." -ForegroundColor red
    Write-Host $_
    exit 1
}

try {
    npm install -g typescript tsc-watch
} catch {
    Write-Host "Installing TypeScript and TSC-Watch globally failed." -ForegroundColor red
    Write-Host $_
    exit 1
}

Write-Host
Write-Host
Write-Host "Installing Ruby gem dependencies..." -ForegroundColor cyan
Write-Host
try {
    bundle install
} catch {
    Write-Host "Bundlr's package install task failed." -ForegroundColor red
    Write-Host $_
    exit 1
}
