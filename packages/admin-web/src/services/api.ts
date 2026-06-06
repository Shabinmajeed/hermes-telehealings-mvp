import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          localStorage.setItem('adminToken', response.data.accessToken);
          localStorage.setItem('adminRefreshToken', response.data.refreshToken);

          // Retry original request
          return api(error.config);
        } catch (err) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
};

export const adminAPI = {
  // Users Management
  getUsers: (filters?: any) =>
    api.get('/admin/users', { params: filters }),
  suspendUser: (userId: string) =>
    api.post(`/admin/users/${userId}/suspend`),
  deleteUser: (userId: string) =>
    api.post(`/admin/users/${userId}/delete`),

  // Therapists Verification
  getTherapists: (filters?: any) =>
    api.get('/admin/therapists', { params: filters }),
  approveTherapist: (therapistId: string) =>
    api.post(`/admin/therapists/${therapistId}/approve`),
  rejectTherapist: (therapistId: string) =>
    api.post(`/admin/therapists/${therapistId}/reject`),

  // Platform Analytics
  getAnalytics: () =>
    api.get('/admin/analytics'),
  getReports: () =>
    api.get('/admin/reports'),

  // Platform Settings
  getSettings: () =>
    api.get('/admin/settings'),
  updateSettings: (data: any) =>
    api.patch('/admin/settings', data),
};

export default api;
