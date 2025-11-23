/**
 * RAG (Retrieval-Augmented Generation) Service
 * Handles: getGroundedAnswer, getExpertInfoForCondition, getChatbotResponse
 */

import { getGeminiClient } from './core.service';
import { ragResponseSchema } from './schemas/rag.schemas';
import {
  RAG_ANSWER_PROMPT,
  CHATBOT_SYSTEM_INSTRUCTION,
  CHATBOT_PROMPT,
  CONDITION_INFO_PROMPT,
} from './prompts/rag.prompts';
import { findRelevantChunks } from '../../constants/knowledgeBase';
import { logger } from '../../config/logger.config';

// Type definitions (will be moved to types/ later)
export interface RagResult {
  answer: string;
  sources: Array<{
    sourceName: string;
    url: string;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: {
    base64: string;
    mimeType: string;
  };
  sources?: Array<{
    sourceName: string;
    url: string;
  }>;
}

/**
 * Get grounded answer using RAG (Retrieval-Augmented Generation)
 */
export const getGroundedAnswer = async (question: string): Promise<RagResult> => {
  try {
    const ai = getGeminiClient();
    const relevantChunks = findRelevantChunks(question);

    logger.info('Getting grounded answer', {
      question: question.substring(0, 50),
      relevantChunksCount: relevantChunks.length,
    });

    if (relevantChunks.length === 0) {
      logger.warn('No relevant chunks found for question');
      return {
        answer:
          'Rất tiếc, tôi không tìm thấy thông tin đáng tin cậy nào liên quan đến câu hỏi của bạn trong cơ sở kiến thức của mình. Vui lòng thử một câu hỏi khác hoặc tham khảo ý kiến bác sĩ da liễu.',
        sources: [],
      };
    }

    const prompt = RAG_ANSWER_PROMPT(question, relevantChunks);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: ragResponseSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response from Gemini');
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as RagResult;

    logger.info('Grounded answer generated successfully', {
      sourcesCount: result.sources.length,
    });

    return result;
  } catch (error) {
    logger.error('Error getting grounded answer from Gemini:', error);
    throw new Error('Không thể tạo câu trả lời. Vui lòng thử lại.');
  }
};

/**
 * Get expert information for specific condition
 */
export const getExpertInfoForCondition = async (condition: string): Promise<RagResult> => {
  const question = CONDITION_INFO_PROMPT(condition);
  logger.info('Getting expert info for condition', { condition });
  return getGroundedAnswer(question);
};

/**
 * Get chatbot response with RAG context
 */
export const getChatbotResponse = async (
  _history: ChatMessage[],
  text: string,
  image?: { base64: string; mimeType: string }
): Promise<ChatMessage> => {
  try {
    const ai = getGeminiClient();

    // RAG: Find relevant medical knowledge
    const relevantChunks = findRelevantChunks(text);
    const context =
      relevantChunks.length > 0
        ? 'Dưới đây là một số thông tin y khoa liên quan từ cơ sở kiến thức, hãy sử dụng nó để trả lời nếu phù hợp:\n' +
          relevantChunks
            .map(
              (chunk, index) =>
                `Nguồn [${index}]:\n- Nguồn gốc: ${chunk.source}\n- Nội dung: ${chunk.content}`
            )
            .join('\n\n')
        : 'Không có thông tin y khoa nào trong cơ sở kiến thức được tìm thấy liên quan trực tiếp.';

    const prompt = CHATBOT_PROMPT(text, context);

    logger.info('Getting chatbot response', {
      hasImage: !!image,
      relevantChunksCount: relevantChunks.length,
    });

    // Build parts array with proper typing
    const parts = [{ text: prompt }] as (
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    )[];

    if (image) {
      parts.push({
        inlineData: { mimeType: image.mimeType, data: image.base64 },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts },
      config: {
        systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ragResponseSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response from Gemini');
    }

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as RagResult;

    logger.info('Chatbot response generated successfully', {
      sourcesUsed: parsedResult.sources.length,
    });

    return {
      role: 'model',
      text: parsedResult.answer,
      sources: parsedResult.sources,
    };
  } catch (error) {
    logger.error('Error getting chatbot response:', error);
    return {
      role: 'model',
      text: 'Ui, tui bị lag xíu rùi 🥺. Bồ thử lại sau nha!',
    };
  }
};
