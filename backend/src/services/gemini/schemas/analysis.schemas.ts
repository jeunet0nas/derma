import { Type } from '@google/genai';

/**
 * Schema for individual zone analysis (part of XAI - Explainable AI)
 */
export const zoneAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    zone: {
      type: Type.STRING,
      description: 'Tên vùng da được phân tích (ví dụ: Trán, Má trái, Má phải, Mũi, Cằm).',
    },
    condition: {
      type: Type.STRING,
      description:
        'Tên tình trạng chính của vùng da này (ví dụ: Mụn viêm, Mụn đầu đen, Tăng sắc tố).',
    },
    riskLevel: {
      type: Type.STRING,
      description: "Đánh giá mức độ rủi ro của vùng này: 'Low', 'Medium', 'High'.",
    },
    explanation: {
      type: Type.STRING,
      description: 'Giải thích ngắn gọn về tình trạng của vùng da này.',
    },
    visualEvidence: {
      type: Type.OBJECT,
      description: 'Chi tiết bằng chứng hình ảnh mà AI quan sát được.',
      properties: {
        visualClues: {
          type: Type.STRING,
          description:
            'Mô tả bằng chứng hình ảnh cụ thể (ví dụ: "quan sát thấy các nốt mụn đỏ, sưng viêm, có nhân trắng").',
        },
        reasoning: {
          type: Type.STRING,
          description: 'Lý do tại sao AI đưa ra kết luận này dựa trên bằng chứng hình ảnh.',
        },
        certainty: {
          type: Type.NUMBER,
          description: 'Độ chắc chắn về phân tích vùng này, từ 0.0 đến 1.0 (0% đến 100%).',
        },
      },
      required: ['visualClues', 'reasoning', 'certainty'],
    },
  },
  required: ['zone', 'condition', 'riskLevel', 'explanation', 'visualEvidence'],
};

/**
 * Main analysis response schema with multi-zone analysis
 */
export const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    skinType: {
      type: Type.STRING,
      description:
        'Xác định loại da tổng thể của người dùng (dầu (oily), khô (dry), nhạy cảm (sensitive), hỗn hợp (combination)). Nếu không thể xác định, trả về null.',
    },
    overallSummary: {
      type: Type.STRING,
      description:
        'Tóm tắt tổng quan về tình trạng da trên toàn bộ khuôn mặt, kết hợp các phân tích từ từng vùng.',
    },
    zones: {
      type: Type.ARRAY,
      description:
        'Một danh sách các phân tích chi tiết cho từng vùng da riêng biệt có thể thấy trên khuôn mặt.',
      items: zoneAnalysisSchema,
    },
    recommendations: {
      type: Type.ARRAY,
      description:
        "Danh sách các bước chăm sóc ban đầu an toàn, chung cho toàn bộ khuôn mặt. Nếu có vùng nào rủi ro cao hoặc không chắc chắn, khuyến nghị chính phải là 'Gặp bác sĩ da liễu ngay lập tức'.",
      items: { type: Type.STRING },
    },
    aiReasoning: {
      type: Type.STRING,
      description:
        'Giải thích chi tiết bằng ngôn ngữ tự nhiên, kết hợp cả hình ảnh và triệu chứng văn bản do người dùng cung cấp để đưa ra logic suy luận.',
    },
    isUncertain: {
      type: Type.BOOLEAN,
      description:
        'Đặt thành true nếu AI không chắc chắn về kết quả (ví dụ: ảnh mờ, triệu chứng mâu thuẫn, tình trạng phức tạp). Ngược lại là false.',
    },
    uncertaintyMessage: {
      type: Type.STRING,
      description:
        'Nếu isUncertain là true, cung cấp một thông báo cảnh báo rõ ràng, khuyên người dùng nên gặp bác sĩ. Nếu false, để trống chuỗi này.',
    },
    confidenceScore: {
      type: Type.NUMBER,
      description:
        'Đánh giá độ tin cậy tổng thể của AI cho toàn bộ phân tích, từ 0 đến 100. 100 là cực kỳ chắc chắn.',
    },
  },
  required: [
    'skinType',
    'overallSummary',
    'zones',
    'recommendations',
    'aiReasoning',
    'isUncertain',
    'uncertaintyMessage',
    'confidenceScore',
  ],
};
