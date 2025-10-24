-- Fix Database Schema for Projects Table
-- Run this in your Supabase SQL Editor

-- First, let's check what columns exist and add missing ones
-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS "badgeType" TEXT DEFAULT 'UX Design',
ADD COLUMN IF NOT EXISTS "heroImage" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "summary" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "situation" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "task" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "action" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "results" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "lessonsLearned" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "metrics" JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "is_visible" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "sort_order" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "url_slug" TEXT DEFAULT '';

-- Update existing records to have default values
UPDATE projects 
SET 
  "badgeType" = COALESCE("badgeType", 'UX Design'),
  "heroImage" = COALESCE("heroImage", ''),
  "summary" = COALESCE("summary", ''),
  "situation" = COALESCE("situation", ''),
  "task" = COALESCE("task", ''),
  "action" = COALESCE("action", ''),
  "results" = COALESCE("results", ''),
  "lessonsLearned" = COALESCE("lessonsLearned", ''),
  "metrics" = COALESCE("metrics", '[]'),
  "images" = COALESCE("images", '{}'),
  "is_visible" = COALESCE("is_visible", true),
  "sort_order" = COALESCE("sort_order", 0),
  "url_slug" = COALESCE("url_slug", '')
WHERE "badgeType" IS NULL OR "heroImage" IS NULL OR "summary" IS NULL;

-- Ensure RLS policies exist for projects table
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects" ON projects
FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects("is_visible");
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects("sort_order");
CREATE INDEX IF NOT EXISTS idx_projects_badge_type ON projects("badgeType");
CREATE INDEX IF NOT EXISTS idx_projects_url_slug ON projects("url_slug");








