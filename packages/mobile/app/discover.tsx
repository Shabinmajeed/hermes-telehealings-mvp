import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

const CATEGORIES = ['All', 'Articles', 'Audio', 'Videos', 'Exercises'];

const QUICK_TOOLS = [
  { id: 1, label: 'Breathe', icon: 'breathe' },
  { id: 2, label: 'Journal', icon: 'journal' },
  { id: 3, label: 'Tracker', icon: 'tracker' },
];

const RECOMMENDED_READS = [
  {
    id: 1,
    title: 'Understanding Your Anxiety Triggers',
    meta: 'Article \u2022 5 min read',
    image:
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80',
    type: 'article',
  },
  {
    id: 2,
    title: 'The Science Behind Mindfulness',
    meta: 'Article \u2022 7 min read',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    type: 'article',
  },
  {
    id: 3,
    title: 'Yoga for Desk Workers',
    meta: 'Video \u2022 12 min',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
    type: 'video',
  },
];

const TRENDING_TOPICS = [
  '#SleepHygiene',
  '#AnxietyRelief',
  '#Focus',
  '#SelfCare',
  '#Relationships',
];

const NEW_ARRIVALS = [
  {
    id: 1,
    title: 'The Art of Letting Go',
    meta: 'Podcast \u2022 25 min',
    image:
      'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    title: '5 Ways to Ground Yourself',
    meta: 'Article \u2022 4 min read',
    image:
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=200&q=80',
  },
];

function SearchIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#387bd5"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: 12 }}
    >
      <Circle cx={11} cy={11} r={8} />
      <Line x1={21} y1={21} x2={16.65} y2={16.65} />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: 6 }}
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}

function PlayIcon() {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="white"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Polygon points="5 3 19 12 5 21 5 3" />
      </Svg>
    </View>
  );
}

function BreatheIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1e5ab8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  );
}

function JournalIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1e5ab8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Svg>
  );
}

function TrackerIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1e5ab8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Svg>
  );
}

function ToolIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'breathe':
      return <BreatheIcon />;
    case 'journal':
      return <JournalIcon />;
    case 'tracker':
      return <TrackerIcon />;
    default:
      return null;
  }
}

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fbfcfd" />

      {/* Fixed Sticky Header with gradient matching global.css */}
      <LinearGradient
        colors={['rgba(59,130,246,0.12)', 'rgba(226,239,250,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fixedHeader}
      >
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>
          Explore tools, articles, and exercises.
        </Text>
      </LinearGradient>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentWrapperInner}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for content..."
            placeholderTextColor="#64748b"
          />
        </View>

        {/* Category Tabs - horizontal scroll, bleed to edges */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabs}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.catTab,
                activeCategory === cat ? styles.catTabActive : null,
              ]}
            >
              <Text
                style={[
                  styles.catTabText,
                  activeCategory === cat ? styles.catTabTextActive : null,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Content Hero Card */}
        <TouchableOpacity activeOpacity={0.9} style={styles.featuredCard}>
          <Image
            style={styles.featuredImg}
            source={{
              uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
            }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(15,23,42,0.2)', 'rgba(15,23,42,0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.featuredOverlay}
          >
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured Audio</Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              Guided Meditation for Deep Sleep
            </Text>
            <View style={styles.featuredMetaRow}>
              <ClockIcon />
              <Text style={styles.featuredMeta}>15 min listen</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Tools Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Tools</Text>
        </View>
        <View style={styles.toolsRow}>
          {QUICK_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              activeOpacity={0.8}
              style={styles.toolBox}
            >
              <View style={styles.toolIcon}>
                <ToolIcon icon={tool.icon} />
              </View>
              <Text style={styles.toolLabel}>{tool.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Reads Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Reads</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentRow}
        >
          {RECOMMENDED_READS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.contentCard}>
              <View style={styles.contentImgBox}>
                <Image
                  style={styles.contentImg}
                  source={{ uri: item.image }}
                />
                {item.type === 'video' && (
                  <View style={styles.playIconOverlay}>
                    <PlayIcon />
                  </View>
                )}
              </View>
              <Text style={styles.contentCardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.contentCardMeta}>{item.meta}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Topics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
        </View>
        <View style={styles.trendingTags}>
          {TRENDING_TOPICS.map((tag) => (
            <View key={tag} style={styles.trendingTag}>
              <Text style={styles.trendingTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* New Arrivals (Vertical List) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalList}>
          {NEW_ARRIVALS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.listItem}>
              <Image
                style={styles.listImg}
                source={{ uri: item.image }}
              />
              <View style={styles.listText}>
                <Text style={styles.listTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.listMeta}>{item.meta}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfcfd',
  },
  fixedHeader: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b6380',
  },
  contentWrapper: {
    flex: 1,
  },
  contentWrapperInner: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginTop: 10,
    marginBottom: 0,
    shadowColor: '#1e5ab8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a293b',
    padding: 0,
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingVertical: 15,
    gap: 10,
    marginBottom: 16,
  },
  catTab: {
    backgroundColor: '#e2effb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  catTabActive: {
    backgroundColor: '#1e5ab8',
    shadowColor: '#1e5ab8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  catTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b6380',
  },
  catTabTextActive: {
    color: '#ffffff',
  },
  featuredCard: {
    width: '100%',
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  featuredImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'flex-end',
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 4,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredMeta: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a293b',
    marginRight: 10,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#387bd5',
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  toolBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  toolIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f4f8fd',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a293b',
  },
  contentRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  contentCard: {
    width: 160,
    flexDirection: 'column',
  },
  contentImgBox: {
    width: '100%',
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  contentImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    lineHeight: 18,
    marginBottom: 4,
  },
  contentCardMeta: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  trendingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  trendingTag: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  trendingTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b6380',
  },
  verticalList: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  listImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  listText: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a293b',
    marginBottom: 4,
  },
  listMeta: {
    fontSize: 12,
    color: '#64748b',
  },
});
