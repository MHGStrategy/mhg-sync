#!/usr/bin/env node
/**
 * Record that a secret was rotated today.
 * Usage: node scripts/secrets-rotation-mark.mjs <secret-id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = path.join(ROOT, 'scripts/secrets-rotation-registry.json');
const id = process.argv[2];

if (!id) {
  console.error('Usage: npm run secrets-rotation:mark -- <secret-id>');
  console.error('Example: npm run secrets-rotation:mark -- twenty-app-secret');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const entry = registry.secrets.find((s) => s.id === id);
if (!entry) {
  console.error(`Unknown secret id: ${id}`);
  console.error('Known ids:', registry.secrets.map((s) => s.id).join(', '));
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
entry.lastRotated = today;
if (entry.priority === 'high') entry.priority = 'medium';
delete entry.notes;

fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Marked ${id} as rotated on ${today}`);
console.log('Commit secrets-rotation-registry.json if you track rotation dates in git.');
