#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {} as Record<string, string>);

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to normalize HTML content by removing inline styles and ensuring consistent text color
function normalizeTextContent(html: string): string {
  if (!html) return html;
  
  // Remove any inline style attributes that might contain color or font-weight
  let normalized = html.replace(/style="[^"]*"/g, '');
  
  // Remove any color or font-weight from style attributes
  normalized = normalized.replace(/style="([^"]*color[^"]*|[^"]*font-weight[^"]*)"[^>]*/g, '');
  
  // Ensure all text elements have consistent styling
  // Wrap content in a div with the rich-text-content class for consistent styling
  if (normalized.trim()) {
    normalized = `<div class="rich-text-content">${normalized}</div>`;
  }
  
  return normalized;
}

async function normalizeAllProjects() {
  console.log('🔄 Starting text normalization for all projects...');
  
  try {
    // Get all projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, summary, businessdetails, situation, task, action, output, lessonsLearned');
    
    if (fetchError) {
      console.error('❌ Error fetching projects:', fetchError);
      return;
    }
    
    if (!projects || projects.length === 0) {
      console.log('ℹ️ No projects found');
      return;
    }
    
    console.log(`📊 Found ${projects.length} projects to normalize`);
    
    let updatedCount = 0;
    
    for (const project of projects) {
      const updates: any = {};
      let hasChanges = false;
      
      // Normalize each text field
      const fields = ['summary', 'businessdetails', 'situation', 'task', 'action', 'output', 'lessonsLearned'];
      
      for (const field of fields) {
        const currentValue = (project as any)[field];
        if (currentValue) {
          const normalized = normalizeTextContent(currentValue);
          if (normalized !== currentValue) {
            (updates as any)[field] = normalized;
            hasChanges = true;
          }
        }
      }
      
      // Update project if there are changes
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', project.id);
        
        if (updateError) {
          console.error(`❌ Error updating project ${project.title}:`, updateError);
        } else {
          console.log(`✅ Normalized project: ${project.title}`);
          updatedCount++;
        }
      }
    }
    
    console.log(`🎉 Text normalization complete! Updated ${updatedCount} projects`);
    
  } catch (error) {
    console.error('❌ Error during normalization:', error);
  }
}

// Run the normalization
normalizeAllProjects();
