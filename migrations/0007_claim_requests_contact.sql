-- Claim requests need a reachable contact so we can verify ownership.
ALTER TABLE claim_requests ADD COLUMN contact_name TEXT;
ALTER TABLE claim_requests ADD COLUMN email TEXT;
ALTER TABLE claim_requests ADD COLUMN phone TEXT;
ALTER TABLE claim_requests ADD COLUMN website TEXT;
ALTER TABLE claim_requests ADD COLUMN company_slug TEXT;
ALTER TABLE claim_requests ADD COLUMN notes TEXT;

CREATE INDEX IF NOT EXISTS idx_claim_requests_email ON claim_requests(email);
CREATE INDEX IF NOT EXISTS idx_claim_requests_created_at ON claim_requests(created_at);
