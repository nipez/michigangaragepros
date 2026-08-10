-- Faster claim lookups + review timestamp for verification workflow.
CREATE INDEX IF NOT EXISTS idx_claim_requests_company_slug
  ON claim_requests(company_slug);

CREATE INDEX IF NOT EXISTS idx_claim_requests_slug_status
  ON claim_requests(company_slug, status);

ALTER TABLE claim_requests ADD COLUMN reviewed_at TEXT;
ALTER TABLE claim_requests ADD COLUMN review_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_companies_claimed ON companies(claimed);
