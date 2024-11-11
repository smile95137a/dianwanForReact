import { api } from './FrontendAPI';

const basePath = '/recommendation-mapping';

export const getAllMappings = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all mappings:', error);
    throw error;
  }
};

export const getMappingById = async (
  id: number
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mapping by id ${id}:`, error);
    throw error;
  }
};
