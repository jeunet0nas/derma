import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SkinType } from "@/types/api.types";

interface ScoreSectionProps {
  score: number;
  skinType: SkinType | null;
  isUncertain: boolean;
}

const SKIN_TYPE_CONFIG: Record<
  string,
  { emoji: string; color: string; bgColor: string }
> = {
  oily: { emoji: "💧", color: "#3b82f6", bgColor: "#dbeafe" },
  dry: { emoji: "🌵", color: "#f59e0b", bgColor: "#fef3c7" },
  sensitive: { emoji: "🌸", color: "#ec4899", bgColor: "#fce7f3" },
  combination: {
    emoji: "🔄",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
};

export default function ScoreSection({
  score,
  skinType,
  isUncertain,
}: ScoreSectionProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Da khỏe";
    if (score >= 60) return "Da Tốt";
    return "Cần chú ý!";
  };

  const skinTypeConfig =
    skinType && SKIN_TYPE_CONFIG[skinType]
      ? SKIN_TYPE_CONFIG[skinType]
      : { emoji: "❓", color: "#6b7280", bgColor: "#f3f4f6" };

  if (skinType && !SKIN_TYPE_CONFIG[skinType]) {
    console.warn("Unknown skinType:", skinType);
  }

  return (
    <View className="bg-white p-5 mb-4 border-l-4 border-[#0a7ea4]">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <View className="flex-row items-baseline">
            <Text
              className="text-5xl font-bold"
              style={{ color: getScoreColor(score) }}
            >
              {score}
            </Text>
            <Text className="text-2xl text-gray-500 ml-1">/100</Text>
          </View>
          <Text className="text-sm text-gray-800 mt-1">
            {getScoreLabel(score)}
          </Text>
        </View>

        <View
          className={`px-4 py-2 rounded-full ${
            isUncertain ? "bg-amber-100" : "bg-green-100"
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name={isUncertain ? "warning" : "checkmark-circle"}
              size={18}
              color={isUncertain ? "#f59e0b" : "#10b981"}
            />
            <Text
              className={`ml-1.5 font-semibold text-sm ${
                isUncertain ? "text-amber-700" : "text-green-700"
              }`}
            >
              {isUncertain ? "Độ tin cậy thấp" : "Độ tin cậy cao"}
            </Text>
          </View>
        </View>
      </View>

      <View className="h-px bg-gray-200 my-4" />

      <View className="flex-row items-center">
        <View
          className="px-4 py-3 rounded-xl flex-1"
          style={{ backgroundColor: skinTypeConfig.bgColor }}
        >
          <View className="flex-row items-center">
            <Text className="text-3xl mr-3">{skinTypeConfig.emoji}</Text>
            <View className="flex-1">
              <Text className="text-xs text-gray-700 mb-0.5">Loại da</Text>
              <Text
                className="text-lg font-bold"
                style={{ color: skinTypeConfig.color }}
              >
                {skinType || "Chưa xác định"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
