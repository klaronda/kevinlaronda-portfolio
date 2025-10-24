#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {} as Record<string, string>);

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExperienceTable() {
  console.log('🔄 Checking experience table...');

  // Try to fetch experience data
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error accessing experience table:', error);
    console.log('💡 The experience table may not exist in your database.');
    console.log('📄 You may need to create the experience table in your Supabase dashboard.');
    return;
  }

  console.log('✅ Experience table exists and is accessible');
  console.log('📊 Current experience entries:', data?.length || 0);
  
  if (data && data.length > 0) {
    console.log('📋 Sample entry:', data[0]);
  }
}

checkExperienceTable();



