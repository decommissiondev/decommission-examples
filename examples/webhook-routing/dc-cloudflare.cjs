'use strict';
const fs=require('node:fs'),cp=require('node:child_process');
try{
 const config=fs.readFileSync('wrangler.toml','utf8');
 const configured=config.match(/^\s*account_id\s*=\s*"([a-f0-9]{32})"\s*$/m)?.[1];
 const environment=process.env.CLOUDFLARE_ACCOUNT_ID;
 if(environment&&configured&&environment!==configured)throw Error('Cloudflare account settings disagree. Check CLOUDFLARE_ACCOUNT_ID and wrangler.toml.');
 const account=environment||configured;
 if(!account||!/^[a-f0-9]{32}$/.test(account))throw Error('Set your own Cloudflare account_id in wrangler.toml, or CLOUDFLARE_ACCOUNT_ID, before deployment.');
 const result=cp.spawnSync('npx',['--no-install','wrangler','whoami','--json'],{encoding:'utf8',shell:process.platform==='win32',stdio:['ignore','pipe','pipe']});
 if(result.status!==0)throw Error('Cloudflare authentication failed. Sign in with Wrangler or configure your own API token.');
 let user;try{user=JSON.parse(result.stdout)}catch{throw Error('Cloudflare account check returned an invalid response.');}
 if(user.loggedIn!==true||!Array.isArray(user.accounts)||!user.accounts.some(a=>a.id===account))throw Error('Your Cloudflare login cannot access the configured account.');
 console.log('Cloudflare account verified. Secrets and deployment go directly to your account.');
}catch(error){console.error(error.message);process.exitCode=1;}
