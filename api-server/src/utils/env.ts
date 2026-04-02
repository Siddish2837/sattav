import 'dotenv/config';

const REQUIRED = ['PORT', 'NODE_ENV'] as const;

/**
 * Called once at process startup — crashes fast if any required env var is missing.
 * This ensures you never silently run with broken config.
 */
export function validateEnv(): void {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `[Startup] Missing required environment variables: ${missing.join(', ')}\n` +
      `Check your .env file (see .env.example for reference).`,
    );
  }
}

export const config = {
  port:     Number(process.env.PORT) || 5000,
  nodeEnv:  (process.env.NODE_ENV ?? 'development') as 'development' | 'production',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  isDev:    process.env.NODE_ENV !== 'production',
  frontendUrl: process.env.FRONTEND_URL ?? '*',
} as const;
