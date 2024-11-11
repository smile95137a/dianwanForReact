// src/interfaces/banner.ts

import { ProductType } from './product';

export enum BannerStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
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