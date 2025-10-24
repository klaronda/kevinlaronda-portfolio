-- Complete Database Setup for Kevin Laronda Portfolio
-- Run this in your Supabase SQL Editor to fix all table issues

-- 1. Create projects table with all required columns
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  "badgeType" TEXT DEFAULT 'UX Design',
  "heroImage" TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  situation TEXT DEFAULT '',
  task TEXT DEFAULT '',
  action TEXT DEFAULT '',
  results TEXT DEFAULT '',
  "lessonsLearned" TEXT DEFAULT '',
  metrics JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  url_slug TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create ventures table
CREATE TABLE IF NOT EXISTS ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  url TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create resume table
CREATE TABLE IF NOT EXISTS resume (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  description TEXT DEFAULT '',
  achievements TEXT[] DEFAULT '{}',
  company_logo TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT DEFAULT '',
  emphasis TEXT DEFAULT '',
  institution_logo TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT '',
  title TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  business TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for all tables
-- Projects policies
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);

-- Ventures policies
DROP POLICY IF EXISTS "Allow all operations on ventures" ON ventures;
CREATE POLICY "Allow all operations on ventures" ON ventures FOR ALL USING (true);

-- Resume policies
DROP POLICY IF EXISTS "Allow all operations on resume" ON resume;
CREATE POLICY "Allow all operations on resume" ON resume FOR ALL USING (true);

-- Experience policies
DROP POLICY IF EXISTS "Allow all operations on experience" ON experience;
CREATE POLICY "Allow all operations on experience" ON experience FOR ALL USING (true);

-- Education policies
DROP POLICY IF EXISTS "Allow all operations on education" ON education;
CREATE POLICY "Allow all operations on education" ON education FOR ALL USING (true);

-- Profile policies
DROP POLICY IF EXISTS "Allow all operations on profile" ON profile;
CREATE POLICY "Allow all operations on profile" ON profile FOR ALL USING (true);

-- Contact submissions policies
DROP POLICY IF EXISTS "Allow all operations on contact_submissions" ON contact_submissions;
CREATE POLICY "Allow all operations on contact_submissions" ON contact_submissions FOR ALL USING (true);

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(is_visible);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_badge_type ON projects("badgeType");
CREATE INDEX IF NOT EXISTS idx_projects_url_slug ON projects(url_slug);

CREATE INDEX IF NOT EXISTS idx_ventures_visible ON ventures(is_visible);
CREATE INDEX IF NOT EXISTS idx_ventures_sort_order ON ventures(sort_order);

CREATE INDEX IF NOT EXISTS idx_experience_sort_order ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON education(sort_order);

-- 11. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ventures_updated_at ON ventures;
CREATE TRIGGER update_ventures_updated_at BEFORE UPDATE ON ventures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_updated_at ON resume;
CREATE TRIGGER update_resume_updated_at BEFORE UPDATE ON resume FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experience_updated_at ON experience;
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON education;
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profile_updated_at ON profile;
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();








