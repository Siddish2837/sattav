import { API_ENDPOINTS } from '@/services/apiConfig';

export type AnalyzeInput = {
  skills: string[];
  interests: string;
  careerGoal: string;
  careerId: string;
};

export type AnalyzeResult = {
  matchScore: number;
  survivalScore: number;
  finalScore: number;
  missingSkills: string[];
  readinessTime: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  recommendation: string;
  stressFit: number;
  workHoursFit: number;
  learningCurveFit: number;
  _fallback?: boolean; // defined if fallback mode
};

export type RecommendInput = Omit<AnalyzeInput, 'careerId'>;

export type RecommendationResult = {
  careerId: string;
  title: string;
  matchScore: number;
  survivalScore: number;
  finalScore: number;
  missingSkills: string[];
  matchedSkills?: string[];
  reason?: string;
  readinessTime: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  _fallback?: boolean;
};

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic Fetch Helper for standardized backend responses.
 */
async function apiFetch<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(id);

    // Expecting { success: boolean, data?: T, error?: { code, message, statusCode } }
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false) {
      throw new ApiError(
        res.status, 
        json.error?.code ?? 'UNKNOWN', 
        json.error?.message ?? `HTTP ${res.status} Error`
      );
    }

    return json.data as T;

  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(408, 'TIMEOUT', 'The request took too long.');
    }
    throw new ApiError(500, 'NETWORK_ERROR', 'Failed to connect to the server.');
  }
}

export const analyzeCareer = (data: AnalyzeInput) =>
  apiFetch<AnalyzeResult>(API_ENDPOINTS.analyze, data);

export const getRecommendations = (data: RecommendInput) =>
  apiFetch<RecommendationResult[]>(API_ENDPOINTS.recommend, data);
