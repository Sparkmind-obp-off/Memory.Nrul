export type RealtimeVoiceProvider = 'cloudflare-voice' | 'xai-grok-voice' | 'custom'

export type RealtimeVoiceCapabilities = {
  streamingInput: true
  streamingOutput: true
  interruption: true
  turnDetection: true
  partialTranscript: true
  serverMemoryContext: true
}

export type RealtimeVoiceSession = {
  version: '1.1'
  provider: RealtimeVoiceProvider
  transport: 'websocket'
  agent: 'MemoryVoiceAgent'
  status: 'ready' | 'not-configured'
  sessionId: string
  expiresInSeconds: number
  capabilities: RealtimeVoiceCapabilities
  privacy: {
    memoryBoundary: 'server-context-only'
    restrictedBlocked: true
    privateDefault: false
    externalProvider: boolean
  }
}

export type RealtimeVoiceConfig = {
  provider?: RealtimeVoiceProvider
  enabled?: boolean
  sessionTtlSeconds?: number
}

export const REALTIME_VOICE_CAPABILITIES: RealtimeVoiceCapabilities = {
  streamingInput: true,
  streamingOutput: true,
  interruption: true,
  turnDetection: true,
  partialTranscript: true,
  serverMemoryContext: true,
}

export function createRealtimeVoiceSession(config: RealtimeVoiceConfig = {}): RealtimeVoiceSession {
  const provider = config.provider || 'cloudflare-voice'
  const enabled = config.enabled === true
  return {
    version: '1.1',
    provider,
    transport: 'websocket',
    agent: 'MemoryVoiceAgent',
    status: enabled ? 'ready' : 'not-configured',
    sessionId: crypto.randomUUID(),
    expiresInSeconds: config.sessionTtlSeconds || 300,
    capabilities: REALTIME_VOICE_CAPABILITIES,
    privacy: {
      memoryBoundary: 'server-context-only',
      restrictedBlocked: true,
      privateDefault: false,
      externalProvider: true,
    },
  }
}
