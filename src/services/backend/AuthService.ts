import { loadState, removeState, saveState } from '@/utils/Localstorage';
import { api } from './BackendAPI';

export interface JWTAuthResponse {
  accessToken: string;
  user: IUser;
}

export interface IUser {
  id: number;
  userUid: string;
  username: string;
  password: string | null;
  natId: string | null;
  nickname: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  roleId: number | null;
  status: string | null;
  balance: number | null;
  bonus: number | null;
  sliverCoin: number | null;
  provider: string | null;
  roles: string | null;
  drawCount: number | null;
}

const basePath = '/auth';

export const login = async (
  data: any
): Promise<ApiResponse<JWTAuthResponse>> => {
  try {
    const response = await api.post(`${basePath}/login`, data);
    return response.data;
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }
};

export const setAuthToken = (token: string | null) => {
  saveState('btoken', token);
};

export const getAuthToken = (): string | null => {
  return loadState<string>('btoken') || null;
};

export const removeAuthToken = () => {
  removeState('btoken');
};
