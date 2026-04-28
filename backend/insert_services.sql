-- Insert services into the database
-- Run this script in your MySQL database if services are missing

INSERT INTO services (name, description, price, duration_minutes, active) VALUES
('Haircut', 'Standard men''s haircut with styling', 150.00, 30, true),
('Haircut + Beard Trim', 'Complete haircut with professional beard styling', 200.00, 45, true),
('Beard Trim Only', 'Professional beard shaping and trimming', 80.00, 20, true),
('Hair Coloring', 'Professional hair coloring service', 300.00, 60, true),
('Kids Haircut', 'Haircut for children under 12 years', 100.00, 25, true),
('Shave', 'Traditional straight razor shave', 120.00, 30, true),
('Hair Treatment', 'Deep conditioning and hair treatment', 250.00, 45, true);

-- Verify the insert
SELECT * FROM services;
