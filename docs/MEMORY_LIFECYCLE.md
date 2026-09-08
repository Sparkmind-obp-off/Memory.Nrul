# Memory Lifecycle

Capture → validate → classify → store → index/link → retrieve → verify → update/supersede → archive/expire → checkpoint.

Mutations require server authentication. DELETE archives memory rather than destroying history. `valid_from` and `valid_until` control retrieval eligibility. `supersedes_id` and graph links preserve rationale and provenance. Confidence and `last_verified` allow ranking to prefer trusted context. Export/import is structured and import rejects invalid schema or values.
