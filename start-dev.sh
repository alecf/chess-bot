#!/bin/bash

# Start both frontend and backend development servers

echo "Starting Chess Bot development servers..."

# Start backend in background
echo "Starting Python backend server..."
cd backend
uv run python main.py &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo "Starting Next.js frontend server..."
npm run dev &
FRONTEND_PID=$!

echo "Backend server started with PID: $BACKEND_PID"
echo "Frontend server started with PID: $FRONTEND_PID"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 