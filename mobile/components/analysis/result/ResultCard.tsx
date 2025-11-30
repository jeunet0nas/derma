import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AnalysisResult } from "@/types/api.types";
import ScoreSection from "./ScoreSection";
import ZonesAccordion from "./ZonesAccordion";
import RecommendationsSection from "./RecommendationsSection";
import ExpertInfoSection from "./ExpertInfoSection";

interface ResultCardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  onAnalyzeAgain: () => void;
}

export default function ResultCard({
  result,
  isLoading,
  onAnalyzeAgain,
}: ResultCardProps) {
  // Loading State
  if (isLoading || !result) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="bg-white p-8 items-center" style={{ width: "90%" }}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-lg font-semibold text-gray-900 mt-4">
            Đang phân tích da...
          </Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">
            AI đang xử lý hình ảnh của bạn
          </Text>
        </View>
      </View>
    );
  }

  // Loaded State with Data
  return (
    <View>
      {/* Header */}
      <View
        className="bg-cyan-600 p-4 mb-4"
        style={{ backgroundColor: "#0891b2" }}
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-white/25 items-center justify-center mr-3">
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">
              Kết quả phân tích
            </Text>
            <Text className="text-white/85 text-xs">
              {new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Score Section */}
      <ScoreSection
        score={result.confidenceScore}
        skinType={result.skinType}
        isUncertain={result.isUncertain}
      />

      {/* Recommendations */}
      <RecommendationsSection
        summary={result.overallSummary}
        recommendations={result.recommendations}
        safetyNote={result.safetyNote}
      />

      {/* Zones Details */}
      <ZonesAccordion zones={result.zones} />

      {/* Expert Info */}
      <ExpertInfoSection expertInfo={result.expertInfo} />

      {/* Uncertainty Warning */}
      {result.isUncertain && result.uncertaintyReason && (
        <View className="bg-amber-50 p-4 mb-4 border-l-4 border-amber-400">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={22} color="#f59e0b" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-semibold text-amber-900 mb-1">
                Lưu ý về độ tin cậy
              </Text>
              <Text className="text-sm text-amber-800 leading-5">
                {result.uncertaintyReason}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View className="px-4 pb-4">
        <TouchableOpacity
          onPress={onAnalyzeAgain}
          activeOpacity={0.8}
          className="bg-cyan-600 rounded-xl py-3.5"
          style={{ backgroundColor: "#0891b2" }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="camera" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Phân tích ảnh khác
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
