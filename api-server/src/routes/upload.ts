import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { parseResumeController } from '../controllers/resumeController';

const router = Router();

/**
 * Configure Multer for secure, memory-resident uploads.
 * Max file size: 2MB to ensure responsive parsing on Render.
 */
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { 
    fileSize: 2 * 1024 * 1024, // 2MB restriction
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('FORMAT_ERROR: Only PDF resumes are supported.'));
    }
    cb(null, true);
  }
});

/**
 * Middleware to handle Multer errors (like file size limit)
 */
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('resume')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          success: false, 
          error: { code: 'FILE_TOO_LARGE', message: 'Resume must be under 2MB.' } 
        });
      }
      return res.status(400).json({ 
        success: false, 
        error: { code: 'UPLOAD_ERROR', message: err.message } 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false, 
        error: { code: 'FORMAT_ERROR', message: err.message } 
      });
    }
    next();
  });
};

/**
 * STEP 1: Parse resume and extract skills.
 * We avoid full recommendation logic here to prevent blocking CPU/Network timeouts.
 */
router.post('/', uploadMiddleware, parseResumeController);

export default router;
