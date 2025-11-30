import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecommendationsSectionProps {
  summary: string;
  recommendations: string[];
  safetyNote: string;
}

export default function RecommendationsSection({
  summary,
  recommendations,
  safetyNote,
}: RecommendationsSectionProps) {
  return (
    <View className="bg-white p-5 mb-4 border-l-4 border-[#0a7ea4]">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Ionicons name="heart-outline" size={22} color="#0a7ea4" />
        <Text className="text-lg font-bold text-slate-900 ml-2">
          Lời khuyên chăm sóc
        </Text>
      </View>

      {/* Summary */}
      <View className="bg-blue-50 p-4 mb-4 border-l-2 border-blue-300">
        <Text className="text-sm text-slate-800 leading-6">{summary}</Text>
      </View>

      {/* Recommendations List */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-800 mb-3">
          Các bước thực hiện:
        </Text>
        <View className="gap-2.5">
          {recommendations.map((rec, index) => (
            <View key={index} className="flex-row items-start">
              {/* Bullet Point */}
              <View className="mt-2">
                <View className="w-1.5 h-1.5 rounded-full bg-[#0a7ea4]" />
              </View>

              {/* Text */}
              <Text className="flex-1 ml-3 text-sm text-gray-900 leading-6">
                {rec}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Note */}
      <View className="bg-amber-50 p-4 border-l-2 border-amber-400">
        <View className="flex-row items-start">
          <Ionicons name="warning-outline" size={20} color="#f59e0b" />
          <View className="flex-1 ml-3">
            <Text className="text-xs font-semibold text-amber-900 mb-1">
              LƯU Ý AN TOÀN
            </Text>
            <Text className="text-sm text-amber-800 leading-5">
              {safetyNote}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
