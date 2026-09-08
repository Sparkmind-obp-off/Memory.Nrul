PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS memories (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, domain TEXT NOT NULL, summary TEXT NOT NULL, content TEXT NOT NULL,
 privacy_class TEXT NOT NULL CHECK(privacy_class IN ('PUBLIC','PRIVATE','RESTRICTED')),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','archived','superseded','expired')),
 confidence REAL NOT NULL DEFAULT 1 CHECK(confidence >= 0 AND confidence <= 1), source TEXT,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL, last_verified TEXT
);
CREATE INDEX IF NOT EXISTS idx_memories_domain ON memories(domain);
CREATE INDEX IF NOT EXISTS idx_memories_privacy ON memories(privacy_class);
CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status);
CREATE INDEX IF NOT EXISTS idx_memories_updated ON memories(updated_at);
CREATE TABLE IF NOT EXISTS memory_links (
 source_id TEXT NOT NULL, target_id TEXT NOT NULL,
 relation TEXT NOT NULL CHECK(relation IN ('supports','contradicts','supersedes','depends_on','related_to','derived_from','caused_by')),
 PRIMARY KEY(source_id,target_id,relation), FOREIGN KEY(source_id) REFERENCES memories(id), FOREIGN KEY(target_id) REFERENCES memories(id)
);
CREATE INDEX IF NOT EXISTS idx_links_target ON memory_links(target_id);
CREATE TABLE IF NOT EXISTS checkpoints (id TEXT PRIMARY KEY,summary TEXT NOT NULL,current_state TEXT,pending TEXT,next_actions TEXT,created_at TEXT NOT NULL);
