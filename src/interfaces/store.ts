import { ApiResponse } from '@/interfaces/admin';

export enum StoreProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface StoreProductReq {
  storeProductId?: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: (string | File)[];
  categoryId: string;
  width: number;
  height: number;
  length: number;
  specification: string;
  shippingMethod: string;
  specialPrice: number;
  status: StoreProductStatus;
  shippingPrice: number;
  size: number;
  details: string; // 商品詳情
}

export interface StoreProductRes {
  storeProductId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string[];
  categoryId: string;
  width: number;
  height: number;
  length: number;
  specification: string;
  shippingMethod: string;
  specialPrice: number;
  status: StoreProductStatus;
  shippingPrice: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  details: string; // 商品詳情
}
export interface StoreCategory {
  categoryId: number;
  categoryName: string;
}

export type StoreProductApiResponse = ApiResponse<StoreProductRes>;
export type StoreProductListApiResponse = ApiResponse<StoreProductRes[]>;
export type StoreCategoryApiResponse = ApiResponse<StoreCategory>;
export type StoreCategoryListApiResponse = ApiResponse<StoreCategory[]>;

// Interface for file upload
export interface StoreProductFormData {
  productReq: string; // JSON string
  images: File[];
}