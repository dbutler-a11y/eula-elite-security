#!/bin/bash

# Eula Elite Security Asset Server Launcher
echo "🎨 Starting Eula Elite Brand Asset Management Server..."

cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Launching asset server..."
echo "📁 Directory: $(pwd)"
echo "🌐 Access your assets at: http://localhost:8080"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

node asset_server.js