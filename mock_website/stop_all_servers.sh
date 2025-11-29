#!/bin/bash

# Eula Elite Security & Transport - Server Shutdown Script
# This script safely stops all running servers

echo "🛡️  Shutting down Eula Elite Security & Transport Systems"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop server by PID file
stop_server_by_pid() {
    local pid_file=$1
    local name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            echo -e "${BLUE}Stopping $name (PID: $pid)...${NC}"
            kill $pid
            sleep 2
            if kill -0 $pid 2>/dev/null; then
                echo -e "${YELLOW}Force stopping $name...${NC}"
                kill -9 $pid 2>/dev/null
            fi
            echo -e "${GREEN}✓ $name stopped${NC}"
        else
            echo -e "${YELLOW}$name was not running${NC}"
        fi
        rm -f "$pid_file"
    fi
}

# Function to stop server by process name
stop_server_by_name() {
    local process_name=$1
    local display_name=$2
    
    local pids=$(pgrep -f "$process_name")
    if [ -n "$pids" ]; then
        echo -e "${BLUE}Stopping $display_name...${NC}"
        pkill -f "$process_name"
        sleep 2
        # Force kill if still running
        pkill -9 -f "$process_name" 2>/dev/null
        echo -e "${GREEN}✓ $display_name stopped${NC}"
    else
        echo -e "${YELLOW}$display_name was not running${NC}"
    fi
}

echo -e "${YELLOW}Stopping all Eula Elite servers...${NC}"
echo ""

# Stop servers by PID files first
stop_server_by_pid ".website-server_pid" "Website Server"
stop_server_by_pid ".admin-server_pid" "Admin Server"  
stop_server_by_pid ".asset-server_pid" "Asset Server"

# Fallback: stop by process name
stop_server_by_name "website_server.js" "Website Server (fallback)"
stop_server_by_name "admin_server.js" "Admin Server (fallback)"
stop_server_by_name "asset_server.js" "Asset Server (fallback)"

# Clean up any remaining node processes related to our servers
echo -e "${BLUE}Cleaning up remaining processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null

# Remove any remaining PID files
rm -f .website-server_pid .admin-server_pid .asset-server_pid 2>/dev/null

# Check if ports are now free
echo ""
echo -e "${BLUE}Checking port status:${NC}"

check_port_free() {
    local port=$1
    local name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "   ${RED}✗ Port $port ($name):${NC} Still in use"
    else
        echo -e "   ${GREEN}✓ Port $port ($name):${NC} Available"
    fi
}

check_port_free 3000 "Website"
check_port_free 3001 "Admin Dashboard" 
check_port_free 8080 "Asset Server"

echo ""
echo -e "${GREEN}========================================================"
echo -e "🛡️  EULA ELITE SYSTEMS SHUTDOWN COMPLETE"
echo -e "========================================================${NC}"
echo ""
echo -e "${YELLOW}All servers have been stopped.${NC}"
echo -e "${BLUE}To restart:${NC} ./start_all_servers.sh"
echo ""
echo -e "${GREEN}\"Licensed Level IV Personal Protection Officers - Standing Down\"${NC}"
echo ""