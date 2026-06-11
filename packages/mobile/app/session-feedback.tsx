import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const RATINGS = [
  { key: 'overall', label: 'Overall Experience' },
  { key: 'therapist', label: 'Therapist Quality' },
  { key: 'audio_video', label: 'Audio & Video' },
  { key: 'ease', label: 'Ease of Use' },
];

const MOODS_AFTER = [
  { value: 1, label: 'Worse', color: '#EF4444' },
  { value: 2, label: 'Same', color: '#EAB308' },
  { value: 3, label: 'Better', color: '#22C55E' },
  { value: 4, label: 'Much Better', color: '#3B82F6' },
];

export default function SessionFeedbackScreen() {
  const router = useRouter();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [afterMood, setAfterMood] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      router.push('/(tabs)/sessions');
    }, 2500);
  };

  const allRated = RATINGS.every((r) => ratings[r.key]);

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-success-light items-center justify-center mb-4">
          <Text className="text-success text-2xl">✓</Text>
        </View>
        <Text className="text-text text-xl font-bold mb-2">Thank You</Text>
        <Text className="text-text-secondary text-sm text-center">
          Your feedback helps us improve your experience.
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
          <Text className="text-text text-xl font-bold">Session Feedback</Text>
        </View>

        {/* Session info */}
        <View className="px-6 mb-6">
          <View className="bg-surface-secondary rounded-2xl p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                <View className="w-1 h-5 rounded-full bg-primary-500" />
              </View>
              <View>
                <Text className="text-text text-sm font-semibold">Dr. Sarah Chen</Text>
                <Text className="text-text-secondary text-xs">Video Session • 50 min</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ratings */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">Rate your experience</Text>
          {RATINGS.map((rating) => (
            <View key={rating.key} className="mb-4">
              <Text className="text-text text-sm font-medium mb-2">{rating.label}</Text>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    activeOpacity={0.7}
                    onPress={() => handleRate(rating.key, star)}
                    className={`w-10 h-10 rounded-xl items-center justify-center border ${
                      (ratings[rating.key] || 0) >= star
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-surface-secondary border-surface-tertiary'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        (ratings[rating.key] || 0) >= star ? 'text-white' : 'text-text-tertiary'
                      }`}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Mood after session */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">How do you feel now?</Text>
          <View className="flex-row gap-3">
            {MOODS_AFTER.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                activeOpacity={0.7}
                onPress={() => setAfterMood(mood.value)}
                className={`flex-1 py-3 rounded-2xl items-center border ${
                  afterMood === mood.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-surface-tertiary bg-surface-secondary'
                }`}
              >
                <View
                  className="w-4 h-4 rounded-full mb-1"
                  style={{ backgroundColor: mood.color }}
                />
                <Text
                  className={`text-xs font-medium ${
                    afterMood === mood.value ? 'text-primary-600' : 'text-text-secondary'
                  }`}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional feedback */}
        <View className="px-6 mb-8">
          <Text className="text-text text-lg font-bold mb-4">Additional comments</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <View className="rounded-2xl border border-surface-tertiary bg-surface-secondary p-4" style={{ minHeight: 80 }}>
              <Text className="text-text-tertiary text-sm">
                Share anything else about your session... (optional)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <View className="px-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={!allRated}
            className={`py-4 rounded-2xl items-center ${
              allRated ? 'bg-primary-500' : 'bg-neutral-200'
            }`}
          >
            <Text className="text-white text-base font-semibold">Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
