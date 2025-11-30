import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

export default function LoadingState({
  title = "Đang phân tích da...",
  subtitle = "AI đang xử lý hình ảnh của bạn",
}: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <View className="bg-white p-8 items-center" style={{ width: "90%" }}>
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          {title}
        </Text>
        <Text className="text-sm text-gray-600 mt-2 text-center">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
