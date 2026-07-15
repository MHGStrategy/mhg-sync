# Secrets rotation (MHG SYNC + VPS)

Track rotation dates in [`scripts/secrets-rotation-registry.json`](../scripts/secrets-rotation-registry.json).  
**Never commit actual secret values** — only metadata and last-rotated dates.

## Quick commands (Mac)

```bash
cd "/Users/MHGStrategy/Desktop/MHG Harddrive/Portfolio/MHG SYNC"

# What is due?
npm run secrets-rotation:check

# macOS notification if something is due/overdue
npm run secrets-rotation:check:notify

# After you rotate on VPS, record the date
npm run secrets-rotation:mark -- twenty-app-secret

# One-time: monthly reminder (1st of month, 9 AM)
bash scripts/install-secrets-rotation-reminder.sh
```

## Jul 2026 maintenance — rotate now

Priority order on VPS (`ssh -p 6543 root@165.140.159.201`):

| Priority | Secret | Why | Script |
|----------|--------|-----|--------|
| **1 — now** | `TWENTY_APP_SECRET` | Seen in terminal grep during debugging | `bash scripts/setup/27-rotate-twenty-app-secret.sh` |
| 2 — optional | `PLANE_WEBHOOK_SECRET` | Never recorded; rotate if ever exposed | `bash scripts/setup/18-rotate-plane-webhook-secret.sh` |
| 3 — skip unless exposed | Intake / Twenty webhooks | Aligned Jul 9; next due ~Oct 2026 | `26` / `25` |

### 1. Twenty APP_SECRET (~5 min, brief CRM logout)

```bash
cd /home/mhgsynccom/mhg-sync
bash scripts/setup/27-rotate-twenty-app-secret.sh
```

Then on Mac:

```bash
npm run secrets-rotation:mark -- twenty-app-secret
```

Verify: open https://crm.mhgstrategy.com and sign in; intake webhook still HTTP 202.

### 2. Plane webhook (optional)

```bash
cd /home/mhgsynccom/mhg-sync
bash scripts/setup/18-rotate-plane-webhook-secret.sh
npm run secrets-rotation:mark -- plane-webhook   # on Mac after
```

### Webhook secrets (when due)

**Twenty inbound** — updates Express `.env` + Twenty UI:

```bash
bash scripts/setup/25-rotate-twenty-webhook-secret.sh
```

**Intake FastAPI ↔ Express** — updates both `.env` files:

```bash
bash scripts/setup/26-rotate-intake-webhook-secret.sh
```

## Reminder system

| Layer | What it does |
|-------|----------------|
| **Registry** | `secrets-rotation-registry.json` — names, intervals, last rotated |
| **Check script** | `secrets-rotation-check.mjs` — prints DUE_SOON / OVERDUE |
| **macOS LaunchAgent** | `install-secrets-rotation-reminder.sh` — notification 1st of month |
| **Manual** | Run `npm run secrets-rotation:check` before any VPS maintenance |

Default interval: **90 days** (webhooks), **365 days** (APP_SECRET, Redis, portal JWT).

## Where secrets live (VPS)

| Secret | File(s) |
|--------|---------|
| Intake webhook | `/home/mhgsynccom/mhg-sync/.env`, `/home/mhgsynccom/mhgsync-app/.env` |
| Twenty webhook + API key | `/home/mhgsynccom/mhg-sync/.env` |
| Twenty APP_SECRET + DB | `/home/mhgsynccom/mhg-sync-integration/twenty/.env.twenty` |
| Plane webhook | `/home/mhgsynccom/mhg-sync/.env` |
| Redis | `/home/mhgsynccom/mhg-sync/.env` |

After any `.env` change affecting PM2:

```bash
sudo -u mhgsynccom pm2 restart api --update-env
sudo -u mhgsynccom pm2 save
```

## Adding a new tracked secret

1. Add an entry to `secrets-rotation-registry.json` (no values, only keys/paths).
2. Optionally add `scripts/setup/NN-rotate-….sh`.
3. Run `npm run secrets-rotation:check`.

## Pre-push safety

`npm run secrets-audit` blocks committing `.env` files or API keys to git. Rotation registry is safe to commit — it only stores dates and file paths.
