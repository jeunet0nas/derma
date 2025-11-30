import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ScreenHeader from "../common/ScreenHeader";

export default function GuestAccountView() {
  const router = useRouter();

  const features = [
    {
      icon: "checkmark-circle" as const,
      text: "Lưu lịch sử phân tích da không giới hạn",
    },
    {
      icon: "checkmark-circle" as const,
      text: "Theo dõi tiến độ cải thiện làn da",
    },
    {
      icon: "checkmark-circle" as const,
      text: "Nhận tư vấn cá nhân hóa từ AI",
    },
    {
      icon: "checkmark-circle" as const,
      text: "Đồng bộ dữ liệu trên nhiều thiết bị",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScreenHeader title="Tài khoản" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-8 mt-4">
          <View className="w-24 h-24 rounded-full bg-[#0a7ea4] items-center justify-center mb-5">
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text className="text-3xl font-bold text-slate-900 mb-2.5">
            DermaScan AI
          </Text>
        </View>

        {/* Login Button */}
        <Pressable
          className="bg-[#0a7ea4] rounded-2xl py-4 mb-3.5 shadow-md active:opacity-90"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-white text-center font-bold text-base">
            Đăng nhập
          </Text>
        </Pressable>

        {/* Register Button */}
        <Pressable
          className="bg-white border-2 border-[#0a7ea4] rounded-2xl py-4 mb-8 active:bg-slate-50"
          onPress={() => router.push("/(auth)/register")}
        >
          <Text className="text-[#0a7ea4] text-center font-bold text-base">
            Tạo tài khoản mới
          </Text>
        </Pressable>

        {/* Features */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-900 mb-4">
            Lợi ích khi đăng ký
          </Text>

          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center mb-3.5">
              <Ionicons name={feature.icon} size={24} color="#0a7ea4" />
              <Text className="flex-1 ml-3.5 text-slate-700 leading-5">
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Guest Info */}
        <View className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <View className="flex-row items-start">
            <View className="mt-0.5">
              <Ionicons name="information-circle" size={20} color="#0a7ea4" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-semibold text-slate-900 mb-1.5">
                Sử dụng chế độ khách
              </Text>
              <Text className="text-sm text-slate-600 leading-5">
                Bạn vẫn có thể sử dụng app để phân tích da và chat với AI mà
                không cần đăng nhập. Tuy nhiên, dữ liệu sẽ không được lưu.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
