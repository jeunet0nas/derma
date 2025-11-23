/**
 * Report Request/Response Schemas
 * Zod validation schemas for report endpoints
 */

import { z } from 'zod';
import { CommonSchemas } from '../middlewares/validation.middleware';

/**
 * Schema for webhook report request
 * POST /api/report/webhook
 */
export const WebhookReportRequestSchema = z.object({
  image: z
    .object({
      base64: CommonSchemas.base64Image,
      mimeType: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/, 'MIME type không hợp lệ'),
    })
    .optional(),
  analysis: z
    .object({
      skinType: z.string(),
      conditions: z.array(z.string()),
      severity: z.enum(['low', 'medium', 'high']),
      zones: z.array(
        z.object({
          name: z.string(),
          conditions: z.array(z.string()),
          severity: z.enum(['low', 'medium', 'high']),
        })
      ),
    })
    .optional(),
  email: CommonSchemas.email.optional(),
  phone: CommonSchemas.phone.optional(),
  webhookUrl: z.string().url('URL webhook không hợp lệ'),
  metadata: z.record(z.any()).optional(),
});

export type WebhookReportRequest = z.infer<typeof WebhookReportRequestSchema>;

/**
 * Schema for email confirmation message request
 * POST /api/report/email-confirm
 */
export const EmailConfirmRequestSchema = z.object({
  recipientEmail: CommonSchemas.email,
  recipientName: z.string().min(2, 'Tên người nhận phải có ít nhất 2 ký tự').max(100),
  reportData: z.object({
    skinType: z.string(),
    conditions: z.array(z.string()),
    severity: z.enum(['low', 'medium', 'high']),
    analysisDate: z.string().datetime('Định dạng thời gian không hợp lệ'),
    recommendations: z.array(z.string()).optional(),
  }),
  includeDetailedReport: z.boolean().default(true),
  language: z.enum(['vi', 'en']).default('vi'),
});

export type EmailConfirmRequest = z.infer<typeof EmailConfirmRequestSchema>;
