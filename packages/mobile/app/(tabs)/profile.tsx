import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── Design Tokens (from global.css / profile.html) ─── */
const PRIMARY = '#387BD5';
const PRIMARY_LIGHT = '#F4F8FD';
const PRIMARY_BG = '#E2EFFB';
const SURFACE = '#FFFFFF';
const BG = '#FBFCFD';
const TEXT_PRIMARY = '#1A293B';
const TEXT_SECONDARY = '#64748B';
const TEXT_LABEL = '#4B6380';
const BORDER = '#F1F5F9';
const BORDER_LIGHT = '#F8FAFC';
const RED = '#EF4444';
const RED_BG = '#FEF2F2';
const CHEVRON = '#CBD5E1';

/* ─── SVG Icon Helper (inline SVG for react-native-web) ─── */
const SvgIcon = ({
  children,
  size = 20,
  color = PRIMARY,
  strokeWidth = 2,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    // @ts-expect-error react-native-web supports svg elements
    style={{ display: 'block' }}
  >
    {children}
  </svg>
);

/* ─── SVG Icons (from design HTML) ─── */
const UserIcon = () => (
  <SvgIcon>
    {/* @ts-expect-error react-native-web svg */}
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    {/* @ts-expect-error react-native-web svg */}
    <circle cx="12" cy="7" r="4" />
  </SvgIcon>
);

const ActivityIcon = () => (
  <SvgIcon>
    {/* @ts-expect-error react-native-web svg */}
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </SvgIcon>
);

const CreditCardIcon = () => (
  <SvgIcon>
    {/* @ts-expect-error react-native-web svg */}
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    {/* @ts-expect-error react-native-web svg */}
    <line x1="1" y1="10" x2="23" y2="10" />
  </SvgIcon>
);

const LockIcon = () => (
  <SvgIcon>
    {/* @ts-expect-error react-native-web svg */}
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    {/* @ts-expect-error react-native-web svg */}
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </SvgIcon>
);

const ShieldIcon = () => (
  <SvgIcon>
    {/* @ts-expect-error react-native-web svg */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </SvgIcon>
);

const LogOutIcon = () => (
  <SvgIcon color={RED} strokeWidth={2}>
    {/* @ts-expect-error react-native-web svg */}
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    {/* @ts-expect-error react-native-web svg */}
    <polyline points="16 17 21 12 16 7" />
    {/* @ts-expect-error react-native-web svg */}
    <line x1="21" y1="12" x2="9" y2="12" />
  </SvgIcon>
);

const ChevronRight = ({ color = CHEVRON }: { color?: string }) => (
  <SvgIcon size={20} color={color} strokeWidth={2.5}>
    {/* @ts-expect-error react-native-web svg */}
    <polyline points="9 18 15 12 9 6" />
  </SvgIcon>
);

/* ─── SlideFadeUp Animation Hook ─── */
function useSlideFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

/* ─── Settings Item ─── */
interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
}

function SettingsItem({ icon, label, onPress, isLogout }: SettingsItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        styles.settingsItem,
        isLogout && styles.logoutItem,
      ]}
    >
      <View style={[
        styles.settingsIcon,
        isLogout && { backgroundColor: RED_BG },
      ]}>
        {icon}
      </View>
      <Text style={[
        styles.settingsText,
        isLogout && { color: RED },
      ]}>
        {label}
      </Text>
      {!isLogout && <ChevronRight />}
    </TouchableOpacity>
  );
}

/* ─── Animated Settings Group ─── */
interface SettingsGroupProps {
  children: React.ReactNode;
  delay?: number;
}

function SettingsGroup({ children, delay = 0 }: SettingsGroupProps) {
  const anim = useSlideFadeUp(delay);
  return (
    <Animated.View style={[styles.settingsGroup, anim]}>
      {children}
    </Animated.View>
  );
}

/* ─── Main Screen ─── */
export default function ProfileScreen() {
  const cardAnim = useSlideFadeUp(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Sticky Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account and preferences.
        </Text>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info Card */}
        <Animated.View style={[styles.profileCard, cardAnim]}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            }}
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>Ajesh Anand</Text>
          <Text style={styles.profileEmail}>ajesh.anand@example.com</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.editProfileBtn}>
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* General Settings */}
        <SettingsGroup delay={100}>
          <SettingsItem
            icon={<UserIcon />}
            label="Personal Details"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<ActivityIcon />}
            label="Medical Profile"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<CreditCardIcon />}
            label="Payment Methods"
            onPress={() => {}}
          />
        </SettingsGroup>

        {/* Preferences Settings */}
        <SettingsGroup delay={200}>
          <SettingsItem
            icon={<LockIcon />}
            label="Change Password"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<ShieldIcon />}
            label="Security & Privacy"
            onPress={() => {}}
          />
        </SettingsGroup>

        {/* Logout Area */}
        <SettingsGroup delay={300}>
          <SettingsItem
            icon={<LogOutIcon />}
            label="Log out"
            isLogout
            onPress={() => {}}
          />
        </SettingsGroup>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* ── Fixed Header (from global.css .fixed-header) ── */
  fixedHeader: {
    backgroundColor: 'rgba(59,130,246,0.06)',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 20,
    zIndex: 20,
    flexShrink: 0,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_LABEL,
  },

  /* ── Scroll View ── */
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  /* ── Profile Card ── */
  profileCard: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 30,
    elevation: 2,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: PRIMARY_BG,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: 20,
  },
  editProfileBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
  },

  /* ── Settings Group ── */
  settingsGroup: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 30,
    elevation: 2,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 24,
  },

  /* ── Settings Item ── */
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  settingsIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  settingsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
});
