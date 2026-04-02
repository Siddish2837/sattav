import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import router from './routes';
import { logger } from './lib/logger';
import { config } from './utils/env';
import { globalLimiter } from './middlewares/rateLimit';

const app: Express = express();

// --- Security & Basics ---
app.use(helmet());
app.use(
  cors({
    origin: config.isDev ? '*' : config.frontendUrl,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging ---
app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url?.split('?')[0],
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);

// --- Rate Limiting ---
app.use(globalLimiter);

// --- Routes ---
// Legacy mounting so /analyze and /api/analyze both work if needed,
// but all structured nicely in the routes folder.
app.use('/', router);
app.use('/api', router);

export default app;
