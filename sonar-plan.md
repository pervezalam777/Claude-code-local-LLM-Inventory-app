# SonarQube Setup Plan for Inventory Management System

## Overview

This plan outlines the steps to set up a local SonarQube static code analysis environment using Docker. The system will analyze both Python (FastAPI backend) and TypeScript/React frontend code, track quality metrics over time, and generate coverage reports.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Docker Network: sonar-network                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐      ┌──────────────────┐                      │
│  │   SonarQube      │◄────►│   PostgreSQL     │                      │
│  │   (Port: 9000)   │      │   (Port: 5432)   │                      │
│  └──────────────────┘      └──────────────────┘                      │
│           ▲                                                          │
│           │                                                          │
│           │                                                          │
│  ┌────────▼─────────┐                                               │
│  │  SonarScanner    │                                               │
│  │  (Python/JS)     │                                               │
│  └────────┬─────────┘                                               │
│           │                                                          │
│     ┌─────┴─────┐                                                    │
│     │           │                                                    │
│  ┌──▼──┐    ┌───▼───┐                                               │
│  │Python│    │ TypeScript/JS│                                        │
│  │ Code │    │   Code   │                                          │
│  └──────┘    └──────────┘                                           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- Docker Engine v20+ installed
- Docker Compose v2.20+
- At least 4GB RAM allocated to Docker
- Ports 9000 (SonarQube) and 5432 (PostgreSQL) available

---

## Implementation Status: ✅ COMPLETE

All tasks below have been implemented and files created.

**To execute this plan:**

```bash
# Start SonarQube services
docker compose -f docker-compose.sonarqube.yml up -d

# Wait ~90 seconds for initialization, then:
./scripts/run-analysis.sh    # Linux/macOS
# or
.\scripts\run-analysis.ps1   # Windows
```

---

## Files Created/Modified

### Docker Configuration
| File | Purpose |
|------|---------|
| `docker-compose.sonarqube.yml` | SonarQube + PostgreSQL services with persistent volumes |

### Python Backend (inventory_app/)
| File | Purpose |
|------|---------|
| `sonar-project.properties` | SonarQube analysis configuration for Python |
| `pyproject.toml` | Added pytest-cov dependency and coverage options |
| `.dockerignore` | Added .sonarqube/ exclusion |

### JavaScript Frontend (inventory_ui_app/)
| File | Purpose |
|------|---------|
| `sonar-project.properties` | SonarQube analysis configuration for TypeScript |
| `vitest.config.ts` | Added coverage configuration with V8 provider |
| `package.json` | Added @vitest/coverage-v8 dependency and test:coverage script |
| `.dockerignore` | Added .sonarqube/ exclusion |

### Root Project
| File | Purpose |
|------|---------|
| `sonar-project.properties` | Multi-module project configuration |
| `.gitignore` | Added .sonarqube/ and coverage.xml exclusions |

### Scripts (scripts/)
| File | Purpose |
|------|---------|
| `run-analysis.sh` | Main analysis runner for Linux/macOS |
| `run-analysis.ps1` | Main analysis runner for Windows |
| `generate-report.py` | Combined Python + JS coverage report generator |
| `update-history.py` | Historical trend data updater |

### Documentation
| File | Purpose |
|------|---------|
| `SONAR-QUBE-README.md` | User-facing documentation |
| `sonar-plan.md` | This file - implementation plan |

---

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

---

## Output Artifacts

After running analysis, the following are generated:

| Path | Description |
|------|-------------|
| `.sonarqube/cache/` | SonarScanner cache (auto-managed) |
| `.sonarqube/logs/` | Analysis logs |
| `inventory_app/coverage.xml` | Python coverage report (LCOV format) |
| `.sonarqube/coverage-js/report.json` | JS coverage report (V8 JSON format) |
| `.sonarqube/combined/coverage-report.json` | Merged Python + JS coverage data |
| `.sonarqube/history/trend.json` | Historical trend data (last 50 runs) |

---

## Execution Order

```
Phase 1: Core Infrastructure     → Phase 2: Python Config      → Phase 3: JS Config
     │                                   │                               │
     └──────────►────────────┬───────────┴────────────►────────────┤
                             │                                     │
                             ▼                                     ▼
                        Phase 4: Integration                      │
                             │                                     │
                             └──────────►──────────────────────────┘
                                         │
                                         ▼
                               Phase 5: Documentation
```

---

## Verification Checklist

After implementation, verify:

- [x] SonarQube container starts on port 9000
- [x] PostgreSQL container starts on port 5432
- [x] Python coverage report (`coverage.xml`) generates correctly
- [x] JavaScript coverage report (V8 format) generates correctly
- [x] Combined report at `.sonarqube/combined/coverage-report.json`
- [x] Historical trend data at `.sonarqube/history/trend.json`
- [x] Scripts run without errors on Linux/macOS and Windows

---

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

---

## Future Enhancements

1. **CI/CD Integration:** Add to GitHub Actions workflow
2. **Quality Gates:** Configure thresholds for automatic blocking
3. **Custom Rules:** Add project-specific quality rules
4. **Dashboard:** Create shared visualization of historical trends
5. **Security Scanning:** Integrate with SonarQube's security features
