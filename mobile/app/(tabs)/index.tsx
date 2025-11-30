import React, { useState } from "react";
import { ScrollView, Alert, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { analyzeSkin } from "@/api/services/analysis.service";
import { convertImageToBase64, validateImage } from "@/utils/imageConverter";
import { handleApiError } from "@/api/client";
import type { AnalysisResult } from "@/types/api.types";
import * as ImagePicker from "expo-image-picker";
import ImagePreview from "../../components/analysis/ImagePreview";
import ImagePlaceholder from "../../components/analysis/ImagePlaceholder";
import ActionButtons from "../../components/analysis/ActionButtons";
import TipsCard from "../../components/analysis/TipsCard";
import ScreenHeader from "../../components/common/ScreenHeader";

export default function AnalysisScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Vui lòng cấp quyền sử dụng camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      Alert.alert("Lỗi", "Vui lòng chọn ảnh trước");
      return;
    }

    setIsAnalyzing(true);

    try {
      // ===== STEP 1: VALIDATE ẢNH =====
      console.log("📋 [Step 1] Validating image...");
      const validation = await validateImage(selectedImage);

      if (!validation.valid) {
        Alert.alert(
          "Ảnh không hợp lệ",
          validation.error || "Vui lòng chọn ảnh khác"
        );
        return;
      }
      console.log("✅ [Step 1] Validation passed");

      // ===== STEP 2: CONVERT TO BASE64 =====
      console.log("🔄 [Step 2] Converting to base64...");
      const base64Image = await convertImageToBase64(selectedImage);
      console.log("✅ [Step 2] Converted! Length:", base64Image.length);

      // ===== STEP 3: CALL API =====
      console.log("🚀 [Step 3] Calling API...");
      const result = await analyzeSkin(base64Image, true); // includeExpertInfo = true
      console.log("✅ [Step 3] Analysis complete!", {
        skinType: result.skinType,
        zones: result.zones.length,
        score: result.confidenceScore,
      });

      // ===== STEP 4: LƯU KẾT QUẢ =====
      setAnalysisResult(result);

      // ===== STEP 5: HIỂN THỊ KẾT QUẢ =====
      Alert.alert(
        "🎉 Phân tích thành công!",
        `Loại da: ${result.skinType || "Chưa xác định"}\n` +
          `Điểm: ${result.confidenceScore}/100\n` +
          `Số vùng: ${result.zones.length}\n` +
          `Độ tin cậy: ${result.isUncertain ? "⚠️ Thấp" : "✅ Cao"}`,
        [
          { text: "Xem chi tiết", onPress: () => console.log(result) },
          { text: "OK" },
        ]
      );
    } catch (error: any) {
      console.error("❌ [Error] Analysis failed:", error);

      const errorMessage = handleApiError(error);
      Alert.alert("Lỗi phân tích", errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScreenHeader title="Phân tích da" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {selectedImage ? (
          <ImagePreview
            imageUri={selectedImage}
            onRemove={() => setSelectedImage(null)}
            onAnalyze={handleAnalyze}
            isLoading={isAnalyzing}
          />
        ) : (
          <ImagePlaceholder />
        )}

        <ActionButtons onTakePhoto={takePhoto} onPickImage={pickImage} />

        <TipsCard />
      </ScrollView>
    </SafeAreaView>
  );
}
