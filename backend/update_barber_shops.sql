-- Update existing barbers to have their shop_id set based on their associations
-- This fixes the issue where barbers were created without shop references

UPDATE barber_profiles bp
JOIN barber_associations ba ON bp.id = ba.barber_id
SET bp.shop_id = ba.shop_id
WHERE bp.shop_id IS NULL;

-- Verify the update
SELECT 
    bp.id,
    bp.first_name,
    bp.last_name,
    bp.shop_id,
    s.name AS shop_name
FROM barber_profiles bp
LEFT JOIN shops s ON bp.shop_id = s.id;
