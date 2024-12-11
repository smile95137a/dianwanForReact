import { api } from './BackendAPI';

const basePath = '/redemption';

export interface RedemptionCode {
  id: number;
  code: string;
  isRedeemed: boolean;
  redeemedAt: string | null;
  userId: number | null;
}

export const getAllRedemptionCodes = async (): Promise<
  ApiResponse<RedemptionCode[]>
> => {
  try {
    const response = await api.post<ApiResponse<RedemptionCode[]>>(
      `${basePath}/redeem`
    );
    return response.data;
  } catch (error) {
    console.error('無法取得兌換碼資料', error);
    throw error;
  }
};

export const generateRedemptionCode = async (
  productId: any,
  count: any
): Promise<any> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/generate/${productId}`,
      null,
      {
        params: { count },
      }
    );
    return response.data;
  } catch (error) {
    console.error('無法生成新的兌換碼', error);
    throw error;
  }
};

export const redeemCode = async (
  productId: number
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<RedemptionCode[]>>(
      `${basePath}/redeem/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('兌換商品失敗:', error);
    throw error;
  }
};
