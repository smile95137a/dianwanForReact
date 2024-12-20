import {
  StoreCategory,
  StoreCategoryApiResponse,
  StoreCategoryListApiResponse,
  StoreProductApiResponse,
  StoreProductListApiResponse,
} from '@/interfaces/store';
import { ApiResponse } from '@/interfaces/admin';
import { api } from './BackendAPI';

const productBasePath = '/storeProduct';
const categoryBasePath = '/category';

export const createStoreProduct2 = async (
  req: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${productBasePath}/add2`,
      req
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
export const updateStoreProduct2 = async (
  req: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${productBasePath}/update2`,
      req
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const uploadStoreProductImg = async (
  list: (File | string)[],
  storeProductId: number
): Promise<ApiResponse<string[]>> => {
  try {
    const formData = new FormData();
    formData.append('storeProductId', storeProductId.toString());

    list.forEach((item) => {
      if (item instanceof File) {
        formData.append('files', item);
      } else if (typeof item === 'string') {
        formData.append('existingUrls', item); // Adjust key if needed
      }
    });

    const response = await api.post<ApiResponse<string[]>>(
      `${productBasePath}/uploadProductImg`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
};

export const getAllStoreProducts = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(
      `${productBasePath}/all`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }
};

export const addStoreProduct = async (
  formData: FormData
): Promise<ApiResponse<StoreProductApiResponse>> => {
  try {
    const response = await api.post<ApiResponse<StoreProductApiResponse>>(
      `${productBasePath}/add`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding store product:', error);
    throw error;
  }
};

export const updateStoreProduct = async (
  id: number,
  formData: FormData
): Promise<ApiResponse<StoreProductApiResponse>> => {
  try {
    const response = await api.put<ApiResponse<StoreProductApiResponse>>(
      `${productBasePath}/update/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating store product:', error);
    throw error;
  }
};

export const deleteStoreProduct = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${productBasePath}/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting store product:', error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${categoryBasePath}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (
  id: number
): Promise<ApiResponse<StoreCategoryApiResponse>> => {
  try {
    const response = await api.get<ApiResponse<StoreCategoryApiResponse>>(
      `${categoryBasePath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const createCategory = async (category: {
  categoryName: string;
}): Promise<ApiResponse<StoreCategoryApiResponse>> => {
  try {
    const response = await api.post<ApiResponse<StoreCategoryApiResponse>>(
      categoryBasePath,
      category
    );
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  category: StoreCategory
): Promise<ApiResponse<StoreCategoryApiResponse>> => {
  try {
    const response = await api.put<ApiResponse<StoreCategoryApiResponse>>(
      `${categoryBasePath}/${id}`,
      category
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${categoryBasePath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getImageUrl = (imagePath: string): string => {
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${import.meta.env.VITE_BASE_API_URL3}/${cleanPath}`;
};

export const fetchReportData = async (
  reportType: any,
  startDate: any,
  endDate: any,
  groupType: any
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.get('/reports', {
      params: {
        reportType: reportType,
        startDate: startDate,
        endDate: endDate,
        groupType: groupType,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const exportReportData = async (
  reportType: any,
  startDate: any,
  endDate: any,
  groupType: any
) => {
  try {
    const response = await api.get('/reports/export', {
      params: {
        reportType: reportType,
        startDate: startDate,
        endDate: endDate,
        groupType: groupType,
      },
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
