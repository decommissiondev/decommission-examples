@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Install Node.js 22+ & exit /b 1)
where npm >nul 2>nul || (echo Install npm & exit /b 1)
call npx --no-install wrangler --version >nul 2>nul
if errorlevel 1 (
  call npm install
  if errorlevel 1 exit /b 1
)
call npm test
if errorlevel 1 exit /b 1
node dc-cloudflare.cjs
if errorlevel 1 exit /b 1
node dc-secrets.js --interactive
if errorlevel 1 exit /b 1
call npx --no-install wrangler deploy
if errorlevel 1 exit /b 1
