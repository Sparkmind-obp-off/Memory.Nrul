import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings, MemoryRecord } from './types'
import { MemoryRepository } from './memory/repository'
import { buildMemory } from './memory/lifecycle'
import { filterByPrivacy, assertExternalPrivacy } from './memory/privacy'
import { retrieve } from './memory/retrieval'
import { buildContextPackage, formatSystemContext } from './context/package'
import { buildCheckpoint } from './checkpoint/service'
import { configuredSecret, isAuthenticated, requireAuth, sessionCookie } from './auth/auth'
import { createAIProvider } from './ai'

const app=new Hono<{Bindings:Bindings}>()
app.use('/api/*',cors({origin:origin=>origin,allowHeaders:['Content-Type','Authorization'],allowMethods:['GET','POST','PUT','DELETE','OPTIONS'],credentials:true}))
const json=async(c:any)=>await c.req.json().catch(()=>null)
const bool=(v:unknown)=>v===true||v==='true'||v==='1'
const publicShape=(m:MemoryRecord)=>({...m,privacy:m.privacyClass})

app.get('/api/health',c=>c.json({ok:true,version:'1.1.0',persistence:c.env.DB?'d1':'memory-fallback',ai:createAIProvider(c.env)?.name||'not-configured',structuredMemory:true,checkpoints:true,voice:true}))
app.post('/api/auth/login',async c=>{const b=await json(c),secret=configuredSecret(c.env);if(!secret||b?.key!==secret)return c.json({error:'Invalid credentials'},401);c.header('Set-Cookie',sessionCookie(secret));return c.json({ok:true,authenticated:true})})
app.post('/api/auth/logout',c=>{c.header('Set-Cookie','memory_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');return c.json({ok:true})})
app.get('/api/auth/status',c=>c.json({authenticated:isAuthenticated(c)}))

app.get('/api/memories',async c=>{const repo=new MemoryRepository(c.env),auth=isAuthenticated(c),all=filterByPrivacy(await repo.list(bool(c.req.query('includeArchived'))),{authenticated:auth,allowPrivate:auth,externalProvider:false});const q=(c.req.query('query')||c.req.query('q')||'').toLowerCase(),domain=c.req.query('domain'),type=c.req.query('memory_type'),privacy=c.req.query('privacy'),status=c.req.query('status');const items=all.filter(m=>(!q||`${m.title} ${m.summary} ${m.content} ${m.tags.join(' ')}`.toLowerCase().includes(q))&&(!domain||domain==='all'||m.domain===domain)&&(!type||type==='all'||m.memoryType===type)&&(!privacy||privacy==='all'||m.privacyClass===privacy)&&(!status||status==='all'||m.status===status));return c.json({memories:items.map(publicShape),total:items.length,authorized:auth})})
app.get('/api/memories/:id',async c=>{const m=await new MemoryRepository(c.env).get(c.req.param('id'));if(!m)return c.json({error:'Memory not found'},404);const visible=filterByPrivacy([m],{authenticated:isAuthenticated(c),allowPrivate:true,externalProvider:false});return visible.length?c.json(publicShape(m)):c.json({error:'Memory not found'},404)})
app.post('/api/memories',async c=>{const denied=requireAuth(c);if(denied)return denied;const m=buildMemory(await json(c));if(!m)return c.json({error:'Invalid memory payload'},400);await new MemoryRepository(c.env).save(m);return c.json(publicShape(m),201)})
app.put('/api/memories/:id',async c=>{const denied=requireAuth(c);if(denied)return denied;const repo=new MemoryRepository(c.env),old=await repo.get(c.req.param('id'));if(!old)return c.json({error:'Memory not found'},404);const m=buildMemory(await json(c),old);if(!m)return c.json({error:'Invalid memory payload'},400);await repo.save(m);return c.json(publicShape(m))})
app.delete('/api/memories/:id',async c=>{const denied=requireAuth(c);if(denied)return denied;const ok=await new MemoryRepository(c.env).archive(c.req.param('id'));return ok?c.json({ok:true,id:c.req.param('id'),status:'archived'}):c.json({error:'Memory not found'},404)})

app.get('/api/retrieve',async c=>{const repo=new MemoryRepository(c.env),auth=isAuthenticated(c),ranked=await retrieve(repo,c.req.query('query')||c.req.query('q')||'',Number(c.req.query('limit')||20),(c.req.query('domain')||'').split(',').filter(Boolean));const visible=filterByPrivacy(ranked.map(x=>x.memory),{authenticated:auth,allowPrivate:auth,externalProvider:false});return c.json({query:c.req.query('query')||c.req.query('q')||'',results:visible.map(m=>({...publicShape(m),relevance:ranked.find(x=>x.memory.id===m.id)?.score||0}))})})
async function contextFor(c:any,query:string,externalProvider=false,allowPrivate=false){const repo=new MemoryRepository(c.env),auth=isAuthenticated(c),ranked=await retrieve(repo,query,20),safe=filterByPrivacy(ranked.map(x=>x.memory),{authenticated:auth,allowPrivate:auth&&allowPrivate,externalProvider});if(externalProvider)assertExternalPrivacy(safe);const cp=(await repo.listCheckpoints())[0]||null;return buildContextPackage(query,safe,cp,externalProvider,externalProvider&&auth&&allowPrivate)}
app.get('/api/context',async c=>c.json(await contextFor(c,c.req.query('query')||c.req.query('q')||'')))
app.post('/api/context/package',async c=>{const b=await json(c)||{};return c.json(await contextFor(c,String(b.query||''),false,bool(b.includePrivate)))})

app.get('/api/checkpoints',async c=>c.json({checkpoints:await new MemoryRepository(c.env).listCheckpoints()}))
app.get('/api/checkpoints/latest',async c=>{const items=await new MemoryRepository(c.env).listCheckpoints();return c.json({checkpoint:items[0]||null})})
app.post('/api/checkpoints',async c=>{const denied=requireAuth(c);if(denied)return denied;const cp=buildCheckpoint(await json(c));if(!cp)return c.json({error:'Invalid checkpoint payload'},400);await new MemoryRepository(c.env).saveCheckpoint(cp);return c.json(cp,201)})
app.delete('/api/checkpoints/:id',async c=>{const denied=requireAuth(c);if(denied)return denied;const ok=await new MemoryRepository(c.env).deleteCheckpoint(c.req.param('id'));return ok?c.json({ok:true}):c.json({error:'Checkpoint not found'},404)})

app.get('/api/export',async c=>{const denied=requireAuth(c);if(denied)return denied;const repo=new MemoryRepository(c.env);return c.json({schema:'memory.nrul.export',version:'1.0',exportedAt:new Date().toISOString(),memories:(await repo.list(true)).map(publicShape),checkpoints:await repo.listCheckpoints()})})
app.post('/api/import',async c=>{const denied=requireAuth(c);if(denied)return denied;const b=await json(c);if(b?.schema!=='memory.nrul.export'||!Array.isArray(b.memories))return c.json({error:'Invalid import schema'},400);const repo=new MemoryRepository(c.env);let imported=0,rejected=0;for(const raw of b.memories.slice(0,1000)){const m=buildMemory(raw);if(!m){rejected++;continue}await repo.save(m);imported++}return c.json({ok:true,imported,rejected})})

app.get('/api/ai/status',c=>{const p=createAIProvider(c.env);return c.json({configured:!!p,provider:p?.name||'groq',model:p?.model||c.env.GROQ_MODEL||'llama-3.3-70b-versatile'})})
async function aiChat(c:any,message:string,includePrivate=false){const provider=createAIProvider(c.env);if(!provider)return c.json({error:'AI provider is not configured'},503);const pkg=await contextFor(c,message,true,includePrivate);try{const answer=await provider.chat([{role:'system',content:`You are connected to Memory.Nrul. Treat memory as context, not unquestionable truth. Current user input overrides stale memory. Never claim access to excluded data.\n\n${formatSystemContext(pkg)}`},{role:'user',content:message}]);return c.json({ok:true,provider:provider.name,model:provider.model,answer,contextItems:pkg.context.length,contextVersion:pkg.version,privacy:{filterApplied:true,privateIncluded:pkg.privacy.privateIncluded,restrictedBlocked:true}})}catch{return c.json({error:'AI provider request failed'},502)}}
app.post('/api/ai/chat',async c=>{const denied=requireAuth(c);if(denied)return denied;const b=await json(c),message=typeof b?.message==='string'?b.message.trim().slice(0,20000):'';if(!message)return c.json({error:'Message is required'},400);return aiChat(c,message,bool(b.includePrivate))})

app.get('/api/voice/status',c=>{const p=createAIProvider(c.env);return c.json({ok:true,voice:'browser',configured:!!p,provider:p?.name||'groq',stt:'browser-speech-recognition',tts:'browser-speech-synthesis',phoneCallReady:false})})
app.post('/api/voice/chat',async c=>{const denied=requireAuth(c);if(denied)return denied;const b=await json(c),message=typeof b?.message==='string'?b.message.trim().slice(0,20000):'';if(!message)return c.json({error:'Message is required'},400);const response=await aiChat(c,message,bool(b.includePrivate));if(response.status!==200)return response;const data=await response.json();return c.json({...data,voice:{input:'transcript',output:'text'}})})

app.get('*',async c=>{const url=new URL(c.req.url),path=url.pathname==='/'?'/index.html':url.pathname;return c.env.ASSETS?c.env.ASSETS.fetch(new Request(new URL(path,url),c.req.raw)):c.notFound()})
export default app
