import { api } from './FrontendAPI';

export interface IShippingMethod {
  shippingMethodId: number;
  name: string;
  size: number;
  shippingPrice: number;
}

const basePath = '/shipping';

export const getShippingMethod = async (
  size: number
): Promise<ApiResponse<IShippingMethod[]>> => {
  try {
    const response = await api.get<ApiResponse<IShippingMethod[]>>(
      `${basePath}/method`,
      {
        params: {
          size,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('獲取運送方式時發生錯誤:', error);
    throw error;
  }
};
