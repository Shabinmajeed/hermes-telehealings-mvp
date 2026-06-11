import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SessionDeliveryScreen() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [elapsed, setElapsed] = useState('00:00');

  // Simulate timer
  useState(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setElapsed(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      {/* Main video area */}
      <View className="flex-1 relative">
        {/* Remote video placeholder */}
        <View className="flex-1 items-center justify-center">
          <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center mb-4">
            <View className="w-3 h-12 rounded-full bg-white" />
          </View>
          <Text className="text-white text-lg font-semibold">Dr. Sarah Chen</Text>
          <Text className="text-neutral-400 text-sm mt-1">Connected • {elapsed}</Text>
        </View>

        {/* Self view (picture-in-picture) */}
        <View className="absolute top-12 right-4 w-28 h-40 rounded-2xl bg-neutral-800 overflow-hidden">
          <View className="flex-1 items-center justify-center">
            {isCameraOff ? (
              <View className="w-10 h-10 rounded-full bg-neutral-700 items-center justify-center">
                <Text className="text-neutral-400 text-xs">OFF</Text>
              </View>
            ) : (
              <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center">
                <View className="w-1 h-5 rounded-full bg-white" />
              </View>
            )}
          </View>
        </View>

        {/* Connection quality */}
        <View className="absolute top-12 left-4 flex-row items-center bg-neutral-800 rounded-full px-3 py-1.5">
          <View className="w-2 h-2 rounded-full bg-success mr-2" />
          <Text className="text-white text-xs">Good connection</Text>
        </View>

        {/* Screen share indicator */}
        {isScreenShared && (
          <View className="absolute top-24 left-4 bg-primary-500 rounded-full px-3 py-1.5">
            <Text className="text-white text-xs font-medium">Sharing screen</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View className="px-6 py-6 bg-neutral-800">
        <View className="flex-row items-center justify-center gap-6">
          {/* Mute */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              isMuted ? 'bg-error' : 'bg-neutral-700'
            }`}
          >
            <Text className="text-white text-lg">{isMuted ? '🔇' : '🎤'}</Text>
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsCameraOff(!isCameraOff)}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              isCameraOff ? 'bg-error' : 'bg-neutral-700'
            }`}
          >
            <Text className="text-white text-lg">{isCameraOff ? '📷' : '📹'}</Text>
          </TouchableOpacity>

          {/* Screen share */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsScreenShared(!isScreenShared)}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              isScreenShared ? 'bg-primary-500' : 'bg-neutral-700'
            }`}
          >
            <Text className="text-white text-lg">🖥</Text>
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-14 h-14 rounded-full bg-neutral-700 items-center justify-center"
          >
            <Text className="text-white text-lg">💬</Text>
          </TouchableOpacity>

          {/* End call */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/session-feedback')}
            className="w-14 h-14 rounded-full bg-error items-center justify-center"
          >
            <Text className="text-white text-lg">📞</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-neutral-500 text-xs text-center mt-4">
          Session in progress • {elapsed}
        </Text>
      </View>
    </SafeAreaView>
  );
}
