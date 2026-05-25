@echo off
setlocal

set "ROOT=%~dp0"

echo Starting Job Tracker backend and frontend...

start "Job Tracker Backend" cmd /k "cd /d ""%ROOT%backend"" && node server.js"
timeout /t 2 >nul
start "Job Tracker Frontend" cmd /k "cd /d ""%ROOT%react-app"" && npm.cmd start"

echo.
echo Both services were started in separate terminals.
echo Keep both terminals open while using the app.
echo Backend health check URL: http://localhost:5000/api/health
echo Frontend URL: http://localhost:3000/login

endlocal
