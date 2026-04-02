const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const API_ENDPOINTS = {
  analyze:    `${BASE_URL}/analyze`,
  recommend:  `${BASE_URL}/recommend`,
  health:     `${BASE_URL}/api/health`,
} as const;
