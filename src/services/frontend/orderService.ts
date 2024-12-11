import { api } from './FrontendAPI';

const basePath = '/order';

export const getOrderById = async (
  userUid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${userUid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order data:', error);
    throw error;
  }
};

export const queryOrder = async (req: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/queryOrder`,
      req
    );
    return response.data;
  } catch (error) {
    console.error('Error querying orders:', error);
    throw error;
  }
};

export const queryDrawOrder = async (req: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/queryDrawOrder`,
      req
    );
    return response.data;
  } catch (error) {
    console.error('Error querying draw orders:', error);
    throw error;
  }
};

export const getStoreProductOrderByOrderNumber = async (
  orderNumber: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/storeProduct/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching store product order data:', error);
    throw error;
  }
};

export const getStorePrizeProductOrderById = async (
  orderNumber: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/storeProduct/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching store prize product order data:', error);
    throw error;
  }
};

export const payCartItem = async (
  payCart: any
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/storeProduct/pay`,
      payCart
    );
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const payPrizeCartItem = async (
  payCart: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/product/pay`,
      payCart
    );
    return response.data;
  } catch (error) {
    console.error('Error processing prize cart payment:', error);
    throw error;
  }
};

export const ecpayCheckout = async (userId: number): Promise<string> => {
  try {
    const response = await api.post<string>(`${basePath}/ecpayCheckout`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating ecpay checkout:', error);
    throw error;
  }
};

export const handleEcpayNotification = async (
  paymentData: any
): Promise<string> => {
  try {
    const response = await api.post<string>(
      `${basePath}/returnUrl`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error handling ecpay notification:', error);
    throw error;
  }
};
