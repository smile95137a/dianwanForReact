import { api } from './FrontendAPI';

export interface OrderQueryReq {
  startDate: string;
  endDate: string;
}

const basePath = '/transactions';

export const getTransactions = async (
  orderQueryReq: OrderQueryReq
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post<ApiResponse<any[]>>(
      `${basePath}/getTransactions`,
      orderQueryReq
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
