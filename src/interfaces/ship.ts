export interface ShippingMethod {
    shippingMethodId: number;
    name: string;
    description: string;
    status: number;
    createDate: string;
    updateDate: string;
    minSize: number;
    maxSize: number;
    shippingPrice: number;
  }
  
  export interface ShippingMethodReq {
    shippingMethodId?: number;
    name: string;
    description: string;
    status: number;
    minSize: number;
    maxSize: number;
    shippingPrice: number;
  }
  
  export interface ApiResponse<T> {
    code: number;
    message: string | null;
    data: T | null;
  }