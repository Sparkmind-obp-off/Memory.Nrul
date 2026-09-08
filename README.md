# Memory.Nrul

General AI Memory & Context Continuity infrastructure. Memory—not the AI provider—is the core product.

## Completed

- Structured D1 memory model with extensible domains, types, links, lifecycle, validity, and confidence
- Authenticated memory CRUD with archive-on-delete
- Ranked retrieval using query/domain/recency/confidence/validity/link signals
- Deterministic context packages: state, memories, decisions, constraints, pending, next actions, history, checkpoint
- Session checkpoints/handoffs
- Server-side PUBLIC / PRIVATE / RESTRICTED enforcement
- Groq provider behind a replaceable `AIProvider` interface; OpenAI/Gemini extension points
- Validated export/import, responsive dashboard, AI flow indicators
- Unit/integration tests, live deployment smoke test, GitHub Actions

## URLs and API

Production: **https://memory-nrul.pages.dev** · GitHub: **https://github.com/Sparkmind-obp-off/Memory.Nrul**. Main routes:

- `/` dashboard
- `/api/health`
- `/api/auth/login|logout|status`
- `/api/memories` and `/api/memories/:id`
- `/api/retrieve?query=&domain=&limit=`
- `/api/context` and `/api/context/package`
- `/api/checkpoints`, `/api/checkpoints/latest`, `/api/checkpoints/:id`
- `/api/ai/status` and `/api/ai/chat`
- `/api/export` and `/api/import`

See `docs/API.md` for authorization and payload details.

## Privacy guarantee

PUBLIC is eligible for external providers. PRIVATE requires an authenticated request plus explicit `includePrivate: true`. RESTRICTED is always removed server-side before external provider calls. `tests/ai-flow.test.ts` verifies `PUBLIC_CONTEXT_SENTINEL` is sent and `RESTRICTED_SECRET_SENTINEL` is absent.

## Local development

```bash
npm ci
npm run db:migrate:local
# Put local-only keys in .dev.vars (ignored by git)
npm run dev
npm run typecheck
npm test
```

Required production secrets: `MEMORY_ADMIN_KEY`, `GROQ_API_KEY`; optional `GROQ_MODEL` defaults to `llama-3.3-70b-versatile`.

## Data architecture

Cloudflare D1 tables: `memories`, `memory_links`, `checkpoints`. Production never relies on process memory. The in-memory repository path exists only for deterministic tests and reports itself through `/api/health`.

## Deployment

Target: Cloudflare Pages Functions (Hono) + D1, BYOK. Create `memory-nrul-db`, replace `<REAL_DATABASE_ID>` in `wrangler.jsonc`, apply remote migrations, set Pages secrets, then deploy `public`. Exact commands are in `docs/DEPLOYMENT.md`.

## Continuation guide

Start with `docs/ARCHITECTURE.md`, `MEMORY_SCHEMA.md`, `CONTEXT_RECONSTRUCTION.md`, `MEMORY_LIFECYCLE.md`, `PRIVACY_BOUNDARY.md`, `AI_PROVIDER.md`, and `API.md`. Preserve the invariant: **no RESTRICTED memory may cross an external provider boundary**.

## Not yet implemented / next steps

- Full-text/vector retrieval and multi-tenant identities
- UI for memory-link graph editing
- Operational audit events and rate limiting
- OpenAI/Gemini production adapters

Deployment status: **active** on Cloudflare Pages BYOK with production D1. Groq activation is pending only the `GROQ_API_KEY` deployment secret.
