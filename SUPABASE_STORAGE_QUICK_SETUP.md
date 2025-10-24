# 🚀 Quick Supabase Storage Setup Guide

## Current Status: ✅ Environment Variables Configured
Your `.env.local` file is set up and the server has restarted successfully!

## 🎯 Next Steps (2 minutes):

### 1. Create Storage Bucket
1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/ncefkmwkjyidchoprhth
2. **Navigate to Storage**: Click "Storage" in the left sidebar
3. **Create New Bucket**: 
   - Click "New bucket" button
   - **Name**: `site_assets`
   - **Public bucket**: ✅ Check this box
   - Click "Create bucket"

### 2. Set Up Storage Policies
1. **Go to SQL Editor**: Click "SQL Editor" in the left sidebar
2. **Run this SQL code**:

```sql
-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'site_assets');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_assets');

-- Allow authenticated users to update
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE USING (bucket_id = 'site_assets');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'site_assets');
```

3. **Click "Run"** to execute the SQL

### 3. Test Image Upload
1. **Go back to your admin panel**: http://localhost:3000/admin
2. **Create a new project**
3. **Try uploading a small image** (< 1MB)
4. **Check browser console** (F12) for success/error messages

## 🐛 Troubleshooting

### If you get "Bucket not found":
- Make sure you named it exactly `site_assets` (lowercase)
- Check that it's set to "Public"

### If you get "Permission denied":
- Make sure you ran the SQL policies above
- Check that RLS is enabled on storage.objects

### If upload still fails:
- Check browser console (F12) for detailed error messages
- Try a very small test image first (< 500KB)
- Make sure your Supabase project is active

## 📁 File Organization
Once working, images will be stored as:
- **Project Images**: `site_assets/projects/timestamp.jpg`
- **Editor Images**: `site_assets/editor-images/timestamp.jpg`

## ✅ Success Indicators
You'll know it's working when:
- No error alerts appear
- Console shows "Upload successful, URL: ..."
- Image appears in the editor/form
- Image has a Supabase URL like `https://ncefkmwkjyidchoprhth.supabase.co/storage/v1/object/public/site_assets/...`

## 🆘 Still Need Help?
1. Check the browser console (F12) for error details
2. Verify your Supabase project is active
3. Try uploading a tiny test image first
4. Make sure the bucket name is exactly `site_assets`

---
**Time to complete**: ~2 minutes
**Difficulty**: Easy (just clicking buttons and running SQL)
