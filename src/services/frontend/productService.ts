import { api } from './FrontendAPI';
export interface IProduct {
  productId: number;
  productName: string;
  description: string;
  price: number;
  sliverPrice: number;
  stockQuantity: number;
  imageUrls: string[];
  productType: string;
  prizeCategory: string;
  status: string;
  bonusPrice: number | null;
  length: number;
  width: number;
  height: number;
  specification: string;
  size: number;
  detailQuantity: number | null;
  detailStockQuantity: number | null;
}

const basePath = '/product';

export const getAllProduct = async (
  page: number = 0,
  size: number = 6
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.get<ApiResponse<IProduct[]>>(
      `${basePath}/query`,
      { params: { page, size } }
    );
    return response.data;
  } catch (error) {
    console.error('獲取所有產品時發生錯誤:', error);
    throw error;
  }
};

export const getAllProductList = async (): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.get<ApiResponse<IProduct[]>>(`${basePath}/all`);
    return response.data;
  } catch (error) {
    console.error('獲取所有產品時發生錯誤:', error);
    throw error;
  }
};

export const getProductById = async (
  id: any
): Promise<ApiResponse<IProduct>> => {
  try {
    const response = await api.get<ApiResponse<IProduct>>(
      `${basePath}/query/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};

export const getProductByType = async (
  type: any
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.get<ApiResponse<IProduct[]>>(
      `${basePath}/type/${type}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品類型時發生錯誤:', error);
    throw error;
  }
};
