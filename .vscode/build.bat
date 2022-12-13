@echo off
cd %~dp0..\site

:: Batch script assumes NPM and RubyGems are installed
ECHO.
ECHO.
ECHO [36mMoving non-JS files to output...[0m
ECHO.

robocopy src\ ..\_generated\ts_out\ /s /purge /xf *.js *.ts
if not errorlevel 0 (
    ECHO  [101mCopying files to ts_out\ failed.[0m
    exit /b 1
)
ECHO.
ECHO.
ECHO [36mCompiling TypeScript files...[0m
ECHO.

set "minifyDir=..\_generated\ts_out\"

call npx tsc --build --verbose tsconfig.json
if not errorlevel 0 (
    ECHO  [101mTypeScript compilation failed ^(for reasons other than compile errors!^).[0m
    exit /b 1
)

ECHO.
ECHO.
ECHO [36mMinifying files...[0m
ECHO.

call node "%~dp0\..\site\minify.mjs"
if not errorlevel 0 (
    ECHO  [101mMinification failed.[0m
    exit /b 1
)

ECHO.
ECHO.
ECHO [36mBuilding site...[0m
ECHO.
call bundle exec jekyll build --config _config.yml                --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --unpublished --safe --trace
