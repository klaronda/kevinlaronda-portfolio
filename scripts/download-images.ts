#!/usr/bin/env node

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// Configuration
const SQUARESPACE_URL = 'https://www.kevinlaronda.com';
const DOWNLOAD_DIR = './downloaded-images';

// Project URLs to download images from
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
  'https://www.kevinlaronda.com/were-all-a-little-nuts',
  'https://www.kevinlaronda.com/stone-wheels',
  'https://www.kevinlaronda.com/moet',
  'https://www.kevinlaronda.com/huluwestworld',
  'https://www.kevinlaronda.com/hulu-documentaries'
];

interface ProjectImages {
  title: string;
  url: string;
  images: string[];
  folderName: string;
}

class ImageDownloader {
  private session: any;

  constructor() {
    console.log('🖼️  Squarespace Image Downloader Initialized');
    console.log(`📁 Download directory: ${path.resolve(DOWNLOAD_DIR)}`);
  }

  async initialize() {
    // Create axios session
    this.session = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    // Create download directory
    if (!fs.existsSync(DOWNLOAD_DIR)) {
      fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
      console.log(`✅ Created download directory: ${DOWNLOAD_DIR}`);
    }
  }

  sanitizeFolderName(title: string): string {
    // Remove special characters and limit length
    return title
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .substring(0, 50); // Limit to 50 characters
  }

  async extractProjectInfo(url: string): Promise<ProjectImages> {
    try {
      console.log(`📄 Extracting images from: ${url}`);
      
      const response = await this.session.get(url);
      const $ = cheerio.load(response.data);
      
      // Extract title
      const title = $('h1').first().text().trim() || 
                   $('title').text().replace(' - Kevin Laronda', '').replace(' — Kevin Laronda | Writer', '').trim() ||
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

      // Remove duplicates
      const uniqueImages = [...new Set(images)];

      const folderName = this.sanitizeFolderName(title);
      
      console.log(`📝 Title: ${title}`);
      console.log(`🖼️  Found ${uniqueImages.length} images`);
      
      return {
        title,
        url,
        images: uniqueImages,
        folderName
      };
    } catch (error: any) {
      console.error(`❌ Failed to extract from ${url}:`, error.message);
      return {
        title: 'Error',
        url,
        images: [],
        folderName: 'error'
      };
    }
  }

  async downloadImage(imageUrl: string, projectFolder: string, imageIndex: number): Promise<string | null> {
    try {
      // Get file extension from URL or default to jpg
      const urlPath = new URL(imageUrl).pathname;
      const extension = path.extname(urlPath) || '.jpg';
      
      // Create filename
      const filename = `image-${imageIndex + 1}${extension}`;
      const filePath = path.join(DOWNLOAD_DIR, projectFolder, filename);

      console.log(`  📥 Downloading: ${filename}`);
      
      const response = await this.session.get(imageUrl, { responseType: 'stream' });
      
      // Create write stream
      const writer = fs.createWriteStream(filePath);
      
      // Pipe response to file
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`  ✅ Downloaded: ${filename}`);
          resolve(filePath);
        });
        writer.on('error', (error) => {
          console.error(`  ❌ Failed to save: ${filename}`, error.message);
          reject(error);
        });
      });
    } catch (error: any) {
      console.error(`  ❌ Failed to download image:`, error.message);
      return null;
    }
  }

  async downloadProjectImages(project: ProjectImages): Promise<void> {
    if (project.images.length === 0) {
      console.log(`⚠️  No images found for: ${project.title}`);
      return;
    }

    // Create project folder
    const projectFolder = project.folderName;
    const projectPath = path.join(DOWNLOAD_DIR, projectFolder);
    
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    console.log(`📁 Created folder: ${projectFolder}`);

    // Download each image
    let successCount = 0;
    for (let i = 0; i < project.images.length; i++) {
      const imageUrl = project.images[i];
      const result = await this.downloadImage(imageUrl, projectFolder, i);
      if (result) successCount++;
    }

    console.log(`✅ Downloaded ${successCount}/${project.images.length} images for: ${project.title}`);
  }

  async run(): Promise<void> {
    console.log(`\n🚀 Starting image download for ${PROJECT_URLS.length} projects...`);
    
    const results: ProjectImages[] = [];
    
    // Extract project info
    for (const url of PROJECT_URLS) {
      const project = await this.extractProjectInfo(url);
      results.push(project);
    }

    // Download images for each project
    console.log(`\n📥 Starting downloads...`);
    for (const project of results) {
      await this.downloadProjectImages(project);
      console.log(''); // Empty line for readability
    }

    // Generate summary
    this.generateSummary(results);
  }

  generateSummary(results: ProjectImages[]): void {
    console.log('\n📊 Download Summary:');
    console.log('==================');
    
    let totalImages = 0;
    let successfulProjects = 0;

    results.forEach(project => {
      const imageCount = project.images.length;
      totalImages += imageCount;
      if (imageCount > 0) successfulProjects++;
      
      console.log(`📁 ${project.folderName}: ${imageCount} images`);
    });

    console.log(`\n✅ Successfully processed: ${successfulProjects}/${results.length} projects`);
    console.log(`🖼️  Total images found: ${totalImages}`);
    console.log(`📂 Images saved to: ${path.resolve(DOWNLOAD_DIR)}`);
  }
}

async function main() {
  try {
    const downloader = new ImageDownloader();
    await downloader.initialize();
    await downloader.run();
    
    console.log('\n🎉 Image download completed!');
  } catch (error) {
    console.error('💥 Download failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('download-images')) {
  main();
}

export { ImageDownloader };













