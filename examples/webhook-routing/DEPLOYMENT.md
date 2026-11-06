# Customer-owned Cloudflare Worker

Generated from a strict Make blueprint subset. No runtime calls to DECOMMISSION.

## Deployment

1. Inspect generated code, tests, wrangler.toml and .env.example. Set your own account_id in wrangler.toml (or CLOUDFLARE_ACCOUNT_ID) and authenticate with Wrangler.
2. Ensure Node.js 22+ and npm are installed; Wrangler is a development dependency.
3. For macOS/Linux run `bash deploy.sh`; on Windows run `deploy.bat`. Or manually run `npm install`, `npm test`, `node dc-cloudflare.cjs`, `node dc-secrets.js --interactive`, `npx --no-install wrangler deploy`.
4. The helper reads customer-owned .env and prompts for missing values. It never sends secrets to DECOMMISSION. Do not commit .env.
5. Send JSON via HTTP POST to / with x-decommission-key matching your WEBHOOK_SECRET.

## Resilience & limitations

- Automatic retries: GET only; up to 3 bounded retries with jitter for transient responses/network errors. Retry-After is respected within a 2-second per-retry budget; longer requested delays stop automatic retrying. Non-idempotent requests are never retried.
- Durable failed-payload capture requires your own private R2 bucket configured as DECOMMISSION_DLQ (see wrangler.toml). Without it, failure returns 502/503.
- To enable authenticated /replay, set a separate DECOMMISSION_REPLAY_SECRET (32+ characters), and configure R2. Manual replay requires authenticated POST /replay with the DLQ id and acknowledgeDuplicateSideEffects: true. Replays can duplicate partial side effects and are not exactly-once. Private R2 DLQ entries contain original webhook payloads, potentially including personal or confidential information. Restrict bucket access and configure a customer-owned lifecycle retention policy appropriate to the data. Deleting unresolved DLQ records permanently removes recovery evidence; ensure monitoring and review before expiry. See runtime/README.md.
- Slack/Discord failure alerts are optional; only redacted metadata is sent.
- OAuth and state files are deliberately NOT connected to the strict compiler subset. OAuth connectors, pagination, incremental data and other unimplemented Make semantics remain rejected.
- Webhook inputs are limited to 1 MiB of actual UTF-8 bytes and replay requests to 4 KiB; malformed UTF-8 is rejected. Errors, storage service disruptions, unavailable APIs and exhausted resources can still occur. No exactly-once or zero-loss guarantee.
- HTTP v4 redirects are restricted to at most five hops on the ORIGINAL public HTTPS origin; cross-origin redirects are blocked even if Make would follow them. Verify this restriction against your actual API endpoints.
- HTTP v4 JSON-string bodies are serialized safely after field mapping; inspect strings/numeric conversions for your real data.
- Review and independently test all real API behavior and destinations before migrating away from Make.
- Generated source is customer-owned; hosting and maintenance costs are the customer's responsibility.

Supported outgoing origin allowlist: https://api.example.com.

## Licensing and integrity

Purchased archives include root provenance.json and signed manifest. Verify independently using the bundled script and an issuer key obtained from a trusted channel. A green replay report verifies only supplied mocks, not Make production parity.
