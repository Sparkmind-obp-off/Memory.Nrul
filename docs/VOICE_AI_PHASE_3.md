# Phase 3 — Voice AI di HP

## Goal
Memory.Nrul menjadi memory/context layer yang bisa dipakai dari browser HP. Runtime AI tetap provider eksternal; repository ini tidak menjadi model AI.

## Stack
- Memory/context: Hono + Cloudflare Pages/Functions + D1
- AI: provider eksternal, Groq pertama
- Voice MVP: Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition` + `speechSynthesis`)
- Future realtime audio: provider STT/TTS atau realtime voice melalui adapter provider-neutral
- Genspark: builder/auditor, bukan runtime dependency

## Audio flow
```text
HP microphone → Browser Speech Recognition → transcript
→ /api/voice/chat → Memory retrieval → privacy filter
→ Context package → Groq → answer text → speechSynthesis → speaker HP
```

Future realtime flow memakai titik integrasi yang sama:
```text
audio input → STT/realtime adapter → /api/voice/chat
→ Memory → Context → Privacy → AI → TTS/realtime adapter → audio output
```

## API contract
### GET /api/voice/status
Returns capability metadata tanpa secret:
```json
{"ok":true,"voice":"browser","configured":true,"provider":"groq","stt":"browser-speech-recognition","tts":"browser-speech-synthesis","phoneCallReady":false}
```

### POST /api/voice/chat
Authenticated. MVP menerima transcript, bukan raw audio:
```json
{"message":"Jelaskan status proyek Memory.Nrul","includePrivate":false}
```
Response mengikuti `/api/ai/chat` dan menambahkan:
```json
{"voice":{"input":"transcript","output":"text"}}
```

## Privacy boundary
1. RESTRICTED tidak pernah dikirim ke external AI provider.
2. PRIVATE excluded by default untuk external-provider calls.
3. PRIVATE hanya boleh disertakan melalui request authenticated + `includePrivate: true`.
4. Raw microphone audio tidak disimpan Memory.Nrul pada MVP.
5. Transcript mengikuti batas input API yang sama.
6. Provider API keys tetap server-side.
7. Adapter audio masa depan wajib melewati privacy filter yang sama.

## Provider structure
`src/voice/provider.ts` menyediakan kontrak:
- `SpeechToTextProvider`
- `TextToSpeechProvider`
- `VoiceProvider`

Memory retrieval tidak bergantung pada vendor voice tertentu.

## Acceptance criteria
- [x] Provider-neutral STT/TTS contracts
- [x] Voice status endpoint
- [x] Voice chat memakai Memory → Context → Privacy → AI pipeline
- [x] Browser microphone UX untuk browser yang mendukung
- [x] Browser TTS membacakan jawaban AI
- [x] RESTRICTED tetap diblokir
- [ ] Raw-audio STT endpoint
- [ ] Streaming/realtime voice adapter
- [ ] Integrasi layanan telephony/realtime untuk panggilan

Phase 3 selesai untuk browser voice loop. Integrasi panggilan adalah fase adapter berikutnya, bukan rewrite Memory.Nrul.
