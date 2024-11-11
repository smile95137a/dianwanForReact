import { api } from './FrontendAPI';

const basePath = '/storeProduct';

export const getPagedStoreProducts = async (
  page: number,
  size: number
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/query`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('分頁獲取產品數據時發生錯誤:', error);
    throw error;
  }
};

export const getStoreProductById = async (
  productCode: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/query/${productCode}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};

export const updateProductPopularity = async (
  productCode: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/${productCode}/popularity`
    );
    return response.data;
  } catch (error) {
    console.error('更新產品熱度時發生錯誤:', error);
    throw error;
  }
};

export const toggleFavorite = async (
  productCode: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/${productCode}/favorite`
    );
    return response.data;
  } catch (error) {
    console.error('收藏狀態切換時發生錯誤:', error);
    throw error;
  }
};
