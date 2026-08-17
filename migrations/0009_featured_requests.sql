-- Featured placement interest / sales pipeline (pre-Stripe checkout).
CREATE TABLE IF NOT EXISTS featured_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  city TEXT NOT NULL,
  plan TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_slug TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_featured_requests_created_at
  ON featured_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_featured_requests_status
  ON featured_requests(status);
CREATE INDEX IF NOT EXISTS idx_featured_requests_plan
  ON featured_requests(plan);
