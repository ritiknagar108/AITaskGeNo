import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (name, email, password) =>
  API.post('/auth/register', { name, email, password });

export const loginUser = (email, password) =>
  API.post('/auth/login', { email, password });

export const getProfile = () => API.get('/auth/profile');

export const updatePassword = (oldPassword, newPassword) =>
  API.put('/auth/update-password', { oldPassword, newPassword });

// Task APIs
export const getTasks = () => API.get('/tasks');

export const createTask = (title, description, status, priority) =>
  API.post('/tasks', { title, description, status, priority });

export const updateTask = (id, title, description, status, priority) =>
  API.put(`/tasks/${id}`, { title, description, status, priority });

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const getStats = () => API.get('/tasks/stats');

// AI APIs
export const generateTasks = (text) =>
  API.post('/ai/generate-tasks', { text });

// Legacy API for backward compatibility
export const generateTasksLegacy = (goal, difficulty, duration) =>
  API.post('/ai/generate-tasks-legacy', { goal, difficulty, duration });

export default API;