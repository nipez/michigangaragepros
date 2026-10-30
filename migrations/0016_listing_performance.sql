-- Privacy-respecting first-party listing performance aggregates.
-- One row per company per UTC day. Counts only — no cookies, IPs, or PII.
-- Writes are best-effort (fail open) from profile/contact beacons, lead
-- routing, and review-request pages.

CREATE TABLE IF NOT EXISTS listing_stats_daily (
  company_slug TEXT NOT NULL,
  day TEXT NOT NULL,
  profile_views INTEGER NOT NULL DEFAULT 0,
  contact_clicks INTEGER NOT NULL DEFAULT 0,
  leads_routed INTEGER NOT NULL DEFAULT 0,
  review_link_visits INTEGER NOT NULL DEFAULT 0,
  review_submissions INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (company_slug, day)
);

CREATE INDEX IF NOT EXISTS idx_listing_stats_daily_day
  ON listing_stats_daily(day);

-- Backfill leads already routed so claimed companies see history immediately.
INSERT INTO listing_stats_daily (company_slug, day, leads_routed)
SELECT
  company_slug,
  substr(created_at, 1, 10) AS day,
  COUNT(*) AS leads_routed
FROM lead_routings
WHERE company_slug IS NOT NULL
  AND trim(company_slug) != ''
  AND created_at IS NOT NULL
GROUP BY company_slug, substr(created_at, 1, 10)
ON CONFLICT(company_slug, day) DO UPDATE SET
  leads_routed = excluded.leads_routed;
