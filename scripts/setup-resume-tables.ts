import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  try {
    console.log('Setting up experience table...');
    const experienceSQL = readFileSync(join(__dirname, '../setup-experience-table.sql'), 'utf8');
    const { error: experienceError } = await supabase.rpc('exec_sql', { sql: experienceSQL });
    
    if (experienceError) {
      console.error('Error setting up experience table:', experienceError);
    } else {
      console.log('Experience table setup complete');
    }

    console.log('Setting up education table...');
    const educationSQL = readFileSync(join(__dirname, '../setup-education-table.sql'), 'utf8');
    const { error: educationError } = await supabase.rpc('exec_sql', { sql: educationSQL });
    
    if (educationError) {
      console.error('Error setting up education table:', educationError);
    } else {
      console.log('Education table setup complete');
    }

    console.log('All tables setup complete!');
  } catch (error) {
    console.error('Error setting up tables:', error);
  }
}

setupTables();
