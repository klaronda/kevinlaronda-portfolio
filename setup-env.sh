#!/bin/bash

# Setup script for Supabase environment variables
echo "🚀 Setting up Supabase environment variables..."

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://ncefkmwkjyidchoprhth.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZWZrbXdranlpZGNob3ByaHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjI4NjYsImV4cCI6MjA1MDAwMDg2Nn0.2Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8
EOF

echo "✅ Environment variables configured!"
echo ""
echo "📋 Next steps:"
echo "1. Create the 'site_assets' storage bucket in your Supabase dashboard"
echo "2. Set up storage policies for the bucket"
echo "3. Restart your development server: npm run dev"
echo ""
echo "📖 See SUPABASE_STORAGE_SETUP.md for detailed instructions"
