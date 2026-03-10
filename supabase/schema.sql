-- ============================================================
-- Supabase Database Schema for AI CV Builder
-- Run this SQL in Supabase SQL Editor to set up your database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CVs Table
CREATE TABLE IF NOT EXISTS cvs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL DEFAULT '{}',
  generated_cv JSONB NOT NULL DEFAULT '{}',
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON cvs(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own CVs
CREATE POLICY "Users can view own CVs"
  ON cvs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own CVs
CREATE POLICY "Users can create own CVs"
  ON cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own CVs
CREATE POLICY "Users can update own CVs"
  ON cvs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own CVs
CREATE POLICY "Users can delete own CVs"
  ON cvs FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cvs_updated_at
  BEFORE UPDATE ON cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
