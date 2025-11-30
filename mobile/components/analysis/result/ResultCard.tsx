import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveAnalysis } from "@/hooks/useSaveAnalysis";
import type { AnalysisResult } from "@/types/api.types";
import ScoreSection from "./ScoreSection";
import ZonesAccordion from "./ZonesAccordion";
import RecommendationsSection from "./RecommendationsSection";
import ExpertInfoSection from "./ExpertInfoSection";
import SaveButton from "./SaveButton";
import UncertaintyWarning from "./UncertaintyWarning";
import LoadingState from "../LoadingState";

interface ResultCardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  onAnalyzeAgain: () => void;
  imageBase64?: string;
  savedAnalysisId?: string;
  readOnly?: boolean;
}

export default function ResultCard({
  result,
  isLoading,
  onAnalyzeAgain,
  imageBase64,
  savedAnalysisId,
  readOnly = false,
}: ResultCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaving, currentSavedId, handleSave } =
    useSaveAnalysis(savedAnalysisId);

  // Loading State
  if (isLoading || !result) {
    return <LoadingState />;
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
        <UncertaintyWarning reason={result.uncertaintyReason} />
      )}

      {/* Action Buttons */}
      <View className="px-4 pb-4 gap-3">
        {/* Save Analysis Button */}
        {!readOnly && (
          <SaveButton
            user={user}
            isSaving={isSaving}
            isSaved={!!currentSavedId}
            onSave={() => handleSave(result, imageBase64)}
            onLogin={() => router.push("/(auth)/login")}
          />
        )}

        {/* Analyze Again Button */}
        {!readOnly && (
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
        )}
      </View>
    </View>
  );
}
