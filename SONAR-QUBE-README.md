# SonarQube Static Code Analysis

This directory contains configuration files for setting up local SonarQube static code analysis.

## Quick Start

### Prerequisites

- Docker Engine v20+
- Docker Compose
- sonar-scanner CLI (optional, for direct analysis)

### Setup

1. **Start SonarQube services:**
   ```bash
   docker compose -f docker-compose.sonarqube.yml up -d
   ```

2. **Wait for initialization** (about 90 seconds total):
   - PostgreSQL: ~30 seconds
   - SonarQube: ~60 seconds

3. **Access the UI:**
   - URL: http://localhost:9000
   - Default credentials: `admin` / `admin`

4. **Generate Analysis Report:**
   ```bash
   # Linux/macOS
   ./scripts/run-analysis.sh

   # Windows
   .\scripts\run-analysis.ps1
   ```

## Project Structure

```
.sonarqube/
├── cache/              # Scanner cache (auto-generated)
├── logs/               # SonarQube logs
├── combined/           # Merged coverage reports
│   └── coverage-report.json
└── history/            # Historical trend data
    └── trend.json      # Time-series metrics

scripts/
├── run-analysis.sh     # Main analysis runner (Linux/macOS)
├── run-analysis.ps1    # Main analysis runner (Windows)
├── generate-report.py  # Combined report generator
└── update-history.py   # Historical data updater
```

## Configuration Files

- `docker-compose.sonarqube.yml` - Docker services definition
- `inventory_app/sonar-project.properties` - Python project config
- `inventory_ui_app/sonar-project.properties` - JS project config
- `.sonarcloud/` - Scanner configuration directory

## Metrics Tracked

### Python Backend
- **Code Coverage** (pytest-cov)
- **Bugs & Vulnerabilities**
- **Code Smells**
- **Duplicated Lines**

### JavaScript Frontend
- **Statement Coverage**
- **Branch Coverage**
- **Function Coverage**
- **Complexity Metrics**

## Viewing Historical Trends

The `trend.json` file contains time-series data for coverage metrics. You can visualize this with:

```bash
python3 -c "
import json
with open('.sonarqube/history/trend.json') as f:
    data = json.load(f)
for entry in data['entries']:
    print(f\"{entry['date']}: Python={entry['metrics']['python_line_coverage']:.1f}%\")
"
```

## Troubleshooting

### SonarQube won't start
- Check if ports 9000 or 5432 are already in use
- Increase Docker memory allocation to at least 4GB

### Permission denied errors
- On Linux/macOS: `chmod +x scripts/*.sh`

### Scanner not found
- Install sonar-scanner from https://community.sonarsource.com/

## Customization

To add new quality gates or rules:
1. Log in to SonarQube UI as admin
2. Navigate to **Quality Gates** / **Quality Profiles**
3. Create custom rules for Python/TypeScript

## Maintenance Tasks

### Monthly
- Review historical trends for coverage degradation
- Clean up old analysis data from SonarQube UI

### Per-Change
- Run analysis before merging to main branch
- Ensure coverage doesn't drop below threshold (e.g., 80%)

### Quarterly
- Update SonarQube image: `docker pull sonarqube:community`
- Review and adjust exclusions in `sonar-project.properties`

## Future Enhancements

1. **CI/CD Integration:** Add to GitHub Actions workflow
2. **Quality Gates:** Configure thresholds for automatic blocking
3. **Custom Rules:** Add project-specific quality rules
4. **Dashboard:** Create shared visualization of historical trends
5. **Security Scanning:** Integrate with SonarQube's security features
