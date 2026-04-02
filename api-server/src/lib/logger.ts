import pino from 'pino';
import { config } from '../utils/env';

export const logger = pino({
  level: config.logLevel,
  transport: config.isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'HH:MM:ss Z',
        },
      }
    : undefined,
  base: { service: 'career-api', env: config.nodeEnv },
});
