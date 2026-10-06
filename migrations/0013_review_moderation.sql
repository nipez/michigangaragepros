-- Review moderation for the admin inbox.
-- Status vocabulary:
--   pending  — awaiting operator approval (new default for submissions)
--   visible  — approved; shown on public profiles and in rating aggregates
--   hidden   — rejected / removed from public view
--   spam     — flagged as spam; not public
--
-- Existing already-visible reviews are left as status = 'visible' so they
-- stay public. No backfill UPDATE is required.
-- moderated_at is set when an operator approves, hides, or marks spam.

ALTER TABLE company_reviews ADD COLUMN moderated_at TEXT;
