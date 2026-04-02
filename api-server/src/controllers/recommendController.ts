import { Request, Response } from 'express';
import { CAREERS } from '../data/careers';
import { computeCareerAnalysis } from '../logic/analysis';
import { sendSuccess, sendError } from '../utils/response';
import { getCached, setCached, makeCacheKey } from '../utils/cache';
import { FALLBACK_RECOMMENDATIONS } from '../utils/fallback';
import { logger } from '../lib/logger';
import type { RecommendInput } from '../schemas/analyzeSchema';

export type RecommendationResult = {
  careerId: string;
  title: string;
  matchScore: number;
  survivalScore: number;
  finalScore: number;
  missingSkills: string[];
  readinessTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
};

export async function recommendController(req: Request, res: Response) {
  const { skills, interests, careerGoal } = req.body as RecommendInput;

  const cacheKey = makeCacheKey({ skills, interests, careerGoal });
  const cached = getCached<RecommendationResult[]>(cacheKey);
  if (cached) {
    logger.debug({ cacheKey }, 'Cache hit: recommendations');
    return sendSuccess(res, cached);
  }

  try {
    const scores: RecommendationResult[] = CAREERS.map((career) => {
      const analysis = computeCareerAnalysis(career, skills, interests, careerGoal);
      const matchedSkills = career.requiredSkills.filter(s => skills.some(userSkill => s.toLowerCase().includes(userSkill.toLowerCase())));
      const reason = matchedSkills.length > 0 
        ? `Based on your skills in ${matchedSkills.join(", ")}, this role aligns well with your profile.`
        : `While you don't have the exact technical foundation directly mapped yet, your profile indicates potential here based on interest/goals.`;

      return {
        careerId:      career.id,
        title:         career.title,
        matchScore:    analysis.matchScore,
        survivalScore: analysis.survivalScore,
        finalScore:    analysis.finalScore,
        missingSkills: analysis.missingSkills.slice(0, 3),
        matchedSkills,
        reason,
        readinessTime: analysis.readinessTime,
        difficulty:    analysis.difficulty,
      };
    });

    const topCareers = scores
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);

    setCached(cacheKey, topCareers);
    logger.info({ count: topCareers.length, top: topCareers[0]?.title }, 'Recommendations generated');
    return sendSuccess(res, topCareers);
  } catch (err) {
    logger.error({ err, input: req.body }, 'recommendController: scoring failed');

    if (process.env.NODE_ENV !== 'production') {
      return sendError(res, 'RECOMMENDATION_FAILED', String(err), 500);
    }
    return sendSuccess(res, FALLBACK_RECOMMENDATIONS);
  }
}
