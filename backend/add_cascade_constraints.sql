-- ============================================================================
-- Add CASCADE DELETE Constraints to Barber-Related Tables
-- ============================================================================
-- This script modifies foreign key constraints to automatically delete
-- related records when a barber is deleted.
--
-- IMPORTANT: Run this on your Railway MySQL database
-- ============================================================================

-- Disable foreign key checks temporarily to allow constraint modifications
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 1: Drop existing foreign key constraints
-- ============================================================================

-- Find existing constraint names first (they might be auto-generated)
-- You may need to adjust these names based on your actual database

-- Ratings table
ALTER TABLE ratings DROP FOREIGN KEY IF EXISTS ratings_ibfk_1;
ALTER TABLE ratings DROP FOREIGN KEY IF EXISTS fk_ratings_barber;
ALTER TABLE ratings DROP FOREIGN KEY IF EXISTS FK_ratings_barber_id;

-- Appointments table
ALTER TABLE appointments DROP FOREIGN KEY IF EXISTS appointments_ibfk_1;
ALTER TABLE appointments DROP FOREIGN KEY IF EXISTS fk_appointments_barber;
ALTER TABLE appointments DROP FOREIGN KEY IF EXISTS FK_appointments_barber_id;

-- Shop Applications table
ALTER TABLE shop_applications DROP FOREIGN KEY IF EXISTS shop_applications_ibfk_1;
ALTER TABLE shop_applications DROP FOREIGN KEY IF EXISTS fk_shop_applications_barber;
ALTER TABLE shop_applications DROP FOREIGN KEY IF EXISTS FK_shop_applications_barber_id;

-- Images table
ALTER TABLE images DROP FOREIGN KEY IF EXISTS images_ibfk_1;
ALTER TABLE images DROP FOREIGN KEY IF EXISTS fk_images_barber;
ALTER TABLE images DROP FOREIGN KEY IF EXISTS FK_images_barber_id;

-- Barber Associations table
ALTER TABLE barber_associations DROP FOREIGN KEY IF EXISTS barber_associations_ibfk_1;
ALTER TABLE barber_associations DROP FOREIGN KEY IF EXISTS fk_barber_associations_barber;
ALTER TABLE barber_associations DROP FOREIGN KEY IF EXISTS FK_barber_associations_barber_id;

-- ============================================================================
-- STEP 2: Add new foreign key constraints with CASCADE DELETE
-- ============================================================================

-- Ratings: Delete ratings when barber is deleted
ALTER TABLE ratings 
ADD CONSTRAINT fk_ratings_barber 
FOREIGN KEY (barber_id) 
REFERENCES barber_profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Appointments: Delete appointments when barber is deleted
ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_barber 
FOREIGN KEY (barber_id) 
REFERENCES barber_profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Shop Applications: Delete applications when barber is deleted
ALTER TABLE shop_applications 
ADD CONSTRAINT fk_shop_applications_barber 
FOREIGN KEY (barber_id) 
REFERENCES barber_profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Images: Delete images when barber is deleted
ALTER TABLE images 
ADD CONSTRAINT fk_images_barber 
FOREIGN KEY (barber_id) 
REFERENCES barber_profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Barber Associations: Delete associations when barber is deleted
ALTER TABLE barber_associations 
ADD CONSTRAINT fk_barber_associations_barber 
FOREIGN KEY (barber_id) 
REFERENCES barber_profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- ============================================================================
-- STEP 3: Handle Payments (indirect relationship through appointments)
-- ============================================================================

-- Payments reference appointments, not barbers directly
-- Add CASCADE to payments -> appointments relationship
ALTER TABLE payments DROP FOREIGN KEY IF EXISTS payments_ibfk_1;
ALTER TABLE payments DROP FOREIGN KEY IF EXISTS fk_payments_appointment;
ALTER TABLE payments DROP FOREIGN KEY IF EXISTS FK_payments_appointment_id;

ALTER TABLE payments 
ADD CONSTRAINT fk_payments_appointment 
FOREIGN KEY (appointment_id) 
REFERENCES appointments(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- ============================================================================
-- STEP 4: Re-enable foreign key checks
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- STEP 5: Verify constraints were added
-- ============================================================================

-- Check ratings constraint
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN ('ratings', 'appointments', 'shop_applications', 'images', 'barber_associations', 'payments')
    AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'CASCADE DELETE constraints added successfully!' AS status;
SELECT 'You can now delete barbers and all related records will be automatically deleted.' AS message;

-- ============================================================================
-- TESTING
-- ============================================================================

-- To test, try deleting a barber (replace 999 with an actual test barber ID):
-- DELETE FROM barber_profiles WHERE id = 999;
-- 
-- This should now work without errors and automatically delete:
-- - All ratings for that barber
-- - All appointments for that barber
-- - All payments for those appointments
-- - All shop applications for that barber
-- - All images for that barber
-- - All barber associations for that barber
