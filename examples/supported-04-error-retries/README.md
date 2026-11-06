# Supported Example 04: Error Handling, Retries & Dead-Letter Queue

This package demonstrates a converted Make.com scenario featuring robust error management, automated exponential backoff retries, and fallback routing to a Dead-Letter Queue (DLQ) upon failure.

## Architecture Highlights
* **Resilience:** Replaces Make.com directive error handlers with native JavaScript `try/catch` retry loops and backoff delays.
* **Safety:** Automatically captures exhausted requests and forwards them to a DLQ endpoint for audit and manual replay.
