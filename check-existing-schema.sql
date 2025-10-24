-- Check existing table schemas
-- Run this to see what columns currently exist

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('projects', 'ventures', 'resume', 'experience', 'education', 'profile')
ORDER BY table_name, ordinal_position;








