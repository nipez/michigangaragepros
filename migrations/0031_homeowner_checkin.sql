-- Homeowner lead follow-up check-in (~2–3 days after submit).
-- Tracks one outbound email + response (yes / not_yet), helped company,
-- and email opt-out. Signed links are HMAC (no token column required).

ALTER TABLE leads ADD COLUMN checkin_sent_at TEXT;
ALTER TABLE leads ADD COLUMN checkin_response TEXT;
ALTER TABLE leads ADD COLUMN checkin_responded_at TEXT;
ALTER TABLE leads ADD COLUMN checkin_helped_company_slug TEXT;
ALTER TABLE leads ADD COLUMN checkin_opt_out INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_leads_checkin_sent
  ON leads(checkin_sent_at);

CREATE INDEX IF NOT EXISTS idx_leads_checkin_response
  ON leads(checkin_response);

CREATE INDEX IF NOT EXISTS idx_leads_checkin_opt_out
  ON leads(checkin_opt_out);

-- Grandfather existing leads so the first cron never emails historical
-- requests ("You recently requested…"). Uses checkin_response = 'skipped'
-- (not checkin_sent_at / checkin_opt_out) so admin funnel counts stay clean
-- and the inbox does not show a "sent" or "opted out" pill.
UPDATE leads
SET checkin_response = 'skipped',
    checkin_responded_at = datetime('now')
WHERE checkin_sent_at IS NULL
  AND checkin_response IS NULL;
