#!/usr/bin/env bash
# Rotate intake webhook secret in BOTH Express and FastAPI env files on VPS.
set -euo pipefail

SYNC_ENV="${SYNC_ENV:-/home/mhgsynccom/mhg-sync/.env}"
FASTAPI_ENV="${FASTAPI_ENV:-/home/mhgsynccom/mhgsync-app/.env}"
NEW_SECRET="$(openssl rand -hex 32)"

for f in "${SYNC_ENV}" "${FASTAPI_ENV}"; do
  if [[ ! -f "${f}" ]]; then
    echo "ERROR: ${f} not found"
    exit 1
  fi
done

echo "==> New intake webhook secret (64 hex chars):"
echo "${NEW_SECRET}"
echo ""

if grep -q '^INTAKE_WEBHOOK_SECRET=' "${SYNC_ENV}"; then
  sed -i "s|^INTAKE_WEBHOOK_SECRET=.*|INTAKE_WEBHOOK_SECRET=${NEW_SECRET}|" "${SYNC_ENV}"
else
  echo "INTAKE_WEBHOOK_SECRET=${NEW_SECRET}" >> "${SYNC_ENV}"
fi

if grep -q '^SYNC_INTAKE_WEBHOOK_SECRET=' "${FASTAPI_ENV}"; then
  sed -i "s|^SYNC_INTAKE_WEBHOOK_SECRET=.*|SYNC_INTAKE_WEBHOOK_SECRET=${NEW_SECRET}|" "${FASTAPI_ENV}"
else
  echo "SYNC_INTAKE_WEBHOOK_SECRET=${NEW_SECRET}" >> "${FASTAPI_ENV}"
fi

echo "==> Updated:"
echo "  ${SYNC_ENV} (INTAKE_WEBHOOK_SECRET)"
echo "  ${FASTAPI_ENV} (SYNC_INTAKE_WEBHOOK_SECRET)"
echo ""
echo "==> Confirm both match:"
grep -h '^INTAKE_WEBHOOK_SECRET=\|^SYNC_INTAKE_WEBHOOK_SECRET=' "${SYNC_ENV}" "${FASTAPI_ENV}"
echo ""

sudo -u mhgsynccom pm2 restart api mhgsync-backend --update-env
sudo -u mhgsynccom pm2 save 2>/dev/null || true
sleep 3

CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:4000/api/webhooks/intake \
  -H "Content-Type: application/json" \
  -H "x-intake-secret: ${NEW_SECRET}" \
  -d '{"email":"rotate-test@example.com","source":"rotation-smoke"}')
echo "  POST /api/webhooks/intake → HTTP ${CODE}"
if [[ "${CODE}" != "202" && "${CODE}" != "200" ]]; then
  echo "WARNING: expected 202 — check API logs if not 401"
fi

echo "==> Intake webhook secret rotation complete."
echo "On your Mac (MHG SYNC repo): npm run secrets-rotation:mark -- intake-webhook"
