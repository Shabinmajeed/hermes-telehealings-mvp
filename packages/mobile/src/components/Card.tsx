import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  const variantClasses = {
    default: 'bg-surface-secondary',
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-white border border-surface-tertiary',
  };

  return (
    <View
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </View>
  );
}

export function AccentCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`rounded-2xl bg-primary-50 p-5 ${className}`}>
      {children}
    </View>
  );
}
