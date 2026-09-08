const baseUrl = (process.env.MEMORY_N RUL_BASE_URL || process.env.MEMORY_BASE_URL || '').replace(/\/$/, '')
const adminKey = process.env.MEMORY_ADMIN_KEY || ''

if (!baseUrl) throw new Error('MEMORY_BASE_URL is required')
if (!adminKey) throw new Error('MEMORY_ADMIN_KEY is required for the authenticated live smoke test')

async function call(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const text = await response.text()
  let data = {}
  try { data = JSON.parse(text) } catch {}
  if (!response.ok) throw new Error(`${path} failed: HTTP ${response.status} ${text.slice(0, 500)}`)
  return data
}

const health = await call('/api/health')
if (!health.ok) throw new Error('Health check failed')

const aiStatus = await call('/api/ai/status')
if (!aiStatus.configured) throw new Error('AI provider is not configured on the deployed environment')
if (aiStatus.provider !== 'groq') throw new Error(`Expected Groq, got ${aiStatus.provider}`)

const context = await call('/api/context/package', {
  method: 'POST',
  headers: { Authorization: `Bearer ${adminKey}` },
  body: JSON.stringify({ query: 'Memory.Nrul continuity' }),
})
if (!Array.isArray(context.context)) throw new Error('Context package is missing context[]')

const response = await call('/api/ai/chat', {
  method: 'POST',
  headers: { Authorization: `Bearer ${adminKey}` },
  body: JSON.stringify({ message: 'Smoke test: explain Memory.Nrul continuity in one sentence.' }),
})

if (!response.ok || !response.answer) throw new Error('AI response is missing')
if (response.provider !== 'groq') throw new Error(`Expected Groq response, got ${response.provider}`)
if (Number(response.contextItems) < 1) throw new Error('AI response reports zero injected context items')

console.log(JSON.stringify({
  ok: true,
  flow: 'Memory → Context → Groq',
  provider: response.provider,
  model: response.model,
  contextItems: response.contextItems,
  answerPreview: response.answer.slice(0, 180),
}, null, 2))
