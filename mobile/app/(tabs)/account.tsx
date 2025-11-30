import React from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import ScreenHeader from "../../components/common/ScreenHeader";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const isLoggedIn = !!user;

  const menuItems = [
    {
      icon: "person-circle-outline" as const,
      title: "Thông tin cá nhân",
      subtitle: "Cập nhật thông tin của bạn",
      onPress: () => console.log("Profile"),
    },
    {
      icon: "time-outline" as const,
      title: "Lịch sử phân tích",
      subtitle: "Xem các kết quả đã lưu",
      onPress: () => console.log("History"),
    },
    {
      icon: "notifications-outline" as const,
      title: "Thông báo",
      subtitle: "Quản lý thông báo",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: "settings-outline" as const,
      title: "Cài đặt",
      subtitle: "Tùy chỉnh ứng dụng",
      onPress: () => console.log("Settings"),
    },
    {
      icon: "help-circle-outline" as const,
      title: "Trợ giúp & Hỗ trợ",
      subtitle: "Câu hỏi thường gặp",
      onPress: () => console.log("Help"),
    },
  ];

  if (!isLoggedIn) {
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

            {[
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
            ].map((feature, index) => (
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

  // Logged in view
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScreenHeader title="Tài khoản" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="bg-white rounded-3xl p-6 mb-5 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-full bg-[#0a7ea4] items-center justify-center">
              <Text className="text-3xl font-bold text-white">
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-xl font-bold text-slate-900 mb-1.5">
                {user?.displayName || "Người dùng"}
              </Text>
              <Text className="text-sm text-slate-500">{user?.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-3xl p-2 mb-5 shadow-sm">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              className={`flex-row items-center p-4 active:bg-slate-50 rounded-2xl ${
                index < menuItems.length - 1 ? "mb-1" : ""
              }`}
              onPress={item.onPress}
            >
              <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center">
                <Ionicons name={item.icon} size={20} color="#0a7ea4" />
              </View>
              <View className="flex-1 ml-3.5">
                <Text className="text-base font-semibold text-slate-900 mb-0.5">
                  {item.title}
                </Text>
                <Text className="text-sm text-slate-500 leading-5">
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable
          className="bg-red-50 border border-red-200 rounded-2xl py-4 active:bg-red-100"
          onPress={() => {
            Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
              { text: "Hủy", style: "cancel" },
              {
                text: "Đăng xuất",
                style: "destructive",
                onPress: async () => {
                  try {
                    await logout();
                  } catch (error: any) {
                    Alert.alert("Lỗi", error.message);
                  }
                },
              },
            ]);
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="ml-2 text-red-600 font-semibold text-base">
              Đăng xuất
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
