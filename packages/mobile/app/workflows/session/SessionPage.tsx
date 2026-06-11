import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line, Polygon, Rect, Polyline } from 'react-native-svg';

/* ─────────────────────────────────────────────
   SVG Icon Components
   ───────────────────────────────────────────── */
const MicOnIcon = ({ color = '#ffffff', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const MicOffIcon = ({ color = '#1e293b', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="1" y1="1" x2="23" y2="23" />
    <Path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <Path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const CameraOnIcon = ({ color = '#ffffff', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Svg>
);

const CameraOffIcon = ({ color = '#1e293b', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="1" y1="1" x2="23" y2="23" />
    <Path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
  </Svg>
);

const ChatIcon = ({ color = '#ffffff', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

const EndCallIcon = ({ color = '#ffffff', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <Line x1="23" y1="1" x2="1" y2="23" />
  </Svg>
);

const CloseIcon = ({ color = '#64748b', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const SendIcon = ({ color = '#ffffff', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="22" y1="2" x2="11" y2="13" />
    <Polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Svg>
);

/* ─────────────────────────────────────────────
   Chat Message Interface
   ───────────────────────────────────────────── */
interface ChatMessage {
  id: number;
  text: string;
  sender: 'local' | 'remote';
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    text: "Hi Ajesh! I'm here. Let me know when you're ready to start.",
    sender: 'remote',
    time: 'Just now',
  },
];

/* ─────────────────────────────────────────────
   Session Page (Video Call)
   ───────────────────────────────────────────── */
export default function SessionPage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  const chatPanelTranslateY = useRef(new Animated.Value(120)).current;
  const chatOverlayOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulsing red dot animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleChat = () => {
    if (isChatOpen) {
      Animated.parallel([
        Animated.timing(chatPanelTranslateY, {
          toValue: 120,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(chatOverlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsChatOpen(false));
    } else {
      setIsChatOpen(true);
      Animated.parallel([
        Animated.timing(chatPanelTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(chatOverlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: 'local',
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatInput('');
  };

  return (
    <View style={styles.sessionContainer}>
      {/* Remote Video Background */}
      <View style={styles.remoteVideo}>
        <View style={styles.remoteVideoGradient}>
          <View style={styles.therapistAvatarPlaceholder}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <Rect x="10" y="7" width="4" height="4" rx="2" />
              <Circle cx="12" cy="7" r="1" />
              <Circle cx="12" cy="12" r="10" />
            </Svg>
          </View>
          <Text style={styles.therapistVideoLabel}>Dr. John .D</Text>
        </View>
      </View>

      {/* Top Bar Overlay */}
      <View style={styles.topBar}>
        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>Dr. John .D</Text>
        </View>
        <View style={styles.sessionTimer}>
          <Animated.View
            style={[
              styles.pulseDot,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Text style={styles.sessionTimerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Local Video PiP */}
      <View style={styles.localVideoContainer}>
        <View
          style={[
            styles.localVideo,
            { backgroundColor: isCameraOff ? '#334155' : '#1e293b' },
          ]}
        >
          {isCameraOff ? (
            <View style={styles.cameraOffPlaceholder}>
              <CameraOffIcon color="#94a3b8" size={28} />
            </View>
          ) : (
            <View style={styles.cameraOnPlaceholder}>
              <CameraOnIcon color="#387bd5" size={28} />
            </View>
          )}
        </View>
      </View>

      {/* Chat Overlay Panel */}
      {isChatOpen && (
        <Animated.View
          style={[styles.sessionChatOverlay, { opacity: chatOverlayOpacity }]}
          onTouchEnd={toggleChat}
        >
          <Animated.View
            style={[
              styles.sessionChatPanel,
              { transform: [{ translateY: chatPanelTranslateY }] },
            ]}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>Chat with Dr. John</Text>
              <TouchableOpacity onPress={toggleChat} style={styles.chatCloseBtn}>
                <CloseIcon />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView
              style={styles.chatMessages}
              contentContainerStyle={styles.chatMessagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.msgBubbleWrap,
                    msg.sender === 'local' ? styles.msgBubbleWrapLocal : styles.msgBubbleWrapRemote,
                  ]}
                >
                  <View
                    style={[
                      styles.msgBubble,
                      msg.sender === 'local' ? styles.msgBubbleLocal : styles.msgBubbleRemote,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgBubbleText,
                        msg.sender === 'local' ? styles.msgBubbleTextLocal : styles.msgBubbleTextRemote,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Chat Input */}
            <View style={styles.chatInputArea}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type a message..."
                placeholderTextColor="#94a3b8"
                value={chatInput}
                onChangeText={setChatInput}
                multiline
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.chatSendBtn}>
                <SendIcon />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* Bottom Controls */}
      <View style={styles.controlsBar}>
        {/* Mic Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsMuted(!isMuted)}
          style={[styles.controlBtn, isMuted && styles.controlBtnOff]}
        >
          {isMuted ? (
            <MicOffIcon color="#1e293b" size={24} />
          ) : (
            <MicOnIcon color="#ffffff" size={24} />
          )}
        </TouchableOpacity>

        {/* Camera Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsCameraOff(!isCameraOff)}
          style={[styles.controlBtn, isCameraOff && styles.controlBtnOff]}
        >
          {isCameraOff ? (
            <CameraOffIcon color="#1e293b" size={24} />
          ) : (
            <CameraOnIcon color="#ffffff" size={24} />
          )}
        </TouchableOpacity>

        {/* Chat Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleChat}
          style={[styles.controlBtn, isChatOpen && styles.controlBtnOff]}
        >
          <ChatIcon color={isChatOpen ? '#1e293b' : '#ffffff'} size={24} />
        </TouchableOpacity>

        {/* End Call */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/workflows/session/FeedbackPage')}
          style={[styles.controlBtn, styles.controlBtnEndCall]}
        >
          <EndCallIcon color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  sessionContainer: {
    backgroundColor: '#1e293b',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  /* Remote Video */
  remoteVideo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  remoteVideoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
  },
  therapistAvatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  therapistVideoLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  /* Top Bar */
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  therapistName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionTimer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  sessionTimerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  /* Local Video PiP */
  localVideoContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  localVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOffPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOnPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Chat Overlay */
  sessionChatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    justifyContent: 'flex-end',
  },
  sessionChatPanel: {
    backgroundColor: '#ffffff',
    height: '60%',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  chatHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a293b',
  },
  chatCloseBtn: {
    padding: 4,
  },
  chatMessages: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  chatMessagesContent: {
    padding: 16,
    gap: 16,
  },
  msgBubbleWrap: {
    maxWidth: '85%',
  },
  msgBubbleWrapRemote: {
    alignSelf: 'flex-start',
  },
  msgBubbleWrapLocal: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  msgBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  msgBubbleRemote: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  msgBubbleLocal: {
    backgroundColor: '#387bd5',
    borderBottomRightRadius: 4,
  },
  msgBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgBubbleTextRemote: {
    color: '#334155',
  },
  msgBubbleTextLocal: {
    color: '#ffffff',
  },
  msgTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
    paddingHorizontal: 4,
    fontWeight: '500',
  },
  /* Chat Input */
  chatInputArea: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a293b',
    minHeight: 44,
    maxHeight: 100,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#387bd5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Bottom Controls */
  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlBtnOff: {
    backgroundColor: '#f8fafc',
  },
  controlBtnEndCall: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
});
