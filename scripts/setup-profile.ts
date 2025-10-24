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

async function setupProfile() {
  console.log('🔄 Setting up profile data...');

  // Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profile')
    .select('*')
    .limit(1);

  if (fetchError) {
    console.error('❌ Error checking profile table:', fetchError);
    console.log('💡 You may need to create the profile table in your Supabase dashboard first.');
    console.log('📄 Run the SQL in setup-profile-table.sql in your Supabase SQL editor.');
    return;
  }

  if (existingProfile && existingProfile.length > 0) {
    console.log('✅ Profile already exists:', existingProfile[0]);
    return;
  }

  // Create default profile
  const { data, error } = await supabase
    .from('profile')
    .insert({
      name: 'Kevin Laronda',
      title: 'UX + Design Strategy + Manager',
      bio: `I'm a strategic problem-solver who turns messy, ambiguous challenges into clear, meaningful experiences. With roots in creative marketing and a background in skateboarding, I've learned to see unconventional paths and execute with precision.

Over the years, I've evolved from creative director to UX strategist, developing a knack for identifying broken experiences and redesigning them into solutions customers love. I thrive in uncertainty, prefering projects others avoid, and I move fast—often arriving with prototypes instead of just problems.

Whether leading teams or working hands-on, my focus stays the same: transforming frustration into satisfaction through thoughtful, high-impact design.`
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating profile:', error);
    console.log('💡 You may need to create the profile table in your Supabase dashboard first.');
    console.log('📄 Run the SQL in setup-profile-table.sql in your Supabase SQL editor.');
  } else {
    console.log('✅ Profile created successfully:', data);
  }
}

setupProfile();



