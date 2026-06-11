import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const conditions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Condition'];
const tobaccoOptions = ['Never', 'Former', 'Current'];
const alcoholOptions = [
  { value: 'none', label: 'None' },
  { value: 'socially', label: 'Socially (1-2 times per week)' },
  { value: 'frequently', label: 'Frequently (3+ times per week)' },
  { value: 'daily', label: 'Daily' },
];

export default function MedicalProfile3Page() {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherConditions, setOtherConditions] = useState('');
  const [tobacco, setTobacco] = useState<string | null>(null);
  const [alcohol, setAlcohol] = useState('');
  const [otherSubstances, setOtherSubstances] = useState('');

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleNext = () => {
    router.push('/workflows/medical/MedicalProfile4Page');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <LinearGradient
          colors={['#e7f2ff', '#2366bd']}
          className="rounded-b-[35px] px-5 pt-10 pb-7"
        >
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
              <Text className="text-white text-2xl">{'\u2190'}</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold flex-1 text-center" style={{ letterSpacing: -0.5 }}>
              Medical Profile
            </Text>
            <View className="w-10" />
          </View>

          {/* 4-Step Stepper — Step 3 active */}
          <View className="flex-row justify-between gap-1.5 mt-2 px-2">
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-500" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
          </View>
        </LinearGradient>

        {/* Form Area */}
        <View className="flex-1 px-6 pt-4" style={{ backgroundColor: '#ffffff' }}>

          <Text className="text-[26px] font-extrabold text-black mb-2 mt-2">Medical & Medication</Text>
          <Text className="text-sm text-slate-600 leading-5 mb-6">
            Please provide accurate information regarding your current health status and any substances used. This data is encrypted and strictly confidential.
          </Text>

          {/* Question 1: Ongoing Medical Conditions (Multi-select) */}
          <View className="mb-4">
            <Text className="text-base font-bold text-black mb-4">Any ongoing medical conditions</Text>

            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition}
                activeOpacity={0.7}
                onPress={() => toggleCondition(condition)}
                className={`flex-row items-center p-3.5 border rounded-xl mb-3 ${
                  selectedConditions.includes(condition)
                    ? 'border-blue-500 bg-blue-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-[1.5px] mr-3.5 items-center justify-center ${
                    selectedConditions.includes(condition) ? 'border-blue-500' : 'border-slate-300'
                  }`}
                >
                  {selectedConditions.includes(condition) && (
                    <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  )}
                </View>
                <Text
                  className={`text-[15px] ${
                    selectedConditions.includes(condition) ? 'text-slate-900 font-medium' : 'text-slate-600'
                  }`}
                >
                  {condition}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              className="w-full h-[52px] border border-slate-200 rounded-xl px-4 text-[15px] text-slate-800 bg-white"
              placeholder="Other conditions (please specify)..."
              placeholderTextColor="#64748b"
              value={otherConditions}
              onChangeText={setOtherConditions}
            />
          </View>

          <View className="h-px bg-slate-200 mt-3 mb-6" />

          {/* Question 2: Substance Use */}
          <View className="mb-2">
            <Text className="text-base font-bold text-black mb-4">Substance use (alcohol, smoking, drugs)</Text>

            {/* Tobacco Use */}
            <View className="mt-4 mb-6">
              <Text className="text-black font-bold mb-3" style={{ fontSize: 14 }}>Tobacco Use</Text>
              <View className="flex-row gap-8">
                {tobaccoOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.7}
                    onPress={() => setTobacco(option)}
                    className="flex-row items-center"
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-[1.5px] mr-2.5 items-center justify-center ${
                        tobacco === option ? 'border-blue-500' : 'border-slate-300'
                      }`}
                    >
                      {tobacco === option && (
                        <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </View>
                    <Text
                      className={`text-[15px] ${
                        tobacco === option ? 'text-slate-900 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Alcohol Consumption */}
            <View className="mb-6">
              <Text className="text-slate-500 font-semibold mb-3" style={{ fontSize: 14 }}>Alcohol Consumption</Text>
              <View className="relative">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full h-[52px] border border-slate-200 rounded-xl px-4 justify-center bg-white"
                  onPress={() => {
                    // Cycle through options for simplicity in mobile
                    const currentIndex = alcoholOptions.findIndex((o) => o.value === alcohol);
                    const nextIndex = (currentIndex + 1) % alcoholOptions.length;
                    setAlcohol(alcoholOptions[nextIndex].value);
                  }}
                >
                  <Text className={`text-[15px] ${alcohol ? 'text-slate-800' : 'text-slate-400'}`}>
                    {alcohol
                      ? alcoholOptions.find((o) => o.value === alcohol)?.label
                      : 'Select frequency...'}
                  </Text>
                </TouchableOpacity>
                {/* Dropdown arrow */}
                <View className="absolute right-4 top-0 bottom-0 justify-center pointer-events-none">
                  <Text className="text-slate-400 text-sm">{'\u25BC'}</Text>
                </View>
              </View>
              {/* Hidden select for form state */}
              {alcohol ? null : null}
            </View>

            {/* Other Substances */}
            <View className="mb-2">
              <Text className="text-slate-500 font-semibold mb-3" style={{ fontSize: 14 }}>Other Substances</Text>
              <TextInput
                className="w-full h-[52px] border border-slate-200 rounded-xl px-4 text-[15px] text-slate-800 bg-white"
                placeholder="Any recreational drug use? (Optional)"
                placeholderTextColor="#64748b"
                value={otherSubstances}
                onChangeText={setOtherSubstances}
              />
            </View>
          </View>

          {/* Next Button */}
          <View className="mt-4 mb-6">
            <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl py-4 flex-row items-center justify-center gap-2.5"
                style={{
                  shadowColor: '#2563EB',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 8,
                }}
              >
                <Text className="text-white text-base font-bold">Save & Next</Text>
                <Text className="text-white text-base">{'\u2192'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
