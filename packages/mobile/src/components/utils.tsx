import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AccentBarProps {
  color?: string;
  height?: number;
  className?: string;
}

export function AccentBar({
  color = '#3378FF',
  height = 4,
  className = '',
}: AccentBarProps) {
  return (
    <View
      className={`rounded-full ${className}`}
      style={{ backgroundColor: color, height }}
    />
  );
}

export function PageContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`flex-1 bg-white ${className}`}>{children}</View>
  );
}

export function Section({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`mb-6 ${className}`}>
      {title && (
        <View className="flex-row items-center mb-4">
          <View className="w-1.5 h-5 rounded-full bg-primary-500 mr-3" />
          <View className="flex-1">
            {/* Title rendered by parent */}
          </View>
        </View>
      )}
      {children}
    </View>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <View className={`h-px bg-surface-tertiary my-4 ${className}`} />;
}

export function Badge({
  text,
  variant = 'default',
  className = '',
}: {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const variantClasses = {
    default: 'bg-primary-50',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    error: 'bg-error/10',
  };

  const textClasses = {
    default: 'text-primary-600',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  return (
    <View
      className={`px-2.5 py-1 rounded-full ${variantClasses[variant]} ${className}`}
    >
      <Text className={`text-xs font-medium ${textClasses[variant]}`}>{text}</Text>
    </View>
  );
}


