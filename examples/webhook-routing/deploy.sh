#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo 'Install Node.js 22+.' >&2; exit 1; }
command -v npm >/dev/null || { echo 'Install npm.' >&2; exit 1; }
if ! npx --no-install wrangler --version >/dev/null 2>&1; then
  echo 'Installing project dev dependencies (including Wrangler)...'
  npm install
fi
npm test
node dc-cloudflare.cjs
node dc-secrets.js --interactive
npx --no-install wrangler deploy
