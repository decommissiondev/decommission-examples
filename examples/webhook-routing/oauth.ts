/** Optional customer-side OAuth building block, NOT wired to unsupported Make OAuth nodes.
 * DECOMMISSION intentionally rejects OAuth-connected modules until provider-specific
 * scopes, token rotation, refresh concurrency and mapping can be verified. */
export interface OAuthRefreshSettings {
  tokenEndpoint:string; expectedOrigin:string; clientId:string; clientSecret:string;refreshToken:string;
}
export interface OAuthAccessToken {accessToken:string; expiresInSeconds:number|null; rotatedRefreshToken?:string}
export class OAuthManager {
  static async refresh(settings:OAuthRefreshSettings,requester:typeof fetch=fetch):Promise<OAuthAccessToken>{
    const u=new URL(settings.tokenEndpoint);
    if(u.protocol!=='https:'||u.origin!==settings.expectedOrigin||u.username||u.password||u.hash)throw Error('OAuth issuer is not allowlisted');
    if(!settings.clientId||!settings.clientSecret||!settings.refreshToken)throw Error('OAuth credentials must come from customer secrets');
    const response=await requester(u.toString(),{method:'POST',redirect:'error',headers:{'content-type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({grant_type:'refresh_token',client_id:settings.clientId,client_secret:settings.clientSecret,refresh_token:settings.refreshToken})});
    if(!response.ok)throw Error('OAuth refresh failed');
    const token=await response.json() as Record<string,unknown>;
    if(typeof token.access_token!=='string'||!token.access_token)throw Error('Invalid OAuth refresh response');
    return {accessToken:token.access_token,expiresInSeconds:typeof token.expires_in==='number'?token.expires_in:null,
      rotatedRefreshToken:typeof token.refresh_token==='string'?token.refresh_token:undefined};
  }
}
