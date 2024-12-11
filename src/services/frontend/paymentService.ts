import { api } from './FrontendAPI';

const basePath = '/payment';

export const creditCard = async (
  paymentRequest: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      `${basePath}/creditCart`,
      paymentRequest
    );
    return response.data;
  } catch (error) {
    console.error('Error processing credit card payment:', error);
    throw error;
  }
};

export const creditTopOp = async (
  creditDto: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/creditTopOp`,
      creditDto
    );
    return response.data;
  } catch (error) {
    console.error('Error processing credit top-up:', error);
    throw error;
  }
};

export const creditMP = async (creditDto: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/creditMP`,
      creditDto
    );
    return response.data;
  } catch (error) {
    console.error('Error processing credit top-up:', error);
    throw error;
  }
};

export const webATM = async (
  paymentRequest: any
): Promise<ApiResponse<PaymentResponse>> => {
  try {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      `${basePath}/webATM`,
      paymentRequest
    );
    return response.data;
  } catch (error) {
    console.error('Error processing Web ATM payment:', error);
    throw error;
  }
};

export const topUp = async (
  paymentRequest: any
): Promise<ApiResponse<PaymentResponse>> => {
  try {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      `${basePath}/topOp`,
      paymentRequest
    );
    return response.data;
  } catch (error) {
    console.error('Error processing top-up:', error);
    throw error;
  }
};

export const claimReward = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await api.get<ApiResponse<string>>(`${basePath}/claim`);
    return response.data;
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
};

export const getTotalConsumeAmount = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/getTotal`);
    return response.data;
  } catch (error) {
    console.error('Error getting total consume amount:', error);
    throw error;
  }
};
