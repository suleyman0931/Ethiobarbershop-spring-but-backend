-- Migration: Add services and payments tables
-- Feature: Payment and service selection for appointments

-- Create services table
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create payments table
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    screenshot_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    verified_by_owner_id BIGINT,
    CONSTRAINT fk_payments_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Insert sample services FIRST (before adding service_id column)
INSERT INTO services (name, description, price, duration_minutes, active) VALUES
('Haircut', 'Standard men''s haircut with styling', 150.00, 30, true),
('Haircut + Beard Trim', 'Complete haircut with professional beard styling', 200.00, 45, true),
('Beard Trim Only', 'Professional beard shaping and trimming', 80.00, 20, true),
('Hair Coloring', 'Professional hair coloring service', 300.00, 60, true),
('Kids Haircut', 'Haircut for children under 12 years', 100.00, 25, true),
('Shave', 'Traditional straight razor shave', 120.00, 30, true),
('Hair Treatment', 'Deep conditioning and hair treatment', 250.00, 45, true);

-- Add service_id column to appointments table (nullable initially)
ALTER TABLE appointments 
ADD COLUMN service_id BIGINT;

-- Set default service (Haircut - id=1) for existing appointments
UPDATE appointments 
SET service_id = 1 
WHERE service_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE appointments 
MODIFY COLUMN service_id BIGINT NOT NULL;

-- Add foreign key constraint
ALTER TABLE appointments
ADD CONSTRAINT fk_appointments_service FOREIGN KEY (service_id) REFERENCES services(id);

-- Create indexes for better performance
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_services_active ON services(active);
