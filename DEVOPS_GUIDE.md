# 🚀 Matchy Platform — DevOps Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPER MACHINE                           │
│                                                                 │
│  Git Push ──► GitHub ──► Jenkins Webhook                        │
│                               │                                 │
│                               ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    JENKINS (8080)                        │   │
│  │  1. Checkout  2. Build  3. Test  4. SonarQube            │   │
│  │  5. Quality Gate  6. Docker Build  7. Deploy             │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌────────────┐  ┌─────────────────┐  ┌──────────────────┐    │
│  │ SonarQube  │  │  Docker Hub     │  │  Docker Compose  │    │
│  │  (9000)    │  │  (Image Store)  │  │  (All Services)  │    │
│  └────────────┘  └─────────────────┘  └──────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MONITORING STACK                            │   │
│  │  Prometheus (9091) ──► Grafana (3000)                   │   │
│  │  Scrapes metrics from all 8 microservices               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Files Created

```
project-root/
├── Jenkinsfile                          # CI/CD Pipeline
├── docker-compose.yml                   # Full app stack
├── docker-compose.monitoring.yml        # Prometheus + Grafana + SonarQube
├── docker-compose.jenkins.yml           # Jenkins + Docker-in-Docker
├── Dockerfile.frontend                  # Angular → Nginx
├── nginx.conf                           # Nginx config for Angular
├── sonar-project.properties             # Root SonarQube config
├── .env.docker                          # Docker env vars template
│
├── eureka-server/Dockerfile
├── api-gateway/Dockerfile
├── backend/Dockerfile
├── services/
│   ├── event-service/
│   │   ├── Dockerfile
│   │   └── sonar-project.properties
│   ├── content-service/
│   │   ├── Dockerfile
│   │   └── sonar-project.properties
│   ├── subscription-service/
│   │   ├── Dockerfile
│   │   └── sonar-project.properties
│   └── ml-prediction-service/
│       └── Dockerfile
│
└── devops/
    ├── start-monitoring.bat             # Start Prometheus+Grafana+Sonar
    ├── start-jenkins.bat                # Start Jenkins
    ├── prometheus/
    │   ├── prometheus.yml               # Scrape config for all services
    │   └── alert.rules.yml              # Alert rules
    ├── grafana/
    │   ├── provisioning/
    │   │   ├── datasources/prometheus.yml
    │   │   └── dashboards/dashboards.yml
    │   └── dashboards/
    │       └── matchy-overview.json     # Pre-built dashboard
    ├── sonarqube/
    │   └── setup-sonarqube.sh           # Auto-setup script
    └── jenkins/
        ├── Dockerfile.jenkins           # Custom Jenkins image
        ├── plugins.txt                  # Required plugins
        └── jenkins.yaml                 # JCasC configuration
```

---

## 🔧 Step-by-Step Setup

### STEP 1 — Start Monitoring Stack (Prometheus + Grafana + SonarQube)

```bash
# Windows
devops\start-monitoring.bat

# Or manually
docker compose -f docker-compose.monitoring.yml up -d
```

**Access:**
| Tool | URL | Credentials |
|------|-----|-------------|
| Prometheus | http://localhost:9091 | — |
| Grafana | http://localhost:3000 | admin / matchy123 |
| SonarQube | http://localhost:9000 | admin / admin |

---

### STEP 2 — Setup SonarQube (run once after first start)

```bash
# Wait ~2 minutes for SonarQube to fully start, then:
bash devops/sonarqube/setup-sonarqube.sh
```

This will:
- Change the default admin password
- Create all 6 project keys
- Create a custom Quality Gate with strict rules
- Generate a token for Jenkins

**Save the token output** — you'll need it for Jenkins.

---

### STEP 3 — Start Jenkins

```bash
# Windows
devops\start-jenkins.bat

# Or manually
docker compose -f docker-compose.jenkins.yml up -d --build
```

**Access:** http://localhost:8080
- User: `admin`
- Pass: `matchy-jenkins-2024`

---

### STEP 4 — Configure Jenkins Credentials

Go to **Manage Jenkins → Credentials → System → Global credentials**

Add these two credentials:

| ID | Type | Value |
|----|------|-------|
| `dockerhub-credentials` | Username/Password | Your Docker Hub login |
| `sonarqube-token` | Secret text | Token from Step 2 |

---

### STEP 5 — Create Jenkins Pipeline

1. Click **New Item**
2. Name: `matchy-pipeline`
3. Type: **Pipeline**
4. Under Pipeline → Definition: **Pipeline script from SCM**
5. SCM: **Git**
6. Repository URL: `https://github.com/amine52a/pipeline-test`
7. Branch: `*/main`
8. Script Path: `Jenkinsfile`
9. Click **Save**

---

### STEP 6 — Run the Pipeline

Click **Build Now** — the pipeline will:

```
Checkout → Build (parallel) → Test → SonarQube Analysis
    → Quality Gate → Docker Build & Push → Deploy → Health Check
```

---

## 📊 Grafana Dashboard

The dashboard **"🚀 Matchy Platform Overview"** is auto-provisioned with:

| Panel | Description |
|-------|-------------|
| Services UP/DOWN | Live status of all 8 services |
| HTTP Request Rate | Requests/second per service |
| HTTP Error Rate | 5xx errors per service |
| JVM Heap Memory | Java services memory usage |
| Node.js Heap | Backend service memory |
| CPU Usage | Per-service CPU % |
| Response Time P95 | 95th percentile latency |
| ML Predictions | Prediction rate over time |
| ML Model F1 Score | Model accuracy gauge |
| JVM GC Pauses | Garbage collection time |
| Active Threads | JVM thread count |
| Request Duration Heatmap | Latency distribution |

---

## 🔍 SonarQube Quality Gate Rules

The **Matchy Quality Gate** enforces:

| Metric | Threshold |
|--------|-----------|
| New Reliability Rating | ≤ A |
| New Security Rating | ≤ A |
| New Maintainability Rating | ≤ B |
| New Code Coverage | ≥ 60% |
| New Duplicated Lines | ≤ 5% |
| New Blocker Issues | = 0 |
| New Critical Issues | ≤ 5 |

---

## 🐳 Docker Images Built

| Image | Service | Port |
|-------|---------|------|
| `matchyplatform/matchy-eureka` | Eureka Server | 8761 |
| `matchyplatform/matchy-gateway` | API Gateway | 8091 |
| `matchyplatform/matchy-backend` | Node.js Backend | 9090 |
| `matchyplatform/matchy-event` | Event Service | 8081 |
| `matchyplatform/matchy-content` | Content Service | 8083 |
| `matchyplatform/matchy-subscription` | Subscription Service | 8084 |
| `matchyplatform/matchy-ml` | ML Prediction | 8085 |
| `matchyplatform/matchy-frontend` | Angular + Nginx | 4200→80 |

---

## 📡 Prometheus Metrics Endpoints

| Service | Endpoint |
|---------|----------|
| Eureka Server | http://localhost:8761/actuator/prometheus |
| API Gateway | http://localhost:8091/actuator/prometheus |
| Event Service | http://localhost:8081/actuator/prometheus |
| Content Service | http://localhost:8083/actuator/prometheus |
| Subscription Service | http://localhost:8084/actuator/prometheus |
| Backend (Node.js) | http://localhost:9090/metrics |
| ML Service (Python) | http://localhost:8085/metrics |

---

## 🚨 Alert Rules

Prometheus will fire alerts when:

| Alert | Condition |
|-------|-----------|
| `ServiceDown` | Any service unreachable for 1 min |
| `HighCPUUsage` | CPU > 80% for 2 min |
| `HighMemoryUsage` | JVM heap > 85% for 2 min |
| `HighErrorRate` | 5xx rate > 5% for 2 min |
| `SlowResponseTime` | P95 latency > 2s for 5 min |
| `MySQLDown` | MySQL unreachable for 30s |

---

## 🔄 CI/CD Pipeline Stages

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐
│ Checkout │──►│  Build   │──►│   Test   │──►│  SonarQube   │
│          │   │(parallel)│   │(parallel)│   │  Analysis    │
└──────────┘   └──────────┘   └──────────┘   └──────┬───────┘
                                                      │
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────▼───────┐
│  Health  │◄──│  Deploy  │◄──│  Docker  │◄──│  Quality     │
│  Check   │   │          │   │Build+Push│   │  Gate        │
└──────────┘   └──────────┘   └──────────┘   └──────────────┘
```

---

## 🛠️ Useful Commands

```bash
# Start everything
docker compose -f docker-compose.monitoring.yml up -d
docker compose -f docker-compose.jenkins.yml up -d

# Stop everything
docker compose -f docker-compose.monitoring.yml down
docker compose -f docker-compose.jenkins.yml down

# View logs
docker logs matchy-prometheus -f
docker logs matchy-grafana -f
docker logs matchy-sonarqube -f
docker logs matchy-jenkins -f

# Restart a service
docker compose -f docker-compose.monitoring.yml restart grafana

# Check Prometheus targets
curl http://localhost:9091/api/v1/targets

# Reload Prometheus config
curl -X POST http://localhost:9091/-/reload

# Check SonarQube status
curl http://localhost:9000/api/system/status
```

---

## ⚠️ Troubleshooting

### SonarQube won't start
```bash
# Increase virtual memory (required by Elasticsearch inside SonarQube)
# Run as Administrator on Windows:
wsl -d docker-desktop sysctl -w vm.max_map_count=262144
```

### Jenkins can't connect to Docker
```bash
# Make sure Docker Desktop is running
# Check docker-dind container is healthy
docker logs matchy-docker-dind
```

### Prometheus can't scrape services
- Make sure your services are running locally
- `host.docker.internal` resolves to your host machine from Docker
- Check firewall isn't blocking the ports

### Grafana shows "No data"
- Verify Prometheus is scraping: http://localhost:9091/targets
- Check the service is exposing `/actuator/prometheus` or `/metrics`
- Wait 1-2 minutes for first data points

---

## ✅ Quick Verification Checklist

- [ ] `docker compose -f docker-compose.monitoring.yml up -d` runs without errors
- [ ] Prometheus at http://localhost:9091 shows targets
- [ ] Grafana at http://localhost:3000 shows the Matchy dashboard
- [ ] SonarQube at http://localhost:9000 is accessible
- [ ] `bash devops/sonarqube/setup-sonarqube.sh` completes and shows token
- [ ] Jenkins at http://localhost:8080 is accessible
- [ ] Jenkins pipeline runs all 8 stages successfully
- [ ] Docker images appear in Docker Hub
- [ ] Grafana dashboard shows live metrics from running services
