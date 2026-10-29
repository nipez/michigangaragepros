-- Shareable review-request links for claimed companies.
-- review_token: unguessable URL secret for /review/<token>/ (customers).
-- Distinct from manage_token (private owner listing edits).
-- Long-lived until regenerated or revoked; abuse controlled by existing
-- review IP rate limits + pending moderation pipeline.

ALTER TABLE companies ADD COLUMN review_token TEXT;
ALTER TABLE companies ADD COLUMN review_token_created_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_review_token
  ON companies(review_token);
