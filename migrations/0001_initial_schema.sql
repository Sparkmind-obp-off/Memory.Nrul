-- Memory.Nrul logical persistence schema (Cloudflare D1 / SQLite)
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  privacy_class TEXT NOT NULL CHECK (privacy_class IN ('PUBLIC','PRIVATE','RESTRICTED')),
  status TEXT NOT NULL DEFAULT 'active',
  confidence REAL DEFAULT 1.0,
  source TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_verified TEXT
);
CREATE INDEX IF NOT EXISTS idx_memories_domain ON memories(domain);
CREATE INDEX IF NOT EXISTS idx_memories_privacy ON memories(privacy_class);
CREATE INDEX IF NOT EXISTS idx_memories_updated ON memories(updated_at);
CREATE TABLE IF NOT EXISTS memory_links (
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relation TEXT NOT NULL,
  PRIMARY KEY (source_id,target_id,relation),
  FOREIGN KEY(source_id) REFERENCES memories(id),
  FOREIGN KEY(target_id) REFERENCES memories(id)
);
CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY,
  summary TEXT NOT NULL,
  current_state TEXT,
  pending TEXT,
  next_actions TEXT,
  created_at TEXT NOT NULL
);
