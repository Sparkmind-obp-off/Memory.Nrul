# Context Reconstruction

Retrieval considers lexical query hits, requested domains, recency, confidence, active status, validity windows, and graph-link presence. Results are bounded and sorted deterministically.

The privacy filter runs after retrieval and before packaging. A package separates context, decisions, constraints, current state, pending tasks, next actions, history, and latest checkpoint. External packages default to PUBLIC. PRIVATE requires authenticated explicit authorization. RESTRICTED is always blocked.

Current-session input overrides stale memory. Memory is context, not unquestionable truth. Verify against current state and update/archive records when materially changed.
