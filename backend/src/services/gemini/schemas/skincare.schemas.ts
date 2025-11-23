import { Type } from '@google/genai';

/**
 * Schema for skincare direction summary
 */
export const skincareDirectionSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description:
        'Một câu tóm tắt về định hướng chăm sóc da chính, ví dụ: "Tập trung vào việc kiểm soát dầu, trị mụn và làm dịu da."',
    },
    priorityGoals: {
      type: Type.ARRAY,
      description:
        'Danh sách các mục tiêu ưu tiên hàng đầu, ví dụ: ["Kiểm soát dầu và bã nhờn", "Giảm viêm và mụn", "Làm dịu da nhạy cảm"].',
      items: { type: Type.STRING },
    },
  },
  required: ['summary', 'priorityGoals'],
};

/**
 * Schema for individual routine step
 */
export const routineStepSchema = {
  type: Type.OBJECT,
  properties: {
    step: { type: Type.NUMBER, description: 'Số thứ tự của bước.' },
    name: {
      type: Type.STRING,
      description: "Tên của bước, ví dụ: 'Rửa mặt', 'Tẩy tế bào chết'.",
    },
    productType: {
      type: Type.STRING,
      description: "Loại sản phẩm gợi ý, ví dụ: 'Sữa rửa mặt dịu nhẹ'.",
    },
    instructions: {
      type: Type.STRING,
      description: 'Hướng dẫn sử dụng ngắn gọn.',
    },
    frequency: {
      type: Type.STRING,
      description: "Tần suất thực hiện, ví dụ: 'Hàng ngày', '2-3 lần/tuần'.",
    },
  },
  required: ['step', 'name', 'productType', 'instructions', 'frequency'],
};

/**
 * Schema for personalized skincare routine
 */
export const personalizedRoutineSchema = {
  type: Type.OBJECT,
  properties: {
    morning: {
      type: Type.ARRAY,
      description: 'Các bước chăm sóc buổi sáng.',
      items: routineStepSchema,
    },
    evening: {
      type: Type.ARRAY,
      description: 'Các bước chăm sóc buổi tối.',
      items: routineStepSchema,
    },
    weekly: {
      type: Type.ARRAY,
      description: 'Các bước chăm sóc hàng tuần.',
      items: routineStepSchema,
    },
    tips: {
      type: Type.ARRAY,
      description: 'Các mẹo bổ sung về lối sống hoặc chăm sóc da.',
      items: { type: Type.STRING },
    },
    warnings: {
      type: Type.ARRAY,
      description: 'Các cảnh báo quan trọng, ví dụ như không kết hợp các hoạt chất.',
      items: { type: Type.STRING },
    },
  },
  required: ['morning', 'evening', 'weekly', 'tips', 'warnings'],
};

/**
 * Schema for AI coaching response
 */
export const coachingResultSchema = {
  type: Type.OBJECT,
  properties: {
    escalation: {
      type: Type.BOOLEAN,
      description: "Set to true if any zone has 'High' risk. Otherwise false.",
    },
    coach_message: {
      type: Type.STRING,
      description: 'A warm, playful greeting and compliment.',
    },
    explanation: {
      type: Type.STRING,
      description: 'A positive summary of the skin condition.',
    },
    routine: {
      type: Type.OBJECT,
      properties: {
        created: {
          type: Type.BOOLEAN,
          description: 'Set to true if escalation is false.',
        },
        morning: {
          type: Type.ARRAY,
          description: 'A simple 3-5 step morning routine. Each step is a string.',
          items: { type: Type.STRING },
        },
        night: {
          type: Type.ARRAY,
          description: 'A simple 3-5 step night routine. Each step is a string.',
          items: { type: Type.STRING },
        },
      },
      required: ['created', 'morning', 'night'],
    },
    micro_education: {
      type: Type.STRING,
      description: 'One cute, short, educational skincare tip.',
    },
    follow_up: {
      type: Type.STRING,
      description: 'A follow-up message to encourage the user.',
    },
  },
  required: [
    'escalation',
    'coach_message',
    'explanation',
    'routine',
    'micro_education',
    'follow_up',
  ],
};
