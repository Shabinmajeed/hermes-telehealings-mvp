import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const therapyOptions = ['Yes, currently', 'Yes, in the past', 'No, never'];

export default function MedicalProfile1Page() {
  const router = useRouter();
  const [therapyHistory, setTherapyHistory] = useState<string | null>(null);
  const [mentalHealthDiagnosis, setMentalHealthDiagnosis] = useState('');
  const [traumaHistory, setTraumaHistory] = useState('');
  const [hospitalisation, setHospitalisation] = useState<string | null>(null);
  const [hospitalisationReason, setHospitalisationReason] = useState('');
  const [hospitalisationDate, setHospitalisationDate] = useState('');

  const handleNext = () => {
    router.push('/workflows/medical/MedicalProfile2Page');
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

          {/* 4-Step Stepper */}
          <View className="flex-row justify-between gap-1.5 mt-2 px-2">
            <View className="flex-1 h-[5px] rounded-sm bg-blue-500" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
            <View className="flex-1 h-[5px] rounded-sm bg-blue-200" />
          </View>
        </LinearGradient>

        {/* Form Area */}
        <View className="flex-1 px-6 pt-4" style={{ backgroundColor: '#ffffff' }}>

          {/* Info Banner */}
          <View className="bg-blue-50 border-l-[3px] border-blue-500 rounded-xl p-3 mb-4">
            <Text className="text-slate-600 text-[11.5px] leading-[18px]">
              Your mental well-being is as vital as your physical health. Please provide honest details to help us tailor your medical profile accurately. This data is encrypted and handled with the highest clinical confidentiality.
            </Text>
          </View>

          {/* Question 1: Therapy History */}
          <View className="mb-4">
            <Text className="text-base font-bold text-black mb-3">
              Have you attended therapy before?
            </Text>
            {therapyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                onPress={() => setTherapyHistory(option)}
                className={`flex-row items-center p-3.5 border rounded-xl mb-2 ${
                  therapyHistory === option
                    ? 'border-blue-500 bg-blue-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-[1.5px] mr-3.5 items-center justify-center ${
                    therapyHistory === option ? 'border-blue-500' : 'border-slate-300'
                  }`}
                >
                  {therapyHistory === option && (
                    <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  )}
                </View>
                <Text
                  className={`text-[15px] ${
                    therapyHistory === option ? 'text-slate-900 font-medium' : 'text-slate-600'
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="h-px bg-slate-200 mb-4" />

          {/* Question 2: Mental Health Diagnosis */}
          <View className="mb-4">
            <Text className="text-base font-bold text-black mb-1">
              Any past mental health diagnosis?
            </Text>
            <Text className="text-[13px] text-slate-500 mb-3 leading-[18px]">
              Please list any conditions you have been diagnosed with by a professional.
            </Text>
            <TextInput
              className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
              placeholder="E.g. Generalized Anxiety Disorder, Depression..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={mentalHealthDiagnosis}
              onChangeText={setMentalHealthDiagnosis}
            />
          </View>

          <View className="h-px bg-slate-200 mb-4" />

          {/* Question 3: Trauma History */}
          <View className="mb-4">
            <Text className="text-base font-bold text-black mb-1">
              Any history of trauma or significant life events?
            </Text>
            <Text className="text-[13px] text-slate-500 mb-3 leading-[18px]">
              Sharing this helps us understand potential triggers or underlying factors.
            </Text>
            <TextInput
              className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
              placeholder="Describe briefly if comfortable..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={traumaHistory}
              onChangeText={setTraumaHistory}
            />
          </View>

          <View className="h-px bg-slate-200 mb-4" />

          {/* Question 4: Psychiatric Hospitalisation */}
          <View className="mb-4">
            <Text className="text-base font-bold text-black mb-3">
              Any past psychiatric hospitalisation?
            </Text>
            <View className="flex-row gap-8 mb-3">
              {['Yes', 'No'].map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.7}
                  onPress={() => {
                    setHospitalisation(option);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  }}
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-[1.5px] mr-2.5 items-center justify-center ${
                      hospitalisation === option ? 'border-blue-500' : 'border-slate-300'
                    }`}
                  >
                    {hospitalisation === option && (
                      <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </View>
                  <Text
                    className={`text-[15px] ${
                      hospitalisation === option ? 'text-slate-900 font-medium' : 'text-slate-600'
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Conditional Details - slides in on Yes */}
            {hospitalisation === 'Yes' && (
              <View>
                <View className="mb-4">
                  <Text className="text-[13px] text-slate-400 mb-2">Reason (Optional)</Text>
                  <TextInput
                    className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-white"
                    placeholder="Briefly describe the reason..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    textAlignVertical="top"
                    value={hospitalisationReason}
                    onChangeText={setHospitalisationReason}
                  />
                </View>
                <View>
                  <Text className="text-[13px] text-slate-400 mb-2">Date (Optional)</Text>
                  <TextInput
                    className="w-full border-b border-slate-200 py-2 text-[15px] text-slate-800 bg-transparent"
                    placeholder="Select date"
                    placeholderTextColor="#94a3b8"
                    value={hospitalisationDate}
                    onChangeText={setHospitalisationDate}
                  />
                </View>
              </View>
            )}
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
