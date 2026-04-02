export type AnalyzeInput = {
  skills: string[];
  interests: string;
  careerGoal: string;
  careerId: string;
};

export type AnalyzeResult = {
  matchScore: number;
  survivalScore: number;
  missingSkills: string[];
  readinessTime: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  recommendation: string;
  stressFit: number;
  workHoursFit: number;
  learningCurveFit: number;
};

export type RecommendationResult = {
  careerId: string;
  title: string;
  matchScore: number;
  survivalScore: number;
  finalScore: number;
  missingSkills: string[];
  readinessTime: string;
  difficulty: "Easy" | "Moderate" | "Hard";
};

export async function analyzeCareer(data: AnalyzeInput): Promise<AnalyzeResult> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Analyze request failed with status ${response.status}`);
  }

  return (await response.json()) as AnalyzeResult;
}

export async function getRecommendations(data: Omit<AnalyzeInput, "careerId">): Promise<RecommendationResult[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Recommendation request failed with status ${response.status}`);
  }

  return (await response.json()) as RecommendationResult[];
}
