cd site

:: Batch script assumes NPM and RubyGems are installed

ECHO ^%1 = '%1', ^%2 = '%2'
ECHO.
ECHO.
ECHO [36mInstalling Ruby gem dependencies...[0m
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

call robocopy src\ ..\_generated\ts_out\ /s /purge
if not errorlevel 0 (
    ECHO  [101mCopying files to ts_out\ failed.[0m
    exit /b 1
)

call npx tsc --build tsconfig.json
if not errorlevel 0 (
    ECHO  [101mTypeScript compilation failed.[0m
    exit /b 1
)

call del ..\_generated\ts_out\*.ts /s /q
if not errorlevel 0 (
    ECHO  [101mDeleting typescript files from the destination failed.[0m
    exit /b 1
)

if not "%~2" == "testing" (
    call minify-all-js ..\_generated\ts_out\ -j
)

call jekyll build --config _config.yml --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --safe --trace
if not errorlevel 0 (
    ECHO  [101mJekyll build failed.[0m
    exit /b 1
)

if not "%~2" == "testing" (
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

if "%~1" == "serve" (
    md ..\_generated\__
    call jekyll serve --config _config.yml --skip-initial-build --host 0.0.0.0 --source ..\_generated\__ --destination ..\_generated\_jekyll-out --safe
)
