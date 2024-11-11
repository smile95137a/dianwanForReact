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

export const generateRedemptionCode = async (): Promise<
  ApiResponse<string>
> => {
  try {
    const response = await api.post<ApiResponse<string>>(
      `${basePath}/generate`
    );
    return response.data;
  } catch (error) {
    console.error('無法生成新的兌換碼', error);
    throw error;
  }
};
