import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polyline, Line, Rect, Circle } from 'react-native-svg';

export default function SessionConfirmPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const date = (params.date as string) || 'Thursday, Oct 24, 2024';
  const time = (params.time as string) || '02:00 PM — 03:00 PM';
  const timezone = (params.timezone as string) || 'Eastern Standard Time (EST)';
  const sessionType = (params.sessionType as string) || 'Video Consultation';
  const sessionDesc =
    (params.sessionDesc as string) || '50-minute therapeutic session via secure video link';
  const therapistName = (params.therapistName as string) || 'Dr. Smitha.S';
  const therapistSpec = (params.therapistSpec as string) || 'Clinical Psychologist';
  const therapistImg = (params.therapistImg as string) || undefined;

  const sessionFee = 1250;
  const platformFee = 250;
  const promoDiscount = 0;
  const total = sessionFee + platformFee - promoDiscount;

  // slideFadeUp animation
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleProceed = () => {
    router.push({
      pathname: '/workflows/booking/ConfirmedPage',
      params: {
        date,
        time,
        sessionType,
        therapistName,
        therapistSpec,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1="19" y1="12" x2="5" y2="12" />
              <Polyline points="12 19 5 12 12 5" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Booking Summary</Text>
            <Text style={styles.headerSubtitle}>
              Please review the details of your upcoming session.
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Therapist Card */}
          <View style={styles.therapistCard}>
            {therapistImg ? (
              <Image
                source={{ uri: therapistImg }}
                style={styles.therapistImg}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.therapistImg, styles.therapistImgPlaceholder]}>
                <Text style={styles.therapistImgPlaceholderText}>
                  {therapistName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.therapistDetails}>
              <Text style={styles.therapistLabel}>Therapist</Text>
              <Text style={styles.therapistName}>{therapistName}</Text>
              <Text style={styles.therapistSpec}>{therapistSpec}</Text>
            </View>
          </View>

          {/* Session Type */}
          <Text style={styles.sectionLabel}>Session Type</Text>
          <View style={styles.sessionType}>
            <Svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polygon points="23 7 16 12 23 17 23 7" />
              <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </Svg>
            <Text style={styles.sessionTypeText}>{sessionType}</Text>
          </View>
          <Text style={styles.sessionDesc}>{sessionDesc}</Text>

          {/* Date & Time */}
          <Text style={styles.sectionLabel}>Date and Time</Text>
          <View style={styles.datetimeGrid}>
            <View style={styles.dtCol}>
              <Text style={styles.dtVal}>{date}</Text>
              <Text style={styles.dtSub}>Date of appointment</Text>
            </View>
            <View style={styles.dtDivider} />
            <View style={styles.dtCol}>
              <Text style={styles.dtVal}>{time}</Text>
              <Text style={styles.dtSub}>{timezone}</Text>
            </View>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.policyBox}>
            <View style={styles.policyIcon}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Circle cx="12" cy="12" r="10" />
                <Line x1="12" y1="16" x2="12" y2="12" />
                <Line x1="12" y1="8" x2="12.01" y2="8" />
              </Svg>
            </View>
            <View>
              <Text style={styles.policyTitle}>Cancellation Policy</Text>
              <Text style={styles.policyDesc}>
                Free up to 24 hours before the session. 50% fee within 24 hours.
              </Text>
            </View>
          </View>

          {/* Payment Summary */}
          <View style={styles.paymentSummary}>
            <Text style={styles.paymentTitle}>Payment Summary</Text>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentRowLabel}>Session Fee</Text>
              <Text style={styles.paymentRowVal}>₹ {sessionFee}</Text>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentRowLabel}>Platform Fee</Text>
              <Text style={styles.paymentRowVal}>₹ {platformFee}</Text>
            </View>

            <View style={styles.paymentRow}>
              <View style={styles.promoLabel}>
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
                  <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 1 1 0 2.82z" />
                  <Line x1="7" y1="7" x2="7.01" y2="7" />
                </Svg>
                <Text style={styles.promoLabelText}>Promo Code (HEAL20)</Text>
              </View>
              <Text style={[styles.paymentRowVal, { color: '#0f172a', fontWeight: '700' }]}>
                -₹ {promoDiscount.toString().padStart(2, '0')}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Cost</Text>
              <View style={styles.totalValBox}>
                <Text style={styles.totalVal}>₹ {total}</Text>
                <Text style={styles.taxInc}>(Tax Included)</Text>
              </View>
            </View>
          </View>

          {/* Proceed CTA */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleProceed}
            style={styles.proceedBtnWrapper}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proceedBtn}
            >
              <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
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
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fixedHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  backBtn: {
    marginTop: 4,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
    lineHeight: 18,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // Therapist Card
  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 25,
    elevation: 4,
  },
  therapistImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  therapistImgPlaceholder: {
    backgroundColor: '#e7f2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapistImgPlaceholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  therapistDetails: {
    flex: 1,
  },
  therapistLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  therapistSpec: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  // Section Labels
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 12,
  },
  // Session Type
  sessionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sessionTypeText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  sessionDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 21,
    marginBottom: 24,
  },
  // Date & Time Grid
  datetimeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dtCol: {
    flex: 1,
  },
  dtDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  dtVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  dtSub: {
    fontSize: 12,
    color: '#94a3b8',
  },
  // Cancellation Policy
  policyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  policyIcon: {
    flexShrink: 0,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  policyDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  // Payment Summary
  paymentSummary: {
    marginBottom: 32,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentRowLabel: {
    fontSize: 15,
    color: '#475569',
  },
  paymentRowVal: {
    fontSize: 15,
    color: '#475569',
  },
  promoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoLabelText: {
    fontSize: 15,
    color: '#64748b',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  totalValBox: {
    alignItems: 'flex-end',
  },
  totalVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
  },
  taxInc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  // Proceed Button
  proceedBtnWrapper: {
    width: '100%',
  },
  proceedBtn: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  proceedBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
