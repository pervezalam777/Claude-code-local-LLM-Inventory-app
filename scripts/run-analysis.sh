#!/bin/bash

# Exit on error
set -e

echo "=== SonarQube Analysis Runner ==="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Navigate to project root
cd "$PROJECT_ROOT"

# Step 1: Start SonarQube services
echo "[Step 1] Starting SonarQube and PostgreSQL..."
docker compose -f docker-compose.sonarqube.yml up -d db

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to initialize (30 seconds)..."
sleep 30

docker compose -f docker-compose.sonarqube.yml up -d sonarqube
echo "Waiting for SonarQube to start (60 seconds)..."
sleep 60

# Step 2: Run Python tests with coverage
echo ""
echo "[Step 2] Running Python tests with coverage..."
cd "$PROJECT_ROOT/inventory_app"
python -m pytest --cov=app --cov-report=xml:coverage.xml --cov-report=term-missing || true
cd "$PROJECT_ROOT"

# Step 3: Run JavaScript tests with coverage
echo ""
echo "[Step 3] Running JavaScript tests with coverage..."
cd "$PROJECT_ROOT/inventory_ui_app"
npm run test:coverage || true
cd "$PROJECT_ROOT"

# Step 4: Create combined report
echo ""
echo "[Step 4] Creating combined coverage report..."
mkdir -p .sonarqube/combined
python3 scripts/generate-report.py

# Step 5: Update historical data
echo ""
echo "[Step 5] Updating historical trend data..."
python3 scripts/update-history.py

# Step 6: Run SonarQube analysis
echo ""
echo "[Step 6] Running SonarQube analysis..."
echo "Note: This requires sonar-scanner CLI to be installed"
echo ""

if command -v sonar-scanner &> /dev/null; then
    sonar-scanner \
        -Dsonar.host.url=http://localhost:9000 \
        -Dsonar.login=admin \
        -Dsonar.password=admin
else
    echo "SonarScanner not found in PATH."
    echo ""
    echo "To install sonar-scanner:"
    echo "  macOS: brew install sonar-scanner"
    echo "  Ubuntu: sudo apt-get install sonar-scanner"
    echo "  Windows: Download from https://community.sonarsource.com/"
fi

# Cleanup
echo ""
echo "[Step 7] Cleaning up..."
docker compose -f docker-compose.sonarqube.yml down -v

echo ""
echo "=== Analysis Complete ==="
echo "SonarQube UI: http://localhost:9000"
echo "Default login: admin / admin"
echo ""
echo "Historical data available at:"
echo "  .sonarqube/combined/coverage-report.json"
echo "  .sonarqube/history/trend.json"
