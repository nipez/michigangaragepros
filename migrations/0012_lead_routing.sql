-- Lead routing: notify claimed companies when a relevant homeowner lead arrives.
-- companies.notify_email is set on claim approve (durable contact for lead emails).
-- leads.routed_at / routed_to persist who was notified for the admin inbox.

ALTER TABLE companies ADD COLUMN notify_email TEXT;

CREATE INDEX IF NOT EXISTS idx_companies_notify_email
  ON companies(notify_email);

ALTER TABLE leads ADD COLUMN routed_at TEXT;
ALTER TABLE leads ADD COLUMN routed_to TEXT;

CREATE TABLE IF NOT EXISTS lead_routings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  company_id INTEGER,
  company_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  emailed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lead_routings_lead_id ON lead_routings(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_routings_company_slug ON lead_routings(company_slug);

-- Backfill notify_email from the latest approved claim contact for already-claimed companies.
UPDATE companies
SET notify_email = (
  SELECT cr.email
  FROM claim_requests cr
  WHERE cr.company_slug = companies.slug
    AND cr.status = 'approved'
    AND cr.email IS NOT NULL
    AND trim(cr.email) != ''
  ORDER BY datetime(COALESCE(cr.reviewed_at, cr.created_at)) DESC
  LIMIT 1
)
WHERE claimed = 1
  AND (notify_email IS NULL OR trim(notify_email) = '');
