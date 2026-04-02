import { Response } from 'express';

/**
 * Unified success response envelope.
 * Shape: { success: true, data: T }
 */
export function sendSuccess<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

/**
 * Unified error response envelope.
 * Shape: { success: false, error: { code, message, statusCode } }
 */
export function sendError(
  res: Response,
  code: string,
  message: string,
  status = 400,
): Response {
  return res.status(status).json({
    success: false,
    error: { code, message, statusCode: status },
  });
}
