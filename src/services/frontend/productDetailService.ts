import { api } from './FrontendAPI';
export interface IProductDetail {
  productDetailId: number;
  productId: number;
  description: string;
  note: string;
  size: string;
  quantity: number;
  stockQuantity: number;
  productName: string;
  grade: string;
  price: number;
  sliverPrice: number;
  imageUrls: string[];
  length: number;
  width: number;
  height: number;
  specification: string;
  status: string | null;
  prizeNumber: string | null;
  drawnNumbers: string | null;
}

const basePath = '/productDetail';

export const getAllProductDetails = async (): Promise<
  ApiResponse<IProductDetail[]>
> => {
  try {
    const response = await api.get<ApiResponse<IProductDetail[]>>(
      `${basePath}/query`
    );
    return response.data;
  } catch (error) {
    console.error('獲取所有產品詳情時發生錯誤:', error);
    throw error;
  }
};

export const getProductDetailById = async (
  productId: any
): Promise<ApiResponse<IProductDetail[]>> => {
  try {
    const response = await api.get<ApiResponse<IProductDetail[]>>(
      `${basePath}/query/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};
