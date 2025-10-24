# Image Upload Troubleshooting Guide

## Current Issue: "Failed to upload image. Please check your Supabase Storage configuration."

### ✅ **Fixed Issues:**

1. **Environment Variables**: Now properly configured in `.env.local`
2. **Error Handling**: Better error messages and debugging
3. **File Size Validation**: 10MB limit with clear feedback

### 🔧 **Next Steps to Fix Image Upload:**

#### **1. Create Storage Bucket in Supabase**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name: `site_assets`
5. Set as **Public** (for portfolio images)
6. Click **Create bucket**

#### **2. Set Up Storage Policies**
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'site_assets');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE USING (bucket_id = 'site_assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'site_assets' AND auth.role() = 'authenticated');
```

#### **3. Restart Development Server**
```bash
npm run dev
```

### 🐛 **Debugging Steps:**

#### **Check Console Logs**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading an image
4. Look for error messages or success logs

#### **Common Error Messages:**

- **"Supabase not configured"**: Environment variables not set
- **"Bucket not found"**: `site_assets` bucket doesn't exist
- **"Permission denied"**: Storage policies not set up
- **"File size too large"**: Image exceeds 10MB limit

#### **Verify Configuration**
Check that these are set in `.env.local`:
```
VITE_SUPABASE_URL=https://ncefkmwkjyidchoprhth.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 📁 **File Organization:**
- **Project Images**: `site_assets/projects/filename.jpg`
- **Editor Images**: `site_assets/editor-images/filename.jpg`

### 🔄 **Testing:**
1. Create a new project
2. Try uploading a small image (< 1MB)
3. Check console for success/error messages
4. Verify image appears in the editor

### 🆘 **Still Having Issues?**
1. Check Supabase dashboard for any error logs
2. Verify your Supabase project is active
3. Make sure you have the correct URL and API key
4. Try uploading a very small test image first

### 📞 **Quick Fix:**
If you need to test immediately, you can:
1. Use image URLs directly in the "Or enter image URL" field
2. Use placeholder images like: `https://via.placeholder.com/800x600`
3. Set up Supabase Storage when ready for production
