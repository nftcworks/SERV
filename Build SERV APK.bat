@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-android.ps1" %*
set "SERV_BUILD_STATUS=%ERRORLEVEL%"
pause
exit /b %SERV_BUILD_STATUS%
