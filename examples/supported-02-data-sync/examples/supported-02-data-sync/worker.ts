export interface Env {
  SOURCE_API_KEY: string;
  TARGET_API_KEY: string;
}

export default {
  // Cloudflare Cron Trigger handler replacing Make.com scenario schedule
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[DECOMMISSION Engine] Starting scheduled data sync execution...`);

    // 1. Fetch modified customer records from source CRM
    const sourceResponse = await fetch("https://api.source-crm.com/v1/customers/delta", {
      headers: {
        "Authorization": `Bearer ${env.SOURCE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!sourceResponse.ok) {
      throw new Error(`Source CRM fetch failed with status ${sourceResponse.status}`);
    }

    const records = await sourceResponse.json();

    // 2. Batch update target database
    const targetResponse = await fetch("https://api.target-db.com/v1/sync", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.TARGET_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ syncedRecords: records })
    });

    console.log(`[DECOMMISSION Engine] Sync completed. Status: ${targetResponse.status}`);
  }
};
