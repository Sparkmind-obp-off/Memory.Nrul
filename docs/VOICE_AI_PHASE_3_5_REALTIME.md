# Memory.Nrul — Phase 3.5 Realtime Voice

## Decision

Realtime voice uses a provider-neutral session contract with **Cloudflare Voice** as the default transport/session target. The current Memory.Nrul LLM remains **Groq** for normal AI chat; realtime voice may call an LLM through the voice agent's `onTurn` pipeline without exposing Memory.Nrul secrets to the browser.

Cloudflare Voice is the preferred realtime layer because it provides continuous microphone streaming over WebSocket, model-driven turn detection, partial transcripts, interruption handling, streaming TTS, and Durable Object-backed conversation state. It also has a Twilio adapter for a later phone-call phase.

## Runtime flow

```text
HP microphone
  ↓ continuous PCM/WebSocket
Realtime Voice session
  ↓ continuous STT + turn detection
Memory.Nrul context bridge
  ↓ retrieve → privacy filter → context package
LLM (Groq first; provider-swappable)
  ↓ streaming text
Realtime TTS
  ↓ audio stream
HP speaker
```

## Why not the old flow?

Phase 3 used browser SpeechRecognition → one HTTP request → one complete answer → browser speechSynthesis. Phase 3.5 changes the interaction model to a persistent session: the user can interrupt, speak naturally, receive partial transcript updates, and hear audio streamed back.

## Provider choice

### Default realtime provider: Cloudflare Voice

Use `@cloudflare/voice` + Agents/Durable Objects for the realtime session layer. Cloudflare documents continuous STT, sentence-chunked TTS, interruption handling, partial transcripts, and persistent conversation state over WebSocket.

### LLM: Groq remains the first application provider

Memory.Nrul already has a Groq provider abstraction. The realtime agent should call the same Memory.Nrul context pipeline before the LLM call. The browser must never receive the Groq API key.

### Future phone call

Use Cloudflare's Twilio adapter when moving from browser voice to a real telephone number. This keeps the voice agent contract stable while replacing the client transport with telephony.

## API contract

### `POST /api/voice/realtime/session`

Requires Memory.Nrul authentication.

Optional body:

```json
{"provider":"cloudflare-voice"}
```

Response shape:

```json
{
  "version":"1.0",
  "provider":"cloudflare-voice",
  "transport":"websocket",
  "status":"ready",
  "sessionId":"uuid",
  "expiresInSeconds":300,
  "capabilities":{
    "streamingInput":true,
    "streamingOutput":true,
    "interruption":true,
    "turnDetection":true,
    "partialTranscript":true,
    "serverMemoryContext":true
  },
  "privacy":{
    "memoryBoundary":"server-context-only",
    "restrictedBlocked":true,
    "privateDefault":false,
    "externalProvider":true
  }
}
```

The current endpoint is a **contract/session-planning layer**. It does not expose provider API keys and does not pretend that the Pages deployment is already a live WebSocket voice agent.

## Privacy boundary

1. Browser sends audio to the realtime voice transport.
2. Memory retrieval happens server-side.
3. `RESTRICTED` memory never enters external-provider context.
4. `PRIVATE` memory is excluded by default.
5. External LLM/STT/TTS providers never receive raw Memory.Nrul storage access.
6. Provider credentials remain server-side.
7. The realtime session has a short TTL.

## Environment flags

- `VOICE_REALTIME_ENABLED=true` enables the session contract as `ready`.
- `VOICE_REALTIME_PROVIDER=cloudflare-voice` selects the default provider.
- `VOICE_REALTIME_SESSION_TTL=300` controls the session TTL, clamped to 60–900 seconds.

## Next implementation step

Move the Pages runtime to a Worker/Agents entrypoint with a SQLite-backed Durable Object for the realtime voice agent. Keep `MemoryRepository`, retrieval, privacy filtering, and context packaging as the source of truth. Then connect the browser `VoiceClient` to the Durable Object WebSocket. Only after that should Twilio phone transport be enabled.
