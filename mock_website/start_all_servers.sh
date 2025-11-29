#!/bin/bash

# Eula Elite Security & Transport - Complete Server Startup Script
# This script starts all servers for the mock website and admin dashboard

echo "🛡️  Starting Eula Elite Security & Transport Mock Systems"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GOLD='\033[0;33m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $port is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to start server in background
start_server() {
    local script=$1
    local name=$2
    local port=$3
    
    echo -e "${BLUE}Starting $name on port $port...${NC}"
    
    if check_port $port; then
        node $script &
        local pid=$!
        echo $pid > ".${name,,}_pid"
        echo -e "${GREEN}✓ $name started (PID: $pid)${NC}"
    else
        echo -e "${RED}✗ Cannot start $name - port $port is busy${NC}"
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the mock_website directory${NC}"
    exit 1
fi

# Kill any existing servers
echo -e "${YELLOW}Cleaning up any existing servers...${NC}"
pkill -f "website_server.js" 2>/dev/null
pkill -f "admin_server.js" 2>/dev/null
pkill -f "asset_server.js" 2>/dev/null
sleep 2

# Start Asset Server (from parent directory)
echo -e "${GOLD}🎯 Starting Asset Server (Port 8080)...${NC}"
if [ -f "../asset_server.js" ]; then
    cd ..
    start_server "asset_server.js" "Asset-Server" 8080
    cd mock_website
else
    echo -e "${YELLOW}Warning: Asset server not found, continuing without it${NC}"
fi

# Start Website Server
echo -e "${GOLD}🌐 Starting Main Website Server (Port 3000)...${NC}"
start_server "servers/website_server.js" "Website-Server" 3000

# Start Admin Server  
echo -e "${GOLD}🔐 Starting Admin Dashboard Server (Port 3001)...${NC}"
start_server "servers/admin_server.js" "Admin-Server" 3001

# Wait a moment for servers to start
sleep 3

echo ""
echo -e "${GREEN}=================================================="
echo -e "🛡️  EULA ELITE SECURITY & TRANSPORT SYSTEMS ACTIVE"
echo -e "==================================================${NC}"
echo ""
echo -e "${GOLD}🌟 MAIN WEBSITE (Public) - Port 3000${NC}"
echo -e "   ${BLUE}Homepage:${NC}     http://localhost:3000"
echo -e "   ${BLUE}About:${NC}        http://localhost:3000/about.html"
echo -e "   ${BLUE}Services:${NC}     http://localhost:3000/services.html"  
echo -e "   ${BLUE}Contact:${NC}      http://localhost:3000/contact.html"
echo -e "   ${BLUE}Blog:${NC}         http://localhost:3000/blog.html"
echo ""
echo -e "${GOLD}🔐 ADMIN DASHBOARD (Internal) - Port 3001${NC}"
echo -e "   ${BLUE}Dashboard:${NC}    http://localhost:3001"
echo -e "   ${BLUE}Clients:${NC}      http://localhost:3001/clients.html"
echo -e "   ${BLUE}Bookings:${NC}     http://localhost:3001/bookings.html"
echo -e "   ${BLUE}PPO Mgmt:${NC}     http://localhost:3001/ppo.html"
echo -e "   ${BLUE}Content:${NC}      http://localhost:3001/content.html"
echo ""
echo -e "${GOLD}🎯 ASSET SERVER (Media) - Port 8080${NC}"
echo -e "   ${BLUE}Assets:${NC}       http://localhost:8080"
echo -e "   ${BLUE}Images:${NC}       http://localhost:8080/images/"
echo -e "   ${BLUE}Brand:${NC}        http://localhost:8080/logo-mark.svg"
echo ""
echo -e "${GREEN}=================================================="
echo -e "SERVICE FEATURES & FUNCTIONALITY:"
echo -e "==================================================${NC}"
echo ""
echo -e "${YELLOW}✅ Main Website Features:${NC}"
echo "   • Complete responsive design with brand colors"
echo "   • Interactive service calculator ($3K/$12K/$25K packages)"  
echo "   • Secure contact forms with consultation booking"
echo "   • Blog with automated content preview"
echo "   • Emergency response simulation"
echo "   • Mobile-friendly navigation"
echo ""
echo -e "${YELLOW}✅ Admin Dashboard Features:${NC}"
echo "   • Real-time operations monitoring"
echo "   • Client management system"
echo "   • Booking system with PPO assignment"
echo "   • Emergency response triggers"
echo "   • Revenue and performance analytics"
echo "   • Content management system"
echo ""
echo -e "${YELLOW}✅ Brand Integration:${NC}"
echo "   • Fortune 500 visual design system"  
echo "   • Onyx Black & Champagne Gold theme"
echo "   • Licensed Level IV PPO positioning"
echo "   • Houston elite market targeting"
echo "   • Professional security imagery"
echo ""
echo -e "${RED}🚨 EMERGENCY RESPONSE SIMULATION:${NC}"
echo -e "   ${BLUE}Hotline:${NC}      (713) 555-1234"
echo -e "   ${BLUE}Response:${NC}     <15 minute deployment"
echo -e "   ${BLUE}Coverage:${NC}     Greater Houston Area"
echo ""
echo -e "${GREEN}=================================================="
echo -e "SYSTEM STATUS & HEALTH CHECKS:"
echo -e "==================================================${NC}"

# Check server health
echo -e "${BLUE}Checking server health...${NC}"

# Test Website Server
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ Website Server:${NC} Operational"
else
    echo -e "   ${RED}✗ Website Server:${NC} Not responding"
fi

# Test Admin Server  
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ Admin Server:${NC} Operational"
else
    echo -e "   ${RED}✗ Admin Server:${NC} Not responding"
fi

# Test Asset Server
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ Asset Server:${NC} Operational"
else
    echo -e "   ${YELLOW}⚠ Asset Server:${NC} May not be running"
fi

echo ""
echo -e "${GREEN}=================================================="
echo -e "NEXT STEPS FOR PLANNING:"
echo -e "==================================================${NC}"
echo ""
echo -e "${YELLOW}1. Website Navigation:${NC}"
echo "   • Click through all main pages"
echo "   • Test service calculator functionality"
echo "   • Try contact forms and consultation booking"
echo "   • Review mobile responsiveness"
echo ""
echo -e "${YELLOW}2. Admin Dashboard:${NC}"  
echo "   • Explore operations overview"
echo "   • Test client management features"
echo "   • Review booking system workflow"
echo "   • Try emergency response simulation"
echo ""
echo -e "${YELLOW}3. Brand Evaluation:${NC}"
echo "   • Assess visual design consistency"
echo "   • Review messaging and positioning"  
echo "   • Evaluate user experience flow"
echo "   • Test cross-page navigation"
echo ""
echo -e "${RED}To stop all servers:${NC} ./stop_all_servers.sh"
echo -e "${BLUE}For logs:${NC} tail -f *.log (if logging enabled)"
echo ""
echo -e "${GOLD}🛡️  Licensed Level IV Personal Protection Officers Standing By${NC}"
echo -e "${GREEN}   \"Where Elite Travel Meets Absolute Protection\"${NC}"
echo ""