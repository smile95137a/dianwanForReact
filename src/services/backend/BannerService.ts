import { api } from './BackendAPI';

const basePath = '/banner';

export const getAllBanners = async (): Promise<ApiResponse<Banner[]>> => {
  try {
    const response = await api.get<ApiResponse<Banner[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const createBanner = async (
  bannerData: any
): Promise<ApiResponse<Banner>> => {
  try {
    const formData = new FormData();
    formData.append('bannerReq', JSON.stringify(bannerData));

    const response = await api.post<ApiResponse<Banner>>(basePath, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBanner = async (
  bannerUid: string,
  bannerData: BannerReq
): Promise<ApiResponse<Banner>> => {
  try {
    const formData = new FormData();
    formData.append('bannerReq', JSON.stringify(bannerData));

    const response = await api.put<ApiResponse<Banner>>(
      `${basePath}/${bannerUid}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBanner = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(`${basePath}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

export enum BannerStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface Banner {
  bannerId: number;
  bannerUid: string;
  productId: number;
  status: BannerStatus;
  productType: ProductType;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BannerReq {
  productId: number;
  status: BannerStatus;
  productType: ProductType;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}

export type BannerApiResponse = ApiResponse<Banner>;
export type BannerListApiResponse = ApiResponse<Banner[]>;

// 用於創建或更新 Banner 的表單數據
export interface BannerFormData {
  productId: number;
  status: BannerStatus;
  productType: ProductType;
}

export enum ProductType {
  PRIZE = 'PRIZE',
  GACHA = 'GACHA',
  BLIND_BOX = 'BLIND_BOX',
  CUSTMER_PRIZE = 'CUSTMER_PRIZE',
}
