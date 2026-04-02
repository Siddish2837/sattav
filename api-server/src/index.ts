// 1. Validate environment before doing ANYTHING else
import { validateEnv, config } from './utils/env';
validateEnv();

import app from './app';
import { logger } from './lib/logger';

app.listen(config.port, (err?: Error) => {
  if (err) {
    logger.error({ err }, 'Error listening on port');
    process.exit(1);
  }

  logger.info({ port: config.port, env: config.nodeEnv }, 'Server listening');
});