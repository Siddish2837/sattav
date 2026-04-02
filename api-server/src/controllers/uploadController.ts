import { Request, Response } from 'express';
import { uploadService } from '../logic/uploadService';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../lib/logger';

export const parseResumeController = async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) {
    return sendError(res, 'BAD_REQUEST', 'No resume file uploaded.', 400);
  }

  const uploadStartTime = (req as any)._resumeStartTime || Date.now();
  const parseStartTime = Date.now();
  
  try {
    const { skills, text, pages, metadata } = await uploadService.parseResume(req.file.buffer);
    const parseEndTime = Date.now();

    if (skills.length === 0) {
      return sendError(res, 'UNABLE_TO_PARSE', 'Unable to extract technical skills. Please ensure the PDF is text-readable.', 422);
    }

    const uploadTime = parseStartTime - uploadStartTime;
    const parseTime = parseEndTime - parseStartTime;

    logger.info({ 
      uploadTimeMs: uploadTime, 
      parseTimeMs: parseTime, 
      skillsCount: skills.length 
    }, 'Resume parsing request completed');

    return sendSuccess(res, {
      skills,
      text: text.slice(0, 1000), // Return snippet for preview
      parsingInfo: {
        pages,
        metadata,
        durations: {
          upload: uploadTime,
          parse: parseTime
        }
      }
    });

  } catch (error: any) {
    const duration = Date.now() - parseStartTime;
    logger.error({ error: error.message, duration }, 'Resume parsing controller failed');
    
    // Check if it's a known error like image-only PDF
    if (error.message.includes('image-only')) {
      return sendError(res, 'PARSE_ERROR', error.message, 422);
    }

    return sendError(res, 'SERVER_ERROR', 'Failed to process resume. Please try again later.', 500);
  }
};
