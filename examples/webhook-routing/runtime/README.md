# Generated runtime boundaries

- The compiled Worker currently supports the strict webhook/HTTP/set/parse/router subset only.
- `oauth.ts` is an **unwired** customer-side helper; the compiler still rejects Make OAuth connections.
- `state.ts` is an **unwired** D1 adapter; the compiler still rejects incremental polling, pagination and iterators.
- Only GET receives bounded retries (3 retries after the initial request; transient 408/429/5xx or network failure). POST/PUT/PATCH/DELETE are **never** automatically retried because they may have side effects.
- Configure a private R2 bucket as `DECOMMISSION_DLQ` to capture authenticated webhook execution failures. Without R2 a failure returns HTTP 502 or 503 and no durable capture is claimed.
- HTTP 202 means the failed input was saved for manual review/replay, **not that the workflow succeeded**. Manual replay may duplicate upstream side effects: inspect downstream state first.
- Configure `DECOMMISSION_REPLAY_SECRET` (32+ chars) as a distinct Wrangler secret to enable POST `/replay`. Supply `x-decommission-replay-key` and `{"id":"failed/YYYY-MM-DD/UUID.json"}`. Records are retained after replay; delete them manually after verification.
- Original failing payloads may contain personal information. The R2 bucket is customer-owned: lock down access, configure lifecycle/deletion policy, and review privacy responsibilities.
- Slack/Discord alerts are optional and include only a timestamp, module ID and failure record ID; no payload, stack or secrets.
- OAuth and state helpers are shipped solely as future customer-side building blocks. They do not grant semantics not present in the compiled IR.
- Do not run the generated Worker and the Make scenario live against the same production destination during cutover.
- Automated mocks do not prove Make production behavioral parity or exactly-once delivery.
