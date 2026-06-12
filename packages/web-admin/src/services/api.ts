const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5172';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token');
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
      request<{ token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<{ id: string; name: string; email: string; role: string }>('/auth/me'),
  },

  dashboard: {
    getStats: () =>
      request<{
        totalClients: number;
        activeClients: number;
        totalTherapists: number;
        activeTherapists: number;
        sessionsToday: number;
        sessionsThisWeek: number;
        revenueThisMonth: number;
        revenueLastMonth: number;
      }>('/admin/dashboard/stats'),
    getRecentActivity: () =>
      request<Array<{ id: string; type: string; message: string; timestamp: string }>>(
        '/admin/dashboard/activity',
      ),
  },

  clients: {
    list: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<{ data: Array<Record<string, unknown>>; total: number; page: number; pageSize: number }>(
        `/admin/clients${qs}`,
      );
    },
    get: (id: string) => request<Record<string, unknown>>(`/admin/clients/${id}`),
  },

  therapists: {
    list: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<{ data: Array<Record<string, unknown>>; total: number; page: number; pageSize: number }>(
        `/admin/therapists${qs}`,
      );
    },
    get: (id: string) => request<Record<string, unknown>>(`/admin/therapists/${id}`),
  },

  sessions: {
    list: (params?: { page?: number; pageSize?: number; status?: string; from?: string; to?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<{ data: Array<Record<string, unknown>>; total: number; page: number; pageSize: number }>(
        `/admin/sessions${qs}`,
      );
    },
  },
};
