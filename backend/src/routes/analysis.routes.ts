/**
 * Analysis Routes
 * Defines API endpoints for skin analysis
 */

import { Router } from 'express';
import { analyzeSkin, generateHeatmap } from '../controllers/analysis.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { aiAnalysisRateLimit } from '../middlewares/rateLimit.middleware';
import {
  AnalyzeSkinRequestSchema,
  GenerateHeatmapRequestSchema,
} from '../schemas/analysis.schemas';

const router = Router();

/**
 * POST /api/analysis/skin
 * Analyze skin image using Gemini AI
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate (for user tracking)
 * - aiAnalysisRateLimit: 10 requests/minute per user/IP
 * - validateBody: Validate request with AnalyzeSkinRequestSchema
 *
 * Request:
 * {
 *   "image": "base64_string_or_data_url",
 *   "includeExpertInfo": false,
 *   "includeAdvancedAnalysis": false
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "analysisId": "req_abc123",
 *     "result": { ... AnalysisResult }
 *   },
 *   "meta": {
 *     "timestamp": "2025-11-22T10:30:00Z",
 *     "requestId": "req_abc123",
 *     "processingTime": 2341
 *   }
 * }
 */
router.post(
  '/skin',
  optionalAuth,
  aiAnalysisRateLimit,
  validateBody(AnalyzeSkinRequestSchema),
  analyzeSkin
);

/**
 * POST /api/analysis/heatmap
 * Generate heatmap overlay for analyzed skin image
 *
 * Middlewares:
 * - optionalAuth: Try to authenticate
 * - aiAnalysisRateLimit: 10 requests/minute
 * - validateBody: Validate request with GenerateHeatmapRequestSchema
 *
 * Request:
 * {
 *   "image": "base64_string",
 *   "skinType": "dầu (oily)" | null,
 *   "zones": [
 *     { "zone": "Trán", "condition": "Mụn đầu đen", "riskLevel": "Medium" }
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "heatmapId": "req_def456",
 *     "svg": "<svg>...</svg>"
 *   }
 * }
 */
router.post(
  '/heatmap',
  optionalAuth,
  aiAnalysisRateLimit,
  validateBody(GenerateHeatmapRequestSchema),
  generateHeatmap
);

export default router;
