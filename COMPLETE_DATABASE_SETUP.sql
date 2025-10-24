-- Complete Database Setup for Kevin Laronda Portfolio
-- Copy and paste this ENTIRE file into your Supabase SQL Editor, then click "Run"

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  badge_type TEXT NOT NULL DEFAULT 'UX Design',
  hero_image TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  situation TEXT NOT NULL DEFAULT '',
  task TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL DEFAULT '',
  results TEXT NOT NULL DEFAULT '',
  lessons_learned TEXT NOT NULL DEFAULT '',
  metrics JSONB NOT NULL DEFAULT '[]',
  images JSONB NOT NULL DEFAULT '[]',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  url_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ventures Table
CREATE TABLE IF NOT EXISTS ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  url_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Table
CREATE TABLE IF NOT EXISTS resume (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  url_slug TEXT NOT NULL DEFAULT 'resume',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page URLs Table
CREATE TABLE IF NOT EXISTS page_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  url_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_urls ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables
CREATE POLICY "Allow all operations on projects" ON projects
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on ventures" ON ventures
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on resume" ON resume
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on page_urls" ON page_urls
FOR ALL USING (true) WITH CHECK (true);

-- Insert default page URLs
INSERT INTO page_urls (page_name, url_slug) VALUES
  ('Home', ''),
  ('Resume', 'resume'),
  ('Design Work', 'design-work'),
  ('Ventures', 'ventures')
ON CONFLICT (page_name) DO NOTHING;

-- Done! All tables are now created and ready to use.
