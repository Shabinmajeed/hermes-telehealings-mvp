import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function BookingConfirmationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {/* Success icon */}
        <View className="w-20 h-20 rounded-full bg-success-light items-center justify-center mb-6">
          <View className="w-10 h-10 rounded-full bg-success items-center justify-center">
            <Text className="text-white text-lg font-bold">✓</Text>
          </View>
        </View>

        <Text className="text-text text-2xl font-bold mb-2">Booking Confirmed</Text>
        <Text className="text-text-secondary text-sm text-center mb-8">
          Your session has been scheduled successfully. You'll receive a reminder 30 minutes before.
        </Text>

        {/* Booking details card */}
        <View className="w-full rounded-2xl border border-surface-tertiary p-5 mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center mr-3">
              <View className="w-1.5 h-6 rounded-full bg-primary-500" />
            </View>
            <View>
              <Text className="text-text text-sm font-semibold">Dr. Sarah Chen</Text>
              <Text className="text-text-secondary text-xs">Anxiety, CBT</Text>
            </View>
          </View>

          <View className="h-px bg-surface-tertiary mb-4" />

          <View className="flex-row justify-between mb-2">
            <Text className="text-text-tertiary text-sm">Date</Text>
            <Text className="text-text text-sm font-medium">Today, Jun 10</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-tertiary text-sm">Time</Text>
            <Text className="text-text text-sm font-medium">3:00 PM</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-tertiary text-sm">Type</Text>
            <Text className="text-text text-sm font-medium">Video Session</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-tertiary text-sm">Duration</Text>
            <Text className="text-text text-sm font-medium">50 minutes</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="w-full gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            className="py-4 rounded-2xl items-center bg-primary-500"
            onPress={() => router.push('/(tabs)/sessions')}
          >
            <Text className="text-white text-base font-semibold">View Sessions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="py-4 rounded-2xl items-center border border-surface-tertiary"
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-text text-base font-semibold">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
