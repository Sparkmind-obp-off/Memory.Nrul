# API

Public reads: `GET /api/health`, `/api/auth/status`, `/api/memories`, `/api/memories/:id`, `/api/retrieve?query=&domain=&limit=`, `/api/context?query=`, `/api/checkpoints`, `/api/checkpoints/latest`, `/api/ai/status`.

Authenticated mutation: `POST /api/auth/login`, `POST /api/auth/logout`, `POST|PUT|DELETE /api/memories[/:id]`, `POST|DELETE /api/checkpoints[/:id]`, `GET /api/export`, `POST /api/import`, `POST /api/ai/chat`.

Context: `POST /api/context/package` accepts `{query, includePrivate}`. AI chat accepts `{message, includePrivate}`; PRIVATE inclusion requires authentication plus explicit true. Bearer automation uses `Authorization: Bearer <MEMORY_ADMIN_KEY>`. Import requires schema `memory.nrul.export` and validates every memory.
