-- Company logo + optional profile/hero photo stored in R2.
-- Keys are R2 object paths (e.g. companies/{slug}/logo-{id}.webp).
-- Applied live for claimed companies (no listing_edit_requests queue).
ALTER TABLE companies ADD COLUMN logo_key TEXT;
ALTER TABLE companies ADD COLUMN photo_key TEXT;
