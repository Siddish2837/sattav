import { Router, type Request, type Response } from 'express';
import { validate } from '../middlewares/validate';
import { analysisLimiter } from '../middlewares/rateLimit';
import { AnalyzeSchema } from '../schemas/analyzeSchema';
import { analyzeController } from '../controllers/analyzeController';

const router = Router();

router.post('/', analysisLimiter, validate(AnalyzeSchema), analyzeController);

export default router;
