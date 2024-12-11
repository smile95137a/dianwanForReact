/// <reference types="vite/client" />
interface ApiResponse<T> {
  code: string;
  message: string;
  success: boolean;
  data: T;
}

interface ShippingMethod {
  shippingMethodId: number;
  name: string;
  createDate: string;
  updateDate: string;
  minSize: number;
  maxSize: number;
  shippingPrice: number;
}

interface ShippingMethodReq {
  shippingMethodId?: number;
  name: string;
  description: string;
  status: number;
  minSize: number;
  maxSize: number;
  shippingPrice: number;
}

interface News {
  newsUid: string; // 新聞的唯一識別碼
  title: string; // 新聞標題
  preview: string; // 新聞預覽
  content: string; // 新聞內容
  createdDate: string; // 新聞創建日期
  updatedDate?: string; // 新聞更新日期（可選）
  imageUrls: (string | File)[]; // 圖片 URL 列表
  status: NewsStatus; // 新聞的狀態
  author: string; // 作者
}

interface VendorOrderEntity {
  vendorOrder: string;
  orderNo: string;
  errorCode: string;
  errorMessage: string;
  express: string;
  status: string;
}
