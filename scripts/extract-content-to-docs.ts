#!/usr/bin/env node

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// Configuration
const SQUARESPACE_URL = 'https://www.kevinlaronda.com';
const OUTPUT_DIR = './extracted-content';

// Project URLs to extract content from
const PROJECT_URLS = [
  'https://www.kevinlaronda.com/primermes',
  'https://www.kevinlaronda.com/fun-fodder',
  'https://www.kevinlaronda.com/castle-rock',
  'https://www.kevinlaronda.com/fave-emails',
  'https://www.kevinlaronda.com/teleflora-holiday-catalog',
  'https://www.kevinlaronda.com/teleflora-one-tough-mother',
  'https://www.kevinlaronda.com/stickers',
  'https://www.kevinlaronda.com/just-like-her',
  'https://www.kevinlaronda.com/pom-wonderful',
  'https://www.kevinlaronda.com/whole-foods-holiday',
  'https://www.kevinlaronda.com/elephant-ernie',
  'https://www.kevinlaronda.com/sweet-scarletts',
  'https://www.kevinlaronda.com/wfm-valentines-day',
  'https://www.kevinlaronda.com/good-choice-kid',
  'https://kevinlaronda.com/were-all-a-little-nuts',
  'https://www.kevinlaronda.com/stone-wheels',
  'https://www.kevinlaronda.com/moet',
  'https://www.kevinlaronda.com/huluwestworld',
  'https://www.kevinlaronda.com/hulu-documentaries'
];

interface ExtractedContent {
  title: string;
  url: string;
  summary: string;
  problem?: string;
  objective?: string;
  actions?: string;
  results?: string;
  lessons?: string;
  allText: string;
  metadata: {
    extractedAt: string;
    originalUrl: string;
    wordCount: number;
  };
}

class ContentExtractor {
  private session: any;

  constructor() {
    console.log('📄 Squarespace Content Extractor Initialized');
    console.log(`📁 Output directory: ${path.resolve(OUTPUT_DIR)}`);
  }

  async initialize() {
    // Create axios session
    this.session = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`✅ Created output directory: ${OUTPUT_DIR}`);
    }
  }

  sanitizeFilename(title: string): string {
    // Remove special characters and limit length
    return title
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .substring(0, 50); // Limit to 50 characters
  }

  extractTextContent($: any): string {
    // Remove script and style elements
    $('script, style, nav, footer, header').remove();
    
    // Extract main content areas
    let content = '';
    
    // Get main content areas
    const contentSelectors = [
      'main',
      '.content',
      '.post-content',
      '.entry-content',
      '[data-slice-type="body"]',
      '.sqs-block-content',
      '.sqs-block-text'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content += element.text() + '\n\n';
      }
    }
    
    // If no specific content areas found, get all text
    if (!content.trim()) {
      content = $('body').text();
    }
    
    return content
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
      .trim();
  }

  parseStarSections($: any, contentText: string) {
    const sections = {
      problem: '',
      objective: '',
      actions: '',
      results: '',
      lessons: ''
    };

    // Look for STAR section headers in the content
    const starKeywords = {
      problem: ['problem', 'challenge', 'issue', 'pain point'],
      objective: ['objective', 'goal', 'aim', 'purpose', 'mission'],
      actions: ['action', 'approach', 'solution', 'method', 'process', 'strategy'],
      results: ['result', 'outcome', 'impact', 'achievement', 'success', 'metric'],
      lessons: ['lesson', 'learn', 'insight', 'takeaway', 'reflection', 'key finding']
    };

    // Try to find sections based on common patterns
    const paragraphs = contentText.split('\n\n');
    
    paragraphs.forEach((paragraph, index) => {
      const lowerParagraph = paragraph.toLowerCase();
      
      Object.entries(starKeywords).forEach(([section, keywords]) => {
        keywords.forEach(keyword => {
          if (lowerParagraph.includes(keyword) && paragraph.length > 50) {
            if (!sections[section as keyof typeof sections]) {
              sections[section as keyof typeof sections] = paragraph.trim();
            }
          }
        });
      });
    });

    return sections;
  }

  async extractProjectContent(url: string): Promise<ExtractedContent> {
    try {
      console.log(`📄 Extracting content from: ${url}`);
      
      const response = await this.session.get(url);
      const $ = cheerio.load(response.data);
      
      // Extract title
      const title = $('h1').first().text().trim() || 
                   $('title').text().replace(' - Kevin Laronda', '').replace(' — Kevin Laronda | Writer', '').trim() ||
                   'Untitled Project';
      
      // Extract all text content
      const allText = this.extractTextContent($);
      
      // Try to parse STAR sections
      const starSections = this.parseStarSections($, allText);
      
      // Create summary (first few paragraphs or all content if no STAR sections)
      const paragraphs = allText.split('\n\n').filter(p => p.trim().length > 20);
      const summary = starSections.problem || starSections.objective || starSections.actions || 
                     starSections.results || starSections.lessons ? 
                     'Content extracted from Squarespace - see STAR sections below' : 
                     paragraphs.slice(0, 3).join('\n\n');

      const wordCount = allText.split(/\s+/).length;
      
      console.log(`📝 Title: ${title}`);
      console.log(`📊 Word count: ${wordCount}`);
      
      return {
        title,
        url,
        summary,
        problem: starSections.problem,
        objective: starSections.objective,
        actions: starSections.actions,
        results: starSections.results,
        lessons: starSections.lessons,
        allText,
        metadata: {
          extractedAt: new Date().toISOString(),
          originalUrl: url,
          wordCount
        }
      };
    } catch (error: any) {
      console.error(`❌ Failed to extract from ${url}:`, error.message);
      return {
        title: 'Error',
        url,
        summary: 'Failed to extract content',
        allText: 'Failed to extract content',
        metadata: {
          extractedAt: new Date().toISOString(),
          originalUrl: url,
          wordCount: 0
        }
      };
    }
  }

  generateMarkdownContent(content: ExtractedContent): string {
    const { title, url, summary, problem, objective, actions, results, lessons, allText, metadata } = content;
    
    let markdown = `# ${title}\n\n`;
    
    // Metadata section
    markdown += `## Project Information\n\n`;
    markdown += `- **Original URL**: ${url}\n`;
    markdown += `- **Extracted**: ${new Date(metadata.extractedAt).toLocaleDateString()}\n`;
    markdown += `- **Word Count**: ${metadata.wordCount}\n\n`;
    
    // Summary
    if (summary && summary.trim()) {
      markdown += `## Summary\n\n${summary}\n\n`;
    }
    
    // STAR Sections
    const hasStarContent = problem || objective || actions || results || lessons;
    if (hasStarContent) {
      markdown += `## STAR Method Analysis\n\n`;
      
      if (problem) {
        markdown += `### Problem\n\n${problem}\n\n`;
      }
      
      if (objective) {
        markdown += `### Objective\n\n${objective}\n\n`;
      }
      
      if (actions) {
        markdown += `### Actions\n\n${actions}\n\n`;
      }
      
      if (results) {
        markdown += `### Results\n\n${results}\n\n`;
      }
      
      if (lessons) {
        markdown += `### Lessons\n\n${lessons}\n\n`;
      }
    }
    
    // Full Content
    markdown += `## Full Content\n\n${allText}\n\n`;
    
    // Footer
    markdown += `---\n\n`;
    markdown += `*This content was extracted from Squarespace on ${new Date(metadata.extractedAt).toLocaleString()}*\n`;
    
    return markdown;
  }

  async saveToFile(content: ExtractedContent): Promise<void> {
    const filename = `${this.sanitizeFilename(content.title)}.md`;
    const filePath = path.join(OUTPUT_DIR, filename);
    
    const markdownContent = this.generateMarkdownContent(content);
    
    try {
      fs.writeFileSync(filePath, markdownContent, 'utf8');
      console.log(`✅ Saved: ${filename}`);
    } catch (error: any) {
      console.error(`❌ Failed to save ${filename}:`, error.message);
    }
  }

  async run(): Promise<void> {
    console.log(`\n🚀 Starting content extraction for ${PROJECT_URLS.length} projects...`);
    
    const results: ExtractedContent[] = [];
    
    // Extract content from each project
    for (const url of PROJECT_URLS) {
      const content = await this.extractProjectContent(url);
      results.push(content);
      
      // Save to file
      await this.saveToFile(content);
      console.log(''); // Empty line for readability
    }

    // Generate summary
    this.generateSummary(results);
  }

  generateSummary(results: ExtractedContent[]): void {
    console.log('\n📊 Extraction Summary:');
    console.log('====================');
    
    let totalWords = 0;
    let successfulExtractions = 0;

    results.forEach(content => {
      totalWords += content.metadata.wordCount;
      if (content.metadata.wordCount > 0) successfulExtractions++;
      
      console.log(`📄 ${content.title}: ${content.metadata.wordCount} words`);
    });

    console.log(`\n✅ Successfully extracted: ${successfulExtractions}/${results.length} projects`);
    console.log(`📝 Total words extracted: ${totalWords.toLocaleString()}`);
    console.log(`📂 Files saved to: ${path.resolve(OUTPUT_DIR)}`);
    
    // Save master index
    this.saveMasterIndex(results);
  }

  saveMasterIndex(results: ExtractedContent[]): void {
    const indexContent = `# Squarespace Content Archive\n\n`;
    const indexMarkdown = results.map(content => 
      `- [${content.title}](${this.sanitizeFilename(content.title)}.md) - ${content.metadata.wordCount} words`
    ).join('\n');
    
    const fullIndex = indexContent + indexMarkdown + '\n\n';
    
    const indexPath = path.join(OUTPUT_DIR, 'README.md');
    fs.writeFileSync(indexPath, fullIndex, 'utf8');
    
    console.log(`📋 Master index saved: README.md`);
  }
}

async function main() {
  try {
    const extractor = new ContentExtractor();
    await extractor.initialize();
    await extractor.run();
    
    console.log('\n🎉 Content extraction completed!');
    console.log('\n💡 To convert to Word documents:');
    console.log('   1. Open each .md file in a markdown editor');
    console.log('   2. Export/convert to .docx format');
    console.log('   3. Or use online tools like pandoc: pandoc file.md -o file.docx');
  } catch (error) {
    console.error('💥 Extraction failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('extract-content')) {
  main();
}

export { ContentExtractor };













