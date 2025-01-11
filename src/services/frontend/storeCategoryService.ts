import { api } from './FrontendAPI';

export interface IStoreCategory {
  categoryId: number;
  categoryName: string;
}

const basePath = '/storeCategory';

export const getAllCategories = async (): Promise<
  ApiResponse<IStoreCategory[]>
> => {
  try {
    const response = await api.get<ApiResponse<IStoreCategory[]>>(
      `${basePath}/query`
    );
    return response.data;
  } catch (error) {
    console.error('獲取所有類別時發生錯誤:', error);
    throw error;
  }
};

export const getCategoryById = async (
  id: number
): Promise<ApiResponse<IStoreCategory>> => {
  try {
    const response = await api.get<ApiResponse<IStoreCategory>>(
      `${basePath}/query/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取類別詳情時發生錯誤:', error);
    throw error;
  }
};
