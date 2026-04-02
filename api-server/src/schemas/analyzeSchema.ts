import { z } from 'zod';

// Strip HTML tags and trim whitespace from any string input
const sanitizeStr = (s: string) => s.replace(/<[^>]*>/g, '').trim();

export const AnalyzeSchema = z.object({
  careerId:   z.string().min(1, 'careerId is required').max(100).transform(sanitizeStr),
  skills:     z.array(z.string().max(50).transform(sanitizeStr)).max(30).default([]),
  interests:  z.string().max(500).transform(sanitizeStr).default(''),
  careerGoal: z.string().max(500).transform(sanitizeStr).default(''),
});

export const RecommendSchema = z.object({
  skills:     z.array(z.string().max(50).transform(sanitizeStr)).max(30).default([]),
  interests:  z.string().max(500).transform(sanitizeStr).default(''),
  careerGoal: z.string().max(500).transform(sanitizeStr).default(''),
});

export type AnalyzeInput   = z.infer<typeof AnalyzeSchema>;
export type RecommendInput = z.infer<typeof RecommendSchema>;
