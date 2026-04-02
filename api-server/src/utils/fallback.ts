import type { CareerAnalysisResult } from '../logic/analysis';
import type { RecommendationResult } from '../controllers/recommendController';

/**
 * Graceful fallback responses used when the scoring logic throws unexpectedly.
 * In production: returned as a 200 with _fallback: true so the frontend
 * can show a "results may be limited" notice instead of a hard error screen.
 * In development: the real error is surfaced instead.
 */

export const FALLBACK_ANALYSIS: CareerAnalysisResult & { _fallback: true } = {
  matchScore: 0,
  survivalScore: 0,
  finalScore: 0,
  missingSkills: ['Analysis unavailable — please try again'],
  readinessTime: 'Unknown',
  difficulty: 'Moderate',
  recommendation:
    'We encountered an issue analysing your profile. Please refine your inputs and try again.',
  stressFit: 50,
  workHoursFit: 50,
  learningCurveFit: 50,
  _fallback: true,
};

export const FALLBACK_RECOMMENDATIONS: Array<RecommendationResult & { _fallback: true }> = [
  {
    careerId: 'software-engineer',
    title: 'Software Engineer',
    matchScore: 50,
    survivalScore: 50,
    finalScore: 50,
    missingSkills: ['Unable to compute — please refine your inputs'],
    readinessTime: 'Unknown',
    difficulty: 'Moderate',
    _fallback: true,
  },
];
