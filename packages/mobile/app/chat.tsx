import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

const CONVERSATION = [
  { id: 1, name: 'Dr. Sarah Chen', lastMessage: 'Looking forward to our session today.', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Dr. Michael Torres', lastMessage: 'How have you been feeling this week?', time: '1h ago', unread: 0, online: false },
  { id: 3, name: 'Heali', lastMessage: 'Don\'t forget to log your mood today!', time: '3h ago', unread: 1, online: true },
  { id: 4, name: 'Support Team', lastMessage: 'Your journal entry has been reviewed.', time: '1d ago', unread: 0, online: false },
  { id: 5, name: 'Dr. Emily Park', lastMessage: 'Great progress this week. Keep it up!', time: '2d ago', unread: 0, online: true },
];

export default function ChatScreen() {
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: 'Hi! Ready for today\'s session?', sender: 'them', timestamp: '10:30 AM' },
    { id: 2, text: 'Yes, looking forward to it!', sender: 'me', timestamp: '10:31 AM' },
    { id: 3, text: 'Great. Is there anything specific you\'d like to discuss?', sender: 'them', timestamp: '10:32 AM' },
  ]);

  const activeConversation = CONVERSATION.find((c) => c.id === activeChat);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  // Chat view
  if (activeChat !== null && activeConversation) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Chat header */}
          <View className="flex-row items-center px-6 py-4 border-b border-surface-tertiary">
            <TouchableOpacity onPress={() => setActiveChat(null)} className="mr-3">
              <View className="w-8 h-8 rounded-full bg-surface-secondary items-center justify-center">
                <Text className="text-text text-sm">←</Text>
              </View>
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
              <View className="w-1 h-5 rounded-full bg-primary-500" />
            </View>
            <View className="flex-1">
              <Text className="text-text text-base font-semibold">{activeConversation.name}</Text>
              {activeConversation.online && (
                <Text className="text-success text-xs">Online</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => router.push('/session-delivery')} className="w-9 h-9 rounded-full bg-primary-50 items-center justify-center">
              <Text className="text-primary-500 text-sm">📹</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {messages.map((msg) => (
              <View key={msg.id} className={`mb-3 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'me' ? 'bg-primary-500 rounded-br-md' : 'bg-surface-secondary rounded-bl-md'
                }`}>
                  <Text className={`text-sm leading-relaxed ${msg.sender === 'me' ? 'text-white' : 'text-text'}`}>
                    {msg.text}
                  </Text>
                </View>
                <Text className="text-text-tertiary text-xs mt-1 px-1">{msg.timestamp}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View className="px-6 py-4 border-t border-surface-tertiary">
            <View className="flex-row items-center bg-surface-secondary rounded-2xl px-4 py-2">
              <TextInput
                className="flex-1 text-text text-sm py-1"
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={sendMessage}
                disabled={!input.trim()}
                className={`ml-2 w-9 h-9 rounded-full items-center justify-center ${
                  input.trim() ? 'bg-primary-500' : 'bg-neutral-200'
                }`}
              >
                <Text className="text-white text-sm">↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Conversation list
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <Text className="text-text text-2xl font-bold mb-4">Messages</Text>
          <View className="flex-row items-center bg-surface-secondary rounded-xl px-4 py-3">
            <View className="w-1.5 h-4 rounded-full bg-text-tertiary mr-3" />
            <TextInput
              className="flex-1 text-text text-sm"
              placeholder="Search conversations..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Conversations */}
        <View className="px-6">
          {CONVERSATION.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              activeOpacity={0.7}
              onPress={() => setActiveChat(conv.id)}
            >
              <View className="flex-row items-center py-4 border-b border-surface-tertiary">
                <View className="relative mr-3">
                  <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center">
                    <View className="w-1.5 h-6 rounded-full bg-primary-500" />
                  </View>
                  {conv.online && (
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-text text-sm font-semibold">{conv.name}</Text>
                    <Text className="text-text-tertiary text-xs">{conv.time}</Text>
                  </View>
                  <Text className="text-text-secondary text-xs" numberOfLines={1}>
                    {conv.lastMessage}
                  </Text>
                </View>
                {conv.unread > 0 && (
                  <View className="w-5 h-5 rounded-full bg-primary-500 items-center justify-center ml-2">
                    <Text className="text-white text-xs font-bold">{conv.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
