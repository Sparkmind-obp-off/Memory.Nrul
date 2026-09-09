# Memory.Nrul — Product Definition v0.1

## Roles
- **Product Owner:** User
- **Co-Owner / Product & Engineering Partner:** ChatGPT
- **Execution Layer:** Genspark Code
- **Source of Truth:** GitHub

## 1. Product
Memory.Nrul is a memory/context continuity layer for AI applications. It preserves useful context across conversations and sessions so an AI application can continue work without repeatedly losing situation, decisions, constraints, history, current state, and next actions.

It is **not another AI model**. It is a context/memory infrastructure layer that can sit underneath AI applications.

## 2. Core Problem
AI conversations are often fragmented. Important information gets lost between sessions, causing repeated explanations, inconsistent decisions, and broken continuity.

## 3. Core Value
The core loop is:

**READ MEMORY → VERIFY CURRENT STATE → RECONSTRUCT CONTEXT → CONTINUE → EXECUTE → CHECKPOINT**

The desired experience is: **the AI remembers enough of the work to continue intelligently.**

## 4. Initial Target User
Primary users are people building or operating AI-assisted projects where continuity matters: founders, product owners, developers, AI agents, and teams managing long-running projects.

Initial validation target: one real user should be able to use Memory.Nrul for an ongoing project and experience meaningful continuity across sessions.

## 5. MVP — Must Have
- Memory creation and retrieval
- Structured memory
- Context reconstruction
- Session/checkpoint support
- Privacy classes: PUBLIC, PRIVATE, RESTRICTED
- Privacy-safe context filtering
- AI chat using retrieved context
- Voice interaction foundation
- Authentication for protected operations
- API endpoints
- Web dashboard
- Production deployment
- Health/status checks
- Automated tests
- Documentation

### Not MVP
Do not prioritize enterprise billing, complex multi-tenancy, a provider marketplace, advanced analytics, large team administration, an agent marketplace, or broad enterprise compliance before the core product proves useful.

## 6. Privacy Model
**PUBLIC:** safe context usable for normal AI retrieval.

**PRIVATE:** sensitive context requiring authorization; should not automatically be exposed to external providers.

**RESTRICTED:** highly protected data; never expose to unauthenticated callers or external AI providers.

Privacy boundaries are a core product feature.

## 7. User Experience
A user should be able to:
1. Open the application.
2. Create or continue a project/session.
3. Store meaningful context.
4. Ask the AI to continue the work.
5. Have relevant memory retrieved automatically.
6. See the AI use that context.
7. Create a checkpoint.
8. Return later and continue.

## 8. Definition of Done
A release is production-ready only when:
- Core user flows work.
- Automated tests pass.
- Privacy boundaries are verified.
- Authentication works for protected operations.
- AI integration works.
- Voice integration works where enabled.
- Production deployment succeeds.
- Production runtime is verified.
- Errors are handled reasonably.
- Secrets are not exposed.
- Documentation is sufficient.
- GitHub contains the durable source of truth.
- Known limitations are documented.

**Compiling is not “done.” Deployment alone is not “done.”**

## 9. Architecture Direction
Initial direction:
- Cloudflare Workers
- Hono
- D1
- Durable Objects for realtime voice/session behavior
- Workers AI for voice infrastructure
- External AI providers through controlled integration
- Browser dashboard
- GitHub as source of truth

Architecture may evolve when the change clearly improves production quality without violating product requirements or privacy boundaries.

## 10. Genspark Execution Rules
Treat Genspark Code as the **execution layer**, not the product owner.

Given this document, the execution agent must:
1. Inspect the existing repository.
2. Understand the current implementation.
3. Identify gaps against this Product Definition.
4. Produce an implementation plan.
5. Implement the highest-priority gaps.
6. Run tests.
7. Fix failures.
8. Verify security/privacy boundaries.
9. Deploy using the intended production path.
10. Verify the deployed runtime.
11. Update documentation.
12. Report what changed, what was tested, deployment result, production verification result, and remaining blockers.

Do not stop at code generation. Do not declare production-ready merely because deployment succeeds.

## 11. Product Strategy
**Phase 1:** Make Memory.Nrul genuinely usable.

**Phase 2:** Make the implementation reliable and repeatable.

**Phase 3:** Extract reusable patterns into a broader platform/foundation.

**Phase 4:** Add additional applications/providers only when justified by real product value.

Enterprise is a later outcome, not the starting requirement.

## 12. Decision Principles
When feature expansion conflicts with core reliability, choose reliability.

When technical novelty conflicts with user value, choose user value.

When a fast demo conflicts with production correctness, choose production correctness for anything labeled production-ready.

---

# Genspark Execution Brief

Build/refine the existing Memory.Nrul repository according to this Product Definition.

Do not create a superficial demo. Treat the existing repository as the starting point and preserve useful existing work.

Your responsibility is **execution**:
**inspect → plan → implement → test → fix → deploy → verify → document**

Before destructive architectural changes, explain the change and its product impact.

Final report must contain:
1. Implemented
2. Tested
3. Deployed
4. Production-verified
5. Remaining blockers
6. Recommended next step
