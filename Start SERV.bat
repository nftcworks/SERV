@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run SERV.
  pause
  exit /b 1
)

if /i "%~1"=="phone" (
  node scripts\serve.mjs --phone --open
) else (
  node scripts\serve.mjs --open
)

set "SERV_EXIT=%ERRORLEVEL%"
if not "%SERV_EXIT%"=="0" pause
exit /b %SERV_EXIT%
