-- Claimed-company listing self-management.
-- manage_token: unguessable URL secret for /manage/<token>/ (no accounts).
-- listing_updated_at: set when an admin-approved edit is applied; public
-- profile merges D1 fields over the static seed only when this is set.
-- listing_edit_requests: pending proposed field updates awaiting moderation.

ALTER TABLE companies ADD COLUMN manage_token TEXT;
ALTER TABLE companies ADD COLUMN manage_token_created_at TEXT;
ALTER TABLE companies ADD COLUMN listing_updated_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_manage_token
  ON companies(manage_token);

CREATE TABLE IF NOT EXISTS listing_edit_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_slug TEXT NOT NULL,
  -- JSON objects of editable listing fields (see src/lib/listing-manage.ts).
  proposed_json TEXT NOT NULL,
  current_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at TEXT,
  review_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_listing_edit_requests_status
  ON listing_edit_requests(status);

CREATE INDEX IF NOT EXISTS idx_listing_edit_requests_slug
  ON listing_edit_requests(company_slug);

CREATE INDEX IF NOT EXISTS idx_listing_edit_requests_created_at
  ON listing_edit_requests(created_at);
