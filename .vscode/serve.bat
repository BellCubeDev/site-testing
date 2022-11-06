@echo off
cd %~dp0..\site

:serve

ECHO.
ECHO.
ECHO [36mServing Jekyll site...[0m
ECHO.

call bundle exec jekyll serve --config _config.yml --host 0.0.0.0 --source ..\_generated\ts_out\ --destination ..\_generated\_jekyll-out\ --verbose --unpublished --safe --trace

ECHO. [101mJekyll serve failed. Retrying in 10 seconds...[0m
ECHO.
ECHO.
ECHO.
ECHO.
ECHO.
ECHO.
timeout /t 10 >nul

goto :serve
