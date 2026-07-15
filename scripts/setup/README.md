# MHG SYNC — Sprint 1 VPS Setup

Run these scripts on the ScalaHosting VPS (Ubuntu 24.04) as root unless noted.
Replace placeholders (`YOUR_VPS_IP`, passwords) before executing.

**Order:** 01 → 10. Verify each step before continuing.

| Script | Purpose |
|--------|---------|
| [01-vps-hardening.sh](./01-vps-hardening.sh) | SSH hardening, UFW, fail2ban |
| [02-nginx-ssl.sh](./02-nginx-ssl.sh) | Nginx reverse proxy + Let's Encrypt |
| [03-postgresql.sh](./03-postgresql.sh) | PostgreSQL 16, pgvector, schemas |
| [04-redis.sh](./04-redis.sh) | Redis 7, internal only |
| [05-minio.sh](./05-minio.sh) | MinIO buckets, internal only |
| [06-pm2.sh](./06-pm2.sh) | PM2 install + ecosystem |
| [07-deploy-app.sh](./07-deploy-app.sh) | Clone repo, npm install, .env |
| [08-backup.sh](./08-backup.sh) | rclone + B2 + cron |
| [09-health-check.sh](./09-health-check.sh) | Start API, verify /health |
| [10-verify.sh](./10-verify.sh) | Full Sprint 1 checklist |
| [11-twenty-plane-dns.md](./11-twenty-plane-dns.md) | DNS for crm/pm/sync-api subdomains |
| [12-deploy-twenty.sh](./12-deploy-twenty.sh) | Twenty CRM Docker stack |
| [13-deploy-plane.sh](./13-deploy-plane.sh) | Plane PM Docker stack |
| [14-nginx-twenty-plane.sh](./14-nginx-twenty-plane.sh) | Apache reverse-proxy via SPanel (Rocky Linux) |
| [15-verify-twenty-plane.sh](./15-verify-twenty-plane.sh) | Integration health checks |
| [16-deploy-integration-api.sh](./16-deploy-integration-api.sh) | Build + migrate + restart integration API |
| [17-print-integration-env.sh](./17-print-integration-env.sh) | Print `.env` block for Twenty/Plane keys |
| [18-rotate-plane-webhook-secret.sh](./18-rotate-plane-webhook-secret.sh) | Rotate exposed Plane webhook secret |
| [19-setup-pm2-api.sh](./19-setup-pm2-api.sh) | PM2 persistence for SYNC API (mhgsynccom) |
| [20-configure-twenty-webhook-env.sh](./20-configure-twenty-webhook-env.sh) | Set Twenty API key + webhook secret in `.env` |
| [21-verify-integration-e2e.sh](./21-verify-integration-e2e.sh) | E2E verify: signed webhooks + inbound worker logs |
| [25-rotate-twenty-webhook-secret.sh](./25-rotate-twenty-webhook-secret.sh) | Rotate Twenty inbound webhook secret |
| [26-rotate-intake-webhook-secret.sh](./26-rotate-intake-webhook-secret.sh) | Rotate intake webhook (Express + FastAPI) |
| [27-rotate-twenty-app-secret.sh](./27-rotate-twenty-app-secret.sh) | Rotate Twenty APP_SECRET (maintenance window) |

## Pre-flight

- DNS: `dig sync.mhgstrategy.com +short` → VPS IP
- Backblaze B2 bucket `mhg-sync-backups` + application key
- GitHub private repo `mhg-sync` accessible from VPS

## Local development

```bash
npm install
npm run stack:up      # Docker: Postgres + Redis + MinIO
npm run dev:api       # Health API on :4000
npm run verify:local
```

See [scripts/local/README.md](../local/README.md) for full local setup.

When ready to use real Claude (not mock LLM): [ENABLE-CLAUDE.md](./ENABLE-CLAUDE.md).

Sprint 6 Finance + Stripe test mode: [STRIPE-SETUP.md](./STRIPE-SETUP.md).

Twenty CRM + Plane PM integration: [TWENTY-PLANE-SETUP.md](./TWENTY-PLANE-SETUP.md) (scripts 11–21).

Sprint 6 VPS deploy (deferred): [VPS-SPRINT6.md](./VPS-SPRINT6.md).

Sprints 7–10 VPS deploy (deferred): [VPS-SPRINT7.md](./VPS-SPRINT7.md), [VPS-SPRINT8.md](./VPS-SPRINT8.md), [VPS-SPRINT9.md](./VPS-SPRINT9.md), [VPS-SPRINT10.md](./VPS-SPRINT10.md).

## VPS go-live (deferred)

Run when ready — requires new Ubuntu 24.04 VPS with root (not shared hosting).

```bash
npm run preflight:vps   # check DNS, credentials before deploying
```

Execute scripts 01–10 in order on the VPS. See [preflight.sh](./preflight.sh).

## Secrets audit

Pre-push hook runs automatically after `npm install`. Manual check:

```bash
npm run secrets-audit
```

## Secrets rotation

Rotation schedule + reminders: [docs/ops/SECRETS_ROTATION.md](../docs/ops/SECRETS_ROTATION.md)

```bash
npm run secrets-rotation:check          # print due/overdue
npm run secrets-rotation:check:notify   # + macOS notification
bash scripts/install-secrets-rotation-reminder.sh   # monthly LaunchAgent (Mac)
```
