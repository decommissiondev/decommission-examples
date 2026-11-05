export interface Env {
  CRM_API_ENDPOINT: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const payload: any = await request.json();
      
      const crmResponse = await fetch(env.CRM_API_ENDPOINT || "https://api.crm-example.com/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          source: payload.source || "webhook"
        })
      });

      return new Response(JSON.stringify({ status: "success", forwarded: crmResponse.ok }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
  }
};
