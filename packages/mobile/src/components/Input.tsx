import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  className,
  ...props
}: InputProps) {
  return (
    <View style={containerStyle} className="w-full">
      {label && (
        <Text className="text-text text-sm font-medium mb-2">{label}</Text>
      )}
      <RNTextInput
        className={`w-full px-4 py-3.5 rounded-xl border bg-surface-secondary text-text text-base ${
          error ? 'border-error' : 'border-surface-tertiary'
        } ${className || ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="error text-xs mt-1.5">{error}</Text>
      )}
    </View>
  );
}
