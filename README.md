# 🌾 AgriPortal — Agriculture Department Microservices Portal

> A complete microservices-based web application for the Agriculture Department covering **Farmer Registration**, **Crop Management**, **Scheme Eligibility**, and **District/Tehsil Management**.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Quick Start — Docker Compose](#quick-start--docker-compose)
6. [Task 1 — Dockerization Details](#task-1--dockerization)
7. [Task 2 — Docker Compose Details](#task-2--docker-compose)
8. [Task 3 — API Gateway Configuration](#task-3--api-gateway-configuration)
9. [Task 4 — Kubernetes Deployment](#task-4--kubernetes-deployment)
10. [Task 5 — Jenkins CI/CD Pipeline](#task-5--jenkins-cicd-pipeline)
11. [API Reference](#api-reference)
12. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Angular UI  :4200                   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP requests
┌──────────────────────────▼──────────────────────────────┐
│              NGINX API Gateway  :8080                    │
│  /api/farmers  →  farmer-service                        │
│  /api/crops    →  crop-service                          │
│  /api/schemes  →  scheme-service                        │
└─────┬─────────────────┬──────────────────────┬──────────┘
      │                 │                      │
┌─────▼──────┐  ┌───────▼──────┐  ┌───────────▼──────┐
│  farmer-   │  │  crop-       │  │  scheme-          │
│  service   │  │  service     │  │  service          │
│  :8081     │  │  :8082       │  │  :8083            │
└─────┬──────┘  └───────┬──────┘  └───────────┬──────┘
      │                 │                      │
      └─────────────────┼──────────────────────┘
                        │
            ┌───────────▼───────────┐
            │   PostgreSQL  :5432   │
            │   agridb database     │
            └───────────────────────┘
```

---

## 📁 Project Structure

```
agri-portal/
├── farmer-service/           # Node.js microservice — Farmer CRUD
│   ├── src/
│   │   ├── index.js          # Entry point (port 8081)
│   │   ├── db.js             # PostgreSQL connection pool
│   │   └── routes/
│   │       └── farmers.js    # REST routes
│   ├── package.json
│   ├── Dockerfile            # ← Task 1
│   └── .dockerignore
│
├── crop-service/             # Node.js microservice — Crop CRUD
│   ├── src/
│   │   ├── index.js          # Entry point (port 8082)
│   │   ├── db.js
│   │   └── routes/crops.js
│   ├── package.json
│   └── Dockerfile            # ← Task 1
│
├── scheme-service/           # Node.js microservice — Scheme Eligibility
│   ├── src/
│   │   ├── index.js          # Entry point (port 8083)
│   │   ├── db.js
│   │   └── routes/schemes.js
│   ├── package.json
│   └── Dockerfile            # ← Task 1
│
├── angular-ui/               # Angular 17 Frontend
│   ├── src/app/
│   │   ├── app.component.ts  # Root layout with sidebar
│   │   ├── app.routes.ts     # Lazy-loaded routing
│   │   ├── dashboard/        # Dashboard page
│   │   ├── farmers/          # Farmer registration page
│   │   ├── crops/            # Crop management page
│   │   ├── schemes/          # Scheme eligibility page
│   │   └── shared/
│   │       └── api.service.ts # Centralized HTTP service
│   ├── nginx.conf            # SPA routing config
│   └── Dockerfile            # ← Task 1 (multi-stage)
│
├── api-gateway/              # NGINX API Gateway
│   ├── nginx.conf            # ← Task 3 (routing config)
│   └── Dockerfile
│
├── kubernetes/               # ← Task 4
│   ├── configmap.yaml        # ConfigMap + Secret
│   ├── deployment.yaml       # All deployments + PVC
│   └── service.yaml          # ClusterIP + NodePort services
│
├── jenkins/                  # ← Task 5
│   └── Jenkinsfile           # Declarative CI/CD pipeline
│
├── init-db.sql               # PostgreSQL schema + seed data
├── docker-compose.yml        # ← Task 2
└── README.md
```

---

## 💻 Technology Stack

| Layer        | Technology          | Version  |
|--------------|---------------------|----------|
| Frontend     | Angular             | 17.x     |
| Backend      | Node.js + Express   | 20.x     |
| Database     | PostgreSQL          | 16       |
| API Gateway  | NGINX               | 1.25     |
| Container    | Docker              | Latest   |
| Orchestration| Docker Compose      | v2       |
| Kubernetes   | K8s YAML            | 1.28+    |
| CI/CD        | Jenkins             | 2.x      |

---

## ✅ Prerequisites

Before running this project, ensure you have installed:

| Tool           | Download Link                                  | Required For         |
|----------------|------------------------------------------------|----------------------|
| Docker Desktop | https://www.docker.com/products/docker-desktop | All Docker tasks     |
| Docker Compose | Included with Docker Desktop                   | Task 2               |
| kubectl        | https://kubernetes.io/docs/tasks/tools/        | Task 4 (K8s)         |
| minikube       | https://minikube.sigs.k8s.io/docs/start/       | Task 4 (K8s locally) |
| Jenkins        | https://www.jenkins.io/download/               | Task 5               |
| Node.js 20     | https://nodejs.org/                            | Local dev only       |

---

## 🚀 Quick Start — Docker Compose

This runs the **entire stack** in one command.

### Step 1: Navigate to the project directory

```bash
cd agri-portal
```

### Step 2: Build and start all services

```bash
docker compose up --build
```

> The first build may take **3–5 minutes** (Angular build + Node.js installs).

### Step 3: Verify all services are running

```bash
docker compose ps
```

You should see all 6 containers with status `healthy`:

```
NAME                   STATUS          PORTS
agri-postgres          healthy         0.0.0.0:5432->5432/tcp
agri-farmer-service    healthy         0.0.0.0:8081->8081/tcp
agri-crop-service      healthy         0.0.0.0:8082->8082/tcp
agri-scheme-service    healthy         0.0.0.0:8083->8083/tcp
agri-api-gateway       healthy         0.0.0.0:8080->8080/tcp
agri-angular-ui        healthy         0.0.0.0:4200->80/tcp
```

### Step 4: Open the application

| Service         | URL                          |
|-----------------|------------------------------|
| 🌐 Angular UI   | http://localhost:4200        |
| 🔀 API Gateway  | http://localhost:8080        |
| 👨‍🌾 Farmer API | http://localhost:8081        |
| 🌱 Crop API     | http://localhost:8082        |
| 📋 Scheme API   | http://localhost:8083        |

### Step 5: Stop the application

```bash
docker compose down
```

To also **remove the database volume** (delete all data):

```bash
docker compose down -v
```

---

## 📦 Task 1 — Dockerization

Each service has its own optimized Dockerfile.

### Key Dockerfile Features

| Feature              | Description                                          |
|----------------------|------------------------------------------------------|
| Multi-stage build    | Separate `deps` and `production` stages              |
| Non-root user        | Runs as `nodeuser` (UID 1001) for security           |
| Layer caching        | `package*.json` copied first to cache `npm install`  |
| Health checks        | Built-in `HEALTHCHECK` instruction                   |
| Minimal base image   | `node:20-alpine` (~50MB vs ~900MB full)             |

### Build individual images manually

```bash
# Farmer service
docker build -t agri-portal/farmer-service:1.0 ./farmer-service

# Crop service
docker build -t agri-portal/crop-service:1.0 ./crop-service

# Scheme service
docker build -t agri-portal/scheme-service:1.0 ./scheme-service

# Angular UI (two-stage: Angular build + NGINX)
docker build -t agri-portal/angular-ui:1.0 ./angular-ui
```

---

## 🐳 Task 2 — Docker Compose

The `docker-compose.yml` orchestrates all services.

### Key Features

| Feature                | Implementation                                   |
|------------------------|--------------------------------------------------|
| Inter-service comm.    | `agri-network` bridge network                    |
| Persistent storage     | `postgres_data` named volume                     |
| Service dependencies   | `depends_on` with `condition: service_healthy`   |
| Environment variables  | `environment:` blocks per service                |
| Health checks          | All services have `healthcheck` defined          |
| Auto-restart           | `restart: unless-stopped`                        |

### Useful Docker Compose Commands

```bash
# Start in background (detached)
docker compose up -d --build

# View logs of all services
docker compose logs -f

# View logs of one service
docker compose logs -f farmer-service

# Restart a single service
docker compose restart crop-service

# Scale a service to 3 instances
docker compose up -d --scale farmer-service=3

# Check resource usage
docker compose top
```

---

## 🔀 Task 3 — API Gateway Configuration

The NGINX API Gateway (`api-gateway/nginx.conf`) routes all external traffic.

### Route Table

| URL Path         | Backend Service       | Port |
|------------------|-----------------------|------|
| `/api/farmers`   | `farmer-service`      | 8081 |
| `/api/crops`     | `crop-service`        | 8082 |
| `/api/schemes`   | `scheme-service`      | 8083 |
| `/health`        | Gateway health check  | —    |

### Test routes via API Gateway

```bash
# Health check
curl http://localhost:8080/health

# Get all farmers (routed to farmer-service:8081)
curl http://localhost:8080/api/farmers

# Get all crops (routed to crop-service:8082)
curl http://localhost:8080/api/crops

# Get all schemes (routed to scheme-service:8083)
curl http://localhost:8080/api/schemes

# Check scheme eligibility
curl -X POST http://localhost:8080/api/schemes/check-eligibility \
  -H "Content-Type: application/json" \
  -d '{"land_acres": 8, "crop_name": "Wheat"}'
```

### Gateway Features

- ✅ Reverse proxy with `proxy_pass`
- ✅ CORS headers for Angular UI
- ✅ Rate limiting (100 req/min per IP)
- ✅ Keepalive connections to upstreams
- ✅ Custom error pages (502/503/504)
- ✅ Security headers (X-Frame-Options, XSS-Protection)

---

## ☸️ Task 4 — Kubernetes Deployment

### Files

| File               | Contents                                          |
|--------------------|---------------------------------------------------|
| `configmap.yaml`   | ConfigMap (DB_HOST, DB_NAME) + Secret (credentials) |
| `deployment.yaml`  | Namespace, PVC, Deployments for all services      |
| `service.yaml`     | ClusterIP + NodePort services                     |

### Step 1: Start Minikube (local K8s cluster)

```bash
minikube start --memory=4096 --cpus=2
```

### Step 2: Point Docker to Minikube's registry

```bash
# Windows PowerShell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Linux/Mac
eval $(minikube docker-env)
```

### Step 3: Build images inside Minikube

```bash
docker build -t agri-portal/farmer-service:latest ./farmer-service
docker build -t agri-portal/crop-service:latest   ./crop-service
docker build -t agri-portal/scheme-service:latest ./scheme-service
docker build -t agri-portal/api-gateway:latest    ./api-gateway
docker build -t agri-portal/angular-ui:latest     ./angular-ui
```

### Step 4: Apply Kubernetes manifests

```bash
# Apply in order (dependencies first)
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

### Step 5: Verify deployment

```bash
# Check namespace
kubectl get all -n agri-portal

# Watch pods come up
kubectl get pods -n agri-portal -w

# Check pod logs
kubectl logs -n agri-portal deployment/farmer-service

# Describe a pod for debugging
kubectl describe pod -n agri-portal -l app=farmer-service
```

### Step 6: Access services

```bash
# Get Minikube IP
minikube ip

# Access API Gateway via NodePort
curl http://$(minikube ip):30080/api/farmers

# Access Angular UI via NodePort
open http://$(minikube ip):30200

# OR use port-forward for direct access
kubectl port-forward -n agri-portal svc/api-gateway-service 8080:8080
```

### Kubernetes Architecture

| Resource       | Type           | Replicas | Access      |
|----------------|----------------|----------|-------------|
| postgres       | Deployment     | 1        | ClusterIP   |
| farmer-service | Deployment     | 2        | ClusterIP   |
| crop-service   | Deployment     | 2        | ClusterIP   |
| scheme-service | Deployment     | 1        | ClusterIP   |
| api-gateway    | Service        | —        | NodePort 30080 |
| angular-ui     | Service        | —        | NodePort 30200 |

---

## 🔧 Task 5 — Jenkins CI/CD Pipeline

### Pipeline Stages

```
Checkout SCM  →  Environment Check  →  Build Docker Images (parallel)
     ↓
Deploy with Docker Compose  →  Health Check  →  API Smoke Test
```

### Setup Jenkins

**Option A: Run Jenkins via Docker (Recommended)**

```bash
docker run -d \
  --name jenkins \
  -p 8888:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17
```

Get initial admin password:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Option B: Installed Jenkins**

Open Jenkins at `http://localhost:8888` and complete setup wizard.

### Create Jenkins Pipeline

1. Click **New Item** → name it `agri-portal` → select **Pipeline**
2. Under **Pipeline**, set **Definition** to `Pipeline script from SCM`
3. Set **SCM** to Git, enter your repository URL
4. Set **Script Path** to `jenkins/Jenkinsfile`
5. Click **Save** then **Build Now**

### Required Jenkins Plugins

Install via **Manage Jenkins → Plugins**:

- Pipeline
- Docker Pipeline
- AnsiColor
- Git Plugin

---

## 📡 API Reference

### Farmer Service (via Gateway: `http://localhost:8080/api/farmers`)

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/api/farmers`     | List all farmers (supports `?district=&tehsil=`) |
| GET    | `/api/farmers/:id` | Get farmer by ID                   |
| POST   | `/api/farmers`     | Register new farmer                |
| PUT    | `/api/farmers/:id` | Update farmer details              |
| DELETE | `/api/farmers/:id` | Delete farmer record               |

**POST /api/farmers — Request Body:**
```json
{
  "name":       "Ravi Kumar",
  "phone":      "9876543210",
  "email":      "ravi@example.com",
  "district":   "Amritsar",
  "tehsil":     "Ajnala",
  "land_acres": 12.5
}
```

### Crop Service (via Gateway: `http://localhost:8080/api/crops`)

| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/api/crops`    | List crops (supports `?farmer_id=&season=&status=`) |
| GET    | `/api/crops/:id`| Get crop by ID                           |
| POST   | `/api/crops`    | Add crop record                          |
| PUT    | `/api/crops/:id`| Update crop record                       |
| DELETE | `/api/crops/:id`| Delete crop record                       |

**POST /api/crops — Request Body:**
```json
{
  "farmer_id":  1,
  "crop_name":  "Wheat",
  "season":     "Rabi",
  "area_acres": 10.0,
  "sown_date":  "2025-11-01",
  "status":     "Growing"
}
```

### Scheme Service (via Gateway: `http://localhost:8080/api/schemes`)

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/schemes`                    | List all schemes         |
| GET    | `/api/schemes/:id`                | Get scheme by ID         |
| POST   | `/api/schemes/check-eligibility`  | Check eligibility        |
| POST   | `/api/schemes/apply`              | Apply for a scheme       |
| GET    | `/api/schemes/applications/:farmer_id` | Farmer's applications |

**POST /api/schemes/check-eligibility — Request Body:**
```json
{
  "land_acres": 8.5,
  "crop_name":  "Wheat"
}
```

---

## 🔧 Troubleshooting

### Problem: Containers not starting

```bash
# Check container logs
docker compose logs postgres
docker compose logs farmer-service

# Check if ports are in use
netstat -an | findstr "8080 8081 8082 8083 4200"   # Windows
lsof -i :8080                                        # Linux/Mac
```

### Problem: Database connection refused

```bash
# Check if postgres is healthy
docker compose ps postgres

# Connect to postgres manually
docker exec -it agri-postgres psql -U agriuser -d agridb

# Run query to verify tables
\dt farmer_schema.*
SELECT * FROM farmer_schema.farmers;
```

### Problem: Angular UI shows blank page

```bash
# Check NGINX logs in the Angular container
docker logs agri-angular-ui

# Verify the built files exist
docker exec agri-angular-ui ls /usr/share/nginx/html
```

### Problem: API Gateway returns 502

The backend microservice is not reachable. Check:

```bash
# Are all backend services healthy?
docker compose ps

# Test individual services directly
curl http://localhost:8081/health   # farmer-service
curl http://localhost:8082/health   # crop-service
curl http://localhost:8083/health   # scheme-service
```

### Problem: Kubernetes pods in CrashLoopBackOff

```bash
# Get pod logs
kubectl logs -n agri-portal <pod-name> --previous

# Describe pod events
kubectl describe pod -n agri-portal <pod-name>

# Check if images are available locally
docker images | grep agri-portal
```

---

## 📊 Default Seed Data

The database is pre-populated with sample data:

**Farmers:** Ravi Kumar (Amritsar), Sukhdev Singh (Ludhiana), Priya Sharma (Patiala)

**Crops:** Wheat (Rabi), Rice (Kharif), Sugarcane (Zaid), Mustard (Rabi)

**Schemes:** PM-KISAN, Crop Insurance, Drip Irrigation Subsidy, Soil Health Card

---

## 📝 Environment Variables Reference

| Variable    | Default        | Description             |
|-------------|----------------|-------------------------|
| DB_HOST     | postgres       | PostgreSQL hostname      |
| DB_PORT     | 5432           | PostgreSQL port          |
| DB_NAME     | agridb         | Database name            |
| DB_USER     | agriuser       | Database username        |
| DB_PASSWORD | agripassword   | Database password        |
| PORT        | 8081/8082/8083 | Service listening port   |
| NODE_ENV    | production     | Node.js environment      |

---

*AgriPortal v1.0 — Agriculture Department Management System*
