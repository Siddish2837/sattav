import { Request, Response } from 'express';
import { getCareerById } from '../data/careers';
import { computeCareerAnalysis } from '../logic/analysis';
import { sendSuccess, sendError } from '../utils/response';
import { getCached, setCached, makeCacheKey } from '../utils/cache';
import { FALLBACK_ANALYSIS } from '../utils/fallback';
import { logger } from '../lib/logger';
import type { AnalyzeInput } from '../schemas/analyzeSchema';
import type { CareerAnalysisResult } from '../logic/analysis';

export async function analyzeController(req: Request, res: Response) {
  const { careerId, skills, interests, careerGoal } = req.body as AnalyzeInput;

  const career = getCareerById(careerId);
  if (!career) {
    return sendError(res, 'CAREER_NOT_FOUND', `Career not found for id '${careerId}'.`, 400);
  }

  const cacheKey = makeCacheKey({ careerId, skills, interests, careerGoal });
  const cached = getCached<CareerAnalysisResult>(cacheKey);
  if (cached) {
    logger.debug({ cacheKey }, 'Cache hit: analysis');
    return sendSuccess(res, cached);
  }

  try {
    const result = computeCareerAnalysis(career, skills, interests, careerGoal);
    setCached(cacheKey, result);
    logger.debug({ careerId, matchScore: result.matchScore }, 'Analysis complete');
    return sendSuccess(res, result);
  } catch (err) {
    logger.error({ err, input: req.body }, 'analyzeController: scoring failed');

    // Dev: surface real error. Prod: degrade gracefully.
    if (process.env.NODE_ENV !== 'production') {
      return sendError(res, 'ANALYSIS_FAILED', String(err), 500);
    }
    return sendSuccess(res, FALLBACK_ANALYSIS);
  }
}
