/**
 * Report Routes
 * Defines API endpoints for report generation and delivery
 */

import { Router } from 'express';
import { sendToWebhook, generateEmailConfirm } from '../controllers/report.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { reportRateLimit } from '../middlewares/rateLimit.middleware';
import { WebhookReportRequestSchema, EmailConfirmRequestSchema } from '../schemas/report.schemas';

const router = Router();

/**
 * POST /api/report/webhook
 * Send analysis report to webhook (Make.com, Zapier, etc.)
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate (track userId)
 * - reportRateLimit: 5 requests/minute per user/IP
 * - validateBody: Validate with WebhookReportRequestSchema
 *
 * Request:
 * {
 *   "webhookUrl": "https://hook.make.com/abc123",
 *   "image": {
 *     "base64": "data:image/jpeg;base64,...",
 *     "mimeType": "image/jpeg"
 *   },
 *   "analysis": {
 *     "skinType": "Dầu",
 *     "conditions": ["Mụn đầu đen", "Lỗ chân lông to"],
 *     "severity": "medium",
 *     "zones": [
 *       {
 *         "name": "Vùng T",
 *         "conditions": ["Mụn đầu đen"],
 *         "severity": "high"
 *       }
 *     ]
 *   },
 *   "email": "user@example.com",
 *   "phone": "+84901234567",
 *   "metadata": {
 *     "source": "mobile-app",
 *     "version": "1.0.0"
 *   }
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "webhookId": "req_abc123",
 *     "status": "sent",
 *     "webhookResponse": {
 *       "status": 200,
 *       "message": "Webhook received successfully"
 *     }
 *   }
 * }
 *
 * Use case:
 * - Integration với Make.com (automation workflows)
 * - Send data to CRM (HubSpot, Salesforce)
 * - Trigger email marketing campaigns
 * - Store analysis in external database
 * - Sync with e-commerce platforms
 *
 * Webhook payload sent:
 * {
 *   "timestamp": "2025-11-22T10:30:00Z",
 *   "userId": "user123",
 *   "requestId": "req_abc123",
 *   "image": "base64...",
 *   "imageMimeType": "image/jpeg",
 *   "analysis": { ... },
 *   "contact": { email, phone },
 *   "metadata": { ... }
 * }
 *
 * Security:
 * - Rate limited (5/min) - prevents spam
 * - Webhook URL must be HTTPS
 * - Optional authentication
 * - No sensitive data exposure
 */
router.post(
  '/webhook',
  optionalAuth,
  reportRateLimit,
  validateBody(WebhookReportRequestSchema),
  sendToWebhook
);

/**
 * POST /api/report/email-confirm
 * Generate email confirmation message for skin analysis report
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate
 * - reportRateLimit: 5 requests/minute
 * - validateBody: Validate with EmailConfirmRequestSchema
 *
 * Request:
 * {
 *   "recipientEmail": "user@example.com",
 *   "recipientName": "Nguyễn Văn A",
 *   "reportData": {
 *     "skinType": "Dầu",
 *     "conditions": ["Mụn đầu đen", "Lỗ chân lông to"],
 *     "severity": "medium",
 *     "analysisDate": "2025-11-22T10:30:00Z",
 *     "recommendations": [
 *       "Sử dụng BHA 2% hàng ngày",
 *       "Tránh dầu mineral trong skincare"
 *     ]
 *   },
 *   "includeDetailedReport": true,
 *   "language": "vi"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "emailId": "req_def456",
 *     "recipient": {
 *       "name": "Nguyễn Văn A",
 *       "email": "user@example.com"
 *     },
 *     "subject": "Kết quả phân tích da của bạn",
 *     "html": "<html>...</html>",
 *     "text": "Chào Nguyễn Văn A...",
 *     "previewText": "Kết quả phân tích da của bạn đã sẵn sàng"
 *   }
 * }
 *
 * Use case:
 * - Send analysis results via email
 * - Confirmation email after consultation
 * - Follow-up with recommendations
 * - Professional report delivery
 * - Email marketing automation
 *
 * Email content includes:
 * - Personalized greeting
 * - Analysis summary (skin type, conditions)
 * - Severity indicator with visual badge
 * - Key recommendations (bullet points)
 * - Call-to-action buttons:
 *   - "Đặt lịch tư vấn"
 *   - "Xem sản phẩm phù hợp"
 * - Professional HTML template with branding
 * - Plain text fallback
 *
 * Language support:
 * - "vi": Vietnamese (default)
 * - "en": English
 *
 * Note:
 * - This endpoint generates email content only
 * - Client responsible for actual sending (SendGrid, AWS SES, etc.)
 * - HTML is mobile-responsive
 * - Includes inline CSS for email client compatibility
 */
router.post(
  '/email-confirm',
  optionalAuth,
  reportRateLimit,
  validateBody(EmailConfirmRequestSchema),
  generateEmailConfirm
);

export default router;
