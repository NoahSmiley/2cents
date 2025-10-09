@echo off
echo Starting 2cents Budget App...
echo.
echo Starting Vite dev server...
start "Vite Dev Server" cmd /k "cd /d %~dp0 && npm run dev"

echo Waiting for Vite to start...
timeout /t 5 /nobreak >nul

echo Starting Electron...
start "2cents App" cmd /k "cd /d %~dp0 && npx electron ."

echo.
echo Both windows should now be open!
echo - Vite Dev Server window
echo - Electron App window
echo.
echo To stop: Close both terminal windows
