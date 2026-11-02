-- Per-company lead inbox status on routed leads.
-- Additive: existing lead_routings rows default to company_status = 'new'.
-- Company A only sees/updates rows where company_slug matches (manage-token scoped).
-- Distinct from leads.status (operator admin workflow: new|contacted|closed).

ALTER TABLE lead_routings ADD COLUMN company_status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE lead_routings ADD COLUMN status_updated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_lead_routings_company_status
  ON lead_routings(company_slug, company_status);
