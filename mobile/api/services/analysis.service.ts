import apiClient from "../client";
import {
  ApiResponse,
  AnalyzeSkinRequest,
  AnalyzeSkinResponse,
  AnalysisResult,
  HealthCheckResponse,
} from "@/types/api.types";

/**
 * Health Check - Test kết nối backend
 */
export const checkHealth = async (): Promise<HealthCheckResponse> => {
  const response =
    await apiClient.get<ApiResponse<HealthCheckResponse>>("/health");
  return response.data.data;
};

/**
 * Analyze Skin - Phân tích da từ ảnh
 *
 * @param imageBase64 - Base64 string với prefix "data:image/jpeg;base64,..."
 * @param includeExpertInfo - Có lấy expert info từ RAG không?
 * @returns AnalysisResult với skinType, zones, recommendations
 *
 * Example:
 * ```ts
 * const result = await analyzeSkin(
 *   "data:image/jpeg;base64,/9j/4AAQ...",
 *   true
 * );
 * console.log(result.skinType); // "combination"
 * console.log(result.zones.length); // 5
 * ```
 */
export const analyzeSkin = async (
  imageBase64: string,
  includeExpertInfo: boolean = false
): Promise<AnalysisResult> => {
  // Tạo request payload
  const payload: AnalyzeSkinRequest = {
    image: imageBase64,
    includeExpertInfo,
  };

  // POST đến /api/v1/analysis/skin
  const response = await apiClient.post<ApiResponse<AnalyzeSkinResponse>>(
    "/api/v1/analysis/skin",
    payload
  );

  // Unwrap: response.data.data.result
  return response.data.data.result;
};

/**
 * Generate Heatmap - Tạo SVG overlay heatmap
 * (Có thể implement sau nếu cần)
 */
export const generateHeatmap = async (
  imageBase64: string,
  analysisResult: AnalysisResult
): Promise<string> => {
  // TODO: Implement nếu cần heatmap visualization
  throw new Error("Not implemented yet");
};
