-- Fix email trigger by removing the problematic net.http_post function
-- We'll call the Edge Function directly from the frontend instead

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS contact_submission_trigger ON "contact_submissions";
DROP FUNCTION IF EXISTS notify_contact_submission();

-- The contact_submissions table will still work for storing data
-- The email notification will be handled by calling the Edge Function directly from the frontend














