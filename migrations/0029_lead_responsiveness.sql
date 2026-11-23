-- Responsiveness signal: first view + first action timestamps on routed leads.
-- Additive and safe on existing data. Backfills first_acted_at from prior
-- status updates when the company already moved a lead out of "new".
-- Excludes nothing at the schema layer — metric helpers ignore reason='retained'.

ALTER TABLE lead_routings ADD COLUMN first_viewed_at TEXT;
ALTER TABLE lead_routings ADD COLUMN first_acted_at TEXT;

-- Best-effort backfill: prior inbox status changes imply a first action.
UPDATE lead_routings
SET first_acted_at = status_updated_at
WHERE first_acted_at IS NULL
  AND status_updated_at IS NOT NULL
  AND COALESCE(company_status, 'new') != 'new';

CREATE INDEX IF NOT EXISTS idx_lead_routings_company_acted
  ON lead_routings(company_slug, first_acted_at);

CREATE INDEX IF NOT EXISTS idx_lead_routings_company_viewed
  ON lead_routings(company_slug, first_viewed_at);
