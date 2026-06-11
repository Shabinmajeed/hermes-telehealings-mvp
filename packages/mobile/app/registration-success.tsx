import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function RegistrationSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {/* Success illustration */}
        <View className="w-24 h-24 rounded-full bg-primary-50 items-center justify-center mb-6">
          <View className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center">
            <Text className="text-white text-2xl font-bold">✓</Text>
          </View>
        </View>

        <Text className="text-text text-2xl font-bold mb-2">Welcome to TeleHealings</Text>
        <Text className="text-text-secondary text-sm text-center mb-8 leading-relaxed">
          Your account has been created successfully. You're all set to start your wellness journey.
        </Text>

        {/* Next steps card */}
        <View className="w-full rounded-2xl border border-surface-tertiary p-5 mb-8">
          <Text className="text-text text-sm font-semibold mb-4">What's next?</Text>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-primary-50 items-center justify-center mr-3">
              <Text className="text-primary-500 text-xs font-bold">1</Text>
            </View>
            <Text className="text-text-secondary text-sm">Complete your wellness profile</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-primary-50 items-center justify-center mr-3">
              <Text className="text-primary-500 text-xs font-bold">2</Text>
            </View>
            <Text className="text-text-secondary text-sm">Browse available therapists</Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary-50 items-center justify-center mr-3">
              <Text className="text-primary-500 text-xs font-bold">3</Text>
            </View>
            <Text className="text-text-secondary text-sm">Book your first session</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="w-full gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            className="py-4 rounded-2xl items-center bg-primary-500"
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-white text-base font-semibold">Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="py-4 rounded-2xl items-center border border-surface-tertiary"
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text className="text-text text-base font-semibold">Complete Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
