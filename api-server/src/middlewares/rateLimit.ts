import rateLimit from 'express-rate-limit';

const rateLimitError = (msg: string) => ({
  success: false,
  error: { code: 'RATE_LIMITED', message: msg, statusCode: 429 },
});

/**
 * Global API limiter: 100 requests per IP per 15 minutes.
 * Protects all routes from general abuse.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitError('Too many requests. Please try again in 15 minutes.'),
});

/**
 * Analysis limiter: 20 requests per IP per minute.
 * Tighter limit on compute-heavy scoring endpoints.
 */
export const analysisLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitError('Analysis rate limit reached. Please wait a moment before trying again.'),
});
