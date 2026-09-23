-- Homeowner reviews for company profiles.
-- companies.rating / companies.reviews remain seed placeholders and must NOT
-- be used for display — averages and counts come from this table only.
CREATE TABLE IF NOT EXISTS company_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  contact TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  -- visible by default after basic anti-spam (honeypot + IP rate limit).
  -- Use 'hidden' for future moderation without a pending queue.
  status TEXT NOT NULL DEFAULT 'visible',
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_company_reviews_slug_status
  ON company_reviews(company_slug, status);
CREATE INDEX IF NOT EXISTS idx_company_reviews_created_at
  ON company_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_company_reviews_ip_created
  ON company_reviews(ip_hash, created_at);
