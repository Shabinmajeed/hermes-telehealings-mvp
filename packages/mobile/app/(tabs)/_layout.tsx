import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const color = focused ? '#3378FF' : '#9CA3AF';
  const icons: Record<string, string> = {
    index: 'H',
    sessions: 'S',
    messages: 'M',
    profile: 'P',
  };
  return (
    <View className="items-center justify-center">
      <View
        className={`w-6 h-6 rounded-md items-center justify-center ${
          focused ? 'bg-primary-50' : ''
        }`}
      >
        <Text className="text-xs font-bold" style={{ color }}>
          {icons[name] || name[0].toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEF0F5',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#3378FF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
          tabBarLabel: ({ focused: isFocused }) => (
            <Text
              style={{
                color: isFocused ? '#3378FF' : '#9CA3AF',
                fontSize: 11,
                fontWeight: '500',
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="sessions" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="messages" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
