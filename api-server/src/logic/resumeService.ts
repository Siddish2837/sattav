import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { logger } from '../lib/logger';

const SKILLS_DB = [
  "python", "java", "c++", "javascript", "react", "node", "sql",
  "machine learning", "data analysis", "html", "css", "typescript",
  "docker", "kubernetes", "aws", "cloud", "security", "statistics"
];

const SKILL_MAP: Record<string, string> = {
  "js": "javascript",
  "ts": "typescript",
  "ml": "machine learning",
  "ai": "machine learning"
};

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SKILL_REGEX = new RegExp(`\\b(${SKILLS_DB.map(escapeRegex).join('|')}|${Object.keys(SKILL_MAP).map(escapeRegex).join('|')})\\b`, 'gi');

export interface ParseResult {
  skills: string[];
  text: string;
  pages: number;
  metadata: any;
}

export class ResumeService {
  /**
   * Parses PDF buffer and extracts skills.
   * Capped at 5 pages for performance.
   */
  async parseResume(buffer: Buffer): Promise<ParseResult> {
    const startTime = Date.now();
    
    try {
      // Limit to first 5 pages to avoid heavy CPU load
      const pdf = await pdfParse(buffer, { max: 5 });
      
      const text = pdf.text || '';
      const pages = pdf.numpages || 0;
      const metadata = pdf.info || {};

      if (!text.trim()) {
        throw new Error('PDF contains no readable text. It might be an image-only scan.');
      }

      const skills = this.extractSkills(text);
      
      const duration = Date.now() - startTime;
      logger.info({ 
        pages, 
        skillsCount: skills.length, 
        durationMs: duration,
        fileSize: buffer.length 
      }, 'Resume parsed successfully');

      return { skills, text, pages, metadata };
    } catch (error: any) {
      logger.error({ err: error.message }, 'Failed to parse resume PDF');
      throw error;
    }
  }

  private extractSkills(text: string): string[] {
    const normalizedText = text.toLowerCase();
    const matches = normalizedText.match(SKILL_REGEX) || [];
    const extracted = new Set<string>();

    matches.forEach(m => {
      const skill = m.toLowerCase();
      extracted.add(SKILL_MAP[skill] || skill);
    });

    return Array.from(extracted);
  }
}

export const resumeService = new ResumeService();
