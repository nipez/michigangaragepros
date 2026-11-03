-- Owner replies on approved company reviews (Google/Yelp-style).
-- Additive: existing rows keep NULL reply fields (no reply yet).
-- Status vocabulary for owner_reply_status:
--   pending  — awaiting operator approval (default after write/edit)
--   visible  — approved; shown under the review on the public profile
--   hidden   — rejected / removed from public view
-- Editing an approved reply resets status to pending.
-- Public surfaces only show replies where owner_reply_status = 'visible'.

ALTER TABLE company_reviews ADD COLUMN owner_reply TEXT;
ALTER TABLE company_reviews ADD COLUMN owner_reply_status TEXT;
ALTER TABLE company_reviews ADD COLUMN owner_reply_at TEXT;
ALTER TABLE company_reviews ADD COLUMN owner_reply_moderated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_company_reviews_reply_status
  ON company_reviews(owner_reply_status);
