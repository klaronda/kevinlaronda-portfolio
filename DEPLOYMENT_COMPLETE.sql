-- Database trigger to automatically send emails when contact forms are submitted
-- Run this SQL in your Supabase SQL Editor

-- Create function to call the edge function
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://ncefkmwkjyidchoprhth.supabase.co/functions/v1/send-contact-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZWZrbXdranlpZGNob3ByaHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMTc1NzAsImV4cCI6MjA3NTU5MzU3MH0._NQFnUF7GBE-nKHZUdhdv5CD1VtvH08thUnkZt7NNrY"}'::jsonb,
      body := json_build_object(
        'contactData', row_to_json(NEW)
      )::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER contact_submission_trigger
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();
