export interface Env {
  SOURCE_API_KEY: string;
  TARGET_API_KEY: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[DECOMMISSION Engine] Starting scheduled data sync execution...`);

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
