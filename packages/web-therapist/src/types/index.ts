export interface TherapistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  sessionsCount: number;
  clientsCount: number;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  sessionsCount: number;
  notes?: string;
}

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  therapistId: string;
  therapistName: string;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  duration: number;
  notes?: string;
}

export interface DashboardStats {
  sessionsToday: number;
  sessionsThisWeek: number;
  activeClients: number;
  totalClients: number;
  avgRating: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

export interface RecentActivity {
  id: string;
  type: 'session' | 'message' | 'review' | 'payment' | 'alert';
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
