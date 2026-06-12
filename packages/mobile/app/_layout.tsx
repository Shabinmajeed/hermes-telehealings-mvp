import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Splash' }} />
        <Stack.Screen name="marketing" options={{ title: 'Marketing' }} />
        <Stack.Screen name="soft-onboarding" options={{ title: 'Soft Onboarding' }} />
        <Stack.Screen name="personalisation" options={{ title: 'Personalisation' }} />
        <Stack.Screen name="phone-auth" options={{ title: 'Phone Auth' }} />
        <Stack.Screen name="profile-completion" options={{ title: 'Profile Completion' }} />
        <Stack.Screen name="(tabs)" options={{ title: 'Home' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
      </Stack>
    </AuthProvider>
  );
}
