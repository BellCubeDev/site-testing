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
call robocopy src\ ..\_generated\ts_out\ /s /purge
if not errorlevel 0 (
    ECHO  [101mCopying files to ts_out\ failed.[0m
    exit /b 1
)


ECHO.
ECHO.
ECHO [36mDeleting JavaScript and TypeScript files in ts_out...[0m
ECHO.
call del ..\_generated\ts_out\*.js  ..\_generated\ts_out\*.ts /s /q
if not errorlevel 0 (
    ECHO  [101mmDeleting JavaScript and TypeScript files from ts_out failed.[0m
    exit /b 1
)


ECHO.
ECHO.
ECHO [36mCompiling TypeScript files...[0m
ECHO.
call npx tsc --build tsconfig.json
if not errorlevel 0 (
    ECHO  [101mTypeScript compilation failed ^(for reasons other than compile errors!^).[0m
    exit /b 1
)

if not "%~2" == "testing" (
    ECHO.
    ECHO.
    ECHO [36mMinifying JavaScript files...[0m
    ECHO.
    call minify-all-js ..\_generated\ts_out\ -j
)


ECHO.
ECHO.
ECHO [36mBuilding Jekyll site...[0m
ECHO.
call bundle exec jekyll build --config _config.yml --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --safe --trace
if not errorlevel 0 (
    ECHO  [101mJekyll build failed.[0m
    exit /b 1
)

if not "%~2" == "testing" (
    ECHO.
    ECHO.
    ECHO [36mMinifying HTML-like files...[0m
    ECHO.
    :: HTML
    call html-minifier-terser --collapse-boolean-attributes --collapse-whitespace --conservative-collapse --decode-entities --minify-urls true --no-newlines-before-tag-close --process-conditional-comments --quote-character " --remove-attribute-quotes --remove-comments --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --sort-attributes --sort-class-name ^
        --input-dir _jekyll-out --output-dir _minify-HTML-out --file-ext html

    :: SVGs
    call html-minifier-terser --case-sensitive --collapse-boolean-attributes --collapse-whitespace --conservative-collapse --decode-entities --minify-urls true --no-newlines-before-tag-close --process-conditional-comments --quote-character " --remove-attribute-quotes --remove-comments --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --sort-attributes --sort-class-name ^
        --input-dir _jekyll-out --output-dir _minify-HTML-out --file-ext svg

    :: XML
    call html-minifier-terser --case-sensitive --collapse-boolean-attributes --collapse-whitespace --conservative-collapse --decode-entities --minify-urls true --no-newlines-before-tag-close --process-conditional-comments --quote-character " --remove-attribute-quotes --remove-comments --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --sort-attributes --sort-class-name ^
        --input-dir _jekyll-out --output-dir _minify-HTML-out --file-ext xml
)

if not "%~3" == "" (
    start %~3
)


if "%~1" == "serve" (
    ECHO.
    ECHO.
    ECHO [36mServing site on the local network using Jekyll's serve command...[0m
    ECHO.
    md ..\_generated\__
    call bundle exec jekyll serve --config _config.yml --skip-initial-build --host 0.0.0.0 --source ..\_generated\__ --destination ..\_generated\_jekyll-out --safe
)
