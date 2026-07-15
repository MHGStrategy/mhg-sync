#!/usr/bin/env node
/**
 * Report secrets due for rotation from secrets-rotation-registry.json.
 * Usage:
 *   node scripts/secrets-rotation-check.mjs
 *   node scripts/secrets-rotation-check.mjs --notify   # macOS notification if due/overdue
 *   node scripts/secrets-rotation-check.mjs --json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = path.join(ROOT, 'scripts/secrets-rotation-registry.json');

const args = new Set(process.argv.slice(2));
const notify = args.has('--notify');
const asJson = args.has('--json');

function parseDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function loadRegistry() {
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  return JSON.parse(raw);
}

function evaluateSecret(entry, defaults) {
  const interval = entry.rotateEveryDays ?? defaults.defaultRotateEveryDays ?? 90;
  const warnDays = defaults.warnDaysBefore ?? 14;
  const last = parseDate(entry.lastRotated);
  const today = new Date();
  today.setUTCHours(12, 0, 0, 0);

  let status;
  let nextDue = null;
  let daysUntil = null;

  if (!last) {
    status = entry.priority === 'high' ? 'OVERDUE' : 'NEVER_ROTATED';
    daysUntil = -999;
  } else {
    nextDue = addDays(last, interval);
    daysUntil = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) status = 'OVERDUE';
    else if (daysUntil <= warnDays) status = 'DUE_SOON';
    else status = 'OK';
  }

  return { ...entry, interval, warnDays, last, nextDue, daysUntil, status };
}

function macNotify(title, message) {
  if (process.platform !== 'darwin') return;
  const safe = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  try {
    execSync(
      `osascript -e "display notification \\"${safe(message)}\\" with title \\"${safe(title)}\\""`,
      { stdio: 'ignore' },
    );
  } catch {
    /* best effort */
  }
}

const registry = loadRegistry();
const rows = registry.secrets.map((s) => evaluateSecret(s, registry));

const attention = rows.filter((r) => r.status === 'OVERDUE' || r.status === 'NEVER_ROTATED' || r.status === 'DUE_SOON');

if (asJson) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), secrets: rows }, null, 2));
  process.exit(attention.some((r) => r.status === 'OVERDUE' || r.status === 'NEVER_ROTATED') ? 1 : 0);
}

console.log('MHG SYNC — secrets rotation check');
console.log(`Registry: ${REGISTRY_PATH}`);
console.log(`Today: ${formatDate(new Date())}`);
console.log('');

const col = (s, w) => String(s).padEnd(w);
console.log(col('STATUS', 16) + col('DUE', 12) + col('ID', 22) + 'NAME');
console.log('-'.repeat(72));

for (const row of rows) {
  const due =
    row.nextDue != null
      ? formatDate(row.nextDue)
      : row.status === 'NEVER_ROTATED'
        ? 'never set'
        : '—';
  console.log(col(row.status, 16) + col(due, 12) + col(row.id, 22) + row.name);
  if (row.notes) console.log(`  ↳ ${row.notes}`);
  if (row.rotateScript && (row.status !== 'OK')) {
    console.log(`  ↳ rotate: bash ${row.rotateScript}`);
  }
}

console.log('');
if (attention.length === 0) {
  console.log('All tracked secrets are within rotation window.');
} else {
  console.log(`${attention.length} secret(s) need attention. See docs/ops/SECRETS_ROTATION.md`);
  console.log('After rotating, run: npm run secrets-rotation:mark -- <id>');
}

if (notify && attention.length > 0) {
  const headline = attention
    .filter((r) => r.status === 'OVERDUE' || r.status === 'NEVER_ROTATED')
    .map((r) => r.id)
    .join(', ');
  const msg =
    headline.length > 0
      ? `${headline} — run npm run secrets-rotation:check in MHG SYNC`
      : `${attention.length} secret(s) due within ${registry.warnDaysBefore} days`;
  macNotify('MHG SYNC secret rotation', msg);
}

const exitCode = rows.some((r) => r.status === 'OVERDUE' || r.status === 'NEVER_ROTATED') ? 1 : 0;
process.exit(exitCode);
