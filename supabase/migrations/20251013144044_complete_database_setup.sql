-- Complete database setup with email trigger
-- This migration creates all tables and sets up email notifications

-- Projects Table
CREATE TABLE IF NOT EXISTS "projects" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "badgeType" TEXT NOT NULL DEFAULT 'UX Design',
  "summary" TEXT NOT NULL DEFAULT '',
  "heroImage" TEXT NOT NULL DEFAULT '',
  "isVisible" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "urlSlug" TEXT NOT NULL DEFAULT '',
  "problem" TEXT NOT NULL DEFAULT '',
  "objective" TEXT NOT NULL DEFAULT '',
  "actions" TEXT NOT NULL DEFAULT '',
  "results" TEXT NOT NULL DEFAULT '',
  "lessons" TEXT NOT NULL DEFAULT '',
  "metrics" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ventures Table
CREATE TABLE IF NOT EXISTS "ventures" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "description" TEXT NOT NULL DEFAULT '',
  "image" TEXT NOT NULL DEFAULT '',
  "url" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Active',
  "isVisible" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "urlSlug" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Table
CREATE TABLE IF NOT EXISTS "resume" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "experience" JSONB NOT NULL DEFAULT '[]',
  "skills" JSONB NOT NULL DEFAULT '[]',
  "education" JSONB NOT NULL DEFAULT '[]',
  "urlSlug" TEXT NOT NULL DEFAULT 'resume',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Table
CREATE TABLE IF NOT EXISTS "experience" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "company" TEXT NOT NULL DEFAULT '',
  "location" TEXT NOT NULL DEFAULT '',
  "start_month" INTEGER NOT NULL,
  "start_year" INTEGER NOT NULL,
  "end_month" INTEGER,
  "end_year" INTEGER,
  "is_current" BOOLEAN NOT NULL DEFAULT FALSE,
  "description" TEXT NOT NULL DEFAULT '',
  "achievements" TEXT[] NOT NULL DEFAULT '{}',
  "logo_url" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Table
CREATE TABLE IF NOT EXISTS "education" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "institution" TEXT NOT NULL DEFAULT '',
  "year" INTEGER NOT NULL,
  "emphasis" TEXT,
  "logo_url" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile Table
CREATE TABLE IF NOT EXISTS "profile" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "title" TEXT NOT NULL DEFAULT '',
  "bio" TEXT,
  "photo_url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "business" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page URLs Table
CREATE TABLE IF NOT EXISTS "page_urls" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "page_name" TEXT NOT NULL UNIQUE,
  "url_slug" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ventures" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resume" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "education" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "page_urls" ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables
CREATE POLICY "Allow all operations on projects" ON "projects"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on ventures" ON "ventures"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on resume" ON "resume"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on experience" ON "experience"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on education" ON "education"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on profile" ON "profile"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on contact_submissions" ON "contact_submissions"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on page_urls" ON "page_urls"
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON "projects"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventures_updated_at
  BEFORE UPDATE ON "ventures"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_updated_at
  BEFORE UPDATE ON "resume"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON "contact_submissions"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_urls_updated_at
  BEFORE UPDATE ON "page_urls"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to call the edge function for email notifications
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://ncefkmwkjyidchoprhth.supabase.co/functions/v1/send-contact-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZWZrbXdranlpZGNob3ByaHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMTc1NzAsImV4cCI6MjA3NTU5MzU3MH0._NQFnUF7GBE-nKHZUdhdv5CD1VtvH08thUnkZt7NNrY"}'::jsonb,
      body := json_build_object(
        'contactData', row_to_json(NEW)
      )::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email notifications
CREATE TRIGGER contact_submission_trigger
  AFTER INSERT ON "contact_submissions"
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_contact_submissions_email" ON "contact_submissions" ("email");
CREATE INDEX IF NOT EXISTS "idx_contact_submissions_created_at" ON "contact_submissions" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_projects_visible" ON "projects" ("isVisible");
CREATE INDEX IF NOT EXISTS "idx_ventures_visible" ON "ventures" ("isVisible");

-- Insert default page URLs
INSERT INTO "page_urls" ("page_name", "url_slug") VALUES
  ('Home', ''),
  ('UX Design', 'ux-design'),
  ('UX Strategy', 'ux-strategy'),
  ('Ventures', 'ventures'),
  ('Resume', 'resume')
ON CONFLICT ("page_name") DO NOTHING;

-- Insert default profile
INSERT INTO "profile" ("name", "title", "bio") VALUES
  ('Kevin Laronda', 'UX Design Strategist', 'Passionate about creating exceptional user experiences that drive business growth.')
ON CONFLICT ("id") DO NOTHING;














