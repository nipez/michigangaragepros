-- Lead preferences for claimed companies: city/service filters + temporary pause.
-- Safe defaults preserve today's routing for every existing row:
--   leads_paused = 0, leads_resume_at NULL, empty city/service lists = accept all.

ALTER TABLE companies ADD COLUMN leads_paused INTEGER NOT NULL DEFAULT 0;
ALTER TABLE companies ADD COLUMN leads_resume_at TEXT;
ALTER TABLE companies ADD COLUMN lead_pref_cities TEXT;
ALTER TABLE companies ADD COLUMN lead_pref_services TEXT;

CREATE INDEX IF NOT EXISTS idx_companies_leads_paused
  ON companies(leads_paused);
