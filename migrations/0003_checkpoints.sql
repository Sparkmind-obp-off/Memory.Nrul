-- Add session linkage to checkpoints created by 0001_initial_schema.sql.
ALTER TABLE checkpoints ADD COLUMN session_id TEXT;
CREATE INDEX IF NOT EXISTS idx_checkpoints_session ON checkpoints(session_id);
