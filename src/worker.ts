import { routeAgentRequest } from 'agents'
import { Agent } from 'agents'
import { withVoice, WorkersAIFluxSTT, WorkersAITTS, type VoiceTurnContext } from '@cloudflare/voice'
import app from './index'
import type { Bindings } from './types'
import { MemoryRepository } from './memory/repository'
import { retrieve } from './memory/retrieval'
import { filterByPrivacy, assertExternalPrivacy } from './memory/privacy'
import { buildContextPackage, formatSystemContext } from './context/package'
import { createAIProvider } from './ai'

interface Env extends Bindings {
  AI: Ai
  ASSETS: Fetcher
}

const VoiceAgent = withVoice(Agent)

export class MemoryVoiceAgent extends VoiceAgent<Env> {
  transcriber = new WorkersAIFluxSTT(this.env.AI)
  tts = new WorkersAITTS(this.env.AI)

  async beforeCallStart() {
    return this.env.VOICE_REALTIME_ENABLED === 'true'
  }

  async onTurn(transcript: string, _context: VoiceTurnContext) {
    const provider = createAIProvider(this.env)
    if (!provider) return 'Voice AI belum dikonfigurasi. Silakan aktifkan provider AI terlebih dahulu.'

    const repo = new MemoryRepository(this.env)
    const ranked = await retrieve(repo, transcript, 20)
    const safe = filterByPrivacy(ranked.map(item => item.memory), {
      authenticated: true,
      allowPrivate: false,
      externalProvider: true,
    })
    assertExternalPrivacy(safe)

    const checkpoint = (await repo.listCheckpoints())[0] || null
    const pkg = buildContextPackage(transcript, safe, checkpoint, true, false)

    return provider.chat([
      {
        role: 'system',
        content: `You are the live voice assistant connected to Memory.Nrul. Speak naturally and concisely because the answer will be spoken aloud. Treat memory as context, not unquestionable truth. The user's current words override stale memory. Never claim access to excluded data. RESTRICTED data is never exposed to external AI providers. PRIVATE data is excluded by default.\n\n${formatSystemContext(pkg)}`,
      },
      { role: 'user', content: transcript },
    ])
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const agentResponse = await routeAgentRequest(request, env, {
      onBeforeConnect: async req => {
        const secret = env.MEMORY_SESSION_SECRET || env.MEMORY_ADMIN_KEY
        if (!secret) return new Response('Voice authentication is not configured', { status: 503 })
        const authorization = req.headers.get('Authorization')
        const cookie = req.headers.get('Cookie') || ''
        const cookieValue = cookie.split(';').map(v => v.trim()).find(v => v.startsWith('memory_session='))?.slice('memory_session='.length)
        if (authorization !== `Bearer ${secret}` && cookieValue !== secret) return new Response('Unauthorized', { status: 401 })
      },
    })
    if (agentResponse) return agentResponse
    return app.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
