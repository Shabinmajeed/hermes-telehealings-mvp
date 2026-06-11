/// <reference types="react-native" />

import * as SecureStore from 'expo-secure-store';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:5172';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  clientProfile?: {
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
  } | null;
  therapistProfile?: {
    fullName: string;
    phoneNumber?: string;
    specialty?: string;
    bio?: string;
    avatarUrl?: string;
  } | null;
}

export interface Session {
  id: string;
  clientId?: string;
  therapistId?: string;
  therapistName?: string;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  duration?: number;
  notes?: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  clientId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  scheduledAt: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderEmail: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      SecureStore.setItemAsync('auth_token', token);
    } else {
      SecureStore.deleteItemAsync('auth_token');
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await SecureStore.getItemAsync('auth_token');
    }
    return this.token;
  }

  async removeToken(): Promise<void> {
    this.token = null;
    await SecureStore.deleteItemAsync('auth_token');
  }

  private async requestRaw<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; response: Response }> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return { data, response };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const { data } = await this.requestRaw<T>(endpoint, options);
    return { data, success: true };
  }

  // ── Auth ──────────────────────────────────────────────

  async register(
    email: string,
    password: string,
    role: string = 'CLIENT'
  ): Promise<ApiResponse<AuthResponse>> {
    const resp = await this.requestRaw<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (resp.data.accessToken) {
      this.setToken(resp.data.accessToken);
    }
    return { data: resp.data, success: true };
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    const resp = await this.requestRaw<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (resp.data.accessToken) {
      this.setToken(resp.data.accessToken);
    }
    return { data: resp.data, success: true };
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      await this.removeToken();
    }
    return { data: { message: 'Logged out' }, success: true };
  }

  async refreshToken(
    refreshTokenValue: string
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const resp = await this.requestRaw<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      }
    );
    if (resp.data.accessToken) {
      this.setToken(resp.data.accessToken);
    }
    return { data: resp.data, success: true };
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/me');
  }

  // ── Sessions ──────────────────────────────────────────

  async getSessions(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<Session[]>> {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<Session[]>(`/sessions${qs}`);
  }

  async getSession(id: string): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/sessions/${id}`);
  }

  async createSession(data: {
    therapistId: string;
    scheduledAt: string;
    type: string;
  }): Promise<ApiResponse<Session>> {
    return this.request<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelSession(id: string): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/sessions/${id}/cancel`, {
      method: 'POST',
    });
  }

  async completeSession(
    id: string,
    feedback?: string,
    rating?: number
  ): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/sessions/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ feedback, rating }),
    });
  }

  // ── Bookings ──────────────────────────────────────────

  async getBookings(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<Booking[]>> {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<Booking[]>(`/bookings${qs}`);
  }

  async createBooking(data: {
    sessionId: string;
    scheduledAt: string;
  }): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  // ── Payments ──────────────────────────────────────────

  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/payments');
  }

  async createPayment(data: {
    bookingId: string;
    amount: number;
    currency?: string;
  }): Promise<ApiResponse<Payment>> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Notifications ─────────────────────────────────────

  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    return this.request<NotificationItem[]>('/notifications');
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>('/notifications/unread-count');
  }

  async markNotificationRead(id: string): Promise<ApiResponse<NotificationItem>> {
    return this.request<NotificationItem>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  // ── Therapists ────────────────────────────────────────

  async getTherapists(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<any[]>(`/therapists${qs}`);
  }

  async getTherapist(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/therapists/${id}`);
  }

  async getTherapistAvailability(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/therapists/${id}/availability`);
  }

  // ── Chat (REST fallback) ──────────────────────────────

  async getChatHistory(
    sessionId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ApiResponse<{ messages: ChatMessage[]; total: number }>> {
    return this.request<{ messages: ChatMessage[]; total: number }>(
      `/chat/session/${sessionId}/messages?limit=${limit}&offset=${offset}`
    );
  }

  async sendMessageREST(
    sessionId: string,
    content: string
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/chat/session/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
