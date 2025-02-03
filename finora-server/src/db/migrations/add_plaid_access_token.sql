-- Add plaid_access_token column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS plaid_access_token VARCHAR(255); 