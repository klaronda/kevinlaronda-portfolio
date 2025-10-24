-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT NOT NULL,
  emphasis TEXT,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample education data
INSERT INTO education (title, institution, year, emphasis, sort_order) VALUES
('Bachelor of Fine Arts in Graphic Design', 'Art Institute of California', '2018', 'User Experience Design', 1),
('UX Design Certification', 'Google UX Design Certificate', '2020', 'User Research and Prototyping', 2),
('Design Thinking Workshop', 'IDEO U', '2021', 'Human-Centered Design', 3);
