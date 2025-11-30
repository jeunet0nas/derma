/**
 * Analysis Request/Response Schemas
 * Zod validation schemas for analysis endpoints
 */

import { z } from 'zod';
import { CommonSchemas } from '../middlewares/validation.middleware';

/**
 * Schema for skin image analysis request
 * POST /api/analysis/skin
 */
export const AnalyzeSkinRequestSchema = z.object({
  image: CommonSchemas.base64Image,
  includeExpertInfo: z.boolean().optional().default(false),
});

export type AnalyzeSkinRequest = z.infer<typeof AnalyzeSkinRequestSchema>;

/**
 * Schema for heatmap generation request
 * POST /api/analysis/heatmap
 */
export const GenerateHeatmapRequestSchema = z.object({
  image: CommonSchemas.base64Image,
  skinType: z
    .enum(['dầu (oily)', 'khô (dry)', 'nhạy cảm (sensitive)', 'hỗn hợp (combination)'])
    .optional()
    .nullable(),
  zones: z.array(
    z.object({
      zone: z.string(),
      condition: z.string(),
      riskLevel: z.enum(['Low', 'Medium', 'High']),
    })
  ),
});

export type GenerateHeatmapRequest = z.infer<typeof GenerateHeatmapRequestSchema>;
