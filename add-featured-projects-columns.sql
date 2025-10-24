-- Add featured projects columns to projects table
ALTER TABLE projects 
ADD COLUMN show_on_homepage boolean DEFAULT false,
ADD COLUMN homepage_display_order integer;

