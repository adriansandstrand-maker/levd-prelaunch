-- Run this in Supabase SQL Editor for project styjrgioxihcilpjffhp
-- Creates the waitlist table for the prelaunch page

CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'direct',
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the signup form)
CREATE POLICY "Allow anonymous inserts" ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous to read count (for social proof)
CREATE POLICY "Allow anonymous count" ON public.waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Index for fast duplicate checks
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist (email);

-- Unique constraint handles duplicate prevention (returns 409)
