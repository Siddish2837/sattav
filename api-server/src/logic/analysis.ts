import {
  calculateMatchScore,
  computeSkillScore,
  computeInterestScore,
  computeGoalScore,
} from "./match";
import {
  computeSurvivalScore,
  getStressFit,
  getWorkHoursFit,
  getLearningCurveFit,
} from "./survival";
import { computeSkillGap } from "./skillGap";

export type CareerAnalysisResult = {
  matchScore: number;
  survivalScore: number;
  finalScore: number;
  missingSkills: string[];
  readinessTime: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  stressFit: number;
  workHoursFit: number;
  learningCurveFit: number;
  recommendation: string;
};

export type CareerData = {
  id: string;
  title: string;
  domain: string;
  keywords: string[];
  goalKeywords: string[];
  requiredSkills: string[];
  stressLevel: number;
  hoursPerWeek: number;
  learningCurve: string;
};

export function computeCareerAnalysis(
  career: CareerData,
  skills: string[],
  interests: string,
  careerGoal: string,
): CareerAnalysisResult {
  const skillScore = computeSkillScore(skills, career.requiredSkills);
  const interestScore = computeInterestScore(interests, career.domain, career.keywords);
  const goalScore = computeGoalScore(careerGoal, career.goalKeywords);
  const matchScore = calculateMatchScore({ skillScore, interestScore, goalScore });

  const stressFit = getStressFit(7, career.stressLevel);
  const workHoursFit = getWorkHoursFit(40, career.hoursPerWeek);
  const learningCurveFit = getLearningCurveFit(
    "moderate",
    career.learningCurve as "steep" | "moderate" | "gentle",
  );
  const survivalScore = computeSurvivalScore({ stressFit, workHoursFit, learningCurveFit });
  const finalScore = Math.round(matchScore * 0.6 + survivalScore * 0.4);

  const skillGap = computeSkillGap(skills, career.requiredSkills);
  const missingSkills = skillGap.missing;
  const missingCount = missingSkills.length;
  const readinessTime =
    missingCount <= 2
      ? "1-2 months"
      : missingCount <= 5
      ? "3-6 months"
      : "6+ months";
  const difficulty =
    survivalScore >= 70 ? "Easy" : survivalScore >= 40 ? "Moderate" : "Hard";

  const recommendation = matchScore >= 80
    ? "Your profile already aligns well. Keep building the skills you have and deepen your interest in this career path."
    : missingSkills.length > 0
    ? `Focus on developing ${missingSkills.slice(0, 3).join(", ")} and clarifying your goals to improve your match.`
    : "Refine your interest and career goal so your profile becomes more specific and actionable.";

  return {
    matchScore,
    survivalScore,
    finalScore,
    missingSkills,
    readinessTime,
    difficulty,
    stressFit,
    workHoursFit,
    learningCurveFit,
    recommendation,
  };
}
