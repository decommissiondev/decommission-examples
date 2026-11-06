export interface Env {
  CRM_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const payload = await request.json();

      const crmResponse = await fetch("https://api.crm-example.com/v1/leads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.CRM_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: payload.email,
          source: payload.source || "inbound_webhook"
        })
      });

      return new Response(JSON.stringify({ status: "routed", code: crmResponse.status }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
};
