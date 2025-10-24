#!/usr/bin/env node

import * as cheerio from 'cheerio';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SQUARESPACE_URL = 'https://www.kevinlaronda.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ncefkmwkjyidchoprhth.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZWZrbXdranlpZGNob3ByaHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMTc1NzAsImV4cCI6MjA3NTU5MzU3MH0._NQFnUF7GBE-nKHZUdhdv5CD1VtvH08thUnkZt7NNrY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types
interface MigrationResult {
  success: boolean;
  url: string;
  title?: string;
  error?: string;
  projectId?: string;
}

interface ExtractedContent {
  title: string;
  heroImage?: string;
  images: string[];
  summary: string;
  problem?: string;
  objective?: string;
  actions?: string;
  results?: string;
  lessons?: string;
  urlSlug: string;
}

interface StarSection {
  problem?: string;
  objective?: string;
  actions?: string;
  results?: string;
  lessons?: string;
}

class SquarespaceMigrator {
  private session: any = null;
  private results: MigrationResult[] = [];

  constructor() {
    console.log('🚀 Squarespace Migration Tool Initialized');
    console.log(`📁 Target: ${SQUARESPACE_URL}`);
    console.log(`🗄️  Database: ${SUPABASE_URL}`);
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 Testing connection to Squarespace...');
      
      // Create session with axios
      const session = axios.create({
        baseURL: SQUARESPACE_URL,
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      // Test connection by accessing the main page
      const response = await session.get('/');
      
      if (response.status === 200) {
        console.log('✅ Connection successful!');
        this.session = session;
        return true;
      }
      
      throw new Error('Connection failed');
    } catch (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
  }

  async extractContent(url: string): Promise<ExtractedContent> {
    try {
      console.log(`📄 Extracting content from: ${url}`);
      
      const response = await this.session.get(url);
      const $ = cheerio.load(response.data);
      
      // Extract title
      const title = $('h1').first().text().trim() || 
                   $('title').text().replace(' - Kevin Laronda', '').trim() ||
                   'Untitled Project';
      
      // Extract all images
      const images: string[] = [];
      $('img').each((_, img) => {
        const src = $(img).attr('src');
        if (src && !src.includes('data:')) {
          // Convert relative URLs to absolute
          const absoluteUrl = src.startsWith('http') ? src : `${SQUARESPACE_URL}${src}`;
          images.push(absoluteUrl);
        }
      });
      
      // Get hero image (first large image)
      const heroImage = images.length > 0 ? images[0] : undefined;
      
      // Extract URL slug from URL
      const urlSlug = url.split('/').pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Extract text content
      const contentText = this.extractTextContent($);
      
      // Try to parse STAR sections
      const starSections = this.parseStarSections($, contentText);
      
      // If STAR sections found, use them; otherwise put all content in summary
      const summary = starSections.problem || starSections.objective || starSections.actions || 
                     starSections.results || starSections.lessons ? 
                     'Content migrated from Squarespace - see STAR sections below' : 
                     contentText;
      
      return {
        title,
        heroImage,
        images,
        summary,
        problem: starSections.problem,
        objective: starSections.objective,
        actions: starSections.actions,
        results: starSections.results,
        lessons: starSections.lessons,
        urlSlug
      };
      
    } catch (error) {
      console.error(`❌ Failed to extract content from ${url}:`, error);
      throw error;
    }
  }

  private extractTextContent($: cheerio.CheerioAPI): string {
    // Remove script and style elements
    $('script, style').remove();
    
    // Get main content area (common Squarespace selectors)
    const mainContent = $('.sqs-layout .sqs-col-12, .Main-content, .content, main, .page-content').first();
    if (mainContent.length > 0) {
      return mainContent.text().trim();
    }
    
    // Fallback to body text
    return $('body').text().trim();
  }

  private parseStarSections($: cheerio.CheerioAPI, contentText: string): StarSection {
    const sections: StarSection = {};
    
    // Look for common STAR section patterns
    const starKeywords = {
      problem: ['problem', 'situation', 'challenge', 'issue'],
      objective: ['objective', 'task', 'goal', 'aim'],
      actions: ['actions', 'solution', 'approach', 'method'],
      results: ['results', 'outcome', 'impact', 'metrics'],
      lessons: ['lessons', 'learnings', 'insights', 'takeaways']
    };
    
    // Check for headings that might indicate STAR sections
    $('h1, h2, h3, h4, h5, h6').each((_, heading) => {
      const headingText = $(heading).text().toLowerCase().trim();
      
      for (const [section, keywords] of Object.entries(starKeywords)) {
        if (keywords.some(keyword => headingText.includes(keyword))) {
          // Get content after this heading until next heading
          let sectionContent = '';
          $(heading).nextUntil('h1, h2, h3, h4, h5, h6').each((_, elem) => {
            sectionContent += $(elem).text() + ' ';
          });
          
          if (sectionContent.trim()) {
            sections[section as keyof StarSection] = sectionContent.trim();
          }
        }
      }
    });
    
    return sections;
  }

  async downloadImage(imageUrl: string, projectSlug: string): Promise<string> {
    try {
      const response = await this.session.get(imageUrl, { responseType: 'stream' });
      const fileName = path.basename(imageUrl.split('?')[0]);
      const localPath = path.join('temp', 'squarespace-images', projectSlug, fileName);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      
      // Write file
      const writer = fs.createWriteStream(localPath);
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(localPath));
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`❌ Failed to download image ${imageUrl}:`, error);
      throw error;
    }
  }

  async uploadToSupabase(localPath: string, projectSlug: string, fileName: string): Promise<string> {
    try {
      const fileBuffer = fs.readFileSync(localPath);
      const supabasePath = `migrated-projects/${projectSlug}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('site_images')
        .upload(supabasePath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site_images')
        .getPublicUrl(supabasePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error(`❌ Failed to upload to Supabase:`, error);
      throw error;
    }
  }

  async migrateProject(url: string): Promise<MigrationResult> {
    try {
      console.log(`\n🔄 Migrating: ${url}`);
      
      // Extract content
      const content = await this.extractContent(url);
      console.log(`📝 Title: ${content.title}`);
      
      // Skip image upload for now due to RLS policy issues
      let heroImageUrl = '';
      if (content.heroImage) {
        console.log(`🖼️  Skipping image upload (using original URL for now)`);
        // Use the original Squarespace image URL for now
        heroImageUrl = content.heroImage;
      }
      
      // Create project in database
      const projectData = {
        title: content.title,
        badgeType: 'UX Design',
        summary: content.summary,
        heroImage: heroImageUrl,
        isVisible: false,
        sortOrder: this.results.length + 1,
        urlSlug: content.urlSlug,
        problem: content.problem || '',
        objective: content.objective || '',
        actions: content.actions || '',
        results: content.results || '',
        lessons: content.lessons || '',
        metrics: []
      };
      
      const { data: project, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log(`✅ Project created with ID: ${project.id}`);
      
      return {
        success: true,
        url,
        title: content.title,
        projectId: project.id
      };
      
    } catch (error) {
      console.error(`❌ Migration failed for ${url}:`, error);
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async run(urls: string[]): Promise<void> {
    console.log(`\n🚀 Starting migration of ${urls.length} pages...`);
    
    // Authenticate first
    const connectionSuccess = await this.testConnection();
    if (!connectionSuccess) {
      throw new Error('Connection failed');
    }
    
    // Migrate each URL
    for (const url of urls) {
      const result = await this.migrateProject(url);
      this.results.push(result);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate report
    this.generateReport();
  }

  private generateReport(): void {
    console.log('\n📊 Migration Report:');
    console.log('==================');
    
    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (successful.length > 0) {
      console.log('\n✅ Successfully migrated:');
      successful.forEach(result => {
        console.log(`  - ${result.title} (${result.url})`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed migrations:');
      failed.forEach(result => {
        console.log(`  - ${result.url}: ${result.error}`);
      });
    }
    
    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      total: this.results.length,
      successful: successful.length,
      failed: failed.length,
      results: this.results
    };
    
    fs.writeFileSync('migration-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to migration-report.json');
  }
}

// Main execution
async function main() {
  try {
    // Get URLs from command line arguments or prompt
    const args = process.argv.slice(2);
    let urls: string[];
    
    if (args.length > 0) {
      urls = args;
    } else {
      console.log('📋 Please provide the Squarespace page URLs to migrate.');
      console.log('Usage: npm run migrate-squarespace <url1> <url2> <url3>...');
      console.log('Example: npm run migrate-squarespace https://kevinlaronda.com/project1 https://kevinlaronda.com/project2');
      process.exit(1);
    }
    
    // Validate URLs
    const validUrls = urls.filter(url => url.includes('kevinlaronda.com'));
    if (validUrls.length !== urls.length) {
      console.log('⚠️  Some URLs are not from kevinlaronda.com and will be skipped');
    }
    
    // Convert URLs to use www if they don't already
    const normalizedUrls = validUrls.map(url => 
      url.replace('https://kevinlaronda.com', 'https://www.kevinlaronda.com')
    );
    
    if (normalizedUrls.length === 0) {
      console.log('❌ No valid URLs provided');
      process.exit(1);
    }
    
    // Run migration
    const migrator = new SquarespaceMigrator();
    await migrator.run(normalizedUrls);
    
    console.log('\n🎉 Migration completed!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('migrate-squarespace')) {
  main();
}

export { SquarespaceMigrator };
