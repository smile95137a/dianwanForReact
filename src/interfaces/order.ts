export enum OrderStatus {
  PREPARING_SHIPMENT = "PREPARING_SHIPMENT",
  SHIPPED = "SHIPPED"
}

export interface Order {
  id: number; // 訂單唯一識別碼
  orderNumber: string; // 訂單編號
  userId: number; // 用戶 ID
  totalAmount: string; // 總金額
  shippingCost: number | null; // 運費
  isFreeShipping: boolean | null; // 是否免運費
  bonusPointsEarned: number | null; // 獲得的獎勳點數
  bonusPointsUsed: number | null; // 使用的獎勳點數
  createdAt: string; // 創建日期
  updatedAt: string | null; // 更新日期
  paidAt: string | null; // 支付日期
  resultStatus: string; // 訂單狀態
  paymentMethod: string | null; // 支付方式
  shippingMethod: string | null; // 運送方式
  shippingName: string; // 收貨人姓名
  shippingEmail: string | null; // 收貨人郵箱
  shippingPhone: string; // 收貨人電話
  shippingZipCode: string | null; // 收貨地址郵政編碼
  shippingCity: string | null; // 收貨城市
  shippingArea: string | null; // 收貨區域
  shippingAddress: string | null; // 收貨地址
  billingZipCode: string | null; // 帳單地址郵政編碼
  billingName: string | null; // 帳單姓名
  billingEmail: string | null; // 帳單郵箱
  billingPhone: string | null; // 帳單電話
  billingCity: string | null; // 帳單城市
  billingArea: string | null; // 帳單區域
  billingAddress: string | null; // 帳單地址
  invoice: string | null; // 發票資訊
  trackingNumber: string | null; // 物流追蹤號
  cartItemIds: string | null; // 購物車項目 ID
  express: string | null; // 快遞方式
  shopId: string; // 店鋪 ID
  opmode: string; // 通路代號
}


export interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  storeProductId: number;
  storeProductName: string;
  productDetailName: string;
  quantity: number;
  unitPrice: number;
  resultStatus: string;
  resultItemId: number;
  bonusPointsEarned: number | null;
}

// OrderDetail Interface
interface OrderDetail {
  orderDetailId: number;
  productId: number | null;
  productName: string;
  quantity: number;
  productDetailName: string | null;
  unitPrice: number;
  totalPrice: number;
  storeProduct: StoreProduct | null;
  productDetailRes: ProductDetailRes | null;
  imageUrls: string[];
}

// StoreProduct Interface
interface StoreProduct {
  storeProductId: number;
  productCode: string | null;
  productName: string;
  description: string;
  details: string | null;
  specification: string | null;
  price: number;
  specialPrice: number | null;
  isSpecialPrice: boolean | null;
  stockQuantity: number;
  soldQuantity: number | null;
  imageUrls: string[];
}

// ProductDetailRes Interface
interface ProductDetailRes {
  productDetailId: number | null;
  productId: number | null;
  description: string | null;
  note: string | null;
  size: string | null;
  quantity: number | null;
  stockQuantity: number | null;
  productName: string;
  grade: string | null;
  price: number | null;
  sliverPrice: number | null;
  imageUrls: string[];
}
