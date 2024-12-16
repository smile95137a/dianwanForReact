import { api } from './FrontendAPI';
export interface CartItem {
  productCode: string;
  quantity: number;
}

const basePath = '/cartItem';

export const addCartItem = async (
  cartItem: CartItem
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post<ApiResponse<string>>(
      `${basePath}/add`,
      cartItem
    );
    return response.data;
  } catch (error) {
    console.error('Error adding cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (
  cartItemId: number
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.delete<ApiResponse<string>>(
      `${basePath}/remove/${cartItemId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const checkQuantity = async (
  cartItem: CartItem
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/checkQua`,
      cartItem
    );
    return response.data;
  } catch (error) {
    console.error('檢查商品數量時發生錯誤:', error);
    throw error;
  }
};
