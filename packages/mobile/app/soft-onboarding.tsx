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
import { useAuth } from '@/context/AuthContext';

/*
 * Soft Onboarding: Heali mascot, name input, continue to home.
 * "Already a member? Login" link for existing users.
 * Default path: name → home (no registration required).
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
  const { setUserName } = useAuth();
  const [name, setName] = useState('');

  /* ── Entrance animations (slideFadeUp) ── */
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const healiAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(titleAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(subtitleAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(healiAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(bottomAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

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
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }],
  });

  const handleContinue = () => {
    // Save name and go directly to home — no registration required
    setUserName(name.trim() || 'Guest');
    router.replace('/(tabs)');
  };

  const handleLogin = () => {
    // Navigate to login page for existing users
    router.push('/login');
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
              { color: '#1e5ab8', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 6, letterSpacing: -0.3 },
              slideFadeStyle(titleAnim),
            ]}
          >
            Hi, I'm Heali
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            style={[
              { color: '#1e5ab8', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: Math.round(SCREEN_HEIGHT * 0.03), letterSpacing: -0.1 },
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
                  { translateY: healiAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) },
                  { translateY: floatAnim },
                ],
              },
            ]}
          >
            <Image
              source={require('../assets/images/Heali.png')}
              style={{ height: Math.min(Math.round(SCREEN_HEIGHT * 0.26), 280), width: Math.min(Math.round(SCREEN_HEIGHT * 0.26), 280), resizeMode: 'contain' }}
              alt="Heali the Penguin"
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* ═══ Bottom Section ═══ */}
      <Animated.View
        style={[
          { flex: 1, paddingHorizontal: 30, paddingTop: Math.round(SCREEN_HEIGHT * 0.06), paddingBottom: 20, backgroundColor: '#ffffff' },
          slideFadeStyle(bottomAnim),
        ]}
      >
        {/* Question */}
        <Text style={{ color: '#334155', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 16 }}>
          What should we call you?
        </Text>

        {/* Name Input */}
        <TextInput
          style={{
            width: '100%', height: 56, paddingHorizontal: 24, borderWidth: 1,
            borderColor: 'rgba(56, 123, 213, 0.15)', borderRadius: 30, fontSize: 16, fontWeight: '500',
            color: '#1a293b', marginBottom: 24, backgroundColor: '#ffffff',
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 15, elevation: 2,
          }}
          placeholder="Your name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          autoFocus={false}
          autoCapitalize="words"
          returnKeyType="done"
        />

        {/* Continue Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleContinue} style={{ marginBottom: 15 }}>
          <LinearGradient
            colors={['#387BD5', '#2366BD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
              shadowColor: '#387BD5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 25, elevation: 8,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
              Continue
            </Text>
            <ChevronRightIcon />
          </LinearGradient>
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={{ textAlign: 'center', marginTop: 10, marginBottom: 30, fontSize: 14, fontWeight: '500', color: '#64748b' }}>
          Already a member?{' '}
          <Text style={{ color: '#387bd5', fontWeight: '700' }} onPress={handleLogin}>
            Login
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
};
