-- Close the loop from won leads → review requests.
-- Owner-triggered only (manage-token POST); never automatic.
-- review_requested_at: idempotent "already sent" marker on the routing row.
-- company_reviews.lead_routing_id: optional attribution when the homeowner
-- submits via the emailed link (?lead=<routingId>); still moderated as usual.

ALTER TABLE lead_routings ADD COLUMN review_requested_at TEXT;

ALTER TABLE company_reviews ADD COLUMN lead_routing_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_lead_routings_review_requested
  ON lead_routings(company_slug, review_requested_at);

CREATE INDEX IF NOT EXISTS idx_company_reviews_lead_routing
  ON company_reviews(lead_routing_id);
