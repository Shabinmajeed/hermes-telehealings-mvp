import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'heali';
  timestamp: string;
}

const QUICK_PROMPTS = [
  "I'm feeling anxious today",
  "Help me sleep better",
  "I need motivation",
  "Teach me breathing exercises",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hi! I'm Heali, your wellness companion. How are you feeling today?",
    sender: 'heali',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const HEALI_RESPONSES: Record<string, string> = {
  anxious: "I hear you. Anxiety can feel overwhelming. Let's try a quick grounding exercise: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Take your time.",
  sleep: "Sleep is so important for mental health. Here are some tips: Try to keep a consistent bedtime, avoid screens 1 hour before bed, and consider a calming routine like reading or a warm bath. Would you like a guided relaxation exercise?",
  motivation: "You're already taking a great step by being here. Remember that progress isn't always linear — every small step counts. What's one small thing you could do today that would make you feel proud?",
  breathing: "Let's try Box Breathing together: Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat 4 times. Ready to try? I'll guide you through it.",
  default: "Thank you for sharing. I'm here to listen and support you. Tell me more about what's on your mind, or try one of the quick prompts below.",
};

function getHealiResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worried')) {
    return HEALI_RESPONSES.anxious;
  }
  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
    return HEALI_RESPONSES.sleep;
  }
  if (lower.includes('motivation') || lower.includes('motivated') || lower.includes('energy')) {
    return HEALI_RESPONSES.motivation;
  }
  if (lower.includes('breathing') || lower.includes('breath') || lower.includes('calm')) {
    return HEALI_RESPONSES.breathing;
  }
  return HEALI_RESPONSES.default;
}

export default function HealiChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const healiMsg: Message = {
        id: Date.now() + 1,
        text: getHealiResponse(text),
        sender: 'heali',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, healiMsg]);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-surface-tertiary">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <View className="w-8 h-8 rounded-full bg-surface-secondary items-center justify-center">
              <Text className="text-text text-sm">←</Text>
            </View>
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
            <View className="w-2 h-5 rounded-full bg-primary-500" />
          </View>
          <View className="flex-1">
            <Text className="text-text text-base font-semibold">Heali</Text>
            <Text className="text-success text-xs">Online • Wellness Companion</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-6 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary-500 rounded-br-md'
                    : 'bg-surface-secondary rounded-bl-md'
                }`}
              >
                <Text
                  className={`text-sm leading-relaxed ${
                    msg.sender === 'user' ? 'text-white' : 'text-text'
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
              <Text className="text-text-tertiary text-xs mt-1 px-1">
                {msg.timestamp}
              </Text>
            </View>
          ))}

          {isTyping && (
            <View className="items-start mb-3">
              <View className="bg-surface-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <View className="flex-row gap-1">
                  <View className="w-2 h-2 rounded-full bg-text-tertiary" />
                  <View className="w-2 h-2 rounded-full bg-text-tertiary" />
                  <View className="w-2 h-2 rounded-full bg-text-tertiary" />
                </View>
              </View>
            </View>
          )}

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <View className="mt-4">
              <Text className="text-text-tertiary text-xs mb-2 px-1">Quick prompts</Text>
              <View className="flex-row flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    activeOpacity={0.7}
                    onPress={() => sendMessage(prompt)}
                    className="px-3 py-2 rounded-full border border-primary-200 bg-primary-50"
                  >
                    <Text className="text-primary-600 text-xs font-medium">{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-6 py-4 border-t border-surface-tertiary">
          <View className="flex-row items-center bg-surface-secondary rounded-2xl px-4 py-2">
            <TextInput
              className="flex-1 text-text text-sm py-1"
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => sendMessage(input)}
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
