-- ============================================
-- Database Cleanup and Seed Script
-- Keeps: 1 Owner, 3 Barbers, 5 Customers, 3 Shops
-- ============================================

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- STEP 1: Clean up all data
-- ============================================

-- Delete all appointments and related data
DELETE FROM payments;
DELETE FROM appointments;

-- Delete all images
DELETE FROM images;

-- Delete all shop-related data
DELETE FROM shop_applications;
DELETE FROM seats;
DELETE FROM shops;

-- Delete all profile data
DELETE FROM barber_profiles;
DELETE FROM customer_profiles;
DELETE FROM owner_profiles;

-- Delete all users except admin
DELETE FROM user_roles WHERE user_id NOT IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username != 'admin';

-- ============================================
-- STEP 2: Create Owner Account
-- ============================================

-- Owner User (password: owner123)
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('owner1', 'owner@barbershop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0911111111', NOW(), NOW());

SET @owner_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@owner_user_id, (SELECT id FROM roles WHERE name = 'ROLE_OWNER'));

INSERT INTO owner_profiles (user_id, business_name, business_license, created_at, updated_at)
VALUES (@owner_user_id, 'Premium Barbershop', 'BL-2024-001', NOW(), NOW());

-- ============================================
-- STEP 3: Create 3 Shops
-- ============================================

INSERT INTO shops (name, address, phone_number, created_at, updated_at)
VALUES 
('Downtown Branch', 'Bole Road, Addis Ababa', '0911222222', NOW(), NOW()),
('Piazza Branch', 'Piazza Area, Addis Ababa', '0911333333', NOW(), NOW()),
('Megenagna Branch', 'Megenagna, Addis Ababa', '0911444444', NOW(), NOW());

SET @shop1_id = (SELECT id FROM shops WHERE name = 'Downtown Branch');
SET @shop2_id = (SELECT id FROM shops WHERE name = 'Piazza Branch');
SET @shop3_id = (SELECT id FROM shops WHERE name = 'Megenagna Branch');

-- Create seats for each shop (2 seats per shop)
INSERT INTO seats (shop_id, seat_number, is_occupied, created_at, updated_at)
VALUES 
(@shop1_id, 1, FALSE, NOW(), NOW()),
(@shop1_id, 2, FALSE, NOW(), NOW()),
(@shop2_id, 1, FALSE, NOW(), NOW()),
(@shop2_id, 2, FALSE, NOW(), NOW()),
(@shop3_id, 1, FALSE, NOW(), NOW()),
(@shop3_id, 2, FALSE, NOW(), NOW());

-- ============================================
-- STEP 4: Create 3 Barber Accounts
-- ============================================

-- Barber 1 (password: barber123) - Downtown Branch
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('barber1', 'barber1@barbershop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0922111111', NOW(), NOW());

SET @barber1_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@barber1_user_id, (SELECT id FROM roles WHERE name = 'ROLE_BARBER'));

INSERT INTO barber_profiles (user_id, first_name, last_name, email, phone_number, skills, summary, years_of_experience, shop_id)
VALUES (@barber1_user_id, 'Ahmed', 'Hassan', 'barber1@barbershop.com', '0922111111', 'Classic Cuts & Beard Styling', 'Expert in traditional and modern haircuts', 5, @shop1_id);

SET @barber1_id = LAST_INSERT_ID();
INSERT INTO barber_associations (shop_id, barber_id, joined_at) VALUES (@shop1_id, @barber1_id, NOW());

-- Barber 2 (password: barber123) - Piazza Branch
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('barber2', 'barber2@barbershop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0922222222', NOW(), NOW());

SET @barber2_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@barber2_user_id, (SELECT id FROM roles WHERE name = 'ROLE_BARBER'));

INSERT INTO barber_profiles (user_id, first_name, last_name, email, phone_number, skills, summary, years_of_experience, shop_id)
VALUES (@barber2_user_id, 'Dawit', 'Tesfaye', 'barber2@barbershop.com', '0922222222', 'Hair Coloring & Styling', 'Specialist in modern styles and hair coloring', 7, @shop2_id);

SET @barber2_id = LAST_INSERT_ID();
INSERT INTO barber_associations (shop_id, barber_id, joined_at) VALUES (@shop2_id, @barber2_id, NOW());

-- Barber 3 (password: barber123) - Megenagna Branch
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('barber3', 'barber3@barbershop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0922333333', NOW(), NOW());

SET @barber3_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@barber3_user_id, (SELECT id FROM roles WHERE name = 'ROLE_BARBER'));

INSERT INTO barber_profiles (user_id, first_name, last_name, email, phone_number, skills, summary, years_of_experience, shop_id)
VALUES (@barber3_user_id, 'Samuel', 'Bekele', 'barber3@barbershop.com', '0922333333', 'Kids Haircuts & Shaving', 'Friendly barber specializing in kids and family cuts', 4, @shop3_id);

SET @barber3_id = LAST_INSERT_ID();
INSERT INTO barber_associations (shop_id, barber_id, joined_at) VALUES (@shop3_id, @barber3_id, NOW());

-- ============================================
-- STEP 5: Create 5 Customer Accounts
-- ============================================

-- Customer 1 (password: customer123)
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('customer1', 'customer1@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0933111111', NOW(), NOW());

SET @customer1_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@customer1_user_id, (SELECT id FROM roles WHERE name = 'ROLE_CUSTOMER'));

INSERT INTO customer_profiles (user_id, full_name, date_of_birth, created_at, updated_at)
VALUES (@customer1_user_id, 'Abebe Kebede', '1990-05-15', NOW(), NOW());

-- Customer 2 (password: customer123)
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('customer2', 'customer2@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0933222222', NOW(), NOW());

SET @customer2_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@customer2_user_id, (SELECT id FROM roles WHERE name = 'ROLE_CUSTOMER'));

INSERT INTO customer_profiles (user_id, full_name, date_of_birth, created_at, updated_at)
VALUES (@customer2_user_id, 'Meron Tadesse', '1995-08-22', NOW(), NOW());

-- Customer 3 (password: customer123)
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('customer3', 'customer3@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0933333333', NOW(), NOW());

SET @customer3_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@customer3_user_id, (SELECT id FROM roles WHERE name = 'ROLE_CUSTOMER'));

INSERT INTO customer_profiles (user_id, full_name, date_of_birth, created_at, updated_at)
VALUES (@customer3_user_id, 'Yohannes Alemu', '1988-12-10', NOW(), NOW());

-- Customer 4 (password: customer123)
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('customer4', 'customer4@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0933444444', NOW(), NOW());

SET @customer4_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@customer4_user_id, (SELECT id FROM roles WHERE name = 'ROLE_CUSTOMER'));

INSERT INTO customer_profiles (user_id, full_name, date_of_birth, created_at, updated_at)
VALUES (@customer4_user_id, 'Hanna Girma', '1992-03-18', NOW(), NOW());

-- Customer 5 (password: customer123)
INSERT INTO users (username, email, password, phone_number, created_at, updated_at) 
VALUES ('customer5', 'customer5@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '0933555555', NOW(), NOW());

SET @customer5_user_id = LAST_INSERT_ID();

INSERT INTO user_roles (user_id, role_id) 
VALUES (@customer5_user_id, (SELECT id FROM roles WHERE name = 'ROLE_CUSTOMER'));

INSERT INTO customer_profiles (user_id, full_name, date_of_birth, created_at, updated_at)
VALUES (@customer5_user_id, 'Tigist Haile', '1993-07-25', NOW(), NOW());

-- ============================================
-- STEP 6: Ensure Services Exist
-- ============================================

-- Check if services exist, if not create them
INSERT IGNORE INTO services (name, description, price, duration_minutes, is_active, created_at, updated_at)
VALUES 
('Haircut', 'Professional haircut with styling', 150.00, 30, TRUE, NOW(), NOW()),
('Haircut + Beard', 'Complete haircut and beard trim', 200.00, 45, TRUE, NOW(), NOW()),
('Beard Trim', 'Professional beard trimming and shaping', 80.00, 20, TRUE, NOW(), NOW()),
('Hair Coloring', 'Professional hair coloring service', 300.00, 90, TRUE, NOW(), NOW()),
('Kids Haircut', 'Special haircut for children', 100.00, 25, TRUE, NOW(), NOW()),
('Shave', 'Traditional hot towel shave', 120.00, 30, TRUE, NOW(), NOW()),
('Hair Treatment', 'Deep conditioning hair treatment', 250.00, 60, TRUE, NOW(), NOW());

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verification Queries
-- ============================================

SELECT 'Database cleanup and seeding completed!' AS Status;

SELECT 'USERS SUMMARY' AS Info;
SELECT 
    r.name AS Role,
    COUNT(u.id) AS Count
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
GROUP BY r.name;

SELECT 'SHOPS SUMMARY' AS Info;
SELECT name, address, phone_number FROM shops;

SELECT 'BARBERS SUMMARY' AS Info;
SELECT 
    u.username,
    CONCAT(bp.first_name, ' ', bp.last_name) AS full_name,
    s.name AS shop_name
FROM users u
JOIN barber_profiles bp ON u.id = bp.user_id
JOIN shops s ON bp.shop_id = s.id;

SELECT 'CUSTOMERS SUMMARY' AS Info;
SELECT 
    u.username,
    cp.full_name,
    u.email
FROM users u
JOIN customer_profiles cp ON u.id = cp.user_id;
