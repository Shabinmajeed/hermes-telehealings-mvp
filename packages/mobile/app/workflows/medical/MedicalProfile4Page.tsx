import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface BinaryQuestionProps {
  question: string;
  selected: boolean | null;
  onSelect: (value: boolean) => void;
}

function BinaryQuestion({ question, selected, onSelect }: BinaryQuestionProps) {
  return (
    <View className="mb-5">
      <Text className="text-base font-bold text-black mb-4">{question}</Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelect(true)}
          className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg border ${
            selected === true
              ? 'border-blue-600 border-2 bg-blue-50/40'
              : 'border-slate-300 bg-white'
          }`}
        >
          <Text
            className={`text-[15px] font-semibold ${
              selected === true ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            {selected === true ? '\u2713' : '\u25CB'}
          </Text>
          <Text
            className={`text-[15px] font-semibold ${
              selected === true ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelect(false)}
          className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg border ${
            selected === false
              ? 'border-blue-600 border-2 bg-blue-50/40'
              : 'border-slate-300 bg-white'
          }`}
        >
          <Text
            className={`text-[15px] font-semibold ${
              selected === false ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            {selected === false ? '\u2713' : '\u25CB'}
          </Text>
          <Text
            className={`text-[15px] font-semibold ${
              selected === false ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MedicalProfile4Page() {
  const router = useRouter();
  const [selfHarmThoughts, setSelfHarmThoughts] = useState<boolean | null>(null);
  const [selfHarmHistory, setSelfHarmHistory] = useState<boolean | null>(null);
  const [harmOthers, setHarmOthers] = useState<boolean | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleComplete = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push('/(tabs)');
    }, 2000);
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

          {/* 4-Step Stepper — Step 4 active */}
          <View className="flex-row justify-between gap-1.5 mt-2 px-2">
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-500" />
          </View>
        </LinearGradient>

        {/* Form Area */}
        <View className="flex-1 px-6 pt-4" style={{ backgroundColor: '#ffffff' }}>

          <Text className="text-[26px] font-extrabold text-black mb-2 mt-2">Risk & Safety</Text>
          <Text className="text-sm text-slate-600 leading-5 mb-4">
            To provide you with the best care, we need to ask some sensitive questions about your safety. This information is kept confidential between you and your healthcare team.
          </Text>

          {/* Confidentiality Info Box */}
          <View className="bg-indigo-50 border border-blue-500 rounded-xl p-4 flex-row gap-3 mb-6">
            <View className="mt-0.5 flex-shrink-0">
              <View className="w-[22px] h-[22px] items-center justify-center">
                <Text className="text-blue-600 text-base">{'\u{1F512}'}</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-black mb-1.5">Confidentiality Commitment</Text>
              <Text className="text-sm text-slate-600 leading-5">
                Your responses are encrypted and only accessible to your medical provider to ensure a safe treatment plan.
              </Text>
            </View>
          </View>

          {/* Question 1 */}
          <BinaryQuestion
            question="Have you had thoughts of harming yourself?"
            selected={selfHarmThoughts}
            onSelect={setSelfHarmThoughts}
          />

          {/* Question 2 */}
          <BinaryQuestion
            question="Any History of self-harm?"
            selected={selfHarmHistory}
            onSelect={setSelfHarmHistory}
          />

          {/* Question 3 */}
          <BinaryQuestion
            question="Thoughts of harming others?"
            selected={harmOthers}
            onSelect={setHarmOthers}
          />

          {/* Submit Button */}
          <View className="mt-4 mb-6">
            <TouchableOpacity activeOpacity={0.8} onPress={handleComplete}>
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

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          <View className="bg-white rounded-[20px] px-6 py-8 items-center w-[80%] max-w-[320px]" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 25, elevation: 10 }}>
            {/* Success Icon */}
            <View className="w-16 h-16 rounded-full bg-emerald-500 items-center justify-center mb-4" style={{ shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}>
              <Text className="text-white text-2xl font-bold">{'\u2713'}</Text>
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-2">Profile Saved!</Text>
            <Text className="text-sm text-slate-500 text-center leading-5">
              Your medical profile has been successfully updated.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
