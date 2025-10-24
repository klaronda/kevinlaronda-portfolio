// Test script to verify Supabase connection and storage
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables not properly set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('\n📡 Testing basic connection...');
    const { data, error } = await supabase.from('projects').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Database connection issue:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }

    // Test 2: Storage bucket check
    console.log('\n📦 Testing storage bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Storage access issue:', bucketError.message);
      return;
    }

    const siteAssetsBucket = buckets.find(bucket => bucket.name === 'site_assets');
    
    if (siteAssetsBucket) {
      console.log('✅ site_assets bucket found');
      console.log('   Public:', siteAssetsBucket.public ? 'Yes' : 'No');
    } else {
      console.log('❌ site_assets bucket not found');
      console.log('   Available buckets:', buckets.map(b => b.name));
      console.log('\n💡 Create the bucket in your Supabase dashboard:');
      console.log('   1. Go to Storage → New bucket');
      console.log('   2. Name: site_assets');
      console.log('   3. Check "Public bucket"');
      console.log('   4. Click Create');
    }

    // Test 3: Storage policies (if bucket exists)
    if (siteAssetsBucket) {
      console.log('\n🔐 Testing storage policies...');
      try {
        // Try to list files in the bucket
        const { data: files, error: listError } = await supabase.storage
          .from('site_assets')
          .list('', { limit: 1 });
        
        if (listError) {
          console.log('❌ Storage policy issue:', listError.message);
          console.log('\n💡 Set up storage policies in SQL Editor:');
          console.log(`
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'site_assets');

CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site_assets');
          `);
        } else {
          console.log('✅ Storage policies working correctly');
        }
      } catch (err) {
        console.log('⚠️  Could not test storage policies:', err.message);
      }
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();
