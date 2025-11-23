/**
 * Report Generation Service
 * Handles: sendReportToWebhook, generateEmailConfirmationMessage
 */

import { getGeminiClient } from './core.service';
import { EMAIL_CONFIRMATION_PROMPT, REPORT_SYSTEM_INSTRUCTION } from './prompts/report.prompts';
import { logger } from '../../config/logger.config';
import { AnalysisResult, SkinType } from './analysis.service';

/**
 * Send analysis report to webhook (Make.com integration)
 */
export const sendReportToWebhook = async (
  analysisResult: AnalysisResult,
  userEmail: string
): Promise<void> => {
  try {
    // Determine severity level
    const riskLevels = analysisResult.zones.map((z) => z.riskLevel);
    let muc_do = 'Nhẹ';
    if (riskLevels.includes('High')) muc_do = 'Nặng';
    else if (riskLevels.includes('Medium')) muc_do = 'Trung bình';

    // Map skin type to Vietnamese
    const skinTypeMap: { [key in SkinType]: string } = {
      'dầu (oily)': 'Da dầu',
      'khô (dry)': 'Da khô',
      'nhạy cảm (sensitive)': 'Da nhạy cảm',
      'hỗn hợp (combination)': 'Da hỗn hợp',
    };

    // Build webhook payload
    const webhookPayload = {
      email: userEmail,
      ten: userEmail.split('@')[0],
      loai_da: analysisResult.skinType ? skinTypeMap[analysisResult.skinType] : 'Không xác định',
      khu_vuc_mun:
        analysisResult.zones
          .filter((z) => z.condition.toLowerCase().includes('mụn'))
          .map((z) => z.zone)
          .join(' và ') || 'Không có vùng mụn cụ thể',
      loai_mun:
        [
          ...new Set(
            analysisResult.zones
              .filter((z) => z.condition.toLowerCase().includes('mụn'))
              .map((z) => z.condition)
          ),
        ].join(', ') || 'Không có',
      muc_do: muc_do,
      routine: analysisResult.recommendations.join('; '),
      image_url: analysisResult.heatmapImageUrl,
      timestamp: new Date().toISOString(),
    };

    logger.info('Sending report to webhook', {
      email: userEmail,
      severity: muc_do,
    });

    const response = await fetch('https://hook.eu2.make.com/yly5py645xmb7cskoh0br5bsavot2vkw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Webhook request failed with status ${response.status}: ${errorBody}`);
    }

    logger.info('Report sent to webhook successfully');
  } catch (error) {
    logger.error('Error sending report to webhook:', error);
    throw new Error('Không thể gửi báo cáo qua email. Vui lòng thử lại sau.');
  }
};

/**
 * Generate email confirmation message
 */
export const generateEmailConfirmationMessage = async (
  analysisResult: AnalysisResult
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const prompt = EMAIL_CONFIRMATION_PROMPT(analysisResult);

    logger.info('Generating email confirmation message');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: REPORT_SYSTEM_INSTRUCTION,
      },
    });

    const message =
      response.text ||
      'Báo cáo chi tiết đã được gửi tới email của bạn rồi đó! Nhớ check mail nha! 💌';

    logger.info('Email confirmation message generated successfully');
    return message;
  } catch (error) {
    logger.error('Error generating email confirmation message:', error);
    // Fallback message
    return 'Báo cáo chi tiết đã được gửi tới email của bạn rồi đó! Nhớ check mail nha! 💌';
  }
};
