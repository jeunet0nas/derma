/**
 * Advanced Analysis Schemas - Gemini response schemas for advanced skin analysis
 */

import { SchemaType as Type } from '@google/generative-ai';

const advancedAnalysisDetectionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    center: {
      type: Type.OBJECT,
      properties: {
        x: { type: Type.NUMBER },
        y: { type: Type.NUMBER },
      },
      required: ['x', 'y'],
    },
    radius: { type: Type.NUMBER },
    label: {
      type: Type.STRING,
      enum: [
        'blackhead',
        'whitehead',
        'papule',
        'pustule',
        'nodule_or_cyst',
        'inflammatory_area',
        'uncertain',
      ],
    },
    confidence: { type: Type.NUMBER },
    features: {
      type: Type.OBJECT,
      properties: {
        size_px: { type: Type.NUMBER },
        color_center_hex: { type: Type.STRING },
        raised: { type: Type.BOOLEAN },
      },
      required: ['size_px', 'color_center_hex', 'raised'],
    },
    advice: { type: Type.STRING },
  },
  required: ['id', 'center', 'radius', 'label', 'confidence', 'features', 'advice'],
};

export const advancedAnalysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    image_id: { type: Type.STRING },
    detections: {
      type: Type.ARRAY,
      items: advancedAnalysisDetectionSchema,
    },
    svg_overlay: { type: Type.STRING },
    summary_vi: { type: Type.STRING },
    meta: {
      type: Type.OBJECT,
      properties: {
        method: { type: Type.STRING },
        thresholds: {
          type: Type.OBJECT,
          properties: {
            heatmap_thresh: { type: Type.NUMBER },
            min_area_px: { type: Type.NUMBER },
          },
          required: ['heatmap_thresh', 'min_area_px'],
        },
        notes: { type: Type.STRING },
      },
      required: ['method', 'thresholds', 'notes'],
    },
  },
  required: ['image_id', 'detections', 'svg_overlay', 'summary_vi', 'meta'],
};
