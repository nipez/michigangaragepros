-- Stripe Checkout for Featured Pro subscriptions.
-- Extends featured_requests with payment identifiers + idempotent webhook log.

ALTER TABLE featured_requests ADD COLUMN stripe_session_id TEXT;
ALTER TABLE featured_requests ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE featured_requests ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE featured_requests ADD COLUMN paid_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_featured_requests_stripe_session
  ON featured_requests(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_featured_requests_stripe_subscription
  ON featured_requests(stripe_subscription_id);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
