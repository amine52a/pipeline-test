# 🔐 GitHub Actions Secrets Setup

Go to: **https://github.com/amine52a/pipeline-test/settings/secrets/actions**

Click **"New repository secret"** for each one below:

## Required Secrets

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SONAR_TOKEN` | `sqa_b550b7d6a0f088f734bb36738b97579656bf235b` | SonarQube analysis token |
| `SONAR_HOST_URL` | `http://YOUR_IP:9000` | Your SonarQube URL (use your machine's IP, not localhost) |
| `DOCKER_HUB_TOKEN` | Your Docker Hub password | Docker Hub access token |
| `GRAFANA_URL` | `http://YOUR_IP:3001` | Your Grafana URL |
| `GRAFANA_API_TOKEN` | *(run the command below to generate)* | Grafana service account token |

## ⚠️ Important: Use your machine's IP address

Since GitHub Actions runners are external, they cannot reach `localhost`.
You need to use your **public IP** or set up **ngrok** tunnels.

### Option A: Use ngrok (Recommended for development)

```bash
# Install ngrok: https://ngrok.com/download
# Then expose your services:
ngrok http 9000   # SonarQube → copy the https URL
ngrok http 3001   # Grafana   → copy the https URL
```

Use the ngrok URLs as `SONAR_HOST_URL` and `GRAFANA_URL`.

### Option B: Use your machine's public IP

Find your IP:
```bash
# Windows
ipconfig | findstr "IPv4"
```

Then use: `http://YOUR_IP:9000` for SonarQube and `http://YOUR_IP:3001` for Grafana.
Make sure your firewall allows inbound connections on ports 9000 and 3001.

## Pipeline Triggers

The pipeline runs automatically on:
- Every **push** to `main`, `develop`, or `feature/**` branches
- Every **pull request** to `main`

## What the pipeline does on each push:

```
Push to GitHub
     │
     ▼
┌─────────────────────────────────────────────────────┐
│  Parallel Jobs (run simultaneously):                 │
│  ├── 🟢 Backend: npm ci → test → SonarQube → Docker │
│  ├── ☕ Event Service: mvn verify → SonarQube → Docker│
│  ├── ☕ Content Service: mvn verify → SonarQube → Docker│
│  ├── ☕ Subscription: mvn verify → SonarQube → Docker│
│  ├── 🐍 ML Service: pip → train → SonarQube → Docker │
│  └── 🅰️ Frontend: npm build → SonarQube → Docker    │
└─────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│  🎯 Quality Gate Check                               │
│  Checks all 6 SonarQube projects passed              │
└─────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│  📊 Grafana Annotation                               │
│  Marks deployment on all dashboards                  │
└─────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│  📋 Pipeline Summary                                 │
│  Shows results in GitHub Actions UI                  │
└─────────────────────────────────────────────────────┘
```

## Generate Grafana API Token

Run this PowerShell command on your machine to get the Grafana token:

```powershell
$h = @{
    Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:matchy123"))
    "Content-Type" = "application/json"
}
$sa = Invoke-RestMethod -Uri "http://localhost:3001/api/serviceaccounts" -Method POST -Headers $h -Body '{"name":"github-actions","role":"Editor"}'
$t  = Invoke-RestMethod -Uri "http://localhost:3001/api/serviceaccounts/$($sa.id)/tokens" -Method POST -Headers $h -Body '{"name":"github-token"}'
Write-Host "GRAFANA_API_TOKEN = $($t.key)"
```

Copy the output value and add it as the `GRAFANA_API_TOKEN` secret.
