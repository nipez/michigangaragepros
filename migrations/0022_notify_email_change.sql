-- Rate-limit / audit log for self-serve notification email changes.
-- Only the manage-token holder can change companies.notify_email; this table
-- records attempts so per-company and per-IP limits can block abuse.
CREATE TABLE IF NOT EXISTS notify_email_change_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_slug TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  previous_email_hash TEXT,
  new_email_hash TEXT NOT NULL,
  changed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notify_email_change_slug_created
  ON notify_email_change_attempts(company_slug, created_at);

CREATE INDEX IF NOT EXISTS idx_notify_email_change_ip_created
  ON notify_email_change_attempts(ip_hash, created_at);
