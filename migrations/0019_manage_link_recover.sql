-- Rate-limit / audit log for self-serve manage-link recovery.
-- Owners recover an existing manage_token by email; this table only
-- records attempts so IP + email limits can block spam/scrape abuse.
CREATE TABLE IF NOT EXISTS manage_link_recover_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_hash TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  matched INTEGER NOT NULL DEFAULT 0,
  company_slug TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_manage_recover_ip_created
  ON manage_link_recover_attempts(ip_hash, created_at);

CREATE INDEX IF NOT EXISTS idx_manage_recover_email_created
  ON manage_link_recover_attempts(email_hash, created_at);
