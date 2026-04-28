-- Migration: Fix service_id constraint for existing appointments
-- This migration handles the case where appointments exist without a service_id

-- Set default service (Haircut - id=1) for any appointments without a service_id
UPDATE appointments 
SET service_id = 1 
WHERE service_id IS NULL;

-- Make the column NOT NULL if it isn't already
ALTER TABLE appointments 
MODIFY COLUMN service_id BIGINT NOT NULL;
