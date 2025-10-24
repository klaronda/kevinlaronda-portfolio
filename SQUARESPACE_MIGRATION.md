# Squarespace Migration Guide

This guide helps you migrate your "Not Linked" project pages from Squarespace to your new portfolio site.

## Prerequisites

1. **Supabase Setup**: Ensure your `.env.local` file contains:
   ```
   VITE_SUPABASE_URL=https://ncefkmwkjyidchoprhth.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install
   ```

## Getting Your Squarespace URLs

Since Squarespace "Not Linked" pages aren't publicly accessible, you'll need to provide the URLs manually:

### Option 1: From Squarespace Admin
1. Log into your Squarespace admin panel
2. Go to Pages → Not Linked
3. Copy the URLs of pages you want to migrate
4. URLs should look like: `https://kevin-laronda.squarespace.com/project-name`

### Option 2: From Your Sitemap
1. Visit: `https://kevin-laronda.squarespace.com/sitemap.xml`
2. Look for pages that aren't linked in your main navigation
3. Copy those URLs

## Running the Migration

### Method 1: Using the Helper Script
```bash
./scripts/run-migration.sh \
  https://kevin-laronda.squarespace.com/project1 \
  https://kevin-laronda.squarespace.com/project2 \
  https://kevin-laronda.squarespace.com/project3
```

### Method 2: Using npm script
```bash
npm run migrate-squarespace \
  https://kevin-laronda.squarespace.com/project1 \
  https://kevin-laronda.squarespace.com/project2 \
  https://kevin-laronda.squarespace.com/project3
```

### Method 3: Direct execution
```bash
npx ts-node scripts/migrate-squarespace.ts \
  https://kevin-laronda.squarespace.com/project1 \
  https://kevin-laronda.squarespace.com/project2
```

## What Gets Migrated

### Content Extraction
- **Title**: From page heading or title tag
- **Images**: All images from the page (hero + additional)
- **Text Content**: All text content from the page
- **STAR Sections**: Attempts to parse Problem, Objective, Actions, Results, Lessons if structured content exists

### Database Fields
- `title`: Extracted from page
- `badgeType`: Set to "UX Design"
- `summary`: Main content or "Content migrated from Squarespace - see STAR sections below"
- `heroImage`: First large image from the page
- `isVisible`: `false` (hidden by default)
- `urlSlug`: Preserved from Squarespace URL
- `problem`, `objective`, `actions`, `results`, `lessons`: Parsed STAR content (if found)
- `sortOrder`: Based on migration order
- `metrics`: Empty array

### Image Handling
- Downloads all images to `temp/squarespace-images/[project-slug]/`
- Uploads to Supabase Storage: `site_images/migrated-projects/[project-slug]/`
- Updates image references in content

## Authentication

The migration tool uses password "kevin" to access your password-protected Squarespace site. If you've changed this password, update it in `scripts/migrate-squarespace.ts`.

## Migration Report

After migration, you'll get:
- Console output with success/failure status
- `migration-report.json` file with detailed results
- List of successfully migrated projects
- List of failed migrations with error reasons

## Post-Migration Steps

1. **Review Results**: Check the migration report
2. **Test Projects**: Visit the admin panel to see migrated projects
3. **Update Content**: Improve STAR sections and content organization
4. **Set Visibility**: Change `isVisible` to `true` for projects you want to show
5. **Clean Up**: Delete `temp/squarespace-images/` folder when done

## Troubleshooting

### Authentication Failed
- Verify the password is still "kevin"
- Check if Squarespace site is still password-protected
- Try accessing the site manually with the password

### Image Upload Failed
- Check Supabase Storage permissions
- Verify `site_images` bucket exists
- Ensure you have upload permissions

### Content Parsing Issues
- Some pages may not parse perfectly
- Manual review and editing may be needed
- STAR sections may need reorganization

### Database Errors
- Check Supabase connection
- Verify database schema matches expected structure
- Ensure you have write permissions

## Example Migration

```bash
# Migrate three specific projects
npm run migrate-squarespace \
  https://kevin-laronda.squarespace.com/fintech-redesign \
  https://kevin-laronda.squarespace.com/healthcare-app \
  https://kevin-laronda.squarespace.com/enterprise-dashboard
```

This will:
1. Authenticate with Squarespace using password "kevin"
2. Extract content from each page
3. Download and upload images to Supabase
4. Create project entries in your database
5. Generate a detailed migration report

## Notes

- All migrated projects are hidden by default (`isVisible: false`)
- Original Squarespace URL slugs are preserved
- Images are organized in separate folders for easy management
- The migration tool creates backups of all extracted data
- You can re-run migration for individual pages if needed













