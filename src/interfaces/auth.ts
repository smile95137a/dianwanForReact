// interfaces/auth.ts
import axios from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

// 示例： getCurrentUser  確保登入
export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get<User>('/api/auth/current-user', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch user');
  }

  return response.data;
};
