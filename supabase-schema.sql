-- Supabase Database Schema for Kevin Laronda Portfolio
-- Run these commands in your Supabase SQL Editor

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  summary TEXT NOT NULL,
  situation TEXT NOT NULL,
  task TEXT NOT NULL,
  action TEXT NOT NULL,
  results TEXT NOT NULL,
  lessons_learned TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '[]',
  images JSONB NOT NULL DEFAULT '[]',
  -- New fields for content management
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  url_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ventures Table
CREATE TABLE IF NOT EXISTS ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  -- New fields for content management
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

-- Page URLs Table for managing site navigation
CREATE TABLE IF NOT EXISTS page_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  url_slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for ventures
CREATE POLICY "Enable read access for all users" ON ventures
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON ventures
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON ventures
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON ventures
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for resume
CREATE POLICY "Enable read access for all users" ON resume
  FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" ON resume
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO projects (title, badge_type, hero_image, summary, situation, task, action, results, lessons_learned, metrics, images, is_visible, sort_order, url_slug)
VALUES (
  'FinTech Platform Redesign',
  'UX Design',
  'https://images.unsplash.com/photo-1698434156098-68e834638679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVWCUyMGRlc2lnbiUyMHdpcmVmcmFtZSUyMG1vY2t1cHxlbnwxfHx8fDE3NTk3NjU2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Complete platform redesign increasing user engagement by 40%',
  'A leading fintech company was experiencing declining user engagement and high abandonment rates on their core banking platform. Users found the interface confusing and struggled to complete basic financial tasks.',
  'Redesign the entire platform experience to improve usability, reduce task completion time, and increase user satisfaction while maintaining regulatory compliance.',
  'Conducted extensive user research including interviews, usability testing, and analytics analysis. Created detailed user journeys and wireframes. Implemented a design system and conducted iterative testing throughout the design process.',
  'The redesigned platform delivered significant improvements across all key metrics, demonstrating the impact of user-centered design on business outcomes.',
  'The importance of balancing regulatory requirements with user experience. Small iterative changes often have more impact than large redesigns.',
  '[
    {"value": "40%", "title": "User Engagement", "description": "Increase in daily active users and session duration"},
    {"value": "60%", "title": "Support Reduction", "description": "Fewer support tickets due to improved usability"},
    {"value": "25%", "title": "Task Speed", "description": "Faster completion times for core banking tasks"},
    {"value": "95%", "title": "Satisfaction", "description": "User satisfaction score in post-launch surveys"},
    {"value": "$2.1M", "title": "Cost Savings", "description": "Annual savings from reduced support overhead"},
    {"value": "89%", "title": "Task Success", "description": "First-time task completion rate improvement"}
  ]',
  '["https://images.unsplash.com/photo-1698434156098-68e834638679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVWCUyMGRlc2lnbiUyMHdpcmVmcmFtZSUyMG1vY2t1cHxlbnwxfHx8fDE3NTk3NjU2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"]',
  true,
  1,
  'fintech-platform-redesign'
) ON CONFLICT DO NOTHING;

INSERT INTO ventures (title, description, image, url, status, is_visible, sort_order, url_slug)
VALUES (
  'UX Design Studio',
  'Independent design consultancy specializing in user experience and product strategy for startups and enterprise clients.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVWCUyMGRlc2lnbiUyMHN0dWRpb3xlbnwxfHx8fDE3NTk2ODU3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://uxdesignstudio.com',
  'active',
  true,
  1,
  'ux-design-studio'
) ON CONFLICT DO NOTHING;

INSERT INTO resume (experience, skills, education, url_slug)
VALUES (
  '[
    {
      "company": "Senior UX Designer",
      "position": "TechCorp",
      "duration": "2020 - Present",
      "description": ["Led design system implementation", "Improved user engagement by 40%", "Managed cross-functional teams"]
    },
    {
      "company": "UX Designer",
      "position": "StartupXYZ",
      "duration": "2018 - 2020", 
      "description": ["Designed mobile-first experiences", "Conducted user research", "Collaborated with product teams"]
    }
  ]',
  '["User Experience Design", "User Research", "Prototyping", "Design Systems", "Figma", "Sketch", "Adobe Creative Suite"]',
  '[
    {
      "institution": "Design Institute",
      "degree": "Bachelor of Design",
      "year": "2016"
    }
  ]',
  'resume'
) ON CONFLICT DO NOTHING;

-- Insert page URLs
INSERT INTO page_urls (page_name, url_slug, is_active)
VALUES 
  ('Home', 'home', true),
  ('Resume', 'resume', true),
  ('Design Work', 'design-work', true),
  ('Ventures', 'ventures', true),
  ('About', 'about', true)
ON CONFLICT DO NOTHING;
