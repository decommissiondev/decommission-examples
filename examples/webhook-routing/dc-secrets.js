#!/usr/bin/env node
'use strict';
// Secrets remain on the CUSTOMER's machine and are sent straight to Cloudflare Wrangler.
// Nothing is sent to DECOMMISSION. Never log or persist secret values.
const fs=require('node:fs');const cp=require('node:child_process');const readline=require('node:readline');
const required=["WEBHOOK_SECRET","API_TOKEN"];
function readEnv(){
  if(!fs.existsSync('.env'))return {};
  const source=fs.readFileSync('.env','utf8');const result={};
  for(const [index,line] of source.split(/\r?\n/).entries()){
    const trimmed=line.trim();if(!trimmed||trimmed.startsWith('#'))continue;
    const m=/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
    if(!m)throw Error(`Unsupported .env syntax at line ${index+1}; use KEY=value, one line per key`);
    if(Object.prototype.hasOwnProperty.call(result,m[1]))throw Error(`Duplicate .env entry: ${m[1]}`);
    let value=m[2].trim();
    if(value.startsWith('"')&&value.endsWith('"'))value=value.slice(1,-1);
    else if(value.startsWith("'")&&value.endsWith("'"))value=value.slice(1,-1);
    if(value.includes('\n')||value.includes('\r'))throw Error('Multiline secrets are not supported');
    result[m[1]]=value;
  }
  return result;
}
async function askHidden(key){
  if(!process.stdin.isTTY)throw Error(`Missing ${key} in .env; interactive Terminal required`);
  process.stdout.write(`Enter Cloudflare secret ${key} (hidden): `);
  const rl=readline.createInterface({input:process.stdin,output:process.stdout,terminal:true});
  const original=rl._writeToOutput.bind(rl);rl._writeToOutput=()=>{};
  const value=await new Promise(resolve=>rl.question('',resolve));
  rl._writeToOutput=original;rl.close();process.stdout.write('\n');
  return value;
}
async function main(){
  const vars=readEnv();
  const check=cp.spawnSync('npx',['--no-install','wrangler','--version'],{stdio:'ignore'});
  if(check.status!==0)throw Error('Wrangler unavailable; run npm install before deploying');
  const interactive=process.argv.includes('--interactive');
  for(const name of required){
    let value=vars[name];
    if((!value||value==='REPLACE_ME')&&interactive)value=await askHidden(name);
    if(!value||value==='REPLACE_ME')throw Error(`Required secret ${name} missing or placeholder`);
    if(value.length<1)throw Error(`Empty ${name}`);
    const result=cp.spawnSync('npx',['--no-install','wrangler','secret','put',name],{input:value+'\n',encoding:'utf8',stdio:['pipe','inherit','inherit']});
    if(result.status!==0)throw Error(`Failed uploading ${name}; stopping deployment`);
  }
  for(const name of ['DECOMMISSION_REPLAY_SECRET','SLACK_ERROR_WEBHOOK_URL','DISCORD_ERROR_WEBHOOK_URL']){
    const value=vars[name];if(!value)continue;
    if(name==='DECOMMISSION_REPLAY_SECRET'&&value.length<32)throw Error('Replay secret must be at least 32 characters');
    const result=cp.spawnSync('npx',['--no-install','wrangler','secret','put',name],{input:value+'\n',encoding:'utf8',stdio:['pipe','inherit','inherit']});
    if(result.status!==0)throw Error(`Failed uploading ${name}; stopping deployment`);
  }
  console.log('Cloudflare secret submission complete. Values were not printed or sent to DECOMMISSION.');
}
main().catch(err=>{console.error('Deployment stopped:',err.message);process.exitCode=1});
