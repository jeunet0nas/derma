import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AuthForm from "../../components/auth/AuthForm";
import SocialLogin from "../../components/auth/SocialLogin";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login:", { email, password });
    // TODO: Implement Firebase authentication
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    // TODO: Implement Google sign-in
  };

  const handleForgotPassword = () => {
    console.log("Forgot password");
    // TODO: Implement forgot password flow
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-4 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-[#0a7ea4] items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-slate-900 mb-2">
              Đăng nhập
            </Text>
            <Text className="text-base text-slate-600 text-center">
              Chào mừng trở lại! Đăng nhập để tiếp tục
            </Text>
          </View>

          <AuthForm
            isLogin={true}
            email={email}
            password={password}
            name=""
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onNameChange={() => {}}
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
          />

          <SocialLogin onGoogleLogin={handleGoogleLogin} />

          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-sm text-slate-600">Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-sm font-semibold text-[#0a7ea4]">
                Đăng ký ngay
              </Text>
            </Pressable>
          </View>

          <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#0a7ea4" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-semibold text-slate-900 mb-1">
                  Chế độ khách
                </Text>
                <Text className="text-sm text-slate-600 leading-5">
                  Bạn có thể sử dụng app mà không cần đăng nhập, nhưng lịch sử
                  phân tích sẽ không được lưu.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
