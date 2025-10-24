-- Resume Database Schema
-- Run this in your Supabase SQL Editor

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  start_month INTEGER NOT NULL,
  start_year INTEGER NOT NULL,
  end_month INTEGER,
  end_year INTEGER,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  achievements JSONB NOT NULL DEFAULT '[]',
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  year INTEGER NOT NULL,
  emphasis TEXT,
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile Table (for Kevin's photo and bio)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Kevin Laronda',
  title TEXT NOT NULL DEFAULT 'UX Design Strategist',
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on experience" ON experience
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on education" ON education
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on profile" ON profile
FOR ALL USING (true) WITH CHECK (true);

-- Insert default profile
INSERT INTO profile (name, title, bio, photo_url) VALUES
  ('Kevin Laronda', 'UX Design Strategist', 'Experienced UX designer and design strategist with a passion for creating user-centered solutions that drive business results.', '')
ON CONFLICT DO NOTHING;
