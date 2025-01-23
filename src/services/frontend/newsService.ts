import { api } from './FrontendAPI';

const basePath = '/news';

export const getAllNews = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching news list:', error);
    throw error;
  }
};

export const getNewsById = async (
  newsUid: string
): Promise<ApiResponse<News>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${newsUid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with id ${newsUid}:`, error);
    throw error;
  }
};
export const getDisplayNews = async (): Promise<ApiResponse<News[]>> => {
  try {
    const response = await api.get<ApiResponse<News[]>>(`${basePath}/display`);
    return response.data;
  } catch (error) {
    console.error('Error fetching display news:', error);
    throw error;
  }
};
