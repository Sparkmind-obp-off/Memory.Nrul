export type AIMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export type AIProvider = {
  name: string
  model: string
  chat(messages: AIMessage[]): Promise<string>
}

export function createGroqProvider(apiKey: string, model = 'llama-3.3-70b-versatile'): AIProvider {
  return {
    name: 'groq',
    model,
    async chat(messages) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature: 0.2 }),
      })
      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`Groq request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`)
      }
      const data = await response.json<any>()
      const content = data?.choices?.[0]?.message?.content
      if (typeof content !== 'string' || !content.trim()) throw new Error('Groq returned an empty response')
      return content.trim()
    },
  }
}

export function createAIProvider(env: { GROQ_API_KEY?: string; GROQ_MODEL?: string }): AIProvider | null {
  if (!env.GROQ_API_KEY) return null
  return createGroqProvider(env.GROQ_API_KEY, env.GROQ_MODEL || 'llama-3.3-70b-versatile')
}
