# ShopK8s — Kubernetes CI/CD Pipeline

> **Author:** Sachin Gate — [Sachin.Gate@elliotsystems.com](mailto:gatesachin1112@gmail.com)

A Node.js/Express demo application with a fully automated CI/CD pipeline using AWS CodeBuild, Amazon ECR, and Kubernetes.

## Architecture

```
GitHub → AWS CodeBuild (CI) → Amazon ECR → AWS CodeBuild (CD) → Kubernetes
```

- **CI stage** (`buildspec-ci.yml`): builds and pushes a Docker image tagged with the git commit hash
- **CD stage** (`buildspec-cd.yml`): pulls the kubeconfig from SSM Parameter Store, updates the Kubernetes deployment, and waits for rollout

## Application

A lightweight Express server (`app.js`) that exposes:

| Route | Description |
|---|---|
| `GET /` | ShopK8s dashboard — shows pod name, uptime, Node.js version, pipeline visualization |
| `GET /health` | Health check — returns `{ status: 'ok', hostname, uptime, version }` |

Port defaults to **3000** (override with `PORT` env var).

## Repository Layout

```
kubernetes-pipeline/
├── app.js               # Express application
├── package.json
├── Dockerfile           # Multi-stage Node 20 Alpine image
├── buildspec-ci.yml     # CodeBuild — build & push to ECR
├── buildspec-cd.yml     # CodeBuild — deploy to Kubernetes
└── k8s/
    ├── deployment.yaml  # 2 replicas, resource limits, health probes
    ├── service.yaml     # NodePort 30081 → container 3000
    └── ingress.yaml     # Nginx ingress via nip.io hostname
```

## Prerequisites

- AWS account with CodeBuild, ECR, and SSM Parameter Store access
- Kubernetes cluster reachable from the CodeBuild environment
- Kubeconfig stored in SSM at `/shopk8s/kubeconfig`
- ECR image pull secret `ecr-secret` created in the cluster namespace

## Environment Variables (CI)

| Variable | Value |
|---|---|
| `ECR_REGISTRY` | `654654392564.dkr.ecr.us-east-1.amazonaws.com` |
| `ECR_REPO` | `shopk8s` |
| `AWS_DEFAULT_REGION` | `us-east-1` |

## Running Locally

```bash
npm install
node app.js
# open http://localhost:3000
```

## Docker

```bash
docker build -t shopk8s .
docker run -p 3000:3000 shopk8s
```

## Kubernetes Resources

| Resource | Detail |
|---|---|
| Deployment | 2 replicas, 100m–250m CPU, 64–128Mi memory |
| Readiness probe | `GET /health` after 5 s, every 10 s |
| Liveness probe | `GET /health` after 15 s, every 20 s |
| Service | NodePort 30081 |
| Ingress | `shopk8s.18.215.244.253.nip.io` (Nginx) |

## Security Notes

- Container runs as the non-root `node` user
- Base image pulled from ECR Public mirror to avoid Docker Hub rate limits
- Kubeconfig is encrypted at rest in SSM Parameter Store
