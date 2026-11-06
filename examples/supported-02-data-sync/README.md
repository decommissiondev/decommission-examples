# Supported Example 02: Scheduled Data Synchronization

This package demonstrates a converted Make.com scenario that runs on a recurring cron schedule, pulling incremental updates from a CRM API and synchronizing them to a target database.

## Architecture Highlights
* **Trigger:** Native Cloudflare Worker `scheduled()` cron handler (`0 */6 * * *`).
* **Performance:** Executes in ~110ms compared to Make's 2,400ms overhead.
* **Security:** API keys injected via environment secrets (`env.SOURCE_API_KEY`, `env.TARGET_API_KEY`).
