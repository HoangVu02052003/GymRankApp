import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.post('/auth/change-password', data)
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getStats: () => api.get('/profile/stats')
};

export const workoutAPI = {
  getTodayWorkout: () => api.get('/workout/today'),
  completeExercise: (data) => api.post('/workout/complete', data),
  getHistory: (params) => api.get('/workout/history', { params }),
  updateProgress: () => api.post('/workout/update-progress')
};

export const scheduleAPI = {
  getSchedules: (params) => api.get('/schedule', { params }),
  createSchedule: (data) => api.post('/schedule', data),
  getScheduleDetail: (id) => api.get(`/schedule/${id}`),
  getScheduleProgress: (id) => api.get(`/schedule/${id}/progress`),
  getTodaySchedule: () => api.get('/schedule/today'),
  getWeekSchedule: (params) => api.get('/schedule/week', { params }),
  addExercise: (data) => api.post('/schedule/exercise/add', data),
  removeExercise: (data) => api.post('/schedule/exercise/remove', data),
  updateExercise: (data) => api.put('/schedule/exercise/update', data),
  deleteSchedule: (id) => api.delete(`/schedule/${id}`),
  toggleActive: (id, data) => api.patch(`/schedule/${id}/toggle`, data)
};

export const rankAPI = {
  getAllRanks: (params) => api.get('/rank', { params }),
  getCurrentRank: () => api.get('/rank/current'),
  checkRankUp: () => api.get('/rank/check-rankup'),
  rankUp: () => api.post('/rank/rankup'),
  createTest: (data) => api.post('/rank/test/create', data),
  submitTest: (data) => api.post('/rank/test/submit', data)
};

export const aiAPI = {
  generatePlan: (data) => api.post('/ai/generate-plan', data),
  getRequiredInputs: () => api.get('/ai/required-inputs')
};

export const exerciseAPI = {
  getAll: (params) => api.get('/exercise', { params }),
  getById: (id) => api.get(`/exercise/${id}`),
  getByMuscleGroup: (nhomco, params) => api.get(`/exercise/muscle/${nhomco}`, { params }),
  getByDifficulty: (dokho, params) => api.get(`/exercise/difficulty/${dokho}`, { params }),
  search: (params) => api.get('/exercise/search', { params }),
  getMuscleGroups: () => api.get('/exercise/muscle-groups')
};

export const streakAPI = {
  getStreak: () => api.get('/streak'),
  getStats: () => api.get('/streak/stats'),
  maintain: () => api.post('/streak/maintain')
};

export const expAPI = {
  getExp: () => api.get('/exp'),
  getHistory: (params) => api.get('/exp/history', { params })
};

export const verificationAPI = {
  uploadVideo: (data) => api.post('/verification/upload', data),
  getVerifications: (params) => api.get('/verification', { params }),
  checkStatus: () => api.get('/verification/status')
};

export default api;
