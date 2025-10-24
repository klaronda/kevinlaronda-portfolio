#!/bin/bash

# Squarespace Migration Runner
# This script helps run the migration with proper setup

echo "🚀 Squarespace Migration Tool"
echo "============================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Please ensure your Supabase credentials are set up."
    exit 1
fi

# Load environment variables
source .env.local

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if ts-node is available
if ! command -v ts-node &> /dev/null; then
    echo "📦 Installing ts-node..."
    npm install -g ts-node
fi

# Create temp directory if it doesn't exist
mkdir -p temp/squarespace-images

echo "✅ Setup complete!"
echo ""
echo "📋 Usage:"
echo "  ./scripts/run-migration.sh <url1> <url2> <url3>..."
echo ""
echo "📝 Example:"
echo "  ./scripts/run-migration.sh \\"
echo "    https://kevin-laronda.squarespace.com/project1 \\"
echo "    https://kevin-laronda.squarespace.com/project2"
echo ""

# Run the migration if URLs are provided
if [ $# -gt 0 ]; then
    echo "🔄 Starting migration..."
    ts-node scripts/migrate-squarespace.ts "$@"
else
    echo "ℹ️  No URLs provided. Run with URLs to start migration."
fi














