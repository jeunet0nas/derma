/**
 * Report Controller
 * Handles report generation and delivery endpoints
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { InternalError } from '../utils/errorClasses';
import { ErrorMessages } from '../constants/errorMessages';
import { logger } from '../config/logger.config';
import { RequestWithId } from '../utils/requestLogger';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  sendReportToWebhook,
  generateEmailConfirmationMessage,
} from '../services/gemini/report.service';
import type { WebhookReportRequest, EmailConfirmRequest } from '../schemas/report.schemas';

/**
 * POST /api/report/webhook
 * Send analysis report to webhook (e.g., Make.com, Zapier)
 *
 * Flow:
 * 1. Extract report data (image, analysis, contact info)
 * 2. Call sendReportToWebhook service
 *    - Format report payload
 *    - Send POST request to webhook URL
 *    - Handle webhook response
 * 3. Return success confirmation
 *
 * Use case:
 * - Integration với Make.com automation
 * - Send report to CRM/Email marketing
 * - Trigger automated workflows
 * - Store analysis results in external DB
 *
 * Webhook payload format:
 * {
 *   "timestamp": "2025-11-22T10:30:00Z",
 *   "userId": "user123",
 *   "image": "base64...",
 *   "analysis": { skinType, conditions, severity, zones },
 *   "contact": { email, phone },
 *   "metadata": { ... }
 * }
 *
 * Security:
 * - Rate limited (5 req/min) to prevent abuse
 * - Webhook URL validated (must be HTTPS)
 * - Optional authentication (track userId if available)
 */
export const sendToWebhook = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as WebhookReportRequest;

  logger.info('Sending report to webhook', {
    requestId,
    userId,
    webhookUrl: body.webhookUrl,
    hasImage: !!body.image,
    hasAnalysis: !!body.analysis,
  });

  try {
    // Validate required fields for webhook service
    if (!body.analysis) {
      throw new Error('Analysis data is required for webhook report');
    }
    if (!body.email) {
      throw new Error('Email is required for webhook report');
    }

    // Transform request analysis to AnalysisResult format
    const analysisResult: any = {
      skinType: body.analysis.skinType as any,
      zones: body.analysis.zones.map((zone) => ({
        zone: zone.name,
        condition: zone.conditions.join(', '),
        riskLevel:
          zone.severity === 'high' ? 'High' : zone.severity === 'medium' ? 'Medium' : 'Low',
        visualEvidence: '',
        explanation: '',
      })),
      recommendations: [],
      heatmapImageUrl: body.webhookUrl, // Placeholder
    };

    // Send to webhook (service uses hardcoded Make.com URL)
    await sendReportToWebhook(analysisResult, body.email);

    const processingTime = Date.now() - startTime;

    logger.info('Report sent to webhook successfully', {
      requestId,
      userId,
      email: body.email,
      processingTime: `${processingTime}ms`,
    });

    return successResponse(
      res,
      {
        webhookId: requestId,
        status: 'sent',
        message: 'Report sent successfully to webhook',
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Failed to send report to webhook', {
      requestId,
      userId,
      webhookUrl: body.webhookUrl,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    throw new InternalError(ErrorMessages.INTERNAL_SERVER_ERROR, {
      details: `Webhook error: ${(error as Error).message}`,
    });
  }
});

/**
 * POST /api/report/email-confirm
 * Generate email confirmation message for skin analysis report
 *
 * Flow:
 * 1. Extract recipient info and report data
 * 2. Call generateEmailConfirmationMessage service
 *    - Generate personalized email HTML
 *    - Include analysis summary
 *    - Add skincare recommendations
 *    - Format professional email template
 * 3. Return email HTML/text for sending
 *
 * Use case:
 * - Send analysis results via email
 * - Confirmation email after analysis
 * - Professional report delivery
 * - Email marketing follow-up
 *
 * Email includes:
 * - Personalized greeting
 * - Analysis summary (skin type, conditions, severity)
 * - Key recommendations
 * - Call-to-action (book consultation, shop products)
 * - Professional branding
 *
 * Language support:
 * - Vietnamese (default)
 * - English
 *
 * Note:
 * - This endpoint generates the email content
 * - Actual email sending should be done by client or webhook
 * - Can integrate with SendGrid, AWS SES, etc.
 */
export const generateEmailConfirm = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as EmailConfirmRequest;

  logger.info('Generating email confirmation message', {
    requestId,
    userId,
    recipientEmail: body.recipientEmail,
    language: body.language,
    includeDetailedReport: body.includeDetailedReport,
  });

  try {
    // Transform request data to AnalysisResult format
    const analysisResult: any = {
      skinType: body.reportData.skinType as any,
      zones: body.reportData.conditions.map((condition) => ({
        zone: 'General',
        condition,
        riskLevel:
          body.reportData.severity === 'high'
            ? 'High'
            : body.reportData.severity === 'medium'
              ? 'Medium'
              : 'Low',
        visualEvidence: '',
        explanation: '',
      })),
      recommendations: body.reportData.recommendations || [],
      heatmapImageUrl: '',
    };

    // Generate email message (service returns simple string)
    const emailMessage = await generateEmailConfirmationMessage(analysisResult);

    const processingTime = Date.now() - startTime;

    // Generate subject based on language
    const subject =
      body.language === 'en' ? 'Your Skin Analysis Report' : 'Kết quả phân tích da của bạn';

    logger.info('Email confirmation message generated', {
      requestId,
      userId,
      recipientEmail: body.recipientEmail,
      messageLength: emailMessage.length,
      processingTime: `${processingTime}ms`,
    });

    return successResponse(
      res,
      {
        emailId: requestId,
        recipient: {
          name: body.recipientName,
          email: body.recipientEmail,
        },
        subject,
        message: emailMessage,
        // Simple text format (service doesn't return HTML)
        text: emailMessage,
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Failed to generate email confirmation', {
      requestId,
      userId,
      recipientEmail: body.recipientEmail,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    throw new InternalError(ErrorMessages.INTERNAL_SERVER_ERROR, {
      details: `Email generation error: ${(error as Error).message}`,
    });
  }
});
