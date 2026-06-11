import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

/*
 * Design ref: Design HTML/User (mobile)/workflows/soft-onboarding/personalisation.html
 * "What brings you here?" — multi-select card grid, max 3, staggered slideFadeUp animations.
 */

/* ── Option data ── */
const OPTIONS = [
  {
    id: 'stress',
    title: 'Stress',
    subtitle: 'Managing daily pressure',
    icon: (
      <Svg width={38} height={38} viewBox="0 0 24 24" fill="#1e5ab8">
        <Path d="M17 18a4.5 4.5 0 0 0 .76-8.93 7 7 0 0 0-13.33-1.6A4.5 4.5 0 0 0 6 18h4v-3H8l4-6v4h2l-4 6h3z" />
      </Svg>
    ),
  },
  {
    id: 'anxiety',
    title: 'Anxiety',
    subtitle: 'Calming your mind',
    icon: (
      <Svg width={38} height={38} viewBox="0 0 24 24" fill="#1e5ab8">
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM9 13l2-4 1.5 3H16v-2h-2.5l-1.5-3-2 4-1.5-3H5v2h2.5L9 13z" />
      </Svg>
    ),
  },
  {
    id: 'sleep',
    title: 'Sleep',
    subtitle: 'Better rest',
    icon: (
      <Svg width={38} height={38} viewBox="0 0 24 24" fill="#1e5ab8">
        <Path d="M12.1 2.3a.7.7 0 0 0-1.1-.3C7 5 4.6 9 4.8 13.5A9.5 9.5 0 0 0 14.2 23c4.4.2 8.4-2.1 10.9-6 .2-.3 0-.8-.4-1-.8-.4-1.7-.5-2.6-.5-5.3 0-9.6-4.3-9.6-9.6 0-1.3.3-2.6.8-3.7.1-.4 0-.7-.2-.9z" />
      </Svg>
    ),
  },
  {
    id: 'relationships',
    title: 'Relationships',
    subtitle: 'Building connections',
    icon: (
      <Svg width={38} height={38} viewBox="0 0 24 24" fill="#1e5ab8">
        <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </Svg>
    ),
  },
  {
    id: 'self-esteem',
    title: 'Self-esteem',
    subtitle: 'Building confidence',
    icon: (
      <Svg width={38} height={38} viewBox="0 0 24 24" fill="#1e5ab8">
        <Path d="M22 3C22 3 19 3 15 6C11 9 11 14 11 14V21H13V15C13 15 14 13 16 13C20 13 22 9 22 3ZM2 7C2 7 5 7 9 10C13 13 13 18 13 18V21H11V19C11 19 10 17 8 17C4 17 2 13 2 7Z" />
      </Svg>
    ),
  },
  {
    id: 'focus',
    title: 'Focus',
    subtitle: 'Improving concentration',
    icon: (
      <Svg width={38} height={38} viewBox="0 0 24 24" fill="#1e5ab8">
        <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </Svg>
    ),
  },
];

const MAX_SELECTIONS = 3;

export default function PersonalisationScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [errorText, setErrorText] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  /* ── Entrance animations ── */
  const headerAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const slideFadeStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 0],
        }),
      },
    ],
  });

  /* ── Selection logic ── */
  const toggleOption = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setErrorText('');
        return next;
      }
      if (next.size >= MAX_SELECTIONS) {
        // Show error with shake
        setErrorText('You can only choose a maximum of 3 cards.');
        setShakeKey((k) => k + 1);
        return prev;
      }
      next.add(id);
      setErrorText('');
      return next;
    });
  };

  const handleContinue = () => {
    const selectedIds = Array.from(selected);
    // Store selection (could use AsyncStorage or context)
    // Navigate to next screen
    router.push('/phone-auth');
  };

  const hasSelection = selected.size > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" />

      {/* ═══ Top Curved Background Section ═══ */}
      <LinearGradient
        colors={['#cbe0f9', '#e2effa']}
        style={{
          paddingTop: 0,
          paddingBottom: 30,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
      >
        <SafeAreaView edges={['top']}>
          {/* Header Row */}
          <Animated.View
            style={[
              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
              slideFadeStyle(headerAnim),
            ]}
          >
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ width: 40, justifyContent: 'flex-start', alignItems: 'center' }}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#384e68" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M19 12H5" />
                <Path d="m12 19-7-7 7-7" />
              </Svg>
            </TouchableOpacity>

            {/* Title */}
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: '#1e5ab8',
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: -0.5,
              }}
            >
              What brings you here?
            </Text>

            {/* Mascot */}
            <View style={{ width: 40, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Image
                source={require('../src/assets/images/Heali.png')}
                style={{ width: 34, height: 34, resizeMode: 'contain' }}
                alt="Heali Mascot"
              />
            </View>
          </Animated.View>

          {/* Subtitle */}
          <Animated.Text
            style={[
              {
                color: '#4f6885',
                fontSize: 13,
                fontWeight: '500',
                textAlign: 'center',
                lineHeight: 18,
                paddingHorizontal: 10,
              },
              slideFadeStyle(headerAnim),
            ]}
          >
            {"Choose what you'd like to focus on first. We'll personalize your journey based on your needs."}
          </Animated.Text>
        </SafeAreaView>
      </LinearGradient>

      {/* ═══ Main Content — Options Grid ═══ */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 5, paddingBottom: 15, justifyContent: 'center' }}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 12,
            },
            slideFadeStyle(gridAnim),
          ]}
        >
          {OPTIONS.map((option) => {
            const isSelected = selected.has(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.8}
                onPress={() => toggleOption(option.id)}
                style={{
                  width: '47.5%',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                  borderWidth: 1.5,
                  borderColor: isSelected ? '#387bd5' : 'transparent',
                  borderRadius: 20,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  textAlign: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.06 : 0.03,
                  shadowRadius: 15,
                  elevation: isSelected ? 3 : 1,
                  transform: [{ scale: isSelected ? 1 : 1 }],
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 38,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  {option.icon}
                </View>

                {/* Title */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: isSelected ? '#1e5ab8' : '#1a293b',
                    marginBottom: 4,
                  }}
                >
                  {option.title}
                </Text>

                {/* Subtitle */}
                <Text
                  style={{
                    fontSize: 11,
                    color: isSelected ? '#385b8a' : '#64748b',
                    lineHeight: 14,
                    textAlign: 'center',
                  }}
                >
                  {option.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>

      {/* ═══ Bottom Section ═══ */}
      <Animated.View
        style={[
          { paddingHorizontal: 20, paddingBottom: 25, paddingTop: 15, backgroundColor: '#ffffff' },
          slideFadeStyle(bottomAnim),
        ]}
      >
        {/* Selection Info / Error */}
        <Text
          key={shakeKey}
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: errorText ? '#d93838' : '#64748b',
            marginBottom: 16,
            fontWeight: '400',
            fontStyle: 'italic',
            opacity: errorText ? 1 : 0.8,
          }}
        >
          {errorText || (hasSelection ? '\u00A0' : 'Select at least 1 option to continue')}
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={!hasSelection}
        >
          <LinearGradient
            colors={hasSelection ? ['#387BD5', '#2366BD'] : ['#c8d9ed', '#c8d9ed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56,
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#387BD5',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: hasSelection ? 0.25 : 0,
              shadowRadius: 25,
              elevation: hasSelection ? 8 : 0,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 17,
                fontWeight: '600',
                textShadowColor: 'rgba(0,0,0,0.1)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Continue
            </Text>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M5 12h14" />
              <Path d="m12 5 7 7-7 7" />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
