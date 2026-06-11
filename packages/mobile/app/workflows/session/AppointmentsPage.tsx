import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line, Polygon, Rect, Polyline } from 'react-native-svg';

/* ─────────────────────────────────────────────
   SVG Icon Components
   ───────────────────────────────────────────── */
const VideoIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Svg>
);

const DocumentIcon = ({ color = '#334155', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

const ArrowRightIcon = ({ color = '#ffffff', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="5" y1="12" x2="19" y2="12" />
    <Polyline points="12 5 19 12 12 19" />
  </Svg>
);

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
const TABS = ['Find Support', 'My Appointments', 'My Care'];

interface Appointment {
  id: string;
  status: 'upcoming' | 'completed';
  therapistName: string;
  therapistSpecialty: string;
  therapistImage: string;
  date: string;
  time: string;
}

const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'TH-9482',
    status: 'upcoming',
    therapistName: 'John .D',
    therapistSpecialty: 'Clinical Psychologist',
    therapistImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    date: 'Tomorrow, Oct 24',
    time: '04:00 PM',
  },
];

const COMPLETED_APPOINTMENTS: Appointment[] = [
  {
    id: 'TH-8102',
    status: 'completed',
    therapistName: 'Smitha .S',
    therapistSpecialty: 'Clinical Psychologist',
    therapistImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    date: 'Oct 15, 2024',
    time: '10:00 AM',
  },
  {
    id: 'TH-7544',
    status: 'completed',
    therapistName: 'Sarah .M',
    therapistSpecialty: 'Relationship Counselor',
    therapistImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
    date: 'Sep 28, 2024',
    time: '01:00 PM',
  },
];

/* ─────────────────────────────────────────────
   Appointment Card Component
   ───────────────────────────────────────────── */
const AppointmentCard = ({
  appointment,
  index,
  onPress,
}: {
  appointment: Appointment;
  index: number;
  onPress: () => void;
}) => {
  const isUpcoming = appointment.status === 'upcoming';
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.apptCard,
        {
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslateY }],
        },
      ]}
    >
      {/* Card Header */}
      <View style={styles.apptHeader}>
        <View
          style={[
            styles.apptStatus,
            isUpcoming ? styles.apptStatusUpcoming : styles.apptStatusCompleted,
          ]}
        >
          <Text
            style={[
              styles.apptStatusText,
              isUpcoming ? styles.apptStatusTextUpcoming : styles.apptStatusTextCompleted,
            ]}
          >
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </Text>
        </View>
        <Text style={styles.apptId}>#{appointment.id}</Text>
      </View>

      {/* Therapist Info */}
      <View style={styles.therapistInfo}>
        <View style={styles.therapistAvatar}>
          <Text style={styles.therapistAvatarText}>
            {appointment.therapistName.charAt(0)}
          </Text>
        </View>
        <View style={styles.therapistDetails}>
          <Text style={styles.therapistName}>{appointment.therapistName}</Text>
          <Text style={styles.therapistSpecialty}>{appointment.therapistSpecialty}</Text>
        </View>
      </View>

      {/* Date/Time Info */}
      <View style={styles.apptTimeInfo}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Date</Text>
          <Text style={styles.timeValue}>{appointment.date}</Text>
        </View>
        <View style={styles.timeDivider} />
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Time</Text>
          <Text style={styles.timeValue}>{appointment.time}</Text>
        </View>
      </View>

      {/* Action Button */}
      {isUpcoming ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.joinBtn}
        >
          <VideoIcon color="#ffffff" size={22} />
          <Text style={styles.joinBtnText}>Join Session</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.actionBtnSecondary}
        >
          <DocumentIcon color="#334155" size={20} />
          <Text style={styles.actionBtnSecondaryText}>View Summary</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

/* ─────────────────────────────────────────────
   Appointments Page
   ───────────────────────────────────────────── */
export default function AppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1); // My Appointments active

  const handleJoinSession = () => {
    router.push('/workflows/session/PrecheckPage');
  };

  const handleViewSummary = () => {
    // Navigate to summary (placeholder)
  };

  return (
    <SafeAreaView style={styles.careContainer} edges={['top']}>
      {/* Fixed Sticky Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitles}>
            <Text style={styles.headerH1}>Care</Text>
            <Text style={styles.discoverSubtitle}>
              Manage your upcoming and past sessions.
            </Text>
          </View>
          <View style={styles.healiContainer}>
            <Text style={styles.healiPlaceholder}>Heali</Text>
          </View>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <View style={styles.contentWrapper}>
        {/* Tabs */}
        <View style={styles.discoverTabs}>
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.7}
              onPress={() => setActiveTab(index)}
              style={styles.discoverTab}
            >
              <Text
                style={[
                  styles.discoverTabText,
                  activeTab === index && styles.discoverTabTextActive,
                ]}
              >
                {tab}
              </Text>
              {activeTab === index && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Upcoming Section */}
          <Text style={styles.sectionTitle}>Upcoming</Text>

          {UPCOMING_APPOINTMENTS.map((appt, index) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              index={index}
              onPress={handleJoinSession}
            />
          ))}

          {/* Completed Section */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Completed</Text>

          {COMPLETED_APPOINTMENTS.map((appt, index) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              index={index + 1}
              onPress={handleViewSummary}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  careContainer: {
    flex: 1,
    backgroundColor: '#fbfcfd',
  },
  /* Fixed Header */
  fixedHeader: {
    backgroundColor: '#e2effb',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0,
  },
  headerTitles: {
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    minWidth: 0,
    marginRight: 15,
  },
  headerH1: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  discoverSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b6380',
    lineHeight: 1.4,
    maxWidth: 240,
  },
  healiContainer: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healiPlaceholder: {
    fontSize: 10,
    color: '#94a3b8',
  },
  /* Content Wrapper */
  contentWrapper: {
    flex: 1,
    paddingTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  /* Tabs */
  discoverTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  discoverTab: {
    paddingBottom: 8,
    alignItems: 'center',
  },
  discoverTabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  discoverTabTextActive: {
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  /* Section Title */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a293b',
    marginBottom: 16,
  },
  /* Appointment Card */
  apptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  apptStatus: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  apptStatusUpcoming: {
    backgroundColor: '#e2effb',
  },
  apptStatusCompleted: {
    backgroundColor: '#f1f5f9',
  },
  apptStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  apptStatusTextUpcoming: {
    color: '#1e5ab8',
  },
  apptStatusTextCompleted: {
    color: '#64748b',
  },
  apptId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  /* Therapist Info */
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  therapistAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e7f2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapistAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  therapistDetails: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a293b',
    marginBottom: 4,
  },
  therapistSpecialty: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  /* Date/Time Info */
  apptTimeInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  timeBlock: {
    flex: 1,
    flexDirection: 'column',
    gap: 6,
  },
  timeDivider: {
    width: 1.5,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a293b',
  },
  /* Join Button */
  joinBtn: {
    width: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  joinBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  /* Secondary Action Button */
  actionBtnSecondary: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionBtnSecondaryText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
  },
});
