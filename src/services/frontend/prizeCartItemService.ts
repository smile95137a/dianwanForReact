import { api } from './FrontendAPI';
export interface CartItem {
  productCode: string;
  quantity: number;
}

const basePath = '/prize_cart_item';

export const removePrizeCartItem = async (
  prizeCartItemId: number
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.delete<ApiResponse<string>>(
      `${basePath}/remove/${prizeCartItemId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};
