import { Router } from 'express';
import analyzeRouter from './analyze';
import recommendRouter from './recommend';
import uploadRouter from './upload';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
  });
});

// The routers include their own validation & rate limiting
router.use('/analyze', analyzeRouter);
router.use('/recommend', recommendRouter);
router.use('/upload-resume', uploadRouter);

export default router;
