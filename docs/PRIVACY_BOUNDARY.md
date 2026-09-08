# Privacy Boundary

Privacy is enforced in `src/memory/privacy.ts` and called server-side before context packaging and provider invocation.

- **PUBLIC**: eligible for external AI context.
- **PRIVATE**: visible only to authenticated clients; external use additionally requires `includePrivate: true` on that request.
- **RESTRICTED**: may be managed by an authenticated administrator, but is unconditionally removed whenever `externalProvider=true`.

`assertExternalPrivacy()` is a fail-closed invariant. The AI flow test injects `PUBLIC_CONTEXT_SENTINEL` and `RESTRICTED_SECRET_SENTINEL`, then inspects the mocked Groq payload to prove only the public sentinel crosses the boundary. Frontend filtering is presentation only and is never trusted.
