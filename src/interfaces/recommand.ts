// recommand.ts

import { PrizeCategory, ProductStatus, ProductCategory } from '@/interfaces/product';

export enum ProductType {
    PRIZE = 'PRIZE',
    GACHA = 'GACHA',
    BLIND_BOX = 'BLIND_BOX',
}

export interface ProductRecommendationMapping {
    id?: number;
    storeProductId: number;
    storeProductRecommendationId: number;
    createdDate?: number[] | null;
    updatedDate?: number[] | null;
    createdUser?: string | null;
    updateUser?: string | null;
    productName?: string | null;
    recommendationName?: string | null;
    imageUrl?: string; // 添加這個字段來處理圖片URL
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    success: boolean;
    data: T | null;
}

export interface StoreProductRecommendation {
    id: number;
    recommendationName: string;
    createdDate: number[] | null;
    updatedDate: number[] | null;
    createdUser: string | null;
    updateUser: string | null;
}

export interface StoreProductRes {
    storeProductId: number;
    productName: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string[]; // 注意這裡是數組
    categoryId: string;
    width: number;
    height: number;
    length: number;
    specification: string;
    productType: ProductType;
}

export interface ProductRes {
    productId: number;
    productName: string;
    description: string;
    price: number;
    sliverPrice: number;
    stockQuantity: number;
    imageUrls: string[];
    productType: ProductType;
    prizeCategory: PrizeCategory;
    status: string | ProductStatus;
    bonusPrice: number;
    specification: string;
    category: ProductCategory | null;
    categoryId: number | null;
}

export type ProductListApiResponse = ApiResponse<ProductRes[]>;