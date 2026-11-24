-- Unanswered lead fallback: track admin attention when no eligible pro remains,
-- and one-time reminder nudges to unresponsive original recipients.
-- Fallback deliveries reuse lead_routings.reason = 'fallback' (no new column).

ALTER TABLE leads ADD COLUMN needs_admin_attention INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN fallback_exhausted_at TEXT;

ALTER TABLE lead_routings ADD COLUMN nudge_sent_at TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_needs_admin_attention
  ON leads(needs_admin_attention);

CREATE INDEX IF NOT EXISTS idx_lead_routings_nudge_sent
  ON lead_routings(nudge_sent_at);
