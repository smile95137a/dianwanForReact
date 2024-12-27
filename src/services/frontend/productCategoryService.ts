import { api } from './FrontendAPI';

const basePath = '/productCategory';

export const getAllCategories = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/all`);
    return response.data;
  } catch (error) {
    console.error('獲取所有產品類別時發生錯誤:', error);
    throw error;
  }
};

export const getCategoryById = async (
  uuid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${uuid}`);
    return response.data;
  } catch (error) {
    console.error('獲取產品類別詳情時發生錯誤:', error);
    throw error;
  }
};
