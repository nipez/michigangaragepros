-- Company-scoped Stripe billing identifiers for Customer Portal + subscription sync.
-- featured_requests already has customer/subscription ids (0011); companies need them
-- for manage-page portal sessions, and both need subscription_status for cancel/lapse.

ALTER TABLE companies ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE companies ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE companies ADD COLUMN stripe_subscription_status TEXT;

CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer
  ON companies(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription
  ON companies(stripe_subscription_id);

ALTER TABLE featured_requests ADD COLUMN stripe_subscription_status TEXT;

-- Rate-limit / audit for manage-page Billing Portal session creation.
CREATE TABLE IF NOT EXISTS billing_portal_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_slug TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_billing_portal_slug_created
  ON billing_portal_attempts(company_slug, created_at);

CREATE INDEX IF NOT EXISTS idx_billing_portal_ip_created
  ON billing_portal_attempts(ip_hash, created_at);
