import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line, Polygon, Polyline } from 'react-native-svg';

/* ─────────────────────────────────────────────
   SVG Icon Components
   ───────────────────────────────────────────── */
const CloseIcon = ({ color = '#64748b', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const StarIcon = ({
  color = '#cbd5e1',
  fill = 'none',
  size = 40,
}: {
  color?: string;
  fill?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

const CheckCircleIcon = ({ color = '#10b981', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

/* ─────────────────────────────────────────────
   Feedback Page
   ───────────────────────────────────────────── */
export default function FeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(15)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const starScales = useRef([...Array(5)].map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStarPress = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);

    // Animate the pressed star
    Animated.sequence([
      Animated.timing(starScales[index], {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(starScales[index], {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    setShowToast(true);
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-redirect after 2 seconds
    setTimeout(() => {
      router.push('/workflows/session/AppointmentsPage');
    }, 2000);
  };

  const handleSkip = () => {
    router.push('/workflows/session/AppointmentsPage');
  };

  const handleClose = () => {
    router.push('/workflows/session/AppointmentsPage');
  };

  return (
    <View style={styles.feedbackContainer}>
      {/* Close Header */}
      <View style={styles.headerClose}>
        <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        {/* Therapist Avatar */}
        <View style={styles.therapistAvatarContainer}>
          <View style={styles.therapistAvatar}>
            <Text style={styles.therapistAvatarText}>J</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>How was your session with Dr. John?</Text>
        <Text style={styles.subtitle}>Your feedback helps us improve our services.</Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[0, 1, 2, 3, 4].map((index) => {
            const isActive = index < rating;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => handleStarPress(index)}
              >
                <Animated.View style={{ transform: [{ scale: starScales[index] }] }}>
                  <StarIcon
                    color={isActive ? '#f59e0b' : '#cbd5e1'}
                    fill={isActive ? '#f59e0b' : 'none'}
                    size={40}
                  />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback Input */}
        <TextInput
          style={styles.feedbackInput}
          placeholder="Tell us more about your experience (Optional)"
          placeholderTextColor="#94a3b8"
          value={feedbackText}
          onChangeText={setFeedbackText}
          multiline
          textAlignVertical="top"
        />

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>Submit Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSkip}
            style={styles.btnSkip}
          >
            <Text style={styles.btnSkipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Success Toast */}
      {showToast && (
        <Animated.View
          style={[
            styles.toastMessage,
            {
              opacity: toastOpacity,
              transform: [
                { translateX: -100 },
                { translateY: toastTranslateY },
              ],
            },
          ]}
        >
          <CheckCircleIcon color="#10b981" size={22} />
          <Text style={styles.toastText}>Thank you for your feedback!</Text>
        </Animated.View>
      )}
    </View>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  feedbackContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  /* Close Header */
  headerClose: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    alignItems: 'flex-end',
  },
  /* Content Section */
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  /* Therapist Avatar */
  therapistAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  therapistAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e7f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#f8fafc',
  },
  therapistAvatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#3b82f6',
  },
  /* Title & Subtitle */
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  /* Star Rating */
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  /* Feedback Input */
  feedbackInput: {
    width: '100%',
    height: 140,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#1a293b',
    textAlignVertical: 'top',
    marginBottom: 32,
  },
  /* Bottom Actions */
  bottomActions: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  btnSkip: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSkipText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
  /* Success Toast */
  toastMessage: {
    position: 'absolute',
    bottom: 140,
    left: '50%',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  toastText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a293b',
  },
});
