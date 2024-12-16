import { api } from './FrontendAPI';

const basePath = '/cart';

export const getCart = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/getCart`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    throw error;
  }
};
