import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function ScreenHeader({
  title,
  showBackButton = false,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="bg-[#0a7ea4]"
      style={{ paddingTop: insets.top + 12 }} // Dynamic padding for notch
    >
      <View className="px-5 pb-4">
        <View className="flex-row items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 w-8 h-8 items-center justify-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          <Text className="text-2xl font-bold text-white flex-1">{title}</Text>
        </View>
      </View>
    </View>
  );
}
