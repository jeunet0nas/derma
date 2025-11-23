import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/env.config';
import { logger } from '../../config/logger.config';

/**
 * Initialize Gemini AI client with API key from environment
 */
let geminiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (!geminiClient) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
      logger.info('✅ Gemini AI client initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Gemini AI client', error);
      throw new Error('Gemini AI initialization failed');
    }
  }
  return geminiClient;
};

/**
 * Get a specific Gemini model instance
 * @param _modelName - Model name (currently unused, returns default client)
 */
export const getGeminiModel = (_modelName: string) => {
  const client = getGeminiClient();
  return client.models;
};
