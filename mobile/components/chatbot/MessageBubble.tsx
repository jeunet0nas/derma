import React from "react";
import { Text, View } from "react-native";

export type ChatSender = "user" | "bot";

export interface MessageBubbleProps {
  sender: ChatSender;
  text: string;
  timestamp?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <View
      className={`w-full px-4 mb-3 ${isUser ? "items-end" : "items-start"}`}
    >
      <View
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
          isUser ? "bg-[#0a7ea4] rounded-br-sm" : "bg-gray-100 rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-[15px] leading-5 ${isUser ? "text-white" : "text-gray-900"}`}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
