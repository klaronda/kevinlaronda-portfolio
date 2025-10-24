-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default profile data
INSERT INTO profile (name, title, bio) 
VALUES (
  'Kevin Laronda', 
  'UX + Design Strategy + Manager', 
  'I''m a strategic problem-solver who turns messy, ambiguous challenges into clear, meaningful experiences. With roots in creative marketing and a background in skateboarding, I''ve learned to see unconventional paths and execute with precision.

Over the years, I''ve evolved from creative director to UX strategist, developing a knack for identifying broken experiences and redesigning them into solutions customers love. I thrive in uncertainty, prefering projects others avoid, and I move fast—often arriving with prototypes instead of just problems.

Whether leading teams or working hands-on, my focus stays the same: transforming frustration into satisfaction through thoughtful, high-impact design.'
) 
ON CONFLICT (id) DO NOTHING;

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_updated_at 
    BEFORE UPDATE ON profile 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
