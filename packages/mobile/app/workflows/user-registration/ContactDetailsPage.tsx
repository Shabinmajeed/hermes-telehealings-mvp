import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polyline, Circle } from 'react-native-svg';

/*
 * Design ref: Design HTML/User (mobile)/workflows/user-registration/contact-details.html
 * Exact layout, colors, spacing, and components replicated from the 261-line design HTML.
 */

/* ── SVG Icon Primitives ── */

const BackArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const VerifiedShieldIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#1d4ed8" stroke="none">
    <Path d="M12 2l3.09 2.26L19 5l-.54 3.76L21 12l-2.54 3.24L19 19l-3.91.74L12 22l-3.09-2.26L5 19l.54-3.76L3 12l2.54-3.24L5 5l3.91-.74L12 2zm-1.18 13.06L17 8.84l-1.42-1.42-4.76 4.76-2.12-2.12L7.28 11.48l3.54 3.58z" />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14" />
    <Polyline points="12 5 19 12 12 19" />
  </Svg>
);

const LocationPinIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={10} r={3} />
    <Path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
    <Path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="2 4" strokeOpacity={0.3} />
    <Path d="M12 5a7 7 0 0 1 7 7" strokeDasharray="2 2" strokeOpacity={0.5} />
  </Svg>
);

/* ── Floating Label Input ── */

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = false,
  rightIcon = false,
}: {
  label: string;
  value: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  editable?: boolean;
  rightIcon?: boolean;
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

  return (
    <View style={{ marginTop: 8, marginBottom: 14, position: 'relative' }}>
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
        placeholder={focused ? placeholder || '' : ''}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        editable={editable}
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
          paddingRight: rightIcon ? 48 : 16,
          fontSize: 16,
          fontWeight: '500',
          color: '#1a293b',
          ...(focused
            ? {
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }
            : {}),
        }}
      />
      {rightIcon && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <VerifiedShieldIcon />
        </View>
      )}
    </View>
  );
};

/* ── Select Input ── */

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
  const [showPicker, setShowPicker] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || 'Select';

  return (
    <View style={{ marginTop: 8, marginBottom: 14, position: 'relative' }}>
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
          borderColor: '#cbd5e1',
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

/* ── Main Screen ── */

export default function ContactDetailsPage() {
  const router = useRouter();

  /* Form state */
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');

  /* Entrance animation */
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveComplete = () => {
    router.push('/workflows/user-registration/ProfileSuccessPage');
  };

  const relationshipOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" />

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
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
              activeOpacity={0.6}
            >
              <BackArrowIcon />
            </TouchableOpacity>

            {/* Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#111827',
                letterSpacing: -0.5,
              }}
            >
              Contact Information
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: 14,
                color: '#6b7280',
                marginTop: 4,
              }}
            >
              Please provide your contact info.
            </Text>

            {/* Stepper */}
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 16,
              }}
            >
              <View
                style={{
                  height: 5,
                  width: 60,
                  backgroundColor: '#e2e8f0',
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  height: 5,
                  width: 60,
                  backgroundColor: '#3b82f6',
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
          {/* Phone Number (pre-filled, readonly) */}
          <FloatingLabelInput
            label="Phone Number *"
            value="+91 1234566799"
            editable={false}
            rightIcon={true}
          />

          {/* Email Address (pre-filled, readonly) */}
          <FloatingLabelInput
            label="Email Address *"
            value="alex.rivera@example.com"
            editable={false}
            rightIcon={true}
          />

          {/* Physical Address */}
          <FloatingLabelInput
            label="Physical Address *"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter physical address"
          />

          {/* Info Banner */}
          <View
            style={{
              backgroundColor: '#f0fdfa',
              borderWidth: 1,
              borderColor: '#ccfbf1',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
              marginTop: 8,
              marginBottom: 32,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                backgroundColor: '#115e59',
                borderRadius: 11,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: 13,
                  fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
                }}
              >
                i
              </Text>
            </View>
            <Text
              style={{
                fontSize: 13,
                color: '#0f172a',
                lineHeight: 20,
                flex: 1,
              }}
            >
              Your emergency contact will only be notified during critical security or medical emergencies. All data is securely encrypted and protected.
            </Text>
          </View>

          {/* Section Header: Emergency Contact */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <LocationPinIcon />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#3b82f6',
              }}
            >
              Emergency Contact
            </Text>
          </View>

          {/* Emergency Contact Full Name */}
          <FloatingLabelInput
            label="Full Name *"
            value={emergencyName}
            onChangeText={setEmergencyName}
            placeholder="Enter emergency contact name"
          />

          {/* Emergency Contact Phone */}
          <FloatingLabelInput
            label="Phone Number *"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          {/* Emergency Contact Relationship */}
          <SelectInput
            label="Relationship *"
            value={emergencyRelationship}
            onValueChange={setEmergencyRelationship}
            options={relationshipOptions}
          />

          {/* Save & Complete Button */}
          <View style={{ marginTop: 16, marginBottom: 24 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveComplete}
            >
              <LinearGradient
                colors={['#3378FF', '#1B57F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  shadowColor: '#2563EB',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Save & Complete
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
