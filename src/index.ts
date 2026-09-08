import { Hono } from 'hono'

const app = new Hono()

type Memory = {
  id: string
  title: string
  domain: string
  summary: string
  privacy: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'
  status: 'active' | 'archived'
  updatedAt: string
}

const seed: Memory[] = [
  { id: 'm-001', title: 'Memory.Nrul product direction', domain: 'Project', summary: 'General AI Memory & Context Continuity Platform.', privacy: 'PUBLIC', status: 'active', updatedAt: '2026-09-08' },
  { id: 'm-002', title: 'Continuity model', domain: 'Conversation', summary: 'Preserve shared understanding, decisions, situation, state, pending, and next actions.', privacy: 'PUBLIC', status: 'active', updatedAt: '2026-09-08' },
  { id: 'm-003', title: 'Privacy boundary', domain: 'Privacy', summary: 'Sensitive context stays private and is only merged when authorized.', privacy: 'PUBLIC', status: 'active', updatedAt: '2026-09-08' }
]

app.get('/api/health', (c) => c.json({ ok: true, app: 'Memory.Nrul', version: '0.1.0' }))

app.get('/api/memories', (c) => {
  const q = (c.req.query('q') || '').toLowerCase()
  const domain = c.req.query('domain') || 'all'
  const privacy = c.req.query('privacy') || 'all'
  const memories = seed.filter((m) =>
    (!q || `${m.title} ${m.summary} ${m.domain}`.toLowerCase().includes(q)) &&
    (domain === 'all' || m.domain === domain) &&
    (privacy === 'all' || m.privacy === privacy)
  )
  return c.json({ memories, total: memories.length })
})

app.get('/api/context', (c) => c.json({
  currentContext: 'General AI conversation continuity',
  sharedUnderstanding: 'Memory should preserve relevant context rather than raw transcript.',
  currentState: 'MVP foundation',
  domains: ['Conversation', 'Personal', 'Relationship', 'Project', 'Decision', 'Situation', 'History', 'Preferences', 'Tasks', 'Session Handoff'],
  privacy: ['PUBLIC', 'PRIVATE', 'RESTRICTED'],
  pending: ['Connect persistent storage', 'Add authentication and authorization', 'Add retrieval/context assembly'],
  next: ['Build memory CRUD', 'Implement privacy routing', 'Implement AI context package export']
}))

app.get('*', async (c) => {
  const url = new URL(c.req.url)
  const asset = url.pathname === '/' ? '/index.html' : url.pathname
  return c.env?.ASSETS?.fetch(new Request(new URL(asset, url))) ?? c.notFound()
})

export default app
