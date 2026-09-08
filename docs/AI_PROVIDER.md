# AI Provider Layer

`AIProvider` exposes `name`, `model`, and `chat(messages)`. `GroqProvider` is selected by `createAIProvider()` when `GROQ_API_KEY` exists. OpenAI and Gemini adapter classes reserve stable extension points without requiring credentials.

The browser never calls providers. `/api/ai/chat` authenticates, retrieves ranked memory, applies external privacy policy, constructs a deterministic package, formats a bounded system block, and calls Groq server-side. Secrets are Cloudflare Pages secrets: `GROQ_API_KEY`, `GROQ_MODEL`, and `MEMORY_ADMIN_KEY`.
