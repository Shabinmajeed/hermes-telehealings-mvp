import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api, { Session } from '../../../src/services/api';

type SessionTab = 'upcoming' | 'past';

export default function SessionsScreen() {
  const [activeTab, setActiveTab] = useState<SessionTab>('upcoming');
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSessions = useCallback(async () => {
    try {
      setError(null);
      const response = await api.getSessions();
      const allSessions = response.data || [];
      const now = new Date();
      setUpcomingSessions(
        allSessions.filter((s) => new Date(s.scheduledAt) >= now)
      );
      setPastSessions(
        allSessions.filter((s) => new Date(s.scheduledAt) < now)
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSessions();
  }, [fetchSessions]);

  const sessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    const datePart = isToday
      ? 'Today'
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date: datePart, time: timePart };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-text text-2xl font-bold">Sessions</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 mb-4 bg-surface-secondary rounded-xl p-1">
        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-lg items-center ${
            activeTab === 'upcoming' ? 'bg-white' : ''
          }`}
          activeOpacity={0.7}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === 'upcoming' ? 'text-text' : 'text-text-secondary'
            }`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-lg items-center ${
            activeTab === 'past' ? 'bg-white' : ''
          }`}
          activeOpacity={0.7}
          onPress={() => setActiveTab('past')}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === 'past' ? 'text-text' : 'text-text-secondary'
            }`}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6">
          {activeTab === 'upcoming' && (
            <TouchableOpacity
              activeOpacity={0.7}
              className="mb-4"
              onPress={() => router.push('/book-session')}
            >
              <View className="flex-row items-center p-4 rounded-2xl border border-surface-tertiary bg-surface-secondary">
                <View className="w-1.5 h-10 rounded-full bg-primary-500 mr-4" />
                <View className="flex-1">
                  <Text className="text-text text-sm font-semibold">
                    Book New Session
                  </Text>
                  <Text className="text-text-secondary text-xs mt-0.5">
                    Find a time that works for you
                  </Text>
                </View>
                <Text className="text-primary-500 text-lg">+</Text>
              </View>
            </TouchableOpacity>
          )}

          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-text-secondary text-sm mt-4">
                Loading sessions...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center py-16">
              <Text className="text-text-secondary text-sm">{error}</Text>
              <TouchableOpacity
                onPress={fetchSessions}
                className="mt-4 px-4 py-2 bg-primary-500 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : sessions.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-text-secondary text-sm">
                No {activeTab} sessions
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {sessions.map((session) => {
                const dt = formatDateTime(session.scheduledAt);
                return (
                  <TouchableOpacity
                    key={session.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (activeTab === 'upcoming') {
                        router.push({
                          pathname: '/session-delivery',
                          params: { id: session.id },
                        });
                      }
                    }}
                  >
                    <View className="p-4 rounded-2xl border border-surface-tertiary">
                      <View className="flex-row items-center mb-3">
                        <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                          <View
                            className="w-1.5 h-5 rounded-full"
                            style={{ backgroundColor: getStatusColor(session.status) }}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-text text-sm font-semibold">
                            {session.therapistName || 'Therapist'}
                          </Text>
                          <Text className="text-text-secondary text-xs mt-0.5">
                            {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session
                          </Text>
                        </View>
                        {session.status && (
                          <Text
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: getStatusColor(session.status) + '20',
                              color: getStatusColor(session.status),
                            }}
                          >
                            {session.status.replace('_', ' ')}
                          </Text>
                        )}
                      </View>
                      <View className="flex-row items-center justify-between ml-13">
                        <Text className="text-text-secondary text-xs">
                          {dt.date} at {dt.time}
                        </Text>
                        {session.duration != null && (
                          <Text className="text-text-tertiary text-xs">
                            {session.duration} min
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
