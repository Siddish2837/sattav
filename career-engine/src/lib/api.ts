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
 * Supports custom timeouts and basic retry logic for network-level failures.
 */
async function apiFetch<T>(
  url: string, 
  body: unknown, 
  options: { timeout?: number; retries?: number } = {}
): Promise<T> {
  const { timeout = 10000, retries = 0 } = options;
  
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const isFormData = body instanceof FormData;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? (body as FormData) : JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(id);

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json.success === false) {
        throw new ApiError(
          res.status, 
          json.error?.code ?? 'UNKNOWN', 
          json.error?.message ?? `HTTP ${res.status} Error`
        );
      }

      return json.data as T;

    } catch (err: any) {
      clearTimeout(id);
      lastError = err;
      
      // Only retry on network errors or timeouts, not on 4xx/5xx coded API errors
      if (err instanceof ApiError) throw err;
      
      if (i < retries) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
    }
  }

  if (lastError?.name === 'AbortError') {
    throw new ApiError(408, 'TIMEOUT', 'The request took too long. The server might be warming up.');
  }
  throw new ApiError(500, 'NETWORK_ERROR', lastError?.message || 'Failed to connect to the server.');
}

export type ParseResponse = {
  skills: string[];
  text: string;
  parsingInfo: {
    pages: number;
    metadata: any;
  };
};

export const parseResume = (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  return apiFetch<ParseResponse>(API_ENDPOINTS.upload, formData, { 
    timeout: 60000, // 60s timeout for heavy PDF parsing/cold starts
    retries: 1 
  });
};

export const analyzeCareer = (data: AnalyzeInput) =>
  apiFetch<AnalyzeResult>(API_ENDPOINTS.analyze, data);

export const getRecommendations = (data: RecommendInput) =>
  apiFetch<RecommendationResult[]>(API_ENDPOINTS.recommend, data);

