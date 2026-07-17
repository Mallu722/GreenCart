@echo off
REM GreenCart - Quick Start Script for Windows
REM This script starts both frontend and backend servers

echo.
echo 🌿 Welcome to GreenCart!
echo Starting both frontend and backend...
echo.

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16+.
    exit /b 1
)

REM Start backend in a new window
echo 📦 Starting backend server...
start "GreenCart Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new window
echo 🎨 Starting frontend server...
start "GreenCart Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ GreenCart is running!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.
pause
