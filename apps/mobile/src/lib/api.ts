import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getApiUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:3000`;
  }
  const extra: any =
    (Constants as any)?.expoConfig?.extra ??
    (Constants as any)?.manifest2?.extra ??
    {};
  return (
    extra?.EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://10.0.2.2:3000'
  );
};

const API_URL = getApiUrl();

export type Task = {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  status: 'A Fazer' | 'Concluída' | string;
  created_at?: string;
  updated_at?: string;
};

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

export const Tasks = {
  list: async () => {
    const { data } = await api.get<Task[]>('/tasks');
    return data;
  },
  get: async (id: number) => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },
  create: async (payload: { user_id: number; title: string; description?: string }) => {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },
  update: async (id: number, payload: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },
};
