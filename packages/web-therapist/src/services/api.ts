import type {
  TherapistUser,
  DashboardStats,
  RecentActivity,
  Session,
  Client,
  PaginatedResponse,
} from '@/types';

const API_BASE_URL = 'http://localhost:5172';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('therapist_token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: TherapistUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<TherapistUser>('/auth/me'),
  },

  dashboard: {
    getStats: () => request<DashboardStats>('/therapist/dashboard/stats'),
    getRecentActivity: () =>
      request<RecentActivity[]>('/therapist/dashboard/activity'),
  },

  clients: {
    list: (params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      status?: string;
    }) => {
      const qs = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : '';
      return request<PaginatedResponse<Client>>(`/therapist/clients${qs}`);
    },
    get: (id: string) => request<Client>(`/therapist/clients/${id}`),
  },

  sessions: {
    list: (params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      from?: string;
      to?: string;
    }) => {
      const qs = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : '';
      return request<PaginatedResponse<Session>>(`/therapist/sessions${qs}`);
    },
    get: (id: string) => request<Session>(`/therapist/sessions/${id}`),
    updateStatus: (id: string, status: Session['status']) =>
      request<Session>(`/therapist/sessions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  profile: {
    get: () => request<TherapistUser>('/therapist/profile'),
    update: (data: Partial<TherapistUser>) =>
      request<TherapistUser>('/therapist/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
};
