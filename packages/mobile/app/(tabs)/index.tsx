import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

/* ─────────────────────────────────────────────
   SVG Icon Components (react-native-svg)
   ───────────────────────────────────────────── */
const SvgIcon = ({
  children,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'flex' }}
  >
    {children}
  </Svg>
);

const ChevronDown = ({ color = '#1a293b', size = 18 }: { color?: string; size?: number }) => (
  <SvgIcon size={size} color={color} strokeWidth={2.5}>
    <Polyline points="6 9 12 15 18 9" />
  </SvgIcon>
);

const ChevronRight = ({ color = '#387bd5', size = 18 }: { color?: string; size?: number }) => (
  <SvgIcon size={size} color={color} strokeWidth={3}>
    <Polyline points="9 18 15 12 9 6" />
  </SvgIcon>
);

const CloseIcon = ({ color = '#94a3b8', size = 16 }: { color?: string; size?: number }) => (
  <SvgIcon size={size} color={color} strokeWidth={2.5}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </SvgIcon>
);

const BellIcon = ({ color = '#384e68' }: { color?: string }) => (
  <SvgIcon size={24} color={color}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </SvgIcon>
);

const ShieldCheckIcon = () => (
  <SvgIcon size={24} color="#94a3b8">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Polyline points="9 12 11 14 15 10" />
  </SvgIcon>
);

const PlayIcon = ({ color = '#fff', size = 24 }: { color?: string; size?: number }) => (
  <SvgIcon size={size} color={color}>
    <Polygon points="5 3 19 12 5 21 5 3" />
  </SvgIcon>
);

const VideoIcon = () => (
  <SvgIcon size={22} color="#ffffff" strokeWidth={2.5}>
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </SvgIcon>
);

const CalendarIcon = () => (
  <SvgIcon size={20} color="#387bd5">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </SvgIcon>
);

const ShieldSmallIcon = () => (
  <SvgIcon size={20} color="#387bd5">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </SvgIcon>
);

const LogOutIcon = () => (
  <SvgIcon size={18} color="#ef4444" strokeWidth={2.2}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </SvgIcon>
);

/* ─────────────────────────────────────────────
   Mood SVG Face Components
   ───────────────────────────────────────────── */
const MoodFace = ({
  mood,
  color = '#94a3b8',
  size = 28,
}: {
  mood: string;
  color?: string;
  size?: number;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    style={{ display: 'flex' }}
  >
    <Circle cx="18" cy="18" r="18" fill={color} />
    {mood === 'energized' && (
      <>
        <Path d="M10 14 Q12 11 14 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Path d="M22 14 Q24 11 26 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Path d="M10 20 Q18 28 26 20 Z" fill="#ffffff" />
      </>
    )}
    {mood === 'calm' && (
      <>
        <Circle cx="12" cy="14" r="2.5" fill="#ffffff" />
        <Circle cx="24" cy="14" r="2.5" fill="#ffffff" />
        <Path d="M12 22 Q18 26 24 22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </>
    )}
    {mood === 'okay' && (
      <>
        <Circle cx="12" cy="14" r="2" fill="#ffffff" />
        <Circle cx="24" cy="14" r="2" fill="#ffffff" />
        <Line x1="13" y1="22" x2="23" y2="22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </>
    )}
    {mood === 'sad' && (
      <>
        <Circle cx="12" cy="14" r="2" fill="#ffffff" />
        <Circle cx="24" cy="14" r="2" fill="#ffffff" />
        <Path d="M12 24 Q18 20 24 24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </>
    )}
    {mood === 'stressed' && (
      <>
        <Path d="M10 12 L14 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M26 12 L22 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="12" cy="16" r="2" fill="#ffffff" />
        <Circle cx="24" cy="16" r="2" fill="#ffffff" />
        <Path d="M12 25 Q18 21 24 25" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </>
    )}
  </Svg>
);

/* ─────────────────────────────────────────────
   Animated Card Wrapper (slideFadeUp)
   ───────────────────────────────────────────── */
const AnimatedCard = ({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: object;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
const MOODS = [
  { id: 'energized', label: 'Energized' },
  { id: 'calm', label: 'Calm' },
  { id: 'okay', label: 'Okay' },
  { id: 'sad', label: 'Sad' },
  { id: 'stressed', label: 'Stressed' },
];

const MOOD_PROMPTS: Record<string, string> = {
  energized: "What's fueling your energy today? (Optional)",
  calm: "What's bringing you peace today? (Optional)",
  okay: 'Anything on your mind? (Optional)',
  sad: "What's making you feel down? Let it out. (Optional)",
  stressed: "What's causing your stress? Writing it down might help. (Optional)",
};

const CONTENT_ITEMS = [
  {
    id: 1,
    title: 'Yoga for Desk Workers',
    meta: 'Video \u2022 12 min',
    bgColor: '#e8f5e9',
    hasPlay: true,
  },
  {
    id: 2,
    title: 'Understanding Your Anxiety Triggers',
    meta: 'Article \u2022 5 min read',
    bgColor: '#fce4ec',
    hasPlay: false,
  },
  {
    id: 3,
    title: 'Guided Meditation for Sleep',
    meta: 'Audio \u2022 15 min',
    bgColor: '#e3f2fd',
    hasPlay: true,
  },
  {
    id: 4,
    title: 'The Science Behind Mindfulness',
    meta: 'Article \u2022 7 min read',
    bgColor: '#fff3e0',
    hasPlay: false,
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    text: (
      <>
        <Text style={{ fontWeight: '700' }}>Reminder:</Text> Your appointment with John is tomorrow at 04:00 PM.
      </>
    ),
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    text: (
      <>
        <Text style={{ fontWeight: '700' }}>Security:</Text> Your phone number was successfully verified.
      </>
    ),
    time: '5 hours ago',
    unread: true,
  },
];

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─────────────────────────────────────────────
   Main Screen
   ───────────────────────────────────────────── */
export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  const [showMoodCard, setShowMoodCard] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saveBtnState, setSaveBtnState] = useState<'idle' | 'saved'>('idle');

  /* Animated values for notification panel */
  const notifPanelAnim = useRef(new Animated.Value(-10)).current;
  const notifPanelScale = useRef(new Animated.Value(0.95)).current;
  const notifOverlayAnim = useRef(new Animated.Value(0)).current;

  /* Pulse animation for notification dot */
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  /* Journal section slideFadeUp animation */
  const journalAnim = useRef(new Animated.Value(0)).current;
  const journalHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedMood) {
      Animated.parallel([
        Animated.timing(journalAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(journalHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(journalAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(journalHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [selectedMood]);

  const openNotifPanel = () => {
    setNotifOpen(true);
    Animated.parallel([
      Animated.timing(notifOverlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(notifPanelAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(notifPanelScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeNotifPanel = () => {
    Animated.parallel([
      Animated.timing(notifOverlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(notifPanelAnim, {
        toValue: -10,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(notifPanelScale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotifOpen(false);
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleMoodSelect = (moodId: string) => {
    if (selectedMood === moodId) {
      setSelectedMood(null);
    } else {
      setSelectedMood(moodId);
    }
  };

  const handleSaveJournal = () => {
    setSaveBtnState('saved');
    setTimeout(() => {
      setShowMoodCard(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Fixed Sticky Header with Gradient ── */}
      <LinearGradient
        colors={['#e7f2ff', '#2366bd']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerCurve} />
        <View style={styles.headerRow}>
          {/* User Profile */}
          <View style={styles.userProfile}>
            <View style={styles.avatar}>
              <SvgIcon size={24} color="#d1b894">
                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <Circle cx="12" cy="7" r="4" />
              </SvgIcon>
            </View>
            <TouchableOpacity
              onPress={() => setDropdownOpen(!dropdownOpen)}
              activeOpacity={0.7}
            >
              <View style={styles.userNameBox}>
                <Text style={styles.userName}>Ajesh Anand</Text>
                <ChevronDown />

                {/* User Dropdown */}
                {dropdownOpen && (
                  <View style={styles.userDropdown}>
                    <TouchableOpacity
                      style={[styles.dropdownItem, styles.dropdownLogout]}
                      onPress={() => setDropdownOpen(false)}
                    >
                      <LogOutIcon />
                      <Text style={styles.dropdownLogoutText}>Log out</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            onPress={openNotifPanel}
            activeOpacity={0.7}
            style={styles.notificationBtn}
          >
            <BellIcon />
            {notifications.length > 0 && (
              <Animated.View
                style={[
                  styles.notificationDot,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Main Scrollable Content ── */}
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Verify Banner */}
        <AnimatedCard delay={100}>
          <View style={styles.verifyBanner}>
            <View style={styles.verifyLeft}>
              <ShieldCheckIcon />
              <Text style={styles.verifyText}>
                Please verify your account to{'\n'}book Therapists.
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.verifyBtn}>
              <Text style={styles.verifyBtnText}>Verify</Text>
              <ChevronRight />
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* Greeting Section */}
        <AnimatedCard delay={200}>
          <View style={styles.greetingSection}>
            <View style={styles.greetingContent}>
              <Text style={styles.greetingHeading}>
                {getGreeting()}, Ajesh Anand
              </Text>
              <Text style={styles.greetingSubtext}>
                We're here to help you manage your stress today. Take a moment for yourself.
              </Text>
            </View>
            {/* Heali Mascot Image */}
            <View style={styles.greetingHeali}>
              <Image
                source={require('../../../src/assets/images/Heali.png')}
                style={styles.healiImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </AnimatedCard>

        {/* Mood Card */}
        {showMoodCard && (
          <AnimatedCard delay={300}>
            <View style={styles.card}>
              <View style={styles.moodHeader}>
                <Text style={styles.moodTitle}>How Are You Feeling today?</Text>
                <TouchableOpacity
                  onPress={() => setShowMoodCard(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeIconWrapper}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>

              {/* Mood Faces */}
              <View style={styles.moodFaces}>
                {MOODS.map((mood) => {
                  const isSelected = selectedMood === mood.id;
                  return (
                    <TouchableOpacity
                      key={mood.id}
                      onPress={() => handleMoodSelect(mood.id)}
                      activeOpacity={0.7}
                      style={styles.moodItem}
                    >
                      <View
                        style={[
                          styles.moodIconWrapper,
                          isSelected && styles.moodIconWrapperSelected,
                        ]}
                      >
                        <MoodFace
                          mood={mood.id}
                          color={isSelected ? '#387bd5' : '#94a3b8'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.moodLabel,
                          isSelected && styles.moodLabelSelected,
                        ]}
                      >
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Journal Section */}
              <Animated.View
                style={[
                  styles.journalSection,
                  {
                    opacity: journalAnim,
                    maxHeight: journalHeight.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 220],
                    }),
                    overflow: 'hidden',
                  },
                ]}
              >
                {selectedMood && (
                  <>
                    <Text style={styles.journalPrompt}>
                      {MOOD_PROMPTS[selectedMood] || 'Would you like to add a note about how you are feeling? (Optional)'}
                    </Text>
                    <TextInput
                      style={styles.journalTextarea}
                      placeholder="Type your thoughts here..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      numberOfLines={3}
                      value={journalText}
                      onChangeText={setJournalText}
                      textAlignVertical="top"
                    />
                    <TouchableOpacity
                      onPress={handleSaveJournal}
                      activeOpacity={0.8}
                      style={[
                        styles.journalSaveBtn,
                        saveBtnState === 'saved' && styles.journalSaveBtnSaved,
                      ]}
                    >
                      <Text style={styles.journalSaveBtnText}>
                        {saveBtnState === 'saved' ? 'Saved!' : 'Save Entry'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            </View>
          </AnimatedCard>
        )}

        {/* Upcoming Appointment Card */}
        <AnimatedCard delay={400}>
          <View style={styles.apptCard}>
            <View style={styles.apptHeader}>
              <View style={styles.apptStatusBadge}>
                <Text style={styles.apptStatusText}>Upcoming</Text>
              </View>
              <Text style={styles.apptId}>#TH-9482</Text>
            </View>

            <View style={styles.therapistInfo}>
              <View style={styles.therapistAvatar}>
                <SvgIcon size={28} color="#94a3b8">
                  <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <Circle cx="12" cy="7" r="4" />
                </SvgIcon>
              </View>
              <View style={styles.therapistDetails}>
                <Text style={styles.therapistName}>John .D</Text>
                <Text style={styles.therapistSpecialty}>Clinical Psychologist</Text>
              </View>
            </View>

            <View style={styles.apptTimeInfo}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Date</Text>
                <Text style={styles.timeValue}>Tomorrow, Oct 24</Text>
              </View>
              <View style={styles.timeDivider} />
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Time</Text>
                <Text style={styles.timeValue}>04:00 PM</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} style={styles.joinBtn}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.joinBtnGradient}
              >
                <VideoIcon />
                <Text style={styles.joinBtnText}>Join Session</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* Recommended Section Header */}
        <AnimatedCard delay={500}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* Content Carousel */}
        <AnimatedCard delay={600}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentRow}
          >
            {CONTENT_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[styles.contentCard, index === 0 && { marginLeft: 0 }]}
              >
                <View style={[styles.contentImgBox, { backgroundColor: item.bgColor }]}>
                  {/* Play icon for video/audio items */}
                  {item.hasPlay && (
                    <View style={styles.playIconOverlay}>
                      <PlayIcon size={24} />
                    </View>
                  )}
                </View>
                <Text style={styles.contentCardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.contentCardMeta} numberOfLines={1}>
                  {item.meta}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AnimatedCard>
      </ScrollView>

      {/* ── Notification Overlay Panel ── */}
      {notifOpen && (
        <View style={StyleSheet.absoluteFill}>
          {/* Semi-transparent backdrop */}
          <Animated.View
            style={[
              styles.notifOverlay,
              { opacity: notifOverlayAnim },
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeNotifPanel}
            />
          </Animated.View>

          {/* Panel */}
          <Animated.View
            style={[
              styles.notifPanel,
              {
                opacity: notifOverlayAnim,
                transform: [
                  { translateY: notifPanelAnim },
                  { scale: notifPanelScale },
                ],
              },
            ]}
            pointerEvents={notifOpen ? 'auto' : 'none'}
          >
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications</Text>
              {notifications.length > 0 && (
                <TouchableOpacity onPress={clearNotifications}>
                  <Text style={styles.notifClear}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {notifications.length > 0 ? (
              <ScrollView style={styles.notifList}>
                {notifications.map((notif) => (
                  <TouchableOpacity
                    key={notif.id}
                    activeOpacity={0.7}
                    style={[
                      styles.notifItem,
                      notif.unread && styles.notifItemUnread,
                    ]}
                  >
                    {notif.unread && <View style={styles.notifDot} />}
                    <View style={styles.notifIconContainer}>
                      {notif.id === 1 ? <CalendarIcon /> : <ShieldSmallIcon />}
                    </View>
                    <View style={styles.notifContent}>
                      <Text style={styles.notifText}>{notif.text}</Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.notifEmpty}>
                <Text style={styles.notifEmptyText}>No new notifications.</Text>
              </View>
            )}
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfcfd',
  },

  /* ── Header ── */
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 20,
  },
  headerCurve: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: '#fbfcfd',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#d1b894',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  userNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a293b',
  },
  userDropdown: {
    position: 'absolute',
    top: 40,
    left: -10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    width: 130,
    paddingVertical: 2,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    margin: 2,
  },
  dropdownLogout: {
    // intentionally empty - color is on dropdownLogoutText
  },
  dropdownLogoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 5,
  },

  /* ── Content ── */
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },

  /* ── Verify Banner ── */
  verifyBanner: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(56, 123, 213, 0.15)',
    marginBottom: 8,
  },
  verifyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  verifyText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: '#64748b',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  verifyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#387bd5',
  },

  /* ── Greeting Section ── */
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  greetingContent: {
    flex: 1,
  },
  greetingHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a293b',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  greetingSubtext: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19.5,
  },
  greetingHeali: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  healiImage: {
    width: 72,
    height: 72,
  },

  /* ── Card ── */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.03,
    shadowRadius: 35,
    elevation: 3,
  },

  /* ── Mood Card ── */
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a293b',
    letterSpacing: -0.3,
  },
  closeIconWrapper: {
    padding: 4,
  },
  moodFaces: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  moodItem: {
    alignItems: 'center',
    gap: 10,
  },
  moodIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  moodIconWrapperSelected: {
    backgroundColor: '#e2effb',
    transform: [{ scale: 1.15 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  moodLabelSelected: {
    color: '#1a293b',
  },

  /* ── Journal Section ── */
  journalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  journalPrompt: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
  },
  journalTextarea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1a293b',
    height: 80,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'System',
      default: 'Inter, System',
    }),
  },
  journalSaveBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#387bd5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  journalSaveBtnSaved: {
    backgroundColor: '#10b981',
  },
  journalSaveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  /* ── Appointment Card ── */
  apptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  apptStatusBadge: {
    backgroundColor: '#e2effb',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  apptStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e5ab8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  apptId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
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
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  joinBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  joinBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* ── Recommended Section ── */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a293b',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#387bd5',
  },

  /* ── Content Carousel ── */
  contentRow: {
    paddingRight: 20,
    gap: 16,
    paddingTop: 10,
    marginBottom: 30,
  },
  contentCard: {
    width: 160,
  },
  contentImgBox: {
    width: '100%',
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a293b',
    lineHeight: 18.2,
    marginBottom: 4,
  },
  contentCardMeta: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },

  /* ── Notification Overlay ── */
  notifOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    zIndex: 1000,
  },
  notifPanel: {
    position: 'absolute',
    top: 75,
    right: 20,
    width: 300,
    maxWidth: Dimensions.get('window').width - 40,
    maxHeight: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 1001,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  notifTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a293b',
  },
  notifClear: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  notifList: {
    maxHeight: 340,
  },
  notifItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    alignItems: 'flex-start',
  },
  notifItemUnread: {
    backgroundColor: '#f4f8fd',
  },
  notifDot: {
    position: 'absolute',
    left: 10,
    top: 24,
    width: 6,
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  notifIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2effb',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 6,
  },
  notifContent: {
    flex: 1,
    marginLeft: 12,
  },
  notifText: {
    fontSize: 13,
    color: '#1a293b',
    marginBottom: 6,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  notifEmpty: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  notifEmptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
