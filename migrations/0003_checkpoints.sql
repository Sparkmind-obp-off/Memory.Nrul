CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY,
  summary TEXT NOT NULL,
  current_state TEXT,
  pending TEXT,
  next_actions TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_checkpoints_created ON checkpoints(created_at);
CREATE INDEX IF NOT EXISTS idx_checkpoints_session ON checkpoints(session_id);
