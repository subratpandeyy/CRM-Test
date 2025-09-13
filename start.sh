#!/bin/bash

# Multi-Tenant CRM Startup Script

echo "Starting Multi-Tenant CRM System..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "PostgreSQL is not running. Please start PostgreSQL service."
    exit 1
fi

echo "All prerequisites are met. Starting the application..."

# Start the backend
echo "Starting Spring Boot backend..."
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 30

# Start the frontend
echo "Starting React frontend..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!

echo "Application started successfully!"
echo "Backend: http://localhost:8090"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "Application stopped."
