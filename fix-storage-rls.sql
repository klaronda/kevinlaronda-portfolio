-- Fix Supabase Storage RLS Issues
-- Run this in your Supabase SQL Editor

-- First, let's check if the bucket exists and create it if needed
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_images', 'site_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public update for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for site_images" ON storage.objects;

-- Create new, more permissive policies
CREATE POLICY "Allow public read access for site_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site_images');

CREATE POLICY "Allow public upload for site_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site_images');

CREATE POLICY "Allow public update for site_images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site_images');

CREATE POLICY "Allow public delete for site_images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site_images');

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;








