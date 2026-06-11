# CI/CD Pipeline Setup Guide

## Required GitHub Actions Secrets

Navigate to **Settings > Secrets and variables > Actions** and add the following secrets:

### Deployment Secrets
| Secret | Description |
|--------|-------------|
| `STAGING_HOST` | Staging server IP or hostname |
| `STAGING_USER` | SSH username for staging server |
| `STAGING_SSH_KEY` | Private SSH key for deployment (full PEM key) |
| `STAGING_DEPLOY_PATH` | Remote path for backend deployment (e.g., `/opt/telehealings/backend`) |
| `STAGING_THERAPIST_PATH` | Remote path for therapist web static files (e.g., `/var/www/therapist`) |
| `STAGING_ADMIN_PATH` | Remote path for admin web static files (e.g., `/var/www/admin`) |
| `STAGING_API_URL` | Staging API base URL (e.g., `https://staging-api.telehealings.com`) |
| `STAGING_THERAPIST_URL` | Staging therapist web URL |
| `STAGING_ADMIN_URL` | Staging admin web URL |

### Preview Deployment Secrets (Netlify)
| Secret | Description |
|--------|-------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token |
| `NETLIFY_THERAPIST_SITE_ID` | Netlify site ID for therapist web |
| `NETLIFY_ADMIN_SITE_ID` | Netlify site ID for admin web |

## Branch Protection Rules

Navigate to **Settings > Branches > Add branch protection rule** for `main`:

- **Branch pattern**: `main`
- **Require a pull request before merging**: Enabled
  - **Require approvals**: 1
  - **Dismiss stale pull request approvals when new commits are pushed**: Enabled
  - **Require review from Code Owners**: Optional
- **Require status checks to pass before merging**: Enabled
  - **Require branches to be up to date before merging**: Enabled
  - **Status checks**: `ci-pass` (the final gate job from CI workflow)
- **Require conversation resolution before merging**: Enabled
- **Include administrators**: Recommended

For `develop`:
- Same as main but with 0 required approvals (optional, team preference).

## Workflow Summary

### CI Workflow (`.github/workflows/ci.yml`)
- Triggers on push to `main`, `develop`, `release/*` and PRs
- Uses path filters to only run jobs for changed packages
- Jobs per package: lint -> test -> build
- Backend tests run with a PostgreSQL service container
- Final `ci-pass` gate job ensures all required checks passed

### Deploy Workflow (`.github/workflows/deploy.yml`)
- Triggers on push to `develop` or manual dispatch
- Deploys backend, therapist web, and admin web to staging via SSH
- Runs smoke tests against all staging services after deploy
- Uses GitHub Environments for deployment protection

### Preview Workflow (`.github/workflows/preview.yml`)
- Triggers on PR open/synchronize/reopen
- Deploys preview builds to Netlify
- Triggered by labels: `preview:therapist`, `preview:admin`, `preview:all`
- Comments PR with preview URLs

### Release Workflow (`.github/workflows/release.yml`)
- Triggers on push to `main`
- Runs semantic-release with conventional commits
- Auto-generates changelog, version bump, and GitHub release

## Conventional Commits

This project uses conventional commits for semantic release:

| Type | Description |
|------|-------------|
| `feat:` | New feature (minor version bump) |
| `fix:` | Bug fix (patch version bump) |
| `docs:` | Documentation only |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvement |
| `test:` | Adding/fixing tests |
| `chore:` | Build/tooling changes |
| `BREAKING CHANGE:` | Breaking change (major version bump) |

## Adding Preview Labels

Create these labels in your GitHub repository:
- `preview:therapist` - Deploy therapist web preview
- `preview:admin` - Deploy admin web preview
- `preview:all` - Deploy both previews
