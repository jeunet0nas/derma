/**
 * Analysis Service - Skin analysis and heatmap generation
 * Handles: analyzeSkinImage, generateHeatmapOverlay, performAdvancedAnalysis
 */

import { getGeminiClient } from './core.service';
import { analysisResponseSchema } from './schemas/analysis.schemas';
import { advancedAnalysisResponseSchema } from './schemas/advanced.schemas';
import {
  SKIN_ANALYSIS_PROMPT,
  HEATMAP_OVERLAY_PROMPT,
  ADVANCED_ANALYSIS_PROMPT,
} from './prompts/analysis.prompts';
import { logger } from '../../config/logger.config';

// Type definitions (will be moved to types/ later)
export type SkinType =
  | 'dầu (oily)'
  | 'khô (dry)'
  | 'nhạy cảm (sensitive)'
  | 'hỗn hợp (combination)';

export type RiskLevel = 'Low' | 'Medium' | 'High';

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
  expertInfo?: {
    answer: string;
    sources: Array<{ sourceName: string; url: string }>;
  };
}

export interface AdvancedAnalysisResult {
  image_id: string;
  detections: Array<{
    id: string;
    center: { x: number; y: number };
    radius: number;
    label: string;
    confidence: number;
    features: {
      size_px: number;
      color_center_hex: string;
      raised: boolean;
    };
    advice: string;
  }>;
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

/**
 * Analyze skin image using Gemini AI
 */
export const analyzeSkinImage = async (
  base64Image: string,
  mimeType: string,
  confidenceThreshold: number = 70
): Promise<AnalysisResult> => {
  try {
    const ai = getGeminiClient();
    const prompt = SKIN_ANALYSIS_PROMPT(confidenceThreshold);

    logger.info('Starting skin analysis with Gemini AI');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [{ text: prompt }, { inlineData: { mimeType, data: base64Image } }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response text from Gemini');
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;

    logger.info('Skin analysis completed successfully', {
      isUncertain: result.isUncertain,
      confidenceScore: result.confidenceScore,
    });

    return result;
  } catch (error) {
    logger.error('Error analyzing skin image with Gemini:', error);
    throw new Error('Không thể phân tích hình ảnh. Vui lòng thử lại.');
  }
};

/**
 * Generate heatmap overlay SVG
 */
export const generateHeatmapOverlay = async (
  base64Image: string,
  mimeType: string,
  analysisResult: AnalysisResult
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const prompt = HEATMAP_OVERLAY_PROMPT;

    const contextPrompt = `
${prompt}

**ANALYSIS CONTEXT:**
${JSON.stringify(analysisResult.zones, null, 2)}

Generate SVG overlay based on the analysis above.
`;

    logger.info('Generating heatmap overlay');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [{ text: contextPrompt }, { inlineData: { mimeType, data: base64Image } }],
      },
    });

    if (!response.text) {
      throw new Error('No SVG response from Gemini');
    }

    const svgMarkup = response.text.trim();
    logger.info('Heatmap overlay generated successfully');

    return svgMarkup;
  } catch (error) {
    logger.error('Error generating heatmap overlay:', error);
    throw new Error('Không thể tạo heatmap. Vui lòng thử lại.');
  }
};

/**
 * Perform advanced acne detection analysis (AI Skin Lab)
 */
export const performAdvancedAnalysis = async (
  imageBase64: string,
  imageMimeType: string,
  heatmapBase64: string,
  heatmapMimeType: string,
  options: {
    imageId?: string;
    heatmapThresh?: number;
    minAreaPx?: number;
  } = {}
): Promise<AdvancedAnalysisResult> => {
  try {
    const ai = getGeminiClient();

    const imageId = options.imageId || `img_${Date.now()}`;
    const thresholds = {
      heatmapThresh: options.heatmapThresh || 0.3,
      minAreaPx: options.minAreaPx || 50,
    };

    const prompt = ADVANCED_ANALYSIS_PROMPT(imageId, thresholds);

    logger.info('Starting advanced analysis (AI Skin Lab)', {
      imageId,
      thresholds,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          { text: prompt },
          { text: 'Ảnh gốc (image):' },
          { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
          { text: 'Heatmap:' },
          { inlineData: { mimeType: heatmapMimeType, data: heatmapBase64 } },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: advancedAnalysisResponseSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response from advanced analysis');
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AdvancedAnalysisResult;

    logger.info('Advanced analysis completed successfully', {
      imageId: result.image_id,
      detectionsCount: result.detections.length,
    });

    return result;
  } catch (error) {
    logger.error('Error performing advanced analysis with Gemini:', error);
    throw new Error('Không thể thực hiện phân tích nâng cao. Vui lòng thử lại.');
  }
};
