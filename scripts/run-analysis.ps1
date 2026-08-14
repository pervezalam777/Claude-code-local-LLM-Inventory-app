#!/usr/bin/env pwsh

# SonarQube Analysis Runner for Windows
param(
    [switch]$NoCleanup = $false
)

Write-Host "=== SonarQube Analysis Runner (Windows) ===" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

# Step 1: Start services
Write-Host "[Step 1] Starting SonarQube and PostgreSQL..." -ForegroundColor Yellow
docker compose -f docker-compose.sonarqube.yml up -d db

Write-Host "Waiting for PostgreSQL to initialize (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

docker compose -f docker-compose.sonarqube.yml up -d sonarqube
Write-Host "Waiting for SonarQube to start (60 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Step 2: Python coverage
Write-Host ""
Write-Host "[Step 2] Running Python tests with coverage..." -ForegroundColor Yellow
Set-Location "$ProjectRoot\inventory_app"
python -m pytest --cov=app --cov-report=xml:coverage.xml --cov-report=term-missing
Set-Location $ProjectRoot

# Step 3: JS coverage
Write-Host ""
Write-Host "[Step 3] Running JavaScript tests with coverage..." -ForegroundColor Yellow
Set-Location "$ProjectRoot\inventory_ui_app"
npm run test:coverage
Set-Location $ProjectRoot

# Step 4: Generate combined report
Write-Host ""
Write-Host "[Step 4] Creating combined coverage report..." -ForegroundColor Yellow
mkdir -Path .sonarqube\combined -Force | Out-Null

python3 "$ScriptDir\generate-report.py"

# Step 5: Update historical data
Write-Host ""
Write-Host "[Step 5] Updating historical trend data..." -ForegroundColor Yellow
mkdir -Path .sonarqube\history -Force | Out-Null

python3 "$ScriptDir\update-history.py"

# Step 6: SonarQube analysis
Write-Host ""
Write-Host "[Step 6] Running SonarQube analysis..." -ForegroundColor Yellow
if (Get-Command sonar-scanner -ErrorAction SilentlyContinue) {
    sonar-scanner `
        -Dsonar.host.url=http://localhost:9000 `
        -Dsonar.login=admin `
        -Dsonar.password=admin
} else {
    Write-Host "SonarScanner not found. Install from:" -ForegroundColor Red
    Write-Host "  https://community.sonarsource.com/" -ForegroundColor Yellow
}

# Cleanup
if (-not $NoCleanup) {
    Write-Host ""
    Write-Host "[Step 7] Cleaning up..." -ForegroundColor Yellow
    docker compose -f docker-compose.sonarqube.yml down -v
}

Write-Host ""
Write-Host "=== Analysis Complete ===" -ForegroundColor Green
Write-Host "SonarQube UI: http://localhost:9000"
Write-Host "Default login: admin / admin"
Write-Host ""
Write-Host "Historical data available at:"
Write-Host "  .sonarqube\combined\coverage-report.json"
Write-Host "  .sonarqube\history\trend.json"
