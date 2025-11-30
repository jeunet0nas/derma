import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatComposer from "@/components/chatbot/ChatComposer";
import MessageBubble, { ChatSender } from "@/components/chatbot/MessageBubble";
import ScreenHeader from "@/components/common/ScreenHeader";

interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: number;
}

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const TypingIndicator = () => (
  <View className="flex-row items-center px-5 py-2">
    <View className="w-2 h-2 rounded-full bg-slate-400 mr-1" />
    <View className="w-2 h-2 rounded-full bg-slate-400 opacity-65 mx-1" />
    <View className="w-2 h-2 rounded-full bg-slate-400 mr-1" />
    <Text className="text-sm text-slate-600 ml-2">
      Trợ lý đang soạn phản hồi...
    </Text>
  </View>
);

const ChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      sender: "bot",
      text: "Xin chào! Tôi là trợ lý chăm sóc da ảo. Bạn muốn mình hỗ trợ điều gì hôm nay?",
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const pushMessage = useCallback((sender: ChatSender, text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        sender,
        text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const generateBotReply = useCallback((userMessage: string): string => {
    if (userMessage.length < 3) {
      return "Mình chưa hiểu rõ câu hỏi. Bạn mô tả chi tiết hơn giúp mình nhé!";
    }

    if (/mụn|acne|nổi/.test(userMessage.toLowerCase())) {
      return "Để kiểm soát mụn, bạn nên làm sạch dịu nhẹ hai lần mỗi ngày, dùng sản phẩm chứa BHA hoặc retinoid phù hợp, đồng thời dưỡng ẩm không gây bít tắc. Nếu mụn viêm nặng, hãy gặp bác sĩ da liễu.";
    }

    if (/dưỡng ẩm|khô|hydration/.test(userMessage.toLowerCase())) {
      return "Bạn có thể ưu tiên sữa rửa mặt dịu nhẹ, thêm serum chứa hyaluronic acid và khóa ẩm với kem có ceramide. Đừng quên uống đủ nước và hạn chế điều hòa quá lạnh.";
    }

    return "Mình đã ghi nhận thắc mắc của bạn. Bạn có thể chia sẻ thêm về loại da, tình trạng hiện tại hoặc sản phẩm bạn đang dùng để mình tư vấn cụ thể hơn nhé!";
  }, []);

  const handleSend = useCallback(
    (userText: string) => {
      pushMessage("user", userText);
      setIsTyping(true);

      setTimeout(() => {
        const reply = generateBotReply(userText);
        pushMessage("bot", reply);
        setIsTyping(false);
      }, 900);
    },
    [generateBotReply, pushMessage]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble
        sender={item.sender}
        text={item.text}
        timestamp={item.timestamp}
      />
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScreenHeader title="Trợ lý AI" />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
      {isTyping && <TypingIndicator />}
      <ChatComposer onSend={handleSend} disabled={isTyping} />
    </SafeAreaView>
  );
};

export default ChatbotScreen;
