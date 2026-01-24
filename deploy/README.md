# NumberSense Deployment

## Quick Start (Local Development)

```bash
cd src/frontend
npm install
npm run dev
```

Open http://localhost:5173

## Docker Build

```bash
# Build the image
docker build -t numbers-sense:latest .

# Run locally
docker run -p 8080:80 numbers-sense:latest
```

Open http://localhost:8080

## Kubernetes Deployment (ArgoCD)

### Prerequisites

1. Access to your ArgoCD-managed Kubernetes cluster
2. `ghcr-credentials` secret for pulling images from GitHub Container Registry

### Deploy to Staging

1. Copy `argocd/numbers-sense-staging.yaml` to your GitOps infra repo:
   ```bash
   cp deploy/argocd/numbers-sense-staging.yaml \
      /path/to/homelab-k8s-infra/applications/apps/
   ```

2. Commit and push to trigger ArgoCD sync

3. Create the image pull secret (if not exists):
   ```bash
   kubectl create secret docker-registry ghcr-credentials \
     --docker-server=ghcr.io \
     --docker-username=YOUR_GITHUB_USERNAME \
     --docker-password=YOUR_GITHUB_PAT \
     --namespace=numbers-sense-staging
   ```

### Helm Values

The Helm chart at `k8s/helm/numbers-sense/` supports:

| Value | Default | Description |
|-------|---------|-------------|
| `image.repository` | `ghcr.io/desponda/numbers-sense` | Container image |
| `image.tag` | `latest` | Image tag |
| `replicaCount` | `1` | Number of replicas |
| `ingress.enabled` | `true` | Enable ingress |
| `ingress.hosts[0].host` | `numbers-sense.local` | Hostname |

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/docker-build.yaml`) automatically:
- Builds Docker image on push to `main` or `chaoskube`
- Pushes to `ghcr.io/desponda/numbers-sense`
- Tags with commit SHA and `latest`

ArgoCD will automatically sync when new images are pushed.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Ingress   │───▶│   Service   │───▶│ Deployment  │  │
│  │  (TLS/SSL)  │    │ (ClusterIP) │    │ (nginx+SPA) │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────┘
```

The app is a static SPA served by nginx with:
- Client-side routing
- Gzip compression
- Asset caching
- Security headers
