-- Create admin_emails table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin emails
CREATE POLICY "Allow authenticated users to read admin emails"
  ON admin_emails
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow admins to insert admin emails
-- Note: You'll need to manually verify the user is an admin in your app
CREATE POLICY "Allow admins to insert admin emails"
  ON admin_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow admins to delete admin emails
CREATE POLICY "Allow admins to delete admin emails"
  ON admin_emails
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial admin emails
INSERT INTO admin_emails (email, added_by)
VALUES 
  ('anantsinghal444@gmail.com', 'system'),
  ('jonpad512@gmail.com', 'system')
ON CONFLICT (email) DO NOTHING;

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails(email);
