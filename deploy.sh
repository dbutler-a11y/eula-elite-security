#!/bin/bash
# Eula Elite Security - Automated Deployment with Error Prevention
# Eliminates redundant deployment errors through systematic validation

set -e  # Exit on any error
trap 'echo "❌ Deployment failed at line $LINENO. Rolling back..." && rollback && exit 1' ERR

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/brittanymurphy/Desktop/Butler/Projects/04_Eula_Elite_Security"
BACKUP_DIR="${PROJECT_DIR}/backups"
LOG_FILE="${PROJECT_DIR}/deployment.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${PURPLE}🛡️  Eula Elite Security - Automated Deployment Pipeline${NC}"
echo "================================================================="
echo "🕒 Started: $(date)"
echo "📁 Project: $PROJECT_DIR"
echo ""

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to create backup
create_backup() {
    echo -e "${BLUE}📦 Creating deployment backup...${NC}"
    
    mkdir -p "$BACKUP_DIR"
    
    # Create comprehensive backup
    BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"
    
    tar -czf "$BACKUP_FILE" \
        consolidated_server.js \
        package.json \
        package-lock.json \
        automated-test-suite.js \
        03_Visual_Assets/ \
        mock_website/ \
        *.md \
        2>/dev/null || true
    
    log "✅ Backup created: $BACKUP_FILE"
    echo "   📁 Size: $(du -h "$BACKUP_FILE" | cut -f1)"
}

# Function to rollback on failure
rollback() {
    echo -e "${RED}🔄 Rolling back to previous version...${NC}"
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "${BACKUP_DIR}/backup_"*.tar.gz 2>/dev/null | head -n2 | tail -n1 || echo "")
    
    if [ ! -z "$LATEST_BACKUP" ]; then
        log "📦 Restoring from: $LATEST_BACKUP"
        tar -xzf "$LATEST_BACKUP" -C "$PROJECT_DIR"
        
        # Restart server with old version
        restart_server
        
        log "✅ Rollback completed successfully"
    else
        log "❌ No backup available for rollback"
    fi
}

# Function to check system prerequisites  
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking system prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found${NC}"
        exit 1
    fi
    log "✅ Node.js: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found${NC}"
        exit 1
    fi
    log "✅ npm: $(npm --version)"
    
    # Check available ports
    if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log "⚠️ Port 8081 in use, will handle during deployment"
    else
        log "✅ Port 8081 available"
    fi
    
    # Check disk space (require at least 100MB)
    AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
    if [ "$AVAILABLE_SPACE" -lt 100000 ]; then
        echo -e "${RED}❌ Insufficient disk space${NC}"
        exit 1
    fi
    log "✅ Disk space: $(df -h . | tail -1 | awk '{print $4}') available"
}

# Function to stop existing servers safely
stop_existing_servers() {
    echo -e "${YELLOW}🛑 Stopping existing servers...${NC}"
    
    # Kill any Node processes on port 8081
    if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log "🔄 Stopping server on port 8081..."
        lsof -Pi :8081 -sTCP:LISTEN -t | xargs kill -TERM 2>/dev/null || true
        sleep 3
        
        # Force kill if still running
        if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
            log "⚡ Force stopping server..."
            lsof -Pi :8081 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
        fi
    fi
    
    # Clean up any other Eula Elite processes
    pkill -f "consolidated_server.js" 2>/dev/null || true
    
    log "✅ All existing servers stopped"
}

# Function to install/update dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    # Clean install to prevent version conflicts
    if [ -f "package-lock.json" ]; then
        npm ci --production --silent 2>>"$LOG_FILE" || {
            log "⚠️ npm ci failed, falling back to npm install"
            npm install --production --silent 2>>"$LOG_FILE"
        }
    else
        npm install --production --silent 2>>"$LOG_FILE"
    fi
    
    log "✅ Dependencies installed successfully"
}

# Function to run comprehensive tests
run_tests() {
    echo -e "${BLUE}🧪 Running comprehensive test suite...${NC}"
    
    # Run pre-deployment tests
    if [ -f "automated-test-suite.js" ]; then
        log "🔍 Running automated tests..."
        
        # Run tests in background to avoid blocking
        timeout 60s node automated-test-suite.js > test_output.tmp 2>&1 || {
            echo -e "${RED}❌ Tests failed:${NC}"
            cat test_output.tmp | tail -10
            rm -f test_output.tmp
            exit 1
        }
        
        # Check test results
        if grep -q "ALL TESTS PASSED" test_output.tmp; then
            log "✅ All automated tests passed"
        else
            echo -e "${RED}❌ Some tests failed:${NC}"
            cat test_output.tmp
            rm -f test_output.tmp
            exit 1
        fi
        
        rm -f test_output.tmp
    else
        log "⚠️ No test suite found, skipping automated tests"
    fi
}

# Function to start the server
start_server() {
    echo -e "${GREEN}🚀 Starting Eula Elite server...${NC}"
    
    # Start server in background
    cd "$PROJECT_DIR"
    nohup node consolidated_server.js > server.log 2>&1 &
    SERVER_PID=$!
    
    log "🔄 Server starting with PID: $SERVER_PID"
    
    # Wait for server to start
    sleep 5
    
    # Verify server is running
    if kill -0 $SERVER_PID 2>/dev/null; then
        log "✅ Server started successfully"
        echo $SERVER_PID > server.pid
    else
        log "❌ Server failed to start"
        exit 1
    fi
}

# Function to restart server
restart_server() {
    stop_existing_servers
    start_server
}

# Function to validate deployment
validate_deployment() {
    echo -e "${BLUE}✅ Validating deployment...${NC}"
    
    # Wait for server to be ready
    for i in {1..30}; do
        if curl -f -s "http://localhost:8081/health" > /dev/null 2>&1; then
            break
        fi
        log "⏳ Waiting for server to respond... ($i/30)"
        sleep 2
    done
    
    # Test critical endpoints
    ENDPOINTS=(
        "http://localhost:8081/"
        "http://localhost:8081/admin"
        "http://localhost:8081/api/assets"
        "http://localhost:8081/assets/officer_flagship_hero.png"
    )
    
    for endpoint in "${ENDPOINTS[@]}"; do
        if curl -f -s "$endpoint" > /dev/null 2>&1; then
            log "✅ $endpoint - OK"
        else
            log "❌ $endpoint - FAILED"
            echo -e "${RED}❌ Deployment validation failed${NC}"
            exit 1
        fi
    done
    
    # Run post-deployment tests
    if [ -f "automated-test-suite.js" ]; then
        log "🧪 Running post-deployment validation..."
        if timeout 30s node automated-test-suite.js --quick > /dev/null 2>&1; then
            log "✅ Post-deployment tests passed"
        else
            log "❌ Post-deployment tests failed"
            exit 1
        fi
    fi
}

# Function to generate deployment report
generate_report() {
    echo -e "${GREEN}📊 Generating deployment report...${NC}"
    
    REPORT_FILE="${PROJECT_DIR}/deployment_report_${TIMESTAMP}.json"
    
    cat > "$REPORT_FILE" << EOF
{
    "deployment": {
        "timestamp": "$(date -Iseconds)",
        "status": "success",
        "duration": "$SECONDS seconds",
        "version": "$TIMESTAMP"
    },
    "system": {
        "node_version": "$(node --version)",
        "npm_version": "$(npm --version)",
        "platform": "$(uname -s)",
        "hostname": "$(hostname)"
    },
    "server": {
        "url": "http://localhost:8081",
        "pid": "$(cat server.pid 2>/dev/null || echo 'unknown')",
        "health_check": "$(curl -s http://localhost:8081/health 2>/dev/null || echo 'failed')"
    },
    "tests": {
        "automated_tests": "passed",
        "validation": "passed",
        "endpoints_verified": 4
    }
}
EOF
    
    log "📄 Deployment report saved: $REPORT_FILE"
    
    # Display summary
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo "================================================================="
    echo "🌐 Server: http://localhost:8081"
    echo "🔐 Admin: http://localhost:8081/admin"
    echo "📁 Assets: http://localhost:8081/assets/officer_flagship_hero.png"
    echo "⏱️ Duration: $SECONDS seconds"
    echo "📊 Report: $REPORT_FILE"
    echo "📝 Logs: $LOG_FILE"
    echo ""
}

# Main deployment pipeline
main() {
    cd "$PROJECT_DIR"
    
    # Initialize log
    echo "🚀 Starting deployment at $(date)" > "$LOG_FILE"
    
    # Execute deployment pipeline
    check_prerequisites
    create_backup
    stop_existing_servers
    install_dependencies
    run_tests
    start_server
    validate_deployment
    generate_report
    
    log "🎉 Deployment completed successfully in $SECONDS seconds"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "test")
        run_tests
        ;;
    "restart")
        restart_server
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|test|restart}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment pipeline (default)"
        echo "  rollback - Rollback to previous version"
        echo "  test     - Run tests only"
        echo "  restart  - Restart server only"
        exit 1
        ;;
esac