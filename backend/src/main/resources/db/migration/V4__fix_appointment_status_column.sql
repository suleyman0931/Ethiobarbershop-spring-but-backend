-- Migration: Fix appointment status column size
-- The status enum values are longer than the default VARCHAR size

-- Modify the status column to accommodate longer enum values
ALTER TABLE appointments 
MODIFY COLUMN status VARCHAR(50) NOT NULL;
