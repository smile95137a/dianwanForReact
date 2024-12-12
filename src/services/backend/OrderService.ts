import { api } from './BackendAPI';

const basePath = '/order';
const orderDetailsPath = '/orderDetails';
const expressPath = '/express';
const vendorOrderPath = '/vendorOrder';

export const getAllOrder = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/query`);
    return response.data;
  } catch (error) {
    console.error('無法取得訂單資料', error);
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`無法取得訂單 ${id} 資料`, error);
    throw error;
  }
};

export const updateOrder = async (
  id: number,
  order: Partial<any>
): Promise<void> => {
  try {
    const updatedOrder = {
      ...order,
      status: order.status, // 狀態已經是英文，直接傳給後端
    };
    console.log('Sending updated order:', updatedOrder);
    await api.put(`${basePath}/${id}`, updatedOrder);
  } catch (error) {
    console.error(`無法更新訂單 ${id}`, error);
    throw error;
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`${basePath}/${id}`);
  } catch (error) {
    console.error(`無法刪除訂單 ${id}`, error);
    throw error;
  }
};

export const getOrderDetailsByOrderId = async (
  orderId: number
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(
      `${orderDetailsPath}/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error(`無法取得訂單細節 ${orderId}`, error);
    throw error;
  }
};

export const convenience = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const apiUrl = `${expressPath}/${
      data.logisticsMode === 'store' ? 'convenience' : 'homeAndOffice'
    }`;
    const response = await api.post<ApiResponse<any>>(apiUrl, data);
    return response.data;
  } catch (error) {
    console.error('無法處理物流資料', error);
    throw error;
  }
};

export const updateOrderResultStatus = async (
  orderId: number,
  resultStatus: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put<ApiResponse<any>>(
      `${basePath}/${orderId}`,
      { resultStatus },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error(`無法更新訂單狀態 ${orderId}`, error);
    throw error;
  }
};

export const getAllVendor = async (
  orderId: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${vendorOrderPath}/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error(`無法取得供應商訂單資料 ${orderId}`, error);
    throw error;
  }
};

export const saveTrackingNumberAPI = async (data: {
  orderId: string;
  trackingNumber: string;
}): Promise<void> => {
  try {
    await api.post(`${vendorOrderPath}/updateTrackingNumber`, data);
  } catch (error) {
    console.error('無法儲存追蹤編號', error);
    throw error;
  }
};
