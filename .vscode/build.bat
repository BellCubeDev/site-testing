@echo off
cd site

:: Batch script assumes NPM and RubyGems are installed

ECHO ^%1 = '%1', ^%2 = '%2'
ECHO.
ECHO.
ECHO [36mInstalling Ruby gem dependencies...[0m
ECHO.
del ..\_generated\* /F /S /Q
if not errorlevel 0 (
    ECHO  [101mDeleting previously-generated files failed.[0m
    exit /b 1
)

ECHO.
ECHO.
ECHO [36mInstalling Node package dependencies...[0m
ECHO.
call npm install
if not errorlevel 0 (
    ECHO  [101mNPM's package install task failed.[0m
    exit /b 1
)

ECHO.
ECHO.
ECHO [36mInstalling Ruby gem dependencies...[0m
ECHO.
call bundle install
if not errorlevel 0 (
    ECHO  [101mBundlr's package install task failed.[0m
    exit /b 1
)


if not "%~2" == "testing" (
    ECHO.
    ECHO.
    ECHO [36mInstalling minifiers...[0m
    ECHO.
    call npm install minify-all-js -g
    if not errorlevel 0 (
        ECHO  [101mInstalling the Miniy All JavaScript package failed.[0m
        exit /b 1
    )

    call npm install html-minifier-terser -g
    if not errorlevel 0 (
        ECHO  [101mInstalling the HTML Minifier package failed.[0m
        exit /b 1
    )
)


ECHO.
ECHO.
ECHO [36mCopying files to ts_out...[0m
ECHO.
call robocopy src\ ..\_generated\ts_out\ /s /purge /xf *.js *.ts
if not errorlevel 0 (
    ECHO  [101mCopying files to ts_out\ failed.[0m
    exit /b 1
)


ECHO.
ECHO.
ECHO [36mCompiling TypeScript files...[0m
ECHO.
if "%~1" == "serve" (
    call npm install -g typescript tsc-watch
    start "TypeScript Compiler" /min "%~dp0\watch.bat"
) else (
    call npx tsc --build --verbose tsconfig.json && exit
)
if not errorlevel 0 (
    ECHO  [101mTypeScript compilation failed ^(for reasons other than compile errors!^).[0m
    exit /b 1
)

timeout /t 5

if not "%~2" == "testing" and not "%~1" == "serve" (
    ECHO.
    ECHO.
    ECHO [36mMinifying JavaScript files...[0m
    ECHO.
    call npx minify-all-js ..\_generated\ts_out\ -j
)

if not "%~3" == "" (
    start %~3
)


if "%~1" == "serve" (
    ECHO.
    ECHO.
    ECHO [36mServing site on the local network using Jekyll's serve command...[0m
    ECHO.
    call bundle exec jekyll serve --config _config.yml --host 0.0.0.0 --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --unpublished --safe --trace
) else (
    ECHO.
    ECHO.
    ECHO [36mBuilding site...[0m
    ECHO.
    call bundle exec jekyll build --config _config.yml                --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --unpublished --safe --trace
)
