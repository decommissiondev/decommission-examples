/** Optional customer-owned D1 cursor adapter; currently NOT wired to the compiler IR.
 * No transient header/timestamp fallback: that would silently lose incremental state.
 * Consumers must supply a D1 binding and implement idempotent state transitions. */
interface QueryResult {results?:unknown[]}
export interface D1CursorDb {prepare(sql:string):{bind(...args:unknown[]):{first<T>():Promise<T|null>;run():Promise<unknown>}}}
export class CursorStore {
  constructor(private readonly db:D1CursorDb|undefined){if(!db)throw Error('D1 cursor binding required; refusing stateless fallback')}
  async read(name:string):Promise<string|null>{
    if(!/^[a-zA-Z0-9_-]{1,80}$/.test(name))throw Error('Invalid cursor name');
    const result=await this.db!.prepare('SELECT value FROM decommission_cursors WHERE name=?').bind(name).first<{value:string}>();
    return result?.value??null;
  }
  async write(name:string,value:string):Promise<void>{
    if(!/^[a-zA-Z0-9_-]{1,80}$/.test(name)||value.length>4096)throw Error('Invalid cursor');
    await this.db!.prepare('INSERT INTO decommission_cursors(name,value) VALUES(?,?) ON CONFLICT(name) DO UPDATE SET value=excluded.value')
      .bind(name,value).run();
  }
}
