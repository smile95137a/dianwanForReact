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

export const getAllCategories = async (): Promise<
  ApiResponse<StoreCategoryListApiResponse>
> => {
  try {
    const response = await api.get<ApiResponse<StoreCategoryListApiResponse>>(
      `${categoryBasePath}/all`
    );
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
