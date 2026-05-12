-- ============================================================================
-- FINAL COMPLETE CASCADE FIX - Run this on Railway MySQL
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. RATINGS table
ALTER TABLE ratings DROP FOREIGN KEY FK63yjmdmwtuduvt8rgpgtnbms9;
ALTER TABLE ratings ADD CONSTRAINT FK63yjmdmwtuduvt8rgpgtnbms9 
FOREIGN KEY (barber_id) REFERENCES barber_profiles(id) ON DELETE CASCADE;

ALTER TABLE ratings DROP FOREIGN KEY FK2y1t7p77ym3en66xplb7oo98f;
ALTER TABLE ratings ADD CONSTRAINT FK2y1t7p77ym3en66xplb7oo98f 
FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE;

-- 2. PAYMENTS table
ALTER TABLE payments DROP FOREIGN KEY FK9a0odew03qao7nlbdsesrux5u;
ALTER TABLE payments ADD CONSTRAINT FK9a0odew03qao7nlbdsesrux5u 
FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE;

-- 3. APPOINTMENTS table
ALTER TABLE appointments DROP FOREIGN KEY FK57st82yax4brvsr0h4rpxa91r;
ALTER TABLE appointments ADD CONSTRAINT FK57st82yax4brvsr0h4rpxa91r 
FOREIGN KEY (barber_id) REFERENCES barber_profiles(id) ON DELETE CASCADE;

-- 4. IMAGES table
ALTER TABLE images DROP FOREIGN KEY FKtmysnfhl5fcxhurpvbnn6a3hl;
ALTER TABLE images ADD CONSTRAINT FKtmysnfhl5fcxhurpvbnn6a3hl 
FOREIGN KEY (barber_id) REFERENCES barber_profiles(id) ON DELETE CASCADE;

-- 5. BARBER_ASSOCIATIONS table
ALTER TABLE barber_associations DROP FOREIGN KEY FKqy480xqhdpflk189mq3l9ybrs;
ALTER TABLE barber_associations ADD CONSTRAINT FKqy480xqhdpflk189mq3l9ybrs 
FOREIGN KEY (barber_id) REFERENCES barber_profiles(id) ON DELETE CASCADE;

-- 6. SHOP_APPLICATION table (singular!)
ALTER TABLE shop_application DROP FOREIGN KEY FK5prnalnaqn9o8apv8rkdefbda;
ALTER TABLE shop_application ADD CONSTRAINT FK5prnalnaqn9o8apv8rkdefbda 
FOREIGN KEY (barber_id) REFERENCES barber_profiles(id) ON DELETE CASCADE;

-- 7. SEATS table (SET NULL when association is deleted)
ALTER TABLE seats DROP FOREIGN KEY FKnfk61p04h22doigqlowi6b59s;
ALTER TABLE seats ADD CONSTRAINT FKnfk61p04h22doigqlowi6b59s 
FOREIGN KEY (association_id) REFERENCES barber_associations(id) ON DELETE SET NULL;

SET FOREIGN_KEY_CHECKS = 1;

-- Verify all constraints
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    DELETE_RULE
FROM information_schema.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME IN ('ratings', 'appointments', 'images', 'barber_associations', 'shop_application', 'payments', 'seats')
ORDER BY TABLE_NAME;

SELECT 'ALL CASCADE CONSTRAINTS FIXED!' AS status;
