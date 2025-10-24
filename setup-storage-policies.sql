-- Storage Policies for site_images bucket
-- Copy and paste this into your Supabase SQL Editor, then click "Run"

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'site_images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE USING (bucket_id = 'site_images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'site_images');

-- Allow anyone to upload (if you want to test without authentication)
CREATE POLICY "Public upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_images');
