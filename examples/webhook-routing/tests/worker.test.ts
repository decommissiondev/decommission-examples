import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker';

test('webhook requires authentication', async () => {
 const response=await worker.fetch(new Request('https://example.workers.dev',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),{WEBHOOK_SECRET:'test-secret',API_TOKEN:'test-API_TOKEN'});
 assert.equal(response.status,401);
});

test('replay is disabled without private R2 and replay secret',async()=>{
 const response=await worker.fetch(new Request('https://example.workers.dev/replay',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),{WEBHOOK_SECRET:'test-secret',API_TOKEN:'test-API_TOKEN'});
 assert.equal(response.status,404);
});
