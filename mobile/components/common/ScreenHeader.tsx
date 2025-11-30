import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenHeaderProps {
  title: string;
}

export default function ScreenHeader({ title }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-[#0a7ea4]"
      style={{ paddingTop: insets.top + 12 }} // Dynamic padding for notch
    >
      <View className="px-5 pb-4">
        <Text className="text-2xl font-bold text-white">{title}</Text>
      </View>
    </View>
  );
}
