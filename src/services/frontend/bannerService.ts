import { api } from './FrontendAPI';

const basePath = '/banner';

export const getAllBanners = async () => {
  try {
    const response = await api.get<ApiResponse<any[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};
