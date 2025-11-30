/**
 * Analysis Controller
 * Handles skin analysis API endpoints
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { GeminiError } from '../utils/errorClasses';
import { ErrorMessages } from '../constants/errorMessages';
import { logger } from '../config/logger.config';
import { RequestWithId } from '../utils/requestLogger';
import { AuthRequest } from '../middlewares/auth.middleware';
import { analyzeSkinImage, generateHeatmapOverlay } from '../services/gemini/analysis.service';
import { getExpertInfoForCondition } from '../services/gemini/rag.service';
import type { AnalyzeSkinRequest, GenerateHeatmapRequest } from '../schemas/analysis.schemas';

/**
 * Helper to extract base64 and mimeType from data URL or raw base64
 */
const parseBase64Image = (imageData: string): { base64: string; mimeType: string } => {
  // Check if it's a data URL: data:image/png;base64,iVBORw0...
  if (imageData.startsWith('data:image/')) {
    const matches = imageData.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (matches) {
      return {
        mimeType: matches[1],
        base64: matches[2],
      };
    }
  }

  // Assume raw base64 with default mime type
  return {
    base64: imageData,
    mimeType: 'image/jpeg',
  };
};

/**
 * POST /api/analysis/skin
 * Analyze skin image using Gemini AI
 *
 * Flow:
 * 1. Parse base64 image
 * 2. Call analyzeSkinImage service
 * 3. Optionally get expert info for main condition
 * 4. Return analysis result with metadata
 */
export const analyzeSkin = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as AnalyzeSkinRequest;

  logger.info('Starting skin analysis', {
    requestId,
    userId,
    includeExpertInfo: body.includeExpertInfo,
    includeAdvancedAnalysis: body.includeAdvancedAnalysis,
  });

  try {
    // Parse image
    const { base64, mimeType } = parseBase64Image(body.image);

    // Analyze skin image
    const analysisResult = await analyzeSkinImage(base64, mimeType);

    // Optionally get expert info for the most severe condition
    let expertInfo = undefined;
    if (body.includeExpertInfo && analysisResult.zones.length > 0) {
      // Find zone with highest risk
      const highRiskZone =
        analysisResult.zones.find((z) => z.riskLevel === 'High') || analysisResult.zones[0];

      if (highRiskZone) {
        logger.info('Fetching expert info for condition', {
          requestId,
          condition: highRiskZone.condition,
        });

        try {
          expertInfo = await getExpertInfoForCondition(highRiskZone.condition);
        } catch (error) {
          logger.warn('Failed to fetch expert info', {
            requestId,
            error: (error as Error).message,
          });
          // Continue without expert info
        }
      }
    }

    // Add expert info to result if available
    if (expertInfo) {
      analysisResult.expertInfo = expertInfo;
    }

    const processingTime = Date.now() - startTime;

    logger.info('Skin analysis completed', {
      requestId,
      userId,
      skinType: analysisResult.skinType,
      zonesCount: analysisResult.zones.length,
      processingTime: `${processingTime}ms`,
    });

    return successResponse(
      res,
      {
        analysisId: requestId,
        result: analysisResult,
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Skin analysis failed', {
      requestId,
      userId,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    throw new GeminiError(ErrorMessages.GEMINI_API_ERROR, {
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/analysis/heatmap
 * Generate heatmap overlay for analyzed skin image
 *
 * Flow:
 * 1. Parse base64 image
 * 2. Call generateHeatmapOverlay service
 * 3. Return SVG heatmap overlay
 */
export const generateHeatmap = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as GenerateHeatmapRequest;

  logger.info('Starting heatmap generation', {
    requestId,
    userId,
    zonesCount: body.zones.length,
  });

  try {
    // Parse image
    const { base64, mimeType } = parseBase64Image(body.image);

    // Generate heatmap overlay
    const heatmapSvg = await generateHeatmapOverlay(base64, mimeType, {
      skinType: body.skinType || null,
      zones: body.zones.map((z) => ({
        zone: z.zone,
        condition: z.condition,
        riskLevel: z.riskLevel,
        visualEvidence: {
          visualClues: '',
          reasoning: '',
          certainty: 100,
        },
        explanation: '',
      })),
      overallSummary: '',
      recommendations: [],
      safetyNote: '',
      isUncertain: false,
      confidenceScore: 100,
    });

    const processingTime = Date.now() - startTime;

    logger.info('Heatmap generation completed', {
      requestId,
      userId,
      svgLength: heatmapSvg.length,
      processingTime: `${processingTime}ms`,
    });

    return successResponse(
      res,
      {
        heatmapId: requestId,
        svg: heatmapSvg,
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Heatmap generation failed', {
      requestId,
      userId,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    throw new GeminiError(ErrorMessages.GEMINI_API_ERROR, {
      details: (error as Error).message,
    });
  }
});
