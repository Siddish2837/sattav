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

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: 'uploads/' });

const extractSkills = (text: string) => {
  const skillsDB = [
    "python", "java", "c++", "javascript", "react", "node", "sql",
    "machine learning", "data analysis", "html", "css", "typescript",
    "docker", "kubernetes", "aws", "cloud", "security", "statistics"
  ];
  const skillMap: Record<string, string> = {
    "js": "javascript",
    "ts": "typescript",
    "ml": "machine learning",
    "ai": "machine learning"
  };

  const normalizedText = text.toLowerCase();
  const extracted = new Set<string>();

  skillsDB.forEach(skill => {
    if (normalizedText.includes(skill)) extracted.add(skill);
  });

  // Check map
  Object.keys(skillMap).forEach(key => {
    if (normalizedText.split(/\W+/).includes(key)) {
      extracted.add(skillMap[key]);
    }
  });

  return Array.from(extracted);
};

const getRecommendations = ({ skills, interests, careerGoal }: { skills: string[], interests: string, careerGoal: string }) => {
  const scoredCareers = CAREERS.map(career => {
    const analysis = computeCareerAnalysis(career, skills, interests, careerGoal);
    const matchedSkills = career.requiredSkills.filter(s => 
      skills.some(userSkill => s.toLowerCase().includes(userSkill.toLowerCase()))
    );
    
    const reason = matchedSkills.length > 0 
      ? `Based on your proficiency in ${matchedSkills.slice(0, 3).join(", ")}, this role matches your profile.`
      : `This matches your interest in ${interests}, though some technical skill-up is recommended.`;

    return { 
      career: {
        ...career,
        id: career.id,
        title: career.title
      }, 
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
  const balanced = scoredCareers.find(c => c.career.type === "balanced" && (c.career as any).id !== (dream?.career as any).id) || scoredCareers[1];
  const safe = scoredCareers.find(c => c.career.type === "safe" && (c.career as any).id !== (dream?.career as any).id && (c.career as any).id !== (balanced?.career as any).id) || scoredCareers[2];

  return { safe, balanced, dream };
};

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No resume file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdf = await pdfParse(dataBuffer);

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    const skills = extractSkills(pdf.text);
    
    if (skills.length === 0) {
      return res.status(422).json({
        success: false,
        error: "Unable to extract meaningful technical skills from this resume. Please ensure it is a text-based PDF."
      });
    }

    // Connect to recommendation engine
    const recommendations = getRecommendations({
      skills,
      interests: "technology",   // default
      careerGoal: "growth"       // default
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
