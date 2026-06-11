import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path, Polyline, Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileSuccessPage() {
  const router = useRouter();

  // Animation values
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(15)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(15)).current;

  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(15)).current;

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    // popIn keyframe: 0% scale(0.8) opacity 0 -> 40% scale(1.1) opacity 1 -> 100% scale(1) opacity 1
    // cubic-bezier(0.34, 1.56, 0.64, 1) — 600ms total
    const popInScale = Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1.0,
        duration: 360,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }),
    ]);

    const popIn = Animated.parallel([
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      popInScale,
    ]);

    // slideFadeUp: opacity 0 -> 1, translateY 15 -> 0, ease-out 500ms
    const slideFadeUp = (opacity: Animated.Value, translateY: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]);

    // Start all animations with staggered delays matching design:
    // title 0.2s, subtitle 0.3s, badge 0.4s, actions 0.5s
    Animated.parallel([
      popIn,
      slideFadeUp(titleOpacity, titleTranslateY, 200),
      slideFadeUp(subtitleOpacity, subtitleTranslateY, 300),
      slideFadeUp(badgeOpacity, badgeTranslateY, 400),
      slideFadeUp(actionsOpacity, actionsTranslateY, 500),
    ]).start();
  }, [
    iconScale, iconOpacity,
    titleOpacity, titleTranslateY,
    subtitleOpacity, subtitleTranslateY,
    badgeOpacity, badgeTranslateY,
    actionsOpacity, actionsTranslateY,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} />
      <View style={styles.inner}>
        {/* Content Section - vertically centered */}
        <View style={styles.contentSection}>
          {/* Icon with popIn animation */}
          <Animated.View
            style={{
              transform: [{ scale: iconScale }],
              opacity: iconOpacity,
            }}
          >
            <View style={styles.iconWrapper}>
              <Svg
                width={48}
                height={48}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0d9488"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <Polyline points="9 12 11 14 15 10" />
              </Svg>
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <Text style={styles.title}>
              Profile Updated Successfully!
            </Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            }}
          >
            <Text style={styles.subtitle}>
              Your personal details have been saved securely. We value your privacy and guarantee that your information will never be shared with third parties.
            </Text>
          </Animated.View>

          {/* Secure Badge */}
          <Animated.View
            style={{
              opacity: badgeOpacity,
              transform: [{ translateY: badgeTranslateY }],
            }}
          >
            <View style={styles.secureBadge}>
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </Svg>
              <Text style={styles.secureBadgeText}>
                End-to-End Encrypted
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Actions */}
        <Animated.View
          style={{
            opacity: actionsOpacity,
            transform: [{ translateY: actionsTranslateY }],
          }}
        >
          <View style={styles.bottomActions}>
            {/* Primary Button — Complete Medical Profile */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/workflows/medical/MedicalProfile1Page')}
            >
              <LinearGradient
                colors={['#3378FF', '#1B57F5']}
                style={styles.btnPrimary}
              >
                <Text style={styles.btnPrimaryText}>
                  Complete Medical Profile
                </Text>
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Line x1="5" y1="12" x2="19" y2="12" />
                  <Polyline points="12 5 19 12 12 19" />
                </Svg>
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary Button — Go to Home */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)')}
              style={styles.btnSecondary}
            >
              <Text style={styles.btnSecondaryText}>
                Go to Home
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  contentSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 35,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#335075',
    letterSpacing: -0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#637b96',
    lineHeight: 24,
    textAlign: 'center',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 24,
    alignSelf: 'center',
  },
  secureBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  bottomActions: {
    padding: 24,
    flexDirection: 'column',
    gap: 16,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    width: '100%',
    height: 56,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: '#475569',
    fontSize: 17,
    fontWeight: '600',
  },
});
