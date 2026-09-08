import app from '../../src/index'
import { createAIProvider } from '../../src/ai'

function authorized(request: Request, env: { MEMORY_SESSION_SECRET?: string; MEMORY_ADMIN_KEY?: string }) {
  const secret = env.MEMORY_SESSION_SECRET || env.MEMORY_ADMIN_KEY || ''
  if (!secret) return false
  const cookie = request.headers.get('Cookie') || ''
  if (cookie.split(';').some(x => x.trim() === 'memory_session=authenticated')) return true
  return request.headers.get('Authorization') === `Bearer ${secret}`
}

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (!authorized(request, env)) return Response.json({ error: 'Authorization required' }, { status: 401 })

  const bindings = env as typeof env & { GROQ_API_KEY?: string; GROQ_MODEL?: string; MEMORY_SESSION_SECRET?: string; MEMORY_ADMIN_KEY?: string }
  const provider = createAIProvider(bindings)
  if (!provider) return Response.json({ error: 'AI provider is not configured' }, { status: 503 })

  if (request.method === 'GET') {
    return Response.json({ configured: true, provider: provider.name, model: provider.model })
  }

  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const body = await request.json().catch(() => ({})) as { message?: string; query?: string }
  const message = String(body.message || body.query || '').trim()
  if (!message) return Response.json({ error: 'Message is required' }, { status: 400 })

  const contextRequest = new Request(new URL('/api/context/package', request.url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: request.headers.get('Cookie') || '',
      Authorization: request.headers.get('Authorization') || '',
    },
    body: JSON.stringify({ query: message }),
  })
  const contextResponse = await app.fetch(contextRequest, env)
  if (!contextResponse.ok) return Response.json({ error: 'Context package failed' }, { status: 502 })
  const context = await contextResponse.json<any>()

  const safeContext = {
    ...context,
    context: Array.isArray(context.context)
      ? context.context.filter((item: any) => item.privacy !== 'RESTRICTED')
      : [],
  }

  const system = `You are an AI connected to Memory.Nrul, a context continuity engine. Use supplied memory as context, not absolute truth. Prefer verified and recent information. If memory conflicts with the user's current message, the current message wins. Continue naturally from the latest checkpoint when relevant. Never reveal restricted memory.\n\nMEMORY CONTEXT:\n${JSON.stringify(safeContext)}`

  try {
    const answer = await provider.chat([
      { role: 'system', content: system },
      { role: 'user', content: message },
    ])
    return Response.json({ ok: true, provider: provider.name, model: provider.model, message, answer, contextVersion: safeContext.version, contextItems: safeContext.context.length, checkpoint: safeContext.latestCheckpoint || null })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'AI provider request failed' }, { status: 502 })
  }
}
