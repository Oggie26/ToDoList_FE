import axios from 'axios';

const API_BASE_URL = 'https://furnimart.click/api/todos'

export interface TodoRequest {
  title: string;
  description?: string;
  completed: boolean;
  targetDate?: string;
}

export interface TodoResponse {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  targetDate?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

