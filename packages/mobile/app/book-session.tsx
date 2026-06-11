import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const THERAPISTS = [
  { id: 1, name: 'Dr. Sarah Chen', specialty: 'Anxiety, CBT', rating: 4.9, available: true },
  { id: 2, name: 'Dr. Michael Torres', specialty: 'Depression, Trauma', rating: 4.8, available: true },
  { id: 3, name: 'Dr. Emily Park', specialty: 'Relationships, Family', rating: 4.7, available: false },
];

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

const SESSION_TYPES = [
  { id: 'video', title: 'Video Call', subtitle: 'Face-to-face session' },
  { id: 'audio', title: 'Audio Call', subtitle: 'Voice-only session' },
  { id: 'chat', title: 'Text Session', subtitle: 'Chat-based session' },
];

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    date: d.getDate(),
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    full: d,
  };
});

export default function SessionBookingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const canProceed = () => {
    if (step === 1) return selectedTherapist !== null;
    if (step === 2) return selectedDate !== null && selectedTime !== null;
    if (step === 3) return selectedType !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push('/booking-confirmation');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-2">
          <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())} className="mr-4">
            <View className="w-8 h-8 rounded-full bg-surface-secondary items-center justify-center">
              <Text className="text-text text-sm">←</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-text text-xl font-bold">Book Session</Text>
        </View>

        {/* Progress */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center gap-2">
            {[1, 2, 3].map((s) => (
              <View key={s} className="flex-1 flex-row items-center">
                <View
                  className={`h-1 flex-1 rounded-full ${
                    s <= step ? 'bg-primary-500' : 'bg-surface-tertiary'
                  }`}
                />
              </View>
            ))}
          </View>
          <Text className="text-text-tertiary text-xs mt-2">
            Step {step} of 3 — {step === 1 ? 'Select Therapist' : step === 2 ? 'Choose Time' : 'Session Type'}
          </Text>
        </View>

        {/* Step 1: Therapist */}
        {step === 1 && (
          <View className="px-6">
            <Text className="text-text text-lg font-bold mb-4">Choose your therapist</Text>
            {THERAPISTS.map((t) => (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.7}
                onPress={() => t.available && setSelectedTherapist(t.id)}
                disabled={!t.available}
                className={`mb-3 p-4 rounded-2xl border ${
                  selectedTherapist === t.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-surface-tertiary'
                } ${!t.available ? 'opacity-50' : ''}`}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center mr-3">
                    <View className="w-1.5 h-6 rounded-full bg-primary-500" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text text-sm font-semibold">{t.name}</Text>
                    <Text className="text-text-secondary text-xs mt-0.5">{t.specialty}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-text-tertiary text-xs">★ {t.rating}</Text>
                      {t.available && (
                        <Text className="text-success text-xs ml-3">Available</Text>
                      )}
                    </View>
                  </View>
                  {selectedTherapist === t.id && (
                    <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <View className="px-6">
            <Text className="text-text text-lg font-bold mb-4">Select a date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              <View className="flex-row gap-2">
                {DATES.map((d, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDate(i)}
                    className={`w-16 py-3 rounded-2xl items-center ${
                      selectedDate === i
                        ? 'bg-primary-500'
                        : 'bg-surface-secondary border border-surface-tertiary'
                    }`}
                  >
                    <Text className={`text-xs ${selectedDate === i ? 'text-white' : 'text-text-tertiary'}`}>
                      {d.day}
                    </Text>
                    <Text className={`text-lg font-bold ${selectedDate === i ? 'text-white' : 'text-text'}`}>
                      {d.date}
                    </Text>
                    <Text className={`text-xs ${selectedDate === i ? 'text-white' : 'text-text-tertiary'}`}>
                      {d.month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text className="text-text text-lg font-bold mb-4">Available times</Text>
            <View className="flex-row flex-wrap gap-2">
              {TIME_SLOTS.map((time) => (
                <TouchableOpacity
                  key={time}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTime(time)}
                  className={`px-4 py-2.5 rounded-xl border ${
                    selectedTime === time
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-surface-secondary border-surface-tertiary'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedTime === time ? 'text-white' : 'text-text-secondary'
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Session Type */}
        {step === 3 && (
          <View className="px-6">
            <Text className="text-text text-lg font-bold mb-4">Session type</Text>
            {SESSION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.7}
                onPress={() => setSelectedType(type.id)}
                className={`mb-3 p-4 rounded-2xl border ${
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-surface-tertiary'
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center mr-3">
                    <View className="w-1.5 h-5 rounded-full bg-primary-500" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text text-sm font-semibold">{type.title}</Text>
                    <Text className="text-text-secondary text-xs mt-0.5">{type.subtitle}</Text>
                  </View>
                  {selectedType === type.id && (
                    <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Summary */}
            <View className="mt-4 p-4 rounded-2xl bg-surface-secondary">
              <Text className="text-text text-sm font-semibold mb-2">Booking Summary</Text>
              <Text className="text-text-secondary text-xs">
                Therapist: {THERAPISTS.find((t) => t.id === selectedTherapist)?.name}
              </Text>
              {selectedDate !== null && selectedTime && (
                <Text className="text-text-secondary text-xs">
                  Date: {DATES[selectedDate].day}, {DATES[selectedDate].month} {DATES[selectedDate].date}
                </Text>
              )}
              {selectedTime && (
                <Text className="text-text-secondary text-xs">Time: {selectedTime}</Text>
              )}
              {selectedType && (
                <Text className="text-text-secondary text-xs">
                  Type: {SESSION_TYPES.find((t) => t.id === selectedType)?.title}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Next button */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={!canProceed()}
            className={`py-4 rounded-2xl items-center ${
              canProceed() ? 'bg-primary-500' : 'bg-neutral-200'
            }`}
          >
            <Text className="text-white text-base font-semibold">
              {step < 3 ? 'Continue' : 'Confirm Booking'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
