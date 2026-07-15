#!/usr/bin/env bash
# Rotate TWENTY_APP_SECRET (Twenty session signing key). Brief maintenance window — users re-login.
set -euo pipefail

TWENTY_DIR="${TWENTY_DIR:-/home/mhgsynccom/mhg-sync-integration/twenty}"
ENV_FILE="${TWENTY_DIR}/.env.twenty"
NEW_SECRET="$(openssl rand -hex 32)"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found"
  echo "Find live file: find /home/mhgsynccom -name '.env.twenty' 2>/dev/null"
  exit 1
fi

echo "==> This rotates Twenty APP_SECRET. All CRM sessions will invalidate (~2 min downtime)."
echo "==> New TWENTY_APP_SECRET:"
echo "${NEW_SECRET}"
echo ""
read -r -p "Continue? [y/N] " confirm
[[ "${confirm}" == [yY] ]] || exit 0

if grep -q '^TWENTY_APP_SECRET=' "${ENV_FILE}"; then
  sed -i "s|^TWENTY_APP_SECRET=.*|TWENTY_APP_SECRET=${NEW_SECRET}|" "${ENV_FILE}"
else
  echo "TWENTY_APP_SECRET=${NEW_SECRET}" >> "${ENV_FILE}"
fi
echo "==> Updated ${ENV_FILE}"

cd "${TWENTY_DIR}"
docker compose --env-file .env.twenty up -d --force-recreate twenty-server twenty-worker 2>/dev/null \
  || docker compose --env-file .env.twenty restart twenty-server twenty-worker

echo "==> Waiting for Twenty health..."
for i in $(seq 1 24); do
  if curl -sf http://127.0.0.1:3004/healthz >/dev/null 2>&1; then
    echo "Twenty ready on :3004"
    break
  fi
  echo "  waiting... (${i})"
  sleep 5
done

curl -sf http://127.0.0.1:3004/healthz && echo " OK" || {
  echo "ERROR: Twenty health check failed — docker compose --env-file .env.twenty logs twenty-server"
  exit 1
}

echo "==> TWENTY_APP_SECRET rotation complete. Sign in to CRM again to verify."
echo "On your Mac (MHG SYNC repo): npm run secrets-rotation:mark -- twenty-app-secret"
