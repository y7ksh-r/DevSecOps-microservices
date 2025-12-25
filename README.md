# DevSecOps Microservices – CI/CD & Security Pipelines

This repository contains the **application and CI/CD layer** of my end-to-end **DevSecOps project**.

It hosts:
- Three sample microservices (Go, Node.js, Python)
- A **security-first CI pipeline**
- A **separate build & push pipeline** that publishes images to Amazon ECR

This repository is intentionally designed to demonstrate **secure software supply chain practices**, not complex business logic.

---

## What This Repository Does

This repository is responsible for:

- Hosting application source code
- Running **security scans on every commit**
- Building container images only after security checks pass
- Publishing images to **Amazon ECR**
- Providing image metadata for GitOps deployments

It does **not**:
- Provision infrastructure
- Deploy to Kubernetes directly
- Manage cluster configuration

Those concerns live in separate repositories.

---

## Microservices Overview

```
├── go-app/        # Go-based microservice
├── node-app/      # Node.js microservice
└── python-app/    # Python microservice
```

Each service contains:

- Minimal application logic
- A Dockerfile

## Repository Structure

```
├── .github/workflows/
│   ├── security.yaml         # Security & compliance pipeline
│   └── build-and-push.yaml   # Image build & push pipeline
├── go-app/
├── node-app/
├── python-app/
├── .gitleaks.toml            # Secret scanning rules
└── README.md
```
## CI/CD Design Overview

This repository uses two separate pipelines by design:

- Security Pipeline (always runs first)
- Build & Push Pipeline (runs only if security passes)

This enforces a security gate before any image is published.

## Security Pipeline (security.yaml)
### Triggers

- push to main
- pull_request to main

### What It Does

The security pipeline performs multiple layers of scanning:

Source Code & Secrets

- Gitleaks – secret detection
- Bandit – Python static analysis

Dependency Security

- Snyk – dependency vulnerability scanning (Go, Node, Python)

Container & Config Security

- Trivy FS – filesystem scanning
- Trivy Config – Dockerfile and config scanning
- Trivy Image – container image scanning

SBOM & Supply Chain

- Syft – SBOM generation (JSON + CycloneDX)
- Trivy SBOM – vulnerability scanning of SBOMs

Enforcement

The pipeline fails automatically if:

- Secrets are detected
- High severity issues are found
- Policy thresholds are violated

All scan results are stored as artifacts for audit and review.

## Build & Push Pipeline (build-and-push.yaml)
### Trigger

- Triggered only via repository_dispatch
- Dispatched by the security pipeline after all checks pass

### What It Does

- Builds Docker images for all microservices
- Authenticates to AWS using OIDC (no static credentials)
- Tags images using the Git commit SHA
- Pushes images to Amazon ECR
- Outputs image metadata for GitOps consumption

This pipeline never runs directly on push, ensuring:

No insecure image is ever published.

## Image Tagging Strategy

- Images are tagged using Git SHA
- No mutable tags (latest) are used
- This guarantees:
  - Traceability
  - Reproducibility
  - Safe GitOps rollbacks

## Security Philosophy

This repository demonstrates:

- Shift-left security
- Supply chain protection
- Immutable artifacts
- Policy-driven CI/CD
- Zero trust between pipeline stages


## Project Context

This repository works alongside:

- Infrastructure Repo – Terraform + AWS EKS
- GitOps Repo – ArgoCD, Kustomize, Kyverno, Rollouts
- Observability & Runtime Security Stack

Together, they form a complete end-to-end DevSecOps system with:

- Clear separation of concerns
- Real-world tooling
- Production-inspired workflows
- Dependency definitions
