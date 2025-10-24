# Supabase Storage Setup for Portfolio Assets

## Overview
This guide explains how to set up Supabase Storage for your portfolio website to handle image uploads and other assets.

## Prerequisites
- Supabase project created and configured
- Environment variables set up (see `SUPABASE_SETUP.md`)

## Storage Bucket Setup

### 1. Create Storage Bucket
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name: `site_assets`
5. Set as **Public** (for portfolio images)
6. Click **Create bucket**

### 2. Configure Bucket Policies
For the `site_assets` bucket, you'll need these policies:

#### Allow public read access:
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'site_assets');
```

#### Allow authenticated users to upload:
```sql
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_assets' AND auth.role() = 'authenticated');
```

#### Allow authenticated users to update:
```sql
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE USING (bucket_id = 'site_assets' AND auth.role() = 'authenticated');
```

#### Allow authenticated users to delete:
```sql
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'site_assets' AND auth.role() = 'authenticated');
```

### 3. File Structure
The storage bucket will organize files as follows:
```
site_assets/
├── projects/
│   ├── 1703123456789.jpg
│   ├── 1703123456790.png
│   └── ...
├── ventures/
│   └── ...
└── resume/
    └── ...
```

## Usage in Admin Panel

### Image Upload Flow
1. User clicks "Upload Image" button
2. File picker opens
3. File uploads to `site_assets/projects/` folder
4. Public URL is generated and stored in project data
5. Image displays in the admin panel

### Supported Formats
- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Max file size**: 10MB (configurable)
- **Automatic optimization**: Images are served through Supabase's CDN

## Security Considerations

### For Production
1. **Authentication**: Implement proper user authentication
2. **File validation**: Add server-side file type and size validation
3. **Rate limiting**: Implement upload rate limits
4. **Virus scanning**: Consider adding malware scanning for uploads

### For Development
- Public bucket is fine for testing
- Consider using Supabase's built-in authentication for admin access

## Troubleshooting

### Common Issues

#### "Bucket not found" error
- Ensure the bucket name is exactly `site_assets`
- Check that the bucket exists in your Supabase dashboard

#### "Permission denied" error
- Verify the RLS policies are correctly applied
- Check that your API keys have the right permissions

#### Images not displaying
- Ensure the bucket is set to **Public**
- Check that the generated URLs are accessible
- Verify the file actually uploaded successfully

### File Size Limits
- Default Supabase limit: 50MB per file
- Recommended for web: Keep images under 5MB
- Consider image compression for better performance

## Next Steps
1. Set up the storage bucket following this guide
2. Test image uploads in the admin panel
3. Configure authentication for production use
4. Consider adding image optimization/compression

## Additional Resources
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage API Reference](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
