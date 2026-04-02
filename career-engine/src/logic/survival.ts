/**
 * Survival Analysis
 * Evaluates how well a user will "survive" in a career based on:
 * - Stress fit
 * - Work hours fit
 * - Learning curve
 */

export function computeSurvivalScore({ stressFit, workHoursFit, learningCurveFit }) {
  const score = stressFit * 0.35 + workHoursFit * 0.35 + learningCurveFit * 0.3;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getStressFit(userStressTolerance, careerStressLevel) {
  // userStressTolerance: 1-10 (user-provided or inferred)
  // careerStressLevel: 1-10 (from career data)
  const diff = userStressTolerance - careerStressLevel;
  if (diff >= 3) return 95;
  if (diff >= 1) return 80;
  if (diff === 0) return 65;
  if (diff === -1) return 45;
  if (diff <= -2) return 25;
  return 50;
}

export function getWorkHoursFit(preferredHours, careerHours) {
  // Both in hours per week
  const diff = Math.abs(preferredHours - careerHours);
  if (diff <= 5) return 95;
  if (diff <= 10) return 75;
  if (diff <= 15) return 55;
  if (diff <= 20) return 35;
  return 20;
}

export function getLearningCurveFit(userLearningPace, careerLearningCurve) {
  // userLearningPace: "fast" | "moderate" | "slow"
  // careerLearningCurve: "steep" | "moderate" | "gentle"
  const matrix = {
    fast: { steep: 90, moderate: 80, gentle: 70 },
    moderate: { steep: 55, moderate: 85, gentle: 80 },
    slow: { steep: 30, moderate: 60, gentle: 90 },
  };
  return matrix[userLearningPace]?.[careerLearningCurve] ?? 60;
}

export function getSurvivalLabel(score: number) {
  if (score >= 75) return { label: "High Survival", color: "green", risk: "Low" };
  if (score >= 50) return { label: "Moderate Survival", color: "yellow", risk: "Moderate" };
  return { label: "Challenging Fit", color: "red", risk: "High" };
}

export function getRiskMessage(score: number, careerTitle: string) {
  if (score >= 75) {
    return `You're well-suited for ${careerTitle}. Your profile aligns strongly with what this career demands.`;
  }
  if (score >= 50) {
    return `${careerTitle} is achievable with some adjustments. Focus on stress management and upskilling.`;
  }
  return `${careerTitle} may be a tough fit right now. Consider building resilience and foundational skills first.`;
}
