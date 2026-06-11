import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polygon, Path, Rect, Line, Polyline } from 'react-native-svg';

/* ─────────────────────────────────────────────
   SVG Icon Helpers
   ───────────────────────────────────────────── */
const StarIcon = ({ color = '#94a3b8', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

const ShieldCheckIcon = ({ color = '#60a5fa', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Polyline points="9 12 11 14 15 10" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
const THERAPISTS = [
  {
    id: '1',
    name: 'John .D',
    quote: '"Healing takes time, and asking for help is a courageous first step."',
    tags: ['Stress', 'Anxiety', '8 Year'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    availability: 'Today At 04:00 Pm',
  },
  {
    id: '2',
    name: 'Smitha .S',
    quote: '"You don\'t have to have everything figured out right now\u2014just showing up for yourself today is more than enough."',
    tags: ['Anxiety', 'Depression', '10 Year'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    availability: 'Tomorrow At 10:00 Am',
  },
  {
    id: '3',
    name: 'Sarah .M',
    quote: '"Every journey is unique. We\'ll navigate yours together to find clarity."',
    tags: ['Trauma', 'Couples', '5 Year'],
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
    availability: 'Friday At 01:00 Pm',
  },
];

const TABS = ['Find Support', 'My Appointments', 'My Care'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 320;
const CARD_SPACING = 32; // total space between card centers (CARD_WIDTH + negative margin * 2 from design)
const SIDE_PADDING = Math.max(0, (SCREEN_WIDTH - CARD_WIDTH) / 2);

/* ─────────────────────────────────────────────
   Carousel Card Component
   ───────────────────────────────────────────── */
const CarouselCard = React.memo(({
  therapist,
  isActive,
  onFavorite,
  isFavorited,
}: {
  therapist: typeof THERAPISTS[0];
  isActive: boolean;
  onFavorite: () => void;
  isFavorited: boolean;
}) => {
  return (
    <View
      style={[
        styles.carouselCard,
        {
          opacity: isActive ? 1 : 0.6,
          transform: [{ scale: isActive ? 1 : 0.85 }],
        },
      ]}
    >
      {/* Blur overlay for non-active cards - simulates CSS filter: blur(3px) */}
      {!isActive && <View style={styles.blurOverlay} />}

      <Image
        style={styles.mainCardImg}
        source={{ uri: therapist.image }}
        resizeMode="cover"
      />

      {/* Star / Favorite Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onFavorite}
        style={[styles.starBtn, isFavorited && styles.starBtnFavorited]}
      >
        <StarIcon
          color={isFavorited ? '#f59e0b' : '#94a3b8'}
          size={20}
        />
      </TouchableOpacity>

      {/* Card Content Overlay - hidden when not active */}
      {isActive && (
        <View style={styles.mainCardContent}>
          <Text style={styles.quote} numberOfLines={3}>
            {therapist.quote}
          </Text>

          <View style={styles.therapistTitle}>
            <Text style={styles.therapistName} numberOfLines={1}>
              {therapist.name}
            </Text>
            <ShieldCheckIcon />
          </View>

          <View style={styles.tags}>
            {therapist.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.bookBtn}>
            <CalendarIcon />
            <View style={styles.bookBtnText}>
              <Text style={styles.bookTitle} numberOfLines={1}>
                Book an Appointment
              </Text>
              <Text style={styles.bookSub} numberOfLines={1}>
                Next Availability {therapist.availability}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

/* ─────────────────────────────────────────────
   Main Care Screen
   ───────────────────────────────────────────── */
export default function CareScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // slideFadeUp animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / CARD_SPACING);
      const clampedIndex = Math.max(0, Math.min(index, THERAPISTS.length - 1));
      setActiveCardIndex(clampedIndex);
    },
    [],
  );

  const handleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const renderCard = useCallback(
    ({ item, index }: { item: typeof THERAPISTS[0]; index: number }) => {
      const isActive = index === activeCardIndex;
      return (
        <CarouselCard
          therapist={item}
          isActive={isActive}
          onFavorite={() => handleFavorite(item.id)}
          isFavorited={!!favorites[item.id]}
        />
      );
    },
    [activeCardIndex, favorites, handleFavorite],
  );

  const keyExtractor = useCallback((item: typeof THERAPISTS[0]) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fbfcfd" />

      {/* ── Fixed Sticky Header ── */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitles}>
            <Text style={styles.headerH1}>Care</Text>
            <Text style={styles.discoverSubtitle}>
              Which area would you like to focus on today, Ajesh ?
            </Text>
          </View>
          <View style={styles.healiContainer}>
            <Text style={styles.healiPlaceholder}>Heali</Text>
          </View>
        </View>
      </View>

      {/* ── Main Scrollable Content ── */}
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

        {/* Carousel - with slideFadeUp animation */}
        <Animated.View style={[styles.carouselAnimWrapper, { opacity: fadeAnim }]}>
          <FlatList
            ref={flatListRef}
            data={THERAPISTS}
            renderItem={renderCard}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_SPACING}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: SIDE_PADDING,
              paddingTop: 10,
              paddingBottom: 30,
            }}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
            style={styles.carouselContainer}
          />
        </Animated.View>
      </View>
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
  /* ── Fixed Header ── */
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
  /* ── Content Wrapper ── */
  contentWrapper: {
    flex: 1,
    paddingTop: 10,
  },
  /* ── Tabs ── */
  discoverTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 24,
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
  /* ── Carousel ── */
  carouselAnimWrapper: {
    flex: 1,
  },
  carouselContainer: {
    flexGrow: 1,
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 520,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 8,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 2,
  },
  mainCardImg: {
    width: '100%',
    height: '100%',
  },
  /* ── Star Button ── */
  starBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  starBtnFavorited: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  /* ── Card Content ── */
  mainCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  quote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#cbd5e1',
    lineHeight: 1.5,
    marginBottom: 12,
  },
  therapistTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    width: '100%',
  },
  therapistName: {
    fontSize: 25,
    fontWeight: '600',
    color: '#ffffff',
    flexShrink: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '200',
    color: '#ffffff',
  },
  /* ── Book Button ── */
  bookBtn: {
    width: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
  },
  bookBtnText: {
    flex: 1,
    minWidth: 0,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  bookSub: {
    fontSize: 9,
    fontWeight: '300',
    color: '#a4c2ee',
  },
});
