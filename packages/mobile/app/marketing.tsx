import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
  'Ai-powered conversational partner',
  'Therapist handover continuity',
  'Self-help library',
];

export default function MarketingScreen() {
  const router = useRouter();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const featuresTranslateY = useRef(new Animated.Value(20)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const statsTranslateY = useRef(new Animated.Value(20)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslateY = useRef(new Animated.Value(20)).current;
  const healiFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(subtitleTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(featuresOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(featuresTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(statsOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(statsTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(bottomOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(bottomTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(healiFloat, { toValue: -8, duration: 2000, useNativeDriver: true }),
        Animated.timing(healiFloat, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]),
    );
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Top Gradient Area */}
      <LinearGradient
        colors={['#EEF5FF', '#FFFFFF']}
        className="flex-1 items-center pt-20 px-6"
      >
        {/* Logo */}
        <View className="w-20 h-20 rounded-2xl bg-white items-center justify-center mb-4 shadow-sm">
          <View className="w-1 bg-primary-500 rounded-l-3xl absolute left-0 top-4 bottom-4" />
          <Text className="text-3xl font-bold text-primary-700 tracking-tighter">TH</Text>
        </View>

        {/* Title */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          <Text className="text-primary-700 text-3xl font-bold mb-2 tracking-tight">
            Telehealings
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={{
            opacity: subtitleOpacity,
            transform: [{ translateY: subtitleTranslateY }],
          }}
        >
          <Text className="text-primary-700 text-sm font-bold text-center mb-8">
            Continuity-first wellness care platform
          </Text>
        </Animated.View>

        {/* Features List */}
        <Animated.View
          style={{
            opacity: featuresOpacity,
            transform: [{ translateY: featuresTranslateY }],
            width: '100%',
            maxWidth: 300,
            marginBottom: 32,
          }}
        >
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center mb-2.5">
              <Text className="text-primary-700 text-base mr-3">✦</Text>
              <Text className="text-primary-700 text-sm font-semibold">{feature}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Stats Row */}
        <Animated.View
          style={{
            opacity: statsOpacity,
            transform: [{ translateY: statsTranslateY }],
            flexDirection: 'row',
            gap: 12,
            width: '100%',
            maxWidth: 340,
            justifyContent: 'space-between',
          }}
        >
          <View className="flex-1 bg-white/90 rounded-2xl p-5 items-center justify-center shadow-sm border border-white/50">
            <Text className="text-primary-700 text-xl font-bold mb-1.5">200+</Text>
            <Text className="text-text-secondary text-xs font-semibold text-center leading-tight">
              Verified{'\n'}therapists
            </Text>
          </View>
          <View className="flex-1 bg-white/90 rounded-2xl p-5 items-center justify-center shadow-sm border border-white/50">
            <Text className="text-primary-700 text-xl font-bold mb-1.5">8+</Text>
            <Text className="text-text-secondary text-xs font-semibold text-center leading-tight">
              Languages{'\n'}&nbsp;
            </Text>
          </View>
          <View className="flex-1 bg-white/90 rounded-2xl p-5 items-center justify-center shadow-sm border border-white/50">
            <Text className="text-primary-700 text-xl font-bold mb-1.5">1,000+</Text>
            <Text className="text-text-secondary text-xs font-semibold text-center leading-tight">
              Hours of{'\n'}therapy
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Bottom White Area with Heali */}
      <Animated.View
        style={{
          opacity: bottomOpacity,
          transform: [{ translateY: bottomTranslateY }],
          paddingHorizontal: 25,
          paddingTop: 20,
          paddingBottom: 60,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        }}
      >
        <Animated.View style={{ transform: [{ translateY: healiFloat }] }}>
          <Image
            source={require('../src/assets/images/Heali.png')}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
        </Animated.View>

        <View className="flex-row items-center justify-between w-full mt-auto">
          <Text className="text-primary-700 text-xl font-bold leading-tight tracking-tight">
            Your wellness journey{'\n'}is one click away.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/soft-onboarding')}
            activeOpacity={0.7}
          >
            <View className="w-14 h-14 rounded-full bg-primary-500 items-center justify-center shadow-lg">
              <Text className="text-white text-2xl font-bold">{'>'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
