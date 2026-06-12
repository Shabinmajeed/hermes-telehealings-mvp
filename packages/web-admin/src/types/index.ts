export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatarUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  sessionsCount: number;
  therapistName?: string;
}

export interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  sessionsCount: number;
  clientsCount: number;
  joinedAt: string;
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
  totalClients: number;
  activeClients: number;
  totalTherapists: number;
  activeTherapists: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

export interface RecentActivity {
  id: string;
  type: 'session' | 'registration' | 'payment' | 'review' | 'alert';
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
