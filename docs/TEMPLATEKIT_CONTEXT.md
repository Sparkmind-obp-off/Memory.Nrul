# TemplateKit — Context & Continuity

## 1. Project Identity

- Product/platform: **TemplateKit**
- Repository: `Sparkmind-obp-off/TemplateKit`
- Production app: `https://templatekit.pages.dev`
- Intended custom domain: `templatekit.web.id`
- First vertical / MVP: **Hook Generator**
- TemplateKit is the umbrella product; Hook Generator is the first concrete vertical, not a separate replacement project.

## 2. Product Vision

TemplateKit is a practical digital product platform focused on helping users create marketing content faster through reusable templates and generation tools.

The initial MVP turns simple content information into multiple ready-to-use TikTok hooks with minimal input.

Core flow:

`User Input → Hook Framework → Generation Logic → Quality Control → Hook Output`

Core principle:

`Template First, AI Second`

AI is an enhancement layer, not the foundation of the product logic.

## 3. Current MVP — Hook Generator

The first validated product direction is a TikTok Hook Generator.

The generator includes:
- Hook frameworks/templates
- Generation logic
- AI provider chain
- Local deterministic fallback
- Validation
- Quality control
- Diversity/ranking
- Copy/regenerate behavior
- Exclusions
- Feedback and analytics
- Rate limiting

## 4. Technical Context

Current stack:
- Hono + TypeScript
- Vite
- Cloudflare Pages
- Cloudflare D1
- Frontend/static assets
- API routes under `/api/*`

Current pages include:
- `/`
- `/generator`
- `/how-it-works`
- `/privacy`
- `/terms`
- `/robots.txt`
- `/sitemap.xml`

Important API endpoints:
- `/api/health`
- `/api/meta`
- `POST /api/generate`
- `POST /api/feedback`
- `POST /api/event`
- `/api/stats`

AI provider order:
1. Groq — `openai/gpt-oss-120b`
2. OpenRouter — `meta-llama/llama-3.3-70b-instruct`
3. Local deterministic template engine

Database:
- Cloudflare D1 database: `templatekit-production`
- Binding: `DB`
- Initial migration: `migrations/0001_initial_schema.sql`

## 5. Repository / Implementation Context

The TemplateKit repository already contains substantial implementation. Do not restart product ideation or treat TemplateKit as an empty concept.

Important areas include:
- `src/index.tsx`
- `src/routes/api.ts`
- `src/types.ts`
- `src/lib/persistence.ts`
- `src/lib/rate-limit.ts`
- `src/lib/validation.ts`
- `src/modules/hook-generator/application/`
- `src/modules/hook-generator/domain/`
- `src/modules/hook-generator/infrastructure/`
- `src/modules/hook-generator/templates/`
- `src/views/`
- `public/static/`
- `migrations/`

## 6. Known Pending Work

Known roadmap items from the existing project context:
- Activate the custom domain `templatekit.web.id`
- Auth
- Additional generators such as caption, script, and CTA
- Per-user history
- Visual analytics dashboard
- Monetization / paywall

Custom domain context:
- Domain is registered in the Cloudflare Pages project but was pending due to the available Cloudflare API token lacking `Zone → DNS → Edit` permission.
- Intended DNS setup is CNAME `@ → templatekit.pages.dev`, with proxy enabled.
- A dashboard/regenerated token with the required DNS permission can finish this step.

## 7. Execution Philosophy

The project should be advanced through small, concrete increments rather than endless planning.

Preferred protocol:

`MICRO-TASK → IMPLEMENT → TEST → COMMIT → PUSH → CHECKPOINT → STOP`

The broader business loop is:

`skill/resources → build something → publish → users → monetize → validate → improve → scale`

Cashflow/survival work and digital-asset growth can run in parallel. The goal is to build a real asset, get it in front of users, learn from usage, and monetize it.

## 8. Continuity Rules for Future Sessions

When continuing TemplateKit:

1. Read the relevant context in Memory.Nrul.
2. Inspect the actual current state of the TemplateKit GitHub repository before making implementation claims.
3. Do not ask again what product should be built; the product direction is already decided.
4. Treat **TemplateKit** as the umbrella product and **Hook Generator** as its first MVP/vertical.
5. Choose one concrete micro-task.
6. Implement it.
7. Test or verify it.
8. Commit and push.
9. Report the checkpoint clearly.
10. Stop at the agreed checkpoint rather than expanding scope unnecessarily.

## 9. Scope Boundary

Memory.Nrul is a continuity/context repository. It does not replace the TemplateKit source repository and should not contain application source code unless explicitly needed for documentation/context.

TemplateKit remains the actual product/application repository.

## 10. Source Checkpoint

This context was created to preserve continuity between ChatGPT sessions and prevent loss of decisions already made about TemplateKit.

The canonical implementation remains the GitHub repository:
`https://github.com/Sparkmind-obp-off/TemplateKit`

The canonical continuity hub is:
`https://github.com/Sparkmind-obp-off/Memory.Nrul`
