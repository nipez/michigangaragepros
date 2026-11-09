-- Self-reported trust credentials for claimed companies.
-- Applied live from /manage/<token>/ (no listing_edit_requests queue).
-- Public UI must label these as self-reported — no verification claim.
ALTER TABLE companies ADD COLUMN trust_licensed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE companies ADD COLUMN trust_license_number TEXT;
ALTER TABLE companies ADD COLUMN trust_insured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE companies ADD COLUMN trust_bonded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE companies ADD COLUMN trust_family_owned INTEGER NOT NULL DEFAULT 0;
ALTER TABLE companies ADD COLUMN trust_years_in_business INTEGER;
ALTER TABLE companies ADD COLUMN trust_updated_at TEXT;
