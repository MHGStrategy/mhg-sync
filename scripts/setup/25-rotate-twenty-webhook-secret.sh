#!/usr/bin/env bash
# Rotate TWENTY_WEBHOOK_SECRET on VPS. Update Twenty UI webhook secret to match.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${REPO_ROOT}/.env"
NEW_SECRET="$(openssl rand -hex 32)"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found"
  exit 1
fi

echo "==> New TWENTY_WEBHOOK_SECRET (update Twenty UI before testing):"
echo "${NEW_SECRET}"
echo ""

if grep -q '^TWENTY_WEBHOOK_SECRET=' "${ENV_FILE}"; then
  sed -i "s|^TWENTY_WEBHOOK_SECRET=.*|TWENTY_WEBHOOK_SECRET=${NEW_SECRET}|" "${ENV_FILE}"
else
  echo "TWENTY_WEBHOOK_SECRET=${NEW_SECRET}" >> "${ENV_FILE}"
fi
echo "==> Updated ${ENV_FILE}"

echo ""
echo "MANUAL: Twenty (https://crm.mhgstrategy.com) → Settings → Webhooks → edit:"
echo "  URL: https://sync.mhgstrategy.com/api/webhooks/twenty"
echo "  Secret: ${NEW_SECRET}"
echo ""
read -r -p "Press Enter after updating Twenty UI, or Ctrl+C to abort..."

if command -v pm2 >/dev/null 2>&1 && pm2 describe api >/dev/null 2>&1; then
  sudo -u mhgsynccom pm2 restart api --update-env 2>/dev/null || pm2 restart api --update-env
  sudo -u mhgsynccom pm2 save 2>/dev/null || pm2 save 2>/dev/null || true
else
  bash "${REPO_ROOT}/scripts/setup/19-setup-pm2-api.sh" --restart-only
fi

BODY='{"event":"person.updated","data":{"id":"rotate-test","firstName":"Rotate"},"timestamp":"2026-07-15T12:00:00Z"}'
SIG=$(printf '%s' "${BODY}" | openssl dgst -sha256 -hmac "${NEW_SECRET}" | awk '{print $2}')
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:4000/api/webhooks/twenty \
  -H "Content-Type: application/json" -H "x-twenty-webhook-signature: ${SIG}" -d "${BODY}")
echo "  POST /api/webhooks/twenty (signed) → HTTP ${CODE}"
if [[ "${CODE}" != "200" ]]; then
  echo "ERROR: expected 200 — check secret matches Twenty UI and API is running"
  exit 1
fi

echo "==> Twenty webhook secret rotation complete."
echo "On your Mac (MHG SYNC repo): npm run secrets-rotation:mark -- twenty-webhook"
