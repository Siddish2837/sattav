/**
 * Career Match Score Calculator
 * Match = (skill × 0.5) + (interest × 0.3) + (goal × 0.2)
 */

export function calculateMatchScore({ skillScore, interestScore, goalScore }) {
  const match = skillScore * 0.5 + interestScore * 0.3 + goalScore * 0.2;
  return Math.min(100, Math.max(0, Math.round(match)));
}

/**
 * Compute skill score based on overlap between user skills and required skills
 */
export function computeSkillScore(userSkills: string[], requiredSkills: string[]) {
  if (!requiredSkills || requiredSkills.length === 0) return 50;
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const matched = requiredSkills.filter((s) =>
    userSkillsLower.includes(s.toLowerCase())
  );
  return Math.round((matched.length / requiredSkills.length) * 100);
}

/**
 * Compute interest score based on how well user interest aligns with career domain
 */
export function computeInterestScore(userInterest, careerDomain, careerKeywords) {
  if (!userInterest) return 40;
  const interestLower = userInterest.toLowerCase();
  const domainLower = (careerDomain || "").toLowerCase();

  if (interestLower.includes(domainLower) || domainLower.includes(interestLower)) {
    return 90;
  }

  const matchedKeywords = (careerKeywords || []).filter((kw) =>
    interestLower.includes(kw.toLowerCase())
  );
  const baseScore = 40 + matchedKeywords.length * 15;
  return Math.min(100, baseScore);
}

/**
 * Compute goal score based on alignment between user goal and career type
 */
export function computeGoalScore(userGoal, careerGoalKeywords) {
  if (!userGoal) return 40;
  const goalLower = userGoal.toLowerCase();
  const matched = (careerGoalKeywords || []).filter((kw) =>
    goalLower.includes(kw.toLowerCase())
  );
  const baseScore = 35 + matched.length * 20;
  return Math.min(100, baseScore);
}
