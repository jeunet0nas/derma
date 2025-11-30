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

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    console.log("Register:", { name, email, password });
    // TODO: Implement Firebase registration
  };

  const handleGoogleLogin = () => {
    console.log("Google sign-up");
    // TODO: Implement Google sign-in
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
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-slate-900 mb-2">
              Đăng ký
            </Text>
            <Text className="text-base text-slate-600 text-center">
              Tạo tài khoản miễn phí để bắt đầu
            </Text>
          </View>

          <AuthForm
            isLogin={false}
            email={email}
            password={password}
            name={name}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onNameChange={setName}
            onSubmit={handleRegister}
          />

          <SocialLogin onGoogleLogin={handleGoogleLogin} />

          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-sm text-slate-600">Đã có tài khoản? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-sm font-semibold text-[#0a7ea4]">
                Đăng nhập
              </Text>
            </Pressable>
          </View>

          <Text className="text-xs text-slate-500 text-center mt-6 leading-5">
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <Text className="text-[#0a7ea4]">Điều khoản dịch vụ</Text> và{" "}
            <Text className="text-[#0a7ea4]">Chính sách bảo mật</Text> của chúng
            tôi
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
