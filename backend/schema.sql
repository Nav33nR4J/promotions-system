-- Create promotions database
CREATE DATABASE IF NOT EXISTS promotions_db;
USE promotions_db;

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('PERCENTAGE', 'FIXED', 'CUSTOM') NOT NULL,
    value DECIMAL(10, 2) DEFAULT 0,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    usage_limit INT DEFAULT NULL,
    usage_count INT DEFAULT 0,
    custom_items JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO promotions (promo_code, title, type, value, start_at, end_at, status, usage_limit) VALUES
('WELCOME10', 'Welcome Discount', 'PERCENTAGE', 10.00, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 'ACTIVE', 100),
('FLAT50', 'Flat $50 Off', 'FIXED', 50.00, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 'ACTIVE', 50);

