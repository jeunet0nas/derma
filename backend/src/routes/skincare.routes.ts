/**
 * Skincare Routes
 * Defines API endpoints for skincare recommendations and coaching
 */

import { Router } from 'express';
import { getDirection, getRoutine, getCoaching } from '../controllers/skincare.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { skincareRateLimit } from '../middlewares/rateLimit.middleware';
import {
  SkincareDirectionRequestSchema,
  PersonalizedRoutineRequestSchema,
  CoachingAdviceRequestSchema,
} from '../schemas/skincare.schemas';

const router = Router();

/**
 * POST /api/skincare/direction
 * Get general skincare direction
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate (for tracking)
 * - skincareRateLimit: 15 requests/minute per user/IP
 * - validateBody: Validate with SkincareDirectionRequestSchema
 *
 * Request:
 * {
 *   "skinType": "hỗn hợp",
 *   "conditions": ["Mụn đầu đen", "Bóng dầu vùng T"],
 *   "goals": ["Kiểm soát dầu", "Làm sạch lỗ chân lông"]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "directionId": "req_abc123",
 *     "direction": {
 *       "summary": "Tổng quan hướng dẫn chăm sóc...",
 *       "priorityGoals": ["Goal 1", "Goal 2", "Goal 3"]
 *     }
 *   }
 * }
 *
 * Use case:
 * - Quick skincare guidance
 * - Before requesting detailed routine
 * - Understand skin priorities
 */
router.post(
  '/direction',
  optionalAuth,
  skincareRateLimit,
  validateBody(SkincareDirectionRequestSchema),
  getDirection
);

/**
 * POST /api/skincare/routine
 * Generate personalized skincare routine
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate
 * - skincareRateLimit: 15 requests/minute
 * - validateBody: Validate with PersonalizedRoutineRequestSchema
 *
 * Request:
 * {
 *   "skinType": "dầu",
 *   "skinConditions": ["Mụn", "Lỗ chân lông to"],
 *   "environment": "Thành phố, ô nhiễm cao",
 *   "currentProducts": "Sữa rửa mặt CeraVe, Kem chống nắng Anessa",
 *   "goals": ["Kiểm soát dầu", "Giảm mụn"],
 *   "budget": "medium",
 *   "skinSensitivity": "low"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "routineId": "req_def456",
 *     "routine": {
 *       "morning": [
 *         {
 *           "step": 1,
 *           "name": "Làm sạch",
 *           "productType": "Sữa rửa mặt dịu nhẹ",
 *           "instructions": "...",
 *           "frequency": "Mỗi sáng"
 *         }
 *       ],
 *       "evening": [...],
 *       "weekly": [...],
 *       "tips": ["Tip 1", "Tip 2"],
 *       "warnings": ["Warning 1"]
 *     }
 *   }
 * }
 *
 * Use case:
 * - Detailed step-by-step routine
 * - Morning/evening/weekly breakdown
 * - Product recommendations
 * - Budget-conscious suggestions
 */
router.post(
  '/routine',
  optionalAuth,
  skincareRateLimit,
  validateBody(PersonalizedRoutineRequestSchema),
  getRoutine
);

/**
 * POST /api/skincare/coaching
 * Get AI coaching advice based on analysis
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate
 * - skincareRateLimit: 15 requests/minute
 * - validateBody: Validate with CoachingAdviceRequestSchema
 *
 * Request:
 * {
 *   "analysis": {
 *     "skinType": "hỗn hợp (combination)",
 *     "overallSummary": "Phát hiện mụn và bóng dầu...",
 *     "zones": [
 *       { "zone": "Trán", "condition": "Mụn", "riskLevel": "Medium" }
 *     ],
 *     "recommendations": ["Dùng BHA", "Kem chống nắng"]
 *   },
 *   "userContext": {
 *     "age": 22,
 *     "gender": "female",
 *     "lifestyle": "Sinh viên, thức khuya"
 *   }
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "coachingId": "req_ghi789",
 *     "coaching": {
 *       "coach_message": "Chào bạn! 💅 Da bạn nhìn khá ổn đấy...",
 *       "explanation": "Giải thích chi tiết về tình trạng da...",
 *       "escalation": false,
 *       "routine": {
 *         "created": true,
 *         "morning": [...],
 *         "night": [...]
 *       },
 *       "micro_education": "Kiến thức về BHA và cách hoạt động...",
 *       "follow_up": "Theo dõi sau 2 tuần..."
 *     }
 *   }
 * }
 *
 * Use case:
 * - Post-analysis coaching
 * - Friendly, motivational advice
 * - Education about skin conditions
 * - Routine recommendations
 * - Follow-up guidance
 *
 * Special features:
 * - Cute Gen Z tone (DermaCoach AI)
 * - Safety escalation flag for serious conditions
 * - Micro-education snippets
 */
router.post(
  '/coaching',
  optionalAuth,
  skincareRateLimit,
  validateBody(CoachingAdviceRequestSchema),
  getCoaching
);

export default router;
