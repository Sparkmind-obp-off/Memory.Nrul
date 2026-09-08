import { Hono } from 'hono'

type Privacy = 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'
type Status = 'active' | 'archived'

type Memory = {
  id: string
  title: string
  domain: string
  summary: string
  content: string
  privacy: Privacy
  status: Status
  confidence: number
  source?: string
  createdAt: string
  updatedAt: string
  lastVerified?: string
}

type Bindings = { DB?: D1Database; ASSETS?: Fetcher; MEMORY_ADMIN_KEY?: string }
const app = new Hono<{ Bindings: Bindings }>()

const seed: Memory[] = [
  { id: 'm-001', title: 'Memory.Nrul product direction', domain: 'Project', summary: 'General AI Memory & Context Continuity Platform.', content: 'Preserve relevant continuity between conversations, sessions, models, and apps.', privacy: 'PUBLIC', status: 'active', confidence: 1, createdAt: '2026-09-08', updatedAt: '2026-09-08', lastVerified: '2026-09-08' },
  { id: 'm-002', title: 'Continuity model', domain: 'Conversation', summary: 'Preserve shared understanding, decisions, situation, state, pending, and next actions.', content: 'READ MEMORY → VERIFY CURRENT STATE → RECONSTRUCT CONTEXT → CONTINUE → EXECUTE → CHECKPOINT.', privacy: 'PUBLIC', status: 'active', confidence: 1, createdAt: '2026-09-08', updatedAt: '2026-09-08', lastVerified: '2026-09-08' },
  { id: 'm-003', title: 'Privacy boundary', domain: 'Privacy', summary: 'Sensitive context stays private and is only merged when authorized.', content: 'PUBLIC is safe to expose. PRIVATE requires authorization. RESTRICTED is never returned to an unauthenticated caller.', privacy: 'PUBLIC', status: 'active', confidence: 1, createdAt: '2026-09-08', updatedAt: '2026-09-08', lastVerified: '2026-09-08' }
]
let localMemories = [...seed]

function isAuthorized(c: { req: { header(name: string): string | undefined }; env: Bindings }) {
  const configured = c.env.MEMORY_ADMIN_KEY
  if (!configured) return false
  return c.req.header('Authorization') === `Bearer ${configured}`
}
function visible(m: Memory, authorized: boolean) { return m.privacy === 'PUBLIC' || authorized }
function now() { return new Date().toISOString() }
function id() { return `m-${crypto.randomUUID()}` }

async function listMemories(c: { env: Bindings }, authorized: boolean) {
  if (c.env.DB) {
    const rows = await c.env.DB.prepare('SELECT * FROM memories WHERE status = ? ORDER BY updated_at DESC').bind('active').all<any>()
    return (rows.results || []).map(rowToMemory).filter((m) => visible(m, authorized))
  }
  return localMemories.filter((m) => m.status === 'active' && visible(m, authorized))
}
function rowToMemory(r: any): Memory { return { id:r.id, title:r.title, domain:r.domain, summary:r.summary, content:r.content, privacy:r.privacy_class, status:r.status, confidence:Number(r.confidence ?? 1), source:r.source ?? undefined, createdAt:r.created_at, updatedAt:r.updated_at, lastVerified:r.last_verified ?? undefined } }
function payloadToMemory(body: any, existing?: Memory): Memory {
  const t = now()
  return { id: existing?.id || id(), title:String(body.title || existing?.title || '').trim(), domain:String(body.domain || existing?.domain || 'Conversation').trim(), summary:String(body.summary || existing?.summary || '').trim(), content:String(body.content ?? existing?.content ?? body.summary ?? '').trim(), privacy:(body.privacy || existing?.privacy || 'PUBLIC') as Privacy, status:(body.status || existing?.status || 'active') as Status, confidence:Number(body.confidence ?? existing?.confidence ?? 1), source:body.source ?? existing?.source, createdAt:existing?.createdAt || t, updatedAt:t, lastVerified:body.lastVerified ?? existing?.lastVerified }
}
function valid(m: Memory) { return !!m.title && !!m.summary && ['PUBLIC','PRIVATE','RESTRICTED'].includes(m.privacy) && ['active','archived'].includes(m.status) }

app.get('/api/health', (c) => c.json({ ok:true, app:'Memory.Nrul', version:'0.2.0', persistence:c.env.DB ? 'd1' : 'memory-fallback' }))

app.get('/api/memories', async (c) => {
  const authorized = isAuthorized(c)
  const q = (c.req.query('q') || '').toLowerCase().trim()
  const domain = c.req.query('domain') || 'all'
  const privacy = c.req.query('privacy') || 'all'
  const all = await listMemories(c, authorized)
  const memories = all.filter((m) => (!q || `${m.title} ${m.summary} ${m.content} ${m.domain}`.toLowerCase().includes(q)) && (domain === 'all' || m.domain === domain) && (privacy === 'all' || m.privacy === privacy))
  return c.json({ memories, total:memories.length, authorized })
})

app.get('/api/memories/:id', async (c) => {
  const authorized = isAuthorized(c), id = c.req.param('id')
  const all = await listMemories(c, authorized)
  const memory = all.find((m) => m.id === id)
  return memory ? c.json(memory) : c.json({ error:'Memory not found' }, 404)
})

app.post('/api/memories', async (c) => {
  const body = await c.req.json<any>().catch(() => ({}))
  const memory = payloadToMemory(body)
  if (!valid(memory)) return c.json({ error:'title and summary are required; privacy/status are invalid' }, 400)
  if (memory.privacy !== 'PUBLIC' && !isAuthorized(c)) return c.json({ error:'Authorization required for private or restricted memory' }, 403)
  if (c.env.DB) {
    await c.env.DB.prepare('INSERT INTO memories (id,title,domain,summary,content,privacy_class,status,confidence,source,created_at,updated_at,last_verified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(memory.id,memory.title,memory.domain,memory.summary,memory.content,memory.privacy,memory.status,memory.confidence,memory.source ?? null,memory.createdAt,memory.updatedAt,memory.lastVerified ?? null).run()
  } else localMemories.unshift(memory)
  return c.json(memory, 201)
})

app.put('/api/memories/:id', async (c) => {
  const authorized = isAuthorized(c), id = c.req.param('id'), body = await c.req.json<any>().catch(() => ({}))
  const all = authorized && c.env.DB ? await listMemories(c, true) : await listMemories(c, authorized)
  const existing = all.find((m) => m.id === id)
  if (!existing) return c.json({ error:'Memory not found' }, 404)
  const memory = payloadToMemory(body, existing)
  if (!valid(memory)) return c.json({ error:'Invalid memory payload' }, 400)
  if (memory.privacy !== 'PUBLIC' && !authorized) return c.json({ error:'Authorization required' }, 403)
  if (c.env.DB) {
    await c.env.DB.prepare('UPDATE memories SET title=?,domain=?,summary=?,content=?,privacy_class=?,status=?,confidence=?,source=?,updated_at=?,last_verified=? WHERE id=?').bind(memory.title,memory.domain,memory.summary,memory.content,memory.privacy,memory.status,memory.confidence,memory.source ?? null,memory.updatedAt,memory.lastVerified ?? null,id).run()
  } else localMemories = localMemories.map((m) => m.id === id ? memory : m)
  return c.json(memory)
})

app.delete('/api/memories/:id', async (c) => {
  if (!isAuthorized(c)) return c.json({ error:'Authorization required' }, 403)
  const id = c.req.param('id')
  if (c.env.DB) await c.env.DB.prepare('UPDATE memories SET status=? WHERE id=?').bind('archived', id).run()
  else localMemories = localMemories.map((m) => m.id === id ? {...m, status:'archived', updatedAt:now()} : m)
  return c.json({ ok:true, id, status:'archived' })
})

app.get('/api/context', async (c) => {
  const authorized = isAuthorized(c), q = c.req.query('q') || ''
  const memories = (await listMemories(c, authorized)).filter((m) => !q || `${m.title} ${m.summary} ${m.content}`.toLowerCase().includes(q.toLowerCase()))
  return c.json({ currentContext:'General AI conversation continuity', sharedUnderstanding:'Memory preserves relevant context rather than raw transcript.', currentState:'MVP → persistence + CRUD + privacy + retrieval', domains:['Conversation','Personal','Relationship','Project','Decision','Situation','History','Preferences','Tasks','Session Handoff'], privacy:['PUBLIC','PRIVATE','RESTRICTED'], retrieved:memories.slice(0,12), pending:['Authentication hardening','AI provider adapter','Import/export UI'], next:['Context package → AI','Import/export','Production deployment'] })
})

app.post('/api/context/package', async (c) => {
  const authorized = isAuthorized(c), body = await c.req.json<any>().catch(() => ({})), query = String(body.query || '')
  const memories = (await listMemories(c, authorized)).filter((m) => !query || `${m.title} ${m.summary} ${m.content} ${m.domain}`.toLowerCase().includes(query.toLowerCase())).slice(0,20)
  return c.json({ version:'1.0', generatedAt:now(), purpose:'AI context continuity', instructions:['Use retrieved memory as context, not as unquestionable truth.','Respect privacy classification.','Prefer recent, verified, high-confidence memory.','Continue from current state and pending actions.'], context:memories.map((m) => ({ id:m.id, domain:m.domain, title:m.title, summary:m.summary, content:m.content, confidence:m.confidence, updatedAt:m.updatedAt, lastVerified:m.lastVerified })) })
})

app.get('/api/export', async (c) => {
  if (!isAuthorized(c)) return c.json({ error:'Authorization required' }, 403)
  return c.json({ version:'1.0', exportedAt:now(), memories:await listMemories(c,true) })
})

app.post('/api/import', async (c) => {
  if (!isAuthorized(c)) return c.json({ error:'Authorization required' }, 403)
  const body = await c.req.json<any>().catch(() => ({})), incoming = Array.isArray(body.memories) ? body.memories : []
  let imported = 0
  for (const raw of incoming) {
    const m = payloadToMemory(raw)
    if (!valid(m)) continue
    if (c.env.DB) await c.env.DB.prepare('INSERT OR REPLACE INTO memories (id,title,domain,summary,content,privacy_class,status,confidence,source,created_at,updated_at,last_verified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(m.id,m.title,m.domain,m.summary,m.content,m.privacy,m.status,m.confidence,m.source ?? null,m.createdAt,m.updatedAt,m.lastVerified ?? null).run()
    else localMemories = [m, ...localMemories.filter((x) => x.id !== m.id)]
    imported++
  }
  return c.json({ ok:true, imported })
})

app.get('*', async (c) => {
  const url = new URL(c.req.url), asset = url.pathname === '/' ? '/index.html' : url.pathname
  return c.env.ASSETS ? c.env.ASSETS.fetch(new Request(new URL(asset, url))) : c.notFound()
})

export default app
