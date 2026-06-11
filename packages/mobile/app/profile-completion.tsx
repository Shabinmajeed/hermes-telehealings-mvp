import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

/*
 * Design ref: Design HTML/User (mobile)/workflows/user-registration/profile-completion.html
 * Colors, spacing, and layout match the HTML design token-for-token.
 */

/* ── Inline SVG icon primitives ── */

const UserIcon = () => (
  <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

const CameraIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx={12} cy={13} r={4} />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={5} y1={12} x2={19} y2={12} />
    <Polyline points="12 5 19 12 12 19" />
  </Svg>
);

/* ── Floating Label Input ── */
const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  required = false,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  required?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: focused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -8],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#94a3b8', '#64748b'],
  });

  const borderColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#cbd5e1', '#3b82f6'],
  });

  return (
    <View style={{ marginBottom: 24, position: 'relative' }}>
      <Animated.Text
        style={{
          position: 'absolute',
          left: 12,
          top: labelTop,
          backgroundColor: '#ffffff',
          paddingHorizontal: 4,
          fontSize: labelFontSize,
          fontWeight: '400',
          color: labelColor,
          zIndex: 1,
        }}
      >
        {label}
      </Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={focused ? placeholder : ''}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: 56,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: focused ? '#3b82f6' : '#cbd5e1',
          borderRadius: 8,
          paddingHorizontal: 16,
          fontSize: 16,
          fontWeight: '500',
          color: '#1a293b',
          ...(focused ? { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 } : {}),
        }}
      />
    </View>
  );
};

/* ── Select Input (with chevron) ── */
const SelectInput = ({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => {
  const [focused, setFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label || 'Select';

  return (
    <View style={{ marginBottom: 24, position: 'relative' }}>
      <Text
        style={{
          position: 'absolute',
          left: 12,
          top: -8,
          backgroundColor: '#ffffff',
          paddingHorizontal: 4,
          fontSize: 12,
          fontWeight: '400',
          color: '#64748b',
          zIndex: 1,
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setShowPicker(!showPicker)}
        activeOpacity={0.7}
        style={{
          width: '100%',
          height: 56,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: focused ? '#3b82f6' : '#cbd5e1',
          borderRadius: 8,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: value ? '500' : '400',
            color: value ? '#1a293b' : '#94a3b8',
          }}
        >
          {selectedLabel}
        </Text>
        <ChevronDownIcon />
      </TouchableOpacity>

      {showPicker && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#cbd5e1',
            zIndex: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                onValueChange(opt.value);
                setShowPicker(false);
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#f1f5f9',
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: opt.value === value ? '600' : '400',
                  color: opt.value === value ? '#3b82f6' : '#1a293b',
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

/* ── Segmented Control ── */
const SegmentedControl = ({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#f4f8fd',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        height: 56,
        padding: 4,
      }}
    >
      {options.map((opt) => {
        const isActive = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: isActive ? '#ffffff' : 'transparent',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              ...(isActive
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 1,
                  }
                : {}),
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: isActive ? '500' : '400',
                color: isActive ? '#3b82f6' : '#475569',
              }}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ── Main Screen ── */
export default function ProfileCompletionScreen() {
  const router = useRouter();

  /* Form state */
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [occupation, setOccupation] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');

  /* Entrance animation */
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  /* Avatar upload placeholder */
  const handleAvatarPress = () => {
    // Placeholder: would trigger image picker
  };

  /* Save & Next */
  const handleSaveNext = () => {
    router.push('/(tabs)');
  };

  const occupationOptions = [
    { value: 'student', label: 'Student' },
    { value: 'employed', label: 'Employed' },
    { value: 'unemployed', label: 'Unemployed' },
  ];

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" />

      {/* ═══ Scrollable Content ═══ */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══ Top Section ═══ */}
        <View
          style={{
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 24,
            backgroundColor: '#ffffff',
          }}
        >
          <SafeAreaView edges={['top']}>
            {/* Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#111827',
                textAlign: 'center',
                letterSpacing: -0.5,
              }}
            >
              Setup Profile
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: 14,
                color: '#6b7280',
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Tell us a bit more about yourself.
            </Text>

            {/* Stepper */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                marginTop: 16,
              }}
            >
              <View
                style={{
                  height: 5,
                  width: 60,
                  backgroundColor: '#3b82f6',
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  height: 5,
                  width: 60,
                  backgroundColor: '#e2e8f0',
                  borderRadius: 3,
                }}
              />
            </View>
          </SafeAreaView>
        </View>

        {/* ═══ Form Section ═══ */}
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
            backgroundColor: '#ffffff',
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
          {/* Avatar Upload */}
          <View
            style={{
              alignSelf: 'center',
              position: 'relative',
              marginTop: 10,
              marginBottom: 32,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: '#ffffff',
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderWidth: 4,
                borderColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 24,
                elevation: 4,
              }}
            >
              <UserIcon />
            </View>

            <TouchableOpacity
              onPress={handleAvatarPress}
              activeOpacity={0.8}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 34,
                height: 34,
                backgroundColor: '#3b82f6',
                borderRadius: 17,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: '#ffffff',
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <CameraIcon />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <FloatingLabelInput
            label="Full Name *"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />

          {/* Email Address */}
          <FloatingLabelInput
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            keyboardType="email-address"
          />

          {/* Date of Birth */}
          <View style={{ marginBottom: 24, position: 'relative' }}>
            <Text
              style={{
                position: 'absolute',
                left: 12,
                top: -8,
                backgroundColor: '#ffffff',
                paddingHorizontal: 4,
                fontSize: 12,
                fontWeight: '400',
                color: '#64748b',
                zIndex: 1,
              }}
            >
              Date Of Birth *
            </Text>
            <View
              style={{
                width: '100%',
                height: 56,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#cbd5e1',
                borderRadius: 8,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TextInput
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="Select date"
                placeholderTextColor="#94a3b8"
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#1a293b',
                }}
              />
              <CalendarIcon />
            </View>
          </View>

          {/* Gender */}
          <View style={{ marginBottom: 24, position: 'relative' }}>
            <Text
              style={{
                position: 'absolute',
                left: 12,
                top: -8,
                backgroundColor: '#ffffff',
                paddingHorizontal: 4,
                fontSize: 12,
                fontWeight: '400',
                color: '#64748b',
                zIndex: 1,
              }}
            >
              Gender *
            </Text>
            <SegmentedControl
              options={['Male', 'Female', 'Other']}
              selected={gender}
              onSelect={setGender}
            />
          </View>

          {/* Occupation */}
          <SelectInput
            label="Occupation *"
            value={occupation}
            onValueChange={setOccupation}
            options={occupationOptions}
          />

          {/* Marital Status */}
          <SelectInput
            label="Marital Status *"
            value={maritalStatus}
            onValueChange={setMaritalStatus}
            options={maritalStatusOptions}
          />

          {/* Save & Next Button */}
          <View style={{ marginTop: 32, marginBottom: 24 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveNext}
            >
              <LinearGradient
                colors={['#387bd5', '#3b82f6']}
                style={{
                  height: 56,
                  borderRadius: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.18,
                  shadowRadius: 25,
                  elevation: 6,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
                  Save & Next
                </Text>
                <ArrowRightIcon />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
