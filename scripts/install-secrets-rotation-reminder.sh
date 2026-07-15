#!/usr/bin/env bash
# Install a monthly macOS reminder to check secret rotation dates.
set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  exit 0
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLIST_SRC="${ROOT}/scripts/launchd/com.mhgstrategy.secrets-rotation-check.plist"
PLIST_DEST="${HOME}/Library/LaunchAgents/com.mhgstrategy.secrets-rotation-check.plist"
NODE="$(command -v node || true)"

if [[ -z "${NODE}" ]]; then
  echo "ERROR: node not found in PATH"
  exit 1
fi

mkdir -p "${HOME}/Library/LaunchAgents"

sed "s|__NODE__|${NODE}|g; s|__ROOT__|${ROOT}|g" "${PLIST_SRC}" > "${PLIST_DEST}"

launchctl bootout "gui/$(id -u)" "${PLIST_DEST}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "${PLIST_DEST}"
launchctl enable "gui/$(id -u)/com.mhgstrategy.secrets-rotation-check" 2>/dev/null || true

echo "Installed monthly secrets rotation reminder:"
echo "  ${PLIST_DEST}"
echo ""
echo "Runs 1st of each month at 9:00 AM — macOS notification if anything is due."
echo "Test now: npm run secrets-rotation:check:notify"
echo ""
echo "To remove:"
echo "  launchctl bootout gui/$(id -u) ${PLIST_DEST}"
echo "  rm ${PLIST_DEST}"
