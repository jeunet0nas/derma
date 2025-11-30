import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ImagePlaceholder() {
  return (
    <View className="bg-white rounded-3xl p-10 mb-5 border-2 border-dashed border-gray-300">
      <View className="items-center py-4">
        <View className="w-24 h-24 rounded-full bg-slate-100 items-center justify-center mb-5">
          <Ionicons name="image-outline" size={42} color="#94a3b8" />
        </View>
        <Text className="text-lg font-semibold text-slate-900 mb-2">
          Chưa có ảnh nào
        </Text>
        <Text className="text-sm text-slate-500 text-center leading-5">
          Chọn ảnh từ thư viện hoặc chụp ảnh mới
        </Text>
      </View>
    </View>
  );
}
