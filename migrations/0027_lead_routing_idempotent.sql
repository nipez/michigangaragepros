-- Idempotent lead→company deliveries: one routing row per lead per company.
-- Safe on remote D1: dedupe existing rows before adding the unique index.

DELETE FROM lead_routings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM lead_routings
  GROUP BY lead_id, company_slug
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_routings_lead_company
  ON lead_routings(lead_id, company_slug);
