# Memory.Nrul Architecture

Memory.Nrul is a domain-general AI memory and context continuity platform. Runtime: Cloudflare Pages Functions + Hono + D1 + static dashboard.

## Request pipeline

`Client → centralized auth → repository → ranked retrieval → server privacy filter → deterministic context package → replaceable provider → response → checkpoint`

Modules: `memory/repository` abstracts D1/test fallback; `retrieval` scores query/domain/recency/confidence/status/validity/link signals; `privacy` enforces PUBLIC/PRIVATE/RESTRICTED; `context/package` creates machine-readable sections; `checkpoint/service` creates handoffs; `ai/*` isolates providers; `auth/auth` centralizes cookie/Bearer checks; `src/index.ts` composes Hono routes.

D1 is the production source of truth. Memory domains and types are stored as values rather than separate tables, so new domains can be added with a validation update rather than schema redesign. Memory links form an extensible relation graph.

Operating loop: **READ MEMORY → VERIFY CURRENT STATE → RECONSTRUCT CONTEXT → CONTINUE → EXECUTE → CHECKPOINT**.
