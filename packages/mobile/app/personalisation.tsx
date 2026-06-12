import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
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
 * Personalisation: "What brings you here?" — multi-select card grid, max 3.
 * Default path: select specialisations → home (no registration required).
 */

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChevronRightIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14" />
    <Path d="m12 5 7 7-7 7" />
  </Svg>
);

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#384e68" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5" />
    <Path d="m12 19-7-7 7-7" />
  </Svg>
);

const OPTIONS = [
  { id: 'stress', title: 'Stress', subtitle: 'Managing daily pressure' },
  { id: 'anxiety', title: 'Anxiety', subtitle: 'Calming your mind' },
  { id: 'sleep', title: 'Sleep', subtitle: 'Better rest' },
  { id: 'relationships', title: 'Relationships', subtitle: 'Building connections' },
  { id: 'self-esteem', title: 'Self-esteem', subtitle: 'Building confidence' },
  { id: 'focus', title: 'Focus', subtitle: 'Improving concentration' },
];

const MAX_SELECTIONS = 3;

export default function PersonalisationScreen() {
  const router = useRouter();
  const { setSpecializations } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [errorText, setErrorText] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(headerAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(gridAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(bottomAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const slideFadeStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }],
  });

  const toggleOption = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setErrorText(''); return next; }
      if (next.size >= MAX_SELECTIONS) {
        setErrorText('You can only choose a maximum of 3 cards.');
        setShakeKey((k) => k + 1);
        return prev;
      }
      next.add(id); setErrorText(''); return next;
    });
  };

  const handleContinue = () => {
    // Save specialisations and go directly to home
    const specs = Array.from(selected).map(id => OPTIONS.find(o => o.id === id)?.title || id);
    setSpecializations(specs);
    router.replace('/(tabs)');
  };

  const hasSelection = selected.size > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" />

      <LinearGradient colors={['#cbe0f9', '#e2effa']} style={{ paddingTop: 0, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}>
        <SafeAreaView edges={['top']}>
          <Animated.View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }, slideFadeStyle(headerAnim)]}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40 }} activeOpacity={0.7}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', color: '#1e5ab8', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>What brings you here?</Text>
            <View style={{ width: 40, alignItems: 'center' }}>
              <Image source={require('../assets/images/Heali.png')} style={{ width: 34, height: 34, resizeMode: 'contain' }} alt="Heali" />
            </View>
          </Animated.View>
          <Animated.Text style={[{ color: '#4f6885', fontSize: 13, fontWeight: '500', textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 }, slideFadeStyle(headerAnim)]}>
            {"Choose what you'd like to focus on first. We'll personalize your journey based on your needs."}
          </Animated.Text>
        </SafeAreaView>
      </LinearGradient>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 5, paddingBottom: 15, justifyContent: 'center' }}>
        <Animated.View style={[{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }, slideFadeStyle(gridAnim)]}>
          {OPTIONS.map((option) => {
            const isSelected = selected.has(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.8}
                onPress={() => toggleOption(option.id)}
                style={{
                  width: '47.5%', backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                  borderWidth: 1.5, borderColor: isSelected ? '#387bd5' : 'transparent', borderRadius: 20,
                  paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center',
                  shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.06 : 0.03, shadowRadius: 15, elevation: isSelected ? 3 : 1,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: isSelected ? '#1e5ab8' : '#1a293b', marginBottom: 4 }}>{option.title}</Text>
                <Text style={{ fontSize: 11, color: isSelected ? '#385b8a' : '#64748b', lineHeight: 14, textAlign: 'center' }}>{option.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>

      <Animated.View style={[{ paddingHorizontal: 20, paddingBottom: 25, paddingTop: 15, backgroundColor: '#ffffff' }, slideFadeStyle(bottomAnim)]}>
        <Text key={shakeKey} style={{ textAlign: 'center', fontSize: 13, color: errorText ? '#d93838' : '#64748b', marginBottom: 16, fontWeight: '400', fontStyle: 'italic', opacity: errorText ? 1 : 0.8 }}>
          {errorText || (hasSelection ? '\u00A0' : 'Select at least 1 option to continue')}
        </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={handleContinue} disabled={!hasSelection}>
          <LinearGradient
            colors={hasSelection ? ['#387BD5', '#2366BD'] : ['#c8d9ed', '#c8d9ed']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ height: 56, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
              shadowColor: '#387BD5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: hasSelection ? 0.25 : 0, shadowRadius: 25, elevation: hasSelection ? 8 : 0 }}
          >
            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '600' }}>Continue</Text>
            <ChevronRightIcon />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
