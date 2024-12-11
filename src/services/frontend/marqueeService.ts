import { api } from './FrontendAPI';

const basePath = '/marquee';

export const getAllMarquees = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get(`${basePath}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching marquees:', error);
    throw error;
  }
};
