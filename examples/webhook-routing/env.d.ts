export interface R2Store {
  get(key:string):Promise<{text():Promise<string>}|null>;
  put(key:string,contents:string,options?:{httpMetadata?:{contentType?:string}}):Promise<unknown>;
}
export interface Env {
  WEBHOOK_SECRET: string;
  API_TOKEN: string;
  DECOMMISSION_REPLAY_SECRET?: string;
  DECOMMISSION_DLQ?: R2Store;
  SLACK_ERROR_WEBHOOK_URL?: string;
  DISCORD_ERROR_WEBHOOK_URL?: string;
}
