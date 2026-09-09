# Memory.Nrul — Genspark Execution Brief v0.1

## Mission
Turn the existing Memory.Nrul repository into a genuinely usable, tested, secure, and production-ready product.

Do not build a superficial demo and do not restart from zero unless the existing architecture is demonstrably unsuitable.

## Authority and Roles
- Product Owner: user
- Co-Owner / Product & Engineering Partner: ChatGPT
- Execution Layer: Genspark Code
- Durable Source of Truth: GitHub
- Product contract: `PRODUCT_DEFINITION.md`

Read `PRODUCT_DEFINITION.md` completely before making implementation decisions.

## First Task — Audit Before Coding
Inspect the entire repository and determine:
1. Current architecture and stack.
2. Existing product capabilities.
3. Existing AI and voice capabilities.
4. Existing authentication and privacy boundaries.
5. Existing database schema and migrations.
6. Existing tests and CI/CD.
7. Existing deployment configuration.
8. Current production/runtime state.
9. Gaps against `PRODUCT_DEFINITION.md`.
10. Highest-value blockers preventing a production-ready release.

Do not immediately rewrite the application.

## Execution Loop
After the audit:

**AUDIT → GAP ANALYSIS → PLAN → IMPLEMENT → TEST → FIX → DEPLOY → VERIFY → DOCUMENT**

Execute the highest-priority work needed to satisfy the product definition.

## Engineering Requirements
Preserve useful existing work.

Prioritize:
- working core user flow
- reliable memory retrieval/context reconstruction
- privacy boundaries
- authentication for protected operations
- AI Chat
- Voice where enabled
- robust API behavior
- frontend usability
- tests
- error handling
- security
- production deployment
- production runtime verification

Do not add features merely because they are technically interesting.

## Privacy Rules
Never expose RESTRICTED data to unauthenticated callers or external AI providers.
PRIVATE data requires authorization and must not automatically cross an external-provider boundary.
PUBLIC data may be used for normal retrieval according to the application rules.

Treat privacy tests as release-blocking tests.

## Production Definition
Do not report "production-ready" merely because:
- the code compiles,
- local tests pass, or
- deployment succeeds.

Production-ready requires successful deployment AND verification of the real production runtime and critical user flows.

Verify, at minimum:
- health/status endpoint
- core memory flow
- AI Chat flow
- Voice flow when enabled
- authentication/protected operation behavior
- privacy boundary behavior
- frontend availability

## GitHub Rules
GitHub is the durable source of truth.

Commit meaningful implementation changes to the repository.
Keep documentation synchronized with the actual implementation.
Do not leave the repository dependent on undocumented manual steps.

## Deployment Rules
Use the repository's existing intended deployment path unless the audit shows it is broken or unsuitable.

If deployment fails:
1. capture the exact failure,
2. identify the root cause,
3. fix it,
4. rerun the relevant tests,
5. redeploy,
6. verify production again.

Do not stop at reporting an error when it is reasonably fixable.

## Scope Control
Do NOT prioritize:
- enterprise billing
- complex multi-tenancy
- provider marketplace
- advanced analytics
- broad enterprise compliance
- unrelated feature expansion

Those are later-stage concerns.

The current objective is a strong core product.

## Destructive Changes
Before any destructive architectural rewrite, explain:
- what will be removed,
- why it is necessary,
- what product behavior changes,
- what migration risk exists.

Prefer incremental improvement when possible.

## Final Production Readiness Report
At the end, report exactly these sections:

### 1. Implemented
Concrete changes completed.

### 2. Tested
Tests executed and results.

### 3. Deployed
Deployment target, deployment result, and commit/version.

### 4. Production-Verified
Real runtime checks and critical flows verified.

### 5. Remaining Blockers
Only actual blockers. Clearly distinguish blockers from optional improvements.

### 6. Recommended Next Step
One highest-value next action.

## Stop Condition
The task is not complete until either:

A. the Definition of Done is satisfied and production is verified; OR

B. a genuine external blocker prevents completion, in which case document the exact blocker, evidence, and smallest required action to unblock it.

Do not stop simply because the first implementation attempt is complete.
