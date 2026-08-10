-- Lead notification tracking for admin email delivery
ALTER TABLE leads ADD COLUMN notified_at TEXT;
ALTER TABLE leads ADD COLUMN notify_status TEXT;
ALTER TABLE leads ADD COLUMN notify_error TEXT;
ALTER TABLE leads ADD COLUMN matched_company_name TEXT;
