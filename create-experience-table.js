const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createExperienceTable() {
  console.log('Creating experience table...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS experience (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      description TEXT,
      achievements TEXT[],
      logo_url TEXT,
      sort_order INTEGER DEFAULT 0,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  
  if (error) {
    console.error('Error creating experience table:', error);
  } else {
    console.log('Experience table created successfully');
  }
}

async function insertExperienceData() {
  console.log('Inserting experience data...');
  
  const experienceData = [
    {
      title: 'Senior UX Designer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      start_date: '2022-01-01',
      description: 'Led user experience design for enterprise software products, focusing on improving user workflows and reducing task completion time.',
      achievements: ['Reduced user task completion time by 40%', 'Led design system implementation across 5 product teams', 'Increased user satisfaction scores by 25%'],
      sort_order: 1
    },
    {
      title: 'UX Designer',
      company: 'StartupXYZ',
      location: 'Remote',
      start_date: '2020-06-01',
      description: 'Designed user interfaces for mobile and web applications, conducting user research and usability testing.',
      achievements: ['Designed mobile app with 50k+ downloads', 'Conducted 20+ user interviews and usability tests', 'Created design system used by 10+ developers'],
      sort_order: 2
    },
    {
      title: 'Junior Designer',
      company: 'Creative Agency',
      location: 'New York, NY',
      start_date: '2019-01-01',
      description: 'Created visual designs for various client projects including branding, web design, and marketing materials.',
      achievements: ['Worked on 15+ client projects', 'Improved client satisfaction scores by 30%', 'Mentored 2 junior designers'],
      sort_order: 3
    }
  ];

  for (const exp of experienceData) {
    const { data, error } = await supabase
      .from('experience')
      .insert([exp])
      .select();

    if (error) {
      console.error('Error inserting experience:', error);
    } else {
      console.log('Inserted experience:', exp.title);
    }
  }
}

async function main() {
  try {
    await createExperienceTable();
    await insertExperienceData();
    console.log('Experience setup complete!');
  } catch (error) {
    console.error('Error setting up experience:', error);
  }
}

main();
