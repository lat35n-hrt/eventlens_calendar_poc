-- app/db/schema.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  uid TEXT,
  fingerprint TEXT NOT NULL,
  source_event_url TEXT,
  ics_url TEXT,
  external_url TEXT,

  title TEXT NOT NULL,
  event_type TEXT,
  departments TEXT,           -- JSON string
  location TEXT,
  is_virtual INTEGER NOT NULL DEFAULT 0,
  cme_eligible INTEGER NOT NULL DEFAULT 0,
  cme_credits REAL,

  start_at TEXT NOT NULL,     -- ISO8601
  end_at TEXT,
  timezone TEXT,

  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',

  raw_payload TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_events_source_uid
ON events(source, uid)
WHERE uid IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_events_source_fingerprint
ON events(source, fingerprint);

CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_virtual ON events(is_virtual);
CREATE INDEX IF NOT EXISTS idx_events_cme ON events(cme_eligible);

CREATE TABLE IF NOT EXISTS runs (
  run_id TEXT PRIMARY KEY,
  run_date TEXT NOT NULL,
  source TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  fetched_count INTEGER NOT NULL DEFAULT 0,
  upserted_count INTEGER NOT NULL DEFAULT 0,
  removed_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  output_zip_path TEXT
);
