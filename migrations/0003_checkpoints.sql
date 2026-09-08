ALTER TABLE checkpoints ADD COLUMN session_id TEXT;
ALTER TABLE checkpoints ADD COLUMN completed_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE checkpoints ADD COLUMN pending_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE checkpoints ADD COLUMN next_actions_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE checkpoints ADD COLUMN decisions_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE checkpoints ADD COLUMN constraints_json TEXT NOT NULL DEFAULT '[]';
CREATE INDEX IF NOT EXISTS idx_checkpoints_session ON checkpoints(session_id);
CREATE INDEX IF NOT EXISTS idx_checkpoints_created ON checkpoints(created_at);
