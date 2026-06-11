import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line, Polyline, Circle } from 'react-native-svg';

/* ------------------------------------------------------------------ */
/*  SVG icon components (inline, no emoji, matching design HTML)      */
/* ------------------------------------------------------------------ */

const IconBell = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const IconMoon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

const IconGlobe = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const IconShield = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const IconInfo = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);

const IconBox = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <Line x1="12" y1="22.08" x2="12" y2="12" />
  </Svg>
);

const IconPhone = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const IconChevron = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const IconBack = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#335075" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/*  CSS-only animated toggle switch (matches design HTML)             */
/* ------------------------------------------------------------------ */

function ToggleSwitch({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) {
  const animValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const bgColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#cbd5e1', '#387bd5'],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
      <Animated.View style={[styles.toggleSwitch, { backgroundColor: bgColor }]}>
        <Animated.View
          style={[styles.toggleKnob, { transform: [{ translateX }] }]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings icon in circular background                               */
/* ------------------------------------------------------------------ */

function SettingsIcon({ children }: { children: React.ReactNode }) {
  return <View style={styles.settingsIcon}>{children}</View>;
}

/* ------------------------------------------------------------------ */
/*  Settings item row                                                  */
/* ------------------------------------------------------------------ */

function SettingsItem({
  icon,
  text,
  value,
  chevron,
  toggle,
  toggleValue,
  onToggle,
  onPress,
}: {
  icon: React.ReactNode;
  text: string;
  value?: string;
  chevron?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      activeOpacity={0.7}
      onPress={onPress || onToggle}
    >
      <SettingsIcon>{icon}</SettingsIcon>
      <Text style={styles.settingsText}>{text}</Text>
      {value !== undefined && <Text style={styles.settingsValue}>{value}</Text>}
      {chevron && (
        <View style={styles.chevron}>
          <IconChevron />
        </View>
      )}
      {toggle && (
        <ToggleSwitch value={!!toggleValue} onToggle={onToggle || (() => {})} />
      )}
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/*  Section title                                                      */
/* ------------------------------------------------------------------ */

function SectionTitle({ text }: { text: string }) {
  return <Text style={styles.sectionTitle}>{text}</Text>;
}

/* ------------------------------------------------------------------ */
/*  Settings group (card)                                              */
/* ------------------------------------------------------------------ */

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.settingsGroup}>{children}</View>;
}

/* ------------------------------------------------------------------ */
/*  Main screen                                                        */
/* ------------------------------------------------------------------ */

export default function SettingsScreen() {
  const router = useRouter();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Sticky Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <IconBack />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholderBox} />
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Preferences */}
        <SectionTitle text="Preferences" />
        <SettingsGroup>
          <SettingsItem
            icon={<IconBell />}
            text="Push Notifications"
            toggle
            toggleValue={pushNotifs}
            onToggle={() => setPushNotifs(!pushNotifs)}
          />
          <SettingsItem
            icon={<IconMoon />}
            text="Dark Mode"
            toggle
            toggleValue={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
          <SettingsItem
            icon={<IconGlobe />}
            text="Language"
            value="English"
            chevron
          />
        </SettingsGroup>

        {/* Account */}
        <SectionTitle text="Account" />
        <SettingsGroup>
          <SettingsItem
            icon={<IconBell />}
            text="Notifications"
            chevron
          />
          <SettingsItem
            icon={<IconShield />}
            text="Two-Factor Authentication"
            chevron
          />
        </SettingsGroup>

        {/* About */}
        <SectionTitle text="About" />
        <SettingsGroup>
          <SettingsItem
            icon={<IconInfo />}
            text="Terms & Conditions"
            chevron
          />
          <SettingsItem
            icon={<IconBox />}
            text="Privacy Policy"
            chevron
          />
          <SettingsItem
            icon={<IconPhone />}
            text="Contact Support"
            chevron
          />
        </SettingsGroup>

        {/* Version */}
        <Text style={styles.versionText}>App Version 1.0.4 (Build 302)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles (matching design HTML exactly)                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfcfd',
  },
  /* Header */
  fixedHeader: {
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 25,
    zIndex: 20,
    flexShrink: 0,
    position: 'relative',
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1e5ab8',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  placeholderBox: {
    width: 40,
  },
  /* Content */
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 40,
  },
  /* Section title */
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  /* Settings group card */
  settingsGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  /* Settings item row */
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  settingsIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f4f8fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  settingsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a293b',
  },
  settingsValue: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Toggle switch (CSS-only animated) */
  toggleSwitch: {
    position: 'relative',
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
  },
  toggleKnob: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  /* Version */
  versionText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 12,
    color: '#94a3b8',
  },
});
