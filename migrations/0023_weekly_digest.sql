-- Weekly performance email digest for claimed companies.
-- Opt-out is self-serve via /manage/<token>/ (and unsubscribe links in digests).
-- weekly_digest_sends records one row per company per week_start so cron
-- re-runs never double-send the same digest.

ALTER TABLE companies ADD COLUMN weekly_digest_opt_out INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS weekly_digest_sends (
  company_slug TEXT NOT NULL,
  -- Monday (UTC YYYY-MM-DD) of the week the digest summarizes / was keyed by.
  week_start TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- 1 when Resend accepted the send; 0 when skipped/failed after claiming the slot.
  emailed INTEGER NOT NULL DEFAULT 0,
  notify_email TEXT,
  profile_views INTEGER NOT NULL DEFAULT 0,
  contact_clicks INTEGER NOT NULL DEFAULT 0,
  leads_count INTEGER NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (company_slug, week_start)
);

CREATE INDEX IF NOT EXISTS idx_weekly_digest_sends_sent_at
  ON weekly_digest_sends(sent_at);
