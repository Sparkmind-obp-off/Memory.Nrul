import { describe, expect, it, vi } from 'vitest'
import app from '../src/index'
import { onRequest } from '../functions/api/ai'

const env = {
  MEMORY_SESSION_SECRET: 'test-secret',
  GROQ_API_KEY: 'groq-test-key',
  GROQ_MODEL: 'test-groq-model',
}

function authHeaders() {
  return { Authorization: 'Bearer test-secret', Cookie: 'memory_session=authenticated' }
}

describe('Memory → Context → Groq', () => {
  it('allows unauthenticated AI chat with public-only context', async () => {
    const request = new Request('https://memory.test/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' }),
    })
    const response = await onRequest({ request, env } as any)
    expect(response.status).not.toBe(401)
  })

  it('retrieves memory, builds context, calls Groq, and blocks RESTRICTED memory', async () => {
    const createMemory = await app.fetch(new Request('https://memory.test/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        title: 'AI flow public fact', domain: 'Project',
        summary: 'The public memory should reach the AI context.',
        content: 'PUBLIC_CONTEXT_SENTINEL', privacy: 'PUBLIC', memoryType: 'fact',
      }),
    }), env)
    expect(createMemory.status).toBe(201)

    const createRestricted = await app.fetch(new Request('https://memory.test/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        title: 'Restricted secret', domain: 'System',
        summary: 'Never send this to the provider.',
        content: 'RESTRICTED_SECRET_SENTINEL', privacy: 'RESTRICTED', memoryType: 'fact',
      }),
    }), env)
    expect(createRestricted.status).toBe(201)

    let providerPayload: any = null
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => {
      providerPayload = JSON.parse(String(init.body))
      return new Response(JSON.stringify({ choices: [{ message: { content: 'GROQ_MOCK_RESPONSE' } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }))

    const request = new Request('https://memory.test/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'public fact' }),
    })
    const response = await onRequest({ request, env } as any)
    const data = await response.json() as any

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.provider).toBe('groq')
    expect(data.model).toBe('test-groq-model')
    expect(data.answer).toBe('GROQ_MOCK_RESPONSE')
    expect(data.contextItems).toBeGreaterThan(0)
    expect(providerPayload.model).toBe('test-groq-model')
    expect(providerPayload.messages[1]).toEqual({ role: 'user', content: 'public fact' })
    expect(providerPayload.messages[0].content).toContain('PUBLIC_CONTEXT_SENTINEL')
    expect(providerPayload.messages[0].content).not.toContain('RESTRICTED_SECRET_SENTINEL')
    expect(providerPayload.messages[0].content).not.toContain('Never send this to the provider.')
  })
})
