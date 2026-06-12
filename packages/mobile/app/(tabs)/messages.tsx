import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api, { ChatMessage } from '@services/api';

interface Conversation {
  id: string;
  name: string;
  sessionId: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [polling, setPolling] = useState(false);
  const messagesEndRef = useRef<ScrollView>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch conversations from sessions
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.getSessions();
        const sessions = response.data || [];
        const convs: Conversation[] = sessions.map((s: any, idx: number) => ({
          id: `conv-${s.id}`,
          name: s.therapistName || 'Therapist',
          sessionId: s.id,
          lastMessage: s.notes || 'No messages yet',
          time: new Date(s.scheduledAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          unread: 0,
          online: false,
        }));
        setConversations(convs);
      } catch (err) {
        // Silently fail - show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages for active chat
  const fetchMessages = useCallback(async () => {
    if (!activeChat) return;
    try {
      const resp = await api.getChatHistory(activeChat.sessionId);
      if (resp.data?.messages) {
        setMessages(resp.data.messages);
      }
    } catch {
      // Silently fail
    }
  }, [activeChat]);

  // Poll for new messages when chat is active
  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      pollIntervalRef.current = setInterval(fetchMessages, 5000);
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
  }, [activeChat, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !activeChat) return;
    setSending(true);
    try {
      await api.sendMessageREST(activeChat.sessionId, inputValue.trim());
      setInputValue('');
      // Fetch messages immediately after sending
      setTimeout(fetchMessages, 500);
    } catch (err) {
      // Silently fail
    } finally {
      setSending(false);
    }
  }, [inputValue, activeChat, fetchMessages]);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat view
  if (activeChat) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          {/* Chat header */}
          <View className="flex-row items-center px-6 py-4 border-b border-surface-tertiary">
            <TouchableOpacity
              onPress={() => setActiveChat(null)}
              className="mr-4"
            >
              <Text className="text-primary-500 text-lg">{'<'}</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-text text-base font-semibold">
                {activeChat.name}
              </Text>
              <Text className="text-xs text-text-tertiary">
                Session chat
              </Text>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={messagesEndRef}
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View className="items-center justify-center py-16">
                <Text className="text-text-secondary text-sm">
                  No messages yet. Start the conversation.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {messages.map((msg) => {
                  const isMe = msg.senderRole === 'CLIENT';
                  return (
                    <View
                      key={msg.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                      }}
                    >
                      <View
                        style={{
                          padding: 12,
                          borderRadius: 16,
                          backgroundColor: isMe ? '#3b82f6' : '#f1f5f9',
                          borderBottomRightRadius: isMe ? 4 : 16,
                          borderBottomLeftRadius: isMe ? 16 : 4,
                        }}
                      >
                        <Text
                          style={{
                            color: isMe ? '#ffffff' : '#0f172a',
                            fontSize: 14,
                            lineHeight: 20,
                          }}
                        >
                          {msg.content}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 10,
                          color: '#94a3b8',
                          marginTop: 4,
                          textAlign: isMe ? 'right' : 'left',
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Message input */}
          <View className="px-6 py-4 border-t border-surface-tertiary">
            <View className="flex-row items-center bg-surface-secondary rounded-xl px-4 py-3">
              <TextInput
                className="flex-1 text-text text-sm"
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity
                className="ml-3 bg-primary-500 rounded-lg px-4 py-1.5"
                onPress={handleSend}
                disabled={sending || !inputValue.trim()}
              >
                <Text className="text-white text-sm font-medium">
                  {sending ? '...' : 'Send'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Conversation list view
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-text text-2xl font-bold mb-4">Messages</Text>
        {/* Search */}
        <View className="flex-row items-center bg-surface-secondary rounded-xl px-4 py-3">
          <View className="w-1.5 h-4 rounded-full bg-text-tertiary mr-3" />
          <TextInput
            className="flex-1 text-text text-sm"
            placeholder="Search conversations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations list */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6">
          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-text-secondary text-sm mt-4">
                Loading conversations...
              </Text>
            </View>
          ) : filteredConversations.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-text-secondary text-sm">
                No conversations yet
              </Text>
            </View>
          ) : (
            filteredConversations.map((conv) => (
              <TouchableOpacity
                key={conv.id}
                activeOpacity={0.7}
                onPress={() => setActiveChat(conv)}
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
                      <Text className="text-text text-sm font-semibold">
                        {conv.name}
                      </Text>
                      <Text className="text-text-tertiary text-xs">
                        {conv.time}
                      </Text>
                    </View>
                    <Text
                      className="text-text-secondary text-xs"
                      numberOfLines={1}
                    >
                      {conv.lastMessage}
                    </Text>
                  </View>
                  {conv.unread > 0 && (
                    <View className="w-5 h-5 rounded-full bg-primary-500 items-center justify-center ml-2">
                      <Text className="text-white text-xs font-bold">
                        {conv.unread}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
