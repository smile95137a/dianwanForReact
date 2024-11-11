import { api } from './BackendAPI';

const basePath = '/vendorOrder';

export const getAllOrder = async (): Promise<
  ApiResponse<VendorOrderEntity[]>
> => {
  try {
    const response = await api.get<ApiResponse<VendorOrderEntity[]>>(
      `${basePath}/all`
    );
    return response.data;
  } catch (error) {
    console.error('無法取得訂單資料', error);
    throw error;
  }
};

export const updateOrder = async (
  order: VendorOrderEntity
): Promise<ApiResponse<VendorOrderEntity>> => {
  try {
    const response = await api.put<ApiResponse<VendorOrderEntity>>(
      `${basePath}/${order.vendorOrder}`,
      order
    );
    return response.data;
  } catch (error) {
    console.error('無法更新訂單資料', error);
    throw error;
  }
};
