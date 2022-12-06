cd $PSScriptRoot\..\site

while ($true) {

    Write-Host
    Write-Host
    Write-Host "Serving Jekyll site..." -ForegroundColor cyan
    Write-Host

    try{
        bundle exec jekyll serve --config _config.yml --host 0.0.0.0 --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --unpublished --safe --trace
    } catch {}
    
    Write-Host "Jekyll serve failed. Retrying in 10 seconds..." -ForegroundColor red
    Write-Host
    Write-Host
    Write-Host
    Write-Host
    Write-Host
    Write-Host

    timeout /t 10 >nul
}
