import { useState } from "react";
import { Alert } from "react-native";
import { analyzeSkin } from "@/api/services/analysis.service";
import { convertImageToBase64, validateImage } from "@/utils/imageConverter";
import type { AnalysisResult } from "@/types/api.types";

export const useAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const analyze = async (imageUri: string) => {
    if (!imageUri) {
      Alert.alert("Lỗi", "Vui lòng chọn ảnh trước");
      return;
    }

    // Show result screen immediately with loading state
    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      // Step 1: Validate image
      const validation = await validateImage(imageUri);

      if (!validation.valid) {
        Alert.alert(
          "Ảnh không hợp lệ",
          validation.error || "Vui lòng chọn ảnh khác"
        );
        setIsAnalyzing(false);
        return;
      }

      // Step 2: Convert to base64
      const base64Image = await convertImageToBase64(imageUri);
      setImageBase64(base64Image);

      // Step 3: Call API
      const result = await analyzeSkin(base64Image, true);

      // Step 4: Display result
      setAnalysisResult(result);
    } catch (error: any) {
      throw error; // Let caller handle error display
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysisResult(null);
    setImageBase64(null);
  };

  return {
    analysisResult,
    isAnalyzing,
    imageBase64,
    analyze,
    reset,
  };
};
