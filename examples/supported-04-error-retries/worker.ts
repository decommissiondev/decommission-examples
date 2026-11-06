export interface Env {
  DLQ_WEBHOOK_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const payload = await request.json();
    let attempts = 0;
    const maxRetries = 3;
    let success = false;
    let lastError = "";

    // Retry loop with exponential backoff replacing Make.com error handlers
    while (attempts < maxRetries && !success) {
      attempts++;
      try {
        const response = await fetch("https://api.unstable-service.com/v1/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          success = true;
          break;
        }
        lastError = `HTTP error status: ${response.status}`;
      } catch (err: any) {
        lastError = err.message;
      }

      if (!success && attempts < maxRetries) {
        // Exponential backoff delay: 200ms, 400ms, etc.
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 100));
      }
    }

    // If all retries fail, route to Dead-Letter Queue (DLQ)
    if (!success) {
      console.error(`[DECOMMISSION Engine] Exhausted ${maxRetries} retries. Routing to DLQ.`);
      try {
        await fetch(env.DLQ_WEBHOOK_URL || "https://api.dlq-handler.com/v1/catch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ failedPayload: payload, error: lastError, attempts })
        });
      } catch (dlqErr) {
        console.error(`[DECOMMISSION Engine] DLQ dispatch failed:`, dlqErr);
      }

      return new Response(JSON.stringify({ status: "failed_routed_to_dlq", error: lastError }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ status: "success", attempts }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
