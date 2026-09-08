# Deployment — Cloudflare BYOK

1. Authenticate through the project Deploy panel (never `wrangler login`).
2. `npx wrangler d1 create memory-nrul-db`
3. Put the real database ID in `wrangler.jsonc` under binding `DB`.
4. `npx wrangler d1 migrations apply memory-nrul-db --remote`
5. Create Pages project with production branch `main`.
6. Set secrets with `wrangler pages secret put GROQ_API_KEY`, `GROQ_MODEL`, and `MEMORY_ADMIN_KEY`.
7. `npm run typecheck && npm test`
8. `npx wrangler pages deploy public --project-name <project>`

Local D1: apply migrations with `--local`, then run Wrangler Pages dev. Never commit `.dev.vars`, tokens, or generated `.wrangler` state.
