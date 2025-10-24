-- Simple Storage RLS Fix
-- This approach works with Supabase's built-in permissions

-- First, ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_images', 'site_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public update for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete for site_images" ON storage.objects;
DROP POLICY IF EXISTS "Public access for site_images" ON storage.objects;

-- Create new policies with proper permissions
CREATE POLICY "Enable read access for all users" ON storage.objects
FOR SELECT USING (bucket_id = 'site_images');

CREATE POLICY "Enable insert for all users" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_images');

CREATE POLICY "Enable update for all users" ON storage.objects
FOR UPDATE USING (bucket_id = 'site_images');

CREATE POLICY "Enable delete for all users" ON storage.objects
FOR DELETE USING (bucket_id = 'site_images');








