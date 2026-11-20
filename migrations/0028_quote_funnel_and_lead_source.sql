-- Quote funnel counters (privacy-light, no PII) + optional lead source attribution.
-- source_page on leads records which page type started the request (city, company, etc.).
-- quote_funnel_daily aggregates views / starts / submits per UTC day per source.

ALTER TABLE leads ADD COLUMN source_page TEXT;

CREATE TABLE IF NOT EXISTS quote_funnel_daily (
  day TEXT NOT NULL,
  source_page TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  starts INTEGER NOT NULL DEFAULT 0,
  submits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, source_page)
);

CREATE INDEX IF NOT EXISTS idx_quote_funnel_daily_day
  ON quote_funnel_daily(day);
