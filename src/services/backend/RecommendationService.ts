import { api } from './BackendAPI';
import { ApiResponse } from '@/interfaces/product';
import {
  ProductRecommendationMapping,
  StoreProductRecommendation,
} from '@/interfaces/recommand';

const mappingBasePath = '/recommendation-mapping';
const recommendationBasePath = '/recommendation';

export const getAllRecommendationMappings = async (): Promise<
  ApiResponse<ProductRecommendationMapping[]>
> => {
  try {
    const response = await api.get<ApiResponse<ProductRecommendationMapping[]>>(
      `${mappingBasePath}/all`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all recommendation mappings:', error);
    throw error;
  }
};

export const getRecommendationMappingById = async (
  id: number
): Promise<ApiResponse<ProductRecommendationMapping>> => {
  try {
    const response = await api.get<ApiResponse<ProductRecommendationMapping>>(
      `${mappingBasePath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendation mapping by ID:', error);
    throw error;
  }
};

export const createRecommendationMapping = async (
  mapping: Omit<ProductRecommendationMapping, 'id'>
): Promise<ApiResponse<ProductRecommendationMapping>> => {
  try {
    const response = await api.post<ApiResponse<ProductRecommendationMapping>>(
      mappingBasePath,
      mapping
    );
    return response.data;
  } catch (error) {
    console.error('Error creating recommendation mapping:', error);
    throw error;
  }
};

export const updateRecommendationMapping = async (
  id: number,
  mapping: Partial<ProductRecommendationMapping>
): Promise<ApiResponse<ProductRecommendationMapping>> => {
  try {
    const response = await api.put<ApiResponse<ProductRecommendationMapping>>(
      `${mappingBasePath}/${id}`,
      mapping
    );
    return response.data;
  } catch (error) {
    console.error('Error updating recommendation mapping:', error);
    throw error;
  }
};

export const deleteRecommendationMapping = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${mappingBasePath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting recommendation mapping:', error);
    throw error;
  }
};

export const getAllStoreRecommendations = async (): Promise<
  ApiResponse<StoreProductRecommendation[]>
> => {
  try {
    const response = await api.get<ApiResponse<StoreProductRecommendation[]>>(
      `${recommendationBasePath}/all`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all store recommendations:', error);
    throw error;
  }
};
