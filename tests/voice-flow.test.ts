import { describe, expect, it, vi } from 'vitest'
import app from '../src/index'

const env={MEMORY_SESSION_SECRET:'test-secret',GROQ_API_KEY:'groq-test-key',GROQ_MODEL:'test-groq-model',VOICE_REALTIME_ENABLED:'true',VOICE_REALTIME_PROVIDER:'cloudflare-voice',VOICE_REALTIME_SESSION_TTL:'300'}
const authHeaders={Authorization:'Bearer test-secret',Cookie:'memory_session=authenticated'}

describe('Voice → Memory → AI',()=>{
  it('exposes browser voice capability without secrets',async()=>{
    const response=await app.fetch(new Request('https://memory.test/api/voice/status'),env)
    const data=await response.json() as any
    expect(response.status).toBe(200)
    expect(data.voice).toBe('browser')
    expect(data.stt).toBe('browser-speech-recognition')
    expect(data.tts).toBe('browser-speech-synthesis')
    expect(data.phoneCallReady).toBe(false)
    expect(data.realtimeProvider).toBe('cloudflare-voice')
    expect(data.realtimeConfigured).toBe(true)
    expect(data).not.toHaveProperty('apiKey')
  })

  it('requires authentication for voice chat and delegates through the memory-aware AI path',async()=>{
    const denied=await app.fetch(new Request('https://memory.test/api/voice/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'hello'})}),env)
    expect(denied.status).toBe(401)
    let payload:any=null
    vi.stubGlobal('fetch',vi.fn(async(_url:string,init:RequestInit)=>{payload=JSON.parse(String(init.body));return new Response(JSON.stringify({choices:[{message:{content:'VOICE_MOCK_RESPONSE'}}]}),{status:200,headers:{'Content-Type':'application/json'}})}))
    const response=await app.fetch(new Request('https://memory.test/api/voice/chat',{method:'POST',headers:{'Content-Type':'application/json',...authHeaders},body:JSON.stringify({message:'continuity'})}),env)
    const data=await response.json() as any
    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.answer).toBe('VOICE_MOCK_RESPONSE')
    expect(data.voice).toEqual({input:'transcript',output:'text'})
    expect(data.contextItems).toBeGreaterThan(0)
    expect(payload.messages[1]).toEqual({role:'user',content:'continuity'})
  })

  it('returns a short-lived realtime session contract without provider secrets',async()=>{
    const denied=await app.fetch(new Request('https://memory.test/api/voice/realtime/session',{method:'POST'}),env)
    expect(denied.status).toBe(401)
    const response=await app.fetch(new Request('https://memory.test/api/voice/realtime/session',{method:'POST',headers:{'Content-Type':'application/json',...authHeaders},body:JSON.stringify({provider:'cloudflare-voice'})}),env)
    const data=await response.json() as any
    expect(response.status).toBe(200)
    expect(data.version).toBe('1.1')
    expect(data.agent).toBe('MemoryVoiceAgent')
    expect(data.provider).toBe('cloudflare-voice')
    expect(data.transport).toBe('websocket')
    expect(data.status).toBe('ready')
    expect(data.expiresInSeconds).toBe(300)
    expect(data.capabilities.streamingInput).toBe(true)
    expect(data.capabilities.interruption).toBe(true)
    expect(data.privacy.memoryBoundary).toBe('server-context-only')
    expect(data.privacy.restrictedBlocked).toBe(true)
    expect(data).not.toHaveProperty('apiKey')
    expect(data).not.toHaveProperty('token')
  })
})
