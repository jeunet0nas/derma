import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TipsCard() {
  return (
    <View className="bg-amber-50 rounded-2xl p-5 mb-5 border border-amber-200">
      <View className="flex-row items-start">
        <View className="mt-0.5">
          <Ionicons name="bulb" size={22} color="#f59e0b" />
        </View>
        <View className="flex-1 ml-3.5">
          <Text className="text-sm font-semibold text-amber-900 mb-2.5">
            Mẹo chụp ảnh tốt nhất:
          </Text>
          <Text className="text-sm text-amber-800 leading-6">
            • Chụp ở nơi có ánh sáng tự nhiên{"\n"}• Không trang điểm để kết quả
            chính xác{"\n"}• Chụp thẳng mặt, tránh góc nghiêng{"\n"}• Đảm bảo
            khuôn mặt không bị che
          </Text>
        </View>
      </View>
    </View>
  );
}
