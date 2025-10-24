#!/bin/bash

echo "🚀 Setting up Supabase for Kevin Laronda Portfolio"
echo "=================================================="

# Create .env.local file
echo "📝 Creating .env.local file..."

cat > .env.local << EOF
# Supabase Configuration for Kevin Laronda Portfolio
VITE_SUPABASE_URL=https://ncefkmwkjyidchoprhth.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Instructions:
# 1. Go to https://supabase.com/dashboard/project/ncefkmwkjyidchoprhth
# 2. Go to Settings > API
# 3. Copy the "anon public" key and replace VITE_SUPABASE_ANON_KEY above
EOF

echo "✅ Created .env.local file"
echo ""
echo "🔧 Next steps:"
echo "1. Edit .env.local and add your Supabase anon key"
echo "2. Go to https://supabase.com/dashboard/project/ncefkmwkjyidchoprhth"
echo "3. Go to Settings > API and copy the 'anon public' key"
echo "4. Run the SQL commands from supabase-schema.sql in your Supabase SQL Editor"
echo "5. Restart your development server: npm run dev"
echo ""
echo "📖 See SUPABASE_SETUP.md for detailed instructions"
