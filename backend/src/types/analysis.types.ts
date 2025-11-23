/**
 * Analysis Types - Skin analysis results
 */

import { z } from 'zod';
import { RiskLevel, RiskLevelSchema, SkinType, SkinTypeSchema } from './common.types';
import type { RagResult } from './rag.types';

// ============================================================================
// ZONE ANALYSIS
// ============================================================================

export interface ZoneAnalysis {
  zone: string;
  condition: string;
  riskLevel: RiskLevel;
  visualEvidence: {
    visualClues: string;
    reasoning: string;
    certainty: number;
  };
  explanation: string;
}

export const ZoneAnalysisSchema = z.object({
  zone: z.string(),
  condition: z.string(),
  riskLevel: RiskLevelSchema,
  visualEvidence: z.object({
    visualClues: z.string(),
    reasoning: z.string(),
    certainty: z.number().min(0).max(100),
  }),
  explanation: z.string(),
});

// ============================================================================
// ADVANCED ANALYSIS (AI SKIN LAB)
// ============================================================================

export type AcneLabel =
  | 'blackhead'
  | 'whitehead'
  | 'papule'
  | 'pustule'
  | 'nodule_or_cyst'
  | 'inflammatory_area'
  | 'uncertain';

export interface AcneDetection {
  id: string;
  center: { x: number; y: number };
  radius: number;
  label: AcneLabel;
  confidence: number;
  features: {
    size_px: number;
    color_center_hex: string;
    raised: boolean;
  };
  advice: string;
}

export interface AdvancedAnalysisResult {
  image_id: string;
  detections: AcneDetection[];
  svg_overlay: string;
  summary_vi: string;
  meta: {
    method: string;
    thresholds: {
      heatmap_thresh: number;
      min_area_px: number;
    };
    notes: string;
  };
}

export const AcneLabelSchema = z.enum([
  'blackhead',
  'whitehead',
  'papule',
  'pustule',
  'nodule_or_cyst',
  'inflammatory_area',
  'uncertain',
]);

export const AcneDetectionSchema = z.object({
  id: z.string(),
  center: z.object({ x: z.number(), y: z.number() }),
  radius: z.number(),
  label: AcneLabelSchema,
  confidence: z.number().min(0).max(1),
  features: z.object({
    size_px: z.number(),
    color_center_hex: z.string(),
    raised: z.boolean(),
  }),
  advice: z.string(),
});

export const AdvancedAnalysisResultSchema = z.object({
  image_id: z.string(),
  detections: z.array(AcneDetectionSchema),
  svg_overlay: z.string(),
  summary_vi: z.string(),
  meta: z.object({
    method: z.string(),
    thresholds: z.object({
      heatmap_thresh: z.number(),
      min_area_px: z.number(),
    }),
    notes: z.string(),
  }),
});

// ============================================================================
// ANALYSIS RESULT
// ============================================================================

export interface AnalysisResult {
  skinType: SkinType | null;
  zones: ZoneAnalysis[];
  overallSummary: string;
  recommendations: string[];
  safetyNote: string;
  isUncertain: boolean;
  uncertaintyReason?: string;
  confidenceScore: number;
  heatmapImageUrl?: string;
  expertInfo?: RagResult;
  advancedAnalysis?: AdvancedAnalysisResult;
}

const RagResultSchemaLocal = z.object({
  answer: z.string(),
  sources: z.array(
    z.object({
      sourceName: z.string(),
      url: z.string().url(),
    })
  ),
});

export const AnalysisResultSchema = z.object({
  skinType: SkinTypeSchema.nullable(),
  zones: z.array(ZoneAnalysisSchema),
  overallSummary: z.string(),
  recommendations: z.array(z.string()),
  safetyNote: z.string(),
  isUncertain: z.boolean(),
  uncertaintyReason: z.string().optional(),
  confidenceScore: z.number().min(0).max(100),
  heatmapImageUrl: z.string().optional(),
  expertInfo: RagResultSchemaLocal.optional(),
  advancedAnalysis: AdvancedAnalysisResultSchema.optional(),
});

// ============================================================================
// HISTORY & FEEDBACK
// ============================================================================

export interface Feedback {
  rating: 'helpful' | 'unhelpful';
  reason?: 'inaccurate' | 'unclear' | 'unsuitable' | 'other';
  details?: string;
  doctorDiagnosis?: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  imageUrl: string;
  result: AnalysisResult;
  notes: string;
  feedback?: Feedback;
}

export const FeedbackSchema = z.object({
  rating: z.enum(['helpful', 'unhelpful']),
  reason: z.enum(['inaccurate', 'unclear', 'unsuitable', 'other']).optional(),
  details: z.string().optional(),
  doctorDiagnosis: z.string().optional(),
});

export const HistoryEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  imageUrl: z.string().url(),
  result: AnalysisResultSchema,
  notes: z.string(),
  feedback: FeedbackSchema.optional(),
});
