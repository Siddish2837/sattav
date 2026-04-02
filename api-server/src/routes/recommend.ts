import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { analysisLimiter } from '../middlewares/rateLimit';
import { RecommendSchema } from '../schemas/analyzeSchema';
import { recommendController } from '../controllers/recommendController';

const router = Router();

router.post('/', analysisLimiter, validate(RecommendSchema), recommendController);

export default router;
