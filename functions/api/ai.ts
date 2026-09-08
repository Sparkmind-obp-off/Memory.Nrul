import app from '../../src/index'
import { createAIProvider } from '../../src/ai'

export const onRequest: PagesFunction = async ({ request, env }) => {
  const bindings = env as typeof env & { GROQ_API_KEY?: string; GROQ_MODEL?: string }
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
    headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('Cookie') || '' },
    body: JSON.stringify({ query: message }),
  })
  const contextResponse = await app.fetch(contextRequest, env)
  const context = await contextResponse.json<any>()

  const system = `You are an AI connected to Memory.Nrul, a context continuity engine. Use supplied memory as context, not absolute truth. Prefer verified and recent information. If memory conflicts with the user's current message, the current message wins. Continue naturally from the latest checkpoint when relevant.\n\nMEMORY CONTEXT:\n${JSON.stringify(context)}`

  try {
    const answer = await provider.chat([
      { role: 'system', content: system },
      { role: 'user', content: message },
    ])
    return Response.json({ ok: true, provider: provider.name, model: provider.model, message, answer, contextVersion: context.version, contextItems: context.context?.length || 0, checkpoint: context.latestCheckpoint || null })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'AI provider request failed' }, { status: 502 })
  }
}
