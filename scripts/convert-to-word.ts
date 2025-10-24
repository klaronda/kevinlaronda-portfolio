#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const EXTRACTED_DIR = './extracted-content';
const WORD_DIR = './word-documents';

class WordConverter {
  constructor() {
    console.log('📄 Markdown to Word Converter');
    console.log(`📁 Input directory: ${path.resolve(EXTRACTED_DIR)}`);
    console.log(`📁 Output directory: ${path.resolve(WORD_DIR)}`);
  }

  async initialize() {
    // Create Word documents directory
    if (!fs.existsSync(WORD_DIR)) {
      fs.mkdirSync(WORD_DIR, { recursive: true });
      console.log(`✅ Created Word documents directory: ${WORD_DIR}`);
    }
  }

  checkPandocAvailable(): boolean {
    try {
      execSync('pandoc --version', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async convertWithPandoc(markdownFile: string, outputFile: string): Promise<boolean> {
    try {
      const command = `pandoc "${markdownFile}" -o "${outputFile}" --reference-doc="${path.join(__dirname, 'template.docx')}"`;
      execSync(command, { stdio: 'pipe' });
      return true;
    } catch (error) {
      try {
        // Fallback without template
        const command = `pandoc "${markdownFile}" -o "${outputFile}"`;
        execSync(command, { stdio: 'pipe' });
        return true;
      } catch (fallbackError) {
        return false;
      }
    }
  }

  generateConversionInstructions(): string {
    return `
# Converting Markdown to Word Documents

## Option 1: Using Pandoc (Recommended)
If you have pandoc installed:

\`\`\`bash
cd ${path.resolve(EXTRACTED_DIR)}
for file in *.md; do
  pandoc "\\$file" -o "../${WORD_DIR}/\\${file%.md}.docx"
done
\`\`\`

## Option 2: Online Converters
1. Visit https://pandoc.org/try/ or https://markdown-to-word.com/
2. Upload each .md file
3. Download the converted .docx file

## Option 3: Using VS Code
1. Install "Markdown PDF" extension in VS Code
2. Open each .md file
3. Use Ctrl+Shift+P → "Markdown PDF: Export (docx)"

## Option 4: Manual Copy-Paste
1. Open each .md file in a text editor
2. Copy the content
3. Paste into Microsoft Word
4. Apply formatting as needed

## Files to Convert:
${fs.readdirSync(EXTRACTED_DIR)
  .filter((file: string) => file.endsWith('.md'))
  .map((file: string) => `- ${file}`)
  .join('\n')}
`;
  }

  async run(): Promise<void> {
    await this.initialize();

    const markdownFiles = fs.readdirSync(EXTRACTED_DIR)
      .filter(file => file.endsWith('.md') && file !== 'README.md');

    console.log(`\n🚀 Converting ${markdownFiles.length} markdown files to Word documents...`);

    if (this.checkPandocAvailable()) {
      console.log('✅ Pandoc is available - converting automatically...');
      
      let successCount = 0;
      for (const markdownFile of markdownFiles) {
        const inputPath = path.join(EXTRACTED_DIR, markdownFile);
        const outputFile = markdownFile.replace('.md', '.docx');
        const outputPath = path.join(WORD_DIR, outputFile);

        console.log(`📄 Converting: ${markdownFile}`);
        
        const success = await this.convertWithPandoc(inputPath, outputPath);
        if (success) {
          console.log(`✅ Created: ${outputFile}`);
          successCount++;
        } else {
          console.log(`❌ Failed: ${markdownFile}`);
        }
      }

      console.log(`\n📊 Conversion Summary:`);
      console.log(`✅ Successfully converted: ${successCount}/${markdownFiles.length} files`);
      console.log(`📂 Word documents saved to: ${path.resolve(WORD_DIR)}`);
    } else {
      console.log('⚠️  Pandoc not found - generating conversion instructions...');
      
      const instructions = this.generateConversionInstructions();
      const instructionsPath = path.join(WORD_DIR, 'CONVERSION_INSTRUCTIONS.md');
      
      fs.writeFileSync(instructionsPath, instructions);
      console.log(`📋 Instructions saved to: ${instructionsPath}`);
      
      console.log('\n💡 Manual conversion required:');
      console.log('   1. Install pandoc: brew install pandoc (macOS) or apt install pandoc (Ubuntu)');
      console.log('   2. Or use online converters like pandoc.org/try/');
      console.log('   3. Or copy-paste content from .md files to Word manually');
    }
  }
}

async function main() {
  try {
    const converter = new WordConverter();
    await converter.run();
    
    console.log('\n🎉 Conversion process completed!');
  } catch (error) {
    console.error('💥 Conversion failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('convert-to-word')) {
  main();
}

export { WordConverter };
