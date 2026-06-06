import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
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
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          // Retry original request
          return api(error.config);
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
  passwordReset: (email: string, newPassword: string) =>
    api.post('/auth/password-reset', { email, newPassword }),
};

export const usersAPI = {
  getProfile: (userId: string) =>
    api.get(`/users/${userId}`),
  updateProfile: (userId: string, data: any) =>
    api.patch(`/users/${userId}`, data),
  uploadAvatar: (userId: string, avatarUrl: string) =>
    api.post(`/users/${userId}/avatar`, { avatarUrl }),
};

export const therapistsAPI = {
  searchTherapists: (filters: any) =>
    api.get('/therapists', { params: filters }),
  getTherapist: (therapistId: string) =>
    api.get(`/therapists/${therapistId}`),
  getAvailability: (therapistId: string) =>
    api.get(`/therapists/${therapistId}/availability`),
};

export const therapistRegistrationAPI = {
  register: (data: any) =>
    api.post('/therapists/register', data),
  getProfile: (therapistId: string) =>
    api.get(`/therapists/${therapistId}/profile`),
  updateProfile: (therapistId: string, data: any) =>
    api.patch(`/therapists/${therapistId}/profile`, data),
  uploadDocument: (therapistId: string, documentType: string, fileUrl: string) =>
    api.post(`/therapists/${therapistId}/documents`, { documentType, fileUrl }),
  getDocuments: (therapistId: string) =>
    api.get(`/therapists/${therapistId}/documents`),
  getVerificationStatus: (therapistId: string) =>
    api.get(`/therapists/${therapistId}/verification-status`),
};

export const availabilityAPI = {
  createSlot: (therapistId: string, data: any) =>
    api.post(`/therapists/${therapistId}/availability`, data),
  getAvailability: (therapistId: string) =>
    api.get(`/therapists/${therapistId}/availability`),
  updateSlot: (therapistId: string, slotId: string, data: any) =>
    api.patch(`/therapists/${therapistId}/availability/${slotId}`, data),
  deleteSlot: (therapistId: string, slotId: string) =>
    api.delete(`/therapists/${therapistId}/availability/${slotId}`),
  createBlockedDate: (therapistId: string, data: any) =>
    api.post(`/therapists/${therapistId}/blocked-dates`, data),
  getBlockedDates: (therapistId: string) =>
    api.get(`/therapists/${therapistId}/blocked-dates`),
  deleteBlockedDate: (therapistId: string, dateId: string) =>
    api.delete(`/therapists/${therapistId}/blocked-dates/${dateId}`),
  getAvailableSlots: (therapistId: string, date: string) =>
    api.get(`/therapists/${therapistId}/available-slots`, { params: { date } }),
};

export default api;
