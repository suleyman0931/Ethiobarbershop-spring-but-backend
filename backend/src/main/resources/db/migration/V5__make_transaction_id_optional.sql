-- Migration: Make transaction_id optional in payments table
-- Allow customers to submit payment with either transaction ID or screenshot

-- Modify the transaction_id column to be nullable
ALTER TABLE payments 
MODIFY COLUMN transaction_id VARCHAR(255) NULL;
