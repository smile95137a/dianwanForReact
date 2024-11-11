import { api } from './BackendAPI';

const basePath = '/shipping/method';

export const getAllShippingMethods = async (): Promise<
  ApiResponse<ShippingMethod[]>
> => {
  try {
    const response = await api.get<ApiResponse<ShippingMethod[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    throw error;
  }
};

export const getShippingMethodById = async (
  id: number
): Promise<ApiResponse<ShippingMethod>> => {
  try {
    const response = await api.get<ApiResponse<ShippingMethod>>(
      `${basePath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching shipping method with ID ${id}:`, error);
    throw error;
  }
};

export const createShippingMethod = async (
  shippingMethod: ShippingMethodReq
): Promise<ApiResponse<ShippingMethod>> => {
  try {
    const response = await api.post<ApiResponse<ShippingMethod>>(
      basePath,
      shippingMethod
    );
    return response.data;
  } catch (error) {
    console.error('Error creating shipping method:', error);
    throw error;
  }
};

export const updateShippingMethod = async (
  id: number,
  shippingMethod: ShippingMethodReq
): Promise<ApiResponse<ShippingMethod>> => {
  try {
    const response = await api.put<ApiResponse<ShippingMethod>>(
      `${basePath}/${id}`,
      shippingMethod
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating shipping method with ID ${id}:`, error);
    throw error;
  }
};

export const deleteShippingMethod = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(`${basePath}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting shipping method with ID ${id}:`, error);
    throw error;
  }
};
