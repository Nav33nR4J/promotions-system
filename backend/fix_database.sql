-- Fix for "Data truncated for column 'type'" error
-- The 'type' column in 'promotions' table is too small to store 'CUSTOM'
-- Run this SQL command in your MySQL database

-- First, check the current column definition:
-- DESCRIBE promotions;

-- Alter the table to increase the type column size to accommodate 'CUSTOM':
ALTER TABLE promotions MODIFY COLUMN type VARCHAR(20) NOT NULL;

-- Verify the change:
-- DESCRIBE promotions;

