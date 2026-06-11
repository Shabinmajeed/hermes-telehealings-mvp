import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

/*
 * Design ref: Design HTML/User (mobile)/workflows/soft-onboarding/soft-onboarding.html
 * Single-page soft onboarding: Heali mascot, name input, consent checkbox, continue.
 */

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChevronRightIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14" />
    <Path d="m12 5 7 7-7 7" />
  </Svg>
);

export default function SoftOnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  /* ── Entrance animations (slideFadeUp) ── */
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const healiAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;

  /* Float bob for Heali */
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered slideFadeUp: title 0.1s, subtitle 0.2s, heali 0.3s, bottom 0.5s
    // Matches design animation delays
    Animated.stagger(100, [
      Animated.timing(titleAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(subtitleAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(healiAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(bottomAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // Float bob loop (starts after slideFadeUp, matching design 0.9s delay)
    const startFloat = () => {
      floatAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -8, duration: 2000, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
        ]),
      ).start();
    };
    const timer = setTimeout(startFloat, 900);
    return () => clearTimeout(timer);
  }, []);

  const slideFadeStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }),
      },
    ],
  });

  const handleContinue = () => {
    router.push('/personalisation');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" />

      {/* ═══ Top Gradient Section ═══ */}
      <LinearGradient
        colors={['#ffffff', '#e2effb', '#8db8f1']}
        style={{
          paddingTop: 0,
          paddingBottom: Math.round(SCREEN_HEIGHT * 0.04),
          paddingHorizontal: 20,
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35,
        }}
      >
        <SafeAreaView edges={['top']}>
          {/* Title */}
          <Animated.Text
            style={[
              {
                color: '#1e5ab8',
                fontSize: 26,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 6,
                letterSpacing: -0.3,
              },
              slideFadeStyle(titleAnim),
            ]}
          >
            Hi, I'm Heali
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            style={[
              {
                color: '#1e5ab8',
                fontSize: 14,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: Math.round(SCREEN_HEIGHT * 0.03),
                letterSpacing: -0.1,
              },
              slideFadeStyle(subtitleAnim),
            ]}
          >
            AI-Powered Healing Partner
          </Animated.Text>

          {/* Heali Mascot */}
          <Animated.View
            style={[
              { alignItems: 'center', marginBottom: Math.round(SCREEN_HEIGHT * 0.03) },
              {
                opacity: healiAnim,
                transform: [
                  {
                    translateY: healiAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }),
                  },
                  { translateY: floatAnim },
                ],
              },
            ]}
          >
            <Image
              source={require('../src/assets/images/Heali.png')}
              style={{
                height: Math.min(Math.round(SCREEN_HEIGHT * 0.26), 280),
                width: Math.min(Math.round(SCREEN_HEIGHT * 0.26), 280),
                resizeMode: 'contain',
              }}
              alt="Heali the Penguin"
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* ═══ Bottom Section ═══ */}
      <Animated.View
        style={[
          {
            flex: 1,
            paddingHorizontal: 30,
            paddingTop: Math.round(SCREEN_HEIGHT * 0.06),
            paddingBottom: 20,
            backgroundColor: '#ffffff',
          },
          slideFadeStyle(bottomAnim),
        ]}
      >
        {/* Question */}
        <Text
          style={{
            color: '#334155',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          What should we call you?
        </Text>

        {/* Name Input */}
        <TextInput
          style={{
            width: '100%',
            height: 56,
            paddingHorizontal: 24,
            borderWidth: 1,
            borderColor: 'rgba(56, 123, 213, 0.15)',
            borderRadius: 30,
            fontSize: 16,
            fontWeight: '500',
            color: '#1a293b',
            marginBottom: 24,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.02,
            shadowRadius: 15,
            elevation: 2,
          }}
          placeholder="Your name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          autoFocus={false}
          autoCapitalize="words"
          returnKeyType="done"
        />

        {/* Consent Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => setConsentChecked(!consentChecked)}
            activeOpacity={0.7}
            style={{
              width: 18,
              height: 18,
              borderWidth: 1.5,
              borderColor: consentChecked ? '#387bd5' : '#cbd5e1',
              borderRadius: 6,
              backgroundColor: consentChecked ? '#387bd5' : '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {consentChecked && (
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M20 6L9 17l-5-5" />
              </Svg>
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#64748b', lineHeight: 17 }}>
            I agree to the{' '}
            <Text style={{ color: '#387bd5', fontWeight: '600' }}>Terms</Text>
            {' and '}
            <Text style={{ color: '#387bd5', fontWeight: '600' }}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          style={{ marginBottom: 15 }}
        >
          <LinearGradient
            colors={['#387BD5', '#2366BD']}
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
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 8,
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
            <ChevronRightIcon />
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer Link */}
        <Text
          style={{
            textAlign: 'center',
            marginTop: 'auto',
            marginBottom: 30,
            fontSize: 14,
            fontWeight: '500',
            color: '#64748b',
          }}
        >
          Existing User?{' '}
          <Text style={{ color: '#387bd5', fontWeight: '700' }}>Login</Text>
        </Text>
      </Animated.View>
    </View>
  );
}
