ALTER TABLE memories ADD COLUMN memory_type TEXT NOT NULL DEFAULT 'fact';
ALTER TABLE memories ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE memories ADD COLUMN entities_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE memories ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE memories ADD COLUMN valid_from TEXT;
ALTER TABLE memories ADD COLUMN valid_until TEXT;
ALTER TABLE memories ADD COLUMN supersedes_id TEXT;
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_valid_until ON memories(valid_until);
