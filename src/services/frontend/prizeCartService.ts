import { api } from './FrontendAPI';

const basePath = '/prizeCart';

export const getPrizeCart = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/getCart`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    throw error;
  }
};
