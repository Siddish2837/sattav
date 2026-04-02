import { Request, Response } from 'express';
import { resumeService } from '../logic/resumeService';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../lib/logger';

export const parseResumeController = async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) {
    return sendError(res, 'BAD_REQUEST', 'No resume file uploaded.', 400);
  }

  const startTime = Date.now();
  
  try {
    const { skills, text, pages, metadata } = await resumeService.parseResume(req.file.buffer);

    if (skills.length === 0) {
      return sendError(res, 'UNABLE_TO_PARSE', 'Unable to extract technical skills. Please ensure the PDF is text-readable.', 422);
    }

    const duration = Date.now() - startTime;
    logger.info({ duration, skillsCount: skills.length }, 'Resume parsing request completed');

    return sendSuccess(res, {
      skills,
      text: text.slice(0, 1000), // Return snippet for preview
      parsingInfo: {
        pages,
        metadata
      }
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error({ error: error.message, duration }, 'Resume parsing controller failed');
    
    // Check if it's a known error like image-only PDF
    if (error.message.includes('image-only')) {
      return sendError(res, 'PARSE_ERROR', error.message, 422);
    }

    return sendError(res, 'SERVER_ERROR', 'Failed to process resume. Please try again later.', 500);
  }
};
