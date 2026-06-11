import { create } from 'zustand';

interface OnboardingState {
  interests: string[];
  goals: string[];
  phoneNumber: string;
  verificationCode: string;
  fullName: string;
  email: string;
  dateOfBirth: string;

  setInterests: (interests: string[]) => void;
  setGoals: (goals: string[]) => void;
  setPhoneNumber: (phone: string) => void;
  setVerificationCode: (code: string) => void;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setDateOfBirth: (dob: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  interests: [],
  goals: [],
  phoneNumber: '',
  verificationCode: '',
  fullName: '',
  email: '',
  dateOfBirth: '',

  setInterests: (interests) => set({ interests }),
  setGoals: (goals) => set({ goals }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setFullName: (fullName) => set({ fullName }),
  setEmail: (email) => set({ email }),
  setDateOfBirth: (dateOfBirth) => set({ dateOfBirth }),

  reset: () =>
    set({
      interests: [],
      goals: [],
      phoneNumber: '',
      verificationCode: '',
      fullName: '',
      email: '',
      dateOfBirth: '',
    }),
}));
