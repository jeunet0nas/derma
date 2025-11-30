import React from "react";
import { View, Image, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImagePreviewProps {
  imageUri: string;
  onRemove: () => void;
  onAnalyze: () => void;
}

export default function ImagePreview({
  imageUri,
  onRemove,
  onAnalyze,
}: ImagePreviewProps) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-5 shadow-sm">
      <View className="relative">
        <Image
          source={{ uri: imageUri }}
          className="w-full h-80 rounded-2xl"
          resizeMode="cover"
        />
        <Pressable
          className="absolute top-3 right-3 bg-white/95 rounded-full p-2.5 shadow-lg active:opacity-70"
          onPress={onRemove}
        >
          <Ionicons name="close" size={20} color="#ef4444" />
        </Pressable>
      </View>

      <Pressable
        className="bg-[#0a7ea4] rounded-xl py-4 mt-5 shadow-md active:opacity-90"
        onPress={onAnalyze}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="sparkles" size={22} color="white" />
          <Text className="text-white text-center font-bold text-base ml-2">
            Phân tích ngay
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
