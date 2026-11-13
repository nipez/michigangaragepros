-- Track Stripe event timestamps for subscription status sync so out-of-order
-- webhooks (retries / delayed delivery) do not overwrite a newer status.

ALTER TABLE companies ADD COLUMN stripe_subscription_event_at INTEGER;
ALTER TABLE featured_requests ADD COLUMN stripe_subscription_event_at INTEGER;
