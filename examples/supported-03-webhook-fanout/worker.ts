export interface Env {
  SLACK_WEBHOOK_URL: string;
  ANALYTICS_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const event = await request.json();

      // Parallel execution replacing sequential Make.com modules
      const results = await Promise.allSettled([
        // Dispatch to Slack
        fetch(env.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: `New Event: ${event.type} for ${event.userEmail}` })
        }),
        // Dispatch to Analytics
        fetch("https://api.analytics-provider.com/v1/events", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.ANALYTICS_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ eventName: event.type, timestamp: Date.now(), metadata: event })
        })
      ]);

      const succeeded = results.filter(r => r.status === "fulfilled").length;

      return new Response(JSON.stringify({ status: "dispatched", dispatchedTargets: succeeded, totalTargets: 2 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
};
