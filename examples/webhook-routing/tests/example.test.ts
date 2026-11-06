import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash,verify} from 'node:crypto';
import {execute} from '../worker';

for(const active of [true,false])test(`lookup maps input and takes ${active?'active':'inactive'} route`,async()=>{
 let calls=0;
 const result=await execute({customer:'Synthetic customer'},{WEBHOOK_SECRET:'test-only',API_TOKEN:'test-only'},(async(url:any,init:any)=>{
  calls++;assert.equal(String(url),'https://api.example.com/v1/lookup');assert.equal(init.method,'POST');
  assert.deepEqual(JSON.parse(init.body),{customer:'Synthetic customer'});
  assert.equal(new Headers(init.headers).get('authorization'),'Bearer test-only');
  return Response.json({status:active?'active':'inactive'});
 }) as typeof fetch);
 assert.equal(calls,1);assert.equal(result.status,200);
 assert.ok(result.body.executed.includes(active?4:5));assert.ok(!result.body.executed.includes(active?5:4));
 assert.ok(result.body.terminal.some((x:any)=>x.result?.accepted===active&&x.result?.customer==='Synthetic customer'));
});

test('recorded production replay is signed and belongs to this blueprint',()=>{
 const {report,signature}=JSON.parse(readFileSync('replay-report.json','utf8'));
 const key=readFileSync('issuer-public-key.pem','utf8');
 assert.equal(report.passed,true);assert.equal(report.cases.length,2);
 assert.equal(report.blueprintSha256,createHash('sha256').update(JSON.stringify(JSON.parse(readFileSync('blueprint.json','utf8')))).digest('hex'));
 assert(verify(null,Buffer.from(JSON.stringify(report)),key,Buffer.from(signature,'base64')));
 // The report's own warning is part of the signed material.
 assert.match(report.warning,/NOT proof of production Make/);
});

test('checked-in Worker reproduces the signed report hashes with the recorded fixtures',async()=>{
 const cases=JSON.parse(readFileSync('replay-cases.json','utf8'));
 const {report}=JSON.parse(readFileSync('replay-report.json','utf8'));
 const canonical=(v:any):any=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
 for(const c of cases){
  const calls:any[]=[];
  const result=await execute(c.input,{WEBHOOK_SECRET:'not-used',API_TOKEN:'LOCAL_REPLAY_ONLY_API_TOKEN'},(async(url:any,init:any)=>{
   const method=String(init.method??'GET').toUpperCase();
   const headers:[string,string][]=[];new Headers(init.headers).forEach((v,k)=>headers.push([k,v]));
   calls.push({url,method,body:init.body?String(init.body):null,headers:headers.sort(([a],[b])=>a.localeCompare(b))});
   const mock=c.mocks.find((m:any)=>m.url===url&&m.method.toUpperCase()===method);assert.ok(mock,'Every request must have an explicit mock');
   return Response.json(mock.body,{status:mock.status});
  }) as typeof fetch);
  const digest=createHash('sha256').update(JSON.stringify(canonical({result,calls}))).digest('hex');
  assert.equal(digest,report.cases.find((r:any)=>r.name===c.name).generatedSha256);
 }
});
