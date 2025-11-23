/**
 * Skincare Request/Response Schemas
 * Zod validation schemas for skincare endpoints
 */

import { z } from 'zod';

/**
 * Schema for skincare direction request
 * POST /api/skincare/direction
 */
export const SkincareDirectionRequestSchema = z.object({
  skinType: z.string().min(1, 'Loại da không được để trống'),
  conditions: z.array(z.string()).min(1, 'Cần ít nhất 1 tình trạng da'),
  goals: z.array(z.string()).min(1, 'Cần ít nhất 1 mục tiêu chăm sóc'),
});

export type SkincareDirectionRequest = z.infer<typeof SkincareDirectionRequestSchema>;

/**
 * Schema for personalized routine request
 * POST /api/skincare/routine
 */
export const PersonalizedRoutineRequestSchema = z.object({
  skinType: z.string().min(1, 'Loại da không được để trống'),
  skinConditions: z.array(z.string()).min(1, 'Cần ít nhất 1 tình trạng da'),
  environment: z.string().min(1, 'Môi trường sống không được để trống'),
  currentProducts: z.string().optional(),
  goals: z.array(z.string()).min(1, 'Cần ít nhất 1 mục tiêu'),
  budget: z.enum(['low', 'medium', 'high']).optional(),
  skinSensitivity: z.enum(['low', 'medium', 'high']).optional(),
});

export type PersonalizedRoutineRequest = z.infer<typeof PersonalizedRoutineRequestSchema>;

/**
 * Schema for coaching advice request
 * POST /api/skincare/coaching
 */
export const CoachingAdviceRequestSchema = z.object({
  analysis: z.object({
    skinType: z
      .enum(['dầu (oily)', 'khô (dry)', 'nhạy cảm (sensitive)', 'hỗn hợp (combination)'])
      .nullable(),
    overallSummary: z.string(),
    zones: z.array(
      z.object({
        zone: z.string(),
        condition: z.string(),
        riskLevel: z.enum(['Low', 'Medium', 'High']),
      })
    ),
    recommendations: z.array(z.string()),
  }),
  userContext: z
    .object({
      age: z.number().min(13).max(100).optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      lifestyle: z.string().optional(),
    })
    .optional(),
});

export type CoachingAdviceRequest = z.infer<typeof CoachingAdviceRequestSchema>;
