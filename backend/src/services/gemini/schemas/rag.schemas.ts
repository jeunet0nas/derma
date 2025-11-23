import { Type } from '@google/genai';

/**
 * Schema for RAG (Retrieval-Augmented Generation) response
 */
export const ragResponseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
      description: 'Câu trả lời tổng hợp bằng tiếng Việt, định dạng Markdown.',
    },
    sources: {
      type: Type.ARRAY,
      description: 'Danh sách các nguồn đã được sử dụng để tạo ra câu trả lời.',
      items: {
        type: Type.OBJECT,
        properties: {
          sourceName: {
            type: Type.STRING,
            description: "Tên của nguồn, ví dụ 'Mayo Clinic'.",
          },
          url: { type: Type.STRING, description: 'URL đầy đủ của nguồn.' },
        },
        required: ['sourceName', 'url'],
      },
    },
  },
  required: ['answer', 'sources'],
};
