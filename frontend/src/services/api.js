import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username, password) => {
    // OAuth2PasswordRequestForm requires form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/users/profile'), // You need to make this endpoint
};

export const jobService = {
  getRecommendations: () => api.get('/jobs/recommendations'),
  getAllJobs: () => api.get('/jobs'),
};

export const resumeService = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData);
  }
};

export default api;
