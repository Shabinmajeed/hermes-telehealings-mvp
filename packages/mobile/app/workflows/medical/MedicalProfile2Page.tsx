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

export default function MedicalProfile2Page() {
  const router = useRouter();
  const [whatBringsYou, setWhatBringsYou] = useState('');
  const [howLong, setHowLong] = useState('');
  const [dailyImpact, setDailyImpact] = useState('');
  const [expectations, setExpectations] = useState('');

  const handleNext = () => {
    router.push('/workflows/medical/MedicalProfile3Page');
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

          {/* 4-Step Stepper — Step 2 active */}
          <View className="flex-row justify-between gap-1.5 mt-2 px-2">
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-500" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
          </View>
        </LinearGradient>

        {/* Form Area */}
        <View className="flex-1 px-6 pt-4" style={{ backgroundColor: '#ffffff' }}>

          <Text className="text-[26px] font-extrabold text-black mb-2 mt-2">Presenting Concerns</Text>
          <Text className="text-sm text-slate-600 leading-5 mb-6">
            Please provide detailed information about your current situation to help us match you with the right therapist.
          </Text>

          {/* Question 1 */}
          <View className="mb-4">
            <Text className="text-[15px] font-bold text-black mb-3">What brings you to therapy?</Text>
            <TextInput
              className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
              placeholder="Share your main reasons for seeking support..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={whatBringsYou}
              onChangeText={setWhatBringsYou}
            />
          </View>

          {/* Question 2 */}
          <View className="mb-4">
            <Text className="text-[15px] font-bold text-black mb-3">Since how long have you been experiencing this?</Text>
            <TextInput
              className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
              placeholder="Provide a timeline of when these concerns started..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={howLong}
              onChangeText={setHowLong}
            />
          </View>

          {/* Question 3 */}
          <View className="mb-4">
            <Text className="text-[15px] font-bold text-black mb-3">How is this affecting your daily life?</Text>
            <TextInput
              className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
              placeholder="Describe the impact on your work,relationships, or personal wellbeing..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={dailyImpact}
              onChangeText={setDailyImpact}
            />
          </View>

          {/* Question 4 */}
          <View className="mb-2">
            <Text className="text-[15px] font-bold text-black mb-3">What are your expectations from therapy?</Text>
            <TextInput
              className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
              placeholder="What goals or outcomes are you hoping to achieve?"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={expectations}
              onChangeText={setExpectations}
            />
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
