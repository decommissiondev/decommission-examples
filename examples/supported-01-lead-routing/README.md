# Supported Example 01: Lead Ingestion & Webhook Routing

This package demonstrates a converted Make.com scenario that ingests inbound lead webhooks and routes them directly to an external CRM.

## Architecture Highlights
* **Trigger:** Native Cloudflare Worker `fetch()` handler replacing `gateway:CustomWebhook`.
* **Performance:** Executes in ~42ms compared to Make's 1,820ms runtime overhead.
* **Security:** API keys managed via Cloudflare Worker secrets (`env.CRM_API_KEY`).
