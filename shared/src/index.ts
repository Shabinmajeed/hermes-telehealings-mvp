// Shared TypeScript types for TeleHealings platform
// Used by all frontend apps and backend

export type UserRole = 'admin' | 'therapist' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Therapist extends User {
  role: 'therapist';
  specialization: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  languages: string[];
  experience: number; // years
  clientsCount: number;
  sessionsCount: number;
}

export interface Client extends User {
  role: 'client';
  dateOfBirth?: string;
  medicalProfile?: MedicalProfile;
}

export interface MedicalProfile {
  mentalHealthHistory: string;
  presentingConcerns: string;
  medications: string;
  hospitalizations: boolean;
  riskAssessment: 'low' | 'medium' | 'high';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type SessionType = 'video' | 'audio' | 'chat';
export type SessionStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  clientId: string;
  therapistId: string;
  type: SessionType;
  status: SessionStatus;
  scheduledAt: string;
  duration: number; // minutes
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  therapistId: string;
  sessionType: SessionType;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Thread {
  id: string;
  participantIds: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface KPIData {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon?: string;
}

export interface RevenueData {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

export interface InsightItem {
  type: 'churn' | 'revenue' | 'marketing' | 'general';
  text: string;
  action?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}
