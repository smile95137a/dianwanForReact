import { api } from './BackendAPI';

const basePath = '/user';

export const getAllUsers = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/query`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};

export const getUserById = async (
  userId: number
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

export const createUser = async (userReq: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/create`,
      userReq
    );
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  userReq: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put<ApiResponse<any>>(
      `${basePath}/update/${userId}`,
      userReq
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (
  userId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${basePath}/delete/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};

export const updateSliver = async (
  sliverUpdate: any
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post<ApiResponse<void>>(
      `${basePath}/updateSliver`,
      sliverUpdate
    );
    return response.data;
  } catch (error) {
    console.error('Error updating sliver:', error);
    throw error;
  }
};
