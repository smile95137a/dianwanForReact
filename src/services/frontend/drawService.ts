import { api } from './FrontendAPI';

export interface DrawRequest {
  userId: number;
  prizeNumber: number;
  productId: number;
}

export interface PrizeNumber {
  prizeNumberId: number;
  productDetailId: number;
  productId: number;
  number: number;
  isDrawn: boolean;
}

const basePath = '/draw';

// 抽獎
export const drawPrize = async (
  count: number,
  productId: number
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/oneprize`, {
      count,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error('Error executing prize draw:', error);
    throw error;
  }
};

// 獲取抽獎狀態
export const getDrawStatus = async (
  productId: number
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get(`${basePath}/status/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching draw status:', error);
    throw error;
  }
};

// 執行抽獎
export const executeDraw = async (
  productId: number,
  prizeNumbers: any[],
  exchangeType: number
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/execute`, {
      productId,
      prizeNumbers: prizeNumbers,
      exchangeType,
    });
    return response.data;
  } catch (error) {
    console.error('Error executing draw:', error);
    throw error;
  }
};

// 執行隨機抽獎
export const executeRandomDraw = async (
  productId: number,
  userUid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/random/${productId}`, null, {
      params: { userUid },
    });
    return response.data;
  } catch (error) {
    console.error('Error executing random draw:', error);
    throw error;
  }
};
export const redeemCode = async (drawDto: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/redeem`, drawDto);
    return response.data;
  } catch (error) {
    console.error('Error redeeming code:', error);
    throw error;
  }
};
