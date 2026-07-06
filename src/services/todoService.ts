import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/todos';

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

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoService = {
  getAllTodos: async (): Promise<ApiResponse<TodoResponse[]>> => {
    const response = await apiClient.get<ApiResponse<TodoResponse[]>>('');
    return response.data;
  },
  
  createTodo: async (todo: TodoRequest): Promise<ApiResponse<TodoResponse>> => {
    const response = await apiClient.post<ApiResponse<TodoResponse>>('', todo);
    return response.data;
  },
  
  updateTodo: async (id: number, todo: TodoRequest): Promise<ApiResponse<TodoResponse>> => {
    const response = await apiClient.put<ApiResponse<TodoResponse>>(`/${id}`, todo);
    return response.data;
  },
  
  deleteTodo: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/${id}`);
    return response.data;
  },
};
