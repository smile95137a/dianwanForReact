import { api } from './BackendAPI';

const basePath = '/news';

export enum NewsStatus {
  AVAILABLE = 'AVAILABLE', // 已發布
  UNAVAILABLE = 'UNAVAILABLE', // 未發布
}

export const uploadImage = async (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<ApiResponse<string>>(
      `${basePath}/img/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const createNews = async (
  formData: FormData
): Promise<ApiResponse<News>> => {
  try {
    const response = await api.post<ApiResponse<News>>(basePath, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const updateNews = async (
  newsUid: string,
  formData: FormData
): Promise<ApiResponse<News>> => {
  try {
    const response = await api.put<ApiResponse<News>>(
      `${basePath}/${newsUid}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

export const getAllNews = async (): Promise<ApiResponse<News[]>> => {
  try {
    const response = await api.get<ApiResponse<News[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getNewsById = async (
  newsUid: string
): Promise<ApiResponse<News>> => {
  try {
    const response = await api.get<ApiResponse<News>>(`${basePath}/${newsUid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
};

export const deleteNews = async (
  newsUid: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${basePath}/${newsUid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

export const getImageUrl = (imagePath: string): string => {
  return `${import.meta.env.VITE_BASE_API_URL3}/img${imagePath}`;
};
