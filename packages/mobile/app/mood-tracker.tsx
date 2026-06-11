import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const MOODS = [
  { value: 1, label: 'Very Low', color: '#EF4444', bg: '#FEF2F2' },
  { value: 2, label: 'Low', color: '#F97316', bg: '#FFF7ED' },
  { value: 3, label: 'Okay', color: '#EAB308', bg: '#FEFCE8' },
  { value: 4, label: 'Good', color: '#22C55E', bg: '#F0FDF4' },
  { value: 5, label: 'Great', color: '#3B82F6', bg: '#EFF6FF' },
];

const FACTORS = [
  'Sleep', 'Exercise', 'Work', 'Family', 'Friends', 'Health',
  'Weather', 'Nutrition', 'Stress', 'Social', 'Hobbies', 'Finances',
];

const WEEKLY_DATA = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 4 },
  { day: 'Wed', value: 2 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 5 },
  { day: 'Sat', value: 4 },
  { day: 'Sun', value: 3 },
];

export default function MoodTrackerScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-success-light items-center justify-center mb-4">
          <Text className="text-success text-2l">✓</Text>
        </View>
        <Text className="text-text text-xl font-bold mb-2">Mood Logged</Text>
        <Text className="text-text-secondary text-sm text-center">
          Your mood has been recorded. Keep tracking daily for better insights.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <View className="w-8 h-8 rounded-full bg-surface-secondary items-center justify-center">
              <Text className="text-text text-sm">←</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-text text-xl font-bold">Mood Tracker</Text>
        </View>

        {/* Date */}
        <View className="px-6 mb-6">
          <Text className="text-text-secondary text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        {/* How are you feeling */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">How are you feeling?</Text>
          <View className="flex-row justify-between">
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                activeOpacity={0.7}
                onPress={() => setSelectedMood(mood.value)}
                className="items-center"
              >
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
                  style={{
                    backgroundColor: selectedMood === mood.value ? mood.color : mood.bg,
                    borderWidth: selectedMood === mood.value ? 2 : 0,
                    borderColor: mood.color,
                  }}
                >
                  <View
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: mood.color }}
                  />
                </View>
                <Text
                  className="text-xs font-medium"
                  style={{ color: selectedMood === mood.value ? mood.color : '#6B7280' }}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Factors */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">What influenced your mood?</Text>
          <View className="flex-row flex-wrap gap-2">
            {FACTORS.map((factor) => (
              <TouchableOpacity
                key={factor}
                activeOpacity={0.7}
                onPress={() => toggleFactor(factor)}
                className={`px-4 py-2 rounded-full border ${
                  selectedFactors.includes(factor)
                    ? 'bg-primary-50 border-primary-500'
                    : 'bg-surface-secondary border-surface-tertiary'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedFactors.includes(factor) ? 'text-primary-600' : 'text-text-secondary'
                  }`}
                >
                  {factor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">Add a note</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <View className="rounded-2xl border border-surface-tertiary bg-surface-secondary p-4">
              <Text className="text-text-tertiary text-sm">
                What's on your mind? (optional)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Weekly overview */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">This Week</Text>
          <View className="bg-surface-secondary rounded-2xl p-5">
            <View className="flex-row items-end justify-between" style={{ height: 80 }}>
              {WEEKLY_DATA.map((day) => {
                const height = (day.value / 5) * 60;
                const moodColor = MOODS[day.value - 1]?.color || '#9CA3AF';
                return (
                  <View key={day.day} className="items-center" style={{ flex: 1 }}>
                    <View
                      className="w-6 rounded-full mb-2"
                      style={{ height: height || 4, backgroundColor: moodColor }}
                    />
                    <Text className="text-text-tertiary text-xs">{day.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Submit */}
        <View className="px-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={!selectedMood}
            className={`py-4 rounded-2xl items-center ${
              selectedMood ? 'bg-primary-500' : 'bg-neutral-200'
            }`}
          >
            <Text className="text-white text-base font-semibold">Log Mood</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
