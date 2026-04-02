import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Reusable Zod validation middleware factory.
 * Usage: router.post('/analyze', validate(AnalyzeSchema), controller)
 *
 * On failure: returns { success: false, error: { code: "INVALID_INPUT", ... } }
 * On success: replaces req.body with the sanitized + defaulted Zod output
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors
        .map((e: any) => `${e.path.join('.') || 'body'}: ${e.message}`)
        .join('; ');
      return sendError(res, 'INVALID_INPUT', message, 400);
    }
    req.body = result.data;
    next();
  };
}
