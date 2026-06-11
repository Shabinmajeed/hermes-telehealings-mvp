export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Therapist {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  isOnline: boolean;
}

export interface Session {
  id: string;
  therapistId: string;
  therapist?: Therapist;
  userId: string;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  duration: number;
  notes?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
  tags: string[];
  createdAt: string;
}
