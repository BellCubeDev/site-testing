@echo off
cd %~dp0\..\site\

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

call npm install -g typescript tsc-watch
if not errorlevel 0 (
    ECHO  [101mInstalling TypeScript and TSC-Watch globally failed.[0m
    exit /b 1
)