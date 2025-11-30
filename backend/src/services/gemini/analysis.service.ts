/**
 * Analysis Service - Skin analysis and heatmap generation
 * Handles: analyzeSkinImage, generateHeatmapOverlay
 */

import { getGeminiClient } from './core.service';
import { analysisResponseSchema } from './schemas/analysis.schemas';
import { SKIN_ANALYSIS_PROMPT, HEATMAP_OVERLAY_PROMPT } from './prompts/analysis.prompts';
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
