import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line, Polygon, Rect, Polyline } from 'react-native-svg';

/* ─────────────────────────────────────────────
   SVG Icon Components
   ───────────────────────────────────────────── */
const BackIcon = ({ color = '#384e68', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const MicOnIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const MicOffIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="1" y1="1" x2="23" y2="23" />
    <Path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <Path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const CameraOnIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Svg>
);

const CameraOffIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="1" y1="1" x2="23" y2="23" />
    <Path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
  </Svg>
);

const CheckCircleIcon = ({ color = '#10b981', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

const ShieldLockIcon = ({ color = '#387bd5', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const ArrowRightIcon = ({ color = '#ffffff', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="5" y1="12" x2="19" y2="12" />
    <Polyline points="12 5 19 12 12 19" />
  </Svg>
);

/* ─────────────────────────────────────────────
   Precheck Page
   ───────────────────────────────────────────── */
export default function PrecheckPage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(15)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleJoinSession = () => {
    router.push('/workflows/session/SessionPage');
  };

  return (
    <View style={styles.precheckContainer}>
      {/* Top Curved Header */}
      <Animated.View
        style={[
          styles.topBgCurve,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.title}>Session Lobby</Text>
          <View style={styles.mascot}>
            <Text style={styles.mascotText}>Heali</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Check your hardware and get comfortable before entering the secure video room.
        </Text>
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        {/* Video Preview */}
        <View style={styles.videoPreview}>
          <View style={styles.videoPreviewPlaceholder}>
            {isCameraOff ? (
              <View style={styles.cameraOffOverlay}>
                <CameraOffIcon color="#94a3b8" size={40} />
                <Text style={styles.cameraOffText}>Camera Off</Text>
              </View>
            ) : (
              <View style={styles.cameraOnOverlay}>
                <CameraOnIcon color="#387bd5" size={40} />
              </View>
            )}
          </View>

          {/* Preview Overlay Controls */}
          <View style={styles.previewOverlay}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsMuted(!isMuted)}
              style={[styles.toggleBtn, isMuted && styles.toggleBtnOff]}
            >
              {isMuted ? (
                <MicOffIcon color="#ffffff" size={22} />
              ) : (
                <MicOnIcon color="#ffffff" size={22} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCameraOff(!isCameraOff)}
              style={[styles.toggleBtn, isCameraOff && styles.toggleBtnOff]}
            >
              {isCameraOff ? (
                <CameraOffIcon color="#ffffff" size={22} />
              ) : (
                <CameraOnIcon color="#ffffff" size={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Checklist */}
        <Text style={styles.checklistTitle}>Before you join:</Text>
        <View style={styles.checklist}>
          {/* Private Space */}
          <View style={styles.checkItem}>
            <View style={styles.checkIcon}>
              <CheckCircleIcon color="#10b981" size={20} />
            </View>
            <View style={styles.checkTextContainer}>
              <Text style={styles.checkTextStrong}>Private Space</Text>
              <Text style={styles.checkText}>
                Find a quiet area where you feel safe and comfortable talking openly.
              </Text>
            </View>
          </View>

          {/* Stable Connection */}
          <View style={styles.checkItem}>
            <View style={styles.checkIcon}>
              <CheckCircleIcon color="#10b981" size={20} />
            </View>
            <View style={styles.checkTextContainer}>
              <Text style={styles.checkTextStrong}>Stable Connection</Text>
              <Text style={styles.checkText}>
                Your network is stable. For the best audio, consider using headphones.
              </Text>
            </View>
          </View>

          {/* 100% Secure & Confidential - Highlighted */}
          <View style={[styles.checkItem, styles.checkItemHighlighted]}>
            <View style={styles.checkIcon}>
              <ShieldLockIcon color="#387bd5" size={20} />
            </View>
            <View style={styles.checkTextContainer}>
              <Text style={styles.checkTextStrong}>100% Secure & Confidential</Text>
              <Text style={styles.checkText}>
                Your video session is fully encrypted and never recorded without explicit consent.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.bottomActionArea}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleJoinSession}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>Ready, Join Now</Text>
            <ArrowRightIcon color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  precheckContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  /* Top Curved Header */
  topBgCurve: {
    backgroundColor: '#cbe0f9',
    paddingTop: 48,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#1e5ab8',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  mascot: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  subtitle: {
    color: '#4f6885',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 1.4,
    paddingHorizontal: 10,
  },
  /* Content Section */
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  /* Video Preview */
  videoPreview: {
    width: '100%',
    height: 240,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 6,
  },
  videoPreviewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOffOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraOffText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  cameraOnOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  toggleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  toggleBtnOff: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  /* Checklist */
  checklistTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a293b',
    marginBottom: 12,
  },
  checklist: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  checkItemHighlighted: {
    borderColor: '#cbe0f9',
    backgroundColor: '#f4f8fd',
  },
  checkIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  checkTextContainer: {
    flex: 1,
  },
  checkTextStrong: {
    color: '#1a293b',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  checkText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    lineHeight: 1.5,
  },
  /* Bottom Action Area */
  bottomActionArea: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
