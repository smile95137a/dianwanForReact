import { saveState, loadState, removeState } from '@/utils/Localstorage';
import { api } from './FrontendAPI';

const basePath = '/user';

export const getUserInfo = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/getUserInfo`);
    return response.data;
  } catch (error) {
    console.error('獲取使用者時發生錯誤:', error);
    throw error;
  }
};

export const registerUser = async (user: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/register`,
      user
    );
    return response.data;
  } catch (error) {
    console.error('註冊使用者時發生錯誤:', error);
    throw error;
  }
};

export const updateUser = async (user: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put<ApiResponse<any>>(
      `${basePath}/updateUser`,
      user
    );
    return response.data;
  } catch (error) {
    console.error('更新使用者時發生錯誤:', error);
    throw error;
  }
};

export const updateUserInvoice = async (
  user: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put<ApiResponse<any>>(
      `${basePath}/updateUserInvoice`,
      user
    );
    return response.data;
  } catch (error) {
    console.error('更新使用者時發生錯誤:', error);
    throw error;
  }
};

export const setUserId = (id: number | null) => {
  saveState('userId', id);
};

export const getUserId = (): number | null => {
  const id = loadState<string>('userId');
  return id ? parseInt(id, 10) : null;
};

export const removeUserId = () => {
  removeState('userId');
};

export const setUsername = (name: string | null) => {
  saveState('username', name);
};

export const getUsername = (): string | null => {
  return loadState<string>('username') || null;
};

export const removeUsername = () => {
  removeState('username');
};
