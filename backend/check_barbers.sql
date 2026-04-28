-- Check if barbers exist in the database
SELECT 'Checking barber_profiles table...' AS Info;

SELECT 
    bp.id,
    bp.user_id,
    bp.first_name,
    bp.last_name,
    bp.email,
    bp.phone_number,
    bp.shop_id,
    s.name AS shop_name
FROM barber_profiles bp
LEFT JOIN shops s ON bp.shop_id = s.id;

SELECT 'Checking users with BARBER role...' AS Info;

SELECT 
    u.id,
    u.username,
    u.email,
    r.name AS role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ROLE_BARBER';

SELECT 'Checking barber_associations...' AS Info;

SELECT 
    ba.id,
    ba.barber_id,
    ba.shop_id,
    b.first_name,
    b.last_name,
    s.name AS shop_name
FROM barber_associations ba
JOIN barber_profiles b ON ba.barber_id = b.id
JOIN shops s ON ba.shop_id = s.id;
