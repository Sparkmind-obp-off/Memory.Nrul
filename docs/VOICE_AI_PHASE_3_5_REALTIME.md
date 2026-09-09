# Memory.Nrul — Phase 3.5 Realtime Voice

## Status

**Runtime foundation + WebSocket client connected in code.** The live voice runtime now has a Cloudflare Worker entrypoint, a Durable Object-backed `MemoryVoiceAgent`, Workers AI realtime STT/TTS, the existing Groq LLM provider, and a browser `VoiceClient` wired to the agent route.

Cloudflare Voice is experimental and its API may change between releases, so the repository pins `@cloudflare/voice` to `0.4.0` and `agents` to `0.22.0`.

## Runtime flow

```text
Browser microphone
  ↓ continuous PCM/WebSocket
MemoryVoiceAgent (Cloudflare Worker + Durable Object)
  ↓ Flux STT + model-driven turn detection
Memory.Nrul repository/retrieval/privacy/context
  ↓ PUBLIC context only by default
Groq LLM
  ↓ answer text
Cloudflare Voice sentence chunking
  ↓ Workers AI Aura TTS
Browser speaker
```

The Cloudflare Voice pipeline handles continuous audio, partial transcripts, interruption/barge-in, streaming TTS, and persistent agent state. The browser no longer uses the old one-shot `SpeechRecognition → HTTP → speechSynthesis` loop for Phase 3.5.

## Provider choice

### Realtime transport + STT/TTS: Cloudflare Voice

`@cloudflare/voice` provides `withVoice`, `VoiceClient`, `WorkersAIFluxSTT`, and `WorkersAITTS`. Audio travels over WebSocket and the agent runs inside a Durable Object.

### LLM: Groq

The realtime agent calls Memory.Nrul's existing `createAIProvider()`/Groq abstraction from `onTurn()`. The browser never receives the Groq API key.

### Future phone call

Use `@cloudflare/voice-twilio` later so the same `MemoryVoiceAgent` can serve browser voice and telephone calls.

## Files

- `src/worker.ts` — Worker entrypoint, `routeAgentRequest()`, authentication gate, `MemoryVoiceAgent`.
- `wrangler.jsonc` — Worker + Assets + D1 + Workers AI + Durable Object configuration.
- `public/voice-chat.js` — browser `VoiceClient` connection, live status, interim transcript, transcript history, mute/end controls.
- `src/voice/realtime.ts` — short-lived session contract and agent identity.
- `src/index.ts` — existing Memory.Nrul API remains the application HTTP surface.

## WebSocket route

Cloudflare Agents routes the voice agent at:

```text
/agents/memory-voice-agent/{sessionId}
```

The dashboard creates a short-lived session through:

```text
POST /api/voice/realtime/session
```

and then constructs:

```text
VoiceClient({
  agent: "MemoryVoiceAgent",
  name: sessionId,
  host: window.location.host
})
```

The WebSocket connection is authenticated before the Durable Object accepts it.

## Privacy boundary

1. Browser streams audio to the realtime transport.
2. Memory retrieval happens server-side inside `MemoryVoiceAgent`.
3. `RESTRICTED` memory is always blocked before external-provider context.
4. `PRIVATE` memory is excluded by default.
5. Groq receives only the filtered context package and current transcript.
6. Provider credentials remain server-side secrets.
7. Durable Object state stores voice-session conversation state; Memory.Nrul remains the source of truth for application memory.

## Required Worker secrets

Set these on the Worker before production deployment:

```bash
npx wrangler secret put GROQ_API_KEY --config wrangler.jsonc
npx wrangler secret put MEMORY_ADMIN_KEY --config wrangler.jsonc
```

`MEMORY_ADMIN_KEY` is also used by the existing Hono authentication layer. Never commit either value to source control.

## Deployment

```bash
npm install
npm run typecheck
npm run deploy:voice
```

The repository's existing Pages deployment can remain available during migration. Once the Worker deployment is verified, the Worker can become the primary application origin because it serves the existing `public/` assets and forwards normal API requests to the same Hono app.

## Current limitation

The code path is wired for real realtime execution, but production is **not claimed live until the Worker is deployed with the required secrets and the first WebSocket call is smoke-tested**. The GitHub Actions run triggered by the latest commit is currently still in progress.
