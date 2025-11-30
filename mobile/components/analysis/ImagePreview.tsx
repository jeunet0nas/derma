import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImagePreviewProps {
  imageUri: string;
  onRemove: () => void;
  onAnalyze: () => void;
  isLoading?: boolean;
}

export default function ImagePreview({
  imageUri,
  onRemove,
  onAnalyze,
  isLoading = false, // ← DEFAULT FALSE
}: ImagePreviewProps) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm mb-5">
      <Image
        source={{ uri: imageUri }}
        className="w-full h-80 rounded-xl"
        resizeMode="cover"
      />

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          className="flex-1 py-4 rounded-xl border-2 border-gray-200"
          onPress={onRemove}
          disabled={isLoading} // ← DISABLE KHI LOADING
        >
          <Text className="text-center text-gray-700 font-semibold">
            Chọn lại
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-4 rounded-xl ${
            isLoading ? "bg-gray-400" : "bg-[#0a7ea4]" // ← GRAY KHI LOADING
          }`}
          onPress={onAnalyze}
          disabled={isLoading} // ← DISABLE KHI LOADING
        >
          <Text className="text-center text-white font-bold">
            {isLoading ? "⏳ Đang phân tích..." : "🔍 Phân tích"}{" "}
            {/* ← TEXT THAY ĐỔI */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
