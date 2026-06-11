import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type CheckStatus = 'pending' | 'checking' | 'passed' | 'failed';

interface CheckItem {
  id: string;
  label: string;
  status: CheckStatus;
}

export default function DeliveryPrecheckScreen() {
  const router = useRouter();
  const [checks, setChecks] = useState<CheckItem[]>([
    { id: 'camera', label: 'Camera access', status: 'checking' },
    { id: 'microphone', label: 'Microphone access', status: 'checking' },
    { id: 'speaker', label: 'Speaker / Audio output', status: 'checking' },
    { id: 'network', label: 'Network connection', status: 'checking' },
    { id: 'bandwidth', label: 'Bandwidth quality', status: 'checking' },
  ]);
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    // Simulate checking each item sequentially
    const order = ['camera', 'microphone', 'speaker', 'network', 'bandwidth'];
    order.forEach((id, index) => {
      setTimeout(() => {
        setChecks((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, status: 'passed' as CheckStatus } : c
          )
        );
        if (index === order.length - 1) {
          setAllPassed(true);
        }
      }, (index + 1) * 800);
    });
  }, []);

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'checking':
        return (
          <View className="w-6 h-6 rounded-full bg-surface-tertiary items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-text-tertiary" />
          </View>
        );
      case 'passed':
        return (
          <View className="w-6 h-6 rounded-full bg-success-light items-center justify-center">
            <Text className="text-success text-xs font-bold">✓</Text>
          </View>
        );
      case 'failed':
        return (
          <View className="w-6 h-6 rounded-full bg-error-light items-center justify-center">
            <Text className="text-error text-xs font-bold">✕</Text>
          </View>
        );
      default:
        return (
          <View className="w-6 h-6 rounded-full bg-surface-tertiary items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-text-tertiary" />
          </View>
        );
    }
  };

  const getStatusLabel = (status: CheckStatus) => {
    switch (status) {
      case 'checking': return 'Checking...';
      case 'passed': return 'Ready';
      case 'failed': return 'Issue detected';
      default: return 'Pending';
    }
  };

  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case 'checking': return 'text-text-tertiary';
      case 'passed': return 'text-success';
      case 'failed': return 'text-error';
      default: return 'text-text-tertiary';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center pb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <View className="w-8 h-8 rounded-full bg-surface-secondary items-center justify-center">
              <Text className="text-text text-sm">←</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-text text-xl font-bold">Pre-Session Check</Text>
        </View>

        <Text className="text-text-secondary text-sm mb-8">
          We're checking everything to make sure your session goes smoothly.
        </Text>

        {/* Camera preview */}
        <View className="items-center mb-8">
          <View className="w-40 h-40 rounded-3xl bg-surface-secondary items-center justify-center overflow-hidden">
            <View className="w-14 h-14 rounded-full bg-primary-50 items-center justify-center">
              <View className="w-2 h-7 rounded-full bg-primary-500" />
            </View>
          </View>
          <Text className="text-text-tertiary text-xs mt-3">Camera preview</Text>
        </View>

        {/* Checklist */}
        <View className="flex-1">
          {checks.map((check, index) => (
            <View
              key={check.id}
              className={`flex-row items-center justify-between py-4 ${
                index < checks.length - 1 ? 'border-b border-surface-tertiary' : ''
              }`}
            >
              <Text className="text-text text-sm font-medium">{check.label}</Text>
              <View className="flex-row items-center gap-2">
                <Text className={`text-xs ${getStatusColor(check.status)}`}>
                  {getStatusLabel(check.status)}
                </Text>
                {getStatusIcon(check.status)}
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View className="gap-3 pb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/session-delivery')}
            disabled={!allPassed}
            className={`py-4 rounded-2xl items-center ${
              allPassed ? 'bg-primary-500' : 'bg-neutral-200'
            }`}
          >
            <Text className="text-white text-base font-semibold">
              {allPassed ? 'Join Session' : 'Checking...'}
            </Text>
          </TouchableOpacity>
          {!allPassed && (
            <Text className="text-text-tertiary text-xs text-center">
              Please wait while we verify your setup
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
