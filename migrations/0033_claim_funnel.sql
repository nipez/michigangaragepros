-- Claim acquisition funnel counters (privacy-light, no PII).
-- Tracks for-companies page views → company searches → claim starts → submits.

CREATE TABLE IF NOT EXISTS claim_funnel_daily (
  day TEXT NOT NULL PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0,
  searches INTEGER NOT NULL DEFAULT 0,
  starts INTEGER NOT NULL DEFAULT 0,
  submits INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_claim_funnel_daily_day
  ON claim_funnel_daily(day);
