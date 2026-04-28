-- Migration: Create ratings table
-- Feature: appointment-management-rating
-- Requirements: 4.1, 5.1, 5.2

CREATE TABLE ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating_score INT NOT NULL CHECK (rating_score >= 1 AND rating_score <= 5),
    review_text VARCHAR(500),
    created_at TIMESTAMP NOT NULL,
    customer_id BIGINT NOT NULL,
    barber_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,
    CONSTRAINT unique_customer_appointment UNIQUE (customer_id, appointment_id),
    CONSTRAINT fk_ratings_customer FOREIGN KEY (customer_id) REFERENCES customer_profiles(id),
    CONSTRAINT fk_ratings_barber FOREIGN KEY (barber_id) REFERENCES barber_profiles(id),
    CONSTRAINT fk_ratings_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Index for efficient barber rating queries
CREATE INDEX idx_ratings_barber ON ratings(barber_id);

-- Index for efficient timestamp ordering
CREATE INDEX idx_ratings_created_at ON ratings(created_at DESC);
