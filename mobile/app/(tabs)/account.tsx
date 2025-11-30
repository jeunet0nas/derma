import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAnalysisHistory,
  deleteAnalysis,
} from "@/api/services/analysis.service";
import { handleApiError } from "@/api/client";
import type { SavedAnalysis } from "@/types/api.types";
import ScreenHeader from "../../components/common/ScreenHeader";
import HistoryItem from "../../components/account/HistoryItem";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Load history when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      // Small delay to ensure token is ready after login/register
      const timer = setTimeout(() => {
        loadHistory();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // Clear history when logged out
      setHistory([]);
    }
  }, [isLoggedIn]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getAnalysisHistory(50);
      setHistory(data.analyses);
    } catch (error: any) {
      const errorMsg = handleApiError(error);
      Alert.alert("Lỗi", errorMsg);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleDeleteHistory = (id: string) => {
    Alert.alert(
      "Xóa phân tích",
      "Bạn có chắc muốn xóa kết quả phân tích này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAnalysis(id);
              setHistory((prev) => prev.filter((item) => item.id !== id));
              Alert.alert("Thành công", "Đã xóa phân tích");
            } catch (error: any) {
              const errorMsg = handleApiError(error);
              Alert.alert("Lỗi", errorMsg);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: "person-circle-outline" as const,
      title: "Thông tin cá nhân",
      subtitle: "Cập nhật thông tin của bạn",
      onPress: () => console.log("Profile"),
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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

        {/* Analysis History Section */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-lg font-bold text-slate-900">
              Lịch sử phân tích
            </Text>
            <Text className="text-sm text-slate-500">
              {history.length} kết quả
            </Text>
          </View>

          {loadingHistory && !refreshing ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <ActivityIndicator size="large" color="#0a7ea4" />
              <Text className="text-sm text-slate-500 mt-3">
                Đang tải lịch sử...
              </Text>
            </View>
          ) : history.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#cbd5e1"
              />
              <Text className="text-base font-semibold text-slate-900 mt-3 mb-2">
                Chưa có lịch sử
              </Text>
              <Text className="text-sm text-slate-500 text-center">
                Bắt đầu phân tích da để lưu kết quả vào đây
              </Text>
            </View>
          ) : (
            <View>
              {history
                .slice(0, showAllHistory ? history.length : 3)
                .map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteHistory}
                  />
                ))}
              {history.length > 3 && !showAllHistory && (
                <Pressable
                  className="bg-slate-100 rounded-xl py-3 mx-4 mt-2 active:bg-slate-200"
                  onPress={() => setShowAllHistory(true)}
                >
                  <Text className="text-center text-sm font-semibold text-[#0a7ea4]">
                    Xem thêm {history.length - 3} kết quả
                  </Text>
                </Pressable>
              )}
              {showAllHistory && history.length > 3 && (
                <Pressable
                  className="bg-slate-100 rounded-xl py-3 mx-4 mt-2 active:bg-slate-200"
                  onPress={() => setShowAllHistory(false)}
                >
                  <Text className="text-center text-sm font-semibold text-[#0a7ea4]">
                    Thu gọn
                  </Text>
                </Pressable>
              )}
            </View>
          )}
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
                    setHistory([]); // Clear history on logout
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
