-- Create experience table
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

-- Insert sample experience data
INSERT INTO experience (title, company, location, start_date, end_date, description, achievements, sort_order) VALUES
('Senior UX Designer', 'TechCorp', 'San Francisco, CA', '2022-01-01', '2024-12-31', 'Led user experience design for enterprise software products, focusing on improving user workflows and reducing task completion time.', 
 ARRAY['Reduced user task completion time by 40%', 'Led design system implementation across 5 product teams', 'Increased user satisfaction scores by 25%'], 1),
('UX Designer', 'StartupXYZ', 'Remote', '2020-06-01', '2021-12-31', 'Designed user interfaces for mobile and web applications, conducting user research and usability testing.', 
 ARRAY['Designed mobile app with 50k+ downloads', 'Conducted 20+ user interviews and usability tests', 'Created design system used by 10+ developers'], 2),
('Junior Designer', 'Creative Agency', 'New York, NY', '2019-01-01', '2020-05-31', 'Created visual designs for various client projects including branding, web design, and marketing materials.', 
 ARRAY['Worked on 15+ client projects', 'Improved client satisfaction scores by 30%', 'Mentored 2 junior designers'], 3);
