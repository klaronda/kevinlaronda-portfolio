-- Add businessDetails column to projects table
ALTER TABLE projects ADD COLUMN businessDetails TEXT;

-- Update existing records to have empty businessDetails
UPDATE projects SET businessDetails = '' WHERE businessDetails IS NULL;






