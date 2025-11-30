export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  requestId?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  requestId?: string;
}

export type SkinType =
  | "dầu (oily)"
  | "khô (dry)"
  | "nhạy cảm (sensitive)"
  | "hỗn hợp (combination)";
export type RiskLevel = "Low" | "Medium" | "High";

export interface VisualEvidence {
  visualClues: string;
  reasoning: string;
  certainty: number;
}

export interface ZoneAnalysis {
  zone: string;
  condition: string;
  riskLevel: RiskLevel;
  visualEvidence: VisualEvidence;
  explanation: string;
}

export interface RagSource {
  sourceName: string;
  url: string;
}

export interface ExpertInfo {
  answer: string;
  sources: RagSource[];
}

export interface AnalysisResult {
  skinType: SkinType | null;
  zones: ZoneAnalysis[];
  overallSummary: string;
  recommendations: string[];
  safetyNote: string;
  isUncertain: boolean;
  uncertaintyReason?: string;
  confidenceScore: number; // 0-100
  heatmapImageUrl?: string;
  expertInfo?: ExpertInfo;
}

export interface AnalyzeSkinRequest {
  image: string;
  includeExpertInfo?: boolean;
}

export interface AnalyzeSkinResponse {
  analysisId: string;
  result: AnalysisResult;
}

export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  service: string;
}
