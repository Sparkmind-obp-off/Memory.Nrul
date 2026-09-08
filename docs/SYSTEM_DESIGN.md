# Memory.Nrul System Design

## 1. Product Role

Memory.Nrul is a **memory and context continuity engine**, not an AI model.

The system stores, retrieves, filters, reconstructs, and packages context so an external AI provider can continue work from a reliable prior state.

External AI providers are replaceable. The first integration target is Groq; additional providers such as OpenAI or Gemini can be added without changing the memory core.

## 2. System Boundary

```text
┌──────────────────────────────────────────────────────────────┐
│                         USER / CLIENT                        │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    MEMORY.NRUL API LAYER                     │
│  Auth · Memories · Retrieval · Context · Checkpoints · AI   │
└──────────────┬───────────────────────┬───────────────────────┘
               │                       │
               ▼                       ▼
┌─────────────────────────┐   ┌────────────────────────────────┐
│     MEMORY ENGINE        │   │       CONTEXT ENGINE            │
│                         │   │                                │
│ CRUD · classification   │   │ retrieve → filter → reconstruct│
│ tags · entities · state │   │ → package → handoff            │
└────────────┬────────────┘   └───────────────┬────────────────┘
             │                                │
             ▼                                ▼
┌─────────────────────────┐       ┌─────────────────────────────┐
│      D1 / STORAGE       │       │     PROVIDER ADAPTER        │
│ memories · links        │       │                             │
│ checkpoints             │       │ Groq → OpenAI → Gemini ...  │
└─────────────────────────┘       └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │       EXTERNAL AI           │
                                  │   model inference only      │
                                  └─────────────────────────────┘
```

## 3. Core Layers

### Layer A — API / Access

Responsibilities:
- authenticate the caller
- expose stable HTTP endpoints
- validate request payloads
- prevent unauthorized memory access

### Layer B — Memory Engine

Responsibilities:
- create/update/archive memories
- maintain memory type, domain, tags, entities, confidence, validity
- maintain relationships between memories
- preserve supersession history

Supported memory types:
- fact
- preference
- decision
- situation
- task
- event
- relationship
- project
- handoff

### Layer C — Context Engine

Responsibilities:
1. receive the current query/session intent
2. retrieve relevant memory
3. apply privacy/access rules
4. identify current state
5. include the latest checkpoint when relevant
6. reconstruct a compact context package
7. distinguish facts, decisions, assumptions, pending work, and next actions

The context engine is the main continuity layer.

### Layer D — Checkpoint / Handoff

A checkpoint captures the state required to resume work later without replaying the whole conversation.

Minimum checkpoint shape:

```text
Checkpoint {
  id
  summary
  currentState
  pending[]
  nextActions[]
  sessionId?
  createdAt
}
```

### Layer E — Provider Adapter

The memory system never depends on a specific model vendor.

Provider contract:

```text
AIProvider
  name
  model
  chat(messages)
```

Initial implementation:

```text
AI_PROVIDER = groq
GROQ_API_KEY = server secret
GROQ_MODEL = configured model
```

Future providers implement the same logical contract.

## 4. AI Request Flow

```text
User message
    ↓
Authenticate
    ↓
Retrieve relevant memories
    ↓
Apply privacy policy
    ↓
Load latest checkpoint
    ↓
Reconstruct context
    ↓
Build provider-neutral messages
    ↓
Provider adapter
    ↓
Groq / external AI
    ↓
AI response
    ↓
Optional checkpoint/update
```

The external model does **not** become the source of truth for stored memory.

## 5. Privacy Model

```text
PUBLIC
  Safe schema, non-sensitive decisions, project metadata

PRIVATE
  Sensitive continuity context, available only to authorized access

RESTRICTED
  Secrets, credentials, or protected data; excluded from normal external-AI context by default
```

Rules:
- never place credentials in repository files
- never expose provider API keys to the browser
- never send RESTRICTED data to an external AI provider by default
- privacy filtering happens before provider invocation
- authorization is checked before private context retrieval

## 6. Source of Truth

Memory describes context. It does not replace reality.

For technical/project state:

```text
Memory → tells us what was decided
Repository / runtime / external source → verifies what is actually true
```

When memory conflicts with an authoritative current source, the current source wins and the memory should be updated or superseded.

## 7. Persistence Strategy

Current development mode supports an in-memory fallback so the application can run before Cloudflare D1 is configured.

Production target:

```text
Cloudflare Pages
      +
Cloudflare Pages Functions
      +
Cloudflare D1
      +
External AI Provider
```

No provider-specific storage is required.

## 8. Stable API Surface

Core endpoints:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/status

GET    /api/memories
GET    /api/memories/:id
POST   /api/memories
PUT    /api/memories/:id
DELETE /api/memories/:id
GET    /api/retrieve

GET    /api/checkpoints
GET    /api/checkpoints/latest
POST   /api/checkpoints
DELETE /api/checkpoints/:id

GET    /api/context
POST   /api/context/package

GET    /api/export
POST   /api/import

POST   /api/ai/chat
GET    /api/ai/status
```

The AI endpoints are an integration layer over the existing memory/context APIs, not a replacement for them.

## 9. UI Information Architecture

```text
Dashboard
├── Overview
├── Memories
│   ├── All
│   ├── By Domain
│   ├── By Type
│   └── Privacy
├── Context
│   ├── Reconstruct
│   └── Context Package
├── Checkpoints
│   ├── Latest
│   └── History
├── AI Chat
│   ├── Provider
│   ├── Context Preview
│   └── Conversation
└── System
    ├── Health
    ├── Architecture
    └── Import / Export
```

The UI should make the continuity pipeline visible rather than hiding it behind a generic chat screen.

## 10. Design Principles

1. **Memory first, model second.**
2. **External AI is replaceable.**
3. **Context is reconstructed, not blindly replayed.**
4. **Privacy filtering happens before external inference.**
5. **Current source of truth beats stale memory.**
6. **Checkpoints make sessions resumable.**
7. **Public repository content must remain safe to publish.**
8. **Keep the first implementation simple enough to deploy and test.**

## 11. Implementation Sequence

```text
SYSTEM DESIGN
     ↓
D1 ACTIVATION
     ↓
GROQ PROVIDER ADAPTER
     ↓
/api/ai/chat
     ↓
CONTEXT INJECTION
     ↓
END-TO-END TEST
     ↓
UI POLISH
     ↓
ADDITIONAL PROVIDERS
```

This keeps infrastructure, memory logic, and AI inference cleanly separated.
