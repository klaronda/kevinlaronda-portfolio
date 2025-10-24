-- Resume Database Setup - Safe to run multiple times
-- Run this in your Supabase SQL Editor

-- Drop tables if they exist (to start fresh)
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- Experience Table
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  start_month INTEGER NOT NULL DEFAULT 1,
  start_year INTEGER NOT NULL DEFAULT 2024,
  end_month INTEGER,
  end_year INTEGER,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL DEFAULT '',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Table
CREATE TABLE education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  year INTEGER NOT NULL DEFAULT 2024,
  emphasis TEXT,
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile Table (for Kevin's photo and bio)
CREATE TABLE profile (
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
