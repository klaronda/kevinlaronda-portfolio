-- Storage Policies for site_images bucket
-- These policies work with Supabase's built-in permissions
-- Copy and paste this into your Supabase SQL Editor, then click "Run"

-- Allow public read access (anyone can view/download files)
CREATE POLICY "Public read access for site_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site_images');

-- Allow public uploads (anyone can upload files)
-- This is the simplest for testing - you can restrict it later
CREATE POLICY "Public upload for site_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site_images');

-- Allow public updates
CREATE POLICY "Public update for site_images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site_images');

-- Allow public deletes
CREATE POLICY "Public delete for site_images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site_images');

