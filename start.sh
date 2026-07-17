#!/bin/bash

# GreenCart - Quick Start Script
# This script starts both frontend and backend servers

echo "🌿 Welcome to GreenCart!"
echo "Starting both frontend and backend..."
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+."
    exit 1
fi

# Function to kill processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $backend_pid $frontend_pid 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start backend
echo "📦 Starting backend server..."
cd backend
npm run dev &
backend_pid=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
frontend_pid=$!
cd ..

echo ""
echo "✅ GreenCart is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
