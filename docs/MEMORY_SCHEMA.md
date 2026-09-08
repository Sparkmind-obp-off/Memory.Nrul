# Memory Schema

`memories` stores id, title, domain, memory_type, summary, content, privacy_class, status, confidence, source, JSON tags/entities/metadata, validity window, supersession pointer, timestamps, and verification time. Values are constrained in application code and SQL for privacy/status.

Supported domains: Conversation, Personal, Relationship, Project, Decision, Situation, History, Timeline, Preferences, Constraints, Tasks, Pending, Session Handoff, System. Types: fact, preference, decision, constraint, goal, event, state, task, relationship, instruction, summary, handoff.

`memory_links` represents supports, contradicts, supersedes, depends_on, related_to, derived_from, and caused_by. `checkpoints` stores session ID, summary, current state, completed, pending, next actions, decisions, constraints, and creation time. Arrays and extensible metadata use validated JSON text for D1 portability.
