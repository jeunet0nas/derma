/**
 * Skincare Controller
 * Handles skincare recommendation and coaching API endpoints
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { GeminiError } from '../utils/errorClasses';
import { ErrorMessages } from '../constants/errorMessages';
import { logger } from '../config/logger.config';
import { RequestWithId } from '../utils/requestLogger';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  getSkincareDirection,
  getPersonalizedSkincareRoutine,
  getCoachingAdvice,
} from '../services/gemini/skincare.service';
import type {
  SkincareDirectionRequest,
  PersonalizedRoutineRequest,
  CoachingAdviceRequest,
} from '../schemas/skincare.schemas';

/**
 * POST /api/skincare/direction
 * Get general skincare direction based on skin type, conditions, and goals
 *
 * Flow:
 * 1. Extract skinType, conditions, goals from request
 * 2. Call getSkincareDirection service
 * 3. Return summary and priority goals
 *
 * Use case:
 * - Quick overview of skincare approach
 * - Entry point before detailed routine
 * - Helps user understand their skin needs
 */
export const getDirection = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as SkincareDirectionRequest;

  logger.info('Getting skincare direction', {
    requestId,
    userId,
    skinType: body.skinType,
    conditionsCount: body.conditions.length,
    goalsCount: body.goals.length,
  });

  try {
    // Prepare analysis input for direction
    const analysisInput = {
      skinType: body.skinType as any, // Cast to SkinType - validated by schema
      zones: body.conditions.map((condition, index) => ({
        zone: `Vùng ${index + 1}`,
        condition,
        riskLevel: 'Medium' as const,
        visualEvidence: {
          visualClues: '',
          reasoning: '',
          certainty: 100,
        },
        explanation: '',
      })),
      overallSummary: `Loại da: ${body.skinType}. Tình trạng: ${body.conditions.join(', ')}.`,
      recommendations: body.goals,
      safetyNote: '',
      isUncertain: false,
      confidenceScore: 100,
    };

    // Get direction from service
    const direction = await getSkincareDirection(analysisInput);

    const processingTime = Date.now() - startTime;

    logger.info('Skincare direction generated', {
      requestId,
      userId,
      priorityGoalsCount: direction.priorityGoals.length,
      processingTime: `${processingTime}ms`,
    });

    return successResponse(
      res,
      {
        directionId: requestId,
        direction,
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Failed to get skincare direction', {
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
 * POST /api/skincare/routine
 * Generate personalized skincare routine
 *
 * Flow:
 * 1. Extract user skin profile and goals
 * 2. Call getPersonalizedSkincareRoutine service
 * 3. Return morning/evening/weekly routines with tips
 *
 * Use case:
 * - Detailed step-by-step routine
 * - Product type recommendations
 * - Frequency and timing guidance
 * - Customized for user's lifestyle and budget
 */
export const getRoutine = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as PersonalizedRoutineRequest;

  logger.info('Generating personalized routine', {
    requestId,
    userId,
    skinType: body.skinType,
    environment: body.environment,
    budget: body.budget,
  });

  try {
    // First get direction to determine priorities
    const direction = {
      summary: `Chăm sóc da ${body.skinType} với ${body.goals.join(', ')}`,
      priorityGoals: body.goals,
    };

    // Call routine generation service
    const routine = await getPersonalizedSkincareRoutine(direction, body.skinType as any);

    const processingTime = Date.now() - startTime;

    logger.info('Personalized routine generated', {
      requestId,
      userId,
      morningSteps: routine.morning.length,
      eveningSteps: routine.evening.length,
      weeklySteps: routine.weekly.length,
      processingTime: `${processingTime}ms`,
    });

    return successResponse(
      res,
      {
        routineId: requestId,
        routine,
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Failed to generate routine', {
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
 * POST /api/skincare/coaching
 * Get AI coaching advice based on skin analysis
 *
 * Flow:
 * 1. Extract analysis result and user context
 * 2. Call getCoachingAdvice service
 * 3. Return coaching message, explanation, routine, education, follow-up
 *
 * Use case:
 * - Post-analysis coaching
 * - Friendly, encouraging advice in Vietnamese
 * - Micro-education about skin conditions
 * - Actionable routine recommendations
 * - Follow-up guidance
 *
 * Special features:
 * - Cute, Gen Z tone ("DermaCoach AI")
 * - Motivational messages
 * - Safety checks (escalation flag for serious conditions)
 */
export const getCoaching = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id;
  const userId = (req as AuthRequest).user?.uid;
  const body = req.body as CoachingAdviceRequest;

  logger.info('Getting coaching advice', {
    requestId,
    userId,
    skinType: body.analysis.skinType,
    zonesCount: body.analysis.zones.length,
  });

  try {
    // Transform input to match service signature
    const analysisResult = {
      skinType: body.analysis.skinType,
      zones: body.analysis.zones.map((z) => ({
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
      overallSummary: body.analysis.overallSummary,
      recommendations: body.analysis.recommendations,
      safetyNote: '',
      isUncertain: false,
      confidenceScore: 100,
    };

    // Get coaching advice
    const coaching = await getCoachingAdvice(analysisResult);

    const processingTime = Date.now() - startTime;

    logger.info('Coaching advice generated', {
      requestId,
      userId,
      escalation: coaching.escalation,
      routineCreated: coaching.routine.created,
      processingTime: `${processingTime}ms`,
    });

    // Log warning if escalation flag is set (serious condition detected)
    if (coaching.escalation) {
      logger.warn('Coaching escalation flag set', {
        requestId,
        userId,
        explanation: coaching.explanation,
      });
    }

    return successResponse(
      res,
      {
        coachingId: requestId,
        coaching,
      },
      200,
      {
        requestId,
        processingTime,
      }
    );
  } catch (error) {
    logger.error('Failed to get coaching advice', {
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
