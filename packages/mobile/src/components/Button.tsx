import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  className = '',
}: ButtonProps) {
  const sizeClasses = {
    sm: 'py-2.5 px-4',
    md: 'py-3.5 px-6',
    lg: 'py-4 px-8',
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
      >
        <LinearGradient
          colors={
            disabled
              ? ['#9CA3AF', '#9CA3AF']
              : ['#3378FF', '#1B57F5']
          }
          className={`rounded-xl items-center justify-center ${sizeClasses[size]}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-sm font-semibold">{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || loading}
        className={`rounded-xl items-center justify-center bg-surface-secondary ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#3378FF" />
        ) : (
          <Text className="text-text text-sm font-semibold">{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || loading}
        className={`rounded-xl items-center justify-center border border-primary-500 ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#3378FF" />
        ) : (
          <Text className="text-primary-500 text-sm font-semibold">
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // Ghost
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <Text className="text-text-secondary text-sm font-medium">{title}</Text>
    </TouchableOpacity>
  );
}
