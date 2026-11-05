Markdown
# Module Compatibility Matrix

This document defines which Make.com (Integromat) modules, features, and functions are supported for direct compilation into Cloudflare Workers via the **DECOMMISSION** engine.

---

## 1. Supported Modules & Features

| Category | Make.com Module / Feature | Compiled Output Target |
| :--- | :--- | :--- |
| **Triggers** | Custom Webhook (`gateway:CustomWebhook`) | Cloudflare Worker HTTP `fetch` event handler |
| | Instant Webhooks (`webhooks:Webhook`) | Native HTTP payload parsing |
| **HTTP & API** | Action: Make a Request (`http:ActionMakeRequest`) | Web API standard `fetch()` |
| | OAuth / Auth Headers | Injected Environment Variables (`env.SECRET_KEY`) |
| **Data Operations** | JSON: Parse JSON (`json:ParseJSON`) | `JSON.parse()` with runtime schema verification |
| | JSON: Create JSON (`json:CreateJSON`) | `JSON.stringify()` with structured typing |
| | Tools: Set variable (`util:SetVariable`) | Native TypeScript variable scope |
| **Logic & Control** | Deterministic Routers & Filters | TypeScript `if / else` and `switch` statements |
| | Array Manipulations (Map, Filter, Flat) | Native JavaScript Array methods (`.map()`, `.filter()`) |

---

## 2. Unsupported / Restricted Features

The following pattern types currently require architectural adaptation or standard Cloudflare bindings before compilation:

* **Stateful Database Connections:** Direct TCP database connectors (e.g., MySQL, PostgreSQL) require switching to HTTPS APIs, Cloudflare Hyperdrive, or HTTP ORMs (Prisma Postgres / Supabase).
* **Long-Running Loops / Polling:** Scenario pollers that sleep for extended periods should be refactored into **Cloudflare Cron Triggers** (`scheduled` events).
* **Heavy File Transfers:** Large binary payload processing (>100 MB memory footprint) must leverage **Cloudflare R2** bindings rather than in-memory buffering.
* **Third-Party Native SDKs:** Modules relying on un-exported internal Make app definitions compile down to their underlying REST API equivalents.

---

## 3. Verification & Compliance

Every scenario compiled by DECOMMISSION produces a companion `replay-report.json` containing:
1. **Input/Output Parity:** Proof that the Worker output matches Make scenario outputs across test fixtures.
2. **Determinism Verification:** Validation that execution flows without state loss or unexpected side effects.
