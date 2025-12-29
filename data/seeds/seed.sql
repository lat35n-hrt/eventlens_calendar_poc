-- data/seeds/seed.sql
-- Seed data for local development / API & UI validation
-- Re-runnable: uses INSERT OR REPLACE with fixed IDs.

INSERT OR REPLACE INTO events (
  id, source, uid, fingerprint, source_event_url, ics_url, external_url,
  title, event_type, departments, location, is_virtual, cme_eligible, cme_credits,
  start_at, end_at, timezone,
  first_seen_at, last_seen_at, status, raw_payload
) VALUES (
  1,
  'wcm',
  'seed-uid-001',
  'seed-fp-001',
  'https://events.example.test/wcm/seed-001',
  'https://events.example.test/wcm/seed-001.ics',
  'https://dept.example.test/neurology/grand-rounds',
  'Neurology Grand Rounds: Advances in Stroke Care',
  'Grand Rounds',
  '["Neurology","Medicine"]',
  'Zoom',
  1,
  1,
  1.0,
  '2026-01-15T12:00:00-05:00',
  '2026-01-15T13:00:00-05:00',
  'America/New_York',
  '2025-12-28T00:00:00Z',
  '2025-12-28T00:00:00Z',
  'active',
  '{"seed":true,"note":"virtual + cme"}'
);

INSERT OR REPLACE INTO events (
  id, source, uid, fingerprint, source_event_url, ics_url, external_url,
  title, event_type, departments, location, is_virtual, cme_eligible, cme_credits,
  start_at, end_at, timezone,
  first_seen_at, last_seen_at, status, raw_payload
) VALUES (
  2,
  'wcm',
  'seed-uid-002',
  'seed-fp-002',
  'https://events.example.test/wcm/seed-002',
  'https://events.example.test/wcm/seed-002.ics',
  NULL,
  'Cardiology Lecture: Heart Failure Updates',
  'Lecture/Seminar',
  '["Cardiology"]',
  'Weill Cornell Auditorium',
  0,
  0,
  NULL,
  '2026-01-20T17:30:00-05:00',
  '2026-01-20T18:30:00-05:00',
  'America/New_York',
  '2025-12-28T00:00:00Z',
  '2025-12-28T00:00:00Z',
  'active',
  '{"seed":true,"note":"in-person + non-cme"}'
);

INSERT OR REPLACE INTO events (
  id, source, uid, fingerprint, source_event_url, ics_url, external_url,
  title, event_type, departments, location, is_virtual, cme_eligible, cme_credits,
  start_at, end_at, timezone,
  first_seen_at, last_seen_at, status, raw_payload
) VALUES (
  3,
  'wcm',
  'seed-uid-003',
  'seed-fp-003',
  'https://events.example.test/wcm/seed-003',
  NULL,
  NULL,
  'Oncology Research Seminar: Immunotherapy Pipeline',
  'Research Seminar',
  '["Oncology","Research"]',
  'Online',
  1,
  0,
  NULL,
  '2026-02-05T09:00:00-05:00',
  '2026-02-05T10:00:00-05:00',
  'America/New_York',
  '2025-12-28T00:00:00Z',
  '2025-12-28T00:00:00Z',
  'active',
  '{"seed":true,"note":"virtual + non-cme, no ics_url"}'
);
