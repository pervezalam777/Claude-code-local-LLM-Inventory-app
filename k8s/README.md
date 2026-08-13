# Kubernetes Manifests for Inventory App

This directory contains Kubernetes manifests for deploying the inventory application.

## Files

| File | Description |
|------|-------------|
| `configmap.yml` | Configuration for backend and frontend apps |
| `secrets.yml` | PostgreSQL credentials |
| `persistent-volume-claims.yml` | PVCs for app data and PostgreSQL |
| `postgres-deployment.yml` | PostgreSQL deployment and service |
| `backend-deployment.yml` | FastAPI backend deployment, service, and health checks |
| `frontend-deployment.yml` | React frontend deployment, service, and health checks |
| `ingress.yml` | Nginx ingress for routing traffic |
| `all-in-one.yml` | Combined manifest for easy deployment |

## Prerequisites

- Kubernetes cluster (e.g., minikube, Docker Desktop, EKS, GKE)
- kubectl configured to access the cluster
- Docker registry accessible from the cluster (or push images locally for minikube)

## Deployment

### Build and Push Images

```bash
# Build backend image
cd inventory_app
docker build -f Dockerfile.prod -t your-registry/inventory-app:latest .

# Build frontend image
cd ../inventory_ui_app
docker build -f Dockerfile.prod -t your-registry/inventory-ui:latest .

# Push to registry
docker push your-registry/inventory-app:latest
docker push your-registry/inventory-ui:latest
```

### For minikube (local development)

```bash
# Use minikube's docker daemon
eval $(minikube docker-env)

# Build images in minikube's context
cd ../inventory_app
docker build -f Dockerfile.prod -t inventory-app:latest .
cd ../inventory_ui_app
docker build -f Dockerfile.prod -t inventory-ui:latest .

# Reset to host docker
eval $(minikube docker-env -u)
```

### Apply Kubernetes Manifests

```bash
kubectl apply -f k8s/all-in-one.yml
```

Or apply individually:

```bash
kubectl apply -f k8s/namespace.yml  # if using separate namespace
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/persistent-volume-claims.yml
kubectl apply -f k8s/postgres-deployment.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/ingress.yml
```

### Access the Application

```bash
# Port-forward for development
kubectl port-forward service/inventory-ui-service 8080:80 -n inventory-app-ns

# Or check ingress (requires Ingress Controller)
minikube addons enable ingress
```

## Cleanup

```bash
kubectl delete -f k8s/all-in-one.yml
```
