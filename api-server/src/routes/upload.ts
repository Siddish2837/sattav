import { Router } from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import fs from 'fs';
import path from 'path';
import { sendError, sendSuccess } from '../utils/response';
import { CAREERS } from '../data/careers';
import { computeCareerAnalysis } from '../logic/analysis';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit for speed

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

// Pre-compile regex for O(n) extraction
const SKILL_REGEX = new RegExp(`\\b(${SKILLS_DB.join('|')}|${Object.keys(SKILL_MAP).join('|')})\\b`, 'gi');

const extractSkills = (text: string) => {
  const normalizedText = text.toLowerCase();
  const matches = normalizedText.match(SKILL_REGEX) || [];
  const extracted = new Set<string>();

  matches.forEach(m => {
    const skill = m.toLowerCase();
    extracted.add(SKILL_MAP[skill] || skill);
  });

  return Array.from(extracted);
};

const getRecommendations = ({ skills, interests, careerGoal }: { skills: string[], interests: string, careerGoal: string }) => {
  // Use a slightly faster mapping by avoiding deep copies during scoring
  const scoredCareers = CAREERS.map(career => {
    const analysis = computeCareerAnalysis(career, skills, interests, careerGoal);
    
    // Inline small helper to avoid nested closure overhead
    const matchedSkills = career.requiredSkills.filter(s => {
      const lowerS = s.toLowerCase();
      return skills.some(us => lowerS.includes(us));
    });
    
    const reason = matchedSkills.length > 0 
      ? `Matches your ${matchedSkills.slice(0, 2).join(", ")} skills.`
      : `Matches your interest in ${interests}.`;

    return { 
      career: { id: career.id, title: career.title, type: career.type }, 
      score: analysis.finalScore,
      reason,
      matchedSkills,
      missingSkills: analysis.missingSkills.slice(0, 3),
      readinessTime: analysis.readinessTime,
      difficulty: analysis.difficulty,
      matchScore: analysis.matchScore,
      survivalScore: analysis.survivalScore,
      finalScore: analysis.finalScore
    };
  }).sort((a, b) => b.score - a.score);

  const dream = scoredCareers.find(c => c.career.type === "dream") || scoredCareers[0];
  const balanced = scoredCareers.find(c => c.career.type === "balanced" && c.career.id !== dream?.career.id) || scoredCareers[1];
  const safe = scoredCareers.find(c => c.career.type === "safe" && c.career.id !== dream?.career.id && c.career.id !== balanced?.career.id) || scoredCareers[2];

  return { safe, balanced, dream };
};

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No resume file uploaded' });
    }

    // Direct buffer parse (No Disk I/O)
    const pdf = await pdfParse(req.file.buffer);
    const skills = extractSkills(pdf.text);
    
    if (skills.length === 0) {
      return res.status(422).json({
        success: false,
        error: "Unable to extract skills. Please use a text-based PDF."
      });
    }

    const recommendations = getRecommendations({
      skills,
      interests: "technology",
      careerGoal: "growth"
    });

    return res.json({
      success: true,
      skills,
      recommendations
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Failed to parse resume pdf' });
  }
});

export default router;
