import axios from 'axios';
import Constants from 'expo-constants';

// Lê do app.json -> expo.extra.EXPO_PUBLIC_API_URL
const API_URL =
  Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  Constants?.manifest2?.extra?.EXPO_PUBLIC_API_URL || // fallback
  'http://10.0.2.2:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000
});

// Endpoints de tasks
export const TaskAPI = {
  list: async (params = {}) => {
    const res = await api.get('/tasks', { params });
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post('/tasks', payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/tasks/${id}`, payload);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  }
};
