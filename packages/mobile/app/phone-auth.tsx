import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Line, Polyline } from 'react-native-svg';

/*
 * Design ref: Design HTML/User (mobile)/workflows/user-registration/phone-verify.html
 * Colors, spacing, and layout match the HTML design token-for-token.
 *
 * Design tokens from global.css:
 *   --color-primary: #387bd5
 *   --color-primary-600: #3b82f6
 *   --color-header-title: #FFFFFF
 *   --color-header-subtitle: #E0F2FE
 *   --color-text: #111827
 *   --color-muted: #6b7280
 *
 * Layout from layout.css:
 *   .top-section: linear-gradient(180deg, #e7f2ff 0%, #2366bd 100%)
 *   border-radius: 0 0 50% 50% / 0 0 35px 35px
 *   .header-row: flex space-between, width 90%
 *   .header-heali: 40px, justify-content flex-end
 */

const COUNTRIES = [
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', label: '+1 (US)' },
  { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', label: '+44 (UK)' },
  { code: '+91', flag: '\u{1F1EE}\u{1F1F3}', label: '+91 (IN)' },
  { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', label: '+61 (AU)' },
  { code: '+1', flag: '\u{1F1E8}\u{1F1E6}', label: '+1 (CA)' },
];

/* ── SVG Icons ── */

const BackArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="5" y1="12" x2="19" y2="12" />
    <Polyline points="12 5 19 12 12 19" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export default function PhoneAuthScreen() {
  const router = useRouter();

  /* State */
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  /* Refs */
  const otpRefs = useRef<(TextInput | null)[]>([]);

  /* Animations */
  const formAnim = useRef(new Animated.Value(0)).current;
  const otpHeight = useRef(new Animated.Value(0)).current;
  const otpOpacity = useRef(new Animated.Value(0)).current;

  /* Entrance animation — slideFadeUp */
  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* Phone formatting: 123 456 7890 */
  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, '');
    const m = d.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (!m) return '';
    return !m[2] ? m[1] : `${m[1]} ${m[2]}${m[3] ? ` ${m[3]}` : ''}`;
  };

  const handlePhoneChange = (text: string) => setPhoneNumber(formatPhone(text));

  /* Action: Generate OTP -> Verify */
  const handleAction = () => {
    if (!showOtp) {
      setShowOtp(true);
      Animated.parallel([
        Animated.timing(otpHeight, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(otpOpacity, { toValue: 1, duration: 400, useNativeDriver: false }),
      ]).start(() => {
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      });
    } else {
      router.push('/profile-completion');
    }
  };

  /* OTP handlers */
  const handleOtpChange = (text: string, i: number) => {
    const next = [...otpValues];
    next[i] = text;
    setOtpValues(next);
    if (text.length === 1 && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    i: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otpValues[i] === '' && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  /* OTP box with pop-on-focus animation */
  const renderOtpBox = (index: number) => {
    const scale = useRef(new Animated.Value(1)).current;
    const borderColor = useRef(new Animated.Value(0)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;

    const onFocus = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.05,
          useNativeDriver: true,
          friction: 5,
          tension: 80,
        }),
        Animated.timing(bgAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(borderColor, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    };

    const onBlur = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 80,
        }),
        Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
        Animated.timing(borderColor, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    };

    const bgColor = bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(59, 130, 246, 0.05)', '#FFFFFF'],
    });

    const borderC = borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#387BD5'],
    });

    const shadowOpacity = borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.15],
    });

    return (
      <TextInput
        key={index}
        ref={(r) => { otpRefs.current[index] = r; }}
        style={{
          flex: 1,
          minWidth: 0,
          height: 52,
          borderRadius: 12,
          textAlign: 'center',
          fontSize: 22,
          fontWeight: '600',
          color: '#1a293b',
          backgroundColor: bgColor as any,
          borderWidth: 1,
          borderColor: borderC as any,
          shadowColor: '#387BD5',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: shadowOpacity as any,
          shadowRadius: 8,
          elevation: 2,
          transform: [{ scale }],
        }}
        value={otpValues[index]}
        onChangeText={(t) => handleOtpChange(t, index)}
        onKeyPress={(e) => handleOtpKeyPress(e, index)}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={1}
        keyboardType="number-pad"
      />
    );
  };

  /* ── Render ── */
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="light" />

      {/* ═══ Top Curved Section ═══ */}
      <LinearGradient
        colors={['#e7f2ff', '#2366bd']}
        style={{
          paddingTop: 40,
          paddingBottom: 25,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35,
        }}
      >
        <SafeAreaView edges={['top']}>
          {/* Header Row — matches .header-row: width 90%, space-between */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
            width: '90%',
            alignSelf: 'center',
          }}>
            {/* Back Button — matches .back-btn */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ width: 40, justifyContent: 'flex-start', alignItems: 'center' }}
              activeOpacity={0.7}
            >
              <BackArrowIcon />
            </TouchableOpacity>

            {/* Title — matches .header-title */}
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: -0.5,
              }}
            >
              Verify Phone
            </Text>

            {/* Heali Mascot — matches .header-heali */}
            <View style={{ width: 40, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Image
                source={require('../src/assets/images/heali-phone.png')}
                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                alt="Heali Mascot with Phone"
              />
            </View>
          </View>

          {/* Subtitle — matches .header-subtitle */}
          <Text
            style={{
              color: '#E0F2FE',
              fontSize: 14,
              textAlign: 'center',
              marginHorizontal: 10,
            }}
          >
            We will send you a one-time password to verify your account.
          </Text>
        </SafeAreaView>
      </LinearGradient>

      {/* ═══ Form Section ═══ */}
      <Animated.View
        style={{
          flex: 1,
          paddingTop: 24,
          paddingBottom: 32,
          paddingHorizontal: 24,
          opacity: formAnim,
          transform: [
            {
              translateY: formAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0],
              }),
            },
          ],
        }}
      >
        {/* Label — matches .input-label */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: '#000000',
            marginBottom: 12,
          }}
        >
          Phone Number
        </Text>

        {/* Phone Input Group — matches .phone-input-group */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          {/* Country Select — matches .country-select */}
          <TouchableOpacity
            style={{
              width: 96,
              height: 48,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.12)',
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: '#f8fafc',
              flexShrink: 0,
            }}
            activeOpacity={0.7}
            onPress={() => setShowCountryPicker(!showCountryPicker)}
          >
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#1a293b' }}>
              {selectedCountry.flag} {selectedCountry.code}
            </Text>
            <ChevronDownIcon />
          </TouchableOpacity>

          {/* Phone Input — matches .phone-input */}
          <TextInput
            style={{
              flex: 1,
              height: 48,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.12)',
              borderRadius: 16,
              paddingHorizontal: 16,
              fontSize: 18,
              fontWeight: '500',
              color: '#1a293b',
              backgroundColor: '#f8fafc',
            }}
            placeholder="000 000 0000"
            placeholderTextColor="#637b96"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={12}
          />
        </View>

        {/* Country Picker Dropdown */}
        {showCountryPicker && (
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.10)',
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {COUNTRIES.map((country, idx) => (
              <TouchableOpacity
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: idx < COUNTRIES.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(0, 0, 0, 0.05)',
                }}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 16, color: '#1a293b' }}>
                  {country.flag} {country.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* OTP Section — matches .otp-section with .active */}
        <Animated.View
          style={{
            maxHeight: otpHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100],
            }),
            opacity: otpOpacity,
            marginBottom: otpHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 24],
            }),
            overflow: 'hidden',
          } as any}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#000000',
              marginBottom: 12,
            }}
          >
            Enter 6-Digit OTP
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'space-between' }}>
            {[0, 1, 2, 3, 4, 5].map((i) => renderOtpBox(i))}
          </View>
        </Animated.View>

        {/* Action Button — matches #actionBtn / .btn-primary */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAction}
          style={{ marginBottom: 24, marginTop: 0 }}
        >
          <LinearGradient
            colors={['#387BD5', '#2366BD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: '80%',
              height: 56,
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              alignSelf: 'center',
              shadowColor: '#387BD5',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
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
              {showOtp ? 'Verify' : 'Generate OTP'}
            </Text>
            {showOtp ? <CheckIcon /> : <ArrowRightIcon />}
          </LinearGradient>
        </TouchableOpacity>

        {/* Social Buttons — matches .social-group */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            marginTop: 'auto',
            marginBottom: 40,
          }}
        >
          {/* Google Button — matches .btn-social */}
          <TouchableOpacity
            style={{
              flex: 1,
              maxWidth: 140,
              height: 50,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.03,
              shadowRadius: 15,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a293b' }}>G</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#1a293b' }}>Google</Text>
          </TouchableOpacity>

          {/* Apple Button — matches .btn-social */}
          <TouchableOpacity
            style={{
              flex: 1,
              maxWidth: 140,
              height: 50,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.03,
              shadowRadius: 15,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18, color: '#1a293b' }}>{'\u{1F34E}'}</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#1a293b' }}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Support Link — matches .support-text */}
        <Text
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: '#64748b',
            fontWeight: '500',
            paddingBottom: 24,
          }}
        >
          Having trouble?{' '}
          <Text style={{ color: '#000000', fontWeight: '700', textDecorationLine: 'underline' }}>
            Contact Support
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
}
